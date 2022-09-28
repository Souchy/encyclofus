import { isObject as t, Metadata as i } from "@aurelia/metadata";

import { DI as e, IEventAggregator as n, ILogger as s, bound as o, onResolve as r, resolveAll as a, emptyObject as h, IContainer as c, isArrayIndex as u, Protocol as l, emptyArray as f, IModuleLoader as d, InstanceProvider as p, noop as v, Registration as g } from "@aurelia/kernel";

import { isCustomElementViewModel as w, IHistory as m, ILocation as $, IWindow as x, Controller as E, IPlatform as y, CustomElement as R, CustomElementDefinition as b, IController as S, IAppRoot as k, isCustomElementController as C, customElement as I, bindable as N, customAttribute as A, IEventTarget as T, INode as V, IEventDelegator as P, getRef as U, CustomAttribute as L, AppTask as O } from "@aurelia/runtime-html";

import { RecognizedRoute as j, Endpoint as D, ConfigurableRoute as M, RouteRecognizer as B } from "@aurelia/route-recognizer";

import { BindingMode as z } from "@aurelia/runtime";

class Batch {
    constructor(t, i, e) {
        this.stack = t;
        this.cb = i;
        this.done = false;
        this.next = null;
        this.head = null !== e && void 0 !== e ? e : this;
    }
    static start(t) {
        return new Batch(0, t, null);
    }
    push() {
        let t = this;
        do {
            ++t.stack;
            t = t.next;
        } while (null !== t);
    }
    pop() {
        let t = this;
        do {
            if (0 === --t.stack) t.invoke();
            t = t.next;
        } while (null !== t);
    }
    invoke() {
        const t = this.cb;
        if (null !== t) {
            this.cb = null;
            t(this);
            this.done = true;
        }
    }
    continueWith(t) {
        if (null === this.next) return this.next = new Batch(this.stack, t, this.head); else return this.next.continueWith(t);
    }
    start() {
        this.head.push();
        this.head.pop();
        return this;
    }
}

function q(t, i) {
    t = t.slice();
    i = i.slice();
    const e = [];
    while (t.length > 0) {
        const n = t.shift();
        const s = n.context.vpa;
        if (e.every((t => t.context.vpa !== s))) {
            const t = i.findIndex((t => t.context.vpa === s));
            if (t >= 0) e.push(...i.splice(0, t + 1)); else e.push(n);
        }
    }
    e.push(...i);
    return e;
}

function F(t) {
    try {
        return JSON.stringify(t);
    } catch (i) {
        return Object.prototype.toString.call(t);
    }
}

function H(t) {
    return "string" === typeof t ? [ t ] : t;
}

function W(t) {
    return "string" === typeof t ? t : t[0];
}

function G(t, i, e) {
    const n = e ? new URLSearchParams(t) : t;
    if (null == i) return n;
    for (const [t, e] of Object.entries(i)) n.append(t, e);
    return n;
}

function Y(t) {
    return "object" === typeof t && null !== t && !w(t);
}

function J(t) {
    return Y(t) && true === Object.prototype.hasOwnProperty.call(t, "name");
}

function _(t) {
    return Y(t) && true === Object.prototype.hasOwnProperty.call(t, "component");
}

function Z(t) {
    return Y(t) && true === Object.prototype.hasOwnProperty.call(t, "redirectTo");
}

function K(t) {
    return Y(t) && true === Object.prototype.hasOwnProperty.call(t, "component");
}

function Q(t, i, e) {
    throw new Error(`Invalid route config property: "${i}". Expected ${t}, but got ${F(e)}.`);
}

function X(t, i) {
    if (null === t || void 0 === t) throw new Error(`Invalid route config: expected an object or string, but got: ${String(t)}.`);
    const e = Object.keys(t);
    for (const n of e) {
        const e = t[n];
        const s = [ i, n ].join(".");
        switch (n) {
          case "id":
          case "viewport":
          case "redirectTo":
          case "fallback":
            if ("string" !== typeof e) Q("string", s, e);
            break;

          case "caseSensitive":
          case "nav":
            if ("boolean" !== typeof e) Q("boolean", s, e);
            break;

          case "data":
            if ("object" !== typeof e || null === e) Q("object", s, e);
            break;

          case "title":
            switch (typeof e) {
              case "string":
              case "function":
                break;

              default:
                Q("string or function", s, e);
            }
            break;

          case "path":
            if (e instanceof Array) {
                for (let t = 0; t < e.length; ++t) if ("string" !== typeof e[t]) Q("string", `${s}[${t}]`, e[t]);
            } else if ("string" !== typeof e) Q("string or Array of strings", s, e);
            break;

          case "component":
            it(e, s);
            break;

          case "routes":
            if (!(e instanceof Array)) Q("Array", s, e);
            for (const t of e) {
                const i = `${s}[${e.indexOf(t)}]`;
                it(t, i);
            }
            break;

          case "transitionPlan":
            switch (typeof e) {
              case "string":
                switch (e) {
                  case "none":
                  case "replace":
                  case "invoke-lifecycles":
                    break;

                  default:
                    Q("string('none'|'replace'|'invoke-lifecycles') or function", s, e);
                }
                break;

              case "function":
                break;

              default:
                Q("string('none'|'replace'|'invoke-lifecycles') or function", s, e);
            }
            break;

          default:
            throw new Error(`Unknown route config property: "${i}.${n}". Please specify known properties only.`);
        }
    }
}

function tt(t, i) {
    if (null === t || void 0 === t) throw new Error(`Invalid route config: expected an object or string, but got: ${String(t)}.`);
    const e = Object.keys(t);
    for (const n of e) {
        const e = t[n];
        const s = [ i, n ].join(".");
        switch (n) {
          case "path":
            if (e instanceof Array) {
                for (let t = 0; t < e.length; ++t) if ("string" !== typeof e[t]) Q("string", `${s}[${t}]`, e[t]);
            } else if ("string" !== typeof e) Q("string or Array of strings", s, e);
            break;

          case "redirectTo":
            if ("string" !== typeof e) Q("string", s, e);
            break;

          default:
            throw new Error(`Unknown redirect config property: "${i}.${n}". Only 'path' and 'redirectTo' should be specified for redirects.`);
        }
    }
}

function it(t, i) {
    switch (typeof t) {
      case "function":
        break;

      case "object":
        if (t instanceof Promise) break;
        if (Z(t)) {
            tt(t, i);
            break;
        }
        if (_(t)) {
            X(t, i);
            break;
        }
        if (!w(t) && !J(t)) Q(`an object with at least a 'component' property (see Routeable)`, i, t);
        break;

      case "string":
        break;

      default:
        Q("function, object or string (see Routeable)", i, t);
    }
}

function et(t, i) {
    if (t === i) return true;
    if (typeof t !== typeof i) return false;
    if (null === t || null === i) return false;
    if (Object.getPrototypeOf(t) !== Object.getPrototypeOf(i)) return false;
    const e = Object.keys(t);
    const n = Object.keys(i);
    if (e.length !== n.length) return false;
    for (let s = 0, o = e.length; s < o; ++s) {
        const o = e[s];
        if (o !== n[s]) return false;
        if (t[o] !== i[o]) return false;
    }
    return true;
}

function nt(t, i, e, n) {
    var s = arguments.length, o = s < 3 ? i : null === n ? n = Object.getOwnPropertyDescriptor(i, e) : n, r;
    if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) o = Reflect.decorate(t, i, e, n); else for (var a = t.length - 1; a >= 0; a--) if (r = t[a]) o = (s < 3 ? r(o) : s > 3 ? r(i, e, o) : r(i, e)) || o;
    return s > 3 && o && Object.defineProperty(i, e, o), o;
}

function st(t, i) {
    return function(e, n) {
        i(e, n, t);
    };
}

const ot = "au-nav-id";

class Subscription {
    constructor(t, i, e) {
        this.events = t;
        this.serial = i;
        this.inner = e;
        this.disposed = false;
    }
    dispose() {
        if (!this.disposed) {
            this.disposed = true;
            this.inner.dispose();
            const t = this.events["subscriptions"];
            t.splice(t.indexOf(this), 1);
        }
    }
}

const rt = e.createInterface("IRouterEvents", (t => t.singleton(at)));

let at = class RouterEvents {
    constructor(t, i) {
        this.ea = t;
        this.logger = i;
        this.subscriptionSerial = 0;
        this.subscriptions = [];
        this.logger = i.scopeTo("RouterEvents");
    }
    publish(t) {
        this.logger.trace(`publishing %s`, t);
        this.ea.publish(t.name, t);
    }
    subscribe(t, i) {
        const e = new Subscription(this, ++this.subscriptionSerial, this.ea.subscribe(t, (n => {
            this.logger.trace(`handling %s for subscription #${e.serial}`, t);
            i(n);
        })));
        this.subscriptions.push(e);
        return e;
    }
};

at = nt([ st(0, n), st(1, s) ], at);

class LocationChangeEvent {
    constructor(t, i, e, n) {
        this.id = t;
        this.url = i;
        this.trigger = e;
        this.state = n;
    }
    get name() {
        return "au:router:location-change";
    }
    toString() {
        return `LocationChangeEvent(id:${this.id},url:'${this.url}',trigger:'${this.trigger}')`;
    }
}

class NavigationStartEvent {
    constructor(t, i, e, n) {
        this.id = t;
        this.instructions = i;
        this.trigger = e;
        this.managedState = n;
    }
    get name() {
        return "au:router:navigation-start";
    }
    toString() {
        return `NavigationStartEvent(id:${this.id},instructions:'${this.instructions}',trigger:'${this.trigger}')`;
    }
}

class NavigationEndEvent {
    constructor(t, i, e) {
        this.id = t;
        this.instructions = i;
        this.finalInstructions = e;
    }
    get name() {
        return "au:router:navigation-end";
    }
    toString() {
        return `NavigationEndEvent(id:${this.id},instructions:'${this.instructions}',finalInstructions:'${this.finalInstructions}')`;
    }
}

class NavigationCancelEvent {
    constructor(t, i, e) {
        this.id = t;
        this.instructions = i;
        this.reason = e;
    }
    get name() {
        return "au:router:navigation-cancel";
    }
    toString() {
        return `NavigationCancelEvent(id:${this.id},instructions:'${this.instructions}',reason:${String(this.reason)})`;
    }
}

class NavigationErrorEvent {
    constructor(t, i, e) {
        this.id = t;
        this.instructions = i;
        this.error = e;
    }
    get name() {
        return "au:router:navigation-error";
    }
    toString() {
        return `NavigationErrorEvent(id:${this.id},instructions:'${this.instructions}',error:${String(this.error)})`;
    }
}

const ht = e.createInterface("IBaseHref");

const ct = e.createInterface("ILocationManager", (t => t.singleton(ut)));

let ut = class BrowserLocationManager {
    constructor(t, i, e, n, s, o) {
        this.logger = t;
        this.events = i;
        this.history = e;
        this.location = n;
        this.window = s;
        this.baseHref = o;
        this.eventId = 0;
        t = this.logger = t.root.scopeTo("LocationManager");
        t.debug(`baseHref set to path: ${o.href}`);
    }
    startListening() {
        this.logger.trace(`startListening()`);
        this.window.addEventListener("popstate", this.onPopState, false);
        this.window.addEventListener("hashchange", this.onHashChange, false);
    }
    stopListening() {
        this.logger.trace(`stopListening()`);
        this.window.removeEventListener("popstate", this.onPopState, false);
        this.window.removeEventListener("hashchange", this.onHashChange, false);
    }
    onPopState(t) {
        this.logger.trace(`onPopState()`);
        this.events.publish(new LocationChangeEvent(++this.eventId, this.getPath(), "popstate", t.state));
    }
    onHashChange(t) {
        this.logger.trace(`onHashChange()`);
        this.events.publish(new LocationChangeEvent(++this.eventId, this.getPath(), "hashchange", null));
    }
    pushState(t, i, e) {
        e = this.addBaseHref(e);
        try {
            const n = JSON.stringify(t);
            this.logger.trace(`pushState(state:${n},title:'${i}',url:'${e}')`);
        } catch (t) {
            this.logger.warn(`pushState(state:NOT_SERIALIZABLE,title:'${i}',url:'${e}')`);
        }
        this.history.pushState(t, i, e);
    }
    replaceState(t, i, e) {
        e = this.addBaseHref(e);
        try {
            const n = JSON.stringify(t);
            this.logger.trace(`replaceState(state:${n},title:'${i}',url:'${e}')`);
        } catch (t) {
            this.logger.warn(`replaceState(state:NOT_SERIALIZABLE,title:'${i}',url:'${e}')`);
        }
        this.history.replaceState(t, i, e);
    }
    getPath() {
        const {pathname: t, search: i, hash: e} = this.location;
        const n = this.removeBaseHref(`${t}${ft(i)}${e}`);
        this.logger.trace(`getPath() -> '${n}'`);
        return n;
    }
    currentPathEquals(t) {
        const i = this.getPath() === this.removeBaseHref(t);
        this.logger.trace(`currentPathEquals(path:'${t}') -> ${i}`);
        return i;
    }
    addBaseHref(t) {
        const i = t;
        let e;
        let n = this.baseHref.href;
        if (n.endsWith("/")) n = n.slice(0, -1);
        if (0 === n.length) e = t; else {
            if (t.startsWith("/")) t = t.slice(1);
            e = `${n}/${t}`;
        }
        this.logger.trace(`addBaseHref(path:'${i}') -> '${e}'`);
        return e;
    }
    removeBaseHref(t) {
        const i = t;
        const e = this.baseHref.pathname;
        if (t.startsWith(e)) t = t.slice(e.length);
        t = lt(t);
        this.logger.trace(`removeBaseHref(path:'${i}') -> '${t}'`);
        return t;
    }
};

nt([ o ], ut.prototype, "onPopState", null);

nt([ o ], ut.prototype, "onHashChange", null);

ut = nt([ st(0, s), st(1, rt), st(2, m), st(3, $), st(4, x), st(5, ht) ], ut);

function lt(t) {
    let i;
    let e;
    let n;
    if ((n = t.indexOf("?")) >= 0 || (n = t.indexOf("#")) >= 0) {
        i = t.slice(0, n);
        e = t.slice(n);
    } else {
        i = t;
        e = "";
    }
    if (i.endsWith("/")) i = i.slice(0, -1); else if (i.endsWith("/index.html")) i = i.slice(0, -11);
    return `${i}${e}`;
}

function ft(t) {
    return t.length > 0 && !t.startsWith("?") ? `?${t}` : t;
}

const dt = [ "?", "#", "/", "+", "(", ")", ".", "@", "!", "=", ",", "&", "'", "~", ";" ];

class ParserState {
    constructor(t) {
        this.input = t;
        this.buffers = [];
        this.bufferIndex = 0;
        this.index = 0;
        this.rest = t;
    }
    get done() {
        return 0 === this.rest.length;
    }
    startsWith(...t) {
        const i = this.rest;
        return t.some((function(t) {
            return i.startsWith(t);
        }));
    }
    consumeOptional(t) {
        if (this.startsWith(t)) {
            this.rest = this.rest.slice(t.length);
            this.index += t.length;
            this.append(t);
            return true;
        }
        return false;
    }
    consume(t) {
        if (!this.consumeOptional(t)) this.expect(`'${t}'`);
    }
    expect(t) {
        throw new Error(`Expected ${t} at index ${this.index} of '${this.input}', but got: '${this.rest}' (rest='${this.rest}')`);
    }
    ensureDone() {
        if (!this.done) throw new Error(`Unexpected '${this.rest}' at index ${this.index} of '${this.input}'`);
    }
    advance() {
        const t = this.rest[0];
        this.rest = this.rest.slice(1);
        ++this.index;
        this.append(t);
    }
    record() {
        this.buffers[this.bufferIndex++] = "";
    }
    playback() {
        const t = --this.bufferIndex;
        const i = this.buffers;
        const e = i[t];
        i[t] = "";
        return e;
    }
    discard() {
        this.buffers[--this.bufferIndex] = "";
    }
    append(t) {
        const i = this.bufferIndex;
        const e = this.buffers;
        for (let n = 0; n < i; ++n) e[n] += t;
    }
}

