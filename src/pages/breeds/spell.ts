import { watch } from '@aurelia/runtime-html';
import { Citerions, CriteriaGroup } from './../../DofusDB/static/formulas/criterions';
import { bindable, DI, inject } from "aurelia";
import { db } from '../../DofusDB/db';
import { I18N } from '@aurelia/i18n';
import { SpellZone } from "../../DofusDB/formulas";
import { ConditionRenderer } from '../../ts/conditions';
import { DofusSpell } from '../../ts/dofusModels';

@inject(db)
export class Spell {
	
	@bindable
	public spellid: number;
	@bindable
	public depth: number = 0;
	@bindable
	public issummon: boolean = false;
	@bindable
	public ispassive:boolean = false;
	@bindable
	public showcrit: boolean = true;

	@bindable
	public selectedGrade: number = -1;

	private db: db;

	public constructor(db: db, @I18N private readonly i18n: I18N) {
		this.db = db;
		if(this.selectedGrade == -1) {
			this.selectedGrade = db.selectedGradeSlot;
		}
	}

	public get hasNewSpellFeature() {
		return this.db.checkFeature("spelllevels");
	}

}
