import { DI as t, IEventAggregator as n, toArray as i, camelCase as s, Registration as e } from "../../../kernel/dist/native-modules/index.mjs";

import { CustomElement as r, attributePattern as o, bindingCommand as a, renderer as h, AttrSyntax as l, IAttrMapper as c, IPlatform as u, AttributePattern as d, BindingCommand as f, AppTask as m } from "../../../runtime-html/dist/native-modules/index.mjs";

import { ValueConverterExpression as g, bindingBehavior as p, ISignaler as v, valueConverter as b, connectable as T, CustomExpression as B, Interpolation as w, BindingMode as y, IExpressionParser as C, IObserverLocator as I } from "../../../runtime/dist/native-modules/index.mjs";

import x from "i18next";

function P(t, n, i, s) {
    var e = arguments.length, r = e < 3 ? n : null === s ? s = Object.getOwnPropertyDescriptor(n, i) : s, o;
    if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(t, n, i, s); else for (var a = t.length - 1; a >= 0; a--) if (o = t[a]) r = (e < 3 ? o(r) : e > 3 ? o(n, i, r) : o(n, i)) || r;
    return e > 3 && r && Object.defineProperty(n, i, r), r;
}

function M(t, n) {
    return function(i, s) {
        n(i, s, t);
    };
}

var A;

(function(t) {
    t["I18N_EA_CHANNEL"] = "i18n:locale:changed";
    t["I18N_SIGNAL"] = "aurelia-translation-signal";
    t["RT_SIGNAL"] = "aurelia-relativetime-signal";
})(A || (A = {}));

var L;

(function(t) {
    t["translationValueConverterName"] = "t";
    t["dateFormatValueConverterName"] = "df";
    t["numberFormatValueConverterName"] = "nf";
    t["relativeTimeValueConverterName"] = "rt";
})(L || (L = {}));

function R(t, n) {
    const i = n.sourceExpression.expression;
    if (!(i instanceof g)) {
        const s = new g(i, t, n.sourceExpression.args);
        n.sourceExpression.expression = s;
    }
}

let k = class DateFormatBindingBehavior {
    bind(t, n, i) {
        R("df", i);
    }
};

k = P([ p("df") ], k);

const E = t.createInterface("I18nInitOptions");

const N = t.createInterface("I18nextWrapper");

class I18nextWrapper {
    constructor() {
        this.i18next = x;
    }
}

var $;

(function(t) {
    t[t["Second"] = 1e3] = "Second";
    t[t["Minute"] = 6e4] = "Minute";
    t[t["Hour"] = 36e5] = "Hour";
    t[t["Day"] = 864e5] = "Day";
    t[t["Week"] = 6048e5] = "Week";
    t[t["Month"] = 2592e6] = "Month";
    t[t["Year"] = 31536e6] = "Year";
})($ || ($ = {}));

class I18nKeyEvaluationResult {
    constructor(t) {
        this.value = void 0;
        const n = /\[([a-z\-, ]*)\]/gi;
        this.attributes = [];
        const i = n.exec(t);
        if (i) {
            t = t.replace(i[0], "");
            this.attributes = i[1].split(",");
        }
        this.key = t;
    }
}

const O = t.createInterface("I18N");

