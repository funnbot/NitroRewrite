module.exports = async function(message) {
    console.time("filter");
    let { content, guild, author, channel } = message;
    if (author.bot) return;
    if (!content) return;
    if (!guild) return;

    const filters = await guild.filters();
    const adblock = await guild.adblock();
    const zalgo = await guild.zalgo();

    const exempt = await guild.filterexempt();
    if (exempt[channel.id]) return 0;
    if (exempt[author.id]) return 0;

    const member = await guild.members.fetch(author.id);
    for (let role of member.roles.values())
        if (exempt[role.id]) return 0;

    let levels = [
        {}, // Level 1
        {}, // Level 2
        {} // Level 3
    ];

    const filterValues = Object.values(filters);
    for (let i = 0; i < filterValues.length; i++) {
        const filter = filterValues[i];
        if (!filter) continue;
        const level = filter.level - 1;
        for (let i = 0; i < filter.words.length; i++) {
            let word = filter.words[i];
            levels[level][word] = 1;
        }
    }

    for (let i = 0; i < 3; i++) levels[i] = Object.keys(levels[i]);

    const contentSplit = content.toLowerCase().split(" ");
    const contentLength = contentSplit.length;
    content = "";
    for (let i = 0; i < contentLength; i++)
        if (contentSplit[i]) content += contentSplit[i] + " ";

    // Level 1
    const l1Length = levels[0].length;
    if (l1Length > 0) {
        for (let i = 0; i < l1Length; i++) {
            for (let ii = 0; ii < contentSplit.length; ii++) {
                if (contentSplit[ii] === levels[0][i]) return 1;
            }
        }
    }

    // Adblock
    if (adblock) {
        if (inviteRegex.test(content)) return 1;
    }

    if (zalgo) {

    }

    // Level 2
    content = content.replace(letterLikeReg, c => letterLikeMap[c]);
    const l2Length = levels[1].length;
    if (l2Length > 0) {
        for (let i = 0; i < l2Length; i++) {
            for (let ii = 0; ii < contentSplit.length; ii++) {
                if (contentSplit[ii] === levels[1][i]) return 1;
            }
        }
    }

    // level 3;
    const l3Length = levels[2].length;
    if (l3Length > 0) {
        for (let i = 0; i < l3Length; i++) {
            if (content.includes(levels[2][i])) return 1;
        }
    }
}

const letterLikeMap = {
    "$": "s",
    "℉": "f"
}

const letterLikeReg = /[$℉]/g

const inviteRegex = /discord\.gg\/\w+/;