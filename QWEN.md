# Hacker News Proxy

## Project Overview

A **TypeScript-based proxy service** for the [Hacker News Firebase API](https://github.com/HackerNews/API). This proxy enables clients who cannot directly access the Firebase API to retrieve Hacker News stories through an intermediate server.

### Purpose
- Provide a public-facing API endpoint for Hacker News data
- Abstract away Firebase API complexity from clients
- Enable serverless deployment for cost-effective, scalable hosting
- Allow clients without Firebase access to consume HN data

### Architecture
```
┌─────────────┐      ┌─────────────────────┐      ┌──────────────────┐
│   Client    │ ───► │  HN Proxy (TS/SS)   │ ───► │  HN Firebase API │
│  (Browser)  │      │   (Serverless)      │      │   (hacker.news)  │
└─────────────┘      └─────────────────────┘      └──────────────────┘
```

## Technology Stack

| Component | Technology |
|-----------|------------|
| Language | TypeScript |
| Runtime | Node.js |
| Deployment | Serverless (Vercel, AWS Lambda, Cloudflare Workers, etc.) |
| Package Manager | npm / pnpm / yarn |

## Project Structure

```
hackernews_proxy/
├── src/
│   ├── index.ts           # Main entry point
│   ├── handlers/          # Request handlers
│   │   └── stories.ts     # Story-related endpoints
│   ├── services/          # Business logic
│   │   └── hnService.ts   # HN Firebase API client
│   └── types/             # TypeScript type definitions
├── tests/                 # Test files
├── package.json           # Dependencies & scripts
├── tsconfig.json          # TypeScript configuration
├── serverless.yml         # Serverless framework config (optional)
├── vercel.json            # Vercel deployment config (optional)
├── .env.example           # Environment variables template
└── README.md              # User-facing documentation
```

## Building and Running

### Initialization
```bash
npm init -y
npm install typescript @types/node ts-node --save-dev
npm install
```

### Development
```bash
# Compile TypeScript
npm run build

# Run in development mode
npm run dev

# Run production build
npm start
```

### Testing
```bash
npm test
```

### Deployment (Serverless)
```bash
# Vercel
vercel deploy

# AWS Lambda (via Serverless Framework)
serverless deploy

# Cloudflare Workers
wrangler deploy
```

## API Endpoints (Planned)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/stories/top` | Get top stories |
| GET | `/stories/new` | Get new stories |
| GET | `/stories/best` | Get best stories |
| GET | `/stories/ask` | Get Ask HN stories |
| GET | `/stories/show` | Get Show HN stories |
| GET | `/stories/job` | Get job postings |
| GET | `/story/:id` | Get story by ID |
| GET | `/item/:id` | Get any item by ID |

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port (local dev) | `3000` |
| `HN_API_BASE` | Hacker News API base URL | `https://hacker-news.firebaseio.com/v0` |
| `NODE_ENV` | Environment (`development`/`production`) | `development` |

## Development Conventions

### Code Style
- Use TypeScript strict mode
- Follow ESLint + Prettier configuration
- Use async/await for asynchronous operations
- Export types/interfaces for API responses

### Testing Practices
- Unit tests for service layer
- Integration tests for API endpoints
- Mock Firebase API responses in tests

### Commit Conventions
- Use conventional commits (`feat:`, `fix:`, `docs:`, etc.)
- Write descriptive commit messages

## Hacker News Firebase API Reference

The official API endpoints:
- `https://hacker-news.firebaseio.com/v0/topstories.json` - Top story IDs
- `https://hacker-news.firebaseio.com/v0/newstories.json` - New story IDs
- `https://hacker-news.firebaseio.com/v0/beststories.json` - Best story IDs
- `https://hacker-news.firebaseio.com/v0/askstories.json` - Ask HN IDs
- `https://hacker-news.firebaseio.com/v0/showstories.json` - Show HN IDs
- `https://hacker-news.firebaseio.com/v0/jobstories.json` - Job story IDs
- `https://hacker-news.firebaseio.com/v0/item/:id.json` - Item details
- `https://hacker-news.firebaseio.com/v0/user/:id.json` - User profile

## Next Steps

1. **Initialize the project**
   ```bash
   npm init -y
   npm install typescript @types/node ts-node --save-dev
   npx tsc --init
   ```

2. **Install runtime dependencies**
   ```bash
   npm install express cors  # Or h3 for serverless, or native fetch
   ```

3. **Create the basic structure**
   - `src/index.ts` - Entry point
   - `src/services/hnService.ts` - Firebase API client
   - `src/handlers/stories.ts` - Route handlers

4. **Implement core functionality**
   - Fetch top/new/best stories from Firebase API
   - Proxy item details endpoint
   - Add error handling

5. **Configure for serverless deployment**
   - Add `vercel.json` or `serverless.yml`
   - Test local serverless emulation

6. **Add tests and deploy**