var pt;

(function(t) {
    t[t["Route"] = 0] = "Route";
    t[t["CompositeSegment"] = 1] = "CompositeSegment";
    t[t["ScopedSegment"] = 2] = "ScopedSegment";
    t[t["SegmentGroup"] = 3] = "SegmentGroup";
    t[t["Segment"] = 4] = "Segment";
    t[t["Component"] = 5] = "Component";
    t[t["Action"] = 6] = "Action";
    t[t["Viewport"] = 7] = "Viewport";
    t[t["ParameterList"] = 8] = "ParameterList";
    t[t["Parameter"] = 9] = "Parameter";
})(pt || (pt = {}));

const vt = new Map;

const gt = new Map;

class RouteExpression {
    constructor(t, i, e, n, s, o) {
        this.raw = t;
        this.isAbsolute = i;
        this.root = e;
        this.queryParams = n;
        this.fragment = s;
        this.fragmentIsRoute = o;
    }
    get kind() {
        return 0;
    }
    static parse(t, i) {
        const e = i ? vt : gt;
        let n = e.get(t);
        if (void 0 === n) e.set(t, n = RouteExpression.$parse(t, i));
        return n;
    }
    static $parse(t, i) {
        let e;
        const n = t.indexOf("#");
        if (n >= 0) {
            const s = t.slice(n + 1);
            e = decodeURIComponent(s);
            if (i) t = e; else t = t.slice(0, n);
        } else {
            if (i) t = "";
            e = null;
        }
        let s = null;
        const o = t.indexOf("?");
        if (o >= 0) {
            const i = t.slice(o + 1);
            t = t.slice(0, o);
            s = new URLSearchParams(i);
        }
        if ("" === t) return new RouteExpression("", false, SegmentExpression.EMPTY, null != s ? Object.freeze(s) : Ut, e, i);
        const r = new ParserState(t);
        r.record();
        const a = r.consumeOptional("/");
        const h = CompositeSegmentExpression.parse(r);
        r.ensureDone();
        const c = r.playback();
        return new RouteExpression(c, a, h, null != s ? Object.freeze(s) : Ut, e, i);
    }
    toInstructionTree(t) {
        return new ViewportInstructionTree(t, this.isAbsolute, this.root.toInstructions(0, 0), G(this.queryParams, t.queryParams, true), this.fragment);
    }
    toString() {
        return this.raw;
    }
}

class CompositeSegmentExpression {
    constructor(t, i) {
        this.raw = t;
        this.siblings = i;
    }
    get kind() {
        return 1;
    }
    static parse(t) {
        t.record();
        const i = t.consumeOptional("+");
        const e = [];
        do {
            e.push(ScopedSegmentExpression.parse(t));
        } while (t.consumeOptional("+"));
        if (!i && 1 === e.length) {
            t.discard();
            return e[0];
        }
        const n = t.playback();
        return new CompositeSegmentExpression(n, e);
    }
    toInstructions(t, i) {
        switch (this.siblings.length) {
          case 0:
            return [];

          case 1:
            return this.siblings[0].toInstructions(t, i);

          case 2:
            return [ ...this.siblings[0].toInstructions(t, 0), ...this.siblings[1].toInstructions(0, i) ];

          default:
            return [ ...this.siblings[0].toInstructions(t, 0), ...this.siblings.slice(1, -1).flatMap((function(t) {
                return t.toInstructions(0, 0);
            })), ...this.siblings[this.siblings.length - 1].toInstructions(0, i) ];
        }
    }
    toString() {
        return this.raw;
    }
}

class ScopedSegmentExpression {
    constructor(t, i, e) {
        this.raw = t;
        this.left = i;
        this.right = e;
    }
    get kind() {
        return 2;
    }
    static parse(t) {
        t.record();
        const i = SegmentGroupExpression.parse(t);
        if (t.consumeOptional("/")) {
            const e = ScopedSegmentExpression.parse(t);
            const n = t.playback();
            return new ScopedSegmentExpression(n, i, e);
        }
        t.discard();
        return i;
    }
    toInstructions(t, i) {
        const e = this.left.toInstructions(t, 0);
        const n = this.right.toInstructions(0, i);
        let s = e[e.length - 1];
        while (s.children.length > 0) s = s.children[s.children.length - 1];
        s.children.push(...n);
        return e;
    }
    toString() {
        return this.raw;
    }
}

class SegmentGroupExpression {
    constructor(t, i) {
        this.raw = t;
        this.expression = i;
    }
    get kind() {
        return 3;
    }
    static parse(t) {
        t.record();
        if (t.consumeOptional("(")) {
            const i = CompositeSegmentExpression.parse(t);
            t.consume(")");
            const e = t.playback();
            return new SegmentGroupExpression(e, i);
        }
        t.discard();
        return SegmentExpression.parse(t);
    }
    toInstructions(t, i) {
        return this.expression.toInstructions(t + 1, i + 1);
    }
    toString() {
        return this.raw;
    }
}

class SegmentExpression {
    constructor(t, i, e, n, s) {
        this.raw = t;
        this.component = i;
        this.action = e;
        this.viewport = n;
        this.scoped = s;
    }
    get kind() {
        return 4;
    }
    static get EMPTY() {
        return new SegmentExpression("", ComponentExpression.EMPTY, ActionExpression.EMPTY, ViewportExpression.EMPTY, true);
    }
    static parse(t) {
        t.record();
        const i = ComponentExpression.parse(t);
        const e = ActionExpression.parse(t);
        const n = ViewportExpression.parse(t);
        const s = !t.consumeOptional("!");
        const o = t.playback();
        return new SegmentExpression(o, i, e, n, s);
    }
    toInstructions(t, i) {
        return [ ViewportInstruction.create({
            component: this.component.name,
            params: this.component.parameterList.toObject(),
            viewport: this.viewport.name,
            open: t,
            close: i
        }) ];
    }
    toString() {
        return this.raw;
    }
}

class ComponentExpression {
    constructor(t, i, e) {
        this.raw = t;
        this.name = i;
        this.parameterList = e;
        switch (i.charAt(0)) {
          case ":":
            this.isParameter = true;
            this.isStar = false;
            this.isDynamic = true;
            this.parameterName = i.slice(1);
            break;

          case "*":
            this.isParameter = false;
            this.isStar = true;
            this.isDynamic = true;
            this.parameterName = i.slice(1);
            break;

          default:
            this.isParameter = false;
            this.isStar = false;
            this.isDynamic = false;
            this.parameterName = i;
            break;
        }
    }
    get kind() {
        return 5;
    }
    static get EMPTY() {
        return new ComponentExpression("", "", ParameterListExpression.EMPTY);
    }
    static parse(t) {
        t.record();
        t.record();
        if (!t.done) if (t.startsWith("./")) t.advance(); else if (t.startsWith("../")) {
            t.advance();
            t.advance();
        } else while (!t.done && !t.startsWith(...dt)) t.advance();
        const i = decodeURIComponent(t.playback());
        if (0 === i.length) t.expect("component name");
        const e = ParameterListExpression.parse(t);
        const n = t.playback();
        return new ComponentExpression(n, i, e);
    }
    toString() {
        return this.raw;
    }
}

class ActionExpression {
    constructor(t, i, e) {
        this.raw = t;
        this.name = i;
        this.parameterList = e;
    }
    get kind() {
        return 6;
    }
    static get EMPTY() {
        return new ActionExpression("", "", ParameterListExpression.EMPTY);
    }
    static parse(t) {
        t.record();
        let i = "";
        if (t.consumeOptional(".")) {
            t.record();
            while (!t.done && !t.startsWith(...dt)) t.advance();
            i = decodeURIComponent(t.playback());
            if (0 === i.length) t.expect("method name");
        }
        const e = ParameterListExpression.parse(t);
        const n = t.playback();
        return new ActionExpression(n, i, e);
    }
    toString() {
        return this.raw;
    }
}

class ViewportExpression {
    constructor(t, i) {
        this.raw = t;
        this.name = i;
    }
    get kind() {
        return 7;
    }
    static get EMPTY() {
        return new ViewportExpression("", "");
    }
    static parse(t) {
        t.record();
        let i = "";
        if (t.consumeOptional("@")) {
            t.record();
            while (!t.done && !t.startsWith(...dt)) t.advance();
            i = decodeURIComponent(t.playback());
            if (0 === i.length) t.expect("viewport name");
        }
        const e = t.playback();
        return new ViewportExpression(e, i);
    }
    toString() {
        return this.raw;
    }
}

class ParameterListExpression {
    constructor(t, i) {
        this.raw = t;
        this.expressions = i;
    }
    get kind() {
        return 8;
    }
    static get EMPTY() {
        return new ParameterListExpression("", []);
    }
    static parse(t) {
        t.record();
        const i = [];
        if (t.consumeOptional("(")) {
            do {
                i.push(ParameterExpression.parse(t, i.length));
                if (!t.consumeOptional(",")) break;
            } while (!t.done && !t.startsWith(")"));
            t.consume(")");
        }
        const e = t.playback();
        return new ParameterListExpression(e, i);
    }
    toObject() {
        const t = {};
        for (const i of this.expressions) t[i.key] = i.value;
        return t;
    }
    toString() {
        return this.raw;
    }
}

class ParameterExpression {
    constructor(t, i, e) {
        this.raw = t;
        this.key = i;
        this.value = e;
    }
    get kind() {
        return 9;
    }
    static get EMPTY() {
        return new ParameterExpression("", "", "");
    }
    static parse(t, i) {
        t.record();
        t.record();
        while (!t.done && !t.startsWith(...dt)) t.advance();
        let e = decodeURIComponent(t.playback());
        if (0 === e.length) t.expect("parameter key");
        let n;
        if (t.consumeOptional("=")) {
            t.record();
            while (!t.done && !t.startsWith(...dt)) t.advance();
            n = decodeURIComponent(t.playback());
            if (0 === n.length) t.expect("parameter value");
        } else {
            n = e;
            e = i.toString();
        }
        const s = t.playback();
        return new ParameterExpression(s, e, n);
    }
    toString() {
        return this.raw;
    }
}

const wt = Object.freeze({
    RouteExpression: RouteExpression,
    CompositeSegmentExpression: CompositeSegmentExpression,
    ScopedSegmentExpression: ScopedSegmentExpression,
    SegmentGroupExpression: SegmentGroupExpression,
    SegmentExpression: SegmentExpression,
    ComponentExpression: ComponentExpression,
    ActionExpression: ActionExpression,
    ViewportExpression: ViewportExpression,
    ParameterListExpression: ParameterListExpression,
    ParameterExpression: ParameterExpression
});

class ViewportRequest {
    constructor(t, i, e) {
        this.viewportName = t;
        this.componentName = i;
        this.resolution = e;
    }
    toString() {
        return `VR(viewport:'${this.viewportName}',component:'${this.componentName}',resolution:'${this.resolution}')`;
    }
}

const mt = new WeakMap;

