const { Command } = require("../../Nitro");

class IRCChannelCommand extends Command {

    async run({ message, bot, reply, t }) {
        const [channel] = message.args;
        const irc = await channel.irc();

        if (irc) {
            await channel.irc(false);
            return await reply.succ("Disabled IRC in: ", channel.toString());
        } else {
            await channel.irc(true);
            return await reply.succ("Enabled IRC in: ", channel.toString());
        }
    }

    help = "Toggle a channel as open to IRC.";
    userPerm = "MANAGE_GUILD";
    arg = {
        type: "channel",
        info: "A channel to allow IRC messages.",
        example: "#irc",
        default: true
    };
}

module.exports = IRCChannelCommand;