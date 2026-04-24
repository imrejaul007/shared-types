"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserListResponseSchema = exports.UserResponseSchema = exports.UpdateProfileSchema = exports.CreateUserSchema = exports.UserAuthSchema = exports.UserPreferencesSchema = exports.UserProfileSchema = exports.UserNotificationPreferencesSchema = exports.UserVerificationDocumentSchema = exports.UserJewelryPreferencesSchema = exports.UserLocationHistorySchema = exports.UserLocationSchema = exports.THEME = exports.ACCOUNT_VERIFICATION_STATUS = exports.GENDER = exports.USER_ROLE = void 0;
const zod_1 = require("zod");
exports.USER_ROLE = zod_1.z.enum([
    'user',
    'consumer',
    'merchant',
    'admin',
    'support',
    'operator',
    'super_admin',
]);
exports.GENDER = zod_1.z.enum([
    'male',
    'female',
    'other',
    'prefer_not_to_say',
]);
exports.ACCOUNT_VERIFICATION_STATUS = zod_1.z.enum([
    'unverified',
    'pending',
    'verified',
    'rejected',
    'expired',
]);
exports.THEME = zod_1.z.enum([
    'light',
    'dark',
    'auto',
]);
exports.UserLocationSchema = zod_1.z.object({
    address: zod_1.z.string().optional(),
    city: zod_1.z.string().optional(),
    state: zod_1.z.string().optional(),
    pincode: zod_1.z.string().optional(),
    coordinates: zod_1.z.tuple([zod_1.z.number(), zod_1.z.number()]).optional(),
});
exports.UserLocationHistorySchema = zod_1.z.object({
    coordinates: zod_1.z.tuple([zod_1.z.number(), zod_1.z.number()]),
    address: zod_1.z.string(),
    city: zod_1.z.string().optional(),
    timestamp: zod_1.z.date(),
    source: zod_1.z.string(),
});
exports.UserJewelryPreferencesSchema = zod_1.z.object({
    preferredMetals: zod_1.z.array(zod_1.z.string()).optional(),
    preferredStones: zod_1.z.array(zod_1.z.string()).optional(),
    style: zod_1.z.string().optional(),
});
exports.UserVerificationDocumentSchema = zod_1.z.object({
    documentType: zod_1.z.string().min(1, 'Document type is required'),
    documentNumber: zod_1.z.string().min(1, 'Document number is required'),
    documentImage: zod_1.z.string().url('Invalid document image URL'),
    submittedAt: zod_1.z.date(),
});
exports.UserNotificationPreferencesSchema = zod_1.z.object({
    push: zod_1.z.boolean().optional(),
    email: zod_1.z.boolean().optional(),
    sms: zod_1.z.boolean().optional(),
});
exports.UserProfileSchema = zod_1.z.object({
    firstName: zod_1.z.string().optional(),
    lastName: zod_1.z.string().optional(),
    avatar: zod_1.z.string().url('Invalid avatar URL').optional(),
    bio: zod_1.z.string().optional(),
    website: zod_1.z.string().url('Invalid website URL').optional(),
    dateOfBirth: zod_1.z.date().optional(),
    gender: exports.GENDER.optional(),
    location: exports.UserLocationSchema.optional(),
    locationHistory: zod_1.z.array(exports.UserLocationHistorySchema).optional(),
    timezone: zod_1.z.string().optional(),
    ringSize: zod_1.z.string().optional(),
    jewelryPreferences: exports.UserJewelryPreferencesSchema.optional(),
    verificationStatus: exports.ACCOUNT_VERIFICATION_STATUS.optional(),
    verificationDocuments: exports.UserVerificationDocumentSchema.optional(),
});
exports.UserPreferencesSchema = zod_1.z.object({
    language: zod_1.z.string().optional(),
    notifications: exports.UserNotificationPreferencesSchema.optional(),
    categories: zod_1.z.array(zod_1.z.string()).optional(),
    theme: exports.THEME.optional(),
    emailNotifications: zod_1.z.boolean().optional(),
    pushNotifications: zod_1.z.boolean().optional(),
    smsNotifications: zod_1.z.boolean().optional(),
});
exports.UserAuthSchema = zod_1.z.object({
    isVerified: zod_1.z.boolean(),
    isOnboarded: zod_1.z.boolean(),
    lastLogin: zod_1.z.date().optional(),
    loginAttempts: zod_1.z.number().int().min(0),
    totpEnabled: zod_1.z.boolean().optional(),
});
exports.CreateUserSchema = zod_1.z.object({
    email: zod_1.z.string().email('Invalid email address'),
    phone: zod_1.z.string().min(10, 'Invalid phone number'),
    password: zod_1.z.string().min(8, 'Password must be at least 8 characters'),
    role: exports.USER_ROLE.optional().default('user'),
    profile: exports.UserProfileSchema.optional(),
    preferences: exports.UserPreferencesSchema.optional(),
});
exports.UpdateProfileSchema = zod_1.z.object({
    firstName: zod_1.z.string().optional(),
    lastName: zod_1.z.string().optional(),
    avatar: zod_1.z.string().url('Invalid avatar URL').optional(),
    bio: zod_1.z.string().optional(),
    website: zod_1.z.string().url('Invalid website URL').optional(),
    dateOfBirth: zod_1.z.date().optional(),
    gender: exports.GENDER.optional(),
    location: exports.UserLocationSchema.optional(),
    timezone: zod_1.z.string().optional(),
    ringSize: zod_1.z.string().optional(),
    jewelryPreferences: exports.UserJewelryPreferencesSchema.optional(),
    preferences: exports.UserPreferencesSchema.optional(),
});
exports.UserResponseSchema = zod_1.z.object({
    _id: zod_1.z.string().optional(),
    email: zod_1.z.string().email(),
    phone: zod_1.z.string(),
    role: exports.USER_ROLE,
    profile: exports.UserProfileSchema.optional(),
    preferences: exports.UserPreferencesSchema.optional(),
    auth: exports.UserAuthSchema.optional(),
    createdAt: zod_1.z.date().optional(),
    updatedAt: zod_1.z.date().optional(),
});
exports.UserListResponseSchema = zod_1.z.array(exports.UserResponseSchema);
//# sourceMappingURL=user.schema.js.map