class ViewportAgent {
    constructor(t, i, e) {
        this.viewport = t;
        this.hostController = i;
        this.ctx = e;
        this.isActive = false;
        this.curCA = null;
        this.nextCA = null;
        this.state = 8256;
        this.$resolution = "dynamic";
        this.$plan = "replace";
        this.currNode = null;
        this.nextNode = null;
        this.currTransition = null;
        this.prevTransition = null;
        this.logger = e.container.get(s).scopeTo(`ViewportAgent<${e.friendlyPath}>`);
        this.logger.trace(`constructor()`);
    }
    get $state() {
        return Rt(this.state);
    }
    get currState() {
        return 16256 & this.state;
    }
    set currState(t) {
        this.state = 127 & this.state | t;
    }
    get nextState() {
        return 127 & this.state;
    }
    set nextState(t) {
        this.state = 16256 & this.state | t;
    }
    static for(t, i) {
        let e = mt.get(t);
        if (void 0 === e) {
            const n = E.getCachedOrThrow(t);
            mt.set(t, e = new ViewportAgent(t, n, i));
        }
        return e;
    }
    activateFromViewport(t, i, e) {
        const n = this.currTransition;
        if (null !== n) xt(n);
        this.isActive = true;
        switch (this.nextState) {
          case 64:
            switch (this.currState) {
              case 8192:
                this.logger.trace(`activateFromViewport() - nothing to activate at %s`, this);
                return;

              case 4096:
                this.logger.trace(`activateFromViewport() - activating existing componentAgent at %s`, this);
                return this.curCA.activate(t, i, e);

              default:
                this.unexpectedState("activateFromViewport 1");
            }

          case 2:
            {
                if (null === this.currTransition) throw new Error(`Unexpected viewport activation outside of a transition context at ${this}`);
                if ("static" !== this.$resolution) throw new Error(`Unexpected viewport activation at ${this}`);
                this.logger.trace(`activateFromViewport() - running ordinary activate at %s`, this);
                const i = Batch.start((i => {
                    this.activate(t, this.currTransition, i);
                }));
                const e = new Promise((t => {
                    i.continueWith((() => {
                        t();
                    }));
                }));
                return i.start().done ? void 0 : e;
            }

          default:
            this.unexpectedState("activateFromViewport 2");
        }
    }
    deactivateFromViewport(t, i, e) {
        const n = this.currTransition;
        if (null !== n) xt(n);
        this.isActive = false;
        switch (this.currState) {
          case 8192:
            this.logger.trace(`deactivateFromViewport() - nothing to deactivate at %s`, this);
            return;

          case 4096:
            this.logger.trace(`deactivateFromViewport() - deactivating existing componentAgent at %s`, this);
            return this.curCA.deactivate(t, i, e);

          case 128:
            this.logger.trace(`deactivateFromViewport() - already deactivating at %s`, this);
            return;

          default:
            {
                if (null === this.currTransition) throw new Error(`Unexpected viewport deactivation outside of a transition context at ${this}`);
                this.logger.trace(`deactivateFromViewport() - running ordinary deactivate at %s`, this);
                const i = Batch.start((i => {
                    this.deactivate(t, this.currTransition, i);
                }));
                const e = new Promise((t => {
                    i.continueWith((() => {
                        t();
                    }));
                }));
                return i.start().done ? void 0 : e;
            }
        }
    }
    handles(t) {
        if (!this.isAvailable(t.resolution)) return false;
        const i = this.viewport;
        const e = t.viewportName;
        const n = i.name;
        if (e !== Yt && n !== Yt && n !== e) {
            this.logger.trace(`handles(req:%s) -> false (viewport names don't match '%s')`, t, n);
            return false;
        }
        const s = i.usedBy;
        if (s.length > 0 && !s.split(",").includes(t.componentName)) {
            this.logger.trace(`handles(req:%s) -> false (componentName not included in usedBy)`, t);
            return false;
        }
        this.logger.trace(`viewport '%s' handles(req:%s) -> true`, n, t);
        return true;
    }
    isAvailable(t) {
        if ("dynamic" === t && !this.isActive) {
            this.logger.trace(`isAvailable(resolution:%s) -> false (viewport is not active and we're in dynamic resolution resolution)`, t);
            return false;
        }
        if (64 !== this.nextState) {
            this.logger.trace(`isAvailable(resolution:%s) -> false (update already scheduled for %s)`, t, this.nextNode);
            return false;
        }
        return true;
    }
    canUnload(t, i) {
        if (null === this.currTransition) this.currTransition = t;
        xt(t);
        if (true !== t.guardsResult) return;
        i.push();
        Batch.start((i => {
            this.logger.trace(`canUnload() - invoking on children at %s`, this);
            for (const e of this.currNode.children) e.context.vpa.canUnload(t, i);
        })).continueWith((i => {
            switch (this.currState) {
              case 4096:
                this.logger.trace(`canUnload() - invoking on existing component at %s`, this);
                switch (this.$plan) {
                  case "none":
                    this.currState = 1024;
                    return;

                  case "invoke-lifecycles":
                  case "replace":
                    this.currState = 2048;
                    i.push();
                    Batch.start((i => {
                        this.logger.trace(`canUnload() - finished invoking on children, now invoking on own component at %s`, this);
                        this.curCA.canUnload(t, this.nextNode, i);
                    })).continueWith((() => {
                        this.logger.trace(`canUnload() - finished at %s`, this);
                        this.currState = 1024;
                        i.pop();
                    })).start();
                    return;
                }

              case 8192:
                this.logger.trace(`canUnload() - nothing to unload at %s`, this);
                return;

              default:
                t.handleError(new Error(`Unexpected state at canUnload of ${this}`));
            }
        })).continueWith((() => {
            i.pop();
        })).start();
    }
    canLoad(t, i) {
        if (null === this.currTransition) this.currTransition = t;
        xt(t);
        if (true !== t.guardsResult) return;
        i.push();
        Batch.start((i => {
            switch (this.nextState) {
              case 32:
                this.logger.trace(`canLoad() - invoking on new component at %s`, this);
                this.nextState = 16;
                switch (this.$plan) {
                  case "none":
                    return;

                  case "invoke-lifecycles":
                    return this.curCA.canLoad(t, this.nextNode, i);

                  case "replace":
                    this.nextCA = this.nextNode.context.createComponentAgent(this.hostController, this.nextNode);
                    return this.nextCA.canLoad(t, this.nextNode, i);
                }

              case 64:
                this.logger.trace(`canLoad() - nothing to load at %s`, this);
                return;

              default:
                this.unexpectedState("canLoad");
            }
        })).continueWith((t => {
            const i = this.nextNode;
            switch (this.$plan) {
              case "none":
              case "invoke-lifecycles":
                this.logger.trace(`canLoad(next:%s) - plan set to '%s', compiling residue`, i, this.$plan);
                t.push();
                void r(Ct(i), (() => {
                    t.pop();
                }));
                return;

              case "replace":
                switch (this.$resolution) {
                  case "dynamic":
                    this.logger.trace(`canLoad(next:%s) - (resolution: 'dynamic'), delaying residue compilation until activate`, i, this.$plan);
                    return;

                  case "static":
                    this.logger.trace(`canLoad(next:%s) - (resolution: '${this.$resolution}'), creating nextCA and compiling residue`, i, this.$plan);
                    t.push();
                    void r(Ct(i), (() => {
                        t.pop();
                    }));
                    return;
                }
            }
        })).continueWith((i => {
            switch (this.nextState) {
              case 16:
                this.logger.trace(`canLoad() - finished own component, now invoking on children at %s`, this);
                this.nextState = 8;
                for (const e of this.nextNode.children) e.context.vpa.canLoad(t, i);
                return;

              case 64:
                return;

              default:
                this.unexpectedState("canLoad");
            }
        })).continueWith((() => {
            this.logger.trace(`canLoad() - finished at %s`, this);
            i.pop();
        })).start();
    }
    unload(t, i) {
        xt(t);
        $t(this, t);
        i.push();
        Batch.start((i => {
            this.logger.trace(`unload() - invoking on children at %s`, this);
            for (const e of this.currNode.children) e.context.vpa.unload(t, i);
        })).continueWith((e => {
            switch (this.currState) {
              case 1024:
                this.logger.trace(`unload() - invoking on existing component at %s`, this);
                switch (this.$plan) {
                  case "none":
                    this.currState = 256;
                    return;

                  case "invoke-lifecycles":
                  case "replace":
                    this.currState = 512;
                    e.push();
                    Batch.start((i => {
                        this.logger.trace(`unload() - finished invoking on children, now invoking on own component at %s`, this);
                        this.curCA.unload(t, this.nextNode, i);
                    })).continueWith((() => {
                        this.logger.trace(`unload() - finished at %s`, this);
                        this.currState = 256;
                        e.pop();
                    })).start();
                    return;
                }

              case 8192:
                this.logger.trace(`unload() - nothing to unload at %s`, this);
                for (const e of this.currNode.children) e.context.vpa.unload(t, i);
                return;

              default:
                this.unexpectedState("unload");
            }
        })).continueWith((() => {
            i.pop();
        })).start();
    }
    load(t, i) {
        xt(t);
        $t(this, t);
        i.push();
        Batch.start((i => {
            switch (this.nextState) {
              case 8:
                this.logger.trace(`load() - invoking on new component at %s`, this);
                this.nextState = 4;
                switch (this.$plan) {
                  case "none":
                    return;

                  case "invoke-lifecycles":
                    return this.curCA.load(t, this.nextNode, i);

                  case "replace":
                    return this.nextCA.load(t, this.nextNode, i);
                }

              case 64:
                this.logger.trace(`load() - nothing to load at %s`, this);
                return;

              default:
                this.unexpectedState("load");
            }
        })).continueWith((i => {
            switch (this.nextState) {
              case 4:
                this.logger.trace(`load() - finished own component, now invoking on children at %s`, this);
                this.nextState = 2;
                for (const e of this.nextNode.children) e.context.vpa.load(t, i);
                return;

              case 64:
                return;

              default:
                this.unexpectedState("load");
            }
        })).continueWith((() => {
            this.logger.trace(`load() - finished at %s`, this);
            i.pop();
        })).start();
    }
    deactivate(t, i, e) {
        xt(i);
        $t(this, i);
        e.push();
        switch (this.currState) {
          case 256:
            this.logger.trace(`deactivate() - invoking on existing component at %s`, this);
            this.currState = 128;
            switch (this.$plan) {
              case "none":
              case "invoke-lifecycles":
                e.pop();
                return;

              case "replace":
                {
                    const n = this.hostController;
                    const s = this.viewport.stateful ? 0 : 16;
                    i.run((() => this.curCA.deactivate(t, n, s)), (() => {
                        e.pop();
                    }));
                }
            }
            return;

          case 8192:
            this.logger.trace(`deactivate() - nothing to deactivate at %s`, this);
            e.pop();
            return;

          case 128:
            this.logger.trace(`deactivate() - already deactivating at %s`, this);
            e.pop();
            return;

          default:
            this.unexpectedState("deactivate");
        }
    }
    activate(t, i, e) {
        xt(i);
        $t(this, i);
        e.push();
        if (32 === this.nextState && "dynamic" === this.$resolution) {
            this.logger.trace(`activate() - invoking canLoad(), load() and activate() on new component due to resolution 'dynamic' at %s`, this);
            Batch.start((t => {
                this.canLoad(i, t);
            })).continueWith((t => {
                this.load(i, t);
            })).continueWith((e => {
                this.activate(t, i, e);
            })).continueWith((() => {
                e.pop();
            })).start();
            return;
        }
        switch (this.nextState) {
          case 2:
            this.logger.trace(`activate() - invoking on existing component at %s`, this);
            this.nextState = 1;
            Batch.start((e => {
                switch (this.$plan) {
                  case "none":
                  case "invoke-lifecycles":
                    return;

                  case "replace":
                    {
                        const n = this.hostController;
                        const s = 0;
                        i.run((() => {
                            e.push();
                            return this.nextCA.activate(t, n, s);
                        }), (() => {
                            e.pop();
                        }));
                    }
                }
            })).continueWith((t => {
                this.processDynamicChildren(i, t);
            })).continueWith((() => {
                e.pop();
            })).start();
            return;

          case 64:
            this.logger.trace(`activate() - nothing to activate at %s`, this);
            e.pop();
            return;

          default:
            this.unexpectedState("activate");
        }
    }
    swap(t, i) {
        if (8192 === this.currState) {
            this.logger.trace(`swap() - running activate on next instead, because there is nothing to deactivate at %s`, this);
            this.activate(null, t, i);
            return;
        }
        if (64 === this.nextState) {
            this.logger.trace(`swap() - running deactivate on current instead, because there is nothing to activate at %s`, this);
            this.deactivate(null, t, i);
            return;
        }
        xt(t);
        $t(this, t);
        if (!(256 === this.currState && 2 === this.nextState)) this.unexpectedState("swap");
        this.currState = 128;
        this.nextState = 1;
        switch (this.$plan) {
          case "none":
          case "invoke-lifecycles":
            {
                this.logger.trace(`swap() - skipping this level and swapping children instead at %s`, this);
                const e = q(this.nextNode.children, this.currNode.children);
                for (const n of e) n.context.vpa.swap(t, i);
                return;
            }

          case "replace":
            {
                this.logger.trace(`swap() - running normally at %s`, this);
                const e = this.hostController;
                const n = this.curCA;
                const s = this.nextCA;
                const o = this.viewport.stateful ? 0 : 16;
                const r = 0;
                i.push();
                Batch.start((i => {
                    t.run((() => {
                        i.push();
                        return n.deactivate(null, e, o);
                    }), (() => {
                        i.pop();
                    }));
                })).continueWith((i => {
                    t.run((() => {
                        i.push();
                        return s.activate(null, e, r);
                    }), (() => {
                        i.pop();
                    }));
                })).continueWith((i => {
                    this.processDynamicChildren(t, i);
                })).continueWith((() => {
                    i.pop();
                })).start();
                return;
            }
        }
    }
    processDynamicChildren(t, i) {
        this.logger.trace(`processDynamicChildren() - %s`, this);
        const e = this.nextNode;
        t.run((() => {
            i.push();
            return It(e);
        }), (e => {
            Batch.start((i => {
                for (const n of e) t.run((() => {
                    i.push();
                    return n.context.vpa.canLoad(t, i);
                }), (() => {
                    i.pop();
                }));
            })).continueWith((i => {
                for (const n of e) t.run((() => {
                    i.push();
                    return n.context.vpa.load(t, i);
                }), (() => {
                    i.pop();
                }));
            })).continueWith((i => {
                for (const n of e) t.run((() => {
                    i.push();
                    return n.context.vpa.activate(null, t, i);
                }), (() => {
                    i.pop();
                }));
            })).continueWith((() => {
                i.pop();
            })).start();
        }));
    }
    scheduleUpdate(t, i) {
        var e, n;
        switch (this.nextState) {
          case 64:
            this.nextNode = i;
            this.nextState = 32;
            this.$resolution = t.resolutionMode;
            break;

          default:
            this.unexpectedState("scheduleUpdate 1");
        }
        switch (this.currState) {
          case 8192:
          case 4096:
          case 1024:
            break;

          default:
            this.unexpectedState("scheduleUpdate 2");
        }
        const s = null !== (n = null === (e = this.curCA) || void 0 === e ? void 0 : e.routeNode) && void 0 !== n ? n : null;
        if (null === s || s.component !== i.component) this.$plan = "replace"; else {
            const t = i.context.definition.config.transitionPlan;
            if ("function" === typeof t) this.$plan = t(s, i); else this.$plan = t;
        }
        this.logger.trace(`scheduleUpdate(next:%s) - plan set to '%s'`, i, this.$plan);
    }
    cancelUpdate() {
        if (null !== this.currNode) this.currNode.children.forEach((function(t) {
            t.context.vpa.cancelUpdate();
        }));
        if (null !== this.nextNode) this.nextNode.children.forEach((function(t) {
            t.context.vpa.cancelUpdate();
        }));
        this.logger.trace(`cancelUpdate(nextNode:%s)`, this.nextNode);
        switch (this.currState) {
          case 8192:
          case 4096:
            break;

          case 2048:
          case 1024:
            this.currState = 4096;
            break;
        }
        switch (this.nextState) {
          case 64:
          case 32:
          case 16:
          case 8:
            this.nextNode = null;
            this.nextState = 64;
            break;
        }
    }
    endTransition() {
        if (null !== this.currNode) this.currNode.children.forEach((function(t) {
            t.context.vpa.endTransition();
        }));
        if (null !== this.nextNode) this.nextNode.children.forEach((function(t) {
            t.context.vpa.endTransition();
        }));
        if (null !== this.currTransition) {
            xt(this.currTransition);
            switch (this.nextState) {
              case 64:
                switch (this.currState) {
                  case 128:
                    this.logger.trace(`endTransition() - setting currState to State.nextIsEmpty at %s`, this);
                    this.currState = 8192;
                    this.curCA = null;
                    break;

                  default:
                    this.unexpectedState("endTransition 1");
                }
                break;

              case 1:
                switch (this.currState) {
                  case 8192:
                  case 128:
                    switch (this.$plan) {
                      case "none":
                      case "invoke-lifecycles":
                        this.logger.trace(`endTransition() - setting currState to State.currIsActive at %s`, this);
                        this.currState = 4096;
                        break;

                      case "replace":
                        this.logger.trace(`endTransition() - setting currState to State.currIsActive and reassigning curCA at %s`, this);
                        this.currState = 4096;
                        this.curCA = this.nextCA;
                        break;
                    }
                    this.currNode = this.nextNode;
                    break;

                  default:
                    this.unexpectedState("endTransition 2");
                }
                break;

              default:
                this.unexpectedState("endTransition 3");
            }
            this.$plan = "replace";
            this.nextState = 64;
            this.nextNode = null;
            this.nextCA = null;
            this.prevTransition = this.currTransition;
            this.currTransition = null;
        }
    }
    toString() {
        return `VPA(state:${this.$state},plan:'${this.$plan}',resolution:'${this.$resolution}',n:${this.nextNode},c:${this.currNode},viewport:${this.viewport})`;
    }
    dispose() {
        var t;
        if (this.viewport.stateful) this.logger.trace(`dispose() - not disposing stateful viewport at %s`, this); else {
            this.logger.trace(`dispose() - disposing %s`, this);
            null === (t = this.curCA) || void 0 === t ? void 0 : t.dispose();
        }
    }
    unexpectedState(t) {
        throw new Error(`Unexpected state at ${t} of ${this}`);
    }
}

function $t(t, i) {
    if (true !== i.guardsResult) throw new Error(`Unexpected guardsResult ${i.guardsResult} at ${t}`);
}

function xt(t) {
    if (void 0 !== t.error) throw t.error;
}

var Et;

(function(t) {
    t[t["curr"] = 16256] = "curr";
    t[t["currIsEmpty"] = 8192] = "currIsEmpty";
    t[t["currIsActive"] = 4096] = "currIsActive";
    t[t["currCanUnload"] = 2048] = "currCanUnload";
    t[t["currCanUnloadDone"] = 1024] = "currCanUnloadDone";
    t[t["currUnload"] = 512] = "currUnload";
    t[t["currUnloadDone"] = 256] = "currUnloadDone";
    t[t["currDeactivate"] = 128] = "currDeactivate";
    t[t["next"] = 127] = "next";
    t[t["nextIsEmpty"] = 64] = "nextIsEmpty";
    t[t["nextIsScheduled"] = 32] = "nextIsScheduled";
    t[t["nextCanLoad"] = 16] = "nextCanLoad";
    t[t["nextCanLoadDone"] = 8] = "nextCanLoadDone";
    t[t["nextLoad"] = 4] = "nextLoad";
    t[t["nextLoadDone"] = 2] = "nextLoadDone";
    t[t["nextActivate"] = 1] = "nextActivate";
    t[t["bothAreEmpty"] = 8256] = "bothAreEmpty";
})(Et || (Et = {}));

const yt = new Map;

function Rt(t) {
    let i = yt.get(t);
    if (void 0 === i) yt.set(t, i = bt(t));
    return i;
}

function bt(t) {
    const i = [];
    if (8192 === (8192 & t)) i.push("currIsEmpty");
    if (4096 === (4096 & t)) i.push("currIsActive");
    if (2048 === (2048 & t)) i.push("currCanUnload");
    if (1024 === (1024 & t)) i.push("currCanUnloadDone");
    if (512 === (512 & t)) i.push("currUnload");
    if (256 === (256 & t)) i.push("currUnloadDone");
    if (128 === (128 & t)) i.push("currDeactivate");
    if (64 === (64 & t)) i.push("nextIsEmpty");
    if (32 === (32 & t)) i.push("nextIsScheduled");
    if (16 === (16 & t)) i.push("nextCanLoad");
    if (8 === (8 & t)) i.push("nextCanLoadDone");
    if (4 === (4 & t)) i.push("nextLoad");
    if (2 === (2 & t)) i.push("nextLoadDone");
    if (1 === (1 & t)) i.push("nextActivate");
    return i.join("|");
}

