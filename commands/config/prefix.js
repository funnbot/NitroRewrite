const { Command } = require("../../Nitro");

class PrefixCommand extends Command {

    async run({ message, bot, send, t }) {
        if (!message.checkSuffix) return send("**Use the prefix command to change the character you put before commands when calling them\nIf you want to include a space in the prefix, wrap it in double quotes.**");
        if (message.suffix.replace(/[^\"]/g, "").length === 2) {
            let split = message.suffix.split("\"")
            let quote = split[1];
            if (quote.length < 1) return send("` ` is not a valid prefix.");
            if (quote.startsWith(" ")) return send("`" + pre + "` is not a valid prefix.");
            if (quote.length > 20) return send("The prefix cannot be more than 20 characters");
            await message.guild.prefix(quote);
            return send("**The prefix was set to `" + quote + "`\nTest - `" + quote + "ping`**");
        } else {
            let pre = message.suffix.trim();
            await message.guild.prefix(pre);
            return send("**The prefix was set to `" + pre + "`\nTest - `" + pre + "ping`**");
        }
    }

    help = "Change the prefix for commands.";
    usage = '`{}prefix !!` - The ping command would be called with `!!ping`\n`{}prefix "nitro "` - This prefix has a space so it is wrapped in double quotes `nitro ping`';
    userPerm = "MANAGE_GUILD";
    cooldown = 20;
    alias = ["setprefix"];

}

module.exports = PrefixCommand;