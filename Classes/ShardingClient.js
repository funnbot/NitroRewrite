const { TOKEN, SHARDS } = require("../config.js");
const { ShardingManager } = require("discord.js");

class ShardingClient {
    constructor() {
        this.shardingManager = new ShardingManager("./bot.js", {
            totalShards: SHARDS,
            token: TOKEN
        });
    }

    start() {
        this.shardingManager.spawn();
    }
}

module.exports = ShardingClient;