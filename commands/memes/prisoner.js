const { Command, Image } = require("../../Nitro");

class PrisonerCommand extends Command {

    async run({ message, bot, reply, t }) {
        const [txt] = message.args;
        const buf = Image.getStaticFile("prison");
        const main = Image.sharp(buf);
        const cap = await Image.createCaption(txt, 76, 54, "arial.ttf");
        main.overlayWith(cap, {
            left: 276,
            top: 250
        })
        return reply(await Image.out(main));
    }

    help = "The prisoners on a bench meme.";
    botPerm = "ATTACH_FILES";
    arg = {
        type: "string",
        info: "The message for the prisoner.",
        example: "I pirated a movie."
    }
    cooldown = 5;
}

module.exports = PrisonerCommand;