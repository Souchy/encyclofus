import { Emerald } from './../../ts/emerald';
import { I18N } from "@aurelia/i18n";
import { DI, Registration, bindable, inject } from "aurelia";
import { db } from "../../DofusDB/db";
import { SpellZone, Targets } from "../../DofusDB/formulas";	
import { TargetConditionRenderer } from "../../ts/targetConditions";
import { Util } from '../../ts/util';

export class EffectRenderer {

	public db: db;	
	public emerald: Emerald;
	public conditionRenderer: TargetConditionRenderer;

	public constructor(db: db, conditionRenderer: TargetConditionRenderer, emerald: Emerald, @I18N private readonly i18n: I18N) {
		// console.log("ctor: " + conditionRenderer)
		this.db = db;
		this.conditionRenderer = conditionRenderer;
		this.emerald = emerald;
	}
    
	public getEffectModel(e) {
		return this.db.data.jsonEffects.find(c => c.id == e.effectId);
	}
	public getCharacteristic(e) {
		let cid = this.getEffectModel(e).characteristic;
		return this.db.data.jsonCharacteristics.find(c => c.id == cid);
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
		e.effect ??= this.getEffectModel(e);
		let text = this.db.getI18n(e.effect?.descriptionId);
        
		if (!text) text = "#1";
		let has1 = text.includes("#1");
		let has2 = text.includes("#2");
		let has3 = text.includes("#3");
		// invocation
		if (this.hasSummon(e)) {
			let summon = this.getSummon(e);
			if (summon) {
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
				if (name && name.includes("{")) {
					let obj = name.substring(name.indexOf("{"), name.indexOf("}"))
					name = name.substring(0, name.indexOf("{"));
					// name = name.replace("{", "").replace("}", "");
					let data = obj.split(",");
					let subSpellId = data[1];
					let stateSpell = this.db.data.jsonSpells[subSpellId];
					obj = obj.split("::")[1];
					name += obj;
				}
				text = text.replace("#1", name);
			}
		}
		// augmente ou réduit le cooldown du sort 
		if (this.db.isEffectChargeCooldown(e)) {
			let subspell = this.getSubSpell(e);
			if (subspell) {
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
			let state = this.db.data.jsonStates[e.value]
			if (!state) { }
			// "968135": "{spell,24036,1::<u>Saoul</u>}",
			if (state) {
				let stateName = this.db.getI18n(state.nameId);
				if (stateName) {
					if (stateName.includes("{")) {
						stateName = stateName.replace("{", "").replace("}", "");
						let data = stateName.split(",");
						let subSpellId = data[1];
						let stateSpell = this.db.data.jsonSpells[subSpellId];
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

		text = this.renderEffectPart2(e, text);
		return text;
	}

	public renderEffectPart2(e, text: string): string {
		// min/max
		let min = e.diceNum;
		let max = e.diceSide;
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
		} else {
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

	public hasSummon(e: any) {
		return this.db.isSummonEffect(e) && e.visibleInTooltip;
	}
	public getSummon(e: any): any {
		if (!this.hasSummon(e)) return null;
		return this.db.data.jsonSummons[e.diceNum];
	}

	public hasSubSpell(e: any) {
		return this.db.isSubSpell(e) && e.diceNum != e.spellId;
	}
	public getSubSpell(e: any) {
		let grade = e.diceSide;
		let key = e.diceNum + "";
		if (grade) key += "-" + grade;
		return this.db.data.jsonSpells[key];
	}
	public hasTrapGlyph(e: any) {
		return this.db.isCellEffect(e) && e.diceNum != e.spellId;
	}
	public getTrapGlyph(e: any): any {
		if (!this.hasTrapGlyph(e)) return null;
		let grade = e.diceSide;
		let key = e.diceNum + "";
		if (grade) key += "-" + grade;
		return this.db.data.jsonSpells[key];
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