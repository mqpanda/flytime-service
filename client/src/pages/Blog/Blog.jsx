import BlogPosts from '../../components/Blog/BlogPosts/BlogPosts';

import styles from './Blog.module.scss';

const Blog = () => {
  return (
    <div className={styles.container}>
      <h1>BLOG</h1>
      <BlogPosts />
    </div>
  );
};

export default Blog;
