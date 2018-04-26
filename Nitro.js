const Sharp = require("sharp");

const Database = require("./Classes/Database.js");
const NitroClient = require("./Classes/NitroClient.js");
const MessageHandler = require("./Classes/MessageHandler.js");
const Cycle = require("./Classes/Cycle.js");
const Image = require("./Classes/Image");
const Paginator = require("./Classes/Paginator.js");
const Command = require("./Classes/Command.js");

const util = require("./Classes/util.js");
const logger = require("./Classes/Logger.js");

module.exports = {
    // Class
    Database,
    NitroClient,
    MessageHandler,
    Cycle,
    Command,
    Image,
    Paginator,
    // Functions
    util,

    ...require("./config.js")
}
