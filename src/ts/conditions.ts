import { Criteria, CriteriaGroup, CriterionUtil } from './../DofusDB/static/formulas/criterions';
import { DI, Registration, bindable } from "aurelia";
import { db } from "../DofusDB/db";
import { I18N } from "@aurelia/i18n";
import { Targets } from "../DofusDB/formulas";
import { is, tsThisType } from "@babel/types";
import { Util } from './util';

export class ConditionRenderer {

    public constructor(private readonly db: db, @I18N private readonly i18n: I18N) {
        // console.log("render ctor: " + db + ", " + i18n)
    }

    public render(root: CriteriaGroup) {
        let arr = []
        for(let node of root.criterions) {
            if(node instanceof Criteria) {
                let txt = this.parseCriteria(node)
                if(txt) arr.push(txt)
            } 
            if(node instanceof CriteriaGroup) {
                let txt = this.parseGroup(node)
                if(txt) arr.push(txt)
            }
        }
        return arr.join(this.translateJointOperator(root.operator));
    }

    private translateJointOperator(op) {
        if (op == "&")
            return this.i18n.tr("and");
        if (op == "|")
            return this.i18n.tr("or");

    }

    private parse(node: any) {

    }

    private parseGroup(g: CriteriaGroup) {
        let arr = []
        for(let node of g.criterions) {
            if(node instanceof Criteria) {
                let txt = this.parseCriteria(node)
                if(txt) arr.push(txt)
            } 
        }
        return "(" + arr.join(this.translateJointOperator(g.operator)) + ")"
    }
    private parseCriteria(c: Criteria) {
        if(c.name == "HS")
            return this.parseState(c);
        if(c.name.toLowerCase() == "po")
            return this.parseItem(c);

        let output = "";
        let arr = []; //c.name.split(".");
        let names = CriterionUtil.getCriterion(c);
        if(names) {
            if(names == "null") {
                // console.log("ignore criterion for " + c.name)
                return null;
            }
            if(names.startsWith("condition.")) {
                arr.push(this.i18n.tr(names))
            } else {
                for(let n of names.split(".")) {
                    if(n == "total") continue
                    arr.push(this.i18n.tr(n))
                }
            }
            arr.push(c.operator);
            arr.push(c.value);
        } else {
            names = CriterionUtil.getCriterionBool(c);
            if(names) {
                arr.push(this.i18n.tr(names))
            } else {
                arr.push(c.name);
                arr.push(c.operator);
                arr.push(c.value);
            }
        }
        output = arr.join(" ");
        // console.log("parse output: " + output)
        return output;
    }

    private parseState(c: Criteria) {
        let arr = []
        let out = "";
        arr.push(this.i18n.tr("target.theCaster"))
        arr.push(c.operator == "!" ? this.i18n.tr("target.hasNotState") : this.i18n.tr("target.hasState"))
        arr.push(this.db.parseStateToString(c.value))
        out = arr.join(" ");
        return Util.capitalizeFirstLetter(out);
    }

    private parseItem(c: Criteria) {
        let item = this.db.data.jsonItems.find(i => i.id == c.value);
        let itemName = this.db.getI18n(item.nameId);

        let arr = []
        let out = "";
        // arr.push(this.i18n.tr("target.theCaster"))
        if(c.operator.replace("X", "!") == "!" ) 
            arr.push(this.i18n.tr("condition.hasNotItem", { itemName }))
        else
            arr.push(this.i18n.tr("condition.hasItem", { itemName }))
        out = arr.join(" ");

        return Util.capitalizeFirstLetter(out);
    }
}

const container = DI.createContainer();
container.register(
    Registration.singleton(ConditionRenderer, ConditionRenderer)
);
