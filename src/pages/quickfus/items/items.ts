import { IEventAggregator, inject } from "aurelia";
import { db } from "../../../DofusDB/db";

@inject(db)
export class items {


    public itemsPerPage: number = 50;
    public page:number = 0;

    public constructor(readonly db: db, @IEventAggregator readonly ea: IEventAggregator) {
        this.ea.subscribe("quickfus:search", (filter: string) => this.updateSearch(filter));
    }

    public updateSearch(filter: string) {
        
    }


}
