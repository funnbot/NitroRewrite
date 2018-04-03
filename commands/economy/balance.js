const { Command } = require("../../Nitro");

class BalanceCommand extends Command {
    async run({ message, bot, reply, t }) {
        const [user] = message.args;
        const bal = await user.balance();
        return reply(":atm: ")
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