let St = 0;

class RouteNode {
    constructor(t, i, e, n, s, o, r, a, h, c, u, l, f, d, p) {
        var v;
        this.id = t;
        this.path = i;
        this.finalPath = e;
        this.context = n;
        this.originalInstruction = s;
        this.instruction = o;
        this.params = r;
        this.queryParams = a;
        this.fragment = h;
        this.data = c;
        this.viewport = u;
        this.title = l;
        this.component = f;
        this.children = d;
        this.residue = p;
        this.version = 1;
        null !== (v = this.originalInstruction) && void 0 !== v ? v : this.originalInstruction = o;
    }
    get root() {
        return this.tree.root;
    }
    static create(t) {
        var i, e, n, s, o, r, a, h, c;
        const {[Kt]: u, ...l} = null !== (i = t.params) && void 0 !== i ? i : {};
        return new RouteNode(++St, t.path, t.finalPath, t.context, null !== (e = t.originalInstruction) && void 0 !== e ? e : t.instruction, t.instruction, l, null !== (n = t.queryParams) && void 0 !== n ? n : Ut, null !== (s = t.fragment) && void 0 !== s ? s : null, null !== (o = t.data) && void 0 !== o ? o : {}, null !== (r = t.viewport) && void 0 !== r ? r : null, null !== (a = t.title) && void 0 !== a ? a : null, t.component, null !== (h = t.children) && void 0 !== h ? h : [], null !== (c = t.residue) && void 0 !== c ? c : []);
    }
    contains(t) {
        var i, e;
        if (this.context === t.options.context) {
            const n = this.children;
            const s = t.children;
            for (let t = 0, o = n.length; t < o; ++t) for (let r = 0, a = s.length; r < a; ++r) if (t + r < o && (null !== (e = null === (i = n[t + r].originalInstruction) || void 0 === i ? void 0 : i.contains(s[r])) && void 0 !== e ? e : false)) {
                if (r + 1 === a) return true;
            } else break;
        }
        return this.children.some((function(i) {
            return i.contains(t);
        }));
    }
    appendChild(t) {
        this.children.push(t);
        t.setTree(this.tree);
    }
    clearChildren() {
        for (const t of this.children) {
            t.clearChildren();
            t.context.vpa.cancelUpdate();
        }
        this.children.length = 0;
    }
    getTitle(t) {
        const i = [ ...this.children.map((i => i.getTitle(t))), this.getTitlePart() ].filter((t => null !== t));
        if (0 === i.length) return null;
        return i.join(t);
    }
    getTitlePart() {
        if ("function" === typeof this.title) return this.title.call(void 0, this);
        return this.title;
    }
    computeAbsolutePath() {
        if (this.context.isRoot) return "";
        const t = this.context.parent.node.computeAbsolutePath();
        const i = this.instruction.toUrlComponent(false);
        if (t.length > 0) {
            if (i.length > 0) return [ t, i ].join("/");
            return t;
        }
        return i;
    }
    setTree(t) {
        this.tree = t;
        for (const i of this.children) i.setTree(t);
    }
    finalizeInstruction() {
        const t = this.children.map((t => t.finalizeInstruction()));
        const i = this.instruction.clone();
        i.children.splice(0, i.children.length, ...t);
        return this.instruction = i;
    }
    clone() {
        const t = new RouteNode(this.id, this.path, this.finalPath, this.context, this.originalInstruction, this.instruction, {
            ...this.params
        }, new URLSearchParams(this.queryParams), this.fragment, {
            ...this.data
        }, this.viewport, this.title, this.component, this.children.map((t => t.clone())), [ ...this.residue ]);
        t.version = this.version + 1;
        if (t.context.node === this) t.context.node = t;
        return t;
    }
    toString() {
        var t, i, e, n, s, o;
        const r = [];
        const a = null !== (e = null === (i = null === (t = this.context) || void 0 === t ? void 0 : t.definition.component) || void 0 === i ? void 0 : i.name) && void 0 !== e ? e : "";
        if (a.length > 0) r.push(`c:'${a}'`);
        const h = null !== (s = null === (n = this.context) || void 0 === n ? void 0 : n.definition.config.path) && void 0 !== s ? s : "";
        if (h.length > 0) r.push(`path:'${h}'`);
        if (this.children.length > 0) r.push(`children:[${this.children.map(String).join(",")}]`);
        if (this.residue.length > 0) r.push(`residue:${this.residue.map((function(t) {
            if ("string" === typeof t) return `'${t}'`;
            return String(t);
        })).join(",")}`);
        return `RN(ctx:'${null === (o = this.context) || void 0 === o ? void 0 : o.friendlyPath}',${r.join(",")})`;
    }
}

class RouteTree {
    constructor(t, i, e, n) {
        this.options = t;
        this.queryParams = i;
        this.fragment = e;
        this.root = n;
    }
    contains(t) {
        return this.root.contains(t);
    }
    clone() {
        const t = new RouteTree(this.options.clone(), new URLSearchParams(this.queryParams), this.fragment, this.root.clone());
        t.root.setTree(this);
        return t;
    }
    finalizeInstructions() {
        return new ViewportInstructionTree(this.options, true, this.root.children.map((t => t.finalizeInstruction())), this.queryParams, this.fragment);
    }
    toString() {
        return this.root.toString();
    }
}

function kt(t, i, e, n) {
    t.trace(`updateNode(ctx:%s,node:%s)`, e, n);
    n.queryParams = i.queryParams;
    n.fragment = i.fragment;
    if (!n.context.isRoot) n.context.vpa.scheduleUpdate(n.tree.options, n);
    if (n.context === e) {
        n.clearChildren();
        return r(a(...i.children.map((i => Nt(t, n, i)))), (() => a(...e.getAvailableViewportAgents("dynamic").map((i => {
            const e = ViewportInstruction.create({
                component: i.viewport.default,
                viewport: i.viewport.name
            });
            return Nt(t, n, e);
        })))));
    }
    return a(...n.children.map((n => kt(t, i, e, n))));
}

function Ct(t) {
    const i = t.context;
    const e = i.container.get(s).scopeTo("RouteTree");
    const n = i.resolved instanceof Promise ? " - awaiting promise" : "";
    e.trace(`processResidue(node:%s)${n}`, t);
    return r(i.resolved, (() => a(...t.residue.splice(0).map((i => Nt(e, t, i))), ...i.getAvailableViewportAgents("static").map((i => {
        const n = ViewportInstruction.create({
            component: i.viewport.default,
            viewport: i.viewport.name
        });
        return Nt(e, t, n);
    })))));
}

function It(t) {
    const i = t.context;
    const e = i.container.get(s).scopeTo("RouteTree");
    const n = i.resolved instanceof Promise ? " - awaiting promise" : "";
    e.trace(`getDynamicChildren(node:%s)${n}`, t);
    return r(i.resolved, (() => {
        const n = t.children.slice();
        return r(a(...t.residue.splice(0).map((i => Nt(e, t, i)))), (() => r(a(...i.getAvailableViewportAgents("dynamic").map((i => {
            const n = ViewportInstruction.create({
                component: i.viewport.default,
                viewport: i.viewport.name
            });
            return Nt(e, t, n);
        }))), (() => t.children.filter((t => !n.includes(t)))))));
    }));
}

function Nt(t, i, e) {
    var n, s, o;
    t.trace(`createAndAppendNodes(node:%s,vi:%s`, i, e);
    switch (e.component.type) {
      case 0:
        switch (e.component.value) {
          case "..":
            i = null !== (s = null === (n = i.context.parent) || void 0 === n ? void 0 : n.node) && void 0 !== s ? s : i;
            i.clearChildren();

          case ".":
            return a(...e.children.map((e => Nt(t, i, e))));

          default:
            {
                t.trace(`createAndAppendNodes invoking createNode`);
                const n = At(t, i, e);
                if (null === n) return;
                return Vt(t, i, n);
            }
        }

      case 4:
      case 2:
        {
            const n = i.context;
            const s = RouteDefinition.resolve(e.component.value, n.definition, null);
            const {vi: r, query: a} = n.generateViewportInstruction({
                component: s,
                params: null !== (o = e.params) && void 0 !== o ? o : h
            });
            i.tree.queryParams = G(i.tree.queryParams, a, true);
            r.children.push(...e.children);
            const c = Tt(t, i, r, r.recognizedRoute, e);
            return Vt(t, i, c);
        }
    }
}

function At(t, i, e) {
    var n, s;
    const o = i.context;
    const r = e.clone();
    let a = e.recognizedRoute;
    if (null !== a) return Tt(t, i, e, a, r);
    if (0 === e.children.length) {
        const n = o.generateViewportInstruction(e);
        if (null !== n) {
            i.tree.queryParams = G(i.tree.queryParams, n.query, true);
            const s = n.vi;
            s.children.push(...e.children);
            return Tt(t, i, s, s.recognizedRoute, e);
        }
    }
    let h = 0;
    let c = e.component.value;
    let u = e;
    while (1 === u.children.length) {
        u = u.children[0];
        if (0 === u.component.type) {
            ++h;
            c = `${c}/${u.component.value}`;
        } else break;
    }
    a = o.recognize(c);
    t.trace("createNode recognized route: %s", a);
    const l = null !== (n = null === a || void 0 === a ? void 0 : a.residue) && void 0 !== n ? n : null;
    t.trace("createNode residue:", l);
    const f = null === l;
    if (null === a || l === c) {
        const n = e.component.value;
        if ("" === n) return null;
        let s = e.viewport;
        if (null === s || 0 === s.length) s = Yt;
        const r = o.getFallbackViewportAgent("dynamic", s);
        const a = null !== r ? r.viewport.fallback : o.definition.fallback;
        if (null === a) throw new Error(`Neither the route '${n}' matched any configured route at '${o.friendlyPath}' nor a fallback is configured for the viewport '${s}' - did you forget to add '${n}' to the routes list of the route decorator of '${o.component.name}'?`);
        t.trace(`Fallback is set to '${a}'. Looking for a recognized route.`);
        const h = o.childRoutes.find((t => t.id === a));
        if (void 0 !== h) return Pt(t, h, i, e);
        t.trace(`No route definition for the fallback '${a}' is found; trying to recognize the route.`);
        const c = o.recognize(a, true);
        if (null !== c) return Tt(t, i, e, c, null);
        t.trace(`The fallback '${a}' is not recognized as a route; treating as custom element name.`);
        return Pt(t, RouteDefinition.resolve(a, o.definition, null, o), i, e);
    }
    a.residue = null;
    e.component.value = f ? c : c.slice(0, -(l.length + 1));
    for (let t = 0; t < h; ++t) {
        const t = e.children[0];
        if (null !== (s = null === l || void 0 === l ? void 0 : l.startsWith(t.component.value)) && void 0 !== s ? s : false) break;
        e.children = t.children;
    }
    t.trace("createNode after adjustment vi:%s", e);
    return Tt(t, i, e, a, r);
}

function Tt(t, i, e, n, s, o = n.route.endpoint.route) {
    const a = i.context;
    const h = i.tree;
    return r(o.handler, (r => {
        var c, u, l;
        o.handler = r;
        t.trace(`creatingConfiguredNode(rd:%s, vi:%s)`, r, e);
        if (null === r.redirectTo) {
            const l = (null !== (u = null === (c = e.viewport) || void 0 === c ? void 0 : c.length) && void 0 !== u ? u : 0) > 0 ? e.viewport : r.viewport;
            const f = r.component;
            const d = a.resolveViewportAgent(new ViewportRequest(l, f.name, h.options.resolutionMode));
            const p = a.container.get(Dt);
            const v = p.getRouteContext(d, f, null, d.hostController.container, a.definition);
            t.trace("createConfiguredNode setting the context node");
            const g = v.node = RouteNode.create({
                path: n.route.endpoint.route.path,
                finalPath: o.path,
                context: v,
                instruction: e,
                originalInstruction: s,
                params: {
                    ...n.route.params
                },
                queryParams: h.queryParams,
                fragment: h.fragment,
                data: r.data,
                viewport: l,
                component: f,
                title: r.config.title,
                residue: [ ...null === n.residue ? [] : [ ViewportInstruction.create(n.residue) ], ...e.children ]
            });
            g.setTree(i.tree);
            t.trace(`createConfiguredNode(vi:%s) -> %s`, e, g);
            return g;
        }
        const f = RouteExpression.parse(o.path, false);
        const d = RouteExpression.parse(r.redirectTo, false);
        let p;
        let v;
        const g = [];
        switch (f.root.kind) {
          case 2:
          case 4:
            p = f.root;
            break;

          default:
            throw new Error(`Unexpected expression kind ${f.root.kind}`);
        }
        switch (d.root.kind) {
          case 2:
          case 4:
            v = d.root;
            break;

          default:
            throw new Error(`Unexpected expression kind ${d.root.kind}`);
        }
        let w;
        let m;
        let $ = false;
        let x = false;
        while (!($ && x)) {
            if ($) w = null; else if (4 === p.kind) {
                w = p;
                $ = true;
            } else if (4 === p.left.kind) {
                w = p.left;
                switch (p.right.kind) {
                  case 2:
                  case 4:
                    p = p.right;
                    break;

                  default:
                    throw new Error(`Unexpected expression kind ${p.right.kind}`);
                }
            } else throw new Error(`Unexpected expression kind ${p.left.kind}`);
            if (x) m = null; else if (4 === v.kind) {
                m = v;
                x = true;
            } else if (4 === v.left.kind) {
                m = v.left;
                switch (v.right.kind) {
                  case 2:
                  case 4:
                    v = v.right;
                    break;

                  default:
                    throw new Error(`Unexpected expression kind ${v.right.kind}`);
                }
            } else throw new Error(`Unexpected expression kind ${v.left.kind}`);
            if (null !== m) if (m.component.isDynamic && (null !== (l = null === w || void 0 === w ? void 0 : w.component.isDynamic) && void 0 !== l ? l : false)) g.push(n.route.params[w.component.name]); else g.push(m.raw);
        }
        const E = g.filter(Boolean).join("/");
        const y = a.recognize(E);
        if (null === y) throw new Error(`'${E}' did not match any configured route or registered component name at '${a.friendlyPath}' - did you forget to add '${E}' to the routes list of the route decorator of '${a.component.name}'?`);
        return Tt(t, i, e, n, s, y.route.endpoint.route);
    }));
}

function Vt(t, i, e) {
    return r(e, (e => {
        t.trace(`appendNode($childNode:%s)`, e);
        i.appendChild(e);
        return e.context.vpa.scheduleUpdate(i.tree.options, e);
    }));
}

function Pt(t, i, e, n) {
    const s = new $RecognizedRoute(new j(new D(new M(i.path[0], i.caseSensitive, i), []), h), null);
    n.children.length = 0;
    return Tt(t, e, n, s, null);
}

const Ut = Object.freeze(new URLSearchParams);

function Lt(i) {
    return t(i) && true === Object.prototype.hasOwnProperty.call(i, ot);
}

function Ot(t, i) {
    return {
        ...t,
        [ot]: i
    };
}

function jt(t, i) {
    if ("function" === typeof i) return i(t);
    return i;
}

class RouterOptions {
    constructor(t, i, e, n, s, o) {
        this.useUrlFragmentHash = t;
        this.useHref = i;
        this.resolutionMode = e;
        this.historyStrategy = n;
        this.sameUrlStrategy = s;
        this.buildTitle = o;
    }
    static get DEFAULT() {
        return RouterOptions.create({});
    }
    static create(t) {
        var i, e, n, s, o, r;
        return new RouterOptions(null !== (i = t.useUrlFragmentHash) && void 0 !== i ? i : false, null !== (e = t.useHref) && void 0 !== e ? e : true, null !== (n = t.resolutionMode) && void 0 !== n ? n : "dynamic", null !== (s = t.historyStrategy) && void 0 !== s ? s : "push", null !== (o = t.sameUrlStrategy) && void 0 !== o ? o : "ignore", null !== (r = t.buildTitle) && void 0 !== r ? r : null);
    }
    getHistoryStrategy(t) {
        return jt(t, this.historyStrategy);
    }
    getSameUrlStrategy(t) {
        return jt(t, this.sameUrlStrategy);
    }
    stringifyProperties() {
        return [ [ "resolutionMode", "resolution" ], [ "historyStrategy", "history" ], [ "sameUrlStrategy", "sameUrl" ] ].map((([t, i]) => {
            const e = this[t];
            return `${i}:${"function" === typeof e ? e : `'${e}'`}`;
        })).join(",");
    }
    clone() {
        return new RouterOptions(this.useUrlFragmentHash, this.useHref, this.resolutionMode, this.historyStrategy, this.sameUrlStrategy, this.buildTitle);
    }
    toString() {
        return `RO(${this.stringifyProperties()})`;
    }
}

