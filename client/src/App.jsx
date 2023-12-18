// App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import Blog from './pages/Blog/Blog';
import SearchResult from './pages/SearchResult/SearchResult';
import Register from './components/Register/Register';
import Header from './components/Header/Header';

import MyPostsPage from './pages/MyPosts/MyPostsPage';

const App = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/search-result" element={<SearchResult />} />
        <Route path="/register" element={<Register />} />
        <Route path="/my-posts" element={<MyPostsPage />} />
      </Routes>
    </Router>
  );
};

export default App;
