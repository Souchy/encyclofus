class Parameter {
    constructor(name, isOptional, isStar) {
        this.name = name;
        this.isOptional = isOptional;
        this.isStar = isStar;
    }
}
class ConfigurableRoute {
    constructor(path, caseSensitive, handler) {
        this.path = path;
        this.caseSensitive = caseSensitive;
        this.handler = handler;
    }
}
class Endpoint {
    constructor(route, params) {
        this.route = route;
        this.params = params;
    }
}
class RecognizedRoute {
    constructor(endpoint, params) {
        this.endpoint = endpoint;
        this.params = params;
    }
}
class Candidate {
    constructor(chars, states, skippedStates, result) {
        var _a;
        this.chars = chars;
        this.states = states;
        this.skippedStates = skippedStates;
        this.result = result;
        this.head = states[states.length - 1];
        this.endpoint = (_a = this.head) === null || _a === void 0 ? void 0 : _a.endpoint;
    }
    advance(ch) {
        const { chars, states, skippedStates, result } = this;
        let stateToAdd = null;
        let matchCount = 0;
        const state = states[states.length - 1];
        function $process(nextState, skippedState) {
            if (nextState.isMatch(ch)) {
                if (++matchCount === 1) {
                    stateToAdd = nextState;
                }
                else {
                    result.add(new Candidate(chars.concat(ch), states.concat(nextState), skippedState === null ? skippedStates : skippedStates.concat(skippedState), result));
                }
            }
            if (state.segment === null && nextState.isOptional && nextState.nextStates !== null) {
                if (nextState.nextStates.length > 1) {
                    throw new Error(`${nextState.nextStates.length} nextStates`);
                }
                const separator = nextState.nextStates[0];
                if (!separator.isSeparator) {
                    throw new Error(`Not a separator`);
                }
                if (separator.nextStates !== null) {
                    for (const $nextState of separator.nextStates) {
                        $process($nextState, nextState);
                    }
                }
            }
        }
        if (state.isDynamic) {
            $process(state, null);
        }
        if (state.nextStates !== null) {
            for (const nextState of state.nextStates) {
                $process(nextState, null);
            }
        }
        if (stateToAdd !== null) {
            states.push(this.head = stateToAdd);
            chars.push(ch);
            if (stateToAdd.endpoint !== null) {
                this.endpoint = stateToAdd.endpoint;
            }
        }
        if (matchCount === 0) {
            result.remove(this);
        }
    }
    finalize() {
        function collectSkippedStates(skippedStates, state) {
            const nextStates = state.nextStates;
            if (nextStates !== null) {
                if (nextStates.length === 1 && nextStates[0].segment === null) {
                    collectSkippedStates(skippedStates, nextStates[0]);
                }
                else {
                    for (const nextState of nextStates) {
                        if (nextState.isOptional && nextState.endpoint !== null) {
                            skippedStates.push(nextState);
                            if (nextState.nextStates !== null) {
                                for (const $nextState of nextState.nextStates) {
                                    collectSkippedStates(skippedStates, $nextState);
                                }
                            }
                            break;
                        }
                    }
                }
            }
        }
        collectSkippedStates(this.skippedStates, this.head);
    }
    getParams() {
        const { states, chars, endpoint } = this;
        const params = {};
        for (const param of endpoint.params) {
            params[param.name] = void 0;
        }
        for (let i = 0, ii = states.length; i < ii; ++i) {
            const state = states[i];
            if (state.isDynamic) {
                const name = state.segment.name;
                if (params[name] === void 0) {
                    params[name] = chars[i];
                }
                else {
                    params[name] += chars[i];
                }
            }
        }
        return params;
    }
    compareTo(b) {
        const statesA = this.states;
        const statesB = b.states;
        for (let iA = 0, iB = 0, ii = Math.max(statesA.length, statesB.length); iA < ii; ++iA) {
            let stateA = statesA[iA];
            if (stateA === void 0) {
                return 1;
            }
            let stateB = statesB[iB];
            if (stateB === void 0) {
                return -1;
            }
            let segmentA = stateA.segment;
            let segmentB = stateB.segment;
            if (segmentA === null) {
                if (segmentB === null) {
                    ++iB;
                    continue;
                }
                if ((stateA = statesA[++iA]) === void 0) {
                    return 1;
                }
                segmentA = stateA.segment;
            }
            else if (segmentB === null) {
                if ((stateB = statesB[++iB]) === void 0) {
                    return -1;
                }
                segmentB = stateB.segment;
            }
            if (segmentA.kind < segmentB.kind) {
                return 1;
            }
            if (segmentA.kind > segmentB.kind) {
                return -1;
            }
            ++iB;
        }
        const skippedStatesA = this.skippedStates;
        const skippedStatesB = b.skippedStates;
        const skippedStatesALen = skippedStatesA.length;
        const skippedStatesBLen = skippedStatesB.length;
        if (skippedStatesALen < skippedStatesBLen) {
            return 1;
        }
        if (skippedStatesALen > skippedStatesBLen) {
            return -1;
        }
        for (let i = 0; i < skippedStatesALen; ++i) {
            const skippedStateA = skippedStatesA[i];
            const skippedStateB = skippedStatesB[i];
            if (skippedStateA.length < skippedStateB.length) {
                return 1;
            }
            if (skippedStateA.length > skippedStateB.length) {
                return -1;
            }
        }
        return 0;
    }
}
function hasEndpoint(candidate) {
    return candidate.head.endpoint !== null;
}
function compareChains(a, b) {
    return a.compareTo(b);
}
class RecognizeResult {
    constructor(rootState) {
        this.candidates = [];
        this.candidates = [new Candidate([''], [rootState], [], this)];
    }
    get isEmpty() {
        return this.candidates.length === 0;
    }
    getSolution() {
        const candidates = this.candidates.filter(hasEndpoint);
        if (candidates.length === 0) {
            return null;
        }
        for (const candidate of candidates) {
            candidate.finalize();
        }
        candidates.sort(compareChains);
        return candidates[0];
    }
    add(candidate) {
        this.candidates.push(candidate);
    }
    remove(candidate) {
        this.candidates.splice(this.candidates.indexOf(candidate), 1);
    }
    advance(ch) {
        const candidates = this.candidates.slice();
        for (const candidate of candidates) {
            candidate.advance(ch);
        }
    }
}
class RouteRecognizer {
    constructor() {
        this.rootState = new State(null, null, '');
        this.cache = new Map();
        this.endpointLookup = new Map();
    }
    add(routeOrRoutes) {
        if (routeOrRoutes instanceof Array) {
            for (const route of routeOrRoutes) {
                this.$add(route);
            }
        }
        else {
            this.$add(routeOrRoutes);
        }
        this.cache.clear();
    }
    $add(route) {
        const path = route.path;
        const lookup = this.endpointLookup;
        if (lookup.has(path))
            throw new Error(`Cannot add duplicate path '${path}'.`);
        const $route = new ConfigurableRoute(path, route.caseSensitive === true, route.handler);
        const parts = path === '' ? [''] : path.split('/').filter(isNotEmpty);
        const params = [];
        let state = this.rootState;
        for (const part of parts) {
            state = state.append(null, '/');
            switch (part.charAt(0)) {
                case ':': {
                    const isOptional = part.endsWith('?');
                    const name = isOptional ? part.slice(1, -1) : part.slice(1);
                    params.push(new Parameter(name, isOptional, false));
                    state = new DynamicSegment(name, isOptional).appendTo(state);
                    break;
                }
                case '*': {
                    const name = part.slice(1);
                    params.push(new Parameter(name, true, true));
                    state = new StarSegment(name).appendTo(state);
                    break;
                }
                default: {
                    state = new StaticSegment(part, $route.caseSensitive).appendTo(state);
                    break;
                }
            }
        }
        const endpoint = new Endpoint($route, params);
        state.setEndpoint(endpoint);
        lookup.set(path, endpoint);
    }
    recognize(path) {
        let result = this.cache.get(path);
        if (result === void 0) {
            this.cache.set(path, result = this.$recognize(path));
        }
        return result;
    }
    $recognize(path) {
        path = decodeURI(path);
        if (!path.startsWith('/')) {
            path = `/${path}`;
        }
        if (path.length > 1 && path.endsWith('/')) {
            path = path.slice(0, -1);
        }
        const result = new RecognizeResult(this.rootState);
        for (let i = 0, ii = path.length; i < ii; ++i) {
            const ch = path.charAt(i);
            result.advance(ch);
            if (result.isEmpty) {
                return null;
            }
        }
        const candidate = result.getSolution();
        if (candidate === null) {
            return null;
        }
        const { endpoint } = candidate;
        const params = candidate.getParams();
        return new RecognizedRoute(endpoint, params);
    }
    getEndpoint(path) {
        var _a;
        return (_a = this.endpointLookup.get(path)) !== null && _a !== void 0 ? _a : null;
    }
}
class State {
    constructor(prevState, segment, value) {
        this.prevState = prevState;
        this.segment = segment;
        this.value = value;
        this.nextStates = null;
        this.endpoint = null;
        switch (segment === null || segment === void 0 ? void 0 : segment.kind) {
            case 2:
                this.length = prevState.length + 1;
                this.isSeparator = false;
                this.isDynamic = true;
                this.isOptional = segment.optional;
                break;
            case 1:
                this.length = prevState.length + 1;
                this.isSeparator = false;
                this.isDynamic = true;
                this.isOptional = false;
                break;
            case 3:
                this.length = prevState.length + 1;
                this.isSeparator = false;
                this.isDynamic = false;
                this.isOptional = false;
                break;
            case undefined:
                this.length = prevState === null ? 0 : prevState.length;
                this.isSeparator = true;
                this.isDynamic = false;
                this.isOptional = false;
                break;
        }
    }
    append(segment, value) {
        let state;
        let nextStates = this.nextStates;
        if (nextStates === null) {
            state = void 0;
            nextStates = this.nextStates = [];
        }
        else if (segment === null) {
            state = nextStates.find(s => s.value === value);
        }
        else {
            state = nextStates.find(s => { var _a; return (_a = s.segment) === null || _a === void 0 ? void 0 : _a.equals(segment); });
        }
        if (state === void 0) {
            nextStates.push(state = new State(this, segment, value));
        }
        return state;
    }
    setEndpoint(endpoint) {
        if (this.endpoint !== null) {
            throw new Error(`Cannot add ambiguous route. The pattern '${endpoint.route.path}' clashes with '${this.endpoint.route.path}'`);
        }
        this.endpoint = endpoint;
        if (this.isOptional) {
            this.prevState.setEndpoint(endpoint);
            if (this.prevState.isSeparator && this.prevState.prevState !== null) {
                this.prevState.prevState.setEndpoint(endpoint);
            }
        }
    }
    isMatch(ch) {
        const segment = this.segment;
        switch (segment === null || segment === void 0 ? void 0 : segment.kind) {
            case 2:
                return !this.value.includes(ch);
            case 1:
                return true;
            case 3:
            case undefined:
                return this.value.includes(ch);
        }
    }
}
function isNotEmpty(segment) {
    return segment.length > 0;
}
var SegmentKind;
(function (SegmentKind) {
    SegmentKind[SegmentKind["star"] = 1] = "star";
    SegmentKind[SegmentKind["dynamic"] = 2] = "dynamic";
    SegmentKind[SegmentKind["static"] = 3] = "static";
})(SegmentKind || (SegmentKind = {}));
class StaticSegment {
    constructor(value, caseSensitive) {
        this.value = value;
        this.caseSensitive = caseSensitive;
    }
    get kind() { return 3; }
    appendTo(state) {
        const { value, value: { length } } = this;
        if (this.caseSensitive) {
            for (let i = 0; i < length; ++i) {
                state = state.append(this, value.charAt(i));
            }
        }
        else {
            for (let i = 0; i < length; ++i) {
                const ch = value.charAt(i);
                state = state.append(this, ch.toUpperCase() + ch.toLowerCase());
            }
        }
        return state;
    }
    equals(b) {
        return (b.kind === 3 &&
            b.caseSensitive === this.caseSensitive &&
            b.value === this.value);
    }
}
class DynamicSegment {
    constructor(name, optional) {
        this.name = name;
        this.optional = optional;
    }
    get kind() { return 2; }
    appendTo(state) {
        state = state.append(this, '/');
        return state;
    }
    equals(b) {
        return (b.kind === 2 &&
            b.optional === this.optional &&
            b.name === this.name);
    }
}
class StarSegment {
    constructor(name) {
        this.name = name;
    }
    get kind() { return 1; }
    appendTo(state) {
        state = state.append(this, '');
        return state;
    }
    equals(b) {
        return (b.kind === 1 &&
            b.name === this.name);
    }
}

export { ConfigurableRoute, Endpoint, Parameter, RecognizedRoute, RouteRecognizer };
//# sourceMappingURL=index.dev.mjs.map
