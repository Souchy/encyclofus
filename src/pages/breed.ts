import jsonBreeds from '../DofusDB/static/classes.json';
// import jsonSpells from '../DofusDB/scraped/spells.json';
// import { inject } from 'aurelia-dependency-injection'; //or framework
// import { Router, activationStrategy } from 'aurelia-router';
// import {activationStrategy} from 'aurelia-router';
// import { db } from 'DofusDB/db';
// import details from '../details.json'
import { db } from '../DofusDB/db';

// Aurelia 2
import { inject, lazy, all, optional, newInstanceOf, factory } from "@aurelia/kernel";
import { bindable, Router } from 'aurelia';

// @inject(Router)
export class Breed {
	// public router: Router;

	@bindable
	public breed: string = "feca";
	// index number in the list of spells of the class, not the actual spell id
	public selectedSpellNumber: number = 0;

	// constructor(router) {
	// 	this.router = router;
	// }

	public created(owningView, myView) { // :View
		// try {
		// 	this.breed = this.getRoute()
		// } catch(err) {
		// }
		// console.log("breed created route : " + this.breed);
	}

	// public getRoute() {
	// 	return this.router.currentInstruction.config.name; //name of the route
	// 	// return this.router.currentInstruction.config.moduleId; //moduleId of the route
	// }

	// activate(params, routeConfig, navigationInstruction) {
	// 	console.log("nav instruction: " + navigationInstruction);
	// 	this.breed = navigationInstruction;
	// 	console.log("breed activate route : " + this.breed);
	// }


    // determineActivationStrategy() {
	// 	return activationStrategy.replace;
	// }

	public selectSpell(id: number) {
		this.selectedSpellNumber = id;
	}

	public getId(): number {
		return jsonBreeds.ids["feca"];
	}
	public getI18nName(): string {
		return jsonBreeds.french[this.getId()-1];
	}

	public get spells(): any[] {
		return db.jsonSpells["feca"];
	}

	public getSpell(spellListIndex): any {
		return this.spells[spellListIndex];
	}

	public getIcon(val: string) {
		if(val) {
			return db.getModIconStyle(val);
		}
		return "";
	}

	public getDetailsObj(spellListIndex) {
		return db.jsonSpellsDetails[this.getSpell(spellListIndex).id];
	}
	public getDetails(spellListIndex) {
		let detail = db.jsonSpellsDetails[this.getSpell(spellListIndex).id];
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
			let style = db.getFighterIconStyle(val);
			// console.log("get fighter style: " + style);
			return style;
		}
		return "";
	}


	public getSpellImg(spellId) {
		return db.getSpellIconPath(spellId);
	}


	public get jsonSpells() {
		return db.jsonSpells;
	}

	public get jsonSpellsDetails() {
		return db.jsonSpellsDetails;
	}

}
