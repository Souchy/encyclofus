import { IEventAggregator } from '@aurelia/kernel';
import { INode, ICustomAttributeViewModel } from '@aurelia/runtime-html';
import { ILinkHandler } from './link-handler';
import { IRouter } from '../router';
export declare class LoadCustomAttribute implements ICustomAttributeViewModel {
    private readonly element;
    private readonly router;
    private readonly linkHandler;
    private readonly ea;
    value: unknown;
    private hasHref;
    private routerNavigationSubscription;
    private readonly activeClass;
    constructor(element: INode<Element>, router: IRouter, linkHandler: ILinkHandler, ea: IEventAggregator);
    binding(): void;
    unbinding(): void;
    valueChanged(_newValue: unknown): void;
    private updateValue;
    private readonly navigationEndHandler;
    private updateActive;
}
//# sourceMappingURL=load.d.ts.map