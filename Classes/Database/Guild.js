const Extension = require("../../Extensions/Extension.js");
const { PREFIX } = require("../../config.js");
const Storage = require("../SimpleStorage.js");

class Guild extends Extension {

    get prefix() {
        return this.g("prefix", PREFIX);
    }

    set prefix(val) {
        this.s("prefix", val);
    }

    get alias() {
        return this.g("alias");
    }

    set alias(val) {
        this.s("alias", val);
    }

    get mlchannel() {
        return this.g("mlchannel", null);
    }

    set mlchannel(val) {
        this.s("mlchannel", val);
    }

    get mljoin() {
        return this.g("mljoin", null);
    }

    set mljoin(val) {
        this.s("mljoin", val)
    }

    get mlleave() {
        return this.g("mlleave", null);
    }

    set mlleave(val) {
        this.s("mlleave", val);
    }

    get mljoindm() {
        return this.g("mljoindm", null);
    }

    set mljoindm(val) {
        this.s("mljoindm", val)
    }


    g(item, def) {
        return this.client.Database.get("guild", this.id, item, def);
    }

    s(item, value) {
        return this.client.Database.set("guild", this.id, item, value);
    }

    get storage() {
        if (!this.Storage) this.Storage = new Storage(this.client, this.id, "guild")
        else return this.Storage;
    }
}

module.exports = Guild;