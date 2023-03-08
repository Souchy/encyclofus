export class Util {

    public static isRemote() {
        return !this.isLocal();
    }
    public static isLocal() {
        // console.log("location: " + location.hostname)
        return location.hostname.includes("127.0") || location.hostname.includes("192.168") || location.hostname.includes("localhost")
    }

    public static capitalizeFirstLetter(str: string) {
        if (str.length == 0) return "";
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    
	public static getStatColor(name: string) {
		switch (name) {
			case "PA": return "color: gold;"
			case "PM": return "color: #03fc3d;"
			case "Vitalité": return "color: #e1c699;";
			// case "Vitalité": return "color: beige;";
			// case "Sagesse": return "color: purple;";
			case "% Résistance Neutre":
				return "color: gray;";
			case "% Résistance Terre":
			case "Force":
				return "color: #965948;"; // brown
			case "% Résistance Feu":
			case "Intelligence":
				return "color: #c42b00;" // red
			case "% Résistance Eau":
			case "Chance":
				return "color: #34bdeb;" // blue
			case "% Résistance Air":
			case "Agilité":
				return "color: #0d9403;" // green
			case "Puissance":
				return "color: #cf03fc;"; //
			default: return "";
		}
	}
    
}
