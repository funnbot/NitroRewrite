const Extension = require("../../Extensions/Extension.js");
const Storage = require("../SimpleStorage.js");

class User extends Extension {
    static get items() {
        return {
            trivia: 0
        };
    }

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

for (let [item, def] of Object.entries(User.items)) {
    Object.defineProperty(User.prototype, item, {
        [item]: function (val) {
            if (val === undefined) {
                return this.getItem(item, def);
            } else {
                return this.setItem(item, val);
            }
        }
    });
}

module.exports = User;