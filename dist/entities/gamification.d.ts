export interface IBadge {
    _id?: string;
    code: string;
    name: string;
    description?: string;
    icon?: string;
    tier?: 'bronze' | 'silver' | 'gold' | 'platinum';
    earnedAt: Date;
}
export interface IReward {
    _id?: string;
    type: 'coins' | 'badge' | 'discount' | 'exclusive_access';
    value: number | string;
    description?: string;
    earnedAt: Date;
    redeemedAt?: Date;
}
//# sourceMappingURL=gamification.d.ts.map