import { AccessorType, LifecycleFlags } from '../observation';
import type { IAccessor } from '../observation';
export declare class PropertyAccessor implements IAccessor {
    type: AccessorType;
    getValue(obj: object, key: string): unknown;
    setValue(value: unknown, flags: LifecycleFlags, obj: object, key: string): void;
}
//# sourceMappingURL=property-accessor.d.ts.map