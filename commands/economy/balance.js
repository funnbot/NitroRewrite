const { Command } = require("../../Nitro");
const Wallet = require("../../Classes/Wallet")

class BalanceCommand extends Command {
    async run({ message, bot, reply, t }) {
        const bal = await message.author.wallet.balance();

        const embed = bot.embed
            .setTitle(":atm: " + message.member.nickname + " :atm:")
            .nitroColor()
        embed.setDescription("You have **" + message.guild.formatBal(bal) + "**");
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