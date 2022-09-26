import { BindingMode as t, subscriberCollection as i, withFlushQueue as e, connectable as s, registerAliases as n, ConnectableSwitcher as r, ProxyObservable as o, Scope as l, ICoercionConfiguration as h, IObserverLocator as c, IExpressionParser as a, AccessScopeExpression as u, DelegationStrategy as f, BindingBehaviorExpression as d, BindingBehaviorFactory as v, PrimitiveLiteralExpression as m, bindingBehavior as g, BindingInterceptor as p, ISignaler as w, PropertyAccessor as b, INodeObserverLocator as x, SetterObserver as y, IDirtyChecker as k, alias as C, applyMutationsToIndices as A, getCollectionObserver as R, BindingContext as S, synchronizeIndices as E, valueConverter as B } from "@aurelia/runtime";

export { LifecycleFlags, bindingBehavior, valueConverter } from "@aurelia/runtime";

import { Protocol as I, getPrototypeChain as T, firstDefined as D, kebabCase as $, noop as P, Registration as O, DI as L, emptyArray as q, all as U, IPlatform as _, mergeArrays as V, fromDefinitionOrDefault as F, pascalCase as M, fromAnnotationOrTypeOrDefault as j, fromAnnotationOrDefinitionOrTypeOrDefault as N, IContainer as H, nextId as W, optional as z, InstanceProvider as G, resolveAll as X, ILogger as K, onResolve as Y, camelCase as Z, toArray as J, emptyObject as Q, IServiceLocator as tt, compareNumber as it, transient as et } from "@aurelia/kernel";

import { Metadata as st, isObject as nt } from "@aurelia/metadata";

import { TaskAbortError as rt } from "@aurelia/platform";

import { BrowserPlatform as ot } from "@aurelia/platform-browser";

function lt(t, i, e, s) {
    var n = arguments.length, r = n < 3 ? i : null === s ? s = Object.getOwnPropertyDescriptor(i, e) : s, o;
    if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(t, i, e, s); else for (var l = t.length - 1; l >= 0; l--) if (o = t[l]) r = (n < 3 ? o(r) : n > 3 ? o(i, e, r) : o(i, e)) || r;
    return n > 3 && r && Object.defineProperty(i, e, r), r;
}

function ht(t, i) {
    return function(e, s) {
        i(e, s, t);
    };
}

const ct = st.getOwn;

const at = st.hasOwn;

const ut = st.define;

const {annotation: ft, resource: dt} = I;

const vt = ft.keyFor;

const mt = dt.keyFor;

const gt = dt.appendTo;

const pt = ft.appendTo;

const wt = ft.getKeys;

const bt = () => Object.create(null);

const xt = Object.prototype.hasOwnProperty;

const yt = bt();

const kt = (t, i, e) => {
    if (true === yt[i]) return true;
    if (!Rt(i)) return false;
    const s = i.slice(0, 5);
    return yt[i] = "aria-" === s || "data-" === s || e.isStandardSvgAttribute(t, i);
};

const Ct = t => t instanceof Promise;

const At = t => "function" === typeof t;

const Rt = t => "string" === typeof t;

const St = Object.defineProperty;

const Et = t => {
    throw t;
};

function Bt(t, i) {
    let e;
    function s(t, i) {
        if (arguments.length > 1) e.property = i;
        ut(Tt, BindableDefinition.create(i, t, e), t.constructor, i);
        pt(t.constructor, Dt.keyFrom(i));
    }
    if (arguments.length > 1) {
        e = {};
        s(t, i);
        return;
    } else if (Rt(t)) {
        e = {};
        return s;
    }
    e = void 0 === t ? {} : t;
    return s;
}

function It(t) {
    return t.startsWith(Tt);
}

const Tt = vt("bindable");

const Dt = Object.freeze({
    name: Tt,
    keyFrom: t => `${Tt}:${t}`,
    from(t, ...i) {
        const e = {};
        const s = Array.isArray;
        function n(i) {
            e[i] = BindableDefinition.create(i, t);
        }
        function r(i, s) {
            e[i] = s instanceof BindableDefinition ? s : BindableDefinition.create(i, t, s);
        }
        function o(t) {
            if (s(t)) t.forEach(n); else if (t instanceof BindableDefinition) e[t.property] = t; else if (void 0 !== t) Object.keys(t).forEach((i => r(i, t[i])));
        }
        i.forEach(o);
        return e;
    },
    for(t) {
        let i;
        const e = {
            add(s) {
                let n;
                let r;
                if (Rt(s)) {
                    n = s;
                    r = {
                        property: n
                    };
                } else {
                    n = s.property;
                    r = s;
                }
                i = BindableDefinition.create(n, t, r);
                if (!at(Tt, t, n)) pt(t, Dt.keyFrom(n));
                ut(Tt, i, t, n);
                return e;
            },
            mode(t) {
                i.mode = t;
                return e;
            },
            callback(t) {
                i.callback = t;
                return e;
            },
            attribute(t) {
                i.attribute = t;
                return e;
            },
            primary() {
                i.primary = true;
                return e;
            },
            set(t) {
                i.set = t;
                return e;
            }
        };
        return e;
    },
    getAll(t) {
        const i = Tt.length + 1;
        const e = [];
        const s = T(t);
        let n = s.length;
        let r = 0;
        let o;
        let l;
        let h;
        let c;
        while (--n >= 0) {
            h = s[n];
            o = wt(h).filter(It);
            l = o.length;
            for (c = 0; c < l; ++c) e[r++] = ct(Tt, h, o[c].slice(i));
        }
        return e;
    }
});

class BindableDefinition {
    constructor(t, i, e, s, n, r) {
        this.attribute = t;
        this.callback = i;
        this.mode = e;
        this.primary = s;
        this.property = n;
        this.set = r;
    }
    static create(i, e, s = {}) {
        return new BindableDefinition(D(s.attribute, $(i)), D(s.callback, `${i}Changed`), D(s.mode, t.toView), D(s.primary, false), D(s.property, i), D(s.set, Ot(i, e, s)));
    }
}

function $t(t, i, e) {
    Pt.define(t, i);
}

const Pt = {
    key: vt("coercer"),
    define(t, i) {
        ut(Pt.key, t[i].bind(t), t);
    },
    for(t) {
        return ct(Pt.key, t);
    }
};

function Ot(t, i, e = {}) {
    var s, n, r;
    const o = null !== (n = null !== (s = e.type) && void 0 !== s ? s : Reflect.getMetadata("design:type", i, t)) && void 0 !== n ? n : null;
    if (null == o) return P;
    let l;
    switch (o) {
      case Number:
      case Boolean:
      case String:
      case BigInt:
        l = o;
        break;

      default:
        {
            const t = o.coerce;
            l = "function" === typeof t ? t.bind(o) : null !== (r = Pt.for(o)) && void 0 !== r ? r : P;
            break;
        }
    }
    return l === P ? l : Lt(l, e.nullable);
}

function Lt(t, i) {
    return function(e, s) {
        var n;
        if (!(null === s || void 0 === s ? void 0 : s.enableCoercion)) return e;
        return (null !== i && void 0 !== i ? i : (null !== (n = null === s || void 0 === s ? void 0 : s.coerceNullish) && void 0 !== n ? n : false) ? false : true) && null == e ? e : t(e, s);
    };
}

class BindableObserver {
    constructor(t, i, e, s, n, r) {
        this.set = s;
        this.$controller = n;
        this.t = r;
        this.v = void 0;
        this.ov = void 0;
        this.f = 0;
        const o = t[e];
        const l = t.propertyChanged;
        const h = this.i = At(o);
        const c = this.u = At(l);
        const a = this.hs = s !== P;
        let u;
        this.o = t;
        this.k = i;
        this.cb = h ? o : P;
        this.C = c ? l : P;
        if (void 0 === this.cb && !c && !a) this.iO = false; else {
            this.iO = true;
            u = t[i];
            this.v = a && void 0 !== u ? s(u, this.t) : u;
            this.A();
        }
    }
    get type() {
        return 1;
    }
    getValue() {
        return this.v;
    }
    setValue(t, i) {
        if (this.hs) t = this.set(t, this.t);
        const e = this.v;
        if (this.iO) {
            if (Object.is(t, e)) return;
            this.v = t;
            this.ov = e;
            this.f = i;
            if (null == this.$controller || this.$controller.isBound) {
                if (this.i) this.cb.call(this.o, t, e, i);
                if (this.u) this.C.call(this.o, this.k, t, e, i);
            }
            this.queue.add(this);
        } else this.o[this.k] = t;
    }
    subscribe(t) {
        if (false === !this.iO) {
            this.iO = true;
            this.v = this.hs ? this.set(this.o[this.k], this.t) : this.o[this.k];
            this.A();
        }
        this.subs.add(t);
    }
    flush() {
        qt = this.ov;
        this.ov = this.v;
        this.subs.notify(this.v, qt, this.f);
    }
    A() {
        Reflect.defineProperty(this.o, this.k, {
            enumerable: true,
            configurable: true,
            get: () => this.v,
            set: t => {
                this.setValue(t, 0);
            }
        });
    }
}

i(BindableObserver);

e(BindableObserver);

let qt;

const Ut = function(t) {
    function i(t, e, s) {
        L.inject(i)(t, e, s);
    }
    i.$isResolver = true;
    i.resolve = function(i, e) {
        if (e.root === e) return e.getAll(t, false);
        return e.has(t, false) ? e.getAll(t, false).concat(e.root.getAll(t, false)) : e.root.getAll(t, false);
    };
    return i;
};

const _t = O.singleton;

const Vt = O.aliasTo;

const Ft = O.instance;

const Mt = O.callback;

const jt = O.transient;

class CharSpec {
    constructor(t, i, e, s) {
        this.chars = t;
        this.repeat = i;
        this.isSymbol = e;
        this.isInverted = s;
        if (s) switch (t.length) {
          case 0:
            this.has = this.R;
            break;

          case 1:
            this.has = this.B;
            break;

          default:
            this.has = this.I;
        } else switch (t.length) {
          case 0:
            this.has = this.T;
            break;

          case 1:
            this.has = this.$;
            break;

          default:
            this.has = this.P;
        }
    }
    equals(t) {
        return this.chars === t.chars && this.repeat === t.repeat && this.isSymbol === t.isSymbol && this.isInverted === t.isInverted;
    }
    P(t) {
        return this.chars.includes(t);
    }
    $(t) {
        return this.chars === t;
    }
    T(t) {
        return false;
    }
    I(t) {
        return !this.chars.includes(t);
    }
    B(t) {
        return this.chars !== t;
    }
    R(t) {
        return true;
    }
}

class Interpretation {
    constructor() {
        this.parts = q;
        this.O = "";
        this.L = {};
        this.q = {};
    }
    get pattern() {
        const t = this.O;
        if ("" === t) return null; else return t;
    }
    set pattern(t) {
        if (null == t) {
            this.O = "";
            this.parts = q;
        } else {
            this.O = t;
            this.parts = this.q[t];
        }
    }
    append(t, i) {
        const e = this.L;
        if (void 0 === e[t]) e[t] = i; else e[t] += i;
    }
    next(t) {
        const i = this.L;
        let e;
        if (void 0 !== i[t]) {
            e = this.q;
            if (void 0 === e[t]) e[t] = [ i[t] ]; else e[t].push(i[t]);
            i[t] = void 0;
        }
    }
}

class AttrParsingState {
    constructor(t, ...i) {
        this.charSpec = t;
        this.nextStates = [];
        this.types = null;
        this.isEndpoint = false;
        this.patterns = i;
    }
    get pattern() {
        return this.isEndpoint ? this.patterns[0] : null;
    }
    findChild(t) {
        const i = this.nextStates;
        const e = i.length;
        let s = null;
        let n = 0;
        for (;n < e; ++n) {
            s = i[n];
            if (t.equals(s.charSpec)) return s;
        }
        return null;
    }
    append(t, i) {
        const e = this.patterns;
        if (!e.includes(i)) e.push(i);
        let s = this.findChild(t);
        if (null == s) {
            s = new AttrParsingState(t, i);
            this.nextStates.push(s);
            if (t.repeat) s.nextStates.push(s);
        }
        return s;
    }
    findMatches(t, i) {
        const e = [];
        const s = this.nextStates;
        const n = s.length;
        let r = 0;
        let o = null;
        let l = 0;
        let h = 0;
        for (;l < n; ++l) {
            o = s[l];
            if (o.charSpec.has(t)) {
                e.push(o);
                r = o.patterns.length;
                h = 0;
                if (o.charSpec.isSymbol) for (;h < r; ++h) i.next(o.patterns[h]); else for (;h < r; ++h) i.append(o.patterns[h], t);
            }
        }
        return e;
    }
}

class StaticSegment {
    constructor(t) {
        this.text = t;
        const i = this.len = t.length;
        const e = this.specs = [];
        let s = 0;
        for (;i > s; ++s) e.push(new CharSpec(t[s], false, false, false));
    }
    eachChar(t) {
        const i = this.len;
        const e = this.specs;
        let s = 0;
        for (;i > s; ++s) t(e[s]);
    }
}

class DynamicSegment {
    constructor(t) {
        this.text = "PART";
        this.spec = new CharSpec(t, true, false, true);
    }
    eachChar(t) {
        t(this.spec);
    }
}

class SymbolSegment {
    constructor(t) {
        this.text = t;
        this.spec = new CharSpec(t, false, true, false);
    }
    eachChar(t) {
        t(this.spec);
    }
}

class SegmentTypes {
    constructor() {
        this.statics = 0;
        this.dynamics = 0;
        this.symbols = 0;
    }
}

const Nt = L.createInterface("ISyntaxInterpreter", (t => t.singleton(SyntaxInterpreter)));

class SyntaxInterpreter {
    constructor() {
        this.rootState = new AttrParsingState(null);
        this.initialStates = [ this.rootState ];
    }
    add(t) {
        t = t.slice(0).sort(((t, i) => t.pattern > i.pattern ? 1 : -1));
        const i = t.length;
        let e;
        let s;
        let n;
        let r;
        let o;
        let l;
        let h;
        let c = 0;
        let a;
        while (i > c) {
            e = this.rootState;
            s = t[c];
            n = s.pattern;
            r = new SegmentTypes;
            o = this.parse(s, r);
            l = o.length;
            h = t => {
                e = e.append(t, n);
            };
            for (a = 0; l > a; ++a) o[a].eachChar(h);
            e.types = r;
            e.isEndpoint = true;
            ++c;
        }
    }
    interpret(t) {
        const i = new Interpretation;
        const e = t.length;
        let s = this.initialStates;
        let n = 0;
        let r;
        for (;n < e; ++n) {
            s = this.getNextStates(s, t.charAt(n), i);
            if (0 === s.length) break;
        }
        s = s.filter(Ht);
        if (s.length > 0) {
            s.sort(Wt);
            r = s[0];
            if (!r.charSpec.isSymbol) i.next(r.pattern);
            i.pattern = r.pattern;
        }
        return i;
    }
    getNextStates(t, i, e) {
        const s = [];
        let n = null;
        const r = t.length;
        let o = 0;
        for (;o < r; ++o) {
            n = t[o];
            s.push(...n.findMatches(i, e));
        }
        return s;
    }
    parse(t, i) {
        const e = [];
        const s = t.pattern;
        const n = s.length;
        const r = t.symbols;
        let o = 0;
        let l = 0;
        let h = "";
        while (o < n) {
            h = s.charAt(o);
            if (0 === r.length || !r.includes(h)) if (o === l) if ("P" === h && "PART" === s.slice(o, o + 4)) {
                l = o += 4;
                e.push(new DynamicSegment(r));
                ++i.dynamics;
            } else ++o; else ++o; else if (o !== l) {
                e.push(new StaticSegment(s.slice(l, o)));
                ++i.statics;
                l = o;
            } else {
                e.push(new SymbolSegment(s.slice(l, o + 1)));
                ++i.symbols;
                l = ++o;
            }
        }
        if (l !== o) {
            e.push(new StaticSegment(s.slice(l, o)));
            ++i.statics;
        }
        return e;
    }
}

function Ht(t) {
    return t.isEndpoint;
}

function Wt(t, i) {
    const e = t.types;
    const s = i.types;
    if (e.statics !== s.statics) return s.statics - e.statics;
    if (e.dynamics !== s.dynamics) return s.dynamics - e.dynamics;
    if (e.symbols !== s.symbols) return s.symbols - e.symbols;
    return 0;
}

class AttrSyntax {
    constructor(t, i, e, s) {
        this.rawName = t;
        this.rawValue = i;
        this.target = e;
        this.command = s;
    }
}

const zt = L.createInterface("IAttributePattern");

const Gt = L.createInterface("IAttributeParser", (t => t.singleton(AttributeParser)));

class AttributeParser {
    constructor(t, i) {
        this.U = {};
        this._ = t;
        const e = this.V = {};
        const s = i.reduce(((t, i) => {
            const s = Zt(i.constructor);
            s.forEach((t => e[t.pattern] = i));
            return t.concat(s);
        }), q);
        t.add(s);
    }
    parse(t, i) {
        let e = this.U[t];
        if (null == e) e = this.U[t] = this._.interpret(t);
        const s = e.pattern;
        if (null == s) return new AttrSyntax(t, i, t, null); else return this.V[s][s](t, i, e.parts);
    }
}

AttributeParser.inject = [ Nt, U(zt) ];

function Xt(...t) {
    return function i(e) {
        return Jt.define(t, e);
    };
}

class AttributePatternResourceDefinition {
    constructor(t) {
        this.Type = t;
        this.name = void 0;
    }
    register(t) {
        _t(zt, this.Type).register(t);
    }
}

const Kt = mt("attribute-pattern");

const Yt = "attribute-pattern-definitions";

const Zt = t => I.annotation.get(t, Yt);

const Jt = Object.freeze({
    name: Kt,
    definitionAnnotationKey: Yt,
    define(t, i) {
        const e = new AttributePatternResourceDefinition(i);
        ut(Kt, e, i);
        gt(i, Kt);
        I.annotation.set(i, Yt, t);
        pt(i, Yt);
        return i;
    },
    getPatternDefinitions: Zt
});

let Qt = class DotSeparatedAttributePattern {
    "PART.PART"(t, i, e) {
        return new AttrSyntax(t, i, e[0], e[1]);
    }
    "PART.PART.PART"(t, i, e) {
        return new AttrSyntax(t, i, e[0], e[2]);
    }
};

Qt = lt([ Xt({
    pattern: "PART.PART",
    symbols: "."
}, {
    pattern: "PART.PART.PART",
    symbols: "."
}) ], Qt);

let ti = class RefAttributePattern {
    ref(t, i, e) {
        return new AttrSyntax(t, i, "element", "ref");
    }
    "PART.ref"(t, i, e) {
        return new AttrSyntax(t, i, e[0], "ref");
    }
};

ti = lt([ Xt({
    pattern: "ref",
    symbols: ""
}, {
    pattern: "PART.ref",
    symbols: "."
}) ], ti);

let ii = class ColonPrefixedBindAttributePattern {
    ":PART"(t, i, e) {
        return new AttrSyntax(t, i, e[0], "bind");
    }
};

ii = lt([ Xt({
    pattern: ":PART",
    symbols: ":"
}) ], ii);

let ei = class AtPrefixedTriggerAttributePattern {
    "@PART"(t, i, e) {
        return new AttrSyntax(t, i, e[0], "trigger");
    }
};

ei = lt([ Xt({
    pattern: "@PART",
    symbols: "@"
}) ], ei);

let si = class SpreadAttributePattern {
    "...$attrs"(t, i, e) {
        return new AttrSyntax(t, i, "", "...$attrs");
    }
};

si = lt([ Xt({
    pattern: "...$attrs",
    symbols: ""
}) ], si);

const ni = _;

const ri = L.createInterface("ISVGAnalyzer", (t => t.singleton(NoopSVGAnalyzer)));

class NoopSVGAnalyzer {
    isStandardSvgAttribute(t, i) {
        return false;
    }
}

function oi(t) {
    const i = bt();
    let e;
    for (e of t) i[e] = true;
    return i;
}

class SVGAnalyzer {
    constructor(t) {
        this.F = Object.assign(bt(), {
            a: oi([ "class", "externalResourcesRequired", "id", "onactivate", "onclick", "onfocusin", "onfocusout", "onload", "onmousedown", "onmousemove", "onmouseout", "onmouseover", "onmouseup", "requiredExtensions", "requiredFeatures", "style", "systemLanguage", "target", "transform", "xlink:actuate", "xlink:arcrole", "xlink:href", "xlink:role", "xlink:show", "xlink:title", "xlink:type", "xml:base", "xml:lang", "xml:space" ]),
            altGlyph: oi([ "class", "dx", "dy", "externalResourcesRequired", "format", "glyphRef", "id", "onactivate", "onclick", "onfocusin", "onfocusout", "onload", "onmousedown", "onmousemove", "onmouseout", "onmouseover", "onmouseup", "requiredExtensions", "requiredFeatures", "rotate", "style", "systemLanguage", "x", "xlink:actuate", "xlink:arcrole", "xlink:href", "xlink:role", "xlink:show", "xlink:title", "xlink:type", "xml:base", "xml:lang", "xml:space", "y" ]),
            altglyph: bt(),
            altGlyphDef: oi([ "id", "xml:base", "xml:lang", "xml:space" ]),
            altglyphdef: bt(),
            altGlyphItem: oi([ "id", "xml:base", "xml:lang", "xml:space" ]),
            altglyphitem: bt(),
            animate: oi([ "accumulate", "additive", "attributeName", "attributeType", "begin", "by", "calcMode", "dur", "end", "externalResourcesRequired", "fill", "from", "id", "keySplines", "keyTimes", "max", "min", "onbegin", "onend", "onload", "onrepeat", "repeatCount", "repeatDur", "requiredExtensions", "requiredFeatures", "restart", "systemLanguage", "to", "values", "xlink:actuate", "xlink:arcrole", "xlink:href", "xlink:role", "xlink:show", "xlink:title", "xlink:type", "xml:base", "xml:lang", "xml:space" ]),
            animateColor: oi([ "accumulate", "additive", "attributeName", "attributeType", "begin", "by", "calcMode", "dur", "end", "externalResourcesRequired", "fill", "from", "id", "keySplines", "keyTimes", "max", "min", "onbegin", "onend", "onload", "onrepeat", "repeatCount", "repeatDur", "requiredExtensions", "requiredFeatures", "restart", "systemLanguage", "to", "values", "xlink:actuate", "xlink:arcrole", "xlink:href", "xlink:role", "xlink:show", "xlink:title", "xlink:type", "xml:base", "xml:lang", "xml:space" ]),
            animateMotion: oi([ "accumulate", "additive", "begin", "by", "calcMode", "dur", "end", "externalResourcesRequired", "fill", "from", "id", "keyPoints", "keySplines", "keyTimes", "max", "min", "onbegin", "onend", "onload", "onrepeat", "origin", "path", "repeatCount", "repeatDur", "requiredExtensions", "requiredFeatures", "restart", "rotate", "systemLanguage", "to", "values", "xlink:actuate", "xlink:arcrole", "xlink:href", "xlink:role", "xlink:show", "xlink:title", "xlink:type", "xml:base", "xml:lang", "xml:space" ]),
            animateTransform: oi([ "accumulate", "additive", "attributeName", "attributeType", "begin", "by", "calcMode", "dur", "end", "externalResourcesRequired", "fill", "from", "id", "keySplines", "keyTimes", "max", "min", "onbegin", "onend", "onload", "onrepeat", "repeatCount", "repeatDur", "requiredExtensions", "requiredFeatures", "restart", "systemLanguage", "to", "type", "values", "xlink:actuate", "xlink:arcrole", "xlink:href", "xlink:role", "xlink:show", "xlink:title", "xlink:type", "xml:base", "xml:lang", "xml:space" ]),
            circle: oi([ "class", "cx", "cy", "externalResourcesRequired", "id", "onactivate", "onclick", "onfocusin", "onfocusout", "onload", "onmousedown", "onmousemove", "onmouseout", "onmouseover", "onmouseup", "r", "requiredExtensions", "requiredFeatures", "style", "systemLanguage", "transform", "xml:base", "xml:lang", "xml:space" ]),
            clipPath: oi([ "class", "clipPathUnits", "externalResourcesRequired", "id", "requiredExtensions", "requiredFeatures", "style", "systemLanguage", "transform", "xml:base", "xml:lang", "xml:space" ]),
            "color-profile": oi([ "id", "local", "name", "rendering-intent", "xlink:actuate", "xlink:arcrole", "xlink:href", "xlink:role", "xlink:show", "xlink:title", "xlink:type", "xml:base", "xml:lang", "xml:space" ]),
            cursor: oi([ "externalResourcesRequired", "id", "requiredExtensions", "requiredFeatures", "systemLanguage", "x", "xlink:actuate", "xlink:arcrole", "xlink:href", "xlink:role", "xlink:show", "xlink:title", "xlink:type", "xml:base", "xml:lang", "xml:space", "y" ]),
            defs: oi([ "class", "externalResourcesRequired", "id", "onactivate", "onclick", "onfocusin", "onfocusout", "onload", "onmousedown", "onmousemove", "onmouseout", "onmouseover", "onmouseup", "requiredExtensions", "requiredFeatures", "style", "systemLanguage", "transform", "xml:base", "xml:lang", "xml:space" ]),
            desc: oi([ "class", "id", "style", "xml:base", "xml:lang", "xml:space" ]),
            ellipse: oi([ "class", "cx", "cy", "externalResourcesRequired", "id", "onactivate", "onclick", "onfocusin", "onfocusout", "onload", "onmousedown", "onmousemove", "onmouseout", "onmouseover", "onmouseup", "requiredExtensions", "requiredFeatures", "rx", "ry", "style", "systemLanguage", "transform", "xml:base", "xml:lang", "xml:space" ]),
            feBlend: oi([ "class", "height", "id", "in", "in2", "mode", "result", "style", "width", "x", "xml:base", "xml:lang", "xml:space", "y" ]),
            feColorMatrix: oi([ "class", "height", "id", "in", "result", "style", "type", "values", "width", "x", "xml:base", "xml:lang", "xml:space", "y" ]),
            feComponentTransfer: oi([ "class", "height", "id", "in", "result", "style", "width", "x", "xml:base", "xml:lang", "xml:space", "y" ]),
            feComposite: oi([ "class", "height", "id", "in", "in2", "k1", "k2", "k3", "k4", "operator", "result", "style", "width", "x", "xml:base", "xml:lang", "xml:space", "y" ]),
            feConvolveMatrix: oi([ "bias", "class", "divisor", "edgeMode", "height", "id", "in", "kernelMatrix", "kernelUnitLength", "order", "preserveAlpha", "result", "style", "targetX", "targetY", "width", "x", "xml:base", "xml:lang", "xml:space", "y" ]),
            feDiffuseLighting: oi([ "class", "diffuseConstant", "height", "id", "in", "kernelUnitLength", "result", "style", "surfaceScale", "width", "x", "xml:base", "xml:lang", "xml:space", "y" ]),
            feDisplacementMap: oi([ "class", "height", "id", "in", "in2", "result", "scale", "style", "width", "x", "xChannelSelector", "xml:base", "xml:lang", "xml:space", "y", "yChannelSelector" ]),
            feDistantLight: oi([ "azimuth", "elevation", "id", "xml:base", "xml:lang", "xml:space" ]),
            feFlood: oi([ "class", "height", "id", "result", "style", "width", "x", "xml:base", "xml:lang", "xml:space", "y" ]),
            feFuncA: oi([ "amplitude", "exponent", "id", "intercept", "offset", "slope", "tableValues", "type", "xml:base", "xml:lang", "xml:space" ]),
            feFuncB: oi([ "amplitude", "exponent", "id", "intercept", "offset", "slope", "tableValues", "type", "xml:base", "xml:lang", "xml:space" ]),
            feFuncG: oi([ "amplitude", "exponent", "id", "intercept", "offset", "slope", "tableValues", "type", "xml:base", "xml:lang", "xml:space" ]),
            feFuncR: oi([ "amplitude", "exponent", "id", "intercept", "offset", "slope", "tableValues", "type", "xml:base", "xml:lang", "xml:space" ]),
            feGaussianBlur: oi([ "class", "height", "id", "in", "result", "stdDeviation", "style", "width", "x", "xml:base", "xml:lang", "xml:space", "y" ]),
            feImage: oi([ "class", "externalResourcesRequired", "height", "id", "preserveAspectRatio", "result", "style", "width", "x", "xlink:actuate", "xlink:arcrole", "xlink:href", "xlink:role", "xlink:show", "xlink:title", "xlink:type", "xml:base", "xml:lang", "xml:space", "y" ]),
            feMerge: oi([ "class", "height", "id", "result", "style", "width", "x", "xml:base", "xml:lang", "xml:space", "y" ]),
            feMergeNode: oi([ "id", "xml:base", "xml:lang", "xml:space" ]),
            feMorphology: oi([ "class", "height", "id", "in", "operator", "radius", "result", "style", "width", "x", "xml:base", "xml:lang", "xml:space", "y" ]),
            feOffset: oi([ "class", "dx", "dy", "height", "id", "in", "result", "style", "width", "x", "xml:base", "xml:lang", "xml:space", "y" ]),
            fePointLight: oi([ "id", "x", "xml:base", "xml:lang", "xml:space", "y", "z" ]),
            feSpecularLighting: oi([ "class", "height", "id", "in", "kernelUnitLength", "result", "specularConstant", "specularExponent", "style", "surfaceScale", "width", "x", "xml:base", "xml:lang", "xml:space", "y" ]),
            feSpotLight: oi([ "id", "limitingConeAngle", "pointsAtX", "pointsAtY", "pointsAtZ", "specularExponent", "x", "xml:base", "xml:lang", "xml:space", "y", "z" ]),
            feTile: oi([ "class", "height", "id", "in", "result", "style", "width", "x", "xml:base", "xml:lang", "xml:space", "y" ]),
            feTurbulence: oi([ "baseFrequency", "class", "height", "id", "numOctaves", "result", "seed", "stitchTiles", "style", "type", "width", "x", "xml:base", "xml:lang", "xml:space", "y" ]),
            filter: oi([ "class", "externalResourcesRequired", "filterRes", "filterUnits", "height", "id", "primitiveUnits", "style", "width", "x", "xlink:actuate", "xlink:arcrole", "xlink:href", "xlink:role", "xlink:show", "xlink:title", "xlink:type", "xml:base", "xml:lang", "xml:space", "y" ]),
            font: oi([ "class", "externalResourcesRequired", "horiz-adv-x", "horiz-origin-x", "horiz-origin-y", "id", "style", "vert-adv-y", "vert-origin-x", "vert-origin-y", "xml:base", "xml:lang", "xml:space" ]),
            "font-face": oi([ "accent-height", "alphabetic", "ascent", "bbox", "cap-height", "descent", "font-family", "font-size", "font-stretch", "font-style", "font-variant", "font-weight", "hanging", "id", "ideographic", "mathematical", "overline-position", "overline-thickness", "panose-1", "slope", "stemh", "stemv", "strikethrough-position", "strikethrough-thickness", "underline-position", "underline-thickness", "unicode-range", "units-per-em", "v-alphabetic", "v-hanging", "v-ideographic", "v-mathematical", "widths", "x-height", "xml:base", "xml:lang", "xml:space" ]),
            "font-face-format": oi([ "id", "string", "xml:base", "xml:lang", "xml:space" ]),
            "font-face-name": oi([ "id", "name", "xml:base", "xml:lang", "xml:space" ]),
            "font-face-src": oi([ "id", "xml:base", "xml:lang", "xml:space" ]),
            "font-face-uri": oi([ "id", "xlink:actuate", "xlink:arcrole", "xlink:href", "xlink:role", "xlink:show", "xlink:title", "xlink:type", "xml:base", "xml:lang", "xml:space" ]),
            foreignObject: oi([ "class", "externalResourcesRequired", "height", "id", "onactivate", "onclick", "onfocusin", "onfocusout", "onload", "onmousedown", "onmousemove", "onmouseout", "onmouseover", "onmouseup", "requiredExtensions", "requiredFeatures", "style", "systemLanguage", "transform", "width", "x", "xml:base", "xml:lang", "xml:space", "y" ]),
            g: oi([ "class", "externalResourcesRequired", "id", "onactivate", "onclick", "onfocusin", "onfocusout", "onload", "onmousedown", "onmousemove", "onmouseout", "onmouseover", "onmouseup", "requiredExtensions", "requiredFeatures", "style", "systemLanguage", "transform", "xml:base", "xml:lang", "xml:space" ]),
            glyph: oi([ "arabic-form", "class", "d", "glyph-name", "horiz-adv-x", "id", "lang", "orientation", "style", "unicode", "vert-adv-y", "vert-origin-x", "vert-origin-y", "xml:base", "xml:lang", "xml:space" ]),
            glyphRef: oi([ "class", "dx", "dy", "format", "glyphRef", "id", "style", "x", "xlink:actuate", "xlink:arcrole", "xlink:href", "xlink:role", "xlink:show", "xlink:title", "xlink:type", "xml:base", "xml:lang", "xml:space", "y" ]),
            glyphref: bt(),
            hkern: oi([ "g1", "g2", "id", "k", "u1", "u2", "xml:base", "xml:lang", "xml:space" ]),
            image: oi([ "class", "externalResourcesRequired", "height", "id", "onactivate", "onclick", "onfocusin", "onfocusout", "onload", "onmousedown", "onmousemove", "onmouseout", "onmouseover", "onmouseup", "preserveAspectRatio", "requiredExtensions", "requiredFeatures", "style", "systemLanguage", "transform", "width", "x", "xlink:actuate", "xlink:arcrole", "xlink:href", "xlink:role", "xlink:show", "xlink:title", "xlink:type", "xml:base", "xml:lang", "xml:space", "y" ]),
            line: oi([ "class", "externalResourcesRequired", "id", "onactivate", "onclick", "onfocusin", "onfocusout", "onload", "onmousedown", "onmousemove", "onmouseout", "onmouseover", "onmouseup", "requiredExtensions", "requiredFeatures", "style", "systemLanguage", "transform", "x1", "x2", "xml:base", "xml:lang", "xml:space", "y1", "y2" ]),
            linearGradient: oi([ "class", "externalResourcesRequired", "gradientTransform", "gradientUnits", "id", "spreadMethod", "style", "x1", "x2", "xlink:arcrole", "xlink:href", "xlink:role", "xlink:title", "xlink:type", "xml:base", "xml:lang", "xml:space", "y1", "y2" ]),
            marker: oi([ "class", "externalResourcesRequired", "id", "markerHeight", "markerUnits", "markerWidth", "orient", "preserveAspectRatio", "refX", "refY", "style", "viewBox", "xml:base", "xml:lang", "xml:space" ]),
            mask: oi([ "class", "externalResourcesRequired", "height", "id", "maskContentUnits", "maskUnits", "requiredExtensions", "requiredFeatures", "style", "systemLanguage", "width", "x", "xml:base", "xml:lang", "xml:space", "y" ]),
            metadata: oi([ "id", "xml:base", "xml:lang", "xml:space" ]),
            "missing-glyph": oi([ "class", "d", "horiz-adv-x", "id", "style", "vert-adv-y", "vert-origin-x", "vert-origin-y", "xml:base", "xml:lang", "xml:space" ]),
            mpath: oi([ "externalResourcesRequired", "id", "xlink:actuate", "xlink:arcrole", "xlink:href", "xlink:role", "xlink:show", "xlink:title", "xlink:type", "xml:base", "xml:lang", "xml:space" ]),
            path: oi([ "class", "d", "externalResourcesRequired", "id", "onactivate", "onclick", "onfocusin", "onfocusout", "onload", "onmousedown", "onmousemove", "onmouseout", "onmouseover", "onmouseup", "pathLength", "requiredExtensions", "requiredFeatures", "style", "systemLanguage", "transform", "xml:base", "xml:lang", "xml:space" ]),
            pattern: oi([ "class", "externalResourcesRequired", "height", "id", "patternContentUnits", "patternTransform", "patternUnits", "preserveAspectRatio", "requiredExtensions", "requiredFeatures", "style", "systemLanguage", "viewBox", "width", "x", "xlink:actuate", "xlink:arcrole", "xlink:href", "xlink:role", "xlink:show", "xlink:title", "xlink:type", "xml:base", "xml:lang", "xml:space", "y" ]),
            polygon: oi([ "class", "externalResourcesRequired", "id", "onactivate", "onclick", "onfocusin", "onfocusout", "onload", "onmousedown", "onmousemove", "onmouseout", "onmouseover", "onmouseup", "points", "requiredExtensions", "requiredFeatures", "style", "systemLanguage", "transform", "xml:base", "xml:lang", "xml:space" ]),
            polyline: oi([ "class", "externalResourcesRequired", "id", "onactivate", "onclick", "onfocusin", "onfocusout", "onload", "onmousedown", "onmousemove", "onmouseout", "onmouseover", "onmouseup", "points", "requiredExtensions", "requiredFeatures", "style", "systemLanguage", "transform", "xml:base", "xml:lang", "xml:space" ]),
            radialGradient: oi([ "class", "cx", "cy", "externalResourcesRequired", "fx", "fy", "gradientTransform", "gradientUnits", "id", "r", "spreadMethod", "style", "xlink:arcrole", "xlink:href", "xlink:role", "xlink:title", "xlink:type", "xml:base", "xml:lang", "xml:space" ]),
            rect: oi([ "class", "externalResourcesRequired", "height", "id", "onactivate", "onclick", "onfocusin", "onfocusout", "onload", "onmousedown", "onmousemove", "onmouseout", "onmouseover", "onmouseup", "requiredExtensions", "requiredFeatures", "rx", "ry", "style", "systemLanguage", "transform", "width", "x", "xml:base", "xml:lang", "xml:space", "y" ]),
            script: oi([ "externalResourcesRequired", "id", "type", "xlink:actuate", "xlink:arcrole", "xlink:href", "xlink:role", "xlink:show", "xlink:title", "xlink:type", "xml:base", "xml:lang", "xml:space" ]),
            set: oi([ "attributeName", "attributeType", "begin", "dur", "end", "externalResourcesRequired", "fill", "id", "max", "min", "onbegin", "onend", "onload", "onrepeat", "repeatCount", "repeatDur", "requiredExtensions", "requiredFeatures", "restart", "systemLanguage", "to", "xlink:actuate", "xlink:arcrole", "xlink:href", "xlink:role", "xlink:show", "xlink:title", "xlink:type", "xml:base", "xml:lang", "xml:space" ]),
            stop: oi([ "class", "id", "offset", "style", "xml:base", "xml:lang", "xml:space" ]),
            style: oi([ "id", "media", "title", "type", "xml:base", "xml:lang", "xml:space" ]),
            svg: oi([ "baseProfile", "class", "contentScriptType", "contentStyleType", "externalResourcesRequired", "height", "id", "onabort", "onactivate", "onclick", "onerror", "onfocusin", "onfocusout", "onload", "onmousedown", "onmousemove", "onmouseout", "onmouseover", "onmouseup", "onresize", "onscroll", "onunload", "onzoom", "preserveAspectRatio", "requiredExtensions", "requiredFeatures", "style", "systemLanguage", "version", "viewBox", "width", "x", "xml:base", "xml:lang", "xml:space", "y", "zoomAndPan" ]),
            switch: oi([ "class", "externalResourcesRequired", "id", "onactivate", "onclick", "onfocusin", "onfocusout", "onload", "onmousedown", "onmousemove", "onmouseout", "onmouseover", "onmouseup", "requiredExtensions", "requiredFeatures", "style", "systemLanguage", "transform", "xml:base", "xml:lang", "xml:space" ]),
            symbol: oi([ "class", "externalResourcesRequired", "id", "onactivate", "onclick", "onfocusin", "onfocusout", "onload", "onmousedown", "onmousemove", "onmouseout", "onmouseover", "onmouseup", "preserveAspectRatio", "style", "viewBox", "xml:base", "xml:lang", "xml:space" ]),
            text: oi([ "class", "dx", "dy", "externalResourcesRequired", "id", "lengthAdjust", "onactivate", "onclick", "onfocusin", "onfocusout", "onload", "onmousedown", "onmousemove", "onmouseout", "onmouseover", "onmouseup", "requiredExtensions", "requiredFeatures", "rotate", "style", "systemLanguage", "textLength", "transform", "x", "xml:base", "xml:lang", "xml:space", "y" ]),
            textPath: oi([ "class", "externalResourcesRequired", "id", "lengthAdjust", "method", "onactivate", "onclick", "onfocusin", "onfocusout", "onload", "onmousedown", "onmousemove", "onmouseout", "onmouseover", "onmouseup", "requiredExtensions", "requiredFeatures", "spacing", "startOffset", "style", "systemLanguage", "textLength", "xlink:arcrole", "xlink:href", "xlink:role", "xlink:title", "xlink:type", "xml:base", "xml:lang", "xml:space" ]),
            title: oi([ "class", "id", "style", "xml:base", "xml:lang", "xml:space" ]),
            tref: oi([ "class", "dx", "dy", "externalResourcesRequired", "id", "lengthAdjust", "onactivate", "onclick", "onfocusin", "onfocusout", "onload", "onmousedown", "onmousemove", "onmouseout", "onmouseover", "onmouseup", "requiredExtensions", "requiredFeatures", "rotate", "style", "systemLanguage", "textLength", "x", "xlink:arcrole", "xlink:href", "xlink:role", "xlink:title", "xlink:type", "xml:base", "xml:lang", "xml:space", "y" ]),
            tspan: oi([ "class", "dx", "dy", "externalResourcesRequired", "id", "lengthAdjust", "onactivate", "onclick", "onfocusin", "onfocusout", "onload", "onmousedown", "onmousemove", "onmouseout", "onmouseover", "onmouseup", "requiredExtensions", "requiredFeatures", "rotate", "style", "systemLanguage", "textLength", "x", "xml:base", "xml:lang", "xml:space", "y" ]),
            use: oi([ "class", "externalResourcesRequired", "height", "id", "onactivate", "onclick", "onfocusin", "onfocusout", "onload", "onmousedown", "onmousemove", "onmouseout", "onmouseover", "onmouseup", "requiredExtensions", "requiredFeatures", "style", "systemLanguage", "transform", "width", "x", "xlink:actuate", "xlink:arcrole", "xlink:href", "xlink:role", "xlink:show", "xlink:title", "xlink:type", "xml:base", "xml:lang", "xml:space", "y" ]),
            view: oi([ "externalResourcesRequired", "id", "preserveAspectRatio", "viewBox", "viewTarget", "xml:base", "xml:lang", "xml:space", "zoomAndPan" ]),
            vkern: oi([ "g1", "g2", "id", "k", "u1", "u2", "xml:base", "xml:lang", "xml:space" ])
        });
        this.M = oi([ "a", "altGlyph", "animate", "animateColor", "circle", "clipPath", "defs", "ellipse", "feBlend", "feColorMatrix", "feComponentTransfer", "feComposite", "feConvolveMatrix", "feDiffuseLighting", "feDisplacementMap", "feFlood", "feGaussianBlur", "feImage", "feMerge", "feMorphology", "feOffset", "feSpecularLighting", "feTile", "feTurbulence", "filter", "font", "foreignObject", "g", "glyph", "glyphRef", "image", "line", "linearGradient", "marker", "mask", "missing-glyph", "path", "pattern", "polygon", "polyline", "radialGradient", "rect", "stop", "svg", "switch", "symbol", "text", "textPath", "tref", "tspan", "use" ]);
        this.j = oi([ "alignment-baseline", "baseline-shift", "clip-path", "clip-rule", "clip", "color-interpolation-filters", "color-interpolation", "color-profile", "color-rendering", "color", "cursor", "direction", "display", "dominant-baseline", "enable-background", "fill-opacity", "fill-rule", "fill", "filter", "flood-color", "flood-opacity", "font-family", "font-size-adjust", "font-size", "font-stretch", "font-style", "font-variant", "font-weight", "glyph-orientation-horizontal", "glyph-orientation-vertical", "image-rendering", "kerning", "letter-spacing", "lighting-color", "marker-end", "marker-mid", "marker-start", "mask", "opacity", "overflow", "pointer-events", "shape-rendering", "stop-color", "stop-opacity", "stroke-dasharray", "stroke-dashoffset", "stroke-linecap", "stroke-linejoin", "stroke-miterlimit", "stroke-opacity", "stroke-width", "stroke", "text-anchor", "text-decoration", "text-rendering", "unicode-bidi", "visibility", "word-spacing", "writing-mode" ]);
        this.SVGElement = t.globalThis.SVGElement;
        const i = t.document.createElement("div");
        i.innerHTML = "<svg><altGlyph /></svg>";
        if ("altglyph" === i.firstElementChild.nodeName) {
            const t = this.F;
            let i = t.altGlyph;
            t.altGlyph = t.altglyph;
            t.altglyph = i;
            i = t.altGlyphDef;
            t.altGlyphDef = t.altglyphdef;
            t.altglyphdef = i;
            i = t.altGlyphItem;
            t.altGlyphItem = t.altglyphitem;
            t.altglyphitem = i;
            i = t.glyphRef;
            t.glyphRef = t.glyphref;
            t.glyphref = i;
        }
    }
    static register(t) {
        return _t(ri, this).register(t);
    }
    isStandardSvgAttribute(t, i) {
        var e;
        if (!(t instanceof this.SVGElement)) return false;
        return true === this.M[t.nodeName] && true === this.j[i] || true === (null === (e = this.F[t.nodeName]) || void 0 === e ? void 0 : e[i]);
    }
}

