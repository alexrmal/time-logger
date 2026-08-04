import React, { useState } from 'react';
import { format, parseISO } from 'date-fns';

const SessionHistory = ({ sessions, activities, onDeleteSession }) => {
  const [filter, setFilter] = useState('all');
  const [filteredSessions, setFilteredSessions] = useState(sessions);

  React.useEffect(() => {
    if (filter === 'all') {
      setFilteredSessions(sessions);
    } else {
      setFilteredSessions(sessions.filter(session => session.activity_type === filter));
    }
  }, [sessions, filter]);

  const formatDuration = (minutes) => {
    if (!minutes) return '0m';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const getActivityColor = (activityName) => {
    const activity = activities.find(a => a.name === activityName);
    return activity ? activity.color : '#667eea';
  };

  const getActivityIcon = (activityName) => {
    switch (activityName.toLowerCase()) {
      case 'gym': return '🏋️‍♂️';
      case 'study': return '📚';
      case 'work': return '💼';
      default: return '⚡';
    }
  };

  const exportToCSV = () => {
    const csvContent = [
      ['Activity', 'Clock In', 'Clock Out', 'Duration (minutes)', 'Notes'],
      ...filteredSessions.map(session => [
        session.activity_type,
        format(parseISO(session.clock_in_time), 'yyyy-MM-dd HH:mm'),
        session.clock_out_time ? format(parseISO(session.clock_out_time), 'yyyy-MM-dd HH:mm') : 'In Progress',
        session.duration_minutes || 0,
        session.notes || ''
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `time-logger-export-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="card">
      <div className="grid grid-2 mb-3">
        <h2>Session History</h2>
        <div className="text-center">
          <button className="btn btn-secondary" onClick={exportToCSV}>
            📥 Export CSV
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="filter-tabs">
        <button
          className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All Sessions
        </button>
        {activities.map((activity) => (
          <button
            key={activity.id}
            className={`filter-tab ${filter === activity.name ? 'active' : ''}`}
            onClick={() => setFilter(activity.name)}
            style={{ 
              backgroundColor: filter === activity.name ? activity.color : 'white',
              color: filter === activity.name ? 'white' : 'inherit'
            }}
          >
            {getActivityIcon(activity.name)} {activity.name}
          </button>
        ))}
      </div>

      {/* Sessions List */}
      <div className="session-list">
        {filteredSessions.length === 0 ? (
          <div className="text-center text-muted">
            <p>No sessions found. Start tracking your activities!</p>
          </div>
        ) : (
          filteredSessions.map((session) => (
            <div
              key={session.id}
              className="session-item"
              style={{ borderLeftColor: getActivityColor(session.activity_type) }}
            >
              <div className="grid grid-2">
                <div>
                  <h4>
                    {getActivityIcon(session.activity_type)} {session.activity_type}
                  </h4>
                  <p className="text-muted mb-1">
                    <strong>In:</strong> {format(parseISO(session.clock_in_time), 'MMM d, yyyy h:mm a')}
                  </p>
                  {session.clock_out_time && (
                    <p className="text-muted mb-1">
                      <strong>Out:</strong> {format(parseISO(session.clock_out_time), 'MMM d, yyyy h:mm a')}
                    </p>
                  )}
                  {session.notes && (
                    <p className="text-muted mb-1">
                      <strong>Notes:</strong> {session.notes}
                    </p>
                  )}
                </div>
                <div className="text-center">
                  <div className="stat-number" style={{ color: getActivityColor(session.activity_type) }}>
                    {formatDuration(session.duration_minutes)}
                  </div>
                  <p className="stat-label">Duration</p>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => onDeleteSession(session.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {filteredSessions.length > 0 && (
        <div className="stats-grid mt-3">
          <div className="stat-card">
            <div className="stat-number">{filteredSessions.length}</div>
            <div className="stat-label">Total Sessions</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">
              {formatDuration(
                filteredSessions.reduce((sum, session) => sum + (session.duration_minutes || 0), 0)
              )}
            </div>
            <div className="stat-label">Total Time</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">
              {Math.round(
                filteredSessions.reduce((sum, session) => sum + (session.duration_minutes || 0), 0) / 
                Math.max(filteredSessions.length, 1)
              )}m
            </div>
            <div className="stat-label">Avg Duration</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SessionHistory;
