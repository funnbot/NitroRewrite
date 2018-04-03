const { Command } = require("../../Nitro");

class DailiesCommand extends Command {
    async run({ message, bot, reply, t }) {
        const commands = bot.commands;
        const groups = bot.CommandLoader.groups;
        const requesterID = message.author.id;
        var balance = 0;
        const embed = bot.embed
            .setTitle(":atm: "+message.member.nickname+" :atm:")
            .nitroColor()
        embed.addField("Here's a free 100.00 :dollar:", "Account #: "+requesterID);
        bot.db.set("bank",requesterID,"balance",0)
        return await reply(embed);
    }

    help = "Free Money";
    usage = "{}dalies";
    dm = false;
    alias = ["dole"];
}

module.exports = DailiesCommand;
