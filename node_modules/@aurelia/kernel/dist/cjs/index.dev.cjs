'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var metadata = require('@aurelia/metadata');

const getOwnMetadata = metadata.Metadata.getOwn;
const hasOwnMetadata = metadata.Metadata.hasOwn;
const defineMetadata = metadata.Metadata.define;
const isFunction = (v) => typeof v === 'function';
const isString = (v) => typeof v === 'string';
const createObject = () => Object.create(null);

const isNumericLookup = {};
function isArrayIndex(value) {
    switch (typeof value) {
        case 'number':
            return value >= 0 && (value | 0) === value;
        case 'string': {
            const result = isNumericLookup[value];
            if (result !== void 0) {
                return result;
            }
            const length = value.length;
            if (length === 0) {
                return isNumericLookup[value] = false;
            }
            let ch = 0;
            let i = 0;
            for (; i < length; ++i) {
                ch = value.charCodeAt(i);
                if (i === 0 && ch === 0x30 && length > 1 || ch < 0x30 || ch > 0x39) {
                    return isNumericLookup[value] = false;
                }
            }
            return isNumericLookup[value] = true;
        }
        default:
            return false;
    }
}
function isNumberOrBigInt(value) {
    switch (typeof value) {
        case 'number':
        case 'bigint':
            return true;
        default:
            return false;
    }
}
function isStringOrDate(value) {
    switch (typeof value) {
        case 'string':
            return true;
        case 'object':
            return value instanceof Date;
        default:
            return false;
    }
}
const baseCase = (function () {
    let CharKind;
    (function (CharKind) {
        CharKind[CharKind["none"] = 0] = "none";
        CharKind[CharKind["digit"] = 1] = "digit";
        CharKind[CharKind["upper"] = 2] = "upper";
        CharKind[CharKind["lower"] = 3] = "lower";
    })(CharKind || (CharKind = {}));
    const isDigit = Object.assign(createObject(), {
        '0': true,
        '1': true,
        '2': true,
        '3': true,
        '4': true,
        '5': true,
        '6': true,
        '7': true,
        '8': true,
        '9': true,
    });
    function charToKind(char) {
        if (char === '') {
            return 0;
        }
        if (char !== char.toUpperCase()) {
            return 3;
        }
        if (char !== char.toLowerCase()) {
            return 2;
        }
        if (isDigit[char] === true) {
            return 1;
        }
        return 0;
    }
    return function (input, cb) {
        const len = input.length;
        if (len === 0) {
            return input;
        }
        let sep = false;
        let output = '';
        let prevKind;
        let curChar = '';
        let curKind = 0;
        let nextChar = input.charAt(0);
        let nextKind = charToKind(nextChar);
        let i = 0;
        for (; i < len; ++i) {
            prevKind = curKind;
            curChar = nextChar;
            curKind = nextKind;
            nextChar = input.charAt(i + 1);
            nextKind = charToKind(nextChar);
            if (curKind === 0) {
                if (output.length > 0) {
                    sep = true;
                }
            }
            else {
                if (!sep && output.length > 0 && curKind === 2) {
                    sep = prevKind === 3 || nextKind === 3;
                }
                output += cb(curChar, sep);
                sep = false;
            }
        }
        return output;
    };
})();
const camelCase = (function () {
    const cache = createObject();
    function callback(char, sep) {
        return sep ? char.toUpperCase() : char.toLowerCase();
    }
    return function (input) {
        let output = cache[input];
        if (output === void 0) {
            output = cache[input] = baseCase(input, callback);
        }
        return output;
    };
})();
const pascalCase = (function () {
    const cache = createObject();
    return function (input) {
        let output = cache[input];
        if (output === void 0) {
            output = camelCase(input);
            if (output.length > 0) {
                output = output[0].toUpperCase() + output.slice(1);
            }
            cache[input] = output;
        }
        return output;
    };
})();
const kebabCase = (function () {
    const cache = createObject();
    function callback(char, sep) {
        return sep ? `-${char.toLowerCase()}` : char.toLowerCase();
    }
    return function (input) {
        let output = cache[input];
        if (output === void 0) {
            output = cache[input] = baseCase(input, callback);
        }
        return output;
    };
})();
function toArray(input) {
    const { length } = input;
    const arr = Array(length);
    let i = 0;
    for (; i < length; ++i) {
        arr[i] = input[i];
    }
    return arr;
}
const ids = {};
function nextId(context) {
    if (ids[context] === void 0) {
        ids[context] = 0;
    }
    return ++ids[context];
}
function resetId(context) {
    ids[context] = 0;
}
function compareNumber(a, b) {
    return a - b;
}
function mergeDistinct(arr1, arr2, slice) {
    if (arr1 === void 0 || arr1 === null || arr1 === emptyArray) {
        if (arr2 === void 0 || arr2 === null || arr2 === emptyArray) {
            return emptyArray;
        }
        else {
            return slice ? arr2.slice(0) : arr2;
        }
    }
    else if (arr2 === void 0 || arr2 === null || arr2 === emptyArray) {
        return slice ? arr1.slice(0) : arr1;
    }
    const lookup = {};
    const arr3 = slice ? arr1.slice(0) : arr1;
    let len1 = arr1.length;
    let len2 = arr2.length;
    while (len1-- > 0) {
        lookup[arr1[len1]] = true;
    }
    let item;
    while (len2-- > 0) {
        item = arr2[len2];
        if (lookup[item] === void 0) {
            arr3.push(item);
            lookup[item] = true;
        }
    }
    return arr3;
}
function bound(target, key, descriptor) {
    return {
        configurable: true,
        enumerable: descriptor.enumerable,
        get() {
            const boundFn = descriptor.value.bind(this);
            Reflect.defineProperty(this, key, {
                value: boundFn,
                writable: true,
                configurable: true,
                enumerable: descriptor.enumerable,
            });
            return boundFn;
        },
    };
}
function mergeArrays(...arrays) {
    const result = [];
    let k = 0;
    const arraysLen = arrays.length;
    let arrayLen = 0;
    let array;
    let i = 0;
    for (; i < arraysLen; ++i) {
        array = arrays[i];
        if (array !== void 0) {
            arrayLen = array.length;
            let j = 0;
            for (; j < arrayLen; ++j) {
                result[k++] = array[j];
            }
        }
    }
    return result;
}
function mergeObjects(...objects) {
    const result = {};
    const objectsLen = objects.length;
    let object;
    let key;
    let i = 0;
    for (; objectsLen > i; ++i) {
        object = objects[i];
        if (object !== void 0) {
            for (key in object) {
                result[key] = object[key];
            }
        }
    }
    return result;
}
function firstDefined(...values) {
    const len = values.length;
    let value;
    let i = 0;
    for (; len > i; ++i) {
        value = values[i];
        if (value !== void 0) {
            return value;
        }
    }
    throw new Error(`No default value found`);
}
const getPrototypeChain = (function () {
    const functionPrototype = Function.prototype;
    const getPrototypeOf = Object.getPrototypeOf;
    const cache = new WeakMap();
    let proto = functionPrototype;
    let i = 0;
    let chain = void 0;
    return function (Type) {
        chain = cache.get(Type);
        if (chain === void 0) {
            cache.set(Type, chain = [proto = Type]);
            i = 0;
            while ((proto = getPrototypeOf(proto)) !== functionPrototype) {
                chain[++i] = proto;
            }
        }
        return chain;
    };
})();
function toLookup(...objs) {
    return Object.assign(createObject(), ...objs);
}
const isNativeFunction = (function () {
    const lookup = new WeakMap();
    let isNative = false;
    let sourceText = '';
    let i = 0;
    return function (fn) {
        isNative = lookup.get(fn);
        if (isNative === void 0) {
            sourceText = fn.toString();
            i = sourceText.length;
            isNative = (i >= 29 &&
                i <= 100 &&
                sourceText.charCodeAt(i - 1) === 0x7D &&
                sourceText.charCodeAt(i - 2) <= 0x20 &&
                sourceText.charCodeAt(i - 3) === 0x5D &&
                sourceText.charCodeAt(i - 4) === 0x65 &&
                sourceText.charCodeAt(i - 5) === 0x64 &&
                sourceText.charCodeAt(i - 6) === 0x6F &&
                sourceText.charCodeAt(i - 7) === 0x63 &&
                sourceText.charCodeAt(i - 8) === 0x20 &&
                sourceText.charCodeAt(i - 9) === 0x65 &&
                sourceText.charCodeAt(i - 10) === 0x76 &&
                sourceText.charCodeAt(i - 11) === 0x69 &&
                sourceText.charCodeAt(i - 12) === 0x74 &&
                sourceText.charCodeAt(i - 13) === 0x61 &&
                sourceText.charCodeAt(i - 14) === 0x6E &&
                sourceText.charCodeAt(i - 15) === 0x58);
            lookup.set(fn, isNative);
        }
        return isNative;
    };
})();
function onResolve(maybePromise, resolveCallback) {
    if (maybePromise instanceof Promise) {
        return maybePromise.then(resolveCallback);
    }
    return resolveCallback(maybePromise);
}
function resolveAll(...maybePromises) {
    let maybePromise = void 0;
    let firstPromise = void 0;
    let promises = void 0;
    let i = 0;
    let ii = maybePromises.length;
    for (; i < ii; ++i) {
        maybePromise = maybePromises[i];
        if ((maybePromise = maybePromises[i]) instanceof Promise) {
            if (firstPromise === void 0) {
                firstPromise = maybePromise;
            }
            else if (promises === void 0) {
                promises = [firstPromise, maybePromise];
            }
            else {
                promises.push(maybePromise);
            }
        }
    }
    if (promises === void 0) {
        return firstPromise;
    }
    return Promise.all(promises);
}

