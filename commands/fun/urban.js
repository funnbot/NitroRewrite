const { Command } = require("../../Nitro");
const snekfetch = require("snekfetch");

class UrbanCommand extends Command {
    async run({ message, bot, reply, t }) {
        const [input] = message.args;

        try {
            const res = await snekfetch.get(`http://api.urbandictionary.com/v0/define?term=${input}`);
            var { tags, list: [ info ]} = res.body;
            if (!tags || !info) throw 0;
        } catch { return reply.warn("No results found") }

        const embed = bot.embed
            .setTitle(`:book: ${info.word}`)
            .setURL(info.permalink)
            .addField("Definition", info.definition)
            .addField("Example Usage", info.example)
            .addField("Tags", tags.join(", "))
            .addField("Votes", `:thumbsup: ${info.thumbs_up} :thumbsdown: ${info.thumbs_down}`)
            .addField("Author", info.author)
            .setFooter("Powered by Urban Dictionary")
            .setTimestamp(new Date(info.written_on))
            .nitroColor();

        reply(embed);
    }

    help = "Search urban dictionary";
    arg = {
        type: "string",
        info: "Search string",
        example: "dab",
    }
}

module.exports = UrbanCommand;