import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';

const ClockInOut = ({ activities, onClockIn, activeSession }) => {
  const [selectedActivity, setSelectedActivity] = useState('');
  const [notes, setNotes] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleClockIn = () => {
    if (!selectedActivity) {
      alert('Please select an activity first');
      return;
    }
    
    onClockIn(selectedActivity, notes);
    setNotes('');
  };

  const getActivityIcon = (activityName) => {
    switch (activityName.toLowerCase()) {
      case 'gym': return '🏋️‍♂️';
      case 'study': return '📚';
      case 'work': return '💼';
      default: return '⚡';
    }
  };

  if (activeSession) {
    return (
      <div className="card text-center">
        <h2>Session in Progress</h2>
        <div className="clock-display">
          {format(currentTime, 'h:mm:ss a')}
        </div>
        <p>You're currently logged into <strong>{activeSession.activity_type}</strong></p>
        <p>Started at {format(new Date(activeSession.clock_in_time), 'h:mm a')}</p>
      </div>
    );
  }

  return (
    <div className="card">
      <h2 className="mb-3">Start New Session</h2>
      
      <div className="clock-display">
        {format(currentTime, 'h:mm:ss a')}
      </div>
      
      <div className="form-group">
        <label className="form-label">Select Activity</label>
        <div className="activity-selector">
          {activities.map((activity) => (
            <button
              key={activity.id}
              className={`activity-button ${selectedActivity === activity.name ? 'selected' : ''}`}
              onClick={() => setSelectedActivity(activity.name)}
              style={{ 
                color: activity.color,
                borderColor: selectedActivity === activity.name ? activity.color : '#e9ecef'
              }}
            >
              <span className="icon">{getActivityIcon(activity.name)}</span>
              {activity.name}
            </button>
          ))}
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Notes (Optional)</label>
        <textarea
          className="form-control"
          rows="3"
          placeholder="Add any notes about this session..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>

      <button
        className="btn btn-primary"
        onClick={handleClockIn}
        disabled={!selectedActivity}
      >
        🚀 Clock In
      </button>
    </div>
  );
};

export default ClockInOut;
