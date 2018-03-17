const { Command } = require("../../Nitro");

class BlackListChannelCommand extends Command {

    async run({ message, bot, reply, t }) {
        const [channel] = message.args;

        const bl = await message.guild.blacklist();
        if (bl[channel.id]) {
            bl[channel.id] = null;
            await message.guild.blacklist(bl);
            return await reply.succ("Unblacklisted channel: ", channel.toString());
        } else {
            bl[channel.id] = true;
            await message.guild.blacklist(bl);
            return await reply.succ("Blacklisted channel: ", channel.toString());
        }
    }

    help = "Blacklist a channel.";
    userPerm = "BAN_MEMBERS";
    alias = ["blchannel", "unblacklistchannel", "unblchannel"];
    arg = {
        type: "channel",
        info: "The channel to blacklist",
        example: "#onlytalking",
    }
}

module.exports = BlackListChannelCommand;