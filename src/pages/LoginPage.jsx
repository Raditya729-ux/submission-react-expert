import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearError } from '../store/authSlice';

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, user } = useSelector((state) => state.auth);
  const [form, setForm] = useState({ email: '', password: '' });

  useEffect(() => {
    if (user) navigate('/');
    return () => dispatch(clearError());
  }, [user, navigate, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser(form));
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>Login</h2>
        <p style={styles.sub}>Masuk ke Forum Diskusi</p>
        {error && <div style={styles.error}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              style={styles.input}
              placeholder="email@contoh.com"
              required
            />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              style={styles.input}
              placeholder="••••••••"
              required
            />
          </div>
          <button type="submit" style={styles.btn} disabled={loading}>
            {loading ? 'Memproses...' : 'Login'}
          </button>
        </form>
        <p style={styles.footer}>
          Belum punya akun? <Link to="/register" style={styles.link}>Daftar</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#f0f2f5',
  },
  card: {
    background: '#fff',
    borderRadius: '12px',
    padding: '40px',
    width: '100%',
    maxWidth: '420px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
  },
  title: {
    fontSize: '1.8rem',
    fontWeight: 700,
    color: '#1a1a2e',
    marginBottom: '4px',
  },
  sub: {
    color: '#888',
    marginBottom: '24px',
    fontSize: '0.9rem',
  },
  error: {
    background: '#fff0f0',
    color: '#e94560',
    padding: '10px 14px',
    borderRadius: '6px',
    marginBottom: '16px',
    fontSize: '0.88rem',
    border: '1px solid #fcc',
  },
  field: {
    marginBottom: '16px',
  },
  label: {
    display: 'block',
    marginBottom: '6px',
    fontSize: '0.88rem',
    fontWeight: 600,
    color: '#444',
  },
  input: {
    width: '100%',
    padding: '10px 14px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontSize: '0.95rem',
    background: '#fafafa',
  },
  btn: {
    width: '100%',
    padding: '12px',
    background: '#e94560',
    color: '#fff',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: 600,
    marginTop: '8px',
    cursor: 'pointer',
    border: 'none',
  },
  footer: {
    textAlign: 'center',
    marginTop: '20px',
    fontSize: '0.9rem',
    color: '#666',
  },
  link: {
    color: '#e94560',
    fontWeight: 600,
  },
};
