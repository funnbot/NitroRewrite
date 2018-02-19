const { Command } = require("../../Nitro");

class DelPermCommand extends Command {

    async run ({message, bot, send, t}) {
        send("test")
    }

    options() { return {
        help: "",
        usage: ""
    }}
}

module.exports = DelPermCommand;