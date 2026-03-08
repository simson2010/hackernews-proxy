/**
 * Hacker News Item types
 * @see https://github.com/HackerNews/API
 */
export interface HNStory {
    id: number;
    deleted?: boolean;
    type: 'story' | 'comment' | 'job' | 'poll' | 'pollopt';
    by: string;
    time: number;
    text?: string;
    dead?: boolean;
    parent?: number;
    poll?: number;
    kids?: number[];
    url?: string;
    score?: number;
    title?: string;
    parts?: number[];
    descendants?: number;
}
export interface HNUser {
    id: string;
    karma: number;
    about?: string;
    created: number;
    submitted?: number[];
}
export type StoryListType = 'top' | 'new' | 'best' | 'ask' | 'show' | 'job';
export interface ApiResponse<T> {
    data: T;
    timestamp: number;
}
export interface ApiError {
    error: string;
    message: string;
    statusCode: number;
}
//# sourceMappingURL=hn.d.ts.map