SVGAnalyzer.inject = [ ni ];

const li = L.createInterface("IAttrMapper", (t => t.singleton(AttrMapper)));

class AttrMapper {
    constructor(t) {
        this.svg = t;
        this.fns = [];
        this.N = bt();
        this.H = bt();
        this.useMapping({
            LABEL: {
                for: "htmlFor"
            },
            IMG: {
                usemap: "useMap"
            },
            INPUT: {
                maxlength: "maxLength",
                minlength: "minLength",
                formaction: "formAction",
                formenctype: "formEncType",
                formmethod: "formMethod",
                formnovalidate: "formNoValidate",
                formtarget: "formTarget",
                inputmode: "inputMode"
            },
            TEXTAREA: {
                maxlength: "maxLength"
            },
            TD: {
                rowspan: "rowSpan",
                colspan: "colSpan"
            },
            TH: {
                rowspan: "rowSpan",
                colspan: "colSpan"
            }
        });
        this.useGlobalMapping({
            accesskey: "accessKey",
            contenteditable: "contentEditable",
            tabindex: "tabIndex",
            textcontent: "textContent",
            innerhtml: "innerHTML",
            scrolltop: "scrollTop",
            scrollleft: "scrollLeft",
            readonly: "readOnly"
        });
    }
    static get inject() {
        return [ ri ];
    }
    useMapping(t) {
        var i;
        var e;
        let s;
        let n;
        let r;
        let o;
        for (r in t) {
            s = t[r];
            n = null !== (i = (e = this.N)[r]) && void 0 !== i ? i : e[r] = bt();
            for (o in s) {
                if (void 0 !== n[o]) throw ci(o, r);
                n[o] = s[o];
            }
        }
    }
    useGlobalMapping(t) {
        const i = this.H;
        for (const e in t) {
            if (void 0 !== i[e]) throw ci(e, "*");
            i[e] = t[e];
        }
    }
    useTwoWay(t) {
        this.fns.push(t);
    }
    isTwoWay(t, i) {
        return hi(t, i) || this.fns.length > 0 && this.fns.some((e => e(t, i)));
    }
    map(t, i) {
        var e, s, n;
        return null !== (n = null !== (s = null === (e = this.N[t.nodeName]) || void 0 === e ? void 0 : e[i]) && void 0 !== s ? s : this.H[i]) && void 0 !== n ? n : kt(t, i, this.svg) ? i : null;
    }
}

function hi(t, i) {
    switch (t.nodeName) {
      case "INPUT":
        switch (t.type) {
          case "checkbox":
          case "radio":
            return "checked" === i;

          default:
            return "value" === i || "files" === i || "value-as-number" === i || "value-as-date" === i;
        }

      case "TEXTAREA":
      case "SELECT":
        return "value" === i;

      default:
        switch (i) {
          case "textcontent":
          case "innerhtml":
            return t.hasAttribute("contenteditable");

          case "scrolltop":
          case "scrollleft":
            return true;

          default:
            return false;
        }
    }
}

function ci(t, i) {
    return new Error(`Attribute ${t} has been already registered for ${"*" === i ? "all elements" : `<${i}/>`}`);
}

class CallBinding {
    constructor(t, i, e, s, n) {
        this.sourceExpression = t;
        this.target = i;
        this.targetProperty = e;
        this.locator = n;
        this.interceptor = this;
        this.isBound = false;
        this.targetObserver = s.getAccessor(i, e);
    }
    callSource(t) {
        const i = this.$scope.overrideContext;
        i.$event = t;
        const e = this.sourceExpression.evaluate(8, this.$scope, this.locator, null);
        Reflect.deleteProperty(i, "$event");
        return e;
    }
    $bind(t, i) {
        if (this.isBound) {
            if (this.$scope === i) return;
            this.interceptor.$unbind(2 | t);
        }
        this.$scope = i;
        if (this.sourceExpression.hasBind) this.sourceExpression.bind(t, i, this.interceptor);
        this.targetObserver.setValue((t => this.interceptor.callSource(t)), t, this.target, this.targetProperty);
        this.isBound = true;
    }
    $unbind(t) {
        if (!this.isBound) return;
        if (this.sourceExpression.hasUnbind) this.sourceExpression.unbind(t, this.$scope, this.interceptor);
        this.$scope = void 0;
        this.targetObserver.setValue(null, t, this.target, this.targetProperty);
        this.isBound = false;
    }
    observe(t, i) {
        return;
    }
    handleChange(t, i, e) {
        return;
    }
}

class AttributeObserver {
    constructor(t, i, e) {
        this.type = 2 | 1 | 4;
        this.v = null;
        this.ov = null;
        this.W = false;
        this.f = 0;
        this.o = t;
        this.G = i;
        this.X = e;
    }
    getValue() {
        return this.v;
    }
    setValue(t, i) {
        this.v = t;
        this.W = t !== this.ov;
        if (0 === (32 & i)) this.K();
    }
    K() {
        if (this.W) {
            this.W = false;
            this.ov = this.v;
            switch (this.X) {
              case "class":
                this.o.classList.toggle(this.G, !!this.v);
                break;

              case "style":
                {
                    let t = "";
                    let i = this.v;
                    if (Rt(i) && i.includes("!important")) {
                        t = "important";
                        i = i.replace("!important", "");
                    }
                    this.o.style.setProperty(this.G, i, t);
                    break;
                }

              default:
                if (null == this.v) this.o.removeAttribute(this.X); else this.o.setAttribute(this.X, String(this.v));
            }
        }
    }
    handleMutation(t) {
        let i = false;
        for (let e = 0, s = t.length; s > e; ++e) {
            const s = t[e];
            if ("attributes" === s.type && s.attributeName === this.G) {
                i = true;
                break;
            }
        }
        if (i) {
            let t;
            switch (this.X) {
              case "class":
                t = this.o.classList.contains(this.G);
                break;

              case "style":
                t = this.o.style.getPropertyValue(this.G);
                break;

              default:
                throw new Error(`AUR0651:${this.X}`);
            }
            if (t !== this.v) {
                this.ov = this.v;
                this.v = t;
                this.W = false;
                this.f = 0;
                this.queue.add(this);
            }
        }
    }
    subscribe(t) {
        if (this.subs.add(t) && 1 === this.subs.count) {
            this.v = this.ov = this.o.getAttribute(this.G);
            ai(this.o.ownerDocument.defaultView.MutationObserver, this.o, this);
        }
    }
    unsubscribe(t) {
        if (this.subs.remove(t) && 0 === this.subs.count) ui(this.o, this);
    }
    flush() {
        vi = this.ov;
        this.ov = this.v;
        this.subs.notify(this.v, vi, this.f);
    }
}

i(AttributeObserver);

e(AttributeObserver);

const ai = (t, i, e) => {
    if (void 0 === i.$eMObs) i.$eMObs = new Set;
    if (void 0 === i.$mObs) (i.$mObs = new t(fi)).observe(i, {
        attributes: true
    });
    i.$eMObs.add(e);
};

const ui = (t, i) => {
    const e = t.$eMObs;
    if (e && e.delete(i)) {
        if (0 === e.size) {
            t.$mObs.disconnect();
            t.$mObs = void 0;
        }
        return true;
    }
    return false;
};

const fi = t => {
    t[0].target.$eMObs.forEach(di, t);
};

function di(t) {
    t.handleMutation(this);
}

let vi;

class BindingTargetSubscriber {
    constructor(t) {
        this.b = t;
    }
    handleChange(t, i, e) {
        const s = this.b;
        if (t !== s.sourceExpression.evaluate(e, s.$scope, s.locator, null)) s.updateSource(t, e);
    }
}

const {oneTime: mi, toView: gi, fromView: pi} = t;

const wi = gi | mi;

const bi = {
    reusable: false,
    preempt: true
};

class AttributeBinding {
    constructor(t, i, e, s, n, r, o) {
        this.sourceExpression = t;
        this.targetAttribute = e;
        this.targetProperty = s;
        this.mode = n;
        this.locator = o;
        this.interceptor = this;
        this.isBound = false;
        this.$scope = null;
        this.task = null;
        this.targetSubscriber = null;
        this.persistentFlags = 0;
        this.value = void 0;
        this.target = i;
        this.p = o.get(ni);
        this.oL = r;
    }
    updateTarget(t, i) {
        i |= this.persistentFlags;
        this.targetObserver.setValue(t, i, this.target, this.targetProperty);
    }
    updateSource(t, i) {
        i |= this.persistentFlags;
        this.sourceExpression.assign(i, this.$scope, this.locator, t);
    }
    handleChange(t, i, e) {
        if (!this.isBound) return;
        e |= this.persistentFlags;
        const s = this.mode;
        const n = this.interceptor;
        const r = this.sourceExpression;
        const o = this.$scope;
        const l = this.locator;
        const h = this.targetObserver;
        const c = 0 === (2 & e) && (4 & h.type) > 0;
        let a = false;
        let u;
        if (10082 !== r.$kind || this.obs.count > 1) {
            a = 0 === (s & mi);
            if (a) this.obs.version++;
            t = r.evaluate(e, o, l, n);
            if (a) this.obs.clear();
        }
        if (t !== this.value) {
            this.value = t;
            if (c) {
                u = this.task;
                this.task = this.p.domWriteQueue.queueTask((() => {
                    this.task = null;
                    n.updateTarget(t, e);
                }), bi);
                null === u || void 0 === u ? void 0 : u.cancel();
            } else n.updateTarget(t, e);
        }
    }
    $bind(t, i) {
        var e;
        if (this.isBound) {
            if (this.$scope === i) return;
            this.interceptor.$unbind(2 | t);
        }
        this.persistentFlags = 33 & t;
        this.$scope = i;
        let s = this.sourceExpression;
        if (s.hasBind) s.bind(t, i, this.interceptor);
        let n = this.targetObserver;
        if (!n) n = this.targetObserver = new AttributeObserver(this.target, this.targetProperty, this.targetAttribute);
        s = this.sourceExpression;
        const r = this.mode;
        const o = this.interceptor;
        let l = false;
        if (r & wi) {
            l = (r & gi) > 0;
            o.updateTarget(this.value = s.evaluate(t, i, this.locator, l ? o : null), t);
        }
        if (r & pi) n.subscribe(null !== (e = this.targetSubscriber) && void 0 !== e ? e : this.targetSubscriber = new BindingTargetSubscriber(o));
        this.isBound = true;
    }
    $unbind(t) {
        var i;
        if (!this.isBound) return;
        this.persistentFlags = 0;
        if (this.sourceExpression.hasUnbind) this.sourceExpression.unbind(t, this.$scope, this.interceptor);
        this.$scope = null;
        this.value = void 0;
        if (this.targetSubscriber) this.targetObserver.unsubscribe(this.targetSubscriber);
        null === (i = this.task) || void 0 === i ? void 0 : i.cancel();
        this.task = null;
        this.obs.clearAll();
        this.isBound = false;
    }
}

s(AttributeBinding);

const {toView: xi} = t;

const yi = {
    reusable: false,
    preempt: true
};

class InterpolationBinding {
    constructor(t, i, e, s, n, r, o) {
        this.interpolation = i;
        this.target = e;
        this.targetProperty = s;
        this.mode = n;
        this.locator = r;
        this.taskQueue = o;
        this.interceptor = this;
        this.isBound = false;
        this.$scope = void 0;
        this.task = null;
        this.oL = t;
        this.targetObserver = t.getAccessor(e, s);
        const l = i.expressions;
        const h = this.partBindings = Array(l.length);
        const c = l.length;
        let a = 0;
        for (;c > a; ++a) h[a] = new InterpolationPartBinding(l[a], e, s, r, t, this);
    }
    updateTarget(t, i) {
        const e = this.partBindings;
        const s = this.interpolation.parts;
        const n = e.length;
        let r = "";
        let o = 0;
        if (1 === n) r = s[0] + e[0].value + s[1]; else {
            r = s[0];
            for (;n > o; ++o) r += e[o].value + s[o + 1];
        }
        const l = this.targetObserver;
        const h = 0 === (2 & i) && (4 & l.type) > 0;
        let c;
        if (h) {
            c = this.task;
            this.task = this.taskQueue.queueTask((() => {
                this.task = null;
                l.setValue(r, i, this.target, this.targetProperty);
            }), yi);
            null === c || void 0 === c ? void 0 : c.cancel();
            c = null;
        } else l.setValue(r, i, this.target, this.targetProperty);
    }
    $bind(t, i) {
        if (this.isBound) {
            if (this.$scope === i) return;
            this.interceptor.$unbind(t);
        }
        this.isBound = true;
        this.$scope = i;
        const e = this.partBindings;
        const s = e.length;
        let n = 0;
        for (;s > n; ++n) e[n].$bind(t, i);
        this.updateTarget(void 0, t);
    }
    $unbind(t) {
        var i;
        if (!this.isBound) return;
        this.isBound = false;
        this.$scope = void 0;
        const e = this.partBindings;
        const s = e.length;
        let n = 0;
        for (;s > n; ++n) e[n].interceptor.$unbind(t);
        null === (i = this.task) || void 0 === i ? void 0 : i.cancel();
        this.task = null;
    }
}

class InterpolationPartBinding {
    constructor(i, e, s, n, r, o) {
        this.sourceExpression = i;
        this.target = e;
        this.targetProperty = s;
        this.locator = n;
        this.owner = o;
        this.interceptor = this;
        this.mode = t.toView;
        this.value = "";
        this.task = null;
        this.isBound = false;
        this.oL = r;
    }
    handleChange(t, i, e) {
        if (!this.isBound) return;
        const s = this.sourceExpression;
        const n = this.obs;
        const r = 10082 === s.$kind && 1 === n.count;
        let o = false;
        if (!r) {
            o = (this.mode & xi) > 0;
            if (o) n.version++;
            t = s.evaluate(e, this.$scope, this.locator, o ? this.interceptor : null);
            if (o) n.clear();
        }
        if (t != this.value) {
            this.value = t;
            if (t instanceof Array) this.observeCollection(t);
            this.owner.updateTarget(t, e);
        }
    }
    handleCollectionChange(t, i) {
        this.owner.updateTarget(void 0, i);
    }
    $bind(t, i) {
        if (this.isBound) {
            if (this.$scope === i) return;
            this.interceptor.$unbind(t);
        }
        this.isBound = true;
        this.$scope = i;
        if (this.sourceExpression.hasBind) this.sourceExpression.bind(t, i, this.interceptor);
        this.value = this.sourceExpression.evaluate(t, i, this.locator, (this.mode & xi) > 0 ? this.interceptor : null);
        if (this.value instanceof Array) this.observeCollection(this.value);
    }
    $unbind(t) {
        if (!this.isBound) return;
        this.isBound = false;
        if (this.sourceExpression.hasUnbind) this.sourceExpression.unbind(t, this.$scope, this.interceptor);
        this.$scope = void 0;
        this.obs.clearAll();
    }
}

s(InterpolationPartBinding);

class ContentBinding {
    constructor(i, e, s, n, r, o) {
        this.sourceExpression = i;
        this.target = e;
        this.locator = s;
        this.p = r;
        this.strict = o;
        this.interceptor = this;
        this.mode = t.toView;
        this.value = "";
        this.task = null;
        this.isBound = false;
        this.oL = n;
    }
    updateTarget(t, i) {
        var e, s;
        const n = this.target;
        const r = this.p.Node;
        const o = this.value;
        this.value = t;
        if (o instanceof r) null === (e = o.parentNode) || void 0 === e ? void 0 : e.removeChild(o);
        if (t instanceof r) {
            n.textContent = "";
            null === (s = n.parentNode) || void 0 === s ? void 0 : s.insertBefore(t, n);
        } else n.textContent = String(t);
    }
    handleChange(t, i, e) {
        var s;
        if (!this.isBound) return;
        const n = this.sourceExpression;
        const r = this.obs;
        const o = 10082 === n.$kind && 1 === r.count;
        let l = false;
        if (!o) {
            l = (this.mode & xi) > 0;
            if (l) r.version++;
            e |= this.strict ? 1 : 0;
            t = n.evaluate(e, this.$scope, this.locator, l ? this.interceptor : null);
            if (l) r.clear();
        }
        if (t === this.value) {
            null === (s = this.task) || void 0 === s ? void 0 : s.cancel();
            this.task = null;
            return;
        }
        const h = 0 === (2 & e);
        if (h) this.queueUpdate(t, e); else this.updateTarget(t, e);
    }
    handleCollectionChange() {
        if (!this.isBound) return;
        this.obs.version++;
        const t = this.value = this.sourceExpression.evaluate(0, this.$scope, this.locator, (this.mode & xi) > 0 ? this.interceptor : null);
        this.obs.clear();
        if (t instanceof Array) this.observeCollection(t);
        this.queueUpdate(t, 0);
    }
    $bind(t, i) {
        if (this.isBound) {
            if (this.$scope === i) return;
            this.interceptor.$unbind(t);
        }
        this.isBound = true;
        this.$scope = i;
        if (this.sourceExpression.hasBind) this.sourceExpression.bind(t, i, this.interceptor);
        t |= this.strict ? 1 : 0;
        const e = this.value = this.sourceExpression.evaluate(t, i, this.locator, (this.mode & xi) > 0 ? this.interceptor : null);
        if (e instanceof Array) this.observeCollection(e);
        this.updateTarget(e, t);
    }
    $unbind(t) {
        var i;
        if (!this.isBound) return;
        this.isBound = false;
        if (this.sourceExpression.hasUnbind) this.sourceExpression.unbind(t, this.$scope, this.interceptor);
        this.$scope = void 0;
        this.obs.clearAll();
        null === (i = this.task) || void 0 === i ? void 0 : i.cancel();
        this.task = null;
    }
    queueUpdate(t, i) {
        const e = this.task;
        this.task = this.p.domWriteQueue.queueTask((() => {
            this.task = null;
            this.updateTarget(t, i);
        }), yi);
        null === e || void 0 === e ? void 0 : e.cancel();
    }
}

s(ContentBinding);

class LetBinding {
    constructor(t, i, e, s, n = false) {
        this.sourceExpression = t;
        this.targetProperty = i;
        this.locator = s;
        this.interceptor = this;
        this.isBound = false;
        this.$scope = void 0;
        this.task = null;
        this.target = null;
        this.oL = e;
        this.Y = n;
    }
    handleChange(t, i, e) {
        if (!this.isBound) return;
        const s = this.target;
        const n = this.targetProperty;
        const r = s[n];
        this.obs.version++;
        t = this.sourceExpression.evaluate(e, this.$scope, this.locator, this.interceptor);
        this.obs.clear();
        if (t !== r) s[n] = t;
    }
    handleCollectionChange(t, i) {
        if (!this.isBound) return;
        const e = this.target;
        const s = this.targetProperty;
        const n = e[s];
        this.obs.version++;
        const r = this.sourceExpression.evaluate(i, this.$scope, this.locator, this.interceptor);
        this.obs.clear();
        if (r !== n) e[s] = r;
    }
    $bind(t, i) {
        if (this.isBound) {
            if (this.$scope === i) return;
            this.interceptor.$unbind(2 | t);
        }
        this.$scope = i;
        this.target = this.Y ? i.bindingContext : i.overrideContext;
        const e = this.sourceExpression;
        if (e.hasBind) e.bind(t, i, this.interceptor);
        this.target[this.targetProperty] = this.sourceExpression.evaluate(2 | t, i, this.locator, this.interceptor);
        this.isBound = true;
    }
    $unbind(t) {
        if (!this.isBound) return;
        const i = this.sourceExpression;
        if (i.hasUnbind) i.unbind(t, this.$scope, this.interceptor);
        this.$scope = void 0;
        this.obs.clearAll();
        this.isBound = false;
    }
}

s(LetBinding);

const {oneTime: ki, toView: Ci, fromView: Ai} = t;

const Ri = Ci | ki;

const Si = {
    reusable: false,
    preempt: true
};

class PropertyBinding {
    constructor(t, i, e, s, n, r, o) {
        this.sourceExpression = t;
        this.target = i;
        this.targetProperty = e;
        this.mode = s;
        this.locator = r;
        this.taskQueue = o;
        this.interceptor = this;
        this.isBound = false;
        this.$scope = void 0;
        this.targetObserver = void 0;
        this.persistentFlags = 0;
        this.task = null;
        this.targetSubscriber = null;
        this.oL = n;
    }
    updateTarget(t, i) {
        i |= this.persistentFlags;
        this.targetObserver.setValue(t, i, this.target, this.targetProperty);
    }
    updateSource(t, i) {
        i |= this.persistentFlags;
        this.sourceExpression.assign(i, this.$scope, this.locator, t);
    }
    handleChange(t, i, e) {
        if (!this.isBound) return;
        e |= this.persistentFlags;
        const s = 0 === (2 & e) && (4 & this.targetObserver.type) > 0;
        const n = this.obs;
        let r = false;
        if (10082 !== this.sourceExpression.$kind || n.count > 1) {
            r = this.mode > ki;
            if (r) n.version++;
            t = this.sourceExpression.evaluate(e, this.$scope, this.locator, this.interceptor);
            if (r) n.clear();
        }
        if (s) {
            Ei = this.task;
            this.task = this.taskQueue.queueTask((() => {
                this.interceptor.updateTarget(t, e);
                this.task = null;
            }), Si);
            null === Ei || void 0 === Ei ? void 0 : Ei.cancel();
            Ei = null;
        } else this.interceptor.updateTarget(t, e);
    }
    handleCollectionChange(t, i) {
        if (!this.isBound) return;
        const e = 0 === (2 & i) && (4 & this.targetObserver.type) > 0;
        this.obs.version++;
        const s = this.sourceExpression.evaluate(i, this.$scope, this.locator, this.interceptor);
        this.obs.clear();
        if (e) {
            Ei = this.task;
            this.task = this.taskQueue.queueTask((() => {
                this.interceptor.updateTarget(s, i);
                this.task = null;
            }), Si);
            null === Ei || void 0 === Ei ? void 0 : Ei.cancel();
            Ei = null;
        } else this.interceptor.updateTarget(s, i);
    }
    $bind(t, i) {
        var e;
        if (this.isBound) {
            if (this.$scope === i) return;
            this.interceptor.$unbind(2 | t);
        }
        t |= 1;
        this.persistentFlags = 33 & t;
        this.$scope = i;
        let s = this.sourceExpression;
        if (s.hasBind) s.bind(t, i, this.interceptor);
        const n = this.oL;
        const r = this.mode;
        let o = this.targetObserver;
        if (!o) {
            if (r & Ai) o = n.getObserver(this.target, this.targetProperty); else o = n.getAccessor(this.target, this.targetProperty);
            this.targetObserver = o;
        }
        s = this.sourceExpression;
        const l = this.interceptor;
        const h = (r & Ci) > 0;
        if (r & Ri) l.updateTarget(s.evaluate(t, i, this.locator, h ? l : null), t);
        if (r & Ai) {
            o.subscribe(null !== (e = this.targetSubscriber) && void 0 !== e ? e : this.targetSubscriber = new BindingTargetSubscriber(l));
            if (!h) l.updateSource(o.getValue(this.target, this.targetProperty), t);
        }
        this.isBound = true;
    }
    $unbind(t) {
        if (!this.isBound) return;
        this.persistentFlags = 0;
        if (this.sourceExpression.hasUnbind) this.sourceExpression.unbind(t, this.$scope, this.interceptor);
        this.$scope = void 0;
        Ei = this.task;
        if (this.targetSubscriber) this.targetObserver.unsubscribe(this.targetSubscriber);
        if (null != Ei) {
            Ei.cancel();
            Ei = this.task = null;
        }
        this.obs.clearAll();
        this.isBound = false;
    }
}

s(PropertyBinding);

let Ei = null;

class RefBinding {
    constructor(t, i, e) {
        this.sourceExpression = t;
        this.target = i;
        this.locator = e;
        this.interceptor = this;
        this.isBound = false;
        this.$scope = void 0;
    }
    $bind(t, i) {
        if (this.isBound) {
            if (this.$scope === i) return;
            this.interceptor.$unbind(2 | t);
        }
        this.$scope = i;
        if (this.sourceExpression.hasBind) this.sourceExpression.bind(t, i, this);
        this.sourceExpression.assign(t, this.$scope, this.locator, this.target);
        this.isBound = true;
    }
    $unbind(t) {
        if (!this.isBound) return;
        let i = this.sourceExpression;
        if (i.evaluate(t, this.$scope, this.locator, null) === this.target) i.assign(t, this.$scope, this.locator, null);
        i = this.sourceExpression;
        if (i.hasUnbind) i.unbind(t, this.$scope, this.interceptor);
        this.$scope = void 0;
        this.isBound = false;
    }
    observe(t, i) {
        return;
    }
    handleChange(t, i, e) {
        return;
    }
}

const Bi = L.createInterface("IAppTask");

class $AppTask {
    constructor(t, i, e) {
        this.c = void 0;
        this.slot = t;
        this.k = i;
        this.cb = e;
    }
    register(t) {
        return this.c = t.register(Ft(Bi, this));
    }
    run() {
        const t = this.k;
        const i = this.cb;
        return null === t ? i() : i(this.c.get(t));
    }
}

const Ii = Object.freeze({
    creating: Ti("creating"),
    hydrating: Ti("hydrating"),
    hydrated: Ti("hydrated"),
    activating: Ti("activating"),
    activated: Ti("activated"),
    deactivating: Ti("deactivating"),
    deactivated: Ti("deactivated")
});

function Ti(t) {
    function i(i, e) {
        if (At(e)) return new $AppTask(t, i, e);
        return new $AppTask(t, null, i);
    }
    return i;
}

function Di(t, i) {
    let e;
    function s(t, i) {
        if (arguments.length > 1) e.property = i;
        ut(Pi, ChildrenDefinition.create(i, e), t.constructor, i);
        pt(t.constructor, Oi.keyFrom(i));
    }
    if (arguments.length > 1) {
        e = {};
        s(t, i);
        return;
    } else if (Rt(t)) {
        e = {};
        return s;
    }
    e = void 0 === t ? {} : t;
    return s;
}

function $i(t) {
    return t.startsWith(Pi);
}

const Pi = vt("children-observer");

const Oi = Object.freeze({
    name: Pi,
    keyFrom: t => `${Pi}:${t}`,
    from(...t) {
        const i = {};
        const e = Array.isArray;
        function s(t) {
            i[t] = ChildrenDefinition.create(t);
        }
        function n(t, e) {
            i[t] = ChildrenDefinition.create(t, e);
        }
        function r(t) {
            if (e(t)) t.forEach(s); else if (t instanceof ChildrenDefinition) i[t.property] = t; else if (void 0 !== t) Object.keys(t).forEach((i => n(i, t)));
        }
        t.forEach(r);
        return i;
    },
    getAll(t) {
        const i = Pi.length + 1;
        const e = [];
        const s = T(t);
        let n = s.length;
        let r = 0;
        let o;
        let l;
        let h;
        while (--n >= 0) {
            h = s[n];
            o = wt(h).filter($i);
            l = o.length;
            for (let t = 0; t < l; ++t) e[r++] = ct(Pi, h, o[t].slice(i));
        }
        return e;
    }
});

const Li = {
    childList: true
};

class ChildrenDefinition {
    constructor(t, i, e, s, n, r) {
        this.callback = t;
        this.property = i;
        this.options = e;
        this.query = s;
        this.filter = n;
        this.map = r;
    }
    static create(t, i = {}) {
        var e;
        return new ChildrenDefinition(D(i.callback, `${t}Changed`), D(i.property, t), null !== (e = i.options) && void 0 !== e ? e : Li, i.query, i.filter, i.map);
    }
}

class ChildrenObserver {
    constructor(t, i, e, s, n = qi, r = Ui, o = _i, l) {
        this.controller = t;
        this.obj = i;
        this.propertyKey = e;
        this.query = n;
        this.filter = r;
        this.map = o;
        this.options = l;
        this.observing = false;
        this.children = void 0;
        this.observer = void 0;
        this.callback = i[s];
        Reflect.defineProperty(this.obj, this.propertyKey, {
            enumerable: true,
            configurable: true,
            get: () => this.getValue(),
            set: () => {}
        });
    }
    getValue() {
        return this.observing ? this.children : this.get();
    }
    setValue(t) {}
    start() {
        var t;
        if (!this.observing) {
            this.observing = true;
            this.children = this.get();
            (null !== (t = this.observer) && void 0 !== t ? t : this.observer = new this.controller.host.ownerDocument.defaultView.MutationObserver((() => {
                this.Z();
            }))).observe(this.controller.host, this.options);
        }
    }
    stop() {
        if (this.observing) {
            this.observing = false;
            this.observer.disconnect();
            this.children = q;
        }
    }
    Z() {
        this.children = this.get();
        if (void 0 !== this.callback) this.callback.call(this.obj);
        this.subs.notify(this.children, void 0, 0);
    }
    get() {
        return Fi(this.controller, this.query, this.filter, this.map);
    }
}

i()(ChildrenObserver);

function qi(t) {
    return t.host.childNodes;
}

function Ui(t, i, e) {
    return !!e;
}

function _i(t, i, e) {
    return e;
}

const Vi = {
    optional: true
};

function Fi(t, i, e, s) {
    var n;
    const r = i(t);
    const o = r.length;
    const l = [];
    let h;
    let c;
    let a;
    let u = 0;
    for (;u < o; ++u) {
        h = r[u];
        c = be(h, Vi);
        a = null !== (n = null === c || void 0 === c ? void 0 : c.viewModel) && void 0 !== n ? n : null;
        if (e(h, c, a)) l.push(s(h, c, a));
    }
    return l;
}

