// BlogFilters.
import styles from './BlogFilters.module.scss';
import PropTypes from 'prop-types';

const BlogFilters = ({ onFilterClick, selectedTag }) => {
  const handleButtonClick = (tag) => {
    onFilterClick(tag);
  };

  return (
    <div className={styles.blogFilters}>
      <button
        onClick={() => handleButtonClick('All')}
        className={selectedTag === 'All' ? styles.btnChecked : ''}
      >
        All
      </button>
      <button
        onClick={() => handleButtonClick('Travel tips')}
        className={selectedTag === 'Travel tips' ? styles.btnChecked : ''}
      >
        Travel tips
      </button>
      <button
        onClick={() => handleButtonClick('News')}
        className={selectedTag === 'News' ? styles.btnChecked : ''}
      >
        News
      </button>
      <button
        onClick={() => handleButtonClick('Guides')}
        className={selectedTag === 'Guides' ? styles.btnChecked : ''}
      >
        Guides
      </button>
      <button
        onClick={() => handleButtonClick('Inspiration')}
        className={selectedTag === 'Inspiration' ? styles.btnChecked : ''}
      >
        Inspiration
      </button>
      <button
        onClick={() => handleButtonClick('Airport tips')}
        className={selectedTag === 'Airport tips' ? styles.btnChecked : ''}
      >
        Airport tips
      </button>
    </div>
  );
};

BlogFilters.propTypes = {
  onFilterClick: PropTypes.func.isRequired,
  selectedTag: PropTypes.string.isRequired,
};

export default BlogFilters;
