const { Command, Image } = require("../../Nitro");

class SwirlCommand extends Command {
    async run({ message, bot, reply, t }) {
        const [factor] = message.args;
        let buf = await message.fetchImage();
        const gm = Image.createGM(buf);
        gm.swirl(factor);
        reply(Image.send(await Image.buffer(gm)));
    }

    help = "Swirl an image.";
    botPerm = "ATTACH_FILES";
    cooldown = 5;
    arg = {
        type: "int",
        info: "The swirl factor.",
        min: 1,
        max: 720,
        endWithoutRest: true
    }
}

module.exports = SwirlCommand;