const Nitro = require("../../Nitro.js")

module.exports = new Nitro.Command({
    help: "Change the prefix for commands.",
    example: '`${p}prefix !!` - The ping command would be called with `!!ping`\n`${p}prefix "nitro "` - This prefix has a space so it is wrapped in double quotes `nitro ping`',
    argExample: '<newPrefix> || "<newPrefix with space>"',
    dm: false,
    coolDown: 4,
    userPerms: 2,
    alias: ["setprefix"],

    run: async(message, bot, send) => {
        if (!message.checkSuffix) return send("**Use the prefix command to change the character you put before commands when calling them\nIf you want to include a space in the prefix, wrap it in double quotes.**");
        if (message.suffix.replace(/[^\"]/g, "").length === 2) {
            let split = message.suffix.split("\"")
            let quote = split[1];
            if (quote.length < 1) return send("` ` is not a valid prefix.");
            if (quote.startsWith(" ")) return send("`" + pre + "` is not a valid prefix.");
            if (quote.length > 20) return send("The prefix cannot be more than 20 characters");
            message.guild.prefix = quote;
            return send("**The prefix was set to `" + quote + "`\nTest - `" + quote + "ping`**");
        } else {
            let pre = message.suffix.trim();
            message.guild.prefix = pre;
            return send("**The prefix was set to `" + pre + "`\nTest - `" + pre + "ping`**");
        }
    }
})