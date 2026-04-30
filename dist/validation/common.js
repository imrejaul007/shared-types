"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.positiveIntSchema = exports.slugSchema = exports.isoDateSchema = exports.urlSchema = exports.searchSchema = exports.dateRangeSchema = exports.cursorPaginationSchema = exports.paginationSchema = exports.uuidSchema = exports.objectIdSchema = void 0;
const zod_1 = require("zod");
exports.objectIdSchema = zod_1.z.string().regex(/^[a-f\d]{24}$/i, 'Invalid ID format');
exports.uuidSchema = zod_1.z.string().uuid('Invalid UUID format');
exports.paginationSchema = zod_1.z.object({
    page: zod_1.z.coerce.number().int().min(1).default(1),
    limit: zod_1.z.coerce.number().int().min(1).max(100).default(20),
    sort: zod_1.z.string().optional(),
    order: zod_1.z.enum(['asc', 'desc']).optional().default('desc'),
});
exports.cursorPaginationSchema = zod_1.z.object({
    cursor: zod_1.z.string().optional(),
    limit: zod_1.z.coerce.number().int().min(1).max(100).default(20),
});
exports.dateRangeSchema = zod_1.z.object({
    startDate: zod_1.z.string().datetime().or(zod_1.z.date()).optional(),
    endDate: zod_1.z.string().datetime().or(zod_1.z.date()).optional(),
}).refine(data => {
    if (data.startDate && data.endDate) {
        return new Date(data.startDate) <= new Date(data.endDate);
    }
    return true;
}, { message: 'Start date must be before or equal to end date' });
exports.searchSchema = zod_1.z.object({
    q: zod_1.z.string().min(1).max(200).optional(),
    query: zod_1.z.string().min(1).max(200).optional(),
}).transform(data => data.q || data.query || '');
exports.urlSchema = zod_1.z.string().url('Invalid URL').refine(url => {
    if (process.env.NODE_ENV === 'production') {
        return url.startsWith('https://');
    }
    return true;
}, { message: 'URL must use HTTPS in production' });
exports.isoDateSchema = zod_1.z.string().datetime('Invalid ISO date format');
exports.slugSchema = zod_1.z.string()
    .min(1)
    .max(100)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Invalid slug format');
exports.positiveIntSchema = zod_1.z.number().int().positive('Must be a positive integer');
//# sourceMappingURL=common.js.map