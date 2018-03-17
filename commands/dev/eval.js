const { Command, FUNNBOT, TOKEN } = require("../../Nitro.js");
const util = require("util");
const snekfetch = require("snekfetch");
const Discord = require("discord.js");
const moment = require("moment");
const Duration = require("duration-js");

class EvalCommand extends Command {

    async run ({message, bot, reply, t}) {
        if (message.author.id !== FUNNBOT) return
        if (!message.checkSuffix) {
            let txt = evalTxt("Funnbot", "Output", "100000", "An idiot who does not provide code when he evals.")
            return send(txt)
        }
        let processtime,
            start = (new Date()).getTime()
        try {
            const t = `(async () => { ${message.args[0]} })()`
            let evaled = await eval(t);
            processtime = (new Date()).getTime() - start
            if (typeof evaled === "object" || typeof evaled === "function") evaled = util.inspect(evaled)
            if (typeof evaled === "string") evaled = evaled.substring(0, 1800).replace("`", "")
            let txt = evalTxt(message.suffix, "Output", processtime, evaled)
            txt = clean(txt)
            return reply(txt)
        } catch (e) {
            processtime = (new Date()).getTime() - start
            let txt = evalTxt(message.suffix, "Error", processtime, e.stack)
            txt = clean(txt)
            return reply(txt)
        }
    }

        help = "Eval some code";
        usage = "1+1";
        userPerms = ["DEV"];
        cooldown = 0;
        dm = true;
        args = [{
            type: "string",
            info: "code",
            example: "1+1"
        }];
}

module.exports = EvalCommand;

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
    let split = TOKEN.split(".");
    let r = new RegExp(`(${split[1]})|(${split[2]})`, "g");
    t = t.toString().replace(r, "[SECRET]");
    return t
}