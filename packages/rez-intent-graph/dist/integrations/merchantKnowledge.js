// ── Merchant Knowledge Base ─────────────────────────────────────────────────────────
// Phase 7: Each merchant shares their knowledge base
// ReZ Mind collects and indexes merchant knowledge for autonomous chat
import { PrismaClient } from '@prisma/client';
import { sharedMemory } from '../agents/shared-memory.js';
const prisma = new PrismaClient();
// ── Merchant Knowledge Service ────────────────────────────────────────────────────
export class MerchantKnowledgeService {
    /**
     * Add knowledge entry for a merchant
     */
    async addEntry(params) {
        const entry = await prisma.merchantKnowledge.create({
            data: {
                merchantId: params.merchantId,
                type: params.type,
                title: params.title,
                content: params.content,
                tags: params.tags || [],
                metadata: params.metadata ? JSON.parse(JSON.stringify(params.metadata)) : undefined,
                active: true,
            },
        });
        // Invalidate cache
        await this.invalidateCache(params.merchantId);
        // Publish event
        await sharedMemory.publish({
            from: 'intent-graph',
            to: 'merchant-knowledge',
            type: 'notification',
            payload: { merchantId: params.merchantId, entryId: entry.id, type: params.type },
            timestamp: new Date(),
        });
        return entry;
    }
    /**
     * Bulk import knowledge for a merchant
     */
    async bulkImport(params) {
        let imported = 0;
        const errors = [];
        for (const entry of params.entries) {
            try {
                await this.addEntry({
                    merchantId: params.merchantId,
                    type: entry.type,
                    title: entry.title,
                    content: entry.content,
                    tags: entry.tags,
                });
                imported++;
            }
            catch (error) {
                errors.push(`${entry.title}: ${String(error)}`);
            }
        }
        // Trigger re-indexing
        await this.indexMerchantKnowledge(params.merchantId);
        return { imported, errors };
    }
    /**
     * Get merchant's knowledge base
     */
    async getKnowledgeBase(merchantId) {
        const entries = await prisma.merchantKnowledge.findMany({
            where: { merchantId, active: true },
            orderBy: { updatedAt: 'desc' },
        });
        if (entries.length === 0)
            return null;
        return {
            merchantId,
            merchantName: merchantId,
            category: 'general',
            entries: entries,
            indexedAt: new Date(),
        };
    }
    /**
     * Search knowledge base
     */
    async searchKnowledge(params) {
        const where = { active: true };
        if (params.merchantId) {
            where.merchantId = params.merchantId;
        }
        if (params.category) {
            where.type = params.category;
        }
        const entries = await prisma.merchantKnowledge.findMany({
            where,
            orderBy: { updatedAt: 'desc' },
            take: params.limit || 20,
        });
        // Simple text search (in production, use vector embeddings)
        const query = params.query.toLowerCase();
        const results = entries.filter((entry) => {
            const searchText = `${entry.title} ${entry.content} ${entry.tags.join(' ')}`.toLowerCase();
            return searchText.includes(query);
        });
        return results;
    }
    /**
     * Get knowledge for autonomous chat
     * Combines merchant knowledge + user intent context
     */
    async getChatContext(params) {
        // Get merchant knowledge matching query
        const knowledge = await this.searchKnowledge({
            merchantId: params.merchantId,
            query: params.query,
            limit: 5,
        });
        // Get user context from ReZ Mind if userId provided
        let userContext;
        if (params.userId) {
            try {
                const activeIntents = await sharedMemory.get(`intents:active:${params.userId}`);
                userContext = {
                    activeIntents: activeIntents || [],
                };
            }
            catch {
                // Ignore errors
            }
        }
        // Generate suggestions based on knowledge
        const suggestions = this.generateSuggestions(knowledge, params.query);
        return {
            merchantKnowledge: knowledge,
            userContext,
            suggestions,
        };
    }
    /**
     * Generate follow-up suggestions
     */
    generateSuggestions(knowledge, query) {
        const suggestions = [];
        const queryLower = query.toLowerCase();
        // Based on knowledge types
        const hasMenu = knowledge.some((k) => k.type === 'menu');
        const hasOffers = knowledge.some((k) => k.type === 'offer');
        const hasPolicies = knowledge.some((k) => k.type === 'policy');
        const hasFaqs = knowledge.some((k) => k.type === 'faq');
        if (hasMenu && !queryLower.includes('menu')) {
            suggestions.push('Would you like to see our menu?');
        }
        if (hasOffers && !queryLower.includes('offer')) {
            suggestions.push('Check out our current offers!');
        }
        if (hasPolicies && !queryLower.includes('policy')) {
            suggestions.push('Need to know about our policies?');
        }
        if (hasFaqs && !queryLower.includes('faq')) {
            suggestions.push('Have questions? Check our FAQs.');
        }
        return suggestions.slice(0, 3);
    }
    /**
     * Index merchant knowledge for fast retrieval
     */
    async indexMerchantKnowledge(merchantId) {
        const knowledge = await this.getKnowledgeBase(merchantId);
        if (!knowledge)
            return;
        // Store in shared memory for fast access
        await sharedMemory.set(`knowledge:${merchantId}`, knowledge, 86400 // 24 hours
        );
        // Publish index event
        await sharedMemory.publish({
            from: 'intent-graph',
            to: 'chat-agent',
            type: 'notification',
            payload: { merchantId, entryCount: knowledge.entries.length },
            timestamp: new Date(),
        });
    }
    /**
     * Get all merchants with knowledge bases
     */
    async getMerchantsWithKnowledge() {
        const merchants = await prisma.merchantKnowledge.groupBy({
            by: ['merchantId'],
            _count: { id: true },
            where: { active: true },
        });
        return merchants.map((m) => m.merchantId);
    }
    /**
     * Update knowledge entry
     */
    async updateEntry(entryId, updates) {
        const entry = await prisma.merchantKnowledge.update({
            where: { id: entryId },
            data: updates,
        });
        if (entry) {
            await this.invalidateCache(entry.merchantId);
        }
        return entry;
    }
    /**
     * Delete knowledge entry (soft delete)
     */
    async deleteEntry(entryId) {
        const entry = await prisma.merchantKnowledge.update({
            where: { id: entryId },
            data: { active: false },
        });
        if (entry) {
            await this.invalidateCache(entry.merchantId);
        }
        return !!entry;
    }
    /**
     * Invalidate cache for merchant
     */
    async invalidateCache(merchantId) {
        await sharedMemory.delete(`knowledge:${merchantId}`);
    }
}
// ── Singleton ─────────────────────────────────────────────────────────────────────
export const merchantKnowledgeService = new MerchantKnowledgeService();
// ── Prisma Model Addition ────────────────────────────────────────────────────────
/*
Add to schema.prisma:

model MerchantKnowledge {
  id          String    @id @default(cuid())
  merchantId  String
  type        String    // menu, policy, faq, offer, hours, contact, custom
  title       String
  content     String
  tags        String[]
  metadata    Json?
  active      Boolean   @default(true)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  @@index([merchantId, active])
  @@index([type, merchantId])
}
*/
//# sourceMappingURL=merchantKnowledge.js.map