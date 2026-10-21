const BASE_URL = 'https://forum-api.dicoding.dev/v1';

const api = {
  // Auth
  async register({ name, email, password }) {
    const res = await fetch(`${BASE_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();
    if (data.status !== 'success') throw new Error(data.message);
    return data.data.user;
  },

  async login({ email, password }) {
    const res = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (data.status !== 'success') throw new Error(data.message);
    return data.data.token;
  },

  async getOwnProfile(token) {
    const res = await fetch(`${BASE_URL}/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (data.status !== 'success') throw new Error(data.message);
    return data.data.user;
  },

  // Users
  async getAllUsers() {
    const res = await fetch(`${BASE_URL}/users`);
    const data = await res.json();
    if (data.status !== 'success') throw new Error(data.message);
    return data.data.users;
  },

  // Threads
  async getAllThreads() {
    const res = await fetch(`${BASE_URL}/threads`);
    const data = await res.json();
    if (data.status !== 'success') throw new Error(data.message);
    return data.data.threads;
  },

  async getThreadDetail(threadId) {
    const res = await fetch(`${BASE_URL}/threads/${threadId}`);
    const data = await res.json();
    if (data.status !== 'success') throw new Error(data.message);
    return data.data.detailThread;
  },

  async createThread({ title, body, category }, token) {
    const res = await fetch(`${BASE_URL}/threads`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ title, body, category }),
    });
    const data = await res.json();
    if (data.status !== 'success') throw new Error(data.message);
    return data.data.thread;
  },

  // Votes - Thread
  async upVoteThread(threadId, token) {
    const res = await fetch(`${BASE_URL}/threads/${threadId}/up-vote`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (data.status !== 'success') throw new Error(data.message);
    return data.data.vote;
  },

  async downVoteThread(threadId, token) {
    const res = await fetch(`${BASE_URL}/threads/${threadId}/down-vote`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (data.status !== 'success') throw new Error(data.message);
    return data.data.vote;
  },

  async neutralVoteThread(threadId, token) {
    const res = await fetch(`${BASE_URL}/threads/${threadId}/neutral-vote`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (data.status !== 'success') throw new Error(data.message);
    return data.data.vote;
  },

  // Comments
  async createComment({ threadId, content }, token) {
    const res = await fetch(`${BASE_URL}/threads/${threadId}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ content }),
    });
    const data = await res.json();
    if (data.status !== 'success') throw new Error(data.message);
    return data.data.comment;
  },

  // Votes - Comment
  async upVoteComment(threadId, commentId, token) {
    const res = await fetch(`${BASE_URL}/threads/${threadId}/comments/${commentId}/up-vote`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (data.status !== 'success') throw new Error(data.message);
    return data.data.vote;
  },

  async downVoteComment(threadId, commentId, token) {
    const res = await fetch(`${BASE_URL}/threads/${threadId}/comments/${commentId}/down-vote`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (data.status !== 'success') throw new Error(data.message);
    return data.data.vote;
  },

  async neutralVoteComment(threadId, commentId, token) {
    const res = await fetch(`${BASE_URL}/threads/${threadId}/comments/${commentId}/neutral-vote`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (data.status !== 'success') throw new Error(data.message);
    return data.data.vote;
  },

  // Leaderboard
  async getLeaderboard() {
    const res = await fetch(`${BASE_URL}/leaderboards`);
    const data = await res.json();
    if (data.status !== 'success') throw new Error(data.message);
    return data.data.leaderboards;
  },
};

export default api;
