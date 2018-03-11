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
            return this.substr(0, length - append.length) + append;
        }
    }
})

String.toUpperCase = function(str) {
    return str.toUpperCase();
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

function typeof2(value) {
    return value instanceof Array ? "array" : typeof value;
}

function betterFor(iterator, callback) {
    let type = typeof2(iterator), iterations;
    if (type === "object") iterations = Object.keys(iterator).length;
    else if (type === "array" || type === "string") iterations = iterator.length;
    else if (type === "number") iterations = iterator;
    else throw new Error("INVALID_ITERATOR_TYPE: " + type);

    let i = 0;
    while (i < iterations) {
        
    }
}

function forOf(iter, callback) {
    typeof2(iter) !== "object" || (iter = Object.entries(iter));
    let iterations = iter.length === undefined ? iter : iter.length
    let index = 0;
    console.log(iter)
    while (index < iterations) {
        let result = typeof2(iter) === "array" ? [iter[index], index] : [index]
        callback(...result)
        index++;
    }
}

async function forOfAsync(iter, callback) {
    typeof2(iter) !== "object" || (iter = Object.entries(iter));
    let iterations = iter.length || iter
    let index = 0;
    while (index < iterations) {
        console.log(index)
        const result = [iter[index], index] || [index]
        await callback(result)
        index++;
    }
}

function timeoutGlobal(time = 1000) {
    return new Promise(res => setTimeout(res, time))
}

Object.defineProperties(global, { forOf: { value: forOf }, forOfA: { value: forOfAsync }, typeof2: { value: typeof2 }, timeout: { value: timeoutGlobal } })