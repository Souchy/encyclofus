import { preprocessOptions, preprocess } from '@aurelia/plugin-conventions';
import { getOptions } from 'loader-utils';

function index (contents, sourceMap) {
    return loader.call(this, contents);
}
function loader(contents, _preprocess = preprocess) {
    this.cacheable && this.cacheable();
    const cb = this.async();
    const options = getOptions(this);
    const filePath = this.resourcePath;
    try {
        const result = _preprocess({ path: filePath, contents }, preprocessOptions(options || {}));
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

export { index as default, loader };
//# sourceMappingURL=index.mjs.map
