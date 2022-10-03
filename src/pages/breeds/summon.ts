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
		// console.log("grades: " + JSON.stringify(this.summon.grades))
		return this.summon.grades[this.side - 1];
	}

}
