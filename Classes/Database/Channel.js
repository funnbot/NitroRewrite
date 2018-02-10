const Extension = require("../../Extensions/Extension.js");
const Storage = require("../SimpleStorage.js");

class Channel extends Extension {

    static get items() {
        return {};
    }

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

for (let [item, def] of Object.entries(Channel.items)) {
    Object.defineProperty(Channel.prototype, item, {
        [item]: function (val) {
            if (val === undefined) {
                return this.getItem(item, def);
            } else {
                return this.setItem(item, val);
            }
        }
    });
}

module.exports = Channel;