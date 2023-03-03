"use strict";(self.webpackChunkencyclofus=self.webpackChunkencyclofus||[]).push([[898],{1221:(t,e,n)=>{n.d(e,{Z:()=>a});var s=n(8081),i=n.n(s),o=n(3645),l=n.n(o)()(i());l.push([t.id,"map {\n  width: 100%;\n}\nsvg {\n  width: 100%;\n  height: 100%;\n}\nmap text {\n  font: 13px noserif;\n  fill: var(--bs-body-color);\n  pointer-events: none;\n}\n.mapcontainer {\n  width: 1004.58946839px;\n  height: 820px;\n  margin-left: auto;\n  margin-right: auto;\n}\n.floor {\n  stroke: #a69e93;\n}\n.floor.k0 {\n  fill: #9d9588;\n}\n.floor.k1 {\n  fill: #988f82;\n}\n.floor:hover {\n  fill: #b87f49;\n}\n.hole {\n  fill: rgba(0, 0, 0, 0);\n}\n.block {\n  fill: rgba(59, 66, 68, 0.7);\n  stroke: #a69e93;\n}\n.object {\n  fill: rgba(126, 65, 65, 0.7);\n  stroke: #a69e93;\n}\n.blue {\n  fill: #0000ff;\n}\n.red {\n  fill: #ff0000;\n}\n.target {\n  fill: #ff00ff;\n}\n.highlight {\n  fill: rgba(92, 129, 70, 0.664);\n}\n.s1 {\n  fill: #ea00ff;\n}\n.s2 {\n  fill: #00ffb3;\n}\n.s3 {\n  fill: #e5ff00;\n}\n",""]);const a=l},1898:(t,e,n)=>{n.r(e),n.d(e,{Map:()=>E});var s={};n.r(s),n.d(s,{default:()=>v,dependencies:()=>M,name:()=>k,register:()=>C,template:()=>x});var i=n(655),o=(n(1932),n(1542)),l=n(3379),a=n.n(l),r=n(7795),d=n.n(r),h=n(569),p=n.n(h),c=n(3565),g=n.n(c),b=n(9216),f=n.n(b),m=n(4589),u=n.n(m),w=n(1221),y={};y.styleTagTransform=u(),y.setAttributes=g(),y.insert=p().bind(null,"head"),y.domAPI=d(),y.insertStyleElement=f(),a()(w.Z,y),w.Z&&w.Z.locals&&w.Z.locals;const k="map",x='\x3c!-- name + reset --\x3e\n<div class="d-flex">\n    <b style="vertical-align: middle;">${mapName}</b>\n    <button class="btn btn-outline-dark ms-auto" click.trigger="resetObjects()">Reset</button>\n</div>\n\n\x3c!-- spinner --\x3e\n<div show.bind="!mapLoaded" class="loaderContainer">\n    <div class="loader"></div>\n</div>\n\n\x3c!-- map --\x3e\n<div show.bind="mapLoaded" class="mapcontainer">\n    <svg ref="svg">\n        <g ref="groupFloor" class=""></g>\n    </svg>\n</div>\n\n\x3c!-- init --\x3e\n${init()}\n',v=x,M=[];let j;function C(t){j||(j=o.b_N.define({name:k,template:x,dependencies:M})),t.register(j)}var I=n(9344),N=n(1860),S=n(7302);const L=2*Math.sin(60*Math.PI/180)*40,P=2*Math.sin(30*Math.PI/180)*40,A=15;let E=class{constructor(t,e){this.ea=e,this.mapId="134479872",this.mapLoaded=!1,this.db=t,e.subscribe("db:loadmap",(t=>{if(this.initDone){let t=this.db.jsonMaps[this.mapId];this.board.cells=t.cells,this.generateMap()}else this.init()})),e.subscribe("db:loaded",(t=>{this.init()})),e.subscribe("map:setid",(t=>{if(this.mapId=t,this.db.jsonMaps[this.mapId]){let t=this.db.jsonMaps[this.mapId];this.board.cells=t.cells,this.generateMap()}else this.db.loadMap(this.mapId)}))}get mapName(){return this.db.getI18n("map_"+this.mapId)}init(){if(this.initDone)return"";if(!this.groupFloor)return"";if(!this.db.jsonMaps||!this.db.jsonMaps[this.mapId])return this.db.loadMap(this.mapId),"";this.groupFloor&&(this.groupFloor.innerHTML=""),this.board=new N.$l;let t=this.db.jsonMaps[this.mapId];return this.board.cells=t.cells,this.generateMap(),this.initDone=!0,""}load(){}placeObject(t){this.board.objects[t]=!this.board.objects[t],JSON.stringify(this.board.getCellCoordById(t)),JSON.stringify(this.board.getPos(t)),this.generateMap()}placeTarget(t){console.log("placeTarget "+t),this.board.target==t?this.board.target=-1:this.board.target=t,this.generateMap()}resetObjects(){this.board.objects.length=0,this.generateMap()}generateMap(){for(let t=0;t<this.board.cells.length;t++){let e=this.board.cells[t],n=this.board.getX(t),s=this.board.getY(t),i=s%2,o={i:n,j:Math.floor(s/2),k:i},l="k"+i+" ";if(this.board.objects[t])l+="object ",this.getPolygonBlock(t,o,l);else if(e.los){let n=!1;-1!=this.board.target&&(n=this.board.checkView(this.board.target,t)),!e.mov&&e.los?l+="hole ":this.board.target==t?l+="target ":n?l+="highlight ":e.blue?l+="blue ":e.red?l+="red ":l+="floor ",this.getPolygon(t,o,l)}else l+="block ",this.getPolygonBlock(t,o,l)}this.mapLoaded=!0}getPolygon(t,e,n){let s=e.i*L,i=e.j*P,o=s+e.k*L/2,l=i+P/2+e.k*P/2,a=s+L/2+e.k*L/2,r=i+e.k*P/2,d=s+L+e.k*L/2,h=i+P/2+e.k*P/2,p=s+L/2+e.k*L/2,c=i+P+e.k*P/2,g=document.createElementNS("http://www.w3.org/2000/svg","polygon");for(let t of n.split(" "))t&&g.classList.add(t);g.onclick=e=>{n.includes("hole")||this.placeTarget(t)},g.oncontextmenu=e=>{e.preventDefault(),n.includes("hole")||this.placeObject(t)};let b="";b+=o+","+l+" ",b+=a+","+r+" ",b+=d+","+h+" ",b+=p+","+c,g.setAttribute("points",b);var f=document.createElementNS("http://www.w3.org/2000/svg","g");if(f.appendChild(g),-1!=this.board.target&&n.includes("highlight")){let e=this.board.getCellCoordById(t),n=this.board.getCellCoordById(this.board.target),s=Math.abs(e.x-n.x)+Math.abs(e.y-n.y),i=document.createElementNS("http://www.w3.org/2000/svg","text");i.textContent=s+"";let o=s>=10?7:3;i.setAttribute("x",a-o+""),i.setAttribute("y",r+20+3+""),f.appendChild(i)}this.initDone?this.groupFloor.children.item(t).replaceWith(f):this.groupFloor.appendChild(f)}getPolygonBlock(t,e,n){let s=e.i*L,i=e.j*P,o={x:s+e.k*L/2,y:i+P/2+e.k*P/2-A},l=s+L/2+e.k*L/2,a=i+e.k*P/2-A,r={x:s+L+e.k*L/2,y:i+P/2+e.k*P/2-A},d={x:s+L/2+e.k*L/2,y:i+P+e.k*P/2-A},h=o.x,p=o.y+A,c=d.x,g=d.y+A,b=r.x,f=r.y+A,m=document.createElementNS("http://www.w3.org/2000/svg","polygon"),u=document.createElementNS("http://www.w3.org/2000/svg","polygon"),w=document.createElementNS("http://www.w3.org/2000/svg","polygon");for(let t of n.split(" "))t&&m.classList.add(t),t&&u.classList.add(t),t&&w.classList.add(t);let y=e=>{e.preventDefault(),n.includes("object")&&this.placeObject(t)};m.oncontextmenu=y,w.oncontextmenu=y,u.oncontextmenu=y;let k="";k+=o.x+","+o.y+" ",k+=l+","+a+" ",k+=r.x+","+r.y+" ",k+=d.x+","+d.y+" ",m.setAttribute("points",k),k=c+","+g+" ",k+=h+","+p+" ",k+=o.x+","+o.y+" ",k+=d.x+","+d.y+" ",u.setAttribute("points",k),k=c+","+g+" ",k+=b+","+f+" ",k+=r.x+","+r.y+" ",k+=d.x+","+d.y+" ",w.setAttribute("points",k);var x=document.createElementNS("http://www.w3.org/2000/svg","g");x.appendChild(m),x.appendChild(u),x.appendChild(w),this.initDone?this.groupFloor.childNodes.item(t).replaceWith(x):this.groupFloor.appendChild(x)}};E=(0,i.gn)([(0,o.MoW)(s),(0,I.f3)(S.db),(0,i.fM)(1,I.Rp),(0,i.w6)("design:paramtypes",[S.db,Object])],E)}}]);