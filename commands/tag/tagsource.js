const { Command, util } = require("../../Nitro");

class TagSourceCommand extends Command {

    async run({ message, bot, reply, t }) {
        const tagName = message.args[0];
        const tags = await message.guild.tags();
        const tag = tags[tagName];
        if (!tag) return await reply.fail("Tag does not exist.");
        let content = "```\n" + util.escapeMarkdown(tag.content) + "```";
        return await reply(content);
    }

    help = "Get the raw markdown of a tag";
    usage = "{}tag info";
    alias = ["t"];
    arg = {
        type: "string",
        info: "The name of a tag",
        example: "info"
    };
}

module.exports = TagSourceCommand;