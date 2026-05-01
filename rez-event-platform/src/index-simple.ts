/**
 * Simplified Event Platform - With Action Engine Integration
 */

import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import mongoose from 'mongoose';
import axios from 'axios';
import { logger } from './utils/logger';

const app: Express = express();
const PORT = parseInt(process.env.PORT || '4008', 10);
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/rez-app';
const ACTION_ENGINE_URL = process.env.ACTION_ENGINE_URL || 'http://localhost:4009';

// Reuse existing schema
const eventLogSchema = new mongoose.Schema({
  type: String,
  correlationId: String,
  source: String,
  payload: mongoose.Schema.Types.Mixed,
  status: { type: String, default: 'received' },
  createdAt: { type: Date, default: Date.now },
});

const EventLog = mongoose.models.EventLog || mongoose.model('EventLog', eventLogSchema, 'event_logs');

// Middleware
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req: Request, res: Response, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info('HTTP Request', {
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration,
    });
  });
  next();
});

// Health check
app.get('/health', async (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    service: 'rez-event-platform',
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    actionEngine: ACTION_ENGINE_URL,
    timestamp: new Date().toISOString(),
  });
});

app.get('/ready', (req: Request, res: Response) => {
  const ready = mongoose.connection.readyState === 1;
  res.status(ready ? 200 : 503).json({ ready });
});

app.get('/live', (req: Request, res: Response) => {
  res.json({ alive: true });
});

// Root
app.get('/', (req: Request, res: Response) => {
  res.json({
    service: 'rez-event-platform',
    version: '1.0.0',
    description: 'REZ Event Platform - Central event bus',
    endpoints: {
      health: '/health',
      ready: '/ready',
      live: '/live',
      publish: 'POST /events/:type',
    },
  });
});

// Event publishing endpoint
app.post('/events/:type', async (req: Request, res: Response) => {
  const eventType = req.params.type;
  const event = req.body;

  logger.info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', {});
  logger.info('[EVENT RECEIVED]', { eventType, correlationId: event.correlation_id });
  logger.info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', {});

  try {
    // Check for duplicate using correlation_id
    if (event.correlation_id) {
      const existing = await EventLog.findOne({ correlationId: event.correlation_id });
      if (existing) {
        logger.info('[DUPLICATE DETECTED]', { correlationId: event.correlation_id });
        return res.json({
          success: true,
          eventId: existing._id,
          correlationId: existing.correlationId,
          duplicate: true,
        });
      }
    }

    // Store event
    const log = new EventLog({
      type: eventType,
      correlationId: event.correlation_id || event.correlationId,
      source: event.source,
      payload: event,
      status: 'received',
    });
    await log.save();

    logger.info('[EVENT STORED]', { eventId: log._id, eventType, correlationId: log.correlationId });

    // Forward to Action Engine
    try {
      logger.info('[FORWARDING TO ACTION ENGINE]', { url: `${ACTION_ENGINE_URL}/webhook/events` });
      const aeResponse = await axios.post(`${ACTION_ENGINE_URL}/webhook/events`, event, {
        timeout: 5000,
      });
      logger.info('[ACTION ENGINE RESPONSE]', {
        success: aeResponse.data?.success,
        decision: aeResponse.data?.decision?.type
      });
    } catch (aeError: any) {
      logger.error('[ACTION ENGINE ERROR]', { error: aeError.message });
      // Don't fail the event - just log the error
    }

    res.json({
      success: true,
      eventId: log._id,
      correlationId: log.correlationId,
    });
  } catch (error: any) {
    logger.error('[EVENT ERROR]', { error: error.message });
    res.status(500).json({ success: false, error: error.message });
  }
});

// Stats endpoint
app.get('/stats', async (req: Request, res: Response) => {
  try {
    const total = await EventLog.countDocuments();
    const byType = await EventLog.aggregate([
      { $group: { _id: '$type', count: { $sum: 1 } } }
    ]);

    res.json({ total, byType });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Not found' });
});

// Error handler
app.use((err: Error, req: Request, res: Response, next: any) => {
  logger.error('Unhandled error', { error: err.message });
  res.status(500).json({ error: 'Internal server error' });
});

// Startup
async function start() {
  try {
    logger.info('Starting REZ Event Platform...');
    logger.info('Connecting to MongoDB...', { uri: MONGODB_URI });

    await mongoose.connect(MONGODB_URI);
    logger.info('MongoDB connected successfully');

    app.listen(PORT, () => {
      logger.info(`REZ Event Platform started`, { port: PORT });
      logger.info(`Action Engine: ${ACTION_ENGINE_URL}`);
      logger.info(`Health: http://localhost:${PORT}/health`);
    });
  } catch (error: any) {
    logger.error('Failed to start', { error: error.message });
    process.exit(1);
  }
}

start();
