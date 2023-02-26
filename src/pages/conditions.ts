import { DI, Registration, bindable } from "aurelia";
import { db } from "../DofusDB/db";
import { I18N } from "@aurelia/i18n";
import { Targets } from "../DofusDB/formulas";
import { tsThisType } from "@babel/types";



export class ConditionRenderer {


    @bindable
    public effect;
    @bindable
    public depth: number = 0;
    @bindable
    public iscrit: boolean;

    public db: db;

    /**
     * team masks: minuscule = allié, majuscule = enemi
     */
    // a: tous
    // g: tous sauf lanceur
        // d: sidekick
        // h: humain (joueur, pas invocation)
        // l: humain ou sidekick
        // m: pas humain, pas invoc, pas static
        // j: invocation
        // s: invocation statique
        // i: invocation non-statique
    // if(a) return
    // if(g) return
    // if(d, h, i, j, l, m, s)
    public teamMasks = ["a", "g", "d", "h", "l", "m", "s", "i", "j", "c"]; //  c et p ne sont pas là de base
    /**
     * condition masks: minusule = faux, majuscule = vrai
     * bBeEfFzZKoOPpTWUvVrRQq
     * --
     * b = breed
     * e = etat
     * f = monster
     * F50000 = autour des invocations du lanceur
     * F66666 = ?
     * k = carried
     * p = caster or his summons
     * q = limite d'invocations?
     * r = portail
     * t = telefrag
     * u = onAppearing = le moment ou une invoc est placée sur le terrain
     * v = percentLife > value
     * w = 
     * z = sidekick breed
     * o = l'attaquant 
     */
    public conditionMasks = ["b", "e", "f", "k", "p", "q", "r", "t", "u", "v", "w", "z", "o"];



    public constructor(db: db, @I18N private readonly i18n: I18N) {
        this.db = db;
    }

