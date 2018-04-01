/**
 * Simple in memory storage.
 * 
 * @class
 */
class SimpleStorage {
    constructor(client, id, type) {
        this.id = id

        this.items = client.SimpleStorage[type];
    }

    /**
     * Set this id to key equal to value
     * 
     * @param {String} key 
     * @param {any} [value=true]
     * @returns {any}
     * @memberof SimpleStorage
     */
    set(key, value = true) {
        if (!this.items[key]) this.items[key] = {}
        return this.items[key][this.id] = value;
    }

    /**
     * Get value of this id set to key
     * 
     * @param {String} key 
     * @returns {any}
     * @memberof SimpleStorage
     */
    get(key) {
        return this.items[key] ? this.items[key][this.id] : undefined;
    }

    /**
     * If this id exists on key
     * @param {any} key 
     * @returns 
     * @memberof SimpleStorage
     */
    exists(key) {
        return this.items[key] ? this.items[key][this.id] !== undefined : !1;
    }

    /**
     * Delete value of this id set to key
     * 
     * @param {String} key 
     * @returns {Boolean}
     * @memberof SimpleStorage
     */
    delete(key) {
        let bool = this.items[key] && this.items[key][this.id];
        this.items[key] && (this.items[key][this.id] = undefined);
        return bool;
    }

    /**
     * Delete all ids set to this key
     * 
     * @param {any} key 
     * @returns 
     * @memberof SimpleStorage
     */
    deleteAll(key) {
        let bool = !!this.items[key];
        delete this.items[key];
        return bool;
    }
}

module.exports = SimpleStorage;