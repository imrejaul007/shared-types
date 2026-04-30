export interface CommerceMemoryContext {
    userId: string;
    activeIntents: IntentSummary[];
    dormantIntents: DormantIntentSummary[];
    profile: UserProfile;
    recommendations: string[];
    formattedContext: string;
}
export interface IntentSummary {
    key: string;
    category: string;
    confidence: number;
    lastSeen: string;
    displayName: string;
}
export interface DormantIntentSummary {
    key: string;
    category: string;
    daysDormant: number;
    revivalScore: number;
    displayName: string;
    actionSuggestion: string;
}
export interface UserProfile {
    travelAffinity: number;
    diningAffinity: number;
    retailAffinity: number;
    preferredChannel: string;
    totalConversions: number;
}
export declare function getCommerceMemoryContext(userId: string, options?: {
    includeActive?: boolean;
    includeDormant?: boolean;
    includeProfile?: boolean;
}): Promise<CommerceMemoryContext | null>;
export declare function hasRelevantIntent(userId: string, query: string): Promise<{
    hasIntent: boolean;
    intentKey?: string;
    category?: string;
}>;
//# sourceMappingURL=commerceMemoryContext.d.ts.map