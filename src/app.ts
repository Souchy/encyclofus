import 'bootstrap'; // Import the Javascript
import 'bootstrap/dist/css/bootstrap.css'; // Import the CSS
import '@fortawesome/fontawesome-free';
import '@fortawesome/fontawesome-free/css/all.css';

import { inject, IEventAggregator } from 'aurelia';
import { Route, IRoute, IRouter, IRouteableComponent, RouterConfiguration, ReloadBehavior, Navigation } from '@aurelia/router';

import { db } from './DofusDB/db';
import jsonClasses from './DofusDB/static/classes.json'
import { sidebar } from './components/sidebar';

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
		}
	];

	// collapsing sidebar reference
	private collapseSidebar: HTMLElement;

    constructor(@IEventAggregator readonly ea: IEventAggregator, db: db) {
		// load data the first time
		db.loadJson();

		// set routes
		for (let b of jsonClasses.orderByIcon) {
			App.routes.push({
				path: b,
				component: import('./pages/breed'),
				title: jsonClasses.french[jsonClasses.ids[b] - 1],
				reloadBehavior: ReloadBehavior.refresh,
			});
		}
		
		// collapse the sidebar when navigating to a new page
        this.ea.subscribe('au:router:navigation-start', (asdf: any) => {
            // Do stuff inside of this callback
			this.collapseSidebar.classList.remove("show")
			// console.log("app start: " + JSON.stringify(asdf.navigation.instruction))
			// let ele = document.getElementsByTagName("title").item(0);
			// ele.innerHTML = "Encyclofus"
        });
		
        this.ea.subscribe('au:router:navigation-end', (asdf: any) => {
			let basicName = asdf.navigation.instruction;
			if(db.jsonBreeds) {
				let breed = db.jsonBreeds[jsonClasses.ids[basicName]]
				let name = db.getI18n(breed.nameId);
				// console.log("app nav: " + JSON.stringify(asdf.navigation.instruction))
				let ele = document.getElementsByTagName("title").item(0);
				ele.innerHTML = name + " | Encyclofus"
			}
        });
	}

}
