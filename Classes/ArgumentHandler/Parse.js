const regex = require("./Regex.js")
const escapeMarkdown = require("discord.js").escapeMarkdown
const util = require("../util.js")

module.exports = Parse = {
    number(val) {
        return parseFloat(val)
    },
    user: async(val, message) => {
        if (regex.user.mention.test(val)) {
            let id = val.replace(/[^0-9]/g, "")
            let u = await fetchUser("id", message, id)
            return u
        } else if (regex.id.test(val)) {
            let u = await fetchUser("id", message, val)
            return u
        } else if (regex.user.name.test(val)) {
            let u = await fetchUser("name", message, val)
            return u
        } else return false
    },
    channel: async(val, message) => {
        if (regex.channel.mention.test(val)) {
            let id = val.replace(/[^0-9]/g, "")
            let chan = await fetchChannel("id", message, id)
            return chan
        }
        if (regex.id.test(val)) {
            let chan = await fetchChannel("id", message, val)
            return chan
        }
        if (regex.channel.name.test(val)) {
            let chan = await fetchChannel("name", message, val)
            return chan
        } else return false
    },
    role: async(val, message) => {
        if (regex.role.mention.test(val)) {
            let id = val.replace(/[^0-9]/g, "")
            let r = await fetchRole("id", message, id)
            return r
        }
        if (regex.id.test(val)) {
            let r = await fetchRole("id", message, val)
            return r
        }
        if (regex.role.name.test(val)) {
            let r = await fetchRole("name", message, val)
            return r
        } else return false
    },
    word: (val) => {
        return util.cleanVarName(val);
    }
}

let fetchUser = async(type, message, val) => {
    let bot = message.client
    let guild = message.guild
    if (!guild) return false
    if (type === "id") {
        try {
            let member = await guild.members.fetch(val)
            return member.user || false
        } catch (err) {
            return false
        }
    }
    if (type === "name") {
        try {
            await guild.members.fetch()
            let matches = guild.members.filter(memberFilter(val.toLowerCase()))
            if (matches.size === 0) {
                message.channel.send("User not found.")
                return false
            }
            if (matches.size === 1) return matches.first().user
            else {
                message.channel.send("Multiple users found. Please be more specific.")
                return false
            }
        } catch (err) {
            return false
        }
    }
}

let fetchChannel = (type, message, id) => {
    let guild = message.guild
    if (!guild) return false
    if (type === "id") return guild.channels.get(id)
    if (type === "name") {
        let matches = guild.channels.filter(channelFilter(id.toLowerCase()))
        if (matches.size === 0) {
            message.channel.send("Channel not found.")
            return false
        }
        if (matches.size === 1) return matches.first()
        else {
            message.channel.send("Multiple channels found. Please be more specific")
            return false
        }
    }
}

let fetchRole = (type, message, id) => {
    let guild = message.guild
    if (!guild) return false
    if (type === "id") return guild.roles.get(id)
    if (type === "name") {
        let matches = guild.roles.filter(roleFilter(id.toLowerCase()))
        if (matches.size === 0) {
            message.channel.send("Role not found.")
            return false
        }
        if (matches.size === 1) return matches.first()
        else {
            message.channel.send("Multiple roles found. Please be more specific.")
        }
    }
}

let memberFilter = search => {
    return mem => mem.user.username.toLowerCase().includes(search) ||
        (mem.nickname && mem.nickname.toLowerCase().includes(search)) ||
        (`${mem.user.username.toLowerCase()}#${mem.user.discriminator}`.includes(search))
}

let channelFilter = search => {
    return channel => channel.name.toLowerCase().includes(search) ||
        (channel.name.toLowerCase().replace(/[-_]/g, " ").includes(search))
}

let roleFilter = search => {
    return role => role.name.toLowerCase().includes(search)
}