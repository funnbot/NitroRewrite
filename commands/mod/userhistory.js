const { Command } = require("../../Nitro");

class UserHistoryCommand extends Command {
    async run({ message, bot, reply, t }) {
        const [user, action] = message.args;
        const userData = await message.guild.userData();
        const data = userData[user.id] || {};
        const mem = data.mem;
        if (!mem) return reply.fail("There is no history for this user.");

        const embed = bot.embed
            .setTitle("User History")
            .setAuthor(user.tag, user.avatarURL())
            .nitroColor();

        if (action === "all") {
            for (let [action, reasons] of Object.entries(mem)) {
                embed.addBetterField(action + "s", reasons.length);
            }
        } else {
            const reasons = mem[action];
            if (!reasons) return reply.fail(`This user has no ${action}s`);
            embed.setTitle("User History - " + action + "s");
            let txt = [];
            for (let i = 0; i < reasons.length; i++) {
                txt.push(`**${i+1}.** "${reasons[i]}"`);
            }
            embed.setDescription(txt.join("\n").shorten(1900, "..."));
        }

        reply(embed);
    }

    help = "The moderation actions on a user.";
    alias = "userh";
    args = [{
        type: "user",
        info: "The user to get moderation actions on.",
        example: "@goodboi",
        default: true
    }, {
        type: "selection",
        info: "Specify action: `ban`, `softban`, `tempban`, `kick`, `mute`, `warn`, or `unban`",
        example: "kick",
        items: ["ban", "softban", "tempban", "kick", "mute", "warn", "unban", "all"],
        default: "all"
    }]
}

module.exports = UserHistoryCommand;