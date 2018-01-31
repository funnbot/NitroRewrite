const Extension = require("../../Extensions/Extension.js");
const Storage = require("../SimpleStorage.js");

class User extends Extension {
    static get items() {
        return {
            trivia: 0
        };
    }

    g(item, def) {
        return this.get("guild", this.id, item, def);
    }

    s(item, value) {
        return this.set("guild", this.id, item, value);
    }

    get cache() {
        if (!this._Storage) this._Storage = new Storage(this.client, this.id, "user")
        return this._Storage;
    }
}

for (let [item, def] of Object.entries(User.items)) {
    Object.defineProperty(User.prototype, item, {
        get: function() {
            return this.g(item, def);
        },
        set: function(val) {
            this.s(item, val);
        }
    });
}

module.exports = User;