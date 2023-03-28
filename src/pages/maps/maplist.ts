import map_ids from '../../DofusDB/scraped/common/mapIds.json'
// import mapsJson from './maps.json'
// import fs from 'fs'
import { bindable, IEventAggregator, inject } from 'aurelia';
import { db } from '../../DofusDB/db';

export class MapList {

    public isLoaded: boolean = false
    
    public mapIds = map_ids;
    public goultars: number[]
    public tournois: number[]
    public duels: number[]
    public amaknas: number[]

    public showGoultar = true;
    public showTournoi = false;
    public showDuel = false;
    public showAmakna = false;
    public showHelp = false;

    public constructor(private readonly db: db, @IEventAggregator readonly ea: IEventAggregator) {
        if(this.db.isLoaded) {
            this.onLoad();
        } else
            ea.subscribe("db:loaded", () => this.onLoad());
    }


    private onLoad() {
        this.goultars = map_ids.goultar.sort((a, b) => this.sortMaps(a, b));
        this.tournois = map_ids.tournoi.sort((a, b) => this.sortMaps(a, b));
        this.duels = map_ids.duel.sort((a, b) => this.sortMaps(a, b));
        this.amaknas = map_ids.amakna.sort((a, b) => this.sortMaps(a, b))
        this.isLoaded = true;
    }

    private sortMaps(id0: number, id1: number) {
        let name0 = this.getMapName(id0)
        let name1 = this.getMapName(id1)
        let i0 = this.toNumberAndRoman(name0)
        let i1 = this.toNumberAndRoman(name1)
        // console.log("sort: " + i0 + ", " + i1)
        return i0 - i1
        // return name0.localeCompare(name1);
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

    public select(mapid: string): void {
        // console.log("id: " + mapid)
        this.ea.publish("map:setid", mapid)
    }

    public getMapName(mapid: number) {
        try {
            // console.log("mapid: " + mapid)
            if(this.db.hasI18n("map_" + mapid)) {
                let spaces = this.db.getI18n("map_" + mapid).split(" ");
                let remaining = spaces[spaces.length - 1];
                return remaining;
            } else {
                return mapid + "";
            }
        } catch(error) {
            return mapid + "";
        }
    }

    public clickGoultar() {
        // console.log("click goulta")
        this.showGoultar = true;
        this.showTournoi = false;
        this.showDuel = false;
        this.showAmakna = false;
        this.showHelp = false;
    }
    public clickTournoi() {
        // console.log("click tournoi")
        this.showGoultar = false;
        this.showTournoi = true;
        this.showDuel = false;
        this.showAmakna = false;
        this.showHelp = false;
    }
    public clickDuel() {
        // console.log("click duel")
        this.showGoultar = false;
        this.showTournoi = false;
        this.showDuel = true;
        this.showAmakna = false;
        this.showHelp = false;
    }
    public clickAmakna() {
        // console.log("click amakna")
        this.showGoultar = false;
        this.showTournoi = false;
        this.showDuel = false;
        this.showAmakna = true;
        this.showHelp = false;
    }
    public clickHelp() {
        this.showHelp = !this.showHelp;
    }


}
