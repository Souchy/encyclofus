import { IEventAggregator, inject } from "aurelia";
import { pipeline } from "stream";
import { db } from "../../../DofusDB/db";
import { Mason, util } from "../util";
import { Setfilter } from "./setfilter";
import { DofusSet } from "../../../ts/dofusModels";
// import { BlockFilter, ModFilter, filter as Filter } from "./filter";
var merge = require('deepmerge');

@inject(db)
export class sets {

	public mason: Mason;
	public grid: HTMLDivElement;
    private pageHost: Element;
    // private setFilter: Object = null;
    private debouncedShowMore = util.debounce(() => {
        this.mason.showMore(); 
    }, 500, true);

    public comparing: boolean = false;


    public constructor(readonly db: db, @IEventAggregator readonly ea: IEventAggregator) {
		// console.log("sets ctor")
        this.mason = new Mason();
        this.mason.itemsPerPage = 20;

        let onSetSheetAttached = util.debounce(() => {
            this.mason.reloadMsnry();
        }, 200, false);
        // on sheet attached
        this.ea.subscribe("setsheet:loaded", (setsheet: HTMLElement) => {
            onSetSheetAttached();
            // this.mason.reloadMsnry();
            // this.mason.append(setsheet);
        });
        // on click search in the filter
        this.ea.subscribe("sets:search", (filter: Setfilter) => this.search(filter));
    }

    public isLoaded() {
		return this.db.isLoaded
    }

    attached() {
        console.log("sets attached grid: " + this.grid);
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

	public searching: boolean = true;
    
    /**
     * new search : clear current items and search for new
     */
    public async search(filter: Setfilter = null) {
		// this.searching = true;
        // console.log("on search: " + filter)
        this.mason.data = []; 
        this.mason.fulldata = [];
        this.mason.page = 0;

		this.filterData(filter);

        // need more content on sets
        this.mason.showMore(); 
        this.mason.showMore(); 
        this.mason.showMore(); 
        this.mason.showMore(); 
        // this.mason.showMore(); 
		// console.log("mason showed more")
		this.searching = false;
    }

    public async showMore() {
        this.mason.showMore();
    }

    public filterData(filter: Setfilter) {
		let arr: DofusSet[] = this.db.data.jsonItemSets
            .map(set => {
                if(!set.itemsData)
                    set.itemsData = [];
                if(set.itemsData?.length == 0) {
                    let items = set.items.map(i => this.db.data.jsonItemsById[i]).filter(i => i != null);
                    set.itemsData = items;
                }
                // console.log(set)
                return set;
            })
            .filter((value, index, array) => value.effects.length > 0)
            .sort((a, b) => {
                let diff = this.highestItemLevel(b) - this.highestItemLevel(a);
                if(diff != 0) return diff;
                else return b.id - a.id;
            });
        this.mason.fulldata.push(...arr);
        // console.log("Sets filter: ");
        // console.log(arr);
    }

    public highestItemLevel(set: DofusSet) {
        if(!set.itemsData) 
            return 0;
        let levels: number[] = set.itemsData.map(i => i.level)
        let max = Math.max(...levels);
        // console.log("Max set item level: " + max)
        return max;
    }

    public async toggleComparing() {
        this.comparing = !this.comparing;
    }

}
