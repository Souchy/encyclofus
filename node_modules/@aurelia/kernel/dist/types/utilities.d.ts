export declare type AnyFunction = (...args: any) => any;
export declare type FunctionPropNames<T> = {
    [K in keyof T]: K extends 'constructor' ? never : NonNullable<T[K]> extends AnyFunction ? K : never;
}[keyof T];
export declare type MaybePromise<T> = T | Promise<T>;
//# sourceMappingURL=utilities.d.ts.map