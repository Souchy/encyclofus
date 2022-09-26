import { Protocol as t, IEventAggregator as i, IContainer as n, DI as s, Registration as e } from "@aurelia/kernel";

import { CustomElement as o, isCustomElementViewModel as r, Controller as l, IPlatform as u, IWindow as h, IHistory as a, ILocation as c, IAppRoot as f, CustomAttribute as d, customElement as v, bindable as p, INode as g, IInstruction as w, IController as m, customAttribute as R, AppTask as I } from "@aurelia/runtime-html";

import { Metadata as E } from "@aurelia/metadata";

import { RouteRecognizer as y, ConfigurableRoute as C, RecognizedRoute as S, Endpoint as N } from "@aurelia/route-recognizer";

import { BindingMode as b } from "@aurelia/runtime";

class Endpoint$1 {
    constructor(t, i, n, s = {}) {
        this.router = t;
        this.name = i;
        this.connectedCE = n;
        this.options = s;
        this.contents = [];
        this.transitionAction = "";
        this.path = null;
    }
    getContent() {
        return this.contents[0];
    }
    getNextContent() {
        return this.contents.length > 1 ? this.contents[this.contents.length - 1] : null;
    }
    getTimeContent(t = 1 / 0) {
        return this.getContent();
    }
    get activeContent() {
        var t;
        return null !== (t = this.getNextContent()) && void 0 !== t ? t : this.getContent();
    }
    get connectedScope() {
        var t;
        return null === (t = this.activeContent) || void 0 === t ? void 0 : t.connectedScope;
    }
    get scope() {
        return this.connectedScope.scope;
    }
    get owningScope() {
        return this.connectedScope.owningScope;
    }
    get connectedController() {
        var t, i;
        return null !== (i = null === (t = this.connectedCE) || void 0 === t ? void 0 : t.$controller) && void 0 !== i ? i : null;
    }
    get isViewport() {
        return this instanceof Viewport;
    }
    get isViewportScope() {
        return this instanceof ViewportScope;
    }
    get isEmpty() {
        return false;
    }
    get pathname() {
        return this.connectedScope.pathname;
    }
    toString() {
        throw new Error(`Method 'toString' needs to be implemented in all endpoints!`);
    }
    setNextContent(t, i) {
        throw new Error(`Method 'setNextContent' needs to be implemented in all endpoints!`);
    }
    setConnectedCE(t, i) {
        throw new Error(`Method 'setConnectedCE' needs to be implemented in all endpoints!`);
    }
    transition(t) {
        throw new Error(`Method 'transition' needs to be implemented in all endpoints!`);
    }
    finalizeContentChange(t, i) {
        throw new Error(`Method 'finalizeContentChange' needs to be implemented in all endpoints!`);
    }
    cancelContentChange(t, i) {
        throw new Error(`Method 'cancelContentChange' needs to be implemented in all endpoints!`);
    }
    getRoutes() {
        throw new Error(`Method 'getRoutes' needs to be implemented in all endpoints!`);
    }
    getTitle(t) {
        throw new Error(`Method 'getTitle' needs to be implemented in all endpoints!`);
    }
    removeEndpoint(t, i) {
        var n;
        this.getContent().delete();
        null === (n = this.getNextContent()) || void 0 === n ? void 0 : n.delete();
        return true;
    }
    canUnload(t) {
        return true;
    }
    canLoad(t) {
        return true;
    }
    unload(t) {
        return;
    }
    load(t) {
        return;
    }
}

class EndpointContent {
    constructor(t, i, n, s, e = RoutingInstruction.create(""), o = Navigation.create({
        instruction: "",
        fullStateInstruction: ""
    })) {
        var r, l;
        this.router = t;
        this.endpoint = i;
        this.instruction = e;
        this.navigation = o;
        this.completed = false;
        this.connectedScope = new RoutingScope(t, s, n, this);
        if (null !== this.router.rootScope) (null !== (l = null === (r = this.endpoint.connectedScope) || void 0 === r ? void 0 : r.parent) && void 0 !== l ? l : this.router.rootScope.scope).addChild(this.connectedScope);
    }
    get isActive() {
        return this.endpoint.activeContent === this;
    }
    delete() {
        var t;
        null === (t = this.connectedScope.parent) || void 0 === t ? void 0 : t.removeChild(this.connectedScope);
    }
}

class FoundRoute {
    constructor(t = null, i = "", n = [], s = "", e = {}) {
        this.match = t;
        this.matching = i;
        this.instructions = n;
        this.remaining = s;
        this.params = e;
    }
    get foundConfiguration() {
        return null !== this.match;
    }
    get foundInstructions() {
        return this.instructions.length > 0;
    }
    get hasRemaining() {
        return this.instructions.some((t => t.hasNextScopeInstructions));
    }
}

function k(t, i, n, s) {
    var e = arguments.length, o = e < 3 ? i : null === s ? s = Object.getOwnPropertyDescriptor(i, n) : s, r;
    if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) o = Reflect.decorate(t, i, n, s); else for (var l = t.length - 1; l >= 0; l--) if (r = t[l]) o = (e < 3 ? r(o) : e > 3 ? r(i, n, o) : r(i, n)) || o;
    return e > 3 && o && Object.defineProperty(i, n, o), o;
}

function $(t, i) {
    return function(n, s) {
        i(n, s, t);
    };
}

class InstructionParser {
    static parse(t, i, n, s) {
        if (!i) return {
            instructions: [],
            remaining: ""
        };
        if (i.startsWith(t.sibling) && !InstructionParser.isAdd(t, i)) throw new Error(`Instruction parser error: Unnecessary siblings separator ${t.sibling} in beginning of instruction part "${i}".`);
        const e = [];
        let o = 1e3;
        while (i.length && o) {
            o--;
            if (i.startsWith(t.scope)) {
                if (0 === e.length) throw new Error(`Instruction parser error: Children without parent in instruction part "(${i}" is not allowed.`);
                s = false;
                i = i.slice(t.scope.length);
                const o = i.startsWith(t.groupStart);
                if (o) {
                    i = i.slice(t.groupStart.length);
                    n = true;
                }
                const {instructions: r, remaining: l} = InstructionParser.parse(t, i, o, false);
                e[e.length - 1].nextScopeInstructions = r;
                i = l;
            } else if (i.startsWith(t.groupStart)) {
                i = i.slice(t.groupStart.length);
                const {instructions: n, remaining: o} = InstructionParser.parse(t, i, true, s);
                e.push(...n);
                i = o;
            } else if (i.startsWith(t.groupEnd)) {
                if (n) i = i.slice(t.groupEnd.length);
                let s = 0;
                const o = i.length;
                for (;s < o; s++) {
                    if (i.slice(s, s + t.sibling.length) === t.sibling) return {
                        instructions: e,
                        remaining: i
                    };
                    if (i.slice(s, s + t.groupEnd.length) !== t.groupEnd) if (e.length > 1) throw new Error(`Instruction parser error: Children below scope ${t.groupStart}${t.groupEnd} in instruction part "(${i}" is not allowed.`); else {
                        i = i.slice(s);
                        break;
                    }
                }
                if (s >= o) return {
                    instructions: e,
                    remaining: i
                };
            } else if (i.startsWith(t.sibling) && !InstructionParser.isAdd(t, i)) {
                if (!n) return {
                    instructions: e,
                    remaining: i
                };
                i = i.slice(t.sibling.length);
            } else {
                const {instruction: n, remaining: s} = InstructionParser.parseOne(t, i);
                e.push(n);
                i = s;
            }
        }
        return {
            instructions: e,
            remaining: i
        };
    }
    static isAdd(t, i) {
        return i === t.add || i.startsWith(`${t.add}${t.viewport}`);
    }
    static parseOne(t, i) {
        const n = [ t.parameters, t.viewport, t.noScope, t.groupEnd, t.scope, t.sibling ];
        let s;
        let e;
        let o;
        let r = true;
        let l;
        let u;
        const h = i;
        const a = [ t.add, t.clear ];
        for (const e of a) if (i === e) {
            s = i;
            i = "";
            n.shift();
            n.shift();
            l = t.viewport;
            break;
        }
        if (void 0 === s) for (const e of a) if (i.startsWith(`${e}${t.viewport}`)) {
            s = e;
            i = i.slice(`${e}${t.viewport}`.length);
            n.shift();
            n.shift();
            l = t.viewport;
            break;
        }
        if (void 0 === s) {
            ({token: l, pos: u} = InstructionParser.findNextToken(i, n));
            s = -1 !== u ? i.slice(0, u) : i;
            i = -1 !== u ? i.slice(u + l.length) : "";
            n.shift();
            if (l === t.parameters) {
                ({token: l, pos: u} = InstructionParser.findNextToken(i, [ t.parametersEnd ]));
                e = i.slice(0, u);
                i = i.slice(u + l.length);
                ({token: l} = InstructionParser.findNextToken(i, n));
                i = i.slice(l.length);
            }
            n.shift();
        }
        if (l === t.viewport) {
            ({token: l, pos: u} = InstructionParser.findNextToken(i, n));
            o = -1 !== u ? i.slice(0, u) : i;
            i = -1 !== u ? i.slice(u + l.length) : "";
        }
        n.shift();
        if (l === t.noScope) r = false;
        if (l === t.groupEnd || l === t.scope || l === t.sibling) i = `${l}${i}`;
        if ("" === (null !== s && void 0 !== s ? s : "")) throw new Error(`Instruction parser error: No component specified in instruction part "${i}".`);
        const c = RoutingInstruction.create(s, o, e, r);
        c.unparsed = h;
        return {
            instruction: c,
            remaining: i
        };
    }
    static findNextToken(t, i) {
        const n = {};
        for (const s of i) {
            const i = t.indexOf(s);
            if (i > -1) n[s] = t.indexOf(s);
        }
        const s = Math.min(...Object.values(n));
        for (const t in n) if (n[t] === s) return {
            token: t,
            pos: s
        };
        return {
            token: "",
            pos: -1
        };
    }
}

class TitleOptions {
    constructor(t = "${componentTitles}${appTitleSeparator}Aurelia", i = " | ", n = "top-down", s = " > ", e = true, o = "app-", r) {
        this.appTitle = t;
        this.appTitleSeparator = i;
        this.componentTitleOrder = n;
        this.componentTitleSeparator = s;
        this.useComponentNames = e;
        this.componentPrefix = o;
        this.transformTitle = r;
    }
    static create(t = {}) {
        t = "string" === typeof t ? {
            appTitle: t
        } : t;
        return new TitleOptions(t.appTitle, t.appTitleSeparator, t.componentTitleOrder, t.componentTitleSeparator, t.useComponentNames, t.componentPrefix, t.transformTitle);
    }
    static for(t) {
        return RouterOptions.for(t).title;
    }
    apply(t = {}) {
        var i, n, s, e, o, r;
        t = "string" === typeof t ? {
            appTitle: t
        } : t;
        this.appTitle = null !== (i = t.appTitle) && void 0 !== i ? i : this.appTitle;
        this.appTitleSeparator = null !== (n = t.appTitleSeparator) && void 0 !== n ? n : this.appTitleSeparator;
        this.componentTitleOrder = null !== (s = t.componentTitleOrder) && void 0 !== s ? s : this.componentTitleOrder;
        this.componentTitleSeparator = null !== (e = t.componentTitleSeparator) && void 0 !== e ? e : this.componentTitleSeparator;
        this.useComponentNames = null !== (o = t.useComponentNames) && void 0 !== o ? o : this.useComponentNames;
        this.componentPrefix = null !== (r = t.componentPrefix) && void 0 !== r ? r : this.componentPrefix;
        this.transformTitle = "transformTitle" in t ? t.transformTitle : this.transformTitle;
    }
}

class Separators {
    constructor(t = "@", i = "+", n = "/", s = "(", e = ")", o = "!", r = "(", l = ")", u = ",", h = "=", a = "+", c = "-", f = ".") {
        this.viewport = t;
        this.sibling = i;
        this.scope = n;
        this.groupStart = s;
        this.groupEnd = e;
        this.noScope = o;
        this.parameters = r;
        this.parametersEnd = l;
        this.parameterSeparator = u;
        this.parameterKeySeparator = h;
        this.add = a;
        this.clear = c;
        this.action = f;
    }
    static create(t = {}) {
        return new Separators(t.viewport, t.sibling, t.scope, t.groupStart, t.groupEnd, t.noScope, t.parameters, t.parametersEnd, t.parameterSeparator, t.parameterKeySeparator, t.add, t.clear, t.action);
    }
    static for(t) {
        return RouterOptions.for(t).separators;
    }
    apply(t = {}) {
        var i, n, s, e, o, r, l, u, h, a, c, f, d;
        this.viewport = null !== (i = t.viewport) && void 0 !== i ? i : this.viewport;
        this.sibling = null !== (n = t.sibling) && void 0 !== n ? n : this.sibling;
        this.scope = null !== (s = t.scope) && void 0 !== s ? s : this.scope;
        this.groupStart = null !== (e = t.groupStart) && void 0 !== e ? e : this.groupStart;
        this.groupEnd = null !== (o = t.groupEnd) && void 0 !== o ? o : this.groupEnd;
        this.noScope = null !== (r = t.noScope) && void 0 !== r ? r : this.noScope;
        this.parameters = null !== (l = t.parameters) && void 0 !== l ? l : this.parameters;
        this.parametersEnd = null !== (u = t.parametersEnd) && void 0 !== u ? u : this.parametersEnd;
        this.parameterSeparator = null !== (h = t.parameterSeparator) && void 0 !== h ? h : this.parameterSeparator;
        this.parameterKeySeparator = null !== (a = t.parameterKeySeparator) && void 0 !== a ? a : this.parameterKeySeparator;
        this.add = null !== (c = t.add) && void 0 !== c ? c : this.add;
        this.clear = null !== (f = t.clear) && void 0 !== f ? f : this.clear;
        this.action = null !== (d = t.action) && void 0 !== d ? d : this.action;
    }
}

class Indicators {
    constructor(t = "active", i = "navigating") {
        this.loadActive = t;
        this.viewportNavigating = i;
    }
    static create(t = {}) {
        return new Indicators(t.loadActive, t.viewportNavigating);
    }
    static for(t) {
        return RouterOptions.for(t).indicators;
    }
    apply(t = {}) {
        var i, n;
        this.loadActive = null !== (i = t.loadActive) && void 0 !== i ? i : this.loadActive;
        this.viewportNavigating = null !== (n = t.viewportNavigating) && void 0 !== n ? n : this.viewportNavigating;
    }
}

class RouterOptions {
    constructor(t = Separators.create(), i = Indicators.create(), n = true, s = null, e = true, o = 0, r = true, l = true, u = true, h = TitleOptions.create(), a = [ "guardedUnload", "swapped", "completed" ], c = "attach-next-detach-current", f = "", d = "abort") {
        this.separators = t;
        this.indicators = i;
        this.useUrlFragmentHash = n;
        this.basePath = s;
        this.useHref = e;
        this.statefulHistoryLength = o;
        this.useDirectRouting = r;
        this.useConfiguredRoutes = l;
        this.additiveInstructionDefault = u;
        this.title = h;
        this.navigationSyncStates = a;
        this.swapOrder = c;
        this.fallback = f;
        this.fallbackAction = d;
        this.registrationHooks = [];
    }
    static create(t = {}) {
        return new RouterOptions(Separators.create(t.separators), Indicators.create(t.indicators), t.useUrlFragmentHash, t.basePath, t.useHref, t.statefulHistoryLength, t.useDirectRouting, t.useConfiguredRoutes, t.additiveInstructionDefault, TitleOptions.create(t.title), t.navigationSyncStates, t.swapOrder, t.fallback, t.fallbackAction);
    }
    static for(t) {
        if (t instanceof RouterConfiguration) return t.options;
        if (t instanceof Router) t = t.configuration; else t = t.get(st);
        return t.options;
    }
    apply(t) {
        var i, n, s, e, o, r, l, u, h, a, c;
        t = null !== t && void 0 !== t ? t : {};
        this.separators.apply(t.separators);
        this.indicators.apply(t.indicators);
        this.useUrlFragmentHash = null !== (i = t.useUrlFragmentHash) && void 0 !== i ? i : this.useUrlFragmentHash;
        this.basePath = null !== (n = t.basePath) && void 0 !== n ? n : this.basePath;
        this.useHref = null !== (s = t.useHref) && void 0 !== s ? s : this.useHref;
        this.statefulHistoryLength = null !== (e = t.statefulHistoryLength) && void 0 !== e ? e : this.statefulHistoryLength;
        this.useDirectRouting = null !== (o = t.useDirectRouting) && void 0 !== o ? o : this.useDirectRouting;
        this.useConfiguredRoutes = null !== (r = t.useConfiguredRoutes) && void 0 !== r ? r : this.useConfiguredRoutes;
        this.additiveInstructionDefault = null !== (l = t.additiveInstructionDefault) && void 0 !== l ? l : this.additiveInstructionDefault;
        this.title.apply(t.title);
        this.navigationSyncStates = null !== (u = t.navigationSyncStates) && void 0 !== u ? u : this.navigationSyncStates;
        this.swapOrder = null !== (h = t.swapOrder) && void 0 !== h ? h : this.swapOrder;
        this.fallback = null !== (a = t.fallback) && void 0 !== a ? a : this.fallback;
        this.fallbackAction = null !== (c = t.fallbackAction) && void 0 !== c ? c : this.fallbackAction;
        if (Array.isArray(t.hooks)) if (void 0 !== this.routerConfiguration) t.hooks.forEach((t => this.routerConfiguration.addHook(t.hook, t.options))); else this.registrationHooks = t.hooks;
    }
    setRouterConfiguration(t) {
        this.routerConfiguration = t;
        this.registrationHooks.forEach((t => this.routerConfiguration.addHook(t.hook, t.options)));
        this.registrationHooks.length = 0;
    }
}

var P;

(function(t) {
    t["none"] = "none";
    t["string"] = "string";
    t["array"] = "array";
    t["object"] = "object";
})(P || (P = {}));

class InstructionParameters {
    constructor() {
        this.parametersString = null;
        this.parametersRecord = null;
        this.parametersList = null;
        this.parametersType = "none";
    }
    get none() {
        return "none" === this.parametersType;
    }
    static create(t) {
        const i = new InstructionParameters;
        i.set(t);
        return i;
    }
    static parse(t, i, n = false) {
        if (null == i || 0 === i.length) return [];
        const s = Separators.for(t);
        const e = s.parameterSeparator;
        const o = s.parameterKeySeparator;
        if ("string" === typeof i) {
            const t = [];
            const s = i.split(e);
            for (const i of s) {
                let s;
                let e;
                [s, e] = i.split(o);
                if (void 0 === e) {
                    e = n ? decodeURIComponent(s) : s;
                    s = void 0;
                } else if (n) {
                    s = decodeURIComponent(s);
                    e = decodeURIComponent(e);
                }
                t.push({
                    key: s,
                    value: e
                });
            }
            return t;
        }
        if (Array.isArray(i)) return i.map((t => ({
            key: void 0,
            value: t
        })));
        const r = Object.keys(i);
        r.sort();
        return r.map((t => ({
            key: t,
            value: i[t]
        })));
    }
    get typedParameters() {
        switch (this.parametersType) {
          case "string":
            return this.parametersString;

          case "array":
            return this.parametersList;

          case "object":
            return this.parametersRecord;

          default:
            return null;
        }
    }
    static stringify(t, i, n = false) {
        if (!Array.isArray(i) || 0 === i.length) return "";
        const s = Separators.for(t);
        return i.map((t => {
            const i = void 0 !== t.key && n ? encodeURIComponent(t.key) : t.key;
            const e = n ? encodeURIComponent(t.value) : t.value;
            return void 0 !== i && i !== e ? i + s.parameterKeySeparator + e : e;
        })).join(s.parameterSeparator);
    }
    static contains(t, i) {
        return Object.keys(i).every((n => i[n] === t[n]));
    }
    parameters(t) {
        return InstructionParameters.parse(t, this.typedParameters);
    }
    set(t) {
        this.parametersString = null;
        this.parametersList = null;
        this.parametersRecord = null;
        if (null == t || "" === t) {
            this.parametersType = "none";
            t = null;
        } else if ("string" === typeof t) {
            this.parametersType = "string";
            this.parametersString = t;
        } else if (Array.isArray(t)) {
            this.parametersType = "array";
            this.parametersList = t;
        } else {
            this.parametersType = "object";
            this.parametersRecord = t;
        }
    }
    get(t, i) {
        if (void 0 === i) return this.parameters(t);
        const n = this.parameters(t).filter((t => t.key === i)).map((t => t.value));
        if (0 === n.length) return;
        return 1 === n.length ? n[0] : n;
    }
    addParameters(t) {
        if ("none" === this.parametersType) return this.set(t);
        if ("object" !== this.parametersType) throw new Error("Can't add object parameters to existing non-object parameters!");
        this.set({
            ...this.parametersRecord,
            ...t
        });
    }
    toSpecifiedParameters(t, i) {
        i = null !== i && void 0 !== i ? i : [];
        const n = this.parameters(t);
        const s = {};
        for (const t of i) {
            let i = n.findIndex((i => i.key === t));
            if (i >= 0) {
                const [e] = n.splice(i, 1);
                s[t] = e.value;
            } else {
                i = n.findIndex((t => void 0 === t.key));
                if (i >= 0) {
                    const [e] = n.splice(i, 1);
                    s[t] = e.value;
                }
            }
        }
        for (const t of n.filter((t => void 0 !== t.key))) s[t.key] = t.value;
        let e = i.length;
        for (const t of n.filter((t => void 0 === t.key))) s[e++] = t.value;
        return s;
    }
    toSortedParameters(t, i) {
        i = i || [];
        const n = this.parameters(t);
        const s = [];
        for (const t of i) {
            let i = n.findIndex((i => i.key === t));
            if (i >= 0) {
                const t = {
                    ...n.splice(i, 1)[0]
                };
                t.key = void 0;
                s.push(t);
            } else {
                i = n.findIndex((t => void 0 === t.key));
                if (i >= 0) {
                    const t = {
                        ...n.splice(i, 1)[0]
                    };
                    s.push(t);
                } else s.push({
                    value: void 0
                });
            }
        }
        const e = n.filter((t => void 0 !== t.key));
        e.sort(((t, i) => (t.key || "") < (i.key || "") ? 1 : (i.key || "") < (t.key || "") ? -1 : 0));
        s.push(...e);
        s.push(...n.filter((t => void 0 === t.key)));
        return s;
    }
    same(t, i, n) {
        const s = null !== n ? n.parameters : [];
        const e = this.toSpecifiedParameters(t, s);
        const o = i.toSpecifiedParameters(t, s);
        return Object.keys(e).every((t => e[t] === o[t])) && Object.keys(o).every((t => o[t] === e[t]));
    }
}

