"use strict";(self.webpackChunkencyclofus=self.webpackChunkencyclofus||[]).push([[25,898],{1221:(t,e,n)=>{n.d(e,{Z:()=>l});var i=n(8081),o=n.n(i),s=n(3645),a=n.n(s)()(o());a.push([t.id,"map {\n  width: 100%;\n}\nsvg {\n  width: 100%;\n  height: 100%;\n}\n.mapcontainer {\n  width: 1004.58946839px;\n  height: 820px;\n  margin-left: auto;\n  margin-right: auto;\n}\n.floor {\n  stroke: #a69e93;\n}\n.floor.k0 {\n  fill: #9d9588;\n}\n.floor.k1 {\n  fill: #988f82;\n}\n.floor:hover {\n  fill: #b87f49;\n}\n.hole {\n  fill: rgba(0, 0, 0, 0);\n}\n.block {\n  fill: rgba(59, 66, 68, 0.7);\n  stroke: #a69e93;\n}\n.object {\n  fill: rgba(126, 65, 65, 0.7);\n  stroke: #a69e93;\n}\n.blue {\n  fill: #0000ff;\n}\n.red {\n  fill: #ff0000;\n}\n.target {\n  fill: #ff00ff;\n}\n.highlight {\n  fill: rgba(92, 129, 70, 0.664);\n}\n.s1 {\n  fill: #ea00ff;\n}\n.s2 {\n  fill: #00ffb3;\n}\n.s3 {\n  fill: #e5ff00;\n}\n.loaderContainer {\n  width: 100%;\n}\n.loader {\n  margin-left: auto;\n  margin-right: auto;\n  margin-top: 50px;\n  border: 16px solid #f3f3f3;\n  /* Light grey */\n  border-top: 16px solid #3498db;\n  /* Blue */\n  border-radius: 50%;\n  width: 120px;\n  height: 120px;\n  -webkit-animation: spin 2s linear infinite;\n          animation: spin 2s linear infinite;\n}\n@-webkit-keyframes spin {\n  0% {\n    transform: rotate(0deg);\n  }\n  100% {\n    transform: rotate(360deg);\n  }\n}\n@keyframes spin {\n  0% {\n    transform: rotate(0deg);\n  }\n  100% {\n    transform: rotate(360deg);\n  }\n}\n",""]);const l=a},3132:(t,e,n)=>{n.d(e,{Z:()=>l});var i=n(8081),o=n.n(i),s=n(3645),a=n.n(s)()(o());a.push([t.id,"maplist .btn {\n  border-width: 0 !important;\n  border-radius: 0 !important;\n}\nmaplist .radioDark:hover {\n  color: var(--bs-btn-hover-color);\n  background-color: var(--bs-btn-hover-bg);\n}\nmaplist text {\n  font: 13px noserif;\n  fill: black;\n}\n",""]);const l=a},1898:(t,e,n)=>{n.r(e),n.d(e,{Map:()=>S});var i={};n.r(i),n.d(i,{default:()=>x,dependencies:()=>M,name:()=>v,register:()=>D,template:()=>y});var o=n(655),s=(n(1932),n(1542)),a=n(3379),l=n.n(a),r=n(7795),d=n.n(r),h=n(569),c=n.n(h),p=n(3565),b=n.n(p),g=n(9216),u=n.n(g),f=n(4589),m=n.n(f),k=n(1221),w={};w.styleTagTransform=m(),w.setAttributes=b(),w.insert=c().bind(null,"head"),w.domAPI=d(),w.insertStyleElement=u(),l()(k.Z,w),k.Z&&k.Z.locals&&k.Z.locals;const v="map",y='\x3c!-- name + reset --\x3e\n<div class="d-flex">\n    <b style="vertical-align: middle;">${mapName}</b>\n    <button class="btn btn-outline-dark ms-auto" click.trigger="resetObjects()">Reset</button>\n</div>\n\n\x3c!-- spinner --\x3e\n<div show.bind="!mapLoaded" class="loaderContainer">\n    <div class="loader"></div>\n</div>\n\n\x3c!-- map --\x3e\n<div show.bind="mapLoaded" class="mapcontainer">\n    <svg ref="svg">\n        <g ref="groupFloor" class=""></g>\n    </svg>\n</div>\n\n\x3c!-- init --\x3e\n${init()}\n',x=y,M=[];let j;function D(t){j||(j=s.b_N.define({name:v,template:y,dependencies:M})),t.register(j)}var I=n(9344),N=n(1860),C=n(6976);const T=2*Math.sin(60*Math.PI/180)*40,H=2*Math.sin(30*Math.PI/180)*40,L=15;let S=class{constructor(t,e){this.ea=e,this.mapId="134479872",this.mapLoaded=!1,this.db=t,e.subscribe("db:loadmap",(t=>{if(this.initDone){let t=this.db.jsonMaps[this.mapId];this.board.cells=t.cells,this.generateMap()}else this.init()})),e.subscribe("db:loaded",(t=>{this.init()})),e.subscribe("map:setid",(t=>{if(this.mapId=t,this.db.jsonMaps[this.mapId]){let t=this.db.jsonMaps[this.mapId];this.board.cells=t.cells,this.generateMap()}else this.db.loadMap(this.mapId)}))}get mapName(){return this.db.getI18n("map_"+this.mapId)}init(){if(this.initDone)return"";if(!this.groupFloor)return"";if(!this.db.jsonMaps||!this.db.jsonMaps[this.mapId])return this.db.loadMap(this.mapId),"";this.groupFloor&&(this.groupFloor.innerHTML=""),this.board=new N.$l;let t=this.db.jsonMaps[this.mapId];return this.board.cells=t.cells,this.generateMap(),this.initDone=!0,""}load(){}placeObject(t){this.board.objects[t]=!this.board.objects[t],JSON.stringify(this.board.getCellCoordById(t)),JSON.stringify(this.board.getPos(t)),this.generateMap()}placeTarget(t){console.log("placeTarget "+t),this.board.target==t?this.board.target=-1:this.board.target=t,this.generateMap()}resetObjects(){this.board.objects.length=0,this.generateMap()}generateMap(){for(let t=0;t<this.board.cells.length;t++){let e=this.board.cells[t],n=this.board.getX(t),i=this.board.getY(t),o=i%2,s={i:n,j:Math.floor(i/2),k:o},a="k"+o+" ";if(this.board.objects[t])a+="object ",this.getPolygonBlock(t,s,a);else if(e.los){let n=!1;-1!=this.board.target&&(n=this.board.checkView(this.board.target,t)),!e.mov&&e.los?a+="hole ":this.board.target==t?a+="target ":n?a+="highlight ":e.blue?a+="blue ":e.red?a+="red ":a+="floor ",this.getPolygon(t,s,a)}else a+="block ",this.getPolygonBlock(t,s,a)}this.mapLoaded=!0}getPolygon(t,e,n){let i=e.i*T,o=e.j*H,s=i+e.k*T/2,a=o+H/2+e.k*H/2,l=i+T/2+e.k*T/2,r=o+e.k*H/2,d=i+T+e.k*T/2,h=o+H/2+e.k*H/2,c=i+T/2+e.k*T/2,p=o+H+e.k*H/2,b=document.createElementNS("http://www.w3.org/2000/svg","polygon");for(let t of n.split(" "))t&&b.classList.add(t);b.onclick=e=>{n.includes("hole")||this.placeTarget(t)},b.oncontextmenu=e=>{e.preventDefault(),n.includes("hole")||this.placeObject(t)};let g="";g+=s+","+a+" ",g+=l+","+r+" ",g+=d+","+h+" ",g+=c+","+p,b.setAttribute("points",g);var u=document.createElementNS("http://www.w3.org/2000/svg","g");if(u.appendChild(b),-1!=this.board.target&&n.includes("highlight")){let e=this.board.getCellCoordById(t),n=this.board.getCellCoordById(this.board.target),i=Math.abs(e.x-n.x)+Math.abs(e.y-n.y),o=document.createElementNS("http://www.w3.org/2000/svg","text");o.textContent=i+"";let s=i>=10?7:3;o.setAttribute("x",l-s+""),o.setAttribute("y",r+20+3+""),u.appendChild(o)}this.initDone?this.groupFloor.children.item(t).replaceWith(u):this.groupFloor.appendChild(u)}getPolygonBlock(t,e,n){let i=e.i*T,o=e.j*H,s={x:i+e.k*T/2,y:o+H/2+e.k*H/2-L},a=i+T/2+e.k*T/2,l=o+e.k*H/2-L,r={x:i+T+e.k*T/2,y:o+H/2+e.k*H/2-L},d={x:i+T/2+e.k*T/2,y:o+H+e.k*H/2-L},h=s.x,c=s.y+L,p=d.x,b=d.y+L,g=r.x,u=r.y+L,f=document.createElementNS("http://www.w3.org/2000/svg","polygon"),m=document.createElementNS("http://www.w3.org/2000/svg","polygon"),k=document.createElementNS("http://www.w3.org/2000/svg","polygon");for(let t of n.split(" "))t&&f.classList.add(t),t&&m.classList.add(t),t&&k.classList.add(t);let w=e=>{e.preventDefault(),n.includes("object")&&this.placeObject(t)};f.oncontextmenu=w,k.oncontextmenu=w,m.oncontextmenu=w;let v="";v+=s.x+","+s.y+" ",v+=a+","+l+" ",v+=r.x+","+r.y+" ",v+=d.x+","+d.y+" ",f.setAttribute("points",v),v=p+","+b+" ",v+=h+","+c+" ",v+=s.x+","+s.y+" ",v+=d.x+","+d.y+" ",m.setAttribute("points",v),v=p+","+b+" ",v+=g+","+u+" ",v+=r.x+","+r.y+" ",v+=d.x+","+d.y+" ",k.setAttribute("points",v);var y=document.createElementNS("http://www.w3.org/2000/svg","g");y.appendChild(f),y.appendChild(m),y.appendChild(k),this.initDone?this.groupFloor.childNodes.item(t).replaceWith(y):this.groupFloor.appendChild(y)}};S=(0,o.gn)([(0,s.MoW)(i),(0,I.f3)(C.db),(0,o.fM)(1,I.Rp),(0,o.w6)("design:paramtypes",[C.db,Object])],S)},1025:(t,e,n)=>{n.r(e),n.d(e,{MapList:()=>H});var i={};n.r(i),n.d(i,{default:()=>M,dependencies:()=>j,name:()=>y,register:()=>I,template:()=>x});var o=n(655),s=(n(1932),n(1542)),a=n(3379),l=n.n(a),r=n(7795),d=n.n(r),h=n(569),c=n.n(h),p=n(3565),b=n.n(p),g=n(9216),u=n.n(g),f=n(4589),m=n.n(f),k=n(3132),w={};w.styleTagTransform=m(),w.setAttributes=b(),w.insert=c().bind(null,"head"),w.domAPI=d(),w.insertStyleElement=u(),l()(k.Z,w),k.Z&&k.Z.locals&&k.Z.locals;var v=n(1898);const y="maplist",x='\n\n<div if.bind="db.isLoaded">\n    <div class="btn-group" style="" role="group" aria-label="Basic radio toggle button group">\n        <input type="radio" class="btn-check" name="btnradioa" id="btnGoultar" autocomplete="off" checked click.delegate="clickGoultar()">\n        <label class="btn btn-outline-dark radioDark" for="btnGoultar" t="maps.goultar"></label>\n\n        <input type="radio" class="btn-check" name="btnradioa" id="btnTournoi" autocomplete="off" click.delegate="clickTournoi()">\n        <label class="btn btn-outline-dark radioDark" for="btnTournoi" t="maps.tournament"></label>\n\n        <input type="radio" class="btn-check" name="btnradioa" id="btnDuel" autocomplete="off" click.delegate="clickDuel()">\n        <label class="btn btn-outline-dark radioDark" for="btnDuel" t="maps.duel"></label>\n\n        <input type="radio" class="btn-check" name="btnradioa" id="btnHelp" autocomplete="off" click.delegate="clickHelp()">\n        <label class="btn btn-outline-dark radioDark ms-auto" style="" for="btnHelp" t="help"></label>\n    </div>\n\n    <div show.bind="showHelp">\n        <span style="padding-left: 12px;" t="maps.clickl"></span> \n        <br/>  \n        <span style="padding-left: 12px;" t="maps.clickr"></span>\n    </div>\n\n    <hr>\n\n    <div show.bind="showGoultar">\n        \x3c!-- <input repeat.for="id of goultars" type="radio" class="btn-check" name="btnradio${id}" id="btn${id}" autocomplete="off" click.delegate="select(id)">\n        <label repeat.for="id of goultars" class="btn btn-outline-dark radioDark" for="btn${id}">${getMapName(id)}</label> --\x3e\n        <button class="btn btn-outline-dark" repeat.for="id of goultars" click.trigger="select(id)">${getMapName(id)}</button>\n    </div>\n\n    <div show.bind="showTournoi">\n        <button class="btn btn-outline-dark" repeat.for="id of tournois" click.trigger="select(id)">${getMapName(id)}</button>\n    </div>\n\n    <div show.bind="showDuel">\n        <button class="btn btn-outline-dark" repeat.for="id of mapIds.duel" click.trigger="select(id)">${getMapName(id)}</button>\n    </div>\n    \n\n    <hr>\n\n    <map></map>\n</div>\n\n',M=x,j=[v];let D;function I(t){D||(D=s.b_N.define({name:y,template:x,dependencies:j})),t.register(D)}const N=JSON.parse('{"goultar":[134479872,134479874,134480896,134480898,134481920,134481922,134482944,134482946,134483968,134483970,134484992,134484994,170393600,170393602,170394624,170394626,170395648],"tournoi":[177471488,177471496,177472512,177472520,177473536,177473544,177474560,177474568,177475584,177475592,177476608,177476616,177477632,177478656,177478660,177479680,177479684,177480704,177481728,177603584,177603592],"duel":[177471490,177471498,177472514,177472522,177473538,177473546,177474562,177474570,177475586,177475594,177476610,177476618,177478658,177478662,177479686,177480706,177481730,177603586,177603594]}');var C=n(9344),T=n(6976);let H=class{constructor(t,e){this.ea=e,this.mapIds=N,this.goultars=N.goultar.sort(),this.tournois=N.tournoi.sort(),this.duels=N.duel.sort(),this.showGoultar=!0,this.showTournoi=!1,this.showDuel=!1,this.showHelp=!1,this.db=t}select(t){this.ea.publish("map:setid",t)}getMapName(t){let e=this.db.getI18n("map_"+t).split(" ");return e[e.length-1]}clickGoultar(){this.showGoultar=!0,this.showTournoi=!1,this.showDuel=!1,this.showHelp=!1}clickTournoi(){this.showGoultar=!1,this.showTournoi=!0,this.showDuel=!1,this.showHelp=!1}clickDuel(){this.showGoultar=!1,this.showTournoi=!1,this.showDuel=!0,this.showHelp=!1}clickHelp(){this.showHelp=!this.showHelp}};H=(0,o.gn)([(0,s.MoW)(i),(0,C.f3)(T.db),(0,o.fM)(1,C.Rp),(0,o.w6)("design:paramtypes",[T.db,Object])],H)}}]);