const { Command } = require("../../Nitro");

class ShrugCommand extends Command {
    async run({ message, bot, reply, t }) {
        await reply("¯\\_(ツ)_/¯");
        await promiseTimeout(500);
        await reply.edit("¯\\\\-(ツ)-/¯");
        await promiseTimeout(500);
        await reply.edit("¯\\_(ツ)_/¯")
    }

    help = "Shrug";
}

module.exports = ShrugCommand;