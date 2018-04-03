const { Structures } = require("discord.js");

function extend(struct) {
    Structures.extend(struct.name, s => struct);
}

module.exports = extend;