function Mi(t) {
    return function(i) {
        return Xi(t, i);
    };
}

function ji(t) {
    return function(i) {
        return Xi(Rt(t) ? {
            isTemplateController: true,
            name: t
        } : {
            isTemplateController: true,
            ...t
        }, i);
    };
}

class CustomAttributeDefinition {
    constructor(t, i, e, s, n, r, o, l, h, c) {
        this.Type = t;
        this.name = i;
        this.aliases = e;
        this.key = s;
        this.defaultBindingMode = n;
        this.isTemplateController = r;
        this.bindables = o;
        this.noMultiBindings = l;
        this.watches = h;
        this.dependencies = c;
    }
    get type() {
        return 2;
    }
    static create(i, e) {
        let s;
        let n;
        if (Rt(i)) {
            s = i;
            n = {
                name: s
            };
        } else {
            s = i.name;
            n = i;
        }
        return new CustomAttributeDefinition(e, D(Wi(e, "name"), s), V(Wi(e, "aliases"), n.aliases, e.aliases), Hi(s), D(Wi(e, "defaultBindingMode"), n.defaultBindingMode, e.defaultBindingMode, t.toView), D(Wi(e, "isTemplateController"), n.isTemplateController, e.isTemplateController, false), Dt.from(e, ...Dt.getAll(e), Wi(e, "bindables"), e.bindables, n.bindables), D(Wi(e, "noMultiBindings"), n.noMultiBindings, e.noMultiBindings, false), V(te.getAnnotation(e), e.watches), V(Wi(e, "dependencies"), n.dependencies, e.dependencies));
    }
    register(t) {
        const {Type: i, key: e, aliases: s} = this;
        jt(e, i).register(t);
        Vt(e, i).register(t);
        n(s, Yi, e, t);
    }
}

const Ni = mt("custom-attribute");

const Hi = t => `${Ni}:${t}`;

const Wi = (t, i) => ct(vt(i), t);

const zi = t => At(t) && at(Ni, t);

const Gi = (t, i) => {
    var e;
    return null !== (e = Ps(t, Hi(i))) && void 0 !== e ? e : void 0;
};

const Xi = (t, i) => {
    const e = CustomAttributeDefinition.create(t, i);
    ut(Ni, e, e.Type);
    ut(Ni, e, e);
    gt(i, Ni);
    return e.Type;
};

const Ki = t => {
    const i = ct(Ni, t);
    if (void 0 === i) throw new Error(`AUR0759:${t.name}`);
    return i;
};

const Yi = Object.freeze({
    name: Ni,
    keyFrom: Hi,
    isType: zi,
    for: Gi,
    define: Xi,
    getDefinition: Ki,
    annotate(t, i, e) {
        ut(vt(i), e, t);
    },
    getAnnotation: Wi
});

function Zi(t, i) {
    if (null == t) throw new Error(`AUR0772`);
    return function e(s, n, r) {
        const o = null == n;
        const l = o ? s : s.constructor;
        const h = new WatchDefinition(t, o ? i : r.value);
        if (o) {
            if (!At(i) && (null == i || !(i in l.prototype))) throw new Error(`AUR0773:${String(i)}@${l.name}}`);
        } else if (!At(null === r || void 0 === r ? void 0 : r.value)) throw new Error(`AUR0774:${String(n)}`);
        te.add(l, h);
        if (zi(l)) Ki(l).watches.push(h);
        if (we(l)) ye(l).watches.push(h);
    };
}

class WatchDefinition {
    constructor(t, i) {
        this.expression = t;
        this.callback = i;
    }
}

const Ji = q;

const Qi = vt("watch");

const te = Object.freeze({
    name: Qi,
    add(t, i) {
        let e = ct(Qi, t);
        if (null == e) ut(Qi, e = [], t);
        e.push(i);
    },
    getAnnotation(t) {
        var i;
        return null !== (i = ct(Qi, t)) && void 0 !== i ? i : Ji;
    }
});

function ie(t) {
    return function(i) {
        return pe(t, i);
    };
}

function ee(t) {
    if (void 0 === t) return function(t) {
        ge(t, "shadowOptions", {
            mode: "open"
        });
    };
    if (!At(t)) return function(i) {
        ge(i, "shadowOptions", t);
    };
    ge(t, "shadowOptions", {
        mode: "open"
    });
}

function se(t) {
    if (void 0 === t) return function(t) {
        ne(t);
    };
    ne(t);
}

function ne(t) {
    const i = ct(de, t);
    if (void 0 === i) {
        ge(t, "containerless", true);
        return;
    }
    i.containerless = true;
}

function re(t) {
    if (void 0 === t) return function(t) {
        ge(t, "isStrictBinding", true);
    };
    ge(t, "isStrictBinding", true);
}

const oe = new WeakMap;

class CustomElementDefinition {
    constructor(t, i, e, s, n, r, o, l, h, c, a, u, f, d, v, m, g, p, w, b, x) {
        this.Type = t;
        this.name = i;
        this.aliases = e;
        this.key = s;
        this.cache = n;
        this.capture = r;
        this.template = o;
        this.instructions = l;
        this.dependencies = h;
        this.injectable = c;
        this.needsCompile = a;
        this.surrogates = u;
        this.bindables = f;
        this.childrenObservers = d;
        this.containerless = v;
        this.isStrictBinding = m;
        this.shadowOptions = g;
        this.hasSlots = p;
        this.enhance = w;
        this.watches = b;
        this.processContent = x;
    }
    get type() {
        return 1;
    }
    static create(t, i = null) {
        if (null === i) {
            const e = t;
            if (Rt(e)) throw new Error(`AUR0761:${t}`);
            const s = F("name", e, me);
            if (At(e.Type)) i = e.Type; else i = Ce(M(s));
            return new CustomElementDefinition(i, s, V(e.aliases), F("key", e, (() => ve(s))), F("cache", e, he), F("capture", e, ae), F("template", e, ce), V(e.instructions), V(e.dependencies), F("injectable", e, ce), F("needsCompile", e, ue), V(e.surrogates), Dt.from(i, e.bindables), Oi.from(e.childrenObservers), F("containerless", e, ae), F("isStrictBinding", e, ae), F("shadowOptions", e, ce), F("hasSlots", e, ae), F("enhance", e, ae), F("watches", e, fe), j("processContent", i, ce));
        }
        if (Rt(t)) return new CustomElementDefinition(i, t, V(xe(i, "aliases"), i.aliases), ve(t), j("cache", i, he), j("capture", i, ae), j("template", i, ce), V(xe(i, "instructions"), i.instructions), V(xe(i, "dependencies"), i.dependencies), j("injectable", i, ce), j("needsCompile", i, ue), V(xe(i, "surrogates"), i.surrogates), Dt.from(i, ...Dt.getAll(i), xe(i, "bindables"), i.bindables), Oi.from(...Oi.getAll(i), xe(i, "childrenObservers"), i.childrenObservers), j("containerless", i, ae), j("isStrictBinding", i, ae), j("shadowOptions", i, ce), j("hasSlots", i, ae), j("enhance", i, ae), V(te.getAnnotation(i), i.watches), j("processContent", i, ce));
        const e = F("name", t, me);
        return new CustomElementDefinition(i, e, V(xe(i, "aliases"), t.aliases, i.aliases), ve(e), N("cache", t, i, he), N("capture", t, i, ae), N("template", t, i, ce), V(xe(i, "instructions"), t.instructions, i.instructions), V(xe(i, "dependencies"), t.dependencies, i.dependencies), N("injectable", t, i, ce), N("needsCompile", t, i, ue), V(xe(i, "surrogates"), t.surrogates, i.surrogates), Dt.from(i, ...Dt.getAll(i), xe(i, "bindables"), i.bindables, t.bindables), Oi.from(...Oi.getAll(i), xe(i, "childrenObservers"), i.childrenObservers, t.childrenObservers), N("containerless", t, i, ae), N("isStrictBinding", t, i, ae), N("shadowOptions", t, i, ce), N("hasSlots", t, i, ae), N("enhance", t, i, ae), V(t.watches, te.getAnnotation(i), i.watches), N("processContent", t, i, ce));
    }
    static getOrCreate(t) {
        if (t instanceof CustomElementDefinition) return t;
        if (oe.has(t)) return oe.get(t);
        const i = CustomElementDefinition.create(t);
        oe.set(t, i);
        ut(de, i, i.Type);
        return i;
    }
    register(t) {
        const {Type: i, key: e, aliases: s} = this;
        if (!t.has(e, false)) {
            jt(e, i).register(t);
            Vt(e, i).register(t);
            n(s, Ae, e, t);
        }
    }
}

const le = {
    name: void 0,
    searchParents: false,
    optional: false
};

const he = () => 0;

const ce = () => null;

const ae = () => false;

const ue = () => true;

const fe = () => q;

const de = mt("custom-element");

const ve = t => `${de}:${t}`;

const me = (() => {
    let t = 0;
    return () => `unnamed-${++t}`;
})();

const ge = (t, i, e) => {
    ut(vt(i), e, t);
};

const pe = (t, i) => {
    const e = CustomElementDefinition.create(t, i);
    ut(de, e, e.Type);
    ut(de, e, e);
    gt(e.Type, de);
    return e.Type;
};

const we = t => At(t) && at(de, t);

const be = (t, i = le) => {
    if (void 0 === i.name && true !== i.searchParents) {
        const e = Ps(t, de);
        if (null === e) {
            if (true === i.optional) return null;
            throw new Error(`AUR0762`);
        }
        return e;
    }
    if (void 0 !== i.name) {
        if (true !== i.searchParents) {
            const e = Ps(t, de);
            if (null === e) throw new Error(`AUR0763`);
            if (e.is(i.name)) return e;
            return;
        }
        let e = t;
        let s = false;
        while (null !== e) {
            const t = Ps(e, de);
            if (null !== t) {
                s = true;
                if (t.is(i.name)) return t;
            }
            e = Fs(e);
        }
        if (s) return;
        throw new Error(`AUR0764`);
    }
    let e = t;
    while (null !== e) {
        const t = Ps(e, de);
        if (null !== t) return t;
        e = Fs(e);
    }
    throw new Error(`AUR0765`);
};

const xe = (t, i) => ct(vt(i), t);

const ye = t => {
    const i = ct(de, t);
    if (void 0 === i) throw new Error(`AUR0760:${t.name}`);
    return i;
};

const ke = () => {
    const t = function(i, e, s) {
        const n = L.getOrCreateAnnotationParamTypes(i);
        n[s] = t;
        return i;
    };
    t.register = function(i) {
        return {
            resolve(i, e) {
                if (e.has(t, true)) return e.get(t); else return null;
            }
        };
    };
    return t;
};

const Ce = function() {
    const t = {
        value: "",
        writable: false,
        enumerable: false,
        configurable: true
    };
    const i = {};
    return function(e, s = i) {
        const n = class {};
        t.value = e;
        Reflect.defineProperty(n, "name", t);
        if (s !== i) Object.assign(n.prototype, s);
        return n;
    };
}();

const Ae = Object.freeze({
    name: de,
    keyFrom: ve,
    isType: we,
    for: be,
    define: pe,
    getDefinition: ye,
    annotate: ge,
    getAnnotation: xe,
    generateName: me,
    createInjectable: ke,
    generateType: Ce
});

const Re = vt("processContent");

function Se(t) {
    return void 0 === t ? function(t, i, e) {
        ut(Re, Ee(t, i), t);
    } : function(i) {
        t = Ee(i, t);
        const e = ct(de, i);
        if (void 0 !== e) e.processContent = t; else ut(Re, t, i);
        return i;
    };
}

function Ee(t, i) {
    if (Rt(i)) i = t[i];
    if (!At(i)) throw new Error(`AUR0766:${typeof i}`);
    return i;
}

function Be(t) {
    return function(i) {
        const e = At(t) ? t : true;
        ge(i, "capture", e);
        if (we(i)) ye(i).capture = e;
    };
}

class ClassAttributeAccessor {
    constructor(t) {
        this.obj = t;
        this.type = 2 | 4;
        this.value = "";
        this.ov = "";
        this.J = {};
        this.tt = 0;
        this.W = false;
    }
    get doNotCache() {
        return true;
    }
    getValue() {
        return this.value;
    }
    setValue(t, i) {
        this.value = t;
        this.W = t !== this.ov;
        if (0 === (32 & i)) this.K();
    }
    K() {
        if (this.W) {
            this.W = false;
            const t = this.value;
            const i = this.J;
            const e = Ie(t);
            let s = this.tt;
            this.ov = t;
            if (e.length > 0) this.it(e);
            this.tt += 1;
            if (0 === s) return;
            s -= 1;
            for (const t in i) {
                if (!xt.call(i, t) || i[t] !== s) continue;
                this.obj.classList.remove(t);
            }
        }
    }
    it(t) {
        const i = this.obj;
        const e = t.length;
        let s = 0;
        let n;
        for (;s < e; s++) {
            n = t[s];
            if (0 === n.length) continue;
            this.J[n] = this.tt;
            i.classList.add(n);
        }
    }
}

function Ie(t) {
    if (Rt(t)) return Te(t);
    if ("object" !== typeof t) return q;
    if (t instanceof Array) {
        const i = t.length;
        if (i > 0) {
            const e = [];
            let s = 0;
            for (;i > s; ++s) e.push(...Ie(t[s]));
            return e;
        } else return q;
    }
    const i = [];
    let e;
    for (e in t) if (Boolean(t[e])) if (e.includes(" ")) i.push(...Te(e)); else i.push(e);
    return i;
}

function Te(t) {
    const i = t.match(/\S+/g);
    if (null === i) return q;
    return i;
}

function De(...t) {
    return new CSSModulesProcessorRegistry(t);
}

class CSSModulesProcessorRegistry {
    constructor(t) {
        this.modules = t;
    }
    register(t) {
        var i;
        const e = Object.assign({}, ...this.modules);
        const s = Xi({
            name: "class",
            bindables: [ "value" ],
            noMultiBindings: true
        }, (i = class CustomAttributeClass {
            constructor(t) {
                this.element = t;
            }
            binding() {
                this.valueChanged();
            }
            valueChanged() {
                if (!this.value) {
                    this.element.className = "";
                    return;
                }
                this.element.className = Ie(this.value).map((t => e[t] || t)).join(" ");
            }
        }, i.inject = [ Ls ], i));
        t.register(s);
    }
}

function $e(...t) {
    return new ShadowDOMRegistry(t);
}

const Pe = L.createInterface("IShadowDOMStyleFactory", (t => t.cachedCallback((t => {
    if (AdoptedStyleSheetsStyles.supported(t.get(ni))) return t.get(AdoptedStyleSheetsStylesFactory);
    return t.get(StyleElementStylesFactory);
}))));

class ShadowDOMRegistry {
    constructor(t) {
        this.css = t;
    }
    register(t) {
        const i = t.get(Le);
        const e = t.get(Pe);
        t.register(Ft(Oe, e.createStyles(this.css, i)));
    }
}

class AdoptedStyleSheetsStylesFactory {
    constructor(t) {
        this.p = t;
        this.cache = new Map;
    }
    createStyles(t, i) {
        return new AdoptedStyleSheetsStyles(this.p, t, this.cache, i);
    }
}

AdoptedStyleSheetsStylesFactory.inject = [ ni ];

class StyleElementStylesFactory {
    constructor(t) {
        this.p = t;
    }
    createStyles(t, i) {
        return new StyleElementStyles(this.p, t, i);
    }
}

StyleElementStylesFactory.inject = [ ni ];

const Oe = L.createInterface("IShadowDOMStyles");

const Le = L.createInterface("IShadowDOMGlobalStyles", (t => t.instance({
    applyTo: P
})));

class AdoptedStyleSheetsStyles {
    constructor(t, i, e, s = null) {
        this.sharedStyles = s;
        this.styleSheets = i.map((i => {
            let s;
            if (i instanceof t.CSSStyleSheet) s = i; else {
                s = e.get(i);
                if (void 0 === s) {
                    s = new t.CSSStyleSheet;
                    s.replaceSync(i);
                    e.set(i, s);
                }
            }
            return s;
        }));
    }
    static supported(t) {
        return "adoptedStyleSheets" in t.ShadowRoot.prototype;
    }
    applyTo(t) {
        if (null !== this.sharedStyles) this.sharedStyles.applyTo(t);
        t.adoptedStyleSheets = [ ...t.adoptedStyleSheets, ...this.styleSheets ];
    }
}

class StyleElementStyles {
    constructor(t, i, e = null) {
        this.p = t;
        this.localStyles = i;
        this.sharedStyles = e;
    }
    applyTo(t) {
        const i = this.localStyles;
        const e = this.p;
        for (let s = i.length - 1; s > -1; --s) {
            const n = e.document.createElement("style");
            n.innerHTML = i[s];
            t.prepend(n);
        }
        if (null !== this.sharedStyles) this.sharedStyles.applyTo(t);
    }
}

const qe = {
    shadowDOM(t) {
        return Ii.creating(H, (i => {
            if (null != t.sharedStyles) {
                const e = i.get(Pe);
                i.register(Ft(Le, e.createStyles(t.sharedStyles, null)));
            }
        }));
    }
};

const {enter: Ue, exit: _e} = r;

const {wrap: Ve, unwrap: Fe} = o;

class ComputedWatcher {
    constructor(t, i, e, s, n) {
        this.obj = t;
        this.get = e;
        this.cb = s;
        this.useProxy = n;
        this.interceptor = this;
        this.value = void 0;
        this.isBound = false;
        this.running = false;
        this.oL = i;
    }
    handleChange() {
        this.run();
    }
    handleCollectionChange() {
        this.run();
    }
    $bind() {
        if (this.isBound) return;
        this.isBound = true;
        this.compute();
    }
    $unbind() {
        if (!this.isBound) return;
        this.isBound = false;
        this.obs.clearAll();
    }
    run() {
        if (!this.isBound || this.running) return;
        const t = this.obj;
        const i = this.value;
        const e = this.compute();
        if (!Object.is(e, i)) this.cb.call(t, e, i, t);
    }
    compute() {
        this.running = true;
        this.obs.version++;
        try {
            Ue(this);
            return this.value = Fe(this.get.call(void 0, this.useProxy ? Ve(this.obj) : this.obj, this));
        } finally {
            this.obs.clear();
            this.running = false;
            _e(this);
        }
    }
}

class ExpressionWatcher {
    constructor(t, i, e, s, n) {
        this.scope = t;
        this.locator = i;
        this.oL = e;
        this.expression = s;
        this.callback = n;
        this.interceptor = this;
        this.isBound = false;
        this.obj = t.bindingContext;
    }
    handleChange(t) {
        const i = this.expression;
        const e = this.obj;
        const s = this.value;
        const n = 10082 === i.$kind && 1 === this.obs.count;
        if (!n) {
            this.obs.version++;
            t = i.evaluate(0, this.scope, this.locator, this);
            this.obs.clear();
        }
        if (!Object.is(t, s)) {
            this.value = t;
            this.callback.call(e, t, s, e);
        }
    }
    $bind() {
        if (this.isBound) return;
        this.isBound = true;
        this.obs.version++;
        this.value = this.expression.evaluate(0, this.scope, this.locator, this);
        this.obs.clear();
    }
    $unbind() {
        if (!this.isBound) return;
        this.isBound = false;
        this.obs.clearAll();
        this.value = void 0;
    }
}

s(ComputedWatcher);

s(ExpressionWatcher);

const Me = L.createInterface("ILifecycleHooks");

class LifecycleHooksEntry {
    constructor(t, i) {
        this.definition = t;
        this.instance = i;
    }
}

class LifecycleHooksDefinition {
    constructor(t, i) {
        this.Type = t;
        this.propertyNames = i;
    }
    static create(t, i) {
        const e = new Set;
        let s = i.prototype;
        while (s !== Object.prototype) {
            for (const t of Object.getOwnPropertyNames(s)) if ("constructor" !== t) e.add(t);
            s = Object.getPrototypeOf(s);
        }
        return new LifecycleHooksDefinition(i, e);
    }
    register(t) {
        _t(Me, this.Type).register(t);
    }
}

const je = new WeakMap;

const Ne = vt("lifecycle-hooks");

const He = Object.freeze({
    name: Ne,
    define(t, i) {
        const e = LifecycleHooksDefinition.create(t, i);
        ut(Ne, e, i);
        gt(i, Ne);
        return e.Type;
    },
    resolve(t) {
        let i = je.get(t);
        if (void 0 === i) {
            je.set(t, i = new LifecycleHooksLookupImpl);
            const e = t.root;
            const s = e.id === t.id ? t.getAll(Me) : t.has(Me, false) ? e.getAll(Me).concat(t.getAll(Me)) : e.getAll(Me);
            let n;
            let r;
            let o;
            let l;
            let h;
            for (n of s) {
                r = ct(Ne, n.constructor);
                o = new LifecycleHooksEntry(r, n);
                for (l of r.propertyNames) {
                    h = i[l];
                    if (void 0 === h) i[l] = [ o ]; else h.push(o);
                }
            }
        }
        return i;
    }
});

class LifecycleHooksLookupImpl {}

function We() {
    return function t(i) {
        return He.define({}, i);
    };
}

const ze = L.createInterface("IViewFactory");

class ViewFactory {
    constructor(t, i) {
        this.isCaching = false;
        this.cache = null;
        this.cacheSize = -1;
        this.name = i.name;
        this.container = t;
        this.def = i;
    }
    setCacheSize(t, i) {
        if (t) {
            if ("*" === t) t = ViewFactory.maxCacheSize; else if (Rt(t)) t = parseInt(t, 10);
            if (-1 === this.cacheSize || !i) this.cacheSize = t;
        }
        if (this.cacheSize > 0) this.cache = []; else this.cache = null;
        this.isCaching = this.cacheSize > 0;
    }
    canReturnToCache(t) {
        return null != this.cache && this.cache.length < this.cacheSize;
    }
    tryReturnToCache(t) {
        if (this.canReturnToCache(t)) {
            this.cache.push(t);
            return true;
        }
        return false;
    }
    create(t) {
        const i = this.cache;
        let e;
        if (null != i && i.length > 0) {
            e = i.pop();
            return e;
        }
        e = Controller.$view(this, t);
        return e;
    }
}

ViewFactory.maxCacheSize = 65535;

const Ge = new WeakSet;

function Xe(t) {
    return !Ge.has(t);
}

function Ke(t) {
    Ge.add(t);
    return CustomElementDefinition.create(t);
}

const Ye = mt("views");

const Ze = Object.freeze({
    name: Ye,
    has(t) {
        return At(t) && (at(Ye, t) || "$views" in t);
    },
    get(t) {
        if (At(t) && "$views" in t) {
            const i = t.$views;
            const e = i.filter(Xe).map(Ke);
            for (const i of e) Ze.add(t, i);
        }
        let i = ct(Ye, t);
        if (void 0 === i) ut(Ye, i = [], t);
        return i;
    },
    add(t, i) {
        const e = CustomElementDefinition.create(i);
        let s = ct(Ye, t);
        if (void 0 === s) ut(Ye, s = [ e ], t); else s.push(e);
        return s;
    }
});

function Je(t) {
    return function(i) {
        Ze.add(i, t);
    };
}

const Qe = L.createInterface("IViewLocator", (t => t.singleton(ViewLocator)));

class ViewLocator {
    constructor() {
        this.et = new WeakMap;
        this.st = new Map;
    }
    getViewComponentForObject(t, i) {
        if (t) {
            const e = Ze.has(t.constructor) ? Ze.get(t.constructor) : [];
            const s = At(i) ? i(t, e) : this.nt(e, i);
            return this.rt(t, e, s);
        }
        return null;
    }
    rt(t, i, e) {
        let s = this.et.get(t);
        let n;
        if (void 0 === s) {
            s = {};
            this.et.set(t, s);
        } else n = s[e];
        if (void 0 === n) {
            const r = this.ot(t, i, e);
            n = pe(ye(r), class extends r {
                constructor() {
                    super(t);
                }
            });
            s[e] = n;
        }
        return n;
    }
    ot(t, i, e) {
        let s = this.st.get(t.constructor);
        let n;
        if (void 0 === s) {
            s = {};
            this.st.set(t.constructor, s);
        } else n = s[e];
        if (void 0 === n) {
            n = pe(this.lt(i, e), class {
                constructor(t) {
                    this.viewModel = t;
                }
                define(t, i, e) {
                    const s = this.viewModel;
                    t.scope = l.fromParent(t.scope, s);
                    if (void 0 !== s.define) return s.define(t, i, e);
                }
            });
            const r = n.prototype;
            if ("hydrating" in t) r.hydrating = function t(i) {
                this.viewModel.hydrating(i);
            };
            if ("hydrated" in t) r.hydrated = function t(i) {
                this.viewModel.hydrated(i);
            };
            if ("created" in t) r.created = function t(i) {
                this.viewModel.created(i);
            };
            if ("binding" in t) r.binding = function t(i, e, s) {
                return this.viewModel.binding(i, e, s);
            };
            if ("bound" in t) r.bound = function t(i, e, s) {
                return this.viewModel.bound(i, e, s);
            };
            if ("attaching" in t) r.attaching = function t(i, e, s) {
                return this.viewModel.attaching(i, e, s);
            };
            if ("attached" in t) r.attached = function t(i, e) {
                return this.viewModel.attached(i, e);
            };
            if ("detaching" in t) r.detaching = function t(i, e, s) {
                return this.viewModel.detaching(i, e, s);
            };
            if ("unbinding" in t) r.unbinding = function t(i, e, s) {
                return this.viewModel.unbinding(i, e, s);
            };
            if ("dispose" in t) r.dispose = function t() {
                this.viewModel.dispose();
            };
            s[e] = n;
        }
        return n;
    }
    nt(t, i) {
        if (i) return i;
        if (1 === t.length) return t[0].name;
        return "default-view";
    }
    lt(t, i) {
        const e = t.find((t => t.name === i));
        if (void 0 === e) throw new Error(`Could not find view: ${i}`);
        return e;
    }
}

const ts = L.createInterface("IRendering", (t => t.singleton(Rendering)));

class Rendering {
    constructor(t) {
        this.ht = new WeakMap;
        this.ct = new WeakMap;
        this.ut = (this.ft = t.root).get(ni);
        this.dt = new FragmentNodeSequence(this.ut, this.ut.document.createDocumentFragment());
    }
    get renderers() {
        return null == this.rs ? this.rs = this.ft.getAll(sn, false).reduce(((t, i) => {
            t[i.target] = i;
            return t;
        }), bt()) : this.rs;
    }
    compile(t, i, e) {
        if (false !== t.needsCompile) {
            const s = this.ht;
            const n = i.get(en);
            let r = s.get(t);
            if (null == r) s.set(t, r = n.compile(t, i, e)); else i.register(...r.dependencies);
            return r;
        }
        return t;
    }
    getViewFactory(t, i) {
        return new ViewFactory(i, CustomElementDefinition.getOrCreate(t));
    }
    createNodes(t) {
        if (true === t.enhance) return new FragmentNodeSequence(this.ut, t.template);
        let i;
        const e = this.ct;
        if (e.has(t)) i = e.get(t); else {
            const s = this.ut;
            const n = s.document;
            const r = t.template;
            let o;
            if (null === r) i = null; else if (r instanceof s.Node) if ("TEMPLATE" === r.nodeName) i = n.adoptNode(r.content); else (i = n.adoptNode(n.createDocumentFragment())).appendChild(r.cloneNode(true)); else {
                o = n.createElement("template");
                if (Rt(r)) o.innerHTML = r;
                n.adoptNode(i = o.content);
            }
            e.set(t, i);
        }
        return null == i ? this.dt : new FragmentNodeSequence(this.ut, i.cloneNode(true));
    }
    render(t, i, e, s) {
        const n = e.instructions;
        const r = this.renderers;
        const o = i.length;
        if (i.length !== n.length) throw new Error(`AUR0757:${o}<>${n.length}`);
        let l = 0;
        let h = 0;
        let c = 0;
        let a;
        let u;
        let f;
        if (o > 0) while (o > l) {
            a = n[l];
            f = i[l];
            h = 0;
            c = a.length;
            while (c > h) {
                u = a[h];
                r[u.type].render(t, f, u);
                ++h;
            }
            ++l;
        }
        if (void 0 !== s && null !== s) {
            a = e.surrogates;
            if ((c = a.length) > 0) {
                h = 0;
                while (c > h) {
                    u = a[h];
                    r[u.type].render(t, s, u);
                    ++h;
                }
            }
        }
    }
}

Rendering.inject = [ H ];

var is;

(function(t) {
    t[t["none"] = 0] = "none";
    t[t["host"] = 1] = "host";
    t[t["shadowRoot"] = 2] = "shadowRoot";
    t[t["location"] = 3] = "location";
})(is || (is = {}));

const es = {
    optional: true
};

const ss = new WeakMap;

class Controller {
    constructor(t, i, e, s, n, r, o) {
        this.container = t;
        this.vmKind = i;
        this.definition = e;
        this.viewFactory = s;
        this.viewModel = n;
        this.host = r;
        this.id = W("au$component");
        this.head = null;
        this.tail = null;
        this.next = null;
        this.parent = null;
        this.bindings = null;
        this.children = null;
        this.hasLockedScope = false;
        this.isStrictBinding = false;
        this.scope = null;
        this.isBound = false;
        this.hostController = null;
        this.mountTarget = 0;
        this.shadowRoot = null;
        this.nodes = null;
        this.location = null;
        this.lifecycleHooks = null;
        this.state = 0;
        this.vt = false;
        this.gt = q;
        this.flags = 0;
        this.$initiator = null;
        this.$flags = 0;
        this.$resolve = void 0;
        this.$reject = void 0;
        this.$promise = void 0;
        this.wt = 0;
        this.bt = 0;
        this.xt = 0;
        this.location = o;
        this.r = t.root.get(ts);
        switch (i) {
          case 1:
          case 0:
            this.hooks = new HooksDefinition(n);
            break;

          case 2:
            this.hooks = HooksDefinition.none;
            break;
        }
    }
    get isActive() {
        return (this.state & (1 | 2)) > 0 && 0 === (4 & this.state);
    }
    get name() {
        var t;
        if (null === this.parent) switch (this.vmKind) {
          case 1:
            return `[${this.definition.name}]`;

          case 0:
            return this.definition.name;

          case 2:
            return this.viewFactory.name;
        }
        switch (this.vmKind) {
          case 1:
            return `${this.parent.name}>[${this.definition.name}]`;

          case 0:
            return `${this.parent.name}>${this.definition.name}`;

          case 2:
            return this.viewFactory.name === (null === (t = this.parent.definition) || void 0 === t ? void 0 : t.name) ? `${this.parent.name}[view]` : `${this.parent.name}[view:${this.viewFactory.name}]`;
        }
    }
    static getCached(t) {
        return ss.get(t);
    }
    static getCachedOrThrow(t) {
        const i = Controller.getCached(t);
        if (void 0 === i) throw new Error(`AUR0500:${t}`);
        return i;
    }
    static $el(t, i, e, s, n = void 0, r = null) {
        if (ss.has(i)) return ss.get(i);
        n = null !== n && void 0 !== n ? n : ye(i.constructor);
        const o = new Controller(t, 0, n, null, i, e, r);
        const l = t.get(z(ps));
        if (n.dependencies.length > 0) t.register(...n.dependencies);
        t.registerResolver(ps, new G("IHydrationContext", new HydrationContext(o, s, l)));
        ss.set(i, o);
        if (null == s || false !== s.hydrate) o.hE(s, l);
        return o;
    }
    static $attr(t, i, e, s) {
        if (ss.has(i)) return ss.get(i);
        s = null !== s && void 0 !== s ? s : Ki(i.constructor);
        const n = new Controller(t, 1, s, null, i, e, null);
        if (s.dependencies.length > 0) t.register(...s.dependencies);
        ss.set(i, n);
        n.yt();
        return n;
    }
    static $view(t, i = void 0) {
        const e = new Controller(t.container, 2, null, t, null, null, null);
        e.parent = null !== i && void 0 !== i ? i : null;
        e.kt();
        return e;
    }
    hE(t, i) {
        const e = this.container;
        const s = this.flags;
        const n = this.viewModel;
        let r = this.definition;
        this.scope = l.create(n, null, true);
        if (r.watches.length > 0) cs(this, e, r, n);
        rs(this, r, s, n);
        this.gt = os(this, r, n);
        if (this.hooks.hasDefine) {
            const t = n.define(this, i, r);
            if (void 0 !== t && t !== r) r = CustomElementDefinition.getOrCreate(t);
        }
        this.lifecycleHooks = He.resolve(e);
        r.register(e);
        if (null !== r.injectable) e.registerResolver(r.injectable, new G("definition.injectable", n));
        if (null == t || false !== t.hydrate) {
            this.hS(t);
            this.hC();
        }
    }
    hS(t) {
        if (void 0 !== this.lifecycleHooks.hydrating) this.lifecycleHooks.hydrating.forEach(xs, this);
        if (this.hooks.hasHydrating) this.viewModel.hydrating(this);
        const i = this.Ct = this.r.compile(this.definition, this.container, t);
        const {shadowOptions: e, isStrictBinding: s, hasSlots: n, containerless: r} = i;
        let o = this.location;
        this.isStrictBinding = s;
        if (null !== (this.hostController = be(this.host, es))) {
            this.host = this.container.root.get(ni).document.createElement(this.definition.name);
            if (r && null == o) o = this.location = js(this.host);
        }
        Os(this.host, de, this);
        Os(this.host, this.definition.key, this);
        if (null !== e || n) {
            if (null != o) throw new Error(`AUR0501`);
            Os(this.shadowRoot = this.host.attachShadow(null !== e && void 0 !== e ? e : fs), de, this);
            Os(this.shadowRoot, this.definition.key, this);
            this.mountTarget = 2;
        } else if (null != o) {
            Os(o, de, this);
            Os(o, this.definition.key, this);
            this.mountTarget = 3;
        } else this.mountTarget = 1;
        this.viewModel.$controller = this;
        this.nodes = this.r.createNodes(i);
        if (void 0 !== this.lifecycleHooks.hydrated) this.lifecycleHooks.hydrated.forEach(ys, this);
        if (this.hooks.hasHydrated) this.viewModel.hydrated(this);
    }
    hC() {
        this.r.render(this, this.nodes.findTargets(), this.Ct, this.host);
        if (void 0 !== this.lifecycleHooks.created) this.lifecycleHooks.created.forEach(bs, this);
        if (this.hooks.hasCreated) this.viewModel.created(this);
    }
    yt() {
        const t = this.definition;
        const i = this.viewModel;
        if (t.watches.length > 0) cs(this, this.container, t, i);
        rs(this, t, this.flags, i);
        i.$controller = this;
        this.lifecycleHooks = He.resolve(this.container);
        if (void 0 !== this.lifecycleHooks.created) this.lifecycleHooks.created.forEach(bs, this);
        if (this.hooks.hasCreated) this.viewModel.created(this);
    }
    kt() {
        this.Ct = this.r.compile(this.viewFactory.def, this.container, null);
        this.isStrictBinding = this.Ct.isStrictBinding;
        this.r.render(this, (this.nodes = this.r.createNodes(this.Ct)).findTargets(), this.Ct, void 0);
    }
    activate(t, i, e, s) {
        switch (this.state) {
          case 0:
          case 8:
            if (!(null === i || i.isActive)) return;
            this.state = 1;
            break;

          case 2:
            return;

          case 32:
            throw new Error(`AUR0502:${this.name}`);

          default:
            throw new Error(`AUR0503:${this.name} ${ms(this.state)}`);
        }
        this.parent = i;
        e |= 2;
        switch (this.vmKind) {
          case 0:
            this.scope.parentScope = null !== s && void 0 !== s ? s : null;
            break;

          case 1:
            this.scope = null !== s && void 0 !== s ? s : null;
            break;

          case 2:
            if (void 0 === s || null === s) throw new Error(`AUR0504`);
            if (!this.hasLockedScope) this.scope = s;
            break;
        }
        if (this.isStrictBinding) e |= 1;
        this.$initiator = t;
        this.$flags = e;
        this.At();
        let n;
        if (2 !== this.vmKind && null != this.lifecycleHooks.binding) n = X(...this.lifecycleHooks.binding.map(ks, this));
        if (this.hooks.hasBinding) n = X(n, this.viewModel.binding(this.$initiator, this.parent, this.$flags));
        if (Ct(n)) {
            this.Rt();
            n.then((() => {
                this.bind();
            })).catch((t => {
                this.St(t);
            }));
            return this.$promise;
        }
        this.bind();
        return this.$promise;
    }
    bind() {
        let t = 0;
        let i = this.gt.length;
        let e;
        if (i > 0) while (i > t) {
            this.gt[t].start();
            ++t;
        }
        if (null !== this.bindings) {
            t = 0;
            i = this.bindings.length;
            while (i > t) {
                this.bindings[t].$bind(this.$flags, this.scope);
                ++t;
            }
        }
        if (2 !== this.vmKind && null != this.lifecycleHooks.bound) e = X(...this.lifecycleHooks.bound.map(Cs, this));
        if (this.hooks.hasBound) e = X(e, this.viewModel.bound(this.$initiator, this.parent, this.$flags));
        if (Ct(e)) {
            this.Rt();
            e.then((() => {
                this.isBound = true;
                this.Et();
            })).catch((t => {
                this.St(t);
            }));
            return;
        }
        this.isBound = true;
        this.Et();
    }
    Bt(...t) {
        switch (this.mountTarget) {
          case 1:
            this.host.append(...t);
            break;

          case 2:
            this.shadowRoot.append(...t);
            break;

          case 3:
            {
                let i = 0;
                for (;i < t.length; ++i) this.location.parentNode.insertBefore(t[i], this.location);
                break;
            }
        }
    }
    Et() {
        if (null !== this.hostController) switch (this.mountTarget) {
          case 1:
          case 2:
            this.hostController.Bt(this.host);
            break;

          case 3:
            this.hostController.Bt(this.location.$start, this.location);
            break;
        }
        switch (this.mountTarget) {
          case 1:
            this.nodes.appendTo(this.host, null != this.definition && this.definition.enhance);
            break;

          case 2:
            {
                const t = this.container;
                const i = t.has(Oe, false) ? t.get(Oe) : t.get(Le);
                i.applyTo(this.shadowRoot);
                this.nodes.appendTo(this.shadowRoot);
                break;
            }

          case 3:
            this.nodes.insertBefore(this.location);
            break;
        }
        let t = 0;
        let i;
        if (2 !== this.vmKind && null != this.lifecycleHooks.attaching) i = X(...this.lifecycleHooks.attaching.map(As, this));
        if (this.hooks.hasAttaching) i = X(i, this.viewModel.attaching(this.$initiator, this.parent, this.$flags));
        if (Ct(i)) {
            this.Rt();
            this.At();
            i.then((() => {
                this.It();
            })).catch((t => {
                this.St(t);
            }));
        }
        if (null !== this.children) for (;t < this.children.length; ++t) void this.children[t].activate(this.$initiator, this, this.$flags, this.scope);
        this.It();
    }
    deactivate(t, i, e) {
        switch (~16 & this.state) {
          case 2:
            this.state = 4;
            break;

          case 0:
          case 8:
          case 32:
          case 8 | 32:
            return;

          default:
            throw new Error(`AUR0505:${this.name} ${ms(this.state)}`);
        }
        this.$initiator = t;
        this.$flags = e;
        if (t === this) this.Tt();
        let s = 0;
        let n;
        if (this.gt.length) for (;s < this.gt.length; ++s) this.gt[s].stop();
        if (null !== this.children) for (s = 0; s < this.children.length; ++s) void this.children[s].deactivate(t, this, e);
        if (2 !== this.vmKind && null != this.lifecycleHooks.detaching) n = X(...this.lifecycleHooks.detaching.map(Ss, this));
        if (this.hooks.hasDetaching) n = X(n, this.viewModel.detaching(this.$initiator, this.parent, this.$flags));
        if (Ct(n)) {
            this.Rt();
            t.Tt();
            n.then((() => {
                t.Dt();
            })).catch((i => {
                t.St(i);
            }));
        }
        if (null === t.head) t.head = this; else t.tail.next = this;
        t.tail = this;
        if (t !== this) return;
        this.Dt();
        return this.$promise;
    }
    removeNodes() {
        switch (this.vmKind) {
          case 0:
          case 2:
            this.nodes.remove();
            this.nodes.unlink();
        }
        if (null !== this.hostController) switch (this.mountTarget) {
          case 1:
          case 2:
            this.host.remove();
            break;

          case 3:
            this.location.$start.remove();
            this.location.remove();
            break;
        }
    }
    unbind() {
        const t = 4 | this.$flags;
        let i = 0;
        if (null !== this.bindings) for (;i < this.bindings.length; ++i) this.bindings[i].$unbind(t);
        this.parent = null;
        switch (this.vmKind) {
          case 1:
            this.scope = null;
            break;

          case 2:
            if (!this.hasLockedScope) this.scope = null;
            if (16 === (16 & this.state) && !this.viewFactory.tryReturnToCache(this) && this.$initiator === this) this.dispose();
            break;

          case 0:
            this.scope.parentScope = null;
            break;
        }
        if (16 === (16 & t) && this.$initiator === this) this.dispose();
        this.state = 32 & this.state | 8;
        this.$initiator = null;
        this.$t();
    }
    Rt() {
        if (void 0 === this.$promise) {
            this.$promise = new Promise(((t, i) => {
                this.$resolve = t;
                this.$reject = i;
            }));
            if (this.$initiator !== this) this.parent.Rt();
        }
    }
    $t() {
        if (void 0 !== this.$promise) {
            Bs = this.$resolve;
            this.$resolve = this.$reject = this.$promise = void 0;
            Bs();
            Bs = void 0;
        }
    }
    St(t) {
        if (void 0 !== this.$promise) {
            Is = this.$reject;
            this.$resolve = this.$reject = this.$promise = void 0;
            Is(t);
            Is = void 0;
        }
        if (this.$initiator !== this) this.parent.St(t);
    }
    At() {
        ++this.wt;
        if (this.$initiator !== this) this.parent.At();
    }
    It() {
        if (0 === --this.wt) {
            if (2 !== this.vmKind && null != this.lifecycleHooks.attached) Ts = X(...this.lifecycleHooks.attached.map(Rs, this));
            if (this.hooks.hasAttached) Ts = X(Ts, this.viewModel.attached(this.$initiator, this.$flags));
            if (Ct(Ts)) {
                this.Rt();
                Ts.then((() => {
                    this.state = 2;
                    this.$t();
                    if (this.$initiator !== this) this.parent.It();
                })).catch((t => {
                    this.St(t);
                }));
                Ts = void 0;
                return;
            }
            Ts = void 0;
            this.state = 2;
            this.$t();
        }
        if (this.$initiator !== this) this.parent.It();
    }
    Tt() {
        ++this.bt;
    }
    Dt() {
        if (0 === --this.bt) {
            this.Pt();
            this.removeNodes();
            let t = this.$initiator.head;
            let i;
            while (null !== t) {
                if (t !== this) {
                    if (t.debug) t.logger.trace(`detach()`);
                    t.removeNodes();
                }
                if (2 !== t.vmKind && null != t.lifecycleHooks.unbinding) i = X(...t.lifecycleHooks.unbinding.map(Es, this));
                if (t.hooks.hasUnbinding) {
                    if (t.debug) t.logger.trace("unbinding()");
                    i = X(i, t.viewModel.unbinding(t.$initiator, t.parent, t.$flags));
                }
                if (Ct(i)) {
                    this.Rt();
                    this.Pt();
                    i.then((() => {
                        this.Ot();
                    })).catch((t => {
                        this.St(t);
                    }));
                }
                i = void 0;
                t = t.next;
            }
            this.Ot();
        }
    }
    Pt() {
        ++this.xt;
    }
    Ot() {
        if (0 === --this.xt) {
            let t = this.$initiator.head;
            let i = null;
            while (null !== t) {
                if (t !== this) {
                    t.isBound = false;
                    t.unbind();
                }
                i = t.next;
                t.next = null;
                t = i;
            }
            this.head = this.tail = null;
            this.isBound = false;
            this.unbind();
        }
    }
    addBinding(t) {
        if (null === this.bindings) this.bindings = [ t ]; else this.bindings[this.bindings.length] = t;
    }
    addChild(t) {
        if (null === this.children) this.children = [ t ]; else this.children[this.children.length] = t;
    }
    is(t) {
        switch (this.vmKind) {
          case 1:
            return Ki(this.viewModel.constructor).name === t;

          case 0:
            return ye(this.viewModel.constructor).name === t;

          case 2:
            return this.viewFactory.name === t;
        }
    }
    lockScope(t) {
        this.scope = t;
        this.hasLockedScope = true;
    }
    setHost(t) {
        if (0 === this.vmKind) {
            Os(t, de, this);
            Os(t, this.definition.key, this);
        }
        this.host = t;
        this.mountTarget = 1;
        return this;
    }
    setShadowRoot(t) {
        if (0 === this.vmKind) {
            Os(t, de, this);
            Os(t, this.definition.key, this);
        }
        this.shadowRoot = t;
        this.mountTarget = 2;
        return this;
    }
    setLocation(t) {
        if (0 === this.vmKind) {
            Os(t, de, this);
            Os(t, this.definition.key, this);
        }
        this.location = t;
        this.mountTarget = 3;
        return this;
    }
    release() {
        this.state |= 16;
    }
    dispose() {
        if (32 === (32 & this.state)) return;
        this.state |= 32;
        if (this.hooks.hasDispose) this.viewModel.dispose();
        if (null !== this.children) {
            this.children.forEach(ws);
            this.children = null;
        }
        this.hostController = null;
        this.scope = null;
        this.nodes = null;
        this.location = null;
        this.viewFactory = null;
        if (null !== this.viewModel) {
            ss.delete(this.viewModel);
            this.viewModel = null;
        }
        this.viewModel = null;
        this.host = null;
        this.shadowRoot = null;
        this.container.disposeResolvers();
    }
    accept(t) {
        if (true === t(this)) return true;
        if (this.hooks.hasAccept && true === this.viewModel.accept(t)) return true;
        if (null !== this.children) {
            const {children: i} = this;
            for (let e = 0, s = i.length; e < s; ++e) if (true === i[e].accept(t)) return true;
        }
    }
}

