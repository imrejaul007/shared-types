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
    /**
     * Add knowledge entry for a merchant
     */
    addEntry(params: {
        merchantId: string;
        type: KnowledgeType;
        title: string;
        content: string;
        tags?: string[];
        metadata?: Record<string, unknown>;
    }): Promise<MerchantKnowledgeEntry>;
    /**
     * Bulk import knowledge for a merchant
     */
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
    /**
     * Get merchant's knowledge base
     */
    getKnowledgeBase(merchantId: string): Promise<MerchantKnowledgeBase | null>;
    /**
     * Search knowledge base
     */
    searchKnowledge(params: {
        merchantId?: string;
        category?: string;
        query: string;
        limit?: number;
    }): Promise<MerchantKnowledgeEntry[]>;
    /**
     * Get knowledge for autonomous chat
     * Combines merchant knowledge + user intent context
     */
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
    /**
     * Generate follow-up suggestions
     */
    private generateSuggestions;
    /**
     * Index merchant knowledge for fast retrieval
     */
    indexMerchantKnowledge(merchantId: string): Promise<void>;
    /**
     * Get all merchants with knowledge bases
     */
    getMerchantsWithKnowledge(): Promise<string[]>;
    /**
     * Update knowledge entry
     */
    updateEntry(entryId: string, updates: Partial<{
        title: string;
        content: string;
        tags: string[];
        active: boolean;
    }>): Promise<MerchantKnowledgeEntry | null>;
    /**
     * Delete knowledge entry (soft delete)
     */
    deleteEntry(entryId: string): Promise<boolean>;
    /**
     * Invalidate cache for merchant
     */
    private invalidateCache;
}
export declare const merchantKnowledgeService: MerchantKnowledgeService;
//# sourceMappingURL=merchantKnowledge.d.ts.map