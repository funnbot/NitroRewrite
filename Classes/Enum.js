let typeCheck = 0;
class Enum {
    constructor(items) {
        let num = 0;
        if (Array.isArray(items)) {
            for (let i of items) {
                this[i] = `${typeCheck}-${num}`;
                this[`${typeCheck}-${num++}`] = i;
            }
        } else {
            for (let [k, v] of Object.entries(items)) {
                this[k] = `${typeCheck}-${v}`;
                this[`${typeCheck}-${v}`] = k;
            }
        }
        typeCheck++;
    }

    val(item) {
        return item.split("-")[1];
    }
}
module.exports = Enum;