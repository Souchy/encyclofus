import { IContainer } from '@aurelia/kernel';
import { Aurelia as $Aurelia, IPlatform, IAppRoot, IHydratedParentController } from '@aurelia/runtime-html';
import { BrowserPlatform } from '@aurelia/platform-browser';
import type { ISinglePageApp, IEnhancementConfig } from '@aurelia/runtime-html';
export declare const PLATFORM: BrowserPlatform<typeof globalThis>;
export { IPlatform };
export declare class Aurelia extends $Aurelia {
    constructor(container?: IContainer);
    static start(root: IAppRoot | undefined): void | Promise<void>;
    static app(config: ISinglePageApp | unknown): Omit<Aurelia, 'register' | 'app' | 'enhance'>;
    static enhance<T>(config: IEnhancementConfig<T>, parentController?: IHydratedParentController): ReturnType<$Aurelia['enhance']>;
    static register(...params: readonly unknown[]): Aurelia;
    app(config: ISinglePageApp | unknown): Omit<this, 'register' | 'app' | 'enhance'>;
}
export default Aurelia;
export { type Interceptor, json, HttpClientConfiguration, HttpClient, IHttpClient, } from '@aurelia/fetch-client';
export { Metadata, } from '@aurelia/metadata';
export { type ITask, Platform, type QueueTaskOptions, Task, TaskAbortError, TaskQueue, TaskQueuePriority, TaskStatus } from '@aurelia/platform';
export { all, DI, IContainer, inject, type IRegistration, type IRegistry, type IResolver, IServiceLocator, type Key, lazy, optional, Registration, singleton, transient, InstanceProvider, type Resolved, type Class, type Constructable, type ConstructableClass, type IDisposable, type IIndexable, ColorOptions, ILogger, ConsoleSink, LoggerConfiguration, emptyArray, emptyObject, noop, LogLevel, EventAggregator, IEventAggregator, isArrayIndex, camelCase, kebabCase, pascalCase, toArray, bound, } from '@aurelia/kernel';
export { RouterOptions, IRouter, IRouterEvents, Router, RouteNode, route, Route, RouteConfig, IRouteContext, type IRouteViewModel, type NavigationInstruction, type Routeable, type Params, RouterConfiguration, RouterRegistration, } from '@aurelia/router-lite';
export { CollectionKind, ComputedObserver, IObserverLocator, ISignaler, subscriberCollection, bindingBehavior, BindingBehavior, type BindingBehaviorInstance, observable, alias, registerAliases, BindingMode, LifecycleFlags, ValueConverter, type ValueConverterInstance, valueConverter, type IndexMap, } from '@aurelia/runtime';
export { customAttribute, CustomAttribute, templateController, containerless, customElement, CustomElement, strict, capture, useShadowDOM, AppTask, bindable, type PartialBindableDefinition, Bindable, coercer, children, Controller, ViewFactory, IAppRoot, IWorkTracker, INode, IEventTarget, IRenderLocation, type ICustomAttributeViewModel, type ICustomElementViewModel, renderer, IAurelia, NodeObserverLocator, IAuSlotsInfo, AuSlotsInfo, ITemplateCompiler, ITemplateCompilerHooks, TemplateCompilerHooks, templateCompilerHooks, attributePattern, IAttributePattern, IAttrMapper, bindingCommand, type BindingCommandInstance, type IEnhancementConfig, type IHydratedParentController, ShortHandBindingSyntax, createElement, StyleConfiguration, type IShadowDOMConfiguration, cssModules, shadowCSS, ILifecycleHooks, type LifecycleHook, LifecycleHooks, lifecycleHooks, DialogConfiguration, type DialogConfigurationProvider, DialogDefaultConfiguration, type DialogActionKey, type DialogMouseEventType, DialogDeactivationStatuses, type IDialogSettings, IDialogGlobalSettings, type IDialogLoadedSettings, IDialogService, IDialogController, IDialogDomRenderer, IDialogDom, type DialogError, type DialogOpenPromise, DialogOpenResult, type DialogCancelError, type DialogCloseError, DialogCloseResult, DialogService, DialogController, DefaultDialogDom, DefaultDialogDomRenderer, DefaultDialogGlobalSettings, type IDialogCustomElementViewModel, type IDialogComponent, type IDialogComponentActivate, type IDialogComponentCanActivate, type IDialogComponentDeactivate, type IDialogComponentCanDeactivate, IWcElementRegistry, type WebComponentViewModelClass, WcCustomElementRegistry, } from '@aurelia/runtime-html';
//# sourceMappingURL=index.d.ts.map