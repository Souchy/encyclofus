import { bindable, inject } from "aurelia";
import { db } from '../../DofusDB/db';
import { I18N } from '@aurelia/i18n';
import features from '../../DofusDB/features.json';
import summonOverridesJson from '../../DofusDB/static/summonOverrides.json';

@inject(db)
export class Summon {
	private db: db;

	@bindable
	public summon: any;
	@bindable
	public side;

	public constructor(db: db, @I18N private readonly i18n: I18N) {
		this.db = db;
	}

	public get gradeIndex() {
		return Math.max(0, this.side - 1);
	}
	public get grade() {
		// console.log("grades: " + g + ", " + JSON.stringify(this.summon.grades))
		return this.summon.grades[this.gradeIndex];
	}

	public get life() {
		return Math.floor(this.grade.lifePoints * 3 + this.grade.vitality + 1050 * (this.grade.bonusCharacteristics.lifePoints / 100))
	}

	public get bonusLife() {
		// return 0; // plus rien ne scale avec vita il me semble
		// // seulement les tourelles steam scale avec la vita
		// if(this.summon.race != 221) { 
		// 	return 0;
		// }
		return this.grade.bonusCharacteristics.lifePoints;
	}

	public get dodge() {
		let overrides = summonOverridesJson[this.summon.id.toString()];

		if(overrides?.agiToLockMultiplier) {
			let val = this.grade.agility / 10 * summonOverridesJson[this.summon.id.toString()].agiToLockMultiplier;
			return Math.round(val);
		} else {
			return this.grade.agility * 3 / 10;
		}
	}
	public get lock() {
		let overrides = summonOverridesJson[this.summon.id.toString()];

		if(overrides?.lock) {
			return overrides.lock;
		} else
		if(overrides?.agiToLockMultiplier) {
			let val = this.grade.agility / 10 * summonOverridesJson[this.summon.id.toString()].agiToLockMultiplier;
			return Math.round(val);
		} else {
			return this.grade.agility * 3 / 10;
		}
	}

	public get isBomb() {
		return this.summon.race == 95 && this.db.checkFeatureVersion(features.bombspells);
	}

	/**
	 * Passif
	 */
	public get startingSpellId() {
		let startingSpellId = this.grade.startingSpellId;
		// let index = this.db.data.jsonSpells.
		if(this.db.checkFeature("spelllevels")) {
			let spelllevel = this.db.data.jsonSpellLevels[startingSpellId];
			if(spelllevel) {
				return spelllevel.spellId;
			}
		} else {
			let spelllevel: any = Object.values(this.db.data.spells).find((l: any) => l?.id == startingSpellId) //jsonLevels.find(l => l.id == startingSpellId)
			if(spelllevel) {
				return spelllevel.spellId + "-" + spelllevel.grade;
			}
		}
		return 0;
	}


}
