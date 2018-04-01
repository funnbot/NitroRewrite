class ConsistentTimer {
    constructor(bot) {
        this.bot = bot;

        this.timerData = [];
        this.timers = [];
    }

    async restartTimers() {
        this.timerData = await this.bot.timers();
        for (let timer of this.timerData) {
            if (!this.bot.guilds.has(timer.guild)) continue;
            const now = Date.now(),
                end = timer.s + timer.l;
            if (end < now) {
                this[timer.type](timer.guild, id, timer.m);
            } else {
                const left = end - now;
                await this.add(id, left, timer.type);
            }
        }
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
        this.timerData.push({
            start: Date.now(),
            ...timer
        });
        this.timers.push(setTimeout(() => this[timer.type](timer), timer.time));
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