const { Command } = require("../../Nitro");

class ListFiltersCommand extends Command {

    async run({ message, bot, reply, t }) {
        let [name] = message.args;
        const filters = await message.guild.filters();
        const keys = Object.keys(filters);

        if (!name) return keys.length > 0 ?
            await reply.succ("Filters on this server: ", keys.join(", ")) :
            await reply.warn("No filters exist.");

        if (!filters[name]) return await reply.fail("Filter `" + name + "` does not exist.");

        const w = filters[name].words;
        return w.length == 0 ?
            await reply.warn("Filter `" + name + "` has no words.") :
            await reply.succ("The filter `" + name + "` has: ", w.join(", "));

    }

    help = "List the filters or words in a filter.";
    usage = "";
    alias = ["filterlist", "wordlist", "listwords"];
    userPerms = ["MANAGE_GUILD"];
    arg = {
        type: "string",
        info: "The name of a filter",
        example: "badwords",
        default: null,
    };
}

module.exports = ListFiltersCommand;