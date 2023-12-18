// BlogPosts.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './BlogPosts.module.scss';
import BlogFilters from '../BlogFilters/BlogFilters';

const BlogPosts = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [posts, setPosts] = useState([]);
  const [selectedTag, setSelectedTag] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(9);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/posts');

        // Sort posts by creation date in descending order
        const sortedPosts = response.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        setPosts(sortedPosts);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, []);

  useEffect(() => {
    const pageParam = new URLSearchParams(location.search).get('page');
    const newPage = pageParam ? parseInt(pageParam, 10) : 1;
    setCurrentPage(newPage);
  }, [location.search]);

  const handleTagClick = (tag) => {
    setSelectedTag(tag);
    setCurrentPage(1);
    navigate(`/blog?page=1`);
  };

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    navigate(`/blog?page=${pageNumber}`);
    window.scrollTo(0, 0);
  };

  const formatDate = (createdAt) => {
    const dateObject = new Date(createdAt);
    const year = dateObject.getFullYear();
    const month = String(dateObject.getMonth() + 1).padStart(2, '0');
    const day = String(dateObject.getDate()).padStart(2, '0');
    return `${day}.${month}.${year}`;
  };

  const renderPaginationButtons = () => {
    const filteredPosts =
      selectedTag === 'All'
        ? posts
        : posts.filter((post) => post.tags.includes(selectedTag));
    const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
    const maxVisiblePages = 3;

    const buttons = [];

    // Calculate start and end pages to show the current page and its two neighbors
    let startPage = Math.max(1, currentPage - 1);
    let endPage = Math.min(startPage + maxVisiblePages - 1, totalPages);

    // If there are not enough pages to fill the maxVisiblePages, adjust the startPage
    startPage = Math.max(1, endPage - maxVisiblePages + 1);

    // Render page buttons
    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={(e) => {
            e.preventDefault();
            paginate(i);
          }}
          className={currentPage === i ? styles.active : ''}
        >
          {i}
        </button>
      );
    }

    return buttons;
  };

  const filterPosts = () => {
    const filteredPosts =
      selectedTag === 'All'
        ? posts
        : posts.filter((post) => post.tags.includes(selectedTag));
    return filteredPosts.slice(
      (currentPage - 1) * postsPerPage,
      currentPage * postsPerPage
    );
  };

  return (
    <div>
      <BlogFilters onFilterClick={handleTagClick} selectedTag={selectedTag} />
      <div className={styles.postsContainer}>
        {filterPosts().map((post) => (
          <div className={styles.post} key={post._id}>
            <img src={`http://localhost:5001/${post.imageUrl}`} alt="Post" />
            <div className={styles.info}>
              <h3 className={styles.title}>{post.title}</h3>
              <div className={styles.subinfo}>
                <p>by {post.account ? post.account.email : 'Unknown Author'}</p>
                <p>{formatDate(post.createdAt)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className={styles.pagination}>{renderPaginationButtons()}</div>
    </div>
  );
};

export default BlogPosts;
