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

    help = "Information about discord things.";
    arg = {
        type: "selection",
        typeText: "subcommand",
        example: "user",
        endWithoutRest: true
    }
}

class UserInfoCommand extends Command {
    async run ({message, bot, reply, t}) {
        
    }

    help = "Information about a user.";
    arg = {
        type: "user",
        info: "The user to get info about.",
        example: "@person",
        default: true
    }
}

module.exports = InfoCommand;