const { Command } = require("../../Nitro");

class SetLogsCommand extends Command {

    async run({ message, bot, reply, t }) {
        let [chan] = message.args;
        const perms = chan.permissionsFor(bot.user);
        if (!perms.has("SEND_MESSAGES")) return await reply.fail("I need permission to send messages in the modlog channel.");
        if (!perms.has("EMBED_LINKS")) return await reply.fail("I need permission to send embeds in the modlog channel.");

        await message.guild.modlog(chan.id);
        return await reply.succ(`Modlog set to ${chan}`);
    }

    options() {
        return {
            help: "Set the moderation log channel",
            usage: "",
            userPerms: ["MANAGE_GUILD"],
            args: [{
                type: "channel",
                info: "The channel to send logs.",
                example: "#modlogs",
                default: true
            }]
        }
    }
}

module.exports = SetLogsCommand;

/*const Nitro = require("../../../Nitro.js")

module.exports = new Nitro.Command({
    help: "Set the case log channel.",
    example: "${p}setlogs mod-log",
    argExample: "<channel>",
    dm: false,
    coolDown: 5,
    userPerms: 2,
    botPerms: [],

    args: [{
        prompt: "Which channel?",
        type: "channel",
        optional: true
    }],

    run: async(message, bot, send) => {
        let channel = message.args[0] || message.channel
        if (!channel || channel.type !== "text") return send("**Invalid Channel**")
        message.guild.set("Moderation", "channel", channel.id);
        send("**Moderator logs set to:** " + channel)
    }
})*/