const Extension = require("../../Extensions/Extension.js");
const Storage = require("../SimpleStorage.js");

const items = {
    trivia: 0
}

class User extends Extension {
    getItem(item, def) {
        return this.get("guild", this.id, item, def);
    }

    setItem(item, def, value) {
        return this.set("guild", this.id, item, value, def);
    }

    get cache() {
        if (!this._Storage) this._Storage = new Storage(this.client, this.id, "user")
        return this._Storage;
    }
}

User.prototype.def = {};
for (let [item, def] of Object.entries(items)) {
    User.prototype[item] = function (val) {
        if (val === undefined) {
            return this.getItem(item, this.def[item]);
        } else {
            return this.setItem(item, this.def[item], val);
        }
    }
    User.prototype.def[item] = def;
}

module.exports = User;