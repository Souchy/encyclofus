import { Constructable, ResourceType } from '@aurelia/kernel';
import { RouteableComponent } from './instructions';
import { RouteNode } from './route-tree';
/**
 * Either a `RouteableComponent` or a name/config that can be resolved to a one:
 * - `string`: a string representing the component name. Must be resolveable via DI from the context of the component relative to which the navigation occurs (specified in the `dependencies` array, `<import>`ed in the view, declared as an inline template, or registered globally)
 * - `IChildRouteConfig`: a standalone child route config object.
 * - `Routeable`: see `Routeable`.
 *
 * NOTE: differs from `NavigationInstruction` only in having `IChildRouteConfig` instead of `IViewportIntruction`
 * (which in turn are quite similar, but do have a few minor but important differences that make them non-interchangeable)
 * as well as `IRedirectRouteConfig`
 */
export declare type Routeable = string | IChildRouteConfig | IRedirectRouteConfig | RouteableComponent;
export interface IRouteConfig {
    /**
     * The id for this route, which can be used in the view for generating hrefs.
     */
    readonly id?: string | null;
    /**
     * The path to match against the url.
     *
     * If left blank, the path will be derived from the component's static `path` property (if it exists).
     */
    readonly path?: string | string[] | null;
    /**
     * The title to use for this route when matched.
     *
     * If left blank, this route will not contribute to the generated title.
     */
    readonly title?: string | ((node: RouteNode) => string | null) | null;
    /**
     * The path to which to redirect when the url matches the path in this config.
     *
     * If the path begins with a slash (`/`), the redirect path is considered absolute, otherwise it is considered relative to the parent path.
     */
    readonly redirectTo?: string | null;
    /**
     * Whether the `path` should be case sensitive.
     */
    readonly caseSensitive?: boolean;
    /**
     * How to behave when this component scheduled to be loaded again in the same viewport:
     *
     * - `replace`: completely removes the current component and creates a new one, behaving as if the component changed.
     * - `invoke-lifecycles`: calls `canUnload`, `canLoad`, `unload` and `load` (default if only the parameters have changed)
     * - `none`: does nothing (default if nothing has changed for the viewport)
     *
     * By default, calls the router lifecycle hooks only if the parameters have changed, otherwise does nothing.
     */
    readonly transitionPlan?: TransitionPlanOrFunc;
    /**
     * The name of the viewport this component should be loaded into.
     */
    readonly viewport?: string | null;
    /**
     * Any custom data that should be accessible to matched components or hooks.
     */
    readonly data?: Record<string, unknown>;
    /**
     * The child routes that can be navigated to from this route. See `Routeable` for more information.
     */
    readonly routes?: readonly Routeable[];
    /**
     * When set, will be used to redirect unknown/unconfigured routes to this route.
     * Can be a route-id, route-path (route), or a custom element name; this is also the resolution/fallback order.
     */
    readonly fallback?: string | null;
    /**
     * When set to `false`, the routes won't be included in the navigation model.
     *
     * @default true
     */
    readonly nav?: boolean;
}
export interface IChildRouteConfig extends IRouteConfig {
    /**
     * The component to load when this route is matched.
     */
    readonly component: Routeable;
}
export interface IRedirectRouteConfig extends Pick<IRouteConfig, 'caseSensitive' | 'redirectTo' | 'path'> {
}
export declare type TransitionPlan = 'none' | 'replace' | 'invoke-lifecycles';
export declare type TransitionPlanOrFunc = TransitionPlan | ((current: RouteNode, next: RouteNode) => TransitionPlan);
export declare function defaultReentryBehavior(current: RouteNode, next: RouteNode): TransitionPlan;
export declare class RouteConfig implements IRouteConfig, IChildRouteConfig {
    readonly id: string | null;
    readonly path: string | string[] | null;
    readonly title: string | ((node: RouteNode) => string | null) | null;
    readonly redirectTo: string | null;
    readonly caseSensitive: boolean;
    readonly transitionPlan: TransitionPlanOrFunc;
    readonly viewport: string | null;
    readonly data: Record<string, unknown>;
    readonly routes: readonly Routeable[];
    readonly fallback: string | null;
    readonly component: Routeable;
    readonly nav: boolean;
    protected constructor(id: string | null, path: string | string[] | null, title: string | ((node: RouteNode) => string | null) | null, redirectTo: string | null, caseSensitive: boolean, transitionPlan: TransitionPlanOrFunc, viewport: string | null, data: Record<string, unknown>, routes: readonly Routeable[], fallback: string | null, component: Routeable, nav: boolean);
    static create(configOrPath: IRouteConfig | IChildRouteConfig | string | string[], Type: RouteType | null): RouteConfig;
    /**
     * Creates a new route config applying the child route config.
     * Note that the current rote config is not mutated.
     */
    applyChildRouteConfig(config: IChildRouteConfig): RouteConfig;
}
export declare const Route: {
    name: string;
    /**
     * Returns `true` if the specified type has any static route configuration (either via static properties or a &#64;route decorator)
     */
    isConfigured(Type: RouteType): boolean;
    /**
     * Apply the specified configuration to the specified type, overwriting any existing configuration.
     */
    configure<T extends RouteType<Constructable<{}>>>(configOrPath: IRouteConfig | IChildRouteConfig | string | string[], Type: T): T;
    /**
     * Get the `RouteConfig` associated with the specified type, creating a new one if it does not yet exist.
     */
    getConfig(Type: RouteType): RouteConfig;
};
export declare type RouteType<T extends Constructable = Constructable> = ResourceType<T, InstanceType<T>, IRouteConfig>;
export declare type RouteDecorator = <T extends Constructable>(Type: T) => T;
/**
 * Associate a static route configuration with this type.
 *
 * @param config - The route config
 */
export declare function route(config: IRouteConfig): RouteDecorator;
/**
 * Associate a static route configuration with this type.
 *
 * @param path - The path to match against.
 *
 * (TODO: improve the formatting, better examples, etc)
 *
 * ```
 * &#64;route('home')
 * export class Home {}
 * ```
 *
 * ```
 * &#64;route(':id')
 * export class ProductDetail {}
 * ```
 */
export declare function route(path: string | string[]): RouteDecorator;
//# sourceMappingURL=route.d.ts.map