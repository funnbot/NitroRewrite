const { Command } = require("../../Nitro");

class FlipCommand extends Command {

    async run ({message, bot, reply, t}) {
        if (Math.round(Math.random())) {
            reply("**Heads! Here, keep it**");
            message.author.wallet.add(1);
        } else {
            reply("**Tails. I'll take that coin back.**");
            message.author.wallet.sub(1);
        }
    }

    help = "Flip a coin";
}

module.exports = FlipCommand;