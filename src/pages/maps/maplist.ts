import map_ids from '../../DofusDB/scraped/common/maps_kolo_ids.json'
// import mapsJson from './maps.json'
// import fs from 'fs'
import { bindable, IEventAggregator, inject } from 'aurelia';
import { db } from '../../DofusDB/db';

@inject(db)
export class MapList {

    public mapIds = map_ids;

    public selectedId: string = "77336069";

    // public mapsData = mapsJson;

    public db: db;

    public constructor(db: db, @IEventAggregator readonly ea: IEventAggregator) {
        this.db = db;
    }


    public select(mapid: string): void {
        this.selectedId = mapid;
        console.log("id: " + this.selectedId)
        this.ea.publish("map:setid", this.selectedId)
    }

    public getMapName(mapid) {
        return this.db.getI18n("map_" + mapid);
    }


}
