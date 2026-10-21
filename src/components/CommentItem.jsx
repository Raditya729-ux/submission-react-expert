import { useDispatch, useSelector } from 'react-redux';
import { upVoteComment, downVoteComment, neutralVoteComment } from '../store/threadDetailSlice';
import VoteButton from './VoteButton';

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins} menit lalu`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} jam lalu`;
  return `${Math.floor(hours / 24)} hari lalu`;
}

export default function CommentItem({ comment, threadId }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleUpVote = () => {
    if (!user) return alert('Login terlebih dahulu');
    if (comment.upVotesBy.includes(user.id)) {
      dispatch(neutralVoteComment({ threadId, commentId: comment.id }));
    } else {
      dispatch(upVoteComment({ threadId, commentId: comment.id }));
    }
  };

  const handleDownVote = () => {
    if (!user) return alert('Login terlebih dahulu');
    if (comment.downVotesBy.includes(user.id)) {
      dispatch(neutralVoteComment({ threadId, commentId: comment.id }));
    } else {
      dispatch(downVoteComment({ threadId, commentId: comment.id }));
    }
  };

  return (
    <div style={styles.comment}>
      <div style={styles.header}>
        <img src={comment.owner?.avatar} alt={comment.owner?.name} style={styles.avatar} />
        <div>
          <span style={styles.name}>{comment.owner?.name}</span>
          <span style={styles.time}>{timeAgo(comment.createdAt)}</span>
        </div>
      </div>
      <div
        style={styles.content}
        dangerouslySetInnerHTML={{ __html: comment.content }}
      />
      <VoteButton
        upVotes={comment.upVotesBy?.length || 0}
        downVotes={comment.downVotesBy?.length || 0}
        upVotesBy={comment.upVotesBy}
        downVotesBy={comment.downVotesBy}
        userId={user?.id}
        onUpVote={handleUpVote}
        onDownVote={handleDownVote}
      />
    </div>
  );
}

const styles = {
  comment: {
    background: '#f9f9f9',
    borderRadius: '8px',
    padding: '14px',
    marginBottom: '12px',
    borderLeft: '3px solid #e94560',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '8px',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: '50%',
    objectFit: 'cover',
  },
  name: {
    fontWeight: 600,
    fontSize: '0.88rem',
    display: 'block',
  },
  time: {
    fontSize: '0.75rem',
    color: '#999',
  },
  content: {
    fontSize: '0.9rem',
    color: '#444',
    marginBottom: '10px',
    lineHeight: 1.5,
  },
};
