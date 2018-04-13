const { Command } = require("../../Nitro");

class PlayingChannelCommand extends Command {

    async run ({message, bot, reply, t}) {
        const vc = message.member.voiceChannel;
        if (!vc) return reply.warn("Join a voice channel to run this command.");

        const player = bot.player.check(vc);
        if (!player) return reply.warn("There is no music playing.")

        if (!player.isDJ(message.author.id, message.channel)) 
            return reply.warn("You need host permissions to run this command.");

        const [chan] = message.args;
        player.setBroadcast(chan.id);
        return reply.succ("Now playing channel set to " + chan);
    }

    help = "Set the channel now playing messages are sent in.";
    alias = "playingchannel"
    arg = {
        type: "channel",
        info: "The channel to set.",
        example: "#music",
        default: true
    }
}

module.exports = PlayingChannelCommand;