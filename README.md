# France Event Map

A web application displaying a map of France with event markers. Built with React, Leaflet, Express.js, and TypeScript.

## Project Structure

```
france-event-map/
├── packages/
│   ├── backend/     # Express.js server with /api/events endpoint
│   └── frontend/     # React + Vite application with Leaflet map
└── package.json     # Root workspace configuration
```

## Quick Start

### Prerequisites
- [pnpm](https://pnpm.io/) (package manager)
- Node.js 18+

### Installation

```bash
# Clone or navigate to the project
# Install all dependencies
pnpm install
```

### Run Development Servers

```bash
# Start both frontend and backend
pnpm dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:3000

### Build for Production

```bash
pnpm build
```

### Start Production Server

```bash
pnpm start
```

## Configuration

### Backend Environment Variables
| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 3000 |
| `DATABASE_PATH` | SQLite database path | Required |

### Frontend Environment Variables
| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API URL | http://localhost:3000 |

## API Endpoints

### GET /api/events

Returns a list of events.

**Query Parameters:**
- `search` - Filter by name or city (string)
- `includePast` - Include past events (boolean, default: false)
- `dateFrom` - Events on or after this date (ISO date string)
- `dateTo` - Events on or before this date (ISO date string)
- `cursor` - Date-based cursor for pagination (string)
- `limit` - Max results per page (number, default: 100)

**Response:**
```json
{
  "events": [
    {
      "id": 1,
      "date": "2027-01-15",
      "name": "Paris Tech Meetup",
      "location": "Station F",
      "city": "Paris",
      "details": "Monthly coding meetup",
      "lat": 48.8566,
      "lng": 2.3522
    }
  ]
}
```

## Technologies

- **Frontend**: React 18, TypeScript, Vite, Leaflet, react-leaflet-markercluster
- **Backend**: Express.js, TypeScript, CORS
- **Package Manager**: pnpm
- **Map**: OpenStreetMap tiles via Leaflet

## License

MIT
