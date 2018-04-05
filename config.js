const AUTH = require("./auth");
const PREFIX = "?"

module.exports = {
    PREFIX,

    DisabledGroups: [],
    DisabledCommands: [],

    TABLES: [
        "guild",
        "user",
        "channel",
        "system"
    ],

    ITEMS: {
        guild: {
            prefix: PREFIX,
            alias: {},
            mlchan: false,
            mljoin: false,
            mlleave: false,
            mldm: false,
            locale: "en",
            userData: {},
            tags: {},
            perms: {},
            requserperm: false,
            modlog: false,
            serverlog: false,
            disabledEvents: {}, // Disabled modlog events
            filters: {}, // The filters for messages
            adblock: false, // Block advert messages
            zalgo: false, // Block zalgo messages
            filterexempt: {}, // Ids exempt from the filter
            ar: false, // The auto role
            blacklist: {} // Ids that are blocked from the bot
        },
        user: {
            trivia: 0,
            balance: 0,
        },
        channel: {
            irc: false
        },
        system: {
            timers: []
        },
    },

    LAVALINK_NODES: [
        { host: "localhost", port: 2333, region: "us", password: AUTH.LAVALINK }
    ],

    FUNNBOT: "163735744995655680",

    CUR: {
        toString: () => "USD",
        code: ":dollar:",
        sym: "$"
    },

    MODLOG: mirrorObject([
        "messageEdit"
    ]),

    TIME: {
        millisecond: 1,
        second: 1000,
        minute: 60000,
        hour: 3600000,
        day: 86400000,
        week: 604800000,
        year: 31536000000
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
        games: [
            "Games",
            "Play games with Nitro."
        ],
        fun: [
            "Fun",
            "Silly and random commands."
        ],
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
        /*poll: [
            "Polls",
            "Create custom polls for users to vote on."
        ],*/
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
        /*trivia: [
            "Trivia",
            "Play trivia against your friends."
        ],*/
        help: [
            "Tutorials",
            "Learn how to use Nitro."
        ],
        filter: [
            "Content Filter",
            "Delete messages with swearing or ads."
        ],
        info: [
            "Information",
            "Get statistics of your server."
        ],
        crypto: [
            "Crypto",
            "Encrypt and decrypt things."
        ]

    },
    //The "Companies" and their keys used in stock market
    STOCKS: {
        FNN: {
            name: "FunnCorp",
            base: 1.00
        },
        NTO: {
            name: "Nitro",
            base: 0.70
        },
        MPB: {
            name: "MopBot",
            base: 0.68
        },
        DSC: {
            name: "Discord",
            base: 0.64
        },
        PAN: {
            name: "Pancake",
            base: 0.60
        },
        MTN: {
            name: "Martin",
            base: 0.57
        },
        ALF: {
            name: "Alfred",
            base: 0.35
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
        VIEW_CHANNEL: "View Channel",
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
        MANAGE_EMOJIS: "Manage Emojis",
    },
    //Colors used in embed.randomColor
    COLORS: {
        NITRO: [
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
        ACTION: {
            ban: "#B71C1C",
            tempban: "#D32F2F",
            softban: "#F44336",
            kick: "#F57C00",
            mute: "#FF9800",
            warn: "#FDD835",
            unban: "#76FF03"
        },
        MEMBERLOG: [
            "#76FF03",
            "#D32F2F"
        ]
    },

    ...AUTH
};

function mirrorObject(array) {
    let o = {};
    for (let item of array) {
        o[item] = item;
    }
    return o;
}