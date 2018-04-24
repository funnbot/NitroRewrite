Object.defineProperties(String.prototype, {
    log: {
        value: function() {
            console.log(this)
            return this.toString()
        },
    },
    /**
     * Markdown Bold a string.
     * @return {String}
     */
    bold: {
        value: function() {
            return ("**" + this + "**").toString()
        }
    },
    unindent: {
        value: function() {
            const lines = this.split("\n").filter(l => l)
            const base = lines[0].match(/^\s*/)
            return lines.map(l => l.replace(base, "")).join("\n")
        }
    },
    contains: {
        value: function(...texts) {
            for (let t of texts)
                if (this.includes(t)) return true;
        }
    },
    shorten: {
        value: function(length = 2000, append = "") {
            const sh = this.substr(0, length - append.length);
            if (sh.length === this.length) return this.toString();
            else return sh.toString() + append;
        }
    }
})

String.toUpperCase = function(str) {
    return str.toUpperCase();
}

String.toLowerCase = function(str) {
    return str.toLowerCase();
}

Object.defineProperties(Array.prototype, {
    center: {
        value: function() {
            let maxlength = 0;
            let result = "";
            for (let val of this) {
                if (typeof val !== "string") throw new Error("All values must be strings");
                if (val.length > maxlength) maxlength = val.length;
            }
            for (let val of this) {
                if (maxlength > val.length) {
                    let a = maxlength / 2;
                    let b = a - (val.length / 2)
                    result += `${" ".repeat(b)}${val}\n`
                } else result += val + "\n";
            }
            return result;
        }
    }
})

/**
 * Temporary until optional?.chaining?.operator
 * @param {Object} current The object to access
 * @param {...String} props The properties to access
 * @returns {*?}
 */
Object.accessChain = function(current, ...props) {
    while (props.length && current !== undefined)
        current = current[props.shift()]
    return current;
}


Object.removeProperty = function(obj, prop) {
    let result = {};
    for (let key in obj) {
        if (obj.hasOwnProperty(key) && key !== prop)
            result[key] = obj[key];
    }
    return result;
}

/**
 * Removes properties by creating a new object without 
 * them because delete is slow.
 * @param {Object} obj The object to remove from 
 * @param {...String} props The props to remove
 * @returns {Object}
 */
Object.removeProperties = function(obj, ...props) {
    let result = {};
    keys: for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            for (let i = 0; i < props.length; i++) {
                if (key === props[i]) continue keys;
            }
            result[key] = obj[key];
        }
    }
    return result;
}

global.typeof2 = value => {
    return value instanceof Array ? "array" : typeof value;
}

global.promiseTimeout = (time = 1000) => {
    return new Promise(res => setTimeout(res, time))
}