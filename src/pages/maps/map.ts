import { bindable, IEventAggregator, inject, observable } from 'aurelia';
import { watch } from '@aurelia/runtime-html';
import { Board } from '../../DofusDB/formulas';
import { db } from '../../DofusDB/db';
// import jsonMap from '../../DofusDB/scraped/common/map_kolo/113508877.json'
// import jsonMap from '../../DofusDB/scraped/common/134484992.json'
// import fs from 'fs'
// import fs from 'fs';

// 2 rows of 14 at a time, offset by a diagonal
const mapWidth = 14;
// 20 rows times 2
const mapHeight = 20;
// length of a segment on a cell
const segmentLength = 40;
// square width of a cell
const u = 2 * Math.sin(60 * Math.PI / 180) * segmentLength;
// square height of a cell
const v = 2 * Math.sin(30 * Math.PI / 180) * segmentLength;
// height of a block
const w = 15;

@inject(db)
export class Map {

    // public mapsData = mapsJson;
    public db: db;

    public svg: SVGSVGElement;
    public groupFloor: SVGGElement;
    // public groupHoles: SVGGElement;
    // public groupBlocks: SVGGElement;
    // public groupObjects: SVGGElement;

    // public objects: { i: number, j: number, k: number }[] = []
    // public target = { i: 0, j: 0, k: 0 }
    public board: Board;

    @bindable
    public mapId: string;

    public constructor(db: db, @IEventAggregator readonly ea: IEventAggregator) {
        this.db = db;
        ea.subscribe("db:loadmap", e => {
            console.log("map db:loadmap")
            this.init();
        });
        ea.subscribe("db:loaded", e => {
            console.log("map db:loaded")
            this.init();
        });
        ea.subscribe("map:setid", e => {
            console.log("map setid " + e);
            this.mapId = e as string;
            this.init();
        })
    }

    public initDone: boolean;
    public init() {
        console.log("map init")
        // console.log("maps: " + JSON.stringify(this.db.jsonMaps))
        if(!this.db.jsonMaps || !this.db.jsonMaps[this.mapId]) {
            this.db.loadMap(this.mapId);
            return;
        }
        this.initDone = false;
        // this.generateFloor()
        // this.generateHoles()
        // this.generateObjects()
        // this.generateBlocks()
        this.board = new Board();

        let map = this.db.jsonMaps[this.mapId]
        this.board.cells = map.cells;

        this.generateMap();
        this.initDone = true;
        return "";
    }

    // public get data() {
    //     return this.mapsData[this.id];
    // }
    public load() {
        // fs.readFileSync("")
        // let map = this.db.jsonMaps[this.id];
        console.log("load: " + this.mapId)
    }

    public placeObject(id) {
        this.board.objects[id] = !this.board.objects[id];
        console.log("object at id " + id + ": " + this.board.objects[id])
        this.generateMap();
    }

    public placeTarget(id) {
        this.board.target = id;
        this.generateMap();
    }

    public resetObjects() {
        this.board.objects.length = 0
        this.generateMap();
    }

    public generateMap() {
        this.groupFloor.innerHTML = "";
        for (let id = 0; id < this.board.cells.length; id++) {
            let cell = this.board.cells[id];
            let x = this.board.getX(id);
            let y = this.board.getY(id);
            let j = Math.floor(y / 2)
            let k = y % 2;
            let o1 = { 
                i: x, 
                j: j, 
                k: k 
            };

            let classes = "k" + k + " "

            if(this.board.target != -1) {
                let inlos = this.board.checkViewById(this.board.target, id);
                if(inlos) classes += "highlight ";
            }
            if(this.board.target == id) {
                classes += "target "
            }
            if(this.board.objects[id]) {
                classes += "object "
                this.getPolygonBlock(id, o1, classes);
            } else
            if(!cell.los) {
                classes += "block "
                this.getPolygonBlock(id, o1, classes);
            } else {
                if(cell.blue) classes += "blue "
                else if(cell.red) classes += "red "
                else if(!cell.mov && cell.los) classes += "hole "
                else classes += "floor "
                this.getPolygon(id, o1, classes)
            }

        }
    }

