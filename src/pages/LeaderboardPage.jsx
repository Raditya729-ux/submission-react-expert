import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLeaderboard } from '../store/leaderboardSlice';

export default function LeaderboardPage() {
  const dispatch = useDispatch();
  const { data, loading } = useSelector((state) => state.leaderboard);

  useEffect(() => {
    dispatch(fetchLeaderboard());
  }, [dispatch]);

  const medals = ['🥇', '🥈', '🥉'];

  return (
    <div className="container" style={{ paddingTop: 24, paddingBottom: 40 }}>
      <h1 style={styles.heading}>🏆 Leaderboard</h1>
      <p style={styles.sub}>Pengguna dengan skor aktivitas tertinggi</p>

      {loading ? (
        <div style={styles.loading}>Memuat leaderboard...</div>
      ) : (
        <div style={styles.list}>
          {data.map((item, index) => (
            <div key={item.user.id} style={{ ...styles.row, ...(index < 3 ? styles.topRow : {}) }}>
              <span style={styles.rank}>
                {index < 3 ? medals[index] : `#${index + 1}`}
              </span>
              <img src={item.user.avatar} alt={item.user.name} style={styles.avatar} />
              <div style={styles.info}>
                <span style={styles.name}>{item.user.name}</span>
                <span style={styles.email}>{item.user.email}</span>
              </div>
              <div style={styles.score}>
                <span style={styles.scoreNum}>{item.score}</span>
                <span style={styles.scoreLabel}>poin</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  heading: {
    fontSize: '1.6rem',
    fontWeight: 700,
    color: '#1a1a2e',
    marginBottom: '4px',
  },
  sub: {
    color: '#888',
    marginBottom: '24px',
    fontSize: '0.9rem',
  },
  loading: {
    textAlign: 'center',
    padding: '40px',
    color: '#888',
  },
  list: {
    background: '#fff',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    padding: '16px 20px',
    borderBottom: '1px solid #f0f0f0',
    transition: 'background 0.2s',
  },
  topRow: {
    background: '#fffbf0',
  },
  rank: {
    fontSize: '1.2rem',
    minWidth: '36px',
    textAlign: 'center',
    fontWeight: 700,
    color: '#888',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: '50%',
    objectFit: 'cover',
  },
  info: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  name: {
    fontWeight: 600,
    fontSize: '0.95rem',
    color: '#1a1a2e',
  },
  email: {
    fontSize: '0.8rem',
    color: '#999',
  },
  score: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  scoreNum: {
    fontSize: '1.2rem',
    fontWeight: 700,
    color: '#e94560',
  },
  scoreLabel: {
    fontSize: '0.75rem',
    color: '#aaa',
  },
};
