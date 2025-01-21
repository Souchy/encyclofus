import { I18N } from "@aurelia/i18n";
import { DI, Registration, bindable, inject } from "aurelia";
import { db } from "../../DofusDB/db";
import { SpellZone, Targets } from "../../DofusDB/formulas";	
import { TargetConditionRenderer } from "../../ts/targetConditions";
import { Util } from '../../ts/util';
import { ActionIds } from "../../DofusDB/code/ActionIds";
import { DofusEffect } from "../../ts/dofusModels";

export class EffectRenderer {

	public db: db;	
	public conditionRenderer: TargetConditionRenderer;

	public constructor(db: db, conditionRenderer: TargetConditionRenderer, @I18N private readonly i18n: I18N) {
		// console.log("ctor: " + conditionRenderer)
		this.db = db;
		this.conditionRenderer = conditionRenderer;
	}
    
	public getEffectModel(effect: DofusEffect) {
		// return this.db.data.jsonEffects.find(c => c.id == e.effectId);
        return this.db.data.jsonEffectsById[effect.effectId];
	}
	public getCharacteristic(e) {
		let cid = this.getEffectModel(e).characteristic;
		// return this.db.data.jsonCharacteristics.find(c => c.id == cid);
		return this.db.data.jsonCharacteristicsById[cid];
	}

	public isDuration(e) {
		return this.db.hasDispellIcon(e);
	}
	public getDispellIcon(e) {
		return this.db.getDispellIcon(e);
	}
	public getDispellString(e) {
		if (e.dispellable == db.IS_DISPELLABLE) {
			return this.i18n.tr("dispell");
		}
		if (e.dispellable == db.IS_DISPELLABLE_ONLY_BY_DEATH) {
			return this.i18n.tr("?dispell");
		}
		if (e.dispellable == db.IS_NOT_DISPELLABLE) {
			return this.i18n.tr("!dispell");
		}
	}
	public getZone(e) {
		if(this.db.checkFeature("unity")) {
			return SpellZone.parseZoneUnity(e.zoneDescr);
		}
		return SpellZone.parseZone(e.rawZone);
	}
	public getZoneString(e) {
		let zone = this.getZone(e);
		let name = this.i18n.tr("zone." + zone.zoneName);
		if (zone.zoneName == "point" || zone.zoneName == "everyone" || zone.zoneName == "line3") {
			return name;
		}
		let minHole = "";
		if (zone.zoneMinSize > 0) {
			minHole = this.i18n.tr("zone.minZone", { minSize: zone.zoneMinSize })
		}
		return this.i18n.tr("zone.zone", { shape: name, size: zone.zoneSize }) + minHole;
	}

