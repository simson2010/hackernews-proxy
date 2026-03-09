"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const h3_1 = require("h3");
const node_http_1 = require("node:http");
const router = (0, h3_1.createRouter)({
    onRequest: (event) => {
        (0, h3_1.handleCors)(event, {
            origin: '*',
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
            allowHeaders: ['Content-Type', 'Authorization'],
        });
    },
});
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
router.get('/stories/:type', (0, h3_1.eventHandler)(async (event) => {
    const params = (0, h3_1.getRouterParams)(event);
    const query = (0, h3_1.getQuery)(event);
    const storyType = params.type;
    const limit = query.limit ? parseInt(query.limit, 10) : 10;
    const validTypes = ['top', 'new', 'best', 'ask', 'show', 'job'];
    if (!validTypes.includes(storyType)) {
        throw (0, h3_1.createError)({ statusCode: 400, message: `Invalid story type. Valid types: ${validTypes.join(', ')}` });
    }
    if (isNaN(limit) || limit < 1 || limit > 100) {
        throw (0, h3_1.createError)({ statusCode: 400, message: 'Limit must be between 1 and 100' });
    }
    const HN_API_BASE = process.env.HN_API_BASE || 'https://hacker-news.firebaseio.com/v0';
    const idsResponse = await fetch(`${HN_API_BASE}/${storyType}stories.json`);
    const ids = await idsResponse.json();
    const stories = await Promise.all(ids.slice(0, limit).map(async (id) => {
        const res = await fetch(`${HN_API_BASE}/item/${id}.json`);
        return res.json();
    }));
    return { data: stories.filter((s) => s !== null), timestamp: Date.now() };
}));
router.get('/story/:id', (0, h3_1.eventHandler)(async (event) => {
    const params = (0, h3_1.getRouterParams)(event);
    const id = parseInt(params.id, 10);
    if (isNaN(id))
        throw (0, h3_1.createError)({ statusCode: 400, message: 'Invalid story ID' });
    const HN_API_BASE = process.env.HN_API_BASE || 'https://hacker-news.firebaseio.com/v0';
    const story = await (await fetch(`${HN_API_BASE}/item/${id}.json`)).json();
    if (!story)
        throw (0, h3_1.createError)({ statusCode: 404, message: 'Story not found' });
    return { data: story, timestamp: Date.now() };
}));
router.get('/item/:id', (0, h3_1.eventHandler)(async (event) => {
    const params = (0, h3_1.getRouterParams)(event);
    const id = parseInt(params.id, 10);
    if (isNaN(id))
        throw (0, h3_1.createError)({ statusCode: 400, message: 'Invalid item ID' });
    const HN_API_BASE = process.env.HN_API_BASE || 'https://hacker-news.firebaseio.com/v0';
    const item = await (await fetch(`${HN_API_BASE}/item/${id}.json`)).json();
    if (!item)
        throw (0, h3_1.createError)({ statusCode: 404, message: 'Item not found' });
    return { data: item, timestamp: Date.now() };
}));
router.get('/user/:id', (0, h3_1.eventHandler)(async (event) => {
    const params = (0, h3_1.getRouterParams)(event);
    const userId = params.id;
    if (!userId)
        throw (0, h3_1.createError)({ statusCode: 400, message: 'User ID is required' });
    const HN_API_BASE = process.env.HN_API_BASE || 'https://hacker-news.firebaseio.com/v0';
    const user = await (await fetch(`${HN_API_BASE}/user/${userId}.json`)).json();
    if (!user)
        throw (0, h3_1.createError)({ statusCode: 404, message: 'User not found' });
    return { data: user, timestamp: Date.now() };
}));
exports.default = router;
if (process.env.NODE_ENV !== 'production') {
    const port = parseInt(process.env.PORT || '3000', 10);
    const host = process.env.HOST || '0.0.0.0';
    const server = (0, node_http_1.createServer)((0, h3_1.toNodeListener)(router));
    server.listen(port, host, () => {
        console.log(`HN Proxy running at http://${host}:${port}`);
    });
}
//# sourceMappingURL=index.js.map