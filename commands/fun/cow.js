const { Command } = require("../../Nitro");
const rn = require("random-number");
const cows = require('cows');

class CowCommand extends Command {
    async run ({message, bot, reply, t}) {
        let options = {
            min: 0,
            max: cows().length - 1,
            integer: true
        };

        let random = await rn(options);
        reply(`\`\`\`${cows()[random]}\`\`\``);
    }

    help = "Random Ascii Cow";
}

module.exports = CowCommand;