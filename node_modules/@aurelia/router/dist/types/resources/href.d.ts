import { IEventAggregator } from '@aurelia/kernel';
import { INode, ICustomAttributeViewModel, ICustomAttributeController } from '@aurelia/runtime-html';
import { IRouter } from '../router';
import { ILinkHandler } from './link-handler';
export declare class HrefCustomAttribute implements ICustomAttributeViewModel {
    private readonly element;
    private readonly router;
    private readonly linkHandler;
    private readonly ea;
    value: string | undefined;
    readonly $controller: ICustomAttributeController<this>;
    private routerNavigationSubscription?;
    private readonly activeClass;
    constructor(element: INode<Element>, router: IRouter, linkHandler: ILinkHandler, ea: IEventAggregator);
    binding(): void;
    unbinding(): void;
    valueChanged(): void;
    private updateValue;
    private readonly navigationEndHandler;
    private updateActive;
    private hasLoad;
}
//# sourceMappingURL=href.d.ts.map