const chalk = require("chalk");

class Logger {
    static info(info) {
        console.log(chalk.blue(info));
        return console.log
    }

    static warn(warn) {
        console.log(chalk.yellow(warn));
        return console.log
    }

    static err(err) {
        console.log(chalk.red(err))
        return console.log
    }
}

global.logger = Logger;