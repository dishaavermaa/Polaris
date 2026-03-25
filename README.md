# Streamly Backend

Production-disciplined modular monolith for a YouTube-like backend built with Node.js, Express, and MongoDB.

## What Exists

- JWT auth with refresh-session rotation
- user profile management
- channel profile reads
- video CRUD
- subscriptions
- threaded comments with flat parent references
- like reactions on videos and comments
- health endpoints
- rate limiting and security headers
- OpenAPI + Scalar API docs

## Architecture

The codebase is organized as a modular monolith:

- `src/app`: application bootstrap and route registration
- `src/config`: env, db, CORS, OpenAPI config
- `src/lib`: shared primitives like errors, responses, logger
- `src/middlewares`: auth, validation, rate limiting, request context
- `src/models`: Mongoose schemas
- `src/modules`: domain modules such as auth, users, videos, comments
- `src/infrastructure`: storage and auth helpers

Each module follows:

- controller
- service
- repository
- schema
- routes

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Copy env values:

```bash
cp .env.example .env
```

3. Start the server:

```bash
npm run dev
```

## API Docs

- Scalar UI: `/docs`
- OpenAPI JSON: `/openapi.json`

## Core Routes

- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/refresh`
- `POST /api/v1/auth/logout`
- `GET /api/v1/users/me`
- `PATCH /api/v1/users/me`
- `PATCH /api/v1/users/me/password`
- `GET /api/v1/channels/:username`
- `POST /api/v1/videos`
- `GET /api/v1/videos`
- `GET /api/v1/videos/:videoId`
- `PATCH /api/v1/videos/:videoId`
- `DELETE /api/v1/videos/:videoId`
- `GET /api/v1/subscriptions/me`
- `POST /api/v1/subscriptions/channels/:channelId`
- `DELETE /api/v1/subscriptions/channels/:channelId`
- `GET /api/v1/comments/videos/:videoId`
- `POST /api/v1/comments/videos/:videoId`
- `PATCH /api/v1/comments/:commentId`
- `DELETE /api/v1/comments/:commentId`
- `POST /api/v1/reactions/:targetType/:targetId`
- `DELETE /api/v1/reactions/:targetType/:targetId`

## Production Notes

- use strong random token secrets
- keep MongoDB and Cloudinary credentials out of git
- set `APP_URL` and `CORS_ORIGIN` correctly in production
- deploy behind HTTPS so secure cookies behave correctly
- use managed MongoDB and Cloudinary for the simplest production setup

## Current Gaps

Still worth doing next:

- integration tests
- Swagger examples/request bodies for every endpoint
- seed script
- view tracking pipeline
- search/discovery layer
- background jobs for media processing