class NavigationOptions extends RouterOptions {
    constructor(t, i, e, n, s, o, r) {
        super(t.useUrlFragmentHash, t.useHref, t.resolutionMode, t.historyStrategy, t.sameUrlStrategy, t.buildTitle);
        this.title = i;
        this.titleSeparator = e;
        this.context = n;
        this.queryParams = s;
        this.fragment = o;
        this.state = r;
    }
    static get DEFAULT() {
        return NavigationOptions.create({});
    }
    static create(t) {
        var i, e, n, s, o, r;
        return new NavigationOptions(RouterOptions.create(t), null !== (i = t.title) && void 0 !== i ? i : null, null !== (e = t.titleSeparator) && void 0 !== e ? e : " | ", null !== (n = t.context) && void 0 !== n ? n : null, null !== (s = t.queryParams) && void 0 !== s ? s : null, null !== (o = t.fragment) && void 0 !== o ? o : "", null !== (r = t.state) && void 0 !== r ? r : null);
    }
    clone() {
        return new NavigationOptions(super.clone(), this.title, this.titleSeparator, this.context, {
            ...this.queryParams
        }, this.fragment, null === this.state ? null : {
            ...this.state
        });
    }
    toString() {
        return `NO(${super.stringifyProperties()})`;
    }
}

class Transition {
    constructor(t, i, e, n, s, o, r, a, h, c, u, l, f, d, p) {
        this.id = t;
        this.prevInstructions = i;
        this.instructions = e;
        this.finalInstructions = n;
        this.instructionsChanged = s;
        this.trigger = o;
        this.options = r;
        this.managedState = a;
        this.previousRouteTree = h;
        this.routeTree = c;
        this.promise = u;
        this.resolve = l;
        this.reject = f;
        this.guardsResult = d;
        this.error = p;
    }
    static create(t) {
        return new Transition(t.id, t.prevInstructions, t.instructions, t.finalInstructions, t.instructionsChanged, t.trigger, t.options, t.managedState, t.previousRouteTree, t.routeTree, t.promise, t.resolve, t.reject, t.guardsResult, void 0);
    }
    run(t, i) {
        if (true !== this.guardsResult) return;
        try {
            const e = t();
            if (e instanceof Promise) e.then(i).catch((t => {
                this.handleError(t);
            })); else i(e);
        } catch (t) {
            this.handleError(t);
        }
    }
    handleError(t) {
        this.reject(this.error = t);
    }
    toString() {
        return `T(id:${this.id},trigger:'${this.trigger}',instructions:${this.instructions},options:${this.options})`;
    }
}

const Dt = e.createInterface("IRouter", (t => t.singleton(Mt)));

let Mt = class Router {
    constructor(t, i, e, n, s) {
        this.container = t;
        this.p = i;
        this.logger = e;
        this.events = n;
        this.locationMgr = s;
        this.t = null;
        this.i = null;
        this.h = null;
        this.options = RouterOptions.DEFAULT;
        this.navigated = false;
        this.navigationId = 0;
        this.instructions = ViewportInstructionTree.create("");
        this.nextTr = null;
        this.locationChangeSubscription = null;
        this.u = false;
        this.$ = false;
        this.vpaLookup = new Map;
        this.logger = e.root.scopeTo("Router");
    }
    get ctx() {
        let t = this.t;
        if (null === t) {
            if (!this.container.has(Zt, true)) throw new Error(`Root RouteContext is not set. Did you forget to register RouteConfiguration, or try to navigate before calling Aurelia.start()?`);
            t = this.t = this.container.get(Zt);
        }
        return t;
    }
    get routeTree() {
        let t = this.i;
        if (null === t) {
            const i = this.ctx;
            t = this.i = new RouteTree(NavigationOptions.create({
                ...this.options
            }), Ut, null, RouteNode.create({
                path: "",
                finalPath: "",
                context: i,
                instruction: null,
                component: i.definition.component,
                title: i.definition.config.title
            }));
        }
        return t;
    }
    get currentTr() {
        let t = this.h;
        if (null === t) t = this.h = Transition.create({
            id: 0,
            prevInstructions: this.instructions,
            instructions: this.instructions,
            finalInstructions: this.instructions,
            instructionsChanged: true,
            trigger: "api",
            options: NavigationOptions.DEFAULT,
            managedState: null,
            previousRouteTree: this.routeTree.clone(),
            routeTree: this.routeTree,
            resolve: null,
            reject: null,
            promise: null,
            guardsResult: true,
            error: void 0
        });
        return t;
    }
    set currentTr(t) {
        this.h = t;
    }
    get isNavigating() {
        return this.$;
    }
    resolveContext(t) {
        return RouteContext.resolve(this.ctx, t);
    }
    start(t, i) {
        this.options = RouterOptions.create(t);
        this.u = "function" === typeof this.options.buildTitle;
        this.locationMgr.startListening();
        this.locationChangeSubscription = this.events.subscribe("au:router:location-change", (t => {
            this.p.taskQueue.queueTask((() => {
                const i = Lt(t.state) ? t.state : null;
                const e = NavigationOptions.create({
                    ...this.options,
                    historyStrategy: "replace"
                });
                const n = ViewportInstructionTree.create(t.url, e, this.ctx);
                this.enqueue(n, t.trigger, i, null);
            }));
        }));
        if (!this.navigated && i) return this.load(this.locationMgr.getPath(), {
            historyStrategy: "replace"
        });
    }
    stop() {
        var t;
        this.locationMgr.stopListening();
        null === (t = this.locationChangeSubscription) || void 0 === t ? void 0 : t.dispose();
    }
    load(t, i) {
        const e = this.createViewportInstructions(t, i);
        this.logger.trace("load(instructions:%s)", e);
        return this.enqueue(e, "api", null, null);
    }
    isActive(t, i) {
        const e = this.resolveContext(i);
        const n = t instanceof ViewportInstructionTree ? t : this.createViewportInstructions(t, {
            context: e
        });
        this.logger.trace("isActive(instructions:%s,ctx:%s)", n, e);
        return this.routeTree.contains(n);
    }
    getRouteContext(t, i, e, n, o) {
        const r = n.get(s).scopeTo("RouteContext");
        const a = RouteDefinition.resolve("function" === typeof (null === e || void 0 === e ? void 0 : e.getRouteConfig) ? e : i.Type, o, null);
        let h = this.vpaLookup.get(t);
        if (void 0 === h) this.vpaLookup.set(t, h = new WeakMap);
        let c = h.get(a);
        if (void 0 !== c) {
            r.trace(`returning existing RouteContext for %s`, a);
            return c;
        }
        r.trace(`creating new RouteContext for %s`, a);
        const u = n.has(Zt, true) ? n.get(Zt) : null;
        h.set(a, c = new RouteContext(t, u, i, a, n, this));
        return c;
    }
    createViewportInstructions(t, i) {
        if (t instanceof ViewportInstructionTree) return t;
        if ("string" === typeof t) t = this.locationMgr.removeBaseHref(t);
        return ViewportInstructionTree.create(t, this.getNavigationOptions(i), this.ctx);
    }
    enqueue(t, i, e, n) {
        const s = this.currentTr;
        const o = this.logger;
        if ("api" !== i && "api" === s.trigger && s.instructions.equals(t)) {
            o.debug(`Ignoring navigation triggered by '%s' because it is the same URL as the previous navigation which was triggered by 'api'.`, i);
            return true;
        }
        let r;
        let a;
        let h;
        if (null === n) h = new Promise((function(t, i) {
            r = t;
            a = i;
        })); else {
            o.debug(`Reusing promise/resolve/reject from the previously failed transition %s`, n);
            h = n.promise;
            r = n.resolve;
            a = n.reject;
        }
        const c = this.nextTr = Transition.create({
            id: ++this.navigationId,
            trigger: i,
            managedState: e,
            prevInstructions: s.finalInstructions,
            finalInstructions: t,
            instructionsChanged: !s.finalInstructions.equals(t),
            instructions: t,
            options: t.options,
            promise: h,
            resolve: r,
            reject: a,
            previousRouteTree: this.routeTree,
            routeTree: this.i = this.routeTree.clone(),
            guardsResult: true,
            error: void 0
        });
        o.debug(`Scheduling transition: %s`, c);
        if (!this.$) try {
            this.run(c);
        } catch (t) {
            c.handleError(t);
        }
        return c.promise.then((t => {
            o.debug(`Transition succeeded: %s`, c);
            return t;
        })).catch((t => {
            o.error(`Navigation failed: %s`, c, t);
            this.$ = false;
            const i = this.nextTr;
            if (null !== i) i.previousRouteTree = c.previousRouteTree; else this.i = c.previousRouteTree;
            throw t;
        }));
    }
    run(t) {
        this.currentTr = t;
        this.nextTr = null;
        this.$ = true;
        let i = this.resolveContext(t.options.context);
        const e = t.instructions.children;
        const n = i.node.children;
        const o = !this.navigated || e.length !== n.length || e.some(((t, i) => {
            var e, s;
            return !(null !== (s = null === (e = n[i]) || void 0 === e ? void 0 : e.originalInstruction.equals(t)) && void 0 !== s ? s : false);
        }));
        const a = o || "reload" === t.options.getSameUrlStrategy(this.instructions);
        if (!a) {
            this.logger.trace(`run(tr:%s) - NOT processing route`, t);
            this.navigated = true;
            this.$ = false;
            t.resolve(false);
            this.runNextTransition();
            return;
        }
        this.logger.trace(`run(tr:%s) - processing route`, t);
        this.events.publish(new NavigationStartEvent(t.id, t.instructions, t.trigger, t.managedState));
        if (null !== this.nextTr) {
            this.logger.debug(`run(tr:%s) - aborting because a new transition was queued in response to the NavigationStartEvent`, t);
            return this.run(this.nextTr);
        }
        t.run((() => {
            const e = t.finalInstructions;
            this.logger.trace(`run() - compiling route tree: %s`, e);
            const n = this.ctx;
            const o = t.routeTree;
            o.options = e.options;
            o.queryParams = n.node.tree.queryParams = e.queryParams;
            o.fragment = n.node.tree.fragment = e.fragment;
            const a = i.container.get(s).scopeTo("RouteTree");
            if (e.isAbsolute) i = n;
            if (i === n) {
                o.root.setTree(o);
                n.node = o.root;
            }
            const h = i.resolved instanceof Promise ? " - awaiting promise" : "";
            a.trace(`updateRouteTree(rootCtx:%s,rt:%s,vit:%s)${h}`, n, o, e);
            return r(i.resolved, (() => kt(a, e, i, n.node)));
        }), (() => {
            const i = t.previousRouteTree.root.children;
            const e = t.routeTree.root.children;
            const n = q(i, e);
            Batch.start((e => {
                this.logger.trace(`run() - invoking canUnload on ${i.length} nodes`);
                for (const n of i) n.context.vpa.canUnload(t, e);
            })).continueWith((i => {
                if (true !== t.guardsResult) {
                    i.push();
                    this.cancelNavigation(t);
                }
            })).continueWith((i => {
                this.logger.trace(`run() - invoking canLoad on ${e.length} nodes`);
                for (const n of e) n.context.vpa.canLoad(t, i);
            })).continueWith((i => {
                if (true !== t.guardsResult) {
                    i.push();
                    this.cancelNavigation(t);
                }
            })).continueWith((e => {
                this.logger.trace(`run() - invoking unload on ${i.length} nodes`);
                for (const n of i) n.context.vpa.unload(t, e);
            })).continueWith((i => {
                this.logger.trace(`run() - invoking load on ${e.length} nodes`);
                for (const n of e) n.context.vpa.load(t, i);
            })).continueWith((i => {
                this.logger.trace(`run() - invoking swap on ${n.length} nodes`);
                for (const e of n) e.context.vpa.swap(t, i);
            })).continueWith((() => {
                this.logger.trace(`run() - finalizing transition`);
                n.forEach((function(t) {
                    t.context.vpa.endTransition();
                }));
                this.navigated = true;
                this.instructions = t.finalInstructions = t.routeTree.finalizeInstructions();
                this.$ = false;
                this.events.publish(new NavigationEndEvent(t.id, t.instructions, this.instructions));
                this.applyHistoryState(t);
                t.resolve(true);
                this.runNextTransition();
            })).start();
        }));
    }
    applyHistoryState(t) {
        const i = t.finalInstructions.toUrl(this.options.useUrlFragmentHash);
        switch (t.options.getHistoryStrategy(this.instructions)) {
          case "none":
            break;

          case "push":
            this.locationMgr.pushState(Ot(t.options.state, t.id), this.updateTitle(t), i);
            break;

          case "replace":
            this.locationMgr.replaceState(Ot(t.options.state, t.id), this.updateTitle(t), i);
            break;
        }
    }
    getTitle(t) {
        var i, e;
        switch (typeof t.options.title) {
          case "function":
            return null !== (i = t.options.title.call(void 0, t.routeTree.root)) && void 0 !== i ? i : "";

          case "string":
            return t.options.title;

          default:
            return null !== (e = t.routeTree.root.getTitle(t.options.titleSeparator)) && void 0 !== e ? e : "";
        }
    }
    updateTitle(t = this.currentTr) {
        var i;
        const e = this.u ? null !== (i = this.options.buildTitle(t)) && void 0 !== i ? i : "" : this.getTitle(t);
        if (e.length > 0) this.p.document.title = e;
        return this.p.document.title;
    }
    cancelNavigation(t) {
        this.logger.trace(`cancelNavigation(tr:%s)`, t);
        const i = t.previousRouteTree.root.children;
        const e = t.routeTree.root.children;
        const n = q(i, e);
        n.forEach((function(t) {
            t.context.vpa.cancelUpdate();
        }));
        this.instructions = t.prevInstructions;
        this.i = t.previousRouteTree;
        this.$ = false;
        this.events.publish(new NavigationCancelEvent(t.id, t.instructions, `guardsResult is ${t.guardsResult}`));
        if (false === t.guardsResult) {
            t.resolve(false);
            this.runNextTransition();
        } else void r(this.enqueue(t.guardsResult, "api", t.managedState, t), (() => {
            this.logger.trace(`cancelNavigation(tr:%s) - finished redirect`, t);
        }));
    }
    runNextTransition() {
        if (null === this.nextTr) return;
        this.logger.trace(`scheduling nextTransition: %s`, this.nextTr);
        this.p.taskQueue.queueTask((() => {
            const t = this.nextTr;
            if (null === t) return;
            try {
                this.run(t);
            } catch (i) {
                t.handleError(i);
            }
        }));
    }
    getNavigationOptions(t) {
        return NavigationOptions.create({
            ...this.options,
            ...t
        });
    }
};

Mt = nt([ st(0, c), st(1, y), st(2, s), st(3, rt), st(4, ct) ], Mt);

