const { Command, Image: { Canvas, Image } } = require("../../Nitro");


class PunchCommand extends Command {
    async run({ message, bot, reply, t }) {
        const [user] = message.args;

        const authorPFP = message.author.displayAvatarURL({format: "png"});
        const targetPFP = user.displayAvatarURL({format: "png"});

        const img = new Canvas(626, 626);
        await img.drawImage("punch", 0, 0, 626, 626);

        img.ctx.rotate(5*Math.PI/180);
        await img.drawURL(authorPFP, 115, 20, 100, 100);
        img.ctx.rotate(-5*Math.PI/180);
        img.ctx.rotate(-30*Math.PI/180);
        await img.drawURL(targetPFP, 275, 250, 100, 100);
        img.ctx.rotate(30*Math.PI/180);

        reply(`**${message.author.username}** *sucker punches* **${user.username}**`, img.send());
    }

    help = "Sucker punch a user";
    cooldown = 20;
    arg = {
        type: "user",
        info: "The user to punch.",
        example: "@user"
    }
}

module.exports = PunchCommand;
