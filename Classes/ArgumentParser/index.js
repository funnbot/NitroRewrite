const argumentTypes = require("./ArgumentTypes");

module.exports = async function(command, message) {
    for (let i = 0; i < command.args.length; i++) {
        let arg = command.args[i];
        const m = getText(message, command, arg, i);

        const type = argumentTypes[arg.type] || argumentTypes.string;
        const getDefault = getFunc("default", arg, type);
        const parse = getFunc("parse", arg, type);

        if (type.args) arg = type.args(arg);

        let check = m ? await parse(m, message, arg) : missing();

        let parsed;
        if (check.valid) parsed = check.val;
        else if (arg.default !== undefined && check.empty) parsed = getDefault(message);
        else return invalidArg(message, command, i, check.error);

        message.args[i] = parsed;
    }
    return message.args;
}

function missing() {
    return { valid: false, error: "Missing argument.", empty: true }
}

function invalidArg(message, command, argIndex = -1, invalidText = false) {
    let txt = `**Usage:** ${message.prefix}${message.command} `;
    let ex = `**Example:** \`${message.prefix}${message.command} `;
    let argInfo = [];
    for (let i = 0; i < command.args.length; i++) {
        let arg = command.args[i];
        if (i == argIndex) {
            if (arg.default !== undefined) txt += `**[${arg.typeText || arg.type}]** `;
            else txt += `**<${arg.typeText || arg.type}>** `;
            argInfo.push(`**${arg.typeText || arg.type}** - ${arg.info}`);
        } else {
            if (arg.default !== undefined) txt += `[${arg.type}] `;
            else txt += `<${arg.typeText || arg.type}> `;
            argInfo.push(`${arg.typeText || arg.type} - *${arg.info}*`);
        }
        ex += `${arg.example} `;
    }
    ex += "`";
    const dings = `< > - required arg, [] - optional arg`
    const m = `${invalidText ? `**${invalidText}**\n` : ``}${txt}\n${argInfo.join("\n")}\n\n${ex}\n${dings}`;
    message.channel.send(m);
}

function getText(message, command, arg, i) {
    const isLast = i === command.args.length - 1;
    const rest = message.suffixOf(i);

    return isLast && !arg.endWithoutRest ? rest : message.args[i];
}

function getFunc(name, arg, type) {
    const defOnly = name === "default" ? true : undefined;
    return arg[name] === defOnly ?
        type[name] : typeof arg[name] === "function" ?
        arg[name] : () => arg[name];
}