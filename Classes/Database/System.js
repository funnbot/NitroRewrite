const Extension = require("../../Extensions/Extension.js");
const Storage = require("../SimpleStorage.js");

const items = {

}

class System extends Extension {
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

System.prototype.def = {};
for (let [item, def] of Object.entries(items)) {
    System.prototype[item] = function (val) {
        if (val === undefined) {
            return this.getItem(item, this.def[item]);
        } else {
            return this.setItem(item, this.def[item], val);
        }
    }
    System.prototype.def[item] = def;
}

module.exports = System;