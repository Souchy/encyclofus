import { IRouter } from './router';
import { Navigation } from './navigation';
import { IEndpoint } from './endpoints/endpoint';
import { OpenPromise } from './utilities/open-promise';
import { RoutingInstruction } from './instructions/routing-instruction';
import { Step } from './index';
/**
 * The navigation coordinator coordinates navigation between endpoints/entities
 * and their navigation states. The coordinator keeps the endpoints synchronized
 * for the configured synchronization states, meaning that no endpoint can proceed
 * past a sync state until all endpoints have reached it. The coordinator also
 * provides synchronization on endpoint level which is used to make sure parent
 * hooks are done before child hooks start.
 *
 * Each endpoint that's involved in a navigation is added to the coordinator's
 * entities and report each completed navigation state to the coordinator
 * during the transition. Before an endpoint starts a new navigation step
 * it asks the coordinator whether it can proceed or should wait. The
 * coordinator instructs continuation if the endpoint's current step isn't
 * being synchronized or if all other endpoints have reached that state. If
 * one or more endpoints have been instructed to wait, they are instructed
 * to continue once all endpoints have reached the state they're waiting on.
 */
/**
 * The different navigation states each endpoint passes through (regardless
 * of whether they have hooks or not).
 */
export declare type NavigationState = 'guardedUnload' | // fulfilled when canUnload (if any) has been called
'guardedLoad' | // fulfilled when canLoad (if any) has been called
'guarded' | // fulfilled when check hooks canUnload and canLoad (if any) have been called
'unloaded' | // fulfilled when unload (if any) has been called
'loaded' | // fulfilled when load (if any) has been called
'routed' | // fulfilled when initial routing hooks (if any) have been called
'bound' | // fulfilled when bind has been called
'swapped' | 'completed';
/**
 * The entity used to keep track of the endpoint and its states.
 */
declare class Entity {
    /**
     * The endpoint for the entity
     */
    endpoint: IEndpoint;
    /**
     * Whether the entity's transition has started.
     */
    running: boolean;
    /**
     * The navigation states the entity has reached.
     */
    states: Map<NavigationState, OpenPromise | null>;
    /**
     * The navigation states the entity has checked (and therefore reached).
     */
    checkedStates: NavigationState[];
    /**
     * The navigation state the entity is currently syncing/waiting on.
     */
    syncingState: NavigationState | null;
    /**
     * The (open) promise to resolve when the entity has reached its sync state.
     */
    syncPromise: OpenPromise | null;
    /**
     * The Runner step that's controlling the transition in the entity.
     */
    step: Step<void> | null;
    constructor(
    /**
     * The endpoint for the entity
     */
    endpoint: IEndpoint);
    /**
     * Whether the entity has reached a specific state.
     *
     * @param state - The state to check
     */
    hasReachedState(state: NavigationState): boolean;
}
export declare class NavigationCoordinatorOptions {
    /**
     * The navigation states the coordinator synchronized entities on.
     */
    syncStates: NavigationState[];
    constructor(input: Partial<NavigationCoordinatorOptions>);
}
export declare class NavigationCoordinator {
    private readonly router;
    /**
     * The navigation that created the coordinator.
     */
    readonly navigation: Navigation;
    /**
     * Whether the coordinator is running/has started entity transitions.
     */
    running: boolean;
    /**
     * Whether the coordinator's run is completed.
     */
    completed: boolean;
    /**
     * Whether the coordinator's run is cancelled.
     */
    cancelled: boolean;
    /**
     * Whether the coordinator has got all endpoints added.
     */
    hasAllEndpoints: boolean;
    /**
     * Instructions that should be appended to the navigation
     */
    appendedInstructions: RoutingInstruction[];
    /**
     * The entities the coordinator is coordinating.
     */
    private readonly entities;
    /**
     * The sync states the coordinator is coordinating.
     */
    private readonly syncStates;
    /**
     * The sync states that's been checked (by any entity).
     */
    private readonly checkedSyncStates;
    constructor(router: IRouter, 
    /**
     * The navigation that created the coordinator.
     */
    navigation: Navigation);
    /**
     * Create a navigation coordinator.
     *
     * @param router - The router
     * @param navigation - The navigation that creates the coordinator
     * @param options - The navigation coordinator options
     */
    static create(router: IRouter, navigation: Navigation, options: NavigationCoordinatorOptions): NavigationCoordinator;
    /**
     * Run the navigation coordination, transitioning all entities/endpoints
     */
    run(): void;
    /**
     * Add a navigation state to be synchronized.
     *
     * @param state - The state to add
     */
    addSyncState(state: NavigationState): void;
    /**
     * Add an endpoint to be synchronized.
     *
     * @param endpoint - The endpoint to add
     */
    addEndpoint(endpoint: IEndpoint): Entity;
    /**
     * Remove an endpoint from synchronization.
     *
     * @param endpoint - The endpoint to remove
     */
    removeEndpoint(endpoint: IEndpoint): void;
    /**
     * Set the Runner step controlling the transition for an endpoint.
     *
     * @param endpoint - The endpoint that gets the step set
     * @param step - The step that's controlling the transition
     */
    setEndpointStep(endpoint: IEndpoint, step: Step<void>): void;
    /**
     * Add a (reached) navigation state for an endpoint.
     *
     * @param endpoint - The endpoint that's reached a state
     * @param state - The state that's been reached
     */
    addEndpointState(endpoint: IEndpoint, state: NavigationState): void;
    /**
     * Wait for a navigation state to be reached. If endpoint is specified, it
     * will be marked as waiting for the state notified when it is reached (if
     * waiting is necessary).
     *
     * @param state - The state to wait for
     * @param endpoint - The specific endpoint to wait for
     */
    waitForSyncState(state: NavigationState, endpoint?: IEndpoint | null): void | Promise<void>;
    /**
     * Wait (if necessary) for an endpoint to reach a specific state.
     *
     * @param endpoint - The endpoint to wait for
     * @param state - The state to wait for
     */
    waitForEndpointState(endpoint: IEndpoint, state: NavigationState): void | Promise<void>;
    /**
     * Notify that all endpoints has been added to the coordinator.
     */
    finalEndpoint(): void;
    /**
     * Finalize the navigation, calling finalizeContentChange in all endpoints.
     */
    finalize(): void;
    /**
     * Cancel the navigation, calling cancelContentChange in all endpoints and
     * cancelling the navigation itself.
     */
    cancel(): void;
    /**
     * Enqueue instructions that should be appended to the navigation
     *
     * @param instructions - The instructions that should be appended to the navigation
     */
    enqueueAppendedInstructions(instructions: RoutingInstruction[]): void;
    /**
     * Dequeue appended instructions to either matched or remaining except default instructions
     * where there's a non-default already in the lists.
     *
     * @param matchedInstructions - The matched instructions
     * @param earlierMatchedInstructions - The earlier matched instructions
     * @param remainingInstructions - The remaining instructions
     * @param appendedInstructions - The instructions to append
     */
    dequeueAppendedInstructions(matchedInstructions: RoutingInstruction[], earlierMatchedInstructions: RoutingInstruction[], remainingInstructions: RoutingInstruction[]): {
        matchedInstructions: RoutingInstruction[];
        remainingInstructions: RoutingInstruction[];
    };
    /**
     * Check if a navigation state has been reached, notifying waiting
     * endpoints if so.
     *
     * @param state - The state to check
     */
    private checkSyncState;
    /**
     * Re-check the sync states (since a new endpoint has been added) and add
     * now unresolved ones back.
     */
    private recheckSyncStates;
}
export {};
//# sourceMappingURL=navigation-coordinator.d.ts.map