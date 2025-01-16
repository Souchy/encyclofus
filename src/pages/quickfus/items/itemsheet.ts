import { ConditionRenderer } from './../../../ts/conditions';
import { CriteriaGroup } from './../../../DofusDB/static/formulas/criterions';
// import { bindable, IEventAggregator, inject } from "aurelia";
import { db } from "../../../DofusDB/db";
import { Citerions, CriterionUtil, Criteria } from '../../../DofusDB/static/formulas/criterions';
import { I18N } from "@aurelia/i18n";
import { bindable, IEventAggregator, observable } from 'aurelia';
import { DofusEffect, DofusItem } from '../../../ts/dofusModels';


// @inject(db, Emerald, ConditionRenderer)
export class itemsheet {

    @bindable
    public item: DofusItem;
    @bindable
    public comparing: boolean = false;

    // public sortedEffects: any[];
    private conditionRenderer: ConditionRenderer;
    private db: db;

    public comparedEffects: DofusEffect[];
    @observable
    public finishedComparison: boolean = false;
    private promiseComparison: Promise<void>

    public constructor(db: db, conditionRenderer: ConditionRenderer, @I18N private readonly i18n: I18N, @IEventAggregator readonly ea: IEventAggregator) {
        // console.log("renderer: " + conditionRenderer)
        this.db = db;
        this.conditionRenderer = conditionRenderer;
    }

    binding() {
        setTimeout(() => this.promiseComparison = this.loadComparison(), 0);
    }
    async attached() {
        // console.log("on attached")
        if (this.comparing) {
            await this.promiseComparison
        }
        this.ea.publish("itemsheet:loaded");
    }

    public get itemIconUrl() {
        // return "https://static.ankama.com/dofus/www/game/items/52/" + this.item.iconId + ".w40h40.png";
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


    public async loadComparison() {
        this.comparedEffects = [];
        if (this.item.id in this.db.data2.jsonItemsById == false) {
            this.finishedComparison = true;
            this.comparedEffects = this.sortedEffects;
            return;
        }
        let oldItem = this.db.data2.jsonItemsById[this.item.id];
        if (!oldItem.possibleEffects[0]["effect"]) {
            for (let e of oldItem.possibleEffects) {
                e["effect"] ??= this.db.data2.jsonEffectsById[e.effectId];
            }
        }
        // console.log("Oldset: ")
        // console.log(oldSet);

        // for(let b = 0; b < this.data.effects.length; b++) {
        // this.comparedEffects[b] = [];
        this.comparedEffects = [];
        for (let newEffect of this.item.possibleEffects) {
            if (!newEffect) continue;
            let comparison = { ...newEffect };
            this.comparedEffects[comparison.effectId] = comparison;
            // this.comparedEffects[newEffect.effectId] = newEffect;
        }
        for (let oldEffect of oldItem.possibleEffects) {
            if (!oldEffect) continue;
            if (oldEffect.effectId in this.comparedEffects) {
                let comparison = this.comparedEffects[oldEffect.effectId];
                comparison.diceNum = comparison.diceNum - oldEffect.diceNum;
                comparison.diceSide = comparison.diceSide - oldEffect.diceSide;
            } else {
                let comparison = { ...oldEffect };
                this.comparedEffects[comparison.effectId] = comparison;
                comparison.diceNum = 0 - oldEffect.diceNum;
                comparison.diceSide = 0 - oldEffect.diceSide;
            }
        }

        // for(let e of this.comparedEffects) {
        //     if(!e)
        //         continue;
        //     if(e.diceNum != 0 || e.diceSide != 0)
        //         this.hasDifference = true;
        // }
        // }
        this.finishedComparison = true;
        // console.log("finished comparison: diff=" + this.hasDifference);
    }
    // @observable
    // public hasDifference: boolean = false;
    // public get hasDifference() {
    //     for(let e of this.comparedEffects) {
    //         if(!e)
    //             continue;
    //         if(e.diceNum != 0 || e.diceSide != 0)
    //             return true;
    //     }
    //     return false;
    // }

    public get shouldRender() {
        if (!this.item)
            return false;
        // console.log("SHOULD RENDER ? ");
        // if(this.comparing)
        //     return true;
        // if(this.comparing && !this.finishedComparison)
        //     return false;
        // if(this.comparing && !this.hasDifference)
        //     return false;
        return true;
    }

    public get renderClass() {
        if (this.shouldRender)
            return "";
        else
            return "hiddensheet";
    }
}
