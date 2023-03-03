"use strict";(self.webpackChunkencyclofus=self.webpackChunkencyclofus||[]).push([[25,898],{1221:(t,e,n)=>{n.d(e,{Z:()=>l});var a=n(8081),i=n.n(a),s=n(3645),o=n.n(s)()(i());o.push([t.id,"map {\n  width: 100%;\n}\nsvg {\n  width: 100%;\n  height: 100%;\n}\nmap text {\n  font: 13px noserif;\n  fill: var(--bs-body-color);\n  pointer-events: none;\n}\n.mapcontainer {\n  width: 1004.58946839px;\n  height: 820px;\n  margin-left: auto;\n  margin-right: auto;\n}\n.floor {\n  stroke: #a69e93;\n}\n.floor.k0 {\n  fill: #9d9588;\n}\n.floor.k1 {\n  fill: #988f82;\n}\n.floor:hover {\n  fill: #b87f49;\n}\n.hole {\n  fill: rgba(0, 0, 0, 0);\n}\n.block {\n  fill: rgba(59, 66, 68, 0.7);\n  stroke: #a69e93;\n}\n.object {\n  fill: rgba(126, 65, 65, 0.7);\n  stroke: #a69e93;\n}\n.blue {\n  fill: #0000ff;\n}\n.red {\n  fill: #ff0000;\n}\n.target {\n  fill: #ff00ff;\n}\n.highlight {\n  fill: rgba(92, 129, 70, 0.664);\n}\n.s1 {\n  fill: #ea00ff;\n}\n.s2 {\n  fill: #00ffb3;\n}\n.s3 {\n  fill: #e5ff00;\n}\n.loaderContainer {\n  width: 100%;\n}\n.loader {\n  margin-left: auto;\n  margin-right: auto;\n  margin-top: 50px;\n  border: 16px solid #f3f3f3;\n  /* Light grey */\n  border-top: 16px solid #3498db;\n  /* Blue */\n  border-radius: 50%;\n  width: 120px;\n  height: 120px;\n  -webkit-animation: spin 2s linear infinite;\n          animation: spin 2s linear infinite;\n}\n@-webkit-keyframes spin {\n  0% {\n    transform: rotate(0deg);\n  }\n  100% {\n    transform: rotate(360deg);\n  }\n}\n@keyframes spin {\n  0% {\n    transform: rotate(0deg);\n  }\n  100% {\n    transform: rotate(360deg);\n  }\n}\n",""]);const l=o},3132:(t,e,n)=>{n.d(e,{Z:()=>l});var a=n(8081),i=n.n(a),s=n(3645),o=n.n(s)()(i());o.push([t.id,"maplist .btn {\n  border-width: 0 !important;\n  border-radius: 0 !important;\n}\nmaplist .radioDark:hover {\n  color: var(--bs-btn-hover-color);\n  background-color: var(--bs-btn-hover-bg);\n}\n",""]);const l=o},1898:(t,e,n)=>{n.r(e),n.d(e,{Map:()=>L});var a={};n.r(a),n.d(a,{default:()=>x,dependencies:()=>M,name:()=>v,register:()=>D,template:()=>y});var i=n(655),s=(n(1932),n(1542)),o=n(3379),l=n.n(o),r=n(7795),d=n.n(r),h=n(569),c=n.n(h),p=n(3565),b=n.n(p),u=n(9216),g=n.n(u),m=n(4589),f=n.n(m),k=n(1221),w={};w.styleTagTransform=f(),w.setAttributes=b(),w.insert=c().bind(null,"head"),w.domAPI=d(),w.insertStyleElement=g(),l()(k.Z,w),k.Z&&k.Z.locals&&k.Z.locals;const v="map",y='\x3c!-- name + reset --\x3e\n<div class="d-flex">\n    <b style="vertical-align: middle;">${mapName}</b>\n    <button class="btn btn-outline-dark ms-auto" click.trigger="resetObjects()">Reset</button>\n</div>\n\n\x3c!-- spinner --\x3e\n<div show.bind="!mapLoaded" class="loaderContainer">\n    <div class="loader"></div>\n</div>\n\n\x3c!-- map --\x3e\n<div show.bind="mapLoaded" class="mapcontainer">\n    <svg ref="svg">\n        <g ref="groupFloor" class=""></g>\n    </svg>\n</div>\n\n\x3c!-- init --\x3e\n${init()}\n',x=y,M=[];let j;function D(t){j||(j=s.b_N.define({name:v,template:y,dependencies:M})),t.register(j)}var N=n(9344),A=n(1860),I=n(7302);const C=2*Math.sin(60*Math.PI/180)*40,T=2*Math.sin(30*Math.PI/180)*40,H=15;let L=class{constructor(t,e){this.ea=e,this.mapId="134479872",this.mapLoaded=!1,this.db=t,e.subscribe("db:loadmap",(t=>{if(this.initDone){let t=this.db.jsonMaps[this.mapId];this.board.cells=t.cells,this.generateMap()}else this.init()})),e.subscribe("db:loaded",(t=>{this.init()})),e.subscribe("map:setid",(t=>{if(this.mapId=t,this.db.jsonMaps[this.mapId]){let t=this.db.jsonMaps[this.mapId];this.board.cells=t.cells,this.generateMap()}else this.db.loadMap(this.mapId)}))}get mapName(){return this.db.getI18n("map_"+this.mapId)}init(){if(this.initDone)return"";if(!this.groupFloor)return"";if(!this.db.jsonMaps||!this.db.jsonMaps[this.mapId])return this.db.loadMap(this.mapId),"";this.groupFloor&&(this.groupFloor.innerHTML=""),this.board=new A.$l;let t=this.db.jsonMaps[this.mapId];return this.board.cells=t.cells,this.generateMap(),this.initDone=!0,""}load(){}placeObject(t){this.board.objects[t]=!this.board.objects[t],JSON.stringify(this.board.getCellCoordById(t)),JSON.stringify(this.board.getPos(t)),this.generateMap()}placeTarget(t){console.log("placeTarget "+t),this.board.target==t?this.board.target=-1:this.board.target=t,this.generateMap()}resetObjects(){this.board.objects.length=0,this.generateMap()}generateMap(){for(let t=0;t<this.board.cells.length;t++){let e=this.board.cells[t],n=this.board.getX(t),a=this.board.getY(t),i=a%2,s={i:n,j:Math.floor(a/2),k:i},o="k"+i+" ";if(this.board.objects[t])o+="object ",this.getPolygonBlock(t,s,o);else if(e.los){let n=!1;-1!=this.board.target&&(n=this.board.checkView(this.board.target,t)),!e.mov&&e.los?o+="hole ":this.board.target==t?o+="target ":n?o+="highlight ":e.blue?o+="blue ":e.red?o+="red ":o+="floor ",this.getPolygon(t,s,o)}else o+="block ",this.getPolygonBlock(t,s,o)}this.mapLoaded=!0}getPolygon(t,e,n){let a=e.i*C,i=e.j*T,s=a+e.k*C/2,o=i+T/2+e.k*T/2,l=a+C/2+e.k*C/2,r=i+e.k*T/2,d=a+C+e.k*C/2,h=i+T/2+e.k*T/2,c=a+C/2+e.k*C/2,p=i+T+e.k*T/2,b=document.createElementNS("http://www.w3.org/2000/svg","polygon");for(let t of n.split(" "))t&&b.classList.add(t);b.onclick=e=>{n.includes("hole")||this.placeTarget(t)},b.oncontextmenu=e=>{e.preventDefault(),n.includes("hole")||this.placeObject(t)};let u="";u+=s+","+o+" ",u+=l+","+r+" ",u+=d+","+h+" ",u+=c+","+p,b.setAttribute("points",u);var g=document.createElementNS("http://www.w3.org/2000/svg","g");if(g.appendChild(b),-1!=this.board.target&&n.includes("highlight")){let e=this.board.getCellCoordById(t),n=this.board.getCellCoordById(this.board.target),a=Math.abs(e.x-n.x)+Math.abs(e.y-n.y),i=document.createElementNS("http://www.w3.org/2000/svg","text");i.textContent=a+"";let s=a>=10?7:3;i.setAttribute("x",l-s+""),i.setAttribute("y",r+20+3+""),g.appendChild(i)}this.initDone?this.groupFloor.children.item(t).replaceWith(g):this.groupFloor.appendChild(g)}getPolygonBlock(t,e,n){let a=e.i*C,i=e.j*T,s={x:a+e.k*C/2,y:i+T/2+e.k*T/2-H},o=a+C/2+e.k*C/2,l=i+e.k*T/2-H,r={x:a+C+e.k*C/2,y:i+T/2+e.k*T/2-H},d={x:a+C/2+e.k*C/2,y:i+T+e.k*T/2-H},h=s.x,c=s.y+H,p=d.x,b=d.y+H,u=r.x,g=r.y+H,m=document.createElementNS("http://www.w3.org/2000/svg","polygon"),f=document.createElementNS("http://www.w3.org/2000/svg","polygon"),k=document.createElementNS("http://www.w3.org/2000/svg","polygon");for(let t of n.split(" "))t&&m.classList.add(t),t&&f.classList.add(t),t&&k.classList.add(t);let w=e=>{e.preventDefault(),n.includes("object")&&this.placeObject(t)};m.oncontextmenu=w,k.oncontextmenu=w,f.oncontextmenu=w;let v="";v+=s.x+","+s.y+" ",v+=o+","+l+" ",v+=r.x+","+r.y+" ",v+=d.x+","+d.y+" ",m.setAttribute("points",v),v=p+","+b+" ",v+=h+","+c+" ",v+=s.x+","+s.y+" ",v+=d.x+","+d.y+" ",f.setAttribute("points",v),v=p+","+b+" ",v+=u+","+g+" ",v+=r.x+","+r.y+" ",v+=d.x+","+d.y+" ",k.setAttribute("points",v);var y=document.createElementNS("http://www.w3.org/2000/svg","g");y.appendChild(m),y.appendChild(f),y.appendChild(k),this.initDone?this.groupFloor.childNodes.item(t).replaceWith(y):this.groupFloor.appendChild(y)}};L=(0,i.gn)([(0,s.MoW)(a),(0,N.f3)(I.db),(0,i.fM)(1,N.Rp),(0,i.w6)("design:paramtypes",[I.db,Object])],L)},1025:(t,e,n)=>{n.r(e),n.d(e,{MapList:()=>T});var a={};n.r(a),n.d(a,{default:()=>M,dependencies:()=>j,name:()=>y,register:()=>N,template:()=>x});var i=n(655),s=(n(1932),n(1542)),o=n(3379),l=n.n(o),r=n(7795),d=n.n(r),h=n(569),c=n.n(h),p=n(3565),b=n.n(p),u=n(9216),g=n.n(u),m=n(4589),f=n.n(m),k=n(3132),w={};w.styleTagTransform=f(),w.setAttributes=b(),w.insert=c().bind(null,"head"),w.domAPI=d(),w.insertStyleElement=g(),l()(k.Z,w),k.Z&&k.Z.locals&&k.Z.locals;var v=n(1898);const y="maplist",x='\n\n<div if.bind="db.isLoaded">\n    <div class="btn-group" style="" role="group" aria-label="Basic radio toggle button group">\n        <input type="radio" class="btn-check" name="btnradioa" id="btnGoultar" autocomplete="off" checked click.delegate="clickGoultar()">\n        <label class="btn btn-outline-dark radioDark" for="btnGoultar" t="maps.goultar"></label>\n\n        <input type="radio" class="btn-check" name="btnradioa" id="btnTournoi" autocomplete="off" click.delegate="clickTournoi()">\n        <label class="btn btn-outline-dark radioDark" for="btnTournoi" t="maps.tournament"></label>\n\n        <input type="radio" class="btn-check" name="btnradioa" id="btnDuel" autocomplete="off" click.delegate="clickDuel()">\n        <label class="btn btn-outline-dark radioDark" for="btnDuel" t="maps.duel"></label>\n        \n        <input type="radio" class="btn-check" name="btnradioa" id="btnAmakna" autocomplete="off" click.delegate="clickAmakna()">\n        <label class="btn btn-outline-dark radioDark" for="btnAmakna" t="maps.amakna"></label>\n\n        <input type="radio" class="btn-check" name="btnradioa" id="btnHelp" autocomplete="off" click.delegate="clickHelp()">\n        <label class="btn btn-outline-dark radioDark ms-auto" style="" for="btnHelp" t="help"></label>\n    </div>\n\n    <div show.bind="showHelp">\n        <span style="padding-left: 12px;" t="maps.clickl"></span> \n        <br/>  \n        <span style="padding-left: 12px;" t="maps.clickr"></span>\n    </div>\n\n    <hr>\n\n    <div show.bind="showGoultar">\n        <button class="btn btn-outline-dark" repeat.for="id of goultars" click.trigger="select(id)">${getMapName(id)}</button>\n    </div>\n\n    <div show.bind="showTournoi">\n        <button class="btn btn-outline-dark" repeat.for="id of tournois" click.trigger="select(id)">${getMapName(id)}</button>\n    </div>\n\n    <div show.bind="showDuel">\n        <button class="btn btn-outline-dark" repeat.for="id of duels" click.trigger="select(id)">${getMapName(id)}</button>\n    </div>\n    \n    <div show.bind="showAmakna">\n        <button class="btn btn-outline-dark" repeat.for="id of amaknas" click.trigger="select(id)">${getMapName(id)}</button>\n    </div>\n    \n\n    <hr>\n\n    <map></map>\n</div>\n\n',M=x,j=[v];let D;function N(t){D||(D=s.b_N.define({name:y,template:x,dependencies:j})),t.register(D)}const A=JSON.parse('{"goultar":[134479872,134479874,134480896,134480898,134481920,134481922,134482944,134482946,134483968,134483970,134484992,134484994,170393600,170393602,170394624,170394626,170395648],"tournoi":[177471488,177471496,177472512,177472520,177473536,177473544,177474560,177474568,177475584,177475592,177476608,177476616,177477632,177478656,177478660,177479680,177479684,177480704,177481728,177603584,177603592],"duel":[177471490,177471498,177472514,177472522,177473538,177473546,177474562,177474570,177475586,177475594,177476610,177476618,177478658,177478662,177479686,177480706,177481730,177603586,177603594],"amakna":[177471492,177477640,177476612,177603588,177480708,177474564,177472516,177478664,177473540,177475588]}');var I=n(9344),C=n(7302);let T=class{constructor(t,e){this.ea=e,this.mapIds=A,this.showGoultar=!0,this.showTournoi=!1,this.showDuel=!1,this.showAmakna=!1,this.showHelp=!1,this.db=t,e.subscribe("db:loaded",(()=>{this.goultars=A.goultar.sort(((t,e)=>this.sortMaps(t,e))),this.tournois=A.tournoi.sort(((t,e)=>this.sortMaps(t,e))),this.duels=A.duel.sort(((t,e)=>this.sortMaps(t,e))),this.amaknas=A.amakna.sort()}))}sortMaps(t,e){let n=this.getMapName(t),a=this.getMapName(e);return n.localeCompare(a)}select(t){this.ea.publish("map:setid",t)}getMapName(t){try{let e=this.db.getI18n("map_"+t).split(" ");return e[e.length-1]}catch(e){return t+""}}clickGoultar(){this.showGoultar=!0,this.showTournoi=!1,this.showDuel=!1,this.showAmakna=!1,this.showHelp=!1}clickTournoi(){this.showGoultar=!1,this.showTournoi=!0,this.showDuel=!1,this.showAmakna=!1,this.showHelp=!1}clickDuel(){this.showGoultar=!1,this.showTournoi=!1,this.showDuel=!0,this.showAmakna=!1,this.showHelp=!1}clickAmakna(){this.showGoultar=!1,this.showTournoi=!1,this.showDuel=!1,this.showAmakna=!0,this.showHelp=!1}clickHelp(){this.showHelp=!this.showHelp}};T=(0,i.gn)([(0,s.MoW)(a),(0,I.f3)(C.db),(0,i.fM)(1,I.Rp),(0,i.w6)("design:paramtypes",[C.db,Object])],T)}}]);