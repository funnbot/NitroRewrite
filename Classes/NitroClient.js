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
const MessageEmbed = require("../Extensions/MessageEmbed.js");
require("../Extensions/NativeExtensions.js");

Message.extend(Discord.Message);
MessageEmbed.extend(Discord.MessageEmbed);
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

        this._unhandledRejection();

        this.on("ready", () => {
            this.presence(this);
        })

    }

    presence(bot) {
        bot.user.setPresence({
            activity: {
                name: `Shard ${bot.shard.id + 1}`,
                type: 0,
                state: "Serving Users",
                url: "//https://nitro.ws",
                details: `Users ${bot.users.size} - Guilds ${bot.guilds.size}`,
                application: "264087705124601856",
                timestamps: {
                    start: bot.readyTimestamp,
                    end: bot.readyTimestamp + 6e7
                },
                assets: {
                    largeImage: "nitro",
                    smallImage: "smalllight",
                    largeText: "Nitro is Awesome!",
                    smallText: "Secret Message!"
                }
            }
        }).then(console.log).catch(console.log);
    }

    async init() {
        await this.Database.formatDb();
        await this.Database.load();
        this.commands = this.CommandLoader.load()
        this.login(config.TOKEN);
    }

    _unhandledRejection() {
        //Log all uncaught exceptions
        process.on("unhandledRejection", (e) => logger.err(e.stack))
    }
}

module.exports = NitroClient;

thing = {
    status: 'online',
    activity: {
        name: 'Shard 1',
        type: 'PLAYING',
        url: 'https://nitro.ws',
        details: 'Users 28720 - Guilds 992',
        state: null,
        applicationID: '264087705124601856',
        timestamps: { start: "2017 - 11 - 10 T00: 31: 06.140 Z", end: null },
        party: null,
        assets: {
            largeText: 'Nitro is Awesome!',
            smallText: null,
            largeImage: '378290752423329792',
            smallImage: '378296948651720704'
        }
    }
}