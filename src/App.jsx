import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOwnProfile } from './store/authSlice';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ThreadDetailPage from './pages/ThreadDetailPage';
import LeaderboardPage from './pages/LeaderboardPage';

function ProtectedRoute({ children }) {
  const { user } = useSelector((state) => state.auth);
  return user ? children : <Navigate to="/login" />;
}

export default function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchOwnProfile());
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/threads/:id" element={<ThreadDetailPage />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />
      </Routes>
    </BrowserRouter>
  );
}
