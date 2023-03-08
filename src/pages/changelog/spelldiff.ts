import { filter } from './../quickfus/items/filter';
import { Changelog } from './changelog';
import { bindable } from "aurelia";
import { Emerald } from './../../ts/emerald';
import { I18N } from "@aurelia/i18n";
import { db } from "../../DofusDB/db";
import { DI, IEventAggregator, Registration } from 'aurelia';
import _ from 'lodash';
import { Diffchecker } from './diffchecker';

export class spelldiff {
 
    @bindable
    public spellid;
    @bindable 
    public breedid;


    public spellDiff;
    
	public constructor(
        private readonly diffchecker: Diffchecker,
        private readonly db: db, 
        @I18N private readonly i18n: I18N, 
        @IEventAggregator readonly ea: IEventAggregator
    ) {
	}

    public get newSpell(): any {
        return this.db.data.jsonSpells[this.spellid];
    }
    public get oldSpell(): any {
        return this.db.data2.jsonSpells[this.spellid];
    }
    public get effects2(): any[] {
        return this.db.data2.jsonEffects;
    }

    public thing() {
        let diff = this.newSpell.effects.filter((e1) => {
            let e2 = this.effects2.find(e2 => e1.id == e2.id);
            return !_.isEqual(e1, e2)
        });
        return diff;
    }

    public get hasDiff(): boolean {
        // return true; // FIXME : need a util classe to calculate effect differences and spell differences
        return this.diffchecker.spellDiff(this.spellid)
        return this.spellDiff && this.spellDiff != "undefined"
    }


    attached() {
        this.generateDiffSpell();
        // console.log(this.spellDiff)
    }

    public diffProp(prop) {
        let newprop = this.newSpell[prop]
        let oldprop = this.oldSpell[prop]
        if(newprop == oldprop) return "";
        return this.i18n.tr(prop) + ": " + this.i18n.tr(oldprop) + " -> " + this.i18n.tr(newprop);
    }

    private generateDiffSpell() { //s1, s2) {
        this.spellDiff = null;
        let arr = [];
        let breakk = false;
        if(this.newSpell == undefined) {
            arr.push("removed spell")
            breakk = true;
        }
        if(this.oldSpell == undefined) {
            arr.push("new spell")
            breakk = true;
        }
        if(!breakk) {
            arr.push(this.ap())
            arr.push(this.range())
            arr.push(this.lineOfSight())
        }
        if (arr.length > 0)
            this.spellDiff = arr.filter(s => s != "").join(",");
    }

    public isNew() {
        return this.oldSpell == undefined;
    }
    public isRemoved() {
        return this.newSpell == undefined;
    }
    public ap() {
        if (this.newSpell.apCost !== this.oldSpell.apCost)
            return this.i18n.tr("pa") + ": "  + this.oldSpell.apCost + " -> " + this.newSpell.apCost;
        return "";
    }
    public range() {
        if (this.newSpell.minRange != this.oldSpell.minRange || this.newSpell.range != this.oldSpell.range)
            return this.i18n.tr("po") + ": " + this.oldSpell.minRange + " - " + this.oldSpell.range + " -> " + this.newSpell.minRange + " - " + this.newSpell.range
        return "";
    }
    public lineOfSight() {
        if (this.newSpell.castTestLos != this.oldSpell.castTestLos)
            return this.i18n.tr("castTestLos") + ": " + this.i18n.tr(this.oldSpell.castTestLos) + " -> " + this.i18n.tr(this.newSpell.castTestLos);
        return "";
    }
    public modifiableRange() {
        if (this.newSpell.rangeCanBeBoosted != this.oldSpell.rangeCanBeBoosted)
            return this.i18n.tr("rangeCanBeBoosted") + ": " + this.i18n.tr(this.oldSpell.rangeCanBeBoosted) + " -> " + this.i18n.tr(this.newSpell.rangeCanBeBoosted);
        return "";
    }

    public commonEffects() {
        let common = this.newSpell.effects.filter(e1 => {
            return this.oldSpell.effects.find(e2 => e1.id == e2.id);
        })
        return common;
    }
    public newEffects() {
        let news: any[] = this.newSpell.effects.filter(e1 => {
            return !this.oldSpell.effects.find(e2 => e1.id == e2.id);
        })
        if(news.length > 0) {
            console.log("news: " + news)
            console.log({news})
        }
        return news;
    }
    public removedEffects() {
        let olds = this.oldSpell.effects.filter(e2 => {
            return !this.newSpell.effects.find(e1 => e1.id == e2.id);
        })
        return olds;
    }

    /*
    "12937": {
        "id": 43797,
        "spellId": 12937,
        "grade": 2,
        "spellBreed": 589,
        "apCost": 4,
        "minRange": 0,
        "range": 2,
        "castInLine": false,
        "castInDiagonal": false,
        "castTestLos": true,
        "criticalHitProbability": 25,
        "needFreeCell": false,
        "needTakenCell": false,
        "needVisibleEntity": false,
        "needCellWithoutPortal": false,
        "portalProjectionForbidden": false,
        "needFreeTrapCell": false,
        "rangeCanBeBoosted": false,
        "maxStack": 2,
        "maxCastPerTurn": 2,
        "maxCastPerTarget": 0,
        "minCastInterval": 0,
        "initialCooldown": 0,
        "globalCooldown": 0,
        "minPlayerLevel": 197,
        "hideEffects": false,
        "hidden": false,
        "playAnimation": true,
        "statesCriterion": "null",
        "effects": [
    */

    /*
    {
        "targetMask": "a,U",
        "diceNum": 19724,
        "visibleInBuffUi": true,
        "baseEffectId": 0,
        "visibleInFightLog": true,
        "targetId": 0,
        "effectElement": -1,
        "effectUid": 221129,
        "dispellable": 1,
        "triggers": "I",
        "spellId": 12936,
        "duration": 0,
        "random": 0,
        "effectId": 1160,
        "delay": 0,
        "diceSide": 1,
        "visibleOnTerrain": true,
        "visibleInTooltip": false,
        "rawZone": "P1",
        "forClientOnly": false,
        "value": 0,
        "order": 1,
        "group": 0
    },
    */

}
