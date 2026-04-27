// ── Nudge Delivery Service ──────────────────────────────────────────────────────
// Handles delivery of intent revival nudges across channels

import { intentScoringService } from '../services/IntentScoringService.js';
import { dormantIntentService } from '../services/DormantIntentService.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ── Nudge Channel Types ───────────────────────────────────────────────────────

export type NudgeChannel = 'push' | 'email' | 'sms' | 'in_app';
export type NudgeStatus = 'pending' | 'sent' | 'delivered' | 'clicked' | 'converted' | 'failed';

export interface Nudge {
  id: string;
  dormantIntentId: string;
  userId: string;
  channel: NudgeChannel;
  message: string;
  status: NudgeStatus;
  sentAt?: Date;
  deliveredAt?: Date;
  clickedAt?: Date;
  convertedAt?: Date;
  error?: string;
}

export interface NudgeTemplate {
  category: string;
  triggerType: string;
  channels: NudgeChannel[];
  templates: Record<NudgeChannel, string[]>;
}

// ── Nudge Templates ───────────────────────────────────────────────────────────

const NUDGE_TEMPLATES: Record<string, Record<string, Record<NudgeChannel, string[]>>> = {
  TRAVEL: {
    scheduled: {
      push: [
        "Your {intent} search - still available!",
        "Perfect weekend for {intent}!",
        "{intent} - trending this week!",
      ],
      email: [
        "Complete your {intent} booking today!",
        "Don't miss out on {intent} - limited availability!",
        "{intent}: Your trip is waiting!",
      ],
      sms: [
        "Your {intent} search - tap to book: {link}",
        "{intent} deals available now!",
      ],
      in_app: [
        "Ready to book {intent}? Your search is saved!",
        "Complete your {intent} booking with one tap!",
      ],
    },
    price_drop: {
      push: [
        "Price alert! {intent} just got cheaper!",
        "Great news! {intent} is now discounted!",
      ],
      email: [
        "Your {intent} search - prices dropped!",
        "Special offer on {intent} - limited time!",
      ],
      sms: [
        "{intent} - now {discount}% off! Book now: {link}",
      ],
      in_app: [
        "{intent} price dropped! Update your search.",
      ],
    },
    return_user: {
      push: [
        "Welcome back! {intent} is waiting.",
        "We missed you! {intent} is ready.",
      ],
      email: [
        "Welcome back! Continue your {intent} search.",
        "Your {intent} preferences are saved.",
      ],
      sms: [
        "Welcome back! Complete {intent} booking: {link}",
      ],
      in_app: [
        "Welcome back! Your {intent} search is saved.",
      ],
    },
  },
  DINING: {
    scheduled: {
      push: [
        "Your {intent} cravings - satisfied!",
        "{intent} cravings? They're ready!",
      ],
      email: [
        "Your {intent} order - ready to reorder!",
        "Craving {intent}? New options available!",
      ],
      sms: [
        "{intent} - tap to order: {link}",
      ],
      in_app: [
        "Your saved {intent} - order again!",
      ],
    },
    offer_match: {
      push: [
        "{intent} + {offer} = perfect match!",
        "Special deal on your favorite: {intent}!",
      ],
      email: [
        "Deal alert: {intent} + {offer}!",
        "Your {intent} with exclusive discount!",
      ],
      sms: [
        "{intent} + {offer}! Order now: {link}",
      ],
      in_app: [
        "Exclusive offer on {intent}!",
      ],
    },
  },
  RETAIL: {
    scheduled: {
      push: [
        "{intent} is back in stock!",
        "Your wishlist item: {intent}!",
      ],
      email: [
        "{intent} - back by popular demand!",
        "Your saved item {intent} is available!",
      ],
      sms: [
        "{intent} back in stock! Shop now: {link}",
      ],
      in_app: [
        "{intent} available now!",
      ],
    },
    price_drop: {
      push: [
        "{intent} - now at {discount}% off!",
        "Price drop alert for {intent}!",
      ],
      email: [
        "{intent} price reduced! Limited time.",
        "Your saved item {intent} is on sale!",
      ],
      sms: [
        "{intent} now {discount}% off: {link}",
      ],
      in_app: [
        "{intent} sale! Tap to buy.",
      ],
    },
  },
};

// ── Nudge Delivery Service ─────────────────────────────────────────────────

export class NudgeDeliveryService {
  private channelHandlers: Map<NudgeChannel, NudgeChannelHandler> = new Map();

  constructor() {
    // Register channel handlers (these would be configured in production)
    this.registerDefaultHandlers();
  }

  /**
   * Register a channel handler
   */
  registerChannelHandler(channel: NudgeChannel, handler: NudgeChannelHandler): void {
    this.channelHandlers.set(channel, handler);
  }

  /**
   * Send a nudge directly (for action trigger)
   */
  async send(params: {
    userId: string;
    intentKey: string;
    message: string;
    channel: NudgeChannel;
    template?: string;
  }): Promise<Nudge> {
    const handler = this.channelHandlers.get(params.channel);
    if (!handler) {
      throw new Error(`No handler registered for channel: ${params.channel}`);
    }

    await handler.send({
      userId: params.userId,
      message: params.message,
      data: {
        intentKey: params.intentKey,
      },
    });

    return {
      id: `nudge_${Date.now()}`,
      dormantIntentId: params.intentKey,
      userId: params.userId,
      channel: params.channel,
      message: params.message,
      status: 'sent',
      sentAt: new Date(),
    };
  }

