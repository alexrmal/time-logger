# Personal Efficiency Dashboard

Full-stack session tracker for gym, study, and work sessions, with analytics over 7-, 30-, and 365-day windows and CSV export.

![React](https://img.shields.io/badge/React-18.2.0-blue) ![Node.js](https://img.shields.io/badge/Node.js-Express-green) ![GitHub Actions](https://img.shields.io/badge/CI%2FCD-GitHub%20Actions-2088FF)

## Features

- **Clock In/Out Tracking**: One-click session tracking for gym, study, work, and custom activities
- **Session History**: Filterable history of all sessions
- **Analytics Dashboard**: Recharts visualizations for consistency and activity trends
- **Period Filtering**: Aggregate trends over the last 7, 30, or 365 days
- **CSV Export**: Download session data for external analysis
- **CI/CD**: GitHub Actions runs ESLint and tests on every push; merges to `main` auto-deploy a production Docker image to GitHub Container Registry

## Technology Stack

- **JavaScript** / **React** / **Recharts** (frontend)
- **Node.js** / **Express.js** REST API (backend)
- **JSON file storage** for lightweight persistence
- **GitHub Actions** for lint, test, and deploy

## Installation

```bash
npm run install-all
```

## Development

```bash
./start.sh
# or
npm run dev
```

- Backend API: `http://localhost:3001`
- Frontend: `http://localhost:3000`

## Scripts

| Script | Description |
|--------|-------------|
| `npm run lint` | ESLint for client and server |
| `npm test` | Jest/API tests + React Testing Library |
| `npm run build` | Production React build |
| `npm start` | Serve API + built client (`NODE_ENV=production`) |

## CI/CD

On every push and pull request, GitHub Actions:

1. Installs dependencies
2. Runs **ESLint**
3. Runs **server and client tests**

On push/merge to `main`, after checks pass, the workflow builds and pushes a production Docker image to `ghcr.io/<owner>/<repo>`.

## API Endpoints

### Activities
- `GET /api/activities` — list activities
- `POST /api/activities` — add activity

### Sessions
- `GET /api/sessions` — list sessions (optional filters)
- `POST /api/sessions/clock-in` — start session
- `POST /api/sessions/clock-out` — end session
- `GET /api/sessions/active` — active session
- `DELETE /api/sessions/:id` — delete session

### Analytics
- `GET /api/analytics?period=week|month|year` — aggregated trends

## License

MIT
