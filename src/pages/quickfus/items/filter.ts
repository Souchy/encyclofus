import { DI } from 'aurelia';
// import { observable } from "aurelia";
import { IEventAggregator, inject } from "aurelia";
import { db } from "../../../DofusDB/db";
import itemTypes from "../../../DofusDB/scraped/2.66.5.18/itemtypes.json"
import { util } from "../util";
import { Emerald } from "../../../ts/emerald";
import * as $ from 'jquery';
import { IContainer, newInstanceOf } from "@aurelia/kernel";
import { watch } from '@aurelia/runtime-html';

@inject(db)
export class filter {

	// filter data
	public filterText: string = "";
	public filterLevel: boolean = true;
	public levelMin: number = 1;
	public levelMax: number = 200;
	public types: Map<string, boolean> = new Map<string, boolean>();
	public armes: Map<string, boolean> = new Map<string, boolean>();
	// @observable({ changeHandler: 'filterTypeChanged' })
	public filterType: boolean = true;
	// @observable({ changeHandler: 'filterWeaponChanged' })
	public filterWeapon: boolean = true;
	// mods blocks
	public blocks: BlockFilter[] = [];

	// html elements
	public blocklist: HTMLDivElement;

	constructor(readonly db: db, readonly emerald: Emerald, @IEventAggregator readonly ea: IEventAggregator) {

		ea.subscribe("db:loaded", () => {
			itemTypes.filter(t => t.superTypeId == 2).forEach(element => {
				this.armes.set(this.db.getI18n(element.nameId + ""), true);
			});
			itemTypes.filter(t => t.superTypeId != 2).forEach(element => {
				this.types.set(this.db.getI18n(element.nameId + ""), true);
			});
		});

		this.addBlock();
		this.loadFilter();

		// replace with (do we have connection token for mongodb)
		// this.db.getToken();
        // if already loaded emerald, auto search
        // if(this.emerald.items?.length > 1) {
        //     this.search();
        // }
		// this.ea.subscribe("mongo:login", () => {
		// 	this.search();
		// });
		// when emerald loads, auto search
		this.ea.subscribe("emerald:loaded", () => {
			// this.mason.fulldata = this.emerald.items; // store full data
			this.search();
		})
		this.ea.subscribe("quickfus:mod:delete", (mod: ModFilter) => {
			let m = this.blocks[mod.blockId].mods.find(e => e.effectId == mod.effectId);
			if (m) {
				let i = this.blocks[mod.blockId].mods.indexOf(m);
				this.blocks[mod.blockId].mods.splice(i, 1);
			}
		});
	}

    public get isLoaded() {
		return this.db.isLoaded && this.db.isConnected() && this.emerald.characteristics //&& this.emerald.effects
    }

	public loadFilter() {
		let json = localStorage.getItem("filter");
		if (json) {
			let data = JSON.parse(json);
			this.filterLevel = data.filterLevel;
			this.filterText = data.filterText;
			this.levelMin = data.levelMin;
			this.levelMax = data.levelMax;
			this.types = new Map<string, boolean>(data.types);
			this.armes = new Map<string, boolean>(data.armes);
			this.filterLevel = data.filterLevel;
			this.filterType = data.filterType;
			this.filterWeapon = data.filterWeapon;
			this.blocks = data.blocks;
		}
	}
	public saveFilter() {
		let obj = {
			filterText: this.filterText,
			levelMin: this.levelMin,
			levelMax: this.levelMax,
			types: Array.from(this.types.entries()),
			armes: Array.from(this.armes.entries()),
			filterLevel: this.filterLevel,
			filterType: this.filterType,
			filterWeapon: this.filterWeapon,
			blocks: this.blocks
		};
		localStorage.setItem("filter", JSON.stringify(obj));
	}

	public search() {
		this.saveFilter();
		// let filter = this.generateFilter();
		this.ea.publish("items:search", this);
	}

	public addBlock() {
		this.blocks.push({
			type: "$and",
			min: 0,
			max: 0,
			mods: [new ModFilter()],
			activate: true,
		});
	}

	public filterTypeClicked() {
		var activated = this.filterType;
		this.types.forEach((value, key) => this.types.set(key, !activated));
	}
	public filterWeaponClicked() {
		var activated = this.filterWeapon;
		this.armes.forEach((value, key) => this.armes.set(key, !activated));
	}
	public checkType(type) {
		this.types.set(type, !this.types.get(type));
		this.filterType = this.hasValue(this.types, true);
	}
	public checkWeapon(arme) {
		this.armes.set(arme, !this.armes.get(arme));
		this.filterWeapon = this.hasValue(this.armes, true);
	}
	private hasValue(map: Map<string, boolean>, value: boolean) {
		for (const [key, val] of Array.from(map.entries())) {
			if (val == value) return true;
		}
		return false;
	}
	public getStatSections(): Map<string, number> {
		let sec = db.getStatSections();
		return sec;
	}
	public getModsForSection(section: number) {
		return this.emerald.characteristics
			.filter(c => c.categoryId == section)
			.sort((a, b) => a.order - b.order);
	}
	public getI18n(nameId: number) {
		return this.db.getI18n(nameId.toString());
	}

	
}


export class BlockFilter {
	public type: string = "And";
	public min: number;
	public max: number;
	public activate: boolean = true;
	public mods: ModFilter[] = [];
	public constructor() {
	}
}

export class ModFilter {
    public blockId: number;
    public pseudoName: string;
    public effectId: number;
    public min: number;
    public max: number;
    public activate: boolean = true;
}
