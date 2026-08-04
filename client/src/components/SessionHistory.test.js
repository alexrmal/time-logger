import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SessionHistory from './SessionHistory';

describe('SessionHistory CSV export', () => {
  test('exports filtered sessions as CSV', () => {
    const createObjectURL = jest.fn(() => 'blob:mock');
    const revokeObjectURL = jest.fn();
    window.URL.createObjectURL = createObjectURL;
    window.URL.revokeObjectURL = revokeObjectURL;

    const click = jest.fn();
    const originalCreateElement = document.createElement.bind(document);
    jest.spyOn(document, 'createElement').mockImplementation((tag) => {
      const el = originalCreateElement(tag);
      if (tag === 'a') {
        el.click = click;
      }
      return el;
    });

    render(
      <SessionHistory
        sessions={[
          {
            id: '1',
            activity_type: 'Study',
            clock_in_time: '2026-08-01T10:00:00.000Z',
            clock_out_time: '2026-08-01T11:00:00.000Z',
            duration_minutes: 60,
            notes: 'Algorithms'
          }
        ]}
        activities={[{ id: '1', name: 'Study', color: '#4ECDC4' }]}
        onDeleteSession={jest.fn()}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /Export CSV/i }));

    expect(createObjectURL).toHaveBeenCalled();
    expect(click).toHaveBeenCalled();
    const blobArg = createObjectURL.mock.calls[0][0];
    expect(blobArg.type).toBe('text/csv');

    document.createElement.mockRestore();
  });
});
