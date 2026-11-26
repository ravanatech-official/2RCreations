# Security Summary

### Reviewed Files
- `firebase.json` (Firebase Hosting headers, caching, and rewrite rules)
- `server.ts` (Express production & dev server, API middleware, rate limiter, payment webhook, Gemini proxy)
- `firestore.rules` & `firebase-blueprint.json` (Firestore authorization and schema validation rules for `two-r-creations-db`)
- `src/services/leads.ts`, `src/services/marketplace.ts`, `src/firebase.ts`, `src/config.ts`, `src/config/features.ts`
- `src/components/ContactSection.tsx`, `src/components/FreeSampleLeadMagnet.tsx`, `src/components/PrivacyPreferenceCenter.tsx`
- `.dockerignore`, `Dockerfile`, `.env.example`, `.github/workflows/cloudrun-deploy.yml`, `.github/workflows/firebase-deploy.yml`, `bun.lock`

### Issues Resolved
| Area | Severity | What Was Wrong -> What Was Fixed |
| --- | --- | --- |
| Payment Webhook Authentication (`server.ts`) | High | `/api/v1/marketplace/webhooks/payment` previously checked only for header presence (`Boolean(signature)`). Now captures exact `rawBody` bytes in `express.json({ verify })` and enforces constant-time HMAC-SHA256 verification (`crypto.timingSafeEqual`) against `PAYMENT_WEBHOOK_SECRET`. |
| Content Security Policy & Browser Hardening (`firebase.json`, `server.ts`) | High | Production responses previously lacked a `Content-Security-Policy`, `X-Permitted-Cross-Domain-Policies`, `X-DNS-Prefetch-Control`, and `Origin-Agent-Cluster`. Added a strict production CSP (`default-src 'self'`, `object-src 'none'`, `base-uri 'self'`, `form-action 'self'`, `frame-ancestors 'self'`, `upgrade-insecure-requests`, strict Firebase/Google Fonts allowlists, no `'unsafe-eval'`) across both Firebase Hosting and Cloud Run Express. |
| Marketplace Order Price & Entitlement Integrity (`firestore.rules`) | High | Order creation validated only product existence without checking price or currency; entitlement updates did not enforce monotonic `downloadCount`. Added relational `get()` price/currency/published verification on `create`, immutable `amountCents`/`currency`/`licenseKey` constraints on `update`, full validation of all `previewImages[0..5]` indices, and monotonic `downloadCount >= existing().downloadCount`. |
| Unencrypted Client PII Draft Storage (`src/services/leads.ts`) | Medium | `submitLeadInquiry` persisted unencrypted client PII (`name`, `email`, `whatsapp`, `samplePhotosLink`, `message`) to `window.localStorage` (`2r_last_inquiry_draft`) before submission. Removed all PII writes to `localStorage` and actively purge any legacy `2r_last_inquiry_draft` entry. |
| API Rate Limiting & CSRF / Origin Enforcement (`server.ts`) | Medium | The in-memory `rateBuckets` map trusted raw `x-forwarded-for` headers and had no upper capacity cap, enabling memory growth under IP-spray attacks. Switched to Express-resolved `req.ip` (with `trust proxy: 1`), enforced a FIFO-bounded `MAX_TRACKED_IPS = 10_000` cap, added dedicated tighter limits for AI (`10/min`) and checkout (`15/min`), enforced `Content-Type: application/json` (`415`) and same-origin `Origin` checks (`403`) on browser state-changing `/api/*` calls, and added safe JSON syntax/size error handlers (`400`/`413`/`500`) to suppress stack trace leakage. |
| Lead & Privacy Input Validation (`firestore.rules`, `src/services/leads.ts`) | Medium | `email`, `createdAt`, `whatsapp`, and `samplePhotosLink` previously accepted overly permissive strings (`http://`, internal hosts/IPs, missing timestamp/email structure). Enforced strict email regex, ISO-8601 timestamp regex, strict public-TLD `https://` URL validation (rejecting `http://`, `localhost`, and IP literals), control/bidi character stripping, Data Subject `requestType` allowlist verification before Firestore writes, and a 5-second submission cooldown. |
| Docker Build Context Hygiene (`.dockerignore`) | Low | Excluded `dist-server`, key/certificate files (`*.pem`, `*.key`, `*service-account*.json`), debug logs, and workspace artifacts from Cloud Run container builds. |

### Safeguards Verified
| Safeguard | Status | How It Is Verified |
| --- | --- | --- |
| Secret Isolation & Key Hygiene | Verified | Zero private secrets (`GEMINI_API_KEY`, `PAYMENT_WEBHOOK_SECRET`, service accounts) appear in `src/`, `vite.config.ts`, `index.html`, or `.env.example`; `/api/health` no longer discloses whether server secrets are mounted. |
| XSS & Dangerous DOM Sink Protection | Verified | Codebase scan confirms zero occurrences of `dangerouslySetInnerHTML`, `eval`, `new Function`, `innerHTML`, `outerHTML`, or `document.write`; all `<a target="_blank">` links include `rel="noopener noreferrer"`; user text in rules and `leads.ts` strips `<` / `>` and control characters. |
| Default-Deny Firestore Access & Schema Enforcement | Verified | `firestore.rules` starts with global `allow read, write: if false;`; unauthenticated reads, updates, and deletes on `leads` and `data_requests` are strictly denied; every writable document validates exact key sets (`hasAll`/`hasOnly`), field types, string sizes, and server timestamp (`request.time`). |
| Dependency & Container Review | Verified | Executed `bun audit`; identified 2 advisories inside transitive `@grpc/grpc-js@1.9.16` (pulled exclusively by `@firebase/firestore` Node gRPC transport). Confirmed neither the browser Vite SPA bundle (uses Firestore WebChannel) nor `server.ts` (does not load `firebase/firestore`) invokes `@grpc/grpc-js`. Production Cloud Run image runs as unprivileged `USER node` with memory/CPU caps. |

