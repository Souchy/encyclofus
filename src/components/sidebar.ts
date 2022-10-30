import { db } from '../DofusDB/db';
import jsonBreeds from '../DofusDB/static/classes.json';

import { inject } from 'aurelia';
import { IRoute, IRouter, IRouteableComponent, ReloadBehavior, Navigation, Parameters, RoutingInstruction } from '@aurelia/router';
import { I18N } from "@aurelia/i18n";

@inject(db)
export class sidebar {
	public breeds: string[];
	public db: db;

	constructor(db: db, @I18N private readonly i18n: I18N) {
		this.db = db;
		this.breeds = jsonBreeds.orderByIcon;
	}

	public getBreedIconStyle(i) {
		return this.db.getBreedIconStyle(i);
	}


	public get breedName(): string {
		return jsonBreeds.orderById[this.db.breedId - 1];
	}
	public get breedNameI18n(): string {
		let breed = this.db.jsonBreeds[this.db.breedId];
		if(!breed) return "nobreed";
		let name = this.db.getI18n(breed.nameId);
		return name;
	}
	public get isRouteClass(): boolean {
		return this.db.breedId > 0;
	}

	public translate(obj: any) {
		return this.i18n.tr(obj as string);
	}

}
