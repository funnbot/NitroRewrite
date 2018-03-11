const { Command } = require("../../Nitro");

class PingCommand extends Command {
    async run({ message, bot, reply, t }) {
        await reply(t.PING_TEST());
        const ping = reply.sentMessage.createdTimestamp - Date.now();
        const ws = bot.ping;

        return await reply.edit(t.PING_DONE(ping, ws));
    }

    options() {
        return {
            help: "Check if Nitro is alive.",
            userPerms: ["ADMINISTRATOR"]
        }
    }
}

module.exports = PingCommand;