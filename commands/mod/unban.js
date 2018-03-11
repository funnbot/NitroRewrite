const { Command } = require("../../Nitro");

class UnbanCommand extends Command {

    async run({ message, bot, reply, t }) {

    }

    options() {
        return {
            help: "",
            usage: "",
            wip: true
        }
    }
}

module.exports = UnbanCommand;

/* const Nitro = require("../../../Nitro.js")

module.exports = new Nitro.Command({
  help: "Unban a user.",
  example: "${p}unban @Funnbot appealed",
  argExample: "<user> <reason>",
  dm: false,
  coolDown: 1,
  botPerms: ["BAN_MEMBERS"],
  userPerms: 1,
  args: [],

  run: async (message, bot, send) => {
    if (!message.checkSuffix) return send("**Example: " + module.exports.example.replace("${p}", message.prefix) + "**")
    let user = message.args[0]
    if (!/^\d{17,19}$/.test(user)) return send("**Users can only be unbanned by ID.**")
    let reason = message.suffixOf(1).length > 0 ? message.suffixOf(1) : false
    let caseman = message.guild.check("caseman")
    if (!caseman) throw new Error("CaseManager Not Initialized")
    let cases = caseman.cases
    cases = cases.filter(c => c.user.id === user)
    if (!cases[0]) user = {username: "", discriminator: "", id: user, avatar: bot.user.avatar}
    else user = {
      username: cases[0].user.username,
      discriminator: cases[0].user.discriminator,
      id: cases[0].user.id,
      avatar: cases[0].user.avatar
    }
    send("**Unbanning user...**").then(async msg => {
      try {
        await message.guild.unban(user.id)
        let caseman = message.guild.check("caseman")
        if (!caseman) throw new Error("CaseManager was not initialized.")
        caseman.newCase(message.author, user, "unban", {reason: reason})
        msg.edit("**Unban complete**")
      } catch (err) {
        console.log(err)
        send("**I was unable to unban the user:** " + user.id)
      }
    })
  }
})
*/