import { filter } from './../quickfus/items/filter';
import { Changelog } from './../changelog/changelog';
import { bindable, IEventAggregator, inject } from "aurelia";
import { IRouter, IRouteableComponent, Navigation, Parameters, RoutingInstruction } from '@aurelia/router';

import { db } from "../../DofusDB/db";
import jsonBreeds from '../../DofusDB/static/classes.json';
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
		return this.db.data.jsonSpells;
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
		return this.db.data.jsonSpells[this.selectedSpellId];
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
		// console.log("getSpellName " + JSON.stringify(this.db.jsonSpells[spellId].nameId))
		let nameid = this.db.data.jsonSpells[spellId].nameId;
		return this.db.getI18n(nameid);
	}

	public selectSummon(s: number) {
		this.db.selectedOsaSlot = s;
		this.db.selectedSpellSlot = -1;
	}

	public get summonSpell() {
		return this.dbJsonSpells[13997];
	}

	// public hasSummon() {
	// 	let e = this.summonEffect;
	// 	console.log("hasSummon effect: ");
	// 	return db.isSummonEffect(e); // && e.visibleInTooltip; // e.effectId == 181 || e.effectId == 1011 || e.effectId == 1008;
	// }
	// public get getSummon(): any {
	// 	// console.log("get summon: " + this.thatSummon);
	// 	let e = this.summonEffect;
	// 	if (!this.hasSummon()) return null;
	// 	// console.log("getSummon json why: " + e)
	// 	let summon = this.db.data.jsonSummons[e.diceNum];
	// 	console.log(summon);
	// 	return summon;
	// 	// return this.thatSummon;
	// }

	// public get summonEffect() {
	// 	console.log("get effect ")
	// 	// let s = this.db.data.jsonSpells[13997];
	// 	let s = this.summonSpell;
	// 	// console.log("summon effect: " + s);
	// 	let e = s.effects[this.db.selectedOsaSlot];
	// 	console.log("summon effect: " + s + ", " + e)
	// 	return e;
	// 	// return this.selectedOsaSummonEffectBla;
	// }
	// public summonSide() {
	// 	return this.summonEffect?.diceSide;
	// }

	public get selectedEffect() {
		let s = this.summonSpell;
		let e = s.effects[this.db.selectedOsaSlot];
		return e;
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
	public get fdsfds() {
		return this.dbJsonSpells[13997];
	}

}
