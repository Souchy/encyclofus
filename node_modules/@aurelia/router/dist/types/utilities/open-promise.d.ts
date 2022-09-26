/**
 * The OpenPromise provides an open API to a promise.
 */
export declare class OpenPromise<T = void> {
    /**
     * Whether the promise is still pending (not settled)
     */
    isPending: boolean;
    /**
     * The actual promise
     */
    promise: Promise<T>;
    /**
     * The resolve method of the promise
     */
    private _resolve;
    /**
     * The reject method of the promise
     */
    private _reject;
    constructor();
    /**
     * Resolve the (open) promise.
     *
     * @param value - The value to resolve with
     */
    resolve(value?: T | PromiseLike<T>): void;
    /**
     * Reject the (open) promise.
     *
     * @param reason - The reason the promise is rejected
     */
    reject(reason?: any): void;
}
//# sourceMappingURL=open-promise.d.ts.map