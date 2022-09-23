import { bindable } from "aurelia";

export class Spell {
	@bindable 
	public breedid: string;
	@bindable
	public spellid: string;

/*
	public getIcon(val: string) {
		if(val) {
			return this.db.getModIconStyle(val);
		}
		return "";
	}

	public getDetailsObj(spellListIndex) {
		return this.db.jsonSpellsDetails[this.getSpell(spellListIndex).id];
	}
	public getDetails(spellListIndex) {
		let detail = this.db.jsonSpellsDetails[this.getSpell(spellListIndex).id];
		if(!detail) {
			return "";
		}
		let str: string = "";
		if(detail.text) {
			for(let s of detail.text) {
				str += s; //db.insertEntityIcon(s);
				str += "\n";
				// str += "<br/>";
			}
		}
		if(detail.effects) {
			for(let s of detail.effects) {
				str += s; //db.insertEntityIcon(s);
				str += "\n";
				// str += "<br/>";
			}
		}
		return str;
	}

	public removeFighterIconTag(str: string) {
		return str.substring(0, str.indexOf("{"));
	}
	public getFighterIcon(val: string) {
		if(val) {
			let style = this.db.getFighterIconStyle(val);
			// console.log("get fighter style: " + style);
			return style;
		}
		return "";
	}
*/

}
