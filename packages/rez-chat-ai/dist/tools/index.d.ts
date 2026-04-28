import { CustomerContext, ToolResult } from '../types';
export interface ProductSearchParams {
    query: string;
    category?: string;
    filters?: {
        priceMin?: number;
        priceMax?: number;
        rating?: number;
        inStock?: boolean;
    };
    limit?: number;
}
export interface ProductSearchResult {
    success: boolean;
    data?: {
        products: Array<{
            id: string;
            name: string;
            description: string;
            price: number;
            category: string;
            rating?: number;
            inStock: boolean;
            image?: string;
        }>;
        total: number;
    };
    error?: string;
}
export interface ServiceSearchParams {
    query: string;
    category?: string;
    location?: string;
    rating?: number;
    limit?: number;
}
export interface ServiceSearchResult {
    success: boolean;
    data?: {
        services: Array<{
            id: string;
            name: string;
            description: string;
            provider: string;
            price: string;
            rating?: number;
            available: boolean;
        }>;
        total: number;
    };
    error?: string;
}
export interface OrderParams {
    productId: string;
    quantity: number;
    deliveryAddress?: string;
    specialInstructions?: string;
}
export interface OrderResult {
    success: boolean;
    data?: {
        orderId: string;
        status: string;
        estimatedDelivery?: string;
        total: number;
        items: string[];
    };
    error?: string;
}
export interface OrderStatusParams {
    orderId: string;
}
export interface OrderStatusResult {
    success: boolean;
    data?: {
        orderId: string;
        status: 'pending' | 'confirmed' | 'preparing' | 'shipped' | 'delivered' | 'cancelled';
        statusText: string;
        estimatedDelivery?: string;
        tracking?: string;
        items: Array<{
            name: string;
            quantity: number;
            price: number;
        }>;
    };
    error?: string;
}
export interface CancelOrderParams {
    orderId: string;
    reason?: string;
}
export interface HotelBookingParams {
    hotelId: string;
    checkIn: string;
    checkOut: string;
    roomType: string;
    guests: number;
    specialRequests?: string;
}
export interface RestaurantReservationParams {
    restaurantId: string;
    date: string;
    time: string;
    partySize: number;
    seatingPreference?: 'indoor' | 'outdoor' | 'private';
    occasion?: string;
    specialRequests?: string;
}
export interface ServiceBookingParams {
    serviceId: string;
    providerId: string;
    date: string;
    time: string;
    duration?: number;
    notes?: string;
}
export interface EscalateParams {
    reason: string;
    department?: 'sales' | 'support' | 'billing' | 'technical' | 'management';
    priority?: 'normal' | 'high' | 'urgent';
    conversationHistory?: string[];
}
export interface EscalateResult {
    success: boolean;
    data?: {
        ticketId: string;
        estimatedWait?: string;
        department: string;
        message: string;
    };
    error?: string;
}
export interface ProfileParams {
    userId: string;
}
export interface ProfileResult {
    success: boolean;
    data?: {
        name: string;
        email: string;
        phone?: string;
        tier: string;
        totalOrders: number;
        totalSpent: number;
        coins: number;
        joinedDate: string;
    };
    error?: string;
}
export interface ComplaintParams {
    orderId: string;
    type: 'missing_item' | 'wrong_item' | 'damaged' | 'quality_issue' | 'late_delivery' | 'other';
    description: string;
    evidence?: string[];
}
export interface RefundParams {
    orderId: string;
    reason: string;
    amount?: number;
}
export interface ToolDefinition {
    name: string;
    description: string;
    category: 'search' | 'order' | 'booking' | 'account' | 'support';
    parameters: Record<string, {
        type: string;
        description: string;
        required: boolean;
    }>;
    execute: (params: Record<string, unknown>, context: CustomerContext) => Promise<ToolResult>;
}
export declare const getUserIntentsToolDef: ToolDefinition;
export declare const triggerNudgeToolDef: ToolDefinition;
export declare const TOOL_REGISTRY: ToolDefinition[];
export declare function executeTool(toolName: string, params: Record<string, unknown>, context: CustomerContext): Promise<ToolResult>;
export declare function getToolsByCategory(category: ToolDefinition['category']): ToolDefinition[];
export declare function getToolByName(name: string): ToolDefinition | undefined;
//# sourceMappingURL=index.d.ts.map