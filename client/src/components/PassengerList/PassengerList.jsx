import { useState, useEffect } from 'react';
import axios from 'axios';
import AddPassengerModal from '../Common/Modal/Passenger/PassengerModal';
import styles from './PassengerList.module.scss';

const PassengerList = () => {
  const [passengers, setPassengers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
      setLoading(false);
    } catch (error) {
      console.error('Error fetching passengers:', error.message);
    }
  };

  const handleAddPassenger = (newPassenger) => {
    setPassengers([...passengers, newPassenger]);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleDeletePassenger = async (passengerId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token not found in local storage');
      }

      await axios.delete(`http://localhost:5001/api/passenger/${passengerId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPassengers(
        passengers.filter((passenger) => passenger._id !== passengerId)
      );
    } catch (error) {
      console.error('Error deleting passenger:', error.message);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.passengerList}>
      <h2>Passengers</h2>

      <ul>
        {passengers.map((passenger) => (
          <li key={passenger._id}>
            {passenger.first_name} {passenger.last_name}
            <button
              className={styles.deleteButton}
              onClick={() => handleDeletePassenger(passenger._id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
      <button className={styles.addButton} onClick={handleOpenModal}>
        Add Passenger
      </button>
      <AddPassengerModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onAddPassenger={handleAddPassenger}
      />
    </div>
  );
};

export default PassengerList;
