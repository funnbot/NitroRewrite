const Extension = require("./Extension.js")
const { COLORS } = require("../config.js")
const moment = require("moment");

class MessageEmbed extends Extension {

    sendTo(channel) {
        return channel.send(this);
    }

    addBetterField(title, content, extraSpace = false) {
        this.description = this.description || "";
        this.description += `${extraSpace ? "\n" : ""}\n**${title}:** ${content}`;
        return this;
    }

    addFieldDef(title, content) {
        title = title || "\u200B";
        content = content || "\u200B";
        return this.addField(title, content);
    }

    /**
     * Get the embed as text.
     */
    asMessage() {
        const n = n => n || " ";
        const timestamp = this.timestamp ? moment(this.timestamp).format("ddd MMM Do, YYYY [at] h:mm A") : "";
        const author = this.author ? this.author.name || " " : " ";
        const footer = this.footer ? this.footer.text || " " : " ";
        const fields = this.fields.map(f => {
            return `\n**${f.name}**\n${f.value}`
        }).join(" ".repeat(5));
        return `**${author}**
**${n(this.title)}**
${n(this.description)}
${fields}

\`${n(footer)} | ${timestamp}\``
            .trim();
    }

    /** 
     * A random embed color.
     * @deprecated
     * @returns {String}
     */
    get randomColor() {
        let index = Math.floor(Math.random() * COLORS.length);
        return COLORS[index];
    }

    /**
     * Set a random nitro color.
     * @returns {Object}
     */
    nitroColor() {
        let index = Math.floor(Math.random() * COLORS.length);
        this.color = parseInt(COLORS[index].replace("#", ""), 16);
        return this;
    }

    actionColor(action) {
        const color = {
            ban: "#B71C1C",
            tempban: "#D32F2F",
            softban: "#F44336",
            kick: "#F57C00",
            mute: "#FF9800",
            warn: "#FDD835",
            unban: "#76FF03"
        }[action];
        this.setColor(color);
        return this;
    }

}

module.exports = MessageEmbed;