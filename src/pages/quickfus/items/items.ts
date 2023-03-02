import { IEventAggregator, inject } from "aurelia";
import { pipeline } from "stream";
import { db } from "../../../DofusDB/db";
import { Emerald } from "../../../ts/emerald";
import { Mason, util } from "../util";
import { BlockFilter, filter as Filter } from "./filter";
import { ModFilter } from "./modfilter/modfilter";
var merge = require('deepmerge');

@inject(db, Emerald)
export class items {

	public mason: Mason;
	public grid: HTMLDivElement;
    private pageHost: Element;
    private itemFilter: Object = null;
    private debouncedShowMore = util.debounce(() => {
        this.search1();
    }, 500, true);

    public constructor(readonly db: db, readonly emerald: Emerald, @IEventAggregator readonly ea: IEventAggregator) {
        let onItemSheetAttached = util.debounce(() => {
            this.mason.reloadMsnry();
        }, 200, false);
        // on sheet attached
        this.ea.subscribe("itemsheet:loaded", () => {
           onItemSheetAttached();
        });
        // on click search in the filter
        this.ea.subscribe("items:search", (filter: Filter) => this.search(filter));
    }

    public isLoaded() {
        return this.emerald.items
    //     return this.db.jsonItemTypes && this.db.jsonItemTypes && this.db.jsonEffects && this.db.jsonCharacteristics
    }
    public attached() {
        // console.log("itemsearch attached grid: " + this.grid);
        this.mason = new Mason();
        this.mason.obj = this;
        this.mason.initMasonry();

        // scroll handler
        this.pageHost = document.getElementsByClassName("page-host")[0];
        let handler =  (e) => {
            if(!this.grid) {
                this.pageHost.removeEventListener('scroll', handler, false);
                return;
            }
            setTimeout(() => this.onScroll(e));
        };
        this.pageHost.addEventListener('scroll', handler);

        // if already loaded emerald, auto search
        if(this.emerald.items?.length > 1) {
            // this.mason.fulldata = this.emerald.items;
            this.search();
        }
    }

    private async onScroll(e?) {
        let h1 = this.pageHost.clientHeight;
        let h2 = this.grid.scrollHeight + this.grid.offsetTop;
        let maxScroll = h2 - h1;
        let currScroll = this.pageHost.scrollTop;
        // console.log("ph: " + h1 + ", au: " + h2 + ", max: " + maxScroll + ", curr: " + currScroll)
        if(Math.abs(currScroll - maxScroll) <= 15) {
            this.debouncedShowMore();
        }
    }

    /**
     * new search : clear current items and search for new
     */
    public async search(filter: Filter = null) {
        console.log("on search: " + filter)
        // if(filter.filterLevel)
        // this.itemFilter = filter;
        this.itemFilter = this.generateFilter(filter);
        this.mason.data = []; // this.items = [];
        this.mason.fulldata = [];
        this.mason.page = 0;
        this.search1();
        // console.log("search1")
    }

    /**
     * ongoing search: add new items to current
     */
    public async search1() {
        console.log("search1 filter: " + JSON.stringify(this.itemFilter))

        var pipeline = [];
        {
            // actual filter
            pipeline.push({ $match: this.itemFilter ?? "" });
            // sums
            //   if(Object.keys(adds.$addFields).length > 0)
            //     pipeline.push(adds);
            // sort
            pipeline.push({ $sort: { "level": -1, "id": -1 } });
            // skip
            pipeline.push({ $skip: this.mason.page * this.mason.itemsPerPage });
            // limit
            pipeline.push({ $limit: this.mason.itemsPerPage });
        };
        // console.log("search 1, limit: " + this.mason.itemsPerPage + ", skip: " + this.mason.page * this.mason.itemsPerPage)

        let cursor = this.emerald.collectionItems.aggregate(pipeline);
        // console.log({cursor})
        let arr = await cursor.toArray(); 
        this.mason.fulldata.push(...arr);
        // console.log("arr: " + arr + ", fulldata: " + this.mason.fulldata.length);

        this.mason.showMore(); 
    }

    private async search0(filter: string = "") {
        this.mason.data = await this.emerald.collectionItems
            .find({ })

            .sort({ level: -1 })
            // .sort(i => i.level)
            // .sort({ level: 1 })
            // .sort({ "level": 1 })
            // .sort((a, b) => a.level > b.level)
            // .sort({ level: -1 })

            .skip(0)
            .limit(50)
            .toArray()
    }

