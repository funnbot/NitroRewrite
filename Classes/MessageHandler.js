const Discord = require("discord.js");
const EventEmitter = require("events");
const CommandLoader = require("./CommandLoader");
const Alias = require("./Alias.js")
const Cooldown = require("./Cooldown.js")
const ArgumentParser = require("./ArgumentParser")
const PermissionHandler = require("./PermissionHandler.js")

class MessageHandler extends EventEmitter {
    constructor(bot) {
        super();
        this.bot = bot;
        this.alias = new Alias(bot.commands);
        this.cooldown = new Cooldown();

        this.addListeners();
    }

    addListeners() {
        this.bot.on("message", (...d) => this.onMessage.apply(this, d));
        this.bot.on("messageUpdate", (...d) => this.onMessageEdit.apply(this, d))
        this.bot.on("raw", (...d) => this.onRaw.apply(this, d));
    }

    async onRaw(raw) {
        if (raw.t === "MESSAGE_UPDATE") {
            let { author, channel_id, content } = raw.d;
            if (!content) return;
            const channel = this.bot.channels.get(channel_id);
            if (!channel) return;
            const guild = channel.guild;
            if (!guild) return;
            author = await this.bot.users.fetch(author.id);
            if (!author) return;
            const rawEdit = { author, channel, guild, content }
            return this.emit("editRaw", rawEdit);
        }
    }

    async onMessage(message) {
        // Setup the message extensions
        await message.SetupExtension();
        this.emit("new", message);
        return await this.onCommand(message, this);
    }

    async onMessageEdit(oldMessage, message) {
        // Setup the message extensions
        await message.SetupExtension();
        this.emit("edit", oldMessage, message);
        if (message.edits.length <= 3) return await this.onCommand(message, this);
    }

    async onCommand(message, { bot, alias, cooldown }) {
        // Bots cannot run commands
        if (message.author.bot) return;
        // Continue with prefix or mention
        if (!message.content.toLowerCase().startsWith(message.prefix) &&
            !message._mention(message.content)) return;

        if (message.channel.type === "text") return await this.onGuildCommand(message, this);
        else if (message.channel.type === "dm") return await this.onDMCommand(message, this);
    }

    async onGuildCommand(message, { bot, alias, cooldown }) {
        // Always have current member cached
        await message.guild.members.fetch(message.author);
        if (!message.member) return;
        // Map the custom aliases
        alias.mapCustom(await message.guild.alias());
        // Turn alias to normal command
        message.command = alias.run(message);
        // Get the command
        let command = bot.commands[message.command];
        if (!command) return;

        if (PermissionHandler.run(message, command)) return;
        // Check if bot has permission in this channel
        if (!message.channel.permissionsFor(bot.user).has("SEND_MESSAGES")) return;
        // Run command cooldown check
        if (cooldown.run(message, command)) return;
        // Execute
        return await this.runCommand(message, command);
    }

    async onDMCommand(message, { bot, alias, cooldown }) {
        // Turn alias to normal command
        message.command = alias.run(message);
        // Get the command
        const command = bot.commands[message.command];
        // If real command and is allowed in DM
        if (!command || !command.dm) return;
        // If its a developer command
        if (PermissionHandler.runDM(message, command)) return;
        // If i can send messages to the user
        try {
            await message.author.send("\u200B")
        } catch (e) {
            // User has me blocked
            return;
        }
        // Cooldown
        if (cooldown.run(message, command)) return;
        // Execute
        return await this.runCommand(message, command);
    }

    async runCommand(message, command) {
        // Handle arguments
        if (command.args.length > 0) {
            // Assign parsed arguments
            message.args = await ArgumentParser(command, message);
            // Arguments were incorrect
            if (!message.args) return;
        }
        // Execute the command
        return await command.exec(message);
    }
}

module.exports = MessageHandler;