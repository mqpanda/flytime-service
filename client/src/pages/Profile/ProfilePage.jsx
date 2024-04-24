import BookingList from '../../components/BookingList/BookingList';
import PassengerList from '../../components/PassengerList/PassengerList';
import styles from './ProfilePage.module.scss';
import { Navigate } from 'react-router-dom';

const Profile = () => {
  const isAuthenticated = !!localStorage.getItem('token');

  if (!isAuthenticated) {
    // Redirect to the homepage or another appropriate page
    return <Navigate to="/" />;
  }

  return (
    <div className={styles.container}>
      <BookingList></BookingList>
      <PassengerList></PassengerList>
    </div>
  );
};

export default Profile;
