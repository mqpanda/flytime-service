import MyPosts from '../../components/Blog/MyPosts/MyPosts';

import styles from './MyPostsPage.module.scss';

const MyPostsPage = () => {
  return (
    <div className={styles.container}>
      <h1>MY POSTS</h1>
      <MyPosts />
    </div>
  );
};

export default MyPostsPage;
