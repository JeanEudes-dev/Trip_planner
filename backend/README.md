# SpotterAI Trip Planner Backend

A production-ready Django REST API for planning property-carrying truck routes with US Hours of Service (HOS) logic and ELD log sheet generation. Designed for remote assessment, deployable to AWS, Render, or Docker anywhere.

---

## Features

- Input: current, pickup, and dropoff locations + cycle hours
- Calculates route, required stops, fueling, and rest breaks (HOS-compliant)
- Outputs structured ELD logs for each day (ready for frontend graph)
- Modern REST API with OpenAPI (Swagger/Redoc) docs
- Admin for trips/logs/stops
- Tests & Docker support

---

## Quickstart (Docker)

```bash
git clone <your_repo_url>
cd backend
cp .env.example .env  # or set DB vars directly
# Set SECRET_KEY, ALLOWED_HOSTS, DATABASE_URL, etc.
docker build -t spotterai-backend .
docker run -p 8000:8000 spotterai-backend
```

---

## API Endpoints

| Endpoint           | Method | Description                         |
| ------------------ | ------ | ----------------------------------- |
| /api/trips/create/ | POST   | Plan a trip (input locations/cycle) |
| /api/trips/        | GET    | List previous trips                 |
| /api/trips/<id>/   | GET    | Get one trip and its logs           |
| /swagger/          | GET    | Interactive Swagger API docs        |
| /redoc/            | GET    | Redoc API reference                 |

---

### Example: Plan a Trip

Request (POST /api/trips/create/):

```json
{
  "current_location": "Dallas, TX",
  "pickup_location": "Houston, TX",
  "dropoff_location": "Chicago, IL",
  "current_cycle_hours": 0
}
```

Response:

```json
{
  "id": 1,
  "created_at": "2024-06-13T18:15:02Z",
  "current_location": "Dallas, TX",
  "pickup_location": "Houston, TX",
  "dropoff_location": "Chicago, IL",
  "current_cycle_hours": 0,
  "distance_miles": 1100,
  "estimated_days": 2,
  "status": "completed",
  "logs": [
    { "date": "2024-06-13", "segments": [ { "status": "off_duty", ... } ] },
    ...
  ],
  "stops": [
    { "stop_type": "pickup", "lat": ..., "lng": ... },
    ...
  ]
}
```

---

## Tech Stack

- Django 4, Django REST Framework, drf-yasg (Swagger)
- PostgreSQL (or SQLite/dev)
- Docker & Gunicorn
- CORS enabled (frontend-friendly)

---

## Dev Tips

- Add real geocoding/routing APIs for production
- See `trip_planner/services.py` for HOS logic
- Customize the log graph output for your frontend
- Use `/swagger/` to test API live

---

## Author

- **Jean-Eudes Assogba** ([GitHub](https://github.com/JeanEudes-dev))
- [LinkedIn](https://www.linkedin.com/in/jeaneudes-assogba/) | [Email](mailto:jeaneudesdev@gmail.com)

