# @rez/intent-capture-sdk

Unified Intent Capture SDK for ReZ ecosystem apps.

## Installation

```bash
npm install @rez/intent-capture-sdk
```

## Usage

### Browser/React Native

```typescript
import { IntentCapture, createIntentTracker } from '@rez/intent-capture-sdk';

// Initialize with your app's base URL
const intentCapture = new IntentCapture({
  baseUrl: 'https://api.rezmind.example.com',
  appType: 'hotel_ota',
});

// Capture hotel search
await intentCapture.capture({
  userId: 'user123',
  intentKey: 'hotel_search_mumbai',
  eventType: 'search',
  category: 'TRAVEL',
  metadata: { city: 'Mumbai', checkin: '2024-04-01' },
});

// Use the hook in React
const trackIntent = createIntentTracker(intentCapture);

// In your component
trackIntent('view', { hotelId: 'hotel456' });
```

### Event Types

| Event Type | Confidence | Description |
|------------|------------|-------------|
| `search` | 0.15 | User performed a search |
| `view` | 0.10 | User viewed an item |
| `wishlist` | 0.25 | User added to wishlist |
| `cart_add` | 0.30 | User added to cart |
| `hold` | 0.35 | User initiated checkout |
| `checkout_start` | 0.40 | User started payment |
| `fulfilled` | 1.0 | Purchase completed |
| `abandoned` | -0.2 | User abandoned |

### App Types

- `hotel_ota` - Hotel booking app
- `restaurant` - Restaurant/food ordering
- `retail` - E-commerce retail
- `hotel_guest` - In-hotel guest services

## API

### IntentCapture.capture(params)

Capture an intent signal.

```typescript
interface CaptureParams {
  userId: string;
  intentKey: string;
  eventType: EventType;
  category: 'TRAVEL' | 'DINING' | 'RETAIL' | 'HOTEL_SERVICE' | 'GENERAL';
  metadata?: Record<string, unknown>;
}
```

### IntentCapture.setUser(userId)

Set the current user for automatic attachment to all captures.

### IntentCapture.getActiveIntents(userId)

Get active intents for a user.

### IntentCapture.getDormantIntents(userId)

Get dormant intents for revival suggestions.