function ns(t) {
    let i = t.$observers;
    if (void 0 === i) Reflect.defineProperty(t, "$observers", {
        enumerable: false,
        value: i = {}
    });
    return i;
}

function rs(t, i, e, s) {
    const n = i.bindables;
    const r = Object.getOwnPropertyNames(n);
    const o = r.length;
    if (o > 0) {
        let i;
        let e;
        let l = 0;
        const c = ns(s);
        const a = t.container;
        const u = a.has(h, true) ? a.get(h) : null;
        for (;l < o; ++l) {
            i = r[l];
            if (void 0 === c[i]) {
                e = n[i];
                c[i] = new BindableObserver(s, i, e.callback, e.set, t, u);
            }
        }
    }
}

function os(t, i, e) {
    const s = i.childrenObservers;
    const n = Object.getOwnPropertyNames(s);
    const r = n.length;
    if (r > 0) {
        const i = ns(e);
        const o = [];
        let l;
        let h = 0;
        let c;
        for (;h < r; ++h) {
            l = n[h];
            if (null == i[l]) {
                c = s[l];
                o[o.length] = i[l] = new ChildrenObserver(t, e, l, c.callback, c.query, c.filter, c.map, c.options);
            }
        }
        return o;
    }
    return q;
}

const ls = new Map;

const hs = t => {
    let i = ls.get(t);
    if (null == i) {
        i = new u(t, 0);
        ls.set(t, i);
    }
    return i;
};

function cs(t, i, e, s) {
    const n = i.get(c);
    const r = i.get(a);
    const o = e.watches;
    const h = 0 === t.vmKind ? t.scope : l.create(s, null, true);
    const u = o.length;
    let f;
    let d;
    let v;
    let m = 0;
    for (;u > m; ++m) {
        ({expression: f, callback: d} = o[m]);
        d = At(d) ? d : Reflect.get(s, d);
        if (!At(d)) throw new Error(`AUR0506:${String(d)}`);
        if (At(f)) t.addBinding(new ComputedWatcher(s, n, f, d, true)); else {
            v = Rt(f) ? r.parse(f, 8) : hs(f);
            t.addBinding(new ExpressionWatcher(h, i, n, v, d));
        }
    }
}

function as(t) {
    return t instanceof Controller && 0 === t.vmKind;
}

function us(t) {
    return nt(t) && we(t.constructor);
}

class HooksDefinition {
    constructor(t) {
        this.hasDefine = "define" in t;
        this.hasHydrating = "hydrating" in t;
        this.hasHydrated = "hydrated" in t;
        this.hasCreated = "created" in t;
        this.hasBinding = "binding" in t;
        this.hasBound = "bound" in t;
        this.hasAttaching = "attaching" in t;
        this.hasAttached = "attached" in t;
        this.hasDetaching = "detaching" in t;
        this.hasUnbinding = "unbinding" in t;
        this.hasDispose = "dispose" in t;
        this.hasAccept = "accept" in t;
    }
}

HooksDefinition.none = new HooksDefinition({});

const fs = {
    mode: "open"
};

var ds;

(function(t) {
    t[t["customElement"] = 0] = "customElement";
    t[t["customAttribute"] = 1] = "customAttribute";
    t[t["synthetic"] = 2] = "synthetic";
})(ds || (ds = {}));

var vs;

(function(t) {
    t[t["none"] = 0] = "none";
    t[t["activating"] = 1] = "activating";
    t[t["activated"] = 2] = "activated";
    t[t["deactivating"] = 4] = "deactivating";
    t[t["deactivated"] = 8] = "deactivated";
    t[t["released"] = 16] = "released";
    t[t["disposed"] = 32] = "disposed";
})(vs || (vs = {}));

function ms(t) {
    const i = [];
    if (1 === (1 & t)) i.push("activating");
    if (2 === (2 & t)) i.push("activated");
    if (4 === (4 & t)) i.push("deactivating");
    if (8 === (8 & t)) i.push("deactivated");
    if (16 === (16 & t)) i.push("released");
    if (32 === (32 & t)) i.push("disposed");
    return 0 === i.length ? "none" : i.join("|");
}

const gs = L.createInterface("IController");

const ps = L.createInterface("IHydrationContext");

class HydrationContext {
    constructor(t, i, e) {
        this.instruction = i;
        this.parent = e;
        this.controller = t;
    }
}

function ws(t) {
    t.dispose();
}

function bs(t) {
    t.instance.created(this.viewModel, this);
}

function xs(t) {
    t.instance.hydrating(this.viewModel, this);
}

function ys(t) {
    t.instance.hydrated(this.viewModel, this);
}

function ks(t) {
    return t.instance.binding(this.viewModel, this["$initiator"], this.parent, this["$flags"]);
}

function Cs(t) {
    return t.instance.bound(this.viewModel, this["$initiator"], this.parent, this["$flags"]);
}

function As(t) {
    return t.instance.attaching(this.viewModel, this["$initiator"], this.parent, this["$flags"]);
}

function Rs(t) {
    return t.instance.attached(this.viewModel, this["$initiator"], this["$flags"]);
}

function Ss(t) {
    return t.instance.detaching(this.viewModel, this["$initiator"], this.parent, this["$flags"]);
}

function Es(t) {
    return t.instance.unbinding(this.viewModel, this["$initiator"], this.parent, this["$flags"]);
}

let Bs;

let Is;

let Ts;

const Ds = L.createInterface("IAppRoot");

const $s = L.createInterface("IWorkTracker", (t => t.singleton(WorkTracker)));

class WorkTracker {
    constructor(t) {
        this.Lt = 0;
        this.qt = null;
        this.$t = null;
        this.Ut = t.scopeTo("WorkTracker");
    }
    start() {
        this.Ut.trace(`start(stack:${this.Lt})`);
        ++this.Lt;
    }
    finish() {
        this.Ut.trace(`finish(stack:${this.Lt})`);
        if (0 === --this.Lt) {
            const t = this.$t;
            if (null !== t) {
                this.$t = this.qt = null;
                t();
            }
        }
    }
    wait() {
        this.Ut.trace(`wait(stack:${this.Lt})`);
        if (null === this.qt) {
            if (0 === this.Lt) return Promise.resolve();
            this.qt = new Promise((t => {
                this.$t = t;
            }));
        }
        return this.qt;
    }
}

WorkTracker.inject = [ K ];

class AppRoot {
    constructor(t, i, e, s) {
        this.config = t;
        this.platform = i;
        this.container = e;
        this.controller = void 0;
        this._t = void 0;
        this.host = t.host;
        this.work = e.get($s);
        s.prepare(this);
        e.registerResolver(i.HTMLElement, e.registerResolver(i.Element, e.registerResolver(Ls, new G("ElementResolver", t.host))));
        this._t = Y(this.Vt("creating"), (() => {
            const i = t.component;
            const s = e.createChild();
            let n;
            if (we(i)) n = this.container.get(i); else n = t.component;
            const r = {
                hydrate: false,
                projections: null
            };
            const o = this.controller = Controller.$el(s, n, this.host, r);
            o.hE(r, null);
            return Y(this.Vt("hydrating"), (() => {
                o.hS(null);
                return Y(this.Vt("hydrated"), (() => {
                    o.hC();
                    this._t = void 0;
                }));
            }));
        }));
    }
    activate() {
        return Y(this._t, (() => Y(this.Vt("activating"), (() => Y(this.controller.activate(this.controller, null, 2, void 0), (() => this.Vt("activated")))))));
    }
    deactivate() {
        return Y(this.Vt("deactivating"), (() => Y(this.controller.deactivate(this.controller, null, 0), (() => this.Vt("deactivated")))));
    }
    Vt(t) {
        return X(...this.container.getAll(Bi).reduce(((i, e) => {
            if (e.slot === t) i.push(e.run());
            return i;
        }), []));
    }
    dispose() {
        var t;
        null === (t = this.controller) || void 0 === t ? void 0 : t.dispose();
    }
}

class Refs {}

function Ps(t, i) {
    var e, s;
    return null !== (s = null === (e = t.$au) || void 0 === e ? void 0 : e[i]) && void 0 !== s ? s : null;
}

function Os(t, i, e) {
    var s;
    var n;
    (null !== (s = (n = t).$au) && void 0 !== s ? s : n.$au = new Refs)[i] = e;
}

const Ls = L.createInterface("INode");

const qs = L.createInterface("IEventTarget", (t => t.cachedCallback((t => {
    if (t.has(Ds, true)) return t.get(Ds).host;
    return t.get(ni).document;
}))));

const Us = L.createInterface("IRenderLocation");

var _s;

(function(t) {
    t[t["Element"] = 1] = "Element";
    t[t["Attr"] = 2] = "Attr";
    t[t["Text"] = 3] = "Text";
    t[t["CDATASection"] = 4] = "CDATASection";
    t[t["EntityReference"] = 5] = "EntityReference";
    t[t["Entity"] = 6] = "Entity";
    t[t["ProcessingInstruction"] = 7] = "ProcessingInstruction";
    t[t["Comment"] = 8] = "Comment";
    t[t["Document"] = 9] = "Document";
    t[t["DocumentType"] = 10] = "DocumentType";
    t[t["DocumentFragment"] = 11] = "DocumentFragment";
    t[t["Notation"] = 12] = "Notation";
})(_s || (_s = {}));

const Vs = new WeakMap;

function Fs(t) {
    if (Vs.has(t)) return Vs.get(t);
    let i = 0;
    let e = t.nextSibling;
    while (null !== e) {
        if (8 === e.nodeType) switch (e.textContent) {
          case "au-start":
            ++i;
            break;

          case "au-end":
            if (0 === i--) return e;
        }
        e = e.nextSibling;
    }
    if (null === t.parentNode && 11 === t.nodeType) {
        const i = be(t);
        if (void 0 === i) return null;
        if (2 === i.mountTarget) return Fs(i.host);
    }
    return t.parentNode;
}

function Ms(t, i) {
    if (void 0 !== t.platform && !(t instanceof t.platform.Node)) {
        const e = t.childNodes;
        for (let t = 0, s = e.length; t < s; ++t) Vs.set(e[t], i);
    } else Vs.set(t, i);
}

function js(t) {
    if (Ns(t)) return t;
    const i = t.ownerDocument.createComment("au-end");
    const e = t.ownerDocument.createComment("au-start");
    if (null !== t.parentNode) {
        t.parentNode.replaceChild(i, t);
        i.parentNode.insertBefore(e, i);
    }
    i.$start = e;
    return i;
}

function Ns(t) {
    return "au-end" === t.textContent;
}

class FragmentNodeSequence {
    constructor(t, i) {
        this.platform = t;
        this.fragment = i;
        this.isMounted = false;
        this.isLinked = false;
        this.next = void 0;
        this.refNode = void 0;
        const e = i.querySelectorAll(".au");
        let s = 0;
        let n = e.length;
        let r;
        let o = this.targets = Array(n);
        while (n > s) {
            r = e[s];
            if ("AU-M" === r.nodeName) o[s] = js(r); else o[s] = r;
            ++s;
        }
        const l = i.childNodes;
        const h = this.childNodes = Array(n = l.length);
        s = 0;
        while (n > s) {
            h[s] = l[s];
            ++s;
        }
        this.firstChild = i.firstChild;
        this.lastChild = i.lastChild;
    }
    findTargets() {
        return this.targets;
    }
    insertBefore(t) {
        if (this.isLinked && !!this.refNode) this.addToLinked(); else {
            const i = t.parentNode;
            if (this.isMounted) {
                let e = this.firstChild;
                let s;
                const n = this.lastChild;
                while (null != e) {
                    s = e.nextSibling;
                    i.insertBefore(e, t);
                    if (e === n) break;
                    e = s;
                }
            } else {
                this.isMounted = true;
                t.parentNode.insertBefore(this.fragment, t);
            }
        }
    }
    appendTo(t, i = false) {
        if (this.isMounted) {
            let i = this.firstChild;
            let e;
            const s = this.lastChild;
            while (null != i) {
                e = i.nextSibling;
                t.appendChild(i);
                if (i === s) break;
                i = e;
            }
        } else {
            this.isMounted = true;
            if (!i) t.appendChild(this.fragment);
        }
    }
    remove() {
        if (this.isMounted) {
            this.isMounted = false;
            const t = this.fragment;
            const i = this.lastChild;
            let e;
            let s = this.firstChild;
            while (null !== s) {
                e = s.nextSibling;
                t.appendChild(s);
                if (s === i) break;
                s = e;
            }
        }
    }
    addToLinked() {
        const t = this.refNode;
        const i = t.parentNode;
        if (this.isMounted) {
            let e = this.firstChild;
            let s;
            const n = this.lastChild;
            while (null != e) {
                s = e.nextSibling;
                i.insertBefore(e, t);
                if (e === n) break;
                e = s;
            }
        } else {
            this.isMounted = true;
            i.insertBefore(this.fragment, t);
        }
    }
    unlink() {
        this.isLinked = false;
        this.next = void 0;
        this.refNode = void 0;
    }
    link(t) {
        this.isLinked = true;
        if (Ns(t)) this.refNode = t; else {
            this.next = t;
            this.obtainRefNode();
        }
    }
    obtainRefNode() {
        if (void 0 !== this.next) this.refNode = this.next.firstChild; else this.refNode = void 0;
    }
}

const Hs = L.createInterface("IWindow", (t => t.callback((t => t.get(ni).window))));

const Ws = L.createInterface("ILocation", (t => t.callback((t => t.get(Hs).location))));

const zs = L.createInterface("IHistory", (t => t.callback((t => t.get(Hs).history))));

const Gs = {
    [f.capturing]: {
        capture: true
    },
    [f.bubbling]: {
        capture: false
    }
};

class ListenerOptions {
    constructor(t, i, e) {
        this.prevent = t;
        this.strategy = i;
        this.expAsHandler = e;
    }
}

class Listener {
    constructor(t, i, e, s, n, r, o) {
        this.platform = t;
        this.targetEvent = i;
        this.sourceExpression = e;
        this.target = s;
        this.eventDelegator = n;
        this.locator = r;
        this.interceptor = this;
        this.isBound = false;
        this.handler = null;
        this.Ft = o;
    }
    callSource(t) {
        const i = this.$scope.overrideContext;
        i.$event = t;
        let e = this.sourceExpression.evaluate(8, this.$scope, this.locator, null);
        delete i.$event;
        if (this.Ft.expAsHandler) {
            if (!At(e)) throw new Error(`Handler of "${this.targetEvent}" event is not a function.`);
            e = e(t);
        }
        if (true !== e && this.Ft.prevent) t.preventDefault();
        return e;
    }
    handleEvent(t) {
        this.interceptor.callSource(t);
    }
    $bind(t, i) {
        if (this.isBound) {
            if (this.$scope === i) return;
            this.interceptor.$unbind(2 | t);
        }
        this.$scope = i;
        const e = this.sourceExpression;
        if (e.hasBind) e.bind(t, i, this.interceptor);
        if (this.Ft.strategy === f.none) this.target.addEventListener(this.targetEvent, this); else this.handler = this.eventDelegator.addEventListener(this.locator.get(qs), this.target, this.targetEvent, this, Gs[this.Ft.strategy]);
        this.isBound = true;
    }
    $unbind(t) {
        if (!this.isBound) return;
        const i = this.sourceExpression;
        if (i.hasUnbind) i.unbind(t, this.$scope, this.interceptor);
        this.$scope = null;
        if (this.Ft.strategy === f.none) this.target.removeEventListener(this.targetEvent, this); else {
            this.handler.dispose();
            this.handler = null;
        }
        this.isBound = false;
    }
    observe(t, i) {
        return;
    }
    handleChange(t, i, e) {
        return;
    }
}

const Xs = {
    capture: false
};

class ListenerTracker {
    constructor(t, i, e = Xs) {
        this.Mt = t;
        this.jt = i;
        this.Ft = e;
        this.Nt = 0;
        this.Ht = new Map;
        this.Wt = new Map;
    }
    zt() {
        if (1 === ++this.Nt) this.Mt.addEventListener(this.jt, this, this.Ft);
    }
    Gt() {
        if (0 === --this.Nt) this.Mt.removeEventListener(this.jt, this, this.Ft);
    }
    dispose() {
        if (this.Nt > 0) {
            this.Nt = 0;
            this.Mt.removeEventListener(this.jt, this, this.Ft);
        }
        this.Ht.clear();
        this.Wt.clear();
    }
    Xt(t) {
        const i = true === this.Ft.capture ? this.Ht : this.Wt;
        let e = i.get(t);
        if (void 0 === e) i.set(t, e = bt());
        return e;
    }
    handleEvent(t) {
        const i = true === this.Ft.capture ? this.Ht : this.Wt;
        const e = t.composedPath();
        if (true === this.Ft.capture) e.reverse();
        for (const s of e) {
            const e = i.get(s);
            if (void 0 === e) continue;
            const n = e[this.jt];
            if (void 0 === n) continue;
            if (At(n)) n(t); else n.handleEvent(t);
            if (true === t.cancelBubble) return;
        }
    }
}

class DelegateSubscription {
    constructor(t, i, e, s) {
        this.Kt = t;
        this.Yt = i;
        this.jt = e;
        t.zt();
        i[e] = s;
    }
    dispose() {
        this.Kt.Gt();
        this.Yt[this.jt] = void 0;
    }
}

class EventSubscriber {
    constructor(t) {
        this.config = t;
        this.target = null;
        this.handler = null;
    }
    subscribe(t, i) {
        this.target = t;
        this.handler = i;
        let e;
        for (e of this.config.events) t.addEventListener(e, i);
    }
    dispose() {
        const {target: t, handler: i} = this;
        let e;
        if (null !== t && null !== i) for (e of this.config.events) t.removeEventListener(e, i);
        this.target = this.handler = null;
    }
}

const Ks = L.createInterface("IEventDelegator", (t => t.singleton(EventDelegator)));

class EventDelegator {
    constructor() {
        this.Zt = bt();
    }
    addEventListener(t, i, e, s, n) {
        var r;
        var o;
        const l = null !== (r = (o = this.Zt)[e]) && void 0 !== r ? r : o[e] = new Map;
        let h = l.get(t);
        if (void 0 === h) l.set(t, h = new ListenerTracker(t, e, n));
        return new DelegateSubscription(h, h.Xt(i), e, s);
    }
    dispose() {
        for (const t in this.Zt) {
            const i = this.Zt[t];
            for (const t of i.values()) t.dispose();
            i.clear();
        }
    }
}

const Ys = L.createInterface("IProjections");

const Zs = L.createInterface("IAuSlotsInfo");

class AuSlotsInfo {
    constructor(t) {
        this.projectedSlots = t;
    }
}

var Js;

(function(t) {
    t["hydrateElement"] = "ra";
    t["hydrateAttribute"] = "rb";
    t["hydrateTemplateController"] = "rc";
    t["hydrateLetElement"] = "rd";
    t["setProperty"] = "re";
    t["interpolation"] = "rf";
    t["propertyBinding"] = "rg";
    t["callBinding"] = "rh";
    t["letBinding"] = "ri";
    t["refBinding"] = "rj";
    t["iteratorBinding"] = "rk";
    t["textBinding"] = "ha";
    t["listenerBinding"] = "hb";
    t["attributeBinding"] = "hc";
    t["stylePropertyBinding"] = "hd";
    t["setAttribute"] = "he";
    t["setClassAttribute"] = "hf";
    t["setStyleAttribute"] = "hg";
    t["spreadBinding"] = "hs";
    t["spreadElementProp"] = "hp";
})(Js || (Js = {}));

const Qs = L.createInterface("Instruction");

function tn(t) {
    const i = t.type;
    return Rt(i) && 2 === i.length;
}

class InterpolationInstruction {
    constructor(t, i) {
        this.from = t;
        this.to = i;
    }
    get type() {
        return "rf";
    }
}

class PropertyBindingInstruction {
    constructor(t, i, e) {
        this.from = t;
        this.to = i;
        this.mode = e;
    }
    get type() {
        return "rg";
    }
}

class IteratorBindingInstruction {
    constructor(t, i) {
        this.from = t;
        this.to = i;
    }
    get type() {
        return "rk";
    }
}

class CallBindingInstruction {
    constructor(t, i) {
        this.from = t;
        this.to = i;
    }
    get type() {
        return "rh";
    }
}

class RefBindingInstruction {
    constructor(t, i) {
        this.from = t;
        this.to = i;
    }
    get type() {
        return "rj";
    }
}

class SetPropertyInstruction {
    constructor(t, i) {
        this.value = t;
        this.to = i;
    }
    get type() {
        return "re";
    }
}

class HydrateElementInstruction {
    constructor(t, i, e, s, n, r) {
        this.res = t;
        this.alias = i;
        this.props = e;
        this.projections = s;
        this.containerless = n;
        this.captures = r;
        this.auSlot = null;
    }
    get type() {
        return "ra";
    }
}

class HydrateAttributeInstruction {
    constructor(t, i, e) {
        this.res = t;
        this.alias = i;
        this.props = e;
    }
    get type() {
        return "rb";
    }
}

class HydrateTemplateController {
    constructor(t, i, e, s) {
        this.def = t;
        this.res = i;
        this.alias = e;
        this.props = s;
    }
    get type() {
        return "rc";
    }
}

class HydrateLetElementInstruction {
    constructor(t, i) {
        this.instructions = t;
        this.toBindingContext = i;
    }
    get type() {
        return "rd";
    }
}

class LetBindingInstruction {
    constructor(t, i) {
        this.from = t;
        this.to = i;
    }
    get type() {
        return "ri";
    }
}

class TextBindingInstruction {
    constructor(t, i) {
        this.from = t;
        this.strict = i;
    }
    get type() {
        return "ha";
    }
}

class ListenerBindingInstruction {
    constructor(t, i, e, s) {
        this.from = t;
        this.to = i;
        this.preventDefault = e;
        this.strategy = s;
    }
    get type() {
        return "hb";
    }
}

class StylePropertyBindingInstruction {
    constructor(t, i) {
        this.from = t;
        this.to = i;
    }
    get type() {
        return "hd";
    }
}

class SetAttributeInstruction {
    constructor(t, i) {
        this.value = t;
        this.to = i;
    }
    get type() {
        return "he";
    }
}

class SetClassAttributeInstruction {
    constructor(t) {
        this.value = t;
        this.type = "hf";
    }
}

class SetStyleAttributeInstruction {
    constructor(t) {
        this.value = t;
        this.type = "hg";
    }
}

class AttributeBindingInstruction {
    constructor(t, i, e) {
        this.attr = t;
        this.from = i;
        this.to = e;
    }
    get type() {
        return "hc";
    }
}

class SpreadBindingInstruction {
    get type() {
        return "hs";
    }
}

class SpreadElementPropBindingInstruction {
    constructor(t) {
        this.instructions = t;
    }
    get type() {
        return "hp";
    }
}

const en = L.createInterface("ITemplateCompiler");

const sn = L.createInterface("IRenderer");

function nn(t) {
    return function i(e) {
        e.register = function(t) {
            _t(sn, this).register(t);
        };
        St(e.prototype, "target", {
            configurable: true,
            get: function() {
                return t;
            }
        });
        return e;
    };
}

function rn(t, i, e) {
    if (Rt(i)) return t.parse(i, e);
    return i;
}

function on(t) {
    if (null != t.viewModel) return t.viewModel;
    return t;
}

function ln(t, i) {
    if ("element" === i) return t;
    switch (i) {
      case "controller":
        return be(t);

      case "view":
        throw new Error(`AUR0750`);

      case "view-model":
        return be(t).viewModel;

      default:
        {
            const e = Gi(t, i);
            if (void 0 !== e) return e.viewModel;
            const s = be(t, {
                name: i
            });
            if (void 0 === s) throw new Error(`AUR0751:${i}`);
            return s.viewModel;
        }
    }
}

let hn = class SetPropertyRenderer {
    render(t, i, e) {
        const s = on(i);
        if (void 0 !== s.$observers && void 0 !== s.$observers[e.to]) s.$observers[e.to].setValue(e.value, 2); else s[e.to] = e.value;
    }
};

hn = lt([ nn("re") ], hn);

let cn = class CustomElementRenderer {
    constructor(t, i) {
        this.r = t;
        this.p = i;
    }
    static get inject() {
        return [ ts, ni ];
    }
    render(t, i, e) {
        let s;
        let n;
        let r;
        let o;
        const l = e.res;
        const h = e.projections;
        const c = t.container;
        switch (typeof l) {
          case "string":
            s = c.find(Ae, l);
            if (null == s) throw new Error(`AUR0752:${l}@${t["name"]}`);
            break;

          default:
            s = l;
        }
        const a = e.containerless || s.containerless;
        const u = a ? js(i) : null;
        const f = qn(this.p, t, i, e, u, null == h ? void 0 : new AuSlotsInfo(Object.keys(h)));
        n = s.Type;
        r = f.invoke(n);
        f.registerResolver(n, new G(s.key, r));
        o = Controller.$el(f, r, i, e, s, u);
        Os(i, s.key, o);
        const d = this.r.renderers;
        const v = e.props;
        const m = v.length;
        let g = 0;
        let p;
        while (m > g) {
            p = v[g];
            d[p.type].render(t, o, p);
            ++g;
        }
        t.addChild(o);
    }
};

cn = lt([ nn("ra") ], cn);

let an = class CustomAttributeRenderer {
    constructor(t, i) {
        this.r = t;
        this.p = i;
    }
    static get inject() {
        return [ ts, ni ];
    }
    render(t, i, e) {
        let s = t.container;
        let n;
        switch (typeof e.res) {
          case "string":
            n = s.find(Yi, e.res);
            if (null == n) throw new Error(`AUR0753:${e.res}@${t["name"]}`);
            break;

          default:
            n = e.res;
        }
        const r = Un(this.p, n, t, i, e, void 0, void 0);
        const o = Controller.$attr(r.ctn, r.vm, i, n);
        Os(i, n.key, o);
        const l = this.r.renderers;
        const h = e.props;
        const c = h.length;
        let a = 0;
        let u;
        while (c > a) {
            u = h[a];
            l[u.type].render(t, o, u);
            ++a;
        }
        t.addChild(o);
    }
};

an = lt([ nn("rb") ], an);

let un = class TemplateControllerRenderer {
    constructor(t, i) {
        this.r = t;
        this.p = i;
    }
    static get inject() {
        return [ ts, ni ];
    }
    render(t, i, e) {
        var s, n;
        let r = t.container;
        let o;
        switch (typeof e.res) {
          case "string":
            o = r.find(Yi, e.res);
            if (null == o) throw new Error(`AUR0754:${e.res}@${t["name"]}`);
            break;

          default:
            o = e.res;
        }
        const l = this.r.getViewFactory(e.def, r);
        const h = js(i);
        const c = Un(this.p, o, t, i, e, l, h);
        const a = Controller.$attr(c.ctn, c.vm, i, o);
        Os(h, o.key, a);
        null === (n = (s = c.vm).link) || void 0 === n ? void 0 : n.call(s, t, a, i, e);
        const u = this.r.renderers;
        const f = e.props;
        const d = f.length;
        let v = 0;
        let m;
        while (d > v) {
            m = f[v];
            u[m.type].render(t, a, m);
            ++v;
        }
        t.addChild(a);
    }
};

un = lt([ nn("rc") ], un);

let fn = class LetElementRenderer {
    constructor(t, i) {
        this.ep = t;
        this.oL = i;
    }
    render(t, i, e) {
        i.remove();
        const s = e.instructions;
        const n = e.toBindingContext;
        const r = t.container;
        const o = s.length;
        let l;
        let h;
        let c;
        let a = 0;
        while (o > a) {
            l = s[a];
            h = rn(this.ep, l.from, 8);
            c = new LetBinding(h, l.to, this.oL, r, n);
            t.addBinding(38963 === h.$kind ? xn(c, h, r) : c);
            ++a;
        }
    }
};

fn.inject = [ a, c ];

fn = lt([ nn("rd") ], fn);

let dn = class CallBindingRenderer {
    constructor(t, i) {
        this.ep = t;
        this.oL = i;
    }
    render(t, i, e) {
        const s = rn(this.ep, e.from, 8 | 4);
        const n = new CallBinding(s, on(i), e.to, this.oL, t.container);
        t.addBinding(38963 === s.$kind ? xn(n, s, t.container) : n);
    }
};

dn.inject = [ a, c ];

dn = lt([ nn("rh") ], dn);

let vn = class RefBindingRenderer {
    constructor(t) {
        this.ep = t;
    }
    render(t, i, e) {
        const s = rn(this.ep, e.from, 8);
        const n = new RefBinding(s, ln(i, e.to), t.container);
        t.addBinding(38963 === s.$kind ? xn(n, s, t.container) : n);
    }
};

vn.inject = [ a ];

vn = lt([ nn("rj") ], vn);

