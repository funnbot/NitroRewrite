const { Command } = require("../../Nitro");

class PlaylistCommand extends Command {

    async run ({message, bot, reply, t}) {
        const [num] = message.args;

        const vc = message.member.voiceChannel;
        if (!vc) return reply.warn("Join a voice channel to run this command.");

        const player = bot.player.check(vc);
        if (!player) return reply.warn("There is no music playing.")

        let playlist = player.playlistInfo(num);

        const embed = bot.embed
            .setTitle("Playlist")
            .nitroColor()
            .setFooter(`Page ${num}/${playlist.pageCount}`)
            .addBetterField("Currently Playing", `[${playlist.nowPlaying.title}](${playlist.nowPlaying.url}) (${playlist.nowPlaying.length}) \n`);
        for (let i = 0; i < playlist.tracks.length; i++) {
            let track = playlist.tracks[i];
            embed.addBetterField(track.index + 1, `[${track.title}](${track.url}) (${track.length})`);
        }
        embed.addBetterField("Total Length", playlist.totalLength.toString(), true)

        return reply(embed);
    }

    help = "Get the current playlist.";
    arg = {
        type: "num",
        info: "The playlist page number.",
        example: "1",
        min: 1,
        default: 1
    }
}

module.exports = PlaylistCommand;