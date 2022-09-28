'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var kernel = require('@aurelia/kernel');
var runtimeHtml = require('@aurelia/runtime-html');
var platformBrowser = require('@aurelia/platform-browser');
var fetchClient = require('@aurelia/fetch-client');
var metadata = require('@aurelia/metadata');
var platform = require('@aurelia/platform');
var routerLite = require('@aurelia/router-lite');
var runtime = require('@aurelia/runtime');

const PLATFORM = platformBrowser.BrowserPlatform.getOrCreate(globalThis);
function createContainer() {
    return kernel.DI.createContainer()
        .register(kernel.Registration.instance(runtimeHtml.IPlatform, PLATFORM), runtimeHtml.StandardConfiguration);
}
class Aurelia extends runtimeHtml.Aurelia {
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
        if (runtimeHtml.CustomElement.isType(config)) {
            const definition = runtimeHtml.CustomElement.getDefinition(config);
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

exports.ColorOptions = kernel.ColorOptions;
exports.ConsoleSink = kernel.ConsoleSink;
exports.DI = kernel.DI;
exports.EventAggregator = kernel.EventAggregator;
exports.IContainer = kernel.IContainer;
exports.IEventAggregator = kernel.IEventAggregator;
exports.ILogger = kernel.ILogger;
exports.IServiceLocator = kernel.IServiceLocator;
exports.InstanceProvider = kernel.InstanceProvider;
exports.LogLevel = kernel.LogLevel;
exports.LoggerConfiguration = kernel.LoggerConfiguration;
exports.Registration = kernel.Registration;
exports.all = kernel.all;
exports.bound = kernel.bound;
exports.camelCase = kernel.camelCase;
exports.emptyArray = kernel.emptyArray;
exports.emptyObject = kernel.emptyObject;
exports.inject = kernel.inject;
exports.isArrayIndex = kernel.isArrayIndex;
exports.kebabCase = kernel.kebabCase;
exports.lazy = kernel.lazy;
exports.noop = kernel.noop;
exports.optional = kernel.optional;
exports.pascalCase = kernel.pascalCase;
exports.singleton = kernel.singleton;
exports.toArray = kernel.toArray;
exports.transient = kernel.transient;
exports.AppTask = runtimeHtml.AppTask;
exports.AuSlotsInfo = runtimeHtml.AuSlotsInfo;
exports.Bindable = runtimeHtml.Bindable;
exports.Controller = runtimeHtml.Controller;
exports.CustomAttribute = runtimeHtml.CustomAttribute;
exports.CustomElement = runtimeHtml.CustomElement;
exports.DefaultDialogDom = runtimeHtml.DefaultDialogDom;
exports.DefaultDialogDomRenderer = runtimeHtml.DefaultDialogDomRenderer;
exports.DefaultDialogGlobalSettings = runtimeHtml.DefaultDialogGlobalSettings;
exports.DialogCloseResult = runtimeHtml.DialogCloseResult;
exports.DialogConfiguration = runtimeHtml.DialogConfiguration;
exports.DialogController = runtimeHtml.DialogController;
exports.DialogDeactivationStatuses = runtimeHtml.DialogDeactivationStatuses;
exports.DialogDefaultConfiguration = runtimeHtml.DialogDefaultConfiguration;
exports.DialogOpenResult = runtimeHtml.DialogOpenResult;
exports.DialogService = runtimeHtml.DialogService;
exports.IAppRoot = runtimeHtml.IAppRoot;
exports.IAttrMapper = runtimeHtml.IAttrMapper;
exports.IAttributePattern = runtimeHtml.IAttributePattern;
exports.IAuSlotsInfo = runtimeHtml.IAuSlotsInfo;
exports.IAurelia = runtimeHtml.IAurelia;
exports.IDialogController = runtimeHtml.IDialogController;
exports.IDialogDom = runtimeHtml.IDialogDom;
exports.IDialogDomRenderer = runtimeHtml.IDialogDomRenderer;
exports.IDialogGlobalSettings = runtimeHtml.IDialogGlobalSettings;
exports.IDialogService = runtimeHtml.IDialogService;
exports.IEventTarget = runtimeHtml.IEventTarget;
exports.ILifecycleHooks = runtimeHtml.ILifecycleHooks;
exports.INode = runtimeHtml.INode;
exports.IPlatform = runtimeHtml.IPlatform;
exports.IRenderLocation = runtimeHtml.IRenderLocation;
exports.ITemplateCompiler = runtimeHtml.ITemplateCompiler;
exports.ITemplateCompilerHooks = runtimeHtml.ITemplateCompilerHooks;
exports.IWcElementRegistry = runtimeHtml.IWcElementRegistry;
exports.IWorkTracker = runtimeHtml.IWorkTracker;
exports.LifecycleHooks = runtimeHtml.LifecycleHooks;
exports.NodeObserverLocator = runtimeHtml.NodeObserverLocator;
exports.ShortHandBindingSyntax = runtimeHtml.ShortHandBindingSyntax;
exports.StyleConfiguration = runtimeHtml.StyleConfiguration;
exports.TemplateCompilerHooks = runtimeHtml.TemplateCompilerHooks;
exports.ViewFactory = runtimeHtml.ViewFactory;
exports.WcCustomElementRegistry = runtimeHtml.WcCustomElementRegistry;
exports.attributePattern = runtimeHtml.attributePattern;
exports.bindable = runtimeHtml.bindable;
exports.bindingCommand = runtimeHtml.bindingCommand;
exports.capture = runtimeHtml.capture;
exports.children = runtimeHtml.children;
exports.coercer = runtimeHtml.coercer;
exports.containerless = runtimeHtml.containerless;
exports.createElement = runtimeHtml.createElement;
exports.cssModules = runtimeHtml.cssModules;
exports.customAttribute = runtimeHtml.customAttribute;
exports.customElement = runtimeHtml.customElement;
exports.lifecycleHooks = runtimeHtml.lifecycleHooks;
exports.renderer = runtimeHtml.renderer;
exports.shadowCSS = runtimeHtml.shadowCSS;
exports.strict = runtimeHtml.strict;
exports.templateCompilerHooks = runtimeHtml.templateCompilerHooks;
exports.templateController = runtimeHtml.templateController;
exports.useShadowDOM = runtimeHtml.useShadowDOM;
exports.HttpClient = fetchClient.HttpClient;
exports.HttpClientConfiguration = fetchClient.HttpClientConfiguration;
exports.IHttpClient = fetchClient.IHttpClient;
exports.json = fetchClient.json;
exports.Metadata = metadata.Metadata;
exports.Platform = platform.Platform;
exports.Task = platform.Task;
exports.TaskAbortError = platform.TaskAbortError;
exports.TaskQueue = platform.TaskQueue;
exports.TaskQueuePriority = platform.TaskQueuePriority;
exports.TaskStatus = platform.TaskStatus;
exports.IRouteContext = routerLite.IRouteContext;
exports.IRouter = routerLite.IRouter;
exports.IRouterEvents = routerLite.IRouterEvents;
exports.Route = routerLite.Route;
exports.RouteConfig = routerLite.RouteConfig;
exports.RouteNode = routerLite.RouteNode;
exports.Router = routerLite.Router;
exports.RouterConfiguration = routerLite.RouterConfiguration;
exports.RouterOptions = routerLite.RouterOptions;
exports.RouterRegistration = routerLite.RouterRegistration;
exports.route = routerLite.route;
exports.BindingBehavior = runtime.BindingBehavior;
exports.BindingMode = runtime.BindingMode;
exports.CollectionKind = runtime.CollectionKind;
exports.ComputedObserver = runtime.ComputedObserver;
exports.IObserverLocator = runtime.IObserverLocator;
exports.ISignaler = runtime.ISignaler;
exports.LifecycleFlags = runtime.LifecycleFlags;
exports.ValueConverter = runtime.ValueConverter;
exports.alias = runtime.alias;
exports.bindingBehavior = runtime.bindingBehavior;
exports.observable = runtime.observable;
exports.registerAliases = runtime.registerAliases;
exports.subscriberCollection = runtime.subscriberCollection;
exports.valueConverter = runtime.valueConverter;
exports.Aurelia = Aurelia;
exports.PLATFORM = PLATFORM;
exports["default"] = Aurelia;
//# sourceMappingURL=index.dev.cjs.map
