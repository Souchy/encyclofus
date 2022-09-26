import type { IContainer, IRegistry, Key, Resolved } from '@aurelia/kernel';
export declare type TaskSlot = 'creating' | 'hydrating' | 'hydrated' | 'activating' | 'activated' | 'deactivating' | 'deactivated';
export declare const IAppTask: import("@aurelia/kernel").InterfaceSymbol<IAppTask>;
export interface IAppTask extends Pick<$AppTask, 'slot' | 'run' | 'register'> {
}
declare class $AppTask<K extends Key = Key> {
    readonly slot: TaskSlot;
    constructor(slot: TaskSlot, key: K | null, cb: AppTaskCallback<K> | AppTaskCallbackNoArg);
    register(container: IContainer): IContainer;
    run(): void | Promise<void>;
}
export declare const AppTask: Readonly<{
    /**
     * Returns a task that will run just before the root component is created by DI
     */
    creating: {
        <T extends Key = Key>(callback: AppTaskCallbackNoArg): IRegistry;
        <T_1 extends Key = Key>(key: T_1, callback: AppTaskCallback<T_1>): IRegistry;
    };
    /**
     * Returns a task that will run after instantiating the root controller,
     * but before compiling its view (thus means before instantiating the child elements inside it)
     *
     * good chance for a router to do some initial work, or initial routing related in general
     */
    hydrating: {
        <T extends Key = Key>(callback: AppTaskCallbackNoArg): IRegistry;
        <T_1 extends Key = Key>(key: T_1, callback: AppTaskCallback<T_1>): IRegistry;
    };
    /**
     * Return a task that will run after the hydration of the root controller,
     * but before hydrating the child element inside
     *
     * good chance for a router to do some initial work, or initial routing related in general
     */
    hydrated: {
        <T extends Key = Key>(callback: AppTaskCallbackNoArg): IRegistry;
        <T_1 extends Key = Key>(key: T_1, callback: AppTaskCallback<T_1>): IRegistry;
    };
    /**
     * Return a task that will run right before the root component is activated.
     * In this phase, scope hierarchy is formed, and bindings are getting bound
     */
    activating: {
        <T extends Key = Key>(callback: AppTaskCallbackNoArg): IRegistry;
        <T_1 extends Key = Key>(key: T_1, callback: AppTaskCallback<T_1>): IRegistry;
    };
    /**
     * Return a task that will run right after the root component is activated - the app is now running
     */
    activated: {
        <T extends Key = Key>(callback: AppTaskCallbackNoArg): IRegistry;
        <T_1 extends Key = Key>(key: T_1, callback: AppTaskCallback<T_1>): IRegistry;
    };
    /**
     * Return a task that will runs right before the root component is deactivated.
     * In this phase, scope hierarchy is unlinked, and bindings are getting unbound
     */
    deactivating: {
        <T extends Key = Key>(callback: AppTaskCallbackNoArg): IRegistry;
        <T_1 extends Key = Key>(key: T_1, callback: AppTaskCallback<T_1>): IRegistry;
    };
    /**
     * Return a task that will run right after the root component is deactivated
     */
    deactivated: {
        <T extends Key = Key>(callback: AppTaskCallbackNoArg): IRegistry;
        <T_1 extends Key = Key>(key: T_1, callback: AppTaskCallback<T_1>): IRegistry;
    };
}>;
export declare type AppTaskCallbackNoArg = () => unknown | Promise<unknown>;
export declare type AppTaskCallback<T> = (arg: Resolved<T>) => unknown | Promise<unknown>;
export {};
//# sourceMappingURL=app-task.d.ts.map