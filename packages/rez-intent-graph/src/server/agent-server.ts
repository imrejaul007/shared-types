// ── Agent Server ─────────────────────────────────────────────────────────────────
// Standalone Express server for running the agent swarm
// DANGEROUS: Full autonomous mode with skip-permission capabilities

import express, { Request, Response, NextFunction } from 'express';
import {
  getSwarmCoordinator,
  runAgent,
  getSwarmStatus,
  runAllAgentsOnce,
  sharedMemory,
  // ── Autonomous Orchestrator ──────────────────────────────────────────────────
  getAutonomousOrchestrator,
  startAutonomousMode,
  stopAutonomousMode,
  executeAutonomousAction,
  // ── Dangerous Mode ───────────────────────────────────────────────────────────
  enableDangerousMode,
  disableDangerousMode,
  emergencyStop,
} from '../agents/index.js';

const app = express();
const PORT = process.env.AGENT_PORT || 3005;

// ── Enable Dangerous Mode on Server Start ──────────────────────────────────────
console.log('🚨 DANGEROUS MODE: Enabling skip-permission capabilities on server startup');
enableDangerousMode();

app.use(express.json());

// ── Request logging ─────────────────────────────────────────────────────────────

app.use((req: Request, _res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// ── Health check ───────────────────────────────────────────────────────────────

app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ── Swarm status ────────────────────────────────────────────────────────────────

app.get('/api/swarm/status', async (_req: Request, res: Response) => {
  try {
    const status = await getSwarmStatus();
    res.json(status);
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});

// ── Run single agent ───────────────────────────────────────────────────────────

app.post('/api/swarm/run/:agentName', async (req: Request, res: Response) => {
  const { agentName } = req.params;

  try {
    const result = await runAgent(agentName);
    if (!result) {
      res.status(404).json({ error: 'Agent not found' });
      return;
    }
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});

// ── Run all agents ─────────────────────────────────────────────────────────────

app.post('/api/swarm/run-all', async (_req: Request, res: Response) => {
  try {
    const results = await runAllAgentsOnce();
    res.json({ results });
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});

// ── Memory stats ────────────────────────────────────────────────────────────────

app.get('/api/memory/stats', async (_req: Request, res: Response) => {
  try {
    const stats = await sharedMemory.stats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});

// ── Demand signals ─────────────────────────────────────────────────────────────

app.get('/api/demand/:merchantId/:category', async (req: Request, res: Response) => {
  const { merchantId, category } = req.params;

  try {
    const signal = await sharedMemory.getDemandSignal(merchantId, category);
    if (!signal) {
      res.status(404).json({ error: 'Signal not found' });
      return;
    }
    res.json(signal);
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});

// ── Scarcity signals ───────────────────────────────────────────────────────────

app.get('/api/scarcity/:merchantId/:category', async (req: Request, res: Response) => {
  const { merchantId, category } = req.params;

  try {
    const signal = await sharedMemory.getScarcitySignal(merchantId, category);
    if (!signal) {
      res.status(404).json({ error: 'Signal not found' });
      return;
    }
    res.json(signal);
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});

app.get('/api/scarcity/critical', async (_req: Request, res: Response) => {
  try {
    const signals = await sharedMemory.getCriticalScarcity();
    res.json(signals);
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});

// ── User profiles ──────────────────────────────────────────────────────────────

app.get('/api/profiles/:userId', async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const profile = await sharedMemory.getUserProfile(userId);
    if (!profile) {
      res.status(404).json({ error: 'Profile not found' });
      return;
    }
    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});

// ── Revenue reports ─────────────────────────────────────────────────────────────

app.get('/api/revenue/latest', async (_req: Request, res: Response) => {
  try {
    const report = await sharedMemory.getLatestRevenueReport();
    if (!report) {
      res.status(404).json({ error: 'No report found' });
      return;
    }
    res.json(report);
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});

// ── Optimization recommendations ─────────────────────────────────────────────────

app.get('/api/optimizations', async (_req: Request, res: Response) => {
  try {
    const recommendations = await sharedMemory.getAllOptimizations();
    res.json(recommendations);
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});

// ── Trending intents ────────────────────────────────────────────────────────────

app.get('/api/trending/:category', async (req: Request, res: Response) => {
  const { category } = req.params;

  try {
    const trending = await sharedMemory.getTrendingIntents(category);
    res.json(trending);
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});

// ═══════════════════════════════════════════════════════════════════════════════════
// AUTONOMOUS MODE API ENDPOINTS - DANGEROUS OPERATIONS
// These endpoints enable full autonomous agent operation with skip-permission
// ═══════════════════════════════════════════════════════════════════════════════════

// ── Enable Full Autonomy ────────────────────────────────────────────────────────

app.post('/api/autonomous/start', async (_req: Request, res: Response) => {
  try {
    console.log('🚨 AUTONOMOUS MODE: Starting full autonomous operation');
    await startAutonomousMode();
    const status = await getAutonomousOrchestrator().getStatus();
    res.json({
      success: true,
      message: 'Full autonomous mode enabled',
      status,
      warnings: [
        'All agents can execute dangerous actions',
        'Skip-permission mode is ACTIVE',
        'Emergency stop threshold: 100 actions',
      ],
    });
  } catch (error) {
    console.error('❌ AUTONOMOUS MODE FAILED:', error);
    res.status(500).json({ error: String(error) });
  }
});

// ── Disable Autonomy ───────────────────────────────────────────────────────────

app.post('/api/autonomous/stop', async (_req: Request, res: Response) => {
  try {
    console.log('🛑 AUTONOMOUS MODE: Stopping autonomous operation');
    await stopAutonomousMode();
    res.json({
      success: true,
      message: 'Autonomous mode disabled',
    });
  } catch (error) {
    console.error('❌ STOP AUTONOMOUS FAILED:', error);
    res.status(500).json({ error: String(error) });
  }
});

// ── Execute Dangerous Action ───────────────────────────────────────────────────

app.post('/api/autonomous/action', async (req: Request, res: Response) => {
  const { actionType, payload, agentName } = req.body;

  if (!actionType || !agentName) {
    res.status(400).json({
      error: 'Missing required fields: actionType, agentName',
    });
    return;
  }

  try {
    console.log(`🚨 AUTONOMOUS ACTION: ${actionType} by ${agentName}`);
    const result = await executeAutonomousAction(actionType, payload || {});
    res.json({
      success: result,
      actionType,
      agentName,
      payload,
      executedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error(`❌ AUTONOMOUS ACTION FAILED:`, error);
    res.status(500).json({ error: String(error) });
  }
});

// ── Get Autonomy Status ────────────────────────────────────────────────────────

app.get('/api/autonomous/status', async (_req: Request, res: Response) => {
  try {
    const status = await getAutonomousOrchestrator().getStatus();
    const swarmStatus = await getSwarmStatus();
    res.json({
      orchestrator: status,
      swarm: swarmStatus,
      dangerousMode: {
        enabled: swarmStatus.dangerousMode,
        skipPermission: true,
      },
    });
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});

// ── Emergency Stop ─────────────────────────────────────────────────────────────

app.post('/api/autonomous/emergency-stop', async (req: Request, res: Response) => {
  const reason = req.body?.reason || 'Manual emergency stop via API';

  try {
    console.error(`🚨🚨🚨 EMERGENCY STOP TRIGGERED: ${reason}`);
    emergencyStop();
    res.json({
      success: true,
      message: 'Emergency stop executed',
      reason,
    });
  } catch (error) {
    console.error('❌ EMERGENCY STOP FAILED:', error);
    res.status(500).json({ error: String(error) });
  }
});

// ── Start All Agents ───────────────────────────────────────────────────────────

app.post('/api/autonomous/agents/start', async (_req: Request, res: Response) => {
  try {
    const orchestrator = getAutonomousOrchestrator();
    await orchestrator.startAllAgents();
    res.json({
      success: true,
      message: 'All agents started',
    });
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});

// ── Stop All Agents ────────────────────────────────────────────────────────────

app.post('/api/autonomous/agents/stop', async (_req: Request, res: Response) => {
  try {
    const orchestrator = getAutonomousOrchestrator();
    await orchestrator.stop();
    res.json({
      success: true,
      message: 'All agents stopped',
    });
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});

// ── Error handler ──────────────────────────────────────────────────────────────

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('[Server Error]', err);
  res.status(500).json({ error: err.message });
});

// ── Start server ───────────────────────────────────────────────────────────────

export function startAgentServer(): void {
  const coordinator = getSwarmCoordinator();

  const server = app.listen(PORT, () => {
    console.log(`[Agent Server] Running on port ${PORT}`);
    console.log('[Agent Server] Starting swarm coordinator...');

    coordinator.start();

    console.log('[Agent Server] Swarm coordinator started');
    console.log('[Agent Server] Swarm coordinator started');
    console.log('');
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('  AUTONOMOUS MODE ENDPOINTS (DANGEROUS)');
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('  POST /api/autonomous/start         - Enable full autonomy');
    console.log('  POST /api/autonomous/stop          - Disable autonomy');
    console.log('  POST /api/autonomous/action        - Execute dangerous action');
    console.log('  GET  /api/autonomous/status        - Get autonomy status');
    console.log('  POST /api/autonomous/emergency-stop - Emergency stop');
    console.log('  POST /api/autonomous/agents/start  - Start all agents');
    console.log('  POST /api/autonomous/agents/stop   - Stop all agents');
    console.log('');
    console.log('  STANDARD ENDPOINTS');
    console.log('  GET  /health              - Health check');
    console.log('  GET  /api/swarm/status    - Swarm status');
    console.log('  POST /api/swarm/run/:name - Run single agent');
    console.log('  POST /api/swarm/run-all   - Run all agents');
    console.log('  GET  /api/memory/stats    - Memory statistics');
    console.log('  GET  /api/demand/:m/:c    - Get demand signal');
    console.log('  GET  /api/scarcity/:m/:c  - Get scarcity signal');
    console.log('  GET  /api/scarcity/critical - Get critical scarcity');
    console.log('  GET  /api/profiles/:uid    - Get user profile');
    console.log('  GET  /api/revenue/latest   - Get latest revenue report');
    console.log('  GET  /api/optimizations   - Get optimization recs');
    console.log('  GET  /api/trending/:cat   - Get trending intents');
    console.log('═══════════════════════════════════════════════════════════════');
  });

  // Graceful shutdown
  process.on('SIGTERM', () => {
    console.log('[Agent Server] Shutting down...');
    coordinator.stop();
    server.close(() => {
      console.log('[Agent Server] Stopped');
      process.exit(0);
    });
  });
}

// Start if run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  startAgentServer();
}