let mn = class InterpolationBindingRenderer {
    constructor(t, i, e) {
        this.ep = t;
        this.oL = i;
        this.p = e;
    }
    render(i, e, s) {
        const n = i.container;
        const r = rn(this.ep, s.from, 1);
        const o = new InterpolationBinding(this.oL, r, on(e), s.to, t.toView, n, this.p.domWriteQueue);
        const l = o.partBindings;
        const h = l.length;
        let c = 0;
        let a;
        for (;h > c; ++c) {
            a = l[c];
            if (38963 === a.sourceExpression.$kind) l[c] = xn(a, a.sourceExpression, n);
        }
        i.addBinding(o);
    }
};

mn.inject = [ a, c, ni ];

mn = lt([ nn("rf") ], mn);

let gn = class PropertyBindingRenderer {
    constructor(t, i, e) {
        this.ep = t;
        this.oL = i;
        this.p = e;
    }
    render(t, i, e) {
        const s = rn(this.ep, e.from, 8);
        const n = new PropertyBinding(s, on(i), e.to, e.mode, this.oL, t.container, this.p.domWriteQueue);
        t.addBinding(38963 === s.$kind ? xn(n, s, t.container) : n);
    }
};

gn.inject = [ a, c, ni ];

gn = lt([ nn("rg") ], gn);

let pn = class IteratorBindingRenderer {
    constructor(t, i, e) {
        this.ep = t;
        this.oL = i;
        this.p = e;
    }
    render(i, e, s) {
        const n = rn(this.ep, s.from, 2);
        const r = new PropertyBinding(n, on(e), s.to, t.toView, this.oL, i.container, this.p.domWriteQueue);
        i.addBinding(38963 === n.iterable.$kind ? xn(r, n.iterable, i.container) : r);
    }
};

pn.inject = [ a, c, ni ];

pn = lt([ nn("rk") ], pn);

let wn = 0;

const bn = [];

function xn(t, i, e) {
    while (i instanceof d) {
        bn[wn++] = i;
        i = i.expression;
    }
    while (wn > 0) {
        const i = bn[--wn];
        const s = e.get(i.behaviorKey);
        if (s instanceof v) t = s.construct(t, i);
    }
    bn.length = 0;
    return t;
}

let yn = class TextBindingRenderer {
    constructor(t, i, e) {
        this.ep = t;
        this.oL = i;
        this.p = e;
    }
    render(t, i, e) {
        const s = t.container;
        const n = i.nextSibling;
        const r = i.parentNode;
        const o = this.p.document;
        const l = rn(this.ep, e.from, 1);
        const h = l.parts;
        const c = l.expressions;
        const a = c.length;
        let u = 0;
        let f = h[0];
        let d;
        let v;
        if ("" !== f) r.insertBefore(o.createTextNode(f), n);
        for (;a > u; ++u) {
            v = c[u];
            d = new ContentBinding(v, r.insertBefore(o.createTextNode(""), n), s, this.oL, this.p, e.strict);
            t.addBinding(38963 === v.$kind ? xn(d, v, s) : d);
            f = h[u + 1];
            if ("" !== f) r.insertBefore(o.createTextNode(f), n);
        }
        if ("AU-M" === i.nodeName) i.remove();
    }
};

yn.inject = [ a, c, ni ];

yn = lt([ nn("ha") ], yn);

const kn = L.createInterface("IListenerBehaviorOptions", (t => t.singleton(ListenerBehaviorOptions)));

class ListenerBehaviorOptions {
    constructor() {
        this.expAsHandler = false;
    }
}

let Cn = class ListenerBindingRenderer {
    constructor(t, i, e, s) {
        this.ep = t;
        this.Jt = i;
        this.p = e;
        this.Qt = s;
    }
    render(t, i, e) {
        const s = rn(this.ep, e.from, 4);
        const n = new Listener(this.p, e.to, s, i, this.Jt, t.container, new ListenerOptions(e.preventDefault, e.strategy, this.Qt.expAsHandler));
        t.addBinding(38963 === s.$kind ? xn(n, s, t.container) : n);
    }
};

Cn.inject = [ a, Ks, ni, kn ];

Cn = lt([ nn("hb") ], Cn);

let An = class SetAttributeRenderer {
    render(t, i, e) {
        i.setAttribute(e.to, e.value);
    }
};

An = lt([ nn("he") ], An);

let Rn = class SetClassAttributeRenderer {
    render(t, i, e) {
        Tn(i.classList, e.value);
    }
};

Rn = lt([ nn("hf") ], Rn);

let Sn = class SetStyleAttributeRenderer {
    render(t, i, e) {
        i.style.cssText += e.value;
    }
};

Sn = lt([ nn("hg") ], Sn);

let En = class StylePropertyBindingRenderer {
    constructor(t, i, e) {
        this.ep = t;
        this.oL = i;
        this.p = e;
    }
    render(i, e, s) {
        const n = rn(this.ep, s.from, 8);
        const r = new PropertyBinding(n, e.style, s.to, t.toView, this.oL, i.container, this.p.domWriteQueue);
        i.addBinding(38963 === n.$kind ? xn(r, n, i.container) : r);
    }
};

En.inject = [ a, c, ni ];

En = lt([ nn("hd") ], En);

let Bn = class AttributeBindingRenderer {
    constructor(t, i) {
        this.ep = t;
        this.oL = i;
    }
    render(i, e, s) {
        const n = rn(this.ep, s.from, 8);
        const r = new AttributeBinding(n, e, s.attr, s.to, t.toView, this.oL, i.container);
        i.addBinding(38963 === n.$kind ? xn(r, n, i.container) : r);
    }
};

Bn.inject = [ a, c ];

Bn = lt([ nn("hc") ], Bn);

let In = class SpreadRenderer {
    constructor(t, i) {
        this.ti = t;
        this.r = i;
    }
    static get inject() {
        return [ en, ts ];
    }
    render(t, i, e) {
        const s = t.container;
        const n = s.get(ps);
        const r = this.r.renderers;
        const o = t => {
            let i = t;
            let e = n;
            while (null != e && i > 0) {
                e = e.parent;
                --i;
            }
            if (null == e) throw new Error("No scope context for spread binding.");
            return e;
        };
        const l = e => {
            var s, n;
            const h = o(e);
            const c = Dn(h);
            const a = this.ti.compileSpread(h.controller.definition, null !== (n = null === (s = h.instruction) || void 0 === s ? void 0 : s.captures) && void 0 !== n ? n : q, h.controller.container, i);
            let u;
            for (u of a) switch (u.type) {
              case "hs":
                l(e + 1);
                break;

              case "hp":
                r[u.instructions.type].render(c, be(i), u.instructions);
                break;

              default:
                r[u.type].render(c, i, u);
            }
            t.addBinding(c);
        };
        l(0);
    }
};

In = lt([ nn("hs") ], In);

class SpreadBinding {
    constructor(t, i) {
        this.ii = t;
        this.ei = i;
        this.interceptor = this;
        this.isBound = false;
        this.ctrl = i.controller;
        this.locator = this.ctrl.container;
    }
    get container() {
        return this.locator;
    }
    get definition() {
        return this.ctrl.definition;
    }
    get isStrictBinding() {
        return this.ctrl.isStrictBinding;
    }
    $bind(t, i) {
        var e;
        if (this.isBound) return;
        this.isBound = true;
        const s = this.$scope = null !== (e = this.ei.controller.scope.parentScope) && void 0 !== e ? e : void 0;
        if (null == s) throw new Error("Invalid spreading. Context scope is null/undefined");
        this.ii.forEach((i => i.$bind(t, s)));
    }
    $unbind(t) {
        this.ii.forEach((i => i.$unbind(t)));
        this.isBound = false;
    }
    addBinding(t) {
        this.ii.push(t);
    }
    addChild(t) {
        if (1 !== t.vmKind) throw new Error("Spread binding does not support spreading custom attributes/template controllers");
        this.ctrl.addChild(t);
    }
}

function Tn(t, i) {
    const e = i.length;
    let s = 0;
    for (let n = 0; n < e; ++n) if (32 === i.charCodeAt(n)) {
        if (n !== s) t.add(i.slice(s, n));
        s = n + 1;
    } else if (n + 1 === e) t.add(i.slice(s));
}

const Dn = t => new SpreadBinding([], t);

const $n = "IController";

const Pn = "IInstruction";

const On = "IRenderLocation";

const Ln = "IAuSlotsInfo";

function qn(t, i, e, s, n, r) {
    const o = i.container.createChild();
    o.registerResolver(t.HTMLElement, o.registerResolver(t.Element, o.registerResolver(Ls, new G("ElementResolver", e))));
    o.registerResolver(gs, new G($n, i));
    o.registerResolver(Qs, new G(Pn, s));
    o.registerResolver(Us, null == n ? _n : new RenderLocationProvider(n));
    o.registerResolver(ze, Vn);
    o.registerResolver(Zs, null == r ? Fn : new G(Ln, r));
    return o;
}

class ViewFactoryProvider {
    constructor(t) {
        this.f = t;
    }
    get $isResolver() {
        return true;
    }
    resolve() {
        const t = this.f;
        if (null === t) throw new Error(`AUR7055`);
        if (!Rt(t.name) || 0 === t.name.length) throw new Error(`AUR0756`);
        return t;
    }
}

function Un(t, i, e, s, n, r, o, l) {
    const h = e.container.createChild();
    h.registerResolver(t.HTMLElement, h.registerResolver(t.Element, h.registerResolver(Ls, new G("ElementResolver", s))));
    e = e instanceof Controller ? e : e.ctrl;
    h.registerResolver(gs, new G($n, e));
    h.registerResolver(Qs, new G(Pn, n));
    h.registerResolver(Us, null == o ? _n : new G(On, o));
    h.registerResolver(ze, null == r ? Vn : new ViewFactoryProvider(r));
    h.registerResolver(Zs, null == l ? Fn : new G(Ln, l));
    return {
        vm: h.invoke(i.Type),
        ctn: h
    };
}

class RenderLocationProvider {
    constructor(t) {
        this.l = t;
    }
    get name() {
        return "IRenderLocation";
    }
    get $isResolver() {
        return true;
    }
    resolve() {
        return this.l;
    }
}

const _n = new RenderLocationProvider(null);

const Vn = new ViewFactoryProvider(null);

const Fn = new G(Ln, new AuSlotsInfo(q));

var Mn;

(function(t) {
    t[t["None"] = 0] = "None";
    t[t["IgnoreAttr"] = 1] = "IgnoreAttr";
})(Mn || (Mn = {}));

function jn(t) {
    return function(i) {
        return zn.define(t, i);
    };
}

class BindingCommandDefinition {
    constructor(t, i, e, s, n) {
        this.Type = t;
        this.name = i;
        this.aliases = e;
        this.key = s;
        this.type = n;
    }
    static create(t, i) {
        let e;
        let s;
        if (Rt(t)) {
            e = t;
            s = {
                name: e
            };
        } else {
            e = t.name;
            s = t;
        }
        return new BindingCommandDefinition(i, D(Wn(i, "name"), e), V(Wn(i, "aliases"), s.aliases, i.aliases), Hn(e), D(Wn(i, "type"), s.type, i.type, null));
    }
    register(t) {
        const {Type: i, key: e, aliases: s} = this;
        _t(e, i).register(t);
        Vt(e, i).register(t);
        n(s, zn, e, t);
    }
}

const Nn = mt("binding-command");

const Hn = t => `${Nn}:${t}`;

const Wn = (t, i) => ct(vt(i), t);

const zn = Object.freeze({
    name: Nn,
    keyFrom: Hn,
    define(t, i) {
        const e = BindingCommandDefinition.create(t, i);
        ut(Nn, e, e.Type);
        ut(Nn, e, e);
        gt(i, Nn);
        return e.Type;
    },
    getAnnotation: Wn
});

let Gn = class OneTimeBindingCommand {
    constructor(t, i) {
        this.type = 0;
        this.m = t;
        this.ep = i;
    }
    get name() {
        return "one-time";
    }
    build(i) {
        var e;
        const s = i.attr;
        let n = s.target;
        let r = i.attr.rawValue;
        if (null == i.bindable) n = null !== (e = this.m.map(i.node, n)) && void 0 !== e ? e : Z(n); else {
            if ("" === r && 1 === i.def.type) r = Z(n);
            n = i.bindable.property;
        }
        return new PropertyBindingInstruction(this.ep.parse(r, 8), n, t.oneTime);
    }
};

Gn.inject = [ li, a ];

Gn = lt([ jn("one-time") ], Gn);

let Xn = class ToViewBindingCommand {
    constructor(t, i) {
        this.type = 0;
        this.m = t;
        this.ep = i;
    }
    get name() {
        return "to-view";
    }
    build(i) {
        var e;
        const s = i.attr;
        let n = s.target;
        let r = i.attr.rawValue;
        if (null == i.bindable) n = null !== (e = this.m.map(i.node, n)) && void 0 !== e ? e : Z(n); else {
            if ("" === r && 1 === i.def.type) r = Z(n);
            n = i.bindable.property;
        }
        return new PropertyBindingInstruction(this.ep.parse(r, 8), n, t.toView);
    }
};

Xn.inject = [ li, a ];

Xn = lt([ jn("to-view") ], Xn);

let Kn = class FromViewBindingCommand {
    constructor(t, i) {
        this.type = 0;
        this.m = t;
        this.ep = i;
    }
    get name() {
        return "from-view";
    }
    build(i) {
        var e;
        const s = i.attr;
        let n = s.target;
        let r = s.rawValue;
        if (null == i.bindable) n = null !== (e = this.m.map(i.node, n)) && void 0 !== e ? e : Z(n); else {
            if ("" === r && 1 === i.def.type) r = Z(n);
            n = i.bindable.property;
        }
        return new PropertyBindingInstruction(this.ep.parse(r, 8), n, t.fromView);
    }
};

Kn.inject = [ li, a ];

Kn = lt([ jn("from-view") ], Kn);

let Yn = class TwoWayBindingCommand {
    constructor(t, i) {
        this.type = 0;
        this.m = t;
        this.ep = i;
    }
    get name() {
        return "two-way";
    }
    build(i) {
        var e;
        const s = i.attr;
        let n = s.target;
        let r = s.rawValue;
        if (null == i.bindable) n = null !== (e = this.m.map(i.node, n)) && void 0 !== e ? e : Z(n); else {
            if ("" === r && 1 === i.def.type) r = Z(n);
            n = i.bindable.property;
        }
        return new PropertyBindingInstruction(this.ep.parse(r, 8), n, t.twoWay);
    }
};

Yn.inject = [ li, a ];

Yn = lt([ jn("two-way") ], Yn);

let Zn = class DefaultBindingCommand {
    constructor(t, i) {
        this.type = 0;
        this.m = t;
        this.ep = i;
    }
    get name() {
        return "bind";
    }
    build(i) {
        var e;
        const s = i.attr;
        const n = i.bindable;
        let r;
        let o;
        let l = s.target;
        let h = s.rawValue;
        if (null == n) {
            o = this.m.isTwoWay(i.node, l) ? t.twoWay : t.toView;
            l = null !== (e = this.m.map(i.node, l)) && void 0 !== e ? e : Z(l);
        } else {
            if ("" === h && 1 === i.def.type) h = Z(l);
            r = i.def.defaultBindingMode;
            o = n.mode === t.default || null == n.mode ? null == r || r === t.default ? t.toView : r : n.mode;
            l = n.property;
        }
        return new PropertyBindingInstruction(this.ep.parse(h, 8), l, o);
    }
};

Zn.inject = [ li, a ];

Zn = lt([ jn("bind") ], Zn);

let Jn = class CallBindingCommand {
    constructor(t) {
        this.type = 0;
        this.ep = t;
    }
    get name() {
        return "call";
    }
    build(t) {
        const i = null === t.bindable ? Z(t.attr.target) : t.bindable.property;
        return new CallBindingInstruction(this.ep.parse(t.attr.rawValue, 8 | 4), i);
    }
};

Jn.inject = [ a ];

Jn = lt([ jn("call") ], Jn);

let Qn = class ForBindingCommand {
    constructor(t) {
        this.type = 0;
        this.ep = t;
    }
    get name() {
        return "for";
    }
    build(t) {
        const i = null === t.bindable ? Z(t.attr.target) : t.bindable.property;
        return new IteratorBindingInstruction(this.ep.parse(t.attr.rawValue, 2), i);
    }
};

Qn.inject = [ a ];

Qn = lt([ jn("for") ], Qn);

let tr = class TriggerBindingCommand {
    constructor(t) {
        this.type = 1;
        this.ep = t;
    }
    get name() {
        return "trigger";
    }
    build(t) {
        return new ListenerBindingInstruction(this.ep.parse(t.attr.rawValue, 4), t.attr.target, true, f.none);
    }
};

tr.inject = [ a ];

tr = lt([ jn("trigger") ], tr);

let ir = class DelegateBindingCommand {
    constructor(t) {
        this.type = 1;
        this.ep = t;
    }
    get name() {
        return "delegate";
    }
    build(t) {
        return new ListenerBindingInstruction(this.ep.parse(t.attr.rawValue, 4), t.attr.target, false, f.bubbling);
    }
};

ir.inject = [ a ];

ir = lt([ jn("delegate") ], ir);

let er = class CaptureBindingCommand {
    constructor(t) {
        this.type = 1;
        this.ep = t;
    }
    get name() {
        return "capture";
    }
    build(t) {
        return new ListenerBindingInstruction(this.ep.parse(t.attr.rawValue, 4), t.attr.target, false, f.capturing);
    }
};

er.inject = [ a ];

er = lt([ jn("capture") ], er);

let sr = class AttrBindingCommand {
    constructor(t) {
        this.type = 1;
        this.ep = t;
    }
    get name() {
        return "attr";
    }
    build(t) {
        return new AttributeBindingInstruction(t.attr.target, this.ep.parse(t.attr.rawValue, 8), t.attr.target);
    }
};

sr.inject = [ a ];

sr = lt([ jn("attr") ], sr);

let nr = class StyleBindingCommand {
    constructor(t) {
        this.type = 1;
        this.ep = t;
    }
    get name() {
        return "style";
    }
    build(t) {
        return new AttributeBindingInstruction("style", this.ep.parse(t.attr.rawValue, 8), t.attr.target);
    }
};

nr.inject = [ a ];

nr = lt([ jn("style") ], nr);

let rr = class ClassBindingCommand {
    constructor(t) {
        this.type = 1;
        this.ep = t;
    }
    get name() {
        return "class";
    }
    build(t) {
        return new AttributeBindingInstruction("class", this.ep.parse(t.attr.rawValue, 8), t.attr.target);
    }
};

rr.inject = [ a ];

rr = lt([ jn("class") ], rr);

let or = class RefBindingCommand {
    constructor(t) {
        this.type = 1;
        this.ep = t;
    }
    get name() {
        return "ref";
    }
    build(t) {
        return new RefBindingInstruction(this.ep.parse(t.attr.rawValue, 8), t.attr.target);
    }
};

or.inject = [ a ];

or = lt([ jn("ref") ], or);

let lr = class SpreadBindingCommand {
    constructor() {
        this.type = 1;
    }
    get name() {
        return "...$attrs";
    }
    build(t) {
        return new SpreadBindingInstruction;
    }
};

lr = lt([ jn("...$attrs") ], lr);

const hr = L.createInterface("ITemplateElementFactory", (t => t.singleton(TemplateElementFactory)));

const cr = {};

class TemplateElementFactory {
    constructor(t) {
        this.p = t;
        this.si = t.document.createElement("template");
    }
    createTemplate(t) {
        var i;
        if (Rt(t)) {
            let i = cr[t];
            if (void 0 === i) {
                const e = this.si;
                e.innerHTML = t;
                const s = e.content.firstElementChild;
                if (null == s || "TEMPLATE" !== s.nodeName || null != s.nextElementSibling) {
                    this.si = this.p.document.createElement("template");
                    i = e;
                } else {
                    e.content.removeChild(s);
                    i = s;
                }
                cr[t] = i;
            }
            return i.cloneNode(true);
        }
        if ("TEMPLATE" !== t.nodeName) {
            const i = this.p.document.createElement("template");
            i.content.appendChild(t);
            return i;
        }
        null === (i = t.parentNode) || void 0 === i ? void 0 : i.removeChild(t);
        return t.cloneNode(true);
    }
}

TemplateElementFactory.inject = [ ni ];

class TemplateCompiler {
    constructor() {
        this.debug = false;
        this.resolveResources = true;
    }
    static register(t) {
        return _t(en, this).register(t);
    }
    compile(t, i, e) {
        var s, n, r, o;
        const l = CustomElementDefinition.getOrCreate(t);
        if (null === l.template || void 0 === l.template) return l;
        if (false === l.needsCompile) return l;
        null !== e && void 0 !== e ? e : e = fr;
        const h = new CompilationContext(t, i, e, null, null, void 0);
        const c = Rt(l.template) || !t.enhance ? h.ni.createTemplate(l.template) : l.template;
        const a = "TEMPLATE" === c.nodeName && null != c.content;
        const u = a ? c.content : c;
        const f = i.get(Ut(Cr));
        const d = f.length;
        let v = 0;
        if (d > 0) while (d > v) {
            null === (n = (s = f[v]).compiling) || void 0 === n ? void 0 : n.call(s, c);
            ++v;
        }
        if (c.hasAttribute(xr)) throw new Error(`AUR0701`);
        this.ri(u, h);
        this.oi(u, h);
        return CustomElementDefinition.create({
            ...t,
            name: t.name || me(),
            dependencies: (null !== (r = t.dependencies) && void 0 !== r ? r : q).concat(null !== (o = h.deps) && void 0 !== o ? o : q),
            instructions: h.rows,
            surrogates: a ? this.li(c, h) : q,
            template: c,
            hasSlots: h.hasSlot,
            needsCompile: false
        });
    }
    compileSpread(t, i, e, s) {
        var n;
        const r = new CompilationContext(t, e, fr, null, null, void 0);
        const o = [];
        const l = r.hi(s.nodeName.toLowerCase());
        const h = null !== l;
        const c = r.ep;
        const a = i.length;
        let u = 0;
        let f;
        let d = null;
        let v;
        let m;
        let g;
        let p;
        let w;
        let b = null;
        let x;
        let y;
        let k;
        let C;
        for (;a > u; ++u) {
            f = i[u];
            k = f.target;
            C = f.rawValue;
            b = r.ai(f);
            if (null !== b && (1 & b.type) > 0) {
                vr.node = s;
                vr.attr = f;
                vr.bindable = null;
                vr.def = null;
                o.push(b.build(vr));
                continue;
            }
            d = r.ui(k);
            if (null !== d) {
                if (d.isTemplateController) throw new Error(`AUR0703:${k}`);
                g = BindablesInfo.from(d, true);
                y = false === d.noMultiBindings && null === b && ar(C);
                if (y) m = this.fi(s, C, d, r); else {
                    w = g.primary;
                    if (null === b) {
                        x = c.parse(C, 1);
                        m = [ null === x ? new SetPropertyInstruction(C, w.property) : new InterpolationInstruction(x, w.property) ];
                    } else {
                        vr.node = s;
                        vr.attr = f;
                        vr.bindable = w;
                        vr.def = d;
                        m = [ b.build(vr) ];
                    }
                }
                (null !== v && void 0 !== v ? v : v = []).push(new HydrateAttributeInstruction(this.resolveResources ? d : d.name, null != d.aliases && d.aliases.includes(k) ? k : void 0, m));
                continue;
            }
            if (null === b) {
                x = c.parse(C, 1);
                if (h) {
                    g = BindablesInfo.from(l, false);
                    p = g.attrs[k];
                    if (void 0 !== p) {
                        x = c.parse(C, 1);
                        o.push(new SpreadElementPropBindingInstruction(null == x ? new SetPropertyInstruction(C, p.property) : new InterpolationInstruction(x, p.property)));
                        continue;
                    }
                }
                if (null != x) o.push(new InterpolationInstruction(x, null !== (n = r.m.map(s, k)) && void 0 !== n ? n : Z(k))); else switch (k) {
                  case "class":
                    o.push(new SetClassAttributeInstruction(C));
                    break;

                  case "style":
                    o.push(new SetStyleAttributeInstruction(C));
                    break;

                  default:
                    o.push(new SetAttributeInstruction(C, k));
                }
            } else {
                if (h) {
                    g = BindablesInfo.from(l, false);
                    p = g.attrs[k];
                    if (void 0 !== p) {
                        vr.node = s;
                        vr.attr = f;
                        vr.bindable = p;
                        vr.def = l;
                        o.push(new SpreadElementPropBindingInstruction(b.build(vr)));
                        continue;
                    }
                }
                vr.node = s;
                vr.attr = f;
                vr.bindable = null;
                vr.def = null;
                o.push(b.build(vr));
            }
        }
        ur();
        if (null != v) return v.concat(o);
        return o;
    }
    li(t, i) {
        var e;
        const s = [];
        const n = t.attributes;
        const r = i.ep;
        let o = n.length;
        let l = 0;
        let h;
        let c;
        let a;
        let u;
        let f = null;
        let d;
        let v;
        let m;
        let g;
        let p = null;
        let w;
        let b;
        let x;
        let y;
        for (;o > l; ++l) {
            h = n[l];
            c = h.name;
            a = h.value;
            u = i.di.parse(c, a);
            x = u.target;
            y = u.rawValue;
            if (mr[x]) throw new Error(`AUR0702:${c}`);
            p = i.ai(u);
            if (null !== p && (1 & p.type) > 0) {
                vr.node = t;
                vr.attr = u;
                vr.bindable = null;
                vr.def = null;
                s.push(p.build(vr));
                continue;
            }
            f = i.ui(x);
            if (null !== f) {
                if (f.isTemplateController) throw new Error(`AUR0703:${x}`);
                m = BindablesInfo.from(f, true);
                b = false === f.noMultiBindings && null === p && ar(y);
                if (b) v = this.fi(t, y, f, i); else {
                    g = m.primary;
                    if (null === p) {
                        w = r.parse(y, 1);
                        v = [ null === w ? new SetPropertyInstruction(y, g.property) : new InterpolationInstruction(w, g.property) ];
                    } else {
                        vr.node = t;
                        vr.attr = u;
                        vr.bindable = g;
                        vr.def = f;
                        v = [ p.build(vr) ];
                    }
                }
                t.removeAttribute(c);
                --l;
                --o;
                (null !== d && void 0 !== d ? d : d = []).push(new HydrateAttributeInstruction(this.resolveResources ? f : f.name, null != f.aliases && f.aliases.includes(x) ? x : void 0, v));
                continue;
            }
            if (null === p) {
                w = r.parse(y, 1);
                if (null != w) {
                    t.removeAttribute(c);
                    --l;
                    --o;
                    s.push(new InterpolationInstruction(w, null !== (e = i.m.map(t, x)) && void 0 !== e ? e : Z(x)));
                } else switch (c) {
                  case "class":
                    s.push(new SetClassAttributeInstruction(y));
                    break;

                  case "style":
                    s.push(new SetStyleAttributeInstruction(y));
                    break;

                  default:
                    s.push(new SetAttributeInstruction(y, c));
                }
            } else {
                vr.node = t;
                vr.attr = u;
                vr.bindable = null;
                vr.def = null;
                s.push(p.build(vr));
            }
        }
        ur();
        if (null != d) return d.concat(s);
        return s;
    }
    oi(t, i) {
        switch (t.nodeType) {
          case 1:
            switch (t.nodeName) {
              case "LET":
                return this.vi(t, i);

              default:
                return this.mi(t, i);
            }

          case 3:
            return this.gi(t, i);

          case 11:
            {
                let e = t.firstChild;
                while (null !== e) e = this.oi(e, i);
                break;
            }
        }
        return t.nextSibling;
    }
    vi(t, i) {
        const e = t.attributes;
        const s = e.length;
        const n = [];
        const r = i.ep;
        let o = false;
        let l = 0;
        let h;
        let c;
        let a;
        let u;
        let f;
        let d;
        let v;
        let g;
        for (;s > l; ++l) {
            h = e[l];
            a = h.name;
            u = h.value;
            if ("to-binding-context" === a) {
                o = true;
                continue;
            }
            c = i.di.parse(a, u);
            d = c.target;
            v = c.rawValue;
            f = i.ai(c);
            if (null !== f) switch (f.name) {
              case "to-view":
              case "bind":
                n.push(new LetBindingInstruction(r.parse(v, 8), Z(d)));
                continue;

              default:
                throw new Error(`AUR0704:${c.command}`);
            }
            g = r.parse(v, 1);
            n.push(new LetBindingInstruction(null === g ? new m(v) : g, Z(d)));
        }
        i.rows.push([ new HydrateLetElementInstruction(n, o) ]);
        return this.pi(t).nextSibling;
    }
    mi(t, i) {
        var e, s, n, r, o, l;
        var h, c, a, u;
        const f = t.nextSibling;
        const d = (null !== (e = t.getAttribute("as-element")) && void 0 !== e ? e : t.nodeName).toLowerCase();
        const v = i.hi(d);
        const m = null !== v;
        const g = m && null != v.shadowOptions;
        const p = null === v || void 0 === v ? void 0 : v.capture;
        const w = null != p && "boolean" !== typeof p;
        const b = p ? [] : q;
        const x = i.ep;
        const y = this.debug ? P : () => {
            t.removeAttribute(E);
            --R;
            --A;
        };
        let k = t.attributes;
        let C;
        let A = k.length;
        let R = 0;
        let S;
        let E;
        let B;
        let I;
        let T;
        let D;
        let $ = null;
        let O = false;
        let L;
        let U;
        let _;
        let V;
        let F;
        let M;
        let j;
        let N = null;
        let H;
        let W;
        let z;
        let G;
        let X = true;
        let K = false;
        let Y = false;
        if ("slot" === d) {
            if (null == i.root.def.shadowOptions) throw new Error(`AUR0717:${i.root.def.name}`);
            i.root.hasSlot = true;
        }
        if (m) {
            X = null === (s = v.processContent) || void 0 === s ? void 0 : s.call(v.Type, t, i.p);
            k = t.attributes;
            A = k.length;
        }
        if (i.root.def.enhance && t.classList.contains("au")) throw new Error(`AUR0705`);
        for (;A > R; ++R) {
            S = k[R];
            E = S.name;
            B = S.value;
            switch (E) {
              case "as-element":
              case "containerless":
                y();
                if (!K) K = "containerless" === E;
                continue;
            }
            I = i.di.parse(E, B);
            N = i.ai(I);
            z = I.target;
            G = I.rawValue;
            if (p && (!w || w && p(z))) {
                if (null != N && 1 & N.type) {
                    y();
                    b.push(I);
                    continue;
                }
                Y = "au-slot" !== z && "slot" !== z;
                if (Y) {
                    H = BindablesInfo.from(v, false);
                    if (null == H.attrs[z] && !(null === (n = i.ui(z)) || void 0 === n ? void 0 : n.isTemplateController)) {
                        y();
                        b.push(I);
                        continue;
                    }
                }
            }
            if (null !== N && 1 & N.type) {
                vr.node = t;
                vr.attr = I;
                vr.bindable = null;
                vr.def = null;
                (null !== T && void 0 !== T ? T : T = []).push(N.build(vr));
                y();
                continue;
            }
            $ = i.ui(z);
            if (null !== $) {
                H = BindablesInfo.from($, true);
                O = false === $.noMultiBindings && null === N && ar(G);
                if (O) _ = this.fi(t, G, $, i); else {
                    W = H.primary;
                    if (null === N) {
                        M = x.parse(G, 1);
                        _ = [ null === M ? new SetPropertyInstruction(G, W.property) : new InterpolationInstruction(M, W.property) ];
                    } else {
                        vr.node = t;
                        vr.attr = I;
                        vr.bindable = W;
                        vr.def = $;
                        _ = [ N.build(vr) ];
                    }
                }
                y();
                if ($.isTemplateController) (null !== V && void 0 !== V ? V : V = []).push(new HydrateTemplateController(dr, this.resolveResources ? $ : $.name, void 0, _)); else (null !== U && void 0 !== U ? U : U = []).push(new HydrateAttributeInstruction(this.resolveResources ? $ : $.name, null != $.aliases && $.aliases.includes(z) ? z : void 0, _));
                continue;
            }
            if (null === N) {
                if (m) {
                    H = BindablesInfo.from(v, false);
                    L = H.attrs[z];
                    if (void 0 !== L) {
                        M = x.parse(G, 1);
                        (null !== D && void 0 !== D ? D : D = []).push(null == M ? new SetPropertyInstruction(G, L.property) : new InterpolationInstruction(M, L.property));
                        y();
                        continue;
                    }
                }
                M = x.parse(G, 1);
                if (null != M) {
                    y();
                    (null !== T && void 0 !== T ? T : T = []).push(new InterpolationInstruction(M, null !== (r = i.m.map(t, z)) && void 0 !== r ? r : Z(z)));
                }
                continue;
            }
            y();
            if (m) {
                H = BindablesInfo.from(v, false);
                L = H.attrs[z];
                if (void 0 !== L) {
                    vr.node = t;
                    vr.attr = I;
                    vr.bindable = L;
                    vr.def = v;
                    (null !== D && void 0 !== D ? D : D = []).push(N.build(vr));
                    continue;
                }
            }
            vr.node = t;
            vr.attr = I;
            vr.bindable = null;
            vr.def = null;
            (null !== T && void 0 !== T ? T : T = []).push(N.build(vr));
        }
        ur();
        if (this.wi(t) && null != T && T.length > 1) this.bi(t, T);
        if (m) {
            j = new HydrateElementInstruction(this.resolveResources ? v : v.name, void 0, null !== D && void 0 !== D ? D : q, null, K, b);
            if (d === Ir) {
                const e = t.getAttribute("name") || Br;
                const s = i.h("template");
                const n = i.xi();
                let r = t.firstChild;
                while (null !== r) {
                    if (1 === r.nodeType && r.hasAttribute("au-slot")) t.removeChild(r); else s.content.appendChild(r);
                    r = t.firstChild;
                }
                this.oi(s.content, n);
                j.auSlot = {
                    name: e,
                    fallback: CustomElementDefinition.create({
                        name: me(),
                        template: s,
                        instructions: n.rows,
                        needsCompile: false
                    })
                };
                t = this.yi(t, i);
            }
        }
        if (null != T || null != j || null != U) {
            C = q.concat(null !== j && void 0 !== j ? j : q, null !== U && void 0 !== U ? U : q, null !== T && void 0 !== T ? T : q);
            this.pi(t);
        }
        let J;
        if (null != V) {
            A = V.length - 1;
            R = A;
            F = V[R];
            let e;
            this.yi(t, i);
            if ("TEMPLATE" === t.nodeName) e = t; else {
                e = i.h("template");
                e.content.appendChild(t);
            }
            const s = e;
            const n = i.xi(null == C ? [] : [ C ]);
            let r;
            let l;
            let a;
            let u;
            let f;
            let p;
            let w;
            let b;
            let x = 0, y = 0;
            let k = t.firstChild;
            let S = false;
            if (false !== X) while (null !== k) {
                l = 1 === k.nodeType ? k.getAttribute(Ir) : null;
                if (null !== l) k.removeAttribute(Ir);
                if (m) {
                    r = k.nextSibling;
                    if (!g) {
                        S = 3 === k.nodeType && "" === k.textContent.trim();
                        if (!S) (null !== (o = (h = null !== u && void 0 !== u ? u : u = {})[c = l || Br]) && void 0 !== o ? o : h[c] = []).push(k);
                        t.removeChild(k);
                    }
                    k = r;
                } else {
                    if (null !== l) {
                        l = l || Br;
                        throw new Error(`AUR0706:${d}[${l}]`);
                    }
                    k = k.nextSibling;
                }
            }
            if (null != u) {
                a = {};
                for (l in u) {
                    e = i.h("template");
                    f = u[l];
                    for (x = 0, y = f.length; y > x; ++x) {
                        p = f[x];
                        if ("TEMPLATE" === p.nodeName) if (p.attributes.length > 0) e.content.appendChild(p); else e.content.appendChild(p.content); else e.content.appendChild(p);
                    }
                    b = i.xi();
                    this.oi(e.content, b);
                    a[l] = CustomElementDefinition.create({
                        name: me(),
                        template: e,
                        instructions: b.rows,
                        needsCompile: false,
                        isStrictBinding: i.root.def.isStrictBinding
                    });
                }
                j.projections = a;
            }
            if (m && (K || v.containerless)) this.yi(t, i);
            J = !m || !v.containerless && !K && false !== X;
            if (J) if ("TEMPLATE" === t.nodeName) this.oi(t.content, n); else {
                k = t.firstChild;
                while (null !== k) k = this.oi(k, n);
            }
            F.def = CustomElementDefinition.create({
                name: me(),
                template: s,
                instructions: n.rows,
                needsCompile: false,
                isStrictBinding: i.root.def.isStrictBinding
            });
            while (R-- > 0) {
                F = V[R];
                e = i.h("template");
                w = i.h("au-m");
                w.classList.add("au");
                e.content.appendChild(w);
                F.def = CustomElementDefinition.create({
                    name: me(),
                    template: e,
                    needsCompile: false,
                    instructions: [ [ V[R + 1] ] ],
                    isStrictBinding: i.root.def.isStrictBinding
                });
            }
            i.rows.push([ F ]);
        } else {
            if (null != C) i.rows.push(C);
            let e = t.firstChild;
            let s;
            let n;
            let r = null;
            let o;
            let h;
            let c;
            let f;
            let p;
            let w = false;
            let b = 0, x = 0;
            if (false !== X) while (null !== e) {
                n = 1 === e.nodeType ? e.getAttribute(Ir) : null;
                if (null !== n) e.removeAttribute(Ir);
                if (m) {
                    s = e.nextSibling;
                    if (!g) {
                        w = 3 === e.nodeType && "" === e.textContent.trim();
                        if (!w) (null !== (l = (a = null !== o && void 0 !== o ? o : o = {})[u = n || Br]) && void 0 !== l ? l : a[u] = []).push(e);
                        t.removeChild(e);
                    }
                    e = s;
                } else {
                    if (null !== n) {
                        n = n || Br;
                        throw new Error(`AUR0706:${d}[${n}]`);
                    }
                    e = e.nextSibling;
                }
            }
            if (null != o) {
                r = {};
                for (n in o) {
                    f = i.h("template");
                    h = o[n];
                    for (b = 0, x = h.length; x > b; ++b) {
                        c = h[b];
                        if ("TEMPLATE" === c.nodeName) if (c.attributes.length > 0) f.content.appendChild(c); else f.content.appendChild(c.content); else f.content.appendChild(c);
                    }
                    p = i.xi();
                    this.oi(f.content, p);
                    r[n] = CustomElementDefinition.create({
                        name: me(),
                        template: f,
                        instructions: p.rows,
                        needsCompile: false,
                        isStrictBinding: i.root.def.isStrictBinding
                    });
                }
                j.projections = r;
            }
            if (m && (K || v.containerless)) this.yi(t, i);
            J = !m || !v.containerless && !K && false !== X;
            if (J && t.childNodes.length > 0) {
                e = t.firstChild;
                while (null !== e) e = this.oi(e, i);
            }
        }
        return f;
    }
    gi(t, i) {
        let e = "";
        let s = t;
        while (null !== s && 3 === s.nodeType) {
            e += s.textContent;
            s = s.nextSibling;
        }
        const n = i.ep.parse(e, 1);
        if (null === n) return s;
        const r = t.parentNode;
        r.insertBefore(this.pi(i.h("au-m")), t);
        i.rows.push([ new TextBindingInstruction(n, !!i.def.isStrictBinding) ]);
        t.textContent = "";
        s = t.nextSibling;
        while (null !== s && 3 === s.nodeType) {
            r.removeChild(s);
            s = t.nextSibling;
        }
        return t.nextSibling;
    }
    fi(t, i, e, s) {
        const n = BindablesInfo.from(e, true);
        const r = i.length;
        const o = [];
        let l;
        let h;
        let c = 0;
        let a = 0;
        let u;
        let f;
        let d;
        let v;
        for (let m = 0; m < r; ++m) {
            a = i.charCodeAt(m);
            if (92 === a) ++m; else if (58 === a) {
                l = i.slice(c, m);
                while (i.charCodeAt(++m) <= 32) ;
                c = m;
                for (;m < r; ++m) {
                    a = i.charCodeAt(m);
                    if (92 === a) ++m; else if (59 === a) {
                        h = i.slice(c, m);
                        break;
                    }
                }
                if (void 0 === h) h = i.slice(c);
                f = s.di.parse(l, h);
                d = s.ai(f);
                v = n.attrs[f.target];
                if (null == v) throw new Error(`AUR0707:${e.name}.${f.target}`);
                if (null === d) {
                    u = s.ep.parse(h, 1);
                    o.push(null === u ? new SetPropertyInstruction(h, v.property) : new InterpolationInstruction(u, v.property));
                } else {
                    vr.node = t;
                    vr.attr = f;
                    vr.bindable = v;
                    vr.def = e;
                    o.push(d.build(vr));
                }
                while (m < r && i.charCodeAt(++m) <= 32) ;
                c = m;
                l = void 0;
                h = void 0;
            }
        }
        ur();
        return o;
    }
    ri(t, i) {
        var e, s;
        const n = t;
        const r = J(n.querySelectorAll("template[as-custom-element]"));
        const o = r.length;
        if (0 === o) return;
        if (o === n.childElementCount) throw new Error(`AUR0708`);
        const l = new Set;
        const h = [];
        for (const t of r) {
            if (t.parentNode !== n) throw new Error(`AUR0709`);
            const e = yr(t, l);
            const s = class LocalTemplate {};
            const r = t.content;
            const o = J(r.querySelectorAll("bindable"));
            const c = Dt.for(s);
            const a = new Set;
            const u = new Set;
            for (const t of o) {
                if (t.parentNode !== r) throw new Error(`AUR0710`);
                const i = t.getAttribute("property");
                if (null === i) throw new Error(`AUR0711`);
                const e = t.getAttribute("attribute");
                if (null !== e && u.has(e) || a.has(i)) throw new Error(`AUR0712:${i}+${e}`); else {
                    if (null !== e) u.add(e);
                    a.add(i);
                }
                c.add({
                    property: i,
                    attribute: null !== e && void 0 !== e ? e : void 0,
                    mode: kr(t)
                });
                const s = t.getAttributeNames().filter((t => !br.includes(t)));
                if (s.length > 0) ;
                r.removeChild(t);
            }
            h.push(s);
            i.ki(pe({
                name: e,
                template: t
            }, s));
            n.removeChild(t);
        }
        let c = 0;
        const a = h.length;
        for (;a > c; ++c) ye(h[c]).dependencies.push(...null !== (e = i.def.dependencies) && void 0 !== e ? e : q, ...null !== (s = i.deps) && void 0 !== s ? s : q);
    }
    wi(t) {
        return "INPUT" === t.nodeName && 1 === gr[t.type];
    }
    bi(t, i) {
        switch (t.nodeName) {
          case "INPUT":
            {
                const t = i;
                let e;
                let s;
                let n = 0;
                let r;
                for (let i = 0; i < t.length && n < 3; i++) {
                    r = t[i];
                    switch (r.to) {
                      case "model":
                      case "value":
                      case "matcher":
                        e = i;
                        n++;
                        break;

                      case "checked":
                        s = i;
                        n++;
                        break;
                    }
                }
                if (void 0 !== s && void 0 !== e && s < e) [t[e], t[s]] = [ t[s], t[e] ];
            }
        }
    }
    pi(t) {
        t.classList.add("au");
        return t;
    }
    yi(t, i) {
        const e = t.parentNode;
        const s = i.h("au-m");
        this.pi(e.insertBefore(s, t));
        e.removeChild(t);
        return s;
    }
}

