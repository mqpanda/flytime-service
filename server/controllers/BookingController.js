import Booking from '../models/Booking.js';
import Flight from '../models/Flight.js';
import Passenger from '../models/Passenger.js';

export const bookSeat = async (req, res) => {
  try {
    // Проверяем, что все необходимые поля предоставлены
    if (
      !req.body.passengerId ||
      !req.body.flightId ||
      !req.body.seatNumber ||
      !req.body.accountId
    ) {
      return res
        .status(400)
        .json({ message: 'All required fields must be provided' });
    }

    // Проверяем, существует ли рейс
    const flight = await Flight.findById(req.body.flightId);
    if (!flight) {
      return res.status(404).json({ message: 'Flight not found' });
    }

    // Проверяем, есть ли свободные места на рейсе
    if (flight.occupiedSeats >= flight.totalSeats) {
      return res
        .status(400)
        .json({ message: 'No available seats on this flight' });
    }

    // Проверяем, не занято ли уже выбранное место
    const existingBooking = await Booking.findOne({
      flight: req.body.flightId,
      seatNumber: req.body.seatNumber,
    });

    if (existingBooking) {
      return res.status(400).json({ message: 'This seat is already booked' });
    }

    // Проверяем, не забронирован ли уже пассажир на этом рейсе
    const passengerBooking = await Booking.findOne({
      flight: req.body.flightId,
      passenger: req.body.passengerId,
    });

    if (passengerBooking) {
      return res
        .status(400)
        .json({ message: 'This passenger is already booked on this flight' });
    }

    // Создаем бронирование
    const newBooking = new Booking({
      flight: req.body.flightId,
      passenger: req.body.passengerId,
      seatNumber: req.body.seatNumber,
      account: req.body.accountId, // Сохраняем информацию об аккаунте
    });

    // Сохраняем бронирование
    const savedBooking = await newBooking.save();

    // Обновляем информацию о занятых местах на рейсе
    flight.occupiedSeats += 1;
    await flight.save();

    res.status(201).json(savedBooking);
  } catch (error) {
    console.error('Error booking seat:', error);
    res.status(500).json({ message: 'Error booking seat' });
  }
};

export const getBookingsByAccountId = async (req, res) => {
  try {
    // Проверяем, что accountId предоставлен
    if (!req.params.accountId) {
      return res.status(400).json({ message: 'Account ID must be provided' });
    }

    // Ищем бронирования по accountId
    const bookings = await Booking.find({ account: req.params.accountId });

    // Проверяем, найдены ли бронирования
    if (!bookings || bookings.length === 0) {
      return res
        .status(404)
        .json({ message: 'No bookings found for this account' });
    }

    res.status(200).json(bookings);
  } catch (error) {
    console.error('Error fetching bookings by account:', error);
    res.status(500).json({ message: 'Error fetching bookings by account' });
  }
};

export const getOccupiedSeatsByFlightId = async (req, res) => {
  try {
    // Проверяем, что flightId предоставлен
    if (!req.params.flightId) {
      return res.status(400).json({ message: 'Flight ID must be provided' });
    }

    // Ищем бронирования для данного рейса
    const bookings = await Booking.find({ flight: req.params.flightId });

    // Проверяем, найдены ли бронирования
    if (!bookings || bookings.length === 0) {
      return res
        .status(404)
        .json({ message: 'No bookings found for this flight' });
    }

    // Получаем массив занятых мест из бронирований
    const occupiedSeats = bookings.map((booking) => booking.seatNumber);

    res.status(200).json({ occupiedSeats });
  } catch (error) {
    console.error('Error fetching occupied seats by flight:', error);
    res
      .status(500)
      .json({ message: 'Error fetching occupied seats by flight' });
  }
};
