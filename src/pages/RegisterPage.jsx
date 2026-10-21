import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { registerUser } from '../store/authSlice';

export default function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const result = await dispatch(registerUser(form));
    setLoading(false);
    if (registerUser.fulfilled.match(result)) {
      navigate('/login');
    } else {
      setError(result.payload);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>Daftar</h2>
        <p style={styles.sub}>Buat akun baru</p>
        {error && <div style={styles.error}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div style={styles.field}>
            <label style={styles.label}>Nama</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              style={styles.input}
              placeholder="Nama lengkap"
              required
            />
          </div>
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
              placeholder="Min. 6 karakter"
              minLength={6}
              required
            />
          </div>
          <button type="submit" style={styles.btn} disabled={loading}>
            {loading ? 'Mendaftar...' : 'Daftar'}
          </button>
        </form>
        <p style={styles.footer}>
          Sudah punya akun? <Link to="/login" style={styles.link}>Login</Link>
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
