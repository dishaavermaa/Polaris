# Streamly Backend

> 🎬 A production-disciplined YouTube-like backend built as a modular monolith with Node.js, Express, MongoDB, Cloudinary, and Scalar API docs.

## 1. Title + Tagline

### **Streamly Backend**
**A clean, scalable, interview-ready backend for video platforms with auth, videos, subscriptions, comments, reactions, and production-grade structure.**

## 2. Problem Statement

Modern video platforms need more than basic CRUD. They need:

- secure authentication
- structured video ownership and visibility
- scalable comments and reactions
- relationship modeling like subscriptions
- clear API contracts
- production-ready architecture instead of tutorial-style files

Most beginner backends collapse into:

- fat controllers
- weak auth/session handling
- no clear separation of concerns
- poor scaling story
- missing documentation

This project solves that by turning a simple Node/Express app into a backend that looks and behaves like a serious real-world system.

## 3. Solution Overview

Streamly is designed as a **modular monolith**.

Instead of jumping to microservices, it keeps deployment simple while enforcing strong boundaries inside the codebase:

- **controllers** handle HTTP
- **services** own business logic
- **repositories** isolate database access
- **middlewares** handle cross-cutting concerns
- **infrastructure adapters** isolate external integrations

The system currently supports:

- JWT auth with refresh-session rotation
- user and channel profile management
- video CRUD with publication state and visibility
- subscriptions
- flat threaded comments
- likes on videos and comments
- OpenAPI-based docs with Scalar
- rate limiting, security headers, and structured logs

## 4. Tech Stack

### **Core**

- 🟢 **Node.js**
- ⚡ **Express**
- 🍃 **MongoDB**
- 🧠 **Mongoose**

### **Auth & Security**

- 🔐 **JWT**
- 🔑 **bcrypt**
- 🛡️ **helmet**
- 🚦 **express-rate-limit**

### **Media**

- ☁️ **Cloudinary**
- 📦 **Multer**

### **Documentation**

- 📘 **OpenAPI 3.1**
- ✨ **Scalar**

### **Dev Tools**

- 🔄 **nodemon**
- 🎨 **Prettier**

## 5. Architecture

### High-Level Architecture

```text
Browser Client
     |
     v
Express App
     |
     +--> Middlewares
     |     - request context
     |     - CORS
     |     - helmet
     |     - rate limiting
     |     - auth
     |     - validation
     |
     +--> Module Routes
           |
           +--> Controllers
                 |
                 +--> Services
                       |
                       +--> Repositories
                             |
                             +--> MongoDB
                       |
                       +--> Infrastructure
                             - JWT/session helpers
                             - Cloudinary storage
                             - logger
```

### Folder Architecture

```text
src/
  app/
  config/
  infrastructure/
  lib/
  middlewares/
  models/
  modules/
```

### Module Architecture

Each module follows:

```text
module/
  *.routes.js
  *.controller.js
  *.service.js
  *.repository.js
  *.schema.js
```

### Why This Architecture

- ✅ simpler than microservices
- ✅ cleaner than controller-heavy Express apps
- ✅ easier to explain in interviews
- ✅ easy to extend with Redis, queues, and search later

## 6. Features

### 🔐 Authentication

- user registration
- user login
- refresh token rotation
- logout
- session-backed refresh token handling
- hashed password storage

### 👤 Users & Channels

- get current user profile
- update user profile
- change password
- update avatar
- update cover image
- fetch public channel profile by username

### 🎥 Videos

- create video
- list published videos
- fetch single video
- update owned video
- delete owned video
- support `draft`, `published`, `archived`
- support `public`, `private`, `unlisted`

### 📡 Subscriptions

- subscribe to a channel
- unsubscribe from a channel
- list current user subscriptions

### 💬 Comments

- list comments for a video
- add top-level comments
- add replies using `parentCommentId`
- update owned comment
- delete owned comment

### ❤️ Reactions

- like a video
- unlike a video
- like a comment
- unlike a comment

### ⚙️ Production Hardening

- centralized error handling
- request IDs
- structured logs
- helmet security headers
- global and auth rate limits
- readiness and liveness endpoints
- OpenAPI + Scalar docs

