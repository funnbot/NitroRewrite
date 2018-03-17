const { Command } = require("../../Nitro");

class KickCommand extends Command {

    async run({ message, bot, reply, t }) {
        const [member, reason] = message.args;
        if (!member.kickable) return await reply.fail("I lack permission to kick this user.");
        if (message.member.roles.highest.position <= member.roles.highest.position) return await reply.fail("You lack permission to kick this user.");

        let txt = `Are you sure you want to kick the user ${member.user.tag}`;
        const m = await message.channel.ask(message.author, txt);
        const failsafe = await message.channel.collectMessage(message.author);
        if (!failsafe) return await m.edit("**Aborted.**", { embed: null });
        else await m.edit(`**Kicking...**`, { embed: null });
        try {
            await member.kick({ reason });
        } catch (e) {
            return await m.edit("**Kick failed**");
        }
        await message.guild.userAction(member.user.id, "kick", reason);
        await message.guild.modAction(message.author.id, "kick");
        await m.edit("**User kicked**");

        const modlogID = await message.guild.modlog();
        const modlog = bot.channels.get(modlogID);
        if (modlog) modlog.createCase({
            action: "kick",
            user: `${member.user.tag} (${member.user.id})`,
            mod: message.author,
            reason
        })
    }

    help = "Kick a member.";
    botPerms = ["KICK_MEMBERS"];
    userPerms = ["KICK_MEMBERS"];
    args = [{
        type: "member",
        info: "The user to kick.",
        example: "@Badboy"
    }, {
        type: "string",
        info: "The reason for kicking.",
        example: "Because I said so",
        default: "unspecified"
    }];
}

module.exports = KickCommand;

/* const Nitro = require("../../../Nitro.js")

module.exports = new Nitro.Command({
    help: "Kick a user",
    example: "${p}kick @Funnbot Needs to learn a lesson.",
    argExample: "<user> <reason>",
    dm: false,
    coolDown: 1,
    userPerms: 1,
    botPerms: ["KICK_MEMBERS"],

    args: [],

    run: async(message, bot, send) => {
        if (!message.checkSuffix) return send("**Example: " + module.exports.example.replace("${p}", message.prefix) + "**")
        let user = message.args[0]
        let reason = message.suffixOf(1).length > 0 ? message.suffixOf(1) : false
        let member = await message.parseMember(user)
        if (!member) return send("**Could not find the user: **" + user)
        if (!member.kickable) return send("**I am unable to kick the user:** " + member.user.tag)
        send("**Kicking user...**").then(async msg => {
            try {
                await member.send(`**You have been kicked from ${message.guild.name}**\n\n**Reason:** ${reason || "None"}`)
            } catch (err) {
                console.log(err)
            }
            try {
                await member.kick(reason)
                let caseman = message.guild.check("caseman")
                if (!caseman) throw new Error("CaseManager was not initialized.")
                caseman.newCase(message.author, member.user, "kick", { reason: reason })
                msg.edit("**Kick complete**")
            } catch (err) {
                console.log(err)
                send("**I was unable to kick the user:** " + member.user.tag)
            }
        })
    }
})*/