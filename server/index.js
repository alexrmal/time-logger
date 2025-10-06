const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const moment = require('moment');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Only serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

// Simple JSON file database
const DATA_FILE = './data.json';

// Initialize data file
if (!fs.existsSync(DATA_FILE)) {
  const initialData = {
    activities: [
      { id: uuidv4(), name: 'Gym', color: '#FF6B6B', created_at: new Date().toISOString() },
      { id: uuidv4(), name: 'Study', color: '#4ECDC4', created_at: new Date().toISOString() },
      { id: uuidv4(), name: 'Work', color: '#45B7D1', created_at: new Date().toISOString() }
    ],
    sessions: []
  };
  fs.writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2));
}

// Helper functions
const readData = () => {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading data:', err);
    return { activities: [], sessions: [] };
  }
};

const writeData = (data) => {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    return true;
  } catch (err) {
    console.error('Error writing data:', err);
    return false;
  }
};

// API Routes

// Get all activities
app.get('/api/activities', (req, res) => {
  const data = readData();
  res.json(data.activities);
});

// Add new activity
app.post('/api/activities', (req, res) => {
  const { name, color } = req.body;
  const data = readData();
  
  const newActivity = {
    id: uuidv4(),
    name,
    color,
    created_at: new Date().toISOString()
  };
  
  data.activities.push(newActivity);
  
  if (writeData(data)) {
    res.json(newActivity);
  } else {
    res.status(500).json({ error: 'Failed to save activity' });
  }
});

// Get all sessions
app.get('/api/sessions', (req, res) => {
  const { activity_type, start_date, end_date } = req.query;
  const data = readData();
  let sessions = data.sessions;
  
  if (activity_type) {
    sessions = sessions.filter(s => s.activity_type === activity_type);
  }
  
  if (start_date) {
    sessions = sessions.filter(s => s.created_at >= start_date);
  }
  
  if (end_date) {
    sessions = sessions.filter(s => s.created_at <= end_date);
  }
  
  sessions.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  res.json(sessions);
});

// Clock in
app.post('/api/sessions/clock-in', (req, res) => {
  const { activity_type, notes } = req.body;
  const data = readData();
  
  const newSession = {
    id: uuidv4(),
    activity_type,
    clock_in_time: new Date().toISOString(),
    clock_out_time: null,
    duration_minutes: null,
    notes: notes || '',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  data.sessions.push(newSession);
  
  if (writeData(data)) {
    res.json({
      id: newSession.id,
      activity_type: newSession.activity_type,
      clock_in_time: newSession.clock_in_time,
      notes: newSession.notes,
      message: 'Clocked in successfully!'
    });
  } else {
    res.status(500).json({ error: 'Failed to save session' });
  }
});

// Clock out
app.post('/api/sessions/clock-out', (req, res) => {
  const { session_id } = req.body;
  const data = readData();
  
  const sessionIndex = data.sessions.findIndex(s => s.id === session_id && !s.clock_out_time);
  
  if (sessionIndex === -1) {
    res.status(404).json({ error: 'Active session not found' });
    return;
  }
  
  const session = data.sessions[sessionIndex];
  const clockOutTime = new Date().toISOString();
  const clockInTime = moment(session.clock_in_time);
  const durationMinutes = moment(clockOutTime).diff(clockInTime, 'minutes');
  
  data.sessions[sessionIndex] = {
    ...session,
    clock_out_time: clockOutTime,
    duration_minutes: durationMinutes,
    updated_at: clockOutTime
  };
  
  if (writeData(data)) {
    res.json({
      session_id,
      clock_out_time: clockOutTime,
      duration_minutes: durationMinutes,
      message: 'Clocked out successfully!'
    });
  } else {
    res.status(500).json({ error: 'Failed to save session' });
  }
});

// Get active session
app.get('/api/sessions/active', (req, res) => {
  const data = readData();
  const activeSession = data.sessions.find(s => !s.clock_out_time);
  res.json(activeSession || null);
});

// Get analytics data
app.get('/api/analytics', (req, res) => {
  const { period = 'week', activity_type } = req.query;
  const data = readData();
  
  let startDate;
  switch (period) {
    case 'week':
      startDate = moment().subtract(7, 'days').format('YYYY-MM-DD');
      break;
    case 'month':
      startDate = moment().subtract(30, 'days').format('YYYY-MM-DD');
      break;
    case 'year':
      startDate = moment().subtract(365, 'days').format('YYYY-MM-DD');
      break;
    default:
      startDate = moment().subtract(7, 'days').format('YYYY-MM-DD');
  }
  
  let sessions = data.sessions.filter(s => 
    s.clock_out_time && 
    moment(s.clock_in_time).format('YYYY-MM-DD') >= startDate
  );
  
  if (activity_type) {
    sessions = sessions.filter(s => s.activity_type === activity_type);
  }
  
  // Calculate analytics
  const totalSessions = sessions.length;
  const totalMinutes = sessions.reduce((sum, s) => sum + (s.duration_minutes || 0), 0);
  const uniqueDays = new Set(sessions.map(s => moment(s.clock_in_time).format('YYYY-MM-DD'))).size;
  
  const periodDays = moment().diff(moment(startDate), 'days') + 1;
  const consistency = periodDays > 0 ? (uniqueDays / periodDays) * 100 : 0;
  
  // Group by activity and date
  const dailyData = {};
  sessions.forEach(session => {
    const date = moment(session.clock_in_time).format('YYYY-MM-DD');
    const activity = session.activity_type;
    
    if (!dailyData[date]) {
      dailyData[date] = {};
    }
    
    if (!dailyData[date][activity]) {
      dailyData[date][activity] = {
        total_sessions: 0,
        total_minutes: 0,
        avg_duration: 0
      };
    }
    
    dailyData[date][activity].total_sessions += 1;
    dailyData[date][activity].total_minutes += session.duration_minutes || 0;
  });
  
  // Convert to array format
  const dailyArray = Object.entries(dailyData).map(([date, activities]) => {
    const result = { session_date: date };
    Object.entries(activities).forEach(([activity, stats]) => {
      result[activity] = stats.total_minutes;
      result[`${activity}_sessions`] = stats.total_sessions;
    });
    return result;
  }).sort((a, b) => new Date(a.session_date) - new Date(b.session_date));
  
  res.json({
    period,
    start_date: startDate,
    total_sessions: totalSessions,
    total_minutes: totalMinutes,
    avg_duration: totalSessions > 0 ? totalMinutes / totalSessions : 0,
    active_days: uniqueDays,
    total_days: periodDays,
    consistency_percentage: Math.round(consistency * 100) / 100,
    daily_data: dailyArray
  });
});

// Delete session
app.delete('/api/sessions/:id', (req, res) => {
  const { id } = req.params;
  const data = readData();
  
  const sessionIndex = data.sessions.findIndex(s => s.id === id);
  
  if (sessionIndex === -1) {
    res.status(404).json({ error: 'Session not found' });
    return;
  }
  
  data.sessions.splice(sessionIndex, 1);
  
  if (writeData(data)) {
    res.json({ message: 'Session deleted successfully' });
  } else {
    res.status(500).json({ error: 'Failed to delete session' });
  }
});

// Serve React app (only in production)
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });
} else {
  // In development, just serve API endpoints
  app.get('*', (req, res) => {
    res.json({ message: 'Time Logger API - Frontend should be running on port 3000' });
  });
}

app.listen(PORT, () => {
  console.log(`🚀 Time Logger Server running on port ${PORT}`);
  console.log(`📱 Frontend: http://localhost:${PORT}`);
  console.log(`🔧 API: http://localhost:${PORT}/api`);
});