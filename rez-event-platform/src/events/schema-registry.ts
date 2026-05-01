import { z, ZodSchema, ZodError } from 'zod';
import { logger } from '../utils/logger';

export { logger };

// Base event schema that all events must extend
export const BaseEventSchema = z.object({
  id: z.string().uuid(),
  type: z.string(),
  version: z.string().default('1.0.0'),
  timestamp: z.string().datetime(),
  correlationId: z.string().uuid().optional(),
  source: z.string(),
  metadata: z.record(z.unknown()).optional(),
});

export type BaseEvent = z.infer<typeof BaseEventSchema>;

// Event type definitions
export enum EventType {
  INVENTORY_LOW = 'inventory.low',
  ORDER_COMPLETED = 'order.completed',
  PAYMENT_SUCCESS = 'payment.success',
}

// Schema versions for migration support
export const SchemaVersions = {
  V1: '1.0.0',
  V2: '2.0.0',
} as const;

// ============================================
// INVENTORY.LOW Event Schema
// ============================================
export const InventoryLowEventPayloadSchema = z.object({
  inventoryId: z.string(),
  productId: z.string(),
  productName: z.string(),
  currentQuantity: z.number().int().min(0),
  threshold: z.number().int().min(0),
  warehouseId: z.string().optional(),
  sku: z.string().optional(),
  supplierId: z.string().optional(),
  suggestedReorderQuantity: z.number().int().positive().optional(),
  severity: z.enum(['low', 'medium', 'high', 'critical']).default('medium'),
});

export const InventoryLowEventSchema = BaseEventSchema.extend({
  type: z.literal(EventType.INVENTORY_LOW),
  payload: InventoryLowEventPayloadSchema,
});

export type InventoryLowEvent = z.infer<typeof InventoryLowEventSchema>;

// ============================================
// ORDER.COMPLETED Event Schema
// ============================================
export const OrderCompletedEventPayloadSchema = z.object({
  orderId: z.string(),
  customerId: z.string(),
  items: z.array(z.object({
    productId: z.string(),
    name: z.string(),
    quantity: z.number().int().positive(),
    unitPrice: z.number().positive(),
    subtotal: z.number().positive(),
  })),
  subtotal: z.number().positive(),
  tax: z.number().min(0),
  shipping: z.number().min(0),
  total: z.number().positive(),
  currency: z.string().length(3).default('USD'),
  paymentMethod: z.enum(['credit_card', 'debit_card', 'paypal', 'bank_transfer', 'cash', 'crypto']),
  shippingAddress: z.object({
    street: z.string(),
    city: z.string(),
    state: z.string(),
    postalCode: z.string(),
    country: z.string(),
  }).optional(),
  billingAddress: z.object({
    street: z.string(),
    city: z.string(),
    state: z.string(),
    postalCode: z.string(),
    country: z.string(),
  }).optional(),
  fulfillmentStatus: z.enum(['pending', 'processing', 'shipped', 'delivered']).default('pending'),
  notes: z.string().optional(),
});

export const OrderCompletedEventSchema = BaseEventSchema.extend({
  type: z.literal(EventType.ORDER_COMPLETED),
  payload: OrderCompletedEventPayloadSchema,
});

export type OrderCompletedEvent = z.infer<typeof OrderCompletedEventSchema>;

// ============================================
// PAYMENT.SUCCESS Event Schema
// ============================================
export const PaymentSuccessEventPayloadSchema = z.object({
  paymentId: z.string(),
  orderId: z.string(),
  customerId: z.string(),
  amount: z.number().positive(),
  currency: z.string().length(3).default('USD'),
  method: z.string(),
  transactionId: z.string(),
  status: z.enum(['pending', 'completed', 'failed', 'refunded', 'partial_refund']),
  gateway: z.enum(['stripe', 'paypal', 'square', 'braintree', 'internal']),
  gatewayResponse: z.record(z.unknown()).optional(),
  metadata: z.record(z.unknown()).optional(),
  refundAmount: z.number().min(0).optional(),
  refundedAt: z.string().datetime().optional(),
});