class InstructionComponent {
    constructor() {
        this.name = null;
        this.type = null;
        this.instance = null;
        this.promise = null;
        this.func = null;
    }
    static create(t) {
        const i = new InstructionComponent;
        i.set(t);
        return i;
    }
    static isName(t) {
        return "string" === typeof t;
    }
    static isDefinition(t) {
        return o.isType(t.Type);
    }
    static isType(t) {
        return o.isType(t);
    }
    static isInstance(t) {
        return r(t);
    }
    static isAppelation(t) {
        return InstructionComponent.isName(t) || InstructionComponent.isType(t) || InstructionComponent.isInstance(t);
    }
    static getName(t) {
        if (InstructionComponent.isName(t)) return t; else if (InstructionComponent.isType(t)) return o.getDefinition(t).name; else return InstructionComponent.getName(t.constructor);
    }
    static getType(t) {
        if (InstructionComponent.isName(t)) return null; else if (InstructionComponent.isType(t)) return t; else return t.constructor;
    }
    static getInstance(t) {
        if (InstructionComponent.isName(t) || InstructionComponent.isType(t)) return null; else return t;
    }
    set(t) {
        let i = null;
        let n = null;
        let s = null;
        let e = null;
        let o = null;
        if (t instanceof Promise) e = t; else if (InstructionComponent.isName(t)) i = InstructionComponent.getName(t); else if (InstructionComponent.isType(t)) {
            i = this.getNewName(t);
            n = InstructionComponent.getType(t);
        } else if (InstructionComponent.isInstance(t)) {
            i = this.getNewName(InstructionComponent.getType(t));
            n = InstructionComponent.getType(t);
            s = InstructionComponent.getInstance(t);
        } else if ("function" === typeof t) o = t;
        this.name = i;
        this.type = n;
        this.instance = s;
        this.promise = e;
        this.func = o;
    }
    resolve(t) {
        if (null !== this.func) this.set(this.func(t));
        if (!(this.promise instanceof Promise)) return;
        return this.promise.then((t => {
            if (InstructionComponent.isAppelation(t)) {
                this.set(t);
                return;
            }
            if (null != t.default) {
                this.set(t.default);
                return;
            }
            const i = Object.keys(t).filter((t => !t.startsWith("__")));
            if (0 === i.length) throw new Error(`Failed to load component Type from resolved Promise since no export was specified.`);
            if (i.length > 1) throw new Error(`Failed to load component Type from resolved Promise since no 'default' export was specified when having multiple exports.`);
            const n = i[0];
            this.set(t[n]);
        }));
    }
    get none() {
        return !this.isName() && !this.isType() && !this.isInstance() && !this.isFunction() && !this.isPromise();
    }
    isName() {
        return !!this.name && !this.isType() && !this.isInstance();
    }
    isType() {
        return null !== this.type && !this.isInstance();
    }
    isInstance() {
        return null !== this.instance;
    }
    isPromise() {
        return null !== this.promise;
    }
    isFunction() {
        return null !== this.func;
    }
    toType(t, i) {
        void this.resolve(i);
        if (null !== this.type) return this.type;
        if (null !== this.name && "string" === typeof this.name) {
            if (null === t) throw new Error(`No container available when trying to resolve component '${this.name}'!`);
            if (t.has(o.keyFrom(this.name), true)) {
                const i = t.getResolver(o.keyFrom(this.name));
                if (null !== i && void 0 !== i.getFactory) {
                    const n = i.getFactory(t);
                    if (n) return n.Type;
                }
            }
        }
        return null;
    }
    toInstance(t, i, n, s) {
        void this.resolve(s);
        if (null !== this.instance) return this.instance;
        if (null == t) return null;
        const e = t.createChild();
        const r = this.isType() ? e.get(this.type) : e.get(o.keyFrom(this.name));
        if (null == r) {
            console.warn("Failed to create instance when trying to resolve component", this.name, this.type, "=>", r);
            throw new Error(`Failed to create instance when trying to resolve component '${this.name}'!`);
        }
        const u = l.$el(e, r, n, null);
        u.parent = i;
        return r;
    }
    same(t, i = false) {
        return i ? this.type === t.type : this.name === t.name;
    }
    getNewName(t) {
        if (null === this.name) return InstructionComponent.getName(t);
        return this.name;
    }
}

function T(t, i) {
    const n = [];
    let s = t.findIndex(i);
    while (s >= 0) {
        n.push(t.splice(s, 1)[0]);
        s = t.findIndex(i);
    }
    return n;
}

function V(t, i = false) {
    return t.filter(((t, n, s) => (i || null != t) && s.indexOf(t) === n));
}

class OpenPromise {
    constructor() {
        this.isPending = true;
        this.promise = new Promise(((t, i) => {
            this.t = t;
            this.i = i;
        }));
    }
    resolve(t) {
        this.t(t);
        this.isPending = false;
    }
    reject(t) {
        this.i(t);
        this.isPending = false;
    }
}

class Runner {
    constructor() {
        this.isDone = false;
        this.isCancelled = false;
        this.isResolved = false;
        this.isRejected = false;
        this.isAsync = false;
    }
    static run(t, ...i) {
        var n, s;
        if (0 === (null !== (n = null === i || void 0 === i ? void 0 : i.length) && void 0 !== n ? n : 0)) return null === i || void 0 === i ? void 0 : i[0];
        let e = false;
        if (null === t) {
            t = new Step;
            e = true;
        }
        const o = new Step(i.shift());
        Runner.connect(t, o, (null !== (s = null === t || void 0 === t ? void 0 : t.runParallel) && void 0 !== s ? s : false) || e);
        if (i.length > 0) Runner.add(o, false, ...i);
        if (e) {
            Runner.process(t);
            if (t.result instanceof Promise) this.runners.set(t.result, t);
            return t.result;
        }
        return o;
    }
    static runParallel(t, ...i) {
        var n, s;
        if (0 === (null !== (n = null === i || void 0 === i ? void 0 : i.length) && void 0 !== n ? n : 0)) return [];
        let e = false;
        if (null === t) {
            t = new Step;
            e = true;
        } else t = Runner.connect(t, new Step, true);
        Runner.add(t, true, ...i);
        if (e) Runner.process(t);
        if (t.result instanceof Promise) this.runners.set(t.result, t);
        return e ? null !== (s = t.result) && void 0 !== s ? s : [] : t;
    }
    static step(t) {
        if (t instanceof Promise) return Runner.runners.get(t);
    }
    static cancel(t) {
        const i = Runner.step(t);
        if (void 0 !== i) i.cancel();
    }
    static add(t, i, ...n) {
        let s = new Step(n.shift(), i);
        if (null !== t) s = Runner.connect(t, s, i);
        const e = s;
        while (n.length > 0) s = Runner.connect(s, new Step(n.shift(), i), false);
        return e;
    }
    static connect(t, i, n) {
        if (!n) {
            const n = t.next;
            t.next = i;
            i.previous = t;
            i.next = n;
            if (null !== n) {
                n.previous = i;
                n.parent = null;
            }
        } else {
            const n = t.child;
            t.child = i;
            i.parent = t;
            i.next = n;
            if (null !== n) {
                n.parent = null;
                n.previous = i;
            }
        }
        return i;
    }
    static process(t) {
        const i = t.root;
        while (null !== t && !t.isDoing && !t.isDone) {
            i.current = t;
            if (t.isParallelParent) {
                t.isDone = true;
                let i = t.child;
                while (null !== i) {
                    Runner.process(i);
                    i = i.next;
                }
            } else {
                t.isDoing = true;
                t.value = t.step;
                while (t.value instanceof Function && !t.isCancelled && !t.isExited && !t.isDone) t.value = t.value(t);
                if (!t.isCancelled) if (t.value instanceof Promise) {
                    const n = t.value;
                    Runner.ensurePromise(i);
                    ((t, i) => {
                        i.then((i => {
                            t.value = i;
                            Runner.settlePromise(t);
                            t.isDone = true;
                            t.isDoing = false;
                            const n = t.nextToDo();
                            if (null !== n && !t.isExited) Runner.process(n); else if (t.root.doneAll || t.isExited) Runner.settlePromise(t.root);
                        })).catch((t => {
                            throw t;
                        }));
                    })(t, n);
                } else {
                    t.isDone = true;
                    t.isDoing = false;
                    if (!t.isExited) t = t.nextToDo(); else t = null;
                }
            }
        }
        if (i.isCancelled) Runner.settlePromise(i, "reject"); else if (i.doneAll || i.isExited) Runner.settlePromise(i);
    }
    static ensurePromise(t) {
        if (null === t.finally) {
            t.finally = new OpenPromise;
            t.promise = t.finally.promise;
            return true;
        }
        return false;
    }
    static settlePromise(t, i = "resolve") {
        var n, s, e, o;
        if (null !== (s = null === (n = t.finally) || void 0 === n ? void 0 : n.isPending) && void 0 !== s ? s : false) {
            t.promise = null;
            switch (i) {
              case "resolve":
                null === (e = t.finally) || void 0 === e ? void 0 : e.resolve(t.result);
                break;

              case "reject":
                null === (o = t.finally) || void 0 === o ? void 0 : o.reject(t.result);
                break;
            }
        }
    }
}

Runner.runners = new WeakMap;

Runner.roots = {};

class Step {
    constructor(t = void 0, i = false) {
        this.step = t;
        this.runParallel = i;
        this.promise = null;
        this.previous = null;
        this.next = null;
        this.parent = null;
        this.child = null;
        this.current = null;
        this.finally = null;
        this.isDoing = false;
        this.isDone = false;
        this.isCancelled = false;
        this.isExited = false;
        this.exited = null;
        this.id = "-1";
        this.id = `${Step.id++}`;
    }
    get isParallelParent() {
        var t, i;
        return null !== (i = null === (t = this.child) || void 0 === t ? void 0 : t.runParallel) && void 0 !== i ? i : false;
    }
    get result() {
        var t, i;
        if (null !== this.promise) return this.promise;
        if (null !== this.child) if (this.isParallelParent) {
            const t = [];
            let i = this.child;
            while (null !== i) {
                t.push(i.result);
                i = i.next;
            }
            return t;
        } else return this === this.root && null !== this.exited ? this.exited.result : null === (i = null === (t = this.child) || void 0 === t ? void 0 : t.tail) || void 0 === i ? void 0 : i.result;
        let n = this.value;
        while (n instanceof Step) n = n.result;
        return n;
    }
    get asValue() {
        return this.result;
    }
    get previousValue() {
        var t, i, n, s;
        return this.runParallel ? null === (n = null === (i = null === (t = this.head.parent) || void 0 === t ? void 0 : t.parent) || void 0 === i ? void 0 : i.previous) || void 0 === n ? void 0 : n.result : null === (s = this.previous) || void 0 === s ? void 0 : s.result;
    }
    get name() {
        let t = `${this.id}`;
        if (this.runParallel) t = `:${t}`;
        if (this.value instanceof Promise || this.promise instanceof Promise) t = `${t}*`;
        if (null !== this.finally) t = `${t}*`;
        if (null !== this.child) t = `${t}>`;
        if (this.isDone) t = `(${t})`;
        return t;
    }
    get root() {
        let t = this.head;
        while (null !== t.parent) t = t.parent.head;
        return t;
    }
    get head() {
        let t = this;
        while (null !== t.previous) t = t.previous;
        return t;
    }
    get tail() {
        let t = this;
        while (null !== t.next) t = t.next;
        return t;
    }
    get done() {
        if (!this.isDone) return false;
        let t = this.child;
        while (null !== t) {
            if (!t.done) return false;
            t = t.next;
        }
        return true;
    }
    get doneAll() {
        if (!this.isDone || null !== this.child && !this.child.doneAll || null !== this.next && !this.next.doneAll) return false;
        return true;
    }
    cancel(t = true) {
        var i, n;
        if (t) return this.root.cancel(false);
        if (this.isCancelled) return false;
        this.isCancelled = true;
        null === (i = this.child) || void 0 === i ? void 0 : i.cancel(false);
        null === (n = this.next) || void 0 === n ? void 0 : n.cancel(false);
        return true;
    }
    exit(t = true) {
        var i, n;
        if (t) {
            this.root.exited = this;
            return this.root.exit(false);
        }
        if (this.isExited) return false;
        this.isExited = true;
        null === (i = this.child) || void 0 === i ? void 0 : i.exit(false);
        null === (n = this.next) || void 0 === n ? void 0 : n.exit(false);
        return true;
    }
    nextToDo() {
        if (null !== this.child && !this.child.isDoing && !this.child.isDone) return this.child;
        if (this.runParallel && !this.head.parent.done) return null;
        return this.nextOrUp();
    }
    nextOrUp() {
        var t;
        let i = this.next;
        while (null !== i) {
            if (!i.isDoing && !i.isDone) return i;
            i = i.next;
        }
        const n = null !== (t = this.head.parent) && void 0 !== t ? t : null;
        if (null === n || !n.done) return null;
        return n.nextOrUp();
    }
    get path() {
        var t, i;
        return `${null !== (i = null === (t = this.head.parent) || void 0 === t ? void 0 : t.path) && void 0 !== i ? i : ""}/${this.name}`;
    }
    get tree() {
        let t = "";
        let i = this.head;
        let n = i.parent;
        let s = "";
        while (null !== n) {
            s = `${n.path}${s}`;
            n = n.head.parent;
        }
        do {
            t += `${s}/${i.name}\n`;
            if (i === this) break;
            i = i.next;
        } while (null !== i);
        return t;
    }
    get report() {
        var t, i, n, s;
        let e = `${this.path}\n`;
        e += null !== (i = null === (t = this.child) || void 0 === t ? void 0 : t.report) && void 0 !== i ? i : "";
        e += null !== (s = null === (n = this.next) || void 0 === n ? void 0 : n.report) && void 0 !== s ? s : "";
        return e;
    }
}

Step.id = 0;

class Route {
    constructor(t, i, n, s, e, o, r, l) {
        this.path = t;
        this.id = i;
        this.redirectTo = n;
        this.instructions = s;
        this.caseSensitive = e;
        this.title = o;
        this.reloadBehavior = r;
        this.data = l;
    }
    static isConfigured(t) {
        return E.hasOwn(Route.resourceKey, t) || "parameters" in t || "title" in t;
    }
    static configure(t, i) {
        const n = Route.create(t, i);
        E.define(Route.resourceKey, n, i);
        return i;
    }
    static getConfiguration(t) {
        var i;
        const n = null !== (i = E.getOwn(Route.resourceKey, t)) && void 0 !== i ? i : {};
        if (Array.isArray(t.parameters)) n.parameters = t.parameters;
        if ("title" in t) n.title = t.title;
        return n instanceof Route ? n : Route.create(n, t);
    }
    static create(t, i = null) {
        var n, s, e, r, l, u, h, a, c;
        if (null !== i) t = Route.transferTypeToComponent(t, i);
        if (o.isType(t)) t = Route.getConfiguration(t); else if (null === i) t = {
            ...t
        };
        const f = Route.transferIndividualIntoInstructions(t);
        Route.validateRouteConfiguration(f);
        let d = f.path;
        if (Array.isArray(d)) d = d.join(",");
        return new Route(null !== (n = f.path) && void 0 !== n ? n : "", null !== (e = null !== (s = f.id) && void 0 !== s ? s : d) && void 0 !== e ? e : null, null !== (r = f.redirectTo) && void 0 !== r ? r : null, null !== (l = f.instructions) && void 0 !== l ? l : null, null !== (u = f.caseSensitive) && void 0 !== u ? u : false, null !== (h = f.title) && void 0 !== h ? h : null, null !== (a = f.reloadBehavior) && void 0 !== a ? a : null, null !== (c = f.data) && void 0 !== c ? c : null);
    }
    static transferTypeToComponent(t, i) {
        var n;
        if (o.isType(t)) throw new Error(`Invalid route configuration: A component ` + `can't be specified in a component route configuration.`);
        const s = null !== (n = {
            ...t
        }) && void 0 !== n ? n : {};
        if ("component" in s || "instructions" in s) throw new Error(`Invalid route configuration: The 'component' and 'instructions' properties ` + `can't be specified in a component route configuration.`);
        if (!("redirectTo" in s)) s.component = i;
        if (!("path" in s) && !("redirectTo" in s)) s.path = o.getDefinition(i).name;
        return s;
    }
    static transferIndividualIntoInstructions(t) {
        var i, n, s, e;
        if (null === t || void 0 === t) throw new Error(`Invalid route configuration: expected an object.`);
        if (null !== (null !== (i = t.component) && void 0 !== i ? i : null) || null !== (null !== (n = t.viewport) && void 0 !== n ? n : null) || null !== (null !== (s = t.parameters) && void 0 !== s ? s : null) || null !== (null !== (e = t.children) && void 0 !== e ? e : null)) {
            if (null != t.instructions) throw new Error(`Invalid route configuration: The 'instructions' property can't be used together with ` + `the 'component', 'viewport', 'parameters' or 'children' properties.`);
            t.instructions = [ {
                component: t.component,
                viewport: t.viewport,
                parameters: t.parameters,
                children: t.children
            } ];
        }
        return t;
    }
    static validateRouteConfiguration(t) {
        if (null === t.redirectTo && null === t.instructions) throw new Error(`Invalid route configuration: either 'redirectTo' or 'instructions' ` + `need to be specified.`);
    }
}

Route.resourceKey = t.resource.keyFor("route");

const A = {
    name: t.resource.keyFor("routes"),
    isConfigured(t) {
        return E.hasOwn(A.name, t) || "routes" in t;
    },
    configure(t, i) {
        const n = t.map((t => Route.create(t)));
        E.define(A.name, n, i);
        return i;
    },
    getConfiguration(t) {
        const i = t;
        const n = [];
        const s = E.getOwn(A.name, t);
        if (Array.isArray(s)) n.push(...s);
        if (Array.isArray(i.routes)) n.push(...i.routes);
        return n.map((t => t instanceof Route ? t : Route.create(t)));
    }
};

function O(t) {
    return function(i) {
        return A.configure(t, i);
    };
}

class ViewportScopeContent extends EndpointContent {}

class ViewportScope extends Endpoint$1 {
    constructor(t, i, n, s, e, o = null, r = {
        catches: [],
        source: null
    }) {
        super(t, i, n);
        this.rootComponentType = o;
        this.options = r;
        this.instruction = null;
        this.available = true;
        this.sourceItem = null;
        this.sourceItemIndex = -1;
        this.remove = false;
        this.add = false;
        this.contents.push(new ViewportScopeContent(t, this, s, e));
        if (this.catches.length > 0) this.instruction = RoutingInstruction.create(this.catches[0], this.name);
    }
    get isEmpty() {
        return null === this.instruction;
    }
    get passThroughScope() {
        return null === this.rootComponentType && 0 === this.catches.length;
    }
    get siblings() {
        const t = this.connectedScope.parent;
        if (null === t) return [ this ];
        return t.enabledChildren.filter((t => t.isViewportScope && t.endpoint.name === this.name)).map((t => t.endpoint));
    }
    get source() {
        var t;
        return null !== (t = this.options.source) && void 0 !== t ? t : null;
    }
    get catches() {
        var t;
        let i = null !== (t = this.options.catches) && void 0 !== t ? t : [];
        if ("string" === typeof i) i = i.split(",");
        return i;
    }
    get default() {
        if (this.catches.length > 0) return this.catches[0];
    }
    toString() {
        var t, i, n, s;
        const e = null !== (i = null === (t = this.instruction) || void 0 === t ? void 0 : t.component.name) && void 0 !== i ? i : "";
        const o = null !== (s = null === (n = this.getNextContent()) || void 0 === n ? void 0 : n.instruction.component.name) && void 0 !== s ? s : "";
        return `vs:${this.name}[${e}->${o}]`;
    }
    setNextContent(t, i) {
        t.endpoint.set(this);
        this.remove = t.isClear(this.router) || t.isClearAll(this.router);
        this.add = t.isAdd(this.router) && Array.isArray(this.source);
        if (this.add) t.component.name = null;
        if (void 0 !== this.default && null === t.component.name) t.component.name = this.default;
        this.contents.push(new ViewportScopeContent(this.router, this, this.owningScope, this.scope.hasScope, t, i));
        return "swap";
    }
    transition(t) {
        Runner.run(null, (() => t.addEndpointState(this, "guardedUnload")), (() => t.addEndpointState(this, "guardedLoad")), (() => t.addEndpointState(this, "guarded")), (() => t.addEndpointState(this, "loaded")), (() => t.addEndpointState(this, "unloaded")), (() => t.addEndpointState(this, "routed")), (() => t.addEndpointState(this, "swapped")), (() => t.addEndpointState(this, "completed")));
    }
    finalizeContentChange(t, i) {
        var n;
        const s = this.contents.findIndex((i => i.navigation === t.navigation));
        let e = this.contents[s];
        if (this.remove) {
            const t = new ViewportScopeContent(this.router, this, this.owningScope, this.scope.hasScope);
            this.contents.splice(s, 1, t);
            e.delete();
            e = t;
        }
        e.completed = true;
        let o = 0;
        for (let t = 0, i = s; t < i; t++) {
            if (!(null !== (n = this.contents[0].navigation.completed) && void 0 !== n ? n : false)) break;
            o++;
        }
        this.contents.splice(0, o);
        if (this.remove && Array.isArray(this.source)) this.removeSourceItem();
    }
    cancelContentChange(t, i) {
        const n = this.contents.findIndex((i => i.navigation === t.navigation));
        this.contents.splice(n, 1);
        if (this.add) {
            const t = this.source.indexOf(this.sourceItem);
            this.source.splice(t, 1);
            this.sourceItem = null;
        }
    }
    acceptSegment(t) {
        if (null === t && void 0 === t || 0 === t.length) return true;
        if (t === RoutingInstruction.clear(this.router) || t === RoutingInstruction.add(this.router) || t === this.name) return true;
        if (0 === this.catches.length) return true;
        if (this.catches.includes(t)) return true;
        if (this.catches.filter((t => t.includes("*"))).length) return true;
        return false;
    }
    binding() {
        const t = this.source || [];
        if (t.length > 0 && null === this.sourceItem) this.sourceItem = this.getAvailableSourceItem();
    }
    unbinding() {
        if (null !== this.sourceItem && null !== this.source) T(this.source, (t => t === this.sourceItem));
        this.sourceItem = null;
    }
    getAvailableSourceItem() {
        if (null === this.source) return null;
        const t = this.siblings;
        for (const i of this.source) if (t.every((t => t.sourceItem !== i))) return i;
        return null;
    }
    addSourceItem() {
        const t = {};
        this.source.push(t);
        return t;
    }
    removeSourceItem() {
        this.sourceItemIndex = this.source.indexOf(this.sourceItem);
        if (this.sourceItemIndex >= 0) this.source.splice(this.sourceItemIndex, 1);
    }
    getRoutes() {
        if (null !== this.rootComponentType) {
            const t = this.rootComponentType.constructor === this.rootComponentType.constructor.constructor ? this.rootComponentType : this.rootComponentType.constructor;
            return A.getConfiguration(t);
        }
        return null;
    }
}

