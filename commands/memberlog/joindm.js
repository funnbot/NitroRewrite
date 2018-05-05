const { Command } = require("../../Nitro");

class JoinDMCommand extends Command {

    async run ({message, bot, reply, t}) {
        const [m] = message.args;
        if (m === "disable") {
            await message.guild.mldm();
            return reply.succ("JoinDM disabled.")
        }
        await message.guild.mldm(m);
        return reply.succ(`Users will be sent \`${m}\``);
    }

    help = "Send a message when a user joins.";
    arg = {
        type: "string",
        info: "The message to send, or `disable`",
        example: "Welcome to the server."
    }
}

module.exports = JoinDMCommand;