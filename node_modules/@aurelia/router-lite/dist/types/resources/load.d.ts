import { ICustomAttributeViewModel, IEventDelegator, IEventTarget, INode } from '@aurelia/runtime-html';
import { IRouter } from '../router';
import { IRouteContext } from '../route-context';
import { Params } from '../instructions';
import { IRouterEvents } from '../router-events';
import { ILocationManager } from '../location-manager';
export declare class LoadCustomAttribute implements ICustomAttributeViewModel {
    private readonly target;
    private readonly el;
    private readonly router;
    private readonly events;
    private readonly delegator;
    private readonly ctx;
    private readonly locationMgr;
    route: unknown;
    params?: Params;
    attribute: string;
    active: boolean;
    /**
     * When not bound, it defaults to the injected instance of the router context.
     */
    context?: IRouteContext;
    private href;
    private instructions;
    private eventListener;
    private navigationEndListener;
    private readonly isEnabled;
    constructor(target: IEventTarget, el: INode<HTMLElement>, router: IRouter, events: IRouterEvents, delegator: IEventDelegator, ctx: IRouteContext, locationMgr: ILocationManager);
    binding(): void;
    attaching(): void | Promise<void>;
    unbinding(): void;
    valueChanged(): void;
    private readonly onClick;
}
//# sourceMappingURL=load.d.ts.map