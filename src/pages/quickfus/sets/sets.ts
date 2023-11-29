import { IEventAggregator, inject } from "aurelia";
import { pipeline } from "stream";
import { db } from "../../../DofusDB/db";
import { Mason, util } from "../util";
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


    public constructor(readonly db: db, @IEventAggregator readonly ea: IEventAggregator) {
		console.log("sets ctor")
        this.mason = new Mason();

        let onSetSheetAttached = util.debounce(() => {
            this.mason.reloadMsnry();
        }, 200, false);
        // on sheet attached
        this.ea.subscribe("setsheet:loaded", () => {
           onSetSheetAttached();
        });
        // on click search in the filter
        // this.ea.subscribe("sets:search", (filter: Filter) => this.search(filter));
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
    public async search() { //filter: Filter = null) {
		// this.searching = true;
        // console.log("on search: " + filter)
        this.mason.data = []; 
        this.mason.fulldata = [];
        this.mason.page = 0;

		this.filterData(); //filter);
        this.mason.showMore(); 
		// console.log("mason showed more")
		this.searching = false;
    }

    public filterData() { //filter: Filter) {
		let arr = this.db.data.jsonItemSets;
        this.mason.fulldata.push(...arr);
    }


}