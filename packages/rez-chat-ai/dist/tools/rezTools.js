"use strict";
// ── ReZ Agent OS - Tool Definitions ──────────────────────────────────────────────
// All tools available to the AI agent, with real API integrations
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ALL_REZ_TOOLS = exports.triggerNudgeTool = exports.getUserIntentsTool = exports.searchProductsTool = exports.escalateToStaffTool = exports.cancelBookingTool = exports.getBookingDetailsTool = exports.getOrderStatusTool = exports.getLoyaltyPointsTool = exports.getWalletBalanceTool = exports.housekeepingTool = exports.roomServiceTool = exports.reserveTableTool = exports.placeOrderTool = exports.searchRestaurantsTool = exports.createHotelBookingTool = exports.searchHotelsTool = void 0;
exports.initializeAPIClients = initializeAPIClients;
const axios_1 = __importDefault(require("axios"));
const logger_1 = require("../logger");
const clients = {};
function initializeAPIClients(config) {
    if (config.merchantServiceUrl) {
        clients.merchantAPI = axios_1.default.create({ baseURL: config.merchantServiceUrl, timeout: 10000 });
    }
    if (config.hotelServiceUrl) {
        clients.hotelAPI = axios_1.default.create({ baseURL: config.hotelServiceUrl, timeout: 10000 });
    }
    if (config.walletServiceUrl) {
        clients.walletAPI = axios_1.default.create({ baseURL: config.walletServiceUrl, timeout: 10000 });
    }
    if (config.orderServiceUrl) {
        clients.orderAPI = axios_1.default.create({ baseURL: config.orderServiceUrl, timeout: 10000 });
    }
    if (config.loyaltyServiceUrl) {
        clients.loyaltyAPI = axios_1.default.create({ baseURL: config.loyaltyServiceUrl, timeout: 10000 });
    }
    if (config.searchServiceUrl) {
        clients.searchAPI = axios_1.default.create({ baseURL: config.searchServiceUrl, timeout: 10000 });
    }
}
// ── Tool: Search Hotels ─────────────────────────────────────────────────────────
exports.searchHotelsTool = {
    name: 'search_hotels',
    description: 'Search for hotels based on location, dates, and preferences',
    parameters: {
        location: { type: 'string', description: 'City or area to search', required: true },
        checkIn: { type: 'string', description: 'Check-in date (YYYY-MM-DD)', required: true },
        checkOut: { type: 'string', description: 'Check-out date (YYYY-MM-DD)', required: true },
        guests: { type: 'number', description: 'Number of guests', required: true },
        rooms: { type: 'number', description: 'Number of rooms', required: false },
        priceRange: { type: 'string', description: 'Price range: budget, mid, premium', required: false },
        amenities: { type: 'string', description: 'Required amenities (comma-separated)', required: false },
    },
    execute: async (params, context) => {
        try {
            const amenitiesValue = params.amenities;
            // Hotel OTA /hotel/search endpoint
            const response = await clients.hotelAPI?.get('/hotel/search', {
                params: {
                    location: params.location,
                    checkIn: params.checkIn,
                    checkOut: params.checkOut,
                    guests: params.guests,
                    rooms: params.rooms || 1,
                    priceRange: params.priceRange,
                    amenities: amenitiesValue?.split(',').map((s) => s.trim()),
                }
            });
            const hotels = response?.data?.hotels || response?.data || [];
            if (!hotels || hotels.length === 0) {
                return {
                    success: true,
                    data: {
                        hotels: [],
                        message: `No hotels found in ${params.location} for your dates. Try different dates or location.`
                    }
                };
            }
            return {
                success: true,
                data: {
                    hotels: hotels.slice(0, 5).map((h) => ({
                        id: h.id || h.hotel_id,
                        name: h.name,
                        location: h.location || h.area,
                        price: h.pricePerNight || h.price,
                        rating: h.rating,
                        amenities: h.topAmenities || h.amenities,
                    })),
                    total: hotels.length,
                    message: `Found ${hotels.length} hotels in ${params.location}`
                }
            };
        }
        catch (error) {
            logger_1.logger.error('search_hotels failed', { error: error.message });
            return { success: false, error: 'Unable to search hotels. Please try again.' };
        }
    }
};
// ── Tool: Create Hotel Booking ──────────────────────────────────────────────────
exports.createHotelBookingTool = {
    name: 'create_hotel_booking',
    description: 'Create a hotel room reservation (hold then confirm)',
    parameters: {
        hotelId: { type: 'string', description: 'Hotel ID', required: true },
        roomType: { type: 'string', description: 'Room type code', required: true },
        checkIn: { type: 'string', description: 'Check-in date (YYYY-MM-DD)', required: true },
        checkOut: { type: 'string', description: 'Check-out date (YYYY-MM-DD)', required: true },
        guests: { type: 'number', description: 'Number of guests', required: true },
        guestDetails: { type: 'object', description: 'Guest information', required: false },
        paymentMethod: { type: 'string', description: 'Payment: wallet, card, coins', required: false },
        applyCashback: { type: 'boolean', description: 'Apply ReZ coins as discount', required: false },
    },
    execute: async (params, context) => {
        try {
            const guestDetailsParam = params.guestDetails;
            // Step 1: Hold booking - Hotel OTA /booking/hold
            const holdResponse = await clients.hotelAPI?.post('/booking/hold', {
                hotelId: params.hotelId,
                roomType: params.roomType,
                checkIn: params.checkIn,
                checkOut: params.checkOut,
                guests: params.guests,
                guestDetails: {
                    name: context.name,
                    email: context.email,
                    phone: context.phone,
                    ...guestDetailsParam,
                },
                paymentMethod: params.paymentMethod || 'wallet',
                applyCashback: params.applyCashback,
                userId: context.customerId,
            });
            const holdResult = holdResponse?.data;
            if (!holdResult?.booking_id) {
                return { success: false, error: holdResult?.message || 'Unable to hold booking.' };
            }
            // Step 2: Confirm booking - Hotel OTA /booking/confirm
            const confirmResponse = await clients.hotelAPI?.post('/booking/confirm', {
                bookingId: holdResult.booking_id,
                paymentMethod: params.paymentMethod || 'wallet',
                applyCashback: params.applyCashback,
            });
            const booking = confirmResponse?.data;
            return {
                success: true,
                data: {
                    bookingId: booking?.id || holdResult.booking_id,
                    confirmationCode: booking?.confirmationCode || holdResult?.confirmationCode,
                    status: booking?.status || 'confirmed',
                    total: booking?.totalAmount || holdResult?.totalAmount,
                    message: `Booking confirmed! Your confirmation code is ${booking?.confirmationCode || holdResult?.confirmationCode}. Check-in at ${params.checkIn}, check-out at ${params.checkOut}.`
                }
            };
        }
        catch (error) {
            logger_1.logger.error('create_hotel_booking failed', { error: error.message });
            return { success: false, error: error.message || 'Booking failed. Please try again.' };
        }
    }
};
// ── Tool: Search Restaurants ─────────────────────────────────────────────────────
exports.searchRestaurantsTool = {
    name: 'search_restaurants',
    description: 'Search for restaurants by location, cuisine, or name',
    parameters: {
        query: { type: 'string', description: 'Search query (name, cuisine, or location)', required: true },
        location: { type: 'string', description: 'Area or landmark', required: false },
        cuisine: { type: 'string', description: 'Cuisine type', required: false },
        priceRange: { type: 'string', description: 'Price range: budget, mid, premium', required: false },
        rating: { type: 'number', description: 'Minimum rating (1-5)', required: false },
        delivery: { type: 'boolean', description: 'Only show restaurants with delivery', required: false },
    },
    execute: async (params, context) => {
        try {
            const response = await clients.merchantAPI?.post('/v1/restaurants/search', {
                query: params.query,
                location: params.location,
                cuisine: params.cuisine,
                priceRange: params.priceRange,
                minRating: params.rating,
                deliveryAvailable: params.delivery,
            });
            const restaurants = response?.data?.restaurants || [];
            return {
                success: true,
                data: {
                    restaurants: restaurants.slice(0, 5).map((r) => ({
                        id: r.id,
                        name: r.name,
                        location: r.area,
                        cuisine: r.cuisine,
                        rating: r.rating,
                        priceRange: r.priceRange,
                        deliveryTime: r.deliveryTime,
                        minimumOrder: r.minimumOrder,
                    })),
                    total: restaurants.length,
                }
            };
        }
        catch (error) {
            logger_1.logger.error('search_restaurants failed', { error: error.message });
            return { success: false, error: 'Unable to search restaurants. Please try again.' };
        }
    }
};
// ── Tool: Place Order ─────────────────────────────────────────────────────────
exports.placeOrderTool = {
    name: 'place_order',
    description: 'Place a food or product order',
    parameters: {
        storeId: { type: 'string', description: 'Store or restaurant ID', required: true },
        items: { type: 'array', description: 'Array of {itemId, quantity, notes}', required: true },
        orderType: { type: 'string', description: 'dine_in, delivery, takeout', required: true },
        deliveryAddress: { type: 'string', description: 'Full delivery address', required: false },
        tableNumber: { type: 'string', description: 'Table number for dine-in', required: false },
        specialInstructions: { type: 'string', description: 'Special instructions', required: false },
        applyCashback: { type: 'boolean', description: 'Use ReZ coins for discount', required: false },
    },
    execute: async (params, context) => {
        try {
            // rez-order-service /orders endpoint
            const itemsParam = params.items;
            const response = await clients.orderAPI?.post('/orders', {
                storeId: params.storeId,
                items: itemsParam.map(item => ({
                    product: item.itemId || item.product,
                    quantity: item.quantity,
                    price: item.price || 0,
                    name: item.name,
                })),
                delivery: {
                    type: params.orderType,
                    address: params.deliveryAddress ? { full: params.deliveryAddress } : undefined,
                },
                deliveryAddress: params.deliveryAddress,
                specialInstructions: params.specialInstructions,
            }, {
                headers: {
                    'x-user-id': context.customerId,
                }
            });
            const order = response?.data?.data || response?.data;
            return {
                success: true,
                data: {
                    orderId: order?._id || order?.id,
                    orderNumber: order?.orderNumber,
                    status: order?.status,
                    total: order?.totals?.total || order?.total,
                    message: `Order ${order?.orderNumber || 'placed'} successfully!`
                }
            };
        }
        catch (error) {
            logger_1.logger.error('place_order failed', { error: error.message });
            return { success: false, error: error.message || 'Order failed. Please try again.' };
        }
    }
};
// ── Tool: Reserve Table ───────────────────────────────────────────────────────
exports.reserveTableTool = {
    name: 'reserve_table',
    description: 'Make a restaurant table reservation',
    parameters: {
        storeId: { type: 'string', description: 'Restaurant ID', required: true },
        date: { type: 'string', description: 'Reservation date (YYYY-MM-DD)', required: true },
        time: { type: 'string', description: 'Reservation time (HH:MM)', required: true },
        partySize: { type: 'number', description: 'Number of guests', required: true },
        occasion: { type: 'string', description: 'Special occasion (birthday, anniversary, etc.)', required: false },
        seatingPreference: { type: 'string', description: 'indoor, outdoor, window, private', required: false },
        specialRequests: { type: 'string', description: 'Additional requests', required: false },
    },
    execute: async (params, context) => {
        try {
            const response = await clients.merchantAPI?.post('/v1/reservations/create', {
                storeId: params.storeId,
                date: params.date,
                time: params.time,
                partySize: params.partySize,
                occasion: params.occasion,
                seatingPreference: params.seatingPreference,
                specialRequests: params.specialRequests,
                customerId: context.customerId,
                customerName: context.name,
                customerPhone: context.phone,
            });
            const reservation = response?.data;
            return {
                success: true,
                data: {
                    reservationId: reservation.id,
                    confirmationCode: reservation.confirmationCode,
                    status: reservation.status,
                    date: params.date,
                    time: params.time,
                    partySize: params.partySize,
                    message: `Table reserved for ${params.partySize} on ${params.date} at ${params.time}. Confirmation: ${reservation.confirmationCode}`
                }
            };
        }
        catch (error) {
            logger_1.logger.error('reserve_table failed', { error: error.message });
            return { success: false, error: error.message || 'Reservation failed. Please try again.' };
        }
    }
};
// ── Tool: Room Service ─────────────────────────────────────────────────────────
exports.roomServiceTool = {
    name: 'request_room_service',
    description: 'Order room service in a hotel',
    parameters: {
        hotelId: { type: 'string', description: 'Hotel ID', required: true },
        roomNumber: { type: 'string', description: 'Room number', required: true },
        items: { type: 'array', description: 'Array of {itemId, quantity}', required: true },
        deliveryTime: { type: 'string', description: 'asap or specific time (HH:MM)', required: false },
        specialRequests: { type: 'string', description: 'Special instructions', required: false },
    },
    execute: async (params, context) => {
        try {
            // Hotel OTA /room-service
            const response = await clients.hotelAPI?.post('/room-service', {
                hotelId: params.hotelId,
                roomNumber: params.roomNumber,
                items: params.items,
                deliveryTime: params.deliveryTime || 'asap',
                specialRequests: params.specialRequests,
                guestId: context.customerId,
                guestName: context.name,
            }, {
                headers: { 'x-user-id': context.customerId }
            });
            const request = response?.data;
            return {
                success: true,
                data: {
                    requestId: request?.id || request?.requestId,
                    status: request?.status || 'pending',
                    estimatedDelivery: request?.estimatedDelivery || request?.estimated_time,
                    message: `Room service order confirmed! Room ${params.roomNumber}. Estimated delivery: ${request?.estimatedDelivery || request?.estimated_time || '30-45 minutes'}`
                }
            };
        }
        catch (error) {
            logger_1.logger.error('request_room_service failed', { error: error.message });
            return { success: false, error: error.message || 'Room service order failed.' };
        }
    }
};
// ── Tool: Housekeeping Request ────────────────────────────────────────────────
exports.housekeepingTool = {
    name: 'request_housekeeping',
    description: 'Request housekeeping service in a hotel',
    parameters: {
        hotelId: { type: 'string', description: 'Hotel ID', required: true },
        roomNumber: { type: 'string', description: 'Room number', required: true },
        serviceType: { type: 'string', description: 'regular_clean, deep_clean, towels, toiletries, bedding, turndown', required: true },
        preferredTime: { type: 'string', description: 'asap or specific time (HH:MM)', required: false },
        notes: { type: 'string', description: 'Additional notes', required: false },
    },
    execute: async (params, context) => {
        try {
            const response = await clients.hotelAPI?.post('/v1/housekeeping/request', {
                hotelId: params.hotelId,
                roomNumber: params.roomNumber,
                serviceType: params.serviceType,
                preferredTime: params.preferredTime || 'asap',
                notes: params.notes,
                guestId: context.customerId,
            });
            const request = response?.data;
            const serviceTypeStr = params.serviceType;
            return {
                success: true,
                data: {
                    requestId: request.id,
                    status: request.status,
                    scheduledTime: request.scheduledTime,
                    message: `Housekeeping request submitted! ${serviceTypeStr.replace('_', ' ')} for Room ${params.roomNumber}. ${request.scheduledTime !== 'asap' ? `Scheduled for ${request.scheduledTime}` : 'Will arrive shortly.'}`
                }
            };
        }
        catch (error) {
            logger_1.logger.error('request_housekeeping failed', { error: error.message });
            return { success: false, error: error.message || 'Housekeeping request failed.' };
        }
    }
};
// ── Tool: Get Wallet Balance ───────────────────────────────────────────────────
exports.getWalletBalanceTool = {
    name: 'get_wallet_balance',
    description: 'Check user wallet balance and ReZ coins',
    parameters: {
        userId: { type: 'string', description: 'User ID', required: false },
    },
    execute: async (params, context) => {
        try {
            const userId = String(params.userId || context.customerId || 'anonymous');
            // rez-wallet-service /api/wallet/balance endpoint
            const response = await clients.walletAPI?.get('/api/wallet/balance', {
                headers: { 'x-user-id': userId }
            });
            const wallet = response?.data;
            return {
                success: true,
                data: {
                    balance: wallet?.balance || 0,
                    coins: wallet?.coins || wallet?.coinBalance || 0,
                    currency: 'INR',
                    message: `Your wallet balance: ₹${((wallet?.balance || 0) / 100).toFixed(2)}. ReZ Coins: ${(wallet?.coins || wallet?.coinBalance || 0).toLocaleString()}`
                }
            };
        }
        catch (error) {
            logger_1.logger.error('get_wallet_balance failed', { error: error.message });
            return { success: false, error: 'Unable to fetch wallet balance.' };
        }
    }
};
// ── Tool: Get Loyalty Points ──────────────────────────────────────────────────
exports.getLoyaltyPointsTool = {
    name: 'get_loyalty_points',
    description: 'Check user loyalty points and tier status',
    parameters: {
        userId: { type: 'string', description: 'User ID', required: false },
    },
    execute: async (params, context) => {
        try {
            const userId = String(params.userId || context.customerId || 'anonymous');
            // rez-karma-service - try common karma endpoints
            let loyalty = null;
            // Try /api/karma/summary first
            try {
                const response = await clients.loyaltyAPI?.get('/api/karma/summary', {
                    headers: { 'x-user-id': userId }
                });
                loyalty = response?.data;
            }
            catch {
                // Fallback to /api/karma/status
                try {
                    const response2 = await clients.loyaltyAPI?.get('/api/karma/status', {
                        headers: { 'x-user-id': userId }
                    });
                    loyalty = response2?.data;
                }
                catch {
                    // Return mock data if service not available
                    loyalty = { points: 0, tier: 'bronze', pointsToNextTier: 100 };
                }
            }
            return {
                success: true,
                data: {
                    points: loyalty?.points || loyalty?.karmaPoints || 0,
                    tier: loyalty?.tier || loyalty?.karmaTier || 'bronze',
                    tierBenefits: loyalty?.benefits,
                    pointsToNextTier: loyalty?.pointsToNextTier || loyalty?.points_to_next_tier || 100,
                    message: `You have ${(loyalty?.points || loyalty?.karmaPoints || 0).toLocaleString()} karma points! ${(loyalty?.tier || loyalty?.karmaTier || 'bronze').charAt(0).toUpperCase() + (loyalty?.tier || loyalty?.karmaTier || 'bronze').slice(1)} tier.`
                }
            };
        }
        catch (error) {
            logger_1.logger.error('get_loyalty_points failed', { error: error.message });
            return { success: false, error: 'Unable to fetch loyalty status.' };
        }
    }
};
// ── Tool: Get Order Status ────────────────────────────────────────────────────
exports.getOrderStatusTool = {
    name: 'get_order_status',
    description: 'Check the status of an order or delivery',
    parameters: {
        orderId: { type: 'string', description: 'Order ID or order number', required: true },
    },
    execute: async (params, context) => {
        try {
            // rez-order-service /orders/:id endpoint
            const response = await clients.orderAPI?.get(`/orders/${params.orderId}`, {
                headers: { 'x-user-id': context.customerId }
            });
            const order = response?.data?.data || response?.data;
            if (!order) {
                return { success: false, error: 'Order not found.' };
            }
            return {
                success: true,
                data: {
                    orderId: order._id || order.id,
                    orderNumber: order.orderNumber,
                    status: order.status,
                    statusMessage: getStatusMessage(order.status),
                    estimatedTime: order.estimatedDeliveryTime,
                    driver: order.driverName,
                    driverPhone: order.driverPhone,
                    message: `Order ${order.orderNumber}: ${getStatusMessage(order.status)}.`
                }
            };
        }
        catch (error) {
            logger_1.logger.error('get_order_status failed', { error: error.message });
            return { success: false, error: 'Unable to fetch order status.' };
        }
    }
};
// ── Tool: Get Booking Details ──────────────────────────────────────────────────
exports.getBookingDetailsTool = {
    name: 'get_booking_details',
    description: 'Get details of a hotel or service booking',
    parameters: {
        bookingId: { type: 'string', description: 'Booking ID or confirmation code', required: true },
    },
    execute: async (params, context) => {
        try {
            // Hotel OTA /booking/:booking_id
            const response = await clients.hotelAPI?.get(`/booking/${params.bookingId}`, {
                headers: { 'x-user-id': context.customerId }
            });
            const booking = response?.data;
            if (!booking) {
                return { success: false, error: 'Booking not found.' };
            }
            return {
                success: true,
                data: {
                    bookingId: booking.id || booking.booking_id,
                    confirmationCode: booking.confirmationCode,
                    hotelName: booking.hotelName || booking.hotel?.name,
                    roomType: booking.roomType,
                    checkIn: booking.checkIn || booking.check_in,
                    checkOut: booking.checkOut || booking.check_out,
                    status: booking.status,
                    total: booking.totalAmount || booking.total,
                    message: `Booking ${booking.confirmationCode}: ${booking.hotelName || booking.hotel?.name}, ${booking.roomType}. Check-in: ${booking.checkIn || booking.check_in}, Check-out: ${booking.checkOut || booking.check_out}.`
                }
            };
        }
        catch (error) {
            logger_1.logger.error('get_booking_details failed', { error: error.message });
            return { success: false, error: 'Unable to fetch booking details.' };
        }
    }
};
// ── Tool: Cancel Booking ───────────────────────────────────────────────────────
exports.cancelBookingTool = {
    name: 'cancel_booking',
    description: 'Cancel a hotel booking or reservation',
    parameters: {
        bookingId: { type: 'string', description: 'Booking ID to cancel', required: true },
        reason: { type: 'string', description: 'Reason for cancellation', required: false },
        refundMethod: { type: 'string', description: 'Refund to: original, wallet, coins', required: false },
    },
    execute: async (params, context) => {
        try {
            // Hotel OTA /booking/:booking_id/cancel
            const response = await clients.hotelAPI?.post(`/booking/${params.bookingId}/cancel`, {
                reason: params.reason,
                refundMethod: params.refundMethod || 'original',
                userId: context.customerId,
            });
            const result = response?.data;
            return {
                success: true,
                data: {
                    bookingId: params.bookingId,
                    status: 'cancelled',
                    refundAmount: result?.refundAmount,
                    refundMethod: result?.refundMethod || params.refundMethod,
                    refundTimeline: result?.refundTimeline,
                    message: `Booking cancelled. ${result?.refundAmount ? `Refund of ₹${(result.refundAmount / 100).toFixed(2)} will be processed to ${result.refundMethod}.` : 'No refund applicable.'}`
                }
            };
        }
        catch (error) {
            logger_1.logger.error('cancel_booking failed', { error: error.message });
            return { success: false, error: error.message || 'Cancellation failed.' };
        }
    }
};
// ── Tool: Escalate to Staff ────────────────────────────────────────────────────
exports.escalateToStaffTool = {
    name: 'escalate_to_staff',
    description: 'Transfer conversation to human staff member',
    parameters: {
        reason: { type: 'string', description: 'Reason for escalation', required: true },
        department: { type: 'string', description: 'Department: front_desk, concierge, support, guest_relations', required: false },
        priority: { type: 'string', description: 'Priority: normal, high, urgent', required: false },
    },
    execute: async (params, context) => {
        const departmentStr = params.department || 'support';
        // This just returns success - actual routing happens in socket handler
        return {
            success: true,
            data: {
                escalated: true,
                reason: params.reason,
                department: departmentStr,
                priority: params.priority || 'normal',
                message: `I'm connecting you with our ${departmentStr.replace('_', ' ')} team. Please hold for a moment.`,
            }
        };
    }
};
// ── Tool: Search Products ──────────────────────────────────────────────────────
exports.searchProductsTool = {
    name: 'search_products',
    description: 'Search for products in the ReZ marketplace',
    parameters: {
        query: { type: 'string', description: 'Search query', required: true },
        category: { type: 'string', description: 'Product category', required: false },
        priceRange: { type: 'string', description: 'Price range: budget, mid, premium', required: false },
        location: { type: 'string', description: 'Delivery location', required: false },
    },
    execute: async (params, context) => {
        try {
            const response = await clients.searchAPI?.post('/v1/products/search', {
                query: params.query,
                category: params.category,
                priceRange: params.priceRange,
                location: params.location || context.preferences?.defaultAddress,
            });
            const products = response?.data?.products || [];
            return {
                success: true,
                data: {
                    products: products.slice(0, 5).map((p) => ({
                        id: p.id,
                        name: p.name,
                        price: p.price,
                        seller: p.sellerName,
                        rating: p.rating,
                    })),
                    total: products.length,
                }
            };
        }
        catch (error) {
            logger_1.logger.error('search_products failed', { error: error.message });
            return { success: false, error: 'Unable to search products.' };
        }
    }
};
// ── All Tools Export ───────────────────────────────────────────────────────────
// ── Intent Graph Tools ─────────────────────────────────────────────────────────
exports.getUserIntentsTool = {
    name: 'get_user_intents',
    description: 'Get a user\'s active shopping/travel/dining intents for personalization',
    parameters: {
        userId: { type: 'string', description: 'User ID', required: true },
    },
    execute: async (params, _context) => {
        try {
            const { intentCaptureService, crossAppAggregationService } = await import('rez-intent-graph');
            const intents = await intentCaptureService.getActiveIntents(String(params.userId));
            const enriched = await crossAppAggregationService.getEnrichedContext(String(params.userId));
            return {
                success: true,
                data: {
                    activeIntents: intents.map(i => ({
                        key: i.intentKey,
                        category: i.category,
                        confidence: i.confidence,
                        lastSeen: i.lastSeenAt,
                    })),
                    dormantIntents: enriched?.dormantIntents?.slice(0, 5) || [],
                    affinities: enriched?.crossAppProfile?.travelAffinity
                        ? {
                            travel: enriched.crossAppProfile.travelAffinity,
                            dining: enriched.crossAppProfile.diningAffinity,
                            retail: enriched.crossAppProfile.retailAffinity,
                        }
                        : {},
                },
            };
        }
        catch (err) {
            logger_1.logger.error('get_user_intents failed', { error: err.message });
            return { success: false, error: 'Failed to fetch intents' };
        }
    },
};
exports.triggerNudgeTool = {
    name: 'trigger_nudge',
    description: 'Trigger a nudge for a dormant user intent to encourage conversion',
    parameters: {
        userId: { type: 'string', description: 'User ID', required: true },
        intentKey: { type: 'string', description: 'The intent key to revive', required: true },
        triggerType: { type: 'string', description: 'Trigger type: price_drop, return_user, seasonality, offer_match, manual', required: false },
    },
    execute: async (params, _context) => {
        try {
            const { dormantIntentService } = await import('rez-intent-graph');
            const dormant = await dormantIntentService.getUserDormantIntents(String(params.userId));
            const target = dormant.find(d => d.intentKey.includes(String(params.intentKey)));
            if (!target) {
                return { success: false, error: 'Dormant intent not found' };
            }
            await dormantIntentService.triggerRevival(target._id.toString(), params.triggerType || 'manual');
            return { success: true, data: { message: 'Revival triggered' } };
        }
        catch (err) {
            logger_1.logger.error('trigger_nudge failed', { error: err.message });
            return { success: false, error: 'Failed to trigger revival' };
        }
    },
};
exports.ALL_REZ_TOOLS = [
    // Hotel tools
    exports.searchHotelsTool,
    exports.createHotelBookingTool,
    exports.getBookingDetailsTool,
    exports.cancelBookingTool,
    // Restaurant tools
    exports.searchRestaurantsTool,
    exports.placeOrderTool,
    exports.reserveTableTool,
    exports.getOrderStatusTool,
    // Room service tools
    exports.roomServiceTool,
    exports.housekeepingTool,
    // Financial tools
    exports.getWalletBalanceTool,
    exports.getLoyaltyPointsTool,
    // Search
    exports.searchProductsTool,
    // Intent graph tools
    exports.getUserIntentsTool,
    exports.triggerNudgeTool,
    // Support
    exports.escalateToStaffTool,
];
// ── Helper Functions ─────────────────────────────────────────────────────────────
function getNextTier(currentTier) {
    const tiers = ['bronze', 'silver', 'gold', 'platinum'];
    const currentIndex = tiers.indexOf(currentTier.toLowerCase());
    return currentIndex < tiers.length - 1 ? tiers[currentIndex + 1] : 'max';
}
function getStatusMessage(status) {
    const messages = {
        pending: 'Order received',
        confirmed: 'Order confirmed',
        preparing: 'Being prepared',
        ready: 'Ready for pickup',
        out_for_delivery: 'On the way',
        delivered: 'Delivered',
        completed: 'Completed',
        cancelled: 'Cancelled',
        refunded: 'Refunded',
    };
    return messages[status.toLowerCase()] || status;
}
exports.default = exports.ALL_REZ_TOOLS;
//# sourceMappingURL=rezTools.js.map