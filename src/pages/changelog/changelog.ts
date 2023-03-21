import { I18N } from "@aurelia/i18n";
import { db } from "../../DofusDB/db";
import versions from '../../DofusDB/versions.json'
import { DI, IEventAggregator, Registration } from 'aurelia';

export class Changelog {
    
    // public active: boolean = true;
    // public diffVersion: string;

	// private loadedPrevious: boolean = false;

	public constructor(
        readonly db: db, 
        @I18N private readonly i18n: I18N, 
        @IEventAggregator readonly ea: IEventAggregator
    ) {
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
	// public get breed(): any {
	// 	if (!this.db.jsonBreeds) return null;
	// 	if (!this.db.breedId) return null;
	// 	return this.db.jsonBreeds[this.db.breedId + ""];
	// }
	// public get spells(): any[] {
	// 	if (!this.breed) return null;
	// 	return this.breed.spells;
	// }
    //#endregion

    //#region Spell changes
    // public getSpellChanges(spellid) {
    //     let newSpell = this.breed.spells[spellid]
    //     let oldSpell = this.jsonBreeds[this.db.breedId.toString()].spells[spellid]
    //     let arr = [];
    //     if(newSpell.apCost != oldSpell.apCost)
    //         arr.push("AP: " + oldSpell.apCost + " -> " + newSpell.apCost);
    //     if(newSpell.minRange != oldSpell.minRange || newSpell.range != oldSpell.range)
    //         arr.push("PO: " + oldSpell.minRange + " - " + oldSpell.Range + " -> " + newSpell.minRange + " - " + newSpell.Range);
    //     if(newSpell.castTestLos != oldSpell.castTestLos)
    //         arr.push("LoS: " + oldSpell.castTestLos + " -> " + newSpell.castTestLos);

    //     // if(newSpell.effects != oldSpell.effects)
    // }
    //#endregion

}

// const container = DI.createContainer();
// container.register(
// 	Registration.singleton(Changelog, Changelog)
// );

