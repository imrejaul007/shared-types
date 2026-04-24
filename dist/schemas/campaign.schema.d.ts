import { z } from 'zod';
export declare const CAMPAIGN_STATUS: z.ZodEnum<["draft", "scheduled", "sending", "sent", "pending_review", "active", "paused", "completed", "expired", "rejected", "failed", "cancelled"]>;
export declare const CAMPAIGN_CHANNEL: z.ZodEnum<["email", "sms", "push", "in_app", "whatsapp", "social", "web", "api"]>;
export declare const AudienceTargetingSchema: z.ZodObject<{
    segment: z.ZodOptional<z.ZodEnum<["all", "recent", "lapsed", "high_value", "stamp_card"]>>;
    daysInactive: z.ZodOptional<z.ZodNumber>;
    minSpend: z.ZodOptional<z.ZodNumber>;
    location: z.ZodOptional<z.ZodObject<{
        city: z.ZodOptional<z.ZodString>;
        area: z.ZodOptional<z.ZodString>;
        pincode: z.ZodOptional<z.ZodString>;
        radiusKm: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        city?: string | undefined;
        pincode?: string | undefined;
        area?: string | undefined;
        radiusKm?: number | undefined;
    }, {
        city?: string | undefined;
        pincode?: string | undefined;
        area?: string | undefined;
        radiusKm?: number | undefined;
    }>>;
    interests: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    institution: z.ZodOptional<z.ZodString>;
    keyword: z.ZodOptional<z.ZodString>;
    estimatedCount: z.ZodOptional<z.ZodNumber>;
}, "strict", z.ZodTypeAny, {
    segment?: "all" | "recent" | "lapsed" | "high_value" | "stamp_card" | undefined;
    daysInactive?: number | undefined;
    minSpend?: number | undefined;
    location?: {
        city?: string | undefined;
        pincode?: string | undefined;
        area?: string | undefined;
        radiusKm?: number | undefined;
    } | undefined;
    interests?: string[] | undefined;
    institution?: string | undefined;
    keyword?: string | undefined;
    estimatedCount?: number | undefined;
}, {
    segment?: "all" | "recent" | "lapsed" | "high_value" | "stamp_card" | undefined;
    daysInactive?: number | undefined;
    minSpend?: number | undefined;
    location?: {
        city?: string | undefined;
        pincode?: string | undefined;
        area?: string | undefined;
        radiusKm?: number | undefined;
    } | undefined;
    interests?: string[] | undefined;
    institution?: string | undefined;
    keyword?: string | undefined;
    estimatedCount?: number | undefined;
}>;
export declare const CampaignConditionSchema: z.ZodObject<{
    field: z.ZodString;
    operator: z.ZodEnum<["eq", "neq", "gt", "gte", "lt", "lte", "in", "not_in", "contains", "exists"]>;
    value: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean, z.ZodNull, z.ZodArray<z.ZodUnion<[z.ZodString, z.ZodNumber]>, "many">]>>;
}, "strict", z.ZodTypeAny, {
    operator: "eq" | "neq" | "gt" | "gte" | "lt" | "lte" | "in" | "not_in" | "contains" | "exists";
    field: string;
    value?: string | number | boolean | (string | number)[] | null | undefined;
}, {
    operator: "eq" | "neq" | "gt" | "gte" | "lt" | "lte" | "in" | "not_in" | "contains" | "exists";
    field: string;
    value?: string | number | boolean | (string | number)[] | null | undefined;
}>;
export declare const CampaignActionSchema: z.ZodObject<{
    kind: z.ZodEnum<["credit_coins", "grant_badge", "send_notification", "award_voucher", "issue_coupon"]>;
    params: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean, z.ZodNull, z.ZodArray<z.ZodString, "many">, z.ZodArray<z.ZodNumber, "many">]>>>;
}, "strict", z.ZodTypeAny, {
    kind: "credit_coins" | "grant_badge" | "send_notification" | "award_voucher" | "issue_coupon";
    params?: Record<string, string | number | boolean | string[] | number[] | null> | undefined;
}, {
    kind: "credit_coins" | "grant_badge" | "send_notification" | "award_voucher" | "issue_coupon";
    params?: Record<string, string | number | boolean | string[] | number[] | null> | undefined;
}>;
export declare const CampaignTriggerSchema: z.ZodObject<{
    event: z.ZodEnum<["order.placed", "order.delivered", "visit.completed", "signup", "referral.invite", "cron", "manual"]>;
    filters: z.ZodOptional<z.ZodArray<z.ZodObject<{
        field: z.ZodString;
        operator: z.ZodEnum<["eq", "neq", "gt", "gte", "lt", "lte", "in", "not_in", "contains", "exists"]>;
        value: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean, z.ZodNull, z.ZodArray<z.ZodUnion<[z.ZodString, z.ZodNumber]>, "many">]>>;
    }, "strict", z.ZodTypeAny, {
        operator: "eq" | "neq" | "gt" | "gte" | "lt" | "lte" | "in" | "not_in" | "contains" | "exists";
        field: string;
        value?: string | number | boolean | (string | number)[] | null | undefined;
    }, {
        operator: "eq" | "neq" | "gt" | "gte" | "lt" | "lte" | "in" | "not_in" | "contains" | "exists";
        field: string;
        value?: string | number | boolean | (string | number)[] | null | undefined;
    }>, "many">>;
}, "strict", z.ZodTypeAny, {
    event: "manual" | "signup" | "order.placed" | "order.delivered" | "visit.completed" | "referral.invite" | "cron";
    filters?: {
        operator: "eq" | "neq" | "gt" | "gte" | "lt" | "lte" | "in" | "not_in" | "contains" | "exists";
        field: string;
        value?: string | number | boolean | (string | number)[] | null | undefined;
    }[] | undefined;
}, {
    event: "manual" | "signup" | "order.placed" | "order.delivered" | "visit.completed" | "referral.invite" | "cron";
    filters?: {
        operator: "eq" | "neq" | "gt" | "gte" | "lt" | "lte" | "in" | "not_in" | "contains" | "exists";
        field: string;
        value?: string | number | boolean | (string | number)[] | null | undefined;
    }[] | undefined;
}>;
export declare const BaseCampaignSchema: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    status: z.ZodEnum<["draft", "scheduled", "sending", "sent", "pending_review", "active", "paused", "completed", "expired", "rejected", "failed", "cancelled"]>;
    startDate: z.ZodUnion<[z.ZodDate, z.ZodString]>;
    endDate: z.ZodOptional<z.ZodUnion<[z.ZodDate, z.ZodString]>>;
    channel: z.ZodOptional<z.ZodEnum<["email", "sms", "push", "in_app", "whatsapp", "social", "web", "api"]>>;
    targetAudience: z.ZodOptional<z.ZodObject<{
        segment: z.ZodOptional<z.ZodEnum<["all", "recent", "lapsed", "high_value", "stamp_card"]>>;
        daysInactive: z.ZodOptional<z.ZodNumber>;
        minSpend: z.ZodOptional<z.ZodNumber>;
        location: z.ZodOptional<z.ZodObject<{
            city: z.ZodOptional<z.ZodString>;
            area: z.ZodOptional<z.ZodString>;
            pincode: z.ZodOptional<z.ZodString>;
            radiusKm: z.ZodOptional<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            city?: string | undefined;
            pincode?: string | undefined;
            area?: string | undefined;
            radiusKm?: number | undefined;
        }, {
            city?: string | undefined;
            pincode?: string | undefined;
            area?: string | undefined;
            radiusKm?: number | undefined;
        }>>;
        interests: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        institution: z.ZodOptional<z.ZodString>;
        keyword: z.ZodOptional<z.ZodString>;
        estimatedCount: z.ZodOptional<z.ZodNumber>;
    }, "strict", z.ZodTypeAny, {
        segment?: "all" | "recent" | "lapsed" | "high_value" | "stamp_card" | undefined;
        daysInactive?: number | undefined;
        minSpend?: number | undefined;
        location?: {
            city?: string | undefined;
            pincode?: string | undefined;
            area?: string | undefined;
            radiusKm?: number | undefined;
        } | undefined;
        interests?: string[] | undefined;
        institution?: string | undefined;
        keyword?: string | undefined;
        estimatedCount?: number | undefined;
    }, {
        segment?: "all" | "recent" | "lapsed" | "high_value" | "stamp_card" | undefined;
        daysInactive?: number | undefined;
        minSpend?: number | undefined;
        location?: {
            city?: string | undefined;
            pincode?: string | undefined;
            area?: string | undefined;
            radiusKm?: number | undefined;
        } | undefined;
        interests?: string[] | undefined;
        institution?: string | undefined;
        keyword?: string | undefined;
        estimatedCount?: number | undefined;
    }>>;
    budget: z.ZodOptional<z.ZodNumber>;
    spent: z.ZodOptional<z.ZodNumber>;
    createdBy: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    status: "cancelled" | "completed" | "failed" | "expired" | "draft" | "scheduled" | "sending" | "sent" | "pending_review" | "active" | "paused" | "rejected";
    name: string;
    startDate: string | Date;
    spent?: number | undefined;
    description?: string | undefined;
    endDate?: string | Date | undefined;
    channel?: "email" | "sms" | "push" | "in_app" | "whatsapp" | "social" | "web" | "api" | undefined;
    targetAudience?: {
        segment?: "all" | "recent" | "lapsed" | "high_value" | "stamp_card" | undefined;
        daysInactive?: number | undefined;
        minSpend?: number | undefined;
        location?: {
            city?: string | undefined;
            pincode?: string | undefined;
            area?: string | undefined;
            radiusKm?: number | undefined;
        } | undefined;
        interests?: string[] | undefined;
        institution?: string | undefined;
        keyword?: string | undefined;
        estimatedCount?: number | undefined;
    } | undefined;
    budget?: number | undefined;
    createdBy?: string | undefined;
}, {
    status: "cancelled" | "completed" | "failed" | "expired" | "draft" | "scheduled" | "sending" | "sent" | "pending_review" | "active" | "paused" | "rejected";
    name: string;
    startDate: string | Date;
    spent?: number | undefined;
    description?: string | undefined;
    endDate?: string | Date | undefined;
    channel?: "email" | "sms" | "push" | "in_app" | "whatsapp" | "social" | "web" | "api" | undefined;
    targetAudience?: {
        segment?: "all" | "recent" | "lapsed" | "high_value" | "stamp_card" | undefined;
        daysInactive?: number | undefined;
        minSpend?: number | undefined;
        location?: {
            city?: string | undefined;
            pincode?: string | undefined;
            area?: string | undefined;
            radiusKm?: number | undefined;
        } | undefined;
        interests?: string[] | undefined;
        institution?: string | undefined;
        keyword?: string | undefined;
        estimatedCount?: number | undefined;
    } | undefined;
    budget?: number | undefined;
    createdBy?: string | undefined;
}>;
export declare const CreateMarketingCampaignSchema: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    status: z.ZodEnum<["draft", "scheduled", "sending", "sent", "pending_review", "active", "paused", "completed", "expired", "rejected", "failed", "cancelled"]>;
    startDate: z.ZodUnion<[z.ZodDate, z.ZodString]>;
    endDate: z.ZodOptional<z.ZodUnion<[z.ZodDate, z.ZodString]>>;
    channel: z.ZodOptional<z.ZodEnum<["email", "sms", "push", "in_app", "whatsapp", "social", "web", "api"]>>;
    targetAudience: z.ZodOptional<z.ZodObject<{
        segment: z.ZodOptional<z.ZodEnum<["all", "recent", "lapsed", "high_value", "stamp_card"]>>;
        daysInactive: z.ZodOptional<z.ZodNumber>;
        minSpend: z.ZodOptional<z.ZodNumber>;
        location: z.ZodOptional<z.ZodObject<{
            city: z.ZodOptional<z.ZodString>;
            area: z.ZodOptional<z.ZodString>;
            pincode: z.ZodOptional<z.ZodString>;
            radiusKm: z.ZodOptional<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            city?: string | undefined;
            pincode?: string | undefined;
            area?: string | undefined;
            radiusKm?: number | undefined;
        }, {
            city?: string | undefined;
            pincode?: string | undefined;
            area?: string | undefined;
            radiusKm?: number | undefined;
        }>>;
        interests: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        institution: z.ZodOptional<z.ZodString>;
        keyword: z.ZodOptional<z.ZodString>;
        estimatedCount: z.ZodOptional<z.ZodNumber>;
    }, "strict", z.ZodTypeAny, {
        segment?: "all" | "recent" | "lapsed" | "high_value" | "stamp_card" | undefined;
        daysInactive?: number | undefined;
        minSpend?: number | undefined;
        location?: {
            city?: string | undefined;
            pincode?: string | undefined;
            area?: string | undefined;
            radiusKm?: number | undefined;
        } | undefined;
        interests?: string[] | undefined;
        institution?: string | undefined;
        keyword?: string | undefined;
        estimatedCount?: number | undefined;
    }, {
        segment?: "all" | "recent" | "lapsed" | "high_value" | "stamp_card" | undefined;
        daysInactive?: number | undefined;
        minSpend?: number | undefined;
        location?: {
            city?: string | undefined;
            pincode?: string | undefined;
            area?: string | undefined;
            radiusKm?: number | undefined;
        } | undefined;
        interests?: string[] | undefined;
        institution?: string | undefined;
        keyword?: string | undefined;
        estimatedCount?: number | undefined;
    }>>;
    budget: z.ZodOptional<z.ZodNumber>;
    spent: z.ZodOptional<z.ZodNumber>;
    createdBy: z.ZodOptional<z.ZodString>;
} & {
    type: z.ZodOptional<z.ZodLiteral<"marketing">>;
    merchantId: z.ZodOptional<z.ZodString>;
    objective: z.ZodOptional<z.ZodEnum<["awareness", "engagement", "sales", "win_back"]>>;
    message: z.ZodOptional<z.ZodString>;
    templateName: z.ZodOptional<z.ZodString>;
    imageUrl: z.ZodOptional<z.ZodString>;
    ctaUrl: z.ZodOptional<z.ZodString>;
    ctaText: z.ZodOptional<z.ZodString>;
    audience: z.ZodOptional<z.ZodObject<{
        segment: z.ZodOptional<z.ZodEnum<["all", "recent", "lapsed", "high_value", "stamp_card"]>>;
        daysInactive: z.ZodOptional<z.ZodNumber>;
        minSpend: z.ZodOptional<z.ZodNumber>;
        location: z.ZodOptional<z.ZodObject<{
            city: z.ZodOptional<z.ZodString>;
            area: z.ZodOptional<z.ZodString>;
            pincode: z.ZodOptional<z.ZodString>;
            radiusKm: z.ZodOptional<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            city?: string | undefined;
            pincode?: string | undefined;
            area?: string | undefined;
            radiusKm?: number | undefined;
        }, {
            city?: string | undefined;
            pincode?: string | undefined;
            area?: string | undefined;
            radiusKm?: number | undefined;
        }>>;
        interests: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        institution: z.ZodOptional<z.ZodString>;
        keyword: z.ZodOptional<z.ZodString>;
        estimatedCount: z.ZodOptional<z.ZodNumber>;
    }, "strict", z.ZodTypeAny, {
        segment?: "all" | "recent" | "lapsed" | "high_value" | "stamp_card" | undefined;
        daysInactive?: number | undefined;
        minSpend?: number | undefined;
        location?: {
            city?: string | undefined;
            pincode?: string | undefined;
            area?: string | undefined;
            radiusKm?: number | undefined;
        } | undefined;
        interests?: string[] | undefined;
        institution?: string | undefined;
        keyword?: string | undefined;
        estimatedCount?: number | undefined;
    }, {
        segment?: "all" | "recent" | "lapsed" | "high_value" | "stamp_card" | undefined;
        daysInactive?: number | undefined;
        minSpend?: number | undefined;
        location?: {
            city?: string | undefined;
            pincode?: string | undefined;
            area?: string | undefined;
            radiusKm?: number | undefined;
        } | undefined;
        interests?: string[] | undefined;
        institution?: string | undefined;
        keyword?: string | undefined;
        estimatedCount?: number | undefined;
    }>>;
    scheduledAt: z.ZodOptional<z.ZodUnion<[z.ZodDate, z.ZodString]>>;
    dailyBudget: z.ZodOptional<z.ZodNumber>;
    attributionWindowDays: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    status: "cancelled" | "completed" | "failed" | "expired" | "draft" | "scheduled" | "sending" | "sent" | "pending_review" | "active" | "paused" | "rejected";
    name: string;
    startDate: string | Date;
    spent?: number | undefined;
    merchantId?: string | undefined;
    ctaText?: string | undefined;
    imageUrl?: string | undefined;
    message?: string | undefined;
    type?: "marketing" | undefined;
    description?: string | undefined;
    endDate?: string | Date | undefined;
    channel?: "email" | "sms" | "push" | "in_app" | "whatsapp" | "social" | "web" | "api" | undefined;
    targetAudience?: {
        segment?: "all" | "recent" | "lapsed" | "high_value" | "stamp_card" | undefined;
        daysInactive?: number | undefined;
        minSpend?: number | undefined;
        location?: {
            city?: string | undefined;
            pincode?: string | undefined;
            area?: string | undefined;
            radiusKm?: number | undefined;
        } | undefined;
        interests?: string[] | undefined;
        institution?: string | undefined;
        keyword?: string | undefined;
        estimatedCount?: number | undefined;
    } | undefined;
    budget?: number | undefined;
    createdBy?: string | undefined;
    objective?: "awareness" | "engagement" | "sales" | "win_back" | undefined;
    templateName?: string | undefined;
    ctaUrl?: string | undefined;
    audience?: {
        segment?: "all" | "recent" | "lapsed" | "high_value" | "stamp_card" | undefined;
        daysInactive?: number | undefined;
        minSpend?: number | undefined;
        location?: {
            city?: string | undefined;
            pincode?: string | undefined;
            area?: string | undefined;
            radiusKm?: number | undefined;
        } | undefined;
        interests?: string[] | undefined;
        institution?: string | undefined;
        keyword?: string | undefined;
        estimatedCount?: number | undefined;
    } | undefined;
    scheduledAt?: string | Date | undefined;
    dailyBudget?: number | undefined;
    attributionWindowDays?: number | undefined;
}, {
    status: "cancelled" | "completed" | "failed" | "expired" | "draft" | "scheduled" | "sending" | "sent" | "pending_review" | "active" | "paused" | "rejected";
    name: string;
    startDate: string | Date;
    spent?: number | undefined;
    merchantId?: string | undefined;
    ctaText?: string | undefined;
    imageUrl?: string | undefined;
    message?: string | undefined;
    type?: "marketing" | undefined;
    description?: string | undefined;
    endDate?: string | Date | undefined;
    channel?: "email" | "sms" | "push" | "in_app" | "whatsapp" | "social" | "web" | "api" | undefined;
    targetAudience?: {
        segment?: "all" | "recent" | "lapsed" | "high_value" | "stamp_card" | undefined;
        daysInactive?: number | undefined;
        minSpend?: number | undefined;
        location?: {
            city?: string | undefined;
            pincode?: string | undefined;
            area?: string | undefined;
            radiusKm?: number | undefined;
        } | undefined;
        interests?: string[] | undefined;
        institution?: string | undefined;
        keyword?: string | undefined;
        estimatedCount?: number | undefined;
    } | undefined;
    budget?: number | undefined;
    createdBy?: string | undefined;
    objective?: "awareness" | "engagement" | "sales" | "win_back" | undefined;
    templateName?: string | undefined;
    ctaUrl?: string | undefined;
    audience?: {
        segment?: "all" | "recent" | "lapsed" | "high_value" | "stamp_card" | undefined;
        daysInactive?: number | undefined;
        minSpend?: number | undefined;
        location?: {
            city?: string | undefined;
            pincode?: string | undefined;
            area?: string | undefined;
            radiusKm?: number | undefined;
        } | undefined;
        interests?: string[] | undefined;
        institution?: string | undefined;
        keyword?: string | undefined;
        estimatedCount?: number | undefined;
    } | undefined;
    scheduledAt?: string | Date | undefined;
    dailyBudget?: number | undefined;
    attributionWindowDays?: number | undefined;
}>;
export declare const UpdateMarketingCampaignSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    status: z.ZodOptional<z.ZodEnum<["draft", "scheduled", "sending", "sent", "pending_review", "active", "paused", "completed", "expired", "rejected", "failed", "cancelled"]>>;
    startDate: z.ZodOptional<z.ZodUnion<[z.ZodDate, z.ZodString]>>;
    endDate: z.ZodOptional<z.ZodOptional<z.ZodUnion<[z.ZodDate, z.ZodString]>>>;
    channel: z.ZodOptional<z.ZodOptional<z.ZodEnum<["email", "sms", "push", "in_app", "whatsapp", "social", "web", "api"]>>>;
    targetAudience: z.ZodOptional<z.ZodOptional<z.ZodObject<{
        segment: z.ZodOptional<z.ZodEnum<["all", "recent", "lapsed", "high_value", "stamp_card"]>>;
        daysInactive: z.ZodOptional<z.ZodNumber>;
        minSpend: z.ZodOptional<z.ZodNumber>;
        location: z.ZodOptional<z.ZodObject<{
            city: z.ZodOptional<z.ZodString>;
            area: z.ZodOptional<z.ZodString>;
            pincode: z.ZodOptional<z.ZodString>;
            radiusKm: z.ZodOptional<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            city?: string | undefined;
            pincode?: string | undefined;
            area?: string | undefined;
            radiusKm?: number | undefined;
        }, {
            city?: string | undefined;
            pincode?: string | undefined;
            area?: string | undefined;
            radiusKm?: number | undefined;
        }>>;
        interests: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        institution: z.ZodOptional<z.ZodString>;
        keyword: z.ZodOptional<z.ZodString>;
        estimatedCount: z.ZodOptional<z.ZodNumber>;
    }, "strict", z.ZodTypeAny, {
        segment?: "all" | "recent" | "lapsed" | "high_value" | "stamp_card" | undefined;
        daysInactive?: number | undefined;
        minSpend?: number | undefined;
        location?: {
            city?: string | undefined;
            pincode?: string | undefined;
            area?: string | undefined;
            radiusKm?: number | undefined;
        } | undefined;
        interests?: string[] | undefined;
        institution?: string | undefined;
        keyword?: string | undefined;
        estimatedCount?: number | undefined;
    }, {
        segment?: "all" | "recent" | "lapsed" | "high_value" | "stamp_card" | undefined;
        daysInactive?: number | undefined;
        minSpend?: number | undefined;
        location?: {
            city?: string | undefined;
            pincode?: string | undefined;
            area?: string | undefined;
            radiusKm?: number | undefined;
        } | undefined;
        interests?: string[] | undefined;
        institution?: string | undefined;
        keyword?: string | undefined;
        estimatedCount?: number | undefined;
    }>>>;
    budget: z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
    spent: z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
    createdBy: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    type: z.ZodOptional<z.ZodOptional<z.ZodLiteral<"marketing">>>;
    merchantId: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    objective: z.ZodOptional<z.ZodOptional<z.ZodEnum<["awareness", "engagement", "sales", "win_back"]>>>;
    message: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    templateName: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    imageUrl: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    ctaUrl: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    ctaText: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    audience: z.ZodOptional<z.ZodOptional<z.ZodObject<{
        segment: z.ZodOptional<z.ZodEnum<["all", "recent", "lapsed", "high_value", "stamp_card"]>>;
        daysInactive: z.ZodOptional<z.ZodNumber>;
        minSpend: z.ZodOptional<z.ZodNumber>;
        location: z.ZodOptional<z.ZodObject<{
            city: z.ZodOptional<z.ZodString>;
            area: z.ZodOptional<z.ZodString>;
            pincode: z.ZodOptional<z.ZodString>;
            radiusKm: z.ZodOptional<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            city?: string | undefined;
            pincode?: string | undefined;
            area?: string | undefined;
            radiusKm?: number | undefined;
        }, {
            city?: string | undefined;
            pincode?: string | undefined;
            area?: string | undefined;
            radiusKm?: number | undefined;
        }>>;
        interests: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        institution: z.ZodOptional<z.ZodString>;
        keyword: z.ZodOptional<z.ZodString>;
        estimatedCount: z.ZodOptional<z.ZodNumber>;
    }, "strict", z.ZodTypeAny, {
        segment?: "all" | "recent" | "lapsed" | "high_value" | "stamp_card" | undefined;
        daysInactive?: number | undefined;
        minSpend?: number | undefined;
        location?: {
            city?: string | undefined;
            pincode?: string | undefined;
            area?: string | undefined;
            radiusKm?: number | undefined;
        } | undefined;
        interests?: string[] | undefined;
        institution?: string | undefined;
        keyword?: string | undefined;
        estimatedCount?: number | undefined;
    }, {
        segment?: "all" | "recent" | "lapsed" | "high_value" | "stamp_card" | undefined;
        daysInactive?: number | undefined;
        minSpend?: number | undefined;
        location?: {
            city?: string | undefined;
            pincode?: string | undefined;
            area?: string | undefined;
            radiusKm?: number | undefined;
        } | undefined;
        interests?: string[] | undefined;
        institution?: string | undefined;
        keyword?: string | undefined;
        estimatedCount?: number | undefined;
    }>>>;
    scheduledAt: z.ZodOptional<z.ZodOptional<z.ZodUnion<[z.ZodDate, z.ZodString]>>>;
    dailyBudget: z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
    attributionWindowDays: z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
}, "strip", z.ZodTypeAny, {
    spent?: number | undefined;
    merchantId?: string | undefined;
    ctaText?: string | undefined;
    imageUrl?: string | undefined;
    status?: "cancelled" | "completed" | "failed" | "expired" | "draft" | "scheduled" | "sending" | "sent" | "pending_review" | "active" | "paused" | "rejected" | undefined;
    name?: string | undefined;
    message?: string | undefined;
    type?: "marketing" | undefined;
    description?: string | undefined;
    startDate?: string | Date | undefined;
    endDate?: string | Date | undefined;
    channel?: "email" | "sms" | "push" | "in_app" | "whatsapp" | "social" | "web" | "api" | undefined;
    targetAudience?: {
        segment?: "all" | "recent" | "lapsed" | "high_value" | "stamp_card" | undefined;
        daysInactive?: number | undefined;
        minSpend?: number | undefined;
        location?: {
            city?: string | undefined;
            pincode?: string | undefined;
            area?: string | undefined;
            radiusKm?: number | undefined;
        } | undefined;
        interests?: string[] | undefined;
        institution?: string | undefined;
        keyword?: string | undefined;
        estimatedCount?: number | undefined;
    } | undefined;
    budget?: number | undefined;
    createdBy?: string | undefined;
    objective?: "awareness" | "engagement" | "sales" | "win_back" | undefined;
    templateName?: string | undefined;
    ctaUrl?: string | undefined;
    audience?: {
        segment?: "all" | "recent" | "lapsed" | "high_value" | "stamp_card" | undefined;
        daysInactive?: number | undefined;
        minSpend?: number | undefined;
        location?: {
            city?: string | undefined;
            pincode?: string | undefined;
            area?: string | undefined;
            radiusKm?: number | undefined;
        } | undefined;
        interests?: string[] | undefined;
        institution?: string | undefined;
        keyword?: string | undefined;
        estimatedCount?: number | undefined;
    } | undefined;
    scheduledAt?: string | Date | undefined;
    dailyBudget?: number | undefined;
    attributionWindowDays?: number | undefined;
}, {
    spent?: number | undefined;
    merchantId?: string | undefined;
    ctaText?: string | undefined;
    imageUrl?: string | undefined;
    status?: "cancelled" | "completed" | "failed" | "expired" | "draft" | "scheduled" | "sending" | "sent" | "pending_review" | "active" | "paused" | "rejected" | undefined;
    name?: string | undefined;
    message?: string | undefined;
    type?: "marketing" | undefined;
    description?: string | undefined;
    startDate?: string | Date | undefined;
    endDate?: string | Date | undefined;
    channel?: "email" | "sms" | "push" | "in_app" | "whatsapp" | "social" | "web" | "api" | undefined;
    targetAudience?: {
        segment?: "all" | "recent" | "lapsed" | "high_value" | "stamp_card" | undefined;
        daysInactive?: number | undefined;
        minSpend?: number | undefined;
        location?: {
            city?: string | undefined;
            pincode?: string | undefined;
            area?: string | undefined;
            radiusKm?: number | undefined;
        } | undefined;
        interests?: string[] | undefined;
        institution?: string | undefined;
        keyword?: string | undefined;
        estimatedCount?: number | undefined;
    } | undefined;
    budget?: number | undefined;
    createdBy?: string | undefined;
    objective?: "awareness" | "engagement" | "sales" | "win_back" | undefined;
    templateName?: string | undefined;
    ctaUrl?: string | undefined;
    audience?: {
        segment?: "all" | "recent" | "lapsed" | "high_value" | "stamp_card" | undefined;
        daysInactive?: number | undefined;
        minSpend?: number | undefined;
        location?: {
            city?: string | undefined;
            pincode?: string | undefined;
            area?: string | undefined;
            radiusKm?: number | undefined;
        } | undefined;
        interests?: string[] | undefined;
        institution?: string | undefined;
        keyword?: string | undefined;
        estimatedCount?: number | undefined;
    } | undefined;
    scheduledAt?: string | Date | undefined;
    dailyBudget?: number | undefined;
    attributionWindowDays?: number | undefined;
}>;
export declare const MarketingCampaignResponseSchema: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    status: z.ZodEnum<["draft", "scheduled", "sending", "sent", "pending_review", "active", "paused", "completed", "expired", "rejected", "failed", "cancelled"]>;
    startDate: z.ZodUnion<[z.ZodDate, z.ZodString]>;
    endDate: z.ZodOptional<z.ZodUnion<[z.ZodDate, z.ZodString]>>;
    channel: z.ZodOptional<z.ZodEnum<["email", "sms", "push", "in_app", "whatsapp", "social", "web", "api"]>>;
    targetAudience: z.ZodOptional<z.ZodObject<{
        segment: z.ZodOptional<z.ZodEnum<["all", "recent", "lapsed", "high_value", "stamp_card"]>>;
        daysInactive: z.ZodOptional<z.ZodNumber>;
        minSpend: z.ZodOptional<z.ZodNumber>;
        location: z.ZodOptional<z.ZodObject<{
            city: z.ZodOptional<z.ZodString>;
            area: z.ZodOptional<z.ZodString>;
            pincode: z.ZodOptional<z.ZodString>;
            radiusKm: z.ZodOptional<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            city?: string | undefined;
            pincode?: string | undefined;
            area?: string | undefined;
            radiusKm?: number | undefined;
        }, {
            city?: string | undefined;
            pincode?: string | undefined;
            area?: string | undefined;
            radiusKm?: number | undefined;
        }>>;
        interests: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        institution: z.ZodOptional<z.ZodString>;
        keyword: z.ZodOptional<z.ZodString>;
        estimatedCount: z.ZodOptional<z.ZodNumber>;
    }, "strict", z.ZodTypeAny, {
        segment?: "all" | "recent" | "lapsed" | "high_value" | "stamp_card" | undefined;
        daysInactive?: number | undefined;
        minSpend?: number | undefined;
        location?: {
            city?: string | undefined;
            pincode?: string | undefined;
            area?: string | undefined;
            radiusKm?: number | undefined;
        } | undefined;
        interests?: string[] | undefined;
        institution?: string | undefined;
        keyword?: string | undefined;
        estimatedCount?: number | undefined;
    }, {
        segment?: "all" | "recent" | "lapsed" | "high_value" | "stamp_card" | undefined;
        daysInactive?: number | undefined;
        minSpend?: number | undefined;
        location?: {
            city?: string | undefined;
            pincode?: string | undefined;
            area?: string | undefined;
            radiusKm?: number | undefined;
        } | undefined;
        interests?: string[] | undefined;
        institution?: string | undefined;
        keyword?: string | undefined;
        estimatedCount?: number | undefined;
    }>>;
    budget: z.ZodOptional<z.ZodNumber>;
    spent: z.ZodOptional<z.ZodNumber>;
    createdBy: z.ZodOptional<z.ZodString>;
} & {
    type: z.ZodOptional<z.ZodLiteral<"marketing">>;
    merchantId: z.ZodOptional<z.ZodString>;
    objective: z.ZodOptional<z.ZodEnum<["awareness", "engagement", "sales", "win_back"]>>;
    message: z.ZodOptional<z.ZodString>;
    templateName: z.ZodOptional<z.ZodString>;
    imageUrl: z.ZodOptional<z.ZodString>;
    ctaUrl: z.ZodOptional<z.ZodString>;
    ctaText: z.ZodOptional<z.ZodString>;
    audience: z.ZodOptional<z.ZodObject<{
        segment: z.ZodOptional<z.ZodEnum<["all", "recent", "lapsed", "high_value", "stamp_card"]>>;
        daysInactive: z.ZodOptional<z.ZodNumber>;
        minSpend: z.ZodOptional<z.ZodNumber>;
        location: z.ZodOptional<z.ZodObject<{
            city: z.ZodOptional<z.ZodString>;
            area: z.ZodOptional<z.ZodString>;
            pincode: z.ZodOptional<z.ZodString>;
            radiusKm: z.ZodOptional<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            city?: string | undefined;
            pincode?: string | undefined;
            area?: string | undefined;
            radiusKm?: number | undefined;
        }, {
            city?: string | undefined;
            pincode?: string | undefined;
            area?: string | undefined;
            radiusKm?: number | undefined;
        }>>;
        interests: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        institution: z.ZodOptional<z.ZodString>;
        keyword: z.ZodOptional<z.ZodString>;
        estimatedCount: z.ZodOptional<z.ZodNumber>;
    }, "strict", z.ZodTypeAny, {
        segment?: "all" | "recent" | "lapsed" | "high_value" | "stamp_card" | undefined;
        daysInactive?: number | undefined;
        minSpend?: number | undefined;
        location?: {
            city?: string | undefined;
            pincode?: string | undefined;
            area?: string | undefined;
            radiusKm?: number | undefined;
        } | undefined;
        interests?: string[] | undefined;
        institution?: string | undefined;
        keyword?: string | undefined;
        estimatedCount?: number | undefined;
    }, {
        segment?: "all" | "recent" | "lapsed" | "high_value" | "stamp_card" | undefined;
        daysInactive?: number | undefined;
        minSpend?: number | undefined;
        location?: {
            city?: string | undefined;
            pincode?: string | undefined;
            area?: string | undefined;
            radiusKm?: number | undefined;
        } | undefined;
        interests?: string[] | undefined;
        institution?: string | undefined;
        keyword?: string | undefined;
        estimatedCount?: number | undefined;
    }>>;
    scheduledAt: z.ZodOptional<z.ZodUnion<[z.ZodDate, z.ZodString]>>;
    dailyBudget: z.ZodOptional<z.ZodNumber>;
    attributionWindowDays: z.ZodOptional<z.ZodNumber>;
} & {
    _id: z.ZodOptional<z.ZodString>;
    sentAt: z.ZodOptional<z.ZodUnion<[z.ZodDate, z.ZodString]>>;
    stats: z.ZodOptional<z.ZodObject<{
        sent: z.ZodOptional<z.ZodNumber>;
        delivered: z.ZodOptional<z.ZodNumber>;
        failed: z.ZodOptional<z.ZodNumber>;
        deduped: z.ZodOptional<z.ZodNumber>;
        opened: z.ZodOptional<z.ZodNumber>;
        clicked: z.ZodOptional<z.ZodNumber>;
        converted: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        delivered?: number | undefined;
        failed?: number | undefined;
        sent?: number | undefined;
        deduped?: number | undefined;
        opened?: number | undefined;
        clicked?: number | undefined;
        converted?: number | undefined;
    }, {
        delivered?: number | undefined;
        failed?: number | undefined;
        sent?: number | undefined;
        deduped?: number | undefined;
        opened?: number | undefined;
        clicked?: number | undefined;
        converted?: number | undefined;
    }>>;
    errorMessage: z.ZodOptional<z.ZodString>;
    totalSpent: z.ZodOptional<z.ZodNumber>;
    createdAt: z.ZodOptional<z.ZodUnion<[z.ZodDate, z.ZodString]>>;
    updatedAt: z.ZodOptional<z.ZodUnion<[z.ZodDate, z.ZodString]>>;
}, "strip", z.ZodTypeAny, {
    status: "cancelled" | "completed" | "failed" | "expired" | "draft" | "scheduled" | "sending" | "sent" | "pending_review" | "active" | "paused" | "rejected";
    name: string;
    startDate: string | Date;
    spent?: number | undefined;
    merchantId?: string | undefined;
    ctaText?: string | undefined;
    imageUrl?: string | undefined;
    message?: string | undefined;
    type?: "marketing" | undefined;
    _id?: string | undefined;
    createdAt?: string | Date | undefined;
    updatedAt?: string | Date | undefined;
    description?: string | undefined;
    endDate?: string | Date | undefined;
    channel?: "email" | "sms" | "push" | "in_app" | "whatsapp" | "social" | "web" | "api" | undefined;
    targetAudience?: {
        segment?: "all" | "recent" | "lapsed" | "high_value" | "stamp_card" | undefined;
        daysInactive?: number | undefined;
        minSpend?: number | undefined;
        location?: {
            city?: string | undefined;
            pincode?: string | undefined;
            area?: string | undefined;
            radiusKm?: number | undefined;
        } | undefined;
        interests?: string[] | undefined;
        institution?: string | undefined;
        keyword?: string | undefined;
        estimatedCount?: number | undefined;
    } | undefined;
    budget?: number | undefined;
    createdBy?: string | undefined;
    objective?: "awareness" | "engagement" | "sales" | "win_back" | undefined;
    templateName?: string | undefined;
    ctaUrl?: string | undefined;
    audience?: {
        segment?: "all" | "recent" | "lapsed" | "high_value" | "stamp_card" | undefined;
        daysInactive?: number | undefined;
        minSpend?: number | undefined;
        location?: {
            city?: string | undefined;
            pincode?: string | undefined;
            area?: string | undefined;
            radiusKm?: number | undefined;
        } | undefined;
        interests?: string[] | undefined;
        institution?: string | undefined;
        keyword?: string | undefined;
        estimatedCount?: number | undefined;
    } | undefined;
    scheduledAt?: string | Date | undefined;
    dailyBudget?: number | undefined;
    attributionWindowDays?: number | undefined;
    sentAt?: string | Date | undefined;
    stats?: {
        delivered?: number | undefined;
        failed?: number | undefined;
        sent?: number | undefined;
        deduped?: number | undefined;
        opened?: number | undefined;
        clicked?: number | undefined;
        converted?: number | undefined;
    } | undefined;
    errorMessage?: string | undefined;
    totalSpent?: number | undefined;
}, {
    status: "cancelled" | "completed" | "failed" | "expired" | "draft" | "scheduled" | "sending" | "sent" | "pending_review" | "active" | "paused" | "rejected";
    name: string;
    startDate: string | Date;
    spent?: number | undefined;
    merchantId?: string | undefined;
    ctaText?: string | undefined;
    imageUrl?: string | undefined;
    message?: string | undefined;
    type?: "marketing" | undefined;
    _id?: string | undefined;
    createdAt?: string | Date | undefined;
    updatedAt?: string | Date | undefined;
    description?: string | undefined;
    endDate?: string | Date | undefined;
    channel?: "email" | "sms" | "push" | "in_app" | "whatsapp" | "social" | "web" | "api" | undefined;
    targetAudience?: {
        segment?: "all" | "recent" | "lapsed" | "high_value" | "stamp_card" | undefined;
        daysInactive?: number | undefined;
        minSpend?: number | undefined;
        location?: {
            city?: string | undefined;
            pincode?: string | undefined;
            area?: string | undefined;
            radiusKm?: number | undefined;
        } | undefined;
        interests?: string[] | undefined;
        institution?: string | undefined;
        keyword?: string | undefined;
        estimatedCount?: number | undefined;
    } | undefined;
    budget?: number | undefined;
    createdBy?: string | undefined;
    objective?: "awareness" | "engagement" | "sales" | "win_back" | undefined;
    templateName?: string | undefined;
    ctaUrl?: string | undefined;
    audience?: {
        segment?: "all" | "recent" | "lapsed" | "high_value" | "stamp_card" | undefined;
        daysInactive?: number | undefined;
        minSpend?: number | undefined;
        location?: {
            city?: string | undefined;
            pincode?: string | undefined;
            area?: string | undefined;
            radiusKm?: number | undefined;
        } | undefined;
        interests?: string[] | undefined;
        institution?: string | undefined;
        keyword?: string | undefined;
        estimatedCount?: number | undefined;
    } | undefined;
    scheduledAt?: string | Date | undefined;
    dailyBudget?: number | undefined;
    attributionWindowDays?: number | undefined;
    sentAt?: string | Date | undefined;
    stats?: {
        delivered?: number | undefined;
        failed?: number | undefined;
        sent?: number | undefined;
        deduped?: number | undefined;
        opened?: number | undefined;
        clicked?: number | undefined;
        converted?: number | undefined;
    } | undefined;
    errorMessage?: string | undefined;
    totalSpent?: number | undefined;
}>;
export declare const CreateAdCampaignSchema: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    status: z.ZodEnum<["draft", "scheduled", "sending", "sent", "pending_review", "active", "paused", "completed", "expired", "rejected", "failed", "cancelled"]>;
    startDate: z.ZodUnion<[z.ZodDate, z.ZodString]>;
    endDate: z.ZodOptional<z.ZodUnion<[z.ZodDate, z.ZodString]>>;
    channel: z.ZodOptional<z.ZodEnum<["email", "sms", "push", "in_app", "whatsapp", "social", "web", "api"]>>;
    targetAudience: z.ZodOptional<z.ZodObject<{
        segment: z.ZodOptional<z.ZodEnum<["all", "recent", "lapsed", "high_value", "stamp_card"]>>;
        daysInactive: z.ZodOptional<z.ZodNumber>;
        minSpend: z.ZodOptional<z.ZodNumber>;
        location: z.ZodOptional<z.ZodObject<{
            city: z.ZodOptional<z.ZodString>;
            area: z.ZodOptional<z.ZodString>;
            pincode: z.ZodOptional<z.ZodString>;
            radiusKm: z.ZodOptional<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            city?: string | undefined;
            pincode?: string | undefined;
            area?: string | undefined;
            radiusKm?: number | undefined;
        }, {
            city?: string | undefined;
            pincode?: string | undefined;
            area?: string | undefined;
            radiusKm?: number | undefined;
        }>>;
        interests: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        institution: z.ZodOptional<z.ZodString>;
        keyword: z.ZodOptional<z.ZodString>;
        estimatedCount: z.ZodOptional<z.ZodNumber>;
    }, "strict", z.ZodTypeAny, {
        segment?: "all" | "recent" | "lapsed" | "high_value" | "stamp_card" | undefined;
        daysInactive?: number | undefined;
        minSpend?: number | undefined;
        location?: {
            city?: string | undefined;
            pincode?: string | undefined;
            area?: string | undefined;
            radiusKm?: number | undefined;
        } | undefined;
        interests?: string[] | undefined;
        institution?: string | undefined;
        keyword?: string | undefined;
        estimatedCount?: number | undefined;
    }, {
        segment?: "all" | "recent" | "lapsed" | "high_value" | "stamp_card" | undefined;
        daysInactive?: number | undefined;
        minSpend?: number | undefined;
        location?: {
            city?: string | undefined;
            pincode?: string | undefined;
            area?: string | undefined;
            radiusKm?: number | undefined;
        } | undefined;
        interests?: string[] | undefined;
        institution?: string | undefined;
        keyword?: string | undefined;
        estimatedCount?: number | undefined;
    }>>;
    budget: z.ZodOptional<z.ZodNumber>;
    spent: z.ZodOptional<z.ZodNumber>;
    createdBy: z.ZodOptional<z.ZodString>;
} & {
    type: z.ZodOptional<z.ZodLiteral<"ad">>;
    merchantId: z.ZodOptional<z.ZodString>;
    storeId: z.ZodOptional<z.ZodString>;
    title: z.ZodOptional<z.ZodString>;
    headline: z.ZodOptional<z.ZodString>;
    ctaText: z.ZodOptional<z.ZodString>;
    ctaUrl: z.ZodOptional<z.ZodString>;
    imageUrl: z.ZodOptional<z.ZodString>;
    placement: z.ZodOptional<z.ZodEnum<["home_banner", "explore_feed", "store_listing", "search_result"]>>;
    targetSegment: z.ZodOptional<z.ZodEnum<["all", "new", "loyal", "lapsed", "nearby"]>>;
    targetLocation: z.ZodOptional<z.ZodObject<{
        city: z.ZodOptional<z.ZodString>;
        radiusKm: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        city?: string | undefined;
        radiusKm?: number | undefined;
    }, {
        city?: string | undefined;
        radiusKm?: number | undefined;
    }>>;
    targetInterests: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    bidType: z.ZodOptional<z.ZodEnum<["CPC", "CPM"]>>;
    bidAmount: z.ZodOptional<z.ZodNumber>;
    dailyBudget: z.ZodOptional<z.ZodNumber>;
    totalBudget: z.ZodOptional<z.ZodNumber>;
    frequencyCapDays: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    status: "cancelled" | "completed" | "failed" | "expired" | "draft" | "scheduled" | "sending" | "sent" | "pending_review" | "active" | "paused" | "rejected";
    name: string;
    startDate: string | Date;
    spent?: number | undefined;
    merchantId?: string | undefined;
    ctaText?: string | undefined;
    imageUrl?: string | undefined;
    type?: "ad" | undefined;
    description?: string | undefined;
    endDate?: string | Date | undefined;
    channel?: "email" | "sms" | "push" | "in_app" | "whatsapp" | "social" | "web" | "api" | undefined;
    targetAudience?: {
        segment?: "all" | "recent" | "lapsed" | "high_value" | "stamp_card" | undefined;
        daysInactive?: number | undefined;
        minSpend?: number | undefined;
        location?: {
            city?: string | undefined;
            pincode?: string | undefined;
            area?: string | undefined;
            radiusKm?: number | undefined;
        } | undefined;
        interests?: string[] | undefined;
        institution?: string | undefined;
        keyword?: string | undefined;
        estimatedCount?: number | undefined;
    } | undefined;
    budget?: number | undefined;
    createdBy?: string | undefined;
    ctaUrl?: string | undefined;
    dailyBudget?: number | undefined;
    storeId?: string | undefined;
    title?: string | undefined;
    headline?: string | undefined;
    placement?: "home_banner" | "explore_feed" | "store_listing" | "search_result" | undefined;
    targetSegment?: "all" | "lapsed" | "new" | "loyal" | "nearby" | undefined;
    targetLocation?: {
        city?: string | undefined;
        radiusKm?: number | undefined;
    } | undefined;
    targetInterests?: string[] | undefined;
    bidType?: "CPC" | "CPM" | undefined;
    bidAmount?: number | undefined;
    totalBudget?: number | undefined;
    frequencyCapDays?: number | undefined;
}, {
    status: "cancelled" | "completed" | "failed" | "expired" | "draft" | "scheduled" | "sending" | "sent" | "pending_review" | "active" | "paused" | "rejected";
    name: string;
    startDate: string | Date;
    spent?: number | undefined;
    merchantId?: string | undefined;
    ctaText?: string | undefined;
    imageUrl?: string | undefined;
    type?: "ad" | undefined;
    description?: string | undefined;
    endDate?: string | Date | undefined;
    channel?: "email" | "sms" | "push" | "in_app" | "whatsapp" | "social" | "web" | "api" | undefined;
    targetAudience?: {
        segment?: "all" | "recent" | "lapsed" | "high_value" | "stamp_card" | undefined;
        daysInactive?: number | undefined;
        minSpend?: number | undefined;
        location?: {
            city?: string | undefined;
            pincode?: string | undefined;
            area?: string | undefined;
            radiusKm?: number | undefined;
        } | undefined;
        interests?: string[] | undefined;
        institution?: string | undefined;
        keyword?: string | undefined;
        estimatedCount?: number | undefined;
    } | undefined;
    budget?: number | undefined;
    createdBy?: string | undefined;
    ctaUrl?: string | undefined;
    dailyBudget?: number | undefined;
    storeId?: string | undefined;
    title?: string | undefined;
    headline?: string | undefined;
    placement?: "home_banner" | "explore_feed" | "store_listing" | "search_result" | undefined;
    targetSegment?: "all" | "lapsed" | "new" | "loyal" | "nearby" | undefined;
    targetLocation?: {
        city?: string | undefined;
        radiusKm?: number | undefined;
    } | undefined;
    targetInterests?: string[] | undefined;
    bidType?: "CPC" | "CPM" | undefined;
    bidAmount?: number | undefined;
    totalBudget?: number | undefined;
    frequencyCapDays?: number | undefined;
}>;
export declare const UpdateAdCampaignSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    status: z.ZodOptional<z.ZodEnum<["draft", "scheduled", "sending", "sent", "pending_review", "active", "paused", "completed", "expired", "rejected", "failed", "cancelled"]>>;
    startDate: z.ZodOptional<z.ZodUnion<[z.ZodDate, z.ZodString]>>;
    endDate: z.ZodOptional<z.ZodOptional<z.ZodUnion<[z.ZodDate, z.ZodString]>>>;
    channel: z.ZodOptional<z.ZodOptional<z.ZodEnum<["email", "sms", "push", "in_app", "whatsapp", "social", "web", "api"]>>>;
    targetAudience: z.ZodOptional<z.ZodOptional<z.ZodObject<{
        segment: z.ZodOptional<z.ZodEnum<["all", "recent", "lapsed", "high_value", "stamp_card"]>>;
        daysInactive: z.ZodOptional<z.ZodNumber>;
        minSpend: z.ZodOptional<z.ZodNumber>;
        location: z.ZodOptional<z.ZodObject<{
            city: z.ZodOptional<z.ZodString>;
            area: z.ZodOptional<z.ZodString>;
            pincode: z.ZodOptional<z.ZodString>;
            radiusKm: z.ZodOptional<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            city?: string | undefined;
            pincode?: string | undefined;
            area?: string | undefined;
            radiusKm?: number | undefined;
        }, {
            city?: string | undefined;
            pincode?: string | undefined;
            area?: string | undefined;
            radiusKm?: number | undefined;
        }>>;
        interests: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        institution: z.ZodOptional<z.ZodString>;
        keyword: z.ZodOptional<z.ZodString>;
        estimatedCount: z.ZodOptional<z.ZodNumber>;
    }, "strict", z.ZodTypeAny, {
        segment?: "all" | "recent" | "lapsed" | "high_value" | "stamp_card" | undefined;
        daysInactive?: number | undefined;
        minSpend?: number | undefined;
        location?: {
            city?: string | undefined;
            pincode?: string | undefined;
            area?: string | undefined;
            radiusKm?: number | undefined;
        } | undefined;
        interests?: string[] | undefined;
        institution?: string | undefined;
        keyword?: string | undefined;
        estimatedCount?: number | undefined;
    }, {
        segment?: "all" | "recent" | "lapsed" | "high_value" | "stamp_card" | undefined;
        daysInactive?: number | undefined;
        minSpend?: number | undefined;
        location?: {
            city?: string | undefined;
            pincode?: string | undefined;
            area?: string | undefined;
            radiusKm?: number | undefined;
        } | undefined;
        interests?: string[] | undefined;
        institution?: string | undefined;
        keyword?: string | undefined;
        estimatedCount?: number | undefined;
    }>>>;
    budget: z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
    spent: z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
    createdBy: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    type: z.ZodOptional<z.ZodOptional<z.ZodLiteral<"ad">>>;
    merchantId: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    storeId: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    title: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    headline: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    ctaText: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    ctaUrl: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    imageUrl: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    placement: z.ZodOptional<z.ZodOptional<z.ZodEnum<["home_banner", "explore_feed", "store_listing", "search_result"]>>>;
    targetSegment: z.ZodOptional<z.ZodOptional<z.ZodEnum<["all", "new", "loyal", "lapsed", "nearby"]>>>;
    targetLocation: z.ZodOptional<z.ZodOptional<z.ZodObject<{
        city: z.ZodOptional<z.ZodString>;
        radiusKm: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        city?: string | undefined;
        radiusKm?: number | undefined;
    }, {
        city?: string | undefined;
        radiusKm?: number | undefined;
    }>>>;
    targetInterests: z.ZodOptional<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
    bidType: z.ZodOptional<z.ZodOptional<z.ZodEnum<["CPC", "CPM"]>>>;
    bidAmount: z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
    dailyBudget: z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
    totalBudget: z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
    frequencyCapDays: z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
}, "strip", z.ZodTypeAny, {
    spent?: number | undefined;
    merchantId?: string | undefined;
    ctaText?: string | undefined;
    imageUrl?: string | undefined;
    status?: "cancelled" | "completed" | "failed" | "expired" | "draft" | "scheduled" | "sending" | "sent" | "pending_review" | "active" | "paused" | "rejected" | undefined;
    name?: string | undefined;
    type?: "ad" | undefined;
    description?: string | undefined;
    startDate?: string | Date | undefined;
    endDate?: string | Date | undefined;
    channel?: "email" | "sms" | "push" | "in_app" | "whatsapp" | "social" | "web" | "api" | undefined;
    targetAudience?: {
        segment?: "all" | "recent" | "lapsed" | "high_value" | "stamp_card" | undefined;
        daysInactive?: number | undefined;
        minSpend?: number | undefined;
        location?: {
            city?: string | undefined;
            pincode?: string | undefined;
            area?: string | undefined;
            radiusKm?: number | undefined;
        } | undefined;
        interests?: string[] | undefined;
        institution?: string | undefined;
        keyword?: string | undefined;
        estimatedCount?: number | undefined;
    } | undefined;
    budget?: number | undefined;
    createdBy?: string | undefined;
    ctaUrl?: string | undefined;
    dailyBudget?: number | undefined;
    storeId?: string | undefined;
    title?: string | undefined;
    headline?: string | undefined;
    placement?: "home_banner" | "explore_feed" | "store_listing" | "search_result" | undefined;
    targetSegment?: "all" | "lapsed" | "new" | "loyal" | "nearby" | undefined;
    targetLocation?: {
        city?: string | undefined;
        radiusKm?: number | undefined;
    } | undefined;
    targetInterests?: string[] | undefined;
    bidType?: "CPC" | "CPM" | undefined;
    bidAmount?: number | undefined;
    totalBudget?: number | undefined;
    frequencyCapDays?: number | undefined;
}, {
    spent?: number | undefined;
    merchantId?: string | undefined;
    ctaText?: string | undefined;
    imageUrl?: string | undefined;
    status?: "cancelled" | "completed" | "failed" | "expired" | "draft" | "scheduled" | "sending" | "sent" | "pending_review" | "active" | "paused" | "rejected" | undefined;
    name?: string | undefined;
    type?: "ad" | undefined;
    description?: string | undefined;
    startDate?: string | Date | undefined;
    endDate?: string | Date | undefined;
    channel?: "email" | "sms" | "push" | "in_app" | "whatsapp" | "social" | "web" | "api" | undefined;
    targetAudience?: {
        segment?: "all" | "recent" | "lapsed" | "high_value" | "stamp_card" | undefined;
        daysInactive?: number | undefined;
        minSpend?: number | undefined;
        location?: {
            city?: string | undefined;
            pincode?: string | undefined;
            area?: string | undefined;
            radiusKm?: number | undefined;
        } | undefined;
        interests?: string[] | undefined;
        institution?: string | undefined;
        keyword?: string | undefined;
        estimatedCount?: number | undefined;
    } | undefined;
    budget?: number | undefined;
    createdBy?: string | undefined;
    ctaUrl?: string | undefined;
    dailyBudget?: number | undefined;
    storeId?: string | undefined;
    title?: string | undefined;
    headline?: string | undefined;
    placement?: "home_banner" | "explore_feed" | "store_listing" | "search_result" | undefined;
    targetSegment?: "all" | "lapsed" | "new" | "loyal" | "nearby" | undefined;
    targetLocation?: {
        city?: string | undefined;
        radiusKm?: number | undefined;
    } | undefined;
    targetInterests?: string[] | undefined;
    bidType?: "CPC" | "CPM" | undefined;
    bidAmount?: number | undefined;
    totalBudget?: number | undefined;
    frequencyCapDays?: number | undefined;
}>;
export declare const AdCampaignResponseSchema: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    status: z.ZodEnum<["draft", "scheduled", "sending", "sent", "pending_review", "active", "paused", "completed", "expired", "rejected", "failed", "cancelled"]>;
    startDate: z.ZodUnion<[z.ZodDate, z.ZodString]>;
    endDate: z.ZodOptional<z.ZodUnion<[z.ZodDate, z.ZodString]>>;
    channel: z.ZodOptional<z.ZodEnum<["email", "sms", "push", "in_app", "whatsapp", "social", "web", "api"]>>;
    targetAudience: z.ZodOptional<z.ZodObject<{
        segment: z.ZodOptional<z.ZodEnum<["all", "recent", "lapsed", "high_value", "stamp_card"]>>;
        daysInactive: z.ZodOptional<z.ZodNumber>;
        minSpend: z.ZodOptional<z.ZodNumber>;
        location: z.ZodOptional<z.ZodObject<{
            city: z.ZodOptional<z.ZodString>;
            area: z.ZodOptional<z.ZodString>;
            pincode: z.ZodOptional<z.ZodString>;
            radiusKm: z.ZodOptional<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            city?: string | undefined;
            pincode?: string | undefined;
            area?: string | undefined;
            radiusKm?: number | undefined;
        }, {
            city?: string | undefined;
            pincode?: string | undefined;
            area?: string | undefined;
            radiusKm?: number | undefined;
        }>>;
        interests: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        institution: z.ZodOptional<z.ZodString>;
        keyword: z.ZodOptional<z.ZodString>;
        estimatedCount: z.ZodOptional<z.ZodNumber>;
    }, "strict", z.ZodTypeAny, {
        segment?: "all" | "recent" | "lapsed" | "high_value" | "stamp_card" | undefined;
        daysInactive?: number | undefined;
        minSpend?: number | undefined;
        location?: {
            city?: string | undefined;
            pincode?: string | undefined;
            area?: string | undefined;
            radiusKm?: number | undefined;
        } | undefined;
        interests?: string[] | undefined;
        institution?: string | undefined;
        keyword?: string | undefined;
        estimatedCount?: number | undefined;
    }, {
        segment?: "all" | "recent" | "lapsed" | "high_value" | "stamp_card" | undefined;
        daysInactive?: number | undefined;
        minSpend?: number | undefined;
        location?: {
            city?: string | undefined;
            pincode?: string | undefined;
            area?: string | undefined;
            radiusKm?: number | undefined;
        } | undefined;
        interests?: string[] | undefined;
        institution?: string | undefined;
        keyword?: string | undefined;
        estimatedCount?: number | undefined;
    }>>;
    budget: z.ZodOptional<z.ZodNumber>;
    spent: z.ZodOptional<z.ZodNumber>;
    createdBy: z.ZodOptional<z.ZodString>;
} & {
    type: z.ZodOptional<z.ZodLiteral<"ad">>;
    merchantId: z.ZodOptional<z.ZodString>;
    storeId: z.ZodOptional<z.ZodString>;
    title: z.ZodOptional<z.ZodString>;
    headline: z.ZodOptional<z.ZodString>;
    ctaText: z.ZodOptional<z.ZodString>;
    ctaUrl: z.ZodOptional<z.ZodString>;
    imageUrl: z.ZodOptional<z.ZodString>;
    placement: z.ZodOptional<z.ZodEnum<["home_banner", "explore_feed", "store_listing", "search_result"]>>;
    targetSegment: z.ZodOptional<z.ZodEnum<["all", "new", "loyal", "lapsed", "nearby"]>>;
    targetLocation: z.ZodOptional<z.ZodObject<{
        city: z.ZodOptional<z.ZodString>;
        radiusKm: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        city?: string | undefined;
        radiusKm?: number | undefined;
    }, {
        city?: string | undefined;
        radiusKm?: number | undefined;
    }>>;
    targetInterests: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    bidType: z.ZodOptional<z.ZodEnum<["CPC", "CPM"]>>;
    bidAmount: z.ZodOptional<z.ZodNumber>;
    dailyBudget: z.ZodOptional<z.ZodNumber>;
    totalBudget: z.ZodOptional<z.ZodNumber>;
    frequencyCapDays: z.ZodOptional<z.ZodNumber>;
} & {
    _id: z.ZodOptional<z.ZodString>;
    totalSpent: z.ZodOptional<z.ZodNumber>;
    impressions: z.ZodOptional<z.ZodNumber>;
    clicks: z.ZodOptional<z.ZodNumber>;
    ctr: z.ZodOptional<z.ZodNumber>;
    reviewedBy: z.ZodOptional<z.ZodString>;
    reviewedAt: z.ZodOptional<z.ZodUnion<[z.ZodDate, z.ZodString]>>;
    rejectionReason: z.ZodOptional<z.ZodString>;
    createdAt: z.ZodOptional<z.ZodUnion<[z.ZodDate, z.ZodString]>>;
    updatedAt: z.ZodOptional<z.ZodUnion<[z.ZodDate, z.ZodString]>>;
}, "strip", z.ZodTypeAny, {
    status: "cancelled" | "completed" | "failed" | "expired" | "draft" | "scheduled" | "sending" | "sent" | "pending_review" | "active" | "paused" | "rejected";
    name: string;
    startDate: string | Date;
    spent?: number | undefined;
    merchantId?: string | undefined;
    ctaText?: string | undefined;
    imageUrl?: string | undefined;
    type?: "ad" | undefined;
    _id?: string | undefined;
    createdAt?: string | Date | undefined;
    updatedAt?: string | Date | undefined;
    description?: string | undefined;
    endDate?: string | Date | undefined;
    channel?: "email" | "sms" | "push" | "in_app" | "whatsapp" | "social" | "web" | "api" | undefined;
    targetAudience?: {
        segment?: "all" | "recent" | "lapsed" | "high_value" | "stamp_card" | undefined;
        daysInactive?: number | undefined;
        minSpend?: number | undefined;
        location?: {
            city?: string | undefined;
            pincode?: string | undefined;
            area?: string | undefined;
            radiusKm?: number | undefined;
        } | undefined;
        interests?: string[] | undefined;
        institution?: string | undefined;
        keyword?: string | undefined;
        estimatedCount?: number | undefined;
    } | undefined;
    budget?: number | undefined;
    createdBy?: string | undefined;
    ctaUrl?: string | undefined;
    dailyBudget?: number | undefined;
    totalSpent?: number | undefined;
    storeId?: string | undefined;
    title?: string | undefined;
    headline?: string | undefined;
    placement?: "home_banner" | "explore_feed" | "store_listing" | "search_result" | undefined;
    targetSegment?: "all" | "lapsed" | "new" | "loyal" | "nearby" | undefined;
    targetLocation?: {
        city?: string | undefined;
        radiusKm?: number | undefined;
    } | undefined;
    targetInterests?: string[] | undefined;
    bidType?: "CPC" | "CPM" | undefined;
    bidAmount?: number | undefined;
    totalBudget?: number | undefined;
    frequencyCapDays?: number | undefined;
    impressions?: number | undefined;
    clicks?: number | undefined;
    ctr?: number | undefined;
    reviewedBy?: string | undefined;
    reviewedAt?: string | Date | undefined;
    rejectionReason?: string | undefined;
}, {
    status: "cancelled" | "completed" | "failed" | "expired" | "draft" | "scheduled" | "sending" | "sent" | "pending_review" | "active" | "paused" | "rejected";
    name: string;
    startDate: string | Date;
    spent?: number | undefined;
    merchantId?: string | undefined;
    ctaText?: string | undefined;
    imageUrl?: string | undefined;
    type?: "ad" | undefined;
    _id?: string | undefined;
    createdAt?: string | Date | undefined;
    updatedAt?: string | Date | undefined;
    description?: string | undefined;
    endDate?: string | Date | undefined;
    channel?: "email" | "sms" | "push" | "in_app" | "whatsapp" | "social" | "web" | "api" | undefined;
    targetAudience?: {
        segment?: "all" | "recent" | "lapsed" | "high_value" | "stamp_card" | undefined;
        daysInactive?: number | undefined;
        minSpend?: number | undefined;
        location?: {
            city?: string | undefined;
            pincode?: string | undefined;
            area?: string | undefined;
            radiusKm?: number | undefined;
        } | undefined;
        interests?: string[] | undefined;
        institution?: string | undefined;
        keyword?: string | undefined;
        estimatedCount?: number | undefined;
    } | undefined;
    budget?: number | undefined;
    createdBy?: string | undefined;
    ctaUrl?: string | undefined;
    dailyBudget?: number | undefined;
    totalSpent?: number | undefined;
    storeId?: string | undefined;
    title?: string | undefined;
    headline?: string | undefined;
    placement?: "home_banner" | "explore_feed" | "store_listing" | "search_result" | undefined;
    targetSegment?: "all" | "lapsed" | "new" | "loyal" | "nearby" | undefined;
    targetLocation?: {
        city?: string | undefined;
        radiusKm?: number | undefined;
    } | undefined;
    targetInterests?: string[] | undefined;
    bidType?: "CPC" | "CPM" | undefined;
    bidAmount?: number | undefined;
    totalBudget?: number | undefined;
    frequencyCapDays?: number | undefined;
    impressions?: number | undefined;
    clicks?: number | undefined;
    ctr?: number | undefined;
    reviewedBy?: string | undefined;
    reviewedAt?: string | Date | undefined;
    rejectionReason?: string | undefined;
}>;
export declare const CreateMerchantCampaignSchema: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    status: z.ZodEnum<["draft", "scheduled", "sending", "sent", "pending_review", "active", "paused", "completed", "expired", "rejected", "failed", "cancelled"]>;
    startDate: z.ZodUnion<[z.ZodDate, z.ZodString]>;
    endDate: z.ZodOptional<z.ZodUnion<[z.ZodDate, z.ZodString]>>;
    channel: z.ZodOptional<z.ZodEnum<["email", "sms", "push", "in_app", "whatsapp", "social", "web", "api"]>>;
    targetAudience: z.ZodOptional<z.ZodObject<{
        segment: z.ZodOptional<z.ZodEnum<["all", "recent", "lapsed", "high_value", "stamp_card"]>>;
        daysInactive: z.ZodOptional<z.ZodNumber>;
        minSpend: z.ZodOptional<z.ZodNumber>;
        location: z.ZodOptional<z.ZodObject<{
            city: z.ZodOptional<z.ZodString>;
            area: z.ZodOptional<z.ZodString>;
            pincode: z.ZodOptional<z.ZodString>;
            radiusKm: z.ZodOptional<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            city?: string | undefined;
            pincode?: string | undefined;
            area?: string | undefined;
            radiusKm?: number | undefined;
        }, {
            city?: string | undefined;
            pincode?: string | undefined;
            area?: string | undefined;
            radiusKm?: number | undefined;
        }>>;
        interests: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        institution: z.ZodOptional<z.ZodString>;
        keyword: z.ZodOptional<z.ZodString>;
        estimatedCount: z.ZodOptional<z.ZodNumber>;
    }, "strict", z.ZodTypeAny, {
        segment?: "all" | "recent" | "lapsed" | "high_value" | "stamp_card" | undefined;
        daysInactive?: number | undefined;
        minSpend?: number | undefined;
        location?: {
            city?: string | undefined;
            pincode?: string | undefined;
            area?: string | undefined;
            radiusKm?: number | undefined;
        } | undefined;
        interests?: string[] | undefined;
        institution?: string | undefined;
        keyword?: string | undefined;
        estimatedCount?: number | undefined;
    }, {
        segment?: "all" | "recent" | "lapsed" | "high_value" | "stamp_card" | undefined;
        daysInactive?: number | undefined;
        minSpend?: number | undefined;
        location?: {
            city?: string | undefined;
            pincode?: string | undefined;
            area?: string | undefined;
            radiusKm?: number | undefined;
        } | undefined;
        interests?: string[] | undefined;
        institution?: string | undefined;
        keyword?: string | undefined;
        estimatedCount?: number | undefined;
    }>>;
    budget: z.ZodOptional<z.ZodNumber>;
    spent: z.ZodOptional<z.ZodNumber>;
    createdBy: z.ZodOptional<z.ZodString>;
} & {
    type: z.ZodOptional<z.ZodLiteral<"merchant">>;
    merchantId: z.ZodOptional<z.ZodString>;
    storeId: z.ZodOptional<z.ZodString>;
    title: z.ZodOptional<z.ZodString>;
    discountPercentage: z.ZodOptional<z.ZodNumber>;
    maxRedemptions: z.ZodOptional<z.ZodNumber>;
    appliedProducts: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    rewardValue: z.ZodOptional<z.ZodNumber>;
    rewardType: z.ZodOptional<z.ZodString>;
    durationDays: z.ZodOptional<z.ZodNumber>;
    conditions: z.ZodOptional<z.ZodArray<z.ZodObject<{
        field: z.ZodString;
        operator: z.ZodEnum<["eq", "neq", "gt", "gte", "lt", "lte", "in", "not_in", "contains", "exists"]>;
        value: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean, z.ZodNull, z.ZodArray<z.ZodUnion<[z.ZodString, z.ZodNumber]>, "many">]>>;
    }, "strict", z.ZodTypeAny, {
        operator: "eq" | "neq" | "gt" | "gte" | "lt" | "lte" | "in" | "not_in" | "contains" | "exists";
        field: string;
        value?: string | number | boolean | (string | number)[] | null | undefined;
    }, {
        operator: "eq" | "neq" | "gt" | "gte" | "lt" | "lte" | "in" | "not_in" | "contains" | "exists";
        field: string;
        value?: string | number | boolean | (string | number)[] | null | undefined;
    }>, "many">>;
    actions: z.ZodOptional<z.ZodArray<z.ZodObject<{
        kind: z.ZodEnum<["credit_coins", "grant_badge", "send_notification", "award_voucher", "issue_coupon"]>;
        params: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean, z.ZodNull, z.ZodArray<z.ZodString, "many">, z.ZodArray<z.ZodNumber, "many">]>>>;
    }, "strict", z.ZodTypeAny, {
        kind: "credit_coins" | "grant_badge" | "send_notification" | "award_voucher" | "issue_coupon";
        params?: Record<string, string | number | boolean | string[] | number[] | null> | undefined;
    }, {
        kind: "credit_coins" | "grant_badge" | "send_notification" | "award_voucher" | "issue_coupon";
        params?: Record<string, string | number | boolean | string[] | number[] | null> | undefined;
    }>, "many">>;
    triggers: z.ZodOptional<z.ZodArray<z.ZodObject<{
        event: z.ZodEnum<["order.placed", "order.delivered", "visit.completed", "signup", "referral.invite", "cron", "manual"]>;
        filters: z.ZodOptional<z.ZodArray<z.ZodObject<{
            field: z.ZodString;
            operator: z.ZodEnum<["eq", "neq", "gt", "gte", "lt", "lte", "in", "not_in", "contains", "exists"]>;
            value: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean, z.ZodNull, z.ZodArray<z.ZodUnion<[z.ZodString, z.ZodNumber]>, "many">]>>;
        }, "strict", z.ZodTypeAny, {
            operator: "eq" | "neq" | "gt" | "gte" | "lt" | "lte" | "in" | "not_in" | "contains" | "exists";
            field: string;
            value?: string | number | boolean | (string | number)[] | null | undefined;
        }, {
            operator: "eq" | "neq" | "gt" | "gte" | "lt" | "lte" | "in" | "not_in" | "contains" | "exists";
            field: string;
            value?: string | number | boolean | (string | number)[] | null | undefined;
        }>, "many">>;
    }, "strict", z.ZodTypeAny, {
        event: "manual" | "signup" | "order.placed" | "order.delivered" | "visit.completed" | "referral.invite" | "cron";
        filters?: {
            operator: "eq" | "neq" | "gt" | "gte" | "lt" | "lte" | "in" | "not_in" | "contains" | "exists";
            field: string;
            value?: string | number | boolean | (string | number)[] | null | undefined;
        }[] | undefined;
    }, {
        event: "manual" | "signup" | "order.placed" | "order.delivered" | "visit.completed" | "referral.invite" | "cron";
        filters?: {
            operator: "eq" | "neq" | "gt" | "gte" | "lt" | "lte" | "in" | "not_in" | "contains" | "exists";
            field: string;
            value?: string | number | boolean | (string | number)[] | null | undefined;
        }[] | undefined;
    }>, "many">>;
    priority: z.ZodOptional<z.ZodNumber>;
    cooldownDays: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    status: "cancelled" | "completed" | "failed" | "expired" | "draft" | "scheduled" | "sending" | "sent" | "pending_review" | "active" | "paused" | "rejected";
    name: string;
    startDate: string | Date;
    spent?: number | undefined;
    merchantId?: string | undefined;
    type?: "merchant" | undefined;
    description?: string | undefined;
    endDate?: string | Date | undefined;
    channel?: "email" | "sms" | "push" | "in_app" | "whatsapp" | "social" | "web" | "api" | undefined;
    targetAudience?: {
        segment?: "all" | "recent" | "lapsed" | "high_value" | "stamp_card" | undefined;
        daysInactive?: number | undefined;
        minSpend?: number | undefined;
        location?: {
            city?: string | undefined;
            pincode?: string | undefined;
            area?: string | undefined;
            radiusKm?: number | undefined;
        } | undefined;
        interests?: string[] | undefined;
        institution?: string | undefined;
        keyword?: string | undefined;
        estimatedCount?: number | undefined;
    } | undefined;
    budget?: number | undefined;
    createdBy?: string | undefined;
    storeId?: string | undefined;
    title?: string | undefined;
    discountPercentage?: number | undefined;
    maxRedemptions?: number | undefined;
    appliedProducts?: string[] | undefined;
    rewardValue?: number | undefined;
    rewardType?: string | undefined;
    durationDays?: number | undefined;
    conditions?: {
        operator: "eq" | "neq" | "gt" | "gte" | "lt" | "lte" | "in" | "not_in" | "contains" | "exists";
        field: string;
        value?: string | number | boolean | (string | number)[] | null | undefined;
    }[] | undefined;
    actions?: {
        kind: "credit_coins" | "grant_badge" | "send_notification" | "award_voucher" | "issue_coupon";
        params?: Record<string, string | number | boolean | string[] | number[] | null> | undefined;
    }[] | undefined;
    triggers?: {
        event: "manual" | "signup" | "order.placed" | "order.delivered" | "visit.completed" | "referral.invite" | "cron";
        filters?: {
            operator: "eq" | "neq" | "gt" | "gte" | "lt" | "lte" | "in" | "not_in" | "contains" | "exists";
            field: string;
            value?: string | number | boolean | (string | number)[] | null | undefined;
        }[] | undefined;
    }[] | undefined;
    priority?: number | undefined;
    cooldownDays?: number | undefined;
}, {
    status: "cancelled" | "completed" | "failed" | "expired" | "draft" | "scheduled" | "sending" | "sent" | "pending_review" | "active" | "paused" | "rejected";
    name: string;
    startDate: string | Date;
    spent?: number | undefined;
    merchantId?: string | undefined;
    type?: "merchant" | undefined;
    description?: string | undefined;
    endDate?: string | Date | undefined;
    channel?: "email" | "sms" | "push" | "in_app" | "whatsapp" | "social" | "web" | "api" | undefined;
    targetAudience?: {
        segment?: "all" | "recent" | "lapsed" | "high_value" | "stamp_card" | undefined;
        daysInactive?: number | undefined;
        minSpend?: number | undefined;
        location?: {
            city?: string | undefined;
            pincode?: string | undefined;
            area?: string | undefined;
            radiusKm?: number | undefined;
        } | undefined;
        interests?: string[] | undefined;
        institution?: string | undefined;
        keyword?: string | undefined;
        estimatedCount?: number | undefined;
    } | undefined;
    budget?: number | undefined;
    createdBy?: string | undefined;
    storeId?: string | undefined;
    title?: string | undefined;
    discountPercentage?: number | undefined;
    maxRedemptions?: number | undefined;
    appliedProducts?: string[] | undefined;
    rewardValue?: number | undefined;
    rewardType?: string | undefined;
    durationDays?: number | undefined;
    conditions?: {
        operator: "eq" | "neq" | "gt" | "gte" | "lt" | "lte" | "in" | "not_in" | "contains" | "exists";
        field: string;
        value?: string | number | boolean | (string | number)[] | null | undefined;
    }[] | undefined;
    actions?: {
        kind: "credit_coins" | "grant_badge" | "send_notification" | "award_voucher" | "issue_coupon";
        params?: Record<string, string | number | boolean | string[] | number[] | null> | undefined;
    }[] | undefined;
    triggers?: {
        event: "manual" | "signup" | "order.placed" | "order.delivered" | "visit.completed" | "referral.invite" | "cron";
        filters?: {
            operator: "eq" | "neq" | "gt" | "gte" | "lt" | "lte" | "in" | "not_in" | "contains" | "exists";
            field: string;
            value?: string | number | boolean | (string | number)[] | null | undefined;
        }[] | undefined;
    }[] | undefined;
    priority?: number | undefined;
    cooldownDays?: number | undefined;
}>;
export declare const UpdateMerchantCampaignSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    status: z.ZodOptional<z.ZodEnum<["draft", "scheduled", "sending", "sent", "pending_review", "active", "paused", "completed", "expired", "rejected", "failed", "cancelled"]>>;
    startDate: z.ZodOptional<z.ZodUnion<[z.ZodDate, z.ZodString]>>;
    endDate: z.ZodOptional<z.ZodOptional<z.ZodUnion<[z.ZodDate, z.ZodString]>>>;
    channel: z.ZodOptional<z.ZodOptional<z.ZodEnum<["email", "sms", "push", "in_app", "whatsapp", "social", "web", "api"]>>>;
    targetAudience: z.ZodOptional<z.ZodOptional<z.ZodObject<{
        segment: z.ZodOptional<z.ZodEnum<["all", "recent", "lapsed", "high_value", "stamp_card"]>>;
        daysInactive: z.ZodOptional<z.ZodNumber>;
        minSpend: z.ZodOptional<z.ZodNumber>;
        location: z.ZodOptional<z.ZodObject<{
            city: z.ZodOptional<z.ZodString>;
            area: z.ZodOptional<z.ZodString>;
            pincode: z.ZodOptional<z.ZodString>;
            radiusKm: z.ZodOptional<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            city?: string | undefined;
            pincode?: string | undefined;
            area?: string | undefined;
            radiusKm?: number | undefined;
        }, {
            city?: string | undefined;
            pincode?: string | undefined;
            area?: string | undefined;
            radiusKm?: number | undefined;
        }>>;
        interests: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        institution: z.ZodOptional<z.ZodString>;
        keyword: z.ZodOptional<z.ZodString>;
        estimatedCount: z.ZodOptional<z.ZodNumber>;
    }, "strict", z.ZodTypeAny, {
        segment?: "all" | "recent" | "lapsed" | "high_value" | "stamp_card" | undefined;
        daysInactive?: number | undefined;
        minSpend?: number | undefined;
        location?: {
            city?: string | undefined;
            pincode?: string | undefined;
            area?: string | undefined;
            radiusKm?: number | undefined;
        } | undefined;
        interests?: string[] | undefined;
        institution?: string | undefined;
        keyword?: string | undefined;
        estimatedCount?: number | undefined;
    }, {
        segment?: "all" | "recent" | "lapsed" | "high_value" | "stamp_card" | undefined;
        daysInactive?: number | undefined;
        minSpend?: number | undefined;
        location?: {
            city?: string | undefined;
            pincode?: string | undefined;
            area?: string | undefined;
            radiusKm?: number | undefined;
        } | undefined;
        interests?: string[] | undefined;
        institution?: string | undefined;
        keyword?: string | undefined;
        estimatedCount?: number | undefined;
    }>>>;
    budget: z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
    spent: z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
    createdBy: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    type: z.ZodOptional<z.ZodOptional<z.ZodLiteral<"merchant">>>;
    merchantId: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    storeId: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    title: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    discountPercentage: z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
    maxRedemptions: z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
    appliedProducts: z.ZodOptional<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
    rewardValue: z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
    rewardType: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    durationDays: z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
    conditions: z.ZodOptional<z.ZodOptional<z.ZodArray<z.ZodObject<{
        field: z.ZodString;
        operator: z.ZodEnum<["eq", "neq", "gt", "gte", "lt", "lte", "in", "not_in", "contains", "exists"]>;
        value: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean, z.ZodNull, z.ZodArray<z.ZodUnion<[z.ZodString, z.ZodNumber]>, "many">]>>;
    }, "strict", z.ZodTypeAny, {
        operator: "eq" | "neq" | "gt" | "gte" | "lt" | "lte" | "in" | "not_in" | "contains" | "exists";
        field: string;
        value?: string | number | boolean | (string | number)[] | null | undefined;
    }, {
        operator: "eq" | "neq" | "gt" | "gte" | "lt" | "lte" | "in" | "not_in" | "contains" | "exists";
        field: string;
        value?: string | number | boolean | (string | number)[] | null | undefined;
    }>, "many">>>;
    actions: z.ZodOptional<z.ZodOptional<z.ZodArray<z.ZodObject<{
        kind: z.ZodEnum<["credit_coins", "grant_badge", "send_notification", "award_voucher", "issue_coupon"]>;
        params: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean, z.ZodNull, z.ZodArray<z.ZodString, "many">, z.ZodArray<z.ZodNumber, "many">]>>>;
    }, "strict", z.ZodTypeAny, {
        kind: "credit_coins" | "grant_badge" | "send_notification" | "award_voucher" | "issue_coupon";
        params?: Record<string, string | number | boolean | string[] | number[] | null> | undefined;
    }, {
        kind: "credit_coins" | "grant_badge" | "send_notification" | "award_voucher" | "issue_coupon";
        params?: Record<string, string | number | boolean | string[] | number[] | null> | undefined;
    }>, "many">>>;
    triggers: z.ZodOptional<z.ZodOptional<z.ZodArray<z.ZodObject<{
        event: z.ZodEnum<["order.placed", "order.delivered", "visit.completed", "signup", "referral.invite", "cron", "manual"]>;
        filters: z.ZodOptional<z.ZodArray<z.ZodObject<{
            field: z.ZodString;
            operator: z.ZodEnum<["eq", "neq", "gt", "gte", "lt", "lte", "in", "not_in", "contains", "exists"]>;
            value: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean, z.ZodNull, z.ZodArray<z.ZodUnion<[z.ZodString, z.ZodNumber]>, "many">]>>;
        }, "strict", z.ZodTypeAny, {
            operator: "eq" | "neq" | "gt" | "gte" | "lt" | "lte" | "in" | "not_in" | "contains" | "exists";
            field: string;
            value?: string | number | boolean | (string | number)[] | null | undefined;
        }, {
            operator: "eq" | "neq" | "gt" | "gte" | "lt" | "lte" | "in" | "not_in" | "contains" | "exists";
            field: string;
            value?: string | number | boolean | (string | number)[] | null | undefined;
        }>, "many">>;
    }, "strict", z.ZodTypeAny, {
        event: "manual" | "signup" | "order.placed" | "order.delivered" | "visit.completed" | "referral.invite" | "cron";
        filters?: {
            operator: "eq" | "neq" | "gt" | "gte" | "lt" | "lte" | "in" | "not_in" | "contains" | "exists";
            field: string;
            value?: string | number | boolean | (string | number)[] | null | undefined;
        }[] | undefined;
    }, {
        event: "manual" | "signup" | "order.placed" | "order.delivered" | "visit.completed" | "referral.invite" | "cron";
        filters?: {
            operator: "eq" | "neq" | "gt" | "gte" | "lt" | "lte" | "in" | "not_in" | "contains" | "exists";
            field: string;
            value?: string | number | boolean | (string | number)[] | null | undefined;
        }[] | undefined;
    }>, "many">>>;
    priority: z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
    cooldownDays: z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
}, "strip", z.ZodTypeAny, {
    spent?: number | undefined;
    merchantId?: string | undefined;
    status?: "cancelled" | "completed" | "failed" | "expired" | "draft" | "scheduled" | "sending" | "sent" | "pending_review" | "active" | "paused" | "rejected" | undefined;
    name?: string | undefined;
    type?: "merchant" | undefined;
    description?: string | undefined;
    startDate?: string | Date | undefined;
    endDate?: string | Date | undefined;
    channel?: "email" | "sms" | "push" | "in_app" | "whatsapp" | "social" | "web" | "api" | undefined;
    targetAudience?: {
        segment?: "all" | "recent" | "lapsed" | "high_value" | "stamp_card" | undefined;
        daysInactive?: number | undefined;
        minSpend?: number | undefined;
        location?: {
            city?: string | undefined;
            pincode?: string | undefined;
            area?: string | undefined;
            radiusKm?: number | undefined;
        } | undefined;
        interests?: string[] | undefined;
        institution?: string | undefined;
        keyword?: string | undefined;
        estimatedCount?: number | undefined;
    } | undefined;
    budget?: number | undefined;
    createdBy?: string | undefined;
    storeId?: string | undefined;
    title?: string | undefined;
    discountPercentage?: number | undefined;
    maxRedemptions?: number | undefined;
    appliedProducts?: string[] | undefined;
    rewardValue?: number | undefined;
    rewardType?: string | undefined;
    durationDays?: number | undefined;
    conditions?: {
        operator: "eq" | "neq" | "gt" | "gte" | "lt" | "lte" | "in" | "not_in" | "contains" | "exists";
        field: string;
        value?: string | number | boolean | (string | number)[] | null | undefined;
    }[] | undefined;
    actions?: {
        kind: "credit_coins" | "grant_badge" | "send_notification" | "award_voucher" | "issue_coupon";
        params?: Record<string, string | number | boolean | string[] | number[] | null> | undefined;
    }[] | undefined;
    triggers?: {
        event: "manual" | "signup" | "order.placed" | "order.delivered" | "visit.completed" | "referral.invite" | "cron";
        filters?: {
            operator: "eq" | "neq" | "gt" | "gte" | "lt" | "lte" | "in" | "not_in" | "contains" | "exists";
            field: string;
            value?: string | number | boolean | (string | number)[] | null | undefined;
        }[] | undefined;
    }[] | undefined;
    priority?: number | undefined;
    cooldownDays?: number | undefined;
}, {
    spent?: number | undefined;
    merchantId?: string | undefined;
    status?: "cancelled" | "completed" | "failed" | "expired" | "draft" | "scheduled" | "sending" | "sent" | "pending_review" | "active" | "paused" | "rejected" | undefined;
    name?: string | undefined;
    type?: "merchant" | undefined;
    description?: string | undefined;
    startDate?: string | Date | undefined;
    endDate?: string | Date | undefined;
    channel?: "email" | "sms" | "push" | "in_app" | "whatsapp" | "social" | "web" | "api" | undefined;
    targetAudience?: {
        segment?: "all" | "recent" | "lapsed" | "high_value" | "stamp_card" | undefined;
        daysInactive?: number | undefined;
        minSpend?: number | undefined;
        location?: {
            city?: string | undefined;
            pincode?: string | undefined;
            area?: string | undefined;
            radiusKm?: number | undefined;
        } | undefined;
        interests?: string[] | undefined;
        institution?: string | undefined;
        keyword?: string | undefined;
        estimatedCount?: number | undefined;
    } | undefined;
    budget?: number | undefined;
    createdBy?: string | undefined;
    storeId?: string | undefined;
    title?: string | undefined;
    discountPercentage?: number | undefined;
    maxRedemptions?: number | undefined;
    appliedProducts?: string[] | undefined;
    rewardValue?: number | undefined;
    rewardType?: string | undefined;
    durationDays?: number | undefined;
    conditions?: {
        operator: "eq" | "neq" | "gt" | "gte" | "lt" | "lte" | "in" | "not_in" | "contains" | "exists";
        field: string;
        value?: string | number | boolean | (string | number)[] | null | undefined;
    }[] | undefined;
    actions?: {
        kind: "credit_coins" | "grant_badge" | "send_notification" | "award_voucher" | "issue_coupon";
        params?: Record<string, string | number | boolean | string[] | number[] | null> | undefined;
    }[] | undefined;
    triggers?: {
        event: "manual" | "signup" | "order.placed" | "order.delivered" | "visit.completed" | "referral.invite" | "cron";
        filters?: {
            operator: "eq" | "neq" | "gt" | "gte" | "lt" | "lte" | "in" | "not_in" | "contains" | "exists";
            field: string;
            value?: string | number | boolean | (string | number)[] | null | undefined;
        }[] | undefined;
    }[] | undefined;
    priority?: number | undefined;
    cooldownDays?: number | undefined;
}>;
export declare const MerchantCampaignResponseSchema: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    status: z.ZodEnum<["draft", "scheduled", "sending", "sent", "pending_review", "active", "paused", "completed", "expired", "rejected", "failed", "cancelled"]>;
    startDate: z.ZodUnion<[z.ZodDate, z.ZodString]>;
    endDate: z.ZodOptional<z.ZodUnion<[z.ZodDate, z.ZodString]>>;
    channel: z.ZodOptional<z.ZodEnum<["email", "sms", "push", "in_app", "whatsapp", "social", "web", "api"]>>;
    targetAudience: z.ZodOptional<z.ZodObject<{
        segment: z.ZodOptional<z.ZodEnum<["all", "recent", "lapsed", "high_value", "stamp_card"]>>;
        daysInactive: z.ZodOptional<z.ZodNumber>;
        minSpend: z.ZodOptional<z.ZodNumber>;
        location: z.ZodOptional<z.ZodObject<{
            city: z.ZodOptional<z.ZodString>;
            area: z.ZodOptional<z.ZodString>;
            pincode: z.ZodOptional<z.ZodString>;
            radiusKm: z.ZodOptional<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            city?: string | undefined;
            pincode?: string | undefined;
            area?: string | undefined;
            radiusKm?: number | undefined;
        }, {
            city?: string | undefined;
            pincode?: string | undefined;
            area?: string | undefined;
            radiusKm?: number | undefined;
        }>>;
        interests: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        institution: z.ZodOptional<z.ZodString>;
        keyword: z.ZodOptional<z.ZodString>;
        estimatedCount: z.ZodOptional<z.ZodNumber>;
    }, "strict", z.ZodTypeAny, {
        segment?: "all" | "recent" | "lapsed" | "high_value" | "stamp_card" | undefined;
        daysInactive?: number | undefined;
        minSpend?: number | undefined;
        location?: {
            city?: string | undefined;
            pincode?: string | undefined;
            area?: string | undefined;
            radiusKm?: number | undefined;
        } | undefined;
        interests?: string[] | undefined;
        institution?: string | undefined;
        keyword?: string | undefined;
        estimatedCount?: number | undefined;
    }, {
        segment?: "all" | "recent" | "lapsed" | "high_value" | "stamp_card" | undefined;
        daysInactive?: number | undefined;
        minSpend?: number | undefined;
        location?: {
            city?: string | undefined;
            pincode?: string | undefined;
            area?: string | undefined;
            radiusKm?: number | undefined;
        } | undefined;
        interests?: string[] | undefined;
        institution?: string | undefined;
        keyword?: string | undefined;
        estimatedCount?: number | undefined;
    }>>;
    budget: z.ZodOptional<z.ZodNumber>;
    spent: z.ZodOptional<z.ZodNumber>;
    createdBy: z.ZodOptional<z.ZodString>;
} & {
    type: z.ZodOptional<z.ZodLiteral<"merchant">>;
    merchantId: z.ZodOptional<z.ZodString>;
    storeId: z.ZodOptional<z.ZodString>;
    title: z.ZodOptional<z.ZodString>;
    discountPercentage: z.ZodOptional<z.ZodNumber>;
    maxRedemptions: z.ZodOptional<z.ZodNumber>;
    appliedProducts: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    rewardValue: z.ZodOptional<z.ZodNumber>;
    rewardType: z.ZodOptional<z.ZodString>;
    durationDays: z.ZodOptional<z.ZodNumber>;
    conditions: z.ZodOptional<z.ZodArray<z.ZodObject<{
        field: z.ZodString;
        operator: z.ZodEnum<["eq", "neq", "gt", "gte", "lt", "lte", "in", "not_in", "contains", "exists"]>;
        value: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean, z.ZodNull, z.ZodArray<z.ZodUnion<[z.ZodString, z.ZodNumber]>, "many">]>>;
    }, "strict", z.ZodTypeAny, {
        operator: "eq" | "neq" | "gt" | "gte" | "lt" | "lte" | "in" | "not_in" | "contains" | "exists";
        field: string;
        value?: string | number | boolean | (string | number)[] | null | undefined;
    }, {
        operator: "eq" | "neq" | "gt" | "gte" | "lt" | "lte" | "in" | "not_in" | "contains" | "exists";
        field: string;
        value?: string | number | boolean | (string | number)[] | null | undefined;
    }>, "many">>;
    actions: z.ZodOptional<z.ZodArray<z.ZodObject<{
        kind: z.ZodEnum<["credit_coins", "grant_badge", "send_notification", "award_voucher", "issue_coupon"]>;
        params: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean, z.ZodNull, z.ZodArray<z.ZodString, "many">, z.ZodArray<z.ZodNumber, "many">]>>>;
    }, "strict", z.ZodTypeAny, {
        kind: "credit_coins" | "grant_badge" | "send_notification" | "award_voucher" | "issue_coupon";
        params?: Record<string, string | number | boolean | string[] | number[] | null> | undefined;
    }, {
        kind: "credit_coins" | "grant_badge" | "send_notification" | "award_voucher" | "issue_coupon";
        params?: Record<string, string | number | boolean | string[] | number[] | null> | undefined;
    }>, "many">>;
    triggers: z.ZodOptional<z.ZodArray<z.ZodObject<{
        event: z.ZodEnum<["order.placed", "order.delivered", "visit.completed", "signup", "referral.invite", "cron", "manual"]>;
        filters: z.ZodOptional<z.ZodArray<z.ZodObject<{
            field: z.ZodString;
            operator: z.ZodEnum<["eq", "neq", "gt", "gte", "lt", "lte", "in", "not_in", "contains", "exists"]>;
            value: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean, z.ZodNull, z.ZodArray<z.ZodUnion<[z.ZodString, z.ZodNumber]>, "many">]>>;
        }, "strict", z.ZodTypeAny, {
            operator: "eq" | "neq" | "gt" | "gte" | "lt" | "lte" | "in" | "not_in" | "contains" | "exists";
            field: string;
            value?: string | number | boolean | (string | number)[] | null | undefined;
        }, {
            operator: "eq" | "neq" | "gt" | "gte" | "lt" | "lte" | "in" | "not_in" | "contains" | "exists";
            field: string;
            value?: string | number | boolean | (string | number)[] | null | undefined;
        }>, "many">>;
    }, "strict", z.ZodTypeAny, {
        event: "manual" | "signup" | "order.placed" | "order.delivered" | "visit.completed" | "referral.invite" | "cron";
        filters?: {
            operator: "eq" | "neq" | "gt" | "gte" | "lt" | "lte" | "in" | "not_in" | "contains" | "exists";
            field: string;
            value?: string | number | boolean | (string | number)[] | null | undefined;
        }[] | undefined;
    }, {
        event: "manual" | "signup" | "order.placed" | "order.delivered" | "visit.completed" | "referral.invite" | "cron";
        filters?: {
            operator: "eq" | "neq" | "gt" | "gte" | "lt" | "lte" | "in" | "not_in" | "contains" | "exists";
            field: string;
            value?: string | number | boolean | (string | number)[] | null | undefined;
        }[] | undefined;
    }>, "many">>;
    priority: z.ZodOptional<z.ZodNumber>;
    cooldownDays: z.ZodOptional<z.ZodNumber>;
} & {
    _id: z.ZodOptional<z.ZodString>;
    redemptionCount: z.ZodOptional<z.ZodNumber>;
    createdAt: z.ZodOptional<z.ZodUnion<[z.ZodDate, z.ZodString]>>;
    updatedAt: z.ZodOptional<z.ZodUnion<[z.ZodDate, z.ZodString]>>;
}, "strip", z.ZodTypeAny, {
    status: "cancelled" | "completed" | "failed" | "expired" | "draft" | "scheduled" | "sending" | "sent" | "pending_review" | "active" | "paused" | "rejected";
    name: string;
    startDate: string | Date;
    spent?: number | undefined;
    merchantId?: string | undefined;
    type?: "merchant" | undefined;
    _id?: string | undefined;
    createdAt?: string | Date | undefined;
    updatedAt?: string | Date | undefined;
    description?: string | undefined;
    endDate?: string | Date | undefined;
    channel?: "email" | "sms" | "push" | "in_app" | "whatsapp" | "social" | "web" | "api" | undefined;
    targetAudience?: {
        segment?: "all" | "recent" | "lapsed" | "high_value" | "stamp_card" | undefined;
        daysInactive?: number | undefined;
        minSpend?: number | undefined;
        location?: {
            city?: string | undefined;
            pincode?: string | undefined;
            area?: string | undefined;
            radiusKm?: number | undefined;
        } | undefined;
        interests?: string[] | undefined;
        institution?: string | undefined;
        keyword?: string | undefined;
        estimatedCount?: number | undefined;
    } | undefined;
    budget?: number | undefined;
    createdBy?: string | undefined;
    storeId?: string | undefined;
    title?: string | undefined;
    discountPercentage?: number | undefined;
    maxRedemptions?: number | undefined;
    appliedProducts?: string[] | undefined;
    rewardValue?: number | undefined;
    rewardType?: string | undefined;
    durationDays?: number | undefined;
    conditions?: {
        operator: "eq" | "neq" | "gt" | "gte" | "lt" | "lte" | "in" | "not_in" | "contains" | "exists";
        field: string;
        value?: string | number | boolean | (string | number)[] | null | undefined;
    }[] | undefined;
    actions?: {
        kind: "credit_coins" | "grant_badge" | "send_notification" | "award_voucher" | "issue_coupon";
        params?: Record<string, string | number | boolean | string[] | number[] | null> | undefined;
    }[] | undefined;
    triggers?: {
        event: "manual" | "signup" | "order.placed" | "order.delivered" | "visit.completed" | "referral.invite" | "cron";
        filters?: {
            operator: "eq" | "neq" | "gt" | "gte" | "lt" | "lte" | "in" | "not_in" | "contains" | "exists";
            field: string;
            value?: string | number | boolean | (string | number)[] | null | undefined;
        }[] | undefined;
    }[] | undefined;
    priority?: number | undefined;
    cooldownDays?: number | undefined;
    redemptionCount?: number | undefined;
}, {
    status: "cancelled" | "completed" | "failed" | "expired" | "draft" | "scheduled" | "sending" | "sent" | "pending_review" | "active" | "paused" | "rejected";
    name: string;
    startDate: string | Date;
    spent?: number | undefined;
    merchantId?: string | undefined;
    type?: "merchant" | undefined;
    _id?: string | undefined;
    createdAt?: string | Date | undefined;
    updatedAt?: string | Date | undefined;
    description?: string | undefined;
    endDate?: string | Date | undefined;
    channel?: "email" | "sms" | "push" | "in_app" | "whatsapp" | "social" | "web" | "api" | undefined;
    targetAudience?: {
        segment?: "all" | "recent" | "lapsed" | "high_value" | "stamp_card" | undefined;
        daysInactive?: number | undefined;
        minSpend?: number | undefined;
        location?: {
            city?: string | undefined;
            pincode?: string | undefined;
            area?: string | undefined;
            radiusKm?: number | undefined;
        } | undefined;
        interests?: string[] | undefined;
        institution?: string | undefined;
        keyword?: string | undefined;
        estimatedCount?: number | undefined;
    } | undefined;
    budget?: number | undefined;
    createdBy?: string | undefined;
    storeId?: string | undefined;
    title?: string | undefined;
    discountPercentage?: number | undefined;
    maxRedemptions?: number | undefined;
    appliedProducts?: string[] | undefined;
    rewardValue?: number | undefined;
    rewardType?: string | undefined;
    durationDays?: number | undefined;
    conditions?: {
        operator: "eq" | "neq" | "gt" | "gte" | "lt" | "lte" | "in" | "not_in" | "contains" | "exists";
        field: string;
        value?: string | number | boolean | (string | number)[] | null | undefined;
    }[] | undefined;
    actions?: {
        kind: "credit_coins" | "grant_badge" | "send_notification" | "award_voucher" | "issue_coupon";
        params?: Record<string, string | number | boolean | string[] | number[] | null> | undefined;
    }[] | undefined;
    triggers?: {
        event: "manual" | "signup" | "order.placed" | "order.delivered" | "visit.completed" | "referral.invite" | "cron";
        filters?: {
            operator: "eq" | "neq" | "gt" | "gte" | "lt" | "lte" | "in" | "not_in" | "contains" | "exists";
            field: string;
            value?: string | number | boolean | (string | number)[] | null | undefined;
        }[] | undefined;
    }[] | undefined;
    priority?: number | undefined;
    cooldownDays?: number | undefined;
    redemptionCount?: number | undefined;
}>;
export declare const CampaignResponseSchema: z.ZodUnion<[z.ZodObject<{
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    status: z.ZodEnum<["draft", "scheduled", "sending", "sent", "pending_review", "active", "paused", "completed", "expired", "rejected", "failed", "cancelled"]>;
    startDate: z.ZodUnion<[z.ZodDate, z.ZodString]>;
    endDate: z.ZodOptional<z.ZodUnion<[z.ZodDate, z.ZodString]>>;
    channel: z.ZodOptional<z.ZodEnum<["email", "sms", "push", "in_app", "whatsapp", "social", "web", "api"]>>;
    targetAudience: z.ZodOptional<z.ZodObject<{
        segment: z.ZodOptional<z.ZodEnum<["all", "recent", "lapsed", "high_value", "stamp_card"]>>;
        daysInactive: z.ZodOptional<z.ZodNumber>;
        minSpend: z.ZodOptional<z.ZodNumber>;
        location: z.ZodOptional<z.ZodObject<{
            city: z.ZodOptional<z.ZodString>;
            area: z.ZodOptional<z.ZodString>;
            pincode: z.ZodOptional<z.ZodString>;
            radiusKm: z.ZodOptional<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            city?: string | undefined;
            pincode?: string | undefined;
            area?: string | undefined;
            radiusKm?: number | undefined;
        }, {
            city?: string | undefined;
            pincode?: string | undefined;
            area?: string | undefined;
            radiusKm?: number | undefined;
        }>>;
        interests: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        institution: z.ZodOptional<z.ZodString>;
        keyword: z.ZodOptional<z.ZodString>;
        estimatedCount: z.ZodOptional<z.ZodNumber>;
    }, "strict", z.ZodTypeAny, {
        segment?: "all" | "recent" | "lapsed" | "high_value" | "stamp_card" | undefined;
        daysInactive?: number | undefined;
        minSpend?: number | undefined;
        location?: {
            city?: string | undefined;
            pincode?: string | undefined;
            area?: string | undefined;
            radiusKm?: number | undefined;
        } | undefined;
        interests?: string[] | undefined;
        institution?: string | undefined;
        keyword?: string | undefined;
        estimatedCount?: number | undefined;
    }, {
        segment?: "all" | "recent" | "lapsed" | "high_value" | "stamp_card" | undefined;
        daysInactive?: number | undefined;
        minSpend?: number | undefined;
        location?: {
            city?: string | undefined;
            pincode?: string | undefined;
            area?: string | undefined;
            radiusKm?: number | undefined;
        } | undefined;
        interests?: string[] | undefined;
        institution?: string | undefined;
        keyword?: string | undefined;
        estimatedCount?: number | undefined;
    }>>;
    budget: z.ZodOptional<z.ZodNumber>;
    spent: z.ZodOptional<z.ZodNumber>;
    createdBy: z.ZodOptional<z.ZodString>;
} & {
    type: z.ZodOptional<z.ZodLiteral<"marketing">>;
    merchantId: z.ZodOptional<z.ZodString>;
    objective: z.ZodOptional<z.ZodEnum<["awareness", "engagement", "sales", "win_back"]>>;
    message: z.ZodOptional<z.ZodString>;
    templateName: z.ZodOptional<z.ZodString>;
    imageUrl: z.ZodOptional<z.ZodString>;
    ctaUrl: z.ZodOptional<z.ZodString>;
    ctaText: z.ZodOptional<z.ZodString>;
    audience: z.ZodOptional<z.ZodObject<{
        segment: z.ZodOptional<z.ZodEnum<["all", "recent", "lapsed", "high_value", "stamp_card"]>>;
        daysInactive: z.ZodOptional<z.ZodNumber>;
        minSpend: z.ZodOptional<z.ZodNumber>;
        location: z.ZodOptional<z.ZodObject<{
            city: z.ZodOptional<z.ZodString>;
            area: z.ZodOptional<z.ZodString>;
            pincode: z.ZodOptional<z.ZodString>;
            radiusKm: z.ZodOptional<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            city?: string | undefined;
            pincode?: string | undefined;
            area?: string | undefined;
            radiusKm?: number | undefined;
        }, {
            city?: string | undefined;
            pincode?: string | undefined;
            area?: string | undefined;
            radiusKm?: number | undefined;
        }>>;
        interests: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        institution: z.ZodOptional<z.ZodString>;
        keyword: z.ZodOptional<z.ZodString>;
        estimatedCount: z.ZodOptional<z.ZodNumber>;
    }, "strict", z.ZodTypeAny, {
        segment?: "all" | "recent" | "lapsed" | "high_value" | "stamp_card" | undefined;
        daysInactive?: number | undefined;
        minSpend?: number | undefined;
        location?: {
            city?: string | undefined;
            pincode?: string | undefined;
            area?: string | undefined;
            radiusKm?: number | undefined;
        } | undefined;
        interests?: string[] | undefined;
        institution?: string | undefined;
        keyword?: string | undefined;
        estimatedCount?: number | undefined;
    }, {
        segment?: "all" | "recent" | "lapsed" | "high_value" | "stamp_card" | undefined;
        daysInactive?: number | undefined;
        minSpend?: number | undefined;
        location?: {
            city?: string | undefined;
            pincode?: string | undefined;
            area?: string | undefined;
            radiusKm?: number | undefined;
        } | undefined;
        interests?: string[] | undefined;
        institution?: string | undefined;
        keyword?: string | undefined;
        estimatedCount?: number | undefined;
    }>>;
    scheduledAt: z.ZodOptional<z.ZodUnion<[z.ZodDate, z.ZodString]>>;
    dailyBudget: z.ZodOptional<z.ZodNumber>;
    attributionWindowDays: z.ZodOptional<z.ZodNumber>;
} & {
    _id: z.ZodOptional<z.ZodString>;
    sentAt: z.ZodOptional<z.ZodUnion<[z.ZodDate, z.ZodString]>>;
    stats: z.ZodOptional<z.ZodObject<{
        sent: z.ZodOptional<z.ZodNumber>;
        delivered: z.ZodOptional<z.ZodNumber>;
        failed: z.ZodOptional<z.ZodNumber>;
        deduped: z.ZodOptional<z.ZodNumber>;
        opened: z.ZodOptional<z.ZodNumber>;
        clicked: z.ZodOptional<z.ZodNumber>;
        converted: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        delivered?: number | undefined;
        failed?: number | undefined;
        sent?: number | undefined;
        deduped?: number | undefined;
        opened?: number | undefined;
        clicked?: number | undefined;
        converted?: number | undefined;
    }, {
        delivered?: number | undefined;
        failed?: number | undefined;
        sent?: number | undefined;
        deduped?: number | undefined;
        opened?: number | undefined;
        clicked?: number | undefined;
        converted?: number | undefined;
    }>>;
    errorMessage: z.ZodOptional<z.ZodString>;
    totalSpent: z.ZodOptional<z.ZodNumber>;
    createdAt: z.ZodOptional<z.ZodUnion<[z.ZodDate, z.ZodString]>>;
    updatedAt: z.ZodOptional<z.ZodUnion<[z.ZodDate, z.ZodString]>>;
}, "strip", z.ZodTypeAny, {
    status: "cancelled" | "completed" | "failed" | "expired" | "draft" | "scheduled" | "sending" | "sent" | "pending_review" | "active" | "paused" | "rejected";
    name: string;
    startDate: string | Date;
    spent?: number | undefined;
    merchantId?: string | undefined;
    ctaText?: string | undefined;
    imageUrl?: string | undefined;
    message?: string | undefined;
    type?: "marketing" | undefined;
    _id?: string | undefined;
    createdAt?: string | Date | undefined;
    updatedAt?: string | Date | undefined;
    description?: string | undefined;
    endDate?: string | Date | undefined;
    channel?: "email" | "sms" | "push" | "in_app" | "whatsapp" | "social" | "web" | "api" | undefined;
    targetAudience?: {
        segment?: "all" | "recent" | "lapsed" | "high_value" | "stamp_card" | undefined;
        daysInactive?: number | undefined;
        minSpend?: number | undefined;
        location?: {
            city?: string | undefined;
            pincode?: string | undefined;
            area?: string | undefined;
            radiusKm?: number | undefined;
        } | undefined;
        interests?: string[] | undefined;
        institution?: string | undefined;
        keyword?: string | undefined;
        estimatedCount?: number | undefined;
    } | undefined;
    budget?: number | undefined;
    createdBy?: string | undefined;
    objective?: "awareness" | "engagement" | "sales" | "win_back" | undefined;
    templateName?: string | undefined;
    ctaUrl?: string | undefined;
    audience?: {
        segment?: "all" | "recent" | "lapsed" | "high_value" | "stamp_card" | undefined;
        daysInactive?: number | undefined;
        minSpend?: number | undefined;
        location?: {
            city?: string | undefined;
            pincode?: string | undefined;
            area?: string | undefined;
            radiusKm?: number | undefined;
        } | undefined;
        interests?: string[] | undefined;
        institution?: string | undefined;
        keyword?: string | undefined;
        estimatedCount?: number | undefined;
    } | undefined;
    scheduledAt?: string | Date | undefined;
    dailyBudget?: number | undefined;
    attributionWindowDays?: number | undefined;
    sentAt?: string | Date | undefined;
    stats?: {
        delivered?: number | undefined;
        failed?: number | undefined;
        sent?: number | undefined;
        deduped?: number | undefined;
        opened?: number | undefined;
        clicked?: number | undefined;
        converted?: number | undefined;
    } | undefined;
    errorMessage?: string | undefined;
    totalSpent?: number | undefined;
}, {
    status: "cancelled" | "completed" | "failed" | "expired" | "draft" | "scheduled" | "sending" | "sent" | "pending_review" | "active" | "paused" | "rejected";
    name: string;
    startDate: string | Date;
    spent?: number | undefined;
    merchantId?: string | undefined;
    ctaText?: string | undefined;
    imageUrl?: string | undefined;
    message?: string | undefined;
    type?: "marketing" | undefined;
    _id?: string | undefined;
    createdAt?: string | Date | undefined;
    updatedAt?: string | Date | undefined;
    description?: string | undefined;
    endDate?: string | Date | undefined;
    channel?: "email" | "sms" | "push" | "in_app" | "whatsapp" | "social" | "web" | "api" | undefined;
    targetAudience?: {
        segment?: "all" | "recent" | "lapsed" | "high_value" | "stamp_card" | undefined;
        daysInactive?: number | undefined;
        minSpend?: number | undefined;
        location?: {
            city?: string | undefined;
            pincode?: string | undefined;
            area?: string | undefined;
            radiusKm?: number | undefined;
        } | undefined;
        interests?: string[] | undefined;
        institution?: string | undefined;
        keyword?: string | undefined;
        estimatedCount?: number | undefined;
    } | undefined;
    budget?: number | undefined;
    createdBy?: string | undefined;
    objective?: "awareness" | "engagement" | "sales" | "win_back" | undefined;
    templateName?: string | undefined;
    ctaUrl?: string | undefined;
    audience?: {
        segment?: "all" | "recent" | "lapsed" | "high_value" | "stamp_card" | undefined;
        daysInactive?: number | undefined;
        minSpend?: number | undefined;
        location?: {
            city?: string | undefined;
            pincode?: string | undefined;
            area?: string | undefined;
            radiusKm?: number | undefined;
        } | undefined;
        interests?: string[] | undefined;
        institution?: string | undefined;
        keyword?: string | undefined;
        estimatedCount?: number | undefined;
    } | undefined;
    scheduledAt?: string | Date | undefined;
    dailyBudget?: number | undefined;
    attributionWindowDays?: number | undefined;
    sentAt?: string | Date | undefined;
    stats?: {
        delivered?: number | undefined;
        failed?: number | undefined;
        sent?: number | undefined;
        deduped?: number | undefined;
        opened?: number | undefined;
        clicked?: number | undefined;
        converted?: number | undefined;
    } | undefined;
    errorMessage?: string | undefined;
    totalSpent?: number | undefined;
}>, z.ZodObject<{
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    status: z.ZodEnum<["draft", "scheduled", "sending", "sent", "pending_review", "active", "paused", "completed", "expired", "rejected", "failed", "cancelled"]>;
    startDate: z.ZodUnion<[z.ZodDate, z.ZodString]>;
    endDate: z.ZodOptional<z.ZodUnion<[z.ZodDate, z.ZodString]>>;
    channel: z.ZodOptional<z.ZodEnum<["email", "sms", "push", "in_app", "whatsapp", "social", "web", "api"]>>;
    targetAudience: z.ZodOptional<z.ZodObject<{
        segment: z.ZodOptional<z.ZodEnum<["all", "recent", "lapsed", "high_value", "stamp_card"]>>;
        daysInactive: z.ZodOptional<z.ZodNumber>;
        minSpend: z.ZodOptional<z.ZodNumber>;
        location: z.ZodOptional<z.ZodObject<{
            city: z.ZodOptional<z.ZodString>;
            area: z.ZodOptional<z.ZodString>;
            pincode: z.ZodOptional<z.ZodString>;
            radiusKm: z.ZodOptional<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            city?: string | undefined;
            pincode?: string | undefined;
            area?: string | undefined;
            radiusKm?: number | undefined;
        }, {
            city?: string | undefined;
            pincode?: string | undefined;
            area?: string | undefined;
            radiusKm?: number | undefined;
        }>>;
        interests: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        institution: z.ZodOptional<z.ZodString>;
        keyword: z.ZodOptional<z.ZodString>;
        estimatedCount: z.ZodOptional<z.ZodNumber>;
    }, "strict", z.ZodTypeAny, {
        segment?: "all" | "recent" | "lapsed" | "high_value" | "stamp_card" | undefined;
        daysInactive?: number | undefined;
        minSpend?: number | undefined;
        location?: {
            city?: string | undefined;
            pincode?: string | undefined;
            area?: string | undefined;
            radiusKm?: number | undefined;
        } | undefined;
        interests?: string[] | undefined;
        institution?: string | undefined;
        keyword?: string | undefined;
        estimatedCount?: number | undefined;
    }, {
        segment?: "all" | "recent" | "lapsed" | "high_value" | "stamp_card" | undefined;
        daysInactive?: number | undefined;
        minSpend?: number | undefined;
        location?: {
            city?: string | undefined;
            pincode?: string | undefined;
            area?: string | undefined;
            radiusKm?: number | undefined;
        } | undefined;
        interests?: string[] | undefined;
        institution?: string | undefined;
        keyword?: string | undefined;
        estimatedCount?: number | undefined;
    }>>;
    budget: z.ZodOptional<z.ZodNumber>;
    spent: z.ZodOptional<z.ZodNumber>;
    createdBy: z.ZodOptional<z.ZodString>;
} & {
    type: z.ZodOptional<z.ZodLiteral<"ad">>;
    merchantId: z.ZodOptional<z.ZodString>;
    storeId: z.ZodOptional<z.ZodString>;
    title: z.ZodOptional<z.ZodString>;
    headline: z.ZodOptional<z.ZodString>;
    ctaText: z.ZodOptional<z.ZodString>;
    ctaUrl: z.ZodOptional<z.ZodString>;
    imageUrl: z.ZodOptional<z.ZodString>;
    placement: z.ZodOptional<z.ZodEnum<["home_banner", "explore_feed", "store_listing", "search_result"]>>;
    targetSegment: z.ZodOptional<z.ZodEnum<["all", "new", "loyal", "lapsed", "nearby"]>>;
    targetLocation: z.ZodOptional<z.ZodObject<{
        city: z.ZodOptional<z.ZodString>;
        radiusKm: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        city?: string | undefined;
        radiusKm?: number | undefined;
    }, {
        city?: string | undefined;
        radiusKm?: number | undefined;
    }>>;
    targetInterests: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    bidType: z.ZodOptional<z.ZodEnum<["CPC", "CPM"]>>;
    bidAmount: z.ZodOptional<z.ZodNumber>;
    dailyBudget: z.ZodOptional<z.ZodNumber>;
    totalBudget: z.ZodOptional<z.ZodNumber>;
    frequencyCapDays: z.ZodOptional<z.ZodNumber>;
} & {
    _id: z.ZodOptional<z.ZodString>;
    totalSpent: z.ZodOptional<z.ZodNumber>;
    impressions: z.ZodOptional<z.ZodNumber>;
    clicks: z.ZodOptional<z.ZodNumber>;
    ctr: z.ZodOptional<z.ZodNumber>;
    reviewedBy: z.ZodOptional<z.ZodString>;
    reviewedAt: z.ZodOptional<z.ZodUnion<[z.ZodDate, z.ZodString]>>;
    rejectionReason: z.ZodOptional<z.ZodString>;
    createdAt: z.ZodOptional<z.ZodUnion<[z.ZodDate, z.ZodString]>>;
    updatedAt: z.ZodOptional<z.ZodUnion<[z.ZodDate, z.ZodString]>>;
}, "strip", z.ZodTypeAny, {
    status: "cancelled" | "completed" | "failed" | "expired" | "draft" | "scheduled" | "sending" | "sent" | "pending_review" | "active" | "paused" | "rejected";
    name: string;
    startDate: string | Date;
    spent?: number | undefined;
    merchantId?: string | undefined;
    ctaText?: string | undefined;
    imageUrl?: string | undefined;
    type?: "ad" | undefined;
    _id?: string | undefined;
    createdAt?: string | Date | undefined;
    updatedAt?: string | Date | undefined;
    description?: string | undefined;
    endDate?: string | Date | undefined;
    channel?: "email" | "sms" | "push" | "in_app" | "whatsapp" | "social" | "web" | "api" | undefined;
    targetAudience?: {
        segment?: "all" | "recent" | "lapsed" | "high_value" | "stamp_card" | undefined;
        daysInactive?: number | undefined;
        minSpend?: number | undefined;
        location?: {
            city?: string | undefined;
            pincode?: string | undefined;
            area?: string | undefined;
            radiusKm?: number | undefined;
        } | undefined;
        interests?: string[] | undefined;
        institution?: string | undefined;
        keyword?: string | undefined;
        estimatedCount?: number | undefined;
    } | undefined;
    budget?: number | undefined;
    createdBy?: string | undefined;
    ctaUrl?: string | undefined;
    dailyBudget?: number | undefined;
    totalSpent?: number | undefined;
    storeId?: string | undefined;
    title?: string | undefined;
    headline?: string | undefined;
    placement?: "home_banner" | "explore_feed" | "store_listing" | "search_result" | undefined;
    targetSegment?: "all" | "lapsed" | "new" | "loyal" | "nearby" | undefined;
    targetLocation?: {
        city?: string | undefined;
        radiusKm?: number | undefined;
    } | undefined;
    targetInterests?: string[] | undefined;
    bidType?: "CPC" | "CPM" | undefined;
    bidAmount?: number | undefined;
    totalBudget?: number | undefined;
    frequencyCapDays?: number | undefined;
    impressions?: number | undefined;
    clicks?: number | undefined;
    ctr?: number | undefined;
    reviewedBy?: string | undefined;
    reviewedAt?: string | Date | undefined;
    rejectionReason?: string | undefined;
}, {
    status: "cancelled" | "completed" | "failed" | "expired" | "draft" | "scheduled" | "sending" | "sent" | "pending_review" | "active" | "paused" | "rejected";
    name: string;
    startDate: string | Date;
    spent?: number | undefined;
    merchantId?: string | undefined;
    ctaText?: string | undefined;
    imageUrl?: string | undefined;
    type?: "ad" | undefined;
    _id?: string | undefined;
    createdAt?: string | Date | undefined;
    updatedAt?: string | Date | undefined;
    description?: string | undefined;
    endDate?: string | Date | undefined;
    channel?: "email" | "sms" | "push" | "in_app" | "whatsapp" | "social" | "web" | "api" | undefined;
    targetAudience?: {
        segment?: "all" | "recent" | "lapsed" | "high_value" | "stamp_card" | undefined;
        daysInactive?: number | undefined;
        minSpend?: number | undefined;
        location?: {
            city?: string | undefined;
            pincode?: string | undefined;
            area?: string | undefined;
            radiusKm?: number | undefined;
        } | undefined;
        interests?: string[] | undefined;
        institution?: string | undefined;
        keyword?: string | undefined;
        estimatedCount?: number | undefined;
    } | undefined;
    budget?: number | undefined;
    createdBy?: string | undefined;
    ctaUrl?: string | undefined;
    dailyBudget?: number | undefined;
    totalSpent?: number | undefined;
    storeId?: string | undefined;
    title?: string | undefined;
    headline?: string | undefined;
    placement?: "home_banner" | "explore_feed" | "store_listing" | "search_result" | undefined;
    targetSegment?: "all" | "lapsed" | "new" | "loyal" | "nearby" | undefined;
    targetLocation?: {
        city?: string | undefined;
        radiusKm?: number | undefined;
    } | undefined;
    targetInterests?: string[] | undefined;
    bidType?: "CPC" | "CPM" | undefined;
    bidAmount?: number | undefined;
    totalBudget?: number | undefined;
    frequencyCapDays?: number | undefined;
    impressions?: number | undefined;
    clicks?: number | undefined;
    ctr?: number | undefined;
    reviewedBy?: string | undefined;
    reviewedAt?: string | Date | undefined;
    rejectionReason?: string | undefined;
}>, z.ZodObject<{
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    status: z.ZodEnum<["draft", "scheduled", "sending", "sent", "pending_review", "active", "paused", "completed", "expired", "rejected", "failed", "cancelled"]>;
    startDate: z.ZodUnion<[z.ZodDate, z.ZodString]>;
    endDate: z.ZodOptional<z.ZodUnion<[z.ZodDate, z.ZodString]>>;
    channel: z.ZodOptional<z.ZodEnum<["email", "sms", "push", "in_app", "whatsapp", "social", "web", "api"]>>;
    targetAudience: z.ZodOptional<z.ZodObject<{
        segment: z.ZodOptional<z.ZodEnum<["all", "recent", "lapsed", "high_value", "stamp_card"]>>;
        daysInactive: z.ZodOptional<z.ZodNumber>;
        minSpend: z.ZodOptional<z.ZodNumber>;
        location: z.ZodOptional<z.ZodObject<{
            city: z.ZodOptional<z.ZodString>;
            area: z.ZodOptional<z.ZodString>;
            pincode: z.ZodOptional<z.ZodString>;
            radiusKm: z.ZodOptional<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            city?: string | undefined;
            pincode?: string | undefined;
            area?: string | undefined;
            radiusKm?: number | undefined;
        }, {
            city?: string | undefined;
            pincode?: string | undefined;
            area?: string | undefined;
            radiusKm?: number | undefined;
        }>>;
        interests: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        institution: z.ZodOptional<z.ZodString>;
        keyword: z.ZodOptional<z.ZodString>;
        estimatedCount: z.ZodOptional<z.ZodNumber>;
    }, "strict", z.ZodTypeAny, {
        segment?: "all" | "recent" | "lapsed" | "high_value" | "stamp_card" | undefined;
        daysInactive?: number | undefined;
        minSpend?: number | undefined;
        location?: {
            city?: string | undefined;
            pincode?: string | undefined;
            area?: string | undefined;
            radiusKm?: number | undefined;
        } | undefined;
        interests?: string[] | undefined;
        institution?: string | undefined;
        keyword?: string | undefined;
        estimatedCount?: number | undefined;
    }, {
        segment?: "all" | "recent" | "lapsed" | "high_value" | "stamp_card" | undefined;
        daysInactive?: number | undefined;
        minSpend?: number | undefined;
        location?: {
            city?: string | undefined;
            pincode?: string | undefined;
            area?: string | undefined;
            radiusKm?: number | undefined;
        } | undefined;
        interests?: string[] | undefined;
        institution?: string | undefined;
        keyword?: string | undefined;
        estimatedCount?: number | undefined;
    }>>;
    budget: z.ZodOptional<z.ZodNumber>;
    spent: z.ZodOptional<z.ZodNumber>;
    createdBy: z.ZodOptional<z.ZodString>;
} & {
    type: z.ZodOptional<z.ZodLiteral<"merchant">>;
    merchantId: z.ZodOptional<z.ZodString>;
    storeId: z.ZodOptional<z.ZodString>;
    title: z.ZodOptional<z.ZodString>;
    discountPercentage: z.ZodOptional<z.ZodNumber>;
    maxRedemptions: z.ZodOptional<z.ZodNumber>;
    appliedProducts: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    rewardValue: z.ZodOptional<z.ZodNumber>;
    rewardType: z.ZodOptional<z.ZodString>;
    durationDays: z.ZodOptional<z.ZodNumber>;
    conditions: z.ZodOptional<z.ZodArray<z.ZodObject<{
        field: z.ZodString;
        operator: z.ZodEnum<["eq", "neq", "gt", "gte", "lt", "lte", "in", "not_in", "contains", "exists"]>;
        value: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean, z.ZodNull, z.ZodArray<z.ZodUnion<[z.ZodString, z.ZodNumber]>, "many">]>>;
    }, "strict", z.ZodTypeAny, {
        operator: "eq" | "neq" | "gt" | "gte" | "lt" | "lte" | "in" | "not_in" | "contains" | "exists";
        field: string;
        value?: string | number | boolean | (string | number)[] | null | undefined;
    }, {
        operator: "eq" | "neq" | "gt" | "gte" | "lt" | "lte" | "in" | "not_in" | "contains" | "exists";
        field: string;
        value?: string | number | boolean | (string | number)[] | null | undefined;
    }>, "many">>;
    actions: z.ZodOptional<z.ZodArray<z.ZodObject<{
        kind: z.ZodEnum<["credit_coins", "grant_badge", "send_notification", "award_voucher", "issue_coupon"]>;
        params: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean, z.ZodNull, z.ZodArray<z.ZodString, "many">, z.ZodArray<z.ZodNumber, "many">]>>>;
    }, "strict", z.ZodTypeAny, {
        kind: "credit_coins" | "grant_badge" | "send_notification" | "award_voucher" | "issue_coupon";
        params?: Record<string, string | number | boolean | string[] | number[] | null> | undefined;
    }, {
        kind: "credit_coins" | "grant_badge" | "send_notification" | "award_voucher" | "issue_coupon";
        params?: Record<string, string | number | boolean | string[] | number[] | null> | undefined;
    }>, "many">>;
    triggers: z.ZodOptional<z.ZodArray<z.ZodObject<{
        event: z.ZodEnum<["order.placed", "order.delivered", "visit.completed", "signup", "referral.invite", "cron", "manual"]>;
        filters: z.ZodOptional<z.ZodArray<z.ZodObject<{
            field: z.ZodString;
            operator: z.ZodEnum<["eq", "neq", "gt", "gte", "lt", "lte", "in", "not_in", "contains", "exists"]>;
            value: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean, z.ZodNull, z.ZodArray<z.ZodUnion<[z.ZodString, z.ZodNumber]>, "many">]>>;
        }, "strict", z.ZodTypeAny, {
            operator: "eq" | "neq" | "gt" | "gte" | "lt" | "lte" | "in" | "not_in" | "contains" | "exists";
            field: string;
            value?: string | number | boolean | (string | number)[] | null | undefined;
        }, {
            operator: "eq" | "neq" | "gt" | "gte" | "lt" | "lte" | "in" | "not_in" | "contains" | "exists";
            field: string;
            value?: string | number | boolean | (string | number)[] | null | undefined;
        }>, "many">>;
    }, "strict", z.ZodTypeAny, {
        event: "manual" | "signup" | "order.placed" | "order.delivered" | "visit.completed" | "referral.invite" | "cron";
        filters?: {
            operator: "eq" | "neq" | "gt" | "gte" | "lt" | "lte" | "in" | "not_in" | "contains" | "exists";
            field: string;
            value?: string | number | boolean | (string | number)[] | null | undefined;
        }[] | undefined;
    }, {
        event: "manual" | "signup" | "order.placed" | "order.delivered" | "visit.completed" | "referral.invite" | "cron";
        filters?: {
            operator: "eq" | "neq" | "gt" | "gte" | "lt" | "lte" | "in" | "not_in" | "contains" | "exists";
            field: string;
            value?: string | number | boolean | (string | number)[] | null | undefined;
        }[] | undefined;
    }>, "many">>;
    priority: z.ZodOptional<z.ZodNumber>;
    cooldownDays: z.ZodOptional<z.ZodNumber>;
} & {
    _id: z.ZodOptional<z.ZodString>;
    redemptionCount: z.ZodOptional<z.ZodNumber>;
    createdAt: z.ZodOptional<z.ZodUnion<[z.ZodDate, z.ZodString]>>;
    updatedAt: z.ZodOptional<z.ZodUnion<[z.ZodDate, z.ZodString]>>;
}, "strip", z.ZodTypeAny, {
    status: "cancelled" | "completed" | "failed" | "expired" | "draft" | "scheduled" | "sending" | "sent" | "pending_review" | "active" | "paused" | "rejected";
    name: string;
    startDate: string | Date;
    spent?: number | undefined;
    merchantId?: string | undefined;
    type?: "merchant" | undefined;
    _id?: string | undefined;
    createdAt?: string | Date | undefined;
    updatedAt?: string | Date | undefined;
    description?: string | undefined;
    endDate?: string | Date | undefined;
    channel?: "email" | "sms" | "push" | "in_app" | "whatsapp" | "social" | "web" | "api" | undefined;
    targetAudience?: {
        segment?: "all" | "recent" | "lapsed" | "high_value" | "stamp_card" | undefined;
        daysInactive?: number | undefined;
        minSpend?: number | undefined;
        location?: {
            city?: string | undefined;
            pincode?: string | undefined;
            area?: string | undefined;
            radiusKm?: number | undefined;
        } | undefined;
        interests?: string[] | undefined;
        institution?: string | undefined;
        keyword?: string | undefined;
        estimatedCount?: number | undefined;
    } | undefined;
    budget?: number | undefined;
    createdBy?: string | undefined;
    storeId?: string | undefined;
    title?: string | undefined;
    discountPercentage?: number | undefined;
    maxRedemptions?: number | undefined;
    appliedProducts?: string[] | undefined;
    rewardValue?: number | undefined;
    rewardType?: string | undefined;
    durationDays?: number | undefined;
    conditions?: {
        operator: "eq" | "neq" | "gt" | "gte" | "lt" | "lte" | "in" | "not_in" | "contains" | "exists";
        field: string;
        value?: string | number | boolean | (string | number)[] | null | undefined;
    }[] | undefined;
    actions?: {
        kind: "credit_coins" | "grant_badge" | "send_notification" | "award_voucher" | "issue_coupon";
        params?: Record<string, string | number | boolean | string[] | number[] | null> | undefined;
    }[] | undefined;
    triggers?: {
        event: "manual" | "signup" | "order.placed" | "order.delivered" | "visit.completed" | "referral.invite" | "cron";
        filters?: {
            operator: "eq" | "neq" | "gt" | "gte" | "lt" | "lte" | "in" | "not_in" | "contains" | "exists";
            field: string;
            value?: string | number | boolean | (string | number)[] | null | undefined;
        }[] | undefined;
    }[] | undefined;
    priority?: number | undefined;
    cooldownDays?: number | undefined;
    redemptionCount?: number | undefined;
}, {
    status: "cancelled" | "completed" | "failed" | "expired" | "draft" | "scheduled" | "sending" | "sent" | "pending_review" | "active" | "paused" | "rejected";
    name: string;
    startDate: string | Date;
    spent?: number | undefined;
    merchantId?: string | undefined;
    type?: "merchant" | undefined;
    _id?: string | undefined;
    createdAt?: string | Date | undefined;
    updatedAt?: string | Date | undefined;
    description?: string | undefined;
    endDate?: string | Date | undefined;
    channel?: "email" | "sms" | "push" | "in_app" | "whatsapp" | "social" | "web" | "api" | undefined;
    targetAudience?: {
        segment?: "all" | "recent" | "lapsed" | "high_value" | "stamp_card" | undefined;
        daysInactive?: number | undefined;
        minSpend?: number | undefined;
        location?: {
            city?: string | undefined;
            pincode?: string | undefined;
            area?: string | undefined;
            radiusKm?: number | undefined;
        } | undefined;
        interests?: string[] | undefined;
        institution?: string | undefined;
        keyword?: string | undefined;
        estimatedCount?: number | undefined;
    } | undefined;
    budget?: number | undefined;
    createdBy?: string | undefined;
    storeId?: string | undefined;
    title?: string | undefined;
    discountPercentage?: number | undefined;
    maxRedemptions?: number | undefined;
    appliedProducts?: string[] | undefined;
    rewardValue?: number | undefined;
    rewardType?: string | undefined;
    durationDays?: number | undefined;
    conditions?: {
        operator: "eq" | "neq" | "gt" | "gte" | "lt" | "lte" | "in" | "not_in" | "contains" | "exists";
        field: string;
        value?: string | number | boolean | (string | number)[] | null | undefined;
    }[] | undefined;
    actions?: {
        kind: "credit_coins" | "grant_badge" | "send_notification" | "award_voucher" | "issue_coupon";
        params?: Record<string, string | number | boolean | string[] | number[] | null> | undefined;
    }[] | undefined;
    triggers?: {
        event: "manual" | "signup" | "order.placed" | "order.delivered" | "visit.completed" | "referral.invite" | "cron";
        filters?: {
            operator: "eq" | "neq" | "gt" | "gte" | "lt" | "lte" | "in" | "not_in" | "contains" | "exists";
            field: string;
            value?: string | number | boolean | (string | number)[] | null | undefined;
        }[] | undefined;
    }[] | undefined;
    priority?: number | undefined;
    cooldownDays?: number | undefined;
    redemptionCount?: number | undefined;
}>]>;
export declare const CampaignListResponseSchema: z.ZodArray<z.ZodUnion<[z.ZodObject<{
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    status: z.ZodEnum<["draft", "scheduled", "sending", "sent", "pending_review", "active", "paused", "completed", "expired", "rejected", "failed", "cancelled"]>;
    startDate: z.ZodUnion<[z.ZodDate, z.ZodString]>;
    endDate: z.ZodOptional<z.ZodUnion<[z.ZodDate, z.ZodString]>>;
    channel: z.ZodOptional<z.ZodEnum<["email", "sms", "push", "in_app", "whatsapp", "social", "web", "api"]>>;
    targetAudience: z.ZodOptional<z.ZodObject<{
        segment: z.ZodOptional<z.ZodEnum<["all", "recent", "lapsed", "high_value", "stamp_card"]>>;
        daysInactive: z.ZodOptional<z.ZodNumber>;
        minSpend: z.ZodOptional<z.ZodNumber>;
        location: z.ZodOptional<z.ZodObject<{
            city: z.ZodOptional<z.ZodString>;
            area: z.ZodOptional<z.ZodString>;
            pincode: z.ZodOptional<z.ZodString>;
            radiusKm: z.ZodOptional<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            city?: string | undefined;
            pincode?: string | undefined;
            area?: string | undefined;
            radiusKm?: number | undefined;
        }, {
            city?: string | undefined;
            pincode?: string | undefined;
            area?: string | undefined;
            radiusKm?: number | undefined;
        }>>;
        interests: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        institution: z.ZodOptional<z.ZodString>;
        keyword: z.ZodOptional<z.ZodString>;
        estimatedCount: z.ZodOptional<z.ZodNumber>;
    }, "strict", z.ZodTypeAny, {
        segment?: "all" | "recent" | "lapsed" | "high_value" | "stamp_card" | undefined;
        daysInactive?: number | undefined;
        minSpend?: number | undefined;
        location?: {
            city?: string | undefined;
            pincode?: string | undefined;
            area?: string | undefined;
            radiusKm?: number | undefined;
        } | undefined;
        interests?: string[] | undefined;
        institution?: string | undefined;
        keyword?: string | undefined;
        estimatedCount?: number | undefined;
    }, {
        segment?: "all" | "recent" | "lapsed" | "high_value" | "stamp_card" | undefined;
        daysInactive?: number | undefined;
        minSpend?: number | undefined;
        location?: {
            city?: string | undefined;
            pincode?: string | undefined;
            area?: string | undefined;
            radiusKm?: number | undefined;
        } | undefined;
        interests?: string[] | undefined;
        institution?: string | undefined;
        keyword?: string | undefined;
        estimatedCount?: number | undefined;
    }>>;
    budget: z.ZodOptional<z.ZodNumber>;
    spent: z.ZodOptional<z.ZodNumber>;
    createdBy: z.ZodOptional<z.ZodString>;
} & {
    type: z.ZodOptional<z.ZodLiteral<"marketing">>;
    merchantId: z.ZodOptional<z.ZodString>;
    objective: z.ZodOptional<z.ZodEnum<["awareness", "engagement", "sales", "win_back"]>>;
    message: z.ZodOptional<z.ZodString>;
    templateName: z.ZodOptional<z.ZodString>;
    imageUrl: z.ZodOptional<z.ZodString>;
    ctaUrl: z.ZodOptional<z.ZodString>;
    ctaText: z.ZodOptional<z.ZodString>;
    audience: z.ZodOptional<z.ZodObject<{
        segment: z.ZodOptional<z.ZodEnum<["all", "recent", "lapsed", "high_value", "stamp_card"]>>;
        daysInactive: z.ZodOptional<z.ZodNumber>;
        minSpend: z.ZodOptional<z.ZodNumber>;
        location: z.ZodOptional<z.ZodObject<{
            city: z.ZodOptional<z.ZodString>;
            area: z.ZodOptional<z.ZodString>;
            pincode: z.ZodOptional<z.ZodString>;
            radiusKm: z.ZodOptional<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            city?: string | undefined;
            pincode?: string | undefined;
            area?: string | undefined;
            radiusKm?: number | undefined;
        }, {
            city?: string | undefined;
            pincode?: string | undefined;
            area?: string | undefined;
            radiusKm?: number | undefined;
        }>>;
        interests: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        institution: z.ZodOptional<z.ZodString>;
        keyword: z.ZodOptional<z.ZodString>;
        estimatedCount: z.ZodOptional<z.ZodNumber>;
    }, "strict", z.ZodTypeAny, {
        segment?: "all" | "recent" | "lapsed" | "high_value" | "stamp_card" | undefined;
        daysInactive?: number | undefined;
        minSpend?: number | undefined;
        location?: {
            city?: string | undefined;
            pincode?: string | undefined;
            area?: string | undefined;
            radiusKm?: number | undefined;
        } | undefined;
        interests?: string[] | undefined;
        institution?: string | undefined;
        keyword?: string | undefined;
        estimatedCount?: number | undefined;
    }, {
        segment?: "all" | "recent" | "lapsed" | "high_value" | "stamp_card" | undefined;
        daysInactive?: number | undefined;
        minSpend?: number | undefined;
        location?: {
            city?: string | undefined;
            pincode?: string | undefined;
            area?: string | undefined;
            radiusKm?: number | undefined;
        } | undefined;
        interests?: string[] | undefined;
        institution?: string | undefined;
        keyword?: string | undefined;
        estimatedCount?: number | undefined;
    }>>;
    scheduledAt: z.ZodOptional<z.ZodUnion<[z.ZodDate, z.ZodString]>>;
    dailyBudget: z.ZodOptional<z.ZodNumber>;
    attributionWindowDays: z.ZodOptional<z.ZodNumber>;
} & {
    _id: z.ZodOptional<z.ZodString>;
    sentAt: z.ZodOptional<z.ZodUnion<[z.ZodDate, z.ZodString]>>;
    stats: z.ZodOptional<z.ZodObject<{
        sent: z.ZodOptional<z.ZodNumber>;
        delivered: z.ZodOptional<z.ZodNumber>;
        failed: z.ZodOptional<z.ZodNumber>;
        deduped: z.ZodOptional<z.ZodNumber>;
        opened: z.ZodOptional<z.ZodNumber>;
        clicked: z.ZodOptional<z.ZodNumber>;
        converted: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        delivered?: number | undefined;
        failed?: number | undefined;
        sent?: number | undefined;
        deduped?: number | undefined;
        opened?: number | undefined;
        clicked?: number | undefined;
        converted?: number | undefined;
    }, {
        delivered?: number | undefined;
        failed?: number | undefined;
        sent?: number | undefined;
        deduped?: number | undefined;
        opened?: number | undefined;
        clicked?: number | undefined;
        converted?: number | undefined;
    }>>;
    errorMessage: z.ZodOptional<z.ZodString>;
    totalSpent: z.ZodOptional<z.ZodNumber>;
    createdAt: z.ZodOptional<z.ZodUnion<[z.ZodDate, z.ZodString]>>;
    updatedAt: z.ZodOptional<z.ZodUnion<[z.ZodDate, z.ZodString]>>;
}, "strip", z.ZodTypeAny, {
    status: "cancelled" | "completed" | "failed" | "expired" | "draft" | "scheduled" | "sending" | "sent" | "pending_review" | "active" | "paused" | "rejected";
    name: string;
    startDate: string | Date;
    spent?: number | undefined;
    merchantId?: string | undefined;
    ctaText?: string | undefined;
    imageUrl?: string | undefined;
    message?: string | undefined;
    type?: "marketing" | undefined;
    _id?: string | undefined;
    createdAt?: string | Date | undefined;
    updatedAt?: string | Date | undefined;
    description?: string | undefined;
    endDate?: string | Date | undefined;
    channel?: "email" | "sms" | "push" | "in_app" | "whatsapp" | "social" | "web" | "api" | undefined;
    targetAudience?: {
        segment?: "all" | "recent" | "lapsed" | "high_value" | "stamp_card" | undefined;
        daysInactive?: number | undefined;
        minSpend?: number | undefined;
        location?: {
            city?: string | undefined;
            pincode?: string | undefined;
            area?: string | undefined;
            radiusKm?: number | undefined;
        } | undefined;
        interests?: string[] | undefined;
        institution?: string | undefined;
        keyword?: string | undefined;
        estimatedCount?: number | undefined;
    } | undefined;
    budget?: number | undefined;
    createdBy?: string | undefined;
    objective?: "awareness" | "engagement" | "sales" | "win_back" | undefined;
    templateName?: string | undefined;
    ctaUrl?: string | undefined;
    audience?: {
        segment?: "all" | "recent" | "lapsed" | "high_value" | "stamp_card" | undefined;
        daysInactive?: number | undefined;
        minSpend?: number | undefined;
        location?: {
            city?: string | undefined;
            pincode?: string | undefined;
            area?: string | undefined;
            radiusKm?: number | undefined;
        } | undefined;
        interests?: string[] | undefined;
        institution?: string | undefined;
        keyword?: string | undefined;
        estimatedCount?: number | undefined;
    } | undefined;
    scheduledAt?: string | Date | undefined;
    dailyBudget?: number | undefined;
    attributionWindowDays?: number | undefined;
    sentAt?: string | Date | undefined;
    stats?: {
        delivered?: number | undefined;
        failed?: number | undefined;
        sent?: number | undefined;
        deduped?: number | undefined;
        opened?: number | undefined;
        clicked?: number | undefined;
        converted?: number | undefined;
    } | undefined;
    errorMessage?: string | undefined;
    totalSpent?: number | undefined;
}, {
    status: "cancelled" | "completed" | "failed" | "expired" | "draft" | "scheduled" | "sending" | "sent" | "pending_review" | "active" | "paused" | "rejected";
    name: string;
    startDate: string | Date;
    spent?: number | undefined;
    merchantId?: string | undefined;
    ctaText?: string | undefined;
    imageUrl?: string | undefined;
    message?: string | undefined;
    type?: "marketing" | undefined;
    _id?: string | undefined;
    createdAt?: string | Date | undefined;
    updatedAt?: string | Date | undefined;
    description?: string | undefined;
    endDate?: string | Date | undefined;
    channel?: "email" | "sms" | "push" | "in_app" | "whatsapp" | "social" | "web" | "api" | undefined;
    targetAudience?: {
        segment?: "all" | "recent" | "lapsed" | "high_value" | "stamp_card" | undefined;
        daysInactive?: number | undefined;
        minSpend?: number | undefined;
        location?: {
            city?: string | undefined;
            pincode?: string | undefined;
            area?: string | undefined;
            radiusKm?: number | undefined;
        } | undefined;
        interests?: string[] | undefined;
        institution?: string | undefined;
        keyword?: string | undefined;
        estimatedCount?: number | undefined;
    } | undefined;
    budget?: number | undefined;
    createdBy?: string | undefined;
    objective?: "awareness" | "engagement" | "sales" | "win_back" | undefined;
    templateName?: string | undefined;
    ctaUrl?: string | undefined;
    audience?: {
        segment?: "all" | "recent" | "lapsed" | "high_value" | "stamp_card" | undefined;
        daysInactive?: number | undefined;
        minSpend?: number | undefined;
        location?: {
            city?: string | undefined;
            pincode?: string | undefined;
            area?: string | undefined;
            radiusKm?: number | undefined;
        } | undefined;
        interests?: string[] | undefined;
        institution?: string | undefined;
        keyword?: string | undefined;
        estimatedCount?: number | undefined;
    } | undefined;
    scheduledAt?: string | Date | undefined;
    dailyBudget?: number | undefined;
    attributionWindowDays?: number | undefined;
    sentAt?: string | Date | undefined;
    stats?: {
        delivered?: number | undefined;
        failed?: number | undefined;
        sent?: number | undefined;
        deduped?: number | undefined;
        opened?: number | undefined;
        clicked?: number | undefined;
        converted?: number | undefined;
    } | undefined;
    errorMessage?: string | undefined;
    totalSpent?: number | undefined;
}>, z.ZodObject<{
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    status: z.ZodEnum<["draft", "scheduled", "sending", "sent", "pending_review", "active", "paused", "completed", "expired", "rejected", "failed", "cancelled"]>;
    startDate: z.ZodUnion<[z.ZodDate, z.ZodString]>;
    endDate: z.ZodOptional<z.ZodUnion<[z.ZodDate, z.ZodString]>>;
    channel: z.ZodOptional<z.ZodEnum<["email", "sms", "push", "in_app", "whatsapp", "social", "web", "api"]>>;
    targetAudience: z.ZodOptional<z.ZodObject<{
        segment: z.ZodOptional<z.ZodEnum<["all", "recent", "lapsed", "high_value", "stamp_card"]>>;
        daysInactive: z.ZodOptional<z.ZodNumber>;
        minSpend: z.ZodOptional<z.ZodNumber>;
        location: z.ZodOptional<z.ZodObject<{
            city: z.ZodOptional<z.ZodString>;
            area: z.ZodOptional<z.ZodString>;
            pincode: z.ZodOptional<z.ZodString>;
            radiusKm: z.ZodOptional<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            city?: string | undefined;
            pincode?: string | undefined;
            area?: string | undefined;
            radiusKm?: number | undefined;
        }, {
            city?: string | undefined;
            pincode?: string | undefined;
            area?: string | undefined;
            radiusKm?: number | undefined;
        }>>;
        interests: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        institution: z.ZodOptional<z.ZodString>;
        keyword: z.ZodOptional<z.ZodString>;
        estimatedCount: z.ZodOptional<z.ZodNumber>;
    }, "strict", z.ZodTypeAny, {
        segment?: "all" | "recent" | "lapsed" | "high_value" | "stamp_card" | undefined;
        daysInactive?: number | undefined;
        minSpend?: number | undefined;
        location?: {
            city?: string | undefined;
            pincode?: string | undefined;
            area?: string | undefined;
            radiusKm?: number | undefined;
        } | undefined;
        interests?: string[] | undefined;
        institution?: string | undefined;
        keyword?: string | undefined;
        estimatedCount?: number | undefined;
    }, {
        segment?: "all" | "recent" | "lapsed" | "high_value" | "stamp_card" | undefined;
        daysInactive?: number | undefined;
        minSpend?: number | undefined;
        location?: {
            city?: string | undefined;
            pincode?: string | undefined;
            area?: string | undefined;
            radiusKm?: number | undefined;
        } | undefined;
        interests?: string[] | undefined;
        institution?: string | undefined;
        keyword?: string | undefined;
        estimatedCount?: number | undefined;
    }>>;
    budget: z.ZodOptional<z.ZodNumber>;
    spent: z.ZodOptional<z.ZodNumber>;
    createdBy: z.ZodOptional<z.ZodString>;
} & {
    type: z.ZodOptional<z.ZodLiteral<"ad">>;
    merchantId: z.ZodOptional<z.ZodString>;
    storeId: z.ZodOptional<z.ZodString>;
    title: z.ZodOptional<z.ZodString>;
    headline: z.ZodOptional<z.ZodString>;
    ctaText: z.ZodOptional<z.ZodString>;
    ctaUrl: z.ZodOptional<z.ZodString>;
    imageUrl: z.ZodOptional<z.ZodString>;
    placement: z.ZodOptional<z.ZodEnum<["home_banner", "explore_feed", "store_listing", "search_result"]>>;
    targetSegment: z.ZodOptional<z.ZodEnum<["all", "new", "loyal", "lapsed", "nearby"]>>;
    targetLocation: z.ZodOptional<z.ZodObject<{
        city: z.ZodOptional<z.ZodString>;
        radiusKm: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        city?: string | undefined;
        radiusKm?: number | undefined;
    }, {
        city?: string | undefined;
        radiusKm?: number | undefined;
    }>>;
    targetInterests: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    bidType: z.ZodOptional<z.ZodEnum<["CPC", "CPM"]>>;
    bidAmount: z.ZodOptional<z.ZodNumber>;
    dailyBudget: z.ZodOptional<z.ZodNumber>;
    totalBudget: z.ZodOptional<z.ZodNumber>;
    frequencyCapDays: z.ZodOptional<z.ZodNumber>;
} & {
    _id: z.ZodOptional<z.ZodString>;
    totalSpent: z.ZodOptional<z.ZodNumber>;
    impressions: z.ZodOptional<z.ZodNumber>;
    clicks: z.ZodOptional<z.ZodNumber>;
    ctr: z.ZodOptional<z.ZodNumber>;
    reviewedBy: z.ZodOptional<z.ZodString>;
    reviewedAt: z.ZodOptional<z.ZodUnion<[z.ZodDate, z.ZodString]>>;
    rejectionReason: z.ZodOptional<z.ZodString>;
    createdAt: z.ZodOptional<z.ZodUnion<[z.ZodDate, z.ZodString]>>;
    updatedAt: z.ZodOptional<z.ZodUnion<[z.ZodDate, z.ZodString]>>;
}, "strip", z.ZodTypeAny, {
    status: "cancelled" | "completed" | "failed" | "expired" | "draft" | "scheduled" | "sending" | "sent" | "pending_review" | "active" | "paused" | "rejected";
    name: string;
    startDate: string | Date;
    spent?: number | undefined;
    merchantId?: string | undefined;
    ctaText?: string | undefined;
    imageUrl?: string | undefined;
    type?: "ad" | undefined;
    _id?: string | undefined;
    createdAt?: string | Date | undefined;
    updatedAt?: string | Date | undefined;
    description?: string | undefined;
    endDate?: string | Date | undefined;
    channel?: "email" | "sms" | "push" | "in_app" | "whatsapp" | "social" | "web" | "api" | undefined;
    targetAudience?: {
        segment?: "all" | "recent" | "lapsed" | "high_value" | "stamp_card" | undefined;
        daysInactive?: number | undefined;
        minSpend?: number | undefined;
        location?: {
            city?: string | undefined;
            pincode?: string | undefined;
            area?: string | undefined;
            radiusKm?: number | undefined;
        } | undefined;
        interests?: string[] | undefined;
        institution?: string | undefined;
        keyword?: string | undefined;
        estimatedCount?: number | undefined;
    } | undefined;
    budget?: number | undefined;
    createdBy?: string | undefined;
    ctaUrl?: string | undefined;
    dailyBudget?: number | undefined;
    totalSpent?: number | undefined;
    storeId?: string | undefined;
    title?: string | undefined;
    headline?: string | undefined;
    placement?: "home_banner" | "explore_feed" | "store_listing" | "search_result" | undefined;
    targetSegment?: "all" | "lapsed" | "new" | "loyal" | "nearby" | undefined;
    targetLocation?: {
        city?: string | undefined;
        radiusKm?: number | undefined;
    } | undefined;
    targetInterests?: string[] | undefined;
    bidType?: "CPC" | "CPM" | undefined;
    bidAmount?: number | undefined;
    totalBudget?: number | undefined;
    frequencyCapDays?: number | undefined;
    impressions?: number | undefined;
    clicks?: number | undefined;
    ctr?: number | undefined;
    reviewedBy?: string | undefined;
    reviewedAt?: string | Date | undefined;
    rejectionReason?: string | undefined;
}, {
    status: "cancelled" | "completed" | "failed" | "expired" | "draft" | "scheduled" | "sending" | "sent" | "pending_review" | "active" | "paused" | "rejected";
    name: string;
    startDate: string | Date;
    spent?: number | undefined;
    merchantId?: string | undefined;
    ctaText?: string | undefined;
    imageUrl?: string | undefined;
    type?: "ad" | undefined;
    _id?: string | undefined;
    createdAt?: string | Date | undefined;
    updatedAt?: string | Date | undefined;
    description?: string | undefined;
    endDate?: string | Date | undefined;
    channel?: "email" | "sms" | "push" | "in_app" | "whatsapp" | "social" | "web" | "api" | undefined;
    targetAudience?: {
        segment?: "all" | "recent" | "lapsed" | "high_value" | "stamp_card" | undefined;
        daysInactive?: number | undefined;
        minSpend?: number | undefined;
        location?: {
            city?: string | undefined;
            pincode?: string | undefined;
            area?: string | undefined;
            radiusKm?: number | undefined;
        } | undefined;
        interests?: string[] | undefined;
        institution?: string | undefined;
        keyword?: string | undefined;
        estimatedCount?: number | undefined;
    } | undefined;
    budget?: number | undefined;
    createdBy?: string | undefined;
    ctaUrl?: string | undefined;
    dailyBudget?: number | undefined;
    totalSpent?: number | undefined;
    storeId?: string | undefined;
    title?: string | undefined;
    headline?: string | undefined;
    placement?: "home_banner" | "explore_feed" | "store_listing" | "search_result" | undefined;
    targetSegment?: "all" | "lapsed" | "new" | "loyal" | "nearby" | undefined;
    targetLocation?: {
        city?: string | undefined;
        radiusKm?: number | undefined;
    } | undefined;
    targetInterests?: string[] | undefined;
    bidType?: "CPC" | "CPM" | undefined;
    bidAmount?: number | undefined;
    totalBudget?: number | undefined;
    frequencyCapDays?: number | undefined;
    impressions?: number | undefined;
    clicks?: number | undefined;
    ctr?: number | undefined;
    reviewedBy?: string | undefined;
    reviewedAt?: string | Date | undefined;
    rejectionReason?: string | undefined;
}>, z.ZodObject<{
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    status: z.ZodEnum<["draft", "scheduled", "sending", "sent", "pending_review", "active", "paused", "completed", "expired", "rejected", "failed", "cancelled"]>;
    startDate: z.ZodUnion<[z.ZodDate, z.ZodString]>;
    endDate: z.ZodOptional<z.ZodUnion<[z.ZodDate, z.ZodString]>>;
    channel: z.ZodOptional<z.ZodEnum<["email", "sms", "push", "in_app", "whatsapp", "social", "web", "api"]>>;
    targetAudience: z.ZodOptional<z.ZodObject<{
        segment: z.ZodOptional<z.ZodEnum<["all", "recent", "lapsed", "high_value", "stamp_card"]>>;
        daysInactive: z.ZodOptional<z.ZodNumber>;
        minSpend: z.ZodOptional<z.ZodNumber>;
        location: z.ZodOptional<z.ZodObject<{
            city: z.ZodOptional<z.ZodString>;
            area: z.ZodOptional<z.ZodString>;
            pincode: z.ZodOptional<z.ZodString>;
            radiusKm: z.ZodOptional<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            city?: string | undefined;
            pincode?: string | undefined;
            area?: string | undefined;
            radiusKm?: number | undefined;
        }, {
            city?: string | undefined;
            pincode?: string | undefined;
            area?: string | undefined;
            radiusKm?: number | undefined;
        }>>;
        interests: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        institution: z.ZodOptional<z.ZodString>;
        keyword: z.ZodOptional<z.ZodString>;
        estimatedCount: z.ZodOptional<z.ZodNumber>;
    }, "strict", z.ZodTypeAny, {
        segment?: "all" | "recent" | "lapsed" | "high_value" | "stamp_card" | undefined;
        daysInactive?: number | undefined;
        minSpend?: number | undefined;
        location?: {
            city?: string | undefined;
            pincode?: string | undefined;
            area?: string | undefined;
            radiusKm?: number | undefined;
        } | undefined;
        interests?: string[] | undefined;
        institution?: string | undefined;
        keyword?: string | undefined;
        estimatedCount?: number | undefined;
    }, {
        segment?: "all" | "recent" | "lapsed" | "high_value" | "stamp_card" | undefined;
        daysInactive?: number | undefined;
        minSpend?: number | undefined;
        location?: {
            city?: string | undefined;
            pincode?: string | undefined;
            area?: string | undefined;
            radiusKm?: number | undefined;
        } | undefined;
        interests?: string[] | undefined;
        institution?: string | undefined;
        keyword?: string | undefined;
        estimatedCount?: number | undefined;
    }>>;
    budget: z.ZodOptional<z.ZodNumber>;
    spent: z.ZodOptional<z.ZodNumber>;
    createdBy: z.ZodOptional<z.ZodString>;
} & {
    type: z.ZodOptional<z.ZodLiteral<"merchant">>;
    merchantId: z.ZodOptional<z.ZodString>;
    storeId: z.ZodOptional<z.ZodString>;
    title: z.ZodOptional<z.ZodString>;
    discountPercentage: z.ZodOptional<z.ZodNumber>;
    maxRedemptions: z.ZodOptional<z.ZodNumber>;
    appliedProducts: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    rewardValue: z.ZodOptional<z.ZodNumber>;
    rewardType: z.ZodOptional<z.ZodString>;
    durationDays: z.ZodOptional<z.ZodNumber>;
    conditions: z.ZodOptional<z.ZodArray<z.ZodObject<{
        field: z.ZodString;
        operator: z.ZodEnum<["eq", "neq", "gt", "gte", "lt", "lte", "in", "not_in", "contains", "exists"]>;
        value: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean, z.ZodNull, z.ZodArray<z.ZodUnion<[z.ZodString, z.ZodNumber]>, "many">]>>;
    }, "strict", z.ZodTypeAny, {
        operator: "eq" | "neq" | "gt" | "gte" | "lt" | "lte" | "in" | "not_in" | "contains" | "exists";
        field: string;
        value?: string | number | boolean | (string | number)[] | null | undefined;
    }, {
        operator: "eq" | "neq" | "gt" | "gte" | "lt" | "lte" | "in" | "not_in" | "contains" | "exists";
        field: string;
        value?: string | number | boolean | (string | number)[] | null | undefined;
    }>, "many">>;
    actions: z.ZodOptional<z.ZodArray<z.ZodObject<{
        kind: z.ZodEnum<["credit_coins", "grant_badge", "send_notification", "award_voucher", "issue_coupon"]>;
        params: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean, z.ZodNull, z.ZodArray<z.ZodString, "many">, z.ZodArray<z.ZodNumber, "many">]>>>;
    }, "strict", z.ZodTypeAny, {
        kind: "credit_coins" | "grant_badge" | "send_notification" | "award_voucher" | "issue_coupon";
        params?: Record<string, string | number | boolean | string[] | number[] | null> | undefined;
    }, {
        kind: "credit_coins" | "grant_badge" | "send_notification" | "award_voucher" | "issue_coupon";
        params?: Record<string, string | number | boolean | string[] | number[] | null> | undefined;
    }>, "many">>;
    triggers: z.ZodOptional<z.ZodArray<z.ZodObject<{
        event: z.ZodEnum<["order.placed", "order.delivered", "visit.completed", "signup", "referral.invite", "cron", "manual"]>;
        filters: z.ZodOptional<z.ZodArray<z.ZodObject<{
            field: z.ZodString;
            operator: z.ZodEnum<["eq", "neq", "gt", "gte", "lt", "lte", "in", "not_in", "contains", "exists"]>;
            value: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean, z.ZodNull, z.ZodArray<z.ZodUnion<[z.ZodString, z.ZodNumber]>, "many">]>>;
        }, "strict", z.ZodTypeAny, {
            operator: "eq" | "neq" | "gt" | "gte" | "lt" | "lte" | "in" | "not_in" | "contains" | "exists";
            field: string;
            value?: string | number | boolean | (string | number)[] | null | undefined;
        }, {
            operator: "eq" | "neq" | "gt" | "gte" | "lt" | "lte" | "in" | "not_in" | "contains" | "exists";
            field: string;
            value?: string | number | boolean | (string | number)[] | null | undefined;
        }>, "many">>;
    }, "strict", z.ZodTypeAny, {
        event: "manual" | "signup" | "order.placed" | "order.delivered" | "visit.completed" | "referral.invite" | "cron";
        filters?: {
            operator: "eq" | "neq" | "gt" | "gte" | "lt" | "lte" | "in" | "not_in" | "contains" | "exists";
            field: string;
            value?: string | number | boolean | (string | number)[] | null | undefined;
        }[] | undefined;
    }, {
        event: "manual" | "signup" | "order.placed" | "order.delivered" | "visit.completed" | "referral.invite" | "cron";
        filters?: {
            operator: "eq" | "neq" | "gt" | "gte" | "lt" | "lte" | "in" | "not_in" | "contains" | "exists";
            field: string;
            value?: string | number | boolean | (string | number)[] | null | undefined;
        }[] | undefined;
    }>, "many">>;
    priority: z.ZodOptional<z.ZodNumber>;
    cooldownDays: z.ZodOptional<z.ZodNumber>;
} & {
    _id: z.ZodOptional<z.ZodString>;
    redemptionCount: z.ZodOptional<z.ZodNumber>;
    createdAt: z.ZodOptional<z.ZodUnion<[z.ZodDate, z.ZodString]>>;
    updatedAt: z.ZodOptional<z.ZodUnion<[z.ZodDate, z.ZodString]>>;
}, "strip", z.ZodTypeAny, {
    status: "cancelled" | "completed" | "failed" | "expired" | "draft" | "scheduled" | "sending" | "sent" | "pending_review" | "active" | "paused" | "rejected";
    name: string;
    startDate: string | Date;
    spent?: number | undefined;
    merchantId?: string | undefined;
    type?: "merchant" | undefined;
    _id?: string | undefined;
    createdAt?: string | Date | undefined;
    updatedAt?: string | Date | undefined;
    description?: string | undefined;
    endDate?: string | Date | undefined;
    channel?: "email" | "sms" | "push" | "in_app" | "whatsapp" | "social" | "web" | "api" | undefined;
    targetAudience?: {
        segment?: "all" | "recent" | "lapsed" | "high_value" | "stamp_card" | undefined;
        daysInactive?: number | undefined;
        minSpend?: number | undefined;
        location?: {
            city?: string | undefined;
            pincode?: string | undefined;
            area?: string | undefined;
            radiusKm?: number | undefined;
        } | undefined;
        interests?: string[] | undefined;
        institution?: string | undefined;
        keyword?: string | undefined;
        estimatedCount?: number | undefined;
    } | undefined;
    budget?: number | undefined;
    createdBy?: string | undefined;
    storeId?: string | undefined;
    title?: string | undefined;
    discountPercentage?: number | undefined;
    maxRedemptions?: number | undefined;
    appliedProducts?: string[] | undefined;
    rewardValue?: number | undefined;
    rewardType?: string | undefined;
    durationDays?: number | undefined;
    conditions?: {
        operator: "eq" | "neq" | "gt" | "gte" | "lt" | "lte" | "in" | "not_in" | "contains" | "exists";
        field: string;
        value?: string | number | boolean | (string | number)[] | null | undefined;
    }[] | undefined;
    actions?: {
        kind: "credit_coins" | "grant_badge" | "send_notification" | "award_voucher" | "issue_coupon";
        params?: Record<string, string | number | boolean | string[] | number[] | null> | undefined;
    }[] | undefined;
    triggers?: {
        event: "manual" | "signup" | "order.placed" | "order.delivered" | "visit.completed" | "referral.invite" | "cron";
        filters?: {
            operator: "eq" | "neq" | "gt" | "gte" | "lt" | "lte" | "in" | "not_in" | "contains" | "exists";
            field: string;
            value?: string | number | boolean | (string | number)[] | null | undefined;
        }[] | undefined;
    }[] | undefined;
    priority?: number | undefined;
    cooldownDays?: number | undefined;
    redemptionCount?: number | undefined;
}, {
    status: "cancelled" | "completed" | "failed" | "expired" | "draft" | "scheduled" | "sending" | "sent" | "pending_review" | "active" | "paused" | "rejected";
    name: string;
    startDate: string | Date;
    spent?: number | undefined;
    merchantId?: string | undefined;
    type?: "merchant" | undefined;
    _id?: string | undefined;
    createdAt?: string | Date | undefined;
    updatedAt?: string | Date | undefined;
    description?: string | undefined;
    endDate?: string | Date | undefined;
    channel?: "email" | "sms" | "push" | "in_app" | "whatsapp" | "social" | "web" | "api" | undefined;
    targetAudience?: {
        segment?: "all" | "recent" | "lapsed" | "high_value" | "stamp_card" | undefined;
        daysInactive?: number | undefined;
        minSpend?: number | undefined;
        location?: {
            city?: string | undefined;
            pincode?: string | undefined;
            area?: string | undefined;
            radiusKm?: number | undefined;
        } | undefined;
        interests?: string[] | undefined;
        institution?: string | undefined;
        keyword?: string | undefined;
        estimatedCount?: number | undefined;
    } | undefined;
    budget?: number | undefined;
    createdBy?: string | undefined;
    storeId?: string | undefined;
    title?: string | undefined;
    discountPercentage?: number | undefined;
    maxRedemptions?: number | undefined;
    appliedProducts?: string[] | undefined;
    rewardValue?: number | undefined;
    rewardType?: string | undefined;
    durationDays?: number | undefined;
    conditions?: {
        operator: "eq" | "neq" | "gt" | "gte" | "lt" | "lte" | "in" | "not_in" | "contains" | "exists";
        field: string;
        value?: string | number | boolean | (string | number)[] | null | undefined;
    }[] | undefined;
    actions?: {
        kind: "credit_coins" | "grant_badge" | "send_notification" | "award_voucher" | "issue_coupon";
        params?: Record<string, string | number | boolean | string[] | number[] | null> | undefined;
    }[] | undefined;
    triggers?: {
        event: "manual" | "signup" | "order.placed" | "order.delivered" | "visit.completed" | "referral.invite" | "cron";
        filters?: {
            operator: "eq" | "neq" | "gt" | "gte" | "lt" | "lte" | "in" | "not_in" | "contains" | "exists";
            field: string;
            value?: string | number | boolean | (string | number)[] | null | undefined;
        }[] | undefined;
    }[] | undefined;
    priority?: number | undefined;
    cooldownDays?: number | undefined;
    redemptionCount?: number | undefined;
}>]>, "many">;
export type CreateMarketingCampaignRequest = z.infer<typeof CreateMarketingCampaignSchema>;
export type UpdateMarketingCampaignRequest = z.infer<typeof UpdateMarketingCampaignSchema>;
export type MarketingCampaignResponse = z.infer<typeof MarketingCampaignResponseSchema>;
export type CreateAdCampaignRequest = z.infer<typeof CreateAdCampaignSchema>;
export type UpdateAdCampaignRequest = z.infer<typeof UpdateAdCampaignSchema>;
export type AdCampaignResponse = z.infer<typeof AdCampaignResponseSchema>;
export type CreateMerchantCampaignRequest = z.infer<typeof CreateMerchantCampaignSchema>;
export type UpdateMerchantCampaignRequest = z.infer<typeof UpdateMerchantCampaignSchema>;
export type MerchantCampaignResponse = z.infer<typeof MerchantCampaignResponseSchema>;
export type CampaignResponse = z.infer<typeof CampaignResponseSchema>;
export type CampaignListResponse = z.infer<typeof CampaignListResponseSchema>;
export type CampaignStatus = z.infer<typeof CAMPAIGN_STATUS>;
export type CampaignChannel = z.infer<typeof CAMPAIGN_CHANNEL>;
//# sourceMappingURL=campaign.schema.d.ts.map