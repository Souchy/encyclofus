import { bindable, observable } from 'aurelia';
import mapsJson from './maps.json'
import { watch } from '@aurelia/runtime-html';

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

export class Map {

    public mapsData = mapsJson;

    public svg: SVGSVGElement;
    public groupFloor: SVGGElement;
    public groupHoles: SVGGElement;
    public groupBlocks: SVGGElement;
    public groupObjects: SVGGElement;

    public objects: { i: number, j: number, k: number }[] = []
    public target = { i: 0, j: 0, k: 0}

    @bindable
    public id = 0;

    public get data() {
        return this.mapsData[this.id];
    }

    public placeObject(i, j, k) {
        console.log("placeObject " + i + ", " + j + " " + k)
        let obj = { i: i, j: j, k: k };
        // let index = this.objects.indexOf(obj);

        let index = 0;
        for(let o of this.objects) {
            if(o.i == i && o.j == j && o.k == k) {
                break;
            }
            index++;
        }
        if(index >= this.objects.length) index = -1;
        
        if (index == -1) {
            this.objects.push(obj);
            console.log("push obj: " + obj)
        } else {
            this.objects.splice(index, 1);
            console.log("splice obj: " + obj)
        }
    }

    public placeTarget(i, j, k) {
        this.target.i = i;
        this.target.j = j;
        this.target.k = k;

    }

    public generateFloor() {
        let h = this.data.height; // mapHeight;
        let w = this.data.width; // mapWidth;
        for (let j = 0; j < h; j++) {
            for (let i = 0; i < w; i++) {
                for (let k = 0; k < 2; k++) {
                    let polygon = this.getPolygon({ i: i, j: j, k: k }, "k" + k)
                    this.groupFloor.appendChild(polygon)
                }
            }
        }
        return "";
    }

    public generateHoles() {
        this.groupHoles.innerHTML = "";
        for(let b of this.data.holes) {
            let polygon = this.getPolygon(b, "");
            this.groupHoles.appendChild(polygon)
        }
        return "";
    }

    public generateBlocks() {
        this.groupBlocks.innerHTML = "";
        for(let b of this.data.blocks) {
            this.getPolygonBlock(b, this.groupBlocks)
        }
        return "";
    }

    @watch('objects.length')
    public generateObjects() {
        console.log("generate objects")
        this.groupObjects.innerHTML = "";
        for (let o of this.objects) {
            // let polygon = this.getPolygon(o, "object")
            // this.groupObjects.appendChild(polygon)
            this.getPolygonBlock(o, this.groupObjects)
        }
        return "";
    }

    public getPolygon(o, classes: string): SVGPolygonElement {
        let x0 = o.i * u
        let y0 = o.j * v
        let p1 = { x: x0 + o.k * u / 2, y: y0 + v / 2 + o.k * v / 2 }
        let p2 = { x: x0 + u / 2 + o.k * u / 2, y: y0 + o.k * v / 2 }
        let p3 = { x: x0 + u + o.k * u / 2, y: y0 + v / 2 + o.k * v / 2 }
        let p4 = { x: x0 + u / 2 + o.k * u / 2, y: y0 + v + o.k * v / 2 }
        let p: SVGPolygonElement = document.createElementNS('http://www.w3.org/2000/svg','polygon');
        p.classList.add("base")
        for(let c of classes.split(" ")) {
            if(c) p.classList.add(c)
        }
        p.onclick = (e) => {
            this.placeTarget(o.i, o.j, o.k);
        };
        p.oncontextmenu = (e) => {
            e.preventDefault();
            this.placeObject(o.i, o.j, o.k);
        };
        let points = "";
        points += p1.x + "," + p1.y + " "
        points += p2.x + "," + p2.y + " "
        points += p3.x + "," + p3.y + " "
        points += p4.x + "," + p4.y
        p.setAttribute("points", points)
        return p;
    }
    
    public getPolygonBlock(o, parent): SVGPolygonElement {
        let x0 = o.i * u
        let y0 = o.j * v
        let p1 = { x: x0 + o.k * u / 2, y: y0 + v / 2 + o.k * v / 2 - w }
        let p2 = { x: x0 + u / 2 + o.k * u / 2, y: y0 + o.k * v / 2 - w }
        let p3 = { x: x0 + u + o.k * u / 2, y: y0 + v / 2 + o.k * v / 2 - w }
        let p4 = { x: x0 + u / 2 + o.k * u / 2, y: y0 + v + o.k * v / 2 - w }
        let p5 = { x: p1.x, y: p1.y + w }
        let p6 = { x: p4.x, y: p4.y + w }
        let p7 = { x: p3.x, y: p3.y + w }

        let top: SVGPolygonElement = document.createElementNS('http://www.w3.org/2000/svg','polygon');
        let left: SVGPolygonElement = document.createElementNS('http://www.w3.org/2000/svg','polygon');
        let right: SVGPolygonElement = document.createElementNS('http://www.w3.org/2000/svg','polygon');
        top.classList.add("base")
        right.classList.add("base")
        left.classList.add("base")
        let func = (e) => {
            e.preventDefault();
            this.placeObject(o.i, o.j, o.k);
        };
        top.oncontextmenu = func;
        right.oncontextmenu =  func;
        left.oncontextmenu =  func;
        
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
        
        parent.appendChild(top)
        parent.appendChild(left)
        parent.appendChild(right)

        return top;
    }

}
