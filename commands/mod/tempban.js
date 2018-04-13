const { Command } = require("../../Nitro");

class TempBanCommand extends Command {

    async run({ message, bot, reply, t }) {
        const [member, duration, reason] = message.args;
        if (!member.bannable) return await reply.fail("I lack permission to tempban this user.");
        if (message.member.roles.highest.position <= member.roles.highest.position) return await reply.fail("You lack permission to tempban this user.");

        let txt = `Are you sure you want to tembban the user ${member.user.tag}`;
        const m = await message.channel.ask(message.author, txt);
        const failsafe = await message.channel.collectMessage(message.author);
        if (!failsafe) return await m.edit("**Aborted.**", { embed: null });
        else await m.edit(`**Tempbanning...**`, { embed: null });
        try {
            await member.ban({ reason });
        } catch (e) {
            return await m.edit("**Tempban failed**");
        }
        await message.guild.userAction(member.user.id, "tempban", reason);
        await message.guild.modAction(message.author.id, "tempban");
        await m.edit("**Tempban complete**");

        bot.conTimers.add({
            id: member.user.id,
            time: duration.milliseconds(),
            type: "tempban",
            guild: message.guild.id
        })

        const modlogID = await message.guild.modlog();
        const modlog = bot.channels.get(modlogID);
        if (modlog) modlog.createCase({
            action: "tempban",
            user: `${member.user.tag} (${member.user.id})`,
            mod: message.author,
            reason,
            length: duration.toString()
        });
    }


    help = "Temporarily ban a user.";
    userPerms = ["BAN_MEMBERS"];
    botPerms = ["BAN_MEMBERS"];
    args = [{
        type: "member",
        info: "The member to tempban.",
        example: "@Bodboi"
    }, {
        type: "duration",
        info: "The length of the tempban.",
        example: "2h30m",
        min: 600000,
        max: 2592e5
    }, {
        type: "string",
        info: "The reason for tempbanning.",
        example: "Being a bad boy",
        default: "unspecified"
    }];
}

module.exports = TempBanCommand;

/* const Nitro = require("../../../Nitro.js")
const Duration = require("duration-js")
const prettyms = require("pretty-ms")

module.exports = new Nitro.Command({
  help: "Ban a user temporarily.",
  example: "${p}tempban @Nitro 4d He is annoying",
  argExample: "<time> <users> | <reason>",
  dm: false,
  coolDown: 1,
  userPerms: 1,
  botPerms: ["BAN_MEMBERS"],

  args: [],

  run: async (message, bot, send) => {
    if (!message.checkSuffix) return send("**Example: " + module.exports.example.replace("${p}", message.prefix) + "**")
    let user = message.args[0]
    let reason = message.suffixOf(2).length > 0 ? message.suffixOf(2) : false
    let member = await message.parseMember(user)
    if (!member) return send("**Could not find the user: **" + user)
    if (!member.bannable) return send("**I am unable to tempban the user:** " + member.user.tag)
    let time
    try {
      time = new Duration(message.args[1])
    } catch (err) {
      return send("**Invalid Time Format:** " + message.args[1])
    }
    if (time.minutes() < 10) return send("**Tempbans must be at least 10 minutes**")
    if (time.days() > 7) return send("**Tempbans cannot be longer than a week**")
    let pretty = prettyms(time.milliseconds(), {verbose: true})
    let embed = new bot.embed()
    embed.setDescription(`**Are you sure you want to tempban the user ${member.user.tag} for ${pretty}**`)
      .setAuthor(bot.user.username, bot.user.avatarURL())
      .setFooter("yes/no")
      .setColor(embed.randomColor)
      .setTimestamp(new Date())
    send("", {embed}).then(async msg => {
      let failsafe = await message.collectMessage(["yes", "y", "yup"], ["no", "n", "nope"], "author")
      if (!failsafe) return send("**Tempban Cancelled**")
      bot.timer.add({
        id: member.user.id,
        guild: message.guild.id,
        moderator: message.author.id,
        action: "tempban",
        length: time.milliseconds(),
        started: Date.now()
      })
      await msg.edit("**Tempbanning users...**", {embed: null})
      let options = reason ? {reason} : {}
      try {
        await member.send(`**You have been tempbanned from ${message.guild.name}**\n\n**Length:** ${pretty}\n**Reason:** ${reason || "None"}`)
      } catch (err) {
        console.log(err)
      }
      try {
        await member.ban(options)
        let caseman = message.guild.check("caseman")
        if (!caseman) throw new Error("CaseManager was not initialized.")
        caseman.newCase(message.author, member.user, "tempban", {reason: reason, length: time.milliseconds()})
        msg.edit("**Tempban complete**")
      } catch (err) {
        console.log(err)
        send("**I was unable to ban the user:** " + member.user.tag)
      }
    })
  }
}) */