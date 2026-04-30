export interface Experiment {
    id: string;
    name: string;
    description: string;
    variants: Record<string, PromptVariant>;
    distribution: Record<string, number>;
    startDate: Date;
    endDate?: Date;
    status: 'draft' | 'running' | 'paused' | 'completed';
    metrics: ExperimentMetrics;
}
export interface PromptVariant {
    name: string;
    systemPrompt?: string;
    temperature?: number;
    maxTokens?: number;
    tools?: string[];
    metadata?: Record<string, unknown>;
}
export interface ExperimentMetrics {
    impressions: Record<string, number>;
    conversions: Record<string, number>;
    errors: Record<string, number>;
}
export interface ExperimentAssignment {
    experimentId: string;
    variant: string;
    assignedAt: Date;
}
export declare class ABTesting {
    private experiments;
    private assignments;
    private hashFunction;
    constructor(hashFunction?: (userId: string, experimentId: string) => number);
    createExperiment(config: {
        id: string;
        name: string;
        description: string;
        variants: Record<string, PromptVariant>;
        distribution?: Record<string, number>;
        startDate: Date;
        endDate?: Date;
    }): Experiment;
    private calculateEqualDistribution;
    startExperiment(experimentId: string): boolean;
    pauseExperiment(experimentId: string): boolean;
    completeExperiment(experimentId: string): boolean;
    assignVariant(userId: string, experimentId: string): string | null;
    trackConversion(userId: string, experimentId: string): void;
    trackError(userId: string, experimentId: string): void;
    getVariant(experimentId: string, variantId: string): PromptVariant | null;
    getVariantForUser(userId: string, experimentId: string): PromptVariant | null;
    getExperimentResults(experimentId: string): {
        experiment: Experiment;
        results: Record<string, {
            impressions: number;
            conversions: number;
            conversionRate: number;
            errors: number;
            errorRate: number;
        }>;
        winner?: string;
        confidence?: number;
    } | null;
    createWelcomePromptExperiment(): Experiment;
    createToolSuggestionExperiment(): Experiment;
}
export declare function getABTesting(): ABTesting;
export default ABTesting;
//# sourceMappingURL=abTesting.d.ts.map