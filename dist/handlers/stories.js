"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userHandler = exports.itemHandler = exports.storyHandler = exports.storiesHandler = void 0;
const h3_1 = require("h3");
const hnService_1 = require("../services/hnService");
const hnService = new hnService_1.HNService();
/**
 * Handler for /stories/:type endpoint
 * Returns a list of stories by type (top, new, best, ask, show, job)
 */
exports.storiesHandler = (0, h3_1.eventHandler)(async (event) => {
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
    try {
        let stories;
        switch (storyType) {
            case 'top':
                stories = await hnService.getTopStories(limit);
                break;
            case 'new':
                stories = await hnService.getNewStories(limit);
                break;
            case 'best':
                stories = await hnService.getBestStories(limit);
                break;
            case 'ask':
                stories = await hnService.getAskStories(limit);
                break;
            case 'show':
                stories = await hnService.getShowStories(limit);
                break;
            case 'job':
                stories = await hnService.getJobStories(limit);
                break;
        }
        return {
            data: stories,
            timestamp: Date.now(),
        };
    }
    catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        throw (0, h3_1.createError)({
            statusCode: 500,
            message: `Failed to fetch stories: ${message}`,
            cause: error,
        });
    }
});
/**
 * Handler for /story/:id endpoint
 * Returns a single story by ID
 */
exports.storyHandler = (0, h3_1.eventHandler)(async (event) => {
    const params = (0, h3_1.getRouterParams)(event);
    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
        throw (0, h3_1.createError)({
            statusCode: 400,
            message: 'Invalid story ID',
        });
    }
    try {
        const story = await hnService.getItem(id);
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
    }
    catch (error) {
        if (error && typeof error === 'object' && 'statusCode' in error) {
            throw error;
        }
        const message = error instanceof Error ? error.message : 'Unknown error';
        throw (0, h3_1.createError)({
            statusCode: 500,
            message: `Failed to fetch story: ${message}`,
            cause: error,
        });
    }
});
/**
 * Handler for /item/:id endpoint
 * Returns any item (story, comment, job, poll) by ID
 */
exports.itemHandler = (0, h3_1.eventHandler)(async (event) => {
    const params = (0, h3_1.getRouterParams)(event);
    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
        throw (0, h3_1.createError)({
            statusCode: 400,
            message: 'Invalid item ID',
        });
    }
    try {
        const item = await hnService.getItem(id);
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
    }
    catch (error) {
        if (error && typeof error === 'object' && 'statusCode' in error) {
            throw error;
        }
        const message = error instanceof Error ? error.message : 'Unknown error';
        throw (0, h3_1.createError)({
            statusCode: 500,
            message: `Failed to fetch item: ${message}`,
            cause: error,
        });
    }
});
/**
 * Handler for /user/:id endpoint
 * Returns user profile by ID
 */
exports.userHandler = (0, h3_1.eventHandler)(async (event) => {
    const params = (0, h3_1.getRouterParams)(event);
    const userId = params.id;
    if (!userId) {
        throw (0, h3_1.createError)({
            statusCode: 400,
            message: 'User ID is required',
        });
    }
    try {
        const user = await hnService.getUser(userId);
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
    }
    catch (error) {
        if (error && typeof error === 'object' && 'statusCode' in error) {
            throw error;
        }
        const message = error instanceof Error ? error.message : 'Unknown error';
        throw (0, h3_1.createError)({
            statusCode: 500,
            message: `Failed to fetch user: ${message}`,
            cause: error,
        });
    }
});
//# sourceMappingURL=stories.js.map