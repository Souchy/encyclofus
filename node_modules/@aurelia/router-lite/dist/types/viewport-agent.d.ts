import { LifecycleFlags } from '@aurelia/runtime';
import { IHydratedController, ICustomElementController } from '@aurelia/runtime-html';
import { IViewport } from './resources/viewport';
import { RouteNode } from './route-tree';
import { IRouteContext } from './route-context';
import { Transition, ResolutionMode, NavigationOptions } from './router';
import { Batch } from './util';
export declare class ViewportRequest {
    readonly viewportName: string;
    readonly componentName: string;
    readonly resolution: ResolutionMode;
    constructor(viewportName: string, componentName: string, resolution: ResolutionMode);
    toString(): string;
}
export declare class ViewportAgent {
    readonly viewport: IViewport;
    readonly hostController: ICustomElementController;
    readonly ctx: IRouteContext;
    private readonly logger;
    private isActive;
    private curCA;
    private nextCA;
    private get $state();
    private state;
    private get currState();
    private set currState(value);
    private get nextState();
    private set nextState(value);
    private $resolution;
    private $plan;
    private currNode;
    private nextNode;
    private currTransition;
    private prevTransition;
    constructor(viewport: IViewport, hostController: ICustomElementController, ctx: IRouteContext);
    static for(viewport: IViewport, ctx: IRouteContext): ViewportAgent;
    activateFromViewport(initiator: IHydratedController, parent: IHydratedController, flags: LifecycleFlags): void | Promise<void>;
    deactivateFromViewport(initiator: IHydratedController, parent: IHydratedController, flags: LifecycleFlags): void | Promise<void>;
    handles(req: ViewportRequest): boolean;
    isAvailable(resolution: ResolutionMode): boolean;
    canUnload(tr: Transition, b: Batch): void;
    canLoad(tr: Transition, b: Batch): void;
    unload(tr: Transition, b: Batch): void;
    load(tr: Transition, b: Batch): void;
    deactivate(initiator: IHydratedController | null, tr: Transition, b: Batch): void;
    activate(initiator: IHydratedController | null, tr: Transition, b: Batch): void;
    swap(tr: Transition, b: Batch): void;
    private processDynamicChildren;
    scheduleUpdate(options: NavigationOptions, next: RouteNode): void;
    cancelUpdate(): void;
    endTransition(): void;
    toString(): string;
    dispose(): void;
    private unexpectedState;
}
//# sourceMappingURL=viewport-agent.d.ts.map