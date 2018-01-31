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
 * @property {Number} [cooldown=1] - Command cooldown in seconds.
 * @property {Array<ArgumentOptions>} [args=[]] - Command arguments.
 * @property {Number} [userPerm=0] - Required permission 0-User, 1-Mod, 2-Admin, 3-Nitro Commander, 4-Dev
 * @property {Array<String>} [botPerms=[]] - Required bot permissions to execute.
 * @property {Array<String>} [alias=[]] - Command aliases.
 * @property {(Function|String)} run - The command code.
 */

const Locale = new (require("./Locale/index.js"));

class Command {
    constructor() {
        this.validateOptions();
    }

    validateOptions() {
        const opts = this.options();
        this.help = opts.help || "None";
        this.example = opts.example || "";

        this.dm = opts.dm || false
        this.cooldown = opts.cooldown || 1
        this.args = opts.args || []

        this.userPerm = opts.userPerm || 0
        this.botPerms = opts.botPerms || []

        this.alias = opts.alias || []
        delete this.options;
    }   

    async exec(message) {
        this.message = message;
        this.bot = message.client;
        // Define the language
        Locale.setLang(message.guild ? message.guild.locale : "en");
        this.t = Locale;
        // Send shortcut
        this.send = message.send;
        try {
            await this.run(this);
        } catch (e) {
            await this.error(this, e);
        }
    }

    async run(args) { return; }
    async error(args, error) { return; }
    options() { return {}}

}

module.exports = Command;