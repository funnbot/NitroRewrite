const extend = require("./extend.js");
const Discord = require("discord.js");

class ShardClientUtil extends Discord.ShardClientUtil {
    async clientValuesReduced(prop) {
        try {
            const values = await this.fetchClientValues(prop);
            return values.reduce((a, b) => a + b, 0);
        } catch (e) {
            return null;
        }
    }
}

// extend(ShardClientUtil);