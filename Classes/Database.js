const Discord = require("discord.js");
const { TABLES, DBNAME, DBPASS, ITEMS } = require("../config.js");
const Storage = require("./SimpleStorage");
let r = require("rethinkdbdash")();

class Database {
    constructor() {
        ExtendDatabaseClass(Discord.Guild, "guild");
        ExtendDatabaseClass(Discord.GuildChannel, "channel");
        ExtendDatabaseClass(Discord.User, "user");
        ExtendDatabaseClass(Discord.Client, "system");
    }

    async get(db, id, item, def = {}) {
        if (!testInput(db, id, item)) return def;
        let data = {}
        try {
            data = (await r.table(db).get(id)) || {};
        } catch (e) {
            logger.db(e);
        }
        return data[item] || def;
    }

    async set(db, id, item, value, def = {}) {
        if (!testInput(db, id, item, value)) return 0;
        try {
            if (isDefault(value, def)) await r.table(db).insert(await r.table(db).get(id).without(item), { conflict: "replace" });
            else await r.table(db).insert({ id, [item]: value }, { conflict: "update" });
        } catch (e) {
            logger.db(e);
        }
        return value;
    }

    async deleteId(db, id) {
        if (!testInput(db, id)) return 0;
        try {
            await r.table(db).get(id).delete();
        } catch (e) {
            logger.db(e);
        }
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
            value: function(item, def) {
                return this.client.Database.get(name, this.id, item, def);
            }
        },
        setItem: {
            value: function(item, def, value) {
                return this.client.Database.set(name, this.id, item, value, def);
            }
        },
        get cache() {
            if (!this._Storage) this._Storage = new Storage(this.client, this.id, name)
            return this._Storage;
        }
    })

    target.prototype.def = {};
    for (let [item, def] of Object.entries(ITEMS[name])) {
        target.prototype[item] = function(val) {
            if (val === undefined) {
                return this.getItem(item, this.def[item]);
            } else {
                return this.setItem(item, this.def[item], val);
            }
        }
        target.prototype.def[item] = def;
    }
}

function isDefault(value, def) {
    const type = typeof2(value);
    if (type == "array" && value.length < 1) return true;
    if (type == "object" && Object.keys(value).length < 1) return true;
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