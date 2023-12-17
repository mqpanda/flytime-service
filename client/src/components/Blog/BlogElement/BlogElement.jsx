import styles from './BlogFilters.module.scss';

const BlogElement = () => {
  return (
    <div className={styles.blogFilters}>
      <button className={styles.btnChecked}>All</button>
      <button>Travel tips</button>
      <button>News</button>
      <button>Guides</button>
      <button>Inspiration</button>
      <button>Airport tips</button>
    </div>
  );
};

export default BlogElement;