let V = class I18nService {
    constructor(t, n, i, s) {
        this.ea = i;
        this.i = new Set;
        this.i18next = t.i18next;
        this.initPromise = this.h(n);
        this.u = s;
    }
    evaluate(t, n) {
        const i = t.split(";");
        const s = [];
        for (const t of i) {
            const i = new I18nKeyEvaluationResult(t);
            const e = i.key;
            const r = this.tr(e, n);
            if (this.options.skipTranslationOnMissingKey && r === e) console.warn(`Couldn't find translation for key: ${e}`); else {
                i.value = r;
                s.push(i);
            }
        }
        return s;
    }
    tr(t, n) {
        return this.i18next.t(t, n);
    }
    getLocale() {
        return this.i18next.language;
    }
    async setLocale(t) {
        const n = this.getLocale();
        const i = {
            oldLocale: n,
            newLocale: t
        };
        await this.i18next.changeLanguage(t);
        this.ea.publish("i18n:locale:changed", i);
        this.i.forEach((t => t.handleLocaleChange(i)));
        this.u.dispatchSignal("aurelia-translation-signal");
    }
    createNumberFormat(t, n) {
        return Intl.NumberFormat(n || this.getLocale(), t);
    }
    nf(t, n, i) {
        return this.createNumberFormat(n, i).format(t);
    }
    createDateTimeFormat(t, n) {
        return Intl.DateTimeFormat(n || this.getLocale(), t);
    }
    df(t, n, i) {
        return this.createDateTimeFormat(n, i).format(t);
    }
    uf(t, n) {
        const i = this.nf(1e4 / 3, void 0, n);
        let s = i[1];
        const e = i[5];
        if ("." === s) s = "\\.";
        const r = t.replace(new RegExp(s, "g"), "").replace(/[^\d.,-]/g, "").replace(e, ".");
        return Number(r);
    }
    createRelativeTimeFormat(t, n) {
        return new Intl.RelativeTimeFormat(n || this.getLocale(), t);
    }
    rt(t, n, i) {
        let s = t.getTime() - this.now();
        const e = this.options.rtEpsilon * (s > 0 ? 1 : 0);
        const r = this.createRelativeTimeFormat(n, i);
        let o = s / 31536e6;
        if (Math.abs(o + e) >= 1) return r.format(Math.round(o), "year");
        o = s / 2592e6;
        if (Math.abs(o + e) >= 1) return r.format(Math.round(o), "month");
        o = s / 6048e5;
        if (Math.abs(o + e) >= 1) return r.format(Math.round(o), "week");
        o = s / 864e5;
        if (Math.abs(o + e) >= 1) return r.format(Math.round(o), "day");
        o = s / 36e5;
        if (Math.abs(o + e) >= 1) return r.format(Math.round(o), "hour");
        o = s / 6e4;
        if (Math.abs(o + e) >= 1) return r.format(Math.round(o), "minute");
        s = Math.abs(s) < 1e3 ? 1e3 : s;
        o = s / 1e3;
        return r.format(Math.round(o), "second");
    }
    subscribeLocaleChange(t) {
        this.i.add(t);
    }
    now() {
        return (new Date).getTime();
    }
    async h(t) {
        const n = {
            lng: "en",
            fallbackLng: [ "en" ],
            debug: false,
            plugins: [],
            rtEpsilon: .01,
            skipTranslationOnMissingKey: false
        };
        this.options = {
            ...n,
            ...t
        };
        for (const t of this.options.plugins) this.i18next.use(t);
        await this.i18next.init(this.options);
    }
};

V = P([ M(0, N), M(1, E), M(2, n), M(3, v) ], V);

let _ = class DateFormatValueConverter {
    constructor(t) {
        this.i18n = t;
        this.signals = [ "aurelia-translation-signal" ];
    }
    toView(t, n, i) {
        if (!t && 0 !== t || "string" === typeof t && "" === t.trim()) return t;
        if ("string" === typeof t) {
            const n = Number(t);
            const i = new Date(Number.isInteger(n) ? n : t);
            if (isNaN(i.getTime())) return t;
            t = i;
        }
        return this.i18n.df(t, n, i);
    }
};

_ = P([ b("df"), M(0, O) ], _);

let D = class NumberFormatBindingBehavior {
    bind(t, n, i) {
        R("nf", i);
    }
};

D = P([ p("nf") ], D);

let F = class NumberFormatValueConverter {
    constructor(t) {
        this.i18n = t;
        this.signals = [ "aurelia-translation-signal" ];
    }
    toView(t, n, i) {
        if ("number" !== typeof t) return t;
        return this.i18n.nf(t, n, i);
    }
};

F = P([ b("nf"), M(0, O) ], F);

let j = class RelativeTimeBindingBehavior {
    bind(t, n, i) {
        R("rt", i);
    }
};

j = P([ p("rt") ], j);

let K = class RelativeTimeValueConverter {
    constructor(t) {
        this.i18n = t;
        this.signals = [ "aurelia-translation-signal", "aurelia-relativetime-signal" ];
    }
    toView(t, n, i) {
        if (!(t instanceof Date)) return t;
        return this.i18n.rt(t, n, i);
    }
};

K = P([ b("rt"), M(0, O) ], K);

let S = class TranslationBindingBehavior {
    bind(t, n, i) {
        const s = i.sourceExpression.expression;
        if (!(s instanceof g)) {
            const t = new g(s, "t", i.sourceExpression.args);
            i.sourceExpression.expression = t;
        }
    }
};

S = P([ p("t") ], S);

const W = [ "textContent", "innerHTML", "prepend", "append" ];

const z = new Map([ [ "text", "textContent" ], [ "html", "innerHTML" ] ]);

const H = {
    optional: true
};

const U = {
    reusable: false,
    preempt: true
};