class StoredNavigation {
    constructor(t = {
        instruction: "",
        fullStateInstruction: ""
    }) {
        this.instruction = t.instruction;
        this.fullStateInstruction = t.fullStateInstruction;
        this.scope = t.scope;
        this.index = t.index;
        this.firstEntry = t.firstEntry;
        this.path = t.path;
        this.title = t.title;
        this.query = t.query;
        this.fragment = t.fragment;
        this.parameters = t.parameters;
        this.data = t.data;
    }
    toStoredNavigation() {
        return {
            instruction: this.instruction,
            fullStateInstruction: this.fullStateInstruction,
            scope: this.scope,
            index: this.index,
            firstEntry: this.firstEntry,
            path: this.path,
            title: this.title,
            query: this.query,
            fragment: this.fragment,
            parameters: this.parameters,
            data: this.data
        };
    }
}

class NavigationFlags {
    constructor() {
        this.first = false;
        this.new = false;
        this.refresh = false;
        this.forward = false;
        this.back = false;
        this.replace = false;
    }
}

class Navigation extends StoredNavigation {
    constructor(t = {
        instruction: "",
        fullStateInstruction: ""
    }) {
        var i, n, s, e, o, r;
        super(t);
        this.navigation = new NavigationFlags;
        this.repeating = false;
        this.previous = null;
        this.fromBrowser = false;
        this.origin = null;
        this.replacing = false;
        this.refreshing = false;
        this.untracked = false;
        this.process = null;
        this.completed = true;
        this.fromBrowser = null !== (i = t.fromBrowser) && void 0 !== i ? i : this.fromBrowser;
        this.origin = null !== (n = t.origin) && void 0 !== n ? n : this.origin;
        this.replacing = null !== (s = t.replacing) && void 0 !== s ? s : this.replacing;
        this.refreshing = null !== (e = t.refreshing) && void 0 !== e ? e : this.refreshing;
        this.untracked = null !== (o = t.untracked) && void 0 !== o ? o : this.untracked;
        this.historyMovement = null !== (r = t.historyMovement) && void 0 !== r ? r : this.historyMovement;
        this.process = null;
        this.timestamp = Date.now();
    }
    get useFullStateInstruction() {
        var t, i, n;
        return (null !== (t = this.navigation.back) && void 0 !== t ? t : false) || (null !== (i = this.navigation.forward) && void 0 !== i ? i : false) || (null !== (n = this.navigation.refresh) && void 0 !== n ? n : false);
    }
    static create(t = {
        instruction: "",
        fullStateInstruction: ""
    }) {
        return new Navigation(t);
    }
}

class AwaitableMap {
    constructor() {
        this.map = new Map;
    }
    set(t, i) {
        const n = this.map.get(t);
        if (n instanceof OpenPromise) n.resolve(i);
        this.map.set(t, i);
    }
    delete(t) {
        const i = this.map.get(t);
        if (i instanceof OpenPromise) i.reject();
        this.map.delete(t);
    }
    await(t) {
        if (!this.map.has(t)) {
            const i = new OpenPromise;
            this.map.set(t, i);
            return i.promise;
        }
        const i = this.map.get(t);
        if (i instanceof OpenPromise) return i.promise;
        return i;
    }
    has(t) {
        return this.map.has(t) && !(this.map.get(t) instanceof OpenPromise);
    }
    clone() {
        const t = new AwaitableMap;
        t.map = new Map(this.map);
        return t;
    }
}

class ViewportContent extends EndpointContent {
    constructor(t, i, n, s, e = RoutingInstruction.create(""), o = Navigation.create({
        instruction: "",
        fullStateInstruction: ""
    }), r = null) {
        super(t, i, n, s, e, o);
        this.router = t;
        this.instruction = e;
        this.navigation = o;
        this.contentStates = new AwaitableMap;
        this.fromCache = false;
        this.fromHistory = false;
        this.reload = false;
        this.activatedResolve = null;
        if (!this.instruction.component.isType() && null != (null === r || void 0 === r ? void 0 : r.container)) this.instruction.component.type = this.toComponentType(r.container);
    }
    get componentInstance() {
        return this.instruction.component.instance;
    }
    get reloadBehavior() {
        var t, i;
        if (this.instruction.route instanceof FoundRoute && null !== (null === (t = this.instruction.route.match) || void 0 === t ? void 0 : t.reloadBehavior)) return null === (i = this.instruction.route.match) || void 0 === i ? void 0 : i.reloadBehavior;
        return null !== this.instruction.component.instance && "reloadBehavior" in this.instruction.component.instance && void 0 !== this.instruction.component.instance.reloadBehavior ? this.instruction.component.instance.reloadBehavior : "default";
    }
    get controller() {
        var t;
        return null === (t = this.instruction.component.instance) || void 0 === t ? void 0 : t.$controller;
    }
    equalComponent(t) {
        return this.instruction.sameComponent(this.router, t.instruction);
    }
    equalParameters(t) {
        var i, n;
        return this.instruction.sameComponent(this.router, t.instruction, true) && (null !== (i = this.navigation.query) && void 0 !== i ? i : "") === (null !== (n = t.navigation.query) && void 0 !== n ? n : "");
    }
    isCacheEqual(t) {
        return this.instruction.sameComponent(this.router, t.instruction, true);
    }
    contentController(t) {
        return l.$el(t.container.createChild(), this.instruction.component.instance, t.element, null);
    }
    createComponent(t, i, n) {
        var s;
        if (this.contentStates.has("created")) return;
        if (!this.fromCache && !this.fromHistory) try {
            this.instruction.component.set(this.toComponentInstance(t.container, t.controller, t.element));
        } catch (e) {
            if ("" !== (null !== i && void 0 !== i ? i : "")) {
                if ("process-children" === n) this.instruction.parameters.set([ this.instruction.component.name ]); else {
                    this.instruction.parameters.set([ null !== (s = this.instruction.unparsed) && void 0 !== s ? s : this.instruction.component.name ]);
                    this.instruction.nextScopeInstructions = null;
                }
                this.instruction.component.set(i);
                try {
                    this.instruction.component.set(this.toComponentInstance(t.container, t.controller, t.element));
                } catch (t) {
                    throw new Error(`'${this.instruction.component.name}' did not match any configured route or registered component name - did you forget to add the component '${this.instruction.component.name}' to the dependencies or to register it as a global dependency?`);
                }
            } else throw new Error(`'${this.instruction.component.name}' did not match any configured route or registered component name - did you forget to add the component '${this.instruction.component.name}' to the dependencies or to register it as a global dependency?`);
        }
        this.contentStates.set("created", void 0);
    }
    canLoad() {
        var t, i, n;
        if (!this.contentStates.has("created") || this.contentStates.has("checkedLoad") && !this.reload) return true;
        const s = this.instruction.component.instance;
        if (null == s) return true;
        this.contentStates.set("checkedLoad", void 0);
        const e = null === (n = null === (i = null === (t = this.endpoint.parentViewport) || void 0 === t ? void 0 : t.getTimeContent(this.navigation.timestamp)) || void 0 === i ? void 0 : i.instruction) || void 0 === n ? void 0 : n.typeParameters(this.router);
        const o = this.instruction.typeParameters(this.router);
        const r = {
            ...this.navigation.parameters,
            ...e,
            ...o
        };
        const l = this.getLifecycleHooks(s, "canLoad").map((t => i => {
            const n = t(s, r, this.instruction, this.navigation);
            if ("boolean" === typeof n) {
                if (false === n) i.exit();
                return n;
            }
            if ("string" === typeof n) {
                i.exit();
                return [ RoutingInstruction.create(n, this.endpoint) ];
            }
            return n;
        }));
        if (0 !== l.length) {
            const t = Runner.run(null, ...l);
            if (true !== t) {
                if (false === t) return false;
                if ("string" === typeof t) return [ RoutingInstruction.create(t, this.endpoint) ];
                return t;
            }
        }
        if (null == s.canLoad) return true;
        const u = s.canLoad(r, this.instruction, this.navigation);
        if ("boolean" === typeof u) return u;
        if ("string" === typeof u) return [ RoutingInstruction.create(u, this.endpoint) ];
        return u;
    }
    canUnload(t) {
        if (this.contentStates.has("checkedUnload") && !this.reload) return true;
        this.contentStates.set("checkedUnload", void 0);
        if (!this.contentStates.has("loaded")) return true;
        const i = this.instruction.component.instance;
        if (null === t) t = Navigation.create({
            instruction: "",
            fullStateInstruction: "",
            previous: this.navigation
        });
        const n = this.getLifecycleHooks(i, "canUnload").map((n => s => {
            const e = n(i, this.instruction, t);
            if ("boolean" === typeof e) {
                if (false === e) s.exit();
                return e;
            }
            return e;
        }));
        if (0 !== n.length) {
            const t = Runner.run(null, ...n);
            if (true !== t) {
                if (false === t) return false;
                return t;
            }
        }
        if (!i.canUnload) return true;
        const s = i.canUnload(this.instruction, t);
        if ("boolean" !== typeof s && !(s instanceof Promise)) throw new Error(`Method 'canUnload' in component "${this.instruction.component.name}" needs to return true or false or a Promise resolving to true or false.`);
        return s;
    }
    load(t) {
        return Runner.run(t, (() => this.contentStates.await("checkedLoad")), (() => {
            var t, i, n;
            if (!this.contentStates.has("created") || this.contentStates.has("loaded") && !this.reload) return;
            this.reload = false;
            this.contentStates.set("loaded", void 0);
            const s = this.instruction.component.instance;
            const e = null === (n = null === (i = null === (t = this.endpoint.parentViewport) || void 0 === t ? void 0 : t.getTimeContent(this.navigation.timestamp)) || void 0 === i ? void 0 : i.instruction) || void 0 === n ? void 0 : n.typeParameters(this.router);
            const o = this.instruction.typeParameters(this.router);
            const r = {
                ...this.navigation.parameters,
                ...e,
                ...o
            };
            const l = this.getLifecycleHooks(s, "load").map((t => () => t(s, r, this.instruction, this.navigation)));
            if (0 !== l.length) {
                if (null != s.load) l.push((() => s.load(r, this.instruction, this.navigation)));
                return Runner.run(null, ...l);
            }
            if (null != s.load) return s.load(r, this.instruction, this.navigation);
        }));
    }
    unload(t) {
        if (!this.contentStates.has("loaded")) return;
        this.contentStates.delete("loaded");
        const i = this.instruction.component.instance;
        if (null === t) t = Navigation.create({
            instruction: "",
            fullStateInstruction: "",
            previous: this.navigation
        });
        const n = this.getLifecycleHooks(i, "unload").map((n => () => n(i, this.instruction, t)));
        if (0 !== n.length) {
            if (null != i.unload) n.push((() => i.unload(this.instruction, t)));
            return Runner.run(null, ...n);
        }
        if (null != i.unload) return i.unload(this.instruction, t);
    }
    activateComponent(t, i, n, s, e, o, r) {
        return Runner.run(t, (() => this.contentStates.await("loaded")), (() => this.waitForParent(n)), (() => {
            var t;
            if (this.contentStates.has("activating") || this.contentStates.has("activated")) return;
            this.contentStates.set("activating", void 0);
            return null === (t = this.controller) || void 0 === t ? void 0 : t.activate(null !== i && void 0 !== i ? i : this.controller, n, s, void 0);
        }), (() => {
            this.contentStates.set("activated", void 0);
        }));
    }
    deactivateComponent(t, i, n, s, e, o = false) {
        if (!this.contentStates.has("activated") && !this.contentStates.has("activating")) return;
        return Runner.run(t, (() => {
            var t;
            if (o && null !== e.element) {
                const t = Array.from(e.element.getElementsByTagName("*"));
                for (const i of t) if (i.scrollTop > 0 || i.scrollLeft) i.setAttribute("au-element-scroll", `${i.scrollTop},${i.scrollLeft}`);
            }
            this.contentStates.delete("activated");
            this.contentStates.delete("activating");
            return null === (t = this.controller) || void 0 === t ? void 0 : t.deactivate(null !== i && void 0 !== i ? i : this.controller, n, s);
        }));
    }
    disposeComponent(t, i, n = false) {
        var s;
        if (!this.contentStates.has("created") || null == this.instruction.component.instance) return;
        if (!n) {
            this.contentStates.delete("created");
            return null === (s = this.controller) || void 0 === s ? void 0 : s.dispose();
        } else i.push(this);
    }
    freeContent(t, i, n, s, e = false) {
        return Runner.run(t, (() => this.unload(n)), (t => this.deactivateComponent(t, null, i.controller, 0, i, e)), (() => this.disposeComponent(i, s, e)));
    }
    toComponentName() {
        return this.instruction.component.name;
    }
    toComponentType(t) {
        if (this.instruction.component.none) return null;
        return this.instruction.component.toType(t, this.instruction);
    }
    toComponentInstance(t, i, n) {
        if (this.instruction.component.none) return null;
        return this.instruction.component.toInstance(t, i, n, this.instruction);
    }
    waitForParent(t) {
        if (null === t) return;
        if (!t.isActive) return new Promise((t => {
            this.endpoint.activeResolve = t;
        }));
    }
    getLifecycleHooks(t, i) {
        var n;
        const s = null !== (n = t.$controller.lifecycleHooks[i]) && void 0 !== n ? n : [];
        return s.map((t => t.instance[i].bind(t.instance)));
    }
}

class ViewportOptions {
    constructor(t = true, i = [], n = "", s = "", e = "", o = false, r = false, l = false, u = false, h = false) {
        this.scope = t;
        this.usedBy = i;
        this.fallback = s;
        this.fallbackAction = e;
        this.noLink = o;
        this.noTitle = r;
        this.stateful = l;
        this.forceDescription = u;
        this.noHistory = h;
        this.default = void 0;
        this.default = n;
    }
    static create(t) {
        const i = new ViewportOptions;
        if (void 0 !== t) i.apply(t);
        return i;
    }
    apply(t) {
        var i, n, s, e, o, r, l, u, h, a;
        this.scope = null !== (i = t.scope) && void 0 !== i ? i : this.scope;
        this.usedBy = null !== (n = "string" === typeof t.usedBy ? t.usedBy.split(",").filter((t => t.length > 0)) : t.usedBy) && void 0 !== n ? n : this.usedBy;
        this.default = null !== (s = t.default) && void 0 !== s ? s : this.default;
        this.fallback = null !== (e = t.fallback) && void 0 !== e ? e : this.fallback;
        this.fallbackAction = null !== (o = t.fallbackAction) && void 0 !== o ? o : this.fallbackAction;
        this.noLink = null !== (r = t.noLink) && void 0 !== r ? r : this.noLink;
        this.noTitle = null !== (l = t.noTitle) && void 0 !== l ? l : this.noTitle;
        this.stateful = null !== (u = t.stateful) && void 0 !== u ? u : this.stateful;
        this.forceDescription = null !== (h = t.forceDescription) && void 0 !== h ? h : this.forceDescription;
        this.noHistory = null !== (a = t.noHistory) && void 0 !== a ? a : this.noHistory;
    }
}

