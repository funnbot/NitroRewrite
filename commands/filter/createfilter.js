const { Command } = require("../../Nitro");

class CreateFilterCommand extends Command {

    async run ({message, bot, reply, t}) {
        let [ name, words ] = message.args; 
        const filters = await message.guild.filters();
        name = name.toLowerCase();
        if (!!filters[name]) return await reply.fail(`Filter \`${name}\` already exists`);
        
        words = words.split(" ").filter(s => s != "").map(s => s.replace(/[^a-z]/gi, '')).map(String.toLowerCase);
        if (words.length == 0) return await reply.fail("No valid words found.");

        filters[name] = {
            words,
            exempt: {},
            level: 1
        }

        await message.guild.filters(filters);
        return await reply.succ("Added filter " + name + ": ", words.join(", "));
    }

    options() { return {

    }}

    help = "Create a new content filter.";
    userPerms = ["MANAGE_GUILD"];
    args = [{
        type: "string",
        info: "The name of this filter",
        max: "100",
        example: "badwords"
    }, {
        type: "string",
        info: "The words in the filter. Only letters allowed.",
        example: "heck frick meme dang shoot"
    }];
}

module.exports = CreateFilterCommand;