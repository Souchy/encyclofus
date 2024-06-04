"use strict";(self.webpackChunkencyclofus=self.webpackChunkencyclofus||[]).push([[390],{3720:(e,t,i)=>{i.d(t,{Z:()=>r});var n=i(8081),s=i.n(n),a=i(3645),o=i.n(a)()(s());o.push([e.id,"itemsheet {\n  --sheetaccent: var(--accent1);\n  --sheetaccenthover: var(--accent0);\n  width: 250px;\n  min-height: 150px;\n  display: block;\n  cursor: pointer;\n  margin: 5px;\n  padding: 5px;\n  background-color: var(--bs-body-bg);\n  border: 1px solid transparent;\n}\nitemsheet .itemIcon {\n  width: 40px;\n  height: 40px;\n  margin-right: 10px;\n}\nitemsheet table {\n  --bs-table-striped-bg: rgba(0, 0, 0, 0) !important;\n}\nitemsheet .title {\n  color: var(--sheetaccent);\n  font-size: 1.1rem;\n}\nitemsheet .weaponConditions {\n  padding-left: 2px;\n  opacity: 0.75;\n}\nitemsheet .weaponEffects {\n  display: block;\n  opacity: 0.75;\n}\nitemsheet .conditions {\n  border-top: 1px dashed var(--sheetaccent);\n  opacity: 0.5;\n}\nitemsheet .btn.btn-compare {\n  right: 5px;\n  position: absolute;\n  margin-left: auto;\n  width: 24px;\n  height: 24px;\n  color: var(--bs-body-color);\n  background-color: var(--bs-body-bg);\n  z-index: 3;\n  padding: 0px !important;\n}\nitemsheet .btn.btn-compare i {\n  font-size: 0.7rem;\n}\nitemsheet .btn.btn-compare:hover {\n  color: var(--bs-body-bg);\n  background-color: var(--bs-body-color);\n}\nitemsheet.hiddensheet {\n  display: none;\n}\nitemsheet:hover {\n  border-color: var(--sheetaccenthover);\n  z-index: 5;\n}\nitemsheet:hover .title {\n  color: var(--sheetaccenthover);\n}\nitemsheet:hover .conditions {\n  border-color: var(--sheetaccenthover);\n}\nitemsheet:hover .weaponEffects {\n  border-color: var(--sheetaccenthover);\n}\n",""]);const r=o},6682:(e,t,i)=>{i.d(t,{Z:()=>r});var n=i(8081),s=i.n(n),a=i(3645),o=i.n(a)()(s());o.push([e.id,"sets .infgrid {\n  display: flex;\n  flex-wrap: wrap;\n  height: 100%;\n}\nsets .grid-item {\n  width: 250px;\n}\n",""]);const r=o},254:(e,t,i)=>{i.d(t,{Z:()=>r});var n=i(8081),s=i.n(n),a=i(3645),o=i.n(a)()(s());o.push([e.id,"setsheet {\n  --sheetaccent: var(--accent1);\n  --sheetaccenthover: var(--accent0);\n  width: 250px;\n  min-height: 150px;\n  display: block;\n  margin: 5px;\n  padding: 5px;\n  background-color: var(--bs-body-bg);\n  border: 1px solid transparent;\n}\nsetsheet .itemCountChoice {\n  display: flex;\n  flex-wrap: wrap;\n}\nsetsheet .itemCountChoice .radioDark {\n  opacity: 0.9;\n  margin-right: 2px;\n}\nsetsheet .items {\n  flex-wrap: wrap;\n}\nsetsheet .itemIcon {\n  width: 40px;\n  height: 40px;\n  margin-right: 10px;\n}\nsetsheet .btn.btn-compare {\n  color: var(--bs-body-color);\n  background-color: var(--bs-body-bg);\n}\nsetsheet .btn.btn-compare:hover {\n  color: var(--bs-body-bg);\n  background-color: var(--bs-body-color);\n}\nsetsheet .statistics {\n  padding: 5px;\n}\nsetsheet .title {\n  padding: 5px;\n  font-size: 1.1rem;\n}\nsetsheet:hover {\n  border: 1px solid var(--sheetaccenthover);\n  z-index: 5;\n}\nsetsheet:hover .title {\n  color: var(--sheetaccenthover);\n}\nsetsheet .items {\n  display: flex;\n}\nsetsheet .items .item itemsheet {\n  /* Position the tooltip */\n  position: absolute;\n  visibility: collapse;\n  margin-left: -1px;\n  width: 260px;\n  background-color: var(--bg0);\n  pointer-events: none;\n  border: 1px solid var(--accent0);\n  z-index: 2;\n}\nsetsheet .items .item:hover itemsheet,\nsetsheet:hover .items .item:hover itemsheet {\n  visibility: visible;\n  opacity: 99%;\n}\nsetsheet .totalStats {\n  /* Position the tooltip */\n  position: absolute;\n  visibility: collapse;\n  padding-left: 5px;\n  margin-left: -1px;\n  width: 260px;\n  background-color: var(--bg0);\n  border: 1px solid var(--accent0);\n  border-top: none;\n  z-index: 1;\n}\nsetsheet:hover .totalStats {\n  visibility: visible;\n  opacity: 99%;\n}\n",""]);const r=o},9779:(e,t,i)=>{i.r(t),i.d(t,{itemsheet:()=>B});var n={};i.r(n),i.d(n,{default:()=>E,dependencies:()=>S,name:()=>w,register:()=>k,template:()=>C});var s=i(655),a=(i(1932),i(1542)),o=i(3379),r=i.n(o),d=i(7795),c=i.n(d),l=i(569),h=i.n(l),f=i(3565),m=i.n(f),p=i(9216),b=i.n(p),g=i(4589),u=i.n(g),v=i(3720),x={};x.styleTagTransform=u(),x.setAttributes=m(),x.insert=h().bind(null,"head"),x.domAPI=c(),x.insertStyleElement=b(),r()(v.Z,x),v.Z&&v.Z.locals&&v.Z.locals;var y=i(2303),I=i(6694);const w="itemsheet",C='\n\n\n\x3c!-- <template class.bind="renderClass"> --\x3e\n    <div if.bind="shouldRender" data-id="${item.id}" >\n        <div class="d-flex">\n            <img class="itemIcon" src="${itemIconUrl}" loading="lazy"/>\n            <div>\n                ${db.getI18n(item.nameId)}\n                <br>\n                <div class="d-flex">\n                    ${item.level} \n                    \x3c!-- Bouton pour comparer avec la dernière version --\x3e\n                    <button class="btn btn-compare" click.trigger="comparing = !comparing">\n                    <i class="fa-solid fa-code-compare"></i>\n                    </button>\n                </div>\n                \x3c!-- - ${item.id} --\x3e\n                \x3c!-- typeId --\x3e\n            </div>\n\n        </div>\n\n        \x3c!-- weapon stuff --\x3e\n        <div class="weaponConditions" if.bind="isWeapon">\n            \x3c!-- minrange, range, apCost, maxCastPerTurn, criticalHitProbability, criticalHitBonus  --\x3e\n            \x3c!-- castInDiagonal, castTestLos --\x3e\n            <div>${item.apCost}PA ${item.minRange}-${item.range}PO ${item.maxCastPerTurn}/t ${item.criticalHitProbability}% +${item.criticalHitBonus}</div>\n            <div></div>\n        </div>\n\n        \x3c!-- weapon effects --\x3e\n        \x3c!-- boost effects --\x3e\n        \x3c!-- <effectlist class="weaponEffects" if.bind="isWeapon" effects.bind="weaponEffects" iscrit.bind="false" sourcetype="weaponEffects" depth.bind="0"></effectlist>\n        <effectlist effects.bind="sortedEffects" iscrit.bind="false" sourcetype="itemEffects" depth.bind="0"></effectlist> --\x3e\n\n        \x3c!-- weapon effects --\x3e\n        \x3c!-- boost effects --\x3e\n        <template if.bind="comparing">\n            \x3c!-- <template if.bind="hasDifference"> --\x3e\n                <effectlist class="weaponEffects" if.bind="isWeapon" effects.bind="weaponEffects" iscrit.bind="false" sourcetype="weaponEffects" comparing.to-view="true" depth.bind="0"></effectlist>\n                <effectlist if.bind="finishedComparison" effects.bind="comparedEffects" iscrit.bind="false" sourcetype="itemEffects" comparing.to-view="true" depth.bind="0"></effectlist>\n            \x3c!-- </template>\n            <template else>\n                <div>Aucune modification</div>\n            </template> --\x3e\n        </template>\n        <template else>\n            <effectlist class="weaponEffects" if.bind="isWeapon" effects.bind="weaponEffects" iscrit.bind="false" sourcetype="weaponEffects" depth.bind="0"></effectlist>\n            <effectlist effects.bind="sortedEffects" iscrit.bind="false" sourcetype="itemEffects" depth.bind="0"></effectlist>\n        </template>\n\n\n        \x3c!-- conditions --\x3e\n        <div class="conditions" if.bind="hasConditions">\n            \x3c!-- "criteria": "CS>300&CI>300", --\x3e\n            ${getConditionsString()}\n        </div>\n\n    </div>\n\n\x3c!-- </template> --\x3e\n',E=C,S=[y,I];let $;function k(e){$||($=a.b_N.define({name:w,template:C,dependencies:S})),e.register($)}var M=i(7796),j=i(2013),P=i(232),L=i(5385),T=i(944),N=i(9344);let B=class{constructor(e,t,i,n){this.i18n=i,this.ea=n,this.comparing=!1,this.finishedComparison=!1,this.db=e,this.conditionRenderer=t}binding(){setTimeout((()=>this.promiseComparison=this.loadComparison()),0)}async attached(){this.comparing&&await this.promiseComparison,this.ea.publish("itemsheet:loaded")}get itemIconUrl(){return this.db.gitFolderPath+"sprites/items/"+this.item.iconId+".png"}get sortedEffects(){return this.item.possibleEffects.filter((e=>!this.getEffect(e).useInFight))}getEffect(e){var t;return null!==(t=e.effect)&&void 0!==t||(e.effect=this.db.data.jsonEffectsById[e.effectId]),e.effect}get weaponEffects(){return this.item.possibleEffects.filter((e=>this.getEffect(e).useInFight))}get isWeapon(){return!!this.item.apCost||!!this.item.maxCastPerTurn}get hasConditions(){return this.item.criteria&&"null"!=this.item.criteria}getConditionsString(){let e="",t=P.Gw.parse(this.item.criteria);return e=JSON.stringify(t),this.conditionRenderer.render(t)}async loadComparison(){var e;if(this.comparedEffects=[],this.item.id in this.db.data2.jsonItemsById==0)return this.finishedComparison=!0,void(this.comparedEffects=this.sortedEffects);let t=this.db.data2.jsonItemsById[this.item.id];if(!t.possibleEffects[0].effect)for(let i of t.possibleEffects)null!==(e=i.effect)&&void 0!==e||(i.effect=this.db.data2.jsonEffectsById[i.effectId]);this.comparedEffects=[];for(let e of this.item.possibleEffects){if(!e)continue;let t=Object.assign({},e);this.comparedEffects[t.effectId]=t}for(let e of t.possibleEffects)if(e)if(e.effectId in this.comparedEffects){let t=this.comparedEffects[e.effectId];t.diceNum=t.diceNum-e.diceNum,t.diceSide=t.diceSide-e.diceSide}else{let t=Object.assign({},e);this.comparedEffects[t.effectId]=t,t.diceNum=0-e.diceNum,t.diceSide=0-e.diceSide}this.finishedComparison=!0}get shouldRender(){return!!this.item}get renderClass(){return this.shouldRender?"":"hiddensheet"}};(0,s.gn)([a.ExJ,(0,s.w6)("design:type",Object)],B.prototype,"item",void 0),(0,s.gn)([a.ExJ,(0,s.w6)("design:type",Boolean)],B.prototype,"comparing",void 0),(0,s.gn)([T.LO,(0,s.w6)("design:type",Boolean)],B.prototype,"finishedComparison",void 0),B=(0,s.gn)([(0,a.MoW)(n),(0,s.fM)(2,L.mb),(0,s.fM)(3,N.Rp),(0,s.w6)("design:paramtypes",[j.db,M.A,Object,Object])],B)},6390:(e,t,i)=>{i.r(t),i.d(t,{sets:()=>Y});var n={};i.r(n),i.d(n,{default:()=>L,dependencies:()=>T,name:()=>j,register:()=>B,template:()=>P});var s={};i.r(s),i.d(s,{setsheet:()=>H});var a={};i.r(a),i.d(a,{default:()=>W,dependencies:()=>R,name:()=>A,register:()=>J,template:()=>z});var o={};i.r(o),i.d(o,{Setfilter:()=>q});var r={};i.r(r),i.d(r,{default:()=>G,dependencies:()=>K,name:()=>U,register:()=>V,template:()=>_});var d=i(655),c=(i(1932),i(1542)),l=i(3379),h=i.n(l),f=i(7795),m=i.n(f),p=i(569),b=i.n(p),g=i(3565),u=i.n(g),v=i(9216),x=i.n(v),y=i(4589),I=i.n(y),w=i(6682),C={};C.styleTagTransform=I(),C.setAttributes=u(),C.insert=b().bind(null,"head"),C.domAPI=m(),C.insertStyleElement=x(),h()(w.Z,C),w.Z&&w.Z.locals&&w.Z.locals;var E=i(9779),S=i(254),$={};$.styleTagTransform=I(),$.setAttributes=u(),$.insert=b().bind(null,"head"),$.domAPI=m(),$.insertStyleElement=x(),h()(S.Z,$),S.Z&&S.Z.locals&&S.Z.locals;var k=i(2303),M=i(6694);const j="setsheet",P='\n\n\n\n\n\x3c!-- englobing class div for css --\x3e\n<div class="setsheet" onmouseover.call="hoverSet()" ${hidden} id="${data.id}" ref="engdiv">\n\n  \x3c!-- Image and weapon stats --\x3e\n  <div class="title d-flex flex-nowrap">\n    \x3c!-- Name and level --\x3e\n    <div>\n      <span>${name} (${highestItemLevel})</span><br>\n    </div>\n  </div>\n\n  \x3c!-- items --\x3e\n  <div class="items" if.bind="items.length > 0">\n    <div class="item" repeat.for="item of data.items" onmouseover.call="hoverItem()">\n      <img class="itemIcon" src="${getImgUrl(item)}" loading="lazy"/>\n      \x3c!-- <itemsheet if.bind="finishedComparison" item.bind="items[$index]"></itemsheet> --\x3e\n    </div>\n  </div>\n\n  <div class="itemCountChoice">\n    \x3c!-- Sélection du nombre d\'items pour choisir le bonus pano --\x3e\n    <div repeat.for="i of data.effects.length">\n      <input type="radio" class="btn-check" name="${data.id}" id="${data.id}-${i}" model.bind="i" checked.bind="bonusCounter" autocomplete="off">\n      <label class="btn btn-outline-dark radioDark" style="margin-left: auto;" for="${data.id}-${i}">${i + 1}</label>\n    </div>\n    \x3c!-- Bouton pour comparer avec la dernière version --\x3e\n    <button class="btn btn-compare" click.trigger="comparing = !comparing">\n      <i class="fa-solid fa-code-compare"></i>\n    </button>\n  </div>\n\n  \x3c!-- Effects --\x3e\n  <template if.bind="comparing">\n    \x3c!-- hi ${finishedComparison} ${comparing} --\x3e\n    \x3c!-- <div if.bind="!finishedComparison" class="loaderContainer">\n        <div class="loader"></div>\n    </div> --\x3e\n    <effectlist if.bind="finishedComparison" effects.bind="comparedEffects[bonusCounter]" iscrit.bind="false" depth.bind="0" comparing.to-view="true"></effectlist>\n  </template>\n  <template else>\n    \x3c!-- bye --\x3e\n    <effectlist if.bind="bonusCounterHasEffects" effects.bind="data.effects[bonusCounter]" iscrit.bind="false" depth.bind="0"></effectlist>\n  </template>\n\n  \n  \x3c!-- Effects totals --\x3e\n  \x3c!-- <div class="totalStats">\n    <ul style="padding: 0;">\n      <li class="row" repeat.for="effect of data.statistics" if="isntPseudo(effect)">\n        <div class="container statistic">\n          ${effect.min}\n          ${effect.min == null ? "" : "à"}\n          ${effect.max}\n          <span style.bind="getStatColor(effect.name)">${effect.name}</span>\n        </div>\n      </li>\n    </ul>\n  </div> --\x3e\n\n</div>\n',L=P,T=[E,k,M];let N;function B(e){N||(N=c.b_N.define({name:j,template:P,dependencies:T})),e.register(N)}var D=i(9344),O=i(2013),Z=i(5385);let H=class{constructor(e,t,i){this.i18n=t,this.ea=i,this.comparing=!1,this.hidden="hidden",this.bonusCounter=1,this.items=[],this.finishedLinkingItems=!1,this.finishedComparison=!1,this.db=e}isntPseudo(e){return e.name.includes("(isntPseudo)")}binding(){this.bonusCounter=this.data.effects.length-1,setTimeout((()=>this.promiseItems=this.linkItems()),0),setTimeout((()=>this.promiseComparison=this.loadComparison()),0)}async attached(){await this.promiseItems,await this.promiseComparison,this.ea.publish("setsheet:loaded",this.engdiv.parentElement),this.hidden=""}async linkItems(){for(let e of this.data.items){if(null==e)continue;let t=this.getItem(e);null!=t&&this.items.push(t)}this.finishedLinkingItems=!0}hoverSet(){}hoverItem(){}getItem(e){return this.db.data.jsonItemsById[e]}getImgUrl(e){let t=this.getItem(e);return this.db.gitFolderPath+"sprites/items/"+t.iconId+".png"}get name(){return this.db.getI18n(this.data.nameId)}get bonusCounterHasEffects(){let e=this.data.effects;if(this.bonusCounter in e){let t=e[this.bonusCounter];return t.length>0&&null!=t[0]}return!1}get highestItemLevel(){return this.db.data.highestItemLevel(this.data)}async loadComparison(){if(this.comparedEffects=[],this.data.id in this.db.data2.jsonItemSetsById==0)return this.finishedComparison=!0,void(this.comparedEffects=this.data.effects);let e=this.db.data2.jsonItemSetsById[this.data.id];for(let t=0;t<this.data.effects.length;t++){this.comparedEffects[t]=[];for(let e of this.data.effects[t]){if(!e)continue;let i=Object.assign({},e);this.comparedEffects[t][i.effectId]=i}for(let i of e.effects[t])if(i)if(i.effectId in this.comparedEffects[t]){let e=this.comparedEffects[t][i.effectId];e.diceNum=e.diceNum-i.diceNum,e.diceSide=e.diceSide-i.diceSide}else{let e=Object.assign({},i);this.comparedEffects[t][e.effectId]=e,e.diceNum=0-i.diceNum,e.diceSide=0-i.diceSide}}this.finishedComparison=!0}};(0,d.gn)([c.ExJ,(0,d.w6)("design:type",Object)],H.prototype,"data",void 0),(0,d.gn)([c.ExJ,(0,d.w6)("design:type",Boolean)],H.prototype,"comparing",void 0),H=(0,d.gn)([(0,c.MoW)(n),(0,d.fM)(1,Z.mb),(0,d.fM)(2,D.Rp),(0,d.w6)("design:paramtypes",[O.db,Object,Object])],H);const A="setfilter",z="",W=z,R=[];let F;function J(e){F||(F=c.b_N.define({name:A,template:z,dependencies:R})),e.register(F)}let q=class{constructor(e,t){this.db=e,this.ea=t,this.db.isLoaded?this.onLoad():this.ea.subscribe("db:loaded",(()=>{this.onLoad()}))}onLoad(){this.search()}search(){this.ea.publish("sets:search",this)}};q=(0,d.gn)([(0,c.MoW)(a),(0,d.fM)(1,D.Rp),(0,d.w6)("design:paramtypes",[O.db,Object])],q);const U="sets",_='\n\n\x3c!-- <require from="./sets.less"></require> --\x3e\n\x3c!-- <require from="../../components/mason.css"></require> --\x3e\n\n<setfilter></setfilter>\n\n\x3c!-- Filtres --\x3e\n\x3c!-- <setfilter filter.bind="filter"></setfilter> --\x3e\n\n<div if.bind="searching" class="loaderContainer">\n    <div class="loader"></div>\n</div>\n\n<p></p>\n\n\x3c!-- <button class="btn" click.trigger="toggleComparing()">Comparer avec la maj précédente</button> --\x3e\n\n\n\n<div class="grid-wrapper">\n    <div class="grid" ref="grid">\n        <setsheet class="grid-item" repeat.for="set of mason.data" data.bind="set" comparing.bind="comparing"></setsheet>\n    </div>\n</div>\n\n\x3c!-- <div class="infgrid">\n  <setsheet repeat.for="set of mason.data" data.bind="set"></setsheet>\n</div>\n<button class="" click.trigger="showMore()">Load</button> --\x3e\n',G=_,K=[s,o];let Q;function V(e){Q||(Q=c.b_N.define({name:U,template:_,dependencies:K})),e.register(Q)}var X=i(7296);i(9996);let Y=class{constructor(e,t){this.db=e,this.ea=t,this.debouncedShowMore=X.D5.debounce((()=>{this.mason.showMore()}),500,!0),this.comparing=!1,this.searching=!0,this.mason=new X.Ix,this.mason.itemsPerPage=20;let i=X.D5.debounce((()=>{this.mason.reloadMsnry()}),200,!1);this.ea.subscribe("setsheet:loaded",(e=>{i()})),this.ea.subscribe("sets:search",(e=>this.search(e)))}isLoaded(){return this.db.isLoaded}attached(){console.log("sets attached grid: "+this.grid),this.mason.obj=this,this.mason.initMasonry(),this.pageHost=document.getElementsByClassName("page-host")[0];let e=t=>{this.grid?setTimeout((()=>this.onScroll(t))):this.pageHost.removeEventListener("scroll",e,!1)};this.pageHost.addEventListener("scroll",e)}async onScroll(e){let t=this.pageHost.clientHeight,i=this.grid.scrollHeight+this.grid.offsetTop-t,n=this.pageHost.scrollTop;Math.abs(n-i)<=15&&this.debouncedShowMore()}async search(e=null){this.mason.data=[],this.mason.fulldata=[],this.mason.page=0,this.filterData(e),this.mason.showMore(),this.mason.showMore(),this.mason.showMore(),this.mason.showMore(),this.searching=!1}async showMore(){this.mason.showMore()}filterData(e){let t=this.db.data.jsonItemSets.map((e=>{var t;if(e.itemsData||(e.itemsData=[]),0==(null===(t=e.itemsData)||void 0===t?void 0:t.length)){let t=e.items.map((e=>this.db.data.jsonItemsById[e])).filter((e=>null!=e));e.itemsData=t}return e})).filter(((e,t,i)=>e.effects.length>0)).sort(((e,t)=>{let i=this.highestItemLevel(t)-this.highestItemLevel(e);return 0!=i?i:t.id-e.id}));this.mason.fulldata.push(...t)}highestItemLevel(e){if(!e.itemsData)return 0;let t=e.itemsData.map((e=>e.level));return Math.max(...t)}async toggleComparing(){this.comparing=!this.comparing}};Y=(0,d.gn)([(0,c.MoW)(r),(0,D.f3)(O.db),(0,d.fM)(1,D.Rp),(0,d.w6)("design:paramtypes",[O.db,Object])],Y)},7296:(e,t,i)=>{i.d(t,{D5:()=>o,Ix:()=>a}),i(48);var n=i(8751),s=i.n(n);class a{constructor(){this.fulldata=[],this.data=[],this.page=0,this.itemsPerPage=30}async showMore(){let e=this.page*this.itemsPerPage,t=this.fulldata.slice(e,e+this.itemsPerPage);this.data.push(...t),this.page++}async append(e){this.msnry.appended([e])}async reloadMsnry(){this.msnry&&(this.msnry.reloadItems(),this.msnry.layout())}initMasonry(){console.log("mason init grid: "+this.obj.grid),this.obj.grid&&(this.msnry&&this.msnry.destroy(),this.msnry=new(s())(this.obj.grid,{itemSelector:".grid-item",columnWidth:".grid-item",horizontalOrder:!0,gutter:10,fitWidth:!0,transitionDuration:0}),this.msnry.layout())}}class o{static caseAndAccentInsensitive(e){const t=function(e){let t={};for(;e.length>0;){let i="["+e.shift()+"]",n=i.split("");for(;n.length>0;)t[n.shift()]=i}return t}(["aàáâãäå","cç","eèéêë","iìíîï","nñ","oòóôõöø","sß","uùúûü","yÿ"]);return function(e){var i="";if(!e)return i;e=e.toLowerCase();for(var n=0;n<e.length;n++){let s=e.charAt(n);i+=t[s]||s}return i}(e)}static debounce(e,t,i){var n;return function(){var s=this,a=arguments,o=i&&!n;clearTimeout(n),n=setTimeout((()=>{n=null,i||e.apply(s,a)}),t),o&&e.apply(s,a)}}}}}]);