class TranslationBinding {
    constructor(t, n, i, s) {
        this.locator = i;
        this.interceptor = this;
        this.isBound = false;
        this.T = W;
        this.task = null;
        this.parameter = null;
        this.target = t;
        this.i18n = this.locator.get(O);
        this.platform = s;
        this.B = new Set;
        this.oL = n;
        this.i18n.subscribeLocaleChange(this);
    }
    static create({parser: t, observerLocator: n, context: i, controller: s, target: e, instruction: r, platform: o, isParameterContext: a}) {
        const h = this.getBinding({
            observerLocator: n,
            context: i,
            controller: s,
            target: e,
            platform: o
        });
        const l = "string" === typeof r.from ? t.parse(r.from, 8) : r.from;
        if (a) h.useParameter(l); else {
            const n = l instanceof B ? t.parse(l.value, 1) : void 0;
            h.expr = n || l;
        }
    }
    static getBinding({observerLocator: t, context: n, controller: i, target: s, platform: e}) {
        let r = i.bindings && i.bindings.find((t => t instanceof TranslationBinding && t.target === s));
        if (!r) {
            r = new TranslationBinding(s, t, n, e);
            i.addBinding(r);
        }
        return r;
    }
    $bind(t, n) {
        var i;
        if (!this.expr) throw new Error("key expression is missing");
        this.scope = n;
        this.C = this.expr instanceof w;
        this.I = this.expr.evaluate(t, n, this.locator, this);
        this.P();
        null === (i = this.parameter) || void 0 === i ? void 0 : i.$bind(t, n);
        this.M(t);
        this.isBound = true;
    }
    $unbind(t) {
        var n;
        if (!this.isBound) return;
        if (this.expr.hasUnbind) this.expr.unbind(t, this.scope, this);
        null === (n = this.parameter) || void 0 === n ? void 0 : n.$unbind(t);
        this.B.clear();
        if (null !== this.task) {
            this.task.cancel();
            this.task = null;
        }
        this.scope = void 0;
        this.obs.clearAll();
    }
    handleChange(t, n, i) {
        this.obs.version++;
        this.I = this.C ? this.expr.evaluate(i, this.scope, this.locator, this) : t;
        this.obs.clear();
        this.P();
        this.M(i);
    }
    handleLocaleChange() {
        this.M(0);
    }
    useParameter(t) {
        if (null != this.parameter) throw new Error("This translation parameter has already been specified.");
        this.parameter = new ParameterBinding(this, t, (t => this.M(t)));
    }
    M(t) {
        var n;
        const i = this.i18n.evaluate(this.I, null === (n = this.parameter) || void 0 === n ? void 0 : n.value);
        const s = Object.create(null);
        const e = [];
        const o = this.task;
        this.B.clear();
        for (const n of i) {
            const i = n.value;
            const o = this.A(n.attributes);
            for (const n of o) if (this.L(n)) s[n] = i; else {
                const s = r.for(this.target, H);
                const o = (null === s || void 0 === s ? void 0 : s.viewModel) ? this.oL.getAccessor(s.viewModel, n) : this.oL.getAccessor(this.target, n);
                const a = 0 === (2 & t) && (4 & o.type) > 0;
                if (a) e.push(new AccessorUpdateTask(o, i, t, this.target, n)); else o.setValue(i, t, this.target, n);
                this.B.add(o);
            }
        }
        let a = false;
        if (Object.keys(s).length > 0) {
            a = 0 === (2 & t);
            if (!a) this.R(s, t);
        }
        if (e.length > 0 || a) this.task = this.platform.domWriteQueue.queueTask((() => {
            this.task = null;
            for (const t of e) t.run();
            if (a) this.R(s, t);
        }), U);
        null === o || void 0 === o ? void 0 : o.cancel();
    }
    A(t) {
        if (0 === t.length) t = "IMG" === this.target.tagName ? [ "src" ] : [ "textContent" ];
        for (const [n, i] of z) {
            const s = t.findIndex((t => t === n));
            if (s > -1) t.splice(s, 1, i);
        }
        return t;
    }
    L(t) {
        return this.T.includes(t);
    }
    R(t, n) {
        const s = i(this.target.childNodes);
        const e = [];
        const r = "au-i18n";
        for (const t of s) if (!Reflect.get(t, r)) e.push(t);
        const o = this.N(t, r, e);
        this.target.innerHTML = "";
        for (const t of i(o.content.childNodes)) this.target.appendChild(t);
    }
    N(t, n, i) {
        var s;
        const e = this.platform.document.createElement("template");
        this.$(e, t.prepend, n);
        if (!this.$(e, null !== (s = t.innerHTML) && void 0 !== s ? s : t.textContent, n)) for (const t of i) e.content.append(t);
        this.$(e, t.append, n);
        return e;
    }
    $(t, n, s) {
        if (void 0 !== n && null !== n) {
            const e = this.platform.document.createElement("div");
            e.innerHTML = n;
            for (const n of i(e.childNodes)) {
                Reflect.set(n, s, true);
                t.content.append(n);
            }
            return true;
        }
        return false;
    }
    P() {
        var t;
        const n = null !== (t = this.I) && void 0 !== t ? t : this.I = "";
        const i = typeof n;
        if ("string" !== i) throw new Error(`Expected the i18n key to be a string, but got ${n} of type ${i}`);
    }
}

