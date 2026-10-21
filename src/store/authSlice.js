import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api';

export const loginUser = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const token = await api.login(credentials);
    localStorage.setItem('token', token);
    const user = await api.getOwnProfile(token);
    return { token, user };
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const registerUser = createAsyncThunk('auth/register', async (data, { rejectWithValue }) => {
  try {
    await api.register(data);
    return true;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const fetchOwnProfile = createAsyncThunk('auth/fetchProfile', async (_, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token');
    const user = await api.getOwnProfile(token);
    return { token, user };
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: { user: null, token: null, loading: false, error: null },
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      localStorage.removeItem('token');
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
        .addCase(loginUser.pending, (state) => {
          state.loading = true; state.error = null;
        })
        .addCase(loginUser.fulfilled, (state, action) => {
          state.loading = false;
          state.token = action.payload.token;
          state.user = action.payload.user;
        })
        .addCase(loginUser.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })
        .addCase(fetchOwnProfile.fulfilled, (state, action) => {
          state.token = action.payload.token;
          state.user = action.payload.user;
        })
        .addCase(fetchOwnProfile.rejected, (state) => {
          state.token = null;
          state.user = null;
          localStorage.removeItem('token');
        });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
