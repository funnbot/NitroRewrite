const Discord = require("discord.js");
const { TABLES, DBNAME, DBPASS, ITEMS } = require("../config.js");
const Storage = require("./SimpleStorage");
let r = require("rethinkdbdash")({
    password: DBPASS
});

class Database {
    constructor() {
        ExtendDatabaseClass(Discord.Guild, "guild");
        ExtendDatabaseClass(Discord.GuildChannel, "channel");
        ExtendDatabaseClass(Discord.User, "user");
        ExtendDatabaseClass(Discord.Client, "system");
    }

    async get(table, id, item) {
        let def = ITEMS[table][item];
        if (typeof2(def) === "object") def = Object.assign({}, def);
        else if (typeof2(def) === "array") def = Object.assign([], def);

        if (!testInput(table, id, item)) return def;
        let data = {}
        try {
            data = (await r.table(table).get(id)) || {};
        } catch (e) {
            logger.db(e);
        }
        return data[item] || def;
    }

    async set(table, id, item, value) {
        if (!testInput(table, id, item, value)) return 0;
        // Default dosnt need to be duplicated here
        const def = ITEMS[table][item];
        // Fetch the current data to edit
        let data = await r.table(table).get(id);
        // If the value to be set is matching the default
        if (isDefault(value, def)) {
            // If its default and theres nothing set already, return;
            if (!data) return value;
            // Delete from obj
            delete data[item];
        } else {
            if (!data) data = {id};
            // Updating the value
            data[item] = value;
        }
        // set it
        await r.table(table).insert(data, { conflict: "replace" });
        return value;
    }

    async deleteId(table, id) {
        if (!testInput(table, id)) return 0;
        try {
            await r.table(table).get(id).delete();
        } catch (e) {
            logger.db(e);
        }
    }

    async filter(table, predicate) {
        if (!testInput(table)) return 0;
        try {
            var data = await r.table(table).filter(predicate);
        } catch (e) {
            logger.db(e);
        }
        return data;
    }

    async formatDb() {
        let dbs = await r.dbList();
        if (!dbs.includes(DBNAME)) {
            await r.dbCreate(DBNAME);
            logger.db("Created Database", DBNAME);
        }
        r = r.db(DBNAME);

        let tables = await r.tableList();
        for (let t of TABLES) {
            if (!tables.includes(t)) {
                await r.tableCreate(t);
                logger.db("Created Table", t);
            }
        }
        return;
    }
}

function ExtendDatabaseClass(target, name) {
    Object.defineProperties(target.prototype, {
        getItem: {
            value: function(item) {
                const [client, id] = [this.client || this, this.id || "1"];
                return client.db.get(name, id, item);
            }
        },
        setItem: {
            value: function(item, value) {
                const [client, id] = [this.client || this, this.id || "1"];
                return client.db.set(name, id, item, value);
            }
        },
        cache: {
            get: function() {
                const [client, id] = [this.client || this, this.id || "1"];
                if (!this._Storage) this._Storage = new Storage(client, id, name);
                return this._Storage;
            }
        },
    })

    for (let item of Object.keys(ITEMS[name])) {
        target.prototype[item] = function(val) {
            if (val === undefined) {
                return this.getItem(item);
            } else {
                return this.setItem(item, val);
            }
        }
    }
}

function isDefault(value, def) {
    const type = typeof2(value);
    if (type === "array" && value.length < 1) return true;
    if (type === "object" && Object.keys(value).length < 1) return true;
    return value === def;
}

function testInput(db, id, item, value) {
    if (db !== undefined)
        if (!TABLES.includes(db)) return;
    if (id !== undefined)
        if (typeof id !== "string") return;
    if (item !== undefined)
        if (typeof item !== "string") return;
    return true;
}

module.exports = Database;