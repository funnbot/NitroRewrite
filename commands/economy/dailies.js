const { Command } = require("../../Nitro");

class DailiesCommand extends Command {
    async run({ message, bot, reply, t }) {
        const commands = bot.commands;
        const groups = bot.CommandLoader.groups;
        const requesterID = message.author.id;
        const doleAmount = 100;
        var balance = await bot.db.get("bank",requesterID,"balance");
        var transactions = await bot.db.get("bank",requesterID,"transactions")
        balance = balance + doleAmount;
        const embed = bot.embed
            .setTitle(":atm: "+message.member.nickname+" :atm:")
            .nitroColor()
        transactions.push({"amount":doleAmount,"reason":"Dailies","transactAccount":0,"timestamp":Date.now()})
        embed.addField("Here's a free 100.00 :dollar:", "New Balance: "+balance.toFixed(2)+" :dollar:");
        bot.db.set("bank",requesterID,"balance",balance);
        bot.db.set("bank",requesterID,"transactions",transactions);
        return await reply(embed);
    }

    help = "Free Money";
    usage = "{}dailies";
    dm = false;
    alias = ["dole"];
}

module.exports = DailiesCommand;
