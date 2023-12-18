import { useState, useEffect } from 'react';

import axios from 'axios';
import RegisterModal from '../Common/Modal/Register/RegisterModal';
import styles from './Header.module.scss'; // Adjust the path to your header styles
import { Link } from 'react-router-dom';
import Modal from 'react-modal';

Modal.setAppElement('#root'); // Set your root element's id here

const Header = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [notification, setNotification] = useState(null);
  const [isRegisterMode, setRegisterMode] = useState(true);
  const [isAuthenticated, setAuthenticated] = useState(
    !!localStorage.getItem('token')
  );
  const [isBurgerVisible, setBurgerVisible] = useState(false);
  const [userRole, setUserRole] = useState(''); // Add userRole state

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('userRole');
    if (token && role) {
      setAuthenticated(true);
      setUserRole(role);
    }
  }, []);

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
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        throw new Error('Invalid email address');
      }

      if (password.length < 8) {
        throw new Error('Password must be at least 8 characters long');
      }

      const response = await axios.post('http://localhost:5001/api/register', {
        email: email,
        password: password,
      });

      console.log('Registration successful:', response.data);

      setNotification({ type: 'success', message: 'Registration successful!' });

      await handleLogin();
    } catch (error) {
      if (
        axios.isAxiosError(error) &&
        error.response &&
        error.response.status === 409
      ) {
        console.error('User already exists:', error.message);

        setNotification({
          type: 'error',
          message: 'User already exists. Please use a different email.',
        });
      } else {
        console.error('Registration failed:', error.message);

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

      const { token, role } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('userRole', role); // Set user's role in local storage

      setAuthenticated(true);
      setUserRole(role);
      closeModal();
    } catch (error) {
      console.error('Login failed:', error.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setAuthenticated(false);
  };

  const toggleMode = () => {
    setRegisterMode((prevMode) => !prevMode);
    setNotification(null);
  };

  const toggleBurger = () => {
    setBurgerVisible((prevVisible) => !prevVisible);
  };

  return (
    <div className={styles.header}>
      <div className={styles.burgerIcon} onClick={toggleBurger}>
        <span>&#9776;</span>
      </div>
      <h2 className={styles.logo}>
        <Link to="/">
          <span className={styles.logoColor}>fly</span>time
        </Link>
      </h2>
      <nav
        className={`${styles.navbarContainer} ${
          isBurgerVisible ? styles.showBurger : ''
        }`}
      >
        <ul
          className={`${styles.navbar} ${
            isAuthenticated ? styles.authenticated : ''
          }`}
        >
          <li>Flights</li>
          <li>Popular destinations</li>
          <li>
            <Link to="/blog">Blog</Link>
          </li>
          {isAuthenticated && userRole === 'air carrier' && (
            <li>
              <Link to="/my-posts">My Posts</Link>
            </li>
          )}

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