	public generateFilter(filt: Filter) {
		var adds = { $addFields: {} };
		var mongofilter = { $and: [] };
		var types = { $or: [] };
		// Level
		if(filt.filterLevel) {
			mongofilter.$and.push({ "level": { "$gte": parseInt(filt.levelMin + "") } });
			mongofilter.$and.push({ "level": { "$lte": parseInt(filt.levelMax + "") } });
		}	
		// Types
		if (filt.filterType) {
			filt.types.forEach((v, k) => {
				if (v) types.$or.push({ "type": k });
			})
		}
		// Weapons
		if (filt.filterWeapon) {
			filt.armes.forEach((v, k) => {
				if (v) types.$or.push({ "type": k });
			})
		}
		if (filt.filterType || filt.filterWeapon) {
			mongofilter.$and.push(types);
		}
		// Text
		if (filt.filterText && filt.filterText != "") {
			let regex  = { "$regex": util.caseAndAccentInsensitive(filt.filterText), "$options": "gi" }
			if (this.db.lang == "fr")
				mongofilter.$and.push({ "namefr": regex })
			else
				mongofilter.$and.push({ "nameen": regex })
		}
		// blocks
		// let mod = new ModFilter();
		// mod.effectId = 174;
		// mod.min = 400;
		// let filterMod = this.filterStat(mod);
		// mongofilter.$and.push(filterMod);
		
		// let block = new BlockFilter()
		// block.mods.push(mod);
		// filt.blocks.push(block);

		let bi = 0;
		filt.blocks.forEach(block => {
			if (block.activate) {
				if (block.type == "$sum") {
					this.filterSum(mongofilter, adds, bi, block);
				} else {
					let arr = block.mods.filter(m => m.activate && m.effectId != undefined).map((m: ModFilter) => {
						if (m.pseudoName.includes("Pseudo")) 
							return this.filterStatPseudo(m);
						else 
							return this.filterStat(m);
					});
					// console.log("filter block : " + func + " : " + JSON.stringify(arr));
					if (arr.length > 0) {
						mongofilter.$and.push({
							[block.type]: arr
						});
					}
				}
			}
		});
		return mongofilter;
	}
	private filterSum(mongofilter, adds, bi, block: BlockFilter) {
		let blockid = block.mods.map(m => m.effectId).reduce((acc, m) => acc + m) + bi;
		// filter what stats we need to sum
		let conds = [];
		block.mods.forEach(m => {
			conds.push({
				"$eq": [
					"$$stat.name",
					m.effectId
				]
			});
		});
		// create a field with the sum of stats
		adds.$addFields[blockid] = {
			"$sum": {
				"$map": {
					"input": {
						"$filter": {
							"input": "$statistics",
							"as": "stat",
							"cond": {
								"$or": conds
							}
						}
					},
					"as": "stat",
					"in": "$$stat.max"
				}
			}
		};
		// filter match on that sum
		mongofilter.$and.push({
			[blockid]: {
				$gte: parseInt((block.mods[0].min || -100000) + ""),
				$lte: parseInt((block.mods[0].max || 100000) + "")
			}
		});
	}
	private filterStatPseudo(m: ModFilter) {
		let min: number = parseInt(m.min + "");
		let max: number = parseInt(m.max + "");
		if (!m.min) min = -100000;
		let filter = {
			"$and": []
		};
		// if (m.min) {
		filter.$and.push(
			{
				["(Pseudo) statistics." + m.effectId]: {
					"$gte": min
				}
			}
		)
		// }
		if (m.max) {
			filter.$and.push(
				{
					["(Pseudo) statistics." + m.effectId]: {
						"$lte": max
					}
				}
			)
		}
		return filter;
	}
	private filterStat(m: ModFilter) {
		let min: number = parseInt(m.min + "");
		let max: number = parseInt(m.max + "");
		// console.log("filter mod (" + min + "," + max + ") : " + JSON.stringify(m));
		if (!m.min) min = -100000;
		let minfilter = {
			"effectId": m.effectId,
			"diceNum": { "$gte": min }
		};
		let maxfilter = {
			"effectId": m.effectId
		};
		if (m.max) {
			minfilter["diceSide"] = { "$lte": max };
			maxfilter["diceSide"] = { "$lte": max, "$gte": min };
		} else {
			maxfilter["diceSide"] = { "$gte": min };
		}
		let mm = {
			"possibleEffects": {
				"$elemMatch": {
					"$or": [minfilter, maxfilter]
				}
			}
		};
		return mm;
	}

}