class Viewport extends Endpoint$1 {
    constructor(t, i, n, s, e, o) {
        super(t, i, n);
        this.contents = [];
        this.forceRemove = false;
        this.options = new ViewportOptions;
        this.activeResolve = null;
        this.connectionResolve = null;
        this.clear = false;
        this.coordinators = [];
        this.previousViewportState = null;
        this.cache = [];
        this.historyCache = [];
        this.contents.push(new ViewportContent(t, this, s, e));
        this.contents[0].completed = true;
        if (void 0 !== o) this.options.apply(o);
    }
    getContent() {
        var t;
        if (1 === this.contents.length) return this.contents[0];
        let i;
        for (let n = 0, s = this.contents.length; n < s; n++) if (null !== (t = this.contents[n].completed) && void 0 !== t ? t : false) i = this.contents[n]; else break;
        return i;
    }
    getNextContent() {
        if (1 === this.contents.length) return null;
        const t = this.contents.indexOf(this.getContent());
        return this.contents.length > t ? this.contents[t + 1] : null;
    }
    getTimeContent(t) {
        let i = null;
        for (let n = 0, s = this.contents.length; n < s; n++) {
            if (this.contents[n].navigation.timestamp > t) break;
            i = this.contents[n];
        }
        return i;
    }
    get parentViewport() {
        let t = this.connectedScope;
        while (null != (null === t || void 0 === t ? void 0 : t.parent)) {
            t = t.parent;
            if (t.endpoint.isViewport) return t.endpoint;
        }
        return null;
    }
    get isEmpty() {
        return null === this.getContent().componentInstance;
    }
    get doForceRemove() {
        let t = this.connectedScope;
        while (null !== t) {
            if (t.isViewport && t.endpoint.forceRemove) return true;
            t = t.parent;
        }
        return false;
    }
    isActiveNavigation(t) {
        return this.coordinators[this.coordinators.length - 1] === t;
    }
    toString() {
        var t, i, n, s;
        const e = null !== (i = null === (t = this.getContent()) || void 0 === t ? void 0 : t.instruction.component.name) && void 0 !== i ? i : "";
        const o = null !== (s = null === (n = this.getNextContent()) || void 0 === n ? void 0 : n.instruction.component.name) && void 0 !== s ? s : "";
        return `v:${this.name}[${e}->${o}]`;
    }
    setNextContent(t, i) {
        var n;
        t.endpoint.set(this);
        this.clear = t.isClear(this.router);
        const s = this.contents[this.contents.length - 1];
        const e = new ViewportContent(this.router, this, this.owningScope, this.scope.hasScope, !this.clear ? t : void 0, i, null !== (n = this.connectedCE) && void 0 !== n ? n : null);
        this.contents.push(e);
        e.fromHistory = null !== e.componentInstance && i.navigation ? !!i.navigation.back || !!i.navigation.forward : false;
        if (this.options.stateful) {
            const t = this.cache.find((t => e.isCacheEqual(t)));
            if (void 0 !== t) {
                this.contents.splice(this.contents.indexOf(e), 1, t);
                e.fromCache = true;
            } else this.cache.push(e);
        }
        if (null !== e.componentInstance && s.componentInstance === e.componentInstance) {
            e.delete();
            this.contents.splice(this.contents.indexOf(e), 1);
            return this.transitionAction = "skip";
        }
        if (!s.equalComponent(e) || i.navigation.refresh || "refresh" === s.reloadBehavior) return this.transitionAction = "swap";
        if ("disallow" === s.reloadBehavior) {
            e.delete();
            this.contents.splice(this.contents.indexOf(e), 1);
            return this.transitionAction = "skip";
        }
        if ("reload" === s.reloadBehavior) {
            s.reload = true;
            e.instruction.component.set(s.componentInstance);
            e.contentStates = s.contentStates.clone();
            e.reload = s.reload;
            return this.transitionAction = "reload";
        }
        if (this.options.stateful && s.equalParameters(e)) {
            e.delete();
            this.contents.splice(this.contents.indexOf(e), 1);
            return this.transitionAction = "skip";
        }
        if (!s.equalParameters(e)) return this.transitionAction = "swap";
        e.delete();
        this.contents.splice(this.contents.indexOf(e), 1);
        return this.transitionAction = "skip";
    }
    setConnectedCE(t, i) {
        var n, s, e, o, r;
        i = null !== i && void 0 !== i ? i : {};
        if (this.connectedCE !== t) {
            this.previousViewportState = {
                ...this
            };
            this.clearState();
            this.connectedCE = t;
            this.options.apply(i);
            if (null != this.connectionResolve) this.connectionResolve();
        }
        const l = (null !== (s = null === (n = this.scope.parent) || void 0 === n ? void 0 : n.endpoint.getRoutes()) && void 0 !== s ? s : []).filter((t => "" === t.path)).length > 0;
        if (null === this.getContent().componentInstance && null == (null === (e = this.getNextContent()) || void 0 === e ? void 0 : e.componentInstance) && (this.options.default || l)) {
            const t = RoutingInstruction.parse(this.router, null !== (o = this.options.default) && void 0 !== o ? o : "");
            if (0 === t.length && l) {
                const i = null === (r = this.scope.parent) || void 0 === r ? void 0 : r.findInstructions([ RoutingInstruction.create("") ], false, this.router.configuration.options.useConfiguredRoutes);
                if (null === i || void 0 === i ? void 0 : i.foundConfiguration) t.push(...i.instructions);
            }
            for (const i of t) {
                i.endpoint.set(this);
                i.scope = this.owningScope;
                i.default = true;
            }
            this.router.load(t, {
                append: true
            }).catch((t => {
                throw t;
            }));
        }
    }
    remove(t, i) {
        if (this.connectedCE === i) return Runner.run(t, (t => {
            var i, n;
            if (null !== this.getContent().componentInstance) return this.getContent().freeContent(t, this.connectedCE, null !== (n = null === (i = this.getNextContent()) || void 0 === i ? void 0 : i.navigation) && void 0 !== n ? n : null, this.historyCache, this.doForceRemove ? false : this.router.statefulHistory || this.options.stateful);
        }), (t => {
            if (this.doForceRemove) {
                const i = [];
                for (const t of this.historyCache) i.push((i => t.freeContent(i, null, null, this.historyCache, false)));
                i.push((() => {
                    this.historyCache = [];
                }));
                return Runner.run(t, ...i);
            }
            return true;
        }));
        return false;
    }
    async transition(t) {
        var i, n, s, e;
        const o = this.router.configuration.options.indicators.viewportNavigating;
        this.coordinators.push(t);
        while (this.coordinators[0] !== t) await this.coordinators[0].waitForSyncState("completed");
        let r = this.parentViewport;
        if (null !== r && "reload" !== r.transitionAction && "swap" !== r.transitionAction) r = null;
        const l = [ i => {
            if (this.isActiveNavigation(t)) return this.canUnload(i);
        }, i => {
            if (this.isActiveNavigation(t)) if (!i.previousValue) t.cancel(); else if (this.router.isRestrictedNavigation) {
                const t = this.router.configuration.options;
                this.getNextContent().createComponent(this.connectedCE, this.options.fallback || t.fallback, this.options.fallbackAction || t.fallbackAction);
            }
            t.addEndpointState(this, "guardedUnload");
        }, () => t.waitForSyncState("guardedUnload", this), () => null !== r ? t.waitForEndpointState(r, "guardedLoad") : void 0, i => {
            if (this.isActiveNavigation(t)) return this.canLoad(i);
        }, i => {
            if (this.isActiveNavigation(t)) {
                const n = i.previousValue;
                if ("boolean" === typeof n) {
                    if (!n) {
                        i.cancel();
                        t.cancel();
                        return;
                    }
                } else return Runner.run(i, (() => this.router.load(n, {
                    append: true
                })), (i => this.cancelContentChange(t, i)));
            }
            t.addEndpointState(this, "guardedLoad");
            t.addEndpointState(this, "guarded");
        } ];
        const u = [ () => t.waitForSyncState("guarded", this), i => {
            if (this.isActiveNavigation(t)) return this.unload(i);
        }, () => t.addEndpointState(this, "unloaded"), () => t.waitForSyncState("unloaded", this), () => null !== r ? t.waitForEndpointState(r, "loaded") : void 0, i => {
            if (this.isActiveNavigation(t)) return this.load(i);
        }, () => t.addEndpointState(this, "loaded"), () => t.addEndpointState(this, "routed") ];
        const h = [ () => t.waitForSyncState("routed", this), () => t.waitForEndpointState(this, "routed") ];
        const a = this.router.configuration.options.swapOrder;
        switch (a) {
          case "detach-current-attach-next":
            h.push((i => {
                if (this.isActiveNavigation(t)) return this.removeContent(i, t);
            }), (i => {
                if (this.isActiveNavigation(t)) return this.addContent(i, t);
            }));
            break;

          case "attach-next-detach-current":
            h.push((i => {
                if (this.isActiveNavigation(t)) return this.addContent(i, t);
            }), (i => {
                if (this.isActiveNavigation(t)) return this.removeContent(i, t);
            }));
            break;

          case "detach-attach-simultaneously":
            h.push((i => Runner.runParallel(i, (i => {
                if (this.isActiveNavigation(t)) return this.removeContent(i, t);
            }), (i => {
                if (this.isActiveNavigation(t)) return this.addContent(i, t);
            }))));
            break;

          case "attach-detach-simultaneously":
            h.push((i => Runner.runParallel(i, (i => {
                if (this.isActiveNavigation(t)) return this.addContent(i, t);
            }), (i => {
                if (this.isActiveNavigation(t)) return this.removeContent(i, t);
            }))));
            break;
        }
        h.push((() => t.addEndpointState(this, "swapped")));
        null === (n = null === (i = this.connectedCE) || void 0 === i ? void 0 : i.setActivity) || void 0 === n ? void 0 : n.call(i, o, true);
        null === (e = null === (s = this.connectedCE) || void 0 === s ? void 0 : s.setActivity) || void 0 === e ? void 0 : e.call(s, t.navigation.navigation, true);
        const c = Runner.run(null, (i => t.setEndpointStep(this, i.root)), ...l, ...u, ...h, (() => t.addEndpointState(this, "completed")), (() => t.waitForSyncState("bound")), (() => {
            var i, n, s, e;
            null === (n = null === (i = this.connectedCE) || void 0 === i ? void 0 : i.setActivity) || void 0 === n ? void 0 : n.call(i, o, false);
            null === (e = null === (s = this.connectedCE) || void 0 === s ? void 0 : s.setActivity) || void 0 === e ? void 0 : e.call(s, t.navigation.navigation, false);
        }));
        if (c instanceof Promise) c.catch((t => {}));
    }
    canUnload(t) {
        return Runner.run(t, (t => this.getContent().connectedScope.canUnload(t)), (t => {
            var i, n;
            if (!t.previousValue) return false;
            return this.getContent().canUnload(null !== (n = null === (i = this.getNextContent()) || void 0 === i ? void 0 : i.navigation) && void 0 !== n ? n : null);
        }));
    }
    canLoad(t) {
        if (this.clear) return true;
        return Runner.run(t, (() => this.waitForConnected()), (() => {
            const t = this.router.configuration.options;
            this.getNextContent().createComponent(this.connectedCE, this.options.fallback || t.fallback, this.options.fallbackAction || t.fallbackAction);
            return this.getNextContent().canLoad();
        }));
    }
    load(t) {
        if (this.clear) return;
        return this.getNextContent().load(t);
    }
    addContent(t, i) {
        return this.activate(t, null, this.connectedController, 0, i);
    }
    removeContent(t, i) {
        var n;
        if (this.isEmpty) return;
        const s = this.router.statefulHistory || (null !== (n = this.options.stateful) && void 0 !== n ? n : false);
        return Runner.run(t, (() => i.addEndpointState(this, "bound")), (() => i.waitForSyncState("bound")), (t => this.deactivate(t, null, this.connectedController, s ? 0 : 16)), (() => s ? this.dispose() : void 0));
    }
    activate(t, i, n, s, e) {
        if (null !== this.activeContent.componentInstance) return Runner.run(t, (() => this.activeContent.canLoad()), (t => this.activeContent.load(t)), (t => this.activeContent.activateComponent(t, i, n, s, this.connectedCE, (() => null === e || void 0 === e ? void 0 : e.addEndpointState(this, "bound")), null === e || void 0 === e ? void 0 : e.waitForSyncState("bound"))));
    }
    deactivate(t, i, n, s) {
        var e;
        const o = this.getContent();
        if (null != (null === o || void 0 === o ? void 0 : o.componentInstance) && !o.reload && o.componentInstance !== (null === (e = this.getNextContent()) || void 0 === e ? void 0 : e.componentInstance)) return o.deactivateComponent(t, i, n, s, this.connectedCE, this.router.statefulHistory || this.options.stateful);
    }
    unload(t) {
        return Runner.run(t, (t => this.getContent().connectedScope.unload(t)), (() => {
            var t, i;
            return null != this.getContent().componentInstance ? this.getContent().unload(null !== (i = null === (t = this.getNextContent()) || void 0 === t ? void 0 : t.navigation) && void 0 !== i ? i : null) : void 0;
        }));
    }
    dispose() {
        var t;
        if (null !== this.getContent().componentInstance && !this.getContent().reload && this.getContent().componentInstance !== (null === (t = this.getNextContent()) || void 0 === t ? void 0 : t.componentInstance)) this.getContent().disposeComponent(this.connectedCE, this.historyCache, this.router.statefulHistory || this.options.stateful);
    }
    finalizeContentChange(t, i) {
        var n, s, e, o, r;
        const l = this.contents.findIndex((i => i.navigation === t.navigation));
        let u = this.contents[l];
        const h = this.contents[l - 1];
        if (this.clear) {
            const t = new ViewportContent(this.router, this, this.owningScope, this.scope.hasScope, void 0, u.navigation);
            this.contents.splice(l, 1, t);
            u.delete();
            u = t;
        } else u.reload = false;
        h.delete();
        u.completed = true;
        this.transitionAction = "";
        u.contentStates.delete("checkedUnload");
        u.contentStates.delete("checkedLoad");
        this.previousViewportState = null;
        const a = this.router.configuration.options.indicators.viewportNavigating;
        null === (s = null === (n = this.connectedCE) || void 0 === n ? void 0 : n.setActivity) || void 0 === s ? void 0 : s.call(n, a, false);
        null === (o = null === (e = this.connectedCE) || void 0 === e ? void 0 : e.setActivity) || void 0 === o ? void 0 : o.call(e, t.navigation.navigation, false);
        let c = 0;
        for (let t = 0, i = l; t < i; t++) {
            if (!(null !== (r = this.contents[0].navigation.completed) && void 0 !== r ? r : false)) break;
            c++;
        }
        this.contents.splice(0, c);
        T(this.coordinators, (i => i === t));
    }
    cancelContentChange(t, i) {
        const n = this.contents.findIndex((i => i.navigation === t.navigation));
        const s = this.contents[n];
        const e = this.contents[n - 1];
        return Runner.run(i, (t => {
            if (null != s) return s.freeContent(t, this.connectedCE, s.navigation, this.historyCache, this.router.statefulHistory || this.options.stateful);
        }), (() => {
            var i, n, o, r;
            if (this.previousViewportState) Object.assign(this, this.previousViewportState);
            null === s || void 0 === s ? void 0 : s.delete();
            if (null !== s) this.contents.splice(this.contents.indexOf(s), 1);
            this.transitionAction = "";
            null === e || void 0 === e ? void 0 : e.contentStates.delete("checkedUnload");
            null === e || void 0 === e ? void 0 : e.contentStates.delete("checkedLoad");
            const l = this.router.configuration.options.indicators.viewportNavigating;
            null === (n = null === (i = this.connectedCE) || void 0 === i ? void 0 : i.setActivity) || void 0 === n ? void 0 : n.call(i, l, false);
            null === (r = null === (o = this.connectedCE) || void 0 === o ? void 0 : o.setActivity) || void 0 === r ? void 0 : r.call(o, t.navigation.navigation, false);
            t.removeEndpoint(this);
            T(this.coordinators, (i => i === t));
        }), (() => null === i || void 0 === i ? void 0 : i.exit()));
    }
    wantComponent(t) {
        return this.options.usedBy.includes(t);
    }
    acceptComponent(t) {
        if ("-" === t || null === t) return true;
        const i = this.options.usedBy;
        if (0 === i.length) return true;
        if (i.includes(t)) return true;
        if (i.filter((t => t.includes("*"))).length) return true;
        return false;
    }
    freeContent(t, i) {
        const n = this.historyCache.find((t => t.componentInstance === i));
        if (void 0 !== n) return Runner.run(t, (t => {
            this.forceRemove = true;
            return n.freeContent(t, null, null, this.historyCache, false);
        }), (() => {
            this.forceRemove = false;
            T(this.historyCache, (t => t === n));
        }));
    }
    getRoutes() {
        let t = this.getComponentType();
        if (null === t) return null;
        t = t.constructor === t.constructor.constructor ? t : t.constructor;
        const i = A.getConfiguration(t);
        return Array.isArray(i) ? i : null;
    }
    getTitle(t) {
        var i, n;
        if (this.options.noTitle) return "";
        const s = this.getComponentType();
        if (null === s) return "";
        let e = "";
        const o = s.title;
        if (void 0 !== o) if ("string" === typeof o) e = o; else {
            const i = this.getComponentInstance();
            e = o.call(i, i, t);
        } else if (this.router.configuration.options.title.useComponentNames) {
            let t = null !== (i = this.getContentInstruction().component.name) && void 0 !== i ? i : "";
            const s = null !== (n = this.router.configuration.options.title.componentPrefix) && void 0 !== n ? n : "";
            if (t.startsWith(s)) t = t.slice(s.length);
            t = t.replace("-", " ");
            e = t.slice(0, 1).toLocaleUpperCase() + t.slice(1);
        }
        return e;
    }
    getComponentType() {
        var t;
        let i = null !== (t = this.getContentInstruction().component.type) && void 0 !== t ? t : null;
        if (null === i) {
            const t = o.for(this.connectedCE.element);
            i = t.container.componentType;
        }
        return null !== i && void 0 !== i ? i : null;
    }
    getComponentInstance() {
        var t;
        return null !== (t = this.getContentInstruction().component.instance) && void 0 !== t ? t : null;
    }
    getContentInstruction() {
        var t, i, n;
        return null !== (n = null !== (i = null === (t = this.getNextContent()) || void 0 === t ? void 0 : t.instruction) && void 0 !== i ? i : this.getContent().instruction) && void 0 !== n ? n : null;
    }
    clearState() {
        this.options = ViewportOptions.create();
        const t = this.owningScope;
        const i = this.scope.hasScope;
        this.getContent().delete();
        this.contents.shift();
        if (this.contents.length < 1) throw new Error("no content!");
        this.contents.push(new ViewportContent(this.router, this, t, i));
        this.cache = [];
    }
    waitForConnected() {
        if (null === this.connectedCE) return new Promise((t => {
            this.connectionResolve = t;
        }));
    }
}

class InstructionEndpoint {
    constructor() {
        this.name = null;
        this.instance = null;
        this.scope = null;
    }
    get none() {
        return null === this.name && null === this.instance;
    }
    get endpointType() {
        if (this.instance instanceof Viewport) return "Viewport";
        if (this.instance instanceof ViewportScope) return "ViewportScope";
        return null;
    }
    static create(t) {
        const i = new InstructionEndpoint;
        i.set(t);
        return i;
    }
    static isName(t) {
        return "string" === typeof t;
    }
    static isInstance(t) {
        return t instanceof Endpoint$1;
    }
    static getName(t) {
        if (InstructionEndpoint.isName(t)) return t; else return t ? t.name : null;
    }
    static getInstance(t) {
        if (InstructionEndpoint.isName(t)) return null; else return t;
    }
    set(t) {
        if (void 0 === t || "" === t) t = null;
        if ("string" === typeof t) {
            this.name = t;
            this.instance = null;
        } else {
            this.instance = t;
            if (null !== t) {
                this.name = t.name;
                this.scope = t.owningScope;
            }
        }
    }
    toInstance(t) {
        if (null !== this.instance) return this.instance;
        return t.getEndpoint(this.endpointType, this.name);
    }
    same(t, i) {
        if (null !== this.instance && null !== t.instance) return this.instance === t.instance;
        return (null === this.endpointType || null === t.endpointType || this.endpointType === t.endpointType) && (!i || this.scope === t.scope) && (null !== this.instance ? this.instance.name : this.name) === (null !== t.instance ? t.instance.name : t.name);
    }
}

class RoutingInstruction {
    constructor(t, i, n) {
        this.ownsScope = true;
        this.nextScopeInstructions = null;
        this.scope = null;
        this.scopeModifier = "";
        this.needsEndpointDescribed = false;
        this.route = null;
        this.routeStart = false;
        this.default = false;
        this.topInstruction = false;
        this.unparsed = null;
        this.component = InstructionComponent.create(t);
        this.endpoint = InstructionEndpoint.create(i);
        this.parameters = InstructionParameters.create(n);
    }
    static create(t, i, n, s = true, e = null) {
        const o = new RoutingInstruction(t, i, n);
        o.ownsScope = s;
        o.nextScopeInstructions = e;
        return o;
    }
    static createClear(t, i) {
        return RoutingInstruction.create(RoutingInstruction.clear(t), i);
    }
    static from(t, i) {
        if (!Array.isArray(i)) i = [ i ];
        const n = [];
        for (const s of i) if ("string" === typeof s) n.push(...RoutingInstruction.parse(t, s)); else if (s instanceof RoutingInstruction) n.push(s); else if (s instanceof Promise) n.push(RoutingInstruction.create(s)); else if (InstructionComponent.isAppelation(s)) n.push(RoutingInstruction.create(s)); else if (InstructionComponent.isDefinition(s)) n.push(RoutingInstruction.create(s.Type)); else if ("component" in s) {
            const i = s;
            const e = RoutingInstruction.create(i.component, i.viewport, i.parameters);
            if (void 0 !== i.children && null !== i.children) e.nextScopeInstructions = RoutingInstruction.from(t, i.children);
            n.push(e);
        } else if ("object" === typeof s && null !== s) {
            const t = o.define(s);
            n.push(RoutingInstruction.create(t));
        } else n.push(RoutingInstruction.create(s));
        return n;
    }
    static clear(t) {
        return Separators.for(t).clear;
    }
    static add(t) {
        return Separators.for(t).add;
    }
    static parse(t, i) {
        const n = Separators.for(t);
        let s = "";
        const e = /^[./]+/.exec(i);
        if (Array.isArray(e) && e.length > 0) {
            s = e[0];
            i = i.slice(s.length);
        }
        const o = InstructionParser.parse(n, i, true, true).instructions;
        for (const t of o) t.scopeModifier = s;
        return o;
    }
    static stringify(t, i, n = false, s = false) {
        return "string" === typeof i ? i : i.map((i => i.stringify(t, n, s))).filter((t => t.length > 0)).join(Separators.for(t).sibling);
    }
    static containsSiblings(t, i) {
        if (null === i) return false;
        if (i.filter((i => !i.isClear(t) && !i.isClearAll(t))).length > 1) return true;
        return i.some((i => RoutingInstruction.containsSiblings(t, i.nextScopeInstructions)));
    }
    static flat(t) {
        const i = [];
        for (const n of t) {
            i.push(n);
            if (n.hasNextScopeInstructions) i.push(...RoutingInstruction.flat(n.nextScopeInstructions));
        }
        return i;
    }
    static clone(t, i = false, n = false) {
        return t.map((t => t.clone(i, n)));
    }
    static contains(t, i, n, s) {
        return n.every((n => n.isIn(t, i, s)));
    }
    get viewport() {
        return this.endpoint.instance instanceof Viewport || null === this.endpoint.endpointType ? this.endpoint : null;
    }
    get viewportScope() {
        return this.endpoint.instance instanceof ViewportScope || null === this.endpoint.endpointType ? this.endpoint : null;
    }
    get previous() {
        var t, i;
        return null === (i = null === (t = this.endpoint.instance) || void 0 === t ? void 0 : t.getContent()) || void 0 === i ? void 0 : i.instruction;
    }
    isAdd(t) {
        return this.component.name === Separators.for(t).add;
    }
    isClear(t) {
        return this.component.name === Separators.for(t).clear;
    }
    isAddAll(t) {
        var i, n;
        return this.isAdd(t) && 0 === (null !== (n = null === (i = this.endpoint.name) || void 0 === i ? void 0 : i.length) && void 0 !== n ? n : 0);
    }
    isClearAll(t) {
        var i, n;
        return this.isClear(t) && 0 === (null !== (n = null === (i = this.endpoint.name) || void 0 === i ? void 0 : i.length) && void 0 !== n ? n : 0);
    }
    get hasNextScopeInstructions() {
        var t, i;
        return (null !== (i = null === (t = this.nextScopeInstructions) || void 0 === t ? void 0 : t.length) && void 0 !== i ? i : 0) > 0;
    }
    get isUnresolved() {
        return this.component.isFunction() || this.component.isPromise();
    }
    resolve() {
        return this.component.resolve(this);
    }
    typeParameters(t) {
        var i, n;
        return this.parameters.toSpecifiedParameters(t, null !== (n = null === (i = this.component.type) || void 0 === i ? void 0 : i.parameters) && void 0 !== n ? n : []);
    }
    sameComponent(t, i, n = false, s = false) {
        if (n && !this.sameParameters(t, i, s)) return false;
        return this.component.same(i.component, s);
    }
    sameEndpoint(t, i) {
        return this.endpoint.same(t.endpoint, i);
    }
    sameParameters(t, i, n = false) {
        if (!this.component.same(i.component, n)) return false;
        return this.parameters.same(t, i.parameters, this.component.type);
    }
    stringify(t, i = false, n = false) {
        var s, e, o, r, l;
        const u = Separators.for(t);
        let h = i;
        let a = false;
        if (n) {
            const t = null !== (e = null === (s = this.viewport) || void 0 === s ? void 0 : s.instance) && void 0 !== e ? e : null;
            if (null !== (o = null === t || void 0 === t ? void 0 : t.options.noLink) && void 0 !== o ? o : false) return "";
            if (!this.needsEndpointDescribed && (!(null !== (r = null === t || void 0 === t ? void 0 : t.options.forceDescription) && void 0 !== r ? r : false) || null != (null === (l = this.viewportScope) || void 0 === l ? void 0 : l.instance))) h = true;
            if ((null === t || void 0 === t ? void 0 : t.options.fallback) === this.component.name) a = true;
            if ((null === t || void 0 === t ? void 0 : t.options.default) === this.component.name) a = true;
        }
        const c = this.nextScopeInstructions;
        let f = this.scopeModifier;
        if (null !== this.route) {
            if (!this.routeStart) return Array.isArray(c) ? RoutingInstruction.stringify(t, c, i, n) : "";
            const s = this.route.matching;
            f += s.endsWith(u.scope) ? s.slice(0, -u.scope.length) : s;
        } else f += this.stringifyShallow(t, h, a);
        if (Array.isArray(c) && c.length > 0) {
            const s = RoutingInstruction.stringify(t, c, i, n);
            if (s.length > 0) {
                f += u.scope;
                f += 1 === c.length ? s : `${u.groupStart}${s}${u.groupEnd}`;
            }
        }
        return f;
    }
    clone(t = false, i = false, n = false) {
        var s, e, o, r, l, u;
        const h = RoutingInstruction.create(null !== (o = null !== (e = null !== (s = this.component.func) && void 0 !== s ? s : this.component.promise) && void 0 !== e ? e : this.component.type) && void 0 !== o ? o : this.component.name, this.endpoint.name, null !== this.parameters.typedParameters ? this.parameters.typedParameters : void 0);
        if (t) {
            h.component.set(null !== (l = null !== (r = this.component.instance) && void 0 !== r ? r : this.component.type) && void 0 !== l ? l : this.component.name);
            h.endpoint.set(null !== (u = this.endpoint.instance) && void 0 !== u ? u : this.endpoint.name);
        }
        h.component.name = this.component.name;
        h.needsEndpointDescribed = this.needsEndpointDescribed;
        h.route = this.route;
        h.routeStart = this.routeStart;
        h.default = this.default;
        if (i) h.scopeModifier = this.scopeModifier;
        h.scope = t ? this.scope : null;
        if (this.hasNextScopeInstructions && !n) h.nextScopeInstructions = RoutingInstruction.clone(this.nextScopeInstructions, t, i);
        return h;
    }
    isIn(t, i, n) {
        const s = i.filter((i => {
            var n, s;
            if (!i.sameComponent(t, this)) return false;
            const e = null !== (n = i.component.type) && void 0 !== n ? n : this.component.type;
            const o = null !== (s = this.component.type) && void 0 !== s ? s : i.component.type;
            const r = i.parameters.toSpecifiedParameters(t, null === e || void 0 === e ? void 0 : e.parameters);
            const l = this.parameters.toSpecifiedParameters(t, null === o || void 0 === o ? void 0 : o.parameters);
            if (!InstructionParameters.contains(r, l)) return false;
            return this.endpoint.none || i.sameEndpoint(this, false);
        }));
        if (0 === s.length) return false;
        if (!n || !this.hasNextScopeInstructions) return true;
        if (s.some((i => {
            var s;
            return RoutingInstruction.contains(t, null !== (s = i.nextScopeInstructions) && void 0 !== s ? s : [], this.nextScopeInstructions, n);
        }))) return true;
        return false;
    }
    getTitle(t) {
        var i;
        if (null !== this.route) {
            const n = null === (i = this.route.match) || void 0 === i ? void 0 : i.title;
            if (null != n) if (this.routeStart) return "string" === typeof n ? n : n(this, t); else return "";
        }
        return this.endpoint.instance.getTitle(t);
    }
    toJSON() {
        var t, i, n;
        return {
            component: null !== (t = this.component.name) && void 0 !== t ? t : void 0,
            viewport: null !== (i = this.endpoint.name) && void 0 !== i ? i : void 0,
            parameters: null !== (n = this.parameters.parametersRecord) && void 0 !== n ? n : void 0,
            children: this.hasNextScopeInstructions ? this.nextScopeInstructions : void 0
        };
    }
    stringifyShallow(t, i = false, n = false) {
        var s;
        const e = Separators.for(t);
        let o = !n ? null !== (s = this.component.name) && void 0 !== s ? s : "" : "";
        const r = this.component.type ? this.component.type.parameters : null;
        const l = InstructionParameters.stringify(t, this.parameters.toSortedParameters(t, r));
        if (l.length > 0) o += !n ? `${e.parameters}${l}${e.parametersEnd}` : l;
        if (null != this.endpoint.name && !i) o += `${e.viewport}${this.endpoint.name}`;
        if (!this.ownsScope) o += e.noScope;
        return o || "";
    }
}

