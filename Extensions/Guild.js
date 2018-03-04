const Extension = require("./Extension.js");
const Discord = require("discord.js");
const moment = require("moment");

class Guild extends Extension {
    /**
     * Get or change a user's balance
     * @param {String} id a user's id 
     * @param {Number} amount amount to add, if undefined returns balance;
     * @param {Boolean} [addTo=false] - Wether to add to the balance 
     */
    async balance(id, amount, addTo = false) {
        if (typeof amount !== "number") return;
        let userData = await this.userData();
        let user = userData[id] || {};
        let bal = user.balance || 0;
        if (amount === undefined) return bal;
        bal = addTo ? bal + amount : amount;
        user.balance = bal;
        userData[id] = user;
        await this.userData(userData);
        return bal;
    }

    async triviaWin(id) {
        let userData = await this.userData();
        let user = userData[id] || {};
        if (!user.trivia) user.trivia = 0;
        user.trivia++;
        userData[id] = user;
        await this.userData(userData);
        return user.trivia;
    }

    async userAction(id, action, reason) {
        let userData = await this.userData();
        let user = userData[id] || {};
        if (!user.mem) user.mem = {};
        if (!user.mem[action]) user.mem[action] = []
        user.mem[action].push(reason);
        userData[id] = user;
        await this.userData(userData);
        return user.mem;
    }

    async modAction(id, action) {
        let userData = await this.userData();
        let user = userData[id] || {};
        if (!user.mod) user.mod = {};
        if (!user.mod[action]) user.mod[action] = 0;
        user.mod[action]++;
        userData[id] = user;
        await this.userData(userData);
        return user.mod;
    }
}

module.exports = Guild;