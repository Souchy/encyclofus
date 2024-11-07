import { IEventAggregator } from "aurelia";
import { db } from "../../../DofusDB/db";
import { util } from "../util";

export class Setfilter {
    
	// filter data
	public filterText: string = "";
	public levelMin: number = 1;
	public levelMax: number = 200;

	
	private debouncedSearch;

	constructor(readonly db: db, @IEventAggregator readonly ea: IEventAggregator) {
		// console.log("filter ctor")

		// this.addBlock();
		this.debouncedSearch = util.debounce(() => this.search(), 700, false);

		// when emerald loads, auto search
		if(this.db.isLoaded) {
			// console.log("filter ctor1")
			this.onLoad();
		} else {
			// console.log("filter ctor2")
			this.ea.subscribe("db:loaded", () => {
				this.onLoad();
			})
		}
	}

	private onLoad() {
		// console.log("filter onLoad")

		// if (this.types.size == 0)
		// 	this.db.data.jsonItemTypes
		// 		.filter(t => t.superTypeId != 2 && !this.redListTypes.includes(t.id))
		// 		.forEach(element => this.types.set(+element.id, false));

		// if (this.armes.size == 0)
		// 	this.db.data.jsonItemTypes
		// 		.filter(t => t.superTypeId == 2 && !this.redListTypes.includes(t.id))
		// 		.forEach(element => this.armes.set(+element.id, false));

		// load filter only after
		// this.loadFilter();

		// search
		this.search();
	}

    
	public search() {
		// this.saveFilter();
		console.log("search sets");
		this.ea.publish("sets:search", this);
	}

    levelMinChanged(newVal, oldVal) {
		console.log("mmin changed");
		this.debouncedSearch();		
    }
    levelMaxChanged(newVal, oldVal) {
		console.log("max changed");
		this.debouncedSearch();		
    }
    filterTextChanged(newVal, oldVal) {
		console.log("text changed");
		this.debouncedSearch();		
    }

}
