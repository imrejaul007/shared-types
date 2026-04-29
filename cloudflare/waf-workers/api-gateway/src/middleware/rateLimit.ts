/**
 * Rate Limiting — Per-IP request throttling
 * Uses Cloudflare KV for distributed rate limit state
 */

import type { Middleware } from 'itty-router';

interface RateLimitConfig {
  auth: number; // requests per minute
  api: number;
}

const RATE_LIMIT_KV = 'rate_limits';
const WINDOW_MS = 60 * 1000; // 1-minute window

/async function getRateLimitKV(env: Env): Promise<R2Bucket | null> {
  try {
    return env.RATE_LIMIT_KV as unknown as R2Bucket;
  } catch {
    return null;
  }
}

async function checkRateLimit(
  ip: string,
  endpoint: string,
  limit: number,
  kv: R2Bucket | null,
): Promise<{ allowed: boolean; remaining: number; resetAt: number }> {
  const now = Date.now();
  const windowStart = Math.floor(now / WINDOW_MS) * WINDOW_MS;
  const key = `rl:${ip}:${endpoint}:${windowStart}`;

  // Try KV store first (distributed)
  if (kv) {
    try {
      const existing = await kv.get(key, 'text');
      const count = existing ? parseInt(existing, 10) : 0;

      if (count >= limit) {
        return {
          allowed: false,
          remaining: 0,
          resetAt: windowStart + WINDOW_MS,
        };
      }

      await kv.put(key, String(count + 1), {
        expirationTtl: 120, // Expire after 2 minutes
      });

      return {
        allowed: true,
        remaining: Math.max(0, limit - count - 1),
        resetAt: windowStart + WINDOW_MS,
      };
    } catch {
      // KV unavailable — allow request but log
      console.warn('[RateLimit] KV unavailable, allowing request');
    }
  }

  // Fallback: allow (don't block on rate limiter failures)
  return { allowed: true, remaining: limit, resetAt: windowStart + WINDOW_MS };
}

export function withRateLimit(type: 'auth' | 'api'): Middleware {
  return async (request: Request, env: Env): Promise<Response | undefined> => {
    // Skip rate limit for health checks
    const url = new URL(request.url);
    if (url.pathname === '/health') {
      return undefined;
    }

    const ip = request.headers.get('CF-Connecting-IP') ||
               request.headers.get('X-Real-IP') ||
               'unknown';

    const config: RateLimitConfig = {
      auth: 10,
      api: 100,
    };

    const limit = config[type];
    const kv = await getRateLimitKV(env);
    const { allowed, remaining, resetAt } = await checkRateLimit(ip, type, limit, kv);

    const headers: Record<string, string> = {
      'X-RateLimit-Limit': String(limit),
      'X-RateLimit-Remaining': String(remaining),
      'X-RateLimit-Reset': String(resetAt),
    };

    if (!allowed) {
      const retryAfter = Math.ceil((resetAt - Date.now()) / 1000);
      headers['Retry-After'] = String(Math.max(1, retryAfter));

      console.warn('[RateLimit] Rate limit exceeded', { ip, type, limit });

      return new Response(JSON.stringify({
        error: 'Too Many Requests',
        message: `Rate limit exceeded. Try again in ${retryAfter} seconds.`,
        code: 'RATE_LIMIT_EXCEEDED',
        retryAfter,
      }), {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          ...headers,
          'Cache-Control': 'no-store',
        },
      });
    }

    // Add rate limit headers to response (intercept response)
    // Note: actual header injection happens in the proxy route
    (request as any).__rateLimitHeaders = headers;
    return undefined;
  };
}
