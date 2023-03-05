import { bindable, DI, inject } from "aurelia";
import { db } from '../../DofusDB/db';
import { I18N } from '@aurelia/i18n';
import { SpellZone } from "../../DofusDB/formulas";

@inject(db)
export class Spell {
	private db: db;

	@bindable
	public spellid: number;
	@bindable
	public issummon: boolean = false;
	@bindable
	public depth: number = 0;

	public constructor(db: db, @I18N private readonly i18n: I18N) {
		this.db = db;
	}

	public get dbLoaded() {
		return this.db.promiseLoadingSpells;
	}

	public get spell() {
		return this.db.jsonSpells[this.spellid];
	}
	public get name() {
		return this.db.getI18n(this.spell.nameId);
	}
	public get description() {
		let text = this.db.getI18n(this.spell.descriptionId);
		if (text) // les invoc chafer n'ont pas de description sur leurs sorts par exemple
			while (text.includes("{")) {
				// console.log("desc: " + text);
				let sub = text.substring(text.indexOf("{"), text.indexOf("}") + 1)
				let data = sub.replace("}", "").split("::");
				let spellData = data[0].split(",");
				let html = data[1];
				text = text.replace(sub, html);
			}
		return text;
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
		return this.db.isSummonEffect(e) && e.visibleInTooltip && this.db.jsonSummons[e.diceNum]; // e.effectId == 181 || e.effectId == 1011 || e.effectId == 1008;
	}
	public getSummon(e: any): any {
		if (!this.hasSummon(e)) return null;
		return this.db.jsonSummons[e.diceNum];
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
			if (this.db.jsonSpells[spellid])
				return spellid;
			else
				return spellid + "-" + grade;
		}
		return 0;
	}

	public isStateSubspell(e) {
		if (this.db.isEffectState(e)) {
			let state = this.db.jsonStates[e.value]
			if (!state) return false;
			let name = this.db.getI18n(state.nameId);
			if (name.includes("{")) {
				return true;
			}
		}
		// state condition, fouet osa dragocharge, +1 combo,
		if (this.db.isSubSpell(e)) {
			let subspell = this.getSubSpell(e);
			if (!subspell) return false;
			let name = this.db.getI18n(subspell.nameId);
			if (name.includes("{")) {
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
		if (this.db.isEffectState(e)) {
			let state = this.db.jsonStates[e.value]
			spellString = this.db.getI18n(state.nameId);
		}
		if (this.db.isSubSpell(e)) {
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
		return this.db.jsonSpells[key];
	}

}
