const { Command } = require("../../Nitro");

class ExemptChannelCommand extends Command {

    async run({ message, bot, reply, t }) {
        const [channel] = message.args;
        const filterexempt = await message.guild.filterexempt();

        if (filterexempt[channel.id]) {
            filterexempt[channel.id] = null;
            await message.guild.filterexempt(filterexempt);
            return await reply.succ("The filter will no longer ignore: ", channel.toString());
        } else {
            filterexempt[channel.id] = 1;
            await message.guild.filterexempt(filterexempt);
            return await reply.succ("The filter will ignore: ", channel.toString());
        }
    }

    help = "Make filters ignore a channel.";
    userPerms = ["MANAGE_GUILD"];
    alias = "unexemptchannel";
    arg = {
        type: "channel",
        info: "The channel to be ignored by filters.",
        example: "#advertisements",
        default: true
    };
}

module.exports = ExemptChannelCommand;