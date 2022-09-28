import { Metadata as t, applyMetadataPolyfill as e, isObject as n } from "@aurelia/metadata";

const r = String;

const i = t.getOwn;

const s = t.hasOwn;

const o = t.define;

const u = t => "function" === typeof t;

const l = t => "string" === typeof t;

const c = () => Object.create(null);

const f = {};

function a(t) {
    switch (typeof t) {
      case "number":
        return t >= 0 && (0 | t) === t;

      case "string":
        {
            const e = f[t];
            if (void 0 !== e) return e;
            const n = t.length;
            if (0 === n) return f[t] = false;
            let r = 0;
            let i = 0;
            for (;i < n; ++i) {
                r = t.charCodeAt(i);
                if (0 === i && 48 === r && n > 1 || r < 48 || r > 57) return f[t] = false;
            }
            return f[t] = true;
        }

      default:
        return false;
    }
}

const h = function() {
    let t;
    (function(t) {
        t[t["none"] = 0] = "none";
        t[t["digit"] = 1] = "digit";
        t[t["upper"] = 2] = "upper";
        t[t["lower"] = 3] = "lower";
    })(t || (t = {}));
    const e = Object.assign(c(), {
        0: true,
        1: true,
        2: true,
        3: true,
        4: true,
        5: true,
        6: true,
        7: true,
        8: true,
        9: true
    });
    function n(t) {
        if ("" === t) return 0;
        if (t !== t.toUpperCase()) return 3;
        if (t !== t.toLowerCase()) return 2;
        if (true === e[t]) return 1;
        return 0;
    }
    return function(t, e) {
        const r = t.length;
        if (0 === r) return t;
        let i = false;
        let s = "";
        let o;
        let u = "";
        let l = 0;
        let c = t.charAt(0);
        let f = n(c);
        let a = 0;
        for (;a < r; ++a) {
            o = l;
            u = c;
            l = f;
            c = t.charAt(a + 1);
            f = n(c);
            if (0 === l) {
                if (s.length > 0) i = true;
            } else {
                if (!i && s.length > 0 && 2 === l) i = 3 === o || 3 === f;
                s += e(u, i);
                i = false;
            }
        }
        return s;
    };
}();

const d = function() {
    const t = c();
    function e(t, e) {
        return e ? t.toUpperCase() : t.toLowerCase();
    }
    return function(n) {
        let r = t[n];
        if (void 0 === r) r = t[n] = h(n, e);
        return r;
    };
}();

const v = function() {
    const t = c();
    return function(e) {
        let n = t[e];
        if (void 0 === n) {
            n = d(e);
            if (n.length > 0) n = n[0].toUpperCase() + n.slice(1);
            t[e] = n;
        }
        return n;
    };
}();

const w = function() {
    const t = c();
    function e(t, e) {
        return e ? `-${t.toLowerCase()}` : t.toLowerCase();
    }
    return function(n) {
        let r = t[n];
        if (void 0 === r) r = t[n] = h(n, e);
        return r;
    };
}();

function g(t) {
    const e = t.length;
    const n = Array(e);
    let r = 0;
    for (;r < e; ++r) n[r] = t[r];
    return n;
}

function p(t, e, n) {
    return {
        configurable: true,
        enumerable: n.enumerable,
        get() {
            const t = n.value.bind(this);
            Reflect.defineProperty(this, e, {
                value: t,
                writable: true,
                configurable: true,
                enumerable: n.enumerable
            });
            return t;
        }
    };
}

function R(...t) {
    const e = [];
    let n = 0;
    const r = t.length;
    let i = 0;
    let s;
    let o = 0;
    for (;o < r; ++o) {
        s = t[o];
        if (void 0 !== s) {
            i = s.length;
            let t = 0;
            for (;t < i; ++t) e[n++] = s[t];
        }
    }
    return e;
}

function m(...t) {
    const e = t.length;
    let n;
    let r = 0;
    for (;e > r; ++r) {
        n = t[r];
        if (void 0 !== n) return n;
    }
    throw new Error(`No default value found`);
}

const y = function() {
    const t = Function.prototype;
    const e = Object.getPrototypeOf;
    const n = new WeakMap;
    let r = t;
    let i = 0;
    let s;
    return function(o) {
        s = n.get(o);
        if (void 0 === s) {
            n.set(o, s = [ r = o ]);
            i = 0;
            while ((r = e(r)) !== t) s[++i] = r;
        }
        return s;
    };
}();

function b(...t) {
    return Object.assign(c(), ...t);
}

const $ = function() {
    const t = new WeakMap;
    let e = false;
    let n = "";
    let r = 0;
    return function(i) {
        e = t.get(i);
        if (void 0 === e) {
            n = i.toString();
            r = n.length;
            e = r >= 29 && r <= 100 && 125 === n.charCodeAt(r - 1) && n.charCodeAt(r - 2) <= 32 && 93 === n.charCodeAt(r - 3) && 101 === n.charCodeAt(r - 4) && 100 === n.charCodeAt(r - 5) && 111 === n.charCodeAt(r - 6) && 99 === n.charCodeAt(r - 7) && 32 === n.charCodeAt(r - 8) && 101 === n.charCodeAt(r - 9) && 118 === n.charCodeAt(r - 10) && 105 === n.charCodeAt(r - 11) && 116 === n.charCodeAt(r - 12) && 97 === n.charCodeAt(r - 13) && 110 === n.charCodeAt(r - 14) && 88 === n.charCodeAt(r - 15);
            t.set(i, e);
        }
        return e;
    };
}();

