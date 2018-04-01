const { Command } = require("../../Nitro");

class UserHistoryCommand extends Command {
    async run({ message, bot, reply, t }) {
        const [user] = message.args;
        const userData = await message.guild.userData();
        const data = userData[user.id] || {};
        const mem = data.mem;
        if (!mem) return reply.fail("There is no history for this user.");
        const embed = bot.embed
            .setTitle("User History")
            .setAuthor(user.tag, user.avatarURL())
            .nitroColor();
        for (let [action, reasons] of Object.entries(mem)) {
            embed.addBetterField(action, reasons.length);
        }

        reply(embed);
    }

    help = "The moderation actions on a user.";
    alias = "userh";
    arg = {
        type: "user",
        info: "The user to get moderation actions on.",
        example: "@goodboi",
        default: true
    }
}

module.exports = UserHistoryCommand;