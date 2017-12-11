const Nitro = require("../../Nitro.js")
const Discord = require("discord.js")

module.exports = new Nitro.Command({
    help: "Check if Nitro is alive.",
    example: "${p}ping",
    userPerms: 0,
    
    run: async(message, bot, send) => {
        const m = await send("Testing Ping...");
        const ping = m.createdTimestamp - Date.now();
        const ws = bot.ping;

        await m.edit(`**Pong!** Latency: ${ping}MS Websocket: ${ws}MS`);
        return;
    }
})