function C(t, e) {
    if (t instanceof Promise) return t.then(e);
    return e(t);
}

function E(...t) {
    let e;
    let n;
    let r;
    let i = 0;
    let s = t.length;
    for (;i < s; ++i) {
        e = t[i];
        if ((e = t[i]) instanceof Promise) if (void 0 === n) n = e; else if (void 0 === r) r = [ n, e ]; else r.push(e);
    }
    if (void 0 === r) return n;
    return Promise.all(r);
}

const A = "au:annotation";

const j = (t, e) => {
    if (void 0 === e) return `${A}:${t}`;
    return `${A}:${t}:${e}`;
};

const I = (t, e) => {
    const n = i(A, t);
    if (void 0 === n) o(A, [ e ], t); else n.push(e);
};

const O = Object.freeze({
    name: "au:annotation",
    appendTo: I,
    set(t, e, n) {
        o(j(e), n, t);
    },
    get: (t, e) => i(j(e), t),
    getKeys(t) {
        let e = i(A, t);
        if (void 0 === e) o(A, e = [], t);
        return e;
    },
    isKey: t => t.startsWith(A),
    keyFor: j
});

const M = "au:resource";

const k = Object.freeze({
    name: M,
    appendTo(t, e) {
        const n = i(M, t);
        if (void 0 === n) o(M, [ e ], t); else n.push(e);
    },
    has: t => s(M, t),
    getAll(t) {
        const e = i(M, t);
        if (void 0 === e) return Ut; else return e.map((e => i(e, t)));
    },
    getKeys(t) {
        let e = i(M, t);
        if (void 0 === e) o(M, e = [], t);
        return e;
    },
    isKey: t => t.startsWith(M),
    keyFor(t, e) {
        if (void 0 === e) return `${M}:${t}`;
        return `${M}:${t}:${e}`;
    }
});

const F = {
    annotation: O,
    resource: k
};

const L = Object.prototype.hasOwnProperty;

function U(t, e, n, r) {
    let s = i(j(t), n);
    if (void 0 === s) {
        s = e[t];
        if (void 0 === s) {
            s = n[t];
            if (void 0 === s || !L.call(n, t)) return r();
            return s;
        }
        return s;
    }
    return s;
}

function T(t, e, n) {
    let r = i(j(t), e);
    if (void 0 === r) {
        r = e[t];
        if (void 0 === r || !L.call(e, t)) return n();
        return r;
    }
    return r;
}

function P(t, e, n) {
    const r = e[t];
    if (void 0 === r) return n();
    return r;
}

e(Reflect, false, false);

class ResolverBuilder {
    constructor(t, e) {
        this.c = t;
        this.k = e;
    }
    instance(t) {
        return this.t(0, t);
    }
    singleton(t) {
        return this.t(1, t);
    }
    transient(t) {
        return this.t(2, t);
    }
    callback(t) {
        return this.t(3, t);
    }
    cachedCallback(t) {
        return this.t(3, It(t));
    }
    aliasTo(t) {
        return this.t(5, t);
    }
    t(t, e) {
        const {c: n, k: r} = this;
        this.c = this.k = void 0;
        return n.registerResolver(r, new Resolver(r, t, e));
    }
}

function D(t) {
    const e = t.slice();
    const n = Object.keys(t);
    const r = n.length;
    let i;
    for (let s = 0; s < r; ++s) {
        i = n[s];
        if (!a(i)) e[i] = t[i];
    }
    return e;
}

const S = {
    none(t) {
        throw N(t);
    },
    singleton(t) {
        return new Resolver(t, 1, t);
    },
    transient(t) {
        return new Resolver(t, 2, t);
    }
};

const N = t => new Error(`AUR0002:${r(t)}`);

class ContainerConfiguration {
    constructor(t, e) {
        this.inheritParentResources = t;
        this.defaultResolver = e;
    }
    static from(t) {
        if (void 0 === t || t === ContainerConfiguration.DEFAULT) return ContainerConfiguration.DEFAULT;
        return new ContainerConfiguration(t.inheritParentResources ?? false, t.defaultResolver ?? S.singleton);
    }
}

ContainerConfiguration.DEFAULT = ContainerConfiguration.from({});

