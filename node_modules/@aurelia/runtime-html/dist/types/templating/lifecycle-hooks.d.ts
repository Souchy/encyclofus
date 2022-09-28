import type { Constructable, IContainer, AnyFunction, FunctionPropNames } from '@aurelia/kernel';
export declare type LifecycleHook<TViewModel, TKey extends keyof TViewModel> = TViewModel[TKey] extends (AnyFunction | undefined) ? (vm: TViewModel, ...args: Parameters<NonNullable<TViewModel[TKey]>>) => ReturnType<NonNullable<TViewModel[TKey]>> : never;
export declare type ILifecycleHooks<TViewModel = {}, TKey extends keyof TViewModel = keyof TViewModel> = {
    [K in TKey]-?: LifecycleHook<TViewModel, K>;
};
export declare const ILifecycleHooks: import("@aurelia/kernel").InterfaceSymbol<ILifecycleHooks<object, never>>;
export declare type LifecycleHooksLookup<TViewModel = {}> = {
    [K in FunctionPropNames<TViewModel>]?: readonly LifecycleHooksEntry<TViewModel, K>[];
};
export declare class LifecycleHooksEntry<TViewModel = {}, TKey extends keyof TViewModel = keyof TViewModel, THooks extends Constructable = Constructable> {
    readonly definition: LifecycleHooksDefinition<THooks>;
    readonly instance: ILifecycleHooks<TViewModel, TKey>;
    constructor(definition: LifecycleHooksDefinition<THooks>, instance: ILifecycleHooks<TViewModel, TKey>);
}
/**
 * This definition has no specific properties yet other than the type, but is in place for future extensions.
 *
 * See: https://github.com/aurelia/aurelia/issues/1044
 */
export declare class LifecycleHooksDefinition<T extends Constructable = Constructable> {
    readonly Type: T;
    readonly propertyNames: ReadonlySet<string>;
    private constructor();
    /**
     * @param def - Placeholder for future extensions. Currently always an empty object.
     */
    static create<T extends Constructable>(def: {}, Type: T): LifecycleHooksDefinition<T>;
    register(container: IContainer): void;
}
export declare const LifecycleHooks: Readonly<{
    name: string;
    /**
     * @param def - Placeholder for future extensions. Currently always an empty object.
     */
    define<T extends Constructable<{}>>(def: {}, Type: T): T;
    /**
     * @param ctx - The container where the resolution starts
     * @param Type - The constructor of the Custom element/ Custom attribute with lifecycle metadata
     */
    resolve(ctx: IContainer): LifecycleHooksLookup;
}>;
/**
 * Decorator: Indicates that the decorated class is a custom element.
 */
export declare function lifecycleHooks(): <T extends Constructable>(target: T) => T;
//# sourceMappingURL=lifecycle-hooks.d.ts.map