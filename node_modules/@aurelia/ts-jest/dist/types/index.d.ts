import { preprocess } from '@aurelia/plugin-conventions';
import type { TransformOptions, TransformedSource } from '@jest/transform';
declare function _createTransformer(conventionsOptions?: {}, _preprocess?: typeof preprocess, _tsProcess?: (sourceText: string, sourcePath: string, transformOptions: import("ts-jest").TransformOptionsTsJest) => TransformedSource): {
    canInstrument: boolean;
    getCacheKey: (fileData: string, filePath: string, options: TransformOptions) => string;
    process: (sourceText: string, sourcePath: string, transformOptions: TransformOptions) => TransformedSource;
};
declare function createTransformer(conventionsOptions?: {}): {
    canInstrument: boolean;
    getCacheKey: (fileData: string, filePath: string, options: TransformOptions<unknown>) => string;
    process: (sourceText: string, sourcePath: string, transformOptions: TransformOptions<unknown>) => TransformedSource;
};
declare const _default: {
    canInstrument: boolean;
    getCacheKey: (fileData: string, filePath: string, options: TransformOptions<unknown>) => string;
    process: (sourceText: string, sourcePath: string, transformOptions: TransformOptions<unknown>) => TransformedSource;
    createTransformer: typeof createTransformer;
    _createTransformer: typeof _createTransformer;
};
export default _default;
//# sourceMappingURL=index.d.ts.map