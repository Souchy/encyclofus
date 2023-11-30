"use strict";(self.webpackChunkencyclofus=self.webpackChunkencyclofus||[]).push([[716],{7958:(e,t,i)=>{i.d(t,{Z:()=>o});var n=i(8081),s=i.n(n),l=i(3645),r=i.n(l)()(s());r.push([e.id,'.searchable {\n  width: 100%;\n  float: left;\n}\n.searchable input {\n  width: 100%;\n  /* Safari/Chrome, other WebKit */\n  /* Firefox, other Gecko */\n  box-sizing: border-box;\n  /* Opera/IE 8+ */\n  display: block;\n  background-clip: padding-box;\n  border: 1px solid var(--accent1);\n  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;\n}\n.searchable dl {\n  width: 90%;\n  position: absolute;\n  display: none;\n  list-style-type: none;\n  border: 1px solid var(--accent1);\n  border-top: none;\n  max-height: 380px;\n  margin: 0;\n  overflow-y: scroll;\n  overflow-x: hidden;\n  padding: 0;\n  background-color: var(--bg0);\n  z-index: 3;\n}\n.searchable dl dt {\n  height: 25px;\n  color: var(--front0);\n  background-color: var(--bg1);\n  z-index: 4;\n}\n.searchable dl dd {\n  height: 25px;\n  cursor: pointer;\n  color: var(--front0);\n  background-color: var(--bg0);\n  z-index: 4;\n  margin: 0px;\n}\n.searchable dl dd.selected {\n  background-color: #e8e8e8;\n  color: #333;\n}\nfilter {\n  padding-top: 0.5rem;\n  padding-left: 10%;\n  padding-right: 10%;\n  display: block;\n}\nfilter > div {\n  /* width: 1200px; */\n  /* height: 300px; */\n  /* background: white; */\n  /* border: 1px solid var(--accent1); */\n}\n/* Search bar */\nfilter .search {\n  width: 100%;\n  height: 40px;\n  padding-left: 5px;\n}\n/* Toggle button */\nfilter .toggle {\n  border: 1px solid var(--accent1);\n  background: transparent;\n  margin-bottom: 4px;\n  margin-right: 4px;\n  padding: 2px;\n  cursor: pointer;\n  text-align: center;\n  min-width: 50px;\n  height: 35px;\n}\nfilter .toggle label {\n  cursor: pointer;\n  margin: 0px;\n}\n/* Checkbox input */\nfilter input[type="checkbox"] {\n  appearance: none;\n  -webkit-appearance: none;\n  -moz-appearance: none;\n}\nfilter .checkbox {\n  width: 15px;\n  height: 15px;\n  background: var(--bg0);\n  border: 1px solid var(--accent1);\n  padding: 2px;\n}\nfilter .checkbox:checked {\n  background: var(--accent1);\n}\n/* title labels */\nfilter .title {\n  font-size: 25px;\n  font-weight: bold;\n  /* margin-left: 5px; */\n}\n/* block list */\nfilter .blocklist .block {\n  margin-bottom: 10px;\n}\nfilter .blocklist .block .blocktitle {\n  font-size: 20px;\n  color: var(--front0);\n  background: var(--bg0);\n  border-color: var(--bg0);\n  width: 100%;\n  /* margin-left: 5px; */\n  /* font-weight: bold; */\n}\nfilter .blocklist .block .blocktitle:focus {\n  border-color: var(--bg0) !important;\n}\nfilter .blocklist .block .mod {\n  margin-bottom: 10px;\n  position: relative;\n}\nfilter .btnAdd {\n  width: 100%;\n}\n/* left side */\n.leftside {\n  padding-left: 1px;\n}\n/* right side */\n.rightside {\n  padding-right: 1px;\n}\nfilter .toggle.styleChecked {\n  color: var(--front1);\n  background: var(--accent1);\n}\nfilter .toggle.styleUnchecked {\n  color: var(--front0);\n  background: transparent;\n}\n',""]);const o=r},3368:(e,t,i)=>{i.d(t,{Z:()=>o});var n=i(8081),s=i.n(n),l=i(3645),r=i.n(l)()(s());r.push([e.id,".page-host:has(items) {\n  padding-left: 7% !important;\n  padding-right: 7% !important;\n}\n",""]);const o=r},3720:(e,t,i)=>{i.d(t,{Z:()=>o});var n=i(8081),s=i.n(n),l=i(3645),r=i.n(l)()(s());r.push([e.id,"itemsheet {\n  --sheetaccent: var(--accent1);\n  --sheetaccenthover: var(--accent0);\n  width: 250px;\n  min-height: 150px;\n  display: block;\n  cursor: pointer;\n  margin: 5px;\n  padding: 5px;\n  border: 1px solid transparent;\n}\nitemsheet .itemIcon {\n  width: 40px;\n  height: 40px;\n  margin-right: 10px;\n}\nitemsheet table {\n  --bs-table-striped-bg: rgba(0, 0, 0, 0) !important;\n}\nitemsheet .title {\n  color: var(--sheetaccent);\n  font-size: 1.1rem;\n}\nitemsheet .weaponConditions {\n  padding-left: 2px;\n  opacity: 0.75;\n}\nitemsheet .weaponEffects {\n  display: block;\n  opacity: 0.75;\n}\nitemsheet .conditions {\n  border-top: 1px dashed var(--sheetaccent);\n  opacity: 0.5;\n}\nitemsheet:hover {\n  border-color: var(--sheetaccenthover);\n}\nitemsheet:hover .title {\n  color: var(--sheetaccenthover);\n}\nitemsheet:hover .conditions {\n  border-color: var(--sheetaccenthover);\n}\nitemsheet:hover .weaponEffects {\n  border-color: var(--sheetaccenthover);\n}\n",""]);const o=r},8247:(e,t,i)=>{i.d(t,{Z:()=>o});var n=i(8081),s=i.n(n),l=i(3645),r=i.n(l)()(s());r.push([e.id,"modfilterbox .selected {\n  background-color: red !important;\n}\nmodfilterbox .modsearchinput {\n  position: relative;\n}\nmodfilterbox .modsearchinput input {\n  display: block;\n}\nmodfilterbox .modsearchinput label {\n  pointer-events: none;\n  float: left;\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  top: 0px;\n  left: 0px;\n  padding-left: 3px;\n  padding-top: 2px;\n}\nmodfilterbox .modsearchinput .inputPlaceholder {\n  opacity: 0.5;\n}\n",""]);const o=r},2716:(e,t,i)=>{i.r(t),i.d(t,{items:()=>te});var n={};i.r(n),i.d(n,{default:()=>C,dependencies:()=>A,name:()=>E,register:()=>P,template:()=>$});var s={};i.r(s),i.d(s,{ModFilterBox:()=>Z});var l={};i.r(l),i.d(l,{default:()=>O,dependencies:()=>z,name:()=>D,register:()=>R,template:()=>B});var r={};i.r(r),i.d(r,{BlockFilter:()=>U,ModFilter:()=>V,filter:()=>J});var o={};i.r(o),i.d(o,{default:()=>Q,dependencies:()=>X,name:()=>_,register:()=>ee,template:()=>G});var a=i(655),d=(i(1932),i(1542)),c=i(3379),h=i.n(c),f=i(7795),p=i.n(f),m=i(569),b=i.n(m),u=i(3565),g=i.n(u),x=i(9216),v=i.n(x),y=i(4589),k=i.n(y),I=i(3368),S={};S.styleTagTransform=k(),S.setAttributes=g(),S.insert=b().bind(null,"head"),S.domAPI=p(),S.insertStyleElement=v(),h()(I.Z,S),I.Z&&I.Z.locals&&I.Z.locals;var M=i(7958),T={};T.styleTagTransform=k(),T.setAttributes=g(),T.insert=b().bind(null,"head"),T.domAPI=p(),T.insertStyleElement=v(),h()(M.Z,T),M.Z&&M.Z.locals&&M.Z.locals;var w=i(8247),L={};L.styleTagTransform=k(),L.setAttributes=g(),L.insert=b().bind(null,"head"),L.domAPI=p(),L.insertStyleElement=v(),h()(w.Z,L),w.Z&&w.Z.locals&&w.Z.locals;const E="modfilterbox",$='<div class="mod d-flex align-items-center" >\n    \x3c!-- checkbox --\x3e\n    <input class="checkbox mr-1" type="checkbox" checked.bind="data.activate" />\n    \x3c!-- mod select --\x3e\n    <div name="modsearch" class="searchable">\n\n        \x3c!-- input + text over --\x3e\n        <div class="modsearchinput">\n            <input name="modsearchinput" type="text" autocomplete="off" \n            ref="inputHtml"\n            value.bind="inputText" \n            onkeyup.call="onKeyup($event)" onkeydown.call="onKeyDown($event)"\n            onfocus.call="onFocus($event)" onblur.call="onBlur($event)"\n            >\n            <label if.bind="!data.effectId && !inputText" class="inputPlaceholder" t="quickfus.filter.addMod"></label>\n            <label if.bind="data.effectId && !inputText" class="inputOverlay" for="modsearchinput" \n                innerHtml.bind="renderCharac(data.effectId, true)">\n            </label>\n        </div>\n        \x3c!-- <button>${outputText}</button> --\x3e\n\n        \x3c!-- list of options --\x3e\n        \x3c!--  if.bind="!listHidden" --\x3e\n        <dl name="modsearchlist" class="modlist" style="display: none;" ref="modList">\n            \x3c!-- automatically filled with mods --\x3e\n            <section repeat.for="[sectionName, section] of filteredSects">\n                \x3c!-- name: ${sectionName} --\x3e\n                <dt t.bind="sectionName" style="text-align: center;"></dt>\n                \x3c!-- getModsForSection(section) --\x3e\n                <dd repeat.for="mod of section" \n                    style="padding-left: 10px;" class="${mod == selectedMod ? \'selected\' : \'\'}"\n                    data-charac="${mod.id}"\n                    innerHtml.bind="renderCharac(mod.id)"\n                    onmouseover.call="onHoverMod(mod)"\n                    onclick.call="onClickMod(mod)"\n                    >\n                </dd>\n            </section>\n        </dl>\n\n    </div>\n    \x3c!-- mod min/max --\x3e\n    <input class="ml-2 mr-2" type="number" value.bind="data.min" placeholder="min" />\n    <input class="mr-2" type="number" value.bind="data.max" placeholder="max" />\n    \x3c!-- mod delete --\x3e\n    <button class="btnDelete" onclick.call="onDelete()">x</button>\n</div>\n\n\x3c!-- <div if.bind="filteredSects">\n    allo\n    <div repeat.for="[sectionName, section] of filteredSects">\n        ${sectionName}  - ${section}\n    </div>\n</div> --\x3e\n\x3c!--\n<div class="combobox">\n\t<input type="text" [(ngModel)]="inputItem" (ngModelChange)="getFilteredList()" class="combobox-input" \n    (keyup)="onKeyPress($event)" (blur)="toggleListDisplay(0)" (focus)="toggleListDisplay(1)" \n    placeholder="Select one..." [ngClass]="{\'error\': showError}">\n  <span *ngIf="showError" class="error-text"><i>Invalid Selection.</i></span>\n  <div class="combobox-options" *ngIf="!listHidden">\n    <list-item *ngFor="let item of filteredList;let i = index" (click)="selectItem(i)" \n        [ngClass]="{\'selected\': i===selectedIndex}">{{item}}\n    </list-item>\n  </div>\n</div>\n--\x3e\n',C=$,A=[];let W;function P(e){W||(W=d.b_N.define({name:E,template:$,dependencies:A})),e.register(W)}var F=i(5385),N=i(9344),j=i(2013),H=i(7296);let Z=class{constructor(e,t,i){this.db=e,this.i18n=t,this.ea=i,this.inputText="",this.selectedIndex=0,this.filteredSects=new Map;for(let e of this.getStatSections())this.filteredSects.set(e[0],this.getModsForSection(e[1]))}onKeyup(e){this.filterList()}onKeyDown(e){"Escape"===e.key&&(this.selectedIndex=0,this.inputText="",this.inputHtml.blur()),"Enter"===e.key&&(this.selectedMod=this.getModAtIndex(this.selectedIndex),this.onClickMod(this.selectedMod)),"ArrowDown"===e.key?(this.selectedIndex++,this.selectedIndex>=this.filteredSize()&&(this.selectedIndex=0),this.selectedMod=this.getModAtIndex(this.selectedIndex)):"ArrowUp"===e.key&&(this.selectedIndex--,this.selectedIndex<0&&(this.selectedIndex=this.filteredSize()-1),this.selectedMod=this.getModAtIndex(this.selectedIndex)),this.scrollToSelected()}onFocus(e){this.inputText="",this.filterList(),this.toggleListVisibility(!0)}onBlur(e){this.toggleListVisibility(!1)}onDelete(){this.ea.publish("quickfus:mod:delete",{data:this.data,blockid:this.blockid})}onClickMod(e){var t;this.data.pseudoName=null!==(t=e.name)&&void 0!==t?t:"",this.data.effectId=e.id,this.inputText="",this.inputHtml.blur()}onHoverMod(e){this.selectedMod=e}toggleListVisibility(e){if(e)this.modList.style.display="block";else{let e=this.modList;setTimeout((function(){e.style.display="none"}),100)}}scrollToSelected(){if(!this.selectedMod)return;let e=this.selectedMod.id;for(let t of this.modList.children)for(let i of t.children)if(i.getAttribute("title")==e.toString()){i.scrollIntoView({behavior:"auto",block:"nearest",inline:"nearest"});break}}filterList(){let e=new RegExp(H.D.caseAndAccentInsensitive(this.inputText),"i");if(""!==this.inputText){this.filteredSects.clear();for(let t of this.getStatSections()){let i=this.i18n.tr(t[0]);if(e.test(i))this.filteredSects.set(t[0],this.getModsForSection(t[1]));else{let i=this.getModsForSection(t[1]);this.filteredSects.set(t[0],i.filter((t=>e.test(this.getModName(t)))))}}}else{this.filteredSects.clear();for(let e of this.getStatSections())this.filteredSects.set(e[0],this.getModsForSection(e[1]))}}getModName(e){return e.nameId?this.getI18n(e.nameId):e.name?this.i18n.tr("quickfus.filter.pseudo."+e.name):void 0}getModAtIndex(e){let t=0;for(let i of this.filteredSects)for(let n of i[1]){if(t==e)return n;t++}return null}filteredSize(){let e=0;for(let t of this.filteredSects)e+=this.filteredSects.get(t[0]).length;return e}getCharac(e){let t=this.db.data.jsonCharacteristicsById[e];return t||(t=this.db.pseudoCharacs.find((t=>t.id==e))),t}renderCharac(e,t){var i;let n=this.getCharac(e),s=this.getModName(n),l="";n.asset&&(l="background: transparent url('"+this.db.commonUrlPath+"characteristics/"+(null===(i=n.asset)||void 0===i?void 0:i.replace("tx_",""))+".png');background-size: contain; background-repeat: no-repeat;width: 22px; height: 22px; margin-right: 5px;");let r="";if(t){let e=n.categoryId-1;e<0&&(e=0);let t=Array.from(j.db.getStatSections().keys())[e];r="<div style='margin-right: 5px;'>["+this.i18n.tr(t)+"]</div>"}return`\n            <div class="d-flex">\n                ${r}\n                <div style="${l}"></div>\n                <div>${s}</div>\n            </div>\n        `}getStatSections(){return j.db.getStatSections()}getModsForSection(e){return 0==e?this.db.pseudoCharacs:this.db.data.jsonCharacteristics.filter((t=>t.categoryId==e)).sort(((e,t)=>e.order-t.order))}getI18n(e){return this.db.getI18n(e.toString())}};(0,a.gn)([d.ExJ,(0,a.w6)("design:type",Number)],Z.prototype,"blockid",void 0),(0,a.gn)([d.ExJ,(0,a.w6)("design:type",Object)],Z.prototype,"data",void 0),Z=(0,a.gn)([(0,d.MoW)(n),(0,a.fM)(1,F.mb),(0,a.fM)(2,N.Rp),(0,a.w6)("design:paramtypes",[j.db,Object,Object])],Z);const D="filter",B='\n\n\n\n\x3c!-- Search --\x3e\n<div class="row" if.bind="isLoaded">\n    <input class="search" type="text" value.bind="filterText" placeholder="search..." focus="true" />\n</div>\n\n\x3c!-- tagify search box ? = search sur item names, panoplies, effets, types d\'items (capecoiffe..).... --\x3e\n\x3c!-- exemple tu clic sur [() Agilité ] et ça remplace le text par 2 box min/max à côté de l\'icône d\'agi --\x3e\n\n<div class="row" if.bind="isLoaded">\n    \x3c!--Generic filters left side --\x3e\n    <div class="leftside col">\n        \x3c!-- Level --\x3e\n        <div class="d-flex align-items-center">\n            <input class="checkbox mr-1" type="checkbox" id="level" checked.bind="filterLevel" />\n            <label class="title mr-auto" for="level" t="quickfus.filter.level"></label>\n            <input class="mr-2" type="number" value.bind="levelMin" placeholder="min" />\n            <input class="" type="number" value.bind="levelMax" placeholder="max" />\n        </div>\n\n        \x3c!-- Types base --\x3e\n        <input class="checkbox" type="checkbox" id="type" checked.bind="filterType" onclick.call="filterTypeClicked()" />\n        <label class="title" for="type" t="quickfus.filter.type"></label>\n        <div class="d-flex flex-wrap">\n            <div repeat.for="[type, value] of types" class="toggle ${value ? \'styleChecked\' : \'styleUnchecked\'}" onclick.call="checkType(type)">\n                \x3c!-- <input type="checkbox" id="${type}" value="type" checked /> --\x3e\n                <label for="${type}">${translateItemType(type)}</label>\n            </div>\n        </div>\n\n        \x3c!-- Types weapons --\x3e\n        <input class="checkbox" type="checkbox" id="armes" checked.bind="filterWeapon" onclick.call="filterWeaponClicked()" />\n        <label class="title" for="armes" t="quickfus.filter.weapons"></label>\n        <div class="d-flex flex-wrap">\n            <div repeat.for="[arme, value] of armes" class="toggle ${value ? \'styleChecked\' : \'styleUnchecked\'}" onclick.call="checkWeapon(arme)">\n                \x3c!-- <input type="checkbox" id="${arme}" value="arme" checked /> --\x3e\n                <label for="${arme}">${translateItemType(arme)}</label>\n            </div>\n        </div>\n    </div>\n\n    \x3c!-- Mods --\x3e\n    <div class="rightside col">\n        \x3c!-- Mods --\x3e\n        <input class="checkbox" type="checkbox" id="mods" checked.bind="filterStats" />\n        <label class="title" for="mods" t="quickfus.filter.mods"></label>\n        \x3c!-- block list  --\x3e\n        <div class="blocklist" ref="blocklist">\n            \x3c!-- blocks  --\x3e\n            <div class="block" repeat.for="i of blocks.length" id.bind="i">\n                \x3c!-- block properties --\x3e\n                <div class="d-flex align-items-center">\n                    <input class="checkbox mr-1" type="checkbox" id="${i}" checked.bind="blocks[i].activate" />\n                    <select class="mr-auto blocktitle" name="type" value.bind="blocks[i].type">\n                        <option value="$and"  t="quickfus.filter.and"></option>\n                        <option value="$or"   t="quickfus.filter.or"></option>\n                        <option value="$nor"  t="quickfus.filter.nor"></option>\n                        <option value="$sum"  t="quickfus.filter.sum"></option>\n                    </select>\n                    <button class="btnDelete" onclick.call="deleteBlock(i)">x</button>\n                </div>\n\n                \x3c!-- mod list --\x3e\n                <modfilterbox repeat.for="mod of blocks[i].mods" data.bind="mod" blockid.bind="i"></modfilterbox>\n\n                \x3c!-- create mod --\x3e\n                <button class="btnAdd" click.delegate="addStatMod($event, i)" t="quickfus.filter.addMod"></button>\n            </div> \x3c!-- end of blocks --\x3e\n\n            \x3c!-- create block --\x3e\n            <div class="block">\n                <button class="btnAdd" onclick.call="addBlock()" t="quickfus.filter.addBlock"></button>\n            </div>\n        </div>\n    </div>\n</div>\n\n\x3c!-- Search button --\x3e\n<div class="row" if.bind="isLoaded">\n    <button class="btnSearch" onclick.call="search()">Search</button>\n</div>\n',O=B,z=[s];let q;function R(e){q||(q=d.b_N.define({name:D,template:B,dependencies:z})),e.register(q)}let J=class{constructor(e,t){this.db=e,this.ea=t,this.isSaveLoaded=!1,this.filterText="",this.filterLevel=!0,this.levelMin=1,this.levelMax=200,this.types=new Map,this.armes=new Map,this.filterType=!1,this.filterWeapon=!1,this.filterStats=!0,this.blocks=[],this.redListTypes=[265,267,169,99,83,20,21],console.log("filter ctor"),this.addBlock(),this.db.isLoaded?(console.log("filter ctor1"),this.onLoad()):(console.log("filter ctor2"),this.ea.subscribe("db:loaded",(()=>{this.onLoad()}))),this.ea.subscribe("quickfus:mod:delete",(e=>{console.log("filter onDeleteMod ["+e.blockid+"]: "+JSON.stringify(e.data));let t=this.blocks[e.blockid].mods.find((t=>t.effectId==e.data.effectId));if(t){let i=this.blocks[e.blockid].mods.indexOf(t);this.blocks[e.blockid].mods.splice(i,1)}}))}get isLoaded(){return this.db.isLoaded&&this.isSaveLoaded}onLoad(){console.log("filter onLoad"),0==this.types.size&&this.db.data.jsonItemTypes.filter((e=>2!=e.superTypeId&&!this.redListTypes.includes(e.id))).forEach((e=>this.types.set(+e.id,!1))),0==this.armes.size&&this.db.data.jsonItemTypes.filter((e=>2==e.superTypeId&&!this.redListTypes.includes(e.id))).forEach((e=>this.armes.set(+e.id,!1))),this.loadFilter(),this.search()}loadFilter(){let e=localStorage.getItem("filter");if(e){let t=JSON.parse(e);this.filterLevel=t.filterLevel,this.filterText=t.filterText,this.levelMin=t.levelMin,this.levelMax=t.levelMax;for(let e of t.types)this.types.has(e[0])&&this.types.set(e[0],e[1]);for(let e of t.armes)this.armes.has(e[0])&&this.armes.set(e[0],e[1]);this.filterLevel=t.filterLevel,this.filterType=t.filterType,this.filterWeapon=t.filterWeapon,this.filterStats=t.filterStats,this.blocks=t.blocks}this.isSaveLoaded=!0}saveFilter(){let e={filterText:this.filterText,levelMin:this.levelMin,levelMax:this.levelMax,types:Array.from(this.types.entries()),armes:Array.from(this.armes.entries()),filterLevel:this.filterLevel,filterType:this.filterType,filterWeapon:this.filterWeapon,filterStats:this.filterStats,blocks:this.blocks};localStorage.setItem("filter",JSON.stringify(e))}search(){this.saveFilter(),this.ea.publish("items:search",this)}addBlock(){let e=new U,t=new V;e.mods.push(t),this.blocks.push(e)}addStatMod(e,t){this.blocks[t].mods.push(new V),e.target.previousElementSibling.getElementsByTagName("input")[1].focus()}deleteBlock(e){this.blocks.splice(e,1)}filterTypeClicked(){var e=this.filterType;this.types.forEach(((t,i)=>this.types.set(i,!e)))}filterWeaponClicked(){var e=this.filterWeapon;this.armes.forEach(((t,i)=>this.armes.set(i,!e)))}checkType(e){this.types.set(e,!this.types.get(e)),this.filterType=this.hasValue(this.types,!0)}checkWeapon(e){this.armes.set(e,!this.armes.get(e)),this.filterWeapon=this.hasValue(this.armes,!0)}hasValue(e,t){for(const[i,n]of Array.from(e.entries()))if(n==t)return!0;return!1}getStatSections(){return j.db.getStatSections()}getModsForSection(e){return this.db.data.jsonCharacteristics.filter((t=>t.categoryId==e)).sort(((e,t)=>e.order-t.order))}getI18n(e){return this.db.getI18n(e.toString())}translateItemType(e){let t=this.db.data.jsonItemTypes.find((t=>t.id==e));return this.getI18n(t.nameId)}};J=(0,a.gn)([(0,d.MoW)(l),(0,N.f3)(j.db),(0,a.fM)(1,N.Rp),(0,a.w6)("design:paramtypes",[j.db,Object])],J);class U{constructor(){this.type="$and",this.activate=!0,this.mods=[]}}class V{constructor(){this.activate=!0}}var K=i(9779);const _="items",G='\n\n\n\n\x3c!-- if.bind="db.isLoaded && mason.data.length != 0" --\x3e\n<filter ref="filterEle"></filter>\n\n\x3c!-- ${mason.data.length} --\x3e\n\x3c!-- <button if.bind="mason.data.length != 0" click.delegate="search()">Search</button> --\x3e\n\n\x3c!-- spinner --\x3e\n\x3c!-- mason.data.length == 0 --\x3e\n<div if.bind="searching" class="loaderContainer">\n    <div class="loader"></div>\n</div>\n\n\x3c!-- <div if.bind="db.isLoaded && isLoaded && items.length > 0"> --\x3e\n\n\n\x3c!-- <div class="d-flex"> --\x3e\n\x3c!-- <itemsheet repeat.for="item of items" item.bind="item"></itemsheet> --\x3e\n\x3c!-- </div> --\x3e\n\n<div class="grid-wrapper">\n    \x3c!--  data-masonry=\'{ "itemSelector": ".grid-item", "columnWidth": 200 }\' --\x3e\n    <div class="grid" ref="grid">\n        <itemsheet class="grid-item" repeat.for="item of mason.data" item.bind="item"></itemsheet>\n    </div>\n</div>\n\n\x3c!-- </div> --\x3e\n',Q=G,X=[r,K];let Y;function ee(e){Y||(Y=d.b_N.define({name:_,template:G,dependencies:X})),e.register(Y)}i(9996);let te=class{constructor(e,t){this.db=e,this.ea=t,this.debouncedShowMore=H.D.debounce((()=>{this.mason.showMore()}),500,!0),this.searching=!0,console.log("items ctor"),this.mason=new H.I;let i=H.D.debounce((()=>{this.mason.reloadMsnry()}),200,!1);this.ea.subscribe("itemsheet:loaded",(()=>{i()})),this.ea.subscribe("items:search",(e=>this.search(e)))}isLoaded(){return this.db.isLoaded}attached(){console.log("itemsearch attached grid: "+this.grid),this.mason.obj=this,this.mason.initMasonry(),this.pageHost=document.getElementsByClassName("page-host")[0];let e=t=>{this.grid?setTimeout((()=>this.onScroll(t))):this.pageHost.removeEventListener("scroll",e,!1)};this.pageHost.addEventListener("scroll",e)}async onScroll(e){let t=this.pageHost.clientHeight,i=this.grid.scrollHeight+this.grid.offsetTop-t,n=this.pageHost.scrollTop;Math.abs(n-i)<=15&&this.debouncedShowMore()}async search(e=null){console.log("on search: "+e),this.mason.data=[],this.mason.fulldata=[],this.mason.page=0,this.filterData(e),this.mason.showMore(),this.searching=!1}filterData(e=null){if(!e)return;let t=this.db.data.jsonItems.filter((t=>{if(e.filterLevel){if(t.level<e.levelMin)return!1;if(t.level>e.levelMax)return!1}let i=!(e.filterType||e.filterWeapon);if(e.filterType&&(i=i||e.types.get(t.typeId)),e.filterWeapon&&(i=i||e.armes.get(t.typeId)),!i)return!1;if(e.filterText&&""!=e.filterText.trim()){let i=new RegExp(H.D.caseAndAccentInsensitive(e.filterText.trim()),"i"),n=this.db.getI18n(t.nameId);if(!i.test(n))return!1}if(e.filterStats)for(let i of e.blocks)if(i.activate)if("$sum"==i.type){if(!this.filterSumMemory(i,t))return!1}else{let e=i.mods.filter((e=>e.activate&&e.effectId)).map((e=>e.effectId>=1e4?this.filterStatMemoryPseudo(e,t):this.filterStatMemory(e,t)));if(e.length>0){if("$and"==i.type&&e.includes(!1))return!1;if("$or"==i.type&&!e.includes(!0))return!1;if("$nor"==i.type&&e.includes(!0))return!1}}return!0})).sort(((e,t)=>{let i=t.level-e.level;return 0!=i?i:t.id-e.id}));console.log("filter result: "+t.length+", from "+this.db.data.jsonItems.length),this.mason.fulldata.push(...t)}filterSumMemory(e,t){let i=e.mods.map((e=>e.effectId)),n=t.possibleEffects.filter((e=>i.includes(this.getEffect(e).characteristic))).reduce(((e,t)=>{let i=this.getEffect(t),n=t.diceNum*i.bonusType,s=t.diceSide*i.bonusType;return 0==s?e+n:e+s}),0),s=e.mods[0].min||-1e5,l=e.mods[0].max||1e5;return!(n<s||n>l)}filterStatMemory(e,t){if(!e.effectId)return!0;let i=parseInt(e.min+""),n=parseInt(e.max+"");return e.min||(i=-1e5),t.possibleEffects.some((t=>{let s=this.getEffect(t);if(s.characteristic!=e.effectId)return!1;if(s.useInFight)return!1;let l=t.diceNum*s.bonusType,r=t.diceSide*s.bonusType;if(e.max){let e=r>=i&&r<=n;return l>=i&&l<=n||e}{let e=r>=i;return l>=i||e}}))}filterStatMemoryPseudo(e,t){let i=parseInt(e.min+""),n=parseInt(e.max+"");e.min||(i=-1e5);let s=this.db.pseudoCharacs.find((t=>t.id==e.effectId)),l=t.possibleEffects.filter((e=>s.mask.includes(this.getEffect(e).characteristic)));if(s.count){let t=l.length;if(e.min&&t<i)return!1;if(e.max&&t>n)return!1}else{let t=l.reduce(((e,t)=>{let i=this.getEffect(t),n=t.diceNum*i.bonusType,s=t.diceSide*i.bonusType;return 0==s?e+n:e+s}),0);if(e.min&&t<i)return!1;if(e.max&&t>n)return!1}return!0}getEffect(e){var t;return null!==(t=e.effect)&&void 0!==t||(e.effect=this.db.data.jsonEffectsById[e.effectId]),e.effect}};te=(0,a.gn)([(0,d.MoW)(o),(0,N.f3)(j.db),(0,a.fM)(1,N.Rp),(0,a.w6)("design:paramtypes",[j.db,Object])],te)},9779:(e,t,i)=>{i.r(t),i.d(t,{itemsheet:()=>P});var n={};i.r(n),i.d(n,{default:()=>M,dependencies:()=>T,name:()=>I,register:()=>L,template:()=>S});var s=i(655),l=(i(1932),i(1542)),r=i(3379),o=i.n(r),a=i(7795),d=i.n(a),c=i(569),h=i.n(c),f=i(3565),p=i.n(f),m=i(9216),b=i.n(m),u=i(4589),g=i.n(u),x=i(3720),v={};v.styleTagTransform=g(),v.setAttributes=p(),v.insert=h().bind(null,"head"),v.domAPI=d(),v.insertStyleElement=b(),o()(x.Z,v),x.Z&&x.Z.locals&&x.Z.locals;var y=i(2303),k=i(6694);const I="itemsheet",S='\n\n\n\n<div if.bind="item" data-id="${item.id}">\n    <div class="d-flex">\n        <img class="itemIcon" src="${itemIconUrl}" loading="lazy"/>\n        <div>\n            ${db.getI18n(item.nameId)}\n            <br>\n            ${item.level} \n            \x3c!-- - ${item.id} --\x3e\n            \x3c!-- typeId --\x3e\n        </div>\n    </div>\n\n    \x3c!-- weapon stuff --\x3e\n    <div class="weaponConditions" if.bind="isWeapon">\n        \x3c!-- minrange, range, apCost, maxCastPerTurn, criticalHitProbability, criticalHitBonus  --\x3e\n        \x3c!-- castInDiagonal, castTestLos --\x3e\n        <div>${item.apCost}PA ${item.minRange}-${item.range}PO ${item.maxCastPerTurn}/t ${item.criticalHitProbability}% +${item.criticalHitBonus}</div>\n        <div></div>\n    </div>\n\n    \x3c!-- weapon effects --\x3e\n    <effectlist class="weaponEffects" if.bind="isWeapon" effects.bind="weaponEffects" iscrit.bind="false" depth.bind="0"></effectlist>\n\n    \x3c!-- boost effects --\x3e\n    <effectlist effects.bind="sortedEffects" iscrit.bind="false" depth.bind="0"></effectlist>\n\n    \x3c!-- conditions --\x3e\n    <div class="conditions" if.bind="hasConditions">\n        \x3c!-- "criteria": "CS>300&CI>300", --\x3e\n        ${getConditionsString()}\n    </div>\n\n</div>\n',M=S,T=[y,k];let w;function L(e){w||(w=l.b_N.define({name:I,template:S,dependencies:T})),e.register(w)}var E=i(7796),$=i(2013),C=i(232),A=i(5385),W=i(9344);let P=class{constructor(e,t,i,n){this.i18n=i,this.ea=n,this.db=e,this.conditionRenderer=t}attached(){this.ea.publish("itemsheet:loaded")}get itemIconUrl(){return this.db.gitFolderPath+"sprites/items/"+this.item.iconId+".png"}get sortedEffects(){return this.item.possibleEffects.filter((e=>!this.getEffect(e).useInFight))}getEffect(e){var t;return null!==(t=e.effect)&&void 0!==t||(e.effect=this.db.data.jsonEffectsById[e.effectId]),e.effect}get weaponEffects(){return this.item.possibleEffects.filter((e=>this.getEffect(e).useInFight))}get isWeapon(){return this.item.apCost||this.item.maxCastPerTurn}get hasConditions(){return this.item.criteria&&"null"!=this.item.criteria}getConditionsString(){let e="",t=C.Gw.parse(this.item.criteria);return e=JSON.stringify(t),this.conditionRenderer.render(t)}};(0,s.gn)([l.ExJ,(0,s.w6)("design:type",Object)],P.prototype,"item",void 0),P=(0,s.gn)([(0,l.MoW)(n),(0,s.fM)(2,A.mb),(0,s.fM)(3,W.Rp),(0,s.w6)("design:paramtypes",[$.db,E.A,Object,Object])],P)},7296:(e,t,i)=>{i.d(t,{D:()=>l,I:()=>s});var n=i(8751);class s{constructor(){this.fulldata=[],this.data=[],this.page=0,this.itemsPerPage=30}async showMore(){let e=this.page*this.itemsPerPage,t=this.fulldata.slice(e,e+this.itemsPerPage);this.data.push(...t),this.page++}async reloadMsnry(){this.msnry&&(this.msnry.reloadItems(),this.msnry.layout())}initMasonry(){console.log("mason init grid: "+this.obj.grid),this.obj.grid&&(this.msnry&&this.msnry.destroy(),this.msnry=new n(this.obj.grid,{itemSelector:".grid-item",columnWidth:".grid-item",gutter:10,fitWidth:!0}),this.msnry.layout())}}class l{static caseAndAccentInsensitive(e){const t=function(e){let t={};for(;e.length>0;){let i="["+e.shift()+"]",n=i.split("");for(;n.length>0;)t[n.shift()]=i}return t}(["aàáâãäå","cç","eèéêë","iìíîï","nñ","oòóôõöø","sß","uùúûü","yÿ"]);return function(e){var i="";if(!e)return i;e=e.toLowerCase();for(var n=0;n<e.length;n++){let s=e.charAt(n);i+=t[s]||s}return i}(e)}static debounce(e,t,i){var n;return function(){var s=this,l=arguments,r=i&&!n;clearTimeout(n),n=setTimeout((()=>{n=null,i||e.apply(s,l)}),t),r&&e.apply(s,l)}}}}}]);