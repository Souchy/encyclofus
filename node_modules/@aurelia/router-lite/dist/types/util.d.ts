import { type Params } from './instructions';
import { RouteNode } from './route-tree';
export declare type UnwrapPromise<T> = T extends Promise<infer R> ? R : T;
export declare class Batch {
    private stack;
    private cb;
    done: boolean;
    readonly head: Batch;
    private next;
    private constructor();
    static start(cb: (b: Batch) => void): Batch;
    push(): void;
    pop(): void;
    private invoke;
    continueWith(cb: (b: Batch) => void): Batch;
    start(): Batch;
}
export declare function mergeDistinct(prev: RouteNode[], next: RouteNode[]): RouteNode[];
export declare function tryStringify(value: unknown): string;
export declare function ensureArrayOfStrings(value: string | string[]): string[];
export declare function ensureString(value: string | string[]): string;
export declare function mergeURLSearchParams(source: URLSearchParams, other: Params | null, clone: boolean): URLSearchParams;
//# sourceMappingURL=util.d.ts.map