class NavigatorNavigateEvent {
    constructor(t, i) {
        this.eventName = t;
        this.navigation = i;
    }
    static create(t) {
        return new NavigatorNavigateEvent(NavigatorNavigateEvent.eventName, t);
    }
}

NavigatorNavigateEvent.eventName = "au:router:navigation-navigate";

let x = class Navigator {
    constructor(t, i) {
        this.ea = t;
        this.container = i;
        this.lastNavigationIndex = -1;
        this.navigations = [];
        this.options = {
            statefulHistoryLength: 0
        };
        this.isActive = false;
        this.uninitializedNavigation = Navigation.create({
            instruction: "NAVIGATOR UNINITIALIZED",
            fullStateInstruction: "",
            index: 0,
            completed: true
        });
        this.lastNavigationIndex = -1;
    }
    start(t) {
        if (this.isActive) throw new Error("Navigator has already been started");
        this.isActive = true;
        this.options = {
            ...t
        };
    }
    stop() {
        if (!this.isActive) throw new Error("Navigator has not been started");
        this.isActive = false;
    }
    navigate(t) {
        var i, n, s, e;
        if (!(t instanceof Navigation)) t = Navigation.create(t);
        const o = new NavigationFlags;
        if (-1 === this.lastNavigationIndex) {
            this.loadState();
            if (-1 !== this.lastNavigationIndex) o.refresh = true; else {
                o.first = true;
                o.new = true;
                this.lastNavigationIndex = 0;
                this.navigations = [ Navigation.create({
                    index: 0,
                    instruction: "",
                    fullStateInstruction: ""
                }) ];
            }
        }
        if (void 0 !== t.index && !(null !== (i = t.replacing) && void 0 !== i ? i : false) && !(null !== (n = t.refreshing) && void 0 !== n ? n : false)) {
            t.historyMovement = t.index - Math.max(this.lastNavigationIndex, 0);
            t.instruction = null != this.navigations[t.index] ? this.navigations[t.index].fullStateInstruction : t.fullStateInstruction;
            t.replacing = true;
            if (t.historyMovement > 0) o.forward = true; else if (t.historyMovement < 0) o.back = true;
        } else if ((null !== (s = t.refreshing) && void 0 !== s ? s : false) || o.refresh) {
            t = this.navigations[this.lastNavigationIndex];
            t.replacing = true;
            t.refreshing = true;
        } else if (null !== (e = t.replacing) && void 0 !== e ? e : false) {
            o.replace = true;
            o.new = true;
            t.index = this.lastNavigationIndex;
        } else {
            o.new = true;
            t.index = this.lastNavigationIndex + 1;
            this.navigations[t.index] = t;
        }
        t.navigation = o;
        t.previous = this.navigations[Math.max(this.lastNavigationIndex, 0)];
        t.process = new OpenPromise;
        this.lastNavigationIndex = t.index;
        this.notifySubscribers(t);
        return t.process.promise;
    }
    async finalize(t, i) {
        var n, s, e, o, r, l, u;
        if (null !== (n = t.untracked) && void 0 !== n ? n : false) {
            if ((null !== (s = t.fromBrowser) && void 0 !== s ? s : false) && null != this.options.store) await this.options.store.popNavigatorState();
        } else if (null !== (e = t.replacing) && void 0 !== e ? e : false) {
            if (0 === (null !== (o = t.historyMovement) && void 0 !== o ? o : 0)) this.navigations[t.previous.index] = t;
            await this.saveState(t.index, false);
        } else {
            const n = t.index;
            if (i) this.navigations = this.navigations.slice(0, n);
            this.navigations[n] = t;
            if ((null !== (r = this.options.statefulHistoryLength) && void 0 !== r ? r : 0) > 0) {
                const t = this.navigations.length - (null !== (l = this.options.statefulHistoryLength) && void 0 !== l ? l : 0);
                for (const i of this.navigations.slice(n)) if ("string" !== typeof i.instruction || "string" !== typeof i.fullStateInstruction) await this.serializeNavigation(i, this.navigations.slice(t, n));
            }
            await this.saveState(t.index, !(null !== (u = t.fromBrowser) && void 0 !== u ? u : false));
        }
    }
    async cancel(t) {
        var i, n, s;
        if (null != this.options.store) if (null === (i = t.navigation) || void 0 === i ? void 0 : i.new) {
            if (null !== (n = t.fromBrowser) && void 0 !== n ? n : false) await this.options.store.popNavigatorState();
        } else if (0 !== (null !== (s = t.historyMovement) && void 0 !== s ? s : 0)) await this.options.store.go(-t.historyMovement, true);
    }
    async go(t) {
        let i = this.lastNavigationIndex + t;
        i = Math.min(i, this.navigations.length - 1);
        await this.options.store.go(t, true);
        const n = this.navigations[i];
        return this.navigate(n);
    }
    getState() {
        var t, i;
        const n = null != this.options.store ? {
            ...this.options.store.state
        } : {};
        const s = null !== (t = null === n || void 0 === n ? void 0 : n.navigations) && void 0 !== t ? t : [];
        const e = null !== (i = null === n || void 0 === n ? void 0 : n.navigationIndex) && void 0 !== i ? i : -1;
        return {
            navigations: s,
            navigationIndex: e
        };
    }
    loadState() {
        const {navigations: t, navigationIndex: i} = this.getState();
        this.navigations = t.map((t => Navigation.create(t)));
        this.lastNavigationIndex = i;
    }
    async saveState(t, i) {
        var n, s, e, o, r;
        for (let t = 0; t < this.navigations.length; t++) this.navigations[t] = Navigation.create(this.navigations[t].toStoredNavigation());
        if ((null !== (n = this.options.statefulHistoryLength) && void 0 !== n ? n : 0) > 0) {
            const t = this.navigations.length - (null !== (s = this.options.statefulHistoryLength) && void 0 !== s ? s : 0);
            for (let i = 0; i < t; i++) {
                const n = this.navigations[i];
                if ("string" !== typeof n.instruction || "string" !== typeof n.fullStateInstruction) await this.serializeNavigation(n, this.navigations.slice(t));
            }
        }
        if (null == this.options.store) return Promise.resolve();
        const l = {
            navigations: (null !== (e = this.navigations) && void 0 !== e ? e : []).map((t => this.toStoreableNavigation(t))),
            navigationIndex: t
        };
        if (i) return null === (r = null === (o = this.options) || void 0 === o ? void 0 : o.store) || void 0 === r ? void 0 : r.pushNavigatorState(l); else return this.options.store.replaceNavigatorState(l);
    }
    async refresh() {
        if (-1 === this.lastNavigationIndex) return Promise.reject();
        const t = this.navigations[this.lastNavigationIndex];
        t.replacing = true;
        t.refreshing = true;
        return this.navigate(t);
    }
    notifySubscribers(t) {
        this.ea.publish(NavigatorNavigateEvent.eventName, NavigatorNavigateEvent.create(t));
    }
    toStoreableNavigation(t) {
        const i = t instanceof Navigation ? t.toStoredNavigation() : t;
        i.instruction = RoutingInstruction.stringify(this.container, i.instruction);
        i.fullStateInstruction = RoutingInstruction.stringify(this.container, i.fullStateInstruction, false, true);
        if ("string" !== typeof i.scope) i.scope = null;
        return i;
    }
    async serializeNavigation(t, i) {
        let n = [];
        for (const t of i) {
            if ("string" !== typeof t.instruction) n.push(...RoutingInstruction.flat(t.instruction).filter((t => null !== t.endpoint.instance)).map((t => t.component.instance)));
            if ("string" !== typeof t.fullStateInstruction) n.push(...RoutingInstruction.flat(t.fullStateInstruction).filter((t => null !== t.endpoint.instance)).map((t => t.component.instance)));
        }
        n = V(n);
        let s = [];
        if ("string" !== typeof t.fullStateInstruction) {
            s.push(...t.fullStateInstruction);
            t.fullStateInstruction = RoutingInstruction.stringify(this.container, t.fullStateInstruction, false, true);
        }
        if ("string" !== typeof t.instruction) {
            s.push(...t.instruction);
            t.instruction = RoutingInstruction.stringify(this.container, t.instruction);
        }
        s = s.filter(((t, i, n) => null != t.component.instance && n.indexOf(t) === i));
        const e = [];
        for (const t of s) await this.freeInstructionComponents(t, n, e);
    }
    freeInstructionComponents(t, i, n) {
        var s, e;
        const o = t.component.instance;
        const r = null !== (e = null === (s = t.viewport) || void 0 === s ? void 0 : s.instance) && void 0 !== e ? e : null;
        if (null === o || null === r || n.some((t => t === o))) return;
        if (!i.some((t => t === o))) return Runner.run(null, (t => r.freeContent(t, o)), (() => {
            n.push(o);
        }));
        if (t.hasNextScopeInstructions) for (const s of t.nextScopeInstructions) return this.freeInstructionComponents(s, i, n);
    }
};

x = k([ $(0, i), $(1, n) ], x);

const U = y;

const M = C;

const F = S;

const j = N;

class Collection extends Array {
    constructor() {
        super(...arguments);
        this.currentIndex = -1;
    }
    next() {
        if (this.length > this.currentIndex + 1) return this[++this.currentIndex]; else {
            this.currentIndex = -1;
            return null;
        }
    }
    removeCurrent() {
        this.splice(this.currentIndex--, 1);
    }
    remove(t) {
        T(this, (i => i === t));
    }
}

class EndpointMatcher {
    static matchEndpoints(t, i, n, s = false) {
        const e = [];
        const o = t.getOwnedRoutingScopes(1 / 0);
        const r = o.map((t => t.endpoint));
        const l = r.filter((t => null !== t && !n.some((i => t === i.endpoint.instance))));
        const u = new Collection(...i.slice());
        let h = null;
        EndpointMatcher.matchKnownEndpoints(t.router, "ViewportScope", u, l, e, false);
        if (!s) EndpointMatcher.matchKnownEndpoints(t.router, "Viewport", u, l, e, false);
        EndpointMatcher.matchViewportScopeSegment(t.router, t, u, l, e);
        while (null !== (h = u.next())) h.needsEndpointDescribed = true;
        EndpointMatcher.matchViewportConfiguration(u, l, e);
        if (!s) EndpointMatcher.matchSpecifiedViewport(u, l, e, false);
        EndpointMatcher.matchLastViewport(u, l, e);
        if (s) EndpointMatcher.matchSpecifiedViewport(u, l, e, false);
        return {
            matchedInstructions: e,
            remainingInstructions: [ ...u ]
        };
    }
    static matchKnownEndpoints(t, i, n, s, e, o = false) {
        let r;
        while (null !== (r = n.next())) if (null !== r.endpoint.instance && !r.isAdd(t) && r.endpoint.endpointType === i) {
            EndpointMatcher.matchEndpoint(r, r.endpoint.instance, o);
            e.push(r);
            T(s, (t => t === r.endpoint.instance));
            n.removeCurrent();
        }
    }
    static matchViewportScopeSegment(t, i, n, s, e) {
        let o;
        while (null !== (o = n.next())) for (let r of s) {
            if (!(r instanceof ViewportScope)) continue;
            if (r.acceptSegment(o.component.name)) {
                if (Array.isArray(r.source)) {
                    let n = s.find((t => t instanceof ViewportScope && t.name === r.name));
                    if (void 0 === n || o.isAdd(t)) {
                        const t = r.addSourceItem();
                        n = i.getOwnedScopes().filter((t => t.isViewportScope)).map((t => t.endpoint)).find((i => i.sourceItem === t));
                    }
                    r = n;
                }
                EndpointMatcher.matchEndpoint(o, r, false);
                e.push(o);
                T(s, (t => t === o.endpoint.instance));
                n.removeCurrent();
                break;
            }
        }
    }
    static matchViewportConfiguration(t, i, n) {
        let s;
        while (null !== (s = t.next())) for (const e of i) {
            if (!(e instanceof Viewport)) continue;
            if (null === e || void 0 === e ? void 0 : e.wantComponent(s.component.name)) {
                EndpointMatcher.matchEndpoint(s, e, true);
                n.push(s);
                T(i, (t => t === s.endpoint.instance));
                t.removeCurrent();
                break;
            }
        }
    }
    static matchSpecifiedViewport(t, i, n, s) {
        var e;
        let o;
        while (null !== (o = t.next())) {
            let r = o.endpoint.instance;
            if (null == r) {
                const t = o.endpoint.name;
                if (0 === (null !== (e = null === t || void 0 === t ? void 0 : t.length) && void 0 !== e ? e : 0)) continue;
                for (const n of i) {
                    if (!(n instanceof Viewport)) continue;
                    if (t === n.name) {
                        r = n;
                        break;
                    }
                }
            }
            if (null === r || void 0 === r ? void 0 : r.acceptComponent(o.component.name)) {
                EndpointMatcher.matchEndpoint(o, r, s);
                n.push(o);
                T(i, (t => t === o.endpoint.instance));
                t.removeCurrent();
            }
        }
    }
    static matchLastViewport(t, i, n) {
        let s;
        while (null !== (s = t.next())) {
            const e = [];
            for (const t of i) {
                if (!(t instanceof Viewport)) continue;
                if (t.acceptComponent(s.component.name)) e.push(t);
            }
            if (1 === e.length) {
                const o = e[0];
                EndpointMatcher.matchEndpoint(s, o, true);
                n.push(s);
                T(i, (t => t === s.endpoint.instance));
                t.removeCurrent();
            }
        }
    }
    static matchEndpoint(t, i, n) {
        t.endpoint.set(i);
        if (n) t.needsEndpointDescribed = false;
        if (t.hasNextScopeInstructions) t.nextScopeInstructions.forEach((t => {
            if (null === t.scope) t.scope = i instanceof Viewport ? i.scope : i.scope.scope;
        }));
    }
}

