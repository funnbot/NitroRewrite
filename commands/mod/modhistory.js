const { Command } = require("../../Nitro");

class ModHistoryCommand extends Command {
    async run({ message, bot, reply, t }) {
        const [user] = message.args;
        const userData = await message.guild.userData();
        const data = userData[user.id] || {};
        const mem = data.mod;
        if (!mem) return reply.fail("There is no history for this moderator.");
        const embed = bot.embed
            .setTitle("Mod History")
            .setAuthor(user.tag, user.avatarURL())
            .nitroColor();
        for (let [action, am] of Object.entries(mem)) {
            embed.addBetterField(action, am);
        }

        reply(embed);
    }

    help = "The actions by a moderator.";
    alias = "modh";
    arg = {
        type: "user",
        info: "The moderator to get the actions for.",
        example: "@modboi",
        default: true
    }
}

module.exports = ModHistoryCommand;