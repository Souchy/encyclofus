import 'bootstrap'; // Import the Javascript
import 'bootstrap/dist/css/bootstrap.css'; // Import the CSS

import { HttpClient } from '@aurelia/fetch-client';
import { db } from './DofusDB/db';

import jsonSpells from './DofusDB/scraped/2.64/fr/spells.json'
import * as jsonSpellsDetails from './DofusDB/scraped/2.64/fr/spellsDetails.json'


export class App {

    // static routes = [
    //     {
    //         path: '/believe',
    //         component: WelcomePage,
    //         title: 'Home'
    //     },
    //     {
    //         path: '/about',
    //         component: AboutPage,
    //         title: 'About'
    //     },
    // ];

	public message = 'Hello World!';
	public static jsonMessage = "no data yet...";

	constructor() {
	}

	created() {
		// if(db.loadJson) { }
		db.loadJson = loadJson;
		db.loadJson();
		// console.log("premier sort cra: " + JSON.stringify(jsonSpells.cra));
	}

	public get jsonmsg() {
		return db.jsonSpells;
	}

}


// Create json loader
const http = new HttpClient();

const loadJson = async () => {
	let result = await loadSpells(db.getJsonFolderPath());
	if (!result) result = await loadSpells(db.getJsonFolderPathFallback());
	console.log("db loaded json spells: " + result);
	App.jsonMessage = JSON.stringify(db.jsonSpells);

	result = await loadSpellsDetails();
	if (!result) result = await loadSpellsDetails();
	console.log("db loaded json spells details: " + result);
}

const loadSpells = async (folderpath: string) => {
	return http.fetch(folderpath + db.jsonSpellsName)
		.then(response => response.status == 404 ? null : response.text())
		.then(data => {
			if(data == null) return false;
			db.jsonSpells = data;
			return true;
		}).catch(() => {
			return false;
		});
};

const loadSpellsDetails = async () => {
	return http.fetch(db.getJsonFolderPath() + db.jsonSpellsDetailsName)
	.then(response => response.status == 404 ? null : response.text())
		.then(data => {
			if(data == null) return false;
			db.jsonSpellsDetails = data;
			// console.log("hey loaded details data : " + JSON.stringify(data))
			return true;
		}).catch(() => {
			// console.log("hey catched details data")
			return false;
		});
};

