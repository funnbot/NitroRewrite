const { Command } = require("../../Nitro");

class PauseCommand extends Command {

    async run({ message, bot, reply, t }) {
        const vc = message.member.voiceChannel;
        if (!vc) return reply.warn("Join a voice channel to run this command.");

        const player = bot.player.check(vc);
        if (!player) return reply.warn("There is no music playing.")

        if (!player.isDJ(message.author.id, message.channel))
            return reply.warn("You need host permissions to run this command.");

        player.pause();
        return reply.succ("Music paused.");
    }

    help = "Pause playing music.";
}

module.exports = PauseCommand;