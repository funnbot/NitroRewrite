const { Command } = require("../../Nitro");

class ExemptUserCommand extends Command {

    async run ({message, bot, reply, t}) {
        send("test")
    }

    options() { return {
        help: "",
        usage: ""
    }}
}

module.exports = ExemptUserCommand;