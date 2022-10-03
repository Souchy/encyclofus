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

	public renderTrapGlyph(e) {
		let text = this.db.getI18n(e.effect.descriptionId);
		let subspellid = e.diceNum;
		let tg = this.getTrapGlyph(e);
		console.log("trap glyph: " + JSON.stringify(tg))
		// doSpell(subspellid);
		//  if.bind="hasTrapGlyph(e)"
		// text += this.db.getI18n(tg.nameId);
		// text +=
		text =
			`
			<table class="table table-striped table-sm table-borderless" style="width: 100%; margin-bottom: 0px;">
				<tbody>
					`
					+
					tg.effects.map(e1 => {
						if(!e1.visibleInTooltip) return "";
						return `<tr>
									<td style="vertical-align: middle;"> &nbsp;&nbsp;&nbsp;`+ this.renderEffectI18n(e1) + `</td>
									<td style.bind="getIcon(e1)"></td>
									<td style.bind="db.getAoeIconStyle(e1)"></td>
								</tr>`
					}).join("")
					+
					`
				</tbody>
			</table>`;
		return text;
	}

	public renderEffectI18n(e) {
		let text = this.db.getI18n(e.effect.descriptionId);
		let has1 = text.includes("#1");
		let has2 = text.includes("#2");
		let has3 = text.includes("#3");
		// invocation
		if (this.hasSummon(e)) {
			let summon = this.getSummon(e);
			// console.log("monster: " + JSON.stringify(summon));
			let name = this.db.getI18n(summon.nameId);
			text = text.replace("#1", name);
		}
		// piège/glyphes
		// if (e.effectId == 400 || e.effectId == 401) {
		// 	// return;
		// }

		// ajoute relance 
		if(e.effectId == 1035) {
			text = text.replace("#1", this.db.getI18n(this.spell.nameId)); // this.name
			text = text.replace("#3", e.value);
		} else
		// effet de charge
		if (has1 && has3 && !has2) { // if(e.effectId == 293) { //} && e.diceNum != e.spellId) {
			let subspellid = e.diceNum;
			let subspell = this.db.jsonSpells[subspellid];
			// doSpell(subspellid);

			text = text.replace("#1", this.db.getI18n(subspell.nameId));
			text = text.replace("#3", e.value);
		}
		// state condition, fouet osa dragocharge
		if (e.effectId == 1160 || e.effectId == 2160 || e.effectId == 2794) {
			let subspellid = e.diceNum;
			let subspell = this.db.jsonSpells[subspellid];
			text = text.replace("#1", this.db.getI18n(subspell.nameId));
		}
		// état
		if (e.effectId == 950) {
			// if (e.value) {
			let state = this.db.jsonStates[e.value]
			let stateName = this.db.getI18n(state.nameId);
			// "968135": "{spell,24036,1::<u>Saoul</u>}",
			if (!stateName) {
				console.log("state: " + JSON.stringify(state))
			} else
				if (stateName.includes("{")) {
					stateName = stateName.replace("{", "").replace("}", "");
					let data = stateName.split(",");
					let subSpellId = data[1];
					let stateSpell = this.db.jsonSpells[subSpellId];
					stateName = stateName.split("::")[1] + "<spell spellid.bind='" + subSpellId + "' issummon.bind='" + this.issummon + "'></spell>";
				}
			if (state) text = text.replace("#3", stateName);
		}
		// min/max
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
		// conjugaison
		if (min > 1 || max > 1) {
			text = text.replace("{~ps}{~zs}", "s");
		} else {
			text = text.replace("{~ps}{~zs}", "");
		}
		// durée
		if (e.duration > 0) {
			text += " (" + e.duration + " " + this.i18n.tr("turns") + ")";
		}
		return text;
	}

	public hasSummon(e: any) {
		return e.effectId == 181;
	}
	public getSummon(e: any): any {
		if (!this.hasSummon(e)) return null;
		return this.db.jsonSummons[e.diceNum];
	}

	public hasTrapGlyph(e: any) {
		return e.effectId == 400 || e.effectId == 401 || e.effectId == 1091;
	}
	public getTrapGlyph(e: any): any {
		if (!this.hasTrapGlyph(e)) return null;
		return this.db.jsonSpells[e.diceNum];
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
		// console.log("spell get icon for: " + val)
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