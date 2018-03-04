const { Command } = require("../../Nitro");

class UserHistoryCommand extends Command {

    async run ({message, bot, reply, t}) {
        send("test")
    }

    options() { return {
        help: "",
        usage: ""
    }}
}

module.exports = UserHistoryCommand;

/* const Nitro = require("../../../Nitro.js")

module.exports = new Nitro.Command({
  help: "The moderation actions preformed on a user.",
  example: "${p}userhistory @Nitro",
  argExample: "<user>",
  dm: false,
  coolDown: 1,
  userPerms: 0,
  botPerms: [],

  args: [],
  alias: ["userh"],

  run: async (message, bot, send) => {
    let caseman = message.guild.check("caseman")
    if (!caseman) throw new Error("CaseManager Not Initialized")
    let cases = caseman.cases
    let user
    if (!message.checkSuffix) user = message.member
    else user = await message.parseMember(message.args[0])
    if (!user) return send("**Invalid User:** " + message.args[0])
    user = user.user

    let a = {}
    cases = cases.filter(c => c.user.id === user.id)
    for (let c of cases) {
      if (!a[c.action]) a[c.action] = 1
      else a[c.action]++
    }
    let embed = new bot.embed()
    embed.setAuthor(user.tag, user.avatarURL())
      .setTitle("User History")
      .setDescription(`**Bans:** ${a.ban || 0}, **Tempbans:** ${a.tempban || 0}, **Softbans:** ${a.softban || 0}, **Kicks:** ${a.kick || 0}, **Mutes:** ${a.mute || 0}, **Warns:** ${a.warn || 0}`)
      .setColor(embed.randomColor)
    send("", {embed})
  }
})
*/