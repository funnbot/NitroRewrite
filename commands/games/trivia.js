const Nitro = require("../../Nitro.js")
const snekfetch = require("snekfetch")
const h2p = require("html2plaintext")
const stringSim = require("string-similarity")

let categories = {
    "general knowledge": 9,
    books: 10,
    film: 11,
    music: 12,
    musicals: 13,
    television: 14,
    "video games": 15,
    "board games": 16,
    science: 17,
    computers: 18,
    mathematics: 19,
    mythology: 20,
    sports: 21,
    geography: 22,
    history: 23,
    politics: 24,
    art: 25,
    celebrities: 26,
    animals: 27,
    vehicles: 28,
    comics: 29,
    gadgets: 30,
    anime: 31,
    cartoons: 32
}

module.exports = new Nitro.Command({
    help: "Play trivia",
    example: "${p}trivia easy general knowledge",
    argExample: "{category} {difficulty}",
    alias: ["quiz"],
    args: [{
        type: "selection",
        prompt: "What difficulty?",
        opts: ["easy", "medium", "hard", "random"],
        optional: true
    }, {
        type: "selection",
        prompt: "Which category?",
        opts: [...Object.keys(categories), "random"],
        optional: true
    }],

    run: async(message, bot, send) => {
        let diff = message.args[0] || "random"
        let cat = message.args[1] || "random"

        snekfetch.get(genUrl(diff, cat)).then(response => {
            let res = response.body
            if (res.response_code !== 0 || !res.results || !res.results[0]) return message.fail("Api Error")
            let trivia = res.results[0]
            if (!trivia.question ||
                !trivia.correct_answer ||
                !trivia.difficulty ||
                !trivia.category) return message.fail("Api Error")

            trivia.worth = { "easy": 0.50, "medium": 0.75, "hard": 1.00 }[trivia.difficulty] || 0.00

            play(message, bot, send, trivia)

        }).catch(e => {
            console.log(e)
            return message.fail("Api Error")
        })
    }
})

async function play(message, bot, send) {
    if (message.channel.storage.check("trivia")) return message.fail("A game is in progress")
    message.channel.storage.add("trivia")
    let { question, correct_answer, difficulty, category, worth } = trivia
    correct_answer = h2p(correct_answer)

    let embed = new bot.Embed()
    embed.title = "`Trivia`"
    embed.addField("Question", h2p(question))
        .addField("Category", category)
        .addField("Difficulty", difficulty)
        .addField("Reward", Nitro.util.formatBal(worth))
        .setFooter("You have 30 seconds to answer.")
        .nitroColor()
        .setAuthor(message.guild.name, message.guild.iconURL())

    send({ embed })

    let collector = message.channel.createMessageCollector(m => {
        if (m.author.bot) return false
        if (checkAnswer(correct_answer, m.content)) {
            collector.stop("WINNED")
            win(bot, message, m.author, worth)
        }
        return false
    }, { time: 30000 })

    collector.on("end", (c, reason) => {
        message.channel.del("trivia")
        if (reason === "time") {
            return message.fail("Noone guessed in time, the correct answer was:", correct_answer);
            return message.fail("You're all idiots and coudn't guess a simple trivia question, it was actually: " + correct_answer);
        }
    })
}

function win(bot, message, user, worth) {
    message.channel.storage.del("trivia")
    message.succ(`${user.tag} answered the question correctly, here is your reward.`)
    message.guild.balance(message.author.id, worth, true);
    message.author.trivia++;
}

function checkAnswer(correct, input) {
    let c = correct.toLowerCase()
    let i = input.toLowerCase()
    if (stringSim.compareTwoStrings(c, i) > .7) return true
    else return false
}

function genUrl(d, c) {
    let diff = d === "random" ? "" : "&difficulty=" + d
    let cat = c === "random" ? "" : "&category=" + (categories[c])
    return `https://opentdb.com/api.php?amount=1${cat}${diff}&type=multiple`
}