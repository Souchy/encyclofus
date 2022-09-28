import { Protocol as t, Registration as e, DI as r, firstDefined as s, mergeArrays as i, fromAnnotationOrDefinitionOrTypeOrDefault as n, isNumberOrBigInt as o, isStringOrDate as c, emptyArray as u, isArrayIndex as h, IPlatform as a, ILogger as l } from "../../../kernel/dist/native-modules/index.mjs";

import { Metadata as f } from "../../../metadata/dist/native-modules/index.mjs";

const d = Object.prototype.hasOwnProperty;

const v = Reflect.defineProperty;

const p = t => "function" === typeof t;

const w = t => "string" === typeof t;

const g = t => t instanceof Array;

function b(t, e, r) {
    v(t, e, {
        enumerable: false,
        configurable: true,
        writable: true,
        value: r
    });
    return r;
}

function E(t, e, r, s = false) {
    if (s || !d.call(t, e)) b(t, e, r);
}

const A = () => Object.create(null);

const m = f.getOwn;

const y = f.hasOwn;

const x = f.define;

const U = t.annotation.keyFor;

const S = t.resource.keyFor;

const O = t.resource.appendTo;

function k(...t) {
    return function(e) {
        const r = U("aliases");
        const s = m(r, e);
        if (void 0 === s) x(r, t, e); else s.push(...t);
    };
}

function C(t, r, s, i) {
    for (let n = 0, o = t.length; n < o; ++n) e.aliasTo(s, r.keyFrom(t[n])).register(i);
}

Object.freeze({});

class BindingContext {
    constructor(t, e) {
        if (void 0 !== t) if (void 0 !== e) this[t] = e; else for (const e in t) if (d.call(t, e)) this[e] = t[e];
    }
    static create(t, e) {
        return new BindingContext(t, e);
    }
    static get(t, e, r, s) {
        var i, n;
        if (null == t) throw new Error(`AUR0203:${t}`);
        let o = t.overrideContext;
        let c = t;
        if (r > 0) {
            while (r > 0) {
                r--;
                c = c.parentScope;
                if (null == (null === c || void 0 === c ? void 0 : c.overrideContext)) return;
            }
            o = c.overrideContext;
            return e in o ? o : o.bindingContext;
        }
        while (!(null === c || void 0 === c ? void 0 : c.isBoundary) && null != o && !(e in o) && !(o.bindingContext && e in o.bindingContext)) {
            c = null !== (i = c.parentScope) && void 0 !== i ? i : null;
            o = null !== (n = null === c || void 0 === c ? void 0 : c.overrideContext) && void 0 !== n ? n : null;
        }
        if (o) return e in o ? o : o.bindingContext;
        return t.bindingContext || t.overrideContext;
    }
}

class Scope {
    constructor(t, e, r, s) {
        this.parentScope = t;
        this.bindingContext = e;
        this.overrideContext = r;
        this.isBoundary = s;
    }
    static create(t, e, r) {
        return new Scope(null, t, null == e ? OverrideContext.create(t) : e, null !== r && void 0 !== r ? r : false);
    }
    static fromOverride(t) {
        if (null == t) throw new Error(`AUR0204:${t}`);
        return new Scope(null, t.bindingContext, t, false);
    }
    static fromParent(t, e) {
        if (null == t) throw new Error(`AUR0205:${t}`);
        return new Scope(t, e, OverrideContext.create(e), false);
    }
}

class OverrideContext {
    constructor(t) {
        this.bindingContext = t;
    }
    static create(t) {
        return new OverrideContext(t);
    }
}

const $ = r.createInterface("ISignaler", (t => t.singleton(Signaler)));

class Signaler {
    constructor() {
        this.signals = A();
    }
    dispatchSignal(t, e) {
        const r = this.signals[t];
        if (void 0 === r) return;
        let s;
        for (s of r.keys()) s.handleChange(void 0, void 0, e);
    }
    addSignalListener(t, e) {
        const r = this.signals;
        const s = r[t];
        if (void 0 === s) r[t] = new Set([ e ]); else s.add(e);
    }
    removeSignalListener(t, e) {
        const r = this.signals[t];
        if (r) r.delete(e);
    }
}

var B;

(function(t) {
    t[t["singleton"] = 1] = "singleton";
    t[t["interceptor"] = 2] = "interceptor";
})(B || (B = {}));

function L(t) {
    return function(e) {
        return j.define(t, e);
    };
}

class BindingBehaviorDefinition {
    constructor(t, e, r, s, i) {
        this.Type = t;
        this.name = e;
        this.aliases = r;
        this.key = s;
        this.strategy = i;
    }
    static create(t, e) {
        let r;
        let o;
        if (w(t)) {
            r = t;
            o = {
                name: r
            };
        } else {
            r = t.name;
            o = t;
        }
        const c = Object.getPrototypeOf(e) === BindingInterceptor;
        return new BindingBehaviorDefinition(e, s(T(e, "name"), r), i(T(e, "aliases"), o.aliases, e.aliases), j.keyFrom(r), n("strategy", o, e, (() => c ? 2 : 1)));
    }
    register(t) {
        const {Type: r, key: s, aliases: i, strategy: n} = this;
        switch (n) {
          case 1:
            e.singleton(s, r).register(t);
            break;

          case 2:
            e.instance(s, new BindingBehaviorFactory(t, r)).register(t);
            break;
        }
        e.aliasTo(s, r).register(t);
        C(i, j, s, t);
    }
}

class BindingBehaviorFactory {
    constructor(t, e) {
        this.ctn = t;
        this.Type = e;
        this.deps = r.getDependencies(e);
    }
    construct(t, e) {
        const r = this.ctn;
        const s = this.deps;
        switch (s.length) {
          case 0:
            return new this.Type(t, e);

          case 1:
            return new this.Type(r.get(s[0]), t, e);

          case 2:
            return new this.Type(r.get(s[0]), r.get(s[1]), t, e);

          default:
            return new this.Type(...s.map((t => r.get(t))), t, e);
        }
    }
}

class BindingInterceptor {
    constructor(t, e) {
        this.binding = t;
        this.expr = e;
        this.interceptor = this;
        let r;
        while (t.interceptor !== this) {
            r = t.interceptor;
            t.interceptor = this;
            t = r;
        }
    }
    updateTarget(t, e) {
        this.binding.updateTarget(t, e);
    }
    updateSource(t, e) {
        this.binding.updateSource(t, e);
    }
    callSource(t) {
        return this.binding.callSource(t);
    }
    handleChange(t, e, r) {
        this.binding.handleChange(t, e, r);
    }
    handleCollectionChange(t, e) {
        this.binding.handleCollectionChange(t, e);
    }
    observe(t, e) {
        this.binding.observe(t, e);
    }
    observeCollection(t) {
        this.binding.observeCollection(t);
    }
    $bind(t, e) {
        this.binding.$bind(t, e);
    }
    $unbind(t) {
        this.binding.$unbind(t);
    }
}

const R = [ "isBound", "$scope", "obs", "sourceExpression", "locator", "oL" ];

R.forEach((t => {
    v(BindingInterceptor.prototype, t, {
        enumerable: false,
        configurable: true,
        get: function() {
            return this.binding[t];
        }
    });
}));

const P = S("binding-behavior");

const T = (t, e) => m(U(e), t);

const j = Object.freeze({
    name: P,
    keyFrom(t) {
        return `${P}:${t}`;
    },
    isType(t) {
        return p(t) && y(P, t);
    },
    define(t, e) {
        const r = BindingBehaviorDefinition.create(t, e);
        x(P, r, r.Type);
        x(P, r, r);
        O(e, P);
        return r.Type;
    },
    getDefinition(t) {
        const e = m(P, t);
        if (void 0 === e) throw new Error(`AUR0151:${t.name}`);
        return e;
    },
    annotate(t, e, r) {
        x(U(e), r, t);
    },
    getAnnotation: T
});

function I(t) {
    return function(e) {
        return F.define(t, e);
    };
}

class ValueConverterDefinition {
    constructor(t, e, r, s) {
        this.Type = t;
        this.name = e;
        this.aliases = r;
        this.key = s;
    }
    static create(t, e) {
        let r;
        let n;
        if (w(t)) {
            r = t;
            n = {
                name: r
            };
        } else {
            r = t.name;
            n = t;
        }
        return new ValueConverterDefinition(e, s(M(e, "name"), r), i(M(e, "aliases"), n.aliases, e.aliases), F.keyFrom(r));
    }
    register(t) {
        const {Type: r, key: s, aliases: i} = this;
        e.singleton(s, r).register(t);
        e.aliasTo(s, r).register(t);
        C(i, F, s, t);
    }
}

const D = S("value-converter");

const M = (t, e) => m(U(e), t);

const F = Object.freeze({
    name: D,
    keyFrom: t => `${D}:${t}`,
    isType(t) {
        return p(t) && y(D, t);
    },
    define(t, e) {
        const r = ValueConverterDefinition.create(t, e);
        x(D, r, r.Type);
        x(D, r, r);
        O(e, D);
        return r.Type;
    },
    getDefinition(t) {
        const e = m(D, t);
        if (void 0 === e) throw new Error(`AUR0152:${t.name}`);
        return e;
    },
    annotate(t, e, r) {
        x(U(e), r, t);
    },
    getAnnotation: M
});

var V;

(function(t) {
    t[t["CallsFunction"] = 128] = "CallsFunction";
    t[t["HasAncestor"] = 256] = "HasAncestor";
    t[t["IsPrimary"] = 512] = "IsPrimary";
    t[t["IsLeftHandSide"] = 1024] = "IsLeftHandSide";
    t[t["HasBind"] = 2048] = "HasBind";
    t[t["HasUnbind"] = 4096] = "HasUnbind";
    t[t["IsAssignable"] = 8192] = "IsAssignable";
    t[t["IsLiteral"] = 16384] = "IsLiteral";
    t[t["IsResource"] = 32768] = "IsResource";
    t[t["IsForDeclaration"] = 65536] = "IsForDeclaration";
    t[t["Type"] = 31] = "Type";
    t[t["AccessThis"] = 1793] = "AccessThis";
    t[t["AccessScope"] = 10082] = "AccessScope";
    t[t["ArrayLiteral"] = 17955] = "ArrayLiteral";
    t[t["ObjectLiteral"] = 17956] = "ObjectLiteral";
    t[t["PrimitiveLiteral"] = 17925] = "PrimitiveLiteral";
    t[t["Template"] = 17958] = "Template";
    t[t["Unary"] = 39] = "Unary";
    t[t["CallScope"] = 1448] = "CallScope";
    t[t["CallMember"] = 1161] = "CallMember";
    t[t["CallFunction"] = 1162] = "CallFunction";
    t[t["AccessMember"] = 9323] = "AccessMember";
    t[t["AccessKeyed"] = 9324] = "AccessKeyed";
    t[t["TaggedTemplate"] = 1197] = "TaggedTemplate";
    t[t["Binary"] = 46] = "Binary";
    t[t["Conditional"] = 63] = "Conditional";
    t[t["Assign"] = 8208] = "Assign";
    t[t["ArrowFunction"] = 17] = "ArrowFunction";
    t[t["ValueConverter"] = 36914] = "ValueConverter";
    t[t["BindingBehavior"] = 38963] = "BindingBehavior";
    t[t["HtmlLiteral"] = 52] = "HtmlLiteral";
    t[t["ArrayBindingPattern"] = 65557] = "ArrayBindingPattern";
    t[t["ObjectBindingPattern"] = 65558] = "ObjectBindingPattern";
    t[t["BindingIdentifier"] = 65559] = "BindingIdentifier";
    t[t["ForOfStatement"] = 6200] = "ForOfStatement";
    t[t["Interpolation"] = 25] = "Interpolation";
    t[t["ArrayDestructuring"] = 90138] = "ArrayDestructuring";
    t[t["ObjectDestructuring"] = 106523] = "ObjectDestructuring";
    t[t["DestructuringAssignmentLeaf"] = 139292] = "DestructuringAssignmentLeaf";
})(V || (V = {}));

