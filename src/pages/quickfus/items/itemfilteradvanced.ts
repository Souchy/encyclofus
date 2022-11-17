// import { observable } from "aurelia";
import { IEventAggregator, inject } from "aurelia";
import { db } from "../../../DofusDB/db";

@inject(db)
export class itemfilteradvanced {

    // Static data
	public modsSections: Map<string, string[]>;

    // filter data
	public filterText: string = "";
	public filterLevel: boolean = true;
    public levelMin: number;
    public levelMax: number;
	public types: Map<string, boolean>;
	public armes: Map<string, boolean>;
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
