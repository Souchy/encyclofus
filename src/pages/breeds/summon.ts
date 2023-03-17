import { bindable, inject } from "aurelia";
import { db } from '../../DofusDB/db';
import { I18N } from '@aurelia/i18n';

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
		// pour les pv arbres ou la lance immortelle p.ex., 
		// ça prend 100% mais seulement de la vita de base (1050)
		// if(this.grade.lifePoints == 0) {

		// seulement les tourelles steam scale avec la vita
		if(this.summon.race != 221) { 
			return 0;
		}
		return this.grade.bonusCharacteristics.lifePoints;
	}

}
