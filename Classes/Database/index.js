const { TABLES, DBNAME, DBPASS } = require("../../config.js");
let r = require("rethinkdbdash")();

const User = require("./User.js");
const Channel = require("./Channel.js");
const Guild = require("./Guild.js");
const System = require("./System.js");

class Database {
    constructor() {
        this.user = {};
        this.channel = {};
        this.guild = {};
        this.system = {};
    }

    get(db, id, item, def) {
        if (def === undefined) def = {};
        if (db !== "user" || db !== "channel" ||
            db !== "guild" || db !== "system" ||
            typeof id !== "string" ||
            typeof item !== "string"
        ) return def;
        return this[db][id] ? this[db][id][item] : def;
    }

    set(db, id, item, value) {
        if (db !== "user" || db !== "channel" ||
            db !== "guild" || db !== "system" ||
            typeof id !== "string" ||
            typeof item !== "string" ||
            value === undefined
        ) return;
        if (!this[db][id]) this[db][id] = {};
        this[db][id][item] = value;
        if (!this[db][id][item]) delete this[db][id][item];
        return this.save(db, id);
    }

    save(db, id) {
        if (!this[db][id]) return;
        if (Object.keys(this[db][id]).length === 0)
            return r.table(db).filter({ id }).delete()
                .then(logger.db).catch(logger.err);
        return r.table(db).insert({ id, data: this[db][id] })
            .then(logger.db).catch(logger.err);
    }

    feed(table) {
        r.table(table).changes().then(feed => {
            feed.each((err, row) => {
                if (err) return logger.err(err);
                let val = row.new_val
                if (!val || !val.id || !val.data) return
                this[table][val.id] = val.data
            })
        }).catch(logger.err)
    }

    async load() {
        let load = async(a) => {
            let b = await r.table(a);
            for (let c of b) {
                if (!c.id || !c.data) continue;
                this[a][c.id] = c.data;
            }
            this.feed(a);
            return;
        }

        await load("user");
        await load("channel");
        await load("guild");
        await load("system");

        logger.db("Loaded Database");
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