class RoutingScope {
    constructor(t, i, n, s) {
        this.router = t;
        this.hasScope = i;
        this.owningScope = n;
        this.endpointContent = s;
        this.id = -1;
        this.parent = null;
        this.children = [];
        this.path = null;
        this.id = ++RoutingScope.lastId;
        this.owningScope = null !== n && void 0 !== n ? n : this;
    }
    static for(t) {
        var i;
        if (null == t) return null;
        if (t instanceof RoutingScope || t instanceof Viewport || t instanceof ViewportScope) return t.scope;
        let n;
        if ("res" in t) n = t; else if ("container" in t) n = t.container; else if ("$controller" in t) n = t.$controller.container; else {
            const i = o.for(t, {
                searchParents: true
            });
            n = null === i || void 0 === i ? void 0 : i.container;
        }
        if (null == n) return null;
        const s = n.has(Router.closestEndpointKey, true) ? n.get(Router.closestEndpointKey) : null;
        return null !== (i = null === s || void 0 === s ? void 0 : s.scope) && void 0 !== i ? i : null;
    }
    get scope() {
        return this.hasScope ? this : this.owningScope.scope;
    }
    get endpoint() {
        return this.endpointContent.endpoint;
    }
    get isViewport() {
        return this.endpoint instanceof Viewport;
    }
    get isViewportScope() {
        return this.endpoint instanceof ViewportScope;
    }
    get type() {
        return this.isViewport ? "Viewport" : "ViewportScope";
    }
    get enabled() {
        return this.endpointContent.isActive;
    }
    get passThroughScope() {
        return this.isViewportScope && this.endpoint.passThroughScope;
    }
    get pathname() {
        return `${this.owningScope !== this ? this.owningScope.pathname : ""}/${this.endpoint.name}`;
    }
    toString(t = false) {
        return `${this.owningScope !== this ? this.owningScope.toString() : ""}/${!this.enabled ? "(" : ""}${this.endpoint.toString()}#${this.id}${!this.enabled ? ")" : ""}` + `${t ? `\n` + this.children.map((t => t.toString(true))).join("") : ""}`;
    }
    toStringOwning(t = false) {
        return `${this.owningScope !== this ? this.owningScope.toString() : ""}/${!this.enabled ? "(" : ""}${this.endpoint.toString()}#${this.id}${!this.enabled ? ")" : ""}` + `${t ? `\n` + this.ownedScopes.map((t => t.toStringOwning(true))).join("") : ""}`;
    }
    get enabledChildren() {
        return this.children.filter((t => t.enabled));
    }
    get hoistedChildren() {
        const t = this.enabledChildren;
        while (t.some((t => t.passThroughScope))) for (const i of t.slice()) if (i.passThroughScope) {
            const n = t.indexOf(i);
            t.splice(n, 1, ...i.enabledChildren);
        }
        return t;
    }
    get ownedScopes() {
        return this.getOwnedScopes();
    }
    get routingInstruction() {
        if (this.endpoint.isViewportScope) return this.endpoint.instruction;
        if (this.isViewport) return this.endpoint.activeContent.instruction;
        return null;
    }
    getOwnedScopes(t = false) {
        const i = this.allScopes(t).filter((t => t.owningScope === this));
        for (const t of i.slice()) if (t.passThroughScope) {
            const n = i.indexOf(t);
            i.splice(n, 1, ...t.getOwnedScopes());
        }
        return i;
    }
    async processInstructions(t, i, n, s, e = "") {
        var o, r, l, u;
        const h = this.router;
        const a = h.configuration.options;
        const c = t.filter((t => !(t.route instanceof Route)));
        if (c.length > 0) {
            const i = this.findInstructions(c, a.useDirectRouting, a.useConfiguredRoutes);
            if (c.some((t => !t.component.none || null != t.route)) && !i.foundConfiguration && !i.foundInstructions) this.unknownRoute(c);
            t = [ ...t.filter((t => t.route instanceof Route)), ...i.instructions ];
            if (t.some((t => t.scope !== this))) console.warn("Not the current scope for instruction(s)!", this, t);
            if (i.foundConfiguration) e = (null !== e && void 0 !== e ? e : "") + i.matching;
        }
        const f = t.filter((t => t.isUnresolved)).map((t => t.resolve())).filter((t => t instanceof Promise));
        if (f.length > 0) await Promise.all(f);
        if (!a.additiveInstructionDefault) t = this.ensureClearStateInstruction(t);
        let d = [];
        ({clearEndpoints: d, instructions: t} = this.getClearAllEndpoints(t));
        for (const i of t.filter((t => t.isAddAll(h)))) {
            i.endpoint.set(i.scope.endpoint.name);
            i.scope = i.scope.owningScope;
        }
        const v = [];
        let {matchedInstructions: p, remainingInstructions: g} = this.matchEndpoints(t, i);
        let w = 100;
        do {
            if (!w--) h.unresolvedInstructionsError(n, g);
            const a = [];
            const c = p.map((t => t.endpoint.instance));
            p.push(...d.filter((t => !c.includes(t))).map((t => RoutingInstruction.createClear(h, t))));
            const f = await RoutingHook.invokeBeforeNavigation(p, n);
            if (false === f) {
                h.cancelNavigation(n, s);
                return [];
            } else if (true !== f && f !== p) {
                const t = RoutingInstruction.flat(p);
                g = g.filter((i => !t.includes(i)));
                p = f;
            }
            for (const t of p) {
                const l = t.endpoint.instance;
                if (null !== l) {
                    const u = l.setNextContent(t, n);
                    if ("skip" !== u) {
                        a.push(l);
                        s.addEndpoint(l);
                    }
                    const c = [ l ];
                    if ("swap" === u) c.push(...l.getContent().connectedScope.allScopes(true).map((t => t.endpoint)));
                    T(d, (t => c.includes(t)));
                    T(p, (i => i !== t && i.isClear(h) && c.includes(i.endpoint.instance)));
                    if (!t.isClear(h) && (null === (r = null === (o = t.scope) || void 0 === o ? void 0 : o.parent) || void 0 === r ? void 0 : r.isViewportScope)) {
                        T(d, (i => i === t.scope.parent.endpoint));
                        T(p, (i => i !== t && i.isClear(h) && i.endpoint.instance === t.scope.parent.endpoint));
                    }
                    if ("skip" !== u && t.hasNextScopeInstructions) for (const i of t.nextScopeInstructions) {
                        i.scope = l.scope;
                        i.endpoint.instance = null;
                    }
                    if ("skip" === u && !t.hasNextScopeInstructions) v.push(...await l.scope.processInstructions([], i, n, s, e));
                }
            }
            const m = p.filter((t => {
                var i;
                return "skip" === (null === (i = t.endpoint.instance) || void 0 === i ? void 0 : i.transitionAction);
            }));
            const R = m.filter((t => t.hasNextScopeInstructions));
            if (0 === m.length || 0 === R.length) {
                if (!h.isRestrictedNavigation) s.finalEndpoint();
                s.run();
                if (s.hasAllEndpoints) {
                    const t = s.waitForSyncState("guardedUnload");
                    if (t instanceof Promise) await t;
                }
            }
            if (s.cancelled) {
                h.cancelNavigation(n, s);
                return [];
            }
            for (const t of a) if (v.every((i => i !== t))) v.push(t);
            i.push(...p.splice(0));
            if (g.length > 0) ({matchedInstructions: p, remainingInstructions: g} = this.matchEndpoints(g, i));
            if (!h.isRestrictedNavigation && (p.length > 0 || g.length > 0) && s.running) {
                const t = s.waitForSyncState("swapped");
                if (t instanceof Promise) await t;
            }
            if (0 === p.length && 0 === g.length) {
                const o = [];
                for (const r of t) {
                    if (!r.hasNextScopeInstructions) continue;
                    const t = null !== (u = null === (l = r.endpoint.instance) || void 0 === l ? void 0 : l.scope) && void 0 !== u ? u : r.endpoint.scope;
                    o.push(t.processInstructions(r.nextScopeInstructions, i, n, s, e));
                }
                v.push(...(await Promise.all(o)).flat());
            }
            ({matchedInstructions: p, remainingInstructions: g} = s.dequeueAppendedInstructions(p, i, g));
            if (0 === p.length && 0 === g.length) {
                const t = i.map((t => {
                    var i, n;
                    return null === (n = (null === (i = t.endpoint.instance) || void 0 === i ? void 0 : i.connectedCE).pendingPromise) || void 0 === n ? void 0 : n.promise;
                })).filter((t => null != t));
                if (t.length > 0) {
                    await Promise.any(t);
                    ({matchedInstructions: p, remainingInstructions: g} = s.dequeueAppendedInstructions(p, i, g));
                } else p = d.map((t => RoutingInstruction.createClear(h, t)));
            }
            const I = t.filter((t => t.isUnresolved)).map((t => t.resolve())).filter((t => t instanceof Promise));
            if (I.length > 0) await Promise.all(I);
        } while (p.length > 0 || g.length > 0);
        return v;
    }
    unknownRoute(t) {
        const i = this.router.configuration.options;
        const n = RoutingInstruction.stringify(this.router, t);
        if (null != t[0].route) if (!i.useConfiguredRoutes) throw new Error("Can not match '" + n + "' since the router is configured to not use configured routes."); else throw new Error("No matching configured route found for '" + n + "'."); else if (i.useConfiguredRoutes && i.useDirectRouting) throw new Error("No matching configured route or component found for '" + n + "'."); else if (i.useConfiguredRoutes) throw new Error("No matching configured route found for '" + n + "'."); else throw new Error("No matching route/component found for '" + n + "'.");
    }
    ensureClearStateInstruction(t) {
        const i = this.router;
        if (!t.some((t => t.isClearAll(i)))) {
            const n = RoutingInstruction.create(RoutingInstruction.clear(i));
            n.scope = this;
            return [ n, ...t ];
        }
        return t;
    }
    getClearAllEndpoints(t) {
        const i = this.router;
        let n = [];
        if (t.some((t => {
            var n;
            return (null !== (n = t.scope) && void 0 !== n ? n : this) === this && t.isClearAll(i);
        }))) {
            n = this.enabledChildren.filter((t => !t.endpoint.isEmpty)).map((t => t.endpoint));
            t = t.filter((t => {
                var n;
                return !((null !== (n = t.scope) && void 0 !== n ? n : this) === this && t.isClearAll(i));
            }));
        }
        return {
            clearEndpoints: n,
            instructions: t
        };
    }
    findInstructions(t, i, n) {
        var s, e;
        const o = this.router;
        let r = new FoundRoute;
        if (n && !RoutingInstruction.containsSiblings(o, t)) {
            let n = t.filter((t => t.isClear(o) || t.isClearAll(o)));
            const l = t.filter((t => !t.isClear(o) && !t.isClearAll(o)));
            if (l.length > 0) for (const u of l) {
                const h = this.findMatchingRoute(RoutingInstruction.stringify(o, l));
                if (null !== (s = null === h || void 0 === h ? void 0 : h.foundConfiguration) && void 0 !== s ? s : false) {
                    r = h;
                    r.instructions = [ ...n, ...r.instructions ];
                    n = [];
                } else if (i) {
                    r.instructions = [ ...n, ...r.instructions, u ];
                    n = [];
                    r.remaining = RoutingInstruction.stringify(o, null !== (e = u.nextScopeInstructions) && void 0 !== e ? e : []);
                } else throw new Error(`No route found for: ${RoutingInstruction.stringify(o, t)}!`);
            } else r.instructions = [ ...n ];
        } else if (i) r.instructions.push(...t); else throw new Error(`No way to process sibling viewport routes with direct routing disabled: ${RoutingInstruction.stringify(o, t)}!`);
        r.instructions = r.instructions.filter((t => "" !== t.component.name));
        for (const t of r.instructions) if (null === t.scope) t.scope = this;
        return r;
    }
    matchEndpoints(t, i, n = false) {
        const s = [];
        const e = t.filter((t => {
            var i;
            return (null !== (i = t.scope) && void 0 !== i ? i : this) === this;
        }));
        const o = t.filter((t => {
            var i;
            return (null !== (i = t.scope) && void 0 !== i ? i : this) !== this;
        }));
        const {matchedInstructions: r, remainingInstructions: l} = EndpointMatcher.matchEndpoints(this, e, i, n);
        s.push(...r);
        o.push(...l);
        return {
            matchedInstructions: s,
            remainingInstructions: o
        };
    }
    addEndpoint(t, i, n, s = {}) {
        var e, o, r, l;
        let u = null !== (o = null === (e = this.getOwnedScopes().find((n => n.type === t && n.endpoint.name === i))) || void 0 === e ? void 0 : e.endpoint) && void 0 !== o ? o : null;
        if (null != n && null != (null === u || void 0 === u ? void 0 : u.connectedCE) && u.connectedCE !== n) u = null !== (l = null === (r = this.getOwnedScopes(true).find((s => s.type === t && s.endpoint.name === i && s.endpoint.connectedCE === n))) || void 0 === r ? void 0 : r.endpoint) && void 0 !== l ? l : null;
        if (null == u) {
            u = "Viewport" === t ? new Viewport(this.router, i, n, this.scope, !!s.scope, s) : new ViewportScope(this.router, i, n, this.scope, true, null, s);
            this.addChild(u.connectedScope);
        }
        if (null != n) u.setConnectedCE(n, s);
        return u;
    }
    removeEndpoint(t, i, n) {
        if (null !== (null !== n && void 0 !== n ? n : null) || i.removeEndpoint(t, n)) {
            this.removeChild(i.connectedScope);
            return true;
        }
        return false;
    }
    addChild(t) {
        if (!this.children.some((i => i === t))) {
            if (null !== t.parent) t.parent.removeChild(t);
            this.children.push(t);
            t.parent = this;
        }
    }
    removeChild(t) {
        const i = this.children.indexOf(t);
        if (i >= 0) {
            this.children.splice(i, 1);
            t.parent = null;
        }
    }
    allScopes(t = false) {
        const i = t ? this.children.slice() : this.enabledChildren;
        for (const n of i.slice()) i.push(...n.allScopes(t));
        return i;
    }
    reparentRoutingInstructions() {
        const t = this.hoistedChildren.filter((t => null !== t.routingInstruction && t.routingInstruction.component.name));
        if (!t.length) return null;
        for (const i of t) {
            const t = i.reparentRoutingInstructions();
            i.routingInstruction.nextScopeInstructions = null !== t && t.length > 0 ? t : null;
        }
        return t.map((t => t.routingInstruction));
    }
    getChildren(t) {
        const i = this.children.map((i => i.endpoint.getTimeContent(t))).filter((t => null !== t));
        return i.map((t => t.connectedScope));
    }
    getAllRoutingScopes(t) {
        const i = this.getChildren(t);
        for (const n of i.slice()) i.push(...n.getAllRoutingScopes(t));
        return i;
    }
    getOwnedRoutingScopes(t) {
        const i = this.getAllRoutingScopes(t).filter((t => t.owningScope === this));
        for (const n of i.slice()) if (n.passThroughScope) {
            const s = i.indexOf(n);
            i.splice(s, 1, ...n.getOwnedRoutingScopes(t));
        }
        return V(i);
    }
    getRoutingInstructions(t) {
        var i;
        const n = V(this.getOwnedRoutingScopes(t).map((t => t.endpoint))).map((i => i.getTimeContent(t))).filter((t => null !== t));
        const s = [];
        for (const e of n) {
            const n = e.instruction.clone(true, false, false);
            if ("" !== (null !== (i = n.component.name) && void 0 !== i ? i : "")) {
                n.nextScopeInstructions = e.connectedScope.getRoutingInstructions(t);
                s.push(n);
            }
        }
        return s;
    }
    canUnload(t) {
        return Runner.run(t, (t => Runner.runParallel(t, ...this.children.map((t => null !== t.endpoint ? i => t.endpoint.canUnload(i) : i => t.canUnload(i))))), (t => t.previousValue.every((t => t))));
    }
    unload(t) {
        return Runner.runParallel(t, ...this.children.map((t => null !== t.endpoint ? i => t.endpoint.unload(i) : i => t.unload(i))));
    }
    matchScope(t, i = false) {
        const n = [];
        for (const s of t) if (s.scope === this) n.push(s); else if (i && s.hasNextScopeInstructions) n.push(...this.matchScope(s.nextScopeInstructions, i));
        return n;
    }
    findMatchingRoute(t) {
        if (this.isViewportScope && !this.passThroughScope) return this.findMatchingRouteInRoutes(t, this.endpoint.getRoutes());
        if (this.isViewport) return this.findMatchingRouteInRoutes(t, this.endpoint.getRoutes());
        for (const i of this.enabledChildren) {
            const n = i.findMatchingRoute(t);
            if (null !== n) return n;
        }
        return null;
    }
    findMatchingRouteInRoutes(t, i) {
        var n, s, e;
        if (!Array.isArray(i)) return null;
        i = i.map((t => this.ensureProperRoute(t)));
        const o = [];
        for (const t of i) {
            const i = Array.isArray(t.path) ? t.path : [ t.path ];
            for (const n of i) {
                o.push({
                    ...t,
                    path: n,
                    handler: t
                });
                if ("" !== n) o.push({
                    ...t,
                    path: `${n}/*remainingPath`,
                    handler: t
                });
            }
        }
        const r = new FoundRoute;
        if (t.startsWith("/") || t.startsWith("+")) t = t.slice(1);
        const l = i.find((i => i.id === t));
        let u = {
            params: {},
            endpoint: {}
        };
        if (null != l) u.endpoint = {
            route: {
                handler: l
            }
        }; else {
            const i = new U;
            i.add(o);
            u = i.recognize(t);
        }
        if (null != u) {
            r.match = u.endpoint.route.handler;
            r.matching = t;
            const o = {
                ...u.params
            };
            if (null != o.remainingPath) {
                r.remaining = o.remainingPath;
                Reflect.deleteProperty(o, "remainingPath");
                r.matching = r.matching.slice(0, r.matching.indexOf(r.remaining));
            }
            r.params = o;
            if (null != (null === (n = r.match) || void 0 === n ? void 0 : n.redirectTo)) {
                let t = null === (s = r.match) || void 0 === s ? void 0 : s.redirectTo;
                if ((null !== (e = r.remaining) && void 0 !== e ? e : "").length > 0) t += `/${r.remaining}`;
                return this.findMatchingRouteInRoutes(t, i);
            }
        }
        if (r.foundConfiguration) {
            r.instructions = RoutingInstruction.clone(r.match.instructions, false, true);
            const t = r.instructions.slice();
            while (t.length > 0) {
                const i = t.shift();
                i.parameters.addParameters(r.params);
                i.route = r;
                if (i.hasNextScopeInstructions) t.unshift(...i.nextScopeInstructions);
            }
            if (r.instructions.length > 0) r.instructions[0].routeStart = true;
            const i = RoutingInstruction.parse(this.router, r.remaining);
            if (i.length > 0) {
                let t = r.instructions[0];
                while (t.hasNextScopeInstructions) t = t.nextScopeInstructions[0];
                t.nextScopeInstructions = i;
            }
        }
        return r;
    }
    ensureProperRoute(t) {
        if (void 0 === t.id) t.id = Array.isArray(t.path) ? t.path.join(",") : t.path;
        if (void 0 === t.instructions) t.instructions = [ {
            component: t.component,
            viewport: t.viewport,
            parameters: t.parameters,
            children: t.children
        } ];
        if (null === t.redirectTo) t.instructions = RoutingInstruction.from(this.router, t.instructions);
        return t;
    }
}

RoutingScope.lastId = 0;

class QueueTask {
    constructor(t, i, n = 0) {
        this.taskQueue = t;
        this.item = i;
        this.cost = n;
        this.done = false;
        this.promise = new Promise(((t, i) => {
            this.resolve = () => {
                this.taskQueue.resolve(this, t);
            };
            this.reject = t => {
                this.taskQueue.reject(this, i, t);
            };
        }));
    }
    async execute() {
        if ("execute" in this.item) await this.item.execute(this); else await this.item(this);
    }
    wait() {
        return this.promise;
    }
}

class TaskQueue {
    constructor(t) {
        this.callback = t;
        this.pending = [];
        this.processing = null;
        this.allowedExecutionCostWithinTick = null;
        this.currentExecutionCostInCurrentTick = 0;
        this.platform = null;
        this.task = null;
        this.dequeue = t => {
            var i;
            if (null !== this.processing) return;
            if (void 0 !== t) this.currentExecutionCostInCurrentTick = 0;
            if (0 === this.pending.length) return;
            if (null !== this.allowedExecutionCostWithinTick && void 0 === t && this.currentExecutionCostInCurrentTick + (this.pending[0].cost || 0) > this.allowedExecutionCostWithinTick) return;
            this.processing = this.pending.shift() || null;
            if (this.processing) {
                this.currentExecutionCostInCurrentTick += null !== (i = this.processing.cost) && void 0 !== i ? i : 0;
                if (void 0 !== this.callback) this.callback(this.processing); else this.processing.execute().catch((t => {
                    throw t;
                }));
            }
        };
    }
    get isActive() {
        return null !== this.task;
    }
    get length() {
        return this.pending.length;
    }
    start(t) {
        this.platform = t.platform;
        this.allowedExecutionCostWithinTick = t.allowedExecutionCostWithinTick;
        this.task = this.platform.domWriteQueue.queueTask(this.dequeue, {
            persistent: true
        });
    }
    stop() {
        this.task.cancel();
        this.task = null;
        this.allowedExecutionCostWithinTick = null;
        this.clear();
    }
    enqueue(t, i) {
        const n = Array.isArray(t);
        const s = n ? t : [ t ];
        const e = s.map(((t, n) => !Array.isArray(i) ? i : i[n])).map((t => void 0 !== t ? t : 1));
        const o = [];
        for (const t of s) o.push(t instanceof QueueTask ? t : this.createQueueTask(t, e.shift()));
        this.pending.push(...o);
        this.dequeue();
        return n ? o : o[0];
    }
    createQueueTask(t, i) {
        return new QueueTask(this, t, i);
    }
    clear() {
        this.pending.length = 0;
    }
    resolve(t, i) {
        i();
        this.processing = null;
        this.dequeue();
    }
    reject(t, i, n) {
        i(n);
        this.processing = null;
        this.dequeue();
    }
}

let H = class BrowserViewerStore {
    constructor(t, i, n, s, e) {
        this.platform = t;
        this.window = i;
        this.history = n;
        this.location = s;
        this.ea = e;
        this.allowedExecutionCostWithinTick = 2;
        this.isActive = false;
        this.options = {
            useUrlFragmentHash: true
        };
        this.forwardedState = {
            eventTask: null,
            suppressPopstate: false
        };
        this.pendingCalls = new TaskQueue;
    }
    start(t) {
        if (this.isActive) throw new Error("Browser navigation has already been started");
        this.isActive = true;
        if (void 0 != t.useUrlFragmentHash) this.options.useUrlFragmentHash = t.useUrlFragmentHash;
        this.pendingCalls.start({
            platform: this.platform,
            allowedExecutionCostWithinTick: this.allowedExecutionCostWithinTick
        });
        this.window.addEventListener("popstate", this);
    }
    stop() {
        if (!this.isActive) throw new Error("Browser navigation has not been started");
        this.window.removeEventListener("popstate", this);
        this.pendingCalls.stop();
        this.options = {
            useUrlFragmentHash: true
        };
        this.isActive = false;
    }
    get length() {
        return this.history.length;
    }
    get state() {
        return this.history.state;
    }
    get viewerState() {
        var t, i;
        const {pathname: n, search: s, hash: e} = this.location;
        const o = (null !== (t = this.options.useUrlFragmentHash) && void 0 !== t ? t : false) ? e.slice(1) : `${n}${s}`;
        const r = (null !== (i = this.options.useUrlFragmentHash) && void 0 !== i ? i : false) ? e.slice(1).includes("#") ? e.slice(e.slice(1).indexOf("#", 1)) : "" : e.slice(1);
        return new NavigatorViewerState(n, s.slice(1), r, o);
    }
    async go(t, i = false) {
        const n = this.pendingCalls.createQueueTask((t => t.resolve()), 1);
        this.pendingCalls.enqueue([ t => {
            const s = n;
            const e = i;
            this.forwardState({
                eventTask: s,
                suppressPopstate: e
            });
            t.resolve();
        }, i => {
            const n = this.history;
            const s = t;
            n.go(s);
            i.resolve();
        } ], [ 0, 1 ]);
        return n.wait();
    }
    async pushNavigatorState(t) {
        const {title: i, path: n} = t.navigations[t.navigationIndex];
        const s = this.options.useUrlFragmentHash ? "#/" : "";
        return this.pendingCalls.enqueue((e => {
            const o = this.history;
            const r = t;
            const l = i || "";
            const u = `${s}${n}`;
            try {
                o.pushState(r, l, u);
                this.setTitle(l);
            } catch (t) {
                const i = this.tryCleanState(r, "push", t);
                o.pushState(i, l, u);
                this.setTitle(l);
            }
            e.resolve();
        }), 1).wait();
    }
    async replaceNavigatorState(t, i, n) {
        const s = t.navigations[t.navigationIndex];
        null !== i && void 0 !== i ? i : i = s.title;
        null !== n && void 0 !== n ? n : n = s.path;
        const e = this.options.useUrlFragmentHash ? "#/" : "";
        return this.pendingCalls.enqueue((s => {
            const o = this.history;
            const r = t;
            const l = i || "";
            const u = `${e}${n}`;
            try {
                o.replaceState(r, l, u);
                this.setTitle(l);
            } catch (t) {
                const i = this.tryCleanState(r, "replace", t);
                o.replaceState(i, l, u);
                this.setTitle(l);
            }
            s.resolve();
        }), 1).wait();
    }
    async popNavigatorState() {
        const t = this.pendingCalls.createQueueTask((t => t.resolve()), 1);
        this.pendingCalls.enqueue((async i => {
            const n = t;
            await this.popState(n);
            i.resolve();
        }), 1);
        return t.wait();
    }
    setTitle(t) {
        this.window.document.title = t;
    }
    handleEvent(t) {
        this.handlePopStateEvent(t);
    }
    handlePopStateEvent(t) {
        const {eventTask: i, suppressPopstate: n} = this.forwardedState;
        this.forwardedState = {
            eventTask: null,
            suppressPopstate: false
        };
        this.pendingCalls.enqueue((async s => {
            if (!n) this.notifySubscribers(t);
            if (null !== i) await i.execute();
            s.resolve();
        }), 1);
    }
    notifySubscribers(t) {
        this.ea.publish(NavigatorStateChangeEvent.eventName, NavigatorStateChangeEvent.create(this.viewerState, t, this.history.state));
    }
    async popState(t) {
        var i, n;
        await this.go(-1, true);
        const s = this.history.state;
        const e = null === (i = null === s || void 0 === s ? void 0 : s.navigations) || void 0 === i ? void 0 : i[null !== (n = null === s || void 0 === s ? void 0 : s.navigationIndex) && void 0 !== n ? n : 0];
        if (null != e && !e.firstEntry) {
            await this.go(-1, true);
            await this.pushNavigatorState(s);
        }
        await t.execute();
    }
    forwardState(t) {
        this.forwardedState = t;
    }
    tryCleanState(t, i, n) {
        try {
            return JSON.parse(JSON.stringify(t));
        } catch (t) {
            throw new Error(`Failed to ${i} state, probably due to unserializable data and/or parameters: ${t}${n}`);
        }
    }
};

