const Extension = require("../../Extensions/Extension.js");
const { PREFIX } = require("../../config.js");
const Storage = require("../SimpleStorage.js");

const items = {
    prefix: PREFIX,
    alias: {},
    mlchannel: null,
    mljoin: null,
    mlleave: null,
    mljoindm: null,
    locale: "en",
    userData: {},
    tags: {},
    groups: {
        dj: { users: {}, perms: {} },
        helper: { users: {}, perms: {} },
        mod: { users: {}, perms: {} },
        admin: { users: {}, perms: {} },
    }
}

class Guild extends Extension {
    getItem(item, def) {
        return this.client.Database.get("guild", this.id, item, def);
    }

    setItem(item, def, value) {
        return this.client.Database.set("guild", this.id, item, value, def);
    }

    get cache() {
        if (!this._Storage) this._Storage = new Storage(this.client, this.id, "guild")
        return this._Storage;
    }

    /**
     * Get or change a user's balance
     * @param {String} id a user's id 
     * @param {Number} amount amount to add, if undefined returns balance;
     * @param {Boolean} [addTo=false] - Wether to add to the balance 
     */
    balance(id, amount, addTo = false) {
        if (typeof val !== "number") return;
        let userData = this.getItem("userData", {});
        let user = userData[id] || {};
        let bal = user["balance"] || 0;
        if (val === undefined) return bal;
        bal = addTo ? bal + val : val;
        user["balance"] = bal;
        userData[id] = user;
        this.setItem("users", userData, {});
        return bal;
    }
}

Guild.prototype.def = {};
for (let [item, def] of Object.entries(items)) {
    Guild.prototype[item] = function(val) {
        if (val === undefined) {
            return this.getItem(item, this.def[item]);
        } else {
            return this.setItem(item, this.def[item], val);
        }
    }
    Guild.prototype.def[item] = def;
}

module.exports = Guild;