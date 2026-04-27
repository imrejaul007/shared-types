// ── Agent Integration Test Suite ────────────────────────────────────────────────
// Tests autonomous agent actions and Commerce Memory integration

import { PrismaClient } from '@prisma/client';
import {
  // Agents
  runDemandSignalAgent,
  runScarcityAgent,
  runPersonalizationAgent,
  runAttributionAgent,
  runAdaptiveScoringAgent,
  runFeedbackLoopAgent,
  runNetworkEffectAgent,
  runRevenueAttributionAgent,
  // Actions
  actionExecutor,
  handleDemandSignalAction,
  handleScarcitySignalAction,
  handleOptimizationAction,
  triggerAutoRevival,
  // Memory
  sharedMemory,
} from '../index.js';

const prisma = new PrismaClient();

const logger = {
  info: (msg: string, meta?: Record<string, unknown>) => console.log(`[TEST] ${msg}`, meta || ''),
  pass: (msg: string) => console.log(`✅ PASS: ${msg}`),
  fail: (msg: string, error?: unknown) => console.log(`❌ FAIL: ${msg}`, error || ''),
};

interface TestResult {
  name: string;
  passed: boolean;
  duration: number;
  error?: string;
}

const results: TestResult[] = [];

async function runTest(name: string, fn: () => Promise<void>): Promise<void> {
  const start = Date.now();
  try {
    await fn();
    results.push({ name, passed: true, duration: Date.now() - start });
    logger.pass(name);
  } catch (error) {
    results.push({ name, passed: false, duration: Date.now() - start, error: String(error) });
    logger.fail(name, error);
  }
}

// ── Test: Demand Signal Agent ───────────────────────────────────────────────

async function testDemandSignalAgent(): Promise<void> {
  const result = await runDemandSignalAgent();
  if (!result.success) throw new Error(`Agent failed: ${result.error}`);
  logger.info('Demand signal results', result.data as Record<string, unknown>);
}

// ── Test: Scarcity Agent ────────────────────────────────────────────────────

async function testScarcityAgent(): Promise<void> {
  const result = await runScarcityAgent();
  if (!result.success) throw new Error(`Agent failed: ${result.error}`);
  logger.info('Scarcity analysis results', result.data as Record<string, unknown>);
}

// ── Test: Personalization Agent ─────────────────────────────────────────────

async function testPersonalizationAgent(): Promise<void> {
  const result = await runPersonalizationAgent();
  if (!result.success) throw new Error(`Agent failed: ${result.error}`);
  logger.info('Personalization results', result.data as Record<string, unknown>);
}

// ── Test: Attribution Agent ─────────────────────────────────────────────────

async function testAttributionAgent(): Promise<void> {
  const result = await runAttributionAgent();
  if (!result.success) throw new Error(`Agent failed: ${result.error}`);
  logger.info('Attribution results', result.data as Record<string, unknown>);
}

// ── Test: Adaptive Scoring Agent ───────────────────────────────────────────

async function testAdaptiveScoringAgent(): Promise<void> {
  const result = await runAdaptiveScoringAgent();
  if (!result.success) throw new Error(`Agent failed: ${result.error}`);
  logger.info('Adaptive scoring results', result.data as Record<string, unknown>);
}

// ── Test: Network Effect Agent ─────────────────────────────────────────────

async function testNetworkEffectAgent(): Promise<void> {
  const result = await runNetworkEffectAgent();
  if (!result.success) throw new Error(`Agent failed: ${result.error}`);
  logger.info('Network effect results', result.data as Record<string, unknown>);
}

// ── Test: Revenue Attribution Agent ────────────────────────────────────────

async function testRevenueAgent(): Promise<void> {
  const result = await runRevenueAttributionAgent();
  if (!result.success) throw new Error(`Agent failed: ${result.error}`);
  logger.info('Revenue attribution results', result.data as Record<string, unknown>);
}

// ── Test: Feedback Loop Agent ─────────────────────────────────────────────

async function testFeedbackLoopAgent(): Promise<void> {
  const result = await runFeedbackLoopAgent();
  if (!result.success) throw new Error(`Agent failed: ${result.error}`);
  logger.info('Feedback loop results', result.data as Record<string, unknown>);
}

