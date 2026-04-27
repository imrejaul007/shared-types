export type KnowledgeType = 'menu' | 'policy' | 'faq' | 'offer' | 'hours' | 'contact' | 'custom';
export interface MerchantKnowledgeEntry {
    id: string;
    merchantId: string;
    type: KnowledgeType;
    title: string;
    content: string;
    tags: string[];
    metadata?: Record<string, unknown>;
    createdAt: Date;
    updatedAt: Date;
    active: boolean;
}
export interface MerchantKnowledgeBase {
    merchantId: string;
    merchantName: string;
    category: string;
    entries: MerchantKnowledgeEntry[];
    indexedAt?: Date;
}
export declare class MerchantKnowledgeService {
    addEntry(params: {
        merchantId: string;
        type: KnowledgeType;
        title: string;
        content: string;
        tags?: string[];
        metadata?: Record<string, unknown>;
    }): Promise<MerchantKnowledgeEntry>;
    bulkImport(params: {
        merchantId: string;
        entries: Array<{
            type: KnowledgeType;
            title: string;
            content: string;
            tags?: string[];
        }>;
    }): Promise<{
        imported: number;
        errors: string[];
    }>;
    getKnowledgeBase(merchantId: string): Promise<MerchantKnowledgeBase | null>;
    searchKnowledge(params: {
        merchantId?: string;
        category?: string;
        query: string;
        limit?: number;
    }): Promise<MerchantKnowledgeEntry[]>;
    getChatContext(params: {
        merchantId: string;
        userId?: string;
        query: string;
    }): Promise<{
        merchantKnowledge: MerchantKnowledgeEntry[];
        userContext?: {
            activeIntents: string[];
            recentOrders?: string[];
            preferences?: string[];
        };
        suggestions?: string[];
    }>;
    private generateSuggestions;
    indexMerchantKnowledge(merchantId: string): Promise<void>;
    getMerchantsWithKnowledge(): Promise<string[]>;
    updateEntry(entryId: string, updates: Partial<{
        title: string;
        content: string;
        tags: string[];
        active: boolean;
    }>): Promise<MerchantKnowledgeEntry | null>;
    deleteEntry(entryId: string): Promise<boolean>;
    private invalidateCache;
}
export declare const merchantKnowledgeService: MerchantKnowledgeService;
//# sourceMappingURL=merchantKnowledge.d.ts.map