import { IContainer, IModule } from '@aurelia/kernel';
import { CustomElementDefinition } from '@aurelia/runtime-html';
import { RouteConfig, IChildRouteConfig, type Routeable } from './route';
import { IRouteContext } from './route-context';
import { RouteNode } from './route-tree';
export declare const defaultViewportName = "default";
export declare class RouteDefinition {
    readonly config: RouteConfig;
    readonly component: CustomElementDefinition | null;
    readonly hasExplicitPath: boolean;
    readonly caseSensitive: boolean;
    readonly path: string[];
    readonly redirectTo: string | null;
    readonly viewport: string;
    readonly id: string;
    readonly data: Record<string, unknown>;
    readonly fallback: string | null;
    constructor(config: RouteConfig, component: CustomElementDefinition | null, parentDefinition: RouteDefinition | null);
    static resolve(routeable: Promise<IModule>, parentDefinition: RouteDefinition | null, routeNode: RouteNode | null, context: IRouteContext): RouteDefinition | Promise<RouteDefinition>;
    static resolve(routeable: string | IChildRouteConfig, parentDefinition: RouteDefinition | null, routeNode: RouteNode | null, context: IRouteContext): RouteDefinition;
    static resolve(routeable: string | IChildRouteConfig | Promise<IModule>, parentDefinition: RouteDefinition | null, routeNode: RouteNode | null): never;
    static resolve(routeable: Exclude<Routeable, Promise<IModule> | string | IChildRouteConfig>, parentDefinition: RouteDefinition | null, routeNode: RouteNode | null): RouteDefinition;
    static resolve(routeable: Routeable, parentDefinition: RouteDefinition | null, routeNode: RouteNode | null, context: IRouteContext): RouteDefinition | Promise<RouteDefinition>;
    private static createNavigationInstruction;
    register(container: IContainer): void;
    toString(): string;
}
export declare const $RouteDefinition: {
    name: string;
    /**
     * Returns `true` if the `def` has a route definition.
     */
    isDefined(def: CustomElementDefinition): boolean;
    /**
     * Apply the specified configuration to the specified type, overwriting any existing configuration.
     */
    define(routeDefinition: RouteDefinition, customElementDefinition: CustomElementDefinition): void;
    /**
     * Get the `RouteDefinition` associated with the `customElementDefinition`.
     * Returns `null` if no route definition is associated with the given `customElementDefinition`.
     */
    get(customElementDefinition: CustomElementDefinition): RouteDefinition | null;
};
//# sourceMappingURL=route-definition.d.ts.map