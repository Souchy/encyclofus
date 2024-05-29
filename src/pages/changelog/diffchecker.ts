import { DofusEffect } from './../../ts/dofusModels';
import { I18N } from "@aurelia/i18n";
import { db } from "../../DofusDB/db";
import versions from '../../DofusDB/versions.json'
import { DI, IEventAggregator, Registration } from 'aurelia';
import { SummonUtils } from "../../ts/summonUtils";


export class Diffchecker {
    
    public spellProperties: string[] = [
        "apCost",
        "minRange", 
        "range",
        "castTestLos", 
        "rangeCanBeBoosted",

        "criticalHitProbability",
        "maxCastPerTurn",
        "maxCastPerTarget",
        "minCastInterval",
        "initialCooldown",
        "globalCooldown",
        "castTestLos",
        "needFreeCell",
        "needTakenCell",
        "castInLine",
        "castInDiagonal",
        "maxStack"
    ]
    public effectProperties: string[] = [
        "dispellable",
        "rawZone",
        "targetMask",
        "delay",
        "duration",
        "diceNum",
        "diceSide",
        "effectId",
        "value"
    ]

	public constructor(
        private readonly db: db, 
        private readonly summonUtils: SummonUtils,
        // private readonly emerald: Emerald, 
        @I18N private readonly i18n: I18N, 
        @IEventAggregator readonly ea: IEventAggregator
    ) {
	}

    public diffProperty(o1, o2, propKey) {
       return o1[propKey] != o2[propKey]
    }

    //#region Summon diff
    public summonDiff(summonid: number): boolean {
        let newSummon = this.db.data.jsonSummons[summonid];
        let oldSummon = this.db.data2.jsonSummons[summonid];
        if(!newSummon) return true;
        if(!oldSummon) return true;
        
        let newSpells = newSummon.spells.filter(s1 => !oldSummon.spells.find(s2 => s1 == s2));
        let oldSpells = oldSummon.spells.filter(s1 => !newSummon.spells.find(s2 => s1 == s2));
        let commonSpells = oldSummon.spells.filter(s1 => newSummon.spells.find(s2 =>s1 == s2));
        
        if(newSpells.length > 0) return true;
        if(oldSpells.length > 0) return true;
        for(let spellid of commonSpells) {
            if(this.spellDiff(spellid)) {
                return true;
            }
        }
        return false;
    }
    //#endregion

    //#region Spell diff
    public spellDiff(spellid: number) {
        // console.log("check diff spell: " + spellid)
        let newSpell = this.db.data.jsonSpells[spellid];
        let oldSpell = this.db.data2.jsonSpells[spellid];

        if(!newSpell) return true;
        if(!oldSpell) return true;
        for(let prop of this.spellProperties) {
            if(this.diffProperty(newSpell, oldSpell, prop)) {
                // if(spellid == 14436) console.log("14436: prop diff: " + prop)
                return true;
            }
        }

        let newDesc = this.db.data.getI18n(newSpell.descriptionId, this.db.lang);
        let oldDesc = this.db.data2.getI18n(oldSpell.descriptionId, this.db.lang);
        if(newDesc != oldDesc)
            return true;

        let newEffects = newSpell.effects.filter(e1 => !oldSpell.effects.find(e2 => e1.effectUid == e2.effectUid));
        let oldEffects = oldSpell.effects.filter(e1 => !newSpell.effects.find(e2 => e1.effectUid == e2.effectUid));
        let commonEffects = oldSpell.effects.filter(e1 => newSpell.effects.find(e2 => e1.effectUid == e2.effectUid));


        if(newEffects.length > 0) return true;
        if(oldEffects.length > 0) return true;
        for(let eff of commonEffects) {
            if(this.effectDiff(spellid, eff.effectUid)) {
                return true;
            }
        }
        return false;
    }
    //#endregion