class ViewportInstruction {
    constructor(t, i, e, n, s, o, r) {
        this.open = t;
        this.close = i;
        this.recognizedRoute = e;
        this.component = n;
        this.viewport = s;
        this.params = o;
        this.children = r;
    }
    static create(t) {
        var i, e, n, s, o, r, a;
        if (t instanceof ViewportInstruction) return t;
        if (K(t)) {
            const h = TypedNavigationInstruction.create(t.component);
            const c = null !== (e = null === (i = t.children) || void 0 === i ? void 0 : i.map(ViewportInstruction.create)) && void 0 !== e ? e : [];
            return new ViewportInstruction(null !== (n = t.open) && void 0 !== n ? n : 0, null !== (s = t.close) && void 0 !== s ? s : 0, null !== (o = t.recognizedRoute) && void 0 !== o ? o : null, h, null !== (r = t.viewport) && void 0 !== r ? r : null, null !== (a = t.params) && void 0 !== a ? a : null, c);
        }
        const h = TypedNavigationInstruction.create(t);
        return new ViewportInstruction(0, 0, null, h, null, null, []);
    }
    contains(t) {
        const i = this.children;
        const e = t.children;
        if (i.length < e.length) return false;
        if (!this.component.equals(t.component)) return false;
        for (let t = 0, n = e.length; t < n; ++t) if (!i[t].contains(e[t])) return false;
        return true;
    }
    equals(t) {
        const i = this.children;
        const e = t.children;
        if (i.length !== e.length) return false;
        if (!this.component.equals(t.component) || this.viewport !== t.viewport || !et(this.params, t.params)) return false;
        for (let t = 0, n = i.length; t < n; ++t) if (!i[t].equals(e[t])) return false;
        return true;
    }
    clone() {
        return new ViewportInstruction(this.open, this.close, this.recognizedRoute, this.component.clone(), this.viewport, null === this.params ? null : {
            ...this.params
        }, [ ...this.children ]);
    }
    toUrlComponent(t = true) {
        const i = this.component.toUrlComponent();
        const e = null === this.params || 0 === Object.keys(this.params).length ? "" : `(${Bt(this.params)})`;
        const n = 0 === i.length || null === this.viewport || 0 === this.viewport.length ? "" : `@${this.viewport}`;
        const s = `${"(".repeat(this.open)}${i}${e}${n}${")".repeat(this.close)}`;
        const o = t ? this.children.map((t => t.toUrlComponent())).join("+") : "";
        if (s.length > 0) {
            if (o.length > 0) return [ s, o ].join("/");
            return s;
        }
        return o;
    }
    toString() {
        const t = `c:${this.component}`;
        const i = null === this.viewport || 0 === this.viewport.length ? "" : `viewport:${this.viewport}`;
        const e = 0 === this.children.length ? "" : `children:[${this.children.map(String).join(",")}]`;
        const n = [ t, i, e ].filter(Boolean).join(",");
        return `VPI(${n})`;
    }
}

function Bt(t) {
    const i = Object.keys(t);
    const e = Array(i.length);
    const n = [];
    const s = [];
    for (const t of i) if (u(t)) n.push(Number(t)); else s.push(t);
    for (let o = 0; o < i.length; ++o) {
        const i = n.indexOf(o);
        if (i > -1) {
            e[o] = t[o];
            n.splice(i, 1);
        } else {
            const i = s.shift();
            e[o] = `${i}=${t[i]}`;
        }
    }
    return e.join(",");
}

const zt = function() {
    let t = 0;
    const i = new Map;
    return function(e) {
        let n = i.get(e);
        if (void 0 === n) i.set(e, n = ++t);
        return n;
    };
}();

class ViewportInstructionTree {
    constructor(t, i, e, n, s) {
        this.options = t;
        this.isAbsolute = i;
        this.children = e;
        this.queryParams = n;
        this.fragment = s;
    }
    static create(t, i, e) {
        var n, s;
        const o = NavigationOptions.create({
            ...i
        });
        let r = o.context;
        if (!(r instanceof RouteContext) && null != e) r = RouteContext.resolve(e, r);
        const a = null != r;
        if (t instanceof Array) {
            const i = t.length;
            const e = new Array(i);
            const s = new URLSearchParams(null !== (n = o.queryParams) && void 0 !== n ? n : h);
            for (let n = 0; n < i; n++) {
                const i = t[n];
                const o = a ? r.generateViewportInstruction(i) : null;
                if (null !== o) {
                    e[n] = o.vi;
                    G(s, o.query, false);
                } else e[n] = ViewportInstruction.create(i);
            }
            return new ViewportInstructionTree(o, false, e, s, null);
        }
        if ("string" === typeof t) {
            const i = RouteExpression.parse(t, o.useUrlFragmentHash);
            return i.toInstructionTree(o);
        }
        const c = a ? r.generateViewportInstruction(t) : null;
        return null !== c ? new ViewportInstructionTree(o, false, [ c.vi ], new URLSearchParams(null !== (s = c.query) && void 0 !== s ? s : h), null) : new ViewportInstructionTree(o, false, [ ViewportInstruction.create(t) ], Ut, null);
    }
    equals(t) {
        const i = this.children;
        const e = t.children;
        if (i.length !== e.length) return false;
        for (let t = 0, n = i.length; t < n; ++t) if (!i[t].equals(e[t])) return false;
        return true;
    }
    toUrl(t = false) {
        var i;
        let e;
        let n;
        if (t) {
            e = "";
            n = `#${this.toPath()}`;
        } else {
            e = this.toPath();
            n = null !== (i = this.fragment) && void 0 !== i ? i : "";
        }
        let s = this.queryParams.toString();
        s = "" === s ? "" : `?${s}`;
        const o = `${e}${n}${s}`;
        return o;
    }
    toPath() {
        const t = this.children.map((t => t.toUrlComponent())).join("+");
        return t;
    }
    toString() {
        return `[${this.children.map(String).join(",")}]`;
    }
}

var qt;

(function(t) {
    t[t["string"] = 0] = "string";
    t[t["ViewportInstruction"] = 1] = "ViewportInstruction";
    t[t["CustomElementDefinition"] = 2] = "CustomElementDefinition";
    t[t["Promise"] = 3] = "Promise";
    t[t["IRouteViewModel"] = 4] = "IRouteViewModel";
})(qt || (qt = {}));

class TypedNavigationInstruction {
    constructor(t, i) {
        this.type = t;
        this.value = i;
    }
    static create(i) {
        if (i instanceof TypedNavigationInstruction) return i;
        if ("string" === typeof i) return new TypedNavigationInstruction(0, i);
        if (!t(i)) Q("function/class or object", "", i);
        if ("function" === typeof i) if (R.isType(i)) {
            const t = R.getDefinition(i);
            return new TypedNavigationInstruction(2, t);
        } else return TypedNavigationInstruction.create(i());
        if (i instanceof Promise) return new TypedNavigationInstruction(3, i);
        if (K(i)) {
            const t = ViewportInstruction.create(i);
            return new TypedNavigationInstruction(1, t);
        }
        if (w(i)) return new TypedNavigationInstruction(4, i);
        if (i instanceof b) return new TypedNavigationInstruction(2, i);
        if (J(i)) {
            const t = R.define(i);
            const e = R.getDefinition(t);
            return new TypedNavigationInstruction(2, e);
        }
        throw new Error(`Invalid component ${F(i)}: must be either a class, a custom element ViewModel, or a (partial) custom element definition`);
    }
    equals(t) {
        switch (this.type) {
          case 2:
          case 4:
          case 3:
          case 0:
            return this.type === t.type && this.value === t.value;

          case 1:
            return this.type === t.type && this.value.equals(t.value);
        }
    }
    clone() {
        return new TypedNavigationInstruction(this.type, this.value);
    }
    toUrlComponent() {
        switch (this.type) {
          case 2:
            return this.value.name;

          case 4:
          case 3:
            return `au$obj${zt(this.value)}`;

          case 1:
            return this.value.toUrlComponent();

          case 0:
            return this.value;
        }
    }
    toString() {
        switch (this.type) {
          case 2:
            return `CEDef(name:'${this.value.name}')`;

          case 3:
            return `Promise`;

          case 4:
            return `VM(name:'${R.getDefinition(this.value.constructor).name}')`;

          case 1:
            return this.value.toString();

          case 0:
            return `'${this.value}'`;
        }
    }
}

const Ft = f;

function Ht(t, i) {
    if (!et(t.params, i.params)) return "replace";
    return "none";
}

class RouteConfig {
    constructor(t, i, e, n, s, o, r, a, h, c, u, l) {
        this.id = t;
        this.path = i;
        this.title = e;
        this.redirectTo = n;
        this.caseSensitive = s;
        this.transitionPlan = o;
        this.viewport = r;
        this.data = a;
        this.routes = h;
        this.fallback = c;
        this.component = u;
        this.nav = l;
    }
    static create(t, i) {
        var e, n, s, o, r, a, h, c, u, l, f, d, p, v, g, w, m, $, x, E, y, R, b, S, k, C, I, N, A, T;
        if ("string" === typeof t || t instanceof Array) {
            const f = t;
            const d = null !== (e = null === i || void 0 === i ? void 0 : i.redirectTo) && void 0 !== e ? e : null;
            const p = null !== (n = null === i || void 0 === i ? void 0 : i.caseSensitive) && void 0 !== n ? n : false;
            const v = null !== (s = null === i || void 0 === i ? void 0 : i.id) && void 0 !== s ? s : f instanceof Array ? f[0] : f;
            const g = null !== (o = null === i || void 0 === i ? void 0 : i.title) && void 0 !== o ? o : null;
            const w = null !== (r = null === i || void 0 === i ? void 0 : i.transitionPlan) && void 0 !== r ? r : Ht;
            const m = null !== (a = null === i || void 0 === i ? void 0 : i.viewport) && void 0 !== a ? a : null;
            const $ = null !== (h = null === i || void 0 === i ? void 0 : i.data) && void 0 !== h ? h : {};
            const x = null !== (c = null === i || void 0 === i ? void 0 : i.routes) && void 0 !== c ? c : Ft;
            return new RouteConfig(v, f, g, d, p, w, m, $, x, null !== (u = null === i || void 0 === i ? void 0 : i.fallback) && void 0 !== u ? u : null, null, null !== (l = null === i || void 0 === i ? void 0 : i.nav) && void 0 !== l ? l : true);
        } else if ("object" === typeof t) {
            const e = t;
            X(e, "");
            const n = null !== (d = null !== (f = e.path) && void 0 !== f ? f : null === i || void 0 === i ? void 0 : i.path) && void 0 !== d ? d : null;
            const s = null !== (v = null !== (p = e.title) && void 0 !== p ? p : null === i || void 0 === i ? void 0 : i.title) && void 0 !== v ? v : null;
            const o = null !== (w = null !== (g = e.redirectTo) && void 0 !== g ? g : null === i || void 0 === i ? void 0 : i.redirectTo) && void 0 !== w ? w : null;
            const r = null !== ($ = null !== (m = e.caseSensitive) && void 0 !== m ? m : null === i || void 0 === i ? void 0 : i.caseSensitive) && void 0 !== $ ? $ : false;
            const a = null !== (E = null !== (x = e.id) && void 0 !== x ? x : null === i || void 0 === i ? void 0 : i.id) && void 0 !== E ? E : n instanceof Array ? n[0] : n;
            const h = null !== (R = null !== (y = e.transitionPlan) && void 0 !== y ? y : null === i || void 0 === i ? void 0 : i.transitionPlan) && void 0 !== R ? R : Ht;
            const c = null !== (S = null !== (b = e.viewport) && void 0 !== b ? b : null === i || void 0 === i ? void 0 : i.viewport) && void 0 !== S ? S : null;
            const u = {
                ...null === i || void 0 === i ? void 0 : i.data,
                ...e.data
            };
            const l = [ ...null !== (k = e.routes) && void 0 !== k ? k : Ft, ...null !== (C = null === i || void 0 === i ? void 0 : i.routes) && void 0 !== C ? C : Ft ];
            return new RouteConfig(a, n, s, o, r, h, c, u, l, null !== (N = null !== (I = e.fallback) && void 0 !== I ? I : null === i || void 0 === i ? void 0 : i.fallback) && void 0 !== N ? N : null, null !== (A = e.component) && void 0 !== A ? A : null, null !== (T = e.nav) && void 0 !== T ? T : true);
        } else Q("string, function/class or object", "", t);
    }
    applyChildRouteConfig(t) {
        var i, e, n, s, o, r, a, h, c, u, l, f, d;
        let p = null !== (i = this.path) && void 0 !== i ? i : "";
        if ("string" !== typeof p) p = p[0];
        X(t, p);
        return new RouteConfig(null !== (e = t.id) && void 0 !== e ? e : this.id, null !== (n = t.path) && void 0 !== n ? n : this.path, null !== (s = t.title) && void 0 !== s ? s : this.title, null !== (o = t.redirectTo) && void 0 !== o ? o : this.redirectTo, null !== (r = t.caseSensitive) && void 0 !== r ? r : this.caseSensitive, null !== (a = t.transitionPlan) && void 0 !== a ? a : this.transitionPlan, null !== (h = t.viewport) && void 0 !== h ? h : this.viewport, null !== (c = t.data) && void 0 !== c ? c : this.data, null !== (u = t.routes) && void 0 !== u ? u : this.routes, null !== (l = t.fallback) && void 0 !== l ? l : this.fallback, null !== (f = t.component) && void 0 !== f ? f : this.component, null !== (d = t.nav) && void 0 !== d ? d : this.nav);
    }
}

const Wt = {
    name: l.resource.keyFor("route-configuration"),
    isConfigured(t) {
        return i.hasOwn(Wt.name, t);
    },
    configure(t, e) {
        const n = RouteConfig.create(t, e);
        i.define(Wt.name, n, e);
        return e;
    },
    getConfig(t) {
        if (!Wt.isConfigured(t)) Wt.configure({}, t);
        return i.getOwn(Wt.name, t);
    }
};

function Gt(t) {
    return function(i) {
        return Wt.configure(t, i);
    };
}

const Yt = "default";

class RouteDefinition {
    constructor(t, i, e) {
        var n, s, o, r, a, h, c;
        this.config = t;
        this.component = i;
        this.hasExplicitPath = null !== t.path;
        this.caseSensitive = t.caseSensitive;
        this.path = H(null !== (n = t.path) && void 0 !== n ? n : i.name);
        this.redirectTo = null !== (s = t.redirectTo) && void 0 !== s ? s : null;
        this.viewport = null !== (o = t.viewport) && void 0 !== o ? o : Yt;
        this.id = W(null !== (r = t.id) && void 0 !== r ? r : this.path);
        this.data = null !== (a = t.data) && void 0 !== a ? a : {};
        this.fallback = null !== (c = null !== (h = t.fallback) && void 0 !== h ? h : null === e || void 0 === e ? void 0 : e.fallback) && void 0 !== c ? c : null;
    }
    static resolve(t, i, e, n) {
        if (Z(t)) return new RouteDefinition(RouteConfig.create(t, null), null, i);
        const s = this.createNavigationInstruction(t);
        let o;
        switch (s.type) {
          case 0:
            {
                if (void 0 === n) throw new Error(`When retrieving the RouteDefinition for a component name, a RouteContext (that can resolve it) must be provided`);
                const t = n.container.find(R, s.value);
                if (null === t) throw new Error(`Could not find a CustomElement named '${s.value}' in the current container scope of ${n}. This means the component is neither registered at Aurelia startup nor via the 'dependencies' decorator or static property.`);
                o = t;
                break;
            }

          case 2:
            o = s.value;
            break;

          case 4:
            o = R.getDefinition(s.value.constructor);
            break;

          case 3:
            if (void 0 === n) throw new Error(`RouteContext must be provided when resolving an imported module`);
            o = n.resolveLazy(s.value);
            break;
        }
        return r(o, (n => {
            var o, r, a, c;
            let u = Jt.get(n);
            const l = 4 === s.type && "function" === typeof t.getRouteConfig;
            if (null === u) {
                const s = n.Type;
                let r = null;
                if (l) r = RouteConfig.create(null !== (o = t.getRouteConfig(i, e)) && void 0 !== o ? o : h, s); else r = _(t) ? Wt.isConfigured(s) ? Wt.getConfig(s).applyChildRouteConfig(t) : RouteConfig.create(t, s) : Wt.getConfig(n.Type);
                u = new RouteDefinition(r, n, i);
                Jt.define(u, n);
            } else if (0 === u.config.routes.length && l) u.applyChildRouteConfig(null !== (c = null === (a = (r = t).getRouteConfig) || void 0 === a ? void 0 : a.call(r, i, e)) && void 0 !== c ? c : h);
            return u;
        }));
    }
    static createNavigationInstruction(t) {
        return _(t) ? this.createNavigationInstruction(t.component) : TypedNavigationInstruction.create(t);
    }
    applyChildRouteConfig(t) {
        var i, e, n, s, o, r, a;
        this.config = t = this.config.applyChildRouteConfig(t);
        this.hasExplicitPath = null !== t.path;
        this.caseSensitive = null !== (i = t.caseSensitive) && void 0 !== i ? i : this.caseSensitive;
        this.path = H(null !== (e = t.path) && void 0 !== e ? e : this.path);
        this.redirectTo = null !== (n = t.redirectTo) && void 0 !== n ? n : null;
        this.viewport = null !== (s = t.viewport) && void 0 !== s ? s : Yt;
        this.id = W(null !== (o = t.id) && void 0 !== o ? o : this.path);
        this.data = null !== (r = t.data) && void 0 !== r ? r : {};
        this.fallback = null !== (a = t.fallback) && void 0 !== a ? a : this.fallback;
    }
    register(t) {
        var i;
        null === (i = this.component) || void 0 === i ? void 0 : i.register(t);
    }
    toString() {
        const t = null === this.config.path ? "null" : `'${this.config.path}'`;
        if (null !== this.component) return `RD(config.path:${t},c.name:'${this.component.name}',vp:'${this.viewport}')`; else return `RD(config.path:${t},redirectTo:'${this.redirectTo}')`;
    }
}

