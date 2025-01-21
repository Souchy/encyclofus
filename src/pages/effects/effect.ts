import { watch } from '@aurelia/runtime-html';
import { EffectRenderer } from './effectRenderer';
import { I18N } from "@aurelia/i18n";
import { bindable, inject } from "aurelia";
import { db } from "../../DofusDB/db";
import { SpellZone, Targets } from "../../DofusDB/formulas";	
import { TargetConditionRenderer } from "../../ts/targetConditions";
import { Util } from '../../ts/util';
import { Themer } from '../../components/themes/themer';
import { DofusEffect, DofusEffectModel } from '../../ts/dofusModels';

// @inject(db, Emerald, ConditionRenderer)
export class Effect {

	public spellhover: HTMLDivElement;

	@bindable 
	public spellGrade = 0;
	@bindable
	public effect: DofusEffect;
	@bindable
	public depth: number = 0;
	@bindable
	public iscrit: boolean;
	@bindable
	public comparing: boolean = false;
	@bindable
	public sourcetype: string = "";

	public showsub: boolean = false;
	public subSpell: any;
	public subSpellLevel: any;

	public db: db;	
	public conditionRenderer: TargetConditionRenderer;
	public effectRenderer: EffectRenderer
	private readonly themer: Themer;
	public renderedEffect: string;

	// mason grid containing itemsheets, if we're in the item page and we have a subspell (legendary item)
	private grid: Element;

	public constructor(themer: Themer, db: db, effectRenderer: EffectRenderer, conditionRenderer: TargetConditionRenderer, @I18N private readonly i18n: I18N) {
		// console.log("ctor: " + conditionRenderer)
		this.db = db;
		this.conditionRenderer = conditionRenderer;
		this.effectRenderer = effectRenderer;
		this.themer = themer;
	}

	public get isLoaded() {
		return this.db.isLoaded
	}
	binding() {
		this.renderedEffect = this.effectRenderer.renderEffectI18n(this.effect);
	}
	attached() {
		this.subSpell = this.effectRenderer.getSubSpell(this.effect);
		if(this.subSpell) {
			if(this.db.checkFeature("spelllevels")) {
				let subSpellLevelId = this.subSpell.spellLevels[this.subSpellGrade];
				this.subSpellLevel = this.db.data.jsonSpellLevels[subSpellLevelId];
				// console.log("effect subspell, grade " + this.subSpellGrade);
				// console.log(this.subSpell);
				// console.log(this.subSpellLevel);
			} else {
				this.subSpellLevel = this.subSpell;
			}
		}
		if(this.spellhover) {
			this.grid = this.spellhover.closest(".grid");
		}
	}

	public get subSpellId() {
		return this.effect.diceNum;
	}
	public get subSpellGrade() {
		return Math.max(0, this.effect.diceSide - 1);
	}

	public clickShowSub() {
		this.showsub = !this.showsub;
	}

	public get themeBool() {
		return this.themer.themeBool;
	}

	// @watch('themeBool')
	public get EffectRenderClass() {
		let hasSubSpell = this.effectRenderer.hasSubSpell(this.effect, this.spellGrade);
		if(hasSubSpell && !this.isStateSubspell(this.effect)) {
			if(this.themer.themeBool) return "foldableSubspellLight";
			else return "foldableSubspellDark";
		} 
		else 
		if(hasSubSpell && this.sourcetype == "itemEffects") {
			return "hoverableSubspell";
		}
		else {
			return "";
		}
	}

	public isItem(effect) {
		// console.log("effect: " + effect.spellId)
		return effect.spellId === -1;
	}

	public get effectTypeStyle() {
		if (this.isItem(this.effect)) return "itemEffect"
		else return "spellEffect"
	}

	public getEffect(): DofusEffectModel {
		let effect = this.db.data.jsonEffectsById[this.effect.effectId]; //this.db.data.jsonEffects?.filter(e => e.id == this.effect.effectId)[0];
		return effect;
	}
	public getCharacteristic() {
		let cid = this.getEffect().characteristic;
		return this.db.data.jsonCharacteristicsById[cid];
		// let charac = this.db.data.jsonCharacteristics?.filter(c => c.id == cid)[0];
		// return charac;
	}


	// public getEffectMinMax() {
	// 	let min = this.effect.diceNum;
	// 	let max = this.effect.diceSide;
	// 	return "";
	// }
	// public getCharacteristicName() {
	// 	let c = this.getCharacteristic();
	// 	return this.db.getI18n(c.nameId);
	// }

	public get isFightEffect() {
		if(!this.isItem(this.effect)) {
			// console.log("not a item effect")
			return true;
		}
		let effect = this.getEffect();
		return effect.useInFight
	}

