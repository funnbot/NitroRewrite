const { Command } = require("../../Nitro");

class LockDownCommand extends Command {

    async run({ message, bot, reply, t }) {
        const ms = message.args[0];
        const role = (message.args[1] || message.guild).id;

        const overwrites = message.channel.permissionOverwrites.get(role) || {};
        let current = null;
        if (overwrites.allowed.has("SEND_MESSAGES")) current = true;
        else if (overwrites.denied.has("SEND_MESSAGES")) current = false;

        await message.channel.overwritePermissions(role, { SEND_MESSAGES: false });
        await reply.warn(`Channel locked down for ${ms.toString()}.`, ' type `unlock` to end the lockdown.');

        async function end() {
            await message.channel.overwritePermissions(role, { SEND_MESSAGES: current });
            await reply.succ("Lockdown has ended.");
            c.stop();
        }

        const timer = setTimeout(end, ms.milliseconds());

        const filt = m => m.authorPerm("MANAGE_CHANNEL");
        const c = message.channel.createMessageCollector(filt, ms.milliseconds());

        c.on("collect", m => {
            if (m.content.toLowerCase() === "unlock") {
                clearTimeout(timer);
                end();
            }
        });
    }

    help = "Lockdown the channel.";
    userPerms = ["MANAGE_CHANNELS"];
    botPerms = ["MANAGE_CHANNELS"];
    args = [{
        type: "duration",
        info: "The amount of time to lockdown for.",
        example: "2m30s",
        min: 1000,
        max: 36e6
    }, {
        type: "role",
        info: "Optional role to lockdown, instead of everyone",
        example: "@Users",
        default: null
    }];
}

module.exports = LockDownCommand;