const W = {
    createContainer(t) {
        return new Container(null, ContainerConfiguration.from(t));
    },
    getDesignParamtypes(t) {
        return i("design:paramtypes", t);
    },
    getAnnotationParamtypes(t) {
        const e = j("di:paramtypes");
        return i(e, t);
    },
    getOrCreateAnnotationParamTypes: z,
    getDependencies: B,
    createInterface(t, e) {
        const n = u(t) ? t : e;
        const r = l(t) ? t : void 0;
        const i = function(t, e, n) {
            if (null == t || void 0 !== new.target) throw new Error(`AUR0001:${i.friendlyName}`);
            const r = z(t);
            r[n] = i;
        };
        i.$isInterface = true;
        i.friendlyName = null == r ? "(anonymous)" : r;
        if (null != n) i.register = (t, e) => n(new ResolverBuilder(t, e ?? i));
        i.toString = () => `InterfaceSymbol<${i.friendlyName}>`;
        return i;
    },
    inject(...t) {
        return function(e, n, r) {
            if ("number" === typeof r) {
                const n = z(e);
                const i = t[0];
                if (void 0 !== i) n[r] = i;
            } else if (n) {
                const r = z(e.constructor);
                const i = t[0];
                if (void 0 !== i) r[n] = i;
            } else if (r) {
                const e = r.value;
                const n = z(e);
                let i;
                let s = 0;
                for (;s < t.length; ++s) {
                    i = t[s];
                    if (void 0 !== i) n[s] = i;
                }
            } else {
                const n = z(e);
                let r;
                let i = 0;
                for (;i < t.length; ++i) {
                    r = t[i];
                    if (void 0 !== r) n[i] = r;
                }
            }
        };
    },
    transient(t) {
        t.register = function(e) {
            const n = Ot.transient(t, t);
            return n.register(e, t);
        };
        t.registerInRequestor = false;
        return t;
    },
    singleton(t, e = V) {
        t.register = function(e) {
            const n = Ot.singleton(t, t);
            return n.register(e, t);
        };
        t.registerInRequestor = e.scoped;
        return t;
    }
};

function B(t) {
    const e = j("di:dependencies");
    let n = i(e, t);
    if (void 0 === n) {
        const r = t.inject;
        if (void 0 === r) {
            const e = W.getDesignParamtypes(t);
            const r = W.getAnnotationParamtypes(t);
            if (void 0 === e) if (void 0 === r) {
                const e = Object.getPrototypeOf(t);
                if (u(e) && e !== Function.prototype) n = D(B(e)); else n = [];
            } else n = D(r); else if (void 0 === r) n = D(e); else {
                n = D(e);
                let t = r.length;
                let i;
                let s = 0;
                for (;s < t; ++s) {
                    i = r[s];
                    if (void 0 !== i) n[s] = i;
                }
                const o = Object.keys(r);
                let u;
                s = 0;
                t = o.length;
                for (s = 0; s < t; ++s) {
                    u = o[s];
                    if (!a(u)) n[u] = r[u];
                }
            }
        } else n = D(r);
        o(e, n, t);
        I(t, e);
    }
    return n;
}

function z(t) {
    const e = j("di:paramtypes");
    let n = i(e, t);
    if (void 0 === n) {
        o(e, n = [], t);
        I(t, e);
    }
    return n;
}

const _ = W.createInterface("IContainer");

const Q = _;

function x(t) {
    return function(e) {
        const n = function(t, e, r) {
            W.inject(n)(t, e, r);
        };
        n.$isResolver = true;
        n.resolve = function(n, r) {
            return t(e, n, r);
        };
        return n;
    };
}

const G = W.inject;

function K(t) {
    return W.transient(t);
}

function H(t) {
    return null == t ? K : K(t);
}

const V = {
    scoped: false
};

function q(t) {
    if (u(t)) return W.singleton(t);
    return function(e) {
        return W.singleton(e, t);
    };
}

function J(t) {
    return function(e, n) {
        n = !!n;
        const r = function(t, e, n) {
            W.inject(r)(t, e, n);
        };
        r.$isResolver = true;
        r.resolve = function(r, i) {
            return t(e, r, i, n);
        };
        return r;
    };
}

const X = J(((t, e, n, r) => n.getAll(t, r)));

const Y = x(((t, e, n) => () => n.get(t)));

const Z = x(((t, e, n) => {
    if (n.has(t, true)) return n.get(t); else return;
}));

function tt(t, e, n) {
    W.inject(tt)(t, e, n);
}

tt.$isResolver = true;

tt.resolve = () => {};

const et = x(((t, e, n) => (...r) => e.getFactory(t).construct(n, r)));

const nt = x(((t, e, n) => {
    const i = it(t, e, n);
    const s = new InstanceProvider(r(t), i);
    n.registerResolver(t, s, true);
    return i;
}));

const rt = x(((t, e, n) => it(t, e, n)));

function it(t, e, n) {
    return e.getFactory(t).construct(n);
}

var st;

(function(t) {
    t[t["instance"] = 0] = "instance";
    t[t["singleton"] = 1] = "singleton";
    t[t["transient"] = 2] = "transient";
    t[t["callback"] = 3] = "callback";
    t[t["array"] = 4] = "array";
    t[t["alias"] = 5] = "alias";
})(st || (st = {}));

