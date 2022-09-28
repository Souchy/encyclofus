"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var t = require("@aurelia/runtime");

var e = require("@aurelia/kernel");

var i = require("@aurelia/metadata");

var s = require("@aurelia/platform");

var n = require("@aurelia/platform-browser");

function r(t, e, i, s) {
    var n = arguments.length, r = n < 3 ? e : null === s ? s = Object.getOwnPropertyDescriptor(e, i) : s, o;
    if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(t, e, i, s); else for (var l = t.length - 1; l >= 0; l--) if (o = t[l]) r = (n < 3 ? o(r) : n > 3 ? o(e, i, r) : o(e, i)) || r;
    return n > 3 && r && Object.defineProperty(e, i, r), r;
}

function o(t, e) {
    return function(i, s) {
        e(i, s, t);
    };
}

const l = i.Metadata.getOwn;

const h = i.Metadata.hasOwn;

const c = i.Metadata.define;

const {annotation: a, resource: u} = e.Protocol;

const f = a.keyFor;

const d = u.keyFor;

const p = u.appendTo;

const v = a.appendTo;

const m = a.getKeys;

const x = () => Object.create(null);

const g = Object.prototype.hasOwnProperty;

const w = x();

const b = (t, e, i) => {
    if (true === w[e]) return true;
    if (!C(e)) return false;
    const s = e.slice(0, 5);
    return w[e] = "aria-" === s || "data-" === s || i.isStandardSvgAttribute(t, e);
};

const y = t => t instanceof Promise;

const k = t => "function" === typeof t;

const C = t => "string" === typeof t;

const A = Object.defineProperty;

const R = t => {
    throw t;
};

function S(t, e) {
    let i;
    function s(t, e) {
        if (arguments.length > 1) i.property = e;
        c(B, BindableDefinition.create(e, t, i), t.constructor, e);
        v(t.constructor, I.keyFrom(e));
    }
    if (arguments.length > 1) {
        i = {};
        s(t, e);
        return;
    } else if (C(t)) {
        i = {};
        return s;
    }
    i = void 0 === t ? {} : t;
    return s;
}

function E(t) {
    return t.startsWith(B);
}

const B = f("bindable");

const I = Object.freeze({
    name: B,
    keyFrom: t => `${B}:${t}`,
    from(t, ...e) {
        const i = {};
        const s = Array.isArray;
        function n(e) {
            i[e] = BindableDefinition.create(e, t);
        }
        function r(e, s) {
            i[e] = s instanceof BindableDefinition ? s : BindableDefinition.create(e, t, s);
        }
        function o(t) {
            if (s(t)) t.forEach(n); else if (t instanceof BindableDefinition) i[t.property] = t; else if (void 0 !== t) Object.keys(t).forEach((e => r(e, t[e])));
        }
        e.forEach(o);
        return i;
    },
    for(t) {
        let e;
        const i = {
            add(s) {
                let n;
                let r;
                if (C(s)) {
                    n = s;
                    r = {
                        property: n
                    };
                } else {
                    n = s.property;
                    r = s;
                }
                e = BindableDefinition.create(n, t, r);
                if (!h(B, t, n)) v(t, I.keyFrom(n));
                c(B, e, t, n);
                return i;
            },
            mode(t) {
                e.mode = t;
                return i;
            },
            callback(t) {
                e.callback = t;
                return i;
            },
            attribute(t) {
                e.attribute = t;
                return i;
            },
            primary() {
                e.primary = true;
                return i;
            },
            set(t) {
                e.set = t;
                return i;
            }
        };
        return i;
    },
    getAll(t) {
        const i = B.length + 1;
        const s = [];
        const n = e.getPrototypeChain(t);
        let r = n.length;
        let o = 0;
        let h;
        let c;
        let a;
        let u;
        while (--r >= 0) {
            a = n[r];
            h = m(a).filter(E);
            c = h.length;
            for (u = 0; u < c; ++u) s[o++] = l(B, a, h[u].slice(i));
        }
        return s;
    }
});

class BindableDefinition {
    constructor(t, e, i, s, n, r) {
        this.attribute = t;
        this.callback = e;
        this.mode = i;
        this.primary = s;
        this.property = n;
        this.set = r;
    }
    static create(i, s, n = {}) {
        return new BindableDefinition(e.firstDefined(n.attribute, e.kebabCase(i)), e.firstDefined(n.callback, `${i}Changed`), e.firstDefined(n.mode, t.BindingMode.toView), e.firstDefined(n.primary, false), e.firstDefined(n.property, i), e.firstDefined(n.set, $(i, s, n)));
    }
}

function T(t, e, i) {
    D.define(t, e);
}

const D = {
    key: f("coercer"),
    define(t, e) {
        c(D.key, t[e].bind(t), t);
    },
    for(t) {
        return l(D.key, t);
    }
};

function $(t, i, s = {}) {
    var n, r, o;
    const l = null !== (r = null !== (n = s.type) && void 0 !== n ? n : Reflect.getMetadata("design:type", i, t)) && void 0 !== r ? r : null;
    if (null == l) return e.noop;
    let h;
    switch (l) {
      case Number:
      case Boolean:
      case String:
      case BigInt:
        h = l;
        break;

      default:
        {
            const t = l.coerce;
            h = "function" === typeof t ? t.bind(l) : null !== (o = D.for(l)) && void 0 !== o ? o : e.noop;
            break;
        }
    }
    return h === e.noop ? h : P(h, s.nullable);
}

function P(t, e) {
    return function(i, s) {
        var n;
        if (!(null === s || void 0 === s ? void 0 : s.enableCoercion)) return i;
        return (null !== e && void 0 !== e ? e : (null !== (n = null === s || void 0 === s ? void 0 : s.coerceNullish) && void 0 !== n ? n : false) ? false : true) && null == i ? i : t(i, s);
    };
}

