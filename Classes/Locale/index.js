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

    async setLang(message) {
        this.lang = message.guild ? (await message.guild.locale()) : "en";
        this.set = this.locales.find(f => f.LANG === this.lang);
        return this;
    }

    buildFunctions() {
        let english = this.locales.find(f => f.LANG === "en");
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
            if (inp.length === 0) return split[0];
            const res = split.map((s, i) => s + (inp[i]||'')).join("")
            return res;
        }
    }
}