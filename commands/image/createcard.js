const { Command } = require("../../Nitro");
const jimp = require('jimp');
const { Image } = require("../../Nitro");

class CreateCardCommand extends Command {
    async run({ message, bot, reply, t }) {
        if (!message.args[0]) return reply.warn("To create a card: " + prefix + "createcard This text is on the question card | this text is on the anwser card");
        let text = message.suffix.split("|");
        if (!text[1]) return reply.fail("Please include text for the second card, and the delimeter `|`");

        const buf = Image.getStaticFile("cah");
        jimp.read(buf, async (err, img) => {
            if (err) return logger.err(err);
            const white = await jimp.loadFont(jimp.FONT_SANS_64_WHITE);
            const black = await jimp.loadFont(jimp.FONT_SANS_64_BLACK);

            img.print(white, 70, 70, text[0], 500);
            img.print(black, 680, 70, text[1], 500);

            img.getBuffer(jimp.AUTO, (err, file) => {
                reply(Image.send(file));
            })
        })
    }

    help = "Design your own cards against humanity card..";
    botPerm = "ATTACH_FILES";
    cooldown = 5;
}

module.exports = CreateCardCommand;