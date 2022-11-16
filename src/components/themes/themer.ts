import { DI, Registration } from "aurelia";

import themesCss from './themes.less'

export class Themer {

    public themeBool: boolean;

    public constructor() {
        this.themeBool = localStorage.getItem("theme") == "true";
        // console.log("ctor themebool: " + this.themeBool + ", from: " + localStorage.getItem("theme"))
        // console.log("" + themesCss);
        let asd = themesCss;
        this.render();
    }

    public click() {
        this.themeBool = !this.themeBool;
        // console.log("click themer: " + this.themeBool)
        localStorage.setItem("theme", this.themeBool + "");
        this.render();
    }

    public render() {
        // console.log("render: " + this.themeBool)
        if(this.themeBool) {
            document.body.classList.remove("themeDark")
            document.body.classList.add("themeLight");
        } else {
            document.body.classList.remove("themeLight")
            document.body.classList.add("themeDark");
        }
    }
}

const container = DI.createContainer();
container.register(
    Registration.singleton(Themer, Themer)
);