export const PaymentSuccessEventSchema = BaseEventSchema.extend({
  type: z.literal(EventType.PAYMENT_SUCCESS),
  payload: PaymentSuccessEventPayloadSchema,
});

export type PaymentSuccessEvent = z.infer<typeof PaymentSuccessEventSchema>;

// Union type for all events
export type Event = InventoryLowEvent | OrderCompletedEvent | PaymentSuccessEvent;

// Schema registry for runtime validation
export class SchemaRegistry {
  private schemas: Map<string, { schema: ZodSchema; version: string }> = new Map();
  private middleware: Array<(event: unknown) => unknown> = [];

  constructor() {
    this.register(EventType.INVENTORY_LOW, InventoryLowEventSchema, SchemaVersions.V1);
    this.register(EventType.ORDER_COMPLETED, OrderCompletedEventSchema, SchemaVersions.V1);
    this.register(EventType.PAYMENT_SUCCESS, PaymentSuccessEventSchema, SchemaVersions.V1);
  }

  register(type: string, schema: ZodSchema, version: string): void {
    this.schemas.set(type, { schema, version });
    logger.info(`Schema registered`, { type, version });
  }

  getSchema(type: string): ZodSchema | undefined {
    return this.schemas.get(type)?.schema;
  }

  validate(type: string, data: unknown): { success: boolean; data?: unknown; error?: ZodError } {
    const schemaEntry = this.schemas.get(type);

    if (!schemaEntry) {
      logger.warn(`No schema found for event type`, { type });
      return {
        success: false,
        error: new ZodError([{
          code: 'custom',
          path: ['type'],
          message: `Unknown event type: ${type}`,
        }]),
      };
    }

    try {
      const validatedData = schemaEntry.schema.parse(data);
      return { success: true, data: validatedData };
    } catch (error) {
      if (error instanceof ZodError) {
        logger.warn(`Schema validation failed`, { type, errors: error.errors });
        return { success: false, error };
      }
      throw error;
    }
  }

  addMiddleware(fn: (event: unknown) => unknown): void {
    this.middleware.push(fn);
  }

  applyMiddleware(event: unknown): unknown {
    return this.middleware.reduce((acc, fn) => fn(acc), event);
  }

  getRegisteredTypes(): string[] {
    return Array.from(this.schemas.keys());
  }

  getVersion(type: string): string | undefined {
    return this.schemas.get(type)?.version;
  }
}

// Singleton instance
export const schemaRegistry = new SchemaRegistry();

// Validation middleware factory
export function createValidationMiddleware(type: EventType) {
  return (req: { body?: unknown }, res: { status: (code: number) => { json: (data: unknown) => void } }, next: () => void) => {
    const result = schemaRegistry.validate(type, req.body);

    if (!result.success || !result.data) {
      logger.warn(`Validation failed for ${type}`, { errors: result.error?.errors });
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: result.error?.errors.map(e => ({
          path: e.path.join('.'),
          message: e.message,
        })),
      });
    }

    req.body = result.data;
    next();
  };
}

// Schema documentation helper
export function getSchemaDocumentation(): Record<string, {
  type: string;
  version: string;
  payloadSchema: string;
  description: string;
}> {
  return {
    [EventType.INVENTORY_LOW]: {
      type: EventType.INVENTORY_LOW,
      version: SchemaVersions.V1,
      description: 'Emitted when inventory levels fall below the threshold',
      payloadSchema: 'InventoryLowEventPayloadSchema',
    },
    [EventType.ORDER_COMPLETED]: {
      type: EventType.ORDER_COMPLETED,
      version: SchemaVersions.V1,
      description: 'Emitted when an order is successfully completed',
      payloadSchema: 'OrderCompletedEventPayloadSchema',
    },
    [EventType.PAYMENT_SUCCESS]: {
      type: EventType.PAYMENT_SUCCESS,
      version: SchemaVersions.V1,
      description: 'Emitted when a payment is successfully processed',
      payloadSchema: 'PaymentSuccessEventPayloadSchema',
    },
  };
}