    public capitalizeFirstLetter(str: string) {
        if (str.length == 0) return "";
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    /// La cible est un Arbre et possède l'état Enraciné et Feuillu et 
    // ! (or, or)
    // + (and, and)
    // La cible [(est le monstre) {Arbre} et {La Gonflable}] et [(a l'état) {Feuillu} et {Enraciné} et {Affaibli}]
    // La cible [(est) {un Arbre}] et [(n'est pas) {une Invocation}] et [(a l'état) Feuillu] et [(n'a pas l'état) {Enraciné} ou {Affaibli}]
    // Le lanceur [(n'est pas) {un Arbre}] et [(a l'état) {Affaibli} et {Secourisme}] et [(n'a pas l'état) {Secourisme}]
    // Le lanceur [(n'a pas l'état) Souffrance 1 ou Souffrance 2 ou Souffrance 3]
    // Le lanceur [(est) {un Arbre}] et [(a l'état) Souffrance 1 et Souffrance 2 et {Souffrance 3}]

    public render(effect): string {
        let output = "";
        output = this.conditionsMaster(effect.targetMask);
        // output = this.getTargetString(effect.targetMask);
        return output;
    }

    public getTeam(effect): string {
        // caster, ally, enemy, fighter
        let masks: string[] = effect.targetMask.split(",");
        let teamMasks = masks.filter(t => this.teamMasks.includes(t.toLowerCase()));
        if(masks.length == 0)
            return "";
        let mini = teamMasks.filter(t => t.toLowerCase() == t);
        let maxi = teamMasks.filter(t => t.toUpperCase() == t);
        // console.log("GET TEAM: masks: " + masks + " mini = " + mini + ", maxi = " + maxi);
        if (masks.length == 2 && mini[0] == "a" && maxi[0] == "A")
            return "";
        if (mini.length > 0 && maxi.length > 0)
            return "fighter";
        if (teamMasks.find(t => t.toLowerCase() == "c") && teamMasks.length == 1)
            return "caster";
        if (mini.length > 0)
            return "ally";
        if (maxi.length > 0)
            return "enemy";
        return "";
    }

    private conditionsMaster(targetMask: string): string {
        let masks = targetMask.split(","); //Targets.mask(targetMask.split(","))
        // console.log("condition master: " + targetMask + " -> " + masks);
        let output = "";
        let team = this.teamCondition(targetMask);
        let caster = this.conditionCaster(masks);
        let target = this.conditionTarget(masks);
        output += `<div>${team}</div>`;
        if (caster) output += `<div class='tooltipLine'>${caster}</div>`;
        if (target) output += `<div class='tooltipLine'>${target}</div>`;
        return output;
    }

    private teamCondition(targetMask: string): string {
        let masks = targetMask.split(",");
        masks = masks.filter(t => this.teamMasks.includes(t.toLowerCase()));
        // masks = Targets.mask(masks);


        if(masks.includes("A") && masks.includes("a")) {
            return this.i18n.tr("target.fighter");
        }
        if(masks.includes("A") && masks.includes("g")) {
            return this.i18n.tr("target.allExceptCaster");
        }
        // if(masks.includes("j") && masks.includes("g")) {
        //     return this.i18n.tr("fighter");
        // }

        let translated = masks.map(t => {
            if (t == t.toLowerCase())
                return this.i18n.tr("target.teamA." + t);
            else
                return this.i18n.tr("target.teamB." + t.toLowerCase());
        });
        let output = translated.join(this.i18n.tr("or"));

        // if(masks.filter(t => t == t.toLowerCase()).length == masks.length) {
        //     let teamname = this.i18n.tr("target.ally");
        //     while(output.includes(teamname))
        //         output = output.replace(`${teamname}`, ``);
        //     output = teamname + " " + output;
        // }
        // if(masks.filter(t => t == t.toUpperCase()).length == masks.length) {
        //     let teamname = this.i18n.tr("target.enemy");
        //     while(output.includes(teamname))
        //         output = output.replace(`${teamname}`, ``);
        //     // console.log(`HI ENEMIES (${teamname}): ` + output);
        //     output = teamname + " " + output;
        // }
        // translated = translated.map(t => t.replace("  ", " ").trim());
        // output = output.replace(`  `, ` `).trim();

        output = this.capitalizeFirstLetter(output);
        return output;
        /*
        // if(masks.includes("!summonCaster"))
        //     return this.i18n.tr("target.not") + " " + this.i18n.tr("target.summonCaster");
        // if(masks.includes("summonCaster"))
        //     return this.i18n.tr("target.summonCaster");
        // if(masks.includes("fighter"))

        // let masks = Targets.mask(e.targetMask.split(","))
        let strs: string[] = [];

        for (let m of masks) {
            // if (m.includes("creature") || m.includes("state")) continue;
            // if (m.includes("fighter")) continue;
            // if (m.includes("*summoner")) continue;
            if (m.includes("*")) continue;

            let not = m.includes("!");
            // let cond = m.includes("*");
            m = m.replace("!", "");
            // m = m.replace("*", "");
            let str = this.i18n.tr("target." + m);
            if (str == "target." + m)
                continue;
            // if (cond) str = this.i18n.tr("target.caster") + "-" + str;
            if (not)
                this.i18n.tr(!not + "") + "-" + str
            strs.push(str);
        }

        let output = strs.join(this.i18n.tr("or")); // ", "
        output = this.capitalizeFirstLetter(output);
        return output;
        */
    }

    private conditionCaster(masks: string[]) {
        masks = masks.filter(m => m.includes("*")).map(t => t.replace("*", ""));
        let conditions = this.mergeConditions(masks);
        let output = "";
        if (conditions.length > 0) output = this.i18n.tr("target.theCaster") + " " + conditions;
        output = this.capitalizeFirstLetter(output);
        return output;
    }

    private conditionTarget(masks: string[]): string {
        masks = masks.filter(m => !m.includes("*"));
        let conditions = this.mergeConditions(masks);
        let output = "";
        if (conditions.length > 0) output = this.i18n.tr("target.theTarget") + " " + conditions;
        output = this.capitalizeFirstLetter(output);
        return output;
    }

    private mergeConditions(masks: string[]): string {
        masks = masks.filter(t => !this.teamMasks.includes(t));
        // masks = masks.filter(t => this.conditionMasks.includes(t));
        // console.log("mergeConditions: " + masks)
        let conditions: string[] = [];
        conditions.push(this.conditionBreed(masks));
        conditions.push(this.conditionSummonOrSummoner(masks));
        conditions.push(this.conditionsMonsters(masks, true))
        conditions.push(this.conditionsMonsters(masks, false))
        conditions.push(this.conditionsStates(masks, true))
        conditions.push(this.conditionsStates(masks, false))
        conditions.push(this.conditionPortal(masks))
        conditions = conditions.filter(t => t);
        return conditions.join(this.i18n.tr("and"));
    }

    //#region States
    private conditionsStates(masks: string[], isPositive: boolean): string {
        let tag = isPositive ? "E" : "e";
        let contraction = isPositive ? this.i18n.tr("and") : this.i18n.tr("or");
        let tags = masks.filter(t => t.includes(tag)).map(t => t.substring(1));
        let output = ""
        if (tags.length > 0) {
            output += isPositive ? this.i18n.tr("target.hasState") : this.i18n.tr("target.hasNotState");
            output += " ";
            output += tags.map(t => this.parseStateToString(t)).join(contraction);
        }
        return output;
    }
    private parseStateToString(mask) {
        let stateId = +mask; 
        let state = this.db.jsonStates[stateId];
        if (!state) {
            console.log("state doesnt exist: " + stateId)
            return "";
        }
        let stateName = this.db.getI18n(state.nameId);
        if(stateName.includes("{") ){
            stateName = stateName.replace("{", "").replace("}", "");
            let data = stateName.split(",");
            let html = data.find(t => t.includes("::")).split("::")[1]; 
            // console.log("state: " + html);
            return html;
        }
        else
            return `<font color="#ebc304">${stateName}</font>`
        // console.log("state: " + stateName);
        // return stateName;
    }
    //#endregion

    //#region Monsters
    private conditionsMonsters(masks: string[], isPositive: boolean): string {
        let tag = isPositive ? "F" : "f";
        let contraction = this.i18n.tr("or");
        let tags = masks.filter(t => t.includes(tag)).map(t => t.substring(1));
        let output = ""
        // console.log("conditionMonsters: " + masks + ", isPositive: " + isPositive + ", tags: " + tags)
        if (tags.length > 0) {
            output += isPositive ? this.i18n.tr("target.is") : this.i18n.tr("target.isNot");
            output += " ";
            output += tags.map(t => this.parseMonsterToString(t)).join(contraction);
        }
        return output;
    }

    private parseMonsterToString(mask) {
        let summonId = +mask; 
        let summon = this.db.jsonSummons[summonId];
        let name = "";
        if (!summon) {
            name = this.i18n.tr("target.monster." + summonId);
        } else {
            name = this.db.getI18n(summon.nameId);
        }
        if (name.includes("</font>"))
            return name;
        else
            return `<font color="#ebc304">${name}</font>`
    }
    //#endregion

    //#region other conditions
    private conditionPortal(masks: string[]): string {
        if (masks.includes("r"))
            return this.i18n.tr("target.notThroughPortal");
        if (masks.includes("R"))
            return this.i18n.tr("target.throughPortal");
        return "";
    }

    private conditionBreed(masks: string[]): string {
        let mask = masks.find(t => t.toLowerCase().startsWith("b"));
        if(!mask) return "";
        let isPositive = mask == mask.toUpperCase();
        let value = +mask.substring(1);
        let nameid = this.db.jsonBreeds[value].nameId;
        let name = this.db.getI18n(nameid);
        if (isPositive)
            return this.i18n.tr("target.is") + " " + name;
        else
            return this.i18n.tr("target.isNot") + " " + name;
    }
    private conditionSummonOrSummoner(masks: string[]): string {
        let mask = masks.find(t => t.toLowerCase().startsWith("p"));
        if(!mask) return "";
        let isPositive = mask == mask.toUpperCase();
        if (isPositive)
            return this.i18n.tr("target.is") + " " + this.i18n.tr("target.summonCaster");
        else
            return this.i18n.tr("target.isNot") + " " + this.i18n.tr("target.summonCaster");
    }
    //#endregion



    // public letsDoConditions(masks: string[]) {
    // 	let positives = masks.filter(t => !t.includes("!"));
    // 	{
    // 		let states = positives.filter(t => t.includes("state"));
    // 		[this.i18n.tr("statesPrefix"), this.i18n.tr("theState")].concat()
    // 	}
    // 	let negatives = masks.filter(t => t.includes("!")).map(t => t.replace("!", ""));
    // 	{
    // 		let states = positives.filter(t => t.includes("state"));

    // 	}

    // 	let stateId = +m.substring("state".length);
    // 	let state = this.db.jsonStates[stateId];
    // 	if (!state) {
    // 		console.log("state doesnt exist: " + stateId)
    // 		continue;
    // 	}
    // 	let stateName = this.db.getI18n(state.nameId);
    // 	if (stateName.includes("{")) {
    // 		stateName = stateName.substring(stateName.indexOf("<u>") + 3);
    // 		stateName = stateName.substring(0, stateName.indexOf("</u>"));
    // 	}
    // 	// states like saoul
    // 	str = this.i18n.tr("target.thestate") + " " + stateName;
    // }


    public getTargetString(e) {
        let masks = Targets.mask(e.targetMask.split(","))
        let strs: string[] = [];

        for (let m of masks) {
            // if (m.includes("creature") || m.includes("state")) continue;
            // if (m.includes("fighter")) continue;
            // if (m.includes("*summoner")) continue;
            if (m.includes("*")) continue;

            let not = m.includes("!");
            // let cond = m.includes("*");
            m = m.replace("!", "");
            // m = m.replace("*", "");
            let str = this.i18n.tr("target." + m);
            if (str == "target." + m)
                continue;
            // if (cond) str = this.i18n.tr("target.caster") + "-" + str;
            if (not)
                this.i18n.tr(!not + "") + "-" + str
            strs.push(str);
        }

        let output = "<div>" + strs.join(", ") + "</div>";
        output += this.getConditionString(e);
        return output;
    }
    public getConditionString(targetMask): string {
        let masks = Targets.mask(targetMask.split(","))
        let strs: string[] = [];

        console.log("masks: " + targetMask + " -> " + masks);

        let positiveStr = this.i18n.tr("target.affectsEntities");
        let negativeStr = this.i18n.tr("target.affectsEntitiesNot");

        // for(let m of masks) {
        // 	if (!m.includes("*")) 
        // 		positiveStr += " " + (this.i18n.tr("target." + m));
        // }

        let positive: string[] = [];
        let negative: string[] = [];


        for (let m of masks) {
            if (!m.includes("*")) {
                // console.log("ignore condition: " + m);
                continue;
            }
            let not = m.includes("!");
            // let cond = m.includes("*");
            m = m.replace("!", "");
            m = m.replace("*", "");
            let str = "";
            if (m.includes("creature")) {
                let summonId = +m.substring("creature".length);
                let summon = this.db.jsonSummons[summonId];
                if (!summon) {
                    console.log("summon doesnt exist: " + summonId)
                    continue;
                }
                // summons like steamer's
                let summonName = this.db.getI18n(summon.nameId);
                str = this.i18n.tr("target.themonster") + " " + summonName;
            } else
                if (m.includes("state")) {
                    let stateId = +m.substring("state".length);
                    let state = this.db.jsonStates[stateId];
                    if (!state) {
                        console.log("state doesnt exist: " + stateId)
                        continue;
                    }
                    let stateName = this.db.getI18n(state.nameId);
                    if (stateName.includes("{")) {
                        stateName = stateName.substring(stateName.indexOf("<u>") + 3);
                        stateName = stateName.substring(0, stateName.indexOf("</u>"));
                    }
                    // states like saoul
                    str = this.i18n.tr("target.thestate") + " " + stateName;
                } else {
                    str = this.i18n.tr("target." + m);
                    if (str == "target." + m)
                        continue;
                }
            if (not)
                negative.push(str);
            else
                positive.push(str);
        }
        let output = "";
        if (positive.length > 0)
            output += "<div class='tooltipLine'>" + positiveStr + " " + positive.join(" et ") + "</div>";
        if (negative.length > 0)
            output += "<div class='tooltipLine'>" + negativeStr + " " + negative.join(" et ") + "</div>";
        return output;
    }


}

const container = DI.createContainer();
container.register(
    Registration.singleton(ConditionRenderer, ConditionRenderer)
);
