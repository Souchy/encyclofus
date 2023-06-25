import { watch } from '@aurelia/runtime-html';
import map_ids from '../../DofusDB/scraped/common/mapIds.json'
// import mapsJson from './maps.json'
// import fs from 'fs'
import { bindable, IEventAggregator, inject } from 'aurelia';
import { db } from '../../DofusDB/db';

@inject(db, IEventAggregator)
export class MapList {

    public isLoaded: boolean = false
    
    public mapIds = map_ids;
    public goultars3v3: number[]
    public goultars1v1: number[]
    public koli3v3s: number[]
    public koli1v1s: number[]

    public showGoultar3v3 = true;
    public showGoultar1v1 = false;
    public showKoli3v3 = false;
    public showKoli1v1 = false;
    public showHelp = false;

    public constructor(private readonly db: db, private readonly ea: IEventAggregator) {
        if(this.db.isLoaded) {
            this.onLoad();
        } else
            ea.subscribe("db:loaded", () => this.onLoad());
    }


    private onLoad() {
        this.goultars3v3 = map_ids.goultar3v3.sort((a, b) => this.sortMaps(a, b));
        this.goultars1v1 = map_ids.goultar1v1.sort((a, b) => this.sortMaps(a, b));
        this.koli3v3s = map_ids.koli3v3.sort((a, b) => this.sortMaps(a, b));
        this.koli1v1s = map_ids.koli1v1.sort((a, b) => this.sortMaps(a, b));
        // this.select(this.goultars3v3[0]);
        this.isLoaded = true;
    }

    private sortMaps(id0: number, id1: number): number {
        let name0 = this.getMapName(id0)
        let name1 = this.getMapName(id1)
        // let pop0 = name0.split(" ").pop()
        // let pop1 = name1.split(" ").pop()
        let i0 = this.getMapNumber(name0) || this.toNumberAndRoman(name0.split(" ").pop());
        let i1 = this.getMapNumber(name1) || this.toNumberAndRoman(name1.split(" ").pop()); 
        // let i0 = this.toNumberAndRoman(name0)
        // let i1 = this.toNumberAndRoman(name1)
        // console.log("sort: " + pop0 + " " + i0 + ", " + pop1 + " " + i1)
        return i0 - i1
        // return name0.localeCompare(name1);
    }

    private getMapNumber(mapName: string): number {
       return +mapName.substring(1).split(" ")[0];
    }

    public toNumberAndRoman(s) {
        if(+s) return +s;
        else {
            return this.romanToArabic(s);
        }
    }
    public romanToArabic(str) {
        const romans = {
            I: 1,
            V: 5,
            X: 10,
            L: 50,
            C: 100,
            D: 500,
            M: 1000,
        };
        return [...str.toUpperCase()].reduce(
            (previousValue, currentValue, currentIndex, array) =>
                romans[array[currentIndex + 1]] > romans[currentValue]
                    ? previousValue - romans[currentValue]
                    : previousValue + romans[currentValue],
            0
        );
    };

    public select(mapid: number): void {
        // console.log("id: " + mapid)
        this.ea.publish("map:setid", mapid)
    }

    public getMapName(mapid: number) {
        try {
            // console.log("mapid: " + mapid)
            if(this.db.hasI18n("map_" + mapid)) {
                let name = this.db.getI18n("map_" + mapid);
                return name;
                let spaces = name.split(" ");
                let remaining = spaces[spaces.length - 1];
                return remaining;
            } else {
                return mapid + "";
            }
        } catch(error) {
            return mapid + "";
        }
    }

    public clickGoultar3v3() {
        this.showGoultar3v3 = true;
        this.showGoultar1v1 = false;
        this.showKoli3v3 = false;
        this.showKoli1v1 = false;
        this.showHelp = false;
    }
    public clickGoultar1v1() {
        this.showGoultar3v3 = false;
        this.showGoultar1v1 = true;
        this.showKoli3v3 = false;
        this.showKoli1v1 = false;
        this.showHelp = false;
    }
    public clickKoli3v3() {
        this.showGoultar3v3 = false;
        this.showGoultar1v1 = false;
        this.showKoli3v3 = true;
        this.showKoli1v1 = false;
        this.showHelp = false;
    }
    public clickKoli1v1() {
        this.showGoultar3v3 = false;
        this.showGoultar1v1 = false;
        this.showKoli3v3 = false;
        this.showKoli1v1 = true;
        this.showHelp = false;
    }
    public clickHelp() {
        this.showHelp = !this.showHelp;
    }


}
