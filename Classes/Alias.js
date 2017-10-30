class Alias {
    constructor(commands) {
        this.aliases = {}
        this.mapDefaults(commands)
    }

    mapDefaults(commands) {
        Object.keys(commands).forEach(c => {
            commands[c].alias.forEach(a => {
                this.aliases[a] = c
            })
        })
    }

    mapCustom(custom) {
        Object.keys(custom).forEach(c => {
            this.aliases[c] = custom[c]
        })
    }

    run(message) {
        return this.aliases[message.command] || message.command
    }

}

module.exports = Alias