	public renderEffectI18n(e) {
		let effect = this.getEffectModel(e);
		if(!effect)
			return "";
		let text = this.db.getI18n(effect.descriptionId);
		// if(e.effectUid == 293889)
		// 	console.log("monster!! " + this.hasSummon(e));
        
		if (!text) text = "#1";
		let has1 = text.includes("#1");
		let has2 = text.includes("#2");
		let has3 = text.includes("#3");
		// remove glyph/trap
		if(e.effectId == ActionIds.ACTION_DISPEL_GLYPHS_OF_TARGET) {
			text = this.i18n.tr("effect.removeGlyphs");
		}
		if(e.effectId == ActionIds.ACTION_DISPEL_TRAPS_OF_TARGET) {
			text = this.i18n.tr("effect.removeTraps");
		}
		if(e.effectId == ActionIds.ACTION_DISPEL_RUNES_OF_TARGET) {
			text = this.i18n.tr("effect.removeRunes");
		}
		// invocation
		if (this.hasSummon(e)) {
			let summon = this.getSummon(e);
			// console.log("");
			if (summon) {
				let name = this.db.getI18n(summon.nameId);
				//if(e.effectUid == 293889)
				// console.log("monster: " + summon.id + ", " + summon.nameId + " = " + name + " for " + text);
				text = text.replace("#1", name);
			}

		} else
		// state condition, fouet osa dragocharge, +1 combo,
		if (db.isSubSpell(e)) {
			// let subspellid = e.diceNum;
			// let subspell = this.db.jsonSpells[subspellid];
			let subspell = this.getSubSpell(e);
			if (!subspell) {
				// console.log("renderEffect has non-existing subspell " + e.effectUid)
			} else {
				let name = this.db.getI18n(subspell.nameId);
				if (name && name.includes("{")) {
					let obj = name.substring(name.indexOf("{"), name.indexOf("}"))
					name = name.substring(0, name.indexOf("{"));
					// name = name.replace("{", "").replace("}", "");
					// let data = obj.split(",");
					// let subSpellId = data[1];
					// let stateSpell = this.db.data.jsonSpells[subSpellId];
					obj = obj.split("::")[1];
					name += obj;
				}
				text = text.replace("#1", name);
			}
		} else
		// augmente ou réduit le cooldown du sort 
		if (db.isEffectChargeCooldown(e)) {
			let subspell = this.getSubSpell(e);
			if (subspell) {
				let name = this.db.getI18n(subspell.nameId);
				text = text.replace("#1", name); // this.name
				text = text.replace("#3", e.value);
			}
		} else
		// effet de charge
		if (db.isEffectCharge(e)) { // if (has1 && has3 && !has2) { //
			// let subspellid = e.diceNum;
			// let subspell = this.db.jsonSpells[subspellid];
			let subspell = this.getSubSpell(e);
			if(subspell) {
				text = text.replace("#1", this.db.getI18n(subspell.nameId));
				text = text.replace("#3", e.value);
			}
		} else
		// état
		if (db.isEffectState(e)) {
			// if (e.value) {
			let state = this.db.data.jsonStates[e.value]
			// console.log("state: " + e.value + ", " + JSON.stringify(state));
			if (!state) { }
			// "968135": "{spell,24036,1::<u>Saoul</u>}",
			if (state) {
				let stateName = this.db.getI18n(state.nameId);
				// console.log("state: " + stateName);
				if (stateName) {
					if (stateName.includes("{")) {
						stateName = stateName.replace("{", "").replace("}", "");
						// let data = stateName.split(",");
						// let subSpellId = data[1];
						// let stateSpell = this.db.data.jsonSpells[subSpellId];
						stateName = stateName.split("::")[1];
						// console.log("reste: " + stateName);

						if(this.db.checkFeature("unity")) {
							// console.log("statename: " + stateName);
							// stateName = stateName.replace("<color", "<font");
							let i1 = stateName.indexOf(">");
							stateName = stateName.slice(0, i1) + "\"" + stateName.slice(i1);
							stateName = stateName.replace("color=", "font color=\"");
							// console.log(stateName);

							let i2 = stateName.lastIndexOf("<");
							// console.log("ii: " + i2);
							stateName = stateName.substring(0, i2) + "</font>";
							// console.log(stateName);
							// stateName = stateName.replace("color", "font");

						}
					}
				}
				text = text.replace("#3", stateName);
				// console.log("text: " + text);
			} else {
				console.log("null state: " + JSON.stringify(state))
			}
		} else
		if(db.isCellEffect(e)) {
			// glyphes, pièges..
		} else {
			if(this.db.checkFeature("unity")) {
				let min = e.diceNum;
				let max = e.diceSide;
				// console.log("effect unity: " + effect.useDice + ", " + min + " à " + max)
				if(effect.useDice || effect["isInPercent"]) {
					if(min && !text.includes("#1")) {
						let percent = effect["isInPercent"] ? "%" : "";
						let str = min + percent + " ";
						if(max != 0) {
							str += "à " + max + percent + " ";
						} 
						text = effect["characteristicOperator"] + str + text;
					}
				}
			}
	
		}
		// pose un portail avec value = % do
		if (e.effectId == 1181) {
			text = text.replace("#3", e.value);
		}
		// console.log("effect: " + text);

		text = this.renderEffectPart2(e, effect, text);
		if(e.triggers.includes("TB"))
			text += this.i18n.tr("triggers.TB") //" (au début du tour)";
		if(e.triggers.includes("TE"))
			text += this.i18n.tr("triggers.TE") //" (à la fin du tour)";

		if(this.db.checkFeature("unity"))
			text = text.replace("{", "").replace("}", "");
		return text;
	}

