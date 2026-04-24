"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CampaignListResponseSchema = exports.CampaignResponseSchema = exports.MerchantCampaignResponseSchema = exports.UpdateMerchantCampaignSchema = exports.CreateMerchantCampaignSchema = exports.AdCampaignResponseSchema = exports.UpdateAdCampaignSchema = exports.CreateAdCampaignSchema = exports.MarketingCampaignResponseSchema = exports.UpdateMarketingCampaignSchema = exports.CreateMarketingCampaignSchema = exports.BaseCampaignSchema = exports.CAMPAIGN_CHANNEL = exports.CAMPAIGN_STATUS = void 0;
const zod_1 = require("zod");
exports.CAMPAIGN_STATUS = zod_1.z.enum([
    'draft',
    'scheduled',
    'sending',
    'sent',
    'pending_review',
    'active',
    'paused',
    'completed',
    'expired',
    'rejected',
    'failed',
    'cancelled',
]);
exports.CAMPAIGN_CHANNEL = zod_1.z.enum([
    'email',
    'sms',
    'push',
    'in_app',
    'whatsapp',
    'social',
    'web',
    'api',
]);
exports.BaseCampaignSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Campaign name is required'),
    description: zod_1.z.string().optional(),
    status: exports.CAMPAIGN_STATUS,
    startDate: zod_1.z.date(),
    endDate: zod_1.z.date().optional(),
    channel: exports.CAMPAIGN_CHANNEL.optional(),
    targetAudience: zod_1.z.record(zod_1.z.any()).optional(),
    budget: zod_1.z.number().min(0).optional(),
    spent: zod_1.z.number().min(0).optional(),
    createdBy: zod_1.z.string().optional(),
});
exports.CreateMarketingCampaignSchema = exports.BaseCampaignSchema.extend({
    type: zod_1.z.literal('marketing').optional(),
    merchantId: zod_1.z.string().optional(),
    objective: zod_1.z.enum(['awareness', 'engagement', 'sales', 'win_back']).optional(),
    message: zod_1.z.string().optional(),
    templateName: zod_1.z.string().optional(),
    imageUrl: zod_1.z.string().url('Invalid image URL').optional(),
    ctaUrl: zod_1.z.string().url('Invalid CTA URL').optional(),
    ctaText: zod_1.z.string().optional(),
    audience: zod_1.z.record(zod_1.z.any()).optional(),
    scheduledAt: zod_1.z.date().optional(),
    dailyBudget: zod_1.z.number().min(0).optional(),
    attributionWindowDays: zod_1.z.number().int().positive().optional(),
});
exports.UpdateMarketingCampaignSchema = exports.CreateMarketingCampaignSchema.partial();
exports.MarketingCampaignResponseSchema = exports.CreateMarketingCampaignSchema.extend({
    _id: zod_1.z.string().optional(),
    sentAt: zod_1.z.date().optional(),
    stats: zod_1.z.object({
        sent: zod_1.z.number().optional(),
        delivered: zod_1.z.number().optional(),
        failed: zod_1.z.number().optional(),
        deduped: zod_1.z.number().optional(),
        opened: zod_1.z.number().optional(),
        clicked: zod_1.z.number().optional(),
        converted: zod_1.z.number().optional(),
    }).optional(),
    errorMessage: zod_1.z.string().optional(),
    totalSpent: zod_1.z.number().min(0).optional(),
    createdAt: zod_1.z.date().optional(),
    updatedAt: zod_1.z.date().optional(),
});
exports.CreateAdCampaignSchema = exports.BaseCampaignSchema.extend({
    type: zod_1.z.literal('ad').optional(),
    merchantId: zod_1.z.string().optional(),
    storeId: zod_1.z.string().optional(),
    title: zod_1.z.string().optional(),
    headline: zod_1.z.string().optional(),
    ctaText: zod_1.z.string().optional(),
    ctaUrl: zod_1.z.string().url('Invalid CTA URL').optional(),
    imageUrl: zod_1.z.string().url('Invalid image URL').optional(),
    placement: zod_1.z.enum([
        'home_banner',
        'explore_feed',
        'store_listing',
        'search_result',
    ]).optional(),
    targetSegment: zod_1.z.enum(['all', 'new', 'loyal', 'lapsed', 'nearby']).optional(),
    targetLocation: zod_1.z.object({
        city: zod_1.z.string().optional(),
        radiusKm: zod_1.z.number().positive().optional(),
    }).optional(),
    targetInterests: zod_1.z.array(zod_1.z.string()).optional(),
    bidType: zod_1.z.enum(['CPC', 'CPM']).optional(),
    bidAmount: zod_1.z.number().min(0).optional(),
    dailyBudget: zod_1.z.number().min(0).optional(),
    totalBudget: zod_1.z.number().min(0).optional(),
    frequencyCapDays: zod_1.z.number().int().positive().optional(),
});
exports.UpdateAdCampaignSchema = exports.CreateAdCampaignSchema.partial();
exports.AdCampaignResponseSchema = exports.CreateAdCampaignSchema.extend({
    _id: zod_1.z.string().optional(),
    totalSpent: zod_1.z.number().min(0).optional(),
    impressions: zod_1.z.number().optional(),
    clicks: zod_1.z.number().optional(),
    ctr: zod_1.z.number().optional(),
    reviewedBy: zod_1.z.string().optional(),
    reviewedAt: zod_1.z.date().optional(),
    rejectionReason: zod_1.z.string().optional(),
    createdAt: zod_1.z.date().optional(),
    updatedAt: zod_1.z.date().optional(),
});
exports.CreateMerchantCampaignSchema = exports.BaseCampaignSchema.extend({
    type: zod_1.z.literal('merchant').optional(),
    merchantId: zod_1.z.string().optional(),
    storeId: zod_1.z.string().optional(),
    title: zod_1.z.string().optional(),
    discountPercentage: zod_1.z.number().min(0).max(100).optional(),
    maxRedemptions: zod_1.z.number().int().positive().optional(),
    appliedProducts: zod_1.z.array(zod_1.z.string()).optional(),
    rewardValue: zod_1.z.number().min(0).optional(),
    rewardType: zod_1.z.string().optional(),
    durationDays: zod_1.z.number().int().positive().optional(),
    conditions: zod_1.z.record(zod_1.z.any()).optional(),
    actions: zod_1.z.array(zod_1.z.record(zod_1.z.any())).optional(),
    triggers: zod_1.z.array(zod_1.z.record(zod_1.z.any())).optional(),
    priority: zod_1.z.number().int().optional(),
    cooldownDays: zod_1.z.number().int().optional(),
});
exports.UpdateMerchantCampaignSchema = exports.CreateMerchantCampaignSchema.partial();
exports.MerchantCampaignResponseSchema = exports.CreateMerchantCampaignSchema.extend({
    _id: zod_1.z.string().optional(),
    redemptionCount: zod_1.z.number().optional(),
    createdAt: zod_1.z.date().optional(),
    updatedAt: zod_1.z.date().optional(),
});
exports.CampaignResponseSchema = zod_1.z.union([
    exports.MarketingCampaignResponseSchema,
    exports.AdCampaignResponseSchema,
    exports.MerchantCampaignResponseSchema,
]);
exports.CampaignListResponseSchema = zod_1.z.array(exports.CampaignResponseSchema);
//# sourceMappingURL=campaign.schema.js.map