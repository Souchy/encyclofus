
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
	public modes: string[] = ["debug", "basic"]; //"detailed", "basic"];

	@observable
	public selectedVersion: string;
	@observable
	public selectedLang: string;
	@observable
	public selectedEffectMode: string;
	@observable
	public selectedVersion2: string;

	constructor(db: db, @I18N private readonly i18n: I18N) {
		this.db = db;
		this.versions = jsonVersions;

		this.selectedEffectMode = this.db.effectMode;
		this.selectedVersion = this.db.version;
		this.selectedLang = this.db.lang.toUpperCase();
        this.selectedVersion2 = this.db.data2.version;
	}

	public selectedLangChanged(newValue: string, oldValue: string) {
		let lang = newValue.toLowerCase();
		// console.log("selected language changed: " + oldValue + " -> " + newValue)
		this.i18n.setLocale(lang);
		this.db.setLanguage(lang);
	}

	public selectedVersionChanged(newValue: string, oldValue: string) {
		// console.log("selected version changed: " + oldValue + " -> " + newValue)
		this.db.setVersion(newValue);
		if(oldValue)
			location.reload();
	}

	public selectedEffectModeChanged(newValue: string, oldValue: string) {
		// console.log("selected effectMode changed: " + oldValue + " -> " + newValue)
		this.db.setEffectMode(newValue);
		if(oldValue)
			location.reload();
	}
	public selectedVersion2Changed(newValue: string, oldValue: string) {
		// console.log("selected version changed: " + oldValue + " -> " + newValue)
		this.db.setVersion2(newValue);
		// if(oldValue)
		// 	location.reload();
	}

}