const annoBaseName = 'au:annotation';
const getAnnotationKeyFor = (name, context) => {
    if (context === void 0) {
        return `${annoBaseName}:${name}`;
    }
    return `${annoBaseName}:${name}:${context}`;
};
const appendAnnotation = (target, key) => {
    const keys = getOwnMetadata(annoBaseName, target);
    if (keys === void 0) {
        defineMetadata(annoBaseName, [key], target);
    }
    else {
        keys.push(key);
    }
};
const annotation = Object.freeze({
    name: 'au:annotation',
    appendTo: appendAnnotation,
    set(target, prop, value) {
        defineMetadata(getAnnotationKeyFor(prop), value, target);
    },
    get: (target, prop) => getOwnMetadata(getAnnotationKeyFor(prop), target),
    getKeys(target) {
        let keys = getOwnMetadata(annoBaseName, target);
        if (keys === void 0) {
            defineMetadata(annoBaseName, keys = [], target);
        }
        return keys;
    },
    isKey: (key) => key.startsWith(annoBaseName),
    keyFor: getAnnotationKeyFor,
});
const resBaseName = 'au:resource';
const resource = Object.freeze({
    name: resBaseName,
    appendTo(target, key) {
        const keys = getOwnMetadata(resBaseName, target);
        if (keys === void 0) {
            defineMetadata(resBaseName, [key], target);
        }
        else {
            keys.push(key);
        }
    },
    has: (target) => hasOwnMetadata(resBaseName, target),
    getAll(target) {
        const keys = getOwnMetadata(resBaseName, target);
        if (keys === void 0) {
            return emptyArray;
        }
        else {
            return keys.map(k => getOwnMetadata(k, target));
        }
    },
    getKeys(target) {
        let keys = getOwnMetadata(resBaseName, target);
        if (keys === void 0) {
            defineMetadata(resBaseName, keys = [], target);
        }
        return keys;
    },
    isKey: (key) => key.startsWith(resBaseName),
    keyFor(name, context) {
        if (context === void 0) {
            return `${resBaseName}:${name}`;
        }
        return `${resBaseName}:${name}:${context}`;
    },
});
const Protocol = {
    annotation,
    resource,
};
const hasOwn = Object.prototype.hasOwnProperty;
function fromAnnotationOrDefinitionOrTypeOrDefault(name, def, Type, getDefault) {
    let value = getOwnMetadata(getAnnotationKeyFor(name), Type);
    if (value === void 0) {
        value = def[name];
        if (value === void 0) {
            value = Type[name];
            if (value === void 0 || !hasOwn.call(Type, name)) {
                return getDefault();
            }
            return value;
        }
        return value;
    }
    return value;
}
function fromAnnotationOrTypeOrDefault(name, Type, getDefault) {
    let value = getOwnMetadata(getAnnotationKeyFor(name), Type);
    if (value === void 0) {
        value = Type[name];
        if (value === void 0 || !hasOwn.call(Type, name)) {
            return getDefault();
        }
        return value;
    }
    return value;
}
function fromDefinitionOrDefault(name, def, getDefault) {
    const value = def[name];
    if (value === void 0) {
        return getDefault();
    }
    return value;
}

