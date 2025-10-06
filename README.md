# Time Logger

A modern web application to track your gym, study, and work sessions with detailed analytics and consistency graphs.

![Time Logger](https://img.shields.io/badge/React-18.2.0-blue) ![Node.js](https://img.shields.io/badge/Node.js-Express-green) ![SQLite](https://img.shields.io/badge/Database-SQLite-lightblue)

## Features

- **Clock In/Out Tracking**: Easy one-click session tracking for different activities
- **Multiple Activity Types**: Track gym, study, work, or any custom activities
- **Real-time Duration**: See how long you've been active in real-time
- **Session History**: Complete history of all your sessions with filtering
- **Analytics Dashboard**: Beautiful charts showing your consistency and patterns
- **Data Export**: Export your session data to CSV for external analysis
- **Responsive Design**: Works perfectly on desktop and mobile devices

## Analytics & Insights

- **Consistency Graphs**: Track your daily/weekly/monthly consistency
- **Activity Breakdown**: See how much time you spend on each activity
- **Duration Analytics**: Average session lengths and total time tracking
- **Visual Charts**: Interactive pie charts, bar charts, and line graphs
- **Period Filtering**: Analyze different time periods (7 days, 30 days, 1 year)

## Technology Stack

### Frontend
- **React 18.2.0** - Modern UI framework
- **Recharts** - Beautiful data visualization
- **Date-fns** - Date manipulation and formatting
- **Axios** - HTTP client for API calls

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **JSON File Storage** - Lightweight data persistence
- **UUID** - Unique identifier generation
- **Moment.js** - Date and time utilities

## Installation

1. **Clone or navigate to the project directory**
   ```bash
   cd "/Users/alexmaldonado/Downloads/Code Projects/Attendance : Time Logger"
   ```

2. **Install all dependencies**
   ```bash
   # Install root dependencies
   npm install
   
   # Install server dependencies
   cd server && npm install && cd ..
   
   
   ```

3. **Start the development servers**

   **Option 1: Use the startup script**
   ```bash
   ./start.sh
   ```

   **Option 2: Start manually**
   ```bash
   # Terminal 1 - Backend server
   cd server && node index.js
   
   # Terminal 2 - Frontend React app
   cd client && npm start
   ```

   This will start:
   - Backend server on `http://localhost:3001`
   - Frontend React app on `http://localhost:3000`

## Usage

### Getting Started
1. Open your browser to `http://localhost:3000`
2. Select an activity type (Gym, Study, Work, or add custom ones)
3. Click "Clock In" to start tracking
4. Add optional notes about your session
5. Click "Clock Out" when finished

### Managing Activities
- Use the "Add Activity" button to create custom activity types
- Choose colors to distinguish different activities
- Activities are automatically saved and available across sessions

### Viewing Analytics
- Switch to the "Analytics" tab to see your progress
- Filter by time period (7 days, 30 days, 1 year)
- View consistency graphs and activity breakdowns
- Track your improvement over time

### Exporting Data
- Go to the "History" tab
- Click "Export CSV" to download your session data
- Use the data in Excel, Google Sheets, or other tools

## Project Structure

```
time-logger/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── ClockInOut.js
│   │   │   ├── SessionHistory.js
│   │   │   ├── Analytics.js
│   │   │   └── ActivityManager.js
│   │   ├── App.js         # Main app component
│   │   ├── App.css        # App-specific styles
│   │   ├── index.js       # React entry point
│   │   └── index.css      # Global styles
│   └── package.json
├── server/                # Node.js backend
│   ├── index.js          # Express server
│   ├── data.json         # JSON database (created on first run)
│   └── package.json
├── package.json          # Root package.json
├── start.sh             # Startup script
├── .gitignore           # Git ignore file
└── README.md
```

## 📱 Screenshots

### Clock In/Out Interface
- Clean, intuitive design for starting and stopping sessions
- Real-time clock display
- Activity selection with visual icons

### Analytics Dashboard
- Interactive charts showing time distribution
- Consistency tracking over time
- Activity breakdown with color coding

### Session History
- Complete list of all sessions
- Filtering by activity type
- Export functionality for data analysis

##  API Endpoints

### Activities
- `GET /api/activities` - Get all activities
- `POST /api/activities` - Add new activity

### Sessions
- `GET /api/sessions` - Get all sessions (with optional filters)
- `POST /api/sessions/clock-in` - Start new session
- `POST /api/sessions/clock-out` - End current session
- `GET /api/sessions/active` - Get currently active session
- `DELETE /api/sessions/:id` - Delete specific session

### Analytics
- `GET /api/analytics` - Get analytics data with period filtering

### Production Build
```bash
npm run build
```

### Environment Variables
- `PORT` - Server port (default: 3001)
- `NODE_ENV` - Environment (development/production)

##  Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Test thoroughly
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Submit a pull request

##  License

MIT License - feel free to use this project for personal or commercial purposes.

##  Troubleshooting

### Common Issues

**React won't start**: 
- Make sure you're in the client directory: `cd client`
- Try running: `BROWSER=none npm start`
- Check that all dependencies are installed: `npm install`

**Backend API not responding**:
- Ensure the server is running on port 3001
- Check the server logs for error messages
- Verify the data.json file is created in the server directory

**Port conflicts**: 
- Backend runs on port 3001, frontend on port 3000
- Change ports in server/index.js and client/package.json if needed

**Dependencies issues**: 
- Try deleting `node_modules` and running `npm install` again
- Make sure you're using Node.js version 14 or higher

### Support

If you encounter any issues, please check the console for error messages and ensure all dependencies are properly installed.

---

**Happy Tracking! 🎯**

Start building better habits and track your consistency with Time Logger.