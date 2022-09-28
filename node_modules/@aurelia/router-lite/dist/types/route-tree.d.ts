import { ILogger } from '@aurelia/kernel';
import { CustomElementDefinition } from '@aurelia/runtime-html';
import { ITypedNavigationInstruction_ResolvedComponent, Params, ViewportInstruction, ViewportInstructionTree } from './instructions';
import { IRouteContext } from './route-context';
import { NavigationOptions } from './router';
export interface IRouteNode {
    path: string;
    finalPath: string;
    context: IRouteContext;
    /** Can only be `null` for the composition root */
    instruction: ViewportInstruction<ITypedNavigationInstruction_ResolvedComponent> | null;
    params?: Params;
    queryParams?: Readonly<URLSearchParams>;
    fragment?: string | null;
    data?: Record<string, unknown>;
    viewport?: string | null;
    title?: string | ((node: RouteNode) => string | null) | null;
    component: CustomElementDefinition;
    children?: RouteNode[];
    residue?: ViewportInstruction[];
}
export declare class RouteNode implements IRouteNode {
    /**
     * The original configured path pattern that was matched.
     */
    path: string;
    /**
     * If one or more redirects have occurred, then this is the final path match, in all other cases this is identical to `path`
     */
    finalPath: string;
    /**
     * The `RouteContext` associated with this route.
     *
     * Child route components will be created by this context.
     *
     * Viewports that live underneath the component associated with this route, will be registered to this context.
     */
    readonly context: IRouteContext;
    /** Can only be `null` for the composition root */
    readonly instruction: ViewportInstruction<ITypedNavigationInstruction_ResolvedComponent> | null;
    params: Params;
    queryParams: Readonly<URLSearchParams>;
    fragment: string | null;
    data: Record<string, unknown>;
    /**
     * The viewport is always `null` for the root `RouteNode`.
     *
     * NOTE: It might make sense to have a `null` viewport mean other things as well (such as, don't load this component)
     * but that is currently not a deliberately implemented feature and we might want to explicitly validate against it
     * if we decide not to implement that.
     */
    viewport: string | null;
    title: string | ((node: RouteNode) => string | null) | null;
    component: CustomElementDefinition;
    readonly children: RouteNode[];
    /**
     * Not-yet-resolved viewport instructions.
     *
     * Instructions need an `IRouteContext` to be resolved into complete `RouteNode`s.
     *
     * Resolved instructions are removed from this array, such that a `RouteNode` can be considered
     * "fully resolved" when it has `residue.length === 0` and `children.length >= 0`
     */
    readonly residue: ViewportInstruction[];
    get root(): RouteNode;
    private constructor();
    static create(input: IRouteNode & {
        originalInstruction?: ViewportInstruction<ITypedNavigationInstruction_ResolvedComponent> | null;
    }): RouteNode;
    contains(instructions: ViewportInstructionTree): boolean;
    appendChild(child: RouteNode): void;
    clearChildren(): void;
    getTitle(separator: string): string | null;
    getTitlePart(): string | null;
    computeAbsolutePath(): string;
    toString(): string;
}
export declare class RouteTree {
    readonly options: NavigationOptions;
    readonly queryParams: Readonly<URLSearchParams>;
    readonly fragment: string | null;
    root: RouteNode;
    constructor(options: NavigationOptions, queryParams: Readonly<URLSearchParams>, fragment: string | null, root: RouteNode);
    contains(instructions: ViewportInstructionTree): boolean;
    clone(): RouteTree;
    finalizeInstructions(): ViewportInstructionTree;
    toString(): string;
}
export declare function updateNode(log: ILogger, vit: ViewportInstructionTree, ctx: IRouteContext, node: RouteNode): Promise<void> | void;
export declare function processResidue(node: RouteNode): Promise<void> | void;
export declare function getDynamicChildren(node: RouteNode): Promise<readonly RouteNode[]> | readonly RouteNode[];
export declare function createAndAppendNodes(log: ILogger, node: RouteNode, vi: ViewportInstruction): void | Promise<void>;
//# sourceMappingURL=route-tree.d.ts.map