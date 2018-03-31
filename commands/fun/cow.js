const { Command } = require("../../Nitro");
const rn = require("random-number");
const cows = require('cows')();

class CowCommand extends Command {
    async run ({message, bot, reply, t}) {
        reply(`\`\`\`${cows[Math.floor(Math.random() * cows.length - 1)]}\`\`\``);
    }

    help = "Random Ascii Cow";
}

module.exports = CowCommand;