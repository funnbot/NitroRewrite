const Extension = require("../../Extensions/Extension.js");
const { PREFIX } = require("../../config.js");
const Storage = require("../SimpleStorage.js");

class Guild extends Extension {

    static get items() {
        return {
            prefix: PREFIX,
            alias: {},
            mlchannel: null,
            mljoin: null,
            mlleave: null,
            mljoindm: null,
            locale: "en"
        }
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

for (let [item, def] of Object.entries(Guild.items)) {
    Object.defineProperty(Guild.prototype, item, {
        get: function() {
            return this.g(item, def);
        },
        set: function(val) {
            this.s(item, val);
        }
    });
}

module.exports = Guild;