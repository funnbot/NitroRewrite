const { TOKEN, SHARDS } = require("./config.js");
const { ShardingManager } = require("discord.js");
const sharder = new ShardingManager("./bot.js", {
    shardCount: SHARDS,
    token: TOKEN
});

sharder.spawn();