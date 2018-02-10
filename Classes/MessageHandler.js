const CommandLoader = require("./CommandLoader");
const Alias = require("./Alias.js")
const Cooldown = require("./Cooldown.js")
const ArgumentParser = require("./ArgumentParser")
const PermissionHandler = require("./PermissionHandler.js")

class MessageHandler {
    constructor(bot) {
        this.bot = bot;
        this.alias = new Alias(bot.commands);
        this.cooldown = new Cooldown();
        this.permissions = new PermissionHandler();

        this.onMessage(this);
    }

    onMessage({ bot }) {
        bot.on("message", async message => {
            await this.onCommand(message, this);
        });
    }

    async onCommand(message, { bot, alias, permissions, cooldown }) {
        // Bots cannot run commands
        if (message.author.bot) return;
        // Setup the message extensions
        await message.SetupExtension();
        // Continue with prefix or mention
        if (!message.content.toLowerCase().startsWith(message.prefix) &&
            !message._mention(message.content)) return;
        if (message.guild) {
            // Always have current member cached
            await message.guild.members.fetch(message.author);
            if (!message.member) return;
            // Map the custom aliases
            alias.mapCustom(await message.guild.alias());
        }
        // Turn alias to normal command
        message.command = alias.run(message);
        // Get the command
        let command = bot.commands[message.command];
        if (!command) return;
        // Check permissions
        if (permissions.user(message, bot, command.userPerm)) return;
        if (message.guild) {
            // Check if bot has permission in this channel
            const perms = message.channel.permissionsFor(bot.user);
            if (perms && !perms.has("SEND_MESSAGES"))
                return message.author.send("**I lack permission to send messages in this channel.**")
                    .catch(logger.debug);
            // Check if dm is allowed
        } else if (!command.dm) return;
        // Run command cooldown check
        if (cooldown.run(message, command)) return;
        // Handle arguments
        if (command.args.length > 0) {
            const args = await ArgumentParser(command, message);
            if (!args) return;
            message.args = args;
        }
        // Execute the command
        await command.exec(message);
    }
}

module.exports = MessageHandler