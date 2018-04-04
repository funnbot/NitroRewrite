const bot = require("../bot.js")
const { STOCKS } = require("../config.js")
const Nitro = require("../Nitro.js")
const Wallet = require("./Wallet")

module.exports = class StockMarket {
    constructor() {
        this.stocks = STOCKS
        this.ms = this._genMappedStocks()
        this._genWorth()

        this._loop()
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
    async sell(member, type, am) {
        const wallet = new Wallet(member);
        let key = STOCKS[type].key;
        let s = this.ms[type] || "Alfred"
        let individualPrice = this.stocks[s].price;
        let price = individualPrice * am;
        let stock = await this._getOwned(member)
        if (!stock[type] || am > stock[type]) return false;
        stock[type] = stock[type] - am
        if (stock[type] === 0) delete stock[type]
        wallet.add(price)
        this._setOwned(member, stock)
        return {"key":key,"val":individualPrice,"cost":price,"qty":am};
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
    async buy(member, type, am) {
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
        return {"key":key,"val":individualPrice,"cost":price,"qty":am};
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

    async _getOwned(member) {
        return member.stock()
    }

    async _setOwned(member, stock) {
        member.stock(stock)
    }

    _adjustWorth() {
        this._map((name, value) => {
            let am = (((Math.random() * 2) -1) * 0.00001) * 1000
            value.previous = value.price
            value.price = value.price + am > 0 ? value.price + am : 0
            return value
        })
    }

    _genWorth() {
        this._map((name, stock) => {
            stock.price = stock.base
            stock.first = stock.base
            stock.previous = 0
            return stock
        })
    }

    _loop() {
        this._adjustWorth()
        //setTimeout(() => this._loop(), 36e5) // 1 hour
        setTimeout(() => this._loop(), 1000) // 1 second
    }

    _genMappedStocks() {
        let key = {}
        this._for((k, v) => {
            key[v.key] = k
        })
        return key
    }

    _map(stock) {
        for (let [key, value] of Object.entries(this.stocks)) {
            this.stocks[key] = stock(key, value)
        }
    }

    _for(stock) {
        for (let [key, value] of Object.entries(this.stocks)) {
            stock(key, value)
        }
    }
    // Fill empty space with space to length
    _sfill(text = "", s = 0, prepend = false) {
        let a = s - text.length > 0 ? s - text.length : 0;
        return prepend ? " ".repeat(a) + text : text + " ".repeat(a);
    }

    _litem(a = []) {
        let i = 0
        for (let v of a) {
            typeof v !== "string" ||
                v.length < i ||
                (i = v.length)
        }
        return i
    }
}
