const { Guild, GuildMember } = require("discord.js");
const Duration = require("duration-js");
const { Command, TIME } = require("../../Nitro");

class MuteCommand extends Command {


    async run({ message, bot, reply, t }) {
        /** @type {Guild} */
        const guild = message.guild
        /** @type {GuildMember} */
        const member = message.args[0];
        /** @type {Duration} */
        const duration = message.args[1];
        /** @type {String} */
        const reason = message.args[2];

        let mutedRole = guild.roles.find(r => r.name.toLowerCase() === "muted")
        if (!mutedRole) mutedRole = await createMutedRole(message.guild);

        try {
            await member.roles.add(mutedRole, "nitro mute");
        } catch {
            return reply.fail("Failed to mute user.");
        }
        await guild.userAction(member.user.id, "mute", reason);
        await guild.modAction(message.author.id, "mute");
        await reply.succ("Muted the user: ", member.user.tag);

        bot.conTimers.add({
            id: member.user.id,
            time: duration.milliseconds(),
            type: "mute",
            guild: message.guild.id,
            mute: mutedRole.id
        })

        const modlogID = await guild.modlog();
        const modlog = guild.channels.get(modlogID);
        if (modlog) modlog.createCase({
            action: "mute",
            user: `${member.user.tag} (${member.user.id})`,
            mod: message.author,
            reason,
            length: duration.toString()
        })
    }

    help = "Mute a user";
    args = [{
        type: "member",
        info: "The user to mute.",
        example: "@badboi"
    }, {
        type: "duration",
        info: "The length of the mute.",
        example: "2h30m",
        min: TIME.min,
        max: TIME.day * 7
    }, {
        type: "string",
        info: "The reason for muting",
        example: "Being a bad boi.",
        default: "unspecified"
    }]
}

/**
 * @param {Guild} guild 
 */
async function createMutedRole(guild) {
    const role = await guild.roles.create({ name: "Muted", permissions: { SEND_MESSAGES: false } }, "nitro muted role");
    for (let channel in guild.channels.values()) {
        await channel.updateOverwrite(role, { SEND_MESSAGES: false }, "nitro muted role");
    }
    return role;2
}

module.exports = MuteCommand;

/* const Nitro = require("../../../Nitro.js")
const Duration = require("duration-js")
const prettyms = require("pretty-ms")

module.exports = new Nitro.Command({
    help: "Mute a user.",
    example: "${p}mute @Nitro He is a bot.",
    argExample: "<user> <reason>",
    dm: false,
    coolDown: 1,
    userPerms: 1,
    botPerms: ["MANAGE_ROLES"],

    args: [],

    run: async(message, bot, send) => {
        if (!message.checkSuffix) return send("**Example: " + module.exports.example.replace("${p}", message.prefix) + "**")
        let user = message.args[0]
        let reason = message.suffixOf(2).length > 0 ? message.suffixOf(2) : false
        let member = await message.parseMember(user)
        if (!member) return send("**Could not find the user: **" + user)
        let time
        try {
            time = new Duration(message.args[1])
        } catch (err) {
            return send("**Invalid Time Format:** " + message.args[1])
        }
        if (time.minutes() < 1) return send("**Mutes must be at least 1 minute**")
        if (time.days() > 7) return send("**Mutes can not be longer than a week**")
        let pretty = prettyms(time.milliseconds(), { verbose: true })
        let embed = new bot.embed()
        let Muted = message.guild.roles.find("name", "Muted")
        if (!Muted) {
            embed.setDescription("I did not find a Muted role on your server, would you like me to create one?")
            embed.setAuthor(bot.user.username, bot.user.avatarURL())
            embed.setFooter("yes/no")
            embed.setColor(embed.randomColor)
            embed.setTimestamp(new Date())
            send("", { embed })
            let create = await message.collectMessage(["yes", "y", "yup"], ["no", "n", "nope"], "author")
            if (!create) return send("**I can not mute users until the Muted role is created.**")
            try {
                Muted = await message.guild.createRole({
                    data: {
                        name: "Muted"
                    },
                    reason: "Nitro's Muted Role"
                })
            } catch (err) {
                console.log(err)
                return send("**I was unable to create the Muted role**")
            }
            message.guild.channels.forEach(c => c.overwritePermissions(Muted, { SEND_MESSAGES: false }))
        }
        const clientMember = message.guild.member(bot.user)
        if (Muted.position > clientMember.highestRole.position) return send("**The Muted role is higher than my highest role**")
        try {
            await member.send(`**You have been muted in ${message.guild.name}**\n\n**Length:** ${pretty}\n**Reason:** ${reason || "None"}`)
        } catch (err) {
            console.log(err)
        }
        bot.timer.add({
            id: member.user.id,
            guild: message.guild.id,
            moderator: message.author.id,
            action: "mute",
            length: time.milliseconds(),
            started: Date.now()
        })
        try {
            await member.addRole(Muted)
            let caseman = message.guild.check("caseman")
            if (!caseman) throw new Error("CaseManager was not initialized.")
            caseman.newCase(message.author, member.user, "mute", { reason: reason })
        } catch (err) {
            console.log(err)
            return send("**I was unable to mute the user:** " + member.user.tag)
        }
        send("**Muting User**")
    }
})*/