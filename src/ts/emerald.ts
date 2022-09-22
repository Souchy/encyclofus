import { Db, Collection, Cursor} from 'zangodb';

export class Emerald {

	public static zango = new Db('souchy.github.io'); 
	public static encyclofus: Collection;

	private constructor() {
		Emerald.encyclofus = Emerald.zango.collection("encyclofus");
	}
	
}

