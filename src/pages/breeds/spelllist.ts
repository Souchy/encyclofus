import { bindable, inject } from "aurelia";
import { IRouter, IRouteableComponent, Navigation, Parameters, RoutingInstruction } from '@aurelia/router';

import { db } from "../../DofusDB/db";
import jsonBreeds from '../../DofusDB/static/classes.json';

@inject(db)
export class SpellList {
	
	public db: db;
	
	@bindable
	public breed: string = "feca";
	public selectedSlot: number = 0;

	constructor(db: db) {
		this.db = db;
	}

	load(parameters: Parameters, instruction: RoutingInstruction, navigation: Navigation): void | Promise<void> {
		this.selectSpellOnLoad();
	}

	public async selectSpellOnLoad() {
		let result = await this.db.promiseLoadingSpells;
		if(result) {
			this.selectSlot(0);
		}
	}

	public get isDbLoaded() {
		return this.db.isLoaded;
	}
	
	public get spells(): any[] {
		if(!this.db.jsonSpells) return null;
		return this.db.jsonSpells[this.breed];
	}
	
	public selectSlot(slot: number): void {
		this.selectedSlot = slot;
	}

	public getSpellImg(spellId: string): string {
		return this.db.getSpellIconPath(spellId);
	}
	
}