  /**
   * Send nudges for scheduled revival candidates
   */
  async processScheduledNudges(): Promise<{
    processed: number;
    sent: number;
    failed: number;
  }> {
    const candidates = await dormantIntentService.getScheduledRevivals();
    let sent = 0;
    let failed = 0;

    for (const candidate of candidates) {
      if (candidate.revivalScore < 0.3) continue;

      try {
        await this.sendNudge(candidate);
        sent++;
      } catch (error) {
        console.error('[NudgeDelivery] Failed to send nudge:', error);
        failed++;
      }
    }

    return { processed: candidates.length, sent, failed };
  }

  /**
   * Send a nudge for a revival candidate
   */
  async sendNudge(candidate: any): Promise<Nudge> {
    const { dormantIntent, suggestedNudge } = candidate;
    const category = dormantIntent.category;
    const triggerType = this.inferTriggerType(dormantIntent);
    const template = this.getTemplate(category, triggerType);

    // Determine best channel based on user preferences
    // In production, this would query the user service
    const user = await this.getUserPreferences(dormantIntent.userId);
    const channel = this.selectBestChannel(user);

    const message = this.renderTemplate(template, channel, dormantIntent, suggestedNudge);

    // Send via channel handler
    const handler = this.channelHandlers.get(channel);
    if (handler) {
      try {
        await handler.send({
          userId: dormantIntent.userId,
          message,
          data: {
            intentKey: dormantIntent.intentKey,
            category: dormantIntent.category,
            dormantIntentId: dormantIntent.id,
          },
        });

        // Record nudge sent
        await this.recordNudgeSent(dormantIntent.id, channel, message);

        return {
          id: `nudge_${Date.now()}`,
          dormantIntentId: dormantIntent.id,
          userId: dormantIntent.userId,
          channel,
          message,
          status: 'sent',
          sentAt: new Date(),
        };
      } catch (error) {
        console.error('[NudgeDelivery] Handler failed:', error);
        throw error;
      }
    }

    throw new Error(`No handler registered for channel: ${channel}`);
  }

  /**
   * Record nudge sent
   */
  private async recordNudgeSent(dormantIntentId: string, channel: string, message: string): Promise<void> {
    try {
      // Try to use Prisma if Nudge model exists
      await (prisma as any).nudge?.create({
        data: {
          dormantIntentId,
          userId: '', // Will be filled from dormantIntent
          channel,
          message,
          status: 'sent',
          sentAt: new Date(),
        },
      });
    } catch {
      // Nudge model may not exist - ignore
    }

    // Record in dormant intent service
    await dormantIntentService.recordNudgeSent(dormantIntentId);
  }

  /**
   * Get user preferences for channel selection
   */
  private async getUserPreferences(userId: string): Promise<{ preferredChannel?: string; email?: string; phone?: string }> {
    try {
      // Try to get from Prisma if user model exists
      const user = await (prisma as any).user?.findUnique({
        where: { id: userId },
        select: { preferredChannel: true, email: true, phone: true },
      });
      return user || {};
    } catch {
      return {};
    }
  }

  // ── Private Helpers ────────────────────────────────────────────────────────

  private registerDefaultHandlers(): void {
    // Placeholder handlers - in production, these would use actual push/email/sms services
    this.channelHandlers.set('push', {
      send: async (params) => {
        console.log('[NudgeDelivery] Push notification:', params);
        return { success: true };
      },
    });

    this.channelHandlers.set('email', {
      send: async (params) => {
        console.log('[NudgeDelivery] Email:', params);
        return { success: true };
      },
    });

    this.channelHandlers.set('sms', {
      send: async (params) => {
        console.log('[NudgeDelivery] SMS:', params);
        return { success: true };
      },
    });

    this.channelHandlers.set('in_app', {
      send: async (params) => {
        console.log('[NudgeDelivery] In-app message:', params);
        return { success: true };
      },
    });
  }

  private inferTriggerType(dormantIntent: any): string {
    if (dormantIntent.nudgeCount === 0) return 'scheduled';
    if (dormantIntent.daysDormant > 14) return 'return_user';
    return 'scheduled';
  }

  private getTemplate(category: string, triggerType: string): string[] {
    const templates = NUDGE_TEMPLATES[category]?.[triggerType];
    if (!templates) {
      return NUDGE_TEMPLATES['DINING']['scheduled']['push'];
    }
    return templates['push'];
  }

  private selectBestChannel(user: { preferredChannel?: string; email?: string; phone?: string }): NudgeChannel {
    if (user?.preferredChannel) {
      return user.preferredChannel as NudgeChannel;
    }
    if (user?.email) return 'email';
    if (user?.phone) return 'sms';
    return 'push';
  }

  private renderTemplate(
    templates: string[],
    channel: NudgeChannel,
    intent: any,
    suggestedNudge?: string
  ): string {
    // Use suggested nudge if provided
    if (suggestedNudge) return suggestedNudge;

    const template = templates[Math.floor(Math.random() * templates.length)];
    const formattedIntent = this.formatIntentKey(intent.intentKey);

    return template
      .replace('{intent}', formattedIntent)
      .replace('{link}', this.generateDeepLink(intent))
      .replace('{discount}', '15')
      .replace('{offer}', 'special deal');
  }

  private formatIntentKey(key: string): string {
    return key
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  private generateDeepLink(intent: any): string {
    switch (intent.category) {
      case 'TRAVEL':
        return `rez://hotel/${intent.intentKey}`;
      case 'DINING':
        return `rez://restaurant/${intent.intentKey}`;
      case 'RETAIL':
        return `rez://product/${intent.intentKey}`;
      default:
        return 'rez://home';
    }
  }
}

// ── Nudge Channel Handler Interface ──────────────────────────────────────────

export interface NudgeChannelHandler {
  send(params: {
    userId: string;
    message: string;
    data?: Record<string, unknown>;
  }): Promise<{ success: boolean; error?: string }>;
}

// ── Singleton ────────────────────────────────────────────────────────────────

export const nudgeDeliveryService = new NudgeDeliveryService();