metadata.applyMetadataPolyfill(Reflect, false, false);
class ResolverBuilder {
    constructor(container, key) {
        this.container = container;
        this.key = key;
    }
    instance(value) {
        return this.registerResolver(0, value);
    }
    singleton(value) {
        return this.registerResolver(1, value);
    }
    transient(value) {
        return this.registerResolver(2, value);
    }
    callback(value) {
        return this.registerResolver(3, value);
    }
    cachedCallback(value) {
        return this.registerResolver(3, cacheCallbackResult(value));
    }
    aliasTo(destinationKey) {
        return this.registerResolver(5, destinationKey);
    }
    registerResolver(strategy, state) {
        const { container, key } = this;
        this.container = this.key = (void 0);
        return container.registerResolver(key, new Resolver(key, strategy, state));
    }
}
function cloneArrayWithPossibleProps(source) {
    const clone = source.slice();
    const keys = Object.keys(source);
    const len = keys.length;
    let key;
    for (let i = 0; i < len; ++i) {
        key = keys[i];
        if (!isArrayIndex(key)) {
            clone[key] = source[key];
        }
    }
    return clone;
}
const DefaultResolver = {
    none(key) {
        {
            throw Error(`AUR0002: ${key.toString()} not registered, did you forget to add @singleton()?`);
        }
    },
    singleton(key) { return new Resolver(key, 1, key); },
    transient(key) { return new Resolver(key, 2, key); },
};
class ContainerConfiguration {
    constructor(inheritParentResources, defaultResolver) {
        this.inheritParentResources = inheritParentResources;
        this.defaultResolver = defaultResolver;
    }
    static from(config) {
        var _a, _b;
        if (config === void 0 ||
            config === ContainerConfiguration.DEFAULT) {
            return ContainerConfiguration.DEFAULT;
        }
        return new ContainerConfiguration((_a = config.inheritParentResources) !== null && _a !== void 0 ? _a : false, (_b = config.defaultResolver) !== null && _b !== void 0 ? _b : DefaultResolver.singleton);
    }
}
ContainerConfiguration.DEFAULT = ContainerConfiguration.from({});
const DI = {
    createContainer(config) {
        return new Container(null, ContainerConfiguration.from(config));
    },
    getDesignParamtypes(Type) {
        return getOwnMetadata('design:paramtypes', Type);
    },
    getAnnotationParamtypes(Type) {
        const key = getAnnotationKeyFor('di:paramtypes');
        return getOwnMetadata(key, Type);
    },
    getOrCreateAnnotationParamTypes: getOrCreateAnnotationParamTypes,
    getDependencies: getDependencies,
    createInterface(configureOrName, configuror) {
        const configure = isFunction(configureOrName) ? configureOrName : configuror;
        const friendlyName = isString(configureOrName) ? configureOrName : undefined;
        const Interface = function (target, property, index) {
            if (target == null || new.target !== undefined) {
                {
                    throw new Error(`AUR0001: No registration for interface: '${Interface.friendlyName}'`);
                }
            }
            const annotationParamtypes = getOrCreateAnnotationParamTypes(target);
            annotationParamtypes[index] = Interface;
        };
        Interface.$isInterface = true;
        Interface.friendlyName = friendlyName == null ? '(anonymous)' : friendlyName;
        if (configure != null) {
            Interface.register = function (container, key) {
                return configure(new ResolverBuilder(container, key !== null && key !== void 0 ? key : Interface));
            };
        }
        Interface.toString = function toString() {
            return `InterfaceSymbol<${Interface.friendlyName}>`;
        };
        return Interface;
    },
    inject(...dependencies) {
        return function (target, key, descriptor) {
            if (typeof descriptor === 'number') {
                const annotationParamtypes = getOrCreateAnnotationParamTypes(target);
                const dep = dependencies[0];
                if (dep !== void 0) {
                    annotationParamtypes[descriptor] = dep;
                }
            }
            else if (key) {
                const annotationParamtypes = getOrCreateAnnotationParamTypes(target.constructor);
                const dep = dependencies[0];
                if (dep !== void 0) {
                    annotationParamtypes[key] = dep;
                }
            }
            else if (descriptor) {
                const fn = descriptor.value;
                const annotationParamtypes = getOrCreateAnnotationParamTypes(fn);
                let dep;
                for (let i = 0; i < dependencies.length; ++i) {
                    dep = dependencies[i];
                    if (dep !== void 0) {
                        annotationParamtypes[i] = dep;
                    }
                }
            }
            else {
                const annotationParamtypes = getOrCreateAnnotationParamTypes(target);
                let dep;
                for (let i = 0; i < dependencies.length; ++i) {
                    dep = dependencies[i];
                    if (dep !== void 0) {
                        annotationParamtypes[i] = dep;
                    }
                }
            }
        };
    },
    transient(target) {
        target.register = function (container) {
            const registration = Registration.transient(target, target);
            return registration.register(container, target);
        };
        target.registerInRequestor = false;
        return target;
    },
    singleton(target, options = defaultSingletonOptions) {
        target.register = function (container) {
            const registration = Registration.singleton(target, target);
            return registration.register(container, target);
        };
        target.registerInRequestor = options.scoped;
        return target;
    },
};
function getDependencies(Type) {
    const key = getAnnotationKeyFor('di:dependencies');
    let dependencies = getOwnMetadata(key, Type);
    if (dependencies === void 0) {
        const inject = Type.inject;
        if (inject === void 0) {
            const designParamtypes = DI.getDesignParamtypes(Type);
            const annotationParamtypes = DI.getAnnotationParamtypes(Type);
            if (designParamtypes === void 0) {
                if (annotationParamtypes === void 0) {
                    const Proto = Object.getPrototypeOf(Type);
                    if (isFunction(Proto) && Proto !== Function.prototype) {
                        dependencies = cloneArrayWithPossibleProps(getDependencies(Proto));
                    }
                    else {
                        dependencies = [];
                    }
                }
                else {
                    dependencies = cloneArrayWithPossibleProps(annotationParamtypes);
                }
            }
            else if (annotationParamtypes === void 0) {
                dependencies = cloneArrayWithPossibleProps(designParamtypes);
            }
            else {
                dependencies = cloneArrayWithPossibleProps(designParamtypes);
                let len = annotationParamtypes.length;
                let auAnnotationParamtype;
                let i = 0;
                for (; i < len; ++i) {
                    auAnnotationParamtype = annotationParamtypes[i];
                    if (auAnnotationParamtype !== void 0) {
                        dependencies[i] = auAnnotationParamtype;
                    }
                }
                const keys = Object.keys(annotationParamtypes);
                let key;
                i = 0;
                len = keys.length;
                for (i = 0; i < len; ++i) {
                    key = keys[i];
                    if (!isArrayIndex(key)) {
                        dependencies[key] = annotationParamtypes[key];
                    }
                }
            }
        }
        else {
            dependencies = cloneArrayWithPossibleProps(inject);
        }
        defineMetadata(key, dependencies, Type);
        appendAnnotation(Type, key);
    }
    return dependencies;
}
function getOrCreateAnnotationParamTypes(Type) {
    const key = getAnnotationKeyFor('di:paramtypes');
    let annotationParamtypes = getOwnMetadata(key, Type);
    if (annotationParamtypes === void 0) {
        defineMetadata(key, annotationParamtypes = [], Type);
        appendAnnotation(Type, key);
    }
    return annotationParamtypes;
}
const IContainer = DI.createInterface('IContainer');
const IServiceLocator = IContainer;
function createResolver(getter) {
    return function (key) {
        const resolver = function (target, property, descriptor) {
            DI.inject(resolver)(target, property, descriptor);
        };
        resolver.$isResolver = true;
        resolver.resolve = function (handler, requestor) {
            return getter(key, handler, requestor);
        };
        return resolver;
    };
}
const inject = DI.inject;
function transientDecorator(target) {
    return DI.transient(target);
}
function transient(target) {
    return target == null ? transientDecorator : transientDecorator(target);
}
const defaultSingletonOptions = { scoped: false };
function singleton(targetOrOptions) {
    if (isFunction(targetOrOptions)) {
        return DI.singleton(targetOrOptions);
    }
    return function ($target) {
        return DI.singleton($target, targetOrOptions);
    };
}
function createAllResolver(getter) {
    return function (key, searchAncestors) {
        searchAncestors = !!searchAncestors;
        const resolver = function (target, property, descriptor) {
            DI.inject(resolver)(target, property, descriptor);
        };
        resolver.$isResolver = true;
        resolver.resolve = function (handler, requestor) {
            return getter(key, handler, requestor, searchAncestors);
        };
        return resolver;
    };
}
const all = createAllResolver((key, handler, requestor, searchAncestors) => requestor.getAll(key, searchAncestors));
const lazy = createResolver((key, handler, requestor) => {
    return () => requestor.get(key);
});
const optional = createResolver((key, handler, requestor) => {
    if (requestor.has(key, true)) {
        return requestor.get(key);
    }
    else {
        return undefined;
    }
});
function ignore(target, property, descriptor) {
    DI.inject(ignore)(target, property, descriptor);
}
ignore.$isResolver = true;
ignore.resolve = () => undefined;
const factory = createResolver((key, handler, requestor) => {
    return (...args) => handler.getFactory(key).construct(requestor, args);
});
const newInstanceForScope = createResolver((key, handler, requestor) => {
    const instance = createNewInstance(key, handler, requestor);
    const instanceProvider = new InstanceProvider(String(key), instance);
    requestor.registerResolver(key, instanceProvider, true);
    return instance;
});
const newInstanceOf = createResolver((key, handler, requestor) => createNewInstance(key, handler, requestor));
function createNewInstance(key, handler, requestor) {
    return handler.getFactory(key).construct(requestor);
}
var ResolverStrategy;
(function (ResolverStrategy) {
    ResolverStrategy[ResolverStrategy["instance"] = 0] = "instance";
    ResolverStrategy[ResolverStrategy["singleton"] = 1] = "singleton";
    ResolverStrategy[ResolverStrategy["transient"] = 2] = "transient";
    ResolverStrategy[ResolverStrategy["callback"] = 3] = "callback";
    ResolverStrategy[ResolverStrategy["array"] = 4] = "array";
    ResolverStrategy[ResolverStrategy["alias"] = 5] = "alias";
})(ResolverStrategy || (ResolverStrategy = {}));
class Resolver {
    constructor(key, strategy, state) {
        this.key = key;
        this.strategy = strategy;
        this.state = state;
        this.resolving = false;
    }
    get $isResolver() { return true; }
    register(container, key) {
        return container.registerResolver(key || this.key, this);
    }
    resolve(handler, requestor) {
        switch (this.strategy) {
            case 0:
                return this.state;
            case 1: {
                if (this.resolving) {
                    {
                        throw new Error(`AUR0003: Cyclic dependency found: ${this.state.name}`);
                    }
                }
                this.resolving = true;
                this.state = handler.getFactory(this.state).construct(requestor);
                this.strategy = 0;
                this.resolving = false;
                return this.state;
            }
            case 2: {
                const factory = handler.getFactory(this.state);
                if (factory === null) {
                    {
                        throw new Error(`AUR0004: Resolver for ${String(this.key)} returned a null factory`);
                    }
                }
                return factory.construct(requestor);
            }
            case 3:
                return this.state(handler, requestor, this);
            case 4:
                return this.state[0].resolve(handler, requestor);
            case 5:
                return requestor.get(this.state);
            default:
                {
                    throw new Error(`AUR0005: Invalid resolver strategy specified: ${this.strategy}.`);
                }
        }
    }
    getFactory(container) {
        var _a, _b, _c;
        switch (this.strategy) {
            case 1:
            case 2:
                return container.getFactory(this.state);
            case 5:
                return (_c = (_b = (_a = container.getResolver(this.state)) === null || _a === void 0 ? void 0 : _a.getFactory) === null || _b === void 0 ? void 0 : _b.call(_a, container)) !== null && _c !== void 0 ? _c : null;
            default:
                return null;
        }
    }
}
function containerGetKey(d) {
    return this.get(d);
}
function transformInstance(inst, transform) {
    return transform(inst);
}
class Factory {
    constructor(Type, dependencies) {
        this.Type = Type;
        this.dependencies = dependencies;
        this.transformers = null;
    }
    construct(container, dynamicDependencies) {
        let instance;
        if (dynamicDependencies === void 0) {
            instance = new this.Type(...this.dependencies.map(containerGetKey, container));
        }
        else {
            instance = new this.Type(...this.dependencies.map(containerGetKey, container), ...dynamicDependencies);
        }
        if (this.transformers == null) {
            return instance;
        }
        return this.transformers.reduce(transformInstance, instance);
    }
    registerTransformer(transformer) {
        var _a;
        ((_a = this.transformers) !== null && _a !== void 0 ? _a : (this.transformers = [])).push(transformer);
    }
}
const containerResolver = {
    $isResolver: true,
    resolve(handler, requestor) {
        return requestor;
    }
};
function isRegistry(obj) {
    return isFunction(obj.register);
}
function isSelfRegistry(obj) {
    return isRegistry(obj) && typeof obj.registerInRequestor === 'boolean';
}
function isRegisterInRequester(obj) {
    return isSelfRegistry(obj) && obj.registerInRequestor;
}
function isClass(obj) {
    return obj.prototype !== void 0;
}
function isResourceKey(key) {
    return isString(key) && key.indexOf(':') > 0;
}
const InstrinsicTypeNames = new Set([
    'Array',
    'ArrayBuffer',
    'Boolean',
    'DataView',
    'Date',
    'Error',
    'EvalError',
    'Float32Array',
    'Float64Array',
    'Function',
    'Int8Array',
    'Int16Array',
    'Int32Array',
    'Map',
    'Number',
    'Object',
    'Promise',
    'RangeError',
    'ReferenceError',
    'RegExp',
    'Set',
    'SharedArrayBuffer',
    'String',
    'SyntaxError',
    'TypeError',
    'Uint8Array',
    'Uint8ClampedArray',
    'Uint16Array',
    'Uint32Array',
    'URIError',
    'WeakMap',
    'WeakSet',
]);
let containerId = 0;
class Container {
    constructor(parent, config) {
        this.parent = parent;
        this.config = config;
        this.id = ++containerId;
        this._registerDepth = 0;
        this._disposableResolvers = new Map();
        if (parent === null) {
            this.root = this;
            this._resolvers = new Map();
            this._factories = new Map();
            this.res = createObject();
        }
        else {
            this.root = parent.root;
            this._resolvers = new Map();
            this._factories = parent._factories;
            if (config.inheritParentResources) {
                this.res = Object.assign(createObject(), parent.res, this.root.res);
            }
            else {
                this.res = createObject();
            }
        }
        this._resolvers.set(IContainer, containerResolver);
    }
    get depth() {
        return this.parent === null ? 0 : this.parent.depth + 1;
    }
    register(...params) {
        if (++this._registerDepth === 100) {
            {
                throw new Error(`AUR0006: Unable to autoregister dependency: [${params.map(String)}]`);
            }
        }
        let current;
        let keys;
        let value;
        let j;
        let jj;
        let i = 0;
        let ii = params.length;
        for (; i < ii; ++i) {
            current = params[i];
            if (!metadata.isObject(current)) {
                continue;
            }
            if (isRegistry(current)) {
                current.register(this);
            }
            else if (Protocol.resource.has(current)) {
                const defs = Protocol.resource.getAll(current);
                if (defs.length === 1) {
                    defs[0].register(this);
                }
                else {
                    j = 0;
                    jj = defs.length;
                    while (jj > j) {
                        defs[j].register(this);
                        ++j;
                    }
                }
            }
            else if (isClass(current)) {
                Registration.singleton(current, current).register(this);
            }
            else {
                keys = Object.keys(current);
                j = 0;
                jj = keys.length;
                for (; j < jj; ++j) {
                    value = current[keys[j]];
                    if (!metadata.isObject(value)) {
                        continue;
                    }
                    if (isRegistry(value)) {
                        value.register(this);
                    }
                    else {
                        this.register(value);
                    }
                }
            }
        }
        --this._registerDepth;
        return this;
    }
    registerResolver(key, resolver, isDisposable = false) {
        validateKey(key);
        const resolvers = this._resolvers;
        const result = resolvers.get(key);
        if (result == null) {
            resolvers.set(key, resolver);
            if (isResourceKey(key)) {
                if (this.res[key] !== void 0) {
                    {
                        throw new Error(`AUR0007: Resource key "${key}" already registered`);
                    }
                }
                this.res[key] = resolver;
            }
        }
        else if (result instanceof Resolver && result.strategy === 4) {
            result.state.push(resolver);
        }
        else {
            resolvers.set(key, new Resolver(key, 4, [result, resolver]));
        }
        if (isDisposable) {
            this._disposableResolvers.set(key, resolver);
        }
        return resolver;
    }
    registerTransformer(key, transformer) {
        const resolver = this.getResolver(key);
        if (resolver == null) {
            return false;
        }
        if (resolver.getFactory) {
            const factory = resolver.getFactory(this);
            if (factory == null) {
                return false;
            }
            factory.registerTransformer(transformer);
            return true;
        }
        return false;
    }
    getResolver(key, autoRegister = true) {
        validateKey(key);
        if (key.resolve !== void 0) {
            return key;
        }
        let current = this;
        let resolver;
        while (current != null) {
            resolver = current._resolvers.get(key);
            if (resolver == null) {
                if (current.parent == null) {
                    const handler = (isRegisterInRequester(key)) ? this : current;
                    return autoRegister ? this._jitRegister(key, handler) : null;
                }
                current = current.parent;
            }
            else {
                return resolver;
            }
        }
        return null;
    }
    has(key, searchAncestors = false) {
        return this._resolvers.has(key)
            ? true
            : searchAncestors && this.parent != null
                ? this.parent.has(key, true)
                : false;
    }
    get(key) {
        validateKey(key);
        if (key.$isResolver) {
            return key.resolve(this, this);
        }
        let current = this;
        let resolver;
        while (current != null) {
            resolver = current._resolvers.get(key);
            if (resolver == null) {
                if (current.parent == null) {
                    const handler = (isRegisterInRequester(key)) ? this : current;
                    resolver = this._jitRegister(key, handler);
                    return resolver.resolve(current, this);
                }
                current = current.parent;
            }
            else {
                return resolver.resolve(current, this);
            }
        }
        {
            throw new Error(`AUR0008: Unable to resolve key: ${String(key)}`);
        }
    }
    getAll(key, searchAncestors = false) {
        validateKey(key);
        const requestor = this;
        let current = requestor;
        let resolver;
        if (searchAncestors) {
            let resolutions = emptyArray;
            while (current != null) {
                resolver = current._resolvers.get(key);
                if (resolver != null) {
                    resolutions = resolutions.concat(buildAllResponse(resolver, current, requestor));
                }
                current = current.parent;
            }
            return resolutions;
        }
        else {
            while (current != null) {
                resolver = current._resolvers.get(key);
                if (resolver == null) {
                    current = current.parent;
                    if (current == null) {
                        return emptyArray;
                    }
                }
                else {
                    return buildAllResponse(resolver, current, requestor);
                }
            }
        }
        return emptyArray;
    }
    invoke(Type, dynamicDependencies) {
        if (isNativeFunction(Type)) {
            throw createNativeInvocationError(Type);
        }
        if (dynamicDependencies === void 0) {
            return new Type(...getDependencies(Type).map(containerGetKey, this));
        }
        else {
            return new Type(...getDependencies(Type).map(containerGetKey, this), ...dynamicDependencies);
        }
    }
    getFactory(Type) {
        let factory = this._factories.get(Type);
        if (factory === void 0) {
            if (isNativeFunction(Type)) {
                throw createNativeInvocationError(Type);
            }
            this._factories.set(Type, factory = new Factory(Type, getDependencies(Type)));
        }
        return factory;
    }
    registerFactory(key, factory) {
        this._factories.set(key, factory);
    }
    createChild(config) {
        if (config === void 0 && this.config.inheritParentResources) {
            if (this.config === ContainerConfiguration.DEFAULT) {
                return new Container(this, this.config);
            }
            return new Container(this, ContainerConfiguration.from({
                ...this.config,
                inheritParentResources: false,
            }));
        }
        return new Container(this, ContainerConfiguration.from(config !== null && config !== void 0 ? config : this.config));
    }
    disposeResolvers() {
        const resolvers = this._resolvers;
        const disposableResolvers = this._disposableResolvers;
        let disposable;
        let key;
        for ([key, disposable] of disposableResolvers.entries()) {
            disposable.dispose();
            resolvers.delete(key);
        }
        disposableResolvers.clear();
    }
    find(kind, name) {
        const key = kind.keyFrom(name);
        let resolver = this.res[key];
        if (resolver === void 0) {
            resolver = this.root.res[key];
            if (resolver === void 0) {
                return null;
            }
        }
        if (resolver === null) {
            return null;
        }
        if (isFunction(resolver.getFactory)) {
            const factory = resolver.getFactory(this);
            if (factory === null || factory === void 0) {
                return null;
            }
            const definition = getOwnMetadata(kind.name, factory.Type);
            if (definition === void 0) {
                return null;
            }
            return definition;
        }
        return null;
    }
    create(kind, name) {
        var _a, _b;
        const key = kind.keyFrom(name);
        let resolver = this.res[key];
        if (resolver === void 0) {
            resolver = this.root.res[key];
            if (resolver === void 0) {
                return null;
            }
            return (_a = resolver.resolve(this.root, this)) !== null && _a !== void 0 ? _a : null;
        }
        return (_b = resolver.resolve(this, this)) !== null && _b !== void 0 ? _b : null;
    }
    dispose() {
        if (this._disposableResolvers.size > 0) {
            this.disposeResolvers();
        }
        this._resolvers.clear();
    }
    _jitRegister(keyAsValue, handler) {
        if (!isFunction(keyAsValue)) {
            {
                throw new Error(`AUR0009: Attempted to jitRegister something that is not a constructor: '${keyAsValue}'. Did you forget to register this resource?`);
            }
        }
        if (InstrinsicTypeNames.has(keyAsValue.name)) {
            {
                throw new Error(`AUR0010: Attempted to jitRegister an intrinsic type: ${keyAsValue.name}. Did you forget to add @inject(Key)`);
            }
        }
        if (isRegistry(keyAsValue)) {
            const registrationResolver = keyAsValue.register(handler, keyAsValue);
            if (!(registrationResolver instanceof Object) || registrationResolver.resolve == null) {
                const newResolver = handler._resolvers.get(keyAsValue);
                if (newResolver != null) {
                    return newResolver;
                }
                {
                    throw new Error(`AUR0011: Invalid resolver returned from the static register method`);
                }
            }
            return registrationResolver;
        }
        else if (Protocol.resource.has(keyAsValue)) {
            const defs = Protocol.resource.getAll(keyAsValue);
            if (defs.length === 1) {
                defs[0].register(handler);
            }
            else {
                const len = defs.length;
                for (let d = 0; d < len; ++d) {
                    defs[d].register(handler);
                }
            }
            const newResolver = handler._resolvers.get(keyAsValue);
            if (newResolver != null) {
                return newResolver;
            }
            {
                throw new Error(`AUR0011: Invalid resolver returned from the static register method`);
            }
        }
        else if (keyAsValue.$isInterface) {
            {
                throw new Error(`AUR0012: Attempted to jitRegister an interface: ${keyAsValue.friendlyName}`);
            }
        }
        else {
            const resolver = this.config.defaultResolver(keyAsValue, handler);
            handler._resolvers.set(keyAsValue, resolver);
            return resolver;
        }
    }
}
class ParameterizedRegistry {
    constructor(key, params) {
        this.key = key;
        this.params = params;
    }
    register(container) {
        if (container.has(this.key, true)) {
            const registry = container.get(this.key);
            registry.register(container, ...this.params);
        }
        else {
            container.register(...this.params.filter(x => typeof x === 'object'));
        }
    }
}
const containerLookup = new WeakMap();
function cacheCallbackResult(fun) {
    return function (handler, requestor, resolver) {
        let resolverLookup = containerLookup.get(handler);
        if (resolverLookup === void 0) {
            containerLookup.set(handler, resolverLookup = new WeakMap());
        }
        if (resolverLookup.has(resolver)) {
            return resolverLookup.get(resolver);
        }
        const t = fun(handler, requestor, resolver);
        resolverLookup.set(resolver, t);
        return t;
    };
}
const Registration = {
    instance(key, value) {
        return new Resolver(key, 0, value);
    },
    singleton(key, value) {
        return new Resolver(key, 1, value);
    },
    transient(key, value) {
        return new Resolver(key, 2, value);
    },
    callback(key, callback) {
        return new Resolver(key, 3, callback);
    },
    cachedCallback(key, callback) {
        return new Resolver(key, 3, cacheCallbackResult(callback));
    },
    aliasTo(originalKey, aliasKey) {
        return new Resolver(aliasKey, 5, originalKey);
    },
    defer(key, ...params) {
        return new ParameterizedRegistry(key, params);
    }
};
class InstanceProvider {
    constructor(name, instance) {
        this._instance = null;
        this._name = name;
        if (instance !== void 0) {
            this._instance = instance;
        }
    }
    get friendlyName() {
        return this._name;
    }
    prepare(instance) {
        this._instance = instance;
    }
    get $isResolver() { return true; }
    resolve() {
        if (this._instance == null) {
            {
                throw new Error(`AUR0013: Cannot call resolve ${this._name} before calling prepare or after calling dispose.`);
            }
        }
        return this._instance;
    }
    dispose() {
        this._instance = null;
    }
}
function validateKey(key) {
    if (key === null || key === void 0) {
        {
            throw new Error(`AUR0014: key/value cannot be null or undefined. Are you trying to inject/register something that doesn't exist with DI?`);
        }
    }
}
function buildAllResponse(resolver, handler, requestor) {
    if (resolver instanceof Resolver && resolver.strategy === 4) {
        const state = resolver.state;
        let i = state.length;
        const results = new Array(i);
        while (i--) {
            results[i] = state[i].resolve(handler, requestor);
        }
        return results;
    }
    return [resolver.resolve(handler, requestor)];
}
function createNativeInvocationError(Type) {
    {
        return new Error(`AUR0015: ${Type.name} is a native function and therefore cannot be safely constructed by DI. If this is intentional, please use a callback or cachedCallback resolver.`);
    }
}

