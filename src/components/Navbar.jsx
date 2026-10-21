import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/authSlice';

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav style={styles.nav}>
      <div className="container" style={styles.inner}>
        <Link to="/" style={styles.brand}>💬 Forum Diskusi</Link>
        <div style={styles.links}>
          <Link to="/" style={styles.link}>Threads</Link>
          <Link to="/leaderboard" style={styles.link}>Leaderboard</Link>
          {user ? (
            <div style={styles.userArea}>
              <img src={user.avatar} alt={user.name} style={styles.avatar} />
              <span style={styles.userName}>{user.name}</span>
              <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
            </div>
          ) : (
            <div style={styles.authLinks}>
              <Link to="/login" style={styles.loginBtn}>Login</Link>
              <Link to="/register" style={styles.registerBtn}>Register</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    background: '#1a1a2e',
    padding: '12px 0',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
  },
  inner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brand: {
    color: '#e94560',
    fontSize: '1.3rem',
    fontWeight: 700,
  },
  links: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  link: {
    color: '#ccc',
    fontSize: '0.95rem',
    transition: 'color 0.2s',
  },
  userArea: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: '50%',
    objectFit: 'cover',
  },
  userName: {
    color: '#fff',
    fontSize: '0.9rem',
  },
  logoutBtn: {
    background: '#e94560',
    color: '#fff',
    padding: '6px 14px',
    borderRadius: '6px',
    fontSize: '0.85rem',
  },
  authLinks: {
    display: 'flex',
    gap: '8px',
  },
  loginBtn: {
    color: '#ccc',
    padding: '6px 14px',
    borderRadius: '6px',
    border: '1px solid #555',
    fontSize: '0.85rem',
  },
  registerBtn: {
    background: '#e94560',
    color: '#fff',
    padding: '6px 14px',
    borderRadius: '6px',
    fontSize: '0.85rem',
  },
};
