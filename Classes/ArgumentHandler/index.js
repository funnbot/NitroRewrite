const Argument = require("./Argument.js")

module.exports = class ArgumentHandler {

    static async run(message, args) {
        if (args.length < 1) return null
        if (message.author.storage.check("argumenthandler")) return null
        message.author.storage.add("argumenthandler")
        for (let [i, arg] of args.entries()) {
            let final = i === args.length - 1
            let Arg = new Argument(arg, i, message, final)
            message.args[i] = await Arg.run()
            if (message.args[i].invalid) {
                message.author.storage.del("argumenthandler")
                message.send("Cancelled")
                return null
            }
        }
        message.author.storage.del("argumenthandler")
        return message
    }

}