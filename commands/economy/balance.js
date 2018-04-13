const { Command } = require("../../Nitro");
const Wallet = require("../../Classes/Wallet")

class BalanceCommand extends Command {
    async run({ message, bot, reply, t }) {
        const wallet = new Wallet(message.author);
        const bal = await wallet.balance();
        //return reply("You have "+message.guild.formatBal(bal));
        const embed = bot.embed
            .setTitle(":atm: "+message.member.nickname+" :atm:")
            .nitroColor()
        var balance = await wallet.balance();
        embed.setDescription("You have **"+message.guild.formatBal(balance)+"**");
        return await reply(embed);
    }

    help = "Shows your current balance";
    alias = ["money", "bal"];
    arg = {
        type: "user",
        info: "The user to get the balance of.",
        example: "@richboi",
        default: true
    }
}

module.exports = BalanceCommand;
