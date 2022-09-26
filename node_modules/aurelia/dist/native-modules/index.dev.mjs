import { DI, Registration } from '../../../@aurelia/kernel/dist/native-modules/index.mjs';
export { ColorOptions, ConsoleSink, DI, EventAggregator, IContainer, IEventAggregator, ILogger, IServiceLocator, InstanceProvider, LogLevel, LoggerConfiguration, Registration, all, bound, camelCase, emptyArray, emptyObject, inject, isArrayIndex, kebabCase, lazy, noop, optional, pascalCase, singleton, toArray, transient } from '../../../@aurelia/kernel/dist/native-modules/index.mjs';
import { Aurelia as Aurelia$1, CustomElement, IPlatform, StandardConfiguration } from '../../../@aurelia/runtime-html/dist/native-modules/index.mjs';
export { AppTask, AuSlotsInfo, Bindable, Controller, CustomAttribute, CustomElement, DefaultDialogDom, DefaultDialogDomRenderer, DefaultDialogGlobalSettings, DialogCloseResult, DialogConfiguration, DialogController, DialogDeactivationStatuses, DialogDefaultConfiguration, DialogOpenResult, DialogService, IAppRoot, IAttrMapper, IAttributePattern, IAuSlotsInfo, IAurelia, IDialogController, IDialogDom, IDialogDomRenderer, IDialogGlobalSettings, IDialogService, IEventTarget, ILifecycleHooks, INode, IPlatform, IRenderLocation, ITemplateCompiler, ITemplateCompilerHooks, IWcElementRegistry, IWorkTracker, LifecycleHooks, NodeObserverLocator, ShortHandBindingSyntax, StyleConfiguration, TemplateCompilerHooks, ViewFactory, WcCustomElementRegistry, attributePattern, bindable, bindingCommand, capture, children, coercer, containerless, createElement, cssModules, customAttribute, customElement, lifecycleHooks, renderer, shadowCSS, strict, templateCompilerHooks, templateController, useShadowDOM } from '../../../@aurelia/runtime-html/dist/native-modules/index.mjs';
import { BrowserPlatform } from '../../../@aurelia/platform-browser/dist/native-modules/index.mjs';
export { HttpClient, HttpClientConfiguration, IHttpClient, json } from '../../../@aurelia/fetch-client/dist/native-modules/index.mjs';
export { Metadata } from '../../../@aurelia/metadata/dist/native-modules/index.mjs';
export { Platform, Task, TaskAbortError, TaskQueue, TaskQueuePriority, TaskStatus } from '../../../@aurelia/platform/dist/native-modules/index.mjs';
export { IRouteContext, IRouter, IRouterEvents, Route, RouteConfig, RouteNode, Router, RouterConfiguration, RouterOptions, RouterRegistration, route } from '../../../@aurelia/router-lite/dist/native-modules/index.mjs';
export { BindingBehavior, BindingMode, CollectionKind, ComputedObserver, IObserverLocator, ISignaler, LifecycleFlags, ValueConverter, alias, bindingBehavior, observable, registerAliases, subscriberCollection, valueConverter } from '../../../@aurelia/runtime/dist/native-modules/index.mjs';

const PLATFORM = BrowserPlatform.getOrCreate(globalThis);
function createContainer() {
    return DI.createContainer()
        .register(Registration.instance(IPlatform, PLATFORM), StandardConfiguration);
}
class Aurelia extends Aurelia$1 {
    constructor(container = createContainer()) {
        super(container);
    }
    static start(root) {
        return new Aurelia().start(root);
    }
    static app(config) {
        return new Aurelia().app(config);
    }
    static enhance(config, parentController) {
        return new Aurelia().enhance(config, parentController);
    }
    static register(...params) {
        return new Aurelia().register(...params);
    }
    app(config) {
        if (CustomElement.isType(config)) {
            const definition = CustomElement.getDefinition(config);
            let host = document.querySelector(definition.name);
            if (host === null) {
                host = document.body;
            }
            return super.app({
                host: host,
                component: config
            });
        }
        return super.app(config);
    }
}

export { Aurelia, PLATFORM, Aurelia as default };
//# sourceMappingURL=index.dev.mjs.map
