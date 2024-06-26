import { Diffchecker } from './../../changelog/diffchecker';
import { IEventAggregator, inject } from "aurelia";
import { pipeline } from "stream";
import { db } from "../../../DofusDB/db";
import { Mason, util } from "../util";
import { BlockFilter, ModFilter, filter as Filter } from "./filter";
var merge = require('deepmerge');

@inject(db)
export class items {

	public comparing: boolean = true;

	public mason: Mason;
	public grid: HTMLDivElement;
	private pageHost: Element;
	// private itemFilter: Object = null;
	private debouncedShowMore = util.debounce(() => {
		// this.search1();
		this.mason.showMore();
	}, 500, true);

	public constructor(readonly db: db, readonly diffChecker: Diffchecker, @IEventAggregator readonly ea: IEventAggregator) {
		// console.log("items ctor")
		this.mason = new Mason();

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
		return this.db.isLoaded
	}

	attached() {
		// console.log("itemsearch attached grid: " + this.grid);
		this.mason.obj = this;
		this.mason.initMasonry();

		// scroll handler
		this.pageHost = document.getElementsByClassName("page-host")[0];
		let handler = (e) => {
			if (!this.grid) {
				this.pageHost.removeEventListener('scroll', handler, false);
				return;
			}
			setTimeout(() => this.onScroll(e));
		};
		this.pageHost.addEventListener('scroll', handler);
	}

	private async onScroll(e?) {
		let h1 = this.pageHost.clientHeight;
		let h2 = this.grid.scrollHeight + this.grid.offsetTop;
		let maxScroll = h2 - h1;
		let currScroll = this.pageHost.scrollTop;
		// console.log("ph: " + h1 + ", au: " + h2 + ", max: " + maxScroll + ", curr: " + currScroll)
		if (Math.abs(currScroll - maxScroll) <= 15) {
			this.debouncedShowMore();
		}
	}

	public searching: boolean = true;

	/**
	 * new search : clear current items and search for new
	 */
	public async search(filter: Filter = null) {
		// this.searching = true;
		// console.log("on search: " + filter)
		this.mason.data = [];
		this.mason.fulldata = [];
		this.mason.page = 0;

		// load data in the background in increments
		// let itemFilter = this.generateFilter(filter);
		// await this.loadData(itemFilter, 0, 25); // just await the first data
		// this.loadData(itemFilter, 25, 75);
		// this.loadData(itemFilter, 75, 0);
		this.filterData(filter);
		this.mason.showMore();
		// console.log("mason showed more")
		this.searching = false;
	}

	private filterData(filter: Filter = null) {
		if (!filter) return;
		// console.log({filter});
		let arr = this.db.data.jsonItems
			.filter(item => {
				// console.log("filtering...")
				// level
				if (filter.filterLevel) {
					if (item.level < filter.levelMin) return false;
					if (item.level > filter.levelMax) return false;
				}
				// Types
				let goodType = !(filter.filterType || filter.filterWeapon);
				if (filter.filterType) {
					// if(!filter.types.get(item.typeId)) return false;
					goodType = goodType || filter.types.get(item.typeId);
				}
				// Weapons
				if (filter.filterWeapon) {
					// if(!filter.armes.get(item.typeId)) return false;
					goodType = goodType || filter.armes.get(item.typeId);
				}
				if (!goodType) return false;
				// Text
				if (filter.filterText && filter.filterText.trim() != "") {
					let regex = new RegExp(util.caseAndAccentInsensitive(filter.filterText.trim()), "i");
					let name = this.db.getI18n(item.nameId);
					if (!regex.test(name)) return false;
				}
				// blocks
				if (filter.filterStats) {
					for (let block of filter.blocks) {
						if (!block.activate) continue;
						if (block.type == "$sum") {
							if (!this.filterSumMemory(block, item))
								return false;
						} else {
							let arr = block.mods.filter(m => m.activate && m.effectId).map((m: ModFilter) => {
								if (m.effectId >= 10000) {
									return this.filterStatMemoryPseudo(m, item);
								} else {
									return this.filterStatMemory(m, item);
								}
							});
							// console.log("filterBlock result: " + JSON.stringify(arr));
							if (arr.length > 0) {
								if (block.type == "$and" && arr.includes(false))
									return false;
								if (block.type == "$or" && !arr.includes(true))
									return false;
								if (block.type == "$nor" && arr.includes(true))
									return false;
							}
						}
					}
				}
				return true;
			})
			.sort((a, b) => {
				let ld = b.level - a.level;
				if (ld != 0) return ld;
				else return b.id - a.id;
			})
		// console.log("filter result: " + arr.length + ", from " + this.db.data.jsonItems.length);

		this.comparing = filter.comparing;
		if(this.comparing) {
			arr = arr.filter(i => this.diffChecker.itemDiff(i.id));
		}
		this.mason.fulldata.push(...arr);
	}

