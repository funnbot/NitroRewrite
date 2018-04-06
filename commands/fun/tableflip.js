const { Command } = require("../../Nitro");

class TableFlipCommand extends Command {
    async run({ message, bot, reply, t }) {
        var replym = reply("(°-°)\\ ┬─┬").then(m => {
            setTimeout(() => {
                m.edit("(╯°□°)╯    ]").then(ms => {
                    setTimeout(() => {
                        ms.edit("(╯°□°)╯  ︵  ┻━┻")
                    }, 500)
                })
            }, 500);
        });
    }

    help = "Flips the table";
}

module.exports = TableFlipCommand;
