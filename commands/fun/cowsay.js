const { Command } = require("../../Nitro");

class CowsayCommand extends Command {
    async run ({message, bot, reply, t}) {
        const args = message.args;
        var input = args.join(" ");
        const cow = "        \\   ^__^\n         \\  (oo)\_______\n            (__)\       )\\/\\\n                ||----w |\n                ||     ||\n"
        reply("`\n  "+Array(input.length+3).join("_")+"\n< "+input+" >\n "+Array(input.length+3).join("-")+"\n"+cow+"`");
    }

    help = "Cowsay";
}

module.exports = CowsayCommand;
