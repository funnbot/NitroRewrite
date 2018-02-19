const Extension = require("../../Extensions/Extension.js");
const Storage = require("../SimpleStorage.js");

const items = {

}

class Channel extends Extension {
    getItem(item, def) {
        return this.client.Database.get("channel", this.id, item, def);
    }

    setItem(item, def, value) {
        return this.client.Database.set("channel", this.id, item, value, def);
    }

    get cache() {
        if (!this._Storage) this._Storage = new Storage(this.client, this.id, "channel")
        return this._Storage;
    }
    
}

Channel.prototype.def = {};
for (let [item, def] of Object.entries(items)) {
    Channel.prototype[item] = function (val) {
        if (val === undefined) {
            return this.getItem(item, this.def[item]);
        } else {
            return this.setItem(item, this.def[item], val);
        }
    }
    Channel.prototype.def[item] = def;
}

module.exports = Channel;