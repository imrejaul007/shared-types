import { Request, Response } from 'express';
/**
 * POST /api/webhooks/hotel/search
 * Captures hotel search intent
 */
export declare function handleHotelSearch(req: Request, res: Response): Promise<void>;
/**
 * POST /api/webhooks/hotel/hold
 * Captures booking hold intent
 */
export declare function handleHotelHold(req: Request, res: Response): Promise<void>;
/**
 * POST /api/webhooks/hotel/confirm
 * Captures booking confirmation (intent fulfilled)
 */
export declare function handleHotelConfirm(req: Request, res: Response): Promise<void>;
/**
 * POST /api/webhooks/restaurant/view
 * Captures restaurant/menu view intent
 */
export declare function handleRestaurantView(req: Request, res: Response): Promise<void>;
/**
 * POST /api/webhooks/restaurant/add-to-cart
 * Captures add to cart intent
 */
export declare function handleAddToCart(req: Request, res: Response): Promise<void>;
/**
 * POST /api/webhooks/restaurant/order
 * Captures order placed (intent fulfilled)
 */
export declare function handleOrderPlaced(req: Request, res: Response): Promise<void>;
/**
 * POST /api/webhooks/nudge/delivered
 * Records nudge delivery event
 */
export declare function handleNudgeDelivered(req: Request, res: Response): Promise<void>;
/**
 * POST /api/webhooks/nudge/clicked
 * Records nudge click event
 */
export declare function handleNudgeClicked(req: Request, res: Response): Promise<void>;
/**
 * POST /api/webhooks/nudge/converted
 * Records nudge conversion event
 */
export declare function handleNudgeConverted(req: Request, res: Response): Promise<void>;
/**
 * POST /api/webhooks/batch/capture
 * Batch capture multiple intent events
 */
export declare function handleBatchCapture(req: Request, res: Response): Promise<void>;
//# sourceMappingURL=webhooks.d.ts.map