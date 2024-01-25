// BlogPost.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import styles from './BlogPost.module.scss';

const BlogPost = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5001/api/posts/${postId}`
        );
        setPost(response.data);
      } catch (error) {
        console.error('Error fetching post:', error);
      }
    };

    fetchPost();
  }, [postId]);

  if (!post) {
    return <p>Loading...</p>;
  }

  const formatDate = (createdAt) => {
    const dateObject = new Date(createdAt);
    const year = dateObject.getFullYear();
    const month = String(dateObject.getMonth() + 1).padStart(2, '0');
    const day = String(dateObject.getDate()).padStart(2, '0');
    const hours = String(dateObject.getHours()).padStart(2, '0');
    const minutes = String(dateObject.getMinutes()).padStart(2, '0');

    return `${day}.${month}.${year} ${hours}:${minutes}`;
  };

  return (
    <div>
      <img
        className={styles.image}
        src={`http://localhost:5001/${post.imageUrl}`}
        alt="Post"
      />
      <div className={styles.container}>
        <div>
          <Link className={styles.linkMenu} to={`/`}>
            Home
          </Link>
          <span className={styles.linkMenu}>|</span>
          <Link to={`/blog`}>Blog</Link>
        </div>
        <h1>{post.title}</h1>

        <ReactMarkdown>{post.text}</ReactMarkdown>

        <div className={styles.footerContainer}>
          <div className={styles.leftSide}>
            <div>
              <div className={styles.tagsContainer}>
                {post.tags.map((tag, index) => (
                  <span key={index} className={styles.tag}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <p>Views: {post.viewsCount}</p>
          </div>
          <div className={styles.rightSide}>
            <p className={styles.author}>{post.account.email}</p>
            <p>{formatDate(post.createdAt)}</p>
            {/* <p>Updated At: {formatDate(post.updatedAt)}</p> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPost;
