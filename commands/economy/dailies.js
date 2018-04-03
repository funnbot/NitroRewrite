const { Command } = require("../../Nitro");

class DailiesCommand extends Command {

    async run ({message, bot, reply, t}) {
        send("test")
    }

    help = "";
}

module.exports = DailiesCommand;