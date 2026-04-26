// ── Agent Server ─────────────────────────────────────────────────────────────────
// Standalone Express server for running the agent swarm

import express, { Request, Response, NextFunction } from 'express';
import {
  getSwarmCoordinator,
  runAgent,
  getSwarmStatus,
  runAllAgentsOnce,
  sharedMemory,
} from '../agents/index.js';

const app = express();
const PORT = process.env.AGENT_PORT || 3005;

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
    console.log('[Agent Server] Available endpoints:');
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
