require("./Classes/Logger");

const { spawn } = require("child_process");
const { TOKEN, SHARDS, DBDIR } = require("./config.js");
const { ShardingManager } = require("discord.js");
const shardingManager = new ShardingManager("./bot.js", {
    shardCount: SHARDS,
    token: TOKEN
});

/*logger.db("Starting database")
const child = spawn("rethinkdb", {
    cwd: DBDIR
})

child.stdout.on("data", d => {
    if (d.toString().startsWith("Server ready")) {
        logger.db("Database ready")*/
        shardingManager.spawn();
    /*}
});

process.on("SIGINT", () => {
    process.kill(child.pid, "SIGINT");
    child.on("close", code => {
        console.log("EXITED WITH CODE" + code);
        process.kill(process.pid, "SIGINT");
    })
})*/