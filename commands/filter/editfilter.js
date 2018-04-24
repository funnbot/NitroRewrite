const { Command } = require("../../Nitro");

class EditFilterCommand extends Command {

    async run({ message, bot, reply, t }) {
        let [name, action, words] = message.args;
        const filters = await message.guild.filters();

        if (!filters[name]) return await reply.warn("Filter does not exist");
        words = words.split(" ").filter(s => s != "").map(s => s.replace(/[^a-z]/gi, ''));
        if (!words.length) return await reply.fail("No words resolved.");

        const filter = filters[name];

        for (let word of words) {
            if (action === "add") {
                if (!filter.words.includes(word))
                    filter.words.push(word);
            } else if (action === "del") {
                let i = filter.words.indexOf(word);
                if (i > -1)
                    filter.words.splice(i, 1);
            }
        }

        filters[name] = filter;

        await message.guild.filters(filters);
        return await reply.succ(`Edited filter ${name}: `, filter.words.join(", "));
    }

    help = "Add or a remove a word from a filter.";
    userPerms = ["MANAGE_GUILD"];
    args = [{
        type: "string",
        info: "The name of a filter",
        example: "badwords",
        max: 100
    }, {
        type: "selection",
        items: ["add", "del"],
        info: "`add` or `del` a word from a filter",
        example: "add"
    }, {
        type: "string",
        info: "Words to add or remove",
        example: "shoot heck",
    }];
}

module.exports = EditFilterCommand;