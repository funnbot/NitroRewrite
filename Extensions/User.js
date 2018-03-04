const config = require("../config");
const Extension = require("./Extension");

class User extends Extension {
    checkPermission(channel, ...perms) {
        for (let i = 0; i < perms.length; i++) {
            if (!this._checkPerm(channel, perms[i])) return false;
        }
        return true;
    }

    _checkPerm(channel, perm) {
        return channel.permissionsFor(this).has(perm);
    }

    get isDeveloper() {
        return this.id === config.FUNNBOT;
    }
}

module.exports = User;