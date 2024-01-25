import Flight from '../models/Flight.js';

export const createFlight = async (req, res) => {
  try {
    const {
      aircraft,
      flightNumber,
      departureAirport,
      arrivalAirport,
      departureTime,
      arrivalTime,
      totalSeats,
    } = req.body;

    const existingFlight = await Flight.findOne({
      aircraft,
      flightNumber,
      departureAirport,
      arrivalAirport,
      departureTime,
      arrivalTime,
    });

    if (existingFlight) {
      return res.status(409).json({
        message: 'Flight with the same details already exists',
      });
    }

    const newFlight = new Flight({
      aircraft,
      flightNumber,
      departureAirport,
      arrivalAirport,
      departureTime: new Date(departureTime),
      arrivalTime: new Date(arrivalTime),
      totalSeats,
    });

    const savedFlight = await newFlight.save();

    res.status(201).json({
      message: 'Flight created successfully',
      flight: savedFlight,
    });
  } catch (error) {
    console.error('Error creating flight:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const getFlights = async (req, res) => {
  try {
    const flights = await Flight.find();
    res.status(200).json({ flights });
  } catch (error) {
    console.error('Error getting flights:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const getFlightsByParam = async (req, res) => {
  try {
    const {
      departureAirport,
      arrivalAirport,
      departureTime,
      numberOfPassengers,
    } = req.query;

    const directFilters = {
      departureAirport,
      arrivalAirport,
      departureTime: {
        $gte: new Date(departureTime),
        $lt: new Date(departureTime).setHours(23, 59, 59, 999),
      },
    };

    const intermediateAirports = await Flight.distinct('arrivalAirport', {
      departureAirport,
      arrivalAirport: { $ne: arrivalAirport },
      departureTime: { $gte: new Date(departureTime) },
    });

    const timeBetweenFlights = 60 * 60 * 1000; // 1 hour

    const flights = [];

    // Direct Flights
    const directFlights = await Flight.find(directFilters);
    const availableDirectFlights = directFlights.filter(
      (flight) => flight.totalSeats - flight.occupiedSeats >= numberOfPassengers
    );

    // One-Stop Flights
    for (const intermediateAirport of intermediateAirports) {
      const firstLegFilters = {
        departureAirport,
        arrivalAirport: intermediateAirport,
        departureTime: { $gte: new Date(departureTime) },
      };

      const firstLegFlights = await Flight.find(firstLegFilters);

      for (const firstLegFlight of firstLegFlights) {
        const secondLegFilters = {
          departureAirport: intermediateAirport,
          arrivalAirport,
          departureTime: {
            $gte: new Date(
              firstLegFlight.arrivalTime.getTime() + timeBetweenFlights
            ),
            $lt: new Date(
              firstLegFlight.arrivalTime.getTime() + 24 * 60 * 60 * 1000
            ),
          },
        };

        const secondLegFlights = await Flight.find(secondLegFilters);

        for (const secondLegFlight of secondLegFlights) {
          if (
            secondLegFlight.departureAirport === intermediateAirport &&
            secondLegFlight.departureTime > firstLegFlight.arrivalTime
          ) {
            const totalSeatsAvailable =
              firstLegFlight.totalSeats -
              firstLegFlight.occupiedSeats +
              secondLegFlight.totalSeats -
              secondLegFlight.occupiedSeats;

            if (totalSeatsAvailable >= numberOfPassengers) {
              flights.push({
                direct: false,
                legs: [
                  { flight: firstLegFlight, type: 'firstLeg' },
                  { flight: secondLegFlight, type: 'secondLeg' },
                ],
              });
            }
          }
        }
      }
    }

    res.status(200).json({ flights: [...availableDirectFlights, ...flights] });
  } catch (error) {
    console.error('Error getting flights:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
