import { DI, Registration, bindable } from "aurelia";
import { db } from "../DofusDB/db";
import { I18N } from "@aurelia/i18n";
import { Targets } from "../DofusDB/formulas";
import { tsThisType } from "@babel/types";
import { Util } from "./util";


export class SummonUtils {
    
    public constructor(private readonly db: db, @I18N private readonly i18n: I18N) {
    }

	// public get summonEffects() {
	// 	return this.spell.effects.filter(e => this.hasSummon(e));
	// }
	public hasSummon(e: any) {
		return db.isSummonEffect(e) && e.visibleInTooltip; // && this.db.data.jsonSummons[e.diceNum]; // e.effectId == 181 || e.effectId == 1011 || e.effectId == 1008;
	}
	public getSummonId(effect: any): any {
		if (!this.hasSummon(effect)) return undefined;
		return effect.diceNum;
	}
	public getSummon(e: any): any {
		if (!this.hasSummon(e)) return null;
		return this.db.data.jsonSummons[e.diceNum];
	}

}


const container = DI.createContainer();
container.register(
    Registration.singleton(SummonUtils, SummonUtils)
);
