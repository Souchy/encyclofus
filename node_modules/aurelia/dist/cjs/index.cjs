"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var r = require("@aurelia/kernel");

var e = require("@aurelia/runtime-html");

var t = require("@aurelia/platform-browser");

var s = require("@aurelia/fetch-client");

var o = require("@aurelia/metadata");

var p = require("@aurelia/platform");

var x = require("@aurelia/router-lite");

var a = require("@aurelia/runtime");

const u = t.BrowserPlatform.getOrCreate(globalThis);

function i() {
    return r.DI.createContainer().register(r.Registration.instance(e.IPlatform, u), e.StandardConfiguration);
}

class Aurelia extends e.Aurelia {
    constructor(r = i()) {
        super(r);
    }
    static start(r) {
        return (new Aurelia).start(r);
    }
    static app(r) {
        return (new Aurelia).app(r);
    }
    static enhance(r, e) {
        return (new Aurelia).enhance(r, e);
    }
    static register(...r) {
        return (new Aurelia).register(...r);
    }
    app(r) {
        if (e.CustomElement.isType(r)) {
            const t = e.CustomElement.getDefinition(r);
            let s = document.querySelector(t.name);
            if (null === s) s = document.body;
            return super.app({
                host: s,
                component: r
            });
        }
        return super.app(r);
    }
}

exports.ColorOptions = r.ColorOptions;

exports.ConsoleSink = r.ConsoleSink;

exports.DI = r.DI;

exports.EventAggregator = r.EventAggregator;

exports.IContainer = r.IContainer;

exports.IEventAggregator = r.IEventAggregator;

exports.ILogger = r.ILogger;

exports.IServiceLocator = r.IServiceLocator;

exports.InstanceProvider = r.InstanceProvider;

exports.LogLevel = r.LogLevel;

exports.LoggerConfiguration = r.LoggerConfiguration;

exports.Registration = r.Registration;

exports.all = r.all;

exports.bound = r.bound;

exports.camelCase = r.camelCase;

exports.emptyArray = r.emptyArray;

exports.emptyObject = r.emptyObject;

exports.inject = r.inject;

exports.isArrayIndex = r.isArrayIndex;

exports.kebabCase = r.kebabCase;

exports.lazy = r.lazy;

exports.noop = r.noop;

exports.optional = r.optional;

exports.pascalCase = r.pascalCase;

exports.singleton = r.singleton;

exports.toArray = r.toArray;

exports.transient = r.transient;

exports.AppTask = e.AppTask;

exports.AuSlotsInfo = e.AuSlotsInfo;

exports.Bindable = e.Bindable;

exports.Controller = e.Controller;

exports.CustomAttribute = e.CustomAttribute;

exports.CustomElement = e.CustomElement;

exports.DefaultDialogDom = e.DefaultDialogDom;

exports.DefaultDialogDomRenderer = e.DefaultDialogDomRenderer;

exports.DefaultDialogGlobalSettings = e.DefaultDialogGlobalSettings;

exports.DialogCloseResult = e.DialogCloseResult;

exports.DialogConfiguration = e.DialogConfiguration;

exports.DialogController = e.DialogController;

exports.DialogDeactivationStatuses = e.DialogDeactivationStatuses;

exports.DialogDefaultConfiguration = e.DialogDefaultConfiguration;

exports.DialogOpenResult = e.DialogOpenResult;

exports.DialogService = e.DialogService;

exports.IAppRoot = e.IAppRoot;

exports.IAttrMapper = e.IAttrMapper;

exports.IAttributePattern = e.IAttributePattern;

exports.IAuSlotsInfo = e.IAuSlotsInfo;

exports.IAurelia = e.IAurelia;

exports.IDialogController = e.IDialogController;

exports.IDialogDom = e.IDialogDom;

exports.IDialogDomRenderer = e.IDialogDomRenderer;

exports.IDialogGlobalSettings = e.IDialogGlobalSettings;

exports.IDialogService = e.IDialogService;

exports.IEventTarget = e.IEventTarget;

exports.ILifecycleHooks = e.ILifecycleHooks;

exports.INode = e.INode;

exports.IPlatform = e.IPlatform;

exports.IRenderLocation = e.IRenderLocation;

exports.ITemplateCompiler = e.ITemplateCompiler;

exports.ITemplateCompilerHooks = e.ITemplateCompilerHooks;

exports.IWcElementRegistry = e.IWcElementRegistry;

exports.IWorkTracker = e.IWorkTracker;

exports.LifecycleHooks = e.LifecycleHooks;

exports.NodeObserverLocator = e.NodeObserverLocator;

exports.ShortHandBindingSyntax = e.ShortHandBindingSyntax;

exports.StyleConfiguration = e.StyleConfiguration;

exports.TemplateCompilerHooks = e.TemplateCompilerHooks;

exports.ViewFactory = e.ViewFactory;

exports.WcCustomElementRegistry = e.WcCustomElementRegistry;

exports.attributePattern = e.attributePattern;

exports.bindable = e.bindable;

exports.bindingCommand = e.bindingCommand;

exports.capture = e.capture;

exports.children = e.children;

exports.coercer = e.coercer;

exports.containerless = e.containerless;

exports.createElement = e.createElement;

exports.cssModules = e.cssModules;

exports.customAttribute = e.customAttribute;

exports.customElement = e.customElement;

exports.lifecycleHooks = e.lifecycleHooks;

exports.renderer = e.renderer;

exports.shadowCSS = e.shadowCSS;

exports.strict = e.strict;

exports.templateCompilerHooks = e.templateCompilerHooks;

exports.templateController = e.templateController;

exports.useShadowDOM = e.useShadowDOM;

exports.HttpClient = s.HttpClient;

exports.HttpClientConfiguration = s.HttpClientConfiguration;

exports.IHttpClient = s.IHttpClient;

exports.json = s.json;

exports.Metadata = o.Metadata;

exports.Platform = p.Platform;

exports.Task = p.Task;

exports.TaskAbortError = p.TaskAbortError;

exports.TaskQueue = p.TaskQueue;

exports.TaskQueuePriority = p.TaskQueuePriority;

exports.TaskStatus = p.TaskStatus;

exports.IRouteContext = x.IRouteContext;

exports.IRouter = x.IRouter;

exports.IRouterEvents = x.IRouterEvents;

exports.Route = x.Route;

exports.RouteConfig = x.RouteConfig;

exports.RouteNode = x.RouteNode;

exports.Router = x.Router;

exports.RouterConfiguration = x.RouterConfiguration;

exports.RouterOptions = x.RouterOptions;

exports.RouterRegistration = x.RouterRegistration;

exports.route = x.route;

exports.BindingBehavior = a.BindingBehavior;

exports.BindingMode = a.BindingMode;

exports.CollectionKind = a.CollectionKind;

exports.ComputedObserver = a.ComputedObserver;

exports.IObserverLocator = a.IObserverLocator;

exports.ISignaler = a.ISignaler;

exports.LifecycleFlags = a.LifecycleFlags;

exports.ValueConverter = a.ValueConverter;

exports.alias = a.alias;

exports.bindingBehavior = a.bindingBehavior;

exports.observable = a.observable;

exports.registerAliases = a.registerAliases;

exports.subscriberCollection = a.subscriberCollection;

exports.valueConverter = a.valueConverter;

exports.Aurelia = Aurelia;

exports.PLATFORM = u;

exports["default"] = Aurelia;
//# sourceMappingURL=index.cjs.map
