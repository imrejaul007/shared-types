// ── Intent Capture Middleware ──────────────────────────────────────────────────
// Express middleware for capturing intents from HTTP requests
import { intentCaptureService } from '../services/IntentCaptureService.js';
/**
 * Create middleware for capturing intents on specific routes
 */
export function createIntentCaptureMiddleware(config) {
    return async (req, res, next) => {
        // Extract user ID
        const userId = config.userIdExtractor(req);
        if (!userId) {
            return next();
        }
        // Check capture condition
        if (config.captureCondition && !config.captureCondition(req)) {
            return next();
        }
        // Resolve intent key
        const intentKey = config.intentKeyResolver
            ? config.intentKeyResolver(req)
            : `${config.appType}_${req.method}_${req.path}`;
        // Extract metadata
        const metadata = config.metadataExtractor?.(req);
        const params = {
            userId,
            appType: config.appType,
            eventType: config.eventType || 'view',
            category: config.category,
            intentKey,
            metadata,
        };
        try {
            await intentCaptureService.capture(params);
        }
        catch (error) {
            // Don't block request on intent capture failure
            console.error('[IntentMiddleware] Capture failed:', error);
        }
        next();
    };
}
/**
 * Express middleware for capturing intents
 * Attaches to specific HTTP methods and paths
 */
export function intentCaptureMiddleware(req, res, next) {
    // This is a placeholder - use createIntentCaptureMiddleware for actual usage
    next();
}
// ── Pre-built Middleware Configurations ──────────────────────────────────────
export const hotelSearchCapture = createIntentCaptureMiddleware({
    userIdExtractor: (req) => req.headers['x-user-id'],
    appType: 'hotel_ota',
    category: 'TRAVEL',
    intentKeyResolver: (req) => {
        const { city, checkIn, checkOut } = req.query;
        return `hotel_${city || 'unknown'}_${checkIn || ''}_${checkOut || ''}`;
    },
    eventType: 'search',
    captureCondition: (req) => req.method === 'GET' && req.path.includes('/hotels/search'),
});
export const hotelViewCapture = createIntentCaptureMiddleware({
    userIdExtractor: (req) => req.headers['x-user-id'],
    appType: 'hotel_ota',
    category: 'TRAVEL',
    intentKeyResolver: (req) => {
        const hotelId = req.params.hotelId || req.query.hotelId;
        return `hotel_view_${hotelId}`;
    },
    eventType: 'view',
    captureCondition: (req) => req.method === 'GET' && req.path.includes('/hotels/'),
});
export const hotelHoldCapture = createIntentCaptureMiddleware({
    userIdExtractor: (req) => req.headers['x-user-id'],
    appType: 'hotel_ota',
    category: 'TRAVEL',
    intentKeyResolver: (req) => {
        const { hotelId, roomTypeId } = req.body;
        return `hotel_hold_${hotelId}_${roomTypeId}`;
    },
    eventType: 'hold',
    captureCondition: (req) => req.method === 'POST' && req.path.includes('/hold'),
});
export const restaurantViewCapture = createIntentCaptureMiddleware({
    userIdExtractor: (req) => req.headers['x-user-id'],
    appType: 'restaurant',
    category: 'DINING',
    intentKeyResolver: (req) => {
        const merchantId = req.params.merchantId || req.query.merchantId;
        return `restaurant_view_${merchantId}`;
    },
    eventType: 'view',
    captureCondition: (req) => req.method === 'GET' && req.path.includes('/merchants/'),
});
export const cartAddCapture = createIntentCaptureMiddleware({
    userIdExtractor: (req) => req.headers['x-user-id'],
    appType: 'restaurant',
    category: 'DINING',
    intentKeyResolver: (req) => {
        const { merchantId, productId } = req.body;
        return `cart_add_${merchantId}_${productId}`;
    },
    eventType: 'cart_add',
    captureCondition: (req) => req.method === 'POST' && req.path.includes('/cart'),
});
export const checkoutStartCapture = createIntentCaptureMiddleware({
    userIdExtractor: (req) => req.headers['x-user-id'],
    appType: 'restaurant',
    category: 'DINING',
    intentKeyResolver: (req) => {
        const { merchantId } = req.body;
        return `checkout_start_${merchantId}`;
    },
    eventType: 'checkout_start',
    captureCondition: (req) => req.method === 'POST' && req.path.includes('/checkout'),
});
//# sourceMappingURL=intentMiddleware.js.map