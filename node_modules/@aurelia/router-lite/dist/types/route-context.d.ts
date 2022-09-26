import { IContainer, IModule } from '@aurelia/kernel';
import { RecognizedRoute } from '@aurelia/route-recognizer';
import { CustomElementDefinition, ICustomElementController, PartialCustomElementDefinition } from '@aurelia/runtime-html';
import { ComponentAgent, IRouteViewModel } from './component-agent';
import { NavigationInstruction, Params, ViewportInstruction } from './instructions';
import { IViewport } from './resources/viewport';
import { IChildRouteConfig, RouteType } from './route';
import { RouteDefinition } from './route-definition';
import { RouteNode } from './route-tree';
import { IRouter, ResolutionMode } from './router';
import { ViewportAgent, ViewportRequest } from './viewport-agent';
export interface IRouteContext extends RouteContext {
}
export declare const IRouteContext: import("@aurelia/kernel").InterfaceSymbol<IRouteContext>;
export declare const RESIDUE: "au$residue";
declare type PathGenerationResult = {
    vi: ViewportInstruction;
    query: Params | null;
};
export declare type EagerInstruction = {
    component: string | RouteDefinition | PartialCustomElementDefinition | IRouteViewModel | IChildRouteConfig | RouteType;
    params: Params;
};
export declare function isEagerInstruction(val: NavigationInstruction | EagerInstruction): val is EagerInstruction;
/**
 * Holds the information of a component in the context of a specific container.
 *
 * The `RouteContext` is cached using a 3-part composite key consisting of the CustomElementDefinition, the RouteDefinition and the RenderContext.
 *
 * This means there can be more than one `RouteContext` per component type if either:
 * - The `RouteDefinition` for a type is overridden manually via `Route.define`
 * - Different components (with different `RenderContext`s) reference the same component via a child route config
 */
export declare class RouteContext {
    readonly parent: IRouteContext | null;
    readonly component: CustomElementDefinition;
    readonly definition: RouteDefinition;
    readonly parentContainer: IContainer;
    private readonly _router;
    private readonly childViewportAgents;
    readonly root: IRouteContext;
    get isRoot(): boolean;
    /**
     * The path from the root RouteContext up to this one.
     */
    readonly path: readonly IRouteContext[];
    get depth(): number;
    /**
     * The stringified path from the root RouteContext up to this one, consisting of the component names they're associated with, separated by slashes.
     *
     * Mainly for debugging/introspection purposes.
     */
    readonly friendlyPath: string;
    /**
     * The (fully resolved) configured child routes of this context's `RouteDefinition`
     */
    readonly childRoutes: (RouteDefinition | Promise<RouteDefinition>)[];
    get resolved(): Promise<void> | null;
    get allResolved(): Promise<void> | null;
    private prevNode;
    get node(): RouteNode;
    set node(value: RouteNode);
    /**
     * The viewport hosting the component associated with this RouteContext.
     * The root RouteContext has no ViewportAgent and will throw when attempting to access this property.
     */
    get vpa(): ViewportAgent;
    readonly container: IContainer;
    private readonly moduleLoader;
    private readonly logger;
    private readonly hostControllerProvider;
    private readonly recognizer;
    private _childRoutesConfigured;
    private readonly _navigationModel;
    get navigationModel(): INavigationModel;
    constructor(viewportAgent: ViewportAgent | null, parent: IRouteContext | null, component: CustomElementDefinition, definition: RouteDefinition, parentContainer: IContainer, _router: IRouter);
    private processDefinition;
    /**
     * Create a new `RouteContext` and register it in the provided container.
     *
     * Uses the `RenderContext` of the registered `IAppRoot` as the root context.
     *
     * @param container - The container from which to resolve the `IAppRoot` and in which to register the `RouteContext`
     */
    static setRoot(container: IContainer): void;
    static resolve(root: IRouteContext, context: unknown): IRouteContext;
    dispose(): void;
    resolveViewportAgent(req: ViewportRequest): ViewportAgent;
    getAvailableViewportAgents(resolution: ResolutionMode): readonly ViewportAgent[];
    getFallbackViewportAgent(resolution: ResolutionMode, name: string): ViewportAgent | null;
    /**
     * Create a component based on the provided viewportInstruction.
     *
     * @param hostController - The `ICustomElementController` whose component (typically `au-viewport`) will host this component.
     * @param routeNode - The routeNode that describes the component + state.
     */
    createComponentAgent(hostController: ICustomElementController, routeNode: RouteNode): ComponentAgent;
    registerViewport(viewport: IViewport): ViewportAgent;
    unregisterViewport(viewport: IViewport): void;
    recognize(path: string, searchAncestor?: boolean): $RecognizedRoute | null;
    private addRoute;
    private $addRoute;
    resolveLazy(promise: Promise<IModule>): Promise<CustomElementDefinition> | CustomElementDefinition;
    generateViewportInstruction(instruction: {
        component: string;
        params: Params;
    }): PathGenerationResult | null;
    generateViewportInstruction(instruction: NavigationInstruction | EagerInstruction): PathGenerationResult | null;
    toString(): string;
    private printTree;
}
export declare class $RecognizedRoute {
    readonly route: RecognizedRoute<RouteDefinition | Promise<RouteDefinition>>;
    readonly residue: string | null;
    constructor(route: RecognizedRoute<RouteDefinition | Promise<RouteDefinition>>, residue: string | null);
    toString(): string;
}
export declare const INavigationModel: import("@aurelia/kernel").InterfaceSymbol<INavigationModel>;
export interface INavigationModel {
    /**
     * Collection of routes.
     */
    readonly routes: readonly INavigationRoute[];
    /**
     * Wait for async route configurations.
     */
    resolve(): Promise<void> | void;
}
export interface INavigationRoute {
    readonly id: string;
    readonly path: string[];
    readonly title: string | ((node: RouteNode) => string | null) | null;
    readonly data: Record<string, unknown>;
    readonly isActive: boolean;
}
export {};
//# sourceMappingURL=route-context.d.ts.map