    const { Command } = require("../../Nitro");
    
    class AddUserCommand extends Command {
    
        async run ({message, bot, send, t}) {
            send("test")
        }
    
        options() { return {
            help: "Add a user to a permission group",
            usage: "{}adduser Funnbot admin",
            alias: ["addtogroup"],
            args: [
                {
                    type: "user",
                    info: "The user to add",
                    example: "Funnbot"
                },
                {
                    type: "selection",
                    info: ""
                }
            ]
        }}
    }
    
    module.exports = AddUserCommand;