const { PERMISSIONS, FUNNBOT } = require("../config.js")

class PermissionHandler {
    user(message, bot, perm = 5) {
        if (message.author.id === FUNNBOT) return false;
        if (!message.guild) {
            if (perm === 5 && message.author.id === FUNNBOT) return false
            else if (perm !== 5) return false
            return true
        }
        if (perm !== 5 && message.author.id === message.guild.ownerID) return false
        let perms = [
            "User",
            "DJ",
            "Moderator",
            "Admin",
            "Nitro Commander",
            "Dev"
        ]
        let has = {
            user: message.member.roles.find("name", perms[0]),
            dj: message.member.roles.find("name", perms[1]),
            mod: message.member.roles.find("name", perms[2]),
            admin: message.member.roles.find("name", perms[3]),
            nitro: message.member.roles.find("name", perms[4])
        }
        if (perm === 0) return false;
        if (perm === 5 && message.author.id === FUNNBOT) return false

        if (perm === 4 && has.nitro) return false
        if (perm === 3 && (has.admin || has.nitro)) return false
        if (perm === 2 && (has.mod || has.admin || has.nitro)) return false
        if (perm === 1 && (has.dj ||has.mod || has.admin || has.nitro)) return false;
        message.channel.send("**This command requires you to have a role named `" + perms[perm] + "`**")
        return true
    }

    bot(message, bot, perms = []) {
        let not = []
        perms.forEach(p => {
            if (!message.channel.permissionsFor(bot.user).has(p)) {
                not.push(p)
            }
        })

        if (not.length > 0) {
            let s = not.length > 1 ? "s" : ""
            not = not.map(p => PERMISSIONS[p])
            message.channel.send("I (Nitro) lack the permission" + s + ": `" + not.join("`, `") + "`")
            return true
        } else return false
    }
}

module.exports = PermissionHandler