class Resolver {
    constructor(t, e, n) {
        this.k = t;
        this.i = e;
        this._state = n;
        this.resolving = false;
    }
    get $isResolver() {
        return true;
    }
    register(t, e) {
        return t.registerResolver(e || this.k, this);
    }
    resolve(t, e) {
        switch (this.i) {
          case 0:
            return this._state;

          case 1:
            if (this.resolving) throw ot(this._state.name);
            this.resolving = true;
            this._state = t.getFactory(this._state).construct(e);
            this.i = 0;
            this.resolving = false;
            return this._state;

          case 2:
            {
                const n = t.getFactory(this._state);
                if (null === n) throw ut(this.k);
                return n.construct(e);
            }

          case 3:
            return this._state(t, e, this);

          case 4:
            return this._state[0].resolve(t, e);

          case 5:
            return e.get(this._state);

          default:
            throw lt(this.i);
        }
    }
    getFactory(t) {
        switch (this.i) {
          case 1:
          case 2:
            return t.getFactory(this._state);

          case 5:
            return t.getResolver(this._state)?.getFactory?.(t) ?? null;

          default:
            return null;
        }
    }
}

const ot = t => new Error(`AUR0003:${t}`);

const ut = t => new Error(`AUR0004:${r(t)}`);

const lt = t => new Error(`AUR0005:${t}`);

function ct(t) {
    return this.get(t);
}

function ft(t, e) {
    return e(t);
}

class Factory {
    constructor(t, e) {
        this.Type = t;
        this.dependencies = e;
        this.transformers = null;
    }
    construct(t, e) {
        let n;
        if (void 0 === e) n = new this.Type(...this.dependencies.map(ct, t)); else n = new this.Type(...this.dependencies.map(ct, t), ...e);
        if (null == this.transformers) return n;
        return this.transformers.reduce(ft, n);
    }
    registerTransformer(t) {
        (this.transformers ?? (this.transformers = [])).push(t);
    }
}

const at = {
    $isResolver: true,
    resolve(t, e) {
        return e;
    }
};

function ht(t) {
    return u(t.register);
}

function dt(t) {
    return ht(t) && "boolean" === typeof t.registerInRequestor;
}

function vt(t) {
    return dt(t) && t.registerInRequestor;
}

function wt(t) {
    return void 0 !== t.prototype;
}

function gt(t) {
    return l(t) && t.indexOf(":") > 0;
}

const pt = new Set([ "Array", "ArrayBuffer", "Boolean", "DataView", "Date", "Error", "EvalError", "Float32Array", "Float64Array", "Function", "Int8Array", "Int16Array", "Int32Array", "Map", "Number", "Object", "Promise", "RangeError", "ReferenceError", "RegExp", "Set", "SharedArrayBuffer", "String", "SyntaxError", "TypeError", "Uint8Array", "Uint8ClampedArray", "Uint16Array", "Uint32Array", "URIError", "WeakMap", "WeakSet" ]);

let Rt = 0;

