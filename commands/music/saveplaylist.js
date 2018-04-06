const { Command } = require("../../Nitro");

class SavePlaylistCommand extends Command {

    async run ({message, bot, reply, t}) {
        send("test")
    }

    help = "";
}

module.exports = SavePlaylistCommand;