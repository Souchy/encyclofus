/**
 *
 * NOTE: This file is still WIP and will go through at least one more iteration of refactoring, commenting and clean up!
 * In its current state, it is NOT a good source for learning about the inner workings and design of the router.
 *
 */
import { Constructable } from '@aurelia/kernel';
import { CustomElementType, ICustomElementController, ICustomElementViewModel } from '@aurelia/runtime-html';
import { Viewport } from './endpoints/viewport';
import { RoutingInstruction } from './instructions/routing-instruction';
import { Navigation } from './navigation';
import { IRoute } from './route';
import { ILoadOptions } from './router';
import { Parameters } from './instructions/instruction-parameters';
export interface IPopStateEvent extends PopStateEvent {
}
export interface IHashChangeEvent extends HashChangeEvent {
}
export interface IMouseEvent extends MouseEvent {
}
export interface IElement extends Element {
}
export interface IHTMLElement extends HTMLElement {
}
export declare type RouteableComponentType<C extends Constructable = Constructable> = CustomElementType<C> & {
    parameters?: string[];
    title?: string | TitleFunction;
    routes?: IRoute[];
};
export declare type TitleFunction = (viewModel: IRouteableComponent, instruction: Navigation) => string;
export interface IRouteableComponent extends ICustomElementViewModel {
    reloadBehavior?: ReloadBehavior;
    canLoad?(parameters: Parameters, instruction: RoutingInstruction, navigation: Navigation): boolean | LoadInstruction | LoadInstruction[] | Promise<boolean | LoadInstruction | LoadInstruction[]>;
    load?(parameters: Parameters, instruction: RoutingInstruction, navigation: Navigation): void | Promise<void>;
    canUnload?(instruction: RoutingInstruction, navigation: Navigation | null): boolean | Promise<boolean>;
    unload?(instruction: RoutingInstruction, navigation: Navigation | null): void | Promise<void>;
    readonly $controller?: ICustomElementController<this>;
}
export declare const enum ReloadBehavior {
    default = "default",
    disallow = "disallow",
    reload = "reload",
    refresh = "refresh"
}
export interface IRoutingInstruction {
    component: ComponentAppellation;
    viewport?: ViewportHandle;
    parameters?: ComponentParameters;
    children?: LoadInstruction[];
    options?: ILoadOptions;
}
export interface IComponentAndOrViewportOrNothing {
    component?: ComponentAppellation;
    viewport?: ViewportHandle;
}
export declare type LoadInstruction = ComponentAppellation | IRoutingInstruction | RoutingInstruction;
export declare type ComponentAppellation = string | RouteableComponentType | IRouteableComponent | Constructable;
export declare type ViewportHandle = string | Viewport;
export declare type ComponentParameters = string | Record<string, unknown> | unknown[];
//# sourceMappingURL=interfaces.d.ts.map