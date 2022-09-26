import { ILogger } from '@aurelia/kernel';
import { LifecycleFlags } from '@aurelia/runtime';
import { ICustomElementViewModel, IHydratedController, ICompiledCustomElementController } from '@aurelia/runtime-html';
import { IRouteContext } from '../route-context';
export interface IViewport {
    readonly name: string;
    readonly usedBy: string;
    readonly default: string;
    readonly fallback: string;
    readonly stateful: boolean;
}
export declare class ViewportCustomElement implements ICustomElementViewModel, IViewport {
    private readonly logger;
    private readonly ctx;
    name: string;
    usedBy: string;
    default: string;
    fallback: string;
    stateful: boolean;
    private agent;
    private controller;
    constructor(logger: ILogger, ctx: IRouteContext);
    hydrated(controller: ICompiledCustomElementController): void;
    attaching(initiator: IHydratedController, _parent: IHydratedController, flags: LifecycleFlags): void | Promise<void>;
    detaching(initiator: IHydratedController, _parent: IHydratedController, flags: LifecycleFlags): void | Promise<void>;
    dispose(): void;
    toString(): string;
}
//# sourceMappingURL=viewport.d.ts.map