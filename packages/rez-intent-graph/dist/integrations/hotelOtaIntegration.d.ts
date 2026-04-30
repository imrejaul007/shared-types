export interface HotelIntentContext {
    userId: string;
    hotelId: string;
    roomTypeId?: string;
    city?: string;
    checkIn?: string;
    checkOut?: string;
    guests?: number;
}
/**
 * Capture hotel search intent
 */
export declare function captureHotelSearch(params: HotelIntentContext): Promise<void>;
/**
 * Capture hotel view intent
 */
export declare function captureHotelView(params: HotelIntentContext): Promise<void>;
/**
 * Capture booking hold intent (strong purchase signal)
 */
export declare function captureBookingHold(params: HotelIntentContext): Promise<void>;
/**
 * Capture booking confirmation (intent fulfilled)
 */
export declare function captureBookingConfirmed(params: HotelIntentContext): Promise<void>;
/**
 * Capture booking cancellation (intent abandoned)
 */
export declare function captureBookingCancelled(params: HotelIntentContext): Promise<void>;
/**
 * Get active travel intents for a user
 */
export declare function getActiveTravelIntents(userId: string): Promise<import("../index.js").IIntent[]>;
/**
 * Hotel OTA Integration object
 */
export declare const hotelOtaIntegration: {
    captureSearch: typeof captureHotelSearch;
    captureView: typeof captureHotelView;
    captureHold: typeof captureBookingHold;
    captureConfirmed: typeof captureBookingConfirmed;
    captureCancelled: typeof captureBookingCancelled;
    getActiveIntents: typeof getActiveTravelIntents;
};
//# sourceMappingURL=hotelOtaIntegration.d.ts.map