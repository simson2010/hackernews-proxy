import { createRouter, eventHandler, handleCors, toNodeListener, getRouterParams, getQuery, createError } from 'h3';
import { createServer } from 'node:http';

const router = createRouter({
  onRequest: (event) => {
    handleCors(event, {
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowHeaders: ['Content-Type', 'Authorization'],
    });
  },
});

router.get(
  '/',
  eventHandler(() => ({
    name: 'Hacker News Proxy',
    version: '1.0.0',
    endpoints: {
      'GET /stories/:type': 'Get stories by type (top, new, best, ask, show, job)',
      'GET /story/:id': 'Get a story by ID',
      'GET /item/:id': 'Get any item by ID',
      'GET /user/:id': 'Get user profile by ID',
    },
  }))
);

router.get(
  '/stories/:type',
  eventHandler(async (event) => {
    const params = getRouterParams(event);
    const query = getQuery(event);
    const storyType = params.type as string;
    const limit = query.limit ? parseInt(query.limit as string, 10) : 10;
    const validTypes = ['top', 'new', 'best', 'ask', 'show', 'job'];

    if (!validTypes.includes(storyType)) {
      throw createError({ statusCode: 400, message: `Invalid story type. Valid types: ${validTypes.join(', ')}` });
    }
    if (isNaN(limit) || limit < 1 || limit > 100) {
      throw createError({ statusCode: 400, message: 'Limit must be between 1 and 100' });
    }

    const HN_API_BASE = process.env.HN_API_BASE || 'https://hacker-news.firebaseio.com/v0';
    const idsResponse = await fetch(`${HN_API_BASE}/${storyType}stories.json`);
    const ids = await idsResponse.json() as number[];
    const stories = await Promise.all(
      ids.slice(0, limit).map(async (id) => {
        const res = await fetch(`${HN_API_BASE}/item/${id}.json`);
        return res.json();
      })
    );
    return { data: stories.filter((s) => s !== null), timestamp: Date.now() };
  })
);

router.get(
  '/story/:id',
  eventHandler(async (event) => {
    const params = getRouterParams(event);
    const id = parseInt(params.id as string, 10);
    if (isNaN(id)) throw createError({ statusCode: 400, message: 'Invalid story ID' });

    const HN_API_BASE = process.env.HN_API_BASE || 'https://hacker-news.firebaseio.com/v0';
    const story = await (await fetch(`${HN_API_BASE}/item/${id}.json`)).json();
    if (!story) throw createError({ statusCode: 404, message: 'Story not found' });
    return { data: story, timestamp: Date.now() };
  })
);

router.get(
  '/item/:id',
  eventHandler(async (event) => {
    const params = getRouterParams(event);
    const id = parseInt(params.id as string, 10);
    if (isNaN(id)) throw createError({ statusCode: 400, message: 'Invalid item ID' });

    const HN_API_BASE = process.env.HN_API_BASE || 'https://hacker-news.firebaseio.com/v0';
    const item = await (await fetch(`${HN_API_BASE}/item/${id}.json`)).json();
    if (!item) throw createError({ statusCode: 404, message: 'Item not found' });
    return { data: item, timestamp: Date.now() };
  })
);

router.get(
  '/user/:id',
  eventHandler(async (event) => {
    const params = getRouterParams(event);
    const userId = params.id as string;
    if (!userId) throw createError({ statusCode: 400, message: 'User ID is required' });

    const HN_API_BASE = process.env.HN_API_BASE || 'https://hacker-news.firebaseio.com/v0';
    const user = await (await fetch(`${HN_API_BASE}/user/${userId}.json`)).json();
    if (!user) throw createError({ statusCode: 404, message: 'User not found' });
    return { data: user, timestamp: Date.now() };
  })
);

export default router;

if (process.env.NODE_ENV !== 'production') {
  const port = parseInt(process.env.PORT || '3000', 10);
  const host = process.env.HOST || '0.0.0.0';
  const server = createServer(toNodeListener(router));
  server.listen(port, host, () => {
    console.log(`HN Proxy running at http://${host}:${port}`);
  });
}
