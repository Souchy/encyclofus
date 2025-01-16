import { filter } from './../../../quickfus/items/filter';
import { watch } from '@aurelia/runtime-html';
import { bindable, DI, inject } from "aurelia";
import { I18N } from '@aurelia/i18n';
import { db } from '../../../../DofusDB/db';
import { SpellZone } from "../../../../DofusDB/formulas";
import { ConditionRenderer } from '../../../../ts/conditions';
import { Citerions, CriteriaGroup } from '../../../../DofusDB/static/formulas/criterions';
import { DofusSpell, DofusSpellNew } from '../../../../ts/dofusModels';

@inject(db)
export class SpellNew {
	
	@bindable
	public spellid: number;
	@bindable
	public depth: number = 0;
	@bindable
	public issummon: boolean = false;
	@bindable
	public ispassive:boolean = false;
	@bindable
	public showcrit: boolean = true;
	
	@bindable
	public selectedgrade: number = 2;

	public showbit: boolean[] = []
	public thing = false;
	
	private db: db;
	private conditionRenderer: ConditionRenderer;

	public constructor(db: db, conditionRenderer: ConditionRenderer, @I18N private readonly i18n: I18N) {
		this.db = db;
		this.conditionRenderer = conditionRenderer;
	}

	public get ankaspell() : DofusSpellNew {
		return this.db.data.jsonSpellsNew[this.spellid]; //.spells[this.spellid];
	}
	public get ankaLevels(): any[] {
		return this.ankaspell.spellLevels.map(x => this.db.data.jsonSpellLevels[x]);
	}

	public get actualGrade() {
		if(this.selectedgrade >= this.ankaspell.spellLevels.length) 
			this.selectedgrade = this.ankaspell.spellLevels.length - 1;
		if(this.selectedgrade < 0)
			this.selectedgrade = 0;
		return this.selectedgrade;
	}
	public get selectedLevelId() {
		return this.ankaspell.spellLevels[this.actualGrade];
	}
	public get selectedLevel() {
		return this.db.data.jsonSpellLevels[this.selectedLevelId];
	}

	public get dbLoaded() {
		return this.db.promiseLoadingSpells;
	}

	public get spell() {
		return this.ankaspell;
	}
	public get name() {
		// console.log("spellid: " + this.spellid);
		// console.log(this.ankaspell);
		return this.db.getI18n(this.ankaspell.nameId);
	}

	public selectGrade(grade: number) {
		this.db.selectedGradeSlot = grade;
		this.selectedgrade = grade;
	}

	public get effectsClass() {
		return this.showcrit ? "effectsNormal" : "effectsWide"; 
	}

	public get cutDescription(): string[] {
		if(!this.ankaspell) {
			// happens when going from changelog to breed page, this.spellid is still null
			// console.log("spell null: " + this.spellid) 
			return [""];
		}
		let text = this.db.getI18n(this.ankaspell.descriptionId);
		if (!text) return [""]; // les invoc chafer n'ont pas de description sur leurs sorts par exemple
		let data = [];
		while (text.includes("{")) {
			let start = text.indexOf("{");
			let end = text.indexOf("}") + 1;

			data.push(text.substring(0, start))
			data.push(text.substring(start, end))
			text = text.substring(end)
		}
		// remaining text
		if(text.length > 0) 
			data.push(text)
		// console.log({data})
		// this.showbit = data.map(t => false);
		return data;
	}

	attached() {
		this.showbit = this.cutDescription.map(t => false);
	}

	public renderDescriptionBit(text: string) {
		if(!text) return "";
		if (text.includes("{")) {
			let sub = text.substring(text.indexOf("{"), text.indexOf("}") + 1)
			let data = sub.replace("}", "").split("::");
			let spellData = data[0].split(",");
			let html = data[1];
			text = text.replace(sub, html);
		}
		return text;
	}
	
	public getDescriptionRenderStyle(text: string) {
		if (text.includes("{")) {
			return "white-space: pre-line; font-weight: bold; cursor: pointer;";
		} else {
			return "white-space: pre-line;";
		}
	}

	public clickDescription(index) {
		this.showbit[index] = !this.showbit[index]
		for (let i = 0; i < this.showbit.length - 1; i++) {
			if (i == index) continue;
			this.showbit[i] = false;
		}
		this.thing = false;
		this.thing = this.showbit[index];
		// console.log(this.thing + " show[" + index + "]: " + this.showbit)
	}
	public clickHidePopup() {
		// for (let i = 0; i < this.showbit.length - 1; i++) {
		// 	this.showbit[i] = false;
		// }
		// this.thing = false;
		// console.log("hide popup")
	}

	public get hasSubSpell() {
		let text = this.db.getI18n(this.spell.descriptionId);
		if (!text) return false;
		let has = text.includes("{");
		// console.log("desc has spell: " + has)
		return has;
	}
	public get subSpellId() {
		let text = this.db.getI18n(this.spell.descriptionId);
		if (!text) return false;
		if (text.includes("{")) {
			let sub = text.substring(text.indexOf("{"), text.indexOf("}") + 1)
			sub = sub.replace("{", "").replace("}", "")
			let data = sub.split("::")[0].split(",");
			let spellid = data[1]
			let grade = data[2];
			if (this.db.data.spells[spellid])
				return spellid;
			else
				return spellid + "-" + grade;
		}
		return 0;
	}

	public textHasSubSpell(text: string) {
		if (!text) return false;
		let has = text.includes("{");
		// console.log("desc has spell: " + has)
		return has;
	}
	public getTextSubSpellId(text: string) {
		if (!text) return false;
		if (text.includes("{")) {
			let sub = text.substring(text.indexOf("{"), text.indexOf("}") + 1)
			sub = sub.replace("{", "").replace("}", "")
			let data = sub.split("::")[0].split(",");
			let spellid = data[1]
			let grade = data[2];
			if (this.db.data.spells[spellid])
				return spellid;
			else
				return spellid + "-" + grade;
		}
		return 0;
	}


}