class CompilationContext {
    constructor(t, i, e, s, n, r) {
        this.hasSlot = false;
        this.Ci = bt();
        const o = null !== s;
        this.c = i;
        this.root = null === n ? this : n;
        this.def = t;
        this.ci = e;
        this.parent = s;
        this.ni = o ? s.ni : i.get(hr);
        this.di = o ? s.di : i.get(Gt);
        this.ep = o ? s.ep : i.get(a);
        this.m = o ? s.m : i.get(li);
        this.Ut = o ? s.Ut : i.get(K);
        this.p = o ? s.p : i.get(ni);
        this.localEls = o ? s.localEls : new Set;
        this.rows = null !== r && void 0 !== r ? r : [];
    }
    ki(t) {
        var i;
        var e;
        (null !== (i = (e = this.root).deps) && void 0 !== i ? i : e.deps = []).push(t);
        this.root.c.register(t);
    }
    h(t) {
        const i = this.p.document.createElement(t);
        if ("template" === t) this.p.document.adoptNode(i.content);
        return i;
    }
    hi(t) {
        return this.c.find(Ae, t);
    }
    ui(t) {
        return this.c.find(Yi, t);
    }
    xi(t) {
        return new CompilationContext(this.def, this.c, this.ci, this, this.root, t);
    }
    ai(t) {
        if (this.root !== this) return this.root.ai(t);
        const i = t.command;
        if (null === i) return null;
        let e = this.Ci[i];
        if (void 0 === e) {
            e = this.c.create(zn, i);
            if (null === e) throw new Error(`AUR0713:${i}`);
            this.Ci[i] = e;
        }
        return e;
    }
}

function ar(t) {
    const i = t.length;
    let e = 0;
    let s = 0;
    while (i > s) {
        e = t.charCodeAt(s);
        if (92 === e) ++s; else if (58 === e) return true; else if (36 === e && 123 === t.charCodeAt(s + 1)) return false;
        ++s;
    }
    return false;
}

function ur() {
    vr.node = vr.attr = vr.bindable = vr.def = null;
}

const fr = {
    projections: null
};

const dr = {
    name: "unnamed"
};

const vr = {
    node: null,
    attr: null,
    bindable: null,
    def: null
};

const mr = Object.assign(bt(), {
    id: true,
    name: true,
    "au-slot": true,
    "as-element": true
});

const gr = {
    checkbox: 1,
    radio: 1
};

const pr = new WeakMap;

class BindablesInfo {
    constructor(t, i, e) {
        this.attrs = t;
        this.bindables = i;
        this.primary = e;
    }
    static from(i, e) {
        let s = pr.get(i);
        if (null == s) {
            const n = i.bindables;
            const r = bt();
            const o = e ? void 0 === i.defaultBindingMode ? t.default : i.defaultBindingMode : t.default;
            let l;
            let h;
            let c = false;
            let a;
            let u;
            for (h in n) {
                l = n[h];
                u = l.attribute;
                if (true === l.primary) {
                    if (c) throw new Error(`AUR0714:${i.name}`);
                    c = true;
                    a = l;
                } else if (!c && null == a) a = l;
                r[u] = BindableDefinition.create(h, i.Type, l);
            }
            if (null == l && e) a = r.value = BindableDefinition.create("value", i.Type, {
                mode: o
            });
            pr.set(i, s = new BindablesInfo(r, n, a));
        }
        return s;
    }
}

var wr;

(function(t) {
    t["property"] = "property";
    t["attribute"] = "attribute";
    t["mode"] = "mode";
})(wr || (wr = {}));

const br = Object.freeze([ "property", "attribute", "mode" ]);

const xr = "as-custom-element";

function yr(t, i) {
    const e = t.getAttribute(xr);
    if (null === e || "" === e) throw new Error(`AUR0715`);
    if (i.has(e)) throw new Error(`AUR0716:${e}`); else {
        i.add(e);
        t.removeAttribute(xr);
    }
    return e;
}

function kr(i) {
    switch (i.getAttribute("mode")) {
      case "oneTime":
        return t.oneTime;

      case "toView":
        return t.toView;

      case "fromView":
        return t.fromView;

      case "twoWay":
        return t.twoWay;

      case "default":
      default:
        return t.default;
    }
}

const Cr = L.createInterface("ITemplateCompilerHooks");

const Ar = new WeakMap;

const Rr = mt("compiler-hooks");

const Sr = Object.freeze({
    name: Rr,
    define(t) {
        let i = Ar.get(t);
        if (void 0 === i) {
            Ar.set(t, i = new TemplateCompilerHooksDefinition(t));
            ut(Rr, i, t);
            gt(t, Rr);
        }
        return t;
    }
});

class TemplateCompilerHooksDefinition {
    constructor(t) {
        this.Type = t;
    }
    get name() {
        return "";
    }
    register(t) {
        t.register(_t(Cr, this.Type));
    }
}

const Er = t => {
    return void 0 === t ? i : i(t);
    function i(t) {
        return Sr.define(t);
    }
};

const Br = "default";

const Ir = "au-slot";

class BindingModeBehavior {
    constructor(t) {
        this.mode = t;
        this.Ai = new Map;
    }
    bind(t, i, e) {
        this.Ai.set(e, e.mode);
        e.mode = this.mode;
    }
    unbind(t, i, e) {
        e.mode = this.Ai.get(e);
        this.Ai.delete(e);
    }
}

class OneTimeBindingBehavior extends BindingModeBehavior {
    constructor() {
        super(t.oneTime);
    }
}

class ToViewBindingBehavior extends BindingModeBehavior {
    constructor() {
        super(t.toView);
    }
}

class FromViewBindingBehavior extends BindingModeBehavior {
    constructor() {
        super(t.fromView);
    }
}

class TwoWayBindingBehavior extends BindingModeBehavior {
    constructor() {
        super(t.twoWay);
    }
}

g("oneTime")(OneTimeBindingBehavior);

g("toView")(ToViewBindingBehavior);

g("fromView")(FromViewBindingBehavior);

g("twoWay")(TwoWayBindingBehavior);

const Tr = 200;

class DebounceBindingBehavior extends p {
    constructor(t, i) {
        super(t, i);
        this.opts = {
            delay: Tr
        };
        this.firstArg = null;
        this.task = null;
        this.taskQueue = t.locator.get(_).taskQueue;
        if (i.args.length > 0) this.firstArg = i.args[0];
    }
    callSource(t) {
        this.queueTask((() => this.binding.callSource(t)));
        return;
    }
    handleChange(t, i, e) {
        if (null !== this.task) {
            this.task.cancel();
            this.task = null;
        }
        this.binding.handleChange(t, i, e);
    }
    updateSource(t, i) {
        this.queueTask((() => this.binding.updateSource(t, i)));
    }
    queueTask(t) {
        const i = this.task;
        this.task = this.taskQueue.queueTask((() => {
            this.task = null;
            return t();
        }), this.opts);
        null === i || void 0 === i ? void 0 : i.cancel();
    }
    $bind(t, i) {
        if (null !== this.firstArg) {
            const e = Number(this.firstArg.evaluate(t, i, this.locator, null));
            this.opts.delay = isNaN(e) ? Tr : e;
        }
        this.binding.$bind(t, i);
    }
    $unbind(t) {
        var i;
        null === (i = this.task) || void 0 === i ? void 0 : i.cancel();
        this.task = null;
        this.binding.$unbind(t);
    }
}

g("debounce")(DebounceBindingBehavior);

class SignalBindingBehavior {
    constructor(t) {
        this.Yt = new Map;
        this.Ri = t;
    }
    bind(t, i, e, ...s) {
        if (!("handleChange" in e)) throw new Error(`AUR0817`);
        if (0 === s.length) throw new Error(`AUR0818`);
        this.Yt.set(e, s);
        let n;
        for (n of s) this.Ri.addSignalListener(n, e);
    }
    unbind(t, i, e) {
        const s = this.Yt.get(e);
        this.Yt.delete(e);
        let n;
        for (n of s) this.Ri.removeSignalListener(n, e);
    }
}

SignalBindingBehavior.inject = [ w ];

g("signal")(SignalBindingBehavior);

const Dr = 200;

class ThrottleBindingBehavior extends p {
    constructor(t, i) {
        super(t, i);
        this.opts = {
            delay: Dr
        };
        this.firstArg = null;
        this.task = null;
        this.lastCall = 0;
        this.delay = 0;
        this.p = t.locator.get(_);
        this.Si = this.p.taskQueue;
        if (i.args.length > 0) this.firstArg = i.args[0];
    }
    callSource(t) {
        this.Ei((() => this.binding.callSource(t)));
        return;
    }
    handleChange(t, i, e) {
        if (null !== this.task) {
            this.task.cancel();
            this.task = null;
            this.lastCall = this.p.performanceNow();
        }
        this.binding.handleChange(t, i, e);
    }
    updateSource(t, i) {
        this.Ei((() => this.binding.updateSource(t, i)));
    }
    Ei(t) {
        const i = this.opts;
        const e = this.p;
        const s = this.lastCall + i.delay - e.performanceNow();
        if (s > 0) {
            const n = this.task;
            i.delay = s;
            this.task = this.Si.queueTask((() => {
                this.lastCall = e.performanceNow();
                this.task = null;
                i.delay = this.delay;
                t();
            }), i);
            null === n || void 0 === n ? void 0 : n.cancel();
        } else {
            this.lastCall = e.performanceNow();
            t();
        }
    }
    $bind(t, i) {
        if (null !== this.firstArg) {
            const e = Number(this.firstArg.evaluate(t, i, this.locator, null));
            this.opts.delay = this.delay = isNaN(e) ? Dr : e;
        }
        this.binding.$bind(t, i);
    }
    $unbind(t) {
        var i;
        null === (i = this.task) || void 0 === i ? void 0 : i.cancel();
        this.task = null;
        super.$unbind(t);
    }
}

g("throttle")(ThrottleBindingBehavior);

class DataAttributeAccessor {
    constructor() {
        this.type = 2 | 4;
    }
    getValue(t, i) {
        return t.getAttribute(i);
    }
    setValue(t, i, e, s) {
        if (null == t) e.removeAttribute(s); else e.setAttribute(s, t);
    }
}

const $r = new DataAttributeAccessor;

class AttrBindingBehavior {
    bind(t, i, e) {
        e.targetObserver = $r;
    }
    unbind(t, i, e) {
        return;
    }
}

g("attr")(AttrBindingBehavior);

function Pr(t) {
    const i = t.composedPath()[0];
    if (this.target !== i) return;
    return this.selfEventCallSource(t);
}

class SelfBindingBehavior {
    bind(t, i, e) {
        if (!e.callSource || !e.targetEvent) throw new Error(`AUR0801`);
        e.selfEventCallSource = e.callSource;
        e.callSource = Pr;
    }
    unbind(t, i, e) {
        e.callSource = e.selfEventCallSource;
        e.selfEventCallSource = null;
    }
}

g("self")(SelfBindingBehavior);

const Or = bt();

class AttributeNSAccessor {
    constructor(t) {
        this.ns = t;
        this.type = 2 | 4;
    }
    static forNs(t) {
        var i;
        return null !== (i = Or[t]) && void 0 !== i ? i : Or[t] = new AttributeNSAccessor(t);
    }
    getValue(t, i) {
        return t.getAttributeNS(this.ns, i);
    }
    setValue(t, i, e, s) {
        if (null == t) e.removeAttributeNS(this.ns, s); else e.setAttributeNS(this.ns, s, t);
    }
}

function Lr(t, i) {
    return t === i;
}

class CheckedObserver {
    constructor(t, i, e, s) {
        this.handler = e;
        this.type = 2 | 1 | 4;
        this.v = void 0;
        this.ov = void 0;
        this.Bi = void 0;
        this.Ii = void 0;
        this.f = 0;
        this.o = t;
        this.oL = s;
    }
    getValue() {
        return this.v;
    }
    setValue(t, i) {
        const e = this.v;
        if (t === e) return;
        this.v = t;
        this.ov = e;
        this.f = i;
        this.Ti();
        this.Di();
        this.queue.add(this);
    }
    handleCollectionChange(t, i) {
        this.Di();
    }
    handleChange(t, i, e) {
        this.Di();
    }
    Di() {
        const t = this.v;
        const i = this.o;
        const e = xt.call(i, "model") ? i.model : i.value;
        const s = "radio" === i.type;
        const n = void 0 !== i.matcher ? i.matcher : Lr;
        if (s) i.checked = !!n(t, e); else if (true === t) i.checked = true; else {
            let s = false;
            if (t instanceof Array) s = -1 !== t.findIndex((t => !!n(t, e))); else if (t instanceof Set) {
                for (const i of t) if (n(i, e)) {
                    s = true;
                    break;
                }
            } else if (t instanceof Map) for (const i of t) {
                const t = i[0];
                const r = i[1];
                if (n(t, e) && true === r) {
                    s = true;
                    break;
                }
            }
            i.checked = s;
        }
    }
    handleEvent() {
        let t = this.ov = this.v;
        const i = this.o;
        const e = xt.call(i, "model") ? i.model : i.value;
        const s = i.checked;
        const n = void 0 !== i.matcher ? i.matcher : Lr;
        if ("checkbox" === i.type) {
            if (t instanceof Array) {
                const i = t.findIndex((t => !!n(t, e)));
                if (s && -1 === i) t.push(e); else if (!s && -1 !== i) t.splice(i, 1);
                return;
            } else if (t instanceof Set) {
                const i = {};
                let r = i;
                for (const i of t) if (true === n(i, e)) {
                    r = i;
                    break;
                }
                if (s && r === i) t.add(e); else if (!s && r !== i) t.delete(r);
                return;
            } else if (t instanceof Map) {
                let i;
                for (const s of t) {
                    const t = s[0];
                    if (true === n(t, e)) {
                        i = t;
                        break;
                    }
                }
                t.set(i, s);
                return;
            }
            t = s;
        } else if (s) t = e; else return;
        this.v = t;
        this.queue.add(this);
    }
    start() {
        this.handler.subscribe(this.o, this);
        this.Ti();
    }
    stop() {
        var t, i;
        this.handler.dispose();
        null === (t = this.Bi) || void 0 === t ? void 0 : t.unsubscribe(this);
        this.Bi = void 0;
        null === (i = this.Ii) || void 0 === i ? void 0 : i.unsubscribe(this);
    }
    subscribe(t) {
        if (this.subs.add(t) && 1 === this.subs.count) this.start();
    }
    unsubscribe(t) {
        if (this.subs.remove(t) && 0 === this.subs.count) this.stop();
    }
    flush() {
        qr = this.ov;
        this.ov = this.v;
        this.subs.notify(this.v, qr, this.f);
    }
    Ti() {
        var t, i, e, s, n, r, o;
        const l = this.o;
        null === (n = null !== (t = this.Ii) && void 0 !== t ? t : this.Ii = null !== (e = null === (i = l.$observers) || void 0 === i ? void 0 : i.model) && void 0 !== e ? e : null === (s = l.$observers) || void 0 === s ? void 0 : s.value) || void 0 === n ? void 0 : n.subscribe(this);
        null === (r = this.Bi) || void 0 === r ? void 0 : r.unsubscribe(this);
        this.Bi = void 0;
        if ("checkbox" === l.type) null === (o = this.Bi = Xr(this.v, this.oL)) || void 0 === o ? void 0 : o.subscribe(this);
    }
}

i(CheckedObserver);

e(CheckedObserver);

let qr;

const Ur = {
    childList: true,
    subtree: true,
    characterData: true
};

function _r(t, i) {
    return t === i;
}

class SelectValueObserver {
    constructor(t, i, e, s) {
        this.type = 2 | 1 | 4;
        this.v = void 0;
        this.ov = void 0;
        this.W = false;
        this.$i = void 0;
        this.Pi = void 0;
        this.iO = false;
        this.o = t;
        this.oL = s;
        this.handler = e;
    }
    getValue() {
        return this.iO ? this.v : this.o.multiple ? Vr(this.o.options) : this.o.value;
    }
    setValue(t, i) {
        this.ov = this.v;
        this.v = t;
        this.W = t !== this.ov;
        this.Oi(t instanceof Array ? t : null);
        if (0 === (32 & i)) this.K();
    }
    K() {
        if (this.W) {
            this.W = false;
            this.syncOptions();
        }
    }
    handleCollectionChange() {
        this.syncOptions();
    }
    syncOptions() {
        var t;
        const i = this.v;
        const e = this.o;
        const s = Array.isArray(i);
        const n = null !== (t = e.matcher) && void 0 !== t ? t : _r;
        const r = e.options;
        let o = r.length;
        while (o-- > 0) {
            const t = r[o];
            const e = xt.call(t, "model") ? t.model : t.value;
            if (s) {
                t.selected = -1 !== i.findIndex((t => !!n(e, t)));
                continue;
            }
            t.selected = !!n(e, i);
        }
    }
    syncValue() {
        const t = this.o;
        const i = t.options;
        const e = i.length;
        const s = this.v;
        let n = 0;
        if (t.multiple) {
            if (!(s instanceof Array)) return true;
            let r;
            const o = t.matcher || _r;
            const l = [];
            while (n < e) {
                r = i[n];
                if (r.selected) l.push(xt.call(r, "model") ? r.model : r.value);
                ++n;
            }
            let h;
            n = 0;
            while (n < s.length) {
                h = s[n];
                if (-1 === l.findIndex((t => !!o(h, t)))) s.splice(n, 1); else ++n;
            }
            n = 0;
            while (n < l.length) {
                h = l[n];
                if (-1 === s.findIndex((t => !!o(h, t)))) s.push(h);
                ++n;
            }
            return false;
        }
        let r = null;
        let o;
        while (n < e) {
            o = i[n];
            if (o.selected) {
                r = xt.call(o, "model") ? o.model : o.value;
                break;
            }
            ++n;
        }
        this.ov = this.v;
        this.v = r;
        return true;
    }
    Li() {
        (this.Pi = new this.o.ownerDocument.defaultView.MutationObserver(this.qi.bind(this))).observe(this.o, Ur);
        this.Oi(this.v instanceof Array ? this.v : null);
        this.iO = true;
    }
    Ui() {
        var t;
        this.Pi.disconnect();
        null === (t = this.$i) || void 0 === t ? void 0 : t.unsubscribe(this);
        this.Pi = this.$i = void 0;
        this.iO = false;
    }
    Oi(t) {
        var i;
        null === (i = this.$i) || void 0 === i ? void 0 : i.unsubscribe(this);
        this.$i = void 0;
        if (null != t) {
            if (!this.o.multiple) throw new Error(`AUR0654`);
            (this.$i = this.oL.getArrayObserver(t)).subscribe(this);
        }
    }
    handleEvent() {
        const t = this.syncValue();
        if (t) this.queue.add(this);
    }
    qi(t) {
        this.syncOptions();
        const i = this.syncValue();
        if (i) this.queue.add(this);
    }
    subscribe(t) {
        if (this.subs.add(t) && 1 === this.subs.count) {
            this.handler.subscribe(this.o, this);
            this.Li();
        }
    }
    unsubscribe(t) {
        if (this.subs.remove(t) && 0 === this.subs.count) {
            this.handler.dispose();
            this.Ui();
        }
    }
    flush() {
        Fr = this.ov;
        this.ov = this.v;
        this.subs.notify(this.v, Fr, 0);
    }
}

i(SelectValueObserver);

e(SelectValueObserver);

function Vr(t) {
    const i = [];
    if (0 === t.length) return i;
    const e = t.length;
    let s = 0;
    let n;
    while (e > s) {
        n = t[s];
        if (n.selected) i[i.length] = xt.call(n, "model") ? n.model : n.value;
        ++s;
    }
    return i;
}

let Fr;

const Mr = "--";

class StyleAttributeAccessor {
    constructor(t) {
        this.obj = t;
        this.type = 2 | 4;
        this.value = "";
        this.ov = "";
        this.styles = {};
        this.version = 0;
        this.W = false;
    }
    getValue() {
        return this.obj.style.cssText;
    }
    setValue(t, i) {
        this.value = t;
        this.W = t !== this.ov;
        if (0 === (32 & i)) this.K();
    }
    _i(t) {
        const i = [];
        const e = /url\([^)]+$/;
        let s = 0;
        let n = "";
        let r;
        let o;
        let l;
        let h;
        while (s < t.length) {
            r = t.indexOf(";", s);
            if (-1 === r) r = t.length;
            n += t.substring(s, r);
            s = r + 1;
            if (e.test(n)) {
                n += ";";
                continue;
            }
            o = n.indexOf(":");
            l = n.substring(0, o).trim();
            h = n.substring(o + 1).trim();
            i.push([ l, h ]);
            n = "";
        }
        return i;
    }
    Vi(t) {
        let i;
        let e;
        const s = [];
        for (e in t) {
            i = t[e];
            if (null == i) continue;
            if (Rt(i)) {
                if (e.startsWith(Mr)) {
                    s.push([ e, i ]);
                    continue;
                }
                s.push([ $(e), i ]);
                continue;
            }
            s.push(...this.Fi(i));
        }
        return s;
    }
    Mi(t) {
        const i = t.length;
        if (i > 0) {
            const e = [];
            let s = 0;
            for (;i > s; ++s) e.push(...this.Fi(t[s]));
            return e;
        }
        return q;
    }
    Fi(t) {
        if (Rt(t)) return this._i(t);
        if (t instanceof Array) return this.Mi(t);
        if (t instanceof Object) return this.Vi(t);
        return q;
    }
    K() {
        if (this.W) {
            this.W = false;
            const t = this.value;
            const i = this.styles;
            const e = this.Fi(t);
            let s;
            let n = this.version;
            this.ov = t;
            let r;
            let o;
            let l;
            let h = 0;
            const c = e.length;
            for (;h < c; ++h) {
                r = e[h];
                o = r[0];
                l = r[1];
                this.setProperty(o, l);
                i[o] = n;
            }
            this.styles = i;
            this.version += 1;
            if (0 === n) return;
            n -= 1;
            for (s in i) {
                if (!xt.call(i, s) || i[s] !== n) continue;
                this.obj.style.removeProperty(s);
            }
        }
    }
    setProperty(t, i) {
        let e = "";
        if (null != i && At(i.indexOf) && i.includes("!important")) {
            e = "important";
            i = i.replace("!important", "");
        }
        this.obj.style.setProperty(t, i, e);
    }
    bind(t) {
        this.value = this.ov = this.obj.style.cssText;
    }
}

class ValueAttributeObserver {
    constructor(t, i, e) {
        this.handler = e;
        this.type = 2 | 1 | 4;
        this.v = "";
        this.ov = "";
        this.W = false;
        this.o = t;
        this.k = i;
    }
    getValue() {
        return this.v;
    }
    setValue(t, i) {
        if (Object.is(t, this.v)) return;
        this.ov = this.v;
        this.v = t;
        this.W = true;
        if (!this.handler.config.readonly && 0 === (32 & i)) this.K(i);
    }
    K(t) {
        var i;
        if (this.W) {
            this.W = false;
            this.o[this.k] = null !== (i = this.v) && void 0 !== i ? i : this.handler.config.default;
            if (0 === (2 & t)) this.queue.add(this);
        }
    }
    handleEvent() {
        this.ov = this.v;
        this.v = this.o[this.k];
        if (this.ov !== this.v) {
            this.W = false;
            this.queue.add(this);
        }
    }
    subscribe(t) {
        if (this.subs.add(t) && 1 === this.subs.count) {
            this.handler.subscribe(this.o, this);
            this.v = this.ov = this.o[this.k];
        }
    }
    unsubscribe(t) {
        if (this.subs.remove(t) && 0 === this.subs.count) this.handler.dispose();
    }
    flush() {
        jr = this.ov;
        this.ov = this.v;
        this.subs.notify(this.v, jr, 0);
    }
}

i(ValueAttributeObserver);

e(ValueAttributeObserver);

let jr;

const Nr = "http://www.w3.org/1999/xlink";

const Hr = "http://www.w3.org/XML/1998/namespace";

const Wr = "http://www.w3.org/2000/xmlns/";

const zr = Object.assign(bt(), {
    "xlink:actuate": [ "actuate", Nr ],
    "xlink:arcrole": [ "arcrole", Nr ],
    "xlink:href": [ "href", Nr ],
    "xlink:role": [ "role", Nr ],
    "xlink:show": [ "show", Nr ],
    "xlink:title": [ "title", Nr ],
    "xlink:type": [ "type", Nr ],
    "xml:lang": [ "lang", Hr ],
    "xml:space": [ "space", Hr ],
    xmlns: [ "xmlns", Wr ],
    "xmlns:xlink": [ "xlink", Wr ]
});

const Gr = new b;

Gr.type = 2 | 4;

class NodeObserverConfig {
    constructor(t) {
        var i;
        this.type = null !== (i = t.type) && void 0 !== i ? i : ValueAttributeObserver;
        this.events = t.events;
        this.readonly = t.readonly;
        this.default = t.default;
    }
}

class NodeObserverLocator {
    constructor(t, i, e, s) {
        this.locator = t;
        this.platform = i;
        this.dirtyChecker = e;
        this.svgAnalyzer = s;
        this.allowDirtyCheck = true;
        this.ji = bt();
        this.Ni = bt();
        this.Hi = bt();
        this.Wi = bt();
        const n = [ "change", "input" ];
        const r = {
            events: n,
            default: ""
        };
        this.useConfig({
            INPUT: {
                value: r,
                valueAsNumber: {
                    events: n,
                    default: 0
                },
                checked: {
                    type: CheckedObserver,
                    events: n
                },
                files: {
                    events: n,
                    readonly: true
                }
            },
            SELECT: {
                value: {
                    type: SelectValueObserver,
                    events: [ "change" ],
                    default: ""
                }
            },
            TEXTAREA: {
                value: r
            }
        });
        const o = {
            events: [ "change", "input", "blur", "keyup", "paste" ],
            default: ""
        };
        const l = {
            events: [ "scroll" ],
            default: 0
        };
        this.useConfigGlobal({
            scrollTop: l,
            scrollLeft: l,
            textContent: o,
            innerHTML: o
        });
        this.overrideAccessorGlobal("css", "style", "class");
        this.overrideAccessor({
            INPUT: [ "value", "checked", "model" ],
            SELECT: [ "value" ],
            TEXTAREA: [ "value" ]
        });
    }
    static register(t) {
        Vt(x, NodeObserverLocator).register(t);
        _t(x, NodeObserverLocator).register(t);
    }
    handles(t, i) {
        return t instanceof this.platform.Node;
    }
    useConfig(t, i, e) {
        var s, n;
        const r = this.ji;
        let o;
        if (Rt(t)) {
            o = null !== (s = r[t]) && void 0 !== s ? s : r[t] = bt();
            if (null == o[i]) o[i] = new NodeObserverConfig(e); else Kr(t, i);
        } else for (const e in t) {
            o = null !== (n = r[e]) && void 0 !== n ? n : r[e] = bt();
            const s = t[e];
            for (i in s) if (null == o[i]) o[i] = new NodeObserverConfig(s[i]); else Kr(e, i);
        }
    }
    useConfigGlobal(t, i) {
        const e = this.Ni;
        if ("object" === typeof t) for (const i in t) if (null == e[i]) e[i] = new NodeObserverConfig(t[i]); else Kr("*", i); else if (null == e[t]) e[t] = new NodeObserverConfig(i); else Kr("*", t);
    }
    getAccessor(t, i, e) {
        var s;
        if (i in this.Wi || i in (null !== (s = this.Hi[t.tagName]) && void 0 !== s ? s : Q)) return this.getObserver(t, i, e);
        switch (i) {
          case "src":
          case "href":
          case "role":
            return $r;

          default:
            {
                const e = zr[i];
                if (void 0 !== e) return AttributeNSAccessor.forNs(e[1]);
                if (kt(t, i, this.svgAnalyzer)) return $r;
                return Gr;
            }
        }
    }
    overrideAccessor(t, i) {
        var e, s;
        var n, r;
        let o;
        if (Rt(t)) {
            o = null !== (e = (n = this.Hi)[t]) && void 0 !== e ? e : n[t] = bt();
            o[i] = true;
        } else for (const i in t) for (const e of t[i]) {
            o = null !== (s = (r = this.Hi)[i]) && void 0 !== s ? s : r[i] = bt();
            o[e] = true;
        }
    }
    overrideAccessorGlobal(...t) {
        for (const i of t) this.Wi[i] = true;
    }
    getObserver(t, i, e) {
        var s, n;
        switch (i) {
          case "class":
            return new ClassAttributeAccessor(t);

          case "css":
          case "style":
            return new StyleAttributeAccessor(t);
        }
        const r = null !== (n = null === (s = this.ji[t.tagName]) || void 0 === s ? void 0 : s[i]) && void 0 !== n ? n : this.Ni[i];
        if (null != r) return new r.type(t, i, new EventSubscriber(r), e, this.locator);
        const o = zr[i];
        if (void 0 !== o) return AttributeNSAccessor.forNs(o[1]);
        if (kt(t, i, this.svgAnalyzer)) return $r;
        if (i in t.constructor.prototype) {
            if (this.allowDirtyCheck) return this.dirtyChecker.createProperty(t, i);
            throw new Error(`AUR0652:${String(i)}`);
        } else return new y(t, i);
    }
}

NodeObserverLocator.inject = [ tt, ni, k, ri ];

function Xr(t, i) {
    if (t instanceof Array) return i.getArrayObserver(t);
    if (t instanceof Map) return i.getMapObserver(t);
    if (t instanceof Set) return i.getSetObserver(t);
}

function Kr(t, i) {
    throw new Error(`AUR0653:${String(i)}@${t}`);
}

class UpdateTriggerBindingBehavior {
    constructor(t) {
        this.oL = t;
    }
    bind(i, e, s, ...n) {
        if (0 === n.length) throw new Error(`AUR0802`);
        if (s.mode !== t.twoWay && s.mode !== t.fromView) throw new Error(`AUR0803`);
        const r = this.oL.getObserver(s.target, s.targetProperty);
        if (!r.handler) throw new Error(`AUR0804`);
        s.targetObserver = r;
        const o = r.handler;
        r.originalHandler = o;
        r.handler = new EventSubscriber(new NodeObserverConfig({
            default: o.config.default,
            events: n,
            readonly: o.config.readonly
        }));
    }
    unbind(t, i, e) {
        e.targetObserver.handler.dispose();
        e.targetObserver.handler = e.targetObserver.originalHandler;
        e.targetObserver.originalHandler = null;
    }
}

UpdateTriggerBindingBehavior.inject = [ c ];

g("updateTrigger")(UpdateTriggerBindingBehavior);

class Focus {
    constructor(t, i) {
        this.zi = t;
        this.p = i;
        this.Gi = false;
    }
    binding() {
        this.valueChanged();
    }
    valueChanged() {
        if (this.$controller.isActive) this.Xi(); else this.Gi = true;
    }
    attached() {
        if (this.Gi) {
            this.Gi = false;
            this.Xi();
        }
        this.zi.addEventListener("focus", this);
        this.zi.addEventListener("blur", this);
    }
    afterDetachChildren() {
        const t = this.zi;
        t.removeEventListener("focus", this);
        t.removeEventListener("blur", this);
    }
    handleEvent(t) {
        if ("focus" === t.type) this.value = true; else if (!this.Ki) this.value = false;
    }
    Xi() {
        const t = this.zi;
        const i = this.Ki;
        const e = this.value;
        if (e && !i) t.focus(); else if (!e && i) t.blur();
    }
    get Ki() {
        return this.zi === this.p.document.activeElement;
    }
}

