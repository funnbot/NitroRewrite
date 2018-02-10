const Extension = require("./Extension")
const { PREFIX } = require("../config.js");

const Locale = new (require("../Classes/Locale/index.js"));

class Message extends Extension {

    async SetupExtension() {
        this.content = this.cleanInput(this.content);
        this.prefix = this.guild ? await this.guild.prefix() : PREFIX;
        let mentionRegex = new RegExp(`<@!?${this.client.user.id}>`);
        this._cutPrefix = this._mention(this.content) ? this.content.replace(mentionRegex, "").trim() : this.content.slice(this.prefix.length)
        this._contentSplit = this._cutPrefix.split(" ")
        this._suffixSplit = this._contentSplit.slice(1)
        this.command = this._contentSplit[0]
        this.args = this._suffixSplit.filter(t => t != "")
        this.suffix = this._suffixSplit.join(" ")

        this.t = await Locale.setLang(this)
    }

    cleanInput(txt) {
        txt = txt.replace(/[”“’‘]/g, c => {
            if (c === "”" || c === "“") return '"';
            if (c === "’" || c === "‘") return "'";
        });
        return txt;
    }

    get checkSuffix() {
        return this.suffix.replace(/\s/g, "").length > 0
    }

    suffixOf(index) {
        return this._suffixSplit.slice(index).join(" ").trim()
    }

    get send() {
        return this.channel.send.bind(this.channel)
    }

    async fetchImage(returnAvatarOnFail) {
        try {
            var messages = await this.channel.messages.fetch({ limit: 3 })
        } catch (e) {
            return logger.warn(e);
        }
        for (let m of messages.values()) {
            if (m.attachments.size) {
                let url = m.attachments.first().url;
                if (this._imageUrl(url)) return url;
            }
            if (m.embeds.length) {
                if (m.embeds[0].thumbnail) {
                    let url = m.embeds[0].thumbnail.url;
                    if (this._imageUrl(url)) return url;
                }
            }
        }
        return returnAvatarOnFail ? this.author.displayAvatarURL() : null;
    }

    _imageUrl(url) {
        url = url.trim();
        if (/^<.+>$/.test(url)) url = url.substring(1, -1);
        let ends = /^.+\.(jpg|png|gif|webp)$/.test(url);
        return ends ? url : false;
    }

    _mention(text) {
        return text.startsWith(`<@${this.client.user.id}>`) || text.startsWith(`<@!${this.client.user.id}>`);
    }

    succ(text, data) {
        return this.channel.send(`:white_check_mark: **| ${text.replace(/\*\*/g, "")}** ${data === undefined ? "" : data}`)
    }

    warn(text, data) {
        return this.channel.send(`:warning: **| ${text.replace(/\*\*/g, "")}** ${data === undefined ? "" : data}`)
    }

    fail(text, data) {
        return this.channel.send(`:no_entry_sign: **| ${text.replace(/\*\*/g, "")}** ${data === undefined ? "" : data}`)
    }

    async collectMessage(truthy, falsy, filter, time) {
        return new Promise((resolve, reject) => {
            if (filter === "author") filter = m => m.author.id === this.author.id
            else if (filter === "everyone") filter = m => m.user.bot === false
            else return reject("Filter = author || everyone")
            if (!time) time = 30000
            let collector = this.channel.createMessageCollector(filter, {
                time
            })
            collector.on("collect", msg => {
                if ((typeof truthy === "object" && truthy.includes(msg.content)) || (truthy === msg.content)) return collector.stop("true")
                if ((typeof falsy === "object" && falsy.includes(msg.content)) || (falsy === msg.content)) return collector.stop("false")
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

    async parseUser(u) {

    }

    async parseMember(u) {
        if (/<@\d{17,19}>/.test(u) || /<@!\d{18,21}>/.test(u)) {
            let id = u.replace(/[^1234567890]/g, "")
            try {
                let member = await this.guild.members.fetch(id)
                return member
            } catch (err) {
                return null
            }
        }
        if (/\d{17,19}/.test(u)) {
            let id = u.replace(/[^1234567890]/g, "")
            try {
                let member = await this.guild.members.fetch(id)
                return member
            } catch (err) {
                return null
            }
        }
        if (/^.{2,32}#\d{4}$/.test(u)) {
            let [name, disc] = u.split("#")
            try {
                await this.guild.members.fetch()
                return this.guild.members.find(m => m.user.username.toLowerCase() === name.toLowerCase() && m.user.discriminator === disc)
            } catch (err) {
                return null
            }
        }
        if (/^.{2,32}$/.test(u)) {
            if (u.length < 2) return null
            try {
                await this.guild.members.fetch()
                return this.guild.members.find(m => m.user.username.toLowerCase().includes(u.toLowerCase()) || (m.nickname && m.nickname.toLowerCase().includes(u.toLowerCase())))
            } catch (err) {
                return null
            }
        }
        return null
    }

    async parseRole(u) {
        return null
    }

    async parseChannel(u) {
        if (/<#\d{17,19}>/.test(u)) {
            let id = u.replace(/[^1234567890]/g, "")
            return this.guild.channels.get(id) || false
        }
        if (/\d{17,19}/.test(u)) {
            let id = u.replace(/[^1234567890]/g, "")
            return this.guild.channels.get(id) || false
        }
        if (/^[a-z\-_]{2,100}$/.test(u)) {
            return this.guild.channels.find(c => c.name.toLowerCase().includes(u.toLowerCase()))
        }
        return null
    }

}

module.exports = Message;