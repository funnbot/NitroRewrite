const defMin = 1;
const defMax = 1900;

class StringArgument {
    static args(a) {
        a.min = a.min !== undefined ? a.min : defMin;
        a.max = a.max !== undefined ? a.max : defMax;
        return a;
    }

    static parse(val, msg, arg) {
        return {
            valid: val.length >= arg.min && val.length <= arg.max,
            error: "Invalid string length",
            val
        }
    }

    static default () { return " "; }
}

module.exports = StringArgument;