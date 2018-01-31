const Extension = require("../../Extensions/Extension.js");
const Storage = require("../SimpleStorage.js");

class System extends Extension {

    static get items() {
        return {};
    }

    g(item, def) {
        return this.client.Database.get("system", "1", item, def);
    }

    s(item, value) {
        return this.client.Database.set("system", "1", item, value);
    }
      
    get cache() {
        if (!this._Storage) this._Storage = new Storage(this.client, this.id, "system")
        return this._Storage;
    }
}

for (let [item, def] of Object.entries(System.items)) {
    Object.defineProperty(System.prototype, item, {
        get: function() {
            return this.g(item, def);
        },
        set: function(val) {
            this.s(item, val);
        }
    });
}

module.exports = System;