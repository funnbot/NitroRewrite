const { Command } = require("../../Nitro");

class LevelingCommand extends Command {

    async run ({message, bot, reply, t}) {
        send("test")
    }

    help = "Enable leveling in your server.";
    wip = true;
}

module.exports = LevelingCommand;