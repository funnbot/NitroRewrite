let defaultAlias = {};

class Alias {
    constructor(commands) {
        this.aliases = {}
    }

    static mapDefaults(commands) {
        const keys = Object.keys(commands);
        for (let c of keys) {
            const cmd = commands[c];
            if (!cmd.alias) continue;
            for (let a of cmd.alias) {
                defaultAlias[a] = c;
            }
        }
    }

    mapCustom(custom) {
        const keys = Object.keys(custom),
            len = keys.length;
        for (let i = 0; i < len; i++) {
            this.aliases[keys[i]] = custom[keys[i]];
        }
    }

    run(message) {
        return defaultAlias[message.command] ||
            this.aliases[message.command] ||
            message.command
    }

}

module.exports = Alias