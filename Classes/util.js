const formatCur = require("format-currency")
const Discord = require("discord.js")
const { CUR } = require("../config.js")
let formatOpts = {
    symbol: CUR.sym,
    code: CUR.code
}

/**
 * General util functions for Nitro.
 */
class Util {
    /**
     * Clean standard for tag and command names.
     * @param {String} name 
     * @returns {String} 
     */
    static cleanVarName(name) {
        if (!name) return null
        if (name.replace(/\s+/g, "").length < 1) return false
        name = name.replace(/\s/g, "-")
        name = name.toLowerCase()
        return name
    }

    /**
     * Create object from specific props from object.
     * @param {Object} obj 
     * @param {Array} props 
     * @returns {Object}
     */
    static pullProps(obj, props) {
        let pulledProps = {}
        for (let prop of props) {
            pulledProps[prop] = obj[prop]
        }
        return pulledProps
    }

    /**
     * Format currency.
     * @param {Number} [amount=0] 
     * @param {Boolean} noCode 
     * @param {Boolean} noSymbol 
     * @returns {string}
     */
    static formatBal(amount = 0, noCode, noSymbol) {
        formatOpts.format = "%v"
        noCode || (formatOpts.format = formatOpts.format + " %c")
        noSymbol || (formatOpts.format = "%s" + formatOpts.format)
        return formatCur(amount, formatOpts)
    }

    /**
     * Id validator and parser
     * @param {String} i input
     * @returns {Snowflake} Valid discord ID.
     */
    static parseID(i) {
        if (!i) return null
        if (i.id) i = i.id;
        i = i.replace(/[^0-9]/g, "");
        let regex = /^.{17,19}$/;
        if (!regex.test(i)) return null;
        return i;
    }

    /**
     * @private
     */
    static _decimalAdjust(type, value, exp) {
        if (typeof exp === "undefined" || +exp === 0) return Math[type](value);
        value = +value;
        exp = +exp;
        if (isNaN(value) || !(typeof exp === "number" && exp % 1 === 0)) return NaN;
        if (value < 0) return -this._decimalAdjust(type, -value, exp);
        value = value.toString().split("e");
        value = Math[type](+(value[0] + "e" + (value[1] ? (+value[1] - exp) : -exp)));
        value = value.toString().split("e");
        return +(value[0] + "e" + (value[1] ? (+value[1] + exp) : exp));
    }

    static round(num, exp) {
        return this._decimalAdjust("round", num, -(exp))
    }

    static round100(num) {
        return this.round(num, 2)
    }

    static get escapeMarkdown() {
        return Discord.escapeMarkdown
    }

    /**
     * Generate a random number with 100ths place between x and y
     * 
     * @static
     * @param {Number} x - Minimum 
     * @param {Number} y - Maximum
     * @returns {Number}
     * @memberof Util
     */
    static random100(minimum = 1, maximum = 1) {
        return this.round100(Math.random() * (maximum - minimum + 1)) + minimum
    }

    static parseNum(number, minimum, maximum, base = null) {
        number = parseFloat(number) || base;
        number >= minimum || (number = base);
        number <= maximum || (number = base);
        return number;
    }

    

}

module.exports = Util