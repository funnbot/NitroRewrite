class Base {
    constructor() {}

    serialize() {
        const baseKeys = Object.getOwnPropertyNames(this);
        let obj = {};
        for (let key of baseKeys) {
            if (!key.startsWith("base_")) obj[key] = this[key];
        }
        return obj;
    }

    from(obj) {
        
    }
}

module.exports = Base;