    public getPolygon(id, o, classes: string) {
        let x0 = o.i * u
        let y0 = o.j * v
        let p1 = { x: x0 + o.k * u / 2, y: y0 + v / 2 + o.k * v / 2 }
        let p2 = { x: x0 + u / 2 + o.k * u / 2, y: y0 + o.k * v / 2 }
        let p3 = { x: x0 + u + o.k * u / 2, y: y0 + v / 2 + o.k * v / 2 }
        let p4 = { x: x0 + u / 2 + o.k * u / 2, y: y0 + v + o.k * v / 2 }
        let p: SVGPolygonElement = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
        
        for (let c of classes.split(" ")) {
            if (c) p.classList.add(c)
        }
        p.onclick = (e) => {
            this.placeTarget(id);
        };
        p.oncontextmenu = (e) => {
            e.preventDefault();
            if(!classes.includes("hole"))
                this.placeObject(id);
        };
        let points = "";
        points += p1.x + "," + p1.y + " "
        points += p2.x + "," + p2.y + " "
        points += p3.x + "," + p3.y + " "
        points += p4.x + "," + p4.y
        p.setAttribute("points", points)
        
        // this.groupFloor.appendChild(p)
        if(this.initDone) { 
            let old =  this.groupFloor.childNodes.item(id)
            // this.groupFloor.replaceChild(p, old);
            old.replaceWith(p);
        } else {
            this.groupFloor.appendChild(p);
        }
    }

    public getPolygonBlock(id, o, classes) {
        let x0 = o.i * u
        let y0 = o.j * v
        let p1 = { x: x0 + o.k * u / 2, y: y0 + v / 2 + o.k * v / 2 - w }
        let p2 = { x: x0 + u / 2 + o.k * u / 2, y: y0 + o.k * v / 2 - w }
        let p3 = { x: x0 + u + o.k * u / 2, y: y0 + v / 2 + o.k * v / 2 - w }
        let p4 = { x: x0 + u / 2 + o.k * u / 2, y: y0 + v + o.k * v / 2 - w }
        let p5 = { x: p1.x, y: p1.y + w }
        let p6 = { x: p4.x, y: p4.y + w }
        let p7 = { x: p3.x, y: p3.y + w }

        let top: SVGPolygonElement = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
        let left: SVGPolygonElement = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
        let right: SVGPolygonElement = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
        
        for (let c of classes.split(" ")) {
            if (c) top.classList.add(c)
            if (c) left.classList.add(c)
            if (c) right.classList.add(c)
        }

        let func = (e) => {
            e.preventDefault();
            if(classes.includes("object"))
                this.placeObject(id);
        };

        top.oncontextmenu = func;
        right.oncontextmenu = func;
        left.oncontextmenu = func;

        let points = "";
        points += p1.x + "," + p1.y + " "
        points += p2.x + "," + p2.y + " "
        points += p3.x + "," + p3.y + " "
        points += p4.x + "," + p4.y + " "
        top.setAttribute("points", points)

        points = p6.x + "," + p6.y + " "
        points += p5.x + "," + p5.y + " "
        points += p1.x + "," + p1.y + " "
        points += p4.x + "," + p4.y + " "
        left.setAttribute("points", points)

        points = p6.x + "," + p6.y + " "
        points += p7.x + "," + p7.y + " "
        points += p3.x + "," + p3.y + " "
        points += p4.x + "," + p4.y + " "
        right.setAttribute("points", points)

        // this.groupFloor.appendChild(top)
        // this.groupFloor.appendChild(left)
        // this.groupFloor.appendChild(right)

        var g = document.createElementNS("http://www.w3.org/2000/svg", "g");
        g.appendChild(top)
        g.appendChild(left)
        g.appendChild(right)

        if(this.initDone) { 
            let old =  this.groupFloor.childNodes.item(id)
            // this.groupFloor.replaceChild(g, old);
            old.replaceWith(g);
        } else {
            this.groupFloor.appendChild(g);
        }
    }

}
