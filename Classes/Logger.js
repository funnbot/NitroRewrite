const chalk = require("chalk");
const moment = require("moment");

function msg(lvl, m) {
    return `[${moment().format("HH[:]mm[:]ss")}] ${lvl}: ${m}`; 
}

function log(color, lvl, msgs) {
    console.log(chalk[color](msg(lvl, msgs.join(" "))));
    return console.log
}

class Logger {
    static info(...info) {
        return log("blue", "INFO", info);
    }

    static debug(...debug) {
        return log("white", "DEBUG", debug);
    }

    static warn(...warn) {
        return log("yellow", "WARN", warn);
    }

    static err(...err) {
        return log("red", "ERROR", err);
    }

    static db(...db) {
        return log("green", "DB", db);
    }
}

global.logger = Logger;