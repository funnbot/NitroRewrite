const Nitro = require("../../Nitro.js")
const Discord = require("discord.js")

module.exports = new Nitro.Command({
    help: "Check if Nitro is alive.",
    example: "${p}ping",
    userPerms: 0,
    
    run: async(message, bot, send) => {
        const ping = await send("Testing Ping...")
    }
})