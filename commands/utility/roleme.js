const { Command } = require("../../Nitro");

class RoleMeCommand extends Command {

    async run({ message, bot, reply, t }) {
        const [role] = message.args;
        const roles = await message.guild.rolemeroles();
        if (!roles.includes(role.id)) return reply.fail(`\`${role.name}\` is not assignable.`);
        if (!message.member.roles.has(role.id)) {
            try {
                await message.member.roles.add(role);
                return reply.succ(`Assigned \`${role.name}\``);
            } catch {
                return reply.fail(`I don't have permission to assign \`${role.name}\`.`);
            }
        } else {
            try {
                await message.member.roles.remove(role);
                return reply.succ(`Removed \`${role.name}\``);
            } catch {
                return reply.fail(`I don't have permissions to remove \`${role.name}\``);
            }
        }
    }

    help = "Assign yourself a role.";
    alias = "iam";
    arg = {
        type: "role",
        info: "The role to assign.",
        example: "User"
    }
}

module.exports = RoleMeCommand;