const { Command } = require("../../Nitro");

class BurnCommand extends Command {
    async run ({message, bot, reply, t}) {
        const [user] = message.args;
        reply(`**${message.author.username}** *burned* **${user.username}**\nYou need some ice for that bud? :snowflake:\nhttps://cdn.discordapp.com/attachments/186920285285384192/262348996784291840/image.gif`);
    }

    help = "Burn a user.";
    args = [{
        type: "user",
        info: "The user to burn.",
        example: "@Nerd"
    }]
}

module.exports = BurnCommand;