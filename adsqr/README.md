# AdsQr — Documentation

> **"Launch an ad anywhere. Track real results. In minutes."**

---

## Table of Contents

1. [Overview](#overview)
2. [Quick Start](#quick-start)
3. [Architecture](#architecture)
4. [Features](#features)
5. [API Reference](#api-reference)
6. [Database Schema](#database-schema)
7. [Deployment](#deployment)
8. [Testing](#testing)
9. [Roadmap](#roadmap)

---

## Overview

AdsQr is a lightweight QR-based advertising campaign platform. Brands create campaigns, generate QR codes, and track real-world engagement through scans, visits, and purchases.

### What AdsQr Does

```
Brand creates campaign → Generates QR codes → Places physically
    ↓
User scans QR → Sees offer → Earns coins → Visits store → Makes purchase
    ↓
Brand tracks: Scans → Visits → Purchases → ROI
```

### How AdsQr Fits in ReZ Ecosystem

```
AdsQr → Acquires merchants (easy entry)
    ↓
AdBazaar → Upsells to inventory campaigns
    ↓
ReZ → Acquires users
    ↓
AdOS → Optimizes (future)
```

---

## Quick Start

### 1. Install

```bash
cd adsqr
npm install
```

### 2. Setup Database

1. Create Supabase project at [supabase.com](https://supabase.com)
2. Copy `supabase/migrations/SETUP.sql` into SQL Editor
3. Run

### 3. Configure Environment

```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Architecture

### Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 14 (React) |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| Styling | Tailwind CSS |
| Hosting | Vercel |
| QR Generation | QR Server API |

### Project Structure

```
adsqr/
├── src/
│   ├── app/
│   │   ├── page.tsx                 # Dashboard
│   │   ├── campaigns/
│   │   │   ├── new/page.tsx        # Create campaign
│   │   │   └── [id]/page.tsx       # Campaign detail
│   │   ├── scan/[slug]/
│   │   │   ├── page.tsx            # Scan landing page
│   │   │   └── components.tsx      # Landing templates
│   │   └── api/
│   │       ├── campaigns/           # Campaign CRUD
│   │       ├── scan/[slug]/        # Scan tracking
│   │       ├── visit/               # Visit tracking
│   │       ├── purchase/            # Purchase tracking
│   │       └── analytics/           # Attribution analytics
│   └── lib/
│       ├── supabase.ts             # Supabase client
│       └── qr.ts                    # QR utilities
├── supabase/migrations/
│   ├── 001_initial_schema.sql
│   └── 002_attribution_tracking.sql
└── package.json
```

---

## Features

### Campaign Management

| Feature | Description |
|---------|-------------|
| Create Campaign | Name, description, offers |
| Multi-step Rewards | Scan, Visit, Purchase coins |
| Coin Budget | Set spending limits |
| Status Control | Draft, Active, Paused, Ended |

### QR Code System

| Feature | Description |
|---------|-------------|
| Single QR | Generate one QR code |
| Bulk QR | Generate multiple at once |
| Download | HTML/PDF for printing |
| Labels | Name each QR location |
| Locations | GPS coordinates |

### Attribution Tracking

| Event | Tracking |
|-------|----------|
| Scan | User scans QR, records event |
| Visit | GPS-verified location visit |
| Purchase | Receipt confirmation |
| Coins | REZ + Brand coins |

### Landing Pages

| Template | Style |
|----------|-------|
| Bold | Dark gradient, large text |
| Minimal | Clean white, card-based |
| Image First | Large banner with overlay |

---

## API Reference

### Campaigns

#### Create Campaign
```http
POST /api/campaigns
Content-Type: application/json

{
  "name": "Summer Sale",
  "description": "20% off everything",
  "scan_reward": 10,
  "visit_reward": 25,
  "purchase_reward": 50,
  "coin_budget": 10000
}
```

#### Get Campaign
```http
GET /api/campaigns/[id]
```

#### Update Campaign
```http
PATCH /api/campaigns/[id]
Content-Type: application/json

{
  "status": "active"
}
```

### QR Codes

#### Generate QR
```http
POST /api/campaigns/[id]/qr
Content-Type: application/json

{
  "label": "Table 1",
  "location_name": "Main Hall"
}
```

#### Bulk Generate
```http
POST /api/campaigns/[id]/qr/bulk
Content-Type: application/json

{
  "locations": [
    {"label": "Table 1", "address": "Main Hall"},
    {"label": "Counter", "address": "Front"},
    {"label": "Entrance", "address": "Main Door"}
  ]
}
```

#### Download QR Pack
```http
GET /api/campaigns/[id]/qr/download?format=html
```

### Attribution

#### Record Visit
```http
POST /api/visit
Content-Type: application/json

{
  "scan_event_id": "uuid",
  "campaign_id": "uuid",
  "lat": 19.07,
  "lng": 72.87
}
```

#### Record Purchase
```http
POST /api/purchase
Content-Type: application/json

{
  "scan_event_id": "uuid",
  "campaign_id": "uuid",
  "amount": 500
}
```

#### Get Analytics
```http
GET /api/analytics/attribution?campaign_id=uuid&range=30d
```

---

## Database Schema

### Tables

#### campaigns
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| brand_id | UUID | Owner |
| name | TEXT | Campaign name |
| offer | JSONB | Offer details |
| scan_reward | INTEGER | Coins per scan |
| visit_reward | INTEGER | Coins per visit |
| purchase_reward | INTEGER | Coins per purchase |
| brand_coins_reward | INTEGER | Brand-specific coins |
| coin_budget | INTEGER | Total coins |
| coins_used | INTEGER | Coins spent |
| status | TEXT | draft/active/paused/ended |

#### qr_codes
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| campaign_id | UUID | FK to campaigns |
| qr_slug | TEXT | Unique URL slug |
| qr_label | TEXT | Display name |
| location_name | TEXT | Physical location |
| scan_count | INTEGER | Total scans |
| is_active | BOOLEAN | Active status |

#### scan_events
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| qr_id | UUID | FK to qr_codes |
| campaign_id | UUID | FK to campaigns |
| user_id | UUID | Scanned by |
| coins_credited | BOOLEAN | Reward given |
| coins_amount | INTEGER | Amount |

#### visit_events
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| scan_event_id | UUID | FK to scan_events |
| location_lat | DECIMAL | GPS latitude |
| location_lng | DECIMAL | GPS longitude |
| location_verified | BOOLEAN | GPS confirmed |

#### purchase_events
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| scan_event_id | UUID | FK to scan_events |
| purchase_amount | DECIMAL | Amount spent |
| attributed_revenue | DECIMAL | Revenue attributed |

#### coin_transactions
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| campaign_id | UUID | FK to campaigns |
| user_id | UUID | Recipient |
| amount | INTEGER | Coin amount |
| coin_type | TEXT | rez/brand |
| reason | TEXT | scan/visit/purchase |

---

## Deployment

### Vercel (Recommended)

```bash
# Install CLI
npm i -g vercel

# Login
vercel login

# Deploy
cd adsqr
vercel

# Production
vercel --prod
```

### Environment Variables

Set in Vercel Dashboard → Settings → Environment Variables:

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJ...` |
| `NEXT_PUBLIC_APP_URL` | `https://adsqr.vercel.app` |

### Cron Jobs

Add to `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/cron/process-coin-credits",
      "schedule": "*/5 * * * *"
    }
  ]
}
```

---

## Testing

### E2E Test Scenarios

1. **Create Campaign** → Dashboard shows new campaign
2. **Generate QR** → QR appears in list
3. **Scan QR** → Landing page loads
4. **Earn Coins** → Transaction recorded
5. **Record Visit** → Visit event created
6. **Record Purchase** → Purchase event + coins

### API Testing

```bash
# Create campaign
curl -X POST http://localhost:3000/api/campaigns \
  -H "Content-Type: application/json" \
  -d '{"name": "Test"}'

# Get campaigns
curl http://localhost:3000/api/campaigns
```

---

## Roadmap

### Phase 1 (Done)
- Campaign CRUD
- QR generation
- Scan tracking
- Landing pages

### Phase 2
- Bulk QR download
- Analytics dashboard
- REZ Wallet integration

### Phase 3
- Lite AdOS recommendations
- Smart campaign planner
- Auto budget optimization

---

## Support

For issues or questions:
- Check [E2E-TESTING.md](E2E-TESTING.md)
- Check [DEPLOYMENT.md](DEPLOYMENT.md)
- Review API docs above