class Container {
    constructor(t, e) {
        this.parent = t;
        this.config = e;
        this.id = ++Rt;
        this.u = 0;
        this.h = new Map;
        if (null === t) {
            this.root = this;
            this.R = new Map;
            this.$ = new Map;
            this.res = c();
        } else {
            this.root = t.root;
            this.R = new Map;
            this.$ = t.$;
            if (e.inheritParentResources) this.res = Object.assign(c(), t.res, this.root.res); else this.res = c();
        }
        this.R.set(_, at);
    }
    get depth() {
        return null === this.parent ? 0 : this.parent.depth + 1;
    }
    register(...t) {
        if (100 === ++this.u) throw mt(t);
        let e;
        let r;
        let i;
        let s;
        let o;
        let u = 0;
        let l = t.length;
        for (;u < l; ++u) {
            e = t[u];
            if (!n(e)) continue;
            if (ht(e)) e.register(this); else if (F.resource.has(e)) {
                const t = F.resource.getAll(e);
                if (1 === t.length) t[0].register(this); else {
                    s = 0;
                    o = t.length;
                    while (o > s) {
                        t[s].register(this);
                        ++s;
                    }
                }
            } else if (wt(e)) Ot.singleton(e, e).register(this); else {
                r = Object.keys(e);
                s = 0;
                o = r.length;
                for (;s < o; ++s) {
                    i = e[r[s]];
                    if (!n(i)) continue;
                    if (ht(i)) i.register(this); else this.register(i);
                }
            }
        }
        --this.u;
        return this;
    }
    registerResolver(t, e, n = false) {
        Mt(t);
        const r = this.R;
        const i = r.get(t);
        if (null == i) {
            r.set(t, e);
            if (gt(t)) {
                if (void 0 !== this.res[t]) throw yt(t);
                this.res[t] = e;
            }
        } else if (i instanceof Resolver && 4 === i.i) i._state.push(e); else r.set(t, new Resolver(t, 4, [ i, e ]));
        if (n) this.h.set(t, e);
        return e;
    }
    registerTransformer(t, e) {
        const n = this.getResolver(t);
        if (null == n) return false;
        if (n.getFactory) {
            const t = n.getFactory(this);
            if (null == t) return false;
            t.registerTransformer(e);
            return true;
        }
        return false;
    }
    getResolver(t, e = true) {
        Mt(t);
        if (void 0 !== t.resolve) return t;
        let n = this;
        let r;
        let i;
        while (null != n) {
            r = n.R.get(t);
            if (null == r) {
                if (null == n.parent) {
                    i = vt(t) ? this : n;
                    return e ? this.C(t, i) : null;
                }
                n = n.parent;
            } else return r;
        }
        return null;
    }
    has(t, e = false) {
        return this.R.has(t) ? true : e && null != this.parent ? this.parent.has(t, true) : false;
    }
    get(t) {
        Mt(t);
        if (t.$isResolver) return t.resolve(this, this);
        let e = this;
        let n;
        let r;
        while (null != e) {
            n = e.R.get(t);
            if (null == n) {
                if (null == e.parent) {
                    r = vt(t) ? this : e;
                    n = this.C(t, r);
                    return n.resolve(e, this);
                }
                e = e.parent;
            } else return n.resolve(e, this);
        }
        throw bt(t);
    }
    getAll(t, e = false) {
        Mt(t);
        const n = this;
        let r = n;
        let i;
        if (e) {
            let e = Ut;
            while (null != r) {
                i = r.R.get(t);
                if (null != i) e = e.concat(kt(i, r, n));
                r = r.parent;
            }
            return e;
        } else while (null != r) {
            i = r.R.get(t);
            if (null == i) {
                r = r.parent;
                if (null == r) return Ut;
            } else return kt(i, r, n);
        }
        return Ut;
    }
    invoke(t, e) {
        if ($(t)) throw Lt(t);
        if (void 0 === e) return new t(...B(t).map(ct, this)); else return new t(...B(t).map(ct, this), ...e);
    }
    getFactory(t) {
        let e = this.$.get(t);
        if (void 0 === e) {
            if ($(t)) throw Lt(t);
            this.$.set(t, e = new Factory(t, B(t)));
        }
        return e;
    }
    registerFactory(t, e) {
        this.$.set(t, e);
    }
    createChild(t) {
        if (void 0 === t && this.config.inheritParentResources) {
            if (this.config === ContainerConfiguration.DEFAULT) return new Container(this, this.config);
            return new Container(this, ContainerConfiguration.from({
                ...this.config,
                inheritParentResources: false
            }));
        }
        return new Container(this, ContainerConfiguration.from(t ?? this.config));
    }
    disposeResolvers() {
        const t = this.R;
        const e = this.h;
        let n;
        let r;
        for ([r, n] of e.entries()) {
            n.dispose();
            t.delete(r);
        }
        e.clear();
    }
    find(t, e) {
        const n = t.keyFrom(e);
        let r = this.res[n];
        if (void 0 === r) {
            r = this.root.res[n];
            if (void 0 === r) return null;
        }
        if (null === r) return null;
        if (u(r.getFactory)) {
            const e = r.getFactory(this);
            if (null === e || void 0 === e) return null;
            const n = i(t.name, e.Type);
            if (void 0 === n) return null;
            return n;
        }
        return null;
    }
    create(t, e) {
        const n = t.keyFrom(e);
        let r = this.res[n];
        if (void 0 === r) {
            r = this.root.res[n];
            if (void 0 === r) return null;
            return r.resolve(this.root, this) ?? null;
        }
        return r.resolve(this, this) ?? null;
    }
    dispose() {
        if (this.h.size > 0) this.disposeResolvers();
        this.R.clear();
    }
    C(t, e) {
        if (!u(t)) throw $t(t);
        if (pt.has(t.name)) throw Ct(t);
        if (ht(t)) {
            const n = t.register(e, t);
            if (!(n instanceof Object) || null == n.resolve) {
                const n = e.R.get(t);
                if (null != n) return n;
                throw Et();
            }
            return n;
        } else if (F.resource.has(t)) {
            const n = F.resource.getAll(t);
            if (1 === n.length) n[0].register(e); else {
                const t = n.length;
                for (let r = 0; r < t; ++r) n[r].register(e);
            }
            const r = e.R.get(t);
            if (null != r) return r;
            throw Et();
        } else if (t.$isInterface) throw At(t.friendlyName); else {
            const n = this.config.defaultResolver(t, e);
            e.R.set(t, n);
            return n;
        }
    }
}

const mt = t => new Error(`AUR0006:${t.map(r)}`);

const yt = t => new Error(`AUR0007:${r(t)}`);

const bt = t => new Error(`AUR0008:${r(t)}`);

const $t = t => new Error(`AUR0009:${r(t)}`);

const Ct = t => new Error(`AUR0010:${t.name}`);

const Et = () => new Error(`AUR0011`);

const At = t => new Error(`AUR0012:${t}`);

class ParameterizedRegistry {
    constructor(t, e) {
        this.key = t;
        this.params = e;
    }
    register(t) {
        if (t.has(this.key, true)) {
            const e = t.get(this.key);
            e.register(t, ...this.params);
        } else t.register(...this.params.filter((t => "object" === typeof t)));
    }
}

const jt = new WeakMap;

function It(t) {
    return function(e, n, r) {
        let i = jt.get(e);
        if (void 0 === i) jt.set(e, i = new WeakMap);
        if (i.has(r)) return i.get(r);
        const s = t(e, n, r);
        i.set(r, s);
        return s;
    };
}

const Ot = {
    instance(t, e) {
        return new Resolver(t, 0, e);
    },
    singleton(t, e) {
        return new Resolver(t, 1, e);
    },
    transient(t, e) {
        return new Resolver(t, 2, e);
    },
    callback(t, e) {
        return new Resolver(t, 3, e);
    },
    cachedCallback(t, e) {
        return new Resolver(t, 3, It(e));
    },
    aliasTo(t, e) {
        return new Resolver(e, 5, t);
    },
    defer(t, ...e) {
        return new ParameterizedRegistry(t, e);
    }
};

