"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
const HN_API_BASE = process.env.HN_API_BASE || 'https://hacker-news.firebaseio.com/v0';
function sendJson(res, status, data) {
    const body = JSON.stringify(data);
    res.writeHead(status, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
    });
    res.end(body);
}
async function handler(req, res) {
    const url = new URL(req.url || '/', `http://${req.headers.host}`);
    const path = url.pathname;
    // GET /
    if (path === '/') {
        return sendJson(res, 200, {
            name: 'Hacker News Proxy',
            version: '1.0.0',
            endpoints: {
                'GET /stories/:type': 'top, new, best, ask, show, job',
                'GET /story/:id': 'Get a story by ID',
                'GET /item/:id': 'Get any item by ID',
                'GET /user/:id': 'Get user profile by ID',
            },
        });
    }
    // GET /stories/:type
    const storiesMatch = path.match(/^\/stories\/(top|new|best|ask|show|job)$/);
    if (storiesMatch) {
        const storyType = storiesMatch[1];
        const limit = Math.min(parseInt(url.searchParams.get('limit') || '10', 10), 100);
        if (isNaN(limit) || limit < 1)
            return sendJson(res, 400, { error: 'Limit must be between 1 and 100' });
        const ids = await (await fetch(`${HN_API_BASE}/${storyType}stories.json`)).json();
        const stories = await Promise.all(ids.slice(0, limit).map((id) => fetch(`${HN_API_BASE}/item/${id}.json`).then((r) => r.json())));
        return sendJson(res, 200, { data: stories.filter(Boolean), timestamp: Date.now() });
    }
    // GET /story/:id or /item/:id
    const itemMatch = path.match(/^\/(story|item)\/(\d+)$/);
    if (itemMatch) {
        const id = parseInt(itemMatch[2], 10);
        const item = await (await fetch(`${HN_API_BASE}/item/${id}.json`)).json();
        if (!item)
            return sendJson(res, 404, { error: 'Not found' });
        return sendJson(res, 200, { data: item, timestamp: Date.now() });
    }
    // GET /user/:id
    const userMatch = path.match(/^\/user\/([^/]+)$/);
    if (userMatch) {
        const user = await (await fetch(`${HN_API_BASE}/user/${userMatch[1]}.json`)).json();
        if (!user)
            return sendJson(res, 404, { error: 'User not found' });
        return sendJson(res, 200, { data: user, timestamp: Date.now() });
    }
    return sendJson(res, 404, { error: 'Not found' });
}
//# sourceMappingURL=index.js.map