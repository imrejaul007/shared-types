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
    description: 'REZ Mind - Central event bus',
    endpoints: {
      health: '/health',
      ready: '/ready',
      live: '/live',
      publish: 'POST /events/:type',
      merchant_webhooks: '/webhook/status',
      inventory: 'POST /webhook/merchant/inventory',
      order: 'POST /webhook/merchant/order',
      payment: 'POST /webhook/merchant/payment',
      consumer_order: 'POST /webhook/consumer/order',
      consumer_search: 'POST /webhook/consumer/search',
      consumer_view: 'POST /webhook/consumer/view',
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

// ============================================================
// MERCHANT APP WEBHOOKS - For connecting Merchant OS
// ============================================================

// Merchant inventory event
app.post('/webhook/merchant/inventory', async (req: Request, res: Response) => {
  const { merchant_id, item_id, item_name, current_stock, threshold, avg_daily_sales, recent_orders, source } = req.body;

  const correlation_id = `merchant_${merchant_id}_${Date.now()}`;

  logger.info('[MERCHANT INVENTORY EVENT]', { merchant_id, item_id, correlation_id });

  try {
    const event = {
      event: 'inventory.low',
      correlation_id,
      source: source || 'merchant_app',
      data: {
        merchant_id,
        item_id,
        item_name,
        current_stock: parseInt(current_stock),
        threshold: parseInt(threshold),
        avg_daily_sales: avg_daily_sales ? parseFloat(avg_daily_sales) : undefined,
        recent_orders_last_3_days: recent_orders ? parseInt(recent_orders) : undefined,
      }
    };

    // Store event
    const log = new EventLog({
      type: 'inventory.low',
      correlationId: correlation_id,
      source: source || 'merchant_app',
      payload: event,
      status: 'received',
    });
    await log.save();

    // Forward to Action Engine
    try {
      await axios.post(`${ACTION_ENGINE_URL}/webhook/events`, event, { timeout: 5000 });
    } catch (aeError) {
      logger.error('[ACTION ENGINE ERROR]', { error: (aeError as Error).message });
    }

    res.json({ success: true, correlation_id, event_id: log._id });
  } catch (error: any) {
    logger.error('[MERCHANT EVENT ERROR]', { error: error.message });
    res.status(500).json({ success: false, error: error.message });
  }
});

// Merchant order completed event
app.post('/webhook/merchant/order', async (req: Request, res: Response) => {
  const { merchant_id, order_id, items, total_amount, customer_id, payment_method, source } = req.body;

  const correlation_id = `merchant_order_${merchant_id}_${Date.now()}`;

  logger.info('[MERCHANT ORDER EVENT]', { merchant_id, order_id, correlation_id });

  try {
    const event = {
      event: 'order.completed',
      correlation_id,
      source: source || 'merchant_app',
      data: {
        order_id,
        merchant_id,
        customer_id,
        items: items || [],
        total_amount: parseFloat(total_amount),
        payment_method,
      }
    };

    const log = new EventLog({
      type: 'order.completed',
      correlationId: correlation_id,
      source: source || 'merchant_app',
      payload: event,
      status: 'received',
    });
    await log.save();

    res.json({ success: true, correlation_id, event_id: log._id });
  } catch (error: any) {
    logger.error('[MERCHANT ORDER ERROR]', { error: error.message });
    res.status(500).json({ success: false, error: error.message });
  }
});

// Merchant payment success event
app.post('/webhook/merchant/payment', async (req: Request, res: Response) => {
  const { merchant_id, transaction_id, amount, status, source } = req.body;

  const correlation_id = `merchant_payment_${merchant_id}_${Date.now()}`;

  logger.info('[MERCHANT PAYMENT EVENT]', { merchant_id, transaction_id, correlation_id });

  try {
    const event = {
      event: 'payment.success',
      correlation_id,
      source: source || 'merchant_app',
      data: {
        transaction_id,
        merchant_id,
        amount: parseFloat(amount),
        status,
      }
    };

    const log = new EventLog({
      type: 'payment.success',
      correlationId: correlation_id,
      source: source || 'merchant_app',
      payload: event,
      status: 'received',
    });
    await log.save();

    res.json({ success: true, correlation_id, event_id: log._id });
  } catch (error: any) {
    logger.error('[MERCHANT PAYMENT ERROR]', { error: error.message });
    res.status(500).json({ success: false, error: error.message });
  }
});

// ============================================================
// CONSUMER APP WEBHOOKS - For connecting Consumer Apps
// ============================================================

// Consumer order event
app.post('/webhook/consumer/order', async (req: Request, res: Response) => {
  const { user_id, order_id, items, total_amount, merchant_id, source } = req.body;

  const correlation_id = `consumer_order_${user_id}_${Date.now()}`;

  logger.info('[CONSUMER ORDER EVENT]', { user_id, order_id, correlation_id });

  try {
    const event = {
      event: 'consumer.order',
      correlation_id,
      source: source || 'consumer_app',
      data: {
        order_id,
        user_id,
        merchant_id,
        items: items || [],
        total_amount: parseFloat(total_amount),
      }
    };

    const log = new EventLog({
      type: 'consumer.order',
      correlationId: correlation_id,
      source: source || 'consumer_app',
      payload: event,
      status: 'received',
    });
    await log.save();

    res.json({ success: true, correlation_id, event_id: log._id });
  } catch (error: any) {
    logger.error('[CONSUMER ORDER ERROR]', { error: error.message });
    res.status(500).json({ success: false, error: error.message });
  }
});

// Consumer search event (for intent tracking)
app.post('/webhook/consumer/search', async (req: Request, res: Response) => {
  const { user_id, query, results_count, clicked_item, source } = req.body;

  const correlation_id = `consumer_search_${user_id}_${Date.now()}`;

  logger.info('[CONSUMER SEARCH EVENT]', { user_id, query, correlation_id });

  try {
    const event = {
      event: 'consumer.search',
      correlation_id,
      source: source || 'consumer_app',
      data: {
        user_id,
        query,
        results_count,
        clicked_item,
      }
    };

    const log = new EventLog({
      type: 'consumer.search',
      correlationId: correlation_id,
      source: source || 'consumer_app',
      payload: event,
      status: 'received',
    });
    await log.save();

    res.json({ success: true, correlation_id, event_id: log._id });
  } catch (error: any) {
    logger.error('[CONSUMER SEARCH ERROR]', { error: error.message });
    res.status(500).json({ success: false, error: error.message });
  }
});

// Consumer view event
app.post('/webhook/consumer/view', async (req: Request, res: Response) => {
  const { user_id, item_id, item_name, merchant_id, duration_seconds, source } = req.body;

  const correlation_id = `consumer_view_${user_id}_${Date.now()}`;

  logger.info('[CONSUMER VIEW EVENT]', { user_id, item_id, correlation_id });

  try {
    const event = {
      event: 'consumer.view',
      correlation_id,
      source: source || 'consumer_app',
      data: {
        user_id,
        item_id,
        item_name,
        merchant_id,
        duration_seconds: parseInt(duration_seconds) || 0,
      }
    };

    const log = new EventLog({
      type: 'consumer.view',
      correlationId: correlation_id,
      source: source || 'consumer_app',
      payload: event,
      status: 'received',
    });
    await log.save();

    res.json({ success: true, correlation_id, event_id: log._id });
  } catch (error: any) {
    logger.error('[CONSUMER VIEW ERROR]', { error: error.message });
    res.status(500).json({ success: false, error: error.message });
  }
});

// ============================================================
// INTEGRATION STATUS
// ============================================================

app.get('/webhook/status', (req: Request, res: Response) => {
  res.json({
    service: 'rez-event-platform',
    webhooks: {
      merchant: {
        'POST /webhook/merchant/inventory': 'Merchant inventory low event',
        'POST /webhook/merchant/order': 'Merchant order completed',
        'POST /webhook/merchant/payment': 'Merchant payment success',
      },
      consumer: {
        'POST /webhook/consumer/order': 'Consumer order placed',
        'POST /webhook/consumer/search': 'Consumer search query',
        'POST /webhook/consumer/view': 'Consumer item view',
      }
    },
    action_engine_url: ACTION_ENGINE_URL,
  });
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
