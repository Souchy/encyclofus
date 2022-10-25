import jsonBreeds from '../DofusDB/static/classes.json';
import { db } from '../DofusDB/db';

// Aurelia 2
import { bindable, inject } from 'aurelia';
import { IRoute, IRouter, IRouteableComponent, ReloadBehavior, Navigation, Parameters, RoutingInstruction } from '@aurelia/router';
// import { SpellList } from "./breeds/spelllist";

@inject(db)
// @route('')
export class Breed { // implements IRouteableComponent {
	
	// static routes: IRoute[] = [
	// 	{
	// 		path: '',
	// 		component: import('./breeds/spelllist'),
	// 	},
	// 	{
	// 		path: "situations",
	// 		component: import('./breeds/xelor/xelor.situations.fr.md'),
	// 		title: "Situations",
	// 		reloadBehavior: ReloadBehavior.refresh,
	// 	}
	// ];

	public db: db;
	constructor(db: db) {
		this.db = db;
	}

	public get breedId(): number {
		return this.db.breedId;
	}
	public get breedName(): string {
		if(this.breedId <= 0) {
			return "nobreed";
		} else
		if (this.db.jsonBreeds) {
			// let basicName = asdf.navigation.instruction;
			let breed = this.db.jsonBreeds[this.breedId]
			let name = this.db.getI18n(breed.nameId);
			return name;
		} else {
			return jsonBreeds.french[this.breedId - 1];
		}
	}

    // loading(params: Parameters, instruction: RoutingInstruction, navigation: Navigation) {
	// 	console.log("breeds1 load route: " + JSON.stringify(navigation.instruction))
	// 	console.log("breeds1 load route: " + JSON.stringify(instruction.route.match.id))
    // }
	// load(parameters: Parameters, instruction: RoutingInstruction, navigation: Navigation): void | Promise<void> {
	// 	console.log("breeds load route: " + JSON.stringify(navigation.instruction))
	// 	console.log("breeds load route: " + JSON.stringify(instruction.route.match.id))
	// 	let basicname = instruction.route.match.id;
	// 	if(Object.keys(jsonBreeds.ids).includes(basicname)) {
	// 		this.db.breedId = jsonBreeds.ids[basicname];
	// 	} else {
	// 		this.db.breedId = 0;
	// 	}
	// 	console.log("breed: " + this.db.breedId);
	// }

}