const emptyArray = Object.freeze([]);
const emptyObject = Object.freeze({});
function noop() { }
const IPlatform = DI.createInterface('IPlatform');

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

exports.LogLevel = void 0;
(function (LogLevel) {
    LogLevel[LogLevel["trace"] = 0] = "trace";
    LogLevel[LogLevel["debug"] = 1] = "debug";
    LogLevel[LogLevel["info"] = 2] = "info";
    LogLevel[LogLevel["warn"] = 3] = "warn";
    LogLevel[LogLevel["error"] = 4] = "error";
    LogLevel[LogLevel["fatal"] = 5] = "fatal";
    LogLevel[LogLevel["none"] = 6] = "none";
})(exports.LogLevel || (exports.LogLevel = {}));
exports.ColorOptions = void 0;
(function (ColorOptions) {
    ColorOptions[ColorOptions["noColors"] = 0] = "noColors";
    ColorOptions[ColorOptions["colors"] = 1] = "colors";
})(exports.ColorOptions || (exports.ColorOptions = {}));
const ILogConfig = DI.createInterface('ILogConfig', x => x.instance(new LogConfig(0, 3)));
const ISink = DI.createInterface('ISink');
const ILogEventFactory = DI.createInterface('ILogEventFactory', x => x.singleton(exports.DefaultLogEventFactory));
const ILogger = DI.createInterface('ILogger', x => x.singleton(exports.DefaultLogger));
const ILogScopes = DI.createInterface('ILogScope');
const LoggerSink = Object.freeze({
    key: getAnnotationKeyFor('logger-sink-handles'),
    define(target, definition) {
        defineMetadata(this.key, definition.handles, target.prototype);
        return target;
    },
    getHandles(target) {
        return metadata.Metadata.get(this.key, target);
    },
});
function sink(definition) {
    return function (target) {
        return LoggerSink.define(target, definition);
    };
}
const format = toLookup({
    red(str) {
        return `\u001b[31m${str}\u001b[39m`;
    },
    green(str) {
        return `\u001b[32m${str}\u001b[39m`;
    },
    yellow(str) {
        return `\u001b[33m${str}\u001b[39m`;
    },
    blue(str) {
        return `\u001b[34m${str}\u001b[39m`;
    },
    magenta(str) {
        return `\u001b[35m${str}\u001b[39m`;
    },
    cyan(str) {
        return `\u001b[36m${str}\u001b[39m`;
    },
    white(str) {
        return `\u001b[37m${str}\u001b[39m`;
    },
    grey(str) {
        return `\u001b[90m${str}\u001b[39m`;
    },
});
class LogConfig {
    constructor(colorOptions, level) {
        this.colorOptions = colorOptions;
        this.level = level;
    }
}
const getLogLevelString = (function () {
    const logLevelString = [
        toLookup({
            TRC: 'TRC',
            DBG: 'DBG',
            INF: 'INF',
            WRN: 'WRN',
            ERR: 'ERR',
            FTL: 'FTL',
            QQQ: '???',
        }),
        toLookup({
            TRC: format.grey('TRC'),
            DBG: format.grey('DBG'),
            INF: format.white('INF'),
            WRN: format.yellow('WRN'),
            ERR: format.red('ERR'),
            FTL: format.red('FTL'),
            QQQ: format.grey('???'),
        }),
    ];
    return function (level, colorOptions) {
        if (level <= 0) {
            return logLevelString[colorOptions].TRC;
        }
        if (level <= 1) {
            return logLevelString[colorOptions].DBG;
        }
        if (level <= 2) {
            return logLevelString[colorOptions].INF;
        }
        if (level <= 3) {
            return logLevelString[colorOptions].WRN;
        }
        if (level <= 4) {
            return logLevelString[colorOptions].ERR;
        }
        if (level <= 5) {
            return logLevelString[colorOptions].FTL;
        }
        return logLevelString[colorOptions].QQQ;
    };
})();
function getScopeString(scope, colorOptions) {
    if (colorOptions === 0) {
        return scope.join('.');
    }
    return scope.map(format.cyan).join('.');
}
function getIsoString(timestamp, colorOptions) {
    if (colorOptions === 0) {
        return new Date(timestamp).toISOString();
    }
    return format.grey(new Date(timestamp).toISOString());
}
class DefaultLogEvent {
    constructor(severity, message, optionalParams, scope, colorOptions, timestamp) {
        this.severity = severity;
        this.message = message;
        this.optionalParams = optionalParams;
        this.scope = scope;
        this.colorOptions = colorOptions;
        this.timestamp = timestamp;
    }
    toString() {
        const { severity, message, scope, colorOptions, timestamp } = this;
        if (scope.length === 0) {
            return `${getIsoString(timestamp, colorOptions)} [${getLogLevelString(severity, colorOptions)}] ${message}`;
        }
        return `${getIsoString(timestamp, colorOptions)} [${getLogLevelString(severity, colorOptions)} ${getScopeString(scope, colorOptions)}] ${message}`;
    }
}
exports.DefaultLogEventFactory = class DefaultLogEventFactory {
    constructor(config) {
        this.config = config;
    }
    createLogEvent(logger, level, message, optionalParams) {
        return new DefaultLogEvent(level, message, optionalParams, logger.scope, this.config.colorOptions, Date.now());
    }
};
exports.DefaultLogEventFactory = __decorate([
    __param(0, ILogConfig)
], exports.DefaultLogEventFactory);
exports.ConsoleSink = class ConsoleSink {
    constructor(p) {
        const $console = p.console;
        this.handleEvent = function emit(event) {
            const optionalParams = event.optionalParams;
            if (optionalParams === void 0 || optionalParams.length === 0) {
                const msg = event.toString();
                switch (event.severity) {
                    case 0:
                    case 1:
                        return $console.debug(msg);
                    case 2:
                        return $console.info(msg);
                    case 3:
                        return $console.warn(msg);
                    case 4:
                    case 5:
                        return $console.error(msg);
                }
            }
            else {
                let msg = event.toString();
                let offset = 0;
                while (msg.includes('%s')) {
                    msg = msg.replace('%s', String(optionalParams[offset++]));
                }
                switch (event.severity) {
                    case 0:
                    case 1:
                        return $console.debug(msg, ...optionalParams.slice(offset));
                    case 2:
                        return $console.info(msg, ...optionalParams.slice(offset));
                    case 3:
                        return $console.warn(msg, ...optionalParams.slice(offset));
                    case 4:
                    case 5:
                        return $console.error(msg, ...optionalParams.slice(offset));
                }
            }
        };
    }
    static register(container) {
        Registration.singleton(ISink, ConsoleSink).register(container);
    }
};
exports.ConsoleSink = __decorate([
    __param(0, IPlatform)
], exports.ConsoleSink);
exports.DefaultLogger = class DefaultLogger {
    constructor(config, factory, sinks, scope = [], parent = null) {
        var _a, _b, _c, _d, _e, _f;
        this.config = config;
        this.factory = factory;
        this.scope = scope;
        this.scopedLoggers = createObject();
        let traceSinks;
        let debugSinks;
        let infoSinks;
        let warnSinks;
        let errorSinks;
        let fatalSinks;
        if (parent === null) {
            this.root = this;
            this.parent = this;
            traceSinks = this.traceSinks = [];
            debugSinks = this.debugSinks = [];
            infoSinks = this.infoSinks = [];
            warnSinks = this.warnSinks = [];
            errorSinks = this.errorSinks = [];
            fatalSinks = this.fatalSinks = [];
            for (const $sink of sinks) {
                const handles = LoggerSink.getHandles($sink);
                if ((_a = handles === null || handles === void 0 ? void 0 : handles.includes(0)) !== null && _a !== void 0 ? _a : true) {
                    traceSinks.push($sink);
                }
                if ((_b = handles === null || handles === void 0 ? void 0 : handles.includes(1)) !== null && _b !== void 0 ? _b : true) {
                    debugSinks.push($sink);
                }
                if ((_c = handles === null || handles === void 0 ? void 0 : handles.includes(2)) !== null && _c !== void 0 ? _c : true) {
                    infoSinks.push($sink);
                }
                if ((_d = handles === null || handles === void 0 ? void 0 : handles.includes(3)) !== null && _d !== void 0 ? _d : true) {
                    warnSinks.push($sink);
                }
                if ((_e = handles === null || handles === void 0 ? void 0 : handles.includes(4)) !== null && _e !== void 0 ? _e : true) {
                    errorSinks.push($sink);
                }
                if ((_f = handles === null || handles === void 0 ? void 0 : handles.includes(5)) !== null && _f !== void 0 ? _f : true) {
                    fatalSinks.push($sink);
                }
            }
        }
        else {
            this.root = parent.root;
            this.parent = parent;
            traceSinks = this.traceSinks = parent.traceSinks;
            debugSinks = this.debugSinks = parent.debugSinks;
            infoSinks = this.infoSinks = parent.infoSinks;
            warnSinks = this.warnSinks = parent.warnSinks;
            errorSinks = this.errorSinks = parent.errorSinks;
            fatalSinks = this.fatalSinks = parent.fatalSinks;
        }
    }
    trace(messageOrGetMessage, ...optionalParams) {
        if (this.config.level <= 0) {
            this.emit(this.traceSinks, 0, messageOrGetMessage, optionalParams);
        }
    }
    debug(messageOrGetMessage, ...optionalParams) {
        if (this.config.level <= 1) {
            this.emit(this.debugSinks, 1, messageOrGetMessage, optionalParams);
        }
    }
    info(messageOrGetMessage, ...optionalParams) {
        if (this.config.level <= 2) {
            this.emit(this.infoSinks, 2, messageOrGetMessage, optionalParams);
        }
    }
    warn(messageOrGetMessage, ...optionalParams) {
        if (this.config.level <= 3) {
            this.emit(this.warnSinks, 3, messageOrGetMessage, optionalParams);
        }
    }
    error(messageOrGetMessage, ...optionalParams) {
        if (this.config.level <= 4) {
            this.emit(this.errorSinks, 4, messageOrGetMessage, optionalParams);
        }
    }
    fatal(messageOrGetMessage, ...optionalParams) {
        if (this.config.level <= 5) {
            this.emit(this.fatalSinks, 5, messageOrGetMessage, optionalParams);
        }
    }
    scopeTo(name) {
        const scopedLoggers = this.scopedLoggers;
        let scopedLogger = scopedLoggers[name];
        if (scopedLogger === void 0) {
            scopedLogger = scopedLoggers[name] = new DefaultLogger(this.config, this.factory, (void 0), this.scope.concat(name), this);
        }
        return scopedLogger;
    }
    emit(sinks, level, msgOrGetMsg, optionalParams) {
        const message = (isFunction(msgOrGetMsg) ? msgOrGetMsg() : msgOrGetMsg);
        const event = this.factory.createLogEvent(this, level, message, optionalParams);
        for (let i = 0, ii = sinks.length; i < ii; ++i) {
            sinks[i].handleEvent(event);
        }
    }
};
__decorate([
    bound
], exports.DefaultLogger.prototype, "trace", null);
__decorate([
    bound
], exports.DefaultLogger.prototype, "debug", null);
__decorate([
    bound
], exports.DefaultLogger.prototype, "info", null);
__decorate([
    bound
], exports.DefaultLogger.prototype, "warn", null);
__decorate([
    bound
], exports.DefaultLogger.prototype, "error", null);
__decorate([
    bound
], exports.DefaultLogger.prototype, "fatal", null);
exports.DefaultLogger = __decorate([
    __param(0, ILogConfig),
    __param(1, ILogEventFactory),
    __param(2, all(ISink)),
    __param(3, optional(ILogScopes)),
    __param(4, ignore)
], exports.DefaultLogger);
const LoggerConfiguration = toLookup({
    create({ level = 3, colorOptions = 0, sinks = [], } = {}) {
        return toLookup({
            register(container) {
                container.register(Registration.instance(ILogConfig, new LogConfig(colorOptions, level)));
                for (const $sink of sinks) {
                    if (isFunction($sink)) {
                        container.register(Registration.singleton(ISink, $sink));
                    }
                    else {
                        container.register($sink);
                    }
                }
                return container;
            },
        });
    },
});

