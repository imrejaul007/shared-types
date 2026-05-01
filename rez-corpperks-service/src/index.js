/**
 * rez-corpperks-service
 * CorpPerks API Gateway - Enterprise Benefits Platform
 */

require('dotenv').config();

// Sentry initialization
const Sentry = require('@sentry/node');
const { expressIntegration, setupExpressErrorHandler } = require('@sentry/node');
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  integrations: [expressIntegration()],
  environment: process.env.NODE_ENV || 'development',
});

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const { connectDB } = require('./config/database');

// Import routes
const corpPerksRoutes = require('./routes/corpPerksRoutes');
const corpGSTRoutes = require('./routes/corpGSTRoutes');
const corpRewardsRoutes = require('./routes/corpRewardsRoutes');
const corpCampaignsRoutes = require('./routes/corpCampaignsRoutes');
const corpIntegrationRoutes = require('./routes/corpIntegrationRoutes');
const corpHRISRoutes = require('./routes/corpHRISRoutes');
const rtmnFinanceRoutes = require('./routes/finance/rtmnFinanceRoutes');
const corpAnalyticsRoutes = require('./routes/corpAnalyticsRoutes');

const app = express();

// Middleware
app.set('trust proxy', 1);
app.use(helmet());
app.use(cors({
  origin: (process.env.CORS_ORIGIN || '*').split(',').map(s => s.trim()),
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(mongoSanitize());

// Logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Health endpoints
app.get('/health/live', (req, res) => res.json({ status: 'ok', service: 'rez-corpperks-service' }));
app.get('/health/ready', (req, res) => res.json({ status: 'ready', service: 'rez-corpperks-service' }));
app.get('/health', (req, res) => res.json({ status: 'ok', service: 'rez-corpperks-service', version: '1.0.0' }));

// CorpPerks Routes
app.use('/api/corp', corpPerksRoutes);           // Benefits, Employees
app.use('/api/gst', corpGSTRoutes);              // GST Invoices
app.use('/api/rewards', corpRewardsRoutes);       // ReZ Coins
app.use('/api/campaigns', corpCampaignsRoutes);   // Campaigns
app.use('/api/integrations', corpIntegrationRoutes); // Integration health
app.use('/api/hris', corpHRISRoutes);            // HRIS Integration
app.use('/api/finance', rtmnFinanceRoutes);     // RTMN Finance (Wallet, Cards, BNPL)
app.use('/api/analytics', corpAnalyticsRoutes);   // Analytics & Reports

// Error handler
app.use((err, req, res, next) => {
  Sentry.captureException(err);
  console.error('Error:', err.message);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal server error'
  });
});

const PORT = parseInt(process.env.PORT || '4013', 10);

// Connect to MongoDB and start server
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`rez-corpperks-service running on :${PORT}`);
    });
  } catch (error) {
    Sentry.captureException(error);
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;
