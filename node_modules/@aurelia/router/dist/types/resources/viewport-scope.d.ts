/**
 *
 * NOTE: This file is still WIP and will go through at least one more iteration of refactoring, commenting and clean up!
 * In its current state, it is NOT a good source for learning about the inner workings and design of the router.
 *
 */
import { LifecycleFlags } from '@aurelia/runtime';
import { INode, ICompiledCustomElementController, ICustomElementViewModel, ICustomElementController, IHydratedController, ISyntheticView } from '@aurelia/runtime-html';
import { IContainer } from '@aurelia/kernel';
import { IRouter } from '../index';
import { ViewportScope } from '../endpoints/viewport-scope';
export declare const ParentViewportScope: import("@aurelia/runtime-html/dist/types/resources/custom-element").InjectableToken<import("@aurelia/kernel").Key>;
export declare class ViewportScopeCustomElement implements ICustomElementViewModel {
    private readonly router;
    readonly element: INode<HTMLElement>;
    container: IContainer;
    private readonly parent;
    private readonly parentController;
    name: string;
    catches: string;
    collection: boolean;
    source: unknown[] | null;
    viewportScope: ViewportScope | null;
    readonly $controller: ICustomElementController<this>;
    controller: ICustomElementController;
    private isBound;
    constructor(router: IRouter, element: INode<HTMLElement>, container: IContainer, parent: ViewportScopeCustomElement, parentController: IHydratedController);
    hydrated(controller: ICompiledCustomElementController): void;
    bound(_initiator: IHydratedController, _parent: ISyntheticView | ICustomElementController | null, _flags: LifecycleFlags): void;
    unbinding(_initiator: IHydratedController, _parent: ISyntheticView | ICustomElementController | null, _flags: LifecycleFlags): void | Promise<void>;
    connect(): void;
    disconnect(): void;
    private getAttribute;
}
//# sourceMappingURL=viewport-scope.d.ts.map