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
    private itemFilter: Object = null;
    private debouncedShowMore = util.debounce(() => {
        // this.mason.showMore();
        this.search1();
    }, 500, true);

    public constructor(readonly db: db, readonly emerald: Emerald, @IEventAggregator readonly ea: IEventAggregator) {
        let onItemSheetAttached = util.debounce(() => {
            this.mason.reloadMsnry();
        }, 200, false);

        //
        this.ea.subscribe("db:loaded", () => {
            // this.search();
        });
        // when emerald loads, auto search
        this.ea.subscribe("emerald:loaded", () => {
			// this.mason.fulldata = this.emerald.items; // store full data
            this.search();
        })
        // on sheet attached
        this.ea.subscribe("itemsheet:loaded", () => {
           onItemSheetAttached();
        });
        // on click search in the filter
        this.ea.subscribe("items:search", (filter: string) => this.search(filter));
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
            // this.mason.fulldata = this.emerald.items;
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

    /**
     * new search : clear current items and search for new
     */
    public async search(filter: Object = null) {
        this.itemFilter = filter;
        this.mason.data = []; // this.items = [];
        this.mason.fulldata = [];
        this.mason.page = 0;
        this.search1();
        // console.log("search1")
    }

    /**
     * ongoing search: add new items to current
     */
    public async search1() {
        // if (!this.isLoaded || !this.db.isLoaded) {
        //     console.log("search when not loaded")
        //     return;
        // }

        console.log("search1 filter: " + JSON.stringify(this.itemFilter))

        var pipeline = [];
        {
            // actual filter
            pipeline.push({ $match: this.itemFilter ?? "" });
            // sums
            //   if(Object.keys(adds.$addFields).length > 0)
            //     pipeline.push(adds);
            // sort
            pipeline.push({ $sort: { "level": -1, "id": -1 } });
            // skip
            pipeline.push({ $skip: this.mason.page * this.mason.itemsPerPage });
            // limit
            pipeline.push({ $limit: this.mason.itemsPerPage });
        };
        // console.log("search 1, limit: " + this.mason.itemsPerPage + ", skip: " + this.mason.page * this.mason.itemsPerPage)

        let cursor = this.emerald.collectionItems.aggregate(pipeline);
        // console.log({cursor})
        let arr = await cursor.toArray(); 
        this.mason.fulldata.push(...arr);
        // console.log("arr: " + arr + ", fulldata: " + this.mason.fulldata.length);

        this.mason.showMore(); 
    }

    private async search0(filter: string = "") {
        this.mason.data = await this.emerald.collectionItems
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
