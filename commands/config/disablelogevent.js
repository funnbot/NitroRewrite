const { Command } = require("../../Nitro");

class DisableLogEventCommand extends Command {

    async run({ message, bot, reply, t }) {
        send("test")
    }

    help = "";
    usage = "";
}

module.exports = DisableLogEventCommand;