const IModuleLoader = DI.createInterface(x => x.singleton(ModuleLoader));
function noTransform(m) {
    return m;
}
class ModuleTransformer {
    constructor($transform) {
        this.$transform = $transform;
        this._promiseCache = new Map();
        this._objectCache = new Map();
    }
    transform(objOrPromise) {
        if (objOrPromise instanceof Promise) {
            return this._transformPromise(objOrPromise);
        }
        else if (typeof objOrPromise === 'object' && objOrPromise !== null) {
            return this._transformObject(objOrPromise);
        }
        else {
            throw new Error(`Invalid input: ${String(objOrPromise)}. Expected Promise or Object.`);
        }
    }
    _transformPromise(promise) {
        if (this._promiseCache.has(promise)) {
            return this._promiseCache.get(promise);
        }
        const ret = promise.then(obj => {
            return this._transformObject(obj);
        });
        this._promiseCache.set(promise, ret);
        void ret.then(value => {
            this._promiseCache.set(promise, value);
        });
        return ret;
    }
    _transformObject(obj) {
        if (this._objectCache.has(obj)) {
            return this._objectCache.get(obj);
        }
        const ret = this.$transform(this._analyze(obj));
        this._objectCache.set(obj, ret);
        if (ret instanceof Promise) {
            void ret.then(value => {
                this._objectCache.set(obj, value);
            });
        }
        return ret;
    }
    _analyze(m) {
        if (m == null)
            throw new Error(`Invalid input: ${String(m)}. Expected Object.`);
        if (typeof m !== 'object')
            return new AnalyzedModule(m, []);
        let value;
        let isRegistry;
        let isConstructable;
        let definitions;
        const items = [];
        for (const key in m) {
            switch (typeof (value = m[key])) {
                case 'object':
                    if (value === null) {
                        continue;
                    }
                    isRegistry = isFunction(value.register);
                    isConstructable = false;
                    definitions = emptyArray;
                    break;
                case 'function':
                    isRegistry = isFunction(value.register);
                    isConstructable = value.prototype !== void 0;
                    definitions = Protocol.resource.getAll(value);
                    break;
                default:
                    continue;
            }
            items.push(new ModuleItem(key, value, isRegistry, isConstructable, definitions));
        }
        return new AnalyzedModule(m, items);
    }
}
class ModuleLoader {
    constructor() {
        this.transformers = new Map();
    }
    load(objOrPromise, transform = noTransform) {
        const transformers = this.transformers;
        let transformer = transformers.get(transform);
        if (transformer === void 0) {
            transformers.set(transform, transformer = new ModuleTransformer(transform));
        }
        return transformer.transform(objOrPromise);
    }
    dispose() {
        this.transformers.clear();
    }
}
class AnalyzedModule {
    constructor(raw, items) {
        this.raw = raw;
        this.items = items;
    }
}
class ModuleItem {
    constructor(key, value, isRegistry, isConstructable, definitions) {
        this.key = key;
        this.value = value;
        this.isRegistry = isRegistry;
        this.isConstructable = isConstructable;
        this.definitions = definitions;
    }
}