// ── Test: Demand Signal Action Trigger ─────────────────────────────────────

async function testDemandSignalAction(): Promise<void> {
  const mockSignal = {
    merchantId: 'test-merchant-001',
    category: 'DINING',
    demandCount: 150,
    unmetDemandPct: 75,
    avgPriceExpectation: 250,
    topCities: ['Mumbai', 'Delhi'],
    trend: 'rising' as const,
    spikeDetected: true,
    spikeFactor: 4.5,
    timestamp: new Date(),
  };

  await handleDemandSignalAction(mockSignal);
  logger.info('Demand signal action triggered');
}

// ── Test: Scarcity Signal Action Trigger ─────────────────────────────────

async function testScarcitySignalAction(): Promise<void> {
  const mockSignal = {
    merchantId: 'test-merchant-002',
    category: 'TRAVEL',
    supplyCount: 10,
    demandCount: 100,
    scarcityScore: 85,
    urgencyLevel: 'critical' as const,
    recommendations: ['Alert users immediately'],
    timestamp: new Date(),
  };

  await handleScarcitySignalAction(mockSignal);
  logger.info('Scarcity signal action triggered');
}

// ── Test: Optimization Action Trigger ──────────────────────────────────────

async function testOptimizationAction(): Promise<void> {
  const mockRecommendation = {
    type: 'threshold_adjust' as const,
    agent: 'scarcity-agent',
    currentValue: 70,
    recommendedValue: 85,
    confidence: 0.85,
    reason: 'Test optimization',
    expectedImpact: 15,
    timestamp: new Date(),
  };

  await handleOptimizationAction(mockRecommendation);
  logger.info('Optimization action triggered');
}

// ── Test: Auto Revival Trigger ───────────────────────────────────────────

async function testAutoRevival(): Promise<void> {
  // First create a dormant intent
  const userId = `test-user-${Date.now()}`;
  const intentKey = `test-intent-${Date.now()}`;

  // Create test intent
  await prisma.intent.upsert({
    where: { id: `test-${intentKey}` },
    create: {
      id: `test-${intentKey}`,
      userId,
      appType: 'hotel_ota',
      category: 'TRAVEL',
      intentKey,
      confidence: 0.5,
      status: 'DORMANT',
    },
    update: {},
  });

  // Create dormant intent
  await prisma.dormantIntent.upsert({
    where: { id: `test-dormant-${intentKey}` },
    create: {
      id: `test-dormant-${intentKey}`,
      intentId: `test-${intentKey}`,
      userId,
      appType: 'hotel_ota',
      category: 'TRAVEL',
      intentKey,
      dormancyScore: 0.5,
      revivalScore: 0.7,
      daysDormant: 10,
    },
    update: {},
  });

  const success = await triggerAutoRevival(userId, `test-dormant-${intentKey}`, 'Test reminder message');
  if (!success) throw new Error('Auto revival failed');
  logger.info('Auto revival triggered', { userId, intentKey });
}

// ── Test: Shared Memory Operations ────────────────────────────────────────

async function testSharedMemory(): Promise<void> {
  const testKey = `test-${Date.now()}`;
  const testValue = { data: 'test-value', timestamp: Date.now() };

  // Set
  await sharedMemory.set(testKey, testValue, 3600);

  // Get
  const retrieved = await sharedMemory.get<typeof testValue>(testKey);
  if (!retrieved || retrieved.data !== testValue.data) {
    throw new Error('Memory set/get failed');
  }

  // Stats
  const stats = await sharedMemory.stats();
  logger.info('Memory stats', stats);
}

// ── Test: Action Executor ─────────────────────────────────────────────────

async function testActionExecutor(): Promise<void> {
  const action = {
    type: 'alert_support' as const,
    target: 'test-support',
    payload: {
      type: 'test_alert' as const,
      severity: 'low' as const,
      message: 'Test alert from integration test',
    },
    agent: 'test-agent',
    skipPermission: true,
    risk: 'low' as const,
  };

  const success = await actionExecutor.execute(action);
  if (!success) throw new Error('Action executor failed');
  logger.info('Action executed successfully');

  // Verify history
  const history = actionExecutor.getHistory(10);
  if (history.length === 0) throw new Error('Action not recorded in history');
}

// ── Test: Commerce Memory API ─────────────────────────────────────────────

