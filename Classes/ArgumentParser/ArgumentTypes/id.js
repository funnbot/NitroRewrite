const idRegex = /^[0-9]{17,19}$/;

class IDArgument {
    static parse(val) {
        return { valid: idRegex.test(val), error: "Invalid ID.", val };
    }

    static default () {
        return null;
    }
}

module.exports = IDArgument;