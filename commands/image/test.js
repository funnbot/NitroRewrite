const { Command, Image, util } = require("../../Nitro");

class TestCommand extends Command {
    async run({ message, bot, reply, t }) {
        const buf = await message.fetchImage();
        const gm = Image.gm(buf)
            .spread(10)
        return reply(await Image.out(gm));
    }

    help = "";
    wip = true;
}

module.exports = TestCommand;