import { IEventAggregator, inject } from "aurelia";
import { pipeline } from "stream";
import { db } from "../../../DofusDB/db";
import { Emerald } from "../../../ts/emerald";
import { Mason, util } from "../util";
var merge = require('deepmerge');

@inject(db, Emerald)
export class items {

    public itemsPerPage: number = 25;
    public page: number = 0;

    public items: Object[] = [];
    
	public mason: Mason;
	public grid: HTMLDivElement;

    public constructor(readonly db: db, readonly emerald: Emerald, @IEventAggregator readonly ea: IEventAggregator) {
		this.mason = new Mason();
		this.mason.obj = this;

        this.ea.subscribe("itemsheet:loaded", () => {
           let bloop = util.debounce(() => {
                this.mason.reloadMsnry();
            }, 100, false);
        });

        this.ea.subscribe("quickfus:search", (filter: string) => this.search(filter));

        this.ea.subscribe("db:loaded", () => {
            // this.search();
        });
        this.ea.subscribe("emerald:loaded", () => {
            this.search();
        })

			// console.log("itemsearch query : " + response.content.length);
			// console.log("itemsearch query : " + response.content);

			// this.data = response.content;
			// this.queriedb = true;
			// if (msn != false) 
                // this.mason.initMasonry();
    }

    public isLoaded() {
        return this.emerald.items
    //     return this.db.jsonItemTypes && this.db.jsonItemTypes && this.db.jsonEffects && this.db.jsonCharacteristics
    }

    public async search(filter: string = "") {
        // this.search1();
        this.items = [];
        // console.log("search0")
        this.scrollDown();
        console.log("search1")
        
			this.mason.index = 0; // reset index
			this.mason.data = [] //.splice(0, this.data.length); // reset select data
			this.mason.fulldata = this.items; //response.content; // store full data
			this.mason.showMore(100); // select data
            // this.mason.layout(); //.reloadMsnry();
            this.mason.initMasonry();
    }

    public scrollDown() {
        // for(let i = this.page * this.itemsPerPage; i < this.itemsPerPage; i++) {
        //     this.items.push(this.emerald.items[i]);
        // }
        let slice = this.emerald.items.slice(this.page * this.itemsPerPage, this.itemsPerPage);
        this.items.push(...slice);
    }

    public async search1(filter: string = "") {
        // if (!this.isLoaded || !this.db.isLoaded) {
        //     console.log("search when not loaded")
        //     return;
        // }

        var mongofilter = { $and: [

        ] };
        var pipeline = [];
        {
            // sort // , "ankamaID": -1
            pipeline.push({ $sort: { "level": -1 } });
            // sums
            //   if(Object.keys(adds.$addFields).length > 0)
            //     pipeline.push(adds);
            // actual filter
            pipeline.push({ $match: mongofilter });
            // limit
            pipeline.push({ $limit: 50 });
            // skip
            pipeline.push({ $skip: 0 });
        };

        let p = this.db.items
            .aggregate(pipeline);

        console.log({p})

        this.items = await p.toArray();
        console.log("this.items: " + this.items.length);
        // p.forEach(i => {
        //     console.log("i: " + i)
        // })

        // let objects = await p;
        // this.items = objects;

        return;
    }

    private async search0(filter: string = "") {
        this.items = await this.db.items
            .find({ })

            .sort({ level: -1 })
            // .sort(i => i.level)
            // .sort({ level: 1 })
            // .sort({ "level": 1 })
            // .sort((a, b) => a.level > b.level)
            // .sort({ level: -1 })

            .skip(0)
            .limit(50)
            .toArray()
    }
    // private search01() {
    // .then(a => {
    //     a.sort((x, y) => y["level"] - x["level"]);
    //     a = a.slice(0, 50);
    //     return a;
    // })


    // .forEach(i => {
    //     console.log("i: " + i)
    // })
    // this.db.items.find({}).sort(i => i.level).skip(this.itemsPerPage * this.page).limit(this.itemsPerPage).toArray().then(a => {
    //     this.items = a;
    // })
    // }

}
