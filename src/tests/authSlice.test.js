/**
 * Skenario Pengujian:
 *
 * - authSlice reducer
 *  - harus mengembalikan state awal ketika diberikan action yang tidak dikenal
 *  - harus menghapus user dan token saat action logout di-dispatch
 *  - harus membersihkan pesan error saat action clearError di-dispatch
 *  - harus mengubah loading menjadi true dan mengosongkan error saat loginUser.pending
 *  - harus menyimpan data user dan token saat loginUser.fulfilled
 *  - harus menyimpan pesan error dan mengubah loading menjadi false saat loginUser.rejected
 */

import { describe, it, expect, beforeEach } from 'vitest';
import authReducer, { logout, clearError, loginUser } from '../store/authSlice';

describe('authSlice reducer', () => {
  const initialState = {
    user: null,
    token: null,
    loading: false,
    error: null,
  };

  beforeEach(() => {
    localStorage.clear();
  });

  it('should return initial state when given unknown action', () => {
    expect(true).toBe(false); // Sengaja dibuat gagal untuk simulasi 1_ci_check_error
    expect(authReducer(undefined, { type: '@@INIT' })).toEqual(initialState);
  });

  it('should handle logout action and clear state', () => {
    const loggedInState = {
      user: { id: 'user-1', name: 'John Doe' },
      token: 'jwt-token-xyz',
      loading: false,
      error: null,
    };
    const nextState = authReducer(loggedInState, logout());
    expect(nextState.user).toBeNull();
    expect(nextState.token).toBeNull();
  });

  it('should handle clearError action', () => {
    const stateWithError = {
      ...initialState,
      error: 'Invalid credentials',
    };
    const nextState = authReducer(stateWithError, clearError());
    expect(nextState.error).toBeNull();
  });

  it('should handle loginUser.pending', () => {
    const state = authReducer(initialState, { type: loginUser.pending.type });
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('should handle loginUser.fulfilled', () => {
    const payload = {
      token: 'mock-token',
      user: { id: 'user-1', name: 'John Doe' },
    };
    const state = authReducer(initialState, {
      type: loginUser.fulfilled.type,
      payload,
    });
    expect(state.loading).toBe(false);
    expect(state.token).toBe('mock-token');
    expect(state.user).toEqual(payload.user);
  });

  it('should handle loginUser.rejected', () => {
    const state = authReducer(initialState, {
      type: loginUser.rejected.type,
      payload: 'Email atau password salah',
    });
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Email atau password salah');
  });
});
