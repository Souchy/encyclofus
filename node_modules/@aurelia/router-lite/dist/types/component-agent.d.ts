import { LifecycleFlags } from '@aurelia/runtime';
import { ICustomElementController, IHydratedController, ICustomElementViewModel, ILifecycleHooks } from '@aurelia/runtime-html';
import { RouteDefinition } from './route-definition';
import { RouteNode } from './route-tree';
import { IRouteContext } from './route-context';
import { Params, NavigationInstruction } from './instructions';
import { Transition } from './router';
import { Batch } from './util';
import { IRouteConfig } from './route';
export interface IRouteViewModel extends ICustomElementViewModel {
    getRouteConfig?(parentDefinition: RouteDefinition | null, routeNode: RouteNode | null): IRouteConfig;
    canLoad?(params: Params, next: RouteNode, current: RouteNode | null): boolean | NavigationInstruction | NavigationInstruction[] | Promise<boolean | NavigationInstruction | NavigationInstruction[]>;
    load?(params: Params, next: RouteNode, current: RouteNode | null): void | Promise<void>;
    canUnload?(next: RouteNode | null, current: RouteNode): boolean | Promise<boolean>;
    unload?(next: RouteNode | null, current: RouteNode): void | Promise<void>;
}
/**
 * A component agent handles an instance of a routed view-model (a component).
 * It deals with invoking the hooks (`canLoad`, `load`, `canUnload`, `unload`),
 * and activating, deactivating, and disposing the component (via the associated controller).
 */
export declare class ComponentAgent<T extends IRouteViewModel = IRouteViewModel> {
    readonly instance: T;
    readonly controller: ICustomElementController<T>;
    readonly definition: RouteDefinition;
    readonly routeNode: RouteNode;
    readonly ctx: IRouteContext;
    readonly canLoadHooks: readonly ILifecycleHooks<IRouteViewModel, 'canLoad'>[];
    readonly loadHooks: readonly ILifecycleHooks<IRouteViewModel, 'load'>[];
    readonly canUnloadHooks: readonly ILifecycleHooks<IRouteViewModel, 'canUnload'>[];
    readonly unloadHooks: readonly ILifecycleHooks<IRouteViewModel, 'unload'>[];
    constructor(instance: T, controller: ICustomElementController<T>, definition: RouteDefinition, routeNode: RouteNode, ctx: IRouteContext);
    static for<T extends IRouteViewModel>(componentInstance: T, hostController: ICustomElementController<T>, routeNode: RouteNode, ctx: IRouteContext): ComponentAgent<T>;
    activate(initiator: IHydratedController | null, parent: IHydratedController, flags: LifecycleFlags): void | Promise<void>;
    deactivate(initiator: IHydratedController | null, parent: IHydratedController, flags: LifecycleFlags): void | Promise<void>;
    dispose(): void;
    canUnload(tr: Transition, next: RouteNode | null, b: Batch): void;
    canLoad(tr: Transition, next: RouteNode, b: Batch): void;
    unload(tr: Transition, next: RouteNode | null, b: Batch): void;
    load(tr: Transition, next: RouteNode, b: Batch): void;
    toString(): string;
}
//# sourceMappingURL=component-agent.d.ts.map