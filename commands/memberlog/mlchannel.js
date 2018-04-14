const { Command } = require("../../Nitro");

class MLChannelCommand extends Command {

    async run({ message, bot, reply, t }) {
        const [channel] = message.args;
        const mlchannel = await message.guild.mlchan();

        if (mlchannel) {
            await message.guild.mlchan(false);
            return await reply.succ("Disabled all member logs.")
        } else {
            const perms = channel.permissionsFor(bot.user);
            if (channel.type !== "text" ||
                !perms.has("SEND_MESSAGES") ||
                !perms.has("EMBED_LINKS") ||
                !perms.has("ATTACH_FILES"))
                return await reply.fail("Missing permissions in channel: ", "Send Messages, Embed Links, Attach Files");

            await message.guild.mlchan(channel.id);
            return await reply.succ("Memberlogs will be sent in: ", channel.toString());
        }
    }

    help = "Set the channel memberlog messages are sent in.";
    userPerms = ["MANAGE_GUILD"];
    alias = ["memberlogchannel", "mlchan"];
    arg = {
        type: "channel",
        info: "The channel memberlog messages are sent in.",
        example: "#memberlog",
        default: true
    };
}

module.exports = MLChannelCommand;