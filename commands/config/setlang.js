const Nitro = require("../../Nitro.js")

module.exports = new Nitro.Command({
  help: "Set the locale.",
  example: "${p}setlang en",
  argExample: "<language-code>",
  userPerms: 4,
  alias: ["language"],

  run: async (message, bot, send, t) => {
    if (!message.checkSuffix) {
        return send(t.SETLANG_LIST(t.languages.join(", ")));
    }
    if (t.languages.includes(message.suffix)) {
        message.guild.locale = message.suffix;
        return send(t.SETLANG_SET(message.suffix));
    } else return send(t.SETLANG_INVALID(message.suffix));
  }
})