import mapsJson from './maps.json'

export class Map {

    public mapsData = mapsJson;

    // 2 rows of 14 at a time, offset by a diagonal
    public width = 14;
    //
    public height = 20;

    public get generateMap() {
        let html = "";
        html += this.generateFloor();
        html += this.generateBlocks();
        return html;
    }

    public generateFloor() {
        let html = "";
        for(let j = 0; j < this.width; j++) {
            for(let i = 0; i < this.width; i++) {
                html += "<polygon class=\"base\" points=\""+i * 20+",0 250,190 160,210\"></polygon>";
            }
        }
        return html;
    }
    public generateBlocks() {
        let html = "";
        for(let j = 0; j < this.width; j++) {
            for(let i = 0; i < this.width; i++) {
                html += "<polygon class=\"base\" points=\""+i * 20+",0 250,190 160,210\"></polygon>";
            }
        }
        return html;
    }


}