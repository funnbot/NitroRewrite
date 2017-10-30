global.Promise = require("bluebird");

const Discord = require("discord.js");
const Sentry = require("raven");
const CommandLoader = require("./CommandLoader.js");
const Logger = require("./Logger.js");
const config = require("../config.js");

//Database
const Database = require("./Database/index.js");
const Channel = require("./Database/Channel.js");
const Guild = require("./Database/Guild.js");
const System = require("./Database/System.js");
const User = require("./Database/User.js");

Channel.extend(Discord.GuildChannel);
Guild.extend(Discord.Guild);
System.extend(Discord.Client);
User.extend(Discord.User);
//Database

//Extensions
const Message = require("../Extensions/Message.js");
const ShardClientUtil = require("../Extensions/ShardClientUtil.js");
require("../Extensions/NativeExtensions.js");

Message.extend(Discord.Message);
ShardClientUtil.extend(Discord.ShardClientUtil);
//Extensions

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
    }

    async init() {
        await this.Database.formatDb();
        await this.Database.load();
        this.commands = this.CommandLoader.load()
        this.login(config.TOKEN);
    }
}

module.exports = NitroClient;