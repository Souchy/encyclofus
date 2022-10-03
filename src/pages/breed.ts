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
		},
		{
			path: "situations",
			component: import('./breeds/xelor/xelor.situations.fr.md'),
			title: "Situations",
			reloadBehavior: ReloadBehavior.refresh,
		}
	];


	// @bindable
	public breedId: number = 0;

	constructor(){ 
	}

	load(parameters: Parameters, instruction: RoutingInstruction, navigation: Navigation): void | Promise<void> {
		console.log("breeds load route: " + JSON.stringify(instruction.route))
		// this.breed = instruction.route.match.id;
		let basicname = instruction.route.match.id;
		this.breedId = jsonBreeds.ids[basicname];
		// console.log("breed: " + this.breedId);
	}
	
	// public get breedId(): number {
	// 	return jsonBreeds.ids[this.breed];
	// }
	public get breedName(): string {
		return jsonBreeds.french[this.breedId-1];
	}

}
