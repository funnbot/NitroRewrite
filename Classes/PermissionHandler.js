const { PERMISSIONS, FUNNBOT } = require("../config.js")

class PermissionHandler {
    static run(message, command) {
        const { client, author, channel } = message;
        const { userPerms, botPerms } = command;
        if (this.checkPerms(channel, author, userPerms)) return true;
        if (this.checkPerms(channel, client.user, botPerms, true)) return true;
        return false;
    }

    static checkPerms(channel, user, perms, self = false) {
        const miss = this.missingPerms(channel, user, perms);
        if (miss.length > 0) {
            if (miss.includes("DEV")) return true;
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
        for (let i = 0; i < perms.length; i++) {
            if ((perms[i] === "DEV" && user.id !== FUNNBOT) ||
                !permissions.has(perms[i])) missing.push(perms[i]);
        }
        return missing;
    }

    static runDM(message, command) {
        return command.userPerms.includes("DEV")
    }
}

module.exports = PermissionHandler