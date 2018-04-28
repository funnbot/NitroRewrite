const { Command } = require("../../Nitro");

class SavePlaylistCommand extends Command {

    async run ({message, bot, reply, t}) {
        send("test")
    }

    help = "";
    wip = true;
}

module.exports = SavePlaylistCommand;