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
        /*bot.shard.broadcastEval(req).then(ret => {
            var i = 0;
            for (i = 0; i < ret.length - 1; i++) {
                ret[0].concat(ret[i + 1])
            }
            var filt = {}
            for (i = 0; i < ret[0].length; i++) {
                filt[ret[0][i]] = true
            }
            filt = Object.keys(filt)
            reply("**Users with the Discriminator: " + disc + "**\n" + filt.join(", "))
        })*/
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