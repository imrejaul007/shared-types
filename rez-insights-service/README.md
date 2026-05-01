# Rez Insights Service

A microservice for storing and managing AI-powered insights for the ReZ platform.

## Features

- Create and manage AI-generated insights
- Support for multiple insight types (churn_risk, upsell, cross_sell, reorder, campaign, general)
- Priority-based insight management (high, medium, low)
- Redis caching for improved performance
- Rate limiting protection
- JWT authentication
- MongoDB for persistent storage

## Prerequisites

- Node.js >= 18.0.0
- MongoDB
- Redis

## Installation

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Start the server
npm start

# Development mode
npm run dev
```

## Configuration

Create a `.env` file in the root directory with the following variables:

```env
NODE_ENV=development
PORT=3003
MONGODB_URI=mongodb://localhost:27017/rez-insights
MONGODB_USER=
MONGODB_PASSWORD=
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_TLS=false
JWT_SECRET=your-secret-key-at-least-32-characters-long
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
INSIGHT_CACHE_TTL_SECONDS=300
```

## API Documentation

### Health Endpoints

#### GET /health
Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2026-05-01T00:00:00.000Z",
  "uptime": 3600,
  "service": "rez-insights-service",
  "version": "1.0.0",
  "mongoStatus": "connected",
  "redisStatus": "connected"
}
```

#### GET /ready
Readiness check endpoint.

**Response:**
```json
{
  "ready": true
}
```

### Insights API

#### POST /api/insights
Create a new insight.

**Headers:**
- `Authorization: Bearer <token>` (required)
- `Content-Type: application/json`

**Request Body:**
```json
{
  "userId": "user123",
  "merchantId": "merchant456",
  "type": "churn_risk",
  "priority": "high",
  "title": "High churn risk detected",
  "description": "Customer has shown signs of churning based on recent activity",
  "recommendation": "Send a personalized discount offer",
  "actionData": { "discount": "20%", "campaignId": "camp123" },
  "confidence": 0.85,
  "expiresAt": "2026-12-31T23:59:59.999Z",
  "metadata": { "source": "ai_analysis" }
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "userId": "user123",
    "merchantId": "merchant456",
    "type": "churn_risk",
    "priority": "high",
    "title": "High churn risk detected",
    "description": "Customer has shown signs of churning based on recent activity",
    "recommendation": "Send a personalized discount offer",
    "actionData": { "discount": "20%", "campaignId": "camp123" },
    "confidence": 0.85,
    "expiresAt": "2026-12-31T23:59:59.999Z",
    "status": "new",
    "metadata": { "source": "ai_analysis" },
    "createdAt": "2026-05-01T00:00:00.000Z",
    "updatedAt": "2026-05-01T00:00:00.000Z"
  }
}
```

#### GET /api/insights/user/:userId
Get all insights for a user.

**Headers:**
- `Authorization: Bearer <token>` (optional)

**Query Parameters:**
- `status` (optional): Filter by status (new, viewed, actioned, dismissed)
- `type` (optional): Filter by type
- `priority` (optional): Filter by priority
- `limit` (optional): Number of results (default: 50, max: 100)
- `skip` (optional): Number of results to skip
- `includeExpired` (optional): Include expired insights

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "userId": "user123",
      "type": "churn_risk",
      "priority": "high",
      "title": "High churn risk detected",
      "status": "new",
      "confidence": 0.85,
      "expiresAt": "2026-12-31T23:59:59.999Z",
      "createdAt": "2026-05-01T00:00:00.000Z"
    }
  ]
}
```

#### GET /api/insights/merchant/:merchantId
Get all insights for a merchant.

**Query Parameters:** Same as user insights

**Response (200 OK):**
```json
{
  "success": true,
  "data": [...]
}
```

#### GET /api/insights/user/:userId/count
Get count of user insights.

**Query Parameters:**
- `status` (optional): Filter by status

**Response (200 OK):**
```json
{
  "success": true,
  "data": 42
}
```

#### GET /api/insights/:id
Get a specific insight by ID.

**Response (200 OK):**
```json
{
  "success": true,
  "data": { ... }
}
```

#### PATCH /api/insights/:id
Update an insight.

**Request Body:**
```json
{
  "status": "viewed",
  "priority": "high",
  "metadata": { "viewedAt": "2026-05-01T00:00:00.000Z" }
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": { ... }
}
```

#### DELETE /api/insights/:id
Dismiss an insight (sets status to dismissed).

**Response (200 OK):**
```json
{
  "success": true,
  "data": { ... }
}
```

## Insight Types

| Type | Description |
|------|-------------|
| `churn_risk` | Risk assessment for customer churn |
| `upsell` | Opportunity to upsell products/services |
| `cross_sell` | Opportunity to cross-sell related products |
| `reorder` | Reminder for repeat purchases |
| `campaign` | Marketing campaign recommendations |
| `general` | General AI-generated insights |

## Insight Status

| Status | Description |
|--------|-------------|
| `new` | Newly generated insight, not yet viewed |
| `viewed` | User has viewed the insight |
| `actioned` | User has taken action on the insight |
| `dismissed` | User has dismissed the insight |

## Priority Levels

| Priority | Description |
|----------|-------------|
| `high` | Urgent attention required |
| `medium` | Normal priority |
| `low` | Can be addressed later |

## Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm test -- --coverage
```

## Error Responses

All error responses follow this format:

```json
{
  "success": false,
  "error": "Error message describing what went wrong"
}
```

Common HTTP status codes:
- `200`: Success
- `201`: Created
- `400`: Bad Request (validation error)
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `429`: Too Many Requests (rate limited)
- `500`: Internal Server Error

## Project Structure

```
rez-insights-service/
├── src/
│   ├── index.ts              # Main entry point
│   ├── config/
│   │   ├── env.ts            # Environment configuration
│   │   ├── mongodb.ts        # MongoDB connection
│   │   └── redis.ts          # Redis connection
│   ├── models/
│   │   └── Insight.ts        # Mongoose model
│   ├── routes/
│   │   └── insights.routes.ts # API routes
│   ├── services/
│   │   └── insightService.ts  # Business logic
│   └── middleware/
│       ├── auth.ts           # JWT authentication
│       └── rateLimiter.ts    # Rate limiting
├── tests/
│   └── insight.test.ts       # Unit tests
├── package.json
├── tsconfig.json
├── jest.config.js
└── README.md
```

## License

MIT
