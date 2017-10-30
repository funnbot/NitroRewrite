const Extension = require("../../Extensions/Extension.js");
const Storage = require("../SimpleStorage.js");

class User extends Extension {
    g(item, def) {
        return this.get("guild", this.id, item, def);
    }

    s(item, value) {
        return this.set("guild", this.id, item, value);
    }

    get storage() {
        if (!this.Storage) this.Storage = new Storage(this.client, this.id, "user")
        else return this.Storage;
    }
}

module.exports = User;