class InstanceProvider {
    constructor(t, e) {
        this.A = null;
        this.j = t;
        if (void 0 !== e) this.A = e;
    }
    get friendlyName() {
        return this.j;
    }
    prepare(t) {
        this.A = t;
    }
    get $isResolver() {
        return true;
    }
    resolve() {
        if (null == this.A) throw Ft(this.j);
        return this.A;
    }
    dispose() {
        this.A = null;
    }
}

function Mt(t) {
    if (null === t || void 0 === t) throw new Error(`AUR0014`);
}

function kt(t, e, n) {
    if (t instanceof Resolver && 4 === t.i) {
        const r = t._state;
        let i = r.length;
        const s = new Array(i);
        while (i--) s[i] = r[i].resolve(e, n);
        return s;
    }
    return [ t.resolve(e, n) ];
}

function Ft(t) {
    return new Error(`AUR0013:${t}`);
}

function Lt(t) {
    return new Error(`AUR0015:${t.name}`);
}

const Ut = Object.freeze([]);

const Tt = Object.freeze({});

function Pt() {}

const Dt = W.createInterface("IPlatform");

function St(t, e, n, r) {
    var i = arguments.length, s = i < 3 ? e : null === r ? r = Object.getOwnPropertyDescriptor(e, n) : r, o;
    if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) s = Reflect.decorate(t, e, n, r); else for (var u = t.length - 1; u >= 0; u--) if (o = t[u]) s = (i < 3 ? o(s) : i > 3 ? o(e, n, s) : o(e, n)) || s;
    return i > 3 && s && Object.defineProperty(e, n, s), s;
}

function Nt(t, e) {
    return function(n, r) {
        e(n, r, t);
    };
}

var Wt;

(function(t) {
    t[t["trace"] = 0] = "trace";
    t[t["debug"] = 1] = "debug";
    t[t["info"] = 2] = "info";
    t[t["warn"] = 3] = "warn";
    t[t["error"] = 4] = "error";
    t[t["fatal"] = 5] = "fatal";
    t[t["none"] = 6] = "none";
})(Wt || (Wt = {}));

var Bt;

(function(t) {
    t[t["noColors"] = 0] = "noColors";
    t[t["colors"] = 1] = "colors";
})(Bt || (Bt = {}));

const zt = W.createInterface("ILogConfig", (t => t.instance(new LogConfig(0, 3))));

const _t = W.createInterface("ISink");

const Qt = W.createInterface("ILogEventFactory", (t => t.singleton(Yt)));

const xt = W.createInterface("ILogger", (t => t.singleton(te)));

const Gt = W.createInterface("ILogScope");

const Kt = Object.freeze({
    key: j("logger-sink-handles"),
    define(t, e) {
        o(this.key, e.handles, t.prototype);
        return t;
    },
    getHandles(e) {
        return t.get(this.key, e);
    }
});

function Ht(t) {
    return function(e) {
        return Kt.define(e, t);
    };
}

const Vt = b({
    red(t) {
        return `[31m${t}[39m`;
    },
    green(t) {
        return `[32m${t}[39m`;
    },
    yellow(t) {
        return `[33m${t}[39m`;
    },
    blue(t) {
        return `[34m${t}[39m`;
    },
    magenta(t) {
        return `[35m${t}[39m`;
    },
    cyan(t) {
        return `[36m${t}[39m`;
    },
    white(t) {
        return `[37m${t}[39m`;
    },
    grey(t) {
        return `[90m${t}[39m`;
    }
});

class LogConfig {
    constructor(t, e) {
        this.colorOptions = t;
        this.level = e;
    }
}

const qt = function() {
    const t = [ b({
        TRC: "TRC",
        DBG: "DBG",
        INF: "INF",
        WRN: "WRN",
        ERR: "ERR",
        FTL: "FTL",
        QQQ: "???"
    }), b({
        TRC: Vt.grey("TRC"),
        DBG: Vt.grey("DBG"),
        INF: Vt.white("INF"),
        WRN: Vt.yellow("WRN"),
        ERR: Vt.red("ERR"),
        FTL: Vt.red("FTL"),
        QQQ: Vt.grey("???")
    }) ];
    return function(e, n) {
        if (e <= 0) return t[n].TRC;
        if (e <= 1) return t[n].DBG;
        if (e <= 2) return t[n].INF;
        if (e <= 3) return t[n].WRN;
        if (e <= 4) return t[n].ERR;
        if (e <= 5) return t[n].FTL;
        return t[n].QQQ;
    };
}();

function Jt(t, e) {
    if (0 === e) return t.join(".");
    return t.map(Vt.cyan).join(".");
}

function Xt(t, e) {
    if (0 === e) return new Date(t).toISOString();
    return Vt.grey(new Date(t).toISOString());
}

