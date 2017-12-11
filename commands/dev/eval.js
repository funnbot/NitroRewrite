const Nitro = require("../../Nitro.js");
const util = require("util");
const snekfetch = require("snekfetch");
const Discord = require("discord.js");
const moment = require("moment");
const Duration = require("duration-js");


module.exports = new Nitro.Command({
    help: "Eval some code.",
    example: "${p}eval 1 + 1",
    argExample: "<code>",
    dm: true,
    coolDown: 0,
    userPerms: 4,
    botPerms: [],

    args: [],

    run: async(message, bot, send) => {
        if (message.author.id !== Nitro.config.FUNNBOT) return
        if (!message.checkSuffix) {
            let txt = evalTxt("Funnbot", "Output", "100000", "An idiot who does not provide code when he evals.")
            return send(txt)
        }
        let processtime,
            start = (new Date()).getTime()
        try {
            let evaled = await eval(message.suffix)
            processtime = (new Date()).getTime() - start
            if (typeof evaled === "object" || typeof evaled === "function") evaled = util.inspect(evaled)
            if (typeof evaled === "string") evaled = evaled.substring(0, 1800).replace("`", "")
            let txt = evalTxt(message.suffix, "Output", processtime, evaled)
            txt = clean(txt)
            return send(txt)
        } catch (e) {
            processtime = (new Date()).getTime() - start
            let txt = evalTxt(message.suffix, "Error", processtime, e)
            txt = clean(txt)
            return send(txt)
        }

    }
})


let evalTxt = (a, b, c, d) => {
    return `
:inbox_tray: **Input:**
\`\`\`js
${a}\`\`\`
:outbox_tray: **${b}:**
\`\`\`${b === "Output" ? "js" : "prolog"}
${d}\`\`\`
\`Execution Time: ${c}MS\``
}

let clean = (t) => {
    let split = Nitro.config.TOKEN.split(".");
    let r = new RegExp(`(${split[1]})|(${split[2]})`, "g");
    t = t.toString().replace(r, "[SECRET]");
    return t
}