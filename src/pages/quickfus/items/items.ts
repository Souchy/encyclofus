import { IEventAggregator, inject } from "aurelia";
import { db } from "../../../DofusDB/db";

@inject(db)
export class items {


    public itemsPerPage: number = 50;
    public page:number = 0;

    public items: Object[] = [];

    public constructor(readonly db: db, @IEventAggregator readonly ea: IEventAggregator) {
        this.ea.subscribe("quickfus:search", (filter: string) => this.updateSearch(filter));
        this.updateSearch();
    }

    public async updateSearch(filter: string = "") {
        this.db.items
        .find({ level: 200 })
        // .sort({ level: -1 })
        // .sort(i => i.level)
        // .sort({ level: 1 })
        // .sort((a, b) => a.level > b.level)
        .skip(0)
        .limit(50)
        .toArray();
        // .forEach(i => {
        //     console.log("i: " + i)
        // })
        // this.db.items.find({}).sort(i => i.level).skip(this.itemsPerPage * this.page).limit(this.itemsPerPage).toArray().then(a => {
        //     this.items = a;
        // })
    }


}
