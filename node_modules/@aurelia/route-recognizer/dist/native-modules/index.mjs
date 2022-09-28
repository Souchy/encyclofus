class Parameter {
    constructor(t, s, e) {
        this.name = t;
        this.isOptional = s;
        this.isStar = e;
    }
}

class ConfigurableRoute {
    constructor(t, s, e) {
        this.path = t;
        this.caseSensitive = s;
        this.handler = e;
    }
}

class Endpoint {
    constructor(t, s) {
        this.route = t;
        this.params = s;
    }
}

class RecognizedRoute {
    constructor(t, s) {
        this.endpoint = t;
        this.params = s;
    }
}

class Candidate {
    constructor(t, s, e, n) {
        var i;
        this.chars = t;
        this.states = s;
        this.skippedStates = e;
        this.result = n;
        this.head = s[s.length - 1];
        this.endpoint = null === (i = this.head) || void 0 === i ? void 0 : i.endpoint;
    }
    advance(t) {
        const {chars: s, states: e, skippedStates: n, result: i} = this;
        let r = null;
        let o = 0;
        const l = e[e.length - 1];
        function u(c, a) {
            if (c.isMatch(t)) if (1 === ++o) r = c; else i.add(new Candidate(s.concat(t), e.concat(c), null === a ? n : n.concat(a), i));
            if (null === l.segment && c.isOptional && null !== c.nextStates) {
                if (c.nextStates.length > 1) throw new Error(`${c.nextStates.length} nextStates`);
                const t = c.nextStates[0];
                if (!t.isSeparator) throw new Error(`Not a separator`);
                if (null !== t.nextStates) for (const s of t.nextStates) u(s, c);
            }
        }
        if (l.isDynamic) u(l, null);
        if (null !== l.nextStates) for (const t of l.nextStates) u(t, null);
        if (null !== r) {
            e.push(this.head = r);
            s.push(t);
            if (null !== r.endpoint) this.endpoint = r.endpoint;
        }
        if (0 === o) i.remove(this);
    }
    finalize() {
        function t(s, e) {
            const n = e.nextStates;
            if (null !== n) if (1 === n.length && null === n[0].segment) t(s, n[0]); else for (const e of n) if (e.isOptional && null !== e.endpoint) {
                s.push(e);
                if (null !== e.nextStates) for (const n of e.nextStates) t(s, n);
                break;
            }
        }
        t(this.skippedStates, this.head);
    }
    getParams() {
        const {states: t, chars: s, endpoint: e} = this;
        const n = {};
        for (const t of e.params) n[t.name] = void 0;
        for (let e = 0, i = t.length; e < i; ++e) {
            const i = t[e];
            if (i.isDynamic) {
                const t = i.segment.name;
                if (void 0 === n[t]) n[t] = s[e]; else n[t] += s[e];
            }
        }
        return n;
    }
    compareTo(t) {
        const s = this.states;
        const e = t.states;
        for (let t = 0, n = 0, i = Math.max(s.length, e.length); t < i; ++t) {
            let i = s[t];
            if (void 0 === i) return 1;
            let r = e[n];
            if (void 0 === r) return -1;
            let o = i.segment;
            let l = r.segment;
            if (null === o) {
                if (null === l) {
                    ++n;
                    continue;
                }
                if (void 0 === (i = s[++t])) return 1;
                o = i.segment;
            } else if (null === l) {
                if (void 0 === (r = e[++n])) return -1;
                l = r.segment;
            }
            if (o.kind < l.kind) return 1;
            if (o.kind > l.kind) return -1;
            ++n;
        }
        const n = this.skippedStates;
        const i = t.skippedStates;
        const r = n.length;
        const o = i.length;
        if (r < o) return 1;
        if (r > o) return -1;
        for (let t = 0; t < r; ++t) {
            const s = n[t];
            const e = i[t];
            if (s.length < e.length) return 1;
            if (s.length > e.length) return -1;
        }
        return 0;
    }
}

function t(t) {
    return null !== t.head.endpoint;
}

function s(t, s) {
    return t.compareTo(s);
}

class RecognizeResult {
    constructor(t) {
        this.candidates = [];
        this.candidates = [ new Candidate([ "" ], [ t ], [], this) ];
    }
    get isEmpty() {
        return 0 === this.candidates.length;
    }
    getSolution() {
        const e = this.candidates.filter(t);
        if (0 === e.length) return null;
        for (const t of e) t.finalize();
        e.sort(s);
        return e[0];
    }
    add(t) {
        this.candidates.push(t);
    }
    remove(t) {
        this.candidates.splice(this.candidates.indexOf(t), 1);
    }
    advance(t) {
        const s = this.candidates.slice();
        for (const e of s) e.advance(t);
    }
}

