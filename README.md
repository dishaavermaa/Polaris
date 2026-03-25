# Streamly Backend

Streamly is a production-disciplined modular monolith for a YouTube-like backend built with Node.js, Express, MongoDB, and Cloudinary. It is designed as a serious personal project: realistic architecture, clean boundaries, deployable defaults, and enough backend depth to stand up in code reviews and interviews.

## Highlights

- modular monolith with controller/service/repository structure
- JWT auth with refresh-session rotation
- user and channel profile flows
- video CRUD with visibility and publish state
- subscriptions
- flat threaded comments using `parentCommentId`
- likes on videos and comments
- OpenAPI spec with Scalar API docs
- readiness/liveness endpoints
- rate limiting, request IDs, structured logs, and security headers

## Tech Stack

- Node.js
- Express
- MongoDB + Mongoose
- Cloudinary for media storage
- JWT for auth
- Multer for upload staging
- Scalar for API documentation

## Project Goals

This project is intentionally not trying to be a microservice platform. The current target is:

- one clean deployable backend
- realistic production structure
- cheap deployment
- strong enough architecture for interviews and portfolio use

## Architecture

The application is organized as a modular monolith.

```text
src/
  app/
    app.js
    routes.js
    server.js
  config/
    cors.js
    db.js
    env.js
    openapi.js
  infrastructure/
    auth/
    storage/
  lib/
    ApiError.js
    ApiResponse.js
    asyncHandler.js
    logger.js
  middlewares/
    auth.middleware.js
    error.middleware.js
    multer.js
    rateLimit.middleware.js
    requestContext.middleware.js
    validate.middleware.js
  models/
    comment.model.js
    reaction.model.js
    session.model.js
    subscription.model.js
    user.model.js
    video.model.js
  modules/
    auth/
    channels/
    comments/
    docs/
    health/
    reactions/
    subscriptions/
    users/
    videos/
```

### Layering

Each module follows the same pattern:

- `routes`: route registration
- `controller`: HTTP boundary only
- `service`: business logic and orchestration
- `repository`: data access
- `schema`: request validation

### Design Principles

- controllers stay thin
- services own use-case behavior
- repositories isolate Mongoose queries
- cross-cutting concerns stay in middleware
- infra-specific behavior stays in `infrastructure/`
- auth/session logic is separate from user profile logic

## Domain Model

### Users

Users have:

- identity fields: `username`, `email`, `fullname`
- media fields: `avatar`, `coverImage`
- secure password storage via `passwordHash`

### Sessions

Refresh sessions are stored in a dedicated session model instead of the user document.

This supports:

- refresh-token hashing
- token rotation
- safer logout behavior
- future multi-device session management

### Videos

Videos include:

- owner reference
- title and description
- thumbnail and media URL
- `status`: `draft`, `published`, `archived`
- `visibility`: `public`, `private`, `unlisted`
- denormalized counters: `views`, `commentsCount`, `likesCount`

### Comments

Comments are flat, not deeply nested. Replies use `parentCommentId`.

Why:

- simpler pagination
- simpler moderation
- better performance than deeply nested comment trees

### Subscriptions

Subscriptions are modeled as:

- `subscriber`
- `channel`

with a unique compound index to prevent duplicates.

### Reactions

Reactions currently support likes on:

- videos
- comments

using one reaction per user per target.

## Request Flow

Typical request flow:

1. route
2. validation middleware
3. auth middleware if needed
4. controller
5. service
6. repository
7. standardized API response

## Security and Production Hardening

Current hardening already in the app:

- `helmet`
- global rate limiting
- stricter auth rate limiting
- request IDs
- centralized error handling
- CORS allowlist
- hashed passwords
- hashed refresh tokens
- session-backed auth instead of a single token field on the user
- secure cookie defaults depending on environment

## API Documentation

The app exposes:

- Scalar docs: `/docs`
- OpenAPI JSON: `/openapi.json`

The OpenAPI document is generated from [openapi.js](/home/sarthak/dev/Streamly-backend/src/config/openapi.js), and the Scalar UI is mounted in [docs.routes.js](/home/sarthak/dev/Streamly-backend/src/modules/docs/docs.routes.js).

## Available Modules

### Auth

