const { Command } = require("../../Nitro");

class InfoCommand extends Command {

    onEnable() {
        this.registerSubCommands({

        })
    }

    async run ({message, bot, reply, t}) {
        const [ sub ] = message.args;
        return await this.runSubCommand(sub);
    }

    help = "";
    arg = {
        
    }
}

module.exports = InfoCommand;