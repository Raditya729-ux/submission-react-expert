import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api';

export const fetchLeaderboard = createAsyncThunk('leaderboard/fetch', async (_, { rejectWithValue }) => {
  try {
    return await api.getLeaderboard();
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

const leaderboardSlice = createSlice({
  name: 'leaderboard',
  initialState: { data: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
        .addCase(fetchLeaderboard.pending, (state) => {
          state.loading = true;
        })
        .addCase(fetchLeaderboard.fulfilled, (state, action) => {
          state.loading = false;
          state.data = action.payload;
        })
        .addCase(fetchLeaderboard.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        });
  },
});

export default leaderboardSlice.reducer;
