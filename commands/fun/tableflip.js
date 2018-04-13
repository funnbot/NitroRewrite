const { Command } = require("../../Nitro");

class TableFlip extends Command {

    async run({ message, bot, send, t }) {
        const msg = await send("(°-°)\\ ┬─┬");
        await timeout(500);
        await msg.edit("(╯°□°)╯    ]");
        await timeout(500);
        await msg.edit("(╯°□°)╯  ︵  ┻━┻");
    }

    help = "Animated Table Flip";
    cooldown = 3;
}

module.exports = TableFlipCommand;