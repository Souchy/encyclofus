import { db } from '../DofusDB/db';
import jsonBreeds from '../DofusDB/static/classes.json';

export class sidebar {
	public breeds: string[];

	constructor() { 
		this.breeds = jsonBreeds.orderByIcon;
	}

	public getBreedIconStyle(i) {
		return db.getBreedIconStyle(i);
	}

}
