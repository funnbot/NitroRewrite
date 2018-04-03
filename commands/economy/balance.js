const { Command } = require("../../Nitro");

class BalanceCommand extends Command {

    async run ({message, bot, reply, t}) {
        send("test")
    }

    help = "";
}

module.exports = BalanceCommand;