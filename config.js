const { TOKEN, DBNAME, DBPASS, SENTRY, LISTS, SHARDS } = require("./auth.js");

module.exports = {
    TABLES: [
        "guild",
        "user",
        "channel",
        "system"
    ],

    //Auth stuff
    TOKEN,
    DBNAME,
    DBPASS,
    SENTRY,
    SHARDS,
    LISTS,
}