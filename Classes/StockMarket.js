const { User } = require("discord.js");
const { STOCKS } = require("../config.js")

module.exports = class StockMarket {
    constructor() {
        this.stocks = STOCKS;
        this.ms = this._genMappedStocks();
        this._genWorth();
    }

    /**
     * Sell a stock
     *
     * @param {Object} guild
     * @param {Object} member
     * @param {String} type
     * @param {Number} am
     * @returns {String|Void}
     */
    async sell(user, type, am) {
        const price = this.stocks[type].price;
        const cost = price * am;
        const owned = await user.stocks();
        if (!owned[type] || owned[type] > am) return false;
        owned[type] -= am;
        if (owned[type] === 0) delete owned[type];
        user.wallet.add(price);
        await user.stocks(owned)
        return { key, val: price, cost, qty: am };
    }

    /**
     * Buy a stock
     *
     * @param {Object} guild
     * @param {Object} member
     * @param {String} type
     * @param {Number} am
     * @returns {String|Void}
     */
    async buy(user, type, am) {
        const price = this.stocks[type].price;
        
        
        const wallet = new Wallet(member);
        let key = STOCKS[type].key;
        let bal = await wallet.balance()
        let s = this.ms[type] || "Alfred"
        let individualPrice = this.stocks[s].price;
        let price = individualPrice * am;
        let stock = await this._getOwned(member)
        if (price > bal) return false
        if (!stock[type]) stock[type] = am
        else stock[type] = stock[type] + am
        wallet.sub(price)
        this._setOwned(member, stock)
        return { "key": key, "val": individualPrice, "cost": price, "qty": am };
    }

    /**
     * Get a list of stock prices
     *
     * @param {Object} member
     * @param {Object} user
     * @returns {Array<String>}
     */
    async createList(member) {
        return await this._getOwned(member);
    }

    async getOwned(member) {
        return member.stock()
    }

    async setOwned(member, stock) {
        member.stock(stock)
    }

    adjustPrices() {
        for (let [key, stock] of Object.entries(this.stocks)) {
            const am = (Math.random() * 2) - 1
        }
        this._map((name, value) => {
            let am = (((Math.random() * 2) - 1) * 0.00001) * 1000
            value.previous = value.price
            value.price = value.price + am > 0 ? value.price + am : 0
            return value
        })
    }

    initStocks() {
        for (let [key, stock] of Object.entries(this.stocks)) {
            stock.price = stock.base;
            stock.first = stock.base;
            stock.previous = 0;
            this.stocks[key] = stock;
        }
    }

    loop() {
        this.adjustWorth()
        //setTimeout(() => this._loop(), 36e5) // 1 hour
        setTimeout(() => this.loop(), 1000) // 1 second
    }

    // Fill empty space with space to length
    sfill(text = "", s = 0, prepend = false) {
        let a = s - text.length > 0 ? s - text.length : 0;
        return prepend ? " ".repeat(a) + text : text + " ".repeat(a);
    }
    // Longest string
    litem(a = []) {
        let longest = 0
        for (let i = 0; i < a.length; i++) {
            if (typeof v === "string")
                v.length < longest || (longest = v.length);
        }
        return i
    }
}