const Duration = require("duration-js")
const regex = require("./Regex.js")
const util = require("../util.js")

module.exports = Validate = {
    string(val, opts) {
        return val.length <= opts.max && val.length >= 1
    },
    word(val, opts) {
        val = util.cleanVarName(val)
        return val.length <= opts.max && val.length >= 1    
    },
    number(val, opts) {
        val = parseFloat(val);
        return typeof val === "number" && (val >= opts.min && val <= opts.max)
    },
    selection(val, opts) {
        return opts.opts.includes(opts.ignoreCase ? val.toLowerCase() : val)
    },
    duration(val, opts) {
        try {
            new Duration(val)
            return true
        } catch (err) {
            return false
        }
    },
    user(val) {
        return regex.user.name.test(val) || regex.user.mention.test(val) || regex.id.test(val)
    },
    channel(val) {
        return regex.channel.name.test(val) || regex.channel.mention.test(val) || regex.id.test(val)
    },
    role(val) {
        return regex.role.name.test(val) || regex.role.mention.test(val) || regex.id.test(val)
    },
    custom(val, opts) {
        return opts.regex.test(val)
    }
}

