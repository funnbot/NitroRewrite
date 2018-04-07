const { Command } = require("../../Nitro");

class TableFlipCommand extends Command {
    async run({ message, bot, reply, t }) {
        await reply("(°-°)\\ ┬─┬");
        await promiseTimeout(500);
        await reply.edit("(╯°□°)╯    ]");
        await promiseTimeout(500);
        await reply.edit("(╯°□°)╯  ︵  ┻━┻");
    }

    help = "Flips the table";
}

module.exports = TableFlipCommand;
