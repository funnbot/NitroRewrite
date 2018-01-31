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
            locale: "en",
            users: {}
        }
    }

    g(item, def) {
        return this.client.Database.get("guild", this.id, item, def);
    }

    s(item, value) {
        return this.client.Database.set("guild", this.id, item, value);
    }

    get cache() {
        if (!this._Storage) this._Storage = new Storage(this.client, this.id, "guild")
        return this._Storage;
    }

    /**
     * Get or change a user's balance
     * @param {String} id - a user's id 
     * @param {Number} val - amount, if undefined gets the user balance;
     * @param {Boolean} [addTo=false] - Wether to add to the balance 
     */
    balance(id, val, addTo = false) {
        if (typeof val !== "number") return;
        let userData = this.g("users", {});
        let user = userData[id] || {};
        let bal = user["balance"] || 0;
        if (val === undefined) return bal;
        bal = addTo ? bal + val : val;
        user["balance"] = bal;
        userData[id] = user;
        this.s("users", userData);
        return bal;
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