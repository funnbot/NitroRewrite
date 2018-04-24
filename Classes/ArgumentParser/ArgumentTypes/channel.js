const idReg = /^(<@#)?[0-9]{17,19}>?$/;
const numReg = /[^0-9]/g;

class ChannelArgument {
    static parse(val, msg, arg) {
        if (idReg.test(val)) {
            const id = val.replace(numReg, "");
            var [channel, error] = findChannelByID(id, msg);
        } else {
            var [channel, error] = findChannelByString(val, msg);
        }
        return { valid: !!channel, val: channel, error }
    }

    static default (msg) {
        return msg.channel;
    }
}

function findChannelByString(val, msg) {
    let matches = msg.guild.channels.filter(c => c.name.toLowerCase().includes(val.toLowerCase()) && c.type === "text");
    if (matches.size > 1) return [null, matches.size + " channels found, please specify"]; 
    if (matches.size === 1) return [matches.first(), null];
    return [null, "Channel with the name `" + val + "` not found."];
}

function findChannelByID(id, msg) {
    const role = msg.guild.channels.get(id);
    return [role, "Channel with ID `" + id + "` not found."];
}

module.exports = ChannelArgument;