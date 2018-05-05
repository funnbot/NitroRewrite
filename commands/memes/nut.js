const { Command, Image } = require("../../Nitro");

class NutCommand extends Command {
    async run({ message, bot, reply, t }) {
        const [input] = message.args;
        
        const { canvas, ctx } = Image.canvas(612, 612);
        const nut = Image.canvasImage(Image.getStaticFile("nutmeme"));
        ctx.drawImage(nut, 0, 0, 612, 612);

        const caption = await Image.createCaption(input, 590, 145, "arial.ttf", 40, "black", "northwest");
        ctx.drawImage(Image.canvasImage(caption), 20, 8, 590, 145);

        const file = Image.send(canvas.toBuffer());
        reply(file);
    }

    help = "The nut button meme";
    botPerm = "ATTACH_FILES";
    cooldown = 5;
    arg = {
        type: "string",
        info: "Text to put in the meme",
        example: "When papi hitting it from behind and resolves your promise"
    }
}

module.exports = NutCommand;
