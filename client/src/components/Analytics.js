import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { format, subDays, startOfDay } from 'date-fns';
import axios from 'axios';

const Analytics = ({ activities }) => {
  const [analytics, setAnalytics] = useState(null);
  const [period, setPeriod] = useState('week');
  const [selectedActivity, setSelectedActivity] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, [period, selectedActivity]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({ period });
      if (selectedActivity !== 'all') {
        params.append('activity_type', selectedActivity);
      }
      
      const response = await axios.get(`/api/analytics?${params}`);
      setAnalytics(response.data);
    } catch (err) {
      console.error('Error loading analytics:', err);
    } finally {
      setLoading(false);
    }
  };

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

  if (loading) {
    return (
      <div className="card">
        <div className="loading">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="card">
        <div className="error">
          Failed to load analytics data
        </div>
      </div>
    );
  }

  // Prepare data for charts
  const activityBreakdown = activities.map(activity => {
    const activityData = analytics.daily_data.filter(d => d.activity_type === activity.name);
    const totalMinutes = activityData.reduce((sum, d) => sum + d.total_minutes, 0);
    return {
      name: activity.name,
      value: totalMinutes,
      sessions: activityData.reduce((sum, d) => sum + d.total_sessions, 0),
      color: activity.color
    };
  }).filter(item => item.value > 0);

  // Daily activity chart data
  const dailyChartData = analytics.daily_data.reduce((acc, item) => {
    const existingDay = acc.find(d => d.date === item.session_date);
    if (existingDay) {
      existingDay[item.activity_type] = item.total_minutes;
      existingDay.totalMinutes += item.total_minutes;
    } else {
      acc.push({
        date: item.session_date,
        [item.activity_type]: item.total_minutes,
        totalMinutes: item.total_minutes
      });
    }
    return acc;
  }, []).sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <div>
      {/* Controls */}
      <div className="card mb-4">
        <div className="grid grid-3">
          <div className="form-group">
            <label className="form-label">Time Period</label>
            <select 
              className="form-control"
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
            >
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
              <option value="year">Last Year</option>
            </select>
          </div>
          
          <div className="form-group">
            <label className="form-label">Activity Filter</label>
            <select 
              className="form-control"
              value={selectedActivity}
              onChange={(e) => setSelectedActivity(e.target.value)}
            >
              <option value="all">All Activities</option>
              {activities.map(activity => (
                <option key={activity.id} value={activity.name}>
                  {getActivityIcon(activity.name)} {activity.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label className="form-label">&nbsp;</label>
            <button className="btn btn-primary" onClick={loadAnalytics}>
              🔄 Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="stats-grid mb-4">
        <div className="stat-card">
          <div className="stat-number">{analytics.total_sessions}</div>
          <div className="stat-label">Total Sessions</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{formatDuration(analytics.total_minutes)}</div>
          <div className="stat-label">Total Time</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{Math.round(analytics.avg_duration)}m</div>
          <div className="stat-label">Avg Duration</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{analytics.consistency_percentage}%</div>
          <div className="stat-label">Consistency</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{analytics.active_days}</div>
          <div className="stat-label">Active Days</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{analytics.total_days}</div>
          <div className="stat-label">Total Days</div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-2 mb-4">
        {/* Activity Breakdown Pie Chart */}
        <div className="chart-container">
          <h3>Time Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={activityBreakdown}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {activityBreakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatDuration(value)} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Daily Activity Bar Chart */}
        <div className="chart-container">
          <h3>Daily Activity</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dailyChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tickFormatter={(value) => format(new Date(value), 'MMM d')}
              />
              <YAxis tickFormatter={(value) => `${value}m`} />
              <Tooltip 
                formatter={(value, name) => [formatDuration(value), name]}
                labelFormatter={(value) => format(new Date(value), 'MMM d, yyyy')}
              />
              {activities.map(activity => (
                <Bar 
                  key={activity.name}
                  dataKey={activity.name} 
                  stackId="a"
                  fill={activity.color}
                  name={activity.name}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Consistency Line Chart */}
      <div className="chart-container mb-4">
        <h3>Consistency Over Time</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={dailyChartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date" 
              tickFormatter={(value) => format(new Date(value), 'MMM d')}
            />
            <YAxis />
            <Tooltip 
              formatter={(value) => [formatDuration(value), 'Total Time']}
              labelFormatter={(value) => format(new Date(value), 'MMM d, yyyy')}
            />
            <Line 
              type="monotone" 
              dataKey="totalMinutes" 
              stroke="#667eea" 
              strokeWidth={2}
              dot={{ fill: '#667eea', strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Activity Details */}
      <div className="card">
        <h3>Activity Breakdown</h3>
        <div className="grid grid-3">
          {activityBreakdown.map(item => (
            <div key={item.name} className="activity-card" style={{ borderLeftColor: item.color }}>
              <div className="text-center">
                <div className="stat-number" style={{ color: item.color }}>
                  {formatDuration(item.value)}
                </div>
                <div className="stat-label">{item.name}</div>
                <p className="text-muted">{item.sessions} sessions</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
