global.Promise = require("bluebird");

const Discord = require("discord.js");
const Sentry = require("raven")
const Database = require("./Database.js");
const Logger = require("./Logger.js");
const config = require("../config.js");

class NitroClient extends Discord.Client {
    constructor(...args) {
        super(...args);

        Sentry.config(config.SENTRY).install();
        this.sentry = Sentry;

        this.Database = new Database();

        this.SimpleStorage = {
            guild: {},
            channel: {},
            user: {}
        };

        this.mem = new Memcached(config.MEMCACHED);

        this.initTime = Date.now();
    }

    async init() {
        await this.Database.formatDb();
        this.login(config.TOKEN);
    }
}