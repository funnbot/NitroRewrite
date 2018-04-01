Create auth.js and fill

```js
module.exports = {
    TOKEN: "", // Get yur own beta token to test with.
    DBNAME: "Nitro", // This is the name taht will be created in rethinkdb as the main db
    DBPASS: "", // Dosnt matter not used
    DBDIR: "./", // No idea what this is here for
    SHARDS: 4, // Probably set to one, it seems the bot ignores this tho and just does auto for some reason...
    LAVALINK: "", // The password used for lavalink, whatever you put here must match the application.yaml
    LISTS: {
        botsdiscordpw: "invalidtoken", // Im not giving these out so just let the requests fail
        discordbots: "invalidtoken", // kek
        carbonitex: "invalidtoken",
        novo: "invalidtoken"
    },
    BETA: true // This dosnt get used but maybe it should be
}
```