class RouteRecognizer {
    constructor() {
        this.rootState = new State(null, null, "");
        this.cache = new Map;
        this.endpointLookup = new Map;
    }
    add(t) {
        if (t instanceof Array) for (const s of t) this.$add(s); else this.$add(t);
        this.cache.clear();
    }
    $add(t) {
        const s = t.path;
        const n = this.endpointLookup;
        if (n.has(s)) throw new Error(`Cannot add duplicate path '${s}'.`);
        const i = new ConfigurableRoute(s, true === t.caseSensitive, t.handler);
        const r = "" === s ? [ "" ] : s.split("/").filter(e);
        const o = [];
        let l = this.rootState;
        for (const t of r) {
            l = l.append(null, "/");
            switch (t.charAt(0)) {
              case ":":
                {
                    const s = t.endsWith("?");
                    const e = s ? t.slice(1, -1) : t.slice(1);
                    o.push(new Parameter(e, s, false));
                    l = new DynamicSegment(e, s).appendTo(l);
                    break;
                }

              case "*":
                {
                    const s = t.slice(1);
                    o.push(new Parameter(s, true, true));
                    l = new StarSegment(s).appendTo(l);
                    break;
                }

              default:
                l = new StaticSegment(t, i.caseSensitive).appendTo(l);
                break;
            }
        }
        const u = new Endpoint(i, o);
        l.setEndpoint(u);
        n.set(s, u);
    }
    recognize(t) {
        let s = this.cache.get(t);
        if (void 0 === s) this.cache.set(t, s = this.$recognize(t));
        return s;
    }
    $recognize(t) {
        t = decodeURI(t);
        if (!t.startsWith("/")) t = `/${t}`;
        if (t.length > 1 && t.endsWith("/")) t = t.slice(0, -1);
        const s = new RecognizeResult(this.rootState);
        for (let e = 0, n = t.length; e < n; ++e) {
            const n = t.charAt(e);
            s.advance(n);
            if (s.isEmpty) return null;
        }
        const e = s.getSolution();
        if (null === e) return null;
        const {endpoint: n} = e;
        const i = e.getParams();
        return new RecognizedRoute(n, i);
    }
    getEndpoint(t) {
        var s;
        return null !== (s = this.endpointLookup.get(t)) && void 0 !== s ? s : null;
    }
}

class State {
    constructor(t, s, e) {
        this.prevState = t;
        this.segment = s;
        this.value = e;
        this.nextStates = null;
        this.endpoint = null;
        switch (null === s || void 0 === s ? void 0 : s.kind) {
          case 2:
            this.length = t.length + 1;
            this.isSeparator = false;
            this.isDynamic = true;
            this.isOptional = s.optional;
            break;

          case 1:
            this.length = t.length + 1;
            this.isSeparator = false;
            this.isDynamic = true;
            this.isOptional = false;
            break;

          case 3:
            this.length = t.length + 1;
            this.isSeparator = false;
            this.isDynamic = false;
            this.isOptional = false;
            break;

          case void 0:
            this.length = null === t ? 0 : t.length;
            this.isSeparator = true;
            this.isDynamic = false;
            this.isOptional = false;
            break;
        }
    }
    append(t, s) {
        let e;
        let n = this.nextStates;
        if (null === n) {
            e = void 0;
            n = this.nextStates = [];
        } else if (null === t) e = n.find((t => t.value === s)); else e = n.find((s => {
            var e;
            return null === (e = s.segment) || void 0 === e ? void 0 : e.equals(t);
        }));
        if (void 0 === e) n.push(e = new State(this, t, s));
        return e;
    }
    setEndpoint(t) {
        if (null !== this.endpoint) throw new Error(`Cannot add ambiguous route. The pattern '${t.route.path}' clashes with '${this.endpoint.route.path}'`);
        this.endpoint = t;
        if (this.isOptional) {
            this.prevState.setEndpoint(t);
            if (this.prevState.isSeparator && null !== this.prevState.prevState) this.prevState.prevState.setEndpoint(t);
        }
    }
    isMatch(t) {
        const s = this.segment;
        switch (null === s || void 0 === s ? void 0 : s.kind) {
          case 2:
            return !this.value.includes(t);

          case 1:
            return true;

          case 3:
          case void 0:
            return this.value.includes(t);
        }
    }
}

function e(t) {
    return t.length > 0;
}

var n;

(function(t) {
    t[t["star"] = 1] = "star";
    t[t["dynamic"] = 2] = "dynamic";
    t[t["static"] = 3] = "static";
})(n || (n = {}));

class StaticSegment {
    constructor(t, s) {
        this.value = t;
        this.caseSensitive = s;
    }
    get kind() {
        return 3;
    }
    appendTo(t) {
        const {value: s, value: {length: e}} = this;
        if (this.caseSensitive) for (let n = 0; n < e; ++n) t = t.append(this, s.charAt(n)); else for (let n = 0; n < e; ++n) {
            const e = s.charAt(n);
            t = t.append(this, e.toUpperCase() + e.toLowerCase());
        }
        return t;
    }
    equals(t) {
        return 3 === t.kind && t.caseSensitive === this.caseSensitive && t.value === this.value;
    }
}

class DynamicSegment {
    constructor(t, s) {
        this.name = t;
        this.optional = s;
    }
    get kind() {
        return 2;
    }
    appendTo(t) {
        t = t.append(this, "/");
        return t;
    }
    equals(t) {
        return 2 === t.kind && t.optional === this.optional && t.name === this.name;
    }
}

class StarSegment {
    constructor(t) {
        this.name = t;
    }
    get kind() {
        return 1;
    }
    appendTo(t) {
        t = t.append(this, "");
        return t;
    }
    equals(t) {
        return 1 === t.kind && t.name === this.name;
    }
}

export { ConfigurableRoute, Endpoint, Parameter, RecognizedRoute, RouteRecognizer };

