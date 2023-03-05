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

}
