module.exports = async function(message) {
    let { content, guild, author, channel } = message;
    if (author.bot) return;
    if (!content) return;
    if (!guild) return;

    const filters = await guild.filters();
    const filterLength = filters.length;

    let content1 = " " + content.replace(/\s+/g, " ") + " ";
    let content2 = content.replace(letterLikeReg, c => letterLikeMap[c]);
    let content3 = content2.replace(/\s+/g, " ");

    for (let i = 0; i < filterLength; i++) {
        const filter = filters[i];
        const wordCount = filter.words.length;
        for (let j = 0; j < wordCount; j++) {
            const word = filter.words[j];
            if (filter.level == 1) {
                if (~content1.indexOf(` ${word} `) && !isExempt(message, filter.exempt)) return 1;
            } else if (filter.level = 2) {
                if (~content2.indexOf(` ${word} `) && !isExempt(message, filter.exempt)) return 1;
            } else {
                if (!isExempt(message, filter.exempt) && content3.includes(word)) return 1;
            }
        }
    }
}

function isExempt(message, exs = {}) {
    if (exs[message.author.id]) return 1;
    if (exs[message.channel.id]) return 1;
    const roles = message.role.keys();
    for (let i = 0; i < roles.size; i++) {
        const role = roles[i];
        if (exs[role]) return 1;
    }
    return 0;
}

const letterLikeMap = {
    "$": "s",
    "℉": "f",
    "0": "o",
    "@": "a",
    ";": "i",
    "|": "l",
}

const letterLikeReg = /[$℉]/g

const inviteRegex = /discord\.gg\/\w+/;