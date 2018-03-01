const Extension = require("./Extension.js");

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
}

module.exports = Guild;