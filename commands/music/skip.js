const { Command } = require("../../Nitro");

class SkipMusicCommand extends Command {

    async run ({message, bot, reply, t}) {
        const vc = message.member.voiceChannel;
        if (!vc) return reply.warn("Join a voice channel to run this command.");

        const player = bot.player.check(vc);
        if (!player) return reply.warn("There is no music playing.")

        if (!player.isDJ(message.author.id, message.channel)) 
            return reply.warn("You need DJ permissions to run this command.");

        player.skip();
        return reply.succ("Song skipped.");
    }

    help = "Skip the current song.";
}

module.exports = SkipMusicCommand;