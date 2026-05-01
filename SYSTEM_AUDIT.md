# REZ Platform - System Architecture Audit

**Last Updated:** 2026-05-02
**Status:** All branches merged, all repos synced

---

## Architecture Overview

### Service Topology

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        CLIENT APPLICATIONS                               │
├─────────────────────────────────────────────────────────────────────────┤
│  rez-app-admin (400+ pages)  │  rez-app-consumer  │  rez-app-marchant │
│  - Expo Router              │  - Expo Router      │  - Expo Router      │
│  - Admin Dashboard          │  - Consumer App     │  - Merchant App      │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                      API GATEWAY / LOAD BALANCER                       │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
        ┌───────────────┬───────────┬───────────┬───────────┬───────────┐
        ▼               ▼           ▼           ▼           ▼           ▼
┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐
│   Auth    │ │  Wallet   │ │  Order   │ │ Payment   │ │ Catalog   │ │ Marketing │
│  Service  │ │  Service  │ │  Service  │ │  Service  │ │  Service  │ │  Service  │
│  Port:4002│ │ Port:3010 │ │ Port:4001 │ │ Port:4001 │ │ Port:3005 │ │ Port:4000 │
└───────────┘ └───────────┘ └───────────┘ └───────────┘ └───────────┘ └───────────┘
        │               │           │           │           │           │
        └───────────────┴───────────┴───────────┴───────────┴───────────┘
                                        │
                    ┌───────────────────┴───────────────────┐
                    ▼                                   ▼
            ┌───────────────┐                   ┌───────────────┐
            │   MongoDB    │                   │    Redis     │
            │  Cluster     │                   │   Sentinel    │
            └───────────────┘                   └───────────────┘
