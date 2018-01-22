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
 */

/**
 * Command options.
 * @typedef {Object} CommandOptions
 * @property {String} [help="The help message is missing."] - Help message.
 * @property {String} [example="There is no example."] - Example usage.
 * @property {String} [argExample=""] - Required arguments.
 * @property {Boolean} [dm=false] - Allowed in DM channels.
 * @property {Number} [coolDown=1] - Command cooldown in seconds.
 * @property {Array<ArgumentOptions>} [args=[]] - Command arguments.
 * @property {Number} [perm=0] - Required permission 0-User, 1-Mod, 2-Admin, 3-Nitro Commander, 4-Dev
 * @property {Array<String>} [botPerms=[]] - Required bot permissions to execute.
 * @property {Array<String>} [alias=[]] - Command aliases.
 * @property {(Function|String)} run - The command code.
 */

/**
 * Create a nitro command.
 * @class
 */
class Command {
    /**
     * Creates an instance of Command.
     * @param {CommandOptions} options - Command Options
     */
    constructor(options) {
        this.help = options.help || "The help message is missing."
        this.help += this.help.endsWith(".") ? "" : "."
        this.example = options.example || options.usage || "There is no example."
        this.argExample = options.argExample || options.paramExample || ""

        this.dm = options.dm || false
        this.coolDown = options.coolDown || options.cooldown || 1
        this.args = options.args || options.argumentHandler || []

        this.perm = options.userPerms || options.perm || 0
        this.botPerms = options.botPerms || options.botperms || []

        this.alias = options.alias || []

        this.runCommand = options.run
        if (!this.runCommand) throw new Error("Command function undefined")
    }

    async run(message, bot, send, t) {
        if (typeof this.runCommand === "string") send(this.runCommand).catch(logger.warn)
        else if (typeof this.runCommand === "function") {
            try {
                if (this.args.length > 0) {
                    let handleArguments = await bot.ArgumentHandler.run(message, this.args)
                    if (handleArguments == null) return
                    message = handleArguments
                }
                message.channel.startTyping()
                await this.runCommand(message, bot, send, t)
                message.channel.stopTyping()
            } catch (err) {
                send("Command Error, Please alert the developer.").catch(logger.warn)
                logger.err(message.command + " - " + err.stack)
            }
        } else throw new Error("Invalid command type")
    }
}

module.exports = Command;