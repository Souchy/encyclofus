// import { observable } from "aurelia";
import { IEventAggregator, inject } from "aurelia";
import { db } from "../../../DofusDB/db";
import itemTypes from "../../../DofusDB/scraped/2.66.5.18/itemtypes.json"

@inject(db)
export class filter {

    // Static data
	public modsSections: Map<string, string[]>;

    // filter data
	public filterText: string = "";
	public filterLevel: boolean = true;
    public levelMin: number;
    public levelMax: number;
	public types: Map<string, boolean> = new Map<string, boolean>();
	public armes: Map<string, boolean> = new Map<string, boolean>();
	// @observable({ changeHandler: 'filterTypeChanged' })
	public filterType: boolean = false;
	// @observable({ changeHandler: 'filterWeaponChanged' })
	public filterWeapon: boolean = false;
	// mods blocks
	public blocks: BlockFilter[];

	// html elements
	public blocklist: HTMLDivElement;

    constructor(readonly db: db, @IEventAggregator readonly ea: IEventAggregator) {
		this.modsSections = new Map<string, string[]>();
		this.modsSections.set("Pseudo", [
			"(Pseudo) # res",
			"(Pseudo) # res élémentaires",
			"(Pseudo) Total #% res",
			"(Pseudo) Total #% res élémentaires",
		]);

		itemTypes.filter(t => t.superTypeId == 2).forEach(element => {
			this.armes.set(this.db.getI18n(element.nameId + ""), true);
		});
		itemTypes.filter(t => t.superTypeId != 2).forEach(element => {
			this.types.set(this.db.getI18n(element.nameId + ""), true);
		});
    }

	public search() {
		this.ea.publish("items:search", "myfilter");
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
	public name: string;
	public min: number;
	public max: number;
	public activate: boolean = true;
	public constructor() {
	}
}
