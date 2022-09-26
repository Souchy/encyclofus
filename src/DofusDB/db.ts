import { loadavg } from "os";
import version from './scraped/version.json'

import { DI, Registration } from 'aurelia';
import { HttpClient } from '@aurelia/fetch-client';

export class db {

	private http = new HttpClient();

	// lang should be stored on the client (local storage / session storage / cache / cookie)
	public lang_default = "fr";
	public lang: string = this.lang_default;
	public version: string = version.latest;

	// actual json fetched 
	public jsonSpells: any;
	public jsonSpellsDetails: any;
	public jsonSpellsName = "spells.json";
	public jsonSpellsDetailsName = "spellsDetails.json";

	public constructor() {

	}
	
	public promiseLoadingSpells: Promise<boolean>;
	public promiseLoadingSpellsDetails: Promise<boolean>;
	public get isLoaded() {
		return this.jsonSpells && this.jsonSpellsDetails;
	}

	public setLanguage(lang: string) {
		if (lang == this.lang) {
			// do nothing
		} else {
			this.lang = lang;
			this.loadJson();
		}
	}

	public setVersionLatest() {
		this.setVersion(version.latest);
	}
	public setVersion(version: string) {
		if (version == this.version) {
			// do nothing
		} else {
			this.version = version;
			this.loadJson();
		}
	}

	// need to implement this in every aurelia app using this module
	// public loadJson = () => {
	// 	console.log("Json fetching unimplemented");
	// };

	public async loadJson() {
		this.promiseLoadingSpells = this.loadSpells(this.getJsonFolderPath());
		this.promiseLoadingSpellsDetails = this.loadSpellsDetails(this.getJsonFolderPath());
		console.log("loaded = promise: " + this.promiseLoadingSpells)

		let result = await this.promiseLoadingSpells;
		if (!result) {
			this.promiseLoadingSpells = this.loadSpells(this.getJsonFolderPathDefaultLang());
			result = await this.promiseLoadingSpells;
		}
		console.log("db loaded json spells: " + result);

		result = await this.promiseLoadingSpellsDetails;
		if(!result) {
			this.promiseLoadingSpellsDetails = this.loadSpellsDetails(this.getJsonFolderPathDefaultLang());
			result = await this.promiseLoadingSpellsDetails;
		}
		console.log("db loaded json spells details: " + result);
	}

	public async loadSpells(folderpath: string): Promise<boolean> {
		return this.http.fetch(folderpath + this.jsonSpellsName)
			.then(response => response.status == 404 ? null : response.text())
			.then(data => {
				if (data == null) return false;
				this.jsonSpells = JSON.parse(data);
				console.log("loaded spells"); // + this.jsonSpells["feca"]);
				return true;
			}).catch(() => {
				return false;
			});
	};

	public loadSpellsDetails(folderpath: string): Promise<boolean> {
		return this.http.fetch(folderpath + this.jsonSpellsDetailsName)
			.then(response => response.status == 404 ? null : response.text())
			.then(data => {
				if (data == null) return false;
				this.jsonSpellsDetails = JSON.parse(data);
				// console.log("loaded spells details : " + JSON.stringify(data))
				return true;
			}).catch(() => {
				return false;
			});
	};

	public getJsonFolderPath() {
		return "src/DofusDB/scraped/" + this.version + "/" + this.lang + "/";
		//       src/DofusDB/scraped/      2.64/             fr/    spells.json
	}
	public getJsonFolderPathDefaultLang() {
		return "src/DofusDB/scraped/" + this.version + "/" + this.lang_default + "/";
	}




	private scrapedUrlPath: string = "src/DofusDB/scraped/";
	private commonUrlPath: string = "src/DofusDB/scraped/common/";

	public getSpellIconPath(spellId: string): string {
		return "src/DofusDB/scraped/" + this.version + "/spellIcons/" + spellId + ".png";
	}

	// public getBreedIconStyle(breedIndex: number) {
	// 	return "background: transparent url(this.rootUrlPath + 'big.png') 0 0 no-repeat; background-position: -56px ${-57 * " + breedIndex + "}px;";
	// }

	public getBreedIconStyle(breedIndex: number) {
		// console.log("db getBreedIconStyle")
		return "height: 54px; width: 54px;" +
			"margin-bottom: 5px; margin-left: 2px; margin-right: 3px;" +
			"box-sizing: border-box;" +
			"background: transparent url('" + this.commonUrlPath + "big.png') 0 0 no-repeat; background-position: -56px " + Math.ceil(-56.8 * breedIndex) + "px;";
	}

