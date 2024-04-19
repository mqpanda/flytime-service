// BookingList.js

import { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './BookingList.module.scss';

const BookingList = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const accountId = localStorage.getItem('accountId');
      const token = localStorage.getItem('token');
      if (!accountId || !token) {
        throw new Error('Account ID or token not found in local storage');
      }

      const response = await axios.get(
        `http://localhost:5001/api/flights/bookings/${accountId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Fetch passenger data and flight information for each booking
      const bookingsWithFullData = await Promise.all(
        response.data.map(async (booking) => {
          const [passengerResponse, flightResponse] = await Promise.all([
            axios.get(
              `http://localhost:5001/api/passenger/flight/${booking.passenger}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            ),
            axios.get(`http://localhost:5001/api/flights/${booking.flight}`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }),
          ]);

          const passengerData = passengerResponse.data;
          const flightData = flightResponse.data.flight; // Обратите внимание на flightData
          console.log(flightData);
          return { ...booking, passengerData, flightData };
        })
      );

      setBookings(bookingsWithFullData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching bookings:', error.message);
    }
  };

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <div className={styles['booking-list-container']}>
      <h2 className={styles['booking-list-header']}>Bookings</h2>

      {bookings.length === 0 ? (
        <div>No bookings found for this account</div>
      ) : (
        <ul className={styles['booking-list']}>
          {bookings.map((booking) => (
            <li key={booking._id} className={styles['booking-item']}>
              <div className={styles['booking-item-info']}>
                <div>Flight: {booking.flightData.flightNumber}</div>
                <div> Aircraft: {booking.flightData.aircraft}</div>
                <div>
                  Departure Airport: {booking.flightData.departureAirport}
                </div>
                <div>Arrival Airport: {booking.flightData.arrivalAirport}</div>
                <div>
                  Departure Time:
                  {new Date(booking.flightData.departureTime).toLocaleString()}
                </div>
                <div>
                  Arrival Time:
                  {new Date(booking.flightData.arrivalTime).toLocaleString()}
                </div>
                <div>Price: ${booking.flightData.price}</div>
                <div>Seat Number: {booking.seatNumber}</div>
                <div>Passenger Name: {booking.passengerData.first_name}</div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BookingList;
