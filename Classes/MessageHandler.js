const CommandLoader = require("./CommandLoader.js")
const Alias = require("./Alias.js")
const CoolDown = require("./Cooldown.js")
const ArgumentHandler = require("./ArgumentHandler/index.js")
const PermissionHandler = require("./PermissionHandler.js")
const EventEmitter = require("events")

class Message extends EventEmitter {
    /**
     * @param {Object} bot
     */
    constructor(bot) {
        super()

        const alias = new Alias(bot.commands)

        const cooldown = new CoolDown()

        bot.ArgumentHandler = ArgumentHandler

        const permissions = new PermissionHandler()

        bot.on("message", async message => {
            if (message.author.bot) return
            message.SetupExtension()
            if (message.guild) message.guild.members.fetch(message.author);
            if (message.channel.type === "text" && !message.member) return;
            this.emit("create", message)
            if (!message.content.startsWith(message.prefix) && !message.content.startsWith(`<@${bot.user.id}>`) && !message.content.startsWith(`<@!${bot.user.id}>`)) return;
            if (message.guild) alias.mapCustom(message.guild.alias);
            message.command = alias.run(message)

            let command = bot.commands[message.command]
            if (!command) return
            if (message.guild && permissions.user(message, bot, command.perm)) return
            if (message.channel.type !== "text" && !command.dm) return
            if (message.channel.type === "text" && message.channel.permissionsFor(bot.user) && !message.channel.permissionsFor(bot.user).has("SEND_MESSAGES"))
                return message.author.send("**I lack permission to send messages in this channel.**").catch(logger.debug);
            if (cooldown && cooldown.run(message, command)) return
            command.run(message, bot, message.send)
        })

        bot.on("messageUpdate", (oldMessage, newMessage) => {
            this.emit("edit", oldMessage, newMessage)
        })

        bot.on("messageDelete", message => {
            this.emit("delete", message)
        })
    }
}

module.exports = Message