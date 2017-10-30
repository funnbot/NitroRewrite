const util = require("../util.js")
const Validate = require("./Validate.js")
const Parse = require("./Parse.js")

//I set min *default* number to 1 because in general cases we dont want negatives.
const def = {
    maxStringLength: 2000,
    maxNumber: 2 ** 31 - 2,
    minNumber: 0,
    maxDuration: 7 * 24 * 60 * 60 * 1000,
    minDuration: 0
}
//Its 31 because thats a 32 bit number, i dont see any reason why we need greater than 32 bit number...
/* Types
globaloptions: time - Default 30 seconds, how long to wait for collector to end, retries - default Infinite, 
how many times to retry getting input if it dosnt validate, optional - If the argument is optional or not if it is then it wont try to collect if non is provided

string - A string of any kind, 
 options: max - The maximum string length
word - Single word that is valid as channel name (or variable name) this is for consistancy
 options: max - the maximum string length
number - A number like amount
 options: max - The maximum number, min - the minimum number
selection - A list of options to select from
 options: opts - The array of options as strings, ignoreCase - If true, it turns input to lowercase before checking against selection
duration - A duration in the duration-js format
 options: max - The maximum duration in Milliseconds, min - The minimum duration in ms, This is in ms because it lets for finer control without selecting
user - Parse a user from mention, id, name, name#discrim
 options: none
role - Parse a role from mention, id, name
 options: none
channel - Parse a channel from mention, id, name
 options: none
custom - A custom match
 options: regex - The regex that it will validate against
 */

//I kindof want to make it, If type = user, role, channel, and they type its name, IF it finds multiples, it will prompt which one they want to select

//We NEED to validate with options... 

module.exports = class Argument {

    constructor(arg, index, message, final) {
        this.prompt = arg.prompt // When first collecting it asks this prompt
        this.retries = arg.retries || "Infinite" // How many times it asks for a argument if it does not validate
        this.optional = arg.optional || false
        this.type = arg.type // The type of the argument string, name, number, user, channel, role, selection, duration
        this.options = arg // Get the rest of the options
        this.index = index // The index of the argument
        this.final = final // Whether this is the last argument in the sequence, if it is then we are reading from a suffixOf, not an arg
        this.message = message
        this.dm = message.channel.type === "text" // If its a DM channel or not
        this.content = final ? this.message.suffixOf(this.index) : this.message.args[this.index]
        this._validateType() // Validate the argument type
    }

    async run() {
        let retries = 0
        //This will loop forever, This is how you can 
        while (true) {
            
            // If the user had the arg or its optional
            if (this._exists()) {
                // Validate the input
                if (!this._validateContent()) {
                    
                    //If it is NOT Valid, start the collector
                    this.content = await this._collect()
                    
                    //If the collecotr returns false, because they ran out of time, or they did cancel cmd, return this object because strings are wierd
                    if (!this.content) return {
                        invalid: true
                    }
                    // If collector returns actual content, it validates again, 
                    if (this._validateContent()) {
                        
                        // If valid, it parses the content and then returns, ending the loop and gives the new arg
                        let parsed = await this._parseContent()
                        if (parsed !== false) {    
                            return parsed
                        } else return {
                            invalid: true
                        }
                    } else this.content = false
                } else {
                    
                    //It exists and its validated, now just parse
                    let parsed = await this._parseContent()
                    if (parsed !== false) {
                        //Parse success
                        return parsed
                    } else return {
                        invalid: true
                    }
                }
            } else {
                if (this.optional) return false
                //If it does not exist then just jump to collecting
                this.content = await this._collect()
                // same as last collect
                if (!this.content) return {
                    invalid: true
                }
                //If collected, validate
                if (this._validateContent()) {
                    
                    //Parse the content
                    let parsed = await this._parseContent()
                    if (parsed !== false) {
                        //return the content
                        return parsed
                    } else return {
                        invalid: true
                    }
                } else this.content = false
            }
            // It will reach this point if, Collected doesnt validate, parse returns false
            // If retries is set check if we've past limit
            if (this.retries !== "Infinite" && this.retries > retries) return {
                invalid: true
            }
            retries++
        }
        return this.content
    }

    _exists() {
        return !!this.content && this.content.replace(/s*/g, "").length > 0
    }

    async _parseContent() {
        return Parse[this.type] ? await Parse[this.type](this.content, this.message) : this.content
    }

    _validateContent() {
        return Validate[this.type](this.content, this.options)
    }

    async _collect() {
        this.message.channel.send(this._formatPrompt())
        let collected
        try {
            collected = await this.message.channel.awaitMessages(m => m.author.id === this.message.author.id, {
                max: 1,
                time: 30000,
                errors: ["time"]
            })
        } catch (err) {
            return false
        }
        let msg = collected.first()
        if (msg) {
            if (msg.content === "cancel") return false
            else return msg.content
        } else return false
    }

    _formatPrompt() {
        return `${this.message.author}, Awaiting Response...\n\n **${this.prompt}**\n Type: **${this.type}**`
    }

    _validateType() {
        if (this.type === undefined) throw new TypeError("Type Undefined")
        let typeSetup = {
            string() {
                this.options.max || (this.options.max = def.maxStringLength)
            },
            word() {
                this.options.max || (this.options.max = def.maxStringLength)
            },
            number() {
                this.options.max !== undefined || (this.options.max = def.maxNumber)
                this.options.min !== undefined || (this.options.min = def.minNumber)
            },
            duration() {
                this.options.max !== undefined || (this.options.max = def.maxDuration)
                this.options.min !== undefined || (this.options.min = def.minDuration)
            },
            selection() {
                this.options.ignoreCase || (this.options.ignoreCase = false)
                if (!this.options.opts) throw new Error("Missing opts option on selection type")
            },
            custom() {
                if (!this.options.regex) throw new TypeError("Missing regex option on custom type")
            }
        }
        if (!this.prompt) throw new Error("Argument missing prompt")
        if (!Validate[this.type]) throw new TypeError("Invalid type " + this.type)
        if (typeSetup[this.type]) typeSetup[this.type].call(this)
    }
}