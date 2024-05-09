import { DI, Registration, bindable } from "aurelia";
import { db } from "../DofusDB/db";
import { I18N } from "@aurelia/i18n";
import { Targets } from "../DofusDB/formulas";
import { tsThisType } from "@babel/types";
import { Util } from "./util";
import { DofusSpell } from "./dofusModels";
import { Change, Diff, diffSentences, diffWords } from "diff";
import { Color } from "colors";

export class DescriptionUtils {

	public desc: string;
	private differ = new Diff();
	public hasDiff: boolean;

	public changes: Change[];

	public constructor(private readonly db: db, @I18N private readonly i18n: I18N) {
	}


	public setDescTo(spell: DofusSpell) {
		this.desc = this.db.getI18n(spell.descriptionId);
	}

	public setDescToDiff(spellOld: DofusSpell, spellNew: DofusSpell) {
		// let name = this.db.getI18n(spellNew.nameId);
		// spellNew.nameId
		if(spellNew.spellId != 13525)
			return;
		this.hasDiff = false;
		// console.log("diff desc on spell " + spellOld.spellId + " " + name)
		let descOld = this.db.getI18n(spellOld.descriptionId);
		let descNew = this.db.getI18n(spellNew.descriptionId);
		console.log(descOld);
		console.log(descNew);

		// let changesWords = diffWords(descOld, descNew);
		let changesSentences = diffSentences(descOld, descNew);
		// let changes: Change[] = this.differ.diff(descOld, descNew, { ignoreCase: true });
		// console.log(changesWords);
		// console.log(changesSentences);
		this.changes = changesSentences;

		this.changes = this.changes.map(c => {
			c.value = c.value.replace("\n\n", "\n");
			if (c.value != "\n" && (c.added || c.removed))
				this.hasDiff = true;
			return c;
		});
		// if(spellNew.spellId == 13567)
		// 	console.log(this.changes);

		// if(this.changes.some(c => c.added || c.removed))
		// 	this.hasDiff = true;
		// let final = changesSentences.map(part => {
		// 	// green for additions, red for deletions
		// 	let text = part.added ? part.value :
		// 			   part.removed ? part.value :
		// 							  part.value;
		// 	if(part.added || part.removed)
		// 		this.hasDiff = true;
		// 	// console.log("part: " + part.value)
		// 	// process.stderr.write(text);
		// 	return text;
		// }).join("");

		// // console.log(changes);
		// console.log("final: " + final)
		// this.desc = final;
	}

	// attached() {
	// 	this.showbit = this.cutDescription.map(t => false);
	// }

	public getChangeStyle(change: Change) {
		if (change.added)
			return "color: green";
		if (change.removed)
			return "color: red";
		return "";
	}

	public get renderChanges() {
		return "";
	}

	public get cutDescription(): string[] {
		// if (!spell) {
		// 	// happens when going from changelog to breed page, this.spellid is still null
		// 	// console.log("spell null: " + this.spellid) 
		// 	return [""];
		// }
		// let text = this.db.getI18n(spell.descriptionId);

		if (this.changes) {
			let data = [];
			for (let change of this.changes) {
				let data1 = this.cutText(change.value);
				change["data"] = data1;
			}
		} else {
			let text = this.desc;
			if (!text) return [""]; // les invoc chafer n'ont pas de description sur leurs sorts par exemple
			return this.cutText(text);
		}
	}

	private cutText(text: string): string[] {
		let data = [];
		while (text.includes("{")) {
			let start = text.indexOf("{");
			let end = text.indexOf("}") + 1;

			data.push(text.substring(0, start))
			data.push(text.substring(start, end))
			text = text.substring(end)
		}
		// remaining text
		if (text.length > 0)
			data.push(text)
		// console.log({data})
		// this.showbit = data.map(t => false);
		return data;
	}


	public renderDescriptionBit(text: string) {
		if (!text) return "";
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
			if (this.db.data.jsonSpells[spellid])
				return spellid;
			else
				return spellid + "-" + grade;
		}
		return 0;
	}
	// public get subSpellId() {
	// 	return this.getTextSubSpellId(desc);
	// }

	// public clickDescription(index) {
	// 	this.showbit[index] = !this.showbit[index]
	// 	for (let i = 0; i < this.showbit.length - 1; i++) {
	// 		if (i == index) continue;
	// 		this.showbit[i] = false;
	// 	}
	// 	this.thing = false;
	// 	this.thing = this.showbit[index];
	// 	// console.log(this.thing + " show[" + index + "]: " + this.showbit)
	// }

}

const container = DI.createContainer();
container.register(
	Registration.transient(DescriptionUtils, DescriptionUtils)
);