```

---

## Service Inventory

### 1. Authentication Service (`rez-auth-service`)

| Property | Value |
|----------|-------|
| **Port** | 4002 |
| **Health Port** | 4102 |
| **Node** | >=20.0.0 |
| **Database** | MongoDB (`rez-auth`) |
| **Cache** | Redis |
| **Dependencies** | 24 |
| **DevDependencies** | 15 |

**Routes:**
- `authRoutes.ts` - Main authentication (login, register, MFA, OAuth)
- `profile.routes.ts` - User profile management
- `internalProfile.routes.ts` - Internal profile APIs
- `mfaRoutes.ts` - Multi-factor authentication
- `oauthPartnerRoutes.ts` - OAuth partner integration

**Models:**
- `User.ts` - User accounts
- `UserProfile.ts` - Extended user profiles
- `RefreshToken.ts` - JWT refresh tokens
- `AdminMfaConfig.ts` - Admin MFA settings
- `MfaConfig.ts` - MFA configuration

**Services:**
- `tokenService.ts` - JWT generation/validation
- `otpService.ts` - OTP generation/validation
- `emailService.ts` - Email notifications
- `deviceService.ts` - Device tracking

**Environment Variables:**
```
JWT_SECRET, JWT_REFRESH_SECRET, JWT_ADMIN_SECRET
REDIS_URL, REDIS_SENTINEL_HOSTS
MONGODB_URI, MONGODB_AUTH_SOURCE
CORS_ORIGIN, APP_URL
APP_CHECK_SECRET_KEY, OAUTH_*
```

---

### 2. Wallet Service (`rez-wallet-service`)

| Property | Value |
|----------|-------|
| **Port** | 3010 |
| **Health Port** | N/A |
| **Node** | >=20.0.0 |
| **Database** | MongoDB (`rez-wallet`) |
| **Cache** | Redis Sentinel |
| **Dependencies** | 13 |
| **DevDependencies** | 16 |
| **Uses @rez/shared** | NO ⚠️ |

**Routes:**
- `walletRoutes.ts` - Consumer wallet operations
- `merchantWalletRoutes.ts` - Merchant wallet
- `payoutRoutes.ts` - Payout operations
- `referralRoutes.ts` - Referral management
- `creditScoreRoutes.ts` - Credit scoring
- `consumerCredit.ts` - BNPL consumer credit
- `internalCredit.ts` - Internal credit APIs
- `corpPerksRoutes.ts` - Corporate benefits
- `reconciliationRoutes.ts` - Ledger reconciliation
- `dlqAdmin.ts` - Dead letter queue admin
- `internalRoutes.ts` - Internal service APIs

**Models:**
- `Wallet.ts` - Consumer wallet
- `MerchantWallet.ts` - Merchant wallet
- `CoinTransaction.ts` - Coin ledger
- `LedgerEntry.ts` - Double-entry ledger
- `BNPLTransaction.ts` - Buy-now-pay-later
- `CorporateBenefit.ts` - Corp perks
- `CorporateEmployee.ts` - Corp employees
- `CreditScore.ts` - User credit scores
- `ReferralConversion.ts` - Referral tracking
- `Merchant.ts`, `Store.ts` - Cross-service refs

**Environment Variables:**
```
MONGODB_URI, REDIS_URL
WALLET_SERVICE_URL, MERCHANT_SERVICE_URL
PAYMENT_SERVICE_URL
INTENT_CAPTURE_URL
AML_*, CORP_*
JWT_SECRET
```

---

### 3. Order Service (`rez-order-service`)

| Property | Value |
|----------|-------|
| **Port** | 4001 |
| **Health Port** | N/A |
| **Node** | 20.x |
| **Database** | MongoDB (`rez-order`) |
| **Cache** | Redis |
| **Dependencies** | 13 |
| **DevDependencies** | 17 |
| **Workers** | Yes (BullMQ) |

**Routes:**
- `dlqAdmin.ts` - Dead letter queue

**Models:**
- `Order.ts` - Order documents

**Services:**
- `intentCaptureService.ts` - Intent tracking
- `profileIntegration.ts` - Profile service integration
- `rezMindService.ts` - ML/AI integration

**Environment Variables:**
```
MONGODB_URI, REDIS_URL
REZ_AUTH_SERVICE_URL
INTENT_CAPTURE_URL, REZ_MIND_URL
EVENT_STREAM_NAME
```

---

### 4. Payment Service (`rez-payment-service`)

| Property | Value |
|----------|-------|
| **Port** | 4001 |
| **Health Port** | 4101 |
| **Node** | >=20.0.0 |
| **Database** | MongoDB (`rez-payment`) |
| **Cache** | Redis Sentinel |
| **Dependencies** | 20 |
| **DevDependencies** | 13 |

**Routes:**
- `paymentRoutes.ts` - Payment operations
- `dlqAdmin.ts` - Dead letter queue

**Models:**
- `Payment.ts` - Payment records
- `TransactionAuditLog.ts` - Transaction audit trail

**Services:**
- `paymentService.ts` - Core payment logic
- `razorpayService.ts` - Razorpay integration
- `webhookService.ts` - Payment webhooks
- `refundService.ts` - Refund handling
- `reconciliationService.ts` - Payment reconciliation
- `profileIntegration.ts` - Profile service

**Environment Variables:**
```
MONGODB_URI, REDIS_URL
RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET
WALLET_SERVICE_URL
MERCHANT_SERVICE_URL
INTERNAL_WEBHOOK_SECRET
```

---

### 5. Catalog Service (`rez-catalog-service`)

| Property | Value |
|----------|-------|
| **Port** | 3005 |
| **Health Port** | N/A |
| **Node** | 20.x |
| **Database** | MongoDB (`rez-catalog`) |
| **Cache** | Redis |
| **Dependencies** | 19 |
| **DevDependencies** | 6 |

**Models:**
- `Category.ts` - Product categories
- `Product.ts` - Product catalog

---

### 6. Gamification Service (`rez-gamification-service`)

| Property | Value |
|----------|-------|
| **Port** | 3001 |
| **Health Port** | N/A |
| **Node** | 20.x |
| **Database** | MongoDB (shared `rez`) |
| **Cache** | Redis |
| **Dependencies** | 16 |
| **DevDependencies** | 12 |

**Services:**
- `challengeService.ts` - Challenge management
- `leaderboardService.ts` - Leaderboards
- `karmaLeaderboardService.ts` - Karma-specific
- `intentCaptureService.ts` - Intent tracking

---

### 7. Marketing Service (`rez-marketing-service`)

| Property | Value |
|----------|-------|
| **Port** | 4000 |
| **Node** | >=18.0.0 |
| **Database** | MongoDB (`rez-marketing`) |
| **Cache** | Redis |
| **Dependencies** | 18 |
| **DevDependencies** | 10 |

**Routes:**
- `campaigns.ts` - Marketing campaigns
- `broadcasts.ts` - Notification broadcasts
- `vouchers.ts` - Voucher management
- `analytics.ts` - Campaign analytics
- `audience.ts` - Audience management
- `adbazaar.ts` - Ad marketplace
- `keywords.ts` - Keyword bidding
- `webhooks.ts` - External webhooks
- `interactionRoutes.ts` - User interactions

**Models:**
- `MarketingCampaign.ts` - Campaign documents
- `Voucher.ts`, `VoucherRedemption.ts` - Vouchers
- `UserInterestProfile.ts` - User interests
- `AdCampaign.ts` - Advertisement campaigns
- `KeywordBid.ts` - Keyword bids

**Services:**
- `billingService.ts` - Campaign billing
- `voucherService.ts` - Voucher operations
- `intentCaptureService.ts` - Intent tracking

**Environment Variables:**
```
MONGODB_URI, REDIS_URL
AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY
AWS_SES_SMTP_*
FRONTEND_URL
INTENT_CAPTURE_URL
```

---

### 8. Search Service (`rez-search-service`)

| Property | Value |
|----------|-------|
| **Port** | 4006 |
| **Node** | >=20.0.0 |
| **Database** | MongoDB (`rez-search`) |
| **Cache** | Redis |
| **Dependencies** | 11 |
| **DevDependencies** | 6 |

**Routes:**
- `searchRoutes.ts` - Search endpoints
- `homepageRoutes.ts` - Homepage content
- `recommendationRoutes.ts` - Recommendations
- `historyRoutes.ts` - Search history

**Services:**
- `searchService.ts` - Core search
- `recommendationService.ts` - ML recommendations
- `homepageService.ts` - Homepage data
- `searchHistoryService.ts` - History tracking
- `intentCaptureService.ts` - Intent tracking
- `rezMindService.ts` - AI integration

---

### 9. Karma Service (`rez-karma-service`)

| Property | Value |
|----------|-------|
| **Port** | 4011 |
| **Node** | 20.x |
| **Database** | MongoDB (`rez_karma`) |
| **Cache** | Redis Sentinel |
| **Dependencies** | 26 |
| **DevDependencies** | 22 |
| **Uses @rez/shared** | NO ⚠️ |

**Routes:**
- `karmaRoutes.ts` - Core karma operations
- `karmaScoreRoutes.ts` - Karma scoring
- `bookingRoutes.ts` - Event bookings
- `eventRoutes.ts` - Event management
- `batchRoutes.ts` - Batch processing
- `perkRoutes.ts` - Perk management
- `verifyRoutes.ts` - Verification
- `notificationRoutes.ts` - Push notifications
- `walletRoutes.ts` - Wallet integration
- `civicRoutes.ts` - Civic engagement

**Models:**
- `KarmaProfile.ts` - User karma profile
- `KarmaEvent.ts` - Karma events
- `EarnRecord.ts` - Points earned
- `KarmaMission.ts` - Missions/tasks
- `MicroAction.ts` - Quick actions
- `Perk.ts`, `PerkClaim.ts` - Rewards
- `CauseCommunity.ts` - CSR communities
- `CSRPool.ts` - CSR funds
- `CorporatePartner.ts` - Corp partners
- `GreenScoreProfile.ts` - Environmental impact

**Services:**
- `karmaService.ts` - Core karma logic
- `missionEngine.ts` - Mission completion
- `earnRecordService.ts` - Point tracking
- `walletIntegration.ts` - Wallet bridging
- `notificationService.ts` - Push notifications
- `leaderboardService.ts` - Rankings
- `communityService.ts` - Community features
- `auditService.ts` - Activity auditing

**Environment Variables:**
```
MONGODB_URI, REDIS_URL
AUTH_SERVICE_URL
WALLET_SERVICE_URL
FCM_SERVER_KEY
INTENT_CAPTURE_URL
BATCH_CRON_SCHEDULE
```

---

## Cross-Service Dependencies

### Service Communication Map

```
auth-service ─────┬────→ wallet-service (user data)
                 ├────→ order-service (user verification)
                 └────→ payment-service (user auth)

