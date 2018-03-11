const { Command, config } = require("../../Nitro");
let modules = config.HELP;

class HelpCommand extends Command {

    async run({ message, bot, reply, t }) {
        const commands = bot.commands;
        const groups = bot.CommandLoader.groups;
        const HELP = config.HELP;

        if (!message.checkSuffix) {
            let fields = [];
            for (let [key, [name, desc]] of Object.entries(HELP)) {
                if (!groups[key]) continue;
                const value = Object.keys(groups[key]).map(c => `**${c}** - ${commands[c].help}`).join("\n");
                fields.push({
                    name: `${name} - ${desc}`,
                    value
                });
            }

            const embed = bot.embed;
            embed.fields = fields;
            embed.setColor("#36393E");

            return message.author.send(embed).catch(logger.debug);
        }

        const [c] = message.args;
        const cmd = c.toLowerCase();
        const command = commands[cmd];
        if (!command) return await reply.fail("Invalid Command");

        const embed = bot.embed
            .setTitle(cmd)
            .setDescription(command.help)
            .nitroColor()
        command.userPerms.length <= 0 || embed.addField("User Perms", command.userPerms.map(p => config.PERMISSIONS[p]))
        command.botPerms.length <= 0 || embed.addField("Bot Perms", command.botPerms.map(p => config.PERMISSIONS[p]))

        let usage = message.prefix + cmd;

        if (command.args.length > 0) {
            let example = message.prefix + cmd;
            let argInfo = [];
            for (let arg of command.args) {
                if (arg.default !== undefined) usage += ` **[${arg.typeText || arg.type}]**`;
                else usage += ` **<${arg.typeText || arg.type}>**`;
                argInfo.push(`**${arg.typeText || arg.type}** - ${arg.info}`);
                example += ` ${arg.example}`
            }
            
            embed.addField("Usage", usage)
                .addField("Arguments", argInfo.join("\n"))
                .addField("Example", '`' + example + '`');

        } else embed.addField("Usage", usage);

        return await reply(embed);
    }

    /* async run ({message, bot, send, t}) {
        let commands = bot.commands;
        let groups = bot.CommandLoader.groups
        if (!message.checkSuffix) {
            let fields = [];
            for (let [key, cmds] of Object.entries(config.HELP)) {
                let value = Object.keys(groups[key]).map(([k, c]) => `• ${k} - ${commands[k].help}`).join("\n");
                fields.push({
                    name: `${val[0]} - ${val[1]}`,
                    value
                })
            }
            let embed = new bot.Embed();
            embed.fields = fields;
            embed.setColor(embed.randomColor);
            return send("", {
                embed
            })
        }

        let cmd = message.args[0];
        let cmds = {};

        for (let all of Object.keys(commands)) {
            for (let c of Object.keys(commands[all])) {
                cmds[c] = commands[all][c]
            }
        }

        if (!cmds[cmd]) return message.fail("Command not found:", cmd);
        let perms = [
            "User",
            "DJ",
            "Moderator",
            "Admin",
            "Nitro Commander",
            "Dev"
        ];
        let c = cmds[cmd];
        let embed = new bot.Embed();
        embed.setTitle(`\`${cmd}\``)
            .addField("Help: ", c.help)
            .addField("Example: ", c.example.replace(/\$\{p\}/g, message.prefix))
            .addField("Arguments: ", c.argExample)
            .addField("Permission: ", perms[c.perm])
            .addField("Alias: ", c.alias.length > 0 ? c.alias.join() : "None")
            .setColor(embed.randomColor);
        return send("", { embed })
    } */

    options() {
        return {
            help: "List all commands",
            usage: "{}help or {}help <command>",
            dm: true,
            alias: ["commands", "cmds"]
        }
    }
}

module.exports = HelpCommand;