## 7. API / Flow

### Request Lifecycle

```text
Client Request
   -> Route
   -> Validation Middleware
   -> Auth Middleware (if protected)
   -> Controller
   -> Service
   -> Repository
   -> MongoDB / Infrastructure
   -> ApiResponse
```

### Example Flow: Create Video

```text
Authenticated User
   -> POST /api/v1/videos
   -> upload thumbnail + video
   -> validate metadata
   -> upload files to Cloudinary
   -> persist video document
   -> return created video
```

### Example Flow: Comment on Video

```text
Authenticated User
   -> POST /api/v1/comments/videos/:videoId
   -> validate comment payload
   -> verify video visibility
   -> create comment
   -> update video.commentsCount
   -> update parent replyCount if reply
   -> return comment
```

### Example Flow: Like a Comment

```text
Authenticated User
   -> POST /api/v1/reactions/comment/:commentId
   -> validate target
   -> verify target visibility
   -> ensure one reaction per user
   -> create reaction
   -> increment comment.likesCount
```

### Main API Surface

#### Health

- `GET /health/live`
- `GET /health/ready`

#### Docs

- `GET /openapi.json`
- `GET /docs`

#### Auth

- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/refresh`
- `POST /api/v1/auth/logout`

#### Users

- `GET /api/v1/users/me`
- `PATCH /api/v1/users/me`
- `PATCH /api/v1/users/me/password`
- `PATCH /api/v1/users/me/avatar`
- `PATCH /api/v1/users/me/cover-image`

#### Channels

- `GET /api/v1/channels/:username`

#### Videos

- `POST /api/v1/videos`
- `GET /api/v1/videos`
- `GET /api/v1/videos/:videoId`
- `PATCH /api/v1/videos/:videoId`
- `DELETE /api/v1/videos/:videoId`

#### Subscriptions

- `GET /api/v1/subscriptions/me`
- `POST /api/v1/subscriptions/channels/:channelId`
- `DELETE /api/v1/subscriptions/channels/:channelId`

#### Comments

- `GET /api/v1/comments/videos/:videoId`
- `POST /api/v1/comments/videos/:videoId`
- `PATCH /api/v1/comments/:commentId`
- `DELETE /api/v1/comments/:commentId`

#### Reactions

- `POST /api/v1/reactions/:targetType/:targetId`
- `DELETE /api/v1/reactions/:targetType/:targetId`

## 8. Setup Instructions

### 1. Clone and enter the project

```bash
git clone <your-repo-url>
cd Streamly-backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create your environment file

```bash
cp .env.example .env
```

### 4. Fill required values

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

### 5. Start MongoDB

Use either:

- local MongoDB
- MongoDB Atlas

### 6. Start the server

```bash
npm run dev
```

### 7. Verify the app

```bash
curl http://localhost:8000/health/live
curl http://localhost:8000/health/ready
curl http://localhost:8000/openapi.json
```

Then open:

```text
http://localhost:8000/docs
```

## 9. Future Improvements

### 📈 Observability

- Prometheus metrics endpoint
- Grafana dashboards
- MongoDB query metrics
- error alerting

### ✅ Testing

- integration tests
- service-level unit tests
- seeded test database

### 🧵 Consistency

- database transactions for multi-write flows
- stronger count reconciliation jobs

### 🎞️ Media Pipeline

- background processing jobs
- thumbnails and transcoding
- object storage abstraction for future S3 migration

### 🔎 Product Features

- search and discovery
- playlists
- watch history endpoints
- admin/moderation tools
- notifications

### 🚀 Scaling Up Later

- Redis for cache and rate-limit storage
- BullMQ for background jobs
- read-heavy optimizations
- search service

## Documentation & DX

- 📘 Scalar Docs: `/docs`
- 🧾 OpenAPI JSON: `/openapi.json`
- ⚙️ Example env: [.env.example](/home/sarthak/dev/Streamly-backend/.env.example)

## Why This Project Is Strong

- modular monolith instead of chaos
- safer auth than tutorial-grade apps
- realistic video/comment/subscription/reaction modeling
- clear boundaries for future scale
- production-oriented hardening
- documentation suitable for demos and interviews
