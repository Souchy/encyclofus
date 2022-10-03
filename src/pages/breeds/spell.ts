import { bindable, inject } from "aurelia";
import { db } from '../../DofusDB/db';
import { I18N } from '@aurelia/i18n';

@inject(db)
export class Spell {
	private db: db;

	@bindable
	public spellid: number;
	@bindable
	public issummon: boolean = false;

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
		return this.db.getI18n(this.spell.descriptionId);
	}

	public renderEffectI18n(e) {
		let text = this.db.getI18n(e.effect.descriptionId);

		// invocation
		if(this.hasSummon(e)) {
			let summon = this.getSummon(e);
			// console.log("monster: " + JSON.stringify(summon));
			let name = this.db.getI18n(summon.nameId);
			text = text.replace("#1", name);
		}

		let min = e.diceNum;
		let max = e.diceSide;
		text = text.replace("#1", min);
		if (max) {
			text = text.replace("{~1~2", "")
			text = text.replace("}", "")
			text = text.replace("#2", max);
		} else {
			text = text.substring(0, text.indexOf("{")) + text.substring(text.indexOf("}") + 1)
			text = text.replace("#2", "");
		}
		if (e.value) {
			let state = this.db.jsonStates[e.value]
			if (state) text = text.replace("#3", this.db.getI18n(state.nameId));
		}
		if (e.duration) {
			text += " (" + e.duration + " " + this.i18n.tr("turns") + ")";
		}

		return text;
	}

	public hasSummon(e: any) {
		return e.effectId == 181;
	}
	public getSummon(e: any): any {
		if(!this.hasSummon(e)) return null;
		return this.db.jsonSummons[e.diceNum];
	}



	// public renderEffectAoe(e) {
	// 	let zone: string = e.rawZone;
	// 	let length = e.rawZone.charAt(1);
	// 	let str = "";
	// 	if(zone.startsWith("C")) {
	// 		str = "Cercle";
	// 	}
	// 	if(zone.startsWith("P")) {
	// 		str = "Point";
	// 	}
	// 	if(length > 1) {
	// 		str += " de " + length;
	// 	}
	// 	return str;
	// }

	public getIcon(val: string) {
		console.log("spell get icon for: " + val)
		if (val) {
			return this.db.getModIconStyle(this.renderEffectI18n(val));
		}
		return "";
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

	public removeFighterIconTag(str: string) {
		return str.substring(0, str.indexOf("{"));
	}
	public getFighterIcon(val: string) {
		if (val) {
			let style = this.db.getFighterIconStyle(val);
			return style;
		}
		return "";
	}


}
