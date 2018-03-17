const { Command } = require("../../Nitro");

class RoleInfoCommand extends Command {

    async run ({message, bot, reply, t}) {
        send("test")
    }

    help = "";
}

module.exports = RoleInfoCommand;