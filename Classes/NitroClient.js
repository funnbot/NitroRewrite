global.Promise = require("bluebird");

// Modules
const os = require("os");
const EventEmitter = require("events");

// Framework
const Discord = require("discord.js");
const CommandLoader = require("./CommandLoader");
const ConsistentTimer = require("./ConsistentTimer");
const Database = require("./Database");
const MusicPlayer = require("./MusicPlayer");
const Enum = require("./Enum");
const Logger = require("./Logger");
const config = require("../config");

// Extensions
const Message = require("../Extensions/Message.js");
const ShardClientUtil = require("../Extensions/ShardClientUtil.js");
const MessageEmbed = require("../Extensions/MessageEmbed.js");
const GuildMember = require("../Extensions/GuildMember");
const GuildChannel = require("../Extensions/GuildChannel");
const Guild = require("../Extensions/Guild");
const User = require("../Extensions/User");
require("../Extensions/NativeExtensions.js");

class NitroClient extends Discord.Client {

    constructor(...args) {
        super(...args);

        this.db = new Database();
        this.modlog = new EventEmitter();
        this.CommandLoader = new CommandLoader();
        this.Embed = Discord.MessageEmbed;
        this.conTimers = new ConsistentTimer(this);

        this.SimpleStorage = {
            guild: {},
            channel: {},
            user: {},
            system: {}
        };

        this.initTime = Date.now();
        this._unhandledRejection();
        this.once("ready", () => {
            this.player = new MusicPlayer(this);
            logger.info("Bot online.")
            this.updateStats();
        })

    }

    updateStats() {
        this.stats = this.botStats();
        setInterval(() => this.stats = this.botStats(), 10000);
    }

    botStats() {
        return {
            guildCount: this.guilds.size,
            channelCount: this.channels.size,
            userCount: this.users.size,
            cpuUsage: os.loadavg()[1],
            memUsage: process.memoryUsage().rss / 1024 / 1024,
        };
    }

    async init() {
        await this.db.formatDb();
        await this.conTimers.restartTimers();
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