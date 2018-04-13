const Extension = require("./Extension.js");
const { COLORS: { NITRO, ACTION, MEMBERLOG } } = require("../config.js")
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
     * Set a random nitro color.
     * @returns {Object}
     */
    nitroColor() {
        let index = Math.floor(Math.random() * NITRO.length);
        this.setColor(NITRO[index]);
        return this;
    }

    actionColor(action) {
        const color = ACTION[action];
        this.setColor(color);
        return this;
    }

    memberlogColor(join = false) {
        this.setColor(MEMBERLOG[join ? 0 : 1]);
        return this;
    }

}

module.exports = MessageEmbed;