wallet-service ───┬────→ payment-service (coins for payments)
                 ├────→ order-service (coin deduction)
                 ├────→ gamification-service (rewards)
                 └────→ karma-service (karma points)

order-service ────┬────→ auth-service (user data)
                 ├────→ payment-service (payment verification)
                 ├────→ wallet-service (wallet balance)
                 └────→ search-service (order indexing)

payment-service ──┬────→ wallet-service (coin earning)
                 ├────→ order-service (order status)
                 └────→ catalog-service (product lookup)

catalog-service ──┴────→ (standalone, queried by apps)

marketing-service ┬────→ auth-service (user profiles)
                ├────→ intent-graph (analytics)
                └────→ search-service (keyword data)

search-service ───┬────→ catalog-service (product search)
                 └────→ order-service (order search)

gamification ─────┬────→ wallet-service (coin rewards)
                 └────→ karma-service (karma sync)
```

---

## Identified Issues

### 1. CRITICAL: Inconsistent @rez/shared Usage

| Service | Uses @rez/shared | Status |
|---------|-----------------|--------|
| rez-auth-service | ✅ YES | OK |
| rez-catalog-service | ✅ YES | OK |
| rez-gamification-service | ✅ YES | OK |
| rez-marketing-service | ✅ YES | OK |
| rez-order-service | ✅ YES | OK |
| rez-payment-service | ✅ YES | OK |
| rez-search-service | ✅ YES | OK |
| **rez-wallet-service** | ❌ NO | ⚠️ **NEEDS UPDATE** |
| **rez-karma-service** | ❌ NO | ⚠️ **NEEDS UPDATE** |

**Action Required:** Add `@rez/shared` dependency to `rez-wallet-service` and `rez-karma-service`

---

### 2. Port Conflicts

| Service | Primary Port | Conflict |
|---------|-------------|----------|
| order-service | 4001 | ⚠️ Same as payment-service |
| payment-service | 4001 | ⚠️ Same as order-service |

**Resolution Needed:** Reassign ports to avoid conflicts in deployment

---

### 3. Environment Variable Inconsistencies

| Variable | Services Using | Issues |
|----------|---------------|--------|
| `INTENT_CAPTURE_URL` | gamification, marketing, order, search, wallet, karma | Some use `INTENT_GRAPH_URL` |
| `REDIS_URL` | All services | Some fallback to `localhost:6379` |
| `MONGODB_URI` | All services | Different DB names per service |

**Standardized Pattern:**
```bash
SERVICE_NAME_URL=http://service:port
INTERNAL_SERVICE_TOKEN=<token>
```

---

### 4. Missing Service Connections

| Missing Connection | Impact |
|------------------|-------|
| `rez-wallet-service` → `rez-auth-service` | Cannot verify user identity directly |
| `rez-karma-service` → `rez-auth-service` | Uses hardcoded URL fallback |
| `rez-order-service` → `rez-catalog-service` | Product data unavailable at order time |
| `rez-catalog-service` → `rez-search-service` | Search indexing not implemented |

---

### 5. MongoDB Database Fragmentation

| Service | Database Name |
|---------|--------------|
| auth-service | `rez-auth` |
| catalog-service | `rez-catalog` |
| gamification-service | `rez` (shared) |
| marketing-service | `rez-marketing` |
| order-service | `rez-order` |
| payment-service | `rez-payment` |
| search-service | `rez-search` |
| wallet-service | `rez-wallet` |
| karma-service | `rez_karma` |

**Issue:** Inconsistent naming (`rez` vs `rez-` vs `rez_`)

---

## Production URLs

### Render Deployments

| Service | Production URL |
|---------|---------------|
| auth-service | `https://rez-auth-service.onrender.com` |
| wallet-service | `https://rez-wallet-service-36vo.onrender.com` |
| payment-service | `https://rez-payment-service.onrender.com` |
| intent-graph | `https://rez-intent-graph.onrender.com` |

