import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styles from './SearchResult.module.scss';
import departure from '../../../images/departure.svg';
import arrow from '../../../images/arrow.svg';
import alarm from '../../../images/alarm.svg';
import arrowStop from '../../../images/Component2.svg';
import flag from '../../../images/Frame1349.png';
import company from '../../../images/LOT.png';
import star from '../../../images/star_rate.png';
import done from '../../../images/done.png';

import axios from 'axios';

const SearchResult = ({ searchResult }) => {
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [availableSeats, setAvailableSeats] = useState([]);
  const [occupiedSeats, setOccupiedSeats] = useState([]);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [passengerIdInput, setPassengerIdInput] = useState('');
  const [passengers, setPassengers] = useState([]); // Состояние для хранения пассажиро
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState(null);
  const [showDirectFlightModal, setShowDirectFlightModal] = useState(false);
  const [showTransferFlightModal, setShowTransferFlightModal] = useState(false);
  const [selectedTransferFlight, setSelectedTransferFlight] = useState(null);
  const [selectedTransferSeat, setSelectedTransferSeat] = useState(null);
  const [occupiedSeatsInTransferFlight, setOccupiedSeatsInTransferFlight] =
    useState([]);

  useEffect(() => {
    fetchPassengers();
  }, []);

  const fetchPassengers = async () => {
    try {
      const accountId = localStorage.getItem('accountId');
      const token = localStorage.getItem('token');
      if (!accountId || !token) {
        throw new Error('Account ID or token not found in local storage');
      }

      const response = await axios.get(
        `http://localhost:5001/api/passenger/${accountId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPassengers(response.data);
    } catch (error) {
      console.error('Error fetching passengers:', error.message);
    }
  };

  const handleTransferSeatClick = (seatNumber) => {
    const seatString = String(seatNumber);
    if (occupiedSeatsInTransferFlight.includes(seatString)) {
      console.log(`Место ${seatString} уже занято.`);
    } else {
      console.log('Место успешно выбрано:', seatString);
      setSelectedTransferSeat(seatString);
    }
  };
  // Получаем accountId из localStorage
  const accountId = localStorage.getItem('accountId');

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
    return `${formattedHours} h ${minutes} min (${ampm})`;
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
    if (flight.direct !== false) {
      setShowDirectFlightModal(true);
    } else {
      setShowTransferFlightModal(true);
    }
  };

  const closeModal = () => {
    setSelectedFlight(null);
    setShowDirectFlightModal(false);
    setShowTransferFlightModal(false);
  };

  const handleSeatClick = (seatNumber) => {
    const seatString = String(seatNumber);
    if (occupiedSeats.includes(seatString)) {
      console.log(`Место ${seatString} уже занято.`);
    } else {
      console.log('Место успешно выбрано:', seatString);
      setSelectedSeat(seatString);
    }
  };

  // Внутри компонента SearchResult

  const handleConfirmTransferBooking = async () => {
    if (selectedTransferSeat) {
      try {
        const response = await fetch(
          'http://localhost:5001/api/flight/booking',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              flightId: selectedTransferFlight._id,
              passengerId: passengerIdInput,
              accountId: accountId,
              seatNumber: selectedTransferSeat,
            }),
          }
        );
        if (response.ok) {
          console.log('Бронь успешно создана');
          setBookingSuccess(true);
        } else {
          console.error('Ошибка при создании брони:', response.statusText);
          setBookingError(
            'Ошибка при создании брони. Пожалуйста, попробуйте еще раз.'
          );
        }
      } catch (error) {
        console.error('Ошибка при создании брони:', error);
      }
    } else {
      console.log('Выберите место перед бронированием');
    }
  };

  const renderSeatsInTransferFlight = () => {
    const totalSeats = selectedTransferFlight.totalSeats;
    const seats = [];
    for (let i = 1; i <= totalSeats; i++) {
      const isOccupied = occupiedSeatsInTransferFlight.includes(String(i));
      const isSelected = selectedTransferSeat === String(i);
      seats.push(
        <button
          key={i}
          className={`${styles.seat} ${isOccupied ? styles.occupiedSeat : ''} ${
            isSelected ? styles.selectedSeat : ''
          }`}
          disabled={isOccupied}
          onClick={() => handleTransferSeatClick(i)}
        >
          {i}
        </button>
      );
    }
    return seats;
  };

  const handleConfirmBooking = async () => {
    if (selectedSeat) {
      try {
        const response = await fetch(
          'http://localhost:5001/api/flight/booking',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              flightId: selectedFlight._id,
              passengerId: passengerIdInput,
              accountId: accountId,
              seatNumber: selectedSeat,
            }),
          }
        );
        if (response.ok) {
          console.log('Бронь успешно создана');
          setBookingSuccess(true);
        } else {
          console.error('Ошибка при создании брони:', response.statusText);
          setBookingError(
            'Ошибка при создании брони. Пожалуйста, попробуйте еще раз.'
          );
        }
      } catch (error) {
        console.error('Ошибка при создании брони:', error);
      }
    } else {
      console.log('Выберите место перед бронированием');
    }
  };

  const handleTransferFlightSelection = async (selectedLeg) => {
    // Сохраняем выбранный рейс с пересадками
    setSelectedTransferFlight(selectedLeg.flight);

    try {
      // Получаем информацию о занятых местах в выбранном рейсе с пересадками
      const response = await fetch(
        `http://localhost:5001/api/flights/bookings/occupied-seats/${selectedLeg.flight._id}`
      );
      const data = await response.json();
      setOccupiedSeatsInTransferFlight(data.occupiedSeats);
    } catch (error) {
      console.error('Error fetching occupied seats in transfer flight:', error);
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
                  <p className={styles.departureAirport}>
                    {flight.departureAirport}
                  </p>
                  <p className={styles.departureTime}>
                    {formatTime(flight.departureTime)}
                  </p>
                  <p className={styles.departureDate}>
                    {formatDate(flight.departureTime)}
                  </p>
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
            <div>
              <div className={styles.resultElementInfo}>
                <div className={styles.flagBlock}>
                  <div>
                    <img src={flag} alt="" />
                  </div>
                  <div className={styles.aLeft}>
                    <p className={styles.departureAirport}>
                      {flight.legs[0].flight.departureAirport}
                    </p>
                    <p className={styles.departureTime}>
                      {formatTime(flight.legs[0].flight.departureTime)}
                    </p>
                    <p className={styles.departureDate}>
                      {formatDate(flight.legs[0].flight.departureTime)}
                    </p>
                  </div>
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
                <div className={styles.flagBlock}>
                  <div>
                    <img src={flag} alt="" />
                  </div>
                  <div className={styles.aLeft}>
                    <p className={styles.departureAirport}>
                      {
                        flight.legs[flight.legs.length - 1].flight
                          .arrivalAirport
                      }
                    </p>
                    <p className={styles.departureTime}>
                      {formatTime(
                        flight.legs[flight.legs.length - 1].flight.arrivalTime
                      )}
                    </p>
                    <p className={styles.departureDate}>
                      {formatDate(
                        flight.legs[flight.legs.length - 1].flight.arrivalTime
                      )}
                    </p>
                  </div>
                </div>
                <div className={styles.stop}>1 STOP</div>
                <div>
                  <div className={styles.price}>
                    {calculateTotalPrice(flight)}$
                  </div>
                  <div className={styles.firstPrice}>720$</div>
                </div>
              </div>
              <div className={styles.footerResult}>
                <img src={company} alt="" />
                <div className={styles.aCenter}>
                  <img style={{ paddingLeft: 40 }} src={star} alt="" />
                  <img src={star} alt="" />
                  <p className={styles.pr40}>business class</p>
                </div>
                <div className={styles.aCenter}>
                  <p style={{ paddingRight: 10 }}>
                    Free cancellation within 24 h of booking
                  </p>
                  <img src={done} alt="" />
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
      {showDirectFlightModal && (
        <div className={styles.modal}>
          <div className={styles.directModalContent}>
            <h2>Available Seats for Flight {selectedFlight.flightNumber}</h2>

            <select
              value={passengerIdInput}
              onChange={(e) => setPassengerIdInput(e.target.value)}
            >
              <option value="">Выберите пассажира</option>
              {passengers.map((passenger) => (
                <option key={passenger._id} value={passenger._id}>
                  {passenger.last_name} {passenger.first_name}
                </option>
              ))}
            </select>
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
            {bookingSuccess && <div>Бронь успешно создана!</div>}
            {bookingError && <div className={styles.error}>{bookingError}</div>}

            <div className={styles.btnBlock}>
              <button className={styles.close} onClick={handleConfirmBooking}>
                Book
              </button>
              <button className={styles.close} onClick={closeModal}>
                Close Modal
              </button>
            </div>
          </div>
        </div>
      )}

      {showTransferFlightModal && (
        <div className={styles.modal}>
          <div className={styles.transferModalContent}>
            <h2>Transfer Flights</h2>
            <select
              value={passengerIdInput}
              onChange={(e) => setPassengerIdInput(e.target.value)}
            >
              <option value="">Выберите пассажира</option>
              {passengers.map((passenger) => (
                <option key={passenger._id} value={passenger._id}>
                  {passenger.last_name} {passenger.first_name}
                </option>
              ))}
            </select>
            {/* Создаем кнопки для каждого рейса с пересадками */}
            {selectedFlight.legs.map((leg, index) => (
              <button
                key={index}
                onClick={() => handleTransferFlightSelection(leg)}
                className={styles.transferFlightButton}
              >
                {leg.flight.departureAirport} - {leg.flight.arrivalAirport}
              </button>
            ))}
            {/* Выводим места в рейсе с пересадками */}
            {selectedTransferFlight && (
              <div>
                <h3>
                  Available Seats for Flight{' '}
                  {selectedTransferFlight.flightNumber}
                </h3>
                <div className={styles.seatsContainer}>
                  {renderSeatsInTransferFlight()}
                </div>
              </div>
            )}
            {bookingSuccess && <div>Бронь успешно создана!</div>}
            {bookingError && <div className={styles.error}>{bookingError}</div>}

            <button
              className={styles.close}
              onClick={handleConfirmTransferBooking}
            >
              Book
            </button>
            <button className={styles.close} onClick={closeModal}>
              Close Modal
            </button>
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
