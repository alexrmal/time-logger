import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format, parseISO, differenceInMinutes } from 'date-fns';
import './App.css';

// Components
import ClockInOut from './components/ClockInOut';
import SessionHistory from './components/SessionHistory';
import Analytics from './components/Analytics';
import ActivityManager from './components/ActivityManager';

function App() {
  const [currentView, setCurrentView] = useState('tracker');
  const [activities, setActivities] = useState([]);
  const [activeSession, setActiveSession] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [activitiesRes, sessionsRes, activeRes] = await Promise.all([
        axios.get('/api/activities'),
        axios.get('/api/sessions'),
        axios.get('/api/sessions/active')
      ]);

      setActivities(activitiesRes.data);
      setSessions(sessionsRes.data);
      setActiveSession(activeRes.data);
      setError(null);
    } catch (err) {
      setError('Failed to load data. Please try again.');
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClockIn = async (activityType, notes) => {
    try {
      const response = await axios.post('/api/sessions/clock-in', {
        activity_type: activityType,
        notes
      });

      setActiveSession({
        id: response.data.id,
        activity_type: response.data.activity_type,
        clock_in_time: response.data.clock_in_time,
        notes: response.data.notes
      });

      setSuccess(response.data.message);
      setTimeout(() => setSuccess(null), 3000);
      
      // Reload sessions to update the list
      const sessionsRes = await axios.get('/api/sessions');
      setSessions(sessionsRes.data);
    } catch (err) {
      setError('Failed to clock in. Please try again.');
      console.error('Error clocking in:', err);
    }
  };

  const handleClockOut = async () => {
    try {
      const response = await axios.post('/api/sessions/clock-out', {
        session_id: activeSession.id
      });

      setActiveSession(null);
      setSuccess(response.data.message);
      setTimeout(() => setSuccess(null), 3000);
      
      // Reload sessions to update the list
      const sessionsRes = await axios.get('/api/sessions');
      setSessions(sessionsRes.data);
    } catch (err) {
      setError('Failed to clock out. Please try again.');
      console.error('Error clocking out:', err);
    }
  };

  const handleDeleteSession = async (sessionId) => {
    if (!window.confirm('Are you sure you want to delete this session?')) {
      return;
    }

    try {
      await axios.delete(`/api/sessions/${sessionId}`);
      setSuccess('Session deleted successfully');
      setTimeout(() => setSuccess(null), 3000);
      
      // Reload sessions
      const sessionsRes = await axios.get('/api/sessions');
      setSessions(sessionsRes.data);
    } catch (err) {
      setError('Failed to delete session. Please try again.');
      console.error('Error deleting session:', err);
    }
  };

  const handleAddActivity = async (name, color) => {
    try {
      const response = await axios.post('/api/activities', { name, color });
      setActivities([...activities, response.data]);
      setSuccess('Activity added successfully');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Failed to add activity. Please try again.');
      console.error('Error adding activity:', err);
    }
  };

  const formatDuration = (minutes) => {
    if (!minutes) return '0m';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const getCurrentSessionDuration = () => {
    if (!activeSession) return 0;
    const start = parseISO(activeSession.clock_in_time);
    const now = new Date();
    return differenceInMinutes(now, start);
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <header className="text-center mb-4">
        <h1 className="mb-2">Personal Efficiency Dashboard</h1>
        <p className="text-muted">Track your gym, study, and work sessions</p>
      </header>

      {error && (
        <div className="error">
          {error}
        </div>
      )}

      {success && (
        <div className="success">
          {success}
        </div>
      )}

      {/* Navigation */}
      <nav className="card mb-4">
        <div className="grid grid-3">
          <button
            className={`btn ${currentView === 'tracker' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setCurrentView('tracker')}
          >
            🏃‍♂️ Clock In/Out
          </button>
          <button
            className={`btn ${currentView === 'history' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setCurrentView('history')}
          >
            📋 History
          </button>
          <button
            className={`btn ${currentView === 'analytics' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setCurrentView('analytics')}
          >
            📊 Analytics
          </button>
        </div>
      </nav>

      {/* Active Session Display */}
      {activeSession && (
        <div className="card mb-4" style={{ borderLeft: `4px solid ${activities.find(a => a.name === activeSession.activity_type)?.color || '#667eea'}` }}>
          <div className="grid grid-2">
            <div>
              <h3>Currently Active Session</h3>
              <p><strong>Activity:</strong> {activeSession.activity_type}</p>
              <p><strong>Started:</strong> {format(parseISO(activeSession.clock_in_time), 'MMM d, yyyy h:mm a')}</p>
              {activeSession.notes && <p><strong>Notes:</strong> {activeSession.notes}</p>}
            </div>
            <div className="text-center">
              <div className="stat-number" style={{ color: activities.find(a => a.name === activeSession.activity_type)?.color || '#667eea' }}>
                {formatDuration(getCurrentSessionDuration())}
              </div>
              <p className="stat-label">Duration</p>
              <button className="btn btn-danger mt-2" onClick={handleClockOut}>
                Clock Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      {currentView === 'tracker' && (
        <ClockInOut
          activities={activities}
          onClockIn={handleClockIn}
          activeSession={activeSession}
        />
      )}

      {currentView === 'history' && (
        <SessionHistory
          sessions={sessions}
          activities={activities}
          onDeleteSession={handleDeleteSession}
        />
      )}

      {currentView === 'analytics' && (
        <Analytics activities={activities} />
      )}

      {/* Activity Manager */}
      <div className="card mt-4">
        <ActivityManager
          activities={activities}
          onAddActivity={handleAddActivity}
        />
      </div>
    </div>
  );
}

export default App;
