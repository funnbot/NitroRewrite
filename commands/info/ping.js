const Nitro = require("../../Nitro.js")
const Discord = require("discord.js")

module.exports = new Nitro.Command({
    help: "Check if Nitro is alive.",
    example: "${p}ping",
    userPerms: 0,
    
    run: async(message, bot, send, t) => {
        const m = await send(t.PING_TEST());
        const ping = m.createdTimestamp - Date.now();
        const ws = bot.ping;

        await m.edit(t.PING_DONE(ping, ws));
        return;
    }
})