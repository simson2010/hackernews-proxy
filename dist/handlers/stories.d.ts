/**
 * Handler for /stories/:type endpoint
 * Returns a list of stories by type (top, new, best, ask, show, job)
 */
export declare const storiesHandler: import("h3").EventHandlerWithFetch<import("h3").EventHandlerRequest, Promise<{
    data: import("../types/hn").HNStory[];
    timestamp: number;
}>>;
/**
 * Handler for /story/:id endpoint
 * Returns a single story by ID
 */
export declare const storyHandler: import("h3").EventHandlerWithFetch<import("h3").EventHandlerRequest, Promise<{
    data: import("../types/hn").HNStory;
    timestamp: number;
}>>;
/**
 * Handler for /item/:id endpoint
 * Returns any item (story, comment, job, poll) by ID
 */
export declare const itemHandler: import("h3").EventHandlerWithFetch<import("h3").EventHandlerRequest, Promise<{
    data: import("../types/hn").HNStory;
    timestamp: number;
}>>;
/**
 * Handler for /user/:id endpoint
 * Returns user profile by ID
 */
export declare const userHandler: import("h3").EventHandlerWithFetch<import("h3").EventHandlerRequest, Promise<{
    data: import("../types/hn").HNUser;
    timestamp: number;
}>>;
//# sourceMappingURL=stories.d.ts.map