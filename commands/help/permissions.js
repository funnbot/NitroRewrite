const { Command } = require("../../Nitro");

class PermissionsCommand extends Command {

    async run({ message, bot, send, t }) {
        let txt = `**Permissions**
        Nitro uses the inbuilt discord permissions to handle command permissions
        For example, to give a moderator permission to ban a user, simply give them the Ban Members permission.
        Because of this, there is usually no need to setup the permissions, and normal users are unable to access destructive commands.
        The permissions required for a command can be seen with \`${message.prefix}help cmd\``.unindent()

        send(txt)
    }

    help = "Tutorial on Nitro's permission system.";
    cooldown = 5
}

module.exports = PermissionsCommand;