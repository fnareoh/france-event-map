import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';

// CRITICAL: Fix Leaflet icon paths for React Leaflet v4
// This MUST be done before any MapContainer is created
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface Event {
  id: number;
  date: string;
  name: string;
  location: string;
  city: string;
  details: string | null;
  lat: number;
  lng: number;
}

interface ApiResponse {
  events: Event[];
}

export default function EventMap() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // France center coordinates
  const franceCenter: [number, number] = [46.603, 1.888];
  const defaultZoom = 6;

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch events from the API
        const response = await fetch('/api/events');
        
        console.log('Fetch response:', response);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: ApiResponse = await response.json();
        console.log('Fetched events:', data.events);
        setEvents(data.events);
      } catch (err) {
        console.error('Error fetching events:', err);
        // Fallback to hardcoded events for testing
        const fallbackEvents: Event[] = [
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
        console.log('Using fallback events:', fallbackEvents);
        setEvents(fallbackEvents);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100%',
        fontSize: '18px',
        color: '#333'
      }}>
        Loading events...
      </div>
    );
  }

  console.log('Events to display:', events.length, events);

  if (error) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100%',
        fontSize: '18px',
        color: '#d32f2f',
        backgroundColor: '#ffebee',
        padding: '20px',
        borderRadius: '8px',
        margin: '20px'
      }}>
        {error}
      </div>
    );
  }

  return (
    <MapContainer
      center={franceCenter}
      zoom={defaultZoom}
      style={{ width: '100%', height: '100%', minHeight: '400px' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      
      <MarkerClusterGroup>
        {events.map((event) => (
          <Marker
            key={event.id}
            position={[event.lat, event.lng]}
          >
            <Popup>
              <div style={{ minWidth: '200px' }}>
                <h3 style={{ margin: '0 0 8px 0', color: '#1976d2' }}>{event.name}</h3>
                <p style={{ margin: '4px 0', fontWeight: 'bold' }}>
                  {event.date}
                </p>
                <p style={{ margin: '4px 0' }}>
                  <strong>Location:</strong> {event.location}
                </p>
                <p style={{ margin: '4px 0' }}>
                  <strong>City:</strong> {event.city}
                </p>
                {event.details && (
                  <p style={{ margin: '4px 0' }}>
                    <strong>Details:</strong> {event.details}
                  </p>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MarkerClusterGroup>
    </MapContainer>
  );
}
