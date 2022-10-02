import { bindable, inject } from "aurelia";
import { IRouter, IRouteableComponent, Navigation, Parameters, RoutingInstruction } from '@aurelia/router';

import { db } from "../../DofusDB/db";
// import jsonBreeds from '../../DofusDB/static/classes.json';

@inject(db)
export class SpellList {

	public db: db;

	// public breed: string = "feca";
	@bindable
	public breedId: number = 1;
	public selectedSlot: number = 0;

	constructor(db: db) {
		this.db = db;
	}

	load(parameters: Parameters, instruction: RoutingInstruction, navigation: Navigation): void | Promise<void> {
		this.selectSpellOnLoad();
	}

	public async selectSpellOnLoad() {
		let result = await this.db.promiseLoadingSpells;
		if (result) {
			this.selectSlot(0);
		}
	}

	public get isDbLoaded() {
		return this.db.isLoaded;
	}

	public get breed(): any {
		if (!this.db.jsonBreeds) return null;
		return this.db.jsonBreeds[this.breedId + ""];
	}
	public get spells(): any[] {
		if (!this.breed) return null;
		// console.log("spell list breed[" + this.breedId + "]: " + JSON.stringify(this.breed.spells));
		return this.breed.spells;
	}

	public testSpells() {
		console.log("spell list breed[" + this.breedId + "]: " + JSON.stringify(this.breed.spells));
	}

	// public get spells(): any[] {
	// 	if(!this.db.jsonSpells) return null;
	// 	return this.db.jsonSpells[this.breed];
	// }

	public selectSlot(slot: number): void {
		this.selectedSlot = slot;
	}

	public getSpellImg(spellId: number): string {
		// console.log("getSpellImg " + spellId)
		let path = this.db.getSpellIconPath(spellId);
		console.log("spelllist icon path: " + path);
		return path;
	}

	public getSpellName(spellId: number): string {
		console.log("getSpellName " + JSON.stringify(this.db.jsonSpells[spellId].nameId))
		let nameid = this.db.jsonSpells[spellId].nameId;
		return this.db.getI18n(nameid);
	}

}
