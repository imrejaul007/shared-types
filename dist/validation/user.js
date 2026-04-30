"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.passwordChangeSchema = exports.userUpdateSchema = exports.userLoginSchema = exports.userRegistrationSchema = exports.userIdSchema = exports.emailSchema = exports.nameSchema = exports.phoneSchema = void 0;
const zod_1 = require("zod");
exports.phoneSchema = zod_1.z.string().regex(/^\+?[1-9]\d{6,14}$/, 'Phone number must be in E.164 format (e.g., +919876543210)');
exports.nameSchema = zod_1.z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be at most 100 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'Name can only contain letters, spaces, hyphens, and apostrophes');
exports.emailSchema = zod_1.z.string().email('Invalid email address');
exports.userIdSchema = zod_1.z.string().regex(/^[a-f\d]{24}$/i, 'Invalid user ID format');
exports.userRegistrationSchema = zod_1.z.object({
    phone: exports.phoneSchema,
    name: exports.nameSchema,
    email: exports.emailSchema.optional(),
    password: zod_1.z.string()
        .min(8, 'Password must be at least 8 characters')
        .max(128, 'Password must be at most 128 characters')
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one lowercase, one uppercase, and one number').optional(),
});
exports.userLoginSchema = zod_1.z.object({
    phone: exports.phoneSchema,
    otp: zod_1.z.string().length(6, 'OTP must be 6 digits').optional(),
    password: zod_1.z.string().optional(),
}).refine(data => data.otp || data.password, { message: 'Either OTP or password is required' });
exports.userUpdateSchema = zod_1.z.object({
    name: exports.nameSchema.optional(),
    email: exports.emailSchema.optional(),
    profileImage: zod_1.z.string().url('Invalid URL').optional(),
});
exports.passwordChangeSchema = zod_1.z.object({
    currentPassword: zod_1.z.string().min(1, 'Current password is required'),
    newPassword: zod_1.z.string()
        .min(8, 'Password must be at least 8 characters')
        .max(128, 'Password must be at most 128 characters')
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one lowercase, one uppercase, and one number'),
});
//# sourceMappingURL=user.js.map