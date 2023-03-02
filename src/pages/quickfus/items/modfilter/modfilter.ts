import { IEventAggregator, inject } from "aurelia";
import { db } from "../../../../DofusDB/db";
import itemTypes from "../../../../DofusDB/scraped/2.66.5.18/itemtypes.json"
import { util } from "../../util";
import { Emerald } from "../../../../ts/emerald";
import * as $ from 'jquery';

export class ModFilter {

    // Static data
	public modsSections: Map<string, string[]>;
    
    // dynamic
    public blockId: number;
	public pseudoName: string;
	public effectId: number;
	public min: number;
	public max: number;
	public activate: boolean = true;

    // input
    public inputText: string;
    

    //  @IEventAggregator 
    public constructor(readonly db: db, readonly emerald: Emerald, readonly ea: IEventAggregator) {
        this.modsSections = new Map<string, string[]>();
		this.modsSections.set("Pseudo", [
			"(Pseudo) # res",
			"(Pseudo) # res élémentaires",
			"(Pseudo) Total #% res",
			"(Pseudo) Total #% res élémentaires",
		]);
        // db.getStatSections();
	}


    public onKeyup(event) {

    }
    public onChange(event) {

    }
    public onFocus() {

    }
    public onUnfocus() {

    }
    public onDelete() {
        this.ea.publish("quickfus:mod:delete", this);
    }




    // modifies the filtered list as per input
    public getFilteredList() {
        this.listHidden = false;
        // this.selectedIndex = 0;
        if (!this.listHidden && this.inputItem !== undefined) {
            this.filteredList = this.list.filter((item) 
                => item.toLowerCase().startsWith(this.inputItem.toLowerCase()));
        }
    }




	public getStatSections(): Map<string, number> {
		let sec =  db.getStatSections();
		return sec;
	}
    public getFullModList() {
        
    }
	public getModsForSection(section: number) {
		return this.emerald.characteristics
			.filter(c => c.categoryId == section)
			.sort((a, b) => a.order - b.order);
	}
	public getI18n(nameId: number) {
		return this.db.getI18n(nameId.toString());
	}

}
