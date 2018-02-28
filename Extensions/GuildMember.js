const Extension = require("./Extension");

class GuildMember extends Extension {
    checkPermission(channel, ...perms) {
        for (let i = 0; i < perms.length; i++) {
            if (!channel.permissionsFor(this).has(perms[i])) return false;
        }
        return true;
    }
}

module.exports = GuildMember;