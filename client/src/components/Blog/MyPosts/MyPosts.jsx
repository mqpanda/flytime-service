import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation, Link } from 'react-router-dom';

import styles from './MyPosts.module.scss';
import BlogFilters from '../BlogFilters/BlogFilters';

const MyPosts = () => {
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
    navigate(`/my-posts?page=1`);
  };

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    navigate(`/my-posts?page=${pageNumber}`);
    window.scrollTo(0, 0);
  };

  const formatDate = (createdAt) => {
    const dateObject = new Date(createdAt);
    const year = dateObject.getFullYear();
    const month = String(dateObject.getMonth() + 1).padStart(2, '0');
    const day = String(dateObject.getDate()).padStart(2, '0');
    return `${day}.${month}.${year}`;
  };

  const deletePost = async (postId) => {
    try {
      // Send a DELETE request to delete the post
      await axios.delete(`http://localhost:5001/api/posts/${postId}`);

      // After successful deletion, fetch the updated list of posts
      const response = await axios.get('http://localhost:5001/api/posts');
      const sortedPosts = response.data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setPosts(sortedPosts);

      // You may also want to update the pagination and re-render the posts
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const handleEditClick = (postId) => {
    navigate(`/edit-post/${postId}`);
  };

  const renderPaginationButtons = () => {
    const filteredPosts =
      selectedTag === 'All'
        ? posts
        : posts.filter((post) => post.tags.includes(selectedTag));
    const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

    // Don't render pagination if there's only one page
    if (totalPages <= 1) {
      return null;
    }

    const maxVisiblePages = 3;
    let buttons = [];

    let startPage = Math.max(1, currentPage - 1);
    let endPage = Math.min(startPage + maxVisiblePages - 1, totalPages);
    startPage = Math.max(1, endPage - maxVisiblePages + 1);

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

  const openNewPostPage = () => {
    navigate('/new-post'); // Navigate to the new post page
  };

  return (
    <div>
      <BlogFilters onFilterClick={handleTagClick} selectedTag={selectedTag} />

      {/* Button to navigate to the new post page */}
      <button className={styles.postButton} onClick={openNewPostPage}>
        Create New Post
      </button>

      <div className={styles.postsContainer}>
        {filterPosts().map((post) => (
          <div key={post._id} className={styles.post}>
            <Link to={`/blog/${post._id}`} className={styles.postLink}>
              <img src={`http://localhost:5001/${post.imageUrl}`} alt="Post" />
              <div className={styles.info}>
                <h3 className={styles.title}>{post.title}</h3>
                <div className={styles.subinfo}>
                  <p>
                    by {post.account ? post.account.email : 'Unknown Author'}
                  </p>
                  <p>{formatDate(post.createdAt)}</p>
                </div>
              </div>
            </Link>
            <div className={styles.tools}>
              <button
                onClick={() => handleEditClick(post._id)}
                className={styles.button}
              >
                Edit Post
              </button>
              <button
                onClick={() => deletePost(post._id)}
                className={styles.button}
              >
                Delete Post
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className={styles.pagination}>{renderPaginationButtons()}</div>
    </div>
  );
};

export default MyPosts;
