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
    constructor() {
        this.validateOptions();
    }

    validateOptions() {
        const opts = this.options();
        this.help = opts.help || "None";

        this.dm = opts.dm || false
        this.cooldown = opts.cooldown || 1
        this.args = opts.args || []
        opts.arg ? this.args.push(opts.arg) : 0;

        this.userPerms = (opts.userPerms || []).map(String.toUpperCase)
        opts.userPerm ? this.userPerms.push(opts.userPerm.toUpperCase()) : 0;
        this.botPerms = (opts.botPerms || []).map(String.toUpperCase);
        opts.botPerm ? this.botPerms.push(opts.botPerm.toUpperCase()) : 0;

        this.alias = typeof2(opts.alias) === "array" ? opts.alias : typeof2(opts.alias) === "string" ? [opts.alias] : [];

        this.wip = opts.wip || false;

        delete this.options;
    }

    async exec(message) {
        if (this.wip && !message.author.isDeveloper) return message.channel.send("**This command is a WIP**");

        this.message = message;
        this.bot = message.client;
        this.t = message.t;

        this.send = (...args) => message.channel.send(...args);

        this.reply = setupReply(message);

        logger.cmd(message.command)
        try {
            await this.run(this);
        } catch (e) {
            await this.error(this, e);
        }
        return;
    }

    async run(args) { return; }
    async error(args, error) {
        logger.err(error);
    }
    options() { return {} }

}

function setupReply(message) {
    async function reply(...args) {
        return this.sentMessage = await message.channel.send(...args);
    }
    reply.edit = async function(...args) {
        return this.sentMessage ? await this.sentMessage.edit() : 0;
    }
    reply.succ = async function(...args) {
        return this.sentMessage = await reply(`✅ | **${args.shift()}** ${args.join(" ")}`);
    }
    reply.editSucc = async function(...args) {
        return await reply.edit(`✅ | **${args.shift()}** ${args.join(" ")}`)
    }
    reply.fail = async function(...args) {
        return this.sentMessage = await reply(`⛔ | **${args.shift()}** ${args.join(" ")}`);
    }
    reply.editFail = async function(...args) {
        return await reply.edit(`⛔ | **${args.shift()}** ${args.join(" ")}`)
    }
    reply.warn = async function(...args) {
        return this.sentMessage = await reply(`⚠ | **${args.shift()}** ${args.join(" ")}`);
    }
    reply.editWarn = async function(...args) {
        return await reply.edit(`⚠ | **${args.shift()}** ${args.join(" ")}`)
    }
    reply.succReact = async function() {
        return await message.react('341741537425621002');
    }
    reply.failReact = async function() {
        return await message.react('341741537258110978');
    }
    reply.sentMessage = null;
    return reply;
}

module.exports = Command;