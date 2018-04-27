const extend = require("./extend.js");
const Discord = require("discord.js");
const { PREFIX } = require("../config");
const Image = require("../Classes/Image");

const Locale = new(require("../Classes/Locale/index.js"));

class Message extends Discord.Message {

    async SetupExtension() {
        this.content = this.cleanInput(this.content);
        this.prefix = this.guild ? await this.guild.prefix() : PREFIX;
        let mentionRegex = new RegExp(`<@!?${this.client.user.id}>`);
        this._cutPrefix = this._mention(this.content) ? this.content.replace(mentionRegex, "").trim() : this.content.slice(this.prefix.length);
        this._contentSplit = this._cutPrefix.split(" ");
        this.command = this._contentSplit.shift();
        this.suffix = this._contentSplit.join(" ").trim();
        [this.args, this.argsTrim] = this.parseArgs(this.suffix);

        this.t = await Locale.setLang(this);
    }

    cleanInput(txt) {
        const inplc = {
            "”": '"',
            "“": '"',
            "’": '"',
            "‘": '"',
            "'": '"'
        }
        txt = txt.replace(/[”“’‘']/g, c => inplc[c]);
        return txt;
    }

    parseArgs(text) {
        // Args before filtering
        let argsRaw = [];
        // if currently reading into a quote
        let inQuote = false;
        // The current index in args
        let current = 0;
        // Loop each character in the text
        let length = text.length;
        for (let i = 0; i < length; i++) {
            // char
            const c = text[i];
            // the next char
            const n = text[i + 1];
            argsRaw[current] = argsRaw[current] || ""
            if (c === '"') { // a quote
                // Set as entering or leaving quote
                inQuote = !inQuote;
                // At a quote bump to next arg, dont add char
                current++;
            } else if (c === " ") { // a space
                // If in a quote, add the space
                if (inQuote) argsRaw[current] += c;
                // If the last space in a line, bump to next arg, extra spaces will be shown at end of arg
                else if (n !== " ") current++;
                else argsRaw[current] += c;
            } else argsRaw[current] += c // Add any other char to current arg
        }
        let args = [];
        let argsTrim = [];
        // Loop over args and remove empty, add to trimmed
        const len = argsRaw.length;
        for (let i = 0; i < len; i++) {
            const trimmed = argsRaw[i].trim();
            // If empty, or was just space
            if (trimmed.length) {
                args.push(argsRaw[i]);
                argsTrim.push(trimmed);
            }
        }
        return [args, argsTrim];
    }

    get checkSuffix() {
        return this.suffix.replace(/\s/g, "").length > 0
    }

    suffixOf(index) {
        return this.argsTrim.slice(index).join(" ");
    }

    send(...args) {
        return this.channel.send(...args);
    }
    succ(...args) {
        return this.send(`✅ | **${args.shift()}** ${args.join(" ")}`);
    }
    fail(...args) {
        return this.send(`⛔ | **${args.shift()}** ${args.join(" ")}`);
    }
    warn(...args) {
        return this.send(`⚠ | **${args.shift()}** ${args.join(" ")}`);
    }
    succReact() {
        return this.react('341741537425621002');
    }
    failReact() {
        return this.react('341741537258110978');
    }

    authorPerm(...perms) {
        return this.author.checkPermission(this.channel, ...perms);
    }

    async fetchImage(avatar = true) {
        let buf = await Image.searchChannel(this.channel);
        if (!avatar) return buf;
        if (!buf) buf = await Image.readUrl(this.author.displayAvatarURL());
        return buf;
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

extend(Message);