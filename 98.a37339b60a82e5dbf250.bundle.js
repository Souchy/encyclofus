"use strict";(self.webpackChunkencyclofus=self.webpackChunkencyclofus||[]).push([[98],{5098:(e,t,s)=>{s.r(t),s.d(t,{items:()=>T});var i={};s.r(i),s.d(i,{default:()=>o,dependencies:()=>h,name:()=>c,register:()=>u,template:()=>l});var a={};s.r(a),s.d(a,{BlockFilter:()=>v,ModFilter:()=>g,itemfilteradvanced:()=>b});var n={};s.r(n),s.d(n,{default:()=>y,dependencies:()=>M,name:()=>P,register:()=>S,template:()=>k});var r=s(655),d=(s(1932),s(1542));const c="itemfilteradvanced",l="",o=l,h=[];let p;function u(e){p||(p=d.b_N.define({name:c,template:l,dependencies:h})),e.register(p)}var f=s(9344),m=s(7302);let b=class{constructor(e,t){this.db=e,this.ea=t,this.filterText="",this.filterLevel=!0,this.filterType=!1,this.filterWeapon=!1,this.modsSections=new Map,this.modsSections.set("Pseudo",["(Pseudo) # res","(Pseudo) # res élémentaires","(Pseudo) Total #% res","(Pseudo) Total #% res élémentaires"])}};b=(0,r.gn)([(0,d.MoW)(i),(0,f.f3)(m.db),(0,r.fM)(1,f.Rp),(0,r.w6)("design:paramtypes",[m.db,Object])],b);class v{constructor(){this.type="And",this.activate=!0,this.mods=[]}}class g{constructor(){this.activate=!0}}const P="items",k="\n\n\n<itemfilteradvanced></itemfilteradvanced>\n\n\n<div>\n    Hi items\n\n</div>\n",y=k,M=[a];let w;function S(e){w||(w=d.b_N.define({name:P,template:k,dependencies:M})),e.register(w)}let T=class{constructor(e,t){this.db=e,this.ea=t,this.itemsPerPage=50,this.page=0,this.ea.subscribe("quickfus:search",(e=>this.updateSearch(e)))}updateSearch(e){}};T=(0,r.gn)([(0,d.MoW)(n),(0,f.f3)(m.db),(0,r.fM)(1,f.Rp),(0,r.w6)("design:paramtypes",[m.db,Object])],T)}}]);