const Jt = {
    name: l.resource.keyFor("route-definition"),
    isDefined(t) {
        return i.hasOwn(Jt.name, t);
    },
    define(t, e) {
        i.define(Jt.name, t, e);
    },
    get(t) {
        return Jt.isDefined(t) ? i.getOwn(Jt.name, t) : null;
    }
};

const _t = new WeakMap;

class ComponentAgent {
    constructor(t, i, e, n, o) {
        var r, a, h, c;
        this.instance = t;
        this.controller = i;
        this.definition = e;
        this.routeNode = n;
        this.ctx = o;
        this.R = o.container.get(s).scopeTo(`ComponentAgent<${o.friendlyPath}>`);
        this.R.trace(`constructor()`);
        const u = i.lifecycleHooks;
        this.canLoadHooks = (null !== (r = u.canLoad) && void 0 !== r ? r : []).map((t => t.instance));
        this.loadHooks = (null !== (a = u.load) && void 0 !== a ? a : []).map((t => t.instance));
        this.canUnloadHooks = (null !== (h = u.canUnload) && void 0 !== h ? h : []).map((t => t.instance));
        this.unloadHooks = (null !== (c = u.unload) && void 0 !== c ? c : []).map((t => t.instance));
        this.C = "canLoad" in t;
        this.I = "load" in t;
        this.N = "canUnload" in t;
        this.A = "unload" in t;
    }
    static for(t, i, e, n) {
        let s = _t.get(t);
        if (void 0 === s) {
            const o = n.container;
            const r = RouteDefinition.resolve(t.constructor, n.definition, null);
            const a = E.$el(o, t, i.host, null);
            _t.set(t, s = new ComponentAgent(t, a, r, e, n));
        }
        return s;
    }
    activate(t, i, e) {
        if (null === t) {
            this.R.trace(`activate() - initial`);
            return this.controller.activate(this.controller, i, e);
        }
        this.R.trace(`activate()`);
        void this.controller.activate(t, i, e);
    }
    deactivate(t, i, e) {
        if (null === t) {
            this.R.trace(`deactivate() - initial`);
            return this.controller.deactivate(this.controller, i, e);
        }
        this.R.trace(`deactivate()`);
        void this.controller.deactivate(t, i, e);
    }
    dispose() {
        this.R.trace(`dispose()`);
        this.controller.dispose();
    }
    canUnload(t, i, e) {
        this.R.trace(`canUnload(next:%s) - invoking ${this.canUnloadHooks.length} hooks`, i);
        e.push();
        let n = Promise.resolve();
        for (const s of this.canUnloadHooks) {
            e.push();
            n = n.then((() => new Promise((n => {
                if (true !== t.guardsResult) {
                    e.pop();
                    n();
                    return;
                }
                t.run((() => s.canUnload(this.instance, i, this.routeNode)), (i => {
                    if (true === t.guardsResult && true !== i) t.guardsResult = false;
                    e.pop();
                    n();
                }));
            }))));
        }
        if (this.N) {
            e.push();
            n = n.then((() => {
                if (true !== t.guardsResult) {
                    e.pop();
                    return;
                }
                t.run((() => this.instance.canUnload(i, this.routeNode)), (i => {
                    if (true === t.guardsResult && true !== i) t.guardsResult = false;
                    e.pop();
                }));
            }));
        }
        e.pop();
    }
    canLoad(t, i, e) {
        this.R.trace(`canLoad(next:%s) - invoking ${this.canLoadHooks.length} hooks`, i);
        const n = this.ctx.root;
        e.push();
        let s = Promise.resolve();
        for (const o of this.canLoadHooks) {
            e.push();
            s = s.then((() => new Promise((s => {
                if (true !== t.guardsResult) {
                    e.pop();
                    s();
                    return;
                }
                t.run((() => o.canLoad(this.instance, i.params, i, this.routeNode)), (i => {
                    if (true === t.guardsResult && true !== i) t.guardsResult = false === i ? false : ViewportInstructionTree.create(i, void 0, n);
                    e.pop();
                    s();
                }));
            }))));
        }
        if (this.C) {
            e.push();
            s = s.then((() => {
                if (true !== t.guardsResult) {
                    e.pop();
                    return;
                }
                t.run((() => this.instance.canLoad(i.params, i, this.routeNode)), (i => {
                    if (true === t.guardsResult && true !== i) t.guardsResult = false === i ? false : ViewportInstructionTree.create(i, void 0, n);
                    e.pop();
                }));
            }));
        }
        e.pop();
    }
    unload(t, i, e) {
        this.R.trace(`unload(next:%s) - invoking ${this.unloadHooks.length} hooks`, i);
        e.push();
        for (const n of this.unloadHooks) t.run((() => {
            e.push();
            return n.unload(this.instance, i, this.routeNode);
        }), (() => {
            e.pop();
        }));
        if (this.A) t.run((() => {
            e.push();
            return this.instance.unload(i, this.routeNode);
        }), (() => {
            e.pop();
        }));
        e.pop();
    }
    load(t, i, e) {
        this.R.trace(`load(next:%s) - invoking ${this.loadHooks.length} hooks`, i);
        e.push();
        for (const n of this.loadHooks) t.run((() => {
            e.push();
            return n.load(this.instance, i.params, i, this.routeNode);
        }), (() => {
            e.pop();
        }));
        if (this.I) t.run((() => {
            e.push();
            return this.instance.load(i.params, i, this.routeNode);
        }), (() => {
            e.pop();
        }));
        e.pop();
    }
    toString() {
        return `CA(ctx:'${this.ctx.friendlyPath}',c:'${this.definition.component.name}')`;
    }
}

const Zt = e.createInterface("IRouteContext");

const Kt = "au$residue";

const Qt = Object.freeze([ "string", "object", "function" ]);

function Xt(t) {
    if (null == t) return false;
    const i = t.params;
    const e = t.component;
    return "object" === typeof i && null !== i && null != e && Qt.includes(typeof e) && !(e instanceof Promise);
}

