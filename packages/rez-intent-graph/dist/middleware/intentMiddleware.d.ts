import type { Request, Response, NextFunction } from 'express';
import type { AppType, EventType, Category } from '../types/intent.js';
export interface IntentCaptureConfig {
    userIdExtractor: (req: Request) => string | null;
    appType: AppType;
    category: Category;
    intentKeyResolver?: (req: Request) => string;
    eventType?: EventType;
    metadataExtractor?: (req: Request) => Record<string, unknown>;
    captureCondition?: (req: Request) => boolean;
}
/**
 * Create middleware for capturing intents on specific routes
 */
export declare function createIntentCaptureMiddleware(config: IntentCaptureConfig): (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * Express middleware for capturing intents
 * Attaches to specific HTTP methods and paths
 */
export declare function intentCaptureMiddleware(req: Request, res: Response, next: NextFunction): void;
export declare const hotelSearchCapture: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const hotelViewCapture: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const hotelHoldCapture: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const restaurantViewCapture: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const cartAddCapture: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const checkoutStartCapture: (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=intentMiddleware.d.ts.map