class Handler {
    constructor(messageType, callback) {
        this.messageType = messageType;
        this.callback = callback;
    }
    handle(message) {
        if (message instanceof this.messageType) {
            this.callback.call(null, message);
        }
    }
}
const IEventAggregator = DI.createInterface('IEventAggregator', x => x.singleton(EventAggregator));
class EventAggregator {
    constructor() {
        this.eventLookup = {};
        this.messageHandlers = [];
    }
    publish(channelOrInstance, message) {
        if (!channelOrInstance) {
            throw new Error(`Invalid channel name or instance: ${channelOrInstance}.`);
        }
        if (isString(channelOrInstance)) {
            let subscribers = this.eventLookup[channelOrInstance];
            if (subscribers !== void 0) {
                subscribers = subscribers.slice();
                let i = subscribers.length;
                while (i-- > 0) {
                    subscribers[i](message, channelOrInstance);
                }
            }
        }
        else {
            const subscribers = this.messageHandlers.slice();
            let i = subscribers.length;
            while (i-- > 0) {
                subscribers[i].handle(channelOrInstance);
            }
        }
    }
    subscribe(channelOrType, callback) {
        if (!channelOrType) {
            throw new Error(`Invalid channel name or type: ${channelOrType}.`);
        }
        let handler;
        let subscribers;
        if (isString(channelOrType)) {
            if (this.eventLookup[channelOrType] === void 0) {
                this.eventLookup[channelOrType] = [];
            }
            handler = callback;
            subscribers = this.eventLookup[channelOrType];
        }
        else {
            handler = new Handler(channelOrType, callback);
            subscribers = this.messageHandlers;
        }
        subscribers.push(handler);
        return {
            dispose() {
                const idx = subscribers.indexOf(handler);
                if (idx !== -1) {
                    subscribers.splice(idx, 1);
                }
            }
        };
    }
    subscribeOnce(channelOrType, callback) {
        const sub = this.subscribe(channelOrType, function (message, event) {
            sub.dispose();
            callback(message, event);
        });
        return sub;
    }
}

