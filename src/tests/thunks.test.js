/**
 * Skenario Pengujian:
 *
 * - fetchThreads thunk
 *  - harus mendispatch action fulfilled dan menyimpan data threads & users saat request API berhasil
 *  - harus mendispatch action rejected dan menyimpan pesan error saat request API gagal
 *
 * - createThread thunk
 *  - harus menambahkan thread baru ke dalam state saat pembuatan thread berhasil
 *  - harus mendispatch action rejected ketika pengguna belum terautentikasi / request gagal
 *
 * - upVoteThread thunk
 *  - harus memperbarui status upVotesBy pada state thread terkait saat upvote berhasil
 *
 * - fetchLeaderboard thunk
 *  - harus mengambil dan menyimpan data leaderboard ke state saat request API berhasil
 *  - harus menyimpan pesan error ke state ketika request API leaderboard gagal
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import threadsReducer, { fetchThreads, createThread, upVoteThread } from '../store/threadsSlice';
import authReducer from '../store/authSlice';
import leaderboardReducer, { fetchLeaderboard } from '../store/leaderboardSlice';
import api from '../utils/api';

vi.mock('../utils/api');

const makeStore = () => configureStore({
  reducer: {
    threads: threadsReducer,
    auth: authReducer,
    leaderboard: leaderboardReducer,
  },
  preloadedState: {
    auth: { user: { id: 'user-1', name: 'John' }, token: 'token-123', loading: false, error: null },
  },
});

beforeEach(() => {
  vi.clearAllMocks();
});

// --- Thunk Tests ---
describe('fetchThreads thunk', () => {
  it('should dispatch fulfilled with threads and users', async () => {
    const mockThreads = [{ id: 'thread-1', title: 'Test', upVotesBy: [], downVotesBy: [] }];
    const mockUsers = [{ id: 'user-1', name: 'John' }];
    api.getAllThreads.mockResolvedValue(mockThreads);
    api.getAllUsers.mockResolvedValue(mockUsers);

    const store = makeStore();
    await store.dispatch(fetchThreads());

    const state = store.getState().threads;
    expect(state.threads).toEqual(mockThreads);
    expect(state.users).toEqual(mockUsers);
    expect(state.loading).toBe(false);
  });

  it('should dispatch rejected on API error', async () => {
    api.getAllThreads.mockRejectedValue(new Error('Server error'));
    api.getAllUsers.mockResolvedValue([]);

    const store = makeStore();
    await store.dispatch(fetchThreads());

    const state = store.getState().threads;
    expect(state.error).toBe('Server error');
  });
});

describe('createThread thunk', () => {
  it('should add new thread to state on success', async () => {
    const newThread = { id: 'thread-2', title: 'New Thread', upVotesBy: [], downVotesBy: [] };
    api.createThread.mockResolvedValue(newThread);

    const store = makeStore();
    await store.dispatch(createThread({ title: 'New Thread', body: 'Body', category: 'General' }));

    const state = store.getState().threads;
    expect(state.threads[0]).toEqual(newThread);
  });

  it('should dispatch rejected when not authenticated', async () => {
    api.createThread.mockRejectedValue(new Error('Unauthorized'));

    const store = makeStore();
    const result = await store.dispatch(
        createThread({ title: 'Test', body: 'Body', category: '' }),
    );

    expect(result.type).toBe(createThread.rejected.type);
  });
});

describe('upVoteThread thunk', () => {
  it('should update upVotesBy in state', async () => {
    api.upVoteThread.mockResolvedValue({ voteType: 1 });

    const store = configureStore({
      reducer: { threads: threadsReducer, auth: authReducer },
      preloadedState: {
        auth: { user: { id: 'user-1' }, token: 'token-123', loading: false, error: null },
        threads: {
          threads: [{ id: 'thread-1', upVotesBy: [], downVotesBy: [] }],
          users: [],
          loading: false,
          error: null,
          categoryFilter: '',
        },
      },
    });

    await store.dispatch(upVoteThread('thread-1'));
    const state = store.getState().threads;
    expect(state.threads[0].upVotesBy).toContain('user-1');
  });
});

describe('fetchLeaderboard thunk', () => {
  it('should fetch and store leaderboard data', async () => {
    const mockData = [{ user: { id: 'user-1', name: 'John' }, score: 10 }];
    api.getLeaderboard.mockResolvedValue(mockData);

    const store = makeStore();
    await store.dispatch(fetchLeaderboard());

    const state = store.getState().leaderboard;
    expect(state.data).toEqual(mockData);
  });

  it('should handle leaderboard fetch error', async () => {
    api.getLeaderboard.mockRejectedValue(new Error('Failed'));

    const store = makeStore();
    await store.dispatch(fetchLeaderboard());

    const state = store.getState().leaderboard;
    expect(state.error).toBe('Failed');
  });
});
