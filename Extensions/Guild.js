const extend = require("./extend.js");
const Discord = require("discord.js");
const moment = require("moment");

class Guild extends Discord.Guild {
    async getUserData(id) {
        const data = await this.userData();
        return data[id] || {};
    }

    async setUserData(id, user) {
        let data = await this.userData();
        data[id] = user;
        return this.userData(data);
    }

    formatBal(amount) {
        return "$"+ amount +" "+":dollar:";
    }

    async triviaWin(id) {
        let user = await this.getUserData(id);
        if (!user.trivia) user.trivia = 0;
        user.trivia++;
        return this.setUserData(id, user);
    }

    async userAction(id, action, reason) {
        let user = await this.getUserData(id);
        if (!user.mem) user.mem = {};
        if (!user.mem[action]) user.mem[action] = []
        user.mem[action].push(reason);
        return this.setUserData(id, user);
    }

    async modAction(id, action) {
        let user = await this.getUserData(id);
        if (!user.mod) user.mod = {};
        if (!user.mod[action]) user.mod[action] = 0;
        user.mod[action]++;
        return this.setUserData(id, user);
    }
}

extend(Guild);