	public renderEffectPart2(e, effectModel, text: string): string {
		// min/max
		let min = e.diceNum;
		let max = e.diceSide;
		// if(this.db.checkFeature("unity")) {
		// 	if(min) {
		// 		let str = min + " ";
		// 		if(max != 0) {
		// 			str += "à " + max + " ";
		// 		} 
		// 		text = effectModel.characteristicOperator + str + text;
		// 	}
		// }

		text = text.replace("#1", min);
		if (max) {
			let values = text.split("#2")[0];
			let str = text.split("#2")[1];

			if(str) {
				str = str.trim();
				text = values + "#2";
				let color = Util.getStatColor(str);
				if(color) str = "<span style='"+color+"'>"+str+"</span>"
			}

			text = text.replace("{~1~2", "")
			text = text.replace("}", "")
			text = text.replace("#2", max);
			if(str) text += " " + str;
		} else 
		if(text.includes("#2")) {
			let values = text.split("#2")[0];
			let str = text.split("#2")[1];
			
			if(str) {
				str = str.trim();
				text = values + "#2";
				let color = Util.getStatColor(str);
				if(color) str = "<span style='"+color+"'>"+str+"</span>"
			}

			text = text.substring(0, text.indexOf("{")) + text.substring(text.indexOf("}") + 1)
			text = text.replace("#2", "");
			
			if(str) text += " " + str;
		}
		// console.log("textttt: " + text);
		// conjugaison
		if (min > 1 || max > 1) {
			text = text.replace("{~ps}{~zs}", "s");
			text = text.replace("{{~ps}}", "s");
		} else {
			text = text.replace("{~ps}{~zs}", "");
			text = text.replace("{{~ps}}", "");
		}
		text = text.replace("{{~zs}}", "");
		// délai
		if (e.delay > 0) {
			text += " " + this.i18n.tr("delay", { delay: e.delay })
		}
		// durée
		if (e.duration > 0) {
			text += " " + this.i18n.tr("duration", { duration: e.duration })
		}
		return text;
	}

	public hasSummon(e: any) {
		return db.isSummonEffect(e) //&& e.visibleInTooltip;
	}
	public getSummon(e: any): any {
		if (!this.hasSummon(e)) return null;
		return this.db.data.jsonSummons[e.diceNum];
	}

	public hasSubSpell(e: any, spellGrade) {
		return db.isSubSpell(e) && !(e.diceNum == e.spellId && e.diceSide == spellGrade);
	}
	public getSubSpell(e: any) {
		if(this.db.checkFeature("spelllevels")) {
			return this.db.data.jsonSpellsNew[e.diceNum];
		}
		let key = e.diceNum + "";
		let grade = e.diceSide;
		if (grade) key += "-" + grade;
		if(key == "0") return undefined;
		// if(e.effectUid == 303619) 
		// 	console.log("key: " + key)
		return this.db.data.spells[key];
	}
	public hasTrapGlyph(e: any, spellGrade) {
		return db.isCellEffect(e) && !(e.diceNum == e.spellId && e.diceSide == spellGrade);
	}
	public getTrapGlyph(e: any): any {
		if(this.db.checkFeature("spelllevels")) {
			let spell = this.db.data.jsonSpellsNew[e.diceNum];
			let grade = e.diceSide;
			let spellLevelId = spell.spellLevels[grade - 1];
			// console.log("effectRenderer.getTrapGlyph: " + spell.id + ", " + grade + " = " + spellLevelId);
			// console.log(spell);
			let spellLevel = this.db.data.jsonSpellLevels[spellLevelId];
			// console.log(spellLevel);
			return spellLevel;
		}
		// if (!this.hasTrapGlyph(e)) return null;
		let key = e.diceNum + "";
		let grade = e.diceSide;
		if (grade) key += "-" + grade;
		if(key == "0") return undefined;
		return this.db.data.spells[key];
	}

    
	public getFighterIcon(val: string) {
		if (val) {
			let style = this.db.getFighterIconStyle(val);
			return style;
		}
		return "";
	}
	public hasTargetIcon(e) {
		return this.conditionRenderer.getTeam(e);
	}
    public getTargetIcon(e) {
        let str = this.conditionRenderer.getTeam(e);
        if (!str) str = "fighter";
        return this.db.getFighterIconStyle(str);
    }
	public getTargetString(e) {
		return this.conditionRenderer.render(e);
	}
	public getTargetConditions(e) {
		return this.conditionRenderer.renderConditionsOnly(e);
	}
	public hasCondition(e) : boolean {
		return Targets.hasCondition(e.targetMask);
	}

}

const container = DI.createContainer();
container.register(
	Registration.singleton(EffectRenderer, EffectRenderer)
);
