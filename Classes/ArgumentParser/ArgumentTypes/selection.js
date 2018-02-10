const defItems = ["yes", 'no'];

class SelectionArgument {
    static parse(val, msg, arg) {
        const items = arg.items !== undefined ? arg.items : defItems;
        val = val.toLowerCase();
        return {
            valid: items.includes(val),
            error: "Input does not match any selection items.",
            val
        }
    }

    static default () {
        throw new Error("No selection generic default()");
    }
}

module.exports = SelectionArgument;