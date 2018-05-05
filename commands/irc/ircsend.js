const { Command } = require("../../Nitro");

class IRCSendCommand extends Command {

    async run({ message, bot, reply, t }) {
        const [id, msg] = message.args;
        const data = await bot.db.filter("channel", { irc: true });
        const channels = data.map(c => c.id);

        const chan = id.replace(/[^0-9]/g, '');
        const text = msg.replace(/[^a-zA-Z ]/g, '');
        const name = message.author.username.replace(/[^a-zA-Z0-9]/g, '');

        const m = `**${message.channel.id}** - \`${name}\`: ${text}`;

        if (!channels.includes(message.channel.id)) return reply.fail("Messages can only be sent from an IRC enabled channel.");

        const evil = `
        let trySend = () => {
            const data = ${JSON.stringify(channels)};
            if (!data.includes("${chan}")) return false;
            const chan = this.channels.get("${chan}");
            if (!chan || chan.type !== "text") return false;
            chan.send("${m}");
            return true;
        }
        trySend()
        `
        const succs = await bot.shard.broadcastEval(evil);
        
        const succ = succs.some(s => s);
        if (!succ) return reply.fail("Invalid IRC channel ID.");
        else return message.succReact();
    }

    help = "Send a message to an IRC channel.";
    args = [{
        type: "id",
        info: "The id of an IRC channel.",
        example: "222461169317707778",
    }, {
        type: "string",
        info: "The message to send.",
        example: "Hello people in another server.",
        max: 1000
    }];
}

module.exports = IRCSendCommand;