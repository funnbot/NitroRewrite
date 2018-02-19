const { TABLES, DBNAME, DBPASS } = require("../../config.js");
let r = require("rethinkdbdash")();

const User = require("./User.js");
const Channel = require("./Channel.js");
const Guild = require("./Guild.js");
const System = require("./System.js");

class Database {
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