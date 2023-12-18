// Доделать окно добавления постов!!!

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

import styles from './MyPosts.module.scss';
import BlogFilters from '../BlogFilters/BlogFilters';
import NewPostModal from '../../Common/Modal/NewPost/NewPostModal';

const MyPosts = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [posts, setPosts] = useState([]);
  const [selectedTag, setSelectedTag] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(9);

  const [newPost, setNewPost] = useState({
    title: '',
    text: '',
    tags: '',
    imageUrl: null,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchPosts = async () => {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        console.error('User not authenticated');
        return;
      }

      const response = await axios.get(
        'http://localhost:5001/api/posts-by-account',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    const pageParam = new URLSearchParams(location.search).get('page');
    const newPage = pageParam ? parseInt(pageParam, 10) : 1;
    setCurrentPage(newPage);
  }, [location.search]);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', newPost.title);
    formData.append('text', newPost.text);
    formData.append('tags', newPost.tags);
    formData.append('imageUrl', newPost.imageUrl); // Ensure this matches the field name specified in upload.single()

    try {
      const token = localStorage.getItem('token');

      if (!token) {
        console.error('User not authenticated');
        return;
      }

      await axios.post('http://localhost:5001/api/post/add', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      // After successful creation, fetch the updated list of posts
      fetchPosts();
      // Optionally, reset the new post form
      setNewPost({
        title: '',
        text: '',
        tags: '',
        imageUrl: null,
      });
      // Close the modal
      closeModal();
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

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

  const renderPaginationButtons = () => {
    const filteredPosts =
      selectedTag === 'All'
        ? posts
        : posts.filter((post) => post.tags.includes(selectedTag));
    const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
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

  return (
    <div>
      <BlogFilters onFilterClick={handleTagClick} selectedTag={selectedTag} />

      {/* Button to open the modal */}
      <button className={styles.postButton} onClick={openModal}>
        Create New Post
      </button>

      {/* NewPostModal component */}
      <NewPostModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={handleCreatePost}
      >
        {/* Form fields for creating a new post */}
        <h1>Add Post</h1>
        <label>
          <div>Title:</div>
          <input
            type="text"
            value={newPost.title}
            onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
          />
        </label>
        <label>
          <div>Text:</div>
          <textarea
            value={newPost.text}
            onChange={(e) => setNewPost({ ...newPost, text: e.target.value })}
          />
        </label>
        <label>
          <div>Tags:</div>
          <input
            type="text"
            value={newPost.tags}
            onChange={(e) => setNewPost({ ...newPost, tags: e.target.value })}
          />
        </label>
        <input
          type="file"
          onChange={(e) =>
            setNewPost({ ...newPost, imageUrl: e.target.files[0] })
          }
        />{' '}
        *
      </NewPostModal>

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

export default MyPosts;
