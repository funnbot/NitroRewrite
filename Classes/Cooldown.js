class Cooldown {
    constructor() {
        this.cmds = {};
    }

    run(message, command) {
        let check = this.check(message.author.id, message.command, command.cooldown);
        if (check) {
            message.channel.send("**Cooldown:** Please wait " + check / 1000 + " seconds before using this command.").then(m => m.delete({ timeout: check }));
            return true;
        }
    }

    check(id, command, cooldown) {
        let valid = null;
        let date = Date.now();
        if (!this.cmds[command]) this.cmds[command] = {};
        let user = this.cmds[command][id];
        if (user) {
            let total = user.date + (user.cooldown * 1000);
            total > date ? valid = total - date : delete this.cmds[command][id];
        } else {
            this.cmds[command][id] = { date, cooldown };
        }
        return valid;
    }
}

module.exports = Cooldown;

