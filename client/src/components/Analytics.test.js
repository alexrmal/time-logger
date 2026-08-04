import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import Analytics from './Analytics';

jest.mock('axios');

describe('Analytics', () => {
  beforeEach(() => {
    axios.get.mockResolvedValue({
      data: {
        period: 'week',
        total_sessions: 2,
        total_minutes: 90,
        avg_duration: 45,
        active_days: 2,
        total_days: 7,
        consistency_percentage: 28.57,
        daily_data: []
      }
    });
  });

  test('offers 7-, 30-, and 365-day analytics windows', async () => {
    render(
      <Analytics
        activities={[
          { id: '1', name: 'Gym', color: '#FF6B6B' },
          { id: '2', name: 'Study', color: '#4ECDC4' },
          { id: '3', name: 'Work', color: '#45B7D1' }
        ]}
      />
    );

    await waitFor(() => {
      expect(screen.getByLabelText(/Time Period/i)).toBeInTheDocument();
    });

    expect(screen.getByRole('option', { name: /Last 7 Days/i })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: /Last 30 Days/i })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: /Last Year/i })).toBeInTheDocument();
    expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('period=week'));

    fireEvent.change(screen.getByLabelText(/Time Period/i), {
      target: { value: 'month' }
    });
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('period=month'));
    });
    await waitFor(() => {
      expect(screen.getByLabelText(/Time Period/i)).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText(/Time Period/i), {
      target: { value: 'year' }
    });
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('period=year'));
    });
  });
});
