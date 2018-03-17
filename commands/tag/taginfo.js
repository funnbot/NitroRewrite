const { Command } = require("../../Nitro");
const moment = require("moment")
class TagInfoCommand extends Command {

    async run({ message, bot, reply, t }) {
        const tagName = message.args[0];
        const tags = await message.guild.tags();
        const tag = tags[tagName];
        if (!tag) return await reply.fail("Tag does not exist");

        try { var owner = await bot.users.get(tag.owner); } catch (e) { var owner = "Unknown"; }
        const created = moment(tag.created).format("llll")
        const edited = moment(tag.edited || 1).format("llll");

        const embed = bot.embed
            .setTitle(tagName)
            .addField("Owner", `${owner.tag} (${owner.id})`)
            .addField("Used", tag.used)
            .addField("Server Tag", tag.server ? "yes" : "no")
            .addField("Created", created)
            .nitroColor();
        (!tag.edited) || embed.addField("Edited", edited);

        return await reply(embed);
    }

    help = "Info for a tag.";
    usage = "{}taginfo steve";
    args = [{
        type: "string",
        info: "The name of a tag",
        example: "steve"
    }];
}

module.exports = TagInfoCommand;