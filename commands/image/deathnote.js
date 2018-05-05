const { Command, Image } = require("../../Nitro");

class DeathNoteCommand extends Command {
    //?deathnote @balde2876#5645
    async run({ message, bot, reply, t }) {
        const [user] = message.args;

        const { ctx, canvas } = Image.canvas(520, 283);
        const background = Image.canvasImage(Image.getStaticFile("death"));
        
        ctx.drawImage(background, 0, 0, 520, 283);
        ctx.font = "18px Papyrus";
        ctx.fillText(user.username, 275, 80);
        const file = Image.send(canvas.toBuffer());

        return reply(`**${message.author.username}** *has added* **${user.username}** *to their death note*`, file);
    }

    help = "Put someone on your death note";
    botPerm = "ATTACH_FILES";
    cooldown = 5;
    arg = {
        type: "user",
        info: "The user to add.",
        example: "@user"
    }
}

module.exports = DeathNoteCommand;