# Trip Planner 🚛

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Django](https://img.shields.io/badge/Django-5.2.3-green.svg)](https://djangoproject.com/)
[![React](https://img.shields.io/badge/React-19.1.0-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue.svg)](https://www.typescriptlang.org/)

A production-ready, full-stack web application for intelligent trucking route planning with **US Hours of Service (HOS) compliance** and **Electronic Logging Device (ELD) log generation**. Built with Django REST Framework backend and React TypeScript frontend.

## 🌟 Features

### Core Functionality

- **Intelligent Route Planning**: Calculate optimal routes between current location, pickup, and dropoff points
- **HOS Compliance**: Automatically generates US Department of Transportation compliant driving schedules
- **ELD Log Generation**: Creates detailed electronic logging device records for each trip day
- **Real-time Mapping**: Interactive maps with route visualization using Leaflet
- **Trip History**: Comprehensive tracking and management of all planned trips

### Technical Features

- **RESTful API**: Modern Django REST Framework backend with OpenAPI documentation
- **Real-time UI**: Responsive React frontend with TypeScript and Tailwind CSS
- **Dark/Light Mode**: Beautiful UI with theme switching capabilities
- **Error Handling**: Robust error management with user-friendly messages
- **Mobile Responsive**: Optimized for desktop and mobile devices
- **Production Ready**: Docker support with proper deployment configurations

## 🏗️ Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Frontend      │────│   REST API       │────│   External      │
│   React + TS    │    │   Django + DRF   │    │   Services      │
│                 │    │                  │    │                 │
│ • Route Map     │    │ • Trip Planning  │    │ • OpenRoute     │
│ • ELD Logs      │    │ • HOS Logic      │    │   Service       │
│ • Trip History  │    │ • Data Models    │    │ • Geocoding     │
│ • Form UI       │    │ • API Docs       │    │                 │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ and npm
- **Python** 3.11+ and pip
- **Docker** (optional, for containerized deployment)

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/spotter-trip-planner.git
cd spotter-trip-planner
```

### 2. Backend Setup (Django)

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Create superuser (optional)
python manage.py createsuperuser

# Start development server
python manage.py runserver
```

The backend will be available at `http://127.0.0.1:8000`

- API Documentation: `http://127.0.0.1:8000/swagger/`
- Admin Panel: `http://127.0.0.1:8000/admin/`

### 3. Frontend Setup (React)

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will be available at `http://localhost:5173`

### 4. Docker Deployment (Optional)

```bash
# Backend
cd backend
docker build -t spotter-backend .
docker run -p 8000:8000 spotter-backend

# Frontend
cd frontend
docker build -t spotter-frontend .
docker run -p 5173:5173 spotter-frontend
```

## 📖 API Documentation

### Key Endpoints

| Endpoint             | Method | Description                         |
| -------------------- | ------ | ----------------------------------- |
| `/api/trips/create/` | POST   | Plan a new trip with HOS compliance |
| `/api/trips/`        | GET    | List all previous trips             |
| `/api/trips/<id>/`   | GET    | Get detailed trip information       |
| `/swagger/`          | GET    | Interactive API documentation       |
| `/redoc/`            | GET    | Alternative API documentation       |

### Example API Usage

#### Create a Trip

```bash
POST /api/trips/create/
Content-Type: application/json

{
  "current_location": "Dallas, TX",
  "pickup_location": "Houston, TX",
  "dropoff_location": "Chicago, IL",
  "current_cycle_hours": 0
}
```

#### Response

```json
{
  "id": 1,
  "distance_miles": 1087.4,
  "estimated_days": 2,
  "status": "completed",
  "logs": [
    {
      "date": "2025-06-13",
      "segments": [
        {
          "status": "off_duty",
          "start": "00:00",
          "end": "10:00",
          "note": "overnight off-duty"
        },
        {
          "status": "on_duty",
          "start": "10:00",
          "end": "11:00",
          "note": "pickup/start checks"
        }
      ]
    }
  ],
  "stops": [
    {
      "stop_type": "pickup",
      "lat": 29.7604,
      "lng": -95.3698,
      "description": "Pickup Location"
    }
  ],
  "geometry": [
    [29.7604, -95.3698],
    [30.2672, -97.7431]
  ]
}
```

## 🛠️ Technology Stack

### Backend

- **Django 5.2.3** - Web framework
- **Django REST Framework 3.16.0** - API development
- **drf-yasg 1.21.10** - API documentation
- **SQLite/PostgreSQL** - Database
- **Docker** - Containerization

### Frontend

- **React 19.1.0** - UI framework
- **TypeScript 5.8.3** - Type safety
- **Vite 6.3.5** - Build tool
- **Tailwind CSS 3.4.17** - Styling
- **Leaflet 1.9.4** - Interactive maps
- **Framer Motion 12.18.0** - Animations
- **Zustand 5.0.5** - State management

### External Services

- **OpenRouteService** - Geocoding and routing
- **Polyline encoding** - Route geometry compression

## 📁 Project Structure

```
spotter-trip-planner/
├── backend/                    # Django REST API
│   ├── trip_planner/          # Main application
│   │   ├── models.py          # Database models
│   │   ├── serializers.py     # API serializers
│   │   ├── views.py           # API endpoints
│   │   ├── services.py        # Business logic & HOS
│   │   ├── urls.py            # URL routing
│   │   └── tests.py           # Test suite
│   ├── backend/               # Django settings
│   ├── requirements.txt       # Python dependencies
│   └── Dockerfile            # Container config
├── frontend/                  # React TypeScript app
│   ├── src/
│   │   ├── components/        # UI components
│   │   ├── services/          # API services
│   │   ├── store/            # State management
│   │   └── App.tsx           # Main component
│   ├── package.json          # Node dependencies
│   └── vite.config.ts        # Build configuration
└── README.md                 # This file
```

## 🔧 Development

### Backend Development

```bash
cd backend

# Install dev dependencies
pip install -r requirements.txt

# Run tests
python manage.py test

# Create migrations
python manage.py makemigrations

# Access Django shell
python manage.py shell
```

### Frontend Development

```bash
cd frontend

# Install dependencies
npm install

# Run in development mode
npm run dev

# Run type checking
npm run build

# Run linting
npm run lint
```

### Key Development Files

- **Backend Logic**: `backend/trip_planner/services.py` - HOS compliance algorithms
- **API Views**: `backend/trip_planner/views.py` - Request handling
- **Frontend Store**: `frontend/src/store/store.ts` - Application state
- **Main Component**: `frontend/src/App.tsx` - UI layout and routing

## 🧪 Testing

### Backend Tests

```bash
cd backend
python manage.py test trip_planner
```

### API Testing

Use the Swagger UI at `http://127.0.0.1:8000/swagger/` for interactive API testing.

## 🚀 Deployment

### Production Environment Variables

#### Backend (.env)

```bash
DEBUG=False
SECRET_KEY=your-secret-key-here
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com
DATABASE_URL=postgresql://user:password@host:port/dbname
ORS_API_KEY=your-openrouteservice-key
```

#### Frontend (environment.ts)

```typescript
export const environment = {
  production: true,
  apiUrl: "https://your-api-domain.com/api",
};
```

### Docker Production

```bash
# Build production images
docker build -t spotter-backend ./backend
docker build -t spotter-frontend ./frontend

# Deploy with docker-compose
docker-compose up -d
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow PEP 8 for Python code
- Use TypeScript strict mode for frontend
- Write tests for new features
- Update documentation for API changes

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Jean-Eudes Assogba**

- GitHub: [@JeanEudes-dev](https://github.com/JeanEudes-dev)
- LinkedIn: [Jean-Eudes Assogba](https://www.linkedin.com/in/jeaneudes-assogba/)
- Email: jeaneudesdev@gmail.com

## 🙏 Acknowledgments

- OpenRouteService for geocoding and routing APIs
- US Department of Transportation for HOS regulations
- Django and React communities for excellent documentation

---

**Built with ❤️ for the trucking industry**
