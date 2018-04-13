const { Command } = require("../../Nitro");

class SetHostCommand extends Command {

    async run ({message, bot, reply, t}) {
        const vc = message.member.voiceChannel;
        if (!vc) return reply.warn("Join a voice channel to run this command.");

        const player = bot.player.check(vc);
        if (!player) return reply.warn("There is no music playing.")

        if (!player.isDJ(message.author.id, message.channel)) 
            return reply.warn("You need host permissions to run this command.");

        const [user] = message.args;
        player.setDJ(user.id);
        return reply.succ(`${user.tag} has been made the host.`);
    }

    help = "Set the host of the current session.";
    arg = {
        type: "user",
        info: "The new host to set.",
        example: "@otheruser"
    }
}

module.exports = SetHostCommand;