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
const Image = require("./Image");
const Enum = require("./Enum");
const Logger = require("./Logger");
const config = require("../config");

// Load all extensions
const Ex = require("../Extensions");
Ex.ShardClientUtil.extend(Discord.ShardClientUtil);
Ex.MessageEmbed.extend(Discord.MessageEmbed);
Ex.GuildChannel.extend(Discord.GuildChannel);

class NitroClient extends Discord.Client {

    constructor(...args) {
        super(...args);

        this.db = new Database();
        this.modlog = new EventEmitter();
        this.CommandLoader = new CommandLoader();
        this.Embed = Discord.MessageEmbed;
        this.conTimers = new ConsistentTimer(this);
        this.isBeta = config.BETA;

        this.SimpleStorage = {
            guild: {},
            channel: {},
            user: {},
            system: {}
        };

        this.initTime = Date.now();
        this._unhandledRejection();
        this.once("ready", () => {
            this.conTimers.restartTimers();
            // MUSIC IS DISABLED FOR NOW (lavalink not needed as such)
            if (!config.DIS_MUSIC) this.player = new MusicPlayer(this);
            logger.info("Bot online.")
            this.updateStats();
            this.user.setActivity("n!help");
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
        await Image.loadFiles();
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
