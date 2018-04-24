const { Command } = require("../../Nitro");
const snekfetch = require("snekfetch");
const f = "<:fortunecookie:357743549959372807>"

class FortuneCommand extends Command {

    async run({ message, bot, send, t }) {
        const request = await snekfetch.get("http://fortunecookieapi.herokuapp.com/v1/cookie");
        if (!request || !request.body || !request.body[0]) return send("**Bad Cookie**")
        const cookie = request.body[0];

        const { fortune, lesson, lotto } = cookie;
        if ((!fortune || !fortune.message) ||
            (!lesson || !lesson.english || !lesson.chinese) ||
            (!lotto || !lotto.numbers)) return send("**Bad Cookie**")

        const fm = fortune.message.replace(/\\n|\\r|\\t/g, "");
        const ls = `${lesson.chinese} (${lesson.english})`
        const lot = lotto.numbers.join(" ");

        const txt = [`**${fm}**`, "", `${ls}`, `*${lot}*`].center();

        const msg = await send(`${f}`);
        await promiseTimeout(500);
        await msg.edit(`${f}:arrow_right:`);
        await promiseTimeout(500);
        await msg.edit(txt);
    }

    help = "Open a fortune cookie";
    usage = "{}fortune";
    cooldown = 5;
}

module.exports = FortuneCommand;