class DefaultLogEvent {
    constructor(t, e, n, r, i, s) {
        this.severity = t;
        this.message = e;
        this.optionalParams = n;
        this.scope = r;
        this.colorOptions = i;
        this.timestamp = s;
    }
    toString() {
        const {severity: t, message: e, scope: n, colorOptions: r, timestamp: i} = this;
        if (0 === n.length) return `${Xt(i, r)} [${qt(t, r)}] ${e}`;
        return `${Xt(i, r)} [${qt(t, r)} ${Jt(n, r)}] ${e}`;
    }
}

let Yt = class DefaultLogEventFactory {
    constructor(t) {
        this.config = t;
    }
    createLogEvent(t, e, n, r) {
        return new DefaultLogEvent(e, n, r, t.scope, this.config.colorOptions, Date.now());
    }
};

Yt = St([ Nt(0, zt) ], Yt);

let Zt = class ConsoleSink {
    constructor(t) {
        const e = t.console;
        this.handleEvent = function t(n) {
            const r = n.optionalParams;
            if (void 0 === r || 0 === r.length) {
                const t = n.toString();
                switch (n.severity) {
                  case 0:
                  case 1:
                    return e.debug(t);

                  case 2:
                    return e.info(t);

                  case 3:
                    return e.warn(t);

                  case 4:
                  case 5:
                    return e.error(t);
                }
            } else {
                let t = n.toString();
                let i = 0;
                while (t.includes("%s")) t = t.replace("%s", String(r[i++]));
                switch (n.severity) {
                  case 0:
                  case 1:
                    return e.debug(t, ...r.slice(i));

                  case 2:
                    return e.info(t, ...r.slice(i));

                  case 3:
                    return e.warn(t, ...r.slice(i));

                  case 4:
                  case 5:
                    return e.error(t, ...r.slice(i));
                }
            }
        };
    }
    static register(t) {
        Ot.singleton(_t, ConsoleSink).register(t);
    }
};

Zt = St([ Nt(0, Dt) ], Zt);

let te = class DefaultLogger {
    constructor(t, e, n, r = [], i = null) {
        this.config = t;
        this.factory = e;
        this.scope = r;
        this.scopedLoggers = c();
        let s;
        let o;
        let u;
        let l;
        let f;
        let a;
        if (null === i) {
            this.root = this;
            this.parent = this;
            s = this.traceSinks = [];
            o = this.debugSinks = [];
            u = this.infoSinks = [];
            l = this.warnSinks = [];
            f = this.errorSinks = [];
            a = this.fatalSinks = [];
            for (const t of n) {
                const e = Kt.getHandles(t);
                if (e?.includes(0) ?? true) s.push(t);
                if (e?.includes(1) ?? true) o.push(t);
                if (e?.includes(2) ?? true) u.push(t);
                if (e?.includes(3) ?? true) l.push(t);
                if (e?.includes(4) ?? true) f.push(t);
                if (e?.includes(5) ?? true) a.push(t);
            }
        } else {
            this.root = i.root;
            this.parent = i;
            s = this.traceSinks = i.traceSinks;
            o = this.debugSinks = i.debugSinks;
            u = this.infoSinks = i.infoSinks;
            l = this.warnSinks = i.warnSinks;
            f = this.errorSinks = i.errorSinks;
            a = this.fatalSinks = i.fatalSinks;
        }
    }
    trace(t, ...e) {
        if (this.config.level <= 0) this.emit(this.traceSinks, 0, t, e);
    }
    debug(t, ...e) {
        if (this.config.level <= 1) this.emit(this.debugSinks, 1, t, e);
    }
    info(t, ...e) {
        if (this.config.level <= 2) this.emit(this.infoSinks, 2, t, e);
    }
    warn(t, ...e) {
        if (this.config.level <= 3) this.emit(this.warnSinks, 3, t, e);
    }
    error(t, ...e) {
        if (this.config.level <= 4) this.emit(this.errorSinks, 4, t, e);
    }
    fatal(t, ...e) {
        if (this.config.level <= 5) this.emit(this.fatalSinks, 5, t, e);
    }
    scopeTo(t) {
        const e = this.scopedLoggers;
        let n = e[t];
        if (void 0 === n) n = e[t] = new DefaultLogger(this.config, this.factory, void 0, this.scope.concat(t), this);
        return n;
    }
    emit(t, e, n, r) {
        const i = u(n) ? n() : n;
        const s = this.factory.createLogEvent(this, e, i, r);
        for (let e = 0, n = t.length; e < n; ++e) t[e].handleEvent(s);
    }
};

St([ p ], te.prototype, "trace", null);

St([ p ], te.prototype, "debug", null);

St([ p ], te.prototype, "info", null);

St([ p ], te.prototype, "warn", null);

St([ p ], te.prototype, "error", null);

St([ p ], te.prototype, "fatal", null);

te = St([ Nt(0, zt), Nt(1, Qt), Nt(2, X(_t)), Nt(3, Z(Gt)), Nt(4, tt) ], te);

const ee = b({
    create({level: t = 3, colorOptions: e = 0, sinks: n = []} = {}) {
        return b({
            register(r) {
                r.register(Ot.instance(zt, new LogConfig(e, t)));
                for (const t of n) if (u(t)) r.register(Ot.singleton(_t, t)); else r.register(t);
                return r;
            }
        });
    }
});

