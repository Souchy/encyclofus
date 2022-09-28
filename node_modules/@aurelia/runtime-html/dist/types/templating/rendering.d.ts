import { IContainer } from '@aurelia/kernel';
import { INode, INodeSequence } from '../dom';
import { ICompliationInstruction, IRenderer } from '../renderer';
import { CustomElementDefinition, PartialCustomElementDefinition } from '../resources/custom-element';
import { IViewFactory } from './view';
import type { IHydratableController } from './controller';
export declare const IRendering: import("@aurelia/kernel").InterfaceSymbol<IRendering>;
export interface IRendering extends Rendering {
}
export declare class Rendering {
    private rs;
    get renderers(): Record<string, IRenderer>;
    constructor(container: IContainer);
    compile(definition: PartialCustomElementDefinition, container: IContainer, compilationInstruction: ICompliationInstruction | null): CustomElementDefinition;
    getViewFactory(definition: PartialCustomElementDefinition, container: IContainer): IViewFactory;
    createNodes(definition: CustomElementDefinition): INodeSequence;
    render(controller: IHydratableController, targets: ArrayLike<INode>, definition: CustomElementDefinition, host: INode | null | undefined): void;
}
//# sourceMappingURL=rendering.d.ts.map