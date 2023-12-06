import { useState } from 'react';
import axios from 'axios';
import RegisterModal from '../Common/Modal/Register/RegisterModal';
import styles from './Header.module.scss'; // Adjust the path to your header styles

const Header = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [notification, setNotification] = useState(null);
  const [isRegisterMode, setRegisterMode] = useState(true);
  const [isAuthenticated, setAuthenticated] = useState(
    !!localStorage.getItem('token')
  );

  const closeModal = () => {
    setModalOpen(false);
    setNotification(null);
  };

  const openSignInModal = () => {
    setModalOpen(true);
    setRegisterMode(false);
    setNotification(null);
  };

  const openSignUpModal = () => {
    setModalOpen(true);
    setRegisterMode(true);
    setNotification(null);
  };

  const handleAction = async () => {
    if (isRegisterMode) {
      await handleRegister();
    } else {
      await handleLogin();
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

      // Automatically log in the user after registration
      await handleLogin();
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

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:5001/api/login', {
        email: email,
        password: password,
      });

      // Assuming your backend returns a token and role upon successful login
      const { token } = response.data;

      // Save the token to local storage or wherever you handle authentication
      localStorage.setItem('token', token);

      setAuthenticated(true);

      // Close the modal
      closeModal();
    } catch (error) {
      // Handle login error (e.g., show an error message)
      console.error('Login failed:', error.message);
    }
  };

  const handleLogout = () => {
    // Implement your logout logic here
    // Clear the authentication token from local storage
    localStorage.removeItem('token');
    // Update the authentication status
    setAuthenticated(false);
    // Redirect or update the UI as needed
  };

  const toggleMode = () => {
    setRegisterMode((prevMode) => !prevMode);
    setNotification(null);
  };

  return (
    <div className={styles.header}>
      <h2 className={styles.logo}>
        <span className={styles.logoColor}>fly</span>time
      </h2>
      <nav>
        <ul className={styles.navbar}>
          <li>Flights</li>
          <li>Popular destinations</li>
          <li>Blog</li>
          {!isAuthenticated && (
            <li>
              <button className={styles.signin} onClick={openSignInModal}>
                Sign in
              </button>
            </li>
          )}
          {!isAuthenticated && (
            <li>
              <button className={styles.signup} onClick={openSignUpModal}>
                Sign up
              </button>
            </li>
          )}
          {isAuthenticated && (
            <li>
              <button className={styles.profile}>
                {/* <img
                  className={styles.profileImg}
                  src={profile}
                  alt="profile"
                /> */}
                <li>Profile</li>
              </button>
            </li>
          )}
          {isAuthenticated && (
            <li>
              <button className={styles.signup} onClick={handleLogout}>
                Logout
              </button>
            </li>
          )}
        </ul>
      </nav>

      {/* Assuming the RegisterModal component is styled with the styles imported */}
      <RegisterModal isOpen={isModalOpen} onClose={closeModal}>
        <div className={styles.container}>
          <h1 className={styles.textHeader}>
            {isRegisterMode ? 'SIGN UP' : 'SIGN IN'}
          </h1>
          <div>
            <p>
              {isRegisterMode
                ? 'Sign up using your email address below to get started'
                : 'Hello again! To start a new adventure please fill in the information'}
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

export default Header;
