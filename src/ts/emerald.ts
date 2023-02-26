import { Db, Collection, Cursor } from 'zangodb';
import * as Realm from "realm-web";
import { DI, IEventAggregator, inject, Registration } from 'aurelia';
import { db } from '../DofusDB/db';
import { Util } from './util';
import jsonFeatures from '../DofusDB/features.json';


@inject(db)
export class Emerald {

	private _items: Object[]
	private _itemTypes: Object[]
	private _itemSets: Object[]
	public effects: any[]
	public characteristics: any[]

	public zdb: Db;
	// public static encyclofus: Collection;

	public app: Realm.App;
	public user: Realm.User;

	constructor(readonly db: db, @IEventAggregator readonly ea: IEventAggregator) {
		// Emerald.encyclofus = Emerald.zango.collection("encyclofus");
		let APP_ID = "data-ewvjc";
		this.app = new Realm.App({ id: APP_ID });
		// ea.subscribe("db:loaded", async () => {
		// });
		this.loadup();
	}

	private async loadup() {
		// console.log("loadup0")
		this.zdb = new Db(this.db.version);
		if(this.db.checkFeatureVersion(jsonFeatures.items) && Util.isLocal()) {
			this._items = await this.getFromZango("items")
			this._itemTypes = await this.getFromZango("itemtypes")
			this._itemSets = await this.getFromZango("itemsets")
			this.effects = await this.getFromZango("effects")
			this.characteristics = await this.getFromZango("characteristics")
		}
		// console.log("loadup1")
		this.ea.publish("emerald:loaded");
	}

	private async login() {
		const credentials = Realm.Credentials.anonymous();
		// Authenticate the user
		this.user = await this.app.logIn(credentials);
		// `App.currentUser` updates to match the logged in user
		console.assert(this.user.id === this.app.currentUser.id);
	}

	public asdf() {
		this.user.mongoClient("myClusterName").db("encyclofus");
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

		}
		if (!arr || arr.length == 0) {
			await this.db.fetchJson(this.db.gitFolderPath + name + ".json", (json) => {
				arr = json;
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
