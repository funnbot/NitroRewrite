const { TOKEN, DBNAME, DBPASS, SENTRY, LISTS, SHARDS } = require("./auth.js");

module.exports = {
    PREFIX: "n.",

    DisabledGroups: [],
    DisabledCommands: [],

    TABLES: [
        "guild",
        "user",
        "channel",
        "system"
    ],

    FUNNBOT: "163735744995655680",

    CUR: {
        toString() {
            return "USD"
        },
        code: ":dollar:",
        sym: "$"
    },

    HELP: {
        config: [
            "Configuration",
            "Change basic configuration for Nitro."
        ],
        mod: [
            "Moderation",
            "Manage users who are acting up."
        ],
        /*games: [
            "Games",
            "Play games with Nitro."
        ],
        fun: [
            "Fun",
            "Silly and random commands."
        ],*/
        image: [
            "Image",
            "Memes and image processing."
        ],
        memberlog: [
            "Member Log",
            "Welcome and say goodbye to users."
        ],
        donator: [
            "Donator",
            "View commands made for supporters."
        ],
        poll: [
            "Polls",
            "Create custom polls for users to vote on."
        ],
        tag: [
            "Tags",
            "Store custom text and make it easy to access."
        ],
        irc: [
            "IRC",
            "Send messages to other servers."
        ],
        economy: [
            "Economy",
            "Manage your money."
        ],
        trivia: [
            "Trivia",
            "Play trivia against your friends."
        ],
        help: [
            "Tutorials",
            "Learn how to use Nitro."
        ]
    },
    //The "Companies" and their keys used in stock market
    STOCKS: {
        FunnCorp: {
            key: "FNN",
            base: 38.90,
        },
        Nitro: {
            key: "NTO",
            base: 11.41
        },
        MopBot: {
            key: "MPB",
            base: 9.16
        },
        Discord: {
            key: "DSC",
            base: 5.98
        },
        Pancake: {
            key: "PAN",
            base: 3.91
        },
        Martin: {
            key: "MTN",
            base: 1.62
        },
        Alfred: {
            key: "ALF",
            base: 0.55
        }
    },
    //Numbers
    NUMBERS: [
        ":zero:",
        ":one:",
        ":two:",
        ":three:",
        ":four:",
        ":five:",
        ":six:",
        ":seven:",
        ":eight:",
        ":nine:",
        ":one::zero:",
        ":one::one:",
        ":one::two:",
        ":one::three:",
        ":one::four:",
        ":one::five:",
        ":one::six:",
        ":one::seven:",
        ":one::eight:",
        ":one::nine:",
        ":two::zero:",
        ":two::one:",
        ":two::two:",
        ":two::three:",
        ":two::four:",
        ":two::five:"
    ],
    //Map permission names to a easier to read format
    PERMISSIONS: {
        ADMINISTRATOR: "Administrator",
        CREATE_INSTANT_INVITE: "Create Instant Invite",
        KICK_MEMBERS: "Kick Members",
        BAN_MEMBERS: "Ban Members",
        MANAGE_CHANNELS: "Manage Channels",
        MANAGE_GUILD: "Manage Server",
        ADD_REACTIONS: "Add Reactions",
        VIEW_AUDIT_LOG: "View Audit Log",
        READ_MESSAGES: "Read Messages",
        SEND_MESSAGES: "Send Messages",
        SEND_TTS_MESSAGES: "Send TTS Messages",
        MANAGE_MESSAGES: "Manage Messages",
        EMBED_LINKS: "Embed Links",
        ATTACH_FILES: "Attach Files",
        READ_MESSAGE_HISTORY: "Read Message History",
        MENTION_EVERYONE: "Mention Everyone",
        USE_EXTERNAL_EMOJIS: "Use External Emojis",
        CONNECT: "Voice Connect",
        SPEAK: "Voice Speak",
        MUTE_MEMBERS: "Voice Mute Members",
        DEAFEN_MEMBERS: "Voice Deafen Members",
        MOVE_MEMBERS: "Voice Move Members",
        USE_VAD: "Use Voice Activity",
        CHANGE_NICKNAME: "Change Nickname",
        MANAGE_NICKNAMES: "Manage Nicknames",
        MANAGE_ROLES: "Manage Roles",
        MANAGE_WEBHOOKS: "Manage Webhooks",
        MANAGE_EMOJIS: "Manage Emojis"
    },
    //Colors used in embed.randomColor
    COLORS: [
        "#03A9F4",
        "#039BE5",
        "#0288D1",
        "#0277BD",
        "#2196F3",
        "#1E88E5",
        "#1976D2",
        "#2962FF",
        "#448AFF",
        "#2979FF",
        "#2196F3",
        "#1E88E5",
        "#1976D2",
        "#1565C0",
        "#0091EA"
    ],

    //Auth stuff
    TOKEN,
    DBNAME,
    DBPASS,
    SENTRY,
    SHARDS,
    LISTS,
}