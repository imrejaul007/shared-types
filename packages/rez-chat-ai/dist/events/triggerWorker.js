"use strict";
// ── Event Trigger Worker ────────────────────────────────────────────────────────
// Background worker for processing scheduled events
Object.defineProperty(exports, "__esModule", { value: true });
exports.TriggerWorker = void 0;
exports.startTriggerWorker = startTriggerWorker;
exports.stopTriggerWorker = stopTriggerWorker;
exports.getTriggerWorker = getTriggerWorker;
const eventTriggers_1 = require("./eventTriggers");
const logger_1 = require("../logger");
class TriggerWorker {
    manager;
    intervalId = null;
    isRunning = false;
    pollIntervalMs;
    constructor(manager, config = {}) {
        this.manager = manager;
        this.pollIntervalMs = config.pollIntervalMs || 60000; // Default 1 minute
    }
    // ── Push Notification Handler ────────────────────────────────────────────────
    async sendPushNotification(payload) {
        try {
            // Integration with Expo Push Notifications or similar
            // This would typically call a service like:
            // - Expo Push API
            // - Firebase Cloud Messaging
            // - OneSignal
            // - Your own push service
            logger_1.logger.info('[TriggerWorker] Sending push notification', {
                userId: payload.userId,
                title: payload.title,
            });
            // Example integration with Expo:
            // await Expo.sendPushNotificationAsync({
            //   to: await getExpoPushToken(payload.userId),
            //   title: payload.title,
            //   body: payload.body,
            //   data: payload.data,
            // });
            return true;
        }
        catch (error) {
            logger_1.logger.error('[TriggerWorker] Push notification failed', {
                userId: payload.userId,
                error: error.message,
            });
            return false;
        }
    }
    // ── SMS Handler ─────────────────────────────────────────────────────────────
    async sendSMS(payload) {
        try {
            // Integration with SMS provider like MSG91, Twilio, etc.
            logger_1.logger.info('[TriggerWorker] Sending SMS', {
                userId: payload.userId,
                title: payload.title,
            });
            // Example integration:
            // await msg91.send({
            //   to: await getUserPhone(payload.userId),
            //   message: `${payload.title}\n\n${payload.body}`,
            // });
            return true;
        }
        catch (error) {
            logger_1.logger.error('[TriggerWorker] SMS failed', {
                userId: payload.userId,
                error: error.message,
            });
            return false;
        }
    }
    // ── Email Handler ────────────────────────────────────────────────────────────
    async sendEmail(payload) {
        try {
            // Integration with email service like SendGrid, Mailgun, etc.
            logger_1.logger.info('[TriggerWorker] Sending email', {
                userId: payload.userId,
                title: payload.title,
            });
            // Example integration:
            // await sendgrid.send({
            //   to: await getUserEmail(payload.userId),
            //   subject: payload.title,
            //   html: `<p>${payload.body}</p>`,
            // });
            return true;
        }
        catch (error) {
            logger_1.logger.error('[TriggerWorker] Email failed', {
                userId: payload.userId,
                error: error.message,
            });
            return false;
        }
    }
    // ── Start/Stop ─────────────────────────────────────────────────────────────
    start() {
        if (this.isRunning) {
            logger_1.logger.warn('[TriggerWorker] Already running');
            return;
        }
        this.isRunning = true;
        logger_1.logger.info('[TriggerWorker] Starting', { pollIntervalMs: this.pollIntervalMs });
        // Register notification channels
        this.manager.registerChannel('push', this.sendPushNotification.bind(this));
        this.manager.registerChannel('sms', this.sendSMS.bind(this));
        this.manager.registerChannel('email', this.sendEmail.bind(this));
        // Start polling
        this.intervalId = setInterval(() => {
            this.processEvents();
        }, this.pollIntervalMs);
        // Process immediately on start
        this.processEvents();
    }
    stop() {
        if (!this.isRunning)
            return;
        this.isRunning = false;
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
        logger_1.logger.info('[TriggerWorker] Stopped');
    }
    // ── Event Processing ────────────────────────────────────────────────────────
    async processEvents() {
        try {
            await this.manager.processQueue();
        }
        catch (error) {
            logger_1.logger.error('[TriggerWorker] Event processing error', {
                error: error.message,
            });
        }
    }
}
exports.TriggerWorker = TriggerWorker;
// ── Factory ────────────────────────────────────────────────────────────────────
let worker = null;
function startTriggerWorker(config) {
    if (worker) {
        worker.stop();
    }
    const manager = (0, eventTriggers_1.initializeEventTriggers)({
        bookingReminderHours: 24,
        coinExpiryDays: 7,
        engagementNudgeHours: 72,
        reviewRequestHours: 24,
    });
    worker = new TriggerWorker(manager, config);
    worker.start();
    logger_1.logger.info('[TriggerWorker] Worker started');
    return worker;
}
function stopTriggerWorker() {
    if (worker) {
        worker.stop();
        worker = null;
    }
}
function getTriggerWorker() {
    return worker;
}
exports.default = TriggerWorker;
//# sourceMappingURL=triggerWorker.js.map