const { Command } = require("../../Nitro");

class AvatarCommand extends Command {

    async run({ message, bot, send, t }) {
        const user = message.args[0];
        const embed = new bot.Embed();
        embed.setDescription("**Here is the avatar for:** " + user.username)
            .setImage(user.displayAvatarURL({ size: 2048 }))
            .nitroColor();
        return send(embed);
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