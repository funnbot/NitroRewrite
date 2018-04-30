const { Command, util: { escapeMarkdown } } = require("../../Nitro");

class DiscrimCommand extends Command {
    async run({ message, bot, reply, t }) {
        const [input] = message.args;
        const disc = input.replace(/[^0123456789]/g, "");
        if (disc.length !== 4) {
            return reply.warn("Discriminators are 4 numbers");
        }
        const req = `this.users.filter(u => u.discriminator === "${disc}").map(u => u.username)`
        const res = await bot.shard.broadcastEval(req);

        const users = [].concat(...res);
        const txt = `**Users with the discriminator: ${disc}**\n${escapeMarkdown(users.join(", "))}`;
        return reply(txt.shorten());
    }

    help = "Search for a user by their discriminator";
    cooldown = 5;
    arg = {
        type: "string",
        info: "Discriminator",
        example: "5645",
    }
}

module.exports = DiscrimCommand;