class BindableObserver {
    constructor(t, i, s, n, r, o) {
        this.set = n;
        this.$controller = r;
        this.t = o;
        this.v = void 0;
        this.ov = void 0;
        this.f = 0;
        const l = t[s];
        const h = t.propertyChanged;
        const c = this.i = k(l);
        const a = this.u = k(h);
        const u = this.hs = n !== e.noop;
        let f;
        this.o = t;
        this.k = i;
        this.cb = c ? l : e.noop;
        this.C = a ? h : e.noop;
        if (void 0 === this.cb && !a && !u) this.iO = false; else {
            this.iO = true;
            f = t[i];
            this.v = u && void 0 !== f ? n(f, this.t) : f;
            this.A();
        }
    }
    get type() {
        return 1;
    }
    getValue() {
        return this.v;
    }
    setValue(t, e) {
        if (this.hs) t = this.set(t, this.t);
        const i = this.v;
        if (this.iO) {
            if (Object.is(t, i)) return;
            this.v = t;
            this.ov = i;
            this.f = e;
            if (null == this.$controller || this.$controller.isBound) {
                if (this.i) this.cb.call(this.o, t, i, e);
                if (this.u) this.C.call(this.o, this.k, t, i, e);
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
        O = this.ov;
        this.ov = this.v;
        this.subs.notify(this.v, O, this.f);
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

t.subscriberCollection(BindableObserver);

t.withFlushQueue(BindableObserver);

let O;

const L = function(t) {
    function i(t, s, n) {
        e.DI.inject(i)(t, s, n);
    }
    i.$isResolver = true;
    i.resolve = function(e, i) {
        if (i.root === i) return i.getAll(t, false);
        return i.has(t, false) ? i.getAll(t, false).concat(i.root.getAll(t, false)) : i.root.getAll(t, false);
    };
    return i;
};

const q = e.Registration.singleton;

const U = e.Registration.aliasTo;

const _ = e.Registration.instance;

const V = e.Registration.callback;

const M = e.Registration.transient;

class CharSpec {
    constructor(t, e, i, s) {
        this.chars = t;
        this.repeat = e;
        this.isSymbol = i;
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
        this.parts = e.emptyArray;
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
            this.parts = e.emptyArray;
        } else {
            this.O = t;
            this.parts = this.q[t];
        }
    }
    append(t, e) {
        const i = this.L;
        if (void 0 === i[t]) i[t] = e; else i[t] += e;
    }
    next(t) {
        const e = this.L;
        let i;
        if (void 0 !== e[t]) {
            i = this.q;
            if (void 0 === i[t]) i[t] = [ e[t] ]; else i[t].push(e[t]);
            e[t] = void 0;
        }
    }
}

class AttrParsingState {
    constructor(t, ...e) {
        this.charSpec = t;
        this.nextStates = [];
        this.types = null;
        this.isEndpoint = false;
        this.patterns = e;
    }
    get pattern() {
        return this.isEndpoint ? this.patterns[0] : null;
    }
    findChild(t) {
        const e = this.nextStates;
        const i = e.length;
        let s = null;
        let n = 0;
        for (;n < i; ++n) {
            s = e[n];
            if (t.equals(s.charSpec)) return s;
        }
        return null;
    }
    append(t, e) {
        const i = this.patterns;
        if (!i.includes(e)) i.push(e);
        let s = this.findChild(t);
        if (null == s) {
            s = new AttrParsingState(t, e);
            this.nextStates.push(s);
            if (t.repeat) s.nextStates.push(s);
        }
        return s;
    }
    findMatches(t, e) {
        const i = [];
        const s = this.nextStates;
        const n = s.length;
        let r = 0;
        let o = null;
        let l = 0;
        let h = 0;
        for (;l < n; ++l) {
            o = s[l];
            if (o.charSpec.has(t)) {
                i.push(o);
                r = o.patterns.length;
                h = 0;
                if (o.charSpec.isSymbol) for (;h < r; ++h) e.next(o.patterns[h]); else for (;h < r; ++h) e.append(o.patterns[h], t);
            }
        }
        return i;
    }
}

class StaticSegment {
    constructor(t) {
        this.text = t;
        const e = this.len = t.length;
        const i = this.specs = [];
        let s = 0;
        for (;e > s; ++s) i.push(new CharSpec(t[s], false, false, false));
    }
    eachChar(t) {
        const e = this.len;
        const i = this.specs;
        let s = 0;
        for (;e > s; ++s) t(i[s]);
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

const F = e.DI.createInterface("ISyntaxInterpreter", (t => t.singleton(SyntaxInterpreter)));

class SyntaxInterpreter {
    constructor() {
        this.rootState = new AttrParsingState(null);
        this.initialStates = [ this.rootState ];
    }
    add(t) {
        t = t.slice(0).sort(((t, e) => t.pattern > e.pattern ? 1 : -1));
        const e = t.length;
        let i;
        let s;
        let n;
        let r;
        let o;
        let l;
        let h;
        let c = 0;
        let a;
        while (e > c) {
            i = this.rootState;
            s = t[c];
            n = s.pattern;
            r = new SegmentTypes;
            o = this.parse(s, r);
            l = o.length;
            h = t => {
                i = i.append(t, n);
            };
            for (a = 0; l > a; ++a) o[a].eachChar(h);
            i.types = r;
            i.isEndpoint = true;
            ++c;
        }
    }
    interpret(t) {
        const e = new Interpretation;
        const i = t.length;
        let s = this.initialStates;
        let n = 0;
        let r;
        for (;n < i; ++n) {
            s = this.getNextStates(s, t.charAt(n), e);
            if (0 === s.length) break;
        }
        s = s.filter(j);
        if (s.length > 0) {
            s.sort(N);
            r = s[0];
            if (!r.charSpec.isSymbol) e.next(r.pattern);
            e.pattern = r.pattern;
        }
        return e;
    }
    getNextStates(t, e, i) {
        const s = [];
        let n = null;
        const r = t.length;
        let o = 0;
        for (;o < r; ++o) {
            n = t[o];
            s.push(...n.findMatches(e, i));
        }
        return s;
    }
    parse(t, e) {
        const i = [];
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
                i.push(new DynamicSegment(r));
                ++e.dynamics;
            } else ++o; else ++o; else if (o !== l) {
                i.push(new StaticSegment(s.slice(l, o)));
                ++e.statics;
                l = o;
            } else {
                i.push(new SymbolSegment(s.slice(l, o + 1)));
                ++e.symbols;
                l = ++o;
            }
        }
        if (l !== o) {
            i.push(new StaticSegment(s.slice(l, o)));
            ++e.statics;
        }
        return i;
    }
}

function j(t) {
    return t.isEndpoint;
}

function N(t, e) {
    const i = t.types;
    const s = e.types;
    if (i.statics !== s.statics) return s.statics - i.statics;
    if (i.dynamics !== s.dynamics) return s.dynamics - i.dynamics;
    if (i.symbols !== s.symbols) return s.symbols - i.symbols;
    return 0;
}

class AttrSyntax {
    constructor(t, e, i, s) {
        this.rawName = t;
        this.rawValue = e;
        this.target = i;
        this.command = s;
    }
}

const H = e.DI.createInterface("IAttributePattern");

const W = e.DI.createInterface("IAttributeParser", (t => t.singleton(AttributeParser)));

class AttributeParser {
    constructor(t, i) {
        this.U = {};
        this._ = t;
        const s = this.V = {};
        const n = i.reduce(((t, e) => {
            const i = K(e.constructor);
            i.forEach((t => s[t.pattern] = e));
            return t.concat(i);
        }), e.emptyArray);
        t.add(n);
    }
    parse(t, e) {
        let i = this.U[t];
        if (null == i) i = this.U[t] = this._.interpret(t);
        const s = i.pattern;
        if (null == s) return new AttrSyntax(t, e, t, null); else return this.V[s][s](t, e, i.parts);
    }
}

AttributeParser.inject = [ F, e.all(H) ];

function z(...t) {
    return function e(i) {
        return Y.define(t, i);
    };
}

class AttributePatternResourceDefinition {
    constructor(t) {
        this.Type = t;
        this.name = void 0;
    }
    register(t) {
        q(H, this.Type).register(t);
    }
}

const G = d("attribute-pattern");

const X = "attribute-pattern-definitions";

const K = t => e.Protocol.annotation.get(t, X);

const Y = Object.freeze({
    name: G,
    definitionAnnotationKey: X,
    define(t, i) {
        const s = new AttributePatternResourceDefinition(i);
        c(G, s, i);
        p(i, G);
        e.Protocol.annotation.set(i, X, t);
        v(i, X);
        return i;
    },
    getPatternDefinitions: K
});

exports.DotSeparatedAttributePattern = class DotSeparatedAttributePattern {
    "PART.PART"(t, e, i) {
        return new AttrSyntax(t, e, i[0], i[1]);
    }
    "PART.PART.PART"(t, e, i) {
        return new AttrSyntax(t, e, i[0], i[2]);
    }
};

exports.DotSeparatedAttributePattern = r([ z({
    pattern: "PART.PART",
    symbols: "."
}, {
    pattern: "PART.PART.PART",
    symbols: "."
}) ], exports.DotSeparatedAttributePattern);

exports.RefAttributePattern = class RefAttributePattern {
    ref(t, e, i) {
        return new AttrSyntax(t, e, "element", "ref");
    }
    "PART.ref"(t, e, i) {
        return new AttrSyntax(t, e, i[0], "ref");
    }
};

exports.RefAttributePattern = r([ z({
    pattern: "ref",
    symbols: ""
}, {
    pattern: "PART.ref",
    symbols: "."
}) ], exports.RefAttributePattern);

exports.ColonPrefixedBindAttributePattern = class ColonPrefixedBindAttributePattern {
    ":PART"(t, e, i) {
        return new AttrSyntax(t, e, i[0], "bind");
    }
};

exports.ColonPrefixedBindAttributePattern = r([ z({
    pattern: ":PART",
    symbols: ":"
}) ], exports.ColonPrefixedBindAttributePattern);

exports.AtPrefixedTriggerAttributePattern = class AtPrefixedTriggerAttributePattern {
    "@PART"(t, e, i) {
        return new AttrSyntax(t, e, i[0], "trigger");
    }
};

exports.AtPrefixedTriggerAttributePattern = r([ z({
    pattern: "@PART",
    symbols: "@"
}) ], exports.AtPrefixedTriggerAttributePattern);

let Z = class SpreadAttributePattern {
    "...$attrs"(t, e, i) {
        return new AttrSyntax(t, e, "", "...$attrs");
    }
};

Z = r([ z({
    pattern: "...$attrs",
    symbols: ""
}) ], Z);

const J = e.IPlatform;

const Q = e.DI.createInterface("ISVGAnalyzer", (t => t.singleton(NoopSVGAnalyzer)));

class NoopSVGAnalyzer {
    isStandardSvgAttribute(t, e) {
        return false;
    }
}

function tt(t) {
    const e = x();
    let i;
    for (i of t) e[i] = true;
    return e;
}

class SVGAnalyzer {
    constructor(t) {
        this.M = Object.assign(x(), {
            a: tt([ "class", "externalResourcesRequired", "id", "onactivate", "onclick", "onfocusin", "onfocusout", "onload", "onmousedown", "onmousemove", "onmouseout", "onmouseover", "onmouseup", "requiredExtensions", "requiredFeatures", "style", "systemLanguage", "target", "transform", "xlink:actuate", "xlink:arcrole", "xlink:href", "xlink:role", "xlink:show", "xlink:title", "xlink:type", "xml:base", "xml:lang", "xml:space" ]),
            altGlyph: tt([ "class", "dx", "dy", "externalResourcesRequired", "format", "glyphRef", "id", "onactivate", "onclick", "onfocusin", "onfocusout", "onload", "onmousedown", "onmousemove", "onmouseout", "onmouseover", "onmouseup", "requiredExtensions", "requiredFeatures", "rotate", "style", "systemLanguage", "x", "xlink:actuate", "xlink:arcrole", "xlink:href", "xlink:role", "xlink:show", "xlink:title", "xlink:type", "xml:base", "xml:lang", "xml:space", "y" ]),
            altglyph: x(),
            altGlyphDef: tt([ "id", "xml:base", "xml:lang", "xml:space" ]),
            altglyphdef: x(),
            altGlyphItem: tt([ "id", "xml:base", "xml:lang", "xml:space" ]),
            altglyphitem: x(),
            animate: tt([ "accumulate", "additive", "attributeName", "attributeType", "begin", "by", "calcMode", "dur", "end", "externalResourcesRequired", "fill", "from", "id", "keySplines", "keyTimes", "max", "min", "onbegin", "onend", "onload", "onrepeat", "repeatCount", "repeatDur", "requiredExtensions", "requiredFeatures", "restart", "systemLanguage", "to", "values", "xlink:actuate", "xlink:arcrole", "xlink:href", "xlink:role", "xlink:show", "xlink:title", "xlink:type", "xml:base", "xml:lang", "xml:space" ]),
            animateColor: tt([ "accumulate", "additive", "attributeName", "attributeType", "begin", "by", "calcMode", "dur", "end", "externalResourcesRequired", "fill", "from", "id", "keySplines", "keyTimes", "max", "min", "onbegin", "onend", "onload", "onrepeat", "repeatCount", "repeatDur", "requiredExtensions", "requiredFeatures", "restart", "systemLanguage", "to", "values", "xlink:actuate", "xlink:arcrole", "xlink:href", "xlink:role", "xlink:show", "xlink:title", "xlink:type", "xml:base", "xml:lang", "xml:space" ]),
            animateMotion: tt([ "accumulate", "additive", "begin", "by", "calcMode", "dur", "end", "externalResourcesRequired", "fill", "from", "id", "keyPoints", "keySplines", "keyTimes", "max", "min", "onbegin", "onend", "onload", "onrepeat", "origin", "path", "repeatCount", "repeatDur", "requiredExtensions", "requiredFeatures", "restart", "rotate", "systemLanguage", "to", "values", "xlink:actuate", "xlink:arcrole", "xlink:href", "xlink:role", "xlink:show", "xlink:title", "xlink:type", "xml:base", "xml:lang", "xml:space" ]),
            animateTransform: tt([ "accumulate", "additive", "attributeName", "attributeType", "begin", "by", "calcMode", "dur", "end", "externalResourcesRequired", "fill", "from", "id", "keySplines", "keyTimes", "max", "min", "onbegin", "onend", "onload", "onrepeat", "repeatCount", "repeatDur", "requiredExtensions", "requiredFeatures", "restart", "systemLanguage", "to", "type", "values", "xlink:actuate", "xlink:arcrole", "xlink:href", "xlink:role", "xlink:show", "xlink:title", "xlink:type", "xml:base", "xml:lang", "xml:space" ]),
            circle: tt([ "class", "cx", "cy", "externalResourcesRequired", "id", "onactivate", "onclick", "onfocusin", "onfocusout", "onload", "onmousedown", "onmousemove", "onmouseout", "onmouseover", "onmouseup", "r", "requiredExtensions", "requiredFeatures", "style", "systemLanguage", "transform", "xml:base", "xml:lang", "xml:space" ]),
            clipPath: tt([ "class", "clipPathUnits", "externalResourcesRequired", "id", "requiredExtensions", "requiredFeatures", "style", "systemLanguage", "transform", "xml:base", "xml:lang", "xml:space" ]),
            "color-profile": tt([ "id", "local", "name", "rendering-intent", "xlink:actuate", "xlink:arcrole", "xlink:href", "xlink:role", "xlink:show", "xlink:title", "xlink:type", "xml:base", "xml:lang", "xml:space" ]),
            cursor: tt([ "externalResourcesRequired", "id", "requiredExtensions", "requiredFeatures", "systemLanguage", "x", "xlink:actuate", "xlink:arcrole", "xlink:href", "xlink:role", "xlink:show", "xlink:title", "xlink:type", "xml:base", "xml:lang", "xml:space", "y" ]),
            defs: tt([ "class", "externalResourcesRequired", "id", "onactivate", "onclick", "onfocusin", "onfocusout", "onload", "onmousedown", "onmousemove", "onmouseout", "onmouseover", "onmouseup", "requiredExtensions", "requiredFeatures", "style", "systemLanguage", "transform", "xml:base", "xml:lang", "xml:space" ]),
            desc: tt([ "class", "id", "style", "xml:base", "xml:lang", "xml:space" ]),
            ellipse: tt([ "class", "cx", "cy", "externalResourcesRequired", "id", "onactivate", "onclick", "onfocusin", "onfocusout", "onload", "onmousedown", "onmousemove", "onmouseout", "onmouseover", "onmouseup", "requiredExtensions", "requiredFeatures", "rx", "ry", "style", "systemLanguage", "transform", "xml:base", "xml:lang", "xml:space" ]),
            feBlend: tt([ "class", "height", "id", "in", "in2", "mode", "result", "style", "width", "x", "xml:base", "xml:lang", "xml:space", "y" ]),
            feColorMatrix: tt([ "class", "height", "id", "in", "result", "style", "type", "values", "width", "x", "xml:base", "xml:lang", "xml:space", "y" ]),
            feComponentTransfer: tt([ "class", "height", "id", "in", "result", "style", "width", "x", "xml:base", "xml:lang", "xml:space", "y" ]),
            feComposite: tt([ "class", "height", "id", "in", "in2", "k1", "k2", "k3", "k4", "operator", "result", "style", "width", "x", "xml:base", "xml:lang", "xml:space", "y" ]),
            feConvolveMatrix: tt([ "bias", "class", "divisor", "edgeMode", "height", "id", "in", "kernelMatrix", "kernelUnitLength", "order", "preserveAlpha", "result", "style", "targetX", "targetY", "width", "x", "xml:base", "xml:lang", "xml:space", "y" ]),
            feDiffuseLighting: tt([ "class", "diffuseConstant", "height", "id", "in", "kernelUnitLength", "result", "style", "surfaceScale", "width", "x", "xml:base", "xml:lang", "xml:space", "y" ]),
            feDisplacementMap: tt([ "class", "height", "id", "in", "in2", "result", "scale", "style", "width", "x", "xChannelSelector", "xml:base", "xml:lang", "xml:space", "y", "yChannelSelector" ]),
            feDistantLight: tt([ "azimuth", "elevation", "id", "xml:base", "xml:lang", "xml:space" ]),
            feFlood: tt([ "class", "height", "id", "result", "style", "width", "x", "xml:base", "xml:lang", "xml:space", "y" ]),
            feFuncA: tt([ "amplitude", "exponent", "id", "intercept", "offset", "slope", "tableValues", "type", "xml:base", "xml:lang", "xml:space" ]),
            feFuncB: tt([ "amplitude", "exponent", "id", "intercept", "offset", "slope", "tableValues", "type", "xml:base", "xml:lang", "xml:space" ]),
            feFuncG: tt([ "amplitude", "exponent", "id", "intercept", "offset", "slope", "tableValues", "type", "xml:base", "xml:lang", "xml:space" ]),
            feFuncR: tt([ "amplitude", "exponent", "id", "intercept", "offset", "slope", "tableValues", "type", "xml:base", "xml:lang", "xml:space" ]),
            feGaussianBlur: tt([ "class", "height", "id", "in", "result", "stdDeviation", "style", "width", "x", "xml:base", "xml:lang", "xml:space", "y" ]),
            feImage: tt([ "class", "externalResourcesRequired", "height", "id", "preserveAspectRatio", "result", "style", "width", "x", "xlink:actuate", "xlink:arcrole", "xlink:href", "xlink:role", "xlink:show", "xlink:title", "xlink:type", "xml:base", "xml:lang", "xml:space", "y" ]),
            feMerge: tt([ "class", "height", "id", "result", "style", "width", "x", "xml:base", "xml:lang", "xml:space", "y" ]),
            feMergeNode: tt([ "id", "xml:base", "xml:lang", "xml:space" ]),
            feMorphology: tt([ "class", "height", "id", "in", "operator", "radius", "result", "style", "width", "x", "xml:base", "xml:lang", "xml:space", "y" ]),
            feOffset: tt([ "class", "dx", "dy", "height", "id", "in", "result", "style", "width", "x", "xml:base", "xml:lang", "xml:space", "y" ]),
            fePointLight: tt([ "id", "x", "xml:base", "xml:lang", "xml:space", "y", "z" ]),
            feSpecularLighting: tt([ "class", "height", "id", "in", "kernelUnitLength", "result", "specularConstant", "specularExponent", "style", "surfaceScale", "width", "x", "xml:base", "xml:lang", "xml:space", "y" ]),
            feSpotLight: tt([ "id", "limitingConeAngle", "pointsAtX", "pointsAtY", "pointsAtZ", "specularExponent", "x", "xml:base", "xml:lang", "xml:space", "y", "z" ]),
            feTile: tt([ "class", "height", "id", "in", "result", "style", "width", "x", "xml:base", "xml:lang", "xml:space", "y" ]),
            feTurbulence: tt([ "baseFrequency", "class", "height", "id", "numOctaves", "result", "seed", "stitchTiles", "style", "type", "width", "x", "xml:base", "xml:lang", "xml:space", "y" ]),
            filter: tt([ "class", "externalResourcesRequired", "filterRes", "filterUnits", "height", "id", "primitiveUnits", "style", "width", "x", "xlink:actuate", "xlink:arcrole", "xlink:href", "xlink:role", "xlink:show", "xlink:title", "xlink:type", "xml:base", "xml:lang", "xml:space", "y" ]),
            font: tt([ "class", "externalResourcesRequired", "horiz-adv-x", "horiz-origin-x", "horiz-origin-y", "id", "style", "vert-adv-y", "vert-origin-x", "vert-origin-y", "xml:base", "xml:lang", "xml:space" ]),
            "font-face": tt([ "accent-height", "alphabetic", "ascent", "bbox", "cap-height", "descent", "font-family", "font-size", "font-stretch", "font-style", "font-variant", "font-weight", "hanging", "id", "ideographic", "mathematical", "overline-position", "overline-thickness", "panose-1", "slope", "stemh", "stemv", "strikethrough-position", "strikethrough-thickness", "underline-position", "underline-thickness", "unicode-range", "units-per-em", "v-alphabetic", "v-hanging", "v-ideographic", "v-mathematical", "widths", "x-height", "xml:base", "xml:lang", "xml:space" ]),
            "font-face-format": tt([ "id", "string", "xml:base", "xml:lang", "xml:space" ]),
            "font-face-name": tt([ "id", "name", "xml:base", "xml:lang", "xml:space" ]),
            "font-face-src": tt([ "id", "xml:base", "xml:lang", "xml:space" ]),
            "font-face-uri": tt([ "id", "xlink:actuate", "xlink:arcrole", "xlink:href", "xlink:role", "xlink:show", "xlink:title", "xlink:type", "xml:base", "xml:lang", "xml:space" ]),
            foreignObject: tt([ "class", "externalResourcesRequired", "height", "id", "onactivate", "onclick", "onfocusin", "onfocusout", "onload", "onmousedown", "onmousemove", "onmouseout", "onmouseover", "onmouseup", "requiredExtensions", "requiredFeatures", "style", "systemLanguage", "transform", "width", "x", "xml:base", "xml:lang", "xml:space", "y" ]),
            g: tt([ "class", "externalResourcesRequired", "id", "onactivate", "onclick", "onfocusin", "onfocusout", "onload", "onmousedown", "onmousemove", "onmouseout", "onmouseover", "onmouseup", "requiredExtensions", "requiredFeatures", "style", "systemLanguage", "transform", "xml:base", "xml:lang", "xml:space" ]),
            glyph: tt([ "arabic-form", "class", "d", "glyph-name", "horiz-adv-x", "id", "lang", "orientation", "style", "unicode", "vert-adv-y", "vert-origin-x", "vert-origin-y", "xml:base", "xml:lang", "xml:space" ]),
            glyphRef: tt([ "class", "dx", "dy", "format", "glyphRef", "id", "style", "x", "xlink:actuate", "xlink:arcrole", "xlink:href", "xlink:role", "xlink:show", "xlink:title", "xlink:type", "xml:base", "xml:lang", "xml:space", "y" ]),
            glyphref: x(),
            hkern: tt([ "g1", "g2", "id", "k", "u1", "u2", "xml:base", "xml:lang", "xml:space" ]),
            image: tt([ "class", "externalResourcesRequired", "height", "id", "onactivate", "onclick", "onfocusin", "onfocusout", "onload", "onmousedown", "onmousemove", "onmouseout", "onmouseover", "onmouseup", "preserveAspectRatio", "requiredExtensions", "requiredFeatures", "style", "systemLanguage", "transform", "width", "x", "xlink:actuate", "xlink:arcrole", "xlink:href", "xlink:role", "xlink:show", "xlink:title", "xlink:type", "xml:base", "xml:lang", "xml:space", "y" ]),
            line: tt([ "class", "externalResourcesRequired", "id", "onactivate", "onclick", "onfocusin", "onfocusout", "onload", "onmousedown", "onmousemove", "onmouseout", "onmouseover", "onmouseup", "requiredExtensions", "requiredFeatures", "style", "systemLanguage", "transform", "x1", "x2", "xml:base", "xml:lang", "xml:space", "y1", "y2" ]),
            linearGradient: tt([ "class", "externalResourcesRequired", "gradientTransform", "gradientUnits", "id", "spreadMethod", "style", "x1", "x2", "xlink:arcrole", "xlink:href", "xlink:role", "xlink:title", "xlink:type", "xml:base", "xml:lang", "xml:space", "y1", "y2" ]),
            marker: tt([ "class", "externalResourcesRequired", "id", "markerHeight", "markerUnits", "markerWidth", "orient", "preserveAspectRatio", "refX", "refY", "style", "viewBox", "xml:base", "xml:lang", "xml:space" ]),
            mask: tt([ "class", "externalResourcesRequired", "height", "id", "maskContentUnits", "maskUnits", "requiredExtensions", "requiredFeatures", "style", "systemLanguage", "width", "x", "xml:base", "xml:lang", "xml:space", "y" ]),
            metadata: tt([ "id", "xml:base", "xml:lang", "xml:space" ]),
            "missing-glyph": tt([ "class", "d", "horiz-adv-x", "id", "style", "vert-adv-y", "vert-origin-x", "vert-origin-y", "xml:base", "xml:lang", "xml:space" ]),
            mpath: tt([ "externalResourcesRequired", "id", "xlink:actuate", "xlink:arcrole", "xlink:href", "xlink:role", "xlink:show", "xlink:title", "xlink:type", "xml:base", "xml:lang", "xml:space" ]),
            path: tt([ "class", "d", "externalResourcesRequired", "id", "onactivate", "onclick", "onfocusin", "onfocusout", "onload", "onmousedown", "onmousemove", "onmouseout", "onmouseover", "onmouseup", "pathLength", "requiredExtensions", "requiredFeatures", "style", "systemLanguage", "transform", "xml:base", "xml:lang", "xml:space" ]),
            pattern: tt([ "class", "externalResourcesRequired", "height", "id", "patternContentUnits", "patternTransform", "patternUnits", "preserveAspectRatio", "requiredExtensions", "requiredFeatures", "style", "systemLanguage", "viewBox", "width", "x", "xlink:actuate", "xlink:arcrole", "xlink:href", "xlink:role", "xlink:show", "xlink:title", "xlink:type", "xml:base", "xml:lang", "xml:space", "y" ]),
            polygon: tt([ "class", "externalResourcesRequired", "id", "onactivate", "onclick", "onfocusin", "onfocusout", "onload", "onmousedown", "onmousemove", "onmouseout", "onmouseover", "onmouseup", "points", "requiredExtensions", "requiredFeatures", "style", "systemLanguage", "transform", "xml:base", "xml:lang", "xml:space" ]),
            polyline: tt([ "class", "externalResourcesRequired", "id", "onactivate", "onclick", "onfocusin", "onfocusout", "onload", "onmousedown", "onmousemove", "onmouseout", "onmouseover", "onmouseup", "points", "requiredExtensions", "requiredFeatures", "style", "systemLanguage", "transform", "xml:base", "xml:lang", "xml:space" ]),
            radialGradient: tt([ "class", "cx", "cy", "externalResourcesRequired", "fx", "fy", "gradientTransform", "gradientUnits", "id", "r", "spreadMethod", "style", "xlink:arcrole", "xlink:href", "xlink:role", "xlink:title", "xlink:type", "xml:base", "xml:lang", "xml:space" ]),
            rect: tt([ "class", "externalResourcesRequired", "height", "id", "onactivate", "onclick", "onfocusin", "onfocusout", "onload", "onmousedown", "onmousemove", "onmouseout", "onmouseover", "onmouseup", "requiredExtensions", "requiredFeatures", "rx", "ry", "style", "systemLanguage", "transform", "width", "x", "xml:base", "xml:lang", "xml:space", "y" ]),
            script: tt([ "externalResourcesRequired", "id", "type", "xlink:actuate", "xlink:arcrole", "xlink:href", "xlink:role", "xlink:show", "xlink:title", "xlink:type", "xml:base", "xml:lang", "xml:space" ]),
            set: tt([ "attributeName", "attributeType", "begin", "dur", "end", "externalResourcesRequired", "fill", "id", "max", "min", "onbegin", "onend", "onload", "onrepeat", "repeatCount", "repeatDur", "requiredExtensions", "requiredFeatures", "restart", "systemLanguage", "to", "xlink:actuate", "xlink:arcrole", "xlink:href", "xlink:role", "xlink:show", "xlink:title", "xlink:type", "xml:base", "xml:lang", "xml:space" ]),
            stop: tt([ "class", "id", "offset", "style", "xml:base", "xml:lang", "xml:space" ]),
            style: tt([ "id", "media", "title", "type", "xml:base", "xml:lang", "xml:space" ]),
            svg: tt([ "baseProfile", "class", "contentScriptType", "contentStyleType", "externalResourcesRequired", "height", "id", "onabort", "onactivate", "onclick", "onerror", "onfocusin", "onfocusout", "onload", "onmousedown", "onmousemove", "onmouseout", "onmouseover", "onmouseup", "onresize", "onscroll", "onunload", "onzoom", "preserveAspectRatio", "requiredExtensions", "requiredFeatures", "style", "systemLanguage", "version", "viewBox", "width", "x", "xml:base", "xml:lang", "xml:space", "y", "zoomAndPan" ]),
            switch: tt([ "class", "externalResourcesRequired", "id", "onactivate", "onclick", "onfocusin", "onfocusout", "onload", "onmousedown", "onmousemove", "onmouseout", "onmouseover", "onmouseup", "requiredExtensions", "requiredFeatures", "style", "systemLanguage", "transform", "xml:base", "xml:lang", "xml:space" ]),
            symbol: tt([ "class", "externalResourcesRequired", "id", "onactivate", "onclick", "onfocusin", "onfocusout", "onload", "onmousedown", "onmousemove", "onmouseout", "onmouseover", "onmouseup", "preserveAspectRatio", "style", "viewBox", "xml:base", "xml:lang", "xml:space" ]),
            text: tt([ "class", "dx", "dy", "externalResourcesRequired", "id", "lengthAdjust", "onactivate", "onclick", "onfocusin", "onfocusout", "onload", "onmousedown", "onmousemove", "onmouseout", "onmouseover", "onmouseup", "requiredExtensions", "requiredFeatures", "rotate", "style", "systemLanguage", "textLength", "transform", "x", "xml:base", "xml:lang", "xml:space", "y" ]),
            textPath: tt([ "class", "externalResourcesRequired", "id", "lengthAdjust", "method", "onactivate", "onclick", "onfocusin", "onfocusout", "onload", "onmousedown", "onmousemove", "onmouseout", "onmouseover", "onmouseup", "requiredExtensions", "requiredFeatures", "spacing", "startOffset", "style", "systemLanguage", "textLength", "xlink:arcrole", "xlink:href", "xlink:role", "xlink:title", "xlink:type", "xml:base", "xml:lang", "xml:space" ]),
            title: tt([ "class", "id", "style", "xml:base", "xml:lang", "xml:space" ]),
            tref: tt([ "class", "dx", "dy", "externalResourcesRequired", "id", "lengthAdjust", "onactivate", "onclick", "onfocusin", "onfocusout", "onload", "onmousedown", "onmousemove", "onmouseout", "onmouseover", "onmouseup", "requiredExtensions", "requiredFeatures", "rotate", "style", "systemLanguage", "textLength", "x", "xlink:arcrole", "xlink:href", "xlink:role", "xlink:title", "xlink:type", "xml:base", "xml:lang", "xml:space", "y" ]),
            tspan: tt([ "class", "dx", "dy", "externalResourcesRequired", "id", "lengthAdjust", "onactivate", "onclick", "onfocusin", "onfocusout", "onload", "onmousedown", "onmousemove", "onmouseout", "onmouseover", "onmouseup", "requiredExtensions", "requiredFeatures", "rotate", "style", "systemLanguage", "textLength", "x", "xml:base", "xml:lang", "xml:space", "y" ]),
            use: tt([ "class", "externalResourcesRequired", "height", "id", "onactivate", "onclick", "onfocusin", "onfocusout", "onload", "onmousedown", "onmousemove", "onmouseout", "onmouseover", "onmouseup", "requiredExtensions", "requiredFeatures", "style", "systemLanguage", "transform", "width", "x", "xlink:actuate", "xlink:arcrole", "xlink:href", "xlink:role", "xlink:show", "xlink:title", "xlink:type", "xml:base", "xml:lang", "xml:space", "y" ]),
            view: tt([ "externalResourcesRequired", "id", "preserveAspectRatio", "viewBox", "viewTarget", "xml:base", "xml:lang", "xml:space", "zoomAndPan" ]),
            vkern: tt([ "g1", "g2", "id", "k", "u1", "u2", "xml:base", "xml:lang", "xml:space" ])
        });
        this.F = tt([ "a", "altGlyph", "animate", "animateColor", "circle", "clipPath", "defs", "ellipse", "feBlend", "feColorMatrix", "feComponentTransfer", "feComposite", "feConvolveMatrix", "feDiffuseLighting", "feDisplacementMap", "feFlood", "feGaussianBlur", "feImage", "feMerge", "feMorphology", "feOffset", "feSpecularLighting", "feTile", "feTurbulence", "filter", "font", "foreignObject", "g", "glyph", "glyphRef", "image", "line", "linearGradient", "marker", "mask", "missing-glyph", "path", "pattern", "polygon", "polyline", "radialGradient", "rect", "stop", "svg", "switch", "symbol", "text", "textPath", "tref", "tspan", "use" ]);
        this.j = tt([ "alignment-baseline", "baseline-shift", "clip-path", "clip-rule", "clip", "color-interpolation-filters", "color-interpolation", "color-profile", "color-rendering", "color", "cursor", "direction", "display", "dominant-baseline", "enable-background", "fill-opacity", "fill-rule", "fill", "filter", "flood-color", "flood-opacity", "font-family", "font-size-adjust", "font-size", "font-stretch", "font-style", "font-variant", "font-weight", "glyph-orientation-horizontal", "glyph-orientation-vertical", "image-rendering", "kerning", "letter-spacing", "lighting-color", "marker-end", "marker-mid", "marker-start", "mask", "opacity", "overflow", "pointer-events", "shape-rendering", "stop-color", "stop-opacity", "stroke-dasharray", "stroke-dashoffset", "stroke-linecap", "stroke-linejoin", "stroke-miterlimit", "stroke-opacity", "stroke-width", "stroke", "text-anchor", "text-decoration", "text-rendering", "unicode-bidi", "visibility", "word-spacing", "writing-mode" ]);
        this.SVGElement = t.globalThis.SVGElement;
        const e = t.document.createElement("div");
        e.innerHTML = "<svg><altGlyph /></svg>";
        if ("altglyph" === e.firstElementChild.nodeName) {
            const t = this.M;
            let e = t.altGlyph;
            t.altGlyph = t.altglyph;
            t.altglyph = e;
            e = t.altGlyphDef;
            t.altGlyphDef = t.altglyphdef;
            t.altglyphdef = e;
            e = t.altGlyphItem;
            t.altGlyphItem = t.altglyphitem;
            t.altglyphitem = e;
            e = t.glyphRef;
            t.glyphRef = t.glyphref;
            t.glyphref = e;
        }
    }
    static register(t) {
        return q(Q, this).register(t);
    }
    isStandardSvgAttribute(t, e) {
        var i;
        if (!(t instanceof this.SVGElement)) return false;
        return true === this.F[t.nodeName] && true === this.j[e] || true === (null === (i = this.M[t.nodeName]) || void 0 === i ? void 0 : i[e]);
    }
}

SVGAnalyzer.inject = [ J ];

const et = e.DI.createInterface("IAttrMapper", (t => t.singleton(AttrMapper)));

class AttrMapper {
    constructor(t) {
        this.svg = t;
        this.fns = [];
        this.N = x();
        this.H = x();
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
        return [ Q ];
    }
    useMapping(t) {
        var e;
        var i;
        let s;
        let n;
        let r;
        let o;
        for (r in t) {
            s = t[r];
            n = null !== (e = (i = this.N)[r]) && void 0 !== e ? e : i[r] = x();
            for (o in s) {
                if (void 0 !== n[o]) throw st(o, r);
                n[o] = s[o];
            }
        }
    }
    useGlobalMapping(t) {
        const e = this.H;
        for (const i in t) {
            if (void 0 !== e[i]) throw st(i, "*");
            e[i] = t[i];
        }
    }
    useTwoWay(t) {
        this.fns.push(t);
    }
    isTwoWay(t, e) {
        return it(t, e) || this.fns.length > 0 && this.fns.some((i => i(t, e)));
    }
    map(t, e) {
        var i, s, n;
        return null !== (n = null !== (s = null === (i = this.N[t.nodeName]) || void 0 === i ? void 0 : i[e]) && void 0 !== s ? s : this.H[e]) && void 0 !== n ? n : b(t, e, this.svg) ? e : null;
    }
}

function it(t, e) {
    switch (t.nodeName) {
      case "INPUT":
        switch (t.type) {
          case "checkbox":
          case "radio":
            return "checked" === e;

          default:
            return "value" === e || "files" === e || "value-as-number" === e || "value-as-date" === e;
        }

      case "TEXTAREA":
      case "SELECT":
        return "value" === e;

      default:
        switch (e) {
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

function st(t, e) {
    return new Error(`Attribute ${t} has been already registered for ${"*" === e ? "all elements" : `<${e}/>`}`);
}

class CallBinding {
    constructor(t, e, i, s, n) {
        this.sourceExpression = t;
        this.target = e;
        this.targetProperty = i;
        this.locator = n;
        this.interceptor = this;
        this.isBound = false;
        this.targetObserver = s.getAccessor(e, i);
    }
    callSource(t) {
        const e = this.$scope.overrideContext;
        e.$event = t;
        const i = this.sourceExpression.evaluate(8, this.$scope, this.locator, null);
        Reflect.deleteProperty(e, "$event");
        return i;
    }
    $bind(t, e) {
        if (this.isBound) {
            if (this.$scope === e) return;
            this.interceptor.$unbind(2 | t);
        }
        this.$scope = e;
        if (this.sourceExpression.hasBind) this.sourceExpression.bind(t, e, this.interceptor);
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
    observe(t, e) {
        return;
    }
    handleChange(t, e, i) {
        return;
    }
}

class AttributeObserver {
    constructor(t, e, i) {
        this.type = 2 | 1 | 4;
        this.v = null;
        this.ov = null;
        this.W = false;
        this.f = 0;
        this.o = t;
        this.G = e;
        this.X = i;
    }
    getValue() {
        return this.v;
    }
    setValue(t, e) {
        this.v = t;
        this.W = t !== this.ov;
        if (0 === (32 & e)) this.K();
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
                    let e = this.v;
                    if (C(e) && e.includes("!important")) {
                        t = "important";
                        e = e.replace("!important", "");
                    }
                    this.o.style.setProperty(this.G, e, t);
                    break;
                }

              default:
                if (null == this.v) this.o.removeAttribute(this.X); else this.o.setAttribute(this.X, String(this.v));
            }
        }
    }
    handleMutation(t) {
        let e = false;
        for (let i = 0, s = t.length; s > i; ++i) {
            const s = t[i];
            if ("attributes" === s.type && s.attributeName === this.G) {
                e = true;
                break;
            }
        }
        if (e) {
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
            nt(this.o.ownerDocument.defaultView.MutationObserver, this.o, this);
        }
    }
    unsubscribe(t) {
        if (this.subs.remove(t) && 0 === this.subs.count) rt(this.o, this);
    }
    flush() {
        ht = this.ov;
        this.ov = this.v;
        this.subs.notify(this.v, ht, this.f);
    }
}

t.subscriberCollection(AttributeObserver);

t.withFlushQueue(AttributeObserver);

const nt = (t, e, i) => {
    if (void 0 === e.$eMObs) e.$eMObs = new Set;
    if (void 0 === e.$mObs) (e.$mObs = new t(ot)).observe(e, {
        attributes: true
    });
    e.$eMObs.add(i);
};

const rt = (t, e) => {
    const i = t.$eMObs;
    if (i && i.delete(e)) {
        if (0 === i.size) {
            t.$mObs.disconnect();
            t.$mObs = void 0;
        }
        return true;
    }
    return false;
};

const ot = t => {
    t[0].target.$eMObs.forEach(lt, t);
};

function lt(t) {
    t.handleMutation(this);
}

let ht;

class BindingTargetSubscriber {
    constructor(t) {
        this.b = t;
    }
    handleChange(t, e, i) {
        const s = this.b;
        if (t !== s.sourceExpression.evaluate(i, s.$scope, s.locator, null)) s.updateSource(t, i);
    }
}

const {oneTime: ct, toView: at, fromView: ut} = t.BindingMode;

const ft = at | ct;

const dt = {
    reusable: false,
    preempt: true
};

class AttributeBinding {
    constructor(t, e, i, s, n, r, o) {
        this.sourceExpression = t;
        this.targetAttribute = i;
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
        this.target = e;
        this.p = o.get(J);
        this.oL = r;
    }
    updateTarget(t, e) {
        e |= this.persistentFlags;
        this.targetObserver.setValue(t, e, this.target, this.targetProperty);
    }
    updateSource(t, e) {
        e |= this.persistentFlags;
        this.sourceExpression.assign(e, this.$scope, this.locator, t);
    }
    handleChange(t, e, i) {
        if (!this.isBound) return;
        i |= this.persistentFlags;
        const s = this.mode;
        const n = this.interceptor;
        const r = this.sourceExpression;
        const o = this.$scope;
        const l = this.locator;
        const h = this.targetObserver;
        const c = 0 === (2 & i) && (4 & h.type) > 0;
        let a = false;
        let u;
        if (10082 !== r.$kind || this.obs.count > 1) {
            a = 0 === (s & ct);
            if (a) this.obs.version++;
            t = r.evaluate(i, o, l, n);
            if (a) this.obs.clear();
        }
        if (t !== this.value) {
            this.value = t;
            if (c) {
                u = this.task;
                this.task = this.p.domWriteQueue.queueTask((() => {
                    this.task = null;
                    n.updateTarget(t, i);
                }), dt);
                null === u || void 0 === u ? void 0 : u.cancel();
            } else n.updateTarget(t, i);
        }
    }
    $bind(t, e) {
        var i;
        if (this.isBound) {
            if (this.$scope === e) return;
            this.interceptor.$unbind(2 | t);
        }
        this.persistentFlags = 33 & t;
        this.$scope = e;
        let s = this.sourceExpression;
        if (s.hasBind) s.bind(t, e, this.interceptor);
        let n = this.targetObserver;
        if (!n) n = this.targetObserver = new AttributeObserver(this.target, this.targetProperty, this.targetAttribute);
        s = this.sourceExpression;
        const r = this.mode;
        const o = this.interceptor;
        let l = false;
        if (r & ft) {
            l = (r & at) > 0;
            o.updateTarget(this.value = s.evaluate(t, e, this.locator, l ? o : null), t);
        }
        if (r & ut) n.subscribe(null !== (i = this.targetSubscriber) && void 0 !== i ? i : this.targetSubscriber = new BindingTargetSubscriber(o));
        this.isBound = true;
    }
    $unbind(t) {
        var e;
        if (!this.isBound) return;
        this.persistentFlags = 0;
        if (this.sourceExpression.hasUnbind) this.sourceExpression.unbind(t, this.$scope, this.interceptor);
        this.$scope = null;
        this.value = void 0;
        if (this.targetSubscriber) this.targetObserver.unsubscribe(this.targetSubscriber);
        null === (e = this.task) || void 0 === e ? void 0 : e.cancel();
        this.task = null;
        this.obs.clearAll();
        this.isBound = false;
    }
}

t.connectable(AttributeBinding);

const {toView: pt} = t.BindingMode;

const vt = {
    reusable: false,
    preempt: true
};

class InterpolationBinding {
    constructor(t, e, i, s, n, r, o) {
        this.interpolation = e;
        this.target = i;
        this.targetProperty = s;
        this.mode = n;
        this.locator = r;
        this.taskQueue = o;
        this.interceptor = this;
        this.isBound = false;
        this.$scope = void 0;
        this.task = null;
        this.oL = t;
        this.targetObserver = t.getAccessor(i, s);
        const l = e.expressions;
        const h = this.partBindings = Array(l.length);
        const c = l.length;
        let a = 0;
        for (;c > a; ++a) h[a] = new InterpolationPartBinding(l[a], i, s, r, t, this);
    }
    updateTarget(t, e) {
        const i = this.partBindings;
        const s = this.interpolation.parts;
        const n = i.length;
        let r = "";
        let o = 0;
        if (1 === n) r = s[0] + i[0].value + s[1]; else {
            r = s[0];
            for (;n > o; ++o) r += i[o].value + s[o + 1];
        }
        const l = this.targetObserver;
        const h = 0 === (2 & e) && (4 & l.type) > 0;
        let c;
        if (h) {
            c = this.task;
            this.task = this.taskQueue.queueTask((() => {
                this.task = null;
                l.setValue(r, e, this.target, this.targetProperty);
            }), vt);
            null === c || void 0 === c ? void 0 : c.cancel();
            c = null;
        } else l.setValue(r, e, this.target, this.targetProperty);
    }
    $bind(t, e) {
        if (this.isBound) {
            if (this.$scope === e) return;
            this.interceptor.$unbind(t);
        }
        this.isBound = true;
        this.$scope = e;
        const i = this.partBindings;
        const s = i.length;
        let n = 0;
        for (;s > n; ++n) i[n].$bind(t, e);
        this.updateTarget(void 0, t);
    }
    $unbind(t) {
        var e;
        if (!this.isBound) return;
        this.isBound = false;
        this.$scope = void 0;
        const i = this.partBindings;
        const s = i.length;
        let n = 0;
        for (;s > n; ++n) i[n].interceptor.$unbind(t);
        null === (e = this.task) || void 0 === e ? void 0 : e.cancel();
        this.task = null;
    }
}

class InterpolationPartBinding {
    constructor(e, i, s, n, r, o) {
        this.sourceExpression = e;
        this.target = i;
        this.targetProperty = s;
        this.locator = n;
        this.owner = o;
        this.interceptor = this;
        this.mode = t.BindingMode.toView;
        this.value = "";
        this.task = null;
        this.isBound = false;
        this.oL = r;
    }
    handleChange(t, e, i) {
        if (!this.isBound) return;
        const s = this.sourceExpression;
        const n = this.obs;
        const r = 10082 === s.$kind && 1 === n.count;
        let o = false;
        if (!r) {
            o = (this.mode & pt) > 0;
            if (o) n.version++;
            t = s.evaluate(i, this.$scope, this.locator, o ? this.interceptor : null);
            if (o) n.clear();
        }
        if (t != this.value) {
            this.value = t;
            if (t instanceof Array) this.observeCollection(t);
            this.owner.updateTarget(t, i);
        }
    }
    handleCollectionChange(t, e) {
        this.owner.updateTarget(void 0, e);
    }
    $bind(t, e) {
        if (this.isBound) {
            if (this.$scope === e) return;
            this.interceptor.$unbind(t);
        }
        this.isBound = true;
        this.$scope = e;
        if (this.sourceExpression.hasBind) this.sourceExpression.bind(t, e, this.interceptor);
        this.value = this.sourceExpression.evaluate(t, e, this.locator, (this.mode & pt) > 0 ? this.interceptor : null);
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

t.connectable(InterpolationPartBinding);

class ContentBinding {
    constructor(e, i, s, n, r, o) {
        this.sourceExpression = e;
        this.target = i;
        this.locator = s;
        this.p = r;
        this.strict = o;
        this.interceptor = this;
        this.mode = t.BindingMode.toView;
        this.value = "";
        this.task = null;
        this.isBound = false;
        this.oL = n;
    }
    updateTarget(t, e) {
        var i, s;
        const n = this.target;
        const r = this.p.Node;
        const o = this.value;
        this.value = t;
        if (o instanceof r) null === (i = o.parentNode) || void 0 === i ? void 0 : i.removeChild(o);
        if (t instanceof r) {
            n.textContent = "";
            null === (s = n.parentNode) || void 0 === s ? void 0 : s.insertBefore(t, n);
        } else n.textContent = String(t);
    }
    handleChange(t, e, i) {
        var s;
        if (!this.isBound) return;
        const n = this.sourceExpression;
        const r = this.obs;
        const o = 10082 === n.$kind && 1 === r.count;
        let l = false;
        if (!o) {
            l = (this.mode & pt) > 0;
            if (l) r.version++;
            i |= this.strict ? 1 : 0;
            t = n.evaluate(i, this.$scope, this.locator, l ? this.interceptor : null);
            if (l) r.clear();
        }
        if (t === this.value) {
            null === (s = this.task) || void 0 === s ? void 0 : s.cancel();
            this.task = null;
            return;
        }
        const h = 0 === (2 & i);
        if (h) this.queueUpdate(t, i); else this.updateTarget(t, i);
    }
    handleCollectionChange() {
        if (!this.isBound) return;
        this.obs.version++;
        const t = this.value = this.sourceExpression.evaluate(0, this.$scope, this.locator, (this.mode & pt) > 0 ? this.interceptor : null);
        this.obs.clear();
        if (t instanceof Array) this.observeCollection(t);
        this.queueUpdate(t, 0);
    }
    $bind(t, e) {
        if (this.isBound) {
            if (this.$scope === e) return;
            this.interceptor.$unbind(t);
        }
        this.isBound = true;
        this.$scope = e;
        if (this.sourceExpression.hasBind) this.sourceExpression.bind(t, e, this.interceptor);
        t |= this.strict ? 1 : 0;
        const i = this.value = this.sourceExpression.evaluate(t, e, this.locator, (this.mode & pt) > 0 ? this.interceptor : null);
        if (i instanceof Array) this.observeCollection(i);
        this.updateTarget(i, t);
    }
    $unbind(t) {
        var e;
        if (!this.isBound) return;
        this.isBound = false;
        if (this.sourceExpression.hasUnbind) this.sourceExpression.unbind(t, this.$scope, this.interceptor);
        this.$scope = void 0;
        this.obs.clearAll();
        null === (e = this.task) || void 0 === e ? void 0 : e.cancel();
        this.task = null;
    }
    queueUpdate(t, e) {
        const i = this.task;
        this.task = this.p.domWriteQueue.queueTask((() => {
            this.task = null;
            this.updateTarget(t, e);
        }), vt);
        null === i || void 0 === i ? void 0 : i.cancel();
    }
}

t.connectable(ContentBinding);

class LetBinding {
    constructor(t, e, i, s, n = false) {
        this.sourceExpression = t;
        this.targetProperty = e;
        this.locator = s;
        this.interceptor = this;
        this.isBound = false;
        this.$scope = void 0;
        this.task = null;
        this.target = null;
        this.oL = i;
        this.Y = n;
    }
    handleChange(t, e, i) {
        if (!this.isBound) return;
        const s = this.target;
        const n = this.targetProperty;
        const r = s[n];
        this.obs.version++;
        t = this.sourceExpression.evaluate(i, this.$scope, this.locator, this.interceptor);
        this.obs.clear();
        if (t !== r) s[n] = t;
    }
    handleCollectionChange(t, e) {
        if (!this.isBound) return;
        const i = this.target;
        const s = this.targetProperty;
        const n = i[s];
        this.obs.version++;
        const r = this.sourceExpression.evaluate(e, this.$scope, this.locator, this.interceptor);
        this.obs.clear();
        if (r !== n) i[s] = r;
    }
    $bind(t, e) {
        if (this.isBound) {
            if (this.$scope === e) return;
            this.interceptor.$unbind(2 | t);
        }
        this.$scope = e;
        this.target = this.Y ? e.bindingContext : e.overrideContext;
        const i = this.sourceExpression;
        if (i.hasBind) i.bind(t, e, this.interceptor);
        this.target[this.targetProperty] = this.sourceExpression.evaluate(2 | t, e, this.locator, this.interceptor);
        this.isBound = true;
    }
    $unbind(t) {
        if (!this.isBound) return;
        const e = this.sourceExpression;
        if (e.hasUnbind) e.unbind(t, this.$scope, this.interceptor);
        this.$scope = void 0;
        this.obs.clearAll();
        this.isBound = false;
    }
}

t.connectable(LetBinding);

const {oneTime: mt, toView: xt, fromView: gt} = t.BindingMode;

const wt = xt | mt;

const bt = {
    reusable: false,
    preempt: true
};

class PropertyBinding {
    constructor(t, e, i, s, n, r, o) {
        this.sourceExpression = t;
        this.target = e;
        this.targetProperty = i;
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
    updateTarget(t, e) {
        e |= this.persistentFlags;
        this.targetObserver.setValue(t, e, this.target, this.targetProperty);
    }
    updateSource(t, e) {
        e |= this.persistentFlags;
        this.sourceExpression.assign(e, this.$scope, this.locator, t);
    }
    handleChange(t, e, i) {
        if (!this.isBound) return;
        i |= this.persistentFlags;
        const s = 0 === (2 & i) && (4 & this.targetObserver.type) > 0;
        const n = this.obs;
        let r = false;
        if (10082 !== this.sourceExpression.$kind || n.count > 1) {
            r = this.mode > mt;
            if (r) n.version++;
            t = this.sourceExpression.evaluate(i, this.$scope, this.locator, this.interceptor);
            if (r) n.clear();
        }
        if (s) {
            yt = this.task;
            this.task = this.taskQueue.queueTask((() => {
                this.interceptor.updateTarget(t, i);
                this.task = null;
            }), bt);
            null === yt || void 0 === yt ? void 0 : yt.cancel();
            yt = null;
        } else this.interceptor.updateTarget(t, i);
    }
    handleCollectionChange(t, e) {
        if (!this.isBound) return;
        const i = 0 === (2 & e) && (4 & this.targetObserver.type) > 0;
        this.obs.version++;
        const s = this.sourceExpression.evaluate(e, this.$scope, this.locator, this.interceptor);
        this.obs.clear();
        if (i) {
            yt = this.task;
            this.task = this.taskQueue.queueTask((() => {
                this.interceptor.updateTarget(s, e);
                this.task = null;
            }), bt);
            null === yt || void 0 === yt ? void 0 : yt.cancel();
            yt = null;
        } else this.interceptor.updateTarget(s, e);
    }
    $bind(t, e) {
        var i;
        if (this.isBound) {
            if (this.$scope === e) return;
            this.interceptor.$unbind(2 | t);
        }
        t |= 1;
        this.persistentFlags = 33 & t;
        this.$scope = e;
        let s = this.sourceExpression;
        if (s.hasBind) s.bind(t, e, this.interceptor);
        const n = this.oL;
        const r = this.mode;
        let o = this.targetObserver;
        if (!o) {
            if (r & gt) o = n.getObserver(this.target, this.targetProperty); else o = n.getAccessor(this.target, this.targetProperty);
            this.targetObserver = o;
        }
        s = this.sourceExpression;
        const l = this.interceptor;
        const h = (r & xt) > 0;
        if (r & wt) l.updateTarget(s.evaluate(t, e, this.locator, h ? l : null), t);
        if (r & gt) {
            o.subscribe(null !== (i = this.targetSubscriber) && void 0 !== i ? i : this.targetSubscriber = new BindingTargetSubscriber(l));
            if (!h) l.updateSource(o.getValue(this.target, this.targetProperty), t);
        }
        this.isBound = true;
    }
    $unbind(t) {
        if (!this.isBound) return;
        this.persistentFlags = 0;
        if (this.sourceExpression.hasUnbind) this.sourceExpression.unbind(t, this.$scope, this.interceptor);
        this.$scope = void 0;
        yt = this.task;
        if (this.targetSubscriber) this.targetObserver.unsubscribe(this.targetSubscriber);
        if (null != yt) {
            yt.cancel();
            yt = this.task = null;
        }
        this.obs.clearAll();
        this.isBound = false;
    }
}

t.connectable(PropertyBinding);

let yt = null;

class RefBinding {
    constructor(t, e, i) {
        this.sourceExpression = t;
        this.target = e;
        this.locator = i;
        this.interceptor = this;
        this.isBound = false;
        this.$scope = void 0;
    }
    $bind(t, e) {
        if (this.isBound) {
            if (this.$scope === e) return;
            this.interceptor.$unbind(2 | t);
        }
        this.$scope = e;
        if (this.sourceExpression.hasBind) this.sourceExpression.bind(t, e, this);
        this.sourceExpression.assign(t, this.$scope, this.locator, this.target);
        this.isBound = true;
    }
    $unbind(t) {
        if (!this.isBound) return;
        let e = this.sourceExpression;
        if (e.evaluate(t, this.$scope, this.locator, null) === this.target) e.assign(t, this.$scope, this.locator, null);
        e = this.sourceExpression;
        if (e.hasUnbind) e.unbind(t, this.$scope, this.interceptor);
        this.$scope = void 0;
        this.isBound = false;
    }
    observe(t, e) {
        return;
    }
    handleChange(t, e, i) {
        return;
    }
}

const kt = e.DI.createInterface("IAppTask");

class $AppTask {
    constructor(t, e, i) {
        this.c = void 0;
        this.slot = t;
        this.k = e;
        this.cb = i;
    }
    register(t) {
        return this.c = t.register(_(kt, this));
    }
    run() {
        const t = this.k;
        const e = this.cb;
        return null === t ? e() : e(this.c.get(t));
    }
}

const Ct = Object.freeze({
    creating: At("creating"),
    hydrating: At("hydrating"),
    hydrated: At("hydrated"),
    activating: At("activating"),
    activated: At("activated"),
    deactivating: At("deactivating"),
    deactivated: At("deactivated")
});

function At(t) {
    function e(e, i) {
        if (k(i)) return new $AppTask(t, e, i);
        return new $AppTask(t, null, e);
    }
    return e;
}

function Rt(t, e) {
    let i;
    function s(t, e) {
        if (arguments.length > 1) i.property = e;
        c(Et, ChildrenDefinition.create(e, i), t.constructor, e);
        v(t.constructor, Bt.keyFrom(e));
    }
    if (arguments.length > 1) {
        i = {};
        s(t, e);
        return;
    } else if (C(t)) {
        i = {};
        return s;
    }
    i = void 0 === t ? {} : t;
    return s;
}

function St(t) {
    return t.startsWith(Et);
}

const Et = f("children-observer");

const Bt = Object.freeze({
    name: Et,
    keyFrom: t => `${Et}:${t}`,
    from(...t) {
        const e = {};
        const i = Array.isArray;
        function s(t) {
            e[t] = ChildrenDefinition.create(t);
        }
        function n(t, i) {
            e[t] = ChildrenDefinition.create(t, i);
        }
        function r(t) {
            if (i(t)) t.forEach(s); else if (t instanceof ChildrenDefinition) e[t.property] = t; else if (void 0 !== t) Object.keys(t).forEach((e => n(e, t)));
        }
        t.forEach(r);
        return e;
    },
    getAll(t) {
        const i = Et.length + 1;
        const s = [];
        const n = e.getPrototypeChain(t);
        let r = n.length;
        let o = 0;
        let h;
        let c;
        let a;
        while (--r >= 0) {
            a = n[r];
            h = m(a).filter(St);
            c = h.length;
            for (let t = 0; t < c; ++t) s[o++] = l(Et, a, h[t].slice(i));
        }
        return s;
    }
});

const It = {
    childList: true
};

class ChildrenDefinition {
    constructor(t, e, i, s, n, r) {
        this.callback = t;
        this.property = e;
        this.options = i;
        this.query = s;
        this.filter = n;
        this.map = r;
    }
    static create(t, i = {}) {
        var s;
        return new ChildrenDefinition(e.firstDefined(i.callback, `${t}Changed`), e.firstDefined(i.property, t), null !== (s = i.options) && void 0 !== s ? s : It, i.query, i.filter, i.map);
    }
}

class ChildrenObserver {
    constructor(t, e, i, s, n = Tt, r = Dt, o = $t, l) {
        this.controller = t;
        this.obj = e;
        this.propertyKey = i;
        this.query = n;
        this.filter = r;
        this.map = o;
        this.options = l;
        this.observing = false;
        this.children = void 0;
        this.observer = void 0;
        this.callback = e[s];
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
            this.children = e.emptyArray;
        }
    }
    Z() {
        this.children = this.get();
        if (void 0 !== this.callback) this.callback.call(this.obj);
        this.subs.notify(this.children, void 0, 0);
    }
    get() {
        return Ot(this.controller, this.query, this.filter, this.map);
    }
}

t.subscriberCollection()(ChildrenObserver);

function Tt(t) {
    return t.host.childNodes;
}

function Dt(t, e, i) {
    return !!i;
}

function $t(t, e, i) {
    return i;
}

const Pt = {
    optional: true
};

function Ot(t, e, i, s) {
    var n;
    const r = e(t);
    const o = r.length;
    const l = [];
    let h;
    let c;
    let a;
    let u = 0;
    for (;u < o; ++u) {
        h = r[u];
        c = de(h, Pt);
        a = null !== (n = null === c || void 0 === c ? void 0 : c.viewModel) && void 0 !== n ? n : null;
        if (i(h, c, a)) l.push(s(h, c, a));
    }
    return l;
}

function Lt(t) {
    return function(e) {
        return jt(t, e);
    };
}

function qt(t) {
    return function(e) {
        return jt(C(t) ? {
            isTemplateController: true,
            name: t
        } : {
            isTemplateController: true,
            ...t
        }, e);
    };
}

class CustomAttributeDefinition {
    constructor(t, e, i, s, n, r, o, l, h, c) {
        this.Type = t;
        this.name = e;
        this.aliases = i;
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
    static create(i, s) {
        let n;
        let r;
        if (C(i)) {
            n = i;
            r = {
                name: n
            };
        } else {
            n = i.name;
            r = i;
        }
        return new CustomAttributeDefinition(s, e.firstDefined(Vt(s, "name"), n), e.mergeArrays(Vt(s, "aliases"), r.aliases, s.aliases), _t(n), e.firstDefined(Vt(s, "defaultBindingMode"), r.defaultBindingMode, s.defaultBindingMode, t.BindingMode.toView), e.firstDefined(Vt(s, "isTemplateController"), r.isTemplateController, s.isTemplateController, false), I.from(s, ...I.getAll(s), Vt(s, "bindables"), s.bindables, r.bindables), e.firstDefined(Vt(s, "noMultiBindings"), r.noMultiBindings, s.noMultiBindings, false), e.mergeArrays(Xt.getAnnotation(s), s.watches), e.mergeArrays(Vt(s, "dependencies"), r.dependencies, s.dependencies));
    }
    register(e) {
        const {Type: i, key: s, aliases: n} = this;
        M(s, i).register(e);
        U(s, i).register(e);
        t.registerAliases(n, Ht, s, e);
    }
}

const Ut = d("custom-attribute");

const _t = t => `${Ut}:${t}`;

const Vt = (t, e) => l(f(e), t);

const Mt = t => k(t) && h(Ut, t);

const Ft = (t, e) => {
    var i;
    return null !== (i = Si(t, _t(e))) && void 0 !== i ? i : void 0;
};

const jt = (t, e) => {
    const i = CustomAttributeDefinition.create(t, e);
    c(Ut, i, i.Type);
    c(Ut, i, i);
    p(e, Ut);
    return i.Type;
};

const Nt = t => {
    const e = l(Ut, t);
    if (void 0 === e) throw new Error(`AUR0759:${t.name}`);
    return e;
};

const Ht = Object.freeze({
    name: Ut,
    keyFrom: _t,
    isType: Mt,
    for: Ft,
    define: jt,
    getDefinition: Nt,
    annotate(t, e, i) {
        c(f(e), i, t);
    },
    getAnnotation: Vt
});

function Wt(t, e) {
    if (null == t) throw new Error(`AUR0772`);
    return function i(s, n, r) {
        const o = null == n;
        const l = o ? s : s.constructor;
        const h = new WatchDefinition(t, o ? e : r.value);
        if (o) {
            if (!k(e) && (null == e || !(e in l.prototype))) throw new Error(`AUR0773:${String(e)}@${l.name}}`);
        } else if (!k(null === r || void 0 === r ? void 0 : r.value)) throw new Error(`AUR0774:${String(n)}`);
        Xt.add(l, h);
        if (Mt(l)) Nt(l).watches.push(h);
        if (fe(l)) ve(l).watches.push(h);
    };
}

class WatchDefinition {
    constructor(t, e) {
        this.expression = t;
        this.callback = e;
    }
}

const zt = e.emptyArray;

const Gt = f("watch");

const Xt = Object.freeze({
    name: Gt,
    add(t, e) {
        let i = l(Gt, t);
        if (null == i) c(Gt, i = [], t);
        i.push(e);
    },
    getAnnotation(t) {
        var e;
        return null !== (e = l(Gt, t)) && void 0 !== e ? e : zt;
    }
});

function Kt(t) {
    return function(e) {
        return ue(t, e);
    };
}

function Yt(t) {
    if (void 0 === t) return function(t) {
        ae(t, "shadowOptions", {
            mode: "open"
        });
    };
    if (!k(t)) return function(e) {
        ae(e, "shadowOptions", t);
    };
    ae(t, "shadowOptions", {
        mode: "open"
    });
}

function Zt(t) {
    if (void 0 === t) return function(t) {
        Jt(t);
    };
    Jt(t);
}

function Jt(t) {
    const e = l(le, t);
    if (void 0 === e) {
        ae(t, "containerless", true);
        return;
    }
    e.containerless = true;
}

function Qt(t) {
    if (void 0 === t) return function(t) {
        ae(t, "isStrictBinding", true);
    };
    ae(t, "isStrictBinding", true);
}

const te = new WeakMap;

class CustomElementDefinition {
    constructor(t, e, i, s, n, r, o, l, h, c, a, u, f, d, p, v, m, x, g, w, b) {
        this.Type = t;
        this.name = e;
        this.aliases = i;
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
        this.containerless = p;
        this.isStrictBinding = v;
        this.shadowOptions = m;
        this.hasSlots = x;
        this.enhance = g;
        this.watches = w;
        this.processContent = b;
    }
    get type() {
        return 1;
    }
    static create(t, i = null) {
        if (null === i) {
            const s = t;
            if (C(s)) throw new Error(`AUR0761:${t}`);
            const n = e.fromDefinitionOrDefault("name", s, ce);
            if (k(s.Type)) i = s.Type; else i = xe(e.pascalCase(n));
            return new CustomElementDefinition(i, n, e.mergeArrays(s.aliases), e.fromDefinitionOrDefault("key", s, (() => he(n))), e.fromDefinitionOrDefault("cache", s, ie), e.fromDefinitionOrDefault("capture", s, ne), e.fromDefinitionOrDefault("template", s, se), e.mergeArrays(s.instructions), e.mergeArrays(s.dependencies), e.fromDefinitionOrDefault("injectable", s, se), e.fromDefinitionOrDefault("needsCompile", s, re), e.mergeArrays(s.surrogates), I.from(i, s.bindables), Bt.from(s.childrenObservers), e.fromDefinitionOrDefault("containerless", s, ne), e.fromDefinitionOrDefault("isStrictBinding", s, ne), e.fromDefinitionOrDefault("shadowOptions", s, se), e.fromDefinitionOrDefault("hasSlots", s, ne), e.fromDefinitionOrDefault("enhance", s, ne), e.fromDefinitionOrDefault("watches", s, oe), e.fromAnnotationOrTypeOrDefault("processContent", i, se));
        }
        if (C(t)) return new CustomElementDefinition(i, t, e.mergeArrays(pe(i, "aliases"), i.aliases), he(t), e.fromAnnotationOrTypeOrDefault("cache", i, ie), e.fromAnnotationOrTypeOrDefault("capture", i, ne), e.fromAnnotationOrTypeOrDefault("template", i, se), e.mergeArrays(pe(i, "instructions"), i.instructions), e.mergeArrays(pe(i, "dependencies"), i.dependencies), e.fromAnnotationOrTypeOrDefault("injectable", i, se), e.fromAnnotationOrTypeOrDefault("needsCompile", i, re), e.mergeArrays(pe(i, "surrogates"), i.surrogates), I.from(i, ...I.getAll(i), pe(i, "bindables"), i.bindables), Bt.from(...Bt.getAll(i), pe(i, "childrenObservers"), i.childrenObservers), e.fromAnnotationOrTypeOrDefault("containerless", i, ne), e.fromAnnotationOrTypeOrDefault("isStrictBinding", i, ne), e.fromAnnotationOrTypeOrDefault("shadowOptions", i, se), e.fromAnnotationOrTypeOrDefault("hasSlots", i, ne), e.fromAnnotationOrTypeOrDefault("enhance", i, ne), e.mergeArrays(Xt.getAnnotation(i), i.watches), e.fromAnnotationOrTypeOrDefault("processContent", i, se));
        const s = e.fromDefinitionOrDefault("name", t, ce);
        return new CustomElementDefinition(i, s, e.mergeArrays(pe(i, "aliases"), t.aliases, i.aliases), he(s), e.fromAnnotationOrDefinitionOrTypeOrDefault("cache", t, i, ie), e.fromAnnotationOrDefinitionOrTypeOrDefault("capture", t, i, ne), e.fromAnnotationOrDefinitionOrTypeOrDefault("template", t, i, se), e.mergeArrays(pe(i, "instructions"), t.instructions, i.instructions), e.mergeArrays(pe(i, "dependencies"), t.dependencies, i.dependencies), e.fromAnnotationOrDefinitionOrTypeOrDefault("injectable", t, i, se), e.fromAnnotationOrDefinitionOrTypeOrDefault("needsCompile", t, i, re), e.mergeArrays(pe(i, "surrogates"), t.surrogates, i.surrogates), I.from(i, ...I.getAll(i), pe(i, "bindables"), i.bindables, t.bindables), Bt.from(...Bt.getAll(i), pe(i, "childrenObservers"), i.childrenObservers, t.childrenObservers), e.fromAnnotationOrDefinitionOrTypeOrDefault("containerless", t, i, ne), e.fromAnnotationOrDefinitionOrTypeOrDefault("isStrictBinding", t, i, ne), e.fromAnnotationOrDefinitionOrTypeOrDefault("shadowOptions", t, i, se), e.fromAnnotationOrDefinitionOrTypeOrDefault("hasSlots", t, i, ne), e.fromAnnotationOrDefinitionOrTypeOrDefault("enhance", t, i, ne), e.mergeArrays(t.watches, Xt.getAnnotation(i), i.watches), e.fromAnnotationOrDefinitionOrTypeOrDefault("processContent", t, i, se));
    }
    static getOrCreate(t) {
        if (t instanceof CustomElementDefinition) return t;
        if (te.has(t)) return te.get(t);
        const e = CustomElementDefinition.create(t);
        te.set(t, e);
        c(le, e, e.Type);
        return e;
    }
    register(e) {
        const {Type: i, key: s, aliases: n} = this;
        if (!e.has(s, false)) {
            M(s, i).register(e);
            U(s, i).register(e);
            t.registerAliases(n, ge, s, e);
        }
    }
}

const ee = {
    name: void 0,
    searchParents: false,
    optional: false
};

const ie = () => 0;

const se = () => null;

const ne = () => false;

const re = () => true;

const oe = () => e.emptyArray;

const le = d("custom-element");

const he = t => `${le}:${t}`;

const ce = (() => {
    let t = 0;
    return () => `unnamed-${++t}`;
})();

const ae = (t, e, i) => {
    c(f(e), i, t);
};

const ue = (t, e) => {
    const i = CustomElementDefinition.create(t, e);
    c(le, i, i.Type);
    c(le, i, i);
    p(i.Type, le);
    return i.Type;
};

const fe = t => k(t) && h(le, t);

const de = (t, e = ee) => {
    if (void 0 === e.name && true !== e.searchParents) {
        const i = Si(t, le);
        if (null === i) {
            if (true === e.optional) return null;
            throw new Error(`AUR0762`);
        }
        return i;
    }
    if (void 0 !== e.name) {
        if (true !== e.searchParents) {
            const i = Si(t, le);
            if (null === i) throw new Error(`AUR0763`);
            if (i.is(e.name)) return i;
            return;
        }
        let i = t;
        let s = false;
        while (null !== i) {
            const t = Si(i, le);
            if (null !== t) {
                s = true;
                if (t.is(e.name)) return t;
            }
            i = $i(i);
        }
        if (s) return;
        throw new Error(`AUR0764`);
    }
    let i = t;
    while (null !== i) {
        const t = Si(i, le);
        if (null !== t) return t;
        i = $i(i);
    }
    throw new Error(`AUR0765`);
};

const pe = (t, e) => l(f(e), t);

const ve = t => {
    const e = l(le, t);
    if (void 0 === e) throw new Error(`AUR0760:${t.name}`);
    return e;
};

const me = () => {
    const t = function(i, s, n) {
        const r = e.DI.getOrCreateAnnotationParamTypes(i);
        r[n] = t;
        return i;
    };
    t.register = function(e) {
        return {
            resolve(e, i) {
                if (i.has(t, true)) return i.get(t); else return null;
            }
        };
    };
    return t;
};

const xe = function() {
    const t = {
        value: "",
        writable: false,
        enumerable: false,
        configurable: true
    };
    const e = {};
    return function(i, s = e) {
        const n = class {};
        t.value = i;
        Reflect.defineProperty(n, "name", t);
        if (s !== e) Object.assign(n.prototype, s);
        return n;
    };
}();

const ge = Object.freeze({
    name: le,
    keyFrom: he,
    isType: fe,
    for: de,
    define: ue,
    getDefinition: ve,
    annotate: ae,
    getAnnotation: pe,
    generateName: ce,
    createInjectable: me,
    generateType: xe
});

const we = f("processContent");

function be(t) {
    return void 0 === t ? function(t, e, i) {
        c(we, ye(t, e), t);
    } : function(e) {
        t = ye(e, t);
        const i = l(le, e);
        if (void 0 !== i) i.processContent = t; else c(we, t, e);
        return e;
    };
}

function ye(t, e) {
    if (C(e)) e = t[e];
    if (!k(e)) throw new Error(`AUR0766:${typeof e}`);
    return e;
}

function ke(t) {
    return function(e) {
        const i = k(t) ? t : true;
        ae(e, "capture", i);
        if (fe(e)) ve(e).capture = i;
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
    setValue(t, e) {
        this.value = t;
        this.W = t !== this.ov;
        if (0 === (32 & e)) this.K();
    }
    K() {
        if (this.W) {
            this.W = false;
            const t = this.value;
            const e = this.J;
            const i = Ce(t);
            let s = this.tt;
            this.ov = t;
            if (i.length > 0) this.et(i);
            this.tt += 1;
            if (0 === s) return;
            s -= 1;
            for (const t in e) {
                if (!g.call(e, t) || e[t] !== s) continue;
                this.obj.classList.remove(t);
            }
        }
    }
    et(t) {
        const e = this.obj;
        const i = t.length;
        let s = 0;
        let n;
        for (;s < i; s++) {
            n = t[s];
            if (0 === n.length) continue;
            this.J[n] = this.tt;
            e.classList.add(n);
        }
    }
}

function Ce(t) {
    if (C(t)) return Ae(t);
    if ("object" !== typeof t) return e.emptyArray;
    if (t instanceof Array) {
        const i = t.length;
        if (i > 0) {
            const e = [];
            let s = 0;
            for (;i > s; ++s) e.push(...Ce(t[s]));
            return e;
        } else return e.emptyArray;
    }
    const i = [];
    let s;
    for (s in t) if (Boolean(t[s])) if (s.includes(" ")) i.push(...Ae(s)); else i.push(s);
    return i;
}

function Ae(t) {
    const i = t.match(/\S+/g);
    if (null === i) return e.emptyArray;
    return i;
}

function Re(...t) {
    return new CSSModulesProcessorRegistry(t);
}

class CSSModulesProcessorRegistry {
    constructor(t) {
        this.modules = t;
    }
    register(t) {
        var e;
        const i = Object.assign({}, ...this.modules);
        const s = jt({
            name: "class",
            bindables: [ "value" ],
            noMultiBindings: true
        }, (e = class CustomAttributeClass {
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
                this.element.className = Ce(this.value).map((t => i[t] || t)).join(" ");
            }
        }, e.inject = [ Bi ], e));
        t.register(s);
    }
}

function Se(...t) {
    return new ShadowDOMRegistry(t);
}

const Ee = e.DI.createInterface("IShadowDOMStyleFactory", (t => t.cachedCallback((t => {
    if (AdoptedStyleSheetsStyles.supported(t.get(J))) return t.get(AdoptedStyleSheetsStylesFactory);
    return t.get(StyleElementStylesFactory);
}))));

class ShadowDOMRegistry {
    constructor(t) {
        this.css = t;
    }
    register(t) {
        const e = t.get(Ie);
        const i = t.get(Ee);
        t.register(_(Be, i.createStyles(this.css, e)));
    }
}

class AdoptedStyleSheetsStylesFactory {
    constructor(t) {
        this.p = t;
        this.cache = new Map;
    }
    createStyles(t, e) {
        return new AdoptedStyleSheetsStyles(this.p, t, this.cache, e);
    }
}

AdoptedStyleSheetsStylesFactory.inject = [ J ];

class StyleElementStylesFactory {
    constructor(t) {
        this.p = t;
    }
    createStyles(t, e) {
        return new StyleElementStyles(this.p, t, e);
    }
}

StyleElementStylesFactory.inject = [ J ];

const Be = e.DI.createInterface("IShadowDOMStyles");

const Ie = e.DI.createInterface("IShadowDOMGlobalStyles", (t => t.instance({
    applyTo: e.noop
})));

class AdoptedStyleSheetsStyles {
    constructor(t, e, i, s = null) {
        this.sharedStyles = s;
        this.styleSheets = e.map((e => {
            let s;
            if (e instanceof t.CSSStyleSheet) s = e; else {
                s = i.get(e);
                if (void 0 === s) {
                    s = new t.CSSStyleSheet;
                    s.replaceSync(e);
                    i.set(e, s);
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
    constructor(t, e, i = null) {
        this.p = t;
        this.localStyles = e;
        this.sharedStyles = i;
    }
    applyTo(t) {
        const e = this.localStyles;
        const i = this.p;
        for (let s = e.length - 1; s > -1; --s) {
            const n = i.document.createElement("style");
            n.innerHTML = e[s];
            t.prepend(n);
        }
        if (null !== this.sharedStyles) this.sharedStyles.applyTo(t);
    }
}

const Te = {
    shadowDOM(t) {
        return Ct.creating(e.IContainer, (e => {
            if (null != t.sharedStyles) {
                const i = e.get(Ee);
                e.register(_(Ie, i.createStyles(t.sharedStyles, null)));
            }
        }));
    }
};

const {enter: De, exit: $e} = t.ConnectableSwitcher;

const {wrap: Pe, unwrap: Oe} = t.ProxyObservable;

class ComputedWatcher {
    constructor(t, e, i, s, n) {
        this.obj = t;
        this.get = i;
        this.cb = s;
        this.useProxy = n;
        this.interceptor = this;
        this.value = void 0;
        this.isBound = false;
        this.running = false;
        this.oL = e;
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
        const e = this.value;
        const i = this.compute();
        if (!Object.is(i, e)) this.cb.call(t, i, e, t);
    }
    compute() {
        this.running = true;
        this.obs.version++;
        try {
            De(this);
            return this.value = Oe(this.get.call(void 0, this.useProxy ? Pe(this.obj) : this.obj, this));
        } finally {
            this.obs.clear();
            this.running = false;
            $e(this);
        }
    }
}

class ExpressionWatcher {
    constructor(t, e, i, s, n) {
        this.scope = t;
        this.locator = e;
        this.oL = i;
        this.expression = s;
        this.callback = n;
        this.interceptor = this;
        this.isBound = false;
        this.obj = t.bindingContext;
    }
    handleChange(t) {
        const e = this.expression;
        const i = this.obj;
        const s = this.value;
        const n = 10082 === e.$kind && 1 === this.obs.count;
        if (!n) {
            this.obs.version++;
            t = e.evaluate(0, this.scope, this.locator, this);
            this.obs.clear();
        }
        if (!Object.is(t, s)) {
            this.value = t;
            this.callback.call(i, t, s, i);
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

t.connectable(ComputedWatcher);

t.connectable(ExpressionWatcher);

const Le = e.DI.createInterface("ILifecycleHooks");

class LifecycleHooksEntry {
    constructor(t, e) {
        this.definition = t;
        this.instance = e;
    }
}

class LifecycleHooksDefinition {
    constructor(t, e) {
        this.Type = t;
        this.propertyNames = e;
    }
    static create(t, e) {
        const i = new Set;
        let s = e.prototype;
        while (s !== Object.prototype) {
            for (const t of Object.getOwnPropertyNames(s)) if ("constructor" !== t) i.add(t);
            s = Object.getPrototypeOf(s);
        }
        return new LifecycleHooksDefinition(e, i);
    }
    register(t) {
        q(Le, this.Type).register(t);
    }
}

const qe = new WeakMap;

const Ue = f("lifecycle-hooks");

const _e = Object.freeze({
    name: Ue,
    define(t, e) {
        const i = LifecycleHooksDefinition.create(t, e);
        c(Ue, i, e);
        p(e, Ue);
        return i.Type;
    },
    resolve(t) {
        let e = qe.get(t);
        if (void 0 === e) {
            qe.set(t, e = new LifecycleHooksLookupImpl);
            const i = t.root;
            const s = i.id === t.id ? t.getAll(Le) : t.has(Le, false) ? i.getAll(Le).concat(t.getAll(Le)) : i.getAll(Le);
            let n;
            let r;
            let o;
            let h;
            let c;
            for (n of s) {
                r = l(Ue, n.constructor);
                o = new LifecycleHooksEntry(r, n);
                for (h of r.propertyNames) {
                    c = e[h];
                    if (void 0 === c) e[h] = [ o ]; else c.push(o);
                }
            }
        }
        return e;
    }
});

class LifecycleHooksLookupImpl {}

function Ve() {
    return function t(e) {
        return _e.define({}, e);
    };
}

const Me = e.DI.createInterface("IViewFactory");

class ViewFactory {
    constructor(t, e) {
        this.isCaching = false;
        this.cache = null;
        this.cacheSize = -1;
        this.name = e.name;
        this.container = t;
        this.def = e;
    }
    setCacheSize(t, e) {
        if (t) {
            if ("*" === t) t = ViewFactory.maxCacheSize; else if (C(t)) t = parseInt(t, 10);
            if (-1 === this.cacheSize || !e) this.cacheSize = t;
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
        const e = this.cache;
        let i;
        if (null != e && e.length > 0) {
            i = e.pop();
            return i;
        }
        i = Controller.$view(this, t);
        return i;
    }
}

ViewFactory.maxCacheSize = 65535;

const Fe = new WeakSet;

function je(t) {
    return !Fe.has(t);
}

function Ne(t) {
    Fe.add(t);
    return CustomElementDefinition.create(t);
}

const He = d("views");

const We = Object.freeze({
    name: He,
    has(t) {
        return k(t) && (h(He, t) || "$views" in t);
    },
    get(t) {
        if (k(t) && "$views" in t) {
            const e = t.$views;
            const i = e.filter(je).map(Ne);
            for (const e of i) We.add(t, e);
        }
        let e = l(He, t);
        if (void 0 === e) c(He, e = [], t);
        return e;
    },
    add(t, e) {
        const i = CustomElementDefinition.create(e);
        let s = l(He, t);
        if (void 0 === s) c(He, s = [ i ], t); else s.push(i);
        return s;
    }
});

function ze(t) {
    return function(e) {
        We.add(e, t);
    };
}

const Ge = e.DI.createInterface("IViewLocator", (t => t.singleton(ViewLocator)));

class ViewLocator {
    constructor() {
        this.it = new WeakMap;
        this.st = new Map;
    }
    getViewComponentForObject(t, e) {
        if (t) {
            const i = We.has(t.constructor) ? We.get(t.constructor) : [];
            const s = k(e) ? e(t, i) : this.nt(i, e);
            return this.rt(t, i, s);
        }
        return null;
    }
    rt(t, e, i) {
        let s = this.it.get(t);
        let n;
        if (void 0 === s) {
            s = {};
            this.it.set(t, s);
        } else n = s[i];
        if (void 0 === n) {
            const r = this.ot(t, e, i);
            n = ue(ve(r), class extends r {
                constructor() {
                    super(t);
                }
            });
            s[i] = n;
        }
        return n;
    }
    ot(e, i, s) {
        let n = this.st.get(e.constructor);
        let r;
        if (void 0 === n) {
            n = {};
            this.st.set(e.constructor, n);
        } else r = n[s];
        if (void 0 === r) {
            r = ue(this.lt(i, s), class {
                constructor(t) {
                    this.viewModel = t;
                }
                define(e, i, s) {
                    const n = this.viewModel;
                    e.scope = t.Scope.fromParent(e.scope, n);
                    if (void 0 !== n.define) return n.define(e, i, s);
                }
            });
            const o = r.prototype;
            if ("hydrating" in e) o.hydrating = function t(e) {
                this.viewModel.hydrating(e);
            };
            if ("hydrated" in e) o.hydrated = function t(e) {
                this.viewModel.hydrated(e);
            };
            if ("created" in e) o.created = function t(e) {
                this.viewModel.created(e);
            };
            if ("binding" in e) o.binding = function t(e, i, s) {
                return this.viewModel.binding(e, i, s);
            };
            if ("bound" in e) o.bound = function t(e, i, s) {
                return this.viewModel.bound(e, i, s);
            };
            if ("attaching" in e) o.attaching = function t(e, i, s) {
                return this.viewModel.attaching(e, i, s);
            };
            if ("attached" in e) o.attached = function t(e, i) {
                return this.viewModel.attached(e, i);
            };
            if ("detaching" in e) o.detaching = function t(e, i, s) {
                return this.viewModel.detaching(e, i, s);
            };
            if ("unbinding" in e) o.unbinding = function t(e, i, s) {
                return this.viewModel.unbinding(e, i, s);
            };
            if ("dispose" in e) o.dispose = function t() {
                this.viewModel.dispose();
            };
            n[s] = r;
        }
        return r;
    }
    nt(t, e) {
        if (e) return e;
        if (1 === t.length) return t[0].name;
        return "default-view";
    }
    lt(t, e) {
        const i = t.find((t => t.name === e));
        if (void 0 === i) throw new Error(`Could not find view: ${e}`);
        return i;
    }
}

const Xe = e.DI.createInterface("IRendering", (t => t.singleton(Rendering)));

class Rendering {
    constructor(t) {
        this.ht = new WeakMap;
        this.ct = new WeakMap;
        this.ut = (this.ft = t.root).get(J);
        this.dt = new FragmentNodeSequence(this.ut, this.ut.document.createDocumentFragment());
    }
    get renderers() {
        return null == this.rs ? this.rs = this.ft.getAll(Gi, false).reduce(((t, e) => {
            t[e.target] = e;
            return t;
        }), x()) : this.rs;
    }
    compile(t, e, i) {
        if (false !== t.needsCompile) {
            const s = this.ht;
            const n = e.get(zi);
            let r = s.get(t);
            if (null == r) s.set(t, r = n.compile(t, e, i)); else e.register(...r.dependencies);
            return r;
        }
        return t;
    }
    getViewFactory(t, e) {
        return new ViewFactory(e, CustomElementDefinition.getOrCreate(t));
    }
    createNodes(t) {
        if (true === t.enhance) return new FragmentNodeSequence(this.ut, t.template);
        let e;
        const i = this.ct;
        if (i.has(t)) e = i.get(t); else {
            const s = this.ut;
            const n = s.document;
            const r = t.template;
            let o;
            if (null === r) e = null; else if (r instanceof s.Node) if ("TEMPLATE" === r.nodeName) e = n.adoptNode(r.content); else (e = n.adoptNode(n.createDocumentFragment())).appendChild(r.cloneNode(true)); else {
                o = n.createElement("template");
                if (C(r)) o.innerHTML = r;
                n.adoptNode(e = o.content);
            }
            i.set(t, e);
        }
        return null == e ? this.dt : new FragmentNodeSequence(this.ut, e.cloneNode(true));
    }
    render(t, e, i, s) {
        const n = i.instructions;
        const r = this.renderers;
        const o = e.length;
        if (e.length !== n.length) throw new Error(`AUR0757:${o}<>${n.length}`);
        let l = 0;
        let h = 0;
        let c = 0;
        let a;
        let u;
        let f;
        if (o > 0) while (o > l) {
            a = n[l];
            f = e[l];
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
            a = i.surrogates;
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

Rendering.inject = [ e.IContainer ];

var Ke;

(function(t) {
    t[t["none"] = 0] = "none";
    t[t["host"] = 1] = "host";
    t[t["shadowRoot"] = 2] = "shadowRoot";
    t[t["location"] = 3] = "location";
})(Ke || (Ke = {}));

const Ye = {
    optional: true
};

const Ze = new WeakMap;

class Controller {
    constructor(t, i, s, n, r, o, l) {
        this.container = t;
        this.vmKind = i;
        this.definition = s;
        this.viewFactory = n;
        this.viewModel = r;
        this.host = o;
        this.id = e.nextId("au$component");
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
        this.xt = e.emptyArray;
        this.flags = 0;
        this.$initiator = null;
        this.$flags = 0;
        this.$resolve = void 0;
        this.$reject = void 0;
        this.$promise = void 0;
        this.gt = 0;
        this.wt = 0;
        this.bt = 0;
        this.location = l;
        this.r = t.root.get(Xe);
        switch (i) {
          case 1:
          case 0:
            this.hooks = new HooksDefinition(r);
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
        return Ze.get(t);
    }
    static getCachedOrThrow(t) {
        const e = Controller.getCached(t);
        if (void 0 === e) throw new Error(`AUR0500:${t}`);
        return e;
    }
    static $el(t, i, s, n, r = void 0, o = null) {
        if (Ze.has(i)) return Ze.get(i);
        r = null !== r && void 0 !== r ? r : ve(i.constructor);
        const l = new Controller(t, 0, r, null, i, s, o);
        const h = t.get(e.optional(ai));
        if (r.dependencies.length > 0) t.register(...r.dependencies);
        t.registerResolver(ai, new e.InstanceProvider("IHydrationContext", new HydrationContext(l, n, h)));
        Ze.set(i, l);
        if (null == n || false !== n.hydrate) l.hE(n, h);
        return l;
    }
    static $attr(t, e, i, s) {
        if (Ze.has(e)) return Ze.get(e);
        s = null !== s && void 0 !== s ? s : Nt(e.constructor);
        const n = new Controller(t, 1, s, null, e, i, null);
        if (s.dependencies.length > 0) t.register(...s.dependencies);
        Ze.set(e, n);
        n.yt();
        return n;
    }
    static $view(t, e = void 0) {
        const i = new Controller(t.container, 2, null, t, null, null, null);
        i.parent = null !== e && void 0 !== e ? e : null;
        i.kt();
        return i;
    }
    hE(i, s) {
        const n = this.container;
        const r = this.flags;
        const o = this.viewModel;
        let l = this.definition;
        this.scope = t.Scope.create(o, null, true);
        if (l.watches.length > 0) si(this, n, l, o);
        Qe(this, l, r, o);
        this.xt = ti(this, l, o);
        if (this.hooks.hasDefine) {
            const t = o.define(this, s, l);
            if (void 0 !== t && t !== l) l = CustomElementDefinition.getOrCreate(t);
        }
        this.lifecycleHooks = _e.resolve(n);
        l.register(n);
        if (null !== l.injectable) n.registerResolver(l.injectable, new e.InstanceProvider("definition.injectable", o));
        if (null == i || false !== i.hydrate) {
            this.hS(i);
            this.hC();
        }
    }
    hS(t) {
        if (void 0 !== this.lifecycleHooks.hydrating) this.lifecycleHooks.hydrating.forEach(di, this);
        if (this.hooks.hasHydrating) this.viewModel.hydrating(this);
        const e = this.Ct = this.r.compile(this.definition, this.container, t);
        const {shadowOptions: i, isStrictBinding: s, hasSlots: n, containerless: r} = e;
        let o = this.location;
        this.isStrictBinding = s;
        if (null !== (this.hostController = de(this.host, Ye))) {
            this.host = this.container.root.get(J).document.createElement(this.definition.name);
            if (r && null == o) o = this.location = Oi(this.host);
        }
        Ei(this.host, le, this);
        Ei(this.host, this.definition.key, this);
        if (null !== i || n) {
            if (null != o) throw new Error(`AUR0501`);
            Ei(this.shadowRoot = this.host.attachShadow(null !== i && void 0 !== i ? i : oi), le, this);
            Ei(this.shadowRoot, this.definition.key, this);
            this.mountTarget = 2;
        } else if (null != o) {
            Ei(o, le, this);
            Ei(o, this.definition.key, this);
            this.mountTarget = 3;
        } else this.mountTarget = 1;
        this.viewModel.$controller = this;
        this.nodes = this.r.createNodes(e);
        if (void 0 !== this.lifecycleHooks.hydrated) this.lifecycleHooks.hydrated.forEach(pi, this);
        if (this.hooks.hasHydrated) this.viewModel.hydrated(this);
    }
    hC() {
        this.r.render(this, this.nodes.findTargets(), this.Ct, this.host);
        if (void 0 !== this.lifecycleHooks.created) this.lifecycleHooks.created.forEach(fi, this);
        if (this.hooks.hasCreated) this.viewModel.created(this);
    }
    yt() {
        const t = this.definition;
        const e = this.viewModel;
        if (t.watches.length > 0) si(this, this.container, t, e);
        Qe(this, t, this.flags, e);
        e.$controller = this;
        this.lifecycleHooks = _e.resolve(this.container);
        if (void 0 !== this.lifecycleHooks.created) this.lifecycleHooks.created.forEach(fi, this);
        if (this.hooks.hasCreated) this.viewModel.created(this);
    }
    kt() {
        this.Ct = this.r.compile(this.viewFactory.def, this.container, null);
        this.isStrictBinding = this.Ct.isStrictBinding;
        this.r.render(this, (this.nodes = this.r.createNodes(this.Ct)).findTargets(), this.Ct, void 0);
    }
    activate(t, i, s, n) {
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
            throw new Error(`AUR0503:${this.name} ${hi(this.state)}`);
        }
        this.parent = i;
        s |= 2;
        switch (this.vmKind) {
          case 0:
            this.scope.parentScope = null !== n && void 0 !== n ? n : null;
            break;

          case 1:
            this.scope = null !== n && void 0 !== n ? n : null;
            break;

          case 2:
            if (void 0 === n || null === n) throw new Error(`AUR0504`);
            if (!this.hasLockedScope) this.scope = n;
            break;
        }
        if (this.isStrictBinding) s |= 1;
        this.$initiator = t;
        this.$flags = s;
        this.At();
        let r;
        if (2 !== this.vmKind && null != this.lifecycleHooks.binding) r = e.resolveAll(...this.lifecycleHooks.binding.map(vi, this));
        if (this.hooks.hasBinding) r = e.resolveAll(r, this.viewModel.binding(this.$initiator, this.parent, this.$flags));
        if (y(r)) {
            this.Rt();
            r.then((() => {
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
        let i = this.xt.length;
        let s;
        if (i > 0) while (i > t) {
            this.xt[t].start();
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
        if (2 !== this.vmKind && null != this.lifecycleHooks.bound) s = e.resolveAll(...this.lifecycleHooks.bound.map(mi, this));
        if (this.hooks.hasBound) s = e.resolveAll(s, this.viewModel.bound(this.$initiator, this.parent, this.$flags));
        if (y(s)) {
            this.Rt();
            s.then((() => {
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
                let e = 0;
                for (;e < t.length; ++e) this.location.parentNode.insertBefore(t[e], this.location);
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
                const e = t.has(Be, false) ? t.get(Be) : t.get(Ie);
                e.applyTo(this.shadowRoot);
                this.nodes.appendTo(this.shadowRoot);
                break;
            }

          case 3:
            this.nodes.insertBefore(this.location);
            break;
        }
        let t = 0;
        let i;
        if (2 !== this.vmKind && null != this.lifecycleHooks.attaching) i = e.resolveAll(...this.lifecycleHooks.attaching.map(xi, this));
        if (this.hooks.hasAttaching) i = e.resolveAll(i, this.viewModel.attaching(this.$initiator, this.parent, this.$flags));
        if (y(i)) {
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
    deactivate(t, i, s) {
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
            throw new Error(`AUR0505:${this.name} ${hi(this.state)}`);
        }
        this.$initiator = t;
        this.$flags = s;
        if (t === this) this.Tt();
        let n = 0;
        let r;
        if (this.xt.length) for (;n < this.xt.length; ++n) this.xt[n].stop();
        if (null !== this.children) for (n = 0; n < this.children.length; ++n) void this.children[n].deactivate(t, this, s);
        if (2 !== this.vmKind && null != this.lifecycleHooks.detaching) r = e.resolveAll(...this.lifecycleHooks.detaching.map(wi, this));
        if (this.hooks.hasDetaching) r = e.resolveAll(r, this.viewModel.detaching(this.$initiator, this.parent, this.$flags));
        if (y(r)) {
            this.Rt();
            t.Tt();
            r.then((() => {
                t.Dt();
            })).catch((e => {
                t.St(e);
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
        let e = 0;
        if (null !== this.bindings) for (;e < this.bindings.length; ++e) this.bindings[e].$unbind(t);
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
            this.$promise = new Promise(((t, e) => {
                this.$resolve = t;
                this.$reject = e;
            }));
            if (this.$initiator !== this) this.parent.Rt();
        }
    }
    $t() {
        if (void 0 !== this.$promise) {
            yi = this.$resolve;
            this.$resolve = this.$reject = this.$promise = void 0;
            yi();
            yi = void 0;
        }
    }
    St(t) {
        if (void 0 !== this.$promise) {
            ki = this.$reject;
            this.$resolve = this.$reject = this.$promise = void 0;
            ki(t);
            ki = void 0;
        }
        if (this.$initiator !== this) this.parent.St(t);
    }
    At() {
        ++this.gt;
        if (this.$initiator !== this) this.parent.At();
    }
    It() {
        if (0 === --this.gt) {
            if (2 !== this.vmKind && null != this.lifecycleHooks.attached) Ci = e.resolveAll(...this.lifecycleHooks.attached.map(gi, this));
            if (this.hooks.hasAttached) Ci = e.resolveAll(Ci, this.viewModel.attached(this.$initiator, this.$flags));
            if (y(Ci)) {
                this.Rt();
                Ci.then((() => {
                    this.state = 2;
                    this.$t();
                    if (this.$initiator !== this) this.parent.It();
                })).catch((t => {
                    this.St(t);
                }));
                Ci = void 0;
                return;
            }
            Ci = void 0;
            this.state = 2;
            this.$t();
        }
        if (this.$initiator !== this) this.parent.It();
    }
    Tt() {
        ++this.wt;
    }
    Dt() {
        if (0 === --this.wt) {
            this.Pt();
            this.removeNodes();
            let t = this.$initiator.head;
            let i;
            while (null !== t) {
                if (t !== this) {
                    if (t.debug) t.logger.trace(`detach()`);
                    t.removeNodes();
                }
                if (2 !== t.vmKind && null != t.lifecycleHooks.unbinding) i = e.resolveAll(...t.lifecycleHooks.unbinding.map(bi, this));
                if (t.hooks.hasUnbinding) {
                    if (t.debug) t.logger.trace("unbinding()");
                    i = e.resolveAll(i, t.viewModel.unbinding(t.$initiator, t.parent, t.$flags));
                }
                if (y(i)) {
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
        ++this.bt;
    }
    Ot() {
        if (0 === --this.bt) {
            let t = this.$initiator.head;
            let e = null;
            while (null !== t) {
                if (t !== this) {
                    t.isBound = false;
                    t.unbind();
                }
                e = t.next;
                t.next = null;
                t = e;
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
            return Nt(this.viewModel.constructor).name === t;

          case 0:
            return ve(this.viewModel.constructor).name === t;

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
            Ei(t, le, this);
            Ei(t, this.definition.key, this);
        }
        this.host = t;
        this.mountTarget = 1;
        return this;
    }
    setShadowRoot(t) {
        if (0 === this.vmKind) {
            Ei(t, le, this);
            Ei(t, this.definition.key, this);
        }
        this.shadowRoot = t;
        this.mountTarget = 2;
        return this;
    }
    setLocation(t) {
        if (0 === this.vmKind) {
            Ei(t, le, this);
            Ei(t, this.definition.key, this);
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
            this.children.forEach(ui);
            this.children = null;
        }
        this.hostController = null;
        this.scope = null;
        this.nodes = null;
        this.location = null;
        this.viewFactory = null;
        if (null !== this.viewModel) {
            Ze.delete(this.viewModel);
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
            const {children: e} = this;
            for (let i = 0, s = e.length; i < s; ++i) if (true === e[i].accept(t)) return true;
        }
    }
}

function Je(t) {
    let e = t.$observers;
    if (void 0 === e) Reflect.defineProperty(t, "$observers", {
        enumerable: false,
        value: e = {}
    });
    return e;
}

function Qe(e, i, s, n) {
    const r = i.bindables;
    const o = Object.getOwnPropertyNames(r);
    const l = o.length;
    if (l > 0) {
        let i;
        let s;
        let h = 0;
        const c = Je(n);
        const a = e.container;
        const u = a.has(t.ICoercionConfiguration, true) ? a.get(t.ICoercionConfiguration) : null;
        for (;h < l; ++h) {
            i = o[h];
            if (void 0 === c[i]) {
                s = r[i];
                c[i] = new BindableObserver(n, i, s.callback, s.set, e, u);
            }
        }
    }
}

function ti(t, i, s) {
    const n = i.childrenObservers;
    const r = Object.getOwnPropertyNames(n);
    const o = r.length;
    if (o > 0) {
        const e = Je(s);
        const i = [];
        let l;
        let h = 0;
        let c;
        for (;h < o; ++h) {
            l = r[h];
            if (null == e[l]) {
                c = n[l];
                i[i.length] = e[l] = new ChildrenObserver(t, s, l, c.callback, c.query, c.filter, c.map, c.options);
            }
        }
        return i;
    }
    return e.emptyArray;
}

const ei = new Map;

const ii = e => {
    let i = ei.get(e);
    if (null == i) {
        i = new t.AccessScopeExpression(e, 0);
        ei.set(e, i);
    }
    return i;
};

function si(e, i, s, n) {
    const r = i.get(t.IObserverLocator);
    const o = i.get(t.IExpressionParser);
    const l = s.watches;
    const h = 0 === e.vmKind ? e.scope : t.Scope.create(n, null, true);
    const c = l.length;
    let a;
    let u;
    let f;
    let d = 0;
    for (;c > d; ++d) {
        ({expression: a, callback: u} = l[d]);
        u = k(u) ? u : Reflect.get(n, u);
        if (!k(u)) throw new Error(`AUR0506:${String(u)}`);
        if (k(a)) e.addBinding(new ComputedWatcher(n, r, a, u, true)); else {
            f = C(a) ? o.parse(a, 8) : ii(a);
            e.addBinding(new ExpressionWatcher(h, i, r, f, u));
        }
    }
}

function ni(t) {
    return t instanceof Controller && 0 === t.vmKind;
}

function ri(t) {
    return i.isObject(t) && fe(t.constructor);
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

const oi = {
    mode: "open"
};

exports.ViewModelKind = void 0;

(function(t) {
    t[t["customElement"] = 0] = "customElement";
    t[t["customAttribute"] = 1] = "customAttribute";
    t[t["synthetic"] = 2] = "synthetic";
})(exports.ViewModelKind || (exports.ViewModelKind = {}));

var li;

(function(t) {
    t[t["none"] = 0] = "none";
    t[t["activating"] = 1] = "activating";
    t[t["activated"] = 2] = "activated";
    t[t["deactivating"] = 4] = "deactivating";
    t[t["deactivated"] = 8] = "deactivated";
    t[t["released"] = 16] = "released";
    t[t["disposed"] = 32] = "disposed";
})(li || (li = {}));

function hi(t) {
    const e = [];
    if (1 === (1 & t)) e.push("activating");
    if (2 === (2 & t)) e.push("activated");
    if (4 === (4 & t)) e.push("deactivating");
    if (8 === (8 & t)) e.push("deactivated");
    if (16 === (16 & t)) e.push("released");
    if (32 === (32 & t)) e.push("disposed");
    return 0 === e.length ? "none" : e.join("|");
}

const ci = e.DI.createInterface("IController");

const ai = e.DI.createInterface("IHydrationContext");

class HydrationContext {
    constructor(t, e, i) {
        this.instruction = e;
        this.parent = i;
        this.controller = t;
    }
}

function ui(t) {
    t.dispose();
}

function fi(t) {
    t.instance.created(this.viewModel, this);
}

function di(t) {
    t.instance.hydrating(this.viewModel, this);
}

function pi(t) {
    t.instance.hydrated(this.viewModel, this);
}

function vi(t) {
    return t.instance.binding(this.viewModel, this["$initiator"], this.parent, this["$flags"]);
}

function mi(t) {
    return t.instance.bound(this.viewModel, this["$initiator"], this.parent, this["$flags"]);
}

function xi(t) {
    return t.instance.attaching(this.viewModel, this["$initiator"], this.parent, this["$flags"]);
}

function gi(t) {
    return t.instance.attached(this.viewModel, this["$initiator"], this["$flags"]);
}

function wi(t) {
    return t.instance.detaching(this.viewModel, this["$initiator"], this.parent, this["$flags"]);
}

function bi(t) {
    return t.instance.unbinding(this.viewModel, this["$initiator"], this.parent, this["$flags"]);
}

let yi;

let ki;

let Ci;

const Ai = e.DI.createInterface("IAppRoot");

const Ri = e.DI.createInterface("IWorkTracker", (t => t.singleton(WorkTracker)));

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

WorkTracker.inject = [ e.ILogger ];

class AppRoot {
    constructor(t, i, s, n) {
        this.config = t;
        this.platform = i;
        this.container = s;
        this.controller = void 0;
        this._t = void 0;
        this.host = t.host;
        this.work = s.get(Ri);
        n.prepare(this);
        s.registerResolver(i.HTMLElement, s.registerResolver(i.Element, s.registerResolver(Bi, new e.InstanceProvider("ElementResolver", t.host))));
        this._t = e.onResolve(this.Vt("creating"), (() => {
            const i = t.component;
            const n = s.createChild();
            let r;
            if (fe(i)) r = this.container.get(i); else r = t.component;
            const o = {
                hydrate: false,
                projections: null
            };
            const l = this.controller = Controller.$el(n, r, this.host, o);
            l.hE(o, null);
            return e.onResolve(this.Vt("hydrating"), (() => {
                l.hS(null);
                return e.onResolve(this.Vt("hydrated"), (() => {
                    l.hC();
                    this._t = void 0;
                }));
            }));
        }));
    }
    activate() {
        return e.onResolve(this._t, (() => e.onResolve(this.Vt("activating"), (() => e.onResolve(this.controller.activate(this.controller, null, 2, void 0), (() => this.Vt("activated")))))));
    }
    deactivate() {
        return e.onResolve(this.Vt("deactivating"), (() => e.onResolve(this.controller.deactivate(this.controller, null, 0), (() => this.Vt("deactivated")))));
    }
    Vt(t) {
        return e.resolveAll(...this.container.getAll(kt).reduce(((e, i) => {
            if (i.slot === t) e.push(i.run());
            return e;
        }), []));
    }
    dispose() {
        var t;
        null === (t = this.controller) || void 0 === t ? void 0 : t.dispose();
    }
}

class Refs {}

function Si(t, e) {
    var i, s;
    return null !== (s = null === (i = t.$au) || void 0 === i ? void 0 : i[e]) && void 0 !== s ? s : null;
}

function Ei(t, e, i) {
    var s;
    var n;
    (null !== (s = (n = t).$au) && void 0 !== s ? s : n.$au = new Refs)[e] = i;
}

const Bi = e.DI.createInterface("INode");

const Ii = e.DI.createInterface("IEventTarget", (t => t.cachedCallback((t => {
    if (t.has(Ai, true)) return t.get(Ai).host;
    return t.get(J).document;
}))));

const Ti = e.DI.createInterface("IRenderLocation");

exports.NodeType = void 0;

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
})(exports.NodeType || (exports.NodeType = {}));

const Di = new WeakMap;

function $i(t) {
    if (Di.has(t)) return Di.get(t);
    let e = 0;
    let i = t.nextSibling;
    while (null !== i) {
        if (8 === i.nodeType) switch (i.textContent) {
          case "au-start":
            ++e;
            break;

          case "au-end":
            if (0 === e--) return i;
        }
        i = i.nextSibling;
    }
    if (null === t.parentNode && 11 === t.nodeType) {
        const e = de(t);
        if (void 0 === e) return null;
        if (2 === e.mountTarget) return $i(e.host);
    }
    return t.parentNode;
}

function Pi(t, e) {
    if (void 0 !== t.platform && !(t instanceof t.platform.Node)) {
        const i = t.childNodes;
        for (let t = 0, s = i.length; t < s; ++t) Di.set(i[t], e);
    } else Di.set(t, e);
}

function Oi(t) {
    if (Li(t)) return t;
    const e = t.ownerDocument.createComment("au-end");
    const i = t.ownerDocument.createComment("au-start");
    if (null !== t.parentNode) {
        t.parentNode.replaceChild(e, t);
        e.parentNode.insertBefore(i, e);
    }
    e.$start = i;
    return e;
}

function Li(t) {
    return "au-end" === t.textContent;
}

class FragmentNodeSequence {
    constructor(t, e) {
        this.platform = t;
        this.fragment = e;
        this.isMounted = false;
        this.isLinked = false;
        this.next = void 0;
        this.refNode = void 0;
        const i = e.querySelectorAll(".au");
        let s = 0;
        let n = i.length;
        let r;
        let o = this.targets = Array(n);
        while (n > s) {
            r = i[s];
            if ("AU-M" === r.nodeName) o[s] = Oi(r); else o[s] = r;
            ++s;
        }
        const l = e.childNodes;
        const h = this.childNodes = Array(n = l.length);
        s = 0;
        while (n > s) {
            h[s] = l[s];
            ++s;
        }
        this.firstChild = e.firstChild;
        this.lastChild = e.lastChild;
    }
    findTargets() {
        return this.targets;
    }
    insertBefore(t) {
        if (this.isLinked && !!this.refNode) this.addToLinked(); else {
            const e = t.parentNode;
            if (this.isMounted) {
                let i = this.firstChild;
                let s;
                const n = this.lastChild;
                while (null != i) {
                    s = i.nextSibling;
                    e.insertBefore(i, t);
                    if (i === n) break;
                    i = s;
                }
            } else {
                this.isMounted = true;
                t.parentNode.insertBefore(this.fragment, t);
            }
        }
    }
    appendTo(t, e = false) {
        if (this.isMounted) {
            let e = this.firstChild;
            let i;
            const s = this.lastChild;
            while (null != e) {
                i = e.nextSibling;
                t.appendChild(e);
                if (e === s) break;
                e = i;
            }
        } else {
            this.isMounted = true;
            if (!e) t.appendChild(this.fragment);
        }
    }
    remove() {
        if (this.isMounted) {
            this.isMounted = false;
            const t = this.fragment;
            const e = this.lastChild;
            let i;
            let s = this.firstChild;
            while (null !== s) {
                i = s.nextSibling;
                t.appendChild(s);
                if (s === e) break;
                s = i;
            }
        }
    }
    addToLinked() {
        const t = this.refNode;
        const e = t.parentNode;
        if (this.isMounted) {
            let i = this.firstChild;
            let s;
            const n = this.lastChild;
            while (null != i) {
                s = i.nextSibling;
                e.insertBefore(i, t);
                if (i === n) break;
                i = s;
            }
        } else {
            this.isMounted = true;
            e.insertBefore(this.fragment, t);
        }
    }
    unlink() {
        this.isLinked = false;
        this.next = void 0;
        this.refNode = void 0;
    }
    link(t) {
        this.isLinked = true;
        if (Li(t)) this.refNode = t; else {
            this.next = t;
            this.obtainRefNode();
        }
    }
    obtainRefNode() {
        if (void 0 !== this.next) this.refNode = this.next.firstChild; else this.refNode = void 0;
    }
}

const qi = e.DI.createInterface("IWindow", (t => t.callback((t => t.get(J).window))));

const Ui = e.DI.createInterface("ILocation", (t => t.callback((t => t.get(qi).location))));

const _i = e.DI.createInterface("IHistory", (t => t.callback((t => t.get(qi).history))));

const Vi = {
    [t.DelegationStrategy.capturing]: {
        capture: true
    },
    [t.DelegationStrategy.bubbling]: {
        capture: false
    }
};

class ListenerOptions {
    constructor(t, e, i) {
        this.prevent = t;
        this.strategy = e;
        this.expAsHandler = i;
    }
}

class Listener {
    constructor(t, e, i, s, n, r, o) {
        this.platform = t;
        this.targetEvent = e;
        this.sourceExpression = i;
        this.target = s;
        this.eventDelegator = n;
        this.locator = r;
        this.interceptor = this;
        this.isBound = false;
        this.handler = null;
        this.Mt = o;
    }
    callSource(t) {
        const e = this.$scope.overrideContext;
        e.$event = t;
        let i = this.sourceExpression.evaluate(8, this.$scope, this.locator, null);
        delete e.$event;
        if (this.Mt.expAsHandler) {
            if (!k(i)) throw new Error(`Handler of "${this.targetEvent}" event is not a function.`);
            i = i(t);
        }
        if (true !== i && this.Mt.prevent) t.preventDefault();
        return i;
    }
    handleEvent(t) {
        this.interceptor.callSource(t);
    }
    $bind(e, i) {
        if (this.isBound) {
            if (this.$scope === i) return;
            this.interceptor.$unbind(2 | e);
        }
        this.$scope = i;
        const s = this.sourceExpression;
        if (s.hasBind) s.bind(e, i, this.interceptor);
        if (this.Mt.strategy === t.DelegationStrategy.none) this.target.addEventListener(this.targetEvent, this); else this.handler = this.eventDelegator.addEventListener(this.locator.get(Ii), this.target, this.targetEvent, this, Vi[this.Mt.strategy]);
        this.isBound = true;
    }
    $unbind(e) {
        if (!this.isBound) return;
        const i = this.sourceExpression;
        if (i.hasUnbind) i.unbind(e, this.$scope, this.interceptor);
        this.$scope = null;
        if (this.Mt.strategy === t.DelegationStrategy.none) this.target.removeEventListener(this.targetEvent, this); else {
            this.handler.dispose();
            this.handler = null;
        }
        this.isBound = false;
    }
    observe(t, e) {
        return;
    }
    handleChange(t, e, i) {
        return;
    }
}

const Mi = {
    capture: false
};

class ListenerTracker {
    constructor(t, e, i = Mi) {
        this.Ft = t;
        this.jt = e;
        this.Mt = i;
        this.Nt = 0;
        this.Ht = new Map;
        this.Wt = new Map;
    }
    zt() {
        if (1 === ++this.Nt) this.Ft.addEventListener(this.jt, this, this.Mt);
    }
    Gt() {
        if (0 === --this.Nt) this.Ft.removeEventListener(this.jt, this, this.Mt);
    }
    dispose() {
        if (this.Nt > 0) {
            this.Nt = 0;
            this.Ft.removeEventListener(this.jt, this, this.Mt);
        }
        this.Ht.clear();
        this.Wt.clear();
    }
    Xt(t) {
        const e = true === this.Mt.capture ? this.Ht : this.Wt;
        let i = e.get(t);
        if (void 0 === i) e.set(t, i = x());
        return i;
    }
    handleEvent(t) {
        const e = true === this.Mt.capture ? this.Ht : this.Wt;
        const i = t.composedPath();
        if (true === this.Mt.capture) i.reverse();
        for (const s of i) {
            const i = e.get(s);
            if (void 0 === i) continue;
            const n = i[this.jt];
            if (void 0 === n) continue;
            if (k(n)) n(t); else n.handleEvent(t);
            if (true === t.cancelBubble) return;
        }
    }
}

class DelegateSubscription {
    constructor(t, e, i, s) {
        this.Kt = t;
        this.Yt = e;
        this.jt = i;
        t.zt();
        e[i] = s;
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
    subscribe(t, e) {
        this.target = t;
        this.handler = e;
        let i;
        for (i of this.config.events) t.addEventListener(i, e);
    }
    dispose() {
        const {target: t, handler: e} = this;
        let i;
        if (null !== t && null !== e) for (i of this.config.events) t.removeEventListener(i, e);
        this.target = this.handler = null;
    }
}

const Fi = e.DI.createInterface("IEventDelegator", (t => t.singleton(EventDelegator)));

class EventDelegator {
    constructor() {
        this.Zt = x();
    }
    addEventListener(t, e, i, s, n) {
        var r;
        var o;
        const l = null !== (r = (o = this.Zt)[i]) && void 0 !== r ? r : o[i] = new Map;
        let h = l.get(t);
        if (void 0 === h) l.set(t, h = new ListenerTracker(t, i, n));
        return new DelegateSubscription(h, h.Xt(e), i, s);
    }
    dispose() {
        for (const t in this.Zt) {
            const e = this.Zt[t];
            for (const t of e.values()) t.dispose();
            e.clear();
        }
    }
}

const ji = e.DI.createInterface("IProjections");

const Ni = e.DI.createInterface("IAuSlotsInfo");

class AuSlotsInfo {
    constructor(t) {
        this.projectedSlots = t;
    }
}

exports.InstructionType = void 0;

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
})(exports.InstructionType || (exports.InstructionType = {}));

const Hi = e.DI.createInterface("Instruction");

function Wi(t) {
    const e = t.type;
    return C(e) && 2 === e.length;
}

class InterpolationInstruction {
    constructor(t, e) {
        this.from = t;
        this.to = e;
    }
    get type() {
        return "rf";
    }
}

class PropertyBindingInstruction {
    constructor(t, e, i) {
        this.from = t;
        this.to = e;
        this.mode = i;
    }
    get type() {
        return "rg";
    }
}

class IteratorBindingInstruction {
    constructor(t, e) {
        this.from = t;
        this.to = e;
    }
    get type() {
        return "rk";
    }
}

class CallBindingInstruction {
    constructor(t, e) {
        this.from = t;
        this.to = e;
    }
    get type() {
        return "rh";
    }
}

class RefBindingInstruction {
    constructor(t, e) {
        this.from = t;
        this.to = e;
    }
    get type() {
        return "rj";
    }
}

class SetPropertyInstruction {
    constructor(t, e) {
        this.value = t;
        this.to = e;
    }
    get type() {
        return "re";
    }
}

class HydrateElementInstruction {
    constructor(t, e, i, s, n, r) {
        this.res = t;
        this.alias = e;
        this.props = i;
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
    constructor(t, e, i) {
        this.res = t;
        this.alias = e;
        this.props = i;
    }
    get type() {
        return "rb";
    }
}

class HydrateTemplateController {
    constructor(t, e, i, s) {
        this.def = t;
        this.res = e;
        this.alias = i;
        this.props = s;
    }
    get type() {
        return "rc";
    }
}

class HydrateLetElementInstruction {
    constructor(t, e) {
        this.instructions = t;
        this.toBindingContext = e;
    }
    get type() {
        return "rd";
    }
}

class LetBindingInstruction {
    constructor(t, e) {
        this.from = t;
        this.to = e;
    }
    get type() {
        return "ri";
    }
}

class TextBindingInstruction {
    constructor(t, e) {
        this.from = t;
        this.strict = e;
    }
    get type() {
        return "ha";
    }
}

class ListenerBindingInstruction {
    constructor(t, e, i, s) {
        this.from = t;
        this.to = e;
        this.preventDefault = i;
        this.strategy = s;
    }
    get type() {
        return "hb";
    }
}

class StylePropertyBindingInstruction {
    constructor(t, e) {
        this.from = t;
        this.to = e;
    }
    get type() {
        return "hd";
    }
}

class SetAttributeInstruction {
    constructor(t, e) {
        this.value = t;
        this.to = e;
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
    constructor(t, e, i) {
        this.attr = t;
        this.from = e;
        this.to = i;
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

const zi = e.DI.createInterface("ITemplateCompiler");

const Gi = e.DI.createInterface("IRenderer");

function Xi(t) {
    return function e(i) {
        i.register = function(t) {
            q(Gi, this).register(t);
        };
        A(i.prototype, "target", {
            configurable: true,
            get: function() {
                return t;
            }
        });
        return i;
    };
}

function Ki(t, e, i) {
    if (C(e)) return t.parse(e, i);
    return e;
}

function Yi(t) {
    if (null != t.viewModel) return t.viewModel;
    return t;
}

function Zi(t, e) {
    if ("element" === e) return t;
    switch (e) {
      case "controller":
        return de(t);

      case "view":
        throw new Error(`AUR0750`);

      case "view-model":
        return de(t).viewModel;

      default:
        {
            const i = Ft(t, e);
            if (void 0 !== i) return i.viewModel;
            const s = de(t, {
                name: e
            });
            if (void 0 === s) throw new Error(`AUR0751:${e}`);
            return s.viewModel;
        }
    }
}

let Ji = class SetPropertyRenderer {
    render(t, e, i) {
        const s = Yi(e);
        if (void 0 !== s.$observers && void 0 !== s.$observers[i.to]) s.$observers[i.to].setValue(i.value, 2); else s[i.to] = i.value;
    }
};

Ji = r([ Xi("re") ], Ji);

let Qi = class CustomElementRenderer {
    constructor(t, e) {
        this.r = t;
        this.p = e;
    }
    static get inject() {
        return [ Xe, J ];
    }
    render(t, i, s) {
        let n;
        let r;
        let o;
        let l;
        const h = s.res;
        const c = s.projections;
        const a = t.container;
        switch (typeof h) {
          case "string":
            n = a.find(ge, h);
            if (null == n) throw new Error(`AUR0752:${h}@${t["name"]}`);
            break;

          default:
            n = h;
        }
        const u = s.containerless || n.containerless;
        const f = u ? Oi(i) : null;
        const d = Ss(this.p, t, i, s, f, null == c ? void 0 : new AuSlotsInfo(Object.keys(c)));
        r = n.Type;
        o = d.invoke(r);
        d.registerResolver(r, new e.InstanceProvider(n.key, o));
        l = Controller.$el(d, o, i, s, n, f);
        Ei(i, n.key, l);
        const p = this.r.renderers;
        const v = s.props;
        const m = v.length;
        let x = 0;
        let g;
        while (m > x) {
            g = v[x];
            p[g.type].render(t, l, g);
            ++x;
        }
        t.addChild(l);
    }
};

Qi = r([ Xi("ra") ], Qi);

let ts = class CustomAttributeRenderer {
    constructor(t, e) {
        this.r = t;
        this.p = e;
    }
    static get inject() {
        return [ Xe, J ];
    }
    render(t, e, i) {
        let s = t.container;
        let n;
        switch (typeof i.res) {
          case "string":
            n = s.find(Ht, i.res);
            if (null == n) throw new Error(`AUR0753:${i.res}@${t["name"]}`);
            break;

          default:
            n = i.res;
        }
        const r = Es(this.p, n, t, e, i, void 0, void 0);
        const o = Controller.$attr(r.ctn, r.vm, e, n);
        Ei(e, n.key, o);
        const l = this.r.renderers;
        const h = i.props;
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

ts = r([ Xi("rb") ], ts);

let es = class TemplateControllerRenderer {
    constructor(t, e) {
        this.r = t;
        this.p = e;
    }
    static get inject() {
        return [ Xe, J ];
    }
    render(t, e, i) {
        var s, n;
        let r = t.container;
        let o;
        switch (typeof i.res) {
          case "string":
            o = r.find(Ht, i.res);
            if (null == o) throw new Error(`AUR0754:${i.res}@${t["name"]}`);
            break;

          default:
            o = i.res;
        }
        const l = this.r.getViewFactory(i.def, r);
        const h = Oi(e);
        const c = Es(this.p, o, t, e, i, l, h);
        const a = Controller.$attr(c.ctn, c.vm, e, o);
        Ei(h, o.key, a);
        null === (n = (s = c.vm).link) || void 0 === n ? void 0 : n.call(s, t, a, e, i);
        const u = this.r.renderers;
        const f = i.props;
        const d = f.length;
        let p = 0;
        let v;
        while (d > p) {
            v = f[p];
            u[v.type].render(t, a, v);
            ++p;
        }
        t.addChild(a);
    }
};

es = r([ Xi("rc") ], es);

let is = class LetElementRenderer {
    constructor(t, e) {
        this.ep = t;
        this.oL = e;
    }
    render(t, e, i) {
        e.remove();
        const s = i.instructions;
        const n = i.toBindingContext;
        const r = t.container;
        const o = s.length;
        let l;
        let h;
        let c;
        let a = 0;
        while (o > a) {
            l = s[a];
            h = Ki(this.ep, l.from, 8);
            c = new LetBinding(h, l.to, this.oL, r, n);
            t.addBinding(38963 === h.$kind ? as(c, h, r) : c);
            ++a;
        }
    }
};

is.inject = [ t.IExpressionParser, t.IObserverLocator ];

is = r([ Xi("rd") ], is);

let ss = class CallBindingRenderer {
    constructor(t, e) {
        this.ep = t;
        this.oL = e;
    }
    render(t, e, i) {
        const s = Ki(this.ep, i.from, 8 | 4);
        const n = new CallBinding(s, Yi(e), i.to, this.oL, t.container);
        t.addBinding(38963 === s.$kind ? as(n, s, t.container) : n);
    }
};

ss.inject = [ t.IExpressionParser, t.IObserverLocator ];

ss = r([ Xi("rh") ], ss);

let ns = class RefBindingRenderer {
    constructor(t) {
        this.ep = t;
    }
    render(t, e, i) {
        const s = Ki(this.ep, i.from, 8);
        const n = new RefBinding(s, Zi(e, i.to), t.container);
        t.addBinding(38963 === s.$kind ? as(n, s, t.container) : n);
    }
};

ns.inject = [ t.IExpressionParser ];

ns = r([ Xi("rj") ], ns);

let rs = class InterpolationBindingRenderer {
    constructor(t, e, i) {
        this.ep = t;
        this.oL = e;
        this.p = i;
    }
    render(e, i, s) {
        const n = e.container;
        const r = Ki(this.ep, s.from, 1);
        const o = new InterpolationBinding(this.oL, r, Yi(i), s.to, t.BindingMode.toView, n, this.p.domWriteQueue);
        const l = o.partBindings;
        const h = l.length;
        let c = 0;
        let a;
        for (;h > c; ++c) {
            a = l[c];
            if (38963 === a.sourceExpression.$kind) l[c] = as(a, a.sourceExpression, n);
        }
        e.addBinding(o);
    }
};

rs.inject = [ t.IExpressionParser, t.IObserverLocator, J ];

rs = r([ Xi("rf") ], rs);

let os = class PropertyBindingRenderer {
    constructor(t, e, i) {
        this.ep = t;
        this.oL = e;
        this.p = i;
    }
    render(t, e, i) {
        const s = Ki(this.ep, i.from, 8);
        const n = new PropertyBinding(s, Yi(e), i.to, i.mode, this.oL, t.container, this.p.domWriteQueue);
        t.addBinding(38963 === s.$kind ? as(n, s, t.container) : n);
    }
};

os.inject = [ t.IExpressionParser, t.IObserverLocator, J ];

os = r([ Xi("rg") ], os);

let ls = class IteratorBindingRenderer {
    constructor(t, e, i) {
        this.ep = t;
        this.oL = e;
        this.p = i;
    }
    render(e, i, s) {
        const n = Ki(this.ep, s.from, 2);
        const r = new PropertyBinding(n, Yi(i), s.to, t.BindingMode.toView, this.oL, e.container, this.p.domWriteQueue);
        e.addBinding(38963 === n.iterable.$kind ? as(r, n.iterable, e.container) : r);
    }
};

ls.inject = [ t.IExpressionParser, t.IObserverLocator, J ];

ls = r([ Xi("rk") ], ls);

let hs = 0;

const cs = [];

function as(e, i, s) {
    while (i instanceof t.BindingBehaviorExpression) {
        cs[hs++] = i;
        i = i.expression;
    }
    while (hs > 0) {
        const i = cs[--hs];
        const n = s.get(i.behaviorKey);
        if (n instanceof t.BindingBehaviorFactory) e = n.construct(e, i);
    }
    cs.length = 0;
    return e;
}

let us = class TextBindingRenderer {
    constructor(t, e, i) {
        this.ep = t;
        this.oL = e;
        this.p = i;
    }
    render(t, e, i) {
        const s = t.container;
        const n = e.nextSibling;
        const r = e.parentNode;
        const o = this.p.document;
        const l = Ki(this.ep, i.from, 1);
        const h = l.parts;
        const c = l.expressions;
        const a = c.length;
        let u = 0;
        let f = h[0];
        let d;
        let p;
        if ("" !== f) r.insertBefore(o.createTextNode(f), n);
        for (;a > u; ++u) {
            p = c[u];
            d = new ContentBinding(p, r.insertBefore(o.createTextNode(""), n), s, this.oL, this.p, i.strict);
            t.addBinding(38963 === p.$kind ? as(d, p, s) : d);
            f = h[u + 1];
            if ("" !== f) r.insertBefore(o.createTextNode(f), n);
        }
        if ("AU-M" === e.nodeName) e.remove();
    }
};

us.inject = [ t.IExpressionParser, t.IObserverLocator, J ];

us = r([ Xi("ha") ], us);

const fs = e.DI.createInterface("IListenerBehaviorOptions", (t => t.singleton(ListenerBehaviorOptions)));

class ListenerBehaviorOptions {
    constructor() {
        this.expAsHandler = false;
    }
}

let ds = class ListenerBindingRenderer {
    constructor(t, e, i, s) {
        this.ep = t;
        this.Jt = e;
        this.p = i;
        this.Qt = s;
    }
    render(t, e, i) {
        const s = Ki(this.ep, i.from, 4);
        const n = new Listener(this.p, i.to, s, e, this.Jt, t.container, new ListenerOptions(i.preventDefault, i.strategy, this.Qt.expAsHandler));
        t.addBinding(38963 === s.$kind ? as(n, s, t.container) : n);
    }
};

ds.inject = [ t.IExpressionParser, Fi, J, fs ];

ds = r([ Xi("hb") ], ds);

let ps = class SetAttributeRenderer {
    render(t, e, i) {
        e.setAttribute(i.to, i.value);
    }
};

ps = r([ Xi("he") ], ps);

let vs = class SetClassAttributeRenderer {
    render(t, e, i) {
        bs(e.classList, i.value);
    }
};

vs = r([ Xi("hf") ], vs);

let ms = class SetStyleAttributeRenderer {
    render(t, e, i) {
        e.style.cssText += i.value;
    }
};

ms = r([ Xi("hg") ], ms);

let xs = class StylePropertyBindingRenderer {
    constructor(t, e, i) {
        this.ep = t;
        this.oL = e;
        this.p = i;
    }
    render(e, i, s) {
        const n = Ki(this.ep, s.from, 8);
        const r = new PropertyBinding(n, i.style, s.to, t.BindingMode.toView, this.oL, e.container, this.p.domWriteQueue);
        e.addBinding(38963 === n.$kind ? as(r, n, e.container) : r);
    }
};

xs.inject = [ t.IExpressionParser, t.IObserverLocator, J ];

xs = r([ Xi("hd") ], xs);

let gs = class AttributeBindingRenderer {
    constructor(t, e) {
        this.ep = t;
        this.oL = e;
    }
    render(e, i, s) {
        const n = Ki(this.ep, s.from, 8);
        const r = new AttributeBinding(n, i, s.attr, s.to, t.BindingMode.toView, this.oL, e.container);
        e.addBinding(38963 === n.$kind ? as(r, n, e.container) : r);
    }
};

gs.inject = [ t.IExpressionParser, t.IObserverLocator ];

gs = r([ Xi("hc") ], gs);

let ws = class SpreadRenderer {
    constructor(t, e) {
        this.te = t;
        this.r = e;
    }
    static get inject() {
        return [ zi, Xe ];
    }
    render(t, i, s) {
        const n = t.container;
        const r = n.get(ai);
        const o = this.r.renderers;
        const l = t => {
            let e = t;
            let i = r;
            while (null != i && e > 0) {
                i = i.parent;
                --e;
            }
            if (null == i) throw new Error("No scope context for spread binding.");
            return i;
        };
        const h = s => {
            var n, r;
            const c = l(s);
            const a = ys(c);
            const u = this.te.compileSpread(c.controller.definition, null !== (r = null === (n = c.instruction) || void 0 === n ? void 0 : n.captures) && void 0 !== r ? r : e.emptyArray, c.controller.container, i);
            let f;
            for (f of u) switch (f.type) {
              case "hs":
                h(s + 1);
                break;

              case "hp":
                o[f.instructions.type].render(a, de(i), f.instructions);
                break;

              default:
                o[f.type].render(a, i, f);
            }
            t.addBinding(a);
        };
        h(0);
    }
};

ws = r([ Xi("hs") ], ws);

class SpreadBinding {
    constructor(t, e) {
        this.ee = t;
        this.ie = e;
        this.interceptor = this;
        this.isBound = false;
        this.ctrl = e.controller;
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
    $bind(t, e) {
        var i;
        if (this.isBound) return;
        this.isBound = true;
        const s = this.$scope = null !== (i = this.ie.controller.scope.parentScope) && void 0 !== i ? i : void 0;
        if (null == s) throw new Error("Invalid spreading. Context scope is null/undefined");
        this.ee.forEach((e => e.$bind(t, s)));
    }
    $unbind(t) {
        this.ee.forEach((e => e.$unbind(t)));
        this.isBound = false;
    }
    addBinding(t) {
        this.ee.push(t);
    }
    addChild(t) {
        if (1 !== t.vmKind) throw new Error("Spread binding does not support spreading custom attributes/template controllers");
        this.ctrl.addChild(t);
    }
}

function bs(t, e) {
    const i = e.length;
    let s = 0;
    for (let n = 0; n < i; ++n) if (32 === e.charCodeAt(n)) {
        if (n !== s) t.add(e.slice(s, n));
        s = n + 1;
    } else if (n + 1 === i) t.add(e.slice(s));
}

const ys = t => new SpreadBinding([], t);

const ks = "IController";

const Cs = "IInstruction";

const As = "IRenderLocation";

const Rs = "IAuSlotsInfo";

function Ss(t, i, s, n, r, o) {
    const l = i.container.createChild();
    l.registerResolver(t.HTMLElement, l.registerResolver(t.Element, l.registerResolver(Bi, new e.InstanceProvider("ElementResolver", s))));
    l.registerResolver(ci, new e.InstanceProvider(ks, i));
    l.registerResolver(Hi, new e.InstanceProvider(Cs, n));
    l.registerResolver(Ti, null == r ? Bs : new RenderLocationProvider(r));
    l.registerResolver(Me, Is);
    l.registerResolver(Ni, null == o ? Ts : new e.InstanceProvider(Rs, o));
    return l;
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
        if (!C(t.name) || 0 === t.name.length) throw new Error(`AUR0756`);
        return t;
    }
}

function Es(t, i, s, n, r, o, l, h) {
    const c = s.container.createChild();
    c.registerResolver(t.HTMLElement, c.registerResolver(t.Element, c.registerResolver(Bi, new e.InstanceProvider("ElementResolver", n))));
    s = s instanceof Controller ? s : s.ctrl;
    c.registerResolver(ci, new e.InstanceProvider(ks, s));
    c.registerResolver(Hi, new e.InstanceProvider(Cs, r));
    c.registerResolver(Ti, null == l ? Bs : new e.InstanceProvider(As, l));
    c.registerResolver(Me, null == o ? Is : new ViewFactoryProvider(o));
    c.registerResolver(Ni, null == h ? Ts : new e.InstanceProvider(Rs, h));
    return {
        vm: c.invoke(i.Type),
        ctn: c
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

const Bs = new RenderLocationProvider(null);

const Is = new ViewFactoryProvider(null);

const Ts = new e.InstanceProvider(Rs, new AuSlotsInfo(e.emptyArray));

exports.CommandType = void 0;

(function(t) {
    t[t["None"] = 0] = "None";
    t[t["IgnoreAttr"] = 1] = "IgnoreAttr";
})(exports.CommandType || (exports.CommandType = {}));

function Ds(t) {
    return function(e) {
        return Ls.define(t, e);
    };
}

class BindingCommandDefinition {
    constructor(t, e, i, s, n) {
        this.Type = t;
        this.name = e;
        this.aliases = i;
        this.key = s;
        this.type = n;
    }
    static create(t, i) {
        let s;
        let n;
        if (C(t)) {
            s = t;
            n = {
                name: s
            };
        } else {
            s = t.name;
            n = t;
        }
        return new BindingCommandDefinition(i, e.firstDefined(Os(i, "name"), s), e.mergeArrays(Os(i, "aliases"), n.aliases, i.aliases), Ps(s), e.firstDefined(Os(i, "type"), n.type, i.type, null));
    }
    register(e) {
        const {Type: i, key: s, aliases: n} = this;
        q(s, i).register(e);
        U(s, i).register(e);
        t.registerAliases(n, Ls, s, e);
    }
}

const $s = d("binding-command");

const Ps = t => `${$s}:${t}`;

const Os = (t, e) => l(f(e), t);

const Ls = Object.freeze({
    name: $s,
    keyFrom: Ps,
    define(t, e) {
        const i = BindingCommandDefinition.create(t, e);
        c($s, i, i.Type);
        c($s, i, i);
        p(e, $s);
        return i.Type;
    },
    getAnnotation: Os
});

exports.OneTimeBindingCommand = class OneTimeBindingCommand {
    constructor(t, e) {
        this.type = 0;
        this.m = t;
        this.ep = e;
    }
    get name() {
        return "one-time";
    }
    build(i) {
        var s;
        const n = i.attr;
        let r = n.target;
        let o = i.attr.rawValue;
        if (null == i.bindable) r = null !== (s = this.m.map(i.node, r)) && void 0 !== s ? s : e.camelCase(r); else {
            if ("" === o && 1 === i.def.type) o = e.camelCase(r);
            r = i.bindable.property;
        }
        return new PropertyBindingInstruction(this.ep.parse(o, 8), r, t.BindingMode.oneTime);
    }
};

exports.OneTimeBindingCommand.inject = [ et, t.IExpressionParser ];

exports.OneTimeBindingCommand = r([ Ds("one-time") ], exports.OneTimeBindingCommand);

exports.ToViewBindingCommand = class ToViewBindingCommand {
    constructor(t, e) {
        this.type = 0;
        this.m = t;
        this.ep = e;
    }
    get name() {
        return "to-view";
    }
    build(i) {
        var s;
        const n = i.attr;
        let r = n.target;
        let o = i.attr.rawValue;
        if (null == i.bindable) r = null !== (s = this.m.map(i.node, r)) && void 0 !== s ? s : e.camelCase(r); else {
            if ("" === o && 1 === i.def.type) o = e.camelCase(r);
            r = i.bindable.property;
        }
        return new PropertyBindingInstruction(this.ep.parse(o, 8), r, t.BindingMode.toView);
    }
};

exports.ToViewBindingCommand.inject = [ et, t.IExpressionParser ];

exports.ToViewBindingCommand = r([ Ds("to-view") ], exports.ToViewBindingCommand);

exports.FromViewBindingCommand = class FromViewBindingCommand {
    constructor(t, e) {
        this.type = 0;
        this.m = t;
        this.ep = e;
    }
    get name() {
        return "from-view";
    }
    build(i) {
        var s;
        const n = i.attr;
        let r = n.target;
        let o = n.rawValue;
        if (null == i.bindable) r = null !== (s = this.m.map(i.node, r)) && void 0 !== s ? s : e.camelCase(r); else {
            if ("" === o && 1 === i.def.type) o = e.camelCase(r);
            r = i.bindable.property;
        }
        return new PropertyBindingInstruction(this.ep.parse(o, 8), r, t.BindingMode.fromView);
    }
};

exports.FromViewBindingCommand.inject = [ et, t.IExpressionParser ];

exports.FromViewBindingCommand = r([ Ds("from-view") ], exports.FromViewBindingCommand);

exports.TwoWayBindingCommand = class TwoWayBindingCommand {
    constructor(t, e) {
        this.type = 0;
        this.m = t;
        this.ep = e;
    }
    get name() {
        return "two-way";
    }
    build(i) {
        var s;
        const n = i.attr;
        let r = n.target;
        let o = n.rawValue;
        if (null == i.bindable) r = null !== (s = this.m.map(i.node, r)) && void 0 !== s ? s : e.camelCase(r); else {
            if ("" === o && 1 === i.def.type) o = e.camelCase(r);
            r = i.bindable.property;
        }
        return new PropertyBindingInstruction(this.ep.parse(o, 8), r, t.BindingMode.twoWay);
    }
};

exports.TwoWayBindingCommand.inject = [ et, t.IExpressionParser ];

exports.TwoWayBindingCommand = r([ Ds("two-way") ], exports.TwoWayBindingCommand);

exports.DefaultBindingCommand = class DefaultBindingCommand {
    constructor(t, e) {
        this.type = 0;
        this.m = t;
        this.ep = e;
    }
    get name() {
        return "bind";
    }
    build(i) {
        var s;
        const n = i.attr;
        const r = i.bindable;
        let o;
        let l;
        let h = n.target;
        let c = n.rawValue;
        if (null == r) {
            l = this.m.isTwoWay(i.node, h) ? t.BindingMode.twoWay : t.BindingMode.toView;
            h = null !== (s = this.m.map(i.node, h)) && void 0 !== s ? s : e.camelCase(h);
        } else {
            if ("" === c && 1 === i.def.type) c = e.camelCase(h);
            o = i.def.defaultBindingMode;
            l = r.mode === t.BindingMode.default || null == r.mode ? null == o || o === t.BindingMode.default ? t.BindingMode.toView : o : r.mode;
            h = r.property;
        }
        return new PropertyBindingInstruction(this.ep.parse(c, 8), h, l);
    }
};

exports.DefaultBindingCommand.inject = [ et, t.IExpressionParser ];

exports.DefaultBindingCommand = r([ Ds("bind") ], exports.DefaultBindingCommand);

exports.CallBindingCommand = class CallBindingCommand {
    constructor(t) {
        this.type = 0;
        this.ep = t;
    }
    get name() {
        return "call";
    }
    build(t) {
        const i = null === t.bindable ? e.camelCase(t.attr.target) : t.bindable.property;
        return new CallBindingInstruction(this.ep.parse(t.attr.rawValue, 8 | 4), i);
    }
};

exports.CallBindingCommand.inject = [ t.IExpressionParser ];

exports.CallBindingCommand = r([ Ds("call") ], exports.CallBindingCommand);

exports.ForBindingCommand = class ForBindingCommand {
    constructor(t) {
        this.type = 0;
        this.ep = t;
    }
    get name() {
        return "for";
    }
    build(t) {
        const i = null === t.bindable ? e.camelCase(t.attr.target) : t.bindable.property;
        return new IteratorBindingInstruction(this.ep.parse(t.attr.rawValue, 2), i);
    }
};

exports.ForBindingCommand.inject = [ t.IExpressionParser ];

exports.ForBindingCommand = r([ Ds("for") ], exports.ForBindingCommand);

exports.TriggerBindingCommand = class TriggerBindingCommand {
    constructor(t) {
        this.type = 1;
        this.ep = t;
    }
    get name() {
        return "trigger";
    }
    build(e) {
        return new ListenerBindingInstruction(this.ep.parse(e.attr.rawValue, 4), e.attr.target, true, t.DelegationStrategy.none);
    }
};

exports.TriggerBindingCommand.inject = [ t.IExpressionParser ];

exports.TriggerBindingCommand = r([ Ds("trigger") ], exports.TriggerBindingCommand);

exports.DelegateBindingCommand = class DelegateBindingCommand {
    constructor(t) {
        this.type = 1;
        this.ep = t;
    }
    get name() {
        return "delegate";
    }
    build(e) {
        return new ListenerBindingInstruction(this.ep.parse(e.attr.rawValue, 4), e.attr.target, false, t.DelegationStrategy.bubbling);
    }
};

exports.DelegateBindingCommand.inject = [ t.IExpressionParser ];

exports.DelegateBindingCommand = r([ Ds("delegate") ], exports.DelegateBindingCommand);

exports.CaptureBindingCommand = class CaptureBindingCommand {
    constructor(t) {
        this.type = 1;
        this.ep = t;
    }
    get name() {
        return "capture";
    }
    build(e) {
        return new ListenerBindingInstruction(this.ep.parse(e.attr.rawValue, 4), e.attr.target, false, t.DelegationStrategy.capturing);
    }
};

exports.CaptureBindingCommand.inject = [ t.IExpressionParser ];

exports.CaptureBindingCommand = r([ Ds("capture") ], exports.CaptureBindingCommand);

exports.AttrBindingCommand = class AttrBindingCommand {
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

exports.AttrBindingCommand.inject = [ t.IExpressionParser ];

exports.AttrBindingCommand = r([ Ds("attr") ], exports.AttrBindingCommand);

exports.StyleBindingCommand = class StyleBindingCommand {
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

exports.StyleBindingCommand.inject = [ t.IExpressionParser ];

exports.StyleBindingCommand = r([ Ds("style") ], exports.StyleBindingCommand);

exports.ClassBindingCommand = class ClassBindingCommand {
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

exports.ClassBindingCommand.inject = [ t.IExpressionParser ];

exports.ClassBindingCommand = r([ Ds("class") ], exports.ClassBindingCommand);

let qs = class RefBindingCommand {
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

qs.inject = [ t.IExpressionParser ];

qs = r([ Ds("ref") ], qs);

let Us = class SpreadBindingCommand {
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

Us = r([ Ds("...$attrs") ], Us);

const _s = e.DI.createInterface("ITemplateElementFactory", (t => t.singleton(TemplateElementFactory)));

const Vs = {};

class TemplateElementFactory {
    constructor(t) {
        this.p = t;
        this.se = t.document.createElement("template");
    }
    createTemplate(t) {
        var e;
        if (C(t)) {
            let e = Vs[t];
            if (void 0 === e) {
                const i = this.se;
                i.innerHTML = t;
                const s = i.content.firstElementChild;
                if (null == s || "TEMPLATE" !== s.nodeName || null != s.nextElementSibling) {
                    this.se = this.p.document.createElement("template");
                    e = i;
                } else {
                    i.content.removeChild(s);
                    e = s;
                }
                Vs[t] = e;
            }
            return e.cloneNode(true);
        }
        if ("TEMPLATE" !== t.nodeName) {
            const e = this.p.document.createElement("template");
            e.content.appendChild(t);
            return e;
        }
        null === (e = t.parentNode) || void 0 === e ? void 0 : e.removeChild(t);
        return t.cloneNode(true);
    }
}

TemplateElementFactory.inject = [ J ];

class TemplateCompiler {
    constructor() {
        this.debug = false;
        this.resolveResources = true;
    }
    static register(t) {
        return q(zi, this).register(t);
    }
    compile(t, i, s) {
        var n, r, o, l;
        const h = CustomElementDefinition.getOrCreate(t);
        if (null === h.template || void 0 === h.template) return h;
        if (false === h.needsCompile) return h;
        null !== s && void 0 !== s ? s : s = js;
        const c = new CompilationContext(t, i, s, null, null, void 0);
        const a = C(h.template) || !t.enhance ? c.ne.createTemplate(h.template) : h.template;
        const u = "TEMPLATE" === a.nodeName && null != a.content;
        const f = u ? a.content : a;
        const d = i.get(L(Qs));
        const p = d.length;
        let v = 0;
        if (p > 0) while (p > v) {
            null === (r = (n = d[v]).compiling) || void 0 === r ? void 0 : r.call(n, a);
            ++v;
        }
        if (a.hasAttribute(Ys)) throw new Error(`AUR0701`);
        this.re(f, c);
        this.oe(f, c);
        return CustomElementDefinition.create({
            ...t,
            name: t.name || ce(),
            dependencies: (null !== (o = t.dependencies) && void 0 !== o ? o : e.emptyArray).concat(null !== (l = c.deps) && void 0 !== l ? l : e.emptyArray),
            instructions: c.rows,
            surrogates: u ? this.le(a, c) : e.emptyArray,
            template: a,
            hasSlots: c.hasSlot,
            needsCompile: false
        });
    }
    compileSpread(t, i, s, n) {
        var r;
        const o = new CompilationContext(t, s, js, null, null, void 0);
        const l = [];
        const h = o.he(n.nodeName.toLowerCase());
        const c = null !== h;
        const a = o.ep;
        const u = i.length;
        let f = 0;
        let d;
        let p = null;
        let v;
        let m;
        let x;
        let g;
        let w;
        let b = null;
        let y;
        let k;
        let C;
        let A;
        for (;u > f; ++f) {
            d = i[f];
            C = d.target;
            A = d.rawValue;
            b = o.ce(d);
            if (null !== b && (1 & b.type) > 0) {
                Hs.node = n;
                Hs.attr = d;
                Hs.bindable = null;
                Hs.def = null;
                l.push(b.build(Hs));
                continue;
            }
            p = o.ae(C);
            if (null !== p) {
                if (p.isTemplateController) throw new Error(`AUR0703:${C}`);
                x = BindablesInfo.from(p, true);
                k = false === p.noMultiBindings && null === b && Ms(A);
                if (k) m = this.ue(n, A, p, o); else {
                    w = x.primary;
                    if (null === b) {
                        y = a.parse(A, 1);
                        m = [ null === y ? new SetPropertyInstruction(A, w.property) : new InterpolationInstruction(y, w.property) ];
                    } else {
                        Hs.node = n;
                        Hs.attr = d;
                        Hs.bindable = w;
                        Hs.def = p;
                        m = [ b.build(Hs) ];
                    }
                }
                (null !== v && void 0 !== v ? v : v = []).push(new HydrateAttributeInstruction(this.resolveResources ? p : p.name, null != p.aliases && p.aliases.includes(C) ? C : void 0, m));
                continue;
            }
            if (null === b) {
                y = a.parse(A, 1);
                if (c) {
                    x = BindablesInfo.from(h, false);
                    g = x.attrs[C];
                    if (void 0 !== g) {
                        y = a.parse(A, 1);
                        l.push(new SpreadElementPropBindingInstruction(null == y ? new SetPropertyInstruction(A, g.property) : new InterpolationInstruction(y, g.property)));
                        continue;
                    }
                }
                if (null != y) l.push(new InterpolationInstruction(y, null !== (r = o.m.map(n, C)) && void 0 !== r ? r : e.camelCase(C))); else switch (C) {
                  case "class":
                    l.push(new SetClassAttributeInstruction(A));
                    break;

                  case "style":
                    l.push(new SetStyleAttributeInstruction(A));
                    break;

                  default:
                    l.push(new SetAttributeInstruction(A, C));
                }
            } else {
                if (c) {
                    x = BindablesInfo.from(h, false);
                    g = x.attrs[C];
                    if (void 0 !== g) {
                        Hs.node = n;
                        Hs.attr = d;
                        Hs.bindable = g;
                        Hs.def = h;
                        l.push(new SpreadElementPropBindingInstruction(b.build(Hs)));
                        continue;
                    }
                }
                Hs.node = n;
                Hs.attr = d;
                Hs.bindable = null;
                Hs.def = null;
                l.push(b.build(Hs));
            }
        }
        Fs();
        if (null != v) return v.concat(l);
        return l;
    }
    le(t, i) {
        var s;
        const n = [];
        const r = t.attributes;
        const o = i.ep;
        let l = r.length;
        let h = 0;
        let c;
        let a;
        let u;
        let f;
        let d = null;
        let p;
        let v;
        let m;
        let x;
        let g = null;
        let w;
        let b;
        let y;
        let k;
        for (;l > h; ++h) {
            c = r[h];
            a = c.name;
            u = c.value;
            f = i.fe.parse(a, u);
            y = f.target;
            k = f.rawValue;
            if (Ws[y]) throw new Error(`AUR0702:${a}`);
            g = i.ce(f);
            if (null !== g && (1 & g.type) > 0) {
                Hs.node = t;
                Hs.attr = f;
                Hs.bindable = null;
                Hs.def = null;
                n.push(g.build(Hs));
                continue;
            }
            d = i.ae(y);
            if (null !== d) {
                if (d.isTemplateController) throw new Error(`AUR0703:${y}`);
                m = BindablesInfo.from(d, true);
                b = false === d.noMultiBindings && null === g && Ms(k);
                if (b) v = this.ue(t, k, d, i); else {
                    x = m.primary;
                    if (null === g) {
                        w = o.parse(k, 1);
                        v = [ null === w ? new SetPropertyInstruction(k, x.property) : new InterpolationInstruction(w, x.property) ];
                    } else {
                        Hs.node = t;
                        Hs.attr = f;
                        Hs.bindable = x;
                        Hs.def = d;
                        v = [ g.build(Hs) ];
                    }
                }
                t.removeAttribute(a);
                --h;
                --l;
                (null !== p && void 0 !== p ? p : p = []).push(new HydrateAttributeInstruction(this.resolveResources ? d : d.name, null != d.aliases && d.aliases.includes(y) ? y : void 0, v));
                continue;
            }
            if (null === g) {
                w = o.parse(k, 1);
                if (null != w) {
                    t.removeAttribute(a);
                    --h;
                    --l;
                    n.push(new InterpolationInstruction(w, null !== (s = i.m.map(t, y)) && void 0 !== s ? s : e.camelCase(y)));
                } else switch (a) {
                  case "class":
                    n.push(new SetClassAttributeInstruction(k));
                    break;

                  case "style":
                    n.push(new SetStyleAttributeInstruction(k));
                    break;

                  default:
                    n.push(new SetAttributeInstruction(k, a));
                }
            } else {
                Hs.node = t;
                Hs.attr = f;
                Hs.bindable = null;
                Hs.def = null;
                n.push(g.build(Hs));
            }
        }
        Fs();
        if (null != p) return p.concat(n);
        return n;
    }
    oe(t, e) {
        switch (t.nodeType) {
          case 1:
            switch (t.nodeName) {
              case "LET":
                return this.de(t, e);

              default:
                return this.pe(t, e);
            }

          case 3:
            return this.ve(t, e);

          case 11:
            {
                let i = t.firstChild;
                while (null !== i) i = this.oe(i, e);
                break;
            }
        }
        return t.nextSibling;
    }
    de(i, s) {
        const n = i.attributes;
        const r = n.length;
        const o = [];
        const l = s.ep;
        let h = false;
        let c = 0;
        let a;
        let u;
        let f;
        let d;
        let p;
        let v;
        let m;
        let x;
        for (;r > c; ++c) {
            a = n[c];
            f = a.name;
            d = a.value;
            if ("to-binding-context" === f) {
                h = true;
                continue;
            }
            u = s.fe.parse(f, d);
            v = u.target;
            m = u.rawValue;
            p = s.ce(u);
            if (null !== p) switch (p.name) {
              case "to-view":
              case "bind":
                o.push(new LetBindingInstruction(l.parse(m, 8), e.camelCase(v)));
                continue;

              default:
                throw new Error(`AUR0704:${u.command}`);
            }
            x = l.parse(m, 1);
            o.push(new LetBindingInstruction(null === x ? new t.PrimitiveLiteralExpression(m) : x, e.camelCase(v)));
        }
        s.rows.push([ new HydrateLetElementInstruction(o, h) ]);
        return this.me(i).nextSibling;
    }
    pe(t, i) {
        var s, n, r, o, l, h;
        var c, a, u, f;
        const d = t.nextSibling;
        const p = (null !== (s = t.getAttribute("as-element")) && void 0 !== s ? s : t.nodeName).toLowerCase();
        const v = i.he(p);
        const m = null !== v;
        const x = m && null != v.shadowOptions;
        const g = null === v || void 0 === v ? void 0 : v.capture;
        const w = null != g && "boolean" !== typeof g;
        const b = g ? [] : e.emptyArray;
        const y = i.ep;
        const k = this.debug ? e.noop : () => {
            t.removeAttribute(B);
            --S;
            --R;
        };
        let C = t.attributes;
        let A;
        let R = C.length;
        let S = 0;
        let E;
        let B;
        let I;
        let T;
        let D;
        let $;
        let P = null;
        let O = false;
        let L;
        let q;
        let U;
        let _;
        let V;
        let M;
        let F;
        let j = null;
        let N;
        let H;
        let W;
        let z;
        let G = true;
        let X = false;
        let K = false;
        if ("slot" === p) {
            if (null == i.root.def.shadowOptions) throw new Error(`AUR0717:${i.root.def.name}`);
            i.root.hasSlot = true;
        }
        if (m) {
            G = null === (n = v.processContent) || void 0 === n ? void 0 : n.call(v.Type, t, i.p);
            C = t.attributes;
            R = C.length;
        }
        if (i.root.def.enhance && t.classList.contains("au")) throw new Error(`AUR0705`);
        for (;R > S; ++S) {
            E = C[S];
            B = E.name;
            I = E.value;
            switch (B) {
              case "as-element":
              case "containerless":
                k();
                if (!X) X = "containerless" === B;
                continue;
            }
            T = i.fe.parse(B, I);
            j = i.ce(T);
            W = T.target;
            z = T.rawValue;
            if (g && (!w || w && g(W))) {
                if (null != j && 1 & j.type) {
                    k();
                    b.push(T);
                    continue;
                }
                K = "au-slot" !== W && "slot" !== W;
                if (K) {
                    N = BindablesInfo.from(v, false);
                    if (null == N.attrs[W] && !(null === (r = i.ae(W)) || void 0 === r ? void 0 : r.isTemplateController)) {
                        k();
                        b.push(T);
                        continue;
                    }
                }
            }
            if (null !== j && 1 & j.type) {
                Hs.node = t;
                Hs.attr = T;
                Hs.bindable = null;
                Hs.def = null;
                (null !== D && void 0 !== D ? D : D = []).push(j.build(Hs));
                k();
                continue;
            }
            P = i.ae(W);
            if (null !== P) {
                N = BindablesInfo.from(P, true);
                O = false === P.noMultiBindings && null === j && Ms(z);
                if (O) U = this.ue(t, z, P, i); else {
                    H = N.primary;
                    if (null === j) {
                        M = y.parse(z, 1);
                        U = [ null === M ? new SetPropertyInstruction(z, H.property) : new InterpolationInstruction(M, H.property) ];
                    } else {
                        Hs.node = t;
                        Hs.attr = T;
                        Hs.bindable = H;
                        Hs.def = P;
                        U = [ j.build(Hs) ];
                    }
                }
                k();
                if (P.isTemplateController) (null !== _ && void 0 !== _ ? _ : _ = []).push(new HydrateTemplateController(Ns, this.resolveResources ? P : P.name, void 0, U)); else (null !== q && void 0 !== q ? q : q = []).push(new HydrateAttributeInstruction(this.resolveResources ? P : P.name, null != P.aliases && P.aliases.includes(W) ? W : void 0, U));
                continue;
            }
            if (null === j) {
                if (m) {
                    N = BindablesInfo.from(v, false);
                    L = N.attrs[W];
                    if (void 0 !== L) {
                        M = y.parse(z, 1);
                        (null !== $ && void 0 !== $ ? $ : $ = []).push(null == M ? new SetPropertyInstruction(z, L.property) : new InterpolationInstruction(M, L.property));
                        k();
                        continue;
                    }
                }
                M = y.parse(z, 1);
                if (null != M) {
                    k();
                    (null !== D && void 0 !== D ? D : D = []).push(new InterpolationInstruction(M, null !== (o = i.m.map(t, W)) && void 0 !== o ? o : e.camelCase(W)));
                }
                continue;
            }
            k();
            if (m) {
                N = BindablesInfo.from(v, false);
                L = N.attrs[W];
                if (void 0 !== L) {
                    Hs.node = t;
                    Hs.attr = T;
                    Hs.bindable = L;
                    Hs.def = v;
                    (null !== $ && void 0 !== $ ? $ : $ = []).push(j.build(Hs));
                    continue;
                }
            }
            Hs.node = t;
            Hs.attr = T;
            Hs.bindable = null;
            Hs.def = null;
            (null !== D && void 0 !== D ? D : D = []).push(j.build(Hs));
        }
        Fs();
        if (this.xe(t) && null != D && D.length > 1) this.ge(t, D);
        if (m) {
            F = new HydrateElementInstruction(this.resolveResources ? v : v.name, void 0, null !== $ && void 0 !== $ ? $ : e.emptyArray, null, X, b);
            if (p === on) {
                const e = t.getAttribute("name") || rn;
                const s = i.h("template");
                const n = i.we();
                let r = t.firstChild;
                while (null !== r) {
                    if (1 === r.nodeType && r.hasAttribute("au-slot")) t.removeChild(r); else s.content.appendChild(r);
                    r = t.firstChild;
                }
                this.oe(s.content, n);
                F.auSlot = {
                    name: e,
                    fallback: CustomElementDefinition.create({
                        name: ce(),
                        template: s,
                        instructions: n.rows,
                        needsCompile: false
                    })
                };
                t = this.be(t, i);
            }
        }
        if (null != D || null != F || null != q) {
            A = e.emptyArray.concat(null !== F && void 0 !== F ? F : e.emptyArray, null !== q && void 0 !== q ? q : e.emptyArray, null !== D && void 0 !== D ? D : e.emptyArray);
            this.me(t);
        }
        let Y;
        if (null != _) {
            R = _.length - 1;
            S = R;
            V = _[S];
            let e;
            this.be(t, i);
            if ("TEMPLATE" === t.nodeName) e = t; else {
                e = i.h("template");
                e.content.appendChild(t);
            }
            const s = e;
            const n = i.we(null == A ? [] : [ A ]);
            let r;
            let o;
            let h;
            let u;
            let f;
            let d;
            let g;
            let w;
            let b = 0, y = 0;
            let k = t.firstChild;
            let C = false;
            if (false !== G) while (null !== k) {
                o = 1 === k.nodeType ? k.getAttribute(on) : null;
                if (null !== o) k.removeAttribute(on);
                if (m) {
                    r = k.nextSibling;
                    if (!x) {
                        C = 3 === k.nodeType && "" === k.textContent.trim();
                        if (!C) (null !== (l = (c = null !== u && void 0 !== u ? u : u = {})[a = o || rn]) && void 0 !== l ? l : c[a] = []).push(k);
                        t.removeChild(k);
                    }
                    k = r;
                } else {
                    if (null !== o) {
                        o = o || rn;
                        throw new Error(`AUR0706:${p}[${o}]`);
                    }
                    k = k.nextSibling;
                }
            }
            if (null != u) {
                h = {};
                for (o in u) {
                    e = i.h("template");
                    f = u[o];
                    for (b = 0, y = f.length; y > b; ++b) {
                        d = f[b];
                        if ("TEMPLATE" === d.nodeName) if (d.attributes.length > 0) e.content.appendChild(d); else e.content.appendChild(d.content); else e.content.appendChild(d);
                    }
                    w = i.we();
                    this.oe(e.content, w);
                    h[o] = CustomElementDefinition.create({
                        name: ce(),
                        template: e,
                        instructions: w.rows,
                        needsCompile: false,
                        isStrictBinding: i.root.def.isStrictBinding
                    });
                }
                F.projections = h;
            }
            if (m && (X || v.containerless)) this.be(t, i);
            Y = !m || !v.containerless && !X && false !== G;
            if (Y) if ("TEMPLATE" === t.nodeName) this.oe(t.content, n); else {
                k = t.firstChild;
                while (null !== k) k = this.oe(k, n);
            }
            V.def = CustomElementDefinition.create({
                name: ce(),
                template: s,
                instructions: n.rows,
                needsCompile: false,
                isStrictBinding: i.root.def.isStrictBinding
            });
            while (S-- > 0) {
                V = _[S];
                e = i.h("template");
                g = i.h("au-m");
                g.classList.add("au");
                e.content.appendChild(g);
                V.def = CustomElementDefinition.create({
                    name: ce(),
                    template: e,
                    needsCompile: false,
                    instructions: [ [ _[S + 1] ] ],
                    isStrictBinding: i.root.def.isStrictBinding
                });
            }
            i.rows.push([ V ]);
        } else {
            if (null != A) i.rows.push(A);
            let e = t.firstChild;
            let s;
            let n;
            let r = null;
            let o;
            let l;
            let c;
            let a;
            let d;
            let g = false;
            let w = 0, b = 0;
            if (false !== G) while (null !== e) {
                n = 1 === e.nodeType ? e.getAttribute(on) : null;
                if (null !== n) e.removeAttribute(on);
                if (m) {
                    s = e.nextSibling;
                    if (!x) {
                        g = 3 === e.nodeType && "" === e.textContent.trim();
                        if (!g) (null !== (h = (u = null !== o && void 0 !== o ? o : o = {})[f = n || rn]) && void 0 !== h ? h : u[f] = []).push(e);
                        t.removeChild(e);
                    }
                    e = s;
                } else {
                    if (null !== n) {
                        n = n || rn;
                        throw new Error(`AUR0706:${p}[${n}]`);
                    }
                    e = e.nextSibling;
                }
            }
            if (null != o) {
                r = {};
                for (n in o) {
                    a = i.h("template");
                    l = o[n];
                    for (w = 0, b = l.length; b > w; ++w) {
                        c = l[w];
                        if ("TEMPLATE" === c.nodeName) if (c.attributes.length > 0) a.content.appendChild(c); else a.content.appendChild(c.content); else a.content.appendChild(c);
                    }
                    d = i.we();
                    this.oe(a.content, d);
                    r[n] = CustomElementDefinition.create({
                        name: ce(),
                        template: a,
                        instructions: d.rows,
                        needsCompile: false,
                        isStrictBinding: i.root.def.isStrictBinding
                    });
                }
                F.projections = r;
            }
            if (m && (X || v.containerless)) this.be(t, i);
            Y = !m || !v.containerless && !X && false !== G;
            if (Y && t.childNodes.length > 0) {
                e = t.firstChild;
                while (null !== e) e = this.oe(e, i);
            }
        }
        return d;
    }
    ve(t, e) {
        let i = "";
        let s = t;
        while (null !== s && 3 === s.nodeType) {
            i += s.textContent;
            s = s.nextSibling;
        }
        const n = e.ep.parse(i, 1);
        if (null === n) return s;
        const r = t.parentNode;
        r.insertBefore(this.me(e.h("au-m")), t);
        e.rows.push([ new TextBindingInstruction(n, !!e.def.isStrictBinding) ]);
        t.textContent = "";
        s = t.nextSibling;
        while (null !== s && 3 === s.nodeType) {
            r.removeChild(s);
            s = t.nextSibling;
        }
        return t.nextSibling;
    }
    ue(t, e, i, s) {
        const n = BindablesInfo.from(i, true);
        const r = e.length;
        const o = [];
        let l;
        let h;
        let c = 0;
        let a = 0;
        let u;
        let f;
        let d;
        let p;
        for (let v = 0; v < r; ++v) {
            a = e.charCodeAt(v);
            if (92 === a) ++v; else if (58 === a) {
                l = e.slice(c, v);
                while (e.charCodeAt(++v) <= 32) ;
                c = v;
                for (;v < r; ++v) {
                    a = e.charCodeAt(v);
                    if (92 === a) ++v; else if (59 === a) {
                        h = e.slice(c, v);
                        break;
                    }
                }
                if (void 0 === h) h = e.slice(c);
                f = s.fe.parse(l, h);
                d = s.ce(f);
                p = n.attrs[f.target];
                if (null == p) throw new Error(`AUR0707:${i.name}.${f.target}`);
                if (null === d) {
                    u = s.ep.parse(h, 1);
                    o.push(null === u ? new SetPropertyInstruction(h, p.property) : new InterpolationInstruction(u, p.property));
                } else {
                    Hs.node = t;
                    Hs.attr = f;
                    Hs.bindable = p;
                    Hs.def = i;
                    o.push(d.build(Hs));
                }
                while (v < r && e.charCodeAt(++v) <= 32) ;
                c = v;
                l = void 0;
                h = void 0;
            }
        }
        Fs();
        return o;
    }
    re(t, i) {
        var s, n;
        const r = t;
        const o = e.toArray(r.querySelectorAll("template[as-custom-element]"));
        const l = o.length;
        if (0 === l) return;
        if (l === r.childElementCount) throw new Error(`AUR0708`);
        const h = new Set;
        const c = [];
        for (const t of o) {
            if (t.parentNode !== r) throw new Error(`AUR0709`);
            const s = Zs(t, h);
            const n = class LocalTemplate {};
            const o = t.content;
            const l = e.toArray(o.querySelectorAll("bindable"));
            const a = I.for(n);
            const u = new Set;
            const f = new Set;
            for (const t of l) {
                if (t.parentNode !== o) throw new Error(`AUR0710`);
                const e = t.getAttribute("property");
                if (null === e) throw new Error(`AUR0711`);
                const i = t.getAttribute("attribute");
                if (null !== i && f.has(i) || u.has(e)) throw new Error(`AUR0712:${e}+${i}`); else {
                    if (null !== i) f.add(i);
                    u.add(e);
                }
                a.add({
                    property: e,
                    attribute: null !== i && void 0 !== i ? i : void 0,
                    mode: Js(t)
                });
                const s = t.getAttributeNames().filter((t => !Ks.includes(t)));
                if (s.length > 0) ;
                o.removeChild(t);
            }
            c.push(n);
            i.ye(ue({
                name: s,
                template: t
            }, n));
            r.removeChild(t);
        }
        let a = 0;
        const u = c.length;
        for (;u > a; ++a) ve(c[a]).dependencies.push(...null !== (s = i.def.dependencies) && void 0 !== s ? s : e.emptyArray, ...null !== (n = i.deps) && void 0 !== n ? n : e.emptyArray);
    }
    xe(t) {
        return "INPUT" === t.nodeName && 1 === zs[t.type];
    }
    ge(t, e) {
        switch (t.nodeName) {
          case "INPUT":
            {
                const t = e;
                let i;
                let s;
                let n = 0;
                let r;
                for (let e = 0; e < t.length && n < 3; e++) {
                    r = t[e];
                    switch (r.to) {
                      case "model":
                      case "value":
                      case "matcher":
                        i = e;
                        n++;
                        break;

                      case "checked":
                        s = e;
                        n++;
                        break;
                    }
                }
                if (void 0 !== s && void 0 !== i && s < i) [t[i], t[s]] = [ t[s], t[i] ];
            }
        }
    }
    me(t) {
        t.classList.add("au");
        return t;
    }
    be(t, e) {
        const i = t.parentNode;
        const s = e.h("au-m");
        this.me(i.insertBefore(s, t));
        i.removeChild(t);
        return s;
    }
}

class CompilationContext {
    constructor(i, s, n, r, o, l) {
        this.hasSlot = false;
        this.ke = x();
        const h = null !== r;
        this.c = s;
        this.root = null === o ? this : o;
        this.def = i;
        this.ci = n;
        this.parent = r;
        this.ne = h ? r.ne : s.get(_s);
        this.fe = h ? r.fe : s.get(W);
        this.ep = h ? r.ep : s.get(t.IExpressionParser);
        this.m = h ? r.m : s.get(et);
        this.Ut = h ? r.Ut : s.get(e.ILogger);
        this.p = h ? r.p : s.get(J);
        this.localEls = h ? r.localEls : new Set;
        this.rows = null !== l && void 0 !== l ? l : [];
    }
    ye(t) {
        var e;
        var i;
        (null !== (e = (i = this.root).deps) && void 0 !== e ? e : i.deps = []).push(t);
        this.root.c.register(t);
    }
    h(t) {
        const e = this.p.document.createElement(t);
        if ("template" === t) this.p.document.adoptNode(e.content);
        return e;
    }
    he(t) {
        return this.c.find(ge, t);
    }
    ae(t) {
        return this.c.find(Ht, t);
    }
    we(t) {
        return new CompilationContext(this.def, this.c, this.ci, this, this.root, t);
    }
    ce(t) {
        if (this.root !== this) return this.root.ce(t);
        const e = t.command;
        if (null === e) return null;
        let i = this.ke[e];
        if (void 0 === i) {
            i = this.c.create(Ls, e);
            if (null === i) throw new Error(`AUR0713:${e}`);
            this.ke[e] = i;
        }
        return i;
    }
}

function Ms(t) {
    const e = t.length;
    let i = 0;
    let s = 0;
    while (e > s) {
        i = t.charCodeAt(s);
        if (92 === i) ++s; else if (58 === i) return true; else if (36 === i && 123 === t.charCodeAt(s + 1)) return false;
        ++s;
    }
    return false;
}

function Fs() {
    Hs.node = Hs.attr = Hs.bindable = Hs.def = null;
}

const js = {
    projections: null
};

const Ns = {
    name: "unnamed"
};

const Hs = {
    node: null,
    attr: null,
    bindable: null,
    def: null
};

const Ws = Object.assign(x(), {
    id: true,
    name: true,
    "au-slot": true,
    "as-element": true
});

const zs = {
    checkbox: 1,
    radio: 1
};

const Gs = new WeakMap;

class BindablesInfo {
    constructor(t, e, i) {
        this.attrs = t;
        this.bindables = e;
        this.primary = i;
    }
    static from(e, i) {
        let s = Gs.get(e);
        if (null == s) {
            const n = e.bindables;
            const r = x();
            const o = i ? void 0 === e.defaultBindingMode ? t.BindingMode.default : e.defaultBindingMode : t.BindingMode.default;
            let l;
            let h;
            let c = false;
            let a;
            let u;
            for (h in n) {
                l = n[h];
                u = l.attribute;
                if (true === l.primary) {
                    if (c) throw new Error(`AUR0714:${e.name}`);
                    c = true;
                    a = l;
                } else if (!c && null == a) a = l;
                r[u] = BindableDefinition.create(h, e.Type, l);
            }
            if (null == l && i) a = r.value = BindableDefinition.create("value", e.Type, {
                mode: o
            });
            Gs.set(e, s = new BindablesInfo(r, n, a));
        }
        return s;
    }
}

var Xs;

(function(t) {
    t["property"] = "property";
    t["attribute"] = "attribute";
    t["mode"] = "mode";
})(Xs || (Xs = {}));

const Ks = Object.freeze([ "property", "attribute", "mode" ]);

const Ys = "as-custom-element";

function Zs(t, e) {
    const i = t.getAttribute(Ys);
    if (null === i || "" === i) throw new Error(`AUR0715`);
    if (e.has(i)) throw new Error(`AUR0716:${i}`); else {
        e.add(i);
        t.removeAttribute(Ys);
    }
    return i;
}

function Js(e) {
    switch (e.getAttribute("mode")) {
      case "oneTime":
        return t.BindingMode.oneTime;

      case "toView":
        return t.BindingMode.toView;

      case "fromView":
        return t.BindingMode.fromView;

      case "twoWay":
        return t.BindingMode.twoWay;

      case "default":
      default:
        return t.BindingMode.default;
    }
}

const Qs = e.DI.createInterface("ITemplateCompilerHooks");

const tn = new WeakMap;

const en = d("compiler-hooks");

const sn = Object.freeze({
    name: en,
    define(t) {
        let e = tn.get(t);
        if (void 0 === e) {
            tn.set(t, e = new TemplateCompilerHooksDefinition(t));
            c(en, e, t);
            p(t, en);
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
        t.register(q(Qs, this.Type));
    }
}

const nn = t => {
    return void 0 === t ? e : e(t);
    function e(t) {
        return sn.define(t);
    }
};

const rn = "default";

const on = "au-slot";

class BindingModeBehavior {
    constructor(t) {
        this.mode = t;
        this.Ce = new Map;
    }
    bind(t, e, i) {
        this.Ce.set(i, i.mode);
        i.mode = this.mode;
    }
    unbind(t, e, i) {
        i.mode = this.Ce.get(i);
        this.Ce.delete(i);
    }
}

class OneTimeBindingBehavior extends BindingModeBehavior {
    constructor() {
        super(t.BindingMode.oneTime);
    }
}

class ToViewBindingBehavior extends BindingModeBehavior {
    constructor() {
        super(t.BindingMode.toView);
    }
}

class FromViewBindingBehavior extends BindingModeBehavior {
    constructor() {
        super(t.BindingMode.fromView);
    }
}

class TwoWayBindingBehavior extends BindingModeBehavior {
    constructor() {
        super(t.BindingMode.twoWay);
    }
}

t.bindingBehavior("oneTime")(OneTimeBindingBehavior);

t.bindingBehavior("toView")(ToViewBindingBehavior);

t.bindingBehavior("fromView")(FromViewBindingBehavior);

t.bindingBehavior("twoWay")(TwoWayBindingBehavior);

const ln = 200;

class DebounceBindingBehavior extends t.BindingInterceptor {
    constructor(t, i) {
        super(t, i);
        this.opts = {
            delay: ln
        };
        this.firstArg = null;
        this.task = null;
        this.taskQueue = t.locator.get(e.IPlatform).taskQueue;
        if (i.args.length > 0) this.firstArg = i.args[0];
    }
    callSource(t) {
        this.queueTask((() => this.binding.callSource(t)));
        return;
    }
    handleChange(t, e, i) {
        if (null !== this.task) {
            this.task.cancel();
            this.task = null;
        }
        this.binding.handleChange(t, e, i);
    }
    updateSource(t, e) {
        this.queueTask((() => this.binding.updateSource(t, e)));
    }
    queueTask(t) {
        const e = this.task;
        this.task = this.taskQueue.queueTask((() => {
            this.task = null;
            return t();
        }), this.opts);
        null === e || void 0 === e ? void 0 : e.cancel();
    }
    $bind(t, e) {
        if (null !== this.firstArg) {
            const i = Number(this.firstArg.evaluate(t, e, this.locator, null));
            this.opts.delay = isNaN(i) ? ln : i;
        }
        this.binding.$bind(t, e);
    }
    $unbind(t) {
        var e;
        null === (e = this.task) || void 0 === e ? void 0 : e.cancel();
        this.task = null;
        this.binding.$unbind(t);
    }
}

t.bindingBehavior("debounce")(DebounceBindingBehavior);

class SignalBindingBehavior {
    constructor(t) {
        this.Yt = new Map;
        this.Ae = t;
    }
    bind(t, e, i, ...s) {
        if (!("handleChange" in i)) throw new Error(`AUR0817`);
        if (0 === s.length) throw new Error(`AUR0818`);
        this.Yt.set(i, s);
        let n;
        for (n of s) this.Ae.addSignalListener(n, i);
    }
    unbind(t, e, i) {
        const s = this.Yt.get(i);
        this.Yt.delete(i);
        let n;
        for (n of s) this.Ae.removeSignalListener(n, i);
    }
}

SignalBindingBehavior.inject = [ t.ISignaler ];

t.bindingBehavior("signal")(SignalBindingBehavior);

const hn = 200;

class ThrottleBindingBehavior extends t.BindingInterceptor {
    constructor(t, i) {
        super(t, i);
        this.opts = {
            delay: hn
        };
        this.firstArg = null;
        this.task = null;
        this.lastCall = 0;
        this.delay = 0;
        this.p = t.locator.get(e.IPlatform);
        this.Re = this.p.taskQueue;
        if (i.args.length > 0) this.firstArg = i.args[0];
    }
    callSource(t) {
        this.Se((() => this.binding.callSource(t)));
        return;
    }
    handleChange(t, e, i) {
        if (null !== this.task) {
            this.task.cancel();
            this.task = null;
            this.lastCall = this.p.performanceNow();
        }
        this.binding.handleChange(t, e, i);
    }
    updateSource(t, e) {
        this.Se((() => this.binding.updateSource(t, e)));
    }
    Se(t) {
        const e = this.opts;
        const i = this.p;
        const s = this.lastCall + e.delay - i.performanceNow();
        if (s > 0) {
            const n = this.task;
            e.delay = s;
            this.task = this.Re.queueTask((() => {
                this.lastCall = i.performanceNow();
                this.task = null;
                e.delay = this.delay;
                t();
            }), e);
            null === n || void 0 === n ? void 0 : n.cancel();
        } else {
            this.lastCall = i.performanceNow();
            t();
        }
    }
    $bind(t, e) {
        if (null !== this.firstArg) {
            const i = Number(this.firstArg.evaluate(t, e, this.locator, null));
            this.opts.delay = this.delay = isNaN(i) ? hn : i;
        }
        this.binding.$bind(t, e);
    }
    $unbind(t) {
        var e;
        null === (e = this.task) || void 0 === e ? void 0 : e.cancel();
        this.task = null;
        super.$unbind(t);
    }
}

t.bindingBehavior("throttle")(ThrottleBindingBehavior);

class DataAttributeAccessor {
    constructor() {
        this.type = 2 | 4;
    }
    getValue(t, e) {
        return t.getAttribute(e);
    }
    setValue(t, e, i, s) {
        if (null == t) i.removeAttribute(s); else i.setAttribute(s, t);
    }
}

const cn = new DataAttributeAccessor;

class AttrBindingBehavior {
    bind(t, e, i) {
        i.targetObserver = cn;
    }
    unbind(t, e, i) {
        return;
    }
}

t.bindingBehavior("attr")(AttrBindingBehavior);

function an(t) {
    const e = t.composedPath()[0];
    if (this.target !== e) return;
    return this.selfEventCallSource(t);
}

class SelfBindingBehavior {
    bind(t, e, i) {
        if (!i.callSource || !i.targetEvent) throw new Error(`AUR0801`);
        i.selfEventCallSource = i.callSource;
        i.callSource = an;
    }
    unbind(t, e, i) {
        i.callSource = i.selfEventCallSource;
        i.selfEventCallSource = null;
    }
}

t.bindingBehavior("self")(SelfBindingBehavior);

const un = x();

class AttributeNSAccessor {
    constructor(t) {
        this.ns = t;
        this.type = 2 | 4;
    }
    static forNs(t) {
        var e;
        return null !== (e = un[t]) && void 0 !== e ? e : un[t] = new AttributeNSAccessor(t);
    }
    getValue(t, e) {
        return t.getAttributeNS(this.ns, e);
    }
    setValue(t, e, i, s) {
        if (null == t) i.removeAttributeNS(this.ns, s); else i.setAttributeNS(this.ns, s, t);
    }
}

function fn(t, e) {
    return t === e;
}

class CheckedObserver {
    constructor(t, e, i, s) {
        this.handler = i;
        this.type = 2 | 1 | 4;
        this.v = void 0;
        this.ov = void 0;
        this.Ee = void 0;
        this.Be = void 0;
        this.f = 0;
        this.o = t;
        this.oL = s;
    }
    getValue() {
        return this.v;
    }
    setValue(t, e) {
        const i = this.v;
        if (t === i) return;
        this.v = t;
        this.ov = i;
        this.f = e;
        this.Ie();
        this.Te();
        this.queue.add(this);
    }
    handleCollectionChange(t, e) {
        this.Te();
    }
    handleChange(t, e, i) {
        this.Te();
    }
    Te() {
        const t = this.v;
        const e = this.o;
        const i = g.call(e, "model") ? e.model : e.value;
        const s = "radio" === e.type;
        const n = void 0 !== e.matcher ? e.matcher : fn;
        if (s) e.checked = !!n(t, i); else if (true === t) e.checked = true; else {
            let s = false;
            if (t instanceof Array) s = -1 !== t.findIndex((t => !!n(t, i))); else if (t instanceof Set) {
                for (const e of t) if (n(e, i)) {
                    s = true;
                    break;
                }
            } else if (t instanceof Map) for (const e of t) {
                const t = e[0];
                const r = e[1];
                if (n(t, i) && true === r) {
                    s = true;
                    break;
                }
            }
            e.checked = s;
        }
    }
    handleEvent() {
        let t = this.ov = this.v;
        const e = this.o;
        const i = g.call(e, "model") ? e.model : e.value;
        const s = e.checked;
        const n = void 0 !== e.matcher ? e.matcher : fn;
        if ("checkbox" === e.type) {
            if (t instanceof Array) {
                const e = t.findIndex((t => !!n(t, i)));
                if (s && -1 === e) t.push(i); else if (!s && -1 !== e) t.splice(e, 1);
                return;
            } else if (t instanceof Set) {
                const e = {};
                let r = e;
                for (const e of t) if (true === n(e, i)) {
                    r = e;
                    break;
                }
                if (s && r === e) t.add(i); else if (!s && r !== e) t.delete(r);
                return;
            } else if (t instanceof Map) {
                let e;
                for (const s of t) {
                    const t = s[0];
                    if (true === n(t, i)) {
                        e = t;
                        break;
                    }
                }
                t.set(e, s);
                return;
            }
            t = s;
        } else if (s) t = i; else return;
        this.v = t;
        this.queue.add(this);
    }
    start() {
        this.handler.subscribe(this.o, this);
        this.Ie();
    }
    stop() {
        var t, e;
        this.handler.dispose();
        null === (t = this.Ee) || void 0 === t ? void 0 : t.unsubscribe(this);
        this.Ee = void 0;
        null === (e = this.Be) || void 0 === e ? void 0 : e.unsubscribe(this);
    }
    subscribe(t) {
        if (this.subs.add(t) && 1 === this.subs.count) this.start();
    }
    unsubscribe(t) {
        if (this.subs.remove(t) && 0 === this.subs.count) this.stop();
    }
    flush() {
        dn = this.ov;
        this.ov = this.v;
        this.subs.notify(this.v, dn, this.f);
    }
    Ie() {
        var t, e, i, s, n, r, o;
        const l = this.o;
        null === (n = null !== (t = this.Be) && void 0 !== t ? t : this.Be = null !== (i = null === (e = l.$observers) || void 0 === e ? void 0 : e.model) && void 0 !== i ? i : null === (s = l.$observers) || void 0 === s ? void 0 : s.value) || void 0 === n ? void 0 : n.subscribe(this);
        null === (r = this.Ee) || void 0 === r ? void 0 : r.unsubscribe(this);
        this.Ee = void 0;
        if ("checkbox" === l.type) null === (o = this.Ee = Rn(this.v, this.oL)) || void 0 === o ? void 0 : o.subscribe(this);
    }
}

t.subscriberCollection(CheckedObserver);

t.withFlushQueue(CheckedObserver);

let dn;

const pn = {
    childList: true,
    subtree: true,
    characterData: true
};

function vn(t, e) {
    return t === e;
}

class SelectValueObserver {
    constructor(t, e, i, s) {
        this.type = 2 | 1 | 4;
        this.v = void 0;
        this.ov = void 0;
        this.W = false;
        this.De = void 0;
        this.$e = void 0;
        this.iO = false;
        this.o = t;
        this.oL = s;
        this.handler = i;
    }
    getValue() {
        return this.iO ? this.v : this.o.multiple ? mn(this.o.options) : this.o.value;
    }
    setValue(t, e) {
        this.ov = this.v;
        this.v = t;
        this.W = t !== this.ov;
        this.Pe(t instanceof Array ? t : null);
        if (0 === (32 & e)) this.K();
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
        const e = this.v;
        const i = this.o;
        const s = Array.isArray(e);
        const n = null !== (t = i.matcher) && void 0 !== t ? t : vn;
        const r = i.options;
        let o = r.length;
        while (o-- > 0) {
            const t = r[o];
            const i = g.call(t, "model") ? t.model : t.value;
            if (s) {
                t.selected = -1 !== e.findIndex((t => !!n(i, t)));
                continue;
            }
            t.selected = !!n(i, e);
        }
    }
    syncValue() {
        const t = this.o;
        const e = t.options;
        const i = e.length;
        const s = this.v;
        let n = 0;
        if (t.multiple) {
            if (!(s instanceof Array)) return true;
            let r;
            const o = t.matcher || vn;
            const l = [];
            while (n < i) {
                r = e[n];
                if (r.selected) l.push(g.call(r, "model") ? r.model : r.value);
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
        while (n < i) {
            o = e[n];
            if (o.selected) {
                r = g.call(o, "model") ? o.model : o.value;
                break;
            }
            ++n;
        }
        this.ov = this.v;
        this.v = r;
        return true;
    }
    Oe() {
        (this.$e = new this.o.ownerDocument.defaultView.MutationObserver(this.Le.bind(this))).observe(this.o, pn);
        this.Pe(this.v instanceof Array ? this.v : null);
        this.iO = true;
    }
    qe() {
        var t;
        this.$e.disconnect();
        null === (t = this.De) || void 0 === t ? void 0 : t.unsubscribe(this);
        this.$e = this.De = void 0;
        this.iO = false;
    }
    Pe(t) {
        var e;
        null === (e = this.De) || void 0 === e ? void 0 : e.unsubscribe(this);
        this.De = void 0;
        if (null != t) {
            if (!this.o.multiple) throw new Error(`AUR0654`);
            (this.De = this.oL.getArrayObserver(t)).subscribe(this);
        }
    }
    handleEvent() {
        const t = this.syncValue();
        if (t) this.queue.add(this);
    }
    Le(t) {
        this.syncOptions();
        const e = this.syncValue();
        if (e) this.queue.add(this);
    }
    subscribe(t) {
        if (this.subs.add(t) && 1 === this.subs.count) {
            this.handler.subscribe(this.o, this);
            this.Oe();
        }
    }
    unsubscribe(t) {
        if (this.subs.remove(t) && 0 === this.subs.count) {
            this.handler.dispose();
            this.qe();
        }
    }
    flush() {
        xn = this.ov;
        this.ov = this.v;
        this.subs.notify(this.v, xn, 0);
    }
}

t.subscriberCollection(SelectValueObserver);

t.withFlushQueue(SelectValueObserver);

function mn(t) {
    const e = [];
    if (0 === t.length) return e;
    const i = t.length;
    let s = 0;
    let n;
    while (i > s) {
        n = t[s];
        if (n.selected) e[e.length] = g.call(n, "model") ? n.model : n.value;
        ++s;
    }
    return e;
}

let xn;

const gn = "--";

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
    setValue(t, e) {
        this.value = t;
        this.W = t !== this.ov;
        if (0 === (32 & e)) this.K();
    }
    Ue(t) {
        const e = [];
        const i = /url\([^)]+$/;
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
            if (i.test(n)) {
                n += ";";
                continue;
            }
            o = n.indexOf(":");
            l = n.substring(0, o).trim();
            h = n.substring(o + 1).trim();
            e.push([ l, h ]);
            n = "";
        }
        return e;
    }
    _e(t) {
        let i;
        let s;
        const n = [];
        for (s in t) {
            i = t[s];
            if (null == i) continue;
            if (C(i)) {
                if (s.startsWith(gn)) {
                    n.push([ s, i ]);
                    continue;
                }
                n.push([ e.kebabCase(s), i ]);
                continue;
            }
            n.push(...this.Ve(i));
        }
        return n;
    }
    Me(t) {
        const i = t.length;
        if (i > 0) {
            const e = [];
            let s = 0;
            for (;i > s; ++s) e.push(...this.Ve(t[s]));
            return e;
        }
        return e.emptyArray;
    }
    Ve(t) {
        if (C(t)) return this.Ue(t);
        if (t instanceof Array) return this.Me(t);
        if (t instanceof Object) return this._e(t);
        return e.emptyArray;
    }
    K() {
        if (this.W) {
            this.W = false;
            const t = this.value;
            const e = this.styles;
            const i = this.Ve(t);
            let s;
            let n = this.version;
            this.ov = t;
            let r;
            let o;
            let l;
            let h = 0;
            const c = i.length;
            for (;h < c; ++h) {
                r = i[h];
                o = r[0];
                l = r[1];
                this.setProperty(o, l);
                e[o] = n;
            }
            this.styles = e;
            this.version += 1;
            if (0 === n) return;
            n -= 1;
            for (s in e) {
                if (!g.call(e, s) || e[s] !== n) continue;
                this.obj.style.removeProperty(s);
            }
        }
    }
    setProperty(t, e) {
        let i = "";
        if (null != e && k(e.indexOf) && e.includes("!important")) {
            i = "important";
            e = e.replace("!important", "");
        }
        this.obj.style.setProperty(t, e, i);
    }
    bind(t) {
        this.value = this.ov = this.obj.style.cssText;
    }
}

class ValueAttributeObserver {
    constructor(t, e, i) {
        this.handler = i;
        this.type = 2 | 1 | 4;
        this.v = "";
        this.ov = "";
        this.W = false;
        this.o = t;
        this.k = e;
    }
    getValue() {
        return this.v;
    }
    setValue(t, e) {
        if (Object.is(t, this.v)) return;
        this.ov = this.v;
        this.v = t;
        this.W = true;
        if (!this.handler.config.readonly && 0 === (32 & e)) this.K(e);
    }
    K(t) {
        var e;
        if (this.W) {
            this.W = false;
            this.o[this.k] = null !== (e = this.v) && void 0 !== e ? e : this.handler.config.default;
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
        wn = this.ov;
        this.ov = this.v;
        this.subs.notify(this.v, wn, 0);
    }
}

t.subscriberCollection(ValueAttributeObserver);

t.withFlushQueue(ValueAttributeObserver);

let wn;

const bn = "http://www.w3.org/1999/xlink";

const yn = "http://www.w3.org/XML/1998/namespace";

const kn = "http://www.w3.org/2000/xmlns/";

const Cn = Object.assign(x(), {
    "xlink:actuate": [ "actuate", bn ],
    "xlink:arcrole": [ "arcrole", bn ],
    "xlink:href": [ "href", bn ],
    "xlink:role": [ "role", bn ],
    "xlink:show": [ "show", bn ],
    "xlink:title": [ "title", bn ],
    "xlink:type": [ "type", bn ],
    "xml:lang": [ "lang", yn ],
    "xml:space": [ "space", yn ],
    xmlns: [ "xmlns", kn ],
    "xmlns:xlink": [ "xlink", kn ]
});

const An = new t.PropertyAccessor;

An.type = 2 | 4;

class NodeObserverConfig {
    constructor(t) {
        var e;
        this.type = null !== (e = t.type) && void 0 !== e ? e : ValueAttributeObserver;
        this.events = t.events;
        this.readonly = t.readonly;
        this.default = t.default;
    }
}

class NodeObserverLocator {
    constructor(t, e, i, s) {
        this.locator = t;
        this.platform = e;
        this.dirtyChecker = i;
        this.svgAnalyzer = s;
        this.allowDirtyCheck = true;
        this.Fe = x();
        this.je = x();
        this.Ne = x();
        this.He = x();
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
    static register(e) {
        U(t.INodeObserverLocator, NodeObserverLocator).register(e);
        q(t.INodeObserverLocator, NodeObserverLocator).register(e);
    }
    handles(t, e) {
        return t instanceof this.platform.Node;
    }
    useConfig(t, e, i) {
        var s, n;
        const r = this.Fe;
        let o;
        if (C(t)) {
            o = null !== (s = r[t]) && void 0 !== s ? s : r[t] = x();
            if (null == o[e]) o[e] = new NodeObserverConfig(i); else Sn(t, e);
        } else for (const i in t) {
            o = null !== (n = r[i]) && void 0 !== n ? n : r[i] = x();
            const s = t[i];
            for (e in s) if (null == o[e]) o[e] = new NodeObserverConfig(s[e]); else Sn(i, e);
        }
    }
    useConfigGlobal(t, e) {
        const i = this.je;
        if ("object" === typeof t) for (const e in t) if (null == i[e]) i[e] = new NodeObserverConfig(t[e]); else Sn("*", e); else if (null == i[t]) i[t] = new NodeObserverConfig(e); else Sn("*", t);
    }
    getAccessor(t, i, s) {
        var n;
        if (i in this.He || i in (null !== (n = this.Ne[t.tagName]) && void 0 !== n ? n : e.emptyObject)) return this.getObserver(t, i, s);
        switch (i) {
          case "src":
          case "href":
          case "role":
            return cn;

          default:
            {
                const e = Cn[i];
                if (void 0 !== e) return AttributeNSAccessor.forNs(e[1]);
                if (b(t, i, this.svgAnalyzer)) return cn;
                return An;
            }
        }
    }
    overrideAccessor(t, e) {
        var i, s;
        var n, r;
        let o;
        if (C(t)) {
            o = null !== (i = (n = this.Ne)[t]) && void 0 !== i ? i : n[t] = x();
            o[e] = true;
        } else for (const e in t) for (const i of t[e]) {
            o = null !== (s = (r = this.Ne)[e]) && void 0 !== s ? s : r[e] = x();
            o[i] = true;
        }
    }
    overrideAccessorGlobal(...t) {
        for (const e of t) this.He[e] = true;
    }
    getObserver(e, i, s) {
        var n, r;
        switch (i) {
          case "class":
            return new ClassAttributeAccessor(e);

          case "css":
          case "style":
            return new StyleAttributeAccessor(e);
        }
        const o = null !== (r = null === (n = this.Fe[e.tagName]) || void 0 === n ? void 0 : n[i]) && void 0 !== r ? r : this.je[i];
        if (null != o) return new o.type(e, i, new EventSubscriber(o), s, this.locator);
        const l = Cn[i];
        if (void 0 !== l) return AttributeNSAccessor.forNs(l[1]);
        if (b(e, i, this.svgAnalyzer)) return cn;
        if (i in e.constructor.prototype) {
            if (this.allowDirtyCheck) return this.dirtyChecker.createProperty(e, i);
            throw new Error(`AUR0652:${String(i)}`);
        } else return new t.SetterObserver(e, i);
    }
}

NodeObserverLocator.inject = [ e.IServiceLocator, J, t.IDirtyChecker, Q ];

function Rn(t, e) {
    if (t instanceof Array) return e.getArrayObserver(t);
    if (t instanceof Map) return e.getMapObserver(t);
    if (t instanceof Set) return e.getSetObserver(t);
}

function Sn(t, e) {
    throw new Error(`AUR0653:${String(e)}@${t}`);
}

class UpdateTriggerBindingBehavior {
    constructor(t) {
        this.oL = t;
    }
    bind(e, i, s, ...n) {
        if (0 === n.length) throw new Error(`AUR0802`);
        if (s.mode !== t.BindingMode.twoWay && s.mode !== t.BindingMode.fromView) throw new Error(`AUR0803`);
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
    unbind(t, e, i) {
        i.targetObserver.handler.dispose();
        i.targetObserver.handler = i.targetObserver.originalHandler;
        i.targetObserver.originalHandler = null;
    }
}

UpdateTriggerBindingBehavior.inject = [ t.IObserverLocator ];

t.bindingBehavior("updateTrigger")(UpdateTriggerBindingBehavior);

class Focus {
    constructor(t, e) {
        this.We = t;
        this.p = e;
        this.ze = false;
    }
    binding() {
        this.valueChanged();
    }
    valueChanged() {
        if (this.$controller.isActive) this.Ge(); else this.ze = true;
    }
    attached() {
        if (this.ze) {
            this.ze = false;
            this.Ge();
        }
        this.We.addEventListener("focus", this);
        this.We.addEventListener("blur", this);
    }
    afterDetachChildren() {
        const t = this.We;
        t.removeEventListener("focus", this);
        t.removeEventListener("blur", this);
    }
    handleEvent(t) {
        if ("focus" === t.type) this.value = true; else if (!this.Xe) this.value = false;
    }
    Ge() {
        const t = this.We;
        const e = this.Xe;
        const i = this.value;
        if (i && !e) t.focus(); else if (!i && e) t.blur();
    }
    get Xe() {
        return this.We === this.p.document.activeElement;
    }
}

Focus.inject = [ Bi, J ];

r([ S({
    mode: t.BindingMode.twoWay
}) ], Focus.prototype, "value", void 0);

Lt("focus")(Focus);

let En = class Show {
    constructor(t, e, i) {
        this.el = t;
        this.p = e;
        this.Ke = false;
        this.Ye = null;
        this.$val = "";
        this.$prio = "";
        this.update = () => {
            this.Ye = null;
            if (Boolean(this.value) !== this.Ze) if (this.Ze === this.Je) {
                this.Ze = !this.Je;
                this.$val = this.el.style.getPropertyValue("display");
                this.$prio = this.el.style.getPropertyPriority("display");
                this.el.style.setProperty("display", "none", "important");
            } else {
                this.Ze = this.Je;
                this.el.style.setProperty("display", this.$val, this.$prio);
                if ("" === this.el.getAttribute("style")) this.el.removeAttribute("style");
            }
        };
        this.Ze = this.Je = "hide" !== i.alias;
    }
    binding() {
        this.Ke = true;
        this.update();
    }
    detaching() {
        var t;
        this.Ke = false;
        null === (t = this.Ye) || void 0 === t ? void 0 : t.cancel();
        this.Ye = null;
    }
    valueChanged() {
        if (this.Ke && null === this.Ye) this.Ye = this.p.domWriteQueue.queueTask(this.update);
    }
};

r([ S ], En.prototype, "value", void 0);

En = r([ o(0, Bi), o(1, J), o(2, Hi) ], En);

t.alias("hide")(En);

Lt("show")(En);

class Portal {
    constructor(t, i, s) {
        this.id = e.nextId("au$component");
        this.strict = false;
        this.p = s;
        this.Qe = s.document.createElement("div");
        this.view = t.create();
        Pi(this.view.nodes, i);
    }
    attaching(t, e, i) {
        if (null == this.callbackContext) this.callbackContext = this.$controller.scope.bindingContext;
        const s = this.Qe = this.ti();
        this.view.setHost(s);
        return this.ei(t, s, i);
    }
    detaching(t, e, i) {
        return this.ii(t, this.Qe, i);
    }
    targetChanged() {
        const {$controller: t} = this;
        if (!t.isActive) return;
        const i = this.Qe;
        const s = this.Qe = this.ti();
        if (i === s) return;
        this.view.setHost(s);
        const n = e.onResolve(this.ii(null, s, t.flags), (() => this.ei(null, s, t.flags)));
        if (y(n)) n.catch((t => {
            throw t;
        }));
    }
    ei(t, i, s) {
        const {activating: n, callbackContext: r, view: o} = this;
        o.setHost(i);
        return e.onResolve(null === n || void 0 === n ? void 0 : n.call(r, i, o), (() => this.si(t, i, s)));
    }
    si(t, i, s) {
        const {$controller: n, view: r} = this;
        if (null === t) r.nodes.appendTo(i); else return e.onResolve(r.activate(null !== t && void 0 !== t ? t : r, n, s, n.scope), (() => this.ni(i)));
        return this.ni(i);
    }
    ni(t) {
        const {activated: e, callbackContext: i, view: s} = this;
        return null === e || void 0 === e ? void 0 : e.call(i, t, s);
    }
    ii(t, i, s) {
        const {deactivating: n, callbackContext: r, view: o} = this;
        return e.onResolve(null === n || void 0 === n ? void 0 : n.call(r, i, o), (() => this.ri(t, i, s)));
    }
    ri(t, i, s) {
        const {$controller: n, view: r} = this;
        if (null === t) r.nodes.remove(); else return e.onResolve(r.deactivate(t, n, s), (() => this.oi(i)));
        return this.oi(i);
    }
    oi(t) {
        const {deactivated: e, callbackContext: i, view: s} = this;
        return null === e || void 0 === e ? void 0 : e.call(i, t, s);
    }
    ti() {
        const t = this.p;
        const e = t.document;
        let i = this.target;
        let s = this.renderContext;
        if ("" === i) {
            if (this.strict) throw new Error(`AUR0811`);
            return e.body;
        }
        if (C(i)) {
            let n = e;
            if (C(s)) s = e.querySelector(s);
            if (s instanceof t.Node) n = s;
            i = n.querySelector(i);
        }
        if (i instanceof t.Node) return i;
        if (null == i) {
            if (this.strict) throw new Error(`AUR0812`);
            return e.body;
        }
        return i;
    }
    dispose() {
        this.view.dispose();
        this.view = void 0;
        this.callbackContext = null;
    }
    accept(t) {
        var e;
        if (true === (null === (e = this.view) || void 0 === e ? void 0 : e.accept(t))) return true;
    }
}

Portal.inject = [ Me, Ti, J ];

r([ S({
    primary: true
}) ], Portal.prototype, "target", void 0);

r([ S({
    callback: "targetChanged"
}) ], Portal.prototype, "renderContext", void 0);

r([ S() ], Portal.prototype, "strict", void 0);

r([ S() ], Portal.prototype, "deactivating", void 0);

r([ S() ], Portal.prototype, "activating", void 0);

r([ S() ], Portal.prototype, "deactivated", void 0);

r([ S() ], Portal.prototype, "activated", void 0);

r([ S() ], Portal.prototype, "callbackContext", void 0);

qt("portal")(Portal);

class If {
    constructor(t, i, s) {
        this.ifFactory = t;
        this.location = i;
        this.work = s;
        this.id = e.nextId("au$component");
        this.elseFactory = void 0;
        this.elseView = void 0;
        this.ifView = void 0;
        this.view = void 0;
        this.value = false;
        this.cache = true;
        this.pending = void 0;
        this.li = false;
        this.hi = 0;
    }
    attaching(t, i, s) {
        let n;
        const r = this.$controller;
        const o = this.hi++;
        const l = () => !this.li && this.hi === o + 1;
        return e.onResolve(this.pending, (() => {
            var i;
            if (!l()) return;
            this.pending = void 0;
            if (this.value) n = this.view = this.ifView = this.cache && null != this.ifView ? this.ifView : this.ifFactory.create(); else n = this.view = this.elseView = this.cache && null != this.elseView ? this.elseView : null === (i = this.elseFactory) || void 0 === i ? void 0 : i.create();
            if (null == n) return;
            n.setLocation(this.location);
            this.pending = e.onResolve(n.activate(t, r, s, r.scope), (() => {
                if (l()) this.pending = void 0;
            }));
        }));
    }
    detaching(t, i, s) {
        this.li = true;
        return e.onResolve(this.pending, (() => {
            var e;
            this.li = false;
            this.pending = void 0;
            void (null === (e = this.view) || void 0 === e ? void 0 : e.deactivate(t, this.$controller, s));
        }));
    }
    valueChanged(t, i, s) {
        if (!this.$controller.isActive) return;
        t = !!t;
        i = !!i;
        if (t === i) return;
        this.work.start();
        const n = this.view;
        const r = this.$controller;
        const o = this.hi++;
        const l = () => !this.li && this.hi === o + 1;
        let h;
        return e.onResolve(e.onResolve(this.pending, (() => this.pending = e.onResolve(null === n || void 0 === n ? void 0 : n.deactivate(n, r, s), (() => {
            var i;
            if (!l()) return;
            if (t) h = this.view = this.ifView = this.cache && null != this.ifView ? this.ifView : this.ifFactory.create(); else h = this.view = this.elseView = this.cache && null != this.elseView ? this.elseView : null === (i = this.elseFactory) || void 0 === i ? void 0 : i.create();
            if (null == h) return;
            h.setLocation(this.location);
            return e.onResolve(h.activate(h, r, s, r.scope), (() => {
                if (l()) this.pending = void 0;
            }));
        })))), (() => this.work.finish()));
    }
    dispose() {
        var t, e;
        null === (t = this.ifView) || void 0 === t ? void 0 : t.dispose();
        null === (e = this.elseView) || void 0 === e ? void 0 : e.dispose();
        this.ifView = this.elseView = this.view = void 0;
    }
    accept(t) {
        var e;
        if (true === (null === (e = this.view) || void 0 === e ? void 0 : e.accept(t))) return true;
    }
}

If.inject = [ Me, Ti, Ri ];

r([ S ], If.prototype, "value", void 0);

r([ S({
    set: t => "" === t || !!t && "false" !== t
}) ], If.prototype, "cache", void 0);

qt("if")(If);

class Else {
    constructor(t) {
        this.factory = t;
        this.id = e.nextId("au$component");
    }
    link(t, e, i, s) {
        const n = t.children;
        const r = n[n.length - 1];
        if (r instanceof If) r.elseFactory = this.factory; else if (r.viewModel instanceof If) r.viewModel.elseFactory = this.factory; else throw new Error(`AUR0810`);
    }
}

Else.inject = [ Me ];

qt({
    name: "else"
})(Else);

function Bn(t) {
    t.dispose();
}

const In = [ 38963, 36914 ];

class Repeat {
    constructor(t, i, s) {
        this.l = t;
        this.ai = i;
        this.f = s;
        this.id = e.nextId("au$component");
        this.views = [];
        this.key = void 0;
        this.ui = void 0;
        this.fi = false;
        this.di = false;
        this.pi = null;
        this.vi = void 0;
        this.mi = false;
    }
    binding(t, e, i) {
        const s = this.ai.bindings;
        const n = s.length;
        let r;
        let o;
        let l = 0;
        for (;n > l; ++l) {
            r = s[l];
            if (r.target === this && "items" === r.targetProperty) {
                o = this.forOf = r.sourceExpression;
                this.xi = r;
                let t = o.iterable;
                while (null != t && In.includes(t.$kind)) {
                    t = t.expression;
                    this.fi = true;
                }
                this.pi = t;
                break;
            }
        }
        this.gi(i);
        const h = o.declaration;
        if (!(this.mi = 90138 === h.$kind || 106523 === h.$kind)) this.local = h.evaluate(i, this.$controller.scope, r.locator, null);
    }
    attaching(t, e, i) {
        this.wi(i);
        return this.bi(t, i);
    }
    detaching(t, e, i) {
        this.gi(i);
        return this.yi(t, i);
    }
    itemsChanged(t) {
        const {$controller: i} = this;
        if (!i.isActive) return;
        t |= i.flags;
        this.gi(t);
        this.wi(t);
        const s = e.onResolve(this.yi(null, t), (() => this.bi(null, t)));
        if (y(s)) s.catch(R);
    }
    handleCollectionChange(i, s) {
        const {$controller: n} = this;
        if (!n.isActive) return;
        if (this.fi) {
            if (this.di) return;
            this.di = true;
            this.items = this.forOf.iterable.evaluate(s, n.scope, this.xi.locator, null);
            this.di = false;
            return;
        }
        s |= n.flags;
        this.wi(s);
        if (void 0 === i) {
            const t = e.onResolve(this.yi(null, s), (() => this.bi(null, s)));
            if (y(t)) t.catch(R);
        } else {
            const n = this.views.length;
            const r = t.applyMutationsToIndices(i);
            if (r.deletedItems.length > 0) {
                r.deletedItems.sort(e.compareNumber);
                const t = e.onResolve(this.ki(r, s), (() => this.Ci(n, r, s)));
                if (y(t)) t.catch(R);
            } else this.Ci(n, r, s);
        }
    }
    gi(e) {
        var i;
        const s = this.$controller.scope;
        let n = this.Ai;
        let r = this.fi;
        let o;
        if (r) {
            n = this.Ai = null !== (i = this.pi.evaluate(e, s, this.xi.locator, null)) && void 0 !== i ? i : null;
            r = this.fi = !Object.is(this.items, n);
        }
        const l = this.ui;
        if (this.$controller.isActive) {
            o = this.ui = t.getCollectionObserver(r ? n : this.items);
            if (l !== o) {
                null === l || void 0 === l ? void 0 : l.unsubscribe(this);
                null === o || void 0 === o ? void 0 : o.subscribe(this);
            }
        } else {
            null === l || void 0 === l ? void 0 : l.unsubscribe(this);
            this.ui = void 0;
        }
    }
    wi(t) {
        const e = this.items;
        if (e instanceof Array) {
            this.vi = e;
            return;
        }
        const i = this.forOf;
        if (void 0 === i) return;
        const s = [];
        this.forOf.iterate(t, e, ((t, e, i) => {
            s[e] = i;
        }));
        this.vi = s;
    }
    bi(e, i) {
        let s;
        let n;
        let r;
        let o;
        const {$controller: l, f: h, local: c, l: a, items: u} = this;
        const f = l.scope;
        const d = this.forOf;
        const p = d.count(i, u);
        const v = this.views = Array(p);
        d.iterate(i, u, ((u, m, x) => {
            r = v[m] = h.create().setLocation(a);
            r.nodes.unlink();
            if (this.mi) d.declaration.assign(i, o = t.Scope.fromParent(f, t.BindingContext.create()), this.xi.locator, x); else o = t.Scope.fromParent(f, t.BindingContext.create(c, x));
            On(o.overrideContext, m, p);
            n = r.activate(null !== e && void 0 !== e ? e : r, l, i, o);
            if (y(n)) (null !== s && void 0 !== s ? s : s = []).push(n);
        }));
        if (void 0 !== s) return 1 === s.length ? s[0] : Promise.all(s);
    }
    yi(t, e) {
        let i;
        let s;
        let n;
        let r = 0;
        const {views: o, $controller: l} = this;
        const h = o.length;
        for (;h > r; ++r) {
            n = o[r];
            n.release();
            s = n.deactivate(null !== t && void 0 !== t ? t : n, l, e);
            if (y(s)) (null !== i && void 0 !== i ? i : i = []).push(s);
        }
        if (void 0 !== i) return 1 === i.length ? i[0] : Promise.all(i);
    }
    ki(t, e) {
        let i;
        let s;
        let n;
        const {$controller: r, views: o} = this;
        const l = t.deletedItems;
        const h = l.length;
        let c = 0;
        for (;h > c; ++c) {
            n = o[l[c]];
            n.release();
            s = n.deactivate(n, r, e);
            if (y(s)) (null !== i && void 0 !== i ? i : i = []).push(s);
        }
        c = 0;
        let a = 0;
        for (;h > c; ++c) {
            a = l[c] - c;
            o.splice(a, 1);
        }
        if (void 0 !== i) return 1 === i.length ? i[0] : Promise.all(i);
    }
    Ci(e, i, s) {
        var n;
        let r;
        let o;
        let l;
        let h;
        let c = 0;
        const {$controller: a, f: u, local: f, vi: d, l: p, views: v} = this;
        const m = i.length;
        for (;m > c; ++c) if (-2 === i[c]) {
            l = u.create();
            v.splice(c, 0, l);
        }
        if (v.length !== m) throw new Error(`AUR0814:${v.length}!=${m}`);
        const x = a.scope;
        const g = i.length;
        t.synchronizeIndices(v, i);
        const w = Pn(i);
        const b = w.length;
        let k;
        let C = b - 1;
        c = g - 1;
        for (;c >= 0; --c) {
            l = v[c];
            k = v[c + 1];
            l.nodes.link(null !== (n = null === k || void 0 === k ? void 0 : k.nodes) && void 0 !== n ? n : p);
            if (-2 === i[c]) {
                if (this.mi) this.forOf.declaration.assign(s, h = t.Scope.fromParent(x, t.BindingContext.create()), this.xi.locator, d[c]); else h = t.Scope.fromParent(x, t.BindingContext.create(f, d[c]));
                On(h.overrideContext, c, g);
                l.setLocation(p);
                o = l.activate(l, a, s, h);
                if (y(o)) (null !== r && void 0 !== r ? r : r = []).push(o);
            } else if (C < 0 || 1 === b || c !== w[C]) {
                On(l.scope.overrideContext, c, g);
                l.nodes.insertBefore(l.location);
            } else {
                if (e !== g) On(l.scope.overrideContext, c, g);
                --C;
            }
        }
        if (void 0 !== r) return 1 === r.length ? r[0] : Promise.all(r);
    }
    dispose() {
        this.views.forEach(Bn);
        this.views = void 0;
    }
    accept(t) {
        const {views: e} = this;
        if (void 0 !== e) for (let i = 0, s = e.length; i < s; ++i) if (true === e[i].accept(t)) return true;
    }
}

Repeat.inject = [ Ti, ci, Me ];

r([ S ], Repeat.prototype, "items", void 0);

qt("repeat")(Repeat);

let Tn = 16;

let Dn = new Int32Array(Tn);

let $n = new Int32Array(Tn);

function Pn(t) {
    const e = t.length;
    if (e > Tn) {
        Tn = e;
        Dn = new Int32Array(e);
        $n = new Int32Array(e);
    }
    let i = 0;
    let s = 0;
    let n = 0;
    let r = 0;
    let o = 0;
    let l = 0;
    let h = 0;
    let c = 0;
    for (;r < e; r++) {
        s = t[r];
        if (-2 !== s) {
            o = Dn[i];
            n = t[o];
            if (-2 !== n && n < s) {
                $n[r] = o;
                Dn[++i] = r;
                continue;
            }
            l = 0;
            h = i;
            while (l < h) {
                c = l + h >> 1;
                n = t[Dn[c]];
                if (-2 !== n && n < s) l = c + 1; else h = c;
            }
            n = t[Dn[l]];
            if (s < n || -2 === n) {
                if (l > 0) $n[r] = Dn[l - 1];
                Dn[l] = r;
            }
        }
    }
    r = ++i;
    const a = new Int32Array(r);
    s = Dn[i - 1];
    while (i-- > 0) {
        a[i] = s;
        s = $n[s];
    }
    while (r-- > 0) Dn[r] = 0;
    return a;
}

function On(t, e, i) {
    const s = 0 === e;
    const n = e === i - 1;
    const r = e % 2 === 0;
    t.$index = e;
    t.$first = s;
    t.$last = n;
    t.$middle = !s && !n;
    t.$even = r;
    t.$odd = !r;
    t.$length = i;
}

class With {
    constructor(t, i) {
        this.id = e.nextId("au$component");
        this.id = e.nextId("au$component");
        this.view = t.create().setLocation(i);
    }
    valueChanged(e, i, s) {
        const n = this.$controller;
        const r = this.view.bindings;
        let o;
        let l = 0, h = 0;
        if (n.isActive && null != r) {
            o = t.Scope.fromParent(n.scope, void 0 === e ? {} : e);
            for (h = r.length; h > l; ++l) r[l].$bind(2, o);
        }
    }
    attaching(e, i, s) {
        const {$controller: n, value: r} = this;
        const o = t.Scope.fromParent(n.scope, void 0 === r ? {} : r);
        return this.view.activate(e, n, s, o);
    }
    detaching(t, e, i) {
        return this.view.deactivate(t, this.$controller, i);
    }
    dispose() {
        this.view.dispose();
        this.view = void 0;
    }
    accept(t) {
        var e;
        if (true === (null === (e = this.view) || void 0 === e ? void 0 : e.accept(t))) return true;
    }
}

With.inject = [ Me, Ti ];

r([ S ], With.prototype, "value", void 0);

qt("with")(With);

exports.Switch = class Switch {
    constructor(t, i) {
        this.f = t;
        this.l = i;
        this.id = e.nextId("au$component");
        this.cases = [];
        this.activeCases = [];
        this.promise = void 0;
    }
    link(t, e, i, s) {
        this.view = this.f.create(this.$controller).setLocation(this.l);
    }
    attaching(t, e, i) {
        const s = this.view;
        const n = this.$controller;
        this.queue((() => s.activate(t, n, i, n.scope)));
        this.queue((() => this.swap(t, i, this.value)));
        return this.promise;
    }
    detaching(t, e, i) {
        this.queue((() => {
            const e = this.view;
            return e.deactivate(t, this.$controller, i);
        }));
        return this.promise;
    }
    dispose() {
        var t;
        null === (t = this.view) || void 0 === t ? void 0 : t.dispose();
        this.view = void 0;
    }
    valueChanged(t, e, i) {
        if (!this.$controller.isActive) return;
        this.queue((() => this.swap(null, i, this.value)));
    }
    caseChanged(t, e) {
        this.queue((() => this.Ri(t, e)));
    }
    Ri(t, i) {
        const s = t.isMatch(this.value, i);
        const n = this.activeCases;
        const r = n.length;
        if (!s) {
            if (r > 0 && n[0].id === t.id) return this.Si(null, i);
            return;
        }
        if (r > 0 && n[0].id < t.id) return;
        const o = [];
        let l = t.fallThrough;
        if (!l) o.push(t); else {
            const e = this.cases;
            const i = e.indexOf(t);
            for (let t = i, s = e.length; t < s && l; t++) {
                const i = e[t];
                o.push(i);
                l = i.fallThrough;
            }
        }
        return e.onResolve(this.Si(null, i, o), (() => {
            this.activeCases = o;
            return this.Ei(null, i);
        }));
    }
    swap(t, i, s) {
        const n = [];
        let r = false;
        for (const t of this.cases) {
            if (r || t.isMatch(s, i)) {
                n.push(t);
                r = t.fallThrough;
            }
            if (n.length > 0 && !r) break;
        }
        const o = this.defaultCase;
        if (0 === n.length && void 0 !== o) n.push(o);
        return e.onResolve(this.activeCases.length > 0 ? this.Si(t, i, n) : void 0, (() => {
            this.activeCases = n;
            if (0 === n.length) return;
            return this.Ei(t, i);
        }));
    }
    Ei(t, i) {
        const s = this.$controller;
        if (!s.isActive) return;
        const n = this.activeCases;
        const r = n.length;
        if (0 === r) return;
        const o = s.scope;
        if (1 === r) return n[0].activate(t, i, o);
        return e.resolveAll(...n.map((e => e.activate(t, i, o))));
    }
    Si(t, i, s = []) {
        const n = this.activeCases;
        const r = n.length;
        if (0 === r) return;
        if (1 === r) {
            const e = n[0];
            if (!s.includes(e)) {
                n.length = 0;
                return e.deactivate(t, i);
            }
            return;
        }
        return e.onResolve(e.resolveAll(...n.reduce(((e, n) => {
            if (!s.includes(n)) e.push(n.deactivate(t, i));
            return e;
        }), [])), (() => {
            n.length = 0;
        }));
    }
    queue(t) {
        const i = this.promise;
        let s;
        s = this.promise = e.onResolve(e.onResolve(i, t), (() => {
            if (this.promise === s) this.promise = void 0;
        }));
    }
    accept(t) {
        if (true === this.$controller.accept(t)) return true;
        if (this.activeCases.some((e => e.accept(t)))) return true;
    }
};

r([ S ], exports.Switch.prototype, "value", void 0);

exports.Switch = r([ qt("switch"), o(0, Me), o(1, Ti) ], exports.Switch);

exports.Case = class Case {
    constructor(t, i, s, n) {
        this.f = t;
        this.Bi = i;
        this.l = s;
        this.id = e.nextId("au$component");
        this.fallThrough = false;
        this.view = void 0;
        this.Ii = n.config.level <= 1;
        this.Ut = n.scopeTo(`${this.constructor.name}-#${this.id}`);
    }
    link(t, e, i, s) {
        const n = t.parent;
        const r = null === n || void 0 === n ? void 0 : n.viewModel;
        if (r instanceof exports.Switch) {
            this.$switch = r;
            this.linkToSwitch(r);
        } else throw new Error(`AUR0815`);
    }
    detaching(t, e, i) {
        return this.deactivate(t, i);
    }
    isMatch(t, e) {
        this.Ut.debug("isMatch()");
        const i = this.value;
        if (Array.isArray(i)) {
            if (void 0 === this.ui) this.ui = this.Ti(e, i);
            return i.includes(t);
        }
        return i === t;
    }
    valueChanged(t, e, i) {
        var s;
        if (Array.isArray(t)) {
            null === (s = this.ui) || void 0 === s ? void 0 : s.unsubscribe(this);
            this.ui = this.Ti(i, t);
        } else if (void 0 !== this.ui) this.ui.unsubscribe(this);
        this.$switch.caseChanged(this, i);
    }
    handleCollectionChange(t, e) {
        this.$switch.caseChanged(this, e);
    }
    activate(t, e, i) {
        let s = this.view;
        if (void 0 === s) s = this.view = this.f.create().setLocation(this.l);
        if (s.isActive) return;
        return s.activate(null !== t && void 0 !== t ? t : s, this.$controller, e, i);
    }
    deactivate(t, e) {
        const i = this.view;
        if (void 0 === i || !i.isActive) return;
        return i.deactivate(null !== t && void 0 !== t ? t : i, this.$controller, e);
    }
    dispose() {
        var t, e;
        null === (t = this.ui) || void 0 === t ? void 0 : t.unsubscribe(this);
        null === (e = this.view) || void 0 === e ? void 0 : e.dispose();
        this.view = void 0;
    }
    linkToSwitch(t) {
        t.cases.push(this);
    }
    Ti(t, e) {
        const i = this.Bi.getArrayObserver(e);
        i.subscribe(this);
        return i;
    }
    accept(t) {
        var e;
        if (true === this.$controller.accept(t)) return true;
        return null === (e = this.view) || void 0 === e ? void 0 : e.accept(t);
    }
};

exports.Case.inject = [ Me, t.IObserverLocator, Ti, e.ILogger ];

r([ S ], exports.Case.prototype, "value", void 0);

r([ S({
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
    mode: t.BindingMode.oneTime
}) ], exports.Case.prototype, "fallThrough", void 0);

exports.Case = r([ qt("case") ], exports.Case);

exports.DefaultCase = class DefaultCase extends exports.Case {
    linkToSwitch(t) {
        if (void 0 !== t.defaultCase) throw new Error(`AUR0816`);
        t.defaultCase = this;
    }
};

exports.DefaultCase = r([ qt("default-case") ], exports.DefaultCase);

exports.PromiseTemplateController = class PromiseTemplateController {
    constructor(t, i, s, n) {
        this.f = t;
        this.l = i;
        this.p = s;
        this.id = e.nextId("au$component");
        this.preSettledTask = null;
        this.postSettledTask = null;
        this.logger = n.scopeTo("promise.resolve");
    }
    link(t, e, i, s) {
        this.view = this.f.create(this.$controller).setLocation(this.l);
    }
    attaching(i, s, n) {
        const r = this.view;
        const o = this.$controller;
        return e.onResolve(r.activate(i, o, n, this.viewScope = t.Scope.fromParent(o.scope, {})), (() => this.swap(i, n)));
    }
    valueChanged(t, e, i) {
        if (!this.$controller.isActive) return;
        this.swap(null, i);
    }
    swap(t, i) {
        var n, r;
        const o = this.value;
        if (!y(o)) {
            this.logger.warn(`The value '${String(o)}' is not a promise. No change will be done.`);
            return;
        }
        const l = this.p.domWriteQueue;
        const h = this.fulfilled;
        const c = this.rejected;
        const a = this.pending;
        const u = this.viewScope;
        let f;
        const d = {
            reusable: false
        };
        const p = () => {
            void e.resolveAll(f = (this.preSettledTask = l.queueTask((() => e.resolveAll(null === h || void 0 === h ? void 0 : h.deactivate(t, i), null === c || void 0 === c ? void 0 : c.deactivate(t, i), null === a || void 0 === a ? void 0 : a.activate(t, i, u))), d)).result.catch((t => {
                if (!(t instanceof s.TaskAbortError)) throw t;
            })), o.then((s => {
                if (this.value !== o) return;
                const n = () => {
                    this.postSettlePromise = (this.postSettledTask = l.queueTask((() => e.resolveAll(null === a || void 0 === a ? void 0 : a.deactivate(t, i), null === c || void 0 === c ? void 0 : c.deactivate(t, i), null === h || void 0 === h ? void 0 : h.activate(t, i, u, s))), d)).result;
                };
                if (1 === this.preSettledTask.status) void f.then(n); else {
                    this.preSettledTask.cancel();
                    n();
                }
            }), (s => {
                if (this.value !== o) return;
                const n = () => {
                    this.postSettlePromise = (this.postSettledTask = l.queueTask((() => e.resolveAll(null === a || void 0 === a ? void 0 : a.deactivate(t, i), null === h || void 0 === h ? void 0 : h.deactivate(t, i), null === c || void 0 === c ? void 0 : c.activate(t, i, u, s))), d)).result;
                };
                if (1 === this.preSettledTask.status) void f.then(n); else {
                    this.preSettledTask.cancel();
                    n();
                }
            })));
        };
        if (1 === (null === (n = this.postSettledTask) || void 0 === n ? void 0 : n.status)) void this.postSettlePromise.then(p); else {
            null === (r = this.postSettledTask) || void 0 === r ? void 0 : r.cancel();
            p();
        }
    }
    detaching(t, e, i) {
        var s, n;
        null === (s = this.preSettledTask) || void 0 === s ? void 0 : s.cancel();
        null === (n = this.postSettledTask) || void 0 === n ? void 0 : n.cancel();
        this.preSettledTask = this.postSettledTask = null;
        return this.view.deactivate(t, this.$controller, i);
    }
    dispose() {
        var t;
        null === (t = this.view) || void 0 === t ? void 0 : t.dispose();
        this.view = void 0;
    }
};

r([ S ], exports.PromiseTemplateController.prototype, "value", void 0);

exports.PromiseTemplateController = r([ qt("promise"), o(0, Me), o(1, Ti), o(2, J), o(3, e.ILogger) ], exports.PromiseTemplateController);

exports.PendingTemplateController = class PendingTemplateController {
    constructor(t, i) {
        this.f = t;
        this.l = i;
        this.id = e.nextId("au$component");
        this.view = void 0;
    }
    link(t, e, i, s) {
        Ln(t).pending = this;
    }
    activate(t, e, i) {
        let s = this.view;
        if (void 0 === s) s = this.view = this.f.create().setLocation(this.l);
        if (s.isActive) return;
        return s.activate(s, this.$controller, e, i);
    }
    deactivate(t, e) {
        const i = this.view;
        if (void 0 === i || !i.isActive) return;
        return i.deactivate(i, this.$controller, e);
    }
    detaching(t, e, i) {
        return this.deactivate(t, i);
    }
    dispose() {
        var t;
        null === (t = this.view) || void 0 === t ? void 0 : t.dispose();
        this.view = void 0;
    }
};

r([ S({
    mode: t.BindingMode.toView
}) ], exports.PendingTemplateController.prototype, "value", void 0);

exports.PendingTemplateController = r([ qt("pending"), o(0, Me), o(1, Ti) ], exports.PendingTemplateController);

exports.FulfilledTemplateController = class FulfilledTemplateController {
    constructor(t, i) {
        this.f = t;
        this.l = i;
        this.id = e.nextId("au$component");
        this.view = void 0;
    }
    link(t, e, i, s) {
        Ln(t).fulfilled = this;
    }
    activate(t, e, i, s) {
        this.value = s;
        let n = this.view;
        if (void 0 === n) n = this.view = this.f.create().setLocation(this.l);
        if (n.isActive) return;
        return n.activate(n, this.$controller, e, i);
    }
    deactivate(t, e) {
        const i = this.view;
        if (void 0 === i || !i.isActive) return;
        return i.deactivate(i, this.$controller, e);
    }
    detaching(t, e, i) {
        return this.deactivate(t, i);
    }
    dispose() {
        var t;
        null === (t = this.view) || void 0 === t ? void 0 : t.dispose();
        this.view = void 0;
    }
};

r([ S({
    mode: t.BindingMode.fromView
}) ], exports.FulfilledTemplateController.prototype, "value", void 0);

exports.FulfilledTemplateController = r([ qt("then"), o(0, Me), o(1, Ti) ], exports.FulfilledTemplateController);

exports.RejectedTemplateController = class RejectedTemplateController {
    constructor(t, i) {
        this.f = t;
        this.l = i;
        this.id = e.nextId("au$component");
        this.view = void 0;
    }
    link(t, e, i, s) {
        Ln(t).rejected = this;
    }
    activate(t, e, i, s) {
        this.value = s;
        let n = this.view;
        if (void 0 === n) n = this.view = this.f.create().setLocation(this.l);
        if (n.isActive) return;
        return n.activate(n, this.$controller, e, i);
    }
    deactivate(t, e) {
        const i = this.view;
        if (void 0 === i || !i.isActive) return;
        return i.deactivate(i, this.$controller, e);
    }
    detaching(t, e, i) {
        return this.deactivate(t, i);
    }
    dispose() {
        var t;
        null === (t = this.view) || void 0 === t ? void 0 : t.dispose();
        this.view = void 0;
    }
};

r([ S({
    mode: t.BindingMode.fromView
}) ], exports.RejectedTemplateController.prototype, "value", void 0);

exports.RejectedTemplateController = r([ qt("catch"), o(0, Me), o(1, Ti) ], exports.RejectedTemplateController);

function Ln(t) {
    const e = t.parent;
    const i = null === e || void 0 === e ? void 0 : e.viewModel;
    if (i instanceof exports.PromiseTemplateController) return i;
    throw new Error(`AUR0813`);
}

let qn = class PromiseAttributePattern {
    "promise.resolve"(t, e, i) {
        return new AttrSyntax(t, e, "promise", "bind");
    }
};

qn = r([ z({
    pattern: "promise.resolve",
    symbols: ""
}) ], qn);

let Un = class FulfilledAttributePattern {
    then(t, e, i) {
        return new AttrSyntax(t, e, "then", "from-view");
    }
};

Un = r([ z({
    pattern: "then",
    symbols: ""
}) ], Un);

let _n = class RejectedAttributePattern {
    catch(t, e, i) {
        return new AttrSyntax(t, e, "catch", "from-view");
    }
};

_n = r([ z({
    pattern: "catch",
    symbols: ""
}) ], _n);

function Vn(t, e, i, s) {
    if (C(e)) return Mn(t, e, i, s);
    if (fe(e)) return Fn(t, e, i, s);
    throw new Error(`Invalid Tag or Type.`);
}

class RenderPlan {
    constructor(t, e, i) {
        this.node = t;
        this.instructions = e;
        this.Di = i;
        this.$i = void 0;
    }
    get definition() {
        if (void 0 === this.$i) this.$i = CustomElementDefinition.create({
            name: ce(),
            template: this.node,
            needsCompile: C(this.node),
            instructions: this.instructions,
            dependencies: this.Di
        });
        return this.$i;
    }
    createView(t) {
        return this.getViewFactory(t).create();
    }
    getViewFactory(t) {
        return t.root.get(Xe).getViewFactory(this.definition, t.createChild().register(...this.Di));
    }
    mergeInto(t, e, i) {
        t.appendChild(this.node);
        e.push(...this.instructions);
        i.push(...this.Di);
    }
}

function Mn(t, e, i, s) {
    const n = [];
    const r = [];
    const o = [];
    const l = t.document.createElement(e);
    let h = false;
    if (i) Object.keys(i).forEach((t => {
        const e = i[t];
        if (Wi(e)) {
            h = true;
            n.push(e);
        } else l.setAttribute(t, e);
    }));
    if (h) {
        l.className = "au";
        r.push(n);
    }
    if (s) jn(t, l, s, r, o);
    return new RenderPlan(l, r, o);
}

function Fn(t, e, i, s) {
    const n = ve(e);
    const r = [];
    const o = [ r ];
    const l = [];
    const h = [];
    const c = n.bindables;
    const a = t.document.createElement(n.name);
    a.className = "au";
    if (!l.includes(e)) l.push(e);
    r.push(new HydrateElementInstruction(n, void 0, h, null, false, void 0));
    if (i) Object.keys(i).forEach((t => {
        const e = i[t];
        if (Wi(e)) h.push(e); else if (void 0 === c[t]) h.push(new SetAttributeInstruction(e, t)); else h.push(new SetPropertyInstruction(e, t));
    }));
    if (s) jn(t, a, s, o, l);
    return new RenderPlan(a, o, l);
}

function jn(t, e, i, s, n) {
    for (let r = 0, o = i.length; r < o; ++r) {
        const o = i[r];
        switch (typeof o) {
          case "string":
            e.appendChild(t.document.createTextNode(o));
            break;

          case "object":
            if (o instanceof t.Node) e.appendChild(o); else if ("mergeInto" in o) o.mergeInto(e, s, n);
        }
    }
}

function Nn(t, e) {
    const i = e.to;
    if (void 0 !== i && "subject" !== i && "composing" !== i) t[i] = e;
    return t;
}

class AuRender {
    constructor(t, i, s, n) {
        this.p = t;
        this.Pi = i;
        this.Oi = s;
        this.r = n;
        this.id = e.nextId("au$component");
        this.component = void 0;
        this.composing = false;
        this.view = void 0;
        this.Li = void 0;
        this.qi = i.props.reduce(Nn, {});
    }
    attaching(t, e, i) {
        const {component: s, view: n} = this;
        if (void 0 === n || this.Li !== s) {
            this.Li = s;
            this.composing = true;
            return this.compose(void 0, s, t, i);
        }
        return this.compose(n, s, t, i);
    }
    detaching(t, e, i) {
        return this.ri(this.view, t, i);
    }
    componentChanged(t, i, s) {
        const {$controller: n} = this;
        if (!n.isActive) return;
        if (this.Li === t) return;
        this.Li = t;
        this.composing = true;
        s |= n.flags;
        const r = e.onResolve(this.ri(this.view, null, s), (() => this.compose(void 0, t, null, s)));
        if (y(r)) r.catch((t => {
            throw t;
        }));
    }
    compose(t, i, s, n) {
        return e.onResolve(void 0 === t ? e.onResolve(i, (t => this.Ui(t, n))) : t, (t => this.si(this.view = t, s, n)));
    }
    ri(t, e, i) {
        return null === t || void 0 === t ? void 0 : t.deactivate(null !== e && void 0 !== e ? e : t, this.$controller, i);
    }
    si(t, i, s) {
        const {$controller: n} = this;
        return e.onResolve(null === t || void 0 === t ? void 0 : t.activate(null !== i && void 0 !== i ? i : t, n, s, n.scope), (() => {
            this.composing = false;
        }));
    }
    Ui(t, e) {
        const i = this._i(t, e);
        if (i) {
            i.setLocation(this.$controller.location);
            i.lockScope(this.$controller.scope);
            return i;
        }
        return;
    }
    _i(t, e) {
        if (null == t) return;
        const i = this.Oi.controller.container;
        if ("object" === typeof t) {
            if (Hn(t)) return t;
            if ("createView" in t) return t.createView(i);
            if ("create" in t) return t.create();
            if ("template" in t) return this.r.getViewFactory(CustomElementDefinition.getOrCreate(t), i).create();
        }
        if (C(t)) {
            const e = i.find(ge, t);
            if (null == e) throw new Error(`AUR0809:${t}`);
            t = e.Type;
        }
        return Vn(this.p, t, this.qi, this.$controller.host.childNodes).createView(i);
    }
    dispose() {
        var t;
        null === (t = this.view) || void 0 === t ? void 0 : t.dispose();
        this.view = void 0;
    }
    accept(t) {
        var e;
        if (true === (null === (e = this.view) || void 0 === e ? void 0 : e.accept(t))) return true;
    }
}

AuRender.inject = [ J, Hi, ai, Xe ];

r([ S ], AuRender.prototype, "component", void 0);

r([ S({
    mode: t.BindingMode.fromView
}) ], AuRender.prototype, "composing", void 0);

Kt({
    name: "au-render",
    template: null,
    containerless: true,
    capture: true
})(AuRender);

function Hn(t) {
    return "lockScope" in t;
}

class AuCompose {
    constructor(t, e, i, s, n, r, o) {
        this.c = t;
        this.parent = e;
        this.host = i;
        this.l = s;
        this.p = n;
        this.scopeBehavior = "auto";
        this.Vi = void 0;
        this.r = t.get(Xe);
        this.Pi = r;
        this.Mi = o;
    }
    static get inject() {
        return [ e.IContainer, ci, Bi, Ti, J, Hi, e.transient(CompositionContextFactory) ];
    }
    get pending() {
        return this.Fi;
    }
    get composition() {
        return this.Vi;
    }
    attaching(t, i, s) {
        return this.Fi = e.onResolve(this.queue(new ChangeInfo(this.view, this.viewModel, this.model, void 0), t), (t => {
            if (this.Mi.isCurrent(t)) this.Fi = void 0;
        }));
    }
    detaching(t) {
        const i = this.Vi;
        const s = this.Fi;
        this.Mi.invalidate();
        this.Vi = this.Fi = void 0;
        return e.onResolve(s, (() => null === i || void 0 === i ? void 0 : i.deactivate(t)));
    }
    propertyChanged(t) {
        if ("model" === t && null != this.Vi) {
            this.Vi.update(this.model);
            return;
        }
        this.Fi = e.onResolve(this.Fi, (() => e.onResolve(this.queue(new ChangeInfo(this.view, this.viewModel, this.model, t), void 0), (t => {
            if (this.Mi.isCurrent(t)) this.Fi = void 0;
        }))));
    }
    queue(t, i) {
        const s = this.Mi;
        const n = this.Vi;
        return e.onResolve(s.create(t), (t => {
            if (s.isCurrent(t)) return e.onResolve(this.compose(t), (r => {
                if (s.isCurrent(t)) return e.onResolve(r.activate(i), (() => {
                    if (s.isCurrent(t)) {
                        this.Vi = r;
                        return e.onResolve(null === n || void 0 === n ? void 0 : n.deactivate(i), (() => t));
                    } else return e.onResolve(r.controller.deactivate(r.controller, this.$controller, 4), (() => {
                        r.controller.dispose();
                        return t;
                    }));
                }));
                r.controller.dispose();
                return t;
            }));
            return t;
        }));
    }
    compose(i) {
        let s;
        let n;
        let r;
        const {view: o, viewModel: l, model: h} = i.change;
        const {c: c, host: a, $controller: u, l: f} = this;
        const d = this.getDef(l);
        const p = c.createChild();
        const v = null == f ? a.parentNode : f.parentNode;
        if (null !== d) {
            if (d.containerless) throw new Error(`AUR0806`);
            if (null == f) {
                n = a;
                r = () => {};
            } else {
                n = v.insertBefore(this.p.document.createElement(d.name), f);
                r = () => {
                    n.remove();
                };
            }
            s = this.getVm(p, l, n);
        } else {
            n = null == f ? a : f;
            s = this.getVm(p, l, n);
        }
        const m = () => {
            if (null !== d) {
                const t = Controller.$el(p, s, n, {
                    projections: this.Pi.projections
                }, d);
                return new CompositionController(t, (e => t.activate(null !== e && void 0 !== e ? e : t, u, 2, u.scope.parentScope)), (i => e.onResolve(t.deactivate(null !== i && void 0 !== i ? i : t, u, 4), r)), (t => {
                    var e;
                    return null === (e = s.activate) || void 0 === e ? void 0 : e.call(s, t);
                }), i);
            } else {
                const e = CustomElementDefinition.create({
                    name: ge.generateName(),
                    template: o
                });
                const r = this.r.getViewFactory(e, p);
                const l = Controller.$view(r, u);
                const h = "auto" === this.scopeBehavior ? t.Scope.fromParent(this.parent.scope, s) : t.Scope.create(s);
                if (Li(n)) l.setLocation(n); else l.setHost(n);
                return new CompositionController(l, (t => l.activate(null !== t && void 0 !== t ? t : l, u, 2, h)), (t => l.deactivate(null !== t && void 0 !== t ? t : l, u, 4)), (t => {
                    var e;
                    return null === (e = s.activate) || void 0 === e ? void 0 : e.call(s, t);
                }), i);
            }
        };
        if ("activate" in s) return e.onResolve(s.activate(h), (() => m())); else return m();
    }
    getVm(t, i, s) {
        if (null == i) return new EmptyComponent$1;
        if ("object" === typeof i) return i;
        const n = this.p;
        const r = Li(s);
        t.registerResolver(n.Element, t.registerResolver(Bi, new e.InstanceProvider("ElementResolver", r ? null : s)));
        t.registerResolver(Ti, new e.InstanceProvider("IRenderLocation", r ? s : null));
        const o = t.invoke(i);
        t.registerResolver(i, new e.InstanceProvider("au-compose.viewModel", o));
        return o;
    }
    getDef(t) {
        const e = k(t) ? t : null === t || void 0 === t ? void 0 : t.constructor;
        return ge.isType(e) ? ge.getDefinition(e) : null;
    }
}

r([ S ], AuCompose.prototype, "view", void 0);

r([ S ], AuCompose.prototype, "viewModel", void 0);

r([ S ], AuCompose.prototype, "model", void 0);

r([ S({
    set: t => {
        if ("scoped" === t || "auto" === t) return t;
        throw new Error(`AUR0805`);
    }
}) ], AuCompose.prototype, "scopeBehavior", void 0);

Kt("au-compose")(AuCompose);

class EmptyComponent$1 {}

class CompositionContextFactory {
    constructor() {
        this.id = 0;
    }
    isCurrent(t) {
        return t.id === this.id;
    }
    create(t) {
        return e.onResolve(t.load(), (t => new CompositionContext(++this.id, t)));
    }
    invalidate() {
        this.id++;
    }
}

class ChangeInfo {
    constructor(t, e, i, s) {
        this.view = t;
        this.viewModel = e;
        this.model = i;
        this.src = s;
    }
    load() {
        if (y(this.view) || y(this.viewModel)) return Promise.all([ this.view, this.viewModel ]).then((([t, e]) => new LoadedChangeInfo(t, e, this.model, this.src))); else return new LoadedChangeInfo(this.view, this.viewModel, this.model, this.src);
    }
}

class LoadedChangeInfo {
    constructor(t, e, i, s) {
        this.view = t;
        this.viewModel = e;
        this.model = i;
        this.src = s;
    }
}

class CompositionContext {
    constructor(t, e) {
        this.id = t;
        this.change = e;
    }
}

class CompositionController {
    constructor(t, e, i, s, n) {
        this.controller = t;
        this.start = e;
        this.stop = i;
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
    constructor(t, e, i, s) {
        var n, r;
        this.ji = null;
        this.Ni = null;
        let o;
        const l = e.auSlot;
        const h = null === (r = null === (n = i.instruction) || void 0 === n ? void 0 : n.projections) || void 0 === r ? void 0 : r[l.name];
        if (null == h) {
            o = s.getViewFactory(l.fallback, i.controller.container);
            this.Hi = false;
        } else {
            o = s.getViewFactory(h, i.parent.controller.container);
            this.Hi = true;
        }
        this.Oi = i;
        this.view = o.create().setLocation(t);
    }
    static get inject() {
        return [ Ti, Hi, ai, Xe ];
    }
    binding(e, i, s) {
        var n;
        this.ji = this.$controller.scope.parentScope;
        let r;
        if (this.Hi) {
            r = this.Oi.controller.scope.parentScope;
            (this.Ni = t.Scope.fromParent(r, r.bindingContext)).overrideContext.$host = null !== (n = this.expose) && void 0 !== n ? n : this.ji.bindingContext;
        }
    }
    attaching(t, e, i) {
        return this.view.activate(t, this.$controller, i, this.Hi ? this.Ni : this.ji);
    }
    detaching(t, e, i) {
        return this.view.deactivate(t, this.$controller, i);
    }
    exposeChanged(t) {
        if (this.Hi && null != this.Ni) this.Ni.overrideContext.$host = t;
    }
    dispose() {
        this.view.dispose();
        this.view = void 0;
    }
    accept(t) {
        var e;
        if (true === (null === (e = this.view) || void 0 === e ? void 0 : e.accept(t))) return true;
    }
}

r([ S ], AuSlot.prototype, "expose", void 0);

Kt({
    name: "au-slot",
    template: null,
    containerless: true
})(AuSlot);

const Wn = e.DI.createInterface("ISanitizer", (t => t.singleton(class {
    sanitize() {
        throw new Error('"sanitize" method not implemented');
    }
})));

exports.SanitizeValueConverter = class SanitizeValueConverter {
    constructor(t) {
        this.Wi = t;
    }
    toView(t) {
        if (null == t) return null;
        return this.Wi.sanitize(t);
    }
};

exports.SanitizeValueConverter = r([ o(0, Wn) ], exports.SanitizeValueConverter);

t.valueConverter("sanitize")(exports.SanitizeValueConverter);

exports.ViewValueConverter = class ViewValueConverter {
    constructor(t) {
        this.zi = t;
    }
    toView(t, e) {
        return this.zi.getViewComponentForObject(t, e);
    }
};

exports.ViewValueConverter = r([ o(0, Ge) ], exports.ViewValueConverter);

t.valueConverter("view")(exports.ViewValueConverter);

const zn = DebounceBindingBehavior;

const Gn = OneTimeBindingBehavior;

const Xn = ToViewBindingBehavior;

const Kn = FromViewBindingBehavior;

const Yn = SignalBindingBehavior;

const Zn = ThrottleBindingBehavior;

const Jn = TwoWayBindingBehavior;

const Qn = TemplateCompiler;

const tr = NodeObserverLocator;

const er = [ Qn, tr ];

const ir = SVGAnalyzer;

const sr = exports.AtPrefixedTriggerAttributePattern;

const nr = exports.ColonPrefixedBindAttributePattern;

const rr = exports.RefAttributePattern;

const or = exports.DotSeparatedAttributePattern;

const lr = Z;

const hr = [ rr, or, lr ];

const cr = [ sr, nr ];

const ar = exports.CallBindingCommand;

const ur = exports.DefaultBindingCommand;

const fr = exports.ForBindingCommand;

const dr = exports.FromViewBindingCommand;

const pr = exports.OneTimeBindingCommand;

const vr = exports.ToViewBindingCommand;

const mr = exports.TwoWayBindingCommand;

const xr = qs;

const gr = exports.TriggerBindingCommand;

const wr = exports.DelegateBindingCommand;

const br = exports.CaptureBindingCommand;

const yr = exports.AttrBindingCommand;

const kr = exports.ClassBindingCommand;

const Cr = exports.StyleBindingCommand;

const Ar = Us;

const Rr = [ ur, pr, dr, vr, mr, ar, fr, xr, gr, wr, br, kr, Cr, yr, Ar ];

const Sr = exports.SanitizeValueConverter;

const Er = exports.ViewValueConverter;

const Br = If;

const Ir = Else;

const Tr = Repeat;

const Dr = With;

const $r = exports.Switch;

const Pr = exports.Case;

const Or = exports.DefaultCase;

const Lr = exports.PromiseTemplateController;

const qr = exports.PendingTemplateController;

const Ur = exports.FulfilledTemplateController;

const _r = exports.RejectedTemplateController;

const Vr = qn;

const Mr = Un;

const Fr = _n;

const jr = AttrBindingBehavior;

const Nr = SelfBindingBehavior;

const Hr = UpdateTriggerBindingBehavior;

const Wr = AuRender;

const zr = AuCompose;

const Gr = Portal;

const Xr = Focus;

const Kr = En;

const Yr = [ zn, Gn, Xn, Kn, Yn, Zn, Jn, Sr, Er, Br, Ir, Tr, Dr, $r, Pr, Or, Lr, qr, Ur, _r, Vr, Mr, Fr, jr, Nr, Hr, Wr, zr, Gr, Xr, Kr, AuSlot ];

const Zr = ss;

const Jr = ts;

const Qr = Qi;

const to = rs;

const eo = ls;

const io = is;

const so = os;

const no = ns;

const ro = Ji;

const oo = es;

const lo = ds;

const ho = gs;

const co = ps;

const ao = vs;

const uo = ms;

const fo = xs;

const po = us;

const vo = ws;

const mo = [ so, eo, Zr, no, to, ro, Qr, Jr, oo, io, lo, ho, co, ao, uo, fo, po, vo ];

const xo = go(e.noop);

function go(e) {
    return {
        optionsProvider: e,
        register(i) {
            const s = {
                coercingOptions: {
                    enableCoercion: false,
                    coerceNullish: false
                }
            };
            e(s);
            return i.register(_(t.ICoercionConfiguration, s.coercingOptions), ...er, ...Yr, ...hr, ...Rr, ...mo);
        },
        customize(t) {
            return go(null !== t && void 0 !== t ? t : e);
        }
    };
}

const wo = e.DI.createInterface("IAurelia");

class Aurelia {
    constructor(t = e.DI.createContainer()) {
        this.container = t;
        this.ir = false;
        this.Gi = false;
        this.Xi = false;
        this.Ki = void 0;
        this.next = void 0;
        this.Yi = void 0;
        this.Zi = void 0;
        if (t.has(wo, true)) throw new Error(`AUR0768`);
        t.registerResolver(wo, new e.InstanceProvider("IAurelia", this));
        t.registerResolver(Ai, this.Ji = new e.InstanceProvider("IAppRoot"));
    }
    get isRunning() {
        return this.ir;
    }
    get isStarting() {
        return this.Gi;
    }
    get isStopping() {
        return this.Xi;
    }
    get root() {
        if (null == this.Ki) {
            if (null == this.next) throw new Error(`AUR0767`);
            return this.next;
        }
        return this.Ki;
    }
    register(...t) {
        this.container.register(...t);
        return this;
    }
    app(t) {
        this.next = new AppRoot(t, this.Qi(t.host), this.container, this.Ji);
        return this;
    }
    enhance(t, i) {
        var s;
        const n = null !== (s = t.container) && void 0 !== s ? s : this.container.createChild();
        const r = t.host;
        const o = this.Qi(r);
        const l = t.component;
        let h;
        if (k(l)) {
            n.registerResolver(o.HTMLElement, n.registerResolver(o.Element, n.registerResolver(Bi, new e.InstanceProvider("ElementResolver", r))));
            h = n.invoke(l);
        } else h = l;
        n.registerResolver(Ii, new e.InstanceProvider("IEventTarget", r));
        i = null !== i && void 0 !== i ? i : null;
        const c = Controller.$el(n, h, r, null, CustomElementDefinition.create({
            name: ce(),
            template: r,
            enhance: true
        }));
        return e.onResolve(c.activate(c, i, 2), (() => c));
    }
    async waitForIdle() {
        const t = this.root.platform;
        await t.domWriteQueue.yield();
        await t.domReadQueue.yield();
        await t.taskQueue.yield();
    }
    Qi(t) {
        let e;
        if (!this.container.has(J, false)) {
            if (null === t.ownerDocument.defaultView) throw new Error(`AUR0769`);
            e = new n.BrowserPlatform(t.ownerDocument.defaultView);
            this.container.register(_(J, e));
        } else e = this.container.get(J);
        return e;
    }
    start(t = this.next) {
        if (null == t) throw new Error(`AUR0770`);
        if (y(this.Yi)) return this.Yi;
        return this.Yi = e.onResolve(this.stop(), (() => {
            Reflect.set(t.host, "$aurelia", this);
            this.Ji.prepare(this.Ki = t);
            this.Gi = true;
            return e.onResolve(t.activate(), (() => {
                this.ir = true;
                this.Gi = false;
                this.Yi = void 0;
                this.ts(t, "au-started", t.host);
            }));
        }));
    }
    stop(t = false) {
        if (y(this.Zi)) return this.Zi;
        if (true === this.ir) {
            const i = this.Ki;
            this.ir = false;
            this.Xi = true;
            return this.Zi = e.onResolve(i.deactivate(), (() => {
                Reflect.deleteProperty(i.host, "$aurelia");
                if (t) i.dispose();
                this.Ki = void 0;
                this.Ji.dispose();
                this.Xi = false;
                this.ts(i, "au-stopped", i.host);
            }));
        }
    }
    dispose() {
        if (this.ir || this.Xi) throw new Error(`AUR0771`);
        this.container.dispose();
    }
    ts(t, e, i) {
        const s = new t.platform.window.CustomEvent(e, {
            detail: this,
            bubbles: true,
            cancelable: true
        });
        i.dispatchEvent(s);
    }
}

exports.DefinitionType = void 0;

(function(t) {
    t[t["Element"] = 1] = "Element";
    t[t["Attribute"] = 2] = "Attribute";
})(exports.DefinitionType || (exports.DefinitionType = {}));

const bo = e.DI.createInterface("IDialogService");

const yo = e.DI.createInterface("IDialogController");

const ko = e.DI.createInterface("IDialogDomRenderer");

const Co = e.DI.createInterface("IDialogDom");

const Ao = e.DI.createInterface("IDialogGlobalSettings");

class DialogOpenResult {
    constructor(t, e) {
        this.wasCancelled = t;
        this.dialog = e;
    }
    static create(t, e) {
        return new DialogOpenResult(t, e);
    }
}

class DialogCloseResult {
    constructor(t, e) {
        this.status = t;
        this.value = e;
    }
    static create(t, e) {
        return new DialogCloseResult(t, e);
    }
}

exports.DialogDeactivationStatuses = void 0;

(function(t) {
    t["Ok"] = "ok";
    t["Error"] = "error";
    t["Cancel"] = "cancel";
    t["Abort"] = "abort";
})(exports.DialogDeactivationStatuses || (exports.DialogDeactivationStatuses = {}));

class DialogController {
    constructor(t, e) {
        this.p = t;
        this.ctn = e;
        this.closed = new Promise(((t, e) => {
            this.$t = t;
            this.St = e;
        }));
    }
    static get inject() {
        return [ J, e.IContainer ];
    }
    activate(t) {
        var i;
        const s = this.ctn.createChild();
        const {model: n, template: r, rejectOnCancel: o} = t;
        const l = s.get(ko);
        const h = null !== (i = t.host) && void 0 !== i ? i : this.p.document.body;
        const c = this.dom = l.render(h, t);
        const a = s.has(Ii, true) ? s.get(Ii) : null;
        const u = c.contentHost;
        this.settings = t;
        if (null == a || !a.contains(h)) s.register(_(Ii, h));
        s.register(_(Bi, u), _(Co, c));
        return new Promise((e => {
            var i, r;
            const o = Object.assign(this.cmp = this.getOrCreateVm(s, t, u), {
                $dialog: this
            });
            e(null !== (r = null === (i = o.canActivate) || void 0 === i ? void 0 : i.call(o, n)) && void 0 !== r ? r : true);
        })).then((i => {
            var l;
            if (true !== i) {
                c.dispose();
                if (o) throw Ro(null, "Dialog activation rejected");
                return DialogOpenResult.create(true, this);
            }
            const h = this.cmp;
            return e.onResolve(null === (l = h.activate) || void 0 === l ? void 0 : l.call(h, n), (() => {
                var i;
                const n = this.controller = Controller.$el(s, h, u, null, CustomElementDefinition.create(null !== (i = this.getDefinition(h)) && void 0 !== i ? i : {
                    name: ge.generateName(),
                    template: r
                }));
                return e.onResolve(n.activate(n, null, 2), (() => {
                    var e;
                    c.overlay.addEventListener(null !== (e = t.mouseEvent) && void 0 !== e ? e : "click", this);
                    return DialogOpenResult.create(false, this);
                }));
            }));
        }), (t => {
            c.dispose();
            throw t;
        }));
    }
    deactivate(t, i) {
        if (this.es) return this.es;
        let s = true;
        const {controller: n, dom: r, cmp: o, settings: {mouseEvent: l, rejectOnCancel: h}} = this;
        const c = DialogCloseResult.create(t, i);
        const a = new Promise((a => {
            var u, f;
            a(e.onResolve(null !== (f = null === (u = o.canDeactivate) || void 0 === u ? void 0 : u.call(o, c)) && void 0 !== f ? f : true, (a => {
                var u;
                if (true !== a) {
                    s = false;
                    this.es = void 0;
                    if (h) throw Ro(null, "Dialog cancellation rejected");
                    return DialogCloseResult.create("abort");
                }
                return e.onResolve(null === (u = o.deactivate) || void 0 === u ? void 0 : u.call(o, c), (() => e.onResolve(n.deactivate(n, null, 4), (() => {
                    r.dispose();
                    r.overlay.removeEventListener(null !== l && void 0 !== l ? l : "click", this);
                    if (!h && "error" !== t) this.$t(c); else this.St(Ro(i, "Dialog cancelled with a rejection on cancel"));
                    return c;
                }))));
            })));
        })).catch((t => {
            this.es = void 0;
            throw t;
        }));
        this.es = s ? a : void 0;
        return a;
    }
    ok(t) {
        return this.deactivate("ok", t);
    }
    cancel(t) {
        return this.deactivate("cancel", t);
    }
    error(t) {
        const i = So(t);
        return new Promise((t => {
            var s, n;
            return t(e.onResolve(null === (n = (s = this.cmp).deactivate) || void 0 === n ? void 0 : n.call(s, DialogCloseResult.create("error", i)), (() => e.onResolve(this.controller.deactivate(this.controller, null, 4), (() => {
                this.dom.dispose();
                this.St(i);
            })))));
        }));
    }
    handleEvent(t) {
        if (this.settings.overlayDismiss && !this.dom.contentHost.contains(t.target)) this.cancel();
    }
    getOrCreateVm(t, i, s) {
        const n = i.component;
        if (null == n) return new EmptyComponent;
        if ("object" === typeof n) return n;
        const r = this.p;
        t.registerResolver(r.HTMLElement, t.registerResolver(r.Element, t.registerResolver(Bi, new e.InstanceProvider("ElementResolver", s))));
        return t.invoke(n);
    }
    getDefinition(t) {
        const e = k(t) ? t : null === t || void 0 === t ? void 0 : t.constructor;
        return ge.isType(e) ? ge.getDefinition(e) : null;
    }
}

class EmptyComponent {}

function Ro(t, e) {
    const i = new Error(e);
    i.wasCancelled = true;
    i.value = t;
    return i;
}

function So(t) {
    const e = new Error;
    e.wasCancelled = false;
    e.value = t;
    return e;
}

class DialogService {
    constructor(t, e, i) {
        this.ft = t;
        this.p = e;
        this.ss = i;
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
        return [ e.IContainer, J, Ao ];
    }
    static register(t) {
        t.register(q(bo, this), Ct.deactivating(bo, (t => e.onResolve(t.closeAll(), (t => {
            if (t.length > 0) throw new Error(`AUR0901:${t.length}`);
        })))));
    }
    open(t) {
        return Bo(new Promise((i => {
            var s;
            const n = DialogSettings.from(this.ss, t);
            const r = null !== (s = n.container) && void 0 !== s ? s : this.ft.createChild();
            i(e.onResolve(n.load(), (t => {
                const i = r.invoke(DialogController);
                r.register(_(yo, i));
                r.register(V(DialogController, (() => {
                    throw new Error(`AUR0902`);
                })));
                return e.onResolve(i.activate(t), (t => {
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
            return t.cancel().then((e => "cancel" === e.status ? null : t));
        }))).then((t => t.filter((t => !!t))));
    }
    remove(t) {
        const e = this.dlgs;
        const i = e.indexOf(t);
        if (i > -1) this.dlgs.splice(i, 1);
        if (0 === e.length) this.p.window.removeEventListener("keydown", this);
    }
    handleEvent(t) {
        const e = t;
        const i = Io(e);
        if (null == i) return;
        const s = this.top;
        if (null === s || 0 === s.settings.keyboard.length) return;
        const n = s.settings.keyboard;
        if ("Escape" === i && n.includes(i)) void s.cancel(); else if ("Enter" === i && n.includes(i)) void s.ok();
    }
}

class DialogSettings {
    static from(...t) {
        return Object.assign(new DialogSettings, ...t).ls().os();
    }
    load() {
        const t = this;
        const i = this.component;
        const s = this.template;
        const n = e.resolveAll(null == i ? void 0 : e.onResolve(i(), (e => {
            t.component = e;
        })), k(s) ? e.onResolve(s(), (e => {
            t.template = e;
        })) : void 0);
        return y(n) ? n.then((() => t)) : t;
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

function Eo(t, e) {
    return this.then((i => i.dialog.closed.then(t, e)), e);
}

function Bo(t) {
    t.whenClosed = Eo;
    return t;
}

function Io(t) {
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
        q(Ao, this).register(t);
    }
}

const To = "position:absolute;width:100%;height:100%;top:0;left:0;";

class DefaultDialogDomRenderer {
    constructor(t) {
        this.p = t;
        this.wrapperCss = `${To} display:flex;`;
        this.overlayCss = To;
        this.hostCss = "position:relative;margin:auto;";
    }
    static register(t) {
        q(ko, this).register(t);
    }
    render(t) {
        const e = this.p.document;
        const i = (t, i) => {
            const s = e.createElement(t);
            s.style.cssText = i;
            return s;
        };
        const s = t.appendChild(i("au-dialog-container", this.wrapperCss));
        const n = s.appendChild(i("au-dialog-overlay", this.overlayCss));
        const r = s.appendChild(i("div", this.hostCss));
        return new DefaultDialogDom(s, n, r);
    }
}

DefaultDialogDomRenderer.inject = [ J ];

class DefaultDialogDom {
    constructor(t, e, i) {
        this.wrapper = t;
        this.overlay = e;
        this.contentHost = i;
    }
    dispose() {
        this.wrapper.remove();
    }
}

function Do(t, e) {
    return {
        settingsProvider: t,
        register: i => i.register(...e, Ct.creating((() => t(i.get(Ao))))),
        customize(t, i) {
            return Do(t, null !== i && void 0 !== i ? i : e);
        }
    };
}

const $o = Do((() => {
    throw new Error(`AUR0904`);
}), [ class NoopDialogGlobalSettings {
    static register(t) {
        t.register(q(Ao, this));
    }
} ]);

const Po = Do(e.noop, [ DialogService, DefaultDialogGlobalSettings, DefaultDialogDomRenderer ]);

const Oo = e.DI.createInterface((t => t.singleton(WcCustomElementRegistry)));

class WcCustomElementRegistry {
    constructor(t, e, i) {
        this.ctn = t;
        this.p = e;
        this.r = i;
    }
    define(t, i, s) {
        if (!t.includes("-")) throw new Error('Invalid web-components custom element name. It must include a "-"');
        let n;
        if (null == i) throw new Error("Invalid custom element definition");
        switch (typeof i) {
          case "function":
            n = ge.isType(i) ? ge.getDefinition(i) : CustomElementDefinition.create(ge.generateName(), i);
            break;

          default:
            n = CustomElementDefinition.getOrCreate(i);
            break;
        }
        if (n.containerless) throw new Error("Containerless custom element is not supported. Consider using buitl-in extends instead");
        const r = !(null === s || void 0 === s ? void 0 : s.extends) ? HTMLElement : this.p.document.createElement(s.extends).constructor;
        const o = this.ctn;
        const l = this.r;
        const h = n.bindables;
        const c = this.p;
        class CustomElementClass extends r {
            auInit() {
                if (this.auInited) return;
                this.auInited = true;
                const t = o.createChild();
                t.registerResolver(c.HTMLElement, t.registerResolver(c.Element, t.registerResolver(Bi, new e.InstanceProvider("ElementProvider", this))));
                const i = l.compile(n, t, {
                    projections: null
                });
                const s = t.invoke(i.Type);
                const r = this.auCtrl = Controller.$el(t, s, this, null, i);
                Ei(this, i.key, r);
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
            attributeChangedCallback(t, e, i) {
                this.auInit();
                this.auCtrl.viewModel[t] = i;
            }
        }
        CustomElementClass.observedAttributes = Object.keys(h);
        for (const t in h) Object.defineProperty(CustomElementClass.prototype, t, {
            configurable: true,
            enumerable: false,
            get() {
                return this["auCtrl"].viewModel[t];
            },
            set(e) {
                if (!this["auInited"]) this["auInit"]();
                this["auCtrl"].viewModel[t] = e;
            }
        });
        this.p.customElements.define(t, CustomElementClass, s);
        return CustomElementClass;
    }
}

WcCustomElementRegistry.inject = [ e.IContainer, J, Xe ];

exports.LifecycleFlags = t.LifecycleFlags;

exports.bindingBehavior = t.bindingBehavior;

exports.valueConverter = t.valueConverter;

exports.AdoptedStyleSheetsStyles = AdoptedStyleSheetsStyles;

exports.AppRoot = AppRoot;

exports.AppTask = Ct;

exports.AtPrefixedTriggerAttributePatternRegistration = sr;

exports.AttrBindingBehavior = AttrBindingBehavior;

exports.AttrBindingBehaviorRegistration = jr;

exports.AttrBindingCommandRegistration = yr;

exports.AttrSyntax = AttrSyntax;

exports.AttributeBinding = AttributeBinding;

exports.AttributeBindingInstruction = AttributeBindingInstruction;

exports.AttributeBindingRendererRegistration = ho;

exports.AttributeNSAccessor = AttributeNSAccessor;

exports.AttributePattern = Y;

exports.AuCompose = AuCompose;

exports.AuRender = AuRender;

exports.AuRenderRegistration = Wr;

exports.AuSlot = AuSlot;

exports.AuSlotsInfo = AuSlotsInfo;

exports.Aurelia = Aurelia;

exports.Bindable = I;

exports.BindableDefinition = BindableDefinition;

exports.BindableObserver = BindableObserver;

exports.BindablesInfo = BindablesInfo;

exports.BindingCommand = Ls;

exports.BindingCommandDefinition = BindingCommandDefinition;

exports.BindingModeBehavior = BindingModeBehavior;

exports.CSSModulesProcessorRegistry = CSSModulesProcessorRegistry;

exports.CallBinding = CallBinding;

exports.CallBindingCommandRegistration = ar;

exports.CallBindingInstruction = CallBindingInstruction;

exports.CallBindingRendererRegistration = Zr;

exports.CaptureBindingCommandRegistration = br;

exports.CheckedObserver = CheckedObserver;

exports.Children = Bt;

exports.ChildrenDefinition = ChildrenDefinition;

exports.ChildrenObserver = ChildrenObserver;

exports.ClassAttributeAccessor = ClassAttributeAccessor;

exports.ClassBindingCommandRegistration = kr;

exports.ColonPrefixedBindAttributePatternRegistration = nr;

exports.ComputedWatcher = ComputedWatcher;

exports.Controller = Controller;

exports.CustomAttribute = Ht;

exports.CustomAttributeDefinition = CustomAttributeDefinition;

exports.CustomAttributeRendererRegistration = Jr;

exports.CustomElement = ge;

exports.CustomElementDefinition = CustomElementDefinition;

exports.CustomElementRendererRegistration = Qr;

exports.DataAttributeAccessor = DataAttributeAccessor;

exports.DebounceBindingBehavior = DebounceBindingBehavior;

exports.DebounceBindingBehaviorRegistration = zn;

exports.DefaultBindingCommandRegistration = ur;

exports.DefaultBindingLanguage = Rr;

exports.DefaultBindingSyntax = hr;

exports.DefaultComponents = er;

exports.DefaultDialogDom = DefaultDialogDom;

exports.DefaultDialogDomRenderer = DefaultDialogDomRenderer;

exports.DefaultDialogGlobalSettings = DefaultDialogGlobalSettings;

exports.DefaultRenderers = mo;

exports.DefaultResources = Yr;

exports.DelegateBindingCommandRegistration = wr;

exports.DialogCloseResult = DialogCloseResult;

exports.DialogConfiguration = $o;

exports.DialogController = DialogController;

exports.DialogDefaultConfiguration = Po;

exports.DialogOpenResult = DialogOpenResult;

exports.DialogService = DialogService;

exports.DotSeparatedAttributePatternRegistration = or;

exports.Else = Else;

exports.ElseRegistration = Ir;

exports.EventDelegator = EventDelegator;

exports.EventSubscriber = EventSubscriber;

exports.ExpressionWatcher = ExpressionWatcher;

exports.Focus = Focus;

exports.ForBindingCommandRegistration = fr;

exports.FragmentNodeSequence = FragmentNodeSequence;

exports.FromViewBindingBehavior = FromViewBindingBehavior;

exports.FromViewBindingBehaviorRegistration = Kn;

exports.FromViewBindingCommandRegistration = dr;

exports.HooksDefinition = HooksDefinition;

exports.HydrateAttributeInstruction = HydrateAttributeInstruction;

exports.HydrateElementInstruction = HydrateElementInstruction;

exports.HydrateLetElementInstruction = HydrateLetElementInstruction;

exports.HydrateTemplateController = HydrateTemplateController;

exports.IAppRoot = Ai;

exports.IAppTask = kt;

exports.IAttrMapper = et;

exports.IAttributeParser = W;

exports.IAttributePattern = H;

exports.IAuSlotsInfo = Ni;

exports.IAurelia = wo;

exports.IController = ci;

exports.IDialogController = yo;

exports.IDialogDom = Co;

exports.IDialogDomRenderer = ko;

exports.IDialogGlobalSettings = Ao;

exports.IDialogService = bo;

exports.IEventDelegator = Fi;

exports.IEventTarget = Ii;

exports.IHistory = _i;

exports.IHydrationContext = ai;

exports.IInstruction = Hi;

exports.ILifecycleHooks = Le;

exports.IListenerBehaviorOptions = fs;

exports.ILocation = Ui;

exports.INode = Bi;

exports.INodeObserverLocatorRegistration = tr;

exports.IPlatform = J;

exports.IProjections = ji;

exports.IRenderLocation = Ti;

exports.IRenderer = Gi;

exports.IRendering = Xe;

exports.ISVGAnalyzer = Q;

exports.ISanitizer = Wn;

exports.IShadowDOMGlobalStyles = Ie;

exports.IShadowDOMStyles = Be;

exports.ISyntaxInterpreter = F;

exports.ITemplateCompiler = zi;

exports.ITemplateCompilerHooks = Qs;

exports.ITemplateCompilerRegistration = Qn;

exports.ITemplateElementFactory = _s;

exports.IViewFactory = Me;

exports.IViewLocator = Ge;

exports.IWcElementRegistry = Oo;

exports.IWindow = qi;

exports.IWorkTracker = Ri;

exports.If = If;

exports.IfRegistration = Br;

exports.InterpolationBinding = InterpolationBinding;

exports.InterpolationBindingRendererRegistration = to;

exports.InterpolationInstruction = InterpolationInstruction;

exports.InterpolationPartBinding = InterpolationPartBinding;

exports.Interpretation = Interpretation;

exports.IteratorBindingInstruction = IteratorBindingInstruction;

exports.IteratorBindingRendererRegistration = eo;

exports.LetBinding = LetBinding;

exports.LetBindingInstruction = LetBindingInstruction;

exports.LetElementRendererRegistration = io;

exports.LifecycleHooks = _e;

exports.LifecycleHooksDefinition = LifecycleHooksDefinition;

exports.LifecycleHooksEntry = LifecycleHooksEntry;

exports.Listener = Listener;

exports.ListenerBindingInstruction = ListenerBindingInstruction;

exports.ListenerBindingRendererRegistration = lo;

exports.NodeObserverConfig = NodeObserverConfig;

exports.NodeObserverLocator = NodeObserverLocator;

exports.NoopSVGAnalyzer = NoopSVGAnalyzer;

exports.OneTimeBindingBehavior = OneTimeBindingBehavior;

exports.OneTimeBindingBehaviorRegistration = Gn;

exports.OneTimeBindingCommandRegistration = pr;

exports.Portal = Portal;

exports.PropertyBinding = PropertyBinding;

exports.PropertyBindingInstruction = PropertyBindingInstruction;

exports.PropertyBindingRendererRegistration = so;

exports.RefAttributePatternRegistration = rr;

exports.RefBinding = RefBinding;

exports.RefBindingCommandRegistration = xr;

exports.RefBindingInstruction = RefBindingInstruction;

exports.RefBindingRendererRegistration = no;

exports.RenderPlan = RenderPlan;

exports.Rendering = Rendering;

exports.Repeat = Repeat;

exports.RepeatRegistration = Tr;

exports.SVGAnalyzer = SVGAnalyzer;

exports.SVGAnalyzerRegistration = ir;

exports.SanitizeValueConverterRegistration = Sr;

exports.SelectValueObserver = SelectValueObserver;

exports.SelfBindingBehavior = SelfBindingBehavior;

exports.SelfBindingBehaviorRegistration = Nr;

exports.SetAttributeInstruction = SetAttributeInstruction;

exports.SetAttributeRendererRegistration = co;

exports.SetClassAttributeInstruction = SetClassAttributeInstruction;

exports.SetClassAttributeRendererRegistration = ao;

exports.SetPropertyInstruction = SetPropertyInstruction;

exports.SetPropertyRendererRegistration = ro;

exports.SetStyleAttributeInstruction = SetStyleAttributeInstruction;

exports.SetStyleAttributeRendererRegistration = uo;

exports.ShadowDOMRegistry = ShadowDOMRegistry;

exports.ShortHandBindingSyntax = cr;

exports.SignalBindingBehavior = SignalBindingBehavior;

exports.SignalBindingBehaviorRegistration = Yn;

exports.StandardConfiguration = xo;

exports.StyleAttributeAccessor = StyleAttributeAccessor;

exports.StyleBindingCommandRegistration = Cr;

exports.StyleConfiguration = Te;

exports.StyleElementStyles = StyleElementStyles;

exports.StylePropertyBindingInstruction = StylePropertyBindingInstruction;

exports.StylePropertyBindingRendererRegistration = fo;

exports.TemplateCompiler = TemplateCompiler;

exports.TemplateCompilerHooks = sn;

exports.TemplateControllerRendererRegistration = oo;

exports.TextBindingInstruction = TextBindingInstruction;

exports.TextBindingRendererRegistration = po;

exports.ThrottleBindingBehavior = ThrottleBindingBehavior;

exports.ThrottleBindingBehaviorRegistration = Zn;

exports.ToViewBindingBehavior = ToViewBindingBehavior;

exports.ToViewBindingBehaviorRegistration = Xn;

exports.ToViewBindingCommandRegistration = vr;

exports.TriggerBindingCommandRegistration = gr;

exports.TwoWayBindingBehavior = TwoWayBindingBehavior;

exports.TwoWayBindingBehaviorRegistration = Jn;

exports.TwoWayBindingCommandRegistration = mr;

exports.UpdateTriggerBindingBehavior = UpdateTriggerBindingBehavior;

exports.UpdateTriggerBindingBehaviorRegistration = Hr;

exports.ValueAttributeObserver = ValueAttributeObserver;

exports.ViewFactory = ViewFactory;

exports.ViewLocator = ViewLocator;

exports.ViewValueConverterRegistration = Er;

exports.Views = We;

exports.Watch = Xt;

exports.WcCustomElementRegistry = WcCustomElementRegistry;

exports.With = With;

exports.WithRegistration = Dr;

exports.allResources = L;

exports.applyBindingBehavior = as;

exports.attributePattern = z;

exports.bindable = S;

exports.bindingCommand = Ds;

exports.capture = ke;

exports.children = Rt;

exports.coercer = T;

exports.containerless = Zt;

exports.convertToRenderLocation = Oi;

exports.createElement = Vn;

exports.cssModules = Re;

exports.customAttribute = Lt;

exports.customElement = Kt;

exports.getEffectiveParentNode = $i;

exports.getRef = Si;

exports.isCustomElementController = ni;

exports.isCustomElementViewModel = ri;

exports.isInstruction = Wi;

exports.isRenderLocation = Li;

exports.lifecycleHooks = Ve;

exports.processContent = be;

exports.renderer = Xi;

exports.setEffectiveParentNode = Pi;

exports.setRef = Ei;

exports.shadowCSS = Se;

exports.strict = Qt;

exports.templateCompilerHooks = nn;

exports.templateController = qt;

exports.useShadowDOM = Yt;

exports.view = ze;

exports.watch = Wt;
//# sourceMappingURL=index.cjs.map
