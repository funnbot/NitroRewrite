const { Command } = require("../../Nitro");

class IRCSendCommand extends Command {

    async run({ message, bot, reply, t }) {
        const [id, msg] = message.args;
        const data = await bot.db.filter("channel", { irc: true });
        const channels = data.map(c => c.id);

        const channel = bot.channels.get(id);
        if (!channels.includes(message.channel.id)) return await reply.fail("Messages can only be sent from an IRC enabled channel.");
        if (!channels.includes(id) || !channel || channel.type !== "text")
            return await reply.fail("Invalid IRC channel ID.");

        // Filter msg
        const text = msg.replace(/[^\u0020-\u007E]/g, '')
            .replace(/@./g, s => '@\u200B' + s.substr(1));

        channel.send(`**${message.channel.id}** - \`${message.author.username}\`: ${text}`);
    }

    options() {
        return {
            help: "Send a message to an IRC channel.",
            args: [{
                type: "id",
                info: "The id of an IRC channel.",
                example: "222461169317707778",
            }, {
                type: "string",
                info: "The message to send.",
                example: "Hello people in another server.",
                max: 1000
            }]
        }
    }
}

module.exports = IRCSendCommand;