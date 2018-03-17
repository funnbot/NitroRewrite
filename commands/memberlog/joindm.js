const { Command } = require("../../Nitro");

class JoinDMCommand extends Command {

    async run ({message, bot, reply, t}) {
        send("test")
    }

    help = "";
}

module.exports = JoinDMCommand;