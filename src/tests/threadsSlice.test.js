/**
 * Skenario Pengujian:
 *
 * - threadsSlice reducer
 *  - harus mengembalikan state awal ketika diberikan action yang tidak dikenal
 *  - harus mengubah categoryFilter sesuai payload pada setCategoryFilter
 *  - harus mereset categoryFilter menjadi string kosong
 *  - harus mengubah state loading menjadi true ketika fetchThreads.pending
 *  - harus menyimpan daftar threads dan users ketika fetchThreads.fulfilled
 *  - harus menyimpan pesan error ketika fetchThreads.rejected
 *  - harus menambahkan thread baru ke daftar ketika createThread.fulfilled
 *  - harus menambahkan userId ke daftar upVotesBy ketika upVoteThread.fulfilled
 *  - harus menghapus userId dari downVotesBy ketika upVoteThread.fulfilled
 *  - harus menambahkan userId ke daftar downVotesBy ketika downVoteThread.fulfilled
 *  - harus menghapus userId dari upVotesBy ketika downVoteThread.fulfilled
 *  - harus menghapus userId dari vote ketika neutralVoteThread.fulfilled
 */

import { describe, it, expect } from 'vitest';
import threadsReducer, {
  setCategoryFilter,
  fetchThreads,
  upVoteThread,
  downVoteThread,
  neutralVoteThread,
  createThread,
} from '../store/threadsSlice';

const initialState = {
  threads: [],
  users: [],
  loading: false,
  error: null,
  categoryFilter: '',
};

const sampleThread = {
  id: 'thread-1',
  title: 'Thread Test',
  body: 'Isi thread',
  category: 'General',
  createdAt: '2021-06-21T07:00:00.000Z',
  ownerId: 'user-1',
  upVotesBy: [],
  downVotesBy: [],
  totalComments: 0,
};

// --- Reducer Tests ---
describe('threadsSlice reducer', () => {
  it('should return initial state', () => {
    expect(threadsReducer(undefined, { type: '@@INIT' })).toEqual(initialState);
  });

  it('should handle setCategoryFilter', () => {
    const state = threadsReducer(initialState, setCategoryFilter('React'));
    expect(state.categoryFilter).toBe('React');
  });

  it('should reset categoryFilter to empty string', () => {
    const state = threadsReducer(
        { ...initialState, categoryFilter: 'React' },
        setCategoryFilter(''),
    );
    expect(state.categoryFilter).toBe('');
  });

  it('should handle fetchThreads.pending', () => {
    const state = threadsReducer(initialState, { type: fetchThreads.pending.type });
    expect(state.loading).toBe(true);
  });

  it('should handle fetchThreads.fulfilled', () => {
    const payload = { threads: [sampleThread], users: [{ id: 'user-1', name: 'John' }] };
    const state = threadsReducer(initialState, { type: fetchThreads.fulfilled.type, payload });
    expect(state.loading).toBe(false);
    expect(state.threads).toHaveLength(1);
    expect(state.users).toHaveLength(1);
  });

  it('should handle fetchThreads.rejected', () => {
    const state = threadsReducer(
        initialState,
        { type: fetchThreads.rejected.type, payload: 'Network error' },
    );
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Network error');
  });

  it('should handle createThread.fulfilled', () => {
    const state = threadsReducer(
        initialState,
        { type: createThread.fulfilled.type, payload: sampleThread },
    );
    expect(state.threads).toHaveLength(1);
    expect(state.threads[0].id).toBe('thread-1');
  });

  it('should handle upVoteThread.fulfilled', () => {
    const stateWithThread = { ...initialState, threads: [{ ...sampleThread }] };
    const state = threadsReducer(
        stateWithThread,
        { type: upVoteThread.fulfilled.type, payload: { threadId: 'thread-1', userId: 'user-1' } },
    );
    expect(state.threads[0].upVotesBy).toContain('user-1');
  });

  it('should remove from downVotesBy when upvoting', () => {
    const stateWithThread = {
      ...initialState,
      threads: [{ ...sampleThread, downVotesBy: ['user-1'] }],
    };
    const state = threadsReducer(
        stateWithThread,
        { type: upVoteThread.fulfilled.type, payload: { threadId: 'thread-1', userId: 'user-1' } },
    );
    expect(state.threads[0].downVotesBy).not.toContain('user-1');
    expect(state.threads[0].upVotesBy).toContain('user-1');
  });

  it('should handle downVoteThread.fulfilled', () => {
    const stateWithThread = { ...initialState, threads: [{ ...sampleThread }] };
    const state = threadsReducer(
        stateWithThread,
        { type: downVoteThread.fulfilled.type, payload: { threadId: 'thread-1', userId: 'user-1' } },
    );
    expect(state.threads[0].downVotesBy).toContain('user-1');
  });

  it('should remove from upVotesBy when downvoting', () => {
    const stateWithThread = {
      ...initialState,
      threads: [{ ...sampleThread, upVotesBy: ['user-1'] }],
    };
    const state = threadsReducer(
        stateWithThread,
        { type: downVoteThread.fulfilled.type, payload: { threadId: 'thread-1', userId: 'user-1' } },
    );
    expect(state.threads[0].upVotesBy).not.toContain('user-1');
    expect(state.threads[0].downVotesBy).toContain('user-1');
  });

  it('should handle neutralVoteThread.fulfilled', () => {
    const stateWithThread = {
      ...initialState,
      threads: [{ ...sampleThread, upVotesBy: ['user-1'], downVotesBy: ['user-2'] }],
    };
    const state = threadsReducer(
        stateWithThread,
        { type: neutralVoteThread.fulfilled.type, payload: { threadId: 'thread-1', userId: 'user-1' } },
    );
    expect(state.threads[0].upVotesBy).not.toContain('user-1');
  });
});
