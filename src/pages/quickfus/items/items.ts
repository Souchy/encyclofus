import { IEventAggregator, inject } from "aurelia";
import { pipeline } from "stream";
import { db } from "../../../DofusDB/db";
import { Emerald } from "../../../ts/emerald";
import { Mason, util } from "../util";
var merge = require('deepmerge');

@inject(db, Emerald)
export class items {

	public mason: Mason;
	public grid: HTMLDivElement;
    private pageHost: Element;
    private debouncedShowMore = util.debounce(() => {
        this.mason.showMore();
    }, 500, true);

    public constructor(readonly db: db, readonly emerald: Emerald, @IEventAggregator readonly ea: IEventAggregator) {

        let onItemSheetAttached = util.debounce(() => {
            this.mason.reloadMsnry();
        }, 200, false);

        this.ea.subscribe("itemsheet:loaded", () => {
           onItemSheetAttached();
        });

        this.ea.subscribe("quickfus:search", (filter: string) => this.search(filter));

        this.ea.subscribe("db:loaded", () => {
            // this.search();
        });
        // when emerald loads, auto search
        this.ea.subscribe("emerald:loaded", () => {
			this.mason.fulldata = this.emerald.items; // store full data
            this.search();
        })
    }

    public isLoaded() {
        return this.emerald.items
    //     return this.db.jsonItemTypes && this.db.jsonItemTypes && this.db.jsonEffects && this.db.jsonCharacteristics
    }
    public attached() {
        // console.log("itemsearch attached grid: " + this.grid);
        this.mason = new Mason();
        this.mason.obj = this;
        this.mason.initMasonry();

        // scroll handler
        this.pageHost = document.getElementsByClassName("page-host")[0];
        let handler =  (e) => {
            if(!this.grid) {
                this.pageHost.removeEventListener('scroll', handler, false);
                return;
            }
            setTimeout(() => this.onScroll(e));
        };
        this.pageHost.addEventListener('scroll', handler);

        // if already loaded emerald, auto search
        if(this.emerald.items?.length > 1) {
            this.mason.fulldata = this.emerald.items;
            this.search();
        }
    }

    private async onScroll(e?) {
        let h1 = this.pageHost.clientHeight;
        let h2 = this.grid.scrollHeight + this.grid.offsetTop;
        let maxScroll = h2 - h1;
        let currScroll = this.pageHost.scrollTop;
        // console.log("ph: " + h1 + ", au: " + h2 + ", max: " + maxScroll + ", curr: " + currScroll)
        if(Math.abs(currScroll - maxScroll) <= 15) {
            this.debouncedShowMore();
        }
    }

    public async search(filter: string = "") {
        // this.search1();
        this.mason.data = []; // this.items = [];
        this.mason.page = 0;
        this.mason.showMore(); //this.scrollDown();
        console.log("search1")
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

        this.mason.data = await p.toArray(); //this.items = await p.toArray();
        console.log("this.items: " + this.mason.data.length);
        // p.forEach(i => {
        //     console.log("i: " + i)
        // })

        // let objects = await p;
        // this.items = objects;

        return;
    }

    private async search0(filter: string = "") {
        this.mason.data = await this.db.items
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
