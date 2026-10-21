import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api';

export const fetchThreads = createAsyncThunk('threads/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const [threads, users] = await Promise.all([api.getAllThreads(), api.getAllUsers()]);
    return { threads, users };
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const createThread = createAsyncThunk('threads/create', async ({ title, body, category }, { getState, rejectWithValue }) => {
  try {
    const { token } = getState().auth;
    const thread = await api.createThread({ title, body, category }, token);
    return thread;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const upVoteThread = createAsyncThunk('threads/upVote', async (threadId, { getState, rejectWithValue }) => {
  try {
    const { token, user } = getState().auth;
    await api.upVoteThread(threadId, token);
    return { threadId, userId: user.id };
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const downVoteThread = createAsyncThunk('threads/downVote', async (threadId, { getState, rejectWithValue }) => {
  try {
    const { token, user } = getState().auth;
    await api.downVoteThread(threadId, token);
    return { threadId, userId: user.id };
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const neutralVoteThread = createAsyncThunk('threads/neutralVote', async (threadId, { getState, rejectWithValue }) => {
  try {
    const { token, user } = getState().auth;
    await api.neutralVoteThread(threadId, token);
    return { threadId, userId: user.id };
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

const threadsSlice = createSlice({
  name: 'threads',
  initialState: { threads: [], users: [], loading: false, error: null, categoryFilter: '' },
  reducers: {
    setCategoryFilter(state, action) {
      state.categoryFilter = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
        .addCase(fetchThreads.pending, (state) => {
          state.loading = true;
        })
        .addCase(fetchThreads.fulfilled, (state, action) => {
          state.loading = false;
          state.threads = action.payload.threads;
          state.users = action.payload.users;
        })
        .addCase(fetchThreads.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })
        .addCase(createThread.fulfilled, (state, action) => {
          state.threads.unshift(action.payload);
        })
        .addCase(upVoteThread.fulfilled, (state, action) => {
          const thread = state.threads.find((t) => t.id === action.payload.threadId);
          if (thread) {
            thread.downVotesBy = thread.downVotesBy.filter((id) => id !== action.payload.userId);
            if (!thread.upVotesBy.includes(action.payload.userId)) {
              thread.upVotesBy.push(action.payload.userId);
            }
          }
        })
        .addCase(downVoteThread.fulfilled, (state, action) => {
          const thread = state.threads.find((t) => t.id === action.payload.threadId);
          if (thread) {
            thread.upVotesBy = thread.upVotesBy.filter((id) => id !== action.payload.userId);
            if (!thread.downVotesBy.includes(action.payload.userId)) {
              thread.downVotesBy.push(action.payload.userId);
            }
          }
        })
        .addCase(neutralVoteThread.fulfilled, (state, action) => {
          const thread = state.threads.find((t) => t.id === action.payload.threadId);
          if (thread) {
            thread.upVotesBy = thread.upVotesBy.filter((id) => id !== action.payload.userId);
            thread.downVotesBy = thread.downVotesBy.filter((id) => id !== action.payload.userId);
          }
        });
  },
});

export const { setCategoryFilter } = threadsSlice.actions;
export default threadsSlice.reducer;
