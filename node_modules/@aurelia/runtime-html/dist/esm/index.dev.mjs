import { BindingMode, subscriberCollection, withFlushQueue, connectable, registerAliases, ConnectableSwitcher, ProxyObservable, Scope, ICoercionConfiguration, IObserverLocator, IExpressionParser, AccessScopeExpression, DelegationStrategy, BindingBehaviorExpression, BindingBehaviorFactory, PrimitiveLiteralExpression, bindingBehavior, BindingInterceptor, ISignaler, PropertyAccessor, INodeObserverLocator, SetterObserver, IDirtyChecker, alias, applyMutationsToIndices, getCollectionObserver as getCollectionObserver$1, BindingContext, synchronizeIndices, valueConverter } from '@aurelia/runtime';
export { LifecycleFlags, bindingBehavior, valueConverter } from '@aurelia/runtime';
import { Protocol, getPrototypeChain, firstDefined, kebabCase, noop, Registration, DI, emptyArray, all, IPlatform as IPlatform$1, mergeArrays, fromDefinitionOrDefault, pascalCase, fromAnnotationOrTypeOrDefault, fromAnnotationOrDefinitionOrTypeOrDefault, IContainer, nextId, optional, InstanceProvider, ILogger, resolveAll, onResolve, camelCase, toArray, emptyObject, IServiceLocator, compareNumber, transient } from '@aurelia/kernel';
import { Metadata, isObject } from '@aurelia/metadata';
import { TaskAbortError } from '@aurelia/platform';
import { BrowserPlatform } from '@aurelia/platform-browser';

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

function __param(paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
}

const getOwnMetadata = Metadata.getOwn;
const hasOwnMetadata = Metadata.hasOwn;
const defineMetadata = Metadata.define;
const { annotation, resource } = Protocol;
const getAnnotationKeyFor = annotation.keyFor;
const getResourceKeyFor = resource.keyFor;
const appendResourceKey = resource.appendTo;
const appendAnnotationKey = annotation.appendTo;
const getAllAnnotations = annotation.getKeys;

const createLookup = () => Object.create(null);
const hasOwnProperty = Object.prototype.hasOwnProperty;
const IsDataAttribute = createLookup();
const isDataAttribute = (obj, key, svgAnalyzer) => {
    if (IsDataAttribute[key] === true) {
        return true;
    }
    if (!isString(key)) {
        return false;
    }
    const prefix = key.slice(0, 5);
    return IsDataAttribute[key] =
        prefix === 'aria-' ||
            prefix === 'data-' ||
            svgAnalyzer.isStandardSvgAttribute(obj, key);
};
const isPromise = (v) => v instanceof Promise;
const isFunction = (v) => typeof v === 'function';
const isString = (v) => typeof v === 'string';
const defineProp = Object.defineProperty;
const rethrow = (err) => { throw err; };

function bindable(configOrTarget, prop) {
    let config;
    function decorator($target, $prop) {
        if (arguments.length > 1) {
            config.property = $prop;
        }
        defineMetadata(baseName$1, BindableDefinition.create($prop, $target, config), $target.constructor, $prop);
        appendAnnotationKey($target.constructor, Bindable.keyFrom($prop));
    }
    if (arguments.length > 1) {
        config = {};
        decorator(configOrTarget, prop);
        return;
    }
    else if (isString(configOrTarget)) {
        config = {};
        return decorator;
    }
    config = configOrTarget === void 0 ? {} : configOrTarget;
    return decorator;
}
function isBindableAnnotation(key) {
    return key.startsWith(baseName$1);
}
const baseName$1 = getAnnotationKeyFor('bindable');
const Bindable = Object.freeze({
    name: baseName$1,
    keyFrom: (name) => `${baseName$1}:${name}`,
    from(type, ...bindableLists) {
        const bindables = {};
        const isArray = Array.isArray;
        function addName(name) {
            bindables[name] = BindableDefinition.create(name, type);
        }
        function addDescription(name, def) {
            bindables[name] = def instanceof BindableDefinition ? def : BindableDefinition.create(name, type, def);
        }
        function addList(maybeList) {
            if (isArray(maybeList)) {
                maybeList.forEach(addName);
            }
            else if (maybeList instanceof BindableDefinition) {
                bindables[maybeList.property] = maybeList;
            }
            else if (maybeList !== void 0) {
                Object.keys(maybeList).forEach(name => addDescription(name, maybeList[name]));
            }
        }
        bindableLists.forEach(addList);
        return bindables;
    },
    for(Type) {
        let def;
        const builder = {
            add(configOrProp) {
                let prop;
                let config;
                if (isString(configOrProp)) {
                    prop = configOrProp;
                    config = { property: prop };
                }
                else {
                    prop = configOrProp.property;
                    config = configOrProp;
                }
                def = BindableDefinition.create(prop, Type, config);
                if (!hasOwnMetadata(baseName$1, Type, prop)) {
                    appendAnnotationKey(Type, Bindable.keyFrom(prop));
                }
                defineMetadata(baseName$1, def, Type, prop);
                return builder;
            },
            mode(mode) {
                def.mode = mode;
                return builder;
            },
            callback(callback) {
                def.callback = callback;
                return builder;
            },
            attribute(attribute) {
                def.attribute = attribute;
                return builder;
            },
            primary() {
                def.primary = true;
                return builder;
            },
            set(setInterpreter) {
                def.set = setInterpreter;
                return builder;
            }
        };
        return builder;
    },
    getAll(Type) {
        const propStart = baseName$1.length + 1;
        const defs = [];
        const prototypeChain = getPrototypeChain(Type);
        let iProto = prototypeChain.length;
        let iDefs = 0;
        let keys;
        let keysLen;
        let Class;
        let i;
        while (--iProto >= 0) {
            Class = prototypeChain[iProto];
            keys = getAllAnnotations(Class).filter(isBindableAnnotation);
            keysLen = keys.length;
            for (i = 0; i < keysLen; ++i) {
                defs[iDefs++] = getOwnMetadata(baseName$1, Class, keys[i].slice(propStart));
            }
        }
        return defs;
    },
});
class BindableDefinition {
    constructor(attribute, callback, mode, primary, property, set) {
        this.attribute = attribute;
        this.callback = callback;
        this.mode = mode;
        this.primary = primary;
        this.property = property;
        this.set = set;
    }
    static create(prop, target, def = {}) {
        return new BindableDefinition(firstDefined(def.attribute, kebabCase(prop)), firstDefined(def.callback, `${prop}Changed`), firstDefined(def.mode, BindingMode.toView), firstDefined(def.primary, false), firstDefined(def.property, prop), firstDefined(def.set, getInterceptor(prop, target, def)));
    }
}
function coercer(target, property, _descriptor) {
    Coercer.define(target, property);
}
const Coercer = {
    key: getAnnotationKeyFor('coercer'),
    define(target, property) {
        defineMetadata(Coercer.key, target[property].bind(target), target);
    },
    for(target) {
        return getOwnMetadata(Coercer.key, target);
    }
};
function getInterceptor(prop, target, def = {}) {
    var _a, _b, _c;
    const type = (_b = (_a = def.type) !== null && _a !== void 0 ? _a : Reflect.getMetadata('design:type', target, prop)) !== null && _b !== void 0 ? _b : null;
    if (type == null) {
        return noop;
    }
    let coercer;
    switch (type) {
        case Number:
        case Boolean:
        case String:
        case BigInt:
            coercer = type;
            break;
        default: {
            const $coercer = type.coerce;
            coercer = typeof $coercer === 'function'
                ? $coercer.bind(type)
                : ((_c = Coercer.for(type)) !== null && _c !== void 0 ? _c : noop);
            break;
        }
    }
    return coercer === noop
        ? coercer
        : createCoercer(coercer, def.nullable);
}
function createCoercer(coercer, nullable) {
    return function (value, coercionConfiguration) {
        var _a;
        if (!(coercionConfiguration === null || coercionConfiguration === void 0 ? void 0 : coercionConfiguration.enableCoercion))
            return value;
        return ((nullable !== null && nullable !== void 0 ? nullable : (((_a = coercionConfiguration === null || coercionConfiguration === void 0 ? void 0 : coercionConfiguration.coerceNullish) !== null && _a !== void 0 ? _a : false) ? false : true)) && value == null)
            ? value
            : coercer(value, coercionConfiguration);
    };
}

class BindableObserver {
    constructor(obj, key, cbName, set, $controller, _coercionConfig) {
        this.set = set;
        this.$controller = $controller;
        this._coercionConfig = _coercionConfig;
        this._value = void 0;
        this._oldValue = void 0;
        this.f = 0;
        const cb = obj[cbName];
        const cbAll = obj.propertyChanged;
        const hasCb = this._hasCb = isFunction(cb);
        const hasCbAll = this._hasCbAll = isFunction(cbAll);
        const hasSetter = this._hasSetter = set !== noop;
        let val;
        this._obj = obj;
        this._key = key;
        this.cb = hasCb ? cb : noop;
        this._cbAll = hasCbAll ? cbAll : noop;
        if (this.cb === void 0 && !hasCbAll && !hasSetter) {
            this._observing = false;
        }
        else {
            this._observing = true;
            val = obj[key];
            this._value = hasSetter && val !== void 0 ? set(val, this._coercionConfig) : val;
            this._createGetterSetter();
        }
    }
    get type() { return 1; }
    getValue() {
        return this._value;
    }
    setValue(newValue, flags) {
        if (this._hasSetter) {
            newValue = this.set(newValue, this._coercionConfig);
        }
        const currentValue = this._value;
        if (this._observing) {
            if (Object.is(newValue, currentValue)) {
                return;
            }
            this._value = newValue;
            this._oldValue = currentValue;
            this.f = flags;
            if (this.$controller == null
                || this.$controller.isBound) {
                if (this._hasCb) {
                    this.cb.call(this._obj, newValue, currentValue, flags);
                }
                if (this._hasCbAll) {
                    this._cbAll.call(this._obj, this._key, newValue, currentValue, flags);
                }
            }
            this.queue.add(this);
        }
        else {
            this._obj[this._key] = newValue;
        }
    }
    subscribe(subscriber) {
        if (!this._observing === false) {
            this._observing = true;
            this._value = this._hasSetter
                ? this.set(this._obj[this._key], this._coercionConfig)
                : this._obj[this._key];
            this._createGetterSetter();
        }
        this.subs.add(subscriber);
    }
    flush() {
        oV$4 = this._oldValue;
        this._oldValue = this._value;
        this.subs.notify(this._value, oV$4, this.f);
    }
    _createGetterSetter() {
        Reflect.defineProperty(this._obj, this._key, {
            enumerable: true,
            configurable: true,
            get: () => this._value,
            set: (value) => {
                this.setValue(value, 0);
            }
        });
    }
}
subscriberCollection(BindableObserver);
withFlushQueue(BindableObserver);
let oV$4 = void 0;

const allResources = function (key) {
    function Resolver(target, property, descriptor) {
        DI.inject(Resolver)(target, property, descriptor);
    }
    Resolver.$isResolver = true;
    Resolver.resolve = function (handler, requestor) {
        if (requestor.root === requestor) {
            return requestor.getAll(key, false);
        }
        return requestor.has(key, false)
            ? requestor.getAll(key, false).concat(requestor.root.getAll(key, false))
            : requestor.root.getAll(key, false);
    };
    return Resolver;
};
const singletonRegistration = Registration.singleton;
const aliasRegistration = Registration.aliasTo;
const instanceRegistration = Registration.instance;
const callbackRegistration = Registration.callback;
const transientRegistration = Registration.transient;

class CharSpec {
    constructor(chars, repeat, isSymbol, isInverted) {
        this.chars = chars;
        this.repeat = repeat;
        this.isSymbol = isSymbol;
        this.isInverted = isInverted;
        if (isInverted) {
            switch (chars.length) {
                case 0:
                    this.has = this._hasOfNoneInverse;
                    break;
                case 1:
                    this.has = this._hasOfSingleInverse;
                    break;
                default:
                    this.has = this._hasOfMultipleInverse;
            }
        }
        else {
            switch (chars.length) {
                case 0:
                    this.has = this._hasOfNone;
                    break;
                case 1:
                    this.has = this._hasOfSingle;
                    break;
                default:
                    this.has = this._hasOfMultiple;
            }
        }
    }
    equals(other) {
        return this.chars === other.chars
            && this.repeat === other.repeat
            && this.isSymbol === other.isSymbol
            && this.isInverted === other.isInverted;
    }
    _hasOfMultiple(char) {
        return this.chars.includes(char);
    }
    _hasOfSingle(char) {
        return this.chars === char;
    }
    _hasOfNone(_char) {
        return false;
    }
    _hasOfMultipleInverse(char) {
        return !this.chars.includes(char);
    }
    _hasOfSingleInverse(char) {
        return this.chars !== char;
    }
    _hasOfNoneInverse(_char) {
        return true;
    }
}
class Interpretation {
    constructor() {
        this.parts = emptyArray;
        this._pattern = '';
        this._currentRecord = {};
        this._partsRecord = {};
    }
    get pattern() {
        const value = this._pattern;
        if (value === '') {
            return null;
        }
        else {
            return value;
        }
    }
    set pattern(value) {
        if (value == null) {
            this._pattern = '';
            this.parts = emptyArray;
        }
        else {
            this._pattern = value;
            this.parts = this._partsRecord[value];
        }
    }
    append(pattern, ch) {
        const currentRecord = this._currentRecord;
        if (currentRecord[pattern] === undefined) {
            currentRecord[pattern] = ch;
        }
        else {
            currentRecord[pattern] += ch;
        }
    }
    next(pattern) {
        const currentRecord = this._currentRecord;
        let partsRecord;
        if (currentRecord[pattern] !== undefined) {
            partsRecord = this._partsRecord;
            if (partsRecord[pattern] === undefined) {
                partsRecord[pattern] = [currentRecord[pattern]];
            }
            else {
                partsRecord[pattern].push(currentRecord[pattern]);
            }
            currentRecord[pattern] = undefined;
        }
    }
}
class AttrParsingState {
    constructor(charSpec, ...patterns) {
        this.charSpec = charSpec;
        this.nextStates = [];
        this.types = null;
        this.isEndpoint = false;
        this.patterns = patterns;
    }
    get pattern() {
        return this.isEndpoint ? this.patterns[0] : null;
    }
    findChild(charSpec) {
        const nextStates = this.nextStates;
        const len = nextStates.length;
        let child = null;
        let i = 0;
        for (; i < len; ++i) {
            child = nextStates[i];
            if (charSpec.equals(child.charSpec)) {
                return child;
            }
        }
        return null;
    }
    append(charSpec, pattern) {
        const patterns = this.patterns;
        if (!patterns.includes(pattern)) {
            patterns.push(pattern);
        }
        let state = this.findChild(charSpec);
        if (state == null) {
            state = new AttrParsingState(charSpec, pattern);
            this.nextStates.push(state);
            if (charSpec.repeat) {
                state.nextStates.push(state);
            }
        }
        return state;
    }
    findMatches(ch, interpretation) {
        const results = [];
        const nextStates = this.nextStates;
        const len = nextStates.length;
        let childLen = 0;
        let child = null;
        let i = 0;
        let j = 0;
        for (; i < len; ++i) {
            child = nextStates[i];
            if (child.charSpec.has(ch)) {
                results.push(child);
                childLen = child.patterns.length;
                j = 0;
                if (child.charSpec.isSymbol) {
                    for (; j < childLen; ++j) {
                        interpretation.next(child.patterns[j]);
                    }
                }
                else {
                    for (; j < childLen; ++j) {
                        interpretation.append(child.patterns[j], ch);
                    }
                }
            }
        }
        return results;
    }
}
class StaticSegment {
    constructor(text) {
        this.text = text;
        const len = this.len = text.length;
        const specs = this.specs = [];
        let i = 0;
        for (; len > i; ++i) {
            specs.push(new CharSpec(text[i], false, false, false));
        }
    }
    eachChar(callback) {
        const len = this.len;
        const specs = this.specs;
        let i = 0;
        for (; len > i; ++i) {
            callback(specs[i]);
        }
    }
}
class DynamicSegment {
    constructor(symbols) {
        this.text = 'PART';
        this.spec = new CharSpec(symbols, true, false, true);
    }
    eachChar(callback) {
        callback(this.spec);
    }
}
class SymbolSegment {
    constructor(text) {
        this.text = text;
        this.spec = new CharSpec(text, false, true, false);
    }
    eachChar(callback) {
        callback(this.spec);
    }
}
class SegmentTypes {
    constructor() {
        this.statics = 0;
        this.dynamics = 0;
        this.symbols = 0;
    }
}
const ISyntaxInterpreter = DI.createInterface('ISyntaxInterpreter', x => x.singleton(SyntaxInterpreter));
class SyntaxInterpreter {
    constructor() {
        this.rootState = new AttrParsingState(null);
        this.initialStates = [this.rootState];
    }
    add(defs) {
        defs = defs.slice(0).sort((d1, d2) => d1.pattern > d2.pattern ? 1 : -1);
        const ii = defs.length;
        let currentState;
        let def;
        let pattern;
        let types;
        let segments;
        let len;
        let charSpecCb;
        let i = 0;
        let j;
        while (ii > i) {
            currentState = this.rootState;
            def = defs[i];
            pattern = def.pattern;
            types = new SegmentTypes();
            segments = this.parse(def, types);
            len = segments.length;
            charSpecCb = (ch) => {
                currentState = currentState.append(ch, pattern);
            };
            for (j = 0; len > j; ++j) {
                segments[j].eachChar(charSpecCb);
            }
            currentState.types = types;
            currentState.isEndpoint = true;
            ++i;
        }
    }
    interpret(name) {
        const interpretation = new Interpretation();
        const len = name.length;
        let states = this.initialStates;
        let i = 0;
        let state;
        for (; i < len; ++i) {
            states = this.getNextStates(states, name.charAt(i), interpretation);
            if (states.length === 0) {
                break;
            }
        }
        states = states.filter(isEndpoint);
        if (states.length > 0) {
            states.sort(sortEndpoint);
            state = states[0];
            if (!state.charSpec.isSymbol) {
                interpretation.next(state.pattern);
            }
            interpretation.pattern = state.pattern;
        }
        return interpretation;
    }
    getNextStates(states, ch, interpretation) {
        const nextStates = [];
        let state = null;
        const len = states.length;
        let i = 0;
        for (; i < len; ++i) {
            state = states[i];
            nextStates.push(...state.findMatches(ch, interpretation));
        }
        return nextStates;
    }
    parse(def, types) {
        const result = [];
        const pattern = def.pattern;
        const len = pattern.length;
        const symbols = def.symbols;
        let i = 0;
        let start = 0;
        let c = '';
        while (i < len) {
            c = pattern.charAt(i);
            if (symbols.length === 0 || !symbols.includes(c)) {
                if (i === start) {
                    if (c === 'P' && pattern.slice(i, i + 4) === 'PART') {
                        start = i = (i + 4);
                        result.push(new DynamicSegment(symbols));
                        ++types.dynamics;
                    }
                    else {
                        ++i;
                    }
                }
                else {
                    ++i;
                }
            }
            else if (i !== start) {
                result.push(new StaticSegment(pattern.slice(start, i)));
                ++types.statics;
                start = i;
            }
            else {
                result.push(new SymbolSegment(pattern.slice(start, i + 1)));
                ++types.symbols;
                start = ++i;
            }
        }
        if (start !== i) {
            result.push(new StaticSegment(pattern.slice(start, i)));
            ++types.statics;
        }
        return result;
    }
}
function isEndpoint(a) {
    return a.isEndpoint;
}
function sortEndpoint(a, b) {
    const aTypes = a.types;
    const bTypes = b.types;
    if (aTypes.statics !== bTypes.statics) {
        return bTypes.statics - aTypes.statics;
    }
    if (aTypes.dynamics !== bTypes.dynamics) {
        return bTypes.dynamics - aTypes.dynamics;
    }
    if (aTypes.symbols !== bTypes.symbols) {
        return bTypes.symbols - aTypes.symbols;
    }
    return 0;
}
class AttrSyntax {
    constructor(rawName, rawValue, target, command) {
        this.rawName = rawName;
        this.rawValue = rawValue;
        this.target = target;
        this.command = command;
    }
}
const IAttributePattern = DI.createInterface('IAttributePattern');
const IAttributeParser = DI.createInterface('IAttributeParser', x => x.singleton(AttributeParser));
class AttributeParser {
    constructor(interpreter, attrPatterns) {
        this._cache = {};
        this._interpreter = interpreter;
        const patterns = this._patterns = {};
        const allDefs = attrPatterns.reduce((allDefs, attrPattern) => {
            const patternDefs = getAllPatternDefinitions(attrPattern.constructor);
            patternDefs.forEach(def => patterns[def.pattern] = attrPattern);
            return allDefs.concat(patternDefs);
        }, emptyArray);
        interpreter.add(allDefs);
    }
    parse(name, value) {
        let interpretation = this._cache[name];
        if (interpretation == null) {
            interpretation = this._cache[name] = this._interpreter.interpret(name);
        }
        const pattern = interpretation.pattern;
        if (pattern == null) {
            return new AttrSyntax(name, value, name, null);
        }
        else {
            return this._patterns[pattern][pattern](name, value, interpretation.parts);
        }
    }
}
AttributeParser.inject = [ISyntaxInterpreter, all(IAttributePattern)];
function attributePattern(...patternDefs) {
    return function decorator(target) {
        return AttributePattern.define(patternDefs, target);
    };
}
class AttributePatternResourceDefinition {
    constructor(Type) {
        this.Type = Type;
        this.name = (void 0);
    }
    register(container) {
        singletonRegistration(IAttributePattern, this.Type).register(container);
    }
}
const apBaseName = getResourceKeyFor('attribute-pattern');
const annotationKey = 'attribute-pattern-definitions';
const getAllPatternDefinitions = (Type) => Protocol.annotation.get(Type, annotationKey);
const AttributePattern = Object.freeze({
    name: apBaseName,
    definitionAnnotationKey: annotationKey,
    define(patternDefs, Type) {
        const definition = new AttributePatternResourceDefinition(Type);
        defineMetadata(apBaseName, definition, Type);
        appendResourceKey(Type, apBaseName);
        Protocol.annotation.set(Type, annotationKey, patternDefs);
        appendAnnotationKey(Type, annotationKey);
        return Type;
    },
    getPatternDefinitions: getAllPatternDefinitions,
});
let DotSeparatedAttributePattern = class DotSeparatedAttributePattern {
    'PART.PART'(rawName, rawValue, parts) {
        return new AttrSyntax(rawName, rawValue, parts[0], parts[1]);
    }
    'PART.PART.PART'(rawName, rawValue, parts) {
        return new AttrSyntax(rawName, rawValue, parts[0], parts[2]);
    }
};
DotSeparatedAttributePattern = __decorate([
    attributePattern({ pattern: 'PART.PART', symbols: '.' }, { pattern: 'PART.PART.PART', symbols: '.' })
], DotSeparatedAttributePattern);
let RefAttributePattern = class RefAttributePattern {
    'ref'(rawName, rawValue, _parts) {
        return new AttrSyntax(rawName, rawValue, 'element', 'ref');
    }
    'PART.ref'(rawName, rawValue, parts) {
        return new AttrSyntax(rawName, rawValue, parts[0], 'ref');
    }
};
RefAttributePattern = __decorate([
    attributePattern({ pattern: 'ref', symbols: '' }, { pattern: 'PART.ref', symbols: '.' })
], RefAttributePattern);
let ColonPrefixedBindAttributePattern = class ColonPrefixedBindAttributePattern {
    ':PART'(rawName, rawValue, parts) {
        return new AttrSyntax(rawName, rawValue, parts[0], 'bind');
    }
};
ColonPrefixedBindAttributePattern = __decorate([
    attributePattern({ pattern: ':PART', symbols: ':' })
], ColonPrefixedBindAttributePattern);
let AtPrefixedTriggerAttributePattern = class AtPrefixedTriggerAttributePattern {
    '@PART'(rawName, rawValue, parts) {
        return new AttrSyntax(rawName, rawValue, parts[0], 'trigger');
    }
};
AtPrefixedTriggerAttributePattern = __decorate([
    attributePattern({ pattern: '@PART', symbols: '@' })
], AtPrefixedTriggerAttributePattern);
let SpreadAttributePattern = class SpreadAttributePattern {
    '...$attrs'(rawName, rawValue, _parts) {
        return new AttrSyntax(rawName, rawValue, '', '...$attrs');
    }
};
SpreadAttributePattern = __decorate([
    attributePattern({ pattern: '...$attrs', symbols: '' })
], SpreadAttributePattern);

const IPlatform = IPlatform$1;

const ISVGAnalyzer = DI.createInterface('ISVGAnalyzer', x => x.singleton(NoopSVGAnalyzer));
class NoopSVGAnalyzer {
    isStandardSvgAttribute(_node, _attributeName) {
        return false;
    }
}
function o(keys) {
    const lookup = createLookup();
    let key;
    for (key of keys) {
        lookup[key] = true;
    }
    return lookup;
}
class SVGAnalyzer {
    constructor(platform) {
        this._svgElements = Object.assign(createLookup(), {
            'a': o(['class', 'externalResourcesRequired', 'id', 'onactivate', 'onclick', 'onfocusin', 'onfocusout', 'onload', 'onmousedown', 'onmousemove', 'onmouseout', 'onmouseover', 'onmouseup', 'requiredExtensions', 'requiredFeatures', 'style', 'systemLanguage', 'target', 'transform', 'xlink:actuate', 'xlink:arcrole', 'xlink:href', 'xlink:role', 'xlink:show', 'xlink:title', 'xlink:type', 'xml:base', 'xml:lang', 'xml:space']),
            'altGlyph': o(['class', 'dx', 'dy', 'externalResourcesRequired', 'format', 'glyphRef', 'id', 'onactivate', 'onclick', 'onfocusin', 'onfocusout', 'onload', 'onmousedown', 'onmousemove', 'onmouseout', 'onmouseover', 'onmouseup', 'requiredExtensions', 'requiredFeatures', 'rotate', 'style', 'systemLanguage', 'x', 'xlink:actuate', 'xlink:arcrole', 'xlink:href', 'xlink:role', 'xlink:show', 'xlink:title', 'xlink:type', 'xml:base', 'xml:lang', 'xml:space', 'y']),
            'altglyph': createLookup(),
            'altGlyphDef': o(['id', 'xml:base', 'xml:lang', 'xml:space']),
            'altglyphdef': createLookup(),
            'altGlyphItem': o(['id', 'xml:base', 'xml:lang', 'xml:space']),
            'altglyphitem': createLookup(),
            'animate': o(['accumulate', 'additive', 'attributeName', 'attributeType', 'begin', 'by', 'calcMode', 'dur', 'end', 'externalResourcesRequired', 'fill', 'from', 'id', 'keySplines', 'keyTimes', 'max', 'min', 'onbegin', 'onend', 'onload', 'onrepeat', 'repeatCount', 'repeatDur', 'requiredExtensions', 'requiredFeatures', 'restart', 'systemLanguage', 'to', 'values', 'xlink:actuate', 'xlink:arcrole', 'xlink:href', 'xlink:role', 'xlink:show', 'xlink:title', 'xlink:type', 'xml:base', 'xml:lang', 'xml:space']),
            'animateColor': o(['accumulate', 'additive', 'attributeName', 'attributeType', 'begin', 'by', 'calcMode', 'dur', 'end', 'externalResourcesRequired', 'fill', 'from', 'id', 'keySplines', 'keyTimes', 'max', 'min', 'onbegin', 'onend', 'onload', 'onrepeat', 'repeatCount', 'repeatDur', 'requiredExtensions', 'requiredFeatures', 'restart', 'systemLanguage', 'to', 'values', 'xlink:actuate', 'xlink:arcrole', 'xlink:href', 'xlink:role', 'xlink:show', 'xlink:title', 'xlink:type', 'xml:base', 'xml:lang', 'xml:space']),
            'animateMotion': o(['accumulate', 'additive', 'begin', 'by', 'calcMode', 'dur', 'end', 'externalResourcesRequired', 'fill', 'from', 'id', 'keyPoints', 'keySplines', 'keyTimes', 'max', 'min', 'onbegin', 'onend', 'onload', 'onrepeat', 'origin', 'path', 'repeatCount', 'repeatDur', 'requiredExtensions', 'requiredFeatures', 'restart', 'rotate', 'systemLanguage', 'to', 'values', 'xlink:actuate', 'xlink:arcrole', 'xlink:href', 'xlink:role', 'xlink:show', 'xlink:title', 'xlink:type', 'xml:base', 'xml:lang', 'xml:space']),
            'animateTransform': o(['accumulate', 'additive', 'attributeName', 'attributeType', 'begin', 'by', 'calcMode', 'dur', 'end', 'externalResourcesRequired', 'fill', 'from', 'id', 'keySplines', 'keyTimes', 'max', 'min', 'onbegin', 'onend', 'onload', 'onrepeat', 'repeatCount', 'repeatDur', 'requiredExtensions', 'requiredFeatures', 'restart', 'systemLanguage', 'to', 'type', 'values', 'xlink:actuate', 'xlink:arcrole', 'xlink:href', 'xlink:role', 'xlink:show', 'xlink:title', 'xlink:type', 'xml:base', 'xml:lang', 'xml:space']),
            'circle': o(['class', 'cx', 'cy', 'externalResourcesRequired', 'id', 'onactivate', 'onclick', 'onfocusin', 'onfocusout', 'onload', 'onmousedown', 'onmousemove', 'onmouseout', 'onmouseover', 'onmouseup', 'r', 'requiredExtensions', 'requiredFeatures', 'style', 'systemLanguage', 'transform', 'xml:base', 'xml:lang', 'xml:space']),
            'clipPath': o(['class', 'clipPathUnits', 'externalResourcesRequired', 'id', 'requiredExtensions', 'requiredFeatures', 'style', 'systemLanguage', 'transform', 'xml:base', 'xml:lang', 'xml:space']),
            'color-profile': o(['id', 'local', 'name', 'rendering-intent', 'xlink:actuate', 'xlink:arcrole', 'xlink:href', 'xlink:role', 'xlink:show', 'xlink:title', 'xlink:type', 'xml:base', 'xml:lang', 'xml:space']),
            'cursor': o(['externalResourcesRequired', 'id', 'requiredExtensions', 'requiredFeatures', 'systemLanguage', 'x', 'xlink:actuate', 'xlink:arcrole', 'xlink:href', 'xlink:role', 'xlink:show', 'xlink:title', 'xlink:type', 'xml:base', 'xml:lang', 'xml:space', 'y']),
            'defs': o(['class', 'externalResourcesRequired', 'id', 'onactivate', 'onclick', 'onfocusin', 'onfocusout', 'onload', 'onmousedown', 'onmousemove', 'onmouseout', 'onmouseover', 'onmouseup', 'requiredExtensions', 'requiredFeatures', 'style', 'systemLanguage', 'transform', 'xml:base', 'xml:lang', 'xml:space']),
            'desc': o(['class', 'id', 'style', 'xml:base', 'xml:lang', 'xml:space']),
            'ellipse': o(['class', 'cx', 'cy', 'externalResourcesRequired', 'id', 'onactivate', 'onclick', 'onfocusin', 'onfocusout', 'onload', 'onmousedown', 'onmousemove', 'onmouseout', 'onmouseover', 'onmouseup', 'requiredExtensions', 'requiredFeatures', 'rx', 'ry', 'style', 'systemLanguage', 'transform', 'xml:base', 'xml:lang', 'xml:space']),
            'feBlend': o(['class', 'height', 'id', 'in', 'in2', 'mode', 'result', 'style', 'width', 'x', 'xml:base', 'xml:lang', 'xml:space', 'y']),
            'feColorMatrix': o(['class', 'height', 'id', 'in', 'result', 'style', 'type', 'values', 'width', 'x', 'xml:base', 'xml:lang', 'xml:space', 'y']),
            'feComponentTransfer': o(['class', 'height', 'id', 'in', 'result', 'style', 'width', 'x', 'xml:base', 'xml:lang', 'xml:space', 'y']),
            'feComposite': o(['class', 'height', 'id', 'in', 'in2', 'k1', 'k2', 'k3', 'k4', 'operator', 'result', 'style', 'width', 'x', 'xml:base', 'xml:lang', 'xml:space', 'y']),
            'feConvolveMatrix': o(['bias', 'class', 'divisor', 'edgeMode', 'height', 'id', 'in', 'kernelMatrix', 'kernelUnitLength', 'order', 'preserveAlpha', 'result', 'style', 'targetX', 'targetY', 'width', 'x', 'xml:base', 'xml:lang', 'xml:space', 'y']),
            'feDiffuseLighting': o(['class', 'diffuseConstant', 'height', 'id', 'in', 'kernelUnitLength', 'result', 'style', 'surfaceScale', 'width', 'x', 'xml:base', 'xml:lang', 'xml:space', 'y']),
            'feDisplacementMap': o(['class', 'height', 'id', 'in', 'in2', 'result', 'scale', 'style', 'width', 'x', 'xChannelSelector', 'xml:base', 'xml:lang', 'xml:space', 'y', 'yChannelSelector']),
            'feDistantLight': o(['azimuth', 'elevation', 'id', 'xml:base', 'xml:lang', 'xml:space']),
            'feFlood': o(['class', 'height', 'id', 'result', 'style', 'width', 'x', 'xml:base', 'xml:lang', 'xml:space', 'y']),
            'feFuncA': o(['amplitude', 'exponent', 'id', 'intercept', 'offset', 'slope', 'tableValues', 'type', 'xml:base', 'xml:lang', 'xml:space']),
            'feFuncB': o(['amplitude', 'exponent', 'id', 'intercept', 'offset', 'slope', 'tableValues', 'type', 'xml:base', 'xml:lang', 'xml:space']),
            'feFuncG': o(['amplitude', 'exponent', 'id', 'intercept', 'offset', 'slope', 'tableValues', 'type', 'xml:base', 'xml:lang', 'xml:space']),
            'feFuncR': o(['amplitude', 'exponent', 'id', 'intercept', 'offset', 'slope', 'tableValues', 'type', 'xml:base', 'xml:lang', 'xml:space']),
            'feGaussianBlur': o(['class', 'height', 'id', 'in', 'result', 'stdDeviation', 'style', 'width', 'x', 'xml:base', 'xml:lang', 'xml:space', 'y']),
            'feImage': o(['class', 'externalResourcesRequired', 'height', 'id', 'preserveAspectRatio', 'result', 'style', 'width', 'x', 'xlink:actuate', 'xlink:arcrole', 'xlink:href', 'xlink:role', 'xlink:show', 'xlink:title', 'xlink:type', 'xml:base', 'xml:lang', 'xml:space', 'y']),
            'feMerge': o(['class', 'height', 'id', 'result', 'style', 'width', 'x', 'xml:base', 'xml:lang', 'xml:space', 'y']),
            'feMergeNode': o(['id', 'xml:base', 'xml:lang', 'xml:space']),
            'feMorphology': o(['class', 'height', 'id', 'in', 'operator', 'radius', 'result', 'style', 'width', 'x', 'xml:base', 'xml:lang', 'xml:space', 'y']),
            'feOffset': o(['class', 'dx', 'dy', 'height', 'id', 'in', 'result', 'style', 'width', 'x', 'xml:base', 'xml:lang', 'xml:space', 'y']),
            'fePointLight': o(['id', 'x', 'xml:base', 'xml:lang', 'xml:space', 'y', 'z']),
            'feSpecularLighting': o(['class', 'height', 'id', 'in', 'kernelUnitLength', 'result', 'specularConstant', 'specularExponent', 'style', 'surfaceScale', 'width', 'x', 'xml:base', 'xml:lang', 'xml:space', 'y']),
            'feSpotLight': o(['id', 'limitingConeAngle', 'pointsAtX', 'pointsAtY', 'pointsAtZ', 'specularExponent', 'x', 'xml:base', 'xml:lang', 'xml:space', 'y', 'z']),
            'feTile': o(['class', 'height', 'id', 'in', 'result', 'style', 'width', 'x', 'xml:base', 'xml:lang', 'xml:space', 'y']),
            'feTurbulence': o(['baseFrequency', 'class', 'height', 'id', 'numOctaves', 'result', 'seed', 'stitchTiles', 'style', 'type', 'width', 'x', 'xml:base', 'xml:lang', 'xml:space', 'y']),
            'filter': o(['class', 'externalResourcesRequired', 'filterRes', 'filterUnits', 'height', 'id', 'primitiveUnits', 'style', 'width', 'x', 'xlink:actuate', 'xlink:arcrole', 'xlink:href', 'xlink:role', 'xlink:show', 'xlink:title', 'xlink:type', 'xml:base', 'xml:lang', 'xml:space', 'y']),
            'font': o(['class', 'externalResourcesRequired', 'horiz-adv-x', 'horiz-origin-x', 'horiz-origin-y', 'id', 'style', 'vert-adv-y', 'vert-origin-x', 'vert-origin-y', 'xml:base', 'xml:lang', 'xml:space']),
            'font-face': o(['accent-height', 'alphabetic', 'ascent', 'bbox', 'cap-height', 'descent', 'font-family', 'font-size', 'font-stretch', 'font-style', 'font-variant', 'font-weight', 'hanging', 'id', 'ideographic', 'mathematical', 'overline-position', 'overline-thickness', 'panose-1', 'slope', 'stemh', 'stemv', 'strikethrough-position', 'strikethrough-thickness', 'underline-position', 'underline-thickness', 'unicode-range', 'units-per-em', 'v-alphabetic', 'v-hanging', 'v-ideographic', 'v-mathematical', 'widths', 'x-height', 'xml:base', 'xml:lang', 'xml:space']),
            'font-face-format': o(['id', 'string', 'xml:base', 'xml:lang', 'xml:space']),
            'font-face-name': o(['id', 'name', 'xml:base', 'xml:lang', 'xml:space']),
            'font-face-src': o(['id', 'xml:base', 'xml:lang', 'xml:space']),
            'font-face-uri': o(['id', 'xlink:actuate', 'xlink:arcrole', 'xlink:href', 'xlink:role', 'xlink:show', 'xlink:title', 'xlink:type', 'xml:base', 'xml:lang', 'xml:space']),
            'foreignObject': o(['class', 'externalResourcesRequired', 'height', 'id', 'onactivate', 'onclick', 'onfocusin', 'onfocusout', 'onload', 'onmousedown', 'onmousemove', 'onmouseout', 'onmouseover', 'onmouseup', 'requiredExtensions', 'requiredFeatures', 'style', 'systemLanguage', 'transform', 'width', 'x', 'xml:base', 'xml:lang', 'xml:space', 'y']),
            'g': o(['class', 'externalResourcesRequired', 'id', 'onactivate', 'onclick', 'onfocusin', 'onfocusout', 'onload', 'onmousedown', 'onmousemove', 'onmouseout', 'onmouseover', 'onmouseup', 'requiredExtensions', 'requiredFeatures', 'style', 'systemLanguage', 'transform', 'xml:base', 'xml:lang', 'xml:space']),
            'glyph': o(['arabic-form', 'class', 'd', 'glyph-name', 'horiz-adv-x', 'id', 'lang', 'orientation', 'style', 'unicode', 'vert-adv-y', 'vert-origin-x', 'vert-origin-y', 'xml:base', 'xml:lang', 'xml:space']),
            'glyphRef': o(['class', 'dx', 'dy', 'format', 'glyphRef', 'id', 'style', 'x', 'xlink:actuate', 'xlink:arcrole', 'xlink:href', 'xlink:role', 'xlink:show', 'xlink:title', 'xlink:type', 'xml:base', 'xml:lang', 'xml:space', 'y']),
            'glyphref': createLookup(),
            'hkern': o(['g1', 'g2', 'id', 'k', 'u1', 'u2', 'xml:base', 'xml:lang', 'xml:space']),
            'image': o(['class', 'externalResourcesRequired', 'height', 'id', 'onactivate', 'onclick', 'onfocusin', 'onfocusout', 'onload', 'onmousedown', 'onmousemove', 'onmouseout', 'onmouseover', 'onmouseup', 'preserveAspectRatio', 'requiredExtensions', 'requiredFeatures', 'style', 'systemLanguage', 'transform', 'width', 'x', 'xlink:actuate', 'xlink:arcrole', 'xlink:href', 'xlink:role', 'xlink:show', 'xlink:title', 'xlink:type', 'xml:base', 'xml:lang', 'xml:space', 'y']),
            'line': o(['class', 'externalResourcesRequired', 'id', 'onactivate', 'onclick', 'onfocusin', 'onfocusout', 'onload', 'onmousedown', 'onmousemove', 'onmouseout', 'onmouseover', 'onmouseup', 'requiredExtensions', 'requiredFeatures', 'style', 'systemLanguage', 'transform', 'x1', 'x2', 'xml:base', 'xml:lang', 'xml:space', 'y1', 'y2']),
            'linearGradient': o(['class', 'externalResourcesRequired', 'gradientTransform', 'gradientUnits', 'id', 'spreadMethod', 'style', 'x1', 'x2', 'xlink:arcrole', 'xlink:href', 'xlink:role', 'xlink:title', 'xlink:type', 'xml:base', 'xml:lang', 'xml:space', 'y1', 'y2']),
            'marker': o(['class', 'externalResourcesRequired', 'id', 'markerHeight', 'markerUnits', 'markerWidth', 'orient', 'preserveAspectRatio', 'refX', 'refY', 'style', 'viewBox', 'xml:base', 'xml:lang', 'xml:space']),
            'mask': o(['class', 'externalResourcesRequired', 'height', 'id', 'maskContentUnits', 'maskUnits', 'requiredExtensions', 'requiredFeatures', 'style', 'systemLanguage', 'width', 'x', 'xml:base', 'xml:lang', 'xml:space', 'y']),
            'metadata': o(['id', 'xml:base', 'xml:lang', 'xml:space']),
            'missing-glyph': o(['class', 'd', 'horiz-adv-x', 'id', 'style', 'vert-adv-y', 'vert-origin-x', 'vert-origin-y', 'xml:base', 'xml:lang', 'xml:space']),
            'mpath': o(['externalResourcesRequired', 'id', 'xlink:actuate', 'xlink:arcrole', 'xlink:href', 'xlink:role', 'xlink:show', 'xlink:title', 'xlink:type', 'xml:base', 'xml:lang', 'xml:space']),
            'path': o(['class', 'd', 'externalResourcesRequired', 'id', 'onactivate', 'onclick', 'onfocusin', 'onfocusout', 'onload', 'onmousedown', 'onmousemove', 'onmouseout', 'onmouseover', 'onmouseup', 'pathLength', 'requiredExtensions', 'requiredFeatures', 'style', 'systemLanguage', 'transform', 'xml:base', 'xml:lang', 'xml:space']),
            'pattern': o(['class', 'externalResourcesRequired', 'height', 'id', 'patternContentUnits', 'patternTransform', 'patternUnits', 'preserveAspectRatio', 'requiredExtensions', 'requiredFeatures', 'style', 'systemLanguage', 'viewBox', 'width', 'x', 'xlink:actuate', 'xlink:arcrole', 'xlink:href', 'xlink:role', 'xlink:show', 'xlink:title', 'xlink:type', 'xml:base', 'xml:lang', 'xml:space', 'y']),
            'polygon': o(['class', 'externalResourcesRequired', 'id', 'onactivate', 'onclick', 'onfocusin', 'onfocusout', 'onload', 'onmousedown', 'onmousemove', 'onmouseout', 'onmouseover', 'onmouseup', 'points', 'requiredExtensions', 'requiredFeatures', 'style', 'systemLanguage', 'transform', 'xml:base', 'xml:lang', 'xml:space']),
            'polyline': o(['class', 'externalResourcesRequired', 'id', 'onactivate', 'onclick', 'onfocusin', 'onfocusout', 'onload', 'onmousedown', 'onmousemove', 'onmouseout', 'onmouseover', 'onmouseup', 'points', 'requiredExtensions', 'requiredFeatures', 'style', 'systemLanguage', 'transform', 'xml:base', 'xml:lang', 'xml:space']),
            'radialGradient': o(['class', 'cx', 'cy', 'externalResourcesRequired', 'fx', 'fy', 'gradientTransform', 'gradientUnits', 'id', 'r', 'spreadMethod', 'style', 'xlink:arcrole', 'xlink:href', 'xlink:role', 'xlink:title', 'xlink:type', 'xml:base', 'xml:lang', 'xml:space']),
            'rect': o(['class', 'externalResourcesRequired', 'height', 'id', 'onactivate', 'onclick', 'onfocusin', 'onfocusout', 'onload', 'onmousedown', 'onmousemove', 'onmouseout', 'onmouseover', 'onmouseup', 'requiredExtensions', 'requiredFeatures', 'rx', 'ry', 'style', 'systemLanguage', 'transform', 'width', 'x', 'xml:base', 'xml:lang', 'xml:space', 'y']),
            'script': o(['externalResourcesRequired', 'id', 'type', 'xlink:actuate', 'xlink:arcrole', 'xlink:href', 'xlink:role', 'xlink:show', 'xlink:title', 'xlink:type', 'xml:base', 'xml:lang', 'xml:space']),
            'set': o(['attributeName', 'attributeType', 'begin', 'dur', 'end', 'externalResourcesRequired', 'fill', 'id', 'max', 'min', 'onbegin', 'onend', 'onload', 'onrepeat', 'repeatCount', 'repeatDur', 'requiredExtensions', 'requiredFeatures', 'restart', 'systemLanguage', 'to', 'xlink:actuate', 'xlink:arcrole', 'xlink:href', 'xlink:role', 'xlink:show', 'xlink:title', 'xlink:type', 'xml:base', 'xml:lang', 'xml:space']),
            'stop': o(['class', 'id', 'offset', 'style', 'xml:base', 'xml:lang', 'xml:space']),
            'style': o(['id', 'media', 'title', 'type', 'xml:base', 'xml:lang', 'xml:space']),
            'svg': o(['baseProfile', 'class', 'contentScriptType', 'contentStyleType', 'externalResourcesRequired', 'height', 'id', 'onabort', 'onactivate', 'onclick', 'onerror', 'onfocusin', 'onfocusout', 'onload', 'onmousedown', 'onmousemove', 'onmouseout', 'onmouseover', 'onmouseup', 'onresize', 'onscroll', 'onunload', 'onzoom', 'preserveAspectRatio', 'requiredExtensions', 'requiredFeatures', 'style', 'systemLanguage', 'version', 'viewBox', 'width', 'x', 'xml:base', 'xml:lang', 'xml:space', 'y', 'zoomAndPan']),
            'switch': o(['class', 'externalResourcesRequired', 'id', 'onactivate', 'onclick', 'onfocusin', 'onfocusout', 'onload', 'onmousedown', 'onmousemove', 'onmouseout', 'onmouseover', 'onmouseup', 'requiredExtensions', 'requiredFeatures', 'style', 'systemLanguage', 'transform', 'xml:base', 'xml:lang', 'xml:space']),
            'symbol': o(['class', 'externalResourcesRequired', 'id', 'onactivate', 'onclick', 'onfocusin', 'onfocusout', 'onload', 'onmousedown', 'onmousemove', 'onmouseout', 'onmouseover', 'onmouseup', 'preserveAspectRatio', 'style', 'viewBox', 'xml:base', 'xml:lang', 'xml:space']),
            'text': o(['class', 'dx', 'dy', 'externalResourcesRequired', 'id', 'lengthAdjust', 'onactivate', 'onclick', 'onfocusin', 'onfocusout', 'onload', 'onmousedown', 'onmousemove', 'onmouseout', 'onmouseover', 'onmouseup', 'requiredExtensions', 'requiredFeatures', 'rotate', 'style', 'systemLanguage', 'textLength', 'transform', 'x', 'xml:base', 'xml:lang', 'xml:space', 'y']),
            'textPath': o(['class', 'externalResourcesRequired', 'id', 'lengthAdjust', 'method', 'onactivate', 'onclick', 'onfocusin', 'onfocusout', 'onload', 'onmousedown', 'onmousemove', 'onmouseout', 'onmouseover', 'onmouseup', 'requiredExtensions', 'requiredFeatures', 'spacing', 'startOffset', 'style', 'systemLanguage', 'textLength', 'xlink:arcrole', 'xlink:href', 'xlink:role', 'xlink:title', 'xlink:type', 'xml:base', 'xml:lang', 'xml:space']),
            'title': o(['class', 'id', 'style', 'xml:base', 'xml:lang', 'xml:space']),
            'tref': o(['class', 'dx', 'dy', 'externalResourcesRequired', 'id', 'lengthAdjust', 'onactivate', 'onclick', 'onfocusin', 'onfocusout', 'onload', 'onmousedown', 'onmousemove', 'onmouseout', 'onmouseover', 'onmouseup', 'requiredExtensions', 'requiredFeatures', 'rotate', 'style', 'systemLanguage', 'textLength', 'x', 'xlink:arcrole', 'xlink:href', 'xlink:role', 'xlink:title', 'xlink:type', 'xml:base', 'xml:lang', 'xml:space', 'y']),
            'tspan': o(['class', 'dx', 'dy', 'externalResourcesRequired', 'id', 'lengthAdjust', 'onactivate', 'onclick', 'onfocusin', 'onfocusout', 'onload', 'onmousedown', 'onmousemove', 'onmouseout', 'onmouseover', 'onmouseup', 'requiredExtensions', 'requiredFeatures', 'rotate', 'style', 'systemLanguage', 'textLength', 'x', 'xml:base', 'xml:lang', 'xml:space', 'y']),
            'use': o(['class', 'externalResourcesRequired', 'height', 'id', 'onactivate', 'onclick', 'onfocusin', 'onfocusout', 'onload', 'onmousedown', 'onmousemove', 'onmouseout', 'onmouseover', 'onmouseup', 'requiredExtensions', 'requiredFeatures', 'style', 'systemLanguage', 'transform', 'width', 'x', 'xlink:actuate', 'xlink:arcrole', 'xlink:href', 'xlink:role', 'xlink:show', 'xlink:title', 'xlink:type', 'xml:base', 'xml:lang', 'xml:space', 'y']),
            'view': o(['externalResourcesRequired', 'id', 'preserveAspectRatio', 'viewBox', 'viewTarget', 'xml:base', 'xml:lang', 'xml:space', 'zoomAndPan']),
            'vkern': o(['g1', 'g2', 'id', 'k', 'u1', 'u2', 'xml:base', 'xml:lang', 'xml:space']),
        });
        this._svgPresentationElements = o([
            'a',
            'altGlyph',
            'animate',
            'animateColor',
            'circle',
            'clipPath',
            'defs',
            'ellipse',
            'feBlend',
            'feColorMatrix',
            'feComponentTransfer',
            'feComposite',
            'feConvolveMatrix',
            'feDiffuseLighting',
            'feDisplacementMap',
            'feFlood',
            'feGaussianBlur',
            'feImage',
            'feMerge',
            'feMorphology',
            'feOffset',
            'feSpecularLighting',
            'feTile',
            'feTurbulence',
            'filter',
            'font',
            'foreignObject',
            'g',
            'glyph',
            'glyphRef',
            'image',
            'line',
            'linearGradient',
            'marker',
            'mask',
            'missing-glyph',
            'path',
            'pattern',
            'polygon',
            'polyline',
            'radialGradient',
            'rect',
            'stop',
            'svg',
            'switch',
            'symbol',
            'text',
            'textPath',
            'tref',
            'tspan',
            'use',
        ]);
        this._svgPresentationAttributes = o([
            'alignment-baseline',
            'baseline-shift',
            'clip-path',
            'clip-rule',
            'clip',
            'color-interpolation-filters',
            'color-interpolation',
            'color-profile',
            'color-rendering',
            'color',
            'cursor',
            'direction',
            'display',
            'dominant-baseline',
            'enable-background',
            'fill-opacity',
            'fill-rule',
            'fill',
            'filter',
            'flood-color',
            'flood-opacity',
            'font-family',
            'font-size-adjust',
            'font-size',
            'font-stretch',
            'font-style',
            'font-variant',
            'font-weight',
            'glyph-orientation-horizontal',
            'glyph-orientation-vertical',
            'image-rendering',
            'kerning',
            'letter-spacing',
            'lighting-color',
            'marker-end',
            'marker-mid',
            'marker-start',
            'mask',
            'opacity',
            'overflow',
            'pointer-events',
            'shape-rendering',
            'stop-color',
            'stop-opacity',
            'stroke-dasharray',
            'stroke-dashoffset',
            'stroke-linecap',
            'stroke-linejoin',
            'stroke-miterlimit',
            'stroke-opacity',
            'stroke-width',
            'stroke',
            'text-anchor',
            'text-decoration',
            'text-rendering',
            'unicode-bidi',
            'visibility',
            'word-spacing',
            'writing-mode',
        ]);
        this.SVGElement = platform.globalThis.SVGElement;
        const div = platform.document.createElement('div');
        div.innerHTML = '<svg><altGlyph /></svg>';
        if (div.firstElementChild.nodeName === 'altglyph') {
            const svg = this._svgElements;
            let tmp = svg.altGlyph;
            svg.altGlyph = svg.altglyph;
            svg.altglyph = tmp;
            tmp = svg.altGlyphDef;
            svg.altGlyphDef = svg.altglyphdef;
            svg.altglyphdef = tmp;
            tmp = svg.altGlyphItem;
            svg.altGlyphItem = svg.altglyphitem;
            svg.altglyphitem = tmp;
            tmp = svg.glyphRef;
            svg.glyphRef = svg.glyphref;
            svg.glyphref = tmp;
        }
    }
    static register(container) {
        return singletonRegistration(ISVGAnalyzer, this).register(container);
    }
    isStandardSvgAttribute(node, attributeName) {
        var _a;
        if (!(node instanceof this.SVGElement)) {
            return false;
        }
        return (this._svgPresentationElements[node.nodeName] === true && this._svgPresentationAttributes[attributeName] === true ||
            ((_a = this._svgElements[node.nodeName]) === null || _a === void 0 ? void 0 : _a[attributeName]) === true);
    }
}
SVGAnalyzer.inject = [IPlatform];

const IAttrMapper = DI
    .createInterface('IAttrMapper', x => x.singleton(AttrMapper));
class AttrMapper {
    constructor(svg) {
        this.svg = svg;
        this.fns = [];
        this._tagAttrMap = createLookup();
        this._globalAttrMap = createLookup();
        this.useMapping({
            LABEL: { for: 'htmlFor' },
            IMG: { usemap: 'useMap' },
            INPUT: {
                maxlength: 'maxLength',
                minlength: 'minLength',
                formaction: 'formAction',
                formenctype: 'formEncType',
                formmethod: 'formMethod',
                formnovalidate: 'formNoValidate',
                formtarget: 'formTarget',
                inputmode: 'inputMode',
            },
            TEXTAREA: { maxlength: 'maxLength' },
            TD: { rowspan: 'rowSpan', colspan: 'colSpan' },
            TH: { rowspan: 'rowSpan', colspan: 'colSpan' },
        });
        this.useGlobalMapping({
            accesskey: 'accessKey',
            contenteditable: 'contentEditable',
            tabindex: 'tabIndex',
            textcontent: 'textContent',
            innerhtml: 'innerHTML',
            scrolltop: 'scrollTop',
            scrollleft: 'scrollLeft',
            readonly: 'readOnly',
        });
    }
    static get inject() { return [ISVGAnalyzer]; }
    useMapping(config) {
        var _a;
        var _b;
        let newAttrMapping;
        let targetAttrMapping;
        let tagName;
        let attr;
        for (tagName in config) {
            newAttrMapping = config[tagName];
            targetAttrMapping = (_a = (_b = this._tagAttrMap)[tagName]) !== null && _a !== void 0 ? _a : (_b[tagName] = createLookup());
            for (attr in newAttrMapping) {
                if (targetAttrMapping[attr] !== void 0) {
                    throw createMappedError(attr, tagName);
                }
                targetAttrMapping[attr] = newAttrMapping[attr];
            }
        }
    }
    useGlobalMapping(config) {
        const mapper = this._globalAttrMap;
        for (const attr in config) {
            if (mapper[attr] !== void 0) {
                throw createMappedError(attr, '*');
            }
            mapper[attr] = config[attr];
        }
    }
    useTwoWay(fn) {
        this.fns.push(fn);
    }
    isTwoWay(node, attrName) {
        return shouldDefaultToTwoWay(node, attrName)
            || this.fns.length > 0 && this.fns.some(fn => fn(node, attrName));
    }
    map(node, attr) {
        var _a, _b, _c;
        return (_c = (_b = (_a = this._tagAttrMap[node.nodeName]) === null || _a === void 0 ? void 0 : _a[attr]) !== null && _b !== void 0 ? _b : this._globalAttrMap[attr]) !== null && _c !== void 0 ? _c : (isDataAttribute(node, attr, this.svg)
            ? attr
            : null);
    }
}
function shouldDefaultToTwoWay(element, attr) {
    switch (element.nodeName) {
        case 'INPUT':
            switch (element.type) {
                case 'checkbox':
                case 'radio':
                    return attr === 'checked';
                default:
                    return attr === 'value' || attr === 'files' || attr === 'value-as-number' || attr === 'value-as-date';
            }
        case 'TEXTAREA':
        case 'SELECT':
            return attr === 'value';
        default:
            switch (attr) {
                case 'textcontent':
                case 'innerhtml':
                    return element.hasAttribute('contenteditable');
                case 'scrolltop':
                case 'scrollleft':
                    return true;
                default:
                    return false;
            }
    }
}
function createMappedError(attr, tagName) {
    return new Error(`Attribute ${attr} has been already registered for ${tagName === '*' ? 'all elements' : `<${tagName}/>`}`);
}

class CallBinding {
    constructor(sourceExpression, target, targetProperty, observerLocator, locator) {
        this.sourceExpression = sourceExpression;
        this.target = target;
        this.targetProperty = targetProperty;
        this.locator = locator;
        this.interceptor = this;
        this.isBound = false;
        this.targetObserver = observerLocator.getAccessor(target, targetProperty);
    }
    callSource(args) {
        const overrideContext = this.$scope.overrideContext;
        overrideContext.$event = args;
        const result = this.sourceExpression.evaluate(8, this.$scope, this.locator, null);
        Reflect.deleteProperty(overrideContext, '$event');
        return result;
    }
    $bind(flags, scope) {
        if (this.isBound) {
            if (this.$scope === scope) {
                return;
            }
            this.interceptor.$unbind(flags | 2);
        }
        this.$scope = scope;
        if (this.sourceExpression.hasBind) {
            this.sourceExpression.bind(flags, scope, this.interceptor);
        }
        this.targetObserver.setValue(($args) => this.interceptor.callSource($args), flags, this.target, this.targetProperty);
        this.isBound = true;
    }
    $unbind(flags) {
        if (!this.isBound) {
            return;
        }
        if (this.sourceExpression.hasUnbind) {
            this.sourceExpression.unbind(flags, this.$scope, this.interceptor);
        }
        this.$scope = void 0;
        this.targetObserver.setValue(null, flags, this.target, this.targetProperty);
        this.isBound = false;
    }
    observe(obj, propertyName) {
        return;
    }
    handleChange(newValue, previousValue, flags) {
        return;
    }
}

class AttributeObserver {
    constructor(obj, prop, attr) {
        this.type = 2 | 1 | 4;
        this._value = null;
        this._oldValue = null;
        this._hasChanges = false;
        this.f = 0;
        this._obj = obj;
        this._prop = prop;
        this._attr = attr;
    }
    getValue() {
        return this._value;
    }
    setValue(value, flags) {
        this._value = value;
        this._hasChanges = value !== this._oldValue;
        if ((flags & 32) === 0) {
            this._flushChanges();
        }
    }
    _flushChanges() {
        if (this._hasChanges) {
            this._hasChanges = false;
            this._oldValue = this._value;
            switch (this._attr) {
                case 'class': {
                    this._obj.classList.toggle(this._prop, !!this._value);
                    break;
                }
                case 'style': {
                    let priority = '';
                    let newValue = this._value;
                    if (isString(newValue) && newValue.includes('!important')) {
                        priority = 'important';
                        newValue = newValue.replace('!important', '');
                    }
                    this._obj.style.setProperty(this._prop, newValue, priority);
                    break;
                }
                default: {
                    if (this._value == null) {
                        this._obj.removeAttribute(this._attr);
                    }
                    else {
                        this._obj.setAttribute(this._attr, String(this._value));
                    }
                }
            }
        }
    }
    handleMutation(mutationRecords) {
        let shouldProcess = false;
        for (let i = 0, ii = mutationRecords.length; ii > i; ++i) {
            const record = mutationRecords[i];
            if (record.type === 'attributes' && record.attributeName === this._prop) {
                shouldProcess = true;
                break;
            }
        }
        if (shouldProcess) {
            let newValue;
            switch (this._attr) {
                case 'class':
                    newValue = this._obj.classList.contains(this._prop);
                    break;
                case 'style':
                    newValue = this._obj.style.getPropertyValue(this._prop);
                    break;
                default:
                    throw new Error(`AUR0651: Unsupported observation of attribute: ${this._attr}`);
            }
            if (newValue !== this._value) {
                this._oldValue = this._value;
                this._value = newValue;
                this._hasChanges = false;
                this.f = 0;
                this.queue.add(this);
            }
        }
    }
    subscribe(subscriber) {
        if (this.subs.add(subscriber) && this.subs.count === 1) {
            this._value = this._oldValue = this._obj.getAttribute(this._prop);
            startObservation(this._obj.ownerDocument.defaultView.MutationObserver, this._obj, this);
        }
    }
    unsubscribe(subscriber) {
        if (this.subs.remove(subscriber) && this.subs.count === 0) {
            stopObservation(this._obj, this);
        }
    }
    flush() {
        oV$3 = this._oldValue;
        this._oldValue = this._value;
        this.subs.notify(this._value, oV$3, this.f);
    }
}
subscriberCollection(AttributeObserver);
withFlushQueue(AttributeObserver);
const startObservation = ($MutationObserver, element, subscriber) => {
    if (element.$eMObs === undefined) {
        element.$eMObs = new Set();
    }
    if (element.$mObs === undefined) {
        (element.$mObs = new $MutationObserver(handleMutation)).observe(element, { attributes: true });
    }
    element.$eMObs.add(subscriber);
};
const stopObservation = (element, subscriber) => {
    const $eMObservers = element.$eMObs;
    if ($eMObservers && $eMObservers.delete(subscriber)) {
        if ($eMObservers.size === 0) {
            element.$mObs.disconnect();
            element.$mObs = undefined;
        }
        return true;
    }
    return false;
};
const handleMutation = (mutationRecords) => {
    mutationRecords[0].target.$eMObs.forEach(invokeHandleMutation, mutationRecords);
};
function invokeHandleMutation(s) {
    s.handleMutation(this);
}
let oV$3 = void 0;

class BindingTargetSubscriber {
    constructor(b) {
        this.b = b;
    }
    handleChange(value, _, flags) {
        const b = this.b;
        if (value !== b.sourceExpression.evaluate(flags, b.$scope, b.locator, null)) {
            b.updateSource(value, flags);
        }
    }
}

const { oneTime: oneTime$1, toView: toView$2, fromView: fromView$1 } = BindingMode;
const toViewOrOneTime$1 = toView$2 | oneTime$1;
const taskOptions = {
    reusable: false,
    preempt: true,
};
class AttributeBinding {
    constructor(sourceExpression, target, targetAttribute, targetProperty, mode, observerLocator, locator) {
        this.sourceExpression = sourceExpression;
        this.targetAttribute = targetAttribute;
        this.targetProperty = targetProperty;
        this.mode = mode;
        this.locator = locator;
        this.interceptor = this;
        this.isBound = false;
        this.$scope = null;
        this.task = null;
        this.targetSubscriber = null;
        this.persistentFlags = 0;
        this.value = void 0;
        this.target = target;
        this.p = locator.get(IPlatform);
        this.oL = observerLocator;
    }
    updateTarget(value, flags) {
        flags |= this.persistentFlags;
        this.targetObserver.setValue(value, flags, this.target, this.targetProperty);
    }
    updateSource(value, flags) {
        flags |= this.persistentFlags;
        this.sourceExpression.assign(flags, this.$scope, this.locator, value);
    }
    handleChange(newValue, _previousValue, flags) {
        if (!this.isBound) {
            return;
        }
        flags |= this.persistentFlags;
        const mode = this.mode;
        const interceptor = this.interceptor;
        const sourceExpression = this.sourceExpression;
        const $scope = this.$scope;
        const locator = this.locator;
        const targetObserver = this.targetObserver;
        const shouldQueueFlush = (flags & 2) === 0 && (targetObserver.type & 4) > 0;
        let shouldConnect = false;
        let task;
        if (sourceExpression.$kind !== 10082 || this.obs.count > 1) {
            shouldConnect = (mode & oneTime$1) === 0;
            if (shouldConnect) {
                this.obs.version++;
            }
            newValue = sourceExpression.evaluate(flags, $scope, locator, interceptor);
            if (shouldConnect) {
                this.obs.clear();
            }
        }
        if (newValue !== this.value) {
            this.value = newValue;
            if (shouldQueueFlush) {
                task = this.task;
                this.task = this.p.domWriteQueue.queueTask(() => {
                    this.task = null;
                    interceptor.updateTarget(newValue, flags);
                }, taskOptions);
                task === null || task === void 0 ? void 0 : task.cancel();
            }
            else {
                interceptor.updateTarget(newValue, flags);
            }
        }
    }
    $bind(flags, scope) {
        var _a;
        if (this.isBound) {
            if (this.$scope === scope) {
                return;
            }
            this.interceptor.$unbind(flags | 2);
        }
        this.persistentFlags = flags & 33;
        this.$scope = scope;
        let sourceExpression = this.sourceExpression;
        if (sourceExpression.hasBind) {
            sourceExpression.bind(flags, scope, this.interceptor);
        }
        let targetObserver = this.targetObserver;
        if (!targetObserver) {
            targetObserver = this.targetObserver = new AttributeObserver(this.target, this.targetProperty, this.targetAttribute);
        }
        sourceExpression = this.sourceExpression;
        const $mode = this.mode;
        const interceptor = this.interceptor;
        let shouldConnect = false;
        if ($mode & toViewOrOneTime$1) {
            shouldConnect = ($mode & toView$2) > 0;
            interceptor.updateTarget(this.value = sourceExpression.evaluate(flags, scope, this.locator, shouldConnect ? interceptor : null), flags);
        }
        if ($mode & fromView$1) {
            targetObserver.subscribe((_a = this.targetSubscriber) !== null && _a !== void 0 ? _a : (this.targetSubscriber = new BindingTargetSubscriber(interceptor)));
        }
        this.isBound = true;
    }
    $unbind(flags) {
        var _a;
        if (!this.isBound) {
            return;
        }
        this.persistentFlags = 0;
        if (this.sourceExpression.hasUnbind) {
            this.sourceExpression.unbind(flags, this.$scope, this.interceptor);
        }
        this.$scope = null;
        this.value = void 0;
        if (this.targetSubscriber) {
            this.targetObserver.unsubscribe(this.targetSubscriber);
        }
        (_a = this.task) === null || _a === void 0 ? void 0 : _a.cancel();
        this.task = null;
        this.obs.clearAll();
        this.isBound = false;
    }
}
connectable(AttributeBinding);

const { toView: toView$1 } = BindingMode;
const queueTaskOptions = {
    reusable: false,
    preempt: true,
};
class InterpolationBinding {
    constructor(observerLocator, interpolation, target, targetProperty, mode, locator, taskQueue) {
        this.interpolation = interpolation;
        this.target = target;
        this.targetProperty = targetProperty;
        this.mode = mode;
        this.locator = locator;
        this.taskQueue = taskQueue;
        this.interceptor = this;
        this.isBound = false;
        this.$scope = void 0;
        this.task = null;
        this.oL = observerLocator;
        this.targetObserver = observerLocator.getAccessor(target, targetProperty);
        const expressions = interpolation.expressions;
        const partBindings = this.partBindings = Array(expressions.length);
        const ii = expressions.length;
        let i = 0;
        for (; ii > i; ++i) {
            partBindings[i] = new InterpolationPartBinding(expressions[i], target, targetProperty, locator, observerLocator, this);
        }
    }
    updateTarget(value, flags) {
        const partBindings = this.partBindings;
        const staticParts = this.interpolation.parts;
        const ii = partBindings.length;
        let result = '';
        let i = 0;
        if (ii === 1) {
            result = staticParts[0] + partBindings[0].value + staticParts[1];
        }
        else {
            result = staticParts[0];
            for (; ii > i; ++i) {
                result += partBindings[i].value + staticParts[i + 1];
            }
        }
        const targetObserver = this.targetObserver;
        const shouldQueueFlush = (flags & 2) === 0 && (targetObserver.type & 4) > 0;
        let task;
        if (shouldQueueFlush) {
            task = this.task;
            this.task = this.taskQueue.queueTask(() => {
                this.task = null;
                targetObserver.setValue(result, flags, this.target, this.targetProperty);
            }, queueTaskOptions);
            task === null || task === void 0 ? void 0 : task.cancel();
            task = null;
        }
        else {
            targetObserver.setValue(result, flags, this.target, this.targetProperty);
        }
    }
    $bind(flags, scope) {
        if (this.isBound) {
            if (this.$scope === scope) {
                return;
            }
            this.interceptor.$unbind(flags);
        }
        this.isBound = true;
        this.$scope = scope;
        const partBindings = this.partBindings;
        const ii = partBindings.length;
        let i = 0;
        for (; ii > i; ++i) {
            partBindings[i].$bind(flags, scope);
        }
        this.updateTarget(void 0, flags);
    }
    $unbind(flags) {
        var _a;
        if (!this.isBound) {
            return;
        }
        this.isBound = false;
        this.$scope = void 0;
        const partBindings = this.partBindings;
        const ii = partBindings.length;
        let i = 0;
        for (; ii > i; ++i) {
            partBindings[i].interceptor.$unbind(flags);
        }
        (_a = this.task) === null || _a === void 0 ? void 0 : _a.cancel();
        this.task = null;
    }
}
class InterpolationPartBinding {
    constructor(sourceExpression, target, targetProperty, locator, observerLocator, owner) {
        this.sourceExpression = sourceExpression;
        this.target = target;
        this.targetProperty = targetProperty;
        this.locator = locator;
        this.owner = owner;
        this.interceptor = this;
        this.mode = BindingMode.toView;
        this.value = '';
        this.task = null;
        this.isBound = false;
        this.oL = observerLocator;
    }
    handleChange(newValue, oldValue, flags) {
        if (!this.isBound) {
            return;
        }
        const sourceExpression = this.sourceExpression;
        const obsRecord = this.obs;
        const canOptimize = sourceExpression.$kind === 10082 && obsRecord.count === 1;
        let shouldConnect = false;
        if (!canOptimize) {
            shouldConnect = (this.mode & toView$1) > 0;
            if (shouldConnect) {
                obsRecord.version++;
            }
            newValue = sourceExpression.evaluate(flags, this.$scope, this.locator, shouldConnect ? this.interceptor : null);
            if (shouldConnect) {
                obsRecord.clear();
            }
        }
        if (newValue != this.value) {
            this.value = newValue;
            if (newValue instanceof Array) {
                this.observeCollection(newValue);
            }
            this.owner.updateTarget(newValue, flags);
        }
    }
    handleCollectionChange(indexMap, flags) {
        this.owner.updateTarget(void 0, flags);
    }
    $bind(flags, scope) {
        if (this.isBound) {
            if (this.$scope === scope) {
                return;
            }
            this.interceptor.$unbind(flags);
        }
        this.isBound = true;
        this.$scope = scope;
        if (this.sourceExpression.hasBind) {
            this.sourceExpression.bind(flags, scope, this.interceptor);
        }
        this.value = this.sourceExpression.evaluate(flags, scope, this.locator, (this.mode & toView$1) > 0 ? this.interceptor : null);
        if (this.value instanceof Array) {
            this.observeCollection(this.value);
        }
    }
    $unbind(flags) {
        if (!this.isBound) {
            return;
        }
        this.isBound = false;
        if (this.sourceExpression.hasUnbind) {
            this.sourceExpression.unbind(flags, this.$scope, this.interceptor);
        }
        this.$scope = void 0;
        this.obs.clearAll();
    }
}
connectable(InterpolationPartBinding);
class ContentBinding {
    constructor(sourceExpression, target, locator, observerLocator, p, strict) {
        this.sourceExpression = sourceExpression;
        this.target = target;
        this.locator = locator;
        this.p = p;
        this.strict = strict;
        this.interceptor = this;
        this.mode = BindingMode.toView;
        this.value = '';
        this.task = null;
        this.isBound = false;
        this.oL = observerLocator;
    }
    updateTarget(value, flags) {
        var _a, _b;
        const target = this.target;
        const NodeCtor = this.p.Node;
        const oldValue = this.value;
        this.value = value;
        if (oldValue instanceof NodeCtor) {
            (_a = oldValue.parentNode) === null || _a === void 0 ? void 0 : _a.removeChild(oldValue);
        }
        if (value instanceof NodeCtor) {
            target.textContent = '';
            (_b = target.parentNode) === null || _b === void 0 ? void 0 : _b.insertBefore(value, target);
        }
        else {
            target.textContent = String(value);
        }
    }
    handleChange(newValue, oldValue, flags) {
        var _a;
        if (!this.isBound) {
            return;
        }
        const sourceExpression = this.sourceExpression;
        const obsRecord = this.obs;
        const canOptimize = sourceExpression.$kind === 10082 && obsRecord.count === 1;
        let shouldConnect = false;
        if (!canOptimize) {
            shouldConnect = (this.mode & toView$1) > 0;
            if (shouldConnect) {
                obsRecord.version++;
            }
            flags |= this.strict ? 1 : 0;
            newValue = sourceExpression.evaluate(flags, this.$scope, this.locator, shouldConnect ? this.interceptor : null);
            if (shouldConnect) {
                obsRecord.clear();
            }
        }
        if (newValue === this.value) {
            (_a = this.task) === null || _a === void 0 ? void 0 : _a.cancel();
            this.task = null;
            return;
        }
        const shouldQueueFlush = (flags & 2) === 0;
        if (shouldQueueFlush) {
            this.queueUpdate(newValue, flags);
        }
        else {
            this.updateTarget(newValue, flags);
        }
    }
    handleCollectionChange() {
        if (!this.isBound) {
            return;
        }
        this.obs.version++;
        const v = this.value = this.sourceExpression.evaluate(0, this.$scope, this.locator, (this.mode & toView$1) > 0 ? this.interceptor : null);
        this.obs.clear();
        if (v instanceof Array) {
            this.observeCollection(v);
        }
        this.queueUpdate(v, 0);
    }
    $bind(flags, scope) {
        if (this.isBound) {
            if (this.$scope === scope) {
                return;
            }
            this.interceptor.$unbind(flags);
        }
        this.isBound = true;
        this.$scope = scope;
        if (this.sourceExpression.hasBind) {
            this.sourceExpression.bind(flags, scope, this.interceptor);
        }
        flags |= this.strict ? 1 : 0;
        const v = this.value = this.sourceExpression.evaluate(flags, scope, this.locator, (this.mode & toView$1) > 0 ? this.interceptor : null);
        if (v instanceof Array) {
            this.observeCollection(v);
        }
        this.updateTarget(v, flags);
    }
    $unbind(flags) {
        var _a;
        if (!this.isBound) {
            return;
        }
        this.isBound = false;
        if (this.sourceExpression.hasUnbind) {
            this.sourceExpression.unbind(flags, this.$scope, this.interceptor);
        }
        this.$scope = void 0;
        this.obs.clearAll();
        (_a = this.task) === null || _a === void 0 ? void 0 : _a.cancel();
        this.task = null;
    }
    queueUpdate(newValue, flags) {
        const task = this.task;
        this.task = this.p.domWriteQueue.queueTask(() => {
            this.task = null;
            this.updateTarget(newValue, flags);
        }, queueTaskOptions);
        task === null || task === void 0 ? void 0 : task.cancel();
    }
}
connectable(ContentBinding);

class LetBinding {
    constructor(sourceExpression, targetProperty, observerLocator, locator, toBindingContext = false) {
        this.sourceExpression = sourceExpression;
        this.targetProperty = targetProperty;
        this.locator = locator;
        this.interceptor = this;
        this.isBound = false;
        this.$scope = void 0;
        this.task = null;
        this.target = null;
        this.oL = observerLocator;
        this._toBindingContext = toBindingContext;
    }
    handleChange(newValue, _previousValue, flags) {
        if (!this.isBound) {
            return;
        }
        const target = this.target;
        const targetProperty = this.targetProperty;
        const previousValue = target[targetProperty];
        this.obs.version++;
        newValue = this.sourceExpression.evaluate(flags, this.$scope, this.locator, this.interceptor);
        this.obs.clear();
        if (newValue !== previousValue) {
            target[targetProperty] = newValue;
        }
    }
    handleCollectionChange(_indexMap, flags) {
        if (!this.isBound) {
            return;
        }
        const target = this.target;
        const targetProperty = this.targetProperty;
        const previousValue = target[targetProperty];
        this.obs.version++;
        const newValue = this.sourceExpression.evaluate(flags, this.$scope, this.locator, this.interceptor);
        this.obs.clear();
        if (newValue !== previousValue) {
            target[targetProperty] = newValue;
        }
    }
    $bind(flags, scope) {
        if (this.isBound) {
            if (this.$scope === scope) {
                return;
            }
            this.interceptor.$unbind(flags | 2);
        }
        this.$scope = scope;
        this.target = (this._toBindingContext ? scope.bindingContext : scope.overrideContext);
        const sourceExpression = this.sourceExpression;
        if (sourceExpression.hasBind) {
            sourceExpression.bind(flags, scope, this.interceptor);
        }
        this.target[this.targetProperty]
            = this.sourceExpression.evaluate(flags | 2, scope, this.locator, this.interceptor);
        this.isBound = true;
    }
    $unbind(flags) {
        if (!this.isBound) {
            return;
        }
        const sourceExpression = this.sourceExpression;
        if (sourceExpression.hasUnbind) {
            sourceExpression.unbind(flags, this.$scope, this.interceptor);
        }
        this.$scope = void 0;
        this.obs.clearAll();
        this.isBound = false;
    }
}
connectable(LetBinding);

const { oneTime, toView, fromView } = BindingMode;
const toViewOrOneTime = toView | oneTime;
const updateTaskOpts = {
    reusable: false,
    preempt: true,
};
class PropertyBinding {
    constructor(sourceExpression, target, targetProperty, mode, observerLocator, locator, taskQueue) {
        this.sourceExpression = sourceExpression;
        this.target = target;
        this.targetProperty = targetProperty;
        this.mode = mode;
        this.locator = locator;
        this.taskQueue = taskQueue;
        this.interceptor = this;
        this.isBound = false;
        this.$scope = void 0;
        this.targetObserver = void 0;
        this.persistentFlags = 0;
        this.task = null;
        this.targetSubscriber = null;
        this.oL = observerLocator;
    }
    updateTarget(value, flags) {
        flags |= this.persistentFlags;
        this.targetObserver.setValue(value, flags, this.target, this.targetProperty);
    }
    updateSource(value, flags) {
        flags |= this.persistentFlags;
        this.sourceExpression.assign(flags, this.$scope, this.locator, value);
    }
    handleChange(newValue, _previousValue, flags) {
        if (!this.isBound) {
            return;
        }
        flags |= this.persistentFlags;
        const shouldQueueFlush = (flags & 2) === 0 && (this.targetObserver.type & 4) > 0;
        const obsRecord = this.obs;
        let shouldConnect = false;
        if (this.sourceExpression.$kind !== 10082 || obsRecord.count > 1) {
            shouldConnect = this.mode > oneTime;
            if (shouldConnect) {
                obsRecord.version++;
            }
            newValue = this.sourceExpression.evaluate(flags, this.$scope, this.locator, this.interceptor);
            if (shouldConnect) {
                obsRecord.clear();
            }
        }
        if (shouldQueueFlush) {
            task = this.task;
            this.task = this.taskQueue.queueTask(() => {
                this.interceptor.updateTarget(newValue, flags);
                this.task = null;
            }, updateTaskOpts);
            task === null || task === void 0 ? void 0 : task.cancel();
            task = null;
        }
        else {
            this.interceptor.updateTarget(newValue, flags);
        }
    }
    handleCollectionChange(_indexMap, flags) {
        if (!this.isBound) {
            return;
        }
        const shouldQueueFlush = (flags & 2) === 0 && (this.targetObserver.type & 4) > 0;
        this.obs.version++;
        const newValue = this.sourceExpression.evaluate(flags, this.$scope, this.locator, this.interceptor);
        this.obs.clear();
        if (shouldQueueFlush) {
            task = this.task;
            this.task = this.taskQueue.queueTask(() => {
                this.interceptor.updateTarget(newValue, flags);
                this.task = null;
            }, updateTaskOpts);
            task === null || task === void 0 ? void 0 : task.cancel();
            task = null;
        }
        else {
            this.interceptor.updateTarget(newValue, flags);
        }
    }
    $bind(flags, scope) {
        var _a;
        if (this.isBound) {
            if (this.$scope === scope) {
                return;
            }
            this.interceptor.$unbind(flags | 2);
        }
        flags |= 1;
        this.persistentFlags = flags & 33;
        this.$scope = scope;
        let sourceExpression = this.sourceExpression;
        if (sourceExpression.hasBind) {
            sourceExpression.bind(flags, scope, this.interceptor);
        }
        const observerLocator = this.oL;
        const $mode = this.mode;
        let targetObserver = this.targetObserver;
        if (!targetObserver) {
            if ($mode & fromView) {
                targetObserver = observerLocator.getObserver(this.target, this.targetProperty);
            }
            else {
                targetObserver = observerLocator.getAccessor(this.target, this.targetProperty);
            }
            this.targetObserver = targetObserver;
        }
        sourceExpression = this.sourceExpression;
        const interceptor = this.interceptor;
        const shouldConnect = ($mode & toView) > 0;
        if ($mode & toViewOrOneTime) {
            interceptor.updateTarget(sourceExpression.evaluate(flags, scope, this.locator, shouldConnect ? interceptor : null), flags);
        }
        if ($mode & fromView) {
            targetObserver.subscribe((_a = this.targetSubscriber) !== null && _a !== void 0 ? _a : (this.targetSubscriber = new BindingTargetSubscriber(interceptor)));
            if (!shouldConnect) {
                interceptor.updateSource(targetObserver.getValue(this.target, this.targetProperty), flags);
            }
        }
        this.isBound = true;
    }
    $unbind(flags) {
        if (!this.isBound) {
            return;
        }
        this.persistentFlags = 0;
        if (this.sourceExpression.hasUnbind) {
            this.sourceExpression.unbind(flags, this.$scope, this.interceptor);
        }
        this.$scope = void 0;
        task = this.task;
        if (this.targetSubscriber) {
            this.targetObserver.unsubscribe(this.targetSubscriber);
        }
        if (task != null) {
            task.cancel();
            task = this.task = null;
        }
        this.obs.clearAll();
        this.isBound = false;
    }
}
connectable(PropertyBinding);
let task = null;

class RefBinding {
    constructor(sourceExpression, target, locator) {
        this.sourceExpression = sourceExpression;
        this.target = target;
        this.locator = locator;
        this.interceptor = this;
        this.isBound = false;
        this.$scope = void 0;
    }
    $bind(flags, scope) {
        if (this.isBound) {
            if (this.$scope === scope) {
                return;
            }
            this.interceptor.$unbind(flags | 2);
        }
        this.$scope = scope;
        if (this.sourceExpression.hasBind) {
            this.sourceExpression.bind(flags, scope, this);
        }
        this.sourceExpression.assign(flags, this.$scope, this.locator, this.target);
        this.isBound = true;
    }
    $unbind(flags) {
        if (!this.isBound) {
            return;
        }
        let sourceExpression = this.sourceExpression;
        if (sourceExpression.evaluate(flags, this.$scope, this.locator, null) === this.target) {
            sourceExpression.assign(flags, this.$scope, this.locator, null);
        }
        sourceExpression = this.sourceExpression;
        if (sourceExpression.hasUnbind) {
            sourceExpression.unbind(flags, this.$scope, this.interceptor);
        }
        this.$scope = void 0;
        this.isBound = false;
    }
    observe(_obj, _propertyName) {
        return;
    }
    handleChange(_newValue, _previousValue, _flags) {
        return;
    }
}

const IAppTask = DI.createInterface('IAppTask');
class $AppTask {
    constructor(slot, key, cb) {
        this.c = (void 0);
        this.slot = slot;
        this.k = key;
        this.cb = cb;
    }
    register(container) {
        return this.c = container.register(instanceRegistration(IAppTask, this));
    }
    run() {
        const key = this.k;
        const cb = this.cb;
        return (key === null
            ? cb()
            : cb(this.c.get(key)));
    }
}
const AppTask = Object.freeze({
    creating: createAppTaskSlotHook('creating'),
    hydrating: createAppTaskSlotHook('hydrating'),
    hydrated: createAppTaskSlotHook('hydrated'),
    activating: createAppTaskSlotHook('activating'),
    activated: createAppTaskSlotHook('activated'),
    deactivating: createAppTaskSlotHook('deactivating'),
    deactivated: createAppTaskSlotHook('deactivated'),
});
function createAppTaskSlotHook(slotName) {
    function appTaskFactory(keyOrCallback, callback) {
        if (isFunction(callback)) {
            return new $AppTask(slotName, keyOrCallback, callback);
        }
        return new $AppTask(slotName, null, keyOrCallback);
    }
    return appTaskFactory;
}

function children(configOrTarget, prop) {
    let config;
    function decorator($target, $prop) {
        if (arguments.length > 1) {
            config.property = $prop;
        }
        defineMetadata(baseName, ChildrenDefinition.create($prop, config), $target.constructor, $prop);
        appendAnnotationKey($target.constructor, Children.keyFrom($prop));
    }
    if (arguments.length > 1) {
        config = {};
        decorator(configOrTarget, prop);
        return;
    }
    else if (isString(configOrTarget)) {
        config = {};
        return decorator;
    }
    config = configOrTarget === void 0 ? {} : configOrTarget;
    return decorator;
}
function isChildrenObserverAnnotation(key) {
    return key.startsWith(baseName);
}
const baseName = getAnnotationKeyFor('children-observer');
const Children = Object.freeze({
    name: baseName,
    keyFrom: (name) => `${baseName}:${name}`,
    from(...childrenObserverLists) {
        const childrenObservers = {};
        const isArray = Array.isArray;
        function addName(name) {
            childrenObservers[name] = ChildrenDefinition.create(name);
        }
        function addDescription(name, def) {
            childrenObservers[name] = ChildrenDefinition.create(name, def);
        }
        function addList(maybeList) {
            if (isArray(maybeList)) {
                maybeList.forEach(addName);
            }
            else if (maybeList instanceof ChildrenDefinition) {
                childrenObservers[maybeList.property] = maybeList;
            }
            else if (maybeList !== void 0) {
                Object.keys(maybeList).forEach(name => addDescription(name, maybeList));
            }
        }
        childrenObserverLists.forEach(addList);
        return childrenObservers;
    },
    getAll(Type) {
        const propStart = baseName.length + 1;
        const defs = [];
        const prototypeChain = getPrototypeChain(Type);
        let iProto = prototypeChain.length;
        let iDefs = 0;
        let keys;
        let keysLen;
        let Class;
        while (--iProto >= 0) {
            Class = prototypeChain[iProto];
            keys = getAllAnnotations(Class).filter(isChildrenObserverAnnotation);
            keysLen = keys.length;
            for (let i = 0; i < keysLen; ++i) {
                defs[iDefs++] = getOwnMetadata(baseName, Class, keys[i].slice(propStart));
            }
        }
        return defs;
    },
});
const childObserverOptions$1 = { childList: true };
class ChildrenDefinition {
    constructor(callback, property, options, query, filter, map) {
        this.callback = callback;
        this.property = property;
        this.options = options;
        this.query = query;
        this.filter = filter;
        this.map = map;
    }
    static create(prop, def = {}) {
        var _a;
        return new ChildrenDefinition(firstDefined(def.callback, `${prop}Changed`), firstDefined(def.property, prop), (_a = def.options) !== null && _a !== void 0 ? _a : childObserverOptions$1, def.query, def.filter, def.map);
    }
}
class ChildrenObserver {
    constructor(controller, obj, propertyKey, cbName, query = defaultChildQuery, filter = defaultChildFilter, map = defaultChildMap, options) {
        this.controller = controller;
        this.obj = obj;
        this.propertyKey = propertyKey;
        this.query = query;
        this.filter = filter;
        this.map = map;
        this.options = options;
        this.observing = false;
        this.children = (void 0);
        this.observer = void 0;
        this.callback = obj[cbName];
        Reflect.defineProperty(this.obj, this.propertyKey, {
            enumerable: true,
            configurable: true,
            get: () => this.getValue(),
            set: () => { return; },
        });
    }
    getValue() {
        return this.observing ? this.children : this.get();
    }
    setValue(_value) { }
    start() {
        var _a;
        if (!this.observing) {
            this.observing = true;
            this.children = this.get();
            ((_a = this.observer) !== null && _a !== void 0 ? _a : (this.observer = new this.controller.host.ownerDocument.defaultView.MutationObserver(() => { this._onChildrenChanged(); })))
                .observe(this.controller.host, this.options);
        }
    }
    stop() {
        if (this.observing) {
            this.observing = false;
            this.observer.disconnect();
            this.children = emptyArray;
        }
    }
    _onChildrenChanged() {
        this.children = this.get();
        if (this.callback !== void 0) {
            this.callback.call(this.obj);
        }
        this.subs.notify(this.children, undefined, 0);
    }
    get() {
        return filterChildren(this.controller, this.query, this.filter, this.map);
    }
}
subscriberCollection()(ChildrenObserver);
function defaultChildQuery(controller) {
    return controller.host.childNodes;
}
function defaultChildFilter(node, controller, viewModel) {
    return !!viewModel;
}
function defaultChildMap(node, controller, viewModel) {
    return viewModel;
}
const forOpts = { optional: true };
function filterChildren(controller, query, filter, map) {
    var _a;
    const nodes = query(controller);
    const ii = nodes.length;
    const children = [];
    let node;
    let $controller;
    let viewModel;
    let i = 0;
    for (; i < ii; ++i) {
        node = nodes[i];
        $controller = findElementControllerFor(node, forOpts);
        viewModel = (_a = $controller === null || $controller === void 0 ? void 0 : $controller.viewModel) !== null && _a !== void 0 ? _a : null;
        if (filter(node, $controller, viewModel)) {
            children.push(map(node, $controller, viewModel));
        }
    }
    return children;
}

function customAttribute(nameOrDef) {
    return function (target) {
        return defineAttribute(nameOrDef, target);
    };
}
function templateController(nameOrDef) {
    return function (target) {
        return defineAttribute(isString(nameOrDef)
            ? { isTemplateController: true, name: nameOrDef }
            : { isTemplateController: true, ...nameOrDef }, target);
    };
}
class CustomAttributeDefinition {
    constructor(Type, name, aliases, key, defaultBindingMode, isTemplateController, bindables, noMultiBindings, watches, dependencies) {
        this.Type = Type;
        this.name = name;
        this.aliases = aliases;
        this.key = key;
        this.defaultBindingMode = defaultBindingMode;
        this.isTemplateController = isTemplateController;
        this.bindables = bindables;
        this.noMultiBindings = noMultiBindings;
        this.watches = watches;
        this.dependencies = dependencies;
    }
    get type() { return 2; }
    static create(nameOrDef, Type) {
        let name;
        let def;
        if (isString(nameOrDef)) {
            name = nameOrDef;
            def = { name };
        }
        else {
            name = nameOrDef.name;
            def = nameOrDef;
        }
        return new CustomAttributeDefinition(Type, firstDefined(getAttributeAnnotation(Type, 'name'), name), mergeArrays(getAttributeAnnotation(Type, 'aliases'), def.aliases, Type.aliases), getAttributeKeyFrom(name), firstDefined(getAttributeAnnotation(Type, 'defaultBindingMode'), def.defaultBindingMode, Type.defaultBindingMode, BindingMode.toView), firstDefined(getAttributeAnnotation(Type, 'isTemplateController'), def.isTemplateController, Type.isTemplateController, false), Bindable.from(Type, ...Bindable.getAll(Type), getAttributeAnnotation(Type, 'bindables'), Type.bindables, def.bindables), firstDefined(getAttributeAnnotation(Type, 'noMultiBindings'), def.noMultiBindings, Type.noMultiBindings, false), mergeArrays(Watch.getAnnotation(Type), Type.watches), mergeArrays(getAttributeAnnotation(Type, 'dependencies'), def.dependencies, Type.dependencies));
    }
    register(container) {
        const { Type, key, aliases } = this;
        transientRegistration(key, Type).register(container);
        aliasRegistration(key, Type).register(container);
        registerAliases(aliases, CustomAttribute, key, container);
    }
}
const caBaseName = getResourceKeyFor('custom-attribute');
const getAttributeKeyFrom = (name) => `${caBaseName}:${name}`;
const getAttributeAnnotation = (Type, prop) => getOwnMetadata(getAnnotationKeyFor(prop), Type);
const isAttributeType = (value) => {
    return isFunction(value) && hasOwnMetadata(caBaseName, value);
};
const findAttributeControllerFor = (node, name) => {
    var _a;
    return ((_a = getRef(node, getAttributeKeyFrom(name))) !== null && _a !== void 0 ? _a : void 0);
};
const defineAttribute = (nameOrDef, Type) => {
    const definition = CustomAttributeDefinition.create(nameOrDef, Type);
    defineMetadata(caBaseName, definition, definition.Type);
    defineMetadata(caBaseName, definition, definition);
    appendResourceKey(Type, caBaseName);
    return definition.Type;
};
const getAttributeDefinition = (Type) => {
    const def = getOwnMetadata(caBaseName, Type);
    if (def === void 0) {
        throw new Error(`No definition found for type ${Type.name}`);
    }
    return def;
};
const CustomAttribute = Object.freeze({
    name: caBaseName,
    keyFrom: getAttributeKeyFrom,
    isType: isAttributeType,
    for: findAttributeControllerFor,
    define: defineAttribute,
    getDefinition: getAttributeDefinition,
    annotate(Type, prop, value) {
        defineMetadata(getAnnotationKeyFor(prop), value, Type);
    },
    getAnnotation: getAttributeAnnotation,
});

function watch(expressionOrPropertyAccessFn, changeHandlerOrCallback) {
    if (expressionOrPropertyAccessFn == null) {
        throw new Error(`AUR0772: Invalid watch config. Expected an expression or a fn`);
    }
    return function decorator(target, key, descriptor) {
        const isClassDecorator = key == null;
        const Type = isClassDecorator ? target : target.constructor;
        const watchDef = new WatchDefinition(expressionOrPropertyAccessFn, isClassDecorator ? changeHandlerOrCallback : descriptor.value);
        if (isClassDecorator) {
            if (!isFunction(changeHandlerOrCallback)
                && (changeHandlerOrCallback == null || !(changeHandlerOrCallback in Type.prototype))) {
                throw new Error(`AUR0773: Invalid change handler config. Method "${String(changeHandlerOrCallback)}" not found in class ${Type.name}`);
            }
        }
        else if (!isFunction(descriptor === null || descriptor === void 0 ? void 0 : descriptor.value)) {
            throw new Error(`AUR0774: decorated target ${String(key)} is not a class method.`);
        }
        Watch.add(Type, watchDef);
        if (isAttributeType(Type)) {
            getAttributeDefinition(Type).watches.push(watchDef);
        }
        if (isElementType(Type)) {
            getElementDefinition(Type).watches.push(watchDef);
        }
    };
}
class WatchDefinition {
    constructor(expression, callback) {
        this.expression = expression;
        this.callback = callback;
    }
}
const noDefinitions = emptyArray;
const watchBaseName = getAnnotationKeyFor('watch');
const Watch = Object.freeze({
    name: watchBaseName,
    add(Type, definition) {
        let watchDefinitions = getOwnMetadata(watchBaseName, Type);
        if (watchDefinitions == null) {
            defineMetadata(watchBaseName, watchDefinitions = [], Type);
        }
        watchDefinitions.push(definition);
    },
    getAnnotation(Type) {
        var _a;
        return (_a = getOwnMetadata(watchBaseName, Type)) !== null && _a !== void 0 ? _a : noDefinitions;
    },
});

function customElement(nameOrDef) {
    return function (target) {
        return defineElement(nameOrDef, target);
    };
}
function useShadowDOM(targetOrOptions) {
    if (targetOrOptions === void 0) {
        return function ($target) {
            annotateElementMetadata($target, 'shadowOptions', { mode: 'open' });
        };
    }
    if (!isFunction(targetOrOptions)) {
        return function ($target) {
            annotateElementMetadata($target, 'shadowOptions', targetOrOptions);
        };
    }
    annotateElementMetadata(targetOrOptions, 'shadowOptions', { mode: 'open' });
}
function containerless(target) {
    if (target === void 0) {
        return function ($target) {
            markContainerless($target);
        };
    }
    markContainerless(target);
}
function markContainerless(target) {
    const def = getOwnMetadata(elementBaseName, target);
    if (def === void 0) {
        annotateElementMetadata(target, 'containerless', true);
        return;
    }
    def.containerless = true;
}
function strict(target) {
    if (target === void 0) {
        return function ($target) {
            annotateElementMetadata($target, 'isStrictBinding', true);
        };
    }
    annotateElementMetadata(target, 'isStrictBinding', true);
}
const definitionLookup = new WeakMap();
class CustomElementDefinition {
    constructor(Type, name, aliases, key, cache, capture, template, instructions, dependencies, injectable, needsCompile, surrogates, bindables, childrenObservers, containerless, isStrictBinding, shadowOptions, hasSlots, enhance, watches, processContent) {
        this.Type = Type;
        this.name = name;
        this.aliases = aliases;
        this.key = key;
        this.cache = cache;
        this.capture = capture;
        this.template = template;
        this.instructions = instructions;
        this.dependencies = dependencies;
        this.injectable = injectable;
        this.needsCompile = needsCompile;
        this.surrogates = surrogates;
        this.bindables = bindables;
        this.childrenObservers = childrenObservers;
        this.containerless = containerless;
        this.isStrictBinding = isStrictBinding;
        this.shadowOptions = shadowOptions;
        this.hasSlots = hasSlots;
        this.enhance = enhance;
        this.watches = watches;
        this.processContent = processContent;
    }
    get type() { return 1; }
    static create(nameOrDef, Type = null) {
        if (Type === null) {
            const def = nameOrDef;
            if (isString(def)) {
                throw new Error(`AUR0761: Cannot create a custom element definition with only a name and no type: ${nameOrDef}`);
            }
            const name = fromDefinitionOrDefault('name', def, generateElementName);
            if (isFunction(def.Type)) {
                Type = def.Type;
            }
            else {
                Type = generateElementType(pascalCase(name));
            }
            return new CustomElementDefinition(Type, name, mergeArrays(def.aliases), fromDefinitionOrDefault('key', def, () => getElementKeyFrom(name)), fromDefinitionOrDefault('cache', def, returnZero), fromDefinitionOrDefault('capture', def, returnFalse), fromDefinitionOrDefault('template', def, returnNull), mergeArrays(def.instructions), mergeArrays(def.dependencies), fromDefinitionOrDefault('injectable', def, returnNull), fromDefinitionOrDefault('needsCompile', def, returnTrue), mergeArrays(def.surrogates), Bindable.from(Type, def.bindables), Children.from(def.childrenObservers), fromDefinitionOrDefault('containerless', def, returnFalse), fromDefinitionOrDefault('isStrictBinding', def, returnFalse), fromDefinitionOrDefault('shadowOptions', def, returnNull), fromDefinitionOrDefault('hasSlots', def, returnFalse), fromDefinitionOrDefault('enhance', def, returnFalse), fromDefinitionOrDefault('watches', def, returnEmptyArray), fromAnnotationOrTypeOrDefault('processContent', Type, returnNull));
        }
        if (isString(nameOrDef)) {
            return new CustomElementDefinition(Type, nameOrDef, mergeArrays(getElementAnnotation(Type, 'aliases'), Type.aliases), getElementKeyFrom(nameOrDef), fromAnnotationOrTypeOrDefault('cache', Type, returnZero), fromAnnotationOrTypeOrDefault('capture', Type, returnFalse), fromAnnotationOrTypeOrDefault('template', Type, returnNull), mergeArrays(getElementAnnotation(Type, 'instructions'), Type.instructions), mergeArrays(getElementAnnotation(Type, 'dependencies'), Type.dependencies), fromAnnotationOrTypeOrDefault('injectable', Type, returnNull), fromAnnotationOrTypeOrDefault('needsCompile', Type, returnTrue), mergeArrays(getElementAnnotation(Type, 'surrogates'), Type.surrogates), Bindable.from(Type, ...Bindable.getAll(Type), getElementAnnotation(Type, 'bindables'), Type.bindables), Children.from(...Children.getAll(Type), getElementAnnotation(Type, 'childrenObservers'), Type.childrenObservers), fromAnnotationOrTypeOrDefault('containerless', Type, returnFalse), fromAnnotationOrTypeOrDefault('isStrictBinding', Type, returnFalse), fromAnnotationOrTypeOrDefault('shadowOptions', Type, returnNull), fromAnnotationOrTypeOrDefault('hasSlots', Type, returnFalse), fromAnnotationOrTypeOrDefault('enhance', Type, returnFalse), mergeArrays(Watch.getAnnotation(Type), Type.watches), fromAnnotationOrTypeOrDefault('processContent', Type, returnNull));
        }
        const name = fromDefinitionOrDefault('name', nameOrDef, generateElementName);
        return new CustomElementDefinition(Type, name, mergeArrays(getElementAnnotation(Type, 'aliases'), nameOrDef.aliases, Type.aliases), getElementKeyFrom(name), fromAnnotationOrDefinitionOrTypeOrDefault('cache', nameOrDef, Type, returnZero), fromAnnotationOrDefinitionOrTypeOrDefault('capture', nameOrDef, Type, returnFalse), fromAnnotationOrDefinitionOrTypeOrDefault('template', nameOrDef, Type, returnNull), mergeArrays(getElementAnnotation(Type, 'instructions'), nameOrDef.instructions, Type.instructions), mergeArrays(getElementAnnotation(Type, 'dependencies'), nameOrDef.dependencies, Type.dependencies), fromAnnotationOrDefinitionOrTypeOrDefault('injectable', nameOrDef, Type, returnNull), fromAnnotationOrDefinitionOrTypeOrDefault('needsCompile', nameOrDef, Type, returnTrue), mergeArrays(getElementAnnotation(Type, 'surrogates'), nameOrDef.surrogates, Type.surrogates), Bindable.from(Type, ...Bindable.getAll(Type), getElementAnnotation(Type, 'bindables'), Type.bindables, nameOrDef.bindables), Children.from(...Children.getAll(Type), getElementAnnotation(Type, 'childrenObservers'), Type.childrenObservers, nameOrDef.childrenObservers), fromAnnotationOrDefinitionOrTypeOrDefault('containerless', nameOrDef, Type, returnFalse), fromAnnotationOrDefinitionOrTypeOrDefault('isStrictBinding', nameOrDef, Type, returnFalse), fromAnnotationOrDefinitionOrTypeOrDefault('shadowOptions', nameOrDef, Type, returnNull), fromAnnotationOrDefinitionOrTypeOrDefault('hasSlots', nameOrDef, Type, returnFalse), fromAnnotationOrDefinitionOrTypeOrDefault('enhance', nameOrDef, Type, returnFalse), mergeArrays(nameOrDef.watches, Watch.getAnnotation(Type), Type.watches), fromAnnotationOrDefinitionOrTypeOrDefault('processContent', nameOrDef, Type, returnNull));
    }
    static getOrCreate(partialDefinition) {
        if (partialDefinition instanceof CustomElementDefinition) {
            return partialDefinition;
        }
        if (definitionLookup.has(partialDefinition)) {
            return definitionLookup.get(partialDefinition);
        }
        const definition = CustomElementDefinition.create(partialDefinition);
        definitionLookup.set(partialDefinition, definition);
        defineMetadata(elementBaseName, definition, definition.Type);
        return definition;
    }
    register(container) {
        const { Type, key, aliases } = this;
        if (!container.has(key, false)) {
            transientRegistration(key, Type).register(container);
            aliasRegistration(key, Type).register(container);
            registerAliases(aliases, CustomElement, key, container);
        }
    }
}
const defaultForOpts = {
    name: undefined,
    searchParents: false,
    optional: false,
};
const returnZero = () => 0;
const returnNull = () => null;
const returnFalse = () => false;
const returnTrue = () => true;
const returnEmptyArray = () => emptyArray;
const elementBaseName = getResourceKeyFor('custom-element');
const getElementKeyFrom = (name) => `${elementBaseName}:${name}`;
const generateElementName = (() => {
    let id = 0;
    return () => `unnamed-${++id}`;
})();
const annotateElementMetadata = (Type, prop, value) => {
    defineMetadata(getAnnotationKeyFor(prop), value, Type);
};
const defineElement = (nameOrDef, Type) => {
    const definition = CustomElementDefinition.create(nameOrDef, Type);
    defineMetadata(elementBaseName, definition, definition.Type);
    defineMetadata(elementBaseName, definition, definition);
    appendResourceKey(definition.Type, elementBaseName);
    return definition.Type;
};
const isElementType = (value) => {
    return isFunction(value) && hasOwnMetadata(elementBaseName, value);
};
const findElementControllerFor = (node, opts = defaultForOpts) => {
    if (opts.name === void 0 && opts.searchParents !== true) {
        const controller = getRef(node, elementBaseName);
        if (controller === null) {
            if (opts.optional === true) {
                return null;
            }
            throw new Error(`AUR0762: The provided node is not a custom element or containerless host.`);
        }
        return controller;
    }
    if (opts.name !== void 0) {
        if (opts.searchParents !== true) {
            const controller = getRef(node, elementBaseName);
            if (controller === null) {
                throw new Error(`AUR0763: The provided node is not a custom element or containerless host.`);
            }
            if (controller.is(opts.name)) {
                return controller;
            }
            return (void 0);
        }
        let cur = node;
        let foundAController = false;
        while (cur !== null) {
            const controller = getRef(cur, elementBaseName);
            if (controller !== null) {
                foundAController = true;
                if (controller.is(opts.name)) {
                    return controller;
                }
            }
            cur = getEffectiveParentNode(cur);
        }
        if (foundAController) {
            return (void 0);
        }
        throw new Error(`AUR0764: The provided node does does not appear to be part of an Aurelia app DOM tree, or it was added to the DOM in a way that Aurelia cannot properly resolve its position in the component tree.`);
    }
    let cur = node;
    while (cur !== null) {
        const controller = getRef(cur, elementBaseName);
        if (controller !== null) {
            return controller;
        }
        cur = getEffectiveParentNode(cur);
    }
    throw new Error(`AUR0765: The provided node does does not appear to be part of an Aurelia app DOM tree, or it was added to the DOM in a way that Aurelia cannot properly resolve its position in the component tree.`);
};
const getElementAnnotation = (Type, prop) => getOwnMetadata(getAnnotationKeyFor(prop), Type);
const getElementDefinition = (Type) => {
    const def = getOwnMetadata(elementBaseName, Type);
    if (def === void 0) {
        throw new Error(`AUR0760: No definition found for type ${Type.name}`);
    }
    return def;
};
const createElementInjectable = () => {
    const $injectable = function (target, property, index) {
        const annotationParamtypes = DI.getOrCreateAnnotationParamTypes(target);
        annotationParamtypes[index] = $injectable;
        return target;
    };
    $injectable.register = function (_container) {
        return {
            resolve(container, requestor) {
                if (requestor.has($injectable, true)) {
                    return requestor.get($injectable);
                }
                else {
                    return null;
                }
            },
        };
    };
    return $injectable;
};
const generateElementType = (function () {
    const nameDescriptor = {
        value: '',
        writable: false,
        enumerable: false,
        configurable: true,
    };
    const defaultProto = {};
    return function (name, proto = defaultProto) {
        const Type = class {
        };
        nameDescriptor.value = name;
        Reflect.defineProperty(Type, 'name', nameDescriptor);
        if (proto !== defaultProto) {
            Object.assign(Type.prototype, proto);
        }
        return Type;
    };
})();
const CustomElement = Object.freeze({
    name: elementBaseName,
    keyFrom: getElementKeyFrom,
    isType: isElementType,
    for: findElementControllerFor,
    define: defineElement,
    getDefinition: getElementDefinition,
    annotate: annotateElementMetadata,
    getAnnotation: getElementAnnotation,
    generateName: generateElementName,
    createInjectable: createElementInjectable,
    generateType: generateElementType,
});
const pcHookMetadataProperty = getAnnotationKeyFor('processContent');
function processContent(hook) {
    return hook === void 0
        ? function (target, propertyKey, _descriptor) {
            defineMetadata(pcHookMetadataProperty, ensureHook(target, propertyKey), target);
        }
        : function (target) {
            hook = ensureHook(target, hook);
            const def = getOwnMetadata(elementBaseName, target);
            if (def !== void 0) {
                def.processContent = hook;
            }
            else {
                defineMetadata(pcHookMetadataProperty, hook, target);
            }
            return target;
        };
}
function ensureHook(target, hook) {
    if (isString(hook)) {
        hook = target[hook];
    }
    if (!isFunction(hook)) {
        throw new Error(`AUR0766: Invalid @processContent hook. Expected the hook to be a function (when defined in a class, it needs to be a static function) but got a ${typeof hook}.`);
    }
    return hook;
}
function capture(targetOrFilter) {
    return function ($target) {
        const value = isFunction(targetOrFilter) ? targetOrFilter : true;
        annotateElementMetadata($target, 'capture', value);
        if (isElementType($target)) {
            getElementDefinition($target).capture = value;
        }
    };
}

class ClassAttributeAccessor {
    constructor(obj) {
        this.obj = obj;
        this.type = 2 | 4;
        this.value = '';
        this._oldValue = '';
        this._nameIndex = {};
        this._version = 0;
        this._hasChanges = false;
    }
    get doNotCache() { return true; }
    getValue() {
        return this.value;
    }
    setValue(newValue, flags) {
        this.value = newValue;
        this._hasChanges = newValue !== this._oldValue;
        if ((flags & 32) === 0) {
            this._flushChanges();
        }
    }
    _flushChanges() {
        if (this._hasChanges) {
            this._hasChanges = false;
            const currentValue = this.value;
            const nameIndex = this._nameIndex;
            const classesToAdd = getClassesToAdd(currentValue);
            let version = this._version;
            this._oldValue = currentValue;
            if (classesToAdd.length > 0) {
                this._addClassesAndUpdateIndex(classesToAdd);
            }
            this._version += 1;
            if (version === 0) {
                return;
            }
            version -= 1;
            for (const name in nameIndex) {
                if (!hasOwnProperty.call(nameIndex, name) || nameIndex[name] !== version) {
                    continue;
                }
                this.obj.classList.remove(name);
            }
        }
    }
    _addClassesAndUpdateIndex(classes) {
        const node = this.obj;
        const ii = classes.length;
        let i = 0;
        let className;
        for (; i < ii; i++) {
            className = classes[i];
            if (className.length === 0) {
                continue;
            }
            this._nameIndex[className] = this._version;
            node.classList.add(className);
        }
    }
}
function getClassesToAdd(object) {
    if (isString(object)) {
        return splitClassString(object);
    }
    if (typeof object !== 'object') {
        return emptyArray;
    }
    if (object instanceof Array) {
        const len = object.length;
        if (len > 0) {
            const classes = [];
            let i = 0;
            for (; len > i; ++i) {
                classes.push(...getClassesToAdd(object[i]));
            }
            return classes;
        }
        else {
            return emptyArray;
        }
    }
    const classes = [];
    let property;
    for (property in object) {
        if (Boolean(object[property])) {
            if (property.includes(' ')) {
                classes.push(...splitClassString(property));
            }
            else {
                classes.push(property);
            }
        }
    }
    return classes;
}
function splitClassString(classString) {
    const matches = classString.match(/\S+/g);
    if (matches === null) {
        return emptyArray;
    }
    return matches;
}

function cssModules(...modules) {
    return new CSSModulesProcessorRegistry(modules);
}
class CSSModulesProcessorRegistry {
    constructor(modules) {
        this.modules = modules;
    }
    register(container) {
        var _a;
        const classLookup = Object.assign({}, ...this.modules);
        const ClassCustomAttribute = defineAttribute({
            name: 'class',
            bindables: ['value'],
            noMultiBindings: true,
        }, (_a = class CustomAttributeClass {
                constructor(element) {
                    this.element = element;
                }
                binding() {
                    this.valueChanged();
                }
                valueChanged() {
                    if (!this.value) {
                        this.element.className = '';
                        return;
                    }
                    this.element.className = getClassesToAdd(this.value).map(x => classLookup[x] || x).join(' ');
                }
            },
            _a.inject = [INode],
            _a));
        container.register(ClassCustomAttribute);
    }
}
function shadowCSS(...css) {
    return new ShadowDOMRegistry(css);
}
const IShadowDOMStyleFactory = DI.createInterface('IShadowDOMStyleFactory', x => x.cachedCallback(handler => {
    if (AdoptedStyleSheetsStyles.supported(handler.get(IPlatform))) {
        return handler.get(AdoptedStyleSheetsStylesFactory);
    }
    return handler.get(StyleElementStylesFactory);
}));
class ShadowDOMRegistry {
    constructor(css) {
        this.css = css;
    }
    register(container) {
        const sharedStyles = container.get(IShadowDOMGlobalStyles);
        const factory = container.get(IShadowDOMStyleFactory);
        container.register(instanceRegistration(IShadowDOMStyles, factory.createStyles(this.css, sharedStyles)));
    }
}
class AdoptedStyleSheetsStylesFactory {
    constructor(p) {
        this.p = p;
        this.cache = new Map();
    }
    createStyles(localStyles, sharedStyles) {
        return new AdoptedStyleSheetsStyles(this.p, localStyles, this.cache, sharedStyles);
    }
}
AdoptedStyleSheetsStylesFactory.inject = [IPlatform];
class StyleElementStylesFactory {
    constructor(p) {
        this.p = p;
    }
    createStyles(localStyles, sharedStyles) {
        return new StyleElementStyles(this.p, localStyles, sharedStyles);
    }
}
StyleElementStylesFactory.inject = [IPlatform];
const IShadowDOMStyles = DI.createInterface('IShadowDOMStyles');
const IShadowDOMGlobalStyles = DI.createInterface('IShadowDOMGlobalStyles', x => x.instance({ applyTo: noop }));
class AdoptedStyleSheetsStyles {
    constructor(p, localStyles, styleSheetCache, sharedStyles = null) {
        this.sharedStyles = sharedStyles;
        this.styleSheets = localStyles.map(x => {
            let sheet;
            if (x instanceof p.CSSStyleSheet) {
                sheet = x;
            }
            else {
                sheet = styleSheetCache.get(x);
                if (sheet === void 0) {
                    sheet = new p.CSSStyleSheet();
                    sheet.replaceSync(x);
                    styleSheetCache.set(x, sheet);
                }
            }
            return sheet;
        });
    }
    static supported(p) {
        return 'adoptedStyleSheets' in p.ShadowRoot.prototype;
    }
    applyTo(shadowRoot) {
        if (this.sharedStyles !== null) {
            this.sharedStyles.applyTo(shadowRoot);
        }
        shadowRoot.adoptedStyleSheets = [
            ...shadowRoot.adoptedStyleSheets,
            ...this.styleSheets
        ];
    }
}
class StyleElementStyles {
    constructor(p, localStyles, sharedStyles = null) {
        this.p = p;
        this.localStyles = localStyles;
        this.sharedStyles = sharedStyles;
    }
    applyTo(shadowRoot) {
        const styles = this.localStyles;
        const p = this.p;
        for (let i = styles.length - 1; i > -1; --i) {
            const element = p.document.createElement('style');
            element.innerHTML = styles[i];
            shadowRoot.prepend(element);
        }
        if (this.sharedStyles !== null) {
            this.sharedStyles.applyTo(shadowRoot);
        }
    }
}
const StyleConfiguration = {
    shadowDOM(config) {
        return AppTask.creating(IContainer, container => {
            if (config.sharedStyles != null) {
                const factory = container.get(IShadowDOMStyleFactory);
                container.register(instanceRegistration(IShadowDOMGlobalStyles, factory.createStyles(config.sharedStyles, null)));
            }
        });
    }
};

const { enter, exit } = ConnectableSwitcher;
const { wrap, unwrap } = ProxyObservable;
class ComputedWatcher {
    constructor(obj, observerLocator, get, cb, useProxy) {
        this.obj = obj;
        this.get = get;
        this.cb = cb;
        this.useProxy = useProxy;
        this.interceptor = this;
        this.value = void 0;
        this.isBound = false;
        this.running = false;
        this.oL = observerLocator;
    }
    handleChange() {
        this.run();
    }
    handleCollectionChange() {
        this.run();
    }
    $bind() {
        if (this.isBound) {
            return;
        }
        this.isBound = true;
        this.compute();
    }
    $unbind() {
        if (!this.isBound) {
            return;
        }
        this.isBound = false;
        this.obs.clearAll();
    }
    run() {
        if (!this.isBound || this.running) {
            return;
        }
        const obj = this.obj;
        const oldValue = this.value;
        const newValue = this.compute();
        if (!Object.is(newValue, oldValue)) {
            this.cb.call(obj, newValue, oldValue, obj);
        }
    }
    compute() {
        this.running = true;
        this.obs.version++;
        try {
            enter(this);
            return this.value = unwrap(this.get.call(void 0, this.useProxy ? wrap(this.obj) : this.obj, this));
        }
        finally {
            this.obs.clear();
            this.running = false;
            exit(this);
        }
    }
}
class ExpressionWatcher {
    constructor(scope, locator, oL, expression, callback) {
        this.scope = scope;
        this.locator = locator;
        this.oL = oL;
        this.expression = expression;
        this.callback = callback;
        this.interceptor = this;
        this.isBound = false;
        this.obj = scope.bindingContext;
    }
    handleChange(value) {
        const expr = this.expression;
        const obj = this.obj;
        const oldValue = this.value;
        const canOptimize = expr.$kind === 10082 && this.obs.count === 1;
        if (!canOptimize) {
            this.obs.version++;
            value = expr.evaluate(0, this.scope, this.locator, this);
            this.obs.clear();
        }
        if (!Object.is(value, oldValue)) {
            this.value = value;
            this.callback.call(obj, value, oldValue, obj);
        }
    }
    $bind() {
        if (this.isBound) {
            return;
        }
        this.isBound = true;
        this.obs.version++;
        this.value = this.expression.evaluate(0, this.scope, this.locator, this);
        this.obs.clear();
    }
    $unbind() {
        if (!this.isBound) {
            return;
        }
        this.isBound = false;
        this.obs.clearAll();
        this.value = void 0;
    }
}
connectable(ComputedWatcher);
connectable(ExpressionWatcher);

const ILifecycleHooks = DI.createInterface('ILifecycleHooks');
class LifecycleHooksEntry {
    constructor(definition, instance) {
        this.definition = definition;
        this.instance = instance;
    }
}
class LifecycleHooksDefinition {
    constructor(Type, propertyNames) {
        this.Type = Type;
        this.propertyNames = propertyNames;
    }
    static create(def, Type) {
        const propertyNames = new Set();
        let proto = Type.prototype;
        while (proto !== Object.prototype) {
            for (const name of Object.getOwnPropertyNames(proto)) {
                if (name !== 'constructor') {
                    propertyNames.add(name);
                }
            }
            proto = Object.getPrototypeOf(proto);
        }
        return new LifecycleHooksDefinition(Type, propertyNames);
    }
    register(container) {
        singletonRegistration(ILifecycleHooks, this.Type).register(container);
    }
}
const containerLookup = new WeakMap();
const lhBaseName = getAnnotationKeyFor('lifecycle-hooks');
const LifecycleHooks = Object.freeze({
    name: lhBaseName,
    define(def, Type) {
        const definition = LifecycleHooksDefinition.create(def, Type);
        defineMetadata(lhBaseName, definition, Type);
        appendResourceKey(Type, lhBaseName);
        return definition.Type;
    },
    resolve(ctx) {
        let lookup = containerLookup.get(ctx);
        if (lookup === void 0) {
            containerLookup.set(ctx, lookup = new LifecycleHooksLookupImpl());
            const root = ctx.root;
            const instances = root.id === ctx.id
                ? ctx.getAll(ILifecycleHooks)
                : ctx.has(ILifecycleHooks, false)
                    ? root.getAll(ILifecycleHooks).concat(ctx.getAll(ILifecycleHooks))
                    : root.getAll(ILifecycleHooks);
            let instance;
            let definition;
            let entry;
            let name;
            let entries;
            for (instance of instances) {
                definition = getOwnMetadata(lhBaseName, instance.constructor);
                entry = new LifecycleHooksEntry(definition, instance);
                for (name of definition.propertyNames) {
                    entries = lookup[name];
                    if (entries === void 0) {
                        lookup[name] = [entry];
                    }
                    else {
                        entries.push(entry);
                    }
                }
            }
        }
        return lookup;
    },
});
class LifecycleHooksLookupImpl {
}
function lifecycleHooks() {
    return function decorator(target) {
        return LifecycleHooks.define({}, target);
    };
}

const IViewFactory = DI.createInterface('IViewFactory');
class ViewFactory {
    constructor(container, def) {
        this.isCaching = false;
        this.cache = null;
        this.cacheSize = -1;
        this.name = def.name;
        this.container = container;
        this.def = def;
    }
    setCacheSize(size, doNotOverrideIfAlreadySet) {
        if (size) {
            if (size === '*') {
                size = ViewFactory.maxCacheSize;
            }
            else if (isString(size)) {
                size = parseInt(size, 10);
            }
            if (this.cacheSize === -1 || !doNotOverrideIfAlreadySet) {
                this.cacheSize = size;
            }
        }
        if (this.cacheSize > 0) {
            this.cache = [];
        }
        else {
            this.cache = null;
        }
        this.isCaching = this.cacheSize > 0;
    }
    canReturnToCache(_controller) {
        return this.cache != null && this.cache.length < this.cacheSize;
    }
    tryReturnToCache(controller) {
        if (this.canReturnToCache(controller)) {
            this.cache.push(controller);
            return true;
        }
        return false;
    }
    create(parentController) {
        const cache = this.cache;
        let controller;
        if (cache != null && cache.length > 0) {
            controller = cache.pop();
            return controller;
        }
        controller = Controller.$view(this, parentController);
        return controller;
    }
}
ViewFactory.maxCacheSize = 0xFFFF;
const seenViews = new WeakSet();
function notYetSeen($view) {
    return !seenViews.has($view);
}
function toCustomElementDefinition($view) {
    seenViews.add($view);
    return CustomElementDefinition.create($view);
}
const viewsBaseName = getResourceKeyFor('views');
const Views = Object.freeze({
    name: viewsBaseName,
    has(value) {
        return isFunction(value) && (hasOwnMetadata(viewsBaseName, value) || '$views' in value);
    },
    get(value) {
        if (isFunction(value) && '$views' in value) {
            const $views = value.$views;
            const definitions = $views.filter(notYetSeen).map(toCustomElementDefinition);
            for (const def of definitions) {
                Views.add(value, def);
            }
        }
        let views = getOwnMetadata(viewsBaseName, value);
        if (views === void 0) {
            defineMetadata(viewsBaseName, views = [], value);
        }
        return views;
    },
    add(Type, partialDefinition) {
        const definition = CustomElementDefinition.create(partialDefinition);
        let views = getOwnMetadata(viewsBaseName, Type);
        if (views === void 0) {
            defineMetadata(viewsBaseName, views = [definition], Type);
        }
        else {
            views.push(definition);
        }
        return views;
    },
});
function view(v) {
    return function (target) {
        Views.add(target, v);
    };
}
const IViewLocator = DI.createInterface('IViewLocator', x => x.singleton(ViewLocator));
class ViewLocator {
    constructor() {
        this._modelInstanceToBoundComponent = new WeakMap();
        this._modelTypeToUnboundComponent = new Map();
    }
    getViewComponentForObject(object, viewNameOrSelector) {
        if (object) {
            const availableViews = Views.has(object.constructor) ? Views.get(object.constructor) : [];
            const resolvedViewName = isFunction(viewNameOrSelector)
                ? viewNameOrSelector(object, availableViews)
                : this._getViewName(availableViews, viewNameOrSelector);
            return this._getOrCreateBoundComponent(object, availableViews, resolvedViewName);
        }
        return null;
    }
    _getOrCreateBoundComponent(object, availableViews, resolvedViewName) {
        let lookup = this._modelInstanceToBoundComponent.get(object);
        let BoundComponent;
        if (lookup === void 0) {
            lookup = {};
            this._modelInstanceToBoundComponent.set(object, lookup);
        }
        else {
            BoundComponent = lookup[resolvedViewName];
        }
        if (BoundComponent === void 0) {
            const UnboundComponent = this._getOrCreateUnboundComponent(object, availableViews, resolvedViewName);
            BoundComponent = defineElement(getElementDefinition(UnboundComponent), class extends UnboundComponent {
                constructor() {
                    super(object);
                }
            });
            lookup[resolvedViewName] = BoundComponent;
        }
        return BoundComponent;
    }
    _getOrCreateUnboundComponent(object, availableViews, resolvedViewName) {
        let lookup = this._modelTypeToUnboundComponent.get(object.constructor);
        let UnboundComponent;
        if (lookup === void 0) {
            lookup = {};
            this._modelTypeToUnboundComponent.set(object.constructor, lookup);
        }
        else {
            UnboundComponent = lookup[resolvedViewName];
        }
        if (UnboundComponent === void 0) {
            UnboundComponent = defineElement(this._getView(availableViews, resolvedViewName), class {
                constructor(viewModel) {
                    this.viewModel = viewModel;
                }
                define(controller, hydrationContext, definition) {
                    const vm = this.viewModel;
                    controller.scope = Scope.fromParent(controller.scope, vm);
                    if (vm.define !== void 0) {
                        return vm.define(controller, hydrationContext, definition);
                    }
                }
            });
            const proto = UnboundComponent.prototype;
            if ('hydrating' in object) {
                proto.hydrating = function hydrating(controller) {
                    this.viewModel.hydrating(controller);
                };
            }
            if ('hydrated' in object) {
                proto.hydrated = function hydrated(controller) {
                    this.viewModel.hydrated(controller);
                };
            }
            if ('created' in object) {
                proto.created = function created(controller) {
                    this.viewModel.created(controller);
                };
            }
            if ('binding' in object) {
                proto.binding = function binding(initiator, parent, flags) {
                    return this.viewModel.binding(initiator, parent, flags);
                };
            }
            if ('bound' in object) {
                proto.bound = function bound(initiator, parent, flags) {
                    return this.viewModel.bound(initiator, parent, flags);
                };
            }
            if ('attaching' in object) {
                proto.attaching = function attaching(initiator, parent, flags) {
                    return this.viewModel.attaching(initiator, parent, flags);
                };
            }
            if ('attached' in object) {
                proto.attached = function attached(initiator, flags) {
                    return this.viewModel.attached(initiator, flags);
                };
            }
            if ('detaching' in object) {
                proto.detaching = function detaching(initiator, parent, flags) {
                    return this.viewModel.detaching(initiator, parent, flags);
                };
            }
            if ('unbinding' in object) {
                proto.unbinding = function unbinding(initiator, parent, flags) {
                    return this.viewModel.unbinding(initiator, parent, flags);
                };
            }
            if ('dispose' in object) {
                proto.dispose = function dispose() {
                    this.viewModel.dispose();
                };
            }
            lookup[resolvedViewName] = UnboundComponent;
        }
        return UnboundComponent;
    }
    _getViewName(views, requestedName) {
        if (requestedName) {
            return requestedName;
        }
        if (views.length === 1) {
            return views[0].name;
        }
        return 'default-view';
    }
    _getView(views, name) {
        const v = views.find(x => x.name === name);
        if (v === void 0) {
            throw new Error(`Could not find view: ${name}`);
        }
        return v;
    }
}

const IRendering = DI.createInterface('IRendering', x => x.singleton(Rendering));
class Rendering {
    constructor(container) {
        this._compilationCache = new WeakMap();
        this._fragmentCache = new WeakMap();
        this._p = (this._ctn = container.root).get(IPlatform);
        this._empty = new FragmentNodeSequence(this._p, this._p.document.createDocumentFragment());
    }
    get renderers() {
        return this.rs == null
            ? (this.rs = this._ctn.getAll(IRenderer, false).reduce((all, r) => {
                all[r.target] = r;
                return all;
            }, createLookup()))
            : this.rs;
    }
    compile(definition, container, compilationInstruction) {
        if (definition.needsCompile !== false) {
            const compiledMap = this._compilationCache;
            const compiler = container.get(ITemplateCompiler);
            let compiled = compiledMap.get(definition);
            if (compiled == null) {
                compiledMap.set(definition, compiled = compiler.compile(definition, container, compilationInstruction));
            }
            else {
                container.register(...compiled.dependencies);
            }
            return compiled;
        }
        return definition;
    }
    getViewFactory(definition, container) {
        return new ViewFactory(container, CustomElementDefinition.getOrCreate(definition));
    }
    createNodes(definition) {
        if (definition.enhance === true) {
            return new FragmentNodeSequence(this._p, definition.template);
        }
        let fragment;
        const cache = this._fragmentCache;
        if (cache.has(definition)) {
            fragment = cache.get(definition);
        }
        else {
            const p = this._p;
            const doc = p.document;
            const template = definition.template;
            let tpl;
            if (template === null) {
                fragment = null;
            }
            else if (template instanceof p.Node) {
                if (template.nodeName === 'TEMPLATE') {
                    fragment = doc.adoptNode(template.content);
                }
                else {
                    (fragment = doc.adoptNode(doc.createDocumentFragment())).appendChild(template.cloneNode(true));
                }
            }
            else {
                tpl = doc.createElement('template');
                if (isString(template)) {
                    tpl.innerHTML = template;
                }
                doc.adoptNode(fragment = tpl.content);
            }
            cache.set(definition, fragment);
        }
        return fragment == null
            ? this._empty
            : new FragmentNodeSequence(this._p, fragment.cloneNode(true));
    }
    render(controller, targets, definition, host) {
        const rows = definition.instructions;
        const renderers = this.renderers;
        const ii = targets.length;
        if (targets.length !== rows.length) {
            throw new Error(`AUR0757: The compiled template is not aligned with the render instructions. There are ${ii} targets and ${rows.length} instructions.`);
        }
        let i = 0;
        let j = 0;
        let jj = 0;
        let row;
        let instruction;
        let target;
        if (ii > 0) {
            while (ii > i) {
                row = rows[i];
                target = targets[i];
                j = 0;
                jj = row.length;
                while (jj > j) {
                    instruction = row[j];
                    renderers[instruction.type].render(controller, target, instruction);
                    ++j;
                }
                ++i;
            }
        }
        if (host !== void 0 && host !== null) {
            row = definition.surrogates;
            if ((jj = row.length) > 0) {
                j = 0;
                while (jj > j) {
                    instruction = row[j];
                    renderers[instruction.type].render(controller, host, instruction);
                    ++j;
                }
            }
        }
    }
}
Rendering.inject = [IContainer];

var MountTarget;
(function (MountTarget) {
    MountTarget[MountTarget["none"] = 0] = "none";
    MountTarget[MountTarget["host"] = 1] = "host";
    MountTarget[MountTarget["shadowRoot"] = 2] = "shadowRoot";
    MountTarget[MountTarget["location"] = 3] = "location";
})(MountTarget || (MountTarget = {}));
const optionalCeFind = { optional: true };
const controllerLookup = new WeakMap();
class Controller {
    constructor(container, vmKind, definition, viewFactory, viewModel, host, location) {
        this.container = container;
        this.vmKind = vmKind;
        this.definition = definition;
        this.viewFactory = viewFactory;
        this.viewModel = viewModel;
        this.host = host;
        this.id = nextId('au$component');
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
        this._fullyNamed = false;
        this._childrenObs = emptyArray;
        this.flags = 0;
        this.$initiator = null;
        this.$flags = 0;
        this.$resolve = void 0;
        this.$reject = void 0;
        this.$promise = void 0;
        this._activatingStack = 0;
        this._detachingStack = 0;
        this._unbindingStack = 0;
        {
            this.logger = null;
            this.debug = false;
        }
        this.location = location;
        this._rendering = container.root.get(IRendering);
        switch (vmKind) {
            case 1:
            case 0:
                this.hooks = new HooksDefinition(viewModel);
                break;
            case 2:
                this.hooks = HooksDefinition.none;
                break;
        }
    }
    get isActive() {
        return (this.state & (1 | 2)) > 0 && (this.state & 4) === 0;
    }
    get name() {
        var _a;
        if (this.parent === null) {
            switch (this.vmKind) {
                case 1:
                    return `[${this.definition.name}]`;
                case 0:
                    return this.definition.name;
                case 2:
                    return this.viewFactory.name;
            }
        }
        switch (this.vmKind) {
            case 1:
                return `${this.parent.name}>[${this.definition.name}]`;
            case 0:
                return `${this.parent.name}>${this.definition.name}`;
            case 2:
                return this.viewFactory.name === ((_a = this.parent.definition) === null || _a === void 0 ? void 0 : _a.name)
                    ? `${this.parent.name}[view]`
                    : `${this.parent.name}[view:${this.viewFactory.name}]`;
        }
    }
    static getCached(viewModel) {
        return controllerLookup.get(viewModel);
    }
    static getCachedOrThrow(viewModel) {
        const $el = Controller.getCached(viewModel);
        if ($el === void 0) {
            throw new Error(`AUR0500: There is no cached controller for the provided ViewModel: ${viewModel}`);
        }
        return $el;
    }
    static $el(ctn, viewModel, host, hydrationInst, definition = void 0, location = null) {
        if (controllerLookup.has(viewModel)) {
            return controllerLookup.get(viewModel);
        }
        definition = definition !== null && definition !== void 0 ? definition : getElementDefinition(viewModel.constructor);
        const controller = new Controller(ctn, 0, definition, null, viewModel, host, location);
        const hydrationContext = ctn.get(optional(IHydrationContext));
        if (definition.dependencies.length > 0) {
            ctn.register(...definition.dependencies);
        }
        ctn.registerResolver(IHydrationContext, new InstanceProvider('IHydrationContext', new HydrationContext(controller, hydrationInst, hydrationContext)));
        controllerLookup.set(viewModel, controller);
        if (hydrationInst == null || hydrationInst.hydrate !== false) {
            controller._hydrateCustomElement(hydrationInst, hydrationContext);
        }
        return controller;
    }
    static $attr(ctn, viewModel, host, definition) {
        if (controllerLookup.has(viewModel)) {
            return controllerLookup.get(viewModel);
        }
        definition = definition !== null && definition !== void 0 ? definition : getAttributeDefinition(viewModel.constructor);
        const controller = new Controller(ctn, 1, definition, null, viewModel, host, null);
        if (definition.dependencies.length > 0) {
            ctn.register(...definition.dependencies);
        }
        controllerLookup.set(viewModel, controller);
        controller._hydrateCustomAttribute();
        return controller;
    }
    static $view(viewFactory, parentController = void 0) {
        const controller = new Controller(viewFactory.container, 2, null, viewFactory, null, null, null);
        controller.parent = parentController !== null && parentController !== void 0 ? parentController : null;
        controller._hydrateSynthetic();
        return controller;
    }
    _hydrateCustomElement(hydrationInst, hydrationContext) {
        {
            this.logger = this.container.get(ILogger).root;
            this.debug = this.logger.config.level <= 1;
            if (this.debug) {
                this.logger = this.logger.scopeTo(this.name);
            }
        }
        const container = this.container;
        const flags = this.flags;
        const instance = this.viewModel;
        let definition = this.definition;
        this.scope = Scope.create(instance, null, true);
        if (definition.watches.length > 0) {
            createWatchers(this, container, definition, instance);
        }
        createObservers(this, definition, flags, instance);
        this._childrenObs = createChildrenObservers(this, definition, instance);
        if (this.hooks.hasDefine) {
            if (this.debug) {
                this.logger.trace(`invoking define() hook`);
            }
            const result = instance.define(this, hydrationContext, definition);
            if (result !== void 0 && result !== definition) {
                definition = CustomElementDefinition.getOrCreate(result);
            }
        }
        this.lifecycleHooks = LifecycleHooks.resolve(container);
        definition.register(container);
        if (definition.injectable !== null) {
            container.registerResolver(definition.injectable, new InstanceProvider('definition.injectable', instance));
        }
        if (hydrationInst == null || hydrationInst.hydrate !== false) {
            this._hydrate(hydrationInst);
            this._hydrateChildren();
        }
    }
    _hydrate(hydrationInst) {
        if (this.lifecycleHooks.hydrating !== void 0) {
            this.lifecycleHooks.hydrating.forEach(callHydratingHook, this);
        }
        if (this.hooks.hasHydrating) {
            if (this.debug) {
                this.logger.trace(`invoking hydrating() hook`);
            }
            this.viewModel.hydrating(this);
        }
        const compiledDef = this._compiledDef = this._rendering.compile(this.definition, this.container, hydrationInst);
        const { shadowOptions, isStrictBinding, hasSlots, containerless } = compiledDef;
        let location = this.location;
        this.isStrictBinding = isStrictBinding;
        if ((this.hostController = findElementControllerFor(this.host, optionalCeFind)) !== null) {
            this.host = this.container.root.get(IPlatform).document.createElement(this.definition.name);
            if (containerless && location == null) {
                location = this.location = convertToRenderLocation(this.host);
            }
        }
        setRef(this.host, elementBaseName, this);
        setRef(this.host, this.definition.key, this);
        if (shadowOptions !== null || hasSlots) {
            if (location != null) {
                throw new Error(`AUR0501: Cannot combine the containerless custom element option with Shadow DOM.`);
            }
            setRef(this.shadowRoot = this.host.attachShadow(shadowOptions !== null && shadowOptions !== void 0 ? shadowOptions : defaultShadowOptions), elementBaseName, this);
            setRef(this.shadowRoot, this.definition.key, this);
            this.mountTarget = 2;
        }
        else if (location != null) {
            setRef(location, elementBaseName, this);
            setRef(location, this.definition.key, this);
            this.mountTarget = 3;
        }
        else {
            this.mountTarget = 1;
        }
        this.viewModel.$controller = this;
        this.nodes = this._rendering.createNodes(compiledDef);
        if (this.lifecycleHooks.hydrated !== void 0) {
            this.lifecycleHooks.hydrated.forEach(callHydratedHook, this);
        }
        if (this.hooks.hasHydrated) {
            if (this.debug) {
                this.logger.trace(`invoking hydrated() hook`);
            }
            this.viewModel.hydrated(this);
        }
    }
    _hydrateChildren() {
        this._rendering.render(this, this.nodes.findTargets(), this._compiledDef, this.host);
        if (this.lifecycleHooks.created !== void 0) {
            this.lifecycleHooks.created.forEach(callCreatedHook, this);
        }
        if (this.hooks.hasCreated) {
            if (this.debug) {
                this.logger.trace(`invoking created() hook`);
            }
            this.viewModel.created(this);
        }
    }
    _hydrateCustomAttribute() {
        const definition = this.definition;
        const instance = this.viewModel;
        if (definition.watches.length > 0) {
            createWatchers(this, this.container, definition, instance);
        }
        createObservers(this, definition, this.flags, instance);
        instance.$controller = this;
        this.lifecycleHooks = LifecycleHooks.resolve(this.container);
        if (this.lifecycleHooks.created !== void 0) {
            this.lifecycleHooks.created.forEach(callCreatedHook, this);
        }
        if (this.hooks.hasCreated) {
            if (this.debug) {
                this.logger.trace(`invoking created() hook`);
            }
            this.viewModel.created(this);
        }
    }
    _hydrateSynthetic() {
        this._compiledDef = this._rendering.compile(this.viewFactory.def, this.container, null);
        this.isStrictBinding = this._compiledDef.isStrictBinding;
        this._rendering.render(this, (this.nodes = this._rendering.createNodes(this._compiledDef)).findTargets(), this._compiledDef, void 0);
    }
    activate(initiator, parent, flags, scope) {
        var _a;
        switch (this.state) {
            case 0:
            case 8:
                if (!(parent === null || parent.isActive)) {
                    return;
                }
                this.state = 1;
                break;
            case 2:
                return;
            case 32:
                throw new Error(`AUR0502: ${this.name} trying to activate a controller that is disposed.`);
            default:
                throw new Error(`AUR0503: ${this.name} unexpected state: ${stringifyState(this.state)}.`);
        }
        this.parent = parent;
        if (this.debug && !this._fullyNamed) {
            this._fullyNamed = true;
            ((_a = this.logger) !== null && _a !== void 0 ? _a : (this.logger = this.container.get(ILogger).root.scopeTo(this.name))).trace(`activate()`);
        }
        flags |= 2;
        switch (this.vmKind) {
            case 0:
                this.scope.parentScope = scope !== null && scope !== void 0 ? scope : null;
                break;
            case 1:
                this.scope = scope !== null && scope !== void 0 ? scope : null;
                break;
            case 2:
                if (scope === void 0 || scope === null) {
                    throw new Error(`AUR0504: Scope is null or undefined`);
                }
                if (!this.hasLockedScope) {
                    this.scope = scope;
                }
                break;
        }
        if (this.isStrictBinding) {
            flags |= 1;
        }
        this.$initiator = initiator;
        this.$flags = flags;
        this._enterActivating();
        let ret;
        if (this.vmKind !== 2 && this.lifecycleHooks.binding != null) {
            if (this.debug) {
                this.logger.trace(`lifecycleHooks.binding()`);
            }
            ret = resolveAll(...this.lifecycleHooks.binding.map(callBindingHook, this));
        }
        if (this.hooks.hasBinding) {
            if (this.debug) {
                this.logger.trace(`binding()`);
            }
            ret = resolveAll(ret, this.viewModel.binding(this.$initiator, this.parent, this.$flags));
        }
        if (isPromise(ret)) {
            this._ensurePromise();
            ret.then(() => {
                this.bind();
            }).catch((err) => {
                this._reject(err);
            });
            return this.$promise;
        }
        this.bind();
        return this.$promise;
    }
    bind() {
        if (this.debug) {
            this.logger.trace(`bind()`);
        }
        let i = 0;
        let ii = this._childrenObs.length;
        let ret;
        if (ii > 0) {
            while (ii > i) {
                this._childrenObs[i].start();
                ++i;
            }
        }
        if (this.bindings !== null) {
            i = 0;
            ii = this.bindings.length;
            while (ii > i) {
                this.bindings[i].$bind(this.$flags, this.scope);
                ++i;
            }
        }
        if (this.vmKind !== 2 && this.lifecycleHooks.bound != null) {
            if (this.debug) {
                this.logger.trace(`lifecycleHooks.bound()`);
            }
            ret = resolveAll(...this.lifecycleHooks.bound.map(callBoundHook, this));
        }
        if (this.hooks.hasBound) {
            if (this.debug) {
                this.logger.trace(`bound()`);
            }
            ret = resolveAll(ret, this.viewModel.bound(this.$initiator, this.parent, this.$flags));
        }
        if (isPromise(ret)) {
            this._ensurePromise();
            ret.then(() => {
                this.isBound = true;
                this._attach();
            }).catch((err) => {
                this._reject(err);
            });
            return;
        }
        this.isBound = true;
        this._attach();
    }
    _append(...nodes) {
        switch (this.mountTarget) {
            case 1:
                this.host.append(...nodes);
                break;
            case 2:
                this.shadowRoot.append(...nodes);
                break;
            case 3: {
                let i = 0;
                for (; i < nodes.length; ++i) {
                    this.location.parentNode.insertBefore(nodes[i], this.location);
                }
                break;
            }
        }
    }
    _attach() {
        if (this.debug) {
            this.logger.trace(`attach()`);
        }
        if (this.hostController !== null) {
            switch (this.mountTarget) {
                case 1:
                case 2:
                    this.hostController._append(this.host);
                    break;
                case 3:
                    this.hostController._append(this.location.$start, this.location);
                    break;
            }
        }
        switch (this.mountTarget) {
            case 1:
                this.nodes.appendTo(this.host, this.definition != null && this.definition.enhance);
                break;
            case 2: {
                const container = this.container;
                const styles = container.has(IShadowDOMStyles, false)
                    ? container.get(IShadowDOMStyles)
                    : container.get(IShadowDOMGlobalStyles);
                styles.applyTo(this.shadowRoot);
                this.nodes.appendTo(this.shadowRoot);
                break;
            }
            case 3:
                this.nodes.insertBefore(this.location);
                break;
        }
        let i = 0;
        let ret = void 0;
        if (this.vmKind !== 2 && this.lifecycleHooks.attaching != null) {
            if (this.debug) {
                this.logger.trace(`lifecycleHooks.attaching()`);
            }
            ret = resolveAll(...this.lifecycleHooks.attaching.map(callAttachingHook, this));
        }
        if (this.hooks.hasAttaching) {
            if (this.debug) {
                this.logger.trace(`attaching()`);
            }
            ret = resolveAll(ret, this.viewModel.attaching(this.$initiator, this.parent, this.$flags));
        }
        if (isPromise(ret)) {
            this._ensurePromise();
            this._enterActivating();
            ret.then(() => {
                this._leaveActivating();
            }).catch((err) => {
                this._reject(err);
            });
        }
        if (this.children !== null) {
            for (; i < this.children.length; ++i) {
                void this.children[i].activate(this.$initiator, this, this.$flags, this.scope);
            }
        }
        this._leaveActivating();
    }
    deactivate(initiator, parent, flags) {
        switch ((this.state & ~16)) {
            case 2:
                this.state = 4;
                break;
            case 0:
            case 8:
            case 32:
            case 8 | 32:
                return;
            default:
                throw new Error(`AUR0505: ${this.name} unexpected state: ${stringifyState(this.state)}.`);
        }
        if (this.debug) {
            this.logger.trace(`deactivate()`);
        }
        this.$initiator = initiator;
        this.$flags = flags;
        if (initiator === this) {
            this._enterDetaching();
        }
        let i = 0;
        let ret;
        if (this._childrenObs.length) {
            for (; i < this._childrenObs.length; ++i) {
                this._childrenObs[i].stop();
            }
        }
        if (this.children !== null) {
            for (i = 0; i < this.children.length; ++i) {
                void this.children[i].deactivate(initiator, this, flags);
            }
        }
        if (this.vmKind !== 2 && this.lifecycleHooks.detaching != null) {
            if (this.debug) {
                this.logger.trace(`lifecycleHooks.detaching()`);
            }
            ret = resolveAll(...this.lifecycleHooks.detaching.map(callDetachingHook, this));
        }
        if (this.hooks.hasDetaching) {
            if (this.debug) {
                this.logger.trace(`detaching()`);
            }
            ret = resolveAll(ret, this.viewModel.detaching(this.$initiator, this.parent, this.$flags));
        }
        if (isPromise(ret)) {
            this._ensurePromise();
            initiator._enterDetaching();
            ret.then(() => {
                initiator._leaveDetaching();
            }).catch((err) => {
                initiator._reject(err);
            });
        }
        if (initiator.head === null) {
            initiator.head = this;
        }
        else {
            initiator.tail.next = this;
        }
        initiator.tail = this;
        if (initiator !== this) {
            return;
        }
        this._leaveDetaching();
        return this.$promise;
    }
    removeNodes() {
        switch (this.vmKind) {
            case 0:
            case 2:
                this.nodes.remove();
                this.nodes.unlink();
        }
        if (this.hostController !== null) {
            switch (this.mountTarget) {
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
    }
    unbind() {
        if (this.debug) {
            this.logger.trace(`unbind()`);
        }
        const flags = this.$flags | 4;
        let i = 0;
        if (this.bindings !== null) {
            for (; i < this.bindings.length; ++i) {
                this.bindings[i].$unbind(flags);
            }
        }
        this.parent = null;
        switch (this.vmKind) {
            case 1:
                this.scope = null;
                break;
            case 2:
                if (!this.hasLockedScope) {
                    this.scope = null;
                }
                if ((this.state & 16) === 16 &&
                    !this.viewFactory.tryReturnToCache(this) &&
                    this.$initiator === this) {
                    this.dispose();
                }
                break;
            case 0:
                this.scope.parentScope = null;
                break;
        }
        if ((flags & 16) === 16 && this.$initiator === this) {
            this.dispose();
        }
        this.state = (this.state & 32) | 8;
        this.$initiator = null;
        this._resolve();
    }
    _ensurePromise() {
        if (this.$promise === void 0) {
            this.$promise = new Promise((resolve, reject) => {
                this.$resolve = resolve;
                this.$reject = reject;
            });
            if (this.$initiator !== this) {
                this.parent._ensurePromise();
            }
        }
    }
    _resolve() {
        if (this.$promise !== void 0) {
            _resolve = this.$resolve;
            this.$resolve = this.$reject = this.$promise = void 0;
            _resolve();
            _resolve = void 0;
        }
    }
    _reject(err) {
        if (this.$promise !== void 0) {
            _reject = this.$reject;
            this.$resolve = this.$reject = this.$promise = void 0;
            _reject(err);
            _reject = void 0;
        }
        if (this.$initiator !== this) {
            this.parent._reject(err);
        }
    }
    _enterActivating() {
        ++this._activatingStack;
        if (this.$initiator !== this) {
            this.parent._enterActivating();
        }
    }
    _leaveActivating() {
        if (--this._activatingStack === 0) {
            if (this.vmKind !== 2 && this.lifecycleHooks.attached != null) {
                _retPromise = resolveAll(...this.lifecycleHooks.attached.map(callAttachedHook, this));
            }
            if (this.hooks.hasAttached) {
                if (this.debug) {
                    this.logger.trace(`attached()`);
                }
                _retPromise = resolveAll(_retPromise, this.viewModel.attached(this.$initiator, this.$flags));
            }
            if (isPromise(_retPromise)) {
                this._ensurePromise();
                _retPromise.then(() => {
                    this.state = 2;
                    this._resolve();
                    if (this.$initiator !== this) {
                        this.parent._leaveActivating();
                    }
                }).catch((err) => {
                    this._reject(err);
                });
                _retPromise = void 0;
                return;
            }
            _retPromise = void 0;
            this.state = 2;
            this._resolve();
        }
        if (this.$initiator !== this) {
            this.parent._leaveActivating();
        }
    }
    _enterDetaching() {
        ++this._detachingStack;
    }
    _leaveDetaching() {
        if (--this._detachingStack === 0) {
            if (this.debug) {
                this.logger.trace(`detach()`);
            }
            this._enterUnbinding();
            this.removeNodes();
            let cur = this.$initiator.head;
            let ret;
            while (cur !== null) {
                if (cur !== this) {
                    if (cur.debug) {
                        cur.logger.trace(`detach()`);
                    }
                    cur.removeNodes();
                }
                if (cur.vmKind !== 2 && cur.lifecycleHooks.unbinding != null) {
                    ret = resolveAll(...cur.lifecycleHooks.unbinding.map(callUnbindingHook, this));
                }
                if (cur.hooks.hasUnbinding) {
                    if (cur.debug) {
                        cur.logger.trace('unbinding()');
                    }
                    ret = resolveAll(ret, cur.viewModel.unbinding(cur.$initiator, cur.parent, cur.$flags));
                }
                if (isPromise(ret)) {
                    this._ensurePromise();
                    this._enterUnbinding();
                    ret.then(() => {
                        this._leaveUnbinding();
                    }).catch((err) => {
                        this._reject(err);
                    });
                }
                ret = void 0;
                cur = cur.next;
            }
            this._leaveUnbinding();
        }
    }
    _enterUnbinding() {
        ++this._unbindingStack;
    }
    _leaveUnbinding() {
        if (--this._unbindingStack === 0) {
            if (this.debug) {
                this.logger.trace(`unbind()`);
            }
            let cur = this.$initiator.head;
            let next = null;
            while (cur !== null) {
                if (cur !== this) {
                    cur.isBound = false;
                    cur.unbind();
                }
                next = cur.next;
                cur.next = null;
                cur = next;
            }
            this.head = this.tail = null;
            this.isBound = false;
            this.unbind();
        }
    }
    addBinding(binding) {
        if (this.bindings === null) {
            this.bindings = [binding];
        }
        else {
            this.bindings[this.bindings.length] = binding;
        }
    }
    addChild(controller) {
        if (this.children === null) {
            this.children = [controller];
        }
        else {
            this.children[this.children.length] = controller;
        }
    }
    is(name) {
        switch (this.vmKind) {
            case 1: {
                return getAttributeDefinition(this.viewModel.constructor).name === name;
            }
            case 0: {
                return getElementDefinition(this.viewModel.constructor).name === name;
            }
            case 2:
                return this.viewFactory.name === name;
        }
    }
    lockScope(scope) {
        this.scope = scope;
        this.hasLockedScope = true;
    }
    setHost(host) {
        if (this.vmKind === 0) {
            setRef(host, elementBaseName, this);
            setRef(host, this.definition.key, this);
        }
        this.host = host;
        this.mountTarget = 1;
        return this;
    }
    setShadowRoot(shadowRoot) {
        if (this.vmKind === 0) {
            setRef(shadowRoot, elementBaseName, this);
            setRef(shadowRoot, this.definition.key, this);
        }
        this.shadowRoot = shadowRoot;
        this.mountTarget = 2;
        return this;
    }
    setLocation(location) {
        if (this.vmKind === 0) {
            setRef(location, elementBaseName, this);
            setRef(location, this.definition.key, this);
        }
        this.location = location;
        this.mountTarget = 3;
        return this;
    }
    release() {
        this.state |= 16;
    }
    dispose() {
        if (this.debug) {
            this.logger.trace(`dispose()`);
        }
        if ((this.state & 32) === 32) {
            return;
        }
        this.state |= 32;
        if (this.hooks.hasDispose) {
            this.viewModel.dispose();
        }
        if (this.children !== null) {
            this.children.forEach(callDispose);
            this.children = null;
        }
        this.hostController = null;
        this.scope = null;
        this.nodes = null;
        this.location = null;
        this.viewFactory = null;
        if (this.viewModel !== null) {
            controllerLookup.delete(this.viewModel);
            this.viewModel = null;
        }
        this.viewModel = null;
        this.host = null;
        this.shadowRoot = null;
        this.container.disposeResolvers();
    }
    accept(visitor) {
        if (visitor(this) === true) {
            return true;
        }
        if (this.hooks.hasAccept && this.viewModel.accept(visitor) === true) {
            return true;
        }
        if (this.children !== null) {
            const { children } = this;
            for (let i = 0, ii = children.length; i < ii; ++i) {
                if (children[i].accept(visitor) === true) {
                    return true;
                }
            }
        }
    }
}
function getLookup(instance) {
    let lookup = instance.$observers;
    if (lookup === void 0) {
        Reflect.defineProperty(instance, '$observers', {
            enumerable: false,
            value: lookup = {},
        });
    }
    return lookup;
}
function createObservers(controller, definition, _flags, instance) {
    const bindables = definition.bindables;
    const observableNames = Object.getOwnPropertyNames(bindables);
    const length = observableNames.length;
    if (length > 0) {
        let name;
        let bindable;
        let i = 0;
        const observers = getLookup(instance);
        const container = controller.container;
        const coercionConfiguration = container.has(ICoercionConfiguration, true) ? container.get(ICoercionConfiguration) : null;
        for (; i < length; ++i) {
            name = observableNames[i];
            if (observers[name] === void 0) {
                bindable = bindables[name];
                observers[name] = new BindableObserver(instance, name, bindable.callback, bindable.set, controller, coercionConfiguration);
            }
        }
    }
}
function createChildrenObservers(controller, definition, instance) {
    const childrenObservers = definition.childrenObservers;
    const childObserverNames = Object.getOwnPropertyNames(childrenObservers);
    const length = childObserverNames.length;
    if (length > 0) {
        const observers = getLookup(instance);
        const obs = [];
        let name;
        let i = 0;
        let childrenDescription;
        for (; i < length; ++i) {
            name = childObserverNames[i];
            if (observers[name] == null) {
                childrenDescription = childrenObservers[name];
                obs[obs.length] = observers[name] = new ChildrenObserver(controller, instance, name, childrenDescription.callback, childrenDescription.query, childrenDescription.filter, childrenDescription.map, childrenDescription.options);
            }
        }
        return obs;
    }
    return emptyArray;
}
const AccessScopeAstMap = new Map();
const getAccessScopeAst = (key) => {
    let ast = AccessScopeAstMap.get(key);
    if (ast == null) {
        ast = new AccessScopeExpression(key, 0);
        AccessScopeAstMap.set(key, ast);
    }
    return ast;
};
function createWatchers(controller, context, definition, instance) {
    const observerLocator = context.get(IObserverLocator);
    const expressionParser = context.get(IExpressionParser);
    const watches = definition.watches;
    const scope = controller.vmKind === 0
        ? controller.scope
        : Scope.create(instance, null, true);
    const ii = watches.length;
    let expression;
    let callback;
    let ast;
    let i = 0;
    for (; ii > i; ++i) {
        ({ expression, callback } = watches[i]);
        callback = isFunction(callback)
            ? callback
            : Reflect.get(instance, callback);
        if (!isFunction(callback)) {
            throw new Error(`AUR0506: Invalid callback for @watch decorator: ${String(callback)}`);
        }
        if (isFunction(expression)) {
            controller.addBinding(new ComputedWatcher(instance, observerLocator, expression, callback, true));
        }
        else {
            ast = isString(expression)
                ? expressionParser.parse(expression, 8)
                : getAccessScopeAst(expression);
            controller.addBinding(new ExpressionWatcher(scope, context, observerLocator, ast, callback));
        }
    }
}
function isCustomElementController(value) {
    return value instanceof Controller && value.vmKind === 0;
}
function isCustomElementViewModel(value) {
    return isObject(value) && isElementType(value.constructor);
}
class HooksDefinition {
    constructor(target) {
        this.hasDefine = 'define' in target;
        this.hasHydrating = 'hydrating' in target;
        this.hasHydrated = 'hydrated' in target;
        this.hasCreated = 'created' in target;
        this.hasBinding = 'binding' in target;
        this.hasBound = 'bound' in target;
        this.hasAttaching = 'attaching' in target;
        this.hasAttached = 'attached' in target;
        this.hasDetaching = 'detaching' in target;
        this.hasUnbinding = 'unbinding' in target;
        this.hasDispose = 'dispose' in target;
        this.hasAccept = 'accept' in target;
    }
}
HooksDefinition.none = new HooksDefinition({});
const defaultShadowOptions = {
    mode: 'open'
};
var ViewModelKind;
(function (ViewModelKind) {
    ViewModelKind[ViewModelKind["customElement"] = 0] = "customElement";
    ViewModelKind[ViewModelKind["customAttribute"] = 1] = "customAttribute";
    ViewModelKind[ViewModelKind["synthetic"] = 2] = "synthetic";
})(ViewModelKind || (ViewModelKind = {}));
var State;
(function (State) {
    State[State["none"] = 0] = "none";
    State[State["activating"] = 1] = "activating";
    State[State["activated"] = 2] = "activated";
    State[State["deactivating"] = 4] = "deactivating";
    State[State["deactivated"] = 8] = "deactivated";
    State[State["released"] = 16] = "released";
    State[State["disposed"] = 32] = "disposed";
})(State || (State = {}));
function stringifyState(state) {
    const names = [];
    if ((state & 1) === 1) {
        names.push('activating');
    }
    if ((state & 2) === 2) {
        names.push('activated');
    }
    if ((state & 4) === 4) {
        names.push('deactivating');
    }
    if ((state & 8) === 8) {
        names.push('deactivated');
    }
    if ((state & 16) === 16) {
        names.push('released');
    }
    if ((state & 32) === 32) {
        names.push('disposed');
    }
    return names.length === 0 ? 'none' : names.join('|');
}
const IController = DI.createInterface('IController');
const IHydrationContext = DI.createInterface('IHydrationContext');
class HydrationContext {
    constructor(controller, instruction, parent) {
        this.instruction = instruction;
        this.parent = parent;
        this.controller = controller;
    }
}
function callDispose(disposable) {
    disposable.dispose();
}
function callCreatedHook(l) {
    l.instance.created(this.viewModel, this);
}
function callHydratingHook(l) {
    l.instance.hydrating(this.viewModel, this);
}
function callHydratedHook(l) {
    l.instance.hydrated(this.viewModel, this);
}
function callBindingHook(l) {
    return l.instance.binding(this.viewModel, this['$initiator'], this.parent, this['$flags']);
}
function callBoundHook(l) {
    return l.instance.bound(this.viewModel, this['$initiator'], this.parent, this['$flags']);
}
function callAttachingHook(l) {
    return l.instance.attaching(this.viewModel, this['$initiator'], this.parent, this['$flags']);
}
function callAttachedHook(l) {
    return l.instance.attached(this.viewModel, this['$initiator'], this['$flags']);
}
function callDetachingHook(l) {
    return l.instance.detaching(this.viewModel, this['$initiator'], this.parent, this['$flags']);
}
function callUnbindingHook(l) {
    return l.instance.unbinding(this.viewModel, this['$initiator'], this.parent, this['$flags']);
}
let _resolve;
let _reject;
let _retPromise;

const IAppRoot = DI.createInterface('IAppRoot');
const IWorkTracker = DI.createInterface('IWorkTracker', x => x.singleton(WorkTracker));
class WorkTracker {
    constructor(logger) {
        this._stack = 0;
        this._promise = null;
        this._resolve = null;
        this._logger = logger.scopeTo('WorkTracker');
    }
    start() {
        this._logger.trace(`start(stack:${this._stack})`);
        ++this._stack;
    }
    finish() {
        this._logger.trace(`finish(stack:${this._stack})`);
        if (--this._stack === 0) {
            const resolve = this._resolve;
            if (resolve !== null) {
                this._resolve = this._promise = null;
                resolve();
            }
        }
    }
    wait() {
        this._logger.trace(`wait(stack:${this._stack})`);
        if (this._promise === null) {
            if (this._stack === 0) {
                return Promise.resolve();
            }
            this._promise = new Promise(resolve => {
                this._resolve = resolve;
            });
        }
        return this._promise;
    }
}
WorkTracker.inject = [ILogger];
class AppRoot {
    constructor(config, platform, container, rootProvider) {
        this.config = config;
        this.platform = platform;
        this.container = container;
        this.controller = (void 0);
        this._hydratePromise = void 0;
        this.host = config.host;
        this.work = container.get(IWorkTracker);
        rootProvider.prepare(this);
        container.registerResolver(platform.HTMLElement, container.registerResolver(platform.Element, container.registerResolver(INode, new InstanceProvider('ElementResolver', config.host))));
        this._hydratePromise = onResolve(this._runAppTasks('creating'), () => {
            const component = config.component;
            const childCtn = container.createChild();
            let instance;
            if (isElementType(component)) {
                instance = this.container.get(component);
            }
            else {
                instance = config.component;
            }
            const hydrationInst = { hydrate: false, projections: null };
            const controller = (this.controller = Controller.$el(childCtn, instance, this.host, hydrationInst));
            controller._hydrateCustomElement(hydrationInst, null);
            return onResolve(this._runAppTasks('hydrating'), () => {
                controller._hydrate(null);
                return onResolve(this._runAppTasks('hydrated'), () => {
                    controller._hydrateChildren();
                    this._hydratePromise = void 0;
                });
            });
        });
    }
    activate() {
        return onResolve(this._hydratePromise, () => {
            return onResolve(this._runAppTasks('activating'), () => {
                return onResolve(this.controller.activate(this.controller, null, 2, void 0), () => {
                    return this._runAppTasks('activated');
                });
            });
        });
    }
    deactivate() {
        return onResolve(this._runAppTasks('deactivating'), () => {
            return onResolve(this.controller.deactivate(this.controller, null, 0), () => {
                return this._runAppTasks('deactivated');
            });
        });
    }
    _runAppTasks(slot) {
        return resolveAll(...this.container.getAll(IAppTask).reduce((results, task) => {
            if (task.slot === slot) {
                results.push(task.run());
            }
            return results;
        }, []));
    }
    dispose() {
        var _a;
        (_a = this.controller) === null || _a === void 0 ? void 0 : _a.dispose();
    }
}

class Refs {
}
function getRef(node, name) {
    var _a, _b;
    return (_b = (_a = node.$au) === null || _a === void 0 ? void 0 : _a[name]) !== null && _b !== void 0 ? _b : null;
}
function setRef(node, name, controller) {
    var _a;
    var _b;
    ((_a = (_b = node).$au) !== null && _a !== void 0 ? _a : (_b.$au = new Refs()))[name] = controller;
}
const INode = DI.createInterface('INode');
const IEventTarget = DI.createInterface('IEventTarget', x => x.cachedCallback(handler => {
    if (handler.has(IAppRoot, true)) {
        return handler.get(IAppRoot).host;
    }
    return handler.get(IPlatform).document;
}));
const IRenderLocation = DI.createInterface('IRenderLocation');
var NodeType;
(function (NodeType) {
    NodeType[NodeType["Element"] = 1] = "Element";
    NodeType[NodeType["Attr"] = 2] = "Attr";
    NodeType[NodeType["Text"] = 3] = "Text";
    NodeType[NodeType["CDATASection"] = 4] = "CDATASection";
    NodeType[NodeType["EntityReference"] = 5] = "EntityReference";
    NodeType[NodeType["Entity"] = 6] = "Entity";
    NodeType[NodeType["ProcessingInstruction"] = 7] = "ProcessingInstruction";
    NodeType[NodeType["Comment"] = 8] = "Comment";
    NodeType[NodeType["Document"] = 9] = "Document";
    NodeType[NodeType["DocumentType"] = 10] = "DocumentType";
    NodeType[NodeType["DocumentFragment"] = 11] = "DocumentFragment";
    NodeType[NodeType["Notation"] = 12] = "Notation";
})(NodeType || (NodeType = {}));
const effectiveParentNodeOverrides = new WeakMap();
function getEffectiveParentNode(node) {
    if (effectiveParentNodeOverrides.has(node)) {
        return effectiveParentNodeOverrides.get(node);
    }
    let containerlessOffset = 0;
    let next = node.nextSibling;
    while (next !== null) {
        if (next.nodeType === 8) {
            switch (next.textContent) {
                case 'au-start':
                    ++containerlessOffset;
                    break;
                case 'au-end':
                    if (containerlessOffset-- === 0) {
                        return next;
                    }
            }
        }
        next = next.nextSibling;
    }
    if (node.parentNode === null && node.nodeType === 11) {
        const controller = findElementControllerFor(node);
        if (controller === void 0) {
            return null;
        }
        if (controller.mountTarget === 2) {
            return getEffectiveParentNode(controller.host);
        }
    }
    return node.parentNode;
}
function setEffectiveParentNode(childNodeOrNodeSequence, parentNode) {
    if (childNodeOrNodeSequence.platform !== void 0 && !(childNodeOrNodeSequence instanceof childNodeOrNodeSequence.platform.Node)) {
        const nodes = childNodeOrNodeSequence.childNodes;
        for (let i = 0, ii = nodes.length; i < ii; ++i) {
            effectiveParentNodeOverrides.set(nodes[i], parentNode);
        }
    }
    else {
        effectiveParentNodeOverrides.set(childNodeOrNodeSequence, parentNode);
    }
}
function convertToRenderLocation(node) {
    if (isRenderLocation(node)) {
        return node;
    }
    const locationEnd = node.ownerDocument.createComment('au-end');
    const locationStart = node.ownerDocument.createComment('au-start');
    if (node.parentNode !== null) {
        node.parentNode.replaceChild(locationEnd, node);
        locationEnd.parentNode.insertBefore(locationStart, locationEnd);
    }
    locationEnd.$start = locationStart;
    return locationEnd;
}
function isRenderLocation(node) {
    return node.textContent === 'au-end';
}
class FragmentNodeSequence {
    constructor(platform, fragment) {
        this.platform = platform;
        this.fragment = fragment;
        this.isMounted = false;
        this.isLinked = false;
        this.next = void 0;
        this.refNode = void 0;
        const targetNodeList = fragment.querySelectorAll('.au');
        let i = 0;
        let ii = targetNodeList.length;
        let target;
        let targets = this.targets = Array(ii);
        while (ii > i) {
            target = targetNodeList[i];
            if (target.nodeName === 'AU-M') {
                targets[i] = convertToRenderLocation(target);
            }
            else {
                targets[i] = target;
            }
            ++i;
        }
        const childNodeList = fragment.childNodes;
        const childNodes = this.childNodes = Array(ii = childNodeList.length);
        i = 0;
        while (ii > i) {
            childNodes[i] = childNodeList[i];
            ++i;
        }
        this.firstChild = fragment.firstChild;
        this.lastChild = fragment.lastChild;
    }
    findTargets() {
        return this.targets;
    }
    insertBefore(refNode) {
        if (this.isLinked && !!this.refNode) {
            this.addToLinked();
        }
        else {
            const parent = refNode.parentNode;
            if (this.isMounted) {
                let current = this.firstChild;
                let next;
                const end = this.lastChild;
                while (current != null) {
                    next = current.nextSibling;
                    parent.insertBefore(current, refNode);
                    if (current === end) {
                        break;
                    }
                    current = next;
                }
            }
            else {
                this.isMounted = true;
                refNode.parentNode.insertBefore(this.fragment, refNode);
            }
        }
    }
    appendTo(parent, enhance = false) {
        if (this.isMounted) {
            let current = this.firstChild;
            let next;
            const end = this.lastChild;
            while (current != null) {
                next = current.nextSibling;
                parent.appendChild(current);
                if (current === end) {
                    break;
                }
                current = next;
            }
        }
        else {
            this.isMounted = true;
            if (!enhance) {
                parent.appendChild(this.fragment);
            }
        }
    }
    remove() {
        if (this.isMounted) {
            this.isMounted = false;
            const fragment = this.fragment;
            const end = this.lastChild;
            let next;
            let current = this.firstChild;
            while (current !== null) {
                next = current.nextSibling;
                fragment.appendChild(current);
                if (current === end) {
                    break;
                }
                current = next;
            }
        }
    }
    addToLinked() {
        const refNode = this.refNode;
        const parent = refNode.parentNode;
        if (this.isMounted) {
            let current = this.firstChild;
            let next;
            const end = this.lastChild;
            while (current != null) {
                next = current.nextSibling;
                parent.insertBefore(current, refNode);
                if (current === end) {
                    break;
                }
                current = next;
            }
        }
        else {
            this.isMounted = true;
            parent.insertBefore(this.fragment, refNode);
        }
    }
    unlink() {
        this.isLinked = false;
        this.next = void 0;
        this.refNode = void 0;
    }
    link(next) {
        this.isLinked = true;
        if (isRenderLocation(next)) {
            this.refNode = next;
        }
        else {
            this.next = next;
            this.obtainRefNode();
        }
    }
    obtainRefNode() {
        if (this.next !== void 0) {
            this.refNode = this.next.firstChild;
        }
        else {
            this.refNode = void 0;
        }
    }
}
const IWindow = DI.createInterface('IWindow', x => x.callback(handler => handler.get(IPlatform).window));
const ILocation = DI.createInterface('ILocation', x => x.callback(handler => handler.get(IWindow).location));
const IHistory = DI.createInterface('IHistory', x => x.callback(handler => handler.get(IWindow).history));

const addListenerOptions = {
    [DelegationStrategy.capturing]: { capture: true },
    [DelegationStrategy.bubbling]: { capture: false },
};
class ListenerOptions {
    constructor(prevent, strategy, expAsHandler) {
        this.prevent = prevent;
        this.strategy = strategy;
        this.expAsHandler = expAsHandler;
    }
}
class Listener {
    constructor(platform, targetEvent, sourceExpression, target, eventDelegator, locator, options) {
        this.platform = platform;
        this.targetEvent = targetEvent;
        this.sourceExpression = sourceExpression;
        this.target = target;
        this.eventDelegator = eventDelegator;
        this.locator = locator;
        this.interceptor = this;
        this.isBound = false;
        this.handler = null;
        this._options = options;
    }
    callSource(event) {
        const overrideContext = this.$scope.overrideContext;
        overrideContext.$event = event;
        let result = this.sourceExpression.evaluate(8, this.$scope, this.locator, null);
        delete overrideContext.$event;
        if (this._options.expAsHandler) {
            if (!isFunction(result)) {
                throw new Error(`Handler of "${this.targetEvent}" event is not a function.`);
            }
            result = result(event);
        }
        if (result !== true && this._options.prevent) {
            event.preventDefault();
        }
        return result;
    }
    handleEvent(event) {
        this.interceptor.callSource(event);
    }
    $bind(flags, scope) {
        if (this.isBound) {
            if (this.$scope === scope) {
                return;
            }
            this.interceptor.$unbind(flags | 2);
        }
        this.$scope = scope;
        const sourceExpression = this.sourceExpression;
        if (sourceExpression.hasBind) {
            sourceExpression.bind(flags, scope, this.interceptor);
        }
        if (this._options.strategy === DelegationStrategy.none) {
            this.target.addEventListener(this.targetEvent, this);
        }
        else {
            this.handler = this.eventDelegator.addEventListener(this.locator.get(IEventTarget), this.target, this.targetEvent, this, addListenerOptions[this._options.strategy]);
        }
        this.isBound = true;
    }
    $unbind(flags) {
        if (!this.isBound) {
            return;
        }
        const sourceExpression = this.sourceExpression;
        if (sourceExpression.hasUnbind) {
            sourceExpression.unbind(flags, this.$scope, this.interceptor);
        }
        this.$scope = null;
        if (this._options.strategy === DelegationStrategy.none) {
            this.target.removeEventListener(this.targetEvent, this);
        }
        else {
            this.handler.dispose();
            this.handler = null;
        }
        this.isBound = false;
    }
    observe(obj, propertyName) {
        return;
    }
    handleChange(newValue, previousValue, flags) {
        return;
    }
}

const defaultOptions = {
    capture: false,
};
class ListenerTracker {
    constructor(_publisher, _eventName, _options = defaultOptions) {
        this._publisher = _publisher;
        this._eventName = _eventName;
        this._options = _options;
        this._count = 0;
        this._captureLookups = new Map();
        this._bubbleLookups = new Map();
    }
    _increment() {
        if (++this._count === 1) {
            this._publisher.addEventListener(this._eventName, this, this._options);
        }
    }
    _decrement() {
        if (--this._count === 0) {
            this._publisher.removeEventListener(this._eventName, this, this._options);
        }
    }
    dispose() {
        if (this._count > 0) {
            this._count = 0;
            this._publisher.removeEventListener(this._eventName, this, this._options);
        }
        this._captureLookups.clear();
        this._bubbleLookups.clear();
    }
    _getLookup(target) {
        const lookups = this._options.capture === true ? this._captureLookups : this._bubbleLookups;
        let lookup = lookups.get(target);
        if (lookup === void 0) {
            lookups.set(target, lookup = createLookup());
        }
        return lookup;
    }
    handleEvent(event) {
        const lookups = this._options.capture === true ? this._captureLookups : this._bubbleLookups;
        const path = event.composedPath();
        if (this._options.capture === true) {
            path.reverse();
        }
        for (const target of path) {
            const lookup = lookups.get(target);
            if (lookup === void 0) {
                continue;
            }
            const listener = lookup[this._eventName];
            if (listener === void 0) {
                continue;
            }
            if (isFunction(listener)) {
                listener(event);
            }
            else {
                listener.handleEvent(event);
            }
            if (event.cancelBubble === true) {
                return;
            }
        }
    }
}
class DelegateSubscription {
    constructor(_tracker, _lookup, _eventName, callback) {
        this._tracker = _tracker;
        this._lookup = _lookup;
        this._eventName = _eventName;
        _tracker._increment();
        _lookup[_eventName] = callback;
    }
    dispose() {
        this._tracker._decrement();
        this._lookup[this._eventName] = void 0;
    }
}
class EventSubscriber {
    constructor(config) {
        this.config = config;
        this.target = null;
        this.handler = null;
    }
    subscribe(node, callbackOrListener) {
        this.target = node;
        this.handler = callbackOrListener;
        let event;
        for (event of this.config.events) {
            node.addEventListener(event, callbackOrListener);
        }
    }
    dispose() {
        const { target, handler } = this;
        let event;
        if (target !== null && handler !== null) {
            for (event of this.config.events) {
                target.removeEventListener(event, handler);
            }
        }
        this.target = this.handler = null;
    }
}
const IEventDelegator = DI.createInterface('IEventDelegator', x => x.singleton(EventDelegator));
class EventDelegator {
    constructor() {
        this._trackerMaps = createLookup();
    }
    addEventListener(publisher, target, eventName, listener, options) {
        var _a;
        var _b;
        const trackerMap = (_a = (_b = this._trackerMaps)[eventName]) !== null && _a !== void 0 ? _a : (_b[eventName] = new Map());
        let tracker = trackerMap.get(publisher);
        if (tracker === void 0) {
            trackerMap.set(publisher, tracker = new ListenerTracker(publisher, eventName, options));
        }
        return new DelegateSubscription(tracker, tracker._getLookup(target), eventName, listener);
    }
    dispose() {
        for (const eventName in this._trackerMaps) {
            const trackerMap = this._trackerMaps[eventName];
            for (const tracker of trackerMap.values()) {
                tracker.dispose();
            }
            trackerMap.clear();
        }
    }
}

const IProjections = DI.createInterface("IProjections");
const IAuSlotsInfo = DI.createInterface('IAuSlotsInfo');
class AuSlotsInfo {
    constructor(projectedSlots) {
        this.projectedSlots = projectedSlots;
    }
}

var InstructionType;
(function (InstructionType) {
    InstructionType["hydrateElement"] = "ra";
    InstructionType["hydrateAttribute"] = "rb";
    InstructionType["hydrateTemplateController"] = "rc";
    InstructionType["hydrateLetElement"] = "rd";
    InstructionType["setProperty"] = "re";
    InstructionType["interpolation"] = "rf";
    InstructionType["propertyBinding"] = "rg";
    InstructionType["callBinding"] = "rh";
    InstructionType["letBinding"] = "ri";
    InstructionType["refBinding"] = "rj";
    InstructionType["iteratorBinding"] = "rk";
    InstructionType["textBinding"] = "ha";
    InstructionType["listenerBinding"] = "hb";
    InstructionType["attributeBinding"] = "hc";
    InstructionType["stylePropertyBinding"] = "hd";
    InstructionType["setAttribute"] = "he";
    InstructionType["setClassAttribute"] = "hf";
    InstructionType["setStyleAttribute"] = "hg";
    InstructionType["spreadBinding"] = "hs";
    InstructionType["spreadElementProp"] = "hp";
})(InstructionType || (InstructionType = {}));
const IInstruction = DI.createInterface('Instruction');
function isInstruction(value) {
    const type = value.type;
    return isString(type) && type.length === 2;
}
class InterpolationInstruction {
    constructor(from, to) {
        this.from = from;
        this.to = to;
    }
    get type() { return "rf"; }
}
class PropertyBindingInstruction {
    constructor(from, to, mode) {
        this.from = from;
        this.to = to;
        this.mode = mode;
    }
    get type() { return "rg"; }
}
class IteratorBindingInstruction {
    constructor(from, to) {
        this.from = from;
        this.to = to;
    }
    get type() { return "rk"; }
}
class CallBindingInstruction {
    constructor(from, to) {
        this.from = from;
        this.to = to;
    }
    get type() { return "rh"; }
}
class RefBindingInstruction {
    constructor(from, to) {
        this.from = from;
        this.to = to;
    }
    get type() { return "rj"; }
}
class SetPropertyInstruction {
    constructor(value, to) {
        this.value = value;
        this.to = to;
    }
    get type() { return "re"; }
}
class HydrateElementInstruction {
    constructor(res, alias, props, projections, containerless, captures) {
        this.res = res;
        this.alias = alias;
        this.props = props;
        this.projections = projections;
        this.containerless = containerless;
        this.captures = captures;
        this.auSlot = null;
    }
    get type() { return "ra"; }
}
class HydrateAttributeInstruction {
    constructor(res, alias, props) {
        this.res = res;
        this.alias = alias;
        this.props = props;
    }
    get type() { return "rb"; }
}
class HydrateTemplateController {
    constructor(def, res, alias, props) {
        this.def = def;
        this.res = res;
        this.alias = alias;
        this.props = props;
    }
    get type() { return "rc"; }
}
class HydrateLetElementInstruction {
    constructor(instructions, toBindingContext) {
        this.instructions = instructions;
        this.toBindingContext = toBindingContext;
    }
    get type() { return "rd"; }
}
class LetBindingInstruction {
    constructor(from, to) {
        this.from = from;
        this.to = to;
    }
    get type() { return "ri"; }
}
class TextBindingInstruction {
    constructor(from, strict) {
        this.from = from;
        this.strict = strict;
    }
    get type() { return "ha"; }
}
class ListenerBindingInstruction {
    constructor(from, to, preventDefault, strategy) {
        this.from = from;
        this.to = to;
        this.preventDefault = preventDefault;
        this.strategy = strategy;
    }
    get type() { return "hb"; }
}
class StylePropertyBindingInstruction {
    constructor(from, to) {
        this.from = from;
        this.to = to;
    }
    get type() { return "hd"; }
}
class SetAttributeInstruction {
    constructor(value, to) {
        this.value = value;
        this.to = to;
    }
    get type() { return "he"; }
}
class SetClassAttributeInstruction {
    constructor(value) {
        this.value = value;
        this.type = "hf";
    }
}
class SetStyleAttributeInstruction {
    constructor(value) {
        this.value = value;
        this.type = "hg";
    }
}
class AttributeBindingInstruction {
    constructor(attr, from, to) {
        this.attr = attr;
        this.from = from;
        this.to = to;
    }
    get type() { return "hc"; }
}
class SpreadBindingInstruction {
    get type() { return "hs"; }
}
class SpreadElementPropBindingInstruction {
    constructor(instructions) {
        this.instructions = instructions;
    }
    get type() { return "hp"; }
}
const ITemplateCompiler = DI.createInterface('ITemplateCompiler');
const IRenderer = DI.createInterface('IRenderer');
function renderer(targetType) {
    return function decorator(target) {
        target.register = function (container) {
            singletonRegistration(IRenderer, this).register(container);
        };
        defineProp(target.prototype, 'target', {
            configurable: true,
            get: function () { return targetType; }
        });
        return target;
    };
}
function ensureExpression(parser, srcOrExpr, expressionType) {
    if (isString(srcOrExpr)) {
        return parser.parse(srcOrExpr, expressionType);
    }
    return srcOrExpr;
}
function getTarget(potentialTarget) {
    if (potentialTarget.viewModel != null) {
        return potentialTarget.viewModel;
    }
    return potentialTarget;
}
function getRefTarget(refHost, refTargetName) {
    if (refTargetName === 'element') {
        return refHost;
    }
    switch (refTargetName) {
        case 'controller':
            return findElementControllerFor(refHost);
        case 'view':
            throw new Error(`AUR0750: Not supported API`);
        case 'view-model':
            return findElementControllerFor(refHost).viewModel;
        default: {
            const caController = findAttributeControllerFor(refHost, refTargetName);
            if (caController !== void 0) {
                return caController.viewModel;
            }
            const ceController = findElementControllerFor(refHost, { name: refTargetName });
            if (ceController === void 0) {
                throw new Error(`AUR0751: Attempted to reference "${refTargetName}", but it was not found amongst the target's API.`);
            }
            return ceController.viewModel;
        }
    }
}
let SetPropertyRenderer = class SetPropertyRenderer {
    render(renderingCtrl, target, instruction) {
        const obj = getTarget(target);
        if (obj.$observers !== void 0 && obj.$observers[instruction.to] !== void 0) {
            obj.$observers[instruction.to].setValue(instruction.value, 2);
        }
        else {
            obj[instruction.to] = instruction.value;
        }
    }
};
SetPropertyRenderer = __decorate([
    renderer("re")
], SetPropertyRenderer);
let CustomElementRenderer = class CustomElementRenderer {
    constructor(rendering, platform) {
        this._rendering = rendering;
        this._platform = platform;
    }
    static get inject() { return [IRendering, IPlatform]; }
    render(renderingCtrl, target, instruction) {
        let def;
        let Ctor;
        let component;
        let childCtrl;
        const res = instruction.res;
        const projections = instruction.projections;
        const ctxContainer = renderingCtrl.container;
        switch (typeof res) {
            case 'string':
                def = ctxContainer.find(CustomElement, res);
                if (def == null) {
                    throw new Error(`AUR0752: Element ${res} is not registered in ${renderingCtrl['name']}.`);
                }
                break;
            default:
                def = res;
        }
        const containerless = instruction.containerless || def.containerless;
        const location = containerless ? convertToRenderLocation(target) : null;
        const container = createElementContainer(this._platform, renderingCtrl, target, instruction, location, projections == null ? void 0 : new AuSlotsInfo(Object.keys(projections)));
        Ctor = def.Type;
        component = container.invoke(Ctor);
        container.registerResolver(Ctor, new InstanceProvider(def.key, component));
        childCtrl = Controller.$el(container, component, target, instruction, def, location);
        setRef(target, def.key, childCtrl);
        const renderers = this._rendering.renderers;
        const props = instruction.props;
        const ii = props.length;
        let i = 0;
        let propInst;
        while (ii > i) {
            propInst = props[i];
            renderers[propInst.type].render(renderingCtrl, childCtrl, propInst);
            ++i;
        }
        renderingCtrl.addChild(childCtrl);
    }
};
CustomElementRenderer = __decorate([
    renderer("ra")
], CustomElementRenderer);
let CustomAttributeRenderer = class CustomAttributeRenderer {
    constructor(rendering, platform) {
        this._rendering = rendering;
        this._platform = platform;
    }
    static get inject() { return [IRendering, IPlatform]; }
    render(renderingCtrl, target, instruction) {
        let ctxContainer = renderingCtrl.container;
        let def;
        switch (typeof instruction.res) {
            case 'string':
                def = ctxContainer.find(CustomAttribute, instruction.res);
                if (def == null) {
                    throw new Error(`AUR0753: Attribute ${instruction.res} is not registered in ${renderingCtrl['name']}.`);
                }
                break;
            default:
                def = instruction.res;
        }
        const results = invokeAttribute(this._platform, def, renderingCtrl, target, instruction, void 0, void 0);
        const childController = Controller.$attr(results.ctn, results.vm, target, def);
        setRef(target, def.key, childController);
        const renderers = this._rendering.renderers;
        const props = instruction.props;
        const ii = props.length;
        let i = 0;
        let propInst;
        while (ii > i) {
            propInst = props[i];
            renderers[propInst.type].render(renderingCtrl, childController, propInst);
            ++i;
        }
        renderingCtrl.addChild(childController);
    }
};
CustomAttributeRenderer = __decorate([
    renderer("rb")
], CustomAttributeRenderer);
let TemplateControllerRenderer = class TemplateControllerRenderer {
    constructor(rendering, platform) {
        this._rendering = rendering;
        this._platform = platform;
    }
    static get inject() { return [IRendering, IPlatform]; }
    render(renderingCtrl, target, instruction) {
        var _a, _b;
        let ctxContainer = renderingCtrl.container;
        let def;
        switch (typeof instruction.res) {
            case 'string':
                def = ctxContainer.find(CustomAttribute, instruction.res);
                if (def == null) {
                    throw new Error(`AUR0754: Attribute ${instruction.res} is not registered in ${renderingCtrl['name']}.`);
                }
                break;
            default:
                def = instruction.res;
        }
        const viewFactory = this._rendering.getViewFactory(instruction.def, ctxContainer);
        const renderLocation = convertToRenderLocation(target);
        const results = invokeAttribute(this._platform, def, renderingCtrl, target, instruction, viewFactory, renderLocation);
        const childController = Controller.$attr(results.ctn, results.vm, target, def);
        setRef(renderLocation, def.key, childController);
        (_b = (_a = results.vm).link) === null || _b === void 0 ? void 0 : _b.call(_a, renderingCtrl, childController, target, instruction);
        const renderers = this._rendering.renderers;
        const props = instruction.props;
        const ii = props.length;
        let i = 0;
        let propInst;
        while (ii > i) {
            propInst = props[i];
            renderers[propInst.type].render(renderingCtrl, childController, propInst);
            ++i;
        }
        renderingCtrl.addChild(childController);
    }
};
TemplateControllerRenderer = __decorate([
    renderer("rc")
], TemplateControllerRenderer);
let LetElementRenderer = class LetElementRenderer {
    constructor(exprParser, observerLocator) {
        this._exprParser = exprParser;
        this._observerLocator = observerLocator;
    }
    render(renderingCtrl, target, instruction) {
        target.remove();
        const childInstructions = instruction.instructions;
        const toBindingContext = instruction.toBindingContext;
        const container = renderingCtrl.container;
        const ii = childInstructions.length;
        let childInstruction;
        let expr;
        let binding;
        let i = 0;
        while (ii > i) {
            childInstruction = childInstructions[i];
            expr = ensureExpression(this._exprParser, childInstruction.from, 8);
            binding = new LetBinding(expr, childInstruction.to, this._observerLocator, container, toBindingContext);
            renderingCtrl.addBinding(expr.$kind === 38963
                ? applyBindingBehavior(binding, expr, container)
                : binding);
            ++i;
        }
    }
};
LetElementRenderer.inject = [IExpressionParser, IObserverLocator];
LetElementRenderer = __decorate([
    renderer("rd")
], LetElementRenderer);
let CallBindingRenderer = class CallBindingRenderer {
    constructor(exprParser, observerLocator) {
        this._exprParser = exprParser;
        this._observerLocator = observerLocator;
    }
    render(renderingCtrl, target, instruction) {
        const expr = ensureExpression(this._exprParser, instruction.from, 8 | 4);
        const binding = new CallBinding(expr, getTarget(target), instruction.to, this._observerLocator, renderingCtrl.container);
        renderingCtrl.addBinding(expr.$kind === 38963
            ? applyBindingBehavior(binding, expr, renderingCtrl.container)
            : binding);
    }
};
CallBindingRenderer.inject = [IExpressionParser, IObserverLocator];
CallBindingRenderer = __decorate([
    renderer("rh")
], CallBindingRenderer);
let RefBindingRenderer = class RefBindingRenderer {
    constructor(exprParser) {
        this._exprParser = exprParser;
    }
    render(renderingCtrl, target, instruction) {
        const expr = ensureExpression(this._exprParser, instruction.from, 8);
        const binding = new RefBinding(expr, getRefTarget(target, instruction.to), renderingCtrl.container);
        renderingCtrl.addBinding(expr.$kind === 38963
            ? applyBindingBehavior(binding, expr, renderingCtrl.container)
            : binding);
    }
};
RefBindingRenderer.inject = [IExpressionParser];
RefBindingRenderer = __decorate([
    renderer("rj")
], RefBindingRenderer);
let InterpolationBindingRenderer = class InterpolationBindingRenderer {
    constructor(exprParser, observerLocator, p) {
        this._exprParser = exprParser;
        this._observerLocator = observerLocator;
        this._platform = p;
    }
    render(renderingCtrl, target, instruction) {
        const container = renderingCtrl.container;
        const expr = ensureExpression(this._exprParser, instruction.from, 1);
        const binding = new InterpolationBinding(this._observerLocator, expr, getTarget(target), instruction.to, BindingMode.toView, container, this._platform.domWriteQueue);
        const partBindings = binding.partBindings;
        const ii = partBindings.length;
        let i = 0;
        let partBinding;
        for (; ii > i; ++i) {
            partBinding = partBindings[i];
            if (partBinding.sourceExpression.$kind === 38963) {
                partBindings[i] = applyBindingBehavior(partBinding, partBinding.sourceExpression, container);
            }
        }
        renderingCtrl.addBinding(binding);
    }
};
InterpolationBindingRenderer.inject = [IExpressionParser, IObserverLocator, IPlatform];
InterpolationBindingRenderer = __decorate([
    renderer("rf")
], InterpolationBindingRenderer);
let PropertyBindingRenderer = class PropertyBindingRenderer {
    constructor(exprParser, observerLocator, p) {
        this._exprParser = exprParser;
        this._observerLocator = observerLocator;
        this._platform = p;
    }
    render(renderingCtrl, target, instruction) {
        const expr = ensureExpression(this._exprParser, instruction.from, 8);
        const binding = new PropertyBinding(expr, getTarget(target), instruction.to, instruction.mode, this._observerLocator, renderingCtrl.container, this._platform.domWriteQueue);
        renderingCtrl.addBinding(expr.$kind === 38963
            ? applyBindingBehavior(binding, expr, renderingCtrl.container)
            : binding);
    }
};
PropertyBindingRenderer.inject = [IExpressionParser, IObserverLocator, IPlatform];
PropertyBindingRenderer = __decorate([
    renderer("rg")
], PropertyBindingRenderer);
let IteratorBindingRenderer = class IteratorBindingRenderer {
    constructor(exprParser, observerLocator, p) {
        this._exprParser = exprParser;
        this._observerLocator = observerLocator;
        this._platform = p;
    }
    render(renderingCtrl, target, instruction) {
        const expr = ensureExpression(this._exprParser, instruction.from, 2);
        const binding = new PropertyBinding(expr, getTarget(target), instruction.to, BindingMode.toView, this._observerLocator, renderingCtrl.container, this._platform.domWriteQueue);
        renderingCtrl.addBinding(expr.iterable.$kind === 38963
            ? applyBindingBehavior(binding, expr.iterable, renderingCtrl.container)
            : binding);
    }
};
IteratorBindingRenderer.inject = [IExpressionParser, IObserverLocator, IPlatform];
IteratorBindingRenderer = __decorate([
    renderer("rk")
], IteratorBindingRenderer);
let behaviorExpressionIndex = 0;
const behaviorExpressions = [];
function applyBindingBehavior(binding, expression, locator) {
    while (expression instanceof BindingBehaviorExpression) {
        behaviorExpressions[behaviorExpressionIndex++] = expression;
        expression = expression.expression;
    }
    while (behaviorExpressionIndex > 0) {
        const behaviorExpression = behaviorExpressions[--behaviorExpressionIndex];
        const behaviorOrFactory = locator.get(behaviorExpression.behaviorKey);
        if (behaviorOrFactory instanceof BindingBehaviorFactory) {
            binding = behaviorOrFactory.construct(binding, behaviorExpression);
        }
    }
    behaviorExpressions.length = 0;
    return binding;
}
let TextBindingRenderer = class TextBindingRenderer {
    constructor(exprParser, observerLocator, p) {
        this._exprParser = exprParser;
        this._observerLocator = observerLocator;
        this._platform = p;
    }
    render(renderingCtrl, target, instruction) {
        const container = renderingCtrl.container;
        const next = target.nextSibling;
        const parent = target.parentNode;
        const doc = this._platform.document;
        const expr = ensureExpression(this._exprParser, instruction.from, 1);
        const staticParts = expr.parts;
        const dynamicParts = expr.expressions;
        const ii = dynamicParts.length;
        let i = 0;
        let text = staticParts[0];
        let binding;
        let part;
        if (text !== '') {
            parent.insertBefore(doc.createTextNode(text), next);
        }
        for (; ii > i; ++i) {
            part = dynamicParts[i];
            binding = new ContentBinding(part, parent.insertBefore(doc.createTextNode(''), next), container, this._observerLocator, this._platform, instruction.strict);
            renderingCtrl.addBinding(part.$kind === 38963
                ? applyBindingBehavior(binding, part, container)
                : binding);
            text = staticParts[i + 1];
            if (text !== '') {
                parent.insertBefore(doc.createTextNode(text), next);
            }
        }
        if (target.nodeName === 'AU-M') {
            target.remove();
        }
    }
};
TextBindingRenderer.inject = [IExpressionParser, IObserverLocator, IPlatform];
TextBindingRenderer = __decorate([
    renderer("ha")
], TextBindingRenderer);
const IListenerBehaviorOptions = DI.createInterface('IListenerBehaviorOptions', x => x.singleton(ListenerBehaviorOptions));
class ListenerBehaviorOptions {
    constructor() {
        this.expAsHandler = false;
    }
}
let ListenerBindingRenderer = class ListenerBindingRenderer {
    constructor(parser, eventDelegator, p, listenerBehaviorOptions) {
        this._exprParser = parser;
        this._eventDelegator = eventDelegator;
        this._platform = p;
        this._listenerBehaviorOptions = listenerBehaviorOptions;
    }
    render(renderingCtrl, target, instruction) {
        const expr = ensureExpression(this._exprParser, instruction.from, 4);
        const binding = new Listener(this._platform, instruction.to, expr, target, this._eventDelegator, renderingCtrl.container, new ListenerOptions(instruction.preventDefault, instruction.strategy, this._listenerBehaviorOptions.expAsHandler));
        renderingCtrl.addBinding(expr.$kind === 38963
            ? applyBindingBehavior(binding, expr, renderingCtrl.container)
            : binding);
    }
};
ListenerBindingRenderer.inject = [IExpressionParser, IEventDelegator, IPlatform, IListenerBehaviorOptions];
ListenerBindingRenderer = __decorate([
    renderer("hb")
], ListenerBindingRenderer);
let SetAttributeRenderer = class SetAttributeRenderer {
    render(_, target, instruction) {
        target.setAttribute(instruction.to, instruction.value);
    }
};
SetAttributeRenderer = __decorate([
    renderer("he")
], SetAttributeRenderer);
let SetClassAttributeRenderer = class SetClassAttributeRenderer {
    render(_, target, instruction) {
        addClasses(target.classList, instruction.value);
    }
};
SetClassAttributeRenderer = __decorate([
    renderer("hf")
], SetClassAttributeRenderer);
let SetStyleAttributeRenderer = class SetStyleAttributeRenderer {
    render(_, target, instruction) {
        target.style.cssText += instruction.value;
    }
};
SetStyleAttributeRenderer = __decorate([
    renderer("hg")
], SetStyleAttributeRenderer);
let StylePropertyBindingRenderer = class StylePropertyBindingRenderer {
    constructor(_exprParser, _observerLocator, _platform) {
        this._exprParser = _exprParser;
        this._observerLocator = _observerLocator;
        this._platform = _platform;
    }
    render(renderingCtrl, target, instruction) {
        const expr = ensureExpression(this._exprParser, instruction.from, 8);
        const binding = new PropertyBinding(expr, target.style, instruction.to, BindingMode.toView, this._observerLocator, renderingCtrl.container, this._platform.domWriteQueue);
        renderingCtrl.addBinding(expr.$kind === 38963
            ? applyBindingBehavior(binding, expr, renderingCtrl.container)
            : binding);
    }
};
StylePropertyBindingRenderer.inject = [IExpressionParser, IObserverLocator, IPlatform];
StylePropertyBindingRenderer = __decorate([
    renderer("hd")
], StylePropertyBindingRenderer);
let AttributeBindingRenderer = class AttributeBindingRenderer {
    constructor(_exprParser, _observerLocator) {
        this._exprParser = _exprParser;
        this._observerLocator = _observerLocator;
    }
    render(renderingCtrl, target, instruction) {
        const expr = ensureExpression(this._exprParser, instruction.from, 8);
        const binding = new AttributeBinding(expr, target, instruction.attr, instruction.to, BindingMode.toView, this._observerLocator, renderingCtrl.container);
        renderingCtrl.addBinding(expr.$kind === 38963
            ? applyBindingBehavior(binding, expr, renderingCtrl.container)
            : binding);
    }
};
AttributeBindingRenderer.inject = [IExpressionParser, IObserverLocator];
AttributeBindingRenderer = __decorate([
    renderer("hc")
], AttributeBindingRenderer);
let SpreadRenderer = class SpreadRenderer {
    constructor(_compiler, _rendering) {
        this._compiler = _compiler;
        this._rendering = _rendering;
    }
    static get inject() { return [ITemplateCompiler, IRendering]; }
    render(renderingCtrl, target, _instruction) {
        const container = renderingCtrl.container;
        const hydrationContext = container.get(IHydrationContext);
        const renderers = this._rendering.renderers;
        const getHydrationContext = (ancestor) => {
            let currentLevel = ancestor;
            let currentContext = hydrationContext;
            while (currentContext != null && currentLevel > 0) {
                currentContext = currentContext.parent;
                --currentLevel;
            }
            if (currentContext == null) {
                throw new Error('No scope context for spread binding.');
            }
            return currentContext;
        };
        const renderSpreadInstruction = (ancestor) => {
            var _a, _b;
            const context = getHydrationContext(ancestor);
            const spreadBinding = createSurrogateBinding(context);
            const instructions = this._compiler.compileSpread(context.controller.definition, (_b = (_a = context.instruction) === null || _a === void 0 ? void 0 : _a.captures) !== null && _b !== void 0 ? _b : emptyArray, context.controller.container, target);
            let inst;
            for (inst of instructions) {
                switch (inst.type) {
                    case "hs":
                        renderSpreadInstruction(ancestor + 1);
                        break;
                    case "hp":
                        renderers[inst.instructions.type].render(spreadBinding, findElementControllerFor(target), inst.instructions);
                        break;
                    default:
                        renderers[inst.type].render(spreadBinding, target, inst);
                }
            }
            renderingCtrl.addBinding(spreadBinding);
        };
        renderSpreadInstruction(0);
    }
};
SpreadRenderer = __decorate([
    renderer("hs")
], SpreadRenderer);
class SpreadBinding {
    constructor(_innerBindings, _hydrationContext) {
        this._innerBindings = _innerBindings;
        this._hydrationContext = _hydrationContext;
        this.interceptor = this;
        this.isBound = false;
        this.ctrl = _hydrationContext.controller;
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
    $bind(flags, _scope) {
        var _a;
        if (this.isBound) {
            return;
        }
        this.isBound = true;
        const innerScope = this.$scope = (_a = this._hydrationContext.controller.scope.parentScope) !== null && _a !== void 0 ? _a : void 0;
        if (innerScope == null) {
            throw new Error('Invalid spreading. Context scope is null/undefined');
        }
        this._innerBindings.forEach(b => b.$bind(flags, innerScope));
    }
    $unbind(flags) {
        this._innerBindings.forEach(b => b.$unbind(flags));
        this.isBound = false;
    }
    addBinding(binding) {
        this._innerBindings.push(binding);
    }
    addChild(controller) {
        if (controller.vmKind !== 1) {
            throw new Error('Spread binding does not support spreading custom attributes/template controllers');
        }
        this.ctrl.addChild(controller);
    }
}
function addClasses(classList, className) {
    const len = className.length;
    let start = 0;
    for (let i = 0; i < len; ++i) {
        if (className.charCodeAt(i) === 0x20) {
            if (i !== start) {
                classList.add(className.slice(start, i));
            }
            start = i + 1;
        }
        else if (i + 1 === len) {
            classList.add(className.slice(start));
        }
    }
}
const createSurrogateBinding = (context) => new SpreadBinding([], context);
const controllerProviderName = 'IController';
const instructionProviderName = 'IInstruction';
const locationProviderName = 'IRenderLocation';
const slotInfoProviderName = 'IAuSlotsInfo';
function createElementContainer(p, renderingCtrl, host, instruction, location, auSlotsInfo) {
    const ctn = renderingCtrl.container.createChild();
    ctn.registerResolver(p.HTMLElement, ctn.registerResolver(p.Element, ctn.registerResolver(INode, new InstanceProvider('ElementResolver', host))));
    ctn.registerResolver(IController, new InstanceProvider(controllerProviderName, renderingCtrl));
    ctn.registerResolver(IInstruction, new InstanceProvider(instructionProviderName, instruction));
    ctn.registerResolver(IRenderLocation, location == null
        ? noLocationProvider
        : new RenderLocationProvider(location));
    ctn.registerResolver(IViewFactory, noViewFactoryProvider);
    ctn.registerResolver(IAuSlotsInfo, auSlotsInfo == null
        ? noAuSlotProvider
        : new InstanceProvider(slotInfoProviderName, auSlotsInfo));
    return ctn;
}
class ViewFactoryProvider {
    constructor(factory) {
        this.f = factory;
    }
    get $isResolver() { return true; }
    resolve() {
        const f = this.f;
        if (f === null) {
            throw new Error(`AUR7055: Cannot resolve ViewFactory before the provider was prepared.`);
        }
        if (!isString(f.name) || f.name.length === 0) {
            throw new Error(`AUR0756: Cannot resolve ViewFactory without a (valid) name.`);
        }
        return f;
    }
}
function invokeAttribute(p, definition, renderingCtrl, host, instruction, viewFactory, location, auSlotsInfo) {
    const ctn = renderingCtrl.container.createChild();
    ctn.registerResolver(p.HTMLElement, ctn.registerResolver(p.Element, ctn.registerResolver(INode, new InstanceProvider('ElementResolver', host))));
    renderingCtrl = renderingCtrl instanceof Controller
        ? renderingCtrl
        : renderingCtrl.ctrl;
    ctn.registerResolver(IController, new InstanceProvider(controllerProviderName, renderingCtrl));
    ctn.registerResolver(IInstruction, new InstanceProvider(instructionProviderName, instruction));
    ctn.registerResolver(IRenderLocation, location == null
        ? noLocationProvider
        : new InstanceProvider(locationProviderName, location));
    ctn.registerResolver(IViewFactory, viewFactory == null
        ? noViewFactoryProvider
        : new ViewFactoryProvider(viewFactory));
    ctn.registerResolver(IAuSlotsInfo, auSlotsInfo == null
        ? noAuSlotProvider
        : new InstanceProvider(slotInfoProviderName, auSlotsInfo));
    return { vm: ctn.invoke(definition.Type), ctn };
}
class RenderLocationProvider {
    constructor(_location) {
        this._location = _location;
    }
    get name() { return 'IRenderLocation'; }
    get $isResolver() { return true; }
    resolve() {
        return this._location;
    }
}
const noLocationProvider = new RenderLocationProvider(null);
const noViewFactoryProvider = new ViewFactoryProvider(null);
const noAuSlotProvider = new InstanceProvider(slotInfoProviderName, new AuSlotsInfo(emptyArray));

var CommandType;
(function (CommandType) {
    CommandType[CommandType["None"] = 0] = "None";
    CommandType[CommandType["IgnoreAttr"] = 1] = "IgnoreAttr";
})(CommandType || (CommandType = {}));
function bindingCommand(nameOrDefinition) {
    return function (target) {
        return BindingCommand.define(nameOrDefinition, target);
    };
}
class BindingCommandDefinition {
    constructor(Type, name, aliases, key, type) {
        this.Type = Type;
        this.name = name;
        this.aliases = aliases;
        this.key = key;
        this.type = type;
    }
    static create(nameOrDef, Type) {
        let name;
        let def;
        if (isString(nameOrDef)) {
            name = nameOrDef;
            def = { name };
        }
        else {
            name = nameOrDef.name;
            def = nameOrDef;
        }
        return new BindingCommandDefinition(Type, firstDefined(getCommandAnnotation(Type, 'name'), name), mergeArrays(getCommandAnnotation(Type, 'aliases'), def.aliases, Type.aliases), getCommandKeyFrom(name), firstDefined(getCommandAnnotation(Type, 'type'), def.type, Type.type, null));
    }
    register(container) {
        const { Type, key, aliases } = this;
        singletonRegistration(key, Type).register(container);
        aliasRegistration(key, Type).register(container);
        registerAliases(aliases, BindingCommand, key, container);
    }
}
const cmdBaseName = getResourceKeyFor('binding-command');
const getCommandKeyFrom = (name) => `${cmdBaseName}:${name}`;
const getCommandAnnotation = (Type, prop) => getOwnMetadata(getAnnotationKeyFor(prop), Type);
const BindingCommand = Object.freeze({
    name: cmdBaseName,
    keyFrom: getCommandKeyFrom,
    define(nameOrDef, Type) {
        const definition = BindingCommandDefinition.create(nameOrDef, Type);
        defineMetadata(cmdBaseName, definition, definition.Type);
        defineMetadata(cmdBaseName, definition, definition);
        appendResourceKey(Type, cmdBaseName);
        return definition.Type;
    },
    getAnnotation: getCommandAnnotation,
});
let OneTimeBindingCommand = class OneTimeBindingCommand {
    constructor(m, xp) {
        this.type = 0;
        this._attrMapper = m;
        this._exprParser = xp;
    }
    get name() { return 'one-time'; }
    build(info) {
        var _a;
        const attr = info.attr;
        let target = attr.target;
        let value = info.attr.rawValue;
        if (info.bindable == null) {
            target = (_a = this._attrMapper.map(info.node, target)) !== null && _a !== void 0 ? _a : camelCase(target);
        }
        else {
            if (value === '' && info.def.type === 1) {
                value = camelCase(target);
            }
            target = info.bindable.property;
        }
        return new PropertyBindingInstruction(this._exprParser.parse(value, 8), target, BindingMode.oneTime);
    }
};
OneTimeBindingCommand.inject = [IAttrMapper, IExpressionParser];
OneTimeBindingCommand = __decorate([
    bindingCommand('one-time')
], OneTimeBindingCommand);
let ToViewBindingCommand = class ToViewBindingCommand {
    constructor(attrMapper, exprParser) {
        this.type = 0;
        this._attrMapper = attrMapper;
        this._exprParser = exprParser;
    }
    get name() { return 'to-view'; }
    build(info) {
        var _a;
        const attr = info.attr;
        let target = attr.target;
        let value = info.attr.rawValue;
        if (info.bindable == null) {
            target = (_a = this._attrMapper.map(info.node, target)) !== null && _a !== void 0 ? _a : camelCase(target);
        }
        else {
            if (value === '' && info.def.type === 1) {
                value = camelCase(target);
            }
            target = info.bindable.property;
        }
        return new PropertyBindingInstruction(this._exprParser.parse(value, 8), target, BindingMode.toView);
    }
};
ToViewBindingCommand.inject = [IAttrMapper, IExpressionParser];
ToViewBindingCommand = __decorate([
    bindingCommand('to-view')
], ToViewBindingCommand);
let FromViewBindingCommand = class FromViewBindingCommand {
    constructor(m, xp) {
        this.type = 0;
        this._attrMapper = m;
        this._exprParser = xp;
    }
    get name() { return 'from-view'; }
    build(info) {
        var _a;
        const attr = info.attr;
        let target = attr.target;
        let value = attr.rawValue;
        if (info.bindable == null) {
            target = (_a = this._attrMapper.map(info.node, target)) !== null && _a !== void 0 ? _a : camelCase(target);
        }
        else {
            if (value === '' && info.def.type === 1) {
                value = camelCase(target);
            }
            target = info.bindable.property;
        }
        return new PropertyBindingInstruction(this._exprParser.parse(value, 8), target, BindingMode.fromView);
    }
};
FromViewBindingCommand.inject = [IAttrMapper, IExpressionParser];
FromViewBindingCommand = __decorate([
    bindingCommand('from-view')
], FromViewBindingCommand);
let TwoWayBindingCommand = class TwoWayBindingCommand {
    constructor(m, xp) {
        this.type = 0;
        this._attrMapper = m;
        this._exprParser = xp;
    }
    get name() { return 'two-way'; }
    build(info) {
        var _a;
        const attr = info.attr;
        let target = attr.target;
        let value = attr.rawValue;
        if (info.bindable == null) {
            target = (_a = this._attrMapper.map(info.node, target)) !== null && _a !== void 0 ? _a : camelCase(target);
        }
        else {
            if (value === '' && info.def.type === 1) {
                value = camelCase(target);
            }
            target = info.bindable.property;
        }
        return new PropertyBindingInstruction(this._exprParser.parse(value, 8), target, BindingMode.twoWay);
    }
};
TwoWayBindingCommand.inject = [IAttrMapper, IExpressionParser];
TwoWayBindingCommand = __decorate([
    bindingCommand('two-way')
], TwoWayBindingCommand);
let DefaultBindingCommand = class DefaultBindingCommand {
    constructor(m, xp) {
        this.type = 0;
        this._attrMapper = m;
        this._exprParser = xp;
    }
    get name() { return 'bind'; }
    build(info) {
        var _a;
        const attr = info.attr;
        const bindable = info.bindable;
        let defaultMode;
        let mode;
        let target = attr.target;
        let value = attr.rawValue;
        if (bindable == null) {
            mode = this._attrMapper.isTwoWay(info.node, target) ? BindingMode.twoWay : BindingMode.toView;
            target = (_a = this._attrMapper.map(info.node, target)) !== null && _a !== void 0 ? _a : camelCase(target);
        }
        else {
            if (value === '' && info.def.type === 1) {
                value = camelCase(target);
            }
            defaultMode = info.def.defaultBindingMode;
            mode = bindable.mode === BindingMode.default || bindable.mode == null
                ? defaultMode == null || defaultMode === BindingMode.default
                    ? BindingMode.toView
                    : defaultMode
                : bindable.mode;
            target = bindable.property;
        }
        return new PropertyBindingInstruction(this._exprParser.parse(value, 8), target, mode);
    }
};
DefaultBindingCommand.inject = [IAttrMapper, IExpressionParser];
DefaultBindingCommand = __decorate([
    bindingCommand('bind')
], DefaultBindingCommand);
let CallBindingCommand = class CallBindingCommand {
    constructor(xp) {
        this.type = 0;
        this._exprParser = xp;
    }
    get name() { return 'call'; }
    build(info) {
        const target = info.bindable === null
            ? camelCase(info.attr.target)
            : info.bindable.property;
        return new CallBindingInstruction(this._exprParser.parse(info.attr.rawValue, (8 | 4)), target);
    }
};
CallBindingCommand.inject = [IExpressionParser];
CallBindingCommand = __decorate([
    bindingCommand('call')
], CallBindingCommand);
let ForBindingCommand = class ForBindingCommand {
    constructor(xp) {
        this.type = 0;
        this._exprParser = xp;
    }
    get name() { return 'for'; }
    build(info) {
        const target = info.bindable === null
            ? camelCase(info.attr.target)
            : info.bindable.property;
        return new IteratorBindingInstruction(this._exprParser.parse(info.attr.rawValue, 2), target);
    }
};
ForBindingCommand.inject = [IExpressionParser];
ForBindingCommand = __decorate([
    bindingCommand('for')
], ForBindingCommand);
let TriggerBindingCommand = class TriggerBindingCommand {
    constructor(xp) {
        this.type = 1;
        this._exprParser = xp;
    }
    get name() { return 'trigger'; }
    build(info) {
        return new ListenerBindingInstruction(this._exprParser.parse(info.attr.rawValue, 4), info.attr.target, true, DelegationStrategy.none);
    }
};
TriggerBindingCommand.inject = [IExpressionParser];
TriggerBindingCommand = __decorate([
    bindingCommand('trigger')
], TriggerBindingCommand);
let DelegateBindingCommand = class DelegateBindingCommand {
    constructor(xp) {
        this.type = 1;
        this._exprParser = xp;
    }
    get name() { return 'delegate'; }
    build(info) {
        return new ListenerBindingInstruction(this._exprParser.parse(info.attr.rawValue, 4), info.attr.target, false, DelegationStrategy.bubbling);
    }
};
DelegateBindingCommand.inject = [IExpressionParser];
DelegateBindingCommand = __decorate([
    bindingCommand('delegate')
], DelegateBindingCommand);
let CaptureBindingCommand = class CaptureBindingCommand {
    constructor(xp) {
        this.type = 1;
        this._exprParser = xp;
    }
    get name() { return 'capture'; }
    build(info) {
        return new ListenerBindingInstruction(this._exprParser.parse(info.attr.rawValue, 4), info.attr.target, false, DelegationStrategy.capturing);
    }
};
CaptureBindingCommand.inject = [IExpressionParser];
CaptureBindingCommand = __decorate([
    bindingCommand('capture')
], CaptureBindingCommand);
let AttrBindingCommand = class AttrBindingCommand {
    constructor(xp) {
        this.type = 1;
        this._exprParser = xp;
    }
    get name() { return 'attr'; }
    build(info) {
        return new AttributeBindingInstruction(info.attr.target, this._exprParser.parse(info.attr.rawValue, 8), info.attr.target);
    }
};
AttrBindingCommand.inject = [IExpressionParser];
AttrBindingCommand = __decorate([
    bindingCommand('attr')
], AttrBindingCommand);
let StyleBindingCommand = class StyleBindingCommand {
    constructor(xp) {
        this.type = 1;
        this._exprParser = xp;
    }
    get name() { return 'style'; }
    build(info) {
        return new AttributeBindingInstruction('style', this._exprParser.parse(info.attr.rawValue, 8), info.attr.target);
    }
};
StyleBindingCommand.inject = [IExpressionParser];
StyleBindingCommand = __decorate([
    bindingCommand('style')
], StyleBindingCommand);
let ClassBindingCommand = class ClassBindingCommand {
    constructor(xp) {
        this.type = 1;
        this._exprParser = xp;
    }
    get name() { return 'class'; }
    build(info) {
        return new AttributeBindingInstruction('class', this._exprParser.parse(info.attr.rawValue, 8), info.attr.target);
    }
};
ClassBindingCommand.inject = [IExpressionParser];
ClassBindingCommand = __decorate([
    bindingCommand('class')
], ClassBindingCommand);
let RefBindingCommand = class RefBindingCommand {
    constructor(xp) {
        this.type = 1;
        this._exprParser = xp;
    }
    get name() { return 'ref'; }
    build(info) {
        return new RefBindingInstruction(this._exprParser.parse(info.attr.rawValue, 8), info.attr.target);
    }
};
RefBindingCommand.inject = [IExpressionParser];
RefBindingCommand = __decorate([
    bindingCommand('ref')
], RefBindingCommand);
let SpreadBindingCommand = class SpreadBindingCommand {
    constructor() {
        this.type = 1;
    }
    get name() { return '...$attrs'; }
    build(_info) {
        return new SpreadBindingInstruction();
    }
};
SpreadBindingCommand = __decorate([
    bindingCommand('...$attrs')
], SpreadBindingCommand);

const ITemplateElementFactory = DI.createInterface('ITemplateElementFactory', x => x.singleton(TemplateElementFactory));
const markupCache = {};
class TemplateElementFactory {
    constructor(p) {
        this.p = p;
        this._template = p.document.createElement('template');
    }
    createTemplate(input) {
        var _a;
        if (isString(input)) {
            let result = markupCache[input];
            if (result === void 0) {
                const template = this._template;
                template.innerHTML = input;
                const node = template.content.firstElementChild;
                if (node == null || node.nodeName !== 'TEMPLATE' || node.nextElementSibling != null) {
                    this._template = this.p.document.createElement('template');
                    result = template;
                }
                else {
                    template.content.removeChild(node);
                    result = node;
                }
                markupCache[input] = result;
            }
            return result.cloneNode(true);
        }
        if (input.nodeName !== 'TEMPLATE') {
            const template = this.p.document.createElement('template');
            template.content.appendChild(input);
            return template;
        }
        (_a = input.parentNode) === null || _a === void 0 ? void 0 : _a.removeChild(input);
        return input.cloneNode(true);
    }
}
TemplateElementFactory.inject = [IPlatform];

class TemplateCompiler {
    constructor() {
        this.debug = false;
        this.resolveResources = true;
    }
    static register(container) {
        return singletonRegistration(ITemplateCompiler, this).register(container);
    }
    compile(partialDefinition, container, compilationInstruction) {
        var _a, _b, _c, _d;
        const definition = CustomElementDefinition.getOrCreate(partialDefinition);
        if (definition.template === null || definition.template === void 0) {
            return definition;
        }
        if (definition.needsCompile === false) {
            return definition;
        }
        compilationInstruction !== null && compilationInstruction !== void 0 ? compilationInstruction : (compilationInstruction = emptyCompilationInstructions);
        const context = new CompilationContext(partialDefinition, container, compilationInstruction, null, null, void 0);
        const template = isString(definition.template) || !partialDefinition.enhance
            ? context._templateFactory.createTemplate(definition.template)
            : definition.template;
        const isTemplateElement = template.nodeName === 'TEMPLATE' && template.content != null;
        const content = isTemplateElement ? template.content : template;
        const hooks = container.get(allResources(ITemplateCompilerHooks));
        const ii = hooks.length;
        let i = 0;
        if (ii > 0) {
            while (ii > i) {
                (_b = (_a = hooks[i]).compiling) === null || _b === void 0 ? void 0 : _b.call(_a, template);
                ++i;
            }
        }
        if (template.hasAttribute(localTemplateIdentifier)) {
            throw new Error(`AUR0701: The root cannot be a local template itself.`);
        }
        this._compileLocalElement(content, context);
        this._compileNode(content, context);
        return CustomElementDefinition.create({
            ...partialDefinition,
            name: partialDefinition.name || generateElementName(),
            dependencies: ((_c = partialDefinition.dependencies) !== null && _c !== void 0 ? _c : emptyArray).concat((_d = context.deps) !== null && _d !== void 0 ? _d : emptyArray),
            instructions: context.rows,
            surrogates: isTemplateElement
                ? this._compileSurrogate(template, context)
                : emptyArray,
            template,
            hasSlots: context.hasSlot,
            needsCompile: false,
        });
    }
    compileSpread(definition, attrSyntaxs, container, el) {
        var _a;
        const context = new CompilationContext(definition, container, emptyCompilationInstructions, null, null, void 0);
        const instructions = [];
        const elDef = context._findElement(el.nodeName.toLowerCase());
        const isCustomElement = elDef !== null;
        const exprParser = context._exprParser;
        const ii = attrSyntaxs.length;
        let i = 0;
        let attrSyntax;
        let attrDef = null;
        let attrInstructions;
        let attrBindableInstructions;
        let bindablesInfo;
        let bindable;
        let primaryBindable;
        let bindingCommand = null;
        let expr;
        let isMultiBindings;
        let attrTarget;
        let attrValue;
        for (; ii > i; ++i) {
            attrSyntax = attrSyntaxs[i];
            attrTarget = attrSyntax.target;
            attrValue = attrSyntax.rawValue;
            bindingCommand = context._createCommand(attrSyntax);
            if (bindingCommand !== null && (bindingCommand.type & 1) > 0) {
                commandBuildInfo.node = el;
                commandBuildInfo.attr = attrSyntax;
                commandBuildInfo.bindable = null;
                commandBuildInfo.def = null;
                instructions.push(bindingCommand.build(commandBuildInfo));
                continue;
            }
            attrDef = context._findAttr(attrTarget);
            if (attrDef !== null) {
                if (attrDef.isTemplateController) {
                    throw new Error(`AUR0703: Spreading template controller ${attrTarget} is not supported.`);
                }
                bindablesInfo = BindablesInfo.from(attrDef, true);
                isMultiBindings = attrDef.noMultiBindings === false
                    && bindingCommand === null
                    && hasInlineBindings(attrValue);
                if (isMultiBindings) {
                    attrBindableInstructions = this._compileMultiBindings(el, attrValue, attrDef, context);
                }
                else {
                    primaryBindable = bindablesInfo.primary;
                    if (bindingCommand === null) {
                        expr = exprParser.parse(attrValue, 1);
                        attrBindableInstructions = [
                            expr === null
                                ? new SetPropertyInstruction(attrValue, primaryBindable.property)
                                : new InterpolationInstruction(expr, primaryBindable.property)
                        ];
                    }
                    else {
                        commandBuildInfo.node = el;
                        commandBuildInfo.attr = attrSyntax;
                        commandBuildInfo.bindable = primaryBindable;
                        commandBuildInfo.def = attrDef;
                        attrBindableInstructions = [bindingCommand.build(commandBuildInfo)];
                    }
                }
                (attrInstructions !== null && attrInstructions !== void 0 ? attrInstructions : (attrInstructions = [])).push(new HydrateAttributeInstruction(this.resolveResources ? attrDef : attrDef.name, attrDef.aliases != null && attrDef.aliases.includes(attrTarget) ? attrTarget : void 0, attrBindableInstructions));
                continue;
            }
            if (bindingCommand === null) {
                expr = exprParser.parse(attrValue, 1);
                if (isCustomElement) {
                    bindablesInfo = BindablesInfo.from(elDef, false);
                    bindable = bindablesInfo.attrs[attrTarget];
                    if (bindable !== void 0) {
                        expr = exprParser.parse(attrValue, 1);
                        instructions.push(new SpreadElementPropBindingInstruction(expr == null
                            ? new SetPropertyInstruction(attrValue, bindable.property)
                            : new InterpolationInstruction(expr, bindable.property)));
                        continue;
                    }
                }
                if (expr != null) {
                    instructions.push(new InterpolationInstruction(expr, (_a = context._attrMapper.map(el, attrTarget)) !== null && _a !== void 0 ? _a : camelCase(attrTarget)));
                }
                else {
                    switch (attrTarget) {
                        case 'class':
                            instructions.push(new SetClassAttributeInstruction(attrValue));
                            break;
                        case 'style':
                            instructions.push(new SetStyleAttributeInstruction(attrValue));
                            break;
                        default:
                            instructions.push(new SetAttributeInstruction(attrValue, attrTarget));
                    }
                }
            }
            else {
                if (isCustomElement) {
                    bindablesInfo = BindablesInfo.from(elDef, false);
                    bindable = bindablesInfo.attrs[attrTarget];
                    if (bindable !== void 0) {
                        commandBuildInfo.node = el;
                        commandBuildInfo.attr = attrSyntax;
                        commandBuildInfo.bindable = bindable;
                        commandBuildInfo.def = elDef;
                        instructions.push(new SpreadElementPropBindingInstruction(bindingCommand.build(commandBuildInfo)));
                        continue;
                    }
                }
                commandBuildInfo.node = el;
                commandBuildInfo.attr = attrSyntax;
                commandBuildInfo.bindable = null;
                commandBuildInfo.def = null;
                instructions.push(bindingCommand.build(commandBuildInfo));
            }
        }
        resetCommandBuildInfo();
        if (attrInstructions != null) {
            return attrInstructions.concat(instructions);
        }
        return instructions;
    }
    _compileSurrogate(el, context) {
        var _a;
        const instructions = [];
        const attrs = el.attributes;
        const exprParser = context._exprParser;
        let ii = attrs.length;
        let i = 0;
        let attr;
        let attrName;
        let attrValue;
        let attrSyntax;
        let attrDef = null;
        let attrInstructions;
        let attrBindableInstructions;
        let bindableInfo;
        let primaryBindable;
        let bindingCommand = null;
        let expr;
        let isMultiBindings;
        let realAttrTarget;
        let realAttrValue;
        for (; ii > i; ++i) {
            attr = attrs[i];
            attrName = attr.name;
            attrValue = attr.value;
            attrSyntax = context._attrParser.parse(attrName, attrValue);
            realAttrTarget = attrSyntax.target;
            realAttrValue = attrSyntax.rawValue;
            if (invalidSurrogateAttribute[realAttrTarget]) {
                throw new Error(`AUR0702: Attribute ${attrName} is invalid on surrogate.`);
            }
            bindingCommand = context._createCommand(attrSyntax);
            if (bindingCommand !== null && (bindingCommand.type & 1) > 0) {
                commandBuildInfo.node = el;
                commandBuildInfo.attr = attrSyntax;
                commandBuildInfo.bindable = null;
                commandBuildInfo.def = null;
                instructions.push(bindingCommand.build(commandBuildInfo));
                continue;
            }
            attrDef = context._findAttr(realAttrTarget);
            if (attrDef !== null) {
                if (attrDef.isTemplateController) {
                    throw new Error(`AUR0703: Template controller ${realAttrTarget} is invalid on surrogate.`);
                }
                bindableInfo = BindablesInfo.from(attrDef, true);
                isMultiBindings = attrDef.noMultiBindings === false
                    && bindingCommand === null
                    && hasInlineBindings(realAttrValue);
                if (isMultiBindings) {
                    attrBindableInstructions = this._compileMultiBindings(el, realAttrValue, attrDef, context);
                }
                else {
                    primaryBindable = bindableInfo.primary;
                    if (bindingCommand === null) {
                        expr = exprParser.parse(realAttrValue, 1);
                        attrBindableInstructions = [
                            expr === null
                                ? new SetPropertyInstruction(realAttrValue, primaryBindable.property)
                                : new InterpolationInstruction(expr, primaryBindable.property)
                        ];
                    }
                    else {
                        commandBuildInfo.node = el;
                        commandBuildInfo.attr = attrSyntax;
                        commandBuildInfo.bindable = primaryBindable;
                        commandBuildInfo.def = attrDef;
                        attrBindableInstructions = [bindingCommand.build(commandBuildInfo)];
                    }
                }
                el.removeAttribute(attrName);
                --i;
                --ii;
                (attrInstructions !== null && attrInstructions !== void 0 ? attrInstructions : (attrInstructions = [])).push(new HydrateAttributeInstruction(this.resolveResources ? attrDef : attrDef.name, attrDef.aliases != null && attrDef.aliases.includes(realAttrTarget) ? realAttrTarget : void 0, attrBindableInstructions));
                continue;
            }
            if (bindingCommand === null) {
                expr = exprParser.parse(realAttrValue, 1);
                if (expr != null) {
                    el.removeAttribute(attrName);
                    --i;
                    --ii;
                    instructions.push(new InterpolationInstruction(expr, (_a = context._attrMapper.map(el, realAttrTarget)) !== null && _a !== void 0 ? _a : camelCase(realAttrTarget)));
                }
                else {
                    switch (attrName) {
                        case 'class':
                            instructions.push(new SetClassAttributeInstruction(realAttrValue));
                            break;
                        case 'style':
                            instructions.push(new SetStyleAttributeInstruction(realAttrValue));
                            break;
                        default:
                            instructions.push(new SetAttributeInstruction(realAttrValue, attrName));
                    }
                }
            }
            else {
                commandBuildInfo.node = el;
                commandBuildInfo.attr = attrSyntax;
                commandBuildInfo.bindable = null;
                commandBuildInfo.def = null;
                instructions.push(bindingCommand.build(commandBuildInfo));
            }
        }
        resetCommandBuildInfo();
        if (attrInstructions != null) {
            return attrInstructions.concat(instructions);
        }
        return instructions;
    }
    _compileNode(node, context) {
        switch (node.nodeType) {
            case 1:
                switch (node.nodeName) {
                    case 'LET':
                        return this._compileLet(node, context);
                    default:
                        return this._compileElement(node, context);
                }
            case 3:
                return this._compileText(node, context);
            case 11: {
                let current = node.firstChild;
                while (current !== null) {
                    current = this._compileNode(current, context);
                }
                break;
            }
        }
        return node.nextSibling;
    }
    _compileLet(el, context) {
        const attrs = el.attributes;
        const ii = attrs.length;
        const letInstructions = [];
        const exprParser = context._exprParser;
        let toBindingContext = false;
        let i = 0;
        let attr;
        let attrSyntax;
        let attrName;
        let attrValue;
        let bindingCommand;
        let realAttrTarget;
        let realAttrValue;
        let expr;
        for (; ii > i; ++i) {
            attr = attrs[i];
            attrName = attr.name;
            attrValue = attr.value;
            if (attrName === 'to-binding-context') {
                toBindingContext = true;
                continue;
            }
            attrSyntax = context._attrParser.parse(attrName, attrValue);
            realAttrTarget = attrSyntax.target;
            realAttrValue = attrSyntax.rawValue;
            bindingCommand = context._createCommand(attrSyntax);
            if (bindingCommand !== null) {
                switch (bindingCommand.name) {
                    case 'to-view':
                    case 'bind':
                        letInstructions.push(new LetBindingInstruction(exprParser.parse(realAttrValue, 8), camelCase(realAttrTarget)));
                        continue;
                    default:
                        throw new Error(`AUR0704: Invalid command ${attrSyntax.command} for <let>. Only to-view/bind supported.`);
                }
            }
            expr = exprParser.parse(realAttrValue, 1);
            if (expr === null) {
                {
                    context._logger.warn(`Property ${realAttrTarget} is declared with literal string ${realAttrValue}. ` +
                        `Did you mean ${realAttrTarget}.bind="${realAttrValue}"?`);
                }
            }
            letInstructions.push(new LetBindingInstruction(expr === null ? new PrimitiveLiteralExpression(realAttrValue) : expr, camelCase(realAttrTarget)));
        }
        context.rows.push([new HydrateLetElementInstruction(letInstructions, toBindingContext)]);
        return this._markAsTarget(el).nextSibling;
    }
    _compileElement(el, context) {
        var _a, _b, _c, _d, _e, _f;
        var _g, _h, _j, _k;
        const nextSibling = el.nextSibling;
        const elName = ((_a = el.getAttribute('as-element')) !== null && _a !== void 0 ? _a : el.nodeName).toLowerCase();
        const elDef = context._findElement(elName);
        const isCustomElement = elDef !== null;
        const isShadowDom = isCustomElement && elDef.shadowOptions != null;
        const capture = elDef === null || elDef === void 0 ? void 0 : elDef.capture;
        const hasCaptureFilter = capture != null && typeof capture !== 'boolean';
        const captures = capture ? [] : emptyArray;
        const exprParser = context._exprParser;
        const removeAttr = this.debug
            ? noop
            : () => {
                el.removeAttribute(attrName);
                --i;
                --ii;
            };
        let attrs = el.attributes;
        let instructions;
        let ii = attrs.length;
        let i = 0;
        let attr;
        let attrName;
        let attrValue;
        let attrSyntax;
        let plainAttrInstructions;
        let elBindableInstructions;
        let attrDef = null;
        let isMultiBindings = false;
        let bindable;
        let attrInstructions;
        let attrBindableInstructions;
        let tcInstructions;
        let tcInstruction;
        let expr;
        let elementInstruction;
        let bindingCommand = null;
        let bindablesInfo;
        let primaryBindable;
        let realAttrTarget;
        let realAttrValue;
        let processContentResult = true;
        let hasContainerless = false;
        let canCapture = false;
        if (elName === 'slot') {
            if (context.root.def.shadowOptions == null) {
                throw new Error(`AUR0717: detect a usage of "<slot>" element without specifying shadow DOM options in element: ${context.root.def.name}`);
            }
            context.root.hasSlot = true;
        }
        if (isCustomElement) {
            processContentResult = (_b = elDef.processContent) === null || _b === void 0 ? void 0 : _b.call(elDef.Type, el, context.p);
            attrs = el.attributes;
            ii = attrs.length;
        }
        if (context.root.def.enhance && el.classList.contains('au')) {
            throw new Error(`AUR0705: `
                    + 'Trying to enhance with a template that was probably compiled before. '
                    + 'This is likely going to cause issues. '
                    + 'Consider enhancing only untouched elements or first remove all "au" classes.');
        }
        for (; ii > i; ++i) {
            attr = attrs[i];
            attrName = attr.name;
            attrValue = attr.value;
            switch (attrName) {
                case 'as-element':
                case 'containerless':
                    removeAttr();
                    if (!hasContainerless) {
                        hasContainerless = attrName === 'containerless';
                    }
                    continue;
            }
            attrSyntax = context._attrParser.parse(attrName, attrValue);
            bindingCommand = context._createCommand(attrSyntax);
            realAttrTarget = attrSyntax.target;
            realAttrValue = attrSyntax.rawValue;
            if (capture && (!hasCaptureFilter || hasCaptureFilter && capture(realAttrTarget))) {
                if (bindingCommand != null && bindingCommand.type & 1) {
                    removeAttr();
                    captures.push(attrSyntax);
                    continue;
                }
                canCapture = realAttrTarget !== 'au-slot' && realAttrTarget !== 'slot';
                if (canCapture) {
                    bindablesInfo = BindablesInfo.from(elDef, false);
                    if (bindablesInfo.attrs[realAttrTarget] == null && !((_c = context._findAttr(realAttrTarget)) === null || _c === void 0 ? void 0 : _c.isTemplateController)) {
                        removeAttr();
                        captures.push(attrSyntax);
                        continue;
                    }
                }
            }
            if (bindingCommand !== null && bindingCommand.type & 1) {
                commandBuildInfo.node = el;
                commandBuildInfo.attr = attrSyntax;
                commandBuildInfo.bindable = null;
                commandBuildInfo.def = null;
                (plainAttrInstructions !== null && plainAttrInstructions !== void 0 ? plainAttrInstructions : (plainAttrInstructions = [])).push(bindingCommand.build(commandBuildInfo));
                removeAttr();
                continue;
            }
            attrDef = context._findAttr(realAttrTarget);
            if (attrDef !== null) {
                bindablesInfo = BindablesInfo.from(attrDef, true);
                isMultiBindings = attrDef.noMultiBindings === false
                    && bindingCommand === null
                    && hasInlineBindings(realAttrValue);
                if (isMultiBindings) {
                    attrBindableInstructions = this._compileMultiBindings(el, realAttrValue, attrDef, context);
                }
                else {
                    primaryBindable = bindablesInfo.primary;
                    if (bindingCommand === null) {
                        expr = exprParser.parse(realAttrValue, 1);
                        attrBindableInstructions = [
                            expr === null
                                ? new SetPropertyInstruction(realAttrValue, primaryBindable.property)
                                : new InterpolationInstruction(expr, primaryBindable.property)
                        ];
                    }
                    else {
                        commandBuildInfo.node = el;
                        commandBuildInfo.attr = attrSyntax;
                        commandBuildInfo.bindable = primaryBindable;
                        commandBuildInfo.def = attrDef;
                        attrBindableInstructions = [bindingCommand.build(commandBuildInfo)];
                    }
                }
                removeAttr();
                if (attrDef.isTemplateController) {
                    (tcInstructions !== null && tcInstructions !== void 0 ? tcInstructions : (tcInstructions = [])).push(new HydrateTemplateController(voidDefinition, this.resolveResources ? attrDef : attrDef.name, void 0, attrBindableInstructions));
                }
                else {
                    (attrInstructions !== null && attrInstructions !== void 0 ? attrInstructions : (attrInstructions = [])).push(new HydrateAttributeInstruction(this.resolveResources ? attrDef : attrDef.name, attrDef.aliases != null && attrDef.aliases.includes(realAttrTarget) ? realAttrTarget : void 0, attrBindableInstructions));
                }
                continue;
            }
            if (bindingCommand === null) {
                if (isCustomElement) {
                    bindablesInfo = BindablesInfo.from(elDef, false);
                    bindable = bindablesInfo.attrs[realAttrTarget];
                    if (bindable !== void 0) {
                        expr = exprParser.parse(realAttrValue, 1);
                        (elBindableInstructions !== null && elBindableInstructions !== void 0 ? elBindableInstructions : (elBindableInstructions = [])).push(expr == null
                            ? new SetPropertyInstruction(realAttrValue, bindable.property)
                            : new InterpolationInstruction(expr, bindable.property));
                        removeAttr();
                        continue;
                    }
                }
                expr = exprParser.parse(realAttrValue, 1);
                if (expr != null) {
                    removeAttr();
                    (plainAttrInstructions !== null && plainAttrInstructions !== void 0 ? plainAttrInstructions : (plainAttrInstructions = [])).push(new InterpolationInstruction(expr, (_d = context._attrMapper.map(el, realAttrTarget)) !== null && _d !== void 0 ? _d : camelCase(realAttrTarget)));
                }
                continue;
            }
            removeAttr();
            if (isCustomElement) {
                bindablesInfo = BindablesInfo.from(elDef, false);
                bindable = bindablesInfo.attrs[realAttrTarget];
                if (bindable !== void 0) {
                    commandBuildInfo.node = el;
                    commandBuildInfo.attr = attrSyntax;
                    commandBuildInfo.bindable = bindable;
                    commandBuildInfo.def = elDef;
                    (elBindableInstructions !== null && elBindableInstructions !== void 0 ? elBindableInstructions : (elBindableInstructions = [])).push(bindingCommand.build(commandBuildInfo));
                    continue;
                }
            }
            commandBuildInfo.node = el;
            commandBuildInfo.attr = attrSyntax;
            commandBuildInfo.bindable = null;
            commandBuildInfo.def = null;
            (plainAttrInstructions !== null && plainAttrInstructions !== void 0 ? plainAttrInstructions : (plainAttrInstructions = [])).push(bindingCommand.build(commandBuildInfo));
        }
        resetCommandBuildInfo();
        if (this._shouldReorderAttrs(el) && plainAttrInstructions != null && plainAttrInstructions.length > 1) {
            this._reorder(el, plainAttrInstructions);
        }
        if (isCustomElement) {
            elementInstruction = new HydrateElementInstruction(this.resolveResources ? elDef : elDef.name, void 0, (elBindableInstructions !== null && elBindableInstructions !== void 0 ? elBindableInstructions : emptyArray), null, hasContainerless, captures);
            if (elName === AU_SLOT) {
                const slotName = el.getAttribute('name') || DEFAULT_SLOT_NAME;
                const template = context.h('template');
                const fallbackContentContext = context._createChild();
                let node = el.firstChild;
                while (node !== null) {
                    if (node.nodeType === 1 && node.hasAttribute('au-slot')) {
                        el.removeChild(node);
                    }
                    else {
                        template.content.appendChild(node);
                    }
                    node = el.firstChild;
                }
                this._compileNode(template.content, fallbackContentContext);
                elementInstruction.auSlot = {
                    name: slotName,
                    fallback: CustomElementDefinition.create({
                        name: generateElementName(),
                        template,
                        instructions: fallbackContentContext.rows,
                        needsCompile: false,
                    }),
                };
                el = this._replaceByMarker(el, context);
            }
        }
        if (plainAttrInstructions != null
            || elementInstruction != null
            || attrInstructions != null) {
            instructions = emptyArray.concat(elementInstruction !== null && elementInstruction !== void 0 ? elementInstruction : emptyArray, attrInstructions !== null && attrInstructions !== void 0 ? attrInstructions : emptyArray, plainAttrInstructions !== null && plainAttrInstructions !== void 0 ? plainAttrInstructions : emptyArray);
            this._markAsTarget(el);
        }
        let shouldCompileContent;
        if (tcInstructions != null) {
            ii = tcInstructions.length - 1;
            i = ii;
            tcInstruction = tcInstructions[i];
            let template;
            this._replaceByMarker(el, context);
            if (el.nodeName === 'TEMPLATE') {
                template = el;
            }
            else {
                template = context.h('template');
                template.content.appendChild(el);
            }
            const mostInnerTemplate = template;
            const childContext = context._createChild(instructions == null ? [] : [instructions]);
            let childEl;
            let targetSlot;
            let projections;
            let slotTemplateRecord;
            let slotTemplates;
            let slotTemplate;
            let marker;
            let projectionCompilationContext;
            let j = 0, jj = 0;
            let child = el.firstChild;
            let isEmptyTextNode = false;
            if (processContentResult !== false) {
                while (child !== null) {
                    targetSlot = child.nodeType === 1 ? child.getAttribute(AU_SLOT) : null;
                    if (targetSlot !== null) {
                        child.removeAttribute(AU_SLOT);
                    }
                    if (isCustomElement) {
                        childEl = child.nextSibling;
                        if (!isShadowDom) {
                            isEmptyTextNode = child.nodeType === 3 && child.textContent.trim() === '';
                            if (!isEmptyTextNode) {
                                ((_e = (_g = (slotTemplateRecord !== null && slotTemplateRecord !== void 0 ? slotTemplateRecord : (slotTemplateRecord = {})))[_h = targetSlot || DEFAULT_SLOT_NAME]) !== null && _e !== void 0 ? _e : (_g[_h] = [])).push(child);
                            }
                            el.removeChild(child);
                        }
                        child = childEl;
                    }
                    else {
                        if (targetSlot !== null) {
                            targetSlot = targetSlot || DEFAULT_SLOT_NAME;
                            throw new Error(`AUR0706: Projection with [au-slot="${targetSlot}"] is attempted on a non custom element ${el.nodeName}.`);
                        }
                        child = child.nextSibling;
                    }
                }
            }
            if (slotTemplateRecord != null) {
                projections = {};
                for (targetSlot in slotTemplateRecord) {
                    template = context.h('template');
                    slotTemplates = slotTemplateRecord[targetSlot];
                    for (j = 0, jj = slotTemplates.length; jj > j; ++j) {
                        slotTemplate = slotTemplates[j];
                        if (slotTemplate.nodeName === 'TEMPLATE') {
                            if (slotTemplate.attributes.length > 0) {
                                template.content.appendChild(slotTemplate);
                            }
                            else {
                                template.content.appendChild(slotTemplate.content);
                            }
                        }
                        else {
                            template.content.appendChild(slotTemplate);
                        }
                    }
                    projectionCompilationContext = context._createChild();
                    this._compileNode(template.content, projectionCompilationContext);
                    projections[targetSlot] = CustomElementDefinition.create({
                        name: generateElementName(),
                        template,
                        instructions: projectionCompilationContext.rows,
                        needsCompile: false,
                        isStrictBinding: context.root.def.isStrictBinding,
                    });
                }
                elementInstruction.projections = projections;
            }
            if (isCustomElement && (hasContainerless || elDef.containerless)) {
                this._replaceByMarker(el, context);
            }
            shouldCompileContent = !isCustomElement || !elDef.containerless && !hasContainerless && processContentResult !== false;
            if (shouldCompileContent) {
                if (el.nodeName === 'TEMPLATE') {
                    this._compileNode(el.content, childContext);
                }
                else {
                    child = el.firstChild;
                    while (child !== null) {
                        child = this._compileNode(child, childContext);
                    }
                }
            }
            tcInstruction.def = CustomElementDefinition.create({
                name: generateElementName(),
                template: mostInnerTemplate,
                instructions: childContext.rows,
                needsCompile: false,
                isStrictBinding: context.root.def.isStrictBinding,
            });
            while (i-- > 0) {
                tcInstruction = tcInstructions[i];
                template = context.h('template');
                marker = context.h('au-m');
                marker.classList.add('au');
                template.content.appendChild(marker);
                tcInstruction.def = CustomElementDefinition.create({
                    name: generateElementName(),
                    template,
                    needsCompile: false,
                    instructions: [[tcInstructions[i + 1]]],
                    isStrictBinding: context.root.def.isStrictBinding,
                });
            }
            context.rows.push([tcInstruction]);
        }
        else {
            if (instructions != null) {
                context.rows.push(instructions);
            }
            let child = el.firstChild;
            let childEl;
            let targetSlot;
            let projections = null;
            let slotTemplateRecord;
            let slotTemplates;
            let slotTemplate;
            let template;
            let projectionCompilationContext;
            let isEmptyTextNode = false;
            let j = 0, jj = 0;
            if (processContentResult !== false) {
                while (child !== null) {
                    targetSlot = child.nodeType === 1 ? child.getAttribute(AU_SLOT) : null;
                    if (targetSlot !== null) {
                        child.removeAttribute(AU_SLOT);
                    }
                    if (isCustomElement) {
                        childEl = child.nextSibling;
                        if (!isShadowDom) {
                            isEmptyTextNode = child.nodeType === 3 && child.textContent.trim() === '';
                            if (!isEmptyTextNode) {
                                ((_f = (_j = (slotTemplateRecord !== null && slotTemplateRecord !== void 0 ? slotTemplateRecord : (slotTemplateRecord = {})))[_k = targetSlot || DEFAULT_SLOT_NAME]) !== null && _f !== void 0 ? _f : (_j[_k] = [])).push(child);
                            }
                            el.removeChild(child);
                        }
                        child = childEl;
                    }
                    else {
                        if (targetSlot !== null) {
                            targetSlot = targetSlot || DEFAULT_SLOT_NAME;
                            throw new Error(`AUR0706: Projection with [au-slot="${targetSlot}"] is attempted on a non custom element ${el.nodeName}.`);
                        }
                        child = child.nextSibling;
                    }
                }
            }
            if (slotTemplateRecord != null) {
                projections = {};
                for (targetSlot in slotTemplateRecord) {
                    template = context.h('template');
                    slotTemplates = slotTemplateRecord[targetSlot];
                    for (j = 0, jj = slotTemplates.length; jj > j; ++j) {
                        slotTemplate = slotTemplates[j];
                        if (slotTemplate.nodeName === 'TEMPLATE') {
                            if (slotTemplate.attributes.length > 0) {
                                template.content.appendChild(slotTemplate);
                            }
                            else {
                                template.content.appendChild(slotTemplate.content);
                            }
                        }
                        else {
                            template.content.appendChild(slotTemplate);
                        }
                    }
                    projectionCompilationContext = context._createChild();
                    this._compileNode(template.content, projectionCompilationContext);
                    projections[targetSlot] = CustomElementDefinition.create({
                        name: generateElementName(),
                        template,
                        instructions: projectionCompilationContext.rows,
                        needsCompile: false,
                        isStrictBinding: context.root.def.isStrictBinding,
                    });
                }
                elementInstruction.projections = projections;
            }
            if (isCustomElement && (hasContainerless || elDef.containerless)) {
                this._replaceByMarker(el, context);
            }
            shouldCompileContent = !isCustomElement || !elDef.containerless && !hasContainerless && processContentResult !== false;
            if (shouldCompileContent && el.childNodes.length > 0) {
                child = el.firstChild;
                while (child !== null) {
                    child = this._compileNode(child, context);
                }
            }
        }
        return nextSibling;
    }
    _compileText(node, context) {
        let text = '';
        let current = node;
        while (current !== null && current.nodeType === 3) {
            text += current.textContent;
            current = current.nextSibling;
        }
        const expr = context._exprParser.parse(text, 1);
        if (expr === null) {
            return current;
        }
        const parent = node.parentNode;
        parent.insertBefore(this._markAsTarget(context.h('au-m')), node);
        context.rows.push([new TextBindingInstruction(expr, !!context.def.isStrictBinding)]);
        node.textContent = '';
        current = node.nextSibling;
        while (current !== null && current.nodeType === 3) {
            parent.removeChild(current);
            current = node.nextSibling;
        }
        return node.nextSibling;
    }
    _compileMultiBindings(node, attrRawValue, attrDef, context) {
        const bindableAttrsInfo = BindablesInfo.from(attrDef, true);
        const valueLength = attrRawValue.length;
        const instructions = [];
        let attrName = void 0;
        let attrValue = void 0;
        let start = 0;
        let ch = 0;
        let expr;
        let attrSyntax;
        let command;
        let bindable;
        for (let i = 0; i < valueLength; ++i) {
            ch = attrRawValue.charCodeAt(i);
            if (ch === 92) {
                ++i;
            }
            else if (ch === 58) {
                attrName = attrRawValue.slice(start, i);
                while (attrRawValue.charCodeAt(++i) <= 32)
                    ;
                start = i;
                for (; i < valueLength; ++i) {
                    ch = attrRawValue.charCodeAt(i);
                    if (ch === 92) {
                        ++i;
                    }
                    else if (ch === 59) {
                        attrValue = attrRawValue.slice(start, i);
                        break;
                    }
                }
                if (attrValue === void 0) {
                    attrValue = attrRawValue.slice(start);
                }
                attrSyntax = context._attrParser.parse(attrName, attrValue);
                command = context._createCommand(attrSyntax);
                bindable = bindableAttrsInfo.attrs[attrSyntax.target];
                if (bindable == null) {
                    throw new Error(`AUR0707: Bindable ${attrSyntax.target} not found on ${attrDef.name}.`);
                }
                if (command === null) {
                    expr = context._exprParser.parse(attrValue, 1);
                    instructions.push(expr === null
                        ? new SetPropertyInstruction(attrValue, bindable.property)
                        : new InterpolationInstruction(expr, bindable.property));
                }
                else {
                    commandBuildInfo.node = node;
                    commandBuildInfo.attr = attrSyntax;
                    commandBuildInfo.bindable = bindable;
                    commandBuildInfo.def = attrDef;
                    instructions.push(command.build(commandBuildInfo));
                }
                while (i < valueLength && attrRawValue.charCodeAt(++i) <= 32)
                    ;
                start = i;
                attrName = void 0;
                attrValue = void 0;
            }
        }
        resetCommandBuildInfo();
        return instructions;
    }
    _compileLocalElement(template, context) {
        var _a, _b;
        const root = template;
        const localTemplates = toArray(root.querySelectorAll('template[as-custom-element]'));
        const numLocalTemplates = localTemplates.length;
        if (numLocalTemplates === 0) {
            return;
        }
        if (numLocalTemplates === root.childElementCount) {
            throw new Error(`AUR0708: The custom element does not have any content other than local template(s).`);
        }
        const localTemplateNames = new Set();
        const localElTypes = [];
        for (const localTemplate of localTemplates) {
            if (localTemplate.parentNode !== root) {
                throw new Error(`AUR0709: Local templates needs to be defined directly under root.`);
            }
            const name = processTemplateName(localTemplate, localTemplateNames);
            const LocalTemplateType = class LocalTemplate {
            };
            const content = localTemplate.content;
            const bindableEls = toArray(content.querySelectorAll('bindable'));
            const bindableInstructions = Bindable.for(LocalTemplateType);
            const properties = new Set();
            const attributes = new Set();
            for (const bindableEl of bindableEls) {
                if (bindableEl.parentNode !== content) {
                    throw new Error(`AUR0710: Bindable properties of local templates needs to be defined directly under root.`);
                }
                const property = bindableEl.getAttribute("property");
                if (property === null) {
                    throw new Error(`AUR0711: The attribute 'property' is missing in ${bindableEl.outerHTML}`);
                }
                const attribute = bindableEl.getAttribute("attribute");
                if (attribute !== null
                    && attributes.has(attribute)
                    || properties.has(property)) {
                    throw new Error(`Bindable property and attribute needs to be unique; found property: ${property}, attribute: ${attribute}`);
                }
                else {
                    if (attribute !== null) {
                        attributes.add(attribute);
                    }
                    properties.add(property);
                }
                bindableInstructions.add({
                    property,
                    attribute: attribute !== null && attribute !== void 0 ? attribute : void 0,
                    mode: getBindingMode(bindableEl),
                });
                const ignoredAttributes = bindableEl.getAttributeNames().filter((attrName) => !allowedLocalTemplateBindableAttributes.includes(attrName));
                if (ignoredAttributes.length > 0) {
                    context._logger.warn(`The attribute(s) ${ignoredAttributes.join(', ')} will be ignored for ${bindableEl.outerHTML}. Only ${allowedLocalTemplateBindableAttributes.join(', ')} are processed.`);
                }
                content.removeChild(bindableEl);
            }
            localElTypes.push(LocalTemplateType);
            context._addDep(defineElement({ name, template: localTemplate }, LocalTemplateType));
            root.removeChild(localTemplate);
        }
        let i = 0;
        const ii = localElTypes.length;
        for (; ii > i; ++i) {
            getElementDefinition(localElTypes[i]).dependencies.push(...(_a = context.def.dependencies) !== null && _a !== void 0 ? _a : emptyArray, ...(_b = context.deps) !== null && _b !== void 0 ? _b : emptyArray);
        }
    }
    _shouldReorderAttrs(el) {
        return el.nodeName === 'INPUT' && orderSensitiveInputType[el.type] === 1;
    }
    _reorder(el, instructions) {
        switch (el.nodeName) {
            case 'INPUT': {
                const _instructions = instructions;
                let modelOrValueOrMatcherIndex = void 0;
                let checkedIndex = void 0;
                let found = 0;
                let instruction;
                for (let i = 0; i < _instructions.length && found < 3; i++) {
                    instruction = _instructions[i];
                    switch (instruction.to) {
                        case 'model':
                        case 'value':
                        case 'matcher':
                            modelOrValueOrMatcherIndex = i;
                            found++;
                            break;
                        case 'checked':
                            checkedIndex = i;
                            found++;
                            break;
                    }
                }
                if (checkedIndex !== void 0 && modelOrValueOrMatcherIndex !== void 0 && checkedIndex < modelOrValueOrMatcherIndex) {
                    [_instructions[modelOrValueOrMatcherIndex], _instructions[checkedIndex]] = [_instructions[checkedIndex], _instructions[modelOrValueOrMatcherIndex]];
                }
            }
        }
    }
    _markAsTarget(el) {
        el.classList.add('au');
        return el;
    }
    _replaceByMarker(node, context) {
        const parent = node.parentNode;
        const marker = context.h('au-m');
        this._markAsTarget(parent.insertBefore(marker, node));
        parent.removeChild(node);
        return marker;
    }
}
class CompilationContext {
    constructor(def, container, compilationInstruction, parent, root, instructions) {
        this.hasSlot = false;
        this._commands = createLookup();
        const hasParent = parent !== null;
        this.c = container;
        this.root = root === null ? this : root;
        this.def = def;
        this.ci = compilationInstruction;
        this.parent = parent;
        this._templateFactory = hasParent ? parent._templateFactory : container.get(ITemplateElementFactory);
        this._attrParser = hasParent ? parent._attrParser : container.get(IAttributeParser);
        this._exprParser = hasParent ? parent._exprParser : container.get(IExpressionParser);
        this._attrMapper = hasParent ? parent._attrMapper : container.get(IAttrMapper);
        this._logger = hasParent ? parent._logger : container.get(ILogger);
        this.p = hasParent ? parent.p : container.get(IPlatform);
        this.localEls = hasParent ? parent.localEls : new Set();
        this.rows = instructions !== null && instructions !== void 0 ? instructions : [];
    }
    _addDep(dep) {
        var _a;
        var _b;
        ((_a = (_b = this.root).deps) !== null && _a !== void 0 ? _a : (_b.deps = [])).push(dep);
        this.root.c.register(dep);
    }
    h(name) {
        const el = this.p.document.createElement(name);
        if (name === 'template') {
            this.p.document.adoptNode(el.content);
        }
        return el;
    }
    _findElement(name) {
        return this.c.find(CustomElement, name);
    }
    _findAttr(name) {
        return this.c.find(CustomAttribute, name);
    }
    _createChild(instructions) {
        return new CompilationContext(this.def, this.c, this.ci, this, this.root, instructions);
    }
    _createCommand(syntax) {
        if (this.root !== this) {
            return this.root._createCommand(syntax);
        }
        const name = syntax.command;
        if (name === null) {
            return null;
        }
        let result = this._commands[name];
        if (result === void 0) {
            result = this.c.create(BindingCommand, name);
            if (result === null) {
                throw new Error(`AUR0713: Unknown binding command: ${name}`);
            }
            this._commands[name] = result;
        }
        return result;
    }
}
function hasInlineBindings(rawValue) {
    const len = rawValue.length;
    let ch = 0;
    let i = 0;
    while (len > i) {
        ch = rawValue.charCodeAt(i);
        if (ch === 92) {
            ++i;
        }
        else if (ch === 58) {
            return true;
        }
        else if (ch === 36 && rawValue.charCodeAt(i + 1) === 123) {
            return false;
        }
        ++i;
    }
    return false;
}
function resetCommandBuildInfo() {
    commandBuildInfo.node
        = commandBuildInfo.attr
            = commandBuildInfo.bindable
                = commandBuildInfo.def = null;
}
const emptyCompilationInstructions = { projections: null };
const voidDefinition = { name: 'unnamed' };
const commandBuildInfo = {
    node: null,
    attr: null,
    bindable: null,
    def: null,
};
const invalidSurrogateAttribute = Object.assign(createLookup(), {
    'id': true,
    'name': true,
    'au-slot': true,
    'as-element': true,
});
const orderSensitiveInputType = {
    checkbox: 1,
    radio: 1,
};
const bindableAttrsInfoCache = new WeakMap();
class BindablesInfo {
    constructor(attrs, bindables, primary) {
        this.attrs = attrs;
        this.bindables = bindables;
        this.primary = primary;
    }
    static from(def, isAttr) {
        let info = bindableAttrsInfoCache.get(def);
        if (info == null) {
            const bindables = def.bindables;
            const attrs = createLookup();
            const defaultBindingMode = isAttr
                ? def.defaultBindingMode === void 0
                    ? BindingMode.default
                    : def.defaultBindingMode
                : BindingMode.default;
            let bindable;
            let prop;
            let hasPrimary = false;
            let primary;
            let attr;
            for (prop in bindables) {
                bindable = bindables[prop];
                attr = bindable.attribute;
                if (bindable.primary === true) {
                    if (hasPrimary) {
                        throw new Error(`AUR0714: Primary already exists on ${def.name}`);
                    }
                    hasPrimary = true;
                    primary = bindable;
                }
                else if (!hasPrimary && primary == null) {
                    primary = bindable;
                }
                attrs[attr] = BindableDefinition.create(prop, def.Type, bindable);
            }
            if (bindable == null && isAttr) {
                primary = attrs.value = BindableDefinition.create('value', def.Type, { mode: defaultBindingMode });
            }
            bindableAttrsInfoCache.set(def, info = new BindablesInfo(attrs, bindables, primary));
        }
        return info;
    }
}
var LocalTemplateBindableAttributes;
(function (LocalTemplateBindableAttributes) {
    LocalTemplateBindableAttributes["property"] = "property";
    LocalTemplateBindableAttributes["attribute"] = "attribute";
    LocalTemplateBindableAttributes["mode"] = "mode";
})(LocalTemplateBindableAttributes || (LocalTemplateBindableAttributes = {}));
const allowedLocalTemplateBindableAttributes = Object.freeze([
    "property",
    "attribute",
    "mode"
]);
const localTemplateIdentifier = 'as-custom-element';
function processTemplateName(localTemplate, localTemplateNames) {
    const name = localTemplate.getAttribute(localTemplateIdentifier);
    if (name === null || name === '') {
        throw new Error(`AUR0715: The value of "as-custom-element" attribute cannot be empty for local template`);
    }
    if (localTemplateNames.has(name)) {
        throw new Error(`AUR0716: Duplicate definition of the local template named ${name}`);
    }
    else {
        localTemplateNames.add(name);
        localTemplate.removeAttribute(localTemplateIdentifier);
    }
    return name;
}
function getBindingMode(bindable) {
    switch (bindable.getAttribute("mode")) {
        case 'oneTime':
            return BindingMode.oneTime;
        case 'toView':
            return BindingMode.toView;
        case 'fromView':
            return BindingMode.fromView;
        case 'twoWay':
            return BindingMode.twoWay;
        case 'default':
        default:
            return BindingMode.default;
    }
}
const ITemplateCompilerHooks = DI.createInterface('ITemplateCompilerHooks');
const typeToHooksDefCache = new WeakMap();
const hooksBaseName = getResourceKeyFor('compiler-hooks');
const TemplateCompilerHooks = Object.freeze({
    name: hooksBaseName,
    define(Type) {
        let def = typeToHooksDefCache.get(Type);
        if (def === void 0) {
            typeToHooksDefCache.set(Type, def = new TemplateCompilerHooksDefinition(Type));
            defineMetadata(hooksBaseName, def, Type);
            appendResourceKey(Type, hooksBaseName);
        }
        return Type;
    }
});
class TemplateCompilerHooksDefinition {
    constructor(Type) {
        this.Type = Type;
    }
    get name() { return ''; }
    register(c) {
        c.register(singletonRegistration(ITemplateCompilerHooks, this.Type));
    }
}
const templateCompilerHooks = (target) => {
    return target === void 0 ? decorator : decorator(target);
    function decorator(t) {
        return TemplateCompilerHooks.define(t);
    }
};
const DEFAULT_SLOT_NAME = 'default';
const AU_SLOT = 'au-slot';

class BindingModeBehavior {
    constructor(mode) {
        this.mode = mode;
        this._originalModes = new Map();
    }
    bind(flags, scope, binding) {
        this._originalModes.set(binding, binding.mode);
        binding.mode = this.mode;
    }
    unbind(flags, scope, binding) {
        binding.mode = this._originalModes.get(binding);
        this._originalModes.delete(binding);
    }
}
class OneTimeBindingBehavior extends BindingModeBehavior {
    constructor() {
        super(BindingMode.oneTime);
    }
}
class ToViewBindingBehavior extends BindingModeBehavior {
    constructor() {
        super(BindingMode.toView);
    }
}
class FromViewBindingBehavior extends BindingModeBehavior {
    constructor() {
        super(BindingMode.fromView);
    }
}
class TwoWayBindingBehavior extends BindingModeBehavior {
    constructor() {
        super(BindingMode.twoWay);
    }
}
bindingBehavior('oneTime')(OneTimeBindingBehavior);
bindingBehavior('toView')(ToViewBindingBehavior);
bindingBehavior('fromView')(FromViewBindingBehavior);
bindingBehavior('twoWay')(TwoWayBindingBehavior);

const defaultDelay$1 = 200;
class DebounceBindingBehavior extends BindingInterceptor {
    constructor(binding, expr) {
        super(binding, expr);
        this.opts = { delay: defaultDelay$1 };
        this.firstArg = null;
        this.task = null;
        this.taskQueue = binding.locator.get(IPlatform$1).taskQueue;
        if (expr.args.length > 0) {
            this.firstArg = expr.args[0];
        }
    }
    callSource(args) {
        this.queueTask(() => this.binding.callSource(args));
        return void 0;
    }
    handleChange(newValue, oldValue, flags) {
        if (this.task !== null) {
            this.task.cancel();
            this.task = null;
        }
        this.binding.handleChange(newValue, oldValue, flags);
    }
    updateSource(newValue, flags) {
        this.queueTask(() => this.binding.updateSource(newValue, flags));
    }
    queueTask(callback) {
        const task = this.task;
        this.task = this.taskQueue.queueTask(() => {
            this.task = null;
            return callback();
        }, this.opts);
        task === null || task === void 0 ? void 0 : task.cancel();
    }
    $bind(flags, scope) {
        if (this.firstArg !== null) {
            const delay = Number(this.firstArg.evaluate(flags, scope, this.locator, null));
            this.opts.delay = isNaN(delay) ? defaultDelay$1 : delay;
        }
        this.binding.$bind(flags, scope);
    }
    $unbind(flags) {
        var _a;
        (_a = this.task) === null || _a === void 0 ? void 0 : _a.cancel();
        this.task = null;
        this.binding.$unbind(flags);
    }
}
bindingBehavior('debounce')(DebounceBindingBehavior);

class SignalBindingBehavior {
    constructor(signaler) {
        this._lookup = new Map();
        this._signaler = signaler;
    }
    bind(flags, scope, binding, ...names) {
        if (!('handleChange' in binding)) {
            throw new Error(`AUR0817: The signal behavior can only be used with bindings that have a "handleChange" method`);
        }
        if (names.length === 0) {
            throw new Error(`AUR0818: At least one signal name must be passed to the signal behavior, e.g. "expr & signal:'my-signal'"`);
        }
        this._lookup.set(binding, names);
        let name;
        for (name of names) {
            this._signaler.addSignalListener(name, binding);
        }
    }
    unbind(flags, scope, binding) {
        const names = this._lookup.get(binding);
        this._lookup.delete(binding);
        let name;
        for (name of names) {
            this._signaler.removeSignalListener(name, binding);
        }
    }
}
SignalBindingBehavior.inject = [ISignaler];
bindingBehavior('signal')(SignalBindingBehavior);

const defaultDelay = 200;
class ThrottleBindingBehavior extends BindingInterceptor {
    constructor(binding, expr) {
        super(binding, expr);
        this.opts = { delay: defaultDelay };
        this.firstArg = null;
        this.task = null;
        this.lastCall = 0;
        this.delay = 0;
        this._platform = binding.locator.get(IPlatform$1);
        this._taskQueue = this._platform.taskQueue;
        if (expr.args.length > 0) {
            this.firstArg = expr.args[0];
        }
    }
    callSource(args) {
        this._queueTask(() => this.binding.callSource(args));
        return void 0;
    }
    handleChange(newValue, oldValue, flags) {
        if (this.task !== null) {
            this.task.cancel();
            this.task = null;
            this.lastCall = this._platform.performanceNow();
        }
        this.binding.handleChange(newValue, oldValue, flags);
    }
    updateSource(newValue, flags) {
        this._queueTask(() => this.binding.updateSource(newValue, flags));
    }
    _queueTask(callback) {
        const opts = this.opts;
        const platform = this._platform;
        const nextDelay = this.lastCall + opts.delay - platform.performanceNow();
        if (nextDelay > 0) {
            const task = this.task;
            opts.delay = nextDelay;
            this.task = this._taskQueue.queueTask(() => {
                this.lastCall = platform.performanceNow();
                this.task = null;
                opts.delay = this.delay;
                callback();
            }, opts);
            task === null || task === void 0 ? void 0 : task.cancel();
        }
        else {
            this.lastCall = platform.performanceNow();
            callback();
        }
    }
    $bind(flags, scope) {
        if (this.firstArg !== null) {
            const delay = Number(this.firstArg.evaluate(flags, scope, this.locator, null));
            this.opts.delay = this.delay = isNaN(delay) ? defaultDelay : delay;
        }
        this.binding.$bind(flags, scope);
    }
    $unbind(flags) {
        var _a;
        (_a = this.task) === null || _a === void 0 ? void 0 : _a.cancel();
        this.task = null;
        super.$unbind(flags);
    }
}
bindingBehavior('throttle')(ThrottleBindingBehavior);

class DataAttributeAccessor {
    constructor() {
        this.type = 2 | 4;
    }
    getValue(obj, key) {
        return obj.getAttribute(key);
    }
    setValue(newValue, f, obj, key) {
        if (newValue == null) {
            obj.removeAttribute(key);
        }
        else {
            obj.setAttribute(key, newValue);
        }
    }
}
const attrAccessor = new DataAttributeAccessor();

class AttrBindingBehavior {
    bind(_flags, _scope, binding) {
        binding.targetObserver = attrAccessor;
    }
    unbind(_flags, _scope, _binding) {
        return;
    }
}
bindingBehavior('attr')(AttrBindingBehavior);

function handleSelfEvent(event) {
    const target = event.composedPath()[0];
    if (this.target !== target) {
        return;
    }
    return this.selfEventCallSource(event);
}
class SelfBindingBehavior {
    bind(flags, _scope, binding) {
        if (!binding.callSource || !binding.targetEvent) {
            throw new Error(`AUR0801: Self binding behavior only supports events.`);
        }
        binding.selfEventCallSource = binding.callSource;
        binding.callSource = handleSelfEvent;
    }
    unbind(flags, _scope, binding) {
        binding.callSource = binding.selfEventCallSource;
        binding.selfEventCallSource = null;
    }
}
bindingBehavior('self')(SelfBindingBehavior);

const nsMap = createLookup();
class AttributeNSAccessor {
    constructor(ns) {
        this.ns = ns;
        this.type = 2 | 4;
    }
    static forNs(ns) {
        var _a;
        return (_a = nsMap[ns]) !== null && _a !== void 0 ? _a : (nsMap[ns] = new AttributeNSAccessor(ns));
    }
    getValue(obj, propertyKey) {
        return obj.getAttributeNS(this.ns, propertyKey);
    }
    setValue(newValue, f, obj, key) {
        if (newValue == null) {
            obj.removeAttributeNS(this.ns, key);
        }
        else {
            obj.setAttributeNS(this.ns, key, newValue);
        }
    }
}

function defaultMatcher$1(a, b) {
    return a === b;
}
class CheckedObserver {
    constructor(obj, _key, handler, observerLocator) {
        this.handler = handler;
        this.type = 2 | 1 | 4;
        this._value = void 0;
        this._oldValue = void 0;
        this._collectionObserver = void 0;
        this._valueObserver = void 0;
        this.f = 0;
        this._obj = obj;
        this.oL = observerLocator;
    }
    getValue() {
        return this._value;
    }
    setValue(newValue, flags) {
        const currentValue = this._value;
        if (newValue === currentValue) {
            return;
        }
        this._value = newValue;
        this._oldValue = currentValue;
        this.f = flags;
        this._observe();
        this._synchronizeElement();
        this.queue.add(this);
    }
    handleCollectionChange(_indexMap, _flags) {
        this._synchronizeElement();
    }
    handleChange(_newValue, _previousValue, _flags) {
        this._synchronizeElement();
    }
    _synchronizeElement() {
        const currentValue = this._value;
        const obj = this._obj;
        const elementValue = hasOwnProperty.call(obj, 'model') ? obj.model : obj.value;
        const isRadio = obj.type === 'radio';
        const matcher = obj.matcher !== void 0 ? obj.matcher : defaultMatcher$1;
        if (isRadio) {
            obj.checked = !!matcher(currentValue, elementValue);
        }
        else if (currentValue === true) {
            obj.checked = true;
        }
        else {
            let hasMatch = false;
            if (currentValue instanceof Array) {
                hasMatch = currentValue.findIndex(item => !!matcher(item, elementValue)) !== -1;
            }
            else if (currentValue instanceof Set) {
                for (const v of currentValue) {
                    if (matcher(v, elementValue)) {
                        hasMatch = true;
                        break;
                    }
                }
            }
            else if (currentValue instanceof Map) {
                for (const pair of currentValue) {
                    const existingItem = pair[0];
                    const $isChecked = pair[1];
                    if (matcher(existingItem, elementValue) && $isChecked === true) {
                        hasMatch = true;
                        break;
                    }
                }
            }
            obj.checked = hasMatch;
        }
    }
    handleEvent() {
        let currentValue = this._oldValue = this._value;
        const obj = this._obj;
        const elementValue = hasOwnProperty.call(obj, 'model') ? obj.model : obj.value;
        const isChecked = obj.checked;
        const matcher = obj.matcher !== void 0 ? obj.matcher : defaultMatcher$1;
        if (obj.type === 'checkbox') {
            if (currentValue instanceof Array) {
                const index = currentValue.findIndex(item => !!matcher(item, elementValue));
                if (isChecked && index === -1) {
                    currentValue.push(elementValue);
                }
                else if (!isChecked && index !== -1) {
                    currentValue.splice(index, 1);
                }
                return;
            }
            else if (currentValue instanceof Set) {
                const unset = {};
                let existingItem = unset;
                for (const value of currentValue) {
                    if (matcher(value, elementValue) === true) {
                        existingItem = value;
                        break;
                    }
                }
                if (isChecked && existingItem === unset) {
                    currentValue.add(elementValue);
                }
                else if (!isChecked && existingItem !== unset) {
                    currentValue.delete(existingItem);
                }
                return;
            }
            else if (currentValue instanceof Map) {
                let existingItem;
                for (const pair of currentValue) {
                    const currItem = pair[0];
                    if (matcher(currItem, elementValue) === true) {
                        existingItem = currItem;
                        break;
                    }
                }
                currentValue.set(existingItem, isChecked);
                return;
            }
            currentValue = isChecked;
        }
        else if (isChecked) {
            currentValue = elementValue;
        }
        else {
            return;
        }
        this._value = currentValue;
        this.queue.add(this);
    }
    start() {
        this.handler.subscribe(this._obj, this);
        this._observe();
    }
    stop() {
        var _a, _b;
        this.handler.dispose();
        (_a = this._collectionObserver) === null || _a === void 0 ? void 0 : _a.unsubscribe(this);
        this._collectionObserver = void 0;
        (_b = this._valueObserver) === null || _b === void 0 ? void 0 : _b.unsubscribe(this);
    }
    subscribe(subscriber) {
        if (this.subs.add(subscriber) && this.subs.count === 1) {
            this.start();
        }
    }
    unsubscribe(subscriber) {
        if (this.subs.remove(subscriber) && this.subs.count === 0) {
            this.stop();
        }
    }
    flush() {
        oV$2 = this._oldValue;
        this._oldValue = this._value;
        this.subs.notify(this._value, oV$2, this.f);
    }
    _observe() {
        var _a, _b, _c, _d, _e, _f, _g;
        const obj = this._obj;
        (_e = ((_a = this._valueObserver) !== null && _a !== void 0 ? _a : (this._valueObserver = (_c = (_b = obj.$observers) === null || _b === void 0 ? void 0 : _b.model) !== null && _c !== void 0 ? _c : (_d = obj.$observers) === null || _d === void 0 ? void 0 : _d.value))) === null || _e === void 0 ? void 0 : _e.subscribe(this);
        (_f = this._collectionObserver) === null || _f === void 0 ? void 0 : _f.unsubscribe(this);
        this._collectionObserver = void 0;
        if (obj.type === 'checkbox') {
            (_g = (this._collectionObserver = getCollectionObserver(this._value, this.oL))) === null || _g === void 0 ? void 0 : _g.subscribe(this);
        }
    }
}
subscriberCollection(CheckedObserver);
withFlushQueue(CheckedObserver);
let oV$2 = void 0;

const childObserverOptions = {
    childList: true,
    subtree: true,
    characterData: true
};
function defaultMatcher(a, b) {
    return a === b;
}
class SelectValueObserver {
    constructor(obj, _key, handler, observerLocator) {
        this.type = 2 | 1 | 4;
        this._value = void 0;
        this._oldValue = void 0;
        this._hasChanges = false;
        this._arrayObserver = void 0;
        this._nodeObserver = void 0;
        this._observing = false;
        this._obj = obj;
        this._observerLocator = observerLocator;
        this.handler = handler;
    }
    getValue() {
        return this._observing
            ? this._value
            : this._obj.multiple
                ? getSelectedOptions(this._obj.options)
                : this._obj.value;
    }
    setValue(newValue, flags) {
        this._oldValue = this._value;
        this._value = newValue;
        this._hasChanges = newValue !== this._oldValue;
        this._observeArray(newValue instanceof Array ? newValue : null);
        if ((flags & 32) === 0) {
            this._flushChanges();
        }
    }
    _flushChanges() {
        if (this._hasChanges) {
            this._hasChanges = false;
            this.syncOptions();
        }
    }
    handleCollectionChange() {
        this.syncOptions();
    }
    syncOptions() {
        var _a;
        const value = this._value;
        const obj = this._obj;
        const isArray = Array.isArray(value);
        const matcher = (_a = obj.matcher) !== null && _a !== void 0 ? _a : defaultMatcher;
        const options = obj.options;
        let i = options.length;
        while (i-- > 0) {
            const option = options[i];
            const optionValue = hasOwnProperty.call(option, 'model') ? option.model : option.value;
            if (isArray) {
                option.selected = value.findIndex(item => !!matcher(optionValue, item)) !== -1;
                continue;
            }
            option.selected = !!matcher(optionValue, value);
        }
    }
    syncValue() {
        const obj = this._obj;
        const options = obj.options;
        const len = options.length;
        const currentValue = this._value;
        let i = 0;
        if (obj.multiple) {
            if (!(currentValue instanceof Array)) {
                return true;
            }
            let option;
            const matcher = obj.matcher || defaultMatcher;
            const values = [];
            while (i < len) {
                option = options[i];
                if (option.selected) {
                    values.push(hasOwnProperty.call(option, 'model')
                        ? option.model
                        : option.value);
                }
                ++i;
            }
            let a;
            i = 0;
            while (i < currentValue.length) {
                a = currentValue[i];
                if (values.findIndex(b => !!matcher(a, b)) === -1) {
                    currentValue.splice(i, 1);
                }
                else {
                    ++i;
                }
            }
            i = 0;
            while (i < values.length) {
                a = values[i];
                if (currentValue.findIndex(b => !!matcher(a, b)) === -1) {
                    currentValue.push(a);
                }
                ++i;
            }
            return false;
        }
        let value = null;
        let option;
        while (i < len) {
            option = options[i];
            if (option.selected) {
                value = hasOwnProperty.call(option, 'model')
                    ? option.model
                    : option.value;
                break;
            }
            ++i;
        }
        this._oldValue = this._value;
        this._value = value;
        return true;
    }
    _start() {
        (this._nodeObserver = new this._obj.ownerDocument.defaultView.MutationObserver(this._handleNodeChange.bind(this)))
            .observe(this._obj, childObserverOptions);
        this._observeArray(this._value instanceof Array ? this._value : null);
        this._observing = true;
    }
    _stop() {
        var _a;
        this._nodeObserver.disconnect();
        (_a = this._arrayObserver) === null || _a === void 0 ? void 0 : _a.unsubscribe(this);
        this._nodeObserver
            = this._arrayObserver
                = void 0;
        this._observing = false;
    }
    _observeArray(array) {
        var _a;
        (_a = this._arrayObserver) === null || _a === void 0 ? void 0 : _a.unsubscribe(this);
        this._arrayObserver = void 0;
        if (array != null) {
            if (!this._obj.multiple) {
                throw new Error(`AUR0654: Only null or Array instances can be bound to a multi-select.`);
            }
            (this._arrayObserver = this._observerLocator.getArrayObserver(array)).subscribe(this);
        }
    }
    handleEvent() {
        const shouldNotify = this.syncValue();
        if (shouldNotify) {
            this.queue.add(this);
        }
    }
    _handleNodeChange(_records) {
        this.syncOptions();
        const shouldNotify = this.syncValue();
        if (shouldNotify) {
            this.queue.add(this);
        }
    }
    subscribe(subscriber) {
        if (this.subs.add(subscriber) && this.subs.count === 1) {
            this.handler.subscribe(this._obj, this);
            this._start();
        }
    }
    unsubscribe(subscriber) {
        if (this.subs.remove(subscriber) && this.subs.count === 0) {
            this.handler.dispose();
            this._stop();
        }
    }
    flush() {
        oV$1 = this._oldValue;
        this._oldValue = this._value;
        this.subs.notify(this._value, oV$1, 0);
    }
}
subscriberCollection(SelectValueObserver);
withFlushQueue(SelectValueObserver);
function getSelectedOptions(options) {
    const selection = [];
    if (options.length === 0) {
        return selection;
    }
    const ii = options.length;
    let i = 0;
    let option;
    while (ii > i) {
        option = options[i];
        if (option.selected) {
            selection[selection.length] = hasOwnProperty.call(option, 'model') ? option.model : option.value;
        }
        ++i;
    }
    return selection;
}
let oV$1 = void 0;

const customPropertyPrefix = '--';
class StyleAttributeAccessor {
    constructor(obj) {
        this.obj = obj;
        this.type = 2 | 4;
        this.value = '';
        this._oldValue = '';
        this.styles = {};
        this.version = 0;
        this._hasChanges = false;
    }
    getValue() {
        return this.obj.style.cssText;
    }
    setValue(newValue, flags) {
        this.value = newValue;
        this._hasChanges = newValue !== this._oldValue;
        if ((flags & 32) === 0) {
            this._flushChanges();
        }
    }
    _getStyleTuplesFromString(currentValue) {
        const styleTuples = [];
        const urlRegexTester = /url\([^)]+$/;
        let offset = 0;
        let currentChunk = '';
        let nextSplit;
        let indexOfColon;
        let attribute;
        let value;
        while (offset < currentValue.length) {
            nextSplit = currentValue.indexOf(';', offset);
            if (nextSplit === -1) {
                nextSplit = currentValue.length;
            }
            currentChunk += currentValue.substring(offset, nextSplit);
            offset = nextSplit + 1;
            if (urlRegexTester.test(currentChunk)) {
                currentChunk += ';';
                continue;
            }
            indexOfColon = currentChunk.indexOf(':');
            attribute = currentChunk.substring(0, indexOfColon).trim();
            value = currentChunk.substring(indexOfColon + 1).trim();
            styleTuples.push([attribute, value]);
            currentChunk = '';
        }
        return styleTuples;
    }
    _getStyleTuplesFromObject(currentValue) {
        let value;
        let property;
        const styles = [];
        for (property in currentValue) {
            value = currentValue[property];
            if (value == null) {
                continue;
            }
            if (isString(value)) {
                if (property.startsWith(customPropertyPrefix)) {
                    styles.push([property, value]);
                    continue;
                }
                styles.push([kebabCase(property), value]);
                continue;
            }
            styles.push(...this._getStyleTuples(value));
        }
        return styles;
    }
    _getStyleTuplesFromArray(currentValue) {
        const len = currentValue.length;
        if (len > 0) {
            const styles = [];
            let i = 0;
            for (; len > i; ++i) {
                styles.push(...this._getStyleTuples(currentValue[i]));
            }
            return styles;
        }
        return emptyArray;
    }
    _getStyleTuples(currentValue) {
        if (isString(currentValue)) {
            return this._getStyleTuplesFromString(currentValue);
        }
        if (currentValue instanceof Array) {
            return this._getStyleTuplesFromArray(currentValue);
        }
        if (currentValue instanceof Object) {
            return this._getStyleTuplesFromObject(currentValue);
        }
        return emptyArray;
    }
    _flushChanges() {
        if (this._hasChanges) {
            this._hasChanges = false;
            const currentValue = this.value;
            const styles = this.styles;
            const styleTuples = this._getStyleTuples(currentValue);
            let style;
            let version = this.version;
            this._oldValue = currentValue;
            let tuple;
            let name;
            let value;
            let i = 0;
            const len = styleTuples.length;
            for (; i < len; ++i) {
                tuple = styleTuples[i];
                name = tuple[0];
                value = tuple[1];
                this.setProperty(name, value);
                styles[name] = version;
            }
            this.styles = styles;
            this.version += 1;
            if (version === 0) {
                return;
            }
            version -= 1;
            for (style in styles) {
                if (!hasOwnProperty.call(styles, style) || styles[style] !== version) {
                    continue;
                }
                this.obj.style.removeProperty(style);
            }
        }
    }
    setProperty(style, value) {
        let priority = '';
        if (value != null && isFunction(value.indexOf) && value.includes('!important')) {
            priority = 'important';
            value = value.replace('!important', '');
        }
        this.obj.style.setProperty(style, value, priority);
    }
    bind(_flags) {
        this.value = this._oldValue = this.obj.style.cssText;
    }
}

class ValueAttributeObserver {
    constructor(obj, key, handler) {
        this.handler = handler;
        this.type = 2 | 1 | 4;
        this._value = '';
        this._oldValue = '';
        this._hasChanges = false;
        this._obj = obj;
        this._key = key;
    }
    getValue() {
        return this._value;
    }
    setValue(newValue, flags) {
        if (Object.is(newValue, this._value)) {
            return;
        }
        this._oldValue = this._value;
        this._value = newValue;
        this._hasChanges = true;
        if (!this.handler.config.readonly && (flags & 32) === 0) {
            this._flushChanges(flags);
        }
    }
    _flushChanges(flags) {
        var _a;
        if (this._hasChanges) {
            this._hasChanges = false;
            this._obj[this._key] = (_a = this._value) !== null && _a !== void 0 ? _a : this.handler.config.default;
            if ((flags & 2) === 0) {
                this.queue.add(this);
            }
        }
    }
    handleEvent() {
        this._oldValue = this._value;
        this._value = this._obj[this._key];
        if (this._oldValue !== this._value) {
            this._hasChanges = false;
            this.queue.add(this);
        }
    }
    subscribe(subscriber) {
        if (this.subs.add(subscriber) && this.subs.count === 1) {
            this.handler.subscribe(this._obj, this);
            this._value = this._oldValue = this._obj[this._key];
        }
    }
    unsubscribe(subscriber) {
        if (this.subs.remove(subscriber) && this.subs.count === 0) {
            this.handler.dispose();
        }
    }
    flush() {
        oV = this._oldValue;
        this._oldValue = this._value;
        this.subs.notify(this._value, oV, 0);
    }
}
subscriberCollection(ValueAttributeObserver);
withFlushQueue(ValueAttributeObserver);
let oV = void 0;

const xlinkNS = 'http://www.w3.org/1999/xlink';
const xmlNS = 'http://www.w3.org/XML/1998/namespace';
const xmlnsNS = 'http://www.w3.org/2000/xmlns/';
const nsAttributes = Object.assign(createLookup(), {
    'xlink:actuate': ['actuate', xlinkNS],
    'xlink:arcrole': ['arcrole', xlinkNS],
    'xlink:href': ['href', xlinkNS],
    'xlink:role': ['role', xlinkNS],
    'xlink:show': ['show', xlinkNS],
    'xlink:title': ['title', xlinkNS],
    'xlink:type': ['type', xlinkNS],
    'xml:lang': ['lang', xmlNS],
    'xml:space': ['space', xmlNS],
    'xmlns': ['xmlns', xmlnsNS],
    'xmlns:xlink': ['xlink', xmlnsNS],
});
const elementPropertyAccessor = new PropertyAccessor();
elementPropertyAccessor.type = 2 | 4;
class NodeObserverConfig {
    constructor(config) {
        var _a;
        this.type = (_a = config.type) !== null && _a !== void 0 ? _a : ValueAttributeObserver;
        this.events = config.events;
        this.readonly = config.readonly;
        this.default = config.default;
    }
}
class NodeObserverLocator {
    constructor(locator, platform, dirtyChecker, svgAnalyzer) {
        this.locator = locator;
        this.platform = platform;
        this.dirtyChecker = dirtyChecker;
        this.svgAnalyzer = svgAnalyzer;
        this.allowDirtyCheck = true;
        this._events = createLookup();
        this._globalEvents = createLookup();
        this._overrides = createLookup();
        this._globalOverrides = createLookup();
        const inputEvents = ['change', 'input'];
        const inputEventsConfig = { events: inputEvents, default: '' };
        this.useConfig({
            INPUT: {
                value: inputEventsConfig,
                valueAsNumber: { events: inputEvents, default: 0 },
                checked: { type: CheckedObserver, events: inputEvents },
                files: { events: inputEvents, readonly: true },
            },
            SELECT: {
                value: { type: SelectValueObserver, events: ['change'], default: '' },
            },
            TEXTAREA: {
                value: inputEventsConfig,
            },
        });
        const contentEventsConfig = { events: ['change', 'input', 'blur', 'keyup', 'paste'], default: '' };
        const scrollEventsConfig = { events: ['scroll'], default: 0 };
        this.useConfigGlobal({
            scrollTop: scrollEventsConfig,
            scrollLeft: scrollEventsConfig,
            textContent: contentEventsConfig,
            innerHTML: contentEventsConfig,
        });
        this.overrideAccessorGlobal('css', 'style', 'class');
        this.overrideAccessor({
            INPUT: ['value', 'checked', 'model'],
            SELECT: ['value'],
            TEXTAREA: ['value'],
        });
    }
    static register(container) {
        aliasRegistration(INodeObserverLocator, NodeObserverLocator).register(container);
        singletonRegistration(INodeObserverLocator, NodeObserverLocator).register(container);
    }
    handles(obj, _key) {
        return obj instanceof this.platform.Node;
    }
    useConfig(nodeNameOrConfig, key, eventsConfig) {
        var _a, _b;
        const lookup = this._events;
        let existingMapping;
        if (isString(nodeNameOrConfig)) {
            existingMapping = (_a = lookup[nodeNameOrConfig]) !== null && _a !== void 0 ? _a : (lookup[nodeNameOrConfig] = createLookup());
            if (existingMapping[key] == null) {
                existingMapping[key] = new NodeObserverConfig(eventsConfig);
            }
            else {
                throwMappingExisted(nodeNameOrConfig, key);
            }
        }
        else {
            for (const nodeName in nodeNameOrConfig) {
                existingMapping = (_b = lookup[nodeName]) !== null && _b !== void 0 ? _b : (lookup[nodeName] = createLookup());
                const newMapping = nodeNameOrConfig[nodeName];
                for (key in newMapping) {
                    if (existingMapping[key] == null) {
                        existingMapping[key] = new NodeObserverConfig(newMapping[key]);
                    }
                    else {
                        throwMappingExisted(nodeName, key);
                    }
                }
            }
        }
    }
    useConfigGlobal(configOrKey, eventsConfig) {
        const lookup = this._globalEvents;
        if (typeof configOrKey === 'object') {
            for (const key in configOrKey) {
                if (lookup[key] == null) {
                    lookup[key] = new NodeObserverConfig(configOrKey[key]);
                }
                else {
                    throwMappingExisted('*', key);
                }
            }
        }
        else {
            if (lookup[configOrKey] == null) {
                lookup[configOrKey] = new NodeObserverConfig(eventsConfig);
            }
            else {
                throwMappingExisted('*', configOrKey);
            }
        }
    }
    getAccessor(obj, key, requestor) {
        var _a;
        if (key in this._globalOverrides || (key in ((_a = this._overrides[obj.tagName]) !== null && _a !== void 0 ? _a : emptyObject))) {
            return this.getObserver(obj, key, requestor);
        }
        switch (key) {
            case 'src':
            case 'href':
            case 'role':
                return attrAccessor;
            default: {
                const nsProps = nsAttributes[key];
                if (nsProps !== undefined) {
                    return AttributeNSAccessor.forNs(nsProps[1]);
                }
                if (isDataAttribute(obj, key, this.svgAnalyzer)) {
                    return attrAccessor;
                }
                return elementPropertyAccessor;
            }
        }
    }
    overrideAccessor(tagNameOrOverrides, key) {
        var _a, _b;
        var _c, _d;
        let existingTagOverride;
        if (isString(tagNameOrOverrides)) {
            existingTagOverride = (_a = (_c = this._overrides)[tagNameOrOverrides]) !== null && _a !== void 0 ? _a : (_c[tagNameOrOverrides] = createLookup());
            existingTagOverride[key] = true;
        }
        else {
            for (const tagName in tagNameOrOverrides) {
                for (const key of tagNameOrOverrides[tagName]) {
                    existingTagOverride = (_b = (_d = this._overrides)[tagName]) !== null && _b !== void 0 ? _b : (_d[tagName] = createLookup());
                    existingTagOverride[key] = true;
                }
            }
        }
    }
    overrideAccessorGlobal(...keys) {
        for (const key of keys) {
            this._globalOverrides[key] = true;
        }
    }
    getObserver(el, key, requestor) {
        var _a, _b;
        switch (key) {
            case 'class':
                return new ClassAttributeAccessor(el);
            case 'css':
            case 'style':
                return new StyleAttributeAccessor(el);
        }
        const eventsConfig = (_b = (_a = this._events[el.tagName]) === null || _a === void 0 ? void 0 : _a[key]) !== null && _b !== void 0 ? _b : this._globalEvents[key];
        if (eventsConfig != null) {
            return new eventsConfig.type(el, key, new EventSubscriber(eventsConfig), requestor, this.locator);
        }
        const nsProps = nsAttributes[key];
        if (nsProps !== undefined) {
            return AttributeNSAccessor.forNs(nsProps[1]);
        }
        if (isDataAttribute(el, key, this.svgAnalyzer)) {
            return attrAccessor;
        }
        if (key in el.constructor.prototype) {
            if (this.allowDirtyCheck) {
                return this.dirtyChecker.createProperty(el, key);
            }
            throw new Error(`AUR0652: Unable to observe property ${String(key)}. Register observation mapping with .useConfig().`);
        }
        else {
            return new SetterObserver(el, key);
        }
    }
}
NodeObserverLocator.inject = [IServiceLocator, IPlatform, IDirtyChecker, ISVGAnalyzer];
function getCollectionObserver(collection, observerLocator) {
    if (collection instanceof Array) {
        return observerLocator.getArrayObserver(collection);
    }
    if (collection instanceof Map) {
        return observerLocator.getMapObserver(collection);
    }
    if (collection instanceof Set) {
        return observerLocator.getSetObserver(collection);
    }
}
function throwMappingExisted(nodeName, key) {
    throw new Error(`AUR0653: Mapping for property ${String(key)} of <${nodeName} /> already exists`);
}

class UpdateTriggerBindingBehavior {
    constructor(observerLocator) {
        this.oL = observerLocator;
    }
    bind(flags, _scope, binding, ...events) {
        if (events.length === 0) {
            throw new Error(`AUR0802: The updateTrigger binding behavior requires at least one event name argument: eg <input value.bind="firstName & updateTrigger:'blur'">`);
        }
        if (binding.mode !== BindingMode.twoWay && binding.mode !== BindingMode.fromView) {
            throw new Error(`AUR0803: The updateTrigger binding behavior can only be applied to two-way/ from-view bindings.`);
        }
        const targetObserver = this.oL.getObserver(binding.target, binding.targetProperty);
        if (!targetObserver.handler) {
            throw new Error(`AUR0804: The updateTrigger binding behavior can only be applied to two-way/ from-view bindings on input/select elements.`);
        }
        binding.targetObserver = targetObserver;
        const originalHandler = targetObserver.handler;
        targetObserver.originalHandler = originalHandler;
        targetObserver.handler = new EventSubscriber(new NodeObserverConfig({
            default: originalHandler.config.default,
            events,
            readonly: originalHandler.config.readonly
        }));
    }
    unbind(flags, _scope, binding) {
        binding.targetObserver.handler.dispose();
        binding.targetObserver.handler = binding.targetObserver.originalHandler;
        binding.targetObserver.originalHandler = null;
    }
}
UpdateTriggerBindingBehavior.inject = [IObserverLocator];
bindingBehavior('updateTrigger')(UpdateTriggerBindingBehavior);

class Focus {
    constructor(_element, _platform) {
        this._element = _element;
        this._platform = _platform;
        this._needsApply = false;
    }
    binding() {
        this.valueChanged();
    }
    valueChanged() {
        if (this.$controller.isActive) {
            this._apply();
        }
        else {
            this._needsApply = true;
        }
    }
    attached() {
        if (this._needsApply) {
            this._needsApply = false;
            this._apply();
        }
        this._element.addEventListener('focus', this);
        this._element.addEventListener('blur', this);
    }
    afterDetachChildren() {
        const el = this._element;
        el.removeEventListener('focus', this);
        el.removeEventListener('blur', this);
    }
    handleEvent(e) {
        if (e.type === 'focus') {
            this.value = true;
        }
        else if (!this._isElFocused) {
            this.value = false;
        }
    }
    _apply() {
        const el = this._element;
        const isFocused = this._isElFocused;
        const shouldFocus = this.value;
        if (shouldFocus && !isFocused) {
            el.focus();
        }
        else if (!shouldFocus && isFocused) {
            el.blur();
        }
    }
    get _isElFocused() {
        return this._element === this._platform.document.activeElement;
    }
}
Focus.inject = [INode, IPlatform];
__decorate([
    bindable({ mode: BindingMode.twoWay })
], Focus.prototype, "value", void 0);
customAttribute('focus')(Focus);

let Show = class Show {
    constructor(el, p, instr) {
        this.el = el;
        this.p = p;
        this._isActive = false;
        this._task = null;
        this.$val = '';
        this.$prio = '';
        this.update = () => {
            this._task = null;
            if (Boolean(this.value) !== this._isToggled) {
                if (this._isToggled === this._base) {
                    this._isToggled = !this._base;
                    this.$val = this.el.style.getPropertyValue('display');
                    this.$prio = this.el.style.getPropertyPriority('display');
                    this.el.style.setProperty('display', 'none', 'important');
                }
                else {
                    this._isToggled = this._base;
                    this.el.style.setProperty('display', this.$val, this.$prio);
                    if (this.el.getAttribute('style') === '') {
                        this.el.removeAttribute('style');
                    }
                }
            }
        };
        this._isToggled = this._base = instr.alias !== 'hide';
    }
    binding() {
        this._isActive = true;
        this.update();
    }
    detaching() {
        var _a;
        this._isActive = false;
        (_a = this._task) === null || _a === void 0 ? void 0 : _a.cancel();
        this._task = null;
    }
    valueChanged() {
        if (this._isActive && this._task === null) {
            this._task = this.p.domWriteQueue.queueTask(this.update);
        }
    }
};
__decorate([
    bindable
], Show.prototype, "value", void 0);
Show = __decorate([
    __param(0, INode),
    __param(1, IPlatform),
    __param(2, IInstruction)
], Show);
alias('hide')(Show);
customAttribute('show')(Show);

class Portal {
    constructor(factory, originalLoc, p) {
        this.id = nextId('au$component');
        this.strict = false;
        this._platform = p;
        this._currentTarget = p.document.createElement('div');
        this.view = factory.create();
        setEffectiveParentNode(this.view.nodes, originalLoc);
    }
    attaching(initiator, parent, flags) {
        if (this.callbackContext == null) {
            this.callbackContext = this.$controller.scope.bindingContext;
        }
        const newTarget = this._currentTarget = this._resolveTarget();
        this.view.setHost(newTarget);
        return this._activating(initiator, newTarget, flags);
    }
    detaching(initiator, parent, flags) {
        return this._deactivating(initiator, this._currentTarget, flags);
    }
    targetChanged() {
        const { $controller } = this;
        if (!$controller.isActive) {
            return;
        }
        const oldTarget = this._currentTarget;
        const newTarget = this._currentTarget = this._resolveTarget();
        if (oldTarget === newTarget) {
            return;
        }
        this.view.setHost(newTarget);
        const ret = onResolve(this._deactivating(null, newTarget, $controller.flags), () => {
            return this._activating(null, newTarget, $controller.flags);
        });
        if (isPromise(ret)) {
            ret.catch(err => { throw err; });
        }
    }
    _activating(initiator, target, flags) {
        const { activating, callbackContext, view } = this;
        view.setHost(target);
        return onResolve(activating === null || activating === void 0 ? void 0 : activating.call(callbackContext, target, view), () => {
            return this._activate(initiator, target, flags);
        });
    }
    _activate(initiator, target, flags) {
        const { $controller, view } = this;
        if (initiator === null) {
            view.nodes.appendTo(target);
        }
        else {
            return onResolve(view.activate(initiator !== null && initiator !== void 0 ? initiator : view, $controller, flags, $controller.scope), () => {
                return this._activated(target);
            });
        }
        return this._activated(target);
    }
    _activated(target) {
        const { activated, callbackContext, view } = this;
        return activated === null || activated === void 0 ? void 0 : activated.call(callbackContext, target, view);
    }
    _deactivating(initiator, target, flags) {
        const { deactivating, callbackContext, view } = this;
        return onResolve(deactivating === null || deactivating === void 0 ? void 0 : deactivating.call(callbackContext, target, view), () => {
            return this._deactivate(initiator, target, flags);
        });
    }
    _deactivate(initiator, target, flags) {
        const { $controller, view } = this;
        if (initiator === null) {
            view.nodes.remove();
        }
        else {
            return onResolve(view.deactivate(initiator, $controller, flags), () => {
                return this._deactivated(target);
            });
        }
        return this._deactivated(target);
    }
    _deactivated(target) {
        const { deactivated, callbackContext, view } = this;
        return deactivated === null || deactivated === void 0 ? void 0 : deactivated.call(callbackContext, target, view);
    }
    _resolveTarget() {
        const p = this._platform;
        const $document = p.document;
        let target = this.target;
        let context = this.renderContext;
        if (target === '') {
            if (this.strict) {
                throw new Error(`AUR0811: Empty querySelector`);
            }
            return $document.body;
        }
        if (isString(target)) {
            let queryContext = $document;
            if (isString(context)) {
                context = $document.querySelector(context);
            }
            if (context instanceof p.Node) {
                queryContext = context;
            }
            target = queryContext.querySelector(target);
        }
        if (target instanceof p.Node) {
            return target;
        }
        if (target == null) {
            if (this.strict) {
                throw new Error(`AUR0812: Portal target not found`);
            }
            return $document.body;
        }
        return target;
    }
    dispose() {
        this.view.dispose();
        this.view = (void 0);
        this.callbackContext = null;
    }
    accept(visitor) {
        var _a;
        if (((_a = this.view) === null || _a === void 0 ? void 0 : _a.accept(visitor)) === true) {
            return true;
        }
    }
}
Portal.inject = [IViewFactory, IRenderLocation, IPlatform];
__decorate([
    bindable({ primary: true })
], Portal.prototype, "target", void 0);
__decorate([
    bindable({ callback: 'targetChanged' })
], Portal.prototype, "renderContext", void 0);
__decorate([
    bindable()
], Portal.prototype, "strict", void 0);
__decorate([
    bindable()
], Portal.prototype, "deactivating", void 0);
__decorate([
    bindable()
], Portal.prototype, "activating", void 0);
__decorate([
    bindable()
], Portal.prototype, "deactivated", void 0);
__decorate([
    bindable()
], Portal.prototype, "activated", void 0);
__decorate([
    bindable()
], Portal.prototype, "callbackContext", void 0);
templateController('portal')(Portal);

class If {
    constructor(ifFactory, location, work) {
        this.ifFactory = ifFactory;
        this.location = location;
        this.work = work;
        this.id = nextId('au$component');
        this.elseFactory = void 0;
        this.elseView = void 0;
        this.ifView = void 0;
        this.view = void 0;
        this.value = false;
        this.cache = true;
        this.pending = void 0;
        this._wantsDeactivate = false;
        this._swapId = 0;
    }
    attaching(initiator, parent, f) {
        let view;
        const ctrl = this.$controller;
        const swapId = this._swapId++;
        const isCurrent = () => !this._wantsDeactivate && this._swapId === swapId + 1;
        return onResolve(this.pending, () => {
            var _a;
            if (!isCurrent()) {
                return;
            }
            this.pending = void 0;
            if (this.value) {
                view = (this.view = this.ifView = this.cache && this.ifView != null
                    ? this.ifView
                    : this.ifFactory.create());
            }
            else {
                view = (this.view = this.elseView = this.cache && this.elseView != null
                    ? this.elseView
                    : (_a = this.elseFactory) === null || _a === void 0 ? void 0 : _a.create());
            }
            if (view == null) {
                return;
            }
            view.setLocation(this.location);
            this.pending = onResolve(view.activate(initiator, ctrl, f, ctrl.scope), () => {
                if (isCurrent()) {
                    this.pending = void 0;
                }
            });
        });
    }
    detaching(initiator, parent, flags) {
        this._wantsDeactivate = true;
        return onResolve(this.pending, () => {
            var _a;
            this._wantsDeactivate = false;
            this.pending = void 0;
            void ((_a = this.view) === null || _a === void 0 ? void 0 : _a.deactivate(initiator, this.$controller, flags));
        });
    }
    valueChanged(newValue, oldValue, f) {
        if (!this.$controller.isActive) {
            return;
        }
        newValue = !!newValue;
        oldValue = !!oldValue;
        if (newValue === oldValue) {
            return;
        }
        this.work.start();
        const currView = this.view;
        const ctrl = this.$controller;
        const swapId = this._swapId++;
        const isCurrent = () => !this._wantsDeactivate && this._swapId === swapId + 1;
        let view;
        return onResolve(onResolve(this.pending, () => this.pending = onResolve(currView === null || currView === void 0 ? void 0 : currView.deactivate(currView, ctrl, f), () => {
            var _a;
            if (!isCurrent()) {
                return;
            }
            if (newValue) {
                view = (this.view = this.ifView = this.cache && this.ifView != null
                    ? this.ifView
                    : this.ifFactory.create());
            }
            else {
                view = (this.view = this.elseView = this.cache && this.elseView != null
                    ? this.elseView
                    : (_a = this.elseFactory) === null || _a === void 0 ? void 0 : _a.create());
            }
            if (view == null) {
                return;
            }
            view.setLocation(this.location);
            return onResolve(view.activate(view, ctrl, f, ctrl.scope), () => {
                if (isCurrent()) {
                    this.pending = void 0;
                }
            });
        })), () => this.work.finish());
    }
    dispose() {
        var _a, _b;
        (_a = this.ifView) === null || _a === void 0 ? void 0 : _a.dispose();
        (_b = this.elseView) === null || _b === void 0 ? void 0 : _b.dispose();
        this.ifView
            = this.elseView
                = this.view
                    = void 0;
    }
    accept(visitor) {
        var _a;
        if (((_a = this.view) === null || _a === void 0 ? void 0 : _a.accept(visitor)) === true) {
            return true;
        }
    }
}
If.inject = [IViewFactory, IRenderLocation, IWorkTracker];
__decorate([
    bindable
], If.prototype, "value", void 0);
__decorate([
    bindable({
        set: v => v === '' || !!v && v !== 'false'
    })
], If.prototype, "cache", void 0);
templateController('if')(If);
class Else {
    constructor(factory) {
        this.factory = factory;
        this.id = nextId('au$component');
    }
    link(controller, _childController, _target, _instruction) {
        const children = controller.children;
        const ifBehavior = children[children.length - 1];
        if (ifBehavior instanceof If) {
            ifBehavior.elseFactory = this.factory;
        }
        else if (ifBehavior.viewModel instanceof If) {
            ifBehavior.viewModel.elseFactory = this.factory;
        }
        else {
            throw new Error(`AUR0810: Unsupported If behavior`);
        }
    }
}
Else.inject = [IViewFactory];
templateController({ name: 'else' })(Else);

function dispose(disposable) {
    disposable.dispose();
}
const wrappedExprs = [
    38963,
    36914,
];
class Repeat {
    constructor(_location, _parent, _factory) {
        this._location = _location;
        this._parent = _parent;
        this._factory = _factory;
        this.id = nextId('au$component');
        this.views = [];
        this.key = void 0;
        this._observer = void 0;
        this._observingInnerItems = false;
        this._reevaluating = false;
        this._innerItemsExpression = null;
        this._normalizedItems = void 0;
        this._hasDestructuredLocal = false;
    }
    binding(initiator, parent, flags) {
        const bindings = this._parent.bindings;
        const ii = bindings.length;
        let binding = (void 0);
        let forOf;
        let i = 0;
        for (; ii > i; ++i) {
            binding = bindings[i];
            if (binding.target === this && binding.targetProperty === 'items') {
                forOf = this.forOf = binding.sourceExpression;
                this._forOfBinding = binding;
                let expression = forOf.iterable;
                while (expression != null && wrappedExprs.includes(expression.$kind)) {
                    expression = expression.expression;
                    this._observingInnerItems = true;
                }
                this._innerItemsExpression = expression;
                break;
            }
        }
        this._refreshCollectionObserver(flags);
        const dec = forOf.declaration;
        if (!(this._hasDestructuredLocal = dec.$kind === 90138 || dec.$kind === 106523)) {
            this.local = dec.evaluate(flags, this.$controller.scope, binding.locator, null);
        }
    }
    attaching(initiator, parent, flags) {
        this._normalizeToArray(flags);
        return this._activateAllViews(initiator, flags);
    }
    detaching(initiator, parent, flags) {
        this._refreshCollectionObserver(flags);
        return this._deactivateAllViews(initiator, flags);
    }
    itemsChanged(flags) {
        const { $controller } = this;
        if (!$controller.isActive) {
            return;
        }
        flags |= $controller.flags;
        this._refreshCollectionObserver(flags);
        this._normalizeToArray(flags);
        const ret = onResolve(this._deactivateAllViews(null, flags), () => {
            return this._activateAllViews(null, flags);
        });
        if (isPromise(ret)) {
            ret.catch(rethrow);
        }
    }
    handleCollectionChange(indexMap, flags) {
        const { $controller } = this;
        if (!$controller.isActive) {
            return;
        }
        if (this._observingInnerItems) {
            if (this._reevaluating) {
                return;
            }
            this._reevaluating = true;
            this.items = this.forOf.iterable.evaluate(flags, $controller.scope, this._forOfBinding.locator, null);
            this._reevaluating = false;
            return;
        }
        flags |= $controller.flags;
        this._normalizeToArray(flags);
        if (indexMap === void 0) {
            const ret = onResolve(this._deactivateAllViews(null, flags), () => {
                return this._activateAllViews(null, flags);
            });
            if (isPromise(ret)) {
                ret.catch(rethrow);
            }
        }
        else {
            const oldLength = this.views.length;
            const $indexMap = applyMutationsToIndices(indexMap);
            if ($indexMap.deletedItems.length > 0) {
                $indexMap.deletedItems.sort(compareNumber);
                const ret = onResolve(this._deactivateAndRemoveViewsByKey($indexMap, flags), () => {
                    return this._createAndActivateAndSortViewsByKey(oldLength, $indexMap, flags);
                });
                if (isPromise(ret)) {
                    ret.catch(rethrow);
                }
            }
            else {
                this._createAndActivateAndSortViewsByKey(oldLength, $indexMap, flags);
            }
        }
    }
    _refreshCollectionObserver(flags) {
        var _a;
        const scope = this.$controller.scope;
        let innerItems = this._innerItems;
        let observingInnerItems = this._observingInnerItems;
        let newObserver;
        if (observingInnerItems) {
            innerItems = this._innerItems = (_a = this._innerItemsExpression.evaluate(flags, scope, this._forOfBinding.locator, null)) !== null && _a !== void 0 ? _a : null;
            observingInnerItems = this._observingInnerItems = !Object.is(this.items, innerItems);
        }
        const oldObserver = this._observer;
        if (this.$controller.isActive) {
            newObserver = this._observer = getCollectionObserver$1(observingInnerItems ? innerItems : this.items);
            if (oldObserver !== newObserver) {
                oldObserver === null || oldObserver === void 0 ? void 0 : oldObserver.unsubscribe(this);
                newObserver === null || newObserver === void 0 ? void 0 : newObserver.subscribe(this);
            }
        }
        else {
            oldObserver === null || oldObserver === void 0 ? void 0 : oldObserver.unsubscribe(this);
            this._observer = undefined;
        }
    }
    _normalizeToArray(flags) {
        const items = this.items;
        if (items instanceof Array) {
            this._normalizedItems = items;
            return;
        }
        const forOf = this.forOf;
        if (forOf === void 0) {
            return;
        }
        const normalizedItems = [];
        this.forOf.iterate(flags, items, (arr, index, item) => {
            normalizedItems[index] = item;
        });
        this._normalizedItems = normalizedItems;
    }
    _activateAllViews(initiator, flags) {
        let promises = void 0;
        let ret;
        let view;
        let viewScope;
        const { $controller, _factory: factory, local, _location: location, items } = this;
        const parentScope = $controller.scope;
        const forOf = this.forOf;
        const newLen = forOf.count(flags, items);
        const views = this.views = Array(newLen);
        forOf.iterate(flags, items, (arr, i, item) => {
            view = views[i] = factory.create().setLocation(location);
            view.nodes.unlink();
            if (this._hasDestructuredLocal) {
                forOf.declaration.assign(flags, viewScope = Scope.fromParent(parentScope, BindingContext.create()), this._forOfBinding.locator, item);
            }
            else {
                viewScope = Scope.fromParent(parentScope, BindingContext.create(local, item));
            }
            setContextualProperties(viewScope.overrideContext, i, newLen);
            ret = view.activate(initiator !== null && initiator !== void 0 ? initiator : view, $controller, flags, viewScope);
            if (isPromise(ret)) {
                (promises !== null && promises !== void 0 ? promises : (promises = [])).push(ret);
            }
        });
        if (promises !== void 0) {
            return promises.length === 1
                ? promises[0]
                : Promise.all(promises);
        }
    }
    _deactivateAllViews(initiator, flags) {
        let promises = void 0;
        let ret;
        let view;
        let i = 0;
        const { views, $controller } = this;
        const ii = views.length;
        for (; ii > i; ++i) {
            view = views[i];
            view.release();
            ret = view.deactivate(initiator !== null && initiator !== void 0 ? initiator : view, $controller, flags);
            if (isPromise(ret)) {
                (promises !== null && promises !== void 0 ? promises : (promises = [])).push(ret);
            }
        }
        if (promises !== void 0) {
            return (promises.length === 1
                ? promises[0]
                : Promise.all(promises));
        }
    }
    _deactivateAndRemoveViewsByKey(indexMap, flags) {
        let promises = void 0;
        let ret;
        let view;
        const { $controller, views } = this;
        const deleted = indexMap.deletedItems;
        const deletedLen = deleted.length;
        let i = 0;
        for (; deletedLen > i; ++i) {
            view = views[deleted[i]];
            view.release();
            ret = view.deactivate(view, $controller, flags);
            if (isPromise(ret)) {
                (promises !== null && promises !== void 0 ? promises : (promises = [])).push(ret);
            }
        }
        i = 0;
        let j = 0;
        for (; deletedLen > i; ++i) {
            j = deleted[i] - i;
            views.splice(j, 1);
        }
        if (promises !== void 0) {
            return promises.length === 1
                ? promises[0]
                : Promise.all(promises);
        }
    }
    _createAndActivateAndSortViewsByKey(oldLength, indexMap, flags) {
        var _a;
        let promises = void 0;
        let ret;
        let view;
        let viewScope;
        let i = 0;
        const { $controller, _factory: factory, local, _normalizedItems: normalizedItems, _location: location, views } = this;
        const mapLen = indexMap.length;
        for (; mapLen > i; ++i) {
            if (indexMap[i] === -2) {
                view = factory.create();
                views.splice(i, 0, view);
            }
        }
        if (views.length !== mapLen) {
            throw new Error(`AUR0814: viewsLen=${views.length}, mapLen=${mapLen}`);
        }
        const parentScope = $controller.scope;
        const newLen = indexMap.length;
        synchronizeIndices(views, indexMap);
        const seq = longestIncreasingSubsequence(indexMap);
        const seqLen = seq.length;
        let next;
        let j = seqLen - 1;
        i = newLen - 1;
        for (; i >= 0; --i) {
            view = views[i];
            next = views[i + 1];
            view.nodes.link((_a = next === null || next === void 0 ? void 0 : next.nodes) !== null && _a !== void 0 ? _a : location);
            if (indexMap[i] === -2) {
                if (this._hasDestructuredLocal) {
                    this.forOf.declaration.assign(flags, viewScope = Scope.fromParent(parentScope, BindingContext.create()), this._forOfBinding.locator, normalizedItems[i]);
                }
                else {
                    viewScope = Scope.fromParent(parentScope, BindingContext.create(local, normalizedItems[i]));
                }
                setContextualProperties(viewScope.overrideContext, i, newLen);
                view.setLocation(location);
                ret = view.activate(view, $controller, flags, viewScope);
                if (isPromise(ret)) {
                    (promises !== null && promises !== void 0 ? promises : (promises = [])).push(ret);
                }
            }
            else if (j < 0 || seqLen === 1 || i !== seq[j]) {
                setContextualProperties(view.scope.overrideContext, i, newLen);
                view.nodes.insertBefore(view.location);
            }
            else {
                if (oldLength !== newLen) {
                    setContextualProperties(view.scope.overrideContext, i, newLen);
                }
                --j;
            }
        }
        if (promises !== void 0) {
            return promises.length === 1
                ? promises[0]
                : Promise.all(promises);
        }
    }
    dispose() {
        this.views.forEach(dispose);
        this.views = (void 0);
    }
    accept(visitor) {
        const { views } = this;
        if (views !== void 0) {
            for (let i = 0, ii = views.length; i < ii; ++i) {
                if (views[i].accept(visitor) === true) {
                    return true;
                }
            }
        }
    }
}
Repeat.inject = [IRenderLocation, IController, IViewFactory];
__decorate([
    bindable
], Repeat.prototype, "items", void 0);
templateController('repeat')(Repeat);
let maxLen = 16;
let prevIndices = new Int32Array(maxLen);
let tailIndices = new Int32Array(maxLen);
function longestIncreasingSubsequence(indexMap) {
    const len = indexMap.length;
    if (len > maxLen) {
        maxLen = len;
        prevIndices = new Int32Array(len);
        tailIndices = new Int32Array(len);
    }
    let cursor = 0;
    let cur = 0;
    let prev = 0;
    let i = 0;
    let j = 0;
    let low = 0;
    let high = 0;
    let mid = 0;
    for (; i < len; i++) {
        cur = indexMap[i];
        if (cur !== -2) {
            j = prevIndices[cursor];
            prev = indexMap[j];
            if (prev !== -2 && prev < cur) {
                tailIndices[i] = j;
                prevIndices[++cursor] = i;
                continue;
            }
            low = 0;
            high = cursor;
            while (low < high) {
                mid = (low + high) >> 1;
                prev = indexMap[prevIndices[mid]];
                if (prev !== -2 && prev < cur) {
                    low = mid + 1;
                }
                else {
                    high = mid;
                }
            }
            prev = indexMap[prevIndices[low]];
            if (cur < prev || prev === -2) {
                if (low > 0) {
                    tailIndices[i] = prevIndices[low - 1];
                }
                prevIndices[low] = i;
            }
        }
    }
    i = ++cursor;
    const result = new Int32Array(i);
    cur = prevIndices[cursor - 1];
    while (cursor-- > 0) {
        result[cursor] = cur;
        cur = tailIndices[cur];
    }
    while (i-- > 0)
        prevIndices[i] = 0;
    return result;
}
function setContextualProperties(oc, index, length) {
    const isFirst = index === 0;
    const isLast = index === length - 1;
    const isEven = index % 2 === 0;
    oc.$index = index;
    oc.$first = isFirst;
    oc.$last = isLast;
    oc.$middle = !isFirst && !isLast;
    oc.$even = isEven;
    oc.$odd = !isEven;
    oc.$length = length;
}

class With {
    constructor(factory, location) {
        this.id = nextId('au$component');
        this.id = nextId('au$component');
        this.view = factory.create().setLocation(location);
    }
    valueChanged(newValue, _oldValue, _flags) {
        const $controller = this.$controller;
        const bindings = this.view.bindings;
        let scope;
        let i = 0, ii = 0;
        if ($controller.isActive && bindings != null) {
            scope = Scope.fromParent($controller.scope, newValue === void 0 ? {} : newValue);
            for (ii = bindings.length; ii > i; ++i) {
                bindings[i].$bind(2, scope);
            }
        }
    }
    attaching(initiator, parent, flags) {
        const { $controller, value } = this;
        const scope = Scope.fromParent($controller.scope, value === void 0 ? {} : value);
        return this.view.activate(initiator, $controller, flags, scope);
    }
    detaching(initiator, parent, flags) {
        return this.view.deactivate(initiator, this.$controller, flags);
    }
    dispose() {
        this.view.dispose();
        this.view = (void 0);
    }
    accept(visitor) {
        var _a;
        if (((_a = this.view) === null || _a === void 0 ? void 0 : _a.accept(visitor)) === true) {
            return true;
        }
    }
}
With.inject = [IViewFactory, IRenderLocation];
__decorate([
    bindable
], With.prototype, "value", void 0);
templateController('with')(With);

let Switch = class Switch {
    constructor(_factory, _location) {
        this._factory = _factory;
        this._location = _location;
        this.id = nextId('au$component');
        this.cases = [];
        this.activeCases = [];
        this.promise = void 0;
    }
    link(_controller, _childController, _target, _instruction) {
        this.view = this._factory.create(this.$controller).setLocation(this._location);
    }
    attaching(initiator, parent, flags) {
        const view = this.view;
        const $controller = this.$controller;
        this.queue(() => view.activate(initiator, $controller, flags, $controller.scope));
        this.queue(() => this.swap(initiator, flags, this.value));
        return this.promise;
    }
    detaching(initiator, parent, flags) {
        this.queue(() => {
            const view = this.view;
            return view.deactivate(initiator, this.$controller, flags);
        });
        return this.promise;
    }
    dispose() {
        var _a;
        (_a = this.view) === null || _a === void 0 ? void 0 : _a.dispose();
        this.view = (void 0);
    }
    valueChanged(_newValue, _oldValue, flags) {
        if (!this.$controller.isActive) {
            return;
        }
        this.queue(() => this.swap(null, flags, this.value));
    }
    caseChanged($case, flags) {
        this.queue(() => this._handleCaseChange($case, flags));
    }
    _handleCaseChange($case, flags) {
        const isMatch = $case.isMatch(this.value, flags);
        const activeCases = this.activeCases;
        const numActiveCases = activeCases.length;
        if (!isMatch) {
            if (numActiveCases > 0 && activeCases[0].id === $case.id) {
                return this._clearActiveCases(null, flags);
            }
            return;
        }
        if (numActiveCases > 0 && activeCases[0].id < $case.id) {
            return;
        }
        const newActiveCases = [];
        let fallThrough = $case.fallThrough;
        if (!fallThrough) {
            newActiveCases.push($case);
        }
        else {
            const cases = this.cases;
            const idx = cases.indexOf($case);
            for (let i = idx, ii = cases.length; i < ii && fallThrough; i++) {
                const c = cases[i];
                newActiveCases.push(c);
                fallThrough = c.fallThrough;
            }
        }
        return onResolve(this._clearActiveCases(null, flags, newActiveCases), () => {
            this.activeCases = newActiveCases;
            return this._activateCases(null, flags);
        });
    }
    swap(initiator, flags, value) {
        const newActiveCases = [];
        let fallThrough = false;
        for (const $case of this.cases) {
            if (fallThrough || $case.isMatch(value, flags)) {
                newActiveCases.push($case);
                fallThrough = $case.fallThrough;
            }
            if (newActiveCases.length > 0 && !fallThrough) {
                break;
            }
        }
        const defaultCase = this.defaultCase;
        if (newActiveCases.length === 0 && defaultCase !== void 0) {
            newActiveCases.push(defaultCase);
        }
        return onResolve(this.activeCases.length > 0
            ? this._clearActiveCases(initiator, flags, newActiveCases)
            : void 0, () => {
            this.activeCases = newActiveCases;
            if (newActiveCases.length === 0) {
                return;
            }
            return this._activateCases(initiator, flags);
        });
    }
    _activateCases(initiator, flags) {
        const controller = this.$controller;
        if (!controller.isActive) {
            return;
        }
        const cases = this.activeCases;
        const length = cases.length;
        if (length === 0) {
            return;
        }
        const scope = controller.scope;
        if (length === 1) {
            return cases[0].activate(initiator, flags, scope);
        }
        return resolveAll(...cases.map(($case) => $case.activate(initiator, flags, scope)));
    }
    _clearActiveCases(initiator, flags, newActiveCases = []) {
        const cases = this.activeCases;
        const numCases = cases.length;
        if (numCases === 0) {
            return;
        }
        if (numCases === 1) {
            const firstCase = cases[0];
            if (!newActiveCases.includes(firstCase)) {
                cases.length = 0;
                return firstCase.deactivate(initiator, flags);
            }
            return;
        }
        return onResolve(resolveAll(...cases.reduce((acc, $case) => {
            if (!newActiveCases.includes($case)) {
                acc.push($case.deactivate(initiator, flags));
            }
            return acc;
        }, [])), () => {
            cases.length = 0;
        });
    }
    queue(action) {
        const previousPromise = this.promise;
        let promise = void 0;
        promise = this.promise = onResolve(onResolve(previousPromise, action), () => {
            if (this.promise === promise) {
                this.promise = void 0;
            }
        });
    }
    accept(visitor) {
        if (this.$controller.accept(visitor) === true) {
            return true;
        }
        if (this.activeCases.some(x => x.accept(visitor))) {
            return true;
        }
    }
};
__decorate([
    bindable
], Switch.prototype, "value", void 0);
Switch = __decorate([
    templateController('switch'),
    __param(0, IViewFactory),
    __param(1, IRenderLocation)
], Switch);
let Case = class Case {
    constructor(_factory, _locator, _location, logger) {
        this._factory = _factory;
        this._locator = _locator;
        this._location = _location;
        this.id = nextId('au$component');
        this.fallThrough = false;
        this.view = void 0;
        this._debug = logger.config.level <= 1;
        this._logger = logger.scopeTo(`${this.constructor.name}-#${this.id}`);
    }
    link(controller, _childController, _target, _instruction) {
        const switchController = controller.parent;
        const $switch = switchController === null || switchController === void 0 ? void 0 : switchController.viewModel;
        if ($switch instanceof Switch) {
            this.$switch = $switch;
            this.linkToSwitch($switch);
        }
        else {
            throw new Error(`AUR0815: The parent switch not found; only "*[switch] > *[case|default-case]" relation is supported.`);
        }
    }
    detaching(initiator, parent, flags) {
        return this.deactivate(initiator, flags);
    }
    isMatch(value, flags) {
        this._logger.debug('isMatch()');
        const $value = this.value;
        if (Array.isArray($value)) {
            if (this._observer === void 0) {
                this._observer = this._observeCollection(flags, $value);
            }
            return $value.includes(value);
        }
        return $value === value;
    }
    valueChanged(newValue, _oldValue, flags) {
        var _a;
        if (Array.isArray(newValue)) {
            (_a = this._observer) === null || _a === void 0 ? void 0 : _a.unsubscribe(this);
            this._observer = this._observeCollection(flags, newValue);
        }
        else if (this._observer !== void 0) {
            this._observer.unsubscribe(this);
        }
        this.$switch.caseChanged(this, flags);
    }
    handleCollectionChange(_indexMap, flags) {
        this.$switch.caseChanged(this, flags);
    }
    activate(initiator, flags, scope) {
        let view = this.view;
        if (view === void 0) {
            view = this.view = this._factory.create().setLocation(this._location);
        }
        if (view.isActive) {
            return;
        }
        return view.activate(initiator !== null && initiator !== void 0 ? initiator : view, this.$controller, flags, scope);
    }
    deactivate(initiator, flags) {
        const view = this.view;
        if (view === void 0 || !view.isActive) {
            return;
        }
        return view.deactivate(initiator !== null && initiator !== void 0 ? initiator : view, this.$controller, flags);
    }
    dispose() {
        var _a, _b;
        (_a = this._observer) === null || _a === void 0 ? void 0 : _a.unsubscribe(this);
        (_b = this.view) === null || _b === void 0 ? void 0 : _b.dispose();
        this.view = (void 0);
    }
    linkToSwitch(auSwitch) {
        auSwitch.cases.push(this);
    }
    _observeCollection(flags, $value) {
        const observer = this._locator.getArrayObserver($value);
        observer.subscribe(this);
        return observer;
    }
    accept(visitor) {
        var _a;
        if (this.$controller.accept(visitor) === true) {
            return true;
        }
        return (_a = this.view) === null || _a === void 0 ? void 0 : _a.accept(visitor);
    }
};
Case.inject = [IViewFactory, IObserverLocator, IRenderLocation, ILogger];
__decorate([
    bindable
], Case.prototype, "value", void 0);
__decorate([
    bindable({
        set: v => {
            switch (v) {
                case 'true': return true;
                case 'false': return false;
                default: return !!v;
            }
        },
        mode: BindingMode.oneTime
    })
], Case.prototype, "fallThrough", void 0);
Case = __decorate([
    templateController('case')
], Case);
let DefaultCase = class DefaultCase extends Case {
    linkToSwitch($switch) {
        if ($switch.defaultCase !== void 0) {
            throw new Error(`AUR0816: Multiple 'default-case's are not allowed.`);
        }
        $switch.defaultCase = this;
    }
};
DefaultCase = __decorate([
    templateController('default-case')
], DefaultCase);

let PromiseTemplateController = class PromiseTemplateController {
    constructor(_factory, _location, _platform, logger) {
        this._factory = _factory;
        this._location = _location;
        this._platform = _platform;
        this.id = nextId('au$component');
        this.preSettledTask = null;
        this.postSettledTask = null;
        this.logger = logger.scopeTo('promise.resolve');
    }
    link(_controller, _childController, _target, _instruction) {
        this.view = this._factory.create(this.$controller).setLocation(this._location);
    }
    attaching(initiator, parent, flags) {
        const view = this.view;
        const $controller = this.$controller;
        return onResolve(view.activate(initiator, $controller, flags, this.viewScope = Scope.fromParent($controller.scope, {})), () => this.swap(initiator, flags));
    }
    valueChanged(_newValue, _oldValue, flags) {
        if (!this.$controller.isActive) {
            return;
        }
        this.swap(null, flags);
    }
    swap(initiator, flags) {
        var _a, _b;
        const value = this.value;
        if (!isPromise(value)) {
            this.logger.warn(`The value '${String(value)}' is not a promise. No change will be done.`);
            return;
        }
        const q = this._platform.domWriteQueue;
        const fulfilled = this.fulfilled;
        const rejected = this.rejected;
        const pending = this.pending;
        const s = this.viewScope;
        let preSettlePromise;
        const defaultQueuingOptions = { reusable: false };
        const $swap = () => {
            void resolveAll(preSettlePromise = (this.preSettledTask = q.queueTask(() => {
                return resolveAll(fulfilled === null || fulfilled === void 0 ? void 0 : fulfilled.deactivate(initiator, flags), rejected === null || rejected === void 0 ? void 0 : rejected.deactivate(initiator, flags), pending === null || pending === void 0 ? void 0 : pending.activate(initiator, flags, s));
            }, defaultQueuingOptions)).result.catch((err) => { if (!(err instanceof TaskAbortError))
                throw err; }), value
                .then((data) => {
                if (this.value !== value) {
                    return;
                }
                const fulfill = () => {
                    this.postSettlePromise = (this.postSettledTask = q.queueTask(() => resolveAll(pending === null || pending === void 0 ? void 0 : pending.deactivate(initiator, flags), rejected === null || rejected === void 0 ? void 0 : rejected.deactivate(initiator, flags), fulfilled === null || fulfilled === void 0 ? void 0 : fulfilled.activate(initiator, flags, s, data)), defaultQueuingOptions)).result;
                };
                if (this.preSettledTask.status === 1) {
                    void preSettlePromise.then(fulfill);
                }
                else {
                    this.preSettledTask.cancel();
                    fulfill();
                }
            }, (err) => {
                if (this.value !== value) {
                    return;
                }
                const reject = () => {
                    this.postSettlePromise = (this.postSettledTask = q.queueTask(() => resolveAll(pending === null || pending === void 0 ? void 0 : pending.deactivate(initiator, flags), fulfilled === null || fulfilled === void 0 ? void 0 : fulfilled.deactivate(initiator, flags), rejected === null || rejected === void 0 ? void 0 : rejected.activate(initiator, flags, s, err)), defaultQueuingOptions)).result;
                };
                if (this.preSettledTask.status === 1) {
                    void preSettlePromise.then(reject);
                }
                else {
                    this.preSettledTask.cancel();
                    reject();
                }
            }));
        };
        if (((_a = this.postSettledTask) === null || _a === void 0 ? void 0 : _a.status) === 1) {
            void this.postSettlePromise.then($swap);
        }
        else {
            (_b = this.postSettledTask) === null || _b === void 0 ? void 0 : _b.cancel();
            $swap();
        }
    }
    detaching(initiator, parent, flags) {
        var _a, _b;
        (_a = this.preSettledTask) === null || _a === void 0 ? void 0 : _a.cancel();
        (_b = this.postSettledTask) === null || _b === void 0 ? void 0 : _b.cancel();
        this.preSettledTask = this.postSettledTask = null;
        return this.view.deactivate(initiator, this.$controller, flags);
    }
    dispose() {
        var _a;
        (_a = this.view) === null || _a === void 0 ? void 0 : _a.dispose();
        this.view = (void 0);
    }
};
__decorate([
    bindable
], PromiseTemplateController.prototype, "value", void 0);
PromiseTemplateController = __decorate([
    templateController('promise'),
    __param(0, IViewFactory),
    __param(1, IRenderLocation),
    __param(2, IPlatform),
    __param(3, ILogger)
], PromiseTemplateController);
let PendingTemplateController = class PendingTemplateController {
    constructor(_factory, _location) {
        this._factory = _factory;
        this._location = _location;
        this.id = nextId('au$component');
        this.view = void 0;
    }
    link(controller, _childController, _target, _instruction) {
        getPromiseController(controller).pending = this;
    }
    activate(initiator, flags, scope) {
        let view = this.view;
        if (view === void 0) {
            view = this.view = this._factory.create().setLocation(this._location);
        }
        if (view.isActive) {
            return;
        }
        return view.activate(view, this.$controller, flags, scope);
    }
    deactivate(initiator, flags) {
        const view = this.view;
        if (view === void 0 || !view.isActive) {
            return;
        }
        return view.deactivate(view, this.$controller, flags);
    }
    detaching(initiator, parent, flags) {
        return this.deactivate(initiator, flags);
    }
    dispose() {
        var _a;
        (_a = this.view) === null || _a === void 0 ? void 0 : _a.dispose();
        this.view = (void 0);
    }
};
__decorate([
    bindable({ mode: BindingMode.toView })
], PendingTemplateController.prototype, "value", void 0);
PendingTemplateController = __decorate([
    templateController('pending'),
    __param(0, IViewFactory),
    __param(1, IRenderLocation)
], PendingTemplateController);
let FulfilledTemplateController = class FulfilledTemplateController {
    constructor(_factory, _location) {
        this._factory = _factory;
        this._location = _location;
        this.id = nextId('au$component');
        this.view = void 0;
    }
    link(controller, _childController, _target, _instruction) {
        getPromiseController(controller).fulfilled = this;
    }
    activate(initiator, flags, scope, resolvedValue) {
        this.value = resolvedValue;
        let view = this.view;
        if (view === void 0) {
            view = this.view = this._factory.create().setLocation(this._location);
        }
        if (view.isActive) {
            return;
        }
        return view.activate(view, this.$controller, flags, scope);
    }
    deactivate(initiator, flags) {
        const view = this.view;
        if (view === void 0 || !view.isActive) {
            return;
        }
        return view.deactivate(view, this.$controller, flags);
    }
    detaching(initiator, parent, flags) {
        return this.deactivate(initiator, flags);
    }
    dispose() {
        var _a;
        (_a = this.view) === null || _a === void 0 ? void 0 : _a.dispose();
        this.view = (void 0);
    }
};
__decorate([
    bindable({ mode: BindingMode.fromView })
], FulfilledTemplateController.prototype, "value", void 0);
FulfilledTemplateController = __decorate([
    templateController('then'),
    __param(0, IViewFactory),
    __param(1, IRenderLocation)
], FulfilledTemplateController);
let RejectedTemplateController = class RejectedTemplateController {
    constructor(_factory, _location) {
        this._factory = _factory;
        this._location = _location;
        this.id = nextId('au$component');
        this.view = void 0;
    }
    link(controller, _childController, _target, _instruction) {
        getPromiseController(controller).rejected = this;
    }
    activate(initiator, flags, scope, error) {
        this.value = error;
        let view = this.view;
        if (view === void 0) {
            view = this.view = this._factory.create().setLocation(this._location);
        }
        if (view.isActive) {
            return;
        }
        return view.activate(view, this.$controller, flags, scope);
    }
    deactivate(initiator, flags) {
        const view = this.view;
        if (view === void 0 || !view.isActive) {
            return;
        }
        return view.deactivate(view, this.$controller, flags);
    }
    detaching(initiator, parent, flags) {
        return this.deactivate(initiator, flags);
    }
    dispose() {
        var _a;
        (_a = this.view) === null || _a === void 0 ? void 0 : _a.dispose();
        this.view = (void 0);
    }
};
__decorate([
    bindable({ mode: BindingMode.fromView })
], RejectedTemplateController.prototype, "value", void 0);
RejectedTemplateController = __decorate([
    templateController('catch'),
    __param(0, IViewFactory),
    __param(1, IRenderLocation)
], RejectedTemplateController);
function getPromiseController(controller) {
    const promiseController = controller.parent;
    const $promise = promiseController === null || promiseController === void 0 ? void 0 : promiseController.viewModel;
    if ($promise instanceof PromiseTemplateController) {
        return $promise;
    }
    throw new Error(`AUR0813: The parent promise.resolve not found; only "*[promise.resolve] > *[pending|then|catch]" relation is supported.`);
}
let PromiseAttributePattern = class PromiseAttributePattern {
    'promise.resolve'(name, value, _parts) {
        return new AttrSyntax(name, value, 'promise', 'bind');
    }
};
PromiseAttributePattern = __decorate([
    attributePattern({ pattern: 'promise.resolve', symbols: '' })
], PromiseAttributePattern);
let FulfilledAttributePattern = class FulfilledAttributePattern {
    'then'(name, value, _parts) {
        return new AttrSyntax(name, value, 'then', 'from-view');
    }
};
FulfilledAttributePattern = __decorate([
    attributePattern({ pattern: 'then', symbols: '' })
], FulfilledAttributePattern);
let RejectedAttributePattern = class RejectedAttributePattern {
    'catch'(name, value, _parts) {
        return new AttrSyntax(name, value, 'catch', 'from-view');
    }
};
RejectedAttributePattern = __decorate([
    attributePattern({ pattern: 'catch', symbols: '' })
], RejectedAttributePattern);

function createElement(p, tagOrType, props, children) {
    if (isString(tagOrType)) {
        return createElementForTag(p, tagOrType, props, children);
    }
    if (isElementType(tagOrType)) {
        return createElementForType(p, tagOrType, props, children);
    }
    throw new Error(`Invalid Tag or Type.`);
}
class RenderPlan {
    constructor(node, instructions, _dependencies) {
        this.node = node;
        this.instructions = instructions;
        this._dependencies = _dependencies;
        this._lazyDef = void 0;
    }
    get definition() {
        if (this._lazyDef === void 0) {
            this._lazyDef = CustomElementDefinition.create({
                name: generateElementName(),
                template: this.node,
                needsCompile: isString(this.node),
                instructions: this.instructions,
                dependencies: this._dependencies,
            });
        }
        return this._lazyDef;
    }
    createView(parentContainer) {
        return this.getViewFactory(parentContainer).create();
    }
    getViewFactory(parentContainer) {
        return parentContainer.root.get(IRendering).getViewFactory(this.definition, parentContainer.createChild().register(...this._dependencies));
    }
    mergeInto(parent, instructions, dependencies) {
        parent.appendChild(this.node);
        instructions.push(...this.instructions);
        dependencies.push(...this._dependencies);
    }
}
function createElementForTag(p, tagName, props, children) {
    const instructions = [];
    const allInstructions = [];
    const dependencies = [];
    const element = p.document.createElement(tagName);
    let hasInstructions = false;
    if (props) {
        Object.keys(props)
            .forEach(to => {
            const value = props[to];
            if (isInstruction(value)) {
                hasInstructions = true;
                instructions.push(value);
            }
            else {
                element.setAttribute(to, value);
            }
        });
    }
    if (hasInstructions) {
        element.className = 'au';
        allInstructions.push(instructions);
    }
    if (children) {
        addChildren(p, element, children, allInstructions, dependencies);
    }
    return new RenderPlan(element, allInstructions, dependencies);
}
function createElementForType(p, Type, props, children) {
    const definition = getElementDefinition(Type);
    const instructions = [];
    const allInstructions = [instructions];
    const dependencies = [];
    const childInstructions = [];
    const bindables = definition.bindables;
    const element = p.document.createElement(definition.name);
    element.className = 'au';
    if (!dependencies.includes(Type)) {
        dependencies.push(Type);
    }
    instructions.push(new HydrateElementInstruction(definition, void 0, childInstructions, null, false, void 0));
    if (props) {
        Object.keys(props)
            .forEach(to => {
            const value = props[to];
            if (isInstruction(value)) {
                childInstructions.push(value);
            }
            else {
                if (bindables[to] === void 0) {
                    childInstructions.push(new SetAttributeInstruction(value, to));
                }
                else {
                    childInstructions.push(new SetPropertyInstruction(value, to));
                }
            }
        });
    }
    if (children) {
        addChildren(p, element, children, allInstructions, dependencies);
    }
    return new RenderPlan(element, allInstructions, dependencies);
}
function addChildren(p, parent, children, allInstructions, dependencies) {
    for (let i = 0, ii = children.length; i < ii; ++i) {
        const current = children[i];
        switch (typeof current) {
            case 'string':
                parent.appendChild(p.document.createTextNode(current));
                break;
            case 'object':
                if (current instanceof p.Node) {
                    parent.appendChild(current);
                }
                else if ('mergeInto' in current) {
                    current.mergeInto(parent, allInstructions, dependencies);
                }
        }
    }
}

function toLookup(acc, item) {
    const to = item.to;
    if (to !== void 0 && to !== 'subject' && to !== 'composing') {
        acc[to] = item;
    }
    return acc;
}
class AuRender {
    constructor(_platform, _instruction, _hdrContext, _rendering) {
        this._platform = _platform;
        this._instruction = _instruction;
        this._hdrContext = _hdrContext;
        this._rendering = _rendering;
        this.id = nextId('au$component');
        this.component = void 0;
        this.composing = false;
        this.view = void 0;
        this._lastSubject = void 0;
        this._properties = _instruction.props.reduce(toLookup, {});
    }
    attaching(initiator, parent, flags) {
        const { component, view } = this;
        if (view === void 0 || this._lastSubject !== component) {
            this._lastSubject = component;
            this.composing = true;
            return this.compose(void 0, component, initiator, flags);
        }
        return this.compose(view, component, initiator, flags);
    }
    detaching(initiator, parent, flags) {
        return this._deactivate(this.view, initiator, flags);
    }
    componentChanged(newValue, previousValue, flags) {
        const { $controller } = this;
        if (!$controller.isActive) {
            return;
        }
        if (this._lastSubject === newValue) {
            return;
        }
        this._lastSubject = newValue;
        this.composing = true;
        flags |= $controller.flags;
        const ret = onResolve(this._deactivate(this.view, null, flags), () => {
            return this.compose(void 0, newValue, null, flags);
        });
        if (isPromise(ret)) {
            ret.catch(err => { throw err; });
        }
    }
    compose(view, subject, initiator, flags) {
        return onResolve(view === void 0
            ? onResolve(subject, resolvedSubject => this._resolveView(resolvedSubject, flags))
            : view, resolvedView => this._activate(this.view = resolvedView, initiator, flags));
    }
    _deactivate(view, initiator, flags) {
        return view === null || view === void 0 ? void 0 : view.deactivate(initiator !== null && initiator !== void 0 ? initiator : view, this.$controller, flags);
    }
    _activate(view, initiator, flags) {
        const { $controller } = this;
        return onResolve(view === null || view === void 0 ? void 0 : view.activate(initiator !== null && initiator !== void 0 ? initiator : view, $controller, flags, $controller.scope), () => {
            this.composing = false;
        });
    }
    _resolveView(subject, flags) {
        const view = this._provideViewFor(subject, flags);
        if (view) {
            view.setLocation(this.$controller.location);
            view.lockScope(this.$controller.scope);
            return view;
        }
        return void 0;
    }
    _provideViewFor(comp, _flags) {
        if (comp == null) {
            return void 0;
        }
        const ctxContainer = this._hdrContext.controller.container;
        if (typeof comp === 'object') {
            if (isController(comp)) {
                return comp;
            }
            if ('createView' in comp) {
                return comp.createView(ctxContainer);
            }
            if ('create' in comp) {
                return comp.create();
            }
            if ('template' in comp) {
                return this._rendering.getViewFactory(CustomElementDefinition.getOrCreate(comp), ctxContainer).create();
            }
        }
        if (isString(comp)) {
            const def = ctxContainer.find(CustomElement, comp);
            if (def == null) {
                throw new Error(`AUR0809: Unable to find custom element ${comp} for <au-render>.`);
            }
            comp = def.Type;
        }
        return createElement(this._platform, comp, this._properties, this.$controller.host.childNodes).createView(ctxContainer);
    }
    dispose() {
        var _a;
        (_a = this.view) === null || _a === void 0 ? void 0 : _a.dispose();
        this.view = (void 0);
    }
    accept(visitor) {
        var _a;
        if (((_a = this.view) === null || _a === void 0 ? void 0 : _a.accept(visitor)) === true) {
            return true;
        }
    }
}
AuRender.inject = [IPlatform, IInstruction, IHydrationContext, IRendering];
__decorate([
    bindable
], AuRender.prototype, "component", void 0);
__decorate([
    bindable({ mode: BindingMode.fromView })
], AuRender.prototype, "composing", void 0);
customElement({ name: 'au-render', template: null, containerless: true, capture: true })(AuRender);
function isController(subject) {
    return 'lockScope' in subject;
}

class AuCompose {
    constructor(_container, parent, host, _location, _platform, instruction, contextFactory) {
        this._container = _container;
        this.parent = parent;
        this.host = host;
        this._location = _location;
        this._platform = _platform;
        this.scopeBehavior = 'auto';
        this._composition = void 0;
        this._rendering = _container.get(IRendering);
        this._instruction = instruction;
        this._contextFactory = contextFactory;
    }
    static get inject() {
        return [IContainer, IController, INode, IRenderLocation, IPlatform, IInstruction, transient(CompositionContextFactory)];
    }
    get pending() {
        return this._pending;
    }
    get composition() {
        return this._composition;
    }
    attaching(initiator, _parent, _flags) {
        return this._pending = onResolve(this.queue(new ChangeInfo(this.view, this.viewModel, this.model, void 0), initiator), (context) => {
            if (this._contextFactory.isCurrent(context)) {
                this._pending = void 0;
            }
        });
    }
    detaching(initiator) {
        const cmpstn = this._composition;
        const pending = this._pending;
        this._contextFactory.invalidate();
        this._composition = this._pending = void 0;
        return onResolve(pending, () => cmpstn === null || cmpstn === void 0 ? void 0 : cmpstn.deactivate(initiator));
    }
    propertyChanged(name) {
        if (name === 'model' && this._composition != null) {
            this._composition.update(this.model);
            return;
        }
        this._pending = onResolve(this._pending, () => onResolve(this.queue(new ChangeInfo(this.view, this.viewModel, this.model, name), void 0), (context) => {
            if (this._contextFactory.isCurrent(context)) {
                this._pending = void 0;
            }
        }));
    }
    queue(change, initiator) {
        const factory = this._contextFactory;
        const compositionCtrl = this._composition;
        return onResolve(factory.create(change), context => {
            if (factory.isCurrent(context)) {
                return onResolve(this.compose(context), (result) => {
                    if (factory.isCurrent(context)) {
                        return onResolve(result.activate(initiator), () => {
                            if (factory.isCurrent(context)) {
                                this._composition = result;
                                return onResolve(compositionCtrl === null || compositionCtrl === void 0 ? void 0 : compositionCtrl.deactivate(initiator), () => context);
                            }
                            else {
                                return onResolve(result.controller.deactivate(result.controller, this.$controller, 4), () => {
                                    result.controller.dispose();
                                    return context;
                                });
                            }
                        });
                    }
                    result.controller.dispose();
                    return context;
                });
            }
            return context;
        });
    }
    compose(context) {
        let comp;
        let compositionHost;
        let removeCompositionHost;
        const { view, viewModel, model } = context.change;
        const { _container: container, host, $controller, _location: loc } = this;
        const vmDef = this.getDef(viewModel);
        const childCtn = container.createChild();
        const parentNode = loc == null ? host.parentNode : loc.parentNode;
        if (vmDef !== null) {
            if (vmDef.containerless) {
                throw new Error(`AUR0806: Containerless custom element is not supported by <au-compose/>`);
            }
            if (loc == null) {
                compositionHost = host;
                removeCompositionHost = () => {
                };
            }
            else {
                compositionHost = parentNode.insertBefore(this._platform.document.createElement(vmDef.name), loc);
                removeCompositionHost = () => {
                    compositionHost.remove();
                };
            }
            comp = this.getVm(childCtn, viewModel, compositionHost);
        }
        else {
            compositionHost = loc == null
                ? host
                : loc;
            comp = this.getVm(childCtn, viewModel, compositionHost);
        }
        const compose = () => {
            if (vmDef !== null) {
                const controller = Controller.$el(childCtn, comp, compositionHost, { projections: this._instruction.projections }, vmDef);
                return new CompositionController(controller, (attachInitiator) => controller.activate(attachInitiator !== null && attachInitiator !== void 0 ? attachInitiator : controller, $controller, 2, $controller.scope.parentScope), (deactachInitiator) => onResolve(controller.deactivate(deactachInitiator !== null && deactachInitiator !== void 0 ? deactachInitiator : controller, $controller, 4), removeCompositionHost), (model) => { var _a; return (_a = comp.activate) === null || _a === void 0 ? void 0 : _a.call(comp, model); }, context);
            }
            else {
                const targetDef = CustomElementDefinition.create({
                    name: CustomElement.generateName(),
                    template: view,
                });
                const viewFactory = this._rendering.getViewFactory(targetDef, childCtn);
                const controller = Controller.$view(viewFactory, $controller);
                const scope = this.scopeBehavior === 'auto'
                    ? Scope.fromParent(this.parent.scope, comp)
                    : Scope.create(comp);
                if (isRenderLocation(compositionHost)) {
                    controller.setLocation(compositionHost);
                }
                else {
                    controller.setHost(compositionHost);
                }
                return new CompositionController(controller, (attachInitiator) => controller.activate(attachInitiator !== null && attachInitiator !== void 0 ? attachInitiator : controller, $controller, 2, scope), (detachInitiator) => controller.deactivate(detachInitiator !== null && detachInitiator !== void 0 ? detachInitiator : controller, $controller, 4), (model) => { var _a; return (_a = comp.activate) === null || _a === void 0 ? void 0 : _a.call(comp, model); }, context);
            }
        };
        if ('activate' in comp) {
            return onResolve(comp.activate(model), () => compose());
        }
        else {
            return compose();
        }
    }
    getVm(container, comp, host) {
        if (comp == null) {
            return new EmptyComponent$1();
        }
        if (typeof comp === 'object') {
            return comp;
        }
        const p = this._platform;
        const isLocation = isRenderLocation(host);
        container.registerResolver(p.Element, container.registerResolver(INode, new InstanceProvider('ElementResolver', isLocation ? null : host)));
        container.registerResolver(IRenderLocation, new InstanceProvider('IRenderLocation', isLocation ? host : null));
        const instance = container.invoke(comp);
        container.registerResolver(comp, new InstanceProvider('au-compose.viewModel', instance));
        return instance;
    }
    getDef(component) {
        const Ctor = (isFunction(component)
            ? component
            : component === null || component === void 0 ? void 0 : component.constructor);
        return CustomElement.isType(Ctor)
            ? CustomElement.getDefinition(Ctor)
            : null;
    }
}
__decorate([
    bindable
], AuCompose.prototype, "view", void 0);
__decorate([
    bindable
], AuCompose.prototype, "viewModel", void 0);
__decorate([
    bindable
], AuCompose.prototype, "model", void 0);
__decorate([
    bindable({
        set: v => {
            if (v === 'scoped' || v === 'auto') {
                return v;
            }
            throw new Error(`AUR0805: Invalid scope behavior config. Only "scoped" or "auto" allowed.`);
        }
    })
], AuCompose.prototype, "scopeBehavior", void 0);
customElement('au-compose')(AuCompose);
class EmptyComponent$1 {
}
class CompositionContextFactory {
    constructor() {
        this.id = 0;
    }
    isCurrent(context) {
        return context.id === this.id;
    }
    create(changes) {
        return onResolve(changes.load(), (loaded) => new CompositionContext(++this.id, loaded));
    }
    invalidate() {
        this.id++;
    }
}
class ChangeInfo {
    constructor(view, viewModel, model, src) {
        this.view = view;
        this.viewModel = viewModel;
        this.model = model;
        this.src = src;
    }
    load() {
        if (isPromise(this.view) || isPromise(this.viewModel)) {
            return Promise
                .all([this.view, this.viewModel])
                .then(([view, viewModel]) => {
                return new LoadedChangeInfo(view, viewModel, this.model, this.src);
            });
        }
        else {
            return new LoadedChangeInfo(this.view, this.viewModel, this.model, this.src);
        }
    }
}
class LoadedChangeInfo {
    constructor(view, viewModel, model, src) {
        this.view = view;
        this.viewModel = viewModel;
        this.model = model;
        this.src = src;
    }
}
class CompositionContext {
    constructor(id, change) {
        this.id = id;
        this.change = change;
    }
}
class CompositionController {
    constructor(controller, start, stop, update, context) {
        this.controller = controller;
        this.start = start;
        this.stop = stop;
        this.update = update;
        this.context = context;
        this.state = 0;
    }
    activate(initiator) {
        if (this.state !== 0) {
            throw new Error(`AUR0807: Composition has already been activated/deactivated. Id: ${this.controller.name}`);
        }
        this.state = 1;
        return this.start(initiator);
    }
    deactivate(detachInitator) {
        switch (this.state) {
            case 1:
                this.state = -1;
                return this.stop(detachInitator);
            case -1:
                throw new Error(`AUR0808: Composition has already been deactivated.`);
            default:
                this.state = -1;
        }
    }
}

class AuSlot {
    constructor(location, instruction, hdrContext, rendering) {
        var _a, _b;
        this._parentScope = null;
        this._outerScope = null;
        let factory;
        const slotInfo = instruction.auSlot;
        const projection = (_b = (_a = hdrContext.instruction) === null || _a === void 0 ? void 0 : _a.projections) === null || _b === void 0 ? void 0 : _b[slotInfo.name];
        if (projection == null) {
            factory = rendering.getViewFactory(slotInfo.fallback, hdrContext.controller.container);
            this._hasProjection = false;
        }
        else {
            factory = rendering.getViewFactory(projection, hdrContext.parent.controller.container);
            this._hasProjection = true;
        }
        this._hdrContext = hdrContext;
        this.view = factory.create().setLocation(location);
    }
    static get inject() { return [IRenderLocation, IInstruction, IHydrationContext, IRendering]; }
    binding(_initiator, _parent, _flags) {
        var _a;
        this._parentScope = this.$controller.scope.parentScope;
        let outerScope;
        if (this._hasProjection) {
            outerScope = this._hdrContext.controller.scope.parentScope;
            (this._outerScope = Scope.fromParent(outerScope, outerScope.bindingContext))
                .overrideContext.$host = (_a = this.expose) !== null && _a !== void 0 ? _a : this._parentScope.bindingContext;
        }
    }
    attaching(initiator, parent, flags) {
        return this.view.activate(initiator, this.$controller, flags, this._hasProjection ? this._outerScope : this._parentScope);
    }
    detaching(initiator, parent, flags) {
        return this.view.deactivate(initiator, this.$controller, flags);
    }
    exposeChanged(v) {
        if (this._hasProjection && this._outerScope != null) {
            this._outerScope.overrideContext.$host = v;
        }
    }
    dispose() {
        this.view.dispose();
        this.view = (void 0);
    }
    accept(visitor) {
        var _a;
        if (((_a = this.view) === null || _a === void 0 ? void 0 : _a.accept(visitor)) === true) {
            return true;
        }
    }
}
__decorate([
    bindable
], AuSlot.prototype, "expose", void 0);
customElement({ name: 'au-slot', template: null, containerless: true })(AuSlot);

const ISanitizer = DI.createInterface('ISanitizer', x => x.singleton(class {
    sanitize() {
        throw new Error('"sanitize" method not implemented');
    }
}));
let SanitizeValueConverter = class SanitizeValueConverter {
    constructor(_sanitizer) {
        this._sanitizer = _sanitizer;
    }
    toView(untrustedMarkup) {
        if (untrustedMarkup == null) {
            return null;
        }
        return this._sanitizer.sanitize(untrustedMarkup);
    }
};
SanitizeValueConverter = __decorate([
    __param(0, ISanitizer)
], SanitizeValueConverter);
valueConverter('sanitize')(SanitizeValueConverter);

let ViewValueConverter = class ViewValueConverter {
    constructor(_viewLocator) {
        this._viewLocator = _viewLocator;
    }
    toView(object, viewNameOrSelector) {
        return this._viewLocator.getViewComponentForObject(object, viewNameOrSelector);
    }
};
ViewValueConverter = __decorate([
    __param(0, IViewLocator)
], ViewValueConverter);
valueConverter('view')(ViewValueConverter);

const DebounceBindingBehaviorRegistration = DebounceBindingBehavior;
const OneTimeBindingBehaviorRegistration = OneTimeBindingBehavior;
const ToViewBindingBehaviorRegistration = ToViewBindingBehavior;
const FromViewBindingBehaviorRegistration = FromViewBindingBehavior;
const SignalBindingBehaviorRegistration = SignalBindingBehavior;
const ThrottleBindingBehaviorRegistration = ThrottleBindingBehavior;
const TwoWayBindingBehaviorRegistration = TwoWayBindingBehavior;
const ITemplateCompilerRegistration = TemplateCompiler;
const INodeObserverLocatorRegistration = NodeObserverLocator;
const DefaultComponents = [
    ITemplateCompilerRegistration,
    INodeObserverLocatorRegistration,
];
const SVGAnalyzerRegistration = SVGAnalyzer;
const AtPrefixedTriggerAttributePatternRegistration = AtPrefixedTriggerAttributePattern;
const ColonPrefixedBindAttributePatternRegistration = ColonPrefixedBindAttributePattern;
const RefAttributePatternRegistration = RefAttributePattern;
const DotSeparatedAttributePatternRegistration = DotSeparatedAttributePattern;
const SpreadAttributePatternRegistration = SpreadAttributePattern;
const DefaultBindingSyntax = [
    RefAttributePatternRegistration,
    DotSeparatedAttributePatternRegistration,
    SpreadAttributePatternRegistration,
];
const ShortHandBindingSyntax = [
    AtPrefixedTriggerAttributePatternRegistration,
    ColonPrefixedBindAttributePatternRegistration
];
const CallBindingCommandRegistration = CallBindingCommand;
const DefaultBindingCommandRegistration = DefaultBindingCommand;
const ForBindingCommandRegistration = ForBindingCommand;
const FromViewBindingCommandRegistration = FromViewBindingCommand;
const OneTimeBindingCommandRegistration = OneTimeBindingCommand;
const ToViewBindingCommandRegistration = ToViewBindingCommand;
const TwoWayBindingCommandRegistration = TwoWayBindingCommand;
const RefBindingCommandRegistration = RefBindingCommand;
const TriggerBindingCommandRegistration = TriggerBindingCommand;
const DelegateBindingCommandRegistration = DelegateBindingCommand;
const CaptureBindingCommandRegistration = CaptureBindingCommand;
const AttrBindingCommandRegistration = AttrBindingCommand;
const ClassBindingCommandRegistration = ClassBindingCommand;
const StyleBindingCommandRegistration = StyleBindingCommand;
const SpreadBindingCommandRegistration = SpreadBindingCommand;
const DefaultBindingLanguage = [
    DefaultBindingCommandRegistration,
    OneTimeBindingCommandRegistration,
    FromViewBindingCommandRegistration,
    ToViewBindingCommandRegistration,
    TwoWayBindingCommandRegistration,
    CallBindingCommandRegistration,
    ForBindingCommandRegistration,
    RefBindingCommandRegistration,
    TriggerBindingCommandRegistration,
    DelegateBindingCommandRegistration,
    CaptureBindingCommandRegistration,
    ClassBindingCommandRegistration,
    StyleBindingCommandRegistration,
    AttrBindingCommandRegistration,
    SpreadBindingCommandRegistration,
];
const SanitizeValueConverterRegistration = SanitizeValueConverter;
const ViewValueConverterRegistration = ViewValueConverter;
const IfRegistration = If;
const ElseRegistration = Else;
const RepeatRegistration = Repeat;
const WithRegistration = With;
const SwitchRegistration = Switch;
const CaseRegistration = Case;
const DefaultCaseRegistration = DefaultCase;
const PromiseTemplateControllerRegistration = PromiseTemplateController;
const PendingTemplateControllerRegistration = PendingTemplateController;
const FulfilledTemplateControllerRegistration = FulfilledTemplateController;
const RejectedTemplateControllerRegistration = RejectedTemplateController;
const PromiseAttributePatternRegistration = PromiseAttributePattern;
const FulfilledAttributePatternRegistration = FulfilledAttributePattern;
const RejectedAttributePatternRegistration = RejectedAttributePattern;
const AttrBindingBehaviorRegistration = AttrBindingBehavior;
const SelfBindingBehaviorRegistration = SelfBindingBehavior;
const UpdateTriggerBindingBehaviorRegistration = UpdateTriggerBindingBehavior;
const AuRenderRegistration = AuRender;
const AuComposeRegistration = AuCompose;
const PortalRegistration = Portal;
const FocusRegistration = Focus;
const ShowRegistration = Show;
const DefaultResources = [
    DebounceBindingBehaviorRegistration,
    OneTimeBindingBehaviorRegistration,
    ToViewBindingBehaviorRegistration,
    FromViewBindingBehaviorRegistration,
    SignalBindingBehaviorRegistration,
    ThrottleBindingBehaviorRegistration,
    TwoWayBindingBehaviorRegistration,
    SanitizeValueConverterRegistration,
    ViewValueConverterRegistration,
    IfRegistration,
    ElseRegistration,
    RepeatRegistration,
    WithRegistration,
    SwitchRegistration,
    CaseRegistration,
    DefaultCaseRegistration,
    PromiseTemplateControllerRegistration,
    PendingTemplateControllerRegistration,
    FulfilledTemplateControllerRegistration,
    RejectedTemplateControllerRegistration,
    PromiseAttributePatternRegistration,
    FulfilledAttributePatternRegistration,
    RejectedAttributePatternRegistration,
    AttrBindingBehaviorRegistration,
    SelfBindingBehaviorRegistration,
    UpdateTriggerBindingBehaviorRegistration,
    AuRenderRegistration,
    AuComposeRegistration,
    PortalRegistration,
    FocusRegistration,
    ShowRegistration,
    AuSlot,
];
const CallBindingRendererRegistration = CallBindingRenderer;
const CustomAttributeRendererRegistration = CustomAttributeRenderer;
const CustomElementRendererRegistration = CustomElementRenderer;
const InterpolationBindingRendererRegistration = InterpolationBindingRenderer;
const IteratorBindingRendererRegistration = IteratorBindingRenderer;
const LetElementRendererRegistration = LetElementRenderer;
const PropertyBindingRendererRegistration = PropertyBindingRenderer;
const RefBindingRendererRegistration = RefBindingRenderer;
const SetPropertyRendererRegistration = SetPropertyRenderer;
const TemplateControllerRendererRegistration = TemplateControllerRenderer;
const ListenerBindingRendererRegistration = ListenerBindingRenderer;
const AttributeBindingRendererRegistration = AttributeBindingRenderer;
const SetAttributeRendererRegistration = SetAttributeRenderer;
const SetClassAttributeRendererRegistration = SetClassAttributeRenderer;
const SetStyleAttributeRendererRegistration = SetStyleAttributeRenderer;
const StylePropertyBindingRendererRegistration = StylePropertyBindingRenderer;
const TextBindingRendererRegistration = TextBindingRenderer;
const SpreadRendererRegistration = SpreadRenderer;
const DefaultRenderers = [
    PropertyBindingRendererRegistration,
    IteratorBindingRendererRegistration,
    CallBindingRendererRegistration,
    RefBindingRendererRegistration,
    InterpolationBindingRendererRegistration,
    SetPropertyRendererRegistration,
    CustomElementRendererRegistration,
    CustomAttributeRendererRegistration,
    TemplateControllerRendererRegistration,
    LetElementRendererRegistration,
    ListenerBindingRendererRegistration,
    AttributeBindingRendererRegistration,
    SetAttributeRendererRegistration,
    SetClassAttributeRendererRegistration,
    SetStyleAttributeRendererRegistration,
    StylePropertyBindingRendererRegistration,
    TextBindingRendererRegistration,
    SpreadRendererRegistration,
];
const StandardConfiguration = createConfiguration(noop);
function createConfiguration(optionsProvider) {
    return {
        optionsProvider,
        register(container) {
            const runtimeConfigurationOptions = {
                coercingOptions: {
                    enableCoercion: false,
                    coerceNullish: false
                }
            };
            optionsProvider(runtimeConfigurationOptions);
            return container.register(instanceRegistration(ICoercionConfiguration, runtimeConfigurationOptions.coercingOptions), ...DefaultComponents, ...DefaultResources, ...DefaultBindingSyntax, ...DefaultBindingLanguage, ...DefaultRenderers);
        },
        customize(cb) {
            return createConfiguration(cb !== null && cb !== void 0 ? cb : optionsProvider);
        },
    };
}

const IAurelia = DI.createInterface('IAurelia');
class Aurelia {
    constructor(container = DI.createContainer()) {
        this.container = container;
        this._isRunning = false;
        this._isStarting = false;
        this._isStopping = false;
        this._root = void 0;
        this.next = void 0;
        this._startPromise = void 0;
        this._stopPromise = void 0;
        if (container.has(IAurelia, true)) {
            throw new Error(`AUR0768: An instance of Aurelia is already registered with the container or an ancestor of it.`);
        }
        container.registerResolver(IAurelia, new InstanceProvider('IAurelia', this));
        container.registerResolver(IAppRoot, this._rootProvider = new InstanceProvider('IAppRoot'));
    }
    get isRunning() { return this._isRunning; }
    get isStarting() { return this._isStarting; }
    get isStopping() { return this._isStopping; }
    get root() {
        if (this._root == null) {
            if (this.next == null) {
                throw new Error(`AUR0767: root is not defined`);
            }
            return this.next;
        }
        return this._root;
    }
    register(...params) {
        this.container.register(...params);
        return this;
    }
    app(config) {
        this.next = new AppRoot(config, this._initPlatform(config.host), this.container, this._rootProvider);
        return this;
    }
    enhance(config, parentController) {
        var _a;
        const ctn = (_a = config.container) !== null && _a !== void 0 ? _a : this.container.createChild();
        const host = config.host;
        const p = this._initPlatform(host);
        const comp = config.component;
        let bc;
        if (isFunction(comp)) {
            ctn.registerResolver(p.HTMLElement, ctn.registerResolver(p.Element, ctn.registerResolver(INode, new InstanceProvider('ElementResolver', host))));
            bc = ctn.invoke(comp);
        }
        else {
            bc = comp;
        }
        ctn.registerResolver(IEventTarget, new InstanceProvider('IEventTarget', host));
        parentController = parentController !== null && parentController !== void 0 ? parentController : null;
        const view = Controller.$el(ctn, bc, host, null, CustomElementDefinition.create({ name: generateElementName(), template: host, enhance: true }));
        return onResolve(view.activate(view, parentController, 2), () => view);
    }
    async waitForIdle() {
        const platform = this.root.platform;
        await platform.domWriteQueue.yield();
        await platform.domReadQueue.yield();
        await platform.taskQueue.yield();
    }
    _initPlatform(host) {
        let p;
        if (!this.container.has(IPlatform, false)) {
            if (host.ownerDocument.defaultView === null) {
                throw new Error(`AUR0769: Failed to initialize the platform object. The host element's ownerDocument does not have a defaultView`);
            }
            p = new BrowserPlatform(host.ownerDocument.defaultView);
            this.container.register(instanceRegistration(IPlatform, p));
        }
        else {
            p = this.container.get(IPlatform);
        }
        return p;
    }
    start(root = this.next) {
        if (root == null) {
            throw new Error(`AUR0770: There is no composition root`);
        }
        if (isPromise(this._startPromise)) {
            return this._startPromise;
        }
        return this._startPromise = onResolve(this.stop(), () => {
            Reflect.set(root.host, '$aurelia', this);
            this._rootProvider.prepare(this._root = root);
            this._isStarting = true;
            return onResolve(root.activate(), () => {
                this._isRunning = true;
                this._isStarting = false;
                this._startPromise = void 0;
                this._dispatchEvent(root, 'au-started', root.host);
            });
        });
    }
    stop(dispose = false) {
        if (isPromise(this._stopPromise)) {
            return this._stopPromise;
        }
        if (this._isRunning === true) {
            const root = this._root;
            this._isRunning = false;
            this._isStopping = true;
            return this._stopPromise = onResolve(root.deactivate(), () => {
                Reflect.deleteProperty(root.host, '$aurelia');
                if (dispose) {
                    root.dispose();
                }
                this._root = void 0;
                this._rootProvider.dispose();
                this._isStopping = false;
                this._dispatchEvent(root, 'au-stopped', root.host);
            });
        }
    }
    dispose() {
        if (this._isRunning || this._isStopping) {
            throw new Error(`AUR0771: The aurelia instance must be fully stopped before it can be disposed`);
        }
        this.container.dispose();
    }
    _dispatchEvent(root, name, target) {
        const ev = new root.platform.window.CustomEvent(name, { detail: this, bubbles: true, cancelable: true });
        target.dispatchEvent(ev);
    }
}

var DefinitionType;
(function (DefinitionType) {
    DefinitionType[DefinitionType["Element"] = 1] = "Element";
    DefinitionType[DefinitionType["Attribute"] = 2] = "Attribute";
})(DefinitionType || (DefinitionType = {}));

const IDialogService = DI.createInterface('IDialogService');
const IDialogController = DI.createInterface('IDialogController');
const IDialogDomRenderer = DI.createInterface('IDialogDomRenderer');
const IDialogDom = DI.createInterface('IDialogDom');
const IDialogGlobalSettings = DI.createInterface('IDialogGlobalSettings');
class DialogOpenResult {
    constructor(wasCancelled, dialog) {
        this.wasCancelled = wasCancelled;
        this.dialog = dialog;
    }
    static create(wasCancelled, dialog) {
        return new DialogOpenResult(wasCancelled, dialog);
    }
}
class DialogCloseResult {
    constructor(status, value) {
        this.status = status;
        this.value = value;
    }
    static create(status, value) {
        return new DialogCloseResult(status, value);
    }
}
var DialogDeactivationStatuses;
(function (DialogDeactivationStatuses) {
    DialogDeactivationStatuses["Ok"] = "ok";
    DialogDeactivationStatuses["Error"] = "error";
    DialogDeactivationStatuses["Cancel"] = "cancel";
    DialogDeactivationStatuses["Abort"] = "abort";
})(DialogDeactivationStatuses || (DialogDeactivationStatuses = {}));

class DialogController {
    constructor(p, container) {
        this.p = p;
        this.ctn = container;
        this.closed = new Promise((resolve, reject) => {
            this._resolve = resolve;
            this._reject = reject;
        });
    }
    static get inject() { return [IPlatform, IContainer]; }
    activate(settings) {
        var _a;
        const container = this.ctn.createChild();
        const { model, template, rejectOnCancel } = settings;
        const hostRenderer = container.get(IDialogDomRenderer);
        const dialogTargetHost = (_a = settings.host) !== null && _a !== void 0 ? _a : this.p.document.body;
        const dom = this.dom = hostRenderer.render(dialogTargetHost, settings);
        const rootEventTarget = container.has(IEventTarget, true)
            ? container.get(IEventTarget)
            : null;
        const contentHost = dom.contentHost;
        this.settings = settings;
        if (rootEventTarget == null || !rootEventTarget.contains(dialogTargetHost)) {
            container.register(instanceRegistration(IEventTarget, dialogTargetHost));
        }
        container.register(instanceRegistration(INode, contentHost), instanceRegistration(IDialogDom, dom));
        return new Promise(r => {
            var _a, _b;
            const cmp = Object.assign(this.cmp = this.getOrCreateVm(container, settings, contentHost), { $dialog: this });
            r((_b = (_a = cmp.canActivate) === null || _a === void 0 ? void 0 : _a.call(cmp, model)) !== null && _b !== void 0 ? _b : true);
        })
            .then(canActivate => {
            var _a;
            if (canActivate !== true) {
                dom.dispose();
                if (rejectOnCancel) {
                    throw createDialogCancelError(null, 'Dialog activation rejected');
                }
                return DialogOpenResult.create(true, this);
            }
            const cmp = this.cmp;
            return onResolve((_a = cmp.activate) === null || _a === void 0 ? void 0 : _a.call(cmp, model), () => {
                var _a;
                const ctrlr = this.controller = Controller.$el(container, cmp, contentHost, null, CustomElementDefinition.create((_a = this.getDefinition(cmp)) !== null && _a !== void 0 ? _a : { name: CustomElement.generateName(), template }));
                return onResolve(ctrlr.activate(ctrlr, null, 2), () => {
                    var _a;
                    dom.overlay.addEventListener((_a = settings.mouseEvent) !== null && _a !== void 0 ? _a : 'click', this);
                    return DialogOpenResult.create(false, this);
                });
            });
        }, e => {
            dom.dispose();
            throw e;
        });
    }
    deactivate(status, value) {
        if (this._closingPromise) {
            return this._closingPromise;
        }
        let deactivating = true;
        const { controller, dom, cmp, settings: { mouseEvent, rejectOnCancel } } = this;
        const dialogResult = DialogCloseResult.create(status, value);
        const promise = new Promise(r => {
            var _a, _b;
            r(onResolve((_b = (_a = cmp.canDeactivate) === null || _a === void 0 ? void 0 : _a.call(cmp, dialogResult)) !== null && _b !== void 0 ? _b : true, canDeactivate => {
                var _a;
                if (canDeactivate !== true) {
                    deactivating = false;
                    this._closingPromise = void 0;
                    if (rejectOnCancel) {
                        throw createDialogCancelError(null, 'Dialog cancellation rejected');
                    }
                    return DialogCloseResult.create("abort");
                }
                return onResolve((_a = cmp.deactivate) === null || _a === void 0 ? void 0 : _a.call(cmp, dialogResult), () => onResolve(controller.deactivate(controller, null, 4), () => {
                    dom.dispose();
                    dom.overlay.removeEventListener(mouseEvent !== null && mouseEvent !== void 0 ? mouseEvent : 'click', this);
                    if (!rejectOnCancel && status !== "error") {
                        this._resolve(dialogResult);
                    }
                    else {
                        this._reject(createDialogCancelError(value, 'Dialog cancelled with a rejection on cancel'));
                    }
                    return dialogResult;
                }));
            }));
        }).catch(reason => {
            this._closingPromise = void 0;
            throw reason;
        });
        this._closingPromise = deactivating ? promise : void 0;
        return promise;
    }
    ok(value) {
        return this.deactivate("ok", value);
    }
    cancel(value) {
        return this.deactivate("cancel", value);
    }
    error(value) {
        const closeError = createDialogCloseError(value);
        return new Promise(r => {
            var _a, _b;
            return r(onResolve((_b = (_a = this.cmp).deactivate) === null || _b === void 0 ? void 0 : _b.call(_a, DialogCloseResult.create("error", closeError)), () => onResolve(this.controller.deactivate(this.controller, null, 4), () => {
                this.dom.dispose();
                this._reject(closeError);
            })));
        });
    }
    handleEvent(event) {
        if (this.settings.overlayDismiss
            && !this.dom.contentHost.contains(event.target)) {
            this.cancel();
        }
    }
    getOrCreateVm(container, settings, host) {
        const Component = settings.component;
        if (Component == null) {
            return new EmptyComponent();
        }
        if (typeof Component === 'object') {
            return Component;
        }
        const p = this.p;
        container.registerResolver(p.HTMLElement, container.registerResolver(p.Element, container.registerResolver(INode, new InstanceProvider('ElementResolver', host))));
        return container.invoke(Component);
    }
    getDefinition(component) {
        const Ctor = (isFunction(component)
            ? component
            : component === null || component === void 0 ? void 0 : component.constructor);
        return CustomElement.isType(Ctor)
            ? CustomElement.getDefinition(Ctor)
            : null;
    }
}
class EmptyComponent {
}
function createDialogCancelError(output, msg) {
    const error = new Error(msg);
    error.wasCancelled = true;
    error.value = output;
    return error;
}
function createDialogCloseError(output) {
    const error = new Error();
    error.wasCancelled = false;
    error.value = output;
    return error;
}

class DialogService {
    constructor(_ctn, p, _defaultSettings) {
        this._ctn = _ctn;
        this.p = p;
        this._defaultSettings = _defaultSettings;
        this.dlgs = [];
    }
    get controllers() {
        return this.dlgs.slice(0);
    }
    get top() {
        const dlgs = this.dlgs;
        return dlgs.length > 0 ? dlgs[dlgs.length - 1] : null;
    }
    static get inject() { return [IContainer, IPlatform, IDialogGlobalSettings]; }
    static register(container) {
        container.register(singletonRegistration(IDialogService, this), AppTask.deactivating(IDialogService, dialogService => onResolve(dialogService.closeAll(), (openDialogController) => {
            if (openDialogController.length > 0) {
                throw new Error(`AUR0901: There are still ${openDialogController.length} open dialog(s).`);
            }
        })));
    }
    open(settings) {
        return asDialogOpenPromise(new Promise(resolve => {
            var _a;
            const $settings = DialogSettings.from(this._defaultSettings, settings);
            const container = (_a = $settings.container) !== null && _a !== void 0 ? _a : this._ctn.createChild();
            resolve(onResolve($settings.load(), loadedSettings => {
                const dialogController = container.invoke(DialogController);
                container.register(instanceRegistration(IDialogController, dialogController));
                container.register(callbackRegistration(DialogController, () => {
                    throw new Error(`AUR0902: Invalid injection of DialogController. Use IDialogController instead.`);
                }));
                return onResolve(dialogController.activate(loadedSettings), openResult => {
                    if (!openResult.wasCancelled) {
                        if (this.dlgs.push(dialogController) === 1) {
                            this.p.window.addEventListener('keydown', this);
                        }
                        const $removeController = () => this.remove(dialogController);
                        dialogController.closed.then($removeController, $removeController);
                    }
                    return openResult;
                });
            }));
        }));
    }
    closeAll() {
        return Promise
            .all(Array.from(this.dlgs)
            .map(controller => {
            if (controller.settings.rejectOnCancel) {
                return controller.cancel().then(() => null);
            }
            return controller.cancel().then(result => result.status === "cancel"
                ? null
                : controller);
        }))
            .then(unclosedControllers => unclosedControllers.filter(unclosed => !!unclosed));
    }
    remove(controller) {
        const dlgs = this.dlgs;
        const idx = dlgs.indexOf(controller);
        if (idx > -1) {
            this.dlgs.splice(idx, 1);
        }
        if (dlgs.length === 0) {
            this.p.window.removeEventListener('keydown', this);
        }
    }
    handleEvent(e) {
        const keyEvent = e;
        const key = getActionKey(keyEvent);
        if (key == null) {
            return;
        }
        const top = this.top;
        if (top === null || top.settings.keyboard.length === 0) {
            return;
        }
        const keyboard = top.settings.keyboard;
        if (key === 'Escape' && keyboard.includes(key)) {
            void top.cancel();
        }
        else if (key === 'Enter' && keyboard.includes(key)) {
            void top.ok();
        }
    }
}
class DialogSettings {
    static from(...srcs) {
        return Object.assign(new DialogSettings(), ...srcs)
            ._validate()
            ._normalize();
    }
    load() {
        const loaded = this;
        const cmp = this.component;
        const template = this.template;
        const maybePromise = resolveAll(...[
            cmp == null
                ? void 0
                : onResolve(cmp(), loadedCmp => { loaded.component = loadedCmp; }),
            isFunction(template)
                ? onResolve(template(), loadedTpl => { loaded.template = loadedTpl; })
                : void 0
        ]);
        return isPromise(maybePromise)
            ? maybePromise.then(() => loaded)
            : loaded;
    }
    _validate() {
        if (this.component == null && this.template == null) {
            throw new Error(`AUR0903: Invalid Dialog Settings. You must provide "component", "template" or both.`);
        }
        return this;
    }
    _normalize() {
        if (this.keyboard == null) {
            this.keyboard = this.lock ? [] : ['Enter', 'Escape'];
        }
        if (typeof this.overlayDismiss !== 'boolean') {
            this.overlayDismiss = !this.lock;
        }
        return this;
    }
}
function whenClosed(onfulfilled, onrejected) {
    return this.then(openResult => openResult.dialog.closed.then(onfulfilled, onrejected), onrejected);
}
function asDialogOpenPromise(promise) {
    promise.whenClosed = whenClosed;
    return promise;
}
function getActionKey(e) {
    if ((e.code || e.key) === 'Escape' || e.keyCode === 27) {
        return 'Escape';
    }
    if ((e.code || e.key) === 'Enter' || e.keyCode === 13) {
        return 'Enter';
    }
    return undefined;
}

class DefaultDialogGlobalSettings {
    constructor() {
        this.lock = true;
        this.startingZIndex = 1000;
        this.rejectOnCancel = false;
    }
    static register(container) {
        singletonRegistration(IDialogGlobalSettings, this).register(container);
    }
}
const baseWrapperCss = 'position:absolute;width:100%;height:100%;top:0;left:0;';
class DefaultDialogDomRenderer {
    constructor(p) {
        this.p = p;
        this.wrapperCss = `${baseWrapperCss} display:flex;`;
        this.overlayCss = baseWrapperCss;
        this.hostCss = 'position:relative;margin:auto;';
    }
    static register(container) {
        singletonRegistration(IDialogDomRenderer, this).register(container);
    }
    render(dialogHost) {
        const doc = this.p.document;
        const h = (name, css) => {
            const el = doc.createElement(name);
            el.style.cssText = css;
            return el;
        };
        const wrapper = dialogHost.appendChild(h('au-dialog-container', this.wrapperCss));
        const overlay = wrapper.appendChild(h('au-dialog-overlay', this.overlayCss));
        const host = wrapper.appendChild(h('div', this.hostCss));
        return new DefaultDialogDom(wrapper, overlay, host);
    }
}
DefaultDialogDomRenderer.inject = [IPlatform];
class DefaultDialogDom {
    constructor(wrapper, overlay, contentHost) {
        this.wrapper = wrapper;
        this.overlay = overlay;
        this.contentHost = contentHost;
    }
    dispose() {
        this.wrapper.remove();
    }
}

function createDialogConfiguration(settingsProvider, registrations) {
    return {
        settingsProvider: settingsProvider,
        register: (ctn) => ctn.register(...registrations, AppTask.creating(() => settingsProvider(ctn.get(IDialogGlobalSettings)))),
        customize(cb, regs) {
            return createDialogConfiguration(cb, regs !== null && regs !== void 0 ? regs : registrations);
        },
    };
}
const DialogConfiguration = createDialogConfiguration(() => {
    throw new Error(`AUR0904: Invalid dialog configuration. ` +
            'Specify the implementations for ' +
            '<IDialogService>, <IDialogGlobalSettings> and <IDialogDomRenderer>, ' +
            'or use the DialogDefaultConfiguration export.');
}, [class NoopDialogGlobalSettings {
        static register(container) {
            container.register(singletonRegistration(IDialogGlobalSettings, this));
        }
    }]);
const DialogDefaultConfiguration = createDialogConfiguration(noop, [
    DialogService,
    DefaultDialogGlobalSettings,
    DefaultDialogDomRenderer,
]);

const IWcElementRegistry = DI.createInterface(x => x.singleton(WcCustomElementRegistry));
class WcCustomElementRegistry {
    constructor(ctn, p, r) {
        this.ctn = ctn;
        this.p = p;
        this.r = r;
    }
    define(name, def, options) {
        if (!name.includes('-')) {
            throw new Error('Invalid web-components custom element name. It must include a "-"');
        }
        let elDef;
        if (def == null) {
            throw new Error('Invalid custom element definition');
        }
        switch (typeof def) {
            case 'function':
                elDef = CustomElement.isType(def)
                    ? CustomElement.getDefinition(def)
                    : CustomElementDefinition.create(CustomElement.generateName(), def);
                break;
            default:
                elDef = CustomElementDefinition.getOrCreate(def);
                break;
        }
        if (elDef.containerless) {
            throw new Error('Containerless custom element is not supported. Consider using buitl-in extends instead');
        }
        const BaseClass = !(options === null || options === void 0 ? void 0 : options.extends) ? HTMLElement : this.p.document.createElement(options.extends).constructor;
        const container = this.ctn;
        const rendering = this.r;
        const bindables = elDef.bindables;
        const p = this.p;
        class CustomElementClass extends BaseClass {
            auInit() {
                if (this.auInited) {
                    return;
                }
                this.auInited = true;
                const childCtn = container.createChild();
                childCtn.registerResolver(p.HTMLElement, childCtn.registerResolver(p.Element, childCtn.registerResolver(INode, new InstanceProvider('ElementProvider', this))));
                const compiledDef = rendering.compile(elDef, childCtn, { projections: null });
                const viewModel = childCtn.invoke(compiledDef.Type);
                const controller = this.auCtrl = Controller.$el(childCtn, viewModel, this, null, compiledDef);
                setRef(this, compiledDef.key, controller);
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
            attributeChangedCallback(name, oldValue, newValue) {
                this.auInit();
                this.auCtrl.viewModel[name] = newValue;
            }
        }
        CustomElementClass.observedAttributes = Object.keys(bindables);
        for (const bindableProp in bindables) {
            Object.defineProperty(CustomElementClass.prototype, bindableProp, {
                configurable: true,
                enumerable: false,
                get() {
                    return this['auCtrl'].viewModel[bindableProp];
                },
                set(v) {
                    if (!this['auInited']) {
                        this['auInit']();
                    }
                    this['auCtrl'].viewModel[bindableProp] = v;
                }
            });
        }
        this.p.customElements.define(name, CustomElementClass, options);
        return CustomElementClass;
    }
}
WcCustomElementRegistry.inject = [IContainer, IPlatform, IRendering];

export { AdoptedStyleSheetsStyles, AppRoot, AppTask, AtPrefixedTriggerAttributePattern, AtPrefixedTriggerAttributePatternRegistration, AttrBindingBehavior, AttrBindingBehaviorRegistration, AttrBindingCommand, AttrBindingCommandRegistration, AttrSyntax, AttributeBinding, AttributeBindingInstruction, AttributeBindingRendererRegistration, AttributeNSAccessor, AttributePattern, AuCompose, AuRender, AuRenderRegistration, AuSlot, AuSlotsInfo, Aurelia, Bindable, BindableDefinition, BindableObserver, BindablesInfo, BindingCommand, BindingCommandDefinition, BindingModeBehavior, CSSModulesProcessorRegistry, CallBinding, CallBindingCommand, CallBindingCommandRegistration, CallBindingInstruction, CallBindingRendererRegistration, CaptureBindingCommand, CaptureBindingCommandRegistration, Case, CheckedObserver, Children, ChildrenDefinition, ChildrenObserver, ClassAttributeAccessor, ClassBindingCommand, ClassBindingCommandRegistration, ColonPrefixedBindAttributePattern, ColonPrefixedBindAttributePatternRegistration, CommandType, ComputedWatcher, Controller, CustomAttribute, CustomAttributeDefinition, CustomAttributeRendererRegistration, CustomElement, CustomElementDefinition, CustomElementRendererRegistration, DataAttributeAccessor, DebounceBindingBehavior, DebounceBindingBehaviorRegistration, DefaultBindingCommand, DefaultBindingCommandRegistration, DefaultBindingLanguage, DefaultBindingSyntax, DefaultCase, DefaultComponents, DefaultDialogDom, DefaultDialogDomRenderer, DefaultDialogGlobalSettings, DefaultRenderers, DefaultResources, DefinitionType, DelegateBindingCommand, DelegateBindingCommandRegistration, DialogCloseResult, DialogConfiguration, DialogController, DialogDeactivationStatuses, DialogDefaultConfiguration, DialogOpenResult, DialogService, DotSeparatedAttributePattern, DotSeparatedAttributePatternRegistration, Else, ElseRegistration, EventDelegator, EventSubscriber, ExpressionWatcher, Focus, ForBindingCommand, ForBindingCommandRegistration, FragmentNodeSequence, FromViewBindingBehavior, FromViewBindingBehaviorRegistration, FromViewBindingCommand, FromViewBindingCommandRegistration, FulfilledTemplateController, HooksDefinition, HydrateAttributeInstruction, HydrateElementInstruction, HydrateLetElementInstruction, HydrateTemplateController, IAppRoot, IAppTask, IAttrMapper, IAttributeParser, IAttributePattern, IAuSlotsInfo, IAurelia, IController, IDialogController, IDialogDom, IDialogDomRenderer, IDialogGlobalSettings, IDialogService, IEventDelegator, IEventTarget, IHistory, IHydrationContext, IInstruction, ILifecycleHooks, IListenerBehaviorOptions, ILocation, INode, INodeObserverLocatorRegistration, IPlatform, IProjections, IRenderLocation, IRenderer, IRendering, ISVGAnalyzer, ISanitizer, IShadowDOMGlobalStyles, IShadowDOMStyles, ISyntaxInterpreter, ITemplateCompiler, ITemplateCompilerHooks, ITemplateCompilerRegistration, ITemplateElementFactory, IViewFactory, IViewLocator, IWcElementRegistry, IWindow, IWorkTracker, If, IfRegistration, InstructionType, InterpolationBinding, InterpolationBindingRendererRegistration, InterpolationInstruction, InterpolationPartBinding, Interpretation, IteratorBindingInstruction, IteratorBindingRendererRegistration, LetBinding, LetBindingInstruction, LetElementRendererRegistration, LifecycleHooks, LifecycleHooksDefinition, LifecycleHooksEntry, Listener, ListenerBindingInstruction, ListenerBindingRendererRegistration, NodeObserverConfig, NodeObserverLocator, NodeType, NoopSVGAnalyzer, OneTimeBindingBehavior, OneTimeBindingBehaviorRegistration, OneTimeBindingCommand, OneTimeBindingCommandRegistration, PendingTemplateController, Portal, PromiseTemplateController, PropertyBinding, PropertyBindingInstruction, PropertyBindingRendererRegistration, RefAttributePattern, RefAttributePatternRegistration, RefBinding, RefBindingCommandRegistration, RefBindingInstruction, RefBindingRendererRegistration, RejectedTemplateController, RenderPlan, Rendering, Repeat, RepeatRegistration, SVGAnalyzer, SVGAnalyzerRegistration, SanitizeValueConverter, SanitizeValueConverterRegistration, SelectValueObserver, SelfBindingBehavior, SelfBindingBehaviorRegistration, SetAttributeInstruction, SetAttributeRendererRegistration, SetClassAttributeInstruction, SetClassAttributeRendererRegistration, SetPropertyInstruction, SetPropertyRendererRegistration, SetStyleAttributeInstruction, SetStyleAttributeRendererRegistration, ShadowDOMRegistry, ShortHandBindingSyntax, SignalBindingBehavior, SignalBindingBehaviorRegistration, StandardConfiguration, StyleAttributeAccessor, StyleBindingCommand, StyleBindingCommandRegistration, StyleConfiguration, StyleElementStyles, StylePropertyBindingInstruction, StylePropertyBindingRendererRegistration, Switch, TemplateCompiler, TemplateCompilerHooks, TemplateControllerRendererRegistration, TextBindingInstruction, TextBindingRendererRegistration, ThrottleBindingBehavior, ThrottleBindingBehaviorRegistration, ToViewBindingBehavior, ToViewBindingBehaviorRegistration, ToViewBindingCommand, ToViewBindingCommandRegistration, TriggerBindingCommand, TriggerBindingCommandRegistration, TwoWayBindingBehavior, TwoWayBindingBehaviorRegistration, TwoWayBindingCommand, TwoWayBindingCommandRegistration, UpdateTriggerBindingBehavior, UpdateTriggerBindingBehaviorRegistration, ValueAttributeObserver, ViewFactory, ViewLocator, ViewModelKind, ViewValueConverter, ViewValueConverterRegistration, Views, Watch, WcCustomElementRegistry, With, WithRegistration, allResources, applyBindingBehavior, attributePattern, bindable, bindingCommand, capture, children, coercer, containerless, convertToRenderLocation, createElement, cssModules, customAttribute, customElement, getEffectiveParentNode, getRef, isCustomElementController, isCustomElementViewModel, isInstruction, isRenderLocation, lifecycleHooks, processContent, renderer, setEffectiveParentNode, setRef, shadowCSS, strict, templateCompilerHooks, templateController, useShadowDOM, view, watch };
//# sourceMappingURL=index.dev.mjs.map
