// ── Intent Graph Core Types ───────────────────────────────────────────────────
export const SIGNAL_WEIGHTS = {
    search: 0.15,
    view: 0.10,
    wishlist: 0.25,
    cart_add: 0.30,
    hold: 0.35,
    checkout_start: 0.40,
    fulfilled: 1.0,
    abandoned: -0.2,
};
export const BASE_CONFIDENCE = 0.3;
export const DORMANCY_THRESHOLD_DAYS = 7;
export const CONFIDENCE_DORMANT_THRESHOLD = 0.3;
// ── Zod Schemas for Validation ───────────────────────────────────────────────
import { z } from 'zod';
export const CaptureIntentSchema = z.object({
    userId: z.string().min(1),
    appType: z.enum(['hotel_ota', 'restaurant', 'retail', 'hotel_guest']),
    eventType: z.enum(['search', 'view', 'wishlist', 'cart_add', 'hold', 'checkout_start', 'fulfilled', 'abandoned']),
    category: z.enum(['TRAVEL', 'DINING', 'RETAIL', 'HOTEL_SERVICE', 'GENERAL']),
    intentKey: z.string().min(1),
    intentQuery: z.string().optional(),
    metadata: z.record(z.unknown()).optional(),
});
export const DormancyCheckSchema = z.object({
    userId: z.string().min(1),
    daysThreshold: z.number().min(1).default(7),
});
export const RevivalTriggerSchema = z.object({
    dormantIntentId: z.string().min(1),
    triggerType: z.enum(['price_drop', 'return_user', 'seasonality', 'offer_match', 'manual']),
    triggerData: z.record(z.unknown()).optional(),
});
//# sourceMappingURL=intent.js.map