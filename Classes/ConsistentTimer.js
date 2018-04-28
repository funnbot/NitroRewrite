class ConsistentTimer {
    constructor(bot) {
        this.bot = bot;

        this.timerData = [];
        this.timers = [];
    }

    async restartTimers() {
        let timerData = await this.bot.timers();
        for (let timer of timerData) {
            if (!this.bot.guilds.has(timer.guild)) continue;
            const now = Date.now(),
                end = timer.start + timer.time;
            if (end < now) {
                this[timer.type](timer);
            } else {
                timer.time = end - now;
                await this.add(timer);
            }
        }
        await this.bot.timers(this.timerData);
    }

    /**
     * @typedef {Object} TimeData
     * @property {String} id
     * @property {Number} time
     * @property {String} type
     * @property {String} guild
     * @property {String} [mute]
     * @property {String} [msg]
     */

    /**
     * Add a timer
     * @param {TimeData} timeData Data about the timer
     */
    async add(timer) {
        timer.start = Date.now();
        this.timerData.push(timer);
        this.timers.push(setTimeout((self) => self[timer.type](timer), timer.time, this));
        await this.bot.timers(this.timerData);
    }

    tempban(timer) {
        const g = this.bot.guilds.get(timer.guild);
        if (!g) return;
        g.members.unban(timer.id, "tempban");
    }

    async mute(timer) {
        const g = this.bot.guilds.get(timer.guild);
        if (!g) return;
        const mem = await g.members.fetch(timer.id);
        if (!mem) return;
        await mem.roles.remove(timer.mute, "tempmute");
    }

    async remind(timer) {
        const mem = await this.bot.users.fetch(timer.id)
        mem.send("Here's your reminder: " + timer.msg).catch(logger.debug);
    }

    // TODO: make member join check this list to add muted.
    getMuted(guildID) {
        let timers = this.timerData[guildID];
        if (!timers) return [];
        return timers.filter(t => t.type === "mute");
    }
}

module.exports = ConsistentTimer;