'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function isObject(value) {
    return typeof value === 'object' && value !== null || typeof value === 'function';
}
function isNullOrUndefined(value) {
    return value === null || value === void 0;
}
let metadataInternalSlot = new WeakMap();
function $typeError(operation, args, paramName, actualValue, expectedType) {
    return new TypeError(`${operation}(${args.map(String).join(',')}) - Expected '${paramName}' to be of type ${expectedType}, but got: ${Object.prototype.toString.call(actualValue)} (${String(actualValue)})`);
}
function toPropertyKeyOrUndefined(propertyKey) {
    switch (typeof propertyKey) {
        case 'undefined':
        case 'string':
        case 'symbol':
            return propertyKey;
        default:
            return `${propertyKey}`;
    }
}
function toPropertyKey(propertyKey) {
    switch (typeof propertyKey) {
        case 'string':
        case 'symbol':
            return propertyKey;
        default:
            return `${propertyKey}`;
    }
}
function ensurePropertyKeyOrUndefined(propertyKey) {
    switch (typeof propertyKey) {
        case 'undefined':
        case 'string':
        case 'symbol':
            return propertyKey;
        default:
            throw new TypeError(`Invalid metadata propertyKey: ${propertyKey}.`);
    }
}
function GetOrCreateMetadataMap(O, P, Create) {
    let targetMetadata = metadataInternalSlot.get(O);
    if (targetMetadata === void 0) {
        if (!Create) {
            return void 0;
        }
        targetMetadata = new Map();
        metadataInternalSlot.set(O, targetMetadata);
    }
    let metadataMap = targetMetadata.get(P);
    if (metadataMap === void 0) {
        if (!Create) {
            return void 0;
        }
        metadataMap = new Map();
        targetMetadata.set(P, metadataMap);
    }
    return metadataMap;
}
function OrdinaryHasOwnMetadata(MetadataKey, O, P) {
    const metadataMap = GetOrCreateMetadataMap(O, P, false);
    if (metadataMap === void 0) {
        return false;
    }
    return metadataMap.has(MetadataKey);
}
function OrdinaryHasMetadata(MetadataKey, O, P) {
    if (OrdinaryHasOwnMetadata(MetadataKey, O, P)) {
        return true;
    }
    const parent = Object.getPrototypeOf(O);
    if (parent !== null) {
        return OrdinaryHasMetadata(MetadataKey, parent, P);
    }
    return false;
}
function OrdinaryGetOwnMetadata(MetadataKey, O, P) {
    const metadataMap = GetOrCreateMetadataMap(O, P, false);
    if (metadataMap === void 0) {
        return void 0;
    }
    return metadataMap.get(MetadataKey);
}
function OrdinaryGetMetadata(MetadataKey, O, P) {
    if (OrdinaryHasOwnMetadata(MetadataKey, O, P)) {
        return OrdinaryGetOwnMetadata(MetadataKey, O, P);
    }
    const parent = Object.getPrototypeOf(O);
    if (parent !== null) {
        return OrdinaryGetMetadata(MetadataKey, parent, P);
    }
    return void 0;
}
function OrdinaryDefineOwnMetadata(MetadataKey, MetadataValue, O, P) {
    const metadataMap = GetOrCreateMetadataMap(O, P, true);
    metadataMap.set(MetadataKey, MetadataValue);
}
function OrdinaryOwnMetadataKeys(O, P) {
    const keys = [];
    const metadataMap = GetOrCreateMetadataMap(O, P, false);
    if (metadataMap === void 0) {
        return keys;
    }
    const keysObj = metadataMap.keys();
    let k = 0;
    for (const key of keysObj) {
        keys[k] = key;
        ++k;
    }
    return keys;
}
function OrdinaryMetadataKeys(O, P) {
    const ownKeys = OrdinaryOwnMetadataKeys(O, P);
    const parent = Object.getPrototypeOf(O);
    if (parent === null) {
        return ownKeys;
    }
    const parentKeys = OrdinaryMetadataKeys(parent, P);
    const ownKeysLen = ownKeys.length;
    if (ownKeysLen === 0) {
        return parentKeys;
    }
    const parentKeysLen = parentKeys.length;
    if (parentKeysLen === 0) {
        return ownKeys;
    }
    const set = new Set();
    const keys = [];
    let k = 0;
    let key;
    for (let i = 0; i < ownKeysLen; ++i) {
        key = ownKeys[i];
        if (!set.has(key)) {
            set.add(key);
            keys[k] = key;
            ++k;
        }
    }
    for (let i = 0; i < parentKeysLen; ++i) {
        key = parentKeys[i];
        if (!set.has(key)) {
            set.add(key);
            keys[k] = key;
            ++k;
        }
    }
    return keys;
}
function OrdinaryDeleteMetadata(O, MetadataKey, P) {
    const metadataMap = GetOrCreateMetadataMap(O, P, false);
    if (metadataMap === void 0) {
        return false;
    }
    return metadataMap.delete(MetadataKey);
}
function metadata(metadataKey, metadataValue) {
    function decorator(target, propertyKey) {
        if (!isObject(target)) {
            throw $typeError('@metadata', [metadataKey, metadataValue, target, propertyKey], 'target', target, 'Object or Function');
        }
        OrdinaryDefineOwnMetadata(metadataKey, metadataValue, target, ensurePropertyKeyOrUndefined(propertyKey));
    }
    return decorator;
}
function decorate(decorators, target, propertyKey, attributes) {
    if (propertyKey !== void 0) {
        if (!Array.isArray(decorators)) {
            throw $typeError('Metadata.decorate', [decorators, target, propertyKey, attributes], 'decorators', decorators, 'Array');
        }
        if (!isObject(target)) {
            throw $typeError('Metadata.decorate', [decorators, target, propertyKey, attributes], 'target', target, 'Object or Function');
        }
        if (!isObject(attributes) && !isNullOrUndefined(attributes)) {
            throw $typeError('Metadata.decorate', [decorators, target, propertyKey, attributes], 'attributes', attributes, 'Object, Function, null, or undefined');
        }
        if (attributes === null) {
            attributes = void 0;
        }
        propertyKey = toPropertyKey(propertyKey);
        return DecorateProperty(decorators, target, propertyKey, attributes);
    }
    else {
        if (!Array.isArray(decorators)) {
            throw $typeError('Metadata.decorate', [decorators, target, propertyKey, attributes], 'decorators', decorators, 'Array');
        }
        if (typeof target !== 'function') {
            throw $typeError('Metadata.decorate', [decorators, target, propertyKey, attributes], 'target', target, 'Function');
        }
        return DecorateConstructor(decorators, target);
    }
}
function DecorateConstructor(decorators, target) {
    for (let i = decorators.length - 1; i >= 0; --i) {
        const decorator = decorators[i];
        const decorated = decorator(target);
        if (!isNullOrUndefined(decorated)) {
            if (typeof decorated !== 'function') {
                throw $typeError('DecorateConstructor', [decorators, target], 'decorated', decorated, 'Function, null, or undefined');
            }
            target = decorated;
        }
    }
    return target;
}
function DecorateProperty(decorators, target, propertyKey, descriptor) {
    for (let i = decorators.length - 1; i >= 0; --i) {
        const decorator = decorators[i];
        const decorated = decorator(target, propertyKey, descriptor);
        if (!isNullOrUndefined(decorated)) {
            if (!isObject(decorated)) {
                throw $typeError('DecorateProperty', [decorators, target, propertyKey, descriptor], 'decorated', decorated, 'Object, Function, null, or undefined');
            }
            descriptor = decorated;
        }
    }
    return descriptor;
}
function $define(metadataKey, metadataValue, target, propertyKey) {
    if (!isObject(target)) {
        throw $typeError('Metadata.define', [metadataKey, metadataValue, target, propertyKey], 'target', target, 'Object or Function');
    }
    return OrdinaryDefineOwnMetadata(metadataKey, metadataValue, target, toPropertyKeyOrUndefined(propertyKey));
}
function $has(metadataKey, target, propertyKey) {
    if (!isObject(target)) {
        throw $typeError('Metadata.has', [metadataKey, target, propertyKey], 'target', target, 'Object or Function');
    }
    return OrdinaryHasMetadata(metadataKey, target, toPropertyKeyOrUndefined(propertyKey));
}
function $hasOwn(metadataKey, target, propertyKey) {
    if (!isObject(target)) {
        throw $typeError('Metadata.hasOwn', [metadataKey, target, propertyKey], 'target', target, 'Object or Function');
    }
    return OrdinaryHasOwnMetadata(metadataKey, target, toPropertyKeyOrUndefined(propertyKey));
}
function $get(metadataKey, target, propertyKey) {
    if (!isObject(target)) {
        throw $typeError('Metadata.get', [metadataKey, target, propertyKey], 'target', target, 'Object or Function');
    }
    return OrdinaryGetMetadata(metadataKey, target, toPropertyKeyOrUndefined(propertyKey));
}
function $getOwn(metadataKey, target, propertyKey) {
    if (!isObject(target)) {
        throw $typeError('Metadata.getOwn', [metadataKey, target, propertyKey], 'target', target, 'Object or Function');
    }
    return OrdinaryGetOwnMetadata(metadataKey, target, toPropertyKeyOrUndefined(propertyKey));
}
function $getKeys(target, propertyKey) {
    if (!isObject(target)) {
        throw $typeError('Metadata.getKeys', [target, propertyKey], 'target', target, 'Object or Function');
    }
    return OrdinaryMetadataKeys(target, toPropertyKeyOrUndefined(propertyKey));
}
function $getOwnKeys(target, propertyKey) {
    if (!isObject(target)) {
        throw $typeError('Metadata.getOwnKeys', [target, propertyKey], 'target', target, 'Object or Function');
    }
    return OrdinaryOwnMetadataKeys(target, toPropertyKeyOrUndefined(propertyKey));
}
function $delete(metadataKey, target, propertyKey) {
    if (!isObject(target)) {
        throw $typeError('Metadata.delete', [metadataKey, target, propertyKey], 'target', target, 'Object or Function');
    }
    return OrdinaryDeleteMetadata(target, metadataKey, toPropertyKeyOrUndefined(propertyKey));
}
const Metadata = {
    define: $define,
    has: $has,
    hasOwn: $hasOwn,
    get: $get,
    getOwn: $getOwn,
    getKeys: $getKeys,
    getOwnKeys: $getOwnKeys,
    delete: $delete,
};
function def(obj, key, value, writable, configurable) {
    if (!Reflect.defineProperty(obj, key, {
        writable,
        enumerable: false,
        configurable,
        value,
    })) {
        throw new Error(`Unable to apply metadata polyfill: could not add property '${key}' to the global Reflect object`);
    }
}
const internalSlotName = '[[$au]]';
function hasInternalSlot(reflect) {
    return internalSlotName in reflect;
}
function $applyMetadataPolyfill(reflect, writable, configurable) {
    def(reflect, internalSlotName, metadataInternalSlot, writable, configurable);
    def(reflect, 'metadata', metadata, writable, configurable);
    def(reflect, 'decorate', decorate, writable, configurable);
    def(reflect, 'defineMetadata', $define, writable, configurable);
    def(reflect, 'hasMetadata', $has, writable, configurable);
    def(reflect, 'hasOwnMetadata', $hasOwn, writable, configurable);
    def(reflect, 'getMetadata', $get, writable, configurable);
    def(reflect, 'getOwnMetadata', $getOwn, writable, configurable);
    def(reflect, 'getMetadataKeys', $getKeys, writable, configurable);
    def(reflect, 'getOwnMetadataKeys', $getOwnKeys, writable, configurable);
    def(reflect, 'deleteMetadata', $delete, writable, configurable);
}
function applyMetadataPolyfill(reflect, throwIfConflict = true, forceOverwrite = false, writable = true, configurable = true) {
    if (hasInternalSlot(reflect)) {
        if (reflect[internalSlotName] === metadataInternalSlot) {
            return;
        }
        if (reflect[internalSlotName] instanceof WeakMap) {
            metadataInternalSlot = reflect[internalSlotName];
            return;
        }
        throw new Error(`Conflicting @aurelia/metadata module import detected. Please make sure you have the same version of all Aurelia packages in your dependency tree.`);
    }
    const presentProps = [
        'metadata',
        'decorate',
        'defineMetadata',
        'hasMetadata',
        'hasOwnMetadata',
        'getMetadata',
        'getOwnMetadata',
        'getMetadataKeys',
        'getOwnMetadataKeys',
        'deleteMetadata',
    ].filter(function (p) {
        return p in Reflect;
    });
    if (presentProps.length > 0) {
        if (throwIfConflict) {
            const implementationSummary = presentProps.map(function (p) {
                const impl = `${Reflect[p].toString().slice(0, 100)}...`;
                return `${p}:\n${impl}`;
            }).join('\n\n');
            throw new Error(`Conflicting reflect.metadata polyfill found. If you have 'reflect-metadata' or any other reflect polyfill imported, please remove it, if not (or if you must use a specific polyfill) please file an issue at https://github.com/aurelia/aurelia/issues so that we can look into compatibility options for this scenario. Implementation summary:\n\n${implementationSummary}`);
        }
        else if (forceOverwrite) {
            $applyMetadataPolyfill(reflect, writable, configurable);
        }
    }
    else {
        $applyMetadataPolyfill(reflect, writable, configurable);
    }
}

exports.Metadata = Metadata;
exports.applyMetadataPolyfill = applyMetadataPolyfill;
exports.isNullOrUndefined = isNullOrUndefined;
exports.isObject = isObject;
exports.metadata = metadata;
//# sourceMappingURL=index.dev.cjs.map
