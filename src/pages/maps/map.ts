import { bindable, IEventAggregator, inject, observable } from 'aurelia';
import { watch } from '@aurelia/runtime-html';
import { Board, posVIP1, posVIP2, posVIP3, Vector2 } from '../../DofusDB/formulas';
import { db } from '../../DofusDB/db';
import map_ids from '../../DofusDB/scraped/common/mapIds.json'
// import { MapTools } from '../../DofusDB/formulas2';
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

@inject(db, IEventAggregator)
export class Map {

    public svg: SVGSVGElement;
    public groupFloor: SVGGElement;

    public board: Board;

    public mapId: string = String(map_ids.goultar3v3[0]);
    public mapLoaded = false;

    public constructor(readonly db: db, readonly ea: IEventAggregator) {
        ea.subscribe("db:loadmap", e => {
            // console.log("map db:loadmap")
            if (!this.initDone) {
                this.init();
            } else {
                let map = this.db.jsonMaps[this.mapId]
                this.board.cells = map.cells;
                this.generateMap();
            }
        });
        ea.subscribe("db:loaded", e => {
            // console.log("map db:loaded")
            this.init();
        });
        ea.subscribe("map:setid", e => {
            // console.log("map setid " + e);
            this.mapId = e as string;
            if (!this.db.jsonMaps[this.mapId]) {
                this.db.loadMap(this.mapId);
            } else {
                // this.init();
                let map = this.db.jsonMaps[this.mapId]
                this.board.cells = map.cells;
                this.generateMap();
            }
        })
        // console.log("map ctor")
    }

    public get mapName() {
        return this.db.getI18n("map_" + this.mapId);
    }

    public initDone: boolean;
    public init() {
        if (this.initDone) return "";
        if (!this.groupFloor) return "";
        // console.log("maps: " + JSON.stringify(this.db.jsonMaps))
        if (!this.db.jsonMaps || !this.db.jsonMaps[this.mapId]) {
            this.db.loadMap(this.mapId);
            return "";
        }
        // console.log("map init " + this.mapId)
        // this.initDone = false;
        if (this.groupFloor) this.groupFloor.innerHTML = "";
        this.board = new Board();
        // this.generateFloor()
        // this.generateHoles()
        // this.generateObjects()
        // this.generateBlocks()

        let map = this.db.jsonMaps[this.mapId]
        this.board.cells = map.cells;
        // console.log("init map: " + JSON.stringify(map))

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
        // console.log("load: " + this.mapId)
    }

    public placeObject(id) {
        this.board.objects[id] = !this.board.objects[id];
        let coord = JSON.stringify(this.board.getCellCoordById(id))
        let pos = JSON.stringify(this.board.getPos(id))
        // console.log("object at id " + id + ": " + this.board.objects[id] + ", pos: " + pos + ", coord: " + coord)

        this.generateMap();
    }

    public placeTarget(id0) {
        console.log("placeTarget " + id0)
        // let id1 = posVIP3;
        // let coord0 = this.board.getCaseCoordonnee(id0)
        // let coord1 = this.board.getCaseCoordonnee(id1)
        // let id0a = this.board.getCaseNum(coord0.x, coord0.y)
        // let id1a = this.board.getCaseNum(coord1.x, coord1.y)
        // console.log("pos vec: p0: " + JSON.stringify(this.board.getPos(id0)) + ", p1:" + JSON.stringify(this.board.getPos(id1)) + ", " + id0 + ", " + id1)
        // console.log("pos coord: p0: " + JSON.stringify(coord0) + ", p1: " + JSON.stringify(coord1) + ", " + id0a + ", " + id1a)

        if (this.board.target == id0) {
            this.board.target = -1;
        } else {
            this.board.target = id0;
        }
        this.generateMap();
    }

    public resetObjects() {
        this.board.objects.length = 0
        this.generateMap();
    }

    public generateMap() {
        // console.log("generateMap")
        // console.log("children 2: " + this.groupFloor.children.length)

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

            // placed object blocks
            if (this.board.objects[id]) {
                classes += "object "
                this.getPolygonBlock(id, o1, classes);
            } else
                // natural blocks
                if (!cell.los) {
                    classes += "block "
                    this.getPolygonBlock(id, o1, classes);
                }
                // floor
                else {
                    let inlos = false;
                    // highlight los from target
                    if (this.board.target != -1) {
                        inlos = this.board.checkView(this.board.target, id);
                    }
                    // hole
                    if (!cell.mov && cell.los)
                        classes += "hole "
                    else
                        // target
                        if (this.board.target == id) {
                            // console.log("set class target " + id)
                            classes += "target "
                        } else
                            if (inlos) classes += "highlight "
                            else
                                // blue start
                                if (cell.blue) classes += "blue "
                                else
                                    // red start
                                    if (cell.red) classes += "red "
                                    // normal cell
                                    else classes += "floor "

                    // make polygon
                    this.getPolygon(id, o1, classes)
                }
        }
        this.mapLoaded = true;
        // console.log("children 1: " + this.groupFloor.children.length)
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
            if (!classes.includes("hole"))
                this.placeTarget(id);
        };
        p.oncontextmenu = (e) => {
            e.preventDefault();
            if (!classes.includes("hole"))
                this.placeObject(id);
        };
        let points = "";
        points += p1.x + "," + p1.y + " "
        points += p2.x + "," + p2.y + " "
        points += p3.x + "," + p3.y + " "
        points += p4.x + "," + p4.y
        p.setAttribute("points", points)

        var g = document.createElementNS("http://www.w3.org/2000/svg", "g");
        g.appendChild(p);
        
        if(this.board.target != -1 && classes.includes("highlight")) {
            let pos0 = this.board.getCellCoordById(id) 
            let pos1 = this.board.getCellCoordById(this.board.target)
            let dist = Math.abs(pos0.x - pos1.x) + Math.abs(pos0.y - pos1.y);
            let text: SVGTextElement = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.textContent = dist + "";
            let dx = dist >= 10 ? 7 : 3;
            text.setAttribute("x", (p2.x - dx) + "");
            text.setAttribute("y", (p2.y + segmentLength / 2 + 3) + "");
            // p.appendChild(text);
            g.appendChild(text);
        }

        // this.groupFloor.appendChild(p)
        if (this.initDone) {
            let old = this.groupFloor.children.item(id)
            // old.replaceWith(p);
            old.replaceWith(g)
        } else {
            // this.groupFloor.appendChild(p);
            this.groupFloor.appendChild(g);
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
            if (classes.includes("object"))
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

        if (this.initDone) {
            let old = this.groupFloor.childNodes.item(id)
            // this.groupFloor.replaceChild(g, old);
            old.replaceWith(g);
        } else {
            this.groupFloor.appendChild(g);
        }
    }

}
