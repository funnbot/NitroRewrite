const mfs = require('../../Functions/mfs.js');

const splitMap = {};

module.exports = class Locale {
    constructor() {
        let files = mfs.readFilesSync("./Classes/Locale/locales");
        files = files.map(JSON.parse);
        this.locales = files
        this.languages = files.map(f => f.LANG);
        this.buildSplitMaps();
        this.buildFunctions();
    }

    setLang(message) {
        this.lang = message.guild ? message.guild.locale : "en";
        this.set = this.locales.find(f => f.LANG === this.lang);
    }

    buildFunctions() {
        let english = this.locales.find(f => f.LANG = "en");
        for (let key of Object.keys(english)) {
            if (key === "LANG") continue;
            this[key] = this.t(key);
        }
    }

    buildSplitMaps() {
        for (let lang of this.locales) {
            const langKey = lang.LANG;
            let map = {};
            for (let [key, text] of Object.entries(lang)) {
                if (Array.isArray(text)) continue;
                map[key] = text.split("{}");
            }
            splitMap[langKey] = map;
        }
    }

    t(key) {
        return function(...inp) {
            let text = this.set[key] || this.set["en"];
            let split = splitMap[this.lang] || splitMap["en"];
            split = split[key] || splitMap["en"][key];
            if (Array.isArray(text)) return text;
            let res = "";
            let index = 0;
            for (let txt of inp) {
                res += split[index] + txt;
            }
            if (inp.length == 0) res = split[0];
            return res;
        }
    }
}