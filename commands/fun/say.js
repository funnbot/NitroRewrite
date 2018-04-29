const { Command } = require("../../Nitro");

class SayCommand extends Command {
    async run({ message, bot, reply, t }) {
        const [input] = message.args;
        reply(input);
    }

    help = "Makes Nitro say a message";
    userPerm = "MANAGE_MESSAGES";
    alias = ["echo"];
    arg = {
        type: "string",
        info: "What do you want Nitro to say?",
        example: "**ECHO**... **echo**... echo...",
    }
}

module.exports = SayCommand;
