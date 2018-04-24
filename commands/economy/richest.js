const { Command, Paginator } = require("../../Nitro");

class RichestCommand extends Command {

    async run({ message, bot, reply, t }) {
        const [p, f] = message.args;
        let data = await bot.db.filter("user", user => user("balance").gt(0))
        if (f === "server") {
            await message.guild.members.fetch();
            data = data.filter(user => message.guild.members.has(user.id));
        }
        const users = data.sort((a, b) => b.balance - a.balance);
        const total = users.map(e => e.balance).reduce((a, b) => a + b, 0);

        const pages = new Paginator(users, 10);
        const userTxt = [];
        
        for (let [i, userData] of pages.pageValues(p)) {
            const {balance, id} = userData;
            try { var user = await bot.users.fetch(id); } catch { continue; }
            userTxt.push(`**${i+1}. ${user.tag} - ${message.guild.formatBal(balance)}**`);
        }

        const embed = bot.embed
            .setTitle("Leaderboard " + f)
            .setDescription(userTxt.join("\n"))
            .setFooter(`Page ${p}/${pages.pageCount} - $${total} in circulation`)
            .nitroColor();

        reply(embed)
    }

    help = "Get the richest users.";
    cooldown = 10;
    alias = "moneyleaderboard";
    args = [{
            type: "int",
            info: "The page number",
            example: 1,
            default: 1
        },
        {
            type: "selection",
            info: "`global` or `server` to filter.",
            items: ["global", "server"],
            example: "global",
            default: "global"
        }
    ]
}

module.exports = RichestCommand;