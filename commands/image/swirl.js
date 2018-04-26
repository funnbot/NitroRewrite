const { Command, Image } = require("../../Nitro");

class SwirlCommand extends Command {
    async run({ message, bot, reply, t }) {
        const [factor] = message.args;
        let buf = await Image.searchChannel(message.channel);
        if (!buf) buf = await Image.readUrl(message.author.avatarURL());
        const gm = Image.createGM(buf);
        gm.swirl(factor);
        reply(Image.send(await Image.gmBuffer(gm)));
    }

    help = "Swirl an image.";
    arg = {
        type: "int",
        info: "The swirl factor.",
        min: 1,
        max: 720,
        endWithoutRest: true
    }
}

module.exports = SwirlCommand;