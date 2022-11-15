import { I18N } from "@aurelia/i18n";
import { bindable } from "aurelia";
import { db } from "../../../DofusDB/db";

export class Effectlist {

    @bindable
    public effects: [];
    @bindable
    public depth: number = 0;
    @bindable
    public iscrit:boolean;

    public db: db;
    public advanced: boolean = false;

    public constructor(db: db, @I18N private readonly i18n: I18N) {
        this.db = db;
    }

    public get paddingLeft() {
        let paddingLeft = this.depth * 15 + 4;
        return paddingLeft;
    }

    public get tdStyle() {
        let style = "padding: 0px;";
        if (this.depth > 0)
            return style + "padding-left: " + this.paddingLeft + "px;"
        else 
            return style;
    }

    public get tableStyle() {
        if (this.depth > 0)
            return "width: 100%; margin-bottom: 0px;";
        else 
            return "";
    }

    public isGreenList(e) {
        return this.db.jsonGreenListEffects.green.includes(e);
    }
    public isRedList(e) {
        // console.log("redlist: " + JSON.stringify(this.db.jsonGreenListEffects))
        return this.db.jsonGreenListEffects.red.includes(e);
    }

    public isEffectVisible(e) {
        // 666 = ACTION_NOOP = "Pas d'effet supplémentaire"
        return (this.isGreenList(e.effectUid) || e.visibleInTooltip || e.effect?.showInTooltip || this.advanced) // || e.visibleInBuffUi || e.visibleInFightLog) 
            && !this.isRedList(e.effectUid) && e.effectId != 666
    }

}
