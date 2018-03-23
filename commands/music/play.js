const { Command } = require("../../Nitro");

class PlayCommand extends Command {
    onEnable() {
        this.registerSubCommands({
            search: YTSearchCommand,
            searchlist: SearchListCommand,
            scsearch: SCSearchCommand,
            link: LinkCommand
        })
    }

    async run({ message, bot, reply, t }) {
        const vc = message.member.voiceChannel;
        if (!vc) return reply.warn("Join a voice channel to queue music.");

        const [sub] = message.args;
        this.runSubCommand(sub);
    }

    help = "Play a song";
    alias = "join";
    cooldown = 10;
    arg = {
        type: "selection",
        typeText: "subcommand",
        example: "search",
        endWithoutRest: true
    }
}

class SearchListCommand extends Command {
    async run({ message, bot, reply, t }) {
        const [_, query] = message.args;
        const vc = message.member.voiceChannel;
        
        const player = await bot.player.get(vc);
        if (!player._broadcastChannel) player.setBroadcast(message.channel);
        if (!player.dj) player.setDJ(message.author.id);

        try {
            var trackData = await player.search("ytsearch: " + query);
        } catch {
            return reply.warn("Search returned 0 results.");
        }

        const items = trackData.slice(0, 5);
        const embed = bot.embed
            .setTitle("Youtube Search")
            .setFooter("Select a track by its number or cancel.")
            .nitroColor()
        items.forEach((item, i) => {
            embed.addBetterField(i + 1, `[${item.title}](${item.url})`);
        })
        await reply(embed);

        const filter = m => m.author.id === message.author.id;
        try {
            const col = await message.channel.awaitMessages(filter, { max: 1, time: 10000, errors: ["time"] });
            var num = parseInt(col.first().content) || null;
        } catch {
            return reply.edit("**Cancelled.**", { embed: null });
        }

        if (!num || num < 1 || num > items.length)
            return reply.edit("**Cancelled.**", { embed: null });

        let track = items[num - 1];
        player.queueTrack(track);
        return reply.edit(formatMessage(track, message.author));
    }

    help = "Search youtube and choose from a list."
    arg = {
        type: "string",
        typeText: "query",
        info: "The search term.",
        example: "Never gonna give you up.",
        max: 200
    }
}

class YTSearchCommand extends Command {
    async run({ message, bot, reply, t }) {
        const [_, query] = message.args;

        const vc = message.member.voiceChannel;

        const player = await bot.player.get(vc);
        if (!player._broadcastChannel) player.setBroadcast(message.channel);
        if (!player.dj) player.setDJ(message.author.id);

        try {
            var trackData = await player.playSearch("ytsearch: " + query);
        } catch {
            return reply.warn("No tracks found.");
        }

        return reply(formatMessage(trackData, message.author));
    }

    help = "Search youtube for a video.";
    arg = {
        type: "string",
        typeText: "query",
        info: "The search term.",
        example: "Never gonna give you up.",
        max: 200
    }
}

class SCSearchCommand extends Command {
    async run({ message, bot, reply, t }) {
        const [_, query] = message.args;

        const vc = message.member.voiceChannel;

        const player = await bot.player.get(vc);
        if (!player._broadcastChannel) player.setBroadcast(message.channel);
        if (!player.dj) player.setDJ(message.author.id);

        try {
            var trackData = await player.playSearch("scsearch: " + query);
        } catch {
            return reply.warn("No tracks found.");
        }

        return reply(formatMessage(trackData, message.author));
    }

    help = "Search soundcloud for a track.";
    arg = {
        type: "string",
        typeText: "query",
        info: "The search term.",
        example: "Never gonna give you up.",
        max: 200
    }
}

class LinkCommand extends Command {
    async run({ message, bot, reply, t }) {
        const [_, query] = message.args;

        const vc = message.member.voiceChannel;

        const player = await bot.player.get(vc);
        if (!player._broadcastChannel) player.setBroadcast(message.channel);
        if (!player.dj) player.setDJ(message.author.id);

        try {
            var trackData = await player.playLink(query);
        } catch {
            return reply.warn("No tracks found.");
        }

        return reply(formatMessage(trackData, message.author));
    }

    help = "Play a link.";
    arg = {
        type: "string",
        typeText: "link",
        info: "The link to play.",
        example: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        max: 1000
    }
}

function formatMessage(trackData, author) {
    const type = typeof2(trackData) === "array";
    const main = type ? trackData[0] : trackData;
    let txt = `**Queued song: [${main.title}](${main.url})**`
    if (type) txt += ` **plus ${trackData.length - 1} more**`;
    return author.client.embed
        .setAuthor(author.username, author.avatarURL())
        .setDescription(txt)
        .nitroColor()
}

module.exports = PlayCommand;