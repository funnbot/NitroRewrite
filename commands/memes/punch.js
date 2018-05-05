const { Command, Image } = require("../../Nitro");


class PunchCommand extends Command {
    async run({ message, bot, reply, t }) {
        const [user] = message.args;

        const authorPFP = message.author.displayAvatarURL({ format: "png" });
        const targetPFP = user.displayAvatarURL({ format: "png" });

        const punch = Image.getStaticFile("punch");
        const authorBuf = await Image.readUrl(authorPFP);
        const targetBuf = await Image.readUrl(targetPFP);

        const { ctx, canvas } = Image.canvas(626, 626);

        ctx.drawImage(Image.canvasImage(punch), 0, 0, 626, 626);
        ctx.rotate(5 * Math.PI / 180);
        ctx.drawImage(Image.canvasImage(authorBuf), 115, 20, 100, 100);
        ctx.rotate(-5 * Math.PI / 180);
        ctx.rotate(-30 * Math.PI / 180);
        ctx.drawImage(Image.canvasImage(targetBuf), 275, 250, 100, 100);
        ctx.rotate(30 * Math.PI / 180);
        const file = Image.send(canvas.toBuffer());

        return reply(`**${message.author.username}** *sucker punches* **${user.username}**`, file);
    }

    help = "Sucker punch a user";
    botPerm = "ATTACH_FILES";
    cooldown = 5;
    arg = {
        type: "user",
        info: "The user to punch.",
        example: "@user"
    }
}

module.exports = PunchCommand;