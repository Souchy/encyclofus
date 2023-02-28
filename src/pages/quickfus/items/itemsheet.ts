import { Emerald } from './../../../ts/emerald';
import { bindable, IEventAggregator, inject } from "aurelia";
import { db } from "../../../DofusDB/db";
import { Citerions, CriterionUtil, Criteria } from '../../../DofusDB/static/formulas/criterions';

@inject(db, Emerald)
export class itemsheet {

    @bindable
    public item;

    // public sortedEffects: any[];

    public constructor(readonly db: db, readonly emerald: Emerald, @IEventAggregator readonly ea: IEventAggregator) {

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
    }

    public getEffect(possibleEffect) {
        return this.emerald.effects.filter(e => e.id == possibleEffect.effectId)[0];
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
        return this.item.apCost || this.item.maxCastPerTurn;
    }

    public get hasConditions() {
        return this.item.criteria && this.item.criteria != "null";
    }
    public get conditionsString() {
        let str = "";

        let criterias = Citerions.parseGroup(this.item.criteria)
        for(let c of criterias) {
            
        }

        return str;
    }

}
