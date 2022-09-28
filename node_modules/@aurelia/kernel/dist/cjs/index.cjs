"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var t = require("@aurelia/metadata");

const e = t.Metadata.getOwn;

const r = t.Metadata.hasOwn;

const n = t.Metadata.define;

const i = t => "function" === typeof t;

const s = t => "string" === typeof t;

const o = () => Object.create(null);

const u = {};

function l(t) {
    switch (typeof t) {
      case "number":
        return t >= 0 && (0 | t) === t;

      case "string":
        {
            const e = u[t];
            if (void 0 !== e) return e;
            const r = t.length;
            if (0 === r) return u[t] = false;
            let n = 0;
            let i = 0;
            for (;i < r; ++i) {
                n = t.charCodeAt(i);
                if (0 === i && 48 === n && r > 1 || n < 48 || n > 57) return u[t] = false;
            }
            return u[t] = true;
        }

      default:
        return false;
    }
}

function c(t) {
    switch (typeof t) {
      case "number":
      case "bigint":
        return true;

      default:
        return false;
    }
}

function f(t) {
    switch (typeof t) {
      case "string":
        return true;

      case "object":
        return t instanceof Date;

      default:
        return false;
    }
}

const a = function() {
    let t;
    (function(t) {
        t[t["none"] = 0] = "none";
        t[t["digit"] = 1] = "digit";
        t[t["upper"] = 2] = "upper";
        t[t["lower"] = 3] = "lower";
    })(t || (t = {}));
    const e = Object.assign(o(), {
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
    function r(t) {
        if ("" === t) return 0;
        if (t !== t.toUpperCase()) return 3;
        if (t !== t.toLowerCase()) return 2;
        if (true === e[t]) return 1;
        return 0;
    }
    return function(t, e) {
        const n = t.length;
        if (0 === n) return t;
        let i = false;
        let s = "";
        let o;
        let u = "";
        let l = 0;
        let c = t.charAt(0);
        let f = r(c);
        let a = 0;
        for (;a < n; ++a) {
            o = l;
            u = c;
            l = f;
            c = t.charAt(a + 1);
            f = r(c);
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

const h = function() {
    const t = o();
    function e(t, e) {
        return e ? t.toUpperCase() : t.toLowerCase();
    }
    return function(r) {
        let n = t[r];
        if (void 0 === n) n = t[r] = a(r, e);
        return n;
    };
}();

const d = function() {
    const t = o();
    return function(e) {
        let r = t[e];
        if (void 0 === r) {
            r = h(e);
            if (r.length > 0) r = r[0].toUpperCase() + r.slice(1);
            t[e] = r;
        }
        return r;
    };
}();

const v = function() {
    const t = o();
    function e(t, e) {
        return e ? `-${t.toLowerCase()}` : t.toLowerCase();
    }
    return function(r) {
        let n = t[r];
        if (void 0 === n) n = t[r] = a(r, e);
        return n;
    };
}();

function p(t) {
    const {length: e} = t;
    const r = Array(e);
    let n = 0;
    for (;n < e; ++n) r[n] = t[n];
    return r;
}

const w = {};

function g(t) {
    if (void 0 === w[t]) w[t] = 0;
    return ++w[t];
}

function x(t) {
    w[t] = 0;
}

function R(t, e) {
    return t - e;
}

function y(t, e, r) {
    if (void 0 === t || null === t || t === At) if (void 0 === e || null === e || e === At) return At; else return r ? e.slice(0) : e; else if (void 0 === e || null === e || e === At) return r ? t.slice(0) : t;
    const n = {};
    const i = r ? t.slice(0) : t;
    let s = t.length;
    let o = e.length;
    while (s-- > 0) n[t[s]] = true;
    let u;
    while (o-- > 0) {
        u = e[o];
        if (void 0 === n[u]) {
            i.push(u);
            n[u] = true;
        }
    }
    return i;
}

function m(t, e, r) {
    return {
        configurable: true,
        enumerable: r.enumerable,
        get() {
            const t = r.value.bind(this);
            Reflect.defineProperty(this, e, {
                value: t,
                writable: true,
                configurable: true,
                enumerable: r.enumerable
            });
            return t;
        }
    };
}

function b(...t) {
    const e = [];
    let r = 0;
    const n = t.length;
    let i = 0;
    let s;
    let o = 0;
    for (;o < n; ++o) {
        s = t[o];
        if (void 0 !== s) {
            i = s.length;
            let t = 0;
            for (;t < i; ++t) e[r++] = s[t];
        }
    }
    return e;
}

function $(...t) {
    const e = {};
    const r = t.length;
    let n;
    let i;
    let s = 0;
    for (;r > s; ++s) {
        n = t[s];
        if (void 0 !== n) for (i in n) e[i] = n[i];
    }
    return e;
}

function C(...t) {
    const e = t.length;
    let r;
    let n = 0;
    for (;e > n; ++n) {
        r = t[n];
        if (void 0 !== r) return r;
    }
    throw new Error(`No default value found`);
}

const E = function() {
    const t = Function.prototype;
    const e = Object.getPrototypeOf;
    const r = new WeakMap;
    let n = t;
    let i = 0;
    let s;
    return function(o) {
        s = r.get(o);
        if (void 0 === s) {
            r.set(o, s = [ n = o ]);
            i = 0;
            while ((n = e(n)) !== t) s[++i] = n;
        }
        return s;
    };
}();

function A(...t) {
    return Object.assign(o(), ...t);
}

const j = function() {
    const t = new WeakMap;
    let e = false;
    let r = "";
    let n = 0;
    return function(i) {
        e = t.get(i);
        if (void 0 === e) {
            r = i.toString();
            n = r.length;
            e = n >= 29 && n <= 100 && 125 === r.charCodeAt(n - 1) && r.charCodeAt(n - 2) <= 32 && 93 === r.charCodeAt(n - 3) && 101 === r.charCodeAt(n - 4) && 100 === r.charCodeAt(n - 5) && 111 === r.charCodeAt(n - 6) && 99 === r.charCodeAt(n - 7) && 32 === r.charCodeAt(n - 8) && 101 === r.charCodeAt(n - 9) && 118 === r.charCodeAt(n - 10) && 105 === r.charCodeAt(n - 11) && 116 === r.charCodeAt(n - 12) && 97 === r.charCodeAt(n - 13) && 110 === r.charCodeAt(n - 14) && 88 === r.charCodeAt(n - 15);
            t.set(i, e);
        }
        return e;
    };
}();

function I(t, e) {
    if (t instanceof Promise) return t.then(e);
    return e(t);
}

function O(...t) {
    let e;
    let r;
    let n;
    let i = 0;
    let s = t.length;
    for (;i < s; ++i) {
        e = t[i];
        if ((e = t[i]) instanceof Promise) if (void 0 === r) r = e; else if (void 0 === n) n = [ r, e ]; else n.push(e);
    }
    if (void 0 === n) return r;
    return Promise.all(n);
}

const M = "au:annotation";

const k = (t, e) => {
    if (void 0 === e) return `${M}:${t}`;
    return `${M}:${t}:${e}`;
};

const F = (t, r) => {
    const i = e(M, t);
    if (void 0 === i) n(M, [ r ], t); else i.push(r);
};

const L = Object.freeze({
    name: "au:annotation",
    appendTo: F,
    set(t, e, r) {
        n(k(e), r, t);
    },
    get: (t, r) => e(k(r), t),
    getKeys(t) {
        let r = e(M, t);
        if (void 0 === r) n(M, r = [], t);
        return r;
    },
    isKey: t => t.startsWith(M),
    keyFor: k
});

const U = "au:resource";

const S = Object.freeze({
    name: U,
    appendTo(t, r) {
        const i = e(U, t);
        if (void 0 === i) n(U, [ r ], t); else i.push(r);
    },
    has: t => r(U, t),
    getAll(t) {
        const r = e(U, t);
        if (void 0 === r) return At; else return r.map((r => e(r, t)));
    },
    getKeys(t) {
        let r = e(U, t);
        if (void 0 === r) n(U, r = [], t);
        return r;
    },
    isKey: t => t.startsWith(U),
    keyFor(t, e) {
        if (void 0 === e) return `${U}:${t}`;
        return `${U}:${t}:${e}`;
    }
});

const T = {
    annotation: L,
    resource: S
};

const D = Object.prototype.hasOwnProperty;

function P(t, r, n, i) {
    let s = e(k(t), n);
    if (void 0 === s) {
        s = r[t];
        if (void 0 === s) {
            s = n[t];
            if (void 0 === s || !D.call(n, t)) return i();
            return s;
        }
        return s;
    }
    return s;
}

function N(t, r, n) {
    let i = e(k(t), r);
    if (void 0 === i) {
        i = r[t];
        if (void 0 === i || !D.call(r, t)) return n();
        return i;
    }
    return i;
}

function W(t, e, r) {
    const n = e[t];
    if (void 0 === n) return r();
    return n;
}

t.applyMetadataPolyfill(Reflect, false, false);

class ResolverBuilder {
    constructor(t, e) {
        this.container = t;
        this.key = e;
    }
    instance(t) {
        return this.registerResolver(0, t);
    }
    singleton(t) {
        return this.registerResolver(1, t);
    }
    transient(t) {
        return this.registerResolver(2, t);
    }
    callback(t) {
        return this.registerResolver(3, t);
    }
    cachedCallback(t) {
        return this.registerResolver(3, mt(t));
    }
    aliasTo(t) {
        return this.registerResolver(5, t);
    }
    registerResolver(t, e) {
        const {container: r, key: n} = this;
        this.container = this.key = void 0;
        return r.registerResolver(n, new Resolver(n, t, e));
    }
}

function B(t) {
    const e = t.slice();
    const r = Object.keys(t);
    const n = r.length;
    let i;
    for (let s = 0; s < n; ++s) {
        i = r[s];
        if (!l(i)) e[i] = t[i];
    }
    return e;
}

const z = {
    none(t) {
        throw Error(`AUR0002:${t.toString()}`);
    },
    singleton(t) {
        return new Resolver(t, 1, t);
    },
    transient(t) {
        return new Resolver(t, 2, t);
    }
};

class ContainerConfiguration {
    constructor(t, e) {
        this.inheritParentResources = t;
        this.defaultResolver = e;
    }
    static from(t) {
        var e, r;
        if (void 0 === t || t === ContainerConfiguration.DEFAULT) return ContainerConfiguration.DEFAULT;
        return new ContainerConfiguration(null !== (e = t.inheritParentResources) && void 0 !== e ? e : false, null !== (r = t.defaultResolver) && void 0 !== r ? r : z.singleton);
    }
}

ContainerConfiguration.DEFAULT = ContainerConfiguration.from({});

const Q = {
    createContainer(t) {
        return new Container(null, ContainerConfiguration.from(t));
    },
    getDesignParamtypes(t) {
        return e("design:paramtypes", t);
    },
    getAnnotationParamtypes(t) {
        const r = k("di:paramtypes");
        return e(r, t);
    },
    getOrCreateAnnotationParamTypes: G,
    getDependencies: _,
    createInterface(t, e) {
        const r = i(t) ? t : e;
        const n = s(t) ? t : void 0;
        const o = function(t, e, r) {
            if (null == t || void 0 !== new.target) throw new Error(`AUR0001:${o.friendlyName}`);
            const n = G(t);
            n[r] = o;
        };
        o.$isInterface = true;
        o.friendlyName = null == n ? "(anonymous)" : n;
        if (null != r) o.register = function(t, e) {
            return r(new ResolverBuilder(t, null !== e && void 0 !== e ? e : o));
        };
        o.toString = function t() {
            return `InterfaceSymbol<${o.friendlyName}>`;
        };
        return o;
    },
    inject(...t) {
        return function(e, r, n) {
            if ("number" === typeof n) {
                const r = G(e);
                const i = t[0];
                if (void 0 !== i) r[n] = i;
            } else if (r) {
                const n = G(e.constructor);
                const i = t[0];
                if (void 0 !== i) n[r] = i;
            } else if (n) {
                const e = n.value;
                const r = G(e);
                let i;
                for (let e = 0; e < t.length; ++e) {
                    i = t[e];
                    if (void 0 !== i) r[e] = i;
                }
            } else {
                const r = G(e);
                let n;
                for (let e = 0; e < t.length; ++e) {
                    n = t[e];
                    if (void 0 !== n) r[e] = n;
                }
            }
        };
    },
    transient(t) {
        t.register = function(e) {
            const r = bt.transient(t, t);
            return r.register(e, t);
        };
        t.registerInRequestor = false;
        return t;
    },
    singleton(t, e = Y) {
        t.register = function(e) {
            const r = bt.singleton(t, t);
            return r.register(e, t);
        };
        t.registerInRequestor = e.scoped;
        return t;
    }
};

function _(t) {
    const r = k("di:dependencies");
    let s = e(r, t);
    if (void 0 === s) {
        const e = t.inject;
        if (void 0 === e) {
            const e = Q.getDesignParamtypes(t);
            const r = Q.getAnnotationParamtypes(t);
            if (void 0 === e) if (void 0 === r) {
                const e = Object.getPrototypeOf(t);
                if (i(e) && e !== Function.prototype) s = B(_(e)); else s = [];
            } else s = B(r); else if (void 0 === r) s = B(e); else {
                s = B(e);
                let t = r.length;
                let n;
                let i = 0;
                for (;i < t; ++i) {
                    n = r[i];
                    if (void 0 !== n) s[i] = n;
                }
                const o = Object.keys(r);
                let u;
                i = 0;
                t = o.length;
                for (i = 0; i < t; ++i) {
                    u = o[i];
                    if (!l(u)) s[u] = r[u];
                }
            }
        } else s = B(e);
        n(r, s, t);
        F(t, r);
    }
    return s;
}

function G(t) {
    const r = k("di:paramtypes");
    let i = e(r, t);
    if (void 0 === i) {
        n(r, i = [], t);
        F(t, r);
    }
    return i;
}

const K = Q.createInterface("IContainer");

const H = K;

function q(t) {
    return function(e) {
        const r = function(t, e, n) {
            Q.inject(r)(t, e, n);
        };
        r.$isResolver = true;
        r.resolve = function(r, n) {
            return t(e, r, n);
        };
        return r;
    };
}

const V = Q.inject;

function J(t) {
    return Q.transient(t);
}

function X(t) {
    return null == t ? J : J(t);
}

const Y = {
    scoped: false
};

function Z(t) {
    if (i(t)) return Q.singleton(t);
    return function(e) {
        return Q.singleton(e, t);
    };
}

function tt(t) {
    return function(e, r) {
        r = !!r;
        const n = function(t, e, r) {
            Q.inject(n)(t, e, r);
        };
        n.$isResolver = true;
        n.resolve = function(n, i) {
            return t(e, n, i, r);
        };
        return n;
    };
}

const et = tt(((t, e, r, n) => r.getAll(t, n)));

const rt = q(((t, e, r) => () => r.get(t)));

const nt = q(((t, e, r) => {
    if (r.has(t, true)) return r.get(t); else return;
}));

function it(t, e, r) {
    Q.inject(it)(t, e, r);
}

it.$isResolver = true;

it.resolve = () => {};

const st = q(((t, e, r) => (...n) => e.getFactory(t).construct(r, n)));

const ot = q(((t, e, r) => {
    const n = lt(t, e, r);
    const i = new InstanceProvider(String(t), n);
    r.registerResolver(t, i, true);
    return n;
}));

const ut = q(((t, e, r) => lt(t, e, r)));

function lt(t, e, r) {
    return e.getFactory(t).construct(r);
}

var ct;

(function(t) {
    t[t["instance"] = 0] = "instance";
    t[t["singleton"] = 1] = "singleton";
    t[t["transient"] = 2] = "transient";
    t[t["callback"] = 3] = "callback";
    t[t["array"] = 4] = "array";
    t[t["alias"] = 5] = "alias";
})(ct || (ct = {}));

class Resolver {
    constructor(t, e, r) {
        this.key = t;
        this.strategy = e;
        this.state = r;
        this.resolving = false;
    }
    get $isResolver() {
        return true;
    }
    register(t, e) {
        return t.registerResolver(e || this.key, this);
    }
    resolve(t, e) {
        switch (this.strategy) {
          case 0:
            return this.state;

          case 1:
            if (this.resolving) throw new Error(`AUR0003:${this.state.name}`);
            this.resolving = true;
            this.state = t.getFactory(this.state).construct(e);
            this.strategy = 0;
            this.resolving = false;
            return this.state;

          case 2:
            {
                const r = t.getFactory(this.state);
                if (null === r) throw new Error(`AUR0004:${String(this.key)}`);
                return r.construct(e);
            }

          case 3:
            return this.state(t, e, this);

          case 4:
            return this.state[0].resolve(t, e);

          case 5:
            return e.get(this.state);

          default:
            throw new Error(`AUR0005:${this.strategy}`);
        }
    }
    getFactory(t) {
        var e, r, n;
        switch (this.strategy) {
          case 1:
          case 2:
            return t.getFactory(this.state);

          case 5:
            return null !== (n = null === (r = null === (e = t.getResolver(this.state)) || void 0 === e ? void 0 : e.getFactory) || void 0 === r ? void 0 : r.call(e, t)) && void 0 !== n ? n : null;

          default:
            return null;
        }
    }
}

function ft(t) {
    return this.get(t);
}

function at(t, e) {
    return e(t);
}

class Factory {
    constructor(t, e) {
        this.Type = t;
        this.dependencies = e;
        this.transformers = null;
    }
    construct(t, e) {
        let r;
        if (void 0 === e) r = new this.Type(...this.dependencies.map(ft, t)); else r = new this.Type(...this.dependencies.map(ft, t), ...e);
        if (null == this.transformers) return r;
        return this.transformers.reduce(at, r);
    }
    registerTransformer(t) {
        var e;
        (null !== (e = this.transformers) && void 0 !== e ? e : this.transformers = []).push(t);
    }
}

const ht = {
    $isResolver: true,
    resolve(t, e) {
        return e;
    }
};

function dt(t) {
    return i(t.register);
}

function vt(t) {
    return dt(t) && "boolean" === typeof t.registerInRequestor;
}

function pt(t) {
    return vt(t) && t.registerInRequestor;
}

function wt(t) {
    return void 0 !== t.prototype;
}

function gt(t) {
    return s(t) && t.indexOf(":") > 0;
}

const xt = new Set([ "Array", "ArrayBuffer", "Boolean", "DataView", "Date", "Error", "EvalError", "Float32Array", "Float64Array", "Function", "Int8Array", "Int16Array", "Int32Array", "Map", "Number", "Object", "Promise", "RangeError", "ReferenceError", "RegExp", "Set", "SharedArrayBuffer", "String", "SyntaxError", "TypeError", "Uint8Array", "Uint8ClampedArray", "Uint16Array", "Uint32Array", "URIError", "WeakMap", "WeakSet" ]);

let Rt = 0;

class Container {
    constructor(t, e) {
        this.parent = t;
        this.config = e;
        this.id = ++Rt;
        this.t = 0;
        this.i = new Map;
        if (null === t) {
            this.root = this;
            this.u = new Map;
            this.h = new Map;
            this.res = o();
        } else {
            this.root = t.root;
            this.u = new Map;
            this.h = t.h;
            if (e.inheritParentResources) this.res = Object.assign(o(), t.res, this.root.res); else this.res = o();
        }
        this.u.set(K, ht);
    }
    get depth() {
        return null === this.parent ? 0 : this.parent.depth + 1;
    }
    register(...e) {
        if (100 === ++this.t) throw new Error(`AUR0006:${e.map(String)}`);
        let r;
        let n;
        let i;
        let s;
        let o;
        let u = 0;
        let l = e.length;
        for (;u < l; ++u) {
            r = e[u];
            if (!t.isObject(r)) continue;
            if (dt(r)) r.register(this); else if (T.resource.has(r)) {
                const t = T.resource.getAll(r);
                if (1 === t.length) t[0].register(this); else {
                    s = 0;
                    o = t.length;
                    while (o > s) {
                        t[s].register(this);
                        ++s;
                    }
                }
            } else if (wt(r)) bt.singleton(r, r).register(this); else {
                n = Object.keys(r);
                s = 0;
                o = n.length;
                for (;s < o; ++s) {
                    i = r[n[s]];
                    if (!t.isObject(i)) continue;
                    if (dt(i)) i.register(this); else this.register(i);
                }
            }
        }
        --this.t;
        return this;
    }
    registerResolver(t, e, r = false) {
        $t(t);
        const n = this.u;
        const i = n.get(t);
        if (null == i) {
            n.set(t, e);
            if (gt(t)) {
                if (void 0 !== this.res[t]) throw new Error(`AUR0007:${t}`);
                this.res[t] = e;
            }
        } else if (i instanceof Resolver && 4 === i.strategy) i.state.push(e); else n.set(t, new Resolver(t, 4, [ i, e ]));
        if (r) this.i.set(t, e);
        return e;
    }
    registerTransformer(t, e) {
        const r = this.getResolver(t);
        if (null == r) return false;
        if (r.getFactory) {
            const t = r.getFactory(this);
            if (null == t) return false;
            t.registerTransformer(e);
            return true;
        }
        return false;
    }
    getResolver(t, e = true) {
        $t(t);
        if (void 0 !== t.resolve) return t;
        let r = this;
        let n;
        while (null != r) {
            n = r.u.get(t);
            if (null == n) {
                if (null == r.parent) {
                    const n = pt(t) ? this : r;
                    return e ? this.R(t, n) : null;
                }
                r = r.parent;
            } else return n;
        }
        return null;
    }
    has(t, e = false) {
        return this.u.has(t) ? true : e && null != this.parent ? this.parent.has(t, true) : false;
    }
    get(t) {
        $t(t);
        if (t.$isResolver) return t.resolve(this, this);
        let e = this;
        let r;
        while (null != e) {
            r = e.u.get(t);
            if (null == r) {
                if (null == e.parent) {
                    const n = pt(t) ? this : e;
                    r = this.R(t, n);
                    return r.resolve(e, this);
                }
                e = e.parent;
            } else return r.resolve(e, this);
        }
        throw new Error(`AUR0008:${String(t)}`);
    }
    getAll(t, e = false) {
        $t(t);
        const r = this;
        let n = r;
        let i;
        if (e) {
            let e = At;
            while (null != n) {
                i = n.u.get(t);
                if (null != i) e = e.concat(Ct(i, n, r));
                n = n.parent;
            }
            return e;
        } else while (null != n) {
            i = n.u.get(t);
            if (null == i) {
                n = n.parent;
                if (null == n) return At;
            } else return Ct(i, n, r);
        }
        return At;
    }
    invoke(t, e) {
        if (j(t)) throw Et(t);
        if (void 0 === e) return new t(..._(t).map(ft, this)); else return new t(..._(t).map(ft, this), ...e);
    }
    getFactory(t) {
        let e = this.h.get(t);
        if (void 0 === e) {
            if (j(t)) throw Et(t);
            this.h.set(t, e = new Factory(t, _(t)));
        }
        return e;
    }
    registerFactory(t, e) {
        this.h.set(t, e);
    }
    createChild(t) {
        if (void 0 === t && this.config.inheritParentResources) {
            if (this.config === ContainerConfiguration.DEFAULT) return new Container(this, this.config);
            return new Container(this, ContainerConfiguration.from({
                ...this.config,
                inheritParentResources: false
            }));
        }
        return new Container(this, ContainerConfiguration.from(null !== t && void 0 !== t ? t : this.config));
    }
    disposeResolvers() {
        const t = this.u;
        const e = this.i;
        let r;
        let n;
        for ([n, r] of e.entries()) {
            r.dispose();
            t.delete(n);
        }
        e.clear();
    }
    find(t, r) {
        const n = t.keyFrom(r);
        let s = this.res[n];
        if (void 0 === s) {
            s = this.root.res[n];
            if (void 0 === s) return null;
        }
        if (null === s) return null;
        if (i(s.getFactory)) {
            const r = s.getFactory(this);
            if (null === r || void 0 === r) return null;
            const n = e(t.name, r.Type);
            if (void 0 === n) return null;
            return n;
        }
        return null;
    }
    create(t, e) {
        var r, n;
        const i = t.keyFrom(e);
        let s = this.res[i];
        if (void 0 === s) {
            s = this.root.res[i];
            if (void 0 === s) return null;
            return null !== (r = s.resolve(this.root, this)) && void 0 !== r ? r : null;
        }
        return null !== (n = s.resolve(this, this)) && void 0 !== n ? n : null;
    }
    dispose() {
        if (this.i.size > 0) this.disposeResolvers();
        this.u.clear();
    }
    R(t, e) {
        if (!i(t)) throw new Error(`AUR0009:${t}`);
        if (xt.has(t.name)) throw new Error(`AUR0010:${t.name}`);
        if (dt(t)) {
            const r = t.register(e, t);
            if (!(r instanceof Object) || null == r.resolve) {
                const r = e.u.get(t);
                if (null != r) return r;
                throw new Error(`AUR0011`);
            }
            return r;
        } else if (T.resource.has(t)) {
            const r = T.resource.getAll(t);
            if (1 === r.length) r[0].register(e); else {
                const t = r.length;
                for (let n = 0; n < t; ++n) r[n].register(e);
            }
            const n = e.u.get(t);
            if (null != n) return n;
            throw new Error(`AUR0011`);
        } else if (t.$isInterface) throw new Error(`AUR0012:${t.friendlyName}`); else {
            const r = this.config.defaultResolver(t, e);
            e.u.set(t, r);
            return r;
        }
    }
}

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

const yt = new WeakMap;

function mt(t) {
    return function(e, r, n) {
        let i = yt.get(e);
        if (void 0 === i) yt.set(e, i = new WeakMap);
        if (i.has(n)) return i.get(n);
        const s = t(e, r, n);
        i.set(n, s);
        return s;
    };
}

const bt = {
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
        return new Resolver(t, 3, mt(e));
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
        this.$ = null;
        this.C = t;
        if (void 0 !== e) this.$ = e;
    }
    get friendlyName() {
        return this.C;
    }
    prepare(t) {
        this.$ = t;
    }
    get $isResolver() {
        return true;
    }
    resolve() {
        if (null == this.$) throw new Error(`AUR0013:${this.C}`);
        return this.$;
    }
    dispose() {
        this.$ = null;
    }
}

function $t(t) {
    if (null === t || void 0 === t) throw new Error(`AUR0014`);
}

function Ct(t, e, r) {
    if (t instanceof Resolver && 4 === t.strategy) {
        const n = t.state;
        let i = n.length;
        const s = new Array(i);
        while (i--) s[i] = n[i].resolve(e, r);
        return s;
    }
    return [ t.resolve(e, r) ];
}

function Et(t) {
    return new Error(`AUR0015:${t.name}`);
}

const At = Object.freeze([]);

const jt = Object.freeze({});

function It() {}

const Ot = Q.createInterface("IPlatform");

function Mt(t, e, r, n) {
    var i = arguments.length, s = i < 3 ? e : null === n ? n = Object.getOwnPropertyDescriptor(e, r) : n, o;
    if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) s = Reflect.decorate(t, e, r, n); else for (var u = t.length - 1; u >= 0; u--) if (o = t[u]) s = (i < 3 ? o(s) : i > 3 ? o(e, r, s) : o(e, r)) || s;
    return i > 3 && s && Object.defineProperty(e, r, s), s;
}

function kt(t, e) {
    return function(r, n) {
        e(r, n, t);
    };
}

exports.LogLevel = void 0;

(function(t) {
    t[t["trace"] = 0] = "trace";
    t[t["debug"] = 1] = "debug";
    t[t["info"] = 2] = "info";
    t[t["warn"] = 3] = "warn";
    t[t["error"] = 4] = "error";
    t[t["fatal"] = 5] = "fatal";
    t[t["none"] = 6] = "none";
})(exports.LogLevel || (exports.LogLevel = {}));

exports.ColorOptions = void 0;

(function(t) {
    t[t["noColors"] = 0] = "noColors";
    t[t["colors"] = 1] = "colors";
})(exports.ColorOptions || (exports.ColorOptions = {}));

const Ft = Q.createInterface("ILogConfig", (t => t.instance(new LogConfig(0, 3))));

const Lt = Q.createInterface("ISink");

const Ut = Q.createInterface("ILogEventFactory", (t => t.singleton(exports.DefaultLogEventFactory)));

const St = Q.createInterface("ILogger", (t => t.singleton(exports.DefaultLogger)));

const Tt = Q.createInterface("ILogScope");

const Dt = Object.freeze({
    key: k("logger-sink-handles"),
    define(t, e) {
        n(this.key, e.handles, t.prototype);
        return t;
    },
    getHandles(e) {
        return t.Metadata.get(this.key, e);
    }
});

function Pt(t) {
    return function(e) {
        return Dt.define(e, t);
    };
}

const Nt = A({
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

const Wt = function() {
    const t = [ A({
        TRC: "TRC",
        DBG: "DBG",
        INF: "INF",
        WRN: "WRN",
        ERR: "ERR",
        FTL: "FTL",
        QQQ: "???"
    }), A({
        TRC: Nt.grey("TRC"),
        DBG: Nt.grey("DBG"),
        INF: Nt.white("INF"),
        WRN: Nt.yellow("WRN"),
        ERR: Nt.red("ERR"),
        FTL: Nt.red("FTL"),
        QQQ: Nt.grey("???")
    }) ];
    return function(e, r) {
        if (e <= 0) return t[r].TRC;
        if (e <= 1) return t[r].DBG;
        if (e <= 2) return t[r].INF;
        if (e <= 3) return t[r].WRN;
        if (e <= 4) return t[r].ERR;
        if (e <= 5) return t[r].FTL;
        return t[r].QQQ;
    };
}();

function Bt(t, e) {
    if (0 === e) return t.join(".");
    return t.map(Nt.cyan).join(".");
}

function zt(t, e) {
    if (0 === e) return new Date(t).toISOString();
    return Nt.grey(new Date(t).toISOString());
}

class DefaultLogEvent {
    constructor(t, e, r, n, i, s) {
        this.severity = t;
        this.message = e;
        this.optionalParams = r;
        this.scope = n;
        this.colorOptions = i;
        this.timestamp = s;
    }
    toString() {
        const {severity: t, message: e, scope: r, colorOptions: n, timestamp: i} = this;
        if (0 === r.length) return `${zt(i, n)} [${Wt(t, n)}] ${e}`;
        return `${zt(i, n)} [${Wt(t, n)} ${Bt(r, n)}] ${e}`;
    }
}

exports.DefaultLogEventFactory = class DefaultLogEventFactory {
    constructor(t) {
        this.config = t;
    }
    createLogEvent(t, e, r, n) {
        return new DefaultLogEvent(e, r, n, t.scope, this.config.colorOptions, Date.now());
    }
};

exports.DefaultLogEventFactory = Mt([ kt(0, Ft) ], exports.DefaultLogEventFactory);

exports.ConsoleSink = class ConsoleSink {
    constructor(t) {
        const e = t.console;
        this.handleEvent = function t(r) {
            const n = r.optionalParams;
            if (void 0 === n || 0 === n.length) {
                const t = r.toString();
                switch (r.severity) {
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
                let t = r.toString();
                let i = 0;
                while (t.includes("%s")) t = t.replace("%s", String(n[i++]));
                switch (r.severity) {
                  case 0:
                  case 1:
                    return e.debug(t, ...n.slice(i));

                  case 2:
                    return e.info(t, ...n.slice(i));

                  case 3:
                    return e.warn(t, ...n.slice(i));

                  case 4:
                  case 5:
                    return e.error(t, ...n.slice(i));
                }
            }
        };
    }
    static register(t) {
        bt.singleton(Lt, ConsoleSink).register(t);
    }
};

exports.ConsoleSink = Mt([ kt(0, Ot) ], exports.ConsoleSink);

exports.DefaultLogger = class DefaultLogger {
    constructor(t, e, r, n = [], i = null) {
        var s, u, l, c, f, a;
        this.config = t;
        this.factory = e;
        this.scope = n;
        this.scopedLoggers = o();
        let h;
        let d;
        let v;
        let p;
        let w;
        let g;
        if (null === i) {
            this.root = this;
            this.parent = this;
            h = this.traceSinks = [];
            d = this.debugSinks = [];
            v = this.infoSinks = [];
            p = this.warnSinks = [];
            w = this.errorSinks = [];
            g = this.fatalSinks = [];
            for (const t of r) {
                const e = Dt.getHandles(t);
                if (null !== (s = null === e || void 0 === e ? void 0 : e.includes(0)) && void 0 !== s ? s : true) h.push(t);
                if (null !== (u = null === e || void 0 === e ? void 0 : e.includes(1)) && void 0 !== u ? u : true) d.push(t);
                if (null !== (l = null === e || void 0 === e ? void 0 : e.includes(2)) && void 0 !== l ? l : true) v.push(t);
                if (null !== (c = null === e || void 0 === e ? void 0 : e.includes(3)) && void 0 !== c ? c : true) p.push(t);
                if (null !== (f = null === e || void 0 === e ? void 0 : e.includes(4)) && void 0 !== f ? f : true) w.push(t);
                if (null !== (a = null === e || void 0 === e ? void 0 : e.includes(5)) && void 0 !== a ? a : true) g.push(t);
            }
        } else {
            this.root = i.root;
            this.parent = i;
            h = this.traceSinks = i.traceSinks;
            d = this.debugSinks = i.debugSinks;
            v = this.infoSinks = i.infoSinks;
            p = this.warnSinks = i.warnSinks;
            w = this.errorSinks = i.errorSinks;
            g = this.fatalSinks = i.fatalSinks;
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
        let r = e[t];
        if (void 0 === r) r = e[t] = new DefaultLogger(this.config, this.factory, void 0, this.scope.concat(t), this);
        return r;
    }
    emit(t, e, r, n) {
        const s = i(r) ? r() : r;
        const o = this.factory.createLogEvent(this, e, s, n);
        for (let e = 0, r = t.length; e < r; ++e) t[e].handleEvent(o);
    }
};

Mt([ m ], exports.DefaultLogger.prototype, "trace", null);

Mt([ m ], exports.DefaultLogger.prototype, "debug", null);

Mt([ m ], exports.DefaultLogger.prototype, "info", null);

Mt([ m ], exports.DefaultLogger.prototype, "warn", null);

Mt([ m ], exports.DefaultLogger.prototype, "error", null);

Mt([ m ], exports.DefaultLogger.prototype, "fatal", null);

exports.DefaultLogger = Mt([ kt(0, Ft), kt(1, Ut), kt(2, et(Lt)), kt(3, nt(Tt)), kt(4, it) ], exports.DefaultLogger);

const Qt = A({
    create({level: t = 3, colorOptions: e = 0, sinks: r = []} = {}) {
        return A({
            register(n) {
                n.register(bt.instance(Ft, new LogConfig(e, t)));
                for (const t of r) if (i(t)) n.register(bt.singleton(Lt, t)); else n.register(t);
                return n;
            }
        });
    }
});

const _t = Q.createInterface((t => t.singleton(ModuleLoader)));

function Gt(t) {
    return t;
}

class ModuleTransformer {
    constructor(t) {
        this.$transform = t;
        this.A = new Map;
        this.j = new Map;
    }
    transform(t) {
        if (t instanceof Promise) return this.I(t); else if ("object" === typeof t && null !== t) return this.O(t); else throw new Error(`Invalid input: ${String(t)}. Expected Promise or Object.`);
    }
    I(t) {
        if (this.A.has(t)) return this.A.get(t);
        const e = t.then((t => this.O(t)));
        this.A.set(t, e);
        void e.then((e => {
            this.A.set(t, e);
        }));
        return e;
    }
    O(t) {
        if (this.j.has(t)) return this.j.get(t);
        const e = this.$transform(this.M(t));
        this.j.set(t, e);
        if (e instanceof Promise) void e.then((e => {
            this.j.set(t, e);
        }));
        return e;
    }
    M(t) {
        if (null == t) throw new Error(`Invalid input: ${String(t)}. Expected Object.`);
        if ("object" !== typeof t) return new AnalyzedModule(t, []);
        let e;
        let r;
        let n;
        let s;
        const o = [];
        for (const u in t) {
            switch (typeof (e = t[u])) {
              case "object":
                if (null === e) continue;
                r = i(e.register);
                n = false;
                s = At;
                break;

              case "function":
                r = i(e.register);
                n = void 0 !== e.prototype;
                s = T.resource.getAll(e);
                break;

              default:
                continue;
            }
            o.push(new ModuleItem(u, e, r, n, s));
        }
        return new AnalyzedModule(t, o);
    }
}

class ModuleLoader {
    constructor() {
        this.transformers = new Map;
    }
    load(t, e = Gt) {
        const r = this.transformers;
        let n = r.get(e);
        if (void 0 === n) r.set(e, n = new ModuleTransformer(e));
        return n.transform(t);
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
    constructor(t, e, r, n, i) {
        this.key = t;
        this.value = e;
        this.isRegistry = r;
        this.isConstructable = n;
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

const Kt = Q.createInterface("IEventAggregator", (t => t.singleton(EventAggregator)));

class EventAggregator {
    constructor() {
        this.eventLookup = {};
        this.messageHandlers = [];
    }
    publish(t, e) {
        if (!t) throw new Error(`Invalid channel name or instance: ${t}.`);
        if (s(t)) {
            let r = this.eventLookup[t];
            if (void 0 !== r) {
                r = r.slice();
                let n = r.length;
                while (n-- > 0) r[n](e, t);
            }
        } else {
            const e = this.messageHandlers.slice();
            let r = e.length;
            while (r-- > 0) e[r].handle(t);
        }
    }
    subscribe(t, e) {
        if (!t) throw new Error(`Invalid channel name or type: ${t}.`);
        let r;
        let n;
        if (s(t)) {
            if (void 0 === this.eventLookup[t]) this.eventLookup[t] = [];
            r = e;
            n = this.eventLookup[t];
        } else {
            r = new Handler(t, e);
            n = this.messageHandlers;
        }
        n.push(r);
        return {
            dispose() {
                const t = n.indexOf(r);
                if (-1 !== t) n.splice(t, 1);
            }
        };
    }
    subscribeOnce(t, e) {
        const r = this.subscribe(t, (function(t, n) {
            r.dispose();
            e(t, n);
        }));
        return r;
    }
}

exports.AnalyzedModule = AnalyzedModule;

exports.ContainerConfiguration = ContainerConfiguration;

exports.DI = Q;

exports.DefaultLogEvent = DefaultLogEvent;

exports.DefaultResolver = z;

exports.EventAggregator = EventAggregator;

exports.IContainer = K;

exports.IEventAggregator = Kt;

exports.ILogConfig = Ft;

exports.ILogEventFactory = Ut;

exports.ILogger = St;

exports.IModuleLoader = _t;

exports.IPlatform = Ot;

exports.IServiceLocator = H;

exports.ISink = Lt;

exports.InstanceProvider = InstanceProvider;

exports.LogConfig = LogConfig;

exports.LoggerConfiguration = Qt;

exports.ModuleItem = ModuleItem;

exports.Protocol = T;

exports.Registration = bt;

exports.all = et;

exports.bound = m;

exports.camelCase = h;

exports.compareNumber = R;

exports.emptyArray = At;

exports.emptyObject = jt;

exports.factory = st;

exports.firstDefined = C;

exports.format = Nt;

exports.fromAnnotationOrDefinitionOrTypeOrDefault = P;

exports.fromAnnotationOrTypeOrDefault = N;

exports.fromDefinitionOrDefault = W;

exports.getPrototypeChain = E;

exports.ignore = it;

exports.inject = V;

exports.isArrayIndex = l;

exports.isNativeFunction = j;

exports.isNumberOrBigInt = c;

exports.isStringOrDate = f;

exports.kebabCase = v;

exports.lazy = rt;

exports.mergeArrays = b;

exports.mergeDistinct = y;

exports.mergeObjects = $;

exports.newInstanceForScope = ot;

exports.newInstanceOf = ut;

exports.nextId = g;

exports.noop = It;

exports.onResolve = I;

exports.optional = nt;

exports.pascalCase = d;

exports.resetId = x;

exports.resolveAll = O;

exports.singleton = Z;

exports.sink = Pt;

exports.toArray = p;

exports.transient = X;
//# sourceMappingURL=index.cjs.map
