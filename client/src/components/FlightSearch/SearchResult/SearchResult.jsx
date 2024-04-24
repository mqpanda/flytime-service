import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styles from './SearchResult.module.scss';
import departure from '../../../images/departure.svg';
import arrow from '../../../images/arrow.svg';
import alarm from '../../../images/alarm.svg';
import arrowStop from '../../../images/Component2.svg';

const SearchResult = ({ searchResult }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [availableSeats, setAvailableSeats] = useState([]);
  const [occupiedSeats, setOccupiedSeats] = useState([]);
  useEffect(() => {
    const fetchFlightData = async () => {
      if (selectedFlight) {
        try {
          const response = await fetch(
            `http://localhost:5001/api/flights/${selectedFlight._id}`
          );
          const data = await response.json();
          setAvailableSeats(
            Array.from(
              { length: data.flight.totalSeats },
              (_, index) => index + 1
            )
          );

          // Fetch occupied seats information
          const occupiedResponse = await fetch(
            `http://localhost:5001/api/flights/bookings/occupied-seats/${selectedFlight._id}`
          );
          const occupiedData = await occupiedResponse.json();
          console.log('Occupied Seats:', occupiedData);
          setOccupiedSeats(occupiedData.occupiedSeats);
        } catch (error) {
          console.error('Error fetching flight data:', error);
        }
      }
    };

    fetchFlightData();
  }, [selectedFlight]);

  const formatTime = (timeString) => {
    const date = new Date(timeString);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
    return `${formattedHours}h ${minutes}min ${ampm}`;
  };

  const formatDate = (dateString) => {
    const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    const date = new Date(dateString);
    const dayOfWeek = daysOfWeek[date.getDay()];

    const options = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    };
    const formattedDate = date.toLocaleDateString('ru-RU', options);

    return `${formattedDate} (${dayOfWeek})`;
  };

  const calculateTotalPrice = (flight) => {
    let totalPrice = 0;

    if (flight.direct !== false) {
      totalPrice = flight.price;
    } else {
      for (const leg of flight.legs) {
        totalPrice += leg.flight.price;
      }
    }

    return totalPrice;
  };

  const calculateFlightDuration = (departureTime, arrivalTime) => {
    const departure = new Date(departureTime);
    const arrival = new Date(arrivalTime);
    const duration = arrival - departure;
    const hours = Math.floor(duration / (1000 * 60 * 60));
    const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}`;
  };

  const calculateTransferTime = (legs) => {
    const firstArrival = new Date(legs[0].flight.arrivalTime);
    const secondDeparture = new Date(legs[1].flight.departureTime);
    const waitingTime = secondDeparture - firstArrival;
    const hours = Math.floor(waitingTime / (1000 * 60 * 60));
    const minutes = Math.floor((waitingTime % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}`;
  };

  const openModal = (flight) => {
    setSelectedFlight(flight);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedFlight(null);
    setShowModal(false);
  };

  const handleSeatClick = (seatNumber) => {
    const seatString = String(seatNumber);
    if (occupiedSeats.includes(seatString)) {
      console.log(`Место ${seatString} уже занято.`);
    } else {
      console.log('Место успешно выбрано:', seatString);
      // Здесь можно добавить дополнительную логику для выбора места
    }
  };

  return (
    <div className={styles.result}>
      {searchResult.flights.map((flight, index) => (
        <div
          key={index}
          className={styles.resultElement}
          onClick={() => openModal(flight)}
        >
          {flight.direct !== false ? (
            <>
              <div className={styles.resultElementInfo}>
                <div>
                  <p>{flight.departureAirport}</p>
                  <p>{formatTime(flight.departureTime)}</p>
                  <p>{formatDate(flight.departureTime)}</p>
                </div>
                <div className={styles.travelInfo}>
                  <div>
                    <img src={departure} alt="departure" />
                  </div>
                  <div className={styles.flightInfo}>
                    <div className={styles.flightDuration}>
                      <img src={alarm} alt="alarm" />
                      {calculateFlightDuration(
                        flight.departureTime,
                        flight.arrivalTime
                      )}
                    </div>
                    <img src={arrow} alt="" />
                    <div className={styles.flightDuration}>Direct</div>
                  </div>
                  <div>
                    <img src={departure} alt="departure" />
                  </div>
                </div>
                <div>
                  <p>{flight.arrivalAirport}</p>
                  <p>{formatTime(flight.arrivalTime)}</p>
                  <p>{formatDate(flight.arrivalTime)}</p>
                </div>
                <div>DIRECT</div>
                <div>{calculateTotalPrice(flight)}$</div>
              </div>
              <div className={styles.infoElement}>Info airlines</div>
            </>
          ) : (
            <div className={styles.resultElementInfo}>
              <div>
                <p>{flight.legs[0].flight.departureAirport}</p>
                <p>{formatTime(flight.legs[0].flight.departureTime)}</p>
                <p>{formatDate(flight.legs[0].flight.departureTime)}</p>
              </div>
              <div className={styles.travelInfo}>
                <div>
                  <img src={departure} alt="departure" />
                </div>
                <div className={styles.flightInfo}>
                  <div className={styles.flightDuration}>
                    <img src={alarm} alt="alarm" />
                    {calculateFlightDuration(
                      flight.legs[0].flight.departureTime,
                      flight.legs[flight.legs.length - 1].flight.arrivalTime
                    )}
                  </div>
                  <img src={arrowStop} alt="" />
                  <div className={styles.flightDuration}>
                    {flight.legs[0].flight.arrivalAirport} (
                    {calculateTransferTime(flight.legs)})
                  </div>
                </div>
                <div>
                  <img src={departure} alt="departure" />
                </div>
              </div>
              <div>
                <p>
                  {flight.legs[flight.legs.length - 1].flight.arrivalAirport}
                </p>
                <p>
                  {formatTime(
                    flight.legs[flight.legs.length - 1].flight.arrivalTime
                  )}
                </p>
                <p>
                  {formatDate(
                    flight.legs[flight.legs.length - 1].flight.arrivalTime
                  )}
                </p>
              </div>
              <div>1 STOP</div>
              <div>{calculateTotalPrice(flight)}$</div>
            </div>
          )}
        </div>
      ))}

      {showModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>Available Seats for Flight {selectedFlight.flightNumber}</h2>
            <div className={styles.seatsContainer}>
              {[...Array(Math.ceil(availableSeats.length / 6)).keys()].map(
                (rowIndex) => (
                  <div key={rowIndex} className={styles.seatRow}>
                    {availableSeats
                      .slice(rowIndex * 6, rowIndex * 6 + 6)
                      .map((seatNumber) => (
                        <button
                          key={seatNumber}
                          className={`${styles.seat} ${
                            occupiedSeats.includes(String(seatNumber)) // Преобразуем номер места в строку
                              ? styles.occupiedSeat
                              : ''
                          }`}
                          onClick={
                            () =>
                              !occupiedSeats.includes(String(seatNumber)) && // Преобразуем номер места в строку
                              handleSeatClick(String(seatNumber)) // Преобразуем номер места в строку при передаче в функцию
                          }
                          disabled={occupiedSeats.includes(String(seatNumber))} // Преобразуем номер места в строку
                        >
                          {seatNumber}
                        </button>
                      ))}
                  </div>
                )
              )}
            </div>
            <button onClick={closeModal}>Close Modal</button>
          </div>
        </div>
      )}
    </div>
  );
};

SearchResult.propTypes = {
  searchResult: PropTypes.shape({
    flights: PropTypes.arrayOf(
      PropTypes.shape({
        direct: PropTypes.bool,
        flightNumber: PropTypes.string,
        aircraft: PropTypes.string,
        departureAirport: PropTypes.string,
        arrivalAirport: PropTypes.string,
        departureTime: PropTypes.string,
        arrivalTime: PropTypes.string,
        legs: PropTypes.arrayOf(
          PropTypes.shape({
            type: PropTypes.string,
            flight: PropTypes.shape({
              flightNumber: PropTypes.string,
              aircraft: PropTypes.string,
              departureAirport: PropTypes.string,
              arrivalAirport: PropTypes.string,
              departureTime: PropTypes.string,
              arrivalTime: PropTypes.string,
            }),
          })
        ),
      })
    ),
  }),
};

export default SearchResult;
