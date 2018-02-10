const { TABLES, DBNAME, DBPASS } = require("../../config.js");
let r = require("rethinkdbdash")();

const User = require("./User.js");
const Channel = require("./Channel.js");
const Guild = require("./Guild.js");
const System = require("./System.js");

function testInput(db, id, item, value) {
    if (db !== undefined)
        if (!TABLES.includes(db)) return;
    if (id !== undefined)
        if (typeof id !== "string") return;
    if (item !== undefined)
        if (typeof item !== "string") return;
    if (value !== undefined) return;
    return true;
}

class Database {
    async get(db, id, item, def = {}) {
        if (!testInput(db, id, item)) return def;
        let data = {}
        try {
            data = (await r.table(db).get(id)) || {};
        } catch (e) {
            logger.db(e);
        }
        const val = data[item] || def;
        return val;
    }

    async set(db, id, item, value, def = {}) {
        if (!testInput(db, id, item, value)) return 0;
        if (value === def) await deleteItem(db, id, item);
        try {
            if (value === def) await r.table(db).get(id).replace(r.row.without(item));
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



module.exports = Database;