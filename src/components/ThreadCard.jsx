import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { upVoteThread, downVoteThread, neutralVoteThread } from '../store/threadsSlice';
import VoteButton from './VoteButton';

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins} menit lalu`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} jam lalu`;
  return `${Math.floor(hours / 24)} hari lalu`;
}

export default function ThreadCard({ thread, owner }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleUpVote = () => {
    if (!user) return alert('Login terlebih dahulu');
    if (thread.upVotesBy.includes(user.id)) {
      dispatch(neutralVoteThread(thread.id));
    } else {
      dispatch(upVoteThread(thread.id));
    }
  };

  const handleDownVote = () => {
    if (!user) return alert('Login terlebih dahulu');
    if (thread.downVotesBy.includes(user.id)) {
      dispatch(neutralVoteThread(thread.id));
    } else {
      dispatch(downVoteThread(thread.id));
    }
  };

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <img src={owner?.avatar} alt={owner?.name} style={styles.avatar} />
        <div>
          <span style={styles.ownerName}>{owner?.name || 'Unknown'}</span>
          <span style={styles.time}>{timeAgo(thread.createdAt)}</span>
        </div>
        {thread.category && (
          <span style={styles.category}>#{thread.category}</span>
        )}
      </div>

      <Link to={`/threads/${thread.id}`}>
        <h3 style={styles.title}>{thread.title}</h3>
      </Link>

      <p
        style={styles.body}
        dangerouslySetInnerHTML={{ __html: thread.body?.substring(0, 200) + (thread.body?.length > 200 ? '...' : '') }}
      />

      <div style={styles.footer}>
        <VoteButton
          upVotes={thread.upVotesBy?.length || 0}
          downVotes={thread.downVotesBy?.length || 0}
          upVotesBy={thread.upVotesBy}
          downVotesBy={thread.downVotesBy}
          userId={user?.id}
          onUpVote={handleUpVote}
          onDownVote={handleDownVote}
        />
        <span style={styles.comments}>💬 {thread.totalComments} komentar</span>
      </div>
    </div>
  );
}

const styles = {
  card: {
    background: '#fff',
    borderRadius: '10px',
    padding: '20px',
    marginBottom: '16px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
    transition: 'box-shadow 0.2s',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '10px',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: '50%',
    objectFit: 'cover',
  },
  ownerName: {
    fontWeight: 600,
    fontSize: '0.9rem',
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
    fontSize: '1.05rem',
    fontWeight: 700,
    color: '#1a1a2e',
    marginBottom: '8px',
    cursor: 'pointer',
  },
  body: {
    fontSize: '0.9rem',
    color: '#555',
    marginBottom: '14px',
    lineHeight: 1.5,
  },
  footer: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  comments: {
    fontSize: '0.85rem',
    color: '#888',
  },
};