    //#region Effect diff
    public effectDiff(spellid: number, effectid: number) {
        let newEffect = this.db.data.jsonSpells[spellid].effects.find(e => e.effectUid == effectid);
        let oldEffect = this.db.data2.jsonSpells[spellid].effects.find(e => e.effectUid == effectid);
        // ajoute le model
        newEffect["effect"] ??= this.db.data.jsonEffectsById[newEffect.effectId] //this.db.data.jsonEffects.find(e => e.id == newEffect.effectId);
        oldEffect["effect"] ??= this.db.data.jsonEffectsById[oldEffect.effectId] //this.db.data2.jsonEffects.find(e => e.id == oldEffect.effectId);
        for(let prop of this.effectProperties) {
            if(this.diffProperty(newEffect, oldEffect, prop) && (/* this.isEffectVisible(oldEffect) ||  */this.isEffectVisible(newEffect))) {
                if(prop == "rawZone" && (newEffect[prop] == oldEffect[prop] + ",0,0" || oldEffect[prop] == newEffect[prop] + ",0,0"))
                    continue
                // if(spellid == 14436) console.log("14436: prop diff: " + prop + " on " + effectid)
                return true;
            }
        }
        if(this.summonUtils.hasSummon(newEffect)) {
            let summonId = this.summonUtils.getSummonId(newEffect);
            return this.summonDiff(summonId);
        }
        return false;
    }
    public getEffectModel(effect: DofusEffect) {
        // return this.db.data.jsonEffects.find(e => e.id == effect.effectId);
        return this.db.data.jsonEffectsById[effect.effectId];
    }
    public isElemental(effectModel) {
        return effectModel.elementId >= 0;
    }
    public isEffectVisible(e: DofusEffect) {
        let mode = this.db.effectMode;
        if(mode == "debug") return true;
        // 666 = ACTION_NOOP = "Pas d'effet supplémentaire"
        // let e = this.newEffect;
        let effectModel = e["effect"] ?? this.getEffectModel(e);
        let show = (this.isGreenList(e.effectUid) || e.visibleInTooltip || (effectModel?.showInTooltip && mode == "detailed")) // || e.visibleInBuffUi || e.visibleInFightLog) 
                && !this.isRedList(e.effectUid) && e.effectId != 666
        return show;
    }
    public isGreenList(e: number) {
        return this.db.jsonGreenListEffects.green.includes(e);
    }
    public isRedList(e: number) {
        return this.db.jsonGreenListEffects.red.includes(e);
    }
    //#endregion
 
    //#region Item diff
    public itemDiff(itemid: number) {
        if(!this.db.data.isLoaded) {
            return false;
        }
        if(!this.db.data2.isLoaded) {
            return false;
        }
        let newItem = this.db.data.jsonItemsById[itemid];
        let oldItem = this.db.data2.jsonItemsById[itemid];
        // let comparedEffects: DofusEffect[] = [];
        
        if(!oldItem)
            return true;
        if(!newItem)
            return true;
        if(newItem.possibleEffects.length != oldItem.possibleEffects.length)
            return true;

        // let commonEffects = newItem.possibleEffects.filter(e1 => oldItem.possibleEffects.find(e2 => e1.effectId == e2.effectId));
        // if (commonEffects.length != newItem.possibleEffects.length || commonEffects.length != oldItem.possibleEffects.length)
        //     return true;

        for(let e1 of newItem.possibleEffects) {
            let found = oldItem.possibleEffects.find(e2 => e1.effectId == e2.effectId);
            if(!found)
                return true;
            if(found.diceNum != e1.diceNum)
                return true;
            if(found.diceSide != e1.diceSide)
                return true;
        }
        return false;
        // comparedEffects = newItem.possibleEffects.map(e1 => {
        //     let found = oldItem.possibleEffects.find(e2 => e1.effectId == e2.effectId);
        //     return e1;
        // });

        // for(let eff of commonEffects) {
            
        // }

        // for (let newEffect of newItem.possibleEffects) {
        //     if (!newEffect) continue;
        //     let comparison = { ...newEffect };
        //     comparedEffects[comparison.effectId] = comparison;
        //     // this.comparedEffects[newEffect.effectId] = newEffect;
        // }
        // for (let oldEffect of oldItem.possibleEffects) {
        //     if (!oldEffect) continue;
        //     if (oldEffect.effectId in comparedEffects) {
        //         let comparison = comparedEffects[oldEffect.effectId];
        //         comparison.diceNum = comparison.diceNum - oldEffect.diceNum;
        //         comparison.diceSide = comparison.diceSide - oldEffect.diceSide;
        //     } else {
        //         let comparison = { ...oldEffect };
        //         comparedEffects[comparison.effectId] = comparison;
        //         comparison.diceNum = 0 - oldEffect.diceNum;
        //         comparison.diceSide = 0 - oldEffect.diceSide;
        //     }
        // }
        // return false;
    }
    //#endregion

}

const container = DI.createContainer();
container.register(
	Registration.singleton(Diffchecker, Diffchecker)
);
