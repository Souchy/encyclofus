import { DofusEffect, DofusItem } from './../../../ts/dofusModels';
import { ConditionRenderer } from './../../../ts/conditions';
import { CriteriaGroup } from './../../../DofusDB/static/formulas/criterions';
import { bindable, IEventAggregator, inject } from "aurelia";
import { db } from "../../../DofusDB/db";
import { Citerions, CriterionUtil, Criteria } from '../../../DofusDB/static/formulas/criterions';
import { json } from 'body-parser';
import { I18N } from "@aurelia/i18n";
import { DofusSet } from '../../../ts/dofusModels';

// @inject()
export class setsheet {

    private db: db;

	// @bindable property with <element property.bind="set"></element>
	@bindable
	private data: DofusSet;
	@bindable
	public comparing: boolean = false;

	// check if this set has conditions
	// private hasConditions: boolean = false;

	public engdiv: HTMLDivElement;

	public hidden: string = "hidden";
	public bonusCounter: number = 1;

	public items: DofusItem[] = [];
	public finishedLinkingItems: boolean = false;

	public comparedEffects: DofusEffect[][];
	public finishedComparison: boolean = false;

	private promiseItems: Promise<void>
	private promiseComparison: Promise<void>

	// Ctor
	constructor(db: db, @I18N private readonly i18n: I18N, @IEventAggregator readonly ea: IEventAggregator) {
		this.db = db;
		// this.hasConditions = "conditions" in this.data;
		// console.log("setsheet");
	}

	public isntPseudo(effect) {
		let name: string = effect.name;
		return name.includes("(isntPseudo)");
	}

	binding() {
		// console.log("Set data: ");
		// console.log(this.data);
		this.bonusCounter = this.data.effects.length - 1;
		setTimeout(() => this.promiseItems = this.linkItems(), 0);
		setTimeout(() => this.promiseComparison = this.loadComparison(), 0);
	}

	// when binding is done
	async attached() {
		// if (setsearch.inst) setsearch.inst.loadedCount++;
		// if (setsearch.inst) setsearch.inst.onLoadedSheet();
		await this.promiseItems;
		await this.promiseComparison
        this.ea.publish("setsheet:loaded", this.engdiv.parentElement);
		this.hidden = "";
	}

	public async linkItems() {
		for(let itemid of this.data.items) {
			if(itemid == null) continue;
			let item = this.getItem(itemid);
			if(item == null) continue;
			this.items.push(item);
			// this.data["itemsdata"][itemid] = item;
		}
		this.finishedLinkingItems = true;
	}

	public hoverSet() {
		// console.log("hover set");
	}
	public hoverItem() {
		// console.log("hover item");
	}
	
	public getItem(itemId: number): DofusItem {
		return this.db.data.jsonItemsById[itemId];
	}
    public getImgUrl(itemId: number) {
		let item = this.getItem(itemId);
		// console.log("Get img url for: " + itemId);
		// console.log(item);
        return this.db.gitFolderPath + "sprites/items/" + item.iconId + ".png";
    }

	public get name() {
		return this.db.getI18n(this.data.nameId);
	}

	public get bonusCounterHasEffects() {
		let bonuses = this.data.effects;
		// if(this.comparing)
		// 	bonuses = this.comparedEffects;
		if(this.bonusCounter in bonuses) {
			let effects = bonuses[this.bonusCounter];
			// console.log("bonusCounterHasEffects: " + JSON.stringify(effects))
			return effects.length > 0 && effects[0] != null;
		}
		return false;
	}

	public get highestItemLevel() {
		return this.db.data.highestItemLevel(this.data);
	}

	public async loadComparison() {
		this.comparedEffects = [];
		if(this.data.id in this.db.data2.jsonItemSetsById == false) {
			this.finishedComparison = true;
			this.comparedEffects = this.data.effects;
			return;
		}
		let oldSet = this.db.data2.jsonItemSetsById[this.data.id]; 
		// console.log("Oldset: ")
		// console.log(oldSet);

		for(let b = 0; b < this.data.effects.length; b++) {
			this.comparedEffects[b] = [];
			for(let newEffect of this.data.effects[b]) {
				if(!newEffect) continue;
				let comparison = { ...newEffect };
				this.comparedEffects[b][comparison.effectId] = comparison;
			}
			for(let oldEffect of oldSet.effects[b]) {
				if(!oldEffect) continue;
				if(oldEffect.effectId in this.comparedEffects[b]) {
					let comparison = this.comparedEffects[b][oldEffect.effectId];
					comparison.diceNum = comparison.diceNum - oldEffect.diceNum;
					comparison.diceSide = comparison.diceSide - oldEffect.diceSide;
				} else {
					let comparison = { ...oldEffect };
					this.comparedEffects[b][comparison.effectId] = comparison;
					comparison.diceNum = 0 - oldEffect.diceNum;
					comparison.diceSide = 0 - oldEffect.diceSide;
				}
			}
		}
		this.finishedComparison = true;
	}

	// public group(items: any[], fn) {
	// 	items.reduce((prev, next, arr) => {
	// 		const prop = fn(next);
	// 		return {
	// 		  ...prev,
	// 		  [prop]: prev[prop] ? [...prev[prop], next] : [next],
	// 		};
	// 	});
	// }

}
