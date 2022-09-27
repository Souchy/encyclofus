
import { inject, observable } from 'aurelia';
import { db } from '../DofusDB/db';
import jsonVersions from '../DofusDB/scraped/versions.json'

@inject(db)
export class Options {
	public db: db;
	public versions: string[];
	@observable
	public selectedVersion: string;
	@observable
	public selectedLang: string;

	constructor(db: db) {
		this.db = db;
		this.versions = jsonVersions;

		this.selectedVersion = this.db.version;
		this.selectedLang = this.db.lang;
	}

	selectedVersionChanged(newValue, oldValue) {
		// console.log("selected version changed: " + oldValue + " -> " + newValue)
		this.db.setVersion(newValue);
	}

	
	selectedLangChanged(newValue, oldValue) {
		// console.log("selected language changed: " + oldValue + " -> " + newValue)
		this.db.setLanguage(newValue);
	}

}