	/*
	private async loadData(itemFilter, skip: number, limit: number) { //pageId: number) {
		// just load the rest of the .fulldata in the background
		// maybe do 25 items (show), 50 (bg), infinite (bg)
		var pipeline = [];
		{
			// actual filter
			pipeline.push({ $match: itemFilter ?? "" });
			// sums
			//   if(Object.keys(adds.$addFields).length > 0)
			//     pipeline.push(adds);
			// sort
			pipeline.push({ $sort: { "level": -1, "id": -1 } });
			// // skip
			pipeline.push({ $skip: skip }); // this.mason.page * this.mason.itemsPerPage
			// // limit
			if(limit != 0) pipeline.push({ $limit: limit }); // this.mason.itemsPerPage
		};
		// console.log("search 1, limit: " + this.mason.itemsPerPage + ", skip: " + this.mason.page * this.mason.itemsPerPage)

		let cursor = this.emerald.collectionItems.aggregate(pipeline);
		let arr = await cursor.toArray(); 
		// let arr = await this.db.mongoItemsAggregate(pipeline);
		this.mason.fulldata.push(...arr);
		// console.log("loaded data: " + arr.length);
		// console.log("arr: " + arr + ", fulldata: " + this.mason.fulldata.length);
	}
	*/

	/*
	public generateFilter(filter: Filter) {
		var adds = { $addFields: {} };
		var mongofilter = { $and: [] };
		var types = { $or: [] };
		// Level
		if(filter.filterLevel) {
			mongofilter.$and.push({ "level": { "$gte": parseInt(filter.levelMin + "") } });
			mongofilter.$and.push({ "level": { "$lte": parseInt(filter.levelMax + "") } });
		}	
		// Types
		if (filter.filterType) {
			filter.types.forEach((v, k) => {
				if (v) types.$or.push({ "typeId": k });
			})
		}
		// Weapons
		if (filter.filterWeapon) {
			filter.armes.forEach((v, k) => {
				if (v) types.$or.push({ "typeId": k });
			})
		}
		if (filter.filterType || filter.filterWeapon) {
			mongofilter.$and.push(types);
		}
		// Text
		if (filter.filterText && filter.filterText != "") {
			let regex  = { "$regex": util.caseAndAccentInsensitive(filter.filterText), "$options": "gi" }
			if (this.db.lang == "fr")
				mongofilter.$and.push({ "namefr": regex })
			else
				mongofilter.$and.push({ "nameen": regex })
		}
		/* TODO BLOCKS & MODS
		let bi = 0;
		filter.blocks.forEach(block => {
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
		* /
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
	*/

