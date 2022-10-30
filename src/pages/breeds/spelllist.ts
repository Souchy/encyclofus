import { bindable, IEventAggregator, inject } from "aurelia";
import { IRouter, IRouteableComponent, Navigation, Parameters, RoutingInstruction } from '@aurelia/router';

import { db } from "../../DofusDB/db";
import jsonBreeds from '../../DofusDB/static/classes.json';
// import { Breed } from "../breed";

@inject(db)
export class SpellList {

	public db: db;
	public selectedSlot: number = 0;
	// @bindable
	// public showDescriptions: boolean = true;

    constructor(db: db, @IEventAggregator readonly ea: IEventAggregator) {
        this.db = db;
    }

	public get isDbLoaded() {
		return this.db.isLoaded;
	}
	public get breedId(): number {
		return this.db.breedId;
	}
	public get breed(): any {
		// console.log("spelllist.breed: " + (this.breedId)); // + this.db?.jsonBreeds + ", " + this.breedId)
		if (!this.db.jsonBreeds) return null;
		if (!this.breedId) return null;
		return this.db.jsonBreeds[this.breedId + ""];
	}
	public get spells(): any[] {
		// console.log("spelllist.spells: " + this.breed)
		if (!this.breed) return null;
		// console.log("spell list breed[" + this.breedId + "]: " + JSON.stringify(this.breed.spells));
		return this.breed.spells;
	}
	public get selectedSpellId() {
		if (!this.spells) return null;
		if (this.selectedSlot == undefined) return undefined;
		return this.spells[this.selectedSlot];
	}
	public get selectedSpell() {
		if (!this.selectedSpellId) return null;
		return this.db.jsonSpells[this.selectedSpellId];
	}

	public selectSlot(slot: number): void {
		this.selectedSlot = slot;
		this.selectedSummon = null;
		this.ea.publish("spelllist:select:" + this.selectedSpellId);
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

	public hasSummon(e: any) {
		return this.db.isSummonEffect(e) && e.visibleInTooltip; // e.effectId == 181 || e.effectId == 1011 || e.effectId == 1008;
	}
	public getSummon(e: any): any {
		if (!this.hasSummon(e)) return null;
		return this.db.jsonSummons[e.diceNum];
	}

	public selectedSummon: any;
	public selectSummon(e: any) {
		this.selectedSummon = e;
		this.selectedSlot = undefined;
	}

}
