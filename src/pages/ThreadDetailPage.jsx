import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchThreadDetail,
  createComment,
  upVoteThreadDetail,
  downVoteThreadDetail,
  neutralVoteThreadDetail,
} from '../store/threadDetailSlice';
import CommentItem from '../components/CommentItem';
import VoteButton from '../components/VoteButton';

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins} menit lalu`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} jam lalu`;
  return `${Math.floor(hours / 24)} hari lalu`;
}

export default function ThreadDetailPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { thread, loading } = useSelector((state) => state.threadDetail);
  const { user } = useSelector((state) => state.auth);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchThreadDetail(id));
  }, [id, dispatch]);

  const handleUpVote = () => {
    if (!user) return alert('Login terlebih dahulu');
    if (thread.upVotesBy.includes(user.id)) {
      dispatch(neutralVoteThreadDetail(id));
    } else {
      dispatch(upVoteThreadDetail(id));
    }
  };

  const handleDownVote = () => {
    if (!user) return alert('Login terlebih dahulu');
    if (thread.downVotesBy.includes(user.id)) {
      dispatch(neutralVoteThreadDetail(id));
    } else {
      dispatch(downVoteThreadDetail(id));
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!user) return alert('Login terlebih dahulu');
    if (!comment.trim()) return;
    setSubmitting(true);
    await dispatch(createComment({ threadId: id, content: comment }));
    setComment('');
    setSubmitting(false);
  };

  if (loading) return <div style={styles.loading}>Memuat thread...</div>;
  if (!thread) return <div style={styles.loading}>Thread tidak ditemukan.</div>;

  return (
    <div className="container" style={{ paddingTop: 24, paddingBottom: 40 }}>
      <div style={styles.card}>
        <div style={styles.header}>
          <img src={thread.owner?.avatar} alt={thread.owner?.name} style={styles.avatar} />
          <div>
            <span style={styles.ownerName}>{thread.owner?.name}</span>
            <span style={styles.time}>{timeAgo(thread.createdAt)}</span>
          </div>
          {thread.category && <span style={styles.category}>#{thread.category}</span>}
        </div>

        <h1 style={styles.title}>{thread.title}</h1>

        <div
          style={styles.body}
          dangerouslySetInnerHTML={{ __html: thread.body }}
        />

        <VoteButton
          upVotes={thread.upVotesBy?.length || 0}
          downVotes={thread.downVotesBy?.length || 0}
          upVotesBy={thread.upVotesBy}
          downVotesBy={thread.downVotesBy}
          userId={user?.id}
          onUpVote={handleUpVote}
          onDownVote={handleDownVote}
        />
      </div>

      <div style={styles.commentsSection}>
        <h2 style={styles.commentsTitle}>Komentar ({thread.comments?.length || 0})</h2>

        {user && (
          <form onSubmit={handleComment} style={styles.commentForm}>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tulis komentar..."
              style={styles.textarea}
              rows={3}
              required
            />
            <button type="submit" style={styles.submitBtn} disabled={submitting}>
              {submitting ? 'Mengirim...' : 'Kirim Komentar'}
            </button>
          </form>
        )}

        {thread.comments?.length === 0 ? (
          <p style={styles.noComment}>Belum ada komentar. Jadilah yang pertama!</p>
        ) : (
          thread.comments?.map((c) => (
            <CommentItem key={c.id} comment={c} threadId={id} />
          ))
        )}
      </div>
    </div>
  );
}

const styles = {
  loading: {
    textAlign: 'center',
    padding: '60px',
    color: '#888',
  },
  card: {
    background: '#fff',
    borderRadius: '10px',
    padding: '28px',
    marginBottom: '24px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '16px',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: '50%',
    objectFit: 'cover',
  },
  ownerName: {
    fontWeight: 600,
    fontSize: '0.95rem',
    display: 'block',
  },
  time: {
    fontSize: '0.78rem',
    color: '#999',
  },
  category: {
    marginLeft: 'auto',
    background: '#f0f4ff',
    color: '#4a90e2',
    padding: '3px 10px',
    borderRadius: '20px',
    fontSize: '0.8rem',
    fontWeight: 500,
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: 700,
    color: '#1a1a2e',
    marginBottom: '16px',
  },
  body: {
    fontSize: '0.95rem',
    color: '#444',
    lineHeight: 1.7,
    marginBottom: '20px',
  },
  commentsSection: {
    background: '#fff',
    borderRadius: '10px',
    padding: '24px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
  },
  commentsTitle: {
    fontSize: '1.1rem',
    fontWeight: 700,
    marginBottom: '16px',
    color: '#1a1a2e',
  },
  commentForm: {
    marginBottom: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
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
    background: '#e94560',
    color: '#fff',
    padding: '10px 20px',
    borderRadius: '8px',
    fontSize: '0.9rem',
    fontWeight: 600,
    border: 'none',
    cursor: 'pointer',
    alignSelf: 'flex-end',
  },
  noComment: {
    color: '#aaa',
    textAlign: 'center',
    padding: '20px',
  },
};
