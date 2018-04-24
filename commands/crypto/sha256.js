const { Command } = require("../../Nitro");
const { createHash } = require("crypto");

class ShaCommand extends Command {

    async run ({message, bot, reply, t}) {
        const [ text ] = message.args;
        const s = createHash("sha256").update(text).digest("hex");
        reply(`${text} - ` + s);
    }

    help = "Get the shasum of a string.";
    arg = {
        type: "string",
        info: "Text to hash.",
        example: "foobarbaz",
        max: 1000
    }
}

module.exports = ShaCommand;