const { Command } = require("../../Nitro");

class EditTagCommand extends Command {

    async run({ message, bot, reply, t }) {
        const tags = await message.guild.tags();
        const tagName = message.args[0];
        const tagContent = message.args[1];
        const tag = tags[tagName];
        if (!tag) return await reply.fail("Tag does not exist.");
        tag.content = tagContent;
        tag.edited = Date.now();
        await message.guild.tags(tags);
        return await reply.succ("Edited tag.");
    }

    help = "Add a tag";
    usage = "{}addtag steve Hello fellow kids!";
    alias = ["edit-tag", "tagedit"];
    args = [{
        type: "string",
        info: "The tag name.",
        example: "steve"
    }, {
        type: "string",
        info: "The tag content.",
        example: "Hello fellow kids!"
    }];
}

module.exports = EditTagCommand;