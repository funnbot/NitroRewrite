const config = require("../config");
const extend = require("./extend");
const Discord = require("discord.js");

class User extends Discord.User{

    constructor(...args) {
        super(...args);
        this.cool = 1;
        
    }

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

extend(User);