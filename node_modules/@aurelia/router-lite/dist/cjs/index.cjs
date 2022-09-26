"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var t = require("@aurelia/metadata");

var e = require("@aurelia/kernel");

var i = require("@aurelia/runtime-html");

var s = require("@aurelia/route-recognizer");

var n = require("@aurelia/runtime");

class Batch {
    constructor(t, e, i) {
        this.stack = t;
        this.cb = e;
        this.done = false;
        this.next = null;
        this.head = null !== i && void 0 !== i ? i : this;
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

function o(t, e) {
    t = t.slice();
    e = e.slice();
    const i = [];
    while (t.length > 0) {
        const s = t.shift();
        const n = s.context.vpa;
        if (i.every((t => t.context.vpa !== n))) {
            const t = e.findIndex((t => t.context.vpa === n));
            if (t >= 0) i.push(...e.splice(0, t + 1)); else i.push(s);
        }
    }
    i.push(...e);
    return i;
}

function r(t) {
    try {
        return JSON.stringify(t);
    } catch (e) {
        return Object.prototype.toString.call(t);
    }
}

function a(t) {
    return "string" === typeof t ? [ t ] : t;
}

function h(t) {
    return "string" === typeof t ? t : t[0];
}

function c(t, e, i) {
    const s = i ? new URLSearchParams(t) : t;
    if (null == e) return s;
    for (const [t, i] of Object.entries(e)) s.append(t, i);
    return s;
}

function u(t) {
    return "object" === typeof t && null !== t && !i.isCustomElementViewModel(t);
}

function l(t) {
    return u(t) && true === Object.prototype.hasOwnProperty.call(t, "name");
}

function d(t) {
    return u(t) && true === Object.prototype.hasOwnProperty.call(t, "component");
}

function f(t) {
    return u(t) && true === Object.prototype.hasOwnProperty.call(t, "redirectTo");
}

function p(t) {
    return u(t) && true === Object.prototype.hasOwnProperty.call(t, "component");
}

function v(t, e, i) {
    throw new Error(`Invalid route config property: "${e}". Expected ${t}, but got ${r(i)}.`);
}

function g(t, e) {
    if (null === t || void 0 === t) throw new Error(`Invalid route config: expected an object or string, but got: ${String(t)}.`);
    const i = Object.keys(t);
    for (const s of i) {
        const i = t[s];
        const n = [ e, s ].join(".");
        switch (s) {
          case "id":
          case "viewport":
          case "redirectTo":
          case "fallback":
            if ("string" !== typeof i) v("string", n, i);
            break;

          case "caseSensitive":
          case "nav":
            if ("boolean" !== typeof i) v("boolean", n, i);
            break;

          case "data":
            if ("object" !== typeof i || null === i) v("object", n, i);
            break;

          case "title":
            switch (typeof i) {
              case "string":
              case "function":
                break;

              default:
                v("string or function", n, i);
            }
            break;

          case "path":
            if (i instanceof Array) {
                for (let t = 0; t < i.length; ++t) if ("string" !== typeof i[t]) v("string", `${n}[${t}]`, i[t]);
            } else if ("string" !== typeof i) v("string or Array of strings", n, i);
            break;

          case "component":
            m(i, n);
            break;

          case "routes":
            if (!(i instanceof Array)) v("Array", n, i);
            for (const t of i) {
                const e = `${n}[${i.indexOf(t)}]`;
                m(t, e);
            }
            break;

          case "transitionPlan":
            switch (typeof i) {
              case "string":
                switch (i) {
                  case "none":
                  case "replace":
                  case "invoke-lifecycles":
                    break;

                  default:
                    v("string('none'|'replace'|'invoke-lifecycles') or function", n, i);
                }
                break;

              case "function":
                break;

              default:
                v("string('none'|'replace'|'invoke-lifecycles') or function", n, i);
            }
            break;

          default:
            throw new Error(`Unknown route config property: "${e}.${s}". Please specify known properties only.`);
        }
    }
}

function w(t, e) {
    if (null === t || void 0 === t) throw new Error(`Invalid route config: expected an object or string, but got: ${String(t)}.`);
    const i = Object.keys(t);
    for (const s of i) {
        const i = t[s];
        const n = [ e, s ].join(".");
        switch (s) {
          case "path":
            if (i instanceof Array) {
                for (let t = 0; t < i.length; ++t) if ("string" !== typeof i[t]) v("string", `${n}[${t}]`, i[t]);
            } else if ("string" !== typeof i) v("string or Array of strings", n, i);
            break;

          case "redirectTo":
            if ("string" !== typeof i) v("string", n, i);
            break;

          default:
            throw new Error(`Unknown redirect config property: "${e}.${s}". Only 'path' and 'redirectTo' should be specified for redirects.`);
        }
    }
}

function m(t, e) {
    switch (typeof t) {
      case "function":
        break;

      case "object":
        if (t instanceof Promise) break;
        if (f(t)) {
            w(t, e);
            break;
        }
        if (d(t)) {
            g(t, e);
            break;
        }
        if (!i.isCustomElementViewModel(t) && !l(t)) v(`an object with at least a 'component' property (see Routeable)`, e, t);
        break;

      case "string":
        break;

      default:
        v("function, object or string (see Routeable)", e, t);
    }
}

function x(t, e) {
    if (t === e) return true;
    if (typeof t !== typeof e) return false;
    if (null === t || null === e) return false;
    if (Object.getPrototypeOf(t) !== Object.getPrototypeOf(e)) return false;
    const i = Object.keys(t);
    const s = Object.keys(e);
    if (i.length !== s.length) return false;
    for (let n = 0, o = i.length; n < o; ++n) {
        const o = i[n];
        if (o !== s[n]) return false;
        if (t[o] !== e[o]) return false;
    }
    return true;
}

function $(t, e, i, s) {
    var n = arguments.length, o = n < 3 ? e : null === s ? s = Object.getOwnPropertyDescriptor(e, i) : s, r;
    if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) o = Reflect.decorate(t, e, i, s); else for (var a = t.length - 1; a >= 0; a--) if (r = t[a]) o = (n < 3 ? r(o) : n > 3 ? r(e, i, o) : r(e, i)) || o;
    return n > 3 && o && Object.defineProperty(e, i, o), o;
}

function E(t, e) {
    return function(i, s) {
        e(i, s, t);
    };
}

const y = "au-nav-id";

class Subscription {
    constructor(t, e, i) {
        this.events = t;
        this.serial = e;
        this.inner = i;
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

const R = e.DI.createInterface("IRouterEvents", (t => t.singleton(b)));

let b = class RouterEvents {
    constructor(t, e) {
        this.ea = t;
        this.logger = e;
        this.subscriptionSerial = 0;
        this.subscriptions = [];
        this.logger = e.scopeTo("RouterEvents");
    }
    publish(t) {
        this.logger.trace(`publishing %s`, t);
        this.ea.publish(t.name, t);
    }
    subscribe(t, e) {
        const i = new Subscription(this, ++this.subscriptionSerial, this.ea.subscribe(t, (s => {
            this.logger.trace(`handling %s for subscription #${i.serial}`, t);
            e(s);
        })));
        this.subscriptions.push(i);
        return i;
    }
};

b = $([ E(0, e.IEventAggregator), E(1, e.ILogger) ], b);

class LocationChangeEvent {
    constructor(t, e, i, s) {
        this.id = t;
        this.url = e;
        this.trigger = i;
        this.state = s;
    }
    get name() {
        return "au:router:location-change";
    }
    toString() {
        return `LocationChangeEvent(id:${this.id},url:'${this.url}',trigger:'${this.trigger}')`;
    }
}

class NavigationStartEvent {
    constructor(t, e, i, s) {
        this.id = t;
        this.instructions = e;
        this.trigger = i;
        this.managedState = s;
    }
    get name() {
        return "au:router:navigation-start";
    }
    toString() {
        return `NavigationStartEvent(id:${this.id},instructions:'${this.instructions}',trigger:'${this.trigger}')`;
    }
}

class NavigationEndEvent {
    constructor(t, e, i) {
        this.id = t;
        this.instructions = e;
        this.finalInstructions = i;
    }
    get name() {
        return "au:router:navigation-end";
    }
    toString() {
        return `NavigationEndEvent(id:${this.id},instructions:'${this.instructions}',finalInstructions:'${this.finalInstructions}')`;
    }
}

class NavigationCancelEvent {
    constructor(t, e, i) {
        this.id = t;
        this.instructions = e;
        this.reason = i;
    }
    get name() {
        return "au:router:navigation-cancel";
    }
    toString() {
        return `NavigationCancelEvent(id:${this.id},instructions:'${this.instructions}',reason:${String(this.reason)})`;
    }
}

class NavigationErrorEvent {
    constructor(t, e, i) {
        this.id = t;
        this.instructions = e;
        this.error = i;
    }
    get name() {
        return "au:router:navigation-error";
    }
    toString() {
        return `NavigationErrorEvent(id:${this.id},instructions:'${this.instructions}',error:${String(this.error)})`;
    }
}

const S = e.DI.createInterface("IBaseHref");

const k = e.DI.createInterface("ILocationManager", (t => t.singleton(C)));

let C = class BrowserLocationManager {
    constructor(t, e, i, s, n, o) {
        this.logger = t;
        this.events = e;
        this.history = i;
        this.location = s;
        this.window = n;
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
    pushState(t, e, i) {
        i = this.addBaseHref(i);
        try {
            const s = JSON.stringify(t);
            this.logger.trace(`pushState(state:${s},title:'${e}',url:'${i}')`);
        } catch (t) {
            this.logger.warn(`pushState(state:NOT_SERIALIZABLE,title:'${e}',url:'${i}')`);
        }
        this.history.pushState(t, e, i);
    }
    replaceState(t, e, i) {
        i = this.addBaseHref(i);
        try {
            const s = JSON.stringify(t);
            this.logger.trace(`replaceState(state:${s},title:'${e}',url:'${i}')`);
        } catch (t) {
            this.logger.warn(`replaceState(state:NOT_SERIALIZABLE,title:'${e}',url:'${i}')`);
        }
        this.history.replaceState(t, e, i);
    }
    getPath() {
        const {pathname: t, search: e, hash: i} = this.location;
        const s = this.removeBaseHref(`${t}${N(e)}${i}`);
        this.logger.trace(`getPath() -> '${s}'`);
        return s;
    }
    currentPathEquals(t) {
        const e = this.getPath() === this.removeBaseHref(t);
        this.logger.trace(`currentPathEquals(path:'${t}') -> ${e}`);
        return e;
    }
    addBaseHref(t) {
        const e = t;
        let i;
        let s = this.baseHref.href;
        if (s.endsWith("/")) s = s.slice(0, -1);
        if (0 === s.length) i = t; else {
            if (t.startsWith("/")) t = t.slice(1);
            i = `${s}/${t}`;
        }
        this.logger.trace(`addBaseHref(path:'${e}') -> '${i}'`);
        return i;
    }
    removeBaseHref(t) {
        const e = t;
        const i = this.baseHref.pathname;
        if (t.startsWith(i)) t = t.slice(i.length);
        t = I(t);
        this.logger.trace(`removeBaseHref(path:'${e}') -> '${t}'`);
        return t;
    }
};

$([ e.bound ], C.prototype, "onPopState", null);

$([ e.bound ], C.prototype, "onHashChange", null);

C = $([ E(0, e.ILogger), E(1, R), E(2, i.IHistory), E(3, i.ILocation), E(4, i.IWindow), E(5, S) ], C);

function I(t) {
    let e;
    let i;
    let s;
    if ((s = t.indexOf("?")) >= 0 || (s = t.indexOf("#")) >= 0) {
        e = t.slice(0, s);
        i = t.slice(s);
    } else {
        e = t;
        i = "";
    }
    if (e.endsWith("/")) e = e.slice(0, -1); else if (e.endsWith("/index.html")) e = e.slice(0, -11);
    return `${e}${i}`;
}

function N(t) {
    return t.length > 0 && !t.startsWith("?") ? `?${t}` : t;
}

const A = [ "?", "#", "/", "+", "(", ")", ".", "@", "!", "=", ",", "&", "'", "~", ";" ];

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
        const e = this.rest;
        return t.some((function(t) {
            return e.startsWith(t);
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
        const e = this.buffers;
        const i = e[t];
        e[t] = "";
        return i;
    }
    discard() {
        this.buffers[--this.bufferIndex] = "";
    }
    append(t) {
        const e = this.bufferIndex;
        const i = this.buffers;
        for (let s = 0; s < e; ++s) i[s] += t;
    }
}

exports.ExpressionKind = void 0;

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
})(exports.ExpressionKind || (exports.ExpressionKind = {}));

const T = new Map;

const V = new Map;

class RouteExpression {
    constructor(t, e, i, s, n, o) {
        this.raw = t;
        this.isAbsolute = e;
        this.root = i;
        this.queryParams = s;
        this.fragment = n;
        this.fragmentIsRoute = o;
    }
    get kind() {
        return 0;
    }
    static parse(t, e) {
        const i = e ? T : V;
        let s = i.get(t);
        if (void 0 === s) i.set(t, s = RouteExpression.$parse(t, e));
        return s;
    }
    static $parse(t, e) {
        let i;
        const s = t.indexOf("#");
        if (s >= 0) {
            const n = t.slice(s + 1);
            i = decodeURIComponent(n);
            if (e) t = i; else t = t.slice(0, s);
        } else {
            if (e) t = "";
            i = null;
        }
        let n = null;
        const o = t.indexOf("?");
        if (o >= 0) {
            const e = t.slice(o + 1);
            t = t.slice(0, o);
            n = new URLSearchParams(e);
        }
        if ("" === t) return new RouteExpression("", false, SegmentExpression.EMPTY, null != n ? Object.freeze(n) : Z, i, e);
        const r = new ParserState(t);
        r.record();
        const a = r.consumeOptional("/");
        const h = CompositeSegmentExpression.parse(r);
        r.ensureDone();
        const c = r.playback();
        return new RouteExpression(c, a, h, null != n ? Object.freeze(n) : Z, i, e);
    }
    toInstructionTree(t) {
        return new ViewportInstructionTree(t, this.isAbsolute, this.root.toInstructions(0, 0), c(this.queryParams, t.queryParams, true), this.fragment);
    }
    toString() {
        return this.raw;
    }
}

class CompositeSegmentExpression {
    constructor(t, e) {
        this.raw = t;
        this.siblings = e;
    }
    get kind() {
        return 1;
    }
    static parse(t) {
        t.record();
        const e = t.consumeOptional("+");
        const i = [];
        do {
            i.push(ScopedSegmentExpression.parse(t));
        } while (t.consumeOptional("+"));
        if (!e && 1 === i.length) {
            t.discard();
            return i[0];
        }
        const s = t.playback();
        return new CompositeSegmentExpression(s, i);
    }
    toInstructions(t, e) {
        switch (this.siblings.length) {
          case 0:
            return [];

          case 1:
            return this.siblings[0].toInstructions(t, e);

          case 2:
            return [ ...this.siblings[0].toInstructions(t, 0), ...this.siblings[1].toInstructions(0, e) ];

          default:
            return [ ...this.siblings[0].toInstructions(t, 0), ...this.siblings.slice(1, -1).flatMap((function(t) {
                return t.toInstructions(0, 0);
            })), ...this.siblings[this.siblings.length - 1].toInstructions(0, e) ];
        }
    }
    toString() {
        return this.raw;
    }
}

class ScopedSegmentExpression {
    constructor(t, e, i) {
        this.raw = t;
        this.left = e;
        this.right = i;
    }
    get kind() {
        return 2;
    }
    static parse(t) {
        t.record();
        const e = SegmentGroupExpression.parse(t);
        if (t.consumeOptional("/")) {
            const i = ScopedSegmentExpression.parse(t);
            const s = t.playback();
            return new ScopedSegmentExpression(s, e, i);
        }
        t.discard();
        return e;
    }
    toInstructions(t, e) {
        const i = this.left.toInstructions(t, 0);
        const s = this.right.toInstructions(0, e);
        let n = i[i.length - 1];
        while (n.children.length > 0) n = n.children[n.children.length - 1];
        n.children.push(...s);
        return i;
    }
    toString() {
        return this.raw;
    }
}

class SegmentGroupExpression {
    constructor(t, e) {
        this.raw = t;
        this.expression = e;
    }
    get kind() {
        return 3;
    }
    static parse(t) {
        t.record();
        if (t.consumeOptional("(")) {
            const e = CompositeSegmentExpression.parse(t);
            t.consume(")");
            const i = t.playback();
            return new SegmentGroupExpression(i, e);
        }
        t.discard();
        return SegmentExpression.parse(t);
    }
    toInstructions(t, e) {
        return this.expression.toInstructions(t + 1, e + 1);
    }
    toString() {
        return this.raw;
    }
}

class SegmentExpression {
    constructor(t, e, i, s, n) {
        this.raw = t;
        this.component = e;
        this.action = i;
        this.viewport = s;
        this.scoped = n;
    }
    get kind() {
        return 4;
    }
    static get EMPTY() {
        return new SegmentExpression("", ComponentExpression.EMPTY, ActionExpression.EMPTY, ViewportExpression.EMPTY, true);
    }
    static parse(t) {
        t.record();
        const e = ComponentExpression.parse(t);
        const i = ActionExpression.parse(t);
        const s = ViewportExpression.parse(t);
        const n = !t.consumeOptional("!");
        const o = t.playback();
        return new SegmentExpression(o, e, i, s, n);
    }
    toInstructions(t, e) {
        return [ ViewportInstruction.create({
            component: this.component.name,
            params: this.component.parameterList.toObject(),
            viewport: this.viewport.name,
            open: t,
            close: e
        }) ];
    }
    toString() {
        return this.raw;
    }
}

class ComponentExpression {
    constructor(t, e, i) {
        this.raw = t;
        this.name = e;
        this.parameterList = i;
        switch (e.charAt(0)) {
          case ":":
            this.isParameter = true;
            this.isStar = false;
            this.isDynamic = true;
            this.parameterName = e.slice(1);
            break;

          case "*":
            this.isParameter = false;
            this.isStar = true;
            this.isDynamic = true;
            this.parameterName = e.slice(1);
            break;

          default:
            this.isParameter = false;
            this.isStar = false;
            this.isDynamic = false;
            this.parameterName = e;
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
        } else while (!t.done && !t.startsWith(...A)) t.advance();
        const e = decodeURIComponent(t.playback());
        if (0 === e.length) t.expect("component name");
        const i = ParameterListExpression.parse(t);
        const s = t.playback();
        return new ComponentExpression(s, e, i);
    }
    toString() {
        return this.raw;
    }
}

class ActionExpression {
    constructor(t, e, i) {
        this.raw = t;
        this.name = e;
        this.parameterList = i;
    }
    get kind() {
        return 6;
    }
    static get EMPTY() {
        return new ActionExpression("", "", ParameterListExpression.EMPTY);
    }
    static parse(t) {
        t.record();
        let e = "";
        if (t.consumeOptional(".")) {
            t.record();
            while (!t.done && !t.startsWith(...A)) t.advance();
            e = decodeURIComponent(t.playback());
            if (0 === e.length) t.expect("method name");
        }
        const i = ParameterListExpression.parse(t);
        const s = t.playback();
        return new ActionExpression(s, e, i);
    }
    toString() {
        return this.raw;
    }
}

class ViewportExpression {
    constructor(t, e) {
        this.raw = t;
        this.name = e;
    }
    get kind() {
        return 7;
    }
    static get EMPTY() {
        return new ViewportExpression("", "");
    }
    static parse(t) {
        t.record();
        let e = "";
        if (t.consumeOptional("@")) {
            t.record();
            while (!t.done && !t.startsWith(...A)) t.advance();
            e = decodeURIComponent(t.playback());
            if (0 === e.length) t.expect("viewport name");
        }
        const i = t.playback();
        return new ViewportExpression(i, e);
    }
    toString() {
        return this.raw;
    }
}

class ParameterListExpression {
    constructor(t, e) {
        this.raw = t;
        this.expressions = e;
    }
    get kind() {
        return 8;
    }
    static get EMPTY() {
        return new ParameterListExpression("", []);
    }
    static parse(t) {
        t.record();
        const e = [];
        if (t.consumeOptional("(")) {
            do {
                e.push(ParameterExpression.parse(t, e.length));
                if (!t.consumeOptional(",")) break;
            } while (!t.done && !t.startsWith(")"));
            t.consume(")");
        }
        const i = t.playback();
        return new ParameterListExpression(i, e);
    }
    toObject() {
        const t = {};
        for (const e of this.expressions) t[e.key] = e.value;
        return t;
    }
    toString() {
        return this.raw;
    }
}

class ParameterExpression {
    constructor(t, e, i) {
        this.raw = t;
        this.key = e;
        this.value = i;
    }
    get kind() {
        return 9;
    }
    static get EMPTY() {
        return new ParameterExpression("", "", "");
    }
    static parse(t, e) {
        t.record();
        t.record();
        while (!t.done && !t.startsWith(...A)) t.advance();
        let i = decodeURIComponent(t.playback());
        if (0 === i.length) t.expect("parameter key");
        let s;
        if (t.consumeOptional("=")) {
            t.record();
            while (!t.done && !t.startsWith(...A)) t.advance();
            s = decodeURIComponent(t.playback());
            if (0 === s.length) t.expect("parameter value");
        } else {
            s = i;
            i = e.toString();
        }
        const n = t.playback();
        return new ParameterExpression(n, i, s);
    }
    toString() {
        return this.raw;
    }
}

const P = Object.freeze({
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
    constructor(t, e, i) {
        this.viewportName = t;
        this.componentName = e;
        this.resolution = i;
    }
    toString() {
        return `VR(viewport:'${this.viewportName}',component:'${this.componentName}',resolution:'${this.resolution}')`;
    }
}

const U = new WeakMap;

class ViewportAgent {
    constructor(t, i, s) {
        this.viewport = t;
        this.hostController = i;
        this.ctx = s;
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
        this.logger = s.container.get(e.ILogger).scopeTo(`ViewportAgent<${s.friendlyPath}>`);
        this.logger.trace(`constructor()`);
    }
    get $state() {
        return M(this.state);
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
    static for(t, e) {
        let s = U.get(t);
        if (void 0 === s) {
            const n = i.Controller.getCachedOrThrow(t);
            U.set(t, s = new ViewportAgent(t, n, e));
        }
        return s;
    }
    activateFromViewport(t, e, i) {
        const s = this.currTransition;
        if (null !== s) O(s);
        this.isActive = true;
        switch (this.nextState) {
          case 64:
            switch (this.currState) {
              case 8192:
                this.logger.trace(`activateFromViewport() - nothing to activate at %s`, this);
                return;

              case 4096:
                this.logger.trace(`activateFromViewport() - activating existing componentAgent at %s`, this);
                return this.curCA.activate(t, e, i);

              default:
                this.unexpectedState("activateFromViewport 1");
            }

          case 2:
            {
                if (null === this.currTransition) throw new Error(`Unexpected viewport activation outside of a transition context at ${this}`);
                if ("static" !== this.$resolution) throw new Error(`Unexpected viewport activation at ${this}`);
                this.logger.trace(`activateFromViewport() - running ordinary activate at %s`, this);
                const e = Batch.start((e => {
                    this.activate(t, this.currTransition, e);
                }));
                const i = new Promise((t => {
                    e.continueWith((() => {
                        t();
                    }));
                }));
                return e.start().done ? void 0 : i;
            }

          default:
            this.unexpectedState("activateFromViewport 2");
        }
    }
    deactivateFromViewport(t, e, i) {
        const s = this.currTransition;
        if (null !== s) O(s);
        this.isActive = false;
        switch (this.currState) {
          case 8192:
            this.logger.trace(`deactivateFromViewport() - nothing to deactivate at %s`, this);
            return;

          case 4096:
            this.logger.trace(`deactivateFromViewport() - deactivating existing componentAgent at %s`, this);
            return this.curCA.deactivate(t, e, i);

          case 128:
            this.logger.trace(`deactivateFromViewport() - already deactivating at %s`, this);
            return;

          default:
            {
                if (null === this.currTransition) throw new Error(`Unexpected viewport deactivation outside of a transition context at ${this}`);
                this.logger.trace(`deactivateFromViewport() - running ordinary deactivate at %s`, this);
                const e = Batch.start((e => {
                    this.deactivate(t, this.currTransition, e);
                }));
                const i = new Promise((t => {
                    e.continueWith((() => {
                        t();
                    }));
                }));
                return e.start().done ? void 0 : i;
            }
        }
    }
    handles(t) {
        if (!this.isAvailable(t.resolution)) return false;
        const e = this.viewport;
        const i = t.viewportName;
        const s = e.name;
        if (i !== ht && s !== ht && s !== i) {
            this.logger.trace(`handles(req:%s) -> false (viewport names don't match '%s')`, t, s);
            return false;
        }
        const n = e.usedBy;
        if (n.length > 0 && !n.split(",").includes(t.componentName)) {
            this.logger.trace(`handles(req:%s) -> false (componentName not included in usedBy)`, t);
            return false;
        }
        this.logger.trace(`viewport '%s' handles(req:%s) -> true`, s, t);
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
    canUnload(t, e) {
        if (null === this.currTransition) this.currTransition = t;
        O(t);
        if (true !== t.guardsResult) return;
        e.push();
        Batch.start((e => {
            this.logger.trace(`canUnload() - invoking on children at %s`, this);
            for (const i of this.currNode.children) i.context.vpa.canUnload(t, e);
        })).continueWith((e => {
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
                    e.push();
                    Batch.start((e => {
                        this.logger.trace(`canUnload() - finished invoking on children, now invoking on own component at %s`, this);
                        this.curCA.canUnload(t, this.nextNode, e);
                    })).continueWith((() => {
                        this.logger.trace(`canUnload() - finished at %s`, this);
                        this.currState = 1024;
                        e.pop();
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
            e.pop();
        })).start();
    }
    canLoad(t, i) {
        if (null === this.currTransition) this.currTransition = t;
        O(t);
        if (true !== t.guardsResult) return;
        i.push();
        Batch.start((e => {
            switch (this.nextState) {
              case 32:
                this.logger.trace(`canLoad() - invoking on new component at %s`, this);
                this.nextState = 16;
                switch (this.$plan) {
                  case "none":
                    return;

                  case "invoke-lifecycles":
                    return this.curCA.canLoad(t, this.nextNode, e);

                  case "replace":
                    this.nextCA = this.nextNode.context.createComponentAgent(this.hostController, this.nextNode);
                    return this.nextCA.canLoad(t, this.nextNode, e);
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
                void e.onResolve(F(i), (() => {
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
                    void e.onResolve(F(i), (() => {
                        t.pop();
                    }));
                    return;
                }
            }
        })).continueWith((e => {
            switch (this.nextState) {
              case 16:
                this.logger.trace(`canLoad() - finished own component, now invoking on children at %s`, this);
                this.nextState = 8;
                for (const i of this.nextNode.children) i.context.vpa.canLoad(t, e);
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
    unload(t, e) {
        O(t);
        L(this, t);
        e.push();
        Batch.start((e => {
            this.logger.trace(`unload() - invoking on children at %s`, this);
            for (const i of this.currNode.children) i.context.vpa.unload(t, e);
        })).continueWith((i => {
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
                    i.push();
                    Batch.start((e => {
                        this.logger.trace(`unload() - finished invoking on children, now invoking on own component at %s`, this);
                        this.curCA.unload(t, this.nextNode, e);
                    })).continueWith((() => {
                        this.logger.trace(`unload() - finished at %s`, this);
                        this.currState = 256;
                        i.pop();
                    })).start();
                    return;
                }

              case 8192:
                this.logger.trace(`unload() - nothing to unload at %s`, this);
                for (const i of this.currNode.children) i.context.vpa.unload(t, e);
                return;

              default:
                this.unexpectedState("unload");
            }
        })).continueWith((() => {
            e.pop();
        })).start();
    }
    load(t, e) {
        O(t);
        L(this, t);
        e.push();
        Batch.start((e => {
            switch (this.nextState) {
              case 8:
                this.logger.trace(`load() - invoking on new component at %s`, this);
                this.nextState = 4;
                switch (this.$plan) {
                  case "none":
                    return;

                  case "invoke-lifecycles":
                    return this.curCA.load(t, this.nextNode, e);

                  case "replace":
                    return this.nextCA.load(t, this.nextNode, e);
                }

              case 64:
                this.logger.trace(`load() - nothing to load at %s`, this);
                return;

              default:
                this.unexpectedState("load");
            }
        })).continueWith((e => {
            switch (this.nextState) {
              case 4:
                this.logger.trace(`load() - finished own component, now invoking on children at %s`, this);
                this.nextState = 2;
                for (const i of this.nextNode.children) i.context.vpa.load(t, e);
                return;

              case 64:
                return;

              default:
                this.unexpectedState("load");
            }
        })).continueWith((() => {
            this.logger.trace(`load() - finished at %s`, this);
            e.pop();
        })).start();
    }
    deactivate(t, e, i) {
        O(e);
        L(this, e);
        i.push();
        switch (this.currState) {
          case 256:
            this.logger.trace(`deactivate() - invoking on existing component at %s`, this);
            this.currState = 128;
            switch (this.$plan) {
              case "none":
              case "invoke-lifecycles":
                i.pop();
                return;

              case "replace":
                {
                    const s = this.hostController;
                    const n = this.viewport.stateful ? 0 : 16;
                    e.run((() => this.curCA.deactivate(t, s, n)), (() => {
                        i.pop();
                    }));
                }
            }
            return;

          case 8192:
            this.logger.trace(`deactivate() - nothing to deactivate at %s`, this);
            i.pop();
            return;

          case 128:
            this.logger.trace(`deactivate() - already deactivating at %s`, this);
            i.pop();
            return;

          default:
            this.unexpectedState("deactivate");
        }
    }
    activate(t, e, i) {
        O(e);
        L(this, e);
        i.push();
        if (32 === this.nextState && "dynamic" === this.$resolution) {
            this.logger.trace(`activate() - invoking canLoad(), load() and activate() on new component due to resolution 'dynamic' at %s`, this);
            Batch.start((t => {
                this.canLoad(e, t);
            })).continueWith((t => {
                this.load(e, t);
            })).continueWith((i => {
                this.activate(t, e, i);
            })).continueWith((() => {
                i.pop();
            })).start();
            return;
        }
        switch (this.nextState) {
          case 2:
            this.logger.trace(`activate() - invoking on existing component at %s`, this);
            this.nextState = 1;
            Batch.start((i => {
                switch (this.$plan) {
                  case "none":
                  case "invoke-lifecycles":
                    return;

                  case "replace":
                    {
                        const s = this.hostController;
                        const n = 0;
                        e.run((() => {
                            i.push();
                            return this.nextCA.activate(t, s, n);
                        }), (() => {
                            i.pop();
                        }));
                    }
                }
            })).continueWith((t => {
                this.processDynamicChildren(e, t);
            })).continueWith((() => {
                i.pop();
            })).start();
            return;

          case 64:
            this.logger.trace(`activate() - nothing to activate at %s`, this);
            i.pop();
            return;

          default:
            this.unexpectedState("activate");
        }
    }
    swap(t, e) {
        if (8192 === this.currState) {
            this.logger.trace(`swap() - running activate on next instead, because there is nothing to deactivate at %s`, this);
            this.activate(null, t, e);
            return;
        }
        if (64 === this.nextState) {
            this.logger.trace(`swap() - running deactivate on current instead, because there is nothing to activate at %s`, this);
            this.deactivate(null, t, e);
            return;
        }
        O(t);
        L(this, t);
        if (!(256 === this.currState && 2 === this.nextState)) this.unexpectedState("swap");
        this.currState = 128;
        this.nextState = 1;
        switch (this.$plan) {
          case "none":
          case "invoke-lifecycles":
            {
                this.logger.trace(`swap() - skipping this level and swapping children instead at %s`, this);
                const i = o(this.nextNode.children, this.currNode.children);
                for (const s of i) s.context.vpa.swap(t, e);
                return;
            }

          case "replace":
            {
                this.logger.trace(`swap() - running normally at %s`, this);
                const i = this.hostController;
                const s = this.curCA;
                const n = this.nextCA;
                const o = this.viewport.stateful ? 0 : 16;
                const r = 0;
                e.push();
                Batch.start((e => {
                    t.run((() => {
                        e.push();
                        return s.deactivate(null, i, o);
                    }), (() => {
                        e.pop();
                    }));
                })).continueWith((e => {
                    t.run((() => {
                        e.push();
                        return n.activate(null, i, r);
                    }), (() => {
                        e.pop();
                    }));
                })).continueWith((e => {
                    this.processDynamicChildren(t, e);
                })).continueWith((() => {
                    e.pop();
                })).start();
                return;
            }
        }
    }
    processDynamicChildren(t, e) {
        this.logger.trace(`processDynamicChildren() - %s`, this);
        const i = this.nextNode;
        t.run((() => {
            e.push();
            return H(i);
        }), (i => {
            Batch.start((e => {
                for (const s of i) t.run((() => {
                    e.push();
                    return s.context.vpa.canLoad(t, e);
                }), (() => {
                    e.pop();
                }));
            })).continueWith((e => {
                for (const s of i) t.run((() => {
                    e.push();
                    return s.context.vpa.load(t, e);
                }), (() => {
                    e.pop();
                }));
            })).continueWith((e => {
                for (const s of i) t.run((() => {
                    e.push();
                    return s.context.vpa.activate(null, t, e);
                }), (() => {
                    e.pop();
                }));
            })).continueWith((() => {
                e.pop();
            })).start();
        }));
    }
    scheduleUpdate(t, e) {
        var i, s;
        switch (this.nextState) {
          case 64:
            this.nextNode = e;
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
        const n = null !== (s = null === (i = this.curCA) || void 0 === i ? void 0 : i.routeNode) && void 0 !== s ? s : null;
        if (null === n || n.component !== e.component) this.$plan = "replace"; else {
            const t = e.context.definition.config.transitionPlan;
            if ("function" === typeof t) this.$plan = t(n, e); else this.$plan = t;
        }
        this.logger.trace(`scheduleUpdate(next:%s) - plan set to '%s'`, e, this.$plan);
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
            O(this.currTransition);
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

function L(t, e) {
    if (true !== e.guardsResult) throw new Error(`Unexpected guardsResult ${e.guardsResult} at ${t}`);
}

function O(t) {
    if (void 0 !== t.error) throw t.error;
}

var j;

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
})(j || (j = {}));

const D = new Map;

function M(t) {
    let e = D.get(t);
    if (void 0 === e) D.set(t, e = B(t));
    return e;
}

function B(t) {
    const e = [];
    if (8192 === (8192 & t)) e.push("currIsEmpty");
    if (4096 === (4096 & t)) e.push("currIsActive");
    if (2048 === (2048 & t)) e.push("currCanUnload");
    if (1024 === (1024 & t)) e.push("currCanUnloadDone");
    if (512 === (512 & t)) e.push("currUnload");
    if (256 === (256 & t)) e.push("currUnloadDone");
    if (128 === (128 & t)) e.push("currDeactivate");
    if (64 === (64 & t)) e.push("nextIsEmpty");
    if (32 === (32 & t)) e.push("nextIsScheduled");
    if (16 === (16 & t)) e.push("nextCanLoad");
    if (8 === (8 & t)) e.push("nextCanLoadDone");
    if (4 === (4 & t)) e.push("nextLoad");
    if (2 === (2 & t)) e.push("nextLoadDone");
    if (1 === (1 & t)) e.push("nextActivate");
    return e.join("|");
}

let q = 0;

class RouteNode {
    constructor(t, e, i, s, n, o, r, a, h, c, u, l, d, f, p) {
        var v;
        this.id = t;
        this.path = e;
        this.finalPath = i;
        this.context = s;
        this.originalInstruction = n;
        this.instruction = o;
        this.params = r;
        this.queryParams = a;
        this.fragment = h;
        this.data = c;
        this.viewport = u;
        this.title = l;
        this.component = d;
        this.children = f;
        this.residue = p;
        this.version = 1;
        null !== (v = this.originalInstruction) && void 0 !== v ? v : this.originalInstruction = o;
    }
    get root() {
        return this.tree.root;
    }
    static create(t) {
        var e, i, s, n, o, r, a, h, c;
        const {[dt]: u, ...l} = null !== (e = t.params) && void 0 !== e ? e : {};
        return new RouteNode(++q, t.path, t.finalPath, t.context, null !== (i = t.originalInstruction) && void 0 !== i ? i : t.instruction, t.instruction, l, null !== (s = t.queryParams) && void 0 !== s ? s : Z, null !== (n = t.fragment) && void 0 !== n ? n : null, null !== (o = t.data) && void 0 !== o ? o : {}, null !== (r = t.viewport) && void 0 !== r ? r : null, null !== (a = t.title) && void 0 !== a ? a : null, t.component, null !== (h = t.children) && void 0 !== h ? h : [], null !== (c = t.residue) && void 0 !== c ? c : []);
    }
    contains(t) {
        var e, i;
        if (this.context === t.options.context) {
            const s = this.children;
            const n = t.children;
            for (let t = 0, o = s.length; t < o; ++t) for (let r = 0, a = n.length; r < a; ++r) if (t + r < o && (null !== (i = null === (e = s[t + r].originalInstruction) || void 0 === e ? void 0 : e.contains(n[r])) && void 0 !== i ? i : false)) {
                if (r + 1 === a) return true;
            } else break;
        }
        return this.children.some((function(e) {
            return e.contains(t);
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
        const e = [ ...this.children.map((e => e.getTitle(t))), this.getTitlePart() ].filter((t => null !== t));
        if (0 === e.length) return null;
        return e.join(t);
    }
    getTitlePart() {
        if ("function" === typeof this.title) return this.title.call(void 0, this);
        return this.title;
    }
    computeAbsolutePath() {
        if (this.context.isRoot) return "";
        const t = this.context.parent.node.computeAbsolutePath();
        const e = this.instruction.toUrlComponent(false);
        if (t.length > 0) {
            if (e.length > 0) return [ t, e ].join("/");
            return t;
        }
        return e;
    }
    setTree(t) {
        this.tree = t;
        for (const e of this.children) e.setTree(t);
    }
    finalizeInstruction() {
        const t = this.children.map((t => t.finalizeInstruction()));
        const e = this.instruction.clone();
        e.children.splice(0, e.children.length, ...t);
        return this.instruction = e;
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
        var t, e, i, s, n, o;
        const r = [];
        const a = null !== (i = null === (e = null === (t = this.context) || void 0 === t ? void 0 : t.definition.component) || void 0 === e ? void 0 : e.name) && void 0 !== i ? i : "";
        if (a.length > 0) r.push(`c:'${a}'`);
        const h = null !== (n = null === (s = this.context) || void 0 === s ? void 0 : s.definition.config.path) && void 0 !== n ? n : "";
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
    constructor(t, e, i, s) {
        this.options = t;
        this.queryParams = e;
        this.fragment = i;
        this.root = s;
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

function z(t, i, s, n) {
    t.trace(`updateNode(ctx:%s,node:%s)`, s, n);
    n.queryParams = i.queryParams;
    n.fragment = i.fragment;
    if (!n.context.isRoot) n.context.vpa.scheduleUpdate(n.tree.options, n);
    if (n.context === s) {
        n.clearChildren();
        return e.onResolve(e.resolveAll(...i.children.map((e => W(t, n, e)))), (() => e.resolveAll(...s.getAvailableViewportAgents("dynamic").map((e => {
            const i = ViewportInstruction.create({
                component: e.viewport.default,
                viewport: e.viewport.name
            });
            return W(t, n, i);
        })))));
    }
    return e.resolveAll(...n.children.map((e => z(t, i, s, e))));
}

function F(t) {
    const i = t.context;
    const s = i.container.get(e.ILogger).scopeTo("RouteTree");
    const n = i.resolved instanceof Promise ? " - awaiting promise" : "";
    s.trace(`processResidue(node:%s)${n}`, t);
    return e.onResolve(i.resolved, (() => e.resolveAll(...t.residue.splice(0).map((e => W(s, t, e))), ...i.getAvailableViewportAgents("static").map((e => {
        const i = ViewportInstruction.create({
            component: e.viewport.default,
            viewport: e.viewport.name
        });
        return W(s, t, i);
    })))));
}

function H(t) {
    const i = t.context;
    const s = i.container.get(e.ILogger).scopeTo("RouteTree");
    const n = i.resolved instanceof Promise ? " - awaiting promise" : "";
    s.trace(`getDynamicChildren(node:%s)${n}`, t);
    return e.onResolve(i.resolved, (() => {
        const n = t.children.slice();
        return e.onResolve(e.resolveAll(...t.residue.splice(0).map((e => W(s, t, e)))), (() => e.onResolve(e.resolveAll(...i.getAvailableViewportAgents("dynamic").map((e => {
            const i = ViewportInstruction.create({
                component: e.viewport.default,
                viewport: e.viewport.name
            });
            return W(s, t, i);
        }))), (() => t.children.filter((t => !n.includes(t)))))));
    }));
}

function W(t, i, s) {
    var n, o, r;
    t.trace(`createAndAppendNodes(node:%s,vi:%s`, i, s);
    switch (s.component.type) {
      case 0:
        switch (s.component.value) {
          case "..":
            i = null !== (o = null === (n = i.context.parent) || void 0 === n ? void 0 : n.node) && void 0 !== o ? o : i;
            i.clearChildren();

          case ".":
            return e.resolveAll(...s.children.map((e => W(t, i, e))));

          default:
            {
                t.trace(`createAndAppendNodes invoking createNode`);
                const e = G(t, i, s);
                if (null === e) return;
                return _(t, i, e);
            }
        }

      case 4:
      case 2:
        {
            const n = i.context;
            const o = RouteDefinition.resolve(s.component.value, n.definition, null);
            const {vi: a, query: h} = n.generateViewportInstruction({
                component: o,
                params: null !== (r = s.params) && void 0 !== r ? r : e.emptyObject
            });
            i.tree.queryParams = c(i.tree.queryParams, h, true);
            a.children.push(...s.children);
            const u = Y(t, i, a, a.recognizedRoute, s);
            return _(t, i, u);
        }
    }
}

function G(t, e, i) {
    var s, n;
    const o = e.context;
    const r = i.clone();
    let a = i.recognizedRoute;
    if (null !== a) return Y(t, e, i, a, r);
    if (0 === i.children.length) {
        const s = o.generateViewportInstruction(i);
        if (null !== s) {
            e.tree.queryParams = c(e.tree.queryParams, s.query, true);
            const n = s.vi;
            n.children.push(...i.children);
            return Y(t, e, n, n.recognizedRoute, i);
        }
    }
    let h = 0;
    let u = i.component.value;
    let l = i;
    while (1 === l.children.length) {
        l = l.children[0];
        if (0 === l.component.type) {
            ++h;
            u = `${u}/${l.component.value}`;
        } else break;
    }
    a = o.recognize(u);
    t.trace("createNode recognized route: %s", a);
    const d = null !== (s = null === a || void 0 === a ? void 0 : a.residue) && void 0 !== s ? s : null;
    t.trace("createNode residue:", d);
    const f = null === d;
    if (null === a || d === u) {
        const s = i.component.value;
        if ("" === s) return null;
        let n = i.viewport;
        if (null === n || 0 === n.length) n = ht;
        const r = o.getFallbackViewportAgent("dynamic", n);
        const a = null !== r ? r.viewport.fallback : o.definition.fallback;
        if (null === a) throw new Error(`Neither the route '${s}' matched any configured route at '${o.friendlyPath}' nor a fallback is configured for the viewport '${n}' - did you forget to add '${s}' to the routes list of the route decorator of '${o.component.name}'?`);
        t.trace(`Fallback is set to '${a}'. Looking for a recognized route.`);
        const h = o.childRoutes.find((t => t.id === a));
        if (void 0 !== h) return J(t, h, e, i);
        t.trace(`No route definition for the fallback '${a}' is found; trying to recognize the route.`);
        const c = o.recognize(a, true);
        if (null !== c) return Y(t, e, i, c, null);
        t.trace(`The fallback '${a}' is not recognized as a route; treating as custom element name.`);
        return J(t, RouteDefinition.resolve(a, o.definition, null, o), e, i);
    }
    a.residue = null;
    i.component.value = f ? u : u.slice(0, -(d.length + 1));
    for (let t = 0; t < h; ++t) {
        const t = i.children[0];
        if (null !== (n = null === d || void 0 === d ? void 0 : d.startsWith(t.component.value)) && void 0 !== n ? n : false) break;
        i.children = t.children;
    }
    t.trace("createNode after adjustment vi:%s", i);
    return Y(t, e, i, a, r);
}

function Y(t, i, s, n, o, r = n.route.endpoint.route) {
    const a = i.context;
    const h = i.tree;
    return e.onResolve(r.handler, (e => {
        var c, u, l;
        r.handler = e;
        t.trace(`creatingConfiguredNode(rd:%s, vi:%s)`, e, s);
        if (null === e.redirectTo) {
            const l = (null !== (u = null === (c = s.viewport) || void 0 === c ? void 0 : c.length) && void 0 !== u ? u : 0) > 0 ? s.viewport : e.viewport;
            const d = e.component;
            const f = a.resolveViewportAgent(new ViewportRequest(l, d.name, h.options.resolutionMode));
            const p = a.container.get(tt);
            const v = p.getRouteContext(f, d, null, f.hostController.container, a.definition);
            t.trace("createConfiguredNode setting the context node");
            const g = v.node = RouteNode.create({
                path: n.route.endpoint.route.path,
                finalPath: r.path,
                context: v,
                instruction: s,
                originalInstruction: o,
                params: {
                    ...n.route.params
                },
                queryParams: h.queryParams,
                fragment: h.fragment,
                data: e.data,
                viewport: l,
                component: d,
                title: e.config.title,
                residue: [ ...null === n.residue ? [] : [ ViewportInstruction.create(n.residue) ], ...s.children ]
            });
            g.setTree(i.tree);
            t.trace(`createConfiguredNode(vi:%s) -> %s`, s, g);
            return g;
        }
        const d = RouteExpression.parse(r.path, false);
        const f = RouteExpression.parse(e.redirectTo, false);
        let p;
        let v;
        const g = [];
        switch (d.root.kind) {
          case 2:
          case 4:
            p = d.root;
            break;

          default:
            throw new Error(`Unexpected expression kind ${d.root.kind}`);
        }
        switch (f.root.kind) {
          case 2:
          case 4:
            v = f.root;
            break;

          default:
            throw new Error(`Unexpected expression kind ${f.root.kind}`);
        }
        let w;
        let m;
        let x = false;
        let $ = false;
        while (!(x && $)) {
            if (x) w = null; else if (4 === p.kind) {
                w = p;
                x = true;
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
            if ($) m = null; else if (4 === v.kind) {
                m = v;
                $ = true;
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
        return Y(t, i, s, n, o, y.route.endpoint.route);
    }));
}

function _(t, i, s) {
    return e.onResolve(s, (e => {
        t.trace(`appendNode($childNode:%s)`, e);
        i.appendChild(e);
        return e.context.vpa.scheduleUpdate(i.tree.options, e);
    }));
}

function J(t, i, n, o) {
    const r = new $RecognizedRoute(new s.RecognizedRoute(new s.Endpoint(new s.ConfigurableRoute(i.path[0], i.caseSensitive, i), []), e.emptyObject), null);
    o.children.length = 0;
    return Y(t, n, o, r, null);
}

const Z = Object.freeze(new URLSearchParams);

function K(e) {
    return t.isObject(e) && true === Object.prototype.hasOwnProperty.call(e, y);
}

function Q(t, e) {
    return {
        ...t,
        [y]: e
    };
}

function X(t, e) {
    if ("function" === typeof e) return e(t);
    return e;
}

class RouterOptions {
    constructor(t, e, i, s, n, o) {
        this.useUrlFragmentHash = t;
        this.useHref = e;
        this.resolutionMode = i;
        this.historyStrategy = s;
        this.sameUrlStrategy = n;
        this.buildTitle = o;
    }
    static get DEFAULT() {
        return RouterOptions.create({});
    }
    static create(t) {
        var e, i, s, n, o, r;
        return new RouterOptions(null !== (e = t.useUrlFragmentHash) && void 0 !== e ? e : false, null !== (i = t.useHref) && void 0 !== i ? i : true, null !== (s = t.resolutionMode) && void 0 !== s ? s : "dynamic", null !== (n = t.historyStrategy) && void 0 !== n ? n : "push", null !== (o = t.sameUrlStrategy) && void 0 !== o ? o : "ignore", null !== (r = t.buildTitle) && void 0 !== r ? r : null);
    }
    getHistoryStrategy(t) {
        return X(t, this.historyStrategy);
    }
    getSameUrlStrategy(t) {
        return X(t, this.sameUrlStrategy);
    }
    stringifyProperties() {
        return [ [ "resolutionMode", "resolution" ], [ "historyStrategy", "history" ], [ "sameUrlStrategy", "sameUrl" ] ].map((([t, e]) => {
            const i = this[t];
            return `${e}:${"function" === typeof i ? i : `'${i}'`}`;
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
    constructor(t, e, i, s, n, o, r) {
        super(t.useUrlFragmentHash, t.useHref, t.resolutionMode, t.historyStrategy, t.sameUrlStrategy, t.buildTitle);
        this.title = e;
        this.titleSeparator = i;
        this.context = s;
        this.queryParams = n;
        this.fragment = o;
        this.state = r;
    }
    static get DEFAULT() {
        return NavigationOptions.create({});
    }
    static create(t) {
        var e, i, s, n, o, r;
        return new NavigationOptions(RouterOptions.create(t), null !== (e = t.title) && void 0 !== e ? e : null, null !== (i = t.titleSeparator) && void 0 !== i ? i : " | ", null !== (s = t.context) && void 0 !== s ? s : null, null !== (n = t.queryParams) && void 0 !== n ? n : null, null !== (o = t.fragment) && void 0 !== o ? o : "", null !== (r = t.state) && void 0 !== r ? r : null);
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
    constructor(t, e, i, s, n, o, r, a, h, c, u, l, d, f, p) {
        this.id = t;
        this.prevInstructions = e;
        this.instructions = i;
        this.finalInstructions = s;
        this.instructionsChanged = n;
        this.trigger = o;
        this.options = r;
        this.managedState = a;
        this.previousRouteTree = h;
        this.routeTree = c;
        this.promise = u;
        this.resolve = l;
        this.reject = d;
        this.guardsResult = f;
        this.error = p;
    }
    static create(t) {
        return new Transition(t.id, t.prevInstructions, t.instructions, t.finalInstructions, t.instructionsChanged, t.trigger, t.options, t.managedState, t.previousRouteTree, t.routeTree, t.promise, t.resolve, t.reject, t.guardsResult, void 0);
    }
    run(t, e) {
        if (true !== this.guardsResult) return;
        try {
            const i = t();
            if (i instanceof Promise) i.then(e).catch((t => {
                this.handleError(t);
            })); else e(i);
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

const tt = e.DI.createInterface("IRouter", (t => t.singleton(exports.Router)));

exports.Router = class Router {
    constructor(t, e, i, s, n) {
        this.container = t;
        this.p = e;
        this.logger = i;
        this.events = s;
        this.locationMgr = n;
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
        this.logger = i.root.scopeTo("Router");
    }
    get ctx() {
        let t = this.t;
        if (null === t) {
            if (!this.container.has(lt, true)) throw new Error(`Root RouteContext is not set. Did you forget to register RouteConfiguration, or try to navigate before calling Aurelia.start()?`);
            t = this.t = this.container.get(lt);
        }
        return t;
    }
    get routeTree() {
        let t = this.i;
        if (null === t) {
            const e = this.ctx;
            t = this.i = new RouteTree(NavigationOptions.create({
                ...this.options
            }), Z, null, RouteNode.create({
                path: "",
                finalPath: "",
                context: e,
                instruction: null,
                component: e.definition.component,
                title: e.definition.config.title
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
    start(t, e) {
        this.options = RouterOptions.create(t);
        this.u = "function" === typeof this.options.buildTitle;
        this.locationMgr.startListening();
        this.locationChangeSubscription = this.events.subscribe("au:router:location-change", (t => {
            this.p.taskQueue.queueTask((() => {
                const e = K(t.state) ? t.state : null;
                const i = NavigationOptions.create({
                    ...this.options,
                    historyStrategy: "replace"
                });
                const s = ViewportInstructionTree.create(t.url, i, this.ctx);
                this.enqueue(s, t.trigger, e, null);
            }));
        }));
        if (!this.navigated && e) return this.load(this.locationMgr.getPath(), {
            historyStrategy: "replace"
        });
    }
    stop() {
        var t;
        this.locationMgr.stopListening();
        null === (t = this.locationChangeSubscription) || void 0 === t ? void 0 : t.dispose();
    }
    load(t, e) {
        const i = this.createViewportInstructions(t, e);
        this.logger.trace("load(instructions:%s)", i);
        return this.enqueue(i, "api", null, null);
    }
    isActive(t, e) {
        const i = this.resolveContext(e);
        const s = t instanceof ViewportInstructionTree ? t : this.createViewportInstructions(t, {
            context: i
        });
        this.logger.trace("isActive(instructions:%s,ctx:%s)", s, i);
        return this.routeTree.contains(s);
    }
    getRouteContext(t, i, s, n, o) {
        const r = n.get(e.ILogger).scopeTo("RouteContext");
        const a = RouteDefinition.resolve("function" === typeof (null === s || void 0 === s ? void 0 : s.getRouteConfig) ? s : i.Type, o, null);
        let h = this.vpaLookup.get(t);
        if (void 0 === h) this.vpaLookup.set(t, h = new WeakMap);
        let c = h.get(a);
        if (void 0 !== c) {
            r.trace(`returning existing RouteContext for %s`, a);
            return c;
        }
        r.trace(`creating new RouteContext for %s`, a);
        const u = n.has(lt, true) ? n.get(lt) : null;
        h.set(a, c = new RouteContext(t, u, i, a, n, this));
        return c;
    }
    createViewportInstructions(t, e) {
        if (t instanceof ViewportInstructionTree) return t;
        if ("string" === typeof t) t = this.locationMgr.removeBaseHref(t);
        return ViewportInstructionTree.create(t, this.getNavigationOptions(e), this.ctx);
    }
    enqueue(t, e, i, s) {
        const n = this.currentTr;
        const o = this.logger;
        if ("api" !== e && "api" === n.trigger && n.instructions.equals(t)) {
            o.debug(`Ignoring navigation triggered by '%s' because it is the same URL as the previous navigation which was triggered by 'api'.`, e);
            return true;
        }
        let r;
        let a;
        let h;
        if (null === s) h = new Promise((function(t, e) {
            r = t;
            a = e;
        })); else {
            o.debug(`Reusing promise/resolve/reject from the previously failed transition %s`, s);
            h = s.promise;
            r = s.resolve;
            a = s.reject;
        }
        const c = this.nextTr = Transition.create({
            id: ++this.navigationId,
            trigger: e,
            managedState: i,
            prevInstructions: n.finalInstructions,
            finalInstructions: t,
            instructionsChanged: !n.finalInstructions.equals(t),
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
            const e = this.nextTr;
            if (null !== e) e.previousRouteTree = c.previousRouteTree; else this.i = c.previousRouteTree;
            throw t;
        }));
    }
    run(t) {
        this.currentTr = t;
        this.nextTr = null;
        this.$ = true;
        let i = this.resolveContext(t.options.context);
        const s = t.instructions.children;
        const n = i.node.children;
        const r = !this.navigated || s.length !== n.length || s.some(((t, e) => {
            var i, s;
            return !(null !== (s = null === (i = n[e]) || void 0 === i ? void 0 : i.originalInstruction.equals(t)) && void 0 !== s ? s : false);
        }));
        const a = r || "reload" === t.options.getSameUrlStrategy(this.instructions);
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
            const s = t.finalInstructions;
            this.logger.trace(`run() - compiling route tree: %s`, s);
            const n = this.ctx;
            const o = t.routeTree;
            o.options = s.options;
            o.queryParams = n.node.tree.queryParams = s.queryParams;
            o.fragment = n.node.tree.fragment = s.fragment;
            const r = i.container.get(e.ILogger).scopeTo("RouteTree");
            if (s.isAbsolute) i = n;
            if (i === n) {
                o.root.setTree(o);
                n.node = o.root;
            }
            const a = i.resolved instanceof Promise ? " - awaiting promise" : "";
            r.trace(`updateRouteTree(rootCtx:%s,rt:%s,vit:%s)${a}`, n, o, s);
            return e.onResolve(i.resolved, (() => z(r, s, i, n.node)));
        }), (() => {
            const e = t.previousRouteTree.root.children;
            const i = t.routeTree.root.children;
            const s = o(e, i);
            Batch.start((i => {
                this.logger.trace(`run() - invoking canUnload on ${e.length} nodes`);
                for (const s of e) s.context.vpa.canUnload(t, i);
            })).continueWith((e => {
                if (true !== t.guardsResult) {
                    e.push();
                    this.cancelNavigation(t);
                }
            })).continueWith((e => {
                this.logger.trace(`run() - invoking canLoad on ${i.length} nodes`);
                for (const s of i) s.context.vpa.canLoad(t, e);
            })).continueWith((e => {
                if (true !== t.guardsResult) {
                    e.push();
                    this.cancelNavigation(t);
                }
            })).continueWith((i => {
                this.logger.trace(`run() - invoking unload on ${e.length} nodes`);
                for (const s of e) s.context.vpa.unload(t, i);
            })).continueWith((e => {
                this.logger.trace(`run() - invoking load on ${i.length} nodes`);
                for (const s of i) s.context.vpa.load(t, e);
            })).continueWith((e => {
                this.logger.trace(`run() - invoking swap on ${s.length} nodes`);
                for (const i of s) i.context.vpa.swap(t, e);
            })).continueWith((() => {
                this.logger.trace(`run() - finalizing transition`);
                s.forEach((function(t) {
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
        const e = t.finalInstructions.toUrl(this.options.useUrlFragmentHash);
        switch (t.options.getHistoryStrategy(this.instructions)) {
          case "none":
            break;

          case "push":
            this.locationMgr.pushState(Q(t.options.state, t.id), this.updateTitle(t), e);
            break;

          case "replace":
            this.locationMgr.replaceState(Q(t.options.state, t.id), this.updateTitle(t), e);
            break;
        }
    }
    getTitle(t) {
        var e, i;
        switch (typeof t.options.title) {
          case "function":
            return null !== (e = t.options.title.call(void 0, t.routeTree.root)) && void 0 !== e ? e : "";

          case "string":
            return t.options.title;

          default:
            return null !== (i = t.routeTree.root.getTitle(t.options.titleSeparator)) && void 0 !== i ? i : "";
        }
    }
    updateTitle(t = this.currentTr) {
        var e;
        const i = this.u ? null !== (e = this.options.buildTitle(t)) && void 0 !== e ? e : "" : this.getTitle(t);
        if (i.length > 0) this.p.document.title = i;
        return this.p.document.title;
    }
    cancelNavigation(t) {
        this.logger.trace(`cancelNavigation(tr:%s)`, t);
        const i = t.previousRouteTree.root.children;
        const s = t.routeTree.root.children;
        const n = o(i, s);
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
        } else void e.onResolve(this.enqueue(t.guardsResult, "api", t.managedState, t), (() => {
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
            } catch (e) {
                t.handleError(e);
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

exports.Router = $([ E(0, e.IContainer), E(1, i.IPlatform), E(2, e.ILogger), E(3, R), E(4, k) ], exports.Router);

class ViewportInstruction {
    constructor(t, e, i, s, n, o, r) {
        this.open = t;
        this.close = e;
        this.recognizedRoute = i;
        this.component = s;
        this.viewport = n;
        this.params = o;
        this.children = r;
    }
    static create(t) {
        var e, i, s, n, o, r, a;
        if (t instanceof ViewportInstruction) return t;
        if (p(t)) {
            const h = TypedNavigationInstruction.create(t.component);
            const c = null !== (i = null === (e = t.children) || void 0 === e ? void 0 : e.map(ViewportInstruction.create)) && void 0 !== i ? i : [];
            return new ViewportInstruction(null !== (s = t.open) && void 0 !== s ? s : 0, null !== (n = t.close) && void 0 !== n ? n : 0, null !== (o = t.recognizedRoute) && void 0 !== o ? o : null, h, null !== (r = t.viewport) && void 0 !== r ? r : null, null !== (a = t.params) && void 0 !== a ? a : null, c);
        }
        const h = TypedNavigationInstruction.create(t);
        return new ViewportInstruction(0, 0, null, h, null, null, []);
    }
    contains(t) {
        const e = this.children;
        const i = t.children;
        if (e.length < i.length) return false;
        if (!this.component.equals(t.component)) return false;
        for (let t = 0, s = i.length; t < s; ++t) if (!e[t].contains(i[t])) return false;
        return true;
    }
    equals(t) {
        const e = this.children;
        const i = t.children;
        if (e.length !== i.length) return false;
        if (!this.component.equals(t.component) || this.viewport !== t.viewport || !x(this.params, t.params)) return false;
        for (let t = 0, s = e.length; t < s; ++t) if (!e[t].equals(i[t])) return false;
        return true;
    }
    clone() {
        return new ViewportInstruction(this.open, this.close, this.recognizedRoute, this.component.clone(), this.viewport, null === this.params ? null : {
            ...this.params
        }, [ ...this.children ]);
    }
    toUrlComponent(t = true) {
        const e = this.component.toUrlComponent();
        const i = null === this.params || 0 === Object.keys(this.params).length ? "" : `(${et(this.params)})`;
        const s = 0 === e.length || null === this.viewport || 0 === this.viewport.length ? "" : `@${this.viewport}`;
        const n = `${"(".repeat(this.open)}${e}${i}${s}${")".repeat(this.close)}`;
        const o = t ? this.children.map((t => t.toUrlComponent())).join("+") : "";
        if (n.length > 0) {
            if (o.length > 0) return [ n, o ].join("/");
            return n;
        }
        return o;
    }
    toString() {
        const t = `c:${this.component}`;
        const e = null === this.viewport || 0 === this.viewport.length ? "" : `viewport:${this.viewport}`;
        const i = 0 === this.children.length ? "" : `children:[${this.children.map(String).join(",")}]`;
        const s = [ t, e, i ].filter(Boolean).join(",");
        return `VPI(${s})`;
    }
}

function et(t) {
    const i = Object.keys(t);
    const s = Array(i.length);
    const n = [];
    const o = [];
    for (const t of i) if (e.isArrayIndex(t)) n.push(Number(t)); else o.push(t);
    for (let e = 0; e < i.length; ++e) {
        const i = n.indexOf(e);
        if (i > -1) {
            s[e] = t[e];
            n.splice(i, 1);
        } else {
            const i = o.shift();
            s[e] = `${i}=${t[i]}`;
        }
    }
    return s.join(",");
}

const it = function() {
    let t = 0;
    const e = new Map;
    return function(i) {
        let s = e.get(i);
        if (void 0 === s) e.set(i, s = ++t);
        return s;
    };
}();

class ViewportInstructionTree {
    constructor(t, e, i, s, n) {
        this.options = t;
        this.isAbsolute = e;
        this.children = i;
        this.queryParams = s;
        this.fragment = n;
    }
    static create(t, i, s) {
        var n, o;
        const r = NavigationOptions.create({
            ...i
        });
        let a = r.context;
        if (!(a instanceof RouteContext) && null != s) a = RouteContext.resolve(s, a);
        const h = null != a;
        if (t instanceof Array) {
            const i = t.length;
            const s = new Array(i);
            const o = new URLSearchParams(null !== (n = r.queryParams) && void 0 !== n ? n : e.emptyObject);
            for (let e = 0; e < i; e++) {
                const i = t[e];
                const n = h ? a.generateViewportInstruction(i) : null;
                if (null !== n) {
                    s[e] = n.vi;
                    c(o, n.query, false);
                } else s[e] = ViewportInstruction.create(i);
            }
            return new ViewportInstructionTree(r, false, s, o, null);
        }
        if ("string" === typeof t) {
            const e = RouteExpression.parse(t, r.useUrlFragmentHash);
            return e.toInstructionTree(r);
        }
        const u = h ? a.generateViewportInstruction(t) : null;
        return null !== u ? new ViewportInstructionTree(r, false, [ u.vi ], new URLSearchParams(null !== (o = u.query) && void 0 !== o ? o : e.emptyObject), null) : new ViewportInstructionTree(r, false, [ ViewportInstruction.create(t) ], Z, null);
    }
    equals(t) {
        const e = this.children;
        const i = t.children;
        if (e.length !== i.length) return false;
        for (let t = 0, s = e.length; t < s; ++t) if (!e[t].equals(i[t])) return false;
        return true;
    }
    toUrl(t = false) {
        var e;
        let i;
        let s;
        if (t) {
            i = "";
            s = `#${this.toPath()}`;
        } else {
            i = this.toPath();
            s = null !== (e = this.fragment) && void 0 !== e ? e : "";
        }
        let n = this.queryParams.toString();
        n = "" === n ? "" : `?${n}`;
        const o = `${i}${s}${n}`;
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

var st;

(function(t) {
    t[t["string"] = 0] = "string";
    t[t["ViewportInstruction"] = 1] = "ViewportInstruction";
    t[t["CustomElementDefinition"] = 2] = "CustomElementDefinition";
    t[t["Promise"] = 3] = "Promise";
    t[t["IRouteViewModel"] = 4] = "IRouteViewModel";
})(st || (st = {}));

class TypedNavigationInstruction {
    constructor(t, e) {
        this.type = t;
        this.value = e;
    }
    static create(e) {
        if (e instanceof TypedNavigationInstruction) return e;
        if ("string" === typeof e) return new TypedNavigationInstruction(0, e);
        if (!t.isObject(e)) v("function/class or object", "", e);
        if ("function" === typeof e) if (i.CustomElement.isType(e)) {
            const t = i.CustomElement.getDefinition(e);
            return new TypedNavigationInstruction(2, t);
        } else return TypedNavigationInstruction.create(e());
        if (e instanceof Promise) return new TypedNavigationInstruction(3, e);
        if (p(e)) {
            const t = ViewportInstruction.create(e);
            return new TypedNavigationInstruction(1, t);
        }
        if (i.isCustomElementViewModel(e)) return new TypedNavigationInstruction(4, e);
        if (e instanceof i.CustomElementDefinition) return new TypedNavigationInstruction(2, e);
        if (l(e)) {
            const t = i.CustomElement.define(e);
            const s = i.CustomElement.getDefinition(t);
            return new TypedNavigationInstruction(2, s);
        }
        throw new Error(`Invalid component ${r(e)}: must be either a class, a custom element ViewModel, or a (partial) custom element definition`);
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
            return `au$obj${it(this.value)}`;

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
            return `VM(name:'${i.CustomElement.getDefinition(this.value.constructor).name}')`;

          case 1:
            return this.value.toString();

          case 0:
            return `'${this.value}'`;
        }
    }
}

const nt = e.emptyArray;

function ot(t, e) {
    if (!x(t.params, e.params)) return "replace";
    return "none";
}

class RouteConfig {
    constructor(t, e, i, s, n, o, r, a, h, c, u, l) {
        this.id = t;
        this.path = e;
        this.title = i;
        this.redirectTo = s;
        this.caseSensitive = n;
        this.transitionPlan = o;
        this.viewport = r;
        this.data = a;
        this.routes = h;
        this.fallback = c;
        this.component = u;
        this.nav = l;
    }
    static create(t, e) {
        var i, s, n, o, r, a, h, c, u, l, d, f, p, w, m, x, $, E, y, R, b, S, k, C, I, N, A, T, V, P;
        if ("string" === typeof t || t instanceof Array) {
            const d = t;
            const f = null !== (i = null === e || void 0 === e ? void 0 : e.redirectTo) && void 0 !== i ? i : null;
            const p = null !== (s = null === e || void 0 === e ? void 0 : e.caseSensitive) && void 0 !== s ? s : false;
            const v = null !== (n = null === e || void 0 === e ? void 0 : e.id) && void 0 !== n ? n : d instanceof Array ? d[0] : d;
            const g = null !== (o = null === e || void 0 === e ? void 0 : e.title) && void 0 !== o ? o : null;
            const w = null !== (r = null === e || void 0 === e ? void 0 : e.transitionPlan) && void 0 !== r ? r : ot;
            const m = null !== (a = null === e || void 0 === e ? void 0 : e.viewport) && void 0 !== a ? a : null;
            const x = null !== (h = null === e || void 0 === e ? void 0 : e.data) && void 0 !== h ? h : {};
            const $ = null !== (c = null === e || void 0 === e ? void 0 : e.routes) && void 0 !== c ? c : nt;
            return new RouteConfig(v, d, g, f, p, w, m, x, $, null !== (u = null === e || void 0 === e ? void 0 : e.fallback) && void 0 !== u ? u : null, null, null !== (l = null === e || void 0 === e ? void 0 : e.nav) && void 0 !== l ? l : true);
        } else if ("object" === typeof t) {
            const i = t;
            g(i, "");
            const s = null !== (f = null !== (d = i.path) && void 0 !== d ? d : null === e || void 0 === e ? void 0 : e.path) && void 0 !== f ? f : null;
            const n = null !== (w = null !== (p = i.title) && void 0 !== p ? p : null === e || void 0 === e ? void 0 : e.title) && void 0 !== w ? w : null;
            const o = null !== (x = null !== (m = i.redirectTo) && void 0 !== m ? m : null === e || void 0 === e ? void 0 : e.redirectTo) && void 0 !== x ? x : null;
            const r = null !== (E = null !== ($ = i.caseSensitive) && void 0 !== $ ? $ : null === e || void 0 === e ? void 0 : e.caseSensitive) && void 0 !== E ? E : false;
            const a = null !== (R = null !== (y = i.id) && void 0 !== y ? y : null === e || void 0 === e ? void 0 : e.id) && void 0 !== R ? R : s instanceof Array ? s[0] : s;
            const h = null !== (S = null !== (b = i.transitionPlan) && void 0 !== b ? b : null === e || void 0 === e ? void 0 : e.transitionPlan) && void 0 !== S ? S : ot;
            const c = null !== (C = null !== (k = i.viewport) && void 0 !== k ? k : null === e || void 0 === e ? void 0 : e.viewport) && void 0 !== C ? C : null;
            const u = {
                ...null === e || void 0 === e ? void 0 : e.data,
                ...i.data
            };
            const l = [ ...null !== (I = i.routes) && void 0 !== I ? I : nt, ...null !== (N = null === e || void 0 === e ? void 0 : e.routes) && void 0 !== N ? N : nt ];
            return new RouteConfig(a, s, n, o, r, h, c, u, l, null !== (T = null !== (A = i.fallback) && void 0 !== A ? A : null === e || void 0 === e ? void 0 : e.fallback) && void 0 !== T ? T : null, null !== (V = i.component) && void 0 !== V ? V : null, null !== (P = i.nav) && void 0 !== P ? P : true);
        } else v("string, function/class or object", "", t);
    }
    applyChildRouteConfig(t) {
        var e, i, s, n, o, r, a, h, c, u, l, d, f;
        let p = null !== (e = this.path) && void 0 !== e ? e : "";
        if ("string" !== typeof p) p = p[0];
        g(t, p);
        return new RouteConfig(null !== (i = t.id) && void 0 !== i ? i : this.id, null !== (s = t.path) && void 0 !== s ? s : this.path, null !== (n = t.title) && void 0 !== n ? n : this.title, null !== (o = t.redirectTo) && void 0 !== o ? o : this.redirectTo, null !== (r = t.caseSensitive) && void 0 !== r ? r : this.caseSensitive, null !== (a = t.transitionPlan) && void 0 !== a ? a : this.transitionPlan, null !== (h = t.viewport) && void 0 !== h ? h : this.viewport, null !== (c = t.data) && void 0 !== c ? c : this.data, null !== (u = t.routes) && void 0 !== u ? u : this.routes, null !== (l = t.fallback) && void 0 !== l ? l : this.fallback, null !== (d = t.component) && void 0 !== d ? d : this.component, null !== (f = t.nav) && void 0 !== f ? f : this.nav);
    }
}

const rt = {
    name: e.Protocol.resource.keyFor("route-configuration"),
    isConfigured(e) {
        return t.Metadata.hasOwn(rt.name, e);
    },
    configure(e, i) {
        const s = RouteConfig.create(e, i);
        t.Metadata.define(rt.name, s, i);
        return i;
    },
    getConfig(e) {
        if (!rt.isConfigured(e)) rt.configure({}, e);
        return t.Metadata.getOwn(rt.name, e);
    }
};

function at(t) {
    return function(e) {
        return rt.configure(t, e);
    };
}

const ht = "default";

class RouteDefinition {
    constructor(t, e, i) {
        var s, n, o, r, c, u, l;
        this.config = t;
        this.component = e;
        this.hasExplicitPath = null !== t.path;
        this.caseSensitive = t.caseSensitive;
        this.path = a(null !== (s = t.path) && void 0 !== s ? s : e.name);
        this.redirectTo = null !== (n = t.redirectTo) && void 0 !== n ? n : null;
        this.viewport = null !== (o = t.viewport) && void 0 !== o ? o : ht;
        this.id = h(null !== (r = t.id) && void 0 !== r ? r : this.path);
        this.data = null !== (c = t.data) && void 0 !== c ? c : {};
        this.fallback = null !== (l = null !== (u = t.fallback) && void 0 !== u ? u : null === i || void 0 === i ? void 0 : i.fallback) && void 0 !== l ? l : null;
    }
    static resolve(t, s, n, o) {
        if (f(t)) return new RouteDefinition(RouteConfig.create(t, null), null, s);
        const r = this.createNavigationInstruction(t);
        let a;
        switch (r.type) {
          case 0:
            {
                if (void 0 === o) throw new Error(`When retrieving the RouteDefinition for a component name, a RouteContext (that can resolve it) must be provided`);
                const t = o.container.find(i.CustomElement, r.value);
                if (null === t) throw new Error(`Could not find a CustomElement named '${r.value}' in the current container scope of ${o}. This means the component is neither registered at Aurelia startup nor via the 'dependencies' decorator or static property.`);
                a = t;
                break;
            }

          case 2:
            a = r.value;
            break;

          case 4:
            a = i.CustomElement.getDefinition(r.value.constructor);
            break;

          case 3:
            if (void 0 === o) throw new Error(`RouteContext must be provided when resolving an imported module`);
            a = o.resolveLazy(r.value);
            break;
        }
        return e.onResolve(a, (i => {
            var o, a, h, c;
            let u = ct.get(i);
            const l = 4 === r.type && "function" === typeof t.getRouteConfig;
            if (null === u) {
                const r = i.Type;
                let a = null;
                if (l) a = RouteConfig.create(null !== (o = t.getRouteConfig(s, n)) && void 0 !== o ? o : e.emptyObject, r); else a = d(t) ? rt.isConfigured(r) ? rt.getConfig(r).applyChildRouteConfig(t) : RouteConfig.create(t, r) : rt.getConfig(i.Type);
                u = new RouteDefinition(a, i, s);
                ct.define(u, i);
            } else if (0 === u.config.routes.length && l) u.applyChildRouteConfig(null !== (c = null === (h = (a = t).getRouteConfig) || void 0 === h ? void 0 : h.call(a, s, n)) && void 0 !== c ? c : e.emptyObject);
            return u;
        }));
    }
    static createNavigationInstruction(t) {
        return d(t) ? this.createNavigationInstruction(t.component) : TypedNavigationInstruction.create(t);
    }
    applyChildRouteConfig(t) {
        var e, i, s, n, o, r, c;
        this.config = t = this.config.applyChildRouteConfig(t);
        this.hasExplicitPath = null !== t.path;
        this.caseSensitive = null !== (e = t.caseSensitive) && void 0 !== e ? e : this.caseSensitive;
        this.path = a(null !== (i = t.path) && void 0 !== i ? i : this.path);
        this.redirectTo = null !== (s = t.redirectTo) && void 0 !== s ? s : null;
        this.viewport = null !== (n = t.viewport) && void 0 !== n ? n : ht;
        this.id = h(null !== (o = t.id) && void 0 !== o ? o : this.path);
        this.data = null !== (r = t.data) && void 0 !== r ? r : {};
        this.fallback = null !== (c = t.fallback) && void 0 !== c ? c : this.fallback;
    }
    register(t) {
        var e;
        null === (e = this.component) || void 0 === e ? void 0 : e.register(t);
    }
    toString() {
        const t = null === this.config.path ? "null" : `'${this.config.path}'`;
        if (null !== this.component) return `RD(config.path:${t},c.name:'${this.component.name}',vp:'${this.viewport}')`; else return `RD(config.path:${t},redirectTo:'${this.redirectTo}')`;
    }
}

const ct = {
    name: e.Protocol.resource.keyFor("route-definition"),
    isDefined(e) {
        return t.Metadata.hasOwn(ct.name, e);
    },
    define(e, i) {
        t.Metadata.define(ct.name, e, i);
    },
    get(e) {
        return ct.isDefined(e) ? t.Metadata.getOwn(ct.name, e) : null;
    }
};

const ut = new WeakMap;

class ComponentAgent {
    constructor(t, i, s, n, o) {
        var r, a, h, c;
        this.instance = t;
        this.controller = i;
        this.definition = s;
        this.routeNode = n;
        this.ctx = o;
        this.R = o.container.get(e.ILogger).scopeTo(`ComponentAgent<${o.friendlyPath}>`);
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
    static for(t, e, s, n) {
        let o = ut.get(t);
        if (void 0 === o) {
            const r = n.container;
            const a = RouteDefinition.resolve(t.constructor, n.definition, null);
            const h = i.Controller.$el(r, t, e.host, null);
            ut.set(t, o = new ComponentAgent(t, h, a, s, n));
        }
        return o;
    }
    activate(t, e, i) {
        if (null === t) {
            this.R.trace(`activate() - initial`);
            return this.controller.activate(this.controller, e, i);
        }
        this.R.trace(`activate()`);
        void this.controller.activate(t, e, i);
    }
    deactivate(t, e, i) {
        if (null === t) {
            this.R.trace(`deactivate() - initial`);
            return this.controller.deactivate(this.controller, e, i);
        }
        this.R.trace(`deactivate()`);
        void this.controller.deactivate(t, e, i);
    }
    dispose() {
        this.R.trace(`dispose()`);
        this.controller.dispose();
    }
    canUnload(t, e, i) {
        this.R.trace(`canUnload(next:%s) - invoking ${this.canUnloadHooks.length} hooks`, e);
        i.push();
        let s = Promise.resolve();
        for (const n of this.canUnloadHooks) {
            i.push();
            s = s.then((() => new Promise((s => {
                if (true !== t.guardsResult) {
                    i.pop();
                    s();
                    return;
                }
                t.run((() => n.canUnload(this.instance, e, this.routeNode)), (e => {
                    if (true === t.guardsResult && true !== e) t.guardsResult = false;
                    i.pop();
                    s();
                }));
            }))));
        }
        if (this.N) {
            i.push();
            s = s.then((() => {
                if (true !== t.guardsResult) {
                    i.pop();
                    return;
                }
                t.run((() => this.instance.canUnload(e, this.routeNode)), (e => {
                    if (true === t.guardsResult && true !== e) t.guardsResult = false;
                    i.pop();
                }));
            }));
        }
        i.pop();
    }
    canLoad(t, e, i) {
        this.R.trace(`canLoad(next:%s) - invoking ${this.canLoadHooks.length} hooks`, e);
        const s = this.ctx.root;
        i.push();
        let n = Promise.resolve();
        for (const o of this.canLoadHooks) {
            i.push();
            n = n.then((() => new Promise((n => {
                if (true !== t.guardsResult) {
                    i.pop();
                    n();
                    return;
                }
                t.run((() => o.canLoad(this.instance, e.params, e, this.routeNode)), (e => {
                    if (true === t.guardsResult && true !== e) t.guardsResult = false === e ? false : ViewportInstructionTree.create(e, void 0, s);
                    i.pop();
                    n();
                }));
            }))));
        }
        if (this.C) {
            i.push();
            n = n.then((() => {
                if (true !== t.guardsResult) {
                    i.pop();
                    return;
                }
                t.run((() => this.instance.canLoad(e.params, e, this.routeNode)), (e => {
                    if (true === t.guardsResult && true !== e) t.guardsResult = false === e ? false : ViewportInstructionTree.create(e, void 0, s);
                    i.pop();
                }));
            }));
        }
        i.pop();
    }
    unload(t, e, i) {
        this.R.trace(`unload(next:%s) - invoking ${this.unloadHooks.length} hooks`, e);
        i.push();
        for (const s of this.unloadHooks) t.run((() => {
            i.push();
            return s.unload(this.instance, e, this.routeNode);
        }), (() => {
            i.pop();
        }));
        if (this.A) t.run((() => {
            i.push();
            return this.instance.unload(e, this.routeNode);
        }), (() => {
            i.pop();
        }));
        i.pop();
    }
    load(t, e, i) {
        this.R.trace(`load(next:%s) - invoking ${this.loadHooks.length} hooks`, e);
        i.push();
        for (const s of this.loadHooks) t.run((() => {
            i.push();
            return s.load(this.instance, e.params, e, this.routeNode);
        }), (() => {
            i.pop();
        }));
        if (this.I) t.run((() => {
            i.push();
            return this.instance.load(e.params, e, this.routeNode);
        }), (() => {
            i.pop();
        }));
        i.pop();
    }
    toString() {
        return `CA(ctx:'${this.ctx.friendlyPath}',c:'${this.definition.component.name}')`;
    }
}

const lt = e.DI.createInterface("IRouteContext");

const dt = "au$residue";

const ft = Object.freeze([ "string", "object", "function" ]);

function pt(t) {
    if (null == t) return false;
    const e = t.params;
    const i = t.component;
    return "object" === typeof e && null !== e && null != i && ft.includes(typeof i) && !(i instanceof Promise);
}

class RouteContext {
    constructor(t, n, o, r, a, h) {
        this.parent = n;
        this.component = o;
        this.definition = r;
        this.parentContainer = a;
        this.T = h;
        this.childViewportAgents = [];
        this.childRoutes = [];
        this.V = null;
        this.P = null;
        this.prevNode = null;
        this.U = null;
        this.L = false;
        this.O = t;
        if (null === n) {
            this.root = this;
            this.path = [ this ];
            this.friendlyPath = o.name;
        } else {
            this.root = n.root;
            this.path = [ ...n.path, this ];
            this.friendlyPath = `${n.friendlyPath}/${o.name}`;
        }
        this.logger = a.get(e.ILogger).scopeTo(`RouteContext<${this.friendlyPath}>`);
        this.logger.trace("constructor()");
        this.moduleLoader = a.get(e.IModuleLoader);
        const c = this.container = a.createChild();
        c.registerResolver(i.IController, this.hostControllerProvider = new e.InstanceProvider, true);
        c.registerResolver(lt, new e.InstanceProvider("IRouteContext", this));
        c.register(r);
        c.register(...o.dependencies);
        this.recognizer = new s.RouteRecognizer;
        const u = this.j = new NavigationModel([]);
        c.get(R).subscribe("au:router:navigation-end", (() => u.setIsActive(h, this)));
        this.processDefinition(r);
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
        const e = this.prevNode = this.U;
        if (e !== t) {
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
        var i, s, n;
        const o = [];
        const r = [];
        const h = t.config.routes;
        const c = h.length;
        if (0 === c) {
            const e = null === (s = null === (i = t.component) || void 0 === i ? void 0 : i.Type.prototype) || void 0 === s ? void 0 : s.getRouteConfig;
            this.L = null == e ? true : "function" !== typeof e;
            return;
        }
        const u = this.j;
        let l = 0;
        for (;l < c; l++) {
            const i = h[l];
            if (i instanceof Promise) {
                const t = this.addRoute(i);
                o.push(t);
                r.push(t);
            } else {
                const s = RouteDefinition.resolve(i, t, null, this);
                if (s instanceof Promise) if (d(i) && null != i.path) {
                    for (const t of a(i.path)) this.$addRoute(t, null !== (n = i.caseSensitive) && void 0 !== n ? n : false, s);
                    const t = this.childRoutes.length;
                    const o = s.then((e => this.childRoutes[t] = e));
                    this.childRoutes.push(o);
                    u.addRoute(o);
                    r.push(o.then(e.noop));
                } else throw new Error(`Invalid route config. When the component property is a lazy import, the path must be specified.`); else {
                    for (const t of s.path) this.$addRoute(t, s.caseSensitive, s);
                    this.childRoutes.push(s);
                    u.addRoute(s);
                }
            }
        }
        this.L = true;
        if (o.length > 0) this.V = Promise.all(o).then((() => {
            this.V = null;
        }));
        if (r.length > 0) this.P = Promise.all(r).then((() => {
            this.P = null;
        }));
    }
    static setRoot(t) {
        const s = t.get(e.ILogger).scopeTo("RouteContext");
        if (!t.has(i.IAppRoot, true)) gt(new Error(`The provided container has no registered IAppRoot. RouteContext.setRoot can only be used after Aurelia.app was called, on a container that is within that app's component tree.`), s);
        if (t.has(lt, true)) gt(new Error(`A root RouteContext is already registered. A possible cause is the RouterConfiguration being registered more than once in the same container tree. If you have a multi-rooted app, make sure you register RouterConfiguration only in the "forked" containers and not in the common root.`), s);
        const {controller: n} = t.get(i.IAppRoot);
        if (void 0 === n) gt(new Error(`The provided IAppRoot does not (yet) have a controller. A possible cause is calling this API manually before Aurelia.start() is called`), s);
        const o = t.get(tt);
        const r = o.getRouteContext(null, n.definition, n.viewModel, n.container, null);
        t.register(e.Registration.instance(lt, r));
        r.node = o.routeTree.root;
    }
    static resolve(t, s) {
        const n = t.container;
        const o = n.get(e.ILogger).scopeTo("RouteContext");
        if (null === s || void 0 === s) {
            o.trace(`resolve(context:%s) - returning root RouteContext`, s);
            return t;
        }
        if (vt(s)) {
            o.trace(`resolve(context:%s) - returning provided RouteContext`, s);
            return s;
        }
        if (s instanceof n.get(i.IPlatform).Node) try {
            const t = i.CustomElement.for(s, {
                searchParents: true
            });
            o.trace(`resolve(context:Node(nodeName:'${s.nodeName}'),controller:'${t.definition.name}') - resolving RouteContext from controller's RenderContext`);
            return t.container.get(lt);
        } catch (t) {
            o.error(`Failed to resolve RouteContext from Node(nodeName:'${s.nodeName}')`, t);
            throw t;
        }
        if (i.isCustomElementViewModel(s)) {
            const t = s.$controller;
            o.trace(`resolve(context:CustomElementViewModel(name:'${t.definition.name}')) - resolving RouteContext from controller's RenderContext`);
            return t.container.get(lt);
        }
        if (i.isCustomElementController(s)) {
            const t = s;
            o.trace(`resolve(context:CustomElementController(name:'${t.definition.name}')) - resolving RouteContext from controller's RenderContext`);
            return t.container.get(lt);
        }
        gt(new Error(`Invalid context type: ${Object.prototype.toString.call(s)}`), o);
    }
    dispose() {
        this.container.dispose();
    }
    resolveViewportAgent(t) {
        this.logger.trace(`resolveViewportAgent(req:%s)`, t);
        const e = this.childViewportAgents.find((e => e.handles(t)));
        if (void 0 === e) throw new Error(`Failed to resolve ${t} at:\n${this.printTree()}`);
        return e;
    }
    getAvailableViewportAgents(t) {
        return this.childViewportAgents.filter((e => e.isAvailable(t)));
    }
    getFallbackViewportAgent(t, e) {
        var i;
        return null !== (i = this.childViewportAgents.find((i => i.isAvailable(t) && i.viewport.name === e && i.viewport.fallback.length > 0))) && void 0 !== i ? i : null;
    }
    createComponentAgent(t, e) {
        this.logger.trace(`createComponentAgent(routeNode:%s)`, e);
        this.hostControllerProvider.prepare(t);
        const i = this.container.get(e.component.key);
        if (!this.L) {
            const t = RouteDefinition.resolve(i, this.definition, e);
            this.processDefinition(t);
        }
        const s = ComponentAgent.for(i, t, e, this);
        this.hostControllerProvider.dispose();
        return s;
    }
    registerViewport(t) {
        const e = ViewportAgent.for(t, this);
        if (this.childViewportAgents.includes(e)) this.logger.trace(`registerViewport(agent:%s) -> already registered, so skipping`, e); else {
            this.logger.trace(`registerViewport(agent:%s) -> adding`, e);
            this.childViewportAgents.push(e);
        }
        return e;
    }
    unregisterViewport(t) {
        const e = ViewportAgent.for(t, this);
        if (this.childViewportAgents.includes(e)) {
            this.logger.trace(`unregisterViewport(agent:%s) -> unregistering`, e);
            this.childViewportAgents.splice(this.childViewportAgents.indexOf(e), 1);
        } else this.logger.trace(`unregisterViewport(agent:%s) -> not registered, so skipping`, e);
    }
    recognize(t, e = false) {
        var i;
        this.logger.trace(`recognize(path:'${t}')`);
        let s = this;
        let n = true;
        let o = null;
        while (n) {
            o = s.recognizer.recognize(t);
            if (null === o) {
                if (!e || s.isRoot) return null;
                s = s.parent;
            } else n = false;
        }
        let r;
        if (Reflect.has(o.params, dt)) r = null !== (i = o.params[dt]) && void 0 !== i ? i : null; else r = null;
        return new $RecognizedRoute(o, r);
    }
    addRoute(t) {
        this.logger.trace(`addRoute(routeable:'${t}')`);
        return e.onResolve(RouteDefinition.resolve(t, this.definition, null, this), (t => {
            for (const e of t.path) this.$addRoute(e, t.caseSensitive, t);
            this.j.addRoute(t);
            this.childRoutes.push(t);
        }));
    }
    $addRoute(t, e, i) {
        this.recognizer.add({
            path: t,
            caseSensitive: e,
            handler: i
        });
        this.recognizer.add({
            path: `${t}/*${dt}`,
            caseSensitive: e,
            handler: i
        });
    }
    resolveLazy(t) {
        return this.moduleLoader.load(t, (i => {
            const s = i.raw;
            if ("function" === typeof s) {
                const t = e.Protocol.resource.getAll(s).find(wt);
                if (void 0 !== t) return t;
            }
            let n;
            let o;
            for (const t of i.items) if (t.isConstructable) {
                const e = t.definitions.find(wt);
                if (void 0 !== e) if ("default" === t.key) n = e; else if (void 0 === o) o = e;
            }
            if (void 0 === n) {
                if (void 0 === o) throw new Error(`${t} does not appear to be a component or CustomElement recognizable by Aurelia`);
                return o;
            }
            return n;
        }));
    }
    generateViewportInstruction(t) {
        if (!pt(t)) return null;
        const e = t.component;
        let i;
        let n = false;
        if (e instanceof RouteDefinition) {
            i = e;
            n = true;
        } else if ("string" === typeof e) i = this.childRoutes.find((t => t.id === e)); else if (0 === e.type) i = this.childRoutes.find((t => t.id === e.value)); else i = RouteDefinition.resolve(e, null, null, this);
        if (void 0 === i) return null;
        const o = t.params;
        const r = this.recognizer;
        const a = i.path;
        const h = a.length;
        const c = [];
        let u = null;
        if (1 === h) {
            const e = d(a[0]);
            if (null === e) {
                const e = `Unable to eagerly generate path for ${t}. Reasons: ${c}.`;
                if (n) throw new Error(e);
                this.logger.debug(e);
                return null;
            }
            return {
                vi: ViewportInstruction.create({
                    recognizedRoute: new $RecognizedRoute(new s.RecognizedRoute(e.endpoint, e.consumed), null),
                    component: e.path,
                    children: t.children,
                    viewport: t.viewport,
                    open: t.open,
                    close: t.close
                }),
                query: e.query
            };
        }
        let l = 0;
        for (let t = 0; t < h; t++) {
            const e = d(a[t]);
            if (null === e) continue;
            if (null === u) {
                u = e;
                l = Object.keys(e.consumed).length;
            } else if (Object.keys(e.consumed).length > l) u = e;
        }
        if (null === u) {
            const e = `Unable to eagerly generate path for ${t}. Reasons: ${c}.`;
            if (n) throw new Error(e);
            this.logger.debug(e);
            return null;
        }
        return {
            vi: ViewportInstruction.create({
                recognizedRoute: new $RecognizedRoute(new s.RecognizedRoute(u.endpoint, u.consumed), null),
                component: u.path,
                children: t.children,
                viewport: t.viewport,
                open: t.open,
                close: t.close
            }),
            query: u.query
        };
        function d(t) {
            const e = r.getEndpoint(t);
            if (null === e) {
                c.push(`No endpoint found for the path: '${t}'.`);
                return null;
            }
            const i = Object.create(null);
            for (const s of e.params) {
                const e = s.name;
                let n = o[e];
                if (null == n || 0 === String(n).length) {
                    if (!s.isOptional) {
                        c.push(`No value for the required parameter '${e}' is provided for the path: '${t}'.`);
                        return null;
                    }
                    n = "";
                } else i[e] = n;
                const r = s.isStar ? `*${e}` : s.isOptional ? `:${e}?` : `:${e}`;
                t = t.replace(r, n);
            }
            const s = Object.keys(i);
            const n = Object.fromEntries(Object.entries(o).filter((([t]) => !s.includes(t))));
            return {
                path: t.replace(/\/\//g, "/"),
                endpoint: e,
                consumed: i,
                query: n
            };
        }
    }
    toString() {
        const t = this.childViewportAgents;
        const e = t.map(String).join(",");
        return `RC(path:'${this.friendlyPath}',viewports:[${e}])`;
    }
    printTree() {
        const t = [];
        for (let e = 0; e < this.path.length; ++e) t.push(`${" ".repeat(e)}${this.path[e]}`);
        return t.join("\n");
    }
}

function vt(t) {
    return t instanceof RouteContext;
}

function gt(t, e) {
    e.error(t);
    throw t;
}

function wt(t) {
    return i.CustomElement.isType(t.Type);
}

class $RecognizedRoute {
    constructor(t, e) {
        this.route = t;
        this.residue = e;
    }
    toString() {
        const t = this.route;
        const e = t.endpoint.route;
        return `RR(route:(endpoint:(route:(path:${e.path},handler:${e.handler})),params:${JSON.stringify(t.params)}),residue:${this.residue})`;
    }
}

e.DI.createInterface("INavigationModel");

class NavigationModel {
    constructor(t) {
        this.routes = t;
        this.M = void 0;
    }
    resolve() {
        return e.onResolve(this.M, e.noop);
    }
    setIsActive(t, i) {
        void e.onResolve(this.M, (() => {
            for (const e of this.routes) e.setIsActive(t, i);
        }));
    }
    addRoute(t) {
        const i = this.routes;
        if (!(t instanceof Promise)) {
            if (t.config.nav) i.push(NavigationRoute.create(t));
            return;
        }
        const s = i.length;
        i.push(void 0);
        let n;
        n = this.M = e.onResolve(this.M, (() => e.onResolve(t, (t => {
            if (t.config.nav) i[s] = NavigationRoute.create(t); else i.splice(s, 1);
            if (this.M === n) this.M = void 0;
        }))));
    }
}

class NavigationRoute {
    constructor(t, e, i, s) {
        this.id = t;
        this.path = e;
        this.title = i;
        this.data = s;
    }
    static create(t) {
        return new NavigationRoute(t.id, t.path, t.config.title, t.data);
    }
    get isActive() {
        return this.B;
    }
    setIsActive(t, e) {
        this.B = this.path.some((i => t.isActive(i, e)));
    }
}

exports.ViewportCustomElement = class ViewportCustomElement {
    constructor(t, e) {
        this.logger = t;
        this.ctx = e;
        this.name = ht;
        this.usedBy = "";
        this.default = "";
        this.fallback = "";
        this.stateful = false;
        this.agent = void 0;
        this.controller = void 0;
        this.logger = t.scopeTo(`au-viewport<${e.friendlyPath}>`);
        this.logger.trace("constructor()");
    }
    hydrated(t) {
        this.logger.trace("hydrated()");
        this.controller = t;
        this.agent = this.ctx.registerViewport(this);
    }
    attaching(t, e, i) {
        this.logger.trace("attaching()");
        return this.agent.activateFromViewport(t, this.controller, i);
    }
    detaching(t, e, i) {
        this.logger.trace("detaching()");
        return this.agent.deactivateFromViewport(t, this.controller, i);
    }
    dispose() {
        this.logger.trace("dispose()");
        this.ctx.unregisterViewport(this);
        this.agent.dispose();
        this.agent = void 0;
    }
    toString() {
        const t = [];
        for (const e of mt) {
            const i = this[e];
            switch (typeof i) {
              case "string":
                if ("" !== i) t.push(`${e}:'${i}'`);
                break;

              case "boolean":
                if (i) t.push(`${e}:${i}`);
                break;

              default:
                t.push(`${e}:${String(i)}`);
            }
        }
        return `VP(ctx:'${this.ctx.friendlyPath}',${t.join(",")})`;
    }
};

$([ i.bindable ], exports.ViewportCustomElement.prototype, "name", void 0);

$([ i.bindable ], exports.ViewportCustomElement.prototype, "usedBy", void 0);

$([ i.bindable ], exports.ViewportCustomElement.prototype, "default", void 0);

$([ i.bindable ], exports.ViewportCustomElement.prototype, "fallback", void 0);

$([ i.bindable ], exports.ViewportCustomElement.prototype, "stateful", void 0);

exports.ViewportCustomElement = $([ i.customElement({
    name: "au-viewport"
}), E(0, e.ILogger), E(1, lt) ], exports.ViewportCustomElement);

const mt = [ "name", "usedBy", "default", "fallback", "stateful" ];

exports.LoadCustomAttribute = class LoadCustomAttribute {
    constructor(t, e, i, s, n, o, r) {
        this.target = t;
        this.el = e;
        this.router = i;
        this.events = s;
        this.delegator = n;
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
        this.isEnabled = !e.hasAttribute("external") && !e.hasAttribute("data-external");
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
        const e = t.allResolved;
        if (null !== e) return e.then((() => {
            this.valueChanged();
        }));
    }
    unbinding() {
        if (this.isEnabled) this.eventListener.dispose();
        this.navigationEndListener.dispose();
    }
    valueChanged() {
        const t = this.router;
        const e = t.options.useUrlFragmentHash;
        const s = this.route;
        let n = this.context;
        if (void 0 === n) n = this.context = this.ctx; else if (null === n) n = this.context = this.ctx.root;
        if (null != s && null === n.allResolved) {
            const i = this.params;
            const o = this.instructions = t.createViewportInstructions("object" === typeof i && null !== i ? {
                component: s,
                params: i
            } : s, {
                context: n
            });
            this.href = o.toUrl(e);
        } else {
            this.instructions = null;
            this.href = null;
        }
        const o = i.CustomElement.for(this.el, {
            optional: true
        });
        if (null !== o) o.viewModel[this.attribute] = this.instructions; else if (null === this.href) this.el.removeAttribute(this.attribute); else {
            const t = e ? this.href : this.locationMgr.addBaseHref(this.href);
            this.el.setAttribute(this.attribute, t);
        }
    }
};

$([ i.bindable({
    mode: n.BindingMode.toView,
    primary: true,
    callback: "valueChanged"
}) ], exports.LoadCustomAttribute.prototype, "route", void 0);

$([ i.bindable({
    mode: n.BindingMode.toView,
    callback: "valueChanged"
}) ], exports.LoadCustomAttribute.prototype, "params", void 0);

$([ i.bindable({
    mode: n.BindingMode.toView
}) ], exports.LoadCustomAttribute.prototype, "attribute", void 0);

$([ i.bindable({
    mode: n.BindingMode.fromView
}) ], exports.LoadCustomAttribute.prototype, "active", void 0);

$([ i.bindable({
    mode: n.BindingMode.toView,
    callback: "valueChanged"
}) ], exports.LoadCustomAttribute.prototype, "context", void 0);

exports.LoadCustomAttribute = $([ i.customAttribute("load"), E(0, i.IEventTarget), E(1, i.INode), E(2, tt), E(3, R), E(4, i.IEventDelegator), E(5, lt), E(6, k) ], exports.LoadCustomAttribute);

exports.HrefCustomAttribute = class HrefCustomAttribute {
    constructor(t, e, i, s, n, o) {
        this.target = t;
        this.el = e;
        this.router = i;
        this.delegator = s;
        this.ctx = n;
        this.isInitialized = false;
        if (i.options.useHref && "A" === e.nodeName) switch (e.getAttribute("target")) {
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
            this.isEnabled = this.isEnabled && null === i.getRef(this.el, i.CustomAttribute.getDefinition(exports.LoadCustomAttribute).key);
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
        const e = this.el.getAttribute("href");
        if (null !== e) {
            t.preventDefault();
            void this.router.load(e, {
                context: this.ctx
            });
        }
    }
};

$([ i.bindable({
    mode: n.BindingMode.toView
}) ], exports.HrefCustomAttribute.prototype, "value", void 0);

exports.HrefCustomAttribute = $([ i.customAttribute({
    name: "href",
    noMultiBindings: true
}), E(0, i.IEventTarget), E(1, i.INode), E(2, tt), E(3, i.IEventDelegator), E(4, lt), E(5, i.IWindow) ], exports.HrefCustomAttribute);

const xt = tt;

const $t = [ xt ];

const Et = exports.ViewportCustomElement;

const yt = exports.LoadCustomAttribute;

const Rt = exports.HrefCustomAttribute;

const bt = [ exports.ViewportCustomElement, exports.LoadCustomAttribute, exports.HrefCustomAttribute ];

function St(s, n) {
    var o;
    let r;
    let a = null;
    if (t.isObject(n)) if ("function" === typeof n) r = t => n(t); else {
        a = null !== (o = n.basePath) && void 0 !== o ? o : null;
        r = t => t.start(n, true);
    } else r = t => t.start({}, true);
    return s.register(e.Registration.cachedCallback(S, ((t, e, s) => {
        const n = t.get(i.IWindow);
        const o = new URL(n.document.baseURI);
        o.pathname = I(null !== a && void 0 !== a ? a : o.pathname);
        return o;
    })), i.AppTask.hydrated(e.IContainer, RouteContext.setRoot), i.AppTask.activated(tt, r), i.AppTask.deactivated(tt, (t => {
        t.stop();
    })), ...$t, ...bt);
}

const kt = {
    register(t) {
        return St(t);
    },
    customize(t) {
        return {
            register(e) {
                return St(e, t);
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

function Ct(t) {
    t.restore();
}

class HostElementState {
    constructor(t) {
        this.scrollStates = [];
        this.save(t.children);
    }
    save(t) {
        let e;
        for (let i = 0, s = t.length; i < s; ++i) {
            e = t[i];
            if (ScrollState.has(e)) this.scrollStates.push(new ScrollState(e));
            this.save(e.children);
        }
    }
    restore() {
        this.scrollStates.forEach(Ct);
        this.scrollStates = null;
    }
}

const It = e.DI.createInterface("IStateManager", (t => t.singleton(ScrollStateManager)));

class ScrollStateManager {
    constructor() {
        this.cache = new WeakMap;
    }
    saveState(t) {
        this.cache.set(t.host, new HostElementState(t.host));
    }
    restoreState(t) {
        const e = this.cache.get(t.host);
        if (void 0 !== e) {
            e.restore();
            this.cache.delete(t.host);
        }
    }
}

exports.AST = P;

exports.ActionExpression = ActionExpression;

exports.AuNavId = y;

exports.ComponentAgent = ComponentAgent;

exports.ComponentExpression = ComponentExpression;

exports.CompositeSegmentExpression = CompositeSegmentExpression;

exports.DefaultComponents = $t;

exports.DefaultResources = bt;

exports.HrefCustomAttributeRegistration = Rt;

exports.ILocationManager = k;

exports.IRouteContext = lt;

exports.IRouter = tt;

exports.IRouterEvents = R;

exports.IStateManager = It;

exports.LoadCustomAttributeRegistration = yt;

exports.LocationChangeEvent = LocationChangeEvent;

exports.NavigationCancelEvent = NavigationCancelEvent;

exports.NavigationEndEvent = NavigationEndEvent;

exports.NavigationErrorEvent = NavigationErrorEvent;

exports.NavigationOptions = NavigationOptions;

exports.NavigationStartEvent = NavigationStartEvent;

exports.ParameterExpression = ParameterExpression;

exports.ParameterListExpression = ParameterListExpression;

exports.Route = rt;

exports.RouteConfig = RouteConfig;

exports.RouteContext = RouteContext;

exports.RouteDefinition = RouteDefinition;

exports.RouteExpression = RouteExpression;

exports.RouteNode = RouteNode;

exports.RouteTree = RouteTree;

exports.RouterConfiguration = kt;

exports.RouterOptions = RouterOptions;

exports.RouterRegistration = xt;

exports.ScopedSegmentExpression = ScopedSegmentExpression;

exports.SegmentExpression = SegmentExpression;

exports.SegmentGroupExpression = SegmentGroupExpression;

exports.Transition = Transition;

exports.ViewportAgent = ViewportAgent;

exports.ViewportCustomElementRegistration = Et;

exports.ViewportExpression = ViewportExpression;

exports.isManagedState = K;

exports.route = at;

exports.toManagedState = Q;
//# sourceMappingURL=index.cjs.map
