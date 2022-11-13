import { bindable, DI, inject } from "aurelia";
import { db } from '../../../DofusDB/db';
import { I18N } from '@aurelia/i18n';
import { SpellZone } from "../../../DofusDB/formulas";

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
				let sub = text.substring(text.indexOf("{"), text.indexOf("}") + 1)
				let rep = sub.replace("}", "").split("::")[1];
				text = text.replace(sub, rep);
			}
		return text;
	}

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

	public hasSummon(e: any) {
		return this.db.isSummonEffect(e) && e.visibleInTooltip; // e.effectId == 181 || e.effectId == 1011 || e.effectId == 1008;
	}
	public getSummon(e: any): any {
		if (!this.hasSummon(e)) return null;
		return this.db.jsonSummons[e.diceNum];
	}

	
}
