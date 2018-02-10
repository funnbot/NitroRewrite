const chalk = require("chalk");
const moment = require("moment");

function log(color, lvl, msgs) {
    msgs = msgs.map(m => {
        if (m instanceof Error) m = m.stack;
        return m;
    })
    const msg = `[${moment().format("HH[:]mm[:]ss")}] ${lvl}: ${msgs.join(" ")}`; 
    console.log(chalk[color](msg));
    return console.log
}

let tVal = 0;

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

    static cmd(...cmd) {
        return log("cyan", "CMD", cmd);
    }

    static get t() {
        return log("white", "TEST", [tVal++]);
    }

    static set t(val) {
        return log("white", "TEST", [val]);
    }
}

global.logger = Logger;