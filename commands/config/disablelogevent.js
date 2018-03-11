const { Command } = require("../../Nitro");

class DisableLogEventCommand extends Command {

    async run ({message, bot, reply, t}) {
        send("test")
    }

    options() { return {
        help: "",
        usage: ""
    }}
}

module.exports = DisableLogEventCommand;