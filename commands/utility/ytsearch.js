const { Command, YTAPITOKEN } = require("../../Nitro");
const snekfetch = require("snekfetch");

class YTSearchCommand extends Command {
    async run({ message, bot, reply, t }) {
        const [input] = message.args;

        try { var url = await search(input); } catch { return reply.warn("Search returned 0 results.") }
        return reply(url);
    }

    help = "Search youtube.";
    arg = {
        type: "string",
        info: "Search string",
        example: "the cinnamon challenge",
    }
}

async function search(query) {
    term = query.split(" ").join("+");
    const uri = `https://www.googleapis.com/youtube/v3/search?maxResults=1&q=${term}&key=${YTAPITOKEN}&part=snippet`
    const { body } = await snekfetch.get(uri);
    const { id } = body.items[0];

    if (id.kind === "youtube#channel") {
        var type = `channel/${id.channelId}`;
    } else if (id.kind === "youtube#playlist") {
        var type = `playlist?list=${id.playlistId}`;
    } else var type = `watch?v=${id.videoId}`;

    return `https://www.youtube.com/${type}`;
}

module.exports = YTSearchCommand;