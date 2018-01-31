const { Command } = require("../../Nitro");

class PermissionsCommand extends Command {

    async run({ message, bot, send, t }) {
        let txt = `**Permissions**
        Nitro uses a simple 4 role permission system.
        The roles do not need any special permissions. It is the **name** of the role that matters.
        Roles work in a hierarchy, higher level roles have access to lower level commands.
        
        \`User\` - By default, everyone is a user, and not required to have this role.
        \`DJ\` - Music control commmands.
        \`Moderator\` - Gives access to all moderator commands such as ban and purge.
        \`Admin\` - Almost all server configuration commands such as prefix.
        \`Nitro Commander\` - Complete control of all commands and features.`.unindent()

        send(txt)
    }

    options() {
        return {
            help: "Tutorial on Nitro's permission system.",
            usage: "{}permissions",
            cooldown: 5
        }
    }
}

module.exports = PermissionsCommand;