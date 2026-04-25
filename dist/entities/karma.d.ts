export type KarmaLevel = 'L1' | 'L2' | 'L3' | 'L4';
export type KarmaConversionRate = 0.25 | 0.5 | 0.75 | 1.0;
export type EarnRecordStatus = 'APPROVED_PENDING_CONVERSION' | 'CONVERTED' | 'REJECTED' | 'ROLLED_BACK';
export type BatchStatus = 'DRAFT' | 'READY' | 'EXECUTED' | 'PARTIAL' | 'PAUSED';
export type CSRPoolStatus = 'active' | 'depleted' | 'expired';
export type KarmaVerificationStatus = 'pending' | 'partial' | 'verified' | 'rejected';
export type EventDifficulty = 'easy' | 'medium' | 'hard';
export type EventCategory = 'environment' | 'food' | 'health' | 'education' | 'community';
export type KarmaEventStatus = 'draft' | 'published' | 'ongoing' | 'completed' | 'cancelled';
export interface IBadge {
    id: string;
    name: string;
    earnedAt: Date;
}
export interface ILevelHistoryEntry {
    level: KarmaLevel;
    earnedAt: Date;
    droppedAt?: Date;
    reason?: string;
}
export interface IConversionHistoryEntry {
    karmaConverted: number;
    coinsEarned: number;
    rate: number;
    batchId: string;
    convertedAt: Date;
}
export interface IVerificationSignals {
    qr_in?: boolean;
    qr_out?: boolean;
    gps_match?: number;
    ngo_approved?: boolean;
    photo_proof?: boolean;
}
export interface IKarmaProfile {
    _id: string;
    userId: string;
    lifetimeKarma: number;
    activeKarma: number;
    level: KarmaLevel;
    eventsCompleted: number;
    eventsJoined: number;
    totalHours: number;
    trustScore: number;
    badges: IBadge[];
    lastActivityAt: Date;
    levelHistory: ILevelHistoryEntry[];
    conversionHistory: IConversionHistoryEntry[];
    thisWeekKarmaEarned: number;
    weekOfLastKarmaEarned?: Date;
    avgEventDifficulty: number;
    avgConfidenceScore: number;
    checkIns: number;
    approvedCheckIns: number;
    activityHistory: Date[];
    createdAt: Date;
    updatedAt: Date;
    lastDecayAppliedAt?: Date;
    userTimezone?: string;
}
export interface IEarnRecord {
    _id: string;
    userId: string;
    eventId: string;
    bookingId: string;
    karmaEarned: number;
    activeLevelAtApproval: KarmaLevel;
    conversionRateSnapshot: number;
    csrPoolId: string;
    verificationSignals: IVerificationSignals;
    confidenceScore: number;
    status: EarnRecordStatus;
    createdAt: Date;
    approvedAt?: Date;
    convertedAt?: Date;
    convertedBy?: string;
    batchId?: string;
    rezCoinsEarned?: number;
    idempotencyKey: string;
}
export interface IQRCodeSet {
    checkIn: string;
    checkOut: string;
}
export interface IKarmaEvent {
    _id: string;
    merchantEventId: string;
    ngoId: string;
    category: EventCategory;
    impactUnit: string;
    impactMultiplier: number;
    difficulty: EventDifficulty;
    expectedDurationHours: number;
    baseKarmaPerHour: number;
    maxKarmaPerEvent: number;
    qrCodes: IQRCodeSet;
    gpsRadius: number;
    maxVolunteers: number;
    confirmedVolunteers: number;
    status: KarmaEventStatus;
    createdAt: Date;
    updatedAt: Date;
}
export interface IConversionBatch {
    _id: string;
    status: BatchStatus;
    totalRecords: number;
    approvedRecords: number;
    rejectedRecords: number;
    totalKarma: number;
    totalCoins: number;
    averageRate: KarmaConversionRate;
    executedAt?: Date;
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface ILevelInfo {
    level: KarmaLevel;
    minKarma: number;
    maxKarma?: number;
    conversionRate: KarmaConversionRate;
    benefits: string[];
}
export interface IKarmaStats {
    lifetimeKarma: number;
    activeKarma: number;
    level: KarmaLevel;
    levelProgress: number;
    eventsAttended: number;
    checkInRate: number;
    trustScore: number;
    badges: IBadge[];
    nextLevel?: ILevelInfo;
}
export interface KarmaProfileDelta {
    activeKarmaChange: number;
    levelChange: boolean;
    oldLevel?: KarmaLevel;
    newLevel?: KarmaLevel;
    lastDecayAppliedAt?: Date;
}
export type KarmaScoreBand = 'starter' | 'active' | 'performer' | 'leader' | 'elite' | 'pinnacle';
export type TrustGrade = 'D' | 'C' | 'B' | 'A' | 'S';
export type MomentumLabel = 'cold' | 'slow' | 'steady' | 'hot' | 'blazing';
export interface KarmaScoreComponents {
    base: number;
    impact: number;
    relativeRank: number;
    trust: number;
    momentum: number;
}
export interface BandMetadata {
    label: string;
    color: string;
    bgColor: string;
    minScore: number;
    maxScore: number;
    perks: string[];
}
export interface StabilitySnapshot {
    raw: number;
    display: number;
    lastRawAt: number;
}
export interface ScoreHistoryEntry {
    date: Date;
    rawScore: number;
    displayScore: number;
    band: string;
    percentile: number;
    components: KarmaScoreComponents;
    activeKarma: number;
    lifetimeKarma: number;
}
export type PerkType = 'discount' | 'upgrade' | 'access' | 'cashback' | 'coin_bonus';
export type PerkClaimStatus = 'active' | 'used' | 'expired' | 'revoked';
//# sourceMappingURL=karma.d.ts.map