Focus.inject = [ Ls, ni ];

lt([ Bt({
    mode: t.twoWay
}) ], Focus.prototype, "value", void 0);

Mi("focus")(Focus);

let Yr = class Show {
    constructor(t, i, e) {
        this.el = t;
        this.p = i;
        this.Yi = false;
        this.Zi = null;
        this.$val = "";
        this.$prio = "";
        this.update = () => {
            this.Zi = null;
            if (Boolean(this.value) !== this.Ji) if (this.Ji === this.Qi) {
                this.Ji = !this.Qi;
                this.$val = this.el.style.getPropertyValue("display");
                this.$prio = this.el.style.getPropertyPriority("display");
                this.el.style.setProperty("display", "none", "important");
            } else {
                this.Ji = this.Qi;
                this.el.style.setProperty("display", this.$val, this.$prio);
                if ("" === this.el.getAttribute("style")) this.el.removeAttribute("style");
            }
        };
        this.Ji = this.Qi = "hide" !== e.alias;
    }
    binding() {
        this.Yi = true;
        this.update();
    }
    detaching() {
        var t;
        this.Yi = false;
        null === (t = this.Zi) || void 0 === t ? void 0 : t.cancel();
        this.Zi = null;
    }
    valueChanged() {
        if (this.Yi && null === this.Zi) this.Zi = this.p.domWriteQueue.queueTask(this.update);
    }
};

lt([ Bt ], Yr.prototype, "value", void 0);

Yr = lt([ ht(0, Ls), ht(1, ni), ht(2, Qs) ], Yr);

C("hide")(Yr);

Mi("show")(Yr);

class Portal {
    constructor(t, i, e) {
        this.id = W("au$component");
        this.strict = false;
        this.p = e;
        this.te = e.document.createElement("div");
        this.view = t.create();
        Ms(this.view.nodes, i);
    }
    attaching(t, i, e) {
        if (null == this.callbackContext) this.callbackContext = this.$controller.scope.bindingContext;
        const s = this.te = this.ie();
        this.view.setHost(s);
        return this.ee(t, s, e);
    }
    detaching(t, i, e) {
        return this.se(t, this.te, e);
    }
    targetChanged() {
        const {$controller: t} = this;
        if (!t.isActive) return;
        const i = this.te;
        const e = this.te = this.ie();
        if (i === e) return;
        this.view.setHost(e);
        const s = Y(this.se(null, e, t.flags), (() => this.ee(null, e, t.flags)));
        if (Ct(s)) s.catch((t => {
            throw t;
        }));
    }
    ee(t, i, e) {
        const {activating: s, callbackContext: n, view: r} = this;
        r.setHost(i);
        return Y(null === s || void 0 === s ? void 0 : s.call(n, i, r), (() => this.ne(t, i, e)));
    }
    ne(t, i, e) {
        const {$controller: s, view: n} = this;
        if (null === t) n.nodes.appendTo(i); else return Y(n.activate(null !== t && void 0 !== t ? t : n, s, e, s.scope), (() => this.re(i)));
        return this.re(i);
    }
    re(t) {
        const {activated: i, callbackContext: e, view: s} = this;
        return null === i || void 0 === i ? void 0 : i.call(e, t, s);
    }
    se(t, i, e) {
        const {deactivating: s, callbackContext: n, view: r} = this;
        return Y(null === s || void 0 === s ? void 0 : s.call(n, i, r), (() => this.oe(t, i, e)));
    }
    oe(t, i, e) {
        const {$controller: s, view: n} = this;
        if (null === t) n.nodes.remove(); else return Y(n.deactivate(t, s, e), (() => this.le(i)));
        return this.le(i);
    }
    le(t) {
        const {deactivated: i, callbackContext: e, view: s} = this;
        return null === i || void 0 === i ? void 0 : i.call(e, t, s);
    }
    ie() {
        const t = this.p;
        const i = t.document;
        let e = this.target;
        let s = this.renderContext;
        if ("" === e) {
            if (this.strict) throw new Error(`AUR0811`);
            return i.body;
        }
        if (Rt(e)) {
            let n = i;
            if (Rt(s)) s = i.querySelector(s);
            if (s instanceof t.Node) n = s;
            e = n.querySelector(e);
        }
        if (e instanceof t.Node) return e;
        if (null == e) {
            if (this.strict) throw new Error(`AUR0812`);
            return i.body;
        }
        return e;
    }
    dispose() {
        this.view.dispose();
        this.view = void 0;
        this.callbackContext = null;
    }
    accept(t) {
        var i;
        if (true === (null === (i = this.view) || void 0 === i ? void 0 : i.accept(t))) return true;
    }
}

Portal.inject = [ ze, Us, ni ];

lt([ Bt({
    primary: true
}) ], Portal.prototype, "target", void 0);

lt([ Bt({
    callback: "targetChanged"
}) ], Portal.prototype, "renderContext", void 0);

lt([ Bt() ], Portal.prototype, "strict", void 0);

lt([ Bt() ], Portal.prototype, "deactivating", void 0);

lt([ Bt() ], Portal.prototype, "activating", void 0);

lt([ Bt() ], Portal.prototype, "deactivated", void 0);

lt([ Bt() ], Portal.prototype, "activated", void 0);

lt([ Bt() ], Portal.prototype, "callbackContext", void 0);

ji("portal")(Portal);

class If {
    constructor(t, i, e) {
        this.ifFactory = t;
        this.location = i;
        this.work = e;
        this.id = W("au$component");
        this.elseFactory = void 0;
        this.elseView = void 0;
        this.ifView = void 0;
        this.view = void 0;
        this.value = false;
        this.cache = true;
        this.pending = void 0;
        this.he = false;
        this.ce = 0;
    }
    attaching(t, i, e) {
        let s;
        const n = this.$controller;
        const r = this.ce++;
        const o = () => !this.he && this.ce === r + 1;
        return Y(this.pending, (() => {
            var i;
            if (!o()) return;
            this.pending = void 0;
            if (this.value) s = this.view = this.ifView = this.cache && null != this.ifView ? this.ifView : this.ifFactory.create(); else s = this.view = this.elseView = this.cache && null != this.elseView ? this.elseView : null === (i = this.elseFactory) || void 0 === i ? void 0 : i.create();
            if (null == s) return;
            s.setLocation(this.location);
            this.pending = Y(s.activate(t, n, e, n.scope), (() => {
                if (o()) this.pending = void 0;
            }));
        }));
    }
    detaching(t, i, e) {
        this.he = true;
        return Y(this.pending, (() => {
            var i;
            this.he = false;
            this.pending = void 0;
            void (null === (i = this.view) || void 0 === i ? void 0 : i.deactivate(t, this.$controller, e));
        }));
    }
    valueChanged(t, i, e) {
        if (!this.$controller.isActive) return;
        t = !!t;
        i = !!i;
        if (t === i) return;
        this.work.start();
        const s = this.view;
        const n = this.$controller;
        const r = this.ce++;
        const o = () => !this.he && this.ce === r + 1;
        let l;
        return Y(Y(this.pending, (() => this.pending = Y(null === s || void 0 === s ? void 0 : s.deactivate(s, n, e), (() => {
            var i;
            if (!o()) return;
            if (t) l = this.view = this.ifView = this.cache && null != this.ifView ? this.ifView : this.ifFactory.create(); else l = this.view = this.elseView = this.cache && null != this.elseView ? this.elseView : null === (i = this.elseFactory) || void 0 === i ? void 0 : i.create();
            if (null == l) return;
            l.setLocation(this.location);
            return Y(l.activate(l, n, e, n.scope), (() => {
                if (o()) this.pending = void 0;
            }));
        })))), (() => this.work.finish()));
    }
    dispose() {
        var t, i;
        null === (t = this.ifView) || void 0 === t ? void 0 : t.dispose();
        null === (i = this.elseView) || void 0 === i ? void 0 : i.dispose();
        this.ifView = this.elseView = this.view = void 0;
    }
    accept(t) {
        var i;
        if (true === (null === (i = this.view) || void 0 === i ? void 0 : i.accept(t))) return true;
    }
}

If.inject = [ ze, Us, $s ];

lt([ Bt ], If.prototype, "value", void 0);

lt([ Bt({
    set: t => "" === t || !!t && "false" !== t
}) ], If.prototype, "cache", void 0);

ji("if")(If);

class Else {
    constructor(t) {
        this.factory = t;
        this.id = W("au$component");
    }
    link(t, i, e, s) {
        const n = t.children;
        const r = n[n.length - 1];
        if (r instanceof If) r.elseFactory = this.factory; else if (r.viewModel instanceof If) r.viewModel.elseFactory = this.factory; else throw new Error(`AUR0810`);
    }
}

Else.inject = [ ze ];

ji({
    name: "else"
})(Else);

function Zr(t) {
    t.dispose();
}

const Jr = [ 38963, 36914 ];

class Repeat {
    constructor(t, i, e) {
        this.l = t;
        this.ae = i;
        this.f = e;
        this.id = W("au$component");
        this.views = [];
        this.key = void 0;
        this.ue = void 0;
        this.fe = false;
        this.de = false;
        this.ve = null;
        this.me = void 0;
        this.ge = false;
    }
    binding(t, i, e) {
        const s = this.ae.bindings;
        const n = s.length;
        let r;
        let o;
        let l = 0;
        for (;n > l; ++l) {
            r = s[l];
            if (r.target === this && "items" === r.targetProperty) {
                o = this.forOf = r.sourceExpression;
                this.pe = r;
                let t = o.iterable;
                while (null != t && Jr.includes(t.$kind)) {
                    t = t.expression;
                    this.fe = true;
                }
                this.ve = t;
                break;
            }
        }
        this.we(e);
        const h = o.declaration;
        if (!(this.ge = 90138 === h.$kind || 106523 === h.$kind)) this.local = h.evaluate(e, this.$controller.scope, r.locator, null);
    }
    attaching(t, i, e) {
        this.be(e);
        return this.xe(t, e);
    }
    detaching(t, i, e) {
        this.we(e);
        return this.ye(t, e);
    }
    itemsChanged(t) {
        const {$controller: i} = this;
        if (!i.isActive) return;
        t |= i.flags;
        this.we(t);
        this.be(t);
        const e = Y(this.ye(null, t), (() => this.xe(null, t)));
        if (Ct(e)) e.catch(Et);
    }
    handleCollectionChange(t, i) {
        const {$controller: e} = this;
        if (!e.isActive) return;
        if (this.fe) {
            if (this.de) return;
            this.de = true;
            this.items = this.forOf.iterable.evaluate(i, e.scope, this.pe.locator, null);
            this.de = false;
            return;
        }
        i |= e.flags;
        this.be(i);
        if (void 0 === t) {
            const t = Y(this.ye(null, i), (() => this.xe(null, i)));
            if (Ct(t)) t.catch(Et);
        } else {
            const e = this.views.length;
            const s = A(t);
            if (s.deletedItems.length > 0) {
                s.deletedItems.sort(it);
                const t = Y(this.ke(s, i), (() => this.Ce(e, s, i)));
                if (Ct(t)) t.catch(Et);
            } else this.Ce(e, s, i);
        }
    }
    we(t) {
        var i;
        const e = this.$controller.scope;
        let s = this.Ae;
        let n = this.fe;
        let r;
        if (n) {
            s = this.Ae = null !== (i = this.ve.evaluate(t, e, this.pe.locator, null)) && void 0 !== i ? i : null;
            n = this.fe = !Object.is(this.items, s);
        }
        const o = this.ue;
        if (this.$controller.isActive) {
            r = this.ue = R(n ? s : this.items);
            if (o !== r) {
                null === o || void 0 === o ? void 0 : o.unsubscribe(this);
                null === r || void 0 === r ? void 0 : r.subscribe(this);
            }
        } else {
            null === o || void 0 === o ? void 0 : o.unsubscribe(this);
            this.ue = void 0;
        }
    }
    be(t) {
        const i = this.items;
        if (i instanceof Array) {
            this.me = i;
            return;
        }
        const e = this.forOf;
        if (void 0 === e) return;
        const s = [];
        this.forOf.iterate(t, i, ((t, i, e) => {
            s[i] = e;
        }));
        this.me = s;
    }
    xe(t, i) {
        let e;
        let s;
        let n;
        let r;
        const {$controller: o, f: h, local: c, l: a, items: u} = this;
        const f = o.scope;
        const d = this.forOf;
        const v = d.count(i, u);
        const m = this.views = Array(v);
        d.iterate(i, u, ((u, g, p) => {
            n = m[g] = h.create().setLocation(a);
            n.nodes.unlink();
            if (this.ge) d.declaration.assign(i, r = l.fromParent(f, S.create()), this.pe.locator, p); else r = l.fromParent(f, S.create(c, p));
            so(r.overrideContext, g, v);
            s = n.activate(null !== t && void 0 !== t ? t : n, o, i, r);
            if (Ct(s)) (null !== e && void 0 !== e ? e : e = []).push(s);
        }));
        if (void 0 !== e) return 1 === e.length ? e[0] : Promise.all(e);
    }
    ye(t, i) {
        let e;
        let s;
        let n;
        let r = 0;
        const {views: o, $controller: l} = this;
        const h = o.length;
        for (;h > r; ++r) {
            n = o[r];
            n.release();
            s = n.deactivate(null !== t && void 0 !== t ? t : n, l, i);
            if (Ct(s)) (null !== e && void 0 !== e ? e : e = []).push(s);
        }
        if (void 0 !== e) return 1 === e.length ? e[0] : Promise.all(e);
    }
    ke(t, i) {
        let e;
        let s;
        let n;
        const {$controller: r, views: o} = this;
        const l = t.deletedItems;
        const h = l.length;
        let c = 0;
        for (;h > c; ++c) {
            n = o[l[c]];
            n.release();
            s = n.deactivate(n, r, i);
            if (Ct(s)) (null !== e && void 0 !== e ? e : e = []).push(s);
        }
        c = 0;
        let a = 0;
        for (;h > c; ++c) {
            a = l[c] - c;
            o.splice(a, 1);
        }
        if (void 0 !== e) return 1 === e.length ? e[0] : Promise.all(e);
    }
    Ce(t, i, e) {
        var s;
        let n;
        let r;
        let o;
        let h;
        let c = 0;
        const {$controller: a, f: u, local: f, me: d, l: v, views: m} = this;
        const g = i.length;
        for (;g > c; ++c) if (-2 === i[c]) {
            o = u.create();
            m.splice(c, 0, o);
        }
        if (m.length !== g) throw new Error(`AUR0814:${m.length}!=${g}`);
        const p = a.scope;
        const w = i.length;
        E(m, i);
        const b = eo(i);
        const x = b.length;
        let y;
        let k = x - 1;
        c = w - 1;
        for (;c >= 0; --c) {
            o = m[c];
            y = m[c + 1];
            o.nodes.link(null !== (s = null === y || void 0 === y ? void 0 : y.nodes) && void 0 !== s ? s : v);
            if (-2 === i[c]) {
                if (this.ge) this.forOf.declaration.assign(e, h = l.fromParent(p, S.create()), this.pe.locator, d[c]); else h = l.fromParent(p, S.create(f, d[c]));
                so(h.overrideContext, c, w);
                o.setLocation(v);
                r = o.activate(o, a, e, h);
                if (Ct(r)) (null !== n && void 0 !== n ? n : n = []).push(r);
            } else if (k < 0 || 1 === x || c !== b[k]) {
                so(o.scope.overrideContext, c, w);
                o.nodes.insertBefore(o.location);
            } else {
                if (t !== w) so(o.scope.overrideContext, c, w);
                --k;
            }
        }
        if (void 0 !== n) return 1 === n.length ? n[0] : Promise.all(n);
    }
    dispose() {
        this.views.forEach(Zr);
        this.views = void 0;
    }
    accept(t) {
        const {views: i} = this;
        if (void 0 !== i) for (let e = 0, s = i.length; e < s; ++e) if (true === i[e].accept(t)) return true;
    }
}

Repeat.inject = [ Us, gs, ze ];

lt([ Bt ], Repeat.prototype, "items", void 0);

ji("repeat")(Repeat);

let Qr = 16;

let to = new Int32Array(Qr);

let io = new Int32Array(Qr);

function eo(t) {
    const i = t.length;
    if (i > Qr) {
        Qr = i;
        to = new Int32Array(i);
        io = new Int32Array(i);
    }
    let e = 0;
    let s = 0;
    let n = 0;
    let r = 0;
    let o = 0;
    let l = 0;
    let h = 0;
    let c = 0;
    for (;r < i; r++) {
        s = t[r];
        if (-2 !== s) {
            o = to[e];
            n = t[o];
            if (-2 !== n && n < s) {
                io[r] = o;
                to[++e] = r;
                continue;
            }
            l = 0;
            h = e;
            while (l < h) {
                c = l + h >> 1;
                n = t[to[c]];
                if (-2 !== n && n < s) l = c + 1; else h = c;
            }
            n = t[to[l]];
            if (s < n || -2 === n) {
                if (l > 0) io[r] = to[l - 1];
                to[l] = r;
            }
        }
    }
    r = ++e;
    const a = new Int32Array(r);
    s = to[e - 1];
    while (e-- > 0) {
        a[e] = s;
        s = io[s];
    }
    while (r-- > 0) to[r] = 0;
    return a;
}

function so(t, i, e) {
    const s = 0 === i;
    const n = i === e - 1;
    const r = i % 2 === 0;
    t.$index = i;
    t.$first = s;
    t.$last = n;
    t.$middle = !s && !n;
    t.$even = r;
    t.$odd = !r;
    t.$length = e;
}

class With {
    constructor(t, i) {
        this.id = W("au$component");
        this.id = W("au$component");
        this.view = t.create().setLocation(i);
    }
    valueChanged(t, i, e) {
        const s = this.$controller;
        const n = this.view.bindings;
        let r;
        let o = 0, h = 0;
        if (s.isActive && null != n) {
            r = l.fromParent(s.scope, void 0 === t ? {} : t);
            for (h = n.length; h > o; ++o) n[o].$bind(2, r);
        }
    }
    attaching(t, i, e) {
        const {$controller: s, value: n} = this;
        const r = l.fromParent(s.scope, void 0 === n ? {} : n);
        return this.view.activate(t, s, e, r);
    }
    detaching(t, i, e) {
        return this.view.deactivate(t, this.$controller, e);
    }
    dispose() {
        this.view.dispose();
        this.view = void 0;
    }
    accept(t) {
        var i;
        if (true === (null === (i = this.view) || void 0 === i ? void 0 : i.accept(t))) return true;
    }
}

With.inject = [ ze, Us ];

lt([ Bt ], With.prototype, "value", void 0);

ji("with")(With);

let no = class Switch {
    constructor(t, i) {
        this.f = t;
        this.l = i;
        this.id = W("au$component");
        this.cases = [];
        this.activeCases = [];
        this.promise = void 0;
    }
    link(t, i, e, s) {
        this.view = this.f.create(this.$controller).setLocation(this.l);
    }
    attaching(t, i, e) {
        const s = this.view;
        const n = this.$controller;
        this.queue((() => s.activate(t, n, e, n.scope)));
        this.queue((() => this.swap(t, e, this.value)));
        return this.promise;
    }
    detaching(t, i, e) {
        this.queue((() => {
            const i = this.view;
            return i.deactivate(t, this.$controller, e);
        }));
        return this.promise;
    }
    dispose() {
        var t;
        null === (t = this.view) || void 0 === t ? void 0 : t.dispose();
        this.view = void 0;
    }
    valueChanged(t, i, e) {
        if (!this.$controller.isActive) return;
        this.queue((() => this.swap(null, e, this.value)));
    }
    caseChanged(t, i) {
        this.queue((() => this.Re(t, i)));
    }
    Re(t, i) {
        const e = t.isMatch(this.value, i);
        const s = this.activeCases;
        const n = s.length;
        if (!e) {
            if (n > 0 && s[0].id === t.id) return this.Se(null, i);
            return;
        }
        if (n > 0 && s[0].id < t.id) return;
        const r = [];
        let o = t.fallThrough;
        if (!o) r.push(t); else {
            const i = this.cases;
            const e = i.indexOf(t);
            for (let t = e, s = i.length; t < s && o; t++) {
                const e = i[t];
                r.push(e);
                o = e.fallThrough;
            }
        }
        return Y(this.Se(null, i, r), (() => {
            this.activeCases = r;
            return this.Ee(null, i);
        }));
    }
    swap(t, i, e) {
        const s = [];
        let n = false;
        for (const t of this.cases) {
            if (n || t.isMatch(e, i)) {
                s.push(t);
                n = t.fallThrough;
            }
            if (s.length > 0 && !n) break;
        }
        const r = this.defaultCase;
        if (0 === s.length && void 0 !== r) s.push(r);
        return Y(this.activeCases.length > 0 ? this.Se(t, i, s) : void 0, (() => {
            this.activeCases = s;
            if (0 === s.length) return;
            return this.Ee(t, i);
        }));
    }
    Ee(t, i) {
        const e = this.$controller;
        if (!e.isActive) return;
        const s = this.activeCases;
        const n = s.length;
        if (0 === n) return;
        const r = e.scope;
        if (1 === n) return s[0].activate(t, i, r);
        return X(...s.map((e => e.activate(t, i, r))));
    }
    Se(t, i, e = []) {
        const s = this.activeCases;
        const n = s.length;
        if (0 === n) return;
        if (1 === n) {
            const n = s[0];
            if (!e.includes(n)) {
                s.length = 0;
                return n.deactivate(t, i);
            }
            return;
        }
        return Y(X(...s.reduce(((s, n) => {
            if (!e.includes(n)) s.push(n.deactivate(t, i));
            return s;
        }), [])), (() => {
            s.length = 0;
        }));
    }
    queue(t) {
        const i = this.promise;
        let e;
        e = this.promise = Y(Y(i, t), (() => {
            if (this.promise === e) this.promise = void 0;
        }));
    }
    accept(t) {
        if (true === this.$controller.accept(t)) return true;
        if (this.activeCases.some((i => i.accept(t)))) return true;
    }
};

lt([ Bt ], no.prototype, "value", void 0);

no = lt([ ji("switch"), ht(0, ze), ht(1, Us) ], no);

let ro = class Case {
    constructor(t, i, e, s) {
        this.f = t;
        this.Be = i;
        this.l = e;
        this.id = W("au$component");
        this.fallThrough = false;
        this.view = void 0;
        this.Ie = s.config.level <= 1;
        this.Ut = s.scopeTo(`${this.constructor.name}-#${this.id}`);
    }
    link(t, i, e, s) {
        const n = t.parent;
        const r = null === n || void 0 === n ? void 0 : n.viewModel;
        if (r instanceof no) {
            this.$switch = r;
            this.linkToSwitch(r);
        } else throw new Error(`AUR0815`);
    }
    detaching(t, i, e) {
        return this.deactivate(t, e);
    }
    isMatch(t, i) {
        this.Ut.debug("isMatch()");
        const e = this.value;
        if (Array.isArray(e)) {
            if (void 0 === this.ue) this.ue = this.Te(i, e);
            return e.includes(t);
        }
        return e === t;
    }
    valueChanged(t, i, e) {
        var s;
        if (Array.isArray(t)) {
            null === (s = this.ue) || void 0 === s ? void 0 : s.unsubscribe(this);
            this.ue = this.Te(e, t);
        } else if (void 0 !== this.ue) this.ue.unsubscribe(this);
        this.$switch.caseChanged(this, e);
    }
    handleCollectionChange(t, i) {
        this.$switch.caseChanged(this, i);
    }
    activate(t, i, e) {
        let s = this.view;
        if (void 0 === s) s = this.view = this.f.create().setLocation(this.l);
        if (s.isActive) return;
        return s.activate(null !== t && void 0 !== t ? t : s, this.$controller, i, e);
    }
    deactivate(t, i) {
        const e = this.view;
        if (void 0 === e || !e.isActive) return;
        return e.deactivate(null !== t && void 0 !== t ? t : e, this.$controller, i);
    }
    dispose() {
        var t, i;
        null === (t = this.ue) || void 0 === t ? void 0 : t.unsubscribe(this);
        null === (i = this.view) || void 0 === i ? void 0 : i.dispose();
        this.view = void 0;
    }
    linkToSwitch(t) {
        t.cases.push(this);
    }
    Te(t, i) {
        const e = this.Be.getArrayObserver(i);
        e.subscribe(this);
        return e;
    }
    accept(t) {
        var i;
        if (true === this.$controller.accept(t)) return true;
        return null === (i = this.view) || void 0 === i ? void 0 : i.accept(t);
    }
};

ro.inject = [ ze, c, Us, K ];

lt([ Bt ], ro.prototype, "value", void 0);

lt([ Bt({
    set: t => {
        switch (t) {
          case "true":
            return true;

          case "false":
            return false;

          default:
            return !!t;
        }
    },
    mode: t.oneTime
}) ], ro.prototype, "fallThrough", void 0);

ro = lt([ ji("case") ], ro);

let oo = class DefaultCase extends ro {
    linkToSwitch(t) {
        if (void 0 !== t.defaultCase) throw new Error(`AUR0816`);
        t.defaultCase = this;
    }
};

oo = lt([ ji("default-case") ], oo);

let lo = class PromiseTemplateController {
    constructor(t, i, e, s) {
        this.f = t;
        this.l = i;
        this.p = e;
        this.id = W("au$component");
        this.preSettledTask = null;
        this.postSettledTask = null;
        this.logger = s.scopeTo("promise.resolve");
    }
    link(t, i, e, s) {
        this.view = this.f.create(this.$controller).setLocation(this.l);
    }
    attaching(t, i, e) {
        const s = this.view;
        const n = this.$controller;
        return Y(s.activate(t, n, e, this.viewScope = l.fromParent(n.scope, {})), (() => this.swap(t, e)));
    }
    valueChanged(t, i, e) {
        if (!this.$controller.isActive) return;
        this.swap(null, e);
    }
    swap(t, i) {
        var e, s;
        const n = this.value;
        if (!Ct(n)) {
            this.logger.warn(`The value '${String(n)}' is not a promise. No change will be done.`);
            return;
        }
        const r = this.p.domWriteQueue;
        const o = this.fulfilled;
        const l = this.rejected;
        const h = this.pending;
        const c = this.viewScope;
        let a;
        const u = {
            reusable: false
        };
        const f = () => {
            void X(a = (this.preSettledTask = r.queueTask((() => X(null === o || void 0 === o ? void 0 : o.deactivate(t, i), null === l || void 0 === l ? void 0 : l.deactivate(t, i), null === h || void 0 === h ? void 0 : h.activate(t, i, c))), u)).result.catch((t => {
                if (!(t instanceof rt)) throw t;
            })), n.then((e => {
                if (this.value !== n) return;
                const s = () => {
                    this.postSettlePromise = (this.postSettledTask = r.queueTask((() => X(null === h || void 0 === h ? void 0 : h.deactivate(t, i), null === l || void 0 === l ? void 0 : l.deactivate(t, i), null === o || void 0 === o ? void 0 : o.activate(t, i, c, e))), u)).result;
                };
                if (1 === this.preSettledTask.status) void a.then(s); else {
                    this.preSettledTask.cancel();
                    s();
                }
            }), (e => {
                if (this.value !== n) return;
                const s = () => {
                    this.postSettlePromise = (this.postSettledTask = r.queueTask((() => X(null === h || void 0 === h ? void 0 : h.deactivate(t, i), null === o || void 0 === o ? void 0 : o.deactivate(t, i), null === l || void 0 === l ? void 0 : l.activate(t, i, c, e))), u)).result;
                };
                if (1 === this.preSettledTask.status) void a.then(s); else {
                    this.preSettledTask.cancel();
                    s();
                }
            })));
        };
        if (1 === (null === (e = this.postSettledTask) || void 0 === e ? void 0 : e.status)) void this.postSettlePromise.then(f); else {
            null === (s = this.postSettledTask) || void 0 === s ? void 0 : s.cancel();
            f();
        }
    }
    detaching(t, i, e) {
        var s, n;
        null === (s = this.preSettledTask) || void 0 === s ? void 0 : s.cancel();
        null === (n = this.postSettledTask) || void 0 === n ? void 0 : n.cancel();
        this.preSettledTask = this.postSettledTask = null;
        return this.view.deactivate(t, this.$controller, e);
    }
    dispose() {
        var t;
        null === (t = this.view) || void 0 === t ? void 0 : t.dispose();
        this.view = void 0;
    }
};

lt([ Bt ], lo.prototype, "value", void 0);

lo = lt([ ji("promise"), ht(0, ze), ht(1, Us), ht(2, ni), ht(3, K) ], lo);

let ho = class PendingTemplateController {
    constructor(t, i) {
        this.f = t;
        this.l = i;
        this.id = W("au$component");
        this.view = void 0;
    }
    link(t, i, e, s) {
        uo(t).pending = this;
    }
    activate(t, i, e) {
        let s = this.view;
        if (void 0 === s) s = this.view = this.f.create().setLocation(this.l);
        if (s.isActive) return;
        return s.activate(s, this.$controller, i, e);
    }
    deactivate(t, i) {
        const e = this.view;
        if (void 0 === e || !e.isActive) return;
        return e.deactivate(e, this.$controller, i);
    }
    detaching(t, i, e) {
        return this.deactivate(t, e);
    }
    dispose() {
        var t;
        null === (t = this.view) || void 0 === t ? void 0 : t.dispose();
        this.view = void 0;
    }
};

lt([ Bt({
    mode: t.toView
}) ], ho.prototype, "value", void 0);

ho = lt([ ji("pending"), ht(0, ze), ht(1, Us) ], ho);

let co = class FulfilledTemplateController {
    constructor(t, i) {
        this.f = t;
        this.l = i;
        this.id = W("au$component");
        this.view = void 0;
    }
    link(t, i, e, s) {
        uo(t).fulfilled = this;
    }
    activate(t, i, e, s) {
        this.value = s;
        let n = this.view;
        if (void 0 === n) n = this.view = this.f.create().setLocation(this.l);
        if (n.isActive) return;
        return n.activate(n, this.$controller, i, e);
    }
    deactivate(t, i) {
        const e = this.view;
        if (void 0 === e || !e.isActive) return;
        return e.deactivate(e, this.$controller, i);
    }
    detaching(t, i, e) {
        return this.deactivate(t, e);
    }
    dispose() {
        var t;
        null === (t = this.view) || void 0 === t ? void 0 : t.dispose();
        this.view = void 0;
    }
};

lt([ Bt({
    mode: t.fromView
}) ], co.prototype, "value", void 0);

co = lt([ ji("then"), ht(0, ze), ht(1, Us) ], co);

let ao = class RejectedTemplateController {
    constructor(t, i) {
        this.f = t;
        this.l = i;
        this.id = W("au$component");
        this.view = void 0;
    }
    link(t, i, e, s) {
        uo(t).rejected = this;
    }
    activate(t, i, e, s) {
        this.value = s;
        let n = this.view;
        if (void 0 === n) n = this.view = this.f.create().setLocation(this.l);
        if (n.isActive) return;
        return n.activate(n, this.$controller, i, e);
    }
    deactivate(t, i) {
        const e = this.view;
        if (void 0 === e || !e.isActive) return;
        return e.deactivate(e, this.$controller, i);
    }
    detaching(t, i, e) {
        return this.deactivate(t, e);
    }
    dispose() {
        var t;
        null === (t = this.view) || void 0 === t ? void 0 : t.dispose();
        this.view = void 0;
    }
};

lt([ Bt({
    mode: t.fromView
}) ], ao.prototype, "value", void 0);

ao = lt([ ji("catch"), ht(0, ze), ht(1, Us) ], ao);

function uo(t) {
    const i = t.parent;
    const e = null === i || void 0 === i ? void 0 : i.viewModel;
    if (e instanceof lo) return e;
    throw new Error(`AUR0813`);
}

let fo = class PromiseAttributePattern {
    "promise.resolve"(t, i, e) {
        return new AttrSyntax(t, i, "promise", "bind");
    }
};

fo = lt([ Xt({
    pattern: "promise.resolve",
    symbols: ""
}) ], fo);

let vo = class FulfilledAttributePattern {
    then(t, i, e) {
        return new AttrSyntax(t, i, "then", "from-view");
    }
};

vo = lt([ Xt({
    pattern: "then",
    symbols: ""
}) ], vo);

let mo = class RejectedAttributePattern {
    catch(t, i, e) {
        return new AttrSyntax(t, i, "catch", "from-view");
    }
};

mo = lt([ Xt({
    pattern: "catch",
    symbols: ""
}) ], mo);

function go(t, i, e, s) {
    if (Rt(i)) return po(t, i, e, s);
    if (we(i)) return wo(t, i, e, s);
    throw new Error(`Invalid Tag or Type.`);
}

class RenderPlan {
    constructor(t, i, e) {
        this.node = t;
        this.instructions = i;
        this.De = e;
        this.$e = void 0;
    }
    get definition() {
        if (void 0 === this.$e) this.$e = CustomElementDefinition.create({
            name: me(),
            template: this.node,
            needsCompile: Rt(this.node),
            instructions: this.instructions,
            dependencies: this.De
        });
        return this.$e;
    }
    createView(t) {
        return this.getViewFactory(t).create();
    }
    getViewFactory(t) {
        return t.root.get(ts).getViewFactory(this.definition, t.createChild().register(...this.De));
    }
    mergeInto(t, i, e) {
        t.appendChild(this.node);
        i.push(...this.instructions);
        e.push(...this.De);
    }
}

function po(t, i, e, s) {
    const n = [];
    const r = [];
    const o = [];
    const l = t.document.createElement(i);
    let h = false;
    if (e) Object.keys(e).forEach((t => {
        const i = e[t];
        if (tn(i)) {
            h = true;
            n.push(i);
        } else l.setAttribute(t, i);
    }));
    if (h) {
        l.className = "au";
        r.push(n);
    }
    if (s) bo(t, l, s, r, o);
    return new RenderPlan(l, r, o);
}

function wo(t, i, e, s) {
    const n = ye(i);
    const r = [];
    const o = [ r ];
    const l = [];
    const h = [];
    const c = n.bindables;
    const a = t.document.createElement(n.name);
    a.className = "au";
    if (!l.includes(i)) l.push(i);
    r.push(new HydrateElementInstruction(n, void 0, h, null, false, void 0));
    if (e) Object.keys(e).forEach((t => {
        const i = e[t];
        if (tn(i)) h.push(i); else if (void 0 === c[t]) h.push(new SetAttributeInstruction(i, t)); else h.push(new SetPropertyInstruction(i, t));
    }));
    if (s) bo(t, a, s, o, l);
    return new RenderPlan(a, o, l);
}

function bo(t, i, e, s, n) {
    for (let r = 0, o = e.length; r < o; ++r) {
        const o = e[r];
        switch (typeof o) {
          case "string":
            i.appendChild(t.document.createTextNode(o));
            break;

          case "object":
            if (o instanceof t.Node) i.appendChild(o); else if ("mergeInto" in o) o.mergeInto(i, s, n);
        }
    }
}

function xo(t, i) {
    const e = i.to;
    if (void 0 !== e && "subject" !== e && "composing" !== e) t[e] = i;
    return t;
}

class AuRender {
    constructor(t, i, e, s) {
        this.p = t;
        this.Pe = i;
        this.Oe = e;
        this.r = s;
        this.id = W("au$component");
        this.component = void 0;
        this.composing = false;
        this.view = void 0;
        this.Le = void 0;
        this.qe = i.props.reduce(xo, {});
    }
    attaching(t, i, e) {
        const {component: s, view: n} = this;
        if (void 0 === n || this.Le !== s) {
            this.Le = s;
            this.composing = true;
            return this.compose(void 0, s, t, e);
        }
        return this.compose(n, s, t, e);
    }
    detaching(t, i, e) {
        return this.oe(this.view, t, e);
    }
    componentChanged(t, i, e) {
        const {$controller: s} = this;
        if (!s.isActive) return;
        if (this.Le === t) return;
        this.Le = t;
        this.composing = true;
        e |= s.flags;
        const n = Y(this.oe(this.view, null, e), (() => this.compose(void 0, t, null, e)));
        if (Ct(n)) n.catch((t => {
            throw t;
        }));
    }
    compose(t, i, e, s) {
        return Y(void 0 === t ? Y(i, (t => this.Ue(t, s))) : t, (t => this.ne(this.view = t, e, s)));
    }
    oe(t, i, e) {
        return null === t || void 0 === t ? void 0 : t.deactivate(null !== i && void 0 !== i ? i : t, this.$controller, e);
    }
    ne(t, i, e) {
        const {$controller: s} = this;
        return Y(null === t || void 0 === t ? void 0 : t.activate(null !== i && void 0 !== i ? i : t, s, e, s.scope), (() => {
            this.composing = false;
        }));
    }
    Ue(t, i) {
        const e = this._e(t, i);
        if (e) {
            e.setLocation(this.$controller.location);
            e.lockScope(this.$controller.scope);
            return e;
        }
        return;
    }
    _e(t, i) {
        if (null == t) return;
        const e = this.Oe.controller.container;
        if ("object" === typeof t) {
            if (yo(t)) return t;
            if ("createView" in t) return t.createView(e);
            if ("create" in t) return t.create();
            if ("template" in t) return this.r.getViewFactory(CustomElementDefinition.getOrCreate(t), e).create();
        }
        if (Rt(t)) {
            const i = e.find(Ae, t);
            if (null == i) throw new Error(`AUR0809:${t}`);
            t = i.Type;
        }
        return go(this.p, t, this.qe, this.$controller.host.childNodes).createView(e);
    }
    dispose() {
        var t;
        null === (t = this.view) || void 0 === t ? void 0 : t.dispose();
        this.view = void 0;
    }
    accept(t) {
        var i;
        if (true === (null === (i = this.view) || void 0 === i ? void 0 : i.accept(t))) return true;
    }
}

