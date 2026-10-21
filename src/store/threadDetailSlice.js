import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api';

export const fetchThreadDetail = createAsyncThunk('threadDetail/fetch', async (threadId, { rejectWithValue }) => {
  try {
    return await api.getThreadDetail(threadId);
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const createComment = createAsyncThunk('threadDetail/createComment', async ({ threadId, content }, { getState, rejectWithValue }) => {
  try {
    const { token } = getState().auth;
    return await api.createComment({ threadId, content }, token);
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const upVoteComment = createAsyncThunk('threadDetail/upVoteComment', async ({ threadId, commentId }, { getState, rejectWithValue }) => {
  try {
    const { token, user } = getState().auth;
    await api.upVoteComment(threadId, commentId, token);
    return { commentId, userId: user.id };
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const downVoteComment = createAsyncThunk('threadDetail/downVoteComment', async ({ threadId, commentId }, { getState, rejectWithValue }) => {
  try {
    const { token, user } = getState().auth;
    await api.downVoteComment(threadId, commentId, token);
    return { commentId, userId: user.id };
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const neutralVoteComment = createAsyncThunk('threadDetail/neutralVoteComment', async ({ threadId, commentId }, { getState, rejectWithValue }) => {
  try {
    const { token, user } = getState().auth;
    await api.neutralVoteComment(threadId, commentId, token);
    return { commentId, userId: user.id };
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const upVoteThreadDetail = createAsyncThunk('threadDetail/upVote', async (threadId, { getState, rejectWithValue }) => {
  try {
    const { token, user } = getState().auth;
    await api.upVoteThread(threadId, token);
    return { userId: user.id };
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const downVoteThreadDetail = createAsyncThunk('threadDetail/downVote', async (threadId, { getState, rejectWithValue }) => {
  try {
    const { token, user } = getState().auth;
    await api.downVoteThread(threadId, token);
    return { userId: user.id };
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const neutralVoteThreadDetail = createAsyncThunk('threadDetail/neutralVote', async (threadId, { getState, rejectWithValue }) => {
  try {
    const { token, user } = getState().auth;
    await api.neutralVoteThread(threadId, token);
    return { userId: user.id };
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

const threadDetailSlice = createSlice({
  name: 'threadDetail',
  initialState: { thread: null, loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
        .addCase(fetchThreadDetail.pending, (state) => {
          state.loading = true; state.thread = null;
        })
        .addCase(fetchThreadDetail.fulfilled, (state, action) => {
          state.loading = false;
          state.thread = action.payload;
        })
        .addCase(fetchThreadDetail.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })
        .addCase(createComment.fulfilled, (state, action) => {
          if (state.thread) state.thread.comments.push(action.payload);
        })
        .addCase(upVoteComment.fulfilled, (state, action) => {
          const comment = state.thread?.comments.find((c) => c.id === action.payload.commentId);
          if (comment) {
            comment.downVotesBy = comment.downVotesBy.filter((id) => id !== action.payload.userId);
            if (!comment.upVotesBy.includes(action.payload.userId)) comment.upVotesBy.push(action.payload.userId);
          }
        })
        .addCase(downVoteComment.fulfilled, (state, action) => {
          const comment = state.thread?.comments.find((c) => c.id === action.payload.commentId);
          if (comment) {
            comment.upVotesBy = comment.upVotesBy.filter((id) => id !== action.payload.userId);
            if (!comment.downVotesBy.includes(action.payload.userId)) comment.downVotesBy.push(action.payload.userId);
          }
        })
        .addCase(neutralVoteComment.fulfilled, (state, action) => {
          const comment = state.thread?.comments.find((c) => c.id === action.payload.commentId);
          if (comment) {
            comment.upVotesBy = comment.upVotesBy.filter((id) => id !== action.payload.userId);
            comment.downVotesBy = comment.downVotesBy.filter((id) => id !== action.payload.userId);
          }
        })
        .addCase(upVoteThreadDetail.fulfilled, (state, action) => {
          if (state.thread) {
            state.thread.downVotesBy = state.thread.downVotesBy.filter((id) => id !== action.payload.userId);
            if (!state.thread.upVotesBy.includes(action.payload.userId)) state.thread.upVotesBy.push(action.payload.userId);
          }
        })
        .addCase(downVoteThreadDetail.fulfilled, (state, action) => {
          if (state.thread) {
            state.thread.upVotesBy = state.thread.upVotesBy.filter((id) => id !== action.payload.userId);
            if (!state.thread.downVotesBy.includes(action.payload.userId)) state.thread.downVotesBy.push(action.payload.userId);
          }
        })
        .addCase(neutralVoteThreadDetail.fulfilled, (state, action) => {
          if (state.thread) {
            state.thread.upVotesBy = state.thread.upVotesBy.filter((id) => id !== action.payload.userId);
            state.thread.downVotesBy = state.thread.downVotesBy.filter((id) => id !== action.payload.userId);
          }
        });
  },
});

export default threadDetailSlice.reducer;
