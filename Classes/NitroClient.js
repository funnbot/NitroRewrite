global.Promise = require("bluebird");

const Discord = require("discord.js");
const CommandLoader = require("./CommandLoader");
const Database = require("./Database.js");
const Enum = require("./Enum");
const Logger = require("./Logger.js");
const config = require("../config.js");

// Extensions
const Message = require("../Extensions/Message.js");
const ShardClientUtil = require("../Extensions/ShardClientUtil.js");
const MessageEmbed = require("../Extensions/MessageEmbed.js");
const GuildMember = require("../Extensions/GuildMember");
const User = require("../Extensions/User");
require("../Extensions/NativeExtensions.js");

Message.extend(Discord.Message);
MessageEmbed.extend(Discord.MessageEmbed);
ShardClientUtil.extend(Discord.ShardClientUtil);
GuildMember.extend(Discord.GuildMember);
User.extend(Discord.User);

class NitroClient extends Discord.Client {
    constructor(...args) {
        super(...args);

        this.Database = new Database();
        this.CommandLoader = new CommandLoader();
        this.Embed = Discord.MessageEmbed;

        this.SimpleStorage = {
            guild: {},
            channel: {},
            user: {},
            system: {}
        };

        this.initTime = Date.now();
        this._unhandledRejection();
        this.on("ready", () => {
            logger.info("Bot online.")
        })

    }

    async init() {
        await this.Database.formatDb();
        this.commands = this.CommandLoader.load()
        this.login(config.TOKEN);
    }

    _unhandledRejection() {
        //Log all uncaught exceptions
        process.on("unhandledRejection", (e) => logger.err(e))
    }

    get embed() { return new Discord.MessageEmbed() }
}

module.exports = NitroClient;