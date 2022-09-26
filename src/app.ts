import 'bootstrap'; // Import the Javascript
import 'bootstrap/dist/css/bootstrap.css'; // Import the CSS

import { inject } from 'aurelia';
import { Route, IRoute, IRouter, IRouteableComponent, RouterConfiguration, ReloadBehavior } from '@aurelia/router';

import { db } from './DofusDB/db';
import jsonClasses from './DofusDB/static/classes.json'

@inject(db)
export class App {
	
	// Important routing
	static routes: IRoute[] = [];

	constructor(db: db) {
		// load data the first time
		db.loadJson();
		
		// set routes
		for(let b of jsonClasses.orderByIcon) {
			App.routes.push({
				path: b,
				component: import('./pages/breed'),
				title: jsonClasses.french[jsonClasses.ids[b] - 1],
				reloadBehavior: ReloadBehavior.refresh,
			});
		}
	}

}
