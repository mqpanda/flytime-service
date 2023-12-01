import { useState } from 'react';
import axios from 'axios';
import RegisterModal from '../Common/Modal/RegisterModal';
import styles from './Register.module.scss';

const Register = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [notification, setNotification] = useState(null);

  const openModal = () => {
    setModalOpen(true);
    setNotification(null); // Clear any existing notifications when opening the modal
  };

  const closeModal = () => {
    setModalOpen(false);
    setNotification(null); // Clear any existing notifications when closing the modal
  };

  const handleRegister = async () => {
    try {
      // Basic email validation
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        throw new Error('Invalid email address');
      }

      // Basic password length validation
      if (password.length < 8) {
        throw new Error('Password must be at least 8 characters long');
      }

      const response = await axios.post('http://localhost:5001/api/register', {
        email: email,
        password: password,
      });

      // Handle successful registration
      console.log('Registration successful:', response.data);

      // Display success notification
      setNotification({ type: 'success', message: 'Registration successful!' });

      // Close the modal after a delay
      setTimeout(() => {
        closeModal();
      }, 2000);
    } catch (error) {
      if (
        axios.isAxiosError(error) &&
        error.response &&
        error.response.status === 409
      ) {
        // User already exists (409 conflict)
        console.error('User already exists:', error.message);

        // Display user exists notification
        setNotification({
          type: 'error',
          message: 'User already exists. Please use a different email.',
        });
      } else {
        // Other registration errors
        console.error('Registration failed:', error.message);

        // Display error notification
        setNotification({ type: 'error', message: error.message });
      }
    }
  };

  return (
    <div>
      <button onClick={openModal}>Register</button>

      <RegisterModal isOpen={isModalOpen} onClose={closeModal}>
        <div className={styles.container}>
          <h1 className={styles.textHeader}>SIGN UP</h1>
          <div>
            <p>Sign up using your email address below to get started</p>
            <div className={styles.inputFields}>
              <input
                placeholder="Email"
                className={styles.inputField}
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                placeholder="Password"
                className={styles.inputField}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <p className={styles.conditions}>
              By creating an account in flytime you are agreeing to{' '}
              <a>the terms and conditions</a>
            </p>
            <button className={styles.button} onClick={handleRegister}>
              Create account
            </button>
          </div>
          <div className={styles.notification}>
            {notification && (
              <div
                className={
                  notification.type === 'success'
                    ? styles.success
                    : styles.error
                }
              >
                {notification.message}
              </div>
            )}
          </div>
          <p>
            Already have an account?{' '}
            <a className="signin" href="#">
              <b>Sign in</b>
            </a>
          </p>
        </div>
      </RegisterModal>
    </div>
  );
};

export default Register;
