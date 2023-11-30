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

	public showsub: boolean = false;
	public subSpell: any;

	public db: db;	
	public conditionRenderer: TargetConditionRenderer;
	public effectRenderer: EffectRenderer
	private readonly themer: Themer;
	public renderedEffect: string;

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
	}

	public clickShowSub() {
		this.showsub = !this.showsub;
	}

	public get themeBool() {
		return this.themer.themeBool;
	}

	// @watch('themeBool')
	public get EffectRenderClass() {
		if(this.effectRenderer.hasSubSpell(this.effect, this.spellGrade) && !this.isStateSubspell(this.effect)) {
			if(this.themer.themeBool) return "foldableSubspellLight";
			else return "foldableSubspellDark";
		} else {
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

	public hasSub(e) {
		return this.effectRenderer.hasSubSpell(e, this.spellGrade) || this.effectRenderer.hasTrapGlyph(e, this.spellGrade);
	}

}
