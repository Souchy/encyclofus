import map_ids from '../../DofusDB/scraped/common/mapIds.json'
// import mapsJson from './maps.json'
// import fs from 'fs'
import { bindable, IEventAggregator, inject } from 'aurelia';
import { db } from '../../DofusDB/db';

@inject(db)
export class MapList {

    public mapIds = map_ids;
    public goultars = map_ids.goultar.sort();
    public tournois = map_ids.tournoi.sort();
    public duels = map_ids.duel.sort();
    public db: db;

    public showGoultar = true;
    public showTournoi = false;
    public showDuel = false;
    public showHelp = false;

    public constructor(db: db, @IEventAggregator readonly ea: IEventAggregator) {
        this.db = db;
    }

    public select(mapid: string): void {
        // console.log("id: " + mapid)
        this.ea.publish("map:setid", mapid)
    }

    public getMapName(mapid) {
        let spaces = this.db.getI18n("map_" + mapid).split(" ");
        return spaces[spaces.length - 1];
    }

    public clickGoultar() {
        // console.log("click goulta")
        this.showGoultar = true;
        this.showTournoi = false;
        this.showDuel = false;
        this.showHelp = false;
    }
    public clickTournoi() {
        // console.log("click tournoi")
        this.showGoultar = false;
        this.showTournoi = true;
        this.showDuel = false;
        this.showHelp = false;
    }
    public clickDuel() {
        // console.log("click duel")
        this.showGoultar = false;
        this.showTournoi = false;
        this.showDuel = true;
        this.showHelp = false;
    }
    public clickHelp() {
        this.showHelp = !this.showHelp;
    }


}
