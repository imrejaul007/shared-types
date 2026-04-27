export type IntentStatus = 'ACTIVE' | 'DORMANT' | 'FULFILLED' | 'EXPIRED';
export type AppType = 'hotel_ota' | 'restaurant' | 'retail' | 'hotel_guest';
export type Category = 'TRAVEL' | 'DINING' | 'RETAIL' | 'HOTEL_SERVICE' | 'GENERAL';
export type EventType = 'search' | 'view' | 'wishlist' | 'cart_add' | 'hold' | 'checkout_start' | 'fulfilled' | 'abandoned';
export interface IntentSignalWeight {
    eventType: EventType;
    weight: number;
}
export declare const SIGNAL_WEIGHTS: Record<EventType, number>;
export declare const BASE_CONFIDENCE = 0.3;
export declare const DORMANCY_THRESHOLD_DAYS = 7;
export declare const CONFIDENCE_DORMANT_THRESHOLD = 0.3;
export interface Intent {
    id: string;
    userId: string;
    merchantId?: string;
    appType: AppType;
    category: Category;
    intentKey: string;
    intentQuery?: string;
    metadata?: Record<string, unknown>;
    confidence: number;
    status: IntentStatus;
    firstSeenAt: Date;
    lastSeenAt: Date;
}
export interface IntentSignal {
    id: string;
    intentId: string;
    eventType: EventType;
    weight: number;
    data?: Record<string, unknown>;
    capturedAt: Date;
}
export interface DormantIntent {
    id: string;
    intentId: string;
    userId: string;
    appType: AppType;
    category: Category;
    intentKey: string;
    dormancyScore: number;
    revivalScore: number;
    daysDormant: number;
    lastNudgeSent?: Date;
    nudgeCount: number;
    idealRevivalAt?: Date;
    status: 'active' | 'paused' | 'revived';
}
export interface IntentSequence {
    id: string;
    intentId: string;
    userId: string;
    eventType: EventType;
    sequenceOrder: number;
    durationMs?: number;
    occurredAt: Date;
}
export interface CrossAppIntentProfile {
    id: string;
    userId: string;
    travelIntentCount: number;
    diningIntentCount: number;
    retailIntentCount: number;
    dormantTravelCount: number;
    dormantDiningCount: number;
    dormantRetailCount: number;
    totalConversions: number;
    travelAffinity: number;
    diningAffinity: number;
    retailAffinity: number;
    updatedAt: Date;
}
export interface CaptureIntentParams {
    userId: string;
    appType: AppType;
    eventType: EventType;
    category: Category;
    intentKey: string;
    intentQuery?: string;
    metadata?: Record<string, unknown>;
}
export interface CaptureIntentResult {
    intent: Intent;
    signal: IntentSignal;
    isNew: boolean;
}
export interface ScoringContext {
    intentId: string;
    baseConfidence: number;
    signalCount: number;
    lastSignalAt?: Date;
    avgVelocity: number;
    metadata?: Record<string, unknown>;
}
export interface DormancyDetection {
    intentId: string;
    daysSinceLastActivity: number;
    currentConfidence: number;
    shouldMarkDormant: boolean;
}
export interface RevivalCandidate {
    dormantIntent: DormantIntent;
    intent: Intent;
    revivalScore: number;
    suggestedNudge?: string;
    idealTiming?: Date;
}
export interface EnrichedContext {
    activeIntents: Array<{
        category: Category;
        key: string;
        confidence: number;
        lastSeen: Date;
    }>;
    dormantIntents: Array<{
        category: Category;
        key: string;
        revivalScore: number;
        daysDormant: number;
    }>;
    suggestedNudges: Array<{
        intentKey: string;
        message: string;
        priority: 'high' | 'medium' | 'low';
    }>;
    crossAppProfile?: CrossAppIntentProfile;
}
export interface IntentToolResult {
    success: boolean;
    data?: unknown;
    error?: string;
}
import { z } from 'zod';
export declare const CaptureIntentSchema: z.ZodObject<{
    userId: z.ZodString;
    appType: z.ZodEnum<["hotel_ota", "restaurant", "retail", "hotel_guest"]>;
    eventType: z.ZodEnum<["search", "view", "wishlist", "cart_add", "hold", "checkout_start", "fulfilled", "abandoned"]>;
    category: z.ZodEnum<["TRAVEL", "DINING", "RETAIL", "HOTEL_SERVICE", "GENERAL"]>;
    intentKey: z.ZodString;
    intentQuery: z.ZodOptional<z.ZodString>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, "strip", z.ZodTypeAny, {
    userId: string;
    appType: "hotel_ota" | "restaurant" | "retail" | "hotel_guest";
    eventType: "search" | "view" | "wishlist" | "cart_add" | "hold" | "checkout_start" | "fulfilled" | "abandoned";
    category: "TRAVEL" | "DINING" | "RETAIL" | "HOTEL_SERVICE" | "GENERAL";
    intentKey: string;
    intentQuery?: string | undefined;
    metadata?: Record<string, unknown> | undefined;
}, {
    userId: string;
    appType: "hotel_ota" | "restaurant" | "retail" | "hotel_guest";
    eventType: "search" | "view" | "wishlist" | "cart_add" | "hold" | "checkout_start" | "fulfilled" | "abandoned";
    category: "TRAVEL" | "DINING" | "RETAIL" | "HOTEL_SERVICE" | "GENERAL";
    intentKey: string;
    intentQuery?: string | undefined;
    metadata?: Record<string, unknown> | undefined;
}>;
export declare const DormancyCheckSchema: z.ZodObject<{
    userId: z.ZodString;
    daysThreshold: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    userId: string;
    daysThreshold: number;
}, {
    userId: string;
    daysThreshold?: number | undefined;
}>;
export declare const RevivalTriggerSchema: z.ZodObject<{
    dormantIntentId: z.ZodString;
    triggerType: z.ZodEnum<["price_drop", "return_user", "seasonality", "offer_match", "manual"]>;
    triggerData: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, "strip", z.ZodTypeAny, {
    dormantIntentId: string;
    triggerType: "price_drop" | "return_user" | "seasonality" | "offer_match" | "manual";
    triggerData?: Record<string, unknown> | undefined;
}, {
    dormantIntentId: string;
    triggerType: "price_drop" | "return_user" | "seasonality" | "offer_match" | "manual";
    triggerData?: Record<string, unknown> | undefined;
}>;
//# sourceMappingURL=intent.d.ts.map