- register
- login
- refresh
- logout

### Users

- get current user
- update current user
- change password
- update avatar
- update cover image

### Channels

- fetch channel profile by username

### Videos

- create video
- list public videos
- get single video
- update owned video
- delete owned video

### Subscriptions

- subscribe to a channel
- unsubscribe from a channel
- list current user subscriptions

### Comments

- list comments for a video
- create comment
- update owned comment
- delete owned comment

### Reactions

- like a video or comment
- remove like from a video or comment

## Core Routes

### Health

- `GET /health/live`
- `GET /health/ready`

### Docs

- `GET /openapi.json`
- `GET /docs`

### Auth

- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/refresh`
- `POST /api/v1/auth/logout`

### Users

- `GET /api/v1/users/me`
- `PATCH /api/v1/users/me`
- `PATCH /api/v1/users/me/password`
- `PATCH /api/v1/users/me/avatar`
- `PATCH /api/v1/users/me/cover-image`

### Channels

- `GET /api/v1/channels/:username`

### Videos

- `POST /api/v1/videos`
- `GET /api/v1/videos`
- `GET /api/v1/videos/:videoId`
- `PATCH /api/v1/videos/:videoId`
- `DELETE /api/v1/videos/:videoId`

### Subscriptions

- `GET /api/v1/subscriptions/me`
- `POST /api/v1/subscriptions/channels/:channelId`
- `DELETE /api/v1/subscriptions/channels/:channelId`

### Comments

- `GET /api/v1/comments/videos/:videoId`
- `POST /api/v1/comments/videos/:videoId`
- `PATCH /api/v1/comments/:commentId`
- `DELETE /api/v1/comments/:commentId`

### Reactions

- `POST /api/v1/reactions/:targetType/:targetId`
- `DELETE /api/v1/reactions/:targetType/:targetId`

## Local Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Create environment file

```bash
cp .env.example .env
```

Fill in:

- MongoDB connection string
- Cloudinary credentials
- JWT secrets
- app URL and CORS origin

### 3. Start the server

```bash
npm run dev
```

## Environment Variables

See [.env.example](/home/sarthak/dev/Streamly-backend/.env.example).

Important variables:

- `NODE_ENV`
- `PORT`
- `APP_URL`
- `CORS_ORIGIN`
- `MONGODB_URI`
- `ACCESS_TOKEN_SECRET`
- `ACCESS_TOKEN_EXPIRY`
- `REFRESH_TOKEN_SECRET`
- `REFRESH_TOKEN_EXPIRY`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `RATE_LIMIT_WINDOW_MS`
- `RATE_LIMIT_MAX_REQUESTS`

## Recommended Local Checks

After startup, verify:

```bash
curl http://localhost:8000/health/live
curl http://localhost:8000/health/ready
curl http://localhost:8000/openapi.json
```

Then open:

```text
http://localhost:8000/docs
```

## Suggested Deployment

For the simplest production-grade personal deployment:

- backend: Render or Railway
- database: MongoDB Atlas
- media: Cloudinary

If you want more control:

- small VPS
- reverse proxy like Nginx
- PM2 or systemd
- MongoDB Atlas
- Cloudinary

## Load Testing

For synthetic metrics without real users, start with `autocannon`:

```bash
npx autocannon -c 20 -d 30 http://localhost:8000/api/v1/videos
```

Then test:

- public video listing
- channel reads
- comment listing
- authenticated user reads
- mixed write flows like comment creation and reactions

## What’s Good About This Repo

- no giant controller file
- realistic service boundaries
- explicit domain modules
- denormalized counters where useful
- refresh-session design is safer than the common tutorial approach
- documented API and architecture

## Current Gaps

Still worth building next:

- integration tests
- request/response examples in OpenAPI
- seed script
- metrics endpoint for Prometheus
- database transactions around multi-write flows
- media-processing job pipeline
- search/discovery layer
- admin/moderation capabilities

## Interview Talking Points

If you present this project, the strongest points are:

- modular monolith over premature microservices
- dedicated session model for refresh tokens
- flat comment model for scalability
- repository/service split for maintainability
- denormalized counters for read efficiency
- OpenAPI + Scalar docs for developer experience
- pragmatic production hardening rather than tutorial-only code
