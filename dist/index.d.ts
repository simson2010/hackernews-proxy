declare const router: {
    "~rou3": import("h3", { with: { "resolution-mode": "import" } }).RouterContext;
    request(request: import("srvx", { with: { "resolution-mode": "import" } }).ServerRequest | URL | string, options?: RequestInit, context?: import("h3", { with: { "resolution-mode": "import" } }).H3EventContext): Response | Promise<Response>;
    use(route: string, handler: import("h3", { with: { "resolution-mode": "import" } }).Middleware, opts?: import("h3", { with: { "resolution-mode": "import" } }).MiddlewareOptions): /*elided*/ any;
    use(handler: import("h3", { with: { "resolution-mode": "import" } }).Middleware, opts?: import("h3", { with: { "resolution-mode": "import" } }).MiddlewareOptions): /*elided*/ any;
    on(method: import("h3", { with: { "resolution-mode": "import" } }).HTTPMethod | Lowercase<import("h3", { with: { "resolution-mode": "import" } }).HTTPMethod> | "", route: string, handler: import("h3", { with: { "resolution-mode": "import" } }).HTTPHandler, opts?: import("h3", { with: { "resolution-mode": "import" } }).RouteOptions): /*elided*/ any;
    register(plugin: import("h3", { with: { "resolution-mode": "import" } }).H3Plugin): /*elided*/ any;
    mount(base: string, input: import("srvx", { with: { "resolution-mode": "import" } }).FetchHandler | {
        fetch: import("srvx", { with: { "resolution-mode": "import" } }).FetchHandler;
    } | /*elided*/ any): /*elided*/ any;
    all(route: string, handler: import("h3", { with: { "resolution-mode": "import" } }).HTTPHandler, opts?: import("h3", { with: { "resolution-mode": "import" } }).RouteOptions): /*elided*/ any;
    get(route: string, handler: import("h3", { with: { "resolution-mode": "import" } }).HTTPHandler, opts?: import("h3", { with: { "resolution-mode": "import" } }).RouteOptions): /*elided*/ any;
    post(route: string, handler: import("h3", { with: { "resolution-mode": "import" } }).HTTPHandler, opts?: import("h3", { with: { "resolution-mode": "import" } }).RouteOptions): /*elided*/ any;
    put(route: string, handler: import("h3", { with: { "resolution-mode": "import" } }).HTTPHandler, opts?: import("h3", { with: { "resolution-mode": "import" } }).RouteOptions): /*elided*/ any;
    delete(route: string, handler: import("h3", { with: { "resolution-mode": "import" } }).HTTPHandler, opts?: import("h3", { with: { "resolution-mode": "import" } }).RouteOptions): /*elided*/ any;
    patch(route: string, handler: import("h3", { with: { "resolution-mode": "import" } }).HTTPHandler, opts?: import("h3", { with: { "resolution-mode": "import" } }).RouteOptions): /*elided*/ any;
    head(route: string, handler: import("h3", { with: { "resolution-mode": "import" } }).HTTPHandler, opts?: import("h3", { with: { "resolution-mode": "import" } }).RouteOptions): /*elided*/ any;
    options(route: string, handler: import("h3", { with: { "resolution-mode": "import" } }).HTTPHandler, opts?: import("h3", { with: { "resolution-mode": "import" } }).RouteOptions): /*elided*/ any;
    connect(route: string, handler: import("h3", { with: { "resolution-mode": "import" } }).HTTPHandler, opts?: import("h3", { with: { "resolution-mode": "import" } }).RouteOptions): /*elided*/ any;
    trace(route: string, handler: import("h3", { with: { "resolution-mode": "import" } }).HTTPHandler, opts?: import("h3", { with: { "resolution-mode": "import" } }).RouteOptions): /*elided*/ any;
    readonly config: import("h3", { with: { "resolution-mode": "import" } }).H3Config;
    "~middleware": import("h3", { with: { "resolution-mode": "import" } }).Middleware[];
    "~routes": import("h3", { with: { "resolution-mode": "import" } }).H3Route[];
    fetch(_request: import("srvx", { with: { "resolution-mode": "import" } }).ServerRequest): Response | Promise<Response>;
    handler(event: import("h3", { with: { "resolution-mode": "import" } }).H3Event): unknown | Promise<unknown>;
    "~request"(request: import("srvx", { with: { "resolution-mode": "import" } }).ServerRequest, context?: import("h3", { with: { "resolution-mode": "import" } }).H3EventContext): Response | Promise<Response>;
    "~findRoute"(_event: import("h3", { with: { "resolution-mode": "import" } }).H3Event): import("h3", { with: { "resolution-mode": "import" } }).MatchedRoute<import("h3", { with: { "resolution-mode": "import" } }).H3Route> | void;
    "~getMiddleware"(event: import("h3", { with: { "resolution-mode": "import" } }).H3Event, route: import("h3", { with: { "resolution-mode": "import" } }).MatchedRoute<import("h3", { with: { "resolution-mode": "import" } }).H3Route> | undefined): import("h3", { with: { "resolution-mode": "import" } }).Middleware[];
    "~addRoute"(_route: import("h3", { with: { "resolution-mode": "import" } }).H3Route): void;
};
export default router;
//# sourceMappingURL=index.d.ts.map