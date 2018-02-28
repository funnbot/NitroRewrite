const config = require("../config");
const Extension = require("./Extension");

class User extends Extension {
    get isDeveloper() {
        return this.id === config.FUNNBOT;
    }
}

module.exports = User;