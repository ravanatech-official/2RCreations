import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import crypto from 'node:crypto';
import { GoogleGenAI } from '@google/genai';
import 'dotenv/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isProduction = process.env.NODE_ENV === 'production';
const PORT = Number(process.env.PORT) || 3000;
const HOST = '0.0.0.0';
const MARKETPLACE_ENABLED = process.env.ENABLE_MARKETPLACE === 'true';
const GEMINI_ENABLED = process.env.ENABLE_GEMINI_AI === 'true';
const DATABASE_ID = (process.env.VITE_FIREBASE_DATABASE_ID || 'two-r-creations-db').trim();
const COLLECTION_PREFIX = (process.env.VITE_FIRESTORE_COLLECTION_PREFIX || '').trim();

const DEFAULT_ALLOWED_ORIGINS = [
  'https://2rcreations.com',
  'https://www.2rcreations.com',
  'https://2rcreations.web.app',
  'https://2rcreations.firebaseapp.com'
];

function getAllowedOrigins(): Set<string> {
  const allowed = new Set<string>(DEFAULT_ALLOWED_ORIGINS);
  const configuredAppUrl = process.env.VITE_APP_URL?.trim();
  if (configuredAppUrl) {
    try {
      allowed.add(new URL(configuredAppUrl).origin);
    } catch {
      // Ignore malformed env URL
    }
  }
  const extraOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [];
  for (const raw of extraOrigins) {
    const trimmed = raw.trim();
    if (trimmed) {
      try {
        allowed.add(new URL(trimmed).origin);
      } catch {
        // Ignore malformed origin
      }
    }
  }
  if (!isProduction) {
    allowed.add(`http://localhost:${PORT}`);
    allowed.add(`http://127.0.0.1:${PORT}`);
    allowed.add('http://0.0.0.0:3000');
  }
  return allowed;
}

const ALLOWED_ORIGINS = getAllowedOrigins();

let geminiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) return null;
  if (!geminiClient) {
    geminiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });
  }
  return geminiClient;
}

// Memory-bounded sliding-window rate limiter keyed by Express-resolved client IP (trust proxy = 1)
interface RateBucket {
  count: number;
  resetAt: number;
}

const RATE_LIMIT_WINDOW_MS = 60_000;
const MAX_TRACKED_IPS = 10_000;

function createRateLimiter(maxRequests: number) {
  const buckets = new Map<string, RateBucket>();

  setInterval(() => {
    const now = Date.now();
    for (const [key, bucket] of buckets.entries()) {
      if (now > bucket.resetAt) {
        buckets.delete(key);
      }
    }
  }, 5 * 60_000).unref();

  return (req: Request, res: Response, next: NextFunction) => {
    const clientIp = req.ip || req.socket?.remoteAddress || 'unknown';
    const now = Date.now();
    const existing = buckets.get(clientIp);

    if (!existing || now > existing.resetAt) {
      if (!existing && buckets.size >= MAX_TRACKED_IPS) {
        // Evict oldest entry (FIFO order in Map) to guarantee bounded memory under IP-spray attacks
        const oldestKey = buckets.keys().next().value;
        if (oldestKey !== undefined) {
          buckets.delete(oldestKey);
        }
      }
      buckets.set(clientIp, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
      res.setHeader('X-RateLimit-Limit', String(maxRequests));
      res.setHeader('X-RateLimit-Remaining', String(maxRequests - 1));
      return next();
    }

    if (existing.count >= maxRequests) {
      res.setHeader('Retry-After', String(Math.max(1, Math.ceil((existing.resetAt - now) / 1000))));
      res.setHeader('X-RateLimit-Limit', String(maxRequests));
      res.setHeader('X-RateLimit-Remaining', '0');
      return res.status(429).json({
        error: 'rate_limit_exceeded',
        message: 'Too many requests. Please try again shortly.'
      });
    }

    existing.count += 1;
    res.setHeader('X-RateLimit-Limit', String(maxRequests));
    res.setHeader('X-RateLimit-Remaining', String(Math.max(0, maxRequests - existing.count)));
    return next();
  };
}

const apiRateLimiter = createRateLimiter(60);
const aiBriefRateLimiter = createRateLimiter(10);
const checkoutRateLimiter = createRateLimiter(15);

const PRODUCTION_CSP = [
  "default-src 'self'",
  "script-src 'self' https://www.googletagmanager.com https://apis.google.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com data:",
  "img-src 'self' data: blob: https://www.google-analytics.com https://www.googletagmanager.com",
  "media-src 'self' blob:",
  "connect-src 'self' https://*.googleapis.com https://firestore.googleapis.com https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://firebase.googleapis.com https://firebaseinstallations.googleapis.com https://www.google-analytics.com https://analytics.google.com https://*.google-analytics.com https://*.cloudfunctions.net",
  "frame-src 'self' https://*.firebaseapp.com https://accounts.google.com",
  "worker-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
  'upgrade-insecure-requests'
].join('; ');

const DEV_CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://apis.google.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com data:",
  "img-src 'self' data: blob: https://www.google-analytics.com https://www.googletagmanager.com",
  "media-src 'self' blob:",
  "connect-src 'self' ws: wss: https://*.googleapis.com https://firestore.googleapis.com https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://firebase.googleapis.com https://firebaseinstallations.googleapis.com https://www.google-analytics.com https://analytics.google.com https://*.google-analytics.com",
  "worker-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'"
].join('; ');

