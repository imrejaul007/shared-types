# Phase 2: Real Service Integration

## Overview

Phase 2 connects **ReZ Mind** to the actual backend services in the ReZ ecosystem.

## Service Architecture

```
┌─────────────────────────────────────────────────────────────┐
│ ReZ Mind │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ External Services Integration Layer │ │
│ │ • HTTP Client (retry + circuit breaker) │ │
│ │ • Wallet │ │
│ │ • Order │ │
│ │ • Notification │ │
│ │ • Merchant │ │
│ │ • PMS │ │
│ └─────────────────────────────────────────────────────┘ │
└────────────────────────┬────────────────────────────────────┘
 │
 ▼
┌─────────────────────────────────────────────────────────────┐
│ Backend Services │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ │
│ │ Wallet │ │ Order │ │ Notif │ │ Merchant │ │
│ │ Service │ │ Service │ │ Service │ │ Service │ │
│ └──────────┘ └──────────┘ └──────────┘ └──────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## Services Integrated

| Service | Purpose | Connection |
|---------|---------|------------|
| **Wallet Service** | Coin debit/credit, balance | HTTP |
| **Order Service** | Order creation, status updates | HTTP |
| **Notification Service** | Push notifications | Pub/Sub |
| **Merchant Service** | Merchant operations | Pub/Sub |
| **PMS Service** | Property management | Pub/Sub |
| **Task Queue** | Operational tasks | Pub/Sub |

## Service URLs

```bash
# Environment Variables
WALLET_SERVICE_URL=http://localhost:4004
ORDER_SERVICE_URL=http://localhost:3006
PAYMENT_SERVICE_URL=http://localhost:3004
MERCHANT_SERVICE_URL=http://localhost:3005
PMS_SERVICE_URL=http://localhost:3006
NOTIFICATION_SERVICE_URL=http://localhost:3007
INTERNAL_SERVICE_TOKEN=your-internal-token
```

## API Endpoints Added

### Service Health

```bash
GET /api/services/health # All service health
GET /api/services/health/:service # Single service health
POST /api/services/circuit-breaker/reset/:service # Reset circuit breaker
POST /api/services/circuit-breaker/open/:service # Force open circuit
```

### Wallet Operations

```bash
GET /api/wallet/:userId/balance # Get wallet balance
POST /api/wallet/charge # Charge user wallet
POST /api/wallet/credit # Credit user wallet
```

### Order Operations

```bash
POST /api/orders/create # Create order
PATCH /api/orders/:orderId/status # Update order status
```

### Room Service Flow

```bash
POST /api/room-service/execute # Complete room QR flow
```

### Shopping Flow

```bash
POST /api/shopping/execute # Complete shopping flow
```

## Circuit Breaker Pattern

Each service has its own circuit breaker:

```
CLOSED → Normal operation
  ↓ (5 failures)
OPEN → Block requests for 60 seconds
  ↓ (timeout)
HALF-OPEN → Allow test requests
  ↓ (2 successes)
CLOSED → Resume normal operation
```

### Circuit Breaker Status

```bash
GET /api/services/circuit-breaker/status
```

Response:
```json
{
  "services": [
    { "name": "wallet", "status": "closed", "failures": 0 },
    { "name": "order", "status": "open", "failures": 5 },
    { "name": "notification", "status": "closed", "failures": 0 }
  ]
}
```

## Retry Strategy

Failed requests are retried with exponential backoff:

```
Attempt 1: Immediate
Attempt 2: 100ms delay
Attempt 3: 200ms delay
Attempt 4: 400ms delay (max)
```

## Complete Flows

### Room QR Flow

```
1. Charge wallet (if payable items)
2. Submit PMS guest request
3. Create operational task
4. Send staff notification
5. Update memory
```

### Shopping Flow

```
1. Charge wallet
2. Create order
3. Send to merchant OS
4. Update memory
```

## Testing

```bash
# Run Phase 2 integration tests
npm run test:phase2

# Run with real services (requires services running)
npm run test:integration
```

## Service Availability

When a service is unavailable:
1. Circuit breaker opens after 5 failures
2. Requests are blocked for 60 seconds
3. Fallback to cached data where available
4. Error logged for monitoring

## Monitoring

```bash
# Check all service health
curl http://localhost:3005/api/services/health

# Check circuit breaker status
curl http://localhost:3005/api/services/circuit-breaker/status
```

## Next Steps

1. Add more services (Auth, Catalog, Search)
2. Add WebSocket support for real-time updates
3. Add metrics and alerting
4. Add distributed tracing
