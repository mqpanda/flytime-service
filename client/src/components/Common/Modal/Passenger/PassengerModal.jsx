import { useState } from 'react';
import ReactModal from 'react-modal';
import axios from 'axios';
import PropTypes from 'prop-types';
import close from '../../../../images/close.svg';
import styles from './PassengerModal.module.scss';

const AddPassengerModal = ({ isOpen, onClose, onAddPassenger }) => {
  const [newPassengerData, setNewPassengerData] = useState({
    first_name: '',
    last_name: '',
    phone_number: '',
    passport_id: '',
  });

  const handleInputChange = (e) => {
    setNewPassengerData({
      ...newPassengerData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddPassenger = async () => {
    try {
      const accountId = localStorage.getItem('accountId');
      const token = localStorage.getItem('token');
      if (!accountId || !token) {
        throw new Error('Account ID or token not found in local storage');
      }

      const response = await axios.post(
        `http://localhost:5001/api/passenger`,
        newPassengerData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      onAddPassenger(response.data);
      setNewPassengerData({
        first_name: '',
        last_name: '',
        phone_number: '',
        passport_id: '',
      });
      onClose();
    } catch (error) {
      console.error('Error adding passenger:', error.message);
    }
  };

  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onClose}
      overlayClassName={styles.overlay}
      className={styles.modal}
      shouldCloseOnOverlayClick={true}
    >
      <button className={styles.closeButton} onClick={onClose}>
        <img src={close} alt="Close" />
      </button>
      <div className={styles.content}>
        <h2>Add New Passenger</h2>
        <div>
          <input
            type="text"
            name="first_name"
            placeholder="First Name"
            value={newPassengerData.first_name}
            onChange={handleInputChange}
            className={styles.inputField}
          />
          <input
            type="text"
            name="last_name"
            placeholder="Last Name"
            value={newPassengerData.last_name}
            onChange={handleInputChange}
            className={styles.inputField}
          />
          <input
            type="text"
            name="phone_number"
            placeholder="Phone Number"
            value={newPassengerData.phone_number}
            onChange={handleInputChange}
            className={styles.inputField}
          />
          <input
            type="text"
            name="passport_id"
            placeholder="Passport ID"
            value={newPassengerData.passport_id}
            onChange={handleInputChange}
            className={styles.inputField}
          />
          <button className={styles.button} onClick={handleAddPassenger}>
            Add Passenger
          </button>
        </div>
      </div>
    </ReactModal>
  );
};

AddPassengerModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onAddPassenger: PropTypes.func.isRequired,
};

export default AddPassengerModal;