---

## PoC Verification

### 1. Forged Payment Webhook Signature Bypass
- **Attack Input**:
  `POST /api/v1/marketplace/webhooks/payment` with headers `Content-Type: application/json`, `x-webhook-signature: any-nonempty-string`, and body `{"event":"payment.succeeded","orderId":"order_123"}`.
- **Trace Against Patched Code (`server.ts`)**:
  1. `/api` `express.json({ verify })` captures raw request payload bytes in `(req as RawBodyRequest).rawBody`.
  2. `requireMarketplaceEnabled` runs; once enabled, the route handler reads `x-webhook-signature` and calls `verifyWebhookHmacSignature(req.rawBody, signature, webhookSecret)`.
  3. `verifyWebhookHmacSignature` checks `secret.trim().length >= 16`, verifies `signature` (after optional `sha256=` prefix strip) matches `/^[a-fA-F0-9]{64}$/`, computes `crypto.createHmac('sha256', secret.trim()).update(rawBody).digest()`, and compares buffers with `crypto.timingSafeEqual`.
  4. Since `"any-nonempty-string"` fails hex validation (or fails `timingSafeEqual` for any spoofed 64-char hex digest), execution returns HTTP `401 {"error":"unauthorized_webhook"}`.

### 2. Cross-Origin State-Changing Request (CSRF) / Non-JSON Payload Attack
- **Attack Input**:
  Cross-site `<form method="POST" enctype="text/plain" action="https://two-r-creations-web-...run.app/api/v1/studio/ai-brief">` or `fetch(..., { method: 'POST', headers: { 'Origin': 'https://evil.example', 'Content-Type': 'application/json' } })`.
- **Trace Against Patched Code (`server.ts`)**:
  1. `requireJsonAndOrigin` middleware executes immediately after `express.json` on all `/api` routes.
  2. Plain HTML form submissions (`text/plain` or `application/x-www-form-urlencoded`) fail `req.is('application/json')` and immediately receive `415 {"error":"unsupported_media_type"}`.
  3. Cross-origin JSON requests carrying `Origin: https://evil.example` fail `ALLOWED_ORIGINS.has(origin)` and host comparison, immediately returning `403 {"error":"forbidden_origin"}`.

### 3. Internal Network / Loopback URL Injection & Malicious HTML Injection in Lead Inquiry
- **Attack Input**:
  Lead payload with `email: "bad<script>@x"`, `samplePhotosLink: "http://169.254.169.254/latest/meta-data/"`, `name: "Test\r\n<img src=x>"`.
- **Trace Against Patched Code (`src/services/leads.ts` & `firestore.rules`)**:
  1. Client-side `stripUnsafeChars` strips `<`, `>`, CR/LF, and control/bidi characters; `EMAIL_PATTERN` rejects `"badscript@x"`; `isSafeHttpsCloudUrl` rejects non-HTTPS URLs, raw IPv4/IPv6 literals, and `localhost`/single-label hosts before any network write occurs.
  2. If an attacker bypasses the browser client and sends the raw payload directly to Firestore (`POST` to `two-r-creations-db` `/leads/{leadId}`), `isValidLeadInquiry` fails `isSafeSingleLineText`, `isValidEmail`, and `isValidHttpsCloudUrl` (requires `https://` + alphabetic TLD and denies `<`, `>`, `\r`, `\n`), resulting in `PERMISSION_DENIED`.

### 4. Marketplace Underpayment Tampering & Entitlement Reset Attack
- **Attack Input**:
  Authenticated attacker attempts direct Firestore `create` on `/marketplace_orders/{orderId}` for a `$49.00` (`priceCents: 4900`, `currency: "USD"`) product with tampered `amountCents: 0` (or attempts `update` on `/marketplace_entitlements/{id}` to reset `downloadCount: 0` when `existing().downloadCount == 5`).
- **Trace Against Patched Code (`firestore.rules`)**:
  1. On order `create`, after static validation `isValidId` and `isValidMarketplaceOrder`, the rule inspects the authoritative product document via `get(/databases/$(database)/documents/marketplace_products/$(incoming().productId)).data` and requires `priceCents == incoming().amountCents`, `currency == incoming().currency`, and `isPublished == true`. Since `4900 != 0`, Firestore rejects with `PERMISSION_DENIED`.
  2. On entitlement `update`, non-admins fail `isAdmin()`, and even admin updates require `incoming().downloadCount >= existing().downloadCount` and `incoming().licenseKey == existing().licenseKey`, rejecting attempts to rewind download counts.

### 5. Unbounded Rate-Limiter IP Spray Memory Exhaustion & Header Spoofing
- **Attack Input**:
  Attacker sends bursts of `/api/*` requests with rotating forged `X-Forwarded-For: 1.2.3.x` headers and 20,000 simulated unique keys.
- **Trace Against Patched Code (`server.ts`)**:
  1. `apiRateLimiter` ignores raw client-supplied `x-forwarded-for` strings and relies exclusively on Express `req.ip` computed under `app.set('trust proxy', 1)` from the Cloud Run / Load Balancer hop.
  2. When `buckets.size >= MAX_TRACKED_IPS` (`10_000`), inserting a new bucket evicts the oldest entry via `buckets.keys().next().value`, bounding process heap memory inside Cloud Run's `256Mi` container limit.
