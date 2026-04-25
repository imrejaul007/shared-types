import { UserRole, Gender, VerificationStatus, JewelryStyle, Theme, ReferralTier, RezPlusTier, PriveTier, LoyaltyTier, LocationSource, DocumentType, ProfessionType, ServiceType } from '../enums/index';
import type { UserId, StoreId } from '../branded/ids';
export interface IUserLocation {
    address?: string;
    city?: string;
    state?: string;
    pincode?: string;
    coordinates?: [number, number];
}
export interface IUserLocationHistory {
    coordinates: [number, number];
    address: string;
    city?: string;
    timestamp: Date | string;
    source: LocationSource;
}
export interface IUserJewelryPreferences {
    preferredMetals?: string[];
    preferredStones?: string[];
    style?: JewelryStyle;
}
export interface IUserVerificationDocument {
    documentType: string;
    documentNumber: string;
    documentImage: string;
    submittedAt: Date | string;
}
export interface IUserProfile {
    firstName?: string;
    lastName?: string;
    avatar?: string;
    bio?: string;
    website?: string;
    dateOfBirth?: Date | string;
    gender?: Gender;
    location?: IUserLocation;
    locationHistory?: IUserLocationHistory[];
    timezone?: string;
    ringSize?: string;
    jewelryPreferences?: IUserJewelryPreferences;
    verificationStatus?: VerificationStatus;
    verificationDocuments?: IUserVerificationDocument;
}
export interface IUserNotificationPreferences {
    push?: boolean;
    email?: boolean;
    sms?: boolean;
}
export interface IUserPreferences {
    language?: string;
    currency?: 'INR' | 'USD' | 'EUR' | 'GBP';
    notifications?: IUserNotificationPreferences;
    categories?: string[];
    theme?: Theme;
    emailNotifications?: boolean;
    pushNotifications?: boolean;
    smsNotifications?: boolean;
}
export interface IUserWallet {
    balance: number;
    isFrozen?: boolean;
}
export interface IUserAuth {
    isVerified: boolean;
    isOnboarded: boolean;
    lastLogin?: Date | string;
    refreshToken?: string;
    otpCode?: string;
    otpExpiry?: Date | string;
    loginAttempts: number;
    lockUntil?: Date | string;
    totpSecret?: string;
    totpEnabled?: boolean;
    pinHash?: string;
    pinSetAt?: Date | string;
    pinAttempts?: number;
    pinLockedUntil?: Date | string;
}
export interface IUserReferral {
    referralCode: string;
    referredBy?: string;
    referredUsers: string[];
    totalReferrals: number;
    referralEarnings: number;
    referralRewardIssued?: boolean;
}
export interface IExclusiveZoneVerification {
    verified: boolean;
    verifiedAt?: Date | string;
}
export interface IStudentVerification extends IExclusiveZoneVerification {
    instituteName?: string;
    documentType?: DocumentType;
    expiresAt?: Date | string;
}
export interface ICorporateVerification extends IExclusiveZoneVerification {
    companyName?: string;
    corporateEmail?: string;
    expiresAt?: Date | string;
}
export interface IDefenceVerification extends IExclusiveZoneVerification {
    documentType?: DocumentType;
    serviceType?: ServiceType;
}
export interface IHealthcareVerification extends IExclusiveZoneVerification {
    documentType?: DocumentType;
    profession?: ProfessionType;
}
export interface ISeniorVerification extends IExclusiveZoneVerification {
    dateOfBirth?: Date | string;
}
export interface ITeacherVerification extends IExclusiveZoneVerification {
    instituteName?: string;
    documentType?: DocumentType;
}
export interface IGovernmentVerification extends IExclusiveZoneVerification {
    department?: string;
    documentType?: DocumentType;
}
export interface IDifferentlyAbledVerification extends IExclusiveZoneVerification {
    documentType?: DocumentType;
    disabilityType?: string;
}
export interface IUserVerifications {
    student?: IStudentVerification;
    corporate?: ICorporateVerification;
    defence?: IDefenceVerification;
    healthcare?: IHealthcareVerification;
    senior?: ISeniorVerification;
    teacher?: ITeacherVerification;
    government?: IGovernmentVerification;
    differentlyAbled?: IDifferentlyAbledVerification;
}
export interface IUserSocialLogin {
    googleId?: string;
    facebookId?: string;
    provider?: 'google' | 'facebook';
}
export interface IUserPushToken {
    token: string;
    platform: 'ios' | 'android' | 'web';
    deviceInfo?: Record<string, string | number | boolean | null>;
    lastUsed: Date | string;
}
export interface IUserPatchTest {
    serviceCategory: string;
    testedAt: Date | string;
    expiresAt: Date | string;
    result: 'pass' | 'reaction';
    conductedBy: string;
    storeId: string | StoreId;
}
export interface IUserFraudFlags {
    coinVelocity?: {
        flaggedAt: Date | string;
        earnedLast24h: number;
        zScore: number;
        cleared?: boolean;
        clearedAt?: Date | string;
    };
    referralAbuse?: {
        flaggedAt: Date | string;
        reason: string;
    };
}
export type UserAccountStatus = 'active' | 'suspended' | 'inactive';
export type UserVerificationSegment = 'none' | 'provisional' | 'pending' | 'verified';
export type UserSegment = 'normal' | 'verified_student' | 'verified_employee' | 'verified_defence' | 'verified_healthcare';
export type UserInstituteStatus = 'not_available' | 'pending_referral' | 'onboarded';
export type UserStatedIdentity = 'student' | 'corporate' | 'other' | 'general';
export interface IUser {
    _id?: string | UserId;
    phoneNumber: string;
    email?: string;
    password?: string;
    profile: IUserProfile;
    preferences: IUserPreferences;
    wallet?: IUserWallet;
    auth: IUserAuth;
    referral: IUserReferral;
    verifications?: IUserVerifications;
    socialLogin?: IUserSocialLogin;
    role: UserRole;
    isActive: boolean;
    isSuspended?: boolean;
    status?: UserAccountStatus;
    suspendedAt?: Date | string;
    suspendReason?: string;
    createdAt: Date | string;
    updatedAt: Date | string;
    referralCode?: string;
    fullName?: string;
    username?: string;
    referralTier?: ReferralTier;
    isPremium?: boolean;
    premiumExpiresAt?: Date | string;
    rezPlusTier?: RezPlusTier;
    priveTier?: PriveTier;
    activeZones?: string[];
    loyaltyTier?: LoyaltyTier;
    userType?: string;
    age?: number;
    location?: string;
    interests?: string[];
    phone?: string;
    pushTokens?: IUserPushToken[];
    patchTests?: IUserPatchTest[];
    featureLevel?: number;
    verificationSegment?: UserVerificationSegment;
    segment?: UserSegment;
    instituteStatus?: UserInstituteStatus;
    statedIdentity?: UserStatedIdentity;
    isFlagged?: boolean;
    flagReason?: string;
    flaggedBy?: string;
    flaggedAt?: Date | string;
    gameBanned?: boolean;
    gameBanReason?: string;
    gameBannedAt?: Date | string;
    lastLogin?: Date | string;
    tosAcceptedAt?: Date | string | null;
    tosVersion?: string | null;
    privacyPolicyAcceptedAt?: Date | string | null;
    privacyPolicyVersion?: string | null;
    fraudFlags?: IUserFraudFlags;
    deletedAt?: Date | string | null;
    isDeleted?: boolean;
    deviceInfo?: unknown;
}
//# sourceMappingURL=user.d.ts.map