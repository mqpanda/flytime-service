import { useState } from 'react';
import axios from 'axios';
import RegisterModal from '../Common/Modal/Register/RegisterModal';
import styles from './Register.module.scss';

const Register = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [notification, setNotification] = useState(null);
  const [isRegisterMode, setRegisterMode] = useState(true);

  const openModal = () => {
    setModalOpen(true);
    setNotification(null); // Clear any existing notifications when opening the modal
  };

  const closeModal = () => {
    setModalOpen(false);
    setNotification(null); // Clear any existing notifications when closing the modal
  };

  const handleAction = async () => {
    if (isRegisterMode) {
      await handleRegister();
    } else {
      // Handle sign-in
      // Implement your sign-in logic here
    }
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

  const toggleMode = () => {
    setRegisterMode((prevMode) => !prevMode);
    setNotification(null); // Clear any existing notifications when toggling mode
  };

  return (
    <div>
      <button onClick={openModal}>Register</button>

      <RegisterModal isOpen={isModalOpen} onClose={closeModal}>
        <div className={styles.container}>
          <h1 className={styles.textHeader}>
            {isRegisterMode ? 'SIGN UP' : 'SIGN IN'}
          </h1>
          <div>
            <p>
              {isRegisterMode
                ? 'Sign up using your email address below to get started'
                : 'Sign in using your credentials'}
            </p>
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
            {isRegisterMode && (
              <p className={styles.conditions}>
                By creating an account in flytime you are agreeing to{' '}
                <a>the terms and conditions</a>
              </p>
            )}
            <button className={styles.button} onClick={handleAction}>
              {isRegisterMode ? 'Create account' : 'Sign in'}
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
            {isRegisterMode
              ? 'Already have an account? '
              : "Don't have an account? "}
            <a className="signin" onClick={toggleMode}>
              <b>{isRegisterMode ? 'Sign in' : 'Sign up'}</b>
            </a>
          </p>
        </div>
      </RegisterModal>
    </div>
  );
};

export default Register;