	private _icon: string;
	public get icon() {
		if (this._icon) 
			return this._icon;
		if (!this.isFightEffect) {
			// console.log("not a fight effect")
			return "";
		}
		if (this.effect) {
			// console.log("render for icon")
			this._icon = this.db.getModIconStyle(this.renderedEffect, this.isItem(this.effect));
		}
		return this._icon;
	}

	public get comparisonStyle() {
		if(!this.comparing)
			return "";
		if(this.effect.diceNum < 0)
			return "background: var(--comparisonRed);";
		if(this.effect.diceNum > 0)
			return "background: var(--comparisonGreen);";
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
			let subspell = this.effectRenderer.getSubSpell(e);
			if (!subspell) return false;
			if(this.sourcetype == "itemEffects") {
				// console.log("is sub itemEffects yes")
				return true;
			}
			// return true;
			let name = this.db.getI18n(subspell.nameId);
			if (name && name.includes("{")) {
				return true;
			}
		}
		return false;
	}



	public getStateSubspellId(e) {
		let spellString;
		// état
		if (db.isEffectState(e)) {
			let state = this.db.data.jsonStates[e.value]
			spellString = this.db.getI18n(state.nameId);
		}
		if (db.isSubSpell(e)) {
			let subspell = this.effectRenderer.getSubSpell(e);
			if(this.sourcetype == "itemEffects") {
				if(this.db.checkFeature("spelllevels"))
					return e.diceNum;
				let key = e.diceNum + "";
				let grade = e.diceSide;
				if (grade) key += "-" + grade;
				return key;
			}
			spellString = this.db.getI18n(subspell.nameId);
		}

		spellString = spellString.replace("{", "").replace("}", "");
		let data = spellString.split("::")[0].split(",");
		// let subSpellId = data[1];
		// return subSpellId;
		let subspellid = data[1]
		let subgrade = data[2];
		let output = subspellid + "-" + subgrade;
		if(this.db.checkFeature("spelllevels"))
			return subspellid;
		return output;
	}
	public getStateSubSpellGrade(e) {
		let spellString;
		// état
		if (db.isEffectState(e)) {
			let state = this.db.data.jsonStates[e.value]
			spellString = this.db.getI18n(state.nameId);
		}
		if (db.isSubSpell(e)) {
			let subspell = this.effectRenderer.getSubSpell(e);
			if(this.sourcetype == "itemEffects") {
				return e.diceSide;
			}
			spellString = this.db.getI18n(subspell.nameId);
		}
		spellString = spellString.replace("{", "").replace("}", "");
		let data = spellString.split("::")[0].split(",");
		// let subspellid = data[1]
		let subgrade = data[2];
		return subgrade;
	}

	public hasSub(e) {
		return this.effectRenderer.hasSubSpell(e, this.spellGrade) || this.effectRenderer.hasTrapGlyph(e, this.spellGrade);
	}

	public get showcrit() {
		return this.sourcetype != "itemEffects";
	}


	public translation: number = 0;
	public get hoverTranslation() {
		return "translate: " + this.translation + "px 0px";
	}
	public hoverSub() {
		// if(this.spellhover) {
		// 	let bb = this.spellhover.getBoundingClientRect();
		// 	console.log(JSON.stringify(bb));
		// }
		if(this.grid) {
			let bb = this.spellhover.getBoundingClientRect();
			let gridbb = this.grid.getBoundingClientRect();
			// console.log(bb);
			// console.log(JSON.stringify(gridbb));
			if (bb.left + bb.width > gridbb.width && gridbb.width > 260) {
				this.translation = gridbb.width - (bb.left + bb.width) + 50;
			} else {
				this.translation = 0;
			}
			// quand on enlève la sidebar
			if(gridbb.x < 250 && gridbb.width > 260) {
				this.translation -= (250 + 50);
			}
			// console.log("translation: " + this.translation);
		}
	}
	/*
	{"x":622.53125,"y":505.5,"width":238,"height":25,"top":505.5,"right":860.53125,"bottom":530.5,"left":622.53125}
	{"x":71.531250,"y":446.5,"width":800,"height":336,"top":446.5,"right":871.53125,"bottom":782.5,"left":71.53125}
	*/
	/*
	{"x":888.984375,"y":544.5,"width":238,"height":25,"top":544.5,"right":1126.984375,"bottom":569.5,"left":888.984375}
	{"x":337.984375,"y":485.5,"width":800,"height":336,"top":485.5,"right":1137.984375,"bottom":821.5,"left":337.984375}
	*/

}
