const { Command } = require("../../Nitro");

class PingCommand extends Command {
    async run({ message, bot, reply, t }) {
        await reply(t.PING_TEST());
        const ping = Date.now() - reply.sent.createdTimestamp;
        const ws = bot.ping;

        return await reply.edit(t.PING_DONE(ping, ws));
    }

    help = "Check if Nitro is alive.";
    userPerm = "ADMINISTRATOR";
}

module.exports = PingCommand;