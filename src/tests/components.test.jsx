/**
 * Skenario Pengujian:
 *
 * - VoteButton component
 *  - harus merender jumlah upvote dan downvote dengan benar
 *  - harus memanggil fungsi onUpVote ketika tombol upvote diklik
 *  - harus memanggil fungsi onDownVote ketika tombol downvote diklik
 *  - harus menampilkan highlight warna pada tombol upvote jika pengguna telah memberikan upvote
 *
 * - ThreadCard component
 *  - harus merender judul thread dengan benar
 *  - harus merender nama pemilik (author) thread
 *  - harus merender badge kategori thread dengan format #kategori
 *  - harus merender jumlah komentar pada thread
 *
 * - CommentItem component
 *  - harus merender teks konten komentar dengan benar
 *  - harus merender nama pemilik komentar
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import VoteButton from '../components/VoteButton';
import ThreadCard from '../components/ThreadCard';
import CommentItem from '../components/CommentItem';
import threadsReducer from '../store/threadsSlice';
import authReducer from '../store/authSlice';
import threadDetailReducer from '../store/threadDetailSlice';

const makeStore = (preloadedState = {}) => configureStore({
  reducer: {
    auth: authReducer,
    threads: threadsReducer,
    threadDetail: threadDetailReducer,
  },
  preloadedState,
});

const renderWithProviders = (ui, { store = makeStore() } = {}) => {
  return render(
      <Provider store={store}>
        <MemoryRouter>{ui}</MemoryRouter>
      </Provider>,
  );
};

// --- VoteButton Tests ---
describe('VoteButton component', () => {
  it('should render upvote and downvote counts', () => {
    renderWithProviders(
        <VoteButton upVotes={5} downVotes={2} upVotesBy={[]} downVotesBy={[]} />,
    );
    expect(screen.getByText(/5/)).toBeInTheDocument();
    expect(screen.getByText(/2/)).toBeInTheDocument();
  });

  it('should call onUpVote when upvote button clicked', () => {
    const onUpVote = vi.fn();
    renderWithProviders(
        <VoteButton upVotes={0} downVotes={0} upVotesBy={[]} downVotesBy={[]} onUpVote={onUpVote} onDownVote={vi.fn()} />,
    );
    fireEvent.click(screen.getByTitle('Upvote'));
    expect(onUpVote).toHaveBeenCalledTimes(1);
  });

  it('should call onDownVote when downvote button clicked', () => {
    const onDownVote = vi.fn();
    renderWithProviders(
        <VoteButton upVotes={0} downVotes={0} upVotesBy={[]} downVotesBy={[]} onUpVote={vi.fn()} onDownVote={onDownVote} />,
    );
    fireEvent.click(screen.getByTitle('Downvote'));
    expect(onDownVote).toHaveBeenCalledTimes(1);
  });

  it('should highlight upvote button when user has upvoted', () => {
    renderWithProviders(
        <VoteButton upVotes={1} downVotes={0} upVotesBy={['user-1']} downVotesBy={[]} userId="user-1" onUpVote={vi.fn()} onDownVote={vi.fn()} />,
    );
    const upBtn = screen.getByTitle('Upvote');
    expect(upBtn).toHaveStyle({ color: '#e94560' });
  });
});

// --- ThreadCard Tests ---
describe('ThreadCard component', () => {
  const thread = {
    id: 'thread-1',
    title: 'Thread Test',
    body: 'Isi thread test',
    category: 'General',
    createdAt: new Date().toISOString(),
    ownerId: 'user-1',
    upVotesBy: [],
    downVotesBy: [],
    totalComments: 3,
  };
  const owner = { id: 'user-1', name: 'John Doe', avatar: 'https://avatar.url/img.jpg' };

  it('should render thread title', () => {
    renderWithProviders(<ThreadCard thread={thread} owner={owner} />);
    expect(screen.getByText('Thread Test')).toBeInTheDocument();
  });

  it('should render owner name', () => {
    renderWithProviders(<ThreadCard thread={thread} owner={owner} />);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('should render category badge', () => {
    renderWithProviders(<ThreadCard thread={thread} owner={owner} />);
    expect(screen.getByText('#General')).toBeInTheDocument();
  });

  it('should render comment count', () => {
    renderWithProviders(<ThreadCard thread={thread} owner={owner} />);
    expect(screen.getByText(/3 komentar/)).toBeInTheDocument();
  });
});

// --- CommentItem Tests ---
describe('CommentItem component', () => {
  const comment = {
    id: 'comment-1',
    content: 'Ini komentar test',
    createdAt: new Date().toISOString(),
    owner: { id: 'user-2', name: 'Jane Doe', avatar: 'https://avatar.url/img.jpg' },
    upVotesBy: [],
    downVotesBy: [],
  };

  it('should render comment content', () => {
    renderWithProviders(<CommentItem comment={comment} threadId="thread-1" />);
    expect(screen.getByText('Ini komentar test')).toBeInTheDocument();
  });

  it('should render comment owner name', () => {
    renderWithProviders(<CommentItem comment={comment} threadId="thread-1" />);
    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
  });
});
