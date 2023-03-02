// import { observable } from "aurelia";
import { IEventAggregator, inject } from "aurelia";
import { db } from "../../../DofusDB/db";
import itemTypes from "../../../DofusDB/scraped/2.66.5.18/itemtypes.json"
import { util } from "../util";
import { Emerald } from "../../../ts/emerald";
import * as $ from 'jquery';
import { ModFilter } from "./modfilter/modfilter";

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
		
		itemTypes.filter(t => t.superTypeId == 2).forEach(element => {
			this.armes.set(this.db.getI18n(element.nameId + ""), true);
		});
		itemTypes.filter(t => t.superTypeId != 2).forEach(element => {
			this.types.set(this.db.getI18n(element.nameId + ""), true);
		});
		
		this.addBlock();
		this.loadFilter();

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
			mods: [new ModFilter(eb, emerald, )], 
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
		let sec =  db.getStatSections();
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

	public onModInputFocus(that, event, blockid, modid) {
		// console.log("onFocusModInput [" + blockid + "," + modid + "] : " + that);
		$(event.target).closest(".searchable").find("dl").show();
		$(event.target).closest(".searchable").find("dl section dd").show();
	}
	public onModInputUnfocus(that, event, blockid, modid) {
		// console.log("onModInputBlur [" + blockid + "," + modid + "] : " + that);
		// let that = this;
		setTimeout(function() {
			$(event.target).closest(".searchable").find("dl").hide();
		}, 300);
	}

	public filterFunction2(that, event) {
		// console.log("filter that : " + event.target);
		let container, input, filter, li, input_val;
		container = $(event.target).closest("searchable");
		input = container.find("input");
		// console.log("filter input : " + input + ", val : " + input.val());
		input_val = input.val() + "";
		if (input_val == "undefined") input_val = "";
		input_val = input_val.toUpperCase();
		if (["ArrowDown", "ArrowUp", "Enter"].indexOf(event.key) != -1) {
			// this.keyControl(event, container)
		} else {
			li = container.find("dl dd");
			li.each(function(i, obj) {
				if ($(this).text().toUpperCase().indexOf(input_val) > -1) {
					$(this).show();
				} else {
					$(this).hide();
				}
			});
			container.find("dl dd").removeClass("selected");
			setTimeout(function() {
				container.find("dl dd:visible").first().addClass("selected");
			}, 100)
		}
	}
	public keyControl(e, container) {
		if (e.key == "ArrowDown") {
			if (container.find("dl dd").hasClass("selected")) {
				if (container.find("dl dd:visible").index(container.find("dl dd.selected")) + 1 < container.find("dl dd:visible").length) {
					container.find("dl dd.selected").removeClass("selected").nextAll().not('[style*="display: none"]').first().addClass("selected");
				}
			} else {
				let dd = container.find("dl dd:first-child");
				// console.log("first dd : " + dd.html());
				container.find("dl dd:first-child").addClass("selected");
			}
		} else if (e.key == "ArrowUp") {
			if (container.find("dl dd:visible").index(container.find("dl dd.selected")) > 0) {
				container.find("dl dd.selected").removeClass("selected").prevAll().not('[style*="display: none"]').first().addClass("selected");
			}
		} else if (e.key == "Enter") {
			container.find("input").val(container.find("dl dd.selected").text()).blur();
			this.onSelect(container.find("dl dd.selected").text())
		}
		let selectedDD = container.find("dl dd.selected")[0];
		// console.log("selectedDD " + selectedDD);
		if (selectedDD) {
			// selectedDD.scrollIntoView({
			// 	behavior: "smooth",
			// });
		}
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
