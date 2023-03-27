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

	public get grade() {
		let g = Math.max(0, this.side - 1);
		// console.log("grades: " + g + ", " + JSON.stringify(this.summon.grades))
		return this.summon.grades[g];
	}

	public get life() {
		return Math.floor(this.grade.lifePoints * 3 + this.grade.vitality + 1050 * (this.grade.bonusCharacteristics.lifePoints / 100))
	}

	public get bonusLife() {
		// seulement les tourelles steam scale avec la vita
		if(this.summon.race != 221) { 
			return 0;
		}
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

	public get startingSpellId() {
		let startingSpellId = this.grade.startingSpellId;
		let spelllevel: any = Object.values(this.db.data.jsonSpells).find((l: any) => l?.id == startingSpellId) //jsonLevels.find(l => l.id == startingSpellId)
		// let index = this.db.data.jsonSpells.
		if(spelllevel) {
			return spelllevel.spellId + "-" + spelllevel.grade;
		}
		return 0;
	}


}
