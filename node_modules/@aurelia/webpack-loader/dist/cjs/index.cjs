'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var pluginConventions = require('@aurelia/plugin-conventions');
var loaderUtils = require('loader-utils');

function index (contents, sourceMap) {
    return loader.call(this, contents);
}
function loader(contents, _preprocess = pluginConventions.preprocess) {
    this.cacheable && this.cacheable();
    const cb = this.async();
    const options = loaderUtils.getOptions(this);
    const filePath = this.resourcePath;
    try {
        const result = _preprocess({ path: filePath, contents }, pluginConventions.preprocessOptions(options || {}));
        if (result) {
            cb(null, result.code, result.map);
            return;
        }
        cb(null, contents);
    }
    catch (e) {
        cb(e);
    }
}

exports["default"] = index;
exports.loader = loader;
//# sourceMappingURL=index.cjs.map
