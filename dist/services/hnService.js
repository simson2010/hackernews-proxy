"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HNService = void 0;
const HN_API_BASE = process.env.HN_API_BASE || 'https://hacker-news.firebaseio.com/v0';
/**
 * Service for interacting with the Hacker News Firebase API
 */
class HNService {
    /**
     * Fetch a list of story IDs by type
     */
    async getStoryIds(type) {
        const endpoint = `${HN_API_BASE}/${type}stories.json`;
        const response = await fetch(endpoint);
        if (!response.ok) {
            throw new Error(`Failed to fetch ${type} stories: ${response.statusText}`);
        }
        const data = await response.json();
        return data || [];
    }
    /**
     * Fetch a single story/item by ID
     */
    async getItem(id) {
        const endpoint = `${HN_API_BASE}/item/${id}.json`;
        const response = await fetch(endpoint);
        if (!response.ok) {
            throw new Error(`Failed to fetch item ${id}: ${response.statusText}`);
        }
        const data = await response.json();
        return data;
    }
    /**
     * Fetch multiple stories by IDs
     */
    async getItems(ids, limit) {
        const limitedIds = limit ? ids.slice(0, limit) : ids;
        const promises = limitedIds.map(id => this.getItem(id));
        const results = await Promise.all(promises);
        // Filter out null results (deleted/dead items)
        return results.filter((story) => story !== null);
    }
    /**
     * Fetch top stories with details
     */
    async getTopStories(limit = 10) {
        const ids = await this.getStoryIds('top');
        return this.getItems(ids, limit);
    }
    /**
     * Fetch new stories with details
     */
    async getNewStories(limit = 10) {
        const ids = await this.getStoryIds('new');
        return this.getItems(ids, limit);
    }
    /**
     * Fetch best stories with details
     */
    async getBestStories(limit = 10) {
        const ids = await this.getStoryIds('best');
        return this.getItems(ids, limit);
    }
    /**
     * Fetch Ask HN stories with details
     */
    async getAskStories(limit = 10) {
        const ids = await this.getStoryIds('ask');
        return this.getItems(ids, limit);
    }
    /**
     * Fetch Show HN stories with details
     */
    async getShowStories(limit = 10) {
        const ids = await this.getStoryIds('show');
        return this.getItems(ids, limit);
    }
    /**
     * Fetch job stories with details
     */
    async getJobStories(limit = 10) {
        const ids = await this.getStoryIds('job');
        return this.getItems(ids, limit);
    }
    /**
     * Fetch user profile by ID
     */
    async getUser(id) {
        const endpoint = `${HN_API_BASE}/user/${id}.json`;
        const response = await fetch(endpoint);
        if (!response.ok) {
            throw new Error(`Failed to fetch user ${id}: ${response.statusText}`);
        }
        const data = await response.json();
        return data;
    }
}
exports.HNService = HNService;
//# sourceMappingURL=hnService.js.map