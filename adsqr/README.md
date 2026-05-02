# AdsQr

> **"Launch an ad anywhere. Track real results. In minutes."**

---

## Status

✅ MVP Complete
✅ Security Audit Passed
✅ Deployed to Vercel
⚠️ Environment Variables Required

---

## Quick Start

### 1. Install

```bash
cd adsqr
npm install
```

### 2. Setup Database

1. Create Supabase project at [supabase.com](https://supabase.com)
2. Run `supabase/migrations/SETUP.sql` in SQL Editor
3. Copy `supabase/migrations/002_attribution_tracking.sql` and run

### 3. Configure Environment

Create `.env.local`:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Run

```bash
npm run dev
```

---

## Project Structure

```
adsqr/
├── src/
│   ├── app/
│   │   ├── page.tsx                    # Dashboard
│   │   ├── login/page.tsx              # Login/Register
│   │   ├── campaigns/
│   │   │   ├── new/page.tsx           # Create campaign
│   │   │   └── [id]/page.tsx         # Campaign detail
│   │   ├── scan/[slug]/
│   │   │   ├── page.tsx              # Scan landing page
│   │   │   └── components.tsx         # Landing templates
│   │   └── api/
│   │       ├── campaigns/             # Campaign CRUD
│   │       ├── scan/[slug]/          # Scan tracking
│   │       ├── visit/                # Visit tracking
│   │       ├── purchase/             # Purchase tracking
│   │       ├── analytics/             # Attribution
│   │       └── qr/                   # QR operations
│   └── lib/
│       ├── supabase.ts               # Supabase client
│       └── qr.ts                    # QR utilities
├── supabase/migrations/
│   ├── SETUP.sql                    # Main schema
│   └── 002_attribution_tracking.sql # Attribution tables
└── package.json
```

---

## Features

### Campaign Management
- Create campaigns with offers
- Multi-step rewards (scan/visit/purchase)
- Coin budget management
- Status control (draft/active/paused/ended)

### QR Codes
- Single QR generation
- Bulk QR generation
- Download as HTML/PDF
- Location tagging

### Attribution Tracking
- Scan events
- Visit events (GPS verified)
- Purchase events
- Coin transactions

### Landing Pages
- Bold template (dark gradient)
- Minimal template (clean white)
- Image First template (banner + overlay)

---

## API Endpoints

### Campaigns
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/campaigns` | List campaigns |
| POST | `/api/campaigns` | Create campaign |
| GET | `/api/campaigns/[id]` | Get campaign |
| PATCH | `/api/campaigns/[id]` | Update campaign |

### QR Codes
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/campaigns/[id]/qr` | List QR codes |
| POST | `/api/campaigns/[id]/qr` | Create QR |
| POST | `/api/campaigns/[id]/qr/bulk` | Bulk create |
| GET | `/api/campaigns/[id]/qr/download` | Download |

### Attribution
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/scan/[slug]` | Record scan |
| POST | `/api/visit` | Record visit |
| POST | `/api/purchase` | Record purchase |
| GET | `/api/analytics/attribution` | Get funnel |

---

## Database Schema

### Tables
- `campaigns` - Campaign data
- `qr_codes` - QR code records
- `scan_events` - Scan tracking
- `visit_events` - Visit tracking
- `purchase_events` - Purchase tracking
- `coin_transactions` - Coin ledger

### Views
- `attribution_funnel` - Analytics view

---

## Deployment

### Vercel

```bash
vercel --prod
```

Set environment variables in Vercel dashboard.

---

## Security

See [AUDIT.md](AUDIT.md) for security audit details.

---

## Documentation

| Document | Description |
|----------|-------------|
| [README](README.md) | This file |
| [AUDIT](AUDIT.md) | Security audit |
| [DEPLOYMENT](DEPLOYMENT.md) | Setup guide |
| [E2E-TESTING](E2E-TESTING.md) | Test scenarios |
