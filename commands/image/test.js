const { Command, Image } = require("../../Nitro");

class TestCommand extends Command {

    async run ({message, bot, reply, t}) {
        const image = message.author.avatarURL({size: 2048});
        const buffer = await Image.readUrl(image);
        let gm = Image.createGM(buffer);
        gm = gm.transparent('white');
        const buf = await Image.gmBuffer(gm);
        await reply(Image.send(buf));
    }

    help = "";
}

module.exports = TestCommand;