class RouteContext {
    constructor(t, i, e, n, o, r) {
        this.parent = i;
        this.component = e;
        this.definition = n;
        this.parentContainer = o;
        this.T = r;
        this.childViewportAgents = [];
        this.childRoutes = [];
        this.V = null;
        this.P = null;
        this.prevNode = null;
        this.U = null;
        this.L = false;
        this.O = t;
        if (null === i) {
            this.root = this;
            this.path = [ this ];
            this.friendlyPath = e.name;
        } else {
            this.root = i.root;
            this.path = [ ...i.path, this ];
            this.friendlyPath = `${i.friendlyPath}/${e.name}`;
        }
        this.logger = o.get(s).scopeTo(`RouteContext<${this.friendlyPath}>`);
        this.logger.trace("constructor()");
        this.moduleLoader = o.get(d);
        const a = this.container = o.createChild();
        a.registerResolver(S, this.hostControllerProvider = new p, true);
        a.registerResolver(Zt, new p("IRouteContext", this));
        a.register(n);
        a.register(...e.dependencies);
        this.recognizer = new B;
        const h = this.j = new NavigationModel([]);
        a.get(rt).subscribe("au:router:navigation-end", (() => h.setIsActive(r, this)));
        this.processDefinition(n);
    }
    get isRoot() {
        return null === this.parent;
    }
    get depth() {
        return this.path.length - 1;
    }
    get resolved() {
        return this.V;
    }
    get allResolved() {
        return this.P;
    }
    get node() {
        const t = this.U;
        if (null === t) throw new Error(`Invariant violation: RouteNode should be set immediately after the RouteContext is created. Context: ${this}`);
        return t;
    }
    set node(t) {
        const i = this.prevNode = this.U;
        if (i !== t) {
            this.U = t;
            this.logger.trace(`Node changed from %s to %s`, this.prevNode, t);
        }
    }
    get vpa() {
        const t = this.O;
        if (null === t) throw new Error(`RouteContext has no ViewportAgent: ${this}`);
        return t;
    }
    get navigationModel() {
        return this.j;
    }
    processDefinition(t) {
        var i, e, n;
        const s = [];
        const o = [];
        const r = t.config.routes;
        const a = r.length;
        if (0 === a) {
            const n = null === (e = null === (i = t.component) || void 0 === i ? void 0 : i.Type.prototype) || void 0 === e ? void 0 : e.getRouteConfig;
            this.L = null == n ? true : "function" !== typeof n;
            return;
        }
        const h = this.j;
        let c = 0;
        for (;c < a; c++) {
            const i = r[c];
            if (i instanceof Promise) {
                const t = this.addRoute(i);
                s.push(t);
                o.push(t);
            } else {
                const e = RouteDefinition.resolve(i, t, null, this);
                if (e instanceof Promise) if (_(i) && null != i.path) {
                    for (const t of H(i.path)) this.$addRoute(t, null !== (n = i.caseSensitive) && void 0 !== n ? n : false, e);
                    const t = this.childRoutes.length;
                    const s = e.then((i => this.childRoutes[t] = i));
                    this.childRoutes.push(s);
                    h.addRoute(s);
                    o.push(s.then(v));
                } else throw new Error(`Invalid route config. When the component property is a lazy import, the path must be specified.`); else {
                    for (const t of e.path) this.$addRoute(t, e.caseSensitive, e);
                    this.childRoutes.push(e);
                    h.addRoute(e);
                }
            }
        }
        this.L = true;
        if (s.length > 0) this.V = Promise.all(s).then((() => {
            this.V = null;
        }));
        if (o.length > 0) this.P = Promise.all(o).then((() => {
            this.P = null;
        }));
    }
    static setRoot(t) {
        const i = t.get(s).scopeTo("RouteContext");
        if (!t.has(k, true)) ii(new Error(`The provided container has no registered IAppRoot. RouteContext.setRoot can only be used after Aurelia.app was called, on a container that is within that app's component tree.`), i);
        if (t.has(Zt, true)) ii(new Error(`A root RouteContext is already registered. A possible cause is the RouterConfiguration being registered more than once in the same container tree. If you have a multi-rooted app, make sure you register RouterConfiguration only in the "forked" containers and not in the common root.`), i);
        const {controller: e} = t.get(k);
        if (void 0 === e) ii(new Error(`The provided IAppRoot does not (yet) have a controller. A possible cause is calling this API manually before Aurelia.start() is called`), i);
        const n = t.get(Dt);
        const o = n.getRouteContext(null, e.definition, e.viewModel, e.container, null);
        t.register(g.instance(Zt, o));
        o.node = n.routeTree.root;
    }
    static resolve(t, i) {
        const e = t.container;
        const n = e.get(s).scopeTo("RouteContext");
        if (null === i || void 0 === i) {
            n.trace(`resolve(context:%s) - returning root RouteContext`, i);
            return t;
        }
        if (ti(i)) {
            n.trace(`resolve(context:%s) - returning provided RouteContext`, i);
            return i;
        }
        if (i instanceof e.get(y).Node) try {
            const t = R.for(i, {
                searchParents: true
            });
            n.trace(`resolve(context:Node(nodeName:'${i.nodeName}'),controller:'${t.definition.name}') - resolving RouteContext from controller's RenderContext`);
            return t.container.get(Zt);
        } catch (t) {
            n.error(`Failed to resolve RouteContext from Node(nodeName:'${i.nodeName}')`, t);
            throw t;
        }
        if (w(i)) {
            const t = i.$controller;
            n.trace(`resolve(context:CustomElementViewModel(name:'${t.definition.name}')) - resolving RouteContext from controller's RenderContext`);
            return t.container.get(Zt);
        }
        if (C(i)) {
            const t = i;
            n.trace(`resolve(context:CustomElementController(name:'${t.definition.name}')) - resolving RouteContext from controller's RenderContext`);
            return t.container.get(Zt);
        }
        ii(new Error(`Invalid context type: ${Object.prototype.toString.call(i)}`), n);
    }
    dispose() {
        this.container.dispose();
    }
    resolveViewportAgent(t) {
        this.logger.trace(`resolveViewportAgent(req:%s)`, t);
        const i = this.childViewportAgents.find((i => i.handles(t)));
        if (void 0 === i) throw new Error(`Failed to resolve ${t} at:\n${this.printTree()}`);
        return i;
    }
    getAvailableViewportAgents(t) {
        return this.childViewportAgents.filter((i => i.isAvailable(t)));
    }
    getFallbackViewportAgent(t, i) {
        var e;
        return null !== (e = this.childViewportAgents.find((e => e.isAvailable(t) && e.viewport.name === i && e.viewport.fallback.length > 0))) && void 0 !== e ? e : null;
    }
    createComponentAgent(t, i) {
        this.logger.trace(`createComponentAgent(routeNode:%s)`, i);
        this.hostControllerProvider.prepare(t);
        const e = this.container.get(i.component.key);
        if (!this.L) {
            const t = RouteDefinition.resolve(e, this.definition, i);
            this.processDefinition(t);
        }
        const n = ComponentAgent.for(e, t, i, this);
        this.hostControllerProvider.dispose();
        return n;
    }
    registerViewport(t) {
        const i = ViewportAgent.for(t, this);
        if (this.childViewportAgents.includes(i)) this.logger.trace(`registerViewport(agent:%s) -> already registered, so skipping`, i); else {
            this.logger.trace(`registerViewport(agent:%s) -> adding`, i);
            this.childViewportAgents.push(i);
        }
        return i;
    }
    unregisterViewport(t) {
        const i = ViewportAgent.for(t, this);
        if (this.childViewportAgents.includes(i)) {
            this.logger.trace(`unregisterViewport(agent:%s) -> unregistering`, i);
            this.childViewportAgents.splice(this.childViewportAgents.indexOf(i), 1);
        } else this.logger.trace(`unregisterViewport(agent:%s) -> not registered, so skipping`, i);
    }
    recognize(t, i = false) {
        var e;
        this.logger.trace(`recognize(path:'${t}')`);
        let n = this;
        let s = true;
        let o = null;
        while (s) {
            o = n.recognizer.recognize(t);
            if (null === o) {
                if (!i || n.isRoot) return null;
                n = n.parent;
            } else s = false;
        }
        let r;
        if (Reflect.has(o.params, Kt)) r = null !== (e = o.params[Kt]) && void 0 !== e ? e : null; else r = null;
        return new $RecognizedRoute(o, r);
    }
    addRoute(t) {
        this.logger.trace(`addRoute(routeable:'${t}')`);
        return r(RouteDefinition.resolve(t, this.definition, null, this), (t => {
            for (const i of t.path) this.$addRoute(i, t.caseSensitive, t);
            this.j.addRoute(t);
            this.childRoutes.push(t);
        }));
    }
    $addRoute(t, i, e) {
        this.recognizer.add({
            path: t,
            caseSensitive: i,
            handler: e
        });
        this.recognizer.add({
            path: `${t}/*${Kt}`,
            caseSensitive: i,
            handler: e
        });
    }
    resolveLazy(t) {
        return this.moduleLoader.load(t, (i => {
            const e = i.raw;
            if ("function" === typeof e) {
                const t = l.resource.getAll(e).find(ei);
                if (void 0 !== t) return t;
            }
            let n;
            let s;
            for (const t of i.items) if (t.isConstructable) {
                const i = t.definitions.find(ei);
                if (void 0 !== i) if ("default" === t.key) n = i; else if (void 0 === s) s = i;
            }
            if (void 0 === n) {
                if (void 0 === s) throw new Error(`${t} does not appear to be a component or CustomElement recognizable by Aurelia`);
                return s;
            }
            return n;
        }));
    }
    generateViewportInstruction(t) {
        if (!Xt(t)) return null;
        const i = t.component;
        let e;
        let n = false;
        if (i instanceof RouteDefinition) {
            e = i;
            n = true;
        } else if ("string" === typeof i) e = this.childRoutes.find((t => t.id === i)); else if (0 === i.type) e = this.childRoutes.find((t => t.id === i.value)); else e = RouteDefinition.resolve(i, null, null, this);
        if (void 0 === e) return null;
        const s = t.params;
        const o = this.recognizer;
        const r = e.path;
        const a = r.length;
        const h = [];
        let c = null;
        if (1 === a) {
            const i = l(r[0]);
            if (null === i) {
                const i = `Unable to eagerly generate path for ${t}. Reasons: ${h}.`;
                if (n) throw new Error(i);
                this.logger.debug(i);
                return null;
            }
            return {
                vi: ViewportInstruction.create({
                    recognizedRoute: new $RecognizedRoute(new j(i.endpoint, i.consumed), null),
                    component: i.path,
                    children: t.children,
                    viewport: t.viewport,
                    open: t.open,
                    close: t.close
                }),
                query: i.query
            };
        }
        let u = 0;
        for (let t = 0; t < a; t++) {
            const i = l(r[t]);
            if (null === i) continue;
            if (null === c) {
                c = i;
                u = Object.keys(i.consumed).length;
            } else if (Object.keys(i.consumed).length > u) c = i;
        }
        if (null === c) {
            const i = `Unable to eagerly generate path for ${t}. Reasons: ${h}.`;
            if (n) throw new Error(i);
            this.logger.debug(i);
            return null;
        }
        return {
            vi: ViewportInstruction.create({
                recognizedRoute: new $RecognizedRoute(new j(c.endpoint, c.consumed), null),
                component: c.path,
                children: t.children,
                viewport: t.viewport,
                open: t.open,
                close: t.close
            }),
            query: c.query
        };
        function l(t) {
            const i = o.getEndpoint(t);
            if (null === i) {
                h.push(`No endpoint found for the path: '${t}'.`);
                return null;
            }
            const e = Object.create(null);
            for (const n of i.params) {
                const i = n.name;
                let o = s[i];
                if (null == o || 0 === String(o).length) {
                    if (!n.isOptional) {
                        h.push(`No value for the required parameter '${i}' is provided for the path: '${t}'.`);
                        return null;
                    }
                    o = "";
                } else e[i] = o;
                const r = n.isStar ? `*${i}` : n.isOptional ? `:${i}?` : `:${i}`;
                t = t.replace(r, o);
            }
            const n = Object.keys(e);
            const r = Object.fromEntries(Object.entries(s).filter((([t]) => !n.includes(t))));
            return {
                path: t.replace(/\/\//g, "/"),
                endpoint: i,
                consumed: e,
                query: r
            };
        }
    }
    toString() {
        const t = this.childViewportAgents;
        const i = t.map(String).join(",");
        return `RC(path:'${this.friendlyPath}',viewports:[${i}])`;
    }
    printTree() {
        const t = [];
        for (let i = 0; i < this.path.length; ++i) t.push(`${" ".repeat(i)}${this.path[i]}`);
        return t.join("\n");
    }
}

function ti(t) {
    return t instanceof RouteContext;
}

function ii(t, i) {
    i.error(t);
    throw t;
}

function ei(t) {
    return R.isType(t.Type);
}

class $RecognizedRoute {
    constructor(t, i) {
        this.route = t;
        this.residue = i;
    }
    toString() {
        const t = this.route;
        const i = t.endpoint.route;
        return `RR(route:(endpoint:(route:(path:${i.path},handler:${i.handler})),params:${JSON.stringify(t.params)}),residue:${this.residue})`;
    }
}

e.createInterface("INavigationModel");

class NavigationModel {
    constructor(t) {
        this.routes = t;
        this.M = void 0;
    }
    resolve() {
        return r(this.M, v);
    }
    setIsActive(t, i) {
        void r(this.M, (() => {
            for (const e of this.routes) e.setIsActive(t, i);
        }));
    }
    addRoute(t) {
        const i = this.routes;
        if (!(t instanceof Promise)) {
            if (t.config.nav) i.push(NavigationRoute.create(t));
            return;
        }
        const e = i.length;
        i.push(void 0);
        let n;
        n = this.M = r(this.M, (() => r(t, (t => {
            if (t.config.nav) i[e] = NavigationRoute.create(t); else i.splice(e, 1);
            if (this.M === n) this.M = void 0;
        }))));
    }
}

class NavigationRoute {
    constructor(t, i, e, n) {
        this.id = t;
        this.path = i;
        this.title = e;
        this.data = n;
    }
    static create(t) {
        return new NavigationRoute(t.id, t.path, t.config.title, t.data);
    }
    get isActive() {
        return this.B;
    }
    setIsActive(t, i) {
        this.B = this.path.some((e => t.isActive(e, i)));
    }
}

let ni = class ViewportCustomElement {
    constructor(t, i) {
        this.logger = t;
        this.ctx = i;
        this.name = Yt;
        this.usedBy = "";
        this.default = "";
        this.fallback = "";
        this.stateful = false;
        this.agent = void 0;
        this.controller = void 0;
        this.logger = t.scopeTo(`au-viewport<${i.friendlyPath}>`);
        this.logger.trace("constructor()");
    }
    hydrated(t) {
        this.logger.trace("hydrated()");
        this.controller = t;
        this.agent = this.ctx.registerViewport(this);
    }
    attaching(t, i, e) {
        this.logger.trace("attaching()");
        return this.agent.activateFromViewport(t, this.controller, e);
    }
    detaching(t, i, e) {
        this.logger.trace("detaching()");
        return this.agent.deactivateFromViewport(t, this.controller, e);
    }
    dispose() {
        this.logger.trace("dispose()");
        this.ctx.unregisterViewport(this);
        this.agent.dispose();
        this.agent = void 0;
    }
    toString() {
        const t = [];
        for (const i of si) {
            const e = this[i];
            switch (typeof e) {
              case "string":
                if ("" !== e) t.push(`${i}:'${e}'`);
                break;

              case "boolean":
                if (e) t.push(`${i}:${e}`);
                break;

              default:
                t.push(`${i}:${String(e)}`);
            }
        }
        return `VP(ctx:'${this.ctx.friendlyPath}',${t.join(",")})`;
    }
};

nt([ N ], ni.prototype, "name", void 0);

nt([ N ], ni.prototype, "usedBy", void 0);

nt([ N ], ni.prototype, "default", void 0);

nt([ N ], ni.prototype, "fallback", void 0);

nt([ N ], ni.prototype, "stateful", void 0);

ni = nt([ I({
    name: "au-viewport"
}), st(0, s), st(1, Zt) ], ni);

const si = [ "name", "usedBy", "default", "fallback", "stateful" ];

let oi = class LoadCustomAttribute {
    constructor(t, i, e, n, s, o, r) {
        this.target = t;
        this.el = i;
        this.router = e;
        this.events = n;
        this.delegator = s;
        this.ctx = o;
        this.locationMgr = r;
        this.attribute = "href";
        this.active = false;
        this.href = null;
        this.instructions = null;
        this.eventListener = null;
        this.navigationEndListener = null;
        this.onClick = t => {
            if (null === this.instructions) return;
            if (t.altKey || t.ctrlKey || t.shiftKey || t.metaKey || 0 !== t.button) return;
            t.preventDefault();
            void this.router.load(this.instructions, {
                context: this.context
            });
        };
        this.isEnabled = !i.hasAttribute("external") && !i.hasAttribute("data-external");
    }
    binding() {
        if (this.isEnabled) this.eventListener = this.delegator.addEventListener(this.target, this.el, "click", this.onClick);
        this.valueChanged();
        this.navigationEndListener = this.events.subscribe("au:router:navigation-end", (t => {
            this.valueChanged();
            this.active = null !== this.instructions && this.router.isActive(this.instructions, this.context);
        }));
    }
    attaching() {
        const t = this.context;
        const i = t.allResolved;
        if (null !== i) return i.then((() => {
            this.valueChanged();
        }));
    }
    unbinding() {
        if (this.isEnabled) this.eventListener.dispose();
        this.navigationEndListener.dispose();
    }
    valueChanged() {
        const t = this.router;
        const i = t.options.useUrlFragmentHash;
        const e = this.route;
        let n = this.context;
        if (void 0 === n) n = this.context = this.ctx; else if (null === n) n = this.context = this.ctx.root;
        if (null != e && null === n.allResolved) {
            const s = this.params;
            const o = this.instructions = t.createViewportInstructions("object" === typeof s && null !== s ? {
                component: e,
                params: s
            } : e, {
                context: n
            });
            this.href = o.toUrl(i);
        } else {
            this.instructions = null;
            this.href = null;
        }
        const s = R.for(this.el, {
            optional: true
        });
        if (null !== s) s.viewModel[this.attribute] = this.instructions; else if (null === this.href) this.el.removeAttribute(this.attribute); else {
            const t = i ? this.href : this.locationMgr.addBaseHref(this.href);
            this.el.setAttribute(this.attribute, t);
        }
    }
};

nt([ N({
    mode: z.toView,
    primary: true,
    callback: "valueChanged"
}) ], oi.prototype, "route", void 0);

nt([ N({
    mode: z.toView,
    callback: "valueChanged"
}) ], oi.prototype, "params", void 0);

nt([ N({
    mode: z.toView
}) ], oi.prototype, "attribute", void 0);

nt([ N({
    mode: z.fromView
}) ], oi.prototype, "active", void 0);

nt([ N({
    mode: z.toView,
    callback: "valueChanged"
}) ], oi.prototype, "context", void 0);

oi = nt([ A("load"), st(0, T), st(1, V), st(2, Dt), st(3, rt), st(4, P), st(5, Zt), st(6, ct) ], oi);

let ri = class HrefCustomAttribute {
    constructor(t, i, e, n, s, o) {
        this.target = t;
        this.el = i;
        this.router = e;
        this.delegator = n;
        this.ctx = s;
        this.isInitialized = false;
        if (e.options.useHref && "A" === i.nodeName) switch (i.getAttribute("target")) {
          case null:
          case o.name:
          case "_self":
            this.isEnabled = true;
            break;

          default:
            this.isEnabled = false;
            break;
        } else this.isEnabled = false;
    }
    get isExternal() {
        return this.el.hasAttribute("external") || this.el.hasAttribute("data-external");
    }
    binding() {
        if (!this.isInitialized) {
            this.isInitialized = true;
            this.isEnabled = this.isEnabled && null === U(this.el, L.getDefinition(oi).key);
        }
        if (null == this.value) this.el.removeAttribute("href"); else this.el.setAttribute("href", this.value);
        this.eventListener = this.delegator.addEventListener(this.target, this.el, "click", this);
    }
    unbinding() {
        this.eventListener.dispose();
    }
    valueChanged(t) {
        if (null == t) this.el.removeAttribute("href"); else this.el.setAttribute("href", t);
    }
    handleEvent(t) {
        this.q(t);
    }
    q(t) {
        if (t.altKey || t.ctrlKey || t.shiftKey || t.metaKey || 0 !== t.button || this.isExternal || !this.isEnabled) return;
        const i = this.el.getAttribute("href");
        if (null !== i) {
            t.preventDefault();
            void this.router.load(i, {
                context: this.ctx
            });
        }
    }
};

nt([ N({
    mode: z.toView
}) ], ri.prototype, "value", void 0);

ri = nt([ A({
    name: "href",
    noMultiBindings: true
}), st(0, T), st(1, V), st(2, Dt), st(3, P), st(4, Zt), st(5, x) ], ri);

const ai = Dt;

const hi = [ ai ];

const ci = ni;

const ui = oi;

const li = ri;

const fi = [ ni, oi, ri ];

function di(i, e) {
    var n;
    let s;
    let o = null;
    if (t(e)) if ("function" === typeof e) s = t => e(t); else {
        o = null !== (n = e.basePath) && void 0 !== n ? n : null;
        s = t => t.start(e, true);
    } else s = t => t.start({}, true);
    return i.register(g.cachedCallback(ht, ((t, i, e) => {
        const n = t.get(x);
        const s = new URL(n.document.baseURI);
        s.pathname = lt(null !== o && void 0 !== o ? o : s.pathname);
        return s;
    })), O.hydrated(c, RouteContext.setRoot), O.activated(Dt, s), O.deactivated(Dt, (t => {
        t.stop();
    })), ...hi, ...fi);
}

const pi = {
    register(t) {
        return di(t);
    },
    customize(t) {
        return {
            register(i) {
                return di(i, t);
            }
        };
    }
};

class ScrollState {
    constructor(t) {
        this.el = t;
        this.top = t.scrollTop;
        this.left = t.scrollLeft;
    }
    static has(t) {
        return t.scrollTop > 0 || t.scrollLeft > 0;
    }
    restore() {
        this.el.scrollTo(this.left, this.top);
        this.el = null;
    }
}

function vi(t) {
    t.restore();
}

class HostElementState {
    constructor(t) {
        this.scrollStates = [];
        this.save(t.children);
    }
    save(t) {
        let i;
        for (let e = 0, n = t.length; e < n; ++e) {
            i = t[e];
            if (ScrollState.has(i)) this.scrollStates.push(new ScrollState(i));
            this.save(i.children);
        }
    }
    restore() {
        this.scrollStates.forEach(vi);
        this.scrollStates = null;
    }
}

const gi = e.createInterface("IStateManager", (t => t.singleton(ScrollStateManager)));

class ScrollStateManager {
    constructor() {
        this.cache = new WeakMap;
    }
    saveState(t) {
        this.cache.set(t.host, new HostElementState(t.host));
    }
    restoreState(t) {
        const i = this.cache.get(t.host);
        if (void 0 !== i) {
            i.restore();
            this.cache.delete(t.host);
        }
    }
}

export { wt as AST, ActionExpression, ot as AuNavId, ComponentAgent, ComponentExpression, CompositeSegmentExpression, hi as DefaultComponents, fi as DefaultResources, pt as ExpressionKind, ri as HrefCustomAttribute, li as HrefCustomAttributeRegistration, ct as ILocationManager, Zt as IRouteContext, Dt as IRouter, rt as IRouterEvents, gi as IStateManager, oi as LoadCustomAttribute, ui as LoadCustomAttributeRegistration, LocationChangeEvent, NavigationCancelEvent, NavigationEndEvent, NavigationErrorEvent, NavigationOptions, NavigationStartEvent, ParameterExpression, ParameterListExpression, Wt as Route, RouteConfig, RouteContext, RouteDefinition, RouteExpression, RouteNode, RouteTree, Mt as Router, pi as RouterConfiguration, RouterOptions, ai as RouterRegistration, ScopedSegmentExpression, SegmentExpression, SegmentGroupExpression, Transition, ViewportAgent, ni as ViewportCustomElement, ci as ViewportCustomElementRegistration, ViewportExpression, Lt as isManagedState, Gt as route, Ot as toManagedState };
//# sourceMappingURL=index.mjs.map
