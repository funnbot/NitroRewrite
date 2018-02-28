const { PERMISSIONS, FUNNBOT } = require("../config.js")

class PermissionHandler {
    static run(message, command) {
        const { client, author, channel } = message;
        const { userPerms, botPerms } = command;
        if (this.checkPerms(channel, author, userPerms)) return true;
        else if (this.checkPerms(channel, client.user, botPerms, true)) return true;
        else return false;
    }

    static checkPerms(channel, user, perms, self = false) {
        const miss = this.missingPerms(channel, user, perms);
        if (miss.length > 0) {
            const s = miss.length > 1 ? "s" : "";
            const ps = miss.map(p => PERMISSIONS[p]).join(", ");
            const sub = self ? "I (Nitro)" : "You";
            channel.send(`**${sub} lack the permission${s}:** \`${ps}\``);
            return miss;
        } else return false;
    }

    static missingPerms(channel, user, perms) {
        let missing = [];
        const permissions = channel.permissionsFor(user);
        for (let i = 0; i < perms.length; i++)
            if (!permissions.has(perms[i])) missing.push(perms[i]);
        return missing;
    }
}

module.exports = PermissionHandler