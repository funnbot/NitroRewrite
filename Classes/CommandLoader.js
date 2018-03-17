const { DisabledCommands, DisabledGroups } = require("../config");
const Command = require("./Command");
const fs = require("fs");

class CommandLoader {
    constructor() {
        this.groups = {};
        this.commands = {};

        this.path = "./commands/"
    }

    load() {
        const groups = fs.readdirSync(this.path)
        for (let group of groups) {
            if (DisabledGroups.includes(group)) continue;
            const commands = fs.readdirSync(this.path + group)
            for (let command of commands) {
                const name = command.slice(0, -3);
                if (DisabledCommands.includes(name)) continue;
                this.groups[group] = this.groups[group] || {};
                try {
                    var loaded = require(`.${this.path}${group}/${command}`);
                } catch (e) {
                    logger.warn(e);
                    continue;
                }
                this.commands[name] = this.initialize(loaded);
                this.groups[group][name] = true;
            }
        }
        return this.commands;
    }

    initialize(CommandChild) {
        if (!(CommandChild.prototype instanceof Command)) return;
        CommandChild.prototype.constructor = function(...args) {
            this.super(...args);
        }
        const command = new CommandChild();
        command.validateOptions();
        return command;
    }

    reload(group, command) {
        try {
            delete require.cache[require.resolve(`.${this.path}${group}/${command}`)];
            var loaded = require(`.${this.path}${group}/${command}`);
        } catch (e) {
            logger.warn(e);
            return e;
        }
        this.groups[group] = this.groups[group] || {};
        this.groups[group][command] = true;
        this.commands[command] = this.initialize(loaded);
        logger.info(`Reloaded ${group}/${command}`);
        return null;
    }
}

module.exports = CommandLoader;