	private filterSumMemory(block: BlockFilter, item) {
		let mask = block.mods.map(m => m.effectId);
		let effects: any[] = item.possibleEffects;
		let maskResult = effects.filter(e => mask.includes(this.getEffect(e).characteristic))

		let sum: number = maskResult.reduce((part: number, e) => {
			let effectModel = this.getEffect(e);
			let eMin = e.diceNum * effectModel.bonusType
			let eMax = e.diceSide * effectModel.bonusType
			// console.log("filterPseudoSum: " + eMax);
			if (eMax == 0) return part + eMin;
			else return part + eMax;
		}, 0);
		// take min/max from first item
		let theoMin = block.mods[0].min || -100000
		let theoMax = block.mods[0].max || 100000
		// pseudo stat
		// console.log("filterPseudoSum: " + sum + ", mod: " + modMin + ", " + modMax);
		if (sum < theoMin) return false;
		if (sum > theoMax) return false;
		return true;
	}
	private filterStatMemory(mod: ModFilter, item): boolean {
		if (!mod.effectId) return true;
		let modMin: number = parseInt(mod.min + "");
		let modMax: number = parseInt(mod.max + "");
		if (!mod.min) modMin = -100000;
		let effects: any[] = item.possibleEffects;
		return effects.some(e => {
			// charac
			let effectModel = this.getEffect(e);
			if (effectModel.characteristic != mod.effectId) return false;
			if (effectModel.useInFight) return false; // can't filter weapon effects for now
			// min max
			let eMin = e.diceNum * effectModel.bonusType
			let eMax = e.diceSide * effectModel.bonusType
			// console.log("filterStat: effect: " + eMin + "," + eMax + ",  mod: " + modMin + "," + modMax);
			if (mod.max) {
				let minFilter = eMin >= modMin && eMin <= modMax;
				let maxFilter = eMax >= modMin && eMax <= modMax;
				return minFilter || maxFilter
			} else {
				let minFilter = eMin >= modMin;
				let maxFilter = eMax >= modMin;
				return minFilter || maxFilter
			}
		});
	}
	private filterStatMemoryPseudo(mod: ModFilter, item): boolean {
		let charac = this.db.pseudoCharacs.find(c => c.id == mod.effectId);

		switch (charac.subcategoryId) {
			case 0:
				return this.filterStatPseudoCharacteristics(mod, item);
			case 1:
				return this.filterStatPseudoProperty(mod, item);
			// case 2:
			// 	return this.filterStatPseudoSpecial(mod, item);
		}
		return true;
	}
	private filterStatPseudoSpecial(mod: ModFilter, item): boolean {
		let charac = this.db.pseudoCharacs.find(c => c.id == mod.effectId);
		// 12004 = item modified in the last game update
		if(mod.effectId == 12004) {
			let olditem = this.db.data2.jsonItemsById[item.id];
			if(olditem != item) {

			}
		}
		return true;
	}
	private filterStatPseudoProperty(mod: ModFilter, item): boolean {
		let charac = this.db.pseudoCharacs.find(c => c.id == mod.effectId);
		return !!item[charac.name];
	}
	private filterStatPseudoCharacteristics(mod: ModFilter, item): boolean {
		let modMin: number = parseInt(mod.min + "");
		let modMax: number = parseInt(mod.max + "");
		if (!mod.min) modMin = -100000;
		// pseudo stat
		let charac = this.db.pseudoCharacs.find(c => c.id == mod.effectId);
		// get resistance effects
		let effects: any[] = item.possibleEffects;
		let resis = effects.filter(e => charac.mask.includes(this.getEffect(e).characteristic))
		// console.log("filterPseudo mask: " + charac.mask ); //+ " res: " + JSON.stringify(resis));

		if (charac.count) {
			let count = resis.length;
			// console.log("filterPseudoCount: " + count + ", mod: " + modMin + ", " + modMax);
			if (mod.min && count < modMin) return false;
			if (mod.max && count > modMax) return false;
		} else {
			let sum: number = resis.reduce((part: number, e) => {
				let effectModel = this.getEffect(e);
				let eMin = e.diceNum * effectModel.bonusType
				let eMax = e.diceSide * effectModel.bonusType
				// console.log("filterPseudoSum: " + eMax);
				if (eMax == 0) return part + eMin;
				else return part + eMax;
			}, 0);
			// console.log("filterPseudoSum: " + sum + ", mod: " + modMin + ", " + modMax);
			if (mod.min && sum < modMin) return false;
			if (mod.max && sum > modMax) return false;
		}
		return true;
	}

	public getEffect(possibleEffect) {
		possibleEffect.effect ??= this.db.data.jsonEffectsById[possibleEffect.effectId];
		//this.db.data.jsonEffects.filter(e => e.id == possibleEffect.effectId)[0];
		return possibleEffect.effect;
	}
}
