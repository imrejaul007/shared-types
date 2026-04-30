// ── Logger for Chat Integration ──────────────────────────────────────────────────────
// Simple logger that can be replaced with your actual logger

const LOG_LEVELS = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
} as const;

const currentLevel = process.env.LOG_LEVEL as keyof typeof LOG_LEVELS || 'info';

function shouldLog(level: keyof typeof LOG_LEVELS): boolean {
  return LOG_LEVELS[level] <= LOG_LEVELS[currentLevel];
}

export const logger = {
  error: (message: string, meta?: Record<string, unknown>) => {
    if (shouldLog('error')) {
      console.error(`[ERROR] ${message}`, meta || '');
    }
  },

  warn: (message: string, meta?: Record<string, unknown>) => {
    if (shouldLog('warn')) {
      console.warn(`[WARN] ${message}`, meta || '');
    }
  },

  info: (message: string, meta?: Record<string, unknown>) => {
    if (shouldLog('info')) {
      console.log(`[INFO] ${message}`, meta || '');
    }
  },

  debug: (message: string, meta?: Record<string, unknown>) => {
    if (shouldLog('debug')) {
      console.log(`[DEBUG] ${message}`, meta || '');
    }
  },
};
