import { I18N } from '@aurelia/i18n';
import { ModFilter } from './../filter';
import { DI, IEventAggregator, Registration, inject } from "aurelia";
import { db } from "../../../../DofusDB/db";
import { Emerald } from "../../../../ts/emerald";
import * as $ from 'jquery';
import { watch } from '@aurelia/runtime-html';
import { util } from '../../util';


export class ModFilterBox {

    // HTML
    public modList: HTMLElement;
    public inputHtml: HTMLElement;

    // dynamic
    public data: ModFilter;

    // input
    public inputText: string = "";
    
    // dd list
    public filteredSects: Map<string, Object[]>;
    public selectedIndex = 0;
    public selectedMod: Object;

    public constructor(readonly db: db, readonly emerald: Emerald, @I18N readonly i18n: I18N, @IEventAggregator readonly ea: IEventAggregator) {
        this.filteredSects = new Map<string, Object[]>();
        for (let sec of this.getStatSections()) {
            this.filteredSects.set(sec[0], this.getModsForSection(sec[1]));
        }
    }

    
    //#region Input events
    public onKeyup(event) {
        // console.log("on key up");
        this.filterList();
    }
    public onKeyDown(event) {
        // console.log("keyDown")
        if (event.key === 'Escape') {
            this.selectedIndex = 0;
            this.inputText = "";
            this.inputHtml.blur();
        }
        if (event.key === 'Enter') {
            this.selectedMod = this.getModAtIndex(this.selectedIndex);
            this.onClickMod(this.selectedMod);
        }
        if (event.key === 'ArrowDown') {
            this.selectedIndex++;
            if(this.selectedIndex >= this.filteredSize()) this.selectedIndex = 0;
            this.selectedMod = this.getModAtIndex(this.selectedIndex);
        } else if (event.key === 'ArrowUp') {
            this.selectedIndex--;
            if(this.selectedIndex < 0) this.selectedIndex = this.filteredSize() - 1;
            this.selectedMod = this.getModAtIndex(this.selectedIndex);
        }
        // scroll
        this.scrollToSelected();
    }
    public onFocus(event) {
        // console.log("onFocus"); 
        this.inputText = "";
        this.filterList();
        this.toggleListVisibility(true);

    }
    public onBlur(event) {
        // console.log("onBlur: " + JSON.stringify(event)); 
        this.toggleListVisibility(false);
    }
    public onDelete() {
        this.ea.publish("quickfus:mod:delete", this);
    }
    //#endregion


    //#region Mod list events
    public onClickMod(mod) {
        this.selectedMod = mod;
        this.data.pseudoName = this.selectedMod["name"] ?? "";
        this.data.effectId = this.selectedMod["id"];
        this.inputText = "";
        this.inputHtml.blur();
    }
    public onHoverMod(mod) {
        // console.log("on hover: " + mod)
        this.selectedMod = mod;
    }
    //#endregion

    public toggleListVisibility(bool: boolean) {
        if(bool) {
            // $(event.target).closest(".searchable").find("dl").show();
            // $(event.target).closest(".searchable").find("dl section dd").show();
            this.modList.style.display = "block";
        } else {
            let modlist = this.modList;
            setTimeout(function() {
                modlist.style.display = "none";
                // $(event.target).closest(".searchable").find("dl").hide();
            }, 100);
        }
    }

    //#region Util
    public scrollToSelected() {
        if(!this.selectedMod) return;
        let id = this.selectedMod["id"];
        // console.log("select id: " + id);
        for(let sec of this.modList.children) {
            for(let e of sec.children) {
                if(e.getAttribute("title") == id.toString()) {
                    e.scrollIntoView({ behavior: "auto", block: "nearest", inline: "nearest" });
                    break;
                }
            }
        }
    }
    public filterList() {
        let reg = new RegExp(util.caseAndAccentInsensitive(this.inputText), "i"); // g
        // console.log("filterList: " + reg);
        if (this.inputText !== "") {
            this.filteredSects.clear();
            for (let sec of this.getStatSections()) {
                let sectionName = this.i18n.tr(sec[0]);
                if(reg.test(sectionName)) { 
                    this.filteredSects.set(sec[0], this.getModsForSection(sec[1]));
                } else {
                    let mods = this.getModsForSection(sec[1]);
                    this.filteredSects.set(sec[0], mods.filter(mod => reg.test(this.getModName(mod))));
                }
            }
        } else {
            this.filteredSects.clear();
            for (let sec of this.getStatSections()) {
                this.filteredSects.set(sec[0], this.getModsForSection(sec[1]));
            }
        }
    }
    public getModName(mod) {
        if(mod.nameId) return this.getI18n(mod.nameId)
        if(mod.name) return this.i18n.tr("quickfus.filter.pseudo." + mod.name);
    }
    public getModAtIndex(index: number) {
        let i = 0;
        for(let sec of this.filteredSects) {
            for(let mod of sec[1]) {
                if(i == index) return mod;
                i++;
            }
        }
        return null;
    }
    public filteredSize() {
        let size = 0;
        for(let sec of this.filteredSects) {
            size += this.filteredSects.get(sec[0]).length;
        }
        return size;
    }
    public renderCharac(mod: any, includeCategory: boolean) {
        let name = this.getModName(mod);
        let sty = "";
        if(mod.asset) {
            let url = this.db.commonUrlPath + "characteristics/" + mod.asset?.replace("tx_", "") + ".png";
            sty = "background: transparent url('" + url + "');" +
                "background-size: contain; background-repeat: no-repeat;" +
                "width: 22px; height: 22px; margin-right: 5px;";
        }
        let cat = "";
        if(includeCategory) {
            let sectionId = this.selectedMod["categoryId"] - 1;
            if(sectionId < 0) sectionId = 0;
            let keys = Array.from(db.getStatSections().keys());
            let trkey = keys[sectionId];
            cat = "<div style='margin-right: 5px;'>[" + this.i18n.tr(trkey) + "]</div>";
        }
        return `
            <div class="d-flex">
                ${cat}
                <div style="${sty}"></div>
                <div>${name}</div>
            </div>
        `;
    }
    public getStatSections(): Map<string, number> {
        let sec = db.getStatSections();
        return sec;
    }
    public getModsForSection(section: number) {
        if(section == 0) {
            return this.db.pseudoCharacs;
        }
        return this.emerald.characteristics
            .filter(c => c.categoryId == section)
            .sort((a, b) => a.order - b.order);
    }
    public getI18n(nameId: number) {
        return this.db.getI18n(nameId.toString());
    }
    //#endregion

}
