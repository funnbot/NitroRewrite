const { TOKEN, SHARDS } = require("../config.js");
const { ShardingManager } = require("discord.js");

// This is used for when we only need one instance of something.

class ShardingClient {
    constructor() {
        this.shardingManager = new ShardingManager("./bot.js", {
            shardCount: SHARDS,
            token: TOKEN
        });
    }

    start() {
        this.shardingManager.spawn();
    }
}

module.exports = ShardingClient;