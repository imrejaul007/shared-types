import { CustomerContext, KnowledgeEntry, KnowledgeProvider, KnowledgeBase, AppType, IndustryCategory } from '../types';
export declare const INDUSTRY_CATEGORIES: Record<string, IndustryCategory[]>;
export declare class GlobalKnowledgeProvider implements KnowledgeProvider {
    type: 'global';
    priority: number;
    getEntries(_context: CustomerContext): Promise<KnowledgeEntry[]>;
}
export declare class IndustryKnowledgeProvider implements KnowledgeProvider {
    private appType;
    private industryCategory?;
    type: 'industry';
    priority: number;
    constructor(appType: AppType, industryCategory?: IndustryCategory | undefined);
    getEntries(_context: CustomerContext): Promise<KnowledgeEntry[]>;
    get knowledge(): KnowledgeBase;
}
export declare class AppKnowledgeProvider implements KnowledgeProvider {
    private appType;
    type: 'app';
    priority: number;
    constructor(appType: AppType);
    getEntries(_context: CustomerContext): Promise<KnowledgeEntry[]>;
    get appKnowledge(): KnowledgeBase;
}
export interface MerchantKnowledgeData {
    merchantId: string;
    name: string;
    industry?: IndustryCategory;
    description?: string;
    products?: KnowledgeEntry[];
    services?: KnowledgeEntry[];
    offers?: KnowledgeEntry[];
    policies?: KnowledgeEntry[];
}
export declare class MerchantKnowledgeProvider implements KnowledgeProvider {
    private merchantData;
    type: 'merchant';
    priority: number;
    constructor(merchantData: MerchantKnowledgeData);
    getEntries(_context: CustomerContext): Promise<KnowledgeEntry[]>;
    get merchantKnowledge(): KnowledgeBase;
}
export declare class CustomerKnowledgeProvider implements KnowledgeProvider {
    private customerContext;
    type: 'customer';
    priority: number;
    constructor(customerContext: CustomerContext);
    getEntries(_context: CustomerContext): Promise<KnowledgeEntry[]>;
    private getTierBenefits;
}
export declare class UnifiedKnowledgeBase {
    private providers;
    constructor(globalProvider: GlobalKnowledgeProvider, industryProvider: IndustryKnowledgeProvider, merchantProviders?: MerchantKnowledgeProvider[], customerProvider?: CustomerKnowledgeProvider);
    getAllEntries(context: CustomerContext): Promise<KnowledgeEntry[]>;
    getRelevantEntries(context: CustomerContext, query: string): Promise<KnowledgeEntry[]>;
    private deduplicateEntries;
}
export declare function createKnowledgeBase(appType: AppType, merchantData?: MerchantKnowledgeData, customerContext?: CustomerContext, industryCategory?: IndustryCategory): UnifiedKnowledgeBase;
export declare function getKnowledgeForIndustry(industry: IndustryCategory): KnowledgeEntry[];
export declare function getKnowledgeForAppType(appType: AppType): KnowledgeEntry[];
//# sourceMappingURL=providers.d.ts.map