import { bindable, inject } from "aurelia";
import { db } from '../../DofusDB/db';
import { I18N } from '@aurelia/i18n';
import { Diffchecker } from "./diffchecker";

// @inject(db)
export class summondiff {

	@bindable
	public summonid: number;
	@bindable
	public side;

	public constructor(
        private readonly diffchecker: Diffchecker,
        private readonly db: db, 
        @I18N private readonly i18n: I18N) {
	}


    public isNew() {
        return this.oldSummon == undefined;
    }
    public isRemoved() {
        return this.newSummon == undefined;
    }

    public get newSummon() {
        // console.log("newSUmmon: " + JSON.stringify(this.db.data.jsonSummons[this.summonid]));
        return this.db.data.jsonSummons[this.summonid];
    }
    public get oldSummon() {
        return this.db.data2.jsonSummons[this.summonid];
    }

    public get newGrade() {
        let g = Math.max(0, this.side - 1);
        return this.newSummon?.grades[g];
    }
	public get oldGrade() {
        let g = Math.max(0, this.side - 1);
		return this.oldSummon?.grades[g];
    }

    public getCombinedSpells() {
        let spells = [];
        if(this.newSummon) {
            spells.push(...this.newSummon.spells);
        }
        if(this.oldSummon) {
            for(let s in this.oldSummon.spells)
                if(!spells.includes(s))
                    spells.push(s)
        }
        return spells;
    }

    public get hasDiff(): boolean {
        // console.log("summon hasdiff: " + this.summonid)
        return this.diffchecker.summonDiff(this.summonid);
    }

}
