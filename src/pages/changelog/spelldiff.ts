import { DescriptionUtils } from './../../ts/descriptionUtils';
import { filter } from './../quickfus/items/filter';
import { Changelog } from './changelog';
import { bindable } from "aurelia";
import { I18N } from "@aurelia/i18n";
import { db } from "../../DofusDB/db";
import { DI, IEventAggregator, Registration } from 'aurelia';
import _ from 'lodash';
import { Diffchecker } from './diffchecker';
import { SummonUtils } from '../../ts/summonUtils';
import { DofusEffect, DofusEffectModel, DofusSpell } from '../../ts/dofusModels';

export class spelldiff {
 
    @bindable
    public spellid;
    private descriptionUtils: DescriptionUtils;

	public constructor(
        private readonly summonUtils: SummonUtils,
        private readonly diffchecker: Diffchecker,
        private readonly db: db, 
        // private readonly descriptionUtils: DescriptionUtils,
        @I18N private readonly i18n: I18N, 
        @IEventAggregator readonly ea: IEventAggregator
    ) {
	}

    attached() {
        this.descriptionUtils = new DescriptionUtils(this.db, this.i18n);
        this.descriptionUtils.setDescToDiff(this.oldSpell, this.newSpell);
    }

    public get newSpell(): DofusSpell {
        return this.db.data.jsonSpells[this.spellid];
    }
    public get oldSpell(): DofusSpell {
        return this.db.data2.jsonSpells[this.spellid];
    }
    public get effects2(): DofusEffectModel[] {
        return this.db.data2.jsonEffects;
    }

    public get hasDiff(): boolean {

        return this.diffchecker.spellDiff(this.spellid) || this.descriptionUtils?.hasDiff;
    }

    public diffProp(prop) {
        let newprop = this.newSpell[prop]
        let oldprop = this.oldSpell[prop]
        if(newprop == oldprop) return "";
        return this.i18n.tr(prop) + ": " + this.i18n.tr(oldprop) + " → " + this.i18n.tr(newprop);
    }


    public isNew() {
        return this.oldSpell == undefined;
    }
    public isRemoved() {
        return this.newSpell == undefined;
    }

    public commonEffects() {
        let common = this.newSpell.effects.filter(e1 => {
            return this.oldSpell.effects.find(e2 => e1.effectId == e2.effectId);
        })
        return common;
    }
    public newEffects() {
        let news: any[] = this.newSpell.effects.filter(e1 => {
            return !this.oldSpell.effects.find(e2 => e1.effectId == e2.effectId);
        })
        // if(news.length > 0) {
        //     console.log("news: " + news)
        //     console.log({news})
        // }
        return news;
    }
    public removedEffects() {
        let olds = this.oldSpell.effects.filter(e2 => {
            return !this.newSpell.effects.find(e1 => e1.effectId == e2.effectId);
        })
        return olds;
    }

    public get shouldDisplayOldName() {
        if(!this.oldSpell) return false;
        return (this.oldSpell.nameId != this.newSpell.nameId && this.db.hasI18n(this.oldSpell.nameId.toString())) 
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
