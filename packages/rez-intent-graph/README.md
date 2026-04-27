# ReZ Mind

**AI-powered commerce intelligence platform**

ReZ Mind combines RTMN Commerce Memory with ReZ Agent OS to create an autonomous commerce intelligence system that tracks user intent, predicts behavior, and automatically takes action.

## What is ReZ Mind?

ReZ Mind is the "brain" of the ReZ commerce ecosystem. It:

- **Captures** user intent across all apps (search → view → cart → purchase)
- **Predicts** which dormant intents are likely to convert
- **Acts** autonomously through 8 specialized AI agents
- **Learns** from every interaction to improve recommendations

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        ReZ Mind                             │
│  ┌─────────────────────────────────────────────────────┐  │
│  │          RTMN Commerce Memory                        │  │
│  │  • Intent Capture & Scoring                          │  │
│  │  • Dormant Intent Detection                         │  │
│  │  • Cross-App User Profiles                          │  │
│  │  • Revival Engine                                   │  │
│  └─────────────────────────────────────────────────────┘  │
│                            │                               │
│                            ▼                               │
│  ┌─────────────────────────────────────────────────────┐  │
│  │              ReZ Agent OS                           │  │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────┐ │  │
│  │  │ Demand   │ │ Scarcity │ │Personaliz│ │Network│ │  │
│  │  │ Signal   │ │  Agent   │ │  Agent   │ │Effect │ │  │
│  │  └──────────┘ └──────────┘ └──────────┘ └────────┘ │  │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────┐ │  │
│  │  │Attribution│ │Adaptive  │ │Feedback  │ │Revenue │ │  │
│  │  │  Agent   │ │ Scoring  │ │   Loop   │ │Attrib  │ │  │
│  │  └──────────┘ └──────────┘ └──────────┘ └────────┘ │  │
│  └─────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Quick Start

```bash
npm install @rez/intent-graph
```

```typescript
import {
  // Start autonomous mode
  startAutonomousMode,
  
  // Commerce Memory
  intentCaptureService,
  dormantIntentService,
  
  // Agents
  runDemandSignalAgent,
  runScarcityAgent,
  runPersonalizationAgent,
} from '@rez/intent-graph';

// Enable full autonomy (dangerous mode)
await startAutonomousMode();
```

## 8 Autonomous Agents

| Agent | Purpose | Dangerous Actions |
|-------|---------|------------------|
| **Demand Signal** | Track user demand patterns | adjust_price, update_dashboard |
| **Scarcity** | Monitor inventory & urgency | send_urgency_nudge, alert_support |
| **Personalization** | User response profiling | send_nudge |
| **Attribution** | Multi-touch conversion tracking | (watch-only) |
| **Adaptive Scoring** | ML intent scoring | retrain_model |
| **Feedback Loop** | Self-healing & optimization | pause_strategy, reallocate_budget |
| **Network Effect** | Collaborative filtering | trigger_revival, send_nudge |
| **Revenue Attribution** | Revenue tracking | alert_support |

## How It Works

### User Intent Flow

```
1. User searches "hotels in Goa"
   → Intent captured (confidence: 0.3)

2. User views 3 hotels
   → Confidence increases to 0.6

3. User adds to cart
   → Confidence 0.8

4. User abandons checkout
   → Intent goes DORMANT after 7 days

5. Price drops 20% on Goa hotels
   → Revival engine detects match

6. Nudge sent: "Hotels in Goa are 20% cheaper!"
   → User clicks, books → Intent FULFILLED
```

### Multi-Agent Coordination

```
Demand spike detected → Pricing Agent adjusts prices
                    → Campaign Agent launches promo
                    → Procurement Agent reorders
                    → All monitored by Feedback Loop
```

## API Endpoints

### Autonomous Mode (Dangerous)

```bash
POST /api/autonomous/start      # Enable full autonomy
POST /api/autonomous/stop       # Disable autonomy
POST /api/autonomous/action     # Execute dangerous action
GET  /api/autonomous/status    # Get autonomy status
POST /api/autonomous/emergency-stop  # Emergency stop
```

### Data Access

```bash
GET /api/demand/:merchantId/:category    # Get demand signal
GET /api/scarcity/:merchantId/:category  # Get scarcity signal
GET /api/scarcity/critical               # Get critical scarcity
GET /api/profiles/:userId                # Get user profile
GET /api/revenue/latest                  # Get revenue report
GET /api/trending/:category              # Get trending intents
```

## Support Coverage

ReZ Mind handles 45 support scenarios across 9 apps:

| App | Scenarios |
|-----|-----------|
| Hotel OTA | Late check-in, refunds, complaints, concierge |
| Room QR | WiFi, housekeeping, billing, amenities, emergency |
| ReZ Consumer | Cashback, coins, orders, fraud |
| Web Menu | Dietary, modifications, wrong orders, wait times |
| Merchant OS | POS, settlements, campaigns, inventory |
| Karma | Points, tiers, challenges, redemptions |
| Rendez | Safety, bookings, profiles, gifts |
| AdBazaar | Campaigns, budgets, targeting, ROI |
| NextaBiZ | Invoices, workflows, vendors, integrations |

## Test Coverage

```bash
npm test
# Commerce Stress Tests: 24 passed
# Merchant OS Tests: 24 passed
# Support Agent Tests: 45 passed
# Total: 93/93 passed (100%)
```

## Dangerous Mode

⚠️ **WARNING**: Full autonomy enables skip-permission operations.

```typescript
import { enableDangerousMode } from '@rez/intent-graph';

// Enable dangerous mode
enableDangerousMode();

// Now agents can:
// - Adjust prices automatically
// - Send nudges without approval
// - Pause strategies
// - Reallocate budgets
// - Trigger revivals

// Emergency stop if needed
import { emergencyStop } from '@rez/intent-graph';
emergencyStop('Safety threshold exceeded');
```

## License

Proprietary - ReZ / RuFlo
