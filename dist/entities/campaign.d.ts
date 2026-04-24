import { CampaignStatus, CampaignChannel } from '../enums/index';
export type ICampaignMetadata = Record<string, string | number | boolean | null | string[] | number[]>;
export interface IAudienceTargeting {
    segment?: 'all' | 'recent' | 'lapsed' | 'high_value' | 'stamp_card';
    daysInactive?: number;
    minSpend?: number;
    location?: {
        city?: string;
        area?: string;
        pincode?: string;
        radiusKm?: number;
    };
    interests?: string[];
    institution?: string;
    keyword?: string;
    estimatedCount?: number;
}
export interface ICampaignStats {
    sent?: number;
    delivered?: number;
    failed?: number;
    deduped?: number;
    opened?: number;
    clicked?: number;
    converted?: number;
}
export interface ICampaignCondition {
    field: string;
    operator: 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'not_in' | 'contains' | 'exists';
    value?: string | number | boolean | null | Array<string | number>;
}
export interface ICampaignAction {
    kind: 'credit_coins' | 'grant_badge' | 'send_notification' | 'award_voucher' | 'issue_coupon';
    params?: ICampaignMetadata;
}
export interface ICampaignTrigger {
    event: 'order.placed' | 'order.delivered' | 'visit.completed' | 'signup' | 'referral.invite' | 'cron' | 'manual';
    filters?: ICampaignCondition[];
}
export interface IBaseCampaign {
    _id?: string;
    name: string;
    description?: string;
    status: CampaignStatus;
    startDate: Date | string;
    endDate?: Date | string;
    channel?: CampaignChannel;
    targetAudience?: IAudienceTargeting;
    budget?: number;
    spent?: number;
    createdBy?: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
}
export interface IMarketingCampaign extends IBaseCampaign {
    type?: 'marketing';
    merchantId?: string;
    objective?: 'awareness' | 'engagement' | 'sales' | 'win_back';
    message?: string;
    templateName?: string;
    imageUrl?: string;
    ctaUrl?: string;
    ctaText?: string;
    audience?: IAudienceTargeting;
    scheduledAt?: Date | string;
    sentAt?: Date | string;
    stats?: ICampaignStats;
    errorMessage?: string;
    dailyBudget?: number;
    totalSpent?: number;
    attributionWindowDays?: number;
}
export interface IAdCampaign extends IBaseCampaign {
    type?: 'ad';
    merchantId?: string;
    storeId?: string;
    title?: string;
    headline?: string;
    ctaText?: string;
    ctaUrl?: string;
    imageUrl?: string;
    placement?: 'home_banner' | 'explore_feed' | 'store_listing' | 'search_result';
    targetSegment?: 'all' | 'new' | 'loyal' | 'lapsed' | 'nearby';
    targetLocation?: {
        city?: string;
        radiusKm?: number;
    };
    targetInterests?: string[];
    bidType?: 'CPC' | 'CPM';
    bidAmount?: number;
    dailyBudget?: number;
    totalBudget?: number;
    totalSpent?: number;
    frequencyCapDays?: number;
    impressions?: number;
    clicks?: number;
    ctr?: number;
    reviewedBy?: string;
    reviewedAt?: Date | string;
    rejectionReason?: string;
}
export interface IMerchantCampaign extends IBaseCampaign {
    type?: 'merchant';
    merchantId?: string;
    storeId?: string;
    title?: string;
    discountPercentage?: number;
    maxRedemptions?: number;
    redemptionCount?: number;
    appliedProducts?: string[];
    rewardValue?: number;
    rewardType?: string;
    durationDays?: number;
    conditions?: ICampaignCondition[];
    actions?: ICampaignAction[];
    triggers?: ICampaignTrigger[];
    priority?: number;
    cooldownDays?: number;
}
export type ICampaign = IMarketingCampaign | IAdCampaign | IMerchantCampaign;
//# sourceMappingURL=campaign.d.ts.map