const { Command, Image } = require("../../Nitro");

class JPEGCommand extends Command {

    async run ({message, bot, reply, t}) {
        const buf = await message.fetchImage();
        const sharp = Image.sharp(buf)
            .jpeg({
                force: true,
                quality: 1
            })
        return reply(await Image.out(sharp));
    }

    help = "Jpegify an image.";
    botPerm = "ATTACH_FILES";
    alias = "jpegify";
    cooldown = 5;
}

module.exports = JPEGCommand;