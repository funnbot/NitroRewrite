const { Command } = require("../../Nitro");

class CowsayCommand extends Command {
    async run({ message, bot, reply, t }) {
        const [input] = message.args;
        const cow = "        \\   ^__^\n         \\  (oo)\_______\n            (__)\       )\\/\\\n                ||----w |\n                ||     ||\n"
        reply("`\n  " + '_'.repeat(input.length + 3) + "\n< " + input + " >\n " + '_'.repeat(input.length + 3) + "\n" + cow + "`");
    }

    help = "Cowsay";
    arg = {
        type: "string",
        info: "What do you want the cow to say?",
        example: "Meow!",
    }
}

module.exports = CowsayCommand;