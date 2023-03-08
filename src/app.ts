import 'bootstrap'; // Import the Javascript
import 'bootstrap/dist/css/bootstrap.css'; // Import the CSS
import '@fortawesome/fontawesome-free';
import '@fortawesome/fontawesome-free/css/all.css';

import { inject, IEventAggregator } from 'aurelia';
import { Route, IRoute, IRouter, IRouteableComponent, RouterConfiguration, ReloadBehavior, Navigation } from '@aurelia/router';
import { Parameters, RoutingInstruction } from '@aurelia/router';

import { db } from './DofusDB/db';
import { sidebar } from './components/sidebar'
import jsonBreeds from './DofusDB/static/classes.json'
import features from './DofusDB/features.json'
import { Util } from './ts/util';

@inject(IEventAggregator, db)
export class App {

	// Important routing
	static routes: IRoute[] = [
		{
			path: "",
			redirectTo: "feca"
		},
		// {
		// 	path: "commun",
		// 	component: import('./pages/breed'),
		// 	title: "Sorts communs",
		// 	reloadBehavior: ReloadBehavior.refresh,
		// },
		{
			path: "resources",
			component: import('./pages/resources')
		},
		{
			path: "tournaments",
			component: import('./pages/tournaments')
		},
		{
			path: "general",
			component: import("./info/general"),
		},
		{
			path: "formules",
			component: import("./info/formules"),
		},
		{
			path: "map",
			component: import("./pages/maps/map"),
		},
		{
			path: "maps",
			component: import("./pages/maps/maplist"),
		},
		{
			path: "changelog",
			component: import("./pages/changelog/changelog"),
		},
	];

	// collapsing sidebar reference
	private collapseSidebar: HTMLElement;
	private db: db;
    constructor(@IEventAggregator readonly ea: IEventAggregator, db: db) {
		this.db = db;
		// load data the first time
		if(!this.db.isLoaded) {
			// console.log("app loading db")
			this.db.data.loadJson();
		} else {
			// console.log("app already loaded db")
		}

		// set routes
		for (let breedName of jsonBreeds.orderByIcon) {
			if(this.db.checkFeature(breedName))
				App.routes.push({
					path: breedName,
					component: import('./pages/breed'),
					title: jsonBreeds.french[jsonBreeds.ids[breedName] - 1],
					reloadBehavior: ReloadBehavior.refresh,
				});
		}
		if(this.db.checkFeatureVersion(features.items)) {
			App.routes.push({
				path: 'items',
				component: import('./pages/quickfus/items/items'),
				title: "Items",
				reloadBehavior: ReloadBehavior.refresh,
			});
		}

		// App.routes.push({
		// 	path: "general",
		// 	component: import("./info/general.md"),
		// 	title: "Général",
		// 	reloadBehavior: ReloadBehavior.refresh,
		// });
		
		this.ea.subscribe("db:loaded", () => {
			if(this.db.breedId > 0) {
				let breed = db.data.jsonBreeds[this.db.breedId]
				let name = db.getI18n(breed.nameId);
				let ele = document.getElementsByTagName("title").item(0);
				ele.innerHTML = name + " | Encyclofus"

				// location.reload();
				// jsonBreeds.orderById[this.db.breedId - 1];
				// window.location.href = ""
			}
		});

		// collapse the sidebar when navigating to a new page
        this.ea.subscribe('au:router:navigation-start', (asdf: any) => {
            // Do stuff inside of this callback
			this.collapseSidebar.classList.remove("show")
			// console.log("nav start: " + JSON.stringify(asdf.navigation.instruction))
			// let ele = document.getElementsByTagName("title").item(0);
			// ele.innerHTML = "Encyclofus"
        });
		
        this.ea.subscribe('au:router:navigation-end', (asdf: any) => {
			let basicName = asdf.navigation.instruction as string;
			basicName = basicName.replace("/", "")
			if(!basicName || basicName == "/") {
				basicName = "feca";
			}
			// console.log("nav end: " + this.db.jsonBreeds + ", " + Object.keys(jsonBreeds.ids).includes(basicName) + ", " + asdf.navigation.instruction + " in? " + Object.keys(jsonBreeds.ids) + "")
			if(Object.keys(jsonBreeds.ids).includes(basicName)) {
				this.db.breedId = jsonBreeds.ids[basicName];
				if(this.db.data.jsonBreeds) {
					let breed = db.data.jsonBreeds[this.db.breedId]
					let name = db.getI18n(breed.nameId);
					// console.log("app nav: " + JSON.stringify(asdf.navigation.instruction))
					let ele = document.getElementsByTagName("title").item(0);
					ele.innerHTML = name + " | Encyclofus"
				}
			} else {
				this.db.breedId = 0;
			}
			// console.log("event breedid " + this.db.breedId)
        });
	}

	
    // loading(params: Parameters, instruction: RoutingInstruction, navigation: Navigation) {
	// 	console.log("app1 load route: " + JSON.stringify(navigation.instruction))
	// 	console.log("app1 load route: " + JSON.stringify(instruction.route.match.id))
    // }
	// load(parameters: Parameters, instruction: RoutingInstruction, navigation: Navigation): void | Promise<void> {
	// 	console.log("app load route: " + JSON.stringify(navigation.instruction))
	// 	console.log("app load route: " + JSON.stringify(instruction.route.match.id))
	// 	let basicname = instruction.route.match.id;
	// 	if(Object.keys(jsonBreeds.ids).includes(basicname)) {
	// 		this.db.breedId = jsonBreeds.ids[basicname];
	// 	} else {
	// 		this.db.breedId = 0;
	// 	}
	// 	console.log("breed: " + this.db.breedId);
	// }

}
