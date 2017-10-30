const Nitro = require("../../Nitro.js")
const snekfetch = require("snekfetch");
const f = "<:fortunecookie:357743549959372807>"

module.exports = new Nitro.Command({
    help: "Read your fortune.",
    example: "${p}fortune",
    cooldown: 2,

    run: async(message, bot, send) => {
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

        const txt = [`**${fm}**`, "",`${ls}`, `*${lot}*`].center();

        const msg = await send(`${f}`);
        await timeout(500);
        await msg.edit(`${f}:arrow_right:`);
        await timeout(500);
        await msg.edit(txt);
    }
})