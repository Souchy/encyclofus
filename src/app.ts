import 'bootstrap'; // Import the Javascript
import 'bootstrap/dist/css/bootstrap.css'; // Import the CSS
import '@fortawesome/fontawesome-free';
import '@fortawesome/fontawesome-free/css/all.css';

import { inject, IEventAggregator } from 'aurelia';
import { Route, IRoute, IRouter, IRouteableComponent, RouterConfiguration, ReloadBehavior } from '@aurelia/router';

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
        this.ea.subscribe('au:router:navigation-start', (asfd) => {
            // Do stuff inside of this callback
			this.collapseSidebar.classList.remove("show")
        });
	}

}
