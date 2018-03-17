const { Command } = require("../../Nitro");

class AutoRoleCommand extends Command {

    async run({ message, bot, reply, t }) {
        const [role] = message.args;

        const autorole = await message.guild.ar();
        if (autorole || !role) {
            await message.guild.ar(false);
            return await reply.succ("Disabled autorole.");
        } else {
            const botMember = message.guild.member(
                bot.user);
            if (botMember.roles.highest.position <= role.position)
                return await reply.fail("The roles position is higher than mine, and I am unable to assign it to users.");

            await message.guild.ar(role.id);
            return await reply.succ("Autorole set to: ", role.name);
        }
    }

    help = "Setup a role for when users join.";
    userPerm = "MANAGE_GUILD";
    botPerm = "MANAGE_ROLES";
    alias = "ar";
    arg = {
        type: "role",
        info: "The role to auto assign to new members.",
        example: "@member",
        default: null
    }
}

module.exports = AutoRoleCommand;