### Client App URLs

| App | Production URL |
|-----|---------------|
| Consumer App | `https://app.rez.money` |
| Admin App | `https://rez-app-admin.vercel.app` |
| Merchant App | (To be determined) |

---

## Required for Live Deployment

### 1. Environment Variables

All services need:

```bash
# Required for ALL services
NODE_ENV=production
SERVICE_NAME=<service-name>
PORT=<port>
HEALTH_PORT=<health-port>

# Database
MONGODB_URI=mongodb+srv://<user>:<pass>@<cluster>/<db>
MONGODB_AUTH_SOURCE=admin

# Cache
REDIS_URL=redis://:<password>@<host>:<port>
REDIS_SENTINEL_HOSTS=<sentinel hosts>
REDIS_SENTINEL_NAME=mymaster

# Security
INTERNAL_SERVICE_TOKENS_JSON={"service-name": "<token>"}
CORS_ORIGIN=https://app.rez.money,https://rez-app-admin.vercel.app

# Logging
LOG_LEVEL=info
SENTRY_DSN=<sentry-dsn>

# Service Discovery
AUTH_SERVICE_URL=https://rez-auth-service.onrender.com
WALLET_SERVICE_URL=https://rez-wallet-service-36vo.onrender.com
PAYMENT_SERVICE_URL=https://rez-payment-service.onrender.com
INTENT_CAPTURE_URL=https://rez-intent-graph.onrender.com
```

