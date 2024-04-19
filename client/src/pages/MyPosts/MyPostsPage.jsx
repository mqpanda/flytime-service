import { Navigate } from 'react-router-dom';
import MyPosts from '../../components/Blog/MyPosts/MyPosts';

import styles from './MyPostsPage.module.scss';

const MyPostsPage = () => {
  const isAuthenticated = !!localStorage.getItem('token');

  if (!isAuthenticated) {
    // Redirect to the homepage or another appropriate page
    return <Navigate to="/" />;
  }

  return (
    <div className={styles.container}>
      <h1>MY POSTS</h1>
      <MyPosts />
    </div>
  );
};

export default MyPostsPage;
