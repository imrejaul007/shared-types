import { ToolHandlerConfig } from '../types';
/**
 * Book hotel + request room preferences + check loyalty status
 * Single conversation turn: "Book a hotel for tomorrow and set up my preferences"
 */
export declare const bookHotelWithPreferencesTool: ToolHandlerConfig;
/**
 * Search restaurant + make reservation + order drinks
 * Single conversation turn: "Book a romantic dinner for 2 at an Italian place"
 */
export declare const planDinnerDateTool: ToolHandlerConfig;
/**
 * Place order + apply loyalty discount + earn points
 * Single conversation turn: "Order from McDonalds and use my karma points"
 */
export declare const placeOrderWithLoyaltyTool: ToolHandlerConfig;
/**
 * Book hotel + flights + experiences
 * Single conversation turn: "Plan a trip to Goa for 3 days with beach activities"
 */
export declare const planTripTool: ToolHandlerConfig;
/**
 * Combine multiple items, apply all discounts, show final total
 */
export declare const checkoutWithDiscountsTool: ToolHandlerConfig;
export declare const ORCHESTRATION_TOOLS: ToolHandlerConfig[];
export default ORCHESTRATION_TOOLS;
//# sourceMappingURL=orchestration.d.ts.map