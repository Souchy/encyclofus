"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var t = require("@aurelia/kernel");

var e = require("@aurelia/metadata");

const r = Object.prototype.hasOwnProperty;

const s = Reflect.defineProperty;

const i = t => "function" === typeof t;

const n = t => "string" === typeof t;

const o = t => t instanceof Array;

function c(t, e, r) {
    s(t, e, {
        enumerable: false,
        configurable: true,
        writable: true,
        value: r
    });
    return r;
}

function u(t, e, s, i = false) {
    if (i || !r.call(t, e)) c(t, e, s);
}

const h = () => Object.create(null);

const a = e.Metadata.getOwn;

const l = e.Metadata.hasOwn;

const f = e.Metadata.define;

const d = t.Protocol.annotation.keyFor;

const p = t.Protocol.resource.keyFor;

const v = t.Protocol.resource.appendTo;

function w(...t) {
    return function(e) {
        const r = d("aliases");
        const s = a(r, e);
        if (void 0 === s) f(r, t, e); else s.push(...t);
    };
}

function g(e, r, s, i) {
    for (let n = 0, o = e.length; n < o; ++n) t.Registration.aliasTo(s, r.keyFrom(e[n])).register(i);
}

Object.freeze({});

class BindingContext {
    constructor(t, e) {
        if (void 0 !== t) if (void 0 !== e) this[t] = e; else for (const e in t) if (r.call(t, e)) this[e] = t[e];
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

const b = t.DI.createInterface("ISignaler", (t => t.singleton(Signaler)));

class Signaler {
    constructor() {
        this.signals = h();
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

exports.BindingBehaviorStrategy = void 0;

(function(t) {
    t[t["singleton"] = 1] = "singleton";
    t[t["interceptor"] = 2] = "interceptor";
})(exports.BindingBehaviorStrategy || (exports.BindingBehaviorStrategy = {}));

function x(t) {
    return function(e) {
        return y.define(t, e);
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
    static create(e, r) {
        let s;
        let i;
        if (n(e)) {
            s = e;
            i = {
                name: s
            };
        } else {
            s = e.name;
            i = e;
        }
        const o = Object.getPrototypeOf(r) === BindingInterceptor;
        return new BindingBehaviorDefinition(r, t.firstDefined(m(r, "name"), s), t.mergeArrays(m(r, "aliases"), i.aliases, r.aliases), y.keyFrom(s), t.fromAnnotationOrDefinitionOrTypeOrDefault("strategy", i, r, (() => o ? 2 : 1)));
    }
    register(e) {
        const {Type: r, key: s, aliases: i, strategy: n} = this;
        switch (n) {
          case 1:
            t.Registration.singleton(s, r).register(e);
            break;

          case 2:
            t.Registration.instance(s, new BindingBehaviorFactory(e, r)).register(e);
            break;
        }
        t.Registration.aliasTo(s, r).register(e);
        g(i, y, s, e);
    }
}

class BindingBehaviorFactory {
    constructor(e, r) {
        this.ctn = e;
        this.Type = r;
        this.deps = t.DI.getDependencies(r);
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

const E = [ "isBound", "$scope", "obs", "sourceExpression", "locator", "oL" ];

E.forEach((t => {
    s(BindingInterceptor.prototype, t, {
        enumerable: false,
        configurable: true,
        get: function() {
            return this.binding[t];
        }
    });
}));

const A = p("binding-behavior");

const m = (t, e) => a(d(e), t);

const y = Object.freeze({
    name: A,
    keyFrom(t) {
        return `${A}:${t}`;
    },
    isType(t) {
        return i(t) && l(A, t);
    },
    define(t, e) {
        const r = BindingBehaviorDefinition.create(t, e);
        f(A, r, r.Type);
        f(A, r, r);
        v(e, A);
        return r.Type;
    },
    getDefinition(t) {
        const e = a(A, t);
        if (void 0 === e) throw new Error(`AUR0151:${t.name}`);
        return e;
    },
    annotate(t, e, r) {
        f(d(e), r, t);
    },
    getAnnotation: m
});

function U(t) {
    return function(e) {
        return k.define(t, e);
    };
}

class ValueConverterDefinition {
    constructor(t, e, r, s) {
        this.Type = t;
        this.name = e;
        this.aliases = r;
        this.key = s;
    }
    static create(e, r) {
        let s;
        let i;
        if (n(e)) {
            s = e;
            i = {
                name: s
            };
        } else {
            s = e.name;
            i = e;
        }
        return new ValueConverterDefinition(r, t.firstDefined(O(r, "name"), s), t.mergeArrays(O(r, "aliases"), i.aliases, r.aliases), k.keyFrom(s));
    }
    register(e) {
        const {Type: r, key: s, aliases: i} = this;
        t.Registration.singleton(s, r).register(e);
        t.Registration.aliasTo(s, r).register(e);
        g(i, k, s, e);
    }
}

const S = p("value-converter");

const O = (t, e) => a(d(e), t);

const k = Object.freeze({
    name: S,
    keyFrom: t => `${S}:${t}`,
    isType(t) {
        return i(t) && l(S, t);
    },
    define(t, e) {
        const r = ValueConverterDefinition.create(t, e);
        f(S, r, r.Type);
        f(S, r, r);
        v(e, S);
        return r.Type;
    },
    getDefinition(t) {
        const e = a(S, t);
        if (void 0 === e) throw new Error(`AUR0152:${t.name}`);
        return e;
    },
    annotate(t, e, r) {
        f(d(e), r, t);
    },
    getAnnotation: O
});

exports.ExpressionKind = void 0;

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
})(exports.ExpressionKind || (exports.ExpressionKind = {}));

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
        if (n(t.value)) {
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
        this.behaviorKey = y.keyFrom(e);
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
        const n = r;
        if (void 0 !== n[s]) {
            if (i(n[s].unbind)) n[s].unbind(t, e, r);
            n[s] = void 0;
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
        this.converterKey = k.keyFrom(e);
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
                const e = r.get(b);
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
        const i = r.locator.get(b);
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
        const o = B(t, n, this.name);
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

const C = "at map filter includes indexOf lastIndexOf findIndex find flat flatMap join reduce reduceRight slice every some sort".split(" ");

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
        const c = B(t, i, this.name);
        if (c) {
            if (o(i) && C.includes(this.name)) null === s || void 0 === s ? void 0 : s.observeCollection(i);
            return c.apply(i, n);
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
        const n = this.func.evaluate(t, e, r, s);
        if (i(n)) return n(...this.args.map((i => i.evaluate(t, e, r, s))));
        if (!(8 & t) && null == n) return;
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
    evaluate(e, r, s, n) {
        var o;
        switch (this.operation) {
          case "&&":
            return this.left.evaluate(e, r, s, n) && this.right.evaluate(e, r, s, n);

          case "||":
            return this.left.evaluate(e, r, s, n) || this.right.evaluate(e, r, s, n);

          case "??":
            return null !== (o = this.left.evaluate(e, r, s, n)) && void 0 !== o ? o : this.right.evaluate(e, r, s, n);

          case "==":
            return this.left.evaluate(e, r, s, n) == this.right.evaluate(e, r, s, n);

          case "===":
            return this.left.evaluate(e, r, s, n) === this.right.evaluate(e, r, s, n);

          case "!=":
            return this.left.evaluate(e, r, s, n) != this.right.evaluate(e, r, s, n);

          case "!==":
            return this.left.evaluate(e, r, s, n) !== this.right.evaluate(e, r, s, n);

          case "instanceof":
            {
                const t = this.right.evaluate(e, r, s, n);
                if (i(t)) return this.left.evaluate(e, r, s, n) instanceof t;
                return false;
            }

          case "in":
            {
                const t = this.right.evaluate(e, r, s, n);
                if (t instanceof Object) return this.left.evaluate(e, r, s, n) in t;
                return false;
            }

          case "+":
            {
                const i = this.left.evaluate(e, r, s, n);
                const o = this.right.evaluate(e, r, s, n);
                if ((1 & e) > 0) return i + o;
                if (!i || !o) {
                    if (t.isNumberOrBigInt(i) || t.isNumberOrBigInt(o)) return (i || 0) + (o || 0);
                    if (t.isStringOrDate(i) || t.isStringOrDate(o)) return (i || "") + (o || "");
                }
                return i + o;
            }

          case "-":
            return this.left.evaluate(e, r, s, n) - this.right.evaluate(e, r, s, n);

          case "*":
            return this.left.evaluate(e, r, s, n) * this.right.evaluate(e, r, s, n);

          case "/":
            return this.left.evaluate(e, r, s, n) / this.right.evaluate(e, r, s, n);

          case "%":
            return this.left.evaluate(e, r, s, n) % this.right.evaluate(e, r, s, n);

          case "<":
            return this.left.evaluate(e, r, s, n) < this.right.evaluate(e, r, s, n);

          case ">":
            return this.left.evaluate(e, r, s, n) > this.right.evaluate(e, r, s, n);

          case "<=":
            return this.left.evaluate(e, r, s, n) <= this.right.evaluate(e, r, s, n);

          case ">=":
            return this.left.evaluate(e, r, s, n) >= this.right.evaluate(e, r, s, n);

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

ArrayLiteralExpression.$empty = new ArrayLiteralExpression(t.emptyArray);

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

ObjectLiteralExpression.$empty = new ObjectLiteralExpression(t.emptyArray, t.emptyArray);

class TemplateExpression {
    constructor(e, r = t.emptyArray) {
        this.cooked = e;
        this.expressions = r;
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
    constructor(e, r, s, i = t.emptyArray) {
        this.cooked = e;
        this.func = s;
        this.expressions = i;
        e.raw = r;
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
        const n = this.expressions.map((i => i.evaluate(t, e, r, s)));
        const o = this.func.evaluate(t, e, r, s);
        if (!i(o)) throw new Error(`AUR0110`);
        return o(this.cooked, ...n);
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

const $ = Object.prototype.toString;

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
        switch ($.call(e)) {
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
            throw new Error(`Cannot count ${$.call(e)}`);
        }
    }
    iterate(t, e, r) {
        switch ($.call(e)) {
          case "[object Array]":
            return L(e, r);

          case "[object Map]":
            return R(e, r);

          case "[object Set]":
            return P(e, r);

          case "[object Number]":
            return T(e, r);

          case "[object Null]":
            return;

          case "[object Undefined]":
            return;

          default:
            throw new Error(`Cannot iterate over ${$.call(e)}`);
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
    constructor(e, r = t.emptyArray) {
        this.parts = e;
        this.expressions = r;
        this.isMulti = r.length > 1;
        this.firstExpression = r[0];
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
    assign(e, r, s, i) {
        if (null == i) return;
        if ("object" !== typeof i) throw new Error(`AUR0112`);
        const n = this.indexOrProperties;
        let o;
        if (t.isArrayIndex(n)) {
            if (!Array.isArray(i)) throw new Error(`AUR0112`);
            o = i.slice(n);
        } else o = Object.entries(i).reduce(((t, [e, r]) => {
            if (!n.includes(e)) t[e] = r;
            return t;
        }), {});
        this.target.assign(e, r, s, o);
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

function B(t, e, r) {
    const s = null == e ? null : e[r];
    if (i(s)) return s;
    if (!(8 & t) && null == s) return null;
    throw new Error(`AUR0111:${r}`);
}

function L(t, e) {
    for (let r = 0, s = t.length; r < s; ++r) e(t, r, t[r]);
}

function R(t, e) {
    const r = Array(t.size);
    let s = -1;
    for (const e of t.entries()) r[++s] = e;
    L(r, e);
}

function P(t, e) {
    const r = Array(t.size);
    let s = -1;
    for (const e of t.keys()) r[++s] = e;
    L(r, e);
}

function T(t, e) {
    const r = Array(t);
    for (let e = 0; e < t; ++e) r[e] = e;
    L(r, e);
}

const j = t.DI.createInterface("ICoercionConfiguration");

exports.BindingMode = void 0;

(function(t) {
    t[t["oneTime"] = 1] = "oneTime";
    t[t["toView"] = 2] = "toView";
    t[t["fromView"] = 4] = "fromView";
    t[t["twoWay"] = 6] = "twoWay";
    t[t["default"] = 8] = "default";
})(exports.BindingMode || (exports.BindingMode = {}));

exports.LifecycleFlags = void 0;

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
})(exports.LifecycleFlags || (exports.LifecycleFlags = {}));

var I;

(function(t) {
    t[t["None"] = 0] = "None";
    t[t["Subscriber0"] = 1] = "Subscriber0";
    t[t["Subscriber1"] = 2] = "Subscriber1";
    t[t["Subscriber2"] = 4] = "Subscriber2";
    t[t["SubscribersRest"] = 8] = "SubscribersRest";
    t[t["Any"] = 15] = "Any";
})(I || (I = {}));

exports.DelegationStrategy = void 0;

(function(t) {
    t[t["none"] = 0] = "none";
    t[t["capturing"] = 1] = "capturing";
    t[t["bubbling"] = 2] = "bubbling";
})(exports.DelegationStrategy || (exports.DelegationStrategy = {}));

exports.CollectionKind = void 0;

(function(t) {
    t[t["indexed"] = 8] = "indexed";
    t[t["keyed"] = 4] = "keyed";
    t[t["array"] = 9] = "array";
    t[t["map"] = 6] = "map";
    t[t["set"] = 7] = "set";
})(exports.CollectionKind || (exports.CollectionKind = {}));

exports.AccessorType = void 0;

(function(t) {
    t[t["None"] = 0] = "None";
    t[t["Observer"] = 1] = "Observer";
    t[t["Node"] = 2] = "Node";
    t[t["Layout"] = 4] = "Layout";
    t[t["Primtive"] = 8] = "Primtive";
    t[t["Array"] = 18] = "Array";
    t[t["Set"] = 34] = "Set";
    t[t["Map"] = 66] = "Map";
})(exports.AccessorType || (exports.AccessorType = {}));

function D(t, e) {
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

function M(t = 0) {
    const e = Array(t);
    let r = 0;
    while (r < t) e[r] = r++;
    e.deletedItems = [];
    e.isIndexMap = true;
    return e;
}

function F(t) {
    const e = t.slice();
    e.deletedItems = t.deletedItems.slice();
    e.isIndexMap = true;
    return e;
}

function V(t) {
    return o(t) && true === t.isIndexMap;
}

function N(t) {
    return null == t ? K : K(t);
}

function K(t) {
    const e = t.prototype;
    s(e, "subs", {
        get: q
    });
    u(e, "subscribe", H);
    u(e, "unsubscribe", Q);
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

function q() {
    return c(this, "subs", new SubscriberRecord);
}

function H(t) {
    return this.subs.add(t);
}

function Q(t) {
    return this.subs.remove(t);
}

function _(t) {
    return null == t ? z : z(t);
}

function z(t) {
    const e = t.prototype;
    s(e, "queue", {
        get: W
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
            this.i.forEach(G);
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

function W() {
    return FlushQueue.instance;
}

function G(t, e, r) {
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
    setValue(e, r) {
        const s = this.v;
        if (e !== s && t.isArrayIndex(e)) {
            if (0 === (32 & r)) this.o.length = e;
            this.v = e;
            this.u = s;
            this.f = r;
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
        Y = this.u;
        this.u = this.v;
        this.subs.notify(this.v, Y, this.f);
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
        Y = this.u;
        this.u = this.v;
        this.subs.notify(this.v, Y, this.f);
    }
}

function Z(t) {
    const e = t.prototype;
    u(e, "subscribe", J, true);
    u(e, "unsubscribe", X, true);
    _(t);
    N(t);
}

function J(t) {
    if (this.subs.add(t) && 1 === this.subs.count) this.owner.subscribe(this);
}

function X(t) {
    if (this.subs.remove(t) && 0 === this.subs.count) this.owner.subscribe(this);
}

Z(CollectionLengthObserver);

Z(CollectionSizeObserver);

let Y;

const tt = new WeakMap;

function et(t, e) {
    if (t === e) return 0;
    t = null === t ? "null" : t.toString();
    e = null === e ? "null" : e.toString();
    return t < e ? -1 : 1;
}

function rt(t, e) {
    if (void 0 === t) if (void 0 === e) return 0; else return 1;
    if (void 0 === e) return -1;
    return 0;
}

function st(t, e, r, s, i) {
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

function it(t, e, r, s, i) {
    let n = 0, o = 0;
    let c, u, h;
    let a, l, f;
    let d, p, v;
    let w, g;
    let b, x, E, A;
    let m, y, U, S;
    while (true) {
        if (s - r <= 10) {
            st(t, e, r, s, i);
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
        p = i(c, h);
        if (p >= 0) {
            w = c;
            g = a;
            c = h;
            a = f;
            h = u;
            f = l;
            u = w;
            l = g;
        } else {
            v = i(u, h);
            if (v > 0) {
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
        x = l;
        E = r + 1;
        A = s - 1;
        t[n] = t[E];
        e[n] = e[E];
        t[E] = b;
        e[E] = x;
        t: for (o = E + 1; o < A; o++) {
            m = t[o];
            y = e[o];
            U = i(m, b);
            if (U < 0) {
                t[o] = t[E];
                e[o] = e[E];
                t[E] = m;
                e[E] = y;
                E++;
            } else if (U > 0) {
                do {
                    A--;
                    if (A == o) break t;
                    S = t[A];
                    U = i(S, b);
                } while (U > 0);
                t[o] = t[A];
                e[o] = e[A];
                t[A] = m;
                e[A] = y;
                if (U < 0) {
                    m = t[o];
                    y = e[o];
                    t[o] = t[E];
                    e[o] = e[E];
                    t[E] = m;
                    e[E] = y;
                    E++;
                }
            }
        }
        if (s - A < E - r) {
            it(t, e, A, s, i);
            s = E;
        } else {
            it(t, e, r, E, i);
            r = A;
        }
    }
}

const nt = Array.prototype;

const ot = nt.push;

const ct = nt.unshift;

const ut = nt.pop;

const ht = nt.shift;

const at = nt.splice;

const lt = nt.reverse;

const ft = nt.sort;

const dt = {
    push: ot,
    unshift: ct,
    pop: ut,
    shift: ht,
    splice: at,
    reverse: lt,
    sort: ft
};

const pt = [ "push", "unshift", "pop", "shift", "splice", "reverse", "sort" ];

const vt = {
    push: function(...t) {
        const e = tt.get(this);
        if (void 0 === e) return ot.apply(this, t);
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
        const e = tt.get(this);
        if (void 0 === e) return ct.apply(this, t);
        const r = t.length;
        const s = new Array(r);
        let i = 0;
        while (i < r) s[i++] = -2;
        ct.apply(e.indexMap, s);
        const n = ct.apply(this, t);
        e.notify();
        return n;
    },
    pop: function() {
        const t = tt.get(this);
        if (void 0 === t) return ut.call(this);
        const e = t.indexMap;
        const r = ut.call(this);
        const s = e.length - 1;
        if (e[s] > -1) e.deletedItems.push(e[s]);
        ut.call(e);
        t.notify();
        return r;
    },
    shift: function() {
        const t = tt.get(this);
        if (void 0 === t) return ht.call(this);
        const e = t.indexMap;
        const r = ht.call(this);
        if (e[0] > -1) e.deletedItems.push(e[0]);
        ht.call(e);
        t.notify();
        return r;
    },
    splice: function(...t) {
        const e = t[0];
        const r = t[1];
        const s = tt.get(this);
        if (void 0 === s) return at.apply(this, t);
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
            at.call(c, e, r, ...s);
        } else at.apply(c, t);
        const a = at.apply(this, t);
        s.notify();
        return a;
    },
    reverse: function() {
        const t = tt.get(this);
        if (void 0 === t) {
            lt.call(this);
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
        const e = tt.get(this);
        if (void 0 === e) {
            ft.call(this, t);
            return this;
        }
        let r = this.length;
        if (r < 2) return this;
        it(this, e.indexMap, 0, r, rt);
        let s = 0;
        while (s < r) {
            if (void 0 === this[s]) break;
            s++;
        }
        if (void 0 === t || !i(t)) t = et;
        it(this, e.indexMap, 0, s, t);
        let n = false;
        for (s = 0, r = e.indexMap.length; r > s; ++s) if (e.indexMap[s] !== s) {
            n = true;
            break;
        }
        if (n) e.notify();
        return this;
    }
};

for (const t of pt) s(vt[t], "observing", {
    value: true,
    writable: false,
    configurable: false,
    enumerable: false
});

let wt = false;

function gt() {
    for (const t of pt) if (true !== nt[t].observing) c(nt, t, vt[t]);
}

function bt() {
    for (const t of pt) if (true === nt[t].observing) c(nt, t, dt[t]);
}

class ArrayObserver {
    constructor(t) {
        this.type = 18;
        if (!wt) {
            wt = true;
            gt();
        }
        this.indexObservers = {};
        this.collection = t;
        this.indexMap = M(t.length);
        this.lenObs = void 0;
        tt.set(t, this);
    }
    notify() {
        const t = this.indexMap;
        const e = this.collection.length;
        this.indexMap = M(e);
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

N(ArrayObserver);

N(ArrayIndexObserver);

function xt(t) {
    let e = tt.get(t);
    if (void 0 === e) e = new ArrayObserver(t);
    return e;
}

function Et(t) {
    let e = 0;
    let r = 0;
    let s = 0;
    const i = F(t);
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

function At(t, e) {
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

const mt = new WeakMap;

const yt = Set.prototype;

const Ut = yt.add;

const St = yt.clear;

const Ot = yt.delete;

const kt = {
    add: Ut,
    clear: St,
    delete: Ot
};

const Ct = [ "add", "clear", "delete" ];

const $t = {
    add: function(t) {
        const e = mt.get(this);
        if (void 0 === e) {
            Ut.call(this, t);
            return this;
        }
        const r = this.size;
        Ut.call(this, t);
        const s = this.size;
        if (s === r) return this;
        e.indexMap[r] = -2;
        e.notify();
        return this;
    },
    clear: function() {
        const t = mt.get(this);
        if (void 0 === t) return St.call(this);
        const e = this.size;
        if (e > 0) {
            const e = t.indexMap;
            let r = 0;
            for (const t of this.keys()) {
                if (e[r] > -1) e.deletedItems.push(e[r]);
                r++;
            }
            St.call(this);
            e.length = 0;
            t.notify();
        }
        return;
    },
    delete: function(t) {
        const e = mt.get(this);
        if (void 0 === e) return Ot.call(this, t);
        const r = this.size;
        if (0 === r) return false;
        let s = 0;
        const i = e.indexMap;
        for (const r of this.keys()) {
            if (r === t) {
                if (i[s] > -1) i.deletedItems.push(i[s]);
                i.splice(s, 1);
                const r = Ot.call(this, t);
                if (true === r) e.notify();
                return r;
            }
            s++;
        }
        return false;
    }
};

const Bt = {
    writable: true,
    enumerable: false,
    configurable: true
};

for (const t of Ct) s($t[t], "observing", {
    value: true,
    writable: false,
    configurable: false,
    enumerable: false
});

let Lt = false;

function Rt() {
    for (const t of Ct) if (true !== yt[t].observing) s(yt, t, {
        ...Bt,
        value: $t[t]
    });
}

function Pt() {
    for (const t of Ct) if (true === yt[t].observing) s(yt, t, {
        ...Bt,
        value: kt[t]
    });
}

class SetObserver {
    constructor(t) {
        this.type = 34;
        if (!Lt) {
            Lt = true;
            Rt();
        }
        this.collection = t;
        this.indexMap = M(t.size);
        this.lenObs = void 0;
        mt.set(t, this);
    }
    notify() {
        const t = this.indexMap;
        const e = this.collection.size;
        this.indexMap = M(e);
        this.subs.notifyCollection(t, 0);
    }
    getLengthObserver() {
        var t;
        return null !== (t = this.lenObs) && void 0 !== t ? t : this.lenObs = new CollectionSizeObserver(this);
    }
}

N(SetObserver);

function Tt(t) {
    let e = mt.get(t);
    if (void 0 === e) e = new SetObserver(t);
    return e;
}

const jt = new WeakMap;

const It = Map.prototype;

const Dt = It.set;

const Mt = It.clear;

const Ft = It.delete;

const Vt = {
    set: Dt,
    clear: Mt,
    delete: Ft
};

const Nt = [ "set", "clear", "delete" ];

const Kt = {
    set: function(t, e) {
        const r = jt.get(this);
        if (void 0 === r) {
            Dt.call(this, t, e);
            return this;
        }
        const s = this.get(t);
        const i = this.size;
        Dt.call(this, t, e);
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
        const t = jt.get(this);
        if (void 0 === t) return Mt.call(this);
        const e = this.size;
        if (e > 0) {
            const e = t.indexMap;
            let r = 0;
            for (const t of this.keys()) {
                if (e[r] > -1) e.deletedItems.push(e[r]);
                r++;
            }
            Mt.call(this);
            e.length = 0;
            t.notify();
        }
        return;
    },
    delete: function(t) {
        const e = jt.get(this);
        if (void 0 === e) return Ft.call(this, t);
        const r = this.size;
        if (0 === r) return false;
        let s = 0;
        const i = e.indexMap;
        for (const r of this.keys()) {
            if (r === t) {
                if (i[s] > -1) i.deletedItems.push(i[s]);
                i.splice(s, 1);
                const r = Ft.call(this, t);
                if (true === r) e.notify();
                return r;
            }
            ++s;
        }
        return false;
    }
};

const qt = {
    writable: true,
    enumerable: false,
    configurable: true
};

for (const t of Nt) s(Kt[t], "observing", {
    value: true,
    writable: false,
    configurable: false,
    enumerable: false
});

let Ht = false;

function Qt() {
    for (const t of Nt) if (true !== It[t].observing) s(It, t, {
        ...qt,
        value: Kt[t]
    });
}

function _t() {
    for (const t of Nt) if (true === It[t].observing) s(It, t, {
        ...qt,
        value: Vt[t]
    });
}

class MapObserver {
    constructor(t) {
        this.type = 66;
        if (!Ht) {
            Ht = true;
            Qt();
        }
        this.collection = t;
        this.indexMap = M(t.size);
        this.lenObs = void 0;
        jt.set(t, this);
    }
    notify() {
        const t = this.indexMap;
        const e = this.collection.size;
        this.indexMap = M(e);
        this.subs.notifyCollection(t, 0);
    }
    getLengthObserver() {
        var t;
        return null !== (t = this.lenObs) && void 0 !== t ? t : this.lenObs = new CollectionSizeObserver(this);
    }
}

N(MapObserver);

function zt(t) {
    let e = jt.get(t);
    if (void 0 === e) e = new MapObserver(t);
    return e;
}

function Wt(t, e) {
    const r = this.oL.getObserver(t, e);
    this.obs.add(r);
}

function Gt() {
    return c(this, "obs", new BindingObserverRecord(this));
}

function Zt(t) {
    let e;
    if (o(t)) e = xt(t); else if (t instanceof Set) e = Tt(t); else if (t instanceof Map) e = zt(t); else throw new Error(`AUR0210`);
    this.obs.add(e);
}

function Jt(t) {
    this.obs.add(t);
}

function Xt() {
    throw new Error(`AUR2011:handleChange`);
}

function Yt() {
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
        this.o.forEach(ee, this);
        this.count = this.o.size;
    }
    clearAll() {
        this.o.forEach(te, this);
        this.o.clear();
        this.count = 0;
    }
}

function te(t, e) {
    e.unsubscribe(this);
}

function ee(t, e) {
    if (this.version !== t) {
        e.unsubscribe(this);
        this.o.delete(e);
    }
}

function re(t) {
    const e = t.prototype;
    u(e, "observe", Wt, true);
    u(e, "observeCollection", Zt, true);
    u(e, "subscribeTo", Jt, true);
    s(e, "obs", {
        get: Gt
    });
    u(e, "handleChange", Xt);
    u(e, "handleCollectionChange", Yt);
    return t;
}

function se(t) {
    return null == t ? re : re(t);
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

re(BindingMediator);

const ie = t.DI.createInterface("IExpressionParser", (t => t.singleton(ExpressionParser)));

class ExpressionParser {
    constructor() {
        this.h = h();
        this.A = h();
        this.U = h();
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
                throw er();
            }
            r = this.h[t];
            if (void 0 === r) r = this.h[t] = this.$parse(t, e);
            return r;
        }
    }
    $parse(t, e) {
        pe = t;
        ve = 0;
        we = t.length;
        ge = 0;
        be = 0;
        xe = 6291456;
        Ee = "";
        Ae = t.charCodeAt(0);
        me = true;
        ye = false;
        return Oe(61, void 0 === e ? 8 : e);
    }
}

exports.Char = void 0;

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
})(exports.Char || (exports.Char = {}));

function ne(t) {
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

var oe;

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
})(oe || (oe = {}));

var ce;

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
})(ce || (ce = {}));

const ue = PrimitiveLiteralExpression.$false;

const he = PrimitiveLiteralExpression.$true;

const ae = PrimitiveLiteralExpression.$null;

const le = PrimitiveLiteralExpression.$undefined;

const fe = AccessThisExpression.$this;

const de = AccessThisExpression.$parent;

exports.ExpressionType = void 0;

(function(t) {
    t[t["None"] = 0] = "None";
    t[t["Interpolation"] = 1] = "Interpolation";
    t[t["IsIterator"] = 2] = "IsIterator";
    t[t["IsFunction"] = 4] = "IsFunction";
    t[t["IsProperty"] = 8] = "IsProperty";
    t[t["IsCustom"] = 16] = "IsCustom";
})(exports.ExpressionType || (exports.ExpressionType = {}));

let pe = "";

let ve = 0;

let we = 0;

let ge = 0;

let be = 0;

let xe = 6291456;

let Ee = "";

let Ae;

let me = true;

let ye = false;

function Ue() {
    return pe.slice(be, ve);
}

function Se(t, e) {
    pe = t;
    ve = 0;
    we = t.length;
    ge = 0;
    be = 0;
    xe = 6291456;
    Ee = "";
    Ae = t.charCodeAt(0);
    me = true;
    ye = false;
    return Oe(61, void 0 === e ? 8 : e);
}

function Oe(t, e) {
    if (16 === e) return new CustomExpression(pe);
    if (0 === ve) {
        if (1 & e) return De();
        Ve();
        if (4194304 & xe) throw Ge();
    }
    me = 513 > t;
    ye = false;
    let r = false;
    let s;
    let i = 0;
    if (131072 & xe) {
        const t = Ar[63 & xe];
        Ve();
        s = new UnaryExpression(t, Oe(514, e));
        me = false;
    } else {
        t: switch (xe) {
          case 12294:
            i = ge;
            me = false;
            do {
                Ve();
                ++i;
                switch (xe) {
                  case 65545:
                    Ve();
                    if (0 === (12288 & xe)) throw Je();
                    break;

                  case 10:
                  case 11:
                    throw Je();

                  case 2162700:
                    ye = true;
                    Ve();
                    if (0 === (12288 & xe)) {
                        s = 0 === i ? fe : 1 === i ? de : new AccessThisExpression(i);
                        r = true;
                        break t;
                    }
                    break;

                  default:
                    if (2097152 & xe) {
                        s = 0 === i ? fe : 1 === i ? de : new AccessThisExpression(i);
                        break t;
                    }
                    throw Xe();
                }
            } while (12294 === xe);

          case 4096:
            {
                const t = Ee;
                if (2 & e) s = new BindingIdentifier(t); else s = new AccessScopeExpression(t, i);
                me = !ye;
                Ve();
                if (ze(49)) {
                    if (524296 === xe) throw xr();
                    const e = ye;
                    const r = ge;
                    ++ge;
                    const i = Oe(62, 0);
                    ye = e;
                    ge = r;
                    me = false;
                    s = new ArrowFunction([ new BindingIdentifier(t) ], i);
                }
                break;
            }

          case 10:
            throw Er();

          case 11:
            throw Ze();

          case 12292:
            me = false;
            Ve();
            switch (ge) {
              case 0:
                s = fe;
                break;

              case 1:
                s = de;
                break;

              default:
                s = new AccessThisExpression(ge);
                break;
            }
            break;

          case 2688007:
            s = Pe(e);
            break;

          case 2688016:
            s = pe.search(/\s+of\s+/) > ve ? ke() : Te(e);
            break;

          case 524296:
            s = Ie(e);
            break;

          case 2163758:
            s = new TemplateExpression([ Ee ]);
            me = false;
            Ve();
            break;

          case 2163759:
            s = Me(e, s, false);
            break;

          case 16384:
          case 32768:
            s = new PrimitiveLiteralExpression(Ee);
            me = false;
            Ve();
            break;

          case 8194:
          case 8195:
          case 8193:
          case 8192:
            s = Ar[63 & xe];
            me = false;
            Ve();
            break;

          default:
            if (ve >= we) throw Ye(); else throw tr();
        }
        if (2 & e) return je(s);
        if (514 < t) return s;
        if (10 === xe || 11 === xe) throw Je();
        if (1793 === s.$kind) switch (xe) {
          case 2162700:
            ye = true;
            me = false;
            Ve();
            if (0 === (13312 & xe)) throw dr();
            if (12288 & xe) {
                s = new AccessScopeExpression(Ee, s.ancestor);
                Ve();
            } else if (2688007 === xe) s = new CallFunctionExpression(s, Ce(), true); else if (2688016 === xe) s = $e(s, true); else throw pr();
            break;

          case 65545:
            me = !ye;
            Ve();
            if (0 === (12288 & xe)) throw Je();
            s = new AccessScopeExpression(Ee, s.ancestor);
            Ve();
            break;

          case 10:
          case 11:
            throw Je();

          case 2688007:
            s = new CallFunctionExpression(s, Ce(), r);
            break;

          case 2688016:
            s = $e(s, r);
            break;

          case 2163758:
            s = Fe(s);
            break;

          case 2163759:
            s = Me(e, s, true);
            break;
        }
        while ((65536 & xe) > 0) switch (xe) {
          case 2162700:
            s = Be(s);
            break;

          case 65545:
            Ve();
            if (0 === (12288 & xe)) throw Je();
            s = Le(s, false);
            break;

          case 10:
          case 11:
            throw Je();

          case 2688007:
            if (10082 === s.$kind) s = new CallScopeExpression(s.name, Ce(), s.ancestor, false); else if (9323 === s.$kind) s = new CallMemberExpression(s.object, s.name, Ce(), s.optional, false); else s = new CallFunctionExpression(s, Ce(), false);
            break;

          case 2688016:
            s = $e(s, false);
            break;

          case 2163758:
            if (ye) throw pr();
            s = Fe(s);
            break;

          case 2163759:
            if (ye) throw pr();
            s = Me(e, s, true);
            break;
        }
    }
    if (10 === xe || 11 === xe) throw Je();
    if (513 < t) return s;
    while ((262144 & xe) > 0) {
        const r = xe;
        if ((960 & r) <= t) break;
        Ve();
        s = new BinaryExpression(Ar[63 & r], s, Oe(960 & r, e));
        me = false;
    }
    if (63 < t) return s;
    if (ze(6291477)) {
        const t = Oe(62, e);
        We(6291476);
        s = new ConditionalExpression(s, t, Oe(62, e));
        me = false;
    }
    if (62 < t) return s;
    if (ze(4194348)) {
        if (!me) throw rr();
        s = new AssignExpression(s, Oe(62, e));
    }
    if (61 < t) return s;
    while (ze(6291479)) {
        if (6291456 === xe) throw sr();
        const t = Ee;
        Ve();
        const r = new Array;
        while (ze(6291476)) r.push(Oe(62, e));
        s = new ValueConverterExpression(s, t, r);
    }
    while (ze(6291478)) {
        if (6291456 === xe) throw ir();
        const t = Ee;
        Ve();
        const r = new Array;
        while (ze(6291476)) r.push(Oe(62, e));
        s = new BindingBehaviorExpression(s, t, r);
    }
    if (6291456 !== xe) {
        if (1 & e) return s;
        if ("of" === Ue()) throw nr();
        throw tr();
    }
    return s;
}

function ke() {
    const t = [];
    const e = new DestructuringAssignmentExpression(90138, t, void 0, void 0);
    let r = "";
    let s = true;
    let i = 0;
    while (s) {
        Ve();
        switch (xe) {
          case 7340051:
            s = false;
            n();
            break;

          case 6291471:
            n();
            break;

          case 4096:
            r = Ue();
            break;

          default:
            throw fr();
        }
    }
    We(7340051);
    return e;
    function n() {
        if ("" !== r) {
            t.push(new DestructuringAssignmentSingleExpression(new AccessMemberExpression(fe, r), new AccessKeyedExpression(fe, new PrimitiveLiteralExpression(i++)), void 0));
            r = "";
        } else i++;
    }
}

function Ce() {
    const t = ye;
    Ve();
    const e = [];
    while (7340046 !== xe) {
        e.push(Oe(62, 0));
        if (!ze(6291471)) break;
    }
    We(7340046);
    me = false;
    ye = t;
    return e;
}

function $e(t, e) {
    const r = ye;
    Ve();
    t = new AccessKeyedExpression(t, Oe(62, 0), e);
    We(7340051);
    me = !r;
    ye = r;
    return t;
}

function Be(t) {
    ye = true;
    me = false;
    Ve();
    if (0 === (13312 & xe)) throw dr();
    if (12288 & xe) return Le(t, true);
    if (2688007 === xe) if (10082 === t.$kind) return new CallScopeExpression(t.name, Ce(), t.ancestor, true); else if (9323 === t.$kind) return new CallMemberExpression(t.object, t.name, Ce(), t.optional, true); else return new CallFunctionExpression(t, Ce(), true);
    if (2688016 === xe) return $e(t, true);
    throw pr();
}

function Le(t, e) {
    const r = Ee;
    switch (xe) {
      case 2162700:
        {
            ye = true;
            me = false;
            const s = ve;
            const i = be;
            const n = xe;
            const o = Ae;
            const c = Ee;
            const u = me;
            const h = ye;
            Ve();
            if (0 === (13312 & xe)) throw dr();
            if (2688007 === xe) return new CallMemberExpression(t, r, Ce(), e, true);
            ve = s;
            be = i;
            xe = n;
            Ae = o;
            Ee = c;
            me = u;
            ye = h;
            return new AccessMemberExpression(t, r, e);
        }

      case 2688007:
        me = false;
        return new CallMemberExpression(t, r, Ce(), e, false);

      default:
        me = !ye;
        Ve();
        return new AccessMemberExpression(t, r, e);
    }
}

var Re;

(function(t) {
    t[t["Valid"] = 1] = "Valid";
    t[t["Invalid"] = 2] = "Invalid";
    t[t["Default"] = 3] = "Default";
    t[t["Destructuring"] = 4] = "Destructuring";
})(Re || (Re = {}));

function Pe(t) {
    Ve();
    const e = ve;
    const r = be;
    const s = xe;
    const i = Ae;
    const n = Ee;
    const o = me;
    const c = ye;
    const u = [];
    let h = 1;
    let a = false;
    t: while (true) {
        if (11 === xe) {
            Ve();
            if (4096 !== xe) throw Je();
            u.push(new BindingIdentifier(Ee));
            Ve();
            if (6291471 === xe) throw br();
            if (7340046 !== xe) throw Ze();
            Ve();
            if (49 !== xe) throw Ze();
            Ve();
            const t = ye;
            const e = ge;
            ++ge;
            const r = Oe(62, 0);
            ye = t;
            ge = e;
            me = false;
            return new ArrowFunction(u, r, true);
        }
        switch (xe) {
          case 4096:
            u.push(new BindingIdentifier(Ee));
            Ve();
            break;

          case 7340046:
            Ve();
            break t;

          case 524296:
          case 2688016:
            Ve();
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
            Ve();
            h = 2;
            break;
        }
        switch (xe) {
          case 6291471:
            Ve();
            a = true;
            if (1 === h) break;
            break t;

          case 7340046:
            Ve();
            break t;

          case 4194348:
            if (1 === h) h = 3;
            break t;

          case 49:
            if (a) throw vr();
            Ve();
            h = 2;
            break t;

          default:
            if (1 === h) h = 2;
            break t;
        }
    }
    if (49 === xe) {
        if (1 === h) {
            Ve();
            if (524296 === xe) throw xr();
            const t = ye;
            const e = ge;
            ++ge;
            const r = Oe(62, 0);
            ye = t;
            ge = e;
            me = false;
            return new ArrowFunction(u, r);
        }
        throw vr();
    } else if (1 === h && 0 === u.length) throw ar(49);
    if (a) switch (h) {
      case 2:
        throw vr();

      case 3:
        throw wr();

      case 4:
        throw gr();
    }
    ve = e;
    be = r;
    xe = s;
    Ae = i;
    Ee = n;
    me = o;
    ye = c;
    const l = ye;
    const f = Oe(62, t);
    ye = l;
    We(7340046);
    if (49 === xe) switch (h) {
      case 2:
        throw vr();

      case 3:
        throw wr();

      case 4:
        throw gr();
    }
    return f;
}

function Te(t) {
    const e = ye;
    Ve();
    const r = new Array;
    while (7340051 !== xe) if (ze(6291471)) {
        r.push(le);
        if (7340051 === xe) break;
    } else {
        r.push(Oe(62, ~2 & t));
        if (ze(6291471)) {
            if (7340051 === xe) break;
        } else break;
    }
    ye = e;
    We(7340051);
    if (2 & t) return new ArrayBindingPattern(r); else {
        me = false;
        return new ArrayLiteralExpression(r);
    }
}

function je(t) {
    if (0 === (65536 & t.$kind)) throw or();
    if (4204592 !== xe) throw or();
    Ve();
    const e = t;
    const r = Oe(61, 0);
    return new ForOfStatement(e, r);
}

function Ie(t) {
    const e = ye;
    const r = new Array;
    const s = new Array;
    Ve();
    while (7340045 !== xe) {
        r.push(Ee);
        if (49152 & xe) {
            Ve();
            We(6291476);
            s.push(Oe(62, ~2 & t));
        } else if (12288 & xe) {
            const e = Ae;
            const r = xe;
            const i = ve;
            Ve();
            if (ze(6291476)) s.push(Oe(62, ~2 & t)); else {
                Ae = e;
                xe = r;
                ve = i;
                s.push(Oe(515, ~2 & t));
            }
        } else throw cr();
        if (7340045 !== xe) We(6291471);
    }
    ye = e;
    We(7340045);
    if (2 & t) return new ObjectBindingPattern(r, s); else {
        me = false;
        return new ObjectLiteralExpression(r, s);
    }
}

function De() {
    const t = [];
    const e = [];
    const r = we;
    let s = "";
    while (ve < r) {
        switch (Ae) {
          case 36:
            if (123 === pe.charCodeAt(ve + 1)) {
                t.push(s);
                s = "";
                ve += 2;
                Ae = pe.charCodeAt(ve);
                Ve();
                const r = Oe(61, 1);
                e.push(r);
                continue;
            } else s += "$";
            break;

          case 92:
            s += String.fromCharCode(ne(Ne()));
            break;

          default:
            s += String.fromCharCode(Ae);
        }
        Ne();
    }
    if (e.length) {
        t.push(s);
        return new Interpolation(t, e);
    }
    return null;
}

function Me(t, e, r) {
    const s = ye;
    const i = [ Ee ];
    We(2163759);
    const n = [ Oe(62, t) ];
    while (2163758 !== (xe = _e())) {
        i.push(Ee);
        We(2163759);
        n.push(Oe(62, t));
    }
    i.push(Ee);
    me = false;
    ye = s;
    if (r) {
        Ve();
        return new TaggedTemplateExpression(i, i, e, n);
    } else {
        Ve();
        return new TemplateExpression(i, n);
    }
}

function Fe(t) {
    me = false;
    const e = [ Ee ];
    Ve();
    return new TaggedTemplateExpression(e, e, t);
}

function Ve() {
    while (ve < we) {
        be = ve;
        if (null != (xe = Cr[Ae]())) return;
    }
    xe = 6291456;
}

function Ne() {
    return Ae = pe.charCodeAt(++ve);
}

function Ke() {
    while (kr[Ne()]) ;
    const t = mr[Ee = Ue()];
    return void 0 === t ? 4096 : t;
}

function qe(t) {
    let e = Ae;
    if (false === t) {
        do {
            e = Ne();
        } while (e <= 57 && e >= 48);
        if (46 !== e) {
            Ee = parseInt(Ue(), 10);
            return 32768;
        }
        e = Ne();
        if (ve >= we) {
            Ee = parseInt(Ue().slice(0, -1), 10);
            return 32768;
        }
    }
    if (e <= 57 && e >= 48) do {
        e = Ne();
    } while (e <= 57 && e >= 48); else Ae = pe.charCodeAt(--ve);
    Ee = parseFloat(Ue());
    return 32768;
}

function He() {
    const t = Ae;
    Ne();
    let e = 0;
    const r = new Array;
    let s = ve;
    while (Ae !== t) if (92 === Ae) {
        r.push(pe.slice(s, ve));
        Ne();
        e = ne(Ae);
        Ne();
        r.push(String.fromCharCode(e));
        s = ve;
    } else if (ve >= we) throw ur(); else Ne();
    const i = pe.slice(s, ve);
    Ne();
    r.push(i);
    const n = r.join("");
    Ee = n;
    return 16384;
}

function Qe() {
    let t = true;
    let e = "";
    while (96 !== Ne()) if (36 === Ae) if (ve + 1 < we && 123 === pe.charCodeAt(ve + 1)) {
        ve++;
        t = false;
        break;
    } else e += "$"; else if (92 === Ae) e += String.fromCharCode(ne(Ne())); else {
        if (ve >= we) throw hr();
        e += String.fromCharCode(Ae);
    }
    Ne();
    Ee = e;
    if (t) return 2163758;
    return 2163759;
}

function _e() {
    if (ve >= we) throw hr();
    ve--;
    return Qe();
}

function ze(t) {
    if (xe === t) {
        Ve();
        return true;
    }
    return false;
}

function We(t) {
    if (xe === t) Ve(); else throw ar(t);
}

function Ge() {
    return new Error(`AUR0151:${pe}`);
}

function Ze() {
    return new Error(`AUR0152:${pe}`);
}

function Je() {
    return new Error(`AUR0153:${pe}`);
}

function Xe() {
    return new Error(`AUR0154:${pe}`);
}

function Ye() {
    return new Error(`AUR0155:${pe}`);
}

function tr() {
    return new Error(`AUR0156:${pe}`);
}

function er() {
    return new Error(`AUR0157`);
}

function rr() {
    return new Error(`AUR0158:${pe}`);
}

function sr() {
    return new Error(`AUR0159:${pe}`);
}

function ir() {
    return new Error(`AUR0160:${pe}`);
}

function nr() {
    return new Error(`AUR0161:${pe}`);
}

function or() {
    return new Error(`AUR0163:${pe}`);
}

function cr() {
    return new Error(`AUR0164:${pe}`);
}

function ur() {
    return new Error(`AUR0165:${pe}`);
}

function hr() {
    return new Error(`AUR0166:${pe}`);
}

function ar(t) {
    return new Error(`AUR0167:${pe}<${Ar[63 & t]}`);
}

const lr = () => {
    throw new Error(`AUR0168:${pe}`);
};

lr.notMapped = true;

function fr() {
    return new Error(`AUR0170:${pe}`);
}

function dr() {
    return new Error(`AUR0171:${pe}`);
}

function pr() {
    return new Error(`AUR0172:${pe}`);
}

function vr() {
    return new Error(`AUR0173:${pe}`);
}

function wr() {
    return new Error(`AUR0174:${pe}`);
}

function gr() {
    return new Error(`AUR0175:${pe}`);
}

function br() {
    return new Error(`AUR0176:${pe}`);
}

function xr() {
    return new Error(`AUR0178:${pe}`);
}

function Er() {
    return new Error(`AUR0179:${pe}`);
}

const Ar = [ ue, he, ae, le, "$this", null, "$parent", "(", "{", ".", "..", "...", "?.", "}", ")", ",", "[", "]", ":", "?", "'", '"', "&", "|", "??", "||", "&&", "==", "!=", "===", "!==", "<", ">", "<=", ">=", "in", "instanceof", "+", "-", "typeof", "void", "*", "%", "/", "=", "!", 2163758, 2163759, "of", "=>" ];

const mr = Object.assign(Object.create(null), {
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

const yr = {
    AsciiIdPart: [ 36, 0, 48, 58, 65, 91, 95, 0, 97, 123 ],
    IdStart: [ 36, 0, 65, 91, 95, 0, 97, 123, 170, 0, 186, 0, 192, 215, 216, 247, 248, 697, 736, 741, 7424, 7462, 7468, 7517, 7522, 7526, 7531, 7544, 7545, 7615, 7680, 7936, 8305, 0, 8319, 0, 8336, 8349, 8490, 8492, 8498, 0, 8526, 0, 8544, 8585, 11360, 11392, 42786, 42888, 42891, 42927, 42928, 42936, 42999, 43008, 43824, 43867, 43868, 43877, 64256, 64263, 65313, 65339, 65345, 65371 ],
    Digit: [ 48, 58 ],
    Skip: [ 0, 33, 127, 161 ]
};

function Ur(t, e, r, s) {
    const i = r.length;
    for (let n = 0; n < i; n += 2) {
        const i = r[n];
        let o = r[n + 1];
        o = o > 0 ? o : i + 1;
        if (t) t.fill(s, i, o);
        if (e) for (let t = i; t < o; t++) e.add(t);
    }
}

function Sr(t) {
    return () => {
        Ne();
        return t;
    };
}

const Or = new Set;

Ur(null, Or, yr.AsciiIdPart, true);

const kr = new Uint8Array(65535);

Ur(kr, null, yr.IdStart, 1);

Ur(kr, null, yr.Digit, 1);

const Cr = new Array(65535);

Cr.fill(lr, 0, 65535);

Ur(Cr, null, yr.Skip, (() => {
    Ne();
    return null;
}));

Ur(Cr, null, yr.IdStart, Ke);

Ur(Cr, null, yr.Digit, (() => qe(false)));

Cr[34] = Cr[39] = () => He();

Cr[96] = () => Qe();

Cr[33] = () => {
    if (61 !== Ne()) return 131117;
    if (61 !== Ne()) return 6553948;
    Ne();
    return 6553950;
};

Cr[61] = () => {
    if (62 === Ne()) {
        Ne();
        return 49;
    }
    if (61 !== Ae) return 4194348;
    if (61 !== Ne()) return 6553947;
    Ne();
    return 6553949;
};

Cr[38] = () => {
    if (38 !== Ne()) return 6291478;
    Ne();
    return 6553882;
};

Cr[124] = () => {
    if (124 !== Ne()) return 6291479;
    Ne();
    return 6553817;
};

Cr[63] = () => {
    if (46 === Ne()) {
        const t = pe.charCodeAt(ve + 1);
        if (t <= 48 || t >= 57) {
            Ne();
            return 2162700;
        }
        return 6291477;
    }
    if (63 !== Ae) return 6291477;
    Ne();
    return 6553752;
};

Cr[46] = () => {
    if (Ne() <= 57 && Ae >= 48) return qe(true);
    if (46 === Ae) {
        if (46 !== Ne()) return 10;
        Ne();
        return 11;
    }
    return 65545;
};

Cr[60] = () => {
    if (61 !== Ne()) return 6554015;
    Ne();
    return 6554017;
};

Cr[62] = () => {
    if (61 !== Ne()) return 6554016;
    Ne();
    return 6554018;
};

Cr[37] = Sr(6554154);

Cr[40] = Sr(2688007);

Cr[41] = Sr(7340046);

Cr[42] = Sr(6554153);

Cr[43] = Sr(2490853);

Cr[44] = Sr(6291471);

Cr[45] = Sr(2490854);

Cr[47] = Sr(6554155);

Cr[58] = Sr(6291476);

Cr[91] = Sr(2688016);

Cr[93] = Sr(7340051);

Cr[123] = Sr(524296);

Cr[125] = Sr(7340045);

let $r = null;

const Br = [];

let Lr = false;

function Rr() {
    Lr = false;
}

function Pr() {
    Lr = true;
}

function Tr() {
    return $r;
}

function jr(t) {
    if (null == t) throw new Error(`AUR0206`);
    if (null == $r) {
        $r = t;
        Br[0] = $r;
        Lr = true;
        return;
    }
    if ($r === t) throw new Error(`AUR0207`);
    Br.push(t);
    $r = t;
    Lr = true;
}

function Ir(t) {
    if (null == t) throw new Error(`AUR0208`);
    if ($r !== t) throw new Error(`AUR0209`);
    Br.pop();
    $r = Br.length > 0 ? Br[Br.length - 1] : null;
    Lr = null != $r;
}

const Dr = Object.freeze({
    get current() {
        return $r;
    },
    get connecting() {
        return Lr;
    },
    enter: jr,
    exit: Ir,
    pause: Rr,
    resume: Pr
});

const Mr = Reflect.get;

const Fr = Object.prototype.toString;

const Vr = new WeakMap;

function Nr(t) {
    switch (Fr.call(t)) {
      case "[object Object]":
      case "[object Array]":
      case "[object Map]":
      case "[object Set]":
        return true;

      default:
        return false;
    }
}

const Kr = "__raw__";

function qr(t) {
    return Nr(t) ? Hr(t) : t;
}

function Hr(t) {
    var e;
    return null !== (e = Vr.get(t)) && void 0 !== e ? e : Wr(t);
}

function Qr(t) {
    var e;
    return null !== (e = t[Kr]) && void 0 !== e ? e : t;
}

function _r(t) {
    return Nr(t) && t[Kr] || t;
}

function zr(t) {
    return "constructor" === t || "__proto__" === t || "$observers" === t || t === Symbol.toPrimitive || t === Symbol.toStringTag;
}

function Wr(t) {
    const e = o(t) ? Zr : t instanceof Map || t instanceof Set ? xs : Gr;
    const r = new Proxy(t, e);
    Vr.set(t, r);
    return r;
}

const Gr = {
    get(t, e, r) {
        if (e === Kr) return t;
        const s = Tr();
        if (!Lr || zr(e) || null == s) return Mr(t, e, r);
        s.observe(t, e);
        return qr(Mr(t, e, r));
    }
};

const Zr = {
    get(t, e, r) {
        if (e === Kr) return t;
        const s = Tr();
        if (!Lr || zr(e) || null == s) return Mr(t, e, r);
        switch (e) {
          case "length":
            s.observe(t, "length");
            return t.length;

          case "map":
            return Jr;

          case "includes":
            return ts;

          case "indexOf":
            return es;

          case "lastIndexOf":
            return rs;

          case "every":
            return Xr;

          case "filter":
            return Yr;

          case "find":
            return is;

          case "findIndex":
            return ss;

          case "flat":
            return ns;

          case "flatMap":
            return os;

          case "join":
            return cs;

          case "push":
            return hs;

          case "pop":
            return us;

          case "reduce":
            return gs;

          case "reduceRight":
            return bs;

          case "reverse":
            return ds;

          case "shift":
            return as;

          case "unshift":
            return ls;

          case "slice":
            return ws;

          case "splice":
            return fs;

          case "some":
            return ps;

          case "sort":
            return vs;

          case "keys":
            return ks;

          case "values":
          case Symbol.iterator:
            return Cs;

          case "entries":
            return $s;
        }
        s.observe(t, e);
        return qr(Mr(t, e, r));
    },
    ownKeys(t) {
        var e;
        null === (e = Tr()) || void 0 === e ? void 0 : e.observe(t, "length");
        return Reflect.ownKeys(t);
    }
};

function Jr(t, e) {
    var r;
    const s = Qr(this);
    const i = s.map(((r, s) => _r(t.call(e, qr(r), s, this))));
    null === (r = Tr()) || void 0 === r ? void 0 : r.observeCollection(s);
    return qr(i);
}

function Xr(t, e) {
    var r;
    const s = Qr(this);
    const i = s.every(((r, s) => t.call(e, qr(r), s, this)));
    null === (r = Tr()) || void 0 === r ? void 0 : r.observeCollection(s);
    return i;
}

function Yr(t, e) {
    var r;
    const s = Qr(this);
    const i = s.filter(((r, s) => _r(t.call(e, qr(r), s, this))));
    null === (r = Tr()) || void 0 === r ? void 0 : r.observeCollection(s);
    return qr(i);
}

function ts(t) {
    var e;
    const r = Qr(this);
    const s = r.includes(_r(t));
    null === (e = Tr()) || void 0 === e ? void 0 : e.observeCollection(r);
    return s;
}

function es(t) {
    var e;
    const r = Qr(this);
    const s = r.indexOf(_r(t));
    null === (e = Tr()) || void 0 === e ? void 0 : e.observeCollection(r);
    return s;
}

function rs(t) {
    var e;
    const r = Qr(this);
    const s = r.lastIndexOf(_r(t));
    null === (e = Tr()) || void 0 === e ? void 0 : e.observeCollection(r);
    return s;
}

function ss(t, e) {
    var r;
    const s = Qr(this);
    const i = s.findIndex(((r, s) => _r(t.call(e, qr(r), s, this))));
    null === (r = Tr()) || void 0 === r ? void 0 : r.observeCollection(s);
    return i;
}

function is(t, e) {
    var r;
    const s = Qr(this);
    const i = s.find(((e, r) => t(qr(e), r, this)), e);
    null === (r = Tr()) || void 0 === r ? void 0 : r.observeCollection(s);
    return qr(i);
}

function ns() {
    var t;
    const e = Qr(this);
    null === (t = Tr()) || void 0 === t ? void 0 : t.observeCollection(e);
    return qr(e.flat());
}

function os(t, e) {
    var r;
    const s = Qr(this);
    null === (r = Tr()) || void 0 === r ? void 0 : r.observeCollection(s);
    return Hr(s.flatMap(((r, s) => qr(t.call(e, qr(r), s, this)))));
}

function cs(t) {
    var e;
    const r = Qr(this);
    null === (e = Tr()) || void 0 === e ? void 0 : e.observeCollection(r);
    return r.join(t);
}

function us() {
    return qr(Qr(this).pop());
}

function hs(...t) {
    return Qr(this).push(...t);
}

function as() {
    return qr(Qr(this).shift());
}

function ls(...t) {
    return Qr(this).unshift(...t);
}

function fs(...t) {
    return qr(Qr(this).splice(...t));
}

function ds(...t) {
    var e;
    const r = Qr(this);
    const s = r.reverse();
    null === (e = Tr()) || void 0 === e ? void 0 : e.observeCollection(r);
    return qr(s);
}

function ps(t, e) {
    var r;
    const s = Qr(this);
    const i = s.some(((r, s) => _r(t.call(e, qr(r), s, this))));
    null === (r = Tr()) || void 0 === r ? void 0 : r.observeCollection(s);
    return i;
}

function vs(t) {
    var e;
    const r = Qr(this);
    const s = r.sort(t);
    null === (e = Tr()) || void 0 === e ? void 0 : e.observeCollection(r);
    return qr(s);
}

function ws(t, e) {
    var r;
    const s = Qr(this);
    null === (r = Tr()) || void 0 === r ? void 0 : r.observeCollection(s);
    return Hr(s.slice(t, e));
}

function gs(t, e) {
    var r;
    const s = Qr(this);
    const i = s.reduce(((e, r, s) => t(e, qr(r), s, this)), e);
    null === (r = Tr()) || void 0 === r ? void 0 : r.observeCollection(s);
    return qr(i);
}

function bs(t, e) {
    var r;
    const s = Qr(this);
    const i = s.reduceRight(((e, r, s) => t(e, qr(r), s, this)), e);
    null === (r = Tr()) || void 0 === r ? void 0 : r.observeCollection(s);
    return qr(i);
}

const xs = {
    get(t, e, r) {
        if (e === Kr) return t;
        const s = Tr();
        if (!Lr || zr(e) || null == s) return Mr(t, e, r);
        switch (e) {
          case "size":
            s.observe(t, "size");
            return t.size;

          case "clear":
            return Ss;

          case "delete":
            return Os;

          case "forEach":
            return Es;

          case "add":
            if (t instanceof Set) return Us;
            break;

          case "get":
            if (t instanceof Map) return ms;
            break;

          case "set":
            if (t instanceof Map) return ys;
            break;

          case "has":
            return As;

          case "keys":
            return ks;

          case "values":
            return Cs;

          case "entries":
            return $s;

          case Symbol.iterator:
            return t instanceof Map ? $s : Cs;
        }
        return qr(Mr(t, e, r));
    }
};

function Es(t, e) {
    var r;
    const s = Qr(this);
    null === (r = Tr()) || void 0 === r ? void 0 : r.observeCollection(s);
    return s.forEach(((r, s) => {
        t.call(e, qr(r), qr(s), this);
    }));
}

function As(t) {
    var e;
    const r = Qr(this);
    null === (e = Tr()) || void 0 === e ? void 0 : e.observeCollection(r);
    return r.has(_r(t));
}

function ms(t) {
    var e;
    const r = Qr(this);
    null === (e = Tr()) || void 0 === e ? void 0 : e.observeCollection(r);
    return qr(r.get(_r(t)));
}

function ys(t, e) {
    return qr(Qr(this).set(_r(t), _r(e)));
}

function Us(t) {
    return qr(Qr(this).add(_r(t)));
}

function Ss() {
    return qr(Qr(this).clear());
}

function Os(t) {
    return qr(Qr(this).delete(_r(t)));
}

function ks() {
    var t;
    const e = Qr(this);
    null === (t = Tr()) || void 0 === t ? void 0 : t.observeCollection(e);
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
                value: qr(e),
                done: s
            };
        },
        [Symbol.iterator]() {
            return this;
        }
    };
}

function Cs() {
    var t;
    const e = Qr(this);
    null === (t = Tr()) || void 0 === t ? void 0 : t.observeCollection(e);
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
                value: qr(e),
                done: s
            };
        },
        [Symbol.iterator]() {
            return this;
        }
    };
}

function $s() {
    var t;
    const e = Qr(this);
    null === (t = Tr()) || void 0 === t ? void 0 : t.observeCollection(e);
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
                value: [ qr(e[0]), qr(e[1]) ],
                done: s
            };
        },
        [Symbol.iterator]() {
            return this;
        }
    };
}

const Bs = Object.freeze({
    getProxy: Hr,
    getRaw: Qr,
    wrap: qr,
    unwrap: _r,
    rawKey: Kr
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
    static create(t, e, r, i, n) {
        const o = r.get;
        const c = r.set;
        const u = new ComputedObserver(t, o, c, n, i);
        const h = () => u.getValue();
        h.getObserver = () => u;
        s(t, e, {
            enumerable: r.enumerable,
            configurable: true,
            get: h,
            set: t => {
                u.setValue(t, 0);
            }
        });
        return u;
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
        if (i(this.set)) {
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
        Ls = this.ov;
        this.ov = this.v;
        this.subs.notify(this.v, Ls, 0);
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
            jr(this);
            return this.v = _r(this.get.call(this.up ? qr(this.o) : this.o, this));
        } finally {
            this.obs.clear();
            this.ir = false;
            Ir(this);
        }
    }
}

se(ComputedObserver);

N(ComputedObserver);

_(ComputedObserver);

let Ls;

const Rs = t.DI.createInterface("IDirtyChecker", (t => t.singleton(DirtyChecker)));

const Ps = {
    timeoutsPerCheck: 25,
    disabled: false,
    throw: false,
    resetToDefault() {
        this.timeoutsPerCheck = 6;
        this.disabled = false;
        this.throw = false;
    }
};

const Ts = {
    persistent: true
};

class DirtyChecker {
    constructor(t) {
        this.p = t;
        this.tracked = [];
        this.O = null;
        this.C = 0;
        this.check = () => {
            if (Ps.disabled) return;
            if (++this.C < Ps.timeoutsPerCheck) return;
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
        if (Ps.throw) throw new Error(`AUR0222:${e}`);
        return new DirtyCheckProperty(this, t, e);
    }
    addProperty(t) {
        this.tracked.push(t);
        if (1 === this.tracked.length) this.O = this.p.taskQueue.queueTask(this.check, Ts);
    }
    removeProperty(t) {
        this.tracked.splice(this.tracked.indexOf(t), 1);
        if (0 === this.tracked.length) {
            this.O.cancel();
            this.O = null;
        }
    }
}

DirtyChecker.inject = [ t.IPlatform ];

_(DirtyChecker);

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

N(DirtyCheckProperty);

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

let js;

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
        js = this.ov;
        this.ov = this.v;
        this.subs.notify(this.v, js, this.f);
    }
    start() {
        if (false === this.iO) {
            this.iO = true;
            this.v = this.o[this.k];
            s(this.o, this.k, {
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
            s(this.o, this.k, {
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
        this.hs = i(r);
        const n = t[e];
        this.cb = i(n) ? n : void 0;
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
        js = this.ov;
        this.ov = this.v;
        this.subs.notify(this.v, js, this.f);
    }
}

N(SetterObserver);

N(SetterNotifier);

_(SetterObserver);

_(SetterNotifier);

const Is = new PropertyAccessor;

const Ds = t.DI.createInterface("IObserverLocator", (t => t.singleton(ObserverLocator)));

const Ms = t.DI.createInterface("INodeObserverLocator", (e => e.cachedCallback((e => {
    e.getAll(t.ILogger).forEach((t => {
        t.error("Using default INodeObserverLocator implementation. Will not be able to observe nodes (HTML etc...).");
    }));
    return new DefaultNodeObserverLocator;
}))));

class DefaultNodeObserverLocator {
    handles() {
        return false;
    }
    getObserver() {
        return Is;
    }
    getAccessor() {
        return Is;
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
        return Is;
    }
    getArrayObserver(t) {
        return xt(t);
    }
    getMapObserver(t) {
        return zt(t);
    }
    getSetObserver(t) {
        return Tt(t);
    }
    createObserver(e, s) {
        var i, n, c, u;
        if (!(e instanceof Object)) return new PrimitiveObserver(e, s);
        if (this.B.handles(e, s, this)) return this.B.getObserver(e, s, this);
        switch (s) {
          case "length":
            if (o(e)) return xt(e).getLengthObserver();
            break;

          case "size":
            if (e instanceof Map) return zt(e).getLengthObserver(); else if (e instanceof Set) return Tt(e).getLengthObserver();
            break;

          default:
            if (o(e) && t.isArrayIndex(s)) return xt(e).getIndexObserver(Number(s));
            break;
        }
        let h = Ns(e, s);
        if (void 0 === h) {
            let t = Vs(e);
            while (null !== t) {
                h = Ns(t, s);
                if (void 0 === h) t = Vs(t); else break;
            }
        }
        if (void 0 !== h && !r.call(h, "value")) {
            let t = this.P(e, s, h);
            if (null == t) t = null === (u = null !== (n = null === (i = h.get) || void 0 === i ? void 0 : i.getObserver) && void 0 !== n ? n : null === (c = h.set) || void 0 === c ? void 0 : c.getObserver) || void 0 === u ? void 0 : u(e, this);
            return null == t ? h.configurable ? ComputedObserver.create(e, s, h, this, true) : this.$.createProperty(e, s) : t;
        }
        return new SetterObserver(e, s);
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
            s(t, "$observers", {
                value: {
                    [e]: r
                }
            });
            return r;
        }
        return t.$observers[e] = r;
    }
}

ObserverLocator.inject = [ Rs, Ms ];

function Fs(t) {
    let e;
    if (o(t)) e = xt(t); else if (t instanceof Map) e = zt(t); else if (t instanceof Set) e = Tt(t);
    return e;
}

const Vs = Object.getPrototypeOf;

const Ns = Object.getOwnPropertyDescriptor;

const Ks = t.DI.createInterface("IObservation", (t => t.singleton(Observation)));

class Observation {
    constructor(t) {
        this.oL = t;
    }
    static get inject() {
        return [ Ds ];
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
            jr(this);
            this.fn(this);
        } finally {
            this.obs.clear();
            this.running = false;
            Ir(this);
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

se(Effect);

function qs(t) {
    if (void 0 === t.$observers) s(t, "$observers", {
        value: {}
    });
    return t.$observers;
}

const Hs = {};

function Qs(t, e, r) {
    if (null == e) return (e, r, s) => i(e, r, s, t);
    return i(t, e, r);
    function i(t, e, r, i) {
        var n;
        const o = void 0 === e;
        i = "object" !== typeof i ? {
            name: i
        } : i || {};
        if (o) e = i.name;
        if (null == e || "" === e) throw new Error(`AUR0224`);
        const c = i.callback || `${String(e)}Changed`;
        let u = Hs;
        if (r) {
            delete r.value;
            delete r.writable;
            u = null === (n = r.initializer) || void 0 === n ? void 0 : n.call(r);
            delete r.initializer;
        } else r = {
            configurable: true
        };
        if (!("enumerable" in r)) r.enumerable = true;
        const h = i.set;
        r.get = function t() {
            var r;
            const s = _s(this, e, c, u, h);
            null === (r = Tr()) || void 0 === r ? void 0 : r.subscribeTo(s);
            return s.getValue();
        };
        r.set = function t(r) {
            _s(this, e, c, u, h).setValue(r, 0);
        };
        r.get.getObserver = function t(r) {
            return _s(r, e, c, u, h);
        };
        if (o) s(t.prototype, e, r); else return r;
    }
}

function _s(t, e, r, s, i) {
    const n = qs(t);
    let o = n[e];
    if (null == o) {
        o = new SetterNotifier(t, r, i, s === Hs ? void 0 : s);
        n[e] = o;
    }
    return o;
}

exports.AccessKeyedExpression = AccessKeyedExpression;

exports.AccessMemberExpression = AccessMemberExpression;

exports.AccessScopeExpression = AccessScopeExpression;

exports.AccessThisExpression = AccessThisExpression;

exports.ArrayBindingPattern = ArrayBindingPattern;

exports.ArrayIndexObserver = ArrayIndexObserver;

exports.ArrayLiteralExpression = ArrayLiteralExpression;

exports.ArrayObserver = ArrayObserver;

exports.ArrowFunction = ArrowFunction;

exports.AssignExpression = AssignExpression;

exports.BinaryExpression = BinaryExpression;

exports.BindingBehavior = y;

exports.BindingBehaviorDefinition = BindingBehaviorDefinition;

exports.BindingBehaviorExpression = BindingBehaviorExpression;

exports.BindingBehaviorFactory = BindingBehaviorFactory;

exports.BindingContext = BindingContext;

exports.BindingIdentifier = BindingIdentifier;

exports.BindingInterceptor = BindingInterceptor;

exports.BindingMediator = BindingMediator;

exports.BindingObserverRecord = BindingObserverRecord;

exports.CallFunctionExpression = CallFunctionExpression;

exports.CallMemberExpression = CallMemberExpression;

exports.CallScopeExpression = CallScopeExpression;

exports.CollectionLengthObserver = CollectionLengthObserver;

exports.CollectionSizeObserver = CollectionSizeObserver;

exports.ComputedObserver = ComputedObserver;

exports.ConditionalExpression = ConditionalExpression;

exports.ConnectableSwitcher = Dr;

exports.CustomExpression = CustomExpression;

exports.DestructuringAssignmentExpression = DestructuringAssignmentExpression;

exports.DestructuringAssignmentRestExpression = DestructuringAssignmentRestExpression;

exports.DestructuringAssignmentSingleExpression = DestructuringAssignmentSingleExpression;

exports.DirtyCheckProperty = DirtyCheckProperty;

exports.DirtyCheckSettings = Ps;

exports.FlushQueue = FlushQueue;

exports.ForOfStatement = ForOfStatement;

exports.HtmlLiteralExpression = HtmlLiteralExpression;

exports.ICoercionConfiguration = j;

exports.IDirtyChecker = Rs;

exports.IExpressionParser = ie;

exports.INodeObserverLocator = Ms;

exports.IObservation = Ks;

exports.IObserverLocator = Ds;

exports.ISignaler = b;

exports.Interpolation = Interpolation;

exports.MapObserver = MapObserver;

exports.ObjectBindingPattern = ObjectBindingPattern;

exports.ObjectLiteralExpression = ObjectLiteralExpression;

exports.Observation = Observation;

exports.ObserverLocator = ObserverLocator;

exports.OverrideContext = OverrideContext;

exports.PrimitiveLiteralExpression = PrimitiveLiteralExpression;

exports.PrimitiveObserver = PrimitiveObserver;

exports.PropertyAccessor = PropertyAccessor;

exports.ProxyObservable = Bs;

exports.Scope = Scope;

exports.SetObserver = SetObserver;

exports.SetterObserver = SetterObserver;

exports.SubscriberRecord = SubscriberRecord;

exports.TaggedTemplateExpression = TaggedTemplateExpression;

exports.TemplateExpression = TemplateExpression;

exports.UnaryExpression = UnaryExpression;

exports.ValueConverter = k;

exports.ValueConverterDefinition = ValueConverterDefinition;

exports.ValueConverterExpression = ValueConverterExpression;

exports.alias = w;

exports.applyMutationsToIndices = Et;

exports.bindingBehavior = x;

exports.cloneIndexMap = F;

exports.connectable = se;

exports.copyIndexMap = D;

exports.createIndexMap = M;

exports.disableArrayObservation = bt;

exports.disableMapObservation = _t;

exports.disableSetObservation = Pt;

exports.enableArrayObservation = gt;

exports.enableMapObservation = Qt;

exports.enableSetObservation = Rt;

exports.getCollectionObserver = Fs;

exports.isIndexMap = V;

exports.observable = Qs;

exports.parseExpression = Se;

exports.registerAliases = g;

exports.subscriberCollection = N;

exports.synchronizeIndices = At;

exports.valueConverter = U;

exports.withFlushQueue = _;
//# sourceMappingURL=index.cjs.map
