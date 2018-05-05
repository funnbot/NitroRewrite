const { Command, Image } = require("../../Nitro");

class SwirlCommand extends Command {
    async run({ message, bot, reply, t }) {
        let buf = await Image.searchChannel(message.channel);
        if (!buf) buf = await Image.readUrl(message.author.avatarURL());
        const gm = Image.createGM(buf);
        gm.negative();
        reply(Image.send(await Image.gmBuffer(gm)));
    }

    help = "The negative of an image.";
    botPerm = "ATTACH_FILES";
    cooldown = 5;
}

module.exports = SwirlCommand;