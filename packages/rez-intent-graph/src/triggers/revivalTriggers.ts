// ── Revival Trigger Handlers ─────────────────────────────────────────────────────
// Handles different trigger types for dormant intent revival

import { PrismaClient } from '@prisma/client';
import { intentScoringService } from '../services/IntentScoringService.js';

const prisma = new PrismaClient();

export type TriggerType = 'price_drop' | 'return_user' | 'seasonality' | 'offer_match' | 'manual';

export interface TriggerResult {
  success: boolean;
  triggered: number;
  revivalScore?: number;
  suggestedMessage?: string;
}

// ── Price Drop Trigger ─────────────────────────────────────────────────────────

export async function handlePriceDropTrigger(
  dormantIntentId: string,
  priceDropPct: number = 10
): Promise<TriggerResult> {
  // Price drop bonus: up to 0.25 for significant drops
  const priceBonus = Math.min(0.25, priceDropPct / 100);

  const baseScore = await intentScoringService.calculateRevivalScore(dormantIntentId);
  const newScore = Math.min(1.0, baseScore + priceBonus);

  // Update dormant intent
  await prisma.dormantIntent.update({
    where: { id: dormantIntentId },
    data: { revivalScore: newScore },
  });

  const dormant = await prisma.dormantIntent.findUnique({ where: { id: dormantIntentId } });
  const message = `Price alert! ${formatIntentKey(dormant?.intentKey || '')} just got ${priceDropPct}% cheaper!`;

  return {
    success: true,
    triggered: 1,
    revivalScore: newScore,
    suggestedMessage: message,
  };
}

// ── Return User Trigger ───────────────────────────────────────────────────────

export async function handleReturnUserTrigger(
  dormantIntentId: string,
  daysSinceReturn: number
): Promise<TriggerResult> {
  // Return user bonus: higher for longer absences
  let returnBonus = 0;
  if (daysSinceReturn >= 3) returnBonus = 0.15;
  if (daysSinceReturn >= 7) returnBonus = 0.20;
  if (daysSinceReturn >= 14) returnBonus = 0.25;

  const baseScore = await intentScoringService.calculateRevivalScore(dormantIntentId);
  const newScore = Math.min(1.0, baseScore + returnBonus);

  await prisma.dormantIntent.update({
    where: { id: dormantIntentId },
    data: { revivalScore: newScore },
  });

  const dormant = await prisma.dormantIntent.findUnique({ where: { id: dormantIntentId } });
  const message = `Welcome back! ${formatIntentKey(dormant?.intentKey || '')} is waiting for you.`;

  return {
    success: true,
    triggered: 1,
    revivalScore: newScore,
    suggestedMessage: message,
  };
}

// ── Seasonality Trigger ───────────────────────────────────────────────────────

export async function handleSeasonalityTrigger(
  dormantIntentId: string,
  season: 'spring' | 'summer' | 'autumn' | 'winter' | 'holiday' | 'weekend'
): Promise<TriggerResult> {
  // Seasonality bonus based on category and season
  const seasonBonus: Record<string, Record<string, number>> = {
    TRAVEL: {
      weekend: 0.20,
      holiday: 0.25,
      spring: 0.15,
      summer: 0.20,
    },
    DINING: {
      weekend: 0.15,
      holiday: 0.20,
    },
    RETAIL: {
      holiday: 0.25,
      weekend: 0.10,
    },
  };

  const dormant = await prisma.dormantIntent.findUnique({
    where: { id: dormantIntentId },
    include: { intent: true },
  });

  const category = dormant?.category || 'DINING';
  const bonus = seasonBonus[category]?.[season] || 0.10;

  const baseScore = await intentScoringService.calculateRevivalScore(dormantIntentId);
  const newScore = Math.min(1.0, baseScore + bonus);

  await prisma.dormantIntent.update({
    where: { id: dormantIntentId },
    data: { revivalScore: newScore },
  });

  const seasonMessages: Record<string, string> = {
    weekend: "Perfect weekend for {intent}!",
    holiday: "Holiday special on {intent}!",
    spring: "Spring into {intent}!",
    summer: "Summer deals on {intent}!",
    autumn: "Autumn savings on {intent}!",
    winter: "Winter warm-up deals on {intent}!",
  };

  const message = seasonMessages[season]?.replace('{intent}', formatIntentKey(dormant?.intentKey || '')) ||
    `${formatIntentKey(dormant?.intentKey || '')} - perfect timing!`;

  return {
    success: true,
    triggered: 1,
    revivalScore: newScore,
    suggestedMessage: message,
  };
}

