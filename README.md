# ReZ Commerce Platform

**Powered by ReZ Mind** - AI-powered commerce intelligence

---

## What is ReZ Mind?

**ReZ Mind** is the unified intelligence layer for the ReZ commerce ecosystem. It combines:

| Component | Purpose |
|-----------|---------|
| **RTMN Commerce Memory** | Tracks user intent across all apps |
| **ReZ Agent OS** | 8 autonomous AI agents that act on the data |
| **Chat Intelligence** | Conversational AI for customer support |

---

## Package Structure

```
ReZ Full App/
├── packages/
│ ├── rez-intent-graph/ ← ReZ Mind (Commerce Intelligence)
│ ├── rez-chat-ai/ ← Chat AI Engine
│ ├── rez-chat-service/ ← Chat Backend
│ ├── rez-chat-integration/ ← Chat Integrations
│ ├── rez-agent-memory/ ← Agent Memory
│ ├── shared-types/ ← Shared Types
│ └── rez-ui/ ← Shared UI
├── services/
│ ├── rez-wallet-service/
│ ├── rez-order-service/
│ ├── rez-payment-service/
│ └── ... (15+ services)
└── apps/
 ├── Hotel OTA
 ├── Rendez
 ├── adBazaar
 └── ...
```

---

## ReZ Mind - Commerce Intelligence

```bash
npm install @rez/intent-graph
```

### Features

- **Intent Capture** - Track search → view → cart → purchase
- **Dormant Revival** - Reactivate abandoned intents
- **8 Autonomous Agents** - Self-operating AI agents
- **45 Support Scenarios** - Across 9 apps
- **100% Test Coverage** - 93 tests passing

### Quick Start

```typescript
import { startAutonomousMode } from '@rez/intent-graph';

// Enable full autonomy
await startAutonomousMode();
```

---

## Connected Apps

| App | Type | ReZ Mind Integration |
|-----|------|---------------------|
| Hotel OTA | Booking | Travel intent tracking |
| Room QR | Guest Services | Service request memory |
| ReZ Consumer | E-commerce | Purchase prediction |
| Web Menu | Restaurant | Dining intent |
| Merchant OS | Business Dashboard | Demand signals |
| Karma | Gamification | Engagement memory |
| Rendez | Social | Profile intelligence |
| AdBazaar | Advertising | Attribution |
| NextaBiZ | Enterprise | Business insights |

---

## Backend Services

| Service | Purpose |
|---------|---------|
| Wallet | Multi-coin wallet management |
| Order | Order lifecycle (11 states) |
| Payment | Payment gateway integration |
| Merchant | Merchant operations |
| Auth | Authentication & authorization |
| Notification | Push, email, SMS |
| Search | Product search |
| Catalog | Product catalog |
| Karma | Gamification points |
| Finance | Financial operations |

---

## Development

```bash
# Install dependencies
npm install

# Build packages
npm run build

# Run tests
npm test

# Start agent server
npx tsx packages/rez-intent-graph/src/server/agent-server.ts
```

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Apps                                │
│    Hotel OTA | Consumer | Merchant | Rendez | etc.         │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                    ReZ Mind                                │
│  ┌──────────────────┐    ┌──────────────────┐            │
│  │ Commerce Memory  │ +  │   Agent OS       │            │
│  │ • Intent Graph   │    │ • 8 Super Agents │            │
│  │ • Dormant Revival│    │ • Swarm Coord.  │            │
│  │ • Demand Signals │    │ • Action Trigger│            │
│  └──────────────────┘    └──────────────────┘            │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                  Backend Services                          │
│  Wallet | Orders | Payments | Auth | Notifications | etc.  │
└─────────────────────────────────────────────────────────────┘
```

---

## License

Proprietary - ReZ / RuFlo

---

**Powered by ReZ Mind** 🤖
