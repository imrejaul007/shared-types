"use strict";
// ── ReZ Chat AI - Logger ─────────────────────────────────────────────────────────
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
class Logger {
    enableDebug = process.env.NODE_ENV !== 'production';
    log(level, message, context) {
        const entry = {
            timestamp: new Date().toISOString(),
            level,
            message,
            context,
        };
        const prefix = `[${entry.timestamp}] [${level.toUpperCase()}]`;
        switch (level) {
            case 'debug':
                if (this.enableDebug)
                    console.debug(prefix, message, context || '');
                break;
            case 'info':
                console.info(prefix, message, context || '');
                break;
            case 'warn':
                console.warn(prefix, message, context || '');
                break;
            case 'error':
                console.error(prefix, message, context || '');
                break;
        }
    }
    debug(message, context) {
        this.log('debug', message, context);
    }
    info(message, context) {
        this.log('info', message, context);
    }
    warn(message, context) {
        this.log('warn', message, context);
    }
    error(message, context) {
        this.log('error', message, context);
    }
}
exports.logger = new Logger();
exports.default = exports.logger;
//# sourceMappingURL=logger.js.map