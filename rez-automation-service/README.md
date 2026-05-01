# ReZ Automation Service

A powerful automation rule engine service for the ReZ platform that enables event-driven automation with configurable rules for customer management, inventory control, dynamic pricing, and loyalty programs.

## Features

- **Event-Driven Architecture**: React to events like orders, payments, customer actions, and inventory changes
- **Rule Engine**: Flexible rule matching with conditions and priorities
- **Multiple Action Types**: Send offers, create purchase orders, update prices, send notifications
- **Scheduled Tasks**: Cron-based scheduling for time-based automation
- **Real-time Processing**: Redis pub/sub for distributed event handling
- **Comprehensive Logging**: Full execution history with statistics
- **RESTful API**: Full CRUD operations for rules and logs
- **TypeScript**: Fully typed codebase for better developer experience

## Supported Events

### Order Events
- `order.created` - New order created
- `order.completed` - Order completed
- `order.cancelled` - Order cancelled
- `order.refunded` - Order refunded

### Payment Events
- `payment.success` - Payment successful
- `payment.failed` - Payment failed
- `payment.pending` - Payment pending

### Customer Events
- `customer.created` - New customer created
- `customer.updated` - Customer profile updated
- `customer.inactive` - Customer inactive (30+ days)
- `customer.churned` - Customer churned

### Inventory Events
- `inventory.low` - Inventory below threshold
- `inventory.updated` - Inventory updated
- `inventory.out_of_stock` - Item out of stock

### Occupancy Events
- `occupancy.high` - High occupancy (>80%)
- `occupancy.low` - Low occupancy (<30%)
- `occupancy.normal` - Normal occupancy

### Reservation Events
- `reservation.created` - New reservation
- `reservation.confirmed` - Reservation confirmed
- `reservation.cancelled` - Reservation cancelled
- `reservation.no_show` - No-show

## Pre-defined Rules

### Customer Rules
| Rule Name | Trigger | Action |
|-----------|---------|--------|
| Churn Prevention | `customer.inactive` | Send 10% discount offer |
| Customer Welcome | `customer.created` | Send welcome notification |
| High Value Alert | `customer.created` | Notify sales team |
| VIP Birthday | `customer.updated` | Send birthday offer |

### Inventory Rules
| Rule Name | Trigger | Action |
|-----------|---------|--------|
| Low Inventory Alert | `inventory.low` | Create purchase order |
| Out of Stock Alert | `inventory.updated` | Send urgent notification |
| Overstock Warning | `inventory.updated` | Notify team |

### Pricing Rules
| Rule Name | Trigger | Action |
|-----------|---------|--------|
| High Occupancy Pricing | `occupancy.high` | Increase prices 20% |
| Low Occupancy Discount | `occupancy.low` | Reduce prices 15% |
| Happy Hour | `occupancy.low` | Apply 25% discount |

### Loyalty Rules
| Rule Name | Trigger | Action |
|-----------|---------|--------|
| Post-Order Follow-up | `order.completed` | Send follow-up message |
| First Order Reward | `order.completed` | Send 20% discount |
| VIP Tier Upgrade | `customer.updated` | Send VIP reward |

## Installation

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env with your configuration
```

## Configuration

### Environment Variables

```env
# Server
PORT=3001
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb://localhost:27017/rez-automation
MONGODB_USER=admin
MONGODB_PASSWORD=your_password
MONGODB_AUTH_SOURCE=admin

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your_redis_password
REDIS_DB=0
REDIS_KEY_PREFIX=rez:automation:

# Logging
LOG_LEVEL=info
LOG_FILE_PATH=./logs/automation.log

# Worker
WORKER_CONCURRENCY=5
WORKER_INTERVAL_MS=1000
```

## Running the Service

```bash
# Development
npm run dev

# Production
npm run build
npm start

# Run tests
npm test
```

## API Endpoints

### Rules

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/rules` | List all rules |
| GET | `/api/rules/:id` | Get rule by ID |
| POST | `/api/rules` | Create new rule |
| PUT | `/api/rules/:id` | Update rule |
| DELETE | `/api/rules/:id` | Delete rule |
| POST | `/api/rules/:id/execute` | Execute rule manually |
| POST | `/api/rules/:id/toggle` | Toggle rule enabled/disabled |
| GET | `/api/rules/stats` | Get rule statistics |

### Events

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/events` | List supported events |
| POST | `/api/events` | Trigger an event |
| GET | `/api/events/history` | Get event history |

### Logs

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/logs` | List execution logs |
| GET | `/api/logs/:id` | Get log by ID |
| GET | `/api/logs/stats` | Get execution statistics |

### Health

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| GET | `/api/health` | Detailed health check |

## Rule Structure

```typescript
interface Rule {
  name: string;
  description?: string;
  trigger: {
    event: string;
    conditions?: ITriggerCondition[];
  };
  action: {
    type: 'send_offer' | 'create_po' | 'update_price' | 'notify' | 'webhook' | 'email' | 'sms';
    config: IActionConfig;
  };
  enabled: boolean;
  priority: number;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface ITriggerCondition {
  field?: string;
  operator?: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'nin' | 'contains' | 'exists';
  value?: string | number | boolean | string[] | number[];
  conditions?: ITriggerCondition[];
  logic?: 'and' | 'or';
}
```

## Example Usage

### Create a Rule

```bash
curl -X POST http://localhost:3001/api/rules \
  -H "Content-Type: application/json" \
  -d '{
    "name": "VIP Customer Discount",
    "trigger": {
      "event": "customer.created",
      "conditions": [
        { "field": "tier", "operator": "eq", "value": "vip" }
      ]
    },
    "action": {
      "type": "send_offer",
      "config": {
        "discount": 25,
        "offerType": "vip_welcome"
      }
    },
    "priority": 10,
    "tags": ["customer", "vip"]
  }'
```

### Trigger an Event

```bash
curl -X POST http://localhost:3001/api/events \
  -H "Content-Type: application/json" \
  -d '{
    "event": "order.completed",
    "data": {
      "orderId": "ord_123",
      "customerId": "cust_456",
      "totalAmount": 150.00
    }
  }'
```

### Execute Rule Manually

```bash
curl -X POST http://localhost:3001/api/rules/:id/execute \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": "cust_456",
    "orderId": "ord_123"
  }'
```

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     ReZ Automation Service                   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────────┐  │
│  │   Express   │───▶│   Routes    │───▶│    Services     │  │
│  │   Server    │    │             │    │                 │  │
│  └─────────────┘    └─────────────┘    │  ┌───────────┐  │  │
│                                         │  │RuleEngine │  │  │
│                                         │  ├───────────┤  │  │
│  ┌─────────────┐    ┌─────────────┐    │  │ActionExec │  │  │
│  │   Worker    │───▶│   Trigger   │───▶│  ├───────────┤  │  │
│  │  (Cron)     │    │   Service   │    │  │TriggerSvc │  │  │
│  └─────────────┘    └─────────────┘    │  └───────────┘  │  │
│                                         └─────────────────┘  │
│  ┌─────────────┐    ┌─────────────┐                        │
│  │    Rule     │◀───│   MongoDB   │                        │
│  │   Models    │    │             │                        │
│  └─────────────┘    └─────────────┘                        │
│                                                             │
│  ┌─────────────┐                                           │
│  │    Redis    │ ◀── Pub/Sub & Queue                        │
│  │             │                                           │
│  └─────────────┘                                           │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Testing

```bash
# Run all tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run tests in watch mode
npm run test:watch
```

## License

MIT
