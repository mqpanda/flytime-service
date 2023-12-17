import BlogFilters from '../../components/Blog/BlogFilters/BlogFilters';
import styles from './Blog.module.scss';

const Blog = () => {
  return (
    <div className={styles.container}>
      <h1>BLOG</h1>
      <BlogFilters />
    </div>
  );
};

export default Blog;
