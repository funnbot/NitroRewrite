const Extension = require("./Extension.js");

class Guild extends Extension {
    /**
     * Get or change a user's balance
     * @param {String} id a user's id 
     * @param {Number} amount amount to add, if undefined returns balance;
     * @param {Boolean} [addTo=false] - Wether to add to the balance 
     */
    balance(id, amount, addTo = false) {
        if (typeof val !== "number") return;
        let userData = this.userData();
        let user = userData[id] || {};
        let bal = user["balance"] || 0;
        if (val === undefined) return bal;
        bal = addTo ? bal + val : val;
        user["balance"] = bal;
        userData[id] = user;
        this.userData(userData);
        return bal;
    }
}

module.exports = Guild;