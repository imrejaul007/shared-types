import { ToolHandlerConfig } from '../types';
export declare function initializeAPIClients(config: {
    merchantServiceUrl?: string;
    hotelServiceUrl?: string;
    walletServiceUrl?: string;
    orderServiceUrl?: string;
    loyaltyServiceUrl?: string;
    searchServiceUrl?: string;
}): void;
export declare const searchHotelsTool: ToolHandlerConfig;
export declare const createHotelBookingTool: ToolHandlerConfig;
export declare const searchRestaurantsTool: ToolHandlerConfig;
export declare const placeOrderTool: ToolHandlerConfig;
export declare const reserveTableTool: ToolHandlerConfig;
export declare const roomServiceTool: ToolHandlerConfig;
export declare const housekeepingTool: ToolHandlerConfig;
export declare const getWalletBalanceTool: ToolHandlerConfig;
export declare const getLoyaltyPointsTool: ToolHandlerConfig;
export declare const getOrderStatusTool: ToolHandlerConfig;
export declare const getBookingDetailsTool: ToolHandlerConfig;
export declare const cancelBookingTool: ToolHandlerConfig;
export declare const escalateToStaffTool: ToolHandlerConfig;
export declare const searchProductsTool: ToolHandlerConfig;
export declare const getUserIntentsTool: ToolHandlerConfig;
export declare const triggerNudgeTool: ToolHandlerConfig;
export declare const ALL_REZ_TOOLS: ToolHandlerConfig[];
export default ALL_REZ_TOOLS;
//# sourceMappingURL=rezTools.d.ts.map