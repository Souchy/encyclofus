/**
 * This is the minimum required runtime modules for HMR
 */
export declare const hmrRuntimeModules: string[];
/**
 * This is the minimum required metadata modules for HMR
 */
export declare const hmrMetadataModules: string[];
/**
 * This gets the generated HMR code for the specified class
 *
 * @param className - The name of the class to generate HMR code for
 * @param moduleText -  Usually module but Vite uses import instead
 * @param type - CustomElement | CustomAttribute
 * @returns Generated HMR code
 */
export declare const getHmrCode: (className: string, moduleText?: string) => string;
//# sourceMappingURL=hmr.d.ts.map