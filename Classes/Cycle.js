/**
 * Easy Cycler.
 * @class Cycler
 */
class Cycler {
    /**
     * Creates an instance of Cycler.
     * @param {Number} [start=1] - The minimum number and starting point
     * @param {Number} [end=10] - The maximum number and ending point where it loops back
     * @memberof Cycler
     */
    constructor(start = 1, end = 10) {
        /**
         * The cycling number
         * @type {Number}
         */
        this.int = start;
        /**
         * The minimum number and starting point
         * @type {Number}
         */
        this.start = start;
        /**
         * The maximum number and ending point where it loops back
         * @type {Number}
         */
        this.end = end;

        this._typeCheck();
    }

    get val() {
        return this.int;
    }

    set val(value) {
        if (value - this.int >= 0) this.inc();
        else this.dec();
    }

    /**
     * Increment the cycler by an amount or 1.
     * @param {Number} [am=1] 
     * @returns {Number}
     */
    inc() {
        if (typeof am !== "number") throw new Error("amount must be a number");
        this.int++
        if (this.int > this.end) {
            const left = this.int - this.end - 1;
            this.int = this.start + left;
        }
        return this.int;
    }

    /**
     * Decrement the cycler by an amount or 1.
     * @param {Number} [am=1] 
     * @returns {Number}
     */
    dec() {
        if (typeof am !== "number") throw new Error("amount must be a number");
        this.int--;
        if (this.int < this.start) {
            const left = this.start - this.int - 1;
            this.int = this.end - left;
        }
        return this.int;
    }

    toString() {
        return this.int;
    }

    /**
     * @private
     */
    _typeCheck() {
        //Cuz offical modules need to be fancy and shit lmfao.
        if (typeof this.int !== "number") throw new Error("start must be a number");
        if (typeof this.end !== "number") throw new Error("end must be a number");
    }
}

module.exports = Cycler;