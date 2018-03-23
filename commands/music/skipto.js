const { Command } = require("../../Nitro");

class SkipToMusicCommand extends Command {

    async run ({message, bot, reply, t}) {
        const [num] = message.args;

        const vc = message.member.voiceChannel;
        if (!vc) return reply.warn("Join a voice channel to run this command.");

        const player = bot.player.check(vc);
        if (!player) return reply.warn("There is no music playing.")

        if (!player.isDJ(message.author.id, message.channel)) 
            return reply.warn("You need DJ permissions to run this command.");

        player.skipto(num);
        return reply.succ("Songs skipped.");
    }

    help = "Skip x songs forward.";
    arg = {
        type: "num",
        info: "The song index to skip to.",
        example: "5",
        min: 1,
        max: 100
    }
}

module.exports = SkipToMusicCommand;