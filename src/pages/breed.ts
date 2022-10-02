import { ReloadBehavior } from '@aurelia/router';
// import { db } from './../DofusDB/db';
import jsonBreeds from '../DofusDB/static/classes.json';

// Aurelia 2
import { inject, lazy, all, optional, newInstanceOf, factory, Constructable } from "@aurelia/kernel";
import { bindable, route } from 'aurelia';
import { IRoute, IRouter, IRouteableComponent, Navigation, Parameters, RoutingInstruction } from '@aurelia/router';
import { IDryCustomElementController, IHydrationContext, CustomElementDefinition, PartialCustomElementDefinition, IContextualCustomElementController, ICompiledCustomElementController, ICustomElementController, IHydratedController, LifecycleFlags } from '@aurelia/runtime-html';
import { SpellList } from "./breeds/spelllist";

// @inject(db)
// @route('')
export class Breed implements IRouteableComponent {
	
	static routes: IRoute[] = [
		{
			path: '',
			component: import('./breeds/spelllist'),
			// data: {
			// 	breed: "sacrieur"
			// }
		},
		// {
		// 	path: "resources",
		// 	component: import('./pages/resources')
		// },
		// {
		// 	path: "tournaments",
		// 	component: import('./pages/tournaments')
		// }
		{
			path: "situations",
			component: import('./breeds/xelor/xelor.situations.fr.md'),
			title: "Situations",
			reloadBehavior: ReloadBehavior.refresh,
		}
	];

	// public db: db;
	// public router: IRouter;

	@bindable
	public breed: string = "feca";

	constructor(){ //@IRouter readonly rtr: IRouter) { 
		// this.router = rtr;
	}

	load(parameters: Parameters, instruction: RoutingInstruction, navigation: Navigation): void | Promise<void> {
		this.breed = instruction.route.match.id;
		// console.log("hey breeds load: " + JSON.stringify(instruction.route))
	}
	
	public get breedId(): number {
		return jsonBreeds.ids[this.breed];
	}
	public get breedName(): string {
		return jsonBreeds.french[this.breedId-1];
	}

}
