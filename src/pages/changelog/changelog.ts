import { I18N } from "@aurelia/i18n";
import { db } from "../../DofusDB/db";
import jsonVersions from '../../DofusDB/versions.json'
import { DI, IEventAggregator, Registration, observable } from 'aurelia';
import { SummonUtils } from "../../ts/summonUtils";

export class Changelog {
    
    // public active: boolean = true;
    // public diffVersion: string;

	// private loadedPrevious: boolean = false;
	public versions: string[];
	@observable
	public selectedVersion: string;

	public constructor(
        private readonly summonUtils: SummonUtils,
        private readonly db: db, 
        @I18N private readonly i18n: I18N, 
        @IEventAggregator readonly ea: IEventAggregator
    ) {
		this.versions = jsonVersions;
        this.selectedVersion = this.db.data2.version;
        // this.diffVersion = versions[1];
        // console.log("changelog ctor")
		// this.db.data2.loadJson(); // dont load this every in every ctor bc it activates on every page change
	}

    public generate() {

    }
    //#region Data loading
	public get isLoaded() {
        // console.log("d: " + this.db.data.isLoaded + ", " + this.db.data2.isLoaded);
		return this.db.data.isLoaded && this.db.data2.isLoaded;
	}
	public selectedVersionChanged(newValue: string, oldValue: string) {
		// console.log("selected version changed: " + oldValue + " -> " + newValue)
		this.db.setVersion2(newValue);
		// if(oldValue)
		// 	location.reload();
	}
    //#endregion

    //#region Breed spells
	public get breeds() {
		return Object.keys(this.db.data.jsonBreeds);
	}
	public spellsFor(breedid): number {
        // console.log("check diff breed: " + breedid)
		return this.db.data.jsonBreeds[breedid].spells
            .filter(s => s != 25201 && s != 25122); // remove admin spells (doom style, ankatchoum)
	}
    public getBreedName(breedid) {
        return this.db.getI18n(this.db.data.jsonBreeds[breedid].nameId);
    }
    //#endregion
}

// const container = DI.createContainer();
// container.register(
// 	Registration.singleton(Changelog, Changelog)
// );