class Unparser {
    constructor() {
        this.text = "";
    }
    static unparse(t) {
        const e = new Unparser;
        t.accept(e);
        return e.text;
    }
    visitAccessMember(t) {
        t.object.accept(this);
        this.text += `${t.optional ? "?" : ""}.${t.name}`;
    }
    visitAccessKeyed(t) {
        t.object.accept(this);
        this.text += `${t.optional ? "?." : ""}[`;
        t.key.accept(this);
        this.text += "]";
    }
    visitAccessThis(t) {
        if (0 === t.ancestor) {
            this.text += "$this";
            return;
        }
        this.text += "$parent";
        let e = t.ancestor - 1;
        while (e--) this.text += ".$parent";
    }
    visitAccessScope(t) {
        let e = t.ancestor;
        while (e--) this.text += "$parent.";
        this.text += t.name;
    }
    visitArrayLiteral(t) {
        const e = t.elements;
        this.text += "[";
        for (let t = 0, r = e.length; t < r; ++t) {
            if (0 !== t) this.text += ",";
            e[t].accept(this);
        }
        this.text += "]";
    }
    visitArrowFunction(t) {
        const e = t.args;
        const r = e.length;
        let s = 0;
        let i = "(";
        let n;
        for (;s < r; ++s) {
            n = e[s].name;
            if (s > 0) i += ", ";
            if (s < r - 1) i += n; else i += t.rest ? `...${n}` : n;
        }
        this.text += `${i}) => `;
        t.body.accept(this);
    }
    visitObjectLiteral(t) {
        const e = t.keys;
        const r = t.values;
        this.text += "{";
        for (let t = 0, s = e.length; t < s; ++t) {
            if (0 !== t) this.text += ",";
            this.text += `'${e[t]}':`;
            r[t].accept(this);
        }
        this.text += "}";
    }
    visitPrimitiveLiteral(t) {
        this.text += "(";
        if (w(t.value)) {
            const e = t.value.replace(/'/g, "\\'");
            this.text += `'${e}'`;
        } else this.text += `${t.value}`;
        this.text += ")";
    }
    visitCallFunction(t) {
        this.text += "(";
        t.func.accept(this);
        this.text += t.optional ? "?." : "";
        this.writeArgs(t.args);
        this.text += ")";
    }
    visitCallMember(t) {
        this.text += "(";
        t.object.accept(this);
        this.text += `${t.optionalMember ? "?." : ""}.${t.name}${t.optionalCall ? "?." : ""}`;
        this.writeArgs(t.args);
        this.text += ")";
    }
    visitCallScope(t) {
        this.text += "(";
        let e = t.ancestor;
        while (e--) this.text += "$parent.";
        this.text += `${t.name}${t.optional ? "?." : ""}`;
        this.writeArgs(t.args);
        this.text += ")";
    }
    visitTemplate(t) {
        const {cooked: e, expressions: r} = t;
        const s = r.length;
        this.text += "`";
        this.text += e[0];
        for (let t = 0; t < s; t++) {
            r[t].accept(this);
            this.text += e[t + 1];
        }
        this.text += "`";
    }
    visitTaggedTemplate(t) {
        const {cooked: e, expressions: r} = t;
        const s = r.length;
        t.func.accept(this);
        this.text += "`";
        this.text += e[0];
        for (let t = 0; t < s; t++) {
            r[t].accept(this);
            this.text += e[t + 1];
        }
        this.text += "`";
    }
    visitUnary(t) {
        this.text += `(${t.operation}`;
        if (t.operation.charCodeAt(0) >= 97) this.text += " ";
        t.expression.accept(this);
        this.text += ")";
    }
    visitBinary(t) {
        this.text += "(";
        t.left.accept(this);
        if (105 === t.operation.charCodeAt(0)) this.text += ` ${t.operation} `; else this.text += t.operation;
        t.right.accept(this);
        this.text += ")";
    }
    visitConditional(t) {
        this.text += "(";
        t.condition.accept(this);
        this.text += "?";
        t.yes.accept(this);
        this.text += ":";
        t.no.accept(this);
        this.text += ")";
    }
    visitAssign(t) {
        this.text += "(";
        t.target.accept(this);
        this.text += "=";
        t.value.accept(this);
        this.text += ")";
    }
    visitValueConverter(t) {
        const e = t.args;
        t.expression.accept(this);
        this.text += `|${t.name}`;
        for (let t = 0, r = e.length; t < r; ++t) {
            this.text += ":";
            e[t].accept(this);
        }
    }
    visitBindingBehavior(t) {
        const e = t.args;
        t.expression.accept(this);
        this.text += `&${t.name}`;
        for (let t = 0, r = e.length; t < r; ++t) {
            this.text += ":";
            e[t].accept(this);
        }
    }
    visitArrayBindingPattern(t) {
        const e = t.elements;
        this.text += "[";
        for (let t = 0, r = e.length; t < r; ++t) {
            if (0 !== t) this.text += ",";
            e[t].accept(this);
        }
        this.text += "]";
    }
    visitObjectBindingPattern(t) {
        const e = t.keys;
        const r = t.values;
        this.text += "{";
        for (let t = 0, s = e.length; t < s; ++t) {
            if (0 !== t) this.text += ",";
            this.text += `'${e[t]}':`;
            r[t].accept(this);
        }
        this.text += "}";
    }
    visitBindingIdentifier(t) {
        this.text += t.name;
    }
    visitHtmlLiteral(t) {
        throw new Error("visitHtmlLiteral");
    }
    visitForOfStatement(t) {
        t.declaration.accept(this);
        this.text += " of ";
        t.iterable.accept(this);
    }
    visitInterpolation(t) {
        const {parts: e, expressions: r} = t;
        const s = r.length;
        this.text += "${";
        this.text += e[0];
        for (let t = 0; t < s; t++) {
            r[t].accept(this);
            this.text += e[t + 1];
        }
        this.text += "}";
    }
    visitDestructuringAssignmentExpression(t) {
        const e = t.$kind;
        const r = 106523 === e;
        this.text += r ? "{" : "[";
        const s = t.list;
        const i = s.length;
        let n;
        let o;
        for (n = 0; n < i; n++) {
            o = s[n];
            switch (o.$kind) {
              case 139292:
                o.accept(this);
                break;

              case 90138:
              case 106523:
                {
                    const t = o.source;
                    if (t) {
                        t.accept(this);
                        this.text += ":";
                    }
                    o.accept(this);
                    break;
                }
            }
        }
        this.text += r ? "}" : "]";
    }
    visitDestructuringAssignmentSingleExpression(t) {
        t.source.accept(this);
        this.text += ":";
        t.target.accept(this);
        const e = t.initializer;
        if (void 0 !== e) {
            this.text += "=";
            e.accept(this);
        }
    }
    visitDestructuringAssignmentRestExpression(t) {
        this.text += "...";
        t.accept(this);
    }
    writeArgs(t) {
        this.text += "(";
        for (let e = 0, r = t.length; e < r; ++e) {
            if (0 !== e) this.text += ",";
            t[e].accept(this);
        }
        this.text += ")";
    }
}

class CustomExpression {
    constructor(t) {
        this.value = t;
    }
    evaluate(t, e, r, s) {
        return this.value;
    }
}

class BindingBehaviorExpression {
    constructor(t, e, r) {
        this.expression = t;
        this.name = e;
        this.args = r;
        this.behaviorKey = j.keyFrom(e);
    }
    get $kind() {
        return 38963;
    }
    get hasBind() {
        return true;
    }
    get hasUnbind() {
        return true;
    }
    evaluate(t, e, r, s) {
        return this.expression.evaluate(t, e, r, s);
    }
    assign(t, e, r, s) {
        return this.expression.assign(t, e, r, s);
    }
    bind(t, e, r) {
        if (this.expression.hasBind) this.expression.bind(t, e, r);
        const s = r.locator.get(this.behaviorKey);
        if (null == s) throw new Error(`AUR0101:${this.name}`);
        if (!(s instanceof BindingBehaviorFactory)) if (void 0 === r[this.behaviorKey]) {
            r[this.behaviorKey] = s;
            s.bind(t, e, r, ...this.args.map((s => s.evaluate(t, e, r.locator, null))));
        } else throw new Error(`AUR0102:${this.name}`);
    }
    unbind(t, e, r) {
        const s = this.behaviorKey;
        const i = r;
        if (void 0 !== i[s]) {
            if (p(i[s].unbind)) i[s].unbind(t, e, r);
            i[s] = void 0;
        }
        if (this.expression.hasUnbind) this.expression.unbind(t, e, r);
    }
    accept(t) {
        return t.visitBindingBehavior(this);
    }
    toString() {
        return Unparser.unparse(this);
    }
}

class ValueConverterExpression {
    constructor(t, e, r) {
        this.expression = t;
        this.name = e;
        this.args = r;
        this.converterKey = F.keyFrom(e);
    }
    get $kind() {
        return 36914;
    }
    get hasBind() {
        return false;
    }
    get hasUnbind() {
        return true;
    }
    evaluate(t, e, r, s) {
        const i = r.get(this.converterKey);
        if (null == i) throw new Error(`AUR0103:${this.name}`);
        if (null !== s && "handleChange" in s) {
            const t = i.signals;
            if (null != t) {
                const e = r.get($);
                for (let r = 0, i = t.length; r < i; ++r) e.addSignalListener(t[r], s);
            }
        }
        if ("toView" in i) return i.toView(this.expression.evaluate(t, e, r, s), ...this.args.map((i => i.evaluate(t, e, r, s))));
        return this.expression.evaluate(t, e, r, s);
    }
    assign(t, e, r, s) {
        const i = r.get(this.converterKey);
        if (null == i) throw new Error(`AUR0104:${this.name}`);
        if ("fromView" in i) s = i.fromView(s, ...this.args.map((s => s.evaluate(t, e, r, null))));
        return this.expression.assign(t, e, r, s);
    }
    unbind(t, e, r) {
        const s = r.locator.get(this.converterKey);
        if (void 0 === s.signals) return;
        const i = r.locator.get($);
        for (let t = 0; t < s.signals.length; ++t) i.removeSignalListener(s.signals[t], r);
    }
    accept(t) {
        return t.visitValueConverter(this);
    }
    toString() {
        return Unparser.unparse(this);
    }
}

class AssignExpression {
    constructor(t, e) {
        this.target = t;
        this.value = e;
    }
    get $kind() {
        return 8208;
    }
    get hasBind() {
        return false;
    }
    get hasUnbind() {
        return false;
    }
    evaluate(t, e, r, s) {
        return this.target.assign(t, e, r, this.value.evaluate(t, e, r, s));
    }
    assign(t, e, r, s) {
        this.value.assign(t, e, r, s);
        return this.target.assign(t, e, r, s);
    }
    accept(t) {
        return t.visitAssign(this);
    }
    toString() {
        return Unparser.unparse(this);
    }
}

class ConditionalExpression {
    constructor(t, e, r) {
        this.condition = t;
        this.yes = e;
        this.no = r;
    }
    get $kind() {
        return 63;
    }
    get hasBind() {
        return false;
    }
    get hasUnbind() {
        return false;
    }
    evaluate(t, e, r, s) {
        return this.condition.evaluate(t, e, r, s) ? this.yes.evaluate(t, e, r, s) : this.no.evaluate(t, e, r, s);
    }
    assign(t, e, r, s) {
        return;
    }
    accept(t) {
        return t.visitConditional(this);
    }
    toString() {
        return Unparser.unparse(this);
    }
}

class AccessThisExpression {
    constructor(t = 0) {
        this.ancestor = t;
    }
    get $kind() {
        return 1793;
    }
    get hasBind() {
        return false;
    }
    get hasUnbind() {
        return false;
    }
    evaluate(t, e, r, s) {
        var i;
        let n = e.overrideContext;
        let o = e;
        let c = this.ancestor;
        while (c-- && n) {
            o = o.parentScope;
            n = null !== (i = null === o || void 0 === o ? void 0 : o.overrideContext) && void 0 !== i ? i : null;
        }
        return c < 1 && n ? n.bindingContext : void 0;
    }
    assign(t, e, r, s) {
        return;
    }
    accept(t) {
        return t.visitAccessThis(this);
    }
    toString() {
        return Unparser.unparse(this);
    }
}

AccessThisExpression.$this = new AccessThisExpression(0);

AccessThisExpression.$parent = new AccessThisExpression(1);

class AccessScopeExpression {
    constructor(t, e = 0) {
        this.name = t;
        this.ancestor = e;
    }
    get $kind() {
        return 10082;
    }
    get hasBind() {
        return false;
    }
    get hasUnbind() {
        return false;
    }
    evaluate(t, e, r, s) {
        const i = BindingContext.get(e, this.name, this.ancestor, t);
        if (null !== s) s.observe(i, this.name);
        const n = i[this.name];
        if (null == n && "$host" === this.name) throw new Error(`AUR0105`);
        if (1 & t) return n;
        return null == n ? "" : n;
    }
    assign(t, e, r, s) {
        var i;
        if ("$host" === this.name) throw new Error(`AUR0106`);
        const n = BindingContext.get(e, this.name, this.ancestor, t);
        if (n instanceof Object) if (void 0 !== (null === (i = n.$observers) || void 0 === i ? void 0 : i[this.name])) {
            n.$observers[this.name].setValue(s, t);
            return s;
        } else return n[this.name] = s;
        return;
    }
    accept(t) {
        return t.visitAccessScope(this);
    }
    toString() {
        return Unparser.unparse(this);
    }
}

class AccessMemberExpression {
    constructor(t, e, r = false) {
        this.object = t;
        this.name = e;
        this.optional = r;
    }
    get $kind() {
        return 9323;
    }
    get hasBind() {
        return false;
    }
    get hasUnbind() {
        return false;
    }
    evaluate(t, e, r, s) {
        const i = this.object.evaluate(t, e, r, s);
        if (1 & t) {
            if (null == i) return i;
            if (null !== s) s.observe(i, this.name);
            return i[this.name];
        }
        if (null !== s && i instanceof Object) s.observe(i, this.name);
        return i ? i[this.name] : "";
    }
    assign(t, e, r, s) {
        const i = this.object.evaluate(t, e, r, null);
        if (i instanceof Object) if (void 0 !== i.$observers && void 0 !== i.$observers[this.name]) i.$observers[this.name].setValue(s, t); else i[this.name] = s; else this.object.assign(t, e, r, {
            [this.name]: s
        });
        return s;
    }
    accept(t) {
        return t.visitAccessMember(this);
    }
    toString() {
        return Unparser.unparse(this);
    }
}

class AccessKeyedExpression {
    constructor(t, e, r = false) {
        this.object = t;
        this.key = e;
        this.optional = r;
    }
    get $kind() {
        return 9324;
    }
    get hasBind() {
        return false;
    }
    get hasUnbind() {
        return false;
    }
    evaluate(t, e, r, s) {
        const i = this.object.evaluate(t, e, r, s);
        if (i instanceof Object) {
            const n = this.key.evaluate(t, e, r, s);
            if (null !== s) s.observe(i, n);
            return i[n];
        }
        return;
    }
    assign(t, e, r, s) {
        const i = this.object.evaluate(t, e, r, null);
        const n = this.key.evaluate(t, e, r, null);
        return i[n] = s;
    }
    accept(t) {
        return t.visitAccessKeyed(this);
    }
    toString() {
        return Unparser.unparse(this);
    }
}

class CallScopeExpression {
    constructor(t, e, r = 0, s = false) {
        this.name = t;
        this.args = e;
        this.ancestor = r;
        this.optional = s;
    }
    get $kind() {
        return 1448;
    }
    get hasBind() {
        return false;
    }
    get hasUnbind() {
        return false;
    }
    evaluate(t, e, r, s) {
        const i = this.args.map((i => i.evaluate(t, e, r, s)));
        const n = BindingContext.get(e, this.name, this.ancestor, t);
        const o = q(t, n, this.name);
        if (o) return o.apply(n, i);
        return;
    }
    assign(t, e, r, s) {
        return;
    }
    accept(t) {
        return t.visitCallScope(this);
    }
    toString() {
        return Unparser.unparse(this);
    }
}

const N = "at map filter includes indexOf lastIndexOf findIndex find flat flatMap join reduce reduceRight slice every some sort".split(" ");

class CallMemberExpression {
    constructor(t, e, r, s = false, i = false) {
        this.object = t;
        this.name = e;
        this.args = r;
        this.optionalMember = s;
        this.optionalCall = i;
    }
    get $kind() {
        return 1161;
    }
    get hasBind() {
        return false;
    }
    get hasUnbind() {
        return false;
    }
    evaluate(t, e, r, s) {
        const i = this.object.evaluate(t, e, r, s);
        const n = this.args.map((i => i.evaluate(t, e, r, s)));
        const o = q(t, i, this.name);
        if (o) {
            if (g(i) && N.includes(this.name)) null === s || void 0 === s ? void 0 : s.observeCollection(i);
            return o.apply(i, n);
        }
        return;
    }
    assign(t, e, r, s) {
        return;
    }
    accept(t) {
        return t.visitCallMember(this);
    }
    toString() {
        return Unparser.unparse(this);
    }
}

class CallFunctionExpression {
    constructor(t, e, r = false) {
        this.func = t;
        this.args = e;
        this.optional = r;
    }
    get $kind() {
        return 1162;
    }
    get hasBind() {
        return false;
    }
    get hasUnbind() {
        return false;
    }
    evaluate(t, e, r, s) {
        const i = this.func.evaluate(t, e, r, s);
        if (p(i)) return i(...this.args.map((i => i.evaluate(t, e, r, s))));
        if (!(8 & t) && null == i) return;
        throw new Error(`AUR0107`);
    }
    assign(t, e, r, s) {
        return;
    }
    accept(t) {
        return t.visitCallFunction(this);
    }
    toString() {
        return Unparser.unparse(this);
    }
}

class BinaryExpression {
    constructor(t, e, r) {
        this.operation = t;
        this.left = e;
        this.right = r;
    }
    get $kind() {
        return 46;
    }
    get hasBind() {
        return false;
    }
    get hasUnbind() {
        return false;
    }
    evaluate(t, e, r, s) {
        var i;
        switch (this.operation) {
          case "&&":
            return this.left.evaluate(t, e, r, s) && this.right.evaluate(t, e, r, s);

          case "||":
            return this.left.evaluate(t, e, r, s) || this.right.evaluate(t, e, r, s);

          case "??":
            return null !== (i = this.left.evaluate(t, e, r, s)) && void 0 !== i ? i : this.right.evaluate(t, e, r, s);

          case "==":
            return this.left.evaluate(t, e, r, s) == this.right.evaluate(t, e, r, s);

          case "===":
            return this.left.evaluate(t, e, r, s) === this.right.evaluate(t, e, r, s);

          case "!=":
            return this.left.evaluate(t, e, r, s) != this.right.evaluate(t, e, r, s);

          case "!==":
            return this.left.evaluate(t, e, r, s) !== this.right.evaluate(t, e, r, s);

          case "instanceof":
            {
                const i = this.right.evaluate(t, e, r, s);
                if (p(i)) return this.left.evaluate(t, e, r, s) instanceof i;
                return false;
            }

          case "in":
            {
                const i = this.right.evaluate(t, e, r, s);
                if (i instanceof Object) return this.left.evaluate(t, e, r, s) in i;
                return false;
            }

          case "+":
            {
                const i = this.left.evaluate(t, e, r, s);
                const n = this.right.evaluate(t, e, r, s);
                if ((1 & t) > 0) return i + n;
                if (!i || !n) {
                    if (o(i) || o(n)) return (i || 0) + (n || 0);
                    if (c(i) || c(n)) return (i || "") + (n || "");
                }
                return i + n;
            }

          case "-":
            return this.left.evaluate(t, e, r, s) - this.right.evaluate(t, e, r, s);

          case "*":
            return this.left.evaluate(t, e, r, s) * this.right.evaluate(t, e, r, s);

          case "/":
            return this.left.evaluate(t, e, r, s) / this.right.evaluate(t, e, r, s);

          case "%":
            return this.left.evaluate(t, e, r, s) % this.right.evaluate(t, e, r, s);

          case "<":
            return this.left.evaluate(t, e, r, s) < this.right.evaluate(t, e, r, s);

          case ">":
            return this.left.evaluate(t, e, r, s) > this.right.evaluate(t, e, r, s);

          case "<=":
            return this.left.evaluate(t, e, r, s) <= this.right.evaluate(t, e, r, s);

          case ">=":
            return this.left.evaluate(t, e, r, s) >= this.right.evaluate(t, e, r, s);

          default:
            throw new Error(`AUR0108:${this.operation}`);
        }
    }
    assign(t, e, r, s) {
        return;
    }
    accept(t) {
        return t.visitBinary(this);
    }
    toString() {
        return Unparser.unparse(this);
    }
}

class UnaryExpression {
    constructor(t, e) {
        this.operation = t;
        this.expression = e;
    }
    get $kind() {
        return 39;
    }
    get hasBind() {
        return false;
    }
    get hasUnbind() {
        return false;
    }
    evaluate(t, e, r, s) {
        switch (this.operation) {
          case "void":
            return void this.expression.evaluate(t, e, r, s);

          case "typeof":
            return typeof this.expression.evaluate(1 | t, e, r, s);

          case "!":
            return !this.expression.evaluate(t, e, r, s);

          case "-":
            return -this.expression.evaluate(t, e, r, s);

          case "+":
            return +this.expression.evaluate(t, e, r, s);

          default:
            throw new Error(`AUR0109:${this.operation}`);
        }
    }
    assign(t, e, r, s) {
        return;
    }
    accept(t) {
        return t.visitUnary(this);
    }
    toString() {
        return Unparser.unparse(this);
    }
}

class PrimitiveLiteralExpression {
    constructor(t) {
        this.value = t;
    }
    get $kind() {
        return 17925;
    }
    get hasBind() {
        return false;
    }
    get hasUnbind() {
        return false;
    }
    evaluate(t, e, r, s) {
        return this.value;
    }
    assign(t, e, r, s) {
        return;
    }
    accept(t) {
        return t.visitPrimitiveLiteral(this);
    }
    toString() {
        return Unparser.unparse(this);
    }
}

PrimitiveLiteralExpression.$undefined = new PrimitiveLiteralExpression(void 0);

PrimitiveLiteralExpression.$null = new PrimitiveLiteralExpression(null);

PrimitiveLiteralExpression.$true = new PrimitiveLiteralExpression(true);

PrimitiveLiteralExpression.$false = new PrimitiveLiteralExpression(false);

PrimitiveLiteralExpression.$empty = new PrimitiveLiteralExpression("");

class HtmlLiteralExpression {
    constructor(t) {
        this.parts = t;
    }
    get $kind() {
        return 52;
    }
    get hasBind() {
        return false;
    }
    get hasUnbind() {
        return false;
    }
    evaluate(t, e, r, s) {
        let i = "";
        for (let n = 0; n < this.parts.length; ++n) {
            const o = this.parts[n].evaluate(t, e, r, s);
            if (null == o) continue;
            i += o;
        }
        return i;
    }
    assign(t, e, r, s, i) {
        return;
    }
    accept(t) {
        return t.visitHtmlLiteral(this);
    }
    toString() {
        return Unparser.unparse(this);
    }
}

class ArrayLiteralExpression {
    constructor(t) {
        this.elements = t;
    }
    get $kind() {
        return 17955;
    }
    get hasBind() {
        return false;
    }
    get hasUnbind() {
        return false;
    }
    evaluate(t, e, r, s) {
        return this.elements.map((i => i.evaluate(t, e, r, s)));
    }
    assign(t, e, r, s) {
        return;
    }
    accept(t) {
        return t.visitArrayLiteral(this);
    }
    toString() {
        return Unparser.unparse(this);
    }
}

ArrayLiteralExpression.$empty = new ArrayLiteralExpression(u);

class ObjectLiteralExpression {
    constructor(t, e) {
        this.keys = t;
        this.values = e;
    }
    get $kind() {
        return 17956;
    }
    get hasBind() {
        return false;
    }
    get hasUnbind() {
        return false;
    }
    evaluate(t, e, r, s) {
        const i = {};
        for (let n = 0; n < this.keys.length; ++n) i[this.keys[n]] = this.values[n].evaluate(t, e, r, s);
        return i;
    }
    assign(t, e, r, s) {
        return;
    }
    accept(t) {
        return t.visitObjectLiteral(this);
    }
    toString() {
        return Unparser.unparse(this);
    }
}

ObjectLiteralExpression.$empty = new ObjectLiteralExpression(u, u);

class TemplateExpression {
    constructor(t, e = u) {
        this.cooked = t;
        this.expressions = e;
    }
    get $kind() {
        return 17958;
    }
    get hasBind() {
        return false;
    }
    get hasUnbind() {
        return false;
    }
    evaluate(t, e, r, s) {
        let i = this.cooked[0];
        for (let n = 0; n < this.expressions.length; ++n) {
            i += String(this.expressions[n].evaluate(t, e, r, s));
            i += this.cooked[n + 1];
        }
        return i;
    }
    assign(t, e, r, s) {
        return;
    }
    accept(t) {
        return t.visitTemplate(this);
    }
    toString() {
        return Unparser.unparse(this);
    }
}

TemplateExpression.$empty = new TemplateExpression([ "" ]);

class TaggedTemplateExpression {
    constructor(t, e, r, s = u) {
        this.cooked = t;
        this.func = r;
        this.expressions = s;
        t.raw = e;
    }
    get $kind() {
        return 1197;
    }
    get hasBind() {
        return false;
    }
    get hasUnbind() {
        return false;
    }
    evaluate(t, e, r, s) {
        const i = this.expressions.map((i => i.evaluate(t, e, r, s)));
        const n = this.func.evaluate(t, e, r, s);
        if (!p(n)) throw new Error(`AUR0110`);
        return n(this.cooked, ...i);
    }
    assign(t, e, r, s) {
        return;
    }
    accept(t) {
        return t.visitTaggedTemplate(this);
    }
    toString() {
        return Unparser.unparse(this);
    }
}

class ArrayBindingPattern {
    constructor(t) {
        this.elements = t;
    }
    get $kind() {
        return 65557;
    }
    get hasBind() {
        return false;
    }
    get hasUnbind() {
        return false;
    }
    evaluate(t, e, r, s) {
        return;
    }
    assign(t, e, r, s) {
        return;
    }
    accept(t) {
        return t.visitArrayBindingPattern(this);
    }
    toString() {
        return Unparser.unparse(this);
    }
}

class ObjectBindingPattern {
    constructor(t, e) {
        this.keys = t;
        this.values = e;
    }
    get $kind() {
        return 65558;
    }
    get hasBind() {
        return false;
    }
    get hasUnbind() {
        return false;
    }
    evaluate(t, e, r, s) {
        return;
    }
    assign(t, e, r, s) {
        return;
    }
    accept(t) {
        return t.visitObjectBindingPattern(this);
    }
    toString() {
        return Unparser.unparse(this);
    }
}

class BindingIdentifier {
    constructor(t) {
        this.name = t;
    }
    get $kind() {
        return 65559;
    }
    get hasBind() {
        return false;
    }
    get hasUnbind() {
        return false;
    }
    evaluate(t, e, r, s) {
        return this.name;
    }
    accept(t) {
        return t.visitBindingIdentifier(this);
    }
    toString() {
        return Unparser.unparse(this);
    }
}

const K = Object.prototype.toString;

class ForOfStatement {
    constructor(t, e) {
        this.declaration = t;
        this.iterable = e;
    }
    get $kind() {
        return 6200;
    }
    get hasBind() {
        return false;
    }
    get hasUnbind() {
        return false;
    }
    evaluate(t, e, r, s) {
        return this.iterable.evaluate(t, e, r, s);
    }
    assign(t, e, r, s) {
        return;
    }
    count(t, e) {
        switch (K.call(e)) {
          case "[object Array]":
            return e.length;

          case "[object Map]":
            return e.size;

          case "[object Set]":
            return e.size;

          case "[object Number]":
            return e;

          case "[object Null]":
            return 0;

          case "[object Undefined]":
            return 0;

          default:
            throw new Error(`Cannot count ${K.call(e)}`);
        }
    }
    iterate(t, e, r) {
        switch (K.call(e)) {
          case "[object Array]":
            return H(e, r);

          case "[object Map]":
            return Q(e, r);

          case "[object Set]":
            return _(e, r);

          case "[object Number]":
            return z(e, r);

          case "[object Null]":
            return;

          case "[object Undefined]":
            return;

          default:
            throw new Error(`Cannot iterate over ${K.call(e)}`);
        }
    }
    bind(t, e, r) {
        if (this.iterable.hasBind) this.iterable.bind(t, e, r);
    }
    unbind(t, e, r) {
        if (this.iterable.hasUnbind) this.iterable.unbind(t, e, r);
    }
    accept(t) {
        return t.visitForOfStatement(this);
    }
    toString() {
        return Unparser.unparse(this);
    }
}

class Interpolation {
    constructor(t, e = u) {
        this.parts = t;
        this.expressions = e;
        this.isMulti = e.length > 1;
        this.firstExpression = e[0];
    }
    get $kind() {
        return 25;
    }
    get hasBind() {
        return false;
    }
    get hasUnbind() {
        return false;
    }
    evaluate(t, e, r, s) {
        if (this.isMulti) {
            let i = this.parts[0];
            for (let n = 0; n < this.expressions.length; ++n) {
                i += String(this.expressions[n].evaluate(t, e, r, s));
                i += this.parts[n + 1];
            }
            return i;
        } else return `${this.parts[0]}${this.firstExpression.evaluate(t, e, r, s)}${this.parts[1]}`;
    }
    assign(t, e, r, s) {
        return;
    }
    accept(t) {
        return t.visitInterpolation(this);
    }
    toString() {
        return Unparser.unparse(this);
    }
}

class DestructuringAssignmentExpression {
    constructor(t, e, r, s) {
        this.$kind = t;
        this.list = e;
        this.source = r;
        this.initializer = s;
    }
    get hasBind() {
        return false;
    }
    get hasUnbind() {
        return false;
    }
    evaluate(t, e, r, s) {
        return;
    }
    assign(t, e, r, s) {
        var i;
        const n = this.list;
        const o = n.length;
        let c;
        let u;
        for (c = 0; c < o; c++) {
            u = n[c];
            switch (u.$kind) {
              case 139292:
                u.assign(t, e, r, s);
                break;

              case 90138:
              case 106523:
                {
                    if ("object" !== typeof s || null === s) throw new Error(`AUR0112`);
                    let n = u.source.evaluate(t, Scope.create(s), r, null);
                    if (void 0 === n) n = null === (i = u.initializer) || void 0 === i ? void 0 : i.evaluate(t, e, r, null);
                    u.assign(t, e, r, n);
                    break;
                }
            }
        }
    }
    accept(t) {
        return t.visitDestructuringAssignmentExpression(this);
    }
    toString() {
        return Unparser.unparse(this);
    }
}

class DestructuringAssignmentSingleExpression {
    constructor(t, e, r) {
        this.target = t;
        this.source = e;
        this.initializer = r;
    }
    get $kind() {
        return 139292;
    }
    evaluate(t, e, r, s) {
        return;
    }
    assign(t, e, r, s) {
        var i;
        if (null == s) return;
        if ("object" !== typeof s) throw new Error(`AUR0112`);
        let n = this.source.evaluate(t, Scope.create(s), r, null);
        if (void 0 === n) n = null === (i = this.initializer) || void 0 === i ? void 0 : i.evaluate(t, e, r, null);
        this.target.assign(t, e, r, n);
    }
    accept(t) {
        return t.visitDestructuringAssignmentSingleExpression(this);
    }
    toString() {
        return Unparser.unparse(this);
    }
}

class DestructuringAssignmentRestExpression {
    constructor(t, e) {
        this.target = t;
        this.indexOrProperties = e;
    }
    get $kind() {
        return 139292;
    }
    evaluate(t, e, r, s) {
        return;
    }
    assign(t, e, r, s) {
        if (null == s) return;
        if ("object" !== typeof s) throw new Error(`AUR0112`);
        const i = this.indexOrProperties;
        let n;
        if (h(i)) {
            if (!Array.isArray(s)) throw new Error(`AUR0112`);
            n = s.slice(i);
        } else n = Object.entries(s).reduce(((t, [e, r]) => {
            if (!i.includes(e)) t[e] = r;
            return t;
        }), {});
        this.target.assign(t, e, r, n);
    }
    accept(t) {
        return t.visitDestructuringAssignmentRestExpression(this);
    }
    toString() {
        return Unparser.unparse(this);
    }
}

class ArrowFunction {
    constructor(t, e, r = false) {
        this.args = t;
        this.body = e;
        this.rest = r;
    }
    get $kind() {
        return 17;
    }
    get hasBind() {
        return false;
    }
    get hasUnbind() {
        return false;
    }
    evaluate(t, e, r, s) {
        const i = (...i) => {
            const n = this.args;
            const o = this.rest;
            const c = n.length - 1;
            const u = n.reduce(((t, e, r) => {
                if (o && r === c) t[e.name] = i.slice(r); else t[e.name] = i[r];
                return t;
            }), {});
            const h = Scope.fromParent(e, u);
            return this.body.evaluate(t, h, r, s);
        };
        return i;
    }
    assign(t, e, r, s) {
        return;
    }
    accept(t) {
        return t.visitArrowFunction(this);
    }
    toString() {
        return Unparser.unparse(this);
    }
}

function q(t, e, r) {
    const s = null == e ? null : e[r];
    if (p(s)) return s;
    if (!(8 & t) && null == s) return null;
    throw new Error(`AUR0111:${r}`);
}

function H(t, e) {
    for (let r = 0, s = t.length; r < s; ++r) e(t, r, t[r]);
}

function Q(t, e) {
    const r = Array(t.size);
    let s = -1;
    for (const e of t.entries()) r[++s] = e;
    H(r, e);
}

function _(t, e) {
    const r = Array(t.size);
    let s = -1;
    for (const e of t.keys()) r[++s] = e;
    H(r, e);
}

function z(t, e) {
    const r = Array(t);
    for (let e = 0; e < t; ++e) r[e] = e;
    H(r, e);
}

const W = r.createInterface("ICoercionConfiguration");

var G;

(function(t) {
    t[t["oneTime"] = 1] = "oneTime";
    t[t["toView"] = 2] = "toView";
    t[t["fromView"] = 4] = "fromView";
    t[t["twoWay"] = 6] = "twoWay";
    t[t["default"] = 8] = "default";
})(G || (G = {}));

var Z;

(function(t) {
    t[t["none"] = 0] = "none";
    t[t["persistentBindingFlags"] = 33] = "persistentBindingFlags";
    t[t["noFlush"] = 32] = "noFlush";
    t[t["bindingStrategy"] = 1] = "bindingStrategy";
    t[t["isStrictBindingStrategy"] = 1] = "isStrictBindingStrategy";
    t[t["fromBind"] = 2] = "fromBind";
    t[t["fromUnbind"] = 4] = "fromUnbind";
    t[t["mustEvaluate"] = 8] = "mustEvaluate";
    t[t["dispose"] = 16] = "dispose";
})(Z || (Z = {}));

var J;

(function(t) {
    t[t["None"] = 0] = "None";
    t[t["Subscriber0"] = 1] = "Subscriber0";
    t[t["Subscriber1"] = 2] = "Subscriber1";
    t[t["Subscriber2"] = 4] = "Subscriber2";
    t[t["SubscribersRest"] = 8] = "SubscribersRest";
    t[t["Any"] = 15] = "Any";
})(J || (J = {}));

var X;

(function(t) {
    t[t["none"] = 0] = "none";
    t[t["capturing"] = 1] = "capturing";
    t[t["bubbling"] = 2] = "bubbling";
})(X || (X = {}));

var Y;

(function(t) {
    t[t["indexed"] = 8] = "indexed";
    t[t["keyed"] = 4] = "keyed";
    t[t["array"] = 9] = "array";
    t[t["map"] = 6] = "map";
    t[t["set"] = 7] = "set";
})(Y || (Y = {}));

var tt;

(function(t) {
    t[t["None"] = 0] = "None";
    t[t["Observer"] = 1] = "Observer";
    t[t["Node"] = 2] = "Node";
    t[t["Layout"] = 4] = "Layout";
    t[t["Primtive"] = 8] = "Primtive";
    t[t["Array"] = 18] = "Array";
    t[t["Set"] = 34] = "Set";
    t[t["Map"] = 66] = "Map";
})(tt || (tt = {}));

function et(t, e) {
    const {length: r} = t;
    const s = Array(r);
    let i = 0;
    while (i < r) {
        s[i] = t[i];
        ++i;
    }
    if (void 0 !== e) s.deletedItems = e.slice(0); else if (void 0 !== t.deletedItems) s.deletedItems = t.deletedItems.slice(0); else s.deletedItems = [];
    s.isIndexMap = true;
    return s;
}

function rt(t = 0) {
    const e = Array(t);
    let r = 0;
    while (r < t) e[r] = r++;
    e.deletedItems = [];
    e.isIndexMap = true;
    return e;
}

function st(t) {
    const e = t.slice();
    e.deletedItems = t.deletedItems.slice();
    e.isIndexMap = true;
    return e;
}

function it(t) {
    return g(t) && true === t.isIndexMap;
}

function nt(t) {
    return null == t ? ot : ot(t);
}

function ot(t) {
    const e = t.prototype;
    v(e, "subs", {
        get: ct
    });
    E(e, "subscribe", ut);
    E(e, "unsubscribe", ht);
}

class SubscriberRecord {
    constructor() {
        this.sf = 0;
        this.count = 0;
    }
    add(t) {
        if (this.has(t)) return false;
        const e = this.sf;
        if (0 === (1 & e)) {
            this.s0 = t;
            this.sf |= 1;
        } else if (0 === (2 & e)) {
            this.s1 = t;
            this.sf |= 2;
        } else if (0 === (4 & e)) {
            this.s2 = t;
            this.sf |= 4;
        } else if (0 === (8 & e)) {
            this.sr = [ t ];
            this.sf |= 8;
        } else this.sr.push(t);
        ++this.count;
        return true;
    }
    has(t) {
        const e = this.sf;
        if ((1 & e) > 0 && this.s0 === t) return true;
        if ((2 & e) > 0 && this.s1 === t) return true;
        if ((4 & e) > 0 && this.s2 === t) return true;
        if ((8 & e) > 0) {
            const e = this.sr;
            const r = e.length;
            let s = 0;
            for (;s < r; ++s) if (e[s] === t) return true;
        }
        return false;
    }
    any() {
        return 0 !== this.sf;
    }
    remove(t) {
        const e = this.sf;
        if ((1 & e) > 0 && this.s0 === t) {
            this.s0 = void 0;
            this.sf = 1 ^ (1 | this.sf);
            --this.count;
            return true;
        } else if ((2 & e) > 0 && this.s1 === t) {
            this.s1 = void 0;
            this.sf = 2 ^ (2 | this.sf);
            --this.count;
            return true;
        } else if ((4 & e) > 0 && this.s2 === t) {
            this.s2 = void 0;
            this.sf = 4 ^ (4 | this.sf);
            --this.count;
            return true;
        } else if ((8 & e) > 0) {
            const e = this.sr;
            const r = e.length;
            let s = 0;
            for (;s < r; ++s) if (e[s] === t) {
                e.splice(s, 1);
                if (1 === r) this.sf = 8 ^ (8 | this.sf);
                --this.count;
                return true;
            }
        }
        return false;
    }
    notify(t, e, r) {
        const s = this.s0;
        const i = this.s1;
        const n = this.s2;
        let o = this.sr;
        if (void 0 !== o) o = o.slice();
        if (void 0 !== s) s.handleChange(t, e, r);
        if (void 0 !== i) i.handleChange(t, e, r);
        if (void 0 !== n) n.handleChange(t, e, r);
        if (void 0 !== o) {
            const s = o.length;
            let i;
            let n = 0;
            for (;n < s; ++n) {
                i = o[n];
                if (void 0 !== i) i.handleChange(t, e, r);
            }
        }
    }
    notifyCollection(t, e) {
        const r = this.s0;
        const s = this.s1;
        const i = this.s2;
        let n = this.sr;
        if (void 0 !== n) n = n.slice();
        if (void 0 !== r) r.handleCollectionChange(t, e);
        if (void 0 !== s) s.handleCollectionChange(t, e);
        if (void 0 !== i) i.handleCollectionChange(t, e);
        if (void 0 !== n) {
            const r = n.length;
            let s;
            let i = 0;
            for (;i < r; ++i) {
                s = n[i];
                if (void 0 !== s) s.handleCollectionChange(t, e);
            }
        }
    }
}

function ct() {
    return b(this, "subs", new SubscriberRecord);
}

function ut(t) {
    return this.subs.add(t);
}

function ht(t) {
    return this.subs.remove(t);
}

function at(t) {
    return null == t ? lt : lt(t);
}

function lt(t) {
    const e = t.prototype;
    v(e, "queue", {
        get: ft
    });
}

class FlushQueue {
    constructor() {
        this.t = false;
        this.i = new Set;
    }
    get count() {
        return this.i.size;
    }
    add(t) {
        this.i.add(t);
        if (this.t) return;
        this.t = true;
        try {
            this.i.forEach(dt);
        } finally {
            this.t = false;
        }
    }
    clear() {
        this.i.clear();
        this.t = false;
    }
}

FlushQueue.instance = new FlushQueue;

function ft() {
    return FlushQueue.instance;
}

function dt(t, e, r) {
    r.delete(t);
    t.flush();
}

class CollectionLengthObserver {
    constructor(t) {
        this.owner = t;
        this.type = 18;
        this.f = 0;
        this.v = this.u = (this.o = t.collection).length;
    }
    getValue() {
        return this.o.length;
    }
    setValue(t, e) {
        const r = this.v;
        if (t !== r && h(t)) {
            if (0 === (32 & e)) this.o.length = t;
            this.v = t;
            this.u = r;
            this.f = e;
            this.queue.add(this);
        }
    }
    handleCollectionChange(t, e) {
        const r = this.v;
        const s = this.o.length;
        if ((this.v = s) !== r) {
            this.u = r;
            this.f = e;
            this.queue.add(this);
        }
    }
    flush() {
        gt = this.u;
        this.u = this.v;
        this.subs.notify(this.v, gt, this.f);
    }
}

class CollectionSizeObserver {
    constructor(t) {
        this.owner = t;
        this.f = 0;
        this.v = this.u = (this.o = t.collection).size;
        this.type = this.o instanceof Map ? 66 : 34;
    }
    getValue() {
        return this.o.size;
    }
    setValue() {
        throw new Error(`AUR02`);
    }
    handleCollectionChange(t, e) {
        const r = this.v;
        const s = this.o.size;
        if ((this.v = s) !== r) {
            this.u = r;
            this.f = e;
            this.queue.add(this);
        }
    }
    flush() {
        gt = this.u;
        this.u = this.v;
        this.subs.notify(this.v, gt, this.f);
    }
}

function vt(t) {
    const e = t.prototype;
    E(e, "subscribe", pt, true);
    E(e, "unsubscribe", wt, true);
    at(t);
    nt(t);
}

function pt(t) {
    if (this.subs.add(t) && 1 === this.subs.count) this.owner.subscribe(this);
}

function wt(t) {
    if (this.subs.remove(t) && 0 === this.subs.count) this.owner.subscribe(this);
}

vt(CollectionLengthObserver);

vt(CollectionSizeObserver);

let gt;

const bt = new WeakMap;

function Et(t, e) {
    if (t === e) return 0;
    t = null === t ? "null" : t.toString();
    e = null === e ? "null" : e.toString();
    return t < e ? -1 : 1;
}

function At(t, e) {
    if (void 0 === t) if (void 0 === e) return 0; else return 1;
    if (void 0 === e) return -1;
    return 0;
}

function mt(t, e, r, s, i) {
    let n, o, c, u, h;
    let a, l;
    for (a = r + 1; a < s; a++) {
        n = t[a];
        o = e[a];
        for (l = a - 1; l >= r; l--) {
            c = t[l];
            u = e[l];
            h = i(c, n);
            if (h > 0) {
                t[l + 1] = c;
                e[l + 1] = u;
            } else break;
        }
        t[l + 1] = n;
        e[l + 1] = o;
    }
}

function yt(t, e, r, s, i) {
    let n = 0, o = 0;
    let c, u, h;
    let a, l, f;
    let d, v, p;
    let w, g;
    let b, E, A, m;
    let y, x, U, S;
    while (true) {
        if (s - r <= 10) {
            mt(t, e, r, s, i);
            return;
        }
        n = r + (s - r >> 1);
        c = t[r];
        a = e[r];
        u = t[s - 1];
        l = e[s - 1];
        h = t[n];
        f = e[n];
        d = i(c, u);
        if (d > 0) {
            w = c;
            g = a;
            c = u;
            a = l;
            u = w;
            l = g;
        }
        v = i(c, h);
        if (v >= 0) {
            w = c;
            g = a;
            c = h;
            a = f;
            h = u;
            f = l;
            u = w;
            l = g;
        } else {
            p = i(u, h);
            if (p > 0) {
                w = u;
                g = l;
                u = h;
                l = f;
                h = w;
                f = g;
            }
        }
        t[r] = c;
        e[r] = a;
        t[s - 1] = h;
        e[s - 1] = f;
        b = u;
        E = l;
        A = r + 1;
        m = s - 1;
        t[n] = t[A];
        e[n] = e[A];
        t[A] = b;
        e[A] = E;
        t: for (o = A + 1; o < m; o++) {
            y = t[o];
            x = e[o];
            U = i(y, b);
            if (U < 0) {
                t[o] = t[A];
                e[o] = e[A];
                t[A] = y;
                e[A] = x;
                A++;
            } else if (U > 0) {
                do {
                    m--;
                    if (m == o) break t;
                    S = t[m];
                    U = i(S, b);
                } while (U > 0);
                t[o] = t[m];
                e[o] = e[m];
                t[m] = y;
                e[m] = x;
                if (U < 0) {
                    y = t[o];
                    x = e[o];
                    t[o] = t[A];
                    e[o] = e[A];
                    t[A] = y;
                    e[A] = x;
                    A++;
                }
            }
        }
        if (s - m < A - r) {
            yt(t, e, m, s, i);
            s = A;
        } else {
            yt(t, e, r, A, i);
            r = m;
        }
    }
}

const xt = Array.prototype;

const Ut = xt.push;

const St = xt.unshift;

const Ot = xt.pop;

const kt = xt.shift;

const Ct = xt.splice;

const $t = xt.reverse;

const Bt = xt.sort;

const Lt = {
    push: Ut,
    unshift: St,
    pop: Ot,
    shift: kt,
    splice: Ct,
    reverse: $t,
    sort: Bt
};

const Rt = [ "push", "unshift", "pop", "shift", "splice", "reverse", "sort" ];

const Pt = {
    push: function(...t) {
        const e = bt.get(this);
        if (void 0 === e) return Ut.apply(this, t);
        const r = this.length;
        const s = t.length;
        if (0 === s) return r;
        this.length = e.indexMap.length = r + s;
        let i = r;
        while (i < this.length) {
            this[i] = t[i - r];
            e.indexMap[i] = -2;
            i++;
        }
        e.notify();
        return this.length;
    },
    unshift: function(...t) {
        const e = bt.get(this);
        if (void 0 === e) return St.apply(this, t);
        const r = t.length;
        const s = new Array(r);
        let i = 0;
        while (i < r) s[i++] = -2;
        St.apply(e.indexMap, s);
        const n = St.apply(this, t);
        e.notify();
        return n;
    },
    pop: function() {
        const t = bt.get(this);
        if (void 0 === t) return Ot.call(this);
        const e = t.indexMap;
        const r = Ot.call(this);
        const s = e.length - 1;
        if (e[s] > -1) e.deletedItems.push(e[s]);
        Ot.call(e);
        t.notify();
        return r;
    },
    shift: function() {
        const t = bt.get(this);
        if (void 0 === t) return kt.call(this);
        const e = t.indexMap;
        const r = kt.call(this);
        if (e[0] > -1) e.deletedItems.push(e[0]);
        kt.call(e);
        t.notify();
        return r;
    },
    splice: function(...t) {
        const e = t[0];
        const r = t[1];
        const s = bt.get(this);
        if (void 0 === s) return Ct.apply(this, t);
        const i = this.length;
        const n = 0 | e;
        const o = n < 0 ? Math.max(i + n, 0) : Math.min(n, i);
        const c = s.indexMap;
        const u = t.length;
        const h = 0 === u ? 0 : 1 === u ? i - o : r;
        if (h > 0) {
            let t = o;
            const e = t + h;
            while (t < e) {
                if (c[t] > -1) c.deletedItems.push(c[t]);
                t++;
            }
        }
        if (u > 2) {
            const t = u - 2;
            const s = new Array(t);
            let i = 0;
            while (i < t) s[i++] = -2;
            Ct.call(c, e, r, ...s);
        } else Ct.apply(c, t);
        const a = Ct.apply(this, t);
        s.notify();
        return a;
    },
    reverse: function() {
        const t = bt.get(this);
        if (void 0 === t) {
            $t.call(this);
            return this;
        }
        const e = this.length;
        const r = e / 2 | 0;
        let s = 0;
        while (s !== r) {
            const r = e - s - 1;
            const i = this[s];
            const n = t.indexMap[s];
            const o = this[r];
            const c = t.indexMap[r];
            this[s] = o;
            t.indexMap[s] = c;
            this[r] = i;
            t.indexMap[r] = n;
            s++;
        }
        t.notify();
        return this;
    },
    sort: function(t) {
        const e = bt.get(this);
        if (void 0 === e) {
            Bt.call(this, t);
            return this;
        }
        let r = this.length;
        if (r < 2) return this;
        yt(this, e.indexMap, 0, r, At);
        let s = 0;
        while (s < r) {
            if (void 0 === this[s]) break;
            s++;
        }
        if (void 0 === t || !p(t)) t = Et;
        yt(this, e.indexMap, 0, s, t);
        let i = false;
        for (s = 0, r = e.indexMap.length; r > s; ++s) if (e.indexMap[s] !== s) {
            i = true;
            break;
        }
        if (i) e.notify();
        return this;
    }
};

for (const t of Rt) v(Pt[t], "observing", {
    value: true,
    writable: false,
    configurable: false,
    enumerable: false
});

let Tt = false;

function jt() {
    for (const t of Rt) if (true !== xt[t].observing) b(xt, t, Pt[t]);
}

function It() {
    for (const t of Rt) if (true === xt[t].observing) b(xt, t, Lt[t]);
}

class ArrayObserver {
    constructor(t) {
        this.type = 18;
        if (!Tt) {
            Tt = true;
            jt();
        }
        this.indexObservers = {};
        this.collection = t;
        this.indexMap = rt(t.length);
        this.lenObs = void 0;
        bt.set(t, this);
    }
    notify() {
        const t = this.indexMap;
        const e = this.collection.length;
        this.indexMap = rt(e);
        this.subs.notifyCollection(t, 0);
    }
    getLengthObserver() {
        var t;
        return null !== (t = this.lenObs) && void 0 !== t ? t : this.lenObs = new CollectionLengthObserver(this);
    }
    getIndexObserver(t) {
        var e;
        var r;
        return null !== (e = (r = this.indexObservers)[t]) && void 0 !== e ? e : r[t] = new ArrayIndexObserver(this, t);
    }
}

class ArrayIndexObserver {
    constructor(t, e) {
        this.owner = t;
        this.index = e;
        this.doNotCache = true;
        this.value = this.getValue();
    }
    getValue() {
        return this.owner.collection[this.index];
    }
    setValue(t, e) {
        if (t === this.getValue()) return;
        const r = this.owner;
        const s = this.index;
        const i = r.indexMap;
        if (i[s] > -1) i.deletedItems.push(i[s]);
        i[s] = -2;
        r.collection[s] = t;
        r.notify();
    }
    handleCollectionChange(t, e) {
        const r = this.index;
        const s = t[r] === r;
        if (s) return;
        const i = this.value;
        const n = this.value = this.getValue();
        if (i !== n) this.subs.notify(n, i, e);
    }
    subscribe(t) {
        if (this.subs.add(t) && 1 === this.subs.count) this.owner.subscribe(this);
    }
    unsubscribe(t) {
        if (this.subs.remove(t) && 0 === this.subs.count) this.owner.unsubscribe(this);
    }
}

nt(ArrayObserver);

nt(ArrayIndexObserver);

function Dt(t) {
    let e = bt.get(t);
    if (void 0 === e) e = new ArrayObserver(t);
    return e;
}

function Mt(t) {
    let e = 0;
    let r = 0;
    let s = 0;
    const i = st(t);
    const n = i.length;
    for (;s < n; ++s) {
        while (i.deletedItems[r] <= s - e) {
            ++r;
            --e;
        }
        if (-2 === i[s]) ++e; else i[s] += e;
    }
    return i;
}

function Ft(t, e) {
    const r = t.slice();
    const s = e.length;
    let i = 0;
    let n = 0;
    while (i < s) {
        n = e[i];
        if (-2 !== n) t[i] = r[n];
        ++i;
    }
}

const Vt = new WeakMap;

const Nt = Set.prototype;

const Kt = Nt.add;

const qt = Nt.clear;

const Ht = Nt.delete;

const Qt = {
    add: Kt,
    clear: qt,
    delete: Ht
};

const _t = [ "add", "clear", "delete" ];

const zt = {
    add: function(t) {
        const e = Vt.get(this);
        if (void 0 === e) {
            Kt.call(this, t);
            return this;
        }
        const r = this.size;
        Kt.call(this, t);
        const s = this.size;
        if (s === r) return this;
        e.indexMap[r] = -2;
        e.notify();
        return this;
    },
    clear: function() {
        const t = Vt.get(this);
        if (void 0 === t) return qt.call(this);
        const e = this.size;
        if (e > 0) {
            const e = t.indexMap;
            let r = 0;
            for (const t of this.keys()) {
                if (e[r] > -1) e.deletedItems.push(e[r]);
                r++;
            }
            qt.call(this);
            e.length = 0;
            t.notify();
        }
        return;
    },
    delete: function(t) {
        const e = Vt.get(this);
        if (void 0 === e) return Ht.call(this, t);
        const r = this.size;
        if (0 === r) return false;
        let s = 0;
        const i = e.indexMap;
        for (const r of this.keys()) {
            if (r === t) {
                if (i[s] > -1) i.deletedItems.push(i[s]);
                i.splice(s, 1);
                const r = Ht.call(this, t);
                if (true === r) e.notify();
                return r;
            }
            s++;
        }
        return false;
    }
};

const Wt = {
    writable: true,
    enumerable: false,
    configurable: true
};

for (const t of _t) v(zt[t], "observing", {
    value: true,
    writable: false,
    configurable: false,
    enumerable: false
});

let Gt = false;

function Zt() {
    for (const t of _t) if (true !== Nt[t].observing) v(Nt, t, {
        ...Wt,
        value: zt[t]
    });
}

function Jt() {
    for (const t of _t) if (true === Nt[t].observing) v(Nt, t, {
        ...Wt,
        value: Qt[t]
    });
}

class SetObserver {
    constructor(t) {
        this.type = 34;
        if (!Gt) {
            Gt = true;
            Zt();
        }
        this.collection = t;
        this.indexMap = rt(t.size);
        this.lenObs = void 0;
        Vt.set(t, this);
    }
    notify() {
        const t = this.indexMap;
        const e = this.collection.size;
        this.indexMap = rt(e);
        this.subs.notifyCollection(t, 0);
    }
    getLengthObserver() {
        var t;
        return null !== (t = this.lenObs) && void 0 !== t ? t : this.lenObs = new CollectionSizeObserver(this);
    }
}

nt(SetObserver);

function Xt(t) {
    let e = Vt.get(t);
    if (void 0 === e) e = new SetObserver(t);
    return e;
}

const Yt = new WeakMap;

const te = Map.prototype;

const ee = te.set;

const re = te.clear;

const se = te.delete;

const ie = {
    set: ee,
    clear: re,
    delete: se
};

const ne = [ "set", "clear", "delete" ];

const oe = {
    set: function(t, e) {
        const r = Yt.get(this);
        if (void 0 === r) {
            ee.call(this, t, e);
            return this;
        }
        const s = this.get(t);
        const i = this.size;
        ee.call(this, t, e);
        const n = this.size;
        if (n === i) {
            let e = 0;
            for (const i of this.entries()) {
                if (i[0] === t) {
                    if (i[1] !== s) {
                        r.indexMap.deletedItems.push(r.indexMap[e]);
                        r.indexMap[e] = -2;
                        r.notify();
                    }
                    return this;
                }
                e++;
            }
            return this;
        }
        r.indexMap[i] = -2;
        r.notify();
        return this;
    },
    clear: function() {
        const t = Yt.get(this);
        if (void 0 === t) return re.call(this);
        const e = this.size;
        if (e > 0) {
            const e = t.indexMap;
            let r = 0;
            for (const t of this.keys()) {
                if (e[r] > -1) e.deletedItems.push(e[r]);
                r++;
            }
            re.call(this);
            e.length = 0;
            t.notify();
        }
        return;
    },
    delete: function(t) {
        const e = Yt.get(this);
        if (void 0 === e) return se.call(this, t);
        const r = this.size;
        if (0 === r) return false;
        let s = 0;
        const i = e.indexMap;
        for (const r of this.keys()) {
            if (r === t) {
                if (i[s] > -1) i.deletedItems.push(i[s]);
                i.splice(s, 1);
                const r = se.call(this, t);
                if (true === r) e.notify();
                return r;
            }
            ++s;
        }
        return false;
    }
};

const ce = {
    writable: true,
    enumerable: false,
    configurable: true
};

for (const t of ne) v(oe[t], "observing", {
    value: true,
    writable: false,
    configurable: false,
    enumerable: false
});

let ue = false;

function he() {
    for (const t of ne) if (true !== te[t].observing) v(te, t, {
        ...ce,
        value: oe[t]
    });
}

function ae() {
    for (const t of ne) if (true === te[t].observing) v(te, t, {
        ...ce,
        value: ie[t]
    });
}

class MapObserver {
    constructor(t) {
        this.type = 66;
        if (!ue) {
            ue = true;
            he();
        }
        this.collection = t;
        this.indexMap = rt(t.size);
        this.lenObs = void 0;
        Yt.set(t, this);
    }
    notify() {
        const t = this.indexMap;
        const e = this.collection.size;
        this.indexMap = rt(e);
        this.subs.notifyCollection(t, 0);
    }
    getLengthObserver() {
        var t;
        return null !== (t = this.lenObs) && void 0 !== t ? t : this.lenObs = new CollectionSizeObserver(this);
    }
}

nt(MapObserver);

function le(t) {
    let e = Yt.get(t);
    if (void 0 === e) e = new MapObserver(t);
    return e;
}

function fe(t, e) {
    const r = this.oL.getObserver(t, e);
    this.obs.add(r);
}

function de() {
    return b(this, "obs", new BindingObserverRecord(this));
}

function ve(t) {
    let e;
    if (g(t)) e = Dt(t); else if (t instanceof Set) e = Xt(t); else if (t instanceof Map) e = le(t); else throw new Error(`AUR0210`);
    this.obs.add(e);
}

function pe(t) {
    this.obs.add(t);
}

function we() {
    throw new Error(`AUR2011:handleChange`);
}

function ge() {
    throw new Error(`AUR2011:handleCollectionChange`);
}

class BindingObserverRecord {
    constructor(t) {
        this.version = 0;
        this.count = 0;
        this.o = new Map;
        this.b = t;
    }
    handleChange(t, e, r) {
        return this.b.interceptor.handleChange(t, e, r);
    }
    handleCollectionChange(t, e) {
        this.b.interceptor.handleCollectionChange(t, e);
    }
    add(t) {
        if (!this.o.has(t)) {
            t.subscribe(this);
            ++this.count;
        }
        this.o.set(t, this.version);
    }
    clear() {
        this.o.forEach(Ee, this);
        this.count = this.o.size;
    }
    clearAll() {
        this.o.forEach(be, this);
        this.o.clear();
        this.count = 0;
    }
}

function be(t, e) {
    e.unsubscribe(this);
}

function Ee(t, e) {
    if (this.version !== t) {
        e.unsubscribe(this);
        this.o.delete(e);
    }
}

function Ae(t) {
    const e = t.prototype;
    E(e, "observe", fe, true);
    E(e, "observeCollection", ve, true);
    E(e, "subscribeTo", pe, true);
    v(e, "obs", {
        get: de
    });
    E(e, "handleChange", we);
    E(e, "handleCollectionChange", ge);
    return t;
}

function me(t) {
    return null == t ? Ae : Ae(t);
}

class BindingMediator {
    constructor(t, e, r, s) {
        this.key = t;
        this.binding = e;
        this.oL = r;
        this.locator = s;
        this.interceptor = this;
    }
    $bind() {
        throw new Error(`AUR0213:$bind`);
    }
    $unbind() {
        throw new Error(`AUR0214:$unbind`);
    }
    handleChange(t, e, r) {
        this.binding[this.key](t, e, r);
    }
}

Ae(BindingMediator);

const ye = r.createInterface("IExpressionParser", (t => t.singleton(ExpressionParser)));

class ExpressionParser {
    constructor() {
        this.h = A();
        this.A = A();
        this.U = A();
    }
    parse(t, e) {
        let r;
        switch (e) {
          case 16:
            return new CustomExpression(t);

          case 1:
            r = this.U[t];
            if (void 0 === r) r = this.U[t] = this.$parse(t, e);
            return r;

          case 2:
            r = this.A[t];
            if (void 0 === r) r = this.A[t] = this.$parse(t, e);
            return r;

          default:
            if (0 === t.length) {
                if ((e & (4 | 8)) > 0) return PrimitiveLiteralExpression.$empty;
                throw mr();
            }
            r = this.h[t];
            if (void 0 === r) r = this.h[t] = this.$parse(t, e);
            return r;
        }
    }
    $parse(t, e) {
        Te = t;
        je = 0;
        Ie = t.length;
        De = 0;
        Me = 0;
        Fe = 6291456;
        Ve = "";
        Ne = t.charCodeAt(0);
        Ke = true;
        qe = false;
        return _e(61, void 0 === e ? 8 : e);
    }
}

var xe;

(function(t) {
    t[t["Null"] = 0] = "Null";
    t[t["Backspace"] = 8] = "Backspace";
    t[t["Tab"] = 9] = "Tab";
    t[t["LineFeed"] = 10] = "LineFeed";
    t[t["VerticalTab"] = 11] = "VerticalTab";
    t[t["FormFeed"] = 12] = "FormFeed";
    t[t["CarriageReturn"] = 13] = "CarriageReturn";
    t[t["Space"] = 32] = "Space";
    t[t["Exclamation"] = 33] = "Exclamation";
    t[t["DoubleQuote"] = 34] = "DoubleQuote";
    t[t["Dollar"] = 36] = "Dollar";
    t[t["Percent"] = 37] = "Percent";
    t[t["Ampersand"] = 38] = "Ampersand";
    t[t["SingleQuote"] = 39] = "SingleQuote";
    t[t["OpenParen"] = 40] = "OpenParen";
    t[t["CloseParen"] = 41] = "CloseParen";
    t[t["Asterisk"] = 42] = "Asterisk";
    t[t["Plus"] = 43] = "Plus";
    t[t["Comma"] = 44] = "Comma";
    t[t["Minus"] = 45] = "Minus";
    t[t["Dot"] = 46] = "Dot";
    t[t["Slash"] = 47] = "Slash";
    t[t["Semicolon"] = 59] = "Semicolon";
    t[t["Backtick"] = 96] = "Backtick";
    t[t["OpenBracket"] = 91] = "OpenBracket";
    t[t["Backslash"] = 92] = "Backslash";
    t[t["CloseBracket"] = 93] = "CloseBracket";
    t[t["Caret"] = 94] = "Caret";
    t[t["Underscore"] = 95] = "Underscore";
    t[t["OpenBrace"] = 123] = "OpenBrace";
    t[t["Bar"] = 124] = "Bar";
    t[t["CloseBrace"] = 125] = "CloseBrace";
    t[t["Colon"] = 58] = "Colon";
    t[t["LessThan"] = 60] = "LessThan";
    t[t["Equals"] = 61] = "Equals";
    t[t["GreaterThan"] = 62] = "GreaterThan";
    t[t["Question"] = 63] = "Question";
    t[t["Zero"] = 48] = "Zero";
    t[t["One"] = 49] = "One";
    t[t["Two"] = 50] = "Two";
    t[t["Three"] = 51] = "Three";
    t[t["Four"] = 52] = "Four";
    t[t["Five"] = 53] = "Five";
    t[t["Six"] = 54] = "Six";
    t[t["Seven"] = 55] = "Seven";
    t[t["Eight"] = 56] = "Eight";
    t[t["Nine"] = 57] = "Nine";
    t[t["UpperA"] = 65] = "UpperA";
    t[t["UpperB"] = 66] = "UpperB";
    t[t["UpperC"] = 67] = "UpperC";
    t[t["UpperD"] = 68] = "UpperD";
    t[t["UpperE"] = 69] = "UpperE";
    t[t["UpperF"] = 70] = "UpperF";
    t[t["UpperG"] = 71] = "UpperG";
    t[t["UpperH"] = 72] = "UpperH";
    t[t["UpperI"] = 73] = "UpperI";
    t[t["UpperJ"] = 74] = "UpperJ";
    t[t["UpperK"] = 75] = "UpperK";
    t[t["UpperL"] = 76] = "UpperL";
    t[t["UpperM"] = 77] = "UpperM";
    t[t["UpperN"] = 78] = "UpperN";
    t[t["UpperO"] = 79] = "UpperO";
    t[t["UpperP"] = 80] = "UpperP";
    t[t["UpperQ"] = 81] = "UpperQ";
    t[t["UpperR"] = 82] = "UpperR";
    t[t["UpperS"] = 83] = "UpperS";
    t[t["UpperT"] = 84] = "UpperT";
    t[t["UpperU"] = 85] = "UpperU";
    t[t["UpperV"] = 86] = "UpperV";
    t[t["UpperW"] = 87] = "UpperW";
    t[t["UpperX"] = 88] = "UpperX";
    t[t["UpperY"] = 89] = "UpperY";
    t[t["UpperZ"] = 90] = "UpperZ";
    t[t["LowerA"] = 97] = "LowerA";
    t[t["LowerB"] = 98] = "LowerB";
    t[t["LowerC"] = 99] = "LowerC";
    t[t["LowerD"] = 100] = "LowerD";
    t[t["LowerE"] = 101] = "LowerE";
    t[t["LowerF"] = 102] = "LowerF";
    t[t["LowerG"] = 103] = "LowerG";
    t[t["LowerH"] = 104] = "LowerH";
    t[t["LowerI"] = 105] = "LowerI";
    t[t["LowerJ"] = 106] = "LowerJ";
    t[t["LowerK"] = 107] = "LowerK";
    t[t["LowerL"] = 108] = "LowerL";
    t[t["LowerM"] = 109] = "LowerM";
    t[t["LowerN"] = 110] = "LowerN";
    t[t["LowerO"] = 111] = "LowerO";
    t[t["LowerP"] = 112] = "LowerP";
    t[t["LowerQ"] = 113] = "LowerQ";
    t[t["LowerR"] = 114] = "LowerR";
    t[t["LowerS"] = 115] = "LowerS";
    t[t["LowerT"] = 116] = "LowerT";
    t[t["LowerU"] = 117] = "LowerU";
    t[t["LowerV"] = 118] = "LowerV";
    t[t["LowerW"] = 119] = "LowerW";
    t[t["LowerX"] = 120] = "LowerX";
    t[t["LowerY"] = 121] = "LowerY";
    t[t["LowerZ"] = 122] = "LowerZ";
})(xe || (xe = {}));

function Ue(t) {
    switch (t) {
      case 98:
        return 8;

      case 116:
        return 9;

      case 110:
        return 10;

      case 118:
        return 11;

      case 102:
        return 12;

      case 114:
        return 13;

      case 34:
        return 34;

      case 39:
        return 39;

      case 92:
        return 92;

      default:
        return t;
    }
}

var Se;

(function(t) {
    t[t["Variadic"] = 61] = "Variadic";
    t[t["Assign"] = 62] = "Assign";
    t[t["Conditional"] = 63] = "Conditional";
    t[t["NullishCoalescing"] = 128] = "NullishCoalescing";
    t[t["LogicalOR"] = 192] = "LogicalOR";
    t[t["LogicalAND"] = 256] = "LogicalAND";
    t[t["Equality"] = 320] = "Equality";
    t[t["Relational"] = 384] = "Relational";
    t[t["Additive"] = 448] = "Additive";
    t[t["Multiplicative"] = 512] = "Multiplicative";
    t[t["Binary"] = 513] = "Binary";
    t[t["LeftHandSide"] = 514] = "LeftHandSide";
    t[t["Primary"] = 515] = "Primary";
    t[t["Unary"] = 516] = "Unary";
})(Se || (Se = {}));

var Oe;

(function(t) {
    t[t["EOF"] = 6291456] = "EOF";
    t[t["ExpressionTerminal"] = 4194304] = "ExpressionTerminal";
    t[t["AccessScopeTerminal"] = 2097152] = "AccessScopeTerminal";
    t[t["ClosingToken"] = 1048576] = "ClosingToken";
    t[t["OpeningToken"] = 524288] = "OpeningToken";
    t[t["BinaryOp"] = 262144] = "BinaryOp";
    t[t["UnaryOp"] = 131072] = "UnaryOp";
    t[t["LeftHandSide"] = 65536] = "LeftHandSide";
    t[t["StringOrNumericLiteral"] = 49152] = "StringOrNumericLiteral";
    t[t["NumericLiteral"] = 32768] = "NumericLiteral";
    t[t["StringLiteral"] = 16384] = "StringLiteral";
    t[t["IdentifierName"] = 12288] = "IdentifierName";
    t[t["Keyword"] = 8192] = "Keyword";
    t[t["Identifier"] = 4096] = "Identifier";
    t[t["Contextual"] = 2048] = "Contextual";
    t[t["OptionalSuffix"] = 13312] = "OptionalSuffix";
    t[t["Precedence"] = 960] = "Precedence";
    t[t["Type"] = 63] = "Type";
    t[t["FalseKeyword"] = 8192] = "FalseKeyword";
    t[t["TrueKeyword"] = 8193] = "TrueKeyword";
    t[t["NullKeyword"] = 8194] = "NullKeyword";
    t[t["UndefinedKeyword"] = 8195] = "UndefinedKeyword";
    t[t["ThisScope"] = 12292] = "ThisScope";
    t[t["ParentScope"] = 12294] = "ParentScope";
    t[t["OpenParen"] = 2688007] = "OpenParen";
    t[t["OpenBrace"] = 524296] = "OpenBrace";
    t[t["Dot"] = 65545] = "Dot";
    t[t["DotDot"] = 10] = "DotDot";
    t[t["DotDotDot"] = 11] = "DotDotDot";
    t[t["QuestionDot"] = 2162700] = "QuestionDot";
    t[t["CloseBrace"] = 7340045] = "CloseBrace";
    t[t["CloseParen"] = 7340046] = "CloseParen";
    t[t["Comma"] = 6291471] = "Comma";
    t[t["OpenBracket"] = 2688016] = "OpenBracket";
    t[t["CloseBracket"] = 7340051] = "CloseBracket";
    t[t["Colon"] = 6291476] = "Colon";
    t[t["Question"] = 6291477] = "Question";
    t[t["Ampersand"] = 6291478] = "Ampersand";
    t[t["Bar"] = 6291479] = "Bar";
    t[t["QuestionQuestion"] = 6553752] = "QuestionQuestion";
    t[t["BarBar"] = 6553817] = "BarBar";
    t[t["AmpersandAmpersand"] = 6553882] = "AmpersandAmpersand";
    t[t["EqualsEquals"] = 6553947] = "EqualsEquals";
    t[t["ExclamationEquals"] = 6553948] = "ExclamationEquals";
    t[t["EqualsEqualsEquals"] = 6553949] = "EqualsEqualsEquals";
    t[t["ExclamationEqualsEquals"] = 6553950] = "ExclamationEqualsEquals";
    t[t["LessThan"] = 6554015] = "LessThan";
    t[t["GreaterThan"] = 6554016] = "GreaterThan";
    t[t["LessThanEquals"] = 6554017] = "LessThanEquals";
    t[t["GreaterThanEquals"] = 6554018] = "GreaterThanEquals";
    t[t["InKeyword"] = 6562211] = "InKeyword";
    t[t["InstanceOfKeyword"] = 6562212] = "InstanceOfKeyword";
    t[t["Plus"] = 2490853] = "Plus";
    t[t["Minus"] = 2490854] = "Minus";
    t[t["TypeofKeyword"] = 139303] = "TypeofKeyword";
    t[t["VoidKeyword"] = 139304] = "VoidKeyword";
    t[t["Asterisk"] = 6554153] = "Asterisk";
    t[t["Percent"] = 6554154] = "Percent";
    t[t["Slash"] = 6554155] = "Slash";
    t[t["Equals"] = 4194348] = "Equals";
    t[t["Exclamation"] = 131117] = "Exclamation";
    t[t["TemplateTail"] = 2163758] = "TemplateTail";
    t[t["TemplateContinuation"] = 2163759] = "TemplateContinuation";
    t[t["OfKeyword"] = 4204592] = "OfKeyword";
    t[t["Arrow"] = 49] = "Arrow";
})(Oe || (Oe = {}));

const ke = PrimitiveLiteralExpression.$false;

const Ce = PrimitiveLiteralExpression.$true;

const $e = PrimitiveLiteralExpression.$null;

const Be = PrimitiveLiteralExpression.$undefined;

const Le = AccessThisExpression.$this;

const Re = AccessThisExpression.$parent;

var Pe;

(function(t) {
    t[t["None"] = 0] = "None";
    t[t["Interpolation"] = 1] = "Interpolation";
    t[t["IsIterator"] = 2] = "IsIterator";
    t[t["IsFunction"] = 4] = "IsFunction";
    t[t["IsProperty"] = 8] = "IsProperty";
    t[t["IsCustom"] = 16] = "IsCustom";
})(Pe || (Pe = {}));

let Te = "";

let je = 0;

let Ie = 0;

let De = 0;

let Me = 0;

let Fe = 6291456;

let Ve = "";

let Ne;

let Ke = true;

let qe = false;

function He() {
    return Te.slice(Me, je);
}

function Qe(t, e) {
    Te = t;
    je = 0;
    Ie = t.length;
    De = 0;
    Me = 0;
    Fe = 6291456;
    Ve = "";
    Ne = t.charCodeAt(0);
    Ke = true;
    qe = false;
    return _e(61, void 0 === e ? 8 : e);
}

function _e(t, e) {
    if (16 === e) return new CustomExpression(Te);
    if (0 === je) {
        if (1 & e) return sr();
        or();
        if (4194304 & Fe) throw pr();
    }
    Ke = 513 > t;
    qe = false;
    let r = false;
    let s;
    let i = 0;
    if (131072 & Fe) {
        const t = Nr[63 & Fe];
        or();
        s = new UnaryExpression(t, _e(514, e));
        Ke = false;
    } else {
        t: switch (Fe) {
          case 12294:
            i = De;
            Ke = false;
            do {
                or();
                ++i;
                switch (Fe) {
                  case 65545:
                    or();
                    if (0 === (12288 & Fe)) throw gr();
                    break;

                  case 10:
                  case 11:
                    throw gr();

                  case 2162700:
                    qe = true;
                    or();
                    if (0 === (12288 & Fe)) {
                        s = 0 === i ? Le : 1 === i ? Re : new AccessThisExpression(i);
                        r = true;
                        break t;
                    }
                    break;

                  default:
                    if (2097152 & Fe) {
                        s = 0 === i ? Le : 1 === i ? Re : new AccessThisExpression(i);
                        break t;
                    }
                    throw br();
                }
            } while (12294 === Fe);

          case 4096:
            {
                const t = Ve;
                if (2 & e) s = new BindingIdentifier(t); else s = new AccessScopeExpression(t, i);
                Ke = !qe;
                or();
                if (dr(49)) {
                    if (524296 === Fe) throw Fr();
                    const e = qe;
                    const r = De;
                    ++De;
                    const i = _e(62, 0);
                    qe = e;
                    De = r;
                    Ke = false;
                    s = new ArrowFunction([ new BindingIdentifier(t) ], i);
                }
                break;
            }

          case 10:
            throw Vr();

          case 11:
            throw wr();

          case 12292:
            Ke = false;
            or();
            switch (De) {
              case 0:
                s = Le;
                break;

              case 1:
                s = Re;
                break;

              default:
                s = new AccessThisExpression(De);
                break;
            }
            break;

          case 2688007:
            s = Ye(e);
            break;

          case 2688016:
            s = Te.search(/\s+of\s+/) > je ? ze() : tr(e);
            break;

          case 524296:
            s = rr(e);
            break;

          case 2163758:
            s = new TemplateExpression([ Ve ]);
            Ke = false;
            or();
            break;

          case 2163759:
            s = ir(e, s, false);
            break;

          case 16384:
          case 32768:
            s = new PrimitiveLiteralExpression(Ve);
            Ke = false;
            or();
            break;

          case 8194:
          case 8195:
          case 8193:
          case 8192:
            s = Nr[63 & Fe];
            Ke = false;
            or();
            break;

          default:
            if (je >= Ie) throw Er(); else throw Ar();
        }
        if (2 & e) return er(s);
        if (514 < t) return s;
        if (10 === Fe || 11 === Fe) throw gr();
        if (1793 === s.$kind) switch (Fe) {
          case 2162700:
            qe = true;
            Ke = false;
            or();
            if (0 === (13312 & Fe)) throw Pr();
            if (12288 & Fe) {
                s = new AccessScopeExpression(Ve, s.ancestor);
                or();
            } else if (2688007 === Fe) s = new CallFunctionExpression(s, We(), true); else if (2688016 === Fe) s = Ge(s, true); else throw Tr();
            break;

          case 65545:
            Ke = !qe;
            or();
            if (0 === (12288 & Fe)) throw gr();
            s = new AccessScopeExpression(Ve, s.ancestor);
            or();
            break;

          case 10:
          case 11:
            throw gr();

          case 2688007:
            s = new CallFunctionExpression(s, We(), r);
            break;

          case 2688016:
            s = Ge(s, r);
            break;

          case 2163758:
            s = nr(s);
            break;

          case 2163759:
            s = ir(e, s, true);
            break;
        }
        while ((65536 & Fe) > 0) switch (Fe) {
          case 2162700:
            s = Ze(s);
            break;

          case 65545:
            or();
            if (0 === (12288 & Fe)) throw gr();
            s = Je(s, false);
            break;

          case 10:
          case 11:
            throw gr();

          case 2688007:
            if (10082 === s.$kind) s = new CallScopeExpression(s.name, We(), s.ancestor, false); else if (9323 === s.$kind) s = new CallMemberExpression(s.object, s.name, We(), s.optional, false); else s = new CallFunctionExpression(s, We(), false);
            break;

          case 2688016:
            s = Ge(s, false);
            break;

          case 2163758:
            if (qe) throw Tr();
            s = nr(s);
            break;

          case 2163759:
            if (qe) throw Tr();
            s = ir(e, s, true);
            break;
        }
    }
    if (10 === Fe || 11 === Fe) throw gr();
    if (513 < t) return s;
    while ((262144 & Fe) > 0) {
        const r = Fe;
        if ((960 & r) <= t) break;
        or();
        s = new BinaryExpression(Nr[63 & r], s, _e(960 & r, e));
        Ke = false;
    }
    if (63 < t) return s;
    if (dr(6291477)) {
        const t = _e(62, e);
        vr(6291476);
        s = new ConditionalExpression(s, t, _e(62, e));
        Ke = false;
    }
    if (62 < t) return s;
    if (dr(4194348)) {
        if (!Ke) throw yr();
        s = new AssignExpression(s, _e(62, e));
    }
    if (61 < t) return s;
    while (dr(6291479)) {
        if (6291456 === Fe) throw xr();
        const t = Ve;
        or();
        const r = new Array;
        while (dr(6291476)) r.push(_e(62, e));
        s = new ValueConverterExpression(s, t, r);
    }
    while (dr(6291478)) {
        if (6291456 === Fe) throw Ur();
        const t = Ve;
        or();
        const r = new Array;
        while (dr(6291476)) r.push(_e(62, e));
        s = new BindingBehaviorExpression(s, t, r);
    }
    if (6291456 !== Fe) {
        if (1 & e) return s;
        if ("of" === He()) throw Sr();
        throw Ar();
    }
    return s;
}

function ze() {
    const t = [];
    const e = new DestructuringAssignmentExpression(90138, t, void 0, void 0);
    let r = "";
    let s = true;
    let i = 0;
    while (s) {
        or();
        switch (Fe) {
          case 7340051:
            s = false;
            n();
            break;

          case 6291471:
            n();
            break;

          case 4096:
            r = He();
            break;

          default:
            throw Rr();
        }
    }
    vr(7340051);
    return e;
    function n() {
        if ("" !== r) {
            t.push(new DestructuringAssignmentSingleExpression(new AccessMemberExpression(Le, r), new AccessKeyedExpression(Le, new PrimitiveLiteralExpression(i++)), void 0));
            r = "";
        } else i++;
    }
}

function We() {
    const t = qe;
    or();
    const e = [];
    while (7340046 !== Fe) {
        e.push(_e(62, 0));
        if (!dr(6291471)) break;
    }
    vr(7340046);
    Ke = false;
    qe = t;
    return e;
}

function Ge(t, e) {
    const r = qe;
    or();
    t = new AccessKeyedExpression(t, _e(62, 0), e);
    vr(7340051);
    Ke = !r;
    qe = r;
    return t;
}

function Ze(t) {
    qe = true;
    Ke = false;
    or();
    if (0 === (13312 & Fe)) throw Pr();
    if (12288 & Fe) return Je(t, true);
    if (2688007 === Fe) if (10082 === t.$kind) return new CallScopeExpression(t.name, We(), t.ancestor, true); else if (9323 === t.$kind) return new CallMemberExpression(t.object, t.name, We(), t.optional, true); else return new CallFunctionExpression(t, We(), true);
    if (2688016 === Fe) return Ge(t, true);
    throw Tr();
}

function Je(t, e) {
    const r = Ve;
    switch (Fe) {
      case 2162700:
        {
            qe = true;
            Ke = false;
            const s = je;
            const i = Me;
            const n = Fe;
            const o = Ne;
            const c = Ve;
            const u = Ke;
            const h = qe;
            or();
            if (0 === (13312 & Fe)) throw Pr();
            if (2688007 === Fe) return new CallMemberExpression(t, r, We(), e, true);
            je = s;
            Me = i;
            Fe = n;
            Ne = o;
            Ve = c;
            Ke = u;
            qe = h;
            return new AccessMemberExpression(t, r, e);
        }

      case 2688007:
        Ke = false;
        return new CallMemberExpression(t, r, We(), e, false);

      default:
        Ke = !qe;
        or();
        return new AccessMemberExpression(t, r, e);
    }
}

var Xe;

(function(t) {
    t[t["Valid"] = 1] = "Valid";
    t[t["Invalid"] = 2] = "Invalid";
    t[t["Default"] = 3] = "Default";
    t[t["Destructuring"] = 4] = "Destructuring";
})(Xe || (Xe = {}));

function Ye(t) {
    or();
    const e = je;
    const r = Me;
    const s = Fe;
    const i = Ne;
    const n = Ve;
    const o = Ke;
    const c = qe;
    const u = [];
    let h = 1;
    let a = false;
    t: while (true) {
        if (11 === Fe) {
            or();
            if (4096 !== Fe) throw gr();
            u.push(new BindingIdentifier(Ve));
            or();
            if (6291471 === Fe) throw Mr();
            if (7340046 !== Fe) throw wr();
            or();
            if (49 !== Fe) throw wr();
            or();
            const t = qe;
            const e = De;
            ++De;
            const r = _e(62, 0);
            qe = t;
            De = e;
            Ke = false;
            return new ArrowFunction(u, r, true);
        }
        switch (Fe) {
          case 4096:
            u.push(new BindingIdentifier(Ve));
            or();
            break;

          case 7340046:
            or();
            break t;

          case 524296:
          case 2688016:
            or();
            h = 4;
            break;

          case 6291471:
            h = 2;
            a = true;
            break t;

          case 2688007:
            h = 2;
            break t;

          default:
            or();
            h = 2;
            break;
        }
        switch (Fe) {
          case 6291471:
            or();
            a = true;
            if (1 === h) break;
            break t;

          case 7340046:
            or();
            break t;

          case 4194348:
            if (1 === h) h = 3;
            break t;

          case 49:
            if (a) throw jr();
            or();
            h = 2;
            break t;

          default:
            if (1 === h) h = 2;
            break t;
        }
    }
    if (49 === Fe) {
        if (1 === h) {
            or();
            if (524296 === Fe) throw Fr();
            const t = qe;
            const e = De;
            ++De;
            const r = _e(62, 0);
            qe = t;
            De = e;
            Ke = false;
            return new ArrowFunction(u, r);
        }
        throw jr();
    } else if (1 === h && 0 === u.length) throw Br(49);
    if (a) switch (h) {
      case 2:
        throw jr();

      case 3:
        throw Ir();

      case 4:
        throw Dr();
    }
    je = e;
    Me = r;
    Fe = s;
    Ne = i;
    Ve = n;
    Ke = o;
    qe = c;
    const l = qe;
    const f = _e(62, t);
    qe = l;
    vr(7340046);
    if (49 === Fe) switch (h) {
      case 2:
        throw jr();

      case 3:
        throw Ir();

      case 4:
        throw Dr();
    }
    return f;
}

function tr(t) {
    const e = qe;
    or();
    const r = new Array;
    while (7340051 !== Fe) if (dr(6291471)) {
        r.push(Be);
        if (7340051 === Fe) break;
    } else {
        r.push(_e(62, ~2 & t));
        if (dr(6291471)) {
            if (7340051 === Fe) break;
        } else break;
    }
    qe = e;
    vr(7340051);
    if (2 & t) return new ArrayBindingPattern(r); else {
        Ke = false;
        return new ArrayLiteralExpression(r);
    }
}

function er(t) {
    if (0 === (65536 & t.$kind)) throw Or();
    if (4204592 !== Fe) throw Or();
    or();
    const e = t;
    const r = _e(61, 0);
    return new ForOfStatement(e, r);
}

function rr(t) {
    const e = qe;
    const r = new Array;
    const s = new Array;
    or();
    while (7340045 !== Fe) {
        r.push(Ve);
        if (49152 & Fe) {
            or();
            vr(6291476);
            s.push(_e(62, ~2 & t));
        } else if (12288 & Fe) {
            const e = Ne;
            const r = Fe;
            const i = je;
            or();
            if (dr(6291476)) s.push(_e(62, ~2 & t)); else {
                Ne = e;
                Fe = r;
                je = i;
                s.push(_e(515, ~2 & t));
            }
        } else throw kr();
        if (7340045 !== Fe) vr(6291471);
    }
    qe = e;
    vr(7340045);
    if (2 & t) return new ObjectBindingPattern(r, s); else {
        Ke = false;
        return new ObjectLiteralExpression(r, s);
    }
}

function sr() {
    const t = [];
    const e = [];
    const r = Ie;
    let s = "";
    while (je < r) {
        switch (Ne) {
          case 36:
            if (123 === Te.charCodeAt(je + 1)) {
                t.push(s);
                s = "";
                je += 2;
                Ne = Te.charCodeAt(je);
                or();
                const r = _e(61, 1);
                e.push(r);
                continue;
            } else s += "$";
            break;

          case 92:
            s += String.fromCharCode(Ue(cr()));
            break;

          default:
            s += String.fromCharCode(Ne);
        }
        cr();
    }
    if (e.length) {
        t.push(s);
        return new Interpolation(t, e);
    }
    return null;
}

function ir(t, e, r) {
    const s = qe;
    const i = [ Ve ];
    vr(2163759);
    const n = [ _e(62, t) ];
    while (2163758 !== (Fe = fr())) {
        i.push(Ve);
        vr(2163759);
        n.push(_e(62, t));
    }
    i.push(Ve);
    Ke = false;
    qe = s;
    if (r) {
        or();
        return new TaggedTemplateExpression(i, i, e, n);
    } else {
        or();
        return new TemplateExpression(i, n);
    }
}

function nr(t) {
    Ke = false;
    const e = [ Ve ];
    or();
    return new TaggedTemplateExpression(e, e, t);
}

function or() {
    while (je < Ie) {
        Me = je;
        if (null != (Fe = Wr[Ne]())) return;
    }
    Fe = 6291456;
}

function cr() {
    return Ne = Te.charCodeAt(++je);
}

function ur() {
    while (zr[cr()]) ;
    const t = Kr[Ve = He()];
    return void 0 === t ? 4096 : t;
}

function hr(t) {
    let e = Ne;
    if (false === t) {
        do {
            e = cr();
        } while (e <= 57 && e >= 48);
        if (46 !== e) {
            Ve = parseInt(He(), 10);
            return 32768;
        }
        e = cr();
        if (je >= Ie) {
            Ve = parseInt(He().slice(0, -1), 10);
            return 32768;
        }
    }
    if (e <= 57 && e >= 48) do {
        e = cr();
    } while (e <= 57 && e >= 48); else Ne = Te.charCodeAt(--je);
    Ve = parseFloat(He());
    return 32768;
}

function ar() {
    const t = Ne;
    cr();
    let e = 0;
    const r = new Array;
    let s = je;
    while (Ne !== t) if (92 === Ne) {
        r.push(Te.slice(s, je));
        cr();
        e = Ue(Ne);
        cr();
        r.push(String.fromCharCode(e));
        s = je;
    } else if (je >= Ie) throw Cr(); else cr();
    const i = Te.slice(s, je);
    cr();
    r.push(i);
    const n = r.join("");
    Ve = n;
    return 16384;
}

function lr() {
    let t = true;
    let e = "";
    while (96 !== cr()) if (36 === Ne) if (je + 1 < Ie && 123 === Te.charCodeAt(je + 1)) {
        je++;
        t = false;
        break;
    } else e += "$"; else if (92 === Ne) e += String.fromCharCode(Ue(cr())); else {
        if (je >= Ie) throw $r();
        e += String.fromCharCode(Ne);
    }
    cr();
    Ve = e;
    if (t) return 2163758;
    return 2163759;
}

function fr() {
    if (je >= Ie) throw $r();
    je--;
    return lr();
}

function dr(t) {
    if (Fe === t) {
        or();
        return true;
    }
    return false;
}

function vr(t) {
    if (Fe === t) or(); else throw Br(t);
}

function pr() {
    return new Error(`AUR0151:${Te}`);
}

function wr() {
    return new Error(`AUR0152:${Te}`);
}

function gr() {
    return new Error(`AUR0153:${Te}`);
}

function br() {
    return new Error(`AUR0154:${Te}`);
}

function Er() {
    return new Error(`AUR0155:${Te}`);
}

function Ar() {
    return new Error(`AUR0156:${Te}`);
}

function mr() {
    return new Error(`AUR0157`);
}

function yr() {
    return new Error(`AUR0158:${Te}`);
}

function xr() {
    return new Error(`AUR0159:${Te}`);
}

function Ur() {
    return new Error(`AUR0160:${Te}`);
}

function Sr() {
    return new Error(`AUR0161:${Te}`);
}

function Or() {
    return new Error(`AUR0163:${Te}`);
}

function kr() {
    return new Error(`AUR0164:${Te}`);
}

function Cr() {
    return new Error(`AUR0165:${Te}`);
}

function $r() {
    return new Error(`AUR0166:${Te}`);
}

function Br(t) {
    return new Error(`AUR0167:${Te}<${Nr[63 & t]}`);
}

const Lr = () => {
    throw new Error(`AUR0168:${Te}`);
};

Lr.notMapped = true;

function Rr() {
    return new Error(`AUR0170:${Te}`);
}

function Pr() {
    return new Error(`AUR0171:${Te}`);
}

function Tr() {
    return new Error(`AUR0172:${Te}`);
}

function jr() {
    return new Error(`AUR0173:${Te}`);
}

function Ir() {
    return new Error(`AUR0174:${Te}`);
}

function Dr() {
    return new Error(`AUR0175:${Te}`);
}

function Mr() {
    return new Error(`AUR0176:${Te}`);
}

function Fr() {
    return new Error(`AUR0178:${Te}`);
}

function Vr() {
    return new Error(`AUR0179:${Te}`);
}

const Nr = [ ke, Ce, $e, Be, "$this", null, "$parent", "(", "{", ".", "..", "...", "?.", "}", ")", ",", "[", "]", ":", "?", "'", '"', "&", "|", "??", "||", "&&", "==", "!=", "===", "!==", "<", ">", "<=", ">=", "in", "instanceof", "+", "-", "typeof", "void", "*", "%", "/", "=", "!", 2163758, 2163759, "of", "=>" ];

const Kr = Object.assign(Object.create(null), {
    true: 8193,
    null: 8194,
    false: 8192,
    undefined: 8195,
    $this: 12292,
    $parent: 12294,
    in: 6562211,
    instanceof: 6562212,
    typeof: 139303,
    void: 139304,
    of: 4204592
});

const qr = {
    AsciiIdPart: [ 36, 0, 48, 58, 65, 91, 95, 0, 97, 123 ],
    IdStart: [ 36, 0, 65, 91, 95, 0, 97, 123, 170, 0, 186, 0, 192, 215, 216, 247, 248, 697, 736, 741, 7424, 7462, 7468, 7517, 7522, 7526, 7531, 7544, 7545, 7615, 7680, 7936, 8305, 0, 8319, 0, 8336, 8349, 8490, 8492, 8498, 0, 8526, 0, 8544, 8585, 11360, 11392, 42786, 42888, 42891, 42927, 42928, 42936, 42999, 43008, 43824, 43867, 43868, 43877, 64256, 64263, 65313, 65339, 65345, 65371 ],
    Digit: [ 48, 58 ],
    Skip: [ 0, 33, 127, 161 ]
};

function Hr(t, e, r, s) {
    const i = r.length;
    for (let n = 0; n < i; n += 2) {
        const i = r[n];
        let o = r[n + 1];
        o = o > 0 ? o : i + 1;
        if (t) t.fill(s, i, o);
        if (e) for (let t = i; t < o; t++) e.add(t);
    }
}

function Qr(t) {
    return () => {
        cr();
        return t;
    };
}

const _r = new Set;

Hr(null, _r, qr.AsciiIdPart, true);

const zr = new Uint8Array(65535);

Hr(zr, null, qr.IdStart, 1);

Hr(zr, null, qr.Digit, 1);

const Wr = new Array(65535);

Wr.fill(Lr, 0, 65535);

Hr(Wr, null, qr.Skip, (() => {
    cr();
    return null;
}));

Hr(Wr, null, qr.IdStart, ur);

Hr(Wr, null, qr.Digit, (() => hr(false)));

Wr[34] = Wr[39] = () => ar();

Wr[96] = () => lr();

Wr[33] = () => {
    if (61 !== cr()) return 131117;
    if (61 !== cr()) return 6553948;
    cr();
    return 6553950;
};

Wr[61] = () => {
    if (62 === cr()) {
        cr();
        return 49;
    }
    if (61 !== Ne) return 4194348;
    if (61 !== cr()) return 6553947;
    cr();
    return 6553949;
};

Wr[38] = () => {
    if (38 !== cr()) return 6291478;
    cr();
    return 6553882;
};

Wr[124] = () => {
    if (124 !== cr()) return 6291479;
    cr();
    return 6553817;
};

Wr[63] = () => {
    if (46 === cr()) {
        const t = Te.charCodeAt(je + 1);
        if (t <= 48 || t >= 57) {
            cr();
            return 2162700;
        }
        return 6291477;
    }
    if (63 !== Ne) return 6291477;
    cr();
    return 6553752;
};

Wr[46] = () => {
    if (cr() <= 57 && Ne >= 48) return hr(true);
    if (46 === Ne) {
        if (46 !== cr()) return 10;
        cr();
        return 11;
    }
    return 65545;
};

Wr[60] = () => {
    if (61 !== cr()) return 6554015;
    cr();
    return 6554017;
};

Wr[62] = () => {
    if (61 !== cr()) return 6554016;
    cr();
    return 6554018;
};

Wr[37] = Qr(6554154);

Wr[40] = Qr(2688007);

Wr[41] = Qr(7340046);

Wr[42] = Qr(6554153);

Wr[43] = Qr(2490853);

Wr[44] = Qr(6291471);

Wr[45] = Qr(2490854);

Wr[47] = Qr(6554155);

Wr[58] = Qr(6291476);

Wr[91] = Qr(2688016);

Wr[93] = Qr(7340051);

Wr[123] = Qr(524296);

Wr[125] = Qr(7340045);

let Gr = null;

const Zr = [];

let Jr = false;

function Xr() {
    Jr = false;
}

function Yr() {
    Jr = true;
}

function ts() {
    return Gr;
}

function es(t) {
    if (null == t) throw new Error(`AUR0206`);
    if (null == Gr) {
        Gr = t;
        Zr[0] = Gr;
        Jr = true;
        return;
    }
    if (Gr === t) throw new Error(`AUR0207`);
    Zr.push(t);
    Gr = t;
    Jr = true;
}

function rs(t) {
    if (null == t) throw new Error(`AUR0208`);
    if (Gr !== t) throw new Error(`AUR0209`);
    Zr.pop();
    Gr = Zr.length > 0 ? Zr[Zr.length - 1] : null;
    Jr = null != Gr;
}

const ss = Object.freeze({
    get current() {
        return Gr;
    },
    get connecting() {
        return Jr;
    },
    enter: es,
    exit: rs,
    pause: Xr,
    resume: Yr
});

const is = Reflect.get;

const ns = Object.prototype.toString;

const os = new WeakMap;

function cs(t) {
    switch (ns.call(t)) {
      case "[object Object]":
      case "[object Array]":
      case "[object Map]":
      case "[object Set]":
        return true;

      default:
        return false;
    }
}

const us = "__raw__";

function hs(t) {
    return cs(t) ? as(t) : t;
}

function as(t) {
    var e;
    return null !== (e = os.get(t)) && void 0 !== e ? e : vs(t);
}

function ls(t) {
    var e;
    return null !== (e = t[us]) && void 0 !== e ? e : t;
}

function fs(t) {
    return cs(t) && t[us] || t;
}

function ds(t) {
    return "constructor" === t || "__proto__" === t || "$observers" === t || t === Symbol.toPrimitive || t === Symbol.toStringTag;
}

function vs(t) {
    const e = g(t) ? ws : t instanceof Map || t instanceof Set ? Fs : ps;
    const r = new Proxy(t, e);
    os.set(t, r);
    return r;
}

const ps = {
    get(t, e, r) {
        if (e === us) return t;
        const s = ts();
        if (!Jr || ds(e) || null == s) return is(t, e, r);
        s.observe(t, e);
        return hs(is(t, e, r));
    }
};

const ws = {
    get(t, e, r) {
        if (e === us) return t;
        const s = ts();
        if (!Jr || ds(e) || null == s) return is(t, e, r);
        switch (e) {
          case "length":
            s.observe(t, "length");
            return t.length;

          case "map":
            return gs;

          case "includes":
            return As;

          case "indexOf":
            return ms;

          case "lastIndexOf":
            return ys;

          case "every":
            return bs;

          case "filter":
            return Es;

          case "find":
            return Us;

          case "findIndex":
            return xs;

          case "flat":
            return Ss;

          case "flatMap":
            return Os;

          case "join":
            return ks;

          case "push":
            return $s;

          case "pop":
            return Cs;

          case "reduce":
            return Ds;

          case "reduceRight":
            return Ms;

          case "reverse":
            return Ps;

          case "shift":
            return Bs;

          case "unshift":
            return Ls;

          case "slice":
            return Is;

          case "splice":
            return Rs;

          case "some":
            return Ts;

          case "sort":
            return js;

          case "keys":
            return zs;

          case "values":
          case Symbol.iterator:
            return Ws;

          case "entries":
            return Gs;
        }
        s.observe(t, e);
        return hs(is(t, e, r));
    },
    ownKeys(t) {
        var e;
        null === (e = ts()) || void 0 === e ? void 0 : e.observe(t, "length");
        return Reflect.ownKeys(t);
    }
};

function gs(t, e) {
    var r;
    const s = ls(this);
    const i = s.map(((r, s) => fs(t.call(e, hs(r), s, this))));
    null === (r = ts()) || void 0 === r ? void 0 : r.observeCollection(s);
    return hs(i);
}

function bs(t, e) {
    var r;
    const s = ls(this);
    const i = s.every(((r, s) => t.call(e, hs(r), s, this)));
    null === (r = ts()) || void 0 === r ? void 0 : r.observeCollection(s);
    return i;
}

function Es(t, e) {
    var r;
    const s = ls(this);
    const i = s.filter(((r, s) => fs(t.call(e, hs(r), s, this))));
    null === (r = ts()) || void 0 === r ? void 0 : r.observeCollection(s);
    return hs(i);
}

function As(t) {
    var e;
    const r = ls(this);
    const s = r.includes(fs(t));
    null === (e = ts()) || void 0 === e ? void 0 : e.observeCollection(r);
    return s;
}

function ms(t) {
    var e;
    const r = ls(this);
    const s = r.indexOf(fs(t));
    null === (e = ts()) || void 0 === e ? void 0 : e.observeCollection(r);
    return s;
}

function ys(t) {
    var e;
    const r = ls(this);
    const s = r.lastIndexOf(fs(t));
    null === (e = ts()) || void 0 === e ? void 0 : e.observeCollection(r);
    return s;
}

function xs(t, e) {
    var r;
    const s = ls(this);
    const i = s.findIndex(((r, s) => fs(t.call(e, hs(r), s, this))));
    null === (r = ts()) || void 0 === r ? void 0 : r.observeCollection(s);
    return i;
}

function Us(t, e) {
    var r;
    const s = ls(this);
    const i = s.find(((e, r) => t(hs(e), r, this)), e);
    null === (r = ts()) || void 0 === r ? void 0 : r.observeCollection(s);
    return hs(i);
}

function Ss() {
    var t;
    const e = ls(this);
    null === (t = ts()) || void 0 === t ? void 0 : t.observeCollection(e);
    return hs(e.flat());
}

function Os(t, e) {
    var r;
    const s = ls(this);
    null === (r = ts()) || void 0 === r ? void 0 : r.observeCollection(s);
    return as(s.flatMap(((r, s) => hs(t.call(e, hs(r), s, this)))));
}

function ks(t) {
    var e;
    const r = ls(this);
    null === (e = ts()) || void 0 === e ? void 0 : e.observeCollection(r);
    return r.join(t);
}

function Cs() {
    return hs(ls(this).pop());
}

function $s(...t) {
    return ls(this).push(...t);
}

function Bs() {
    return hs(ls(this).shift());
}

function Ls(...t) {
    return ls(this).unshift(...t);
}

function Rs(...t) {
    return hs(ls(this).splice(...t));
}

function Ps(...t) {
    var e;
    const r = ls(this);
    const s = r.reverse();
    null === (e = ts()) || void 0 === e ? void 0 : e.observeCollection(r);
    return hs(s);
}

function Ts(t, e) {
    var r;
    const s = ls(this);
    const i = s.some(((r, s) => fs(t.call(e, hs(r), s, this))));
    null === (r = ts()) || void 0 === r ? void 0 : r.observeCollection(s);
    return i;
}

function js(t) {
    var e;
    const r = ls(this);
    const s = r.sort(t);
    null === (e = ts()) || void 0 === e ? void 0 : e.observeCollection(r);
    return hs(s);
}

function Is(t, e) {
    var r;
    const s = ls(this);
    null === (r = ts()) || void 0 === r ? void 0 : r.observeCollection(s);
    return as(s.slice(t, e));
}

function Ds(t, e) {
    var r;
    const s = ls(this);
    const i = s.reduce(((e, r, s) => t(e, hs(r), s, this)), e);
    null === (r = ts()) || void 0 === r ? void 0 : r.observeCollection(s);
    return hs(i);
}

function Ms(t, e) {
    var r;
    const s = ls(this);
    const i = s.reduceRight(((e, r, s) => t(e, hs(r), s, this)), e);
    null === (r = ts()) || void 0 === r ? void 0 : r.observeCollection(s);
    return hs(i);
}

const Fs = {
    get(t, e, r) {
        if (e === us) return t;
        const s = ts();
        if (!Jr || ds(e) || null == s) return is(t, e, r);
        switch (e) {
          case "size":
            s.observe(t, "size");
            return t.size;

          case "clear":
            return Qs;

          case "delete":
            return _s;

          case "forEach":
            return Vs;

          case "add":
            if (t instanceof Set) return Hs;
            break;

          case "get":
            if (t instanceof Map) return Ks;
            break;

          case "set":
            if (t instanceof Map) return qs;
            break;

          case "has":
            return Ns;

          case "keys":
            return zs;

          case "values":
            return Ws;

          case "entries":
            return Gs;

          case Symbol.iterator:
            return t instanceof Map ? Gs : Ws;
        }
        return hs(is(t, e, r));
    }
};

function Vs(t, e) {
    var r;
    const s = ls(this);
    null === (r = ts()) || void 0 === r ? void 0 : r.observeCollection(s);
    return s.forEach(((r, s) => {
        t.call(e, hs(r), hs(s), this);
    }));
}

function Ns(t) {
    var e;
    const r = ls(this);
    null === (e = ts()) || void 0 === e ? void 0 : e.observeCollection(r);
    return r.has(fs(t));
}

function Ks(t) {
    var e;
    const r = ls(this);
    null === (e = ts()) || void 0 === e ? void 0 : e.observeCollection(r);
    return hs(r.get(fs(t)));
}

function qs(t, e) {
    return hs(ls(this).set(fs(t), fs(e)));
}

function Hs(t) {
    return hs(ls(this).add(fs(t)));
}

function Qs() {
    return hs(ls(this).clear());
}

function _s(t) {
    return hs(ls(this).delete(fs(t)));
}

function zs() {
    var t;
    const e = ls(this);
    null === (t = ts()) || void 0 === t ? void 0 : t.observeCollection(e);
    const r = e.keys();
    return {
        next() {
            const t = r.next();
            const e = t.value;
            const s = t.done;
            return s ? {
                value: void 0,
                done: s
            } : {
                value: hs(e),
                done: s
            };
        },
        [Symbol.iterator]() {
            return this;
        }
    };
}

function Ws() {
    var t;
    const e = ls(this);
    null === (t = ts()) || void 0 === t ? void 0 : t.observeCollection(e);
    const r = e.values();
    return {
        next() {
            const t = r.next();
            const e = t.value;
            const s = t.done;
            return s ? {
                value: void 0,
                done: s
            } : {
                value: hs(e),
                done: s
            };
        },
        [Symbol.iterator]() {
            return this;
        }
    };
}

function Gs() {
    var t;
    const e = ls(this);
    null === (t = ts()) || void 0 === t ? void 0 : t.observeCollection(e);
    const r = e.entries();
    return {
        next() {
            const t = r.next();
            const e = t.value;
            const s = t.done;
            return s ? {
                value: void 0,
                done: s
            } : {
                value: [ hs(e[0]), hs(e[1]) ],
                done: s
            };
        },
        [Symbol.iterator]() {
            return this;
        }
    };
}

const Zs = Object.freeze({
    getProxy: as,
    getRaw: ls,
    wrap: hs,
    unwrap: fs,
    rawKey: us
});

class ComputedObserver {
    constructor(t, e, r, s, i) {
        this.interceptor = this;
        this.type = 1;
        this.v = void 0;
        this.ov = void 0;
        this.ir = false;
        this.D = false;
        this.o = t;
        this.get = e;
        this.set = r;
        this.up = s;
        this.oL = i;
    }
    static create(t, e, r, s, i) {
        const n = r.get;
        const o = r.set;
        const c = new ComputedObserver(t, n, o, i, s);
        const u = () => c.getValue();
        u.getObserver = () => c;
        v(t, e, {
            enumerable: r.enumerable,
            configurable: true,
            get: u,
            set: t => {
                c.setValue(t, 0);
            }
        });
        return c;
    }
    getValue() {
        if (0 === this.subs.count) return this.get.call(this.o, this);
        if (this.D) {
            this.compute();
            this.D = false;
        }
        return this.v;
    }
    setValue(t, e) {
        if (p(this.set)) {
            if (t !== this.v) {
                this.ir = true;
                this.set.call(this.o, t);
                this.ir = false;
                this.run();
            }
        } else throw new Error(`AUR0221`);
    }
    handleChange() {
        this.D = true;
        if (this.subs.count > 0) this.run();
    }
    handleCollectionChange() {
        this.D = true;
        if (this.subs.count > 0) this.run();
    }
    subscribe(t) {
        if (this.subs.add(t) && 1 === this.subs.count) {
            this.compute();
            this.D = false;
        }
    }
    unsubscribe(t) {
        if (this.subs.remove(t) && 0 === this.subs.count) {
            this.D = true;
            this.obs.clearAll();
        }
    }
    flush() {
        Js = this.ov;
        this.ov = this.v;
        this.subs.notify(this.v, Js, 0);
    }
    run() {
        if (this.ir) return;
        const t = this.v;
        const e = this.compute();
        this.D = false;
        if (!Object.is(e, t)) {
            this.ov = t;
            this.queue.add(this);
        }
    }
    compute() {
        this.ir = true;
        this.obs.version++;
        try {
            es(this);
            return this.v = fs(this.get.call(this.up ? hs(this.o) : this.o, this));
        } finally {
            this.obs.clear();
            this.ir = false;
            rs(this);
        }
    }
}

me(ComputedObserver);

nt(ComputedObserver);

at(ComputedObserver);

let Js;

const Xs = r.createInterface("IDirtyChecker", (t => t.singleton(DirtyChecker)));

const Ys = {
    timeoutsPerCheck: 25,
    disabled: false,
    throw: false,
    resetToDefault() {
        this.timeoutsPerCheck = 6;
        this.disabled = false;
        this.throw = false;
    }
};

const ti = {
    persistent: true
};

class DirtyChecker {
    constructor(t) {
        this.p = t;
        this.tracked = [];
        this.O = null;
        this.C = 0;
        this.check = () => {
            if (Ys.disabled) return;
            if (++this.C < Ys.timeoutsPerCheck) return;
            this.C = 0;
            const t = this.tracked;
            const e = t.length;
            let r;
            let s = 0;
            for (;s < e; ++s) {
                r = t[s];
                if (r.isDirty()) this.queue.add(r);
            }
        };
    }
    createProperty(t, e) {
        if (Ys.throw) throw new Error(`AUR0222:${e}`);
        return new DirtyCheckProperty(this, t, e);
    }
    addProperty(t) {
        this.tracked.push(t);
        if (1 === this.tracked.length) this.O = this.p.taskQueue.queueTask(this.check, ti);
    }
    removeProperty(t) {
        this.tracked.splice(this.tracked.indexOf(t), 1);
        if (0 === this.tracked.length) {
            this.O.cancel();
            this.O = null;
        }
    }
}

DirtyChecker.inject = [ a ];

at(DirtyChecker);

class DirtyCheckProperty {
    constructor(t, e, r) {
        this.obj = e;
        this.key = r;
        this.type = 0;
        this.ov = void 0;
        this.$ = t;
    }
    getValue() {
        return this.obj[this.key];
    }
    setValue(t, e) {
        throw new Error(`Trying to set value for property ${this.key} in dirty checker`);
    }
    isDirty() {
        return this.ov !== this.obj[this.key];
    }
    flush() {
        const t = this.ov;
        const e = this.getValue();
        this.ov = e;
        this.subs.notify(e, t, 0);
    }
    subscribe(t) {
        if (this.subs.add(t) && 1 === this.subs.count) {
            this.ov = this.obj[this.key];
            this.$.addProperty(this);
        }
    }
    unsubscribe(t) {
        if (this.subs.remove(t) && 0 === this.subs.count) this.$.removeProperty(this);
    }
}

nt(DirtyCheckProperty);

class PrimitiveObserver {
    constructor(t, e) {
        this.type = 0;
        this.o = t;
        this.k = e;
    }
    get doNotCache() {
        return true;
    }
    getValue() {
        return this.o[this.k];
    }
    setValue() {}
    subscribe() {}
    unsubscribe() {}
}

class PropertyAccessor {
    constructor() {
        this.type = 0;
    }
    getValue(t, e) {
        return t[e];
    }
    setValue(t, e, r, s) {
        r[s] = t;
    }
}

let ei;

class SetterObserver {
    constructor(t, e) {
        this.type = 1;
        this.v = void 0;
        this.ov = void 0;
        this.iO = false;
        this.f = 0;
        this.o = t;
        this.k = e;
    }
    getValue() {
        return this.v;
    }
    setValue(t, e) {
        if (this.iO) {
            if (Object.is(t, this.v)) return;
            this.ov = this.v;
            this.v = t;
            this.f = e;
            this.queue.add(this);
        } else this.o[this.k] = t;
    }
    subscribe(t) {
        if (false === this.iO) this.start();
        this.subs.add(t);
    }
    flush() {
        ei = this.ov;
        this.ov = this.v;
        this.subs.notify(this.v, ei, this.f);
    }
    start() {
        if (false === this.iO) {
            this.iO = true;
            this.v = this.o[this.k];
            v(this.o, this.k, {
                enumerable: true,
                configurable: true,
                get: () => this.getValue(),
                set: t => {
                    this.setValue(t, 0);
                }
            });
        }
        return this;
    }
    stop() {
        if (this.iO) {
            v(this.o, this.k, {
                enumerable: true,
                configurable: true,
                writable: true,
                value: this.v
            });
            this.iO = false;
        }
        return this;
    }
}

class SetterNotifier {
    constructor(t, e, r, s) {
        this.type = 1;
        this.v = void 0;
        this.ov = void 0;
        this.f = 0;
        this.o = t;
        this.S = r;
        this.hs = p(r);
        const i = t[e];
        this.cb = p(i) ? i : void 0;
        this.v = s;
    }
    getValue() {
        return this.v;
    }
    setValue(t, e) {
        var r;
        if (this.hs) t = this.S(t, null);
        if (!Object.is(t, this.v)) {
            this.ov = this.v;
            this.v = t;
            this.f = e;
            null === (r = this.cb) || void 0 === r ? void 0 : r.call(this.o, this.v, this.ov, e);
            this.queue.add(this);
        }
    }
    flush() {
        ei = this.ov;
        this.ov = this.v;
        this.subs.notify(this.v, ei, this.f);
    }
}

nt(SetterObserver);

nt(SetterNotifier);

at(SetterObserver);

at(SetterNotifier);

const ri = new PropertyAccessor;

const si = r.createInterface("IObserverLocator", (t => t.singleton(ObserverLocator)));

const ii = r.createInterface("INodeObserverLocator", (t => t.cachedCallback((t => {
    t.getAll(l).forEach((t => {
        t.error("Using default INodeObserverLocator implementation. Will not be able to observe nodes (HTML etc...).");
    }));
    return new DefaultNodeObserverLocator;
}))));

class DefaultNodeObserverLocator {
    handles() {
        return false;
    }
    getObserver() {
        return ri;
    }
    getAccessor() {
        return ri;
    }
}

class ObserverLocator {
    constructor(t, e) {
        this.$ = t;
        this.B = e;
        this.L = [];
    }
    addAdapter(t) {
        this.L.push(t);
    }
    getObserver(t, e) {
        var r, s;
        return null !== (s = null === (r = t.$observers) || void 0 === r ? void 0 : r[e]) && void 0 !== s ? s : this.R(t, e, this.createObserver(t, e));
    }
    getAccessor(t, e) {
        var r;
        const s = null === (r = t.$observers) || void 0 === r ? void 0 : r[e];
        if (void 0 !== s) return s;
        if (this.B.handles(t, e, this)) return this.B.getAccessor(t, e, this);
        return ri;
    }
    getArrayObserver(t) {
        return Dt(t);
    }
    getMapObserver(t) {
        return le(t);
    }
    getSetObserver(t) {
        return Xt(t);
    }
    createObserver(t, e) {
        var r, s, i, n;
        if (!(t instanceof Object)) return new PrimitiveObserver(t, e);
        if (this.B.handles(t, e, this)) return this.B.getObserver(t, e, this);
        switch (e) {
          case "length":
            if (g(t)) return Dt(t).getLengthObserver();
            break;

          case "size":
            if (t instanceof Map) return le(t).getLengthObserver(); else if (t instanceof Set) return Xt(t).getLengthObserver();
            break;

          default:
            if (g(t) && h(e)) return Dt(t).getIndexObserver(Number(e));
            break;
        }
        let o = ci(t, e);
        if (void 0 === o) {
            let r = oi(t);
            while (null !== r) {
                o = ci(r, e);
                if (void 0 === o) r = oi(r); else break;
            }
        }
        if (void 0 !== o && !d.call(o, "value")) {
            let c = this.P(t, e, o);
            if (null == c) c = null === (n = null !== (s = null === (r = o.get) || void 0 === r ? void 0 : r.getObserver) && void 0 !== s ? s : null === (i = o.set) || void 0 === i ? void 0 : i.getObserver) || void 0 === n ? void 0 : n(t, this);
            return null == c ? o.configurable ? ComputedObserver.create(t, e, o, this, true) : this.$.createProperty(t, e) : c;
        }
        return new SetterObserver(t, e);
    }
    P(t, e, r) {
        if (this.L.length > 0) for (const s of this.L) {
            const i = s.getObserver(t, e, r, this);
            if (null != i) return i;
        }
        return null;
    }
    R(t, e, r) {
        if (true === r.doNotCache) return r;
        if (void 0 === t.$observers) {
            v(t, "$observers", {
                value: {
                    [e]: r
                }
            });
            return r;
        }
        return t.$observers[e] = r;
    }
}

ObserverLocator.inject = [ Xs, ii ];

function ni(t) {
    let e;
    if (g(t)) e = Dt(t); else if (t instanceof Map) e = le(t); else if (t instanceof Set) e = Xt(t);
    return e;
}

const oi = Object.getPrototypeOf;

const ci = Object.getOwnPropertyDescriptor;

const ui = r.createInterface("IObservation", (t => t.singleton(Observation)));

class Observation {
    constructor(t) {
        this.oL = t;
    }
    static get inject() {
        return [ si ];
    }
    run(t) {
        const e = new Effect(this.oL, t);
        e.run();
        return e;
    }
}

class Effect {
    constructor(t, e) {
        this.oL = t;
        this.fn = e;
        this.interceptor = this;
        this.maxRunCount = 10;
        this.queued = false;
        this.running = false;
        this.runCount = 0;
        this.stopped = false;
    }
    handleChange() {
        this.queued = true;
        this.run();
    }
    handleCollectionChange() {
        this.queued = true;
        this.run();
    }
    run() {
        if (this.stopped) throw new Error(`AUR0225`);
        if (this.running) return;
        ++this.runCount;
        this.running = true;
        this.queued = false;
        ++this.obs.version;
        try {
            es(this);
            this.fn(this);
        } finally {
            this.obs.clear();
            this.running = false;
            rs(this);
        }
        if (this.queued) {
            if (this.runCount > this.maxRunCount) {
                this.runCount = 0;
                throw new Error(`AUR0226`);
            }
            this.run();
        } else this.runCount = 0;
    }
    stop() {
        this.stopped = true;
        this.obs.clearAll();
    }
}

me(Effect);

function hi(t) {
    if (void 0 === t.$observers) v(t, "$observers", {
        value: {}
    });
    return t.$observers;
}

const ai = {};

function li(t, e, r) {
    if (null == e) return (e, r, i) => s(e, r, i, t);
    return s(t, e, r);
    function s(t, e, r, s) {
        var i;
        const n = void 0 === e;
        s = "object" !== typeof s ? {
            name: s
        } : s || {};
        if (n) e = s.name;
        if (null == e || "" === e) throw new Error(`AUR0224`);
        const o = s.callback || `${String(e)}Changed`;
        let c = ai;
        if (r) {
            delete r.value;
            delete r.writable;
            c = null === (i = r.initializer) || void 0 === i ? void 0 : i.call(r);
            delete r.initializer;
        } else r = {
            configurable: true
        };
        if (!("enumerable" in r)) r.enumerable = true;
        const u = s.set;
        r.get = function t() {
            var r;
            const s = fi(this, e, o, c, u);
            null === (r = ts()) || void 0 === r ? void 0 : r.subscribeTo(s);
            return s.getValue();
        };
        r.set = function t(r) {
            fi(this, e, o, c, u).setValue(r, 0);
        };
        r.get.getObserver = function t(r) {
            return fi(r, e, o, c, u);
        };
        if (n) v(t.prototype, e, r); else return r;
    }
}

function fi(t, e, r, s, i) {
    const n = hi(t);
    let o = n[e];
    if (null == o) {
        o = new SetterNotifier(t, r, i, s === ai ? void 0 : s);
        n[e] = o;
    }
    return o;
}

export { AccessKeyedExpression, AccessMemberExpression, AccessScopeExpression, AccessThisExpression, tt as AccessorType, ArrayBindingPattern, ArrayIndexObserver, ArrayLiteralExpression, ArrayObserver, ArrowFunction, AssignExpression, BinaryExpression, j as BindingBehavior, BindingBehaviorDefinition, BindingBehaviorExpression, BindingBehaviorFactory, B as BindingBehaviorStrategy, BindingContext, BindingIdentifier, BindingInterceptor, BindingMediator, G as BindingMode, BindingObserverRecord, CallFunctionExpression, CallMemberExpression, CallScopeExpression, xe as Char, Y as CollectionKind, CollectionLengthObserver, CollectionSizeObserver, ComputedObserver, ConditionalExpression, ss as ConnectableSwitcher, CustomExpression, X as DelegationStrategy, DestructuringAssignmentExpression, DestructuringAssignmentRestExpression, DestructuringAssignmentSingleExpression, DirtyCheckProperty, Ys as DirtyCheckSettings, V as ExpressionKind, Pe as ExpressionType, FlushQueue, ForOfStatement, HtmlLiteralExpression, W as ICoercionConfiguration, Xs as IDirtyChecker, ye as IExpressionParser, ii as INodeObserverLocator, ui as IObservation, si as IObserverLocator, $ as ISignaler, Interpolation, Z as LifecycleFlags, MapObserver, ObjectBindingPattern, ObjectLiteralExpression, Observation, ObserverLocator, OverrideContext, PrimitiveLiteralExpression, PrimitiveObserver, PropertyAccessor, Zs as ProxyObservable, Scope, SetObserver, SetterObserver, SubscriberRecord, TaggedTemplateExpression, TemplateExpression, UnaryExpression, F as ValueConverter, ValueConverterDefinition, ValueConverterExpression, k as alias, Mt as applyMutationsToIndices, L as bindingBehavior, st as cloneIndexMap, me as connectable, et as copyIndexMap, rt as createIndexMap, It as disableArrayObservation, ae as disableMapObservation, Jt as disableSetObservation, jt as enableArrayObservation, he as enableMapObservation, Zt as enableSetObservation, ni as getCollectionObserver, it as isIndexMap, li as observable, Qe as parseExpression, C as registerAliases, nt as subscriberCollection, Ft as synchronizeIndices, I as valueConverter, at as withFlushQueue };

