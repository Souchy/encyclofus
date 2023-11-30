import { ConditionRenderer } from './../../../ts/conditions';
import { CriteriaGroup } from './../../../DofusDB/static/formulas/criterions';
// import { bindable, IEventAggregator, inject } from "aurelia";
import { db } from "../../../DofusDB/db";
import { Citerions, CriterionUtil, Criteria } from '../../../DofusDB/static/formulas/criterions';
import { I18N } from "@aurelia/i18n";
import { bindable, IEventAggregator } from 'aurelia';
import { DofusItem } from '../../../ts/dofusModels';


// @inject(db, Emerald, ConditionRenderer)
export class itemsheet {

    @bindable
    public item: DofusItem;

    // public sortedEffects: any[];
    private conditionRenderer: ConditionRenderer;
    private db: db;

    public constructor(db: db, conditionRenderer: ConditionRenderer, @I18N private readonly i18n: I18N, @IEventAggregator readonly ea: IEventAggregator) {
        // console.log("renderer: " + conditionRenderer)
        this.db = db;
        this.conditionRenderer = conditionRenderer;
    }

    attached() {
        // console.log("on attached")
        this.ea.publish("itemsheet:loaded");
    }

    public get itemIconUrl() {
        return this.db.gitFolderPath + "sprites/items/" + this.item.iconId + ".png";
    }

    public get sortedEffects(): any[] {
        return this.item.possibleEffects.filter(e => {
            let eff = this.getEffect(e);
            return !eff.useInFight;
        })
        /*
        let effects: any[] = this.item.possibleEffects;

        effects.sort((a, b) => {
            let e0 = this.emerald.effects.filter(e => e.id == a.effectId)[0];
            let e1 = this.emerald.effects.filter(e => e.id == b.effectId)[0];
            if(e0.boost && !e1.boost) return 1;
            if(e1.boost && !e0.boost) return -1;

            // if(e0.characteristic == 1) return -1;
            // if(e1.characteristic == 1) return 1;
            // if(e0.characteristic == 23) return -1;
            // if(e1.characteristic == 23) return 1;
            // if(e0.characteristic == 11) return -1;
            // if(e1.characteristic == 11) return 1;

            return 0;
        });

        return effects;
        */
    }

    public getEffect(possibleEffect) {
        possibleEffect.effect ??= this.db.data.jsonEffectsById[possibleEffect.effectId]; 
        //this.db.data.jsonEffects.filter(e => e.id == possibleEffect.effectId)[0];
        return possibleEffect.effect;
    }

    public get weaponEffects(): any[] {
        let list = this.item.possibleEffects.filter(e => {
            let eff = this.getEffect(e);
            return eff.useInFight;
        })
        return list;
    }

    // public isBuff(eff) {
    //     let e0 = this.emerald.effects.filter(e => e.id == eff.effectId)[0];
    //     return e0.is
    // }

    public get isWeapon(): boolean {
        // let effects: any[] = this.item.possibleEffects;
        // return effects.filter(e => e.boost == false).length > 0;
        return !!this.item.apCost || !!this.item.maxCastPerTurn;
    }

    public get hasConditions() {
        return this.item.criteria && this.item.criteria != "null";
    }
    public getConditionsString() {
        let str = "";

        // commented out bc this crashes with musamune (id 23590)
        // console.log("conds: " + this.item.criteria);
        let root: CriteriaGroup = Citerions.parse(this.item.criteria);
        str = JSON.stringify(root)
        // console.log({root})
        // console.log("conditionRenderer: " + this.conditionRenderer)

        return this.conditionRenderer.render(root);
        return str;
    }

}
