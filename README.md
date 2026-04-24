# @rez/shared-types

The canonical cross-repo type surface for REZ / RuFlo. One source of truth for
entity shapes, enums, FSM rules, branded IDs, zod schemas, and runtime guards.

**v2.0 — read `MIGRATION.md` before updating consumers.**

## Install

```bash
# Inside the workspace
npm install @rez/shared-types@workspace:*

# External services
npm install @rez/shared-types
```

## What's inside

| Path | What it exports | Who imports it |
|---|---|---|
| `@rez/shared-types` | Root export — everything below | every repo |
| `@rez/shared-types/fsm` | FSM helpers (Payment / Order / Order.payment) | backend, merchant, admin |
| `@rez/shared-types/guards` | Runtime guards — **no zod dep** | rez-app-consumer |
| `@rez/shared-types/branded` | Branded ID types + constructors | backend, merchant |

## Quick start

### Backend / services — full surface

```ts
import {
  // Entity types
  type IOrder,
  type IPayment,
  type IWallet,
  // Enums
  OrderStatus,
  PaymentStatus,
  CoinType,
  // FSM
  assertValidPaymentTransition,
  canOrderBeCancelled,
  // Zod
  CreateOrderSchema,
  WalletDebitSchema,
  // Branded IDs
  toOrderId,
  type OrderId,
} from '@rez/shared-types';

// At your controller boundary:
router.post('/orders', (req, res) => {
  const parsed = CreateOrderSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json(parsed.error.flatten());
  // parsed.data is fully typed — no `as any`
});
```

### Consumer app (React Native, no zod)

```ts
import type { IOrder, IPayment } from '@rez/shared-types';
import {
  OrderStatus,
  isOrderResponse,
  asPaymentStatus,
  isArrayOf,
} from '@rez/shared-types/guards';

// At your api client:
export async function fetchOrder(id: string): Promise<IOrder> {
  const res = await fetch(`/api/orders/${id}`);
  const data = await res.json();
  if (!isOrderResponse(data)) throw new Error('Bad order payload');
  return data;
}
```

### Branded IDs — compile-time typo safety

```ts
import { toOrderId, toUserId, type OrderId, type UserId } from '@rez/shared-types';

const orderId: OrderId = toOrderId(req.params.id);  // throws if not 24-hex
const userId: UserId = toUserId(req.user.id);

// Fails at compile time:
// Argument of type 'UserId' is not assignable to parameter of type 'OrderId'.
await cancelOrder(userId);
```

## Entities covered (canonical)

- **IUser** — auth, profile, preferences, 8 verification zones, referral, fraud flags, push tokens, patch tests, soft-delete
- **IOrder** — 11-state FSM, totals (platformFee / merchantPayout), delivery, fulfillment, timeline, analytics
- **IPayment** — 11-state FSM, discriminated gateway response (razorpay / stripe / paypal / upi / wallet / cod)
- **IProduct** — pricing (selling ≤ original), inventory, variants, modifiers, GST, serviceDetails, ratings distribution, 86'd-item flag
- **IWallet** — 6 coin types (with priority order), branded coins, category balances, statistics (6 counters), savings insights, settings
- **ICoinTransaction** — ledger row (balanceBefore / balanceAfter for reconciliation)

## FSM helpers

```ts
// Validate before saving
assertValidPaymentTransition('processing', 'completed');    // ok
assertValidPaymentTransition('completed', 'processing');    // throws

// Branching on terminal states
if (isTerminalPaymentStatus(p.status)) return;

// Cross-entity mapping
const orderPaymentStatus = mapPaymentStatusToOrderPaymentStatus('completed');
// → 'paid'
```

See `src/fsm/` for the full transition graph.

## Design principles

1. **No `.passthrough()`** — schemas either reject unknown fields (requests)
   or strip them (responses). No silent forwarding.
2. **No `Record<string, any>`** — typed index signatures or discriminated unions only.
3. **No `as any`** — if the type-hole is worth keeping, declare it with a
   typed `unknown` + narrowing.
4. **Dates tolerated as string or Date** — services serialize differently;
   callers normalize on ingress.
5. **Branded IDs don't leak brands at runtime** — so you can still log / stringify / persist them.

## Version & release notes

**v2.0** (this release) — full rewrite. See `MIGRATION.md`.
**v1.x** — superseded; reserved only for legacy services that haven't migrated.

## Where to file issues

See the HANDOFF_FOR_DEVELOPER.md in the repo root for the wider architecture
context. For type-surface changes, open a PR editing `src/entities/` or
`src/schemas/` and update `MIGRATION.md` with a diff row.
