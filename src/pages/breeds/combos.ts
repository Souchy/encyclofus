import { inject } from "aurelia";
import { db } from "../../DofusDB/db";

@inject(db)
export class Combos {

	public db: db;
	public selectedSlot: number = 0;

	constructor(db: db) {
		this.db = db;
	}

	public get isDbLoaded() {
		return this.db.isLoaded;
	}

	public get breedId(): number {
		return this.db.breedId;
	}
	public get breed(): any {
		if (!this.db.jsonBreeds) return null;
		if (!this.breedId) return null;
		return this.db.jsonBreeds[this.breedId + ""];
	}
	public get spells(): any[] {
		if (!this.breed) return null;
		// console.log("spell list breed[" + this.breedId + "]: " + JSON.stringify(this.breed.spells));
		return this.breed.spells;
	}
    
	public getSpellImg(spellId: number): string {
		// console.log("getSpellImg " + spellId)
		let path = this.db.getSpellIconPath(spellId);
		// console.log("spelllist icon path: " + path);
		return path;
	}

	public getSpellName(spellId: number): string {
		// console.log("getSpellName " + JSON.stringify(this.db.jsonSpells[spellId].nameId))
		let nameid = this.db.jsonSpells[spellId].nameId;
		return this.db.getI18n(nameid);
	}

}
