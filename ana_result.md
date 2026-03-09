# Hacker News Proxy — Project Analysis

## Overview

TypeScript-based serverless proxy for the Hacker News Firebase API. Deployed on Vercel. Zero runtime dependencies — uses only Node.js built-ins.

**Status**: Production-ready after a series of ESM/CJS compatibility fixes (all on 2026-03-09).

---

## Technology Stack

| Component | Technology |
|-----------|------------|
| Language | TypeScript 5.9.3 |
| Runtime | Node.js ≥18.0.0 |
| Deployment | Vercel (@vercel/node) |
| Module System | CommonJS (NodeNext) |
| Dependencies | None (dev-only: ts-node, @types/node) |

---

## Project Structure

```
hackernews_proxy/
├── src/
│   └── index.ts          # Main Vercel handler (active)
├── api/
│   └── index.ts          # Legacy Web API handler
├── dist/
│   ├── index.js          # Compiled output
│   └── index.d.ts        # Type declarations
├── package.json
├── tsconfig.json
├── vercel.json
├── CLAUDE.md
└── QWEN.md
```

**Note**: Old modular structure (`dist/handlers/`, `dist/services/`, `dist/types/`) and framework packages (`h3`, `srvx`, `rou3`) are deleted but not yet committed.

---

## Source Files

### `src/index.ts` — Active Handler

Plain `async function handler(req, res)` exported as default. Manual regex routing, no framework.

Endpoints:
| Method | Path | Description |
|--------|------|-------------|
| GET | `/` | Health check + endpoint list |
| GET | `/stories/:type` | Stories by type (top/new/best/ask/show/job), `?limit=1-100` |
| GET | `/story/:id` | Single story by ID |
| GET | `/item/:id` | Any item by ID |
| GET | `/user/:id` | User profile by ID |

Response format:
```json
{ "data": { ... }, "timestamp": 1234567890 }
{ "error": "message" }
```

HTTP codes: 200, 400, 404, 500.

### `api/index.ts` — Legacy Handler

Uses `Request`/`Response` (Web API). Routes prefixed with `/api/`. Includes OPTIONS CORS preflight. Functionally equivalent to `src/index.ts` but not referenced by `vercel.json`.

---

## Configuration

### `vercel.json`
```json
{
  "version": 2,
  "builds": [{ "src": "src/index.ts", "use": "@vercel/node" }],
  "routes": [{ "src": "/(.*)", "dest": "src/index.ts" }]
}
```
Vercel compiles TypeScript at deploy time. Catch-all routing to single handler.

### `tsconfig.json`
- `target`: ES2022
- `module`: NodeNext (emits CJS)
- `strict`: true
- `outDir`: `./dist`, `rootDir`: `./src`
- Source maps + declarations enabled

### `package.json` scripts
```
build  → tsc
dev    → ts-node src/index.ts
start  → node dist/index.js
clean  → rm -rf dist
```

---

## Git History (Recent)

| Commit | Message |
|--------|---------|
| 03ed6dc | fix: point Vercel at src/index.ts instead of dist/ |
| ca69d2b | fix: replace h3 with plain Node.js handler for Vercel compatibility |
| 4fe360c | fix: wrap h3 listener in plain function for Vercel export validation |
| 2ae3c58 | fix: downgrade h3 to v1 (CJS) to resolve ERR_REQUIRE_ESM |
| 22e0d38 | fix: resolve ERR_REQUIRE_ESM by switching to CommonJS output |

Root cause: h3 v2 is pure ESM, incompatible with Vercel's CJS-based `@vercel/node`. Resolution: dropped h3 entirely, rewrote as plain Node.js handler.

---

## Key Observations

**Strengths**
- Zero runtime dependencies — minimal cold start, easy to audit
- CORS enabled globally (suitable for browser clients)
- Parallel story fetching via `Promise.all()`
- TypeScript strict mode
- Vercel compiles TS at deploy — no stale dist/ issues

**Gaps / Risks**
- No caching — every request hits Firebase API directly
- No rate limiting — vulnerable to abuse
- No authentication — fully public
- No logging or monitoring
- `api/index.ts` is dead code (not wired in `vercel.json`)
- Deleted dist/handlers, dist/services, dist/types not yet committed — git status is dirty
- `CLAUDE.md` is untracked

---

## Deployment Readiness

| Check | Status |
|-------|--------|
| TypeScript compiles | ✅ |
| Vercel config correct | ✅ |
| No runtime deps | ✅ |
| CORS configured | ✅ |
| Error handling | ✅ |
| Caching | ❌ |
| Rate limiting | ❌ |
| Auth | ❌ |
| Monitoring | ❌ |
| Clean git state | ❌ |
