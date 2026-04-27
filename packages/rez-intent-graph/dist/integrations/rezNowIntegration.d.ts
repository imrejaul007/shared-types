export interface RestaurantIntentContext {
    userId: string;
    merchantId: string;
    productId?: string;
    category?: string;
    query?: string;
}
/**
 * Capture restaurant/merchant search intent
 */
export declare function captureRestaurantSearch(params: RestaurantIntentContext): Promise<void>;
/**
 * Capture merchant view intent
 */
export declare function captureMerchantView(params: RestaurantIntentContext): Promise<void>;
/**
 * Capture add to cart intent (strong purchase signal)
 */
export declare function captureAddToCart(params: RestaurantIntentContext): Promise<void>;
/**
 * Capture checkout start intent
 */
export declare function captureCheckoutStart(params: RestaurantIntentContext): Promise<void>;
/**
 * Capture order placed (intent fulfilled)
 */
export declare function captureOrderPlaced(params: RestaurantIntentContext): Promise<void>;
/**
 * Capture cart abandonment
 */
export declare function captureCartAbandoned(params: RestaurantIntentContext): Promise<void>;
/**
 * Get active dining intents for a user
 */
export declare function getActiveDiningIntents(userId: string): Promise<import("../index.js").IIntent[]>;
/**
 * ReZ Now Integration object
 */
export declare const rezNowIntegration: {
    captureSearch: typeof captureRestaurantSearch;
    captureView: typeof captureMerchantView;
    captureAddToCart: typeof captureAddToCart;
    captureCheckoutStart: typeof captureCheckoutStart;
    captureOrderPlaced: typeof captureOrderPlaced;
    captureCartAbandoned: typeof captureCartAbandoned;
    getActiveIntents: typeof getActiveDiningIntents;
};
//# sourceMappingURL=rezNowIntegration.d.ts.map