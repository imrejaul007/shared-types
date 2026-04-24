import { z } from 'zod';
export declare const USER_ROLE: z.ZodEnum<["user", "consumer", "merchant", "admin", "support", "operator", "super_admin"]>;
export declare const GENDER: z.ZodEnum<["male", "female", "other", "prefer_not_to_say"]>;
export declare const ACCOUNT_VERIFICATION_STATUS: z.ZodEnum<["unverified", "pending", "verified", "rejected", "expired"]>;
export declare const THEME: z.ZodEnum<["light", "dark", "auto"]>;
export declare const UserLocationSchema: z.ZodObject<{
    address: z.ZodOptional<z.ZodString>;
    city: z.ZodOptional<z.ZodString>;
    state: z.ZodOptional<z.ZodString>;
    pincode: z.ZodOptional<z.ZodString>;
    coordinates: z.ZodOptional<z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>>;
}, "strip", z.ZodTypeAny, {
    city?: string | undefined;
    state?: string | undefined;
    pincode?: string | undefined;
    coordinates?: [number, number] | undefined;
    address?: string | undefined;
}, {
    city?: string | undefined;
    state?: string | undefined;
    pincode?: string | undefined;
    coordinates?: [number, number] | undefined;
    address?: string | undefined;
}>;
export declare const UserLocationHistorySchema: z.ZodObject<{
    coordinates: z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>;
    address: z.ZodString;
    city: z.ZodOptional<z.ZodString>;
    timestamp: z.ZodDate;
    source: z.ZodString;
}, "strip", z.ZodTypeAny, {
    coordinates: [number, number];
    address: string;
    timestamp: Date;
    source: string;
    city?: string | undefined;
}, {
    coordinates: [number, number];
    address: string;
    timestamp: Date;
    source: string;
    city?: string | undefined;
}>;
export declare const UserJewelryPreferencesSchema: z.ZodObject<{
    preferredMetals: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    preferredStones: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    style: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    preferredMetals?: string[] | undefined;
    preferredStones?: string[] | undefined;
    style?: string | undefined;
}, {
    preferredMetals?: string[] | undefined;
    preferredStones?: string[] | undefined;
    style?: string | undefined;
}>;
export declare const UserVerificationDocumentSchema: z.ZodObject<{
    documentType: z.ZodString;
    documentNumber: z.ZodString;
    documentImage: z.ZodString;
    submittedAt: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    documentType: string;
    documentNumber: string;
    documentImage: string;
    submittedAt: Date;
}, {
    documentType: string;
    documentNumber: string;
    documentImage: string;
    submittedAt: Date;
}>;
export declare const UserNotificationPreferencesSchema: z.ZodObject<{
    push: z.ZodOptional<z.ZodBoolean>;
    email: z.ZodOptional<z.ZodBoolean>;
    sms: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    email?: boolean | undefined;
    sms?: boolean | undefined;
    push?: boolean | undefined;
}, {
    email?: boolean | undefined;
    sms?: boolean | undefined;
    push?: boolean | undefined;
}>;
export declare const UserProfileSchema: z.ZodObject<{
    firstName: z.ZodOptional<z.ZodString>;
    lastName: z.ZodOptional<z.ZodString>;
    avatar: z.ZodOptional<z.ZodString>;
    bio: z.ZodOptional<z.ZodString>;
    website: z.ZodOptional<z.ZodString>;
    dateOfBirth: z.ZodOptional<z.ZodDate>;
    gender: z.ZodOptional<z.ZodEnum<["male", "female", "other", "prefer_not_to_say"]>>;
    location: z.ZodOptional<z.ZodObject<{
        address: z.ZodOptional<z.ZodString>;
        city: z.ZodOptional<z.ZodString>;
        state: z.ZodOptional<z.ZodString>;
        pincode: z.ZodOptional<z.ZodString>;
        coordinates: z.ZodOptional<z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>>;
    }, "strip", z.ZodTypeAny, {
        city?: string | undefined;
        state?: string | undefined;
        pincode?: string | undefined;
        coordinates?: [number, number] | undefined;
        address?: string | undefined;
    }, {
        city?: string | undefined;
        state?: string | undefined;
        pincode?: string | undefined;
        coordinates?: [number, number] | undefined;
        address?: string | undefined;
    }>>;
    locationHistory: z.ZodOptional<z.ZodArray<z.ZodObject<{
        coordinates: z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>;
        address: z.ZodString;
        city: z.ZodOptional<z.ZodString>;
        timestamp: z.ZodDate;
        source: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        coordinates: [number, number];
        address: string;
        timestamp: Date;
        source: string;
        city?: string | undefined;
    }, {
        coordinates: [number, number];
        address: string;
        timestamp: Date;
        source: string;
        city?: string | undefined;
    }>, "many">>;
    timezone: z.ZodOptional<z.ZodString>;
    ringSize: z.ZodOptional<z.ZodString>;
    jewelryPreferences: z.ZodOptional<z.ZodObject<{
        preferredMetals: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        preferredStones: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        style: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        preferredMetals?: string[] | undefined;
        preferredStones?: string[] | undefined;
        style?: string | undefined;
    }, {
        preferredMetals?: string[] | undefined;
        preferredStones?: string[] | undefined;
        style?: string | undefined;
    }>>;
    verificationStatus: z.ZodOptional<z.ZodEnum<["unverified", "pending", "verified", "rejected", "expired"]>>;
    verificationDocuments: z.ZodOptional<z.ZodObject<{
        documentType: z.ZodString;
        documentNumber: z.ZodString;
        documentImage: z.ZodString;
        submittedAt: z.ZodDate;
    }, "strip", z.ZodTypeAny, {
        documentType: string;
        documentNumber: string;
        documentImage: string;
        submittedAt: Date;
    }, {
        documentType: string;
        documentNumber: string;
        documentImage: string;
        submittedAt: Date;
    }>>;
}, "strip", z.ZodTypeAny, {
    location?: {
        city?: string | undefined;
        state?: string | undefined;
        pincode?: string | undefined;
        coordinates?: [number, number] | undefined;
        address?: string | undefined;
    } | undefined;
    firstName?: string | undefined;
    lastName?: string | undefined;
    avatar?: string | undefined;
    bio?: string | undefined;
    website?: string | undefined;
    dateOfBirth?: Date | undefined;
    gender?: "male" | "female" | "other" | "prefer_not_to_say" | undefined;
    locationHistory?: {
        coordinates: [number, number];
        address: string;
        timestamp: Date;
        source: string;
        city?: string | undefined;
    }[] | undefined;
    timezone?: string | undefined;
    ringSize?: string | undefined;
    jewelryPreferences?: {
        preferredMetals?: string[] | undefined;
        preferredStones?: string[] | undefined;
        style?: string | undefined;
    } | undefined;
    verificationStatus?: "pending" | "expired" | "rejected" | "unverified" | "verified" | undefined;
    verificationDocuments?: {
        documentType: string;
        documentNumber: string;
        documentImage: string;
        submittedAt: Date;
    } | undefined;
}, {
    location?: {
        city?: string | undefined;
        state?: string | undefined;
        pincode?: string | undefined;
        coordinates?: [number, number] | undefined;
        address?: string | undefined;
    } | undefined;
    firstName?: string | undefined;
    lastName?: string | undefined;
    avatar?: string | undefined;
    bio?: string | undefined;
    website?: string | undefined;
    dateOfBirth?: Date | undefined;
    gender?: "male" | "female" | "other" | "prefer_not_to_say" | undefined;
    locationHistory?: {
        coordinates: [number, number];
        address: string;
        timestamp: Date;
        source: string;
        city?: string | undefined;
    }[] | undefined;
    timezone?: string | undefined;
    ringSize?: string | undefined;
    jewelryPreferences?: {
        preferredMetals?: string[] | undefined;
        preferredStones?: string[] | undefined;
        style?: string | undefined;
    } | undefined;
    verificationStatus?: "pending" | "expired" | "rejected" | "unverified" | "verified" | undefined;
    verificationDocuments?: {
        documentType: string;
        documentNumber: string;
        documentImage: string;
        submittedAt: Date;
    } | undefined;
}>;
export declare const UserPreferencesSchema: z.ZodObject<{
    language: z.ZodOptional<z.ZodString>;
    notifications: z.ZodOptional<z.ZodObject<{
        push: z.ZodOptional<z.ZodBoolean>;
        email: z.ZodOptional<z.ZodBoolean>;
        sms: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        email?: boolean | undefined;
        sms?: boolean | undefined;
        push?: boolean | undefined;
    }, {
        email?: boolean | undefined;
        sms?: boolean | undefined;
        push?: boolean | undefined;
    }>>;
    categories: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    theme: z.ZodOptional<z.ZodEnum<["light", "dark", "auto"]>>;
    emailNotifications: z.ZodOptional<z.ZodBoolean>;
    pushNotifications: z.ZodOptional<z.ZodBoolean>;
    smsNotifications: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    language?: string | undefined;
    notifications?: {
        email?: boolean | undefined;
        sms?: boolean | undefined;
        push?: boolean | undefined;
    } | undefined;
    categories?: string[] | undefined;
    theme?: "light" | "dark" | "auto" | undefined;
    emailNotifications?: boolean | undefined;
    pushNotifications?: boolean | undefined;
    smsNotifications?: boolean | undefined;
}, {
    language?: string | undefined;
    notifications?: {
        email?: boolean | undefined;
        sms?: boolean | undefined;
        push?: boolean | undefined;
    } | undefined;
    categories?: string[] | undefined;
    theme?: "light" | "dark" | "auto" | undefined;
    emailNotifications?: boolean | undefined;
    pushNotifications?: boolean | undefined;
    smsNotifications?: boolean | undefined;
}>;
export declare const UserAuthSchema: z.ZodObject<{
    isVerified: z.ZodBoolean;
    isOnboarded: z.ZodBoolean;
    lastLogin: z.ZodOptional<z.ZodDate>;
    loginAttempts: z.ZodNumber;
    totpEnabled: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    isVerified: boolean;
    isOnboarded: boolean;
    loginAttempts: number;
    lastLogin?: Date | undefined;
    totpEnabled?: boolean | undefined;
}, {
    isVerified: boolean;
    isOnboarded: boolean;
    loginAttempts: number;
    lastLogin?: Date | undefined;
    totpEnabled?: boolean | undefined;
}>;
export declare const CreateUserSchema: z.ZodObject<{
    email: z.ZodString;
    phone: z.ZodString;
    password: z.ZodString;
    role: z.ZodDefault<z.ZodOptional<z.ZodEnum<["user", "consumer", "merchant", "admin", "support", "operator", "super_admin"]>>>;
    profile: z.ZodOptional<z.ZodObject<{
        firstName: z.ZodOptional<z.ZodString>;
        lastName: z.ZodOptional<z.ZodString>;
        avatar: z.ZodOptional<z.ZodString>;
        bio: z.ZodOptional<z.ZodString>;
        website: z.ZodOptional<z.ZodString>;
        dateOfBirth: z.ZodOptional<z.ZodDate>;
        gender: z.ZodOptional<z.ZodEnum<["male", "female", "other", "prefer_not_to_say"]>>;
        location: z.ZodOptional<z.ZodObject<{
            address: z.ZodOptional<z.ZodString>;
            city: z.ZodOptional<z.ZodString>;
            state: z.ZodOptional<z.ZodString>;
            pincode: z.ZodOptional<z.ZodString>;
            coordinates: z.ZodOptional<z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>>;
        }, "strip", z.ZodTypeAny, {
            city?: string | undefined;
            state?: string | undefined;
            pincode?: string | undefined;
            coordinates?: [number, number] | undefined;
            address?: string | undefined;
        }, {
            city?: string | undefined;
            state?: string | undefined;
            pincode?: string | undefined;
            coordinates?: [number, number] | undefined;
            address?: string | undefined;
        }>>;
        locationHistory: z.ZodOptional<z.ZodArray<z.ZodObject<{
            coordinates: z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>;
            address: z.ZodString;
            city: z.ZodOptional<z.ZodString>;
            timestamp: z.ZodDate;
            source: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            coordinates: [number, number];
            address: string;
            timestamp: Date;
            source: string;
            city?: string | undefined;
        }, {
            coordinates: [number, number];
            address: string;
            timestamp: Date;
            source: string;
            city?: string | undefined;
        }>, "many">>;
        timezone: z.ZodOptional<z.ZodString>;
        ringSize: z.ZodOptional<z.ZodString>;
        jewelryPreferences: z.ZodOptional<z.ZodObject<{
            preferredMetals: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            preferredStones: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            style: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            preferredMetals?: string[] | undefined;
            preferredStones?: string[] | undefined;
            style?: string | undefined;
        }, {
            preferredMetals?: string[] | undefined;
            preferredStones?: string[] | undefined;
            style?: string | undefined;
        }>>;
        verificationStatus: z.ZodOptional<z.ZodEnum<["unverified", "pending", "verified", "rejected", "expired"]>>;
        verificationDocuments: z.ZodOptional<z.ZodObject<{
            documentType: z.ZodString;
            documentNumber: z.ZodString;
            documentImage: z.ZodString;
            submittedAt: z.ZodDate;
        }, "strip", z.ZodTypeAny, {
            documentType: string;
            documentNumber: string;
            documentImage: string;
            submittedAt: Date;
        }, {
            documentType: string;
            documentNumber: string;
            documentImage: string;
            submittedAt: Date;
        }>>;
    }, "strip", z.ZodTypeAny, {
        location?: {
            city?: string | undefined;
            state?: string | undefined;
            pincode?: string | undefined;
            coordinates?: [number, number] | undefined;
            address?: string | undefined;
        } | undefined;
        firstName?: string | undefined;
        lastName?: string | undefined;
        avatar?: string | undefined;
        bio?: string | undefined;
        website?: string | undefined;
        dateOfBirth?: Date | undefined;
        gender?: "male" | "female" | "other" | "prefer_not_to_say" | undefined;
        locationHistory?: {
            coordinates: [number, number];
            address: string;
            timestamp: Date;
            source: string;
            city?: string | undefined;
        }[] | undefined;
        timezone?: string | undefined;
        ringSize?: string | undefined;
        jewelryPreferences?: {
            preferredMetals?: string[] | undefined;
            preferredStones?: string[] | undefined;
            style?: string | undefined;
        } | undefined;
        verificationStatus?: "pending" | "expired" | "rejected" | "unverified" | "verified" | undefined;
        verificationDocuments?: {
            documentType: string;
            documentNumber: string;
            documentImage: string;
            submittedAt: Date;
        } | undefined;
    }, {
        location?: {
            city?: string | undefined;
            state?: string | undefined;
            pincode?: string | undefined;
            coordinates?: [number, number] | undefined;
            address?: string | undefined;
        } | undefined;
        firstName?: string | undefined;
        lastName?: string | undefined;
        avatar?: string | undefined;
        bio?: string | undefined;
        website?: string | undefined;
        dateOfBirth?: Date | undefined;
        gender?: "male" | "female" | "other" | "prefer_not_to_say" | undefined;
        locationHistory?: {
            coordinates: [number, number];
            address: string;
            timestamp: Date;
            source: string;
            city?: string | undefined;
        }[] | undefined;
        timezone?: string | undefined;
        ringSize?: string | undefined;
        jewelryPreferences?: {
            preferredMetals?: string[] | undefined;
            preferredStones?: string[] | undefined;
            style?: string | undefined;
        } | undefined;
        verificationStatus?: "pending" | "expired" | "rejected" | "unverified" | "verified" | undefined;
        verificationDocuments?: {
            documentType: string;
            documentNumber: string;
            documentImage: string;
            submittedAt: Date;
        } | undefined;
    }>>;
    preferences: z.ZodOptional<z.ZodObject<{
        language: z.ZodOptional<z.ZodString>;
        notifications: z.ZodOptional<z.ZodObject<{
            push: z.ZodOptional<z.ZodBoolean>;
            email: z.ZodOptional<z.ZodBoolean>;
            sms: z.ZodOptional<z.ZodBoolean>;
        }, "strip", z.ZodTypeAny, {
            email?: boolean | undefined;
            sms?: boolean | undefined;
            push?: boolean | undefined;
        }, {
            email?: boolean | undefined;
            sms?: boolean | undefined;
            push?: boolean | undefined;
        }>>;
        categories: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        theme: z.ZodOptional<z.ZodEnum<["light", "dark", "auto"]>>;
        emailNotifications: z.ZodOptional<z.ZodBoolean>;
        pushNotifications: z.ZodOptional<z.ZodBoolean>;
        smsNotifications: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        language?: string | undefined;
        notifications?: {
            email?: boolean | undefined;
            sms?: boolean | undefined;
            push?: boolean | undefined;
        } | undefined;
        categories?: string[] | undefined;
        theme?: "light" | "dark" | "auto" | undefined;
        emailNotifications?: boolean | undefined;
        pushNotifications?: boolean | undefined;
        smsNotifications?: boolean | undefined;
    }, {
        language?: string | undefined;
        notifications?: {
            email?: boolean | undefined;
            sms?: boolean | undefined;
            push?: boolean | undefined;
        } | undefined;
        categories?: string[] | undefined;
        theme?: "light" | "dark" | "auto" | undefined;
        emailNotifications?: boolean | undefined;
        pushNotifications?: boolean | undefined;
        smsNotifications?: boolean | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    email: string;
    role: "user" | "consumer" | "merchant" | "admin" | "support" | "operator" | "super_admin";
    phone: string;
    password: string;
    profile?: {
        location?: {
            city?: string | undefined;
            state?: string | undefined;
            pincode?: string | undefined;
            coordinates?: [number, number] | undefined;
            address?: string | undefined;
        } | undefined;
        firstName?: string | undefined;
        lastName?: string | undefined;
        avatar?: string | undefined;
        bio?: string | undefined;
        website?: string | undefined;
        dateOfBirth?: Date | undefined;
        gender?: "male" | "female" | "other" | "prefer_not_to_say" | undefined;
        locationHistory?: {
            coordinates: [number, number];
            address: string;
            timestamp: Date;
            source: string;
            city?: string | undefined;
        }[] | undefined;
        timezone?: string | undefined;
        ringSize?: string | undefined;
        jewelryPreferences?: {
            preferredMetals?: string[] | undefined;
            preferredStones?: string[] | undefined;
            style?: string | undefined;
        } | undefined;
        verificationStatus?: "pending" | "expired" | "rejected" | "unverified" | "verified" | undefined;
        verificationDocuments?: {
            documentType: string;
            documentNumber: string;
            documentImage: string;
            submittedAt: Date;
        } | undefined;
    } | undefined;
    preferences?: {
        language?: string | undefined;
        notifications?: {
            email?: boolean | undefined;
            sms?: boolean | undefined;
            push?: boolean | undefined;
        } | undefined;
        categories?: string[] | undefined;
        theme?: "light" | "dark" | "auto" | undefined;
        emailNotifications?: boolean | undefined;
        pushNotifications?: boolean | undefined;
        smsNotifications?: boolean | undefined;
    } | undefined;
}, {
    email: string;
    phone: string;
    password: string;
    profile?: {
        location?: {
            city?: string | undefined;
            state?: string | undefined;
            pincode?: string | undefined;
            coordinates?: [number, number] | undefined;
            address?: string | undefined;
        } | undefined;
        firstName?: string | undefined;
        lastName?: string | undefined;
        avatar?: string | undefined;
        bio?: string | undefined;
        website?: string | undefined;
        dateOfBirth?: Date | undefined;
        gender?: "male" | "female" | "other" | "prefer_not_to_say" | undefined;
        locationHistory?: {
            coordinates: [number, number];
            address: string;
            timestamp: Date;
            source: string;
            city?: string | undefined;
        }[] | undefined;
        timezone?: string | undefined;
        ringSize?: string | undefined;
        jewelryPreferences?: {
            preferredMetals?: string[] | undefined;
            preferredStones?: string[] | undefined;
            style?: string | undefined;
        } | undefined;
        verificationStatus?: "pending" | "expired" | "rejected" | "unverified" | "verified" | undefined;
        verificationDocuments?: {
            documentType: string;
            documentNumber: string;
            documentImage: string;
            submittedAt: Date;
        } | undefined;
    } | undefined;
    role?: "user" | "consumer" | "merchant" | "admin" | "support" | "operator" | "super_admin" | undefined;
    preferences?: {
        language?: string | undefined;
        notifications?: {
            email?: boolean | undefined;
            sms?: boolean | undefined;
            push?: boolean | undefined;
        } | undefined;
        categories?: string[] | undefined;
        theme?: "light" | "dark" | "auto" | undefined;
        emailNotifications?: boolean | undefined;
        pushNotifications?: boolean | undefined;
        smsNotifications?: boolean | undefined;
    } | undefined;
}>;
export declare const UpdateProfileSchema: z.ZodObject<{
    firstName: z.ZodOptional<z.ZodString>;
    lastName: z.ZodOptional<z.ZodString>;
    avatar: z.ZodOptional<z.ZodString>;
    bio: z.ZodOptional<z.ZodString>;
    website: z.ZodOptional<z.ZodString>;
    dateOfBirth: z.ZodOptional<z.ZodDate>;
    gender: z.ZodOptional<z.ZodEnum<["male", "female", "other", "prefer_not_to_say"]>>;
    location: z.ZodOptional<z.ZodObject<{
        address: z.ZodOptional<z.ZodString>;
        city: z.ZodOptional<z.ZodString>;
        state: z.ZodOptional<z.ZodString>;
        pincode: z.ZodOptional<z.ZodString>;
        coordinates: z.ZodOptional<z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>>;
    }, "strip", z.ZodTypeAny, {
        city?: string | undefined;
        state?: string | undefined;
        pincode?: string | undefined;
        coordinates?: [number, number] | undefined;
        address?: string | undefined;
    }, {
        city?: string | undefined;
        state?: string | undefined;
        pincode?: string | undefined;
        coordinates?: [number, number] | undefined;
        address?: string | undefined;
    }>>;
    timezone: z.ZodOptional<z.ZodString>;
    ringSize: z.ZodOptional<z.ZodString>;
    jewelryPreferences: z.ZodOptional<z.ZodObject<{
        preferredMetals: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        preferredStones: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        style: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        preferredMetals?: string[] | undefined;
        preferredStones?: string[] | undefined;
        style?: string | undefined;
    }, {
        preferredMetals?: string[] | undefined;
        preferredStones?: string[] | undefined;
        style?: string | undefined;
    }>>;
    preferences: z.ZodOptional<z.ZodObject<{
        language: z.ZodOptional<z.ZodString>;
        notifications: z.ZodOptional<z.ZodObject<{
            push: z.ZodOptional<z.ZodBoolean>;
            email: z.ZodOptional<z.ZodBoolean>;
            sms: z.ZodOptional<z.ZodBoolean>;
        }, "strip", z.ZodTypeAny, {
            email?: boolean | undefined;
            sms?: boolean | undefined;
            push?: boolean | undefined;
        }, {
            email?: boolean | undefined;
            sms?: boolean | undefined;
            push?: boolean | undefined;
        }>>;
        categories: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        theme: z.ZodOptional<z.ZodEnum<["light", "dark", "auto"]>>;
        emailNotifications: z.ZodOptional<z.ZodBoolean>;
        pushNotifications: z.ZodOptional<z.ZodBoolean>;
        smsNotifications: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        language?: string | undefined;
        notifications?: {
            email?: boolean | undefined;
            sms?: boolean | undefined;
            push?: boolean | undefined;
        } | undefined;
        categories?: string[] | undefined;
        theme?: "light" | "dark" | "auto" | undefined;
        emailNotifications?: boolean | undefined;
        pushNotifications?: boolean | undefined;
        smsNotifications?: boolean | undefined;
    }, {
        language?: string | undefined;
        notifications?: {
            email?: boolean | undefined;
            sms?: boolean | undefined;
            push?: boolean | undefined;
        } | undefined;
        categories?: string[] | undefined;
        theme?: "light" | "dark" | "auto" | undefined;
        emailNotifications?: boolean | undefined;
        pushNotifications?: boolean | undefined;
        smsNotifications?: boolean | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    location?: {
        city?: string | undefined;
        state?: string | undefined;
        pincode?: string | undefined;
        coordinates?: [number, number] | undefined;
        address?: string | undefined;
    } | undefined;
    firstName?: string | undefined;
    lastName?: string | undefined;
    avatar?: string | undefined;
    bio?: string | undefined;
    website?: string | undefined;
    dateOfBirth?: Date | undefined;
    gender?: "male" | "female" | "other" | "prefer_not_to_say" | undefined;
    timezone?: string | undefined;
    ringSize?: string | undefined;
    jewelryPreferences?: {
        preferredMetals?: string[] | undefined;
        preferredStones?: string[] | undefined;
        style?: string | undefined;
    } | undefined;
    preferences?: {
        language?: string | undefined;
        notifications?: {
            email?: boolean | undefined;
            sms?: boolean | undefined;
            push?: boolean | undefined;
        } | undefined;
        categories?: string[] | undefined;
        theme?: "light" | "dark" | "auto" | undefined;
        emailNotifications?: boolean | undefined;
        pushNotifications?: boolean | undefined;
        smsNotifications?: boolean | undefined;
    } | undefined;
}, {
    location?: {
        city?: string | undefined;
        state?: string | undefined;
        pincode?: string | undefined;
        coordinates?: [number, number] | undefined;
        address?: string | undefined;
    } | undefined;
    firstName?: string | undefined;
    lastName?: string | undefined;
    avatar?: string | undefined;
    bio?: string | undefined;
    website?: string | undefined;
    dateOfBirth?: Date | undefined;
    gender?: "male" | "female" | "other" | "prefer_not_to_say" | undefined;
    timezone?: string | undefined;
    ringSize?: string | undefined;
    jewelryPreferences?: {
        preferredMetals?: string[] | undefined;
        preferredStones?: string[] | undefined;
        style?: string | undefined;
    } | undefined;
    preferences?: {
        language?: string | undefined;
        notifications?: {
            email?: boolean | undefined;
            sms?: boolean | undefined;
            push?: boolean | undefined;
        } | undefined;
        categories?: string[] | undefined;
        theme?: "light" | "dark" | "auto" | undefined;
        emailNotifications?: boolean | undefined;
        pushNotifications?: boolean | undefined;
        smsNotifications?: boolean | undefined;
    } | undefined;
}>;
export declare const UserResponseSchema: z.ZodObject<{
    _id: z.ZodOptional<z.ZodString>;
    email: z.ZodString;
    phone: z.ZodString;
    role: z.ZodEnum<["user", "consumer", "merchant", "admin", "support", "operator", "super_admin"]>;
    profile: z.ZodOptional<z.ZodObject<{
        firstName: z.ZodOptional<z.ZodString>;
        lastName: z.ZodOptional<z.ZodString>;
        avatar: z.ZodOptional<z.ZodString>;
        bio: z.ZodOptional<z.ZodString>;
        website: z.ZodOptional<z.ZodString>;
        dateOfBirth: z.ZodOptional<z.ZodDate>;
        gender: z.ZodOptional<z.ZodEnum<["male", "female", "other", "prefer_not_to_say"]>>;
        location: z.ZodOptional<z.ZodObject<{
            address: z.ZodOptional<z.ZodString>;
            city: z.ZodOptional<z.ZodString>;
            state: z.ZodOptional<z.ZodString>;
            pincode: z.ZodOptional<z.ZodString>;
            coordinates: z.ZodOptional<z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>>;
        }, "strip", z.ZodTypeAny, {
            city?: string | undefined;
            state?: string | undefined;
            pincode?: string | undefined;
            coordinates?: [number, number] | undefined;
            address?: string | undefined;
        }, {
            city?: string | undefined;
            state?: string | undefined;
            pincode?: string | undefined;
            coordinates?: [number, number] | undefined;
            address?: string | undefined;
        }>>;
        locationHistory: z.ZodOptional<z.ZodArray<z.ZodObject<{
            coordinates: z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>;
            address: z.ZodString;
            city: z.ZodOptional<z.ZodString>;
            timestamp: z.ZodDate;
            source: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            coordinates: [number, number];
            address: string;
            timestamp: Date;
            source: string;
            city?: string | undefined;
        }, {
            coordinates: [number, number];
            address: string;
            timestamp: Date;
            source: string;
            city?: string | undefined;
        }>, "many">>;
        timezone: z.ZodOptional<z.ZodString>;
        ringSize: z.ZodOptional<z.ZodString>;
        jewelryPreferences: z.ZodOptional<z.ZodObject<{
            preferredMetals: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            preferredStones: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            style: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            preferredMetals?: string[] | undefined;
            preferredStones?: string[] | undefined;
            style?: string | undefined;
        }, {
            preferredMetals?: string[] | undefined;
            preferredStones?: string[] | undefined;
            style?: string | undefined;
        }>>;
        verificationStatus: z.ZodOptional<z.ZodEnum<["unverified", "pending", "verified", "rejected", "expired"]>>;
        verificationDocuments: z.ZodOptional<z.ZodObject<{
            documentType: z.ZodString;
            documentNumber: z.ZodString;
            documentImage: z.ZodString;
            submittedAt: z.ZodDate;
        }, "strip", z.ZodTypeAny, {
            documentType: string;
            documentNumber: string;
            documentImage: string;
            submittedAt: Date;
        }, {
            documentType: string;
            documentNumber: string;
            documentImage: string;
            submittedAt: Date;
        }>>;
    }, "strip", z.ZodTypeAny, {
        location?: {
            city?: string | undefined;
            state?: string | undefined;
            pincode?: string | undefined;
            coordinates?: [number, number] | undefined;
            address?: string | undefined;
        } | undefined;
        firstName?: string | undefined;
        lastName?: string | undefined;
        avatar?: string | undefined;
        bio?: string | undefined;
        website?: string | undefined;
        dateOfBirth?: Date | undefined;
        gender?: "male" | "female" | "other" | "prefer_not_to_say" | undefined;
        locationHistory?: {
            coordinates: [number, number];
            address: string;
            timestamp: Date;
            source: string;
            city?: string | undefined;
        }[] | undefined;
        timezone?: string | undefined;
        ringSize?: string | undefined;
        jewelryPreferences?: {
            preferredMetals?: string[] | undefined;
            preferredStones?: string[] | undefined;
            style?: string | undefined;
        } | undefined;
        verificationStatus?: "pending" | "expired" | "rejected" | "unverified" | "verified" | undefined;
        verificationDocuments?: {
            documentType: string;
            documentNumber: string;
            documentImage: string;
            submittedAt: Date;
        } | undefined;
    }, {
        location?: {
            city?: string | undefined;
            state?: string | undefined;
            pincode?: string | undefined;
            coordinates?: [number, number] | undefined;
            address?: string | undefined;
        } | undefined;
        firstName?: string | undefined;
        lastName?: string | undefined;
        avatar?: string | undefined;
        bio?: string | undefined;
        website?: string | undefined;
        dateOfBirth?: Date | undefined;
        gender?: "male" | "female" | "other" | "prefer_not_to_say" | undefined;
        locationHistory?: {
            coordinates: [number, number];
            address: string;
            timestamp: Date;
            source: string;
            city?: string | undefined;
        }[] | undefined;
        timezone?: string | undefined;
        ringSize?: string | undefined;
        jewelryPreferences?: {
            preferredMetals?: string[] | undefined;
            preferredStones?: string[] | undefined;
            style?: string | undefined;
        } | undefined;
        verificationStatus?: "pending" | "expired" | "rejected" | "unverified" | "verified" | undefined;
        verificationDocuments?: {
            documentType: string;
            documentNumber: string;
            documentImage: string;
            submittedAt: Date;
        } | undefined;
    }>>;
    preferences: z.ZodOptional<z.ZodObject<{
        language: z.ZodOptional<z.ZodString>;
        notifications: z.ZodOptional<z.ZodObject<{
            push: z.ZodOptional<z.ZodBoolean>;
            email: z.ZodOptional<z.ZodBoolean>;
            sms: z.ZodOptional<z.ZodBoolean>;
        }, "strip", z.ZodTypeAny, {
            email?: boolean | undefined;
            sms?: boolean | undefined;
            push?: boolean | undefined;
        }, {
            email?: boolean | undefined;
            sms?: boolean | undefined;
            push?: boolean | undefined;
        }>>;
        categories: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        theme: z.ZodOptional<z.ZodEnum<["light", "dark", "auto"]>>;
        emailNotifications: z.ZodOptional<z.ZodBoolean>;
        pushNotifications: z.ZodOptional<z.ZodBoolean>;
        smsNotifications: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        language?: string | undefined;
        notifications?: {
            email?: boolean | undefined;
            sms?: boolean | undefined;
            push?: boolean | undefined;
        } | undefined;
        categories?: string[] | undefined;
        theme?: "light" | "dark" | "auto" | undefined;
        emailNotifications?: boolean | undefined;
        pushNotifications?: boolean | undefined;
        smsNotifications?: boolean | undefined;
    }, {
        language?: string | undefined;
        notifications?: {
            email?: boolean | undefined;
            sms?: boolean | undefined;
            push?: boolean | undefined;
        } | undefined;
        categories?: string[] | undefined;
        theme?: "light" | "dark" | "auto" | undefined;
        emailNotifications?: boolean | undefined;
        pushNotifications?: boolean | undefined;
        smsNotifications?: boolean | undefined;
    }>>;
    auth: z.ZodOptional<z.ZodObject<{
        isVerified: z.ZodBoolean;
        isOnboarded: z.ZodBoolean;
        lastLogin: z.ZodOptional<z.ZodDate>;
        loginAttempts: z.ZodNumber;
        totpEnabled: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        isVerified: boolean;
        isOnboarded: boolean;
        loginAttempts: number;
        lastLogin?: Date | undefined;
        totpEnabled?: boolean | undefined;
    }, {
        isVerified: boolean;
        isOnboarded: boolean;
        loginAttempts: number;
        lastLogin?: Date | undefined;
        totpEnabled?: boolean | undefined;
    }>>;
    createdAt: z.ZodOptional<z.ZodDate>;
    updatedAt: z.ZodOptional<z.ZodDate>;
}, "strip", z.ZodTypeAny, {
    email: string;
    role: "user" | "consumer" | "merchant" | "admin" | "support" | "operator" | "super_admin";
    phone: string;
    profile?: {
        location?: {
            city?: string | undefined;
            state?: string | undefined;
            pincode?: string | undefined;
            coordinates?: [number, number] | undefined;
            address?: string | undefined;
        } | undefined;
        firstName?: string | undefined;
        lastName?: string | undefined;
        avatar?: string | undefined;
        bio?: string | undefined;
        website?: string | undefined;
        dateOfBirth?: Date | undefined;
        gender?: "male" | "female" | "other" | "prefer_not_to_say" | undefined;
        locationHistory?: {
            coordinates: [number, number];
            address: string;
            timestamp: Date;
            source: string;
            city?: string | undefined;
        }[] | undefined;
        timezone?: string | undefined;
        ringSize?: string | undefined;
        jewelryPreferences?: {
            preferredMetals?: string[] | undefined;
            preferredStones?: string[] | undefined;
            style?: string | undefined;
        } | undefined;
        verificationStatus?: "pending" | "expired" | "rejected" | "unverified" | "verified" | undefined;
        verificationDocuments?: {
            documentType: string;
            documentNumber: string;
            documentImage: string;
            submittedAt: Date;
        } | undefined;
    } | undefined;
    auth?: {
        isVerified: boolean;
        isOnboarded: boolean;
        loginAttempts: number;
        lastLogin?: Date | undefined;
        totpEnabled?: boolean | undefined;
    } | undefined;
    _id?: string | undefined;
    createdAt?: Date | undefined;
    updatedAt?: Date | undefined;
    preferences?: {
        language?: string | undefined;
        notifications?: {
            email?: boolean | undefined;
            sms?: boolean | undefined;
            push?: boolean | undefined;
        } | undefined;
        categories?: string[] | undefined;
        theme?: "light" | "dark" | "auto" | undefined;
        emailNotifications?: boolean | undefined;
        pushNotifications?: boolean | undefined;
        smsNotifications?: boolean | undefined;
    } | undefined;
}, {
    email: string;
    role: "user" | "consumer" | "merchant" | "admin" | "support" | "operator" | "super_admin";
    phone: string;
    profile?: {
        location?: {
            city?: string | undefined;
            state?: string | undefined;
            pincode?: string | undefined;
            coordinates?: [number, number] | undefined;
            address?: string | undefined;
        } | undefined;
        firstName?: string | undefined;
        lastName?: string | undefined;
        avatar?: string | undefined;
        bio?: string | undefined;
        website?: string | undefined;
        dateOfBirth?: Date | undefined;
        gender?: "male" | "female" | "other" | "prefer_not_to_say" | undefined;
        locationHistory?: {
            coordinates: [number, number];
            address: string;
            timestamp: Date;
            source: string;
            city?: string | undefined;
        }[] | undefined;
        timezone?: string | undefined;
        ringSize?: string | undefined;
        jewelryPreferences?: {
            preferredMetals?: string[] | undefined;
            preferredStones?: string[] | undefined;
            style?: string | undefined;
        } | undefined;
        verificationStatus?: "pending" | "expired" | "rejected" | "unverified" | "verified" | undefined;
        verificationDocuments?: {
            documentType: string;
            documentNumber: string;
            documentImage: string;
            submittedAt: Date;
        } | undefined;
    } | undefined;
    auth?: {
        isVerified: boolean;
        isOnboarded: boolean;
        loginAttempts: number;
        lastLogin?: Date | undefined;
        totpEnabled?: boolean | undefined;
    } | undefined;
    _id?: string | undefined;
    createdAt?: Date | undefined;
    updatedAt?: Date | undefined;
    preferences?: {
        language?: string | undefined;
        notifications?: {
            email?: boolean | undefined;
            sms?: boolean | undefined;
            push?: boolean | undefined;
        } | undefined;
        categories?: string[] | undefined;
        theme?: "light" | "dark" | "auto" | undefined;
        emailNotifications?: boolean | undefined;
        pushNotifications?: boolean | undefined;
        smsNotifications?: boolean | undefined;
    } | undefined;
}>;
export declare const UserListResponseSchema: z.ZodArray<z.ZodObject<{
    _id: z.ZodOptional<z.ZodString>;
    email: z.ZodString;
    phone: z.ZodString;
    role: z.ZodEnum<["user", "consumer", "merchant", "admin", "support", "operator", "super_admin"]>;
    profile: z.ZodOptional<z.ZodObject<{
        firstName: z.ZodOptional<z.ZodString>;
        lastName: z.ZodOptional<z.ZodString>;
        avatar: z.ZodOptional<z.ZodString>;
        bio: z.ZodOptional<z.ZodString>;
        website: z.ZodOptional<z.ZodString>;
        dateOfBirth: z.ZodOptional<z.ZodDate>;
        gender: z.ZodOptional<z.ZodEnum<["male", "female", "other", "prefer_not_to_say"]>>;
        location: z.ZodOptional<z.ZodObject<{
            address: z.ZodOptional<z.ZodString>;
            city: z.ZodOptional<z.ZodString>;
            state: z.ZodOptional<z.ZodString>;
            pincode: z.ZodOptional<z.ZodString>;
            coordinates: z.ZodOptional<z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>>;
        }, "strip", z.ZodTypeAny, {
            city?: string | undefined;
            state?: string | undefined;
            pincode?: string | undefined;
            coordinates?: [number, number] | undefined;
            address?: string | undefined;
        }, {
            city?: string | undefined;
            state?: string | undefined;
            pincode?: string | undefined;
            coordinates?: [number, number] | undefined;
            address?: string | undefined;
        }>>;
        locationHistory: z.ZodOptional<z.ZodArray<z.ZodObject<{
            coordinates: z.ZodTuple<[z.ZodNumber, z.ZodNumber], null>;
            address: z.ZodString;
            city: z.ZodOptional<z.ZodString>;
            timestamp: z.ZodDate;
            source: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            coordinates: [number, number];
            address: string;
            timestamp: Date;
            source: string;
            city?: string | undefined;
        }, {
            coordinates: [number, number];
            address: string;
            timestamp: Date;
            source: string;
            city?: string | undefined;
        }>, "many">>;
        timezone: z.ZodOptional<z.ZodString>;
        ringSize: z.ZodOptional<z.ZodString>;
        jewelryPreferences: z.ZodOptional<z.ZodObject<{
            preferredMetals: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            preferredStones: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            style: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            preferredMetals?: string[] | undefined;
            preferredStones?: string[] | undefined;
            style?: string | undefined;
        }, {
            preferredMetals?: string[] | undefined;
            preferredStones?: string[] | undefined;
            style?: string | undefined;
        }>>;
        verificationStatus: z.ZodOptional<z.ZodEnum<["unverified", "pending", "verified", "rejected", "expired"]>>;
        verificationDocuments: z.ZodOptional<z.ZodObject<{
            documentType: z.ZodString;
            documentNumber: z.ZodString;
            documentImage: z.ZodString;
            submittedAt: z.ZodDate;
        }, "strip", z.ZodTypeAny, {
            documentType: string;
            documentNumber: string;
            documentImage: string;
            submittedAt: Date;
        }, {
            documentType: string;
            documentNumber: string;
            documentImage: string;
            submittedAt: Date;
        }>>;
    }, "strip", z.ZodTypeAny, {
        location?: {
            city?: string | undefined;
            state?: string | undefined;
            pincode?: string | undefined;
            coordinates?: [number, number] | undefined;
            address?: string | undefined;
        } | undefined;
        firstName?: string | undefined;
        lastName?: string | undefined;
        avatar?: string | undefined;
        bio?: string | undefined;
        website?: string | undefined;
        dateOfBirth?: Date | undefined;
        gender?: "male" | "female" | "other" | "prefer_not_to_say" | undefined;
        locationHistory?: {
            coordinates: [number, number];
            address: string;
            timestamp: Date;
            source: string;
            city?: string | undefined;
        }[] | undefined;
        timezone?: string | undefined;
        ringSize?: string | undefined;
        jewelryPreferences?: {
            preferredMetals?: string[] | undefined;
            preferredStones?: string[] | undefined;
            style?: string | undefined;
        } | undefined;
        verificationStatus?: "pending" | "expired" | "rejected" | "unverified" | "verified" | undefined;
        verificationDocuments?: {
            documentType: string;
            documentNumber: string;
            documentImage: string;
            submittedAt: Date;
        } | undefined;
    }, {
        location?: {
            city?: string | undefined;
            state?: string | undefined;
            pincode?: string | undefined;
            coordinates?: [number, number] | undefined;
            address?: string | undefined;
        } | undefined;
        firstName?: string | undefined;
        lastName?: string | undefined;
        avatar?: string | undefined;
        bio?: string | undefined;
        website?: string | undefined;
        dateOfBirth?: Date | undefined;
        gender?: "male" | "female" | "other" | "prefer_not_to_say" | undefined;
        locationHistory?: {
            coordinates: [number, number];
            address: string;
            timestamp: Date;
            source: string;
            city?: string | undefined;
        }[] | undefined;
        timezone?: string | undefined;
        ringSize?: string | undefined;
        jewelryPreferences?: {
            preferredMetals?: string[] | undefined;
            preferredStones?: string[] | undefined;
            style?: string | undefined;
        } | undefined;
        verificationStatus?: "pending" | "expired" | "rejected" | "unverified" | "verified" | undefined;
        verificationDocuments?: {
            documentType: string;
            documentNumber: string;
            documentImage: string;
            submittedAt: Date;
        } | undefined;
    }>>;
    preferences: z.ZodOptional<z.ZodObject<{
        language: z.ZodOptional<z.ZodString>;
        notifications: z.ZodOptional<z.ZodObject<{
            push: z.ZodOptional<z.ZodBoolean>;
            email: z.ZodOptional<z.ZodBoolean>;
            sms: z.ZodOptional<z.ZodBoolean>;
        }, "strip", z.ZodTypeAny, {
            email?: boolean | undefined;
            sms?: boolean | undefined;
            push?: boolean | undefined;
        }, {
            email?: boolean | undefined;
            sms?: boolean | undefined;
            push?: boolean | undefined;
        }>>;
        categories: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        theme: z.ZodOptional<z.ZodEnum<["light", "dark", "auto"]>>;
        emailNotifications: z.ZodOptional<z.ZodBoolean>;
        pushNotifications: z.ZodOptional<z.ZodBoolean>;
        smsNotifications: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        language?: string | undefined;
        notifications?: {
            email?: boolean | undefined;
            sms?: boolean | undefined;
            push?: boolean | undefined;
        } | undefined;
        categories?: string[] | undefined;
        theme?: "light" | "dark" | "auto" | undefined;
        emailNotifications?: boolean | undefined;
        pushNotifications?: boolean | undefined;
        smsNotifications?: boolean | undefined;
    }, {
        language?: string | undefined;
        notifications?: {
            email?: boolean | undefined;
            sms?: boolean | undefined;
            push?: boolean | undefined;
        } | undefined;
        categories?: string[] | undefined;
        theme?: "light" | "dark" | "auto" | undefined;
        emailNotifications?: boolean | undefined;
        pushNotifications?: boolean | undefined;
        smsNotifications?: boolean | undefined;
    }>>;
    auth: z.ZodOptional<z.ZodObject<{
        isVerified: z.ZodBoolean;
        isOnboarded: z.ZodBoolean;
        lastLogin: z.ZodOptional<z.ZodDate>;
        loginAttempts: z.ZodNumber;
        totpEnabled: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        isVerified: boolean;
        isOnboarded: boolean;
        loginAttempts: number;
        lastLogin?: Date | undefined;
        totpEnabled?: boolean | undefined;
    }, {
        isVerified: boolean;
        isOnboarded: boolean;
        loginAttempts: number;
        lastLogin?: Date | undefined;
        totpEnabled?: boolean | undefined;
    }>>;
    createdAt: z.ZodOptional<z.ZodDate>;
    updatedAt: z.ZodOptional<z.ZodDate>;
}, "strip", z.ZodTypeAny, {
    email: string;
    role: "user" | "consumer" | "merchant" | "admin" | "support" | "operator" | "super_admin";
    phone: string;
    profile?: {
        location?: {
            city?: string | undefined;
            state?: string | undefined;
            pincode?: string | undefined;
            coordinates?: [number, number] | undefined;
            address?: string | undefined;
        } | undefined;
        firstName?: string | undefined;
        lastName?: string | undefined;
        avatar?: string | undefined;
        bio?: string | undefined;
        website?: string | undefined;
        dateOfBirth?: Date | undefined;
        gender?: "male" | "female" | "other" | "prefer_not_to_say" | undefined;
        locationHistory?: {
            coordinates: [number, number];
            address: string;
            timestamp: Date;
            source: string;
            city?: string | undefined;
        }[] | undefined;
        timezone?: string | undefined;
        ringSize?: string | undefined;
        jewelryPreferences?: {
            preferredMetals?: string[] | undefined;
            preferredStones?: string[] | undefined;
            style?: string | undefined;
        } | undefined;
        verificationStatus?: "pending" | "expired" | "rejected" | "unverified" | "verified" | undefined;
        verificationDocuments?: {
            documentType: string;
            documentNumber: string;
            documentImage: string;
            submittedAt: Date;
        } | undefined;
    } | undefined;
    auth?: {
        isVerified: boolean;
        isOnboarded: boolean;
        loginAttempts: number;
        lastLogin?: Date | undefined;
        totpEnabled?: boolean | undefined;
    } | undefined;
    _id?: string | undefined;
    createdAt?: Date | undefined;
    updatedAt?: Date | undefined;
    preferences?: {
        language?: string | undefined;
        notifications?: {
            email?: boolean | undefined;
            sms?: boolean | undefined;
            push?: boolean | undefined;
        } | undefined;
        categories?: string[] | undefined;
        theme?: "light" | "dark" | "auto" | undefined;
        emailNotifications?: boolean | undefined;
        pushNotifications?: boolean | undefined;
        smsNotifications?: boolean | undefined;
    } | undefined;
}, {
    email: string;
    role: "user" | "consumer" | "merchant" | "admin" | "support" | "operator" | "super_admin";
    phone: string;
    profile?: {
        location?: {
            city?: string | undefined;
            state?: string | undefined;
            pincode?: string | undefined;
            coordinates?: [number, number] | undefined;
            address?: string | undefined;
        } | undefined;
        firstName?: string | undefined;
        lastName?: string | undefined;
        avatar?: string | undefined;
        bio?: string | undefined;
        website?: string | undefined;
        dateOfBirth?: Date | undefined;
        gender?: "male" | "female" | "other" | "prefer_not_to_say" | undefined;
        locationHistory?: {
            coordinates: [number, number];
            address: string;
            timestamp: Date;
            source: string;
            city?: string | undefined;
        }[] | undefined;
        timezone?: string | undefined;
        ringSize?: string | undefined;
        jewelryPreferences?: {
            preferredMetals?: string[] | undefined;
            preferredStones?: string[] | undefined;
            style?: string | undefined;
        } | undefined;
        verificationStatus?: "pending" | "expired" | "rejected" | "unverified" | "verified" | undefined;
        verificationDocuments?: {
            documentType: string;
            documentNumber: string;
            documentImage: string;
            submittedAt: Date;
        } | undefined;
    } | undefined;
    auth?: {
        isVerified: boolean;
        isOnboarded: boolean;
        loginAttempts: number;
        lastLogin?: Date | undefined;
        totpEnabled?: boolean | undefined;
    } | undefined;
    _id?: string | undefined;
    createdAt?: Date | undefined;
    updatedAt?: Date | undefined;
    preferences?: {
        language?: string | undefined;
        notifications?: {
            email?: boolean | undefined;
            sms?: boolean | undefined;
            push?: boolean | undefined;
        } | undefined;
        categories?: string[] | undefined;
        theme?: "light" | "dark" | "auto" | undefined;
        emailNotifications?: boolean | undefined;
        pushNotifications?: boolean | undefined;
        smsNotifications?: boolean | undefined;
    } | undefined;
}>, "many">;
export type CreateUserRequest = z.infer<typeof CreateUserSchema>;
export type UpdateProfileRequest = z.infer<typeof UpdateProfileSchema>;
export type UserResponse = z.infer<typeof UserResponseSchema>;
export type UserListResponse = z.infer<typeof UserListResponseSchema>;
export type UserRole = z.infer<typeof USER_ROLE>;
export type Gender = z.infer<typeof GENDER>;
export type AccountVerificationStatus = z.infer<typeof ACCOUNT_VERIFICATION_STATUS>;
export type Theme = z.infer<typeof THEME>;
//# sourceMappingURL=user.schema.d.ts.map