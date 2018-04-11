const Extension = require("./Extension.js");
const moment = require("moment");
const Discord = require("discord.js");

class GuildChannel extends Extension {
    /**
     * @typedef {Object} caseData
     * @property {String} action
     * @property {String} user
     * @property {User} mod
     * @property {String} reason
     * @property {String} [length]
     */

    /**
     * Create a case
     * @param {caseData} caseData 
     * @returns {Promise<Message>}
     */
    async createCase(caseData) {
        const { action, user, mod, reason, length } = caseData;
        const embed = this.client.embed
            .setAuthor(`${mod.tag}`, mod.displayAvatarURL())
            .addBetterField("Action", action)
            .addBetterField("Member", user)
            .addBetterField("Reason", reason)
            .setFooter(moment().format("LLLL"))
            .actionColor(action);
            (!length) || embed.addBetterField("Length", length)
        return await this.send(embed);
    }

    /**
     * Collect a yes or no response.
     * @param {User} user
     * @param {Array<String>} [truthy]
     * @param {Array<String>} [falsy]
     * @param {String|Function} [filter="author"]
     * @param {Number} [time=30000]
     * @returns {Promise<Boolean>}
     */
    async collectMessage(user, truthy = ["yes", "y"], falsy = ["no", "n"], filter = "author", time = 30000) {
        return new Promise((resolve, reject) => {
            if (filter === "author") filter = m => m.author.id === user.id;
            else if (filter === "everyone") filter = m => m.user.bot === false;
            else if (typeof filter === "string") return reject("Invalid filter");
            let collector = this.createMessageCollector(filter, { time })
            collector.on("collect", msg => {
                if ((typeof2(truthy) === "array" && truthy.includes(msg.content)) || (truthy === msg.content)) return collector.stop("true")
                if ((typeof2(falsy) === "array" && falsy.includes(msg.content)) || (falsy === msg.content)) return collector.stop("false")
            })
            collector.on("end", (c, reason) => {
                resolve({
                    time: false,
                    true: true,
                    false: false
                }[reason])
            })
        })
    }

    /**
     * Ask a yes or no in an embed.
     * @param {User} user The user to ask.
     * @param {String} msg The message to ask.
     * @returns {Promise<Message>}
     */
    async ask(user, msg) {
        return await this.client.embed
            .setAuthor(user.username, user.displayAvatarURL())
            .setDescription(msg)
            .actionColor("ban")
            .setFooter("yes/no")
            .sendTo(this);
    }

    /**
     * Check if bot has send message permissions
     */
    hasSendPerms() {
        return this.permissionsFor(this.client).has("SEND_MESSAGES");
    }
}

module.exports = GuildChannel;
