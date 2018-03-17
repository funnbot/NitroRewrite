const { Command } = require("../../Nitro");

class DelTagCommand extends Command {

    async run({ message, bot, reply, t }) {
        const tagName = message.args[0];
        const tags = await message.guild.tags();
        if (!tags[tagName]) return await reply.fail("Tag does not exist.");
        let tag = tags[tagName];
        if (tag.owner !== message.author.id || !message.authorPerm("MANAGE_GUILD"))
            return await reply.fail("You are not the owner of this tag.", " The Manage Guild permission will bypass this.");
        delete tags[tagName];
        await message.guild.tags(tags);
        await reply.succ("Tag deleted.");
    }

    help = "Delete a tag.";
    usage = "{}deltag info";
    alias = ["del-tag", "deletetag", "removetag", "tagdel"];
    args = [{
        type: "string",
        info: "The name of a tag.",
        example: "info"
    }];
}

module.exports = DelTagCommand;