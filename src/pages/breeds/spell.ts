import { watch } from '@aurelia/runtime-html';
import { Citerions, CriteriaGroup } from './../../DofusDB/static/formulas/criterions';
import { bindable, DI, inject } from "aurelia";
import { db } from '../../DofusDB/db';
import { I18N } from '@aurelia/i18n';
import { SpellZone } from "../../DofusDB/formulas";
import { ConditionRenderer } from '../../ts/conditions';

@inject(db)
export class Spell {
	
	@bindable
	public spellid: number;
	@bindable
	public depth: number = 0;
	@bindable
	public issummon: boolean = false;
	@bindable
	public ispassive:boolean = false;

	public showbit: boolean[] = []
	public thing = false;
	
	private db: db;
	private conditionRenderer: ConditionRenderer;


	public constructor(db: db, conditionRenderer: ConditionRenderer, @I18N private readonly i18n: I18N) {
		this.db = db;
		this.conditionRenderer = conditionRenderer;
	}

	public get dbLoaded() {
		return this.db.promiseLoadingSpells;
	}

	public get spell() {
		return this.db.data.jsonSpells[this.spellid];
	}
	public get name() {
		return this.db.getI18n(this.spell.nameId);
	}

	public get cutDescription(): string[] {
		if(!this.spell) {
			// happens when going from changelog to breed page, this.spellid is still null
			// console.log("spell null: " + this.spellid) 
			return [""];
		}
		let text = this.db.getI18n(this.spell.descriptionId);
		if (!text) return [""]; // les invoc chafer n'ont pas de description sur leurs sorts par exemple
		let data = [];
		while (text.includes("{")) {
			let start = text.indexOf("{");
			let end = text.indexOf("}") + 1;

			data.push(text.substring(0, start))
			data.push(text.substring(start, end))
			text = text.substring(end)
		}
		// remaining text
		if(text.length > 0) 
			data.push(text)
		// console.log({data})
		// this.showbit = data.map(t => false);
		return data;
	}

	attached() {
		this.showbit = this.cutDescription.map(t => false);
	}

	public renderDescriptionBit(text: string) {
		if(!text) return "";
		if (text.includes("{")) {
			let sub = text.substring(text.indexOf("{"), text.indexOf("}") + 1)
			let data = sub.replace("}", "").split("::");
			let spellData = data[0].split(",");
			let html = data[1];
			text = text.replace(sub, html);
		}
		return text;
	}
	
	public getDescriptionRenderStyle(text: string) {
		if (text.includes("{")) {
			return "white-space: pre-line; font-weight: bold; cursor: pointer;";
		} else {
			return "white-space: pre-line;";
		}
	}

	public clickDescription(index) {
		this.showbit[index] = !this.showbit[index]
		for (let i = 0; i < this.showbit.length - 1; i++) {
			if (i == index) continue;
			this.showbit[i] = false;
		}
		this.thing = false;
		this.thing = this.showbit[index];
		// console.log(this.thing + " show[" + index + "]: " + this.showbit)
	}
	public clickHidePopup() {
		// for (let i = 0; i < this.showbit.length - 1; i++) {
		// 	this.showbit[i] = false;
		// }
		// this.thing = false;
		// console.log("hide popup")
	}

	/*
	public get detailsObj(): any {
		if (!this.spell) return null;
		// console.log("detailsObj: " + JSON.stringify(this.db.jsonSpellsDetails))
		return this.db.jsonSpellsDetails[this.spell.id];
	}

	public get details() {
		let detail = this.db.jsonSpellsDetails[this.spell.id];
		if (!detail) {
			return "";
		}
		let str: string = "";
		if (detail.text) {
			for (let s of detail.text) {
				str += s; //db.insertEntityIcon(s);
				str += "\n";
				// str += "<br/>";
			}
		}
		if (detail.effects) {
			for (let s of detail.effects) {
				str += s; //db.insertEntityIcon(s);
				str += "\n";
				// str += "<br/>";
			}
		}
		return str;
	}
	*/

