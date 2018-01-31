global.Promise = require("bluebird");

const Discord = require("discord.js");
const CommandLoader = require("./CommandLoader");
const Enum = require("./Enum");
const Sentry = require("raven");
const Logger = require("./Logger.js");
const config = require("../config.js");

// sDatabase
const Database = require("./Database/index.js");
const Channel = require("./Database/Channel.js");
const Guild = require("./Database/Guild.js");
const System = require("./Database/System.js");
const User = require("./Database/User.js");

Channel.extend(Discord.GuildChannel);
Guild.extend(Discord.Guild);
System.extend(Discord.Client);
User.extend(Discord.User);

// Extensions
const Message = require("../Extensions/Message.js");
const ShardClientUtil = require("../Extensions/ShardClientUtil.js");
const MessageEmbed = require("../Extensions/MessageEmbed.js");
require("../Extensions/NativeExtensions.js");

Message.extend(Discord.Message);
MessageEmbed.extend(Discord.MessageEmbed);
ShardClientUtil.extend(Discord.ShardClientUtil);

// Enums
global.UserPerm = new Enum([ "User", "DJ", "Mod", "Admin", "Commander", "Dev"]);

class NitroClient extends Discord.Client {
    constructor(...args) {
        super(...args);

        Sentry.config(config.SENTRY).install();
        this.sentry = Sentry;
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
        await this.Database.load();
        this.commands = this.CommandLoader.load()
        this.login(config.TOKEN);
    }

    _unhandledRejection() {
        //Log all uncaught exceptions
        process.on("unhandledRejection", (e) => logger.err(e))
    }
}

module.exports = NitroClient;