const { Command } = require("../../Nitro");

class BanCommand extends Command {

    async run({ message, bot, reply, t }) {
        const [member, reason] = message.args;
        if (!member.bannable) return await reply.fail("I lack permission to ban this user.");
        if (message.member.roles.highest.position <= member.roles.highest.position) return await reply.fail("You lack permission to ban this user.");

        let txt = `Are you sure you want to ban the user ${member.user.tag}`;
        const m = await message.channel.ask(message.author, txt);
        const failsafe = await message.channel.collectMessage(message.author);
        if (!failsafe) return await m.edit("**Aborted.**", { embed: null });
        else await m.edit(`**Banning...**`, { embed: null });
        try {
            await message.guild.members.ban(member, { reason, days: 1 });
        } catch (e) {
            return await m.edit("**Ban failed**");
        }
        await message.guild.userAction(member.user.id, "ban", reason);
        await message.guild.modAction(message.author.id, "ban");
        await m.edit("**User banned**");

        const modlogID = await message.guild.modlog();
        const modlog = bot.channels.get(modlogID);
        if (modlog) modlog.createCase({
            action: "ban",
            user: `${member.user.tag} (${member.user.id})`,
            mod: message.author,
            reason
        });
    }

    help = "Ban a member.";
    alias = ["banne", "b&"];
    botPerms = ["BAN_MEMBERS"];
    userPerms = ["BAN_MEMBERS"];
    args = [{
        type: "member",
        info: "The user to ban.",
        example: "@Badboy"
    }, {
        type: "string",
        info: "The reason for banning.",
        example: "Because I said so",
        default: "unspecified"
    }];
}

module.exports = BanCommand;