function securityHeadersMiddleware(_req: Request, res: Response, next: NextFunction) {
  res.setHeader('Content-Security-Policy', isProduction ? PRODUCTION_CSP : DEV_CSP);
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), interest-cohort=(), payment=(), usb=()');
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
  res.setHeader('X-Permitted-Cross-Domain-Policies', 'none');
  res.setHeader('X-DNS-Prefetch-Control', 'off');
  res.setHeader('Origin-Agent-Cluster', '?1');
  if (isProduction) {
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  }
  next();
}

function requireJsonAndOrigin(req: Request, res: Response, next: NextFunction) {
  if (!['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
    return next();
  }

  if (!req.is('application/json')) {
    return res.status(415).json({
      error: 'unsupported_media_type',
      message: 'Content-Type must be application/json.'
    });
  }

  // Server-to-server webhook authenticates via HMAC signature instead of browser Origin
  if (req.path === '/v1/marketplace/webhooks/payment') {
    return next();
  }

  const origin = req.headers.origin;
  if (origin) {
    const requestHost = req.get('host');
    let originAllowed = ALLOWED_ORIGINS.has(origin);
    if (!originAllowed && requestHost) {
      try {
        originAllowed = new URL(origin).host === requestHost;
      } catch {
        originAllowed = false;
      }
    }
    if (!originAllowed) {
      return res.status(403).json({
        error: 'forbidden_origin',
        message: 'Cross-origin state-changing request rejected.'
      });
    }
  }

  return next();
}

function verifyWebhookHmacSignature(rawBody: Buffer | undefined, signatureHeader: string | undefined, secret: string): boolean {
  if (!rawBody || rawBody.length === 0 || !signatureHeader || secret.trim().length < 16) {
    return false;
  }

  const normalizedSig = signatureHeader.trim().replace(/^sha256=/i, '');
  if (!/^[a-fA-F0-9]{64}$/.test(normalizedSig)) {
    return false;
  }

  const expectedDigest = crypto.createHmac('sha256', secret.trim()).update(rawBody).digest();
  const providedDigest = Buffer.from(normalizedSig, 'hex');

  if (expectedDigest.length !== providedDigest.length) {
    return false;
  }

  return crypto.timingSafeEqual(expectedDigest, providedDigest);
}

function requireMarketplaceEnabled(_req: Request, res: Response, next: NextFunction) {
  if (!MARKETPLACE_ENABLED) {
    return res.status(503).json({
      enabled: false,
      error: 'marketplace_disabled',
      message: 'Marketplace layer is provisioned and standby; frontend activation is currently disabled.'
    });
  }
  next();
}

interface RawBodyRequest extends Request {
  rawBody?: Buffer;
}

async function startServer() {
  const app = express();
  app.disable('x-powered-by');
  app.set('trust proxy', 1);

  // Request correlation ID & structured API logging
  app.use((req: Request, res: Response, next: NextFunction) => {
    const incomingId = req.headers['x-request-id'];
    const safeRequestId =
      typeof incomingId === 'string' && /^[a-zA-Z0-9_-]{8,64}$/.test(incomingId)
        ? incomingId
        : crypto.randomUUID();
    res.setHeader('X-Request-Id', safeRequestId);
    if (isProduction && req.path.startsWith('/api')) {
      const startedAt = Date.now();
      res.on('finish', () => {
        console.log(
          JSON.stringify({
            severity: res.statusCode >= 500 ? 'ERROR' : 'INFO',
            requestId: safeRequestId,
            method: req.method,
            path: req.path,
            status: res.statusCode,
            latencyMs: Date.now() - startedAt
          })
        );
      });
    }
    next();
  });

  app.use(securityHeadersMiddleware);
  app.use(
    '/api',
    apiRateLimiter,
    express.json({
      limit: '64kb',
      verify: (req, _res, buf) => {
        (req as RawBodyRequest).rawBody = buf;
      }
    }),
    requireJsonAndOrigin
  );

  // 1. Health & Readiness Probe (Google Cloud Run)
  app.get('/api/health', (_req: Request, res: Response) => {
    res.setHeader('Cache-Control', 'no-store');
    res.status(200).json({
      status: 'ok',
      service: '2rcreations-studio',
      environment: isProduction ? 'production' : 'development',
      databaseId: DATABASE_ID,
      marketplaceEnabled: MARKETPLACE_ENABLED,
      geminiEnabled: GEMINI_ENABLED,
      timestamp: new Date().toISOString()
    });
  });

  // 2. Public Runtime Capabilities (Non-secret metadata only)
  app.get('/api/v1/studio/config', (_req: Request, res: Response) => {
    res.setHeader('Cache-Control', 'no-store');
    res.status(200).json({
      brand: '2R CREATIONS',
      databaseId: DATABASE_ID,
      marketplaceEnabled: MARKETPLACE_ENABLED,
      collectionPrefix: COLLECTION_PREFIX
    });
  });

  // 3. Server-Side Gemini Studio Layer (Secret Manager backed, gated until enabled)
  app.post('/api/v1/studio/ai-brief', aiBriefRateLimiter, async (req: Request, res: Response) => {
    if (!GEMINI_ENABLED) {
      return res.status(503).json({
        enabled: false,
        error: 'gemini_standby',
        message: 'Server-side Gemini studio layer is wired and in zero-cost standby mode.'
      });
    }

    const ai = getGeminiClient();
    if (!ai) {
      return res.status(503).json({
        error: 'gemini_key_missing',
        message: 'Studio AI service is temporarily unavailable.'
      });
    }

    const { prompt } = (req.body || {}) as { prompt?: unknown };
    if (typeof prompt !== 'string') {
      return res.status(400).json({
        error: 'invalid_prompt',
        message: 'Prompt must be a valid text string.'
      });
    }

    const sanitizedPrompt = prompt.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '').trim();
    if (sanitizedPrompt.length < 5 || sanitizedPrompt.length > 1500) {
      return res.status(400).json({
        error: 'invalid_prompt',
        message: 'Prompt must be between 5 and 1500 characters.'
      });
    }

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents: sanitizedPrompt,
        config: {
          systemInstruction:
            'You are a wedding album editorial director for 2R Creations. Provide concise, practical album pacing and layout suggestions in under 180 words.'
        }
      });
      return res.status(200).json({
        model: 'gemini-4-hydrogen',
        output: response.text ?? ''
      });
    } catch (error: unknown) {
      console.error('[Gemini Studio Error]:', error instanceof Error ? error.message : 'upstream_error');
      return res.status(502).json({
        error: 'gemini_upstream_error',
        message: 'Unable to process AI request at this time.'
      });
    }
  });

  // 4. Marketplace Backend Layer (Standby / Hidden on Frontend until activated)
  app.get('/api/v1/marketplace/products', requireMarketplaceEnabled, (_req: Request, res: Response) => {
    res.status(200).json({
      enabled: true,
      databaseId: DATABASE_ID,
      collection: `${COLLECTION_PREFIX}marketplace_products`,
      items: []
    });
  });

  app.post('/api/v1/marketplace/checkout', checkoutRateLimiter, requireMarketplaceEnabled, (req: Request, res: Response) => {
    const { productId, buyerEmail } = (req.body || {}) as { productId?: unknown; buyerEmail?: unknown };
    if (typeof productId !== 'string' || !/^[a-zA-Z0-9_-]{1,128}$/.test(productId)) {
      return res.status(400).json({ error: 'invalid_product_id', message: 'Valid productId is required.' });
    }
    if (
      typeof buyerEmail !== 'string' ||
      buyerEmail.length < 5 ||
      buyerEmail.length > 200 ||
      !/^[^\s@<>()[\]\\,;:"']+@[^\s@]+\.[^\s@]{2,}$/.test(buyerEmail)
    ) {
      return res.status(400).json({ error: 'invalid_email', message: 'Valid buyerEmail is required.' });
    }
    return res.status(501).json({
      error: 'payment_provider_not_configured',
      message: 'Configure payment gateway secret keys before accepting live checkout sessions.'
    });
  });

  app.post('/api/v1/marketplace/webhooks/payment', requireMarketplaceEnabled, (req: RawBodyRequest, res: Response) => {
    const webhookSecret = process.env.PAYMENT_WEBHOOK_SECRET || '';
    const signatureHeader = req.headers['x-webhook-signature'];
    const signature = Array.isArray(signatureHeader) ? signatureHeader[0] : signatureHeader;

    if (!verifyWebhookHmacSignature(req.rawBody, signature, webhookSecret)) {
      return res.status(401).json({ error: 'unauthorized_webhook' });
    }

    return res.status(200).json({ received: true });
  });

  // Never let unknown /api/* fall through to SPA HTML
  app.all('/api/*', (_req: Request, res: Response) => {
    res.status(404).json({ error: 'not_found', message: 'API endpoint not found.' });
  });

  // Malformed JSON & opaque API error handler (prevents stack trace leakage)
  app.use('/api', (err: any, _req: Request, res: Response, _next: NextFunction) => {
    if (err instanceof SyntaxError && 'body' in err) {
      return res.status(400).json({ error: 'invalid_json', message: 'Malformed JSON request body.' });
    }
    if (err?.type === 'entity.too.large') {
      return res.status(413).json({ error: 'payload_too_large', message: 'Request payload exceeds 64kb limit.' });
    }
    console.error('[API Error]:', err instanceof Error ? err.message : 'unexpected_error');
    return res.status(500).json({ error: 'internal_error', message: 'Internal server error.' });
  });

  // Static / Vite Integration
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const localDist = path.resolve(__dirname, 'dist');
    const distDir = fs.existsSync(localDist) ? localDist : path.resolve(process.cwd(), 'dist');
    const indexHtml = path.join(distDir, 'index.html');

    app.use(
      '/assets',
      express.static(path.join(distDir, 'assets'), {
        maxAge: '30d',
        etag: true
      })
    );
    app.use(
      '/albums',
      express.static(path.join(distDir, 'albums'), {
        maxAge: '30d',
        etag: true
      })
    );
    app.use(
      express.static(distDir, {
        index: false,
        extensions: ['html'],
        maxAge: '1d'
      })
    );

    app.get('*', (_req: Request, res: Response) => {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      if (fs.existsSync(indexHtml)) {
        res.sendFile(indexHtml);
      } else {
        res.status(404).send('Production bundle missing. Run npm run build first.');
      }
    });
  }

  const server = app.listen(PORT, HOST, () => {
    console.log(`[2R Creations Server] Listening on http://${HOST}:${PORT} (${isProduction ? 'production' : 'dev'})`);
  });

  // Graceful shutdown for Google Cloud Run SIGTERM
  const shutdown = (signal: string) => {
    console.log(`[2R Creations Server] Received ${signal}, draining connections...`);
    server.close(() => process.exit(0));
    setTimeout(() => process.exit(1), 8000).unref();
  };
  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

startServer().catch((err) => {
  console.error('[2R Creations Server] Fatal startup failure:', err instanceof Error ? err.message : err);
  process.exit(1);
});
