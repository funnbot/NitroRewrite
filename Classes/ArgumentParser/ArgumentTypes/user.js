const idRegex = /^[0-9]{17,19}$/;
const mentionRegex = /^<@!?[0-9]{17,19}>$/;

class UserArgument {
    static async parse(val, msg, arg) {
        if (mentionRegex.test(val) || idRegex.test(val)) {
            // A user mention
            const id = val.replace(/[^0-9]/g, "");
            var [user, error] = await findUserByID(id, msg);
        } else {
            // A string to search username
            var [user, error] = await findUserByString(val, msg);
        }
        return { valid: !!user, val: user, error }
    }

    static default (msg) {
        return msg.author;
    }
}

async function findUserByString(val, msg) {
    let filt = filterMembers(val, msg);
    if (filt[0]) return filt;
    await msg.guild.members.fetch();
    return filterMembers(val, msg);
}

function filterMembers(val, msg) {
    let exactMems = msg.guild.members.filter(memberFilterExact(val));
    if (exactMems.size > 1) return [false, `${exactMems.size} users found, please specify.`];
    if (exactMems.size === 1) return [exactMems.first().user, null];

    let mems = msg.guild.members.filter(memberFilterInexact(val));
    if (mems.size > 1) return [false, `${mems.size} users found, please specify.`];
    if (mems.size === 1) return [mems.first().user, null];

    return [null, "No users found with the name `" + val + "`"];
}

function memberFilterExact(search) {
    const s = search.toLowerCase();
    return m => s === m.user.username.toLowerCase() ||
                s === m.user.tag.toLowerCase() ||
 (m.nickname && s === m.nickname.toLowerCase())
}

function memberFilterInexact(search) {
    const s = search.toLowerCase();
    return m => m.user.tag.toLowerCase().includes(s) ||
 (m.nickname && m.nickname.toLowerCase().includes(s))
}

async function findUserByID(id, msg) {
    let mem = msg.guild.members.get(id);
    if (mem) return [mem.user, null];
    await msg.guild.members.fetch();
    mem = msg.guild.members.get(id);
    const user = mem ? mem.user : null;
    return [user, "User with ID `" + id + "` not found"];
}

module.exports = UserArgument;