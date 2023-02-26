import { I18N } from "@aurelia/i18n";
import { bindable } from "aurelia";
import { db } from "../../../DofusDB/db";
import { SpellZone, Targets } from "../../../DofusDB/formulas";
import { string } from "yargs";
import { ConditionRenderer } from "../../conditions";

export class Effect {

	@bindable
	public effect;
	@bindable
	public depth: number = 0;
	@bindable
	public iscrit: boolean;

	public db: db;
	public conditionRenderer: ConditionRenderer;

	public constructor(db: db, conditionRenderer: ConditionRenderer, @I18N private readonly i18n: I18N) {
		this.db = db;
		this.conditionRenderer = conditionRenderer;
	}

	public get spell() {
		return this.db.jsonSpells[this.effect.spellId];
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
		if(e.dispellable == db.IS_DISPELLABLE_ONLY_BY_DEATH) {
			return this.i18n.tr("?dispell");
		}
		if(e.dispellable == db.IS_NOT_DISPELLABLE) {
			return this.i18n.tr("!dispell");
		}
	}

	public getZone(e) {
		return SpellZone.parseZone(e.rawZone);
	}
	public getZoneString(e) {
		let zone = this.getZone(e);
		let name = this.i18n.tr("zone." + zone.zoneName);
		if (zone.zoneName == "point" || zone.zoneName == "everyone" || zone.zoneName == "line3") {
			return name;
		}
		let minHole = "";
		if(zone.zoneMinSize > 0) {
			minHole = this.i18n.tr("zone.minZone", { minSize: zone.zoneMinSize })
		}
		return this.i18n.tr("zone.zone", { shape: name, size: zone.zoneSize }) + minHole;
	}

	public hasSummon(e: any) {
		return this.db.isSummonEffect(e) && e.visibleInTooltip;
	}
	public getSummon(e: any): any {
		if (!this.hasSummon(e)) return null;
		return this.db.jsonSummons[e.diceNum];
	}

	public hasSubSpell(e: any) {
		return this.db.isSubSpell(e) && e.diceNum != e.spellId;
	}
	public getSubSpell(e: any) {
		let grade = e.diceSide;
		let key = e.diceNum + "";
		if (grade) key += "-" + grade;
		return this.db.jsonSpells[key];
	}
	public hasTrapGlyph(e: any) {
		return this.db.isCellEffect(e) && e.diceNum != e.spellId;
	}
	public getTrapGlyph(e: any): any {
		if (!this.hasTrapGlyph(e)) return null;
		let grade = e.diceSide;
		let key = e.diceNum + "";
		if (grade) key += "-" + grade;
		return this.db.jsonSpells[key];
	}

	public getIcon(val: string) {
		if (val) {
			return this.db.getModIconStyle(this.renderEffectI18n(val));
		}
		return "";
	}

	public getFighterIcon(val: string) {
		if (val) {
			let style = this.db.getFighterIconStyle(val);
			return style;
		}
		return "";
	}

	public hasTargetIcon(e) {
		let str = this.conditionRenderer.getTeam(e);
		// console.log("hasTargetIcon: " + str);
		return str;
		/*
		let masks = Targets.mask(e.targetMask.split(","))
        // console.log("hasTargetIcon? : " + e.targetMask)
		// console.log("e: " + e.effectUid + ", targets: " + masks);
		// if(masks.includes("fighter") && masks.includes("ally")) {
		// 	console.log("!!ally fighter!!")
		// }
		return masks.length > 0 && (!masks.includes("fighter") || masks.length > 1)
		*/
	}
	public getTargetIcon(e) {
		let str = this.conditionRenderer.getTeam(e);
		if(str)
			return this.db.getFighterIconStyle(str);
		return "";
		/*
		let masks = Targets.mask(e.targetMask.split(","))
		console.log(`getTargetIcon masks: ${masks}`);
		let types = ["caster", "enemy", "ally", "fighter"]
		for (let t of types) {
			if (masks.includes(t))
				return this.db.getFighterIconStyle(t);
		}
		if (masks.includes("summonCaster"))
			return this.db.getFighterIconStyle("ally");
		if (masks.includes("allyExceptCaster"))
			return this.db.getFighterIconStyle("ally");
		if (masks.includes("allExceptCaster"))
			return this.db.getFighterIconStyle("fighter");
		return "";
		*/
	}

	public getTargetString(e) {
		// return this.conditionRenderer.renderTargetMask(e.targetMask);
		return this.conditionRenderer.render(e);
	}
	public hasCondition(e) : boolean {
		return Targets.hasCondition(e.targetMask);
	}

