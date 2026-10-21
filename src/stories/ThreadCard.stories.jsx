import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import ThreadCard from '../components/ThreadCard';
import authReducer from '../store/authSlice';
import threadsReducer from '../store/threadsSlice';

const mockStore = configureStore({
  reducer: {
    auth: authReducer,
    threads: threadsReducer,
  },
  preloadedState: {
    auth: { user: { id: 'user-1', name: 'John Doe' }, token: 'xyz' },
  },
});

export default {
  title: 'Components/ThreadCard',
  component: ThreadCard,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <Provider store={mockStore}>
        <MemoryRouter>
          <div style={{ maxWidth: '680px', margin: '24px auto' }}>
            <Story />
          </div>
        </MemoryRouter>
      </Provider>
    ),
  ],
};

const sampleThread = {
  id: 'thread-1',
  title: 'Pengalaman Menerapkan CI/CD di Dicoding Submission',
  body: 'CI/CD sangat mempermudah proses deployment dan pengujian secara otomatis tanpa perlu melakukannya secara manual.',
  category: 'react',
  createdAt: new Date().toISOString(),
  ownerId: 'user-1',
  upVotesBy: ['user-2'],
  downVotesBy: [],
  totalComments: 5,
};

const sampleOwner = {
  id: 'user-1',
  name: 'John Doe',
  avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=e94560&color=fff',
};

export const Default = {
  args: {
    thread: sampleThread,
    owner: sampleOwner,
  },
};

export const HighlyVoted = {
  args: {
    thread: {
      ...sampleThread,
      upVotesBy: ['user-1', 'user-2', 'user-3', 'user-4', 'user-5'],
      totalComments: 18,
    },
    owner: sampleOwner,
  },
};

export const NoComments = {
  args: {
    thread: {
      ...sampleThread,
      upVotesBy: [],
      downVotesBy: [],
      totalComments: 0,
    },
    owner: sampleOwner,
  },
};
