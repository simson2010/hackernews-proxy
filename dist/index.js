"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const h3_1 = require("h3");
// Create router (which is also the app in h3 v2)
const router = (0, h3_1.createRouter)({
    onRequest: (event) => {
        (0, h3_1.handleCors)(event, {
            origin: '*',
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
            allowHeaders: ['Content-Type', 'Authorization'],
        });
    },
});
// Health check endpoint
router.get('/', (0, h3_1.eventHandler)(() => ({
    name: 'Hacker News Proxy',
    version: '1.0.0',
    endpoints: {
        'GET /stories/:type': 'Get stories by type (top, new, best, ask, show, job)',
        'GET /story/:id': 'Get a story by ID',
        'GET /item/:id': 'Get any item by ID',
        'GET /user/:id': 'Get user profile by ID',
    },
})));
// Stories list endpoint
router.get('/stories/:type', (0, h3_1.eventHandler)(async (event) => {
    const params = (0, h3_1.getRouterParams)(event);
    const query = (0, h3_1.getQuery)(event);
    const storyType = params.type;
    const limit = query.limit ? parseInt(query.limit, 10) : 10;
    const validTypes = ['top', 'new', 'best', 'ask', 'show', 'job'];
    if (!validTypes.includes(storyType)) {
        throw (0, h3_1.createError)({
            statusCode: 400,
            message: `Invalid story type. Valid types: ${validTypes.join(', ')}`,
        });
    }
    if (isNaN(limit) || limit < 1 || limit > 100) {
        throw (0, h3_1.createError)({
            statusCode: 400,
            message: 'Limit must be between 1 and 100',
        });
    }
    const HN_API_BASE = process.env.HN_API_BASE || 'https://hacker-news.firebaseio.com/v0';
    // Fetch story IDs
    const idsResponse = await fetch(`${HN_API_BASE}/${storyType}stories.json`);
    const ids = await idsResponse.json();
    const limitedIds = ids.slice(0, limit);
    // Fetch story details
    const stories = await Promise.all(limitedIds.map(async (id) => {
        const res = await fetch(`${HN_API_BASE}/item/${id}.json`);
        return res.json();
    }));
    return {
        data: stories.filter((s) => s !== null),
        timestamp: Date.now(),
    };
}));
// Single story endpoint
router.get('/story/:id', (0, h3_1.eventHandler)(async (event) => {
    const params = (0, h3_1.getRouterParams)(event);
    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
        throw (0, h3_1.createError)({
            statusCode: 400,
            message: 'Invalid story ID',
        });
    }
    const HN_API_BASE = process.env.HN_API_BASE || 'https://hacker-news.firebaseio.com/v0';
    const response = await fetch(`${HN_API_BASE}/item/${id}.json`);
    const story = await response.json();
    if (!story) {
        throw (0, h3_1.createError)({
            statusCode: 404,
            message: 'Story not found',
        });
    }
    return {
        data: story,
        timestamp: Date.now(),
    };
}));
// Generic item endpoint
router.get('/item/:id', (0, h3_1.eventHandler)(async (event) => {
    const params = (0, h3_1.getRouterParams)(event);
    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
        throw (0, h3_1.createError)({
            statusCode: 400,
            message: 'Invalid item ID',
        });
    }
    const HN_API_BASE = process.env.HN_API_BASE || 'https://hacker-news.firebaseio.com/v0';
    const response = await fetch(`${HN_API_BASE}/item/${id}.json`);
    const item = await response.json();
    if (!item) {
        throw (0, h3_1.createError)({
            statusCode: 404,
            message: 'Item not found',
        });
    }
    return {
        data: item,
        timestamp: Date.now(),
    };
}));
// User endpoint
router.get('/user/:id', (0, h3_1.eventHandler)(async (event) => {
    const params = (0, h3_1.getRouterParams)(event);
    const userId = params.id;
    if (!userId) {
        throw (0, h3_1.createError)({
            statusCode: 400,
            message: 'User ID is required',
        });
    }
    const HN_API_BASE = process.env.HN_API_BASE || 'https://hacker-news.firebaseio.com/v0';
    const response = await fetch(`${HN_API_BASE}/user/${userId}.json`);
    const user = await response.json();
    if (!user) {
        throw (0, h3_1.createError)({
            statusCode: 404,
            message: 'User not found',
        });
    }
    return {
        data: user,
        timestamp: Date.now(),
    };
}));
// Export for serverless deployment
exports.default = router;
// Start server for local development
if (process.env.NODE_ENV !== 'production') {
    const port = parseInt(process.env.PORT || '3000', 10);
    Promise.resolve().then(() => __importStar(require('node:http'))).then(({ createServer }) => {
        const server = createServer((0, h3_1.toNodeListener)(router));
        server.listen(port, () => {
            console.log(`🚀 HN Proxy running at http://localhost:${port}`);
            console.log('Available endpoints:');
            console.log('  GET /                    - API info');
            console.log('  GET /stories/:type       - Get stories (top, new, best, ask, show, job)');
            console.log('  GET /story/:id           - Get story by ID');
            console.log('  GET /item/:id            - Get any item by ID');
            console.log('  GET /user/:id            - Get user profile');
        });
    });
}
//# sourceMappingURL=index.js.map