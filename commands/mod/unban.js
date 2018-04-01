const { Command } = require("../../Nitro");

class UnbanCommand extends Command {

    async run({ message, bot, reply, t }) {
        const [search, reason] = message.args;

        const bans = await message.guild.fetchBans();
        const [user, err] = findMember(search, bans);
        if (err) return reply.fail(err);

        let txt = `Are you sure you want to unban the user ${user.tag}`;
        const m = await message.channel.ask(message.author, txt);
        const failsafe = await message.channel.collectMessage(message.author);
        if (!failsafe) return await m.edit("**Aborted.**", { embed: null });
        else await m.edit(`**Unbanning...**`, { embed: null });
        try {
            await message.guild.members.unban(user, reason);
        } catch (e) {
            return await m.edit("**Unban failed**");
        }
        await message.guild.userAction(user.id, "unban", reason);
        await message.guild.modAction(message.author.id, "unban");
        await m.edit(`**User unbanned (ID: ${user.id})**`);

        const modlogID = await message.guild.modlog();
        const modlog = bot.channels.get(modlogID);
        if (modlog) modlog.createCase({
            action: "unban",
            user: `${user.tag} (${user.id})`,
            mod: message.author,
            reason
        });
    }

    help = "Unban a user.";
    userPerm = "BAN_MEMBERS";
    args = [{
        type: "string",
        info: "A user or id to unban.",
        example: "goodboinow"
    }, {
        type: "string",
        info: "The reason for unbanning.",
        example: "He is good now.",
        default: "unspecified"
    }]
}

function findMember(search, bans) {
    let exactMems = bans.filter(memberFilterExact(search));
    if (exactMems.size > 1) return [false, `${exactMems.size} bans found, please specify.`];
    if (exactMems.size === 1) return [exactMems.first().user, null];

    let mems = bans.filter(memberFilterInexact(search));
    if (mems.size > 1) return [false, `${mems.size} bans found, please specify.`];
    if (mems.size === 1) return [mems.first().user, null];

    return [null, "No bans found with the name `" + search + "`"];
}

function memberFilterExact(search) {
    const s = search.toLowerCase();
    return m => s === m.user.id ||
        s === m.user.username.toLowerCase() ||
        s === m.user.tag.toLowerCase();
}

function memberFilterInexact(search) {
    const s = search.toLowerCase();
    return m => m.user.tag.toLowerCase().includes(s) ||
        (m.nickname && m.nickname.toLowerCase().includes(s))
}

module.exports = UnbanCommand;