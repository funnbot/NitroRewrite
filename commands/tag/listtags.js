const { Command, util } = require("../../Nitro");

class ListTagsCommand extends Command {

    async run({ message, bot, reply, t }) {
        const tags = await message.guild.tags();
        const to = [];
        const ts = [];
        for (let [name, tag] of Object.entries(tags)) {
            if (tag.server) ts.push(name);
            if (tag.owner === message.author.id) to.push(name);
        }

        const embed = bot.embed
            .addFieldDef("> Server Tags", util.shorten2000(ts.join(", ")))
            .addFieldDef("> Owned Tags", util.shorten2000(to.join(", ")))
            .nitroColor();

        return await reply(embed);
    }

    help = "List the tags on this server.";
    alias = "tags";
}

module.exports = ListTagsCommand;