exports.AnalyzedModule = AnalyzedModule;
exports.ContainerConfiguration = ContainerConfiguration;
exports.DI = DI;
exports.DefaultLogEvent = DefaultLogEvent;
exports.DefaultResolver = DefaultResolver;
exports.EventAggregator = EventAggregator;
exports.IContainer = IContainer;
exports.IEventAggregator = IEventAggregator;
exports.ILogConfig = ILogConfig;
exports.ILogEventFactory = ILogEventFactory;
exports.ILogger = ILogger;
exports.IModuleLoader = IModuleLoader;
exports.IPlatform = IPlatform;
exports.IServiceLocator = IServiceLocator;
exports.ISink = ISink;
exports.InstanceProvider = InstanceProvider;
exports.LogConfig = LogConfig;
exports.LoggerConfiguration = LoggerConfiguration;
exports.ModuleItem = ModuleItem;
exports.Protocol = Protocol;
exports.Registration = Registration;
exports.all = all;
exports.bound = bound;
exports.camelCase = camelCase;
exports.compareNumber = compareNumber;
exports.emptyArray = emptyArray;
exports.emptyObject = emptyObject;
exports.factory = factory;
exports.firstDefined = firstDefined;
exports.format = format;
exports.fromAnnotationOrDefinitionOrTypeOrDefault = fromAnnotationOrDefinitionOrTypeOrDefault;
exports.fromAnnotationOrTypeOrDefault = fromAnnotationOrTypeOrDefault;
exports.fromDefinitionOrDefault = fromDefinitionOrDefault;
exports.getPrototypeChain = getPrototypeChain;
exports.ignore = ignore;
exports.inject = inject;
exports.isArrayIndex = isArrayIndex;
exports.isNativeFunction = isNativeFunction;
exports.isNumberOrBigInt = isNumberOrBigInt;
exports.isStringOrDate = isStringOrDate;
exports.kebabCase = kebabCase;
exports.lazy = lazy;
exports.mergeArrays = mergeArrays;
exports.mergeDistinct = mergeDistinct;
exports.mergeObjects = mergeObjects;
exports.newInstanceForScope = newInstanceForScope;
exports.newInstanceOf = newInstanceOf;
exports.nextId = nextId;
exports.noop = noop;
exports.onResolve = onResolve;
exports.optional = optional;
exports.pascalCase = pascalCase;
exports.resetId = resetId;
exports.resolveAll = resolveAll;
exports.singleton = singleton;
exports.sink = sink;
exports.toArray = toArray;
exports.transient = transient;
//# sourceMappingURL=index.dev.cjs.map
