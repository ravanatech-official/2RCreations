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

// Lightweight zero-cost in-memory sliding-window rate limiter for /api/*
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 60;
const rateBuckets = new Map<string, { count: number; resetAt: number }>();

function apiRateLimiter(req: Request, res: Response, next: NextFunction) {
  const clientIp = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.ip || 'unknown';
  const now = Date.now();
  const bucket = rateBuckets.get(clientIp);

  if (!bucket || now > bucket.resetAt) {
    rateBuckets.set(clientIp, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return next();
  }

  if (bucket.count >= RATE_LIMIT_MAX_REQUESTS) {
    res.setHeader('Retry-After', String(Math.ceil((bucket.resetAt - now) / 1000)));
    return res.status(429).json({
      error: 'rate_limit_exceeded',
      message: 'Too many requests. Please try again shortly.'
    });
  }

  bucket.count += 1;
  return next();
}

setInterval(() => {
  const now = Date.now();
  for (const [key, bucket] of rateBuckets.entries()) {
    if (now > bucket.resetAt) {
      rateBuckets.delete(key);
    }
  }
}, 5 * 60_000).unref();

function securityHeadersMiddleware(_req: Request, res: Response, next: NextFunction) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), interest-cohort=()');
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
  if (isProduction) {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  }
  next();
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

async function startServer() {
  const app = express();
  app.disable('x-powered-by');
  app.set('trust proxy', 1);

  // Request correlation ID & structured API logging
  app.use((req: Request, res: Response, next: NextFunction) => {
    const requestId = (req.headers['x-request-id'] as string) || crypto.randomUUID();
    res.setHeader('X-Request-Id', requestId);
    if (isProduction && req.path.startsWith('/api')) {
      const startedAt = Date.now();
      res.on('finish', () => {
        console.log(
          JSON.stringify({
            severity: res.statusCode >= 500 ? 'ERROR' : 'INFO',
            requestId,
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
  app.use('/api', express.json({ limit: '100kb' }), apiRateLimiter);

  // 1. Health & Readiness Probe (Google Cloud Run)
  app.get('/api/health', (_req: Request, res: Response) => {
    res.status(200).json({
      status: 'ok',
      service: '2rcreations-studio',
      environment: isProduction ? 'production' : 'development',
      databaseId: DATABASE_ID,
      marketplaceEnabled: MARKETPLACE_ENABLED,
      geminiEnabled: GEMINI_ENABLED,
      geminiConfigured: Boolean(process.env.GEMINI_API_KEY?.trim()),
      timestamp: new Date().toISOString()
    });
  });

  // 2. Public Runtime Capabilities (Non-secret metadata only)
  app.get('/api/v1/studio/config', (_req: Request, res: Response) => {
    res.status(200).json({
      brand: '2R CREATIONS',
      databaseId: DATABASE_ID,
      marketplaceEnabled: MARKETPLACE_ENABLED,
      collectionPrefix: COLLECTION_PREFIX
    });
  });

  // 3. Server-Side Gemini Studio Layer (Secret Manager backed, gated until enabled)
  app.post('/api/v1/studio/ai-brief', async (req: Request, res: Response) => {
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
        message: 'GEMINI_API_KEY secret is not mounted on this runtime.'
      });
    }

    const { prompt } = (req.body || {}) as { prompt?: string };
    if (!prompt || typeof prompt !== 'string' || prompt.trim().length < 5 || prompt.length > 1500) {
      return res.status(400).json({
        error: 'invalid_prompt',
        message: 'Prompt must be between 5 and 1500 characters.'
      });
    }

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents: prompt.trim(),
        config: {
          systemInstruction:
            'You are a wedding album editorial director for 2R Creations. Provide concise, practical album pacing and layout suggestions in under 180 words.'
        }
      });
      return res.status(200).json({
        model: 'gemini-4-hydrogen',
        output: response.text ?? ''
      });
    } catch (error: any) {
      console.error('[Gemini Studio Error]:', error?.message || error);
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

  app.post('/api/v1/marketplace/checkout', requireMarketplaceEnabled, (req: Request, res: Response) => {
    const { productId, buyerEmail } = (req.body || {}) as { productId?: string; buyerEmail?: string };
    if (!productId || typeof productId !== 'string' || productId.length > 128) {
      return res.status(400).json({ error: 'invalid_product_id', message: 'Valid productId is required.' });
    }
    if (!buyerEmail || typeof buyerEmail !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(buyerEmail)) {
      return res.status(400).json({ error: 'invalid_email', message: 'Valid buyerEmail is required.' });
    }
    return res.status(501).json({
      error: 'payment_provider_not_configured',
      message: 'Configure payment gateway secret keys before accepting live checkout sessions.'
    });
  });

  app.post('/api/v1/marketplace/webhooks/payment', requireMarketplaceEnabled, (req: Request, res: Response) => {
    const signature = req.headers['x-webhook-signature'];
    if (!signature || !process.env.PAYMENT_WEBHOOK_SECRET) {
      return res.status(401).json({ error: 'unauthorized_webhook' });
    }
    return res.status(200).json({ received: true });
  });

  // Never let unknown /api/* fall through to SPA HTML
  app.all('/api/*', (_req: Request, res: Response) => {
    res.status(404).json({ error: 'not_found', message: 'API endpoint not found.' });
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
  console.error('[2R Creations Server] Fatal startup failure:', err);
  process.exit(1);
});