async function testCommerceMemoryAPI(): Promise<void> {
  const testUserId = `test-user-${Date.now()}`;

  // Create test user profile
  await prisma.crossAppIntentProfile.upsert({
    where: { userId: testUserId },
    create: {
      userId: testUserId,
      travelIntentCount: 5,
      diningIntentCount: 3,
      retailIntentCount: 2,
      totalConversions: 4,
      travelAffinity: 60,
      diningAffinity: 30,
      retailAffinity: 10,
    },
    update: {},
  });

  // Create test intent
  await prisma.intent.upsert({
    where: { id: `test-intent-${testUserId}` },
    create: {
      id: `test-intent-${testUserId}`,
      userId: testUserId,
      appType: 'hotel_ota',
      category: 'TRAVEL',
      intentKey: 'hotel_goa_weekend',
      confidence: 0.75,
      status: 'ACTIVE',
    },
    update: {},
  });

  logger.info('Commerce Memory API test data created', { userId: testUserId });
}

// ── Test: All Agents Together ─────────────────────────────────────────────

async function testAllAgents(): Promise<void> {
  logger.info('Running all agents in parallel...');

  const results = await Promise.allSettled([
    runDemandSignalAgent(),
    runScarcityAgent(),
    runPersonalizationAgent(),
    runAttributionAgent(),
    runAdaptiveScoringAgent(),
    runNetworkEffectAgent(),
    runRevenueAttributionAgent(),
    runFeedbackLoopAgent(),
  ]);

  const failures = results.filter((r) => r.status === 'rejected' || !('value' in r) || !r.value.success);
  if (failures.length > 0) {
    throw new Error(`${failures.length}/${results.length} agents failed`);
  }

  logger.info('All 8 agents completed successfully');
}

// ── Run All Tests ────────────────────────────────────────────────────────

async function main(): Promise<void> {
  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('  RTMN Commerce Memory - Agent Integration Test Suite');
  console.log('═══════════════════════════════════════════════════════════════\n');

  try {
    // Agent Tests
    await runTest('Demand Signal Agent', testDemandSignalAgent);
    await runTest('Scarcity Agent', testScarcityAgent);
    await runTest('Personalization Agent', testPersonalizationAgent);
    await runTest('Attribution Agent', testAttributionAgent);
    await runTest('Adaptive Scoring Agent', testAdaptiveScoringAgent);
    await runTest('Network Effect Agent', testNetworkEffectAgent);
    await runTest('Revenue Attribution Agent', testRevenueAgent);
    await runTest('Feedback Loop Agent', testFeedbackLoopAgent);

    // Action Trigger Tests
    await runTest('Demand Signal Action', testDemandSignalAction);
    await runTest('Scarcity Signal Action', testScarcitySignalAction);
    await runTest('Optimization Action', testOptimizationAction);
    await runTest('Auto Revival', testAutoRevival);

    // Infrastructure Tests
    await runTest('Shared Memory Operations', testSharedMemory);
    await runTest('Action Executor', testActionExecutor);
    await runTest('Commerce Memory API Setup', testCommerceMemoryAPI);

    // Integration Test
    await runTest('All Agents Together', testAllAgents);
  } catch (error) {
    logger.fail('Test suite', error);
  }

  // Summary
  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('  Test Summary');
  console.log('═══════════════════════════════════════════════════════════════');

  const passed = results.filter((r) => r.passed).length;
  const failed = results.filter((r) => !r.passed).length;
  const totalDuration = results.reduce((sum, r) => sum + r.duration, 0);

  console.log(`  Total: ${results.length}`);
  console.log(`  ✅ Passed: ${passed}`);
  console.log(`  ❌ Failed: ${failed}`);
  console.log(`  ⏱ Total Duration: ${totalDuration}ms`);
  console.log('═══════════════════════════════════════════════════════════════\n');

  if (failed > 0) {
    console.log('Failed tests:');
    for (const r of results.filter((r) => !r.passed)) {
      console.log(`  - ${r.name}: ${r.error}`);
    }
    process.exit(1);
  }

  // Cleanup
  await prisma.$disconnect();
  console.log('Test suite complete!\n');
}

main().catch((error) => {
  console.error('Test suite failed:', error);
  process.exit(1);
});
