const ArgumentParser = require("./ArgumentParser");
const PermissionHandler = require("./PermissionHandler");
const { Message, Client } = require("discord.js");

/**
 * Argument options
 * @typedef {Object} ArgumentOptions
 * @property {(String|(string|word|number|selection|duration|user|role|channel|custom))} type - The argument type
 * @property {String} prompt - Prompted question.
 * @property {Boolean} [optional=false] - If the argument is optional.
 * @property {Number} [time=30] - Collect time in seconds
 * @property {Number} [retries=Infinite] - How many times to collect again.
 * @property {Number} max - Maximum string length or number.
 * @property {Number} min - Minimum number.
 * @property {Array<String>} opts - Selection options.
 * @property {Boolean} [ignoreCase=true] - Ignore selection case.
 * @property {String} regex - Regex for custom type.

/**
 * Command options.
 * @typedef {Object} CommandOptions
 * @property {String} [help="The help message is missing."] - Help message.
 * @property {String} [example="There is no example."] - Example usage.
 * @property {String} [argExample=""] - Required arguments.
 * @property {Boolean} [dm=false] - Allowed in DM channels.
 * @property {Number} [cooldown=1] - Command cooldown in seconds.
 * @property {Array<ArgumentOptions>} [args=[]] - Command arguments.
 * @property {Number} [userPerm=0] - Required permission 0-User, 1-Mod, 2-Admin, 3-Nitro Commander, 4-Dev
 * @property {Array<String>} [botPerms=[]] - Required bot permissions to execute.
 * @property {Array<String>} [alias=[]] - Command aliases.
 * @property {(Function|String)} run - The command code.
 */

class Command {
    validateOptions() {
        this.help = this.help || "None";

        this.dm = this.dm || false
        this.cooldown = this.cooldown || 1
        this.args = this.args || []
        this.arg ? this.args.push(this.arg) : 0;

        this.userPerms = (this.userPerms || []).map(String.toUpperCase)
        this.userPerm ? this.userPerms.push(this.userPerm.toUpperCase()) : 0;
        this.botPerms = (this.botPerms || []).map(String.toUpperCase);
        this.botPerm ? this.botPerms.push(this.botPerm.toUpperCase()) : 0;

        this.alias = this.alias || [];
        typeof this.alias === "string" ? (this.alias = [this.alias]) : 0;

        this.wip = this.wip || false;

        this.onEnable();
    }

    async runSubCommand(name) {
        const cmd = this.sub[name];
        if (cmd.args.length > 0) {
            // Assign parsed arguments
            this.message.args = await ArgumentParser(cmd, this.message);
            // Arguments were incorrect
            if (!this.message.args) return;
        }
        if (this.message.channel.type === "text")
            if (PermissionHandler.run(this.message, cmd)) return;
            else if (PermissionHandler.runDM(this.message, cmd)) return;
        cmd.run(this);
    }

    registerSubCommands(cmds) {
        // Redefine info for all the subcommands
        this.args[0].info = "";
        this.args[0].items = [];

        this.sub = {};
        for (let [name, CommandSubChild] of Object.entries(cmds)) {
            if (!(CommandSubChild.prototype instanceof Command)) return;
            CommandSubChild.prototype.constructor = function(...args) {
                this.super(...args);
            }
            const command = new CommandSubChild();
            command.validateOptions();
            command.args.unshift({
                type: "string",
                typeText: "sub",
                info: command.help,
                example: name
            })
            this.sub[name] = command;

            this.args[0].info += `\n  ${name} - ${command.help}`;
            this.args[0].items.push(name);
        }
    }

    async exec(message) {
        if (this.wip && !message.author.isDeveloper) return message.channel.send("**This command is a WIP**");

        this.message = message;
        this.bot = message.client;
        this.t = message.t;

        this.send = (...args) => message.channel.send(...args);

        this.reply = setupReply(message);

        logger.cmd(message.command)
        // Save the command usage
        const us = await this.bot.usage();
        us[message.command] = (us[message.command] || 0) + 1;
        await this.bot.usage(us);
        try {
            await this.run(this);
        } catch (e) {
            await this.error(this, e);
        }
        return;
    }

    async onEnable() { return; }
    /**
     * @typedef {Object} RunArguments
     * @prop {Message} message discord message
     * @prop {Client} bot discord client
     * @prop {Object} reply reply handler
     * @prop {Object} t translator
     */
    /**
     * Execute a command
     * @param {RunArguments} args
     * 
     */
    async run(args) { return; }
    async error(args, error) {
        logger.err(error);
    }
    options() { return {} }

}

function setupReply(message) {
    /**
     * Send a plain message
     */
    async function reply(...args) {
        return reply.sent = await message.channel.send(...args);
    }
    /**
     * Edit a previously replied message
     */
    reply.edit = async function(...args) {
        return reply.sent ? await reply.sent.edit(...args) : 0;
    }
    /**
     * Format the message as a success
     */
    reply.succ = async function(...args) {
        return reply.sent = await reply(`✅ | **${args.shift()}** ${args.join(" ")}`);
    }
    /**
     * Edit a message as a success
     */
    reply.editSucc = async function(...args) {
        return await reply.edit(`✅ | **${args.shift()}** ${args.join(" ")}`)
    }
    /**
     * Format a message as failuer
     */
    reply.fail = async function(...args) {
        return reply.sent = await reply(`⛔ | **${args.shift()}** ${args.join(" ")}`);
    }
    /**
     * Edit a message as a failure
     */
    reply.editFail = async function(...args) {
        return await reply.edit(`⛔ | **${args.shift()}** ${args.join(" ")}`)
    }
    /**
     * Format a message as a warning
     */
    reply.warn = async function(...args) {
        return reply.sent = await reply(`⚠ | **${args.shift()}** ${args.join(" ")}`);
    }
    /**
     * Edit a message as a warning
     */
    reply.editWarn = async function(...args) {
        return await reply.edit(`⚠ | **${args.shift()}** ${args.join(" ")}`)
    }
    /**
     * React with a success
     */
    reply.succReact = async function() {
        return await message.react('341741537425621002');
    }
    /**
     * React with a failure
     */
    reply.failReact = async function() {
        return await message.react('341741537258110978');
    }
    return reply;
}

module.exports = Command;