'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var pluginConventions = require('@aurelia/plugin-conventions');
var tsJest = require('ts-jest');
var path = require('path');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e["default"] : e; }

function _interopNamespace(e) {
    if (e && e.__esModule) return e;
    var n = Object.create(null);
    if (e) {
        for (var k in e) {
            n[k] = e[k];
        }
    }
    n["default"] = e;
    return Object.freeze(n);
}

var tsJest__default = /*#__PURE__*/_interopDefaultLegacy(tsJest);
var path__namespace = /*#__PURE__*/_interopNamespace(path);

const tsTransformer = tsJest__default.createTransformer();
function _createTransformer(conventionsOptions = {}, _preprocess = pluginConventions.preprocess, _tsProcess = tsTransformer.process.bind(tsTransformer)) {
    const au2Options = pluginConventions.preprocessOptions(conventionsOptions);
    function getCacheKey(fileData, filePath, options) {
        const tsKey = tsTransformer.getCacheKey(fileData, filePath, options);
        return `${tsKey}:${JSON.stringify(au2Options)}`;
    }
    function process(sourceText, sourcePath, transformOptions) {
        const result = _preprocess({ path: sourcePath, contents: sourceText }, au2Options);
        let newSourcePath = sourcePath;
        if (result !== undefined) {
            let newCode = result.code;
            if (au2Options.templateExtensions.includes(path__namespace.extname(sourcePath))) {
                newSourcePath += '.ts';
                newCode = `// @ts-nocheck\n${newCode}`;
            }
            return _tsProcess(newCode, newSourcePath, transformOptions);
        }
        return _tsProcess(sourceText, sourcePath, transformOptions);
    }
    return {
        canInstrument: false,
        getCacheKey,
        process
    };
}
function createTransformer(conventionsOptions = {}) {
    return _createTransformer(conventionsOptions);
}
const { canInstrument, getCacheKey, process } = createTransformer();
var index = { canInstrument, getCacheKey, process, createTransformer, _createTransformer };

exports["default"] = index;
//# sourceMappingURL=index.cjs.map
