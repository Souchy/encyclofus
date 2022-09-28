import { AccessorType, ICollectionSubscriberCollection } from '../observation';
import { CollectionSizeObserver } from './collection-length-observer';
import type { ICollectionObserver, CollectionKind } from '../observation';
export declare function enableSetObservation(): void;
export declare function disableSetObservation(): void;
export interface SetObserver extends ICollectionObserver<CollectionKind.set>, ICollectionSubscriberCollection {
}
export declare class SetObserver {
    type: AccessorType;
    private lenObs?;
    constructor(observedSet: Set<unknown>);
    notify(): void;
    getLengthObserver(): CollectionSizeObserver;
}
export declare function getSetObserver(observedSet: Set<unknown>): SetObserver;
//# sourceMappingURL=set-observer.d.ts.map