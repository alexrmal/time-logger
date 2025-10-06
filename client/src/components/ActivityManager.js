import React, { useState } from 'react';

const ActivityManager = ({ activities, onAddActivity }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newActivityName, setNewActivityName] = useState('');
  const [newActivityColor, setNewActivityColor] = useState('#667eea');

  const predefinedColors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
    '#F8C471', '#82E0AA', '#F1948A', '#85C1E9', '#D7BDE2'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newActivityName.trim()) {
      onAddActivity(newActivityName.trim(), newActivityColor);
      setNewActivityName('');
      setShowAddForm(false);
    }
  };

  const getActivityIcon = (activityName) => {
    switch (activityName.toLowerCase()) {
      case 'gym': return '🏋️‍♂️';
      case 'study': return '📚';
      case 'work': return '💼';
      default: return '⚡';
    }
  };

  return (
    <div>
      <div className="grid grid-2 mb-3">
        <h3>Manage Activities</h3>
        <div className="text-center">
          <button
            className="btn btn-primary"
            onClick={() => setShowAddForm(!showAddForm)}
          >
            {showAddForm ? '❌ Cancel' : '➕ Add Activity'}
          </button>
        </div>
      </div>

      {/* Current Activities */}
      <div className="grid grid-3 mb-3">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="activity-card"
            style={{ borderLeftColor: activity.color }}
          >
            <div className="text-center">
              <div className="stat-number" style={{ color: activity.color }}>
                {getActivityIcon(activity.name)}
              </div>
              <div className="stat-label">{activity.name}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Activity Form */}
      {showAddForm && (
        <div className="card">
          <h4>Add New Activity</h4>
          <form onSubmit={handleSubmit} className="add-activity-form">
            <div className="form-group">
              <label className="form-label">Activity Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g., Reading, Running, Cooking"
                value={newActivityName}
                onChange={(e) => setNewActivityName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Color</label>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {predefinedColors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    className="color-picker"
                    style={{ backgroundColor: color }}
                    onClick={() => setNewActivityColor(color)}
                    title={color}
                  />
                ))}
                <input
                  type="color"
                  className="color-picker"
                  value={newActivityColor}
                  onChange={(e) => setNewActivityColor(e.target.value)}
                  title="Custom color"
                />
              </div>
            </div>

            <div className="form-group">
              <button type="submit" className="btn btn-success">
                ✅ Add Activity
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tips */}
      <div className="card">
        <h4>💡 Tips</h4>
        <ul style={{ marginLeft: '20px', color: '#6c757d' }}>
          <li>Track different types of activities to see patterns in your productivity</li>
          <li>Use consistent activity names for better analytics</li>
          <li>Add notes to remember important details about your sessions</li>
          <li>Check the Analytics tab to see your consistency over time</li>
        </ul>
      </div>
    </div>
  );
};

export default ActivityManager;
