const { Command } = require("../../Nitro");

class AvatarCommand extends Command {

    async run({ message, bot, reply, t }) {
        const user = message.args[0];
        return reply("Here is the avatar for: " + user.username + "\n" + user.displayAvatarURL({ size: 2048 }))
    }

    help = "Get someones avatar";
    usage = "{}avatar @Funnbot";
    args = [{
        type: "user",
        info: "The user whos avatar you want",
        default: true
    }];
}

module.exports = AvatarCommand;