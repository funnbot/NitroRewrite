const { Command } = require("../../Nitro");

class SetModlogCommand extends Command {

    async run({ message, bot, reply, t }) {
        const modlog = await message.guild.modlog();
        if (modlog) {
            await message.guild.modlog(false);
            return await reply.succ("Disabled Modlog");
        }

        const [channel] = message.args;
        const perms = channel.permissionsFor(bot.user);
        if (!perms.has("SEND_MESSAGES") || !perms.has("EMBED_LINKS"))
            return await reply.warn("I need permission to send embeds in " + channel);

        await message.guild.modlog(channel.id);
        return await reply.succ("Modlog set to " + channel);
    }

    help = "Set the moderation log channel";
    userPerms = ["MANAGE_GUILD"];
    args = [{
        type: "channel",
        info: "The channel to send logs.",
        example: "#modlogs",
        default: true
    }];
}

module.exports = SetModlogCommand;

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