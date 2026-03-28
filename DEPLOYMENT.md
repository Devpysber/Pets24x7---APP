# Deployment Guide

This application is ready for production deployment.

## Prerequisites
- A managed PostgreSQL database (e.g., Railway, AWS RDS, Supabase)
- A Node.js hosting platform (e.g., Railway, AWS App Runner, Heroku)

## Steps to Deploy

### 1. Database Setup
1. Create a PostgreSQL database.
2. Get the connection string (e.g., `postgresql://user:password@host:port/database`).

### 2. Update Prisma Schema
Before deploying, update `prisma/schema.prisma` to use PostgreSQL:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

### 3. Environment Variables
Set the following environment variables on your hosting platform:
- `DATABASE_URL`: Your PostgreSQL connection string.
- `JWT_SECRET`: A strong random string for authentication.
- `NODE_ENV`: Set to `production`.
- `PORT`: Set to `3000` (or your platform's default).

### 4. Build and Start
The `package.json` includes scripts for production:
- `npm run build`: Compiles the frontend and bundles the backend.
- `npm start`: Starts the production server.

### 5. Docker (Optional)
A `Dockerfile` is provided for containerized deployments.

## Monitoring
- **Logging**: Morgan is configured for HTTP logging.
- **Error Tracking**: A simple tracking utility is in `server/src/utils/errorTracking.ts`.
- **Health Check**: Access `/api/health` to verify server and database status.
