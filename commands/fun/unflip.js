const { Command } = require("../../Nitro");

class UnflipCommand extends Command {
    async run({ message, bot, reply, t }) {
        await reply("(╯°□°)╯  ︵  ┻━┻");
        await promiseTimeout(500);
        await reply.edit("(╯°□°)╯    ]");
        await promiseTimeout(500);
        await reply.edit("(°-°)\\ ┬─┬");
    }

    help = "Unflips a table you just flipped";
}

module.exports = UnflipCommand;
