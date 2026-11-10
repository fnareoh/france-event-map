# Project: France Event Map

## Overview

A webpage displaying a map of France with markers for future event locations. Built with TypeScript for both frontend and backend, using SQLite for data storage. The system is designed to be generic enough to support any type of event, with a focus on coding events initially.

## Core Requirements

- **Purpose**: Regroup and display coding events (and other event types) on a France map
- **Genericity**: Data model supports any event type; event-specific attributes go in the `details` field
- **Target Audience**: Admin-only event management for now (direct DB insertion); future features include event import and location-based notifications

## Technical Stack

### Project Structure
- **Type**: Monorepo
- **Package Manager**: pnpm
- **Directory Structure**:
  - `packages/backend/` - Express.js server
  - `packages/frontend/` - React application

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript (compiled with `tsc`)
- **ORM**: TypeORM
- **Database**: SQLite (path configurable via `DATABASE_PATH`)

### Frontend
- **Framework**: React
- **Language**: TypeScript
- **Build Tool**: Vite
- **Map Library**: Leaflet with OpenStreetMap tiles
- **HTTP Client**: Native `fetch` API

## Data Model

### Event Entity
```typescript
interface Event {
  id: number;
  date: string; // ISO 8601, UTC
  name: string;
  location: string; // Venue name
  city: string;
  details: string | null; // Optional, catch-all for event-specific fields
  lat: number; // Latitude coordinate
  lng: number; // Longitude coordinate
}
```

**Constraints:**
- `lat` and `lng` are required and always valid
- `details` is optional and can contain any event-specific data in plain text

## API Specification

### Endpoints

#### GET /api/events

Returns a paginated list of events matching the query criteria.

**Query Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `search` | string | No | - | Contains match on `name` OR `city` |
| `includePast` | boolean | No | `false` | Include events with date in the past |
| `dateFrom` | ISO date string | No | - | Events on or after this date |
| `dateTo` | ISO date string | No | - | Events on or before this date |
| `cursor` | string | No | - | Date-based cursor for pagination |
| `limit` | number | No | `100` | Max results per page |

**Response (Success):**
```json
{
  "events": [
    {
      "id": 1,
      "date": "2024-12-15",
      "name": "Paris Tech Meetup",
      "location": "Station F",
      "city": "Paris",
      "details": null,
      "lat": 48.8566,
      "lng": 2.3522
    }
  ]
}
```

**Response (Error):**
```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message"
  }
}
```

**Error Codes:**
- `DB_ERROR` - Database connection or query failure
- `VALIDATION_ERROR` - Invalid request parameters
- `NOT_FOUND` - Resource not found
- `INTERNAL_ERROR` - Unexpected server error

**Pagination:**
- Cursor-based on event `date` field
- Default: 100 results per page
- Retry logic: 2-3 attempts with 1-2 second delay between retries

## Frontend Specification

### Map
- **Library**: Leaflet + OpenStreetMap
- **Default View**: Centered on France at coordinates `[46.603, 1.888]` with zoom level `6`
- **Markers**: Display all events matching current filters
- **Marker Interaction**: Clicking a marker shows a popup with all event information (name, date, location, city, details)

### Features
- **Default Display**: All future events
- **Past Events**: Checkbox to toggle inclusion of past events
- **Search**: Button-triggered search by name or city (contains match)
- **Error Handling**: Retry failed API calls 2-3 times with 1-2s delay, then display error message

## Environment Variables

### Backend
| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Backend server port | Required |
| `DATABASE_PATH` | Path to SQLite database file | Required |

### Frontend
| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Base URL for backend API | Required |

## Build Scripts

| Script | Description |
|--------|-------------|
| `dev` | Run both frontend and backend in development mode |
| `build` | Compile TypeScript for both frontend and backend |
| `start` | Start production server |

## Out of Scope (For Now)

- User authentication / authorization
- Event import feature
- Location-based notifications
- Testing
- Deployment configuration
- CORS configuration (to be determined based on deployment setup)

## Future Enhancements

- Add user authentication for event management
- Implement event import functionality (CSV/JSON)
- Add location-based notifications: "notify when new event is added near me"
- Define "near me" radius for notifications
- Add event type classification
- Implement rate limiting
- Add API documentation (Swagger/OpenAPI)
