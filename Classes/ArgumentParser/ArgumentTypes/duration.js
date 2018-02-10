const Duration = require("duration-js");

const def = Duration.minute

const defMin = def * 1
const defMax = Duration.day * 1;

class DurationArgument {
    static args(a) {
        a.min = a.min !== undefined ? a.min : defMin;
        a.max = a.max !== undefined ? a.max : defMax;
        return a;
    }

    static parse(val, _, arg) {
        let error, dur, valid;
        try {
            dur = new Duration(val);
        } catch (e) {
            return { error: "Invalid duration format: " + val, valid };
        }
        if (dur < arg.min) error = "Duration too short.";
        if (dur > arg.max) error = "Duration too long.";
        return { val: dur, error, valid: !error};
    }

    static default () {
        return def;
    }
}

module.exports = DurationArgument;