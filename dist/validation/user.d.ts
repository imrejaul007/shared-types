import { z } from 'zod';
export declare const phoneSchema: z.ZodString;
export declare const nameSchema: z.ZodString;
export declare const emailSchema: z.ZodString;
export declare const userIdSchema: z.ZodString;
export declare const userRegistrationSchema: z.ZodObject<{
    phone: z.ZodString;
    name: z.ZodString;
    email: z.ZodOptional<z.ZodString>;
    password: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    name: string;
    phone: string;
    email?: string | undefined;
    password?: string | undefined;
}, {
    name: string;
    phone: string;
    email?: string | undefined;
    password?: string | undefined;
}>;
export declare const userLoginSchema: z.ZodEffects<z.ZodObject<{
    phone: z.ZodString;
    otp: z.ZodOptional<z.ZodString>;
    password: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    phone: string;
    password?: string | undefined;
    otp?: string | undefined;
}, {
    phone: string;
    password?: string | undefined;
    otp?: string | undefined;
}>, {
    phone: string;
    password?: string | undefined;
    otp?: string | undefined;
}, {
    phone: string;
    password?: string | undefined;
    otp?: string | undefined;
}>;
export declare const userUpdateSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    email: z.ZodOptional<z.ZodString>;
    profileImage: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    email?: string | undefined;
    name?: string | undefined;
    profileImage?: string | undefined;
}, {
    email?: string | undefined;
    name?: string | undefined;
    profileImage?: string | undefined;
}>;
export declare const passwordChangeSchema: z.ZodObject<{
    currentPassword: z.ZodString;
    newPassword: z.ZodString;
}, "strip", z.ZodTypeAny, {
    currentPassword: string;
    newPassword: string;
}, {
    currentPassword: string;
    newPassword: string;
}>;
export type UserRegistration = z.infer<typeof userRegistrationSchema>;
export type UserLogin = z.infer<typeof userLoginSchema>;
export type UserUpdate = z.infer<typeof userUpdateSchema>;
export type PasswordChange = z.infer<typeof passwordChangeSchema>;
//# sourceMappingURL=user.d.ts.map