class AccessorUpdateTask {
    constructor(t, n, i, s, e) {
        this.accessor = t;
        this.v = n;
        this.f = i;
        this.el = s;
        this.attr = e;
    }
    run() {
        this.accessor.setValue(this.v, this.f, this.el, this.attr);
    }
}

class ParameterBinding {
    constructor(t, n, i) {
        this.owner = t;
        this.expr = n;
        this.updater = i;
        this.interceptor = this;
        this.isBound = false;
        this.oL = t.oL;
        this.locator = t.locator;
    }
    handleChange(t, n, i) {
        if (!this.isBound) return;
        this.obs.version++;
        this.value = this.expr.evaluate(i, this.scope, this.locator, this);
        this.obs.clear();
        this.updater(i);
    }
    $bind(t, n) {
        if (this.isBound) return;
        this.scope = n;
        if (this.expr.hasBind) this.expr.bind(t, n, this);
        this.value = this.expr.evaluate(t, n, this.locator, this);
        this.isBound = true;
    }
    $unbind(t) {
        if (!this.isBound) return;
        if (this.expr.hasUnbind) this.expr.unbind(t, this.scope, this);
        this.scope = void 0;
        this.obs.clearAll();
    }
}

T(TranslationBinding);

T(ParameterBinding);

const G = "tpt";

const Y = "t-params.bind";

let q = class TranslationParametersAttributePattern {
    [Y](t, n, i) {
        return new l(t, n, "", Y);
    }
};

q = P([ o({
    pattern: Y,
    symbols: ""
}) ], q);

class TranslationParametersBindingInstruction {
    constructor(t, n) {
        this.from = t;
        this.to = n;
        this.type = G;
        this.mode = y.toView;
    }
}

let J = class TranslationParametersBindingCommand {
    constructor(t, n) {
        this.type = 0;
        this.m = t;
        this.ep = n;
    }
    get name() {
        return Y;
    }
    build(t) {
        var n;
        const i = t.attr;
        let e = i.target;
        if (null == t.bindable) e = null !== (n = this.m.map(t.node, e)) && void 0 !== n ? n : s(e); else e = t.bindable.property;
        return new TranslationParametersBindingInstruction(this.ep.parse(i.rawValue, 8), e);
    }
};

J.inject = [ c, C ];

J = P([ a(Y) ], J);

let Q = class TranslationParametersBindingRenderer {
    constructor(t, n, i) {
        this.ep = t;
        this.oL = n;
        this.p = i;
    }
    render(t, n, i) {
        TranslationBinding.create({
            parser: this.ep,
            observerLocator: this.oL,
            context: t.container,
            controller: t,
            target: n,
            instruction: i,
            isParameterContext: true,
            platform: this.p
        });
    }
};

Q.inject = [ C, I, u ];

Q = P([ h(G) ], Q);

const X = "tt";

class TranslationAttributePattern {
    static registerAlias(t) {
        this.prototype[t] = function(n, i, s) {
            return new l(n, i, "", t);
        };
    }
}

class TranslationBindingInstruction {
    constructor(t, n) {
        this.from = t;
        this.to = n;
        this.type = X;
        this.mode = y.toView;
    }
}

class TranslationBindingCommand {
    constructor(t) {
        this.type = 0;
        this.m = t;
    }
    get name() {
        return "t";
    }
    build(t) {
        var n;
        let i;
        if (null == t.bindable) i = null !== (n = this.m.map(t.node, t.attr.target)) && void 0 !== n ? n : s(t.attr.target); else i = t.bindable.property;
        return new TranslationBindingInstruction(new B(t.attr.rawValue), i);
    }
}

TranslationBindingCommand.inject = [ c ];

let Z = class TranslationBindingRenderer {
    constructor(t, n, i) {
        this.ep = t;
        this.oL = n;
        this.p = i;
    }
    render(t, n, i) {
        TranslationBinding.create({
            parser: this.ep,
            observerLocator: this.oL,
            context: t.container,
            controller: t,
            target: n,
            instruction: i,
            platform: this.p
        });
    }
};

