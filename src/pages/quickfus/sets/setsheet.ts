import { ConditionRenderer } from './../../../ts/conditions';
import { CriteriaGroup } from './../../../DofusDB/static/formulas/criterions';
import { bindable, IEventAggregator, inject } from "aurelia";
import { db } from "../../../DofusDB/db";
import { Citerions, CriterionUtil, Criteria } from '../../../DofusDB/static/formulas/criterions';
import { json } from 'body-parser';
import { I18N } from "@aurelia/i18n";
import { DofusSet } from '../../../ts/dofusModels';

@inject(Router)
export class setsheet {

	// @bindable property with <element property.bind="set"></element>
	@bindable
	private data: DofusSet;
    private db: db;

	// check if this set has conditions
	// private hasConditions: boolean = false;

	public hidden = "hidden";


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

	// when binding is done
	attached() {
		// if (setsearch.inst) setsearch.inst.loadedCount++;
		// if (setsearch.inst) setsearch.inst.onLoadedSheet();
        this.ea.publish("setsheet:loaded");
		this.hidden = "";
	}

	// public getStatColor(stat) {
	// 	return db.getStatColor(stat);
	// }

	public hoverSet() {
		console.log("hover set");
	}
	public hoverItem() {
		console.log("hover item");
	}

	public getImgUrl(item) {
		return db.getImgUrl(item);
	}
	
    // public get itemIconUrl() {
    //     return this.db.gitFolderPath + "sprites/items/" + this.item.iconId + ".png";
    // }

}
