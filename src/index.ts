import {
  createApp,
  createRouter,
  eventHandler,
  getRouterParams,
  getQuery,
  createError,
  toNodeListener,
} from 'h3';
import { createServer } from 'node:http';

const app = createApp();
const router = createRouter();
app.use(router);

const HN_API_BASE = process.env.HN_API_BASE || 'https://hacker-news.firebaseio.com/v0';

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
    const { type: storyType } = getRouterParams(event);
    const query = getQuery(event);
    const limit = query.limit ? parseInt(query.limit as string, 10) : 10;
    const validTypes = ['top', 'new', 'best', 'ask', 'show', 'job'];

    if (!validTypes.includes(storyType)) {
      throw createError({ statusCode: 400, statusMessage: `Invalid story type. Valid types: ${validTypes.join(', ')}` });
    }
    if (isNaN(limit) || limit < 1 || limit > 100) {
      throw createError({ statusCode: 400, statusMessage: 'Limit must be between 1 and 100' });
    }

    const idsRes = await fetch(`${HN_API_BASE}/${storyType}stories.json`);
    const ids = await idsRes.json() as number[];
    const stories = await Promise.all(
      ids.slice(0, limit).map(async (id) => {
        const res = await fetch(`${HN_API_BASE}/item/${id}.json`);
        return res.json();
      })
    );
    return { data: stories.filter(Boolean), timestamp: Date.now() };
  })
);

router.get(
  '/story/:id',
  eventHandler(async (event) => {
    const id = parseInt(getRouterParams(event).id, 10);
    if (isNaN(id)) throw createError({ statusCode: 400, statusMessage: 'Invalid story ID' });
    const story = await (await fetch(`${HN_API_BASE}/item/${id}.json`)).json();
    if (!story) throw createError({ statusCode: 404, statusMessage: 'Story not found' });
    return { data: story, timestamp: Date.now() };
  })
);

router.get(
  '/item/:id',
  eventHandler(async (event) => {
    const id = parseInt(getRouterParams(event).id, 10);
    if (isNaN(id)) throw createError({ statusCode: 400, statusMessage: 'Invalid item ID' });
    const item = await (await fetch(`${HN_API_BASE}/item/${id}.json`)).json();
    if (!item) throw createError({ statusCode: 404, statusMessage: 'Item not found' });
    return { data: item, timestamp: Date.now() };
  })
);

router.get(
  '/user/:id',
  eventHandler(async (event) => {
    const userId = getRouterParams(event).id;
    if (!userId) throw createError({ statusCode: 400, statusMessage: 'User ID is required' });
    const user = await (await fetch(`${HN_API_BASE}/user/${userId}.json`)).json();
    if (!user) throw createError({ statusCode: 404, statusMessage: 'User not found' });
    return { data: user, timestamp: Date.now() };
  })
);

const handler = toNodeListener(app);
export default function (req: any, res: any) { return handler(req, res); }

if (process.env.NODE_ENV !== 'production') {
  const port = parseInt(process.env.PORT || '3000', 10);
  createServer(toNodeListener(app)).listen(port, () => {
    console.log(`HN Proxy running at http://localhost:${port}`);
  });
}
