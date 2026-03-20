# Pulse — Real-Time Analytics API

Node.js/Express backend for the Pulse analytics dashboard. Tracks events via PostgreSQL, broadcasts live metrics over WebSockets, and runs a background simulator to generate realistic traffic data.

## Stack

- Node.js + Express
- PostgreSQL (Supabase)
- Socket.io (WebSockets)
- JWT authentication
- Docker

## Setup

```bash
npm install
cp .env.example .env
# fill in DATABASE_URL and JWT_SECRET

npm run migrate   # create tables
npm run seed      # seed demo user + sample data
npm run dev       # start dev server on port 5001
```

## Environment Variables

| Key | Description |
|-----|-------------|
| `DATABASE_URL` | Supabase PostgreSQL connection string |
| `JWT_SECRET` | Secret key for JWT signing |
| `JWT_EXPIRES_IN` | Token expiry (default: 7d) |
| `CLIENT_URL` | Frontend URL for CORS |
| `PORT` | Server port (default: 5001) |

## API

```
POST  /api/auth/login          Login
GET   /api/auth/me             Current user (protected)
PATCH /api/auth/password       Change password (protected)

GET   /api/analytics/overview          Dashboard metrics
GET   /api/analytics/timeseries        Time series data
GET   /api/analytics/top-pages         Top pages by visits
GET   /api/analytics/recent-events     Recent event log
GET   /api/analytics/traffic-by-page   Traffic breakdown
GET   /api/analytics/metrics-history   Historical snapshots

GET   /api/health              Health check
```

## Docker

```bash
docker build -t pulse-api .
docker run -p 5001:5001 --env-file .env pulse-api
```

## Demo Login

```
admin@pulse.io / admin123
```
