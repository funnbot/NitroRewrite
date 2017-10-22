const { TABLES, DBNAME, DBPASS } = require("../config.js");
let r = require("rethinkdbdash")();

class Database {
    constructor() {

    }

    async formatDb() {
        let dbs = await r.dbList();
        if (!dbs.includes(DBNAME)) {
            await r.dbCreate(DBNAME);
        }
        r = r.db(DBNAME);

        let tables = await r.tableList();
        for (let t of TABLES) {
            if (!tables.includes(t)) await r.tableCreate(t);
        }
        return;
    }
}