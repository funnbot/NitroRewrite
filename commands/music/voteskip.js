const { Command } = require("../../Nitro");

class VoteSkipCommand extends Command {

    async run({ message, bot, reply, t }) {
        const vc = message.member.voiceChannel;
        if (!vc) return reply.warn("Join a voice channel to run this command.");

        const player = bot.player.check(vc);
        if (!player) return reply.warn("There is no music playing.")

        if (message.guild.cache.exists("voteskip")) return;
        message.guild.cache.set("voteskip");

        const botVC = message.guild.me.voiceChannel;
        if (!botVC) return reply("The bot is not in a voice channel.");
        const listenting = botVC.members.size;
        if (listenting <= 2) {
            player.skip();
            return reply.succ("Song skipped.");
        }

        if (message.guild.cache.exists("voteskip")) return;
        message.guild.cache.set("voteskip");

        const needed = Math.ceil(listenting / 2);
        const voted = [message.author.id];
        const filter = m => m.content === `${message.prefix}voteskip` && !voted.includes(m.author.id);
        const collector = message.channel.createMessageCollector(filter, { time: 30000 });
        collector.on("collect", m => {
            voted.push(m.author.id);
            const botVC = message.guild.me.voiceChannel;
            if (!botVC) collector.stop();
            const listenting = botVC.members.size;
            const needed = Math.ceil(listenting / 2);
            if (voted.length >= needed) {
                collector.stop();
                player.skip();
                m.channel.send("**Song skipped**");
            } else m.channel.send(`**${voted.length}/${needed} voted required to skip this song.**`)
        })

        collector.on("end", r => {
            if (r === "time")
                message.channel.send("**Vote skip failed.**")
        })
    }

    help = "Vote to skip the current song.";
}

module.exports = VoteSkipCommand;