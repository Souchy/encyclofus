import { I18N } from "@aurelia/i18n";
import { bindable } from "aurelia";
import { db } from "../../DofusDB/db";

export class Effectlist {

    @bindable
    public spellGrade = 0;
    @bindable
    public effects: any[];
    @bindable
    public depth: number = 0;
    @bindable
    public iscrit:boolean;

    public db: db;
    public debug: boolean = false;

    public constructor(db: db, @I18N private readonly i18n: I18N) {
        this.db = db;
        // console.log("different effect order: " + (this.effects != this.effectsOrdered))
    }
    public get effectsOrdered() {
        return this.effects.sort((a, b) => a.order - b.order);
    }

    public get paddingLeft() {
        if(this.depth == 0) return 0;
        let paddingLeft = this.depth * 15 + 4;
        return paddingLeft;
    }

    public isGreenList(e: number) {
        return this.db.jsonGreenListEffects.green.includes(e);
    }
    public isRedList(e: number) {
        return this.db.jsonGreenListEffects.red.includes(e);
    }

	public getEffect(effect) {
		return this.db.data.jsonEffects?.filter(e => e.id == effect.effectId)[0];
	}
    public isEffectVisible(e: any) {
        let mode = this.db.effectMode;
        if(mode == "debug") return true;
        // 666 = ACTION_NOOP = "Pas d'effet supplémentaire"

        let effectModel = e.effect ?? this.getEffect(e);
        let show = (this.isGreenList(e.effectUid) || e.visibleInTooltip || (effectModel.showInTooltip && mode == "detailed")) // || e.visibleInBuffUi || e.visibleInFightLog) 
                && !this.isRedList(e.effectUid) && e.effectId != 666

        // let show = (
        //         e.visibleInTooltip || 
        //         // (effectModel.category != -1 && effectModel.showInSet && effectModel.showInTooltip) || 
        //         (effectModel.showInTooltip && mode == "detailed")
        //     ) // || e.visibleInBuffUi || e.visibleInFightLog) 
        //     && e.effectId != 666
        return show;
        /*
        if(mode == "basic") {
            return (e.visibleInTooltip) && e.effectId != 666
        }
        if(mode == "detailed") {
            return (this.isGreenList(e.effectUid) || e.visibleInTooltip || e.effect?.showInTooltip) // || e.visibleInBuffUi || e.visibleInFightLog) 
                && !this.isRedList(e.effectUid) && e.effectId != 666
        }
        */
    }

}
