# Trip Planner Backend

REST API backend for US truck trip planning platform.

- 🚚 **Route planning** via OpenRouteService (live geocoding/routing)
- 🗺️ **Stops and route geometry** returned for map and ELD simulation
- 📄 **Automatic ELD log sheet** generator (US DOT HOS compliant)
- ⚡ **Robust error handling** for geocoding/routing/logic issues

---

## Features

- Plan a trip: Geocode, route calculation, all stops (pickup, dropoff, fuel/rest)
- Returns real road-following geometry for frontend mapping
- ELD log simulation for DOT Hours of Service, per day/segment
- Admin via Django ORM (TripRequest, RouteStop, TripLog)
- Extensible, production-ready error model

---

## Quick Start

### 1. Install & Setup

```bash
cd backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
```

- Copy `.env.example` to `.env` and set your [OpenRouteService](https://openrouteservice.org/) API key:

  ```
  ORS_API_KEY=your-real-api-key
  ```

### 2. Run Migrations

```bash
python manage.py migrate
```

### 3. Start Backend

```bash
python manage.py runserver
```

---

## API Reference

Full OpenAPI/Swagger doc: see [`swagger.yaml`](./swagger.yaml) or `/api/docs/` if enabled.

### Endpoints

- `POST /api/trips/create/` — Plan a new trip (see body in Swagger)
- `GET /api/trips/{id}/` — Retrieve trip by id
- `GET /api/trips/` — List recent trips

### Main Data Model

- **TripRequest**: Locations, cycle hours, meta, error status
- **RouteStop**: Each stop on the route (pickup, dropoff, fuel, etc)
- **TripLog**: Daily ELD log with status segments, per trip

### Example Trip Creation Request

```json
{
  "current_location": "Dallas, TX",
  "pickup_location": "Houston, TX",
  "dropoff_location": "Chicago, IL",
  "current_cycle_hours": 8
}
```

### Example Trip Creation Response

```json
{
  "id": 1,
  "created_at": "2025-06-13T15:30:00Z",
  "current_location": "Dallas, TX",
  "pickup_location": "Houston, TX",
  "dropoff_location": "Chicago, IL",
  "current_cycle_hours": 8,
  "distance_miles": 1200.7,
  "estimated_days": 3,
  "status": "completed",
  "logs": [...],
  "stops": [...],
  "geometry": [[32.7767,-96.7970],[29.7604,-95.3698],...]
}
```

---

## Error Handling

- All geocoding/routing/logic errors return error info in the JSON response.
- HTTP 400/413/422/500 used for meaningful errors.
- Trip status and error_message are always updated in DB.

---

## Testing

Use Postman or `curl` to test trip planning.

```bash
curl -X POST http://localhost:8000/api/trips/create/ \
 -H "Content-Type: application/json" \
 -d '{"current_location": "Atlanta, GA", "pickup_location": "Nashville, TN", "dropoff_location": "St. Louis, MO", "current_cycle_hours": 15}'
```

---

## License

MIT © Jean-Eudes Assogba
