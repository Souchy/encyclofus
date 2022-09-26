import { IContainer, ILogger } from '@aurelia/kernel';
import { CustomElementDefinition, IPlatform, PartialCustomElementDefinition } from '@aurelia/runtime-html';
import { IRouteContext } from './route-context';
import { IRouterEvents, ManagedState, RoutingTrigger } from './router-events';
import { ILocationManager } from './location-manager';
import { RouteType } from './route';
import { IRouteViewModel } from './component-agent';
import { RouteTree, RouteNode } from './route-tree';
import { IViewportInstruction, NavigationInstruction, RouteContextLike, ViewportInstructionTree, Params } from './instructions';
import { UnwrapPromise } from './util';
import { RouteDefinition } from './route-definition';
import { ViewportAgent } from './viewport-agent';
export declare function isManagedState(state: {} | null): state is ManagedState;
export declare function toManagedState(state: {} | null, navId: number): ManagedState;
export declare type ResolutionMode = 'static' | 'dynamic';
export declare type HistoryStrategy = 'none' | 'replace' | 'push';
export declare type SameUrlStrategy = 'ignore' | 'reload';
export declare type ValueOrFunc<T extends string> = T | ((instructions: ViewportInstructionTree) => T);
export interface IRouterOptions extends Partial<RouterOptions> {
    /**
     * Set a custom routing root by setting this path.
     * When not set, path from the `document.baseURI` is used by default.
     */
    basePath?: string | null;
}
export declare class RouterOptions {
    readonly useUrlFragmentHash: boolean;
    readonly useHref: boolean;
    readonly resolutionMode: ResolutionMode;
    /**
     * The strategy to use for interacting with the browser's `history` object (if applicable).
     *
     * - `none`: do not interact with the `history` object at all.
     * - `replace`: replace the current state in history
     * - `push`: push a new state onto the history (default)
     * - A function that returns one of the 3 above values based on the navigation.
     *
     * Default: `push`
     */
    readonly historyStrategy: ValueOrFunc<HistoryStrategy>;
    /**
     * The strategy to use for when navigating to the same URL.
     *
     * - `ignore`: do nothing (default).
     * - `reload`: reload the current URL, effectively performing a refresh.
     * - A function that returns one of the 2 above values based on the navigation.
     *
     * Default: `ignore`
     */
    readonly sameUrlStrategy: ValueOrFunc<SameUrlStrategy>;
    /**
     * An optional handler to build the title.
     * When configured, the work of building the title string is completely handed over to this function.
     * If this function returns `null`, the title is not updated.
     */
    readonly buildTitle: ((transition: Transition) => string | null) | null;
    static get DEFAULT(): RouterOptions;
    protected constructor(useUrlFragmentHash: boolean, useHref: boolean, resolutionMode: ResolutionMode, 
    /**
     * The strategy to use for interacting with the browser's `history` object (if applicable).
     *
     * - `none`: do not interact with the `history` object at all.
     * - `replace`: replace the current state in history
     * - `push`: push a new state onto the history (default)
     * - A function that returns one of the 3 above values based on the navigation.
     *
     * Default: `push`
     */
    historyStrategy: ValueOrFunc<HistoryStrategy>, 
    /**
     * The strategy to use for when navigating to the same URL.
     *
     * - `ignore`: do nothing (default).
     * - `reload`: reload the current URL, effectively performing a refresh.
     * - A function that returns one of the 2 above values based on the navigation.
     *
     * Default: `ignore`
     */
    sameUrlStrategy: ValueOrFunc<SameUrlStrategy>, 
    /**
     * An optional handler to build the title.
     * When configured, the work of building the title string is completely handed over to this function.
     * If this function returns `null`, the title is not updated.
     */
    buildTitle: ((transition: Transition) => string | null) | null);
    static create(input: IRouterOptions): RouterOptions;
    protected stringifyProperties(): string;
    clone(): RouterOptions;
    toString(): string;
}
export interface INavigationOptions extends Partial<NavigationOptions> {
}
export declare class NavigationOptions extends RouterOptions {
    readonly title: string | ((node: RouteNode) => string | null) | null;
    readonly titleSeparator: string;
    /**
     * Specify a context to use for relative navigation.
     *
     * - `null` (or empty): navigate relative to the root (absolute navigation)
     * - `IRouteContext`: navigate relative to specifically this RouteContext (advanced users).
     * - `HTMLElement`: navigate relative to the routeable component (page) that directly or indirectly contains this element.
     * - `ICustomElementViewModel` (the `this` object when working from inside a view model): navigate relative to this component (if it was loaded as a route), or the routeable component (page) directly or indirectly containing it.
     * - `ICustomElementController`: same as `ICustomElementViewModel`, but using the controller object instead of the view model object (advanced users).
     */
    readonly context: RouteContextLike | null;
    /**
     * Specify an object to be serialized to a query string, and then set to the query string of the new URL.
     */
    readonly queryParams: Params | null;
    /**
     * Specify the hash fragment for the new URL.
     */
    readonly fragment: string;
    /**
     * Specify any kind of state to be stored together with the history entry for this navigation.
     */
    readonly state: Params | null;
    static get DEFAULT(): NavigationOptions;
    private constructor();
    static create(input: INavigationOptions): NavigationOptions;
    clone(): NavigationOptions;
    toString(): string;
}
export declare class Transition {
    readonly id: number;
    readonly prevInstructions: ViewportInstructionTree;
    readonly instructions: ViewportInstructionTree;
    finalInstructions: ViewportInstructionTree;
    readonly instructionsChanged: boolean;
    readonly trigger: RoutingTrigger;
    readonly options: NavigationOptions;
    readonly managedState: ManagedState | null;
    readonly previousRouteTree: RouteTree;
    routeTree: RouteTree;
    readonly promise: Promise<boolean> | null;
    readonly resolve: ((success: boolean) => void) | null;
    readonly reject: ((err: unknown) => void) | null;
    guardsResult: boolean | ViewportInstructionTree;
    error: unknown;
    private constructor();
    static create(input: Omit<Transition, 'run' | 'handleError'>): Transition;
    run<T>(cb: () => T, next: (value: UnwrapPromise<T>) => void): void;
    handleError(err: unknown): void;
    toString(): string;
}
export interface IRouter extends Router {
}
export declare const IRouter: import("@aurelia/kernel").InterfaceSymbol<IRouter>;
export declare class Router {
    private readonly container;
    private readonly p;
    private readonly logger;
    private readonly events;
    private readonly locationMgr;
    private _ctx;
    private get ctx();
    private _routeTree;
    get routeTree(): RouteTree;
    private _currentTr;
    private get currentTr();
    private set currentTr(value);
    options: RouterOptions;
    private navigated;
    private navigationId;
    private instructions;
    private nextTr;
    private locationChangeSubscription;
    private _isNavigating;
    get isNavigating(): boolean;
    constructor(container: IContainer, p: IPlatform, logger: ILogger, events: IRouterEvents, locationMgr: ILocationManager);
    /**
     * Get the closest RouteContext relative to the provided component, controller or node.
     *
     * @param context - The object from which to resolve the closest RouteContext.
     *
     * @returns when the value is:
     * - `null`: the root
     * - `IRouteContext`: the provided value (no-op)
     * - `HTMLElement`: the context of the routeable component (page) that directly or indirectly contains this element.
     * - `ICustomElementViewModel` (the `this` object when working from inside a view model): the context of this component (if it was loaded as a route), or the routeable component (page) directly or indirectly containing it.
     * - `ICustomElementController`: same as `ICustomElementViewModel`, but using the controller object instead of the view model object (advanced users).
     */
    resolveContext(context: RouteContextLike | null): IRouteContext;
    start(routerOptions: IRouterOptions, performInitialNavigation: boolean): void | Promise<boolean>;
    stop(): void;
    /**
     * Loads the provided path.
     *
     * Examples:
     *
     * ```ts
     * // Load the route 'product-detail', as a child of the current component, with child route '37'.
     * router.load('product-detail/37', { context: this });
     * ```
     */
    load(path: string, options?: INavigationOptions): Promise<boolean>;
    /**
     * Loads the provided paths as siblings.
     *
     * Examples:
     *
     * ```ts
     * router.load(['category/50/product/20', 'widget/30']);
     * ```
     */
    load(paths: readonly string[], options?: INavigationOptions): Promise<boolean>;
    /**
     * Loads the provided component type. Must be a custom element.
     *
     * Examples:
     *
     * ```ts
     * router.load(ProductList);
     * router.load(CustomElement.define({ name: 'greeter', template: 'Hello!' }));
     * ```
     */
    load(componentType: RouteType, options?: INavigationOptions): Promise<boolean>;
    /**
     * Loads the provided component types. Must be custom elements.
     *
     * Examples:
     *
     * ```ts
     * router.load([MemberList, OrganizationList]);
     * ```
     */
    load(componentTypes: readonly RouteType[], options?: INavigationOptions): Promise<boolean>;
    /**
     * Loads the provided component definition. May or may not be pre-compiled.
     *
     * Examples:
     *
     * ```ts
     * router.load({ name: 'greeter', template: 'Hello!' });
     * ```
     */
    load(componentDefinition: PartialCustomElementDefinition, options?: INavigationOptions): Promise<boolean>;
    /**
     * Loads the provided component instance.
     *
     * Examples:
     *
     * ```ts
     * // Given an already defined custom element named Greeter
     * const greeter = new Greeter();
     * Controller.$el(container, greeter, host);
     * router.load(greeter);
     * ```
     */
    load(componentInstance: IRouteViewModel, options?: INavigationOptions): Promise<boolean>;
    /**
     * Loads the provided ViewportInstruction, with component specified in any of the ways as described
     * in the other method overloads, and optional additional properties.
     *
     * Examples:
     *
     * ```ts
     * router.load({ component: 'product-detail', parameters: { id: 37 } })
     * router.load({ component: ProductDetail, parameters: { id: 37 } })
     * router.load({ component: 'category', children: ['product(id=20)'] })
     * router.load({ component: 'category', children: [{ component: 'product', parameters: { id: 20 } }] })
     * router.load({
     *   component: CustomElement.define({
     *     name: 'greeter',
     *     template: 'Hello, ${name}!'
     *   }, class {
     *     load(instruction) {
     *       this.name = instruction.parameters.name;
     *     }
     *   }),
     *   parameters: { name: 'John' }
     * })
     * ```
     */
    load(viewportInstruction: IViewportInstruction, options?: INavigationOptions): boolean | Promise<boolean>;
    load(instructionOrInstructions: NavigationInstruction | readonly NavigationInstruction[], options?: INavigationOptions): boolean | Promise<boolean>;
    isActive(instructionOrInstructions: NavigationInstruction | readonly NavigationInstruction[], context: RouteContextLike): boolean;
    private readonly vpaLookup;
    /**
     * Retrieve the RouteContext, which contains statically configured routes combined with the customElement metadata associated with a type.
     *
     * The customElement metadata is lazily associated with a type via the RouteContext the first time `getOrCreate` is called.
     *
     * @param viewportAgent - The ViewportAgent hosting the component associated with this RouteContext. If the RouteContext for the component+viewport combination already exists, the ViewportAgent will be updated in case it changed.
     * @param componentDefinition - The custom element definition.
     * @param container - The `controller.container` of the component hosting the viewport that the route will be loaded into.
     *
     */
    getRouteContext(viewportAgent: ViewportAgent | null, componentDefinition: CustomElementDefinition, componentInstance: IRouteViewModel | null, container: IContainer, parentDefinition: RouteDefinition | null): IRouteContext;
    createViewportInstructions(instructionOrInstructions: NavigationInstruction | readonly NavigationInstruction[], options?: INavigationOptions): ViewportInstructionTree;
    /**
     * Enqueue an instruction tree to be processed as soon as possible.
     *
     * Will wait for any existing in-flight transition to finish, otherwise starts immediately.
     *
     * @param instructions - The instruction tree that determines the transition
     * @param trigger - `'popstate'` or `'hashchange'` if initiated by a browser event, or `'api'` for manually initiated transitions via the `load` api.
     * @param state - The state to restore, if any.
     * @param failedTr - If this is a redirect / fallback from a failed transition, the previous transition is passed forward to ensure the original promise resolves with the latest result.
     */
    private enqueue;
    private run;
    private applyHistoryState;
    private getTitle;
    updateTitle(tr?: Transition): string;
    private cancelNavigation;
    private runNextTransition;
    private getNavigationOptions;
}
//# sourceMappingURL=router.d.ts.map