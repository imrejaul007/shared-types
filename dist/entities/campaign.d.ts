import { CampaignStatus, CampaignChannel } from '../enums/index';
export interface IBaseCampaign {
    _id?: string;
    name: string;
    description?: string;
    status: CampaignStatus;
    startDate: Date;
    endDate?: Date;
    channel?: CampaignChannel;
    targetAudience?: any;
    budget?: number;
    spent?: number;
    createdBy?: string;
    createdAt?: Date;
    updatedAt?: Date;
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
    audience?: Record<string, any>;
    scheduledAt?: Date;
    sentAt?: Date;
    stats?: {
        sent?: number;
        delivered?: number;
        failed?: number;
        deduped?: number;
        opened?: number;
        clicked?: number;
        converted?: number;
    };
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
    reviewedAt?: Date;
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
    conditions?: Record<string, any>;
    actions?: Array<Record<string, any>>;
    triggers?: Array<Record<string, any>>;
    priority?: number;
    cooldownDays?: number;
}
export type ICampaign = IMarketingCampaign | IAdCampaign | IMerchantCampaign;
//# sourceMappingURL=campaign.d.ts.map