AuRender.inject = [ ni, Qs, ps, ts ];

lt([ Bt ], AuRender.prototype, "component", void 0);

lt([ Bt({
    mode: t.fromView
}) ], AuRender.prototype, "composing", void 0);

ie({
    name: "au-render",
    template: null,
    containerless: true,
    capture: true
})(AuRender);

function yo(t) {
    return "lockScope" in t;
}

class AuCompose {
    constructor(t, i, e, s, n, r, o) {
        this.c = t;
        this.parent = i;
        this.host = e;
        this.l = s;
        this.p = n;
        this.scopeBehavior = "auto";
        this.Ve = void 0;
        this.r = t.get(ts);
        this.Pe = r;
        this.Fe = o;
    }
    static get inject() {
        return [ H, gs, Ls, Us, ni, Qs, et(CompositionContextFactory) ];
    }
    get pending() {
        return this.Me;
    }
    get composition() {
        return this.Ve;
    }
    attaching(t, i, e) {
        return this.Me = Y(this.queue(new ChangeInfo(this.view, this.viewModel, this.model, void 0), t), (t => {
            if (this.Fe.isCurrent(t)) this.Me = void 0;
        }));
    }
    detaching(t) {
        const i = this.Ve;
        const e = this.Me;
        this.Fe.invalidate();
        this.Ve = this.Me = void 0;
        return Y(e, (() => null === i || void 0 === i ? void 0 : i.deactivate(t)));
    }
    propertyChanged(t) {
        if ("model" === t && null != this.Ve) {
            this.Ve.update(this.model);
            return;
        }
        this.Me = Y(this.Me, (() => Y(this.queue(new ChangeInfo(this.view, this.viewModel, this.model, t), void 0), (t => {
            if (this.Fe.isCurrent(t)) this.Me = void 0;
        }))));
    }
    queue(t, i) {
        const e = this.Fe;
        const s = this.Ve;
        return Y(e.create(t), (t => {
            if (e.isCurrent(t)) return Y(this.compose(t), (n => {
                if (e.isCurrent(t)) return Y(n.activate(i), (() => {
                    if (e.isCurrent(t)) {
                        this.Ve = n;
                        return Y(null === s || void 0 === s ? void 0 : s.deactivate(i), (() => t));
                    } else return Y(n.controller.deactivate(n.controller, this.$controller, 4), (() => {
                        n.controller.dispose();
                        return t;
                    }));
                }));
                n.controller.dispose();
                return t;
            }));
            return t;
        }));
    }
    compose(t) {
        let i;
        let e;
        let s;
        const {view: n, viewModel: r, model: o} = t.change;
        const {c: h, host: c, $controller: a, l: u} = this;
        const f = this.getDef(r);
        const d = h.createChild();
        const v = null == u ? c.parentNode : u.parentNode;
        if (null !== f) {
            if (f.containerless) throw new Error(`AUR0806`);
            if (null == u) {
                e = c;
                s = () => {};
            } else {
                e = v.insertBefore(this.p.document.createElement(f.name), u);
                s = () => {
                    e.remove();
                };
            }
            i = this.getVm(d, r, e);
        } else {
            e = null == u ? c : u;
            i = this.getVm(d, r, e);
        }
        const m = () => {
            if (null !== f) {
                const n = Controller.$el(d, i, e, {
                    projections: this.Pe.projections
                }, f);
                return new CompositionController(n, (t => n.activate(null !== t && void 0 !== t ? t : n, a, 2, a.scope.parentScope)), (t => Y(n.deactivate(null !== t && void 0 !== t ? t : n, a, 4), s)), (t => {
                    var e;
                    return null === (e = i.activate) || void 0 === e ? void 0 : e.call(i, t);
                }), t);
            } else {
                const s = CustomElementDefinition.create({
                    name: Ae.generateName(),
                    template: n
                });
                const r = this.r.getViewFactory(s, d);
                const o = Controller.$view(r, a);
                const h = "auto" === this.scopeBehavior ? l.fromParent(this.parent.scope, i) : l.create(i);
                if (Ns(e)) o.setLocation(e); else o.setHost(e);
                return new CompositionController(o, (t => o.activate(null !== t && void 0 !== t ? t : o, a, 2, h)), (t => o.deactivate(null !== t && void 0 !== t ? t : o, a, 4)), (t => {
                    var e;
                    return null === (e = i.activate) || void 0 === e ? void 0 : e.call(i, t);
                }), t);
            }
        };
        if ("activate" in i) return Y(i.activate(o), (() => m())); else return m();
    }
    getVm(t, i, e) {
        if (null == i) return new EmptyComponent$1;
        if ("object" === typeof i) return i;
        const s = this.p;
        const n = Ns(e);
        t.registerResolver(s.Element, t.registerResolver(Ls, new G("ElementResolver", n ? null : e)));
        t.registerResolver(Us, new G("IRenderLocation", n ? e : null));
        const r = t.invoke(i);
        t.registerResolver(i, new G("au-compose.viewModel", r));
        return r;
    }
    getDef(t) {
        const i = At(t) ? t : null === t || void 0 === t ? void 0 : t.constructor;
        return Ae.isType(i) ? Ae.getDefinition(i) : null;
    }
}

lt([ Bt ], AuCompose.prototype, "view", void 0);

lt([ Bt ], AuCompose.prototype, "viewModel", void 0);

lt([ Bt ], AuCompose.prototype, "model", void 0);

lt([ Bt({
    set: t => {
        if ("scoped" === t || "auto" === t) return t;
        throw new Error(`AUR0805`);
    }
}) ], AuCompose.prototype, "scopeBehavior", void 0);

ie("au-compose")(AuCompose);

class EmptyComponent$1 {}

class CompositionContextFactory {
    constructor() {
        this.id = 0;
    }
    isCurrent(t) {
        return t.id === this.id;
    }
    create(t) {
        return Y(t.load(), (t => new CompositionContext(++this.id, t)));
    }
    invalidate() {
        this.id++;
    }
}

class ChangeInfo {
    constructor(t, i, e, s) {
        this.view = t;
        this.viewModel = i;
        this.model = e;
        this.src = s;
    }
    load() {
        if (Ct(this.view) || Ct(this.viewModel)) return Promise.all([ this.view, this.viewModel ]).then((([t, i]) => new LoadedChangeInfo(t, i, this.model, this.src))); else return new LoadedChangeInfo(this.view, this.viewModel, this.model, this.src);
    }
}

class LoadedChangeInfo {
    constructor(t, i, e, s) {
        this.view = t;
        this.viewModel = i;
        this.model = e;
        this.src = s;
    }
}

class CompositionContext {
    constructor(t, i) {
        this.id = t;
        this.change = i;
    }
}

class CompositionController {
    constructor(t, i, e, s, n) {
        this.controller = t;
        this.start = i;
        this.stop = e;
        this.update = s;
        this.context = n;
        this.state = 0;
    }
    activate(t) {
        if (0 !== this.state) throw new Error(`AUR0807:${this.controller.name}`);
        this.state = 1;
        return this.start(t);
    }
    deactivate(t) {
        switch (this.state) {
          case 1:
            this.state = -1;
            return this.stop(t);

          case -1:
            throw new Error(`AUR0808`);

          default:
            this.state = -1;
        }
    }
}

class AuSlot {
    constructor(t, i, e, s) {
        var n, r;
        this.je = null;
        this.Ne = null;
        let o;
        const l = i.auSlot;
        const h = null === (r = null === (n = e.instruction) || void 0 === n ? void 0 : n.projections) || void 0 === r ? void 0 : r[l.name];
        if (null == h) {
            o = s.getViewFactory(l.fallback, e.controller.container);
            this.He = false;
        } else {
            o = s.getViewFactory(h, e.parent.controller.container);
            this.He = true;
        }
        this.Oe = e;
        this.view = o.create().setLocation(t);
    }
    static get inject() {
        return [ Us, Qs, ps, ts ];
    }
    binding(t, i, e) {
        var s;
        this.je = this.$controller.scope.parentScope;
        let n;
        if (this.He) {
            n = this.Oe.controller.scope.parentScope;
            (this.Ne = l.fromParent(n, n.bindingContext)).overrideContext.$host = null !== (s = this.expose) && void 0 !== s ? s : this.je.bindingContext;
        }
    }
    attaching(t, i, e) {
        return this.view.activate(t, this.$controller, e, this.He ? this.Ne : this.je);
    }
    detaching(t, i, e) {
        return this.view.deactivate(t, this.$controller, e);
    }
    exposeChanged(t) {
        if (this.He && null != this.Ne) this.Ne.overrideContext.$host = t;
    }
    dispose() {
        this.view.dispose();
        this.view = void 0;
    }
    accept(t) {
        var i;
        if (true === (null === (i = this.view) || void 0 === i ? void 0 : i.accept(t))) return true;
    }
}

lt([ Bt ], AuSlot.prototype, "expose", void 0);

ie({
    name: "au-slot",
    template: null,
    containerless: true
})(AuSlot);

const ko = L.createInterface("ISanitizer", (t => t.singleton(class {
    sanitize() {
        throw new Error('"sanitize" method not implemented');
    }
})));

let Co = class SanitizeValueConverter {
    constructor(t) {
        this.We = t;
    }
    toView(t) {
        if (null == t) return null;
        return this.We.sanitize(t);
    }
};

Co = lt([ ht(0, ko) ], Co);

B("sanitize")(Co);

let Ao = class ViewValueConverter {
    constructor(t) {
        this.ze = t;
    }
    toView(t, i) {
        return this.ze.getViewComponentForObject(t, i);
    }
};

Ao = lt([ ht(0, Qe) ], Ao);

B("view")(Ao);

const Ro = DebounceBindingBehavior;

const So = OneTimeBindingBehavior;

const Eo = ToViewBindingBehavior;

const Bo = FromViewBindingBehavior;

const Io = SignalBindingBehavior;

const To = ThrottleBindingBehavior;

const Do = TwoWayBindingBehavior;

const $o = TemplateCompiler;

const Po = NodeObserverLocator;

const Oo = [ $o, Po ];

const Lo = SVGAnalyzer;

const qo = ei;

const Uo = ii;

const _o = ti;

const Vo = Qt;

const Fo = si;

const Mo = [ _o, Vo, Fo ];

const jo = [ qo, Uo ];

const No = Jn;

const Ho = Zn;

const Wo = Qn;

const zo = Kn;

const Go = Gn;

const Xo = Xn;

const Ko = Yn;

const Yo = or;

const Zo = tr;

const Jo = ir;

const Qo = er;

const tl = sr;

const il = rr;

const el = nr;

const sl = lr;

const nl = [ Ho, Go, zo, Xo, Ko, No, Wo, Yo, Zo, Jo, Qo, il, el, tl, sl ];

const rl = Co;

const ol = Ao;

const ll = If;

const hl = Else;

const cl = Repeat;

const al = With;

const ul = no;

const fl = ro;

const dl = oo;

const vl = lo;

const ml = ho;

const gl = co;

const pl = ao;

const wl = fo;

const bl = vo;

const xl = mo;

const yl = AttrBindingBehavior;

const kl = SelfBindingBehavior;

const Cl = UpdateTriggerBindingBehavior;

const Al = AuRender;

const Rl = AuCompose;

const Sl = Portal;

const El = Focus;

const Bl = Yr;

const Il = [ Ro, So, Eo, Bo, Io, To, Do, rl, ol, ll, hl, cl, al, ul, fl, dl, vl, ml, gl, pl, wl, bl, xl, yl, kl, Cl, Al, Rl, Sl, El, Bl, AuSlot ];

const Tl = dn;

const Dl = an;

const $l = cn;

const Pl = mn;

const Ol = pn;

const Ll = fn;

const ql = gn;

const Ul = vn;

const _l = hn;

const Vl = un;

const Fl = Cn;

const Ml = Bn;

const jl = An;

const Nl = Rn;

const Hl = Sn;

const Wl = En;

const zl = yn;

const Gl = In;

const Xl = [ ql, Ol, Tl, Ul, Pl, _l, $l, Dl, Vl, Ll, Fl, Ml, jl, Nl, Hl, Wl, zl, Gl ];

const Kl = Yl(P);

function Yl(t) {
    return {
        optionsProvider: t,
        register(i) {
            const e = {
                coercingOptions: {
                    enableCoercion: false,
                    coerceNullish: false
                }
            };
            t(e);
            return i.register(Ft(h, e.coercingOptions), ...Oo, ...Il, ...Mo, ...nl, ...Xl);
        },
        customize(i) {
            return Yl(null !== i && void 0 !== i ? i : t);
        }
    };
}

const Zl = L.createInterface("IAurelia");

class Aurelia {
    constructor(t = L.createContainer()) {
        this.container = t;
        this.ir = false;
        this.Ge = false;
        this.Xe = false;
        this.Ke = void 0;
        this.next = void 0;
        this.Ye = void 0;
        this.Ze = void 0;
        if (t.has(Zl, true)) throw new Error(`AUR0768`);
        t.registerResolver(Zl, new G("IAurelia", this));
        t.registerResolver(Ds, this.Je = new G("IAppRoot"));
    }
    get isRunning() {
        return this.ir;
    }
    get isStarting() {
        return this.Ge;
    }
    get isStopping() {
        return this.Xe;
    }
    get root() {
        if (null == this.Ke) {
            if (null == this.next) throw new Error(`AUR0767`);
            return this.next;
        }
        return this.Ke;
    }
    register(...t) {
        this.container.register(...t);
        return this;
    }
    app(t) {
        this.next = new AppRoot(t, this.Qe(t.host), this.container, this.Je);
        return this;
    }
    enhance(t, i) {
        var e;
        const s = null !== (e = t.container) && void 0 !== e ? e : this.container.createChild();
        const n = t.host;
        const r = this.Qe(n);
        const o = t.component;
        let l;
        if (At(o)) {
            s.registerResolver(r.HTMLElement, s.registerResolver(r.Element, s.registerResolver(Ls, new G("ElementResolver", n))));
            l = s.invoke(o);
        } else l = o;
        s.registerResolver(qs, new G("IEventTarget", n));
        i = null !== i && void 0 !== i ? i : null;
        const h = Controller.$el(s, l, n, null, CustomElementDefinition.create({
            name: me(),
            template: n,
            enhance: true
        }));
        return Y(h.activate(h, i, 2), (() => h));
    }
    async waitForIdle() {
        const t = this.root.platform;
        await t.domWriteQueue.yield();
        await t.domReadQueue.yield();
        await t.taskQueue.yield();
    }
    Qe(t) {
        let i;
        if (!this.container.has(ni, false)) {
            if (null === t.ownerDocument.defaultView) throw new Error(`AUR0769`);
            i = new ot(t.ownerDocument.defaultView);
            this.container.register(Ft(ni, i));
        } else i = this.container.get(ni);
        return i;
    }
    start(t = this.next) {
        if (null == t) throw new Error(`AUR0770`);
        if (Ct(this.Ye)) return this.Ye;
        return this.Ye = Y(this.stop(), (() => {
            Reflect.set(t.host, "$aurelia", this);
            this.Je.prepare(this.Ke = t);
            this.Ge = true;
            return Y(t.activate(), (() => {
                this.ir = true;
                this.Ge = false;
                this.Ye = void 0;
                this.ts(t, "au-started", t.host);
            }));
        }));
    }
    stop(t = false) {
        if (Ct(this.Ze)) return this.Ze;
        if (true === this.ir) {
            const i = this.Ke;
            this.ir = false;
            this.Xe = true;
            return this.Ze = Y(i.deactivate(), (() => {
                Reflect.deleteProperty(i.host, "$aurelia");
                if (t) i.dispose();
                this.Ke = void 0;
                this.Je.dispose();
                this.Xe = false;
                this.ts(i, "au-stopped", i.host);
            }));
        }
    }
    dispose() {
        if (this.ir || this.Xe) throw new Error(`AUR0771`);
        this.container.dispose();
    }
    ts(t, i, e) {
        const s = new t.platform.window.CustomEvent(i, {
            detail: this,
            bubbles: true,
            cancelable: true
        });
        e.dispatchEvent(s);
    }
}

var Jl;

(function(t) {
    t[t["Element"] = 1] = "Element";
    t[t["Attribute"] = 2] = "Attribute";
})(Jl || (Jl = {}));

const Ql = L.createInterface("IDialogService");

const th = L.createInterface("IDialogController");

const ih = L.createInterface("IDialogDomRenderer");

const eh = L.createInterface("IDialogDom");

const sh = L.createInterface("IDialogGlobalSettings");

class DialogOpenResult {
    constructor(t, i) {
        this.wasCancelled = t;
        this.dialog = i;
    }
    static create(t, i) {
        return new DialogOpenResult(t, i);
    }
}

class DialogCloseResult {
    constructor(t, i) {
        this.status = t;
        this.value = i;
    }
    static create(t, i) {
        return new DialogCloseResult(t, i);
    }
}

var nh;

(function(t) {
    t["Ok"] = "ok";
    t["Error"] = "error";
    t["Cancel"] = "cancel";
    t["Abort"] = "abort";
})(nh || (nh = {}));

class DialogController {
    constructor(t, i) {
        this.p = t;
        this.ctn = i;
        this.closed = new Promise(((t, i) => {
            this.$t = t;
            this.St = i;
        }));
    }
    static get inject() {
        return [ ni, H ];
    }
    activate(t) {
        var i;
        const e = this.ctn.createChild();
        const {model: s, template: n, rejectOnCancel: r} = t;
        const o = e.get(ih);
        const l = null !== (i = t.host) && void 0 !== i ? i : this.p.document.body;
        const h = this.dom = o.render(l, t);
        const c = e.has(qs, true) ? e.get(qs) : null;
        const a = h.contentHost;
        this.settings = t;
        if (null == c || !c.contains(l)) e.register(Ft(qs, l));
        e.register(Ft(Ls, a), Ft(eh, h));
        return new Promise((i => {
            var n, r;
            const o = Object.assign(this.cmp = this.getOrCreateVm(e, t, a), {
                $dialog: this
            });
            i(null !== (r = null === (n = o.canActivate) || void 0 === n ? void 0 : n.call(o, s)) && void 0 !== r ? r : true);
        })).then((i => {
            var o;
            if (true !== i) {
                h.dispose();
                if (r) throw rh(null, "Dialog activation rejected");
                return DialogOpenResult.create(true, this);
            }
            const l = this.cmp;
            return Y(null === (o = l.activate) || void 0 === o ? void 0 : o.call(l, s), (() => {
                var i;
                const s = this.controller = Controller.$el(e, l, a, null, CustomElementDefinition.create(null !== (i = this.getDefinition(l)) && void 0 !== i ? i : {
                    name: Ae.generateName(),
                    template: n
                }));
                return Y(s.activate(s, null, 2), (() => {
                    var i;
                    h.overlay.addEventListener(null !== (i = t.mouseEvent) && void 0 !== i ? i : "click", this);
                    return DialogOpenResult.create(false, this);
                }));
            }));
        }), (t => {
            h.dispose();
            throw t;
        }));
    }
    deactivate(t, i) {
        if (this.es) return this.es;
        let e = true;
        const {controller: s, dom: n, cmp: r, settings: {mouseEvent: o, rejectOnCancel: l}} = this;
        const h = DialogCloseResult.create(t, i);
        const c = new Promise((c => {
            var a, u;
            c(Y(null !== (u = null === (a = r.canDeactivate) || void 0 === a ? void 0 : a.call(r, h)) && void 0 !== u ? u : true, (c => {
                var a;
                if (true !== c) {
                    e = false;
                    this.es = void 0;
                    if (l) throw rh(null, "Dialog cancellation rejected");
                    return DialogCloseResult.create("abort");
                }
                return Y(null === (a = r.deactivate) || void 0 === a ? void 0 : a.call(r, h), (() => Y(s.deactivate(s, null, 4), (() => {
                    n.dispose();
                    n.overlay.removeEventListener(null !== o && void 0 !== o ? o : "click", this);
                    if (!l && "error" !== t) this.$t(h); else this.St(rh(i, "Dialog cancelled with a rejection on cancel"));
                    return h;
                }))));
            })));
        })).catch((t => {
            this.es = void 0;
            throw t;
        }));
        this.es = e ? c : void 0;
        return c;
    }
    ok(t) {
        return this.deactivate("ok", t);
    }
    cancel(t) {
        return this.deactivate("cancel", t);
    }
    error(t) {
        const i = oh(t);
        return new Promise((t => {
            var e, s;
            return t(Y(null === (s = (e = this.cmp).deactivate) || void 0 === s ? void 0 : s.call(e, DialogCloseResult.create("error", i)), (() => Y(this.controller.deactivate(this.controller, null, 4), (() => {
                this.dom.dispose();
                this.St(i);
            })))));
        }));
    }
    handleEvent(t) {
        if (this.settings.overlayDismiss && !this.dom.contentHost.contains(t.target)) this.cancel();
    }
    getOrCreateVm(t, i, e) {
        const s = i.component;
        if (null == s) return new EmptyComponent;
        if ("object" === typeof s) return s;
        const n = this.p;
        t.registerResolver(n.HTMLElement, t.registerResolver(n.Element, t.registerResolver(Ls, new G("ElementResolver", e))));
        return t.invoke(s);
    }
    getDefinition(t) {
        const i = At(t) ? t : null === t || void 0 === t ? void 0 : t.constructor;
        return Ae.isType(i) ? Ae.getDefinition(i) : null;
    }
}

class EmptyComponent {}

function rh(t, i) {
    const e = new Error(i);
    e.wasCancelled = true;
    e.value = t;
    return e;
}

function oh(t) {
    const i = new Error;
    i.wasCancelled = false;
    i.value = t;
    return i;
}

class DialogService {
    constructor(t, i, e) {
        this.ft = t;
        this.p = i;
        this.ss = e;
        this.dlgs = [];
    }
    get controllers() {
        return this.dlgs.slice(0);
    }
    get top() {
        const t = this.dlgs;
        return t.length > 0 ? t[t.length - 1] : null;
    }
    static get inject() {
        return [ H, ni, sh ];
    }
    static register(t) {
        t.register(_t(Ql, this), Ii.deactivating(Ql, (t => Y(t.closeAll(), (t => {
            if (t.length > 0) throw new Error(`AUR0901:${t.length}`);
        })))));
    }
    open(t) {
        return hh(new Promise((i => {
            var e;
            const s = DialogSettings.from(this.ss, t);
            const n = null !== (e = s.container) && void 0 !== e ? e : this.ft.createChild();
            i(Y(s.load(), (t => {
                const i = n.invoke(DialogController);
                n.register(Ft(th, i));
                n.register(Mt(DialogController, (() => {
                    throw new Error(`AUR0902`);
                })));
                return Y(i.activate(t), (t => {
                    if (!t.wasCancelled) {
                        if (1 === this.dlgs.push(i)) this.p.window.addEventListener("keydown", this);
                        const t = () => this.remove(i);
                        i.closed.then(t, t);
                    }
                    return t;
                }));
            })));
        })));
    }
    closeAll() {
        return Promise.all(Array.from(this.dlgs).map((t => {
            if (t.settings.rejectOnCancel) return t.cancel().then((() => null));
            return t.cancel().then((i => "cancel" === i.status ? null : t));
        }))).then((t => t.filter((t => !!t))));
    }
    remove(t) {
        const i = this.dlgs;
        const e = i.indexOf(t);
        if (e > -1) this.dlgs.splice(e, 1);
        if (0 === i.length) this.p.window.removeEventListener("keydown", this);
    }
    handleEvent(t) {
        const i = t;
        const e = ch(i);
        if (null == e) return;
        const s = this.top;
        if (null === s || 0 === s.settings.keyboard.length) return;
        const n = s.settings.keyboard;
        if ("Escape" === e && n.includes(e)) void s.cancel(); else if ("Enter" === e && n.includes(e)) void s.ok();
    }
}

class DialogSettings {
    static from(...t) {
        return Object.assign(new DialogSettings, ...t).ls().os();
    }
    load() {
        const t = this;
        const i = this.component;
        const e = this.template;
        const s = X(null == i ? void 0 : Y(i(), (i => {
            t.component = i;
        })), At(e) ? Y(e(), (i => {
            t.template = i;
        })) : void 0);
        return Ct(s) ? s.then((() => t)) : t;
    }
    ls() {
        if (null == this.component && null == this.template) throw new Error(`AUR0903`);
        return this;
    }
    os() {
        if (null == this.keyboard) this.keyboard = this.lock ? [] : [ "Enter", "Escape" ];
        if ("boolean" !== typeof this.overlayDismiss) this.overlayDismiss = !this.lock;
        return this;
    }
}

function lh(t, i) {
    return this.then((e => e.dialog.closed.then(t, i)), i);
}

function hh(t) {
    t.whenClosed = lh;
    return t;
}

function ch(t) {
    if ("Escape" === (t.code || t.key) || 27 === t.keyCode) return "Escape";
    if ("Enter" === (t.code || t.key) || 13 === t.keyCode) return "Enter";
    return;
}

class DefaultDialogGlobalSettings {
    constructor() {
        this.lock = true;
        this.startingZIndex = 1e3;
        this.rejectOnCancel = false;
    }
    static register(t) {
        _t(sh, this).register(t);
    }
}

const ah = "position:absolute;width:100%;height:100%;top:0;left:0;";

class DefaultDialogDomRenderer {
    constructor(t) {
        this.p = t;
        this.wrapperCss = `${ah} display:flex;`;
        this.overlayCss = ah;
        this.hostCss = "position:relative;margin:auto;";
    }
    static register(t) {
        _t(ih, this).register(t);
    }
    render(t) {
        const i = this.p.document;
        const e = (t, e) => {
            const s = i.createElement(t);
            s.style.cssText = e;
            return s;
        };
        const s = t.appendChild(e("au-dialog-container", this.wrapperCss));
        const n = s.appendChild(e("au-dialog-overlay", this.overlayCss));
        const r = s.appendChild(e("div", this.hostCss));
        return new DefaultDialogDom(s, n, r);
    }
}

DefaultDialogDomRenderer.inject = [ ni ];

class DefaultDialogDom {
    constructor(t, i, e) {
        this.wrapper = t;
        this.overlay = i;
        this.contentHost = e;
    }
    dispose() {
        this.wrapper.remove();
    }
}

function uh(t, i) {
    return {
        settingsProvider: t,
        register: e => e.register(...i, Ii.creating((() => t(e.get(sh))))),
        customize(t, e) {
            return uh(t, null !== e && void 0 !== e ? e : i);
        }
    };
}

const fh = uh((() => {
    throw new Error(`AUR0904`);
}), [ class NoopDialogGlobalSettings {
    static register(t) {
        t.register(_t(sh, this));
    }
} ]);

const dh = uh(P, [ DialogService, DefaultDialogGlobalSettings, DefaultDialogDomRenderer ]);

const vh = L.createInterface((t => t.singleton(WcCustomElementRegistry)));

class WcCustomElementRegistry {
    constructor(t, i, e) {
        this.ctn = t;
        this.p = i;
        this.r = e;
    }
    define(t, i, e) {
        if (!t.includes("-")) throw new Error('Invalid web-components custom element name. It must include a "-"');
        let s;
        if (null == i) throw new Error("Invalid custom element definition");
        switch (typeof i) {
          case "function":
            s = Ae.isType(i) ? Ae.getDefinition(i) : CustomElementDefinition.create(Ae.generateName(), i);
            break;

          default:
            s = CustomElementDefinition.getOrCreate(i);
            break;
        }
        if (s.containerless) throw new Error("Containerless custom element is not supported. Consider using buitl-in extends instead");
        const n = !(null === e || void 0 === e ? void 0 : e.extends) ? HTMLElement : this.p.document.createElement(e.extends).constructor;
        const r = this.ctn;
        const o = this.r;
        const l = s.bindables;
        const h = this.p;
        class CustomElementClass extends n {
            auInit() {
                if (this.auInited) return;
                this.auInited = true;
                const t = r.createChild();
                t.registerResolver(h.HTMLElement, t.registerResolver(h.Element, t.registerResolver(Ls, new G("ElementProvider", this))));
                const i = o.compile(s, t, {
                    projections: null
                });
                const e = t.invoke(i.Type);
                const n = this.auCtrl = Controller.$el(t, e, this, null, i);
                Os(this, i.key, n);
            }
            connectedCallback() {
                this.auInit();
                this.auCtrl.activate(this.auCtrl, null, 0);
            }
            disconnectedCallback() {
                this.auCtrl.deactivate(this.auCtrl, null, 0);
            }
            adoptedCallback() {
                this.auInit();
            }
            attributeChangedCallback(t, i, e) {
                this.auInit();
                this.auCtrl.viewModel[t] = e;
            }
        }
        CustomElementClass.observedAttributes = Object.keys(l);
        for (const t in l) Object.defineProperty(CustomElementClass.prototype, t, {
            configurable: true,
            enumerable: false,
            get() {
                return this["auCtrl"].viewModel[t];
            },
            set(i) {
                if (!this["auInited"]) this["auInit"]();
                this["auCtrl"].viewModel[t] = i;
            }
        });
        this.p.customElements.define(t, CustomElementClass, e);
        return CustomElementClass;
    }
}

WcCustomElementRegistry.inject = [ H, ni, ts ];

export { AdoptedStyleSheetsStyles, AppRoot, Ii as AppTask, ei as AtPrefixedTriggerAttributePattern, qo as AtPrefixedTriggerAttributePatternRegistration, AttrBindingBehavior, yl as AttrBindingBehaviorRegistration, sr as AttrBindingCommand, tl as AttrBindingCommandRegistration, AttrSyntax, AttributeBinding, AttributeBindingInstruction, Ml as AttributeBindingRendererRegistration, AttributeNSAccessor, Jt as AttributePattern, AuCompose, AuRender, Al as AuRenderRegistration, AuSlot, AuSlotsInfo, Aurelia, Dt as Bindable, BindableDefinition, BindableObserver, BindablesInfo, zn as BindingCommand, BindingCommandDefinition, BindingModeBehavior, CSSModulesProcessorRegistry, CallBinding, Jn as CallBindingCommand, No as CallBindingCommandRegistration, CallBindingInstruction, Tl as CallBindingRendererRegistration, er as CaptureBindingCommand, Qo as CaptureBindingCommandRegistration, ro as Case, CheckedObserver, Oi as Children, ChildrenDefinition, ChildrenObserver, ClassAttributeAccessor, rr as ClassBindingCommand, il as ClassBindingCommandRegistration, ii as ColonPrefixedBindAttributePattern, Uo as ColonPrefixedBindAttributePatternRegistration, Mn as CommandType, ComputedWatcher, Controller, Yi as CustomAttribute, CustomAttributeDefinition, Dl as CustomAttributeRendererRegistration, Ae as CustomElement, CustomElementDefinition, $l as CustomElementRendererRegistration, DataAttributeAccessor, DebounceBindingBehavior, Ro as DebounceBindingBehaviorRegistration, Zn as DefaultBindingCommand, Ho as DefaultBindingCommandRegistration, nl as DefaultBindingLanguage, Mo as DefaultBindingSyntax, oo as DefaultCase, Oo as DefaultComponents, DefaultDialogDom, DefaultDialogDomRenderer, DefaultDialogGlobalSettings, Xl as DefaultRenderers, Il as DefaultResources, Jl as DefinitionType, ir as DelegateBindingCommand, Jo as DelegateBindingCommandRegistration, DialogCloseResult, fh as DialogConfiguration, DialogController, nh as DialogDeactivationStatuses, dh as DialogDefaultConfiguration, DialogOpenResult, DialogService, Qt as DotSeparatedAttributePattern, Vo as DotSeparatedAttributePatternRegistration, Else, hl as ElseRegistration, EventDelegator, EventSubscriber, ExpressionWatcher, Focus, Qn as ForBindingCommand, Wo as ForBindingCommandRegistration, FragmentNodeSequence, FromViewBindingBehavior, Bo as FromViewBindingBehaviorRegistration, Kn as FromViewBindingCommand, zo as FromViewBindingCommandRegistration, co as FulfilledTemplateController, HooksDefinition, HydrateAttributeInstruction, HydrateElementInstruction, HydrateLetElementInstruction, HydrateTemplateController, Ds as IAppRoot, Bi as IAppTask, li as IAttrMapper, Gt as IAttributeParser, zt as IAttributePattern, Zs as IAuSlotsInfo, Zl as IAurelia, gs as IController, th as IDialogController, eh as IDialogDom, ih as IDialogDomRenderer, sh as IDialogGlobalSettings, Ql as IDialogService, Ks as IEventDelegator, qs as IEventTarget, zs as IHistory, ps as IHydrationContext, Qs as IInstruction, Me as ILifecycleHooks, kn as IListenerBehaviorOptions, Ws as ILocation, Ls as INode, Po as INodeObserverLocatorRegistration, ni as IPlatform, Ys as IProjections, Us as IRenderLocation, sn as IRenderer, ts as IRendering, ri as ISVGAnalyzer, ko as ISanitizer, Le as IShadowDOMGlobalStyles, Oe as IShadowDOMStyles, Nt as ISyntaxInterpreter, en as ITemplateCompiler, Cr as ITemplateCompilerHooks, $o as ITemplateCompilerRegistration, hr as ITemplateElementFactory, ze as IViewFactory, Qe as IViewLocator, vh as IWcElementRegistry, Hs as IWindow, $s as IWorkTracker, If, ll as IfRegistration, Js as InstructionType, InterpolationBinding, Pl as InterpolationBindingRendererRegistration, InterpolationInstruction, InterpolationPartBinding, Interpretation, IteratorBindingInstruction, Ol as IteratorBindingRendererRegistration, LetBinding, LetBindingInstruction, Ll as LetElementRendererRegistration, He as LifecycleHooks, LifecycleHooksDefinition, LifecycleHooksEntry, Listener, ListenerBindingInstruction, Fl as ListenerBindingRendererRegistration, NodeObserverConfig, NodeObserverLocator, _s as NodeType, NoopSVGAnalyzer, OneTimeBindingBehavior, So as OneTimeBindingBehaviorRegistration, Gn as OneTimeBindingCommand, Go as OneTimeBindingCommandRegistration, ho as PendingTemplateController, Portal, lo as PromiseTemplateController, PropertyBinding, PropertyBindingInstruction, ql as PropertyBindingRendererRegistration, ti as RefAttributePattern, _o as RefAttributePatternRegistration, RefBinding, Yo as RefBindingCommandRegistration, RefBindingInstruction, Ul as RefBindingRendererRegistration, ao as RejectedTemplateController, RenderPlan, Rendering, Repeat, cl as RepeatRegistration, SVGAnalyzer, Lo as SVGAnalyzerRegistration, Co as SanitizeValueConverter, rl as SanitizeValueConverterRegistration, SelectValueObserver, SelfBindingBehavior, kl as SelfBindingBehaviorRegistration, SetAttributeInstruction, jl as SetAttributeRendererRegistration, SetClassAttributeInstruction, Nl as SetClassAttributeRendererRegistration, SetPropertyInstruction, _l as SetPropertyRendererRegistration, SetStyleAttributeInstruction, Hl as SetStyleAttributeRendererRegistration, ShadowDOMRegistry, jo as ShortHandBindingSyntax, SignalBindingBehavior, Io as SignalBindingBehaviorRegistration, Kl as StandardConfiguration, StyleAttributeAccessor, nr as StyleBindingCommand, el as StyleBindingCommandRegistration, qe as StyleConfiguration, StyleElementStyles, StylePropertyBindingInstruction, Wl as StylePropertyBindingRendererRegistration, no as Switch, TemplateCompiler, Sr as TemplateCompilerHooks, Vl as TemplateControllerRendererRegistration, TextBindingInstruction, zl as TextBindingRendererRegistration, ThrottleBindingBehavior, To as ThrottleBindingBehaviorRegistration, ToViewBindingBehavior, Eo as ToViewBindingBehaviorRegistration, Xn as ToViewBindingCommand, Xo as ToViewBindingCommandRegistration, tr as TriggerBindingCommand, Zo as TriggerBindingCommandRegistration, TwoWayBindingBehavior, Do as TwoWayBindingBehaviorRegistration, Yn as TwoWayBindingCommand, Ko as TwoWayBindingCommandRegistration, UpdateTriggerBindingBehavior, Cl as UpdateTriggerBindingBehaviorRegistration, ValueAttributeObserver, ViewFactory, ViewLocator, ds as ViewModelKind, Ao as ViewValueConverter, ol as ViewValueConverterRegistration, Ze as Views, te as Watch, WcCustomElementRegistry, With, al as WithRegistration, Ut as allResources, xn as applyBindingBehavior, Xt as attributePattern, Bt as bindable, jn as bindingCommand, Be as capture, Di as children, $t as coercer, se as containerless, js as convertToRenderLocation, go as createElement, De as cssModules, Mi as customAttribute, ie as customElement, Fs as getEffectiveParentNode, Ps as getRef, as as isCustomElementController, us as isCustomElementViewModel, tn as isInstruction, Ns as isRenderLocation, We as lifecycleHooks, Se as processContent, nn as renderer, Ms as setEffectiveParentNode, Os as setRef, $e as shadowCSS, re as strict, Er as templateCompilerHooks, ji as templateController, ee as useShadowDOM, Je as view, Zi as watch };
//# sourceMappingURL=index.mjs.map
