const { Command } = require("../../Nitro");

class SetServerLogCommand extends Command {

    async run({ message, bot, reply, t }) {
        const modlog = await message.guild.serverlog();
        if (modlog) {
            await message.guild.serverlog(false);
            return await reply.succ("Disabled Server Log");
        }

        const [channel] = message.args;
        const perms = channel.permissionsFor(bot.user);
        if (!perms.has("SEND_MESSAGES") || !perms.has("EMBED_LINKS"))
            return await reply.warn("I need permission to send embeds in " + channel.toString());

        await message.guild.serverlog(channel.id);
        return await reply.succ("Server log set to " + channel.toString());
    }

    help = "Set the channel that server events are logged.";
    userPerms = ["MANAGE_GUILD"];
    arg = {
        type: "channel",
        info: "The channel to send logs",
        example: "#serverlog",
        default: true
    };
}

module.exports = SetServerLogCommand;