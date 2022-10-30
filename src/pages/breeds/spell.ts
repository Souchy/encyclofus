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
		let text = this.db.getI18n(this.spell.descriptionId);
		if (text) // les invoc chafer n'ont pas de description sur leurs sorts par exemple
			while (text.includes("{")) {
				let sub = text.substring(text.indexOf("{"), text.indexOf("}") + 1)
				let rep = sub.replace("}", "").split("::")[1];
				text = text.replace(sub, rep);
			}
		return text;
	}

	public renderTrapGlyph(e, depth?: number) {
		if (!depth) depth = 1;
		let text = this.db.getI18n(e.effect.descriptionId);
		let subspellid = e.diceNum;
		let tg = this.getTrapGlyph(e);
		// console.log("trap glyph: " + e.effectId)
		// console.log("trap glyph: " + JSON.stringify(tg))
		// if(e.spellId == 13019 || e.spellId == 13030 || e.spellId == 13044) {
		// 	console.log("barriere " + e.spellId)
		// }
		let tab = "";
		for (let i = 0; i <= depth; i++) {
			tab += "&nbsp;&nbsp;&nbsp;";
		}
		let paddingLeft = depth * 15 + 4;

		let stuff = [
			`<table class="table table-striped table-sm table-borderless" style="width: 100%; margin-bottom: 0px;">`,
			`<tbody>`
		];
		let effs = tg.effects.map(e1 => {
			let tex = "";
			let icon = this.getIcon(e1);
			if (e1.visibleInTooltip) { // || e1.effect.showInTooltip){
				let arr = [
					`<tr>`,
						`<td style="padding: 0px;">`,
							`<table class="table table-striped table-sm table-borderless" style="--bs-table-striped-bg: none; width: 100%; margin-bottom: 0px;">`,
								`<tbody>`,
									`<tr>`,
										(
											icon ?
												`<td style="width: 20px; padding: 0px; padding-left: ` + paddingLeft + `px;">
													<div style="${icon}"></div>
												</td>`
												: `<td style="width: 20px; padding: 0px; padding-left: ` + paddingLeft + `px;"></td>`
										),
										`<td style="vertical-align: middle;">` + this.renderEffectI18n(e1) + `</td>`,
										(this.isDuration(e1) ? `<td style.bind="${this.getDispellIcon(e1)}"></td>` : ""),
										this.getTargets(e1).map(t => {
											if (this.getTargetIcon(t)) return `<td style="${this.getTargetIcon(t)}"></td>`
										}).join(""),
										(this.db.getAoeIconStyle(e1) ? `<td style="${this.db.getAoeIconStyle(e1)}"></td>` : ""),
									`</tr>`,
								`</tbody>`,
							`</table>`,
						`</td>`,
					`</tr>`
				];
				tex = arr.join("");
			}
			if (e1.visibleInTooltip || e1.visibleOnTerrain) {
				if (this.hasTrapGlyph(e1) && e1.diceNum != e.spellId && e1.diceNum != e1.spellId) {
					// tex += this.renderTrapGlyph(e1);
					tex += this.renderSubSpell(e1, depth + 1);
				}
			}
			return tex;
		})
		stuff.push(...effs);
		stuff.push(`</tbody>`);
		stuff.push(`</table>`);
		text = stuff.join("");
		return text;
	}

	public renderSubSpell(e, depth?: number) {
		if (!depth) depth = 0;
		let subspellid = e.diceNum;
		let subspell = this.db.jsonSpells[subspellid];
		if (!subspell) return ""
		// if(e.spellId == 13019 || e.spellId == 13030 || e.spellId == 13044) {
		// 	console.log("renderSubSpell " + e.spellId)
		// }
		let tab = "";
		for (let i = 0; i <= depth; i++) {
			tab += "&nbsp;&nbsp;&nbsp;";
		}
		let text = "";
		let paddingLeft = depth * 15 + 4;
		let stuff = [
			`<table class="table table-striped table-sm table-borderless" style="width: 100%; margin-bottom: 0px;">`,
			`<tbody>`
		];

		let effs = subspell.effects.map(e1 => {
			let tex = "";
			// if (e1.diceNum == 13044) {
			// 	console.log("13044 reference: " + JSON.stringify(e1))
			// }
			let icon = this.getIcon(e1);
			if (e1.visibleInTooltip) { //  || e1.effect.showInTooltip
				let arr = [
					`<tr>`,
						`<td style="padding: 0px;">`,
							`<table class="table table-striped table-sm table-borderless" style="--bs-table-striped-bg: none; width: 100%; margin-bottom: 0px;">`,
								`<tbody>`,
									`<tr>`,
										(
											icon ?
												`<td style="width: 20px; padding: 0px; padding-left: ` + paddingLeft + `px;">
													<div style="${icon}"></div>
												</td>`
												: `<td style="width: 20px; padding: 0px; padding-left: ` + paddingLeft + `px;"></td>`
										),
										`<td style="vertical-align: middle;">` + this.renderEffectI18n(e1) + `</td>`,
										(this.isDuration(e1) ? `<td style.bind="${this.getDispellIcon(e1)}"></td>` : ""),
										this.getTargets(e1).map(t => {
											if (this.getTargetIcon(t)) return `<td style="${this.getTargetIcon(t)}"></td>`
										}).join(""),
										(this.db.getAoeIconStyle(e1) ? `<td style="${this.db.getAoeIconStyle(e1)}"></td>` : ""),
									`</tr>`,
								`</tbody>`,
							`</table>`,
						`</td>`,
					`</tr>`
				];
				tex = arr.join("");
			}
			if (e1.visibleInTooltip || e1.visibleOnTerrain) {
				// 1160 pour barrière je pense
				if (e1.diceNum != e.spellId && e1.diceNum != e1.spellId && (this.hasTrapGlyph(e1))) { //  || e1.effectId == 1160
					if (this.hasTrapGlyph(e1)) {
						tex += "<tr><td colspan=3>" + this.renderTrapGlyph(e1, depth + 1) + "</td></tr>"
					}
					if (e1.effectId == 1160) {
						tex += "<tr><td colspan=3>" + this.renderSubSpell(e1, depth + 1) + "</td></tr>"
					}
				}
			}
			return tex;
		});
		stuff.push(...effs);
		stuff.push(`</tbody>`);
		stuff.push(`</table>`);
		return text;
	}

	public isDuration(e) {
		return this.db.hasDispellIcon(e);
	}
	// public isDispellable(e) {
	// 	return e.dispellable == 1;
	// }
	public getDispellIcon(e) {
		return this.db.getDispellIcon(e);
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
		// state condition, fouet osa dragocharge, +1 combo,
		if (this.db.isEffectThing(e)) {
			let subspellid = e.diceNum;
			let subspell = this.db.jsonSpells[subspellid];
			if (!subspell) {
				console.log("error at uid " + e.effectUid)
			}
			let name = this.db.getI18n(subspell.nameId);

			if (name.includes("{")) {
				let obj = name.substring(name.indexOf("{"), name.indexOf("}"))
				name = name.substring(0, name.indexOf("{"));
				// name = name.replace("{", "").replace("}", "");
				let data = obj.split(",");
				let subSpellId = data[1];
				let stateSpell = this.db.jsonSpells[subSpellId];
				obj = obj.split("::")[1] + "<spell spellid.bind='" + subSpellId + "' issummon.bind='" + this.issummon + "'></spell>";
				name += obj;
			}
			text = text.replace("#1", name);
		}
		// augmente ou réduit le cooldown du sort 
		if (this.db.isEffectChargeCooldown(e)) {
			text = text.replace("#1", this.db.getI18n(this.spell.nameId)); // this.name
			text = text.replace("#3", e.value);
		}
		// effet de charge
		if (this.db.isEffectCharge(e)) { // if (has1 && has3 && !has2) { //
			let subspellid = e.diceNum;
			let subspell = this.db.jsonSpells[subspellid];
			text = text.replace("#1", this.db.getI18n(subspell.nameId));
			text = text.replace("#3", e.value);
		}
		// état
		if (this.db.isEffectState(e)) {
			// if (e.value) {
			let state = this.db.jsonStates[e.value]
			if (!state) { }
			// "968135": "{spell,24036,1::<u>Saoul</u>}",
			if (state) {
				let stateName = this.db.getI18n(state.nameId);
				if (stateName) {
					if (stateName.includes("{")) {
						stateName = stateName.replace("{", "").replace("}", "");
						let data = stateName.split(",");
						let subSpellId = data[1];
						let stateSpell = this.db.jsonSpells[subSpellId];
						stateName = stateName.split("::")[1] + "<spell spellid.bind='" + subSpellId + "' issummon.bind='" + this.issummon + "'></spell>";
					}
				}
				text = text.replace("#3", stateName);
			} else {
				console.log("null state: " + JSON.stringify(state))
			}
		}
		if (e.effectId == 1181) {
			text = text.replace("#3", e.value);
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

	public hasSubSpell(e: any) {
		return e.effectId == 2794;
	}
	public getSubSpell(e: any) {
		return this.db.jsonSpells[e.diceNum];
	}

	public hasSummon(e: any) {
		return this.db.isSummonEffect(e) && e.visibleInTooltip;
	}
	public getSummon(e: any): any {
		if (!this.hasSummon(e)) return null;
		return this.db.jsonSummons[e.diceNum];
	}

	public hasTrapGlyph(e: any) {
		return this.db.isCellEffect(e);
	}
	public getTrapGlyph(e: any): any {
		if (!this.hasTrapGlyph(e)) return null;
		return this.db.jsonSpells[e.diceNum];
	}




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
	public getTargets(e) {
		if (e.targetMask.includes("U")) return ["U"];
		if (e.targetMask.includes("A") && (e.targetMask.includes("g") || e.targetMask.includes("a"))) return ["all"]
		let m = e.targetMask.split(",");
		// if (e.spellId == 14622) {
		// 	console.log("masks : " + m)
		// }
		m = m.filter(m => m == "a" || m == "A" || m == "g" || m == "c" || m == "C" || m == "U")
		// console.log("m:" + m)
		// if(m.includes("*293"))
		// 	console.log("prob " + m)
		return m;
	}
	public getTargetIcon(m) {
		let tex = "";
		// for(let t of e.targetMask.split(",")) {
		// if(m == "a,A")
		// 	tex = this.getFighterIcon("{fighter}")
		if (m == "A")
			tex += this.getFighterIcon("{enemy}");
		if (m == "g" || m == "a")
			tex += this.getFighterIcon("{ally}");
		if (m == "c")
			tex += this.getFighterIcon("{caster}");
		// }
		return tex;
	}


}
