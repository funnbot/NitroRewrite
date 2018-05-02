const { Command } = require("../../Nitro");

class GiftCommand extends Command {

    async run({ message, bot, reply, t }) {
        const [user, am] = message.args;
        if (user.id === message.author.id) return reply.fail("You can't give yourself money.");
        if (user.bot) return reply.fail("Robots don't know how to handle money.");
        if (!await message.author.wallet.hasEnough(am)) return reply.fail("You do not have enough money.");
        await message.author.wallet.sub(am);
        await user.wallet.add(am);
        const give = message.guild.formatBal(am);
        return reply(`**Gave ${give} to ${user.tag}**`);
    }

    help = "Gift another user money.";
    cooldown = 10;
    args = [{
        type: "user",
        info: "The user to gift",
        example: "@user"
    }, {
        type: "int",
        info: "The amount to give",
        example: "100"
    }]
}

module.exports = GiftCommand;