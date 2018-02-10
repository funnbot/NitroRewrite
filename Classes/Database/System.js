const Extension = require("../../Extensions/Extension.js");
const Storage = require("../SimpleStorage.js");

class System extends Extension {

    static get items() {
        return {};
    }

    getItem(item, def) {
        return this.client.Database.get("system", "1", item, def);
    }

    setItem(item, def, value) {
        return this.client.Database.set("system", "1", item, value, def);
    }
      
    get cache() {
        if (!this._Storage) this._Storage = new Storage(this.client, this.id, "system")
        return this._Storage;
    }
}

for (let [item, def] of Object.entries(System.items)) {
    Object.defineProperty(System.prototype, item, {
        [item]: function (val) {
            if (val === undefined) {
                return this.getItem(item, def);
            } else {
                return this.setItem(item, val);
            }
        }
    });
}

module.exports = System;