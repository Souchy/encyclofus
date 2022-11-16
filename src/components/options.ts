
import { I18N } from '@aurelia/i18n';
import { inject, observable } from 'aurelia';
import { db } from '../DofusDB/db';
import jsonVersions from '../DofusDB/versions.json'
// import themeLight from './themes/themelight.less'
// import themeDark from './themes/themedark.less'

@inject(db)
export class Options {
	public db: db;
	public versions: string[];
	@observable
	public selectedVersion: string;
	@observable
	public selectedLang: string;


	// public themeLight = import('./themes/themelight.less');
	// public themeDark = import('./themes/themedark.less');

	constructor(db: db, @I18N private readonly i18n: I18N) {
		this.db = db;
		this.versions = jsonVersions;

		this.selectedVersion = this.db.version;
		this.selectedLang = this.db.lang.toUpperCase();
	}

	selectedVersionChanged(newValue: string, oldValue: string) {
		// console.log("selected version changed: " + oldValue + " -> " + newValue)
		this.db.setVersion(newValue);
	}

	
	selectedLangChanged(newValue: string, oldValue: string) {
		let lang = newValue.toLowerCase();
		// console.log("selected language changed: " + oldValue + " -> " + newValue)
		this.i18n.setLocale(lang);
		this.db.setLanguage(lang);
	}

}
