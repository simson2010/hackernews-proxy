// Vercel serverless function for Hacker News Proxy
const HN_API_BASE = 'https://hacker-news.firebaseio.com/v0';

function jsonResponse(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

function errorResponse(message: string, status = 500) {
  return jsonResponse({ error: message }, status);
}

export default async function handler(request: Request): Promise<Response> {
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  }

  const url = new URL(request.url);
  const path = url.pathname;
  const params = new URLSearchParams(url.search);

  try {
    // Health check
    if (path === '/api/' || path === '/api') {
      return jsonResponse({
        name: 'Hacker News Proxy',
        version: '1.0.0',
        endpoints: {
          'GET /api/stories/:type': 'Get stories by type (top, new, best, ask, show, job)',
          'GET /api/story/:id': 'Get a story by ID',
          'GET /api/item/:id': 'Get any item by ID',
          'GET /api/user/:id': 'Get user profile by ID',
        },
      });
    }

    // Stories: /api/stories/:type
    const storiesMatch = path.match(/^\/api\/stories\/(top|new|best|ask|show|job)$/);
    if (storiesMatch) {
      const storyType = storiesMatch[1];
      const limit = parseInt(params.get('limit') || '10', 10);

      if (isNaN(limit) || limit < 1 || limit > 100) {
        return errorResponse('Limit must be between 1 and 100', 400);
      }

      const idsResponse = await fetch(`${HN_API_BASE}/${storyType}stories.json`);
      const ids = await idsResponse.json() as number[];
      const limitedIds = ids.slice(0, limit);

      const stories = await Promise.all(
        limitedIds.map(async (id) => {
          const res = await fetch(`${HN_API_BASE}/item/${id}.json`);
          return res.json();
        })
      );

      return jsonResponse({
        data: stories.filter((s) => s !== null),
        timestamp: Date.now(),
      });
    }

    // Story: /api/story/:id
    const storyMatch = path.match(/^\/api\/story\/(\d+)$/);
    if (storyMatch) {
      const id = parseInt(storyMatch[1], 10);
      const response = await fetch(`${HN_API_BASE}/item/${id}.json`);
      const story = await response.json();

      if (!story) {
        return errorResponse('Story not found', 404);
      }

      return jsonResponse({
        data: story,
        timestamp: Date.now(),
      });
    }

    // Item: /api/item/:id
    const itemMatch = path.match(/^\/api\/item\/(\d+)$/);
    if (itemMatch) {
      const id = parseInt(itemMatch[1], 10);
      const response = await fetch(`${HN_API_BASE}/item/${id}.json`);
      const item = await response.json();

      if (!item) {
        return errorResponse('Item not found', 404);
      }

      return jsonResponse({
        data: item,
        timestamp: Date.now(),
      });
    }

    // User: /api/user/:id
    const userMatch = path.match(/^\/api\/user\/([^/]+)$/);
    if (userMatch) {
      const userId = userMatch[1];
      const response = await fetch(`${HN_API_BASE}/user/${userId}.json`);
      const user = await response.json();

      if (!user) {
        return errorResponse('User not found', 404);
      }

      return jsonResponse({
        data: user,
        timestamp: Date.now(),
      });
    }

    return errorResponse('Not Found', 404);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return errorResponse(message, 500);
  }
}