	public getFighterIconStyle(mod: string) {
		if (mod.includes("{enemy}")) return this.fighterSprite('enemy.png', 0, 9);
		if (mod.includes("{ally}")) return this.fighterSprite('ally.png', 0, 9);
		if (mod.includes("{fighter}")) return this.fighterSprite('fighter.png', 0, 9);
		if (mod.includes("{caster}")) return this.fighterSprite('caster.png', 0, 9);
		return "";
	}

	private fighterSprite(imgName: string, x: number, y: number) {
		return "vertical-align: middle; width: 22px; height: 22px; background-image: url('" + this.commonUrlPath + imgName + "'); background-repeat: no-repeat;"
			+ "background-position: " + x + "px; background-position-y: " + y + "px;";
	}

	public getModIconStyle(mod: string) {
		if (mod.toLowerCase().includes(" pa ")) return this.modSprite(97, 243);
		if (mod.toLowerCase().includes(" pm ")) return this.modSprite(97, 52);
		if (mod.toLowerCase().includes("portée")) return this.modSprite(97, 128);

		if (mod.toLowerCase().includes("initiative")) return this.modSprite(97, 205);
		if (mod.toLowerCase().includes("invocation")) return this.modSprite(97, 507);
		if (mod.toLowerCase().includes("% critique")) return this.modSprite(97, 589);
		if (mod.toLowerCase().includes("prospection")) return this.modSprite(97, 279);

		if (mod.toLowerCase().includes("vie")) return this.modSprite(97, 919);
		if (mod.toLowerCase().includes("vitalité")) return this.modSprite(97, 319);
		if (mod.toLowerCase().includes("sagesse")) return this.modSprite(97, 358);

		if (mod.toLowerCase().includes("neutre")) return this.modSprite(95, 15);
		if (mod.toLowerCase().includes("force") || mod.toLowerCase().includes(" terre")) return this.modSprite(97, 432);
		if (mod.toLowerCase().includes("intelligence") || mod.toLowerCase().includes(" feu")) return this.modSprite(97, 394);
		if (mod.toLowerCase().includes("chance") || mod.toLowerCase().includes(" eau")) return this.modSprite(97, 89);
		if (mod.toLowerCase().includes("agilité") || mod.toLowerCase().includes(" air")) return this.modSprite(97, 167);
		if (mod == "Puissance") return this.modSprite(97, 1108);

		if (mod.toLowerCase().includes("tacle")) return this.modSprite(97, 545);
		if (mod.toLowerCase().includes("fuite")) return this.modSprite(97, 469);

		if (mod.toLowerCase().includes("résistance poussée")) return this.modSprite(97, 832);
		if (mod.toLowerCase().includes("résistance critique")) return this.modSprite(97, 1200);
		if (mod.toLowerCase().includes("esquive pm")) return this.modSprite(97, 1016);
		if (mod.toLowerCase().includes("esquive pa")) return this.modSprite(97, 1064);
		if (mod.toLowerCase().includes("retrait pa")) return this.modSprite(97, 1340);
		if (mod.toLowerCase().includes("retrait pm")) return this.modSprite(97, 1340);

		if (mod.toLowerCase().includes("soin")) return this.modSprite(97, 966);
		if (mod == "Dommages") return this.modSprite(97, 1156);
		if (mod == "Dommages Poussée") return this.modSprite(97, 872);
		if (mod == "Dommages Critiques") return this.modSprite(97, 1248);
		if (mod == "Puissance aux pièges") return this.modSprite(97, 672);
		if (mod == "Dommages aux pièges") return this.modSprite(97, 712);

		return "";
	}

	private modSprite(x: number, y: number) {
		y -= 6;
		// return "display: inline-block; zoom: 1.0; vertical-align: middle; width: 22px; height: 22px; background-image: url('/src/DofusDB/scraped/icons.png'); background-position: -" + x + "px; background-position-y: -" + y + "px;"
		return "vertical-align: middle; width: 22px; height: 22px; background-image: url('" + this.commonUrlPath + "icons.png');"
			+ "background-position: -" + x + "px; background-position-y: -" + y + "px;"
	}


}

const container = DI.createContainer();
container.register(
	Registration.singleton(db, db)
);
