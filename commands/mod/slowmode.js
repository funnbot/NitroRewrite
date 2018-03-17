const { Command, TIME } = require("../../Nitro");

class SlowModeCommand extends Command {

    async run({ message, bot, reply, t }) {
        const [time, wait] = message.args;
        const chan = message.channel;
        if (!message.channel.permissionsFor(bot.user).has("MANAGE_ROLES"))
            return await reply.fail("I need permission to manage permissions in this channel.");

        const role = await createRole(chan);
        const col = handleUserMessages(chan, role, time, wait);
        const unlock = collectUnlock(chan, time);

        const endTimer = setTimeout(() => {
            endSlowmode(chan, col, unlock, role)
        }, time.milliseconds());

        unlock.on("collect", async m => {
            if (m.content === "speedup") {
                endSlowmode(chan, col, unlock, role, endTimer);
            }
        })

        return await reply(`**Slowmode enabled for ${time.toString()}.\nYou can only send a message every ${wait} seconds.\nModerators can type \`speedup\` to end early.**`);
    }

    help = "Slowdown chat.";
    userPerm = "MANAGE_GUILD";
    botPerm = "MANAGE_ROLES";
    args = [{
        type: "duration",
        info: "The duration of the slowdown",
        example: "10m",
        min: 10 * TIME.second,
        max: 10 * TIME.day
    }, {
        type: "number",
        info: "The number of seconds between each message.",
        example: "12",
        min: 5,
        max: 20,
        default: 10
    }];
}

function endSlowmode(chan, col, unlock, role, endTimer) {
    chan.send("**Slowmode has ended.**");
    col.stop();
    unlock.stop();
    role.delete("nitro-slowmode");
    if (endTimer) clearTimeout(endTimer);
}

function collectUnlock(channel, time) {
    const filter = m => (!m.author.bot && m.channel.permissionsFor(m.author).has("MANAGE_MESSAGES"));
    const col = channel.createMessageCollector(filter, { time: time.milliseconds() });
    return col;
}

function handleUserMessages(channel, role, time, wait) {
    const filter = m => (!m.author.bot && !m.channel.permissionsFor(m.author).has("MANAGE_MESSAGES"));
    const col = channel.createMessageCollector(filter, { time: time.milliseconds() });
    col.on("collect", async m => {
        const member = await m.guild.members.fetch(m.author);
        member.roles.add(role, "nitro-slowmode in " + channel.id);
        setTimeout(() => {
            member.roles.remove(role, "nitro-slowmode in " + channel.id);
        }, wait * 1000);
    });
    return col;
}

async function createRole(channel) {
    const guild = channel.guild;
    const role = await guild.roles.create({
        data: {
            name: "slowmode-" + channel.id,
        },
        reason: "nitro-slowmode in " + channel.id,
    });
    await channel.updateOverwrite(role, {
        SEND_MESSAGES: false
    }, 'Nitro slowdown in ' + channel.id);
    return role;
}

module.exports = SlowModeCommand;