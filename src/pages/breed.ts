import { db } from './../DofusDB/db';
import jsonBreeds from '../DofusDB/static/classes.json';

// Aurelia 2
import { inject, lazy, all, optional, newInstanceOf, factory, Constructable } from "@aurelia/kernel";
import { bindable, route } from 'aurelia';
import { IRouter, IRouteableComponent, Navigation, Parameters, RoutingInstruction } from '@aurelia/router';
import { IDryCustomElementController, IHydrationContext, CustomElementDefinition, PartialCustomElementDefinition, IContextualCustomElementController, ICompiledCustomElementController, ICustomElementController, IHydratedController, LifecycleFlags } from '@aurelia/runtime-html';

@inject(db)
// @route('')
export class Breed implements IRouteableComponent {
	public db: db;
	public router: IRouter;

	@bindable
	public breed: string = "iop";
	public selectedSpell: any;

	constructor(@IRouter readonly rtr: IRouter, db: db) { //}, router: IRouter) { 
		this.db = db;
		this.router = rtr;
	}

    // created(controller) {
	// 	console.log("breed created")
	// }
	// define(controller: IDryCustomElementController<this>, hydrationContext: IHydrationContext<unknown>, definition: CustomElementDefinition<Constructable<{}>>): void | PartialCustomElementDefinition {
	// 	console.log("[define] url path: " + this.router.activeNavigation);
	// }
	// hydrating(controller: IContextualCustomElementController<this>): void {
	// 	console.log("[hydrating] url path: " + this.router.activeNavigation);
	// }
	// hydrated(controller: ICompiledCustomElementController<this>): void {
	// 	console.log("[hydrated] url path: " + this.router.activeNavigation);
	// }
	// created(controller: ICustomElementController<this>): void {
	// 	console.log("[created] url path: " + this.router.activeNavigation);
	// }
	// binding(initiator: IHydratedController, parent: IHydratedController, flags: LifecycleFlags): void | Promise<void> {
		
	// }
	// bound(initiator: IHydratedController, parent: IHydratedController, flags: LifecycleFlags): void | Promise<void> {
	// 	console.log("[bound] url path: " + this.router.activeNavigation);
	// }
	// attached(initiator: IHydratedController, flags: LifecycleFlags): void | Promise<void> {
	// 	console.log("[attached] url path: " + this.rtr.activeNavigation);
	// }

	load(parameters: Parameters, instruction: RoutingInstruction, navigation: Navigation): void | Promise<void> {
		// console.log(JSON.stringify(instruction.route))
		// this.breed = asdf[asdf.length - 1];
		// this.breed = instruction.route.data.breed;
		// this.breed = instruction.route.matching;
		this.breed = instruction.route.match.id;
		// let spell = this.spells[0];
		// console.log("breed load: spell = " + spell)
		// this.selectSpell(spell);
		this.selectSpellOnLoad();

		// let asdf = window.location.href.split("/");
		// console.log("breed load: " + this.breed + " =? " + asdf[asdf.length - 1] + " ,,, " + window.location.href) // + " ,,, " + document.URL)
	}

	public async selectSpellOnLoad() {
		let result = await this.db.promiseLoadingSpells;
		if(result) {
			let spell = this.spells[0];
			console.log("breed async load: spell = " + spell.name)
			this.selectSpell(spell);
		}
	}

	public get isDbLoaded() {
		return this.db.isLoaded;
	}
	
	public get spells(): any[] {
		if(!this.db.jsonSpells) return null;
		return this.db.jsonSpells[this.breed];
	}
	

	public selectSpell(spell: any): void {
		this.selectedSpell = spell;
	}

	public get breedId(): number {
		return jsonBreeds.ids[this.breed];
	}
	public get breedName(): string {
		return jsonBreeds.french[this.breedId-1];
	}


	public getSpellImg(spellId: string): string {
		return this.db.getSpellIconPath(spellId);
	}

}
