const { TOKEN, DBNAME, DBPASS, SENTRY, MEMCACHED, LISTS, SHARDS } = require("./auth.js");

module.exports = {
    TABLES: [
        "guild",
        "user",
        "channel"
    ],

    //Auth stuff
    TOKEN,
    DBNAME,
    DBPASS,
    SENTRY,
    SHARDS,
    LISTS,
    MEMCACHED
}