import jsonBreeds from '../DofusDB/static/classes.json';
import { db as db } from '../DofusDB/db';

// Aurelia 2
import { inject, lazy, all, optional, newInstanceOf, factory } from "@aurelia/kernel";
import { bindable, Router } from 'aurelia';

@inject(db)
export class Breed {
	public db: db;

	@bindable
	public breed: string = "feca";
	// index number in the list of spells of the class, not the actual spell id
	public selectedSpellNumber: number = 0;

	constructor(db: db) { 
		this.db = db;
		// console.log("breed ctor")
	}

	public selectSpell(id: number) {
		this.selectedSpellNumber = id;
	}

	public getId(): number {
		return jsonBreeds.ids[this.breed];
	}
	public getI18nName(): string {
		return jsonBreeds.french[this.getId()-1];
	}

	public get isDbLoaded() {
		console.log("isDbLoaded()")
		return this.db.jsonSpells;
	}
	public get spells(): any[] {
		if(!this.db.jsonSpells) return [];
		return this.db.jsonSpells[this.breed];
	}

	public getSpell(spellListIndex): any {
		return this.spells[spellListIndex];
	}

	public getSpellImg(spellId) {
		return this.db.getSpellIconPath(spellId);
	}


	public get jsonSpells() {
		console.log("get jsonSpells()")
		return this.db.jsonSpells;
	}

	public get jsonSpellsDetails() {
		return this.db.jsonSpellsDetails;
	}

}