const ne = W.createInterface((t => t.singleton(ModuleLoader)));

function re(t) {
    return t;
}

class ModuleTransformer {
    constructor(t) {
        this.$transform = t;
        this.I = new Map;
        this.O = new Map;
    }
    transform(t) {
        if (t instanceof Promise) return this.M(t); else if ("object" === typeof t && null !== t) return this.F(t); else throw new Error(`Invalid input: ${String(t)}. Expected Promise or Object.`);
    }
    M(t) {
        if (this.I.has(t)) return this.I.get(t);
        const e = t.then((t => this.F(t)));
        this.I.set(t, e);
        void e.then((e => {
            this.I.set(t, e);
        }));
        return e;
    }
    F(t) {
        if (this.O.has(t)) return this.O.get(t);
        const e = this.$transform(this.L(t));
        this.O.set(t, e);
        if (e instanceof Promise) void e.then((e => {
            this.O.set(t, e);
        }));
        return e;
    }
    L(t) {
        if (null == t) throw new Error(`Invalid input: ${String(t)}. Expected Object.`);
        if ("object" !== typeof t) return new AnalyzedModule(t, []);
        let e;
        let n;
        let r;
        let i;
        const s = [];
        for (const o in t) {
            switch (typeof (e = t[o])) {
              case "object":
                if (null === e) continue;
                n = u(e.register);
                r = false;
                i = Ut;
                break;

              case "function":
                n = u(e.register);
                r = void 0 !== e.prototype;
                i = F.resource.getAll(e);
                break;

              default:
                continue;
            }
            s.push(new ModuleItem(o, e, n, r, i));
        }
        return new AnalyzedModule(t, s);
    }
}

class ModuleLoader {
    constructor() {
        this.transformers = new Map;
    }
    load(t, e = re) {
        const n = this.transformers;
        let r = n.get(e);
        if (void 0 === r) n.set(e, r = new ModuleTransformer(e));
        return r.transform(t);
    }
    dispose() {
        this.transformers.clear();
    }
}

class AnalyzedModule {
    constructor(t, e) {
        this.raw = t;
        this.items = e;
    }
}

class ModuleItem {
    constructor(t, e, n, r, i) {
        this.key = t;
        this.value = e;
        this.isRegistry = n;
        this.isConstructable = r;
        this.definitions = i;
    }
}

class Handler {
    constructor(t, e) {
        this.messageType = t;
        this.callback = e;
    }
    handle(t) {
        if (t instanceof this.messageType) this.callback.call(null, t);
    }
}

const ie = W.createInterface("IEventAggregator", (t => t.singleton(EventAggregator)));

class EventAggregator {
    constructor() {
        this.eventLookup = {};
        this.messageHandlers = [];
    }
    publish(t, e) {
        if (!t) throw new Error(`Invalid channel name or instance: ${t}.`);
        if (l(t)) {
            let n = this.eventLookup[t];
            if (void 0 !== n) {
                n = n.slice();
                let r = n.length;
                while (r-- > 0) n[r](e, t);
            }
        } else {
            const e = this.messageHandlers.slice();
            let n = e.length;
            while (n-- > 0) e[n].handle(t);
        }
    }
    subscribe(t, e) {
        if (!t) throw new Error(`Invalid channel name or type: ${t}.`);
        let n;
        let r;
        if (l(t)) {
            if (void 0 === this.eventLookup[t]) this.eventLookup[t] = [];
            n = e;
            r = this.eventLookup[t];
        } else {
            n = new Handler(t, e);
            r = this.messageHandlers;
        }
        r.push(n);
        return {
            dispose() {
                const t = r.indexOf(n);
                if (-1 !== t) r.splice(t, 1);
            }
        };
    }
    subscribeOnce(t, e) {
        const n = this.subscribe(t, (function(t, r) {
            n.dispose();
            e(t, r);
        }));
        return n;
    }
}

export { AnalyzedModule, Bt as ColorOptions, Zt as ConsoleSink, ContainerConfiguration, W as DI, DefaultLogEvent, Yt as DefaultLogEventFactory, te as DefaultLogger, S as DefaultResolver, EventAggregator, _ as IContainer, ie as IEventAggregator, zt as ILogConfig, Qt as ILogEventFactory, xt as ILogger, ne as IModuleLoader, Dt as IPlatform, Q as IServiceLocator, _t as ISink, InstanceProvider, LogConfig, Wt as LogLevel, ee as LoggerConfiguration, ModuleItem, F as Protocol, Ot as Registration, X as all, p as bound, d as camelCase, Ut as emptyArray, Tt as emptyObject, et as factory, m as firstDefined, Vt as format, U as fromAnnotationOrDefinitionOrTypeOrDefault, T as fromAnnotationOrTypeOrDefault, P as fromDefinitionOrDefault, y as getPrototypeChain, tt as ignore, G as inject, a as isArrayIndex, $ as isNativeFunction, w as kebabCase, Y as lazy, R as mergeArrays, nt as newInstanceForScope, rt as newInstanceOf, Pt as noop, C as onResolve, Z as optional, v as pascalCase, E as resolveAll, q as singleton, Ht as sink, g as toArray, H as transient };
//# sourceMappingURL=index.mjs.map