// ── Offer Match Trigger ───────────────────────────────────────────────────────

export async function handleOfferMatchTrigger(
  dormantIntentId: string,
  offerType: 'discount' | 'cashback' | 'free_delivery' | 'buy_one_get_one' | 'loyalty_points'
): Promise<TriggerResult> {
  // Offer match bonus: very high for matching user intent
  const offerBonus: Record<string, number> = {
    discount: 0.25,
    cashback: 0.20,
    free_delivery: 0.15,
    buy_one_get_one: 0.20,
    loyalty_points: 0.15,
  };

  const bonus = offerBonus[offerType] || 0.15;

  const baseScore = await intentScoringService.calculateRevivalScore(dormantIntentId);
  const newScore = Math.min(1.0, baseScore + bonus);

  await prisma.dormantIntent.update({
    where: { id: dormantIntentId },
    data: { revivalScore: newScore },
  });

  const dormant = await prisma.dormantIntent.findUnique({ where: { id: dormantIntentId } });
  const offerMessages: Record<string, string> = {
    discount: `{intent} - special discount just for you!`,
    cashback: `{intent} + cashback offer!`,
    free_delivery: `{intent} - free delivery!`,
    buy_one_get_one: `{intent} - buy one get one!`,
    loyalty_points: `{intent} - earn double points!`,
  };

  const message = offerMessages[offerType]
    ?.replace('{intent}', formatIntentKey(dormant?.intentKey || '')) ||
    `${formatIntentKey(dormant?.intentKey || '')} - special offer!`;

  return {
    success: true,
    triggered: 1,
    revivalScore: newScore,
    suggestedMessage: message,
  };
}

// ── Manual Trigger ────────────────────────────────────────────────────────────

export async function handleManualTrigger(
  dormantIntentId: string,
  agentId?: string
): Promise<TriggerResult> {
  // Manual trigger: small bonus, logs agent action
  const baseScore = await intentScoringService.calculateRevivalScore(dormantIntentId);
  const newScore = Math.min(1.0, baseScore + 0.05);

  await prisma.dormantIntent.update({
    where: { id: dormantIntentId },
    data: { revivalScore: newScore },
  });

  const dormant = await prisma.dormantIntent.findUnique({ where: { id: dormantIntentId } });
  const message = `${formatIntentKey(dormant?.intentKey || '')} - recommended for you!`;

  console.log(`[RevivalTrigger] Manual trigger by agent ${agentId} for intent ${dormantIntentId}`);

  return {
    success: true,
    triggered: 1,
    revivalScore: newScore,
    suggestedMessage: message,
  };
}

// ── Bulk Trigger Handler ──────────────────────────────────────────────────────

export async function handleBulkTrigger(
  userId: string,
  triggerType: TriggerType,
  triggerData?: Record<string, unknown>
): Promise<TriggerResult> {
  const dormantIntents = await prisma.dormantIntent.findMany({
    where: { userId, status: 'active' },
  });

  let triggered = 0;
  let totalScore = 0;

  for (const dormant of dormantIntents) {
    let result: TriggerResult;

    switch (triggerType) {
      case 'price_drop':
        result = await handlePriceDropTrigger(dormant.id, triggerData?.priceDropPct as number);
        break;
      case 'return_user':
        result = await handleReturnUserTrigger(dormant.id, triggerData?.daysSinceReturn as number);
        break;
      case 'seasonality':
        result = await handleSeasonalityTrigger(dormant.id, triggerData?.season as any);
        break;
      case 'offer_match':
        result = await handleOfferMatchTrigger(dormant.id, triggerData?.offerType as any);
        break;
      default:
        result = await handleManualTrigger(dormant.id);
    }

    if (result.success) {
      triggered++;
      totalScore += result.revivalScore || 0;
    }
  }

  return {
    success: true,
    triggered,
    revivalScore: triggered > 0 ? totalScore / triggered : 0,
  };
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatIntentKey(key: string): string {
  return key
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