H = k([ $(0, u), $(1, h), $(2, a), $(3, c), $(4, i) ], H);

class NavigatorViewerState {
    constructor(t, i, n, s) {
        this.path = t;
        this.query = i;
        this.hash = n;
        this.instruction = s;
    }
}

class NavigatorStateChangeEvent {
    constructor(t, i, n, s) {
        this.eventName = t;
        this.viewerState = i;
        this.event = n;
        this.state = s;
    }
    static create(t, i, n) {
        return new NavigatorStateChangeEvent(NavigatorStateChangeEvent.eventName, t, i, n);
    }
}

NavigatorStateChangeEvent.eventName = "au:router:navigation-state-change";

class Entity {
    constructor(t) {
        this.endpoint = t;
        this.running = false;
        this.states = new Map;
        this.checkedStates = [];
        this.syncingState = null;
        this.syncPromise = null;
        this.step = null;
    }
    hasReachedState(t) {
        return this.states.has(t) && null === this.states.get(t);
    }
}

class NavigationCoordinator {
    constructor(t, i) {
        this.router = t;
        this.navigation = i;
        this.running = false;
        this.completed = false;
        this.cancelled = false;
        this.hasAllEndpoints = false;
        this.appendedInstructions = [];
        this.entities = [];
        this.syncStates = new Map;
        this.checkedSyncStates = new Set;
    }
    static create(t, i, n) {
        const s = new NavigationCoordinator(t, i);
        n.syncStates.forEach((t => s.addSyncState(t)));
        return s;
    }
    run() {
        if (!this.running) {
            this.running = true;
            for (const t of this.entities) if (!t.running) {
                t.running = true;
                t.endpoint.transition(this);
            }
        }
    }
    addSyncState(t) {
        const i = new OpenPromise;
        this.syncStates.set(t, i);
    }
    addEndpoint(t) {
        let i = this.entities.find((i => i.endpoint === t));
        if (void 0 !== i) return i;
        i = new Entity(t);
        this.entities.push(i);
        this.recheckSyncStates();
        if (this.running) i.endpoint.transition(this);
        return i;
    }
    removeEndpoint(t) {
        const i = this.entities.find((i => i.endpoint === t));
        if (void 0 !== i) T(this.entities, (t => t === i));
    }
    setEndpointStep(t, i) {
        let n = this.entities.find((i => i.endpoint === t));
        if (void 0 === n) n = this.addEndpoint(t);
        n.step = i;
    }
    addEndpointState(t, i) {
        let n = this.entities.find((i => i.endpoint === t));
        if (void 0 === n) n = this.addEndpoint(t);
        const s = n.states.get(i);
        if (s instanceof OpenPromise) s.resolve();
        n.states.set(i, null);
        this.checkSyncState(i);
    }
    waitForSyncState(t, i = null) {
        if (0 === this.entities.length) return;
        const n = this.syncStates.get(t);
        if (void 0 === n) return;
        if (null !== i) {
            const s = this.entities.find((t => t.endpoint === i));
            if (null === (null === s || void 0 === s ? void 0 : s.syncPromise) && n.isPending) {
                s.syncingState = t;
                s.syncPromise = new OpenPromise;
                s.checkedStates.push(t);
                this.checkedSyncStates.add(t);
                Promise.resolve().then((() => {
                    this.checkSyncState(t);
                })).catch((t => {
                    throw t;
                }));
                return s.syncPromise.promise;
            }
        }
        return n.isPending ? n.promise : void 0;
    }
    waitForEndpointState(t, i) {
        if (!this.syncStates.has(i)) return;
        let n = this.entities.find((i => i.endpoint === t));
        if (null == n) n = this.addEndpoint(t);
        if (n.hasReachedState(i)) return;
        let s = n.states.get(i);
        if (null == s) {
            s = new OpenPromise;
            n.states.set(i, s);
        }
        return s.promise;
    }
    finalEndpoint() {
        this.hasAllEndpoints = true;
        this.syncStates.forEach(((t, i) => this.checkSyncState(i)));
    }
    finalize() {
        this.entities.forEach((t => t.endpoint.finalizeContentChange(this, null)));
        this.completed = true;
        this.navigation.completed = true;
    }
    cancel() {
        this.cancelled = true;
        this.entities.forEach((t => {
            var i, n;
            const s = t.endpoint.cancelContentChange(this, null !== (n = null === (i = t.step) || void 0 === i ? void 0 : i.current) && void 0 !== n ? n : null);
            if (s instanceof Promise) s.catch((t => {
                throw t;
            }));
        }));
        this.router.navigator.cancel(this.navigation).then((() => {
            var t;
            null === (t = this.navigation.process) || void 0 === t ? void 0 : t.resolve(false);
        })).catch((t => {
            throw t;
        }));
        this.completed = true;
        this.navigation.completed = true;
    }
    enqueueAppendedInstructions(t) {
        this.appendedInstructions.push(...t);
    }
    dequeueAppendedInstructions(t, i, n) {
        let s = [ ...this.appendedInstructions ];
        t = [ ...t ];
        n = [ ...n ];
        const e = s.filter((t => !t.default));
        const o = s.filter((t => t.default));
        s = e.length > 0 ? [ ...e ] : [ ...o ];
        while (s.length > 0) {
            const e = s.shift();
            T(this.appendedInstructions, (t => t === e));
            const o = i.some((t => t.sameEndpoint(e, true)));
            const r = t.find((t => t.sameEndpoint(e, true)));
            const l = n.find((t => t.sameEndpoint(e, true)));
            if (e.default && (o || void 0 !== r && !r.default || void 0 !== l && !l.default)) continue;
            if (void 0 !== r) T(t, (t => t === r));
            if (void 0 !== l) T(n, (t => t === l));
            if (null !== e.endpoint.instance) t.push(e); else n.push(e);
        }
        return {
            matchedInstructions: t,
            remainingInstructions: n
        };
    }
    checkSyncState(t) {
        var i;
        const n = this.syncStates.get(t);
        if (void 0 === n) return;
        if (this.hasAllEndpoints && n.isPending && this.entities.every((i => i.hasReachedState(t))) && (!this.checkedSyncStates.has(t) || this.entities.every((i => i.checkedStates.includes(t))))) {
            for (const n of this.entities) if (n.syncingState === t) {
                null === (i = n.syncPromise) || void 0 === i ? void 0 : i.resolve();
                n.syncPromise = null;
                n.syncingState = null;
            }
            n.resolve();
        }
    }
    recheckSyncStates() {
        this.syncStates.forEach(((t, i) => {
            if (!t.isPending && !this.entities.every((t => t.hasReachedState(i)))) this.addSyncState(i);
        }));
    }
}

class RoutingHook {
    constructor(t, i, n) {
        var s, e;
        this.hook = t;
        this.id = n;
        this.type = "beforeNavigation";
        this.includeTargets = [];
        this.excludeTargets = [];
        if (void 0 !== i.type) this.type = i.type;
        for (const t of null !== (s = i.include) && void 0 !== s ? s : []) this.includeTargets.push(new Target(t));
        for (const t of null !== (e = i.exclude) && void 0 !== e ? e : []) this.excludeTargets.push(new Target(t));
    }
    static add(t, i) {
        const n = new RoutingHook(t, null !== i && void 0 !== i ? i : {}, ++this.lastIdentity);
        this.hooks[n.type].push(n);
        return this.lastIdentity;
    }
    static remove(t) {
        for (const i in this.hooks) if (Object.prototype.hasOwnProperty.call(this.hooks, i)) {
            const n = this.hooks[i].findIndex((i => i.id === t));
            if (n >= 0) this.hooks[i].splice(n, 1);
        }
    }
    static removeAll() {
        for (const t in this.hooks) this.hooks[t] = [];
    }
    static async invokeBeforeNavigation(t, i) {
        return this.invoke("beforeNavigation", i, t);
    }
    static async invokeTransformFromUrl(t, i) {
        return this.invoke("transformFromUrl", i, t);
    }
    static async invokeTransformToUrl(t, i) {
        return this.invoke("transformToUrl", i, t);
    }
    static async invokeTransformTitle(t, i) {
        return this.invoke("transformTitle", i, t);
    }
    static async invoke(t, i, n) {
        let s = n;
        for (const e of this.hooks[t]) if (!e.wantsMatch || e.matches(n)) {
            s = await e.invoke(i, n);
            if ("boolean" === typeof s) {
                if (!s) return false;
            } else n = s;
        }
        return s;
    }
    get wantsMatch() {
        return this.includeTargets.length > 0 || this.excludeTargets.length > 0;
    }
    matches(t) {
        if (this.includeTargets.length && !this.includeTargets.some((i => i.matches(t)))) return false;
        if (this.excludeTargets.length && this.excludeTargets.some((i => i.matches(t)))) return false;
        return true;
    }
    invoke(t, i) {
        return this.hook(i, t);
    }
}

RoutingHook.hooks = {
    beforeNavigation: [],
    transformFromUrl: [],
    transformToUrl: [],
    transformTitle: []
};

RoutingHook.lastIdentity = 0;

class Target {
    constructor(t) {
        this.componentType = null;
        this.componentName = null;
        this.viewport = null;
        this.viewportName = null;
        if ("string" === typeof t) this.componentName = t; else if (InstructionComponent.isType(t)) {
            this.componentType = t;
            this.componentName = InstructionComponent.getName(t);
        } else {
            const i = t;
            if (null != i.component) {
                this.componentType = InstructionComponent.isType(i.component) ? InstructionComponent.getType(i.component) : null;
                this.componentName = InstructionComponent.getName(i.component);
            }
            if (null != i.viewport) {
                this.viewport = InstructionEndpoint.isInstance(i.viewport) ? i.viewport : null;
                this.viewportName = InstructionEndpoint.getName(i.viewport);
            }
        }
    }
    matches(t) {
        const i = t.slice();
        if (!i.length) i.push(RoutingInstruction.create(""));
        for (const t of i) if (null !== this.componentName && this.componentName === t.component.name || null !== this.componentType && this.componentType === t.component.type || null !== this.viewportName && this.viewportName === t.endpoint.name || null !== this.viewport && this.viewport === t.endpoint.instance) return true;
        return false;
    }
}

class Title {
    static async getTitle(t, i, n) {
        let s = await RoutingHook.invokeTransformTitle(t, i);
        if ("string" !== typeof s) {
            const t = Title.stringifyTitles(s, i, n);
            s = n.appTitle;
            s = s.replace(/\${componentTitles}/g, t);
            s = s.replace(/\${appTitleSeparator}/g, "" !== t ? n.appTitleSeparator : "");
        }
        s = await RoutingHook.invokeTransformTitle(s, i);
        return s;
    }
    static stringifyTitles(t, i, n) {
        const s = t.map((t => Title.stringifyTitle(t, i, n))).filter((t => {
            var i;
            return (null !== (i = null === t || void 0 === t ? void 0 : t.length) && void 0 !== i ? i : 0) > 0;
        }));
        return s.join(" + ");
    }
    static stringifyTitle(t, i, n) {
        const s = t.nextScopeInstructions;
        let e = Title.resolveTitle(t, i, n);
        if (Array.isArray(s) && s.length > 0) {
            let t = Title.stringifyTitles(s, i, n);
            if (t.length > 0) {
                if (1 !== s.length) t = `[ ${t} ]`;
                if (e.length > 0) e = "top-down" === n.componentTitleOrder ? e + n.componentTitleSeparator + t : t + n.componentTitleSeparator + e; else e = t;
            }
        }
        return e;
    }
    static resolveTitle(t, i, n) {
        let s = t.getTitle(i);
        if (null != n.transformTitle) s = n.transformTitle(s, t, i);
        return s;
    }
}

const L = s.createInterface("IRouter", (t => t.singleton(Router)));

class Router {
    constructor(t, i, n, s, e, o) {
        this.container = t;
        this.ea = i;
        this.navigator = n;
        this.viewer = s;
        this.store = e;
        this.configuration = o;
        this.rootScope = null;
        this.activeComponents = [];
        this.appendedInstructions = [];
        this.isActive = false;
        this.coordinators = [];
        this.loadedFirst = false;
        this.handleNavigatorNavigateEvent = t => {
            this.processNavigation(t.navigation).catch((t => {
                throw t;
            }));
        };
        this.handleNavigatorStateChangeEvent = t => {
            var i;
            if (null != (null === (i = t.state) || void 0 === i ? void 0 : i.navigationIndex)) {
                const i = Navigation.create(t.state.navigations[t.state.navigationIndex]);
                i.instruction = t.viewerState.instruction;
                i.fromBrowser = true;
                this.navigator.navigate(i).catch((t => {
                    throw t;
                }));
            } else this.load(t.viewerState.instruction, {
                fromBrowser: true
            }).catch((t => {
                throw t;
            }));
        };
        this.processNavigation = async t => {
            var i;
            this.loadedFirst = true;
            const n = this.configuration.options;
            const s = NavigationCoordinator.create(this, t, {
                syncStates: this.configuration.options.navigationSyncStates
            });
            this.coordinators.push(s);
            s.appendedInstructions.push(...this.appendedInstructions.splice(0));
            this.ea.publish(RouterNavigationStartEvent.eventName, RouterNavigationStartEvent.create(t));
            let e = "string" === typeof t.instruction && !t.useFullStateInstruction ? await RoutingHook.invokeTransformFromUrl(t.instruction, s.navigation) : t.useFullStateInstruction ? t.fullStateInstruction : t.instruction;
            const o = n.basePath;
            if (null !== o && "string" === typeof e && e.startsWith(o) && !n.useUrlFragmentHash) e = e.slice(o.length);
            if ("/" === e) e = "";
            if ("string" === typeof e) e = "" === e ? [ new RoutingInstruction("") ] : RoutingInstruction.parse(this, e);
            null !== (i = t.scope) && void 0 !== i ? i : t.scope = this.rootScope.scope;
            const r = await t.scope.processInstructions(e, [], t, s);
            return Runner.run(null, (() => {
                s.finalEndpoint();
                return s.waitForSyncState("completed");
            }), (() => {
                s.finalize();
                return this.updateNavigation(t);
            }), (() => {
                if (t.navigation.new && !t.navigation.first && !t.repeating && r.every((t => t.options.noHistory))) t.untracked = true;
            }), (async () => {
                var t;
                while (this.coordinators.length > 0 && this.coordinators[0].completed) {
                    const i = this.coordinators.shift();
                    await this.navigator.finalize(i.navigation, false);
                    this.ea.publish(RouterNavigationCompleteEvent.eventName, RouterNavigationCompleteEvent.create(i.navigation));
                    this.ea.publish(RouterNavigationEndEvent.eventName, RouterNavigationEndEvent.create(i.navigation));
                    null === (t = i.navigation.process) || void 0 === t ? void 0 : t.resolve(true);
                }
            }));
        };
    }
    static get inject() {
        return [ n, i, x, H, H, st ];
    }
    get isNavigating() {
        return this.coordinators.length > 0;
    }
    get isRestrictedNavigation() {
        const t = this.configuration.options.navigationSyncStates;
        return t.includes("guardedLoad") || t.includes("unloaded") || t.includes("loaded") || t.includes("guarded") || t.includes("routed");
    }
    get statefulHistory() {
        return void 0 !== this.configuration.options.statefulHistoryLength && this.configuration.options.statefulHistoryLength > 0;
    }
    start() {
        if (this.isActive) throw new Error("Router has already been started");
        this.isActive = true;
        const t = this.container.get(f);
        this.rootScope = new ViewportScope(this, "rootScope", t.controller.viewModel, null, true, t.config.component);
        const i = this.configuration.options;
        if (null === i.basePath) {
            const n = new URL(t.host.baseURI);
            i.basePath = n.pathname;
        }
        if (i.basePath.endsWith("/")) i.basePath = i.basePath.slice(0, -1);
        this.navigator.start({
            store: this.store,
            viewer: this.viewer,
            statefulHistoryLength: this.configuration.options.statefulHistoryLength
        });
        this.navigatorStateChangeEventSubscription = this.ea.subscribe(NavigatorStateChangeEvent.eventName, this.handleNavigatorStateChangeEvent);
        this.navigatorNavigateEventSubscription = this.ea.subscribe(NavigatorNavigateEvent.eventName, this.handleNavigatorNavigateEvent);
        this.viewer.start({
            useUrlFragmentHash: this.configuration.options.useUrlFragmentHash
        });
        this.ea.publish(RouterStartEvent.eventName, RouterStartEvent.create());
    }
    stop() {
        if (!this.isActive) throw new Error("Router has not been started");
        this.ea.publish(RouterStopEvent.eventName, RouterStopEvent.create());
        this.navigator.stop();
        this.viewer.stop();
        this.navigatorStateChangeEventSubscription.dispose();
        this.navigatorNavigateEventSubscription.dispose();
    }
    async initialLoad() {
        const {instruction: t, hash: i} = this.viewer.viewerState;
        const n = this.load(t, {
            fragment: i,
            replacing: true,
            fromBrowser: false
        });
        this.loadedFirst = true;
        return n;
    }
    getEndpoint(t, i) {
        var n;
        return null !== (n = this.allEndpoints(t).find((t => t.name === i))) && void 0 !== n ? n : null;
    }
    allEndpoints(t, i = false) {
        return this.rootScope.scope.allScopes(i).filter((i => null === t || i.type === t)).map((t => t.endpoint));
    }
    addEndpoint(t, ...i) {
        throw new Error("Not implemented");
    }
    connectEndpoint(t, i, n, s, o) {
        const r = n.container;
        const l = r.has(Router.closestEndpointKey, true) ? r.get(Router.closestEndpointKey) : this.rootScope;
        const u = l.connectedScope;
        if (null === t) {
            t = u.addEndpoint(i, s, n, o);
            e.instance(Router.closestEndpointKey, t).register(r);
        }
        return t;
    }
    disconnectEndpoint(t, i, n) {
        if (!i.connectedScope.parent.removeEndpoint(t, i, n)) throw new Error("Failed to remove endpoint: " + i.name);
    }
    async load(t, i) {
        var n, s, e;
        i = null !== i && void 0 !== i ? i : {};
        t = this.extractFragment(t, i);
        t = this.extractQuery(t, i);
        let o = null;
        ({instructions: t, scope: o} = this.applyLoadOptions(t, i));
        if ((null !== (n = i.append) && void 0 !== n ? n : false) && (!this.loadedFirst || this.isNavigating)) {
            t = RoutingInstruction.from(this, t);
            this.appendInstructions(t, o);
            return Promise.resolve();
        }
        const r = Navigation.create({
            instruction: t,
            fullStateInstruction: "",
            scope: o,
            title: i.title,
            data: i.data,
            query: i.query,
            fragment: i.fragment,
            parameters: i.parameters,
            replacing: (null !== (s = i.replacing) && void 0 !== s ? s : false) || i.replace,
            repeating: i.append,
            fromBrowser: null !== (e = i.fromBrowser) && void 0 !== e ? e : false,
            origin: i.origin,
            completed: false
        });
        return this.navigator.navigate(r);
    }
    applyLoadOptions(t, i, n = true) {
        var s, e, o;
        i = null !== i && void 0 !== i ? i : {};
        if ("origin" in i && !("context" in i)) i.context = i.origin;
        let r = null !== (e = RoutingScope.for(null !== (s = i.context) && void 0 !== s ? s : null)) && void 0 !== e ? e : null;
        if ("string" === typeof t) {
            if (!t.startsWith("/")) {
                if (t.startsWith(".")) {
                    if (t.startsWith("./")) t = t.slice(2);
                    while (t.startsWith("../")) {
                        r = null !== (o = null === r || void 0 === r ? void 0 : r.parent) && void 0 !== o ? o : r;
                        t = t.slice(3);
                    }
                }
                if (null != (null === r || void 0 === r ? void 0 : r.path)) {
                    t = `${r.path}/${t}`;
                    r = null;
                }
            } else r = null;
            if (!n) {
                t = RoutingInstruction.from(this, t);
                for (const i of t) if (null === i.scope) i.scope = r;
            }
        } else {
            t = RoutingInstruction.from(this, t);
            for (const i of t) if (null === i.scope) i.scope = r;
        }
        return {
            instructions: t,
            scope: r
        };
    }
    refresh() {
        return this.navigator.refresh();
    }
    back() {
        return this.navigator.go(-1);
    }
    forward() {
        return this.navigator.go(1);
    }
    go(t) {
        return this.navigator.go(t);
    }
    checkActive(t, i) {
        if ("string" === typeof t) throw new Error(`Parameter instructions to checkActivate can not be a string ('${t}')!`);
        i = null !== i && void 0 !== i ? i : {};
        ({instructions: t} = this.applyLoadOptions(t, i));
        t.forEach((t => {
            var i;
            return null !== (i = t.scope) && void 0 !== i ? i : t.scope = this.rootScope.scope;
        }));
        const n = V(t.map((t => t.scope)));
        for (const i of n) {
            const n = i.matchScope(t, false);
            const s = i.matchScope(this.activeComponents, true);
            if (!RoutingInstruction.contains(this, s, n, true)) return false;
        }
        return true;
    }
    unresolvedInstructionsError(t, i) {
        this.ea.publish(RouterNavigationErrorEvent.eventName, RouterNavigationErrorEvent.create(t));
        this.ea.publish(RouterNavigationEndEvent.eventName, RouterNavigationEndEvent.create(t));
        throw z(i);
    }
    cancelNavigation(t, i) {
        i.cancel();
        this.ea.publish(RouterNavigationCancelEvent.eventName, RouterNavigationCancelEvent.create(t));
        this.ea.publish(RouterNavigationEndEvent.eventName, RouterNavigationEndEvent.create(t));
    }
    appendInstructions(t, i = null) {
        if (null === i) i = this.rootScope.scope;
        for (const n of t) if (null === n.scope) n.scope = i;
        let n = null;
        for (let t = this.coordinators.length - 1; t >= 0; t--) if (!this.coordinators[t].completed) {
            n = this.coordinators[t];
            break;
        }
        if (null === n) if (!this.loadedFirst) this.appendedInstructions.push(...t); else throw Error("Failed to append routing instructions to coordinator");
        null === n || void 0 === n ? void 0 : n.enqueueAppendedInstructions(t);
    }
    async updateNavigation(t) {
        var i, n, s, e, o, r, l;
        this.rootScope.scope.reparentRoutingInstructions();
        const u = this.rootScope.scope.getRoutingInstructions(t.timestamp);
        let {matchedInstructions: h} = this.rootScope.scope.matchEndpoints(u, [], true);
        let a = 100;
        while (h.length > 0) {
            if (0 === a--) throw new Error("Failed to find viewport when updating viewer paths.");
            h = h.map((t => {
                var i;
                const {matchedInstructions: n} = t.endpoint.instance.scope.matchEndpoints(null !== (i = t.nextScopeInstructions) && void 0 !== i ? i : [], [], true);
                return n;
            })).flat();
        }
        if (t.timestamp >= (null !== (n = null === (i = this.activeNavigation) || void 0 === i ? void 0 : i.timestamp) && void 0 !== n ? n : 0)) {
            this.activeNavigation = t;
            this.activeComponents = u;
        }
        let c = await RoutingHook.invokeTransformToUrl(u, t);
        if ("string" !== typeof c) c = RoutingInstruction.stringify(this, c, false, true);
        c = await RoutingHook.invokeTransformToUrl(c, t);
        if (null == t.query && null != t.parameters) {
            const i = new URLSearchParams;
            for (let [n, s] of Object.entries(t.parameters)) {
                n = encodeURIComponent(n);
                if (!Array.isArray(s)) s = [ s ];
                for (const t of s) i.append(n, encodeURIComponent(t));
            }
            t.query = i.toString();
        }
        let f = `${this.configuration.options.basePath}/`;
        if (null === f || "" !== c && "/" === c[0] || this.configuration.options.useUrlFragmentHash) f = "";
        const d = (null !== (e = null === (s = t.query) || void 0 === s ? void 0 : s.length) && void 0 !== e ? e : 0) > 0 ? "?" + t.query : "";
        const v = (null !== (r = null === (o = t.fragment) || void 0 === o ? void 0 : o.length) && void 0 !== r ? r : 0) > 0 ? "#" + t.fragment : "";
        t.path = f + c + d + v;
        const p = [ RoutingInstruction.create(RoutingInstruction.clear(this)) ];
        p.push(...RoutingInstruction.clone(u, this.statefulHistory));
        t.fullStateInstruction = p;
        if (null === (null !== (l = t.title) && void 0 !== l ? l : null)) {
            const i = await Title.getTitle(u, t, this.configuration.options.title);
            if (null !== i) t.title = i;
        }
        return Promise.resolve();
    }
    extractFragment(t, i) {
        if ("string" === typeof t && null == i.fragment) {
            const [n, s] = t.split("#");
            t = n;
            i.fragment = s;
        }
        return t;
    }
    extractQuery(t, i) {
        var n;
        if ("string" === typeof t && null == i.query) {
            const [n, s] = t.split("?");
            t = n;
            i.query = s;
        }
        if ("string" === typeof i.parameters && null == i.query) {
            i.query = i.parameters;
            i.parameters = void 0;
        }
        if ("string" === typeof i.query && i.query.length > 0) {
            null !== (n = i.parameters) && void 0 !== n ? n : i.parameters = {};
            const t = new URLSearchParams(i.query);
            t.forEach(((t, n) => {
                n = decodeURIComponent(n);
                t = decodeURIComponent(t);
                if (n in i.parameters) {
                    if (!Array.isArray(i.parameters[n])) i.parameters[n] = [ i.parameters[n] ];
                    i.parameters[n].push(t);
                } else i.parameters[n] = t;
            }));
        }
        return t;
    }
}

