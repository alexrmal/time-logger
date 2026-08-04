import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import App from './App';

jest.mock('axios');

describe('Personal Efficiency Dashboard', () => {
  beforeEach(() => {
    axios.get.mockImplementation((url) => {
      if (url === '/api/activities') {
        return Promise.resolve({
          data: [
            { id: '1', name: 'Gym', color: '#FF6B6B' },
            { id: '2', name: 'Study', color: '#4ECDC4' },
            { id: '3', name: 'Work', color: '#45B7D1' }
          ]
        });
      }
      if (url === '/api/sessions') {
        return Promise.resolve({ data: [] });
      }
      if (url === '/api/sessions/active') {
        return Promise.resolve({ data: null });
      }
      return Promise.resolve({ data: {} });
    });
  });

  test('renders the dashboard brand and session tracker nav', async () => {
    render(<App />);

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: /Personal Efficiency Dashboard/i })
      ).toBeInTheDocument();
    });

    expect(screen.getByText(/gym, study, and work sessions/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Clock In\/Out/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Analytics/i })).toBeInTheDocument();
  });
});
