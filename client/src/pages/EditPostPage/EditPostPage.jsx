// EditPostPage.js

import { useState, useEffect, useRef } from 'react'; // Import useRef
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import styles from './EditPostPage.module.scss';

const EditPostPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [editedPost, setEditedPost] = useState({
    title: '',
    text: '',
    tags: [],
    imageUrl: null,
  });

  const fileInputRef = useRef(null); // Define fileInputRef

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5001/api/posts/${id}`
        );
        const post = response.data;

        setEditedPost({
          title: post.title,
          text: post.text,
          tags: post.tags.join(', '),
          imageUrl: post.imageUrl, // You may want to handle image editing separately
        });
      } catch (error) {
        console.error('Error fetching post for editing:', error);
      }
    };

    fetchPost();
  }, [id]);

  const openFileInput = () => {
    fileInputRef.current.click(); // Click the hidden file input when the custom button is clicked
  };

  const handleEditPost = async (e) => {
    e.preventDefault();

    const tagsArray = editedPost.tags.split(',').map((tag) => tag.trim());

    const formData = new FormData();
    formData.append('title', editedPost.title);
    formData.append('text', editedPost.text);
    formData.append('tags', JSON.stringify(tagsArray));
    formData.append('imageUrl', editedPost.imageUrl);

    try {
      const token = localStorage.getItem('token');

      if (!token) {
        console.error('User not authenticated');
        return;
      }

      await axios.put(`http://localhost:5001/api/posts/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      // Optionally, reset the edited post form
      setEditedPost({
        title: '',
        text: '',
        tags: [],
        imageUrl: null,
      });

      // Navigate back to the list of posts after successful editing
      navigate('/my-posts');
    } catch (error) {
      console.error('Error editing post:', error);
    }
  };

  return (
    <div className={styles.container}>
      <h1>Edit Post</h1>
      <div className={styles.tools}>
        <div className={styles.formBlock}>
          <form onSubmit={handleEditPost}>
            <div className={styles.labelContainer}>
              <label>
                <div className={styles.toolName}>Title:</div>
                <input
                  className={styles.inputField}
                  type="text"
                  value={editedPost.title}
                  onChange={(e) =>
                    setEditedPost({ ...editedPost, title: e.target.value })
                  }
                />
              </label>
            </div>
            <div className={styles.labelContainer}>
              <div className={styles.toolName}>Preview:</div>

              {editedPost.imageUrl && (
                <div className={styles.previewImageContainer}>
                  {typeof editedPost.imageUrl === 'object' ? (
                    <img
                      src={URL.createObjectURL(editedPost.imageUrl)}
                      alt="Preview"
                      className={styles.previewImage}
                    />
                  ) : (
                    <img
                      src={`http://localhost:5001/${editedPost.imageUrl}`}
                      alt="Post"
                      className={styles.previewImage}
                    />
                  )}
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
                onChange={(e) => {
                  const file = e.target.files[0];
                  setEditedPost({ ...editedPost, imageUrl: file });
                }}
                ref={fileInputRef}
                className={styles.hiddenFileInput}
              />
            </div>

            <div className={styles.labelContainer}>
              <label>
                <div className={styles.toolName}>Text:</div>
                <textarea
                  className={styles.textInfo}
                  value={editedPost.text}
                  onChange={(e) =>
                    setEditedPost({ ...editedPost, text: e.target.value })
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
                  value={editedPost.tags}
                  onChange={(e) =>
                    setEditedPost({ ...editedPost, tags: e.target.value })
                  }
                />
              </label>
            </div>

            <div>
              <button className={styles.postButton} type="submit">
                Save Changes
              </button>
            </div>
          </form>
        </div>
        <div className={styles.preShow}>
          <ReactMarkdown>{editedPost.text}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

export default EditPostPage;
