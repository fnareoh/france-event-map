import express from 'express';
import cors from 'cors';
import type { Express } from 'express';

const app: Express = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for development
app.use(cors());

// Hardcoded sample events
const events = [
  {
    id: 1,
    date: "2027-01-15",
    name: "Paris Tech Meetup",
    location: "Station F",
    city: "Paris",
    details: "Monthly coding meetup",
    lat: 48.8566,
    lng: 2.3522
  },
  {
    id: 2,
    date: "2027-02-20",
    name: "Lyon Dev Conference",
    location: "La Sucrière",
    city: "Lyon",
    details: null,
    lat: 45.7640,
    lng: 4.8357
  },
  {
    id: 3,
    date: "2027-03-10",
    name: "Marseille Hackathon",
    location: "Le Dôme",
    city: "Marseille",
    details: "48-hour coding competition",
    lat: 43.2965,
    lng: 5.3698
  },
  {
    id: 4,
    date: "2027-04-05",
    name: "Toulouse AI Summit",
    location: "Cité de l'Espace",
    city: "Toulouse",
    details: "Artificial Intelligence conference",
    lat: 43.6047,
    lng: 1.4442
  },
  {
    id: 5,
    date: "2027-05-18",
    name: "Bagneux Code Workshop",
    location: "Mairie de Bagneux",
    city: "Bagneux",
    details: "Hands-on coding workshop",
    lat: 48.8181,
    lng: 2.2658
  }
];

// GET /api/events endpoint
app.get('/api/events', (req, res) => {
  try {
    // Extract query parameters
    const search = req.query.search as string | undefined;
    const includePast = req.query.includePast === 'true';
    const dateFrom = req.query.dateFrom as string | undefined;
    const dateTo = req.query.dateTo as string | undefined;
    const cursor = req.query.cursor as string | undefined;
    const limit = parseInt(req.query.limit as string) || 100;

    // Filter events based on query parameters
    let filteredEvents = [...events];

    // Search filter (contains match on name OR city)
    if (search) {
      const searchLower = search.toLowerCase();
      filteredEvents = filteredEvents.filter(event => 
        event.name.toLowerCase().includes(searchLower) ||
        event.city.toLowerCase().includes(searchLower)
      );
    }

    // Date filters
    if (!includePast) {
      const today = new Date().toISOString().split('T')[0];
      filteredEvents = filteredEvents.filter(event => event.date >= today);
    }

    if (dateFrom) {
      filteredEvents = filteredEvents.filter(event => event.date >= dateFrom);
    }

    if (dateTo) {
      filteredEvents = filteredEvents.filter(event => event.date <= dateTo);
    }

    // Cursor-based pagination
    if (cursor) {
      const cursorIndex = filteredEvents.findIndex(event => event.date === cursor);
      if (cursorIndex !== -1) {
        filteredEvents = filteredEvents.slice(cursorIndex + 1);
      }
    }

    // Limit results
    filteredEvents = filteredEvents.slice(0, limit);

    res.json({ events: filteredEvents });
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Unexpected server error'
      }
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export default app;