### 2. Service-Specific Requirements

**Payment Service:**
```bash
RAZORPAY_KEY_ID=<key>
RAZORPAY_KEY_SECRET=<secret>
WALLET_SERVICE_URL=<url>
MERCHANT_SERVICE_URL=<url>
```

**Karma Service:**
```bash
AUTH_SERVICE_URL=<url>
WALLET_SERVICE_URL=<url>
FCM_SERVER_KEY=<key>
```

**Marketing Service:**
```bash
AWS_ACCESS_KEY_ID=<key>
AWS_SECRET_ACCESS_KEY=<secret>
AWS_SES_SMTP_USER=<user>
AWS_SES_SMTP_PASS=<pass>
```

### 3. MongoDB Atlas Setup

1. Create cluster with replica set
2. Create databases for each service
3. Create users with least-privilege access
4. Whitelist Render IPs

### 4. Redis Setup

1. Create Redis Cloud or Atlas cluster
2. Enable TLS
3. Configure Sentinel for HA
4. Set password

---

## Checklist for Go-Live

- [ ] **rez-wallet-service**: Add `@rez/shared` dependency
- [ ] **rez-karma-service**: Add `@rez/shared` dependency
- [ ] **Port conflicts**: Resolve order/payment port overlap (4001)
- [ ] **Environment variables**: Standardize across all services
- [ ] **MongoDB**: Create all databases and users
- [ ] **Redis**: Set up Sentinel cluster
- [ ] **Service URLs**: Configure in client apps
- [ ] **CORS**: Whitelist production domains
- [ ] **Authentication**: Verify JWT secret consistency
- [ ] **Health checks**: Verify all `/health` endpoints
- [ ] **Monitoring**: Configure Sentry for all services
- [ ] **SSL**: Verify TLS on all external connections

---

## File Locations

| Document | Path |
|---------|------|
| This Audit | `/ReZ Full App/SYSTEM_AUDIT.md` |
| CLAUDE.md templates | Each repo has its own |

---

## Update History

| Date | Changes |
|------|---------|
| 2026-05-02 | Initial comprehensive audit |
| 2026-05-02 | All branches merged, repos synced |
