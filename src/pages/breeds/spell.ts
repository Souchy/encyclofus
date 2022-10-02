import { bindable, inject } from "aurelia";
import { db } from '../../DofusDB/db';

@inject(db)
export class Spell {
	private db: db;

	@bindable
	public spell: any;

	public constructor(db: db) {
		this.db = db;
	}
	
	public get dbLoaded() {
		return this.db.promiseLoadingSpells;
	}

	public getIcon(val: string) {
		// console.log("spell get icon for: " + val)
		if(val) {
			return this.db.getModIconStyle(val);
		}
		return "";
	}

	public get detailsObj(): any {
		if(!this.spell) return null;
		// console.log("detailsObj: " + JSON.stringify(this.db.jsonSpellsDetails))
		return this.db.jsonSpellsDetails[this.spell.id];
	}

	public get details() {
		let detail = this.db.jsonSpellsDetails[this.spell.id];
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
			return style;
		}
		return "";
	}


}
