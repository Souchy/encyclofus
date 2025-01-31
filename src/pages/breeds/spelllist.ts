import { filter } from './../quickfus/items/filter';
import { Changelog } from './../changelog/changelog';
import { bindable, IEventAggregator, inject } from "aurelia";
import { IRouter, IRouteableComponent, Navigation, Parameters, RoutingInstruction } from '@aurelia/router';

import { db } from "../../DofusDB/db";
import jsonBreeds from '../../DofusDB/static/classes.json';
import { DofusSpell, DofusSpellNew } from '../../ts/dofusModels';
// import { Breed } from "../breed";

@inject(db)
export class SpellList {

	public db: db;

    constructor(db: db, changelog: Changelog, @IEventAggregator readonly ea: IEventAggregator) {
        this.db = db;
		this.db.ea.subscribe("db:loaded", () => this.onLoad());
    }

	// attached() {
	// 	this.onLoad();
	// }

	private onLoad() {
		// console.log("onload");
		if(this.db.isLoaded && this.breedId != 2 && this.db.selectedSpellSlot == -1) {
			this.selectSlot(0);
		}
	}

	public get isLoaded() {
		return this.db.isLoaded && this.spells
	}

	public get dbJsonSpells() {
		return this.db.data.spells;
	}
	public get isDbLoaded() {
		return this.db.isLoaded;
	}
	public get breedId(): number {
		return this.db.breedId;
	}
	public get breed(): any {
		if (!this.db.data.jsonBreeds) return null;
		if (!this.breedId) return null;
		return this.db.data.jsonBreeds[this.breedId + ""];
	}
	public get spells(): any[] {
		if (!this.breed) return null;
		return this.breed.spells
			.filter(s => s != 25201 && s != 25122); // remove admin spells (doom style, ankatchoum)
	}
	public get selectedSpellId() {
		if (!this.spells) return null;
		if (this.db.selectedSpellSlot < 0) return undefined;
		return this.spells[this.db.selectedSpellSlot];
	}
	public get selectedSpell() {
		if (!this.selectedSpellId) return null;
		return this.db.data.spells[this.selectedSpellId];
	}


	public selectSlot(slot: number): void {
		this.db.selectedSpellSlot = slot;
		this.db.selectedOsaSlot = -1;
		this.ea.publish("spelllist:select:" + this.selectedSpellId);
	}

	public getSpellImg(spellId: number): string {
		// console.log("getSpellImg " + spellId)
		let path = this.db.getSpellIconPath(spellId);
		// console.log("spelllist icon path: " + path);
		return path;
	}

	public getSpellName(spellId: number): string {
		// console.log("getSpellName " + JSON.stringify(this.db.spells[spellId].nameId))
		let nameid = this.db.data.spells[spellId].nameId;
		return this.db.getI18n(nameid);
	}

	public selectSummon(s: number) {
		this.db.selectedOsaSlot = s;
		this.db.selectedSpellSlot = -1;
	}

	public get summonSpell(): DofusSpell | DofusSpellNew {
		return this.dbJsonSpells[13997];
	}
	public get selectedEffect() {
		let s = this.summonSpell;
		if(this.isOldSpell(s)) {
			let e = s.effects[this.db.selectedOsaSlot];
			return e;
		} 
		else 
		{

		}
	}
	public get selectedSummon() {
		let e = this.selectedEffect;
		let summon = this.db.data.jsonSummons[e.diceNum];
		return summon;
	}

	public getSummonBySlot(e) {
		let summon = this.db.data.jsonSummons[e.diceNum];
		return summon;
	}

		
	public isOldSpell(object: any): object is DofusSpell {
		return 'effects' in object;
	}

}
