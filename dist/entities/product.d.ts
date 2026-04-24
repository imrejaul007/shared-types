import type { ProductId, CategoryId, StoreId, MerchantId } from '../branded/ids';
export type ProductType = 'product' | 'service';
export type ProductVisibility = 'public' | 'hidden' | 'featured';
export type ProductTaxSlab = '0' | '5' | '12' | '18' | '28' | 'exempt';
export type ProductMenuPeriod = 'all_day' | 'breakfast' | 'lunch' | 'dinner' | 'custom';
export type ProductServiceLocation = 'home' | 'store' | 'online';
export type ProductCancellationFee = 'none' | 'partial' | 'full';
export interface IProductGST {
    hsnCode?: string;
    sacCode?: string;
    gstRate?: number;
    taxSlab?: ProductTaxSlab;
    isIGST?: boolean;
}
export interface IProductPricing {
    original: number;
    selling: number;
    discount?: number;
    currency: string;
    bulk?: Array<{
        minQuantity: number;
        price: number;
    }>;
    gst?: IProductGST;
}
export interface IProductVariant {
    variantId: string;
    type: string;
    value: string;
    attributes?: Record<string, string>;
    price?: number;
    compareAtPrice?: number;
    stock: number;
    sku?: string;
    images?: string[];
    barcode?: string;
    weight?: number;
    isAvailable?: boolean;
}
export interface IProductInventory {
    stock: number;
    isAvailable: boolean;
    lowStockThreshold?: number;
    variants?: IProductVariant[];
    unlimited: boolean;
    estimatedRestockDate?: Date | string;
    allowBackorder?: boolean;
    reservedStock?: number;
}
export interface IProductRatingDistribution {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
}
export interface IProductRating {
    average: number;
    count: number;
    distribution: IProductRatingDistribution;
}
export interface IProductReviewStats {
    averageRating: number;
    totalReviews: number;
    ratingDistribution: IProductRatingDistribution;
    lastUpdated?: Date | string;
}
export interface IProductSpecification {
    key: string;
    value: string;
    group?: string;
}
export interface IProductSEO {
    title?: string;
    description?: string;
    keywords?: string[];
    metaTags?: Record<string, string>;
}
export interface IProductAnalytics {
    views: number;
    purchases: number;
    conversions: number;
    wishlistAdds: number;
    shareCount: number;
    returnRate: number;
    avgRating: number;
    todayPurchases?: number;
    todayViews?: number;
    lastResetDate?: Date | string;
}
export interface IProductCashback {
    percentage: number;
    maxAmount?: number;
    minPurchase?: number;
    validUntil?: Date | string;
    terms?: string;
    isActive?: boolean;
    conditions?: string[];
}
export interface IProductDeliveryInfo {
    estimatedDays?: string;
    freeShippingThreshold?: number;
    expressAvailable?: boolean;
    standardDeliveryTime?: string;
    expressDeliveryTime?: string;
    deliveryPartner?: string;
}
export interface IFrequentlyBoughtWith {
    productId: string;
    purchaseCount: number;
    lastUpdated?: Date | string;
}
export interface IServiceDetails {
    duration: number;
    serviceType: ProductServiceLocation;
    maxBookingsPerSlot: number;
    requiresAddress: boolean;
    requiresPaymentUpfront: boolean;
    serviceArea?: {
        radius: number;
        cities?: string[];
    };
    serviceCategory?: string;
    freeCancellationHours?: number;
    lateCancellationFee?: ProductCancellationFee;
    cancellationFeeAmount?: number;
}
export interface IModifierOption {
    label: string;
    price: number;
    isDefault?: boolean;
}
export interface IModifier {
    _id?: string;
    name: string;
    required?: boolean;
    multiSelect?: boolean;
    options: IModifierOption[];
}
export interface IProductImage {
    url: string;
    alt?: string;
    isPrimary?: boolean;
}
export interface IProduct {
    _id?: string | ProductId;
    name: string;
    slug: string;
    description?: string;
    shortDescription?: string;
    productType: ProductType;
    category: string | CategoryId;
    subCategory?: string | CategoryId;
    subSubCategory?: string;
    store: string | StoreId;
    merchantId?: string | MerchantId;
    brand?: string;
    model?: string;
    sku: string;
    barcode?: string;
    images: string[];
    videos?: string[];
    pricing: IProductPricing;
    inventory: IProductInventory;
    ratings: IProductRating;
    reviewStats?: IProductReviewStats;
    specifications: IProductSpecification[];
    tags: string[];
    seo: IProductSEO;
    analytics: IProductAnalytics;
    cashback?: IProductCashback;
    deliveryInfo?: IProductDeliveryInfo;
    serviceDetails?: IServiceDetails;
    serviceCategory?: string;
    bundleProducts?: string[];
    frequentlyBoughtWith?: IFrequentlyBoughtWith[];
    modifiers?: IModifier[];
    availableFrom?: string;
    availableTo?: string;
    menuPeriod?: ProductMenuPeriod;
    is86d?: boolean;
    restores86At?: Date | string;
    isActive: boolean;
    isFeatured: boolean;
    isDigital: boolean;
    visibility?: ProductVisibility;
    weight?: number;
    dimensions?: {
        length?: number;
        width?: number;
        height?: number;
        unit: 'cm' | 'inch';
    };
    shippingInfo?: {
        weight: number;
        freeShipping: boolean;
        shippingCost?: number;
        processingTime?: string;
    };
    relatedProducts?: string[];
    occasion?: string;
    createdAt: Date | string;
    updatedAt: Date | string;
    isDeleted: boolean;
    deletedAt?: Date | string;
    deletedBy?: string;
    deletedByModel?: 'User' | 'Merchant';
    adminApproved?: boolean;
    adminNotes?: string;
    isSuspended?: boolean;
    suspensionReason?: string;
    deactivatedReason?: string;
    lowStockAlert?: number;
    isPriveReviewEligible?: boolean;
    priveReviewRewardCoins?: number;
}
//# sourceMappingURL=product.d.ts.map