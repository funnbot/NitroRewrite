const Extension = require("../../Extensions/Extension.js");
const Storage = require("../SimpleStorage.js");

class Channel extends Extension {

    static get items() {
        return {};
    }

    g(item, def) {
        return this.client.Database.get("channel", this.id, item, def);
    }

    s(item, value) {
        return this.client.Database.set("channel", this.id, item, value);
    }

    get cache() {
        if (!this.Storage) this.Storage = new Storage(this.client, this.id, "channel")
        else return this.Storage;
    }
}

for (let [item, def] of Object.entries(Channel.items)) {
    Object.defineProperty(Channel.prototype, item, {
        get: function() {
            return this.g(item, def);
        },
        set: function(val) {
            this.s(item, val);
        }
    });
}

module.exports = Channel;