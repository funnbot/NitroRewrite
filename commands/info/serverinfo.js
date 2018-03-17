const { Command } = require("../../Nitro");

class ServerInfoCommand extends Command {

    async run ({message, bot, reply, t}) {
        send("test")
    }

    help = "";
}

module.exports = ServerInfoCommand;