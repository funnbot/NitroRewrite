const { Command } = require("../../Nitro");

class PingCommand extends Command {
    async run({ message, bot, send, t }) {
        const m = await send(t.PING_TEST());
        const ping = m.createdTimestamp - Date.now();
        const ws = bot.ping;

        return await m.edit(t.PING_DONE(ping, ws));
    }

    options() {
        return {
            help: "Check if Nitro is alive.",
            usage: "${p}ping",
            userPerms: ["ADMINISTRATOR"]
        }
    }
}

module.exports = PingCommand;