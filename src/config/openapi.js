import { env } from "./env.js";

const serverUrl = env.APP_URL || `http://localhost:${env.PORT}`;

export const openApiDocument = {
  openapi: "3.1.0",
  info: {
    title: "Streamly Backend API",
    version: "1.0.0",
    description:
      "Production-disciplined modular monolith for a YouTube-like backend with auth, users, channels, videos, subscriptions, comments, and reactions.",
  },
  servers: [
    {
      url: serverUrl,
      description: env.NODE_ENV === "production" ? "Production" : "Local development",
    },
  ],
  tags: [
    { name: "Health" },
    { name: "Auth" },
    { name: "Users" },
    { name: "Channels" },
    { name: "Videos" },
    { name: "Subscriptions" },
    { name: "Comments" },
    { name: "Reactions" },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    schemas: {
      ErrorResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: false },
          message: { type: "string" },
          errors: {
            type: "array",
            items: { type: "object" },
          },
          requestId: { type: "string" },
        },
      },
      User: {
        type: "object",
        properties: {
          _id: { type: "string" },
          username: { type: "string" },
          fullname: { type: "string" },
          email: { type: "string" },
          avatar: { type: "string" },
          coverImage: { type: "string" },
        },
      },
      Video: {
        type: "object",
        properties: {
          _id: { type: "string" },
          title: { type: "string" },
          description: { type: "string" },
          videoFile: { type: "string" },
          thumbnail: { type: "string" },
          status: { type: "string", enum: ["draft", "published", "archived"] },
          visibility: { type: "string", enum: ["public", "private", "unlisted"] },
          views: { type: "number" },
          commentsCount: { type: "number" },
          likesCount: { type: "number" },
          tags: { type: "array", items: { type: "string" } },
          owner: { $ref: "#/components/schemas/User" },
        },
      },
      Comment: {
        type: "object",
        properties: {
          _id: { type: "string" },
          videoId: { type: "string" },
          parentCommentId: { type: ["string", "null"] },
          content: { type: "string" },
          replyCount: { type: "number" },
          likesCount: { type: "number" },
          authorId: { $ref: "#/components/schemas/User" },
        },
      },
      Pagination: {
        type: "object",
        properties: {
          page: { type: "number" },
          limit: { type: "number" },
          totalItems: { type: "number" },
          totalPages: { type: "number" },
        },
      },
    },
  },
  paths: {
    "/health/live": {
      get: {
        tags: ["Health"],
        summary: "Liveness probe",
        responses: {
          200: {
            description: "Service is live",
          },
        },
      },
    },
    "/health/ready": {
      get: {
        tags: ["Health"],
        summary: "Readiness probe",
        responses: {
          200: {
            description: "Service is ready",
          },
          503: {
            description: "Dependencies are not ready",
          },
        },
      },
    },
    "/api/v1/auth/register": {
      post: {
        tags: ["Auth"],
        summary: "Register a new user",
        responses: {
          201: { description: "User registered" },
          400: { description: "Validation failed" },
        },
      },
    },
    "/api/v1/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Login a user",
        responses: {
          200: { description: "User logged in" },
          401: { description: "Invalid credentials" },
        },
      },
    },
    "/api/v1/auth/refresh": {
      post: {
        tags: ["Auth"],
        summary: "Refresh tokens",
        responses: {
          200: { description: "Token refreshed" },
          401: { description: "Refresh token invalid" },
        },
      },
    },
    "/api/v1/auth/logout": {
      post: {
        tags: ["Auth"],
        summary: "Logout current session",
        responses: {
          200: { description: "Logged out" },
        },
      },
    },
    "/api/v1/users/me": {
      get: {
        tags: ["Users"],
        summary: "Get current user",
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: "Current user fetched" },
        },
      },
      patch: {
        tags: ["Users"],
        summary: "Update current user profile",
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: "Profile updated" },
        },
      },
    },
    "/api/v1/users/me/password": {
      patch: {
        tags: ["Users"],
        summary: "Change current user password",
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: "Password changed" },
        },
      },
    },
    "/api/v1/channels/{username}": {
      get: {
        tags: ["Channels"],
        summary: "Get channel profile by username",
        parameters: [
          {
            name: "username",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: { description: "Channel fetched" },
          404: { description: "Channel not found" },
        },
      },
    },
    "/api/v1/videos": {
      get: {
        tags: ["Videos"],
        summary: "List published videos",
        responses: {
          200: { description: "Videos fetched" },
        },
      },
      post: {
        tags: ["Videos"],
        summary: "Create a video",
        security: [{ bearerAuth: [] }],
        responses: {
          201: { description: "Video created" },
        },
      },
    },
    "/api/v1/videos/{videoId}": {
      get: {
        tags: ["Videos"],
        summary: "Get a video by ID",
        parameters: [
          {
            name: "videoId",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: { description: "Video fetched" },
          404: { description: "Video not found" },
        },
      },
      patch: {
        tags: ["Videos"],
        summary: "Update a video",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "videoId",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: { description: "Video updated" },
        },
      },
      delete: {
        tags: ["Videos"],
        summary: "Delete a video",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "videoId",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: { description: "Video deleted" },
        },
      },
    },
    "/api/v1/subscriptions/me": {
      get: {
        tags: ["Subscriptions"],
        summary: "List current user's subscriptions",
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: "Subscriptions fetched" },
        },
      },
    },
    "/api/v1/subscriptions/channels/{channelId}": {
      post: {
        tags: ["Subscriptions"],
        summary: "Subscribe to a channel",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "channelId",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          201: { description: "Subscribed" },
        },
      },
      delete: {
        tags: ["Subscriptions"],
        summary: "Unsubscribe from a channel",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "channelId",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: { description: "Unsubscribed" },
        },
      },
    },
    "/api/v1/comments/videos/{videoId}": {
      get: {
        tags: ["Comments"],
        summary: "List comments for a video",
        parameters: [
          {
            name: "videoId",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: { description: "Comments fetched" },
        },
      },
      post: {
        tags: ["Comments"],
        summary: "Create a comment on a video",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "videoId",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          201: { description: "Comment created" },
        },
      },
    },
    "/api/v1/comments/{commentId}": {
      patch: {
        tags: ["Comments"],
        summary: "Update a comment",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "commentId",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: { description: "Comment updated" },
        },
      },
      delete: {
        tags: ["Comments"],
        summary: "Delete a comment",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "commentId",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: { description: "Comment deleted" },
        },
      },
    },
    "/api/v1/reactions/{targetType}/{targetId}": {
      post: {
        tags: ["Reactions"],
        summary: "Create a like reaction on a video or comment",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "targetType",
            in: "path",
            required: true,
            schema: { type: "string", enum: ["video", "comment"] },
          },
          {
            name: "targetId",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          201: { description: "Reaction created" },
        },
      },
      delete: {
        tags: ["Reactions"],
        summary: "Remove a like reaction from a video or comment",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "targetType",
            in: "path",
            required: true,
            schema: { type: "string", enum: ["video", "comment"] },
          },
          {
            name: "targetId",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: { description: "Reaction removed" },
        },
      },
    },
  },
};