Router.closestEndpointKey = t.annotation.keyFor("closest-endpoint");

function z(t) {
    const i = new Error(`${t.length} remaining instructions after 100 iterations; there is likely an infinite loop.`);
    i.remainingInstructions = t;
    console.log(i, i.remainingInstructions);
    return i;
}

class RouterEvent {
    constructor(t) {
        this.eventName = t;
    }
}

class RouterStartEvent extends RouterEvent {
    static create() {
        return new RouterStartEvent(this.eventName);
    }
}

RouterStartEvent.eventName = "au:router:router-start";

class RouterStopEvent extends RouterEvent {
    static create() {
        return new RouterStopEvent(this.eventName);
    }
}

RouterStopEvent.eventName = "au:router:router-stop";

class RouterNavigationEvent {
    constructor(t, i) {
        this.eventName = t;
        this.navigation = i;
    }
}

class RouterNavigationStartEvent extends RouterNavigationEvent {
    static create(t) {
        return new RouterNavigationStartEvent(this.eventName, t);
    }
}

RouterNavigationStartEvent.eventName = "au:router:navigation-start";

class RouterNavigationEndEvent extends RouterNavigationEvent {
    static create(t) {
        return new RouterNavigationEndEvent(this.eventName, t);
    }
}

RouterNavigationEndEvent.eventName = "au:router:navigation-end";

class RouterNavigationCancelEvent extends RouterNavigationEvent {
    static create(t) {
        return new RouterNavigationCancelEvent(this.eventName, t);
    }
}

RouterNavigationCancelEvent.eventName = "au:router:navigation-cancel";

class RouterNavigationCompleteEvent extends RouterNavigationEvent {
    static create(t) {
        return new RouterNavigationCompleteEvent(this.eventName, t);
    }
}

RouterNavigationCompleteEvent.eventName = "au:router:navigation-complete";

class RouterNavigationErrorEvent extends RouterNavigationEvent {
    static create(t) {
        return new RouterNavigationErrorEvent(this.eventName, t);
    }
}

RouterNavigationErrorEvent.eventName = "au:router:navigation-error";

const B = s.createInterface("ILinkHandler", (t => t.singleton(q)));

let q = class LinkHandler {
    constructor(t, i) {
        this.window = t;
        this.router = i;
    }
    handleEvent(t) {
        this.handleClick(t);
    }
    handleClick(t) {
        var i, n;
        if (0 !== t.button || t.altKey || t.ctrlKey || t.metaKey || t.shiftKey) return;
        const s = t.currentTarget;
        if (s.hasAttribute("external")) return;
        const e = null !== (i = s.getAttribute("target")) && void 0 !== i ? i : "";
        if (e.length > 0 && e !== this.window.name && "_self" !== e) return;
        const o = d.for(s, "load");
        const r = void 0 !== o ? o.viewModel.value : null;
        const l = this.router.configuration.options.useHref && s.hasAttribute("href") ? s.getAttribute("href") : null;
        if ((null === r || 0 === r.length) && (null === l || 0 === l.length)) return;
        t.preventDefault();
        let u = null !== (n = null !== r && void 0 !== r ? r : l) && void 0 !== n ? n : "";
        if ("string" === typeof u && u.startsWith("#")) {
            u = u.slice(1);
            if (!u.startsWith("/")) u = `/${u}`;
        }
        this.router.load(u, {
            origin: s
        }).catch((t => {
            throw t;
        }));
    }
};

q = k([ $(0, h), $(1, L) ], q);

var Q;

(function(t) {
    t["default"] = "default";
    t["disallow"] = "disallow";
    t["reload"] = "reload";
    t["refresh"] = "refresh";
})(Q || (Q = {}));

function D(t) {
    return function(i) {
        return Route.configure(t, i);
    };
}

function J(t, i, n, s, e = false) {
    var o;
    if (e) return "" === i;
    if (n) return i;
    const r = null !== (o = s.getAttribute(t)) && void 0 !== o ? o : "";
    return r.length > 0 ? r : i;
}

function W(t, i) {
    if (t.isActive) return;
    return new Promise((t => {
        const n = i.subscribe(RouterStartEvent.eventName, (() => {
            t();
            n.dispose();
        }));
    }));
}

function _(t, i, n, s) {
    var e, o;
    let r = null === (o = null === (e = d.for(n, "considered-active")) || void 0 === e ? void 0 : e.viewModel) || void 0 === o ? void 0 : o.value;
    if (void 0 === r) r = s;
    const l = t.applyLoadOptions(r, {
        context: i
    });
    const u = RoutingInstruction.from(t, l.instructions);
    for (const t of u) if (null === t.scope) t.scope = l.scope;
    return u;
}

function G(t) {
    let i = t.parentElement;
    while (null != i) {
        if ("AU-VIEWPORT" === i.tagName) {
            i = null;
            break;
        }
        if (i.hasAttribute("load-active")) break;
        i = i.parentElement;
    }
    null !== i && void 0 !== i ? i : i = t;
    return i;
}

const K = o.createInjectable();

let Z = class ViewportCustomElement {
    constructor(t, i, n, s, e, o) {
        this.router = t;
        this.element = i;
        this.container = n;
        this.ea = s;
        this.parentViewport = e;
        this.instruction = o;
        this.name = "default";
        this.usedBy = "";
        this.default = "";
        this.fallback = "";
        this.fallbackAction = "";
        this.noScope = false;
        this.noLink = false;
        this.noTitle = false;
        this.noHistory = false;
        this.stateful = false;
        this.endpoint = null;
        this.pendingChildren = [];
        this.pendingPromise = null;
        this.isBound = false;
    }
    hydrated(t) {
        this.controller = t;
        this.container = t.container;
        const i = this.instruction.props.filter((t => "default" === t.to)).length > 0;
        if (i && null != this.parentViewport) {
            this.parentViewport.pendingChildren.push(this);
            if (null === this.parentViewport.pendingPromise) this.parentViewport.pendingPromise = new OpenPromise;
        }
        return Runner.run(null, (() => W(this.router, this.ea)), (() => {
            if (this.router.isRestrictedNavigation) this.connect();
        }));
    }
    binding(t, i, n) {
        this.isBound = true;
        return Runner.run(null, (() => W(this.router, this.ea)), (() => {
            if (!this.router.isRestrictedNavigation) this.connect();
        }), (() => {
            var t;
            if (null != (null === (t = this.endpoint) || void 0 === t ? void 0 : t.activeResolve)) {
                this.endpoint.activeResolve();
                this.endpoint.activeResolve = null;
            }
        }), (() => {
            var i;
            if (null !== this.endpoint && null === this.endpoint.getNextContent()) return null === (i = this.endpoint.activate(null, t, this.controller, n, void 0)) || void 0 === i ? void 0 : i.asValue;
        }));
    }
    detaching(t, i, n) {
        if (null !== this.endpoint) {
            this.isBound = false;
            return this.endpoint.deactivate(null, t, i, n);
        }
    }
    unbinding(t, i, n) {
        if (null !== this.endpoint) return this.disconnect(null);
    }
    dispose() {
        var t;
        null === (t = this.endpoint) || void 0 === t ? void 0 : t.dispose();
        this.endpoint = null;
    }
    connect() {
        const {isBound: t, element: i} = this;
        const n = J("name", this.name, t, i);
        const s = {};
        s.scope = !J("no-scope", this.noScope, false, i, true);
        s.usedBy = J("used-by", this.usedBy, t, i);
        s.default = J("default", this.default, t, i);
        s.fallback = J("fallback", this.fallback, t, i);
        s.fallbackAction = J("fallback-action", this.fallbackAction, t, i);
        s.noLink = J("no-link", this.noLink, t, i, true);
        s.noTitle = J("no-title", this.noTitle, t, i, true);
        s.noHistory = J("no-history", this.noHistory, t, i, true);
        s.stateful = J("stateful", this.stateful, t, i, true);
        Object.keys(s).forEach((t => {
            if (void 0 === s[t]) delete s[t];
        }));
        this.endpoint = this.router.connectEndpoint(this.endpoint, "Viewport", this, n, s);
        const e = this.parentViewport;
        if (null != e) {
            T(e.pendingChildren, (t => t === this));
            if (0 === e.pendingChildren.length && null !== e.pendingPromise) {
                e.pendingPromise.resolve();
                e.pendingPromise = null;
            }
        }
    }
    disconnect(t) {
        if (null !== this.endpoint) this.router.disconnectEndpoint(t, this.endpoint, this);
    }
    setActivity(t, i) {
        const n = this.router.configuration.options.indicators.viewportNavigating;
        if ("string" === typeof t) this.element.classList.toggle(t, i); else for (const s in t) this.element.classList.toggle(`${n}-${s}`, i && t[s]);
    }
};

k([ p ], Z.prototype, "name", void 0);

k([ p ], Z.prototype, "usedBy", void 0);

k([ p ], Z.prototype, "default", void 0);

k([ p ], Z.prototype, "fallback", void 0);

k([ p ], Z.prototype, "fallbackAction", void 0);

k([ p ], Z.prototype, "noScope", void 0);

k([ p ], Z.prototype, "noLink", void 0);

k([ p ], Z.prototype, "noTitle", void 0);

k([ p ], Z.prototype, "noHistory", void 0);

k([ p ], Z.prototype, "stateful", void 0);

Z = k([ v({
    name: "au-viewport",
    injectable: K
}), $(0, L), $(1, g), $(2, n), $(3, i), $(4, K), $(5, w) ], Z);

const X = o.createInjectable();

let Y = class ViewportScopeCustomElement {
    constructor(t, i, n, s, e) {
        this.router = t;
        this.element = i;
        this.container = n;
        this.parent = s;
        this.parentController = e;
        this.name = "default";
        this.catches = "";
        this.collection = false;
        this.source = null;
        this.viewportScope = null;
        this.isBound = false;
    }
    hydrated(t) {
        this.controller = t;
    }
    bound(t, i, n) {
        this.isBound = true;
        this.$controller.scope = this.parentController.scope;
        this.connect();
        if (null !== this.viewportScope) this.viewportScope.binding();
    }
    unbinding(t, i, n) {
        if (null !== this.viewportScope) this.viewportScope.unbinding();
        return Promise.resolve();
    }
    connect() {
        if (null === this.router.rootScope) return;
        const t = this.getAttribute("name", this.name);
        const i = {};
        let n = this.getAttribute("catches", this.catches);
        if (void 0 !== n) i.catches = n;
        n = this.getAttribute("collection", this.collection, true);
        if (void 0 !== n) i.collection = n;
        i.source = this.source || null;
        this.viewportScope = this.router.connectEndpoint(this.viewportScope, "ViewportScope", this, t, i);
    }
    disconnect() {
        if (this.viewportScope) this.router.disconnectEndpoint(null, this.viewportScope, this);
        this.viewportScope = null;
    }
    getAttribute(t, i, n = false) {
        if (this.isBound) return i; else if (this.element.hasAttribute(t)) if (n) return true; else {
            i = this.element.getAttribute(t);
            if (i.length > 0) return i;
        }
        return;
    }
};

k([ p ], Y.prototype, "name", void 0);

k([ p ], Y.prototype, "catches", void 0);

k([ p ], Y.prototype, "collection", void 0);

k([ p ], Y.prototype, "source", void 0);

Y = k([ v({
    name: "au-viewport-scope",
    template: "<template></template>",
    containerless: false,
    injectable: X
}), $(0, L), $(1, g), $(2, n), $(3, X), $(4, m) ], Y);

let tt = class LoadCustomAttribute {
    constructor(t, i, n, s) {
        this.element = t;
        this.router = i;
        this.linkHandler = n;
        this.ea = s;
        this.hasHref = null;
        this.navigationEndHandler = t => {
            this.updateActive();
        };
        this.activeClass = this.router.configuration.options.indicators.loadActive;
    }
    binding() {
        this.element.addEventListener("click", this.linkHandler);
        this.updateValue();
        this.updateActive();
        this.routerNavigationSubscription = this.ea.subscribe(RouterNavigationEndEvent.eventName, this.navigationEndHandler);
    }
    unbinding() {
        this.element.removeEventListener("click", this.linkHandler);
        this.routerNavigationSubscription.dispose();
    }
    valueChanged(t) {
        this.updateValue();
        this.updateActive();
    }
    updateValue() {
        if (null === this.hasHref) this.hasHref = this.element.hasAttribute("href");
        if (!this.hasHref) {
            let t = "string" === typeof this.value ? this.value : JSON.stringify(this.value);
            if (this.router.configuration.options.useUrlFragmentHash && !t.startsWith("#")) t = `#${t}`;
            this.element.setAttribute("href", t);
        }
    }
    updateActive() {
        const t = d.for(this.element, "load").parent;
        const i = _(this.router, t, this.element, this.value);
        const n = G(this.element);
        n.classList.toggle(this.activeClass, this.router.checkActive(i, {
            context: t
        }));
    }
};

k([ p({
    mode: b.toView
}) ], tt.prototype, "value", void 0);

tt = k([ R("load"), $(0, g), $(1, L), $(2, B), $(3, i) ], tt);

let it = class HrefCustomAttribute {
    constructor(t, i, n, s) {
        this.element = t;
        this.router = i;
        this.linkHandler = n;
        this.ea = s;
        this.navigationEndHandler = t => {
            this.updateActive();
        };
        this.activeClass = this.router.configuration.options.indicators.loadActive;
    }
    binding() {
        if (this.router.configuration.options.useHref && !this.hasLoad() && !this.element.hasAttribute("external")) {
            this.element.addEventListener("click", this.linkHandler);
            this.routerNavigationSubscription = this.ea.subscribe(RouterNavigationEndEvent.eventName, this.navigationEndHandler);
        }
        this.updateValue();
        this.updateActive();
    }
    unbinding() {
        var t;
        this.element.removeEventListener("click", this.linkHandler);
        null === (t = this.routerNavigationSubscription) || void 0 === t ? void 0 : t.dispose();
    }
    valueChanged() {
        this.updateValue();
        this.updateActive();
    }
    updateValue() {
        this.element.setAttribute("href", this.value);
    }
    updateActive() {
        if (this.router.configuration.options.useHref && !this.hasLoad() && !this.element.hasAttribute("external")) {
            const t = d.for(this.element, "href").parent;
            const i = _(this.router, t, this.element, this.value);
            const n = G(this.element);
            n.classList.toggle(this.activeClass, this.router.checkActive(i, {
                context: t
            }));
        }
    }
    hasLoad() {
        var t;
        const i = this.$controller.parent;
        const n = i.children;
        return null !== (t = null === n || void 0 === n ? void 0 : n.some((t => 1 === t.vmKind && t.viewModel instanceof tt))) && void 0 !== t ? t : false;
    }
};

k([ p({
    mode: b.toView
}) ], it.prototype, "value", void 0);

it = k([ R({
    name: "href",
    noMultiBindings: true
}), $(0, g), $(1, L), $(2, B), $(3, i) ], it);

let nt = class ConsideredActiveCustomAttribute {};

k([ p({
    mode: b.toView
}) ], nt.prototype, "value", void 0);

nt = k([ R("considered-active") ], nt);

const st = s.createInterface("IRouterConfiguration", (t => t.singleton(RouterConfiguration)));

const et = L;

const ot = [ et ];

const rt = Z;

const lt = Y;

const ut = tt;

const ht = it;

const at = [ Z, Y, tt, it, nt ];

class RouterConfiguration {
    static register(t) {
        const i = t.get(st);
        i.options = RouterConfiguration.options;
        i.options.setRouterConfiguration(i);
        RouterConfiguration.options = RouterOptions.create();
        return t.register(...ot, ...at, I.activating(L, RouterConfiguration.configurationCall), I.activated(L, (t => t.initialLoad())), I.deactivated(L, (t => t.stop())));
    }
    static customize(t) {
        if (void 0 === t) {
            RouterConfiguration.options = RouterOptions.create();
            RouterConfiguration.configurationCall = t => {
                t.start();
            };
        } else if (t instanceof Function) RouterConfiguration.configurationCall = t; else {
            RouterConfiguration.options = RouterOptions.create();
            RouterConfiguration.options.apply(t);
        }
        return RouterConfiguration;
    }
    static createContainer() {
        return this.register(s.createContainer());
    }
    static for(t) {
        if (t instanceof Router) return t.configuration;
        return t.get(st);
    }
    apply(t, i = false) {
        if (i) this.options = RouterOptions.create();
        this.options.apply(t);
    }
    addHook(t, i) {
        return RoutingHook.add(t, i);
    }
    removeHook(t) {
        return RoutingHook.remove(t);
    }
    removeAllHooks() {
        return RoutingHook.removeAll();
    }
}

RouterConfiguration.options = RouterOptions.create();

RouterConfiguration.configurationCall = t => {
    t.start();
};

export { M as ConfigurableRoute, nt as ConsideredActiveCustomAttribute, ot as DefaultComponents, at as DefaultResources, Endpoint$1 as Endpoint, EndpointContent, FoundRoute, it as HrefCustomAttribute, ht as HrefCustomAttributeRegistration, B as ILinkHandler, L as IRouter, st as IRouterConfiguration, InstructionParameters, q as LinkHandler, tt as LoadCustomAttribute, ut as LoadCustomAttributeRegistration, Navigation, NavigationCoordinator, NavigationFlags, x as Navigator, F as RecognizedRoute, j as RecognizerEndpoint, Q as ReloadBehavior, Route, U as RouteRecognizer, Router, RouterConfiguration, RouterNavigationCancelEvent, RouterNavigationCompleteEvent, RouterNavigationEndEvent, RouterNavigationErrorEvent, RouterNavigationStartEvent, RouterOptions, et as RouterRegistration, RouterStartEvent, RouterStopEvent, A as Routes, RoutingHook, RoutingInstruction, RoutingScope, Runner, Step, Viewport, ViewportContent, Z as ViewportCustomElement, rt as ViewportCustomElementRegistration, ViewportOptions, ViewportScope, ViewportScopeContent, Y as ViewportScopeCustomElement, lt as ViewportScopeCustomElementRegistration, D as route, O as routes };
//# sourceMappingURL=index.mjs.map
