# Issue 1: Static Map with Hardcoded Events

**Priority**: Highest  
**Epic**: Core Functionality  
**Status**: Not Started

## Goal
Create a minimal working application with a map of France displaying hardcoded event markers. This validates the full tech stack (monorepo, Express, React, Vite, Leaflet, TypeScript) works together.

## Acceptance Criteria
- [ ] Map loads and centers on France (coordinates [46.603, 1.888], zoom level 6)
- [ ] Hardcoded event markers appear on the map
- [ ] Clicking a marker shows a popup with all event information
- [ ] No build errors
- [ ] Both frontend and backend can run simultaneously in development

---

## Backend Tasks (`packages/backend`)

### Setup
- [ ] Initialize Node.js project with `package.json`
- [ ] Add TypeScript as dependency
- [ ] Add Express.js as dependency
- [ ] Add CORS middleware package
- [ ] Create `tsconfig.json` for TypeScript compilation
- [ ] Add `src/index.ts` as entry point

### Implementation
- [ ] Create Express application in `src/index.ts`
- [ ] Add CORS middleware for development
- [ ] Create GET `/api/events` endpoint
- [ ] Return hardcoded array of 3-4 events (sample data for Paris, Lyon, Marseille)
- [ ] Each event includes: id, date, name, location, city, details, lat, lng
- [ ] Add error handling for the endpoint

### Configuration
- [ ] Add `PORT` environment variable support (default: 3000)
- [ ] Add start and dev scripts to `package.json`
- [ ] Compile TypeScript with `tsc`

---

## Frontend Tasks (`packages/frontend`)

### Setup
- [ ] Initialize Vite project with React + TypeScript template
- [ ] Add Leaflet dependency
- [ ] Add React Leaflet dependencies
- [ ] Add OpenStreetMap CSS
- [ ] Configure Vite for development

### Implementation
- [ ] Create map component using Leaflet
- [ ] Set default view: center [46.603, 1.888], zoom 6
- [ ] Fetch events from `/api/events` on component mount
- [ ] Add markers for each event at (lat, lng) coordinates
- [ ] Add click handler to markers that shows popup with event details
- [ ] Display loading state during fetch

### Styling
- [ ] Ensure map container has appropriate dimensions
- [ ] Style popup content for readability

---

## Monorepo Tasks

- [ ] Create root `package.json` with pnpm workspaces
- [ ] Configure workspace references for backend and frontend
- [ ] Add root `pnpm-workspace.yaml`
- [ ] Add scripts to root `package.json`:
  - `dev`: Run both frontend and backend
  - `build`: Build both frontend and backend
  - `start`: Start production server
- [ ] Configure Vite proxy to forward `/api` requests to backend in development

---

## Sample Hardcoded Events

```json
[
  {
    "id": 1,
    "date": "2024-12-15",
    "name": "Paris Tech Meetup",
    "location": "Station F",
    "city": "Paris",
    "details": "Monthly coding meetup",
    "lat": 48.8566,
    "lng": 2.3522
  },
  {
    "id": 2,
    "date": "2024-12-20",
    "name": "Lyon Dev Conference",
    "location": "La Sucrière",
    "city": "Lyon",
    "details": null,
    "lat": 45.7640,
    "lng": 4.8357
  },
  {
    "id": 3,
    "date": "2025-01-10",
    "name": "Marseille Hackathon",
    "location": "Le Dôme",
    "city": "Marseille",
    "details": "48-hour coding competition",
    "lat": 43.2965,
    "lng": 5.3698
  }
]
```

---

## Testing Instructions

1. Run `pnpm dev` at project root
2. Open browser to `http://localhost:5173` (or frontend port)
3. Verify map loads centered on France
4. Verify 3-4 markers appear at correct locations
5. Click each marker and verify popup shows correct event details
6. Open browser dev tools and check network tab for `/api/events` request

---

## Dependencies

### Backend
```bash
pnpm add express cors
pnpm add -D typescript @types/express @types/cors ts-node
```

### Frontend
```bash
pnpm create vite packages/frontend -- --template react-ts
cd packages/frontend
pnpm add leaflet react-leaflet
pnpm add -D @types/leaflet
```

### Dev Dependencies (Root)
```bash
pnpm add -Dw concurrently wait-on
```
