import { ILogger } from '@aurelia/kernel';
import { IHistory, ILocation, IWindow } from '@aurelia/runtime-html';
import { IRouterEvents } from './router-events';
export interface IPopStateEvent extends PopStateEvent {
}
export interface IHashChangeEvent extends HashChangeEvent {
}
export declare const IBaseHref: import("@aurelia/kernel").InterfaceSymbol<URL>;
export declare const ILocationManager: import("@aurelia/kernel").InterfaceSymbol<ILocationManager>;
export interface ILocationManager extends BrowserLocationManager {
}
/**
 * Default browser location manager.
 *
 * Encapsulates all DOM interactions (`window`, `location` and `history` apis) and exposes them in an environment-agnostic manner.
 *
 * This is internal API for the moment. The shape of this API (as well as in which package it resides) is also likely temporary.
 */
export declare class BrowserLocationManager {
    private readonly logger;
    private readonly events;
    private readonly history;
    private readonly location;
    private readonly window;
    private readonly baseHref;
    private eventId;
    constructor(logger: ILogger, events: IRouterEvents, history: IHistory, location: ILocation, window: IWindow, baseHref: URL);
    startListening(): void;
    stopListening(): void;
    private onPopState;
    private onHashChange;
    pushState(state: {} | null, title: string, url: string): void;
    replaceState(state: {} | null, title: string, url: string): void;
    getPath(): string;
    currentPathEquals(path: string): boolean;
    addBaseHref(path: string): string;
    removeBaseHref(path: string): string;
}
/**
 * Strip trailing `/index.html` and trailing `/` from the path, if present.
 */
export declare function normalizePath(path: string): string;
//# sourceMappingURL=location-manager.d.ts.map