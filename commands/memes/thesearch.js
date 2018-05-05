const { Command, Image } = require("../../Nitro");

class TheSearchCommand extends Command {
    async run({ message, bot, reply, t }) {
        const [input] = message.args;

        const { canvas, ctx } = Image.canvas(700, 612);
        const thesearch = Image.canvasImage(Image.getStaticFile("thesearch"));
        ctx.drawImage(thesearch, 0, 0, 700, 612);
        const caption = await Image.createCaption(input.toUpperCase(), 162, 69, "comicsans.ttf", 18 - input.length / 10, "#171819");
        ctx.drawImage(Image.canvasImage(caption), 60, 330, 162, 69);
        const file = Image.send(canvas.toBuffer());

        reply(file);
    }

    help = "The search continues meme";
    botPerm = "ATTACH_FILES";
    cooldown = 5;
    arg = {
        type: "string",
        info: "A stupid idea",
        example: "Arrays end at 0"
    }
}

module.exports = TheSearchCommand;