const { Command } = require("../../Nitro");

class LevelFilterCommand extends Command {

    async run ({message, bot, reply, t}) {
        const [filt, lvl] = message.args;

        const filters = await message.guild.filters();
        let filter = filters[filt];
        if (!filter) return reply.fail("Filter does not exist.");

        filter.level = parseInt(lvl);
        filters[filt] = filter;

        await message.guild.filters(filters);
        return reply.succ(`Set the filter ${filt} to level`, lvl);
    }

    help = "Set the strictness of a filter.";
    args = [{
        type: "string",
        info: "The filter to set.",
        example: "badwords"
    }, {
        type: "selection",
        info: "`1` - Only if the word directly matches, `2` - replaces lookalike characters, `3` - if the word is found anywhere.",
        items: ["1", "2", "3"],
        example: "2"
    }]
}

module.exports = LevelFilterCommand;