const Extension = require("../../Extensions/Extension.js");
const Storage = require("../SimpleStorage.js");

class System extends Extension {
    g(item, def) {
        return this.get("guild", "1", item, def);
    }

    s(item, value) {
        return this.set("guild", "1", item, value);
    }
      
    get storage() {
        if (!this.Storage) this.Storage = new Storage(this.client, this.id, "system")
        else return this.Storage;
    }
}

module.exports = System;