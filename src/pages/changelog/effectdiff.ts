import { filter } from './../quickfus/items/filter';
import { Changelog } from './changelog';
import { bindable } from "aurelia";
import { Emerald } from './../../ts/emerald';
import { I18N } from "@aurelia/i18n";
import { db } from "../../DofusDB/db";
import { DI, IEventAggregator, Registration } from 'aurelia';
import _ from 'lodash';
import { Util } from '../../ts/util';
import { EffectRenderer } from '../effects/effectRenderer';
import { Diffchecker } from './diffchecker';

export class effectdiff {
 
    @bindable
    public spellid;
    @bindable
    public effectid;
    
	public constructor(
        private readonly diffchecker: Diffchecker,
        private readonly effectRenderer: EffectRenderer,
        private readonly db: db, 
        // private readonly emerald: Emerald, 
        @I18N private readonly i18n: I18N, 
        @IEventAggregator readonly ea: IEventAggregator
    ) {
	}

    attached() {
        // console.log("effectdiff: " + this.spellid + ", " + this.effectid);
        // let render = this.effectRenderer.renderEffectI18n(this.newEffect);
        // console.log("render: " + render)
    }
    
    public isEffectVisible(e) {
        let mode = this.db.effectMode;
        if(mode == "debug") return true;
        // 666 = ACTION_NOOP = "Pas d'effet supplémentaire"
        // let e = this.newEffect;
        let effectModel = e.effect ?? this.effectModel;
        let show = (this.isGreenList(e.effectUid) || e.visibleInTooltip || (effectModel.showInTooltip && mode == "detailed")) // || e.visibleInBuffUi || e.visibleInFightLog) 
                && !this.isRedList(e.effectUid) && e.effectId != 666
        return show;
    }
    public isGreenList(e: number) {
        return this.db.jsonGreenListEffects.green.includes(e);
    }
    public isRedList(e: number) {
        return this.db.jsonGreenListEffects.red.includes(e);
    }

    public get newEffect(): any {
        return this.db.data.jsonSpells[this.spellid].effects.find(e => e.effectUid == this.effectid);
    }
    public get oldEffect(): any {
        return this.db.data2.jsonSpells[this.spellid].effects.find(e => e.effectUid == this.effectid);
    }
    
    public get effectModel() {
        return this.db.data.jsonEffects.find(e => e.id == this.newEffect.effectId);
    }
    public get isElemental() {
        return this.effectModel.elementId >= 0;
    }


    public get isDiff() {
        return this.diffchecker.effectDiff(this.spellid, this.effectid)
        // return this.rawZone != "" || this.targetMask != "" || this.values != "" || this.delay != "" || this.duration != "";
    }
    public diffProp(prop) {
        let newprop = this.newEffect[prop]
        let oldprop = this.oldEffect[prop]
        if(newprop == oldprop) return "";
        return this.i18n.tr(prop) + ": " + this.i18n.tr(oldprop) + " -> " + this.i18n.tr(newprop);
    }
    public get dispellable() {
        if(this.newEffect.dispellable != this.oldEffect.dispellable) {
            return "rawZone: " + this.oldEffect.dispellable + " -> " + this.newEffect.dispellable;
        }
        return "";
    }
    public get rawZone() {
        if(this.newEffect.rawZone != this.oldEffect.rawZone) {
            return "rawZone: " + this.oldEffect.rawZone + " -> " + this.newEffect.rawZone;
        }
        return "";
    }
    public get targetMask() {
        if(this.newEffect.targetMask != this.oldEffect.targetMask) {
            return "targetMask: " + this.oldEffect.targetMask + " -> " + this.newEffect.targetMask;
        }
        return "";
    }
    public get delay() {
        if(this.newEffect.delay != this.oldEffect.delay) {
            return "delay: " + this.oldEffect.delay + " -> " + this.newEffect.delay;
        }
        return "";
    }
    public get duration() {
        if(this.newEffect.duration != this.oldEffect.duration) {
            return "duration: " + this.oldEffect.duration + " -> " + this.newEffect.duration;
        }
        return "";
    }
    public get effectId() {
        if(this.newEffect.effectId != this.oldEffect.effectId) {
            return "effectId: " + this.oldEffect.effectId + " -> " + this.newEffect.effectId;
        }
        return "";
    }
    public get values() {
        if(this.newEffect.diceNum != this.oldEffect.diceNum || this.newEffect.diceSide != this.oldEffect.diceSide) {
            return "values: " + this.oldEffect.diceNum + " - " + this.oldEffect.diceSide + " -> " + this.newEffect.diceNum + " - " + this.newEffect.diceSide
        }   
        if(this.newEffect.value != this.oldEffect.value)
            return "value: " + this.oldEffect.value + " -> " + this.newEffect.value;
        return "";
    }
    

}
