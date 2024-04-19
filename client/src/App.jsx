// App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import Blog from './pages/Blog/Blog';
import SearchResult from './pages/SearchResult/SearchResult';
import Register from './components/Register/Register';
import Header from './components/Header/Header';
import NewPostPage from './pages/NewPost/NewPostPage';

import MyPostsPage from './pages/MyPosts/MyPostsPage';
import BlogPost from './components/Blog/BlogPost/BlogPost';
import EditPostPage from './pages/EditPostPage/EditPostPage';
import ProfilePage from './pages/Profile/ProfilePage';
import Footer from './components/Footer/Footer';
import FlightSearch from './components/FlightSearch/FlightSearch';

const App = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/register" element={<Register />} />
        <Route path="/my-posts" element={<MyPostsPage />} />
        <Route path="/new-post" element={<NewPostPage />} />
        <Route path="/blog/:postId" element={<BlogPost />} />
        <Route path="/edit-post/:id" element={<EditPostPage />} />
        <Route path="/" element={<FlightSearch />} />
        <Route path="/results" element={<SearchResult />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;
