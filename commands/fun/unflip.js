const { Command } = require("../../Nitro");

class UnflipCommand extends Command {
    async run({ message, bot, reply, t }) {
        var replym = reply("(╯°□°)╯  ︵  ┻━┻").then(m => {
            setTimeout(() => {
                m.edit("(╯°□°)╯    ]").then(ms => {
                    setTimeout(() => {
                        ms.edit("(°-°)\\ ┬─┬")
                    }, 500)
                })
            }, 500);
        });
    }

    help = "Unflips a table you just flipped";
}

module.exports = UnflipCommand;
