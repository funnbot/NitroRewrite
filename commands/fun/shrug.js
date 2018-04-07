const { Command } = require("../../Nitro");

class ShrugCommand extends Command {
    async run({ message, bot, reply, t }) {
        var replym = reply("¯\\_(ツ)_/¯").then(m => {
            setTimeout(() => {
                m.edit("¯\\-(ツ)-/¯").then(ms => {
                    setTimeout(() => {
                        ms.edit("¯\\_(ツ)_/¯")
                    }, 500)
                })
            }, 500);
        });
    }

    help = "Shrug";
}

module.exports = ShrugCommand;
