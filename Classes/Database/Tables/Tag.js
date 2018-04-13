const Base = require("./Base");

class Tag extends Base {
    /** @type {String} */
    owner = "";
    /** @type {String} */
    content = "";
    /** @type {Date} */
    created = Date.now();
    /** @type {Number} */
    used = 0;
    /** @type {Boolean} */
    server = false;

    
}