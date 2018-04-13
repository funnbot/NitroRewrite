const { Command } = require("../../Nitro");

class LoadPlaylistCommand extends Command {

    async run ({message, bot, reply, t}) {
        send("test")
    }

    help = "";
}

module.exports = LoadPlaylistCommand;