	/*
	public getConditionString(e): string {
		let masks = Targets.mask(e.targetMask.split(","))
		let strs: string[] = [];

		let positiveStr = this.i18n.tr("target.affectsEntities");
		let negativeStr = this.i18n.tr("target.affectsEntitiesNot");

		for(let m of masks) {
			if (!m.includes("*")) 
				positiveStr += " " + (this.i18n.tr("target." + m));
		}

		let positive: string[] = [];
		let negative: string[] = [];

		for (let m of masks) {
			if (!m.includes("*")) {
				// console.log("ignore condition: " + m);
				continue;
			}
			let not = m.includes("!");
			// let cond = m.includes("*");
			m = m.replace("!", "");
			m = m.replace("*", "");
			if (m.includes("creature")) {
				let summonId = +m.substring("creature".length);
				let summon = this.db.jsonSummons[summonId];
				if (!summon) {
					console.log("summon doesnt exist: " + summonId)
					continue;
				}
				// summons like steamer's
				let summonName = this.db.getI18n(summon.nameId);
				let fullstr = this.i18n.tr("target.themonster") + " " + summonName;
				if (not)
					negative.push(fullstr);
				else
					positive.push(fullstr);
				if (not)
					summonName = this.i18n.tr("target.not") + " " + summonName;
				strs.push(summonName);
				continue;
			} else
			if (m.includes("state")) {
				let stateId = +m.substring("state".length);
				let state = this.db.jsonStates[stateId];
				if (!state) {
					console.log("state doesnt exist: " + stateId)
					continue;
				}
				let stateName = this.db.getI18n(state.nameId);
				if (stateName.includes("{")) {
					stateName = stateName.substring(stateName.indexOf("<u>") + 3);
					stateName = stateName.substring(0, stateName.indexOf("</u>"));
				}
				// states like saoul
				let fullstr = this.i18n.tr("target.thestate") + " " + stateName;
				if (not)
					negative.push(fullstr);
				else
					positive.push(fullstr);
				// if (cond)
				// 	stateName = this.i18n.tr("target.caster") + "-" + stateName;
				if (not)
					stateName = this.i18n.tr("target.not") + " " + stateName;
				strs.push(stateName);
				continue;
			} else {
				let str = this.i18n.tr("target." + m);
				if (str == "target." + m)
					continue;
				// if (cond) str = this.i18n.tr("target.caster") + "-" + str;
				if (not)
					str = this.i18n.tr("target.not") + " " + str; // his.i18n.tr(!not + "") + "-" + str
				strs.push(str);
			}
		}
		let output = strs.join(" et ");
		// output = positiveStr + " et " + positive.join(" et ").toLowerCase();
		// output += "\n";
		// output += negativeStr + " " + negative.join(" et ").toLowerCase();
		return output;
	}
	*/

	public renderItemEffectI18n(e) {
		let effect = this.db.jsonEffects.filter(ei => ei.id == e.effectId)[0];
		let charac = this.db.jsonCharacteristics.filter(c => c.id == effect.characteristic)[0];
		let text = this.db.getI18n(effect.descriptionId);
		return e.diceNum + " " +  this.db.getI18n(charac.nameId);
		// return "";
	}

	public renderEffectI18n(e) {
		if(e.baseEffectId) {
			let effect = this.db.jsonEffects.filter(ei => ei.id == e.effectId)[0];
			e.effect = effect;
			// return this.renderItemEffectI18n(e);
		}
		let text = this.db.getI18n(e.effect?.descriptionId);
		if(!text) text = "#1";
		let has1 = text.includes("#1");
		let has2 = text.includes("#2");
		let has3 = text.includes("#3");
		// invocation
		if (this.hasSummon(e)) {
			let summon = this.getSummon(e);
			if(summon) {
				// console.log("monster: " + JSON.stringify(summon));
				let name = this.db.getI18n(summon.nameId);
				text = text.replace("#1", name);
			}

		}
		// state condition, fouet osa dragocharge, +1 combo,
		if (this.db.isSubSpell(e)) {
			// let subspellid = e.diceNum;
			// let subspell = this.db.jsonSpells[subspellid];
			let subspell = this.getSubSpell(e);
			if (!subspell) {
				console.log("error at uid " + e.effectUid)
			} else {
				let name = this.db.getI18n(subspell.nameId);
				if (name.includes("{")) {
					let obj = name.substring(name.indexOf("{"), name.indexOf("}"))
					name = name.substring(0, name.indexOf("{"));
					// name = name.replace("{", "").replace("}", "");
					let data = obj.split(",");
					let subSpellId = data[1];
					let stateSpell = this.db.jsonSpells[subSpellId];
					obj = obj.split("::")[1]; 
					name += obj;
				}
				text = text.replace("#1", name);
			}
		}
		// augmente ou réduit le cooldown du sort 
		if (this.db.isEffectChargeCooldown(e)) {
			let subspell = this.getSubSpell(e);
			if(subspell) {
				let name = this.db.getI18n(subspell.nameId);
				text = text.replace("#1", name); // this.name
				text = text.replace("#3", e.value);
			}
		}
		// effet de charge
		if (this.db.isEffectCharge(e)) { // if (has1 && has3 && !has2) { //
			// let subspellid = e.diceNum;
			// let subspell = this.db.jsonSpells[subspellid];
			let subspell = this.getSubSpell(e);
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
						stateName = stateName.split("::")[1];
					}
				}
				text = text.replace("#3", stateName);
			} else {
				console.log("null state: " + JSON.stringify(state))
			}
		}
		// pose un portail avec value = % do
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
		let output = subspellid + "-" + subgrade;
		return output;
	}


}
