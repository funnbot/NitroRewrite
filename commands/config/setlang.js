const { Command } = require("../../Nitro");

class LanguageCommand extends Command {

    async run({ message, bot, send, t }) {
        if (!message.checkSuffix) {
            return send(t.SETLANG_LIST(t.languages.join(", ")));
        }
        if (t.languages.includes(message.suffix)) {
            await message.guild.locale(message.suffix);
            return send(t.SETLANG_SET(message.suffix));
        } else return send(t.SETLANG_INVALID(message.suffix));
    }

    help = "Set the locale.";
    usage = "{}setlang en";
    userPerm = "MANAGE_GUILD";
    alias = ["language", "locale"];
}

module.exports = LanguageCommand;