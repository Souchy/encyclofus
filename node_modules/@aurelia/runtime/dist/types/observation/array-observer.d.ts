import { LifecycleFlags, AccessorType, ISubscriberCollection, ICollectionSubscriberCollection } from '../observation';
import { CollectionLengthObserver } from './collection-length-observer';
import type { CollectionKind, ICollectionObserver, IArrayIndexObserver, IndexMap, ISubscriber } from '../observation';
export declare function enableArrayObservation(): void;
export declare function disableArrayObservation(): void;
export interface ArrayObserver extends ICollectionObserver<CollectionKind.array>, ICollectionSubscriberCollection {
}
export declare class ArrayObserver {
    type: AccessorType;
    private readonly indexObservers;
    private lenObs?;
    constructor(array: unknown[]);
    notify(): void;
    getLengthObserver(): CollectionLengthObserver;
    getIndexObserver(index: number): IArrayIndexObserver;
}
export interface ArrayIndexObserver extends IArrayIndexObserver, ISubscriberCollection {
}
export declare class ArrayIndexObserver implements IArrayIndexObserver {
    readonly owner: ArrayObserver;
    readonly index: number;
    doNotCache: boolean;
    value: unknown;
    constructor(owner: ArrayObserver, index: number);
    getValue(): unknown;
    setValue(newValue: unknown, flag: LifecycleFlags): void;
    /**
     * From interface `ICollectionSubscriber`
     */
    handleCollectionChange(indexMap: IndexMap, flags: LifecycleFlags): void;
    subscribe(subscriber: ISubscriber): void;
    unsubscribe(subscriber: ISubscriber): void;
}
export declare function getArrayObserver(array: unknown[]): ArrayObserver;
/**
 * Applies offsets to the non-negative indices in the IndexMap
 * based on added and deleted items relative to those indices.
 *
 * e.g. turn `[-2, 0, 1]` into `[-2, 1, 2]`, allowing the values at the indices to be
 * used for sorting/reordering items if needed
 */
export declare function applyMutationsToIndices(indexMap: IndexMap): IndexMap;
/**
 * After `applyMutationsToIndices`, this function can be used to reorder items in a derived
 * array (e.g.  the items in the `views` in the repeater are derived from the `items` property)
 */
export declare function synchronizeIndices<T>(items: T[], indexMap: IndexMap): void;
//# sourceMappingURL=array-observer.d.ts.map