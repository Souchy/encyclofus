import { IEventAggregator, inject } from "aurelia";
import { db } from "../../../DofusDB/db";
import { Emerald } from "../../../ts/emerald";
import * as $ from 'jquery';

@inject(db)
export class filter {

	// need to wait for filter before rendering ui
	private isSaveLoaded = false;

	// filter data
	public filterText: string = "";
	public filterLevel: boolean = true;
	public levelMin: number = 1;
	public levelMax: number = 200;
	public types: Map<number, boolean> = new Map<number, boolean>();
	public armes: Map<number, boolean> = new Map<number, boolean>();
	// @observable({ changeHandler: 'filterTypeChanged' })
	public filterType: boolean = false;
	// @observable({ changeHandler: 'filterWeaponChanged' })
	public filterWeapon: boolean = false;
	// mods blocks
	public filterStats: boolean = true;
	public blocks: BlockFilter[] = [];

	// html elements
	public blocklist: HTMLDivElement;

	public redListTypes = [265, 267, 169, 99, 83, 20, 21] // badges, idoles d'expédition, compagnons, filet de capture, pierre d'ame, outil, pioche

	constructor(readonly db: db, readonly emerald: Emerald, @IEventAggregator readonly ea: IEventAggregator) {
		ea.subscribe("emerald:loaded:itemtypes", () => {
			// console.log("init types in filter");
			if(this.types.size == 0)
				this.emerald.itemTypes
				.filter(t => t.superTypeId != 2 && !this.redListTypes.includes(t.id)) 
				.forEach(element => this.types.set(+element.id, false));
			if(this.armes.size == 0)
				this.emerald.itemTypes
				.filter(t => t.superTypeId == 2 && !this.redListTypes.includes(t.id))
				.forEach(element => this.armes.set(+element.id, false));
			// console.log("loaded item stypes: " + this.emerald.itemTypes.length)
			// console.log("armes: " + this.armes.size)
		});

		this.addBlock();

		// when emerald loads, auto search
		this.ea.subscribe("emerald:loaded", () => {
			// load filter only after
			this.loadFilter();
			// search
			this.search();
		})
		this.ea.subscribe("quickfus:mod:delete", (data: any) => {
			console.log("filter onDeleteMod ["+data.blockid+"]: " + JSON.stringify(data.data));
			// if(!mod.blockId) return;
			let m = this.blocks[data.blockid].mods.find(e => e.effectId == data.data.effectId);
			if (m) {
				let i = this.blocks[data.blockid].mods.indexOf(m);
				this.blocks[data.blockid].mods.splice(i, 1);
			}
		});
	}

    public get isLoaded() {
		// && this.db.isConnected()
		return this.db.isLoaded && this.emerald.characteristics && this.emerald.itemTypes && this.isSaveLoaded //&& this.emerald.effects
    }

	public loadFilter() {
		let json = localStorage.getItem("filter");
		// console.log("load filter");
		if (json) {
			let data = JSON.parse(json);
			this.filterLevel = data.filterLevel;
			this.filterText = data.filterText;
			this.levelMin = data.levelMin;
			this.levelMax = data.levelMax;
			for(let t of data.types) {
				if(this.types.has(t[0])) 
				this.types.set(t[0], t[1]);
			}
			for(let t of data.armes) {
				if(this.armes.has(t[0])) 
				this.armes.set(t[0], t[1]);
			}
			this.filterLevel = data.filterLevel;
			this.filterType = data.filterType;
			this.filterWeapon = data.filterWeapon;
			this.filterStats = data.filterStats;
			this.blocks = data.blocks;
		}
		this.isSaveLoaded = true;
		// console.log("load filter: " + JSON.stringify(this.blocks))
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
			filterStats: this.filterStats,
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
		let block = new BlockFilter();
		let mod = new ModFilter();
		// mod.blockId = this.blocks.length;
		block.mods.push(mod);
		this.blocks.push(block);
	}
	public addStatMod(event, blockid: number) {
		// console.log("addStatMod to block " + blockid)
		this.blocks[blockid].mods.push(new ModFilter());
		let ele: HTMLElement = event.target;
		let input = ele.previousElementSibling.getElementsByTagName("input")[1];
		// console.log("addStatMod : " + input.getAttribute("name")); 
		input.focus();
	}
	public deleteBlock(blockIndex: number) {
		this.blocks.splice(blockIndex, 1);
	}

	public filterTypeClicked() {
		var activated = this.filterType;
		this.types.forEach((value, key) => this.types.set(key, !activated));
	}
	public filterWeaponClicked() {
		var activated = this.filterWeapon;
		this.armes.forEach((value, key) => this.armes.set(key, !activated));
	}
	public checkType(type: any) {
		this.types.set(type, !this.types.get(type));
		this.filterType = this.hasValue(this.types, true);
	}
	public checkWeapon(arme: any) {
		this.armes.set(arme, !this.armes.get(arme));
		this.filterWeapon = this.hasValue(this.armes, true);
	}
	private hasValue(map: Map<number, boolean>, value: boolean) {
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
	public getI18n(nameId) {
		return this.db.getI18n(nameId.toString());
	}
	public translateItemType(type) {
		let it = this.emerald.itemTypes.find(t => t.id == type);
		return this.getI18n(it.nameId);
	}

	
}


export class BlockFilter {
	public type: string = "$and";
	public min: number;
	public max: number;
	public activate: boolean = true;
	public mods: ModFilter[] = [];
}

export class ModFilter {
    // public blockId: number = -1;
    public pseudoName: string;
    public effectId: number;
    public min: number;
    public max: number;
    public activate: boolean = true;
}