	public get summonEffects() {
		return this.spell.effects.filter(e => this.hasSummon(e));
	}
	public hasSummon(e: any) {
		return db.isSummonEffect(e) && e.visibleInTooltip && this.db.data.jsonSummons[e.diceNum]; // e.effectId == 181 || e.effectId == 1011 || e.effectId == 1008;
	}
	public getSummon(e: any): any {
		if (!this.hasSummon(e)) return null;
		return this.db.data.jsonSummons[e.diceNum];
	}

	public get hasSubSpell() {
		let text = this.db.getI18n(this.spell.descriptionId);
		if (!text) return false;
		let has = text.includes("{");
		// console.log("desc has spell: " + has)
		return has;
	}
	public get subSpellId() {
		let text = this.db.getI18n(this.spell.descriptionId);
		if (!text) return false;
		if (text.includes("{")) {
			let sub = text.substring(text.indexOf("{"), text.indexOf("}") + 1)
			sub = sub.replace("{", "").replace("}", "")
			let data = sub.split("::")[0].split(",");
			let spellid = data[1]
			let grade = data[2];
			if (this.db.data.jsonSpells[spellid])
				return spellid;
			else
				return spellid + "-" + grade;
		}
		return 0;
	}

	public textHasSubSpell(text: string) {
		if (!text) return false;
		let has = text.includes("{");
		// console.log("desc has spell: " + has)
		return has;
	}
	public getTextSubSpellId(text: string) {
		if (!text) return false;
		if (text.includes("{")) {
			let sub = text.substring(text.indexOf("{"), text.indexOf("}") + 1)
			sub = sub.replace("{", "").replace("}", "")
			let data = sub.split("::")[0].split(",");
			let spellid = data[1]
			let grade = data[2];
			if (this.db.data.jsonSpells[spellid])
				return spellid;
			else
				return spellid + "-" + grade;
		}
		return 0;
	}


	public isStateSubspell(e) {
		if (db.isEffectState(e)) {
			let state = this.db.data.jsonStates[e.value]
			if (!state) return false;
			let name = this.db.getI18n(state.nameId);
			if (name && name.includes("{")) {
				return true;
			}
		}
		// state condition, fouet osa dragocharge, +1 combo,
		if (db.isSubSpell(e)) {
			let subspell = this.getSubSpell(e);
			if (!subspell) return false;
			let name = this.db.getI18n(subspell.nameId);
			if (name && name.includes("{")) {
				return true;
			}
		}
		return false;
	}
	public getStateSubspellId(e) {
		// let state = this.db.jsonStates[e.value]
		// let stateName = this.db.getI18n(state.nameId);
		// stateName = stateName.replace("{", "").replace("}", "");
		// let data = stateName.split(",");
		// let subSpellId = data[1];
		// return subSpellId;
		let spellString;
		// état
		if (db.isEffectState(e)) {
			let state = this.db.data.jsonStates[e.value]
			spellString = this.db.getI18n(state.nameId);
		}
		if (db.isSubSpell(e)) {
			let subspell = this.getSubSpell(e);
			spellString = this.db.getI18n(subspell.nameId);
		}

		spellString = spellString.replace("{", "").replace("}", "");
		let data = spellString.split("::")[0].split(",");
		// let subSpellId = data[1];
		// return subSpellId;
		let subspellid = data[1]
		let subgrade = data[2];
		return subspellid + "-" + subgrade;
	}
	public getSubSpell(e: any) {
		let grade = e.diceSide;
		let key = e.diceNum + "";
		if (grade) key += "-" + grade;
		return this.db.data.jsonSpells[key];
	}

	public get hasCondition() {
		return this.spell.statesCriterion && this.spell.statesCriterion != 'null';
	}
    public getConditionsString(spell) {
        let str = "";

        // commented out bc this crashes with musamune (id 23590)
        // console.log("conds: " + this.item.criteria);
        let root: CriteriaGroup = Citerions.parse(spell.statesCriterion);
        str = JSON.stringify(root)
        // console.log({root})
        // console.log("conditionRenderer: " + this.conditionRenderer)

        return this.i18n.tr("condition.condition") + this.conditionRenderer.render(root);
        return str;
    }

}
