import { Emerald } from './../../ts/emerald';
import { I18N } from "@aurelia/i18n";
import { db } from "../../DofusDB/db";
import versions from '../../DofusDB/versions.json'
import { DI, IEventAggregator, Registration } from 'aurelia';


export class Diffchecker {
    
    public spellProperties: string[] = [
        "apCost",
        "minRange", "range",
        "castTestLos", "rangeCanBeBoosted",

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
        "effectId"
    ]

	public constructor(
        private readonly db: db, 
        // private readonly emerald: Emerald, 
        @I18N private readonly i18n: I18N, 
        @IEventAggregator readonly ea: IEventAggregator
    ) {
	}

    public diffProperty(o1, o2, propKey) {
       return o1[propKey] != o2[propKey]
    }

    //#region Spell diff
    public spellDiff(spellid: number) {
        let newSpell = this.db.data.jsonSpells[spellid];
        let oldSpell = this.db.data2.jsonSpells[spellid];

        if(!newSpell) return true;
        if(!oldSpell) return true;
        for(let prop of this.spellProperties) {
            if(this.diffProperty(newSpell, oldSpell, prop)) return true;
        }

        let newEffects = newSpell.effects.filter(e1 => !oldSpell.effects.find(e2 => e1.effectUid == e2.effectUid));
        let oldEffects = oldSpell.effects.filter(e1 => !newSpell.effects.find(e2 => e1.effectUid == e2.effectUid));
        let commonEffects = oldSpell.effects.filter(e1 => newSpell.effects.find(e2 => e1.effectUid == e2.effectUid));

        if(newEffects.length > 0) return true;
        if(oldEffects.length > 0) return true;
        for(let eff of commonEffects) {
            if(this.effectDiff(spellid, eff.effectUid)) return true;
        }
        return false;
    }
    /*
    public ap(newSpell, oldSpell) {
        if (newSpell.apCost !== oldSpell.apCost)
            return this.i18n.tr("pa") + ": "  + oldSpell.apCost + " -> " + newSpell.apCost;
        return "";
    }
    public range(newSpell, oldSpell) {
        if (newSpell.minRange != oldSpell.minRange || newSpell.range != oldSpell.range)
            return this.i18n.tr("po") + ": " + oldSpell.minRange + " - " + oldSpell.range + " -> " + newSpell.minRange + " - " + newSpell.range
        return "";
    }
    public lineOfSight(newSpell, oldSpell) {
        if (newSpell.castTestLos != oldSpell.castTestLos)
            return this.i18n.tr("castTestLos") + ": " + this.i18n.tr(oldSpell.castTestLos) + " -> " + this.i18n.tr(newSpell.castTestLos);
        return "";
    }
    public modifiableRange(newSpell, oldSpell) {
        if (newSpell.rangeCanBeBoosted != oldSpell.rangeCanBeBoosted)
            return this.i18n.tr("rangeCanBeBoosted") + ": " + this.i18n.tr(oldSpell.rangeCanBeBoosted) + " -> " + this.i18n.tr(newSpell.rangeCanBeBoosted);
        return "";
    }
    */
    //#endregion

    //#region Effect diff
    public effectDiff(spellid: number, effectid: number) {
        let newEffect = this.db.data.jsonSpells[spellid].effects.find(e => e.effectUid == effectid);
        let oldEffect = this.db.data2.jsonSpells[spellid].effects.find(e => e.effectUid == effectid);
        for(let prop of this.effectProperties) {
            if(this.diffProperty(newEffect, oldEffect, prop)) return true;
        }   
        return false;
        // return this.rawZone != "" || this.targetMask != "" || this.values != "" || this.delay != "" || this.duration != "";
        // let arr = [
        //     this.dispellable(newEffect, oldEffect),
        //     this.rawZone(newEffect, oldEffect),
        //     this.targetMask(newEffect, oldEffect),
        //     this.delay(newEffect, oldEffect),
        //     this.duration(newEffect, oldEffect),
        //     this.values(newEffect, oldEffect),
        // ];
        // return arr.filter(s => s != "");
    }
    public dispellable(newEffect, oldEffect) {
        if(newEffect.dispellable != oldEffect.dispellable) {
            return "dispellable: " + oldEffect.dispellable + " -> " + newEffect.dispellable;
        }
        return "";
    }
    public rawZone(newEffect, oldEffect) {
        if(newEffect.rawZone != oldEffect.rawZone) {
            return "rawZone: " + oldEffect.rawZone + " -> " + newEffect.rawZone;
        }
        return "";
    }
    public targetMask(newEffect, oldEffect) {
        if(newEffect.targetMask != oldEffect.targetMask) {
            return "targetMask: " + oldEffect.targetMask + " -> " + newEffect.targetMask;
        }
        return "";
    }
    public delay(newEffect, oldEffect) {
        if(newEffect.delay != oldEffect.delay) {
            return "delay: " + oldEffect.delay + " -> " + newEffect.delay;
        }
        return "";
    }
    public duration(newEffect, oldEffect) {
        if(newEffect.duration != oldEffect.duration) {
            return "duration: " + oldEffect.duration + " -> " + newEffect.duration;
        }
        return "";
    }
    public values(newEffect, oldEffect) {
        if(newEffect.diceNum != oldEffect.diceNum || newEffect.diceSide != oldEffect.diceSide) {
            return "values: " + oldEffect.diceNum + " - " + oldEffect.diceSide + " -> " + newEffect.diceNum + " - " + newEffect.diceSide
        }   
        return "";
    }
    //#endregion
    
}

const container = DI.createContainer();
container.register(
	Registration.singleton(Diffchecker, Diffchecker)
);
