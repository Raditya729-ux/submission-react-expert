import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchThreads, setCategoryFilter } from '../store/threadsSlice';
import { createThread } from '../store/threadsSlice';
import ThreadCard from '../components/ThreadCard';

export default function HomePage() {
  const dispatch = useDispatch();
  const { threads, users, loading, categoryFilter } = useSelector((state) => state.threads);
  const { user } = useSelector((state) => state.auth);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', body: '', category: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchThreads());
  }, [dispatch]);

  const categories = [...new Set(threads.map((t) => t.category).filter(Boolean))];

  const filteredThreads = categoryFilter ?
    threads.filter((t) => t.category === categoryFilter) :
    threads;

  const getOwner = (ownerId) => users.find((u) => u.id === ownerId);

  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    await dispatch(createThread(form));
    setForm({ title: '', body: '', category: '' });
    setShowForm(false);
    setSubmitting(false);
  };

  return (
    <div className="container" style={{ paddingTop: 24, paddingBottom: 40 }}>
      <div style={styles.topBar}>
        <h1 style={styles.heading}>Thread Terbaru</h1>
        {user && (
          <button onClick={() => setShowForm(!showForm)} style={styles.newBtn}>
            {showForm ? '✕ Batal' : '+ Buat Thread'}
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleCreate} style={styles.form}>
          <input
            type="text"
            placeholder="Judul thread"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            style={styles.input}
            required
          />
          <input
            type="text"
            placeholder="Kategori (opsional)"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            style={styles.input}
          />
          <textarea
            placeholder="Isi thread..."
            value={form.body}
            onChange={(e) => setForm({ ...form, body: e.target.value })}
            style={styles.textarea}
            rows={5}
            required
          />
          <button type="submit" style={styles.submitBtn} disabled={submitting}>
            {submitting ? 'Memposting...' : 'Posting Thread'}
          </button>
        </form>
      )}

      {/* Category Filter */}
      {categories.length > 0 && (
        <div style={styles.filterBar}>
          <span style={styles.filterLabel}>Filter:</span>
          <button
            onClick={() => dispatch(setCategoryFilter(''))}
            style={{ ...styles.filterBtn, ...(categoryFilter === '' ? styles.filterActive : {}) }}
          >
            Semua
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => dispatch(setCategoryFilter(cat))}
              style={{ ...styles.filterBtn, ...(categoryFilter === cat ? styles.filterActive : {}) }}
            >
              #{cat}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <div style={styles.loading}>Memuat thread...</div>
      ) : filteredThreads.length === 0 ? (
        <div style={styles.empty}>Tidak ada thread ditemukan.</div>
      ) : (
        filteredThreads.map((thread) => (
          <ThreadCard key={thread.id} thread={thread} owner={getOwner(thread.ownerId)} />
        ))
      )}
    </div>
  );
}

const styles = {
  topBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '20px',
  },
  heading: {
    fontSize: '1.5rem',
    fontWeight: 700,
    color: '#1a1a2e',
  },
  newBtn: {
    background: '#e94560',
    color: '#fff',
    padding: '8px 18px',
    borderRadius: '8px',
    fontSize: '0.9rem',
    fontWeight: 600,
    border: 'none',
    cursor: 'pointer',
  },
  form: {
    background: '#fff',
    borderRadius: '10px',
    padding: '20px',
    marginBottom: '20px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  input: {
    padding: '10px 14px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontSize: '0.95rem',
    background: '#fafafa',
  },
  textarea: {
    padding: '10px 14px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontSize: '0.95rem',
    background: '#fafafa',
    resize: 'vertical',
    fontFamily: 'inherit',
  },
  submitBtn: {
    background: '#1a1a2e',
    color: '#fff',
    padding: '10px',
    borderRadius: '8px',
    fontSize: '0.95rem',
    fontWeight: 600,
    border: 'none',
    cursor: 'pointer',
    alignSelf: 'flex-end',
    minWidth: '160px',
  },
  filterBar: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    alignItems: 'center',
    marginBottom: '20px',
  },
  filterLabel: {
    fontSize: '0.88rem',
    color: '#666',
    fontWeight: 600,
  },
  filterBtn: {
    padding: '5px 14px',
    borderRadius: '20px',
    border: '1px solid #ddd',
    background: '#fff',
    fontSize: '0.82rem',
    cursor: 'pointer',
    color: '#555',
  },
  filterActive: {
    background: '#e94560',
    color: '#fff',
    border: '1px solid #e94560',
  },
  loading: {
    textAlign: 'center',
    padding: '40px',
    color: '#888',
  },
  empty: {
    textAlign: 'center',
    padding: '40px',
    color: '#aaa',
  },
};
