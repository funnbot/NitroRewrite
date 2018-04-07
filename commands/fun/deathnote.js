const { Command, Image } = require("../../Nitro");

class DeathNoteCommand extends Command {
    //?deathnote @balde2876#5645
    async run({ message, bot, reply, t }) {
        const [user] = message.args;

        const img = new Image.Canvas(520, 283);
        await img.drawImage("death", 0, 0, 520, 283);
        img.ctx.font = "18px Papyrus";
        img.ctx.fillText(user.username, 275, 80);


        return reply(`**${message.author.username}** *has added* **${user.username}** *to their death note*`, img.send());
    }

    help = "Put someone on your death note";
    cooldown = 20;
    arg = {
        type: "user",
        info: "The user to add.",
        example: "@user"
    }
}

module.exports = DeathNoteCommand;
