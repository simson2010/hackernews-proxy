import type { HNStory, HNUser, StoryListType } from '../types/hn';
/**
 * Service for interacting with the Hacker News Firebase API
 */
export declare class HNService {
    /**
     * Fetch a list of story IDs by type
     */
    getStoryIds(type: StoryListType): Promise<number[]>;
    /**
     * Fetch a single story/item by ID
     */
    getItem(id: number): Promise<HNStory | null>;
    /**
     * Fetch multiple stories by IDs
     */
    getItems(ids: number[], limit?: number): Promise<HNStory[]>;
    /**
     * Fetch top stories with details
     */
    getTopStories(limit?: number): Promise<HNStory[]>;
    /**
     * Fetch new stories with details
     */
    getNewStories(limit?: number): Promise<HNStory[]>;
    /**
     * Fetch best stories with details
     */
    getBestStories(limit?: number): Promise<HNStory[]>;
    /**
     * Fetch Ask HN stories with details
     */
    getAskStories(limit?: number): Promise<HNStory[]>;
    /**
     * Fetch Show HN stories with details
     */
    getShowStories(limit?: number): Promise<HNStory[]>;
    /**
     * Fetch job stories with details
     */
    getJobStories(limit?: number): Promise<HNStory[]>;
    /**
     * Fetch user profile by ID
     */
    getUser(id: string): Promise<HNUser | null>;
}
//# sourceMappingURL=hnService.d.ts.map