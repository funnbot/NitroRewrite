const defFetch = false;

class FloatArgument {
    static args(a) {
        a.fetch = a.fetch !== undefined ? a.fetch : defFetch;
        return a;
    }

    static parse(val, msg, arg) {
        const self = msg.channel.messages.fetch(msg.id);
    }

    static default () {
        return 0;
    }
}

async function fetchMessages(channel, limit) {
    const ms = await channel.messages.fetch({limit});
    ms.forEach(m => {
        const image = getImage(m);
        if (image) return image;
    })
}

function getImage(message) {
    if (message.attachments.size === 0) return null;
    const as = message.attachments.filter(a => a.width && a.height);
    return as.size > 0 ? as.first() : null;
}

module.exports = FloatArgument;