Z.inject = [ C, I, u ];

Z = P([ h(X) ], Z);

const tt = "tbt";

class TranslationBindAttributePattern {
    static registerAlias(t) {
        const n = `${t}.bind`;
        this.prototype[n] = function(t, i, s) {
            return new l(t, i, s[1], n);
        };
    }
}

class TranslationBindBindingInstruction {
    constructor(t, n) {
        this.from = t;
        this.to = n;
        this.type = tt;
        this.mode = y.toView;
    }
}

class TranslationBindBindingCommand {
    constructor(t, n) {
        this.type = 0;
        this.m = t;
        this.ep = n;
    }
    get name() {
        return "t-bind";
    }
    build(t) {
        var n;
        let i;
        if (null == t.bindable) i = null !== (n = this.m.map(t.node, t.attr.target)) && void 0 !== n ? n : s(t.attr.target); else i = t.bindable.property;
        return new TranslationBindBindingInstruction(this.ep.parse(t.attr.rawValue, 8), i);
    }
}

TranslationBindBindingCommand.inject = [ c, C ];

let nt = class TranslationBindBindingRenderer {
    constructor(t, n, i) {
        this.parser = t;
        this.oL = n;
        this.p = i;
    }
    render(t, n, i) {
        TranslationBinding.create({
            parser: this.parser,
            observerLocator: this.oL,
            context: t.container,
            controller: t,
            target: n,
            instruction: i,
            platform: this.p
        });
    }
};

nt = P([ h(tt), M(0, C), M(1, I), M(2, u) ], nt);

let it = class TranslationValueConverter {
    constructor(t) {
        this.i18n = t;
        this.signals = [ "aurelia-translation-signal" ];
    }
    toView(t, n) {
        return this.i18n.tr(t, n);
    }
};

it = P([ b("t"), M(0, O) ], it);

const st = [ it, S ];

function et(t) {
    const n = t.translationAttributeAliases;
    const i = Array.isArray(n) ? n : [ "t" ];
    const s = [];
    const r = [];
    const o = [];
    const a = [];
    for (const t of i) {
        const n = `${t}.bind`;
        s.push({
            pattern: t,
            symbols: ""
        });
        TranslationAttributePattern.registerAlias(t);
        r.push({
            pattern: n,
            symbols: "."
        });
        TranslationBindAttributePattern.registerAlias(t);
        if ("t" !== t) {
            o.push(t);
            a.push(n);
        }
    }
    const h = [ d.define(s, TranslationAttributePattern), f.define({
        name: "t",
        aliases: o
    }, TranslationBindingCommand), Z, d.define(r, TranslationBindAttributePattern), f.define({
        name: "t.bind",
        aliases: a
    }, TranslationBindBindingCommand), nt, q, J, Q ];
    return {
        register(n) {
            return n.register(e.callback(E, (() => t.initOptions)), m.activating(O, (t => t.initPromise)), e.singleton(N, I18nextWrapper), e.singleton(O, V), ...h, ...st);
        }
    };
}

const rt = [ _, k ];

const ot = [ F, D ];

const at = [ K, j ];

function ht(t) {
    return {
        optionsProvider: t,
        register(n) {
            const i = {
                initOptions: Object.create(null)
            };
            t(i);
            return n.register(et(i), ...rt, ...ot, ...at);
        },
        customize(n) {
            return ht(n || t);
        }
    };
}

const lt = ht((() => {}));

export { k as DateFormatBindingBehavior, _ as DateFormatValueConverter, O as I18N, lt as I18nConfiguration, E as I18nInitOptions, I18nKeyEvaluationResult, V as I18nService, D as NumberFormatBindingBehavior, F as NumberFormatValueConverter, j as RelativeTimeBindingBehavior, K as RelativeTimeValueConverter, A as Signals, TranslationAttributePattern, TranslationBindAttributePattern, TranslationBindBindingCommand, TranslationBindBindingInstruction, nt as TranslationBindBindingRenderer, tt as TranslationBindInstructionType, TranslationBinding, S as TranslationBindingBehavior, TranslationBindingCommand, TranslationBindingInstruction, Z as TranslationBindingRenderer, X as TranslationInstructionType, q as TranslationParametersAttributePattern, J as TranslationParametersBindingCommand, TranslationParametersBindingInstruction, Q as TranslationParametersBindingRenderer, G as TranslationParametersInstructionType, it as TranslationValueConverter };

