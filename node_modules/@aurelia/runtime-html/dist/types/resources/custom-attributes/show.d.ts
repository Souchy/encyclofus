import { INode } from '../../dom';
import { IPlatform } from '../../platform';
import type { ICustomAttributeViewModel } from '../../templating/controller';
import type { HydrateAttributeInstruction } from '../../renderer';
export declare class Show implements ICustomAttributeViewModel {
    private readonly el;
    private readonly p;
    value: unknown;
    constructor(el: INode<HTMLElement>, p: IPlatform, instr: HydrateAttributeInstruction);
    binding(): void;
    detaching(): void;
    valueChanged(): void;
    private $val;
    private $prio;
    private readonly update;
}
//# sourceMappingURL=show.d.ts.map