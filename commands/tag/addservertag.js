const { Command } = require("../../Nitro");

class AddServerTagCommand extends Command {

    async run({ message, bot, reply, t }) {
        const tags = await message.guild.tags();
        const tagName = message.args[0];
        const tagContent = message.args[1];
        if (Object.keys(tags) > 100) return await reply.fail("Too many tags on this server!");
        if (tags[tagName]) return await reply.fail("Tag already exists.");
        if (tagName.length > 100) return await reply.fail("Tag name is too long.");
        tags[tagName] = {
            owner: message.author.id,
            content: tagContent,
            created: Date.now(),
            used: 0,
            server: true
        }
        await message.guild.tags(tags);
        return await reply.succ("Added tag");
    }

    help = "Add a server tag.";
    usage = "{}addservertag steve Hello fellow kids!";
    userPerms = ["MANAGE_GUILD"];
    args = [{
        type: "string",
        info: "The tag name",
        example: "steve"
    }, {
        type: "string",
        info: "The tag content",
        example: "Hello fellow kids!"
    }];
}

module.exports = AddServerTagCommand;