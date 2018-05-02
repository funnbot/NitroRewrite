const { Command } = require("../../Nitro");

class RoleMeRolesCommand extends Command {

    async run({ message, bot, reply, t }) {
        const [role] = message.args;
        const roles = await message.guild.rolemeroles();
        let i = roles.indexOf(role.id)
        if (~i) {
            roles.splice(i);
            reply.succ(`Removed \`${role.name}\` from roleme.`)
        } else {
            roles.push(role.id);
            reply.succ(`Added \`${role.name}\` to roleme.`)
        }
        return message.guild.rolemeroles(roles);
    }

    help = "Edit the roles in roleme.";
    userPerm = "MANAGE_GUILD";
    arg = {
        type: "role",
        info: "Role to add or remove.",
        example: "User"
    };
}

module.exports = RoleMeRolesCommand;