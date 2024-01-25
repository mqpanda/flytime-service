// NewPostPage.js

import { useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import styles from './NewPostPage.module.scss';

const NewPostPage = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [newPost, setNewPost] = useState({
    title: '',
    text: '',
    tags: [],
    imageUrl: null,
  });

  const handleCreatePost = async (e) => {
    e.preventDefault();

    // Split tags into an array
    const tagsArray = newPost.tags.split(',').map((tag) => tag.trim());

    const formData = new FormData();
    formData.append('title', newPost.title);
    formData.append('text', newPost.text);

    // Send tags as an array
    formData.append('tags', JSON.stringify(tagsArray));

    formData.append('imageUrl', newPost.imageUrl);

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

      // Optionally, reset the new post form
      setNewPost({
        title: '',
        text: '',
        tags: [],
        imageUrl: null,
      });

      // Navigate back to the list of posts after successful creation
      navigate('/my-posts');
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const openFileInput = () => {
    fileInputRef.current.click(); // Click the hidden file input when the custom button is clicked
  };

  return (
    <div className={styles.container}>
      <h1>Create New Post</h1>
      <div className={styles.tools}>
        <div className={styles.formBlock}>
          <form onSubmit={handleCreatePost}>
            <div className={styles.labelContainer}>
              <label>
                <div className={styles.toolName}>Title:</div>
                <input
                  className={styles.inputField}
                  type="text"
                  value={newPost.title}
                  onChange={(e) =>
                    setNewPost({ ...newPost, title: e.target.value })
                  }
                />
              </label>
            </div>
            <div className={styles.labelContainer}>
              <label>
                <div className={styles.fileInputContainer}>
                  <div className={styles.toolName}>Preview:</div>

                  {newPost.imageUrl && (
                    <div className={styles.previewImageContainer}>
                      <img
                        src={URL.createObjectURL(newPost.imageUrl)}
                        alt="Preview"
                        className={styles.previewImage}
                      />
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={openFileInput}
                    className={styles.customFileButton}
                  >
                    Choose File
                  </button>
                  <input
                    type="file"
                    onChange={(e) =>
                      setNewPost({ ...newPost, imageUrl: e.target.files[0] })
                    }
                    ref={fileInputRef}
                    className={styles.hiddenFileInput}
                  />
                </div>
              </label>
            </div>
            <div className={styles.labelContainer}>
              <label>
                <div className={styles.toolName}>Text:</div>
                <textarea
                  className={styles.textInfo}
                  value={newPost.text}
                  onChange={(e) =>
                    setNewPost({ ...newPost, text: e.target.value })
                  }
                />
              </label>
            </div>
            <div className={styles.labelContainer}>
              <label>
                <div className={styles.toolName}>Tags:</div>
                <input
                  className={styles.inputField}
                  type="text"
                  value={newPost.tags}
                  onChange={(e) =>
                    setNewPost({ ...newPost, tags: e.target.value })
                  }
                />
              </label>
            </div>

            <div>
              <button className={styles.postButton} type="submit">
                Create Post
              </button>
            </div>
          </form>
        </div>
        <div className={styles.preShow}>
          <ReactMarkdown>{newPost.text}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

export default NewPostPage;
