import { Characteristics } from './characteristics';
import { Db, Collection, Cursor } from 'zangodb';
import * as Realm from "realm-web";
import { DI, IEventAggregator, inject, Registration } from 'aurelia';
import { db } from '../DofusDB/db';
import { Util } from './util';

@inject(db)
export class Emerald {

	public zdb: Db;

	private _items: any[]
	private _itemTypes: any[]
	private _itemSets: any[]
	public effects: any[]
	public characteristics: any[]

	constructor(readonly db: db, @IEventAggregator readonly ea: IEventAggregator) {
		this.loadup();
	}

	private async loadup() {
		this.zdb = new Db("encyclofus-" + this.db.version, 2, {
			items: { id: true },
			itemsets: { id: true },
			itemtypes: { id: true },
			effects: { id: true },
			characteristics: { id: true }
		});
			this._items = await this.getFromZango("items")
			this.ea.publish("emerald:loaded:items");
			this._itemTypes = await this.getFromZango("itemtypes")
			this.ea.publish("emerald:loaded:itemtypes");
			this._itemSets = await this.getFromZango("itemsets")
			this.ea.publish("emerald:loadeditemsets:");
			this.effects = await this.getFromZango("effects")
			this.ea.publish("emerald:loaded:effects");
			this.characteristics = await this.getFromZango("characteristics")
			this.ea.publish("emerald:loaded:characteristics");
		this.ea.publish("emerald:loaded");
	}
	
	public get items() {
		return this._items
	}
	public get itemTypes() {
		return this._itemTypes
	}
	public get itemSets() {
		return this._itemSets
	}

	public get collectionItems() {
		return this.zdb.collection("items")
	}
	public get collectionItemTypes() {
		return this.zdb.collection("itemtypes")
	}
	public get collectionItemSets() {
		return this.zdb.collection("itemsets")
	}

	private async getFromZango(name) {
		let arr: Object[];
		try {
			arr = await this.zdb.collection(name).find({}).toArray();
		} catch (error) {
			console.error(error);
		}
		if (!arr || arr.length == 0) {
			await db.fetchJson(this.db.gitFolderPath + name + ".json", (json) => {
				arr = json;
				for(let i of json) {
					if(i.nameId) {
						i["namefr"] = this.db.data.jsonI18n_fr[i.nameId];
						i["nameen"] = this.db.data.jsonI18n_en[i.nameId];
					}
				}
				console.log("got arr from db fetch")
				this.zdb.collection(name).insert(json);
			})
		}
		return arr;
	}

}


const container = DI.createContainer();
container.register(
	Registration.singleton(Emerald, Emerald)
);
