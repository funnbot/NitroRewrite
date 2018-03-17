const { Command } = require("../../Nitro");

class BanCommand extends Command {

    async run({ message, bot, reply, t }) {
        const [member, reason] = message.args;
        if (!member.bannable) return await reply.fail("I lack permission to softban this user.");
        if (message.member.roles.highest.position <= member.roles.highest.position) return await reply.fail("You lack permission to softban this user.");

        let txt = `Are you sure you want to softban the user ${member.user.tag}`;
        const m = await message.channel.ask(message.author, txt);
        const failsafe = await message.channel.collectMessage(message.author);
        if (!failsafe) return await m.edit("**Aborted.**", { embed: null });
        else await m.edit(`**Softbanning...**`, { embed: null });
        try {
            await member.ban({ reason, days: 7 });
            await m.edit("**Unbanning**")
            await member.unban({ reason: "Softban" });
        } catch (e) {
            return await m.edit("**Softban failed**");
        }
        await message.guild.userAction(member.user.id, "softban");
        await message.guild.modAction(message.author.id, "softban");
        await m.edit("**Softban complete**");

        const modlogID = await message.guild.modlog();
        const modlog = bot.channels.get(modlogID);
        if (modlog) modlog.createCase({
            action: "softban",
            user: `${member.user.tag} (${member.user.id})`,
            mod: message.author,
            reason
        });
    }

    help = "Ban and unban a member to delete their messages.";
    alias = ["softbanne", "softb&"];
    botPerms = ["BAN_MEMBERS"];
    userPerms = ["BAN_MEMBERS"];
    args = [{
        type: "member",
        info: "The user to softban.",
        example: "@Badboy"
    }, {
        type: "string",
        info: "The reason for softbanning.",
        example: "Spamming in chat.",
        default: "unspecified"
    }];
}

module.exports = BanCommand;