const { Command, Image, util } = require("../../Nitro");

class GruCommand extends Command {

    async run({ message, bot, reply, t }) {
        const [i] = message.args;
        const txt = util.delimiter(i, '|', 3);
        if (!txt) return reply.fail("Minimum of 3 texts.")
        const gru = Image.getStaticFile("gru");
        const opts = [160, 218, "arialblack.ttf", 20, "black", "northwest"];
        const cap1 = await Image.createCaption(txt[0], ...opts);
        const cap2 = await Image.createCaption(txt[1], ...opts);
        const cap3 = await Image.createCaption(txt[2], ...opts);
        const buf = await Image.overlayImages(gru, [
            { buffer: cap1, top: 80, left: 310 },
            { buffer: cap2, top: 85, left: 826 },
            { buffer: cap3, top: 414, left: 313 },
            { buffer: cap3, top: 413, left: 824 }
        ]);
        return reply(Image.send(buf));
    }

    help = "The gru meme.";
    botPerm = "ATTACH_FILES";
    arg = {
        type: "string",
        info: "The text delimited by `|`",
        example: "Find a gru meme template | Create a custom gru meme generator | Nobody uses it"
    };
    cooldown = 5;
}

module.exports = GruCommand;