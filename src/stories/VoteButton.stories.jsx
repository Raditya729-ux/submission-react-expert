import VoteButton from '../components/VoteButton';

export default {
  title: 'Components/VoteButton',
  component: VoteButton,
  tags: ['autodocs'],
  argTypes: {
    onUpVote: { action: 'upvoted' },
    onDownVote: { action: 'downvoted' },
  },
};

export const Default = {
  args: {
    upVotes: 12,
    downVotes: 3,
    upVotesBy: [],
    downVotesBy: [],
    userId: 'user-1',
  },
};

export const Upvoted = {
  args: {
    upVotes: 13,
    downVotes: 3,
    upVotesBy: ['user-1'],
    downVotesBy: [],
    userId: 'user-1',
  },
};

export const Downvoted = {
  args: {
    upVotes: 12,
    downVotes: 4,
    upVotesBy: [],
    downVotesBy: ['user-1'],
    userId: 'user-1',
  },
};

export const ZeroVotes = {
  args: {
    upVotes: 0,
    downVotes: 0,
    upVotesBy: [],
    downVotesBy: [],
    userId: 'user-1',
  },
};
