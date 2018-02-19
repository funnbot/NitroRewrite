const { Command } = require("../../Nitro");

class TagCommand extends Command {

    async run ({message, bot, reply, t}) {
        const tagName = message.args[0];
        const tags = await message.guild.tags();
        const tag = tags[tagName];
        if (!tag) return await reply.fail("Tag does not exist.");
        tag.used++
        tags[tagName] = tag;
        reply(tag.content);
        return await message.guild.tags(tags);
    }

    options() { return {
        help: "Get a tag",
        usage: "{}tag info",
        alias: ["t"],
        args: [{
            type: "string",
            info: "The name of a tag",
            example: "info"
        }]
    }}
}

module.exports = TagCommand;