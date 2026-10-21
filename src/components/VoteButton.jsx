export default function VoteButton({ upVotes, downVotes, onUpVote, onDownVote, userId, upVotesBy, downVotesBy }) {
  const hasUpVoted = userId && upVotesBy?.includes(userId);
  const hasDownVoted = userId && downVotesBy?.includes(userId);

  return (
    <div style={styles.container}>
      <button
        onClick={onUpVote}
        style={{ ...styles.btn, color: hasUpVoted ? '#e94560' : '#888' }}
        title="Upvote"
      >
        ▲ {upVotes}
      </button>
      <button
        onClick={onDownVote}
        style={{ ...styles.btn, color: hasDownVoted ? '#4a90e2' : '#888' }}
        title="Downvote"
      >
        ▼ {downVotes}
      </button>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  btn: {
    background: 'none',
    border: '1px solid #ddd',
    borderRadius: '6px',
    padding: '4px 10px',
    fontSize: '0.85rem',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
};
