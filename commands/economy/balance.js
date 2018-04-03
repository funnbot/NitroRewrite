const { Command } = require("../../Nitro");

class BalanceCommand extends Command {
    async run({ message, bot, reply, t }) {
        const commands = bot.commands;
        const groups = bot.CommandLoader.groups;
        const requesterID = message.author.id;
        var balance = 0;
        const embed = bot.embed
            .setTitle(":atm: "+message.member.nickname+" :atm:")
            .nitroColor()
        embed.addField("Balance: "+balance.toFixed(2)+" :dollar:", "Account #: "+requesterID);
        embed.addField(bot.db.get("bank",requesterID,"balance"))
        //embed.addField(bot.db.get("Nitro",requesterID,"bank"))
        //embed.addField(bot.db.r.dbList())
        //embed.addField(JSON.stringify(bot.db))
        return await reply(embed);
    }

    help = "Shows your current balance";
    usage = "{}balance or {}balance <command>";
    dm = false;
    alias = ["money"];
}

module.exports = BalanceCommand;
