import { db as sdb } from '../DofusDB/db';
import jsonBreeds from '../DofusDB/static/classes.json';

import { inject } from 'aurelia';

@inject(sdb)
export class sidebar {
	public breeds: string[];
	public mydb: sdb;

	constructor(db: sdb) { 
		this.mydb = db;
		this.breeds = jsonBreeds.orderByIcon;
	}

	public getBreedIconStyle(i) {
		return this.mydb.getBreedIconStyle(i);
	}

}
