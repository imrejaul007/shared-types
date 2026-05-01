import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { config, connectMongoDB, connectRedis, disconnectAll } from './config';
import { logger } from './utils/logger';
import { initializeQueues, initializeWorkers, shutdownWorkers } from './events/consumer';
import { schemaRegistry, EventType, getSchemaDocumentation } from './events/schema-registry';
import { eventEmitter, publish } from './events/emitter';
import {
  healthCheckHandler,
  readinessCheckHandler,
  livenessCheckHandler,
  statsHandler,
} from './health';
import { Event } from './events/schema-registry';

// Initialize Express app
const app: Express = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req: Request, res: Response, next: NextFunction) => {
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

// ============================================
// Health & Monitoring Routes
// ============================================
app.get('/health', healthCheckHandler);
app.get('/ready', readinessCheckHandler);
app.get('/live', livenessCheckHandler);
app.get('/stats', statsHandler);

// ============================================
// Event Publishing Routes
// ============================================

// Publish any event (raw)
app.post('/events/publish', async (req: Request, res: Response) => {
  try {
    const event = req.body as Event;

    if (!event.type) {
      return res.status(400).json({ error: 'Event type is required' });
    }

    const result = await eventEmitter.publish(event, {
      source: config.service.name,
    });

    if (result.success) {
      res.status(201).json({
        success: true,
        eventId: result.eventId,
        correlationId: result.correlationId,
      });
    } else {
      res.status(400).json({
        success: false,
        error: result.error,
        validationErrors: result.validationErrors,
      });
    }
  } catch (error) {
    logger.error('Failed to publish event', {
      error: error instanceof Error ? error.message : 'Unknown',
    });
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Emit inventory.low event
app.post('/events/inventory/low', async (req: Request, res: Response) => {
  try {
    const result = await eventEmitter.emitInventoryLow(req.body);

    if (result.success) {
      res.status(201).json({
        success: true,
        eventId: result.eventId,
        correlationId: result.correlationId,
      });
    } else {
      res.status(400).json({
        success: false,
        error: result.error,
        validationErrors: result.validationErrors,
      });
    }
  } catch (error) {
    logger.error('Failed to emit inventory.low event', {
      error: error instanceof Error ? error.message : 'Unknown',
    });
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Emit order.completed event
app.post('/events/order/completed', async (req: Request, res: Response) => {
  try {
    const result = await eventEmitter.emitOrderCompleted(req.body);

    if (result.success) {
      res.status(201).json({
        success: true,
        eventId: result.eventId,
        correlationId: result.correlationId,
      });
    } else {
      res.status(400).json({
        success: false,
        error: result.error,
        validationErrors: result.validationErrors,
      });
    }
  } catch (error) {
    logger.error('Failed to emit order.completed event', {
      error: error instanceof Error ? error.message : 'Unknown',
    });
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Emit payment.success event
app.post('/events/payment/success', async (req: Request, res: Response) => {
  try {
    const result = await eventEmitter.emitPaymentSuccess(req.body);

    if (result.success) {
      res.status(201).json({
        success: true,
        eventId: result.eventId,
        correlationId: result.correlationId,
      });
    } else {
      res.status(400).json({
        success: false,
        error: result.error,
        validationErrors: result.validationErrors,
      });
    }
  } catch (error) {
    logger.error('Failed to emit payment.success event', {
      error: error instanceof Error ? error.message : 'Unknown',
    });
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ============================================
// Schema Documentation Routes
// ============================================
app.get('/schemas', (req: Request, res: Response) => {
  res.json(getSchemaDocumentation());
});

app.get('/schemas/:type', (req: Request, res: Response) => {
  const { type } = req.params;
  const schema = schemaRegistry.getSchema(type);

  if (!schema) {
    return res.status(404).json({ error: `Schema not found for type: ${type}` });
  }

  res.json({
    type,
    version: schemaRegistry.getVersion(type),
    schema: schema,
  });
});

// ============================================
// Service Info Route
// ============================================
app.get('/', (req: Request, res: Response) => {
  res.json({
    service: config.service.name,
    version: config.events.schemaVersion,
    description: 'REZ Event Platform - Central event bus for the ecosystem',
    endpoints: {
      health: '/health',
      ready: '/ready',
      live: '/live',
      stats: '/stats',
      schemas: '/schemas',
      publish: '/events/publish',
      inventory: {
        low: '/events/inventory/low',
      },
      order: {
        completed: '/events/order/completed',
      },
      payment: {
        success: '/events/payment/success',
      },
    },
    eventTypes: schemaRegistry.getRegisteredTypes(),
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Not found' });
});

// Error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error('Unhandled error', {
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  res.status(500).json({
    error: 'Internal server error',
    message: config.service.env === 'development' ? err.message : undefined,
  });
});

// ============================================
// Server Startup
// ============================================
async function startServer(): Promise<void> {
  try {
    logger.info('Starting REZ Event Platform...', { config: config.service });

    // Connect to MongoDB
    await connectMongoDB();

    // Connect to Redis
    await connectRedis();

    // Initialize event queues
    await initializeQueues();

    // Start BullMQ workers
    await initializeWorkers();

    // Start HTTP server
    const server = app.listen(config.service.port, () => {
      logger.info(`REZ Event Platform started`, {
        port: config.service.port,
        env: config.service.env,
        schemas: schemaRegistry.getRegisteredTypes(),
      });
    });

    // Graceful shutdown
    const shutdown = async (signal: string) => {
      logger.info(`Received ${signal}, shutting down gracefully...`);

      server.close(async () => {
        logger.info('HTTP server closed');

        try {
          await shutdownWorkers();
          await disconnectAll();
          logger.info('Shutdown complete');
          process.exit(0);
        } catch (error) {
          logger.error('Error during shutdown', { error });
          process.exit(1);
        }
      });

      // Force shutdown after 30 seconds
      setTimeout(() => {
        logger.error('Forced shutdown after timeout');
        process.exit(1);
      }, 30000);
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));

    // Handle uncaught exceptions
    process.on('uncaughtException', (error) => {
      logger.error('Uncaught exception', { error: error.message, stack: error.stack });
      process.exit(1);
    });

    process.on('unhandledRejection', (reason) => {
      logger.error('Unhandled rejection', { reason });
      process.exit(1);
    });

  } catch (error) {
    logger.error('Failed to start server', {
      error: error instanceof Error ? error.message : 'Unknown',
    });
    process.exit(1);
  }
}

// Start the server
startServer();

export { app };
